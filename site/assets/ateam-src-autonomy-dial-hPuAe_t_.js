var e=`"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

/* ------------------------------------------------------------------------------------------------
 * Types and the rule
 * ----------------------------------------------------------------------------------------------*/

export type AutonomyLevel = 0 | 1 | 2;
export type ActionRisk = "safe" | "risky" | "destructive";

export type AgentAction = {
  id: string;
  label: string;
  detail?: string;
  risk: ActionRisk;
  icon?: ReactNode;
};

export type AutonomyDialProps = {
  actions: AgentAction[];
  level?: AutonomyLevel;
  defaultLevel?: AutonomyLevel;
  onLevelChange?: (level: AutonomyLevel) => void;
  /** Ids of actions that always ask, whatever the level. */
  pinned?: string[];
  defaultPinned?: string[];
  onPinnedChange?: (pinned: string[]) => void;
  title?: string;
  subtitle?: string;
  className?: string;
};

/**
 * The rule the dial shows – use it where the agent decides whether to pause.
 * Pinned always asks; level 0 asks for everything; level 1 runs only safe actions;
 * level 2 runs everything not pinned.
 */
export function asksFirst(action: Pick<AgentAction, "id" | "risk">, level: AutonomyLevel, pinned: readonly string[] = []) {
  if (pinned.includes(action.id)) return true;
  if (level === 0) return true;
  if (level === 1) return action.risk !== "safe";
  return false;
}

const LEVELS: { value: AutonomyLevel; label: string; meaning: string }[] = [
  { value: 0, label: "Always ask", meaning: "Every action waits for your OK." },
  { value: 1, label: "If risky", meaning: "Safe actions run on their own; risky and destructive ones ask you first." },
  { value: 2, label: "Full auto", meaning: "Everything runs on its own, except the actions you lock." },
];

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

/* ------------------------------------------------------------------------------------------------
 * Icons (drawn for this file)
 * ----------------------------------------------------------------------------------------------*/

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function SparkIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" {...stroke}>
      <path d="M8 2.5c.4 2.7 1.8 4.1 4.5 4.5-2.7.4-4.1 1.8-4.5 4.5C7.6 8.8 6.2 7.4 3.5 7c2.7-.4 4.1-1.8 4.5-4.5Z" />
    </svg>
  );
}

function DotIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" {...stroke}>
      <circle cx="8" cy="8" r="2.25" />
    </svg>
  );
}

function WarnIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" {...stroke}>
      <path d="M8 2.75 14 13H2z" />
      <path d="M8 6.75v2.5M8 11.1v.05" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" {...stroke}>
      <circle cx="8" cy="8" r="5.75" />
      <path d="M8 5.25v3.25M8 10.6v.05" />
    </svg>
  );
}

function LockIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" {...stroke}>
      <rect x="3.5" y="7.25" width="9" height="6.5" rx="1.75" />
      <path d={open ? "M5.5 7.25V5.5a2.5 2.5 0 0 1 4.9-.7" : "M5.5 7.25V5.5a2.5 2.5 0 0 1 5 0v1.75"} />
      <path d="M8 10v1" />
    </svg>
  );
}

/* A number that rolls to its new value. */
function Count({ value }: { value: number }) {
  const prev = useRef(value);
  const dir = value > prev.current ? "up" : value < prev.current ? "down" : "none";
  useEffect(() => {
    prev.current = value;
  }, [value]);
  return (
    <span className="ui-at-dial__count" aria-hidden="true">
      <span key={value} data-dir={dir}>
        {value}
      </span>
    </span>
  );
}

/* ------------------------------------------------------------------------------------------------
 * Component
 * ----------------------------------------------------------------------------------------------*/

export function AutonomyDial({
  actions,
  level: levelProp,
  defaultLevel = 1,
  onLevelChange,
  pinned: pinnedProp,
  defaultPinned = [],
  onPinnedChange,
  title = "Agent permissions",
  subtitle = "What it may do without asking you",
  className,
}: AutonomyDialProps) {
  const uid = useId();
  const [innerLevel, setInnerLevel] = useState<AutonomyLevel>(defaultLevel);
  const level = levelProp ?? innerLevel;
  const [innerPinned, setInnerPinned] = useState<string[]>(defaultPinned);
  const pinned = pinnedProp ?? innerPinned;
  const [announce, setAnnounce] = useState("");

  const runs = actions.filter((a) => !asksFirst(a, level, pinned));
  const asks = actions.filter((a) => asksFirst(a, level, pinned));

  const setLevel = (next: AutonomyLevel) => {
    if (levelProp === undefined) setInnerLevel(next);
    onLevelChange?.(next);
  };
  const togglePin = (id: string) => {
    const next = pinned.includes(id) ? pinned.filter((p) => p !== id) : [...pinned, id];
    if (pinnedProp === undefined) setInnerPinned(next);
    onPinnedChange?.(next);
  };

  // Announce changes politely, after the first render.
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const lv = LEVELS[level]!.label;
    setAnnounce(
      \`\${lv}: \${runs.length} action\${runs.length === 1 ? "" : "s"} run on their own, \${asks.length} ask\${asks.length === 1 ? "s" : ""} you first.\`,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level, pinned.join("|")]);

  /* Rows glide to their new place (FLIP), a beat after each other ------------------------------ */
  const listRef = useRef<HTMLDivElement>(null);
  const rects = useRef(new Map<string, number>());
  const bodyRef = useRef<HTMLDivElement>(null);
  const lastHeight = useRef<number | null>(null);
  const layoutKey = \`\${level}|\${pinned.join(",")}|\${actions.map((a) => a.id).join(",")}\`;
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const nodes = Array.from(list.querySelectorAll<HTMLElement>("[data-flip]"));
    const reduce = prefersReducedMotion();
    // The card's height follows, clipped only while it glides.
    const frame = bodyRef.current;
    if (frame) {
      const h = frame.offsetHeight;
      const before = lastHeight.current;
      lastHeight.current = h;
      if (before !== null && Math.abs(before - h) > 1 && !reduce) {
        frame.style.overflow = "clip";
        const glide = frame.animate([{ height: \`\${before}px\` }, { height: \`\${h}px\` }], {
          duration: 300,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        });
        const done = () => {
          frame.style.overflow = "";
        };
        glide.onfinish = done;
        glide.oncancel = done;
      }
    }
    let order = 0;
    for (const el of nodes) {
      const key = el.dataset.flip!;
      const top = el.getBoundingClientRect().top;
      const before = rects.current.get(key);
      rects.current.set(key, top);
      if (before === undefined || reduce) continue;
      const dy = before - top;
      if (Math.abs(dy) < 1) continue;
      el.animate([{ transform: \`translateY(\${dy}px)\` }, { transform: "translateY(0)" }], {
        duration: 420,
        delay: Math.min(order, 6) * 30,
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        fill: "backwards",
      });
      order += 1;
    }
  }, [layoutKey]);

  const row = (a: AgentAction) => {
    const isPinned = pinned.includes(a.id);
    return (
      <li key={a.id} className="ui-at-dial__row" data-flip={a.id} data-pinned={isPinned || undefined}>
        <span className="ui-at-dial__icon" aria-hidden="true">
          {a.icon ?? <DotIcon />}
        </span>
        <span className="ui-at-dial__text">
          <span className="ui-at-dial__label-line">
            <span className="ui-at-dial__label">{a.label}</span>
            {a.risk !== "safe" && (
              <span className="ui-at-dial__tag" data-risk={a.risk}>
                {a.risk === "destructive" ? <StopIcon /> : <WarnIcon />}
                {a.risk === "destructive" ? "Destructive" : "Risky"}
              </span>
            )}
          </span>
          {a.detail && <span className="ui-at-dial__detail">{a.detail}</span>}
        </span>
        <button
          type="button"
          className="ui-at-dial__lock"
          aria-pressed={isPinned}
          aria-label={\`Always ask before \${a.label}\`}
          title={isPinned ? "Always asks – click to unlock" : "Lock: always ask"}
          onClick={() => togglePin(a.id)}
        >
          <LockIcon open={!isPinned} />
        </button>
      </li>
    );
  };

  const meaningId = \`\${uid}-meaning\`;

  return (
    <div
      className={["ui-at-dial", className].filter(Boolean).join(" ")}
    >
      <style href="ui-autonomy-dial" precedence="default">
        {css}
      </style>
      <div ref={bodyRef} className="ui-at-dial__frame">
        <div className="ui-at-dial__panel">
          <div className="ui-at-dial__head">
            <span className="ui-at-dial__mark" aria-hidden="true">
              <SparkIcon />
            </span>
            <div className="ui-at-dial__heading">
              <h3 className="ui-at-dial__title">{title}</h3>
              {subtitle && <p className="ui-at-dial__subtitle">{subtitle}</p>}
            </div>
          </div>
          <div className="ui-at-dial__levels" role="radiogroup" aria-label="Autonomy" aria-describedby={meaningId}>
            {LEVELS.map((l) => (
              <label key={l.value} className="ui-at-dial__level" data-on={l.value === level || undefined}>
                <input
                  type="radio"
                  name={\`\${uid}-level\`}
                  value={l.value}
                  checked={l.value === level}
                  onChange={() => setLevel(l.value)}
                />
                <span>{l.label}</span>
              </label>
            ))}
            <span
              className="ui-at-dial__pill"
              aria-hidden="true"
              style={{ transform: \`translateX(\${level * 100}%)\` }}
            />
          </div>
          <p id={meaningId} className="ui-at-dial__sr">
            {LEVELS[level]!.meaning}
          </p>
        </div>

        <div ref={listRef} className="ui-at-dial__groups">
          <section className="ui-at-dial__group" aria-labelledby={\`\${uid}-runs\`}>
            <h4 id={\`\${uid}-runs\`} className="ui-at-dial__group-title" data-flip="__runs">
              Runs on its own <Count value={runs.length} />
              <span className="ui-at-dial__sr"> ({runs.length})</span>
            </h4>
            {runs.length ? (
              <ul className="ui-at-dial__list">{runs.map(row)}</ul>
            ) : (
              <p className="ui-at-dial__empty" data-flip="__runs-empty">
                Every action waits for you
              </p>
            )}
          </section>
          <section className="ui-at-dial__group" aria-labelledby={\`\${uid}-asks\`}>
            <h4 id={\`\${uid}-asks\`} className="ui-at-dial__group-title" data-flip="__asks">
              Asks you first <Count value={asks.length} />
              <span className="ui-at-dial__sr"> ({asks.length})</span>
            </h4>
            {asks.length ? (
              <ul className="ui-at-dial__list">{asks.map(row)}</ul>
            ) : (
              <p className="ui-at-dial__empty" data-flip="__asks-empty">
                Nothing waits for you – lock an action to make it ask
              </p>
            )}
          </section>
        </div>
      </div>
      <span className="ui-at-dial__sr" role="status" aria-live="polite">
        {announce}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------------------------------------
 * Styles
 * ----------------------------------------------------------------------------------------------*/

const css = /* css */ \`
.ui-at-dial {
  --frame: #f2f6fa;
  --panel: #ffffff;
  --soft: rgba(26, 62, 112, 0.06);
  --hairline: #dae2ec;
  --firm: #cbd6e4;
  --ink: #00162b;
  --text: rgba(0, 22, 43, 0.66);
  --muted: rgba(0, 22, 43, 0.54);
  --berry: #851437;
  --ring: #8fbdf2;
  --wait-ink: #775810;
  --wait-fill: #fdf6dd;
  --wait-line: #fae6a0;
  --bad-ink: #8a3a22;
  --bad-fill: #fdeee8;
  --bad-line: #f5d5c9;
  --pebble-light: rgba(26, 62, 112, 0.4);
  --shadow-drop: 0 8px 16px -8px rgba(26, 62, 112, 0.2);
  --shadow-raised: 0 18px 30px -16px rgba(26, 62, 112, 0.38), 0 4px 10px -6px rgba(26, 62, 112, 0.18);
  --shadow-float: 0 24px 48px -24px rgba(26, 62, 112, 0.3);
  --ease: cubic-bezier(0.16, 1, 0.3, 1);

  position: relative;
  box-sizing: border-box;
  width: 100%;
  max-width: 400px;
  container-type: inline-size;
  font-family: "Avenir Next", Avenir, system-ui, sans-serif;
  font-size: 13px;
  line-height: 1.45;
  color: var(--text);
  -webkit-font-smoothing: antialiased;
}
:where(.dark, [data-theme="dark"]) .ui-at-dial {
  --frame: #0f2747;
  --panel: #16345c;
  --soft: rgba(255, 255, 255, 0.07);
  --hairline: rgba(255, 255, 255, 0.12);
  --firm: rgba(255, 255, 255, 0.18);
  --ink: rgba(255, 255, 255, 0.94);
  --text: rgba(255, 255, 255, 0.72);
  --muted: rgba(255, 255, 255, 0.56);
  --berry: #a8204d;
  --ring: rgba(143, 189, 242, 0.6);
  --wait-ink: #f3d27a;
  --wait-fill: rgba(243, 210, 122, 0.14);
  --wait-line: rgba(243, 210, 122, 0.3);
  --bad-ink: #f2a48c;
  --bad-fill: rgba(242, 164, 140, 0.14);
  --bad-line: rgba(242, 164, 140, 0.3);
  --pebble-light: rgba(3, 12, 28, 0.6);
  --shadow-drop: 0 8px 16px -8px rgba(3, 12, 28, 0.6);
  --shadow-raised: 0 18px 30px -16px rgba(3, 12, 28, 0.8), 0 4px 10px -6px rgba(3, 12, 28, 0.6);
  --shadow-float: 0 24px 48px -24px rgba(3, 12, 28, 0.7);
}
.ui-at-dial *, .ui-at-dial *::before, .ui-at-dial *::after { box-sizing: border-box; }
.ui-at-dial p, .ui-at-dial h3, .ui-at-dial h4, .ui-at-dial ul { margin: 0; padding: 0; }

.ui-at-dial__frame {
  background: var(--frame);
  border: 1px solid var(--hairline);
  border-radius: 22px;
  padding: 6px;
  box-shadow: var(--shadow-float);
}
.ui-at-dial__panel {
  background: var(--panel);
  border: 1px solid var(--hairline);
  border-radius: 16px;
  padding: 14px 14px 12px;
  box-shadow: var(--shadow-raised);
  display: grid;
  gap: 12px;
}
.ui-at-dial__head { display: flex; align-items: center; gap: 10px; min-width: 0; }
.ui-at-dial__mark {
  flex: none;
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: var(--panel);
  border: 1px solid var(--hairline);
  box-shadow: inset 0 -2px 6px -4px var(--pebble-light);
  color: var(--berry);
}
.ui-at-dial__mark svg { width: 16px; height: 16px; }
.ui-at-dial__heading { min-width: 0; }
.ui-at-dial__title {
  font-family: "Avenir Next Condensed", "Avenir Next", Avenir, system-ui, sans-serif;
  font-weight: 700;
  font-size: 18px;
  line-height: 1.2;
  color: var(--ink);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-at-dial__subtitle { color: var(--text); font-size: 12.5px; }

.ui-at-dial__levels {
  position: relative;
  display: flex;
  padding: 3px;
  border-radius: 12px;
  background: var(--soft);
  border: 1px solid var(--hairline);
}
.ui-at-dial__level {
  position: relative;
  z-index: 1;
  flex: 1 1 0;
  display: grid;
  place-items: center;
  min-width: 0;
  height: 32px;
  border-radius: 9px;
  color: var(--text);
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  transition: color 150ms var(--ease);
}
.ui-at-dial__level > span { overflow: hidden; text-overflow: ellipsis; padding: 0 6px; }
.ui-at-dial__level[data-on] { color: var(--ink); font-weight: 600; }
.ui-at-dial__level:hover:not([data-on]) { color: var(--ink); }
.ui-at-dial__level input { position: absolute; inset: 0; opacity: 0; margin: 0; cursor: pointer; }
.ui-at-dial__level:has(input:focus-visible) { box-shadow: 0 0 0 3px var(--ring); }
.ui-at-dial__pill {
  position: absolute;
  top: 3px;
  bottom: 3px;
  left: 3px;
  width: calc((100% - 6px) / 3);
  border-radius: 9px;
  background: var(--panel);
  border: 1px solid var(--hairline);
  box-shadow: var(--shadow-drop);
  transition: transform 300ms var(--ease);
}

.ui-at-dial__groups { display: grid; gap: 4px; padding: 10px 2px 2px; }
.ui-at-dial__group { display: grid; gap: 6px; }
.ui-at-dial__group + .ui-at-dial__group { margin-top: 8px; }
.ui-at-dial__group-title {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 8px;
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: var(--muted);
}
.ui-at-dial__count {
  display: inline-grid;
  place-items: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 6px;
  border: 1px solid var(--hairline);
  background: var(--panel);
  color: var(--ink);
  letter-spacing: 0;
  font-variant-numeric: tabular-nums;
  overflow: hidden;
}
.ui-at-dial__count > span { display: block; }
.ui-at-dial__count > span[data-dir="up"] { animation: ui-at-dial-roll-up 300ms var(--ease) both; }
.ui-at-dial__count > span[data-dir="down"] { animation: ui-at-dial-roll-down 300ms var(--ease) both; }
.ui-at-dial__list { list-style: none; display: grid; gap: 6px; }
.ui-at-dial__row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 42px;
  padding: 7px 8px 7px 12px;
  border-radius: 12px;
  background: var(--panel);
  border: 1px solid var(--hairline);
  box-shadow: var(--shadow-drop);
  color: var(--ink);
  min-width: 0;
}
.ui-at-dial__icon { flex: none; display: grid; place-items: center; width: 18px; height: 18px; color: var(--ink); }
.ui-at-dial__icon svg { width: 16px; height: 16px; }
.ui-at-dial__text { flex: 1; min-width: 0; display: grid; }
.ui-at-dial__label-line { display: flex; align-items: center; gap: 6px; min-width: 0; }
.ui-at-dial__label { min-width: 0; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ui-at-dial__detail { color: var(--muted); font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ui-at-dial__tag {
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 3px;
  height: 20px;
  padding: 0 7px;
  border-radius: 999px;
  border: 1px solid var(--wait-line);
  background: var(--wait-fill);
  color: var(--wait-ink);
  font-size: 11px;
  font-weight: 600;
}
.ui-at-dial__tag svg { width: 11px; height: 11px; }
.ui-at-dial__tag[data-risk="destructive"] { border-color: var(--bad-line); background: var(--bad-fill); color: var(--bad-ink); }
.ui-at-dial__lock {
  appearance: none;
  flex: none;
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--muted);
  cursor: pointer;
  opacity: 0;
  transition: opacity 150ms var(--ease), background-color 150ms var(--ease), color 150ms var(--ease), transform 150ms var(--ease);
}
.ui-at-dial__lock svg { width: 15px; height: 15px; }
.ui-at-dial__row:hover .ui-at-dial__lock,
.ui-at-dial__lock:focus-visible,
.ui-at-dial__lock[aria-pressed="true"] { opacity: 1; }
.ui-at-dial__lock:hover { background: var(--soft); color: var(--ink); }
.ui-at-dial__lock:active { transform: scale(0.92); }
.ui-at-dial__lock[aria-pressed="true"] { color: var(--ink); }
.ui-at-dial__lock:focus-visible { outline: none; box-shadow: 0 0 0 3px var(--ring); }
.ui-at-dial__empty {
  display: grid;
  place-items: center;
  min-height: 42px;
  padding: 8px 12px;
  border-radius: 12px;
  border: 1px dashed var(--firm);
  background: var(--soft);
  color: var(--muted);
  font-size: 12px;
  text-align: center;
  animation: ui-at-dial-fade 300ms var(--ease) both;
}

.ui-at-dial__sr {
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

@keyframes ui-at-dial-roll-up { from { transform: translateY(70%); opacity: 0; } to { transform: none; opacity: 1; } }
@keyframes ui-at-dial-roll-down { from { transform: translateY(-70%); opacity: 0; } to { transform: none; opacity: 1; } }
@keyframes ui-at-dial-fade { from { opacity: 0; } to { opacity: 1; } }

@container (max-width: 340px) {
  .ui-at-dial__detail { display: none; }
  .ui-at-dial__level { height: 30px; font-size: 12px; }
  .ui-at-dial__level > span { padding: 0 3px; }
  .ui-at-dial__row { padding-left: 10px; gap: 8px; }
}
@media (hover: none) {
  .ui-at-dial__lock { opacity: 1; width: 36px; height: 36px; }
  .ui-at-dial__row { min-height: 50px; }
  .ui-at-dial__level { height: 40px; }
}
@media (prefers-reduced-motion: reduce) {
  .ui-at-dial, .ui-at-dial *, .ui-at-dial *::before, .ui-at-dial *::after {
    transition-duration: 0ms !important;
    animation-duration: 0ms !important;
    animation-delay: 0ms !important;
  }
}
\`;
`;export{e as default};
