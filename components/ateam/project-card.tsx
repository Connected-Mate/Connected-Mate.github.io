"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";

/* ------------------------------------------------------------------------------------------------
 * Types
 * ----------------------------------------------------------------------------------------------*/

export type ProjectTask = { id: string; label: string; done?: boolean; assignee?: string };
export type ProjectTone = "red" | "amber" | "green" | "blue" | "violet" | "gray";
export type ProjectOption = { id: string; label: string; tone?: ProjectTone; icon?: ReactNode };
export type ProjectMember = { name: string; avatar?: string };

export type ProjectCardProps = {
  title: string;
  tasks: ProjectTask[];
  onTasksChange?: (tasks: ProjectTask[]) => void;
  status?: string;
  statuses?: ProjectOption[];
  onStatusChange?: (id: string) => void;
  due?: string;
  members?: ProjectMember[];
  action?: { label: string; onClick: () => void };
  hint?: ReactNode;
  trigger?: "hover" | "click";
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
};

const DEFAULT_STATUSES: ProjectOption[] = [
  { id: "todo", label: "To do", tone: "gray" },
  { id: "progress", label: "In progress", tone: "amber" },
  { id: "review", label: "In review", tone: "blue" },
  { id: "done", label: "Done", tone: "green" },
];

/* ------------------------------------------------------------------------------------------------
 * Helpers
 * ----------------------------------------------------------------------------------------------*/

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  return parts[0].slice(0, 1).toUpperCase();
}

function hueIndex(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return hash % 4;
}

function polar(cx: number, cy: number, r: number, degrees: number) {
  const radians = ((degrees - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(radians), y: cy + r * Math.sin(radians) };
}

function arcPath(cx: number, cy: number, r: number, start: number, end: number) {
  const a = polar(cx, cy, r, start);
  const b = polar(cx, cy, r, end);
  const large = end - start > 180 ? 1 : 0;
  return `M ${a.x.toFixed(3)} ${a.y.toFixed(3)} A ${r} ${r} 0 ${large} 1 ${b.x.toFixed(3)} ${b.y.toFixed(3)}`;
}

function useCoarsePointer() {
  const [coarse, setCoarse] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const query = window.matchMedia("(hover: none), (pointer: coarse)");
    const update = () => setCoarse(query.matches);
    update();
    query.addEventListener?.("change", update);
    return () => query.removeEventListener?.("change", update);
  }, []);
  return coarse;
}

/* ------------------------------------------------------------------------------------------------
 * Project card
 * ----------------------------------------------------------------------------------------------*/

