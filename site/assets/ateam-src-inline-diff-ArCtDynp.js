var e=`"use client";

import {
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type Ref,
} from "react";

export type DiffSegment =
  | { type: "equal"; text: string }
  | { type: "change"; remove: string; insert: string };

export type InlineDiffHandle = {
  highlight: (index: number | null) => void;
  accept: (index: number) => void;
  reject: (index: number) => void;
  acceptAll: () => void;
  rejectAll: () => void;
  undo: () => void;
  reset: () => void;
};

export type InlineDiffProps = {
  original?: string;
  suggested?: string;
  changes?: DiffSegment[];
  onChange?: (text: string) => void;
  onDone?: (text: string) => void;
  label?: string;
  ref?: Ref<InlineDiffHandle>;
  className?: string;
};

type Decision = "pending" | "accepted" | "rejected";

/* ---------- word diff ---------- */

const MAX_CELLS = 4_000_000;

/** Word-level diff; adjacent removals and insertions are grouped into one change. */
export function diffWords(original: string, suggested: string): DiffSegment[] {
  // words, spaces and punctuation are separate tokens, so "before," → "fast," keeps its comma
  const tokens = /\\s+|[\\p{L}\\p{N}'’_-]+|[^\\s\\p{L}\\p{N}]/gu;
  const a = original.match(tokens) ?? [];
  const b = suggested.match(tokens) ?? [];
  if (original === suggested) return original ? [{ type: "equal", text: original }] : [];
  if (a.length * b.length > MAX_CELLS) return [{ type: "change", remove: original, insert: suggested }];

  // LCS table, filled from the end
  const w = b.length + 1;
  const dp = new Uint32Array((a.length + 1) * w);
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      dp[i * w + j] = a[i] === b[j] ? dp[(i + 1) * w + j + 1] + 1 : Math.max(dp[(i + 1) * w + j], dp[i * w + j + 1]);
    }
  }
  type Op = { k: "eq" | "del" | "ins"; t: string };
  const ops: Op[] = [];
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      ops.push({ k: "eq", t: a[i] });
      i++;
      j++;
    } else if (dp[(i + 1) * w + j] >= dp[i * w + j + 1]) ops.push({ k: "del", t: a[i++] });
    else ops.push({ k: "ins", t: b[j++] });
  }
  while (i < a.length) ops.push({ k: "del", t: a[i++] });
  while (j < b.length) ops.push({ k: "ins", t: b[j++] });

  // Group runs
  const raw: DiffSegment[] = [];
  for (const op of ops) {
    const last = raw[raw.length - 1];
    if (op.k === "eq") {
      if (last?.type === "equal") last.text += op.t;
      else raw.push({ type: "equal", text: op.t });
    } else {
      if (last?.type !== "change") raw.push({ type: "change", remove: "", insert: "" });
      const c = raw[raw.length - 1] as Extract<DiffSegment, { type: "change" }>;
      if (op.k === "del") c.remove += op.t;
      else c.insert += op.t;
    }
  }

  // A lone space between two changes belongs to them: "a lot faster" → "twice as fast" is one edit
  const merged: DiffSegment[] = [];
  for (let k = 0; k < raw.length; k++) {
    const s = raw[k];
    const prev = merged[merged.length - 1];
    const next = raw[k + 1];
    if (s.type === "equal" && /^\\s+$/.test(s.text) && prev?.type === "change" && next?.type === "change") {
      prev.remove += s.text + next.remove;
      prev.insert += s.text + next.insert;
      k++;
      continue;
    }
    if (s.type === "change" && prev?.type === "change") {
      prev.remove += s.remove;
      prev.insert += s.insert;
      continue;
    }
    merged.push(s.type === "equal" ? { ...s } : { ...s });
  }

  // Keep shared edge spaces outside the change
  const out: DiffSegment[] = [];
  const pushEq = (t: string) => {
    if (!t) return;
    const last = out[out.length - 1];
    if (last?.type === "equal") last.text += t;
    else out.push({ type: "equal", text: t });
  };
  for (const s of merged) {
    if (s.type === "equal") {
      pushEq(s.text);
      continue;
    }
    let { remove, insert } = s;
    let lead = "";
    let trail = "";
    while (remove && insert && /\\s/.test(remove[0]) && remove[0] === insert[0]) {
      lead += remove[0];
      remove = remove.slice(1);
      insert = insert.slice(1);
    }
    while (remove && insert && /\\s/.test(remove.at(-1)!) && remove.at(-1) === insert.at(-1)) {
      trail = remove.at(-1)! + trail;
      remove = remove.slice(0, -1);
      insert = insert.slice(0, -1);
    }
    pushEq(lead);
    if (remove || insert) out.push({ type: "change", remove, insert });
    pushEq(trail);
  }
  return out;
}

/* ---------- helpers ---------- */

function quote(s: string) {
  const t = s.trim();
  return \`“\${t.length > 60 ? \`\${t.slice(0, 57)}…\` : t}”\`;
}

function describe(c: { remove: string; insert: string }) {
  if (!c.insert.trim()) return \`remove \${quote(c.remove)}\`;
  if (!c.remove.trim()) return \`add \${quote(c.insert)}\`;
  return \`replace \${quote(c.remove)} with \${quote(c.insert)}\`;
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) return;
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener?.("change", on);
    return () => mq.removeEventListener?.("change", on);
  }, []);
  return reduced;
}

const IconSpark = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" aria-hidden="true">
    <path d="M8 1.5 9.3 6.7 14.5 8 9.3 9.3 8 14.5 6.7 9.3 1.5 8l5.2-1.3L8 1.5Z" fill="currentColor" />
  </svg>
);
const IconLeft = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m10 3.5-4.5 4.5 4.5 4.5" />
  </svg>
);
const IconRight = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m6 3.5 4.5 4.5L6 12.5" />
  </svg>
);
const IconCheck = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m3.5 8.5 3 3 6-6.5" />
  </svg>
);
const IconX = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden="true">
    <path d="m4.5 4.5 7 7M11.5 4.5l-7 7" />
  </svg>
);

/* ---------- component ---------- */

export function InlineDiff({
  original = "",
  suggested = "",
  changes,
  onChange,
  onDone,
  label,
  ref,
  className,
}: InlineDiffProps) {
  const uid = useId();
  const reduced = useReducedMotion();
  const segs = useMemo(() => changes ?? diffWords(original, suggested), [changes, original, suggested]);
  // index of each change inside segs
  const slots = useMemo(() => segs.flatMap((s, i) => (s.type === "change" ? [i] : [])), [segs]);
  const total = slots.length;

  const [decisions, setDecisions] = useState<Decision[]>(() => slots.map(() => "pending"));
  const [history, setHistory] = useState<Decision[][]>([]);
  const [active, setActive] = useState<{ k: number; by: "focus" | "hover" | "arrow" } | null>(null);
  const [announce, setAnnounce] = useState("");
  const [pos, setPos] = useState<{ left: number; top: number; below: boolean } | null>(null);
  // bumps when a decision animation ends and the text has reflowed
  const [reflow, setReflow] = useState(0);
  // decisions whose dropped words are still shrinking away
  const [leaving, setLeaving] = useState<ReadonlySet<number>>(() => new Set());
  const leaveTimers = useRef<number[]>([]);
  useEffect(() => () => leaveTimers.current.forEach((t) => window.clearTimeout(t)), []);

  const bodyRef = useRef<HTMLDivElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const undoRef = useRef<HTMLButtonElement>(null);
  const chgRefs = useRef(new Map<number, HTMLElement>());
  const focusNext = useRef<number | "undo" | null>(null);
  const hoverTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(hoverTimer.current), []);

  // New text or changes start a fresh review.
  useEffect(() => {
    setDecisions(slots.map(() => "pending"));
    setHistory([]);
    setActive(null);
  }, [slots]);

  const textOf = useCallback(
    (d: Decision[]) =>
      segs
        .map((s, i) => {
          if (s.type === "equal") return s.text;
          const k = slots.indexOf(i);
          return d[k] === "accepted" ? s.insert : s.remove;
        })
        .join(""),
    [segs, slots],
  );

  const pendingList = (d: Decision[]) => d.flatMap((x, k) => (x === "pending" ? [k] : []));

  const commit = (next: Decision[], message: string, from?: number) => {
    const left = pendingList(next).length;
    const moved = next.flatMap((d, k) => (d !== decisions[k] ? [k] : []));
    setLeaving((cur) => new Set([...cur, ...moved]));
    leaveTimers.current.push(
      window.setTimeout(() => {
        setLeaving((cur) => new Set([...cur].filter((k) => !moved.includes(k))));
        setReflow((n) => n + 1);
      }, 340),
    );
    setHistory((h) => [...h, decisions]);
    setDecisions(next);
    const text = textOf(next);
    onChange?.(text);
    setAnnounce(left ? \`\${message}. \${left} left\` : \`\${message}. All changes reviewed\`);
    if (left === 0) {
      focusNext.current = "undo";
      setActive(null);
      onDone?.(text);
      return;
    }
    if (from !== undefined) {
      const order = pendingList(next);
      const after = order.find((k) => k > from) ?? order[0];
      focusNext.current = after ?? null;
    }
  };

  const decide = (k: number, d: "accepted" | "rejected", keepFocus = false) => {
    if (decisions[k] !== "pending") return;
    const next = decisions.slice();
    next[k] = d;
    const wasFocused = keepFocus || document.activeElement === chgRefs.current.get(k);
    commit(next, d === "accepted" ? "Accepted" : "Rejected", wasFocused ? k : undefined);
    if (!wasFocused) setActive(null);
  };
  const all = (d: "accepted" | "rejected") => {
    if (!pendingList(decisions).length) return;
    commit(
      decisions.map((x) => (x === "pending" ? d : x)),
      d === "accepted" ? "Accepted all" : "Rejected all",
    );
  };
  const undo = () => {
    const prev = history[history.length - 1];
    if (!prev) return;
    setHistory((h) => h.slice(0, -1));
    setDecisions(prev);
    onChange?.(textOf(prev));
    const left = pendingList(prev).length;
    setAnnounce(\`Undone. \${left} left\`);
    const first = prev.findIndex((x, k) => x === "pending" && decisions[k] !== "pending");
    if (first >= 0) focusNext.current = first;
  };
  const reset = () => {
    const fresh = slots.map((): Decision => "pending");
    setHistory([]);
    setDecisions(fresh);
    setActive(null);
    onChange?.(textOf(fresh));
    setAnnounce(\`Reset. \${fresh.length} left\`);
  };

  // Move focus after a decision once the DOM is updated.
  useEffect(() => {
    const target = focusNext.current;
    if (target === null) return;
    focusNext.current = null;
    if (target === "undo") undoRef.current?.focus();
    else chgRefs.current.get(target)?.focus();
  }, [decisions]);

  const scrollIfNeeded = (el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    if (r.top < 0 || r.bottom > window.innerHeight) {
      el.scrollIntoView({ block: "center", behavior: reduced ? "auto" : "smooth" });
    }
  };

  const step = (dir: 1 | -1) => {
    const order = pendingList(decisions);
    if (!order.length) return;
    const cur = active?.k ?? (dir === 1 ? -1 : total);
    const nextK =
      dir === 1 ? (order.find((k) => k > cur) ?? order[0]) : ([...order].reverse().find((k) => k < cur) ?? order[order.length - 1]);
    const el = chgRefs.current.get(nextK);
    const focusedChange = [...chgRefs.current.values()].includes(document.activeElement as HTMLElement);
    if (focusedChange) el?.focus();
    else {
      setActive({ k: nextK, by: "arrow" });
      if (el) scrollIfNeeded(el);
    }
  };

  useImperativeHandle(ref, () => ({
    highlight: (index) => {
      if (index === null || decisions[index] !== "pending") return setActive(null);
      setActive({ k: index, by: "arrow" });
      const el = chgRefs.current.get(index);
      if (el) scrollIfNeeded(el);
    },
    accept: (index) => decide(index, "accepted"),
    reject: (index) => decide(index, "rejected"),
    acceptAll: () => all("accepted"),
    rejectAll: () => all("rejected"),
    undo,
    reset,
  }));

  // Place the popover above the active change, inside the card.
  useLayoutEffect(() => {
    if (!active || decisions[active.k] !== "pending") {
      setPos(null);
      return;
    }
    const place = () => {
      const el = chgRefs.current.get(active.k);
      const body = bodyRef.current;
      const pop = popRef.current;
      if (!el || !body || !pop) return;
      const b = body.getBoundingClientRect();
      const rects = el.getClientRects();
      const first = rects[0] ?? el.getBoundingClientRect();
      const pw = pop.offsetWidth;
      const ph = pop.offsetHeight;
      const center = first.left + first.width / 2 - b.left;
      const left = Math.max(8, Math.min(center - pw / 2, b.width - pw - 8));
      let top = first.top - b.top - ph - 8;
      let below = false;
      if (first.top - ph - 8 < 0) {
        const last = rects[rects.length - 1] ?? first;
        top = last.bottom - b.top + 8;
        below = true;
      }
      setPos({ left, top, below });
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [active, decisions, reflow]);

  const pendingCount = decisions.filter((d) => d === "pending").length;
  const finished = total > 0 && pendingCount === 0;
  const visibleActive = active && decisions[active.k] === "pending" ? active.k : null;

  const leave = () => {
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => {
      setActive((a) => (a?.by === "hover" ? null : a));
    }, 160);
  };

  return (
    <section
      className={["ui-at-diff", className].filter(Boolean).join(" ")}
      aria-label={label ?? "Suggested changes"}
    >
      <style href="ui-inline-diff" precedence="default">
        {css}
      </style>
      {label && (
        <p className="ui-at-diff__label">
          <IconSpark />
          <span>{label}</span>
        </p>
      )}
      <div className="ui-at-diff__panel">
        <div className="ui-at-diff__bar">
          <div className="ui-at-diff__layer" data-show={!finished || undefined} inert={finished}>
            <span className="ui-at-diff__count">
              <span className="ui-at-diff__num">{pendingCount}</span>
              <span className="ui-at-diff__countlabel">
                {total === 0 ? "No changes" : pendingCount === 1 ? "suggestion" : "suggestions"}
              </span>
            </span>
            <span className="ui-at-diff__arrows">
              <button type="button" className="ui-at-diff__arrow" aria-label="Previous change" onClick={() => step(-1)} disabled={!pendingCount}>
                <IconLeft />
              </button>
              <button type="button" className="ui-at-diff__arrow" aria-label="Next change" onClick={() => step(1)} disabled={!pendingCount}>
                <IconRight />
              </button>
            </span>
            <button type="button" className="ui-at-diff__secondary" onClick={() => all("rejected")} disabled={!pendingCount}>
              Reject all
            </button>
            <button type="button" className="ui-at-diff__primary" onClick={() => all("accepted")} disabled={!pendingCount}>
              Accept all
            </button>
          </div>
          <div className="ui-at-diff__layer" data-show={finished || undefined} inert={!finished}>
            <span className="ui-at-diff__done">
              <svg className="ui-at-diff__tick" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
                <circle cx="10" cy="10" r="10" />
                <path d="m5.8 10.3 2.8 2.8 5.6-6" />
              </svg>
              All changes reviewed
            </span>
            <button
              ref={undoRef}
              type="button"
              className="ui-at-diff__secondary"
              onClick={undo}
              disabled={!history.length}
            >
              Undo
            </button>
          </div>
        </div>

        <div
          className="ui-at-diff__body"
          ref={bodyRef}
          onAnimationEnd={() => setReflow((n) => n + 1)}
          onKeyDown={(e) => {
            if (e.key === "Escape" && active?.by === "arrow") setActive(null);
          }}
        >
          <p className="ui-at-diff__text">
            {segs.map((s, i) => {
              if (s.type === "equal") return <span key={i}>{s.text}</span>;
              const k = slots.indexOf(i);
              const d = decisions[k] ?? "pending";
              if (d === "pending") {
                return (
                  <span
                    key={i}
                    ref={(el) => {
                      if (el) chgRefs.current.set(k, el);
                      else chgRefs.current.delete(k);
                    }}
                    className="ui-at-diff__chg"
                    data-state="pending"
                    data-active={visibleActive === k || undefined}
                    role="button"
                    tabIndex={0}
                    aria-label={\`Suggestion \${k + 1} of \${total}: \${describe(s)}. Press Y to accept, N to reject\`}
                    aria-describedby={visibleActive === k ? \`\${uid}-pop\` : undefined}
                    onFocus={() => {
                      window.clearTimeout(hoverTimer.current);
                      setActive({ k, by: "focus" });
                    }}
                    onBlur={(e) => {
                      if (popRef.current?.contains(e.relatedTarget as Node)) return;
                      setActive((a) => (a?.k === k && a.by === "focus" ? null : a));
                    }}
                    onMouseEnter={() => {
                      window.clearTimeout(hoverTimer.current);
                      setActive((a) => (a?.by === "focus" ? a : { k, by: "hover" }));
                    }}
                    onMouseLeave={leave}
                    onClick={(e) => (e.currentTarget as HTMLElement).focus()}
                    onKeyDown={(e) => {
                      const key = e.key.toLowerCase();
                      if (key === "y" || e.key === "Enter") {
                        e.preventDefault();
                        decide(k, "accepted", true);
                      } else if (key === "n" || e.key === "Backspace") {
                        e.preventDefault();
                        decide(k, "rejected", true);
                      } else if (e.key === "Escape") {
                        e.preventDefault();
                        (e.currentTarget as HTMLElement).blur();
                        setActive(null);
                      }
                    }}
                  >
                    {s.remove && <del className="ui-at-diff__del">{s.remove}</del>}
                    {s.insert && <ins className="ui-at-diff__ins">{s.insert}</ins>}
                  </span>
                );
              }
              const keep = d === "accepted" ? s.insert : s.remove;
              const drop = d === "accepted" ? s.remove : s.insert;
              return (
                <span key={i} className="ui-at-diff__chg" data-state={d}>
                  {drop && leaving.has(k) && (
                    <span className="ui-at-diff__gone" data-side={d === "accepted" ? "del" : "ins"} aria-hidden="true">
                      {drop}
                    </span>
                  )}
                  {keep && (
                    <span className="ui-at-diff__kept" data-side={d === "accepted" ? "ins" : "del"}>
                      {keep}
                    </span>
                  )}
                </span>
              );
            })}
          </p>
          {total === 0 && <p className="ui-at-diff__empty">Nothing to review – the suggestion matches the text.</p>}

          <div
            ref={popRef}
            id={\`\${uid}-pop\`}
            className="ui-at-diff__pop"
            data-show={(visibleActive !== null && pos !== null) || undefined}
            data-below={pos?.below || undefined}
            style={pos ? { left: pos.left, top: pos.top } : { left: 8, top: 0 }}
            aria-hidden={visibleActive === null}
            onMouseEnter={() => window.clearTimeout(hoverTimer.current)}
            onMouseLeave={leave}
          >
            <button
              type="button"
              tabIndex={-1}
              aria-label="Accept change"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => visibleActive !== null && decide(visibleActive, "accepted", active?.by === "focus")}
            >
              <IconCheck />
              Accept
              <kbd>Y</kbd>
            </button>
            <span className="ui-at-diff__sep" aria-hidden="true" />
            <button
              type="button"
              tabIndex={-1}
              aria-label="Reject change"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => visibleActive !== null && decide(visibleActive, "rejected", active?.by === "focus")}
            >
              <IconX />
              Reject
              <kbd>N</kbd>
            </button>
          </div>
        </div>
      </div>
      <div className="ui-at-diff__sr" role="status" aria-live="polite">
        {announce}
      </div>
    </section>
  );
}

const css = /* css */ \`
.ui-at-diff {
  --on-berry: #ffffff;
  --frame: #f2f6fa; --panel: #ffffff; --soft: rgba(26, 62, 112, 0.06);
  --line: #dae2ec; --line-firm: #cbd6e4;
  --ink: #00162b; --text: rgba(0, 22, 43, 0.66); --muted: rgba(0, 22, 43, 0.54);
  --berry: #851437; --berry-hover: #6d0f2d;
  --info-ink: #1a3e70; --info-fill: #eef5ff; --info-line: #c1daff; --ring: #8fbdf2;
  --ok-ink: #1d6a34; --ok-fill: #eafbee; --ok-line: #c9f5cf;
  --bad-ink: #8a3a22; --bad-fill: #fdeee8; --bad-line: #f5d5c9;
  --secondary: #fbfcfe;
  --pebble: #ffffff; --pebble-shade: inset 0 -2px 6px -4px rgba(26, 62, 112, 0.4);
  --short-drop: 0 2px 4px -2px rgba(26, 62, 112, 0.22);
  --drop: 0 8px 16px -8px rgba(26, 62, 112, 0.2);
  --raised: 0 18px 30px -16px rgba(26, 62, 112, 0.38), 0 4px 10px -6px rgba(26, 62, 112, 0.18);
  --float: 0 24px 48px -24px rgba(26, 62, 112, 0.3);
  --berry-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 6px 12px -6px rgba(133, 20, 55, 0.6);
  --ease: cubic-bezier(.16, 1, .3, 1);
  container-type: inline-size;
  box-sizing: border-box;
  width: 100%;
  max-width: 560px;
  min-width: 0;
  padding: 6px;
  border-radius: 22px;
  background: var(--frame);
  border: 1px solid var(--line);
  box-shadow: var(--float);
  font-family: "Avenir Next", Avenir, system-ui, sans-serif;
  font-size: 15px;
  color: var(--text);
  text-align: left;
}
:where(.dark, [data-theme="dark"]) .ui-at-diff {
  --frame: #0f2747; --panel: #16345c; --soft: rgba(255, 255, 255, 0.07);
  --line: rgba(255, 255, 255, 0.12); --line-firm: rgba(255, 255, 255, 0.18);
  --ink: rgba(255, 255, 255, 0.94); --text: rgba(255, 255, 255, 0.72); --muted: rgba(255, 255, 255, 0.56);
  --berry: #a8204d; --berry-hover: #bd2a5a;
  --info-ink: #c1daff; --info-fill: rgba(143, 189, 242, 0.16); --info-line: rgba(143, 189, 242, 0.34); --ring: rgba(143, 189, 242, 0.6);
  --ok-ink: #7fe0a0; --ok-fill: rgba(127, 224, 160, 0.14); --ok-line: rgba(127, 224, 160, 0.3);
  --bad-ink: #f2a48c; --bad-fill: rgba(242, 164, 140, 0.14); --bad-line: rgba(242, 164, 140, 0.3);
  --secondary: #1b3d68;
  --pebble: #1d4170; --pebble-shade: inset 0 -2px 6px -4px rgba(3, 12, 28, 0.8);
  --short-drop: 0 2px 4px -2px rgba(3, 12, 28, 0.6);
  --drop: 0 8px 16px -8px rgba(3, 12, 28, 0.6);
  --raised: 0 18px 30px -16px rgba(3, 12, 28, 0.8), 0 4px 10px -6px rgba(3, 12, 28, 0.6);
  --float: 0 24px 48px -24px rgba(3, 12, 28, 0.7);
  --berry-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 6px 12px -6px rgba(3, 12, 28, 0.8);
}
.ui-at-diff *, .ui-at-diff *::before, .ui-at-diff *::after { box-sizing: border-box; }
.ui-at-diff button { font: inherit; color: inherit; }
.ui-at-diff :focus-visible { outline: none; box-shadow: 0 0 0 3px var(--ring); }

.ui-at-diff__label { display: flex; align-items: center; gap: 7px; margin: 0; padding: 4px 10px 8px; font-size: 12.5px; color: var(--muted); }
.ui-at-diff__label svg { flex: none; color: var(--berry); }
.ui-at-diff__label span { min-width: 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }

.ui-at-diff__panel { background: var(--panel); border: 1px solid var(--line); border-radius: 16px; box-shadow: var(--raised); }
.ui-at-diff__bar { display: grid; padding: 10px 10px 10px 14px; border-bottom: 1px solid var(--line); }
.ui-at-diff__layer {
  grid-area: 1 / 1;
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  opacity: 0;
  visibility: hidden;
  transition: opacity 300ms var(--ease), visibility 0s linear 300ms;
}
.ui-at-diff__layer[data-show] { opacity: 1; visibility: visible; transition: opacity 300ms var(--ease), visibility 0s; }
.ui-at-diff__count { flex: 1; min-width: 0; display: inline-flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; color: var(--ink); }
.ui-at-diff__num {
  display: grid;
  place-items: center;
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  border-radius: 999px;
  background: var(--ok-fill);
  border: 1px solid var(--ok-line);
  color: var(--ok-ink);
  font-size: 12px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}
.ui-at-diff__countlabel { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.ui-at-diff__arrows { display: inline-flex; gap: 2px; margin-right: 4px; }
.ui-at-diff__arrow {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border: 0;
  border-radius: 9px;
  background: transparent;
  color: var(--muted);
  cursor: pointer;
  transition: background-color 150ms var(--ease), color 150ms var(--ease);
}
.ui-at-diff__arrow:hover:not(:disabled) { background: var(--soft); color: var(--ink); }
.ui-at-diff__arrow:disabled { opacity: 0.4; cursor: default; }
.ui-at-diff__secondary, .ui-at-diff__primary {
  flex: none;
  height: 34px;
  padding: 0 12px;
  border-radius: 10px;
  font-size: 13.5px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 150ms var(--ease), border-color 150ms var(--ease), box-shadow 150ms var(--ease);
}
.ui-at-diff__secondary { border: 1px solid var(--line-firm); background: var(--secondary); box-shadow: var(--short-drop); color: var(--ink) !important; }
.ui-at-diff__secondary:hover:not(:disabled) { border-color: var(--info-line); }
.ui-at-diff__primary { border: 0; background: var(--berry); box-shadow: var(--berry-shadow); color: var(--on-berry) !important; }
.ui-at-diff__primary:hover:not(:disabled) { background: var(--berry-hover); }
.ui-at-diff__secondary:disabled, .ui-at-diff__primary:disabled { opacity: 0.5; cursor: default; }
.ui-at-diff__done { flex: 1; min-width: 0; display: inline-flex; align-items: center; gap: 9px; font-size: 14px; font-weight: 600; color: var(--ink); }
.ui-at-diff__tick circle { fill: var(--ok-fill); stroke: var(--ok-line); }
.ui-at-diff__tick path { fill: none; stroke: var(--ok-ink); stroke-width: 1.9; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 13; stroke-dashoffset: 13; }
.ui-at-diff__layer[data-show] .ui-at-diff__tick path { animation: ui-at-diff-draw 360ms var(--ease) 120ms forwards; }

.ui-at-diff__body { position: relative; padding: 16px 18px 18px; }
.ui-at-diff__text { margin: 0; line-height: 1.75; overflow-wrap: anywhere; }
.ui-at-diff__empty { margin: 6px 0 0; font-size: 13px; color: var(--muted); }
.ui-at-diff__chg { border-radius: 5px; }
.ui-at-diff__chg[data-state="pending"] { cursor: pointer; transition: box-shadow 150ms var(--ease); }
.ui-at-diff__chg[data-state="pending"]:focus-visible,
.ui-at-diff__chg[data-active] { box-shadow: 0 0 0 2px var(--info-line); }
.ui-at-diff__chg[data-state="pending"]:focus-visible { box-shadow: 0 0 0 3px var(--ring); }
.ui-at-diff__del, .ui-at-diff__ins, .ui-at-diff__kept, .ui-at-diff__gone {
  border-radius: 4px;
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
}
.ui-at-diff__del {
  padding: 1px 2px;
  background: var(--bad-fill);
  color: var(--bad-ink);
  text-decoration: line-through;
  text-decoration-color: currentColor;
  text-decoration-thickness: 1.5px;
}
.ui-at-diff__ins { margin-left: 3px; padding: 1px 3px; background: var(--ok-fill); color: var(--ok-ink); text-decoration: none; }
.ui-at-diff__del:only-child, .ui-at-diff__ins:only-child { margin-left: 0; }

/* after a decision: the kept side settles, the dropped side shrinks away */
.ui-at-diff__kept { animation: ui-at-diff-settle-ins 300ms var(--ease) both; }
.ui-at-diff__kept[data-side="del"] { animation-name: ui-at-diff-settle-del; }
.ui-at-diff__gone {
  display: inline;
  user-select: none;
  animation: ui-at-diff-shrink 300ms var(--ease) forwards;
}
.ui-at-diff__gone[data-side="del"] { color: var(--bad-ink); background: var(--bad-fill); text-decoration: line-through; }
.ui-at-diff__gone[data-side="ins"] { color: var(--ok-ink); background: var(--ok-fill); }

.ui-at-diff__pop {
  position: absolute;
  z-index: 5;
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 4px;
  border-radius: 12px;
  background: var(--panel);
  border: 1px solid var(--line-firm);
  box-shadow: var(--raised);
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transform: translateY(4px);
  pointer-events: none;
  transition: opacity 150ms var(--ease), transform 150ms var(--ease), left 150ms var(--ease), top 150ms var(--ease), visibility 0s linear 150ms;
}
.ui-at-diff__pop[data-below] { transform: translateY(-4px); }
.ui-at-diff__pop[data-show] { opacity: 1; visibility: visible; transform: none; pointer-events: auto; transition: opacity 150ms var(--ease), transform 150ms var(--ease), left 150ms var(--ease), top 150ms var(--ease), visibility 0s; }
.ui-at-diff__pop button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 30px;
  padding: 0 6px 0 9px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  font-size: 13px;
  font-weight: 600;
  color: var(--ink);
  cursor: pointer;
  transition: background-color 150ms var(--ease), color 150ms var(--ease);
}
.ui-at-diff__pop button:first-child:hover { background: var(--ok-fill); color: var(--ok-ink); }
.ui-at-diff__pop button:last-child:hover { background: var(--bad-fill); color: var(--bad-ink); }
.ui-at-diff__pop kbd {
  display: grid;
  place-items: center;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  border-radius: 5px;
  background: var(--pebble);
  border: 1px solid var(--line);
  border-bottom-color: var(--line-firm);
  box-shadow: 0 1px 0 var(--line-firm);
  font: 600 10.5px/1 "Avenir Next", Avenir, system-ui, sans-serif;
  color: var(--muted);
}
.ui-at-diff__sep { width: 1px; height: 18px; background: var(--line); }
.ui-at-diff__sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); clip-path: inset(50%); white-space: nowrap; }

@keyframes ui-at-diff-shrink { from { font-size: 1em; opacity: 1; } to { font-size: 0; opacity: 0; padding: 0; margin: 0; } }
@keyframes ui-at-diff-settle-ins { from { background: var(--ok-fill); color: var(--ok-ink); } to { background: transparent; color: inherit; } }
@keyframes ui-at-diff-settle-del { from { background: var(--bad-fill); color: var(--bad-ink); text-decoration: line-through; } to { background: transparent; color: inherit; text-decoration: line-through transparent; } }
@keyframes ui-at-diff-draw { to { stroke-dashoffset: 0; } }

@container (max-width: 400px) {
  .ui-at-diff__arrows { display: none; }
  .ui-at-diff__bar { padding: 8px 8px 8px 12px; }
  .ui-at-diff__secondary, .ui-at-diff__primary { padding: 0 10px; font-size: 13px; }
  .ui-at-diff__body { padding: 14px 14px 16px; }
}
@container (max-width: 330px) {
  .ui-at-diff__countlabel { display: none; }
}
@media (pointer: coarse) {
  .ui-at-diff__pop button { height: 40px; padding: 0 12px; }
  .ui-at-diff__pop kbd { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .ui-at-diff *, .ui-at-diff *::before, .ui-at-diff *::after { animation-duration: 0s !important; animation-delay: 0s !important; transition-duration: 0s !important; }
  .ui-at-diff__tick path { stroke-dashoffset: 0; }
}
\`;
`;export{e as default};
