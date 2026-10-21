"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type AnswerSource = {
  /** Long title shown on the source card and in the preview */
  title: string;
  /** Short label used on the card head and on citation chips */
  name: string;
  href?: string;
  icon?: ReactNode;
  snippet?: string;
};

export type AIAnswerProps = {
  question?: string;
  sources?: AnswerSource[];
  /** Blank lines: paragraphs · "- ": list · **bold** · [1] or [1,3]: citations (1-based) */
  answer?: string;
  streaming?: boolean;
  animate?: boolean;
  /** Words per second while streaming in */
  speed?: number;
  followUps?: string[];
  onFollowUp?: (question: string) => void;
  onRegenerate?: () => void;
  onStop?: () => void;
  onFeedback?: (value: "up" | "down", reason?: string) => void;
  feedbackReasons?: string[];
  onCopy?: (text: string) => void;
  className?: string;
};

const DEFAULT_REASONS = ["Not accurate", "Wrong source", "Too long", "Out of date"];

/* ---------- parsing ---------- */

type Tok =
  | { t: "w"; text: string; bold: boolean; i: number }
  | { t: "c"; ids: number[]; i: number };
type Block = { kind: "p"; toks: Tok[] } | { kind: "ul"; items: Tok[][] };

function tidy(raw: string, live: boolean) {
  let s = raw;
  if (live) s = s.replace(/\[[\d,\s]*$/, "");
  if ((s.match(/\*\*/g)?.length ?? 0) % 2 === 1) s += "**";
  return s;
}

function parse(raw: string, sourceCount: number, live: boolean) {
  const text = tidy(raw.replace(/\r\n?/g, "\n"), live);
  let n = 0;
  const inline = (line: string): Tok[] => {
    const out: Tok[] = [];
    const re = /\*\*([\s\S]+?)\*\*|\[(\d+(?:\s*,\s*\d+)*)\]/g;
    let last = 0;
    const words = (s: string, bold: boolean) => {
      for (const w of s.match(/\S+\s*|\s+/g) ?? []) out.push({ t: "w", text: w, bold, i: n++ });
    };
    for (let m = re.exec(line); m; m = re.exec(line)) {
      words(line.slice(last, m.index), false);
      if (m[1] !== undefined) words(m[1], true);
      else {
        const ids = [...new Set(m[2].split(",").map((x) => Number(x.trim()) - 1))].filter(
          (x) => x >= 0 && x < sourceCount,
        );
        if (ids.length) out.push({ t: "c", ids, i: n++ });
      }
      last = re.lastIndex;
    }
    words(line.slice(last), false);
    return out;
  };
  const blocks: Block[] = [];
  for (const chunk of text.split(/\n\s*\n/)) {
    let para: string[] = [];
    let list: Tok[][] | null = null;
    const flushPara = () => {
      if (para.length) blocks.push({ kind: "p", toks: inline(para.join(" ").trim()) });
      para = [];
    };
    const flushList = () => {
      if (list?.length) blocks.push({ kind: "ul", items: list });
      list = null;
    };
    for (const line of chunk.split("\n")) {
      const item = /^\s*[-*]\s+(.*)$/.exec(line);
      if (item) {
        flushPara();
        (list ??= []).push(inline(item[1]));
      } else if (line.trim()) {
        flushList();
        para.push(line.trim());
      }
    }
    flushPara();
    flushList();
  }
  return { blocks, total: n };
}

function plain(raw: string, sources: AnswerSource[]) {
  const body = raw
    .replace(/\*\*([\s\S]+?)\*\*/g, "$1")
    .replace(/\s*\[(\d+(?:\s*,\s*\d+)*)\]/g, (_, ids: string) =>
      ` [${ids.split(",").map((x) => x.trim()).join(", ")}]`,
    )
    .trim();
  if (!sources.length) return body;
  const list = sources
    .map((s, i) => `${i + 1}. ${s.name} – ${s.title}${s.href ? ` (${s.href})` : ""}`)
    .join("\n");
  return `${body}\n\nSources\n${list}`;
}

function usePrefersReducedMotion() {
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

/* ---------- icons ---------- */

const Svg = ({ children, size = 16 }: { children: ReactNode; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);
const IconCopy = () => (
  <Svg>
    <rect x="8" y="8" width="12" height="12" rx="2.5" />
    <path d="M16 8V6.5A2.5 2.5 0 0 0 13.5 4h-7A2.5 2.5 0 0 0 4 6.5v7A2.5 2.5 0 0 0 6.5 16H8" />
  </Svg>
);
const IconCheck = () => (
  <Svg>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Svg>
);
const IconRedo = () => (
  <Svg>
    <path d="M20 11a8 8 0 1 0-2.3 5.7" />
    <path d="M20 4v7h-7" />
  </Svg>
);
const IconUp = () => (
  <Svg>
    <path d="M7 10v10H4.5A1.5 1.5 0 0 1 3 18.5v-7A1.5 1.5 0 0 1 4.5 10H7Zm0 0 4-7a2.5 2.5 0 0 1 2.5 2.8L13 10h5.6a2 2 0 0 1 2 2.4l-1.4 6A2 2 0 0 1 17.2 20H7" />
  </Svg>
);
const IconDown = () => (
  <Svg>
    <path d="M17 14V4h2.5A1.5 1.5 0 0 1 21 5.5v7a1.5 1.5 0 0 1-1.5 1.5H17Zm0 0-4 7a2.5 2.5 0 0 1-2.5-2.8L11 14H5.4a2 2 0 0 1-2-2.4l1.4-6A2 2 0 0 1 6.8 4H17" />
  </Svg>
);
const IconStop = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
    <rect width="10" height="10" rx="2.5" fill="currentColor" />
  </svg>
);
const IconArrow = () => (
  <Svg size={15}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Svg>
);
const IconOut = () => (
  <Svg size={13}>
    <path d="M8 16 16 8M9 8h7v7" />
  </Svg>
);

/* ---------- component ---------- */

export function AIAnswer({
  question,
  sources = [],
  answer = "",
  streaming = false,
  animate = true,
  speed = 38,
  followUps = [],
  onFollowUp,
  onRegenerate,
  onStop,
  onFeedback,
  feedbackReasons = DEFAULT_REASONS,
  onCopy,
  className,
}: AIAnswerProps) {
  const uid = useId();
  const reduced = usePrefersReducedMotion();
  const instant = !animate || reduced;
  const live = streaming;
  const { blocks, total } = useMemo(() => parse(answer, sources.length, live), [answer, sources.length, live]);

  const [shown, setShown] = useState(() => (instant ? total : 0));
  const [stopped, setStopped] = useState(false);
  const [elapsed, setElapsed] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  const [askReason, setAskReason] = useState(false);
  const [copied, setCopied] = useState(false);
  const [announce, setAnnounce] = useState("");
  const [litSource, setLitSource] = useState<number | null>(null);
  const [tip, setTip] = useState<{ key: number; ids: number[]; left: number; top: number } | null>(null);

  const startRef = useRef(0);
  const prevAnswer = useRef(answer);
  const panelRef = useRef<HTMLDivElement>(null);
  const tipTimer = useRef<number | undefined>(undefined);
  const copyTimer = useRef<number | undefined>(undefined);

  const restart = useCallback(() => {
    startRef.current = performance.now();
    setShown(0);
    setStopped(false);
    setElapsed(null);
    setFeedback(null);
    setAskReason(false);
    setTip(null);
  }, []);

  useEffect(() => {
    startRef.current = performance.now();
    return () => {
      window.clearTimeout(tipTimer.current);
      window.clearTimeout(copyTimer.current);
    };
  }, []);

  // A different text starts over; a longer one keeps going.
  useEffect(() => {
    const prev = prevAnswer.current;
    prevAnswer.current = answer;
    if (prev && !answer.startsWith(prev)) restart();
  }, [answer, restart]);

  // Reveal words at `speed` words per second.
  useEffect(() => {
    if (stopped) return;
    if (instant) {
      setShown(total);
      return;
    }
    if (shown >= total) return;
    const id = window.setInterval(() => {
      setShown((s) => (s >= total ? s : s + 1));
    }, 1000 / Math.max(1, speed));
    return () => window.clearInterval(id);
  }, [instant, total, speed, stopped, shown >= total]); // eslint-disable-line react-hooks/exhaustive-deps

  const visible = Math.min(shown, total);
  const reading = !stopped && total === 0 && streaming;
  const writing = !stopped && !reading && (visible < total || streaming);
  const done = !reading && !writing;

  useEffect(() => {
    if (done && total > 0 && elapsed === null) {
      setElapsed((performance.now() - startRef.current) / 1000);
      if (!stopped) setAnnounce("Answer complete");
    }
  }, [done, total, elapsed, stopped]);

  /* citation preview */
  const openTip = (key: number, ids: number[], el: HTMLElement) => {
    window.clearTimeout(tipTimer.current);
    const panel = panelRef.current;
    if (!panel) return;
    const p = panel.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    const width = Math.min(288, p.width - 24);
    const left = Math.max(12, Math.min(r.left - p.left, p.width - width - 12));
    setTip({ key, ids, left, top: r.bottom - p.top + 8 });
  };
  const closeTipSoon = () => {
    window.clearTimeout(tipTimer.current);
    tipTimer.current = window.setTimeout(() => setTip(null), 140);
  };
  const keepTip = () => window.clearTimeout(tipTimer.current);

  /* actions */
  const copy = async () => {
    const text = plain(answer, sources);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setAnnounce("Answer copied");
      window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setCopied(false), 1600);
      onCopy?.(text);
    } catch {
      setAnnounce("Couldn't copy – select the text instead");
    }
  };
  const regenerate = () => {
    restart();
    setAnnounce("Writing a new answer");
    onRegenerate?.();
  };
  const stop = () => {
    setStopped(true);
    setAnnounce("Stopped");
    onStop?.();
  };
  const thumbUp = () => {
    if (feedback === "up") {
      setFeedback(null);
      return;
    }
    setFeedback("up");
    setAskReason(false);
    setAnnounce("Thanks for the feedback");
    onFeedback?.("up");
  };
  const thumbDown = () => {
    if (feedback === "down") {
      setFeedback(null);
      setAskReason(false);
      return;
    }
    setFeedback("down");
    setAskReason(true);
  };
  const pickReason = (reason: string) => {
    setAskReason(false);
    setAnnounce(`Thanks – noted: ${reason}`);
    onFeedback?.("down", reason);
  };

  /* height glide */
  const innerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | null>(null);
  useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => setHeight(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const litChip = (ids: number[]) => litSource !== null && ids.includes(litSource);
  const tipIds = tip?.ids ?? [];

  const renderToks = (toks: Tok[]) =>
    toks
      .filter((t) => t.i < visible)
      .map((t) => {
        if (t.t === "w") {
          const W = t.bold ? "strong" : "span";
          return (
            <W key={t.i} className="ui-at-answer__w">
              {t.text}
            </W>
          );
        }
        const first = sources[t.ids[0]];
        const names = t.ids.map((x) => sources[x].name).join(", ");
        const open = tip?.key === t.i;
        return (
          <button
            key={t.i}
            type="button"
            className="ui-at-answer__cite"
            data-lit={litChip(t.ids) || open || undefined}
            aria-label={`Source${t.ids.length > 1 ? "s" : ""}: ${names}`}
            aria-describedby={open ? `${uid}-tip` : undefined}
            aria-expanded={open}
            onMouseEnter={(e) => openTip(t.i, t.ids, e.currentTarget)}
            onMouseLeave={closeTipSoon}
            onFocus={(e) => openTip(t.i, t.ids, e.currentTarget)}
            onBlur={closeTipSoon}
            onClick={(e) => (open ? setTip(null) : openTip(t.i, t.ids, e.currentTarget))}
            onKeyDown={(e) => {
              if (e.key === "Escape" && tip) {
                e.stopPropagation();
                setTip(null);
              }
            }}
          >
            {first.name}
            {t.ids.length > 1 && <span className="ui-at-answer__more">+{t.ids.length - 1}</span>}
          </button>
        );
      });

  const lastVisibleBlock = (() => {
    let idx = -1;
    blocks.forEach((b, i) => {
      const toks = b.kind === "p" ? b.toks : b.items.flat();
      if (toks.some((t) => t.i < visible)) idx = i;
    });
    return idx;
  })();
  const cursor = writing && <span className="ui-at-answer__cursor" aria-hidden="true" />;

  const status = reading
    ? `Reading ${sources.length} source${sources.length === 1 ? "" : "s"}`
    : writing
      ? "Writing"
      : "Answer";

  return (
    <section
      className={["ui-at-answer", className].filter(Boolean).join(" ")}
      data-instant={instant || undefined}
      aria-label={question ?? "Answer"}
    >
      <style href="ui-ai-answer" precedence="default">
        {css}
      </style>
      <div className="ui-at-answer__panel" ref={panelRef}>
        <div className="ui-at-answer__glide" style={height === null ? undefined : { height }}>
          <div ref={innerRef} className="ui-at-answer__inner">
            {question && <h3 className="ui-at-answer__q">{question}</h3>}

            {sources.length > 0 && (
              <ul className="ui-at-answer__sources" aria-label="Sources">
                {sources.map((s, i) => {
                  const lit =
                    litSource === i || (tip !== null && tipIds.includes(i)) || undefined;
                  const inner = (
                    <>
                      <span className="ui-at-answer__srchead">
                        <span className="ui-at-answer__pebble" aria-hidden="true">
                          {s.icon ?? s.name.slice(0, 1).toUpperCase()}
                        </span>
                        <span className="ui-at-answer__srcname">{s.name}</span>
                        <span className="ui-at-answer__num" aria-hidden="true">
                          {i + 1}
                        </span>
                      </span>
                      <span className="ui-at-answer__srctitle">{s.title}</span>
                    </>
                  );
                  return (
                    <li
                      key={i}
                      className="ui-at-answer__src"
                      style={{ animationDelay: `${i * 90}ms` }}
                      data-lit={lit}
                      onMouseEnter={() => setLitSource(i)}
                      onMouseLeave={() => setLitSource(null)}
                    >
                      {s.href ? (
                        <a
                          className="ui-at-answer__srcbox"
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${i + 1}. ${s.name}: ${s.title} (opens in a new tab)`}
                          onFocus={() => setLitSource(i)}
                          onBlur={() => setLitSource(null)}
                        >
                          {inner}
                        </a>
                      ) : (
                        <div
                          className="ui-at-answer__srcbox"
                          tabIndex={0}
                          aria-label={`${i + 1}. ${s.name}: ${s.title}`}
                          onFocus={() => setLitSource(i)}
                          onBlur={() => setLitSource(null)}
                        >
                          {inner}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}

            <div className="ui-at-answer__label" data-phase={reading ? "reading" : writing ? "writing" : "done"}>
              <span className="ui-at-answer__avatar" aria-hidden="true">
                <span />
                <span />
              </span>
              <span className="ui-at-answer__status" key={status}>
                {status}
              </span>
            </div>

            <div className="ui-at-answer__body" aria-busy={!done} aria-live="off">
              {reading && (
                <div className="ui-at-answer__skeleton" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
              )}
              {blocks.map((b, bi) => {
                if (bi > lastVisibleBlock) return null;
                const tail = bi === lastVisibleBlock ? cursor : null;
                if (b.kind === "p") {
                  return (
                    <p key={bi} className="ui-at-answer__p">
                      {renderToks(b.toks)}
                      {tail}
                    </p>
                  );
                }
                const items = b.items.filter((it) => it.some((t) => t.i < visible));
                return (
                  <ul key={bi} className="ui-at-answer__ul">
                    {items.map((it, ii) => (
                      <li key={ii}>
                        {renderToks(it)}
                        {ii === items.length - 1 ? tail : null}
                      </li>
                    ))}
                  </ul>
                );
              })}
              {!reading && total === 0 && !streaming && (
                <p className="ui-at-answer__empty">No answer yet.</p>
              )}
            </div>

            {done && !stopped && followUps.length > 0 && (
              <div className="ui-at-answer__related">
                <p className="ui-at-answer__kicker" id={`${uid}-rel`}>
                  Related
                </p>
                <ul aria-labelledby={`${uid}-rel`}>
                  {followUps.map((f, i) => (
                    <li key={f} style={{ animationDelay: `${i * 70}ms` }}>
                      <button type="button" onClick={() => onFollowUp?.(f)}>
                        <span>{f}</span>
                        <IconArrow />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {tip && (
          <div
            id={`${uid}-tip`}
            role="tooltip"
            className="ui-at-answer__tip"
            style={{ left: tip.left, top: tip.top }}
            onMouseEnter={keepTip}
            onMouseLeave={closeTipSoon}
          >
            {tip.ids.map((id) => {
              const s = sources[id];
              return (
                <div key={id} className="ui-at-answer__tipitem">
                  <span className="ui-at-answer__srchead">
                    <span className="ui-at-answer__pebble" aria-hidden="true">
                      {s.icon ?? s.name.slice(0, 1).toUpperCase()}
                    </span>
                    <span className="ui-at-answer__srcname">{s.name}</span>
                    <span className="ui-at-answer__num">{id + 1}</span>
                  </span>
                  {s.href ? (
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className="ui-at-answer__tiptitle">
                      {s.title}
                      <IconOut />
                    </a>
                  ) : (
                    <span className="ui-at-answer__tiptitle">{s.title}</span>
                  )}
                  {s.snippet && <p className="ui-at-answer__snippet">{s.snippet}</p>}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {askReason && (
        <div className="ui-at-answer__reasons" role="group" aria-label="What went wrong?">
          <span className="ui-at-answer__kicker">What went wrong?</span>
          <div>
            {feedbackReasons.map((r) => (
              <button key={r} type="button" onClick={() => pickReason(r)}>
                {r}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="ui-at-answer__foot">
        <div className="ui-at-answer__actions">
          {reading || writing ? (
            <button type="button" className="ui-at-answer__stop" onClick={stop}>
              <IconStop />
              Stop
            </button>
          ) : (
            <>
              <button
                type="button"
                className="ui-at-answer__act"
                onClick={copy}
                disabled={total === 0}
                aria-label={copied ? "Copied" : "Copy answer"}
                title="Copy"
              >
                {copied ? <IconCheck /> : <IconCopy />}
              </button>
              <button
                type="button"
                className="ui-at-answer__act"
                onClick={regenerate}
                aria-label="Regenerate answer"
                title="Regenerate"
              >
                <IconRedo />
              </button>
              <button
                type="button"
                className="ui-at-answer__act"
                onClick={thumbUp}
                aria-pressed={feedback === "up"}
                disabled={total === 0}
                aria-label="Good answer"
                title="Good answer"
              >
                <IconUp />
              </button>
              <button
                type="button"
                className="ui-at-answer__act"
                onClick={thumbDown}
                aria-pressed={feedback === "down"}
                aria-expanded={askReason}
                disabled={total === 0}
                aria-label="Bad answer"
                title="Bad answer"
              >
                <IconDown />
              </button>
            </>
          )}
        </div>
        <span className="ui-at-answer__meta">
          {reading
            ? "Searching…"
            : writing
              ? "Writing…"
              : stopped
                ? "Stopped"
                : elapsed !== null
                  ? `Answered in ${elapsed.toFixed(1)}s`
                  : ""}
        </span>
      </div>
      <div className="ui-at-answer__sr" role="status" aria-live="polite">
        {announce}
      </div>
    </section>
  );
}

const css = /* css */ `
.ui-at-answer {
  --frame: #f2f6fa; --panel: #ffffff; --soft: rgba(26, 62, 112, 0.06);
  --line: #dae2ec; --line-firm: #cbd6e4;
  --ink: #00162b; --text: rgba(0, 22, 43, 0.66); --muted: rgba(0, 22, 43, 0.54);
  --berry: #851437; --berry-hover: #6d0f2d;
  --info-ink: #1a3e70; --info-fill: #eef5ff; --info-line: #c1daff; --ring: #8fbdf2;
  --ok-ink: #1d6a34; --ok-fill: #eafbee; --ok-line: #c9f5cf;
  --bad-ink: #8a3a22; --bad-fill: #fdeee8; --bad-line: #f5d5c9;
  --pebble: #ffffff;
  --pebble-shade: inset 0 -2px 6px -4px rgba(26, 62, 112, 0.4);
  --drop: 0 8px 16px -8px rgba(26, 62, 112, 0.2);
  --raised: 0 18px 30px -16px rgba(26, 62, 112, 0.38), 0 4px 10px -6px rgba(26, 62, 112, 0.18);
  --float: 0 24px 48px -24px rgba(26, 62, 112, 0.3);
  --ease: cubic-bezier(.16, 1, .3, 1);
  box-sizing: border-box;
  width: 100%;
  max-width: 640px;
  min-width: 0;
  padding: 6px;
  border-radius: 22px;
  background: var(--frame);
  border: 1px solid var(--line);
  box-shadow: var(--float);
  font-family: "Avenir Next", Avenir, system-ui, sans-serif;
  color: var(--text);
  font-size: 15px;
  line-height: 1.65;
  text-align: left;
}
:where(.dark, [data-theme="dark"]) .ui-at-answer {
  --frame: #0f2747; --panel: #16345c; --soft: rgba(255, 255, 255, 0.07);
  --line: rgba(255, 255, 255, 0.12); --line-firm: rgba(255, 255, 255, 0.18);
  --ink: rgba(255, 255, 255, 0.94); --text: rgba(255, 255, 255, 0.72); --muted: rgba(255, 255, 255, 0.56);
  --berry: #a8204d; --berry-hover: #bd2a5a;
  --info-ink: #c1daff; --info-fill: rgba(143, 189, 242, 0.16); --info-line: rgba(143, 189, 242, 0.34); --ring: rgba(143, 189, 242, 0.6);
  --ok-ink: #7fe0a0; --ok-fill: rgba(127, 224, 160, 0.14); --ok-line: rgba(127, 224, 160, 0.3);
  --bad-ink: #f2a48c; --bad-fill: rgba(242, 164, 140, 0.14); --bad-line: rgba(242, 164, 140, 0.3);
  --pebble: #1d4170;
  --pebble-shade: inset 0 -2px 6px -4px rgba(3, 12, 28, 0.8);
  --drop: 0 8px 16px -8px rgba(3, 12, 28, 0.6);
  --raised: 0 18px 30px -16px rgba(3, 12, 28, 0.8), 0 4px 10px -6px rgba(3, 12, 28, 0.6);
  --float: 0 24px 48px -24px rgba(3, 12, 28, 0.7);
}
.ui-at-answer *, .ui-at-answer *::before, .ui-at-answer *::after { box-sizing: border-box; }
.ui-at-answer button { font: inherit; color: inherit; }
.ui-at-answer :focus-visible { outline: none; box-shadow: 0 0 0 3px var(--ring); }

.ui-at-answer__panel {
  position: relative;
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 16px;
  box-shadow: var(--raised);
}
.ui-at-answer__glide { overflow: hidden; border-radius: 16px; transition: height 300ms var(--ease); }
.ui-at-answer__inner { padding: 22px 24px 20px; }

.ui-at-answer__q {
  margin: 0 0 14px;
  font-family: "Avenir Next Condensed", "Avenir Next", Avenir, system-ui, sans-serif;
  font-weight: 700;
  font-size: 21px;
  line-height: 1.25;
  color: var(--ink);
  overflow-wrap: anywhere;
}

.ui-at-answer__sources {
  list-style: none;
  margin: 0 -24px 18px;
  padding: 2px 24px 6px;
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scroll-snap-type: x proximity;
  scroll-padding: 0 24px;
  scrollbar-width: none;
  -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 16px, #000 calc(100% - 28px), transparent);
  mask-image: linear-gradient(90deg, transparent 0, #000 16px, #000 calc(100% - 28px), transparent);
}
.ui-at-answer__sources::-webkit-scrollbar { display: none; }
.ui-at-answer__src {
  flex: 0 0 172px;
  scroll-snap-align: start;
  animation: ui-at-answer-pop 420ms var(--ease) both;
}
.ui-at-answer__srcbox {
  display: flex;
  flex-direction: column;
  gap: 6px;
  height: 100%;
  padding: 10px 12px 11px;
  border-radius: 12px;
  background: var(--info-fill);
  border: 1px solid transparent;
  color: var(--text);
  text-decoration: none;
  transition: border-color 150ms var(--ease), background-color 150ms var(--ease), transform 150ms var(--ease), box-shadow 150ms var(--ease);
}
.ui-at-answer__src[data-lit] .ui-at-answer__srcbox,
.ui-at-answer__srcbox:hover {
  border-color: var(--info-line);
  box-shadow: var(--drop);
  transform: translateY(-1px);
}
.ui-at-answer__srchead { display: flex; align-items: center; gap: 7px; min-width: 0; font-size: 12.5px; line-height: 1.2; }
.ui-at-answer__pebble {
  flex: none;
  display: grid;
  place-items: center;
  width: 18px;
  height: 18px;
  border-radius: 6px;
  background: var(--pebble);
  border: 1px solid var(--line);
  box-shadow: var(--pebble-shade);
  font-size: 10px;
  font-weight: 700;
  color: var(--info-ink);
}
.ui-at-answer__pebble > svg, .ui-at-answer__pebble > img { width: 12px; height: 12px; }
.ui-at-answer__srcname { flex: 1; min-width: 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; color: var(--muted); }
.ui-at-answer__num { flex: none; font-size: 11px; color: var(--muted); font-variant-numeric: tabular-nums; }
.ui-at-answer__srctitle {
  font-size: 13px;
  line-height: 1.4;
  color: var(--ink);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.ui-at-answer__label { display: flex; align-items: center; gap: 9px; margin-bottom: 8px; font-size: 13.5px; font-weight: 600; color: var(--ink); }
.ui-at-answer__avatar {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  width: 26px;
  height: 26px;
  border-radius: 9px;
  background: var(--pebble);
  border: 1px solid var(--line);
  box-shadow: var(--pebble-shade);
}
.ui-at-answer__avatar span { width: 4px; height: 6px; border-radius: 2px; background: var(--berry); transition: height 300ms var(--ease); }
.ui-at-answer__label[data-phase="reading"] .ui-at-answer__avatar span,
.ui-at-answer__label[data-phase="writing"] .ui-at-answer__avatar span { animation: ui-at-answer-blink 1.6s var(--ease) infinite; }
.ui-at-answer__label[data-phase="writing"] .ui-at-answer__avatar span:last-child { animation-delay: 120ms; }
.ui-at-answer__status { animation: ui-at-answer-fade 300ms var(--ease) both; }
.ui-at-answer__label:not([data-phase="done"]) .ui-at-answer__status {
  background: linear-gradient(90deg, var(--muted) 0%, var(--muted) 35%, var(--ink) 50%, var(--muted) 65%, var(--muted) 100%);
  background-size: 250% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: ui-at-answer-fade 300ms var(--ease) both, ui-at-answer-shine 1.8s linear infinite;
}

.ui-at-answer__body { min-height: 26px; overflow-wrap: anywhere; }
.ui-at-answer__p { margin: 0 0 12px; }
.ui-at-answer__ul { margin: 0 0 12px; padding-left: 22px; }
.ui-at-answer__ul li { margin: 0 0 6px; padding-left: 2px; }
.ui-at-answer__ul li::marker { color: var(--line-firm); }
.ui-at-answer__body strong { color: var(--ink); font-weight: 650; }
.ui-at-answer__w { animation: ui-at-answer-word 420ms var(--ease) both; }
.ui-at-answer__empty { margin: 0 0 8px; color: var(--muted); }
.ui-at-answer__skeleton { display: grid; gap: 9px; padding: 6px 0 14px; }
.ui-at-answer__skeleton span { height: 10px; border-radius: 5px; background: var(--soft); animation: ui-at-answer-blink 1.6s ease-in-out infinite; }
.ui-at-answer__skeleton span:nth-child(2) { width: 86%; animation-delay: 150ms; }
.ui-at-answer__skeleton span:nth-child(3) { width: 62%; animation-delay: 300ms; }

.ui-at-answer__cite {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  margin: 0 2px 0 3px;
  padding: 0 7px;
  height: 21px;
  vertical-align: 1px;
  border-radius: 7px;
  border: 1px solid var(--info-line);
  background: var(--info-fill);
  color: var(--info-ink);
  font-size: 11.5px;
  font-weight: 600;
  line-height: 1;
  cursor: pointer;
  white-space: nowrap;
  animation: ui-at-answer-pop 360ms var(--ease) both;
  transition: background-color 150ms var(--ease), border-color 150ms var(--ease), color 150ms var(--ease);
}
.ui-at-answer__cite[data-lit] { background: var(--info-ink); border-color: var(--info-ink); color: var(--panel); }
.ui-at-answer__more { opacity: 0.72; font-weight: 500; }
.ui-at-answer__cursor {
  display: inline-block;
  width: 8px;
  height: 8px;
  margin-left: 4px;
  border-radius: 50%;
  background: var(--berry);
  vertical-align: 1px;
  animation: ui-at-answer-pulse 1s var(--ease) infinite;
}

.ui-at-answer__tip {
  position: absolute;
  z-index: 5;
  width: min(288px, calc(100% - 24px));
  display: grid;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 14px;
  background: var(--panel);
  border: 1px solid var(--line-firm);
  box-shadow: var(--raised);
  font-size: 13px;
  line-height: 1.45;
  animation: ui-at-answer-rise 200ms var(--ease) both;
}
.ui-at-answer__tipitem { display: grid; gap: 5px; }
.ui-at-answer__tipitem + .ui-at-answer__tipitem { padding-top: 10px; border-top: 1px solid var(--line); }
.ui-at-answer__tiptitle { display: inline-flex; align-items: flex-start; gap: 4px; color: var(--ink); font-weight: 600; text-decoration: none; }
a.ui-at-answer__tiptitle:hover { color: var(--info-ink); text-decoration: underline; text-underline-offset: 3px; }
a.ui-at-answer__tiptitle svg { flex: none; margin-top: 3px; }
.ui-at-answer__snippet { margin: 0; color: var(--text); }

.ui-at-answer__related { margin-top: 6px; padding-top: 14px; border-top: 1px solid var(--line); }
.ui-at-answer__kicker { margin: 0 0 4px; font-size: 10.5px; font-weight: 600; letter-spacing: 0.09em; text-transform: uppercase; color: var(--muted); }
.ui-at-answer__related ul { list-style: none; margin: 0; padding: 0; }
.ui-at-answer__related li { animation: ui-at-answer-rise 300ms var(--ease) both; }
.ui-at-answer__related li + li { border-top: 1px solid var(--line); }
.ui-at-answer__related button {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 0 -8px;
  width: calc(100% + 16px);
  padding: 10px 8px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--ink);
  font-size: 14px;
  text-align: left;
  cursor: pointer;
  transition: background-color 150ms var(--ease);
}
.ui-at-answer__related button svg { flex: none; color: var(--muted); transition: transform 150ms var(--ease), color 150ms var(--ease); }
.ui-at-answer__related button:hover { background: var(--soft); }
.ui-at-answer__related button:hover svg { transform: translateX(2px); color: var(--berry); }

.ui-at-answer__reasons { display: grid; gap: 6px; padding: 10px 12px 2px; animation: ui-at-answer-rise 300ms var(--ease) both; }
.ui-at-answer__reasons .ui-at-answer__kicker { margin: 0; }
.ui-at-answer__reasons div { display: flex; flex-wrap: wrap; gap: 6px; }
.ui-at-answer__reasons button {
  padding: 4px 11px;
  border-radius: 999px;
  border: 1px solid var(--line-firm);
  background: var(--panel);
  box-shadow: var(--drop);
  font-size: 12.5px;
  font-weight: 600;
  color: var(--ink);
  cursor: pointer;
  transition: border-color 150ms var(--ease), background-color 150ms var(--ease);
}
.ui-at-answer__reasons button:hover { border-color: var(--bad-line); background: var(--bad-fill); color: var(--bad-ink); }

.ui-at-answer__foot { display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 44px; padding: 6px 8px 2px; }
.ui-at-answer__actions { display: flex; align-items: center; gap: 2px; }
.ui-at-answer__act {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border: 1px solid transparent;
  border-radius: 9px;
  background: transparent;
  color: var(--muted);
  cursor: pointer;
  transition: background-color 150ms var(--ease), color 150ms var(--ease), border-color 150ms var(--ease);
}
.ui-at-answer__act:hover:not(:disabled) { background: var(--soft); color: var(--ink); }
.ui-at-answer__act[aria-pressed="true"] { background: var(--info-fill); border-color: var(--info-line); color: var(--info-ink); }
.ui-at-answer__act:disabled { opacity: 0.4; cursor: default; }
.ui-at-answer__stop {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 32px;
  padding: 0 13px;
  border-radius: 10px;
  border: 1px solid var(--line-firm);
  background: var(--panel);
  box-shadow: var(--drop);
  font-size: 13px;
  font-weight: 600;
  color: var(--ink);
  cursor: pointer;
  animation: ui-at-answer-fade 300ms var(--ease) both;
}
.ui-at-answer__stop svg { color: var(--berry); }
.ui-at-answer__meta { font-size: 12.5px; color: var(--muted); font-variant-numeric: tabular-nums; white-space: nowrap; }
.ui-at-answer__sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); clip-path: inset(50%); white-space: nowrap; }

@keyframes ui-at-answer-pop { from { opacity: 0; transform: translateY(6px) scale(0.96); } to { opacity: 1; transform: none; } }
@keyframes ui-at-answer-rise { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
@keyframes ui-at-answer-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes ui-at-answer-word { from { opacity: 0; filter: blur(4px); } to { opacity: 1; filter: blur(0); } }
@keyframes ui-at-answer-pulse { 0%, 100% { transform: scale(0.7); opacity: 0.55; } 50% { transform: scale(1); opacity: 1; } }
@keyframes ui-at-answer-blink { 0%, 100% { opacity: 0.45; } 50% { opacity: 1; } }
@keyframes ui-at-answer-shine { from { background-position: 100% 0; } to { background-position: -150% 0; } }

@media (max-width: 480px) {
  .ui-at-answer__inner { padding: 18px 16px 16px; }
  .ui-at-answer__sources { margin: 0 -16px 16px; padding: 2px 16px 6px; scroll-padding: 0 16px; }
  .ui-at-answer__src { flex-basis: 150px; }
  .ui-at-answer__q { font-size: 19px; }
}
@media (pointer: coarse) {
  .ui-at-answer__cite { height: 26px; padding: 0 9px; }
  .ui-at-answer__act { width: 40px; height: 40px; }
}
.ui-at-answer[data-instant] *, .ui-at-answer[data-instant] *::before, .ui-at-answer[data-instant] *::after { animation-duration: 0s !important; animation-delay: 0s !important; }
@media (prefers-reduced-motion: reduce) {
  .ui-at-answer *, .ui-at-answer *::before, .ui-at-answer *::after {
    animation-duration: 0s !important;
    animation-delay: 0s !important;
    animation-iteration-count: 1 !important;
    transition-property: color, background-color, border-color, opacity !important;
  }
  .ui-at-answer__glide { transition: none; }
}
`;
