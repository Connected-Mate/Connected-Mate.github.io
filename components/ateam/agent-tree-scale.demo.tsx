import { useEffect, useMemo, useRef, useState } from "react";
import { AgentTreeScale, type ScaleNode, type ScaleStatus } from "./agent-tree-scale";

/* A live organisation of agents, made up once per size and then kept moving:
   agents start, finish, ask for help or fail, chiefs spawn new teams, costs climb. */

type Size = "team" | "org" | "fleet";
const SIZES: { id: Size; label: string; agents: number }[] = [
  { id: "team", label: "≈ 60 agents", agents: 60 },
  { id: "org", label: "≈ 1,200", agents: 1200 },
  { id: "fleet", label: "5,000", agents: 5000 },
];
const TICK_MS = 800;
const SPAWN_EVERY = 8;

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const AREAS = ["Research", "Content", "Engineering", "Data", "Growth", "Design", "Quality", "Outreach", "Pricing", "Support", "Legal", "Ops"];
const MARKETS = ["France", "Germany", "Spain", "Italy", "Benelux", "Nordics", "UK", "Swiss", "Iberia", "Poland", "Austria", "Ireland"];
const ROLES = ["Researcher", "Writer", "Coder", "Scraper", "Analyst", "Reviewer", "Planner", "Tester", "Designer", "Translator", "Monitor", "Editor"];
const TASKS = [
  "Compare the prices of five competitors",
  "Write the copy for the three plans",
  "Build the page and wire up checkout",
  "Summarise 120 reviews that mention price",
  "Cluster the interview notes by theme",
  "Draft the launch announcement",
  "Check the numbers in the forecast sheet",
  "Translate the help pages",
  "Test the sign-up flow on phones",
  "Read the changelog and list breaking changes",
  "Answer the 40 oldest support tickets",
  "Polish the onboarding e-mails",
];
const MODELS_AGENT = ["Sonnet 5.5", "Sonnet 5.5", "Haiku 5.5", "Haiku 5.5", "Opus 5.5", "GPT-6 Sol", "Gemini 3.8 Flash"];

type M = {
  id: string;
  kind: ScaleNode["kind"];
  name: string;
  model?: string;
  status: ScaleStatus;
  cost: number;
  rate: number;
  startedAt?: number;
  endedAt?: number;
  task?: string;
  children: M[];
  parent: M | null;
  v: number;
  snap?: ScaleNode;
  snapV: number;
};

type World = { root: M; agents: M[]; leafChiefs: M[]; rng: () => number; seq: number; spawned: number; cap: number };

