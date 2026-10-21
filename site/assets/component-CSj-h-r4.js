var e=`"use client";

import { useId } from "react";

/*
 * Side Folder – a glassy folder turned on its side, in a single self-contained file.
 * Three documents peek out to the right from behind a frosted front pocket with a tab on its edge.
 * Hover the folder: the pocket swings forward and every document slides out on its own.
 * The artwork scales with its container and keeps a 3 : 2 frame.
 */

export type SideFolderProps = {
  className?: string;
  /** Accessible description of the scene */
  label?: string;
};

/* Front pocket on a 380 × 520 grid: a narrow top part and a wider tab towards the bottom */
const FRONT =
  "M40 0H290Q330 0 330 40V318Q330 338 344 348L364 362Q380 372 380 396V480Q380 520 340 520H40Q0 520 0 480V40Q0 0 40 0Z";
const LINES = [78, 180, 140, 175, 126, 168, 110];
/* A mask (unlike clip-path: url()) also cuts the frosted blur to the pocket shape, and scales with the box */
const MASK = \`url("data:image/svg+xml,\${encodeURIComponent(
  \`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 380 520' preserveAspectRatio='none'><path d='\${FRONT}'/></svg>\`,
)}") 0 0 / 100% 100% no-repeat\`;

export function SideFolder({
  className,
  label = "Blue folder on its side, with three documents peeking out behind a frosted front pocket",
}: SideFolderProps) {
  const id = "ui-sf" + useId().replace(/[^a-zA-Z0-9_-]/g, "");

  return (
    <div className={["ui-sf", className].filter(Boolean).join(" ")} role="img" aria-label={label}>
      {/* React 19 hoists this into <head> once, no matter how many instances render */}
      <style href="ui-side-folder" precedence="default">
        {css}
      </style>
      <div className="ui-sf-icon" aria-hidden="true">
        {/* Back of the folder */}
        <svg className="ui-sf-layer ui-sf-back" viewBox="0 0 440 520">
          <defs>
            <filter id={\`\${id}-hl\`} x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur" />
              <feOffset in="blur" dy="3" result="offset" />
              <feComposite in="blur" in2="offset" operator="arithmetic" k2="1" k3="-1" result="diff" />
              <feFlood floodColor="#fff" floodOpacity="0.65" />
              <feComposite in2="diff" operator="in" result="light" />
              <feComposite in="light" in2="SourceAlpha" operator="in" />
            </filter>
          </defs>
          <rect x="0" y="18" width="440" height="486" rx="36" fill="#679cdf" />
          <rect x="0" y="18" width="440" height="486" rx="36" fill="#000000" filter={\`url(#\${id}-hl)\`} />
        </svg>

        {/* Documents – each one slides out on its own */}
        <svg className="ui-sf-layer" viewBox="0 0 440 520">
          <defs>
            <linearGradient id={\`\${id}-paper\`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fff" />
              <stop offset="100%" stopColor="#ecf1f8" />
            </linearGradient>
            <symbol id={\`\${id}-doc\`} overflow="visible">
              <rect x="0.6" y="0.6" width="278.8" height="348.8" rx="19.4" fill={\`url(#\${id}-paper)\`} stroke="rgba(26, 62, 112, 0.12)" strokeWidth="1.2" />
              {LINES.map((w, i) => (
                <rect key={i} x="30" y={87 + i * 28} width={w} height="9" rx="4.5" fill="rgba(26, 62, 112, 0.12)" />
              ))}
            </symbol>
          </defs>
          <g transform="scale(1.15)">
            <use className="ui-sf-doc ui-sf-doc--top" href={\`#\${id}-doc\`} />
            <use className="ui-sf-doc ui-sf-doc--bottom" href={\`#\${id}-doc\`} />
            <use className="ui-sf-doc ui-sf-doc--middle" href={\`#\${id}-doc\`} />
          </g>
        </svg>

        {/* Frosted front pocket */}
        <div className="ui-sf-front">
          <svg viewBox="0 0 380 520">
            <path d={FRONT} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="4" />
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ---------- Styles ---------- */

const css = /* css */ \`
.ui-sf {
  --ui-sf-ease: cubic-bezier(0.2, 0.85, 0.25, 1);
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 2;
  overflow: hidden;
  container-type: inline-size;
}

/* The folder is drawn on a 440 × 520 grid; cqw keeps every detail in proportion */
.ui-sf-icon {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 37%;
  aspect-ratio: 440 / 520;
  container-type: inline-size;
  perspective: 260cqw;
  perspective-origin: 40% 50%;
  transform: translate(-50%, -50%);
  transition: transform 0.6s var(--ui-sf-ease);
}
.ui-sf-icon:hover { transform: translate(-50%, -50%) scale(1.03); }

.ui-sf-layer { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
.ui-sf-back {
  filter:
    drop-shadow(0 5.4cqw 6.4cqw rgba(66, 111, 169, 0.28))
    drop-shadow(0 1.8cqw 2.7cqw rgba(66, 111, 169, 0.16))
    drop-shadow(0 0.45cqw 0.9cqw rgba(66, 111, 169, 0.1));
}

/* Documents, in the 1.15 scaled space of the stack */
.ui-sf-doc {
  transform-box: fill-box;
  transform-origin: center;
  filter: drop-shadow(0 3px 4px rgba(1, 25, 55, 0.18));
  transition: transform 0.55s var(--ui-sf-ease);
}
.ui-sf-doc--top    { transform: translate(83px, 43px) rotate(3deg); }
.ui-sf-doc--bottom { transform: translate(78px, 68px) rotate(4deg); }
.ui-sf-doc--middle { transform: translate(73px, 56px) rotate(-2deg); }
.ui-sf-icon:hover .ui-sf-doc--top    { transform: translate(100px, 35px) rotate(6deg); }
.ui-sf-icon:hover .ui-sf-doc--bottom { transform: translate(93px, 75px) rotate(7deg); }
.ui-sf-icon:hover .ui-sf-doc--middle { transform: translate(95px, 54px) rotate(0deg); }

/* Pocket: hinged on its left edge, it swings its right edge towards you on hover */
.ui-sf-front {
  position: absolute;
  left: 0;
  top: 0;
  width: 86.3636%;
  height: 100%;
  -webkit-mask: \${MASK};
  mask: \${MASK};
  background:
    linear-gradient(180deg, rgba(0, 40, 75, 0) 76%, rgba(2, 33, 70, 0.26) 100%),
    linear-gradient(160deg, rgba(167, 204, 253, 0.45) 0%, rgba(90, 143, 212, 0.45) 100%);
  -webkit-backdrop-filter: blur(4.5cqw) saturate(1.1);
  backdrop-filter: blur(4.5cqw) saturate(1.1);
  transform-origin: 0 50%;
  transition: transform 0.6s var(--ui-sf-ease);
}
.ui-sf-front svg { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
.ui-sf-icon:hover .ui-sf-front { transform: translateZ(3cqw) rotateY(-12deg); }

@media (prefers-reduced-motion: reduce) {
  .ui-sf-icon, .ui-sf-doc, .ui-sf-front { transition: none; }
}
/* ——— A-Team design system (Osmose), from scripts/theme/composants.py ——— */
.ui-sf.ui-sf {
  --ui-sf-ease: cubic-bezier(0.16, 1, 0.3, 1);
  --ui-sf-tray: #f2f6fa;
  --ui-sf-card: #ffffff;
  --ui-sf-line: #dae2ec;
  --ui-sf-ink: #00162b;
  --ui-sf-text: rgba(0, 22, 43, 0.66);
  --ui-sf-muted: rgba(0, 22, 43, 0.56);
  --ui-sf-faint: rgba(0, 22, 43, 0.36);
  --ui-sf-hover: rgba(26, 62, 112, 0.06);
  --ui-sf-chip: #f2f6fa;
  --ui-sf-track: rgba(26, 62, 112, 0.1);
  --ui-sf-accent: #1a3e70;
  --ui-sf-accent-soft: #eef5ff;
  --ui-sf-danger: #8a3a22;
  --ui-sf-focus: rgba(143, 189, 242, 0.8);
}
:is(.dark, [data-theme="dark"]) .ui-sf.ui-sf {
  --ui-sf-ease: cubic-bezier(0.16, 1, 0.3, 1);
  --ui-sf-tray: #0f2747;
  --ui-sf-card: #16345c;
  --ui-sf-line: rgba(255, 255, 255, 0.12);
  --ui-sf-ink: rgba(255, 255, 255, 0.94);
  --ui-sf-text: rgba(255, 255, 255, 0.72);
  --ui-sf-muted: rgba(255, 255, 255, 0.58);
  --ui-sf-faint: rgba(255, 255, 255, 0.36);
  --ui-sf-hover: rgba(255, 255, 255, 0.07);
  --ui-sf-chip: rgba(255, 255, 255, 0.07);
  --ui-sf-track: rgba(255, 255, 255, 0.12);
  --ui-sf-accent: #8fbdf2;
  --ui-sf-accent-soft: rgba(143, 189, 242, 0.16);
  --ui-sf-danger: #f2a48c;
  --ui-sf-focus: rgba(143, 189, 242, 0.6);
}
html body .ui-sf {
  box-shadow: 0 0 0 1px #dae2ec, 0 26px 38px -22px rgba(26, 62, 112, 0.45), 0 6px 14px -8px rgba(26, 62, 112, 0.16);
}
html:is(.dark, [data-theme="dark"]) body .ui-sf,
html body :is(.dark, [data-theme="dark"]) .ui-sf {
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1), 0 26px 40px -20px rgba(3, 12, 28, 0.8);
}
html body .ui-sf__card {
  box-shadow: 0 0 0 1px #dae2ec, 0 12px 20px -14px rgba(26, 62, 112, 0.4);
}
html:is(.dark, [data-theme="dark"]) body .ui-sf__card,
html body :is(.dark, [data-theme="dark"]) .ui-sf__card {
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.12), 0 12px 20px -12px rgba(3, 12, 28, 0.7);
}
html body .ui-sf__btn-primary {
  background: #851437;
  color: #ffffff;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 6px 12px -6px rgba(133, 20, 55, 0.6);
}
html:is(.dark, [data-theme="dark"]) body .ui-sf__btn-primary,
html body :is(.dark, [data-theme="dark"]) .ui-sf__btn-primary {
  background: #a8204d;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 6px 14px -6px rgba(3, 12, 28, 0.8);
}
html body .ui-sf__heading {
  font-family: "Avenir Next Condensed", "Avenir Next", Avenir, "Arial Narrow", system-ui, sans-serif;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 0.002em;
}
html body .ui-sf__input {
  box-shadow: 0 0 0 1px #cbd6e4, inset 0 2px 6px -4px rgba(26, 62, 112, 0.25);
}
html:is(.dark, [data-theme="dark"]) body .ui-sf__input,
html body :is(.dark, [data-theme="dark"]) .ui-sf__input {
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.16), inset 0 2px 6px -4px rgba(0, 0, 0, 0.4);
}

\`;
`;export{e as default};