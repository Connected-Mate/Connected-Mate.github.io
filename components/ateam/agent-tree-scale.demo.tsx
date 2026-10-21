import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { AgentTreeScale, type ScaleAgent, type ScaleAgentStatus, type ScaleResolveAction } from "./agent-tree-scale";

/* The Agent Tree crew, grown into an organisation: a Chief of Staff, chiefs per area,
   teams of Researchers, Writers, Coders… Agents start, finish, ask you, fail; chiefs spawn teams. */

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

type Role = { name: string; model: string; avatar: ReactNode; tools: ReactNode[]; tasks: string[]; ask?: string; error?: string };
const ROLES: Role[] = [
  { name: "Researcher", model: "Sonnet 5.5", avatar: asterisk, tools: [doc, chat], tasks: ["Compare the pricing of five competitors", "Collect what customers say about price"] },
  { name: "Scraper", model: "Gemini 3.8 Flash", avatar: star, tools: [web], tasks: ["Read the pricing pages of Linear, Notion and three more", "Pull last year's plan changes"] },
  { name: "Analyst", model: "Sonnet 5.5", avatar: asterisk, tools: [stars, doc], tasks: ["Summarize 120 G2 reviews that mention price", "Find which plan sells best by country"] },
  {
    name: "Writer",
    model: "Sonnet 5.5",
    avatar: asterisk,
    tools: [doc, pen],
    tasks: ["Write the copy for the three plans", "Draft the launch e-mail"],
    ask: "Show yearly prices with the 20% discount, or monthly prices only?",
  },
  { name: "Coder", model: "GPT-6 Sol", avatar: ring, tools: [code, card, pen], tasks: ["Build the page and wire up checkout", "Add the plan switcher"] },
  {
    name: "Tester",
    model: "GPT-6 Mini",
    avatar: ring,
    tools: [code],
    tasks: ["Write and run the checkout tests", "Test the page on phones"],
    error: "2 of 14 checkout tests failed: coupons over 100% are accepted.",
  },
];
const AREAS = ["Research", "Copy", "Checkout", "Design", "Data", "Quality", "Growth", "Support"];
const MARKETS = ["France", "Germany", "Spain", "Italy", "Benelux", "Nordics", "UK", "Switzerland"];

const SIZES = [
  { id: 60, label: "60" },
  { id: 1200, label: "1,200" },
  { id: 5000, label: "5,000" },
] as const;
type Size = (typeof SIZES)[number]["id"];

