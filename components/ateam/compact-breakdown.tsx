"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
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

export type BreakdownItem = {
  /** Stable id across periods – falls back to the label. */
  id?: string;
  label: string;
  value: number;
  /** Any CSS colour; without one the part gets the next shade of the A-Team palette. */
  color?: string;
};

export type BreakdownPeriod = { id: string; label: string };

export type CompactBreakdownProps = {
  items: BreakdownItem[];
  title?: string;
  periods?: BreakdownPeriod[];
  period?: string;
  defaultPeriod?: string;
  onPeriodChange?: (id: string) => void;
  /** Change against the previous period, in percent (12.4 or -3). */
  delta?: number;
  format?: (value: number) => string;
  totalLabel?: string;
  /** Replaces the "Largest: …" line on the tray; null hides the tray line. */
  footer?: ReactNode | null;
  className?: string;
};

/* ------------------------------------------------------------------------------------------------
 * Helpers
 * ----------------------------------------------------------------------------------------------*/

const PALETTE_SIZE = 7;
const ROLL_MS = 620;
const FOLD_MS = 320;

const defaultFormat = (value: number) => Math.round(value).toLocaleString("en-US");
const idOf = (item: BreakdownItem) => item.id ?? item.label;
const ease = (t: number) => 1 - Math.pow(1 - t, 4);

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return reduced;
}

/** One frame loop for every number, so the total, the rows and the bar move in step. */
function useRoll(target: Record<string, number>, reduced: boolean) {
  const [shown, setShown] = useState<Record<string, number>>(() =>
    Object.fromEntries(Object.keys(target).map((key) => [key, 0])),
  );
  const shownRef = useRef(shown);
  shownRef.current = shown;
  const signature = JSON.stringify(target);

  useEffect(() => {
    const goal: Record<string, number> = JSON.parse(signature);
    if (reduced) {
      setShown(goal);
      return;
    }
    const from = { ...shownRef.current };
    const keys = Array.from(new Set([...Object.keys(from), ...Object.keys(goal)]));
    const startedAt = performance.now();
    let frame = 0;
    const step = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / ROLL_MS);
      const k = ease(progress);
      const next: Record<string, number> = {};
      for (const key of keys) {
        if (progress >= 1 && !(key in goal)) continue;
        const a = from[key] ?? 0;
        const b = goal[key] ?? 0;
        next[key] = a + (b - a) * k;
      }
      setShown(next);
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [signature, reduced]);

  return shown;
}

/* ------------------------------------------------------------------------------------------------
 * Period switch – a radiogroup with one tab stop and a sliding pill
 * ----------------------------------------------------------------------------------------------*/

