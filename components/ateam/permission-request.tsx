"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";

/* ------------------------------------------------------------------------------------------------
 * Types
 * ----------------------------------------------------------------------------------------------*/

export type PermissionScope = "once" | "timed" | "always";
export type PermissionRisk = "safe" | "risky" | "destructive";

export type PermissionAgent = { name: string; model?: string; avatar?: ReactNode };

export type PermissionPreviewItem = { id: string; label: ReactNode; meta?: ReactNode; icon?: ReactNode };

export type PermissionDecision = {
  allow: boolean;
  scope: PermissionScope;
  /** When it was decided, in ms since epoch. */
  at: number;
  /** For a timed grant: when it runs out, in ms since epoch. */
  until?: number;
};

export type PermissionRequestProps = {
  agent: PermissionAgent;
  /** What it wants to do, read after "wants to", e.g. "push to main". */
  action: string;
  /** Where, e.g. "acme/web" or "Stripe · live mode". */
  target?: string;
  toolIcon?: ReactNode;
  risk?: PermissionRisk;
  /** The agent's own words on why it needs this. */
  reason?: string;
  preview?: PermissionPreviewItem[];
  previewTitle?: string;
  previewLimit?: number;
  scopes?: PermissionScope[];
  scope?: PermissionScope;
  defaultScope?: PermissionScope;
  onScopeChange?: (scope: PermissionScope) => void;
  /** Minutes a timed grant holds. */
  duration?: number;
  decision?: PermissionDecision | null;
  defaultDecision?: PermissionDecision | null;
  /** Allow, Deny – and null for Revoke, Change or Ask again. */
  onDecisionChange?: (decision: PermissionDecision | null) => void;
  /** The clock for the time left; without it the card ticks every second while a timed grant runs. */
  now?: number;
  className?: string;
};

/* ------------------------------------------------------------------------------------------------
 * Helpers
 * ----------------------------------------------------------------------------------------------*/

const ALL_SCOPES: PermissionScope[] = ["once", "timed", "always"];

function durationWords(minutes: number) {
  if (minutes % 60 === 0) {
    const h = minutes / 60;
    return `${h} hour${h === 1 ? "" : "s"}`;
  }
  if (minutes > 60) return `${Math.floor(minutes / 60)} h ${minutes % 60} min`;
  return `${minutes} minute${minutes === 1 ? "" : "s"}`;
}

function scopeChoice(scope: PermissionScope, minutes: number) {
  if (scope === "once") return "Just once";
  if (scope === "always") return "Always";
  if (minutes % 60 === 0) return durationWords(minutes);
  return `${minutes} min`;
}

function allowLabel(scope: PermissionScope, minutes: number) {
  if (scope === "once") return "Allow once";
  if (scope === "always") return "Always allow";
  return `Allow for ${durationWords(minutes)}`;
}

