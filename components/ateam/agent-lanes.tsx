"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

export type LaneAgent = {
  id: string;
  name: string;
  model?: string;
  /** A logo or picture – sits on a white tile. Without it the initials show */
  avatar?: ReactNode;
};

export type LaneTaskStatus = "done" | "running" | "waiting" | "failed";

export type LaneTask = {
  id: string;
  agentId: string;
  title: string;
  status: LaneTaskStatus;
  /** ms timestamp */
  start: number;
  /** ms timestamp – without it the block reaches "now" */
  end?: number;
  /** Id of the next agent's task this one hands over to */
  handoffTo?: string;
  /** What a waiting task needs decided – one sentence */
  ask?: string;
  /** Two or three short points on what got done */
  summary?: string[];
  /** Up to three small logos of the apps the task works in */
  tools?: ReactNode[];
};

export type AgentLanesProps = {
  agents: LaneAgent[];
  tasks: LaneTask[];
  /** Visible window in ms */
  span?: number;
  /** A clock you control. Without it the lanes follow real time, every second */
  now?: number;
  onApprove?: (task: LaneTask) => void;
  onReject?: (task: LaneTask) => void;
  onOpen?: (task: LaneTask) => void;
  title?: string;
  className?: string;
};

const MIN = 60_000;
const LANE_H = 48;
const STATUS_WORD: Record<LaneTaskStatus, string> = {
  done: "Done",
  running: "Running",
  waiting: "Needs you",
  failed: "Failed",
};

function minutes(ms: number) {
  const m = Math.max(1, Math.round(ms / MIN));
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  const r = m % 60;
  return r ? `${h}h ${String(r).padStart(2, "0")}m` : `${h}h`;
}

function spanLabel(span: number) {
  const m = Math.round(span / MIN);
  if (m < 60) return `Last ${m}m`;
  return m % 60 ? `Last ${Math.floor(m / 60)}h ${m % 60}m` : `Last ${m / 60}h`;
}

function tickStep(span: number) {
  const steps = [1, 2, 5, 10, 15, 30, 60, 120, 240].map((m) => m * MIN);
  return steps.find((s) => span / s <= 7) ?? 240 * MIN;
}

function tickLabel(ms: number) {
  const m = Math.round(ms / MIN);
  if (m < 60) return `−${m}m`;
  const h = Math.floor(m / 60);
  return m % 60 ? `−${h}h ${m % 60}m` : `−${h}h`;
}

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

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

const Sparkle = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
    <path
      fill="currentColor"
      d="M8 1.2c.35 2.9 1.9 4.45 4.8 4.8-2.9.35-4.45 1.9-4.8 4.8-.35-2.9-1.9-4.45-4.8-4.8 2.9-.35 4.45-1.9 4.8-4.8Z"
    />
    <path fill="currentColor" opacity=".55" d="M12.6 10.2c.15 1.2.8 1.85 2 2-1.2.15-1.85.8-2 2-.15-1.2-.8-1.85-2-2 1.2-.15 1.85-.8 2-2Z" />
  </svg>
);
const Warn = () => (
  <svg width="10" height="10" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
    <path fill="currentColor" d="M7.1 2.3a1 1 0 0 1 1.8 0l5.6 10.2a1 1 0 0 1-.9 1.5H2.4a1 1 0 0 1-.9-1.5L7.1 2.3Z" />
  </svg>
);

type Popover = { taskId: string; kind: "tip" | "decide" };

