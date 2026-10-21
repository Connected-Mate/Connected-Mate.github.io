"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";

export type ThinkingSource = {
  label: string;
  icon?: ReactNode;
  href?: string;
  /** Shown on hover and focus; the link's address is used when it's missing */
  tooltip?: string;
};

export type ThinkingStep = {
  kind: "search" | "step";
  label: string;
  /** Label while the step is running, e.g. "Searching the web" */
  activeLabel?: string;
  sources?: ThinkingSource[];
  /** Hidden behind a "+N more" chip */
  moreSources?: ThinkingSource[];
};

export type ThinkingStateProps = {
  steps: ThinkingStep[];
  doneLabel?: string;
  stepMs?: number;
  loop?: boolean;
  onDone?: (seconds: number) => void;
  className?: string;
};

const LOOP_PAUSE = 3200;

function hostOf(href?: string) {
  if (!href) return "";
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return href;
  }
}

const IconSearch = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.6" />
    <path d="m10.5 10.5 3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);
const IconChevron = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function Source({ s, delay, tipId }: { s: ThinkingSource; delay: number; tipId: string }) {
  const tip = s.tooltip ?? hostOf(s.href);
  const body = (
    <>
      <span className="ui-at-think__icon" aria-hidden="true">
        {s.icon ?? s.label.slice(0, 1).toUpperCase()}
      </span>
      <span className="ui-at-think__srclabel">{s.label}</span>
      {tip && (
        <span className="ui-at-think__tip" role="tooltip" id={tipId}>
          {tip}
        </span>
      )}
    </>
  );
  const common = {
    className: "ui-at-think__src",
    style: { animationDelay: `${delay}ms` },
    "aria-describedby": tip ? tipId : undefined,
  };
  return s.href ? (
    <a {...common} href={s.href} target="_blank" rel="noopener noreferrer">
      {body}
    </a>
  ) : (
    <span {...common} tabIndex={tip ? 0 : undefined}>
      {body}
    </span>
  );
}

