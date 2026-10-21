"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";

/* ------------------------------------------------------------------------------------------------
 * Types
 * ----------------------------------------------------------------------------------------------*/

export type BreakdownRecord = Record<string, string | number | null | undefined>;

export type Dimension = {
  key: string;
  label: string;
  /** Values in display order. Records with other values are left out. */
  values: string[];
  /** Any CSS colour per value; values without one get the A-Team palette. */
  colors?: Record<string, string>;
  icons?: Record<string, ReactNode>;
};

export type Measure = {
  key: string;
  label: string;
  /** Unit after the numbers, e.g. "tasks". */
  unit?: string;
  /** Field to sum; without one the records are counted. */
  field?: string;
};

export type BreakdownChartProps = {
  records: BreakdownRecord[];
  dimensions: Dimension[];
  measures: Measure[];
  title?: string;
  defaultMeasure?: string;
  defaultSlice?: string;
  /** Dimension that stacks the bars, or "none". */
  defaultSegment?: string;
  className?: string;
};

/* ------------------------------------------------------------------------------------------------
 * Helpers
 * ----------------------------------------------------------------------------------------------*/

const PALETTE_SIZE = 8;
const PLOT_HEIGHT = 200;
const NONE = "none";

const num = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 1 });

function niceTicks(max: number) {
  if (!(max > 0)) return [0, 1, 2, 3, 4, 5];
  const raw = max / 5;
  const power = Math.pow(10, Math.floor(Math.log10(raw)));
  let step = 10 * power;
  for (const m of [1, 2, 2.5, 5, 10]) {
    if (m * power >= raw) {
      step = m * power;
      break;
    }
  }
  return Array.from({ length: 6 }, (_, i) => i * step);
}

/* ------------------------------------------------------------------------------------------------
 * Picker – a labelled button that opens a listbox
 * ----------------------------------------------------------------------------------------------*/

type PickerOption = { id: string; label: string };

