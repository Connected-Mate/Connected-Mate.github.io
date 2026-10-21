"use client";

import {
  memo,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";

export type ScaleStatus = "running" | "waiting" | "done" | "failed" | "idle";
export type ScaleKind = "root" | "chief" | "team" | "agent";

export type ScaleNode = {
  id: string;
  kind: ScaleKind;
  name: string;
  model?: string;
  status: ScaleStatus;
  /** This node's own spend – branches are added up for you */
  cost?: number;
  /** ms timestamps */
  startedAt?: number;
  endedAt?: number;
  /** What this node was asked to do */
  task?: string;
  children?: ScaleNode[];
};

export type ScaleFilter = "all" | ScaleStatus;
export type ScaleView = "auto" | "map" | "list";

export type AgentTreeScaleProps = {
  root: ScaleNode;
  /** Branches open on first render. Without it, branches open until about 40 cards show */
  defaultExpanded?: string[];
  /** "auto" shows the map when there is room, the list on narrow screens */
  defaultView?: ScaleView;
  /** Height of the map or list, in px */
  height?: number;
  onSelect?: (node: ScaleNode) => void;
  onFocusChange?: (node: ScaleNode) => void;
  now?: number;
  formatCost?: (amount: number) => string;
  title?: string;
  className?: string;
};

/* ---------- constants ---------- */

const STATUS_ORDER: ScaleStatus[] = ["waiting", "failed", "running", "idle", "done"];
const BAR_ORDER: ScaleStatus[] = ["done", "running", "waiting", "failed", "idle"];
const WORD: Record<ScaleStatus, string> = {
  running: "Running",
  waiting: "Needs you",
  done: "Done",
  failed: "Failed",
  idle: "Idle",
};
const KIND_WORD: Record<ScaleKind, string> = { root: "Lead", chief: "Chief of staff", team: "Team", agent: "Agent" };
const FILTERS: { id: ScaleFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "waiting", label: "Needs you" },
  { id: "failed", label: "Failed" },
  { id: "running", label: "Running" },
  { id: "idle", label: "Idle" },
  { id: "done", label: "Done" },
];

const W: Record<ScaleKind, number> = { root: 296, chief: 272, team: 256, agent: 232 };
const H_GROUP = 146;
const H_AGENT = 120;
const DOT = 14;
const DOT_COLS = 16;
const DOT_MAX = 48;
const COL_GAP = 96;
const ROW_GAP = 18;
const GRID_GAP = 14;
const ROW_H = 60;
const LOD_FULL = 0.62;
const LOD_LITE = 0.3;
const K_MIN = 0.005;
const K_MAX = 2;
const BUDGET = 40;
const BUDGET_START = 8;
const NARROW = 600;

const teamH = (n: number) => 106 + Math.ceil(Math.max(1, Math.min(n, DOT_MAX)) / DOT_COLS) * DOT;
const nf = new Intl.NumberFormat("en-US");
const defaultCost = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

