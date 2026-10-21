var e=`"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";

export type DelegateAgent = {
  id: string;
  name: string;
  model?: string;
  /** A logo or picture – sits on a white tile. Without it the initials show */
  avatar?: ReactNode;
  /** Minutes left on the task it runs now */
  current?: number;
  /** Cost per minute of work */
  rate?: number;
};

export type DelegateTask = {
  id: string;
  title: string;
  /** Minutes */
  estimate: number;
  tools?: ReactNode[];
  /** No agentId: unassigned */
  agentId?: string | null;
};

export type DelegateMode = "auto" | "manual";

export type DelegateBoardProps = {
  agents: DelegateAgent[];
  tasks: DelegateTask[];
  onAssign?: (taskId: string, agentId: string | null) => void;
  mode?: DelegateMode;
  defaultMode?: DelegateMode;
  onModeChange?: (mode: DelegateMode) => void;
  suggestion?: { taskId: string; agentId: string } | null;
  now?: number;
  formatCost?: (amount: number) => string;
  title?: string;
  className?: string;
};

const MIN = 60_000;
const AUTO_EVERY = 1000;
const DRAG_START = 4;
const EASE = "cubic-bezier(.16, 1, .3, 1)";
const defaultCost = (n: number) => \`$\${n.toFixed(2)}\`;
const initials = (name: string) =>
  name
    .split(/\\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

let timeFormat: Intl.DateTimeFormat | null = null;
const clockTime = (ms: number) => {
  timeFormat ??= new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit" });
  return timeFormat.format(ms);
};

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

const Sparkle = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
    <path
      fill="currentColor"
      d="M8 1.2c.35 2.9 1.9 4.45 4.8 4.8-2.9.35-4.45 1.9-4.8 4.8-.35-2.9-1.9-4.45-4.8-4.8 2.9-.35 4.45-1.9 4.8-4.8Z"
    />
    <path fill="currentColor" opacity=".55" d="M12.6 10.2c.15 1.2.8 1.85 2 2-1.2.15-1.85.8-2 2-.15-1.2-.8-1.85-2-2 1.2-.15 1.85-.8 2-2Z" />
  </svg>
);
const Grip = () => (
  <svg width="8" height="12" viewBox="0 0 10 14" aria-hidden="true" focusable="false">
    {[3, 7, 11].map((y) => (
      <g key={y} fill="currentColor">
        <circle cx="3" cy={y} r="1.1" />
        <circle cx="7" cy={y} r="1.1" />
      </g>
    ))}
  </svg>
);
const Spinner = () => (
  <svg className="ui-at-dlg__spin" width="11" height="11" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
    <circle cx="8" cy="8" r="5.6" fill="none" stroke="currentColor" strokeOpacity=".25" strokeWidth="2" />
    <path d="M8 2.4a5.6 5.6 0 0 1 5.6 5.6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/* ---------- component ---------- */

type Drag = {
  taskId: string;
  from: string | null;
  x: number;
  y: number;
  dx: number;
  dy: number;
  w: number;
  h: number;
  over: string | null | undefined; // agent id, null = pile, undefined = nowhere
  started: boolean;
  pointerId: number;
  sx: number;
  sy: number;
};

export function DelegateBoard({
  agents,
  tasks,
  onAssign,
  mode: modeProp,
  defaultMode = "manual",
  onModeChange,
  suggestion,
  now: nowProp,
  formatCost = defaultCost,
  title = "Delegate",
  className,
}: DelegateBoardProps) {
  const uid = useId();
  const reduced = useReducedMotion();

  /* Uncontrolled moves */
  const [moves, setMoves] = useState<Record<string, string | null>>({});
  const list = useMemo(
    () => tasks.map((t) => (t.id in moves ? { ...t, agentId: moves[t.id] } : t)),
    [tasks, moves],
  );
  const assign = (taskId: string, agentId: string | null) => {
    if (onAssign) onAssign(taskId, agentId);
    else setMoves((m) => ({ ...m, [taskId]: agentId }));
    const task = list.find((t) => t.id === taskId);
    const agent = agents.find((a) => a.id === agentId);
    if (task) setMessage(agent ? \`\${task.title} → \${agent.name}\` : \`\${task.title} → Unassigned\`);
  };

  const [innerMode, setInnerMode] = useState<DelegateMode>(defaultMode);
  const mode = modeProp ?? innerMode;
  const setMode = (m: DelegateMode) => {
    if (modeProp === undefined) setInnerMode(m);
    onModeChange?.(m);
  };

  const [tick, setTick] = useState(() => Date.now());
  useEffect(() => {
    if (nowProp !== undefined) return;
    const id = window.setInterval(() => setTick(Date.now()), 30_000);
    return () => window.clearInterval(id);
  }, [nowProp]);
  const now = nowProp ?? tick;

  const [message, setMessage] = useState("");

  /* Queues and their load */
  const knownAgent = new Set(agents.map((a) => a.id));
  const pile = list.filter((t) => !t.agentId || !knownAgent.has(t.agentId));
  const queueOf = (id: string) => list.filter((t) => t.agentId === id);
  const minutesOf = (a: DelegateAgent, queue: DelegateTask[]) =>
    queue.length ? (a.current ?? queue[0].estimate) + queue.slice(1).reduce((s, t) => s + t.estimate, 0) : 0;
  const load = new Map(agents.map((a) => [a.id, minutesOf(a, queueOf(a.id))]));
  const inQueues = agents.reduce((s, a) => s + (a.rate ?? 0) * (load.get(a.id) ?? 0), 0);
  const anyRate = agents.some((a) => a.rate != null);

  /* ----- Auto: one unassigned task a second to whoever is free first ----- */
  const listRef = useRef(list);
  listRef.current = list;
  const assignRef = useRef(assign);
  assignRef.current = assign;
  useEffect(() => {
    if (mode !== "auto") return;
    const id = window.setInterval(() => {
      const current = listRef.current;
      const next = current.find((t) => !t.agentId || !knownAgentRef.current.has(t.agentId));
      if (!next) return;
      let best: DelegateAgent | null = null;
      let bestLoad = Infinity;
      for (const a of agentsRef.current) {
        const q = current.filter((t) => t.agentId === a.id);
        const l = q.length ? (a.current ?? q[0].estimate) + q.slice(1).reduce((s, t) => s + t.estimate, 0) : 0;
        if (l < bestLoad) {
          best = a;
          bestLoad = l;
        }
      }
      if (best) assignRef.current(next.id, best.id);
    }, AUTO_EVERY);
    return () => window.clearInterval(id);
  }, [mode]);
  const agentsRef = useRef(agents);
  agentsRef.current = agents;
  const knownAgentRef = useRef(knownAgent);
  knownAgentRef.current = knownAgent;

  /* ----- FLIP for cards and chips, keyed by task id ----- */
  const rootRef = useRef<HTMLDivElement>(null);
  const before = useRef<Map<string, DOMRect> | null>(null);
  const dropFrom = useRef<{ taskId: string; rect: DOMRect } | null>(null);
  if (typeof window !== "undefined" && rootRef.current) {
    const m = new Map<string, DOMRect>();
    rootRef.current.querySelectorAll<HTMLElement>("[data-task]").forEach((el) => m.set(el.dataset.task!, el.getBoundingClientRect()));
    before.current = m;
  }
  useLayoutEffect(() => {
    const prev = before.current;
    before.current = null;
    const drop = dropFrom.current;
    dropFrom.current = null;
    const root = rootRef.current;
    if (!root || reduced || document.hidden) return;
    root.querySelectorAll<HTMLElement>("[data-task]").forEach((el) => {
      const id = el.dataset.task!;
      const from = drop?.taskId === id ? drop.rect : prev?.get(id);
      if (!from || typeof el.animate !== "function") return;
      const to = el.getBoundingClientRect();
      const dx = from.left - to.left;
      const dy = from.top - to.top;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
      const sx = drop?.taskId === id && to.width ? from.width / to.width : 1;
      const sy = drop?.taskId === id && to.height ? from.height / to.height : 1;
      el.animate(
        [
          { transform: \`translate(\${dx}px, \${dy}px) scale(\${sx}, \${sy})\`, transformOrigin: "0 0" },
          { transform: "translate(0, 0) scale(1, 1)", transformOrigin: "0 0" },
        ],
        { duration: drop?.taskId === id ? 380 : 320, easing: EASE },
      );
    });
  });

  /* ----- pointer drag ----- */
  const [drag, setDrag] = useState<Drag | null>(null);
  const rowRefs = useRef(new Map<string, HTMLElement>());
  const pileRef = useRef<HTMLElement>(null);
  const hitTest = (x: number, y: number): string | null | undefined => {
    for (const [id, el] of rowRefs.current) {
      const r = el.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return id;
    }
    const p = pileRef.current?.getBoundingClientRect();
    if (p && x >= p.left && x <= p.right && y >= p.top && y <= p.bottom) return null;
    return undefined;
  };
  const onDown = (e: ReactPointerEvent<HTMLElement>, t: DelegateTask) => {
    if (e.button !== 0 || picked) return;
    const r = e.currentTarget.getBoundingClientRect();
    setDrag({
      taskId: t.id,
      from: t.agentId && knownAgent.has(t.agentId) ? t.agentId : null,
      x: e.clientX,
      y: e.clientY,
      dx: e.clientX - r.left,
      dy: e.clientY - r.top,
      w: r.width,
      h: r.height,
      over: undefined,
      started: false,
      pointerId: e.pointerId,
      sx: e.clientX,
      sy: e.clientY,
    });
  };
  const dragRef = useRef(drag);
  dragRef.current = drag;
  useEffect(() => {
    if (!drag) return;
    const move = (e: PointerEvent) => {
      const d = dragRef.current;
      if (!d || e.pointerId !== d.pointerId) return;
      const started = d.started || Math.hypot(e.clientX - d.sx, e.clientY - d.sy) > DRAG_START;
      if (started) e.preventDefault();
      setDrag({ ...d, x: e.clientX, y: e.clientY, started, over: started ? hitTest(e.clientX, e.clientY) : undefined });
    };
    const up = (e: PointerEvent) => {
      const d = dragRef.current;
      if (!d || e.pointerId !== d.pointerId) return;
      setDrag(null);
      if (!d.started) return;
      // The card glides from where it was let go – into its new queue, or back home
      dropFrom.current = { taskId: d.taskId, rect: new DOMRect(d.x - d.dx, d.y - d.dy, d.w, d.h) };
      if (d.over !== undefined && d.over !== d.from) assignRef.current(d.taskId, d.over);
    };
    const cancel = () => setDrag(null);
    window.addEventListener("pointermove", move, { passive: false });
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", cancel);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", cancel);
    };
  }, [drag?.taskId]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ----- keyboard pick-up ----- */
  const [picked, setPicked] = useState<{ taskId: string; index: number } | null>(null);
  const taskRefs = useRef(new Map<string, HTMLElement>());
  const refocus = useRef<string | null>(null);
  useEffect(() => {
    if (refocus.current) {
      taskRefs.current.get(refocus.current)?.focus();
      refocus.current = null;
    }
  });
  const onTaskKey = (e: ReactKeyboardEvent<HTMLElement>, t: DelegateTask) => {
    if (picked && picked.taskId === t.id) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const n = agents.length;
        const index = (picked.index + (e.key === "ArrowDown" ? 1 : -1) + n) % n;
        setPicked({ ...picked, index });
        setMessage(\`\${agents[index].name}, busy until \${preview(t, agents[index]).until}\`);
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const agent = agents[picked.index];
        setPicked(null);
        if (agent && agent.id !== t.agentId) assign(t.id, agent.id);
        refocus.current = t.id;
      } else if (e.key === "Escape") {
        e.preventDefault();
        setPicked(null);
        setMessage(\`\${t.title} put back\`);
      }
      return;
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!agents.length) return;
      const start = Math.max(0, agents.findIndex((a) => a.id === t.agentId));
      setPicked({ taskId: t.id, index: start });
      setMessage(\`Picked up \${t.title}. Choose an agent with the arrow keys, Enter to hand it over, Escape to put it back.\`);
    } else if (/^[1-9]$/.test(e.key)) {
      const agent = agents[Number(e.key) - 1];
      if (agent && agent.id !== t.agentId) {
        e.preventDefault();
        assign(t.id, agent.id);
        refocus.current = t.id;
      }
    }
  };

  /* Preview of a hand-off */
  const preview = (t: DelegateTask, a: DelegateAgent) => {
    const q = queueOf(a.id).filter((x) => x.id !== t.id);
    const base = q.length ? (a.current ?? q[0].estimate) + q.slice(1).reduce((s, x) => s + x.estimate, 0) : 0;
    return {
      add: t.estimate,
      until: clockTime(now + (base + t.estimate) * MIN),
      cost: a.rate != null ? a.rate * t.estimate : null,
    };
  };
  const draggedTask = drag?.started ? list.find((t) => t.id === drag.taskId) : undefined;
  const pickedTask = picked ? list.find((t) => t.id === picked.taskId) : undefined;
  const hover = (() => {
    if (draggedTask && drag?.over) return { task: draggedTask, agentId: drag.over };
    if (pickedTask && picked) return { task: pickedTask, agentId: agents[picked.index]?.id };
    if (suggestion) {
      const t = list.find((x) => x.id === suggestion.taskId);
      if (t) return { task: t, agentId: suggestion.agentId };
    }
    return null;
  })();

  const rootRect = rootRef.current?.getBoundingClientRect();
  const hintId = \`\${uid}-hint\`;
  const showNumbers = !!picked || agents.length <= 9;

  const renderChip = (t: DelegateTask, running: boolean) => (
    <li
      key={t.id}
      data-task={t.id}
      className="ui-at-dlg__chip"
      data-running={running || undefined}
      data-lifted={drag?.started && drag.taskId === t.id ? "" : undefined}
    >
      <button
        type="button"
        className="ui-at-dlg__chip-btn"
        ref={(el) => {
          if (el) taskRefs.current.set(t.id, el);
          else taskRefs.current.delete(t.id);
        }}
        aria-describedby={hintId}
        aria-pressed={picked?.taskId === t.id ? true : undefined}
        onPointerDown={(e) => onDown(e, t)}
        onKeyDown={(e) => onTaskKey(e, t)}
      >
        {running ? <Spinner /> : null}
        {t.tools?.length ? (
          <span className="ui-at-dlg__tools" aria-hidden="true">
            {t.tools.slice(0, 3).map((tool, i) => (
              <span key={i} className="ui-at-dlg__tool">
                {tool}
              </span>
            ))}
          </span>
        ) : null}
        <span className="ui-at-dlg__chip-title">{t.title}</span>
        <span className="ui-at-dlg__sr">, ~{t.estimate} min{running ? ", running" : ", queued"}</span>
      </button>
    </li>
  );

  return (
    <div
      ref={rootRef}
      className={["ui-at-dlg", className].filter(Boolean).join(" ")}
      data-dragging={drag?.started || undefined}
    >
      <style href="ui-delegate-board" precedence="default">
        {css}
      </style>
      <div className="ui-at-dlg__bar">
        <span className="ui-at-dlg__mark">
          <Sparkle />
        </span>
        <h3 className="ui-at-dlg__title">{title}</h3>
        <span className="ui-at-dlg__sub">{mode === "auto" ? "New tasks go to whoever is free first" : "Drag a task onto an agent"}</span>
        <label className="ui-at-dlg__auto">
          <span id={\`\${uid}-auto\`}>Auto</span>
          <button
            type="button"
            role="switch"
            aria-checked={mode === "auto"}
            aria-labelledby={\`\${uid}-auto\`}
            className="ui-at-dlg__switch"
            onClick={() => setMode(mode === "auto" ? "manual" : "auto")}
          >
            <span className="ui-at-dlg__knob" />
          </button>
        </label>
      </div>

      <div className="ui-at-dlg__panel">
        <section
          ref={pileRef}
          className="ui-at-dlg__pile"
          aria-labelledby={\`\${uid}-pile\`}
          data-over={drag?.started && drag.over === null ? "" : undefined}
        >
          <h4 className="ui-at-dlg__label" id={\`\${uid}-pile\`}>
            Unassigned <span className="ui-at-dlg__count">{pile.length}</span>
          </h4>
          {pile.length ? (
            <ul className="ui-at-dlg__tasks">
              {pile.map((t) => (
                <li
                  key={t.id}
                  data-task={t.id}
                  className="ui-at-dlg__task"
                  data-lifted={drag?.started && drag.taskId === t.id ? "" : undefined}
                  data-suggested={suggestion?.taskId === t.id || undefined}
                  data-picked={picked?.taskId === t.id || undefined}
                >
                  <button
                    type="button"
                    className="ui-at-dlg__task-btn"
                    ref={(el) => {
                      if (el) taskRefs.current.set(t.id, el);
                      else taskRefs.current.delete(t.id);
                    }}
                    aria-describedby={hintId}
                    aria-pressed={picked?.taskId === t.id ? true : undefined}
                    onPointerDown={(e) => onDown(e, t)}
                    onKeyDown={(e) => onTaskKey(e, t)}
                  >
                    <span className="ui-at-dlg__grip" aria-hidden="true">
                      <Grip />
                    </span>
                    <span className="ui-at-dlg__task-title">{t.title}</span>
                    <span className="ui-at-dlg__task-meta">
                      {t.tools?.length ? (
                        <span className="ui-at-dlg__tools" aria-hidden="true">
                          {t.tools.slice(0, 3).map((tool, i) => (
                            <span key={i} className="ui-at-dlg__tool">
                              {tool}
                            </span>
                          ))}
                        </span>
                      ) : null}
                      ~{t.estimate} min
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="ui-at-dlg__empty">Everything is handed out</p>
          )}
        </section>

        <section className="ui-at-dlg__agents" aria-labelledby={\`\${uid}-agents\`}>
          <div className="ui-at-dlg__agents-head">
            <h4 className="ui-at-dlg__label" id={\`\${uid}-agents\`}>
              Agents
            </h4>
            {anyRate ? <span className="ui-at-dlg__total">{formatCost(inQueues)} in queues</span> : null}
          </div>
          <ul className="ui-at-dlg__rows">
            {agents.map((a, i) => {
              const q = queueOf(a.id);
              const minutes = load.get(a.id) ?? 0;
              const target = hover && hover.agentId === a.id && hover.task.agentId !== a.id ? preview(hover.task, a) : null;
              const extra = q.length > 3 ? q.slice(3) : [];
              return (
                <li
                  key={a.id}
                  ref={(el) => {
                    if (el) rowRefs.current.set(a.id, el);
                    else rowRefs.current.delete(a.id);
                  }}
                  className="ui-at-dlg__row"
                  data-target={target ? "" : undefined}
                >
                  <span className="ui-at-dlg__avatar" aria-hidden="true">
                    {a.avatar ?? <span className="ui-at-dlg__initials">{initials(a.name)}</span>}
                  </span>
                  <div className="ui-at-dlg__who">
                    <div className="ui-at-dlg__who-top">
                      <span className="ui-at-dlg__name">
                        {showNumbers && i < 9 ? (
                          <kbd className="ui-at-dlg__num" data-show={picked ? "" : undefined} aria-hidden="true">
                            {i + 1}
                          </kbd>
                        ) : null}
                        {a.name}
                      </span>
                      <span className="ui-at-dlg__state">
                        {target ? (
                          <>
                            {target.cost != null ? <span className="ui-at-dlg__plus">+{formatCost(target.cost)}</span> : null}
                            <span className="ui-at-dlg__busy" data-kind="preview">
                              +{target.add}m until {target.until}
                            </span>
                          </>
                        ) : minutes ? (
                          <span className="ui-at-dlg__busy">Busy until {clockTime(now + minutes * MIN)}</span>
                        ) : (
                          <span className="ui-at-dlg__busy" data-kind="free">
                            Free
                          </span>
                        )}
                      </span>
                    </div>
                    <p className="ui-at-dlg__model">
                      {a.model}
                      {a.rate != null ? <span className="ui-at-dlg__rate">{formatCost(a.rate)}/min</span> : null}
                    </p>
                    {q.length ? (
                      <ul className="ui-at-dlg__queue" aria-label={\`Queue of \${a.name}\`}>
                        {q.slice(0, 3).map((t, k) => renderChip(t, k === 0))}
                        {extra.length ? (
                          <li className="ui-at-dlg__more">
                            <button
                              type="button"
                              className="ui-at-dlg__more-btn"
                              aria-label={\`\${extra.length} more: \${extra.map((t) => t.title).join(", ")}\`}
                              aria-describedby={\`\${uid}-\${a.id}-more\`}
                            >
                              +{extra.length}
                            </button>
                            <span role="tooltip" id={\`\${uid}-\${a.id}-more\`} className="ui-at-dlg__tip">
                              {extra.map((t) => (
                                <span key={t.id}>
                                  {t.title} · ~{t.estimate} min
                                </span>
                              ))}
                            </span>
                          </li>
                        ) : null}
                      </ul>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      {draggedTask && drag && rootRect ? (
        <div
          className="ui-at-dlg__ghost"
          aria-hidden="true"
          style={{
            width: drag.w,
            left: drag.x - drag.dx - rootRect.left,
            top: drag.y - drag.dy - rootRect.top,
          }}
        >
          <span className="ui-at-dlg__task-title">{draggedTask.title}</span>
          <span className="ui-at-dlg__task-meta">~{draggedTask.estimate} min</span>
        </div>
      ) : null}

      <p id={hintId} className="ui-at-dlg__sr">
        Drag onto an agent, or press Enter, choose with the arrow keys and press Enter again. Number keys hand it over at once.
      </p>
      <p className="ui-at-dlg__sr" role="status" aria-live="polite">
        {message}
      </p>
    </div>
  );
}

/* ---------- styles ---------- */

const css = /* css */ \`
.ui-at-dlg {
  --frame: #f2f6fa; --panel: #ffffff; --soft: rgba(26, 62, 112, 0.06); --tray: #f2f6fa;
  --line: #dae2ec; --line-firm: #cbd6e4;
  --ink: #00162b; --text: rgba(0, 22, 43, 0.66); --muted: rgba(0, 22, 43, 0.54);
  --berry: #851437; --berry-hover: #6d0f2d;
  --info-ink: #1a3e70; --info-fill: #eef5ff; --info-line: #c1daff; --ring: #8fbdf2; --mark: #2f6fc4;
  --ok-ink: #1d6a34; --ok-fill: #eafbee; --ok-line: #c9f5cf;
  --tile: #ffffff; --secondary: #fbfcfe; --switch-off: #cbd6e4;
  --tip-bg: #00162b; --tip-ink: rgba(255, 255, 255, 0.92);
  --pebble-shade: inset 0 -2px 6px -4px rgba(26, 62, 112, 0.4);
  --drop: 0 8px 16px -8px rgba(26, 62, 112, 0.2);
  --raised: 0 18px 30px -16px rgba(26, 62, 112, 0.38), 0 4px 10px -6px rgba(26, 62, 112, 0.18);
  --float: 0 24px 48px -24px rgba(26, 62, 112, 0.3);
  --ease: cubic-bezier(.16, 1, .3, 1);
  box-sizing: border-box;
  position: relative;
  width: 100%;
  max-width: 720px;
  padding: 6px;
  border-radius: 22px;
  background: var(--frame);
  border: 1px solid var(--line);
  box-shadow: var(--float);
  font-family: "Avenir Next", Avenir, system-ui, sans-serif;
  color: var(--text);
  font-size: 14px;
  line-height: 1.4;
  text-align: left;
  container-type: inline-size;
}
:where(.dark, [data-theme="dark"]) .ui-at-dlg {
  --frame: #0f2747; --panel: #16345c; --soft: rgba(255, 255, 255, 0.07); --tray: rgba(3, 12, 28, 0.22);
  --line: rgba(255, 255, 255, 0.12); --line-firm: rgba(255, 255, 255, 0.18);
  --ink: rgba(255, 255, 255, 0.94); --text: rgba(255, 255, 255, 0.72); --muted: rgba(255, 255, 255, 0.56);
  --berry: #a8204d; --berry-hover: #bd2a5a;
  --info-ink: #c1daff; --info-fill: rgba(143, 189, 242, 0.16); --info-line: rgba(143, 189, 242, 0.34); --ring: rgba(143, 189, 242, 0.6); --mark: #8fbdf2;
  --ok-ink: #7fe0a0; --ok-fill: rgba(127, 224, 160, 0.14); --ok-line: rgba(127, 224, 160, 0.3);
  --tile: #ffffff; --secondary: rgba(255, 255, 255, 0.06); --switch-off: rgba(255, 255, 255, 0.2);
  --tip-bg: #071a33; --tip-ink: rgba(255, 255, 255, 0.92);
  --pebble-shade: inset 0 -2px 6px -4px rgba(3, 12, 28, 0.8);
  --drop: 0 8px 16px -8px rgba(3, 12, 28, 0.6);
  --raised: 0 18px 30px -16px rgba(3, 12, 28, 0.8), 0 4px 10px -6px rgba(3, 12, 28, 0.6);
  --float: 0 24px 48px -24px rgba(3, 12, 28, 0.7);
}
.ui-at-dlg *, .ui-at-dlg *::before, .ui-at-dlg *::after { box-sizing: border-box; }
.ui-at-dlg :where(button) { font: inherit; color: inherit; cursor: pointer; }
.ui-at-dlg :focus-visible { outline: none; box-shadow: 0 0 0 3px var(--ring); }
.ui-at-dlg__sr {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0;
}
.ui-at-dlg[data-dragging] { cursor: grabbing; user-select: none; -webkit-user-select: none; }

.ui-at-dlg__bar { display: flex; align-items: center; gap: 8px; padding: 10px 12px 12px 14px; min-height: 48px; }
.ui-at-dlg__mark { display: inline-flex; color: var(--mark); }
.ui-at-dlg__title {
  margin: 0; color: var(--ink); font-size: 16px; font-weight: 700; letter-spacing: 0;
  font-family: "Avenir Next Condensed", "Avenir Next", Avenir, system-ui, sans-serif;
}
.ui-at-dlg__sub { min-width: 0; flex: 1; font-size: 13px; color: var(--muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ui-at-dlg__auto { display: inline-flex; align-items: center; gap: 8px; font-size: 13.5px; color: var(--text); cursor: pointer; }
.ui-at-dlg__switch {
  position: relative; width: 34px; height: 20px; padding: 0; border-radius: 999px; border: 1px solid var(--line-firm);
  background: var(--switch-off); transition: background-color 150ms var(--ease), border-color 150ms var(--ease);
}
.ui-at-dlg__switch[aria-checked="true"] { background: var(--berry); border-color: var(--berry); }
.ui-at-dlg__knob {
  position: absolute; top: 1px; left: 1px; width: 16px; height: 16px; border-radius: 50%; background: #fff;
  box-shadow: 0 1px 3px rgba(0, 22, 43, 0.3); transition: transform 150ms var(--ease);
}
.ui-at-dlg__switch[aria-checked="true"] .ui-at-dlg__knob { transform: translateX(14px); }

.ui-at-dlg__panel {
  display: grid; grid-template-columns: minmax(0, 0.42fr) minmax(0, 0.58fr); gap: 12px; padding: 10px;
  background: var(--panel); border: 1px solid var(--line); border-radius: 16px; box-shadow: var(--raised);
}
.ui-at-dlg__pile {
  padding: 10px 6px 6px; border-radius: 12px; background: var(--tray); border: 1px solid var(--line);
  transition: background-color 150ms var(--ease), border-color 150ms var(--ease); min-height: 120px;
}
.ui-at-dlg__pile[data-over] { background: var(--info-fill); border-color: var(--info-line); }
.ui-at-dlg__label { margin: 0 0 8px 6px; display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 500; color: var(--muted); }
.ui-at-dlg__count {
  min-width: 18px; height: 18px; padding: 0 5px; display: inline-grid; place-items: center; border-radius: 6px;
  background: var(--panel); border: 1px solid var(--line); box-shadow: var(--pebble-shade);
  font-size: 11px; font-weight: 600; color: var(--text); font-variant-numeric: tabular-nums;
}
.ui-at-dlg__tasks { list-style: none; margin: 0; padding: 0; display: grid; gap: 6px; }
.ui-at-dlg__task { border-radius: 12px; }
.ui-at-dlg__task-btn {
  position: relative; width: 100%; display: grid; grid-template-columns: auto minmax(0, 1fr); column-gap: 8px; row-gap: 2px;
  padding: 9px 12px 9px 8px; border-radius: 12px; text-align: left; touch-action: none;
  background: var(--panel); border: 1px solid var(--line); box-shadow: var(--drop); cursor: grab;
  transition: border-color 150ms var(--ease), background-color 150ms var(--ease), opacity 150ms var(--ease);
}
.ui-at-dlg__task-btn:hover { border-color: var(--line-firm); }
.ui-at-dlg__task[data-suggested] .ui-at-dlg__task-btn, .ui-at-dlg__task[data-picked] .ui-at-dlg__task-btn {
  background: var(--info-fill); border-color: var(--info-line);
}
.ui-at-dlg__task[data-lifted] .ui-at-dlg__task-btn, .ui-at-dlg__chip[data-lifted] .ui-at-dlg__chip-btn { opacity: .35; }
.ui-at-dlg__grip { grid-row: 1 / 3; align-self: center; display: inline-flex; color: var(--muted); }
.ui-at-dlg__task-title { color: var(--ink); font-weight: 500; font-size: 14px; overflow-wrap: anywhere; }
.ui-at-dlg__task-meta { display: inline-flex; align-items: center; gap: 6px; font-size: 12.5px; color: var(--muted); font-variant-numeric: tabular-nums; }
.ui-at-dlg__empty {
  margin: 0; padding: 18px 10px; border-radius: 10px; border: 1px dashed var(--line-firm);
  text-align: center; font-size: 13px; color: var(--muted);
}

.ui-at-dlg__agents { min-width: 0; padding-top: 10px; }
.ui-at-dlg__agents-head { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; padding-right: 6px; }
.ui-at-dlg__total { font-size: 12.5px; color: var(--muted); font-variant-numeric: tabular-nums; }
.ui-at-dlg__rows { list-style: none; margin: 0; padding: 0; display: grid; gap: 2px; }
.ui-at-dlg__row {
  display: flex; gap: 10px; padding: 10px; border-radius: 12px; border: 1px solid transparent;
  transition: background-color 150ms var(--ease), border-color 150ms var(--ease);
}
.ui-at-dlg__row[data-target] { background: var(--info-fill); border-color: var(--info-line); }
.ui-at-dlg__avatar {
  flex: none; width: 32px; height: 32px; display: grid; place-items: center; border-radius: 50%; overflow: hidden;
  background: var(--tile); border: 1px solid var(--line); box-shadow: var(--pebble-shade);
}
.ui-at-dlg__avatar > svg, .ui-at-dlg__avatar > img { width: 16px; height: 16px; }
.ui-at-dlg__initials { font-size: 11px; font-weight: 700; color: #1a3e70; }
.ui-at-dlg__who { min-width: 0; flex: 1; }
.ui-at-dlg__who-top { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 4px 8px; min-height: 24px; }
.ui-at-dlg__name { display: inline-flex; align-items: center; gap: 6px; min-width: 0; color: var(--ink); font-weight: 600; font-size: 14px; }
.ui-at-dlg__num {
  display: none; min-width: 18px; height: 18px; padding: 0 4px; place-items: center; border-radius: 5px;
  background: var(--panel); border: 1px solid var(--line); border-bottom: 2px solid var(--line-firm);
  font: 600 10.5px/1 "Avenir Next", Avenir, system-ui, sans-serif; color: var(--muted);
}
.ui-at-dlg__num[data-show], .ui-at-dlg:has(.ui-at-dlg__task-btn:focus-visible, .ui-at-dlg__chip-btn:focus-visible) .ui-at-dlg__num { display: inline-grid; }
.ui-at-dlg__state { display: inline-flex; flex-wrap: wrap; align-items: center; gap: 4px 8px; margin-left: auto; }
.ui-at-dlg__plus { font-size: 12.5px; font-weight: 600; color: var(--info-ink); font-variant-numeric: tabular-nums; }
.ui-at-dlg__busy {
  height: 22px; display: inline-flex; align-items: center; padding: 0 8px; border-radius: 999px;
  background: var(--soft); border: 1px solid var(--line); font-size: 12px; font-weight: 500; color: var(--text);
  font-variant-numeric: tabular-nums; white-space: nowrap;
}
.ui-at-dlg__busy[data-kind="free"] { background: var(--ok-fill); border-color: var(--ok-line); color: var(--ok-ink); font-weight: 600; }
.ui-at-dlg__busy[data-kind="preview"] { background: var(--panel); border-color: var(--info-line); color: var(--info-ink); font-weight: 600; }
.ui-at-dlg__model { margin: 0; display: flex; flex-wrap: wrap; gap: 0 8px; font-size: 12.5px; color: var(--muted); }
.ui-at-dlg__rate { opacity: .85; font-variant-numeric: tabular-nums; }
.ui-at-dlg__queue { list-style: none; margin: 8px 0 0; padding: 0; display: flex; flex-wrap: wrap; gap: 6px; }
.ui-at-dlg__chip { min-width: 0; max-width: 100%; }
.ui-at-dlg__chip-btn {
  max-width: 100%; display: inline-flex; align-items: center; gap: 6px; height: 28px; padding: 0 10px; border-radius: 999px;
  background: var(--panel); border: 1px solid var(--line-firm); color: var(--text); font-size: 13px; touch-action: none; cursor: grab;
  transition: opacity 150ms var(--ease);
}
.ui-at-dlg__chip[data-running] .ui-at-dlg__chip-btn { background: var(--info-fill); border-color: var(--info-line); color: var(--info-ink); }
.ui-at-dlg__chip-title { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ui-at-dlg__spin { flex: none; animation: ui-at-dlg-spin 900ms linear infinite; }
@keyframes ui-at-dlg-spin { to { transform: rotate(360deg); } }
.ui-at-dlg__tools { display: inline-flex; flex: none; }
.ui-at-dlg__tool {
  width: 16px; height: 16px; display: inline-grid; place-items: center; border-radius: 4px;
  background: var(--tile); border: 1px solid var(--line);
}
.ui-at-dlg__tool + .ui-at-dlg__tool { margin-left: -3px; }
.ui-at-dlg__tool > svg, .ui-at-dlg__tool > img { width: 11px; height: 11px; }
.ui-at-dlg__more { position: relative; }
.ui-at-dlg__more-btn {
  height: 28px; min-width: 34px; padding: 0 8px; border-radius: 999px; border: 1px solid var(--line-firm);
  background: var(--soft); font-size: 12.5px; font-weight: 600; color: var(--text);
}
.ui-at-dlg__tip {
  position: absolute; z-index: 4; bottom: calc(100% + 6px); right: 0; width: max-content; max-width: 240px;
  display: none; flex-direction: column; gap: 2px; padding: 8px 10px; border-radius: 10px;
  background: var(--tip-bg); color: var(--tip-ink); font-size: 12px; box-shadow: var(--raised);
}
.ui-at-dlg__more:hover .ui-at-dlg__tip, .ui-at-dlg__more:focus-within .ui-at-dlg__tip { display: flex; }

.ui-at-dlg__ghost {
  position: absolute; z-index: 10; pointer-events: none; display: grid; gap: 2px; padding: 9px 12px 9px 26px;
  border-radius: 12px; background: var(--panel); border: 1px solid var(--line-firm); box-shadow: var(--raised);
  transform: rotate(-2deg) scale(1.03); transform-origin: 30% 50%;
}

@container (max-width: 560px) {
  .ui-at-dlg__panel { grid-template-columns: minmax(0, 1fr); }
  .ui-at-dlg__row { padding: 10px 6px; gap: 8px; }
  .ui-at-dlg__pile { min-height: 0; }
  .ui-at-dlg__sub { display: none; }
}
@media (pointer: coarse) {
  .ui-at-dlg__task-btn { padding-top: 12px; padding-bottom: 12px; }
  .ui-at-dlg__chip-btn, .ui-at-dlg__more-btn { height: 34px; }
}
@media (prefers-reduced-motion: reduce) {
  .ui-at-dlg *, .ui-at-dlg *::before, .ui-at-dlg *::after { transition-duration: 0ms !important; animation: none !important; }
  .ui-at-dlg__ghost { transform: none; }
}
\`;
`;export{e as default};
