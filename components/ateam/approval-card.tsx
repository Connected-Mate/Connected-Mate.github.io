"use client";

import {
  useCallback,
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

export type ApprovalStatus = "pending" | "approved" | "denied";
export type ApprovalRisk = "low" | "medium" | "high";
export type ApprovalDetail = { label: string; value: ReactNode };

export type ApprovalCardProps = {
  /** The action, e.g. "Send campaign email" – also the card's accessible name. */
  title: string;
  /** One line of context below the title. */
  description?: ReactNode;
  risk?: ApprovalRisk;
  /** Icon in the 32px header tile. Defaults to a shield. */
  icon?: ReactNode;
  details?: ApprovalDetail[];
  /** Custom content above the details – children work the same. */
  preview?: ReactNode;
  children?: ReactNode;
  /** Controlled status; setting it back to "pending" starts a fresh request. */
  status?: ApprovalStatus;
  defaultStatus?: ApprovalStatus;
  /** Return a promise to show a spinner and lock the card; a rejection keeps it pending. */
  onApprove?: (args: { always: boolean }) => void | Promise<unknown>;
  onDeny?: (args: { reason: "user" | "timeout" }) => void;
  onEdit?: () => void;
  /** Seconds until the request expires. */
  expiresIn?: number;
  onExpire?: () => void;
  allowAlways?: boolean;
  alwaysLabel?: string;
  approveLabel?: string;
  denyLabel?: string;
  editLabel?: string;
  /** Show the ⌘↵ / Esc hints on the buttons – the shortcuts work either way. */
  shortcuts?: boolean;
  /** Small label on the tray above the card, e.g. "Step 4 · gmail.send". */
  label?: ReactNode;
  /** Where the buttons sit: on the tray below the card, or inside the card. */
  actions?: "tray" | "card";
  className?: string;
};

/* ------------------------------------------------------------------------------------------------
 * Helpers
 * ----------------------------------------------------------------------------------------------*/

const RISK_WORD: Record<ApprovalRisk, string> = { low: "Low", medium: "Medium", high: "High" };

function isApplePlatform() {
  if (typeof navigator === "undefined") return true;
  const platform =
    (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform ??
    navigator.platform ??
    "";
  return /mac|iphone|ipad|ipod/i.test(platform);
}

function clock(seconds: number) {
  const s = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

function spoken(seconds: number) {
  const s = Math.max(0, Math.ceil(seconds));
  if (s < 60) return `${s} second${s === 1 ? "" : "s"}`;
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m} minute${m === 1 ? "" : "s"}${r ? ` ${r} second${r === 1 ? "" : "s"}` : ""}`;
}

function ago(at: number, now: number) {
  const min = Math.floor((now - at) / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min} min ago`;
  const h = Math.floor(min / 60);
  return `${h} h ago`;
}

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

/* ------------------------------------------------------------------------------------------------
 * Icons (drawn for this file)
 * ----------------------------------------------------------------------------------------------*/

function ShieldIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M8 1.75 2.75 3.6v4.1c0 3.1 2.2 5.5 5.25 6.55 3.05-1.05 5.25-3.45 5.25-6.55V3.6L8 1.75Z" />
      <path d="m5.75 8 1.6 1.6 2.9-3.1" />
    </svg>
  );
}

function CheckMark() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path pathLength={1} d="m4.25 8.25 2.5 2.5 5-5.25" />
    </svg>
  );
}

function CrossMark() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path pathLength={1} d="m5 5 6 6" />
      <path pathLength={1} d="m11 5-6 6" />
    </svg>
  );
}

function ClockMark() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <circle pathLength={1} cx="8" cy="8" r="5.25" />
      <path pathLength={1} d="M8 5.25V8l1.75 1.25" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg className="ui-at-approve__spinner" viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="5.5" />
    </svg>
  );
}

/* ------------------------------------------------------------------------------------------------
 * Component
 * ----------------------------------------------------------------------------------------------*/