function duration(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ${String(s % 60).padStart(2, "0")}s`;
  return `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, "0")}m`;
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

/* ---------- index: counts added up once per data change ---------- */

type Counts = Record<ScaleStatus, number>;
type Entry = {
  node: ScaleNode;
  parent: string | null;
  depth: number;
  agents: number;
  c: Counts;
  cost: number;
  started?: number;
};
type Index = { byId: Map<string, Entry>; list: Entry[]; waiting: string[]; root: Entry };

function buildIndex(root: ScaleNode): Index {
  const byId = new Map<string, Entry>();
  const list: Entry[] = [];
  const waiting: string[] = [];
  const walk = (n: ScaleNode, parent: string | null, depth: number): Entry => {
    const e: Entry = {
      node: n,
      parent,
      depth,
      agents: 0,
      c: { running: 0, waiting: 0, done: 0, failed: 0, idle: 0 },
      cost: n.cost ?? 0,
      started: n.startedAt,
    };
    byId.set(n.id, e);
    list.push(e);
    if (n.kind === "agent") {
      e.agents = 1;
      e.c[n.status] += 1;
      if (n.status === "waiting") waiting.push(n.id);
    }
    for (const ch of n.children ?? []) {
      const ce = walk(ch, n.id, depth + 1);
      e.agents += ce.agents;
      e.cost += ce.cost;
      for (const s of STATUS_ORDER) e.c[s] += ce.c[s];
      if (ce.started !== undefined && (e.started === undefined || ce.started < e.started)) e.started = ce.started;
    }
    return e;
  };
  const r = walk(root, null, 0);
  return { byId, list, waiting, root: r };
}

const shows = (e: Entry, f: ScaleFilter) => f === "all" || e.c[f] > 0;
const isGroup = (n: ScaleNode) => n.kind !== "agent";
/** The colour a branch reads as: what needs a person first */
function tone(e: Entry): ScaleStatus {
  if (!isGroup(e.node)) return e.node.status;
  return needTone(e);
}
function needTone(e: Entry): ScaleStatus {
  if (e.c.waiting) return "waiting";
  if (e.c.failed) return "failed";
  if (e.c.running) return "running";
  if (e.agents && e.c.done === e.agents) return "done";
  return e.agents ? "idle" : e.node.status;
}

/** Connectors show activity: a branch with anyone at work flows */
function linkTone(e: Entry): ScaleStatus {
  if (!isGroup(e.node)) return e.node.status;
  if (e.c.running) return "running";
  return needTone(e);
}

function ancestors(ix: Index, id: string) {
  const out: string[] = [];
  for (let p = ix.byId.get(id)?.parent ?? null; p; p = ix.byId.get(p)?.parent ?? null) out.push(p);
  return out.reverse();
}

/** Opens a branch, then its sub-chiefs breadth first, while the cards stay under a budget */
function autoExpand(ix: Index, start: string, budget: number, into = new Set<string>()) {
  const s = ix.byId.get(start);
  if (!s) return into;
  const kids = s.node.children ?? [];
  if (kids.length) into.add(start);
  let used = kids.length;
  const queue = s.node.kind === "team" ? [] : [...kids];
  while (queue.length) {
    const n = queue.shift()!;
    const ch = n.children ?? [];
    if (n.kind === "team" || n.kind === "agent" || !ch.length) continue;
    if (used + ch.length > budget) continue;
    into.add(n.id);
    used += ch.length;
    queue.push(...ch);
  }
  return into;
}

/* ---------- layout: left to right, every visible node gets a box ---------- */

type Item = {
  id: string;
  e: Entry;
  x: number;
  y: number;
  w: number;
  h: number;
  level: number;
  parent: string | null;
  pos: number;
  size: number;
  kids: number;
  open: boolean;
  end: number;
};
type Link = { x1: number; y1: number; x2: number; y2: number; tone: ScaleStatus };
type Layout = { items: Item[]; pos: Map<string, number>; links: Link[]; w: number; h: number };

function visibleKids(ix: Index, e: Entry, f: ScaleFilter) {
  const out: Entry[] = [];
  for (const c of e.node.children ?? []) {
    const ce = ix.byId.get(c.id);
    if (ce && shows(ce, f)) out.push(ce);
  }
  return out;
}
const heightOf = (e: Entry, f: ScaleFilter) =>
  e.node.kind === "agent" ? H_AGENT : e.node.kind === "team" ? teamH(f === "all" ? e.agents : e.c[f]) : H_GROUP;

function buildLayout(ix: Index, open: Set<string>, f: ScaleFilter): Layout {
  const items: Item[] = [];
  const links: Link[] = [];
  const pos = new Map<string, number>();
  let maxX = 0;
  const place = (e: Entry, x: number, y0: number, level: number, parent: string | null, p: number, size: number): number => {
    const kids = visibleKids(ix, e, f);
    const isOpen = kids.length > 0 && open.has(e.node.id);
    const w = W[e.node.kind];
    const h = heightOf(e, f);
    const it: Item = { id: e.node.id, e, x, y: y0, w, h, level, parent, pos: p, size, kids: kids.length, open: isOpen, end: 0 };
    const idx = items.length;
    items.push(it);
    pos.set(it.id, idx);
    maxX = Math.max(maxX, x + w);
    if (!isOpen) {
      it.end = items.length;
      return y0 + h;
    }
    const cx = x + w + COL_GAP;
    const leafy = kids.length > 6 && kids.every((k) => !k.node.children?.length);
    const childIdx: number[] = [];
    let bottom = y0;
    if (leafy) {
      const cols = kids.length <= 16 ? 2 : kids.length <= 36 ? 3 : 4;
      const cw = Math.max(...kids.map((k) => W[k.node.kind]));
      const ch = Math.max(...kids.map((k) => heightOf(k, f)));
      kids.forEach((k, i) => {
        const r = Math.floor(i / cols);
        if (i % cols === 0) childIdx.push(items.length);
        place(k, cx + (i % cols) * (cw + GRID_GAP), y0 + r * (ch + GRID_GAP), level + 1, it.id, i + 1, kids.length);
      });
      bottom = y0 + Math.ceil(kids.length / cols) * (ch + GRID_GAP) - GRID_GAP;
    } else {
      let y = y0;
      kids.forEach((k, i) => {
        childIdx.push(items.length);
        bottom = place(k, cx, y, level + 1, it.id, i + 1, kids.length);
        y = bottom + ROW_GAP;
      });
    }
    const span = bottom - y0;
    if (span < h) {
      const d = (h - span) / 2;
      for (let j = idx + 1; j < items.length; j++) items[j].y += d;
    }
    it.y = y0 + (Math.max(span, h) - h) / 2;
    it.end = items.length;
    for (const ci of childIdx) {
      const c = items[ci];
      links.push({ x1: x + w, y1: it.y + h / 2, x2: c.x, y2: c.y + c.h / 2, tone: linkTone(c.e) });
    }
    return y0 + Math.max(span, h);
  };
  const h = place(ix.root, 0, 0, 1, null, 1, 1);
  return { items, pos, links, w: maxX, h };
}

/* ---------- list: the same tree as rows, from the focused branch ---------- */

type Row = { id: string; e: Entry; level: number; parent: string | null; pos: number; size: number; kids: number; open: boolean };

function buildRows(ix: Index, start: string, open: Set<string>, f: ScaleFilter): Row[] {
  const rows: Row[] = [];
  const s = ix.byId.get(start) ?? ix.root;
  const walk = (e: Entry, level: number, parent: string | null, p: number, size: number) => {
    const kids = visibleKids(ix, e, f);
    const isOpen = kids.length > 0 && open.has(e.node.id);
    rows.push({ id: e.node.id, e, level, parent, pos: p, size, kids: kids.length, open: isOpen });
    if (isOpen) kids.forEach((k, i) => walk(k, level + 1, e.node.id, i + 1, kids.length));
  };
  walk(s, 1, null, 1, 1);
  return rows;
}

/* ---------- icons ---------- */

const svgProps = { viewBox: "0 0 16 16", "aria-hidden": true, focusable: false } as const;
const Sparkle = () => (
  <svg {...svgProps} width="14" height="14">
    <path fill="currentColor" d="M8 1.2c.35 2.9 1.9 4.45 4.8 4.8-2.9.35-4.45 1.9-4.8 4.8-.35-2.9-1.9-4.45-4.8-4.8 2.9-.35 4.45-1.9 4.8-4.8Z" />
    <path fill="currentColor" opacity=".55" d="M12.6 10.2c.15 1.2.8 1.85 2 2-1.2.15-1.85.8-2 2-.15-1.2-.8-1.85-2-2 1.2-.15 1.85-.8 2-2Z" />
  </svg>
);
const ChiefIcon = () => (
  <svg {...svgProps} width="14" height="14">
    <circle cx="8" cy="4" r="2" fill="currentColor" />
    <path d="M8 6.5V9M3.5 12V9h9v3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="3.5" cy="13" r="1.4" fill="currentColor" />
    <circle cx="12.5" cy="13" r="1.4" fill="currentColor" />
  </svg>
);
const TeamIcon = () => (
  <svg {...svgProps} width="14" height="14">
    <circle cx="5" cy="5.5" r="2.2" fill="currentColor" />
    <circle cx="11" cy="5.5" r="2.2" fill="currentColor" opacity=".7" />
    <circle cx="8" cy="11" r="2.2" fill="currentColor" opacity=".45" />
  </svg>
);
function Glyph({ status }: { status: ScaleStatus }) {
  const p = { ...svgProps, width: 11, height: 11 };
  if (status === "running")
    return (
      <svg {...p} className="ui-ats__spin">
        <circle cx="8" cy="8" r="5.6" fill="none" stroke="currentColor" strokeOpacity=".25" strokeWidth="2" />
        <path d="M8 2.4a5.6 5.6 0 0 1 5.6 5.6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  if (status === "done")
    return (
      <svg {...p}>
        <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  if (status === "failed")
    return (
      <svg {...p}>
        <path fill="currentColor" d="M7.1 2.3a1 1 0 0 1 1.8 0l5.6 10.2a1 1 0 0 1-.9 1.5H2.4a1 1 0 0 1-.9-1.5L7.1 2.3Z" />
      </svg>
    );
  if (status === "waiting")
    return (
      <svg {...p}>
        <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8 4.8V8l2.2 1.4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  return (
    <svg {...p}>
      <circle cx="8" cy="8" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeDasharray="2 2.4" />
    </svg>
  );
}
/* Chevron after Hugeicons Free (MIT) – arrow-down-01 */
const Chevron = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const SearchIcon = () => (
  <svg {...svgProps} width="14" height="14">
    <circle cx="7" cy="7" r="4.6" fill="none" stroke="currentColor" strokeWidth="1.6" />
    <path d="M10.5 10.5 14 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);
const Arrow = ({ dir }: { dir: "prev" | "next" }) => (
  <svg {...svgProps} width="12" height="12">
    <path d={dir === "next" ? "M6 3.5 10.5 8 6 12.5" : "M10 3.5 5.5 8 10 12.5"} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const KindIcon = ({ kind }: { kind: ScaleKind }) =>
  kind === "root" ? <Sparkle /> : kind === "chief" ? <ChiefIcon /> : kind === "team" ? <TeamIcon /> : null;

/* ---------- small parts ---------- */

function Bar({ e, thick }: { e: Entry; thick?: boolean }) {
  const total = Math.max(1, e.agents);
  return (
    <span className="ui-ats__bar" data-thick={thick ? "" : undefined} aria-hidden="true">
      {BAR_ORDER.map((s) =>
        e.c[s] ? <span key={s} data-s={s} style={{ width: `${(e.c[s] / total) * 100}%` }} /> : null,
      )}
    </span>
  );
}

function groupLabel(e: Entry, fmt: (n: number) => string) {
  const n = e.node;
  const parts = [`${n.name}`, KIND_WORD[n.kind], `${nf.format(e.agents)} agents`];
  if (e.c.waiting) parts.push(`${nf.format(e.c.waiting)} need you`);
  if (e.c.failed) parts.push(`${nf.format(e.c.failed)} failed`);
  if (e.c.running) parts.push(`${nf.format(e.c.running)} running`);
  parts.push(`${Math.round((e.c.done / Math.max(1, e.agents)) * 100)}% done`, `cost ${fmt(e.cost)}`);
  return parts.join(", ");
}
function agentLabel(e: Entry, fmt: (n: number) => string) {
  const n = e.node;
  return [n.name, WORD[n.status], n.model, n.task, `cost ${fmt(e.cost)}`].filter(Boolean).join(", ");
}

type Lod = "full" | "lite" | "far";
type Act = (id: string, what: "open" | "toggle" | "select") => void;

type NodeProps = {
  it: Item;
  lod: Lod;
  sel: boolean;
  tab: boolean;
  hit: boolean;
  pulse: boolean;
  fresh: boolean;
  focus: boolean;
  now: number;
  filter: ScaleFilter;
  fmt: (n: number) => string;
  act: Act;
};

const NodeView = memo(function NodeView({ it, lod, sel, tab, hit, pulse, fresh, focus, now, filter, fmt, act }: NodeProps) {
  const e = it.e;
  const n = e.node;
  const group = isGroup(n);
  const t = tone(e);
  const label = group ? groupLabel(e, fmt) : agentLabel(e, fmt);
  const style: CSSProperties = { transform: `translate(${it.x}px, ${it.y}px)`, width: it.w, height: it.h };
  const elapsed = e.started !== undefined ? duration((n.endedAt ?? now) - e.started) : null;
  const chevron =
    it.kids > 0 ? (
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        className="ui-ats__chev"
        data-open={it.open ? "" : undefined}
        onClick={(ev) => {
          ev.stopPropagation();
          act(it.id, "toggle");
        }}
      >
        <Chevron />
      </button>
    ) : null;

  let body;
  if (lod === "far") {
    body = null;
  } else if (lod === "lite") {
    body = (
      <div className="ui-ats__card ui-ats__card--lite">
        <span className="ui-ats__lname">{n.name}</span>
        {group ? (
          <>
            <Bar e={e} thick />
            <span className="ui-ats__lcount">{nf.format(e.agents)} agents</span>
            {e.c.waiting ? (
              <span className="ui-ats__lcount" data-s="waiting">
                {nf.format(e.c.waiting)} need you
              </span>
            ) : e.c.failed ? (
              <span className="ui-ats__lcount" data-s="failed">
                {nf.format(e.c.failed)} failed
              </span>
            ) : null}
          </>
        ) : (
          <span className="ui-ats__lcount" data-s={n.status}>
            {WORD[n.status]}
          </span>
        )}
      </div>
    );
  } else if (n.kind === "agent") {
    body = (
      <div className="ui-ats__card ui-ats__card--agent">
        <div className="ui-ats__row">
          <span className="ui-ats__pebble" data-s={n.status}>
            <Glyph status={n.status} />
          </span>
          <span className="ui-ats__id">
            <span className="ui-ats__name">{n.name}</span>
            {n.model ? <span className="ui-ats__sub">{n.model}</span> : null}
          </span>
          <span className="ui-ats__pill" data-s={n.status} key={n.status} data-pop={pulse ? "" : undefined}>
            {WORD[n.status]}
          </span>
          {chevron}
        </div>
        {n.task ? <p className="ui-ats__task">{n.task}</p> : null}
        <div className="ui-ats__meta">
          <span className="ui-ats__cost">{fmt(e.cost)}</span>
          {elapsed ? <span>{elapsed}</span> : null}
        </div>
      </div>
    );
  } else {
    const dotsTotal = filter === "all" ? e.agents : e.c[filter];
    const dots: ScaleStatus[] = [];
    if (n.kind === "team") {
      const cap = dotsTotal > DOT_MAX ? DOT_MAX - 1 : DOT_MAX;
      for (const s of STATUS_ORDER) {
        if (filter !== "all" && s !== filter) continue;
        for (let i = 0; i < e.c[s] && dots.length < cap; i++) dots.push(s);
      }
    }
    body = (
      <>
        <div className="ui-ats__card">
          {n.kind === "root" ? <span className="ui-ats__rail" aria-hidden="true" /> : null}
          <div className="ui-ats__row">
            <span className="ui-ats__pebble" data-kind={n.kind}>
              <KindIcon kind={n.kind} />
            </span>
            <span className="ui-ats__id">
              <span className="ui-ats__name">{n.name}</span>
              <span className="ui-ats__sub">
                {KIND_WORD[n.kind]}
                {n.model ? ` · ${n.model}` : ""}
              </span>
            </span>
            {e.c.waiting ? (
              <span className="ui-ats__pill" data-s="waiting" data-pop={pulse ? "" : undefined}>
                {nf.format(e.c.waiting)}
              </span>
            ) : e.c.failed ? (
              <span className="ui-ats__pill" data-s="failed" data-pop={pulse ? "" : undefined}>
                {nf.format(e.c.failed)}
              </span>
            ) : null}
            {chevron}
          </div>
          {n.kind === "team" ? (
            <span className="ui-ats__dots" aria-hidden="true">
              {dots.map((s, i) => (
                <span key={i} data-s={s} />
              ))}
              {dotsTotal > dots.length ? <span className="ui-ats__more">+{nf.format(dotsTotal - dots.length)}</span> : null}
              {!dotsTotal ? <span className="ui-ats__none">No agents yet</span> : null}
            </span>
          ) : (
            <>
              <Bar e={e} />
              <span className="ui-ats__counts">
                <span>
                  <b>{nf.format(e.agents)}</b> agents
                </span>
                {e.c.running ? (
                  <span data-s="running">
                    <b>{nf.format(e.c.running)}</b> running
                  </span>
                ) : null}
                {e.c.waiting ? (
                  <span data-s="waiting">
                    <b>{nf.format(e.c.waiting)}</b> need you
                  </span>
                ) : null}
                {e.c.failed ? (
                  <span data-s="failed">
                    <b>{nf.format(e.c.failed)}</b> failed
                  </span>
                ) : null}
              </span>
            </>
          )}
        </div>
        <div className="ui-ats__nfoot">
          <span className="ui-ats__cost">{fmt(e.cost)}</span>
          <span>
            {n.kind === "team" ? `${nf.format(e.agents)} agents · ` : ""}
            {Math.round((e.c.done / Math.max(1, e.agents)) * 100)}% done
          </span>
          {elapsed && n.kind !== "team" ? <span>{elapsed}</span> : null}
        </div>
      </>
    );
  }

  return (
    <div
      role="treeitem"
      data-id={it.id}
      className="ui-ats__node"
      data-kind={n.kind}
      data-lod={lod}
      data-tone={t}
      data-selected={sel ? "" : undefined}
      data-hit={hit ? "" : undefined}
      data-fresh={fresh ? "" : undefined}
      data-focus={focus ? "" : undefined}
      aria-label={label}
      aria-level={it.level}
      aria-posinset={it.pos}
      aria-setsize={it.size}
      aria-expanded={it.kids ? it.open : undefined}
      aria-selected={sel}
      tabIndex={tab ? 0 : -1}
      style={style}
      onClick={() => act(it.id, group ? "open" : "select")}
    >
      {body}
    </div>
  );
});

type RowProps = {
  r: Row;
  top: number;
  sel: boolean;
  tab: boolean;
  hit: boolean;
  isFocus: boolean;
  fmt: (n: number) => string;
  act: Act;
};

const RowView = memo(function RowView({ r, top, sel, tab, hit, isFocus, fmt, act }: RowProps) {
  const e = r.e;
  const n = e.node;
  const group = isGroup(n);
  const t = tone(e);
  return (
    <div
      role="treeitem"
      data-id={r.id}
      className="ui-ats__lrow"
      data-selected={sel ? "" : undefined}
      data-hit={hit ? "" : undefined}
      data-focus={isFocus ? "" : undefined}
      aria-label={group ? groupLabel(e, fmt) : agentLabel(e, fmt)}
      aria-level={r.level}
      aria-posinset={r.pos}
      aria-setsize={r.size}
      aria-expanded={r.kids ? r.open : undefined}
      aria-selected={sel}
      tabIndex={tab ? 0 : -1}
      style={{ transform: `translateY(${top}px)`, paddingLeft: 10 + Math.min(r.level - 1, 6) * 14 }}
      onClick={() => act(r.id, group && !isFocus ? "open" : group ? "toggle" : "select")}
    >
      {r.kids ? (
        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          className="ui-ats__chev"
          data-open={r.open ? "" : undefined}
          onClick={(ev) => {
            ev.stopPropagation();
            act(r.id, "toggle");
          }}
        >
          <Chevron />
        </button>
      ) : (
        <span className="ui-ats__chev-gap" aria-hidden="true" />
      )}
      <span className="ui-ats__pebble" data-kind={group ? n.kind : undefined} data-s={group ? undefined : n.status}>
        {group ? <KindIcon kind={n.kind} /> : <Glyph status={n.status} />}
      </span>
      <span className="ui-ats__id">
        <span className="ui-ats__name">{n.name}</span>
        <span className="ui-ats__sub">
          {group
            ? `${nf.format(e.agents)} agents${e.c.waiting ? ` · ${nf.format(e.c.waiting)} need you` : ""}${e.c.failed ? ` · ${nf.format(e.c.failed)} failed` : ""}`
            : n.task ?? n.model ?? ""}
        </span>
      </span>
      <span className="ui-ats__lside">
        {group ? <Bar e={e} /> : <span className="ui-ats__pill" data-s={n.status}>{WORD[n.status]}</span>}
        <span className="ui-ats__cost" data-tone={t}>
          {fmt(e.cost)}
        </span>
      </span>
    </div>
  );
});

/* ---------- component ---------- */

type Cam = { x: number; y: number; k: number };
type Pending = { kind: "subtree" | "center"; id: string } | null;

export function AgentTreeScale({
  root,
  defaultExpanded,
  defaultView = "auto",
  height = 620,
  onSelect,
  onFocusChange,
  now: nowProp,
  formatCost = defaultCost,
  title = "Agent org",
  className,
}: AgentTreeScaleProps) {
  const uid = useId();
  const reduced = useReducedMotion();
  const ix = useMemo(() => buildIndex(root), [root]);

  /* clock */
  const anyRunning = ix.root.c.running > 0;
  const [tick, setTick] = useState(() => Date.now());
  useEffect(() => {
    if (nowProp !== undefined || !anyRunning) return;
    const t = window.setInterval(() => setTick(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, [nowProp, anyRunning]);
  const now = nowProp ?? tick;

  /* state */
  const [open, setOpen] = useState<Set<string>>(() =>
    defaultExpanded ? new Set(defaultExpanded) : autoExpand(ix, root.id, BUDGET_START),
  );
  const [focusRaw, setFocusId] = useState(root.id);
  const [selRaw, setSel] = useState(root.id);
  const [hitRaw, setHit] = useState<string | null>(null);
  const [filter, setFilter] = useState<ScaleFilter>("all");
  const [viewPref, setViewPref] = useState<ScaleView>(defaultView);
  const [narrow, setNarrow] = useState(false);
  const focusId = ix.byId.has(focusRaw) ? focusRaw : root.id;
  const sel = ix.byId.has(selRaw) ? selRaw : root.id;
  const hit = hitRaw && ix.byId.has(hitRaw) ? hitRaw : null;
  const mode: "map" | "list" = viewPref === "auto" ? (narrow ? "list" : "map") : viewPref;

  const rootRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const miniRef = useRef<HTMLCanvasElement>(null);
  const zoomRef = useRef<HTMLSpanElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    setNarrow(el.getBoundingClientRect().width < NARROW);
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([en]) => setNarrow(en.contentRect.width < NARROW));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const layout = useMemo(() => (mode === "map" ? buildLayout(ix, open, filter) : null), [ix, open, filter, mode]);
  const rows = useMemo(() => (mode === "list" ? buildRows(ix, focusId, open, filter) : null), [ix, focusId, open, filter, mode]);
  const rowPos = useMemo(() => {
    const m = new Map<string, number>();
    rows?.forEach((r, i) => m.set(r.id, i));
    return m;
  }, [rows]);

  /* live: pulse what newly needs a person, rise what just appeared */
  const prevStatus = useRef<Map<string, ScaleStatus> | null>(null);
  const [marks, setMarks] = useState<{ pulse: Set<string>; fresh: Set<string> }>(() => ({ pulse: new Set(), fresh: new Set() }));
  useEffect(() => {
    const prev = prevStatus.current;
    const next = new Map<string, ScaleStatus>();
    const pulse = new Set<string>();
    const fresh = new Set<string>();
    for (const e of ix.list) {
      const s = e.node.status;
      next.set(e.node.id, s);
      if (!prev) continue;
      const p = prev.get(e.node.id);
      if (p === undefined) {
        if (fresh.size < 400) fresh.add(e.node.id);
      } else if (p !== s && (s === "waiting" || s === "failed")) {
        pulse.add(e.node.id);
        if (e.parent) pulse.add(e.parent);
      }
    }
    prevStatus.current = next;
    if (!pulse.size && !fresh.size) return;
    setMarks({ pulse, fresh });
    const t = window.setTimeout(() => setMarks({ pulse: new Set(), fresh: new Set() }), 900);
    return () => window.clearTimeout(t);
  }, [ix]);

  /* announcements */
  const [say, setSay] = useState("");
  const lastWaiting = useRef(ix.waiting.length);
  const lastSaid = useRef(0);
  useEffect(() => {
    const n = ix.waiting.length;
    const before = lastWaiting.current;
    lastWaiting.current = n;
    if (n > before && Date.now() - lastSaid.current > 5000) {
      lastSaid.current = Date.now();
      setSay(`${n - before} more ${n - before === 1 ? "agent needs" : "agents need"} you. ${nf.format(n)} in total.`);
    }
  }, [ix]);

  /* ---------- camera ---------- */
  const cam = useRef<Cam>({ x: 0, y: 0, k: 1 });
  const size = useRef({ w: 0, h: 0 });
  const camReady = useRef(false);
  const anim = useRef(0);
  const drawReq = useRef(0);
  const flowTimer = useRef(0);
  const onScreen = useRef(true);
  const layoutRef = useRef<Layout | null>(null);
  const reducedRef = useRef(reduced);
  reducedRef.current = reduced;
  const lodRef = useRef<Lod>("full");
  const [cull, setCull] = useState<{ key: string; x0: number; y0: number; x1: number; y1: number; lod: Lod }>({
    key: "",
    x0: 0,
    y0: 0,
    x1: 0,
    y1: 0,
    lod: "full",
  });
  const mini = useRef<{ c: HTMLCanvasElement; s: number; ox: number; oy: number } | null>(null);
  const colorKey = useRef("");

  const colors = useCallback(() => {
    const el = rootRef.current;
    const cs = el ? getComputedStyle(el) : null;
    const v = (name: string, fb: string) => cs?.getPropertyValue(name).trim() || fb;
    return {
      flow: v("--flow", "#3f7fd0"),
      wait: v("--dot-wait", "#d9a514"),
      fail: v("--dot-fail", "#c4573a"),
      done: v("--dot-done", "#3f9a5c"),
      idle: v("--dot-idle", "#cbd6e4"),
      link: v("--link", "#b9c8db"),
      panel: v("--panel", "#ffffff"),
      line: v("--line", "#dae2ec"),
      ink: v("--ink", "#00162b"),
      berry: v("--berry", "#851437"),
      ring: v("--ring", "#8fbdf2"),
    };
  }, []);

  const toneColor = (c: ReturnType<typeof colors>, s: ScaleStatus) =>
    s === "running" ? c.flow : s === "waiting" ? c.wait : s === "failed" ? c.fail : s === "done" ? c.done : c.idle;

  const buildMini = useCallback(() => {
    const L = layoutRef.current;
    const cv = miniRef.current;
    if (!L || !cv) return;
    const mw = cv.clientWidth || 176;
    const mh = cv.clientHeight || 112;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const c = document.createElement("canvas");
    c.width = mw * dpr;
    c.height = mh * dpr;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    const s = Math.min((mw - 12) / Math.max(1, L.w), (mh - 12) / Math.max(1, L.h));
    const ox = (mw - L.w * s) / 2;
    const oy = (mh - L.h * s) / 2;
    const col = colors();
    for (const it of L.items) {
      ctx.fillStyle = it.e.node.kind === "agent" || it.e.node.kind === "team" ? toneColor(col, tone(it.e)) : col.ink;
      ctx.globalAlpha = it.e.node.kind === "agent" || it.e.node.kind === "team" ? 0.9 : 0.55;
      ctx.fillRect(ox + it.x * s, oy + it.y * s, Math.max(1, it.w * s), Math.max(1, it.h * s));
    }
    ctx.globalAlpha = 1;
    mini.current = { c, s, ox, oy };
    cv.width = mw * dpr;
    cv.height = mh * dpr;
  }, [colors]);

  const drawMini = useCallback(() => {
    const cv = miniRef.current;
    const m = mini.current;
    if (!cv || !m) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const dpr = cv.width / (cv.clientWidth || 1);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.drawImage(m.c, 0, 0);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const { x, y, k } = cam.current;
    const { w, h } = size.current;
    const rx = m.ox + (-x / k) * m.s;
    const ry = m.oy + (-y / k) * m.s;
    const rw = (w / k) * m.s;
    const rh = (h / k) * m.s;
    const col = colors();
    ctx.fillStyle = col.berry;
    ctx.globalAlpha = 0.06;
    ctx.fillRect(rx, ry, rw, rh);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = col.berry;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(rx, ry, Math.max(3, rw), Math.max(3, rh));
  }, [colors]);

  const draw = useCallback(() => {
    const cv = canvasRef.current;
    const L = layoutRef.current;
    if (!cv || !L) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const { w: vw, h: vh } = size.current;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    if (cv.width !== Math.round(vw * dpr) || cv.height !== Math.round(vh * dpr)) {
      cv.width = Math.round(vw * dpr);
      cv.height = Math.round(vh * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, vw, vh);
    const { x, y, k } = cam.current;
    const col = colors();
    const key = col.panel + col.ink;
    if (key !== colorKey.current) {
      colorKey.current = key;
      buildMini();
    }
    const wx0 = -x / k;
    const wy0 = -y / k;
    const wx1 = wx0 + vw / k;
    const wy1 = wy0 + vh / k;
    const paths: Record<ScaleStatus, Path2D> = {
      running: new Path2D(),
      waiting: new Path2D(),
      failed: new Path2D(),
      done: new Path2D(),
      idle: new Path2D(),
    };
    let flowing = false;
    for (const l of L.links) {
      if (Math.max(l.x1, l.x2) < wx0 || Math.min(l.x1, l.x2) > wx1) continue;
      if (Math.max(l.y1, l.y2) < wy0 || Math.min(l.y1, l.y2) > wy1) continue;
      const sx1 = x + l.x1 * k;
      const sy1 = y + l.y1 * k;
      const sx2 = x + l.x2 * k;
      const sy2 = y + l.y2 * k;
      const mx = (sx1 + sx2) / 2;
      const p = paths[l.tone];
      p.moveTo(sx1, sy1);
      p.bezierCurveTo(mx, sy1, mx, sy2, sx2, sy2);
      if (l.tone === "running") flowing = true;
    }
    const lw = clamp(1.6 * k, 0.6, 2);
    ctx.lineCap = "round";
    ctx.lineWidth = lw;
    for (const s of ["idle", "done"] as const) {
      ctx.strokeStyle = col.link;
      ctx.stroke(paths[s]);
    }
    ctx.strokeStyle = col.wait;
    ctx.stroke(paths.waiting);
    ctx.strokeStyle = col.fail;
    ctx.stroke(paths.failed);
    ctx.strokeStyle = col.flow;
    const animate = flowing && !reducedRef.current && onScreen.current && k > 0.12;
    if (animate) {
      ctx.setLineDash([6, 8]);
      ctx.lineDashOffset = -((performance.now() / 40) % 14);
    }
    ctx.stroke(paths.running);
    ctx.setLineDash([]);

    if (lodRef.current === "far") {
      const pad = 2 / k;
      const body = new Path2D();
      const bars: Record<ScaleStatus, Path2D> = {
        running: new Path2D(),
        waiting: new Path2D(),
        failed: new Path2D(),
        done: new Path2D(),
        idle: new Path2D(),
      };
      const labels: Item[] = [];
      for (const it of L.items) {
        if (it.x + it.w < wx0 - pad || it.x > wx1 || it.y + it.h < wy0 - pad || it.y > wy1) continue;
        const sx = x + it.x * k;
        const sy = y + it.y * k;
        const sw = Math.max(1.5, it.w * k);
        const sh = Math.max(1.5, it.h * k);
        if (sw > 6) {
          body.roundRect(sx, sy, sw, sh, Math.min(6, sw / 6));
        }
        const e = it.e;
        if (isGroup(e.node) && e.agents) {
          const bh = Math.max(1.5, sh * 0.16);
          let bx = sx;
          for (const s of BAR_ORDER) {
            if (!e.c[s]) continue;
            const bw = (e.c[s] / e.agents) * sw;
            bars[s].rect(bx, sy + sh - bh, bw, bh);
            bx += bw;
          }
        } else {
          bars[tone(e)].rect(sx, sy + (sw > 6 ? sh * 0.84 : 0), sw, sw > 6 ? sh * 0.16 : sh);
        }
        if (sw > 70) labels.push(it);
      }
      ctx.fillStyle = col.panel;
      ctx.fill(body);
      ctx.strokeStyle = col.line;
      ctx.lineWidth = 1;
      ctx.stroke(body);
      for (const s of BAR_ORDER) {
        ctx.fillStyle = toneColor(col, s);
        ctx.fill(bars[s]);
      }
      if (labels.length && labels.length < 600) {
        ctx.fillStyle = col.ink;
        ctx.font = `600 11px "Avenir Next", Avenir, system-ui, sans-serif`;
        ctx.textBaseline = "middle";
        for (const it of labels) {
          const sx = x + it.x * k + 6;
          const sy = y + it.y * k + (it.h * k * 0.42);
          const max = it.w * k - 12;
          let text = it.e.node.name;
          if (ctx.measureText(text).width > max) {
            while (text.length > 1 && ctx.measureText(text + "…").width > max) text = text.slice(0, -1);
            text += "…";
          }
          ctx.fillText(text, sx, sy);
        }
      }
    }
    drawMini();
    window.clearTimeout(flowTimer.current);
    if (animate) flowTimer.current = window.setTimeout(() => requestDrawRef.current(), 40);
  }, [colors, buildMini, drawMini]);

  const requestDrawRef = useRef(() => {});
  requestDrawRef.current = () => {
    if (drawReq.current) return;
    drawReq.current = requestAnimationFrame(() => {
      drawReq.current = 0;
      draw();
    });
  };

  const updateCull = useCallback(() => {
    const { x, y, k } = cam.current;
    const { w, h } = size.current;
    const lod: Lod = k >= LOD_FULL ? "full" : k >= LOD_LITE ? "lite" : "far";
    lodRef.current = lod;
    const kq = Math.pow(2, Math.floor(Math.log2(k)));
    const cell = 256 / kq;
    const qx0 = Math.floor(-x / k / cell) - 1;
    const qy0 = Math.floor(-y / k / cell) - 1;
    const qx1 = Math.ceil((-x + w) / k / cell) + 1;
    const qy1 = Math.ceil((-y + h) / k / cell) + 1;
    const key = `${lod}|${qx0}|${qy0}|${qx1}|${qy1}`;
    setCull((c) => (c.key === key ? c : { key, x0: qx0 * cell, y0: qy0 * cell, x1: qx1 * cell, y1: qy1 * cell, lod }));
  }, []);

  const apply = useCallback(() => {
    const { x, y, k } = cam.current;
    const world = worldRef.current;
    const view = viewRef.current;
    if (world) world.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${k})`;
    if (view) {
      const g = 32 * k * Math.pow(2, -Math.floor(Math.log2(k)));
      view.style.backgroundSize = `${g}px ${g}px`;
      view.style.backgroundPosition = `${x}px ${y}px`;
    }
    if (zoomRef.current) zoomRef.current.textContent = `${Math.round(k * 100)}%`;
    updateCull();
    requestDrawRef.current();
  }, [updateCull]);

  const setCam = useCallback(
    (x: number, y: number, k: number) => {
      cam.current = { x, y, k: clamp(k, K_MIN, K_MAX) };
      apply();
    },
    [apply],
  );

  const flyTo = useCallback(
    (x: number, y: number, k: number, ms = 360) => {
      cancelAnimationFrame(anim.current);
      k = clamp(k, K_MIN, K_MAX);
      if (reducedRef.current || ms <= 0) return setCam(x, y, k);
      const from = { ...cam.current };
      const t0 = performance.now();
      const step = (t: number) => {
        const p = Math.min(1, (t - t0) / ms);
        const ease = 1 - Math.pow(1 - p, 4);
        const kk = Math.exp(Math.log(from.k) + (Math.log(k) - Math.log(from.k)) * ease);
        setCam(from.x + (x - from.x) * ease, from.y + (y - from.y) * ease, kk);
        if (p < 1) anim.current = requestAnimationFrame(step);
      };
      anim.current = requestAnimationFrame(step);
    },
    [setCam],
  );

  const zoomAt = useCallback(
    (sx: number, sy: number, factor: number, ms = 0) => {
      const { x, y, k } = cam.current;
      const nk = clamp(k * factor, K_MIN, K_MAX);
      const wx = (sx - x) / k;
      const wy = (sy - y) / k;
      const nx = sx - wx * nk;
      const ny = sy - wy * nk;
      if (ms) flyTo(nx, ny, nk, ms);
      else {
        cancelAnimationFrame(anim.current);
        setCam(nx, ny, nk);
      }
    },
    [flyTo, setCam],
  );

  const fitRect = useCallback(
    (x0: number, y0: number, x1: number, y1: number, minK: number, maxK: number, anchor?: Item) => {
      const { w, h } = size.current;
      if (!w || !h) return;
      const k = Math.min((w - 72) / Math.max(1, x1 - x0), (h - 72) / Math.max(1, y1 - y0), maxK);
      if (k >= minK || !anchor) {
        const kk = Math.max(k, Math.min(minK, K_MIN));
        flyTo(w / 2 - ((x0 + x1) / 2) * kk, h / 2 - ((y0 + y1) / 2) * kk, kk);
      } else {
        const kk = Math.max(minK, 0.78);
        flyTo(40 - anchor.x * kk, h / 2 - (anchor.y + anchor.h / 2) * kk, kk);
      }
    },
    [flyTo],
  );

  const fitAll = useCallback(() => {
    const L = layoutRef.current;
    if (L) fitRect(0, 0, L.w, L.h, K_MIN, 1);
  }, [fitRect]);

  const flySubtree = useCallback(
    (id: string) => {
      const L = layoutRef.current;
      const i = L?.pos.get(id);
      if (!L || i === undefined) return;
      const it = L.items[i];
      let x1 = it.x + it.w;
      let y0 = it.y;
      let y1 = it.y + it.h;
      for (let j = i + 1; j < it.end; j++) {
        const c = L.items[j];
        x1 = Math.max(x1, c.x + c.w);
        y0 = Math.min(y0, c.y);
        y1 = Math.max(y1, c.y + c.h);
      }
      fitRect(it.x, y0, x1, y1, LOD_FULL, 1, it);
    },
    [fitRect],
  );

  const centerOn = useCallback(
    (id: string, minK = 0.9) => {
      const L = layoutRef.current;
      const i = L?.pos.get(id);
      if (!L || i === undefined) return;
      const it = L.items[i];
      const { w, h } = size.current;
      const k = Math.max(cam.current.k, minK);
      flyTo(w / 2 - (it.x + it.w / 2) * k, h / 2 - (it.y + it.h / 2) * k, Math.min(k, 1.2));
    },
    [flyTo],
  );

  const ensureVisible = useCallback(
    (id: string) => {
      const L = layoutRef.current;
      const i = L?.pos.get(id);
      if (!L || i === undefined) return;
      const it = L.items[i];
      const { x, y, k } = cam.current;
      const { w, h } = size.current;
      if (k < LOD_FULL) return centerOn(id, 0.85);
      const m = 40;
      const sx0 = x + it.x * k;
      const sy0 = y + it.y * k;
      const sx1 = sx0 + it.w * k;
      const sy1 = sy0 + it.h * k;
      let dx = 0;
      let dy = 0;
      if (sx0 < m) dx = m - sx0;
      else if (sx1 > w - m) dx = Math.max(w - m - sx1, m - sx0);
      if (sy0 < m) dy = m - sy0;
      else if (sy1 > h - m) dy = Math.max(h - m - sy1, m - sy0);
      if (dx || dy) flyTo(x + dx, y + dy, k, 200);
    },
    [centerOn, flyTo],
  );

  /* layout changed → redraw, rebuild the minimap, run any pending flight */
  const pending = useRef<Pending>(null);
  useLayoutEffect(() => {
    layoutRef.current = layout;
    if (!layout) return;
    buildMini();
    const view = viewRef.current;
    if (view && !camReady.current) {
      const r = view.getBoundingClientRect();
      size.current = { w: r.width, h: r.height };
      if (r.width && r.height) {
        camReady.current = true;
        const k = Math.min((r.width - 72) / Math.max(1, layout.w), (r.height - 72) / Math.max(1, layout.h), 1);
        if (k >= LOD_LITE) cam.current = { x: (r.width - layout.w * k) / 2, y: (r.height - layout.h * k) / 2, k };
        else {
          const rootIt = layout.items[0];
          const kk = 0.72;
          cam.current = { x: 32, y: r.height / 2 - (rootIt.y + rootIt.h / 2) * kk, k: kk };
        }
      }
    }
    apply();
    const p = pending.current;
    if (p && layout.pos.has(p.id)) {
      pending.current = null;
      if (p.kind === "subtree") flySubtree(p.id);
      else centerOn(p.id);
    }
  }, [layout, apply, buildMini, flySubtree, centerOn]);

  /* size + theme + visibility observers for the map */
  useEffect(() => {
    if (mode !== "map") return;
    const view = viewRef.current;
    if (!view) return;
    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(([en]) => {
            size.current = { w: en.contentRect.width, h: en.contentRect.height };
            buildMini();
            apply();
          })
        : null;
    ro?.observe(view);
    const mo = new MutationObserver(() => {
      colorKey.current = "";
      requestDrawRef.current();
    });
    for (let el: Element | null = rootRef.current; el; el = el.parentElement) {
      mo.observe(el, { attributes: true, attributeFilter: ["class", "data-theme"] });
    }
    const io =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(([en]) => {
            onScreen.current = en.isIntersecting;
            if (en.isIntersecting) requestDrawRef.current();
          })
        : null;
    io?.observe(view);
    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    const onScheme = () => {
      colorKey.current = "";
      requestDrawRef.current();
    };
    mq?.addEventListener?.("change", onScheme);
    return () => {
      ro?.disconnect();
      mo.disconnect();
      io?.disconnect();
      mq?.removeEventListener?.("change", onScheme);
    };
  }, [mode, apply, buildMini]);

  useEffect(
    () => () => {
      cancelAnimationFrame(anim.current);
      cancelAnimationFrame(drawReq.current);
      window.clearTimeout(flowTimer.current);
    },
    [],
  );
  useEffect(() => {
    requestDrawRef.current();
  }, [reduced]);

  /* ---------- actions ---------- */
  const selectRef = useRef(onSelect);
  selectRef.current = onSelect;
  const focusCb = useRef(onFocusChange);
  focusCb.current = onFocusChange;
  const modeRef = useRef(mode);
  modeRef.current = mode;
  const ixRef = useRef(ix);
  ixRef.current = ix;
  const filterRef = useRef(filter);
  filterRef.current = filter;
  const kb = useRef(false);
  const listReveal = useRef(false);

  const focusBranch = useCallback((id: string) => {
    const x = ixRef.current;
    const e = x.byId.get(id);
    if (!e) return;
    const next = new Set<string>(ancestors(x, id));
    autoExpand(x, id, BUDGET, next);
    setOpen(next);
    setFocusId(id);
    setSel(id);
    pending.current = { kind: "subtree", id };
    listReveal.current = true;
    focusCb.current?.(e.node);
  }, []);

  const toggle = useCallback((id: string) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const jumpTo = useCallback(
    (id: string, announce = true) => {
      const x = ixRef.current;
      const e = x.byId.get(id);
      if (!e) return;
      if (!shows(e, filterRef.current)) setFilter("all");
      const anc = ancestors(x, id);
      const next = new Set<string>(anc);
      if (isGroup(e.node)) autoExpand(x, id, BUDGET, next);
      setOpen(next);
      const branch = isGroup(e.node) ? id : e.parent ?? id;
      setFocusId(branch);
      setSel(id);
      setHit(id);
      pending.current = { kind: isGroup(e.node) ? "subtree" : "center", id };
      listReveal.current = true;
      if (announce) {
        const where = anc.slice(1).map((a) => x.byId.get(a)?.node.name).filter(Boolean).join(", ");
        setSay(`${e.node.name}${where ? `, in ${where}` : ""}. ${isGroup(e.node) ? `${nf.format(e.agents)} agents.` : WORD[e.node.status]}`);
      }
    },
    [],
  );

  const act: Act = useCallback(
    (id, what) => {
      const e = ixRef.current.byId.get(id);
      if (!e) return;
      setHit(null);
      if (what === "toggle") {
        setSel(id);
        toggle(id);
        return;
      }
      if (what === "open") {
        focusBranch(id);
      } else {
        setSel(id);
      }
      selectRef.current?.(e.node);
    },
    [focusBranch, toggle],
  );

  const goUp = useCallback(() => {
    const x = ixRef.current;
    const p = x.byId.get(focusId)?.parent;
    if (p) focusBranch(p);
    else {
      setHit(null);
      if (modeRef.current === "map") fitAll();
    }
  }, [focusId, focusBranch, fitAll]);

  /* keyboard: one model for map and list */
  const order: { id: string; parent: string | null; kids: number; open: boolean }[] = (mode === "map" ? layout?.items : rows) ?? [];
  const orderPos = mode === "map" ? layout?.pos ?? new Map<string, number>() : rowPos;
  const tabId = orderPos.has(sel) ? sel : order[0]?.id;

  const moveTo = (id: string) => {
    setSel(id);
    setHit(null);
    kb.current = true;
    if (mode === "map") ensureVisible(id);
    else listReveal.current = true;
  };

  const onTreeKey = (ev: ReactKeyboardEvent<HTMLDivElement>) => {
    if (ev.altKey || ev.ctrlKey || ev.metaKey) return;
    const i = orderPos.get(sel) ?? -1;
    const cur = order[i];
    const key = ev.key;
    const stop = () => {
      ev.preventDefault();
      ev.stopPropagation();
    };
    if (key === "ArrowDown") {
      stop();
      const n = order[Math.min(order.length - 1, i + 1)];
      if (n) moveTo(n.id);
    } else if (key === "ArrowUp") {
      stop();
      const n = order[Math.max(0, i - 1)];
      if (n) moveTo(n.id);
    } else if (key === "Home") {
      stop();
      if (order[0]) moveTo(order[0].id);
    } else if (key === "End") {
      stop();
      const n = order[order.length - 1];
      if (n) moveTo(n.id);
    } else if (key === "ArrowRight") {
      stop();
      if (!cur) return;
      if (cur.kids && !cur.open) {
        kb.current = true;
        toggle(cur.id);
      } else if (cur.open && order[i + 1]) moveTo(order[i + 1].id);
    } else if (key === "ArrowLeft") {
      stop();
      if (!cur) return;
      if (cur.open) {
        kb.current = true;
        toggle(cur.id);
      } else if (cur.parent && orderPos.has(cur.parent)) moveTo(cur.parent);
      else if (mode === "list" && ix.byId.get(cur.id)?.parent) {
        kb.current = true;
        focusBranch(ix.byId.get(cur.id)!.parent!);
      }
    } else if (key === "Enter") {
      stop();
      if (!cur) return;
      kb.current = true;
      const e = ix.byId.get(cur.id);
      if (e && isGroup(e.node) && cur.kids) focusBranch(cur.id);
      else if (e) {
        setSel(cur.id);
        onSelect?.(e.node);
      }
    } else if (key === " ") {
      stop();
      if (cur?.kids) {
        kb.current = true;
        toggle(cur.id);
      }
    } else if (key === "Escape") {
      if (focusId !== root.id || hit) {
        stop();
        kb.current = true;
        goUp();
      }
    } else if (mode === "map" && (key === "+" || key === "=")) {
      stop();
      zoomAt(size.current.w / 2, size.current.h / 2, 1.25, 150);
    } else if (mode === "map" && key === "-") {
      stop();
      zoomAt(size.current.w / 2, size.current.h / 2, 0.8, 150);
    } else if (mode === "map" && key === "0") {
      stop();
      fitAll();
    }
  };

  /* keep keyboard focus on the selected node once it is rendered */
  useLayoutEffect(() => {
    if (!kb.current) return;
    const host = mode === "map" ? worldRef.current : listRef.current;
    const el = host?.querySelector<HTMLElement>(`[data-id="${CSS.escape(sel)}"]`);
    if (el) {
      kb.current = false;
      el.focus({ preventScroll: true });
    }
  });

  /* '/' opens search when the person is in the tree or nowhere in particular */
  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key !== "/" || ev.ctrlKey || ev.metaKey || ev.altKey) return;
      const a = document.activeElement as HTMLElement | null;
      const inside = !!a && !!rootRef.current?.contains(a);
      const editable = !!a && (a.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName));
      if (editable || (!inside && a && a !== document.body)) return;
      ev.preventDefault();
      searchRef.current?.focus();
      searchRef.current?.select();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  /* ---------- pointer: drag to pan, pinch to zoom, wheel ---------- */
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const drag = useRef<{ sx: number; sy: number; cx: number; cy: number; moved: boolean } | null>(null);
  const pinch = useRef<{ d: number; k: number; wx: number; wy: number } | null>(null);
  const suppressClick = useRef(false);

  const local = (cx: number, cy: number) => {
    const r = viewRef.current?.getBoundingClientRect();
    return { x: cx - (r?.left ?? 0), y: cy - (r?.top ?? 0) };
  };

  const hitTest = (sx: number, sy: number) => {
    const L = layoutRef.current;
    if (!L) return null;
    const { x, y, k } = cam.current;
    const wx = (sx - x) / k;
    const wy = (sy - y) / k;
    const slop = 4 / k;
    for (let i = L.items.length - 1; i >= 0; i--) {
      const it = L.items[i];
      if (wx >= it.x - slop && wx <= it.x + it.w + slop && wy >= it.y - slop && wy <= it.y + it.h + slop) return it;
    }
    return null;
  };

  const onPointerDown = (ev: ReactPointerEvent<HTMLDivElement>) => {
    if (ev.pointerType === "mouse" && ev.button !== 0) return;
    if ((ev.target as HTMLElement).closest("button, input, a, .ui-ats__overlay")) return;
    cancelAnimationFrame(anim.current);
    const p = local(ev.clientX, ev.clientY);
    pointers.current.set(ev.pointerId, p);
    if (pointers.current.size === 1) {
      drag.current = { sx: p.x, sy: p.y, cx: cam.current.x, cy: cam.current.y, moved: false };
    } else if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      const { x, y, k } = cam.current;
      const mx = (a.x + b.x) / 2;
      const my = (a.y + b.y) / 2;
      pinch.current = { d: Math.hypot(a.x - b.x, a.y - b.y) || 1, k, wx: (mx - x) / k, wy: (my - y) / k };
      if (drag.current) drag.current.moved = true;
    }
  };
  const onPointerMove = (ev: ReactPointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(ev.pointerId)) return;
    const p = local(ev.clientX, ev.clientY);
    pointers.current.set(ev.pointerId, p);
    if (pinch.current && pointers.current.size >= 2) {
      const [a, b] = [...pointers.current.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y) || 1;
      const nk = clamp(pinch.current.k * (d / pinch.current.d), K_MIN, K_MAX);
      const mx = (a.x + b.x) / 2;
      const my = (a.y + b.y) / 2;
      setCam(mx - pinch.current.wx * nk, my - pinch.current.wy * nk, nk);
      return;
    }
    const dr = drag.current;
    if (!dr) return;
    const dx = p.x - dr.sx;
    const dy = p.y - dr.sy;
    if (!dr.moved && Math.hypot(dx, dy) > 4) {
      dr.moved = true;
      viewRef.current?.setPointerCapture?.(ev.pointerId);
      viewRef.current?.setAttribute("data-dragging", "");
    }
    if (dr.moved) setCam(dr.cx + dx, dr.cy + dy, cam.current.k);
  };
  const endPointer = (ev: ReactPointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(ev.pointerId)) return;
    pointers.current.delete(ev.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
    if (pointers.current.size === 1) {
      const [rest] = [...pointers.current.values()];
      drag.current = { sx: rest.x, sy: rest.y, cx: cam.current.x, cy: cam.current.y, moved: true };
      return;
    }
    const dr = drag.current;
    drag.current = null;
    viewRef.current?.removeAttribute("data-dragging");
    if (dr?.moved) {
      suppressClick.current = true;
      window.setTimeout(() => (suppressClick.current = false), 0);
    } else if (ev.type === "pointerup" && lodRef.current === "far") {
      const p = local(ev.clientX, ev.clientY);
      const it = hitTest(p.x, p.y);
      if (it) {
        suppressClick.current = true;
        window.setTimeout(() => (suppressClick.current = false), 0);
        act(it.id, isGroup(it.e.node) ? "open" : "select");
      }
    }
  };

  useEffect(() => {
    if (mode !== "map") return;
    const view = viewRef.current;
    if (!view) return;
    const onWheel = (ev: WheelEvent) => {
      if ((ev.target as HTMLElement).closest(".ui-ats__overlay")) return;
      ev.preventDefault();
      const f = ev.deltaMode === 1 ? 16 : ev.deltaMode === 2 ? size.current.h : 1;
      const dx = ev.deltaX * f;
      const dy = ev.deltaY * f;
      if (ev.ctrlKey || ev.metaKey) {
        const r = view.getBoundingClientRect();
        zoomAt(ev.clientX - r.left, ev.clientY - r.top, Math.exp(-clamp(dy, -80, 80) * 0.01));
      } else {
        cancelAnimationFrame(anim.current);
        const { x, y, k } = cam.current;
        if (ev.shiftKey && !dx) setCam(x - dy, y, k);
        else setCam(x - dx, y - dy, k);
      }
    };
    view.addEventListener("wheel", onWheel, { passive: false });
    return () => view.removeEventListener("wheel", onWheel);
  }, [mode, zoomAt, setCam]);

  const onMiniPointer = (ev: ReactPointerEvent<HTMLCanvasElement>) => {
    if (ev.type === "pointerdown") ev.currentTarget.setPointerCapture?.(ev.pointerId);
    else if (!(ev.buttons & 1)) return;
    const m = mini.current;
    if (!m) return;
    const r = ev.currentTarget.getBoundingClientRect();
    const wx = (ev.clientX - r.left - m.ox) / m.s;
    const wy = (ev.clientY - r.top - m.oy) / m.s;
    const { k } = cam.current;
    cancelAnimationFrame(anim.current);
    setCam(size.current.w / 2 - wx * k, size.current.h / 2 - wy * k, k);
  };

  /* ---------- list scroll ---------- */
  const [scrollTop, setScrollTop] = useState(0);
  useLayoutEffect(() => {
    if (mode !== "list" || !listReveal.current) return;
    const el = listRef.current;
    const i = rowPos.get(sel);
    if (!el || i === undefined) return;
    listReveal.current = false;
    const top = i * ROW_H;
    if (top < el.scrollTop) el.scrollTop = top;
    else if (top + ROW_H > el.scrollTop + el.clientHeight) el.scrollTop = top + ROW_H - el.clientHeight;
    setScrollTop(el.scrollTop);
  }, [mode, rowPos, sel]);

  /* ---------- search ---------- */
  const [q, setQ] = useState("");
  const [qOpen, setQOpen] = useState(false);
  const [opt, setOpt] = useState(0);
  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return [] as Entry[];
    const starts: Entry[] = [];
    const contains: Entry[] = [];
    for (const e of ix.list) {
      const name = e.node.name.toLowerCase();
      if (name.startsWith(t)) starts.push(e);
      else if (name.includes(t) || e.node.task?.toLowerCase().includes(t)) contains.push(e);
      if (starts.length >= 8) break;
    }
    const rank = (e: Entry) => (e.node.kind === "agent" ? 1 : 0);
    starts.sort((a, b) => rank(a) - rank(b));
    return [...starts, ...contains].slice(0, 8);
  }, [q, ix]);
  const matchCount = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return 0;
    let n = 0;
    for (const e of ix.list) if (e.node.name.toLowerCase().includes(t) || e.node.task?.toLowerCase().includes(t)) n++;
    return n;
  }, [q, ix]);
  const listboxId = `${uid}-results`;
  const pick = (e: Entry | undefined) => {
    if (!e) return;
    setQOpen(false);
    jumpTo(e.node.id);
  };
  const onSearchKey = (ev: ReactKeyboardEvent<HTMLInputElement>) => {
    if (ev.key === "ArrowDown") {
      ev.preventDefault();
      setQOpen(true);
      setOpt((o) => Math.min(results.length - 1, o + 1));
    } else if (ev.key === "ArrowUp") {
      ev.preventDefault();
      setOpt((o) => Math.max(0, o - 1));
    } else if (ev.key === "Enter") {
      ev.preventDefault();
      pick(results[opt] ?? results[0]);
    } else if (ev.key === "Escape") {
      ev.preventDefault();
      if (qOpen && q) setQOpen(false);
      else {
        setQ("");
        setHit(null);
      }
    }
  };

  /* ---------- needs-you queue ---------- */
  const waitIdx = ix.waiting.indexOf(sel);
  const jumpWaiting = (dir: 1 | -1) => {
    const list = ix.waiting;
    if (!list.length) return;
    let i: number;
    if (waitIdx >= 0) i = (waitIdx + dir + list.length) % list.length;
    else {
      // the first one after where the person is now, in tree order
      const here = ix.list.findIndex((e) => e.node.id === sel);
      const after = list.findIndex((id) => ix.list.findIndex((e) => e.node.id === id) > here);
      i = dir === 1 ? (after < 0 ? 0 : after) : (after <= 0 ? list.length - 1 : after - 1);
    }
    jumpTo(list[i]);
  };

  /* ---------- derived ---------- */
  const r = ix.root;
  const crumbs = [...ancestors(ix, focusId), focusId];
  const selE = ix.byId.get(sel) ?? r;
  const lod = cull.lod;

  const visible = useMemo(() => {
    if (!layout) return [] as Item[];
    const out: Item[] = [];
    if (lod !== "far") {
      for (const it of layout.items) {
        if (it.x + it.w < cull.x0 || it.x > cull.x1 || it.y + it.h < cull.y0 || it.y > cull.y1) continue;
        out.push(it);
      }
    }
    for (const id of [sel, hit]) {
      if (!id) continue;
      const i = layout.pos.get(id);
      if (i !== undefined && !out.includes(layout.items[i])) out.push(layout.items[i]);
    }
    return out;
  }, [layout, cull, lod, sel, hit]);

  const listWindow = useMemo(() => {
    if (!rows) return [] as { r: Row; i: number }[];
    const h = height;
    const a = Math.max(0, Math.floor(scrollTop / ROW_H) - 6);
    const b = Math.min(rows.length, Math.ceil((scrollTop + h) / ROW_H) + 6);
    const out = rows.slice(a, b).map((row, j) => ({ r: row, i: a + j }));
    const si = rowPos.get(sel);
    if (si !== undefined && (si < a || si >= b)) out.push({ r: rows[si], i: si });
    return out;
  }, [rows, scrollTop, height, rowPos, sel]);

  const empty = !(root.children?.length);
  const pct = Math.round((r.c.done / Math.max(1, r.agents)) * 100);

  return (
    <div ref={rootRef} className={`ui-ats${className ? ` ${className}` : ""}`} data-narrow={narrow ? "" : undefined} data-mode={mode}>
      <style href="ui-agent-tree-scale" precedence="default">
        {css}
      </style>

      <header className="ui-ats__head">
        <div className="ui-ats__titlebar">
          <span className="ui-ats__mark" aria-hidden="true">
            <Sparkle />
          </span>
          <h2 className="ui-ats__title" id={`${uid}-title`}>
            {title}
          </h2>
          <dl className="ui-ats__totals" aria-label="Totals">
            <div>
              <dt>Agents</dt>
              <dd>{nf.format(r.agents)}</dd>
            </div>
            <div data-s="running">
              <dt>Running</dt>
              <dd>{nf.format(r.c.running)}</dd>
            </div>
            <div data-s="waiting">
              <dt>Needs you</dt>
              <dd>{nf.format(r.c.waiting)}</dd>
            </div>
            <div data-s="failed">
              <dt>Failed</dt>
              <dd>{nf.format(r.c.failed)}</dd>
            </div>
            <div>
              <dt>Done</dt>
              <dd>{pct}%</dd>
            </div>
            <div>
              <dt>Cost</dt>
              <dd className="ui-ats__total" data-climbing={anyRunning && !reduced ? "" : undefined}>
                {formatCost(r.cost)}
              </dd>
            </div>
          </dl>
        </div>

        <div className="ui-ats__tools">
          <div className="ui-ats__search" role="search">
            <SearchIcon />
            <input
              ref={searchRef}
              type="search"
              className="ui-ats__field"
              placeholder="Find an agent or team"
              aria-label="Find an agent or team"
              role="combobox"
              aria-expanded={qOpen && !!q.trim()}
              aria-controls={listboxId}
              aria-autocomplete="list"
              aria-activedescendant={qOpen && results[opt] ? `${uid}-opt-${opt}` : undefined}
              value={q}
              onChange={(ev) => {
                setQ(ev.target.value);
                setOpt(0);
                setQOpen(true);
              }}
              onFocus={() => q && setQOpen(true)}
              onBlur={() => window.setTimeout(() => setQOpen(false), 120)}
              onKeyDown={onSearchKey}
            />
            <kbd className="ui-ats__kbd" aria-hidden="true">
              /
            </kbd>
            {qOpen && q.trim() ? (
              <div className="ui-ats__results ui-ats__overlay">
                <ul id={listboxId} role="listbox" aria-label="Matches">
                  {results.map((e, i) => {
                    const path = ancestors(ix, e.node.id)
                      .slice(1)
                      .map((a) => ix.byId.get(a)?.node.name)
                      .join(" › ");
                    return (
                      <li
                        key={e.node.id}
                        id={`${uid}-opt-${i}`}
                        role="option"
                        aria-selected={i === opt}
                        data-active={i === opt ? "" : undefined}
                        onPointerDown={(ev) => ev.preventDefault()}
                        onClick={() => pick(e)}
                        onPointerEnter={() => setOpt(i)}
                      >
                        <span className="ui-ats__pebble" data-kind={isGroup(e.node) ? e.node.kind : undefined} data-s={isGroup(e.node) ? undefined : e.node.status}>
                          {isGroup(e.node) ? <KindIcon kind={e.node.kind} /> : <Glyph status={e.node.status} />}
                        </span>
                        <span className="ui-ats__id">
                          <span className="ui-ats__name">{e.node.name}</span>
                          <span className="ui-ats__sub">
                            {isGroup(e.node) ? `${KIND_WORD[e.node.kind]} · ${nf.format(e.agents)} agents` : WORD[e.node.status]}
                            {path ? ` · ${path}` : ""}
                          </span>
                        </span>
                      </li>
                    );
                  })}
                </ul>
                <p className="ui-ats__rhint">
                  {results.length
                    ? matchCount > results.length
                      ? `${nf.format(matchCount)} matches · showing the first ${results.length}`
                      : `${nf.format(matchCount)} ${matchCount === 1 ? "match" : "matches"} · Enter to go`
                    : `Nothing called “${q.trim()}”`}
                </p>
              </div>
            ) : null}
          </div>

          <div className="ui-ats__chips" role="group" aria-label="Show">
            {FILTERS.map((f) => {
              const n = f.id === "all" ? r.agents : r.c[f.id];
              return (
                <button
                  key={f.id}
                  type="button"
                  className="ui-ats__chip"
                  data-s={f.id}
                  aria-pressed={filter === f.id}
                  onClick={() => setFilter(f.id)}
                >
                  {f.label}
                  <span className="ui-ats__chipn">{nf.format(n)}</span>
                </button>
              );
            })}
          </div>

          <div className="ui-ats__queue" role="group" aria-label="Agents that need you">
            <button type="button" className="ui-ats__ghost" aria-label="Previous agent that needs you" disabled={!ix.waiting.length} onClick={() => jumpWaiting(-1)}>
              <Arrow dir="prev" />
            </button>
            <button type="button" className="ui-ats__primary" disabled={!ix.waiting.length} onClick={() => jumpWaiting(1)}>
              {ix.waiting.length ? (
                <>
                  Needs you <span className="ui-ats__qn">{waitIdx >= 0 ? `${waitIdx + 1}/${nf.format(ix.waiting.length)}` : nf.format(ix.waiting.length)}</span>
                </>
              ) : (
                "Nobody needs you"
              )}
            </button>
            <button type="button" className="ui-ats__ghost" aria-label="Next agent that needs you" disabled={!ix.waiting.length} onClick={() => jumpWaiting(1)}>
              <Arrow dir="next" />
            </button>
          </div>

          <div className="ui-ats__seg" role="group" aria-label="View">
            <button type="button" aria-pressed={mode === "map"} onClick={() => setViewPref("map")}>
              Map
            </button>
            <button type="button" aria-pressed={mode === "list"} onClick={() => setViewPref("list")}>
              List
            </button>
          </div>
        </div>
      </header>

      <div className="ui-ats__panel" style={{ height }}>
        <nav className="ui-ats__crumbs ui-ats__overlay" aria-label="Branch">
          <ol>
            {crumbs.map((id, i) => {
              const e = ix.byId.get(id);
              if (!e) return null;
              const last = i === crumbs.length - 1;
              return (
                <li key={id}>
                  {i ? <span className="ui-ats__sep" aria-hidden="true">›</span> : null}
                  <button
                    type="button"
                    aria-current={last ? "location" : undefined}
                    onClick={() => (last && mode === "map" ? flySubtree(id) : focusBranch(id))}
                  >
                    {e.node.name}
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        {empty ? (
          <div className="ui-ats__empty">
            <span className="ui-ats__pebble" data-kind="root">
              <Sparkle />
            </span>
            <p>No agents yet. Teams show here as soon as a chief of staff starts them.</p>
          </div>
        ) : mode === "map" ? (
          <div
            ref={viewRef}
            className="ui-ats__view"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endPointer}
            onPointerCancel={endPointer}
            onClickCapture={(ev) => {
              if (suppressClick.current) {
                ev.stopPropagation();
                ev.preventDefault();
              }
            }}
            onScroll={(ev) => {
              ev.currentTarget.scrollTop = 0;
              ev.currentTarget.scrollLeft = 0;
            }}
          >
            <canvas ref={canvasRef} className="ui-ats__canvas" aria-hidden="true" />
            <div
              ref={worldRef}
              className="ui-ats__world"
              role="tree"
              aria-labelledby={`${uid}-title`}
              aria-describedby={`${uid}-help`}
              onKeyDown={onTreeKey}
              data-lod={lod}
            >
              {visible.map((it) => (
                <NodeView
                  key={it.id}
                  it={it}
                  lod={lod === "far" ? "far" : lod}
                  sel={it.id === sel}
                  tab={it.id === tabId}
                  hit={it.id === hit}
                  pulse={marks.pulse.has(it.id)}
                  fresh={marks.fresh.has(it.id)}
                  focus={it.id === focusId && focusId !== root.id}
                  now={lod === "full" && (it.e.c.running > 0 || isGroup(it.e.node)) ? now : 0}
                  filter={filter}
                  fmt={formatCost}
                  act={act}
                />
              ))}
            </div>

            <div className="ui-ats__controls ui-ats__overlay" role="group" aria-label="Zoom">
              <button type="button" aria-label="Zoom out" onClick={() => zoomAt(size.current.w / 2, size.current.h / 2, 0.8, 150)}>
                −
              </button>
              <span ref={zoomRef} className="ui-ats__zoom" aria-hidden="true">
                100%
              </span>
              <button type="button" aria-label="Zoom in" onClick={() => zoomAt(size.current.w / 2, size.current.h / 2, 1.25, 150)}>
                +
              </button>
              <button type="button" className="ui-ats__textbtn" onClick={fitAll}>
                Fit
              </button>
              <span className="ui-ats__vsep" aria-hidden="true" />
              <button
                type="button"
                className="ui-ats__textbtn"
                data-extra=""
                onClick={() => {
                  const all = new Set<string>();
                  for (const e of ix.list) if (e.node.children?.length) all.add(e.node.id);
                  setOpen(all);
                }}
              >
                Open all
              </button>
              <button
                type="button"
                className="ui-ats__textbtn"
                data-extra=""
                onClick={() => {
                  setOpen(autoExpand(ix, root.id, BUDGET_START));
                  setFocusId(root.id);
                  pending.current = { kind: "subtree", id: root.id };
                }}
              >
                Summaries
              </button>
            </div>
            {!narrow ? (
              <canvas
                ref={miniRef}
                className="ui-ats__mini ui-ats__overlay"
                aria-hidden="true"
                onPointerDown={onMiniPointer}
                onPointerMove={onMiniPointer}
              />
            ) : null}
          </div>
        ) : (
          <div
            ref={listRef}
            className="ui-ats__list"
            role="tree"
            aria-labelledby={`${uid}-title`}
            aria-describedby={`${uid}-help`}
            onKeyDown={onTreeKey}
            onScroll={(ev) => setScrollTop(ev.currentTarget.scrollTop)}
          >
            <div className="ui-ats__lspace" style={{ height: (rows?.length ?? 0) * ROW_H }}>
              {listWindow.map(({ r: row, i }) => (
                <RowView
                  key={row.id}
                  r={row}
                  top={i * ROW_H}
                  sel={row.id === sel}
                  tab={row.id === tabId}
                  hit={row.id === hit}
                  isFocus={row.id === focusId}
                  fmt={formatCost}
                  act={act}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <footer className="ui-ats__foot">
        <div className="ui-ats__inspect" aria-live="off">
          <span className="ui-ats__pebble" data-kind={isGroup(selE.node) ? selE.node.kind : undefined} data-s={isGroup(selE.node) ? undefined : selE.node.status}>
            {isGroup(selE.node) ? <KindIcon kind={selE.node.kind} /> : <Glyph status={selE.node.status} />}
          </span>
          <div className="ui-ats__id">
            <span className="ui-ats__name">
              {selE.node.name}
              <span className="ui-ats__pill" data-s={tone(selE)}>
                {isGroup(selE.node) ? (selE.c.waiting ? `${nf.format(selE.c.waiting)} need you` : WORD[tone(selE)]) : WORD[selE.node.status]}
              </span>
            </span>
            <span className="ui-ats__sub">
              {KIND_WORD[selE.node.kind]}
              {selE.node.model ? ` · ${selE.node.model}` : ""}
              {isGroup(selE.node) ? ` · ${nf.format(selE.agents)} agents · ${Math.round((selE.c.done / Math.max(1, selE.agents)) * 100)}% done` : ""}
              {` · ${formatCost(selE.cost)}`}
              {selE.started !== undefined ? ` · ${duration((selE.node.endedAt ?? now) - selE.started)}` : ""}
            </span>
            {selE.node.task ? <span className="ui-ats__itask">{selE.node.task}</span> : null}
          </div>
          {isGroup(selE.node) && selE.node.children?.length ? (
            <button type="button" className="ui-ats__secondary" onClick={() => focusBranch(selE.node.id)}>
              Focus branch
            </button>
          ) : null}
        </div>
        <p className="ui-ats__help" id={`${uid}-help`}>
          <span>
            <kbd className="ui-ats__kbd">/</kbd> Find
          </span>
          <span>
            <kbd className="ui-ats__kbd">↑</kbd>
            <kbd className="ui-ats__kbd">↓</kbd> Move
          </span>
          <span>
            <kbd className="ui-ats__kbd">←</kbd>
            <kbd className="ui-ats__kbd">→</kbd> Close, open
          </span>
          <span>
            <kbd className="ui-ats__kbd">Enter</kbd> Focus
          </span>
          <span>
            <kbd className="ui-ats__kbd">Esc</kbd> Up a level
          </span>
          {mode === "map" ? <span>Drag to move · Ctrl + scroll or pinch to zoom</span> : null}
        </p>
      </footer>
      <p className="ui-ats__sr" aria-live="polite" role="status">
        {say}
      </p>
    </div>
  );
}

/* ---------- styles ---------- */

const css = /* css */ `
.ui-ats {
  --frame: #f2f6fa; --panel: #ffffff; --soft: rgba(26, 62, 112, 0.06);
  --line: #dae2ec; --line-firm: #cbd6e4;
  --ink: #00162b; --text: rgba(0, 22, 43, 0.66); --muted: rgba(0, 22, 43, 0.54);
  --berry: #851437; --berry-hover: #6d0f2d;
  --info-ink: #1a3e70; --info-fill: #eef5ff; --info-line: #c1daff; --ring: #8fbdf2;
  --ok-ink: #1d6a34; --ok-fill: #eafbee; --ok-line: #c9f5cf;
  --wait-ink: #775810; --wait-fill: #fdf6dd; --wait-line: #fae6a0;
  --bad-ink: #8a3a22; --bad-fill: #fdeee8; --bad-line: #f5d5c9;
  --ground: #eaeff6; --grid: rgba(26, 62, 112, 0.07);
  --flow: #3f7fd0; --link: #b9c8db;
  --dot-run: #4b86d1; --dot-wait: #d9a514; --dot-fail: #c4573a; --dot-done: #3f9a5c; --dot-idle: #cbd6e4;
  --tile: #ffffff; --secondary: #fbfcfe; --shine: #6f9fe0; --mark: #2f6fc4;
  --pebble-shade: inset 0 -2px 6px -4px rgba(26, 62, 112, 0.4);
  --drop: 0 8px 16px -8px rgba(26, 62, 112, 0.2);
  --raised: 0 18px 30px -16px rgba(26, 62, 112, 0.38), 0 4px 10px -6px rgba(26, 62, 112, 0.18);
  --float: 0 24px 48px -24px rgba(26, 62, 112, 0.3);
  --ease: cubic-bezier(.16, 1, .3, 1);
  box-sizing: border-box;
  position: relative;
  width: 100%;
  max-width: 1280px;
  min-width: 0;
  contain: inline-size;
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
}
:where(.dark, [data-theme="dark"]) .ui-ats {
  --frame: #0f2747; --panel: #16345c; --soft: rgba(255, 255, 255, 0.07);
  --line: rgba(255, 255, 255, 0.12); --line-firm: rgba(255, 255, 255, 0.18);
  --ink: rgba(255, 255, 255, 0.94); --text: rgba(255, 255, 255, 0.72); --muted: rgba(255, 255, 255, 0.56);
  --berry: #a8204d; --berry-hover: #bd2a5a;
  --info-ink: #c1daff; --info-fill: rgba(143, 189, 242, 0.16); --info-line: rgba(143, 189, 242, 0.34); --ring: rgba(143, 189, 242, 0.6);
  --ok-ink: #7fe0a0; --ok-fill: rgba(127, 224, 160, 0.14); --ok-line: rgba(127, 224, 160, 0.3);
  --wait-ink: #f3d27a; --wait-fill: rgba(243, 210, 122, 0.14); --wait-line: rgba(243, 210, 122, 0.3);
  --bad-ink: #f2a48c; --bad-fill: rgba(242, 164, 140, 0.14); --bad-line: rgba(242, 164, 140, 0.3);
  --ground: #0b213f; --grid: rgba(255, 255, 255, 0.05);
  --flow: #8fbdf2; --link: rgba(255, 255, 255, 0.2);
  --dot-run: #7fb0ee; --dot-wait: #f3d27a; --dot-fail: #f2a48c; --dot-done: #7fe0a0; --dot-idle: rgba(255, 255, 255, 0.22);
  --tile: #ffffff; --secondary: rgba(255, 255, 255, 0.06); --shine: #8fbdf2; --mark: #8fbdf2;
  --pebble-shade: inset 0 -2px 6px -4px rgba(3, 12, 28, 0.8);
  --drop: 0 8px 16px -8px rgba(3, 12, 28, 0.6);
  --raised: 0 18px 30px -16px rgba(3, 12, 28, 0.8), 0 4px 10px -6px rgba(3, 12, 28, 0.6);
  --float: 0 24px 48px -24px rgba(3, 12, 28, 0.7);
}
.ui-ats *, .ui-ats *::before, .ui-ats *::after { box-sizing: border-box; }
.ui-ats :where(button) { font: inherit; color: inherit; cursor: pointer; }
.ui-ats :where(button:disabled) { cursor: default; }
.ui-ats :focus-visible { outline: none; box-shadow: 0 0 0 3px var(--ring); }
.ui-ats__sr { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }

/* header */
.ui-ats__head { position: relative; z-index: 10; padding: 8px 8px 12px; display: flex; flex-direction: column; gap: 10px; }
.ui-ats__titlebar { display: flex; align-items: center; flex-wrap: wrap; gap: 6px 10px; padding: 2px 4px 0; }
.ui-ats__mark { display: inline-flex; color: var(--mark); }
.ui-ats__title {
  margin: 0; color: var(--ink); font-size: 18px; font-weight: 700; letter-spacing: 0;
  font-family: "Avenir Next Condensed", "Avenir Next", Avenir, system-ui, sans-serif;
}
.ui-ats__totals { margin: 0 0 0 auto; display: flex; flex-wrap: wrap; gap: 4px 18px; font-variant-numeric: tabular-nums; }
.ui-ats__totals > div { display: flex; flex-direction: column; align-items: flex-end; min-width: 0; }
.ui-ats__totals dt { font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.09em; color: var(--muted); font-weight: 600; }
.ui-ats__totals dd { margin: 0; color: var(--ink); font-size: 15px; font-weight: 700; transition: color 300ms var(--ease); }
.ui-ats__totals [data-s="running"] dd { color: var(--info-ink); }
.ui-ats__totals [data-s="waiting"] dd { color: var(--wait-ink); }
.ui-ats__totals [data-s="failed"] dd { color: var(--bad-ink); }
.ui-ats__total[data-climbing] {
  background: linear-gradient(100deg, var(--ink) 40%, var(--shine) 50%, var(--ink) 60%) 0 0 / 250% 100%;
  -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
  animation: ui-ats-shimmer 2.2s linear infinite;
}
@keyframes ui-ats-shimmer { from { background-position: 100% 0; } to { background-position: -150% 0; } }

.ui-ats__tools { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
.ui-ats__search { position: relative; flex: 1 1 220px; min-width: 0; max-width: 340px; display: flex; align-items: center; color: var(--muted); }
.ui-ats__search > svg { position: absolute; left: 11px; pointer-events: none; }
.ui-ats__search > .ui-ats__kbd { position: absolute; right: 9px; pointer-events: none; }
.ui-ats__field {
  width: 100%; height: 36px; padding: 0 32px 0 32px; border-radius: 10px; border: 1px solid var(--line-firm);
  background: var(--panel); color: var(--ink); font: inherit; font-size: 14px; caret-color: var(--berry);
  box-shadow: inset 0 1px 2px rgba(26, 62, 112, 0.08); -webkit-appearance: none; appearance: none;
}
.ui-ats__field::placeholder { color: var(--muted); }
.ui-ats__field::-webkit-search-cancel-button { display: none; }
.ui-ats__field:focus-visible { box-shadow: 0 0 0 3px var(--ring); border-color: var(--info-line); }
.ui-ats__kbd {
  display: inline-grid; place-items: center; min-width: 20px; height: 20px; padding: 0 5px; border-radius: 6px;
  background: var(--tile); border: 1px solid var(--line); border-bottom-width: 2px; color: #1a3e70;
  font: 600 11px/1 "Avenir Next", Avenir, system-ui, sans-serif;
}
.ui-ats__results {
  position: absolute; left: 0; right: 0; top: calc(100% + 6px); z-index: 20; min-width: 280px;
  padding: 6px; border-radius: 14px; background: var(--panel); border: 1px solid var(--line); box-shadow: var(--float), var(--drop);
  animation: ui-ats-in 150ms var(--ease) both;
}
.ui-ats__results ul { list-style: none; margin: 0; padding: 0; max-height: 320px; overflow: auto; }
.ui-ats__results li { position: relative; display: flex; align-items: center; gap: 8px; padding: 7px 8px; border-radius: 9px; cursor: pointer; }
.ui-ats__results li[data-active] { background: var(--info-fill); }
.ui-ats__results li[data-active]::before { content: ""; position: absolute; left: 0; top: 8px; bottom: 8px; width: 2px; border-radius: 2px; background: var(--berry); }
.ui-ats__rhint { margin: 4px 8px 2px; font-size: 12px; color: var(--muted); }
@keyframes ui-ats-in { from { opacity: 0; transform: translateY(-4px); } }

.ui-ats__chips { display: flex; gap: 4px; flex-wrap: wrap; }
.ui-ats__chip {
  display: inline-flex; align-items: center; gap: 6px; height: 30px; padding: 0 10px; border-radius: 999px;
  background: var(--secondary); border: 1px solid var(--line); color: var(--text); font-size: 12.5px; font-weight: 600; white-space: nowrap;
  transition: background-color 150ms var(--ease), border-color 150ms var(--ease), color 150ms var(--ease);
}
.ui-ats__chip:hover { border-color: var(--line-firm); }
.ui-ats__chipn { font-variant-numeric: tabular-nums; color: var(--muted); font-weight: 600; }
.ui-ats__chip[aria-pressed="true"] { background: var(--info-fill); border-color: var(--info-line); color: var(--info-ink); }
.ui-ats__chip[aria-pressed="true"][data-s="waiting"] { background: var(--wait-fill); border-color: var(--wait-line); color: var(--wait-ink); }
.ui-ats__chip[aria-pressed="true"][data-s="failed"] { background: var(--bad-fill); border-color: var(--bad-line); color: var(--bad-ink); }
.ui-ats__chip[aria-pressed="true"][data-s="done"] { background: var(--ok-fill); border-color: var(--ok-line); color: var(--ok-ink); }
.ui-ats__chip[aria-pressed="true"] .ui-ats__chipn { color: inherit; }

.ui-ats__queue { display: inline-flex; align-items: center; gap: 2px; margin-left: auto; }
.ui-ats__primary {
  display: inline-flex; align-items: center; gap: 8px; height: 34px; padding: 0 14px; border-radius: 10px; border: 0;
  background: var(--berry); color: #fff !important; font-weight: 600; font-size: 13.5px; white-space: nowrap;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 6px 12px -6px rgba(133, 20, 55, 0.6);
  transition: background-color 150ms var(--ease);
}
.ui-ats__primary:hover:not(:disabled) { background: var(--berry-hover); }
.ui-ats__primary:disabled { background: var(--ok-fill); color: var(--ok-ink) !important; box-shadow: inset 0 0 0 1px var(--ok-line); }
.ui-ats__qn { font-variant-numeric: tabular-nums; padding: 1px 7px; border-radius: 999px; background: rgba(255, 255, 255, 0.18); font-size: 12px; }
.ui-ats__ghost {
  display: inline-grid; place-items: center; width: 30px; height: 30px; border: 0; border-radius: 9px; background: transparent; color: var(--ink);
  transition: background-color 150ms var(--ease);
}
.ui-ats__ghost:hover:not(:disabled) { background: var(--soft); }
.ui-ats__ghost:disabled { opacity: 0.4; }
.ui-ats__seg { display: inline-flex; padding: 2px; border-radius: 10px; background: var(--soft); border: 1px solid var(--line); }
.ui-ats__seg button { height: 28px; padding: 0 12px; border: 0; border-radius: 8px; background: transparent; color: var(--muted); font-weight: 600; font-size: 12.5px; }
.ui-ats__seg button[aria-pressed="true"] { background: var(--panel); color: var(--ink); box-shadow: 0 0 0 1px var(--line), var(--drop); }

/* panel */
.ui-ats__panel {
  position: relative; overflow: hidden; border-radius: 16px; background: var(--ground);
  border: 1px solid var(--line); box-shadow: var(--raised);
}
.ui-ats__view {
  position: absolute; inset: 0; overflow: hidden; touch-action: none; cursor: grab; user-select: none; -webkit-user-select: none;
  background-image: linear-gradient(var(--grid) 1px, transparent 1px), linear-gradient(90deg, var(--grid) 1px, transparent 1px);
}
.ui-ats__view[data-dragging] { cursor: grabbing; }
.ui-ats__canvas { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
.ui-ats__world { position: absolute; left: 0; top: 0; width: 0; height: 0; transform-origin: 0 0; will-change: transform; }
.ui-ats__overlay { z-index: 5; }

.ui-ats__crumbs {
  position: absolute; left: 10px; top: 10px; right: 10px; pointer-events: none; display: flex;
}
.ui-ats__crumbs ol {
  pointer-events: auto; display: flex; align-items: center; gap: 2px; list-style: none; margin: 0; padding: 3px; max-width: 100%;
  overflow-x: auto; scrollbar-width: none; border-radius: 12px; background: var(--panel); border: 1px solid var(--line); box-shadow: var(--drop);
}
.ui-ats__crumbs li { display: flex; align-items: center; gap: 2px; flex: none; }
.ui-ats__crumbs button {
  border: 0; background: transparent; padding: 4px 8px; border-radius: 8px; font-size: 12.5px; font-weight: 600; color: var(--muted);
  white-space: nowrap; max-width: 200px; overflow: hidden; text-overflow: ellipsis;
}
.ui-ats__crumbs button:hover { background: var(--soft); color: var(--ink); }
.ui-ats__crumbs button[aria-current] { color: var(--info-ink); background: var(--info-fill); }
.ui-ats__sep { color: var(--muted); font-size: 12px; }

.ui-ats__controls {
  position: absolute; left: 10px; bottom: 10px; display: flex; align-items: center; gap: 2px; padding: 3px;
  border-radius: 12px; background: var(--panel); border: 1px solid var(--line); box-shadow: var(--drop);
}
.ui-ats__controls button {
  min-width: 28px; height: 28px; padding: 0 6px; border: 0; border-radius: 8px; background: transparent; color: var(--ink);
  font-size: 16px; font-weight: 600; transition: background-color 150ms var(--ease);
}
.ui-ats__controls button:hover { background: var(--soft); }
.ui-ats__controls .ui-ats__textbtn { font-size: 12.5px; padding: 0 8px; }
.ui-ats__zoom { min-width: 42px; text-align: center; font-size: 12px; font-variant-numeric: tabular-nums; color: var(--muted); font-weight: 600; }
.ui-ats__vsep { width: 1px; height: 18px; background: var(--line); margin: 0 2px; }
.ui-ats__mini {
  position: absolute; right: 10px; bottom: 10px; width: 176px; height: 112px; border-radius: 12px; cursor: crosshair; touch-action: none;
  background: var(--panel); border: 1px solid var(--line); box-shadow: var(--drop);
}

/* nodes */
.ui-ats__node {
  position: absolute; left: 0; top: 0; display: flex; flex-direction: column; border-radius: 18px; cursor: pointer;
  background: var(--frame); border: 1px solid var(--line); box-shadow: var(--drop);
  transition: border-color 150ms var(--ease), box-shadow 150ms var(--ease);
}
.ui-ats__node[data-kind="agent"] { background: transparent; border: 0; box-shadow: none; }
.ui-ats__node:focus-visible { box-shadow: 0 0 0 3px var(--ring), var(--drop); }
.ui-ats__node[data-selected] { border-color: var(--info-line); box-shadow: 0 0 0 3px var(--info-fill), 0 0 0 4px var(--info-line), var(--drop); }
.ui-ats__node[data-selected]:focus-visible { box-shadow: 0 0 0 3px var(--ring), var(--drop); }
.ui-ats__node[data-selected]::before {
  content: ""; position: absolute; left: -1px; top: 18px; bottom: 18px; width: 3px; border-radius: 0 3px 3px 0; background: var(--berry); z-index: 2;
}
.ui-ats__node[data-hit] { animation: ui-ats-hit 1.6s var(--ease) 2; }
@keyframes ui-ats-hit { 0%, 100% { box-shadow: 0 0 0 3px var(--info-fill), 0 0 0 4px var(--info-line), var(--drop); } 50% { box-shadow: 0 0 0 10px var(--info-fill), 0 0 0 11px var(--info-line), var(--drop); } }
.ui-ats__node[data-fresh] > * { animation: ui-ats-rise 420ms var(--ease) both; }
@keyframes ui-ats-rise { from { opacity: 0; transform: translateY(10px); } }
.ui-ats__node[data-lod="far"] { background: transparent; border: 0; box-shadow: 0 0 0 3px var(--ring); }

.ui-ats__card {
  position: relative; flex: 1; min-height: 0; margin: -1px -1px 0; padding: 10px 10px 8px; border-radius: 14px;
  display: flex; flex-direction: column; gap: 8px; overflow: hidden;
  background: var(--panel); border: 1px solid var(--line); box-shadow: var(--raised);
  transition: border-color 150ms var(--ease);
}
.ui-ats__node:hover > .ui-ats__card { border-color: var(--line-firm); }
.ui-ats__card--agent { margin: 0; border-radius: 14px; }
.ui-ats__node[data-kind="agent"][data-tone="waiting"] > .ui-ats__card { border-color: var(--wait-line); }
.ui-ats__node[data-kind="agent"][data-tone="failed"] > .ui-ats__card { border-color: var(--bad-line); }
.ui-ats__node[data-kind="agent"][data-tone="idle"] > .ui-ats__card,
.ui-ats__node[data-kind="agent"][data-tone="done"] > .ui-ats__card { box-shadow: var(--drop); }
.ui-ats__rail { position: absolute; left: 0; top: 12px; bottom: 12px; width: 3px; border-radius: 0 3px 3px 0; background: var(--berry); }
.ui-ats__row { display: flex; align-items: center; gap: 8px; min-width: 0; }
.ui-ats__pebble {
  flex: none; width: 28px; height: 28px; display: grid; place-items: center; border-radius: 9px;
  background: var(--tile); border: 1px solid var(--line); box-shadow: var(--pebble-shade); color: #1a3e70;
  transition: color 300ms var(--ease);
}
.ui-ats__pebble[data-kind="root"] { color: #851437; }
.ui-ats__pebble[data-kind="team"] { color: #2f6fc4; }
.ui-ats__pebble[data-s="running"] { color: #2f6fc4; }
.ui-ats__pebble[data-s="waiting"] { color: #8a6514; }
.ui-ats__pebble[data-s="failed"] { color: #a8442a; }
.ui-ats__pebble[data-s="done"] { color: #1d6a34; }
.ui-ats__pebble[data-s="idle"] { color: rgba(0, 22, 43, 0.5); }
.ui-ats__id { min-width: 0; flex: 1; display: flex; flex-direction: column; }
.ui-ats__name { color: var(--ink); font-weight: 700; font-size: 14px; line-height: 1.25; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; display: flex; align-items: center; gap: 8px; }
.ui-ats__sub { font-size: 12px; color: var(--muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ui-ats__pill {
  flex: none; display: inline-flex; align-items: center; gap: 4px; height: 22px; padding: 0 8px; border-radius: 999px;
  background: var(--soft); border: 1px solid var(--line); color: var(--muted); font-size: 11.5px; font-weight: 600; white-space: nowrap;
  font-variant-numeric: tabular-nums;
  transition: background-color 300ms var(--ease), color 300ms var(--ease), border-color 300ms var(--ease);
}
.ui-ats__pill[data-s="running"] { background: var(--info-fill); border-color: var(--info-line); color: var(--info-ink); }
.ui-ats__pill[data-s="done"] { background: var(--ok-fill); border-color: var(--ok-line); color: var(--ok-ink); }
.ui-ats__pill[data-s="waiting"] { background: var(--wait-fill); border-color: var(--wait-line); color: var(--wait-ink); }
.ui-ats__pill[data-s="failed"] { background: var(--bad-fill); border-color: var(--bad-line); color: var(--bad-ink); }
.ui-ats__pill[data-pop] { animation: ui-ats-pop 300ms var(--ease); }
@keyframes ui-ats-pop { 40% { transform: scale(1.12); } }
.ui-ats__chev {
  flex: none; display: grid; place-items: center; width: 24px; height: 24px; border: 0; border-radius: 7px; background: transparent; color: var(--muted);
  transform: rotate(-90deg); transition: transform 150ms var(--ease), background-color 150ms var(--ease);
}
.ui-ats__chev:hover { background: var(--soft); color: var(--ink); }
.ui-ats__chev[data-open] { transform: rotate(90deg); }
.ui-ats__lrow .ui-ats__chev[data-open] { transform: none; }
.ui-ats__chev-gap { flex: none; width: 24px; }
.ui-ats__spin { animation: ui-ats-spin 900ms linear infinite; }
@keyframes ui-ats-spin { to { transform: rotate(360deg); } }

.ui-ats__bar { display: flex; height: 6px; border-radius: 999px; overflow: hidden; background: var(--soft); box-shadow: inset 0 0 0 1px var(--line); flex: none; }
.ui-ats__bar[data-thick] { height: 16px; }
.ui-ats__bar > span { height: 100%; transition: width 300ms var(--ease); }
.ui-ats__bar > [data-s="running"], .ui-ats__dots > [data-s="running"] { background: var(--dot-run); }
.ui-ats__bar > [data-s="waiting"], .ui-ats__dots > [data-s="waiting"] { background: var(--dot-wait); }
.ui-ats__bar > [data-s="failed"], .ui-ats__dots > [data-s="failed"] { background: var(--dot-fail); }
.ui-ats__bar > [data-s="done"], .ui-ats__dots > [data-s="done"] { background: var(--dot-done); }
.ui-ats__bar > [data-s="idle"], .ui-ats__dots > [data-s="idle"] { background: var(--dot-idle); }
.ui-ats__counts { display: flex; flex-wrap: wrap; gap: 2px 10px; font-size: 12px; color: var(--muted); font-variant-numeric: tabular-nums; }
.ui-ats__counts b { color: var(--ink); font-weight: 700; }
.ui-ats__counts [data-s="running"] b { color: var(--info-ink); }
.ui-ats__counts [data-s="waiting"] b { color: var(--wait-ink); }
.ui-ats__counts [data-s="failed"] b { color: var(--bad-ink); }
.ui-ats__dots { display: flex; flex-wrap: wrap; gap: 4px; align-content: flex-start; padding: 2px 1px 0; }
.ui-ats__dots > span[data-s] {
  width: 10px; height: 10px; border-radius: 50%; box-shadow: inset 0 -1px 2px rgba(0, 22, 43, 0.22);
  transition: background-color 300ms var(--ease);
}
.ui-ats__dots > [data-s="waiting"] { box-shadow: 0 0 0 2px var(--wait-fill), inset 0 -1px 2px rgba(0, 22, 43, 0.22); }
.ui-ats__more, .ui-ats__none { font-size: 11px; line-height: 10px; color: var(--muted); font-weight: 600; padding-left: 2px; }
.ui-ats__task {
  margin: 0; font-size: 12.5px; line-height: 1.35; color: var(--text); overflow: hidden;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
}
.ui-ats__meta { margin-top: auto; display: flex; justify-content: space-between; gap: 8px; font-size: 12px; color: var(--muted); font-variant-numeric: tabular-nums; }
.ui-ats__cost { color: var(--ink); font-weight: 600; font-variant-numeric: tabular-nums; }
.ui-ats__nfoot {
  flex: none; height: 30px; display: flex; align-items: center; gap: 10px; padding: 0 10px; font-size: 12px; color: var(--muted);
  font-variant-numeric: tabular-nums; white-space: nowrap; overflow: hidden;
}
.ui-ats__nfoot > :last-child:not(:first-child) { margin-left: auto; }

.ui-ats__card--lite { justify-content: center; gap: 6px; padding: 10px 16px; }
.ui-ats__card--lite > .ui-ats__bar { margin: 4px 0; }
.ui-ats__node[data-kind="agent"] .ui-ats__card--lite { margin: 0; }
.ui-ats__lname {
  color: var(--ink); font-weight: 700; font-size: 32px; line-height: 1.1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  font-family: "Avenir Next Condensed", "Avenir Next", Avenir, system-ui, sans-serif;
}
.ui-ats__lcount { font-size: 21px; line-height: 1.15; font-weight: 600; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-variant-numeric: tabular-nums; }
.ui-ats__lcount[data-s="waiting"] { color: var(--wait-ink); }
.ui-ats__lcount[data-s="failed"] { color: var(--bad-ink); }
.ui-ats__lcount[data-s="running"] { color: var(--info-ink); }
.ui-ats__lcount[data-s="done"] { color: var(--ok-ink); }

/* list */
.ui-ats__list { position: absolute; inset: 0; overflow-y: auto; overflow-x: hidden; padding-top: 52px; overscroll-behavior: contain; }
.ui-ats__lspace { position: relative; }
.ui-ats__lrow {
  position: absolute; left: 6px; right: 6px; top: 0; height: ${ROW_H - 6}px; display: flex; align-items: center; gap: 8px; padding-right: 10px;
  border-radius: 12px; background: var(--panel); border: 1px solid var(--line); box-shadow: var(--drop); cursor: pointer;
  transition: border-color 150ms var(--ease), background-color 150ms var(--ease);
}
.ui-ats__lrow:hover { border-color: var(--line-firm); }
.ui-ats__lrow[data-focus] { background: var(--frame); }
.ui-ats__lrow[data-selected] { background: var(--info-fill); border-color: var(--info-line); }
.ui-ats__lrow[data-selected]::before { content: ""; position: absolute; left: -1px; top: 12px; bottom: 12px; width: 2px; border-radius: 2px; background: var(--berry); }
.ui-ats__lrow[data-hit] { animation: ui-ats-hit 1.6s var(--ease) 2; }
.ui-ats__lside { flex: none; display: flex; flex-direction: column; align-items: flex-end; gap: 4px; width: 84px; font-size: 12px; }
.ui-ats__lside .ui-ats__bar { width: 100%; }

.ui-ats__empty { position: absolute; inset: 0; display: grid; place-content: center; justify-items: center; gap: 10px; padding: 24px; text-align: center; }
.ui-ats__empty p { margin: 0; max-width: 300px; color: var(--muted); }

/* footer */
.ui-ats__foot { padding: 8px 8px 4px; display: flex; flex-direction: column; gap: 8px; }
.ui-ats__inspect { display: flex; align-items: center; gap: 10px; min-height: 44px; padding: 0 4px; }
.ui-ats__inspect .ui-ats__name { font-size: 15px; font-family: "Avenir Next Condensed", "Avenir Next", Avenir, system-ui, sans-serif; }
.ui-ats__itask { font-size: 12.5px; color: var(--text); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ui-ats__secondary {
  flex: none; height: 32px; padding: 0 12px; border-radius: 10px; background: var(--secondary); border: 1px solid var(--line-firm);
  color: var(--ink); font-weight: 600; font-size: 13px; box-shadow: var(--drop); white-space: nowrap;
}
.ui-ats__secondary:hover { border-color: var(--info-line); }
.ui-ats__help { margin: 0; display: flex; flex-wrap: wrap; gap: 4px 14px; padding: 0 4px 2px; font-size: 12px; color: var(--muted); }
.ui-ats__help > span { display: inline-flex; align-items: center; gap: 4px; }

/* narrow screens */
.ui-ats[data-narrow] .ui-ats__totals { margin: 0; width: 100%; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px; }
.ui-ats[data-narrow] .ui-ats__totals > div { align-items: flex-start; padding: 6px 8px; border-radius: 10px; background: var(--panel); border: 1px solid var(--line); }
.ui-ats[data-narrow] .ui-ats__search { flex: 1 1 100%; max-width: none; }
.ui-ats[data-narrow] .ui-ats__chips { flex-wrap: nowrap; overflow-x: auto; scrollbar-width: none; width: 100%; padding-bottom: 2px; }
.ui-ats[data-narrow] .ui-ats__queue { margin-left: 0; }
.ui-ats[data-narrow] .ui-ats__help { display: none; }
.ui-ats[data-narrow] .ui-ats__controls .ui-ats__vsep,
.ui-ats[data-narrow] .ui-ats__controls [data-extra] { display: none; }
.ui-ats[data-narrow] .ui-ats__inspect { flex-wrap: wrap; }
.ui-ats[data-narrow] .ui-ats__inspect .ui-ats__id { flex-basis: calc(100% - 40px); }
.ui-ats[data-narrow] .ui-ats__lside { width: 64px; }

@media (prefers-reduced-motion: reduce) {
  .ui-ats *, .ui-ats *::before, .ui-ats *::after { animation-duration: 1ms !important; animation-iteration-count: 1 !important; transition-property: color, background-color, border-color !important; }
  .ui-ats__spin { animation: none !important; }
  .ui-ats__total[data-climbing] { animation: none; }
}
`;
