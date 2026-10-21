"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";

/* ------------------------------------------------------------------------------------------------
 * Types
 * ----------------------------------------------------------------------------------------------*/

export type ExperimentTone = "red" | "amber" | "green" | "blue" | "violet" | "gray";

export type ExperimentMetric = {
  id: string;
  label: string;
  format?: (n: number) => string;
  /** A drop counts as the lead (latency, bounce, cost). */
  lowerIsBetter?: boolean;
};

export type ExperimentVariant = {
  id: string;
  /** Short letter in the badge. */
  key: string;
  name: string;
  /** One raw number per metric id. */
  values: Record<string, number>;
  control?: boolean;
  visitors?: number;
  /** Confidence in percent per metric id, as your stats engine gives it. */
  confidence?: Record<string, number>;
  color?: string;
};

export type ExperimentCardProps = {
  title: string;
  variants: ExperimentVariant[];
  metrics: ExperimentMetric[];
  metric?: string;
  defaultMetric?: string;
  onMetricChange?: (id: string) => void;
  winner?: string | null;
  defaultWinner?: string | null;
  onWinnerChange?: (id: string | null) => void;
  status?: { label: string; tone?: ExperimentTone };
  note?: string;
  action?: { label: string | ((variant: ExperimentVariant) => string); onClick: (variant: ExperimentVariant) => void };
  hint?: ReactNode;
  trigger?: "hover" | "click";
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
};

/* ------------------------------------------------------------------------------------------------
 * Helpers
 * ----------------------------------------------------------------------------------------------*/