export function ProjectCard({
  title,
  tasks: tasksProp,
  onTasksChange,
  status: statusProp,
  statuses = DEFAULT_STATUSES,
  onStatusChange,
  due,
  members = [],
  action,
  hint,
  trigger = "hover",
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  className,
}: ProjectCardProps) {
  const uid = useId().replace(/:/g, "");
  const rootRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const statusButtonRef = useRef<HTMLButtonElement>(null);
  const coarse = useCoarsePointer();

  // Tasks: controlled with onTasksChange, otherwise kept inside the card.
  const [ownTasks, setOwnTasks] = useState(tasksProp);
  const tasksKey = JSON.stringify(tasksProp);
  const lastTasksKey = useRef(tasksKey);
  useEffect(() => {
    if (lastTasksKey.current !== tasksKey) {
      lastTasksKey.current = tasksKey;
      setOwnTasks(tasksProp);
    }
  }, [tasksKey, tasksProp]);
  const tasks = onTasksChange ? tasksProp : ownTasks;

  // Status: follows the prop, keeps its own pick until the prop changes.
  const options = statuses.length ? statuses : DEFAULT_STATUSES;
  const [ownStatus, setOwnStatus] = useState(statusProp ?? options[0].id);
  useEffect(() => {
    if (statusProp !== undefined) setOwnStatus(statusProp);
  }, [statusProp]);
  const current = options.find((option) => option.id === ownStatus) ?? options[0];
  const optionsRef = useRef<HTMLDivElement>(null);

  const [statusOpen, setStatusOpen] = useState(false);

  // Open state: controlled or not; a hover opens, a click pins it open.
  const [ownOpen, setOwnOpen] = useState(defaultOpen);
  const open = openProp ?? ownOpen;
  const [pinned, setPinned] = useState(defaultOpen);
  const setOpen = useCallback(
    (next: boolean) => {
      if (openProp === undefined) setOwnOpen(next);
      if (next !== open) onOpenChange?.(next);
      if (!next) {
        setPinned(false);
        setStatusOpen(false);
      }
    },
    [open, openProp, onOpenChange],
  );

  const [hoverTask, setHoverTask] = useState<string | null>(null);
  const [hoverPerson, setHoverPerson] = useState<string | null>(null);
  const [keptPerson, setKeptPerson] = useState<string | null>(null);
  const person = hoverPerson ?? keptPerson;

  // Unfolding the options moves focus onto the chosen one, so arrows pick right away.
  useEffect(() => {
    if (!statusOpen) return;
    const timer = setTimeout(() => {
      optionsRef.current?.querySelector<HTMLInputElement>("input:checked")?.focus();
    }, 0);
    return () => clearTimeout(timer);
  }, [statusOpen]);

  // Forget a kept filter for someone who left the team.
  useEffect(() => {
    if (keptPerson && !members.some((member) => member.name === keptPerson)) setKeptPerson(null);
  }, [members, keptPerson]);

  // Tap outside closes on touch screens and after a click pin.
  useEffect(() => {
    if (!open) return;
    const onDown = (event: PointerEvent) => {
      if (rootRef.current?.contains(event.target as Node)) return;
      if (event.pointerType === "mouse" && trigger === "hover" && !pinned) return;
      setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open, pinned, trigger, setOpen]);

  const total = tasks.length;
  const doneCount = tasks.filter((task) => task.done).length;
  const left = total - doneCount;

  const toggleTask = (id: string) => {
    const next = tasks.map((task) => (task.id === id ? { ...task, done: !task.done } : task));
    if (onTasksChange) onTasksChange(next);
    else setOwnTasks(next);
  };

  const pickStatus = (id: string) => {
    setOwnStatus(id);
    onStatusChange?.(id);
  };

  const memberByName = useMemo(() => new Map(members.map((member) => [member.name, member])), [members]);

  // The tray line: what the pointer or focus is on, else the summary.
  const hoveredTask = tasks.find((task) => task.id === hoverTask);
  let trayKey = "summary";
  let trayText: ReactNode = hint ?? (total === 0 ? "No subtasks yet" : left ? `${left} left` : "All done");
  if (open && hoveredTask) {
    trayKey = `task-${hoveredTask.id}`;
    trayText = hoveredTask.assignee
      ? `${hoveredTask.assignee} · ${hoveredTask.done ? "done" : "to do"}`
      : hoveredTask.done ? "Done · nobody assigned" : "Nobody assigned yet";
  } else if (open && person) {
    const theirs = tasks.filter((task) => task.assignee === person);
    const theirsDone = theirs.filter((task) => task.done).length;
    trayKey = `person-${person}`;
    trayText = theirs.length ? `${person} · ${theirsDone} of ${theirs.length} done` : `${person} · no subtasks`;
  }

  const summary = [
    title,
    total ? `${doneCount} of ${total} subtasks done` : "no subtasks",
    current.label,
    due ? `due ${due}` : "",
  ]
    .filter(Boolean)
    .join(", ");

  const onRootKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Escape") return;
    if (statusOpen) {
      event.stopPropagation();
      setStatusOpen(false);
      statusButtonRef.current?.focus();
    } else if (open) {
      event.stopPropagation();
      setOpen(false);
      toggleRef.current?.focus();
    }
  };

  const onHeadClick = (pointerType: string) => {
    if (pointerType === "mouse" && trigger === "hover") {
      // Hover already opened it: the click pins it, a second click lets it go.
      if (open && !pinned) {
        setPinned(true);
        return;
      }
      setOpen(!open);
      setPinned(!open);
      return;
    }
    setOpen(!open);
    setPinned(!open);
  };
  const lastPointer = useRef("keyboard");

  const avatarFor = (name: string | undefined, size: "s" | "m") => {
    if (!name) return null;
    const member = memberByName.get(name);
    return <Avatar name={name} src={member?.avatar} size={size} />;
  };

  return (
    <div
      ref={rootRef}
      className={["ui-pcard", className].filter(Boolean).join(" ")}
      data-open={open ? "" : undefined}
      data-touch={coarse ? "" : undefined}
      data-filtered={open && person ? "" : undefined}
      onKeyDown={onRootKeyDown}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse" && trigger === "hover" && !open) setOpen(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== "mouse") return;
        setHoverTask(null);
        setHoverPerson(null);
        if (trigger === "hover" && !pinned && !rootRef.current?.contains(document.activeElement)) setOpen(false);
      }}
      onBlur={(event) => {
        if (trigger !== "hover" || pinned) return;
        if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
        if (event.currentTarget.matches(":hover")) return;
        setOpen(false);
      }}
    >
      <style href="ui-project-card" precedence="default">{css}</style>
      <div className="ui-pcard__frame">
        <div className="ui-pcard__panel">
          <div className="ui-pcard__head">
            <button
              ref={toggleRef}
              type="button"
              className="ui-pcard__toggle"
              aria-expanded={open}
              aria-controls={`${uid}-body`}
              aria-label={summary}
              onPointerDown={(event) => {
                lastPointer.current = event.pointerType;
              }}
              onClick={() => {
                onHeadClick(lastPointer.current);
                lastPointer.current = "keyboard";
              }}
            />
            <Ring tasks={tasks} hoverTask={hoverTask} person={open ? person : null} done={doneCount} />
            <div className="ui-pcard__main">
              <div className="ui-pcard__title" title={title}>{title}</div>
              <div className="ui-pcard__meta">
                <button
                  ref={statusButtonRef}
                  type="button"
                  className="ui-pcard__status"
                  data-tone={current.tone ?? "gray"}
                  aria-expanded={statusOpen}
                  aria-controls={`${uid}-status`}
                  aria-label={`Status: ${current.label}. Change status`}
                  tabIndex={open ? 0 : -1}
                  data-live={open ? "" : undefined}
                  onClick={() => open && setStatusOpen((value) => !value)}
                >
                  <span className="ui-pcard__status-icon" aria-hidden="true">
                    {current.icon ?? <ToneIcon tone={current.tone ?? "gray"} />}
                  </span>
                  <span className="ui-pcard__status-label">{current.label}</span>
                </button>
                {due ? (
                  <span className="ui-pcard__due">
                    <span className="ui-pcard__due-word">Due </span>
                    {due}
                  </span>
                ) : null}
              </div>
            </div>
            {members.length ? (
              <div className="ui-pcard__people" role="group" aria-label="People – show only their subtasks">
                {members.map((member) => (
                  <button
                    key={member.name}
                    type="button"
                    className="ui-pcard__person"
                    aria-pressed={keptPerson === member.name}
                    aria-label={member.name}
                    title={member.name}
                    tabIndex={open ? 0 : -1}
                    data-live={open ? "" : undefined}
                    data-dim={open && person && person !== member.name ? "" : undefined}
                    onPointerEnter={(event) => event.pointerType === "mouse" && setHoverPerson(member.name)}
                    onPointerLeave={(event) => event.pointerType === "mouse" && setHoverPerson(null)}
                    onFocus={() => setHoverPerson(member.name)}
                    onBlur={() => setHoverPerson(null)}
                    onClick={() => setKeptPerson((value) => (value === member.name ? null : member.name))}
                  >
                    <Avatar name={member.name} src={member.avatar} size="m" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="ui-pcard__fold" data-open={open ? "" : undefined}>
            <div className="ui-pcard__fold-inner" id={`${uid}-body`} inert={!open ? true : undefined}>
              <div className="ui-pcard__fold" data-open={statusOpen ? "" : undefined}>
                <div className="ui-pcard__fold-inner" inert={!statusOpen ? true : undefined}>
                  <div
                    ref={optionsRef}
                    className="ui-pcard__options"
                    id={`${uid}-status`}
                    role="radiogroup"
                    aria-label="Status"
                  >
                    {options.map((option) => (
                      <label key={option.id} className="ui-pcard__option" data-tone={option.tone ?? "gray"}>
                        <input
                          type="radio"
                          name={`${uid}-status`}
                          value={option.id}
                          checked={option.id === current.id}
                          onChange={() => pickStatus(option.id)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              event.preventDefault();
                              setStatusOpen(false);
                              statusButtonRef.current?.focus();
                            }
                          }}
                          onClick={(event) => {
                            // A pointer pick closes the options; arrow keys only move.
                            if (event.detail > 0) {
                              setStatusOpen(false);
                              statusButtonRef.current?.focus();
                            }
                          }}
                        />
                        <span className="ui-pcard__status-icon" aria-hidden="true">
                          {option.icon ?? <ToneIcon tone={option.tone ?? "gray"} />}
                        </span>
                        <span className="ui-pcard__option-label">{option.label}</span>
                        <svg className="ui-pcard__option-tick" viewBox="0 0 16 16" aria-hidden="true">
                          <path d="M3.5 8.4l2.9 2.9 6.1-6.6" />
                        </svg>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="ui-pcard__rule" />
              {tasks.length ? (
                <ul className="ui-pcard__tasks" aria-label={`Subtasks of ${title}`}>
                  {tasks.map((task) => {
                    const dim = open && person ? task.assignee !== person : false;
                    return (
                      <li
                        key={task.id}
                        className="ui-pcard__task"
                        data-done={task.done ? "" : undefined}
                        data-dim={dim ? "" : undefined}
                        data-hover={hoverTask === task.id ? "" : undefined}
                        onPointerEnter={(event) => event.pointerType === "mouse" && setHoverTask(task.id)}
                        onPointerLeave={(event) => event.pointerType === "mouse" && setHoverTask(null)}
                      >
                        <label className="ui-pcard__task-label">
                          <input
                            type="checkbox"
                            className="ui-pcard__check-input"
                            checked={Boolean(task.done)}
                            onChange={() => toggleTask(task.id)}
                            onFocus={() => setHoverTask(task.id)}
                            onBlur={() => setHoverTask(null)}
                            aria-describedby={task.assignee ? `${uid}-${task.id}-who` : undefined}
                          />
                          <span className="ui-pcard__check" aria-hidden="true">
                            <svg viewBox="0 0 16 16">
                              <path d="M4.4 8.3l2.4 2.4 4.8-5.2" pathLength={1} />
                            </svg>
                          </span>
                          <span className="ui-pcard__task-text">{task.label}</span>
                        </label>
                        {task.assignee ? (
                          <span className="ui-pcard__assignee" id={`${uid}-${task.id}-who`}>
                            <span className="ui-pcard__sr">Assigned to {task.assignee}</span>
                            <span aria-hidden="true">{avatarFor(task.assignee, "s")}</span>
                          </span>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="ui-pcard__empty">No subtasks yet.</p>
              )}
            </div>
          </div>
        </div>

        <div className="ui-pcard__tray">
          <span className="ui-pcard__hint" aria-live="polite" aria-atomic="true">
            <span key={trayKey} className="ui-pcard__hint-text">{trayText}</span>
          </span>
          {action ? (
            <button
              type="button"
              className="ui-pcard__action"
              tabIndex={open ? 0 : -1}
              onClick={action.onClick}
            >
              {action.label}
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M3.5 8h8.6M8.6 4.4 12.2 8l-3.6 3.6" />
              </svg>
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------------------------------
 * Parts
 * ----------------------------------------------------------------------------------------------*/

function Ring({
  tasks,
  hoverTask,
  person,
  done,
}: {
  tasks: ProjectTask[];
  hoverTask: string | null;
  person: string | null;
  done: number;
}) {
  const size = 36;
  const center = size / 2;
  const radius = 14;
  const count = tasks.length;
  const gap = count > 1 ? Math.min(14, 120 / count) : 0;
  const step = count ? 360 / count : 360;

  return (
    <span className="ui-pcard__ring" aria-hidden="true">
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
        {count === 0 ? (
          <circle className="ui-pcard__segment" cx={center} cy={center} r={radius} />
        ) : count === 1 ? (
          <circle
            className="ui-pcard__segment"
            data-done={tasks[0].done ? "" : undefined}
            data-hover={hoverTask === tasks[0].id ? "" : undefined}
            data-dim={person && tasks[0].assignee !== person ? "" : undefined}
            cx={center}
            cy={center}
            r={radius}
          />
        ) : (
          tasks.map((task, index) => (
            <path
              key={task.id}
              className="ui-pcard__segment"
              data-done={task.done ? "" : undefined}
              data-hover={hoverTask === task.id ? "" : undefined}
              data-dim={person && task.assignee !== person ? "" : undefined}
              d={arcPath(center, center, radius, index * step + gap / 2, (index + 1) * step - gap / 2)}
            />
          ))
        )}
      </svg>
      <span className="ui-pcard__count" key={done}>
        {count > 0 && done === count ? (
          <svg viewBox="0 0 16 16" className="ui-pcard__count-check">
            <path d="M4.4 8.3l2.4 2.4 4.8-5.2" />
          </svg>
        ) : (
          done
        )}
      </span>
    </span>
  );
}

function Avatar({ name, src, size }: { name: string; src?: string; size: "s" | "m" }) {
  const [broken, setBroken] = useState(false);
  return (
    <span className="ui-pcard__avatar" data-size={size} data-hue={hueIndex(name)}>
      {src && !broken ? <img src={src} alt="" onError={() => setBroken(true)} /> : initials(name)}
    </span>
  );
}

function ToneIcon({ tone }: { tone: ProjectTone }) {
  const common = { viewBox: "0 0 16 16", className: "ui-pcard__tone-icon" };
  switch (tone) {
    case "green":
      return (
        <svg {...common}>
          <circle cx="8" cy="8" r="5.6" />
          <path d="M5.6 8.2l1.7 1.7 3.2-3.5" />
        </svg>
      );
    case "red":
      return (
        <svg {...common}>
          <circle cx="8" cy="8" r="5.6" />
          <path d="M6 6l4 4M10 6l-4 4" />
        </svg>
      );
    case "amber":
      return (
        <svg {...common}>
          <circle cx="8" cy="8" r="5.6" />
          <path d="M8 4.6a3.4 3.4 0 0 1 0 6.8Z" data-fill="" />
        </svg>
      );
    case "blue":
      return (
        <svg {...common}>
          <circle cx="8" cy="8" r="5.6" />
          <path d="M8 4.6a3.4 3.4 0 1 1-3.4 3.4H8Z" data-fill="" />
        </svg>
      );
    case "violet":
      return (
        <svg {...common}>
          <circle cx="8" cy="8" r="5.6" />
          <circle cx="8" cy="8" r="1.8" data-fill="" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="8" cy="8" r="5.6" strokeDasharray="2.2 2.2" />
        </svg>
      );
  }
}

/* ------------------------------------------------------------------------------------------------
 * Styles
 * ----------------------------------------------------------------------------------------------*/

const css = /* css */ `
.ui-pcard {
  --ui-pc-frame: #f2f6fa;
  --ui-pc-panel: #ffffff;
  --ui-pc-soft: rgba(26, 62, 112, 0.06);
  --ui-pc-hairline: #dae2ec;
  --ui-pc-firm: #cbd6e4;
  --ui-pc-ink: #00162b;
  --ui-pc-text: rgba(0, 22, 43, 0.66);
  --ui-pc-muted: rgba(0, 22, 43, 0.54);
  --ui-pc-berry: #851437;
  --ui-pc-berry-hover: #6d0f2d;
  --ui-pc-ring: #8fbdf2;
  --ui-pc-info-ink: #1a3e70;
  --ui-pc-info-fill: #eef5ff;
  --ui-pc-info-line: #c1daff;
  --ui-pc-success-ink: #1d6a34;
  --ui-pc-success-fill: #eafbee;
  --ui-pc-success-line: #c9f5cf;
  --ui-pc-waiting-ink: #775810;
  --ui-pc-waiting-fill: #fdf6dd;
  --ui-pc-waiting-line: #fae6a0;
  --ui-pc-danger-ink: #8a3a22;
  --ui-pc-danger-fill: #fdeee8;
  --ui-pc-danger-line: #f5d5c9;
  --ui-pc-brand-ink: #851437;
  --ui-pc-brand-fill: #fbeef2;
  --ui-pc-brand-line: #f1cdd8;
  --ui-pc-pebble: inset 0 -2px 6px -4px rgba(26, 62, 112, 0.4);
  --ui-pc-drop: 0 8px 16px -8px rgba(26, 62, 112, 0.2);
  --ui-pc-raised: 0 18px 30px -16px rgba(26, 62, 112, 0.38), 0 4px 10px -6px rgba(26, 62, 112, 0.18);
  --ui-pc-floating: 0 24px 48px -24px rgba(26, 62, 112, 0.3);
  --ui-pc-ease: cubic-bezier(0.16, 1, 0.3, 1);
  container-type: inline-size;
  width: 100%;
  max-width: 320px;
  font-family: "Avenir Next", Avenir, system-ui, sans-serif;
  color: var(--ui-pc-ink);
  -webkit-tap-highlight-color: transparent;
}
:where(.dark, [data-theme="dark"]) .ui-pcard {
  --ui-pc-frame: #0f2747;
  --ui-pc-panel: #16345c;
  --ui-pc-soft: rgba(255, 255, 255, 0.07);
  --ui-pc-hairline: rgba(255, 255, 255, 0.12);
  --ui-pc-firm: rgba(255, 255, 255, 0.18);
  --ui-pc-ink: rgba(255, 255, 255, 0.94);
  --ui-pc-text: rgba(255, 255, 255, 0.72);
  --ui-pc-muted: rgba(255, 255, 255, 0.56);
  --ui-pc-berry: #a8204d;
  --ui-pc-berry-hover: #bd2a5a;
  --ui-pc-ring: rgba(143, 189, 242, 0.6);
  --ui-pc-info-ink: #c1daff;
  --ui-pc-info-fill: rgba(143, 189, 242, 0.16);
  --ui-pc-info-line: rgba(143, 189, 242, 0.3);
  --ui-pc-success-ink: #7fe0a0;
  --ui-pc-success-fill: rgba(127, 224, 160, 0.14);
  --ui-pc-success-line: rgba(127, 224, 160, 0.28);
  --ui-pc-waiting-ink: #f3d27a;
  --ui-pc-waiting-fill: rgba(243, 210, 122, 0.14);
  --ui-pc-waiting-line: rgba(243, 210, 122, 0.28);
  --ui-pc-danger-ink: #f2a48c;
  --ui-pc-danger-fill: rgba(242, 164, 140, 0.14);
  --ui-pc-danger-line: rgba(242, 164, 140, 0.28);
  --ui-pc-brand-ink: #f3a3bd;
  --ui-pc-brand-fill: rgba(243, 163, 189, 0.14);
  --ui-pc-brand-line: rgba(243, 163, 189, 0.28);
  --ui-pc-pebble: inset 0 -2px 6px -4px rgba(3, 12, 28, 0.8);
  --ui-pc-drop: 0 8px 16px -8px rgba(3, 12, 28, 0.6);
  --ui-pc-raised: 0 18px 30px -16px rgba(3, 12, 28, 0.8), 0 4px 10px -6px rgba(3, 12, 28, 0.6);
  --ui-pc-floating: 0 24px 48px -24px rgba(3, 12, 28, 0.8);
}
.ui-pcard *, .ui-pcard *::before, .ui-pcard *::after { box-sizing: border-box; }

.ui-pcard__frame {
  padding: 6px;
  border-radius: 22px;
  background: var(--ui-pc-frame);
  border: 1px solid var(--ui-pc-hairline);
  box-shadow: var(--ui-pc-drop);
  transition: box-shadow 300ms var(--ui-pc-ease);
}
.ui-pcard[data-open] .ui-pcard__frame { box-shadow: var(--ui-pc-floating), var(--ui-pc-drop); }
.ui-pcard__panel {
  border-radius: 16px;
  background: var(--ui-pc-panel);
  border: 1px solid var(--ui-pc-hairline);
  box-shadow: var(--ui-pc-raised);
}

/* Head */
.ui-pcard__head {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  min-width: 0;
}
.ui-pcard__toggle {
  position: absolute;
  inset: 0;
  z-index: 0;
  width: 100%;
  padding: 0;
  border: 0;
  border-radius: 15px;
  background: transparent;
  cursor: pointer;
}
.ui-pcard__toggle:focus-visible { outline: none; box-shadow: 0 0 0 3px var(--ui-pc-ring); }
.ui-pcard__ring, .ui-pcard__main, .ui-pcard__people { position: relative; z-index: 1; pointer-events: none; }
.ui-pcard__main { flex: 1; min-width: 0; }
.ui-pcard__title {
  font-family: "Avenir Next Condensed", "Avenir Next", Avenir, system-ui, sans-serif;
  font-weight: 700;
  font-size: 16px;
  line-height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-pcard__meta { display: flex; align-items: center; gap: 7px; margin-top: 3px; min-width: 0; }
.ui-pcard__due { min-width: 0; font-size: 12.5px; color: var(--ui-pc-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* Status chip and options – a state family: fill + hairline + ink */
.ui-pcard [data-tone] {
  --tone-ink: var(--ui-pc-muted);
  --tone-fill: var(--ui-pc-soft);
  --tone-line: var(--ui-pc-hairline);
}
.ui-pcard [data-tone="amber"] { --tone-ink: var(--ui-pc-waiting-ink); --tone-fill: var(--ui-pc-waiting-fill); --tone-line: var(--ui-pc-waiting-line); }
.ui-pcard [data-tone="green"] { --tone-ink: var(--ui-pc-success-ink); --tone-fill: var(--ui-pc-success-fill); --tone-line: var(--ui-pc-success-line); }
.ui-pcard [data-tone="blue"] { --tone-ink: var(--ui-pc-info-ink); --tone-fill: var(--ui-pc-info-fill); --tone-line: var(--ui-pc-info-line); }
.ui-pcard [data-tone="red"] { --tone-ink: var(--ui-pc-danger-ink); --tone-fill: var(--ui-pc-danger-fill); --tone-line: var(--ui-pc-danger-line); }
.ui-pcard [data-tone="violet"] { --tone-ink: var(--ui-pc-brand-ink); --tone-fill: var(--ui-pc-brand-fill); --tone-line: var(--ui-pc-brand-line); }
.ui-pcard__status {
  flex: none;
  max-width: 100%;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  min-width: 0;
  height: 22px;
  padding: 0 6px 0 4px;
  border-radius: 7px;
  border: 1px solid var(--tone-line);
  background: var(--tone-fill);
  color: var(--tone-ink);
  font: inherit;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  cursor: default;
  transition: box-shadow 150ms var(--ui-pc-ease), filter 150ms var(--ui-pc-ease);
}
.ui-pcard__status[data-live] { pointer-events: auto; cursor: pointer; }
.ui-pcard__status[data-live]:hover { filter: saturate(1.2); box-shadow: 0 2px 6px -3px rgba(26, 62, 112, 0.35); }
.ui-pcard__status-label { overflow: hidden; text-overflow: ellipsis; }
.ui-pcard__status-icon { display: grid; place-items: center; flex: none; color: var(--tone-ink); }
.ui-pcard__tone-icon { width: 14px; height: 14px; fill: none; stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }
.ui-pcard__tone-icon [data-fill] { fill: currentColor; stroke: none; }

.ui-pcard__options { display: grid; gap: 2px; padding: 0 8px 8px; }
.ui-pcard__option {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 32px;
  padding: 0 10px 0 12px;
  border-radius: 9px;
  font-size: 13px;
  color: var(--ui-pc-ink);
  cursor: pointer;
  transition: background-color 150ms var(--ui-pc-ease);
}
.ui-pcard__option:hover { background: var(--ui-pc-soft); }
.ui-pcard__option input { position: absolute; opacity: 0; width: 1px; height: 1px; margin: 0; pointer-events: none; }
.ui-pcard__option:has(input:checked) { background: var(--ui-pc-info-fill); box-shadow: inset 2px 0 0 var(--ui-pc-berry); }
.ui-pcard__option:has(input:focus-visible) { box-shadow: 0 0 0 3px var(--ui-pc-ring); }
.ui-pcard__option-label { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ui-pcard__option-tick { width: 14px; height: 14px; fill: none; stroke: var(--ui-pc-berry); stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; opacity: 0; }
.ui-pcard__option:has(input:checked) .ui-pcard__option-tick { opacity: 1; }

/* People */
.ui-pcard__people { display: flex; align-items: center; flex: none; padding-left: 4px; }
.ui-pcard__person {
  position: relative;
  margin-left: -7px;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: none;
  cursor: default;
  transition: opacity 300ms var(--ui-pc-ease), transform 150ms var(--ui-pc-ease);
}
.ui-pcard__person[data-live] { pointer-events: auto; cursor: pointer; }
.ui-pcard__person[data-live]:hover { transform: translateY(-1px); z-index: 1; }
.ui-pcard__person[data-dim] { opacity: 0.4; }
.ui-pcard__person[aria-pressed="true"] .ui-pcard__avatar { box-shadow: 0 0 0 2px var(--ui-pc-panel), 0 0 0 3.5px var(--ui-pc-berry); }
.ui-pcard__person:focus-visible { outline: none; }
.ui-pcard__person:focus-visible .ui-pcard__avatar { box-shadow: 0 0 0 2px var(--ui-pc-panel), 0 0 0 5px var(--ui-pc-ring); }

.ui-pcard__avatar {
  display: grid;
  place-items: center;
  overflow: hidden;
  border-radius: 999px;
  border: 1px solid var(--ui-pc-hairline);
  box-shadow: 0 0 0 2px var(--ui-pc-panel);
  font-weight: 700;
  line-height: 1;
  --av-fill: var(--ui-pc-info-fill);
  --av-ink: var(--ui-pc-info-ink);
  background: var(--av-fill);
  color: var(--av-ink);
}
.ui-pcard__avatar[data-hue="1"] { --av-fill: var(--ui-pc-success-fill); --av-ink: var(--ui-pc-success-ink); }
.ui-pcard__avatar[data-hue="2"] { --av-fill: var(--ui-pc-brand-fill); --av-ink: var(--ui-pc-brand-ink); }
.ui-pcard__avatar[data-hue="3"] { --av-fill: var(--ui-pc-waiting-fill); --av-ink: var(--ui-pc-waiting-ink); }
.ui-pcard__avatar[data-size="m"] { width: 24px; height: 24px; font-size: 10.5px; }
.ui-pcard__avatar[data-size="s"] { width: 20px; height: 20px; font-size: 9px; box-shadow: none; }
.ui-pcard__avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }

/* Ring */
.ui-pcard__ring { position: relative; display: grid; place-items: center; flex: none; width: 36px; height: 36px; }
.ui-pcard__ring svg { position: absolute; inset: 0; overflow: visible; }
.ui-pcard__segment {
  fill: none;
  stroke: var(--ui-pc-firm);
  stroke-width: 2.6;
  stroke-linecap: round;
  transition: stroke 300ms var(--ui-pc-ease), stroke-width 150ms var(--ui-pc-ease), opacity 300ms var(--ui-pc-ease);
}
.ui-pcard__segment[data-done] { stroke: var(--ui-pc-berry); }
.ui-pcard__segment[data-hover] { stroke-width: 4.2; }
.ui-pcard__segment[data-dim] { opacity: 0.25; }
.ui-pcard__count {
  position: relative;
  font-size: 13px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: var(--ui-pc-ink);
  animation: ui-pcard-pop 300ms var(--ui-pc-ease);
}
.ui-pcard__count-check { display: block; width: 14px; height: 14px; fill: none; stroke: var(--ui-pc-berry); stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

/* Fold – grows downward in place */
.ui-pcard__fold {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  transition: grid-template-rows 300ms var(--ui-pc-ease), opacity 300ms var(--ui-pc-ease);
}
.ui-pcard__fold[data-open] { grid-template-rows: 1fr; opacity: 1; }
.ui-pcard__fold-inner { min-height: 0; overflow: hidden; }
.ui-pcard__rule { height: 1px; margin: 0 12px; background: var(--ui-pc-hairline); }

/* Subtasks */
.ui-pcard__tasks { list-style: none; margin: 0; padding: 6px 6px 8px; }
.ui-pcard__task {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-right: 6px;
  border-radius: 10px;
  transition: opacity 300ms var(--ui-pc-ease), background-color 150ms var(--ui-pc-ease);
}
.ui-pcard__task[data-hover] { background: var(--ui-pc-soft); }
.ui-pcard__task[data-dim] { opacity: 0.35; }
.ui-pcard__task-label {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 32px;
  padding: 0 6px;
  cursor: pointer;
}
.ui-pcard__check-input { position: absolute; opacity: 0; width: 1px; height: 1px; margin: 0; pointer-events: none; }
.ui-pcard__check {
  flex: none;
  display: grid;
  place-items: center;
  width: 17px;
  height: 17px;
  border-radius: 999px;
  border: 1.5px solid var(--ui-pc-firm);
  background: var(--ui-pc-panel);
  transition: background-color 300ms var(--ui-pc-ease), border-color 300ms var(--ui-pc-ease), box-shadow 150ms var(--ui-pc-ease);
}
.ui-pcard__check svg { width: 13px; height: 13px; fill: none; stroke: #ffffff; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.ui-pcard__check path { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 300ms var(--ui-pc-ease) 60ms; }
.ui-pcard__task[data-done] .ui-pcard__check { background: var(--ui-pc-berry); border-color: var(--ui-pc-berry); }
.ui-pcard__task[data-done] .ui-pcard__check path { stroke-dashoffset: 0; }
.ui-pcard__check-input:focus-visible + .ui-pcard__check { box-shadow: 0 0 0 3px var(--ui-pc-ring); }
.ui-pcard__task-text {
  min-width: 0;
  font-size: 13.5px;
  line-height: 18px;
  color: var(--ui-pc-ink);
  overflow-wrap: anywhere;
  transition: color 300ms var(--ui-pc-ease);
}
.ui-pcard__task[data-done] .ui-pcard__task-text { color: var(--ui-pc-muted); }
.ui-pcard__assignee { flex: none; display: grid; opacity: 0; transform: translateX(4px); transition: opacity 150ms var(--ui-pc-ease), transform 150ms var(--ui-pc-ease); }
.ui-pcard__task[data-hover] .ui-pcard__assignee,
.ui-pcard[data-touch] .ui-pcard__assignee,
.ui-pcard[data-filtered] .ui-pcard__task:not([data-dim]) .ui-pcard__assignee { opacity: 1; transform: none; }
.ui-pcard__empty { margin: 0; padding: 14px 14px 16px; font-size: 13px; color: var(--ui-pc-muted); }

/* Tray */
.ui-pcard__tray {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  min-height: 38px;
  padding: 4px 6px 0 10px;
}
.ui-pcard__hint { position: relative; flex: 1; min-width: 0; overflow: hidden; font-size: 12.5px; color: var(--ui-pc-muted); }
.ui-pcard__hint-text { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; animation: ui-pcard-rise 300ms var(--ui-pc-ease); }
.ui-pcard__action {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 28px;
  padding: 0 8px 0 10px;
  border: 0;
  border-radius: 9px;
  background: transparent;
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  color: var(--ui-pc-ink);
  cursor: pointer;
  transition: background-color 150ms var(--ui-pc-ease);
}
.ui-pcard__action svg { width: 14px; height: 14px; fill: none; stroke: currentColor; stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; transition: transform 150ms var(--ui-pc-ease); }
.ui-pcard__action:hover { background: var(--ui-pc-soft); }
.ui-pcard__action:hover svg { transform: translateX(2px); }
.ui-pcard__action:focus-visible { outline: none; box-shadow: 0 0 0 3px var(--ui-pc-ring); }

.ui-pcard__sr { position: absolute; width: 1px; height: 1px; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }

/* Touch: taller rows and options */
.ui-pcard[data-touch] .ui-pcard__task-label { min-height: 42px; }
.ui-pcard[data-touch] .ui-pcard__option { min-height: 42px; }
.ui-pcard[data-touch] .ui-pcard__action { height: 36px; }

/* Narrow */
@container (max-width: 289px) {
  .ui-pcard__due-word { display: none; }
  .ui-pcard__person { margin-left: -8px; }
  .ui-pcard__head { gap: 9px; padding: 11px 10px; }
}

@keyframes ui-pcard-pop { 0% { transform: scale(0.6); opacity: 0.2; } 60% { transform: scale(1.12); opacity: 1; } 100% { transform: scale(1); } }
@keyframes ui-pcard-rise { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: none; } }

@media (prefers-reduced-motion: reduce) {
  .ui-pcard__fold,
  .ui-pcard__frame,
  .ui-pcard__segment,
  .ui-pcard__check,
  .ui-pcard__check path,
  .ui-pcard__assignee,
  .ui-pcard__person,
  .ui-pcard__action svg { transition: none; }
  .ui-pcard__count, .ui-pcard__hint-text { animation: none; }
  .ui-pcard__person[data-live]:hover, .ui-pcard__action:hover svg { transform: none; }
  .ui-pcard__assignee { transform: none; }
}
`;
