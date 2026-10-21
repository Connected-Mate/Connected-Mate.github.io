"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

/* ------------------------------------------------------------------------------------------------
 * Types
 * ----------------------------------------------------------------------------------------------*/

export type ContextItem = { id: string; label: string; tokens: number };

export type ContextPart = {
  id: string;
  label: string;
  /** Leave out for a part with items – it takes the items' sum. */
  tokens?: number;
  items?: ContextItem[];
  /** Locked parts can't be removed or compacted, e.g. the system prompt. */
  locked?: boolean;
  /** Offers Compact on this part. */
  compact?: boolean;
  /** Any CSS colour; defaults to the A-Team cell palette in order. */
  color?: string;
};

export type ContextWindowProps = {
  parts: ContextPart[];
  /** Size of the context window in tokens. */
  limit: number;
  title?: string;
  model?: string;
  modelIcon?: ReactNode;
  /** With it the card shows exactly what you pass; without it the removal lives inside the card. */
  onRemoveItem?: (partId: string, itemId: string) => void;
  /** The cells shimmer until the promise settles. Without it the part shrinks on its own. */
  onCompact?: (partId: string) => void | Promise<void>;
  action?: { label: string; onClick: () => void };
  /** Share of the limit from which the percentage turns amber; from 0.95 the window is full. */
  warnAt?: number;
  cells?: number;
  columns?: number;
  className?: string;
};

/* ------------------------------------------------------------------------------------------------
 * Helpers
 * ----------------------------------------------------------------------------------------------*/

// Share of its tokens a part keeps when the card compacts it on its own.
const COMPACT_SHARE = 0.28;
const FULL_AT = 0.95;

export function formatTokens(n: number) {
  const v = Math.max(0, n);
  if (v >= 1e6) return `${trim((v / 1e6).toFixed(v >= 1e7 ? 0 : 1))}M`;
  if (v >= 1e3) return `${trim((v / 1e3).toFixed(1))}K`;
  return String(Math.round(v));
}
function trim(s: string) {
  return s.endsWith(".0") ? s.slice(0, -2) : s;
}

function partTokens(p: ContextPart, removed: readonly string[]) {
  if (p.items && p.items.length) {
    return p.items.filter((i) => !removed.includes(`${p.id}/${i.id}`)).reduce((s, i) => s + Math.max(0, i.tokens), 0);
  }
  return Math.max(0, p.tokens ?? 0);
}

