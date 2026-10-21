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

export type SteerNote = {
  id: string;
  text: string;
  /** Set once the agent took the note in: at the next step, or right away */
  picked?: "next" | "now";
};

export type SteerStepStatus = "done" | "active" | "pending";

export type SteerStep = {
  id: string;
  title: string;
  status?: SteerStepStatus;
  /** ms, for finished steps */
  duration?: number;
  /** When the step turned active – its clock ticks from here */
  startedAt?: number | Date;
  notes?: SteerNote[];
};

export type SteerRunStatus = "running" | "paused" | "done";

export type AgentSteeringProps = {
  title?: string;
  agent?: string;
  steps: SteerStep[];
  queue?: SteerNote[];
  status?: SteerRunStatus;
  startedAt?: number | Date;
  onQueue?: (text: string) => void;
  onInterrupt?: (text: string, queuedId?: string) => void;
  onRemove?: (id: string) => void;
  onPause?: () => void;
  onResume?: () => void;
  draft?: string;
  onDraftChange?: (text: string) => void;
  placeholder?: string;
  className?: string;
};

const GLIDE_MS = 620;
const EASE = "cubic-bezier(.16, 1, .3, 1)";

const toMs = (t?: number | Date) => (t instanceof Date ? t.getTime() : t);
const secs = (ms: number) => `${(Math.max(0, ms) / 1000).toFixed(1)}s`;
function clock(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h) return `${h}h ${String(m).padStart(2, "0")}m`;
  return `${m}m ${String(s % 60).padStart(2, "0")}s`;
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) return;
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener?.("change", on);
    return () => mq.removeEventListener?.("change", on);
  }, []);
  return reduced;
}

const isMac = () => typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

/* ---------- icons ---------- */

const Svg = ({ children, size = 14 }: { children: ReactNode; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    {children}
  </svg>
);
const Sparkle = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
    <path
      fill="currentColor"
      d="M8 1.2c.35 2.9 1.9 4.45 4.8 4.8-2.9.35-4.45 1.9-4.8 4.8-.35-2.9-1.9-4.45-4.8-4.8 2.9-.35 4.45-1.9 4.8-4.8Z"
    />
    <path fill="currentColor" opacity=".55" d="M12.6 10.2c.15 1.2.8 1.85 2 2-1.2.15-1.85.8-2 2-.15-1.2-.8-1.85-2-2 1.2-.15 1.85-.8 2-2Z" />
  </svg>
);
const PauseIcon = () => (
  <Svg size={12}>
    <path d="M5.5 3.5v9M10.5 3.5v9" strokeWidth="2" />
  </Svg>
);
const PlayIcon = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
    <path fill="currentColor" d="M5 3.2v9.6a.6.6 0 0 0 .9.5l7.4-4.8a.6.6 0 0 0 0-1L5.9 2.7a.6.6 0 0 0-.9.5Z" />
  </svg>
);
const Bolt = () => (
  <svg width="11" height="11" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
    <path fill="currentColor" d="M9.2 1.5 3.5 9h3.8l-.9 5.5L12.5 7H8.6l.6-5.5Z" />
  </svg>
);
const Cross = () => (
  <Svg size={11}>
    <path d="M4 4l8 8M12 4l-8 8" />
  </Svg>
);
const Up = () => (
  <Svg size={13}>
    <path d="M8 13V3.5M4 7.5l4-4 4 4" strokeWidth="1.8" />
  </Svg>
);
const Enter = () => (
  <Svg size={11}>
    <path d="M12.5 3.5v4.5a2 2 0 0 1-2 2H4M6.5 7.5 4 10l2.5 2.5" />
  </Svg>
);
const DoneMark = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
    <circle cx="8" cy="8" r="7" fill="currentColor" />
    <path className="ui-at-steer__tick" d="M4.8 8.3l2.2 2.1 4.2-4.6" fill="none" stroke="var(--on-ink)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ActiveMark = () => (
  <svg className="ui-at-steer__spin" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
    <circle cx="8" cy="8" r="6.2" fill="none" stroke="currentColor" strokeOpacity=".25" strokeWidth="1.8" />
    <path d="M8 1.8a6.2 6.2 0 0 1 0 12.4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);
