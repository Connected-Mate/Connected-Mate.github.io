"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";

/* ------------------------------------------------------------------------------------------------
 * Types
 * ----------------------------------------------------------------------------------------------*/

export type KpiSeries = {
  label: string;
  /** Any CSS colour; without one the line gets the next colour of the A-Team palette. */
  color?: string;
  /** One value per label. */
  values: number[];
};

export type KpiChartProps = {
  title?: string;
  /** Headline value, already formatted. */
  value?: string;
  /** Change against the previous period – green when positive, red when negative. */
  delta?: number;
  labels: string[];
  /** Longer labels for the tooltip header; falls back to labels. */
  tooltipLabels?: string[];
  series: KpiSeries[];
  format?: (n: number) => string;
  footer?: string;
  /** Point that stays highlighted while nobody hovers. */
  defaultIndex?: number;
  className?: string;
};

/* ------------------------------------------------------------------------------------------------
 * Helpers
 * ----------------------------------------------------------------------------------------------*/

const PALETTE_SIZE = 6;
const PLOT_HEIGHT = 128;
const PAD_TOP = 6;

export function compactNumber(n: number) {
  const abs = Math.abs(n);
  const trim = (x: number) => x.toFixed(1).replace(/\.0$/, "");
  if (abs >= 1e9) return `${trim(n / 1e9)}B`;
  if (abs >= 1e6) return `${trim(n / 1e6)}M`;
  if (abs >= 1e3) return `${trim(n / 1e3)}k`;
  return `${Math.round(n)}`;
}

/** Smallest "nice" step (1, 2, 2.5, 3, 5 × 10^k) so that two steps cover the maximum. */
function niceStep(max: number) {
  if (!(max > 0)) return 1;
  const raw = max / 2;
  const power = Math.pow(10, Math.floor(Math.log10(raw)));
  for (const m of [1, 2, 2.5, 3, 5, 10]) {
    if (m * power >= raw) return m * power;
  }
  return 10 * power;
}

/* ------------------------------------------------------------------------------------------------
 * KPI Chart
 * ----------------------------------------------------------------------------------------------*/

