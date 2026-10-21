var e=`"use client";

import type { ReactNode } from "react";

/*
 * Change Summary – what moved since last time, one metric per row, in a gray tray with a white card, in a single self-contained file.
 * The styles are injected below, so no extra files are needed.
 */

export type MetricChange = {
  label: string;
  /** What happened, in words, e.g. "Up 6.1% to 18.2K" */
  change: string;
  /** good: green arrow · bad: red arrow · neutral: gray dash */
  tone?: "good" | "bad" | "neutral";
  /** Direction of the arrow – defaults to up for good, down for bad */
  direction?: "up" | "down";
};

export type ChangeSummaryProps = {
  title?: string;
  /** Small text on the right of the heading, e.g. "This week" */
  period?: string;
  icon?: ReactNode;
  changes: MetricChange[];
  className?: string;
};

export function ChangeSummary({ title = "What's changed", period, icon, changes, className }: ChangeSummaryProps) {
  return (
    <>
      <style href="ui-change-summary" precedence="default">
        {css}
      </style>
      <section className={["ui-cs", className].filter(Boolean).join(" ")} aria-label={title}>
        <header className="ui-cs__head">
          <span className="ui-cs__title">
            {icon ?? <ChangesIcon />}
            {title}
          </span>
          {period && <span className="ui-cs__period">{period}</span>}
        </header>
        <dl className="ui-cs__card">
          {changes.map((c, i) => {
            const tone = c.tone ?? "neutral";
            const direction = c.direction ?? (tone === "bad" ? "down" : "up");
            return (
              <div key={c.label} className="ui-cs__row" style={{ animationDelay: \`\${120 + i * 70}ms\` }}>
                <dt className="ui-cs__label">{c.label}</dt>
                <dd className="ui-cs__change">
                  <span className="ui-cs__trend" data-tone={tone} aria-hidden="true">
                    {tone === "neutral" ? <DashIcon /> : <ArrowIcon down={direction === "down"} />}
                  </span>
                  <span className="ui-cs__text">{c.change}</span>
                </dd>
              </div>
            );
          })}
        </dl>
      </section>
    </>
  );
}

/* ---------- Icons ---------- */

const ChangesIcon = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
    <path d="M2.5 4h4M2.5 8h8M6.5 12h7M9.5 4h1" />
  </svg>
);

const ArrowIcon = ({ down }: { down?: boolean }) => (
  <svg viewBox="0 0 12 12" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {down ? <path d="M6 2.5v7M3 6.5l3 3 3-3" /> : <path d="M6 9.5v-7M3 5.5l3-3 3 3" />}
  </svg>
);

const DashIcon = () => (
  <svg viewBox="0 0 12 12" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
    <path d="M3 6h6" />
  </svg>
);

/* ---------- Styles ---------- */

const css = /* css */ \`
.ui-cs {
  --ui-cs-tray: #ecf1f8;
  --ui-cs-card: #ffffff;
  --ui-cs-line: #ecf1f8;
  --ui-cs-ink: #041632;
  --ui-cs-muted: #617491;
  --ui-cs-accent: #326eb6;
  --ui-cs-ease: cubic-bezier(0.22, 1, 0.36, 1);
  box-sizing: border-box;
  width: 100%;
  max-width: 480px;
  container-type: inline-size;
  /* Like the Chat Composer: a gray tray with the heading, the white card sits on top of it */
  background: var(--ui-cs-tray);
  /* The gray tray frames the white card on every side */
  padding: 6px;
  border-radius: 22px;
  font-family: Avenir Next,Avenir, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  color: var(--ui-cs-ink);
  -webkit-font-smoothing: antialiased;
}
.ui-cs *, .ui-cs *::before, .ui-cs *::after { box-sizing: border-box; }

.ui-cs__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 11px 18px 10px;
  font-size: 14px;
  line-height: 20px;
}
.ui-cs__title {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  color: var(--ui-cs-accent);
}
.ui-cs__period { font-size: 13px; color: var(--ui-cs-muted); }

.ui-cs__card {
  margin: 0;
  overflow: hidden;
  background: var(--ui-cs-card);
  border: 1px solid #dfe6ef;
  border-radius: 16px;
  box-shadow: 0 1px 2px rgba(26, 62, 112, 0.06);
}
.ui-cs__row {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
  align-items: center;
  gap: 16px;
  min-height: 52px;
  padding: 0 20px;
  animation: ui-cs-in 520ms var(--ui-cs-ease) both;
  transition: background-color 140ms ease;
}
.ui-cs__row + .ui-cs__row { border-top: 1px solid var(--ui-cs-line); }
.ui-cs__row:hover { background: #f8fafe; }
.ui-cs__label {
  overflow: hidden;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.ui-cs__change {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  margin: 0;
  font-size: 14px;
  line-height: 20px;
  color: var(--ui-cs-muted);
}
.ui-cs__text { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
/* Narrow: each metric stacks above its change, so the text wraps instead of being cut off */
@container (max-width: 400px) {
  .ui-cs__row { grid-template-columns: minmax(0, 1fr); gap: 4px; padding: 11px 16px; }
  .ui-cs__label, .ui-cs__text { white-space: normal; }
  .ui-cs__change { align-items: flex-start; }
}
.ui-cs__trend {
  display: grid;
  place-items: center;
  flex: none;
  width: 20px;
  height: 20px;
  border-radius: 6px;
}
.ui-cs__trend[data-tone="good"] { background: #f3f6fb; color: #1f8a4c; }
.ui-cs__trend[data-tone="bad"] { background: #f1f4fa; color: #e5484d; }
.ui-cs__trend[data-tone="neutral"] { background: #f2f5fb; color: #8090a8; }

@keyframes ui-cs-in {
  from { opacity: 0; transform: translateY(4px); }
}
@media (prefers-reduced-motion: reduce) {
  .ui-cs__row { animation: none; }
}

/* Dark mode: follows a .dark class or data-theme="dark" on any ancestor, e.g. <html> */
:where(.dark, [data-theme="dark"]) .ui-cs {
  --ui-cs-tray: #041531;
  --ui-cs-card: #0b2345;
  --ui-cs-line: rgba(255, 255, 255, 0.08);
  --ui-cs-ink: #e8eef6;
  --ui-cs-muted: #8090a8;
  --ui-cs-accent: #508cd7;
}
:where(.dark, [data-theme="dark"]) .ui-cs__card {
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow: 0 1px 2px rgba(0, 22, 43, 0.4);
}
:where(.dark, [data-theme="dark"]) .ui-cs__row:hover { background: #0f2a50; }
:where(.dark, [data-theme="dark"]) .ui-cs__trend[data-tone="good"] { background: rgba(31, 138, 76, 0.18); color: #3fbf74; }
:where(.dark, [data-theme="dark"]) .ui-cs__trend[data-tone="bad"] { background: rgba(229, 72, 77, 0.16); color: #f2777b; }
:where(.dark, [data-theme="dark"]) .ui-cs__trend[data-tone="neutral"] { background: #0f2a50; color: #8090a8; }
/* ——— A-Team design system (Osmose), from scripts/theme/composants.py ——— */
.ui-cs.ui-cs {
  --ui-cs-tray: #f2f6fa;
  --ui-cs-card: #ffffff;
  --ui-cs-line: #dae2ec;
  --ui-cs-ink: #00162b;
  --ui-cs-muted: rgba(0, 22, 43, 0.56);
  --ui-cs-accent: #1a3e70;
  --ui-cs-ease: cubic-bezier(0.16, 1, 0.3, 1);
}
:is(.dark, [data-theme="dark"]) .ui-cs.ui-cs {
  --ui-cs-tray: #0f2747;
  --ui-cs-card: #16345c;
  --ui-cs-line: rgba(255, 255, 255, 0.12);
  --ui-cs-ink: rgba(255, 255, 255, 0.94);
  --ui-cs-muted: rgba(255, 255, 255, 0.58);
  --ui-cs-accent: #8fbdf2;
  --ui-cs-ease: cubic-bezier(0.16, 1, 0.3, 1);
}
html body .ui-cs {
  box-shadow: 0 0 0 1px #dae2ec, 0 26px 38px -22px rgba(26, 62, 112, 0.45), 0 6px 14px -8px rgba(26, 62, 112, 0.16);
}
html:is(.dark, [data-theme="dark"]) body .ui-cs,
html body :is(.dark, [data-theme="dark"]) .ui-cs {
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1), 0 26px 40px -20px rgba(3, 12, 28, 0.8);
}
html body .ui-cs__card {
  box-shadow: 0 0 0 1px #dae2ec, 0 12px 20px -14px rgba(26, 62, 112, 0.4);
}
html:is(.dark, [data-theme="dark"]) body .ui-cs__card,
html body :is(.dark, [data-theme="dark"]) .ui-cs__card {
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.12), 0 12px 20px -12px rgba(3, 12, 28, 0.7);
}

\`;
`;export{e as default};