function makeWorld(target: number, seed: number, now: number): World {
  const rng = mulberry32(seed);
  const pick = <T,>(a: T[]) => a[Math.floor(rng() * a.length) % a.length];
  let seq = 0;
  const agents: M[] = [];
  const leafChiefs: M[] = [];
  const node = (kind: M["kind"], name: string, parent: M | null, extra: Partial<M> = {}): M => {
    const m: M = { id: `${kind}-${++seq}`, kind, name, status: "running", cost: 0, rate: 0, children: [], parent, v: 1, snapV: 0, ...extra };
    parent?.children.push(m);
    return m;
  };
  const root = node("root", "Chief of Staff", null, {
    model: "Opus 5.5",
    task: "Ship the spring launch in twelve markets",
    startedAt: now - 47 * 60_000,
    cost: 4.2,
  });
  const c1 = target >= 4000 ? 8 : target >= 1000 ? 6 : 2;
  const c2 = target >= 4000 ? 4 : target >= 1000 ? 3 : 0;
  for (let i = 0; i < c1; i++) {
    const chief = node("chief", `${MARKETS[i % MARKETS.length]} lead`, root, {
      model: "Opus 5.5",
      task: `Run the launch in ${MARKETS[i % MARKETS.length]}`,
      startedAt: now - (30 + rng() * 15) * 60_000,
      cost: 0.6 + rng() * 2,
    });
    if (!c2) leafChiefs.push(chief);
    for (let j = 0; j < c2; j++) {
      const area = AREAS[(i * 3 + j) % AREAS.length];
      const sub = node("chief", `${area} chief`, chief, {
        model: rng() < 0.7 ? "Opus 5.5" : "Sonnet 5.5",
        task: `Coordinate ${area.toLowerCase()} for ${MARKETS[i % MARKETS.length]}`,
        startedAt: now - (10 + rng() * 25) * 60_000,
        cost: 0.2 + rng(),
      });
      if (target >= 4000 && rng() < 0.35) {
        for (let k = 0; k < 2; k++) {
          leafChiefs.push(
            node("chief", `${area} ${k ? "B" : "A"} chief`, sub, {
              model: "Sonnet 5.5",
              task: `Split the ${area.toLowerCase()} work, part ${k + 1}`,
              startedAt: now - (5 + rng() * 20) * 60_000,
              cost: 0.1 + rng() * 0.5,
            }),
          );
        }
      } else leafChiefs.push(sub);
    }
  }
  // teams under every leaf chief, sized so the total lands near the target
  const teamsPer = target >= 1000 ? 5 : 3;
  const totalTeams = leafChiefs.length * teamsPer;
  const avg = target / totalTeams;
  for (const ch of leafChiefs) {
    const count = teamsPer - 1 + Math.floor(rng() * 3);
    for (let t = 0; t < count; t++) {
      const team = node("team", `${pick(AREAS)} team ${t + 1}`, ch, {
        model: "Sonnet 5.5",
        startedAt: now - rng() * 30 * 60_000,
        cost: 0.05 + rng() * 0.2,
      });
      const size = Math.max(3, Math.min(48, Math.round(avg * (0.45 + rng() * 1.1))));
      for (let a = 0; a < size; a++) agents.push(makeAgent(team, a, now));
    }
  }
  function makeAgent(team: M, a: number, at: number): M {
    const r = rng();
    const status: ScaleStatus = r < 0.34 ? "done" : r < 0.74 ? "running" : r < 0.975 ? "idle" : r < 0.988 ? "waiting" : "failed";
    const started = at - rng() * 25 * 60_000;
    return node("agent", `${pick(ROLES)} ${a + 1}`, team, {
      model: pick(MODELS_AGENT),
      task: pick(TASKS),
      status,
      startedAt: status === "idle" ? undefined : started,
      endedAt: status === "done" || status === "failed" ? started + rng() * 10 * 60_000 : undefined,
      cost: status === "idle" ? 0 : rng() * 0.6,
      rate: 0.0008 + rng() * 0.004,
    });
  }
  return { root, agents, leafChiefs, rng, seq, spawned: 0, cap: Math.ceil(target * 0.08) };
}

function touch(m: M | null) {
  for (let p = m; p; p = p.parent) p.v++;
}

/** Fresh objects only along changed paths, so the tree can skip what did not move */
function snapshot(m: M): ScaleNode {
  if (m.snap && m.snapV === m.v) return m.snap;
  const groupStatus: ScaleStatus = m.kind === "agent" ? m.status : "running";
  m.snap = {
    id: m.id,
    kind: m.kind,
    name: m.name,
    model: m.model,
    status: groupStatus,
    cost: m.cost,
    startedAt: m.startedAt,
    endedAt: m.endedAt,
    task: m.task,
    children: m.children.length ? m.children.map(snapshot) : m.kind === "agent" ? undefined : [],
  };
  m.snapV = m.v;
  return m.snap;
}

function step(w: World, now: number, tick: number) {
  const { rng } = w;
  // costs climb for every running agent
  for (const a of w.agents) {
    if (a.status === "running") {
      a.cost += a.rate * (TICK_MS / 1000) * 4;
      touch(a);
    }
  }
  // a handful of agents change state each beat
  const changes = Math.max(2, Math.round(w.agents.length * 0.006));
  for (let i = 0; i < changes; i++) {
    const a = w.agents[Math.floor(rng() * w.agents.length)];
    const r = rng();
    const s = a.status;
    if (s === "idle") {
      a.status = "running";
      a.startedAt = now;
      a.endedAt = undefined;
    } else if (s === "running") {
      if (r < 0.04) a.status = "waiting";
      else if (r < 0.06) {
        a.status = "failed";
        a.endedAt = now;
      } else if (r < 0.7) {
        a.status = "done";
        a.endedAt = now;
      }
    } else if (s === "waiting") {
      if (r < 0.25) a.status = "running";
    } else if (s === "failed") {
      if (r < 0.12) {
        a.status = "running";
        a.startedAt = now;
        a.endedAt = undefined;
      }
    } else if (s === "done" && r < 0.05) {
      a.status = "idle";
      a.startedAt = undefined;
      a.endedAt = undefined;
      a.task = TASKS[Math.floor(rng() * TASKS.length)];
    }
    if (a.status !== s) touch(a);
  }
  // chiefs spawn new teams now and then
  if (tick % SPAWN_EVERY === 0 && w.spawned < w.cap && w.leafChiefs.length) {
    const chief = w.leafChiefs[Math.floor(rng() * w.leafChiefs.length)];
    const team: M = {
      id: `team-${++w.seq}`,
      kind: "team",
      name: `${AREAS[Math.floor(rng() * AREAS.length)]} team ${chief.children.length + 1}`,
      model: "Sonnet 5.5",
      status: "running",
      cost: 0,
      rate: 0,
      startedAt: now,
      children: [],
      parent: chief,
      v: 1,
      snapV: 0,
    };
    chief.children.push(team);
    const size = 4 + Math.floor(rng() * 10);
    for (let i = 0; i < size; i++) {
      const a: M = {
        id: `agent-${++w.seq}`,
        kind: "agent",
        name: `${ROLES[Math.floor(rng() * ROLES.length)]} ${i + 1}`,
        model: MODELS_AGENT[Math.floor(rng() * MODELS_AGENT.length)],
        task: TASKS[Math.floor(rng() * TASKS.length)],
        status: i < 2 ? "running" : "idle",
        startedAt: i < 2 ? now : undefined,
        cost: 0,
        rate: 0.001 + rng() * 0.003,
        children: [],
        parent: team,
        v: 1,
        snapV: 0,
      };
      team.children.push(a);
      w.agents.push(a);
    }
    w.spawned += size;
    touch(chief);
  }
}

