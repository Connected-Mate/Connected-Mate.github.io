var e=`"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";

export type AgentTaskStatus = "running" | "waiting" | "done" | "failed";

export type AgentTaskStep = {
  label: string;
  /** Free text, e.g. "2m ago" or "now" */
  time?: string;
};

export type AgentTask = {
  id: string;
  title: string;
  /** One or two sentences – clamped to two lines on the card */
  description?: string;
  /** Agent or model that runs the task */
  agent: string;
  status: AgentTaskStatus;
  /** When the task started (running and waiting tasks tick from here) */
  startedAt?: number | Date;
  /** How long a finished task took, in ms */
  elapsed?: number;
  /** Number of tool calls */
  tools?: number;
  /** Number of sources read */
  sources?: number;
  /** Oldest first */
  steps?: AgentTaskStep[];
};

export type AgentInboxView = "board" | "list";

export type AgentInboxProps = {
  tasks: AgentTask[];
  onApprove?: (task: AgentTask) => void;
  onReject?: (task: AgentTask) => void;
  onRetry?: (task: AgentTask) => void;
  onOpen?: (task: AgentTask) => void;
  title?: string;
  action?: { label: string; onClick: () => void };
  view?: AgentInboxView;
  defaultView?: AgentInboxView;
  onViewChange?: (view: AgentInboxView) => void;
  className?: string;
};

type Column = "needs" | "running" | "done";

const COLUMNS: { id: Column; label: string }[] = [
  { id: "needs", label: "Needs you" },
  { id: "running", label: "Running" },
  { id: "done", label: "Done" },
];

const columnOf = (s: AgentTaskStatus): Column =>
  s === "waiting" || s === "failed" ? "needs" : s === "running" ? "running" : "done";

const STATUS_WORD: Record<AgentTaskStatus, string> = {
  running: "Running",
  waiting: "Needs you",
  done: "Done",
  failed: "Failed",
};

/** How long a card shows its new state in place before it glides to its new column */
const SETTLE_MS = 520;
/** Below this container width the board always becomes a list */
const BOARD_MIN = 620;

const toMs = (t?: number | Date) => (t instanceof Date ? t.getTime() : t);

export function formatDuration(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h) return \`\${h}h \${String(m).padStart(2, "0")}m\`;
  if (m) return \`\${m}m \${String(sec).padStart(2, "0")}s\`;
  return \`\${sec}s\`;
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
  <svg width="12" height="12" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
    <path
      fill="currentColor"
      d="M8 1.2c.35 2.9 1.9 4.45 4.8 4.8-2.9.35-4.45 1.9-4.8 4.8-.35-2.9-1.9-4.45-4.8-4.8 2.9-.35 4.45-1.9 4.8-4.8Z"
    />
    <path fill="currentColor" opacity=".55" d="M12.6 10.2c.15 1.2.8 1.85 2 2-1.2.15-1.85.8-2 2-.15-1.2-.8-1.85-2-2 1.2-.15 1.85-.8 2-2Z" />
  </svg>
);
const SearchIcon = () => (
  <Svg size={12}>
    <circle cx="7" cy="7" r="4.2" />
    <path d="m10.2 10.2 3.3 3.3" />
  </Svg>
);
const ToolIcon = () => (
  <Svg size={12}>
    <path d="M10.4 2.2a3.3 3.3 0 0 0-3.9 4.3L2.3 10.7a1.4 1.4 0 0 0 2 2l4.2-4.2a3.3 3.3 0 0 0 4.3-3.9l-2 2-1.9-.4-.4-1.9 1.9-2.1Z" />
  </Svg>
);
const BoardIcon = () => (
  <Svg>
    <rect x="2.5" y="3" width="4" height="10" rx="1.2" />
    <rect x="9.5" y="3" width="4" height="7" rx="1.2" />
  </Svg>
);
const ListIcon = () => (
  <Svg>
    <path d="M3 4.5h10M3 8h10M3 11.5h10" />
  </Svg>
);
const Spinner = () => (
  <svg className="ui-at-inbox__spin" width="12" height="12" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
    <circle cx="8" cy="8" r="5.6" fill="none" stroke="currentColor" strokeOpacity=".25" strokeWidth="2" />
    <path d="M8 2.4a5.6 5.6 0 0 1 5.6 5.6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const Warn = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
    <path fill="currentColor" d="M7.1 2.3a1 1 0 0 1 1.8 0l5.6 10.2a1 1 0 0 1-.9 1.5H2.4a1 1 0 0 1-.9-1.5L7.1 2.3Z" />
    <path stroke="var(--wait-fill)" strokeWidth="1.5" strokeLinecap="round" d="M8 6.2v3.1M8 11.4v.1" />
  </svg>
);
const Bang = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
    <circle cx="8" cy="8" r="6.5" fill="currentColor" />
    <path stroke="var(--bad-fill)" strokeWidth="1.6" strokeLinecap="round" d="M8 4.8v3.6M8 11v.1" />
  </svg>
);
const Dot = () => (
  <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden="true" focusable="false">
    <circle cx="4" cy="4" r="3" fill="currentColor" />
  </svg>
);

/* ---------- component ---------- */

export function AgentInbox({
  tasks,
  onApprove,
  onReject,
  onRetry,
  onOpen,
  title = "Agent inbox",
  action,
  view: viewProp,
  defaultView = "board",
  onViewChange,
  className,
}: AgentInboxProps) {
  const uid = useId();
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);

  /* Status changes made inside the board when no handler is passed */
  const [local, setLocal] = useState<Record<string, Partial<AgentTask>>>({});
  const list = useMemo(
    () => tasks.map((t) => (local[t.id] ? { ...t, ...local[t.id] } : t)),
    [tasks, local],
  );

  /* Layout: controlled or not, and forced to a list in narrow containers */
  const [innerView, setInnerView] = useState<AgentInboxView>(defaultView);
  const chosen = viewProp ?? innerView;
  const [narrow, setNarrow] = useState(false);
  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const measure = () => setNarrow(el.clientWidth < BOARD_MIN);
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const view: AgentInboxView = narrow ? "list" : chosen;
  const pickView = (v: AgentInboxView) => {
    if (viewProp === undefined) setInnerView(v);
    onViewChange?.(v);
  };

  /* Clock: one tick per second while a clock is visible */
  const [now, setNow] = useState(() => Date.now());
  const ticking = list.some((t) => (t.status === "running" || t.status === "waiting") && toMs(t.startedAt) != null);
  useEffect(() => {
    if (!ticking) return;
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [ticking]);

  /* Placed column: lags behind the status so the new state shows in place first */
  const [placed, setPlaced] = useState<Record<string, Column>>(() =>
    Object.fromEntries(list.map((t) => [t.id, columnOf(t.status)])),
  );
  const pending = useRef(new Map<string, number>());
  useEffect(() => {
    const next: Record<string, Column> = {};
    let changed = false;
    for (const t of list) {
      const target = columnOf(t.status);
      const cur = placed[t.id];
      if (cur === undefined) {
        next[t.id] = target;
        changed = true;
      } else if (cur !== target) {
        if (reduced) {
          next[t.id] = target;
          changed = true;
        } else if (!pending.current.has(t.id)) {
          const handle = window.setTimeout(() => {
            pending.current.delete(t.id);
            setPlaced((p) => ({ ...p, [t.id]: target }));
          }, SETTLE_MS);
          pending.current.set(t.id, handle);
        }
      } else if (pending.current.has(t.id)) {
        window.clearTimeout(pending.current.get(t.id));
        pending.current.delete(t.id);
      }
    }
    if (changed) setPlaced((p) => ({ ...p, ...next }));
  }, [list, placed, reduced]);
  useEffect(() => {
    const map = pending.current;
    return () => map.forEach((h) => window.clearTimeout(h));
  }, []);

  /* FLIP: positions are read right before React commits, compared right after */
  const cardEls = useRef(new Map<string, HTMLElement>());
  const before = useRef<Map<string, { x: number; y: number }> | null>(null);
  const measure = () => {
    const map = new Map<string, { x: number; y: number }>();
    cardEls.current.forEach((el, id) => {
      const r = el.getBoundingClientRect();
      map.set(id, { x: r.left, y: r.top });
    });
    return map;
  };
  if (typeof window !== "undefined" && cardEls.current.size) before.current = measure();
  useLayoutEffect(() => {
    const prev = before.current;
    before.current = null;
    // Nobody sees a hidden page, and its animations would not advance
    if (!prev || reduced || document.hidden) return;
    cardEls.current.forEach((el, id) => {
      const from = prev.get(id);
      if (!from || typeof el.animate !== "function") return;
      el.getAnimations?.().forEach((a) => a.cancel());
      const r = el.getBoundingClientRect();
      const dx = from.x - r.left;
      const dy = from.y - r.top;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
      el.animate(
        [{ transform: \`translate(\${dx}px, \${dy}px)\` }, { transform: "translate(0, 0)" }],
        { duration: 460, easing: "cubic-bezier(.16, 1, .3, 1)" },
      );
    });
  });

  /* One card open at a time */
  const [openId, setOpenId] = useState<string | null>(null);
  const headRefs = useRef(new Map<string, HTMLButtonElement>());
  useEffect(() => {
    if (openId && !list.some((t) => t.id === openId)) setOpenId(null);
  }, [list, openId]);

  const patch = useCallback((id: string, p: Partial<AgentTask>) => {
    setLocal((l) => ({ ...l, [id]: { ...l[id], ...p } }));
  }, []);
  const approve = (t: AgentTask) => (onApprove ? onApprove(t) : patch(t.id, { status: "running" }));
  const reject = (t: AgentTask) => (onReject ? onReject(t) : patch(t.id, { status: "failed" }));
  const retry = (t: AgentTask) =>
    onRetry ? onRetry(t) : patch(t.id, { status: "running", startedAt: Date.now(), elapsed: undefined });

  const onKeyDown = (e: ReactKeyboardEvent) => {
    if (e.key === "Escape" && openId) {
      e.preventDefault();
      const id = openId;
      setOpenId(null);
      headRefs.current.get(id)?.focus();
    }
  };

  const needs = list.filter((t) => t.status === "waiting" || t.status === "failed").length;
  const running = list.filter((t) => t.status === "running").length;
  const announce = \`\${needs} \${needs === 1 ? "task needs" : "tasks need"} you, \${running} running\`;

  const byColumn = (c: Column) => list.filter((t) => (placed[t.id] ?? columnOf(t.status)) === c);

  const renderCard = (t: AgentTask) => {
    const open = openId === t.id;
    const start = toMs(t.startedAt);
    const live = t.status === "running" || t.status === "waiting";
    const clock = live && start != null ? formatDuration(now - start) : t.elapsed != null ? formatDuration(t.elapsed) : null;
    const detailsId = \`\${uid}-\${t.id}-details\`;
    const steps = t.steps ?? [];
    const actions: ReactNode[] = [];
    if (t.status === "waiting") {
      actions.push(
        <button key="r" type="button" className="ui-at-inbox__btn" onClick={() => reject(t)}>
          Reject
        </button>,
        <button key="a" type="button" className="ui-at-inbox__btn ui-at-inbox__btn--main" onClick={() => approve(t)}>
          Approve
        </button>,
      );
    } else if (t.status === "failed") {
      actions.push(
        <button key="t" type="button" className="ui-at-inbox__btn ui-at-inbox__btn--main" onClick={() => retry(t)}>
          Retry
        </button>,
      );
    } else if (onOpen) {
      actions.push(
        <button key="o" type="button" className="ui-at-inbox__btn" onClick={() => onOpen(t)}>
          Open
        </button>,
      );
    }

    return (
      <li
        key={t.id}
        className="ui-at-inbox__card"
        data-status={t.status}
        data-open={open || undefined}
        data-task={t.id}
        ref={(el) => {
          if (el) cardEls.current.set(t.id, el);
          else cardEls.current.delete(t.id);
        }}
      >
        <button
          type="button"
          className="ui-at-inbox__head"
          aria-expanded={open}
          aria-controls={detailsId}
          ref={(el) => {
            if (el) headRefs.current.set(t.id, el);
            else headRefs.current.delete(t.id);
          }}
          onClick={() => setOpenId(open ? null : t.id)}
        >
          <span className="ui-at-inbox__title">
            <span className="ui-at-inbox__mark">
              <Sparkle />
            </span>
            <span className="ui-at-inbox__name">{t.title}</span>
          </span>
          {t.description ? <span className="ui-at-inbox__desc">{t.description}</span> : null}
          <span className="ui-at-inbox__meta">
            <span className="ui-at-inbox__pill" data-status={t.status}>
              {t.status === "running" ? <Spinner /> : t.status === "waiting" ? <Warn /> : t.status === "failed" ? <Bang /> : <Dot />}
              <span className="ui-at-inbox__sr">{STATUS_WORD[t.status]}, </span>
              <span className="ui-at-inbox__clock" aria-hidden={t.status === "failed" ? undefined : true}>
                {t.status === "failed" ? "Failed" : clock ?? STATUS_WORD[t.status]}
              </span>
              {t.status !== "failed" && clock ? <span className="ui-at-inbox__sr">{clock}</span> : null}
            </span>
            <span className="ui-at-inbox__counts">
              {t.sources != null ? (
                <span className="ui-at-inbox__count" title={\`\${t.sources} sources\`}>
                  <SearchIcon />
                  {t.sources}
                  <span className="ui-at-inbox__sr"> sources</span>
                </span>
              ) : null}
              {t.tools != null ? (
                <span className="ui-at-inbox__count" title={\`\${t.tools} tool calls\`}>
                  <ToolIcon />
                  {t.tools}
                  <span className="ui-at-inbox__sr"> tool calls</span>
                </span>
              ) : null}
            </span>
          </span>
        </button>
        <div className="ui-at-inbox__fold" id={detailsId} inert={!open}>
          <div className="ui-at-inbox__fold-in">
            <div className="ui-at-inbox__details">
              <p className="ui-at-inbox__agent">{t.agent}</p>
              {steps.length ? (
                <ol className="ui-at-inbox__steps" aria-label={\`Last steps of \${t.title}\`}>
                  {steps.map((s, i) => (
                    <li key={i} className="ui-at-inbox__step" data-last={i === steps.length - 1 || undefined}>
                      <span className="ui-at-inbox__step-label">{s.label}</span>
                      {s.time ? <span className="ui-at-inbox__step-time">{s.time}</span> : null}
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="ui-at-inbox__nosteps">No steps reported yet.</p>
              )}
              {actions.length ? <div className="ui-at-inbox__actions">{actions}</div> : null}
            </div>
          </div>
        </div>
      </li>
    );
  };

  return (
    <div
      ref={rootRef}
      className={["ui-at-inbox", className].filter(Boolean).join(" ")}
      data-view={view}
      onKeyDown={onKeyDown}
    >
      <style href="ui-agent-inbox" precedence="default">
        {css}
      </style>
      <div className="ui-at-inbox__bar">
        <p className="ui-at-inbox__crumbs">
          <span className="ui-at-inbox__crumb">Agents</span>
          <span className="ui-at-inbox__slash" aria-hidden="true">
            /
          </span>
          <span className="ui-at-inbox__heading">{title}</span>
        </p>
        <div className="ui-at-inbox__tools">
          {action ? (
            <button type="button" className="ui-at-inbox__btn ui-at-inbox__btn--main" onClick={action.onClick}>
              {action.label}
            </button>
          ) : null}
          {!narrow ? (
            <div className="ui-at-inbox__switch" role="radiogroup" aria-label="Layout">
              {(["board", "list"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  role="radio"
                  aria-checked={view === v}
                  tabIndex={view === v ? 0 : -1}
                  className="ui-at-inbox__seg"
                  onClick={() => pickView(v)}
                  onKeyDown={(e) => {
                    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
                      e.preventDefault();
                      const nextV = v === "board" ? "list" : "board";
                      pickView(nextV);
                      const sib = (e.currentTarget.parentElement?.querySelector(\`[data-v="\${nextV}"]\`) as HTMLElement | null);
                      sib?.focus();
                    }
                  }}
                  data-v={v}
                >
                  {v === "board" ? <BoardIcon /> : <ListIcon />}
                  {v === "board" ? "Board" : "List"}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {list.length === 0 ? (
        <div className="ui-at-inbox__empty">
          <span className="ui-at-inbox__empty-mark">
            <Sparkle />
          </span>
          <p className="ui-at-inbox__empty-title">No agent tasks yet</p>
          <p className="ui-at-inbox__empty-text">Tasks your agents run in the background show up here.</p>
        </div>
      ) : (
        <div className="ui-at-inbox__cols">
          {COLUMNS.map((c) => {
            const items = byColumn(c.id);
            const hid = \`\${uid}-\${c.id}\`;
            return (
              <section key={c.id} className="ui-at-inbox__col" data-col={c.id} aria-labelledby={hid}>
                <h3 className="ui-at-inbox__col-head" id={hid}>
                  <span className="ui-at-inbox__col-mark">
                    <Sparkle />
                  </span>
                  {c.label}
                  <span className="ui-at-inbox__badge" aria-label={\`\${items.length} \${items.length === 1 ? "task" : "tasks"}\`}>
                    {items.length}
                  </span>
                </h3>
                {items.length ? (
                  <ul className="ui-at-inbox__cards">{items.map(renderCard)}</ul>
                ) : (
                  <p className="ui-at-inbox__none">{c.id === "needs" ? "Nothing waits for you" : c.id === "running" ? "Nothing running" : "Nothing finished yet"}</p>
                )}
              </section>
            );
          })}
        </div>
      )}
      <p className="ui-at-inbox__sr" role="status" aria-live="polite">
        {list.length ? announce : ""}
      </p>
    </div>
  );
}

/* ---------- styles ---------- */

const css = /* css */ \`
.ui-at-inbox {
  --frame: #f2f6fa; --panel: #ffffff; --soft: rgba(26, 62, 112, 0.06);
  --line: #dae2ec; --line-firm: #cbd6e4;
  --ink: #00162b; --text: rgba(0, 22, 43, 0.66); --muted: rgba(0, 22, 43, 0.54);
  --berry: #851437; --berry-hover: #6d0f2d;
  --info-ink: #1a3e70; --info-fill: #eef5ff; --info-line: #c1daff; --ring: #8fbdf2;
  --ok-ink: #1d6a34; --ok-fill: #eafbee; --ok-line: #c9f5cf;
  --wait-ink: #775810; --wait-fill: #fdf6dd; --wait-line: #fae6a0;
  --bad-ink: #8a3a22; --bad-fill: #fdeee8; --bad-line: #f5d5c9;
  --mark-run: #2f6fc4; --mark-wait: #c48a12; --mark-done: #2f9a52; --mark-bad: #c4472a;
  --secondary: #fbfcfe;
  --drop: 0 8px 16px -8px rgba(26, 62, 112, 0.2);
  --raised: 0 18px 30px -16px rgba(26, 62, 112, 0.38), 0 4px 10px -6px rgba(26, 62, 112, 0.18);
  --float: 0 24px 48px -24px rgba(26, 62, 112, 0.3);
  --ease: cubic-bezier(.16, 1, .3, 1);
  box-sizing: border-box;
  width: 100%;
  max-width: 760px;
  padding: 6px;
  border-radius: 22px;
  background: var(--frame);
  border: 1px solid var(--line);
  box-shadow: var(--float);
  font-family: "Avenir Next", Avenir, system-ui, sans-serif;
  color: var(--text);
  font-size: 14px;
  line-height: 1.5;
  text-align: left;
}
:where(.dark, [data-theme="dark"]) .ui-at-inbox {
  --frame: #0f2747; --panel: #16345c; --soft: rgba(255, 255, 255, 0.07);
  --line: rgba(255, 255, 255, 0.12); --line-firm: rgba(255, 255, 255, 0.18);
  --ink: rgba(255, 255, 255, 0.94); --text: rgba(255, 255, 255, 0.72); --muted: rgba(255, 255, 255, 0.56);
  --berry: #a8204d; --berry-hover: #bd2a5a;
  --info-ink: #c1daff; --info-fill: rgba(143, 189, 242, 0.16); --info-line: rgba(143, 189, 242, 0.34); --ring: rgba(143, 189, 242, 0.6);
  --ok-ink: #7fe0a0; --ok-fill: rgba(127, 224, 160, 0.14); --ok-line: rgba(127, 224, 160, 0.3);
  --wait-ink: #f3d27a; --wait-fill: rgba(243, 210, 122, 0.14); --wait-line: rgba(243, 210, 122, 0.3);
  --bad-ink: #f2a48c; --bad-fill: rgba(242, 164, 140, 0.14); --bad-line: rgba(242, 164, 140, 0.3);
  --mark-run: #8fbdf2; --mark-wait: #f3d27a; --mark-done: #7fe0a0; --mark-bad: #f2a48c;
  --secondary: rgba(255, 255, 255, 0.06);
  --drop: 0 8px 16px -8px rgba(3, 12, 28, 0.6);
  --raised: 0 18px 30px -16px rgba(3, 12, 28, 0.8), 0 4px 10px -6px rgba(3, 12, 28, 0.6);
  --float: 0 24px 48px -24px rgba(3, 12, 28, 0.7);
}
.ui-at-inbox *, .ui-at-inbox *::before, .ui-at-inbox *::after { box-sizing: border-box; }
.ui-at-inbox :where(button) { font: inherit; color: inherit; cursor: pointer; }
.ui-at-inbox :focus-visible { outline: none; box-shadow: 0 0 0 3px var(--ring); }
.ui-at-inbox__sr {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0;
}

.ui-at-inbox__bar {
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  padding: 10px 10px 10px 14px; min-height: 52px;
}
.ui-at-inbox__crumbs {
  margin: 0; min-width: 0; display: flex; align-items: baseline; gap: 8px;
  font-family: "Avenir Next Condensed", "Avenir Next", Avenir, system-ui, sans-serif; font-size: 17px;
}
.ui-at-inbox__crumb { color: var(--muted); font-weight: 500; }
.ui-at-inbox__slash { color: var(--muted); opacity: .6; }
.ui-at-inbox__heading {
  color: var(--ink); font-weight: 700; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.ui-at-inbox__tools { display: flex; align-items: center; gap: 8px; flex: none; }
.ui-at-inbox__switch {
  display: inline-flex; padding: 3px; gap: 2px; border-radius: 12px;
  background: var(--soft); border: 1px solid var(--line);
}
.ui-at-inbox__seg {
  display: inline-flex; align-items: center; gap: 6px; height: 30px; padding: 0 12px;
  border: 1px solid transparent; border-radius: 9px; background: transparent;
  color: var(--muted); font-size: 13.5px; font-weight: 500;
  transition: background-color 150ms var(--ease), color 150ms var(--ease), box-shadow 150ms var(--ease);
}
.ui-at-inbox__seg:hover { color: var(--ink); }
.ui-at-inbox__seg[aria-checked="true"] {
  background: var(--panel); color: var(--ink); font-weight: 600;
  border-color: var(--line); box-shadow: var(--drop);
}

.ui-at-inbox__cols { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px; }
.ui-at-inbox[data-view="list"] .ui-at-inbox__cols { grid-template-columns: minmax(0, 1fr); gap: 4px; }
.ui-at-inbox__col { min-width: 0; display: flex; flex-direction: column; }
.ui-at-inbox__col-head {
  margin: 0; display: flex; align-items: center; gap: 7px; padding: 6px 10px 8px;
  font-size: 13.5px; font-weight: 600; color: var(--ink); letter-spacing: 0;
}
.ui-at-inbox__col-mark { display: inline-flex; }
.ui-at-inbox__col[data-col="needs"] .ui-at-inbox__col-mark { color: var(--mark-wait); }
.ui-at-inbox__col[data-col="running"] .ui-at-inbox__col-mark { color: var(--mark-run); }
.ui-at-inbox__col[data-col="done"] .ui-at-inbox__col-mark { color: var(--mark-done); }
.ui-at-inbox__badge {
  display: inline-grid; place-items: center; min-width: 20px; height: 20px; padding: 0 6px;
  border-radius: 999px; background: var(--panel); border: 1px solid var(--line);
  box-shadow: inset 0 -2px 6px -4px rgba(26, 62, 112, 0.4);
  font-size: 11.5px; font-weight: 600; color: var(--text); font-variant-numeric: tabular-nums;
}
.ui-at-inbox__cards { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
.ui-at-inbox__none {
  margin: 0; padding: 14px 12px; border-radius: 14px; border: 1px dashed var(--line-firm);
  color: var(--muted); font-size: 13px; text-align: center;
}
.ui-at-inbox[data-view="list"] .ui-at-inbox__none { text-align: left; }

.ui-at-inbox__card {
  position: relative; background: var(--panel); border: 1px solid var(--line);
  border-radius: 16px; box-shadow: var(--raised); will-change: transform;
  transition: border-color 300ms var(--ease);
}
.ui-at-inbox__head {
  display: flex; flex-direction: column; gap: 6px; width: 100%; padding: 13px 14px 12px;
  background: transparent; border: 0; border-radius: 16px; text-align: left;
}
.ui-at-inbox__title { display: flex; align-items: flex-start; gap: 9px; min-width: 0; }
.ui-at-inbox__mark { display: inline-flex; margin-top: 4px; color: var(--mark-run); transition: color 300ms var(--ease); }
.ui-at-inbox__card[data-status="waiting"] .ui-at-inbox__mark { color: var(--mark-wait); }
.ui-at-inbox__card[data-status="done"] .ui-at-inbox__mark { color: var(--mark-done); }
.ui-at-inbox__card[data-status="failed"] .ui-at-inbox__mark { color: var(--mark-bad); }
.ui-at-inbox__name {
  min-width: 0; color: var(--ink); font-weight: 700; font-size: 16px; line-height: 1.3;
  font-family: "Avenir Next Condensed", "Avenir Next", Avenir, system-ui, sans-serif;
  overflow-wrap: anywhere;
}
.ui-at-inbox__desc {
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  font-size: 13.5px; line-height: 1.45; color: var(--text); overflow-wrap: anywhere;
}
.ui-at-inbox__meta { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-top: 4px; flex-wrap: wrap; }
.ui-at-inbox__pill {
  display: inline-flex; align-items: center; gap: 6px; height: 24px; padding: 0 10px;
  border-radius: 999px; border: 1px solid var(--info-line); background: var(--info-fill); color: var(--info-ink);
  font-size: 12.5px; font-weight: 600; font-variant-numeric: tabular-nums; white-space: nowrap;
  transition: background-color 300ms var(--ease), color 300ms var(--ease), border-color 300ms var(--ease);
}
.ui-at-inbox__pill[data-status="waiting"] { background: var(--wait-fill); color: var(--wait-ink); border-color: var(--wait-line); }
.ui-at-inbox__pill[data-status="done"] { background: var(--ok-fill); color: var(--ok-ink); border-color: var(--ok-line); }
.ui-at-inbox__pill[data-status="failed"] { background: var(--bad-fill); color: var(--bad-ink); border-color: var(--bad-line); }
.ui-at-inbox__spin { animation: ui-at-inbox-spin 900ms linear infinite; }
@keyframes ui-at-inbox-spin { to { transform: rotate(360deg); } }
.ui-at-inbox__counts { display: inline-flex; align-items: center; color: var(--muted); font-size: 12.5px; font-variant-numeric: tabular-nums; }
.ui-at-inbox__count { display: inline-flex; align-items: center; gap: 4px; padding: 0 8px; }
.ui-at-inbox__count + .ui-at-inbox__count { border-left: 1px solid var(--line); }
.ui-at-inbox__count:last-child { padding-right: 0; }

.ui-at-inbox__fold {
  display: grid; grid-template-rows: 0fr; opacity: 0;
  transition: grid-template-rows 300ms var(--ease), opacity 300ms var(--ease);
}
.ui-at-inbox__card[data-open] .ui-at-inbox__fold { grid-template-rows: 1fr; opacity: 1; }
.ui-at-inbox__fold-in { overflow: hidden; min-height: 0; }
.ui-at-inbox__details { margin: 0 14px; padding: 12px 0 14px; border-top: 1px solid var(--line); }
.ui-at-inbox__agent { margin: 0 0 8px; font-size: 12.5px; font-weight: 600; color: var(--muted); }
.ui-at-inbox__steps { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
.ui-at-inbox__step {
  position: relative; display: flex; justify-content: space-between; gap: 10px;
  padding-left: 14px; font-size: 13px; line-height: 1.45; color: var(--muted);
}
.ui-at-inbox__step::before {
  content: ""; position: absolute; left: 2px; top: 7px; width: 5px; height: 5px; border-radius: 50%;
  background: var(--line-firm);
}
.ui-at-inbox__step[data-last] { color: var(--ink); }
.ui-at-inbox__step[data-last]::before { background: var(--berry); }
.ui-at-inbox__step-label { min-width: 0; overflow-wrap: anywhere; }
.ui-at-inbox__step-time { flex: none; font-size: 12px; color: var(--muted); font-variant-numeric: tabular-nums; }
.ui-at-inbox__nosteps { margin: 0; font-size: 13px; color: var(--muted); }
.ui-at-inbox__actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 12px; flex-wrap: wrap; }

.ui-at-inbox__btn {
  display: inline-flex; align-items: center; justify-content: center; height: 32px; padding: 0 14px;
  border-radius: 10px; border: 1px solid var(--line-firm); background: var(--secondary);
  color: var(--ink); font-size: 13.5px; font-weight: 600; box-shadow: var(--drop);
  transition: background-color 150ms var(--ease), transform 150ms var(--ease);
}
.ui-at-inbox__btn:hover { background: var(--soft); }
.ui-at-inbox__btn:active { transform: translateY(1px); }
.ui-at-inbox .ui-at-inbox__btn--main {
  background: var(--berry); border-color: var(--berry); color: #fff;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 6px 12px -6px rgba(133, 20, 55, 0.6);
}
.ui-at-inbox .ui-at-inbox__btn--main:hover { background: var(--berry-hover); border-color: var(--berry-hover); }

.ui-at-inbox__empty {
  margin: 0 0 4px; padding: 36px 20px; text-align: center; background: var(--panel);
  border: 1px solid var(--line); border-radius: 16px; box-shadow: var(--raised);
}
.ui-at-inbox__empty-mark {
  display: inline-grid; place-items: center; width: 36px; height: 36px; border-radius: 12px;
  background: var(--panel); border: 1px solid var(--line); color: var(--mark-run);
  box-shadow: inset 0 -2px 6px -4px rgba(26, 62, 112, 0.4);
}
.ui-at-inbox__empty-title { margin: 12px 0 4px; color: var(--ink); font-weight: 600; }
.ui-at-inbox__empty-text { margin: 0; font-size: 13px; color: var(--muted); }

@media (pointer: coarse) {
  .ui-at-inbox__head { padding-top: 15px; padding-bottom: 14px; }
  .ui-at-inbox__btn { height: 40px; padding: 0 18px; }
  .ui-at-inbox__seg { height: 36px; }
}
@media (prefers-reduced-motion: reduce) {
  .ui-at-inbox *, .ui-at-inbox *::before, .ui-at-inbox *::after { transition-duration: 0ms !important; animation: none !important; }
}
\`;
`;export{e as default};
