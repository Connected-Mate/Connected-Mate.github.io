var e=`"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";

export type PlanStepStatus = "pending" | "active" | "done" | "failed";

export type PlanStep = {
  id: string;
  title: string;
  detail?: string;
  /** Tool the step calls, e.g. "slack.post" */
  tool?: string;
  status?: PlanStepStatus;
  /** ms – leave out to have it measured from when the step turned active */
  duration?: number;
  error?: string;
};

export type AgentPlanStatus = "draft" | "running" | "done";

export type AgentPlanProps = {
  steps?: PlanStep[];
  defaultSteps?: PlanStep[];
  status?: AgentPlanStatus;
  onChange?: (steps: PlanStep[]) => void;
  onRun?: (steps: PlanStep[]) => void;
  onCancel?: () => void;
  onRetry?: (stepId: string) => void;
  title?: string;
  estimate?: string;
  className?: string;
};

const EASE = "cubic-bezier(.16, 1, .3, 1)";
const STATUS_WORD: Record<PlanStepStatus, string> = {
  pending: "Pending",
  active: "In progress",
  done: "Done",
  failed: "Failed",
};

const secs = (ms: number) => \`\${(Math.max(0, ms) / 1000).toFixed(1)}s\`;
function total(ms: number) {
  const s = Math.max(0, Math.round(ms / 1000));
  return s < 60 ? \`\${s}s\` : \`\${Math.floor(s / 60)}m \${String(s % 60).padStart(2, "0")}s\`;
}

let seq = 0;
const newId = () => \`step-\${Date.now().toString(36)}-\${(seq++).toString(36)}\`;

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
const ListIcon = () => (
  <Svg size={12}>
    <path d="M6 4h7M6 8h7M6 12h7M3 4h.01M3 8h.01M3 12h.01" />
  </Svg>
);
const Grip = () => (
  <svg width="10" height="14" viewBox="0 0 10 14" aria-hidden="true" focusable="false">
    {[3, 7, 11].map((y) => (
      <g key={y} fill="currentColor">
        <circle cx="3" cy={y} r="1.1" />
        <circle cx="7" cy={y} r="1.1" />
      </g>
    ))}
  </svg>
);
const Cross = () => (
  <Svg size={12}>
    <path d="M4 4l8 8M12 4l-8 8" />
  </Svg>
);
const Plus = () => (
  <Svg size={13}>
    <path d="M8 3v10M3 8h10" />
  </Svg>
);
const Rays = ({ size = 14 }: { size?: number }) => (
  <svg className="ui-at-plan__rays" width={size} height={size} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
    {Array.from({ length: 8 }, (_, i) => (
      <line
        key={i}
        x1="8"
        y1="1.8"
        x2="8"
        y2="4.6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        opacity={0.25 + (i / 8) * 0.75}
        transform={\`rotate(\${i * 45} 8 8)\`}
      />
    ))}
  </svg>
);
const Check = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
    <path className="ui-at-plan__check" d="M3.5 8.4l3 3 6-6.6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const Bang = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
    <path d="M8 4v5M8 11.6v.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const Retry = () => (
  <Svg size={12}>
    <path d="M3 8a5 5 0 1 0 1.6-3.7M3 3v2.8h2.8" />
  </Svg>
);

/* ---------- component ---------- */

type Drag = { id: string; from: number; to: number; dy: number; startY: number; height: number; pointer: number };

export function AgentPlan({
  steps: stepsProp,
  defaultSteps = [],
  status = "draft",
  onChange,
  onRun,
  onCancel,
  onRetry,
  title,
  estimate,
  className,
}: AgentPlanProps) {
  const uid = useId();
  const reduced = useReducedMotion();
  const [inner, setInner] = useState<PlanStep[]>(defaultSteps);
  const steps = stepsProp ?? inner;
  const draft = status === "draft";

  const commit = (next: PlanStep[]) => {
    if (stepsProp === undefined) setInner(next);
    onChange?.(next);
  };

  const [message, setMessage] = useState("");
  const say = (text: string) => setMessage(text);

  /* ----- timing: when each step turned active, when it finished, when the run started ----- */
  const activeSince = useRef(new Map<string, number>());
  const measured = useRef(new Map<string, number>());
  const runStart = useRef<number | null>(null);
  const runEnd = useRef<number | null>(null);
  const prevStatus = useRef(new Map<string, PlanStepStatus>());

  const now0 = Date.now();
  // Bookkeeping kept in render so the very first paint of a new state already has its numbers
  if (status === "running" && runStart.current === null) runStart.current = now0;
  if (status === "running") runEnd.current = null;
  if (status === "done" && runStart.current !== null && runEnd.current === null) runEnd.current = now0;
  if (status === "draft") {
    runStart.current = null;
    runEnd.current = null;
  }
  for (const s of steps) {
    const st = s.status ?? "pending";
    const was = prevStatus.current.get(s.id);
    if (st === "active" && was !== "active") {
      activeSince.current.set(s.id, now0);
      measured.current.delete(s.id);
    }
    if ((st === "done" || st === "failed") && was === "active") {
      const since = activeSince.current.get(s.id);
      if (since != null) measured.current.set(s.id, now0 - since);
    }
    if (st === "pending") {
      activeSince.current.delete(s.id);
      measured.current.delete(s.id);
    }
  }
  useLayoutEffect(() => {
    prevStatus.current = new Map(steps.map((s) => [s.id, s.status ?? "pending"]));
  });

  const live = status === "running";
  const [, setTick] = useState(0);
  useEffect(() => {
    if (!live) return;
    const id = window.setInterval(() => setTick((n) => n + 1), 100);
    return () => window.clearInterval(id);
  }, [live]);

  const stepTime = (s: PlanStep): string | null => {
    const st = s.status ?? "pending";
    if (st === "active") {
      const since = activeSince.current.get(s.id);
      return since != null ? secs(Date.now() - since) : null;
    }
    if (st === "done" || st === "failed") {
      const ms = s.duration ?? measured.current.get(s.id);
      return ms != null ? secs(ms) : null;
    }
    return null;
  };

  const activeIndex = steps.findIndex((s) => s.status === "active");
  const failedIndex = steps.findIndex((s) => s.status === "failed");
  const doneCount = steps.filter((s) => s.status === "done").length;

  /* ----- announcements while running ----- */
  const announced = useRef(new Map<string, PlanStepStatus>());
  useEffect(() => {
    if (status === "draft") {
      announced.current.clear();
      return;
    }
    steps.forEach((s, i) => {
      const st = s.status ?? "pending";
      if (announced.current.get(s.id) === st) return;
      announced.current.set(s.id, st);
      if (st === "done") say(\`Step \${i + 1} done: \${s.title}\`);
      if (st === "failed") say(\`Step \${i + 1} failed: \${s.title}\${s.error ? \` – \${s.error}\` : ""}\`);
    });
    if (status === "done" && runStart.current != null && runEnd.current != null) {
      say(\`Plan done in \${total(runEnd.current - runStart.current)}\`);
    }
  }, [steps, status]);
  useEffect(() => {
    if (status === "running") say("Running plan");
  }, [status]);

  /* ----- FLIP: positions read before commit, compared after ----- */
  const itemEls = useRef(new Map<string, HTMLLIElement>());
  const before = useRef<Map<string, number> | null>(null);
  if (typeof window !== "undefined" && itemEls.current.size) {
    const map = new Map<string, number>();
    itemEls.current.forEach((el, id) => map.set(id, el.getBoundingClientRect().top));
    before.current = map;
  }
  useLayoutEffect(() => {
    const prev = before.current;
    before.current = null;
    if (!prev || reduced || document.hidden) return;
    itemEls.current.forEach((el, id) => {
      const from = prev.get(id);
      if (from == null || typeof el.animate !== "function" || el.dataset.dragging) return;
      const dy = from - el.getBoundingClientRect().top;
      if (Math.abs(dy) < 1) return;
      el.animate([{ transform: \`translateY(\${dy}px)\` }, { transform: "translateY(0)" }], { duration: 300, easing: EASE });
    });
  });

  /* Steps that appear after mount fade up; the first set does not */
  const known = useRef<Set<string> | null>(null);
  if (known.current === null) known.current = new Set(steps.map((s) => s.id));
  const fresh = steps.filter((s) => !known.current!.has(s.id)).map((s) => s.id);
  useEffect(() => {
    fresh.forEach((id) => known.current!.add(id));
  });

  /* ----- editing ----- */
  const [renaming, setRenaming] = useState<{ id: string; text: string } | null>(null);
  const [leaving, setLeaving] = useState<Set<string>>(new Set());
  const [focusId, setFocusId] = useState<string | null>(null);
  const [addText, setAddText] = useState("");
  const listRef = useRef<HTMLOListElement>(null);
  const renameRef = useRef<HTMLInputElement>(null);
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  useEffect(() => {
    if (focusId) {
      itemEls.current.get(focusId)?.focus();
      setFocusId(null);
    }
  }, [focusId]);
  useEffect(() => {
    if (renaming) renameRef.current?.select();
  }, [renaming?.id]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!draft) setRenaming(null);
  }, [draft]);

  const move = (id: string, to: number) => {
    const from = steps.findIndex((s) => s.id === id);
    if (from < 0 || to < 0 || to >= steps.length || to === from) return;
    const next = steps.slice();
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    commit(next);
    say(\`Moved '\${item.title}' to position \${to + 1} of \${steps.length}\`);
  };

  const remove = (id: string) => {
    const idx = steps.findIndex((s) => s.id === id);
    const item = steps[idx];
    if (!item || leaving.has(id)) return;
    const neighbour = steps[idx + 1] ?? steps[idx - 1];
    const finish = () => {
      setLeaving((l) => {
        const n = new Set(l);
        n.delete(id);
        return n;
      });
      commit(steps.filter((s) => s.id !== id));
      say(\`Removed '\${item.title}'. \${steps.length - 1} steps left\`);
      if (neighbour) setFocusId(neighbour.id);
    };
    const el = itemEls.current.get(id);
    if (reduced || !el || typeof el.animate !== "function") return finish();
    setLeaving((l) => new Set(l).add(id));
    const h = el.offsetHeight;
    el.animate(
      [
        { height: \`\${h}px\`, opacity: 1 },
        { height: "0px", opacity: 0, paddingTop: "0px", paddingBottom: "0px", marginBottom: "-2px" },
      ],
      { duration: 220, easing: EASE, fill: "forwards" },
    );
    timers.current.push(window.setTimeout(finish, 220));
  };

  const saveRename = () => {
    if (!renaming) return;
    const text = renaming.text.trim();
    const item = steps.find((s) => s.id === renaming.id);
    setRenaming(null);
    if (item && text && text !== item.title) {
      commit(steps.map((s) => (s.id === item.id ? { ...s, title: text } : s)));
      say(\`Renamed to '\${text}'\`);
    }
    if (item) setFocusId(item.id);
  };

  const add = () => {
    const text = addText.trim();
    if (!text) return;
    commit([...steps, { id: newId(), title: text, status: "pending" }]);
    setAddText("");
    say(\`Added '\${text}' as step \${steps.length + 1}\`);
  };

  const onItemKey = (e: ReactKeyboardEvent<HTMLLIElement>, s: PlanStep, i: number) => {
    if (e.target !== e.currentTarget) return;
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      const to = e.key === "ArrowUp" ? i - 1 : i + 1;
      if (draft && e.altKey) {
        move(s.id, to);
        setFocusId(s.id);
      } else if (steps[to]) itemEls.current.get(steps[to].id)?.focus();
      return;
    }
    if (!draft) return;
    if (e.key === "Enter") {
      e.preventDefault();
      setRenaming({ id: s.id, text: s.title });
    } else if (e.key === "Delete" || e.key === "Backspace") {
      e.preventDefault();
      remove(s.id);
    }
  };

  /* ----- pointer drag ----- */
  const [drag, setDrag] = useState<Drag | null>(null);
  const onGripDown = (e: ReactPointerEvent<HTMLSpanElement>, s: PlanStep, i: number) => {
    if (!draft || e.button !== 0) return;
    const li = itemEls.current.get(s.id);
    if (!li) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    const gap = 2;
    setDrag({ id: s.id, from: i, to: i, dy: 0, startY: e.clientY, height: li.offsetHeight + gap, pointer: e.pointerId });
  };
  const onGripMove = (e: ReactPointerEvent<HTMLSpanElement>) => {
    if (!drag || e.pointerId !== drag.pointer) return;
    const dy = e.clientY - drag.startY;
    // Find the slot whose middle the dragged step's middle passed
    const others = steps.filter((s) => s.id !== drag.id);
    const draggedEl = itemEls.current.get(drag.id);
    if (!draggedEl) return;
    const rect = draggedEl.getBoundingClientRect();
    const mid = rect.top - (drag.dy - dy) + rect.height / 2;
    let to = 0;
    others.forEach((o) => {
      const el = itemEls.current.get(o.id);
      if (!el) return;
      const r = el.getBoundingClientRect();
      const shift = shiftFor(o.id);
      const oMid = r.top - shift + r.height / 2;
      if (mid > oMid) to++;
    });
    setDrag({ ...drag, dy, to });
  };
  const onGripUp = (e: ReactPointerEvent<HTMLSpanElement>) => {
    if (!drag || e.pointerId !== drag.pointer) return;
    const { id, to, from } = drag;
    setDrag(null);
    if (to !== from) move(id, to);
  };
  const shiftFor = (id: string) => {
    if (!drag || id === drag.id) return 0;
    const i = steps.findIndex((s) => s.id === id);
    if (drag.from < drag.to && i > drag.from && i <= drag.to) return -drag.height;
    if (drag.from > drag.to && i >= drag.to && i < drag.from) return drag.height;
    return 0;
  };

  /* ----- render ----- */
  const runMs =
    runStart.current != null ? (runEnd.current ?? (status === "running" ? Date.now() : runStart.current)) - runStart.current : 0;
  const hintId = \`\${uid}-hint\`;
  const stopped = status === "running" && failedIndex >= 0 && activeIndex < 0;

  let tray: ReactNode;
  if (draft) {
    tray = (
      <>
        <span className="ui-at-plan__hint">Drag to reorder · double-click to rename</span>
        <span className="ui-at-plan__tray-actions">
          {onCancel ? (
            <button type="button" className="ui-at-plan__btn" onClick={onCancel}>
              Cancel
            </button>
          ) : null}
          <button
            type="button"
            className="ui-at-plan__btn ui-at-plan__btn--main"
            disabled={!steps.length}
            onClick={() => onRun?.(steps)}
          >
            Run plan
          </button>
        </span>
      </>
    );
  } else if (status === "running") {
    tray = (
      <>
        <span className="ui-at-plan__state" data-kind={stopped ? "failed" : "running"}>
          {stopped ? (
            <span className="ui-at-plan__state-mark">
              <Bang />
            </span>
          ) : (
            <Rays size={13} />
          )}
          {stopped
            ? \`Stopped at step \${failedIndex + 1} of \${steps.length}\`
            : \`Running · \${Math.min(steps.length, (activeIndex >= 0 ? activeIndex : doneCount) + 1)} of \${steps.length}\`}
        </span>
        <span className="ui-at-plan__elapsed">{total(runMs)}</span>
      </>
    );
  } else {
    tray = (
      <>
        <span className="ui-at-plan__state" data-kind="done">
          <span className="ui-at-plan__state-mark">
            <Check />
          </span>
          Done in {total(runMs)}
        </span>
        {onRun ? (
          <button type="button" className="ui-at-plan__btn" onClick={() => onRun(steps)}>
            Run again
          </button>
        ) : null}
      </>
    );
  }

  return (
    <div className={["ui-at-plan", className].filter(Boolean).join(" ")} data-status={status} data-dragging={drag ? "" : undefined}>
      <style href="ui-agent-plan" precedence="default">
        {css}
      </style>
      <div className="ui-at-plan__panel">
        <div className="ui-at-plan__head">
          <p className="ui-at-plan__eyebrow">
            <ListIcon />
            Plan · {steps.length} {steps.length === 1 ? "step" : "steps"}
          </p>
          {draft && estimate ? (
            <p className="ui-at-plan__estimate">
              <span className="ui-at-plan__sr">Estimated time </span>
              {estimate}
            </p>
          ) : null}
        </div>
        {title ? <h3 className="ui-at-plan__title">{title}</h3> : null}
        <p id={hintId} className="ui-at-plan__sr">
          Press Enter to rename, Alt plus arrow keys to move, Delete to remove.
        </p>

        {steps.length === 0 ? (
          <p className="ui-at-plan__empty">No steps yet{draft ? " – add the first one below." : "."}</p>
        ) : (
          <ol className="ui-at-plan__list" ref={listRef} aria-label={title ?? "Plan"}>
            {steps.map((s, i) => {
              const st = s.status ?? "pending";
              const time = stepTime(s);
              const isDrag = drag?.id === s.id;
              const shift = isDrag ? drag!.dy : shiftFor(s.id);
              const editing = renaming?.id === s.id;
              return (
                <li
                  key={s.id}
                  ref={(el) => {
                    if (el) itemEls.current.set(s.id, el);
                    else itemEls.current.delete(s.id);
                  }}
                  className="ui-at-plan__step"
                  data-status={st}
                  data-new={fresh.includes(s.id) || undefined}
                  data-leaving={leaving.has(s.id) || undefined}
                  data-dragging={isDrag || undefined}
                  data-done-line={st === "done" || undefined}
                  tabIndex={0}
                  aria-current={st === "active" ? "step" : undefined}
                  aria-describedby={draft ? hintId : undefined}
                  style={shift || isDrag ? { transform: \`translateY(\${shift}px)\` } : undefined}
                  onKeyDown={(e) => onItemKey(e, s, i)}
                  onDoubleClick={() => draft && setRenaming({ id: s.id, text: s.title })}
                >
                  {draft ? (
                    <span
                      className="ui-at-plan__grip"
                      aria-hidden="true"
                      onPointerDown={(e) => onGripDown(e, s, i)}
                      onPointerMove={onGripMove}
                      onPointerUp={onGripUp}
                      onPointerCancel={onGripUp}
                    >
                      <Grip />
                    </span>
                  ) : null}
                  <span className="ui-at-plan__rail" aria-hidden="true">
                    <span className="ui-at-plan__marker" data-status={st}>
                      {st === "active" ? <Rays /> : st === "done" ? <Check /> : st === "failed" ? <Bang /> : i + 1}
                    </span>
                    {i < steps.length - 1 ? <span className="ui-at-plan__line" /> : null}
                  </span>
                  <span className="ui-at-plan__body">
                    {editing ? (
                      <input
                        ref={renameRef}
                        className="ui-at-plan__rename"
                        aria-label={\`Rename step \${i + 1}\`}
                        value={renaming!.text}
                        onChange={(e) => setRenaming({ id: s.id, text: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            saveRename();
                          } else if (e.key === "Escape") {
                            e.preventDefault();
                            setRenaming(null);
                            setFocusId(s.id);
                          }
                          e.stopPropagation();
                        }}
                        onBlur={saveRename}
                      />
                    ) : (
                      <span className="ui-at-plan__name">{s.title}</span>
                    )}
                    {s.detail || s.tool ? (
                      <span className="ui-at-plan__detail">
                        {s.detail ? <span>{s.detail}</span> : null}
                        {s.tool ? <code className="ui-at-plan__tool">{s.tool}</code> : null}
                      </span>
                    ) : null}
                    {!draft ? <span className="ui-at-plan__sr">, {STATUS_WORD[st]}</span> : null}
                    {st === "failed" ? (
                      <span className="ui-at-plan__error">
                        {s.error ? <span>{s.error}</span> : null}
                        {onRetry && status === "running" ? (
                          <button type="button" className="ui-at-plan__retry" onClick={() => onRetry(s.id)}>
                            <Retry />
                            Retry from here
                          </button>
                        ) : null}
                      </span>
                    ) : null}
                  </span>
                  {time ? (
                    <span className="ui-at-plan__time">
                      {st === "done" ? <span className="ui-at-plan__sr">took </span> : null}
                      {time}
                    </span>
                  ) : null}
                  {draft ? (
                    <button
                      type="button"
                      className="ui-at-plan__remove"
                      aria-label={\`Remove “\${s.title}”\`}
                      onClick={() => remove(s.id)}
                    >
                      <Cross />
                    </button>
                  ) : null}
                </li>
              );
            })}
          </ol>
        )}

        <div className="ui-at-plan__fold" data-open={draft || undefined} inert={!draft}>
          <div className="ui-at-plan__fold-in">
            <label className="ui-at-plan__add">
              <span className="ui-at-plan__add-mark">
                <Plus />
              </span>
              <input
                className="ui-at-plan__add-input"
                placeholder="Add step"
                aria-label="Add step"
                value={addText}
                onChange={(e) => setAddText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    add();
                  } else if (e.key === "Escape") setAddText("");
                }}
              />
            </label>
          </div>
        </div>
      </div>
      <div className="ui-at-plan__tray">{tray}</div>
      <p className="ui-at-plan__sr" role="status" aria-live="polite">
        {message}
      </p>
    </div>
  );
}

/* ---------- styles ---------- */

const css = /* css */ \`
.ui-at-plan {
  --frame: #f2f6fa; --panel: #ffffff; --soft: rgba(26, 62, 112, 0.06);
  --line: #dae2ec; --line-firm: #cbd6e4;
  --ink: #00162b; --text: rgba(0, 22, 43, 0.66); --muted: rgba(0, 22, 43, 0.54);
  --berry: #851437; --berry-hover: #6d0f2d;
  --info-ink: #1a3e70; --info-fill: #eef5ff; --info-line: #c1daff; --ring: #8fbdf2;
  --ok-ink: #1d6a34; --ok-fill: #eafbee; --ok-line: #c9f5cf;
  --bad-ink: #8a3a22; --bad-fill: #fdeee8; --bad-line: #f5d5c9;
  --chip: #eef3f9; --chip-ink: #1a3e70; --done-fill: #e9eef5;
  --secondary: #fbfcfe;
  --pebble-shade: inset 0 -2px 6px -4px rgba(26, 62, 112, 0.4);
  --field-shade: inset 0 1px 2px rgba(26, 62, 112, 0.08);
  --drop: 0 8px 16px -8px rgba(26, 62, 112, 0.2);
  --raised: 0 18px 30px -16px rgba(26, 62, 112, 0.38), 0 4px 10px -6px rgba(26, 62, 112, 0.18);
  --float: 0 24px 48px -24px rgba(26, 62, 112, 0.3);
  --ease: cubic-bezier(.16, 1, .3, 1);
  box-sizing: border-box;
  width: 100%;
  max-width: 460px;
  padding: 6px;
  border-radius: 22px;
  background: var(--frame);
  border: 1px solid var(--line);
  box-shadow: var(--float);
  font-family: "Avenir Next", Avenir, system-ui, sans-serif;
  color: var(--text);
  font-size: 14px;
  line-height: 1.45;
  text-align: left;
  container-type: inline-size;
}
:where(.dark, [data-theme="dark"]) .ui-at-plan {
  --frame: #0f2747; --panel: #16345c; --soft: rgba(255, 255, 255, 0.07);
  --line: rgba(255, 255, 255, 0.12); --line-firm: rgba(255, 255, 255, 0.18);
  --ink: rgba(255, 255, 255, 0.94); --text: rgba(255, 255, 255, 0.72); --muted: rgba(255, 255, 255, 0.56);
  --berry: #a8204d; --berry-hover: #bd2a5a;
  --info-ink: #c1daff; --info-fill: rgba(143, 189, 242, 0.16); --info-line: rgba(143, 189, 242, 0.34); --ring: rgba(143, 189, 242, 0.6);
  --ok-ink: #7fe0a0; --ok-fill: rgba(127, 224, 160, 0.14); --ok-line: rgba(127, 224, 160, 0.3);
  --bad-ink: #f2a48c; --bad-fill: rgba(242, 164, 140, 0.14); --bad-line: rgba(242, 164, 140, 0.3);
  --chip: rgba(143, 189, 242, 0.12); --chip-ink: #c1daff; --done-fill: rgba(255, 255, 255, 0.1);
  --secondary: rgba(255, 255, 255, 0.06);
  --pebble-shade: inset 0 -2px 6px -4px rgba(3, 12, 28, 0.8);
  --field-shade: inset 0 1px 2px rgba(3, 12, 28, 0.4);
  --drop: 0 8px 16px -8px rgba(3, 12, 28, 0.6);
  --raised: 0 18px 30px -16px rgba(3, 12, 28, 0.8), 0 4px 10px -6px rgba(3, 12, 28, 0.6);
  --float: 0 24px 48px -24px rgba(3, 12, 28, 0.7);
}
.ui-at-plan *, .ui-at-plan *::before, .ui-at-plan *::after { box-sizing: border-box; }
.ui-at-plan :where(button) { font: inherit; color: inherit; cursor: pointer; }
.ui-at-plan :focus-visible { outline: none; box-shadow: 0 0 0 3px var(--ring); }
.ui-at-plan__sr {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0;
}

.ui-at-plan__panel {
  position: relative; background: var(--panel); border: 1px solid var(--line);
  border-radius: 16px; box-shadow: var(--raised); padding: 18px 18px 14px;
}
.ui-at-plan__head { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.ui-at-plan__eyebrow { margin: 0; display: inline-flex; align-items: center; gap: 6px; font-size: 12.5px; color: var(--muted); }
.ui-at-plan__estimate {
  margin: 0; height: 22px; display: inline-flex; align-items: center; padding: 0 8px; border-radius: 7px;
  background: var(--soft); border: 1px solid var(--line); font-size: 12px; font-weight: 600; color: var(--text);
}
.ui-at-plan__title {
  margin: 4px 0 12px; color: var(--ink); font-size: 18px; font-weight: 700; line-height: 1.25; letter-spacing: 0;
  font-family: "Avenir Next Condensed", "Avenir Next", Avenir, system-ui, sans-serif; overflow-wrap: anywhere;
}
.ui-at-plan__empty { margin: 4px 0 8px; color: var(--muted); font-size: 13.5px; }

.ui-at-plan__list { list-style: none; margin: 0 -8px; padding: 0; display: flex; flex-direction: column; gap: 2px; }
.ui-at-plan__step {
  position: relative; display: flex; align-items: flex-start; gap: 10px; padding: 6px 8px 8px 22px;
  border-radius: 12px; outline: none; background: transparent;
  transition: background-color 150ms var(--ease), opacity 220ms var(--ease);
}
.ui-at-plan[data-dragging] .ui-at-plan__step:not([data-dragging]) { transition: transform 220ms var(--ease); }
.ui-at-plan[data-status="draft"] .ui-at-plan__step:hover { background: var(--soft); }
.ui-at-plan__step:focus-visible { box-shadow: 0 0 0 3px var(--ring); }
.ui-at-plan__step[data-dragging] {
  z-index: 3; background: var(--panel); box-shadow: var(--raised); border-radius: 12px; cursor: grabbing;
}
.ui-at-plan__step[data-new] { animation: ui-at-plan-in 300ms var(--ease); }
@keyframes ui-at-plan-in { from { opacity: 0; transform: translateY(8px); } }
.ui-at-plan__step[data-leaving] { overflow: hidden; pointer-events: none; }

.ui-at-plan__grip {
  position: absolute; left: 4px; top: 10px; width: 16px; height: 20px; display: grid; place-items: center;
  color: var(--muted); cursor: grab; opacity: 0; touch-action: none; transition: opacity 150ms var(--ease);
}
.ui-at-plan__step:hover .ui-at-plan__grip, .ui-at-plan__step:focus-visible .ui-at-plan__grip, .ui-at-plan__step[data-dragging] .ui-at-plan__grip { opacity: 1; }

.ui-at-plan__rail { position: relative; flex: none; width: 22px; align-self: stretch; display: flex; flex-direction: column; align-items: center; }
.ui-at-plan__marker {
  position: relative; z-index: 1; width: 22px; height: 22px; margin-top: 1px; border-radius: 50%;
  display: grid; place-items: center; background: var(--panel); border: 1px solid var(--line-firm);
  font-size: 11.5px; font-weight: 600; color: var(--muted); font-variant-numeric: tabular-nums;
  transition: background-color 300ms var(--ease), border-color 300ms var(--ease), color 300ms var(--ease);
}
.ui-at-plan__marker[data-status="active"] { border-color: transparent; background: transparent; color: var(--info-ink); }
.ui-at-plan__marker[data-status="done"] { background: var(--done-fill); border-color: var(--line); color: var(--ink); }
.ui-at-plan__marker[data-status="failed"] { background: var(--bad-fill); border-color: var(--bad-line); color: var(--bad-ink); }
.ui-at-plan__rays { animation: ui-at-plan-spin 1s steps(8) infinite; }
@keyframes ui-at-plan-spin { to { transform: rotate(360deg); } }
.ui-at-plan__check { stroke-dasharray: 16; stroke-dashoffset: 0; animation: ui-at-plan-draw 360ms var(--ease) both; }
@keyframes ui-at-plan-draw { from { stroke-dashoffset: 16; } }
.ui-at-plan__line {
  position: absolute; top: 25px; bottom: -11px; left: 50%; width: 1.5px; margin-left: -0.75px;
  background: var(--line); border-radius: 1px; overflow: hidden;
}
.ui-at-plan__line::after {
  content: ""; position: absolute; inset: 0; background: var(--berry);
  transform: scaleY(0); transform-origin: top; transition: transform 420ms var(--ease);
}
.ui-at-plan__step[data-done-line] .ui-at-plan__line::after { transform: scaleY(1); }
.ui-at-plan[data-status="draft"] .ui-at-plan__line { opacity: .7; }

.ui-at-plan__body { min-width: 0; flex: 1; display: flex; flex-direction: column; gap: 2px; }
.ui-at-plan__name { color: var(--ink); font-size: 15px; line-height: 1.45; overflow-wrap: anywhere; }
.ui-at-plan__step[data-status="pending"] .ui-at-plan__name { color: var(--text); }
.ui-at-plan[data-status="draft"] .ui-at-plan__step .ui-at-plan__name { color: var(--ink); }
.ui-at-plan__step[data-status="active"] .ui-at-plan__name { font-weight: 600; }
.ui-at-plan__detail { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 8px; font-size: 13px; color: var(--muted); }
.ui-at-plan__detail > span { overflow-wrap: anywhere; }
.ui-at-plan__tool {
  height: 20px; display: inline-flex; align-items: center; padding: 0 6px; border-radius: 6px;
  background: var(--chip); color: var(--chip-ink); white-space: nowrap;
  font: 500 11.5px/1 ui-monospace, "SF Mono", Menlo, monospace;
}
.ui-at-plan__error { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 10px; margin-top: 4px; font-size: 13px; color: var(--bad-ink); }
.ui-at-plan__retry {
  display: inline-flex; align-items: center; gap: 5px; height: 26px; padding: 0 10px; border-radius: 8px;
  background: var(--bad-fill); border: 1px solid var(--bad-line); color: var(--bad-ink) !important;
  font-size: 12.5px; font-weight: 600; transition: background-color 150ms var(--ease);
}
.ui-at-plan__retry:hover { background: var(--panel); }
.ui-at-plan__time { flex: none; margin-top: 2px; font-size: 12.5px; color: var(--muted); font-variant-numeric: tabular-nums; }
.ui-at-plan__step[data-status="active"] .ui-at-plan__time { color: var(--ink); }
.ui-at-plan__remove {
  flex: none; width: 26px; height: 26px; margin: -1px -2px 0 0; display: grid; place-items: center;
  border: 0; border-radius: 8px; background: transparent; color: var(--muted); opacity: 0;
  transition: opacity 150ms var(--ease), background-color 150ms var(--ease);
}
.ui-at-plan__step:hover .ui-at-plan__remove, .ui-at-plan__step:focus-within .ui-at-plan__remove { opacity: 1; }
.ui-at-plan__remove:hover { background: var(--bad-fill); color: var(--bad-ink); }
.ui-at-plan__rename {
  width: 100%; height: 30px; margin: -3px 0 -1px -6px; padding: 0 6px; border-radius: 8px;
  border: 1px solid var(--line-firm); background: var(--panel); color: var(--ink); caret-color: var(--berry);
  font: inherit; font-size: 15px; box-shadow: var(--field-shade); outline: none;
}
.ui-at-plan__rename:focus { box-shadow: 0 0 0 3px var(--ring); }

.ui-at-plan__fold { display: grid; grid-template-rows: 0fr; opacity: 0; transition: grid-template-rows 300ms var(--ease), opacity 300ms var(--ease); }
.ui-at-plan__fold[data-open] { grid-template-rows: 1fr; opacity: 1; }
.ui-at-plan__fold-in { overflow: hidden; min-height: 0; }
.ui-at-plan__add {
  display: flex; align-items: center; gap: 8px; margin: 10px 0 2px; height: 38px; padding: 0 10px;
  border-radius: 10px; border: 1px dashed var(--line-firm); background: transparent; cursor: text;
  transition: border-color 150ms var(--ease), background-color 150ms var(--ease);
}
.ui-at-plan__add:focus-within { border-style: solid; border-color: var(--line-firm); background: var(--panel); box-shadow: 0 0 0 3px var(--ring), var(--field-shade); }
.ui-at-plan__add-mark { display: inline-flex; color: var(--muted); }
.ui-at-plan__add-input {
  flex: 1; min-width: 0; height: 100%; border: 0; background: transparent; outline: none;
  font: inherit; font-size: 14px; color: var(--ink); caret-color: var(--berry);
}
.ui-at-plan__add-input::placeholder { color: var(--muted); }

.ui-at-plan__tray { display: flex; align-items: center; justify-content: space-between; gap: 10px; min-height: 50px; padding: 8px 8px 6px 12px; }
.ui-at-plan__hint { font-size: 12.5px; color: var(--muted); }
.ui-at-plan__tray-actions { display: flex; gap: 8px; margin-left: auto; }
.ui-at-plan__state { display: inline-flex; align-items: center; gap: 8px; font-size: 13.5px; color: var(--ink); font-weight: 500; }
.ui-at-plan__state[data-kind="running"] { color: var(--info-ink); }
.ui-at-plan__state-mark { width: 18px; height: 18px; display: grid; place-items: center; border-radius: 50%; }
.ui-at-plan__state[data-kind="done"] .ui-at-plan__state-mark { background: var(--ok-fill); color: var(--ok-ink); border: 1px solid var(--ok-line); }
.ui-at-plan__state[data-kind="failed"] { color: var(--bad-ink); }
.ui-at-plan__state[data-kind="failed"] .ui-at-plan__state-mark { background: var(--bad-fill); border: 1px solid var(--bad-line); }
.ui-at-plan__elapsed { font-size: 12.5px; color: var(--muted); font-variant-numeric: tabular-nums; }
.ui-at-plan__btn {
  height: 34px; padding: 0 14px; border-radius: 10px; border: 1px solid var(--line-firm);
  background: var(--secondary); color: var(--ink); font-size: 13.5px; font-weight: 600; box-shadow: var(--drop);
  transition: background-color 150ms var(--ease), transform 150ms var(--ease);
}
.ui-at-plan__btn:hover { background: var(--soft); }
.ui-at-plan__btn:active { transform: translateY(1px); }
.ui-at-plan__btn:disabled { opacity: .5; cursor: not-allowed; }
.ui-at-plan .ui-at-plan__btn--main {
  background: var(--berry); border-color: var(--berry); color: #fff;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 6px 12px -6px rgba(133, 20, 55, 0.6);
}
.ui-at-plan .ui-at-plan__btn--main:hover:not(:disabled) { background: var(--berry-hover); }

@container (max-width: 400px) { .ui-at-plan__hint { display: none; } }
@container (max-width: 340px) {
  .ui-at-plan__panel { padding: 14px 12px 12px; }
  .ui-at-plan__tray { padding-left: 8px; }
}
@media (pointer: coarse) {
  .ui-at-plan__grip, .ui-at-plan__remove { opacity: 1; }
  .ui-at-plan__btn { height: 40px; }
}
@media (prefers-reduced-motion: reduce) {
  .ui-at-plan *, .ui-at-plan *::before, .ui-at-plan *::after { transition-duration: 0ms !important; animation: none !important; }
}
\`;
`;export{e as default};