function reduced() {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

/* A number that rolls from its last value to the new one. */
function useRolling(target: number, ms = 600) {
  const [shown, setShown] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    const start = from.current;
    if (start === target || reduced()) {
      from.current = target;
      setShown(target);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / ms);
      const eased = 1 - Math.pow(1 - k, 3);
      const v = start + (target - start) * eased;
      from.current = v;
      setShown(v);
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return shown;
}

/* ------------------------------------------------------------------------------------------------
 * Icons (drawn for this file)
 * ----------------------------------------------------------------------------------------------*/

const stroke = {
  viewBox: "0 0 16 16",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};
const Chevron = () => (
  <svg {...stroke}>
    <path d="m5 6.5 3 3 3-3" />
  </svg>
);
const CompactIcon = () => (
  <svg {...stroke}>
    <path d="M8 2.5v4M6 4.75 8 6.75l2-2M8 13.5v-4M6 11.25l2-2 2 2M3.5 8h9" />
  </svg>
);
const Check = () => (
  <svg {...stroke}>
    <path d="m4 8.25 2.5 2.5 5.5-5.5" />
  </svg>
);
const Cross = () => (
  <svg {...stroke}>
    <path d="m5 5 6 6m0-6-6 6" />
  </svg>
);
const Arrow = () => (
  <svg {...stroke}>
    <path d="M3.5 8h9M9 4.5 12.5 8 9 11.5" />
  </svg>
);

/* ------------------------------------------------------------------------------------------------
 * Component
 * ----------------------------------------------------------------------------------------------*/

export function ContextWindow({
  parts,
  limit,
  title = "Context window",
  model,
  modelIcon,
  onRemoveItem,
  onCompact,
  action,
  warnAt = 0.8,
  cells = 216,
  columns = 36,
  className,
}: ContextWindowProps) {
  const uid = useId();
  const [removed, setRemoved] = useState<string[]>([]);
  const [leaving, setLeaving] = useState<string[]>([]);
  const [open, setOpen] = useState<string[]>([]);
  const [hover, setHover] = useState<string | null>(null);
  // Parts compacted inside the card (no onCompact): partId -> tokens it was compacted to.
  const [shrunk, setShrunk] = useState<Record<string, number>>({});
  const [compacting, setCompacting] = useState<string | null>(null);
  // After a compaction: the part, its tokens right after, and how much was saved.
  const [compacted, setCompacted] = useState<Record<string, number>>({});
  const [saved, setSaved] = useState<{ partId: string; tokens: number } | null>(null);
  const [fresh, setFresh] = useState<string | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      timers.current.forEach(clearTimeout);
    };
  }, []);
  const later = (ms: number, fn: () => void) => {
    timers.current.push(setTimeout(() => mounted.current && fn(), ms));
  };

  const safeLimit = Math.max(1, limit);
  const rows = parts.map((p, i) => {
    const base = partTokens(p, onRemoveItem ? [] : removed);
    const tokens = shrunk[p.id] !== undefined && !onCompact ? Math.min(base, shrunk[p.id]!) : base;
    return { part: p, tokens, color: p.color ?? `var(--c${(i % 6) + 1})` };
  });
  const used = rows.reduce((s, r) => s + r.tokens, 0);
  const share = used / safeLimit;
  const level = share >= FULL_AT ? "full" : share >= warnAt ? "warn" : "ok";

  // A compaction is "done" until the part grows past what it was compacted to.
  useEffect(() => {
    let changed = false;
    const next = { ...compacted };
    for (const r of rows) {
      const at = compacted[r.part.id];
      if (at !== undefined && r.tokens > at) {
        delete next[r.part.id];
        changed = true;
      }
    }
    if (changed) setCompacted(next);
  });

  /* The field: each cell stands for limit / cells tokens ---------------------------------------- */
  const per = safeLimit / Math.max(1, cells);
  const cellOwners: (number | null)[] = [];
  {
    let counts = rows.map((r) => (r.tokens > 0 ? Math.max(1, Math.round(r.tokens / per)) : 0));
    let total = counts.reduce((s, c) => s + c, 0);
    // Too many after rounding: take from the biggest parts first.
    while (total > cells) {
      const i = counts.indexOf(Math.max(...counts));
      if (counts[i]! <= 1) break;
      counts[i]! -= 1;
      total -= 1;
    }
    counts = counts.map((c) => Math.max(0, c));
    counts.forEach((c, i) => {
      for (let k = 0; k < c && cellOwners.length < cells; k++) cellOwners.push(i);
    });
    while (cellOwners.length < cells) cellOwners.push(null);
  }

  /* Actions ------------------------------------------------------------------------------------- */
  const toggle = (id: string) => setOpen((o) => (o.includes(id) ? o.filter((x) => x !== id) : [...o, id]));

  const remove = (partId: string, itemId: string) => {
    const key = `${partId}/${itemId}`;
    if (leaving.includes(key)) return;
    setLeaving((l) => [...l, key]);
    later(reduced() ? 0 : 240, () => {
      setLeaving((l) => l.filter((k) => k !== key));
      if (onRemoveItem) onRemoveItem(partId, itemId);
      else setRemoved((r) => [...r, key]);
    });
  };

  const compact = async (partId: string) => {
    if (compacting) return;
    const before = rows.find((r) => r.part.id === partId)?.tokens ?? 0;
    setCompacting(partId);
    setSaved(null);
    const finish = (after: number) => {
      setCompacting(null);
      setCompacted((c) => ({ ...c, [partId]: after }));
      setSaved({ partId, tokens: Math.max(0, before - after) });
      setFresh(partId);
      later(1600, () => setFresh((f) => (f === partId ? null : f)));
      later(3200, () => setSaved((s) => (s?.partId === partId ? null : s)));
    };
    if (onCompact) {
      try {
        await onCompact(partId);
      } catch {
        if (mounted.current) setCompacting(null);
        return;
      }
      if (!mounted.current) return;
      // The parent passes the smaller part back; read it on the next render.
      pendingRead.current = { partId, before };
      setCompacting(null);
      return;
    }
    later(reduced() ? 0 : 1100, () => {
      const after = Math.round(before * COMPACT_SHARE);
      setShrunk((s) => ({ ...s, [partId]: after }));
      finish(after);
    });
  };
  const pendingRead = useRef<{ partId: string; before: number } | null>(null);
  useEffect(() => {
    const p = pendingRead.current;
    if (!p) return;
    pendingRead.current = null;
    const after = rows.find((r) => r.part.id === p.partId)?.tokens ?? 0;
    setCompacted((c) => ({ ...c, [p.partId]: after }));
    setSaved({ partId: p.partId, tokens: Math.max(0, p.before - after) });
    setFresh(p.partId);
    later(1600, () => setFresh((f) => (f === p.partId ? null : f)));
    later(3200, () => setSaved((s) => (s?.partId === p.partId ? null : s)));
  });

  /* Numbers ------------------------------------------------------------------------------------- */
  const hovered = hover ? rows.find((r) => r.part.id === hover) : undefined;
  const big = useRolling(hovered ? hovered.tokens : used);
  const pct = Math.round((hovered ? hovered.tokens : used) / safeLimit * 100);
  const left = Math.max(0, safeLimit - used);

  let trayText = `${formatTokens(left)} free`;
  let trayTone = "muted";
  if (compacting) {
    trayText = "Compacting…";
  } else if (saved) {
    trayText = `Saved ${formatTokens(saved.tokens)} tokens`;
    trayTone = "ok";
  } else if (level === "full") {
    trayText = `Window is full – ${formatTokens(left)} left`;
    trayTone = "bad";
  } else if (level === "warn") {
    trayText = `${formatTokens(left)} left`;
  }
  const spoken =
    compacting
      ? `Compacting ${rows.find((r) => r.part.id === compacting)?.part.label ?? ""}`
      : saved
        ? `Compacted. Saved ${formatTokens(saved.tokens)} tokens.`
        : level !== "ok"
          ? `${formatTokens(left)} tokens left of ${formatTokens(safeLimit)}.`
          : "";

  return (
    <div
      className={["ui-at-ctx", className].filter(Boolean).join(" ")}
      role="group"
      aria-labelledby={`${uid}-title`}
      data-level={level}
      style={{ "--cols": columns, "--cols-narrow": Math.max(6, Math.round(columns / 2)) } as CSSProperties}
    >
      <style href="ui-context-window" precedence="default">
        {css}
      </style>
      <div className="ui-at-ctx__panel">
        <div className="ui-at-ctx__head">
          <h3 id={`${uid}-title`} className="ui-at-ctx__title">
            {title}
          </h3>
          {model && (
            <span className="ui-at-ctx__model" title={model}>
              {modelIcon && (
                <span className="ui-at-ctx__model-icon" aria-hidden="true">
                  {modelIcon}
                </span>
              )}
              <span className="ui-at-ctx__model-name">{model}</span>
            </span>
          )}
        </div>

        <div className="ui-at-ctx__numbers">
          <span className="ui-at-ctx__big" aria-hidden="true">
            {formatTokens(big)}
          </span>
          <span className="ui-at-ctx__of" aria-hidden="true" key={hovered?.part.id ?? "all"}>
            {hovered ? hovered.part.label : `of ${formatTokens(safeLimit)} tokens`}
          </span>
          <span className="ui-at-ctx__pct" aria-hidden="true">
            {pct}%
          </span>
          <span className="ui-at-ctx__sr">
            {used.toLocaleString("en-US")} of {safeLimit.toLocaleString("en-US")} tokens used, {Math.round(share * 100)}
            percent.
          </span>
        </div>

        <div className="ui-at-ctx__field" aria-hidden="true" onPointerLeave={() => setHover(null)}>
          {cellOwners.map((owner, i) => {
            const r = owner === null ? undefined : rows[owner];
            const id = r?.part.id;
            const shimmer = compacting !== null && id === compacting;
            return (
              <span
                key={i}
                className="ui-at-ctx__cell"
                data-empty={owner === null || undefined}
                data-dim={(hover !== null && id !== hover) || undefined}
                data-shimmer={shimmer || undefined}
                onPointerEnter={() => setHover(id ?? null)}
                style={
                  {
                    "--cell": r ? r.color : undefined,
                    "--i": i,
                  } as CSSProperties
                }
              />
            );
          })}
        </div>

        <ul className="ui-at-ctx__parts">
          {rows.map((r) => {
            const p = r.part;
            const items = (p.items ?? []).filter((it) => onRemoveItem || !removed.includes(`${p.id}/${it.id}`));
            const hasItems = items.length > 0;
            const isOpen = hasItems && open.includes(p.id);
            const done = compacted[p.id] !== undefined;
            const showCompact = p.compact && !p.locked && r.tokens > 0;
            const listId = `${uid}-items-${p.id}`;
            const labelInner = (
              <>
                <span className="ui-at-ctx__swatch" style={{ "--cell": r.color } as CSSProperties} />
                <span className="ui-at-ctx__label">{p.label}</span>
                {hasItems && (
                  <span className="ui-at-ctx__chev" data-open={isOpen || undefined}>
                    <Chevron />
                  </span>
                )}
              </>
            );
            return (
              <li
                key={p.id}
                className="ui-at-ctx__part"
                data-dim={(hover !== null && hover !== p.id) || undefined}
                onPointerEnter={() => setHover(p.id)}
                onPointerLeave={() => setHover(null)}
              >
                <div className="ui-at-ctx__line">
                  {hasItems ? (
                    <button
                      type="button"
                      className="ui-at-ctx__name"
                      aria-expanded={isOpen}
                      aria-controls={listId}
                      onClick={() => toggle(p.id)}
                      onFocus={() => setHover(p.id)}
                      onBlur={() => setHover(null)}
                    >
                      {labelInner}
                    </button>
                  ) : (
                    <span className="ui-at-ctx__name">{labelInner}</span>
                  )}
                  {showCompact && (done && fresh !== p.id ? null : (
                    <button
                      type="button"
                      className="ui-at-ctx__compact"
                      data-state={compacting === p.id ? "busy" : done ? "done" : undefined}
                      aria-disabled={compacting !== null || done || undefined}
                      aria-label={done ? `${p.label} compacted` : `Compact ${p.label}`}
                      onClick={() => !done && void compact(p.id)}
                    >
                      <span className="ui-at-ctx__compact-icon" key={compacting === p.id ? "busy" : done ? "done" : "idle"}>
                        {compacting === p.id ? <span className="ui-at-ctx__spin" /> : done ? <Check /> : <CompactIcon />}
                      </span>
                      <span className="ui-at-ctx__compact-label">{done ? "Compacted" : "Compact"}</span>
                    </button>
                  ))}
                  <span className="ui-at-ctx__tokens">{formatTokens(r.tokens)}</span>
                </div>
                {p.items && p.items.length > 0 && (
                  <div id={listId} className="ui-at-ctx__fold" data-open={isOpen || undefined} inert={!isOpen}>
                    <div>
                      <ul className="ui-at-ctx__items">
                        {items.map((it) => {
                          const key = `${p.id}/${it.id}`;
                          const going = leaving.includes(key);
                          return (
                            <li key={it.id} className="ui-at-ctx__fold" data-open={!going || undefined}>
                              <div>
                                <div className="ui-at-ctx__item">
                                  <span className="ui-at-ctx__item-label">{it.label}</span>
                                  <span className="ui-at-ctx__tokens" data-soft="">
                                    {formatTokens(it.tokens)}
                                  </span>
                                  {!p.locked && (
                                    <button
                                      type="button"
                                      className="ui-at-ctx__remove"
                                      aria-label={`Remove ${it.label}`}
                                      onClick={() => remove(p.id, it.id)}
                                    >
                                      <Cross />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="ui-at-ctx__tray">
        <p className="ui-at-ctx__tray-text" data-tone={trayTone} key={trayText.replace(/[\d.]+[KM]?/g, "#")}>
          {trayText}
        </p>
        <span className="ui-at-ctx__sr" role="status" aria-live="polite">
          {spoken}
        </span>
        {action && (
          <button type="button" className="ui-at-ctx__action" onClick={action.onClick}>
            {action.label}
            <Arrow />
          </button>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------------------------------
 * Styles
 * ----------------------------------------------------------------------------------------------*/

const css = /* css */ `
.ui-at-ctx {
  --frame: #f2f6fa;
  --panel: #ffffff;
  --soft: rgba(26, 62, 112, 0.06);
  --cell-empty: rgba(26, 62, 112, 0.09);
  --hairline: #dae2ec;
  --firm: #cbd6e4;
  --ink: #00162b;
  --text: rgba(0, 22, 43, 0.66);
  --muted: rgba(0, 22, 43, 0.54);
  --ring: #8fbdf2;
  --ok-ink: #1d6a34;
  --ok-fill: #eafbee;
  --ok-line: #c9f5cf;
  --wait-ink: #775810;
  --bad-ink: #8a3a22;
  --c1: #00162b;
  --c2: #6b7f99;
  --c3: #b4c2d4;
  --c4: #2d5fa6;
  --c5: #8fbdf2;
  --c6: #851437;
  --shadow-drop: 0 8px 16px -8px rgba(26, 62, 112, 0.2);
  --shadow-raised: 0 18px 30px -16px rgba(26, 62, 112, 0.38), 0 4px 10px -6px rgba(26, 62, 112, 0.18);
  --shadow-float: 0 24px 48px -24px rgba(26, 62, 112, 0.3);
  --ease: cubic-bezier(0.16, 1, 0.3, 1);
  --mono: ui-monospace, "SF Mono", Menlo, Consolas, monospace;

  position: relative;
  box-sizing: border-box;
  width: 100%;
  max-width: 360px;
  min-width: 0;
  container-type: inline-size;
  background: var(--frame);
  border: 1px solid var(--hairline);
  border-radius: 22px;
  padding: 6px;
  box-shadow: var(--shadow-float);
  font-family: "Avenir Next", Avenir, system-ui, sans-serif;
  font-size: 13px;
  line-height: 1.45;
  color: var(--text);
  -webkit-font-smoothing: antialiased;
}
:where(.dark, [data-theme="dark"]) .ui-at-ctx {
  --frame: #0f2747;
  --panel: #16345c;
  --soft: rgba(255, 255, 255, 0.07);
  --cell-empty: rgba(255, 255, 255, 0.08);
  --hairline: rgba(255, 255, 255, 0.12);
  --firm: rgba(255, 255, 255, 0.18);
  --ink: rgba(255, 255, 255, 0.94);
  --text: rgba(255, 255, 255, 0.72);
  --muted: rgba(255, 255, 255, 0.56);
  --ring: rgba(143, 189, 242, 0.6);
  --ok-ink: #7fe0a0;
  --ok-fill: rgba(127, 224, 160, 0.14);
  --ok-line: rgba(127, 224, 160, 0.3);
  --wait-ink: #f3d27a;
  --bad-ink: #f2a48c;
  --c1: #eef4fb;
  --c2: #9db0c8;
  --c3: #536c8d;
  --c4: #6f9fe0;
  --c5: #c1daff;
  --c6: #e0628b;
  --shadow-drop: 0 8px 16px -8px rgba(3, 12, 28, 0.6);
  --shadow-raised: 0 18px 30px -16px rgba(3, 12, 28, 0.8), 0 4px 10px -6px rgba(3, 12, 28, 0.6);
  --shadow-float: 0 24px 48px -24px rgba(3, 12, 28, 0.7);
}
.ui-at-ctx *, .ui-at-ctx *::before, .ui-at-ctx *::after { box-sizing: border-box; }
.ui-at-ctx p, .ui-at-ctx h3, .ui-at-ctx ul { margin: 0; padding: 0; }
.ui-at-ctx ul { list-style: none; }

.ui-at-ctx__panel {
  background: var(--panel);
  border: 1px solid var(--hairline);
  border-radius: 16px;
  box-shadow: var(--shadow-raised);
  padding: 12px 14px 8px;
}
.ui-at-ctx__head { display: flex; align-items: center; justify-content: space-between; gap: 10px; min-width: 0; }
.ui-at-ctx__title {
  font-family: "Avenir Next Condensed", "Avenir Next", Avenir, system-ui, sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: var(--ink);
  white-space: nowrap;
}
.ui-at-ctx__model {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  min-width: 0;
  height: 22px;
  padding: 0 7px;
  border-radius: 7px;
  border: 1px solid var(--hairline);
  background: var(--soft);
  color: var(--text);
  font: 500 11px/1 var(--mono);
}
.ui-at-ctx__model-icon { display: grid; place-items: center; width: 12px; height: 12px; flex: none; }
.ui-at-ctx__model-icon > * { width: 12px; height: 12px; }
.ui-at-ctx__model-name { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.ui-at-ctx__numbers { display: flex; align-items: baseline; gap: 6px; margin: 8px 0 10px; min-width: 0; }
.ui-at-ctx__big { font-size: 24px; font-weight: 700; color: var(--ink); letter-spacing: -0.01em; font-variant-numeric: tabular-nums; }
.ui-at-ctx__of { flex: 1; min-width: 0; color: var(--muted); font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; animation: ui-at-ctx-fade 300ms var(--ease) both; }
.ui-at-ctx__pct { color: var(--muted); font-size: 12px; font-weight: 600; font-variant-numeric: tabular-nums; transition: color 300ms var(--ease); }
.ui-at-ctx[data-level="warn"] .ui-at-ctx__pct { color: var(--wait-ink); }
.ui-at-ctx[data-level="full"] .ui-at-ctx__pct { color: var(--bad-ink); }

.ui-at-ctx__field {
  display: grid;
  grid-template-columns: repeat(var(--cols), minmax(0, 1fr));
  gap: 2px;
  margin-bottom: 6px;
}
.ui-at-ctx__cell {
  aspect-ratio: 1;
  border-radius: 2px;
  background: var(--cell, var(--cell-empty));
  transition: background-color 220ms var(--ease) calc(var(--i) * 2ms), opacity 150ms var(--ease);
}
.ui-at-ctx__cell[data-empty] { background: var(--cell-empty); }
.ui-at-ctx__cell[data-dim] { opacity: 0.22; }
.ui-at-ctx__cell[data-shimmer] { animation: ui-at-ctx-shimmer 1100ms ease-in-out calc(var(--i) * 8ms) infinite; }

.ui-at-ctx__parts { display: grid; }
.ui-at-ctx__part { transition: opacity 150ms var(--ease); }
.ui-at-ctx__part[data-dim] { opacity: 0.5; }
.ui-at-ctx__line { display: flex; align-items: center; gap: 8px; min-height: 30px; min-width: 0; }
.ui-at-ctx__name {
  appearance: none;
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  padding: 0;
  margin: 0;
  border: 0;
  background: none;
  color: var(--text);
  font: inherit;
  text-align: left;
}
button.ui-at-ctx__name { cursor: pointer; border-radius: 6px; }
button.ui-at-ctx__name:hover { color: var(--ink); }
button.ui-at-ctx__name:focus-visible { outline: none; box-shadow: 0 0 0 3px var(--ring); }
.ui-at-ctx__swatch { flex: none; width: 8px; height: 8px; border-radius: 2px; background: var(--cell); }
.ui-at-ctx__label { min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ui-at-ctx__chev { display: grid; place-items: center; width: 14px; height: 14px; flex: none; color: var(--muted); transition: transform 300ms var(--ease); }
.ui-at-ctx__chev svg { width: 13px; height: 13px; }
.ui-at-ctx__chev[data-open] { transform: rotate(180deg); }
.ui-at-ctx__tokens { flex: none; color: var(--ink); font-variant-numeric: tabular-nums; }
.ui-at-ctx__tokens[data-soft] { color: var(--muted); }

.ui-at-ctx__compact {
  appearance: none;
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 24px;
  padding: 0 8px;
  border-radius: 8px;
  border: 1px solid var(--hairline);
  background: var(--panel);
  box-shadow: var(--shadow-drop);
  color: var(--ink);
  font: inherit;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  animation: ui-at-ctx-fade 300ms var(--ease) both;
  transition: background-color 150ms var(--ease), color 300ms var(--ease), border-color 300ms var(--ease), transform 150ms var(--ease);
}
.ui-at-ctx__compact:hover:not([aria-disabled]) { background: var(--soft); }
.ui-at-ctx__compact:active:not([aria-disabled]) { transform: scale(0.96); }
.ui-at-ctx__compact:focus-visible { outline: none; box-shadow: 0 0 0 3px var(--ring); }
.ui-at-ctx__compact[aria-disabled] { cursor: default; }
.ui-at-ctx__compact[data-state="busy"] { color: var(--text); }
.ui-at-ctx__compact[data-state="done"] {
  border-color: var(--ok-line);
  background: var(--ok-fill);
  color: var(--ok-ink);
  box-shadow: none;
  animation: ui-at-ctx-done 1600ms var(--ease) both;
}
.ui-at-ctx__compact-icon { display: grid; place-items: center; width: 13px; height: 13px; animation: ui-at-ctx-pop 200ms var(--ease) both; }
.ui-at-ctx__compact-icon svg { width: 13px; height: 13px; }
.ui-at-ctx__spin {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  border: 1.5px solid currentColor;
  border-right-color: transparent;
  animation: ui-at-ctx-spin 700ms linear infinite;
}

.ui-at-ctx__fold {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  transition: grid-template-rows 300ms var(--ease), opacity 300ms var(--ease);
}
.ui-at-ctx__fold > div { min-height: 0; overflow: hidden; }
.ui-at-ctx__fold[data-open] { grid-template-rows: 1fr; opacity: 1; }
.ui-at-ctx__items { padding: 2px 0 4px 16px !important; }
.ui-at-ctx__item { display: flex; align-items: center; gap: 8px; min-height: 28px; min-width: 0; }
.ui-at-ctx__item-label { flex: 1; min-width: 0; color: var(--ink); font: 12px/1.4 var(--mono); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ui-at-ctx__remove {
  appearance: none;
  flex: none;
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  border-radius: 6px;
  border: 0;
  background: transparent;
  color: var(--muted);
  cursor: pointer;
  transition: background-color 150ms var(--ease), color 150ms var(--ease);
}
.ui-at-ctx__remove svg { width: 12px; height: 12px; }
.ui-at-ctx__remove:hover { background: var(--soft); color: var(--ink); }
.ui-at-ctx__remove:focus-visible { outline: none; box-shadow: 0 0 0 3px var(--ring); }

.ui-at-ctx__tray { display: flex; align-items: center; gap: 8px; min-height: 40px; padding: 4px 6px 2px 10px; }
.ui-at-ctx__tray-text { flex: 1; min-width: 0; color: var(--muted); font-size: 12.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; animation: ui-at-ctx-fade 300ms var(--ease) both; }
.ui-at-ctx__tray-text[data-tone="ok"] { color: var(--ok-ink); font-weight: 600; }
.ui-at-ctx__tray-text[data-tone="bad"] { color: var(--bad-ink); font-weight: 600; }
.ui-at-ctx[data-level="warn"] .ui-at-ctx__tray-text[data-tone="muted"] { color: var(--wait-ink); }
.ui-at-ctx__action {
  appearance: none;
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 30px;
  padding: 0 8px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: var(--ink);
  font: inherit;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 150ms var(--ease);
}
.ui-at-ctx__action svg { width: 13px; height: 13px; transition: transform 150ms var(--ease); }
.ui-at-ctx__action:hover { background: var(--soft); }
.ui-at-ctx__action:hover svg { transform: translateX(2px); }
.ui-at-ctx__action:focus-visible { outline: none; box-shadow: 0 0 0 3px var(--ring); }

.ui-at-ctx__sr {
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

@keyframes ui-at-ctx-shimmer { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
@keyframes ui-at-ctx-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes ui-at-ctx-pop { from { transform: scale(0.5); opacity: 0; } to { transform: none; opacity: 1; } }
@keyframes ui-at-ctx-spin { to { transform: rotate(360deg); } }
@keyframes ui-at-ctx-done { 0%, 75% { opacity: 1; } 100% { opacity: 0; } }

@container (max-width: 310px) {
  .ui-at-ctx__field { grid-template-columns: repeat(var(--cols-narrow), minmax(0, 1fr)); }
  .ui-at-ctx__model-name { max-width: 9ch; }
  .ui-at-ctx__compact-label { display: none; }
  .ui-at-ctx__compact { padding: 0 6px; }
}
@media (hover: none) {
  .ui-at-ctx__line { min-height: 40px; }
  .ui-at-ctx__item { min-height: 38px; }
  .ui-at-ctx__remove { width: 32px; height: 32px; }
  .ui-at-ctx__compact { height: 32px; }
  .ui-at-ctx__action { height: 40px; }
}
@media (prefers-reduced-motion: reduce) {
  .ui-at-ctx, .ui-at-ctx *, .ui-at-ctx *::before, .ui-at-ctx *::after {
    transition-duration: 0ms !important;
    transition-delay: 0ms !important;
    animation-duration: 0ms !important;
    animation-delay: 0ms !important;
  }
  .ui-at-ctx__cell[data-shimmer] { animation: none !important; opacity: 0.55; }
  .ui-at-ctx__spin { animation: ui-at-ctx-spin 1600ms linear infinite !important; }
  .ui-at-ctx__compact[data-state="done"] { animation: none !important; }
}
`;