export default function Demo() {
  const [size, setSize] = useState<Size>("org");
  const [playing, setPlaying] = useState(true);
  const target = SIZES.find((s) => s.id === size)!.agents;
  const world = useMemo(() => makeWorld(target, 7 + target, Date.now()), [target]);
  const [tree, setTree] = useState<ScaleNode>(() => snapshot(world.root));
  const tick = useRef(0);

  useEffect(() => {
    setTree(snapshot(world.root));
    tick.current = 0;
  }, [world]);

  useEffect(() => {
    if (!playing) return;
    const t = window.setInterval(() => {
      tick.current += 1;
      step(world, Date.now(), tick.current);
      setTree(snapshot(world.root));
    }, TICK_MS);
    return () => window.clearInterval(t);
  }, [world, playing]);

  return (
    <div className="ats-demo">
      <style>{demoCss}</style>
      <div className="ats-demo__bar" role="group" aria-label="Demo">
        <span className="ats-demo__label">Size</span>
        <div className="ats-demo__seg">
          {SIZES.map((s) => (
            <button key={s.id} type="button" aria-pressed={size === s.id} onClick={() => setSize(s.id)}>
              {s.label}
            </button>
          ))}
        </div>
        <button type="button" className="ats-demo__play" aria-pressed={!playing} onClick={() => setPlaying((p) => !p)}>
          {playing ? "Pause live" : "Resume live"}
        </button>
      </div>
      <AgentTreeScale key={size} root={tree} title="Spring launch" height={620} />
    </div>
  );
}

const demoCss = /* css */ `
.ats-demo { width: 100%; max-width: 1280px; min-width: 0; display: grid; gap: 12px; font-family: "Avenir Next", Avenir, system-ui, sans-serif;
  --d-ink: #00162b; --d-muted: rgba(0, 22, 43, 0.54); --d-line: #dae2ec; --d-panel: #ffffff; --d-soft: rgba(26, 62, 112, 0.06); }
:where(.dark, [data-theme="dark"]) .ats-demo { --d-ink: rgba(255, 255, 255, 0.94); --d-muted: rgba(255, 255, 255, 0.56);
  --d-line: rgba(255, 255, 255, 0.12); --d-panel: #16345c; --d-soft: rgba(255, 255, 255, 0.07); }
.ats-demo__bar { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
.ats-demo__label { font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.09em; font-weight: 600; color: var(--d-muted); }
.ats-demo__seg { display: inline-flex; padding: 2px; border-radius: 10px; background: var(--d-soft); border: 1px solid var(--d-line); }
.ats-demo button { font: inherit; cursor: pointer; }
.ats-demo__seg button { height: 28px; padding: 0 12px; border: 0; border-radius: 8px; background: transparent; color: var(--d-muted); font-weight: 600; font-size: 12.5px; }
.ats-demo__seg button[aria-pressed="true"] { background: var(--d-panel); color: var(--d-ink); box-shadow: 0 0 0 1px var(--d-line); }
.ats-demo__play { margin-left: auto; height: 30px; padding: 0 12px; border-radius: 10px; border: 1px solid var(--d-line); background: var(--d-panel); color: var(--d-ink); font-weight: 600; font-size: 12.5px; }
.ats-demo :focus-visible { outline: none; box-shadow: 0 0 0 3px #8fbdf2; }
`;
