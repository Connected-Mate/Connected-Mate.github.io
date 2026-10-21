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
} from "react";

/* ------------------------------------------------------------------------------------------------
 * Types
 * ----------------------------------------------------------------------------------------------*/

export type UsageState = "ok" | "warn" | "limit";
export type UsagePart = { label: string; value: number; color?: string };
export type UsageLimit = {
  label: string;
  used: number;
  /** Leave out (or null) for unlimited – shown as "of ∞" on a striped track. */
  total?: number | null;
  unit?: string;
  decimals?: number;
};
export type UsageDay = { label: string; value: number | null };
export type UsagePeriod = { id: string; label: string };

export type UsageMeterProps = {
  /** Credits included in the plan – the bar's full width. */
  total: number;
  used: UsagePart[];
  limits?: UsageLimit[];
  periods?: UsagePeriod[];
  period?: string;
  defaultPeriod?: string;
  onPeriodChange?: (id: string) => void;
  resetAt?: Date | string | number;
  daily?: UsageDay[];
  onUpgrade?: (state: UsageState) => void;
  title?: string;
  plan?: string;
  unit?: string;
  /** Share (0–1) from which the meter and the limits warn. */
  warnAt?: number;
  upgradeLabel?: string;
  topUpLabel?: string;
  className?: string;
};

/* ------------------------------------------------------------------------------------------------
 * Helpers
 * ----------------------------------------------------------------------------------------------*/

const PALETTE_SIZE = 6;
const ROLL_MS = 700;
const FOLD_MS = 320;
const DAY_MS = 86_400_000;

