import{t as e}from"./react-BkAXpnfr.js";import{t}from"./jsx-runtime-CTsRTJUX.js";var n=e(),r=t(),i=4;function a({groups:e,value:t,defaultValue:a={},onChange:c,defaultOpen:l,title:u=`Filters`,hints:d=!0,className:f}){let p=(Array.isArray(e)?e:[]).filter(e=>!!e&&typeof e==`object`).map(e=>({...e,label:String(e.label??``),options:(Array.isArray(e.options)?e.options:[]).filter(e=>!!e&&typeof e==`object`).map(e=>({...e,label:String(e.label??``)}))})),m=(0,n.useId)(),[h,g]=(0,n.useState)(a),_=t??h,[v,y]=(0,n.useState)(()=>new Set(l??p.slice(0,1).map(e=>e.id))),[b,x]=(0,n.useState)(null),S=(0,n.useRef)(null),C=(0,n.useRef)(null),w=o(C),T=(0,n.useRef)(null),[E,D]=(0,n.useState)(1/0),O=e=>{t===void 0&&g(e),c?.(e)},k=e=>Array.isArray(_[e])?_[e]:[],A=(e,t)=>k(e).includes(t),j=(e,t)=>{let n=k(e);O({..._,[e]:n.includes(t)?n.filter(e=>e!==t):[...n,t]})},M=e=>y(t=>{let n=new Set(t);return n.has(e)?n.delete(e):n.add(e),n}),N=new Set,P=p.flatMap(e=>e.options.filter(t=>A(e.id,t.id)&&!N.has(`${e.id}\u0000${t.id}`)&&!!N.add(`${e.id}\u0000${t.id}`)).map(t=>({group:e,option:t,label:`${e.chipPrefix??``}${t.label}`}))),F=P.map(e=>`${e.group.id}:${e.option.id}:${e.label}`).join(`|`);(0,n.useLayoutEffect)(()=>{let e=C.current,t=T.current;if(!e||!t)return;let n=()=>{let n=[...t.children].map(e=>e.offsetWidth+i),r=n.pop()??0,a=getComputedStyle(e),o=e.clientWidth-parseFloat(a.paddingLeft)-parseFloat(a.paddingRight)+i,s=0,c=0;for(;c<n.length;c++){let e=c+1<n.length?r:0;if(s+n[c]+e>o)break;s+=n[c]}D(c)};n();let r=new ResizeObserver(n);return r.observe(e),()=>r.disconnect()},[F]);let I=P.slice(0,E),L=P.slice(E),R=p.flatMap((e,t)=>[{kind:`group`,group:e,gi:t},...v.has(e.id)?e.options.map((n,r)=>({kind:`option`,group:e,option:n,gi:t,oi:r})):[]]),z=e=>e.kind===`group`?`g:${e.gi}`:`o:${e.gi}:${e.oi}`,B=e=>{x(e),S.current?.querySelector(`[data-key="${CSS.escape(e)}"]`)?.focus()};return(0,r.jsxs)(`div`,{className:[`ui-fmc`,f].filter(Boolean).join(` `),children:[(0,r.jsx)(`style`,{href:`ui-filter-menu-clean`,precedence:`default`,children:s}),(0,r.jsxs)(`div`,{className:`ui-fmc__head`,children:[(0,r.jsx)(`span`,{className:`ui-fmc__title`,dir:`auto`,title:u,children:u}),(0,r.jsx)(`button`,{type:`button`,className:`ui-fmc__clear`,disabled:P.length===0,onClick:()=>O({}),children:`Clear all`})]}),(0,r.jsx)(`div`,{className:`ui-fmc__chips-outer`,ref:w,children:(0,r.jsxs)(`div`,{className:`ui-fmc__chips`,ref:C,"data-empty":P.length===0||void 0,"aria-live":`polite`,children:[(0,r.jsxs)(`div`,{className:`ui-fmc__measure`,ref:T,"aria-hidden":`true`,children:[P.map((e,t)=>(0,r.jsxs)(`span`,{className:`ui-fmc__chip`,children:[(0,r.jsx)(`span`,{className:`ui-fmc__chip-label`,children:e.label}),(0,r.jsx)(`span`,{className:`ui-fmc__chip-x`})]},t)),(0,r.jsx)(`span`,{className:`ui-fmc__chip ui-fmc__more`,children:`+99`})]}),I.map((e,t)=>(0,r.jsxs)(`span`,{className:`ui-fmc__chip`,children:[(0,r.jsx)(`span`,{className:`ui-fmc__chip-label`,dir:`auto`,title:e.label,children:e.label}),(0,r.jsx)(`button`,{type:`button`,className:`ui-fmc__chip-x`,"aria-label":`Remove ${e.label}`,onClick:()=>j(e.group.id,e.option.id),children:(0,r.jsx)(`svg`,{viewBox:`0 0 16 16`,"aria-hidden":`true`,children:(0,r.jsx)(`path`,{d:`M4.5 4.5l7 7M11.5 4.5l-7 7`})})})]},t)),L.length>0&&(0,r.jsx)(`span`,{className:`ui-fmc__chip ui-fmc__more`,title:L.map(e=>e.label).join(`, `),"aria-label":`${L.length} more: ${L.map(e=>e.label).join(`, `)}`,children:(0,r.jsxs)(`span`,{className:`ui-fmc__roll`,children:[`+`,L.length]},L.length)})]})}),(0,r.jsx)(`div`,{className:`ui-fmc__groups`,ref:S,onKeyDown:e=>{let t=R.findIndex(e=>z(e)===b),n=R[t];if(e.key===`ArrowDown`||e.key===`ArrowUp`){e.preventDefault();let n=R[Math.max(0,Math.min(R.length-1,t+(e.key===`ArrowDown`?1:-1)))]??R[0];B(z(n))}else if(e.key===`Home`||e.key===`End`)e.preventDefault(),B(z(R[e.key===`Home`?0:R.length-1]));else if(n&&(e.key===`ArrowRight`||e.key===`ArrowLeft`)){e.preventDefault();let t=n.group.id;e.key===`ArrowRight`&&!v.has(t)&&M(t),e.key===`ArrowLeft`&&(v.has(t)&&M(t),B(`g:${n.gi}`))}else n&&(e.key===`Enter`||e.key===` `)&&(e.preventDefault(),n.kind===`group`?M(n.group.id):j(n.group.id,n.option.id))},children:p.map((e,t)=>{let n=v.has(e.id),i=new Set(k(e.id).filter(t=>e.options.some(e=>e.id===t))).size,a=`g:${t}`;return(0,r.jsxs)(`section`,{className:`ui-fmc__group`,"data-open":n?``:void 0,children:[(0,r.jsxs)(`button`,{type:`button`,className:`ui-fmc__group-head`,"data-key":a,tabIndex:b===a||b===null&&t===0?0:-1,"aria-expanded":n,"aria-controls":`${m}-${t}`,onFocus:()=>x(a),onClick:()=>M(e.id),children:[(0,r.jsx)(`svg`,{className:`ui-fmc__chevron`,viewBox:`0 0 16 16`,"aria-hidden":`true`,children:(0,r.jsx)(`path`,{d:`M4.5 6.25 8 9.75l3.5-3.5`})}),(0,r.jsx)(`span`,{className:`ui-fmc__group-label`,dir:`auto`,title:e.label,children:e.label}),(0,r.jsx)(`span`,{className:`ui-fmc__group-count`,children:e.options.length.toLocaleString(`en-US`)}),(0,r.jsx)(`span`,{className:`ui-fmc__group-picked`,"aria-live":`polite`,children:i>0&&(0,r.jsx)(`span`,{className:`ui-fmc__roll`,children:`${i} filter${i===1?``:`s`}`},i)})]}),(0,r.jsx)(`div`,{className:`ui-fmc__panel`,id:`${m}-${t}`,role:`group`,"aria-label":e.label,children:(0,r.jsx)(`div`,{className:`ui-fmc__panel-inner`,children:e.options.map((i,a)=>{let o=`o:${t}:${a}`,s=A(e.id,i.id);return(0,r.jsxs)(`button`,{type:`button`,role:`checkbox`,"aria-checked":s,className:`ui-fmc__option`,"data-key":o,tabIndex:n&&b===o?0:-1,onFocus:()=>x(o),onClick:()=>j(e.id,i.id),children:[(0,r.jsx)(`span`,{className:`ui-fmc__box`,"aria-hidden":`true`,children:(0,r.jsx)(`svg`,{viewBox:`0 0 16 16`,children:(0,r.jsx)(`path`,{d:`m4.25 8.25 2.5 2.5 5-5.5`})})}),(0,r.jsx)(`span`,{className:`ui-fmc__option-label`,dir:`auto`,title:i.label,children:i.label})]},`${i.id}#${a}`)})})})]},`${e.id}#${t}`)})}),d&&(0,r.jsxs)(`div`,{className:`ui-fmc__hints`,"aria-hidden":`true`,children:[(0,r.jsxs)(`span`,{className:`ui-fmc__hint`,children:[(0,r.jsx)(`kbd`,{children:`↑`}),(0,r.jsx)(`kbd`,{children:`↓`}),(0,r.jsx)(`span`,{children:`to navigate`})]}),(0,r.jsxs)(`span`,{className:`ui-fmc__hint`,children:[(0,r.jsx)(`kbd`,{children:`↵`}),(0,r.jsx)(`span`,{children:`to select`})]})]})]})}function o(e){let t=(0,n.useRef)(null);return(0,n.useLayoutEffect)(()=>{let n=t.current,r=e.current;if(!n||!r)return;let i=()=>{n.style.height=`${r.offsetHeight}px`};i();let a=new ResizeObserver(i);a.observe(r);let o=requestAnimationFrame(()=>n.setAttribute(`data-smooth`,``));return()=>{a.disconnect(),cancelAnimationFrame(o)}},[e]),t}var s=`
/* Colors and motion as variables – override them on .ui-fmc */
.ui-fmc {
  --ui-fmc-card: #ffffff;
  --ui-fmc-ink: rgba(0, 22, 43, 0.88);
  --ui-fmc-strong: #000000;
  --ui-fmc-text: rgba(0, 22, 43, 0.61);
  --ui-fmc-muted: rgba(0, 22, 43, 0.45);
  --ui-fmc-faint: rgba(0, 22, 43, 0.27);
  --ui-fmc-icon: rgba(0, 22, 43, 0.447);
  --ui-fmc-line: rgba(26, 62, 112, 0.06);
  --ui-fmc-fill: rgba(26, 62, 112, 0.06);
  --ui-fmc-fill-strong: rgba(26, 62, 112, 0.1);
  --ui-fmc-wash: rgba(26, 62, 112, 0.03);
  --ui-fmc-box-ring: rgba(26, 62, 112, 0.22);
  --ui-fmc-accent: rgba(35, 95, 166, 0.765);
  --ui-fmc-check: #ffffff;
  --ui-fmc-focus: rgba(35, 95, 166, 0.35);
  /* Strokes are shadows: a 0.5px hairline plus a soft lift */
  --ui-fmc-shadow: 0 0 0 0.5px rgba(26, 62, 112, 0.06), 0 1px 1px -1px rgba(26, 62, 112, 0.1), 0 1px 2px 0 rgba(26, 62, 112, 0.05);
  --ui-fmc-ease: cubic-bezier(0.22, 1, 0.36, 1);
  --ui-fmc-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  box-sizing: border-box;
  width: 100%;
  max-width: 400px;
  container-type: inline-size;
  overflow: hidden;
  border-radius: 10px;
  background: var(--ui-fmc-card);
  box-shadow: var(--ui-fmc-shadow);
  font-family: Avenir Next,Avenir, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  font-size: 13px;
  line-height: 20px;
  font-weight: 400;
  color: var(--ui-fmc-ink);
  -webkit-font-smoothing: antialiased;
}
.ui-fmc *, .ui-fmc *::before, .ui-fmc *::after { box-sizing: border-box; }
:where(.ui-fmc) button { margin: 0; padding: 0; border: 0; background: none; font: inherit; color: inherit; text-align: left; cursor: pointer; -webkit-tap-highlight-color: transparent; }
:where(.ui-fmc) svg { display: block; flex: none; }
.ui-fmc button:focus-visible { outline: 2px solid var(--ui-fmc-focus); outline-offset: 1px; }

/* ---------- Header ---------- */

.ui-fmc__head { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 10px 8px 16px; }
.ui-fmc__title { min-width: 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; text-align: start; font-size: 15px; line-height: 24px; font-weight: 500; color: var(--ui-fmc-strong); }
/* Clear all: a quiet ghost button */
.ui-fmc__clear {
  flex: none;
  height: 28px;
  padding: 0 8px !important;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  color: var(--ui-fmc-text);
  transition: color 160ms ease, background-color 160ms ease;
}
.ui-fmc__clear:hover:not(:disabled) { background: var(--ui-fmc-wash); color: var(--ui-fmc-ink); }
.ui-fmc__clear:disabled { color: var(--ui-fmc-faint); cursor: default; }

/* ---------- Chips: one line, the rest go into "+N" ---------- */

.ui-fmc__chips-outer { overflow: hidden; }
.ui-fmc__chips-outer[data-smooth] { transition: height 320ms var(--ui-fmc-ease); }
.ui-fmc__chips { position: relative; display: flex; flex-wrap: nowrap; gap: 4px; padding: 0 16px 12px; overflow: hidden; }
.ui-fmc__chips[data-empty] { padding-bottom: 0; }
.ui-fmc__measure { position: absolute; top: 0; left: 0; display: flex; gap: 4px; width: max-content; visibility: hidden; pointer-events: none; }
.ui-fmc__chip {
  display: inline-flex;
  flex: none;
  align-items: center;
  gap: 2px;
  height: 24px;
  padding: 0 3px 0 8px;
  border-radius: 6px;
  background: var(--ui-fmc-fill);
  font-size: 12px;
  line-height: 16px;
  font-weight: 500;
  color: var(--ui-fmc-ink);
  white-space: nowrap;
  animation: ui-fmc-chip-in 260ms var(--ui-fmc-ease) both;
}
.ui-fmc__chip-label { min-width: 0; max-width: 180px; overflow: hidden; text-overflow: ellipsis; }
.ui-fmc__chip-x {
  display: grid;
  place-items: center;
  flex: none;
  width: 18px;
  height: 18px;
  border-radius: 4px;
  color: var(--ui-fmc-icon);
  transition: background-color 140ms ease, color 140ms ease;
}
.ui-fmc__chip-x:hover { background: var(--ui-fmc-fill); color: var(--ui-fmc-ink); }
.ui-fmc__chip-x svg { width: 12px; height: 12px; fill: none; stroke: currentColor; stroke-width: 1.4; stroke-linecap: round; }
.ui-fmc__more { padding: 0 8px; color: var(--ui-fmc-text); font-variant-numeric: tabular-nums; cursor: default; }
.ui-fmc__roll { display: inline-block; animation: ui-fmc-roll 300ms var(--ui-fmc-ease) both; }

/* ---------- Groups ---------- */

.ui-fmc__groups { display: grid; grid-template-columns: minmax(0, 1fr); padding: 4px; border-top: 0.5px solid var(--ui-fmc-line); }
.ui-fmc__group-head {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 32px;
  padding: 0 8px !important;
  border-radius: 6px;
  /* Hover comes in crisp and fades out when the pointer moves on */
  transition: background-color 140ms ease;
}
.ui-fmc__group-head:hover { background: var(--ui-fmc-wash); transition-duration: 90ms; }
.ui-fmc__group-head:focus-visible, .ui-fmc__option:focus-visible { outline-offset: -2px; }
.ui-fmc__chevron {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: var(--ui-fmc-icon);
  stroke-width: 1.1;
  stroke-linecap: round;
  stroke-linejoin: round;
  transform: rotate(-90deg);
  transition: transform 260ms var(--ui-fmc-ease);
}
.ui-fmc__group[data-open] .ui-fmc__chevron { transform: none; }
.ui-fmc__group-label { min-width: 0; overflow: hidden; text-overflow: ellipsis; text-align: start; font-weight: 500; color: var(--ui-fmc-ink); white-space: nowrap; }
.ui-fmc__group-count { flex: none; font-size: 12px; line-height: 16px; color: var(--ui-fmc-faint); font-variant-numeric: tabular-nums; }
.ui-fmc__group-picked { display: inline-flex; flex: none; margin-left: auto; overflow: hidden; font-size: 12px; line-height: 16px; color: var(--ui-fmc-muted); font-variant-numeric: tabular-nums; white-space: nowrap; }

.ui-fmc__panel {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 320ms var(--ui-fmc-ease);
}
.ui-fmc__group[data-open] .ui-fmc__panel { grid-template-rows: 1fr; }
.ui-fmc__panel-inner {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  min-height: 0;
  overflow: hidden;
  padding: 0;
  opacity: 0;
  transition: opacity 220ms ease, padding 320ms var(--ui-fmc-ease);
}
.ui-fmc__group[data-open] .ui-fmc__panel-inner { opacity: 1; padding: 0 0 4px; }
/* A long list scrolls inside the open group, so the card keeps a sane height */
.ui-fmc__group[data-open] .ui-fmc__panel-inner { max-height: 320px; overflow-x: hidden; overflow-y: auto; overscroll-behavior: contain; }

/* Options sit under the group's label, the checkbox lined up with its text */
.ui-fmc__option {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 32px;
  padding: 0 8px 0 32px !important;
  border-radius: 6px;
  color: var(--ui-fmc-ink);
  transition: background-color 140ms ease;
}
.ui-fmc__option:hover { background: var(--ui-fmc-wash); transition-duration: 90ms; }
.ui-fmc__option-label { min-width: 0; text-align: start; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
/* Checkbox: 14px with a hairline, blue when picked; the check draws itself in */
.ui-fmc__box {
  display: grid;
  place-items: center;
  flex: none;
  width: 14px;
  height: 14px;
  border-radius: 4px;
  background: var(--ui-fmc-card);
  box-shadow: inset 0 0 0 0.5px var(--ui-fmc-box-ring), 0 1px 1px 0 rgba(26, 62, 112, 0.04);
  transition: background-color 160ms ease, box-shadow 160ms ease;
}
.ui-fmc__box svg {
  width: 12px;
  height: 12px;
  fill: none;
  stroke: var(--ui-fmc-check);
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 12;
  stroke-dashoffset: 12;
  transition: stroke-dashoffset 240ms var(--ui-fmc-ease);
}
.ui-fmc__option[aria-checked="true"] .ui-fmc__box { background: var(--ui-fmc-accent); box-shadow: none; }
.ui-fmc__option[aria-checked="true"] .ui-fmc__box svg { stroke-dashoffset: 0; transition-delay: 40ms; }

/* ---------- Keyboard hints: the last row of the card ---------- */

.ui-fmc__hints {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  height: 32px;
  padding: 0 12px;
  border-top: 0.5px solid var(--ui-fmc-line);
  font-size: 12px;
  line-height: 16px;
  color: var(--ui-fmc-muted);
}
.ui-fmc__hint { display: inline-flex; align-items: center; gap: 2px; white-space: nowrap; }
.ui-fmc__hint > span { margin-left: 4px; }
.ui-fmc kbd {
  display: inline-grid;
  place-items: center;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 4px;
  background: var(--ui-fmc-card);
  box-shadow: var(--ui-fmc-shadow);
  font-family: inherit;
  font-size: 10px;
  line-height: 16px;
  font-weight: 500;
  color: var(--ui-fmc-text);
}

@keyframes ui-fmc-chip-in { from { opacity: 0; transform: scale(0.9); } }
@keyframes ui-fmc-roll { from { opacity: 0; transform: translateY(60%); } to { opacity: 1; transform: none; } }

/* Narrow: a bit less side padding, shorter chips */
@container (max-width: 320px) {
  .ui-fmc__head { padding-left: 14px; }
  .ui-fmc__chips { padding-left: 14px; padding-right: 14px; }
  .ui-fmc__chip-label { max-width: 132px; }
}
/* Touch screens: taller rows and buttons */
@media (hover: none) and (pointer: coarse) {
  .ui-fmc__clear { height: 36px; }
  .ui-fmc__chip { height: 32px; }
  .ui-fmc__chip-x { width: 26px; height: 26px; }
  .ui-fmc__group-head { height: 44px; }
  .ui-fmc__option { height: 44px; }
  .ui-fmc__box { width: 18px; height: 18px; border-radius: 5px; }
  .ui-fmc__box svg { width: 14px; height: 14px; }
  .ui-fmc__hints { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .ui-fmc *, .ui-fmc *::before, .ui-fmc *::after { animation: none !important; transition: none !important; }
}

/* Dark mode: follows a .dark class or data-theme="dark" on any ancestor, e.g. <html> */
:where(.dark, [data-theme="dark"]) .ui-fmc {
  --ui-fmc-card: #061b3a;
  --ui-fmc-ink: rgba(255, 255, 255, 0.9);
  --ui-fmc-strong: #ffffff;
  --ui-fmc-text: rgba(255, 255, 255, 0.62);
  --ui-fmc-muted: rgba(255, 255, 255, 0.46);
  --ui-fmc-faint: rgba(255, 255, 255, 0.3);
  --ui-fmc-icon: rgba(255, 255, 255, 0.5);
  --ui-fmc-line: rgba(255, 255, 255, 0.08);
  --ui-fmc-fill: rgba(255, 255, 255, 0.08);
  --ui-fmc-fill-strong: rgba(255, 255, 255, 0.13);
  --ui-fmc-wash: rgba(255, 255, 255, 0.04);
  --ui-fmc-box-ring: rgba(255, 255, 255, 0.28);
  --ui-fmc-accent: #4883ce;
  --ui-fmc-check: #ffffff;
  --ui-fmc-focus: rgba(72, 131, 206, 0.5);
  --ui-fmc-shadow: 0 0 0 0.5px rgba(255, 255, 255, 0.1), 0 1px 2px 0 rgba(0, 22, 43, 0.4);
}
`;export{a as t};