export function KpiChart({
  title,
  value,
  delta,
  labels,
  tooltipLabels,
  series,
  format = compactNumber,
  footer,
  defaultIndex,
  className,
}: KpiChartProps) {
  const titleId = useId();
  const liveId = useId();
  const plotRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const [keyIndex, setKeyIndex] = useState<number | null>(null);
  const [closed, setClosed] = useState(false);
  const touchRef = useRef(false);

  const count = labels.length;
  const lines = useMemo(
    () =>
      series.map((line, index) => ({
        ...line,
        paint: line.color ?? `var(--ui-at-kpi-c${(index % PALETTE_SIZE) + 1})`,
        values: labels.map((_, i) => {
          const v = line.values[i];
          return typeof v === "number" && Number.isFinite(v) ? v : null;
        }),
      })),
    [series, labels],
  );

  const max = Math.max(0, ...lines.flatMap((line) => line.values.filter((v): v is number => v !== null)));
  const step = niceStep(max);
  const top = step * 2;
  const ticks = [top, step, 0];

  useEffect(() => {
    const plot = plotRef.current;
    if (!plot) return;
    const measure = () => setWidth(plot.clientWidth);
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(plot);
    return () => observer.disconnect();
  }, []);

  const xAt = (i: number) => (count <= 1 ? width / 2 : (i / (count - 1)) * width);
  const yAt = (v: number) => PAD_TOP + (1 - v / (top || 1)) * (PLOT_HEIGHT - PAD_TOP);

  const clamp = (i: number) => Math.min(count - 1, Math.max(0, i));
  const fallback = typeof defaultIndex === "number" && count > 0 ? clamp(defaultIndex) : null;
  const active = closed ? null : hover ?? keyIndex ?? fallback;

  const indexFromPointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    if (count <= 1 || box.width === 0) return 0;
    return clamp(Math.round(((event.clientX - box.left) / box.width) * (count - 1)));
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" && !touchRef.current) return;
    setClosed(false);
    setHover(indexFromPointer(event));
  };
  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse") return;
    touchRef.current = true;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    setClosed(false);
    setHover(indexFromPointer(event));
  };
  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse") return;
    touchRef.current = false;
    // Keep the tapped point open, like a pinned readout.
    setKeyIndex(hover);
    setHover(null);
  };

  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (count === 0) return;
    const current = active ?? fallback ?? -1;
    let next: number | null = null;
    if (event.key === "ArrowRight") next = clamp(current + 1);
    else if (event.key === "ArrowLeft") next = clamp(current < 0 ? 0 : current - 1);
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = count - 1;
    else if (event.key === "Escape") {
      if (active !== null) {
        event.preventDefault();
        setClosed(true);
        setKeyIndex(null);
      }
      return;
    }
    if (next === null) return;
    event.preventDefault();
    setClosed(false);
    setKeyIndex(next);
  };

  const rows =
    active === null
      ? []
      : lines
          .map((line) => ({ label: line.label, paint: line.paint, v: line.values[active] }))
          .filter((row): row is { label: string; paint: string; v: number } => row.v !== null)
          .sort((a, b) => b.v - a.v);
  const header = active === null ? "" : tooltipLabels?.[active] ?? labels[active] ?? "";
  const announce = active === null ? "" : `${header}: ${rows.map((row) => `${row.label} ${format(row.v)}`).join(", ")}`;

  const guideX = active === null ? 0 : xAt(active);
  const side = active !== null && width > 0 && guideX > width * 0.55 ? "left" : "right";
  const hasDelta = typeof delta === "number" && Number.isFinite(delta);
  const change = hasDelta ? (delta as number) : 0;
  const mid = Math.floor((count - 1) / 2);

  return (
    <section
      className={["ui-at-kpi", className].filter(Boolean).join(" ")}
      aria-labelledby={title ? titleId : undefined}
      aria-label={title ? undefined : "Chart"}
    >
      <style href="ui-at-kpi-chart" precedence="default">
        {css}
      </style>
      {title && (
        <h3 className="ui-at-kpi__title" id={titleId}>
          {title}
        </h3>
      )}
      {(value || hasDelta) && (
        <p className="ui-at-kpi__figure">
          {value && <span className="ui-at-kpi__value">{value}</span>}
          {hasDelta && (
            <span className="ui-at-kpi__delta" data-trend={change < 0 ? "down" : "up"}>
              <span className="ui-at-kpi__sr">{change < 0 ? "down " : "up "}</span>
              {change < 0 ? "−" : "+"}
              {format(Math.abs(change))}
            </span>
          )}
        </p>
      )}

      <div className="ui-at-kpi__chart">
        <div className="ui-at-kpi__axis" aria-hidden="true">
          {ticks.map((tick) => (
            <span key={tick} style={{ top: yAt(tick) }}>
              {format(tick)}
            </span>
          ))}
        </div>

        <div
          ref={plotRef}
          className="ui-at-kpi__plot"
          tabIndex={count > 0 ? 0 : -1}
          role="group"
          aria-roledescription="chart"
          aria-label={`${title ? `${title} chart` : "Chart"} – use the arrow keys to read the values per day`}
          aria-describedby={liveId}
          onPointerMove={onPointerMove}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerLeave={(event) => event.pointerType === "mouse" && setHover(null)}
          onKeyDown={onKeyDown}
          onBlur={() => setKeyIndex(null)}
        >
          {width > 0 && (
            <svg className="ui-at-kpi__svg" width={width} height={PLOT_HEIGHT} aria-hidden="true">
              {ticks.map((tick) => (
                <line key={tick} className="ui-at-kpi__grid" x1={0} x2={width} y1={yAt(tick)} y2={yAt(tick)} />
              ))}
              <g className="ui-at-kpi__lines">
                {lines.map((line) => {
                  let d = "";
                  let pen = false;
                  line.values.forEach((v, i) => {
                    if (v === null) {
                      pen = false;
                      return;
                    }
                    d += `${pen ? "L" : "M"}${xAt(i).toFixed(1)} ${yAt(v).toFixed(1)}`;
                    pen = true;
                  });
                  return (
                    <path
                      key={line.label}
                      d={d}
                      fill="none"
                      stroke={line.paint}
                      strokeWidth={1.75}
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />
                  );
                })}
              </g>
            </svg>
          )}

          {active !== null && width > 0 && (
            <>
              <span className="ui-at-kpi__guide" aria-hidden="true" style={{ transform: `translateX(${guideX}px)` }} />
              {lines.map((line) => {
                const v = line.values[active];
                if (v === null) return null;
                return (
                  <span
                    key={line.label}
                    className="ui-at-kpi__dot"
                    aria-hidden="true"
                    style={{ transform: `translate(${guideX}px, ${yAt(v)}px)`, "--ui-at-kpi-series": line.paint } as CSSProperties}
                  />
                );
              })}
              <div
                className="ui-at-kpi__tip"
                aria-hidden="true"
                data-side={side}
                style={{ transform: `translateX(${guideX}px)` }}
              >
                <div className="ui-at-kpi__tip-card">
                  <p className="ui-at-kpi__tip-head">{header}</p>
                  <ul>
                    {rows.map((row) => (
                      <li key={row.label} style={{ "--ui-at-kpi-series": row.paint } as CSSProperties}>
                        <span className="ui-at-kpi__tip-mark" />
                        <span className="ui-at-kpi__tip-label">{row.label}</span>
                        <span className="ui-at-kpi__tip-value">{format(row.v)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}
          {count === 0 && <p className="ui-at-kpi__empty">No data yet</p>}
        </div>

        <div className="ui-at-kpi__x" aria-hidden="true">
          {count > 0 && <span>{labels[0]}</span>}
          {count > 2 && <span>{labels[mid]}</span>}
          {count > 1 && <span>{labels[count - 1]}</span>}
        </div>
      </div>

      <p className="ui-at-kpi__sr" id={liveId} role="status" aria-live="polite">
        {announce}
      </p>
      {footer && <p className="ui-at-kpi__footer">{footer}</p>}
    </section>
  );
}

/* ------------------------------------------------------------------------------------------------
 * Styles
 * ----------------------------------------------------------------------------------------------*/

const css = /* css */ `
.ui-at-kpi {
  --ui-at-kpi-panel: #ffffff;
  --ui-at-kpi-frame: #f2f6fa;
  --ui-at-kpi-line: #dae2ec;
  --ui-at-kpi-firm: #cbd6e4;
  --ui-at-kpi-ink: #00162b;
  --ui-at-kpi-text: rgba(0, 22, 43, 0.66);
  --ui-at-kpi-muted: rgba(0, 22, 43, 0.54);
  --ui-at-kpi-grid: rgba(26, 62, 112, 0.1);
  --ui-at-kpi-guide: rgba(26, 62, 112, 0.35);
  --ui-at-kpi-ring: #8fbdf2;
  --ui-at-kpi-up: #1d6a34;
  --ui-at-kpi-down: #8a3a22;
  --ui-at-kpi-c1: #2c5a96;
  --ui-at-kpi-c2: #851437;
  --ui-at-kpi-c3: #5b8fd0;
  --ui-at-kpi-c4: #2e8b57;
  --ui-at-kpi-c5: #98a5b8;
  --ui-at-kpi-c6: #b07d12;
  --ui-at-kpi-raised: 0 18px 30px -16px rgba(26, 62, 112, 0.38), 0 4px 10px -6px rgba(26, 62, 112, 0.18);
  --ui-at-kpi-floating: 0 24px 48px -24px rgba(26, 62, 112, 0.3), 0 8px 16px -8px rgba(26, 62, 112, 0.2);
  --ui-at-kpi-ease: cubic-bezier(0.16, 1, 0.3, 1);

  box-sizing: border-box;
  width: 100%;
  max-width: 460px;
  padding: 20px 20px 16px;
  border-radius: 16px;
  background: var(--ui-at-kpi-panel);
  border: 1px solid var(--ui-at-kpi-line);
  box-shadow: var(--ui-at-kpi-raised);
  color: var(--ui-at-kpi-ink);
  font-family: "Avenir Next", Avenir, system-ui, sans-serif;
  font-size: 13px;
  line-height: 1.4;
  -webkit-font-smoothing: antialiased;
}
:where(.dark, [data-theme="dark"]) .ui-at-kpi {
  --ui-at-kpi-panel: #16345c;
  --ui-at-kpi-frame: #0f2747;
  --ui-at-kpi-line: rgba(255, 255, 255, 0.12);
  --ui-at-kpi-firm: rgba(255, 255, 255, 0.18);
  --ui-at-kpi-ink: rgba(255, 255, 255, 0.94);
  --ui-at-kpi-text: rgba(255, 255, 255, 0.72);
  --ui-at-kpi-muted: rgba(255, 255, 255, 0.56);
  --ui-at-kpi-grid: rgba(255, 255, 255, 0.09);
  --ui-at-kpi-guide: rgba(255, 255, 255, 0.35);
  --ui-at-kpi-ring: rgba(143, 189, 242, 0.6);
  --ui-at-kpi-up: #7fe0a0;
  --ui-at-kpi-down: #f2a48c;
  --ui-at-kpi-c1: #8fbdf2;
  --ui-at-kpi-c2: #e0628a;
  --ui-at-kpi-c3: #4f86cc;
  --ui-at-kpi-c4: #7fe0a0;
  --ui-at-kpi-c5: #a9b6c8;
  --ui-at-kpi-c6: #f3d27a;
  --ui-at-kpi-raised: 0 18px 30px -16px rgba(3, 12, 28, 0.8), 0 4px 10px -6px rgba(3, 12, 28, 0.6);
  --ui-at-kpi-floating: 0 24px 48px -24px rgba(3, 12, 28, 0.8), 0 8px 16px -8px rgba(3, 12, 28, 0.6);
}

.ui-at-kpi__title {
  margin: 0;
  font-family: "Avenir Next Condensed", "Avenir Next", Avenir, system-ui, sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: var(--ui-at-kpi-text);
}
.ui-at-kpi__figure {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 4px 10px;
  margin: 4px 0 0;
}
.ui-at-kpi__value {
  font-size: 28px;
  font-weight: 600;
  letter-spacing: -0.01em;
  font-variant-numeric: tabular-nums;
}
.ui-at-kpi__delta {
  font-size: 13px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: var(--ui-at-kpi-up);
}
.ui-at-kpi__delta[data-trend="down"] { color: var(--ui-at-kpi-down); }

.ui-at-kpi__chart {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  column-gap: 12px;
  margin-top: 18px;
}
.ui-at-kpi__axis {
  position: relative;
  height: ${PLOT_HEIGHT}px;
  min-width: 28px;
  color: var(--ui-at-kpi-muted);
  font-size: 11px;
  font-variant-numeric: tabular-nums;
}
.ui-at-kpi__axis span {
  position: absolute;
  right: 0;
  transform: translateY(-50%);
  white-space: nowrap;
}
.ui-at-kpi__plot {
  position: relative;
  height: ${PLOT_HEIGHT}px;
  border-radius: 6px;
  outline: none;
  touch-action: pan-y;
  cursor: crosshair;
}
.ui-at-kpi__plot:focus-visible { box-shadow: 0 0 0 3px var(--ui-at-kpi-ring); }
.ui-at-kpi__svg { display: block; overflow: visible; }
.ui-at-kpi__grid { stroke: var(--ui-at-kpi-grid); stroke-width: 1; shape-rendering: crispEdges; }
.ui-at-kpi__lines { animation: ui-at-kpi-draw 1100ms var(--ui-at-kpi-ease) both; }

.ui-at-kpi__guide {
  position: absolute;
  top: 0;
  bottom: 0;
  left: -0.5px;
  width: 1px;
  background: var(--ui-at-kpi-guide);
  pointer-events: none;
  transition: transform 150ms var(--ui-at-kpi-ease);
}
.ui-at-kpi__dot {
  position: absolute;
  top: -4.5px;
  left: -4.5px;
  width: 9px;
  height: 9px;
  box-sizing: border-box;
  border-radius: 50%;
  background: var(--ui-at-kpi-series);
  border: 2px solid var(--ui-at-kpi-panel);
  box-shadow: 0 0 0 1px var(--ui-at-kpi-series);
  pointer-events: none;
  transition: transform 150ms var(--ui-at-kpi-ease);
}
.ui-at-kpi__tip {
  position: absolute;
  top: -6px;
  left: 0;
  z-index: 2;
  pointer-events: none;
  transition: transform 150ms var(--ui-at-kpi-ease);
}
.ui-at-kpi__tip-card {
  min-width: 140px;
  margin-left: 12px;
  padding: 9px 11px;
  border-radius: 12px;
  background: var(--ui-at-kpi-panel);
  border: 1px solid var(--ui-at-kpi-firm);
  box-shadow: var(--ui-at-kpi-floating);
  animation: ui-at-kpi-fade 150ms var(--ui-at-kpi-ease) both;
}
.ui-at-kpi__tip[data-side="left"] .ui-at-kpi__tip-card { margin-left: 0; transform: translateX(calc(-100% - 12px)); }
.ui-at-kpi__tip-head { margin: 0 0 4px; color: var(--ui-at-kpi-muted); font-size: 11.5px; white-space: nowrap; }
.ui-at-kpi__tip-card ul { list-style: none; margin: 0; padding: 0; }
.ui-at-kpi__tip-card li {
  display: grid;
  grid-template-columns: 10px minmax(0, 1fr) auto;
  align-items: center;
  gap: 8px;
  height: 22px;
  font-size: 12.5px;
}
.ui-at-kpi__tip-mark { width: 10px; height: 2px; border-radius: 2px; background: var(--ui-at-kpi-series); }
.ui-at-kpi__tip-label { color: var(--ui-at-kpi-text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ui-at-kpi__tip-value { font-weight: 600; font-variant-numeric: tabular-nums; }

.ui-at-kpi__x {
  grid-column: 2;
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  color: var(--ui-at-kpi-muted);
  font-size: 11.5px;
  white-space: nowrap;
}
.ui-at-kpi__empty {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  margin: 0;
  color: var(--ui-at-kpi-muted);
}
.ui-at-kpi__footer { margin: 16px 0 0; color: var(--ui-at-kpi-muted); font-size: 12.5px; }
.ui-at-kpi__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}

@keyframes ui-at-kpi-draw {
  from { clip-path: inset(-10px 100% -10px -10px); }
  to { clip-path: inset(-10px -10px -10px -10px); }
}
@keyframes ui-at-kpi-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}
@media (prefers-reduced-motion: reduce) {
  .ui-at-kpi *, .ui-at-kpi *::before, .ui-at-kpi *::after {
    animation: none !important;
    transition: none !important;
  }
}
`;