const whole = (n: number) => Math.round(n).toLocaleString("en-US");
const fixed = (n: number, decimals: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
const ease = (t: number) => 1 - Math.pow(1 - t, 4);
const safe = (n: unknown) => (typeof n === "number" && Number.isFinite(n) ? Math.max(0, n) : 0);

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

/** One frame loop for every number and width, so they always move in step. */
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

function toDate(value: UsageMeterProps["resetAt"]) {
  if (value === undefined || value === null || value === "") return null;
  const date =
    typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
      ? new Date(`${value}T00:00:00`)
      : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function resetText(date: Date) {
  const days = Math.ceil((date.getTime() - Date.now()) / DAY_MS);
  if (days <= 0) return "Resets today";
  if (days === 1) return "Resets tomorrow";
  return `Resets in ${days} days`;
}

/* ------------------------------------------------------------------------------------------------
 * Period switch
 * ----------------------------------------------------------------------------------------------*/

function PeriodSwitch({
  periods,
  value,
  onChange,
}: {
  periods: UsagePeriod[];
  value: string;
  onChange: (id: string) => void;
}) {
  const groupRef = useRef<HTMLDivElement>(null);
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null);

  const measure = useCallback(() => {
    const active = groupRef.current?.querySelector<HTMLElement>('[aria-checked="true"]');
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
    <div className="ui-at-um__switch" role="radiogroup" aria-label="Period" ref={groupRef} onKeyDown={move}>
      {pill && (
        <span className="ui-at-um__pill" aria-hidden="true" style={{ transform: `translateX(${pill.left}px)`, width: pill.width }} />
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
            className="ui-at-um__option"
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
 * Usage Meter
 * ----------------------------------------------------------------------------------------------*/

type Part = { label: string; color?: string; leaving: boolean };

export function UsageMeter({
  total,
  used,
  limits = [],
  periods,
  period,
  defaultPeriod,
  onPeriodChange,
  resetAt,
  daily,
  onUpgrade,
  title = "Usage",
  plan,
  unit = "credits",
  warnAt = 0.8,
  upgradeLabel = "Upgrade",
  topUpLabel = "Add credits",
  className,
}: UsageMeterProps) {
  const titleId = useId();
  const reduced = useReducedMotion();

  const [innerPeriod, setInnerPeriod] = useState(defaultPeriod ?? periods?.[0]?.id ?? "");
  const currentPeriod = period ?? innerPeriod;
  const choosePeriod = (id: string) => {
    if (id === currentPeriod) return;
    if (period === undefined) setInnerPeriod(id);
    onPeriodChange?.(id);
  };

  const planTotal = safe(total);
  const parts = useMemo(() => used.map((part) => ({ ...part, value: safe(part.value) })), [used]);
  const usedTotal = parts.reduce((sum, part) => sum + part.value, 0);
  const share = planTotal > 0 ? usedTotal / planTotal : 0;
  const state: UsageState = share >= 1 ? "limit" : share >= warnAt ? "warn" : "ok";
  const left = Math.max(0, planTotal - usedTotal);

  // Each label keeps its shade for as long as the card lives.
  const shadeRef = useRef(new Map<string, number>());
  for (const part of parts) {
    if (!shadeRef.current.has(part.label)) shadeRef.current.set(part.label, shadeRef.current.size);
  }
  const colorOf = (label: string, own?: string) =>
    own ?? `var(--ui-at-um-c${((shadeRef.current.get(label) ?? 0) % PALETTE_SIZE) + 1})`;

  // Legend rows: current parts plus, for a moment, those that dropped out.
  const [rows, setRows] = useState<Part[]>(() => parts.map((part) => ({ label: part.label, color: part.color, leaving: false })));
  const partSignature = parts.map((part) => `${part.label}\u0000${part.color ?? ""}`).join("\u0001");
  useEffect(() => {
    setRows((previous) => {
      const next: Part[] = parts.map((part) => ({ label: part.label, color: part.color, leaving: false }));
      const labels = new Set(next.map((row) => row.label));
      previous.forEach((row, index) => {
        if (!labels.has(row.label)) next.splice(Math.min(index, next.length), 0, { ...row, leaving: true });
      });
      return next;
    });
    const timer = window.setTimeout(() => setRows((current) => current.filter((row) => !row.leaving)), reduced ? 0 : FOLD_MS);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partSignature, reduced]);

  const target: Record<string, number> = { "\u0000used": usedTotal };
  for (const part of parts) target[`p:${part.label}`] = part.value;
  limits.forEach((limit, index) => (target[`l:${index}`] = safe(limit.used)));
  const shown = useRoll(target, reduced);

  // Category readout on the bar
  const [activePart, setActivePart] = useState<string | null>(null);
  const activeValue = activePart ? parts.find((part) => part.label === activePart) : undefined;
  useEffect(() => {
    if (activePart && !activeValue) setActivePart(null);
  }, [activePart, activeValue]);

  const stepPart = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!parts.length) return;
    const index = parts.findIndex((part) => part.label === activePart);
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      setActivePart(parts[(index + 1) % parts.length].label);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      setActivePart(parts[index <= 0 ? parts.length - 1 : index - 1].label);
    } else if (event.key === "Escape" && activePart) {
      event.preventDefault();
      setActivePart(null);
    }
  };

  // Day readout on the sparkline
  const days = daily ?? [];
  const [activeDay, setActiveDay] = useState<number | null>(null);
  const known = days.filter((day) => typeof day.value === "number" && Number.isFinite(day.value)) as { label: string; value: number }[];
  const average = known.length ? known.reduce((sum, day) => sum + day.value, 0) / known.length : 0;
  const peak = Math.max(1, ...known.map((day) => day.value));
  const stepDay = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!days.length) return;
    const index = activeDay ?? -1;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      setActiveDay(Math.min(days.length - 1, index + 1));
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      setActiveDay(index < 0 ? days.length - 1 : Math.max(0, index - 1));
    } else if (event.key === "Home") {
      event.preventDefault();
      setActiveDay(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setActiveDay(days.length - 1);
    } else if (event.key === "Escape" && activeDay !== null) {
      event.preventDefault();
      setActiveDay(null);
    }
  };
  useEffect(() => {
    if (activeDay !== null && activeDay >= days.length) setActiveDay(null);
  }, [activeDay, days.length]);

  // Polite announcement of the state, so amber is never the only signal.
  const announcement = `${title}: ${
    state === "limit" ? "limit reached, " : state === "warn" ? "running low, " : ""
  }${whole(usedTotal)} of ${whole(planTotal)} ${unit} used`;
  const [spoken, setSpoken] = useState("");
  const firstRef = useRef(true);
  useEffect(() => {
    if (firstRef.current) {
      firstRef.current = false;
      return;
    }
    setSpoken(announcement);
  }, [announcement]);

  const reset = toDate(resetAt);
  const shownUsed = shown["\u0000used"] ?? 0;
  const barScale = Math.max(planTotal, rows.reduce((sum, row) => sum + (shown[`p:${row.label}`] ?? 0), 0));
  const pct = planTotal > 0 ? Math.min(999, Math.round((shownUsed / planTotal) * 100)) : 0;

  // Position of the category readout: centre of the active segment.
  let tipLeft = 0;
  if (activeValue && barScale > 0) {
    let before = 0;
    for (const row of rows) {
      const v = shown[`p:${row.label}`] ?? 0;
      if (row.label === activeValue.label) {
        tipLeft = ((before + v / 2) / barScale) * 100;
        break;
      }
      before += v;
    }
  }

  const button =
    state === "ok"
      ? { label: upgradeLabel, strong: false }
      : { label: topUpLabel, strong: true };

  return (
    <section
      className={["ui-at-um", className].filter(Boolean).join(" ")}
      aria-labelledby={titleId}
      data-state={state}
      data-hovering={activePart ? "" : undefined}
    >
      <style href="ui-usage-meter" precedence="default">
        {css}
      </style>
      <div className="ui-at-um__panel">
        <header className="ui-at-um__head">
          <div className="ui-at-um__id">
            <h3 className="ui-at-um__title" id={titleId}>
              {title}
            </h3>
            {(plan || reset) && (
              <p className="ui-at-um__meta">
                {plan && <span>{plan}</span>}
                {plan && reset && <span aria-hidden="true"> · </span>}
                {reset && (
                  <time
                    dateTime={reset.toISOString()}
                    title={reset.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  >
                    {resetText(reset)}
                  </time>
                )}
              </p>
            )}
          </div>
          {periods && periods.length > 0 && <PeriodSwitch periods={periods} value={currentPeriod} onChange={choosePeriod} />}
        </header>

        <div className="ui-at-um__figure" aria-hidden="true">
          <span className="ui-at-um__big">{whole(shownUsed)}</span>
          <span className="ui-at-um__of">
            of {whole(planTotal)} {unit}
          </span>
          <span className="ui-at-um__pct">
            {state !== "ok" && <span key={state} className="ui-at-um__flag" />}
            {pct}%
          </span>
        </div>

        <div
          className="ui-at-um__bar"
          role="meter"
          tabIndex={0}
          aria-label={`${title} ${unit} used`}
          aria-valuemin={0}
          aria-valuemax={planTotal}
          aria-valuenow={Math.min(usedTotal, planTotal)}
          aria-valuetext={`${whole(usedTotal)} of ${whole(planTotal)} ${unit}`}
          onKeyDown={stepPart}
          onBlur={() => setActivePart(null)}
          onPointerLeave={() => setActivePart(null)}
        >
          <div className="ui-at-um__track">
            {rows.map((row) => {
              const v = shown[`p:${row.label}`] ?? 0;
              return (
                <span
                  key={row.label}
                  className="ui-at-um__seg"
                  data-active={activePart === row.label ? "" : undefined}
                  style={{ width: `${barScale > 0 ? (v / barScale) * 100 : 0}%`, "--ui-at-um-part": colorOf(row.label, row.color) } as CSSProperties}
                  onPointerEnter={() => !row.leaving && setActivePart(row.label)}
                  onPointerDown={() => !row.leaving && setActivePart(row.label)}
                />
              );
            })}
          </div>
          {activeValue && (
            <span className="ui-at-um__tip" aria-hidden="true" style={{ left: `${Math.min(88, Math.max(12, tipLeft))}%` }}>
              <strong>{activeValue.label}</strong> {whole(activeValue.value)} ·{" "}
              {usedTotal > 0 ? Math.round((activeValue.value / usedTotal) * 100) : 0}%
            </span>
          )}
          <span className="ui-at-um__sr" aria-live="polite">
            {activeValue
              ? `${activeValue.label}: ${whole(activeValue.value)} ${unit}, ${
                  usedTotal > 0 ? Math.round((activeValue.value / usedTotal) * 100) : 0
                }%`
              : ""}
          </span>
        </div>

        {rows.length === 0 ? (
          <p className="ui-at-um__empty">No {unit} used in this period yet.</p>
        ) : (
          <ul className="ui-at-um__legend">
            {rows.map((row) => {
              const v = shown[`p:${row.label}`] ?? 0;
              const final = parts.find((part) => part.label === row.label)?.value ?? 0;
              return (
                <li key={row.label} className="ui-at-um__item" data-leaving={row.leaving ? "" : undefined}>
                  <div className="ui-at-um__fold">
                    <div
                      className="ui-at-um__row"
                      data-active={activePart === row.label ? "" : undefined}
                      style={{ "--ui-at-um-part": colorOf(row.label, row.color) } as CSSProperties}
                      onPointerEnter={() => !row.leaving && setActivePart(row.label)}
                      onPointerLeave={() => setActivePart(null)}
                      onClick={() => !row.leaving && setActivePart((current) => (current === row.label ? null : row.label))}
                    >
                      <span className="ui-at-um__dot" aria-hidden="true" />
                      <span className="ui-at-um__label">{row.label}</span>
                      <span className="ui-at-um__value">
                        <span aria-hidden="true">{whole(v)}</span>
                        <span className="ui-at-um__sr">
                          {whole(final)} {unit}
                        </span>
                      </span>
                      <span className="ui-at-um__share">
                        {usedTotal > 0 ? Math.round((final / usedTotal) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {days.length > 0 && (
          <div className="ui-at-um__daily">
            <div className="ui-at-um__daily-head">
              <span>Per day</span>
              <span aria-hidden="true">
                {activeDay !== null ? (
                  <>
                    {days[activeDay].label} ·{" "}
                    <strong>{days[activeDay].value === null ? "–" : whole(days[activeDay].value as number)}</strong>
                  </>
                ) : (
                  <>
                    Avg <strong>{whole(average)}</strong> / day
                  </>
                )}
              </span>
            </div>
            <div
              className="ui-at-um__spark"
              tabIndex={0}
              role="group"
              aria-label={`${unit} per day, average ${whole(average)} – use the arrow keys to read each day`}
              data-few={days.length <= 10 ? "" : undefined}
              onKeyDown={stepDay}
              onBlur={() => setActiveDay(null)}
              onPointerLeave={() => setActiveDay(null)}
            >
              {days.map((day, index) => {
                const future = day.value === null || !Number.isFinite(day.value);
                const height = future ? 0 : Math.max(0.06, (day.value as number) / peak);
                return (
                  <span
                    key={`${day.label}-${index}`}
                    className="ui-at-um__day"
                    data-future={future ? "" : undefined}
                    data-active={activeDay === index ? "" : undefined}
                    style={{ "--ui-at-um-h": height } as CSSProperties}
                    onPointerEnter={() => setActiveDay(index)}
                    onPointerDown={() => setActiveDay(index)}
                  />
                );
              })}
              <span className="ui-at-um__sr" aria-live="polite">
                {activeDay !== null
                  ? `${days[activeDay].label}: ${
                      days[activeDay].value === null ? "no data yet" : `${whole(days[activeDay].value as number)} ${unit}`
                    }`
                  : ""}
              </span>
            </div>
          </div>
        )}

        {limits.length > 0 && (
          <ul className="ui-at-um__limits">
            {limits.map((limit, index) => {
              const unlimited = limit.total === null || limit.total === undefined;
              const cap = unlimited ? 0 : safe(limit.total);
              const value = safe(limit.used);
              const decimals = limit.decimals ?? (Number.isInteger(value) ? 0 : 1);
              const low = !unlimited && cap > 0 && value / cap >= warnAt;
              const text = `${fixed(value, decimals)} of ${unlimited ? "∞" : fixed(cap, limit.decimals ?? (Number.isInteger(cap) ? 0 : 1))}${
                limit.unit ? ` ${limit.unit}` : ""
              }`;
              const v = shown[`l:${index}`] ?? 0;
              return (
                <li key={`${limit.label}-${index}`} className="ui-at-um__limit" data-low={low ? "" : undefined}>
                  <span className="ui-at-um__limit-label">
                    {limit.label}
                    {low && <span className="ui-at-um__flag" aria-hidden="true" />}
                  </span>
                  <span className="ui-at-um__limit-value" aria-hidden="true">
                    <strong>{fixed(v, decimals)}</strong> of {unlimited ? "∞" : fixed(cap, limit.decimals ?? (Number.isInteger(cap) ? 0 : 1))}
                    {limit.unit ? ` ${limit.unit}` : ""}
                  </span>
                  <span
                    className="ui-at-um__limit-track"
                    role="meter"
                    aria-label={limit.label}
                    aria-valuemin={0}
                    aria-valuemax={unlimited ? undefined : cap}
                    aria-valuenow={unlimited ? undefined : Math.min(value, cap)}
                    aria-valuetext={`${text}${unlimited ? ", unlimited" : ""}${low ? ", running low" : ""}`}
                    data-unlimited={unlimited ? "" : undefined}
                  >
                    {!unlimited && <span style={{ width: `${cap > 0 ? Math.min(100, (v / cap) * 100) : 0}%` }} />}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <footer className="ui-at-um__tray">
        <span className="ui-at-um__status">
          {state !== "ok" && <span key={state} className="ui-at-um__flag" aria-hidden="true" />}
          {state === "limit" ? (
            <strong>Limit reached</strong>
          ) : state === "warn" ? (
            <>
              <strong>Running low</strong> · {whole(left)} left
            </>
          ) : (
            <>
              {whole(left)} {unit} left
            </>
          )}
        </span>
        <button
          key={button.strong ? "strong" : "quiet"}
          type="button"
          className="ui-at-um__button"
          data-strong={button.strong ? "" : undefined}
          onClick={() => onUpgrade?.(state)}
        >
          {button.label}
        </button>
      </footer>
      <p className="ui-at-um__sr" aria-live="polite">
        {spoken}
      </p>
    </section>
  );
}

/* ------------------------------------------------------------------------------------------------
 * Styles
 * ----------------------------------------------------------------------------------------------*/

const css = /* css */ `
.ui-at-um {
  --ui-at-um-frame: #f2f6fa;
  --ui-at-um-panel: #ffffff;
  --ui-at-um-pale: #fbfcfe;
  --ui-at-um-soft: rgba(26, 62, 112, 0.06);
  --ui-at-um-line: #dae2ec;
  --ui-at-um-firm: #cbd6e4;
  --ui-at-um-ink: #00162b;
  --ui-at-um-text: rgba(0, 22, 43, 0.66);
  --ui-at-um-muted: rgba(0, 22, 43, 0.54);
  --ui-at-um-berry: #851437;
  --ui-at-um-berry-hover: #6d0f2d;
  --ui-at-um-ring: #8fbdf2;
  --ui-at-um-warn: #d99a0b;
  --ui-at-um-warn-ink: #775810;
  --ui-at-um-fill: #1a3e70;
  --ui-at-um-stub: #dae2ec;
  --ui-at-um-bar: rgba(26, 62, 112, 0.18);
  --ui-at-um-bar-hot: #2c5a96;
  --ui-at-um-c1: #2c5a96;
  --ui-at-um-c2: #5b8fd0;
  --ui-at-um-c3: #a9cdf5;
  --ui-at-um-c4: #98a5b8;
  --ui-at-um-c5: #c3ccd8;
  --ui-at-um-c6: #6c7a8f;
  --ui-at-um-drop: 0 8px 16px -8px rgba(26, 62, 112, 0.2);
  --ui-at-um-raised: 0 18px 30px -16px rgba(26, 62, 112, 0.38), 0 4px 10px -6px rgba(26, 62, 112, 0.18);
  --ui-at-um-floating: 0 24px 48px -24px rgba(26, 62, 112, 0.3);
  --ui-at-um-ease: cubic-bezier(0.16, 1, 0.3, 1);

  container-type: inline-size;
  position: relative;
  box-sizing: border-box;
  width: 100%;
  max-width: 460px;
  padding: 6px;
  border-radius: 22px;
  background: var(--ui-at-um-frame);
  border: 1px solid var(--ui-at-um-line);
  box-shadow: var(--ui-at-um-floating);
  color: var(--ui-at-um-ink);
  font-family: "Avenir Next", Avenir, system-ui, sans-serif;
  font-size: 13px;
  line-height: 1.4;
  -webkit-font-smoothing: antialiased;
}
:where(.dark, [data-theme="dark"]) .ui-at-um {
  --ui-at-um-frame: #0f2747;
  --ui-at-um-panel: #16345c;
  --ui-at-um-pale: #1d416f;
  --ui-at-um-soft: rgba(255, 255, 255, 0.07);
  --ui-at-um-line: rgba(255, 255, 255, 0.12);
  --ui-at-um-firm: rgba(255, 255, 255, 0.18);
  --ui-at-um-ink: rgba(255, 255, 255, 0.94);
  --ui-at-um-text: rgba(255, 255, 255, 0.72);
  --ui-at-um-muted: rgba(255, 255, 255, 0.56);
  --ui-at-um-berry: #a8204d;
  --ui-at-um-berry-hover: #bd2a5a;
  --ui-at-um-ring: rgba(143, 189, 242, 0.6);
  --ui-at-um-warn: #f3d27a;
  --ui-at-um-warn-ink: #f3d27a;
  --ui-at-um-fill: #c1daff;
  --ui-at-um-stub: rgba(255, 255, 255, 0.14);
  --ui-at-um-bar: rgba(255, 255, 255, 0.16);
  --ui-at-um-bar-hot: #8fbdf2;
  --ui-at-um-c1: #8fbdf2;
  --ui-at-um-c2: #5b8fd0;
  --ui-at-um-c3: #2f5f9e;
  --ui-at-um-c4: #a9b6c8;
  --ui-at-um-c5: #6f7f96;
  --ui-at-um-c6: #4c5d77;
  --ui-at-um-drop: 0 8px 16px -8px rgba(3, 12, 28, 0.6);
  --ui-at-um-raised: 0 18px 30px -16px rgba(3, 12, 28, 0.8), 0 4px 10px -6px rgba(3, 12, 28, 0.6);
  --ui-at-um-floating: 0 24px 48px -24px rgba(3, 12, 28, 0.7);
}

.ui-at-um__panel {
  padding: 16px 16px 14px;
  border-radius: 16px;
  background: var(--ui-at-um-panel);
  border: 1px solid var(--ui-at-um-line);
  box-shadow: var(--ui-at-um-raised);
}
.ui-at-um__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}
.ui-at-um__id { min-width: 0; }
.ui-at-um__title {
  margin: 0;
  font-family: "Avenir Next Condensed", "Avenir Next", Avenir, system-ui, sans-serif;
  font-size: 17px;
  font-weight: 700;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-at-um__meta {
  margin: 2px 0 0;
  color: var(--ui-at-um-muted);
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ui-at-um__meta time { cursor: help; }

.ui-at-um__switch {
  position: relative;
  display: inline-flex;
  flex: none;
  padding: 2px;
  border-radius: 10px;
  background: var(--ui-at-um-soft);
  border: 1px solid var(--ui-at-um-line);
}
.ui-at-um__pill {
  position: absolute;
  top: 2px;
  bottom: 2px;
  left: 0;
  box-sizing: border-box;
  border-radius: 8px;
  background: var(--ui-at-um-panel);
  border: 1px solid var(--ui-at-um-firm);
  box-shadow: var(--ui-at-um-drop);
  transition: transform 300ms var(--ui-at-um-ease), width 300ms var(--ui-at-um-ease);
}
.ui-at-um__option {
  position: relative;
  z-index: 1;
  height: 24px;
  padding: 0 9px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--ui-at-um-muted);
  font: inherit;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  transition: color 150ms var(--ui-at-um-ease);
}
.ui-at-um__option[aria-checked="true"] { color: var(--ui-at-um-ink); font-weight: 600; }
.ui-at-um__option:hover { color: var(--ui-at-um-ink); }
.ui-at-um__option:focus-visible { outline: 3px solid var(--ui-at-um-ring); outline-offset: 0; }

.ui-at-um__figure {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-top: 16px;
}
.ui-at-um__big {
  font-size: 28px;
  font-weight: 600;
  letter-spacing: -0.01em;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
}
.ui-at-um__of { color: var(--ui-at-um-muted); font-size: 12.5px; white-space: nowrap; }
.ui-at-um__pct {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
.ui-at-um__flag {
  display: inline-block;
  flex: none;
  width: 7px;
  height: 7px;
  margin-left: 5px;
  border-radius: 50%;
  background: var(--ui-at-um-warn);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--ui-at-um-warn) 22%, transparent);
  animation: ui-at-um-pop 300ms var(--ui-at-um-ease) both;
}
.ui-at-um__pct .ui-at-um__flag, .ui-at-um__status .ui-at-um__flag { margin-left: 0; }

.ui-at-um__bar {
  position: relative;
  margin: 12px -4px 6px;
  padding: 4px;
  border-radius: 8px;
  outline: none;
}
.ui-at-um__bar:focus-visible { box-shadow: 0 0 0 3px var(--ui-at-um-ring); }
.ui-at-um__track {
  display: flex;
  height: 10px;
  border-radius: 999px;
  background: var(--ui-at-um-soft);
  overflow: hidden;
}
.ui-at-um__seg {
  box-sizing: border-box;
  flex: none;
  height: 100%;
  padding-right: 2px;
  background: var(--ui-at-um-part);
  background-clip: content-box;
  transition: opacity 300ms var(--ui-at-um-ease);
}
.ui-at-um[data-hovering] .ui-at-um__seg { opacity: 0.35; }
.ui-at-um[data-hovering] .ui-at-um__seg[data-active] { opacity: 1; }
.ui-at-um__tip {
  position: absolute;
  bottom: calc(100% + 4px);
  transform: translateX(-50%);
  padding: 5px 9px;
  border-radius: 9px;
  background: var(--ui-at-um-panel);
  border: 1px solid var(--ui-at-um-firm);
  box-shadow: var(--ui-at-um-floating), var(--ui-at-um-drop);
  color: var(--ui-at-um-text);
  font-size: 12px;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
  pointer-events: none;
  transition: left 150ms var(--ui-at-um-ease);
  animation: ui-at-um-fade 150ms var(--ui-at-um-ease) both;
  z-index: 2;
}
.ui-at-um__tip strong { color: var(--ui-at-um-ink); font-weight: 600; }

.ui-at-um__legend { list-style: none; margin: 4px 0 0; padding: 0; }
.ui-at-um__item {
  display: grid;
  grid-template-rows: 1fr;
  transition: grid-template-rows ${FOLD_MS}ms var(--ui-at-um-ease), opacity ${FOLD_MS}ms var(--ui-at-um-ease);
  animation: ui-at-um-unfold ${FOLD_MS}ms var(--ui-at-um-ease) both;
}
.ui-at-um__item[data-leaving] { grid-template-rows: 0fr; opacity: 0; }
.ui-at-um__fold { min-height: 0; overflow: hidden; }
.ui-at-um__row {
  display: grid;
  grid-template-columns: 8px minmax(0, 1fr) auto 3em;
  align-items: center;
  gap: 10px;
  height: 30px;
  margin: 0 -6px;
  padding: 0 6px;
  border-radius: 8px;
  cursor: default;
  transition: background-color 150ms var(--ui-at-um-ease), opacity 300ms var(--ui-at-um-ease);
}
.ui-at-um[data-hovering] .ui-at-um__row { opacity: 0.55; }
.ui-at-um[data-hovering] .ui-at-um__row[data-active] { opacity: 1; background: var(--ui-at-um-soft); }
.ui-at-um__dot { width: 8px; height: 8px; border-radius: 2px; background: var(--ui-at-um-part); }
.ui-at-um__label { min-width: 0; color: var(--ui-at-um-text); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ui-at-um__value { font-weight: 500; font-variant-numeric: tabular-nums; white-space: nowrap; }
.ui-at-um__share { text-align: right; color: var(--ui-at-um-muted); font-variant-numeric: tabular-nums; }
.ui-at-um__empty {
  margin: 8px 0 4px;
  padding: 12px;
  border-radius: 10px;
  border: 1px dashed var(--ui-at-um-firm);
  color: var(--ui-at-um-muted);
  text-align: center;
  font-size: 12.5px;
}

.ui-at-um__daily { margin-top: 14px; }
.ui-at-um__daily-head {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  color: var(--ui-at-um-muted);
  font-size: 12px;
  white-space: nowrap;
}
.ui-at-um__daily-head strong { color: var(--ui-at-um-ink); font-weight: 600; font-variant-numeric: tabular-nums; }
.ui-at-um__spark {
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 34px;
  margin: 8px -3px 0;
  padding: 3px;
  border-radius: 6px;
  outline: none;
}
.ui-at-um__spark:focus-visible { box-shadow: 0 0 0 3px var(--ui-at-um-ring); }
.ui-at-um__spark[data-few] .ui-at-um__day { max-width: 34px; }
.ui-at-um__day {
  flex: 1 1 0;
  min-width: 2px;
  height: calc(var(--ui-at-um-h) * 100%);
  border-radius: 2px;
  background: var(--ui-at-um-bar);
  transition: height 300ms var(--ui-at-um-ease), background-color 150ms var(--ui-at-um-ease);
}
.ui-at-um__day[data-future] { height: 2px; background: var(--ui-at-um-stub); }
.ui-at-um__day[data-active] { background: var(--ui-at-um-bar-hot); }
.ui-at-um__day[data-future][data-active] { background: var(--ui-at-um-muted); }

.ui-at-um__limits {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px 18px;
  list-style: none;
  margin: 14px 0 0;
  padding: 14px 0 0;
  border-top: 1px solid var(--ui-at-um-line);
}
.ui-at-um__limit { display: grid; gap: 2px; min-width: 0; }
.ui-at-um__limit-label {
  display: inline-flex;
  align-items: center;
  color: var(--ui-at-um-muted);
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ui-at-um__limit-value { color: var(--ui-at-um-muted); font-size: 12.5px; white-space: nowrap; }
.ui-at-um__limit-value strong { color: var(--ui-at-um-ink); font-weight: 600; font-variant-numeric: tabular-nums; }
.ui-at-um__limit-track {
  display: block;
  height: 4px;
  margin-top: 6px;
  border-radius: 999px;
  background: var(--ui-at-um-soft);
  overflow: hidden;
}
.ui-at-um__limit-track > span { display: block; height: 100%; border-radius: inherit; background: var(--ui-at-um-fill); }
.ui-at-um__limit-track[data-unlimited] {
  background: repeating-linear-gradient(135deg, var(--ui-at-um-firm) 0 4px, transparent 4px 8px);
}

.ui-at-um__tray {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 6px 2px 12px;
  min-height: 40px;
}
.ui-at-um__status {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  min-width: 0;
  color: var(--ui-at-um-muted);
  font-size: 12.5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ui-at-um__status strong { color: var(--ui-at-um-ink); font-weight: 600; }
.ui-at-um[data-state="warn"] .ui-at-um__status strong { color: var(--ui-at-um-warn-ink); }
.ui-at-um__button {
  flex: none;
  height: 32px;
  padding: 0 14px;
  border-radius: 10px;
  border: 1px solid var(--ui-at-um-firm);
  background: var(--ui-at-um-pale);
  color: var(--ui-at-um-ink);
  box-shadow: var(--ui-at-um-drop);
  font: inherit;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 150ms var(--ui-at-um-ease), border-color 150ms var(--ui-at-um-ease), transform 150ms var(--ui-at-um-ease);
}
.ui-at-um__button:hover { border-color: var(--ui-at-um-muted); }
.ui-at-um__button:active { transform: translateY(1px); }
.ui-at-um__button:focus-visible { outline: 3px solid var(--ui-at-um-ring); outline-offset: 1px; }
.ui-at-um__button[data-strong] {
  border-color: transparent;
  background: var(--ui-at-um-berry);
  color: #ffffff;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 6px 12px -6px rgba(133, 20, 55, 0.6);
  animation: ui-at-um-nudge 520ms var(--ui-at-um-ease) both;
}
.ui-at-um__button[data-strong]:hover { background: var(--ui-at-um-berry-hover); }

.ui-at-um__sr {
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

@container (max-width: 400px) {
  .ui-at-um__head { flex-direction: column; align-items: stretch; }
  .ui-at-um__switch { align-self: flex-start; max-width: 100%; }
  .ui-at-um__limits { grid-template-columns: 1fr; gap: 10px; }
  .ui-at-um__limit { grid-template-columns: minmax(0, 1fr) auto; align-items: center; column-gap: 10px; }
  .ui-at-um__limit-track { grid-column: 1 / -1; margin-top: 2px; }
}
@container (max-width: 300px) {
  .ui-at-um__row { grid-template-columns: 8px minmax(0, 1fr) auto; }
  .ui-at-um__share { display: none; }
  .ui-at-um__of { font-size: 11.5px; }
  .ui-at-um__big { font-size: 24px; }
}
@media (pointer: coarse) {
  .ui-at-um__row { height: 38px; }
  .ui-at-um__option { height: 34px; }
  .ui-at-um__button { height: 38px; }
  .ui-at-um__track { height: 14px; }
  .ui-at-um__spark { height: 40px; }
}

@keyframes ui-at-um-pop {
  0% { opacity: 0; transform: scale(0.3); }
  70% { opacity: 1; transform: scale(1.25); }
  100% { opacity: 1; transform: scale(1); }
}
@keyframes ui-at-um-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes ui-at-um-nudge {
  0% { transform: translateX(0) scale(0.96); }
  35% { transform: translateX(-3px) scale(1.02); }
  65% { transform: translateX(2px); }
  100% { transform: translateX(0) scale(1); }
}
@keyframes ui-at-um-unfold {
  from { grid-template-rows: 0fr; opacity: 0; }
  to { grid-template-rows: 1fr; opacity: 1; }
}
@media (prefers-reduced-motion: reduce) {
  .ui-at-um *, .ui-at-um *::before, .ui-at-um *::after {
    animation: none !important;
    transition: none !important;
  }
}
`;
