var e=`"use client";

import { useState, type ReactNode } from "react";

/*
 * Tips Panel (clean style) – a panel of short tips, each with one action, in one white card, in a single self-contained file.
 * Taking an action marks the tip as done; only the tip list scrolls – the heading and the Close row stay in place.
 * The styles are injected below, so no extra files are needed.
 */

export type Tip = {
  id: string;
  title: string;
  /** Short explanation – may contain a <Kbd> */
  description: ReactNode;
  /** Button text */
  action: string;
  /** Text after the action was taken, e.g. "Enabled" */
  doneLabel?: string;
  /** Shows the action as the dark button – use once for the most important tip */
  primary?: boolean;
  onAction?: () => void;
};

export type TipsPanelProps = {
  title?: string;
  tips: Tip[];
  /** Shows the Close button in the footer */
  onClose?: () => void;
  closeLabel?: string;
  className?: string;
};

export function TipsPanel({ title = "Tips", tips, onClose, closeLabel = "Close", className }: TipsPanelProps) {
  const [done, setDone] = useState<Set<string>>(new Set());

  return (
    <>
      <style href="ui-tips-panel-clean" precedence="default">
        {css}
      </style>
      <section className={["ui-tpc", className].filter(Boolean).join(" ")} aria-label={title}>
        <header className="ui-tpc__head">
          <h3 className="ui-tpc__title">{title}</h3>
          <span className="ui-tpc__count" aria-live="polite">
            {done.size}/{tips.length} done
          </span>
        </header>

        <div className="ui-tpc__body">
          <ul className="ui-tpc__grid">
            {tips.map((tip, i) => {
              const isDone = done.has(tip.id);
              return (
                <li key={tip.id} className="ui-tpc__tip" data-done={isDone || undefined} style={{ animationDelay: \`\${80 + i * 50}ms\` }}>
                  <p className="ui-tpc__tip-title">{tip.title}</p>
                  <p className="ui-tpc__tip-text">{tip.description}</p>
                  {isDone ? (
                    <span className="ui-tpc__done" role="status">
                      <CheckIcon />
                      {tip.doneLabel ?? "Done"}
                    </span>
                  ) : (
                    <button
                      type="button"
                      className={["ui-tpc__btn", tip.primary && "ui-tpc__btn--primary"].filter(Boolean).join(" ")}
                      onClick={() => {
                        setDone((d) => new Set(d).add(tip.id));
                        tip.onAction?.();
                      }}
                    >
                      {tip.action}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {onClose && (
          <footer className="ui-tpc__foot">
            <button type="button" className="ui-tpc__btn" onClick={onClose}>
              {closeLabel}
            </button>
          </footer>
        )}
      </section>
    </>
  );
}

/** Keyboard key for tip descriptions, e.g. <Kbd>⌘K</Kbd> */
export const Kbd = ({ children }: { children: ReactNode }) => <kbd className="ui-tpc__kbd">{children}</kbd>;

const CheckIcon = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
    <circle cx="8" cy="8" r="6.5" fill="currentColor" />
    <path d="m5.6 8.1 1.7 1.7 3.2-3.4" fill="none" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ---------- Styles ---------- */

const css = /* css */ \`
/* Colors and motion as variables – override them on .ui-tpc */
.ui-tpc {
  --ui-tpc-card: #ffffff;
  --ui-tpc-strong: #000000;
  --ui-tpc-ink: rgba(0, 22, 43, 0.88);
  --ui-tpc-text: rgba(0, 22, 43, 0.61);
  --ui-tpc-muted: rgba(0, 22, 43, 0.45);
  --ui-tpc-line: rgba(26, 62, 112, 0.06);
  --ui-tpc-wash: rgba(26, 62, 112, 0.015);
  --ui-tpc-hover: rgba(26, 62, 112, 0.03);
  --ui-tpc-ok: #1a9a52;
  --ui-tpc-primary: rgba(0, 22, 43, 0.88);
  --ui-tpc-primary-hover: rgba(0, 22, 43, 0.8);
  --ui-tpc-on-primary: #fbfcfe;
  /* Strokes are shadows: a 0.5px hairline plus a soft lift */
  --ui-tpc-shadow: 0 0 0 0.5px rgba(26, 62, 112, 0.06), 0 1px 1px -1px rgba(26, 62, 112, 0.1), 0 1px 2px 0 rgba(26, 62, 112, 0.05);
  --ui-tpc-shadow-hover: 0 0 0 0.5px rgba(26, 62, 112, 0.1), 0 1px 1px -1px rgba(26, 62, 112, 0.12), 0 1px 3px 0 rgba(26, 62, 112, 0.07);
  --ui-tpc-focus: rgba(35, 95, 166, 0.35);
  /* Height of the tip list before it scrolls */
  --ui-tpc-max-height: 420px;
  --ui-tpc-ease: cubic-bezier(0.22, 1, 0.36, 1);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 760px;
  /* One white card – the edge is a shadow, not a border */
  border-radius: 10px;
  background: var(--ui-tpc-card);
  box-shadow: var(--ui-tpc-shadow);
  font-family: Avenir Next,Avenir, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  font-size: 13px;
  line-height: 20px;
  font-weight: 400;
  color: var(--ui-tpc-ink);
  text-align: left;
  -webkit-font-smoothing: antialiased;
}
.ui-tpc *, .ui-tpc *::before, .ui-tpc *::after { box-sizing: border-box; }
:where(.ui-tpc) button { margin: 0; padding: 0; border: 0; background: none; font: inherit; color: inherit; cursor: pointer; -webkit-tap-highlight-color: transparent; }
.ui-tpc button:focus-visible { outline: 2px solid var(--ui-tpc-focus); outline-offset: 1px; }
:where(.ui-tpc) svg { display: block; flex: none; }

/* ----- Head ----- */
.ui-tpc__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 0.5px solid var(--ui-tpc-line);
}
.ui-tpc__title {
  margin: 0;
  font-size: 15px;
  font-weight: 500;
  line-height: 24px;
  color: var(--ui-tpc-strong);
}
.ui-tpc__count {
  font-size: 12px;
  line-height: 16px;
  font-variant-numeric: tabular-nums;
  color: var(--ui-tpc-muted);
  white-space: nowrap;
}

/* ----- The tip list: the only part that scrolls ----- */
.ui-tpc__body {
  container-type: inline-size;
  max-height: var(--ui-tpc-max-height);
  overflow-y: auto;
  scrollbar-width: thin;
}
.ui-tpc__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin: 0;
  padding: 12px;
  list-style: none;
}
@container (max-width: 560px) { .ui-tpc__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@container (max-width: 380px) { .ui-tpc__grid { grid-template-columns: minmax(0, 1fr); } }

/* Each tip is a quiet tile: a hairline drawn as an inset shadow */
.ui-tpc__tip {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 12px;
  border-radius: 8px;
  box-shadow: inset 0 0 0 0.5px var(--ui-tpc-line);
  animation: ui-tpc-in 480ms var(--ui-tpc-ease) both;
  transition: background-color 260ms ease;
}
.ui-tpc__tip[data-done] { background: var(--ui-tpc-wash); }
.ui-tpc__tip-title {
  margin: 0;
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
  color: var(--ui-tpc-strong);
}
.ui-tpc__tip-text {
  flex: 1;
  margin: 2px 0 12px;
  font-size: 13px;
  line-height: 20px;
  color: var(--ui-tpc-text);
}
.ui-tpc__kbd {
  display: inline-grid;
  place-items: center;
  min-width: 20px;
  height: 18px;
  padding: 0 5px;
  border-radius: 5px;
  background: var(--ui-tpc-card);
  box-shadow: var(--ui-tpc-shadow);
  font-family: inherit;
  font-size: 11px;
  font-weight: 500;
  line-height: 1;
  color: var(--ui-tpc-ink);
  vertical-align: 1px;
}

/* Secondary: white with the card shadow */
.ui-tpc__btn {
  display: inline-flex;
  align-items: center;
  height: 28px;
  padding: 0 10px;
  border-radius: 6px;
  background: var(--ui-tpc-card);
  box-shadow: var(--ui-tpc-shadow);
  font-size: 13px !important;
  font-weight: 500;
  line-height: 20px;
  color: var(--ui-tpc-strong);
  white-space: nowrap;
  transition: box-shadow 140ms ease, background-color 140ms ease, transform 160ms var(--ui-tpc-ease);
}
.ui-tpc__btn:hover { box-shadow: var(--ui-tpc-shadow-hover); }
.ui-tpc__btn:active { transform: scale(0.98); }
/* Primary: the dark chip */
.ui-tpc__btn--primary {
  background: var(--ui-tpc-primary);
  box-shadow: none;
  color: var(--ui-tpc-on-primary);
}
.ui-tpc__btn--primary:hover { background: var(--ui-tpc-primary-hover); box-shadow: none; }

.ui-tpc__done {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 28px;
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
  color: var(--ui-tpc-ok);
  animation: ui-tpc-pop 360ms var(--ui-tpc-ease);
}

/* ----- The last row inside the card ----- */
.ui-tpc__foot {
  display: flex;
  justify-content: flex-end;
  padding: 8px;
  border-top: 0.5px solid var(--ui-tpc-line);
}

@keyframes ui-tpc-in {
  from { opacity: 0; transform: translateY(4px); }
}
@keyframes ui-tpc-pop {
  from { opacity: 0; transform: scale(0.94); }
}

@media (pointer: coarse) {
  .ui-tpc__btn, .ui-tpc__done { height: 34px; }
}
@media (prefers-reduced-motion: reduce) {
  .ui-tpc__tip, .ui-tpc__done { animation: none; }
  .ui-tpc__tip, .ui-tpc__btn { transition: none; }
}

/* Dark mode: follows a .dark class or data-theme="dark" on any ancestor, e.g. <html> */
:where(.dark, [data-theme="dark"]) .ui-tpc {
  --ui-tpc-card: #061b3a;
  --ui-tpc-strong: #ffffff;
  --ui-tpc-ink: rgba(255, 255, 255, 0.9);
  --ui-tpc-text: rgba(255, 255, 255, 0.62);
  --ui-tpc-muted: rgba(255, 255, 255, 0.46);
  --ui-tpc-line: rgba(255, 255, 255, 0.08);
  --ui-tpc-wash: rgba(255, 255, 255, 0.03);
  --ui-tpc-hover: rgba(255, 255, 255, 0.04);
  --ui-tpc-ok: #5fd394;
  --ui-tpc-primary: rgba(255, 255, 255, 0.9);
  --ui-tpc-primary-hover: rgba(255, 255, 255, 0.8);
  --ui-tpc-on-primary: #061b3a;
  --ui-tpc-shadow: 0 0 0 0.5px rgba(255, 255, 255, 0.1), 0 1px 2px 0 rgba(0, 22, 43, 0.4);
  --ui-tpc-shadow-hover: 0 0 0 0.5px rgba(255, 255, 255, 0.16), 0 1px 2px 0 rgba(0, 22, 43, 0.4);
  --ui-tpc-focus: rgba(72, 131, 206, 0.5);
  color-scheme: dark;
}
:where(.dark, [data-theme="dark"]) .ui-tpc__btn:not(.ui-tpc__btn--primary) { background: #0b2345; }
/* ——— A-Team design system (Osmose), from scripts/theme/composants.py ——— */
.ui-tpc.ui-tpc {
  --ui-tpc-card: #ffffff;
  --ui-tpc-strong: #00162b;
  --ui-tpc-ink: #00162b;
  --ui-tpc-text: rgba(0, 22, 43, 0.66);
  --ui-tpc-muted: rgba(0, 22, 43, 0.56);
  --ui-tpc-line: #dae2ec;
  --ui-tpc-wash: rgba(26, 62, 112, 0.035);
  --ui-tpc-hover: rgba(26, 62, 112, 0.06);
  --ui-tpc-ok: #1d6a34;
  --ui-tpc-primary: #851437;
  --ui-tpc-primary-hover: #6d0f2d;
  --ui-tpc-on-primary: #ffffff;
  --ui-tpc-shadow: 0 0 0 1px #dae2ec, 0 8px 16px -8px rgba(26, 62, 112, 0.2);
  --ui-tpc-shadow-hover: 0 0 0 1px #cbd6e4, 0 14px 24px -14px rgba(26, 62, 112, 0.38), 0 4px 10px -6px rgba(26, 62, 112, 0.18);
  --ui-tpc-focus: rgba(143, 189, 242, 0.8);
  --ui-tpc-ease: cubic-bezier(0.16, 1, 0.3, 1);
}
:is(.dark, [data-theme="dark"]) .ui-tpc.ui-tpc {
  --ui-tpc-card: #16345c;
  --ui-tpc-strong: #ffffff;
  --ui-tpc-ink: rgba(255, 255, 255, 0.94);
  --ui-tpc-text: rgba(255, 255, 255, 0.72);
  --ui-tpc-muted: rgba(255, 255, 255, 0.58);
  --ui-tpc-line: rgba(255, 255, 255, 0.12);
  --ui-tpc-wash: rgba(255, 255, 255, 0.04);
  --ui-tpc-hover: rgba(255, 255, 255, 0.07);
  --ui-tpc-ok: #7fe0a0;
  --ui-tpc-primary: #a8204d;
  --ui-tpc-primary-hover: #bd2a5a;
  --ui-tpc-on-primary: #ffffff;
  --ui-tpc-shadow: 0 0 0 1px rgba(255, 255, 255, 0.11), 0 8px 16px -8px rgba(3, 12, 28, 0.6);
  --ui-tpc-shadow-hover: 0 0 0 1px rgba(255, 255, 255, 0.18), 0 14px 24px -14px rgba(3, 12, 28, 0.75);
  --ui-tpc-focus: rgba(143, 189, 242, 0.6);
  --ui-tpc-ease: cubic-bezier(0.16, 1, 0.3, 1);
}
html body .ui-tpc {
  border-radius: 16px;
  box-shadow: 0 0 0 1px #dae2ec, 0 0 0 6px #f2f6fa, 0 0 0 7px #dae2ec,
  0 26px 38px -22px rgba(26, 62, 112, 0.45), 0 6px 14px -8px rgba(26, 62, 112, 0.18);
}
html:is(.dark, [data-theme="dark"]) body .ui-tpc,
html body :is(.dark, [data-theme="dark"]) .ui-tpc {
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.12), 0 0 0 6px #0f2747, 0 0 0 7px rgba(255, 255, 255, 0.1),
  0 26px 40px -20px rgba(3, 12, 28, 0.8);
}
html body .ui-tpc__btn--primary {
  border-radius: 9px;
  font-weight: 600;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 6px 12px -6px rgba(133, 20, 55, 0.6);
  transition: background-color .15s, box-shadow .15s, transform .15s cubic-bezier(.16, 1, .3, 1);
}
html:is(.dark, [data-theme="dark"]) body .ui-tpc__btn--primary,
html body :is(.dark, [data-theme="dark"]) .ui-tpc__btn--primary {
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 6px 14px -6px rgba(3, 12, 28, 0.8);
}
html body .ui-tpc__btn {
  border-radius: 9px;
}
html body .ui-tpc__title {
  font-family: "Avenir Next Condensed", "Avenir Next", Avenir, "Arial Narrow", system-ui, sans-serif;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 0.002em;
}
html body .ui-tpc__foot {
  background: #f5f8fb;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
}
html:is(.dark, [data-theme="dark"]) body .ui-tpc__foot,
html body :is(.dark, [data-theme="dark"]) .ui-tpc__foot {
  background: rgba(4, 16, 38, 0.32);
}
html body .ui-tpc__btn:where(:not([class*="primary"]):not([class*="ghost"]):not([data-variant])) {
  box-shadow: 0 0 0 1px #cbd6e4, 0 6px 12px -8px rgba(26, 62, 112, 0.35);
  font-weight: 600;
}
html:is(.dark, [data-theme="dark"]) body .ui-tpc__btn:where(:not([class*="primary"]):not([class*="ghost"]):not([data-variant])),
html body :is(.dark, [data-theme="dark"]) .ui-tpc__btn:where(:not([class*="primary"]):not([class*="ghost"]):not([data-variant])) {
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.16), 0 6px 12px -8px rgba(3, 12, 28, 0.7);
}
html body .ui-tpc__kbd {
  background: #ffffff;
  box-shadow: 0 0 0 1px #dae2ec, 0 1px 0 1px #cbd6e4;
}
html:is(.dark, [data-theme="dark"]) body .ui-tpc__kbd,
html body :is(.dark, [data-theme="dark"]) .ui-tpc__kbd {
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.14), 0 1px 0 1px rgba(0, 0, 0, 0.3);
}

\`;
`;export{e as default};