const PendingMark = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
    <circle cx="8" cy="8" r="6.2" fill="none" stroke="currentColor" strokeWidth="1.3" strokeDasharray="2.2 2.4" />
  </svg>
);

/* ---------- component ---------- */

export function AgentSteering({
  title,
  agent,
  steps,
  queue = [],
  status = "running",
  startedAt,
  onQueue,
  onInterrupt,
  onRemove,
  onPause,
  onResume,
  draft: draftProp,
  onDraftChange,
  placeholder = "Steer the agent…",
  className,
}: AgentSteeringProps) {
  const uid = useId();
  const reduced = useReducedMotion();
  const [innerDraft, setInnerDraft] = useState("");
  const draft = draftProp ?? innerDraft;
  const setDraft = (text: string) => {
    if (draftProp === undefined) setInnerDraft(text);
    onDraftChange?.(text);
  };

  /* ----- clocks ----- */
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (status !== "running") return;
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 100);
    return () => window.clearInterval(id);
  }, [status]);
  const frozenAt = useRef<number | null>(null);
  if (status === "running") frozenAt.current = null;
  else if (frozenAt.current === null) frozenAt.current = Date.now();
  // Read the wall clock while running: the interval only triggers renders, so a stale tick never shows
  const at = status === "running" ? Math.max(now, Date.now()) : frozenAt.current ?? now;
  const runStart = toMs(startedAt);

  const activeIndex = steps.findIndex((s) => s.status === "active");
  const doneCount = steps.filter((s) => s.status === "done").length;
  const stepNo = activeIndex >= 0 ? activeIndex + 1 : Math.min(steps.length, doneCount + 1);

  /* ----- announcements ----- */
  const [message, setMessage] = useState("");
  const seenPicked = useRef<Set<string> | null>(null);
  const seenQueued = useRef<Set<string> | null>(null);
  useEffect(() => {
    const picked = steps.flatMap((s) => (s.notes ?? []).filter((n) => n.picked).map((n) => n));
    if (seenPicked.current === null || seenQueued.current === null) {
      seenPicked.current = new Set(picked.map((n) => n.id));
      seenQueued.current = new Set(queue.map((n) => n.id));
      return;
    }
    for (const n of queue) {
      if (!seenQueued.current.has(n.id)) {
        seenQueued.current.add(n.id);
        setMessage(`Queued for the next step: ${n.text}`);
      }
    }
    for (const n of picked) {
      if (!seenPicked.current.has(n.id)) {
        seenPicked.current.add(n.id);
        setMessage(n.picked === "now" ? `Interrupted with: ${n.text}` : `${agent ?? "The agent"} picked up: ${n.text}`);
      }
    }
  }, [steps, queue, agent]);

  /* ----- glide: a note keeps its id from the queue into its step ----- */
  const rootRef = useRef<HTMLDivElement>(null);
  const before = useRef<Map<string, DOMRect> | null>(null);
  if (typeof window !== "undefined" && rootRef.current) {
    const map = new Map<string, DOMRect>();
    rootRef.current.querySelectorAll<HTMLElement>("[data-note]").forEach((el) => {
      map.set(`${el.dataset.where}:${el.dataset.note}`, el.getBoundingClientRect());
    });
    before.current = map;
  }
  useLayoutEffect(() => {
    const prev = before.current;
    before.current = null;
    const root = rootRef.current;
    if (!prev || !root) return;
    root.querySelectorAll<HTMLElement>('[data-where="step"]').forEach((el) => {
      const id = el.dataset.note!;
      const from = prev.get(`queue:${id}`);
      if (!from || prev.has(`step:${id}`)) return;
      el.classList.remove("ui-at-steer__note--landed");
      if (reduced || document.hidden || typeof el.animate !== "function") {
        el.classList.add("ui-at-steer__note--landed");
        return;
      }
      const to = el.getBoundingClientRect();
      const glide = el.animate(
        [
          { transform: `translate(${from.left - to.left}px, ${from.top - to.top}px)`, opacity: 0.9 },
          { transform: "translate(0, 0)", opacity: 1 },
        ],
        { duration: GLIDE_MS, easing: EASE },
      );
      glide.onfinish = () => el.classList.add("ui-at-steer__note--landed");
    });
  });

  /* ----- the card's height follows its content ----- */
  const innerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | null>(null);
  useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const measure = () => setHeight(el.offsetHeight);
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  useLayoutEffect(() => {
    const h = innerRef.current?.offsetHeight;
    if (h != null && h !== height) setHeight(h);
  });
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setArmed(true));
    return () => cancelAnimationFrame(id);
  }, []);

  /* ----- field ----- */
  const fieldRef = useRef<HTMLTextAreaElement>(null);
  useLayoutEffect(() => {
    const el = fieldRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [draft]);
  const send = (mode: "queue" | "now") => {
    const text = draft.trim();
    if (!text) return;
    if (mode === "now" && onInterrupt) onInterrupt(text);
    else onQueue?.(text);
    setDraft("");
  };
  const onFieldKey = (e: ReactKeyboardEvent<HTMLTextAreaElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send((e.metaKey || e.ctrlKey) && onInterrupt ? "now" : "queue");
    } else if (e.key === "Escape" && draft) {
      e.preventDefault();
      setDraft("");
    }
  };

  const mod = isMac() ? "⌘" : "Ctrl";
  const done = status === "done";
  const header =
    done && runStart != null
      ? `Done in ${clock(at - runStart)}`
      : `${status === "paused" ? "Paused" : "Running"}${runStart != null ? ` · ${clock(at - runStart)}` : ""}`;
  const hintId = `${uid}-hint`;

  return (
    <div
      ref={rootRef}
      className={["ui-at-steer", className].filter(Boolean).join(" ")}
      data-status={status}
      style={height != null ? { height: height + 2 } : undefined}
      data-armed={armed || undefined}
    >
      <style href="ui-agent-steering" precedence="default">
        {css}
      </style>
      <div ref={innerRef} className="ui-at-steer__inner">
        <div className="ui-at-steer__panel">
          <div className="ui-at-steer__head">
            <span className="ui-at-steer__pebble">
              <Sparkle />
            </span>
            <div className="ui-at-steer__who">
              {title ? <h3 className="ui-at-steer__title">{title}</h3> : null}
              <p className="ui-at-steer__sub">
                {agent ? <span>{agent}</span> : null}
                {agent ? <span aria-hidden="true">·</span> : null}
                <span>{done ? `${steps.length} steps` : `Step ${stepNo} of ${steps.length}`}</span>
              </p>
            </div>
            <span className="ui-at-steer__state" data-status={status}>
              <span className="ui-at-steer__state-dot" aria-hidden="true" />
              {header}
            </span>
            {status === "running" && onPause ? (
              <button type="button" className="ui-at-steer__icon-btn" aria-label="Pause" onClick={onPause}>
                <PauseIcon />
              </button>
            ) : status === "paused" && onResume ? (
              <button type="button" className="ui-at-steer__icon-btn" aria-label="Resume" onClick={onResume}>
                <PlayIcon />
              </button>
            ) : null}
          </div>

          <ol className="ui-at-steer__steps" aria-label="Plan">
            {steps.map((s, i) => {
              const st = s.status ?? "pending";
              const since = toMs(s.startedAt);
              const time = st === "done" && s.duration != null ? secs(s.duration) : st === "active" && since != null ? secs(at - since) : null;
              return (
                <li key={s.id} className="ui-at-steer__step" data-status={st} aria-current={st === "active" ? "step" : undefined}>
                  <span className="ui-at-steer__mark" aria-hidden="true">
                    {st === "done" ? <DoneMark /> : st === "active" ? <ActiveMark /> : <PendingMark />}
                    {i < steps.length - 1 ? <span className="ui-at-steer__link" /> : null}
                  </span>
                  <span className="ui-at-steer__step-body">
                    <span className="ui-at-steer__step-row">
                      <span className="ui-at-steer__step-title">
                        {s.title}
                        <span className="ui-at-steer__sr">, {st === "active" ? "in progress" : st}</span>
                      </span>
                      {time ? <span className="ui-at-steer__step-time">{time}</span> : null}
                    </span>
                    {s.notes?.length ? (
                      <ul className="ui-at-steer__picked" aria-label="Notes taken in">
                        {s.notes.map((n) => (
                          <li
                            key={n.id}
                            className="ui-at-steer__note"
                            data-note={n.id}
                            data-where="step"
                            data-picked={n.picked ?? "next"}
                          >
                            <span className="ui-at-steer__note-text">{n.text}</span>
                            <span className="ui-at-steer__note-tag">{n.picked === "now" ? "Interrupted" : "Picked up"}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>

        {queue.length ? (
          <div className="ui-at-steer__queue">
            <p className="ui-at-steer__queue-head" id={`${uid}-q`}>
              {done ? "Notes still in the queue were not used" : "Queued for the next step"}
              <span className="ui-at-steer__count">{queue.length}</span>
            </p>
            <ul className="ui-at-steer__queue-list" aria-labelledby={`${uid}-q`}>
              {queue.map((n) => (
                <li key={n.id} className="ui-at-steer__queued" data-note={n.id} data-where="queue">
                  <span className="ui-at-steer__queued-text">{n.text}</span>
                  {onInterrupt && !done ? (
                    <button type="button" className="ui-at-steer__now" onClick={() => onInterrupt(n.text, n.id)}>
                      <Bolt />
                      Now
                    </button>
                  ) : null}
                  {onRemove ? (
                    <button
                      type="button"
                      className="ui-at-steer__x"
                      aria-label={`Remove “${n.text}”`}
                      onClick={() => onRemove(n.id)}
                    >
                      <Cross />
                    </button>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="ui-at-steer__fold" data-open={!done || undefined} inert={done}>
          <div className="ui-at-steer__fold-in">
            <div className="ui-at-steer__compose">
              <div className="ui-at-steer__field">
                <textarea
                  ref={fieldRef}
                  rows={1}
                  className="ui-at-steer__input"
                  placeholder={placeholder}
                  aria-label="Steer the agent"
                  aria-describedby={hintId}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={onFieldKey}
                />
                <button
                  type="button"
                  className="ui-at-steer__send"
                  aria-label="Queue for the next step"
                  disabled={!draft.trim()}
                  onClick={() => send("queue")}
                >
                  <Up />
                </button>
              </div>
              <p className="ui-at-steer__hints" id={hintId}>
                <span className="ui-at-steer__hint">
                  <kbd className="ui-at-steer__kbd">
                    <Enter />
                    <span className="ui-at-steer__sr">Enter</span>
                  </kbd>
                  next step
                </span>
                {onInterrupt ? (
                  <span className="ui-at-steer__hint">
                    <kbd className="ui-at-steer__kbd">{mod}</kbd>
                    <kbd className="ui-at-steer__kbd">
                      <Enter />
                      <span className="ui-at-steer__sr">Enter</span>
                    </kbd>
                    interrupt now
                  </span>
                ) : null}
              </p>
            </div>
          </div>
        </div>
      </div>
      <p className="ui-at-steer__sr" role="status" aria-live="polite">
        {message}
      </p>
    </div>
  );
}

/* ---------- styles ---------- */

const css = /* css */ `
.ui-at-steer {
  --frame: #f2f6fa; --panel: #ffffff; --soft: rgba(26, 62, 112, 0.06);
  --line: #dae2ec; --line-firm: #cbd6e4;
  --ink: #00162b; --on-ink: #ffffff; --text: rgba(0, 22, 43, 0.66); --muted: rgba(0, 22, 43, 0.54);
  --berry: #851437; --berry-hover: #6d0f2d; --berry-soft: rgba(133, 20, 55, 0.18);
  --info-ink: #1a3e70; --info-fill: #eef5ff; --info-line: #c1daff; --ring: #8fbdf2; --run: #2f6fc4;
  --ok-ink: #1d6a34; --ok-fill: #eafbee; --ok-line: #c9f5cf;
  --wait-ink: #775810; --wait-fill: #fdf6dd; --wait-line: #fae6a0;
  --secondary: #fbfcfe;
  --pebble-shade: inset 0 -2px 6px -4px rgba(26, 62, 112, 0.4);
  --field-shade: inset 0 1px 2px rgba(26, 62, 112, 0.08);
  --drop: 0 8px 16px -8px rgba(26, 62, 112, 0.2);
  --raised: 0 18px 30px -16px rgba(26, 62, 112, 0.38), 0 4px 10px -6px rgba(26, 62, 112, 0.18);
  --float: 0 24px 48px -24px rgba(26, 62, 112, 0.3);
  --ease: cubic-bezier(.16, 1, .3, 1);
  box-sizing: border-box;
  position: relative;
  width: 100%;
  max-width: 460px;
  border-radius: 22px;
  background: var(--frame);
  border: 1px solid var(--line);
  box-shadow: var(--float);
  overflow: hidden;
  font-family: "Avenir Next", Avenir, system-ui, sans-serif;
  color: var(--text);
  font-size: 14px;
  line-height: 1.45;
  text-align: left;
  container-type: inline-size;
}
.ui-at-steer[data-armed] { transition: height 300ms var(--ease); }
:where(.dark, [data-theme="dark"]) .ui-at-steer {
  --frame: #0f2747; --panel: #16345c; --soft: rgba(255, 255, 255, 0.07);
  --line: rgba(255, 255, 255, 0.12); --line-firm: rgba(255, 255, 255, 0.18);
  --ink: rgba(255, 255, 255, 0.94); --on-ink: #16345c; --text: rgba(255, 255, 255, 0.72); --muted: rgba(255, 255, 255, 0.56);
  --berry: #a8204d; --berry-hover: #bd2a5a; --berry-soft: rgba(168, 32, 77, 0.3);
  --info-ink: #c1daff; --info-fill: rgba(143, 189, 242, 0.16); --info-line: rgba(143, 189, 242, 0.34); --ring: rgba(143, 189, 242, 0.6); --run: #8fbdf2;
  --ok-ink: #7fe0a0; --ok-fill: rgba(127, 224, 160, 0.14); --ok-line: rgba(127, 224, 160, 0.3);
  --wait-ink: #f3d27a; --wait-fill: rgba(243, 210, 122, 0.14); --wait-line: rgba(243, 210, 122, 0.3);
  --secondary: rgba(255, 255, 255, 0.06);
  --pebble-shade: inset 0 -2px 6px -4px rgba(3, 12, 28, 0.8);
  --field-shade: inset 0 1px 2px rgba(3, 12, 28, 0.4);
  --drop: 0 8px 16px -8px rgba(3, 12, 28, 0.6);
  --raised: 0 18px 30px -16px rgba(3, 12, 28, 0.8), 0 4px 10px -6px rgba(3, 12, 28, 0.6);
  --float: 0 24px 48px -24px rgba(3, 12, 28, 0.7);
}
.ui-at-steer *, .ui-at-steer *::before, .ui-at-steer *::after { box-sizing: border-box; }
.ui-at-steer :where(button) { font: inherit; color: inherit; cursor: pointer; }
.ui-at-steer :focus-visible { outline: none; box-shadow: 0 0 0 3px var(--ring); }
.ui-at-steer__sr {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0;
}
.ui-at-steer__inner { padding: 6px; }

.ui-at-steer__panel { background: var(--panel); border: 1px solid var(--line); border-radius: 16px; box-shadow: var(--raised); }
.ui-at-steer__head { display: flex; align-items: center; gap: 10px; padding: 14px 14px 14px 16px; border-bottom: 1px solid var(--line); }
.ui-at-steer__pebble {
  flex: none; width: 30px; height: 30px; display: grid; place-items: center; border-radius: 10px;
  background: var(--panel); border: 1px solid var(--line); box-shadow: var(--pebble-shade); color: var(--run);
}
.ui-at-steer__who { min-width: 0; flex: 1; }
.ui-at-steer__title {
  margin: 0; color: var(--ink); font-size: 16px; font-weight: 700; line-height: 1.25; letter-spacing: 0;
  font-family: "Avenir Next Condensed", "Avenir Next", Avenir, system-ui, sans-serif; overflow-wrap: anywhere;
}
.ui-at-steer__sub { margin: 2px 0 0; display: flex; flex-wrap: wrap; gap: 0 6px; font-size: 12.5px; color: var(--muted); }
.ui-at-steer__state {
  flex: none; display: inline-flex; align-items: center; gap: 6px; height: 26px; padding: 0 10px; border-radius: 999px;
  background: var(--info-fill); border: 1px solid var(--info-line); color: var(--info-ink);
  font-size: 12.5px; font-weight: 600; font-variant-numeric: tabular-nums; white-space: nowrap;
  transition: background-color 300ms var(--ease), color 300ms var(--ease), border-color 300ms var(--ease);
}
.ui-at-steer__state-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
.ui-at-steer__state[data-status="running"] .ui-at-steer__state-dot { animation: ui-at-steer-blink 1.6s ease-in-out infinite; }
@keyframes ui-at-steer-blink { 50% { opacity: .35; } }
.ui-at-steer__state[data-status="paused"] { background: var(--wait-fill); border-color: var(--wait-line); color: var(--wait-ink); }
.ui-at-steer__state[data-status="done"] { background: var(--ok-fill); border-color: var(--ok-line); color: var(--ok-ink); }
.ui-at-steer__icon-btn {
  flex: none; width: 32px; height: 32px; display: grid; place-items: center; border-radius: 10px;
  background: var(--secondary); border: 1px solid var(--line-firm); box-shadow: var(--drop); color: var(--ink);
  transition: background-color 150ms var(--ease);
}
.ui-at-steer__icon-btn:hover { background: var(--soft); }

.ui-at-steer__steps { list-style: none; margin: 0; padding: 12px 16px 14px; }
.ui-at-steer__step { display: flex; gap: 12px; }
.ui-at-steer__mark { position: relative; flex: none; width: 16px; display: flex; flex-direction: column; align-items: center; padding-top: 4px; color: var(--muted); }
.ui-at-steer__step[data-status="done"] .ui-at-steer__mark { color: var(--ink); }
.ui-at-steer__step[data-status="active"] .ui-at-steer__mark { color: var(--run); }
.ui-at-steer__link { flex: 1; width: 0; min-height: 8px; margin: 3px 0 -1px; border-left: 1.5px dashed var(--line-firm); }
.ui-at-steer__step[data-status="done"] .ui-at-steer__link { border-left-style: solid; border-color: var(--line-firm); }
.ui-at-steer__spin { animation: ui-at-steer-spin 900ms linear infinite; }
@keyframes ui-at-steer-spin { to { transform: rotate(360deg); } }
.ui-at-steer__tick { stroke-dasharray: 12; animation: ui-at-steer-draw 360ms var(--ease) both; }
@keyframes ui-at-steer-draw { from { stroke-dashoffset: 12; } to { stroke-dashoffset: 0; } }
.ui-at-steer__step[data-status="done"] .ui-at-steer__mark svg { animation: ui-at-steer-pop 300ms var(--ease); }
@keyframes ui-at-steer-pop { from { transform: scale(.6); } }
.ui-at-steer__step-body { min-width: 0; flex: 1; padding: 2px 0 10px; }
.ui-at-steer__step:last-child .ui-at-steer__step-body { padding-bottom: 0; }
.ui-at-steer__step-row { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; }
.ui-at-steer__step-title { min-width: 0; color: var(--text); font-size: 14.5px; overflow-wrap: anywhere; }
.ui-at-steer__step[data-status="pending"] .ui-at-steer__step-title { color: var(--muted); }
.ui-at-steer__step[data-status="active"] .ui-at-steer__step-title {
  color: var(--ink); font-weight: 600;
  background: linear-gradient(100deg, var(--ink) 40%, var(--run) 50%, var(--ink) 60%) 0 0 / 250% 100%;
  -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
  animation: ui-at-steer-shimmer 2.6s linear infinite;
}
@keyframes ui-at-steer-shimmer { from { background-position: 100% 0; } to { background-position: -150% 0; } }
.ui-at-steer__step-time { flex: none; font-size: 12.5px; color: var(--muted); font-variant-numeric: tabular-nums; }
.ui-at-steer__picked { list-style: none; margin: 6px 0 0; padding: 0; display: grid; gap: 4px; }
.ui-at-steer__note {
  display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; padding: 6px 8px 6px 10px;
  border-radius: 9px; background: var(--soft); border: 1px solid var(--line); border-left: 2px solid var(--berry);
  font-size: 13px; color: var(--ink); position: relative; z-index: 2;
}
.ui-at-steer__note--landed { animation: ui-at-steer-glow 900ms var(--ease); }
@keyframes ui-at-steer-glow { 0% { box-shadow: 0 0 0 4px var(--berry-soft); } 100% { box-shadow: 0 0 0 0 transparent; } }
.ui-at-steer__note-text { min-width: 0; overflow-wrap: anywhere; }
.ui-at-steer__note-tag {
  flex: none; height: 18px; display: inline-flex; align-items: center; padding: 0 6px; border-radius: 6px;
  background: var(--info-fill); border: 1px solid var(--info-line); color: var(--info-ink); font-size: 10.5px; font-weight: 600;
  letter-spacing: 0.04em; text-transform: uppercase;
}
.ui-at-steer__note[data-picked="now"] .ui-at-steer__note-tag { background: var(--wait-fill); border-color: var(--wait-line); color: var(--wait-ink); }

.ui-at-steer__queue { padding: 12px 6px 0; }
.ui-at-steer__queue-head { margin: 0 0 8px 8px; display: flex; align-items: center; gap: 6px; font-size: 12.5px; color: var(--muted); }
.ui-at-steer__count {
  min-width: 18px; height: 18px; padding: 0 5px; display: inline-grid; place-items: center; border-radius: 999px;
  background: var(--panel); border: 1px solid var(--line); box-shadow: var(--pebble-shade);
  font-size: 11px; font-weight: 600; color: var(--text);
}
.ui-at-steer__queue-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 6px; }
.ui-at-steer__queued {
  display: flex; align-items: center; gap: 6px; min-height: 38px; padding: 4px 6px 4px 12px; border-radius: 12px;
  background: var(--panel); border: 1px solid var(--line); border-left: 3px solid var(--berry); box-shadow: var(--drop);
  font-size: 13.5px; color: var(--ink); animation: ui-at-steer-in 300ms var(--ease);
}
@keyframes ui-at-steer-in { from { opacity: 0; transform: translateY(6px); } }
.ui-at-steer__queued-text { min-width: 0; flex: 1; overflow-wrap: anywhere; }
.ui-at-steer__now {
  flex: none; display: inline-flex; align-items: center; gap: 4px; height: 28px; padding: 0 8px; border: 0; border-radius: 8px;
  background: transparent; font-size: 12.5px; font-weight: 600; color: var(--ink); transition: background-color 150ms var(--ease);
}
.ui-at-steer__now:hover { background: var(--soft); }
.ui-at-steer__x {
  flex: none; width: 28px; height: 28px; display: grid; place-items: center; border: 0; border-radius: 8px;
  background: transparent; color: var(--muted); transition: background-color 150ms var(--ease);
}
.ui-at-steer__x:hover { background: var(--soft); color: var(--ink); }

.ui-at-steer__fold { display: grid; grid-template-rows: 0fr; opacity: 0; transition: grid-template-rows 300ms var(--ease), opacity 300ms var(--ease); }
.ui-at-steer__fold[data-open] { grid-template-rows: 1fr; opacity: 1; }
.ui-at-steer__fold-in { overflow: hidden; min-height: 0; }
.ui-at-steer__compose { padding: 10px 0 4px; }
.ui-at-steer__field {
  display: flex; align-items: flex-end; gap: 8px; padding: 6px 6px 6px 14px; border-radius: 14px;
  background: var(--panel); border: 1px solid var(--line-firm); box-shadow: var(--field-shade);
  transition: box-shadow 150ms var(--ease);
}
.ui-at-steer__field:focus-within { box-shadow: 0 0 0 3px var(--ring), var(--field-shade); }
.ui-at-steer__input {
  flex: 1; min-width: 0; min-height: 30px; max-height: 120px; padding: 5px 0; border: 0; outline: none; resize: none;
  background: transparent; color: var(--ink); caret-color: var(--berry); font: inherit; font-size: 14.5px; line-height: 20px;
}
.ui-at-steer__input::placeholder { color: var(--muted); }
.ui-at-steer__input:focus-visible { box-shadow: none; }
.ui-at-steer__send {
  flex: none; width: 32px; height: 32px; display: grid; place-items: center; border-radius: 10px; border: 1px solid var(--berry);
  background: var(--berry); color: #fff !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 6px 12px -6px rgba(133, 20, 55, 0.6);
  transition: background-color 150ms var(--ease), opacity 150ms var(--ease);
}
.ui-at-steer__send:hover:not(:disabled) { background: var(--berry-hover); }
.ui-at-steer__send:disabled { opacity: .28; cursor: default; box-shadow: none; }
.ui-at-steer__hints { margin: 8px 0 0 6px; display: flex; flex-wrap: wrap; gap: 4px 16px; font-size: 12px; color: var(--muted); }
.ui-at-steer__hint { display: inline-flex; align-items: center; gap: 4px; }
.ui-at-steer__kbd {
  min-width: 20px; height: 20px; padding: 0 4px; display: inline-grid; place-items: center; border-radius: 6px;
  background: var(--panel); border: 1px solid var(--line); border-bottom-color: var(--line-firm); border-bottom-width: 2px;
  font: 600 11px/1 "Avenir Next", Avenir, system-ui, sans-serif; color: var(--text);
}
.ui-at-steer__hint .ui-at-steer__kbd + .ui-at-steer__kbd { margin-left: -1px; }

@container (max-width: 380px) {
  .ui-at-steer__head { padding: 12px 10px 12px 12px; gap: 8px; flex-wrap: wrap; }
  .ui-at-steer__who { flex-basis: calc(100% - 40px); }
  .ui-at-steer__state { order: 3; }
  .ui-at-steer__steps { padding: 10px 12px 12px; }
  .ui-at-steer__inner { padding: 5px; }
}
@media (pointer: coarse) {
  .ui-at-steer__now, .ui-at-steer__x { height: 36px; min-width: 36px; }
  .ui-at-steer__icon-btn, .ui-at-steer__send { width: 40px; height: 40px; }
}
@media (prefers-reduced-motion: reduce) {
  .ui-at-steer *, .ui-at-steer *::before, .ui-at-steer *::after { transition-duration: 0ms !important; animation: none !important; }
  .ui-at-steer { transition: none !important; }
  .ui-at-steer__step[data-status="active"] .ui-at-steer__step-title { -webkit-text-fill-color: currentColor; background: none; }
}
`;