function timeOfDay(ms: number) {
  return new Date(ms).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function left(ms: number) {
  const min = Math.max(0, Math.ceil(ms / 60000));
  if (min < 60) return `${min} min left`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h} h ${m} min left` : `${h} h left`;
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

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

function FileIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" {...stroke}>
      <path d="M4.25 2.25h5l2.5 2.5v9h-7.5z" />
      <path d="M6.25 7.5h3.5M6.25 10h3.5" />
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

function StatusMark({ kind }: { kind: "allowed" | "denied" | "expired" }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" {...stroke} strokeWidth={1.5}>
      <circle cx="10" cy="10" r="7.5" />
      {kind === "allowed" && <path className="ui-at-perm__draw" pathLength={1} d="m6.75 10.25 2.25 2.25 4.25-4.5" />}
      {kind === "denied" && <path className="ui-at-perm__draw" pathLength={1} d="m7.5 7.5 5 5m0-5-5 5" />}
      {kind === "expired" && <path className="ui-at-perm__draw" pathLength={1} d="M10 6.25V10l2.5 1.5" />}
    </svg>
  );
}

/* ------------------------------------------------------------------------------------------------
 * Component
 * ----------------------------------------------------------------------------------------------*/

export function PermissionRequest({
  agent,
  action,
  target,
  toolIcon,
  risk = "risky",
  reason,
  preview,
  previewTitle = "What will happen",
  previewLimit = 3,
  scopes = ALL_SCOPES,
  scope: scopeProp,
  defaultScope = "once",
  onScopeChange,
  duration = 60,
  decision: decisionProp,
  defaultDecision = null,
  onDecisionChange,
  now: nowProp,
  className,
}: PermissionRequestProps) {
  const uid = useId();
  const titleId = `${uid}-title`;
  const reasonId = `${uid}-reason`;

  // Destructive actions can never be allowed for always, whatever `scopes` says.
  const offered = scopes.filter((s, i) => ALL_SCOPES.includes(s) && scopes.indexOf(s) === i && !(risk === "destructive" && s === "always"));
  const choices: PermissionScope[] = offered.length ? offered : ["once"];

  const [innerScope, setInnerScope] = useState<PermissionScope>(defaultScope);
  const rawScope = scopeProp ?? innerScope;
  const scope = choices.includes(rawScope) ? rawScope : choices[0]!;

  const decisionControlled = decisionProp !== undefined;
  const [innerDecision, setInnerDecision] = useState<PermissionDecision | null>(defaultDecision);
  const decision = decisionControlled ? decisionProp : innerDecision;

  const [tick, setTick] = useState(() => Date.now());
  const now = nowProp ?? tick;
  const timedRunning = !!decision?.allow && decision.scope === "timed" && decision.until !== undefined;
  useEffect(() => {
    if (nowProp !== undefined || !timedRunning) return;
    setTick(Date.now());
    const t = setInterval(() => setTick(Date.now()), 1000);
    return () => clearInterval(t);
  }, [nowProp, timedRunning]);

  const setScope = (next: PermissionScope) => {
    if (scopeProp === undefined) setInnerScope(next);
    onScopeChange?.(next);
  };

  const rootRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const restoreFocus = useRef<"row" | "card" | null>(null);

  const decide = (next: PermissionDecision | null) => {
    restoreFocus.current = rootRef.current?.contains(document.activeElement) ? (next ? "row" : "card") : null;
    if (!decisionControlled) setInnerDecision(next);
    onDecisionChange?.(next);
  };

  const allow = () => {
    const at = nowProp ?? Date.now();
    decide({ allow: true, scope, at, until: scope === "timed" ? at + duration * 60000 : undefined });
  };
  const deny = () => decide({ allow: false, scope, at: nowProp ?? Date.now() });

  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.defaultPrevented) return;
    if (e.key === "Escape") {
      e.preventDefault();
      deny();
    } else if (e.key === "Enter" && !e.shiftKey) {
      const t = e.target as HTMLElement;
      if (t.tagName === "BUTTON" || t.tagName === "A") return; // the focused button does its own thing
      e.preventDefault();
      allow();
    }
  };

  /* Height follows; clip only while it glides ------------------------------------------------- */
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [ready, setReady] = useState(false);
  const [gliding, setGliding] = useState(false);
  useLayoutEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    const measure = () => setHeight(el.offsetHeight);
    measure();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    ro?.observe(el);
    const raf = requestAnimationFrame(() => setReady(true));
    return () => {
      ro?.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  const expired = timedRunning && now >= decision!.until!;
  const state = !decision ? "pending" : expired ? "expired" : decision.allow ? "allowed" : "denied";
  const prevState = useRef(state);
  useEffect(() => {
    if (prevState.current === state) return;
    prevState.current = state;
    setGliding(true);
    const t = setTimeout(() => setGliding(false), prefersReducedMotion() ? 0 : 480);
    return () => clearTimeout(t);
  }, [state]);

  useEffect(() => {
    const where = restoreFocus.current;
    if (!where) return;
    restoreFocus.current = null;
    const root = rootRef.current;
    if (!root) return;
    const el =
      where === "row"
        ? root.querySelector<HTMLElement>(".ui-at-perm__undo")
        : root.querySelector<HTMLElement>(".ui-at-perm__allow");
    el?.focus({ preventScroll: true });
  }, [state]);

  /* Render -------------------------------------------------------------------------------------- */
  const items = preview ?? [];
  const shown = items.slice(0, previewLimit);
  const hidden = items.length - shown.length;
  const avatar = agent.avatar ?? <span className="ui-at-perm__initials">{initials(agent.name)}</span>;

  let line: ReactNode = null;
  if (decision) {
    const total = decision.until !== undefined ? decision.until - decision.at : 0;
    const remaining = decision.until !== undefined ? decision.until - now : 0;
    const fraction = total > 0 ? Math.max(0, Math.min(1, remaining / total)) : 0;
    const head =
      state === "expired"
        ? "Access expired"
        : !decision.allow
          ? "Denied"
          : decision.scope === "once"
            ? "Allowed once"
            : decision.scope === "always"
              ? "Always allowed"
              : `Allowed for ${durationWords(Math.round(total / 60000))}`;
    const sub =
      state === "expired"
        ? `${agent.name} will ask again`
        : !decision.allow
          ? `${agent.name} was told and won't do it`
          : decision.scope === "once"
            ? `At ${timeOfDay(decision.at)} · it won't carry over`
            : decision.scope === "always"
              ? `Since ${timeOfDay(decision.at)} · until you revoke it`
              : `${left(remaining)} · until ${timeOfDay(decision.until!)}`;
    const undo = state === "expired" ? "Ask again" : decision.allow && decision.scope !== "once" ? "Revoke" : "Change";
    line = (
      <div className="ui-at-perm__frame ui-at-perm__frame--line" key={`line-${state}`}>
        <div className="ui-at-perm__line" data-state={state} role="status">
          <span className="ui-at-perm__mark">
            <StatusMark kind={state === "expired" ? "expired" : decision.allow ? "allowed" : "denied"} />
          </span>
          <div className="ui-at-perm__line-text">
            <p className="ui-at-perm__line-head">
              <strong>{head}</strong>
              <span className="ui-at-perm__line-action"> · {action}</span>
            </p>
            <p className="ui-at-perm__line-sub">{sub}</p>
          </div>
          <button
            type="button"
            className="ui-at-perm__undo"
            onClick={() => decide(null)}
            aria-label={`${undo}: ${agent.name} ${action}`}
          >
            {undo}
          </button>
          {state === "allowed" && decision.scope === "timed" && (
            <span className="ui-at-perm__drain" aria-hidden="true">
              <span style={{ transform: `scaleX(${fraction})` }} />
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className={["ui-at-perm", className].filter(Boolean).join(" ")}
      data-risk={risk}
      data-state={state}
      data-ready={ready || undefined}
      data-gliding={gliding || undefined}
      style={{ height }}
    >
      <style href="ui-permission-request" precedence="default">
        {css}
      </style>
      <div ref={bodyRef}>
        {decision ? (
          line
        ) : (
          <div
            className="ui-at-perm__frame"
            role="dialog"
            aria-labelledby={titleId}
            aria-describedby={reason ? reasonId : undefined}
            onKeyDown={onKeyDown}
          >
            <div className="ui-at-perm__panel">
              <div className="ui-at-perm__head">
                <span className="ui-at-perm__avatar" aria-hidden="true">
                  {avatar}
                </span>
                <div className="ui-at-perm__heading">
                  <h3 id={titleId} className="ui-at-perm__title">
                    <strong>{agent.name}</strong> wants to <strong>{action}</strong>
                  </h3>
                  {(target || agent.model) && (
                    <p className="ui-at-perm__target">
                      {toolIcon && (
                        <span className="ui-at-perm__tool" aria-hidden="true">
                          {toolIcon}
                        </span>
                      )}
                      <span>{target ?? agent.model}</span>
                    </p>
                  )}
                </div>
                {risk !== "safe" && (
                  <span className="ui-at-perm__tag" data-risk={risk}>
                    {risk === "destructive" ? <StopIcon /> : <WarnIcon />}
                    {risk === "destructive" ? "Destructive" : "Risky"}
                  </span>
                )}
              </div>
              {reason && (
                <p id={reasonId} className="ui-at-perm__reason">
                  {reason}
                </p>
              )}
              {items.length > 0 && (
                <div className="ui-at-perm__preview">
                  <p className="ui-at-perm__preview-title">
                    {previewTitle}
                    <span className="ui-at-perm__count">{items.length}</span>
                  </p>
                  <ul className="ui-at-perm__list">
                    {shown.map((item, i) => (
                      <li key={item.id} className="ui-at-perm__item" style={{ animationDelay: `${60 + i * 50}ms` }}>
                        <span className="ui-at-perm__item-icon" aria-hidden="true">
                          {item.icon ?? <FileIcon />}
                        </span>
                        <span className="ui-at-perm__item-label">{item.label}</span>
                        {item.meta != null && <span className="ui-at-perm__item-meta">{item.meta}</span>}
                      </li>
                    ))}
                  </ul>
                  {hidden > 0 && <p className="ui-at-perm__more">{hidden} more</p>}
                </div>
              )}
            </div>
            <div className="ui-at-perm__tray">
              {choices.length > 1 && (
                <div className="ui-at-perm__scopes" role="radiogroup" aria-label="How long">
                  {choices.map((s) => (
                    <label key={s} className="ui-at-perm__scope" data-on={s === scope || undefined}>
                      <input
                        type="radio"
                        name={`${uid}-scope`}
                        value={s}
                        checked={s === scope}
                        onChange={() => setScope(s)}
                      />
                      <span>{scopeChoice(s, duration)}</span>
                    </label>
                  ))}
                  <span
                    className="ui-at-perm__thumb"
                    aria-hidden="true"
                    style={{
                      width: `calc((100% - 6px) / ${choices.length})`,
                      transform: `translateX(${choices.indexOf(scope) * 100}%)`,
                    }}
                  />
                </div>
              )}
              {risk === "destructive" && scopes.includes("always") && (
                <p className="ui-at-perm__note">Destructive actions can't be allowed for always</p>
              )}
              <div className="ui-at-perm__buttons">
                <button type="button" className="ui-at-perm__deny" onClick={deny} aria-keyshortcuts="Escape">
                  Deny
                  <kbd aria-hidden="true">Esc</kbd>
                </button>
                <button type="button" className="ui-at-perm__allow" onClick={allow} aria-keyshortcuts="Enter">
                  <span className="ui-at-perm__allow-label" key={scope}>
                    {allowLabel(scope, duration)}
                  </span>
                  <kbd aria-hidden="true">↵</kbd>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------------------------------
 * Styles
 * ----------------------------------------------------------------------------------------------*/

const css = /* css */ `
.ui-at-perm {
  --frame: #f2f6fa;
  --panel: #ffffff;
  --soft: rgba(26, 62, 112, 0.06);
  --hairline: #dae2ec;
  --firm: #cbd6e4;
  --ink: #00162b;
  --text: rgba(0, 22, 43, 0.66);
  --muted: rgba(0, 22, 43, 0.54);
  --berry: #851437;
  --berry-hover: #6d0f2d;
  --berry-shadow: rgba(133, 20, 55, 0.6);
  --danger-action: #8a3a22;
  --danger-action-hover: #73301c;
  --danger-shadow: rgba(138, 58, 34, 0.55);
  --secondary: #fbfcfe;
  --ring: #8fbdf2;
  --ok-ink: #1d6a34;
  --ok-fill: #eafbee;
  --ok-line: #c9f5cf;
  --ok-bar: #2f8a4b;
  --wait-ink: #775810;
  --wait-fill: #fdf6dd;
  --wait-line: #fae6a0;
  --bad-ink: #8a3a22;
  --bad-fill: #fdeee8;
  --bad-line: #f5d5c9;
  --pebble-light: rgba(26, 62, 112, 0.4);
  --plus: #1d6a34;
  --minus: #8a3a22;
  --shadow-drop: 0 8px 16px -8px rgba(26, 62, 112, 0.2);
  --shadow-raised: 0 18px 30px -16px rgba(26, 62, 112, 0.38), 0 4px 10px -6px rgba(26, 62, 112, 0.18);
  --shadow-float: 0 24px 48px -24px rgba(26, 62, 112, 0.3);
  --ease: cubic-bezier(0.16, 1, 0.3, 1);

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
:where(.dark, [data-theme="dark"]) .ui-at-perm {
  --frame: #0f2747;
  --panel: #16345c;
  --soft: rgba(255, 255, 255, 0.07);
  --hairline: rgba(255, 255, 255, 0.12);
  --firm: rgba(255, 255, 255, 0.18);
  --ink: rgba(255, 255, 255, 0.94);
  --text: rgba(255, 255, 255, 0.72);
  --muted: rgba(255, 255, 255, 0.56);
  --berry: #a8204d;
  --berry-hover: #bd2a5a;
  --berry-shadow: rgba(3, 12, 28, 0.6);
  --danger-action: #b5482a;
  --danger-action-hover: #c85636;
  --danger-shadow: rgba(3, 12, 28, 0.6);
  --secondary: rgba(255, 255, 255, 0.06);
  --ring: rgba(143, 189, 242, 0.6);
  --ok-ink: #7fe0a0;
  --ok-fill: rgba(127, 224, 160, 0.14);
  --ok-line: rgba(127, 224, 160, 0.3);
  --ok-bar: #7fe0a0;
  --wait-ink: #f3d27a;
  --wait-fill: rgba(243, 210, 122, 0.14);
  --wait-line: rgba(243, 210, 122, 0.3);
  --bad-ink: #f2a48c;
  --bad-fill: rgba(242, 164, 140, 0.14);
  --bad-line: rgba(242, 164, 140, 0.3);
  --pebble-light: rgba(3, 12, 28, 0.6);
  --plus: #7fe0a0;
  --minus: #f2a48c;
  --shadow-drop: 0 8px 16px -8px rgba(3, 12, 28, 0.6);
  --shadow-raised: 0 18px 30px -16px rgba(3, 12, 28, 0.8), 0 4px 10px -6px rgba(3, 12, 28, 0.6);
  --shadow-float: 0 24px 48px -24px rgba(3, 12, 28, 0.7);
}
.ui-at-perm *, .ui-at-perm *::before, .ui-at-perm *::after { box-sizing: border-box; }
.ui-at-perm[data-ready] { transition: height 300ms var(--ease); }
.ui-at-perm[data-gliding] { overflow: clip; overflow-clip-margin: 48px; }
.ui-at-perm p, .ui-at-perm h3, .ui-at-perm ul { margin: 0; padding: 0; }

.ui-at-perm__frame {
  background: var(--frame);
  border: 1px solid var(--hairline);
  border-radius: 22px;
  padding: 6px;
  box-shadow: var(--shadow-float);
  animation: ui-at-perm-in 300ms var(--ease) both;
}
.ui-at-perm__frame--line { padding: 4px; border-radius: 20px; }
.ui-at-perm__panel {
  background: var(--panel);
  border: 1px solid var(--hairline);
  border-radius: 16px;
  box-shadow: var(--shadow-raised);
  overflow: hidden;
}
.ui-at-perm__head { display: flex; align-items: flex-start; gap: 10px; padding: 14px 14px 0; min-width: 0; }
.ui-at-perm__avatar {
  flex: none;
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--panel);
  border: 1px solid var(--hairline);
  box-shadow: inset 0 -2px 6px -4px var(--pebble-light);
  color: var(--ink);
  overflow: hidden;
}
.ui-at-perm__avatar svg { width: 18px; height: 18px; }
.ui-at-perm__initials { font-size: 12px; font-weight: 700; letter-spacing: 0.02em; }
.ui-at-perm__heading { flex: 1; min-width: 0; padding-top: 1px; }
.ui-at-perm__title { font-size: 13.5px; font-weight: 500; line-height: 1.35; color: var(--text); overflow-wrap: anywhere; }
.ui-at-perm__title strong { color: var(--ink); font-weight: 700; }
.ui-at-perm__target { display: flex; align-items: center; gap: 5px; margin-top: 2px; color: var(--muted); font-size: 12px; min-width: 0; }
.ui-at-perm__target > span:last-child { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ui-at-perm__tool { display: inline-grid; place-items: center; width: 12px; height: 12px; flex: none; color: var(--ink); }
.ui-at-perm__tool svg { width: 12px; height: 12px; }
.ui-at-perm__tag {
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  border: 1px solid var(--wait-line);
  background: var(--wait-fill);
  color: var(--wait-ink);
  font-size: 11.5px;
  font-weight: 600;
}
.ui-at-perm__tag svg { width: 12px; height: 12px; }
.ui-at-perm__tag[data-risk="destructive"] { border-color: var(--bad-line); background: var(--bad-fill); color: var(--bad-ink); }
.ui-at-perm__reason {
  margin: 10px 14px 0 60px !important;
  padding-left: 11px !important;
  border-left: 2px solid var(--hairline);
  color: var(--text);
  overflow-wrap: anywhere;
}
.ui-at-perm__preview { margin-top: 14px; padding: 12px 14px 10px; border-top: 1px solid var(--hairline); }
.ui-at-perm__preview-title { display: flex; align-items: center; gap: 6px; color: var(--muted); font-size: 12px; font-weight: 500; margin-bottom: 4px !important; }
.ui-at-perm__count {
  display: inline-grid;
  place-items: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 999px;
  border: 1px solid var(--hairline);
  background: var(--soft);
  color: var(--text);
  font-size: 10.5px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
.ui-at-perm__list { list-style: none; }
.ui-at-perm__item {
  display: flex;
  align-items: center;
  gap: 9px;
  min-height: 30px;
  min-width: 0;
  color: var(--ink);
  animation: ui-at-perm-rise 300ms var(--ease) both;
}
.ui-at-perm__item-icon { flex: none; display: grid; place-items: center; width: 16px; height: 16px; color: var(--muted); }
.ui-at-perm__item-icon svg { width: 15px; height: 15px; }
.ui-at-perm__item-label { flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ui-at-perm__item-meta { flex: none; color: var(--muted); font-size: 12px; font-variant-numeric: tabular-nums; white-space: nowrap; }
.ui-at-perm__more { padding: 2px 0 0 25px !important; color: var(--muted); font-size: 12px; }

.ui-at-perm__tray { display: grid; gap: 8px; padding: 8px 2px 2px; }
.ui-at-perm__scopes {
  position: relative;
  display: flex;
  padding: 3px;
  border-radius: 12px;
  background: var(--soft);
  border: 1px solid var(--hairline);
}
.ui-at-perm__scope {
  position: relative;
  z-index: 1;
  flex: 1 1 0;
  display: grid;
  place-items: center;
  min-width: 0;
  height: 30px;
  border-radius: 9px;
  color: var(--text);
  font-weight: 500;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  transition: color 150ms var(--ease);
}
.ui-at-perm__scope[data-on] { color: var(--ink); font-weight: 600; }
.ui-at-perm__scope input { position: absolute; inset: 0; opacity: 0; margin: 0; cursor: pointer; }
.ui-at-perm__scope:has(input:focus-visible) { box-shadow: 0 0 0 3px var(--ring); }
.ui-at-perm__scope > span { overflow: hidden; text-overflow: ellipsis; padding: 0 6px; }
.ui-at-perm__thumb {
  position: absolute;
  top: 3px;
  bottom: 3px;
  left: 3px;
  border-radius: 9px;
  background: var(--panel);
  border: 1px solid var(--hairline);
  box-shadow: var(--shadow-drop);
  transition: transform 300ms var(--ease);
}
.ui-at-perm__note { padding: 0 6px !important; color: var(--muted); font-size: 11.5px; }
.ui-at-perm__buttons { display: grid; grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr); gap: 8px; }
.ui-at-perm__deny, .ui-at-perm__allow, .ui-at-perm__undo {
  appearance: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 38px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid transparent;
  font: inherit;
  font-size: 13.5px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 150ms var(--ease), transform 150ms var(--ease), box-shadow 150ms var(--ease);
}
.ui-at-perm__deny:active, .ui-at-perm__allow:active, .ui-at-perm__undo:active { transform: scale(0.97); }
.ui-at-perm__deny:focus-visible, .ui-at-perm__allow:focus-visible, .ui-at-perm__undo:focus-visible { outline: none; box-shadow: 0 0 0 3px var(--ring); }
.ui-at-perm__deny { background: var(--secondary); border-color: var(--firm); color: var(--ink); box-shadow: var(--shadow-drop); }
.ui-at-perm__deny:hover { background: var(--panel); }
.ui-at-perm__allow {
  background: var(--berry);
  color: #fff;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 6px 12px -6px var(--berry-shadow);
  overflow: hidden;
}
.ui-at-perm__allow:hover { background: var(--berry-hover); }
.ui-at-perm[data-risk="destructive"] .ui-at-perm__allow {
  background: var(--danger-action);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 6px 12px -6px var(--danger-shadow);
}
.ui-at-perm[data-risk="destructive"] .ui-at-perm__allow:hover { background: var(--danger-action-hover); }
.ui-at-perm__allow-label { display: inline-block; overflow: hidden; text-overflow: ellipsis; animation: ui-at-perm-swap 200ms var(--ease) both; }
.ui-at-perm kbd {
  display: inline-grid;
  place-items: center;
  min-width: 20px;
  height: 18px;
  padding: 0 5px;
  border-radius: 5px;
  border: 1px solid var(--hairline);
  border-bottom-color: var(--firm);
  background: var(--panel);
  color: var(--muted);
  font: 500 10.5px/1 "Avenir Next", Avenir, system-ui, sans-serif;
}
.ui-at-perm__allow kbd { background: rgba(255, 255, 255, 0.14); border-color: rgba(255, 255, 255, 0.3); color: rgba(255, 255, 255, 0.92); }

.ui-at-perm__line {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 52px;
  padding: 9px 10px 9px 14px;
  border-radius: 16px;
  background: var(--panel);
  border: 1px solid var(--hairline);
  box-shadow: var(--shadow-raised);
  overflow: hidden;
}
.ui-at-perm__mark { flex: none; display: grid; place-items: center; width: 20px; height: 20px; color: var(--ok-ink); animation: ui-at-perm-pop 300ms var(--ease) both; }
.ui-at-perm__mark svg { width: 20px; height: 20px; }
.ui-at-perm__line[data-state="denied"] .ui-at-perm__mark { color: var(--bad-ink); }
.ui-at-perm__line[data-state="expired"] .ui-at-perm__mark { color: var(--muted); }
.ui-at-perm__draw { stroke-dasharray: 1; stroke-dashoffset: 1; animation: ui-at-perm-draw 300ms var(--ease) 120ms forwards; }
.ui-at-perm__line-text { flex: 1; min-width: 0; }
.ui-at-perm__line-head { color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ui-at-perm__line-head strong { color: var(--ink); font-weight: 700; }
.ui-at-perm__line-sub { color: var(--muted); font-size: 12px; font-variant-numeric: tabular-nums; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ui-at-perm__undo { flex: none; height: 32px; background: var(--soft); border-color: var(--hairline); color: var(--ink); font-size: 13px; }
.ui-at-perm__undo:hover { background: var(--secondary); border-color: var(--firm); }
.ui-at-perm__drain { position: absolute; left: 0; right: 0; bottom: 0; height: 3px; background: var(--soft); }
.ui-at-perm__drain > span {
  display: block;
  height: 100%;
  background: var(--ok-bar);
  transform-origin: left center;
  transition: transform 1000ms linear;
}

@keyframes ui-at-perm-in { from { opacity: 0; filter: blur(3px); transform: translateY(4px); } to { opacity: 1; filter: none; transform: none; } }
@keyframes ui-at-perm-rise { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
@keyframes ui-at-perm-swap { from { opacity: 0; transform: translateY(3px); } to { opacity: 1; transform: none; } }
@keyframes ui-at-perm-pop { from { transform: scale(0.6); opacity: 0; } to { transform: none; opacity: 1; } }
@keyframes ui-at-perm-draw { to { stroke-dashoffset: 0; } }

@container (max-width: 340px) {
  .ui-at-perm__reason { margin-left: 14px !important; }
  .ui-at-perm__buttons { grid-template-columns: 1fr 1fr; }
  .ui-at-perm kbd { display: none; }
  .ui-at-perm__tag { padding: 0 6px; }
}
@media (hover: none) {
  .ui-at-perm kbd { display: none; }
  .ui-at-perm__scope { height: 38px; }
  .ui-at-perm__deny, .ui-at-perm__allow { height: 44px; }
  .ui-at-perm__undo { height: 40px; }
}
@media (prefers-reduced-motion: reduce) {
  .ui-at-perm, .ui-at-perm *, .ui-at-perm *::before, .ui-at-perm *::after {
    transition-duration: 0ms !important;
    animation-duration: 0ms !important;
    animation-delay: 0ms !important;
  }
}
`;
