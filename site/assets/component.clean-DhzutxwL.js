import{t as e}from"./react-BkAXpnfr.js";import{t}from"./jsx-runtime-CTsRTJUX.js";var n=e(),r=t();function i({options:e,value:t,defaultValue:i,onChange:s,size:c=`md`,variant:l=`buttons`,fullWidth:u=!1,kind:d=`radio`,disabled:f=!1,"aria-label":p,"aria-labelledby":m,className:h}){let g=(0,n.useMemo)(()=>{let t=new Set;return(Array.isArray(e)?e:[]).filter(e=>!e||e.value==null||t.has(String(e.value))?!1:(t.add(String(e.value)),!0))},[e]),_=c===`sm`||c===`lg`?c:`md`,v=l===`tray`||l===`underline`?l:`buttons`,[y,b]=(0,n.useState)(()=>i??g.find(e=>!e.disabled)?.value),x=t===void 0?y:t,S=(0,n.useRef)(null),C=(0,n.useRef)(null),w=(0,n.useRef)(null),T=(0,n.useRef)(null),E=(0,n.useRef)(x);E.current=x;let D=(0,n.useRef)(!1),O=(0,n.useRef)(0),k=(0,n.useRef)(void 0),A=(0,n.useRef)(null),j=()=>Array.from(w.current?.querySelectorAll(`:scope > .ui-segc__opt`)??[]),M=g.findIndex(e=>e.value===x),N=M>=0?M:g.findIndex(e=>!e.disabled),P=e=>{let n=g.find(t=>t.value===e);!n||n.disabled||f||e===E.current||(E.current=e,t===void 0&&b(e),s?.(e))},F=()=>{let e=j();if(!e.length||!w.current)return;let t=getComputedStyle(e[0]),n=parseFloat(t.paddingLeft)+parseFloat(t.paddingRight),r=e.map(e=>e.firstElementChild.offsetWidth+n);u?(w.current.style.setProperty(`--ui-segc-min`,`${Math.max(...r)}px`),e.forEach(e=>e.style.width=``)):e.forEach((e,t)=>e.style.width=`${r[t]}px`)},I=e=>{let t=w.current,n=T.current;if(!t||!n)return;let r=t.querySelector(`:scope > .ui-segc__opt[data-active]`);if(!r||!r.offsetWidth){n.style.opacity=`0`;return}let i=r.offsetLeft,a=r.offsetWidth;if(v===`underline`){let e=r.firstElementChild;i+=e.offsetLeft,a=e.offsetWidth}let o=!n.dataset.ready||!e&&!D.current,s=parseFloat(n.style.left)||0;!o&&i!==s&&(n.dataset.dir=i>s?`right`:`left`),o&&(n.style.transition=`none`),n.style.opacity=`1`,n.style.left=`${i}px`,n.style.right=`${t.clientWidth-i-a}px`,o&&(n.dataset.ready=`1`,n.offsetWidth,n.style.transition=``)},L=()=>{let e=C.current;if(!e)return;let t=e.scrollWidth-e.clientWidth;S.current?.toggleAttribute(`data-overflow`,t>1),e.style.setProperty(`--ui-segc-fade-l`,e.scrollLeft>1?`24px`:`0px`),e.style.setProperty(`--ui-segc-fade-r`,e.scrollLeft<t-1?`24px`:`0px`)},R=e=>{let t=C.current,n=w.current,r=n?.querySelector(`:scope > .ui-segc__opt[data-active]`);if(!t||!n||!r||t.scrollWidth<=t.clientWidth+1)return;let i=n.offsetLeft+r.offsetLeft-(t.clientWidth-r.offsetWidth)/2;t.scrollTo({left:Math.max(0,i),behavior:e?`smooth`:`auto`})};(0,n.useLayoutEffect)(()=>{let e=w.current,t=C.current;if(!e||!t)return;let n=()=>{F(),I(!1),L()};n();let r=requestAnimationFrame(()=>S.current?.setAttribute(`data-ready`,``)),i=0,a=new ResizeObserver(()=>{cancelAnimationFrame(i),i=requestAnimationFrame(n)});return a.observe(t),a.observe(e),e.querySelectorAll(`.ui-segc__opt, .ui-segc__content`).forEach(e=>a.observe(e)),()=>{a.disconnect(),cancelAnimationFrame(i),cancelAnimationFrame(r)}},[g.length,u,v,_]),(0,n.useLayoutEffect)(()=>{if(k.current===x)return;let e=k.current===void 0;k.current=x,e||(D.current=!0,clearTimeout(O.current),O.current=window.setTimeout(()=>D.current=!1,240)),I(!e),R(!e);let t=w.current;!e&&t&&t.contains(document.activeElement)&&j()[M]?.focus({preventScroll:!0})},[x]),(0,n.useEffect)(()=>()=>clearTimeout(O.current),[]);let z=e=>{let t=g.filter(e=>!e.disabled);if(!t.length||f)return;let n=d===`radio`?[`ArrowLeft`,`ArrowUp`]:[`ArrowLeft`],r=d===`radio`?[`ArrowRight`,`ArrowDown`]:[`ArrowRight`],i=t.findIndex(e=>e.value===E.current),a;n.includes(e.key)?a=t[(i-1+t.length)%t.length]:r.includes(e.key)?a=t[(i+1)%t.length]:e.key===`Home`?a=t[0]:e.key===`End`&&(a=t[t.length-1]),a&&(e.preventDefault(),P(a.value),j()[g.indexOf(a)]?.focus())},B=e=>{let t=-1,n=1/0;return j().forEach((r,i)=>{let a=r.getBoundingClientRect(),o=e<a.left?a.left-e:e>a.right?e-a.right:0;o<n&&(n=o,t=i)}),g[t]},V=()=>{A.current=null,S.current?.removeAttribute(`data-pressed`)},H=e=>{if(f||e.button!==0)return;let t=B(e.clientX);if(!t||t.disabled)return;let n=e.pointerType===`touch`,r=!n||t.value===E.current;if(A.current={id:e.pointerId,touch:n,drag:r,x:e.clientX,moved:!1},r&&S.current?.setAttribute(`data-pressed`,``),!n){P(t.value);try{e.currentTarget.setPointerCapture(e.pointerId)}catch{}}},U=e=>{let t=A.current;if(!t||t.id!==e.pointerId||!t.moved&&Math.abs(e.clientX-t.x)<(t.touch?8:3)||(t.moved=!0,!t.drag))return;let n=B(e.clientX);n&&!n.disabled&&P(n.value)},W=e=>{let t=A.current;if(t&&t.id===e.pointerId){if(t.touch&&!t.moved){let t=B(e.clientX);t&&P(t.value)}V()}},G=d===`tabs`;return(0,r.jsxs)(`div`,{ref:S,className:[`ui-segc`,h].filter(Boolean).join(` `),"data-size":_,"data-variant":v,"data-full":u||void 0,"data-disabled":f||void 0,children:[(0,r.jsx)(`style`,{href:`ui-segmented-control-clean`,precedence:`default`,children:o}),(0,r.jsx)(`div`,{ref:C,className:`ui-segc__scroller`,onScroll:L,children:(0,r.jsxs)(`div`,{ref:w,className:`ui-segc__track`,role:G?`tablist`:`radiogroup`,"aria-label":p,"aria-labelledby":m,"aria-disabled":f||void 0,"aria-orientation":G?`horizontal`:void 0,onKeyDown:z,onPointerDown:H,onPointerMove:U,onPointerUp:W,onPointerCancel:V,onLostPointerCapture:V,children:[(0,r.jsx)(`span`,{ref:T,className:`ui-segc__pill`,"aria-hidden":`true`}),g.map((e,t)=>{let n=t===M,i=e.label??(e.icon?null:String(e.value)),o=a(e.count);return(0,r.jsx)(`button`,{type:`button`,className:`ui-segc__opt`,role:G?`tab`:`radio`,"aria-checked":G?void 0:n,"aria-selected":G?n:void 0,"aria-controls":G?e.controls:void 0,"aria-label":e.ariaLabel,"data-active":n||void 0,disabled:e.disabled||f,tabIndex:t===N?0:-1,onClick:()=>P(e.value),children:(0,r.jsxs)(`span`,{className:`ui-segc__content`,children:[e.icon&&(0,r.jsx)(`span`,{className:`ui-segc__icon`,onErrorCapture:e=>e.target.style.visibility=`hidden`,children:e.icon}),i!=null&&(0,r.jsx)(`span`,{className:`ui-segc__label`,dir:`auto`,children:i}),o!=null&&o!==``&&(0,r.jsx)(`span`,{className:`ui-segc__count`,children:o},String(o)),e.badge!=null&&(0,r.jsx)(`span`,{className:`ui-segc__badge`,children:e.badge})]})},String(e.value))})]})})]})}var a=e=>typeof e==`number`?Number.isFinite(e)?e.toLocaleString(`en-US`):null:e,o=`
/* Animatable custom properties: the equal segment width and the soft edges glide too */
@property --ui-segc-min { syntax: "<length>"; inherits: true; initial-value: 0px; }
@property --ui-segc-fade-l { syntax: "<length>"; inherits: false; initial-value: 0px; }
@property --ui-segc-fade-r { syntax: "<length>"; inherits: false; initial-value: 0px; }

.ui-segc {
  --ui-segc-ink: rgba(0, 22, 43, 0.88);
  --ui-segc-text: rgba(0, 22, 43, 0.61);
  --ui-segc-hover-text: rgba(0, 22, 43, 0.75);
  --ui-segc-line: rgba(26, 62, 112, 0.06);
  --ui-segc-wash: rgba(26, 62, 112, 0.03);
  --ui-segc-fill: rgba(26, 62, 112, 0.06);
  --ui-segc-track: rgba(26, 62, 112, 0.04);
  --ui-segc-card: #ffffff;
  --ui-segc-card-shadow: 0 0 0 0.5px rgba(26, 62, 112, 0.06), 0 1px 1px -1px rgba(26, 62, 112, 0.1), 0 1px 2px 0 rgba(26, 62, 112, 0.05);
  --ui-segc-accent: rgba(35, 95, 166, 0.765);
  --ui-segc-accent-soft: rgba(35, 95, 166, 0.08);
  --ui-segc-focus: rgba(35, 95, 166, 0.35);
  --ui-segc-ease: cubic-bezier(0.25, 0.9, 0.3, 1);
  /* Size: md – 28px chips, 4px 10px */
  --ui-segc-h: 28px;
  --ui-segc-px: 10px;
  --ui-segc-fs: 13px;
  --ui-segc-lh: 20px;
  --ui-segc-icon: 16px;
  --ui-segc-gap: 8px;
  --ui-segc-pad: 2px;
  --ui-segc-ring: 3px;
  box-sizing: border-box;
  display: inline-flex;
  max-width: 100%;
  min-width: 0;
  vertical-align: middle;
  border-radius: 8px;
  font-family: Avenir Next,Avenir, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  font-size: var(--ui-segc-fs);
  font-weight: 500;
  line-height: var(--ui-segc-lh);
  color: var(--ui-segc-text);
  -webkit-font-smoothing: antialiased;
}
.ui-segc[data-size="sm"] { --ui-segc-h: 24px; --ui-segc-px: 8px; --ui-segc-fs: 12px; --ui-segc-lh: 16px; --ui-segc-icon: 14px; --ui-segc-gap: 6px; }
.ui-segc[data-size="lg"] { --ui-segc-h: 32px; --ui-segc-px: 12px; --ui-segc-icon: 16px; --ui-segc-gap: 8px; }
.ui-segc[data-full] { display: flex; width: 100%; }
.ui-segc[data-disabled] { opacity: 0.5; pointer-events: none; }
.ui-segc *, .ui-segc *::before, .ui-segc *::after { box-sizing: border-box; }
:where(.ui-segc) button { margin: 0; padding: 0; border: 0; background: none; font: inherit; color: inherit; cursor: pointer; }
:where(.ui-segc) svg { display: block; flex: none; }

/* Scrolls sideways only when it doesn't fit; the padding keeps focus rings from being cut off */
.ui-segc__scroller {
  position: relative;
  flex: 1;
  min-width: 0;
  overflow-x: auto;
  overflow-y: hidden;
  padding: var(--ui-segc-pad);
  border-radius: inherit;
  overscroll-behavior-x: contain;
  scrollbar-width: none;
  -webkit-mask-image: linear-gradient(to right, transparent, #000000 var(--ui-segc-fade-l), #000000 calc(100% - var(--ui-segc-fade-r)), transparent);
  mask-image: linear-gradient(to right, transparent, #000000 var(--ui-segc-fade-l), #000000 calc(100% - var(--ui-segc-fade-r)), transparent);
  transition: --ui-segc-fade-l 160ms ease, --ui-segc-fade-r 160ms ease;
}
.ui-segc__scroller::-webkit-scrollbar { display: none; }

.ui-segc__track {
  position: relative;
  display: flex;
  width: max-content;
  min-width: 100%;
  /* Horizontal drags move the indicator; vertical ones still scroll the page */
  touch-action: pan-y;
  -webkit-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}
/* When it scrolls, swipes scroll it instead of dragging the indicator */
.ui-segc[data-overflow] .ui-segc__track { touch-action: pan-x pan-y; }
/* Equal segments, each as wide as the widest one needs */
.ui-segc[data-full] .ui-segc__track { display: grid; grid-auto-flow: column; grid-auto-columns: minmax(var(--ui-segc-min), 1fr); }
.ui-segc[data-ready] .ui-segc__track { transition: --ui-segc-min 200ms var(--ui-segc-ease); }

/* An option */
.ui-segc__opt {
  position: relative;
  z-index: 1;
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  height: var(--ui-segc-h);
  padding: 0 var(--ui-segc-px);
  overflow: clip;
  border-radius: 6px;
  white-space: nowrap;
  /* Hover washes are short and crisp, in and out */
  transition: color 90ms ease, background-color 90ms ease;
}
.ui-segc[data-ready]:not([data-full]) .ui-segc__opt { transition: color 90ms ease, background-color 90ms ease, width 200ms var(--ui-segc-ease); }
.ui-segc__opt[data-active] { color: var(--ui-segc-ink); }
.ui-segc__opt:disabled { opacity: 0.4; cursor: not-allowed; }
.ui-segc__opt:focus-visible { outline: 2px solid var(--ui-segc-focus); outline-offset: 1px; }
@media (hover: hover) {
  .ui-segc__opt:not([data-active]):not(:disabled):hover { background-color: var(--ui-segc-wash); }
}

.ui-segc__content { display: inline-flex; flex: none; align-items: center; gap: 6px; }
.ui-segc[data-size="sm"] .ui-segc__content { gap: 5px; }
.ui-segc__icon { display: grid; place-items: center; width: var(--ui-segc-icon); height: var(--ui-segc-icon); color: rgba(0, 22, 43, 0.447); transition: color 90ms ease; }
.ui-segc__opt[data-active] .ui-segc__icon { color: var(--ui-segc-ink); }
.ui-segc__icon svg, .ui-segc__icon img { width: 100%; height: 100%; }
/* Images fill the tile without leaving it, whatever their shape */
.ui-segc__icon { overflow: hidden; }
.ui-segc__icon img { display: block; object-fit: contain; }
.ui-segc__label { display: block; }

.ui-segc__count {
  display: inline-grid;
  place-items: center;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 5px;
  background: var(--ui-segc-fill);
  font-size: 11px;
  line-height: 16px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  color: var(--ui-segc-text);
  animation: ui-segc-in 200ms var(--ui-segc-ease) both;
}
.ui-segc__opt[data-active] .ui-segc__count { background: var(--ui-segc-card); box-shadow: 0 0 0 0.5px var(--ui-segc-line); color: var(--ui-segc-ink); }
.ui-segc[data-size="sm"] .ui-segc__count { min-width: 14px; height: 14px; padding: 0 3px; border-radius: 4px; font-size: 10px; line-height: 14px; }
.ui-segc__badge {
  display: inline-flex;
  align-items: center;
  height: 18px;
  padding: 0 6px;
  border-radius: 5px;
  background: var(--ui-segc-accent-soft);
  font-size: 11px;
  line-height: 16px;
  font-weight: 500;
  color: var(--ui-segc-accent);
}
.ui-segc[data-size="sm"] .ui-segc__badge { height: 16px; padding: 0 5px; font-size: 10px; }

/* The indicator: left and right edges slide separately – the one facing the target leads a touch. Short and crisp */
.ui-segc__pill {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 100%;
  z-index: 0;
  border-radius: 6px;
  background: var(--ui-segc-fill);
  opacity: 0;
  pointer-events: none;
  transition: left 200ms var(--ui-segc-ease), right 200ms var(--ui-segc-ease), scale 120ms var(--ui-segc-ease), opacity 120ms ease;
}
.ui-segc__pill[data-dir="right"] { transition-duration: 220ms, 160ms, 120ms, 120ms; }
.ui-segc__pill[data-dir="left"] { transition-duration: 160ms, 220ms, 120ms, 120ms; }
/* Press feedback: the indicator gives a little while held or dragged */
.ui-segc[data-pressed]:not([data-variant="underline"]) .ui-segc__pill { scale: 0.97; }

/* Buttons (default): separate chips with a hairline; the light-gray fill slides to the active one.
   The control reaches a few px past its box so focus rings are never clipped, and still lines up with its neighbours */
.ui-segc[data-variant="buttons"] { --ui-segc-pad: var(--ui-segc-ring); margin: calc(var(--ui-segc-ring) * -1); max-width: calc(100% + var(--ui-segc-ring) * 2); }
.ui-segc[data-variant="buttons"][data-full] { width: calc(100% + var(--ui-segc-ring) * 2); }
.ui-segc[data-variant="buttons"] .ui-segc__track { gap: var(--ui-segc-gap); }
.ui-segc[data-variant="buttons"] .ui-segc__opt { box-shadow: inset 0 0 0 0.5px var(--ui-segc-line); }

/* Tray: a compact light-gray track with a white raised pill */
.ui-segc[data-variant="tray"] { background: var(--ui-segc-track); }
.ui-segc[data-variant="tray"] .ui-segc__opt { height: calc(var(--ui-segc-h) - var(--ui-segc-pad) * 2); }
.ui-segc[data-variant="tray"] .ui-segc__pill { background: var(--ui-segc-card); box-shadow: var(--ui-segc-card-shadow); }

/* Underline: text tabs on a hairline */
.ui-segc[data-variant="underline"] { --ui-segc-px: 2px; --ui-segc-gap: 20px; border-radius: 0; box-shadow: inset 0 -0.5px 0 var(--ui-segc-line); }
.ui-segc[data-variant="underline"] .ui-segc__scroller { padding: 0; }
.ui-segc[data-variant="underline"]:not([data-full]) .ui-segc__track { gap: var(--ui-segc-gap); }
.ui-segc[data-variant="underline"][data-full] { --ui-segc-px: 10px; }
.ui-segc[data-variant="underline"] .ui-segc__opt { height: calc(var(--ui-segc-h) + 6px); }
.ui-segc[data-variant="underline"] .ui-segc__opt:focus-visible { outline-offset: -2px; }
.ui-segc[data-variant="underline"] .ui-segc__pill { top: auto; height: 1.5px; border-radius: 1.5px 1.5px 0 0; background: var(--ui-segc-ink); }
@media (hover: hover) {
  .ui-segc[data-variant="underline"] .ui-segc__opt:not([data-active]):not(:disabled):hover { background-color: transparent; color: var(--ui-segc-hover-text); }
}

@keyframes ui-segc-in { from { opacity: 0; transform: translateY(2px); filter: blur(2px); } to { opacity: 1; transform: none; filter: none; } }

/* Touch screens: every option at least 40px tall */
@media (hover: none) and (pointer: coarse) {
  .ui-segc[data-size] { --ui-segc-h: 40px; }
  .ui-segc[data-size="lg"] { --ui-segc-h: 44px; }
  .ui-segc[data-variant="tray"][data-size] { --ui-segc-h: 44px; }
  .ui-segc[data-variant="underline"] .ui-segc__opt { height: var(--ui-segc-h); }
}
@media (prefers-reduced-motion: reduce) {
  .ui-segc *, .ui-segc *::before, .ui-segc *::after { animation: none !important; transition: none !important; }
}

/* Dark mode: follows a .dark class or data-theme="dark" on any ancestor, e.g. <html> */
:where(.dark, [data-theme="dark"]) .ui-segc {
  --ui-segc-ink: rgba(255, 255, 255, 0.9);
  --ui-segc-text: rgba(255, 255, 255, 0.62);
  --ui-segc-hover-text: rgba(255, 255, 255, 0.78);
  --ui-segc-line: rgba(255, 255, 255, 0.08);
  --ui-segc-wash: rgba(255, 255, 255, 0.04);
  --ui-segc-fill: rgba(255, 255, 255, 0.08);
  --ui-segc-track: rgba(255, 255, 255, 0.05);
  --ui-segc-card: #102c53;
  --ui-segc-card-shadow: 0 0 0 0.5px rgba(255, 255, 255, 0.1), 0 1px 2px rgba(0, 22, 43, 0.4);
  --ui-segc-accent: #4883ce;
  --ui-segc-accent-soft: rgba(72, 131, 206, 0.14);
  --ui-segc-focus: rgba(72, 131, 206, 0.45);
}
:where(.dark, [data-theme="dark"]) .ui-segc__icon { color: rgba(255, 255, 255, 0.46); }
:where(.dark, [data-theme="dark"]) .ui-segc__opt[data-active] .ui-segc__icon { color: var(--ui-segc-ink); }
`;export{i as t};