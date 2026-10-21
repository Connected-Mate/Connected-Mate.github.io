import { useEffect, useRef, useState, type ReactNode } from "react";
import { DelegateBoard, type DelegateAgent, type DelegateMode, type DelegateTask } from "./delegate-board";

const LOOP_MS = 17_000;

const mark = (children: ReactNode, color: string) => (
  <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false" style={{ color }}>
    {children}
  </svg>
);
const asterisk = mark(
  <path stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" d="M8 2v12M2.8 5l10.4 6M2.8 11l10.4-6" />,
  "#c8553d",
);
const ring = mark(<circle cx="8" cy="8" r="5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeDasharray="5 2.6" />, "#00162b");
const star = mark(<path fill="currentColor" d="M8 1.5c.5 3.6 2.9 6 6.5 6.5-3.6.5-6 2.9-6.5 6.5-.5-3.6-2.9-6-6.5-6.5 3.6-.5 6-2.9 6.5-6.5Z" />, "#3a6fd8");

const tool = (d: ReactNode, color: string) => (
  <svg viewBox="0 0 12 12" width="11" height="11" aria-hidden="true" focusable="false" style={{ color }}>
    {d}
  </svg>
);
const branch = tool(
  <g fill="none" stroke="currentColor" strokeWidth="1.3">
    <circle cx="3.5" cy="3" r="1.3" />
    <circle cx="3.5" cy="9" r="1.3" />
    <circle cx="8.5" cy="4.5" r="1.3" />
    <path d="M3.5 4.3v3.4M8.5 5.8c0 2-5 1.4-5 1.9" />
  </g>,
  "#00162b",
);
const chat = tool(<path d="M2 3h8v5H5L3 10V8H2z" fill="currentColor" />, "#7a3fbf");
const doc = tool(<path d="M3 1.5h4l2 2v7H3z" fill="none" stroke="currentColor" strokeWidth="1.3" />, "#00162b");
const pen = tool(<path d="M2 10l1-3 5-5 2 2-5 5z" fill="currentColor" />, "#d0402b");
const people = tool(
  <g fill="currentColor">
    <circle cx="4" cy="4" r="1.8" />
    <circle cx="8.5" cy="4.5" r="1.5" />
    <path d="M1 10c0-2 1.4-3.2 3-3.2S7 8 7 10zM6.8 10c0-1.6 1-2.6 1.9-2.6S11 8.4 11 10z" />
  </g>,
  "#ff6a3d",
);
const card = tool(<rect x="1.5" y="3" width="9" height="6" rx="1.2" fill="currentColor" />, "#635bff");

const agents: DelegateAgent[] = [
  { id: "research", name: "Researcher", model: "Opus 5.5", avatar: asterisk, current: 12, rate: 0.08 },
  { id: "writer", name: "Writer", model: "Sonnet 5.5", avatar: asterisk, rate: 0.03 },
  { id: "coder", name: "Coder", model: "GPT-6 Sol", avatar: ring, current: 8, rate: 0.06 },
  { id: "ops", name: "Ops", model: "Gemini 3.8 Flash", avatar: star, rate: 0.01 },
];

const startTasks = (): DelegateTask[] => [
  { id: "notes", title: "Write release notes", estimate: 12, tools: [doc] },
  { id: "flaky", title: "Fix flaky checkout test", estimate: 20, tools: [branch] },
  { id: "churn", title: "Summarize churn calls", estimate: 15, tools: [chat, doc] },
  { id: "pricing", title: "Update pricing page", estimate: 10, tools: [pen] },
  { id: "crm", title: "Clean up CRM duplicates", estimate: 18, tools: [people] },
  { id: "scan", title: "Competitor scan", estimate: 25, agentId: "research" },
  { id: "auth", title: "Refactor auth", estimate: 30, agentId: "coder" },
  { id: "stripe", title: "Upgrade payment SDK", estimate: 20, tools: [card, branch], agentId: "coder" },
];

/** 14:42 today, so the Busy until times read the same on every visit */
const NOW = (() => {
  const d = new Date();
  d.setHours(14, 42, 0, 0);
  return d.getTime();
})();

export default function Demo() {
  const [tasks, setTasks] = useState<DelegateTask[]>(startTasks);
  const [mode, setMode] = useState<DelegateMode>("manual");
  const wrap = useRef<HTMLDivElement>(null);

  // Plays a drag with the real pointer path: press on the card, glide to the agent, let go
  const dragTo = (taskId: string, agentName: string, start: number, at: (ms: number, fn: () => void) => void) => {
    const id = 7;
    let from = { x: 0, y: 0 };
    let to = { x: 0, y: 0 };
    at(start, () => {
      const el = wrap.current?.querySelector<HTMLElement>(`[data-task="${taskId}"] button`);
      const row = Array.from(wrap.current?.querySelectorAll<HTMLElement>(".ui-at-dlg__row") ?? []).find((r) =>
        r.textContent?.includes(agentName),
      );
      if (!el || !row) return;
      const a = el.getBoundingClientRect();
      const b = row.getBoundingClientRect();
      from = { x: a.left + 30, y: a.top + a.height / 2 };
      to = { x: b.left + b.width * 0.55, y: b.top + 22 };
      el.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, pointerId: id, clientX: from.x, clientY: from.y, button: 0, isPrimary: true }));
    });
    const steps = 24;
    for (let i = 1; i <= steps; i++) {
      at(start + 120 + i * 34, () => {
        const k = i / steps;
        const e = 1 - Math.pow(1 - k, 3);
        window.dispatchEvent(
          new PointerEvent("pointermove", { bubbles: true, pointerId: id, clientX: from.x + (to.x - from.x) * e, clientY: from.y + (to.y - from.y) * e - Math.sin(k * Math.PI) * 24 }),
        );
      });
    }
    at(start + 120 + steps * 34 + 500, () =>
      window.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, pointerId: id, clientX: to.x, clientY: to.y })),
    );
  };

  useEffect(() => {
    const timers: number[] = [];
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));
    const cycle = () => {
      setTasks(startTasks());
      setMode("manual");
      dragTo("notes", "Writer", 1200, at);
      dragTo("flaky", "Coder", 3800, at);
      dragTo("stripe", "Ops", 6400, at);
      at(9200, () => setMode("auto"));
      at(LOOP_MS, cycle);
    };
    cycle();
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div ref={wrap} style={{ width: "100%", display: "grid", placeItems: "center" }}>
      <DelegateBoard
        agents={agents}
        tasks={tasks}
        now={NOW}
        mode={mode}
        onModeChange={setMode}
        onAssign={(taskId, agentId) =>
          setTasks((list) => {
            // A moved task joins the end of its new queue
            const task = list.find((t) => t.id === taskId);
            if (!task) return list;
            return [...list.filter((t) => t.id !== taskId), { ...task, agentId }];
          })
        }
      />
    </div>
  );
}
