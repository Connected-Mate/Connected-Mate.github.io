var e=`"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";

/*
 * Smart Recommendation – a suggestion card with a confidence signal, alternatives and one-click accept, in a single
 * self-contained file. Fold it away, pick an alternative instead, accept and undo.
 * The styles are injected below, so no extra files are needed.
 */

export type Recommendation = {
  id: string;
  /** Short name, used in the accept button, e.g. "Incremental sync" */
  label: string;
  /** One sentence why – shown in the card */
  reason: ReactNode;
  /** 0 = no signal, 1 = weak, 2 = good, 3 = strong */
  signal: 0 | 1 | 2 | 3;
};

export type SmartRecommendationProps = {
  title?: string;
  /** First entry is the recommendation, the rest are offered as alternatives */
  options: Recommendation[];
  onAccept?: (option: Recommendation) => void;
  onUndo?: (option: Recommendation) => void;
  defaultOpen?: boolean;
  className?: string;
};

const signalText = ["No signal", "Weak signal", "Good signal", "Strong signal"];
/** Any signal outside 0–3 (NaN, "3", 7, -1) is read as the nearest valid level, NaN as no signal */
const level = (s: unknown): 0 | 1 | 2 | 3 => {
  const n = Math.round(Number(s));
  return (Number.isFinite(n) ? Math.min(3, Math.max(0, n)) : 0) as 0 | 1 | 2 | 3;
};
/** "Incremental sync" → "incremental sync", but "AWS backup" and "S3 sync" keep their capitals */
const lowerFirst = (s: string) => (/^\\p{Lu}\\p{Ll}/u.test(s) ? s.charAt(0).toLowerCase() + s.slice(1) : s);

export function SmartRecommendation({
  title = "Smart recommendation",
  options,
  onAccept,
  onUndo,
  defaultOpen = true,
  className,
}: SmartRecommendationProps) {
  // By position, so two options with the same id stay apart
  const [chosen, setChosen] = useState(0);
  const [accepted, setAccepted] = useState<number | null>(null);
  const [open, setOpen] = useState(defaultOpen);
  const [menu, setMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  // When the button sits at the start of its row (long labels push the actions onto their own row), the menu opens
  // to the right instead of past the card's left edge
  const [flip, setFlip] = useState(false);
  useLayoutEffect(() => {
    const alt = menuRef.current;
    const pop = alt?.querySelector<HTMLElement>(".ui-sr__menu");
    const card = alt?.closest<HTMLElement>(".ui-sr");
    if (!menu || !alt || !pop || !card || getComputedStyle(alt).position === "static") return setFlip(false);
    // Some slack: a menu that only grazes the edge (as in the demo) keeps opening to the left
    setFlip(alt.getBoundingClientRect().right - pop.offsetWidth < card.getBoundingClientRect().left - 24);
  }, [menu]);

  useEffect(() => {
    if (!menu) return;
    const away = (e: PointerEvent) => !menuRef.current?.contains(e.target as Node) && setMenu(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("pointerdown", away);
    window.addEventListener("keydown", esc);
    return () => {
      window.removeEventListener("pointerdown", away);
      window.removeEventListener("keydown", esc);
    };
  }, [menu]);

  const at = chosen < options.length ? chosen : 0;
  const current = options[at];
  // Nothing to recommend – render nothing rather than crash
  if (!current) return null;
  const isRecommended = at === 0;
  const done = accepted === at;
  const signal = level(current.signal);
  const acceptText = \`Accept \${lowerFirst(String(current.label))}\`;

  return (
    <>
      <style href="ui-smart-recommendation" precedence="default">
        {css}
      </style>
      <section className={["ui-sr", className].filter(Boolean).join(" ")} aria-label={title} data-accepted={done || undefined}>
        <div className="ui-sr__card">
          <button type="button" className="ui-sr__head" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            <SparkIcon />
            <span className="ui-sr__title" dir="auto" title={title}>
            {title}
          </span>
            {!isRecommended && <span className="ui-sr__pill">Alternative</span>}
            <span className="ui-sr__chevron">
              <Icon d="m4.5 6.25 3.5 3.5 3.5-3.5" />
            </span>
          </button>
          <div className="ui-sr__body" data-open={open || undefined} inert={!open}>
            <p className="ui-sr__reason" key={at} dir="auto">
              {current.reason}
            </p>
          </div>
        </div>

        <footer className="ui-sr__foot">
          <span className="ui-sr__signal" data-level={signal} title={signalText[signal]}>
            <span className="ui-sr__bars" aria-hidden="true">
              {[1, 2, 3].map((n) => (
                <span key={n} data-on={signal >= n || undefined} />
              ))}
            </span>
            {signalText[signal]}
          </span>

          <div className="ui-sr__actions">
            {options.length > 1 && !done && (
              <div className="ui-sr__alt" ref={menuRef}>
                <button
                  type="button"
                  className="ui-sr__btn"
                  aria-haspopup="menu"
                  aria-expanded={menu}
                  onClick={() => setMenu((m) => !m)}
                >
                  Alternatives
                </button>
                {menu && (
                  <div className="ui-sr__menu" role="menu" data-flip={flip || undefined}>
                    {options.map((o, i) => (
                      <button
                        key={\`\${o.id}-\${i}\`}
                        type="button"
                        role="menuitemradio"
                        aria-checked={i === at}
                        className="ui-sr__option"
                        onClick={() => {
                          setChosen(i);
                          setMenu(false);
                          setOpen(true);
                        }}
                      >
                        <span className="ui-sr__option-label">
                          <span className="ui-sr__option-name" dir="auto" title={o.label}>
                            {o.label}
                          </span>
                          {i === 0 && <span className="ui-sr__tag">Recommended</span>}
                        </span>
                        <span className="ui-sr__mini" data-level={level(o.signal)} aria-label={signalText[level(o.signal)]}>
                          {[1, 2, 3].map((n) => (
                            <span key={n} data-on={level(o.signal) >= n || undefined} />
                          ))}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            {done ? (
              <>
                <span className="ui-sr__done" role="status">
                  <Icon d="m3.5 8.5 3 3 6-7" size={14} />
                  <span className="ui-sr__done-text" title={\`\${current.label} accepted\`}>
                    <bdi>{current.label}</bdi> accepted
                  </span>
                </span>
                <button
                  type="button"
                  className="ui-sr__btn"
                  onClick={() => {
                    setAccepted(null);
                    onUndo?.(current);
                  }}
                >
                  Undo
                </button>
              </>
            ) : (
              <button
                type="button"
                className="ui-sr__btn ui-sr__btn--primary"
                title={acceptText}
                onClick={() => {
                  setAccepted(at);
                  setMenu(false);
                  onAccept?.(current);
                }}
              >
                <span className="ui-sr__btn-text">{acceptText}</span>
              </button>
            )}
          </div>
        </footer>
      </section>
    </>
  );
}

const SparkIcon = () => (
  <svg className="ui-sr__spark" viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 3.5H4A1.5 1.5 0 0 0 2.5 5v7A1.5 1.5 0 0 0 4 13.5h7a1.5 1.5 0 0 0 1.5-1.5V8" />
    <path d="M12.5 1.5v4M10.5 3.5h4" />
  </svg>
);

const Icon = ({ d, size = 16 }: { d: string; size?: number }) => (
  <svg viewBox="0 0 16 16" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);

/* ---------- Styles ---------- */

const css = /* css */ \`
.ui-sr {
  --ui-sr-tray: #ecf1f8;
  --ui-sr-card: #ffffff;
  --ui-sr-ink: #041632;
  --ui-sr-text: #274066;
  --ui-sr-muted: #8090a8;
  --ui-sr-accent: #326eb6;
  --ui-sr-ok: #1f8a4c;
  --ui-sr-accent-text: #326eb6;
  --ui-sr-border: #dfe6ef;
  --ui-sr-shadow: 0 1px 2px rgba(26, 62, 112, 0.06);
  --ui-sr-head-hover: #f6f8fc;
  --ui-sr-pill: #eff3f9;
  --ui-sr-pill-text: #891c3e;
  --ui-sr-bar: #ccd5e2;
  --ui-sr-btn: #fff;
  --ui-sr-btn-hover: #f4f7fc;
  --ui-sr-menu: #fff;
  --ui-sr-option-hover: #f2f5fb;
  --ui-sr-option-on: #f5f8fc;
  --ui-sr-tag: #eff3f9;
  --ui-sr-ease: cubic-bezier(0.22, 1, 0.36, 1);
  box-sizing: border-box;
  width: 100%;
  max-width: 440px;
  container-type: inline-size;
  /* Like the Chat Composer: the white card on a gray tray, the actions live in the tray below */
  background: var(--ui-sr-tray);
  /* The gray tray frames the white card on every side */
  padding: 6px;
  border-radius: 22px;
  font-family: Avenir Next,Avenir, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  color: var(--ui-sr-ink);
  -webkit-font-smoothing: antialiased;
}
.ui-sr *, .ui-sr *::before, .ui-sr *::after { box-sizing: border-box; }
.ui-sr button { margin: 0; font: inherit; color: inherit; cursor: pointer; }
.ui-sr button:focus-visible { outline: 2px solid var(--ui-sr-accent); outline-offset: 2px; }

.ui-sr__card {
  padding: 6px 8px 8px;
  background: var(--ui-sr-card);
  border: 1px solid var(--ui-sr-border);
  border-radius: 16px;
  box-shadow: var(--ui-sr-shadow);
}
.ui-sr__head {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  height: 40px;
  padding: 0 10px;
  border: 0;
  border-radius: 12px;
  background: transparent;
  text-align: left;
  transition: background-color 140ms ease;
}
.ui-sr__head:hover { background: var(--ui-sr-head-hover); }
.ui-sr__spark { flex: none; color: var(--ui-sr-accent-text); }
.ui-sr__title { min-width: 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; font-size: 15px; font-weight: 500; }
.ui-sr__pill {
  flex: none;
  padding: 1px 8px;
  border-radius: 999px;
  background: var(--ui-sr-pill);
  font-size: 11.5px;
  font-weight: 500;
  color: var(--ui-sr-pill-text);
}
.ui-sr__chevron { display: grid; margin-left: auto; color: var(--ui-sr-muted); transition: transform 280ms var(--ui-sr-ease); }
.ui-sr__head[aria-expanded="false"] .ui-sr__chevron { transform: rotate(-90deg); }
.ui-sr__body {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 340ms var(--ui-sr-ease);
}
.ui-sr__body[data-open] { grid-template-rows: 1fr; }
.ui-sr__reason {
  min-height: 0;
  overflow: hidden;
  margin: 0;
  padding: 0 10px;
  font-size: 14px;
  line-height: 21px;
  color: var(--ui-sr-text);
  text-align: start;
  white-space: pre-line;
  overflow-wrap: anywhere;
  animation: ui-sr-swap 360ms var(--ui-sr-ease);
}
.ui-sr__body[data-open] .ui-sr__reason { padding-bottom: 8px; }
.ui-sr__reason strong { font-weight: 500; color: var(--ui-sr-ink); }

.ui-sr__foot {
  display: flex;
  align-items: center;
  /* Narrow containers: the actions move below the signal instead of running out of the tray */
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 8px 10px;
  min-height: 50px;
  padding: 8px 8px 8px 16px;
}
.ui-sr__signal {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  white-space: nowrap;
  color: var(--ui-sr-muted);
}
.ui-sr__bars, .ui-sr__mini { display: inline-flex; align-items: flex-end; gap: 2px; }
.ui-sr__bars span, .ui-sr__mini span {
  width: 3px;
  border-radius: 1px;
  background: var(--ui-sr-bar);
  transition: background-color 260ms ease;
}
.ui-sr__bars span:nth-child(1), .ui-sr__mini span:nth-child(1) { height: 6px; }
.ui-sr__bars span:nth-child(2), .ui-sr__mini span:nth-child(2) { height: 9px; }
.ui-sr__bars span:nth-child(3), .ui-sr__mini span:nth-child(3) { height: 12px; }
/* Scoped to the card, so other components with data-level on the page keep their colors */
.ui-sr [data-level="1"] > span[data-on] { background: #f59e0b; }
.ui-sr [data-level="2"] > span[data-on] { background: var(--ui-sr-accent); }
.ui-sr [data-level="3"] > span[data-on] { background: var(--ui-sr-ok); }
.ui-sr__signal[data-level="0"] .ui-sr__bars span:first-child { background: #8090a8; }

/* Never wider than the row – a long label shortens in its button instead of running out of the tray */
.ui-sr__actions { display: flex; align-items: center; gap: 6px; min-width: 0; max-width: 100%; margin-left: auto; }
.ui-sr__alt, .ui-sr__actions > .ui-sr__btn:not(.ui-sr__btn--primary) { flex: none; }
.ui-sr__btn {
  height: 32px;
  padding: 0 12px;
  border: 0;
  border-radius: 10px;
  background: var(--ui-sr-btn);
  box-shadow: 0 0 0 1px var(--ui-sr-border), 0 1px 2px rgba(26, 62, 112, 0.04);
  font-size: 13px !important;
  font-weight: 500;
  min-width: 0;
  max-width: 100%;
  white-space: nowrap;
  transition: background-color 160ms ease, transform 160ms ease;
}
.ui-sr__btn--primary { display: inline-flex; align-items: center; }
.ui-sr__btn-text { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
.ui-sr__btn:hover { background: var(--ui-sr-btn-hover); }
.ui-sr__btn:active { transform: scale(0.98); }
.ui-sr__btn--primary {
  background: linear-gradient(#173159, #081e3f);
  box-shadow: 0 0 0 1px #010c23, 0 2px 4px rgba(26, 62, 112, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.12);
  color: #fff !important;
}
.ui-sr__btn--primary:hover { background: linear-gradient(#213b61, #0c2448); }
.ui-sr__done {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  padding-right: 4px;
  font-size: 13px;
  font-weight: 500;
  color: var(--ui-sr-ok);
  animation: ui-sr-swap 300ms var(--ui-sr-ease);
}

.ui-sr__alt { position: relative; }
.ui-sr__menu {
  position: absolute;
  bottom: calc(100% + 8px);
  right: 0;
  z-index: 5;
  display: grid;
  gap: 2px;
  /* The column never grows with a long name; a long list scrolls */
  grid-template-columns: minmax(0, 1fr);
  width: 260px;
  max-height: min(320px, 60vh);
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 4px;
  border-radius: 12px;
  background: var(--ui-sr-menu);
  box-shadow: 0 0 0 1px var(--ui-sr-border), 0 12px 30px -8px rgba(26, 62, 112, 0.2);
  animation: ui-sr-drop 180ms var(--ui-sr-ease);
}
.ui-sr__menu[data-flip] { right: auto; left: 0; }
/* Narrow: the actions sit on their own row – the menu lines up with its right edge so it stays inside */
@container (max-width: 420px) {
  .ui-sr__actions { position: relative; }
  .ui-sr__alt { position: static; }
  .ui-sr__menu { width: min(260px, 100cqw - 24px); }
}
.ui-sr__option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  min-height: 34px;
  padding: 0 10px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  font-size: 13px !important;
  text-align: left;
}
.ui-sr__option:hover { background: var(--ui-sr-option-hover); }
.ui-sr__option[aria-checked="true"] { background: var(--ui-sr-option-on); }
.ui-sr__option-label { display: inline-flex; flex: 0 1 auto; align-items: center; gap: 6px; min-width: 0; }
.ui-sr__option-name, .ui-sr__done-text { min-width: 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.ui-sr__tag, .ui-sr__mini { flex: none; }
.ui-sr__tag { padding: 0 6px; border-radius: 999px; background: var(--ui-sr-tag); font-size: 10.5px; font-weight: 500; line-height: 16px; color: var(--ui-sr-accent-text); }

@keyframes ui-sr-swap { from { opacity: 0; transform: translateY(2px); } }
@keyframes ui-sr-drop { from { opacity: 0; transform: translateY(4px) scale(0.98); } }
@media (prefers-reduced-motion: reduce) {
  .ui-sr__reason, .ui-sr__done, .ui-sr__menu { animation: none; }
  .ui-sr__body, .ui-sr__chevron { transition: none; }
}

/* Dark mode: follows a .dark class or data-theme="dark" on any ancestor, e.g. <html> */
:where(.dark, [data-theme="dark"]) .ui-sr {
  --ui-sr-tray: #041531;
  --ui-sr-card: #0b2345;
  --ui-sr-ink: #e8eef6;
  --ui-sr-text: #bbc5d5;
  --ui-sr-muted: #8090a8;
  --ui-sr-ok: #3dbb6f;
  --ui-sr-accent-text: #508cd7;
  --ui-sr-border: rgba(255, 255, 255, 0.08);
  --ui-sr-shadow: 0 1px 2px rgba(0, 22, 43, 0.4);
  --ui-sr-head-hover: rgba(255, 255, 255, 0.06);
  --ui-sr-pill: rgba(137, 28, 62, 0.18);
  --ui-sr-pill-text: #f9869e;
  --ui-sr-bar: rgba(255, 255, 255, 0.14);
  --ui-sr-btn: #0f2a50;
  --ui-sr-btn-hover: #163158;
  --ui-sr-menu: #0f2a50;
  --ui-sr-option-hover: #163158;
  --ui-sr-option-on: rgba(50, 110, 182, 0.16);
  --ui-sr-tag: rgba(50, 110, 182, 0.16);
}
:where(.dark, [data-theme="dark"]) .ui-sr__menu {
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1), 0 12px 30px -8px rgba(0, 22, 43, 0.5);
}
:where(.dark, [data-theme="dark"]) .ui-sr__btn--primary {
  background: linear-gradient(#f1f5fa, #dee5ef);
  box-shadow: 0 0 0 1px rgba(0, 22, 43, 0.6), 0 2px 4px rgba(0, 22, 43, 0.35), inset 0 1px 0 #ffffff;
  color: #02112b !important;
}
:where(.dark, [data-theme="dark"]) .ui-sr__btn--primary:hover { background: linear-gradient(#ffffff, #e7edf5); }
/* ——— A-Team design system (Osmose), from scripts/theme/composants.py ——— */
.ui-sr.ui-sr {
  --ui-sr-tray: #f2f6fa;
  --ui-sr-card: #ffffff;
  --ui-sr-ink: #00162b;
  --ui-sr-text: rgba(0, 22, 43, 0.66);
  --ui-sr-muted: rgba(0, 22, 43, 0.56);
  --ui-sr-accent: #1a3e70;
  --ui-sr-ok: #1d6a34;
  --ui-sr-shadow: 0 0 0 1px #dae2ec, 0 8px 16px -8px rgba(26, 62, 112, 0.2);
  --ui-sr-ease: cubic-bezier(0.16, 1, 0.3, 1);
}
:is(.dark, [data-theme="dark"]) .ui-sr.ui-sr {
  --ui-sr-tray: #0f2747;
  --ui-sr-card: #16345c;
  --ui-sr-ink: rgba(255, 255, 255, 0.94);
  --ui-sr-text: rgba(255, 255, 255, 0.72);
  --ui-sr-muted: rgba(255, 255, 255, 0.58);
  --ui-sr-accent: #8fbdf2;
  --ui-sr-ok: #7fe0a0;
  --ui-sr-shadow: 0 0 0 1px rgba(255, 255, 255, 0.11), 0 8px 16px -8px rgba(3, 12, 28, 0.6);
  --ui-sr-ease: cubic-bezier(0.16, 1, 0.3, 1);
}
html body .ui-sr {
  box-shadow: 0 0 0 1px #dae2ec, 0 26px 38px -22px rgba(26, 62, 112, 0.45), 0 6px 14px -8px rgba(26, 62, 112, 0.16);
}
html:is(.dark, [data-theme="dark"]) body .ui-sr,
html body :is(.dark, [data-theme="dark"]) .ui-sr {
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1), 0 26px 40px -20px rgba(3, 12, 28, 0.8);
}
html body .ui-sr__card {
  box-shadow: 0 0 0 1px #dae2ec, 0 12px 20px -14px rgba(26, 62, 112, 0.4);
}
html:is(.dark, [data-theme="dark"]) body .ui-sr__card,
html body :is(.dark, [data-theme="dark"]) .ui-sr__card {
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.12), 0 12px 20px -12px rgba(3, 12, 28, 0.7);
}
html body .ui-sr__btn--primary {
  background: #851437;
  color: #ffffff;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 6px 12px -6px rgba(133, 20, 55, 0.6);
}
html:is(.dark, [data-theme="dark"]) body .ui-sr__btn--primary,
html body :is(.dark, [data-theme="dark"]) .ui-sr__btn--primary {
  background: #a8204d;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 6px 14px -6px rgba(3, 12, 28, 0.8);
}
html body .ui-sr__title {
  font-family: "Avenir Next Condensed", "Avenir Next", Avenir, "Arial Narrow", system-ui, sans-serif;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 0.002em;
}

\`;
`;export{e as default};