type M = Omit<ScaleAgent, "children"> & {
  rate: number;
  role?: Role;
  waitedAt?: number;
  parent: M | null;
  kids: M[];
  v: number;
  snap?: ScaleAgent;
  snapV: number;
};
type World = { root: M; agents: M[]; byId: Map<string, M>; chiefs: M[]; rng: () => number; seq: number; spawned: number; cap: number };

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeWorld(target: Size, now: number): World {
  const rng = mulberry32(11 + target);
  const byId = new Map<string, M>();
  const agents: M[] = [];
  const leafChiefs: M[] = [];
  let seq = 0;
  const add = (parent: M | null, p: Partial<M> & Pick<M, "name" | "task" | "kind">): M => {
    const m: M = { id: `${p.kind}-${++seq}`, status: "running", cost: 0, rate: 0, parent, kids: [], v: 1, snapV: 0, ...p };
    parent?.kids.push(m);
    byId.set(m.id, m);
    return m;
  };
  const root = add(null, { kind: "root", name: "Chief of Staff", model: "Opus 5.5", avatar: asterisk, tools: [chat, doc, code], task: "Launch the new pricing page by Friday", started: now - 9 * 60_000, cost: 0.42 });
  const chiefsN = target === 60 ? 2 : target === 1200 ? 6 : 8;
  const subN = target === 60 ? 0 : target === 1200 ? 3 : 4;
  const teamsN = target === 60 ? 2 : target === 1200 ? 4 : 5;
  for (let c = 0; c < chiefsN; c++) {
    const chief = add(root, {
      kind: "chief",
      name: target === 60 ? ["Research chief", "Build chief"][c] : `${MARKETS[c]} lead`,
      model: "Opus 5.5",
      avatar: ring,
      task: target === 60 ? ["Find the right prices and the words for them", "Ship the page and its checkout"][c] : `Run the launch in ${MARKETS[c]}`,
      started: now - (6 + rng() * 3) * 60_000,
      cost: 0.1 + rng() * 0.2,
    });
    if (!subN) leafChiefs.push(chief);
    for (let s = 0; s < subN; s++) {
      const area = AREAS[(c + s) % AREAS.length];
      leafChiefs.push(
        add(chief, {
          kind: "chief",
          name: `${area} chief`,
          model: "Opus 5.5",
          task: `Coordinate ${area.toLowerCase()} for ${MARKETS[c]}`,
          started: now - (3 + rng() * 4) * 60_000,
          cost: 0.05 + rng() * 0.1,
        }),
      );
    }
  }
  const perTeam = target / (leafChiefs.length * teamsN);
  for (const chief of leafChiefs) {
    for (let t = 0; t < teamsN; t++) {
      const area = target === 60 ? (chief.name.startsWith("Research") ? ["Pricing research", "Copy"][t] : ["Checkout", "Quality"][t]) : `${AREAS[Math.floor(rng() * AREAS.length)]} team ${t + 1}`;
      const team = add(chief, { kind: "team", name: area, model: "Sonnet 5.5", task: `Team of ${chief.name.replace(/ (chief|lead)$/, "")}`, started: now - rng() * 5 * 60_000, cost: 0.02 });
      const n = Math.max(3, Math.round(perTeam * (target === 60 ? 1 : 0.6 + rng() * 0.8)));
      team.task = `${n} agents on ${area.toLowerCase()}`;
      for (let a = 0; a < n; a++) agents.push(makeAgent(team, a, now));
    }
  }
  function makeAgent(team: M, a: number, at: number): M {
    const role = ROLES[Math.floor(rng() * ROLES.length)];
    const r = rng();
    const status: ScaleAgentStatus = r < 0.3 ? "done" : r < 0.72 ? "running" : r < 0.95 ? "queued" : r < 0.98 && role.ask ? "waiting" : role.error ? "failed" : "running";
    const started = at - rng() * 6 * 60_000;
    return add(team, {
      kind: "agent",
      name: `${role.name} ${a + 1}`,
      model: role.model,
      avatar: role.avatar,
      tools: role.tools,
      task: role.tasks[Math.floor(rng() * role.tasks.length)],
      ask: role.ask,
      error: role.error,
      role,
      status,
      started: status === "queued" ? undefined : started,
      ended: status === "done" || status === "failed" ? started + rng() * 3 * 60_000 : undefined,
      cost: status === "queued" ? 0 : Math.round(rng() * 0.3 * 10000) / 10000,
      rate: 0.0015 + rng() * 0.0045,
      waitedAt: status === "waiting" ? at : undefined,
    });
  }
  // The story of Agent Tree, at every size: a Writer asks you, a Tester failed
  const writer = agents.find((a) => a.role?.ask);
  if (writer) Object.assign(writer, { status: "waiting", waitedAt: at0(), ended: undefined, started: now - 90_000 });
  const tester = agents.find((a) => a.role?.error);
  if (tester) Object.assign(tester, { status: "failed", ended: now - 20_000, started: now - 80_000 });
  function at0() {
    return now + 60_000;
  }
  return { root, agents, byId, chiefs: leafChiefs, rng, seq, spawned: 0, cap: Math.ceil(target * 0.1) };
}

const touch = (m: M | null) => {
  for (let p = m; p; p = p.parent) p.v++;
};

/** New objects only along changed paths: the tree skips work for branches that did not move */
function snapshot(m: M): ScaleAgent {
  if (m.snap && m.snapV === m.v) return m.snap;
  const { rate: _r, role: _ro, waitedAt: _w, parent: _p, kids, v: _v, snap: _s, snapV: _sv, ...rest } = m;
  m.snap = { ...rest, children: kids.length ? kids.map(snapshot) : rest.kind === "agent" ? undefined : [] };
  m.snapV = m.v;
  return m.snap;
}

