import{t as e}from"./react-BkAXpnfr.js";import{t}from"./jsx-runtime-CTsRTJUX.js";var n=e(),r=t();function i({variant:e=`primary`,size:t=`md`,loading:i=!1,icon:l,iconRight:u,children:p,className:m,disabled:h,onClick:g,onPointerEnter:_,type:v=`button`,ref:y,...b}){let x=typeof p==`string`?p:void 0,S=p!=null&&p!==!1&&p!==``,C=!S&&!!(l||u),w=a.includes(e)?e:`primary`,T=o.includes(t)?t:`md`,E=(0,n.useRef)(null),D=(0,n.useRef)(0),[O,k]=(0,n.useState)(!1);(0,n.useEffect)(()=>k(!0),[]);let A=x??`label`,j=i&&l?`spinner`:d(l),M=d(u),N=`${A}|${j}|${M}`,P=(0,n.useRef)(N);return(0,n.useLayoutEffect)(()=>{let e=E.current;if(!e)return;let t=e.getBoundingClientRect().width,n=D.current,r=P.current!==N;D.current=t,P.current=N,!(!r||!n||Math.abs(n-t)<.5)&&(window.matchMedia(`(prefers-reduced-motion: reduce)`).matches||e.animate([{width:`${n}px`},{width:`${t}px`}],{duration:480,easing:`cubic-bezier(0.25, 1, 0.5, 1)`}))}),(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(`style`,{href:`ui-button-clean`,precedence:`default`,children:f}),(0,r.jsxs)(`button`,{type:v,className:[`ui-buttonc`,m].filter(Boolean).join(` `),"data-variant":w,"data-size":T,"data-loading":i||void 0,"data-icon-only":C||void 0,"data-icon-left":!C&&!!l||void 0,"data-icon-right":!C&&!!u||void 0,"data-ready":O||void 0,ref:e=>{E.current=e,typeof y==`function`?y(e):y&&(y.current=e)},disabled:h,"aria-busy":i||void 0,"aria-disabled":i||void 0,onClick:e=>{if(i){e.preventDefault();return}g?.(e)},onPointerEnter:e=>{let t=e.currentTarget.querySelector(`.ui-buttonc__label`);t&&x&&!b.title&&(t.title=t.scrollWidth>t.clientWidth+1?x:``),_?.(e)},...b,children:[l&&(0,r.jsx)(`span`,{className:`ui-buttonc__icon`,"aria-hidden":`true`,onErrorCapture:s,children:i?(0,r.jsx)(c,{}):l},`icon-${j}`),S&&(0,r.jsx)(`span`,{className:`ui-buttonc__label`,"data-text":x,dir:`auto`,children:p},`label-${A}`),u&&(0,r.jsx)(`span`,{className:`ui-buttonc__icon`,"aria-hidden":`true`,onErrorCapture:s,children:u},`icon-right-${M}`)]})]})}var a=[`primary`,`secondary`,`ghost`,`destructive`],o=[`sm`,`md`,`lg`],s=e=>{e.target instanceof HTMLImageElement&&(e.target.style.visibility=`hidden`)},c=()=>(0,r.jsxs)(`svg`,{className:`ui-buttonc__spinner`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:2,strokeLinecap:`round`,children:[(0,r.jsx)(`circle`,{cx:`12`,cy:`12`,r:`8.5`,opacity:.2}),(0,r.jsx)(`path`,{d:`M12 3.5a8.5 8.5 0 0 1 8.5 8.5`})]}),l=new WeakMap,u=1;function d(e){if(!(0,n.isValidElement)(e)||typeof e.type==`string`)return 0;let t=e.type;return l.has(t)||l.set(t,u++),l.get(t)}var f=`
/* Colors and motion as variables – override them on .ui-buttonc (see Theming in the docs) */
.ui-buttonc {
  --ui-btnc-title: #000000;
  --ui-btnc-ink: rgba(0, 22, 43, 0.88);
  --ui-btnc-muted: rgba(0, 22, 43, 0.61);
  --ui-btnc-icon: rgba(0, 22, 43, 0.447);
  --ui-btnc-solid: rgba(0, 22, 43, 0.88);
  --ui-btnc-solid-hover: rgba(0, 22, 43, 0.8);
  --ui-btnc-on-solid: #fbfcfe;
  --ui-btnc-surface: #ffffff;
  --ui-btnc-shadow: 0 0 0 0.5px rgba(26, 62, 112, 0.06), 0 1px 1px -1px rgba(26, 62, 112, 0.1), 0 1px 2px 0 rgba(26, 62, 112, 0.05);
  --ui-btnc-shadow-hover: 0 0 0 0.5px rgba(26, 62, 112, 0.1), 0 1px 1px -1px rgba(26, 62, 112, 0.12), 0 1px 3px 0 rgba(26, 62, 112, 0.07);
  --ui-btnc-wash: rgba(26, 62, 112, 0.03);
  --ui-btnc-danger: #e5484d;
  --ui-btnc-danger-bg: rgba(229, 72, 77, 0.08);
  --ui-btnc-danger-bg-hover: rgba(229, 72, 77, 0.12);
  --ui-btnc-shine: rgba(255, 255, 255, 0.82);
  --ui-btnc-shine-on-solid: #ffffff;
  --ui-btnc-focus: rgba(35, 95, 166, 0.35);
  --ui-btnc-ease: cubic-bezier(0.22, 1, 0.36, 1);
  --ui-btnc-load: 650ms;

  --h: 28px;
  --px: 10px;
  --gap: 6px;
  --fs: 13px;
  --lh: 20px;
  --icon: 16px;
  --radius: 6px;

  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--gap);
  box-sizing: border-box;
  height: var(--h);
  padding: 0 var(--px);
  margin: 0;
  border: 0;
  border-radius: var(--radius);
  font-family: Avenir Next,Avenir, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  font-size: var(--fs);
  font-weight: 500;
  line-height: var(--lh);
  letter-spacing: 0;
  max-width: 100%;
  min-width: 0;
  white-space: nowrap;
  text-decoration: none;
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  -webkit-font-smoothing: antialiased;
  transition:
    background-color 140ms ease,
    color 140ms ease,
    box-shadow 140ms ease,
    transform 160ms var(--ui-btnc-ease),
    opacity 140ms ease;
}

/* Sizes: 24 · 28 · 32 high */
.ui-buttonc[data-size="sm"] {
  --h: 24px;
  --px: 8px;
  --gap: 4px;
  --fs: 12px;
  --lh: 16px;
  --icon: 14px;
  --radius: 6px;
}
.ui-buttonc[data-size="lg"] {
  --h: 32px;
  --px: 12px;
  --gap: 6px;
  --fs: 13px;
  --icon: 16px;
  --radius: 6px;
}
/* An icon sits closer to the edge than the text, so both look evenly spaced */
.ui-buttonc[data-icon-left] {
  padding-left: calc(var(--px) - 2px);
}
.ui-buttonc[data-icon-right] {
  padding-right: calc(var(--px) - 2px);
}
.ui-buttonc[data-icon-only] {
  width: var(--h);
  padding: 0;
}

/* primary: a dark chip */
.ui-buttonc[data-variant="primary"] {
  background: var(--ui-btnc-solid);
  color: var(--ui-btnc-on-solid);
}
.ui-buttonc[data-variant="primary"]:hover:not(:disabled) {
  background: var(--ui-btnc-solid-hover);
}

/* secondary: white with the card's hairline shadow */
.ui-buttonc[data-variant="secondary"] {
  background: var(--ui-btnc-surface);
  color: var(--ui-btnc-title);
  box-shadow: var(--ui-btnc-shadow);
}
.ui-buttonc[data-variant="secondary"] .ui-buttonc__icon {
  color: var(--ui-btnc-icon);
}
.ui-buttonc[data-variant="secondary"]:hover:not(:disabled) {
  box-shadow: var(--ui-btnc-shadow-hover);
}

/* ghost: a muted label, a soft wash appears on hover */
.ui-buttonc[data-variant="ghost"] {
  background: transparent;
  color: var(--ui-btnc-muted);
}
.ui-buttonc[data-variant="ghost"] .ui-buttonc__icon {
  color: var(--ui-btnc-icon);
}
.ui-buttonc[data-variant="ghost"]:hover:not(:disabled) {
  background: var(--ui-btnc-wash);
  color: var(--ui-btnc-ink);
}
.ui-buttonc[data-variant="ghost"]:hover:not(:disabled) .ui-buttonc__icon {
  color: var(--ui-btnc-ink);
}

/* destructive: red label on a minimal red fill, no stroke */
.ui-buttonc[data-variant="destructive"] {
  background: var(--ui-btnc-danger-bg);
  color: var(--ui-btnc-danger);
}
.ui-buttonc[data-variant="destructive"]:hover:not(:disabled) {
  background: var(--ui-btnc-danger-bg-hover);
}

.ui-buttonc .ui-buttonc__icon {
  transition: color 140ms ease;
}
.ui-buttonc:active:not(:disabled):not([data-loading]) {
  transform: scale(0.97);
}
.ui-buttonc:focus-visible {
  outline: 2px solid var(--ui-btnc-focus);
  outline-offset: 1px;
}
.ui-buttonc:disabled {
  opacity: 0.4;
  cursor: default;
}
.ui-buttonc[data-loading] {
  cursor: default;
}

.ui-buttonc__icon {
  display: grid;
  place-items: center;
  flex: none;
  width: var(--icon);
  height: var(--icon);
}
.ui-buttonc__icon {
  overflow: hidden;
}
.ui-buttonc__icon > svg,
.ui-buttonc__icon > img {
  display: block;
  width: 100%;
  height: 100%;
}
.ui-buttonc__icon > img {
  object-fit: contain;
}

/* Morph: the button clips while its width glides; changed parts blur in */
.ui-buttonc {
  overflow: clip;
}
.ui-buttonc[data-ready] .ui-buttonc__label {
  animation: ui-buttonc-label-in 480ms cubic-bezier(0.25, 1, 0.5, 1) both;
}
.ui-buttonc[data-ready] .ui-buttonc__icon {
  animation: ui-buttonc-icon-in 520ms cubic-bezier(0.25, 1, 0.5, 1) both;
}

/* Loading: a light band sweeps across a copy of the dimmed label */
/* A label too long for its parent ends in "…" – the full text shows on hover */
.ui-buttonc__label {
  position: relative;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ui-buttonc__label::after {
  content: attr(data-text);
  content: attr(data-text) / "";
  position: absolute;
  inset: 0;
  white-space: nowrap;
  color: transparent;
  background: linear-gradient(90deg, transparent 38%, var(--ui-btnc-shine) 50%, transparent 62%) 100% 0 / 300% 100%
    no-repeat;
  -webkit-background-clip: text;
  background-clip: text;
  opacity: 0;
  pointer-events: none;
}
.ui-buttonc[data-variant="primary"] .ui-buttonc__label::after {
  --ui-btnc-shine: var(--ui-btnc-shine-on-solid);
}
.ui-buttonc[data-loading] .ui-buttonc__label {
  color: color-mix(in srgb, currentColor 50%, transparent);
}
.ui-buttonc[data-loading] .ui-buttonc__label::after {
  opacity: 1;
  animation: ui-buttonc-sweep calc(var(--ui-btnc-load) * 1.6) linear infinite;
}
.ui-buttonc__spinner {
  animation: ui-buttonc-spin 900ms linear infinite;
}

@keyframes ui-buttonc-label-in {
  from {
    opacity: 0;
    filter: blur(3px);
    transform: translateY(25%);
  }
}
@keyframes ui-buttonc-icon-in {
  from {
    opacity: 0;
    filter: blur(2px);
    transform: scale(0.7);
  }
}

@keyframes ui-buttonc-spin {
  to {
    transform: rotate(1turn);
  }
}

@keyframes ui-buttonc-sweep {
  from {
    background-position: 100% 0;
  }
  to {
    background-position: 0% 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ui-buttonc[data-ready] .ui-buttonc__label,
  .ui-buttonc[data-ready] .ui-buttonc__icon {
    animation: none;
  }
  .ui-buttonc {
    transition-duration: 1ms;
  }
  .ui-buttonc[data-loading] .ui-buttonc__label::after {
    animation: none;
    opacity: 0;
  }
}

/* Dark mode: follows a .dark class or data-theme="dark" on any ancestor, e.g. <html> */
:where(.dark, [data-theme="dark"]) .ui-buttonc {
  /* primary inverts: a light chip with dark text */
  --ui-btnc-solid: rgba(255, 255, 255, 0.9);
  --ui-btnc-solid-hover: rgba(255, 255, 255, 0.82);
  --ui-btnc-on-solid: #041531;
  --ui-btnc-shine-on-solid: #ffffff;

  --ui-btnc-title: rgba(255, 255, 255, 0.9);
  --ui-btnc-ink: rgba(255, 255, 255, 0.9);
  --ui-btnc-muted: rgba(255, 255, 255, 0.62);
  --ui-btnc-icon: rgba(255, 255, 255, 0.5);
  --ui-btnc-surface: #061b3a;
  --ui-btnc-shadow: 0 0 0 0.5px rgba(255, 255, 255, 0.1), 0 1px 2px 0 rgba(0, 22, 43, 0.4);
  --ui-btnc-shadow-hover: 0 0 0 0.5px rgba(255, 255, 255, 0.16), 0 1px 2px 0 rgba(0, 22, 43, 0.4);
  --ui-btnc-wash: rgba(255, 255, 255, 0.06);
  --ui-btnc-danger: #ff6369;
  --ui-btnc-danger-bg: rgba(229, 72, 77, 0.14);
  --ui-btnc-danger-bg-hover: rgba(229, 72, 77, 0.2);
  --ui-btnc-shine: #ffffff;
  --ui-btnc-focus: rgba(72, 131, 206, 0.5);
}
`;export{i as t};