const ROLL_MS = 560;
const PALETTE_SIZE = 5;
const ease = (t: number) => 1 - Math.pow(1 - t, 4);
const plainFormat = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 2 });
const percent = (n: number) =>
  `${n > 0 ? "+" : n < 0 ? "−" : "±"}${Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;

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

/** Every number rolls in one shared tween. Starts at its target (no count-up on mount). */
function useRoll(target: Record<string, number>, reduced: boolean) {
  const [shown, setShown] = useState<Record<string, number>>(target);
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
    const startedAt = performance.now();
    let frame = 0;
    const step = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / ROLL_MS);
      const k = ease(progress);
      const next: Record<string, number> = {};
      for (const key of Object.keys(goal)) {
        const a = from[key] ?? goal[key];
        next[key] = a + (goal[key] - a) * k;
      }
      setShown(next);
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [signature, reduced]);
  return shown;
}

function useControllable<T>(controlled: T | undefined, initial: T, onChange?: (value: T) => void) {
  const [inner, setInner] = useState<T>(initial);
  const value = controlled !== undefined ? controlled : inner;
  const set = useCallback(
    (next: T) => {
      if (controlled === undefined) setInner(next);
      onChange?.(next);
    },
    [controlled, onChange],
  );
  return [value, set] as const;
}

/* ------------------------------------------------------------------------------------------------
 * Experiment Card
 * ----------------------------------------------------------------------------------------------*/

export function ExperimentCard({
  title,
  variants,
  metrics,
  metric,
  defaultMetric,
  onMetricChange,
  winner,
  defaultWinner = null,
  onWinnerChange,
  status,
  note,
  action,
  hint = "Pick a winner",
  trigger = "hover",
  open,
  defaultOpen = false,
  onOpenChange,
  className,
}: ExperimentCardProps) {
  const reduced = useReducedMotion();
  const bodyId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLButtonElement>(null);

  const [isOpen, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  const [metricId, setMetric] = useControllable(metric, defaultMetric ?? metrics[0]?.id ?? "", onMetricChange);
  const [picked, setPicked] = useControllable<string | null>(winner, defaultWinner, onWinnerChange);
  const [hovered, setHovered] = useState<string | null>(null);

  const current = metrics.find((m) => m.id === metricId) ?? metrics[0];
  const fmt = current?.format ?? plainFormat;
  const control = variants.find((v) => v.control) ?? variants[0];
  const valueOf = (variant: ExperimentVariant) => {
    const raw = current ? variant.values[current.id] : undefined;
    return typeof raw === "number" && Number.isFinite(raw) ? raw : null;
  };
  const base = control ? valueOf(control) : null;
  const changeOf = (variant: ExperimentVariant) => {
    const v = valueOf(variant);
    if (variant === control || v === null || base === null || base === 0) return null;
    return ((v - base) / Math.abs(base)) * 100;
  };
  const isBetter = (change: number) => (current?.lowerIsBetter ? change < 0 : change > 0);

  // Who is ahead on the shown metric (the control when nobody beats it).
  let leader: ExperimentVariant | undefined = control;
  let leadChange: number | null = null;
  for (const variant of variants) {
    const change = changeOf(variant);
    if (change === null || !isBetter(change)) continue;
    if (leadChange === null || Math.abs(change) > Math.abs(leadChange)) {
      leader = variant;
      leadChange = change;
    }
  }

  const values = variants.map(valueOf);
  const peak = Math.max(0, ...values.filter((v): v is number => v !== null));
  const target: Record<string, number> = {};
  variants.forEach((variant, index) => {
    target[variant.id] = values[index] ?? 0;
  });
  const shown = useRoll(target, reduced);

  const colorOf = (variant: ExperimentVariant, index: number) =>
    variant.color ?? (variant === control ? "var(--ui-xp-c0)" : `var(--ui-xp-c${(index % (PALETTE_SIZE - 1)) + 1})`);

  // Open and close
  const closeTimer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(closeTimer.current), []);
  const onEnter = (event: ReactPointerEvent) => {
    if (trigger !== "hover" || event.pointerType !== "mouse") return;
    window.clearTimeout(closeTimer.current);
    if (!isOpen) setOpen(true);
  };
  const onLeave = (event: ReactPointerEvent) => {
    setHovered(null);
    if (trigger !== "hover" || event.pointerType !== "mouse") return;
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => {
      if (!rootRef.current?.contains(document.activeElement) || document.activeElement === headRef.current) setOpen(false);
    }, 180);
  };
  useEffect(() => {
    if (!isOpen) return;
    const away = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", away);
    return () => document.removeEventListener("pointerdown", away);
  }, [isOpen, setOpen]);

  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape" && isOpen) {
      event.stopPropagation();
      setOpen(false);
      headRef.current?.focus();
    }
  };

  // Metric switch – radiogroup with a sliding pill
  const switchRef = useRef<HTMLDivElement>(null);
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null);
  const measure = useCallback(() => {
    const active = switchRef.current?.querySelector<HTMLElement>('[aria-checked="true"]');
    if (active) setPill({ left: active.offsetLeft, width: active.offsetWidth });
  }, []);
  useLayoutEffect(measure, [metricId, metrics, isOpen, measure]);
  useEffect(() => {
    const group = switchRef.current;
    if (!group || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(group);
    return () => observer.disconnect();
  }, [measure]);
  const stepMetric = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const index = Math.max(0, metrics.findIndex((m) => m.id === metricId));
    let next = -1;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % metrics.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index - 1 + metrics.length) % metrics.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = metrics.length - 1;
    if (next < 0) return;
    event.preventDefault();
    setMetric(metrics[next].id);
    switchRef.current?.querySelectorAll<HTMLElement>('[role="radio"]')[next]?.focus();
  };

  // Variants – radiogroup; Space or a click picks, picking again takes the pick back
  const rowsRef = useRef<HTMLDivElement>(null);
  const toggle = (id: string) => setPicked(picked === id ? null : id);
  const tabStop = picked && variants.some((v) => v.id === picked) ? picked : variants[0]?.id;
  const stepVariant = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const radios = Array.from(rowsRef.current?.querySelectorAll<HTMLElement>('[role="radio"]') ?? []);
    const index = radios.indexOf(document.activeElement as HTMLElement);
    if (index < 0) return;
    let next = -1;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") next = (index + 1) % radios.length;
    else if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = (index - 1 + radios.length) % radios.length;
    if (next < 0) return;
    event.preventDefault();
    radios[next].focus();
  };

  const pickedVariant = variants.find((v) => v.id === picked);
  const focusVariant = variants.find((v) => v.id === hovered);
  const statusTone = status?.tone ?? "gray";
  const leadText =
    leader && leadChange !== null ? `${leader.key} ahead on ${current?.label ?? ""} by ${percent(leadChange)}` : "no variant ahead yet";
  const headName = [title, status?.label, note, leadText].filter(Boolean).join(", ");

  let trayLine: ReactNode = hint;
  if (focusVariant) {
    const change = changeOf(focusVariant);
    trayLine = (
      <>
        <strong>{focusVariant.key}</strong> {focusVariant.name}
        {focusVariant.visitors !== undefined && <> · {focusVariant.visitors.toLocaleString("en-US")} visitors</>}
        {change !== null && current?.id && focusVariant.confidence?.[current.id] !== undefined && (
          <> · {Math.round(focusVariant.confidence[current.id])}% confidence</>
        )}
      </>
    );
  } else if (pickedVariant) {
    trayLine = (
      <>
        Winner: <strong>{pickedVariant.key}</strong> {pickedVariant.name}
      </>
    );
  }

  return (
    <div
      ref={rootRef}
      className={["ui-xp", className].filter(Boolean).join(" ")}
      data-open={isOpen ? "" : undefined}
      data-hovering={hovered ? "" : undefined}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      onKeyDown={onKeyDown}
    >
      <style href="ui-experiment-card" precedence="default">
        {css}
      </style>
      <div className="ui-xp__panel">
        <button
          ref={headRef}
          type="button"
          className="ui-xp__head"
          aria-expanded={isOpen}
          aria-controls={bodyId}
          aria-label={headName}
          onClick={() => setOpen(!isOpen)}
        >
          <span className="ui-xp__chart" aria-hidden="true">
            {variants.map((variant, index) => {
              const v = shown[variant.id] ?? 0;
              return (
                <span
                  key={variant.id}
                  className="ui-xp__col"
                  data-active={hovered === variant.id ? "" : undefined}
                  style={{ height: `${peak > 0 ? Math.max(14, (v / peak) * 100) : 14}%`, "--ui-xp-part": colorOf(variant, index) } as CSSProperties}
                  onPointerEnter={() => isOpen && setHovered(variant.id)}
                  onPointerLeave={() => setHovered(null)}
                />
              );
            })}
          </span>
          <span className="ui-xp__id">
            <span className="ui-xp__title">{title}</span>
            {(status || note) && (
              <span className="ui-xp__meta">
                {status && (
                  <span className="ui-xp__status" data-tone={statusTone}>
                    <svg viewBox="0 0 12 12" width="11" height="11" aria-hidden="true">
                      <circle cx="6" cy="6" r="4.6" fill="none" stroke="currentColor" strokeWidth="1.3" />
                      <circle cx="6" cy="6" r="1.9" fill="currentColor" />
                    </svg>
                    {status.label}
                  </span>
                )}
                {note && <span className="ui-xp__note">{note}</span>}
              </span>
            )}
          </span>
          {leader && leadChange !== null && (
            <span key={`${leader.id}:${metricId}`} className="ui-xp__lead" data-good="">
              <strong>{leader.key}</strong>
              <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true">
                <path
                  d={leadChange >= 0 ? "M2 9 5.5 5.5 7.5 7.5 10 4M7 4h3v3" : "M2 3l3.5 3.5 2-2L10 8M7 8h3V5"}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {percent(leadChange)}
            </span>
          )}
        </button>

        <div className="ui-xp__fold" id={bodyId} inert={!isOpen}>
          <div className="ui-xp__body">
            {metrics.length > 1 && (
              <div className="ui-xp__switch" role="radiogroup" aria-label="Metric" ref={switchRef} onKeyDown={stepMetric}>
                {pill && (
                  <span className="ui-xp__pill" aria-hidden="true" style={{ transform: `translateX(${pill.left}px)`, width: pill.width }} />
                )}
                {metrics.map((m) => {
                  const checked = m.id === metricId;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      role="radio"
                      aria-checked={checked}
                      tabIndex={checked ? 0 : -1}
                      className="ui-xp__option"
                      onClick={() => setMetric(m.id)}
                    >
                      {m.label}
                    </button>
                  );
                })}
              </div>
            )}

            {variants.length === 0 ? (
              <p className="ui-xp__empty">No variants yet.</p>
            ) : (
              <div className="ui-xp__rows" role="radiogroup" aria-label="Pick a winner" ref={rowsRef} onKeyDown={stepVariant}>
                {variants.map((variant, index) => {
                  const v = values[index];
                  const roll = shown[variant.id] ?? 0;
                  const change = changeOf(variant);
                  const isControl = variant === control;
                  const isPicked = picked === variant.id;
                  const confidence = current ? variant.confidence?.[current.id] : undefined;
                  const label = `${variant.key}, ${variant.name}: ${v === null ? "no data" : fmt(v)}, ${
                    isControl ? "baseline" : change === null ? "no change" : `${percent(change)} against ${control?.key}`
                  }${confidence !== undefined ? `, ${Math.round(confidence)}% confidence` : ""}`;
                  return (
                    <div
                      key={variant.id}
                      role="radio"
                      aria-checked={isPicked}
                      aria-label={label}
                      tabIndex={variant.id === tabStop ? 0 : -1}
                      className="ui-xp__row"
                      data-active={hovered === variant.id ? "" : undefined}
                      data-picked={isPicked ? "" : undefined}
                      style={{ "--ui-xp-part": colorOf(variant, index) } as CSSProperties}
                      onPointerEnter={() => setHovered(variant.id)}
                      onPointerLeave={() => setHovered(null)}
                      onFocus={() => setHovered(variant.id)}
                      onBlur={() => setHovered((h) => (h === variant.id ? null : h))}
                      onClick={() => toggle(variant.id)}
                      onKeyDown={(event) => {
                        if (event.key === " " || event.key === "Enter") {
                          event.preventDefault();
                          toggle(variant.id);
                        }
                      }}
                    >
                      <span className="ui-xp__badge" aria-hidden="true">
                        {isPicked ? (
                          <svg viewBox="0 0 12 12" width="11" height="11">
                            <path d="M2.5 6.3 5 8.6 9.6 3.6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ) : (
                          variant.key
                        )}
                      </span>
                      <span className="ui-xp__name" aria-hidden="true">
                        {variant.name}
                      </span>
                      <span className="ui-xp__value" aria-hidden="true">
                        {v === null ? "–" : fmt(roll)}
                      </span>
                      <span
                        className="ui-xp__chip"
                        aria-hidden="true"
                        data-kind={isControl ? "base" : change === null || change === 0 ? "flat" : isBetter(change) ? "good" : "bad"}
                      >
                        {isControl ? "Base" : change === null ? "–" : percent(change)}
                      </span>
                      <span className="ui-xp__track" aria-hidden="true">
                        <span style={{ width: `${peak > 0 ? (roll / peak) * 100 : 0}%` }} />
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="ui-xp__tray-fold" inert={!isOpen}>
        <div className="ui-xp__tray">
          <p className="ui-xp__hint" aria-live="polite">
            {trayLine}
          </p>
          {action && pickedVariant && (
            <button key={pickedVariant.id} type="button" className="ui-xp__action" onClick={() => action.onClick(pickedVariant)}>
              {typeof action.label === "function" ? action.label(pickedVariant) : action.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------------------------------
 * Styles
 * ----------------------------------------------------------------------------------------------*/

const css = /* css */ `
.ui-xp {
  --ui-xp-frame: #f2f6fa;
  --ui-xp-panel: #ffffff;
  --ui-xp-soft: rgba(26, 62, 112, 0.06);
  --ui-xp-line: #dae2ec;
  --ui-xp-firm: #cbd6e4;
  --ui-xp-ink: #00162b;
  --ui-xp-text: rgba(0, 22, 43, 0.66);
  --ui-xp-muted: rgba(0, 22, 43, 0.54);
  --ui-xp-berry: #851437;
  --ui-xp-berry-hover: #6d0f2d;
  --ui-xp-ring: #8fbdf2;
  --ui-xp-info-ink: #1a3e70;
  --ui-xp-info-fill: #eef5ff;
  --ui-xp-info-line: #c1daff;
  --ui-xp-good-ink: #1d6a34;
  --ui-xp-good-fill: #eafbee;
  --ui-xp-good-line: #c9f5cf;
  --ui-xp-wait-ink: #775810;
  --ui-xp-wait-fill: #fdf6dd;
  --ui-xp-wait-line: #fae6a0;
  --ui-xp-bad-ink: #8a3a22;
  --ui-xp-bad-fill: #fdeee8;
  --ui-xp-bad-line: #f5d5c9;
  --ui-xp-brand-ink: #851437;
  --ui-xp-brand-fill: #fbeef2;
  --ui-xp-brand-line: #f1cbd7;
  --ui-xp-c0: #a3afc0;
  --ui-xp-c1: #2c5a96;
  --ui-xp-c2: #851437;
  --ui-xp-c3: #2e8b57;
  --ui-xp-c4: #b07d12;
  --ui-xp-pebble-shade: inset 0 -2px 6px -4px rgba(26, 62, 112, 0.4);
  --ui-xp-drop: 0 8px 16px -8px rgba(26, 62, 112, 0.2);
  --ui-xp-raised: 0 18px 30px -16px rgba(26, 62, 112, 0.38), 0 4px 10px -6px rgba(26, 62, 112, 0.18);
  --ui-xp-floating: 0 24px 48px -24px rgba(26, 62, 112, 0.3);
  --ui-xp-ease: cubic-bezier(0.16, 1, 0.3, 1);

  container-type: inline-size;
  box-sizing: border-box;
  width: 100%;
  max-width: 340px;
  padding: 4px;
  border-radius: 20px;
  background: var(--ui-xp-frame);
  border: 1px solid var(--ui-xp-line);
  box-shadow: var(--ui-xp-floating);
  color: var(--ui-xp-ink);
  font-family: "Avenir Next", Avenir, system-ui, sans-serif;
  font-size: 13px;
  line-height: 1.4;
  -webkit-font-smoothing: antialiased;
  transition: padding 300ms var(--ui-xp-ease), border-radius 300ms var(--ui-xp-ease);
}
.ui-xp[data-open] { padding: 6px; border-radius: 22px; }
:where(.dark, [data-theme="dark"]) .ui-xp {
  --ui-xp-frame: #0f2747;
  --ui-xp-panel: #16345c;
  --ui-xp-soft: rgba(255, 255, 255, 0.07);
  --ui-xp-line: rgba(255, 255, 255, 0.12);
  --ui-xp-firm: rgba(255, 255, 255, 0.18);
  --ui-xp-ink: rgba(255, 255, 255, 0.94);
  --ui-xp-text: rgba(255, 255, 255, 0.72);
  --ui-xp-muted: rgba(255, 255, 255, 0.56);
  --ui-xp-berry: #a8204d;
  --ui-xp-berry-hover: #bd2a5a;
  --ui-xp-ring: rgba(143, 189, 242, 0.6);
  --ui-xp-info-ink: #c1daff;
  --ui-xp-info-fill: rgba(143, 189, 242, 0.16);
  --ui-xp-info-line: rgba(143, 189, 242, 0.32);
  --ui-xp-good-ink: #7fe0a0;
  --ui-xp-good-fill: rgba(127, 224, 160, 0.14);
  --ui-xp-good-line: rgba(127, 224, 160, 0.3);
  --ui-xp-wait-ink: #f3d27a;
  --ui-xp-wait-fill: rgba(243, 210, 122, 0.14);
  --ui-xp-wait-line: rgba(243, 210, 122, 0.3);
  --ui-xp-bad-ink: #f2a48c;
  --ui-xp-bad-fill: rgba(242, 164, 140, 0.14);
  --ui-xp-bad-line: rgba(242, 164, 140, 0.3);
  --ui-xp-brand-ink: #f3a7c0;
  --ui-xp-brand-fill: rgba(224, 98, 138, 0.16);
  --ui-xp-brand-line: rgba(224, 98, 138, 0.34);
  --ui-xp-c0: #8d9bb0;
  --ui-xp-c1: #8fbdf2;
  --ui-xp-c2: #e0628a;
  --ui-xp-c3: #7fe0a0;
  --ui-xp-c4: #f3d27a;
  --ui-xp-pebble-shade: inset 0 -2px 6px -4px rgba(3, 12, 28, 0.8);
  --ui-xp-drop: 0 8px 16px -8px rgba(3, 12, 28, 0.6);
  --ui-xp-raised: 0 18px 30px -16px rgba(3, 12, 28, 0.8), 0 4px 10px -6px rgba(3, 12, 28, 0.6);
  --ui-xp-floating: 0 24px 48px -24px rgba(3, 12, 28, 0.7);
}