function step(w: World, now: number, tick: number) {
  const { rng } = w;
  for (const a of w.agents) {
    if (a.status === "running") {
      a.cost = Math.round(((a.cost ?? 0) + a.rate) * 10000) / 10000;
      touch(a);
    }
  }
  const changes = Math.max(2, Math.round(w.agents.length * 0.008));
  for (let i = 0; i < changes; i++) {
    const a = w.agents[Math.floor(rng() * w.agents.length)];
    const before = a.status;
    const r = rng();
    if (a.status === "queued") {
      a.status = "running";
      a.started = now;
    } else if (a.status === "running") {
      if (r < 0.04 && a.role?.ask) {
        a.status = "waiting";
        a.waitedAt = now;
      } else if (r < 0.07 && a.role?.error) {
        a.status = "failed";
        a.ended = now;
      } else if (r < 0.6) {
        a.status = "done";
        a.ended = now;
      }
    } else if (a.status === "done" && r < 0.08) {
      // the agent picks up its next task
      a.status = "queued";
      a.started = undefined;
      a.ended = undefined;
      a.task = a.role?.tasks[Math.floor(rng() * a.role.tasks.length)] ?? a.task;
    }
    if (a.status !== before) touch(a);
  }
  // Nobody waits forever in the demo: after 45 s someone else decides
  for (const a of w.agents) {
    if (a.status === "waiting" && a.waitedAt && now - a.waitedAt > 45_000) {
      a.status = "running";
      touch(a);
    }
  }
  // Chiefs start new teams now and then
  if (tick % 12 === 0 && w.spawned < w.cap) {
    const chief = w.chiefs[Math.floor(rng() * w.chiefs.length)];
    const team: M = {
      id: `team-${++w.seq}`,
      kind: "team",
      name: `${AREAS[Math.floor(rng() * AREAS.length)]} team ${chief.kids.length + 1}`,
      model: "Sonnet 5.5",
      task: "",
      status: "running",
      started: now,
      cost: 0,
      rate: 0,
      parent: chief,
      kids: [],
      v: 1,
      snapV: 0,
    };
    chief.kids.push(team);
    w.byId.set(team.id, team);
    const n = 3 + Math.floor(rng() * 5);
    team.task = `${n} agents, just started`;
    for (let i = 0; i < n; i++) {
      const role = ROLES[Math.floor(rng() * ROLES.length)];
      const a: M = {
        id: `agent-${++w.seq}`,
        kind: "agent",
        name: `${role.name} ${i + 1}`,
        model: role.model,
        avatar: role.avatar,
        tools: role.tools,
        task: role.tasks[0],
        ask: role.ask,
        error: role.error,
        role,
        status: i < 2 ? "running" : "queued",
        started: i < 2 ? now : undefined,
        cost: 0,
        rate: 0.0015 + rng() * 0.004,
        parent: team,
        kids: [],
        v: 1,
        snapV: 0,
      };
      team.kids.push(a);
      w.agents.push(a);
      w.byId.set(a.id, a);
    }
    w.spawned += n;
    touch(chief);
  }
}

export default function Demo() {
  const [size, setSize] = useState<Size>(60);
  const world = useMemo(() => makeWorld(size, Date.now()), [size]);
  const [tree, setTree] = useState<ScaleAgent>(() => snapshot(world.root));
  const tick = useRef(0);

  useEffect(() => {
    setTree(snapshot(world.root));
    tick.current = 0;
    const id = window.setInterval(() => {
      tick.current += 1;
      step(world, Date.now(), tick.current);
      setTree(snapshot(world.root));
    }, 1000);
    return () => window.clearInterval(id);
  }, [world]);

  const onResolve = (agent: ScaleAgent, action: ScaleResolveAction) => {
    const m = world.byId.get(agent.id);
    if (!m) return;
    if (action === "approve" || action === "retry") {
      m.status = "running";
      m.ended = undefined;
      if (action === "retry") m.started = Date.now();
    } else {
      m.status = "stopped";
      m.ended = Date.now();
    }
    touch(m);
    setTree(snapshot(world.root));
  };

  return (
    <div style={{ width: "100%", display: "grid", placeItems: "center", gap: 10 }}>
      <AgentTreeScale key={size} root={tree} title="Agents" onResolve={onResolve} />
      <div className="ats-size" role="group" aria-label="Demo size">
        <style>{sizeCss}</style>
        Try it with
        {SIZES.map((s) => (
          <button key={s.id} type="button" aria-pressed={size === s.id} onClick={() => setSize(s.id)}>
            {s.label}
          </button>
        ))}
        agents
      </div>
    </div>
  );
}

const sizeCss = /* css */ `
.ats-size { display: flex; align-items: center; gap: 4px; font: 12px/1.4 "Avenir Next", Avenir, system-ui, sans-serif; color: rgba(0, 22, 43, 0.54); }
:where(.dark, [data-theme="dark"]) .ats-size { color: rgba(255, 255, 255, 0.56); }
.ats-size button { font: inherit; color: inherit; border: 0; background: transparent; padding: 2px 6px; border-radius: 6px; cursor: pointer; }
.ats-size button:hover { background: rgba(26, 62, 112, 0.06); }
.ats-size button[aria-pressed="true"] { color: #1a3e70; font-weight: 600; text-decoration: underline; text-underline-offset: 3px; }
:where(.dark, [data-theme="dark"]) .ats-size button[aria-pressed="true"] { color: #c1daff; }
.ats-size button:focus-visible { outline: none; box-shadow: 0 0 0 3px #8fbdf2; }
`;