function PeriodSwitch({
  periods,
  value,
  onChange,
}: {
  periods: BreakdownPeriod[];
  value: string;
  onChange: (id: string) => void;
}) {
  const groupRef = useRef<HTMLDivElement>(null);
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null);

  const measure = useCallback(() => {
    const group = groupRef.current;
    const active = group?.querySelector<HTMLElement>('[aria-checked="true"]');
    if (active) setPill({ left: active.offsetLeft, width: active.offsetWidth });
  }, []);

  useLayoutEffect(measure, [value, periods, measure]);
  useEffect(() => {
    const group = groupRef.current;
    if (!group || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(group);
    return () => observer.disconnect();
  }, [measure]);

  const move = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const index = Math.max(0, periods.findIndex((p) => p.id === value));
    let next = -1;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % periods.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index - 1 + periods.length) % periods.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = periods.length - 1;
    if (next < 0) return;
    event.preventDefault();
    onChange(periods[next].id);
    groupRef.current?.querySelectorAll<HTMLElement>('[role="radio"]')[next]?.focus();
  };

  return (
    <div className="ui-at-cb__switch" role="radiogroup" aria-label="Period" ref={groupRef} onKeyDown={move}>
      {pill && (
        <span
          className="ui-at-cb__pill"
          aria-hidden="true"
          style={{ transform: `translateX(${pill.left}px)`, width: pill.width }}
        />
      )}
      {periods.map((option) => {
        const checked = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={checked}
            tabIndex={checked ? 0 : -1}
            className="ui-at-cb__option"
            onClick={() => onChange(option.id)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------------------------------------
 * Compact Breakdown
 * ----------------------------------------------------------------------------------------------*/

type Row = { id: string; label: string; color?: string; leaving: boolean };

export function CompactBreakdown({
  items,
  title = "Breakdown",
  periods,
  period,
  defaultPeriod,
  onPeriodChange,
  delta,
  format = defaultFormat,
  totalLabel = "Total",
  footer,
  className,
}: CompactBreakdownProps) {
  const titleId = useId();
  const reduced = useReducedMotion();

  const [innerPeriod, setInnerPeriod] = useState(defaultPeriod ?? periods?.[0]?.id ?? "");
  const currentPeriod = period ?? innerPeriod;
  const choosePeriod = (id: string) => {
    if (id === currentPeriod) return;
    if (period === undefined) setInnerPeriod(id);
    onPeriodChange?.(id);
  };

  // Each part keeps its palette shade and its place on the bar for as long as the card lives.
  const shadeRef = useRef(new Map<string, number>());
  for (const item of items) {
    const id = idOf(item);
    if (!shadeRef.current.has(id)) shadeRef.current.set(id, shadeRef.current.size);
  }
  const colorOf = (id: string, own?: string) =>
    own ?? `var(--ui-at-cb-c${((shadeRef.current.get(id) ?? 0) % PALETTE_SIZE) + 1})`;

  const clean = useMemo(
    () => items.map((item) => ({ ...item, value: Number.isFinite(item.value) ? Math.max(0, item.value) : 0 })),
    [items],
  );
  const total = clean.reduce((sum, item) => sum + item.value, 0);
  const ranked = useMemo(() => [...clean].sort((a, b) => b.value - a.value), [clean]);

  // Rows: ranked parts plus, for a moment, the parts that left (they fold away).
  const [rows, setRows] = useState<Row[]>(() =>
    ranked.map((item) => ({ id: idOf(item), label: item.label, color: item.color, leaving: false })),
  );
  const rankSignature = ranked.map((item) => `${idOf(item)}\u0000${item.label}\u0000${item.color ?? ""}`).join("\u0001");
  useEffect(() => {
    setRows((previous) => {
      const next: Row[] = ranked.map((item) => ({ id: idOf(item), label: item.label, color: item.color, leaving: false }));
      const ids = new Set(next.map((row) => row.id));
      previous.forEach((row, index) => {
        if (!ids.has(row.id)) next.splice(Math.min(index, next.length), 0, { ...row, leaving: true });
      });
      return next;
    });
    const timer = window.setTimeout(
      () => setRows((current) => current.filter((row) => !row.leaving)),
      reduced ? 0 : FOLD_MS,
    );
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rankSignature, reduced]);

  // Hover / focus highlight
  const [active, setActive] = useState<string | null>(null);
  const activeItem = active ? clean.find((item) => idOf(item) === active) : undefined;
  useEffect(() => {
    if (active && !activeItem) setActive(null);
  }, [active, activeItem]);

  // Every number rolls in one shared tween.
  const target: Record<string, number> = { "\u0000big": activeItem ? activeItem.value : total };
  for (const item of clean) target[idOf(item)] = item.value;
  const shown = useRoll(target, reduced);
  const shownTotal = rows.reduce((sum, row) => sum + (shown[row.id] ?? 0), 0);

  // Rows slide to their new rank.
  const listRef = useRef<HTMLUListElement>(null);
  const tops = useRef(new Map<string, number>());
  const orderSignature = rows.map((row) => row.id).join("\u0001");
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const next = new Map<string, number>();
    list.querySelectorAll<HTMLElement>("[data-row]").forEach((el) => next.set(el.dataset.row!, el.offsetTop));
    if (!reduced && typeof list.animate === "function") {
      list.querySelectorAll<HTMLElement>("[data-row]").forEach((el) => {
        const before = tops.current.get(el.dataset.row!);
        const after = next.get(el.dataset.row!);
        if (before === undefined || after === undefined || before === after) return;
        el.animate([{ transform: `translateY(${before - after}px)` }, { transform: "translateY(0)" }], {
          duration: 420,
          easing: "cubic-bezier(.16, 1, .3, 1)",
        });
      });
    }
    tops.current = next;
  }, [orderSignature, reduced]);

  const largest = ranked[0];
  const trayLine =
    footer === null ? null : footer !== undefined ? footer : largest && largest.value > 0 ? (
      <>
        Largest: <strong>{largest.label}</strong>
      </>
    ) : null;

  const hasDelta = typeof delta === "number" && Number.isFinite(delta);
  const change = hasDelta ? (delta as number) : 0;
  const deltaText = `${Math.abs(change).toLocaleString("en-US", { maximumFractionDigits: 1 })}%`;
  const summary = `${totalLabel}: ${format(total)}${
    hasDelta ? `, ${change >= 0 ? "up" : "down"} ${deltaText} against the previous period` : ""
  }`;

  const barOrder = [...rows].sort((a, b) => (shadeRef.current.get(a.id) ?? 0) - (shadeRef.current.get(b.id) ?? 0));
  const empty = total <= 0;

  return (
    <div
      role="group"
      aria-labelledby={titleId}
      className={["ui-at-cb", className].filter(Boolean).join(" ")}
      data-hovering={active ? "" : undefined}
    >
      <style href="ui-compact-breakdown" precedence="default">
        {css}
      </style>
      <div className="ui-at-cb__panel">
        <div className="ui-at-cb__head">
          <h3 className="ui-at-cb__title" id={titleId}>
            {title}
          </h3>
          {periods && periods.length > 0 && (
            <PeriodSwitch periods={periods} value={currentPeriod} onChange={choosePeriod} />
          )}
        </div>

        <div className="ui-at-cb__figure" aria-hidden="true">
          <span className="ui-at-cb__big">{format(shown["\u0000big"] ?? 0)}</span>
          {hasDelta && !activeItem && (
            <span key={`${currentPeriod}:${change}`} className="ui-at-cb__delta" data-down={change < 0 ? "" : undefined}>
              <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true">
                <path d="M6 10V2M2.5 5.5 6 2l3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {deltaText}
            </span>
          )}
        </div>
        <p className="ui-at-cb__sub" aria-hidden="true">
          {activeItem ? activeItem.label : totalLabel}
        </p>
        <p className="ui-at-cb__sr" aria-live="polite">
          {summary}
        </p>

        <div className="ui-at-cb__bar" aria-hidden="true">
          {!empty &&
            barOrder.map((row) => {
              const value = shown[row.id] ?? 0;
              const width = shownTotal > 0 ? (value / shownTotal) * 100 : 0;
              return (
                <span
                  key={row.id}
                  className="ui-at-cb__seg"
                  data-active={active === row.id ? "" : undefined}
                  style={{ width: `${width}%`, "--ui-at-cb-part": colorOf(row.id, row.color) } as CSSProperties}
                  onPointerEnter={(event) => event.pointerType === "mouse" && !row.leaving && setActive(row.id)}
                  onPointerLeave={(event) => event.pointerType === "mouse" && setActive(null)}
                />
              );
            })}
        </div>

        {empty ? (
          <p className="ui-at-cb__empty">Nothing to show for this period yet.</p>
        ) : (
          <ul className="ui-at-cb__list" ref={listRef} onPointerLeave={() => setActive(null)}>
            {rows.map((row) => {
              const value = shown[row.id] ?? 0;
              const item = clean.find((entry) => idOf(entry) === row.id);
              const finalValue = item?.value ?? 0;
              const share = shownTotal > 0 ? Math.round((value / shownTotal) * 100) : 0;
              const finalShare = total > 0 ? Math.round((finalValue / total) * 100) : 0;
              return (
                <li key={row.id} data-row={row.id} className="ui-at-cb__item" data-leaving={row.leaving ? "" : undefined}>
                  <div className="ui-at-cb__fold">
                    <div
                      className="ui-at-cb__row"
                      tabIndex={row.leaving ? -1 : 0}
                      aria-label={`${row.label}: ${format(finalValue)}, ${finalShare}%`}
                      data-active={active === row.id ? "" : undefined}
                      style={{ "--ui-at-cb-part": colorOf(row.id, row.color) } as CSSProperties}
                      onPointerEnter={() => !row.leaving && setActive(row.id)}
                      onFocus={() => !row.leaving && setActive(row.id)}
                      onBlur={() => setActive((current) => (current === row.id ? null : current))}
                    >
                      <span className="ui-at-cb__dot" aria-hidden="true" />
                      <span className="ui-at-cb__label" aria-hidden="true">
                        {row.label}
                      </span>
                      <span className="ui-at-cb__value" aria-hidden="true">
                        {format(value)}
                      </span>
                      <span className="ui-at-cb__share" aria-hidden="true">
                        {share}%
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      {trayLine !== null && <div className="ui-at-cb__tray">{trayLine}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------------------------------------
 * Styles
 * ----------------------------------------------------------------------------------------------*/

const css = /* css */ `
.ui-at-cb {
  --ui-at-cb-frame: #f2f6fa;
  --ui-at-cb-panel: #ffffff;
  --ui-at-cb-soft: rgba(26, 62, 112, 0.06);
  --ui-at-cb-line: #dae2ec;
  --ui-at-cb-firm: #cbd6e4;
  --ui-at-cb-ink: #00162b;
  --ui-at-cb-text: rgba(0, 22, 43, 0.66);
  --ui-at-cb-muted: rgba(0, 22, 43, 0.54);
  --ui-at-cb-info-ink: #1a3e70;
  --ui-at-cb-info-fill: #eef5ff;
  --ui-at-cb-ring: #8fbdf2;
  --ui-at-cb-up-ink: #1d6a34;
  --ui-at-cb-up-fill: #eafbee;
  --ui-at-cb-up-line: #c9f5cf;
  --ui-at-cb-down-ink: #8a3a22;
  --ui-at-cb-down-fill: #fdeee8;
  --ui-at-cb-down-line: #f5d5c9;
  --ui-at-cb-pebble: #ffffff;
  --ui-at-cb-c1: #2c5a96;
  --ui-at-cb-c2: #5b8fd0;
  --ui-at-cb-c3: #a9cdf5;
  --ui-at-cb-c4: #98a5b8;
  --ui-at-cb-c5: #cdd5e0;
  --ui-at-cb-c6: #851437;
  --ui-at-cb-c7: #2e8b57;
  --ui-at-cb-drop: 0 8px 16px -8px rgba(26, 62, 112, 0.2);
  --ui-at-cb-raised: 0 18px 30px -16px rgba(26, 62, 112, 0.38), 0 4px 10px -6px rgba(26, 62, 112, 0.18);
  --ui-at-cb-floating: 0 24px 48px -24px rgba(26, 62, 112, 0.3);
  --ui-at-cb-ease: cubic-bezier(0.16, 1, 0.3, 1);

  container-type: inline-size;
  box-sizing: border-box;
  width: 100%;
  max-width: 360px;
  padding: 6px;
  border-radius: 22px;
  background: var(--ui-at-cb-frame);
  border: 1px solid var(--ui-at-cb-line);
  box-shadow: var(--ui-at-cb-floating);
  color: var(--ui-at-cb-ink);
  font-family: "Avenir Next", Avenir, system-ui, sans-serif;
  font-size: 13px;
  line-height: 1.4;
  -webkit-font-smoothing: antialiased;
}
:where(.dark, [data-theme="dark"]) .ui-at-cb {
  --ui-at-cb-frame: #0f2747;
  --ui-at-cb-panel: #16345c;
  --ui-at-cb-soft: rgba(255, 255, 255, 0.07);
  --ui-at-cb-line: rgba(255, 255, 255, 0.12);
  --ui-at-cb-firm: rgba(255, 255, 255, 0.18);
  --ui-at-cb-ink: rgba(255, 255, 255, 0.94);
  --ui-at-cb-text: rgba(255, 255, 255, 0.72);
  --ui-at-cb-muted: rgba(255, 255, 255, 0.56);
  --ui-at-cb-info-ink: #c1daff;
  --ui-at-cb-info-fill: rgba(143, 189, 242, 0.16);
  --ui-at-cb-ring: rgba(143, 189, 242, 0.6);
  --ui-at-cb-up-ink: #7fe0a0;
  --ui-at-cb-up-fill: rgba(127, 224, 160, 0.14);
  --ui-at-cb-up-line: rgba(127, 224, 160, 0.3);
  --ui-at-cb-down-ink: #f2a48c;
  --ui-at-cb-down-fill: rgba(242, 164, 140, 0.14);
  --ui-at-cb-down-line: rgba(242, 164, 140, 0.3);
  --ui-at-cb-pebble: #1d416f;
  --ui-at-cb-c1: #8fbdf2;
  --ui-at-cb-c2: #5b8fd0;
  --ui-at-cb-c3: #2f5f9e;
  --ui-at-cb-c4: #a9b6c8;
  --ui-at-cb-c5: #6f7f96;
  --ui-at-cb-c6: #e0628a;
  --ui-at-cb-c7: #7fe0a0;
  --ui-at-cb-drop: 0 8px 16px -8px rgba(3, 12, 28, 0.6);
  --ui-at-cb-raised: 0 18px 30px -16px rgba(3, 12, 28, 0.8), 0 4px 10px -6px rgba(3, 12, 28, 0.6);
  --ui-at-cb-floating: 0 24px 48px -24px rgba(3, 12, 28, 0.7);
}

.ui-at-cb__panel {
  padding: 14px 14px 10px;
  border-radius: 16px;
  background: var(--ui-at-cb-panel);
  border: 1px solid var(--ui-at-cb-line);
  box-shadow: var(--ui-at-cb-raised);
}
.ui-at-cb__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  min-width: 0;
}
.ui-at-cb__title {
  margin: 0;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: "Avenir Next Condensed", "Avenir Next", Avenir, system-ui, sans-serif;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.005em;
}

.ui-at-cb__switch {
  position: relative;
  display: inline-flex;
  flex: none;
  padding: 2px;
  border-radius: 10px;
  background: var(--ui-at-cb-soft);
  border: 1px solid var(--ui-at-cb-line);
}
.ui-at-cb__pill {
  position: absolute;
  top: 2px;
  bottom: 2px;
  left: 0;
  border-radius: 8px;
  background: var(--ui-at-cb-pebble);
  border: 1px solid var(--ui-at-cb-firm);
  box-sizing: border-box;
  box-shadow: var(--ui-at-cb-drop);
  transition: transform 300ms var(--ui-at-cb-ease), width 300ms var(--ui-at-cb-ease);
}
.ui-at-cb__option {
  position: relative;
  z-index: 1;
  min-width: 34px;
  height: 24px;
  padding: 0 8px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--ui-at-cb-muted);
  font: inherit;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: color 150ms var(--ui-at-cb-ease);
}
.ui-at-cb__option[aria-checked="true"] { color: var(--ui-at-cb-ink); font-weight: 600; }
.ui-at-cb__option:hover { color: var(--ui-at-cb-ink); }
.ui-at-cb__option:focus-visible { outline: 3px solid var(--ui-at-cb-ring); outline-offset: 0; }

.ui-at-cb__figure {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 14px;
  min-height: 34px;
}
.ui-at-cb__big {
  font-size: 28px;
  font-weight: 600;
  letter-spacing: -0.01em;
  font-variant-numeric: tabular-nums;
  line-height: 1.1;
  white-space: nowrap;
}
.ui-at-cb__delta {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  height: 20px;
  padding: 0 7px;
  border-radius: 999px;
  font-size: 11.5px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: var(--ui-at-cb-up-ink);
  background: var(--ui-at-cb-up-fill);
  border: 1px solid var(--ui-at-cb-up-line);
  animation: ui-at-cb-pop 300ms var(--ui-at-cb-ease) both;
}
.ui-at-cb__delta[data-down] {
  color: var(--ui-at-cb-down-ink);
  background: var(--ui-at-cb-down-fill);
  border-color: var(--ui-at-cb-down-line);
}
.ui-at-cb__delta[data-down] svg { transform: rotate(180deg); }
.ui-at-cb__sub {
  margin: 2px 0 0;
  color: var(--ui-at-cb-muted);
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ui-at-cb__sr {
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

.ui-at-cb__bar {
  display: flex;
  height: 8px;
  margin: 14px 0 8px;
  border-radius: 999px;
  background: var(--ui-at-cb-soft);
  overflow: visible;
}
.ui-at-cb__seg {
  box-sizing: border-box;
  flex: none;
  height: 100%;
  padding-right: 2px;
  background: var(--ui-at-cb-part);
  background-clip: content-box;
  border-radius: 3px;
  transition: opacity 300ms var(--ui-at-cb-ease), transform 150ms var(--ui-at-cb-ease);
}
.ui-at-cb__seg:first-child { border-radius: 999px 3px 3px 999px; }
.ui-at-cb__seg:last-child { padding-right: 0; border-radius: 3px 999px 999px 3px; }
.ui-at-cb__seg:only-child { border-radius: 999px; }
.ui-at-cb[data-hovering] .ui-at-cb__seg { opacity: 0.32; }
.ui-at-cb[data-hovering] .ui-at-cb__seg[data-active] { opacity: 1; transform: scaleY(1.5); }

.ui-at-cb__list { list-style: none; margin: 0; padding: 0; }
.ui-at-cb__item {
  display: grid;
  grid-template-rows: 1fr;
  transition: grid-template-rows ${FOLD_MS}ms var(--ui-at-cb-ease), opacity ${FOLD_MS}ms var(--ui-at-cb-ease);
  animation: ui-at-cb-unfold ${FOLD_MS}ms var(--ui-at-cb-ease) both;
}
.ui-at-cb__item[data-leaving] { grid-template-rows: 0fr; opacity: 0; }
.ui-at-cb__fold { min-height: 0; overflow: hidden; }
.ui-at-cb__row {
  display: grid;
  grid-template-columns: 8px minmax(0, 1fr) auto 3.2em;
  align-items: center;
  gap: 10px;
  height: 30px;
  margin: 0 -6px;
  padding: 0 6px;
  border-radius: 8px;
  outline: none;
  cursor: default;
  transition: background-color 150ms var(--ui-at-cb-ease), opacity 300ms var(--ui-at-cb-ease);
}
.ui-at-cb[data-hovering] .ui-at-cb__row { opacity: 0.55; }
.ui-at-cb[data-hovering] .ui-at-cb__row[data-active] { opacity: 1; background: var(--ui-at-cb-soft); }
.ui-at-cb__row:focus-visible { box-shadow: inset 0 0 0 2px var(--ui-at-cb-ring); }
.ui-at-cb__dot { width: 8px; height: 8px; border-radius: 2px; background: var(--ui-at-cb-part); }
.ui-at-cb__label {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--ui-at-cb-text);
}
.ui-at-cb__row[data-active] .ui-at-cb__label { color: var(--ui-at-cb-ink); }
.ui-at-cb__value {
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  color: var(--ui-at-cb-ink);
}
.ui-at-cb__share {
  text-align: right;
  font-variant-numeric: tabular-nums;
  color: var(--ui-at-cb-muted);
}
.ui-at-cb__empty {
  margin: 4px 0 6px;
  padding: 14px;
  border-radius: 10px;
  border: 1px dashed var(--ui-at-cb-firm);
  color: var(--ui-at-cb-muted);
  text-align: center;
  font-size: 12.5px;
}

.ui-at-cb__tray {
  padding: 10px 12px 6px;
  color: var(--ui-at-cb-muted);
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-at-cb__tray strong { color: var(--ui-at-cb-ink); font-weight: 600; }
.ui-at-cb__tray a { color: var(--ui-at-cb-info-ink); font-weight: 600; text-decoration: none; }
.ui-at-cb__tray a:hover { text-decoration: underline; }
.ui-at-cb__tray a:focus-visible { outline: 3px solid var(--ui-at-cb-ring); border-radius: 4px; }

@container (max-width: 250px) {
  .ui-at-cb__row { grid-template-columns: 8px minmax(0, 1fr) auto; }
  .ui-at-cb__share { display: none; }
  .ui-at-cb__head { flex-wrap: wrap; }
}
@media (pointer: coarse) {
  .ui-at-cb__row { height: 38px; }
  .ui-at-cb__option { height: 32px; }
}

@keyframes ui-at-cb-pop {
  from { opacity: 0; transform: scale(0.85); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes ui-at-cb-unfold {
  from { grid-template-rows: 0fr; opacity: 0; }
  to { grid-template-rows: 1fr; opacity: 1; }
}
@media (prefers-reduced-motion: reduce) {
  .ui-at-cb *, .ui-at-cb *::before, .ui-at-cb *::after {
    animation: none !important;
    transition: none !important;
  }
}
`;