function Picker({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: PickerOption[];
  value: string;
  onChange: (id: string) => void;
}) {
  const id = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const current = options.find((o) => o.id === value) ?? options[0];

  const show = (index?: number) => {
    setActive(index ?? Math.max(0, options.findIndex((o) => o.id === value)));
    setOpen(true);
  };
  const close = (focus = true) => {
    setOpen(false);
    if (focus) buttonRef.current?.focus();
  };
  const choose = (index: number) => {
    const option = options[index];
    close();
    if (option && option.id !== value) onChange(option.id);
  };

  useEffect(() => {
    if (!open) return;
    listRef.current?.focus();
    const away = (event: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", away);
    return () => document.removeEventListener("pointerdown", away);
  }, [open]);

  const onListKey = (event: ReactKeyboardEvent<HTMLUListElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((i) => Math.min(options.length - 1, i + 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) => Math.max(0, i - 1));
    } else if (event.key === "Home") {
      event.preventDefault();
      setActive(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setActive(options.length - 1);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      choose(active);
    } else if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      close();
    } else if (event.key === "Tab") {
      setOpen(false);
    }
  };

  return (
    <div className="ui-at-bc__picker" ref={wrapRef}>
      <span className="ui-at-bc__picker-label" id={`${id}-label`}>
        {label}
      </span>
      <button
        ref={buttonRef}
        type="button"
        className="ui-at-bc__picker-button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? `${id}-list` : undefined}
        aria-labelledby={`${id}-label ${id}-value`}
        onClick={() => (open ? close(false) : show())}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            show(event.key === "ArrowUp" ? options.length - 1 : undefined);
          }
        }}
      >
        <span id={`${id}-value`}>{current?.label}</span>
        <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
          <path d="m4.5 6.5 3.5 3.5 3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <ul
          ref={listRef}
          id={`${id}-list`}
          role="listbox"
          tabIndex={-1}
          aria-labelledby={`${id}-label`}
          aria-activedescendant={`${id}-o${active}`}
          className="ui-at-bc__list"
          onKeyDown={onListKey}
        >
          {options.map((option, index) => (
            <li
              key={option.id}
              id={`${id}-o${index}`}
              role="option"
              aria-selected={option.id === value}
              data-active={index === active ? "" : undefined}
              className="ui-at-bc__opt"
              onPointerMove={() => setActive(index)}
              onClick={() => choose(index)}
            >
              <span>{option.label}</span>
              {option.id === value && (
                <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
                  <path d="m3.5 8.3 3 3 6-6.6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------------------------------------
 * Breakdown Chart
 * ----------------------------------------------------------------------------------------------*/

export function BreakdownChart({
  records,
  dimensions,
  measures,
  title = "Workload",
  defaultMeasure,
  defaultSlice,
  defaultSegment,
  className,
}: BreakdownChartProps) {
  const titleId = useId();
  const tableId = useId();

  const [measureKey, setMeasureKey] = useState(defaultMeasure ?? measures[0]?.key ?? "");
  const [sliceKey, setSliceKey] = useState(defaultSlice ?? dimensions[0]?.key ?? "");
  const [segmentKey, setSegmentKey] = useState(
    defaultSegment ?? dimensions.find((d) => d.key !== (defaultSlice ?? dimensions[0]?.key))?.key ?? NONE,
  );
  const [hidden, setHidden] = useState<Set<string>>(() => new Set());
  const [active, setActive] = useState<string | null>(null);

  const measure = measures.find((m) => m.key === measureKey) ?? measures[0];
  const slice = dimensions.find((d) => d.key === sliceKey) ?? dimensions[0];
  const segment = segmentKey === NONE ? undefined : dimensions.find((d) => d.key === segmentKey && d.key !== slice?.key);
  const unit = measure?.unit ?? "";

  const pickSlice = (key: string) => {
    if (key === segmentKey) setSegmentKey(sliceKey);
    setSliceKey(key);
    setActive(null);
  };
  const pickSegment = (key: string) => {
    setSegmentKey(key);
    setHidden(new Set());
  };

  const segValues = segment ? segment.values : ["\u0000all"];
  const colorOf = (value: string, index: number) =>
    segment?.colors?.[value] ?? `var(--ui-at-bc-c${(index % PALETTE_SIZE) + 1})`;

  const { matrix, totals, grand } = useMemo(() => {
    const m = new Map<string, Map<string, number>>();
    const t = new Map<string, number>();
    let all = 0;
    if (!slice || !measure) return { matrix: m, totals: t, grand: 0 };
    for (const value of slice.values) {
      m.set(value, new Map(segValues.map((s) => [s, 0])));
      t.set(value, 0);
    }
    for (const record of records) {
      const amount = measure.field ? Number(record[measure.field]) : 1;
      if (!Number.isFinite(amount)) continue;
      all += amount;
      const sv = String(record[slice.key] ?? "");
      const row = m.get(sv);
      if (!row) continue;
      const gv = segment ? String(record[segment.key] ?? "") : "\u0000all";
      if (!row.has(gv)) continue;
      row.set(gv, (row.get(gv) ?? 0) + amount);
      t.set(sv, (t.get(sv) ?? 0) + amount);
    }
    return { matrix: m, totals: t, grand: all };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [records, slice, segment, measure]);

  const visibleSegs = segValues.filter((s) => !hidden.has(s));
  const barTotal = (sv: string) => visibleSegs.reduce((sum, s) => sum + (matrix.get(sv)?.get(s) ?? 0), 0);
  const ticks = niceTicks(Math.max(0, ...(slice?.values ?? []).map(barTotal)));
  const top = ticks[ticks.length - 1] || 1;

  const toggle = (value: string) =>
    setHidden((current) => {
      const next = new Set(current);
      if (next.has(value)) next.delete(value);
      else if (segValues.length - next.size > 1) next.add(value);
      return next;
    });

  const sliceValues = slice?.values ?? [];
  const activeIndex = active ? sliceValues.indexOf(active) : -1;
  const tipSide = activeIndex >= 0 && (activeIndex + 0.5) / sliceValues.length > 0.6 ? "left" : "right";
  const empty = grand === 0;

  const onBarKey = (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
    const bars = event.currentTarget.parentElement?.parentElement?.querySelectorAll<HTMLButtonElement>(".ui-at-bc__bar");
    if (event.key === "Escape") {
      setActive(null);
    } else if ((event.key === "ArrowRight" || event.key === "ArrowLeft") && bars) {
      event.preventDefault();
      const next = Math.min(bars.length - 1, Math.max(0, index + (event.key === "ArrowRight" ? 1 : -1)));
      bars[next]?.focus();
    }
  };

  return (
    <section className={["ui-at-bc", className].filter(Boolean).join(" ")} aria-labelledby={titleId} data-hovering={active ? "" : undefined}>
      <style href="ui-breakdown-chart" precedence="default">
        {css}
      </style>
      <header className="ui-at-bc__head">
        <h3 className="ui-at-bc__title" id={titleId}>
          {title}
        </h3>
        <p className="ui-at-bc__grand">
          <strong>{num(grand)}</strong> {unit}
        </p>
      </header>

      <div className="ui-at-bc__panel">
        <div className="ui-at-bc__pickers">
          <Picker label="Measure" options={measures.map((m) => ({ id: m.key, label: m.label }))} value={measure?.key ?? ""} onChange={setMeasureKey} />
          <Picker label="Slice" options={dimensions.map((d) => ({ id: d.key, label: d.label }))} value={slice?.key ?? ""} onChange={pickSlice} />
          <Picker
            label="Segment"
            options={[{ id: NONE, label: "None" }, ...dimensions.filter((d) => d.key !== slice?.key).map((d) => ({ id: d.key, label: d.label }))]}
            value={segment?.key ?? NONE}
            onChange={pickSegment}
          />
        </div>

        <div className="ui-at-bc__chart">
          <div className="ui-at-bc__plot" onPointerLeave={() => setActive(null)}>
            <div className="ui-at-bc__grid" aria-hidden="true">
              {ticks.map((tick) => (
                <span key={tick} style={{ bottom: `${(tick / top) * 100}%` }}>
                  <em>{num(tick)}</em>
                </span>
              ))}
            </div>
            <div className="ui-at-bc__cols">
              {sliceValues.map((sv, index) => {
                return (
                  <div key={sv} className="ui-at-bc__col" data-active={active === sv ? "" : undefined}>
                    <button
                      type="button"
                      className="ui-at-bc__bar"
                      aria-label={`${sv}: ${num(totals.get(sv) ?? 0)} ${unit}`.trim()}
                      aria-describedby={tableId}
                      onPointerEnter={() => setActive(sv)}
                      onFocus={() => setActive(sv)}
                      onBlur={() => setActive((a) => (a === sv ? null : a))}
                      onKeyDown={(event) => onBarKey(event, index)}
                    >
                      <span className="ui-at-bc__stack" aria-hidden="true">
                        {segValues.map((gv, gi) => {
                          const v = hidden.has(gv) ? 0 : matrix.get(sv)?.get(gv) ?? 0;
                          return (
                            <span
                              key={gv}
                              className="ui-at-bc__seg"
                              data-zero={v === 0 ? "" : undefined}
                              style={{ height: `${(v / top) * 100}%`, "--ui-at-bc-part": segment ? colorOf(gv, gi) : "var(--ui-at-bc-single)" } as CSSProperties}
                            />
                          );
                        })}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>

            {active && activeIndex >= 0 && (
              <div
                className="ui-at-bc__tip"
                aria-hidden="true"
                data-side={tipSide}
                style={{ left: `${((activeIndex + 0.5) / sliceValues.length) * 100}%` }}
              >
                <p className="ui-at-bc__tip-head">
                  {slice?.icons?.[active] && <span className="ui-at-bc__icon">{slice.icons[active]}</span>}
                  <span>{active}</span>
                  <strong>{num(barTotal(active))}</strong>
                </p>
                {segment && (
                  <ul>
                    {[...visibleSegs].reverse().map((gv) => (
                      <li key={gv} style={{ "--ui-at-bc-part": colorOf(gv, segValues.indexOf(gv)) } as CSSProperties}>
                        <span className="ui-at-bc__swatch" />
                        <span>{gv}</span>
                        <span className="ui-at-bc__tip-value">{num(matrix.get(active)?.get(gv) ?? 0)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            {empty && <p className="ui-at-bc__empty">No records to show yet.</p>}
          </div>

          <div className="ui-at-bc__x" aria-hidden="true">
            {sliceValues.map((sv) => {
              const icon = slice?.icons?.[sv];
              return (
                <span key={sv} className="ui-at-bc__tick" data-active={active === sv ? "" : undefined} data-text={icon ? undefined : ""}>
                  {icon ? <span className="ui-at-bc__icon">{icon}</span> : null}
                  <span className="ui-at-bc__tick-label">{sv}</span>
                </span>
              );
            })}
          </div>
        </div>

        <div className="ui-at-bc__table-wrap">
          <table className="ui-at-bc__table" id={tableId}>
            <caption className="ui-at-bc__sr">
              {measure?.label} by {slice?.label}
              {segment ? ` and ${segment.label}` : ""}
            </caption>
            <thead>
              <tr>
                <th scope="col">{slice?.label}</th>
                <th scope="col" className="ui-at-bc__num">
                  {measure?.label}
                </th>
                {segment &&
                  segValues.map((gv, gi) => (
                    <th
                      key={gv}
                      scope="col"
                      className="ui-at-bc__num"
                      data-hidden={hidden.has(gv) ? "" : undefined}
                      style={{ "--ui-at-bc-part": colorOf(gv, gi) } as CSSProperties}
                    >
                      <span className="ui-at-bc__swatch" aria-hidden="true" />
                      {gv}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {sliceValues.map((sv) => (
                <tr
                  key={sv}
                  data-active={active === sv ? "" : undefined}
                  onPointerEnter={() => setActive(sv)}
                  onPointerLeave={() => setActive(null)}
                >
                  <th scope="row">
                    <span className="ui-at-bc__row-name">
                      {slice?.icons?.[sv] && <span className="ui-at-bc__icon">{slice.icons[sv]}</span>}
                      <span>{sv}</span>
                    </span>
                  </th>
                  <td className="ui-at-bc__num ui-at-bc__strong">{num(totals.get(sv) ?? 0)}</td>
                  {segment &&
                    segValues.map((gv) => (
                      <td key={gv} className="ui-at-bc__num" data-hidden={hidden.has(gv) ? "" : undefined}>
                        {num(matrix.get(sv)?.get(gv) ?? 0)}
                      </td>
                    ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {segment && (
        <div className="ui-at-bc__legend" role="group" aria-label={`${segment.label} – click to show or hide`}>
          {segValues.map((gv, gi) => (
            <button
              key={gv}
              type="button"
              className="ui-at-bc__chip"
              aria-pressed={!hidden.has(gv)}
              style={{ "--ui-at-bc-part": colorOf(gv, gi) } as CSSProperties}
              onClick={() => toggle(gv)}
            >
              <span className="ui-at-bc__swatch" aria-hidden="true" />
              {gv}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------------------------------------
 * Styles
 * ----------------------------------------------------------------------------------------------*/

const css = /* css */ `
.ui-at-bc {
  --ui-at-bc-frame: #f2f6fa;
  --ui-at-bc-panel: #ffffff;
  --ui-at-bc-pale: #fbfcfe;
  --ui-at-bc-soft: rgba(26, 62, 112, 0.06);
  --ui-at-bc-line: #dae2ec;
  --ui-at-bc-firm: #cbd6e4;
  --ui-at-bc-ink: #00162b;
  --ui-at-bc-text: rgba(0, 22, 43, 0.66);
  --ui-at-bc-muted: rgba(0, 22, 43, 0.54);
  --ui-at-bc-berry: #851437;
  --ui-at-bc-ring: #8fbdf2;
  --ui-at-bc-info-ink: #1a3e70;
  --ui-at-bc-info-fill: #eef5ff;
  --ui-at-bc-info-line: #c1daff;
  --ui-at-bc-grid: rgba(26, 62, 112, 0.1);
  --ui-at-bc-single: #2c5a96;
  --ui-at-bc-c1: #851437;
  --ui-at-bc-c2: #b8456b;
  --ui-at-bc-c3: #2c5a96;
  --ui-at-bc-c4: #8fbdf2;
  --ui-at-bc-c5: #cdd5e0;
  --ui-at-bc-c6: #2e8b57;
  --ui-at-bc-c7: #b07d12;
  --ui-at-bc-c8: #6c7a8f;
  --ui-at-bc-inner: inset 0 1px 2px rgba(26, 62, 112, 0.08);
  --ui-at-bc-drop: 0 8px 16px -8px rgba(26, 62, 112, 0.2);
  --ui-at-bc-raised: 0 18px 30px -16px rgba(26, 62, 112, 0.38), 0 4px 10px -6px rgba(26, 62, 112, 0.18);
  --ui-at-bc-floating: 0 24px 48px -24px rgba(26, 62, 112, 0.3);
  --ui-at-bc-ease: cubic-bezier(0.16, 1, 0.3, 1);

  container-type: inline-size;
  box-sizing: border-box;
  width: 100%;
  max-width: 600px;
  padding: 6px;
  border-radius: 22px;
  background: var(--ui-at-bc-frame);
  border: 1px solid var(--ui-at-bc-line);
  box-shadow: var(--ui-at-bc-floating);
  color: var(--ui-at-bc-ink);
  font-family: "Avenir Next", Avenir, system-ui, sans-serif;
  font-size: 13px;
  line-height: 1.4;
  -webkit-font-smoothing: antialiased;
}
:where(.dark, [data-theme="dark"]) .ui-at-bc {
  --ui-at-bc-frame: #0f2747;
  --ui-at-bc-panel: #16345c;
  --ui-at-bc-pale: #1d416f;
  --ui-at-bc-soft: rgba(255, 255, 255, 0.07);
  --ui-at-bc-line: rgba(255, 255, 255, 0.12);
  --ui-at-bc-firm: rgba(255, 255, 255, 0.18);
  --ui-at-bc-ink: rgba(255, 255, 255, 0.94);
  --ui-at-bc-text: rgba(255, 255, 255, 0.72);
  --ui-at-bc-muted: rgba(255, 255, 255, 0.56);
  --ui-at-bc-berry: #a8204d;
  --ui-at-bc-ring: rgba(143, 189, 242, 0.6);
  --ui-at-bc-info-ink: #c1daff;
  --ui-at-bc-info-fill: rgba(143, 189, 242, 0.16);
  --ui-at-bc-info-line: rgba(143, 189, 242, 0.32);
  --ui-at-bc-grid: rgba(255, 255, 255, 0.09);
  --ui-at-bc-single: #8fbdf2;
  --ui-at-bc-c1: #c2335f;
  --ui-at-bc-c2: #e88aa8;
  --ui-at-bc-c3: #5b8fd0;
  --ui-at-bc-c4: #a9cdf5;
  --ui-at-bc-c5: #d5dde8;
  --ui-at-bc-c6: #7fe0a0;
  --ui-at-bc-c7: #f3d27a;
  --ui-at-bc-c8: #8d9bb0;
  --ui-at-bc-inner: inset 0 1px 2px rgba(3, 12, 28, 0.4);
  --ui-at-bc-drop: 0 8px 16px -8px rgba(3, 12, 28, 0.6);
  --ui-at-bc-raised: 0 18px 30px -16px rgba(3, 12, 28, 0.8), 0 4px 10px -6px rgba(3, 12, 28, 0.6);
  --ui-at-bc-floating: 0 24px 48px -24px rgba(3, 12, 28, 0.7);
}

.ui-at-bc__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 12px 8px;
}
.ui-at-bc__title {
  margin: 0;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: "Avenir Next Condensed", "Avenir Next", Avenir, system-ui, sans-serif;
  font-size: 17px;
  font-weight: 700;
}
.ui-at-bc__grand { margin: 0; color: var(--ui-at-bc-muted); white-space: nowrap; }
.ui-at-bc__grand strong { color: var(--ui-at-bc-ink); font-size: 15px; font-weight: 600; font-variant-numeric: tabular-nums; }

.ui-at-bc__panel {
  padding: 12px 0 0;
  border-radius: 16px;
  background: var(--ui-at-bc-panel);
  border: 1px solid var(--ui-at-bc-line);
  box-shadow: var(--ui-at-bc-raised);
  overflow: hidden;
}

.ui-at-bc__pickers {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 8px;
  padding: 0 12px;
}
.ui-at-bc__picker { position: relative; display: grid; gap: 4px; min-width: 0; }
.ui-at-bc__picker-label { color: var(--ui-at-bc-muted); font-size: 12px; }
.ui-at-bc__picker-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  height: 36px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid var(--ui-at-bc-firm);
  background: var(--ui-at-bc-pale);
  box-shadow: var(--ui-at-bc-inner);
  color: var(--ui-at-bc-ink);
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition: border-color 150ms var(--ui-at-bc-ease);
}
.ui-at-bc__picker-button > span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ui-at-bc__picker-button svg { flex: none; color: var(--ui-at-bc-muted); transition: transform 150ms var(--ui-at-bc-ease); }
.ui-at-bc__picker-button[aria-expanded="true"] svg { transform: rotate(180deg); }
.ui-at-bc__picker-button:hover { border-color: var(--ui-at-bc-muted); }
.ui-at-bc__picker-button:focus-visible { outline: none; box-shadow: var(--ui-at-bc-inner), 0 0 0 3px var(--ui-at-bc-ring); }
.ui-at-bc__list {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  z-index: 20;
  box-sizing: border-box;
  min-width: 100%;
  margin: 0;
  padding: 4px;
  list-style: none;
  border-radius: 12px;
  background: var(--ui-at-bc-panel);
  border: 1px solid var(--ui-at-bc-firm);
  box-shadow: var(--ui-at-bc-floating), var(--ui-at-bc-drop);
  outline: none;
  transform-origin: top left;
  animation: ui-at-bc-scale 150ms var(--ui-at-bc-ease) both;
}
.ui-at-bc__opt {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 7px 10px;
  border-radius: 8px;
  white-space: nowrap;
  cursor: pointer;
}
.ui-at-bc__opt[data-active] { background: var(--ui-at-bc-info-fill); }
.ui-at-bc__opt[aria-selected="true"] { color: var(--ui-at-bc-info-ink); font-weight: 600; }

.ui-at-bc__chart { padding: 16px 12px 10px; }
.ui-at-bc__plot {
  position: relative;
  height: ${PLOT_HEIGHT}px;
  margin-right: 34px;
}
.ui-at-bc__grid { position: absolute; inset: 0; pointer-events: none; }
.ui-at-bc__grid span {
  position: absolute;
  left: 0;
  right: -34px;
  height: 0;
  border-top: 1px dashed var(--ui-at-bc-grid);
}
.ui-at-bc__grid span:first-child { border-top-style: solid; border-top-color: var(--ui-at-bc-line); }
.ui-at-bc__grid em {
  position: absolute;
  right: 0;
  transform: translateY(-50%);
  color: var(--ui-at-bc-muted);
  font-size: 11px;
  font-style: normal;
  font-variant-numeric: tabular-nums;
  background: var(--ui-at-bc-panel);
  padding-left: 4px;
}
.ui-at-bc__cols { position: absolute; inset: 0; display: flex; }
.ui-at-bc__col { position: relative; flex: 1 1 0; min-width: 0; display: flex; justify-content: center; }
.ui-at-bc__bar {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  width: 100%;
  max-width: 56px;
  height: 100%;
  margin: 0;
  padding: 0 6px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  cursor: default;
  outline: none;
  transition: opacity 300ms var(--ui-at-bc-ease), background-color 150ms var(--ui-at-bc-ease);
}
.ui-at-bc__bar:focus-visible { box-shadow: 0 0 0 2px var(--ui-at-bc-ring); }
.ui-at-bc__col[data-active] .ui-at-bc__bar { background: var(--ui-at-bc-soft); }
.ui-at-bc[data-hovering] .ui-at-bc__col:not([data-active]) .ui-at-bc__bar { opacity: 0.35; }
.ui-at-bc__stack {
  display: flex;
  flex-direction: column-reverse;
  width: 12px;
  height: 100%;
  transform-origin: 50% 100%;
  animation: ui-at-bc-grow 700ms var(--ui-at-bc-ease) both;
}
.ui-at-bc__seg {
  box-sizing: border-box;
  flex: none;
  width: 100%;
  border-top: 2px solid transparent;
  background: var(--ui-at-bc-part);
  background-clip: padding-box;
  transition: height 420ms var(--ui-at-bc-ease);
}
.ui-at-bc__seg:first-child { border-radius: 0 0 2px 2px; }
.ui-at-bc__seg[data-zero] { border-top-width: 0; }

.ui-at-bc__tip {
  position: absolute;
  top: 0;
  z-index: 5;
  min-width: 150px;
  padding: 9px 11px;
  border-radius: 12px;
  background: var(--ui-at-bc-panel);
  border: 1px solid var(--ui-at-bc-firm);
  box-shadow: var(--ui-at-bc-floating), var(--ui-at-bc-drop);
  pointer-events: none;
  transform: translateX(22px);
  transition: left 150ms var(--ui-at-bc-ease);
  animation: ui-at-bc-fade 150ms var(--ui-at-bc-ease) both;
}
.ui-at-bc__tip[data-side="left"] { transform: translateX(calc(-100% - 22px)); }
.ui-at-bc__tip-head { display: flex; align-items: center; gap: 7px; margin: 0; font-weight: 600; }
.ui-at-bc__tip-head strong { margin-left: auto; padding-left: 14px; font-variant-numeric: tabular-nums; }
.ui-at-bc__tip ul { list-style: none; margin: 6px 0 0; padding: 6px 0 0; border-top: 1px solid var(--ui-at-bc-line); }
.ui-at-bc__tip li { display: grid; grid-template-columns: 8px minmax(0, 1fr) auto; align-items: center; gap: 8px; height: 20px; color: var(--ui-at-bc-text); font-size: 12px; }
.ui-at-bc__tip-value { color: var(--ui-at-bc-ink); font-variant-numeric: tabular-nums; }
.ui-at-bc__swatch { display: inline-block; flex: none; width: 8px; height: 8px; border-radius: 2px; background: var(--ui-at-bc-part); }

.ui-at-bc__x { display: flex; margin: 8px 34px 0 0; height: 24px; }
.ui-at-bc__tick {
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  color: var(--ui-at-bc-muted);
  font-size: 11.5px;
  white-space: nowrap;
}
.ui-at-bc__tick-label { display: none; overflow: hidden; text-overflow: ellipsis; }
.ui-at-bc__tick[data-text] .ui-at-bc__tick-label { display: block; }
.ui-at-bc__tick[data-active] .ui-at-bc__tick-label {
  display: block;
}
.ui-at-bc__tick[data-active] {
  color: var(--ui-at-bc-ink);
}
.ui-at-bc__tick[data-active]:not([data-text]) {
  flex: 0 0 auto;
  margin: 0 -40px;
  padding: 0 9px;
  height: 24px;
  border-radius: 999px;
  background: var(--ui-at-bc-panel);
  border: 1px solid var(--ui-at-bc-line);
  box-shadow: var(--ui-at-bc-drop);
  position: relative;
  z-index: 1;
  animation: ui-at-bc-fade 150ms var(--ui-at-bc-ease) both;
}
.ui-at-bc__icon { display: inline-grid; place-items: center; flex: none; width: 14px; height: 14px; color: var(--ui-at-bc-muted); }
.ui-at-bc__icon svg { width: 14px; height: 14px; }
.ui-at-bc__empty {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  margin: 0;
  color: var(--ui-at-bc-muted);
}

.ui-at-bc__table-wrap { overflow-x: auto; border-top: 1px solid var(--ui-at-bc-line); }
.ui-at-bc__table { width: 100%; border-collapse: collapse; font-variant-numeric: tabular-nums; }
.ui-at-bc__table th, .ui-at-bc__table td { padding: 0 12px; height: 38px; white-space: nowrap; text-align: left; }
.ui-at-bc__table thead th {
  background: var(--ui-at-bc-soft);
  color: var(--ui-at-bc-text);
  font-weight: 500;
  font-size: 12.5px;
  border-bottom: 1px solid var(--ui-at-bc-line);
}
.ui-at-bc__table thead .ui-at-bc__swatch { margin-right: 6px; }
.ui-at-bc__table tbody tr { border-bottom: 1px solid var(--ui-at-bc-line); transition: background-color 150ms var(--ui-at-bc-ease); }
.ui-at-bc__table tbody tr:last-child { border-bottom: 0; }
.ui-at-bc__table tbody th { font-weight: 500; }
.ui-at-bc__table tbody tr[data-active] { background: var(--ui-at-bc-info-fill); box-shadow: inset 2px 0 0 var(--ui-at-bc-berry); }
.ui-at-bc__row-name { display: flex; align-items: center; gap: 8px; }
.ui-at-bc__num { text-align: right !important; color: var(--ui-at-bc-text); }
.ui-at-bc__strong { color: var(--ui-at-bc-ink); font-weight: 500; }
.ui-at-bc__table [data-hidden] { opacity: 0.4; }

.ui-at-bc__legend {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 6px;
  padding: 10px 8px 4px;
}
.ui-at-bc__chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 26px;
  padding: 0 8px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: transparent;
  color: var(--ui-at-bc-text);
  font: inherit;
  font-size: 12.5px;
  cursor: pointer;
  transition: background-color 150ms var(--ui-at-bc-ease), color 150ms var(--ui-at-bc-ease), opacity 150ms var(--ui-at-bc-ease);
}
.ui-at-bc__chip:hover { background: var(--ui-at-bc-soft); color: var(--ui-at-bc-ink); }
.ui-at-bc__chip[aria-pressed="false"] { color: var(--ui-at-bc-muted); text-decoration: line-through; opacity: 0.7; }
.ui-at-bc__chip[aria-pressed="false"] .ui-at-bc__swatch { background: transparent; box-shadow: inset 0 0 0 1.5px var(--ui-at-bc-part); }
.ui-at-bc__chip:focus-visible { outline: 3px solid var(--ui-at-bc-ring); outline-offset: 0; }

.ui-at-bc__sr {
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

@container (max-width: 420px) {
  .ui-at-bc__pickers { grid-template-columns: 1fr 1fr; }
  .ui-at-bc__picker:last-child { grid-column: 1 / -1; }
  .ui-at-bc__bar { padding: 0 2px; }
  .ui-at-bc__stack { width: 10px; }
  .ui-at-bc__tick[data-active]:not([data-text]) .ui-at-bc__tick-label { display: none; }
  .ui-at-bc__tick[data-active]:not([data-text]) { margin: 0; padding: 0 5px; }
}
@media (pointer: coarse) {
  .ui-at-bc__picker-button { height: 42px; }
  .ui-at-bc__opt { padding: 11px 10px; }
  .ui-at-bc__chip { height: 34px; }
}

@keyframes ui-at-bc-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes ui-at-bc-grow { from { transform: scaleY(0); } to { transform: scaleY(1); } }
@keyframes ui-at-bc-scale { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
@media (prefers-reduced-motion: reduce) {
  .ui-at-bc *, .ui-at-bc *::before, .ui-at-bc *::after {
    animation: none !important;
    transition: none !important;
  }
}
`;
