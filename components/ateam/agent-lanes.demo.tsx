import { useEffect, useRef, useState, type ReactNode } from "react";
import { AgentLanes, type LaneAgent, type LaneTask } from "./agent-lanes";

const MIN = 60_000;
/** The demo clock runs 30 times faster than real time, so the lanes visibly slide */
const SPEED = 30;
const LOOP_MS = 22_000;

const mark = (children: ReactNode, color: string) => (
  <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false" style={{ color }}>
    {children}
  </svg>
);
const Asterisk = (c: string) =>
  mark(
    <path stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" d="M8 2v12M2.8 5l10.4 6M2.8 11l10.4-6" />,
    c,
  );
const Ring = (c: string) =>
  mark(<circle cx="8" cy="8" r="5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeDasharray="5 2.6" />, c);
const Star = (c: string) =>
  mark(<path fill="currentColor" d="M8 1.5c.5 3.6 2.9 6 6.5 6.5-3.6.5-6 2.9-6.5 6.5-.5-3.6-2.9-6-6.5-6.5 3.6-.5 6-2.9 6.5-6.5Z" />, c);

const tool = (d: ReactNode, color: string) => (
  <svg viewBox="0 0 12 12" width="11" height="11" aria-hidden="true" focusable="false" style={{ color }}>
    {d}
  </svg>
);
const Web = tool(<circle cx="6" cy="6" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.4" />, "#1a6fd1");
const Doc = tool(<path d="M3 1.5h4l2 2v7H3z" fill="none" stroke="currentColor" strokeWidth="1.3" />, "#00162b");
const Chat = tool(<path d="M2 3h8v5H5L3 10V8H2z" fill="currentColor" />, "#7a3fbf");
const Pen = tool(<path d="M2 10l1-3 5-5 2 2-5 5z" fill="currentColor" />, "#d0402b");
const Key = tool(
  <g fill="none" stroke="currentColor" strokeWidth="1.4">
    <circle cx="4" cy="6" r="2" />
    <path d="M6 6h4.5M9 6v2" />
  </g>,
  "#635bff",
);
const Branch = tool(
  <g fill="none" stroke="currentColor" strokeWidth="1.3">
    <circle cx="3.5" cy="3" r="1.3" />
    <circle cx="3.5" cy="9" r="1.3" />
    <circle cx="8.5" cy="4.5" r="1.3" />
    <path d="M3.5 4.3v3.4M8.5 5.8c0 2-5 1.4-5 1.9" />
  </g>,
  "#00162b",
);
const Sync = tool(<path d="M2.5 6a3.5 3.5 0 0 1 6-2.4M9.5 6a3.5 3.5 0 0 1-6 2.4M8 1.5v2.3h-2.3M4 10.5V8.2h2.3" fill="none" stroke="currentColor" strokeWidth="1.3" />, "#ff6a3d");

const agents: LaneAgent[] = [
  { id: "research", name: "Researcher", model: "Opus 5.5", avatar: Asterisk("#c8553d") },
  { id: "writer", name: "Writer", model: "Sonnet 5.5", avatar: Asterisk("#c8553d") },
  { id: "review", name: "Reviewer", model: "GPT-6 Sol", avatar: Ring("#00162b") },
  { id: "ops", name: "Ops", model: "Gemini 3.8 Flash", avatar: Star("#3a6fd8") },
];

function startTasks(t0: number): LaneTask[] {
  const at = (m: number) => t0 - m * MIN;
  return [
    {
      id: "r1", agentId: "research", title: "Competitor pricing", status: "done", start: at(29), end: at(18),
      handoffTo: "w1", tools: [Web, Doc],
      summary: ["Checked 6 competitors", "Collected plans and prices", "Handed the table to the Writer"],
    },
    {
      id: "r2", agentId: "research", title: "Customer interviews", status: "running", start: at(10),
      tools: [Doc, Chat], summary: ["Read 14 interview notes", "Grouping quotes by theme"],
    },
    {
      id: "w1", agentId: "writer", title: "Draft pricing page", status: "running", start: at(17.5),
      tools: [Pen, Doc], summary: ["Outlined the page", "Writing plan copy and FAQ"],
    },
    {
      id: "v1", agentId: "review", title: "PR #448822 billing", status: "done", start: at(34), end: at(23),
      summary: ["Read 12 changed files", "214 tests passed", "Left 3 comments"],
    },
    {
      id: "o1", agentId: "ops", title: "Sync CRM", status: "failed", start: at(29), end: at(22), tools: [Sync],
      summary: ["Loaded 18,240 contacts", "Stopped at the API rate limit"],
    },
    {
      id: "o2", agentId: "ops", title: "Rotate API keys", status: "waiting", start: at(14), tools: [Key, Branch],
      ask: "Rotate the production payment and model API keys? Jobs reconnect in ~30 s.",
      summary: ["Listed 4 keys older than 90 days", "Prepared the new keys"],
    },
  ];
}

export default function Demo() {
  const base = useRef(Date.now());
  const [now, setNow] = useState(base.current);
  const [tasks, setTasks] = useState<LaneTask[]>(() => startTasks(base.current));
  const wrap = useRef<HTMLDivElement>(null);

  // Fast clock + the story: the Writer finishes and hands over to the Reviewer,
  // then someone approves the key rotation. The loop starts over every LOOP_MS.
  useEffect(() => {
    let real0 = performance.now();
    const tick = window.setInterval(() => setNow(base.current + (performance.now() - real0) * SPEED), 80);
    const timers: number[] = [];
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));
    const sim = (ms: number) => base.current + ms * SPEED;
    const cycle = () => {
      real0 = performance.now();
      setNow(base.current);
      setTasks(startTasks(base.current));
      at(4000, () =>
        setTasks((list) => [
          ...list.map((t) =>
            t.id === "w1"
              ? { ...t, status: "done" as const, end: sim(4000), handoffTo: "v2", summary: ["Outlined the page", "Wrote plan copy and FAQ"] }
              : t,
          ),
          {
            id: "v2", agentId: "review", title: "Review pricing copy", status: "running", start: sim(4000) + 0.5 * MIN,
            tools: [Doc], summary: ["Reading the draft", "Checking prices against the table"],
          },
        ]),
      );
      at(9000, () => wrap.current?.querySelector<HTMLButtonElement>('button[aria-haspopup="dialog"]')?.click());
      at(11800, () => wrap.current?.querySelector<HTMLButtonElement>("[data-approve]")?.click());
      at(LOOP_MS, cycle);
    };
    cycle();
    return () => {
      window.clearInterval(tick);
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  const decide = (id: string, status: LaneTask["status"]) =>
    setTasks((list) => list.map((t) => (t.id === id ? { ...t, status, ...(status === "failed" ? { end: now } : {}) } : t)));

  return (
    <div ref={wrap} style={{ width: "100%", display: "grid", placeItems: "center" }}>
      <AgentLanes
        agents={agents}
        tasks={tasks}
        now={now}
        onApprove={(t) => decide(t.id, "running")}
        onReject={(t) => decide(t.id, "failed")}
        onOpen={() => {}}
      />
    </div>
  );
}