export function AgentLanes({
  agents,
  tasks,
  span = 30 * MIN,
  now: nowProp,
  onApprove,
  onReject,
  onOpen,
  title = "Agents",
  className,
}: AgentLanesProps) {
  const uid = useId();
  const reduced = useReducedMotion();

  /* Clock */
  const [tick, setTick] = useState(() => Date.now());
  useEffect(() => {
    if (nowProp !== undefined) return;
    setTick(Date.now());
    const id = window.setInterval(() => setTick(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [nowProp]);
  const now = nowProp ?? tick;
  const from = now - span;

  /* Local decisions when no handlers are passed */
  const [local, setLocal] = useState<Record<string, Partial<LaneTask>>>({});
  const list = useMemo(() => tasks.map((t) => (local[t.id] ? { ...t, ...local[t.id] } : t)), [tasks, local]);
  const byId = useMemo(() => new Map(list.map((t) => [t.id, t])), [list]);

  /* Track width, for the hand-off curves */
  const trackRef = useRef<HTMLDivElement>(null);
  const [trackW, setTrackW] = useState(0);
  useLayoutEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const measure = () => setTrackW(el.clientWidth);
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const laneIndex = useMemo(() => new Map(agents.map((a, i) => [a.id, i])), [agents]);
  const pct = (t: number) => ((t - from) / span) * 100;
  const visible = list.filter((t) => laneIndex.has(t.agentId) && (t.end ?? now) > from && t.start < now);

  /* Popovers */
  const [pop, setPop] = useState<Popover | null>(null);
  const blockRefs = useRef(new Map<string, HTMLButtonElement>());
  const popRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [popPos, setPopPos] = useState<CSSProperties>({ opacity: 0 });
  const popTask = pop ? byId.get(pop.taskId) : undefined;
  const popKind = popTask ? (popTask.status === "waiting" ? "decide" : "tip") : null;

  useEffect(() => {
    if (pop && (!popTask || !visible.some((t) => t.id === pop.taskId))) setPop(null);
  });

  useLayoutEffect(() => {
    if (!pop) return;
    const block = blockRefs.current.get(pop.taskId);
    const panel = panelRef.current;
    const box = popRef.current;
    if (!block || !panel || !box) return;
    const b = block.getBoundingClientRect();
    const p = panel.getBoundingClientRect();
    const w = box.offsetWidth;
    const h = box.offsetHeight;
    const left = Math.min(Math.max(8, Math.min(b.right, p.right) - p.left - w), p.width - w - 8);
    const above = b.top - p.top - h - 6;
    const top = above >= 4 ? above : b.bottom - p.top + 6;
    setPopPos({ left: Math.max(8, left), top });
  }, [pop, now, trackW]);

  useEffect(() => {
    if (!pop) return;
    // Move focus only when the person is working in the lanes – never steal it from elsewhere on the page
    const active = document.activeElement;
    const ours = !active || active === document.body || panelRef.current?.contains(active);
    if (popKind === "decide" && ours) {
      popRef.current?.querySelector<HTMLButtonElement>("[data-approve]")?.focus({ preventScroll: true });
    }
    const onDoc = (e: PointerEvent) => {
      const target = e.target as Node;
      if (popRef.current?.contains(target)) return;
      if (blockRefs.current.get(pop.taskId)?.contains(target)) return;
      setPop(null);
    };
    document.addEventListener("pointerdown", onDoc);
    return () => document.removeEventListener("pointerdown", onDoc);
  }, [pop?.taskId, popKind]); // eslint-disable-line react-hooks/exhaustive-deps

  const close = (focus = true) => {
    const id = pop?.taskId;
    setPop(null);
    const active = document.activeElement;
    const ours = !active || active === document.body || panelRef.current?.contains(active);
    if (focus && id && ours) blockRefs.current.get(id)?.focus({ preventScroll: true });
  };

  const decide = (t: LaneTask, ok: boolean) => {
    if (ok) {
      if (onApprove) onApprove(t);
      else setLocal((l) => ({ ...l, [t.id]: { ...l[t.id], status: "running" } }));
    } else {
      if (onReject) onReject(t);
      else setLocal((l) => ({ ...l, [t.id]: { ...l[t.id], status: "failed", end: Date.now() } }));
    }
    close();
  };

  /* Counts + announcement */
  const running = list.filter((t) => t.status === "running").length;
  const waiting = list.filter((t) => t.status === "waiting").length;
  const announce = waiting
    ? `${waiting} ${waiting === 1 ? "task needs" : "tasks need"} you`
    : running
      ? `${running} running`
      : "Nothing running";

  const step = tickStep(span);
  const ticks: number[] = [];
  for (let back = step; back < span; back += step) ticks.push(back);

  /* Hand-off curves, in track pixels */
  const curves = visible
    .filter((t) => t.handoffTo && byId.has(t.handoffTo))
    .map((t) => {
      const next = byId.get(t.handoffTo!)!;
      const a = laneIndex.get(t.agentId);
      const b = laneIndex.get(next.agentId);
      if (a === undefined || b === undefined || !trackW) return null;
      const x1 = (pct(t.end ?? now) / 100) * trackW;
      const x2 = (pct(next.start) / 100) * trackW;
      const y1 = a * LANE_H + LANE_H / 2;
      const y2 = b * LANE_H + LANE_H / 2;
      const bend = Math.max(14, Math.abs(x2 - x1) / 2 + 10);
      const live = next.status === "running" || next.status === "waiting";
      return {
        id: `${t.id}-${next.id}`,
        d: `M ${x1} ${y1} C ${x1 + bend} ${y1}, ${x2 - bend} ${y2}, ${x2} ${y2}`,
        live,
      };
    })
    .filter(Boolean) as { id: string; d: string; live: boolean }[];

  const agentState = (id: string) => {
    const mine = list.filter((t) => t.agentId === id);
    if (mine.some((t) => t.status === "waiting")) return "waiting";
    if (mine.some((t) => t.status === "running")) return "running";
    return "idle";
  };

  return (
    <div
      className={["ui-at-lanes", className].filter(Boolean).join(" ")}
      data-reduced={reduced || undefined}
      onKeyDown={(e) => {
        if (e.key === "Escape" && pop) {
          e.preventDefault();
          close();
        }
      }}
    >
      <style href="ui-agent-lanes" precedence="default">
        {css}
      </style>
      <div className="ui-at-lanes__bar">
        <span className="ui-at-lanes__mark">
          <Sparkle />
        </span>
        <h3 className="ui-at-lanes__title">{title}</h3>
        <span className="ui-at-lanes__stats">
          {running ? (
            <span className="ui-at-lanes__stat" data-kind="running">
              {running} running
            </span>
          ) : null}
          {waiting ? (
            <span className="ui-at-lanes__stat" data-kind="waiting">
              {waiting} need{waiting === 1 ? "s" : ""} you
            </span>
          ) : null}
        </span>
        <span className="ui-at-lanes__span">{spanLabel(span)}</span>
      </div>

      <div className="ui-at-lanes__panel" ref={panelRef}>
        <div className="ui-at-lanes__grid" style={{ "--lanes": agents.length } as CSSProperties}>
          <div className="ui-at-lanes__corner" aria-hidden="true" />
          <div className="ui-at-lanes__scale" aria-hidden="true">
            {ticks.map((back) => (
              <span key={back} className="ui-at-lanes__tick" style={{ left: `${100 - (back / span) * 100}%` }}>
                {tickLabel(back)}
              </span>
            ))}
            <span className="ui-at-lanes__now">now</span>
          </div>

          <ul className="ui-at-lanes__names" aria-hidden="true">
            {agents.map((a) => {
              const st = agentState(a.id);
              return (
                <li key={a.id} className="ui-at-lanes__who">
                  <span className="ui-at-lanes__avatar" title={a.name}>
                    {a.avatar ?? <span className="ui-at-lanes__initials">{initials(a.name)}</span>}
                  </span>
                  <span className="ui-at-lanes__id">
                    <span className="ui-at-lanes__name-row">
                      <span className="ui-at-lanes__name">{a.name}</span>
                      {st === "waiting" ? (
                        <span className="ui-at-lanes__tag" data-kind="waiting">
                          Needs you
                        </span>
                      ) : st === "idle" ? (
                        <span className="ui-at-lanes__tag">Idle</span>
                      ) : null}
                    </span>
                    {a.model ? <span className="ui-at-lanes__model">{a.model}</span> : null}
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="ui-at-lanes__track" ref={trackRef}>
            <div className="ui-at-lanes__lines" aria-hidden="true">
              {ticks.map((back) => (
                <span key={back} className="ui-at-lanes__line" style={{ left: `${100 - (back / span) * 100}%` }} />
              ))}
            </div>
            <svg className="ui-at-lanes__curves" width={trackW} height={agents.length * LANE_H} aria-hidden="true">
              {curves.map((c) => (
                <path key={c.id} d={c.d} className="ui-at-lanes__curve" data-live={c.live || undefined} />
              ))}
            </svg>
            {agents.map((a) => {
              const mine = visible.filter((t) => t.agentId === a.id);
              return (
                <ul key={a.id} className="ui-at-lanes__lane" aria-label={a.name}>
                  {mine.map((t) => {
                    const startPct = pct(t.start);
                    const endPct = pct(t.end ?? now);
                    const left = Math.max(0, startPct);
                    const width = Math.max(0.8, Math.min(100, endPct) - left);
                    const dur = minutes((t.end ?? now) - t.start);
                    const label = `${a.name}: ${t.title} – ${STATUS_WORD[t.status]}, ${t.status === "done" ? `took ${dur}` : dur}`;
                    const open = pop?.taskId === t.id;
                    const isDecide = t.status === "waiting";
                    return (
                      <li
                        key={t.id}
                        className="ui-at-lanes__slot"
                        style={{ left: `${left}%`, width: `${width}%` }}
                        data-clipped={startPct < 0 || undefined}
                      >
                        <button
                          type="button"
                          ref={(el) => {
                            if (el) blockRefs.current.set(t.id, el);
                            else blockRefs.current.delete(t.id);
                          }}
                          className="ui-at-lanes__block"
                          data-status={t.status}
                          data-live={t.end === undefined || undefined}
                          aria-label={label}
                          aria-expanded={open}
                          aria-controls={open ? `${uid}-pop` : undefined}
                          aria-haspopup={isDecide ? "dialog" : undefined}
                          onClick={() => setPop(open ? null : { taskId: t.id, kind: isDecide ? "decide" : "tip" })}
                        >
                          {t.tools?.length ? (
                            <span className="ui-at-lanes__tools">
                              {t.tools.slice(0, 3).map((tool, i) => (
                                <span key={i} className="ui-at-lanes__tool">
                                  {tool}
                                </span>
                              ))}
                            </span>
                          ) : null}
                          <span className="ui-at-lanes__label">{t.title}</span>
                          {isDecide ? (
                            <span className="ui-at-lanes__flag">
                              <Warn />
                              Needs you
                            </span>
                          ) : null}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              );
            })}
          </div>
        </div>

        {pop && popTask ? (
          popKind === "decide" ? (
            <div
              ref={popRef}
              id={`${uid}-pop`}
              className="ui-at-lanes__pop ui-at-lanes__pop--decide"
              role="dialog"
              aria-label={`Decide: ${popTask.title}`}
              style={popPos}
            >
              <p className="ui-at-lanes__pop-title">{popTask.title}</p>
              {popTask.ask ? <p className="ui-at-lanes__pop-ask">{popTask.ask}</p> : null}
              <div className="ui-at-lanes__pop-actions">
                <button type="button" className="ui-at-lanes__btn" onClick={() => decide(popTask, false)}>
                  Reject
                </button>
                <button
                  type="button"
                  data-approve
                  className="ui-at-lanes__btn ui-at-lanes__btn--main"
                  onClick={() => decide(popTask, true)}
                >
                  Approve
                </button>
              </div>
            </div>
          ) : (
            <div ref={popRef} id={`${uid}-pop`} className="ui-at-lanes__pop ui-at-lanes__pop--tip" role="tooltip" style={popPos}>
              <p className="ui-at-lanes__tip-head">
                {agents.find((a) => a.id === popTask.agentId)?.name} · {STATUS_WORD[popTask.status]} ·{" "}
                {minutes((popTask.end ?? now) - popTask.start)}
              </p>
              {popTask.summary?.length ? (
                <ul className="ui-at-lanes__tip-list">
                  {popTask.summary.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              ) : (
                <p className="ui-at-lanes__tip-empty">{popTask.title}</p>
              )}
              {onOpen ? (
                <button type="button" className="ui-at-lanes__open" onClick={() => onOpen(popTask)}>
                  Open
                </button>
              ) : null}
            </div>
          )
        ) : null}
      </div>
      <p className="ui-at-lanes__sr" role="status" aria-live="polite">
        {announce}
      </p>
    </div>
  );
}

/* ---------- styles ---------- */

const css = /* css */ `
.ui-at-lanes {
  --frame: #f2f6fa; --panel: #ffffff; --soft: rgba(26, 62, 112, 0.06);
  --line: #dae2ec; --line-firm: #cbd6e4; --grid: rgba(26, 62, 112, 0.1);
  --ink: #00162b; --text: rgba(0, 22, 43, 0.66); --muted: rgba(0, 22, 43, 0.54);
  --berry: #851437; --berry-hover: #6d0f2d;
  --info-ink: #1a3e70; --info-fill: #eef5ff; --info-line: #c1daff; --ring: #8fbdf2;
  --ok-ink: #1d6a34; --ok-fill: #eafbee; --ok-line: #c9f5cf;
  --wait-ink: #775810; --wait-fill: #fdf6dd; --wait-line: #fae6a0;
  --bad-ink: #8a3a22; --bad-fill: #fdeee8; --bad-line: #f5d5c9;
  --done-fill: #f1f4f8; --done-ink: rgba(0, 22, 43, 0.6);
  --link: #8ebbf5; --dot-run: #2f6fc4; --dot-wait: #c48a12;
  --tile: #ffffff; --tip-bg: #00162b; --tip-ink: rgba(255, 255, 255, 0.92); --tip-muted: rgba(255, 255, 255, 0.62);
  --secondary: #fbfcfe;
  --pebble-shade: inset 0 -2px 6px -4px rgba(26, 62, 112, 0.4);
  --drop: 0 8px 16px -8px rgba(26, 62, 112, 0.2);
  --raised: 0 18px 30px -16px rgba(26, 62, 112, 0.38), 0 4px 10px -6px rgba(26, 62, 112, 0.18);
  --float: 0 24px 48px -24px rgba(26, 62, 112, 0.3);
  --ease: cubic-bezier(.16, 1, .3, 1);
  box-sizing: border-box;
  position: relative;
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
  line-height: 1.4;
  text-align: left;
  container-type: inline-size;
}
:where(.dark, [data-theme="dark"]) .ui-at-lanes {
  --frame: #0f2747; --panel: #16345c; --soft: rgba(255, 255, 255, 0.07);
  --line: rgba(255, 255, 255, 0.12); --line-firm: rgba(255, 255, 255, 0.18); --grid: rgba(255, 255, 255, 0.1);
  --ink: rgba(255, 255, 255, 0.94); --text: rgba(255, 255, 255, 0.72); --muted: rgba(255, 255, 255, 0.56);
  --berry: #a8204d; --berry-hover: #bd2a5a;
  --info-ink: #c1daff; --info-fill: rgba(143, 189, 242, 0.16); --info-line: rgba(143, 189, 242, 0.34); --ring: rgba(143, 189, 242, 0.6);
  --ok-ink: #7fe0a0; --ok-fill: rgba(127, 224, 160, 0.14); --ok-line: rgba(127, 224, 160, 0.3);
  --wait-ink: #f3d27a; --wait-fill: rgba(243, 210, 122, 0.14); --wait-line: rgba(243, 210, 122, 0.3);
  --bad-ink: #f2a48c; --bad-fill: rgba(242, 164, 140, 0.14); --bad-line: rgba(242, 164, 140, 0.3);
  --done-fill: rgba(255, 255, 255, 0.07); --done-ink: rgba(255, 255, 255, 0.6);
  --link: #8ebbf5; --dot-run: #8fbdf2; --dot-wait: #f3d27a;
  --tile: #ffffff; --tip-bg: #071a33; --tip-ink: rgba(255, 255, 255, 0.92); --tip-muted: rgba(255, 255, 255, 0.6);
  --secondary: rgba(255, 255, 255, 0.06);
  --pebble-shade: inset 0 -2px 6px -4px rgba(3, 12, 28, 0.8);
  --drop: 0 8px 16px -8px rgba(3, 12, 28, 0.6);
  --raised: 0 18px 30px -16px rgba(3, 12, 28, 0.8), 0 4px 10px -6px rgba(3, 12, 28, 0.6);
  --float: 0 24px 48px -24px rgba(3, 12, 28, 0.7);
}
.ui-at-lanes *, .ui-at-lanes *::before, .ui-at-lanes *::after { box-sizing: border-box; }
.ui-at-lanes :where(button) { font: inherit; color: inherit; cursor: pointer; }
.ui-at-lanes :focus-visible { outline: none; box-shadow: 0 0 0 3px var(--ring); }
.ui-at-lanes__sr {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0;
}

.ui-at-lanes__bar { display: flex; align-items: center; gap: 8px; padding: 8px 8px 10px 14px; min-height: 46px; }
.ui-at-lanes__mark { display: inline-flex; color: var(--dot-run); }
.ui-at-lanes__title {
  margin: 0; color: var(--ink); font-size: 16px; font-weight: 700; letter-spacing: 0;
  font-family: "Avenir Next Condensed", "Avenir Next", Avenir, system-ui, sans-serif;
}
.ui-at-lanes__stats { display: flex; flex-wrap: wrap; gap: 4px 12px; margin-left: 4px; min-width: 0; flex: 1; }
.ui-at-lanes__stat { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: var(--muted); white-space: nowrap; }
.ui-at-lanes__stat::before { content: ""; width: 6px; height: 6px; border-radius: 50%; background: var(--dot-run); }
.ui-at-lanes__stat[data-kind="waiting"] { color: var(--wait-ink); }
.ui-at-lanes__stat[data-kind="waiting"]::before { background: var(--dot-wait); }
.ui-at-lanes__span {
  flex: none; height: 26px; display: inline-flex; align-items: center; padding: 0 10px;
  border-radius: 9px; background: var(--panel); border: 1px solid var(--line); box-shadow: var(--pebble-shade);
  color: var(--ink); font-size: 12.5px; font-weight: 600;
}

.ui-at-lanes__panel {
  position: relative; background: var(--panel); border: 1px solid var(--line);
  border-radius: 16px; box-shadow: var(--raised); padding: 6px 16px 10px 14px;
}
.ui-at-lanes__grid {
  display: grid; grid-template-columns: 154px minmax(0, 1fr);
  grid-template-rows: 28px calc(var(--lanes) * ${LANE_H}px);
}
.ui-at-lanes__scale { position: relative; }
.ui-at-lanes__tick {
  position: absolute; top: 6px; transform: translateX(-50%);
  font-size: 11.5px; color: var(--muted); font-variant-numeric: tabular-nums; white-space: nowrap;
}
.ui-at-lanes__now {
  position: absolute; right: 0; top: 4px; height: 18px; display: inline-flex; align-items: center; padding: 0 6px;
  border-radius: 6px; background: var(--info-fill); border: 1px solid var(--info-line);
  color: var(--info-ink); font-size: 10.5px; font-weight: 600; letter-spacing: 0.04em;
}
.ui-at-lanes__names { list-style: none; margin: 0; padding: 0; }
.ui-at-lanes__who { height: ${LANE_H}px; display: flex; align-items: center; gap: 10px; min-width: 0; padding-right: 10px; }
.ui-at-lanes__avatar {
  flex: none; width: 30px; height: 30px; border-radius: 50%; display: grid; place-items: center; overflow: hidden;
  background: var(--tile); border: 1px solid var(--line); box-shadow: var(--pebble-shade);
}
.ui-at-lanes__avatar > svg, .ui-at-lanes__avatar > img { width: 16px; height: 16px; }
.ui-at-lanes__initials { font-size: 11px; font-weight: 700; color: #1a3e70; letter-spacing: 0.02em; }
.ui-at-lanes__id { min-width: 0; display: flex; flex-direction: column; }
.ui-at-lanes__name-row { display: flex; align-items: center; gap: 6px; min-width: 0; }
.ui-at-lanes__name { color: var(--ink); font-weight: 600; font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ui-at-lanes__model { font-size: 12.5px; color: var(--muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ui-at-lanes__tag {
  flex: none; height: 18px; display: inline-flex; align-items: center; padding: 0 6px; border-radius: 6px;
  background: var(--soft); border: 1px solid var(--line); color: var(--muted); font-size: 11px; font-weight: 600;
}
.ui-at-lanes__tag[data-kind="waiting"] { background: var(--wait-fill); border-color: var(--wait-line); color: var(--wait-ink); }

.ui-at-lanes__track {
  position: relative; display: grid; grid-auto-rows: ${LANE_H}px;
  -webkit-mask-image: linear-gradient(to right, transparent 0, #000 22px);
  mask-image: linear-gradient(to right, transparent 0, #000 22px);
}
.ui-at-lanes__lines { position: absolute; inset: 0; pointer-events: none; }
.ui-at-lanes__line { position: absolute; top: -6px; bottom: 0; border-left: 1px dashed var(--grid); }
.ui-at-lanes__curves { position: absolute; left: 0; top: 0; overflow: visible; pointer-events: none; z-index: 1; }
.ui-at-lanes__curve { fill: none; stroke: var(--link); stroke-width: 1.5; stroke-dasharray: 2 4; stroke-linecap: round; }
.ui-at-lanes__curve[data-live] { animation: ui-at-lanes-flow 900ms linear infinite; }
@keyframes ui-at-lanes-flow { to { stroke-dashoffset: -12; } }
.ui-at-lanes__lane { position: relative; list-style: none; margin: 0; padding: 0; border-bottom: 1px solid var(--line); }
.ui-at-lanes__lane:last-child { border-bottom: 0; }
.ui-at-lanes__slot { position: absolute; top: 9px; height: 30px; z-index: 2; }

.ui-at-lanes__block {
  position: relative; width: 100%; height: 100%; display: flex; align-items: center; gap: 6px;
  padding: 0 8px; border-radius: 9px; overflow: hidden; text-align: left;
  background: var(--done-fill); border: 1px solid var(--line); color: var(--done-ink);
  font-size: 13px; font-weight: 500;
  transition: background-color 300ms var(--ease), color 300ms var(--ease), border-color 300ms var(--ease);
}
.ui-at-lanes__block:hover { border-color: var(--line-firm); }
.ui-at-lanes__block[data-status="running"] { background: var(--info-fill); border-color: var(--info-line); color: var(--info-ink); }
.ui-at-lanes__block[data-status="running"][data-live] { border-right: 3px solid var(--dot-run); }
.ui-at-lanes__block[data-status="running"]::after {
  content: ""; position: absolute; inset: 0; pointer-events: none; mix-blend-mode: soft-light;
  background: linear-gradient(100deg, transparent 30%, rgba(255, 255, 255, 0.45) 50%, transparent 70%);
  background-size: 220% 100%; animation: ui-at-lanes-shimmer 2.4s linear infinite;
}
:where(.dark, [data-theme="dark"]) .ui-at-lanes__block[data-status="running"]::after {
  background-image: linear-gradient(100deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
}
@keyframes ui-at-lanes-shimmer { from { background-position: 120% 0; } to { background-position: -120% 0; } }
.ui-at-lanes__block[data-status="waiting"] { background: var(--wait-fill); border-color: var(--wait-line); color: var(--wait-ink); }
.ui-at-lanes__block[data-status="failed"] { background: var(--bad-fill); border-color: var(--bad-line); color: var(--bad-ink); }
.ui-at-lanes__slot[data-clipped] .ui-at-lanes__block { border-top-left-radius: 0; border-bottom-left-radius: 0; border-left-color: transparent; }
.ui-at-lanes__tools { display: inline-flex; flex: none; position: relative; z-index: 1; }
.ui-at-lanes__tool {
  width: 18px; height: 18px; display: grid; place-items: center; border-radius: 5px;
  background: var(--tile); border: 1px solid var(--line); box-shadow: 0 1px 2px rgba(26, 62, 112, 0.12);
}
.ui-at-lanes__tool + .ui-at-lanes__tool { margin-left: -4px; }
.ui-at-lanes__tool > svg, .ui-at-lanes__tool > img { width: 11px; height: 11px; }
.ui-at-lanes__label { position: relative; z-index: 1; min-width: 0; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ui-at-lanes__flag {
  position: relative; z-index: 1; flex: none; display: inline-flex; align-items: center; gap: 4px; height: 20px; padding: 0 7px; border-radius: 6px;
  background: var(--panel); border: 1px solid var(--wait-line); color: var(--wait-ink); font-size: 11.5px; font-weight: 600;
  animation: ui-at-lanes-pulse 1.8s var(--ease) infinite;
}
@keyframes ui-at-lanes-pulse { 50% { box-shadow: 0 0 0 4px var(--wait-fill); } }

.ui-at-lanes__pop {
  position: absolute; z-index: 5; width: min(280px, calc(100% - 16px)); border-radius: 12px;
  animation: ui-at-lanes-pop 150ms var(--ease);
}
@keyframes ui-at-lanes-pop { from { opacity: 0; transform: translateY(4px); } }
.ui-at-lanes__pop--decide {
  padding: 12px 14px; background: var(--panel); border: 1px solid var(--line-firm); box-shadow: var(--raised);
}
.ui-at-lanes__pop-title { margin: 0 0 4px; color: var(--ink); font-weight: 600; }
.ui-at-lanes__pop-ask { margin: 0; font-size: 13px; color: var(--text); }
.ui-at-lanes__pop-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 12px; }
.ui-at-lanes__btn {
  height: 32px; padding: 0 14px; border-radius: 10px; border: 1px solid var(--line-firm);
  background: var(--secondary); color: var(--ink); font-size: 13.5px; font-weight: 600; box-shadow: var(--drop);
  transition: background-color 150ms var(--ease);
}
.ui-at-lanes__btn:hover { background: var(--soft); }
.ui-at-lanes .ui-at-lanes__btn--main {
  background: var(--berry); border-color: var(--berry); color: #fff;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 6px 12px -6px rgba(133, 20, 55, 0.6);
}
.ui-at-lanes .ui-at-lanes__btn--main:hover { background: var(--berry-hover); }
.ui-at-lanes__pop--tip {
  width: min(250px, calc(100% - 16px)); padding: 10px 12px; background: var(--tip-bg); color: var(--tip-ink);
  border: 1px solid rgba(255, 255, 255, 0.08); box-shadow: 0 18px 30px -16px rgba(3, 12, 28, 0.6); font-size: 12.5px;
}
.ui-at-lanes__tip-head { margin: 0 0 6px; color: var(--tip-muted); font-size: 11.5px; font-weight: 600; }
.ui-at-lanes__tip-list { margin: 0; padding-left: 16px; display: grid; gap: 2px; }
.ui-at-lanes__tip-empty { margin: 0; }
.ui-at-lanes__open {
  margin-top: 8px; padding: 0; border: 0; background: none; color: #c1daff !important;
  font-size: 12.5px; font-weight: 600; text-decoration: underline; text-underline-offset: 3px;
}

@container (max-width: 520px) {
  .ui-at-lanes__grid { grid-template-columns: 42px minmax(0, 1fr); }
  .ui-at-lanes__id { display: none; }
  .ui-at-lanes__who { padding-right: 8px; }
  .ui-at-lanes__panel { padding: 6px 10px 8px 8px; }
  .ui-at-lanes__tick:nth-child(odd) { display: none; }
}
@media (pointer: coarse) {
  .ui-at-lanes__btn { height: 40px; padding: 0 18px; }
}
@media (prefers-reduced-motion: reduce) {
  .ui-at-lanes *, .ui-at-lanes *::before, .ui-at-lanes *::after { transition-duration: 0ms !important; animation: none !important; }
}
`;
