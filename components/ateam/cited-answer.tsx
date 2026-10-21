"use client";

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

export type CitedSource = {
  id: string;
  title: string;
  /** Short name of the site, e.g. "Latency Notes" */
  site: string;
  url?: string;
  date?: string;
  /** The passage your retrieval step actually used */
  quote?: string;
  /** Exact phrases of the quote to mark */
  highlight?: string[];
  icon?: ReactNode;
};

export type CitedSegment = {
  text: string;
  /** Source ids, one marker each */
  cite?: string[];
  /** Starts a new paragraph */
  paragraph?: boolean;
};

export type CitedAnswerProps = {
  segments: CitedSegment[];
  sources: CitedSource[];
  pagesRead?: number;
  defaultOpen?: string;
  onOpenSource?: (source: CitedSource) => void;
  onPreviewChange?: (id: string | null) => void;
  action?: { label: string; onClick: () => void };
  className?: string;
};

type Hover = { id: string; from: "chip" | "marker" } | null;

function domain(url?: string) {
  if (!url) return "";
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function escapeRe(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Marks the given phrases, or – without phrases – the long words and numbers shared with the citing text. */
function markQuote(quote: string, phrases: string[] | undefined, citing: string): ReactNode[] {
  let re: RegExp | null = null;
  if (phrases?.length) {
    const list = phrases.filter((p) => p.trim()).sort((a, b) => b.length - a.length);
    if (list.length) re = new RegExp(`(${list.map(escapeRe).join("|")})`, "gi");
  } else {
    const words = new Set(
      (citing.toLowerCase().match(/[\p{L}\p{N}%]+/gu) ?? []).filter((w) => w.length >= 5 || /\d/.test(w)),
    );
    if (words.size) {
      const parts = quote.split(/([\p{L}\p{N}%]+)/u);
      return parts.map((p, i) =>
        words.has(p.toLowerCase()) ? (
          <mark key={i} className="ui-at-cited__mark">
            {p}
          </mark>
        ) : (
          p
        ),
      );
    }
  }
  if (!re) return [quote];
  return quote.split(re).map((p, i) =>
    i % 2 === 1 ? (
      <mark key={i} className="ui-at-cited__mark">
        {p}
      </mark>
    ) : (
      p
    ),
  );
}

/* ---------- icons ---------- */

const IconClose = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
    <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);
const IconOut = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
    <path d="M4 8l4-4M4.5 4H8v3.5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconCopy = () => (
  <svg width="13" height="13" viewBox="0 0 14 14" aria-hidden="true">
    <rect x="4.5" y="4.5" width="7.5" height="7.5" rx="1.6" stroke="currentColor" strokeWidth="1.4" fill="none" />
    <path d="M9.5 4.5V3.6A1.6 1.6 0 0 0 7.9 2H3.6A1.6 1.6 0 0 0 2 3.6v4.3a1.6 1.6 0 0 0 1.6 1.6h.9" stroke="currentColor" strokeWidth="1.4" fill="none" />
  </svg>
);
const IconArrow = () => (
  <svg width="13" height="13" viewBox="0 0 14 14" aria-hidden="true">
    <path d="M2.5 7h9M8 3.5 11.5 7 8 10.5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ---------- component ---------- */

export function CitedAnswer({
  segments,
  sources,
  pagesRead,
  defaultOpen,
  onOpenSource,
  onPreviewChange,
  action,
  className,
}: CitedAnswerProps) {
  const uid = useId();
  const index = useMemo(() => new Map(sources.map((s, i) => [s.id, i])), [sources]);
  const [open, setOpenState] = useState<string | null>(
    defaultOpen && index.has(defaultOpen) ? defaultOpen : null,
  );
  const [hover, setHover] = useState<Hover>(null);
  const [copied, setCopied] = useState(false);
  const lastOpen = useRef<string | null>(open);
  if (open) lastOpen.current = open;
  const chipRefs = useRef(new Map<string, HTMLButtonElement>());
  const copyTimer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(copyTimer.current), []);

  const setOpen = (id: string | null) => {
    setOpenState(id);
    setCopied(false);
    onPreviewChange?.(id);
  };
  const toggle = (id: string) => setOpen(open === id ? null : id);

  // Only ids that exist get markers.
  const segs = useMemo(
    () => segments.map((s) => ({ ...s, cite: (s.cite ?? []).filter((id) => index.has(id)) })),
    [segments, index],
  );
  const paragraphs = useMemo(() => {
    const out: (typeof segs)[] = [];
    segs.forEach((s, i) => {
      if (i === 0 || s.paragraph) out.push([]);
      out[out.length - 1].push(s);
    });
    return out;
  }, [segs]);

  const lit = hover?.id ?? open;
  const shown = open ?? lastOpen.current;
  const shownSource = shown ? sources[index.get(shown) ?? -1] : undefined;
  const shownNum = shown ? (index.get(shown) ?? 0) + 1 : 0;
  const citingText = useMemo(
    () => (shown ? segs.filter((s) => s.cite.includes(shown)).map((s) => s.text).join(" ") : ""),
    [segs, shown],
  );

  const label = (s: CitedSource, n: number) => `Source ${n}: ${s.site} – ${s.title}`;

  const copyQuote = async () => {
    if (!shownSource?.quote) return;
    try {
      await navigator.clipboard.writeText(shownSource.quote);
      setCopied(true);
      window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const closeAndFocus = () => {
    const id = open;
    if (!id) return;
    setOpen(null);
    chipRefs.current.get(id)?.focus();
  };

  const chipKeys = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const n = sources.length;
    const go = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: n - 1 }[e.key];
    if (go === undefined) return;
    e.preventDefault();
    chipRefs.current.get(sources[(go + n) % n].id)?.focus();
  };

  const hovered = hover ? sources[index.get(hover.id) ?? -1] : undefined;
  const line: { key: string; node: ReactNode } = copied
    ? { key: "copied", node: "Quote copied" }
    : hovered
      ? {
          key: `h-${hovered.id}`,
          node: (
            <>
              <b>{hovered.site}</b> · {hovered.title}
            </>
          ),
        }
      : open && shownSource
        ? {
            key: `o-${open}`,
            node: (
              <>
                Quote from <b>{shownSource.site}</b>
              </>
            ),
          }
        : { key: "idle", node: "Pick a number to check its source" };
  const [lines, setLines] = useState<{ cur: string; node: ReactNode; prev: { key: string; node: ReactNode } | null }>(
    { cur: line.key, node: line.node, prev: null },
  );
  if (lines.cur !== line.key) setLines({ cur: line.key, node: line.node, prev: { key: lines.cur, node: lines.node } });
  const fading = lines.prev;

  return (
    <section
      className={["ui-at-cited", className].filter(Boolean).join(" ")}
      data-dim={hover?.from === "chip" || undefined}
      aria-label="Answer with sources"
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          e.preventDefault();
          closeAndFocus();
        }
      }}
    >
      <style href="ui-cited-answer" precedence="default">
        {css}
      </style>
      <div className="ui-at-cited__panel">
        <div className="ui-at-cited__head">
          <span className="ui-at-cited__stack" aria-hidden="true">
            {sources.slice(0, 4).map((s) => (
              <span key={s.id} className="ui-at-cited__pebble">
                {s.icon ?? s.site.slice(0, 1).toUpperCase()}
              </span>
            ))}
          </span>
          <span>
            {sources.length} source{sources.length === 1 ? "" : "s"}
            {pagesRead !== undefined && ` · ${pagesRead} page${pagesRead === 1 ? "" : "s"} read`}
          </span>
        </div>

        <div className="ui-at-cited__text">
          {paragraphs.length === 0 && <p className="ui-at-cited__empty">No answer yet.</p>}
          {paragraphs.map((para, pi) => (
            <p key={pi}>
              {para.map((s, si) => {
                const lead = /^\s*/.exec(s.text)![0];
                const trail = /\s*$/.exec(s.text)![0];
                const core = s.text.slice(lead.length, s.text.length - trail.length);
                const isLit = lit !== null && s.cite.includes(lit);
                if (!s.cite.length) {
                  return (
                    <span key={si} className="ui-at-cited__seg">
                      {s.text}
                    </span>
                  );
                }
                const cut = core.search(/\S+$/);
                const head = cut > 0 ? core.slice(0, cut) : "";
                const last = cut >= 0 ? core.slice(cut) : core;
                return (
                  <span key={si}>
                    {lead}
                    <span className="ui-at-cited__seg" data-cites data-lit={isLit || undefined}>
                      {head}
                      <span className="ui-at-cited__tail">
                        {last}
                        {s.cite.map((id) => {
                          const n = (index.get(id) ?? 0) + 1;
                          const src = sources[n - 1];
                          return (
                            <button
                              key={id}
                              type="button"
                              className="ui-at-cited__marker"
                              data-on={open === id || undefined}
                              data-lit={hover?.id === id || undefined}
                              aria-label={label(src, n)}
                              aria-expanded={open === id}
                              aria-controls={`${uid}-pv`}
                              onClick={() => toggle(id)}
                              onMouseEnter={() => setHover({ id, from: "marker" })}
                              onMouseLeave={() => setHover(null)}
                              onFocus={() => setHover({ id, from: "marker" })}
                              onBlur={() => setHover(null)}
                            >
                              {n}
                            </button>
                          );
                        })}
                      </span>
                    </span>
                    {trail}
                  </span>
                );
              })}
            </p>
          ))}
        </div>

        <div className="ui-at-cited__pv" data-open={open ? "" : undefined}>
          <div className="ui-at-cited__pvclip">
            <div
              id={`${uid}-pv`}
              role="region"
              aria-label={shownSource ? `Preview of ${shownSource.site}` : "Source preview"}
              className="ui-at-cited__pvbox"
              inert={!open}
            >
              {shownSource && (
                <div key={shownSource.id} className="ui-at-cited__pvin">
                  <div className="ui-at-cited__pvhead">
                    <span className="ui-at-cited__pebble" aria-hidden="true">
                      {shownSource.icon ?? shownSource.site.slice(0, 1).toUpperCase()}
                    </span>
                    <span className="ui-at-cited__where">
                      {domain(shownSource.url) || shownSource.site}
                      {shownSource.date && ` · ${shownSource.date}`}
                    </span>
                    <span className="ui-at-cited__tag" aria-label={`Source ${shownNum}`}>
                      {shownNum}
                    </span>
                    <button
                      type="button"
                      className="ui-at-cited__close"
                      aria-label="Close preview"
                      onClick={closeAndFocus}
                    >
                      <IconClose />
                    </button>
                  </div>
                  <p className="ui-at-cited__title">{shownSource.title}</p>
                  {shownSource.quote && (
                    <blockquote className="ui-at-cited__quote">
                      {markQuote(shownSource.quote, shownSource.highlight, citingText)}
                    </blockquote>
                  )}
                  <div className="ui-at-cited__pvbtns">
                    {(shownSource.url || onOpenSource) && (
                      <a
                        className="ui-at-cited__open"
                        href={shownSource.url ?? "#"}
                        target={onOpenSource ? undefined : "_blank"}
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          if (onOpenSource) {
                            e.preventDefault();
                            onOpenSource(shownSource);
                          }
                        }}
                      >
                        Open source
                        <IconOut />
                      </a>
                    )}
                    {shownSource.quote && (
                      <button type="button" className="ui-at-cited__copy" onClick={copyQuote}>
                        <IconCopy />
                        <span className="ui-at-cited__copylabel">{copied ? "Copied" : "Copy quote"}</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="ui-at-cited__tray">
        <div className="ui-at-cited__chips" role="group" aria-label="Sources">
          {sources.map((s, i) => (
            <button
              key={s.id}
              ref={(el) => {
                if (el) chipRefs.current.set(s.id, el);
                else chipRefs.current.delete(s.id);
              }}
              type="button"
              className="ui-at-cited__chip"
              data-on={open === s.id || undefined}
              data-lit={lit === s.id || undefined}
              aria-label={label(s, i + 1)}
              aria-expanded={open === s.id}
              aria-controls={`${uid}-pv`}
              onClick={() => toggle(s.id)}
              onKeyDown={(e) => chipKeys(e, i)}
              onMouseEnter={() => setHover({ id: s.id, from: "chip" })}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover({ id: s.id, from: "chip" })}
              onBlur={() => setHover(null)}
            >
              <span className="ui-at-cited__pebble" aria-hidden="true">
                {s.icon ?? s.site.slice(0, 1).toUpperCase()}
              </span>
              <span className="ui-at-cited__chipname">{s.site}</span>
              <span className="ui-at-cited__chipnum" aria-hidden="true">
                {i + 1}
              </span>
            </button>
          ))}
        </div>
        <div className="ui-at-cited__foot">
          <div className="ui-at-cited__line" role="status" aria-live="polite">
            {fading && (
              <span key={`f-${fading.key}`} className="ui-at-cited__lineout" aria-hidden="true">
                {fading.node}
              </span>
            )}
            <span key={line.key} className="ui-at-cited__linein">
              {line.node}
            </span>
          </div>
          {action && (
            <button type="button" className="ui-at-cited__action" onClick={action.onClick}>
              {action.label}
              <IconArrow />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

const css = /* css */ `
.ui-at-cited {
  --frame: #f2f6fa; --panel: #ffffff; --soft: rgba(26, 62, 112, 0.06);
  --line: #dae2ec; --line-firm: #cbd6e4;
  --ink: #00162b; --text: rgba(0, 22, 43, 0.66); --muted: rgba(0, 22, 43, 0.54);
  --berry: #851437;
  --info-ink: #1a3e70; --info-fill: #eef5ff; --info-line: #c1daff; --ring: #8fbdf2;
  --tint: rgba(143, 189, 242, 0.24);
  --pebble: #ffffff; --pebble-shade: inset 0 -2px 6px -4px rgba(26, 62, 112, 0.4);
  --secondary: #fbfcfe;
  --drop: 0 8px 16px -8px rgba(26, 62, 112, 0.2);
  --short-drop: 0 2px 4px -2px rgba(26, 62, 112, 0.22);
  --raised: 0 18px 30px -16px rgba(26, 62, 112, 0.38), 0 4px 10px -6px rgba(26, 62, 112, 0.18);
  --float: 0 24px 48px -24px rgba(26, 62, 112, 0.3);
  --ease: cubic-bezier(.16, 1, .3, 1);
  box-sizing: border-box;
  width: 100%;
  max-width: 460px;
  min-width: 0;
  padding: 6px;
  border-radius: 22px;
  background: var(--frame);
  border: 1px solid var(--line);
  box-shadow: var(--float);
  font-family: "Avenir Next", Avenir, system-ui, sans-serif;
  font-size: 14.5px;
  line-height: 1.6;
  color: var(--text);
  text-align: left;
}
:where(.dark, [data-theme="dark"]) .ui-at-cited {
  --frame: #0f2747; --panel: #16345c; --soft: rgba(255, 255, 255, 0.07);
  --line: rgba(255, 255, 255, 0.12); --line-firm: rgba(255, 255, 255, 0.18);
  --ink: rgba(255, 255, 255, 0.94); --text: rgba(255, 255, 255, 0.72); --muted: rgba(255, 255, 255, 0.56);
  --berry: #a8204d;
  --info-ink: #c1daff; --info-fill: rgba(143, 189, 242, 0.16); --info-line: rgba(143, 189, 242, 0.34); --ring: rgba(143, 189, 242, 0.6);
  --tint: rgba(143, 189, 242, 0.2);
  --pebble: #1d4170; --pebble-shade: inset 0 -2px 6px -4px rgba(3, 12, 28, 0.8);
  --secondary: #1b3d68;
  --drop: 0 8px 16px -8px rgba(3, 12, 28, 0.6);
  --short-drop: 0 2px 4px -2px rgba(3, 12, 28, 0.6);
  --raised: 0 18px 30px -16px rgba(3, 12, 28, 0.8), 0 4px 10px -6px rgba(3, 12, 28, 0.6);
  --float: 0 24px 48px -24px rgba(3, 12, 28, 0.7);
}
.ui-at-cited *, .ui-at-cited *::before, .ui-at-cited *::after { box-sizing: border-box; }
.ui-at-cited button { font: inherit; color: inherit; }
.ui-at-cited :focus-visible { outline: none; box-shadow: 0 0 0 3px var(--ring); }

.ui-at-cited__panel {
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 16px;
  box-shadow: var(--raised);
  padding: 14px 16px 16px;
}
.ui-at-cited__head { display: flex; align-items: center; gap: 8px; font-size: 12.5px; color: var(--muted); margin-bottom: 8px; }
.ui-at-cited__stack { display: inline-flex; }
.ui-at-cited__stack .ui-at-cited__pebble + .ui-at-cited__pebble { margin-left: -5px; }
.ui-at-cited__pebble {
  flex: none;
  display: inline-grid;
  place-items: center;
  width: 18px;
  height: 18px;
  border-radius: 6px;
  background: var(--pebble);
  border: 1px solid var(--line);
  box-shadow: var(--pebble-shade);
  font-size: 10px;
  font-weight: 700;
  line-height: 1;
  color: var(--info-ink);
}
.ui-at-cited__pebble svg, .ui-at-cited__pebble img { width: 12px; height: 12px; }

.ui-at-cited__text p { margin: 0 0 10px; overflow-wrap: anywhere; }
.ui-at-cited__text p:last-child { margin-bottom: 0; }
.ui-at-cited__empty { color: var(--muted); }
.ui-at-cited__seg {
  border-radius: 4px;
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
  transition: background-color 150ms var(--ease), color 150ms var(--ease), opacity 300ms var(--ease);
}
.ui-at-cited__seg[data-lit] { background: var(--tint); color: var(--ink); }
.ui-at-cited[data-dim] .ui-at-cited__seg:not([data-lit]) { opacity: 0.42; }
.ui-at-cited__tail { white-space: nowrap; }
.ui-at-cited__marker {
  position: relative;
  display: inline-grid;
  place-items: center;
  min-width: 17px;
  height: 17px;
  margin-left: 3px;
  padding: 0 4px;
  vertical-align: 1px;
  border-radius: 5px;
  border: 1px solid var(--line-firm);
  background: var(--pebble);
  font-size: 10.5px;
  font-weight: 700;
  line-height: 1;
  color: var(--info-ink);
  cursor: pointer;
  transition: background-color 150ms var(--ease), color 150ms var(--ease), border-color 150ms var(--ease);
}
.ui-at-cited__marker::after { content: ""; position: absolute; inset: -5px -3px; }
.ui-at-cited__marker[data-lit] { border-color: var(--info-line); background: var(--info-fill); }
.ui-at-cited__marker[data-on] { background: var(--ink); border-color: var(--ink); color: var(--panel); }

.ui-at-cited__pv { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 300ms var(--ease); }
.ui-at-cited__pv[data-open] { grid-template-rows: 1fr; }
.ui-at-cited__pvclip { min-height: 0; overflow: hidden; }
.ui-at-cited__pvbox {
  margin-top: 14px;
  padding: 12px 12px 12px;
  border-radius: 12px;
  background: var(--frame);
  border: 1px solid var(--line);
  opacity: 0;
  transform: translateY(-4px);
  transition: opacity 300ms var(--ease), transform 300ms var(--ease);
}
.ui-at-cited__pv[data-open] .ui-at-cited__pvbox { opacity: 1; transform: none; }
.ui-at-cited__pvin { animation: ui-at-cited-fade 300ms var(--ease) both; }
.ui-at-cited__pvhead { display: flex; align-items: center; gap: 8px; min-width: 0; font-size: 12px; color: var(--muted); }
.ui-at-cited__where { flex: 1; min-width: 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.ui-at-cited__tag {
  display: grid;
  place-items: center;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  border-radius: 5px;
  border: 1px solid var(--line-firm);
  background: var(--pebble);
  font-size: 10.5px;
  font-weight: 700;
  color: var(--ink);
}
.ui-at-cited__close {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  margin: -4px -4px -4px 0;
  border: 0;
  border-radius: 7px;
  background: transparent;
  color: var(--muted);
  cursor: pointer;
  transition: background-color 150ms var(--ease), color 150ms var(--ease);
}
.ui-at-cited__close:hover { background: var(--soft); color: var(--ink); }
.ui-at-cited__title { margin: 8px 0 6px; font-weight: 650; color: var(--ink); line-height: 1.35; }
.ui-at-cited__quote {
  margin: 0 0 12px;
  padding: 0 0 0 11px;
  border-left: 2px solid var(--line-firm);
  font-size: 13.5px;
  line-height: 1.55;
  color: var(--muted);
}
.ui-at-cited__mark {
  background: var(--tint);
  color: var(--ink);
  border-radius: 3px;
  padding: 0 1px;
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
}
.ui-at-cited__pvbtns { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.ui-at-cited__open {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid var(--line-firm);
  background: var(--secondary);
  box-shadow: var(--short-drop);
  font-size: 13px;
  font-weight: 600;
  color: var(--ink);
  text-decoration: none;
  transition: border-color 150ms var(--ease), box-shadow 150ms var(--ease);
}
.ui-at-cited__open:hover { border-color: var(--info-line); box-shadow: var(--drop); }
.ui-at-cited__copy {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 10px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  font-size: 13px;
  color: var(--muted) !important;
  cursor: pointer;
  transition: background-color 150ms var(--ease), color 150ms var(--ease);
}
.ui-at-cited__copy:hover { background: var(--soft); color: var(--ink) !important; }

.ui-at-cited__tray { padding: 8px 6px 4px; }
.ui-at-cited__chips { display: flex; flex-wrap: wrap; gap: 4px; }
.ui-at-cited__chip {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  min-width: 0;
  max-width: 100%;
  height: 30px;
  padding: 0 9px 0 6px;
  border-radius: 10px;
  border: 1px solid transparent;
  background: transparent;
  font-size: 13px;
  color: var(--text);
  cursor: pointer;
  transition: background-color 150ms var(--ease), border-color 150ms var(--ease), box-shadow 150ms var(--ease), color 150ms var(--ease);
}
.ui-at-cited__chip:hover, .ui-at-cited__chip[data-lit] { background: var(--soft); color: var(--ink); }
.ui-at-cited__chip[data-on] { background: var(--panel); border-color: var(--line-firm); box-shadow: var(--short-drop); color: var(--ink); }
.ui-at-cited__chipname { min-width: 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.ui-at-cited__chipnum { font-size: 11.5px; color: var(--muted); font-variant-numeric: tabular-nums; }
.ui-at-cited__foot { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 8px 4px 2px 6px; min-height: 36px; }
.ui-at-cited__line { position: relative; flex: 1; min-width: 0; display: grid; font-size: 12.5px; color: var(--muted); }
.ui-at-cited__line > span { grid-area: 1 / 1; min-width: 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.ui-at-cited__line b { color: var(--ink); font-weight: 600; }
.ui-at-cited__linein { animation: ui-at-cited-in 300ms var(--ease) both; }
.ui-at-cited__lineout { animation: ui-at-cited-out 300ms var(--ease) both; pointer-events: none; }
.ui-at-cited__action {
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 30px;
  padding: 0 8px;
  border: 0;
  border-radius: 9px;
  background: transparent;
  font-size: 13px;
  font-weight: 600;
  color: var(--ink);
  cursor: pointer;
  transition: background-color 150ms var(--ease);
}
.ui-at-cited__action svg { color: var(--berry); transition: transform 150ms var(--ease); }
.ui-at-cited__action:hover { background: var(--soft); }
.ui-at-cited__action:hover svg { transform: translateX(2px); }

@keyframes ui-at-cited-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes ui-at-cited-in { from { opacity: 0; transform: translateY(3px); } to { opacity: 1; transform: none; } }
@keyframes ui-at-cited-out { from { opacity: 1; } to { opacity: 0; transform: translateY(-3px); } }

@media (max-width: 360px) {
  .ui-at-cited__panel { padding: 12px 12px 14px; }
  .ui-at-cited__tag { display: none; }
  .ui-at-cited__chip { padding: 0 7px 0 5px; }
}
@media (max-width: 280px) { .ui-at-cited__copylabel { display: none; } }
@media (pointer: coarse) {
  .ui-at-cited__marker::after { inset: -10px -6px; }
  .ui-at-cited__chip { height: 38px; }
  .ui-at-cited__open, .ui-at-cited__copy { height: 40px; }
}
@media (prefers-reduced-motion: reduce) {
  .ui-at-cited *, .ui-at-cited *::before, .ui-at-cited *::after { animation-duration: 0s !important; transition-duration: 0s !important; }
}
`;