export function ThinkingState({
  steps,
  doneLabel = "Finished thinking",
  stepMs = 1300,
  loop = false,
  onDone,
  className,
}: ThinkingStateProps) {
  const uid = useId();
  const [run, setRun] = useState(0);
  const [count, setCount] = useState(steps.length ? 1 : 0);
  const [seconds, setSeconds] = useState(0);
  const [final, setFinal] = useState<number | null>(null);
  const [open, setOpen] = useState(true);
  const [more, setMore] = useState<Record<number, boolean>>({});
  const start = useRef(0);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  const done = count > steps.length;

  // Restart when the run changes or a new list of steps arrives.
  useEffect(() => {
    start.current = performance.now();
    setCount(steps.length ? 1 : 0);
    setSeconds(0);
    setFinal(null);
    setMore({});
  }, [run, steps]);

  // Reveal the next step every stepMs; one extra tick reveals the final row.
  useEffect(() => {
    if (done || !steps.length) return;
    const id = window.setTimeout(() => setCount((c) => c + 1), stepMs);
    return () => window.clearTimeout(id);
  }, [count, done, stepMs, steps.length]);

  // Live timer while thinking.
  useEffect(() => {
    if (done) return;
    const id = window.setInterval(() => {
      setSeconds(Math.floor((performance.now() - start.current) / 1000));
    }, 250);
    return () => window.clearInterval(id);
  }, [done, run]);

  useEffect(() => {
    if (!done || final !== null) return;
    const s = Math.max(1, Math.round((performance.now() - start.current) / 1000));
    setFinal(s);
    onDoneRef.current?.(s);
  }, [done, final]);

  useEffect(() => {
    if (!loop || final === null) return;
    const id = window.setTimeout(() => setRun((r) => r + 1), LOOP_PAUSE);
    return () => window.clearTimeout(id);
  }, [loop, final]);

  const visible = steps.slice(0, Math.min(count, steps.length));

  return (
    <section
      className={["ui-at-think", className].filter(Boolean).join(" ")}
      data-state={done ? "done" : "thinking"}
      aria-label="Assistant progress"
    >
      <style href="ui-thinking-state" precedence="default">
        {css}
      </style>
      <button
        type="button"
        className="ui-at-think__head"
        aria-expanded={open}
        aria-controls={`${uid}-steps`}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="ui-at-think__chev" aria-hidden="true">
          <IconChevron />
        </span>
        {done ? (
          <span className="ui-at-think__title" key="done">
            Worked for {final ?? seconds}s
          </span>
        ) : (
          <span className="ui-at-think__title" key="live">
            <span className="ui-at-think__shine">Thinking</span>
            <span className="ui-at-think__timer" aria-hidden="true">
              {seconds}s
            </span>
          </span>
        )}
      </button>

      <div className="ui-at-think__fold" data-open={open || undefined}>
        <div className="ui-at-think__clip" inert={!open}>
          <ol className="ui-at-think__steps" id={`${uid}-steps`} aria-live="polite">
            {visible.map((step, i) => {
              const active = !done && i === count - 1;
              const label = active && step.activeLabel ? step.activeLabel : step.label;
              const extra = step.moreSources ?? [];
              const shownSources = [...(step.sources ?? []), ...(more[i] ? extra : [])];
              return (
                <li
                  key={`${run}-${i}`}
                  className="ui-at-think__step"
                  data-kind={step.kind}
                  data-active={active || undefined}
                >
                  <span className="ui-at-think__node" aria-hidden="true">
                    {step.kind === "search" ? <IconSearch /> : <span className="ui-at-think__dot" />}
                  </span>
                  <div className="ui-at-think__body">
                    <span className="ui-at-think__label">{label}</span>
                    {(shownSources.length > 0 || extra.length > 0) && (
                      <div className="ui-at-think__sources">
                        {shownSources.map((s, si) => (
                          <Source
                            key={si}
                            s={s}
                            tipId={`${uid}-tip-${i}-${si}`}
                            delay={si < (step.sources?.length ?? 0) ? 120 + si * 140 : (si - (step.sources?.length ?? 0)) * 80}
                          />
                        ))}
                        {extra.length > 0 && !more[i] && (
                          <button
                            type="button"
                            className="ui-at-think__more"
                            style={{ animationDelay: `${120 + (step.sources?.length ?? 0) * 140}ms` }}
                            onClick={() => setMore((m) => ({ ...m, [i]: true }))}
                            aria-label={`Show ${extra.length} more source${extra.length === 1 ? "" : "s"}`}
                          >
                            +{extra.length} more
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
            {done && (
              <li key={`${run}-done`} className="ui-at-think__step" data-kind="done">
                <span className="ui-at-think__node" aria-hidden="true">
                  <svg className="ui-at-think__check" width="18" height="18" viewBox="0 0 18 18">
                    <circle cx="9" cy="9" r="9" />
                    <path d="m5.2 9.3 2.5 2.5 5-5.3" />
                  </svg>
                </span>
                <div className="ui-at-think__body">
                  <span className="ui-at-think__label">{doneLabel}</span>
                </div>
              </li>
            )}
          </ol>
        </div>
      </div>
    </section>
  );
}

const css = /* css */ `
.ui-at-think {
  --frame: #f2f6fa; --panel: #ffffff; --soft: rgba(26, 62, 112, 0.06);
  --line: #dae2ec; --line-firm: #cbd6e4;
  --ink: #00162b; --text: rgba(0, 22, 43, 0.66); --muted: rgba(0, 22, 43, 0.54);
  --berry: #851437;
  --info-ink: #1a3e70; --info-fill: #eef5ff; --info-line: #c1daff; --ring: #8fbdf2;
  --pebble: #ffffff; --pebble-shade: inset 0 -2px 6px -4px rgba(26, 62, 112, 0.4);
  --tip-bg: #00162b; --tip-ink: #ffffff;
  --raised: 0 18px 30px -16px rgba(26, 62, 112, 0.38), 0 4px 10px -6px rgba(26, 62, 112, 0.18);
  --drop: 0 8px 16px -8px rgba(26, 62, 112, 0.2);
  --ease: cubic-bezier(.16, 1, .3, 1);
  box-sizing: border-box;
  width: 100%;
  max-width: 520px;
  min-width: 0;
  padding: 14px 18px 16px;
  border-radius: 16px;
  background: var(--panel);
  border: 1px solid var(--line);
  box-shadow: var(--raised);
  font-family: "Avenir Next", Avenir, system-ui, sans-serif;
  font-size: 14px;
  line-height: 1.5;
  color: var(--text);
  text-align: left;
}
:where(.dark, [data-theme="dark"]) .ui-at-think {
  --frame: #0f2747; --panel: #16345c; --soft: rgba(255, 255, 255, 0.07);
  --line: rgba(255, 255, 255, 0.12); --line-firm: rgba(255, 255, 255, 0.18);
  --ink: rgba(255, 255, 255, 0.94); --text: rgba(255, 255, 255, 0.72); --muted: rgba(255, 255, 255, 0.56);
  --berry: #a8204d;
  --info-ink: #c1daff; --info-fill: rgba(143, 189, 242, 0.16); --info-line: rgba(143, 189, 242, 0.34); --ring: rgba(143, 189, 242, 0.6);
  --pebble: #1d4170; --pebble-shade: inset 0 -2px 6px -4px rgba(3, 12, 28, 0.8);
  --tip-bg: #f2f6fa; --tip-ink: #00162b;
  --raised: 0 18px 30px -16px rgba(3, 12, 28, 0.8), 0 4px 10px -6px rgba(3, 12, 28, 0.6);
  --drop: 0 8px 16px -8px rgba(3, 12, 28, 0.6);
}
.ui-at-think *, .ui-at-think *::before, .ui-at-think *::after { box-sizing: border-box; }
.ui-at-think button { font: inherit; color: inherit; }
.ui-at-think :focus-visible { outline: none; box-shadow: 0 0 0 3px var(--ring); }

.ui-at-think__head {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 4px -6px;
  padding: 4px 10px 4px 6px;
  border: 0;
  border-radius: 9px;
  background: transparent;
  cursor: pointer;
  font-size: 15px;
  transition: background-color 150ms var(--ease);
}
.ui-at-think__head:hover { background: var(--soft); }
.ui-at-think__chev { display: grid; place-items: center; width: 22px; color: var(--muted); transform: rotate(-90deg); transition: transform 300ms var(--ease); }
.ui-at-think__head[aria-expanded="true"] .ui-at-think__chev { transform: none; }
.ui-at-think__title { display: inline-flex; gap: 8px; color: var(--ink); font-weight: 600; animation: ui-at-think-fade 300ms var(--ease) both; }
.ui-at-think[data-state="done"] .ui-at-think__title { color: var(--text); font-weight: 500; }
.ui-at-think__timer { color: var(--muted); font-variant-numeric: tabular-nums; font-weight: 500; }
.ui-at-think__shine,
.ui-at-think__step[data-active] .ui-at-think__label {
  background: linear-gradient(90deg, var(--muted) 0%, var(--muted) 38%, var(--ink) 50%, var(--muted) 62%, var(--muted) 100%);
  background-size: 260% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: ui-at-think-shine 1.8s linear infinite;
}

.ui-at-think__fold { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 300ms var(--ease); }
.ui-at-think__fold[data-open] { grid-template-rows: 1fr; }
.ui-at-think__clip { min-height: 0; overflow: hidden; }
.ui-at-think__steps { list-style: none; margin: 0; padding: 4px 0 0; }
.ui-at-think__step {
  position: relative;
  display: grid;
  grid-template-columns: 22px minmax(0, 1fr);
  gap: 12px;
  padding-bottom: 14px;
  animation: ui-at-think-rise 420ms var(--ease) both;
}
.ui-at-think__step:last-child { padding-bottom: 2px; }
.ui-at-think__step:not(:last-child)::after {
  content: "";
  position: absolute;
  left: 10.5px;
  top: 21px;
  bottom: 3px;
  width: 1px;
  background: var(--line-firm);
  transform-origin: top;
  animation: ui-at-think-grow 420ms var(--ease) both;
}
.ui-at-think__step[data-kind="search"]:not(:last-child)::after { top: 27px; }
.ui-at-think__node { position: relative; display: grid; justify-items: center; align-self: stretch; height: auto; color: var(--info-ink); }
.ui-at-think__step[data-kind="search"] .ui-at-think__node::before {
  content: "";
  position: absolute;
  top: 0;
  width: 22px;
  height: 22px;
  border-radius: 7px;
  background: var(--pebble);
  border: 1px solid var(--line);
  box-shadow: var(--pebble-shade);
}
.ui-at-think__node > svg { position: relative; margin-top: 4.5px; }
.ui-at-think__dot {
  display: block;
  width: 7px;
  height: 7px;
  margin-top: 7.5px;
  border-radius: 50%;
  background: var(--info-ink);
  opacity: 0.55;
  transition: background-color 300ms var(--ease), opacity 300ms var(--ease);
}
.ui-at-think__step[data-active] .ui-at-think__dot { background: var(--berry); opacity: 1; animation: ui-at-think-pulse 1.2s var(--ease) infinite; }
.ui-at-think__body { min-width: 0; }
.ui-at-think__label { display: inline-block; padding-top: 1px; color: var(--text); overflow-wrap: anywhere; }

.ui-at-think__sources { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
.ui-at-think__src, .ui-at-think__more {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  max-width: 100%;
  min-height: 28px;
  padding: 3px 10px 3px 4px;
  border-radius: 9px;
  border: 1px solid transparent;
  background: var(--info-fill);
  font-size: 13px;
  color: var(--ink);
  text-decoration: none;
  animation: ui-at-think-pop 360ms var(--ease) both;
  transition: border-color 150ms var(--ease), box-shadow 150ms var(--ease);
}
.ui-at-think__src:hover, .ui-at-think__src:focus-visible { border-color: var(--info-line); }
.ui-at-think__src:focus-visible { box-shadow: 0 0 0 3px var(--ring); }
.ui-at-think__icon {
  flex: none;
  display: grid;
  place-items: center;
  width: 20px;
  height: 20px;
  border-radius: 6px;
  background: var(--pebble);
  border: 1px solid var(--line);
  box-shadow: var(--pebble-shade);
  font-size: 10px;
  font-weight: 700;
  color: var(--info-ink);
}
.ui-at-think__icon svg, .ui-at-think__icon img { width: 12px; height: 12px; }
.ui-at-think__srclabel { min-width: 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.ui-at-think__more { padding: 3px 8px; background: transparent; color: var(--muted); cursor: pointer; }
.ui-at-think__more:hover { background: var(--soft); color: var(--ink); }
.ui-at-think__tip {
  position: absolute;
  left: 50%;
  bottom: calc(100% + 6px);
  z-index: 2;
  max-width: 240px;
  padding: 4px 9px;
  border-radius: 8px;
  background: var(--tip-bg);
  color: var(--tip-ink);
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  box-shadow: var(--drop);
  pointer-events: none;
  opacity: 0;
  transform: translate(-50%, 3px);
  transition: opacity 150ms var(--ease), transform 150ms var(--ease);
}
.ui-at-think__src:hover .ui-at-think__tip, .ui-at-think__src:focus-visible .ui-at-think__tip { opacity: 1; transform: translate(-50%, 0); }

.ui-at-think__check circle { fill: var(--info-ink); transform-origin: center; animation: ui-at-think-pop 360ms var(--ease) both; }
.ui-at-think__check path {
  fill: none;
  stroke: var(--panel);
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 12;
  stroke-dashoffset: 12;
  animation: ui-at-think-draw 300ms var(--ease) 180ms forwards;
}
.ui-at-think__node > .ui-at-think__check { margin-top: 2px; }
.ui-at-think__step[data-kind="done"] .ui-at-think__label { color: var(--ink); font-weight: 500; }

@keyframes ui-at-think-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes ui-at-think-rise { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
@keyframes ui-at-think-pop { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: none; } }
@keyframes ui-at-think-grow { from { transform: scaleY(0); } to { transform: none; } }
@keyframes ui-at-think-draw { to { stroke-dashoffset: 0; } }
@keyframes ui-at-think-pulse { 0%, 100% { transform: scale(0.8); } 50% { transform: scale(1.25); } }
@keyframes ui-at-think-shine { from { background-position: 100% 0; } to { background-position: -160% 0; } }

@media (prefers-reduced-motion: reduce) {
  .ui-at-think *, .ui-at-think *::before, .ui-at-think *::after {
    animation-duration: 0s !important;
    animation-delay: 0s !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0s !important;
  }
  .ui-at-think__check path { stroke-dashoffset: 0; }
}
`;