export function ApprovalCard({
  title,
  description,
  risk,
  icon,
  details,
  preview,
  children,
  status: statusProp,
  defaultStatus = "pending",
  onApprove,
  onDeny,
  onEdit,
  expiresIn,
  onExpire,
  allowAlways = true,
  alwaysLabel = "Always allow this action",
  approveLabel = "Approve",
  denyLabel = "Deny",
  editLabel = "Edit",
  shortcuts = true,
  label,
  actions = "tray",
  className,
}: ApprovalCardProps) {
  const uid = useId();
  const titleId = `${uid}-title`;
  const descId = `${uid}-desc`;
  const timerId = `${uid}-timer`;

  const controlled = statusProp !== undefined;
  const [inner, setInner] = useState<ApprovalStatus>(defaultStatus);
  const status = controlled ? statusProp : inner;

  // What the resolved row says. A timeout is a denial with its own wording.
  const [outcome, setOutcome] = useState<{ kind: "approved" | "denied" | "expired"; at: number } | null>(
    status === "pending" ? null : { kind: status, at: Date.now() },
  );
  const [busy, setBusy] = useState(false);
  const [always, setAlways] = useState(false);
  const [remaining, setRemaining] = useState<number | undefined>(expiresIn);
  const [paused, setPaused] = useState({ hover: false, focus: false });
  const [now, setNow] = useState(() => Date.now());
  // The status on screen: it trails `status` while the card fades out, so the card is still
  // there (and focus with it) on the first render after a decision.
  const [shown, setShown] = useState<ApprovalStatus>(status);
  const [announce, setAnnounce] = useState("");
  const [apple, setApple] = useState(true);

  const rootRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const focusWasInside = useRef(false);
  const mounted = useRef(true);
  const leaveTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const callbacks = useRef({ onApprove, onDeny, onExpire });
  callbacks.current = { onApprove, onDeny, onExpire };

  useEffect(() => {
    mounted.current = true;
    setApple(isApplePlatform());
    return () => {
      mounted.current = false;
      clearTimeout(leaveTimer.current);
    };
  }, []);

  const leaving = status !== "pending" && shown === "pending";
  const resolved = status !== "pending" && shown !== "pending";

  /* Height glides between the card and the row ------------------------------------------------ */
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [ready, setReady] = useState(false);
  // The root clips only while its height glides, so the shadows stay whole the rest of the time.
  const [gliding, setGliding] = useState(false);
  const glideTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(glideTimer.current), []);
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

  /* Status changes: from pending to a decision (fade out first) and back (fresh request) ------- */
  const prevStatus = useRef(status);
  useEffect(() => {
    const prev = prevStatus.current;
    prevStatus.current = status;
    if (prev === status) return;
    setGliding(true);
    clearTimeout(glideTimer.current);
    glideTimer.current = setTimeout(() => setGliding(false), prefersReducedMotion() ? 0 : 560);
    if (status === "pending") {
      clearTimeout(leaveTimer.current);
      setShown("pending");
      setOutcome(null);
      setBusy(false);
      setAlways(false);
      setRemaining(expiresIn);
      return;
    }
    setOutcome((o) => (o && o.kind === "expired" && status === "denied" ? o : { kind: status, at: Date.now() }));
    clearTimeout(leaveTimer.current);
    if (prev !== "pending") {
      setShown(status);
      return;
    }
    focusWasInside.current = !!rootRef.current?.contains(document.activeElement);
    leaveTimer.current = setTimeout(() => setShown(status), prefersReducedMotion() ? 0 : 200);
    // expiresIn is read only when a fresh request starts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    if (resolved) {
      setAnnounce(
        `${outcome?.kind === "approved" ? "Approved" : outcome?.kind === "expired" ? "Expired" : "Denied"}: ${title}`,
      );
      if (focusWasInside.current) {
        focusWasInside.current = false;
        rowRef.current?.focus({ preventScroll: true });
      }
    }
  }, [resolved, outcome, title]);

  /* Relative time on the resolved row --------------------------------------------------------- */
  useEffect(() => {
    if (!resolved) return;
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(t);
  }, [resolved]);

  /* Decisions ---------------------------------------------------------------------------------- */
  const settle = useCallback(
    (next: ApprovalStatus) => {
      if (!controlled) setInner(next);
    },
    [controlled],
  );

  const approve = useCallback(async () => {
    if (status !== "pending" || busy) return;
    const result = callbacks.current.onApprove?.({ always });
    if (result && typeof (result as Promise<unknown>).then === "function") {
      setBusy(true);
      try {
        await result;
        if (!mounted.current) return;
        setBusy(false);
        settle("approved");
      } catch {
        if (mounted.current) setBusy(false);
      }
      return;
    }
    settle("approved");
  }, [status, busy, always, settle]);

  const deny = useCallback(
    (reason: "user" | "timeout") => {
      if (status !== "pending" || busy) return;
      if (reason === "timeout") setOutcome({ kind: "expired", at: Date.now() });
      callbacks.current.onDeny?.({ reason });
      settle("denied");
    },
    [status, busy, settle],
  );

  /* Countdown, paused while hovered or focused ------------------------------------------------ */
  const isPaused = paused.hover || paused.focus || busy;
  useEffect(() => {
    setRemaining(expiresIn);
  }, [expiresIn]);
  useEffect(() => {
    if (status !== "pending" || remaining === undefined || isPaused) return;
    if (remaining <= 0) return;
    const t = setTimeout(() => setRemaining((r) => (r === undefined ? r : r - 1)), 1000);
    return () => clearTimeout(t);
  }, [status, remaining, isPaused]);
  const expiredFired = useRef(false);
  useEffect(() => {
    if (status !== "pending") {
      expiredFired.current = false;
      return;
    }
    if (remaining !== undefined && remaining <= 0 && !expiredFired.current) {
      expiredFired.current = true;
      callbacks.current.onExpire?.();
      deny("timeout");
    }
  }, [remaining, status, deny]);

  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (status !== "pending") return;
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      void approve();
    } else if (e.key === "Escape") {
      e.preventDefault();
      deny("user");
    }
  };

  /* Render -------------------------------------------------------------------------------------- */
  const body = preview ?? children;
  const hasPreview = !!body || (details && details.length > 0);
  const urgent = remaining !== undefined && remaining <= 10;
  const showTimer = remaining !== undefined && status === "pending";
  const kind = outcome?.kind ?? (status === "approved" ? "approved" : "denied");
  const outcomeWord = kind === "approved" ? "Approved" : kind === "expired" ? "Expired" : "Denied";

  const buttons = (
    <div className="ui-at-approve__actions">
      {showTimer && (
        <span className="ui-at-approve__timer" data-urgent={urgent || undefined} aria-hidden="true">
          Expires in {clock(remaining!)}
        </span>
      )}
      {onEdit && (
        <button
          type="button"
          className="ui-at-approve__btn"
          data-variant="secondary"
          onClick={onEdit}
          aria-disabled={busy || undefined}
        >
          {editLabel}
        </button>
      )}
      <button
        type="button"
        className="ui-at-approve__btn"
        data-variant="ghost"
        aria-keyshortcuts="Escape"
        aria-disabled={busy || undefined}
        onClick={() => deny("user")}
      >
        {denyLabel}
        {shortcuts && (
          <kbd className="ui-at-approve__kbd" aria-hidden="true">
            Esc
          </kbd>
        )}
      </button>
      <button
        type="button"
        className="ui-at-approve__btn"
        data-variant="primary"
        data-busy={busy || undefined}
        aria-keyshortcuts="Meta+Enter Control+Enter"
        aria-disabled={busy || undefined}
        onClick={() => void approve()}
      >
        {approveLabel}
        {busy ? (
          <Spinner />
        ) : (
          shortcuts && (
            <kbd className="ui-at-approve__kbd" data-on="berry" aria-hidden="true">
              {apple ? "⌘↵" : "Ctrl ↵"}
            </kbd>
          )
        )}
      </button>
    </div>
  );

  return (
    <div
      ref={rootRef}
      className={["ui-at-approve", className].filter(Boolean).join(" ")}
      data-status={status}
      data-leaving={leaving || undefined}
      data-actions={actions}
      data-ready={ready || undefined}
      data-gliding={gliding || undefined}
      style={{ height }}
      onPointerEnter={() => setPaused((p) => ({ ...p, hover: true }))}
      onPointerLeave={() => setPaused((p) => ({ ...p, hover: false }))}
      onFocus={() => setPaused((p) => ({ ...p, focus: true }))}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused((p) => ({ ...p, focus: false }));
      }}
    >
      <style href="ui-approval-card" precedence="default">
        {css}
      </style>
      <div ref={bodyRef} className="ui-at-approve__measure">
        {resolved ? (
          <div className="ui-at-approve__resolved">
            <div
              ref={rowRef}
              className="ui-at-approve__row"
              data-kind={kind}
              tabIndex={-1}
              aria-label={`${outcomeWord}: ${title}`}
            >
              <span className="ui-at-approve__mark" aria-hidden="true">
                {kind === "approved" ? <CheckMark /> : kind === "expired" ? <ClockMark /> : <CrossMark />}
              </span>
              <span className="ui-at-approve__row-title">{title}</span>
              <span className="ui-at-approve__row-meta">
                {outcomeWord}
                <span className="ui-at-approve__row-time"> · {outcome ? ago(outcome.at, now) : "just now"}</span>
              </span>
            </div>
          </div>
        ) : (
          <div
            className="ui-at-approve__pending"
            role="group"
            aria-labelledby={titleId}
            aria-describedby={[description ? descId : null, showTimer ? timerId : null].filter(Boolean).join(" ") || undefined}
            aria-busy={busy || undefined}
            onKeyDown={onKeyDown}
          >
            {label && <div className="ui-at-approve__label">{label}</div>}
            <div className="ui-at-approve__card">
              <div className="ui-at-approve__head">
                <span className="ui-at-approve__tile" aria-hidden="true">
                  {icon ?? <ShieldIcon />}
                </span>
                <div className="ui-at-approve__heading">
                  <h3 id={titleId} className="ui-at-approve__title">
                    {title}
                  </h3>
                  {description && (
                    <p id={descId} className="ui-at-approve__desc">
                      {description}
                    </p>
                  )}
                </div>
                {risk && (
                  <span className="ui-at-approve__risk" data-risk={risk}>
                    <span className="ui-at-approve__dot" aria-hidden="true" />
                    {RISK_WORD[risk]}
                    <span className="ui-at-approve__risk-word"> risk</span>
                  </span>
                )}
              </div>
              {hasPreview && (
                <div className="ui-at-approve__preview">
                  {body && <div className="ui-at-approve__custom">{body}</div>}
                  {details && details.length > 0 && (
                    <dl className="ui-at-approve__details">
                      {details.map((d, i) => (
                        <div className="ui-at-approve__detail" key={`${d.label}-${i}`}>
                          <dt>{d.label}</dt>
                          <dd>{d.value}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </div>
              )}
              {allowAlways && (
                <label className="ui-at-approve__check">
                  <input
                    type="checkbox"
                    checked={always}
                    disabled={busy}
                    onChange={(e) => setAlways(e.target.checked)}
                  />
                  <span className="ui-at-approve__box" aria-hidden="true">
                    <svg viewBox="0 0 12 12">
                      <path d="m2.75 6.25 2 2 4.5-4.75" />
                    </svg>
                  </span>
                  <span>{alwaysLabel}</span>
                </label>
              )}
              {actions === "card" && buttons}
            </div>
            {actions === "tray" && buttons}
            {showTimer && (
              <span id={timerId} className="ui-at-approve__sr">
                Expires in {spoken(remaining!)} unless approved. The countdown pauses while you are here.
              </span>
            )}
          </div>
        )}
      </div>
      <span className="ui-at-approve__sr" role="status" aria-live="polite">
        {announce}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------------------------------------
 * Styles
 * ----------------------------------------------------------------------------------------------*/

const css = /* css */ `
.ui-at-approve {
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
  --secondary: #fbfcfe;
  --info-ink: #1a3e70;
  --ring: #8fbdf2;
  --ok-ink: #1d6a34;
  --ok-fill: #eafbee;
  --ok-line: #c9f5cf;
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
  max-width: 440px;
  container-type: inline-size;
  font-family: "Avenir Next", Avenir, system-ui, sans-serif;
  font-size: 13px;
  line-height: 1.45;
  color: var(--text);
  -webkit-font-smoothing: antialiased;
}
:where(.dark, [data-theme="dark"]) .ui-at-approve {
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
  --secondary: rgba(255, 255, 255, 0.06);
  --info-ink: #c1daff;
  --ring: rgba(143, 189, 242, 0.6);
  --ok-ink: #7fe0a0;
  --ok-fill: rgba(127, 224, 160, 0.14);
  --ok-line: rgba(127, 224, 160, 0.3);
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
.ui-at-approve[data-ready] { transition: height 300ms var(--ease); }
.ui-at-approve[data-gliding] { overflow: clip; overflow-clip-margin: 48px; }
.ui-at-approve *, .ui-at-approve *::before, .ui-at-approve *::after { box-sizing: border-box; }
.ui-at-approve__measure { display: block; }

.ui-at-approve__pending,
.ui-at-approve__resolved {
  background: var(--frame);
  border: 1px solid var(--hairline);
  border-radius: 22px;
  padding: 6px;
  box-shadow: var(--shadow-float);
  transition: opacity 180ms var(--ease), filter 180ms var(--ease), transform 180ms var(--ease);
}
.ui-at-approve[data-leaving] .ui-at-approve__pending {
  opacity: 0;
  filter: blur(4px);
  transform: scale(0.985);
  pointer-events: none;
}
.ui-at-approve__label {
  padding: 4px 10px 8px;
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: var(--muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ui-at-approve__card {
  background: var(--panel);
  border: 1px solid var(--hairline);
  border-radius: 16px;
  padding: 14px;
  box-shadow: var(--shadow-raised);
  display: grid;
  gap: 12px;
}

.ui-at-approve__head { display: flex; align-items: flex-start; gap: 10px; min-width: 0; }
.ui-at-approve__tile {
  flex: none;
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: var(--panel);
  border: 1px solid var(--hairline);
  box-shadow: inset 0 -2px 6px -4px var(--pebble-light);
  color: var(--ink);
}
.ui-at-approve__tile svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.4;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.ui-at-approve__heading { flex: 1; min-width: 0; }
.ui-at-approve__title {
  margin: 0;
  font-family: "Avenir Next Condensed", "Avenir Next", Avenir, system-ui, sans-serif;
  font-weight: 700;
  font-size: 16px;
  line-height: 1.25;
  color: var(--ink);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ui-at-approve__desc {
  margin: 1px 0 0;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ui-at-approve__risk {
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  border: 1px solid var(--hairline);
  background: var(--soft);
  color: var(--text);
  font-size: 11.5px;
  font-weight: 600;
  white-space: nowrap;
}
.ui-at-approve__risk-word { font-weight: 500; opacity: 0.8; }
.ui-at-approve__dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
.ui-at-approve__risk[data-risk="medium"] { background: var(--wait-fill); border-color: var(--wait-line); color: var(--wait-ink); }
.ui-at-approve__risk[data-risk="high"] { background: var(--bad-fill); border-color: var(--bad-line); color: var(--bad-ink); }

.ui-at-approve__preview {
  background: var(--soft);
  border: 1px solid var(--hairline);
  border-radius: 12px;
  padding: 10px 12px;
  display: grid;
  gap: 10px;
  min-width: 0;
}
.ui-at-approve__custom { min-width: 0; }
.ui-at-approve__custom + .ui-at-approve__details { border-top: 1px solid var(--hairline); padding-top: 10px; }
.ui-at-approve__details { margin: 0; display: grid; gap: 6px; }
.ui-at-approve__detail { display: grid; grid-template-columns: minmax(56px, auto) 1fr; gap: 12px; min-width: 0; }
.ui-at-approve__detail dt { color: var(--muted); }
.ui-at-approve__detail dd { margin: 0; color: var(--ink); min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.ui-at-approve__check {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  justify-self: start;
  color: var(--text);
  cursor: pointer;
  user-select: none;
}
.ui-at-approve__check input { position: absolute; opacity: 0; width: 16px; height: 16px; margin: 0; cursor: pointer; }
.ui-at-approve__box {
  display: grid;
  place-items: center;
  width: 16px;
  height: 16px;
  border-radius: 5px;
  border: 1px solid var(--firm);
  background: var(--panel);
  box-shadow: inset 0 1px 2px rgba(26, 62, 112, 0.08);
  transition: background-color 150ms var(--ease), border-color 150ms var(--ease);
}
.ui-at-approve__box svg {
  width: 12px;
  height: 12px;
  fill: none;
  stroke: #fff;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
  transform: scale(0.4);
  opacity: 0;
  transition: transform 150ms var(--ease), opacity 150ms var(--ease);
}
.ui-at-approve__check input:checked + .ui-at-approve__box { background: var(--berry); border-color: var(--berry); }
.ui-at-approve__check input:checked + .ui-at-approve__box svg { transform: scale(1); opacity: 1; }
.ui-at-approve__check input:focus-visible + .ui-at-approve__box { box-shadow: 0 0 0 3px var(--ring); }
.ui-at-approve__check input:disabled ~ * { opacity: 0.55; cursor: default; }

.ui-at-approve__actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding: 8px 4px 2px 10px;
  min-width: 0;
}
.ui-at-approve[data-actions="card"] .ui-at-approve__actions { padding: 2px 0 0; }
.ui-at-approve__timer {
  margin-right: auto;
  color: var(--muted);
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  transition: color 300ms var(--ease);
}
.ui-at-approve__timer[data-urgent] { color: var(--wait-ink); font-weight: 600; }
.ui-at-approve__btn {
  appearance: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 34px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid transparent;
  font: inherit;
  font-weight: 600;
  font-size: 13px;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 150ms var(--ease), transform 150ms var(--ease), opacity 150ms var(--ease), box-shadow 150ms var(--ease);
}
.ui-at-approve__btn:active:not([aria-disabled]) { transform: scale(0.97); }
.ui-at-approve__btn:focus-visible { outline: none; box-shadow: 0 0 0 3px var(--ring); }
.ui-at-approve__btn[aria-disabled] { cursor: default; }
.ui-at-approve__btn[data-variant="ghost"] { background: transparent; color: var(--ink); }
.ui-at-approve__btn[data-variant="ghost"]:hover:not([aria-disabled]) { background: var(--soft); }
.ui-at-approve__btn[data-variant="ghost"][aria-disabled] { opacity: 0.5; }
.ui-at-approve__btn[data-variant="secondary"] {
  background: var(--secondary);
  border-color: var(--firm);
  color: var(--ink);
  box-shadow: var(--shadow-drop);
}
.ui-at-approve__btn[data-variant="secondary"][aria-disabled] { opacity: 0.5; }
.ui-at-approve__btn[data-variant="primary"] {
  background: var(--berry);
  color: #fff;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 6px 12px -6px rgba(133, 20, 55, 0.6);
}
.ui-at-approve__btn[data-variant="primary"]:hover:not([aria-disabled]) { background: var(--berry-hover); }
.ui-at-approve__kbd {
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
.ui-at-approve__kbd[data-on="berry"] {
  background: rgba(255, 255, 255, 0.14);
  border-color: rgba(255, 255, 255, 0.28);
  color: rgba(255, 255, 255, 0.9);
}
.ui-at-approve__spinner {
  width: 14px;
  height: 14px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-dasharray: 22 40;
  animation: ui-at-approve-spin 700ms linear infinite;
}
@keyframes ui-at-approve-spin { to { transform: rotate(360deg); } }

.ui-at-approve__resolved { padding: 4px; border-radius: 20px; animation: ui-at-approve-in 300ms var(--ease) both; }
.ui-at-approve__row {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  min-height: 46px;
  padding: 10px 14px;
  border-radius: 16px;
  background: var(--panel);
  border: 1px solid var(--hairline);
  box-shadow: var(--shadow-raised);
}
.ui-at-approve__row:focus { outline: none; }
.ui-at-approve__row:focus-visible { box-shadow: var(--shadow-raised), 0 0 0 3px var(--ring); }
.ui-at-approve__mark {
  flex: none;
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 1px solid var(--ok-line);
  background: var(--ok-fill);
  color: var(--ok-ink);
}
.ui-at-approve__row[data-kind="denied"] .ui-at-approve__mark { border-color: var(--bad-line); background: var(--bad-fill); color: var(--bad-ink); }
.ui-at-approve__row[data-kind="expired"] .ui-at-approve__mark { border-color: var(--wait-line); background: var(--wait-fill); color: var(--wait-ink); }
.ui-at-approve__mark svg {
  width: 13px;
  height: 13px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.9;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.ui-at-approve__mark svg > * {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: ui-at-approve-draw 300ms var(--ease) 120ms forwards;
}
.ui-at-approve__mark svg > *:nth-child(2) { animation-delay: 220ms; }
.ui-at-approve__row-title {
  flex: 1;
  min-width: 0;
  color: var(--ink);
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ui-at-approve__row-meta { flex: none; color: var(--muted); font-size: 12px; white-space: nowrap; }
@keyframes ui-at-approve-draw { to { stroke-dashoffset: 0; } }
@keyframes ui-at-approve-in { from { opacity: 0; filter: blur(3px); } to { opacity: 1; filter: none; } }

.ui-at-approve__sr {
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
  .ui-at-approve__actions { flex-wrap: wrap; padding-left: 4px; }
  .ui-at-approve__timer { flex-basis: 100%; padding: 0 6px 2px; }
  .ui-at-approve__actions .ui-at-approve__btn { flex: 1 1 0; }
  .ui-at-approve__kbd { display: none; }
}
@container (max-width: 340px) {
  .ui-at-approve__risk-word, .ui-at-approve__row-time { display: none; }
}
@media (hover: none) {
  .ui-at-approve__kbd { display: none; }
  .ui-at-approve__btn { height: 40px; }
}
@media (prefers-reduced-motion: reduce) {
  .ui-at-approve, .ui-at-approve *, .ui-at-approve *::before, .ui-at-approve *::after {
    transition-duration: 0ms !important;
    animation-duration: 0ms !important;
    animation-delay: 0ms !important;
  }
  .ui-at-approve__spinner { animation-duration: 1600ms !important; }
  .ui-at-approve[data-leaving] .ui-at-approve__pending { transform: none; filter: none; }
}
`;
