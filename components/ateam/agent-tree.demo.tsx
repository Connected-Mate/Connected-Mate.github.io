import { useEffect, useRef, useState, type ReactNode } from "react";
import { AgentTree, type TreeAgent } from "./agent-tree";

/** The demo clock runs 6 times faster than real time */
const SPEED = 6;
const LOOP_MS = 21_000;

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
const web = tool(<circle cx="6" cy="6" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.4" />, "#1a6fd1");
const doc = tool(<path d="M3 1.5h4l2 2v7H3z" fill="none" stroke="currentColor" strokeWidth="1.3" />, "#00162b");
const chat = tool(<path d="M2 3h8v5H5L3 10V8H2z" fill="currentColor" />, "#7a3fbf");
const pen = tool(<path d="M2 10l1-3 5-5 2 2-5 5z" fill="currentColor" />, "#d0402b");
const code = tool(<path d="M4.5 3 1.5 6l3 3M7.5 3l3 3-3 3" fill="none" stroke="currentColor" strokeWidth="1.4" />, "#00162b");
const card = tool(<rect x="1.5" y="3" width="9" height="6" rx="1.2" fill="currentColor" />, "#635bff");
const stars = tool(<path d="M6 1.5l1.3 2.9 3.2.3-2.4 2.1.7 3.1L6 8.3 3.2 9.9l.7-3.1L1.5 4.7l3.2-.3z" fill="currentColor" />, "#ff6a3d");

type Script = {
  id: string;
  parent?: string;
  name: string;
  model: string;
  avatar: ReactNode;
  tools: ReactNode[];
  task: string;
  start: number;
  end: number;
  /** cost per simulated second */
  rate: number;
  failAt?: number;
  error?: string;
  waitFrom?: number;
  ask?: string;
};

const SCRIPT: Script[] = [
  { id: "lead", name: "Orchestrator", model: "Opus 5.5", avatar: asterisk, tools: [chat, doc, code], task: "Launch the new pricing page by Friday", start: 0, end: 100, rate: 0.0035 },
  { id: "research", parent: "lead", name: "Researcher", model: "Sonnet 5.5", avatar: asterisk, tools: [doc, chat], task: "Compare the pricing of five competitors", start: 4, end: 45, rate: 0.0044 },
  { id: "scraper", parent: "research", name: "Scraper", model: "Gemini 3.8 Flash", avatar: star, tools: [web], task: "Read the pricing pages of Linear, Notion and three more", start: 8, end: 30, rate: 0.00136 },
  { id: "analyst", parent: "research", name: "Analyst", model: "Sonnet 5.5", avatar: asterisk, tools: [stars, doc], task: "Summarize 120 G2 reviews that mention price", start: 18, end: 45, rate: 0.003 },
  { id: "writer", parent: "lead", name: "Writer", model: "Sonnet 5.5", avatar: asterisk, tools: [doc, pen], task: "Write the copy for the three plans", start: 6, end: 75, rate: 0.0033, waitFrom: 40, ask: "Show yearly prices with the 20% discount, or monthly prices only?" },
  { id: "coder", parent: "lead", name: "Coder", model: "GPT-6 Sol", avatar: ring, tools: [code, card, pen], task: "Build the page and wire up checkout", start: 8, end: 88, rate: 0.006 },
  { id: "tester", parent: "coder", name: "Tester", model: "GPT-6 Mini", avatar: ring, tools: [code], task: "Write and run the checkout tests", start: 22, end: 49, rate: 0.0015, failAt: 49, error: "2 of 14 checkout tests failed: coupons over 100% are accepted." },
  { id: "tester-2", parent: "coder", name: "Tester", model: "GPT-6 Mini", avatar: ring, tools: [code], task: "Fix the coupon test and run all again", start: 52, end: 78, rate: 0.0015 },
];

/** The whole tree at simulated second `s`. The Writer waits from 40 s until someone approves */
function treeAt(s: number, base: number, approvedAt: number | null): TreeAgent {
  const nodes = new Map<string, TreeAgent>();
  for (const a of SCRIPT) {
    if (s < a.start) continue;
    let end = a.end;
    let status: TreeAgent["status"] = s >= end ? (a.failAt ? "failed" : "done") : "running";
    let worked = Math.min(s, end) - a.start;
    if (a.waitFrom != null && s >= a.waitFrom) {
      if (approvedAt == null) {
        status = "waiting";
        worked = a.waitFrom - a.start;
        end = Infinity;
      } else {
        end = approvedAt + (a.end - a.waitFrom) / 2;
        status = s >= end ? "done" : "running";
        worked = a.waitFrom - a.start + Math.max(0, Math.min(s, end) - approvedAt);
      }
    }
    nodes.set(a.id, {
      id: a.id,
      name: a.name,
      model: a.model,
      avatar: a.avatar,
      tools: a.tools,
      task: a.task,
      status,
      ask: a.ask,
      error: a.error,
      cost: Math.round(worked * a.rate * 10000) / 10000,
      started: base + a.start * 1000,
      ended: status === "done" || status === "failed" ? base + Math.min(end, s) * 1000 : undefined,
      children: [],
    });
  }
  for (const a of SCRIPT) {
    const node = nodes.get(a.id);
    if (node && a.parent) nodes.get(a.parent)?.children?.push(node);
  }
  // The orchestrator only finishes once every sub-agent is done
  const lead = nodes.get("lead")!;
  const busy = [...nodes.values()].some((n) => n.id !== "lead" && (n.status === "running" || n.status === "waiting"));
  if (busy && lead.status === "done") {
    lead.status = "running";
    lead.ended = undefined;
  }
  return lead;
}

export default function Demo() {
  const base = useRef(Date.now());
  const [sim, setSim] = useState(0);
  const [approvedAt, setApprovedAt] = useState<number | null>(null);
  const [collapsed, setCollapsed] = useState<string[]>([]);
  const wrap = useRef<HTMLDivElement>(null);
  const simRef = useRef(0);
  simRef.current = sim;

  useEffect(() => {
    let real0 = performance.now();
    const tick = window.setInterval(() => setSim(((performance.now() - real0) / 1000) * SPEED), 250);
    const timers: number[] = [];
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));
    const cycle = () => {
      real0 = performance.now();
      base.current = Date.now();
      setSim(0);
      setApprovedAt(null);
      setCollapsed([]);
      at(7600, () =>
        wrap.current?.querySelector<HTMLButtonElement>('button[aria-haspopup="dialog"][data-status="waiting"]')?.click(),
      );
      at(8800, () =>
        Array.from(wrap.current?.querySelectorAll<HTMLButtonElement>('[role="dialog"] button') ?? [])
          .find((b) => b.textContent === "Approve")
          ?.click(),
      );
      at(10400, () =>
        wrap.current?.querySelector<HTMLButtonElement>('button[aria-label^="Hide 2 sub-agents of Researcher"]')?.click(),
      );
      at(18200, () => setCollapsed([]));
      at(LOOP_MS, cycle);
    };
    cycle();
    return () => {
      window.clearInterval(tick);
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  const s = Math.min(sim, 110);
  return (
    <div ref={wrap} style={{ width: "100%", display: "grid", placeItems: "center" }}>
      <AgentTree
        root={treeAt(s, base.current, approvedAt)}
        now={base.current + s * 1000}
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        onResolve={(agent, action) => {
          if (agent.id === "writer" && action === "approve") setApprovedAt(simRef.current);
        }}
        onSelect={() => {}}
      />
    </div>
  );
}