.ui-xp__panel {
  border-radius: 16px;
  background: var(--ui-xp-panel);
  border: 1px solid var(--ui-xp-line);
  box-shadow: var(--ui-xp-raised);
}
.ui-xp__head {
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 11px 12px;
  border: 0;
  border-radius: 16px;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
}
.ui-xp__head:focus-visible { outline: 3px solid var(--ui-xp-ring); outline-offset: -1px; }

.ui-xp__chart {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 3px;
  box-sizing: border-box;
  width: 34px;
  height: 34px;
  padding: 7px 6px 6px;
  border-radius: 10px;
  background: var(--ui-xp-panel);
  border: 1px solid var(--ui-xp-line);
  box-shadow: var(--ui-xp-pebble-shade);
}
.ui-xp__col {
  width: 5px;
  border-radius: 2px;
  background: var(--ui-xp-part);
  transition: width 150ms var(--ui-xp-ease), opacity 150ms var(--ui-xp-ease);
}
.ui-xp[data-hovering] .ui-xp__col { opacity: 0.3; }
.ui-xp[data-hovering] .ui-xp__col[data-active] { opacity: 1; width: 8px; }

.ui-xp__id { display: grid; gap: 3px; min-width: 0; }
.ui-xp__title {
  font-weight: 600;
  font-size: 13.5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-xp__meta { display: flex; align-items: center; gap: 8px; min-width: 0; }
.ui-xp__status {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  flex: none;
  height: 19px;
  padding: 0 6px;
  border-radius: 6px;
  font-size: 11.5px;
  font-weight: 600;
  color: var(--ui-xp-muted);
  background: var(--ui-xp-soft);
  border: 1px solid var(--ui-xp-line);
}
.ui-xp__status[data-tone="green"] { color: var(--ui-xp-good-ink); background: var(--ui-xp-good-fill); border-color: var(--ui-xp-good-line); }
.ui-xp__status[data-tone="amber"] { color: var(--ui-xp-wait-ink); background: var(--ui-xp-wait-fill); border-color: var(--ui-xp-wait-line); }
.ui-xp__status[data-tone="red"] { color: var(--ui-xp-bad-ink); background: var(--ui-xp-bad-fill); border-color: var(--ui-xp-bad-line); }
.ui-xp__status[data-tone="blue"] { color: var(--ui-xp-info-ink); background: var(--ui-xp-info-fill); border-color: var(--ui-xp-info-line); }
.ui-xp__status[data-tone="violet"] { color: var(--ui-xp-brand-ink); background: var(--ui-xp-brand-fill); border-color: var(--ui-xp-brand-line); }
.ui-xp__note { color: var(--ui-xp-muted); font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.ui-xp__lead {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 22px;
  padding: 0 7px;
  border-radius: 7px;
  font-size: 12px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  color: var(--ui-xp-good-ink);
  background: var(--ui-xp-good-fill);
  border: 1px solid var(--ui-xp-good-line);
  animation: ui-xp-pop 300ms var(--ui-xp-ease) both;
}

.ui-xp__fold {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  transition: grid-template-rows 300ms var(--ui-xp-ease), opacity 300ms var(--ui-xp-ease);
}
.ui-xp[data-open] .ui-xp__fold { grid-template-rows: 1fr; opacity: 1; }
.ui-xp__fold > .ui-xp__body { min-height: 0; overflow: hidden; }
.ui-xp__body { padding: 0 12px; }
.ui-xp[data-open] .ui-xp__body { padding-bottom: 12px; }

.ui-xp__switch {
  position: relative;
  display: flex;
  margin-top: 1px;
  padding: 2px;
  border-radius: 10px;
  background: var(--ui-xp-soft);
  border: 1px solid var(--ui-xp-line);
}
.ui-xp__pill {
  position: absolute;
  top: 2px;
  bottom: 2px;
  left: 0;
  box-sizing: border-box;
  border-radius: 8px;
  background: var(--ui-xp-panel);
  border: 1px solid var(--ui-xp-firm);
  box-shadow: var(--ui-xp-drop);
  transition: transform 300ms var(--ui-xp-ease), width 300ms var(--ui-xp-ease);
}
.ui-xp__option {
  position: relative;
  z-index: 1;
  flex: 1 1 0;
  min-width: 0;
  height: 26px;
  padding: 0 6px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--ui-xp-muted);
  font: inherit;
  font-size: 12.5px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  transition: color 150ms var(--ui-xp-ease);
}
.ui-xp__option[aria-checked="true"] { color: var(--ui-xp-ink); font-weight: 600; }
.ui-xp__option:hover { color: var(--ui-xp-ink); }
.ui-xp__option:focus-visible { outline: 3px solid var(--ui-xp-ring); outline-offset: 0; }

.ui-xp__rows { display: grid; gap: 2px; margin-top: 8px; }
.ui-xp__row {
  display: grid;
  grid-template-columns: 20px minmax(0, 1fr) auto auto;
  grid-template-rows: auto 4px;
  align-items: center;
  column-gap: 9px;
  row-gap: 6px;
  margin: 0 -6px;
  padding: 7px 6px 8px;
  border-radius: 10px;
  cursor: pointer;
  outline: none;
  transition: background-color 150ms var(--ui-xp-ease), opacity 150ms var(--ui-xp-ease);
}
.ui-xp__row:hover, .ui-xp__row[data-active] { background: var(--ui-xp-soft); }
.ui-xp[data-hovering] .ui-xp__row:not([data-active]):not([data-picked]) { opacity: 0.6; }
.ui-xp__row:focus-visible { box-shadow: inset 0 0 0 2px var(--ui-xp-ring); }
.ui-xp__row[data-picked] { background: var(--ui-xp-info-fill); box-shadow: inset 2px 0 0 var(--ui-xp-berry); }
.ui-xp__row[data-picked]:focus-visible { box-shadow: inset 2px 0 0 var(--ui-xp-berry), inset 0 0 0 2px var(--ui-xp-ring); }

.ui-xp__badge {
  display: grid;
  place-items: center;
  width: 20px;
  height: 20px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  color: var(--ui-xp-part);
  background: color-mix(in srgb, var(--ui-xp-part) 14%, transparent);
  border: 1px solid color-mix(in srgb, var(--ui-xp-part) 30%, transparent);
  transition: background-color 150ms var(--ui-xp-ease), color 150ms var(--ui-xp-ease);
}
.ui-xp__row[data-picked] .ui-xp__badge {
  color: #ffffff;
  background: var(--ui-xp-berry);
  border-color: transparent;
  animation: ui-xp-pop 300ms var(--ui-xp-ease) both;
}
.ui-xp__name { min-width: 0; color: var(--ui-xp-text); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ui-xp__row[data-active] .ui-xp__name, .ui-xp__row[data-picked] .ui-xp__name { color: var(--ui-xp-ink); }
.ui-xp__value { font-weight: 600; font-variant-numeric: tabular-nums; white-space: nowrap; }
.ui-xp__chip {
  min-width: 44px;
  height: 20px;
  padding: 0 6px;
  box-sizing: border-box;
  border-radius: 6px;
  font-size: 11.5px;
  font-weight: 600;
  line-height: 18px;
  text-align: center;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  color: var(--ui-xp-muted);
  background: var(--ui-xp-soft);
  border: 1px solid var(--ui-xp-line);
}
.ui-xp__chip[data-kind="good"] { color: var(--ui-xp-good-ink); background: var(--ui-xp-good-fill); border-color: var(--ui-xp-good-line); }
.ui-xp__chip[data-kind="bad"] { color: var(--ui-xp-bad-ink); background: var(--ui-xp-bad-fill); border-color: var(--ui-xp-bad-line); }
.ui-xp__track {
  grid-column: 2 / -1;
  height: 4px;
  border-radius: 999px;
  background: var(--ui-xp-soft);
  overflow: hidden;
}
.ui-xp__track > span { display: block; height: 100%; border-radius: inherit; background: var(--ui-xp-part); }
.ui-xp__empty { margin: 10px 0 0; color: var(--ui-xp-muted); text-align: center; }

.ui-xp__tray-fold {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  transition: grid-template-rows 300ms var(--ui-xp-ease), opacity 300ms var(--ui-xp-ease);
}
.ui-xp[data-open] .ui-xp__tray-fold { grid-template-rows: 1fr; opacity: 1; }
.ui-xp__tray-fold > .ui-xp__tray { min-height: 0; overflow: hidden; }
.ui-xp__tray {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.ui-xp__hint {
  min-width: 0;
  margin: 0;
  padding: 10px 10px 6px;
  color: var(--ui-xp-muted);
  font-size: 12.5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ui-xp__hint strong { color: var(--ui-xp-ink); font-weight: 600; }
.ui-xp__action {
  flex: none;
  height: 30px;
  margin: 6px 0 0;
  padding: 0 13px;
  border: 0;
  border-radius: 10px;
  background: var(--ui-xp-berry);
  color: #ffffff;
  font: inherit;
  font-size: 12.5px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 6px 12px -6px rgba(133, 20, 55, 0.6);
  transition: background-color 150ms var(--ui-xp-ease);
  animation: ui-xp-pop 300ms var(--ui-xp-ease) both;
}
.ui-xp__action:hover { background: var(--ui-xp-berry-hover); }
.ui-xp__action:focus-visible { outline: 3px solid var(--ui-xp-ring); outline-offset: 1px; }

@container (max-width: 300px) {
  .ui-xp__note { display: none; }
  .ui-xp__chip { min-width: 0; padding: 0 4px; }
  .ui-xp__head { gap: 8px; padding: 10px; }
}
@media (pointer: coarse) {
  .ui-xp__option { height: 34px; }
  .ui-xp__row { padding-top: 10px; padding-bottom: 11px; }
  .ui-xp__action { height: 36px; }
}

@keyframes ui-xp-pop {
  0% { opacity: 0; transform: scale(0.8); }
  70% { opacity: 1; transform: scale(1.06); }
  100% { opacity: 1; transform: scale(1); }
}
@media (prefers-reduced-motion: reduce) {
  .ui-xp, .ui-xp *, .ui-xp *::before, .ui-xp *::after {
    animation: none !important;
    transition: none !important;
  }
}
`;
