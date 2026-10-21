var e=`"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";

/* Agent Tree Scale is Agent Tree for big organisations: the same cards, connectors and
   decisions, plus chiefs of staff and teams, folded rollups, focus on a branch, search,
   a "needs you" queue and capped rendering so thousands of agents stay smooth. */

export type ScaleAgentStatus = "queued" | "running" | "waiting" | "done" | "failed" | "stopped";
export type ScaleAgentKind = "root" | "chief" | "team" | "agent";

export type ScaleAgent = {
  id: string;
  /** Without it: an agent with children is a chief, one without is an agent */
  kind?: ScaleAgentKind;
  name: string;
  /** What this agent, chief or team was asked to do */
  task: string;
  model?: string;
  /** A logo or picture – sits on a white tile. Without it the initials show */
  avatar?: ReactNode;
  /** Small marks of the apps the agent works in */
  tools?: ReactNode[];
  status: ScaleAgentStatus;
  /** What a waiting agent needs you to decide */
  ask?: string;
  /** What went wrong for a failed agent */
  error?: string;
  /** This node's own spend – branches are added up for you */
  cost?: number;
  /** ms timestamps */
  started?: number;
  ended?: number;
  children?: ScaleAgent[];
};

export type ScaleResolveAction = "approve" | "reject" | "retry" | "dismiss";

export type AgentTreeScaleProps = {
  root: ScaleAgent;
  /** Branches open on first render. Without it, chiefs open until about 24 cards show; teams stay folded */
  defaultExpanded?: string[];
  onExpandedChange?: (expanded: string[]) => void;
  /** The branch shown as the top of the tree. Clicking a chief's or team's name changes it */
  defaultFocus?: string;
  onFocusChange?: (node: ScaleAgent) => void;
  onResolve?: (agent: ScaleAgent, action: ScaleResolveAction) => void;
  onSelect?: (agent: ScaleAgent) => void;
  /** Cards rendered per branch before a "Show more" row */
  pageSize?: number;
  now?: number;
  formatCost?: (amount: number) => string;
  title?: string;
  className?: string;
};

const WIDE_MIN = 560;
const GAP = 16;
const INDENT_WIDE = 24;
const INDENT_NARROW = 18;
const EASE = "cubic-bezier(.16, 1, .3, 1)";
const SVG_NS = "http://www.w3.org/2000/svg";
const OPEN_BUDGET = 24;
const DOTS_MAX = 28;

const nf = new Intl.NumberFormat("en-US");
const defaultCost = (n: number) => \`$\${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\`;
function duration(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  if (s < 60) return \`\${s}s\`;
  const m = Math.floor(s / 60);
  if (m < 60) return \`\${m}m \${String(s % 60).padStart(2, "0")}s\`;
  return \`\${Math.floor(m / 60)}h \${String(m % 60).padStart(2, "0")}m\`;
}
const initials = (name: string) =>
  name
    .split(/\\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

const STATUS_WORD: Record<ScaleAgentStatus, string> = {
  queued: "Queued",
  running: "Running",
  waiting: "Needs you",
  done: "Done",
  failed: "Failed",
  stopped: "Stopped",
};
const DOT_ORDER: ScaleAgentStatus[] = ["waiting", "failed", "running", "queued", "stopped", "done"];

const kindOf = (a: ScaleAgent, isRoot: boolean): ScaleAgentKind =>
  a.kind ?? (isRoot ? "root" : a.children?.length ? "chief" : "agent");

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

/* ---------- index: everything added up once per data change ---------- */

type Counts = Record<ScaleAgentStatus, number>;
type Info = {
  node: ScaleAgent;
  kind: ScaleAgentKind;
  cost: number;
  climbing: boolean;
  descendants: number;
  /** Agents (leaves) under this node, itself included when it is one */
  agents: number;
  c: Counts;
  parent?: string;
  depth: number;
};
type Index = { map: Map<string, Info>; all: Info[]; waiting: string[] };

function buildIndex(root: ScaleAgent): Index {
  const map = new Map<string, Info>();
  const all: Info[] = [];
  const waiting: string[] = [];
  const walk = (a: ScaleAgent, depth: number, parent?: string): Info => {
    const kind = kindOf(a, depth === 0);
    const kids = a.children ?? [];
    const i: Info = {
      node: a,
      kind,
      cost: a.cost ?? 0,
      climbing: a.status === "running",
      descendants: 0,
      agents: 0,
      c: { queued: 0, running: 0, waiting: 0, done: 0, failed: 0, stopped: 0 },
      parent,
      depth,
    };
    map.set(a.id, i);
    all.push(i);
    if (!kids.length && kind === "agent") {
      i.agents = 1;
      i.c[a.status] += 1;
      if (a.status === "waiting") waiting.push(a.id);
    }
    for (const c of kids) {
      const ci = walk(c, depth + 1, a.id);
      i.cost += ci.cost;
      i.climbing ||= ci.climbing;
      i.descendants += 1 + ci.descendants;
      i.agents += ci.agents;
      for (const s of DOT_ORDER) i.c[s] += ci.c[s];
    }
    return i;
  };
  walk(root, 0);
  return { map, all, waiting };
}

function pathTo(ix: Index, id: string) {
  const out: string[] = [];
  for (let p: string | undefined = id; p; p = ix.map.get(p)?.parent) out.unshift(p);
  return out;
}

/** Opens a branch, then its chiefs breadth first, while the cards stay under a budget. Teams stay folded */
function autoOpen(ix: Index, start: string, budget: number, into = new Set<string>()) {
  const s = ix.map.get(start);
  const kids = s?.node.children ?? [];
  if (!s || !kids.length) return into;
  into.add(start);
  let used = kids.length;
  const queue = s.kind === "team" ? [] : [...kids];
  while (queue.length) {
    const n = queue.shift()!;
    const i = ix.map.get(n.id);
    const ch = n.children ?? [];
    if (!i || i.kind === "team" || i.kind === "agent" || !ch.length || used + ch.length > budget) continue;
    into.add(n.id);
    used += ch.length;
    queue.push(...ch);
  }
  return into;
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
const Glyph = ({ status }: { status: ScaleAgentStatus }) => {
  const common = { width: 11, height: 11, viewBox: "0 0 16 16", "aria-hidden": true, focusable: false } as const;
  if (status === "running")
    return (
      <svg {...common} className="ui-at-scale__spin">
        <circle cx="8" cy="8" r="5.6" fill="none" stroke="currentColor" strokeOpacity=".25" strokeWidth="2" />
        <path d="M8 2.4a5.6 5.6 0 0 1 5.6 5.6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  if (status === "done")
    return (
      <svg {...common}>
        <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  if (status === "failed")
    return (
      <svg {...common}>
        <path fill="currentColor" d="M7.1 2.3a1 1 0 0 1 1.8 0l5.6 10.2a1 1 0 0 1-.9 1.5H2.4a1 1 0 0 1-.9-1.5L7.1 2.3Z" />
      </svg>
    );
  if (status === "waiting")
    return (
      <svg {...common}>
        <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8 4.8V8l2.2 1.4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  return (
    <svg {...common}>
      <circle cx="8" cy="8" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeDasharray="2 2.4" />
    </svg>
  );
};
/* Chevron after Hugeicons Free (MIT) – arrow-down-01 */
const Chevron = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true" focusable="false" className="ui-at-scale__chev">
    <path d="M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const SearchIcon = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
    <circle cx="7" cy="7" r="4.6" fill="none" stroke="currentColor" strokeWidth="1.6" />
    <path d="M10.5 10.5 14 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);
const ChiefMark = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true" focusable="false" style={{ color: "#1a3e70" }}>
    <circle cx="8" cy="4" r="2" fill="currentColor" />
    <path d="M8 6.5V9M3.5 12V9h9v3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="3.5" cy="13" r="1.4" fill="currentColor" />
    <circle cx="12.5" cy="13" r="1.4" fill="currentColor" />
  </svg>
);
const TeamMark = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true" focusable="false" style={{ color: "#2f6fc4" }}>
    <circle cx="5" cy="5.5" r="2.2" fill="currentColor" />
    <circle cx="11" cy="5.5" r="2.2" fill="currentColor" opacity=".7" />
    <circle cx="8" cy="11" r="2.2" fill="currentColor" opacity=".45" />
  </svg>
);

/* ---------- component ---------- */

export function AgentTreeScale({
  root,
  defaultExpanded,
  onExpandedChange,
  defaultFocus,
  onFocusChange,
  onResolve,
  onSelect,
  pageSize = 40,
  now: nowProp,
  formatCost = defaultCost,
  title = "Agents",
  className,
}: AgentTreeScaleProps) {
  const uid = useId();
  const reduced = useReducedMotion();
  const ix = useMemo(() => buildIndex(root), [root]);
  const info = ix.map;

  /* Focus: the branch drawn as the top of the tree */
  const [focusRaw, setFocusRaw] = useState(defaultFocus ?? root.id);
  const focusId = info.has(focusRaw) && (info.get(focusRaw)!.node.children?.length ?? 0) > 0 ? focusRaw : root.id;
  const top = info.get(focusId)!.node;
  const topInfo = info.get(focusId)!;

  /* Clock */
  const anyRunning = ix.map.get(root.id)!.climbing;
  const [tick, setTick] = useState(() => Date.now());
  useEffect(() => {
    if (nowProp !== undefined || !anyRunning) return;
    setTick(Date.now());
    const id = window.setInterval(() => setTick(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [nowProp, anyRunning]);
  const now = nowProp ?? tick;

  /* Folding: big branches start folded */
  const [open, setOpenState] = useState<Set<string>>(() =>
    defaultExpanded ? new Set(defaultExpanded) : autoOpen(ix, focusRaw, OPEN_BUDGET),
  );
  const openRef = useRef(open);
  openRef.current = open;
  const setOpen = (next: Set<string>) => {
    openRef.current = next;
    setOpenState(next);
    onExpandedChange?.([...next]);
  };
  const [closing, setClosing] = useState<string | null>(null);
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);
  const toggle = (id: string) => {
    if (!openRef.current.has(id)) return setOpen(new Set(openRef.current).add(id));
    const close = () => {
      const next = new Set(openRef.current);
      next.delete(id);
      setOpen(next);
    };
    if (reduced || document.hidden) return close();
    setClosing(id);
    timers.current.push(
      window.setTimeout(() => {
        setClosing(null);
        close();
      }, 260),
    );
  };

  /* Windowing: a branch renders its first cards, then a "Show more" row */
  const [shownMore, setShownMore] = useState<Record<string, number>>({});
  const limitOf = (id: string) => pageSize + (shownMore[id] ?? 0);

  /* Layout: wide or narrow, and one card width for everyone */
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    // 16 = the wrap's side padding
    const measure = () => setWidth(el.clientWidth - 16);
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const visibleKids = (a: ScaleAgent) => (open.has(a.id) ? (a.children ?? []).slice(0, limitOf(a.id)) : []);
  const deepest = (a: ScaleAgent, d: number): number => Math.max(d, ...visibleKids(a).map((c) => deepest(c, d + 1)));
  const level1 = visibleKids(top);
  const below1 = level1.length ? Math.max(...level1.map((c) => deepest(c, 0))) : 0;
  const wideCard = level1.length ? (width - (level1.length - 1) * GAP) / level1.length - INDENT_WIDE * below1 : width;
  const wide = width >= WIDE_MIN && wideCard >= 168;
  const cardW = Math.round(
    wide ? Math.min(240, wideCard) : Math.max(180, Math.min(300, width - INDENT_NARROW * Math.min(deepest(top, 0), 6))),
  );

  /* Totals + announcement – for the branch in focus */
  const counts = { agents: topInfo.agents, running: topInfo.c.running, waiting: topInfo.c.waiting, failed: topInfo.c.failed };
  const total = topInfo.cost;
  const summary = [
    \`\${nf.format(counts.agents)} \${counts.agents === 1 ? "agent" : "agents"}\`,
    counts.running ? \`\${nf.format(counts.running)} running\` : "",
    counts.waiting ? \`\${nf.format(counts.waiting)} needs you\` : "",
    counts.failed ? \`\${nf.format(counts.failed)} failed\` : "",
  ].filter(Boolean);
  const [announce, setAnnounce] = useState("");
  const announceKey = \`\${top.name}: \${summary.join(", ")}\`;
  useEffect(() => {
    const id = window.setTimeout(() => setAnnounce(\`\${announceKey}, \${formatCost(total)}\`), 600);
    return () => window.clearTimeout(id);
  }, [announceKey]); // eslint-disable-line react-hooks/exhaustive-deps

  /* New cards rise in, one after another */
  const seen = useRef<Set<string> | null>(null);
  if (seen.current === null) seen.current = new Set(ix.all.map((a) => a.node.id));
  const fresh = new Map<string, number>();
  for (const a of ix.all) if (!seen.current.has(a.node.id) && fresh.size < 60) fresh.set(a.node.id, fresh.size);
  useEffect(() => {
    for (const a of ix.all) seen.current!.add(a.node.id);
  }, [ix]);

  /* ----- connectors, drawn imperatively so they can follow cards frame by frame ----- */
  const svgRef = useRef<SVGSVGElement>(null);
  const cardRefs = useRef(new Map<string, HTMLElement>());
  const paths = useRef(new Map<string, SVGPathElement>());
  const dots = useRef(new Map<string, SVGCircleElement>());
  const firstDraw = useRef(true);
  const geometry = useRef({ wide, rootId: focusId });
  geometry.current = { wide, rootId: focusId };
  const links = useMemo(() => {
    const out: { key: string; parent: string; child: string; muted: boolean; leaving: boolean }[] = [];
    const walk = (a: ScaleAgent, leaving: boolean) => {
      for (const c of visibleKids(a)) {
        const l = leaving || closing === a.id;
        out.push({ key: \`\${a.id}>\${c.id}\`, parent: a.id, child: c.id, muted: c.status === "queued" || c.status === "stopped", leaving: l });
        walk(c, l);
      }
    };
    walk(top, false);
    return out;
  }, [top, open, closing, shownMore]); // eslint-disable-line react-hooks/exhaustive-deps
  const linksRef = useRef(links);
  linksRef.current = links;

  const draw = useCallback(() => {
    const svg = svgRef.current;
    const wrap = wrapRef.current;
    if (!svg || !wrap) return;
    const base = wrap.getBoundingClientRect();
    svg.setAttribute("width", String(wrap.clientWidth));
    svg.setAttribute("height", String(wrap.scrollHeight));
    const rect = (id: string) => {
      const el = cardRefs.current.get(id);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { l: r.left - base.left, r: r.right - base.left, t: r.top - base.top, b: r.bottom - base.top, cx: r.left - base.left + r.width / 2 };
    };
    const { wide: isWide, rootId } = geometry.current;
    const keep = new Set<string>();
    const keepDots = new Set<string>();
    const animateNew = !firstDraw.current && !document.hidden && !reduced;
    for (const link of linksRef.current) {
      const p = rect(link.parent);
      const c = rect(link.child);
      if (!p || !c) continue;
      let d: string;
      let dot: [number, number];
      if (isWide && link.parent === rootId) {
        const y0 = p.b;
        const bus = y0 + (c.t - y0) / 2;
        const dx = c.cx - p.cx;
        const r = Math.min(8, Math.abs(dx) / 2, (c.t - bus) / 2);
        dot = [p.cx, y0];
        d =
          Math.abs(dx) < 1
            ? \`M \${p.cx} \${y0} V \${c.t}\`
            : \`M \${p.cx} \${y0} V \${bus - r} Q \${p.cx} \${bus} \${p.cx + Math.sign(dx) * r} \${bus} H \${c.cx - Math.sign(dx) * r} Q \${c.cx} \${bus} \${c.cx} \${bus + r} V \${c.t}\`;
      } else {
        const x = p.l + (isWide ? 18 : 14);
        const y = c.t + 22;
        const r = Math.min(8, Math.max(0, c.l - x) / 2);
        dot = [x, p.b];
        d = \`M \${x} \${p.b} V \${y - r} Q \${x} \${y} \${x + r} \${y} H \${c.l}\`;
      }
      keep.add(link.key);
      let path = paths.current.get(link.key);
      if (!path) {
        path = document.createElementNS(SVG_NS, "path");
        path.setAttribute("class", "ui-at-scale__link");
        svg.appendChild(path);
        paths.current.set(link.key, path);
        path.setAttribute("d", d);
        if (animateNew && typeof path.animate === "function") {
          const len = path.getTotalLength();
          path.animate([{ strokeDasharray: \`\${len}\`, strokeDashoffset: len }, { strokeDasharray: \`\${len}\`, strokeDashoffset: 0 }], {
            duration: 360,
            easing: EASE,
          });
        }
      } else path.setAttribute("d", d);
      path.toggleAttribute("data-muted", link.muted);
      if (link.leaving && !path.hasAttribute("data-leaving") && animateNew) {
        path.setAttribute("data-leaving", "");
        const len = path.getTotalLength();
        path.animate([{ strokeDasharray: \`\${len}\`, strokeDashoffset: 0 }, { strokeDasharray: \`\${len}\`, strokeDashoffset: len }], {
          duration: 240,
          easing: EASE,
          fill: "forwards",
        });
      }
      keepDots.add(link.parent);
      let circle = dots.current.get(link.parent);
      if (!circle) {
        circle = document.createElementNS(SVG_NS, "circle");
        circle.setAttribute("class", "ui-at-scale__dot");
        circle.setAttribute("r", "3.5");
        svg.appendChild(circle);
        dots.current.set(link.parent, circle);
      }
      circle.setAttribute("cx", String(dot[0]));
      circle.setAttribute("cy", String(dot[1]));
    }
    paths.current.forEach((path, key) => {
      if (!keep.has(key)) {
        path.remove();
        paths.current.delete(key);
      }
    });
    dots.current.forEach((circle, key) => {
      if (!keepDots.has(key)) {
        circle.remove();
        dots.current.delete(key);
      }
    });
    // Dots sit on top of the lines
    dots.current.forEach((circle) => svg.appendChild(circle));
    firstDraw.current = false;
  }, [reduced]);

  /* FLIP: cards glide to their new place, the connectors follow */
  const before = useRef<Map<string, DOMRect> | null>(null);
  const focusChanged = useRef(false);
  // Measure only when cards appear, leave or the width changes – live ticks do not move cards
  const shape = \`\${width}|\${focusId}|\${links.map((l) => l.key).join(",")}\`;
  const lastShape = useRef(shape);
  const reshaped = lastShape.current !== shape;
  if (typeof window !== "undefined" && cardRefs.current.size && reshaped) {
    const m = new Map<string, DOMRect>();
    cardRefs.current.forEach((el, id) => m.set(id, el.getBoundingClientRect()));
    before.current = m;
  }
  const raf = useRef(0);
  useLayoutEffect(() => {
    lastShape.current = shape;
    const prev = before.current;
    before.current = null;
    let moved = false;
    if (prev && !reduced && !document.hidden && !focusChanged.current) {
      cardRefs.current.forEach((el, id) => {
        const from = prev.get(id);
        if (!from || typeof el.animate !== "function") return;
        el.getAnimations().forEach((a) => {
          if ((a as Animation & { id?: string }).id === "flip") a.cancel();
        });
        const to = el.getBoundingClientRect();
        const dx = from.left - to.left;
        const dy = from.top - to.top;
        if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
        const anim = el.animate([{ transform: \`translate(\${dx}px, \${dy}px)\` }, { transform: "translate(0, 0)" }], {
          duration: 420,
          easing: EASE,
        });
        anim.id = "flip";
        moved = true;
      });
    }
    focusChanged.current = false;
    draw();
    if (moved) {
      cancelAnimationFrame(raf.current);
      const end = performance.now() + 460;
      const loop = () => {
        draw();
        if (performance.now() < end) raf.current = requestAnimationFrame(loop);
      };
      raf.current = requestAnimationFrame(loop);
    }
  });
  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => draw());
    ro.observe(wrap);
    const tree = wrap.firstElementChild;
    if (tree) ro.observe(tree);
    return () => ro.disconnect();
  }, [draw]);

  /* ----- decision window ----- */
  const [openAsk, setOpenAsk] = useState<string | null>(null);
  const pillRefs = useRef(new Map<string, HTMLButtonElement>());
  const dialogRef = useRef<HTMLDivElement>(null);
  const askAgent = openAsk ? info.get(openAsk)?.node : undefined;
  useEffect(() => {
    if (openAsk && (!askAgent || (askAgent.status !== "waiting" && askAgent.status !== "failed"))) setOpenAsk(null);
  });
  useEffect(() => {
    if (!openAsk) return;
    // Move focus only when the person is working in the tree – never steal it from elsewhere on the page
    const active = document.activeElement;
    if (!active || active === document.body || wrapRef.current?.contains(active)) {
      dialogRef.current?.querySelector<HTMLButtonElement>("button")?.focus({ preventScroll: true });
    }
    const onDoc = (e: PointerEvent) => {
      const t = e.target as Node;
      if (dialogRef.current?.contains(t) || pillRefs.current.get(openAsk)?.contains(t)) return;
      setOpenAsk(null);
    };
    document.addEventListener("pointerdown", onDoc);
    return () => document.removeEventListener("pointerdown", onDoc);
  }, [openAsk]);
  const closeAsk = () => {
    const id = openAsk;
    setOpenAsk(null);
    const active = document.activeElement;
    if (id && (!active || active === document.body || wrapRef.current?.contains(active))) {
      pillRefs.current.get(id)?.focus({ preventScroll: true });
    }
  };
  const resolve = (a: ScaleAgent, action: ScaleResolveAction) => {
    onResolve?.(a, action);
    closeAsk();
  };

  /* ----- focus a branch, jump to an agent ----- */
  const focusBranch = (id: string) => {
    const i = info.get(id);
    if (!i || !i.node.children?.length) return;
    focusChanged.current = true;
    setFocusRaw(id);
    setOpenAsk(null);
    const next = new Set(openRef.current);
    autoOpen(ix, id, OPEN_BUDGET, next);
    setOpen(next);
    onFocusChange?.(i.node);
  };
  const goUp = () => {
    const p = info.get(focusId)?.parent;
    if (p) focusBranch(p);
  };

  const [hit, setHit] = useState<string | null>(null);
  const reveal = useRef<{ id: string; focusPill: boolean } | null>(null);
  const jumpTo = (id: string, focusPill = false) => {
    const i = info.get(id);
    if (!i) return;
    const path = pathTo(ix, id);
    // Stay in the branch in focus when the agent is inside it, else go back to the top
    if (!path.includes(focusId)) {
      focusChanged.current = true;
      setFocusRaw(root.id);
    }
    // Keep the chiefs that are open, fold the teams opened before: one team of cards at a time
    const next = new Set<string>();
    openRef.current.forEach((id) => {
      if (info.get(id)?.kind !== "team") next.add(id);
    });
    const more = { ...shownMore };
    for (let k = 0; k < path.length - 1; k++) {
      const pid = path[k];
      next.add(pid);
      const siblings = info.get(pid)!.node.children ?? [];
      const at = siblings.findIndex((c) => c.id === path[k + 1]);
      const need = at + 1 - pageSize;
      if (need > (more[pid] ?? 0)) more[pid] = Math.ceil(need / pageSize) * pageSize;
    }
    if (i.node.children?.length && i.kind !== "team") autoOpen(ix, id, 8, next);
    setOpen(next);
    setShownMore(more);
    setHit(id);
    reveal.current = { id, focusPill };
  };
  useLayoutEffect(() => {
    const r = reveal.current;
    if (!r) return;
    const el = cardRefs.current.get(r.id);
    if (!el) return;
    reveal.current = null;
    el.scrollIntoView?.({ block: "center", behavior: reduced ? "auto" : "smooth" });
    if (r.focusPill) pillRefs.current.get(r.id)?.focus({ preventScroll: true });
  });
  useEffect(() => {
    if (!hit) return;
    const t = window.setTimeout(() => setHit(null), 2400);
    return () => window.clearTimeout(t);
  }, [hit]);

  /* Needs-you queue: steps through waiting agents in tree order */
  const [lastJump, setLastJump] = useState<string | null>(null);
  const nextWaiting = () => {
    const list = ix.waiting;
    if (!list.length) return;
    const n = (list.indexOf(lastJump ?? "") + 1) % list.length;
    setLastJump(list[n]);
    jumpTo(list[n], true);
  };

  /* Search */
  const [q, setQ] = useState("");
  const [qOpen, setQOpen] = useState(false);
  const [opt, setOpt] = useState(0);
  const searchRef = useRef<HTMLInputElement>(null);
  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return [] as Info[];
    const starts: Info[] = [];
    const has: Info[] = [];
    for (const i of ix.all) {
      const name = i.node.name.toLowerCase();
      if (name.startsWith(t)) starts.push(i);
      else if (has.length < 8 && (name.includes(t) || i.node.task.toLowerCase().includes(t))) has.push(i);
      if (starts.length >= 8) break;
    }
    return [...starts, ...has].slice(0, 8);
  }, [q, ix]);
  const pick = (i: Info | undefined) => {
    if (!i) return;
    setQOpen(false);
    jumpTo(i.node.id);
  };
  const onSearchKey = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setQOpen(true);
      setOpt((o) => Math.min(results.length - 1, o + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setOpt((o) => Math.max(0, o - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      pick(results[opt] ?? results[0]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      if (qOpen && q) setQOpen(false);
      else setQ("");
    }
  };
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "/" || e.ctrlKey || e.metaKey || e.altKey) return;
      const a = document.activeElement as HTMLElement | null;
      const editable = !!a && (a.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName));
      const inside = !!a && !!rootRef.current?.contains(a);
      if (editable || (!inside && a && a !== document.body)) return;
      e.preventDefault();
      searchRef.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  /* ----- render ----- */
  const renderNode = (a: ScaleAgent, depth: number, leaving: boolean, leaveIndex: number): ReactNode => {
    const i = info.get(a.id)!;
    const kids = a.children ?? [];
    const folded = !open.has(a.id);
    const isClosing = closing === a.id;
    const shown = folded ? [] : kids.slice(0, limitOf(a.id));
    const group = kids.length > 0;
    const time = a.started != null ? duration((a.ended ?? (a.status === "running" || a.status === "waiting" ? now : a.started)) - a.started) : null;
    const askable = !group && (a.status === "waiting" || a.status === "failed");
    const order = fresh.get(a.id);
    const style: CSSProperties = {};
    if (order !== undefined) style.animationDelay = \`\${order * 90}ms\`;
    if (leaving) style.animationDelay = \`\${leaveIndex * 50}ms\`;
    const focusable = group && a.id !== focusId;
    const avatar = a.avatar ?? (i.kind === "chief" ? <ChiefMark /> : i.kind === "team" ? <TeamMark /> : null);
    const label = group
      ? \`\${a.name}, \${i.kind === "team" ? "team" : "chief of staff"}, \${nf.format(i.agents)} agents\${i.c.running ? \`, \${nf.format(i.c.running)} running\` : ""}\${i.c.waiting ? \`, \${nf.format(i.c.waiting)} need you\` : ""}\${i.c.failed ? \`, \${nf.format(i.c.failed)} failed\` : ""}\`
      : \`\${a.name}, \${STATUS_WORD[a.status]}\`;

    let dotsRow: ReactNode = null;
    if (i.kind === "team" && folded && i.agents) {
      const list: ScaleAgentStatus[] = [];
      for (const s of DOT_ORDER) for (let k = 0; k < i.c[s] && list.length < DOTS_MAX; k++) list.push(s);
      dotsRow = (
        <button
          type="button"
          className="ui-at-scale__dots"
          aria-label={\`Show the \${nf.format(i.agents)} agents of \${a.name}\`}
          onClick={() => toggle(a.id)}
        >
          {list.map((s, k) => (
            <span key={k} data-status={s} />
          ))}
          {i.agents > list.length ? <span className="ui-at-scale__dots-more">+{nf.format(i.agents - list.length)}</span> : null}
        </button>
      );
    }

    return (
      <li
        key={a.id}
        role="treeitem"
        aria-label={label}
        aria-expanded={group ? !folded : undefined}
        aria-selected={false}
        className="ui-at-scale__item"
      >
        <div
          ref={(el) => {
            if (el) cardRefs.current.set(a.id, el);
            else cardRefs.current.delete(a.id);
          }}
          className="ui-at-scale__node"
          data-status={a.status}
          data-kind={i.kind}
          data-rise={order !== undefined || undefined}
          data-leaving={leaving || undefined}
          data-hit={hit === a.id || undefined}
          style={style}
        >
          <div className="ui-at-scale__card" data-selectable={onSelect ? "" : undefined}>
            {onSelect ? (
              <button type="button" className="ui-at-scale__select" aria-label={\`Open \${a.name}\`} onClick={() => onSelect(a)} />
            ) : null}
            <div className="ui-at-scale__top">
              <span className="ui-at-scale__avatar" aria-hidden="true">
                {avatar ?? <span className="ui-at-scale__initials">{initials(a.name)}</span>}
              </span>
              <span className="ui-at-scale__id">
                {focusable ? (
                  <button
                    type="button"
                    className="ui-at-scale__name ui-at-scale__name--link"
                    aria-label={\`Focus on \${a.name}\`}
                    onClick={() => focusBranch(a.id)}
                  >
                    {a.name}
                  </button>
                ) : (
                  <span className="ui-at-scale__name">{a.name}</span>
                )}
                {a.model ? <span className="ui-at-scale__model">{a.model}</span> : null}
              </span>
              {askable ? (
                <button
                  type="button"
                  ref={(el) => {
                    if (el) pillRefs.current.set(a.id, el);
                    else pillRefs.current.delete(a.id);
                  }}
                  className="ui-at-scale__pill ui-at-scale__pill--button"
                  data-status={a.status}
                  aria-expanded={openAsk === a.id}
                  aria-haspopup="dialog"
                  aria-controls={openAsk === a.id ? \`\${uid}-ask\` : undefined}
                  onClick={() => setOpenAsk(openAsk === a.id ? null : a.id)}
                >
                  <Glyph status={a.status} />
                  {a.status === "waiting" ? "Needs you" : "Failed"}
                </button>
              ) : (
                <span className="ui-at-scale__pill" data-status={a.status}>
                  <Glyph status={a.status} />
                  {STATUS_WORD[a.status]}
                </span>
              )}
            </div>
            <p className="ui-at-scale__task">
              {a.tools?.length ? (
                <span className="ui-at-scale__tools" aria-hidden="true">
                  {a.tools.slice(0, 3).map((t, k) => (
                    <span key={k} className="ui-at-scale__tool">
                      {t}
                    </span>
                  ))}
                </span>
              ) : null}
              {a.task}
            </p>
            {dotsRow}
            {openAsk === a.id && askAgent ? (
              <div
                ref={dialogRef}
                id={\`\${uid}-ask\`}
                role="dialog"
                aria-label={a.status === "waiting" ? \`\${a.name} needs you\` : \`\${a.name} failed\`}
                className="ui-at-scale__ask"
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    e.preventDefault();
                    e.stopPropagation();
                    closeAsk();
                  }
                }}
              >
                <p className="ui-at-scale__ask-text">
                  {a.status === "waiting" ? a.ask ?? "This agent waits for your decision." : a.error ?? "This agent stopped with an error."}
                </p>
                <div className="ui-at-scale__ask-actions">
                  {a.status === "waiting" ? (
                    <>
                      <button type="button" className="ui-at-scale__btn ui-at-scale__btn--main" onClick={() => resolve(a, "approve")}>
                        Approve
                      </button>
                      <button type="button" className="ui-at-scale__btn" onClick={() => resolve(a, "reject")}>
                        Reject
                      </button>
                    </>
                  ) : (
                    <>
                      <button type="button" className="ui-at-scale__btn ui-at-scale__btn--main" onClick={() => resolve(a, "retry")}>
                        Retry
                      </button>
                      <button type="button" className="ui-at-scale__btn" onClick={() => resolve(a, "dismiss")}>
                        Dismiss
                      </button>
                    </>
                  )}
                </div>
              </div>
            ) : null}
          </div>
          <div className="ui-at-scale__foot">
            <span className="ui-at-scale__meta">
              <span className="ui-at-scale__cost" data-climbing={i.climbing || undefined}>
                {formatCost(i.cost)}
              </span>
              {group ? (
                <span className="ui-at-scale__roll" aria-hidden="true">
                  {i.c.running ? (
                    <span data-status="running">
                      <Glyph status="running" />
                      {nf.format(i.c.running)}
                    </span>
                  ) : null}
                  {i.c.waiting ? (
                    <span data-status="waiting">
                      <Glyph status="waiting" />
                      {nf.format(i.c.waiting)}
                    </span>
                  ) : null}
                  {i.c.failed ? (
                    <span data-status="failed">
                      <Glyph status="failed" />
                      {nf.format(i.c.failed)}
                    </span>
                  ) : null}
                </span>
              ) : time ? (
                <span className="ui-at-scale__time">· {time}</span>
              ) : null}
            </span>
            {group ? (
              <button
                type="button"
                className="ui-at-scale__fold"
                aria-label={\`\${folded ? "Show" : "Hide"} \${kids.length} \${i.kind === "team" ? "agent" : "sub-agent"}\${kids.length === 1 ? "" : "s"} of \${a.name}\`}
                aria-expanded={!folded}
                data-folded={folded || undefined}
                onClick={() => toggle(a.id)}
              >
                {folded ? \`+\${nf.format(i.descendants)}\` : nf.format(kids.length)}
                <Chevron />
              </button>
            ) : null}
          </div>
        </div>
        {shown.length ? (
          <ul role="group" className="ui-at-scale__group" data-depth={depth + 1}>
            {shown.map((c, k) => renderNode(c, depth + 1, leaving || isClosing, shown.length - k))}
            {kids.length > shown.length ? (
              <li role="none" className="ui-at-scale__item">
                <button
                  type="button"
                  className="ui-at-scale__more"
                  onClick={() => setShownMore({ ...shownMore, [a.id]: (shownMore[a.id] ?? 0) + pageSize })}
                >
                  Show {Math.min(pageSize, kids.length - shown.length)} more
                  <span> · {nf.format(kids.length - shown.length)} left</span>
                </button>
              </li>
            ) : null}
          </ul>
        ) : null}
      </li>
    );
  };

  const crumbs = pathTo(ix, focusId);
  const waitingCount = ix.waiting.length;
  const queueAt = lastJump ? ix.waiting.indexOf(lastJump) : -1;

  return (
    <div
      ref={rootRef}
      className={["ui-at-scale", className].filter(Boolean).join(" ")}
      onKeyDown={(e) => {
        if (e.key !== "Escape" || e.defaultPrevented || focusId === root.id) return;
        if ((e.target as HTMLElement).closest('[role="dialog"]')) return;
        e.preventDefault();
        goUp();
      }}
    >
      <style href="ui-agent-tree-scale" precedence="default">
        {css}
      </style>
      <div className="ui-at-scale__bar">
        <span className="ui-at-scale__mark">
          <Sparkle />
        </span>
        <h3 className="ui-at-scale__title">
          {crumbs.length > 1 ? (
            <nav aria-label="Branch" className="ui-at-scale__crumbs">
              <ol>
                {crumbs.map((id, k) => {
                  const last = k === crumbs.length - 1;
                  const name = k === 0 ? title : info.get(id)?.node.name;
                  return (
                    <li key={id}>
                      {k ? (
                        <span className="ui-at-scale__sep" aria-hidden="true">
                          ›
                        </span>
                      ) : null}
                      {last ? (
                        <span aria-current="location">{name}</span>
                      ) : (
                        <button type="button" onClick={() => focusBranch(id)}>
                          {name}
                        </button>
                      )}
                    </li>
                  );
                })}
              </ol>
            </nav>
          ) : (
            title
          )}
        </h3>
        <span className="ui-at-scale__totals" aria-hidden="true">
          <span>{summary[0]}</span>
          {counts.running ? <span data-kind="running">{nf.format(counts.running)} running</span> : null}
          {counts.waiting ? <span data-kind="waiting">{nf.format(counts.waiting)} needs you</span> : null}
          {counts.failed ? <span data-kind="failed">{nf.format(counts.failed)} failed</span> : null}
          <strong className="ui-at-scale__total" data-climbing={topInfo.climbing || undefined}>
            {formatCost(total)}
          </strong>
        </span>
        <div className="ui-at-scale__tools-row">
          <div className="ui-at-scale__search" role="search">
            <SearchIcon />
            <input
              ref={searchRef}
              type="search"
              className="ui-at-scale__field"
              placeholder="Find an agent or team"
              aria-label="Find an agent or team"
              role="combobox"
              aria-expanded={qOpen && !!q.trim()}
              aria-controls={\`\${uid}-results\`}
              aria-autocomplete="list"
              aria-activedescendant={qOpen && results[opt] ? \`\${uid}-opt-\${opt}\` : undefined}
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setOpt(0);
                setQOpen(true);
              }}
              onFocus={() => q && setQOpen(true)}
              onBlur={() => setQOpen(false)}
              onKeyDown={onSearchKey}
            />
            <kbd className="ui-at-scale__kbd" aria-hidden="true">
              /
            </kbd>
            {qOpen && q.trim() ? (
              <div className="ui-at-scale__results">
                <ul id={\`\${uid}-results\`} role="listbox" aria-label="Matches">
                  {results.map((r, k) => {
                    const where = pathTo(ix, r.node.id)
                      .slice(1, -1)
                      .map((id) => info.get(id)?.node.name)
                      .join(" › ");
                    return (
                      <li
                        key={r.node.id}
                        id={\`\${uid}-opt-\${k}\`}
                        role="option"
                        aria-selected={k === opt}
                        data-active={k === opt || undefined}
                        onPointerDown={(e) => e.preventDefault()}
                        onPointerEnter={() => setOpt(k)}
                        onClick={() => pick(r)}
                      >
                        <span className="ui-at-scale__pill" data-status={r.agents === 1 && !r.node.children?.length ? r.node.status : undefined}>
                          {r.node.children?.length ? nf.format(r.agents) : <Glyph status={r.node.status} />}
                        </span>
                        <span className="ui-at-scale__id">
                          <span className="ui-at-scale__name">{r.node.name}</span>
                          <span className="ui-at-scale__model">{where || (r.kind === "root" ? "Top" : "")}</span>
                        </span>
                      </li>
                    );
                  })}
                </ul>
                {!results.length ? <p className="ui-at-scale__empty">Nothing called “{q.trim()}”</p> : null}
              </div>
            ) : null}
          </div>
          <button
            type="button"
            className="ui-at-scale__btn ui-at-scale__btn--main ui-at-scale__queue"
            disabled={!waitingCount}
            onClick={nextWaiting}
          >
            <Glyph status="waiting" />
            {waitingCount ? (
              <>
                Needs you <span className="ui-at-scale__qn">{queueAt >= 0 ? \`\${queueAt + 1}/\${nf.format(waitingCount)}\` : nf.format(waitingCount)}</span>
              </>
            ) : (
              "Nobody needs you"
            )}
          </button>
        </div>
      </div>
      <div
        ref={wrapRef}
        className="ui-at-scale__wrap"
        data-layout={wide ? "wide" : "narrow"}
        style={{ "--card-w": \`\${cardW}px\` } as CSSProperties}
      >
        <ul role="tree" aria-label={top.name} className="ui-at-scale__tree">
          {renderNode(top, 0, false, 0)}
        </ul>
        <svg ref={svgRef} className="ui-at-scale__links" aria-hidden="true" />
      </div>
      <p className="ui-at-scale__sr" role="status" aria-live="polite">
        {announce}
      </p>
    </div>
  );
}

/* ---------- styles ---------- */

const css = /* css */ \`
.ui-at-scale {
  --frame: #f2f6fa; --panel: #ffffff; --soft: rgba(26, 62, 112, 0.06);
  --line: #dae2ec; --line-firm: #cbd6e4;
  --ink: #00162b; --text: rgba(0, 22, 43, 0.66); --muted: rgba(0, 22, 43, 0.54);
  --berry: #851437; --berry-hover: #6d0f2d;
  --info-ink: #1a3e70; --info-fill: #eef5ff; --info-line: #c1daff; --ring: #8fbdf2;
  --ok-ink: #1d6a34; --ok-fill: #eafbee; --ok-line: #c9f5cf;
  --wait-ink: #775810; --wait-fill: #fdf6dd; --wait-line: #fae6a0;
  --bad-ink: #8a3a22; --bad-fill: #fdeee8; --bad-line: #f5d5c9;
  --ui-agt-link: #8ebbf5; --link-muted: #cbd6e4; --mark: #2f6fc4;
  --tile: #ffffff; --secondary: #fbfcfe; --shine: #6f9fe0;
  --dot-run: #4b86d1; --dot-wait: #d9a514; --dot-fail: #c4573a; --dot-done: #3f9a5c; --dot-idle: #cbd6e4;
  --pebble-shade: inset 0 -2px 6px -4px rgba(26, 62, 112, 0.4);
  --drop: 0 8px 16px -8px rgba(26, 62, 112, 0.2);
  --raised: 0 18px 30px -16px rgba(26, 62, 112, 0.38), 0 4px 10px -6px rgba(26, 62, 112, 0.18);
  --float: 0 24px 48px -24px rgba(26, 62, 112, 0.3);
  --ease: cubic-bezier(.16, 1, .3, 1);
  box-sizing: border-box;
  position: relative;
  width: 100%;
  max-width: 820px;
  padding: 6px 6px 18px;
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
:where(.dark, [data-theme="dark"]) .ui-at-scale {
  --frame: #0f2747; --panel: #16345c; --soft: rgba(255, 255, 255, 0.07);
  --line: rgba(255, 255, 255, 0.12); --line-firm: rgba(255, 255, 255, 0.18);
  --ink: rgba(255, 255, 255, 0.94); --text: rgba(255, 255, 255, 0.72); --muted: rgba(255, 255, 255, 0.56);
  --berry: #a8204d; --berry-hover: #bd2a5a;
  --info-ink: #c1daff; --info-fill: rgba(143, 189, 242, 0.16); --info-line: rgba(143, 189, 242, 0.34); --ring: rgba(143, 189, 242, 0.6);
  --ok-ink: #7fe0a0; --ok-fill: rgba(127, 224, 160, 0.14); --ok-line: rgba(127, 224, 160, 0.3);
  --wait-ink: #f3d27a; --wait-fill: rgba(243, 210, 122, 0.14); --wait-line: rgba(243, 210, 122, 0.3);
  --bad-ink: #f2a48c; --bad-fill: rgba(242, 164, 140, 0.14); --bad-line: rgba(242, 164, 140, 0.3);
  --ui-agt-link: #8ebbf5; --link-muted: rgba(255, 255, 255, 0.2); --mark: #8fbdf2;
  --tile: #ffffff; --secondary: rgba(255, 255, 255, 0.06); --shine: rgba(255, 255, 255, 0.55);
  --dot-run: #7fb0ee; --dot-wait: #f3d27a; --dot-fail: #f2a48c; --dot-done: #7fe0a0; --dot-idle: rgba(255, 255, 255, 0.22);
  --pebble-shade: inset 0 -2px 6px -4px rgba(3, 12, 28, 0.8);
  --drop: 0 8px 16px -8px rgba(3, 12, 28, 0.6);
  --raised: 0 18px 30px -16px rgba(3, 12, 28, 0.8), 0 4px 10px -6px rgba(3, 12, 28, 0.6);
  --float: 0 24px 48px -24px rgba(3, 12, 28, 0.7);
}
.ui-at-scale *, .ui-at-scale *::before, .ui-at-scale *::after { box-sizing: border-box; }
.ui-at-scale :where(button) { font: inherit; color: inherit; cursor: pointer; }
.ui-at-scale :focus-visible { outline: none; box-shadow: 0 0 0 3px var(--ring); }
.ui-at-scale__sr {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0;
}

.ui-at-scale__bar { position: relative; z-index: 6; display: flex; align-items: center; flex-wrap: wrap; gap: 6px 8px; padding: 10px 12px 14px 14px; }
.ui-at-scale__mark { display: inline-flex; color: var(--mark); }
.ui-at-scale__title {
  margin: 0; min-width: 0; color: var(--ink); font-size: 16px; font-weight: 700; letter-spacing: 0;
  font-family: "Avenir Next Condensed", "Avenir Next", Avenir, system-ui, sans-serif;
}
.ui-at-scale__crumbs ol { display: flex; flex-wrap: wrap; align-items: center; gap: 0 4px; list-style: none; margin: 0; padding: 0; }
.ui-at-scale__crumbs li { display: inline-flex; align-items: center; gap: 4px; min-width: 0; }
.ui-at-scale__crumbs button {
  border: 0; background: transparent; padding: 0 2px; border-radius: 6px; color: var(--muted); font-weight: 700;
  transition: color 150ms var(--ease);
}
.ui-at-scale__crumbs button:hover { color: var(--ink); }
.ui-at-scale__sep { color: var(--muted); font-weight: 600; }
.ui-at-scale__totals {
  margin-left: auto; display: flex; flex-wrap: wrap; align-items: center; gap: 4px 14px;
  font-size: 13px; color: var(--muted); font-variant-numeric: tabular-nums;
}
.ui-at-scale__totals [data-kind="running"] { color: var(--info-ink); }
.ui-at-scale__totals [data-kind="waiting"] { color: var(--wait-ink); }
.ui-at-scale__totals [data-kind="failed"] { color: var(--bad-ink); }
.ui-at-scale__total { color: var(--ink); font-weight: 600; }

.ui-at-scale__tools-row { flex-basis: 100%; display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-top: 6px; }
.ui-at-scale__search { position: relative; flex: 1 1 200px; max-width: 280px; display: flex; align-items: center; color: var(--muted); }
.ui-at-scale__search > svg { position: absolute; left: 10px; pointer-events: none; }
.ui-at-scale__search > .ui-at-scale__kbd { position: absolute; right: 8px; pointer-events: none; }
.ui-at-scale__field {
  width: 100%; height: 30px; padding: 0 30px; border-radius: 10px; border: 1px solid var(--line-firm);
  background: var(--panel); color: var(--ink); font: inherit; font-size: 13px; caret-color: var(--berry);
  box-shadow: inset 0 1px 2px rgba(26, 62, 112, 0.08); -webkit-appearance: none; appearance: none;
}
.ui-at-scale__field::placeholder { color: var(--muted); }
.ui-at-scale__field::-webkit-search-cancel-button { display: none; }
.ui-at-scale__kbd {
  display: inline-grid; place-items: center; min-width: 18px; height: 18px; padding: 0 4px; border-radius: 5px;
  background: var(--tile); border: 1px solid var(--line); border-bottom-width: 2px; color: #1a3e70; font: 600 11px/1 "Avenir Next", Avenir, system-ui, sans-serif;
}
.ui-at-scale__results {
  position: absolute; z-index: 8; left: 0; top: calc(100% + 6px); width: max(100%, 260px); padding: 6px;
  border-radius: 12px; background: var(--panel); border: 1px solid var(--line-firm); box-shadow: var(--raised);
  animation: ui-at-scale-pop 150ms var(--ease);
}
.ui-at-scale__results ul { list-style: none; margin: 0; padding: 0; max-height: 300px; overflow: auto; }
.ui-at-scale__results li { position: relative; display: flex; align-items: center; gap: 8px; padding: 6px 8px; border-radius: 8px; cursor: pointer; }
.ui-at-scale__results li[data-active] { background: var(--info-fill); }
.ui-at-scale__results li[data-active]::before { content: ""; position: absolute; left: 0; top: 7px; bottom: 7px; width: 2px; border-radius: 2px; background: var(--berry); }
.ui-at-scale__results .ui-at-scale__pill { min-width: 30px; justify-content: center; font-variant-numeric: tabular-nums; }
.ui-at-scale__empty { margin: 4px 6px; font-size: 13px; color: var(--muted); }
.ui-at-scale__queue { display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; }
.ui-at-scale__queue:disabled { background: var(--ok-fill) !important; border-color: var(--ok-line) !important; color: var(--ok-ink) !important; box-shadow: none !important; cursor: default; }
.ui-at-scale__qn { padding: 0 6px; border-radius: 999px; background: rgba(255, 255, 255, 0.18); font-size: 12px; font-variant-numeric: tabular-nums; }

.ui-at-scale__wrap { position: relative; padding: 0 8px; }
.ui-at-scale__links { position: absolute; left: 0; top: 0; pointer-events: none; overflow: visible; }
.ui-at-scale__link { fill: none; stroke: var(--ui-agt-link); stroke-width: 1.5; stroke-linecap: round; }
.ui-at-scale__link[data-muted] { stroke: var(--link-muted); stroke-dasharray: 3 4; }
.ui-at-scale__dot { fill: var(--panel); stroke: var(--ui-agt-link); stroke-width: 1.5; }

.ui-at-scale__tree, .ui-at-scale__group { list-style: none; margin: 0; padding: 0; }
.ui-at-scale__item { display: flex; flex-direction: column; align-items: flex-start; }
.ui-at-scale__group { display: flex; flex-direction: column; gap: 12px; margin-top: 14px; }
.ui-at-scale__wrap[data-layout="narrow"] .ui-at-scale__group { margin-left: \${INDENT_NARROW}px; }
.ui-at-scale__wrap[data-layout="narrow"] .ui-at-scale__group .ui-at-scale__group .ui-at-scale__group .ui-at-scale__group .ui-at-scale__group .ui-at-scale__group { margin-left: 0; }
.ui-at-scale__wrap[data-layout="wide"] .ui-at-scale__tree > .ui-at-scale__item { align-items: center; }
.ui-at-scale__wrap[data-layout="wide"] .ui-at-scale__group[data-depth="1"] {
  flex-direction: row; align-items: flex-start; justify-content: center; gap: \${GAP}px; margin-top: 44px; align-self: stretch;
}
.ui-at-scale__wrap[data-layout="wide"] .ui-at-scale__group:not([data-depth="1"]) { margin-left: \${INDENT_WIDE}px; }

.ui-at-scale__node {
  position: relative; z-index: 1; width: var(--card-w); padding: 0 0 0; border-radius: 18px;
  background: var(--frame); border: 1px solid var(--line); box-shadow: var(--drop);
}
.ui-at-scale__node[data-rise] { animation: ui-at-scale-rise 420ms var(--ease) both; }
@keyframes ui-at-scale-rise { from { opacity: 0; transform: translateY(10px); } }
.ui-at-scale__node[data-leaving] { animation: ui-at-scale-leave 220ms var(--ease) both; }
@keyframes ui-at-scale-leave { to { opacity: 0; transform: translateY(-6px); } }
.ui-at-scale__node[data-status="queued"], .ui-at-scale__node[data-status="stopped"] { opacity: .72; }
.ui-at-scale__node[data-hit] { border-color: var(--info-line); animation: ui-at-scale-hit 1.2s var(--ease) 2; }
@keyframes ui-at-scale-hit {
  0%, 100% { box-shadow: 0 0 0 3px var(--info-fill), 0 0 0 4px var(--info-line), var(--drop); }
  50% { box-shadow: 0 0 0 8px var(--info-fill), 0 0 0 9px var(--info-line), var(--drop); }
}

.ui-at-scale__card {
  position: relative; margin: -1px -1px 0; padding: 10px 10px 10px; border-radius: 14px;
  background: var(--panel); border: 1px solid var(--line); box-shadow: var(--raised);
}
.ui-at-scale__card[data-selectable] { cursor: pointer; transition: border-color 150ms var(--ease); }
.ui-at-scale__card[data-selectable]:hover { border-color: var(--line-firm); }
.ui-at-scale__select { position: absolute; inset: 0; z-index: 0; border: 0; border-radius: 14px; background: transparent; padding: 0; }
.ui-at-scale__top { position: relative; display: flex; align-items: flex-start; gap: 8px; pointer-events: none; }
.ui-at-scale__top > .ui-at-scale__pill--button, .ui-at-scale__name--link { pointer-events: auto; }
.ui-at-scale__avatar {
  flex: none; width: 28px; height: 28px; display: grid; place-items: center; border-radius: 9px;
  background: var(--tile); border: 1px solid var(--line); box-shadow: var(--pebble-shade); overflow: hidden;
}
.ui-at-scale__avatar > svg, .ui-at-scale__avatar > img { width: 16px; height: 16px; }
.ui-at-scale__initials { font-size: 10.5px; font-weight: 700; color: #1a3e70; }
.ui-at-scale__id { min-width: 0; flex: 1; display: flex; flex-direction: column; align-items: flex-start; }
.ui-at-scale__name { max-width: 100%; color: var(--ink); font-weight: 700; font-size: 14px; line-height: 1.25; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ui-at-scale__name--link {
  position: relative; z-index: 1; padding: 0; border: 0; background: transparent; text-align: left; border-radius: 4px;
  text-decoration: underline; text-decoration-color: transparent; text-underline-offset: 3px;
  transition: text-decoration-color 150ms var(--ease), color 150ms var(--ease);
}
.ui-at-scale__name--link:hover { text-decoration-color: currentColor; color: var(--info-ink); }
.ui-at-scale__model { max-width: 100%; font-size: 12px; color: var(--muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ui-at-scale__pill {
  flex: none; display: inline-flex; align-items: center; gap: 4px; height: 22px; padding: 0 8px; border-radius: 999px;
  background: var(--soft); border: 1px solid var(--line); color: var(--muted); font-size: 11.5px; font-weight: 600; white-space: nowrap;
  transition: background-color 300ms var(--ease), color 300ms var(--ease), border-color 300ms var(--ease);
}
.ui-at-scale__pill[data-status="running"] { background: var(--info-fill); border-color: var(--info-line); color: var(--info-ink); }
.ui-at-scale__pill[data-status="done"] { background: var(--ok-fill); border-color: var(--ok-line); color: var(--ok-ink); }
.ui-at-scale__pill[data-status="waiting"] { background: var(--wait-fill); border-color: var(--wait-line); color: var(--wait-ink); }
.ui-at-scale__pill[data-status="failed"] { background: var(--bad-fill); border-color: var(--bad-line); color: var(--bad-ink); }
.ui-at-scale__pill--button { position: relative; z-index: 1; }
.ui-at-scale__pill--button:hover { filter: brightness(0.97); }
.ui-at-scale__spin { animation: ui-at-scale-spin 900ms linear infinite; }
@keyframes ui-at-scale-spin { to { transform: rotate(360deg); } }
.ui-at-scale__task { position: relative; margin: 8px 0 0; font-size: 13px; line-height: 1.4; color: var(--text); overflow-wrap: anywhere; pointer-events: none; }
.ui-at-scale__tools { display: inline-flex; vertical-align: -4px; margin-right: 6px; }
.ui-at-scale__tool {
  width: 18px; height: 18px; display: inline-grid; place-items: center; border-radius: 5px;
  background: var(--tile); border: 1px solid var(--line); box-shadow: 0 1px 2px rgba(26, 62, 112, 0.12);
}
.ui-at-scale__tool + .ui-at-scale__tool { margin-left: -4px; }
.ui-at-scale__tool > svg, .ui-at-scale__tool > img { width: 11px; height: 11px; }

.ui-at-scale__dots {
  position: relative; z-index: 1; display: flex; flex-wrap: wrap; align-items: center; gap: 4px; width: calc(100% + 8px);
  margin: 8px -4px 0; padding: 4px; border: 0; border-radius: 8px; background: transparent;
  transition: background-color 150ms var(--ease);
}
.ui-at-scale__dots:hover { background: var(--soft); }
.ui-at-scale__dots > span[data-status] {
  width: 8px; height: 8px; border-radius: 50%; background: var(--dot-idle);
  box-shadow: inset 0 -1px 2px rgba(0, 22, 43, 0.2); transition: background-color 300ms var(--ease);
}
.ui-at-scale__dots > span[data-status="running"] { background: var(--dot-run); }
.ui-at-scale__dots > span[data-status="waiting"] { background: var(--dot-wait); }
.ui-at-scale__dots > span[data-status="failed"] { background: var(--dot-fail); }
.ui-at-scale__dots > span[data-status="done"] { background: var(--dot-done); }
.ui-at-scale__dots-more { font-size: 11.5px; font-weight: 600; color: var(--muted); font-variant-numeric: tabular-nums; margin-left: 2px; }

.ui-at-scale__foot { display: flex; align-items: center; justify-content: space-between; gap: 8px; min-height: 32px; padding: 4px 6px 4px 10px; }
.ui-at-scale__meta { min-width: 0; display: inline-flex; align-items: center; font-size: 12.5px; color: var(--muted); font-variant-numeric: tabular-nums; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ui-at-scale__cost { color: var(--ink); font-weight: 600; }
.ui-at-scale__time { margin-left: 4px; }
.ui-at-scale__cost[data-climbing], .ui-at-scale__total[data-climbing] {
  background: linear-gradient(100deg, var(--ink) 40%, var(--shine) 50%, var(--ink) 60%) 0 0 / 250% 100%;
  -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
  animation: ui-at-scale-shimmer 2.2s linear infinite;
}
:where(.dark, [data-theme="dark"]) .ui-at-scale__cost[data-climbing],
:where(.dark, [data-theme="dark"]) .ui-at-scale__total[data-climbing] {
  background-image: linear-gradient(100deg, var(--ink) 40%, #8fbdf2 50%, var(--ink) 60%);
}
@keyframes ui-at-scale-shimmer { from { background-position: 100% 0; } to { background-position: -150% 0; } }
.ui-at-scale__roll { display: inline-flex; align-items: center; gap: 8px; margin-left: 8px; font-weight: 600; }
.ui-at-scale__roll > span { display: inline-flex; align-items: center; gap: 3px; }
.ui-at-scale__roll > [data-status="running"] { color: var(--info-ink); }
.ui-at-scale__roll > [data-status="waiting"] { color: var(--wait-ink); }
.ui-at-scale__roll > [data-status="failed"] { color: var(--bad-ink); }
.ui-at-scale__fold {
  flex: none; display: inline-flex; align-items: center; gap: 2px; height: 24px; padding: 0 6px; border: 0; border-radius: 7px;
  background: transparent; color: var(--muted); font-size: 12px; font-weight: 600; font-variant-numeric: tabular-nums;
  transition: background-color 150ms var(--ease), color 150ms var(--ease);
}
.ui-at-scale__fold:hover { background: var(--soft); color: var(--ink); }
.ui-at-scale__chev { transition: transform 150ms var(--ease); }
.ui-at-scale__fold[data-folded] .ui-at-scale__chev { transform: rotate(-90deg); }
.ui-at-scale__more {
  width: var(--card-w); max-width: 100%; height: 36px; padding: 0 12px; border-radius: 12px; border: 1px dashed var(--line-firm);
  background: transparent; color: var(--ink); font-size: 13px; font-weight: 600; text-align: left;
  transition: background-color 150ms var(--ease), border-color 150ms var(--ease);
}
.ui-at-scale__more > span { color: var(--muted); font-weight: 500; }
.ui-at-scale__more:hover { background: var(--soft); border-color: var(--info-line); }

.ui-at-scale__ask {
  position: absolute; z-index: 5; top: 40px; right: 8px; width: min(250px, calc(100% - 16px)); padding: 12px;
  border-radius: 12px; background: var(--panel); border: 1px solid var(--line-firm); box-shadow: var(--raised);
  animation: ui-at-scale-pop 150ms var(--ease);
}
@keyframes ui-at-scale-pop { from { opacity: 0; transform: translateY(-4px); } }
.ui-at-scale__ask-text { margin: 0; font-size: 13px; color: var(--ink); }
.ui-at-scale__ask-actions { display: flex; flex-direction: row-reverse; justify-content: flex-start; gap: 8px; margin-top: 10px; }
.ui-at-scale__btn {
  height: 30px; padding: 0 12px; border-radius: 10px; border: 1px solid var(--line-firm);
  background: var(--secondary); color: var(--ink); font-size: 13px; font-weight: 600; box-shadow: var(--drop);
  transition: background-color 150ms var(--ease);
}
.ui-at-scale__btn:hover { background: var(--soft); }
.ui-at-scale .ui-at-scale__btn--main {
  background: var(--berry); border-color: var(--berry); color: #fff;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 6px 12px -6px rgba(133, 20, 55, 0.6);
}
.ui-at-scale .ui-at-scale__btn--main:hover { background: var(--berry-hover); }

@media (pointer: coarse) {
  .ui-at-scale__fold { height: 32px; padding: 0 10px; }
  .ui-at-scale__btn { height: 38px; }
  .ui-at-scale__field { height: 38px; }
}
@media (prefers-reduced-motion: reduce) {
  .ui-at-scale *, .ui-at-scale *::before, .ui-at-scale *::after { transition-duration: 0ms !important; animation: none !important; }
  .ui-at-scale__cost[data-climbing], .ui-at-scale__total[data-climbing] { -webkit-text-fill-color: currentColor; background: none; }
  .ui-at-scale__node[data-hit] { box-shadow: 0 0 0 3px var(--info-fill), 0 0 0 4px var(--info-line), var(--drop); }
}
\`;
`;export{e as default};
