"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

export type TreeAgentStatus = "queued" | "running" | "waiting" | "done" | "failed" | "stopped";

export type TreeAgent = {
  id: string;
  name: string;
  /** What this agent was asked to do */
  task: string;
  model?: string;
  /** A logo or picture – sits on a white tile. Without it the initials show */
  avatar?: ReactNode;
  /** Small marks of the apps the agent works in */
  tools?: ReactNode[];
  status: TreeAgentStatus;
  /** What a waiting agent needs you to decide */
  ask?: string;
  /** What went wrong for a failed agent */
  error?: string;
  /** This agent's own spend – branches are added up for you */
  cost?: number;
  /** ms timestamps */
  started?: number;
  ended?: number;
  children?: TreeAgent[];
};

export type TreeResolveAction = "approve" | "reject" | "retry" | "dismiss";

export type AgentTreeProps = {
  root: TreeAgent;
  collapsed?: string[];
  defaultCollapsed?: string[];
  onCollapsedChange?: (collapsed: string[]) => void;
  onResolve?: (agent: TreeAgent, action: TreeResolveAction) => void;
  onSelect?: (agent: TreeAgent) => void;
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

const defaultCost = (n: number) => `$${n.toFixed(2)}`;
function duration(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ${String(s % 60).padStart(2, "0")}s`;
  return `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, "0")}m`;
}
const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

const STATUS_WORD: Record<TreeAgentStatus, string> = {
  queued: "Queued",
  running: "Running",
  waiting: "Needs you",
  done: "Done",
  failed: "Failed",
  stopped: "Stopped",
};

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

/* ---------- tree helpers ---------- */

type Info = { cost: number; climbing: boolean; descendants: number; parent?: string; depth: number };

function index(root: TreeAgent) {
  const map = new Map<string, Info>();
  const all: TreeAgent[] = [];
  const walk = (a: TreeAgent, depth: number, parent?: string): Info => {
    all.push(a);
    let cost = a.cost ?? 0;
    let climbing = a.status === "running";
    let descendants = 0;
    for (const c of a.children ?? []) {
      const i = walk(c, depth + 1, a.id);
      cost += i.cost;
      climbing ||= i.climbing;
      descendants += 1 + i.descendants;
    }
    const info = { cost, climbing, descendants, parent, depth };
    map.set(a.id, info);
    return info;
  };
  walk(root, 0);
  return { map, all };
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
const Glyph = ({ status }: { status: TreeAgentStatus }) => {
  const common = { width: 11, height: 11, viewBox: "0 0 16 16", "aria-hidden": true, focusable: false } as const;
  if (status === "running")
    return (
      <svg {...common} className="ui-at-tree__spin">
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
  <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true" focusable="false" className="ui-at-tree__chev">
    <path d="M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ---------- component ---------- */

export function AgentTree({
  root,
  collapsed: collapsedProp,
  defaultCollapsed = [],
  onCollapsedChange,
  onResolve,
  onSelect,
  now: nowProp,
  formatCost = defaultCost,
  title = "Agents",
  className,
}: AgentTreeProps) {
  const uid = useId();
  const reduced = useReducedMotion();
  const { map: info, all } = useMemo(() => index(root), [root]);

  /* Clock */
  const anyRunning = all.some((a) => a.status === "running");
  const [tick, setTick] = useState(() => Date.now());
  useEffect(() => {
    if (nowProp !== undefined || !anyRunning) return;
    setTick(Date.now());
    const id = window.setInterval(() => setTick(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [nowProp, anyRunning]);
  const now = nowProp ?? tick;

  /* Folding */
  const [innerCollapsed, setInnerCollapsed] = useState<string[]>(defaultCollapsed);
  const collapsed = collapsedProp ?? innerCollapsed;
  const [closing, setClosing] = useState<string | null>(null);
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);
  const setCollapsed = (next: string[]) => {
    if (collapsedProp === undefined) setInnerCollapsed(next);
    onCollapsedChange?.(next);
  };
  const toggle = (id: string) => {
    if (collapsed.includes(id)) return setCollapsed(collapsed.filter((x) => x !== id));
    if (reduced || document.hidden) return setCollapsed([...collapsed, id]);
    setClosing(id);
    timers.current.push(
      window.setTimeout(() => {
        setClosing(null);
        setCollapsed([...(collapsedProp ?? innerCollapsedRef.current), id]);
      }, 260),
    );
  };
  const innerCollapsedRef = useRef(innerCollapsed);
  innerCollapsedRef.current = collapsedProp ?? innerCollapsed;

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
  const visibleKids = (a: TreeAgent) => (collapsed.includes(a.id) ? [] : a.children ?? []);
  const deepest = (a: TreeAgent, d: number): number => Math.max(d, ...visibleKids(a).map((c) => deepest(c, d + 1)));
  const level1 = visibleKids(root);
  const below1 = level1.length ? Math.max(...level1.map((c) => deepest(c, 0))) : 0;
  const wideCard = level1.length ? (width - (level1.length - 1) * GAP) / level1.length - INDENT_WIDE * below1 : width;
  const wide = width >= WIDE_MIN && wideCard >= 168;
  const cardW = Math.round(
    wide ? Math.min(240, wideCard) : Math.max(180, Math.min(300, width - INDENT_NARROW * deepest(root, 0))),
  );

  /* Totals + announcement */
  const counts = {
    agents: all.length,
    running: all.filter((a) => a.status === "running").length,
    waiting: all.filter((a) => a.status === "waiting").length,
    failed: all.filter((a) => a.status === "failed").length,
  };
  const total = info.get(root.id)?.cost ?? 0;
  const summary = [
    `${counts.agents} ${counts.agents === 1 ? "agent" : "agents"}`,
    counts.running ? `${counts.running} running` : "",
    counts.waiting ? `${counts.waiting} needs you` : "",
    counts.failed ? `${counts.failed} failed` : "",
  ].filter(Boolean);
  const [announce, setAnnounce] = useState("");
  const announceKey = `${summary.join(", ")}`;
  useEffect(() => {
    const id = window.setTimeout(() => setAnnounce(`${announceKey}, ${formatCost(total)}`), 600);
    return () => window.clearTimeout(id);
  }, [announceKey]); // eslint-disable-line react-hooks/exhaustive-deps

  /* New cards rise in, one after another */
  const seen = useRef<Set<string> | null>(null);
  if (seen.current === null) seen.current = new Set(all.map((a) => a.id));
  const fresh = new Map<string, number>();
  all.forEach((a) => {
    if (!seen.current!.has(a.id)) fresh.set(a.id, fresh.size);
  });
  useEffect(() => {
    all.forEach((a) => seen.current!.add(a.id));
  });

  /* ----- connectors, drawn imperatively so they can follow cards frame by frame ----- */
  const svgRef = useRef<SVGSVGElement>(null);
  const cardRefs = useRef(new Map<string, HTMLElement>());
  const paths = useRef(new Map<string, SVGPathElement>());
  const dots = useRef(new Map<string, SVGCircleElement>());
  const firstDraw = useRef(true);
  const geometry = useRef({ wide, rootId: root.id });
  geometry.current = { wide, rootId: root.id };
  const links = useMemo(() => {
    const out: { key: string; parent: string; child: string; muted: boolean; leaving: boolean }[] = [];
    const walk = (a: TreeAgent, leaving: boolean) => {
      for (const c of visibleKids(a)) {
        const l = leaving || closing === a.id;
        out.push({ key: `${a.id}>${c.id}`, parent: a.id, child: c.id, muted: c.status === "queued" || c.status === "stopped", leaving: l });
        walk(c, l);
      }
    };
    walk(root, false);
    return out;
  }, [root, collapsed, closing]); // eslint-disable-line react-hooks/exhaustive-deps
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
            ? `M ${p.cx} ${y0} V ${c.t}`
            : `M ${p.cx} ${y0} V ${bus - r} Q ${p.cx} ${bus} ${p.cx + Math.sign(dx) * r} ${bus} H ${c.cx - Math.sign(dx) * r} Q ${c.cx} ${bus} ${c.cx} ${bus + r} V ${c.t}`;
      } else {
        const x = p.l + (isWide ? 18 : 14);
        const y = c.t + 22;
        const r = Math.min(8, Math.max(0, c.l - x) / 2);
        dot = [x, p.b];
        d = `M ${x} ${p.b} V ${y - r} Q ${x} ${y} ${x + r} ${y} H ${c.l}`;
      }
      keep.add(link.key);
      let path = paths.current.get(link.key);
      if (!path) {
        path = document.createElementNS(SVG_NS, "path");
        path.setAttribute("class", "ui-at-tree__link");
        svg.appendChild(path);
        paths.current.set(link.key, path);
        path.setAttribute("d", d);
        if (animateNew && typeof path.animate === "function") {
          const len = path.getTotalLength();
          path.animate([{ strokeDasharray: `${len}`, strokeDashoffset: len }, { strokeDasharray: `${len}`, strokeDashoffset: 0 }], {
            duration: 360,
            easing: EASE,
          });
        }
      } else path.setAttribute("d", d);
      path.toggleAttribute("data-muted", link.muted);
      if (link.leaving && !path.hasAttribute("data-leaving") && animateNew) {
        path.setAttribute("data-leaving", "");
        const len = path.getTotalLength();
        path.animate([{ strokeDasharray: `${len}`, strokeDashoffset: 0 }, { strokeDasharray: `${len}`, strokeDashoffset: len }], {
          duration: 240,
          easing: EASE,
          fill: "forwards",
        });
      }
      keepDots.add(link.parent);
      let circle = dots.current.get(link.parent);
      if (!circle) {
        circle = document.createElementNS(SVG_NS, "circle");
        circle.setAttribute("class", "ui-at-tree__dot");
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
  if (typeof window !== "undefined" && cardRefs.current.size) {
    const m = new Map<string, DOMRect>();
    cardRefs.current.forEach((el, id) => m.set(id, el.getBoundingClientRect()));
    before.current = m;
  }
  const raf = useRef(0);
  useLayoutEffect(() => {
    const prev = before.current;
    before.current = null;
    let moved = false;
    if (prev && !reduced && !document.hidden) {
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
        const anim = el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "translate(0, 0)" }], {
          duration: 420,
          easing: EASE,
        });
        anim.id = "flip";
        moved = true;
      });
    }
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
  const askAgent = openAsk ? all.find((a) => a.id === openAsk) : undefined;
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
  const resolve = (a: TreeAgent, action: TreeResolveAction) => {
    onResolve?.(a, action);
    closeAsk();
  };

  /* ----- render ----- */
  const renderNode = (a: TreeAgent, depth: number, leaving: boolean, leaveIndex: number): ReactNode => {
    const i = info.get(a.id)!;
    const kids = a.children ?? [];
    const folded = collapsed.includes(a.id);
    const isClosing = closing === a.id;
    const shown = folded ? [] : kids;
    const time = a.started != null ? duration((a.ended ?? (a.status === "running" || a.status === "waiting" ? now : a.started)) - a.started) : null;
    const askable = a.status === "waiting" || a.status === "failed";
    const order = fresh.get(a.id);
    const style: CSSProperties = {};
    if (order !== undefined) style.animationDelay = `${order * 90}ms`;
    if (leaving) style.animationDelay = `${leaveIndex * 50}ms`;
    return (
      <li
        key={a.id}
        role="treeitem"
        aria-label={`${a.name}, ${STATUS_WORD[a.status]}`}
        aria-expanded={kids.length ? !folded : undefined}
        aria-selected={false}
        className="ui-at-tree__item"
      >
        <div
          ref={(el) => {
            if (el) cardRefs.current.set(a.id, el);
            else cardRefs.current.delete(a.id);
          }}
          className="ui-at-tree__node"
          data-status={a.status}
          data-rise={order !== undefined || undefined}
          data-leaving={leaving || undefined}
          style={style}
        >
          <div className="ui-at-tree__card" data-selectable={onSelect ? "" : undefined}>
            {onSelect ? (
              <button
                type="button"
                className="ui-at-tree__select"
                aria-label={`Open ${a.name}`}
                onClick={() => onSelect(a)}
              />
            ) : null}
            <div className="ui-at-tree__top">
              <span className="ui-at-tree__avatar" aria-hidden="true">
                {a.avatar ?? <span className="ui-at-tree__initials">{initials(a.name)}</span>}
              </span>
              <span className="ui-at-tree__id">
                <span className="ui-at-tree__name">{a.name}</span>
                {a.model ? <span className="ui-at-tree__model">{a.model}</span> : null}
              </span>
              {askable ? (
                <button
                  type="button"
                  ref={(el) => {
                    if (el) pillRefs.current.set(a.id, el);
                    else pillRefs.current.delete(a.id);
                  }}
                  className="ui-at-tree__pill ui-at-tree__pill--button"
                  data-status={a.status}
                  aria-expanded={openAsk === a.id}
                  aria-haspopup="dialog"
                  aria-controls={openAsk === a.id ? `${uid}-ask` : undefined}
                  onClick={() => setOpenAsk(openAsk === a.id ? null : a.id)}
                >
                  <Glyph status={a.status} />
                  {a.status === "waiting" ? "Needs you" : "Failed"}
                </button>
              ) : (
                <span className="ui-at-tree__pill" data-status={a.status}>
                  <Glyph status={a.status} />
                  {STATUS_WORD[a.status]}
                </span>
              )}
            </div>
            <p className="ui-at-tree__task">
              {a.tools?.length ? (
                <span className="ui-at-tree__tools" aria-hidden="true">
                  {a.tools.slice(0, 3).map((t, k) => (
                    <span key={k} className="ui-at-tree__tool">
                      {t}
                    </span>
                  ))}
                </span>
              ) : null}
              {a.task}
            </p>
            {openAsk === a.id && askAgent ? (
              <div
                ref={dialogRef}
                id={`${uid}-ask`}
                role="dialog"
                aria-label={a.status === "waiting" ? `${a.name} needs you` : `${a.name} failed`}
                className="ui-at-tree__ask"
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    e.preventDefault();
                    closeAsk();
                  }
                }}
              >
                <p className="ui-at-tree__ask-text">
                  {a.status === "waiting" ? a.ask ?? "This agent waits for your decision." : a.error ?? "This agent stopped with an error."}
                </p>
                <div className="ui-at-tree__ask-actions">
                  {a.status === "waiting" ? (
                    <>
                      <button type="button" className="ui-at-tree__btn ui-at-tree__btn--main" onClick={() => resolve(a, "approve")}>
                        Approve
                      </button>
                      <button type="button" className="ui-at-tree__btn" onClick={() => resolve(a, "reject")}>
                        Reject
                      </button>
                    </>
                  ) : (
                    <>
                      <button type="button" className="ui-at-tree__btn ui-at-tree__btn--main" onClick={() => resolve(a, "retry")}>
                        Retry
                      </button>
                      <button type="button" className="ui-at-tree__btn" onClick={() => resolve(a, "dismiss")}>
                        Dismiss
                      </button>
                    </>
                  )}
                </div>
              </div>
            ) : null}
          </div>
          <div className="ui-at-tree__foot">
            <span className="ui-at-tree__meta">
              <span className="ui-at-tree__cost" data-climbing={i.climbing || undefined}>
                {formatCost(i.cost)}
              </span>
              {time ? <span className="ui-at-tree__time"> · {time}</span> : null}
            </span>
            {kids.length ? (
              <button
                type="button"
                className="ui-at-tree__fold"
                aria-label={`${folded ? "Show" : "Hide"} ${kids.length} sub-agent${kids.length === 1 ? "" : "s"} of ${a.name}`}
                aria-expanded={!folded}
                data-folded={folded || undefined}
                onClick={() => toggle(a.id)}
              >
                {folded ? `+${i.descendants}` : kids.length}
                <Chevron />
              </button>
            ) : null}
          </div>
        </div>
        {shown.length ? (
          <ul role="group" className="ui-at-tree__group" data-depth={depth + 1}>
            {shown.map((c, k) => renderNode(c, depth + 1, leaving || isClosing, shown.length - k))}
          </ul>
        ) : null}
      </li>
    );
  };

  return (
    <div className={["ui-at-tree", className].filter(Boolean).join(" ")}>
      <style href="ui-agent-tree" precedence="default">
        {css}
      </style>
      <div className="ui-at-tree__bar">
        <span className="ui-at-tree__mark">
          <Sparkle />
        </span>
        <h3 className="ui-at-tree__title">{title}</h3>
        <span className="ui-at-tree__totals" aria-hidden="true">
          <span>{summary[0]}</span>
          {counts.running ? <span data-kind="running">{counts.running} running</span> : null}
          {counts.waiting ? <span data-kind="waiting">{counts.waiting} needs you</span> : null}
          {counts.failed ? <span data-kind="failed">{counts.failed} failed</span> : null}
          <strong className="ui-at-tree__total" data-climbing={info.get(root.id)?.climbing || undefined}>
            {formatCost(total)}
          </strong>
        </span>
      </div>
      <div
        ref={wrapRef}
        className="ui-at-tree__wrap"
        data-layout={wide ? "wide" : "narrow"}
        style={{ "--card-w": `${cardW}px` } as CSSProperties}
      >
        <ul role="tree" aria-label={title} className="ui-at-tree__tree">
          {renderNode(root, 0, false, 0)}
        </ul>
        <svg ref={svgRef} className="ui-at-tree__links" aria-hidden="true" />
      </div>
      <p className="ui-at-tree__sr" role="status" aria-live="polite">
        {announce}
      </p>
    </div>
  );
}

/* ---------- styles ---------- */

const css = /* css */ `
.ui-at-tree {
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
:where(.dark, [data-theme="dark"]) .ui-at-tree {
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
  --pebble-shade: inset 0 -2px 6px -4px rgba(3, 12, 28, 0.8);
  --drop: 0 8px 16px -8px rgba(3, 12, 28, 0.6);
  --raised: 0 18px 30px -16px rgba(3, 12, 28, 0.8), 0 4px 10px -6px rgba(3, 12, 28, 0.6);
  --float: 0 24px 48px -24px rgba(3, 12, 28, 0.7);
}
.ui-at-tree *, .ui-at-tree *::before, .ui-at-tree *::after { box-sizing: border-box; }
.ui-at-tree :where(button) { font: inherit; color: inherit; cursor: pointer; }
.ui-at-tree :focus-visible { outline: none; box-shadow: 0 0 0 3px var(--ring); }
.ui-at-tree__sr {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0;
}

.ui-at-tree__bar { display: flex; align-items: center; flex-wrap: wrap; gap: 6px 8px; padding: 10px 12px 14px 14px; }
.ui-at-tree__mark { display: inline-flex; color: var(--mark); }
.ui-at-tree__title {
  margin: 0; color: var(--ink); font-size: 16px; font-weight: 700; letter-spacing: 0;
  font-family: "Avenir Next Condensed", "Avenir Next", Avenir, system-ui, sans-serif;
}
.ui-at-tree__totals {
  margin-left: auto; display: flex; flex-wrap: wrap; align-items: center; gap: 4px 14px;
  font-size: 13px; color: var(--muted); font-variant-numeric: tabular-nums;
}
.ui-at-tree__totals [data-kind="running"] { color: var(--info-ink); }
.ui-at-tree__totals [data-kind="waiting"] { color: var(--wait-ink); }
.ui-at-tree__totals [data-kind="failed"] { color: var(--bad-ink); }
.ui-at-tree__total { color: var(--ink); font-weight: 600; }

.ui-at-tree__wrap { position: relative; padding: 0 8px; }
.ui-at-tree__links { position: absolute; left: 0; top: 0; pointer-events: none; overflow: visible; }
.ui-at-tree__link { fill: none; stroke: var(--ui-agt-link); stroke-width: 1.5; stroke-linecap: round; }
.ui-at-tree__link[data-muted] { stroke: var(--link-muted); stroke-dasharray: 3 4; }
.ui-at-tree__dot { fill: var(--panel); stroke: var(--ui-agt-link); stroke-width: 1.5; }

.ui-at-tree__tree, .ui-at-tree__group { list-style: none; margin: 0; padding: 0; }
.ui-at-tree__item { display: flex; flex-direction: column; align-items: flex-start; }
.ui-at-tree__group { display: flex; flex-direction: column; gap: 12px; margin-top: 14px; }
.ui-at-tree__wrap[data-layout="narrow"] .ui-at-tree__group { margin-left: ${INDENT_NARROW}px; }
.ui-at-tree__wrap[data-layout="wide"] .ui-at-tree__tree > .ui-at-tree__item { align-items: center; }
.ui-at-tree__wrap[data-layout="wide"] .ui-at-tree__group[data-depth="1"] {
  flex-direction: row; align-items: flex-start; justify-content: center; gap: ${GAP}px; margin-top: 44px; align-self: stretch;
}
.ui-at-tree__wrap[data-layout="wide"] .ui-at-tree__group:not([data-depth="1"]) { margin-left: ${INDENT_WIDE}px; }

.ui-at-tree__node {
  position: relative; z-index: 1; width: var(--card-w); padding: 0 0 0; border-radius: 18px;
  background: var(--frame); border: 1px solid var(--line); box-shadow: var(--drop);
}
.ui-at-tree__node[data-rise] { animation: ui-at-tree-rise 420ms var(--ease) both; }
@keyframes ui-at-tree-rise { from { opacity: 0; transform: translateY(10px); } }
.ui-at-tree__node[data-leaving] { animation: ui-at-tree-leave 220ms var(--ease) both; }
@keyframes ui-at-tree-leave { to { opacity: 0; transform: translateY(-6px); } }
.ui-at-tree__node[data-status="queued"], .ui-at-tree__node[data-status="stopped"] { opacity: .72; }

.ui-at-tree__card {
  position: relative; margin: -1px -1px 0; padding: 10px 10px 10px; border-radius: 14px;
  background: var(--panel); border: 1px solid var(--line); box-shadow: var(--raised);
}
.ui-at-tree__card[data-selectable] { cursor: pointer; transition: border-color 150ms var(--ease); }
.ui-at-tree__card[data-selectable]:hover { border-color: var(--line-firm); }
.ui-at-tree__select { position: absolute; inset: 0; z-index: 0; border: 0; border-radius: 14px; background: transparent; padding: 0; }
.ui-at-tree__top { position: relative; display: flex; align-items: flex-start; gap: 8px; pointer-events: none; }
.ui-at-tree__top > .ui-at-tree__pill--button { pointer-events: auto; }
.ui-at-tree__avatar {
  flex: none; width: 28px; height: 28px; display: grid; place-items: center; border-radius: 9px;
  background: var(--tile); border: 1px solid var(--line); box-shadow: var(--pebble-shade); overflow: hidden;
}
.ui-at-tree__avatar > svg, .ui-at-tree__avatar > img { width: 16px; height: 16px; }
.ui-at-tree__initials { font-size: 10.5px; font-weight: 700; color: #1a3e70; }
.ui-at-tree__id { min-width: 0; flex: 1; display: flex; flex-direction: column; }
.ui-at-tree__name { color: var(--ink); font-weight: 700; font-size: 14px; line-height: 1.25; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ui-at-tree__model { font-size: 12px; color: var(--muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ui-at-tree__pill {
  flex: none; display: inline-flex; align-items: center; gap: 4px; height: 22px; padding: 0 8px; border-radius: 999px;
  background: var(--soft); border: 1px solid var(--line); color: var(--muted); font-size: 11.5px; font-weight: 600; white-space: nowrap;
  transition: background-color 300ms var(--ease), color 300ms var(--ease), border-color 300ms var(--ease);
}
.ui-at-tree__pill[data-status="running"] { background: var(--info-fill); border-color: var(--info-line); color: var(--info-ink); }
.ui-at-tree__pill[data-status="done"] { background: var(--ok-fill); border-color: var(--ok-line); color: var(--ok-ink); }
.ui-at-tree__pill[data-status="waiting"] { background: var(--wait-fill); border-color: var(--wait-line); color: var(--wait-ink); }
.ui-at-tree__pill[data-status="failed"] { background: var(--bad-fill); border-color: var(--bad-line); color: var(--bad-ink); }
.ui-at-tree__pill--button { position: relative; z-index: 1; }
.ui-at-tree__pill--button:hover { filter: brightness(0.97); }
.ui-at-tree__spin { animation: ui-at-tree-spin 900ms linear infinite; }
@keyframes ui-at-tree-spin { to { transform: rotate(360deg); } }
.ui-at-tree__task { position: relative; margin: 8px 0 0; font-size: 13px; line-height: 1.4; color: var(--text); overflow-wrap: anywhere; pointer-events: none; }
.ui-at-tree__tools { display: inline-flex; vertical-align: -4px; margin-right: 6px; }
.ui-at-tree__tool {
  width: 18px; height: 18px; display: inline-grid; place-items: center; border-radius: 5px;
  background: var(--tile); border: 1px solid var(--line); box-shadow: 0 1px 2px rgba(26, 62, 112, 0.12);
}
.ui-at-tree__tool + .ui-at-tree__tool { margin-left: -4px; }
.ui-at-tree__tool > svg, .ui-at-tree__tool > img { width: 11px; height: 11px; }

.ui-at-tree__foot { display: flex; align-items: center; justify-content: space-between; gap: 8px; min-height: 32px; padding: 4px 6px 4px 10px; }
.ui-at-tree__meta { font-size: 12.5px; color: var(--muted); font-variant-numeric: tabular-nums; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ui-at-tree__cost { color: var(--ink); font-weight: 600; }
.ui-at-tree__cost[data-climbing], .ui-at-tree__total[data-climbing] {
  background: linear-gradient(100deg, var(--ink) 40%, var(--shine) 50%, var(--ink) 60%) 0 0 / 250% 100%;
  -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
  animation: ui-at-tree-shimmer 2.2s linear infinite;
}
:where(.dark, [data-theme="dark"]) .ui-at-tree__cost[data-climbing],
:where(.dark, [data-theme="dark"]) .ui-at-tree__total[data-climbing] {
  background-image: linear-gradient(100deg, var(--ink) 40%, #8fbdf2 50%, var(--ink) 60%);
}
@keyframes ui-at-tree-shimmer { from { background-position: 100% 0; } to { background-position: -150% 0; } }
.ui-at-tree__fold {
  flex: none; display: inline-flex; align-items: center; gap: 2px; height: 24px; padding: 0 6px; border: 0; border-radius: 7px;
  background: transparent; color: var(--muted); font-size: 12px; font-weight: 600; font-variant-numeric: tabular-nums;
  transition: background-color 150ms var(--ease), color 150ms var(--ease);
}
.ui-at-tree__fold:hover { background: var(--soft); color: var(--ink); }
.ui-at-tree__chev { transition: transform 150ms var(--ease); }
.ui-at-tree__fold[data-folded] .ui-at-tree__chev { transform: rotate(-90deg); }

.ui-at-tree__ask {
  position: absolute; z-index: 5; top: 40px; right: 8px; width: min(250px, calc(100% - 16px)); padding: 12px;
  border-radius: 12px; background: var(--panel); border: 1px solid var(--line-firm); box-shadow: var(--raised);
  animation: ui-at-tree-pop 150ms var(--ease);
}
@keyframes ui-at-tree-pop { from { opacity: 0; transform: translateY(-4px); } }
.ui-at-tree__ask-text { margin: 0; font-size: 13px; color: var(--ink); }
.ui-at-tree__ask-actions { display: flex; flex-direction: row-reverse; justify-content: flex-start; gap: 8px; margin-top: 10px; }
.ui-at-tree__btn {
  height: 30px; padding: 0 12px; border-radius: 10px; border: 1px solid var(--line-firm);
  background: var(--secondary); color: var(--ink); font-size: 13px; font-weight: 600; box-shadow: var(--drop);
  transition: background-color 150ms var(--ease);
}
.ui-at-tree__btn:hover { background: var(--soft); }
.ui-at-tree .ui-at-tree__btn--main {
  background: var(--berry); border-color: var(--berry); color: #fff;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 6px 12px -6px rgba(133, 20, 55, 0.6);
}
.ui-at-tree .ui-at-tree__btn--main:hover { background: var(--berry-hover); }

@media (pointer: coarse) {
  .ui-at-tree__fold { height: 32px; padding: 0 10px; }
  .ui-at-tree__btn { height: 38px; }
}
@media (prefers-reduced-motion: reduce) {
  .ui-at-tree *, .ui-at-tree *::before, .ui-at-tree *::after { transition-duration: 0ms !important; animation: none !important; }
  .ui-at-tree__cost[data-climbing], .ui-at-tree__total[data-climbing] { -webkit-text-fill-color: currentColor; background: none; }
}
`;
