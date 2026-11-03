import{t as e}from"./react-BkAXpnfr.js";import{t}from"./jsx-runtime-CTsRTJUX.js";var n=e(),r=t(),i=[`Thinking`,`Searching the web`,`Reading sources`,`Writing response`],a=Array.from({length:8},(e,t)=>t),o=e=>{if(e<60)return`${e}s`;let t=Math.floor(e/60);if(t<60)return`${t}m ${e%60}s`;let n=Math.floor(t/60);return n<24?`${n}h ${String(t%60).padStart(2,`0`)}m`:`${Math.floor(n/24)}d ${n%24}h`};function s({phases:e=i,interval:t=2200,phase:s,loop:l=!1,done:u=!1,doneLabel:d=e=>`Thought for ${o(e)}`,size:f=`md`,variant:p=`pill`,className:m}){let h=Array.isArray(e)?e.map(e=>String(e??``)):[],g=h.length?h:i.slice(0,1),_=Number.isFinite(t)&&t>0?Math.max(t,200):2200,[v,y]=(0,n.useState)(0),[b,x]=(0,n.useState)(()=>Date.now()),[S,C]=(0,n.useState)(null),w=S??Math.max(1,Math.round((Date.now()-b)/1e3));u&&S===null&&C(w),!u&&S!==null&&(C(null),x(Date.now()),y(0)),(0,n.useEffect)(()=>{if(u||s!==void 0&&Number.isFinite(s)||g.length<2)return;let e=window.setInterval(()=>{y(e=>e+1<g.length?e+1:l?0:e)},_);return()=>window.clearInterval(e)},[u,s,g.length,_,l]);let T=Math.min(Math.max(s!==void 0&&Number.isFinite(s)?Math.floor(s):v,0),Math.max(g.length-1,0)),E=String((u?typeof d==`function`?d(w):d:g[T])??``),[D,O]=(0,n.useState)({key:0,text:E}),[k,A]=(0,n.useState)(null);E!==D.text&&(A(D),O({key:D.key+1,text:E}));let j=(0,n.useRef)(null),M=(0,n.useRef)(null),N=(0,n.useRef)(null),P=(0,n.useRef)(!1),F=(0,n.useRef)(()=>{});return F.current=()=>{let e=j.current,t=M.current,n=N.current;if(!e||!t||!n)return;let r=n.scrollWidth+1,i=e.parentElement,a={width:t.style.width,transition:t.style.transition};t.style.transition=`none`,t.style.width=`${r}px`;let o=i?getComputedStyle(i):null,s=i&&o?i.clientWidth-parseFloat(o.paddingLeft)-parseFloat(o.paddingRight):0,c=i?Math.floor(s-(e.offsetWidth-t.offsetWidth)):r;t.style.width=a.width,t.getBoundingClientRect(),t.style.transition=a.transition;let l=c>0&&r>c;e.toggleAttribute(`data-cut`,l),t.style.width=`${l?c:r}px`},(0,n.useLayoutEffect)(()=>{let e=M.current;e&&(P.current||(e.style.transition=`none`),F.current(),P.current||=(e.getBoundingClientRect(),e.style.transition=``,!0))},[D.key]),(0,n.useEffect)(()=>{let e=j.current?.parentElement;if(!e||typeof ResizeObserver>`u`)return;let t=new ResizeObserver(()=>F.current());return t.observe(e),()=>t.disconnect()},[]),(0,r.jsxs)(`span`,{ref:j,className:[`ui-tlc`,m].filter(Boolean).join(` `),"data-size":f,"data-variant":p,"data-done":u||void 0,role:`status`,"aria-live":`polite`,children:[(0,r.jsx)(`style`,{href:`ui-thinking-loader-clean`,precedence:`default`,children:c}),(0,r.jsxs)(`span`,{className:`ui-tlc__icon`,"aria-hidden":`true`,children:[(0,r.jsx)(`svg`,{className:`ui-tlc__spinner`,viewBox:`0 0 16 16`,children:a.map(e=>(0,r.jsx)(`line`,{x1:`8`,y1:`1.75`,x2:`8`,y2:`4.75`,transform:`rotate(${e*45} 8 8)`,style:{animationDelay:`${(e-8)*100}ms`}},e))}),(0,r.jsx)(`svg`,{className:`ui-tlc__check`,viewBox:`0 0 16 16`,children:(0,r.jsx)(`path`,{d:`M3.5 8.4 6.6 11.3 12.5 4.9`,pathLength:1})})]}),(0,r.jsxs)(`span`,{ref:M,className:`ui-tlc__text`,children:[k&&(0,r.jsx)(`span`,{className:`ui-tlc__label ui-tlc__label--out`,"aria-hidden":`true`,dir:`auto`,onAnimationEnd:()=>A(null),children:k.text},k.key),(0,r.jsx)(`span`,{ref:N,className:[`ui-tlc__label`,D.key>0&&`ui-tlc__label--in`,!u&&`ui-tlc__shine`].filter(Boolean).join(` `),"data-text":D.text,title:D.text,dir:`auto`,children:D.text},D.key)]})]})}var c=`
.ui-tlc {
  --ui-tlc-ink: rgba(0, 22, 43, 0.88);
  --ui-tlc-text: rgba(0, 22, 43, 0.61);
  --ui-tlc-accent: rgba(35, 95, 166, 0.765);
  --ui-tlc-bg: #ffffff;
  --ui-tlc-shadow: 0 0 0 0.5px rgba(26, 62, 112, 0.06), 0 1px 1px -1px rgba(26, 62, 112, 0.1), 0 1px 2px 0 rgba(26, 62, 112, 0.05);
  --ui-tlc-shine: rgba(255, 255, 255, 0.82);
  --ui-tlc-ease: cubic-bezier(0.22, 1, 0.36, 1);
  --ui-tlc-h: 32px;
  --ui-tlc-font: 13px;
  --ui-tlc-lh: 20px;
  --ui-tlc-icon: 16px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  box-sizing: border-box;
  height: var(--ui-tlc-h);
  padding: 0 10px 0 8px;
  border-radius: 8px;
  background: var(--ui-tlc-bg);
  box-shadow: var(--ui-tlc-shadow);
  color: var(--ui-tlc-text);
  font-family: Avenir Next,Avenir, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  font-size: var(--ui-tlc-font);
  font-weight: 500;
  line-height: var(--ui-tlc-lh);
  letter-spacing: -0.003em;
  max-width: 100%;
  vertical-align: middle;
  -webkit-font-smoothing: antialiased;
}
.ui-tlc[data-size="sm"] {
  --ui-tlc-h: 26px;
  --ui-tlc-font: 12px;
  --ui-tlc-lh: 16px;
  --ui-tlc-icon: 14px;
  gap: 5px;
  padding: 0 8px 0 6px;
  border-radius: 6px;
}
.ui-tlc[data-variant="plain"] {
  height: auto;
  padding: 0;
  background: none;
  box-shadow: none;
}

/* Spinner and check share one square and swap with a little scale */
.ui-tlc__icon {
  position: relative;
  flex: none;
  width: var(--ui-tlc-icon);
  height: var(--ui-tlc-icon);
}
.ui-tlc__icon svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  transition: opacity 240ms ease, transform 420ms var(--ui-tlc-ease);
}
/* Thin rays in the accent blue – they fade one after another, so the spinner turns without rotating */
.ui-tlc__spinner line {
  stroke: var(--ui-tlc-accent);
  stroke-width: 1.1;
  stroke-linecap: round;
  opacity: 0.2;
  animation: ui-tlc-ray 800ms linear infinite;
}
.ui-tlc__check {
  opacity: 0;
  transform: scale(0.6);
  fill: none;
  stroke: var(--ui-tlc-accent);
  stroke-width: 1.2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.ui-tlc__check path {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
}
.ui-tlc[data-done] .ui-tlc__spinner {
  opacity: 0;
  transform: scale(0.6) rotate(-45deg);
}
.ui-tlc[data-done] .ui-tlc__check {
  opacity: 1;
  transform: none;
}
.ui-tlc[data-done] .ui-tlc__check path {
  animation: ui-tlc-draw 360ms var(--ui-tlc-ease) 120ms forwards;
}

/* The text box glides to the width of the incoming label; labels roll through it */
/* min-width 0: in a narrow container the box gives way and the label ends in "…" */
.ui-tlc__text {
  position: relative;
  display: block;
  min-width: 0;
  height: var(--ui-tlc-lh);
  overflow: hidden;
  transition: width 460ms var(--ui-tlc-ease);
}
.ui-tlc__label {
  position: absolute;
  top: 0;
  left: 0;
  line-height: var(--ui-tlc-lh);
  white-space: nowrap;
}
.ui-tlc[data-cut] .ui-tlc__label {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ui-tlc[data-done] .ui-tlc__label {
  color: var(--ui-tlc-ink);
}
.ui-tlc__label--in {
  animation: ui-tlc-in 460ms var(--ui-tlc-ease) both;
}
.ui-tlc__label--out {
  animation: ui-tlc-out 320ms var(--ui-tlc-ease) both;
}

/* A darker band sweeping through the gray label while it works */
.ui-tlc__shine::after {
  content: attr(data-text);
  content: attr(data-text) / "";
  position: absolute;
  inset: 0;
  white-space: nowrap;
  color: transparent;
  background: linear-gradient(90deg, transparent 38%, var(--ui-tlc-shine) 50%, transparent 62%) 100% 0 / 300% 100% no-repeat;
  -webkit-background-clip: text;
  background-clip: text;
  animation: ui-tlc-sweep 1.6s linear infinite;
  pointer-events: none;
}

@keyframes ui-tlc-ray {
  0% { opacity: 1; }
  100% { opacity: 0.2; }
}
@keyframes ui-tlc-in {
  from { opacity: 0; transform: translateY(70%); filter: blur(3px); }
  to { opacity: 1; transform: none; filter: none; }
}
@keyframes ui-tlc-out {
  from { opacity: 1; transform: none; filter: none; }
  to { opacity: 0; transform: translateY(-70%); filter: blur(3px); }
}
@keyframes ui-tlc-draw {
  to { stroke-dashoffset: 0; }
}
@keyframes ui-tlc-sweep {
  from { background-position: 100% 0; }
  to { background-position: 0% 0; }
}

@media (prefers-reduced-motion: reduce) {
  .ui-tlc *,
  .ui-tlc *::after {
    animation-duration: 1ms !important;
    animation-delay: 0ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 1ms !important;
  }
  .ui-tlc__spinner line { opacity: 0.6; }
  .ui-tlc__shine::after { display: none; }
  .ui-tlc__check path { stroke-dashoffset: 0; }
}

/* Dark mode: follows a .dark class or data-theme="dark" on any ancestor, e.g. <html> */
:where(.dark, [data-theme="dark"]) .ui-tlc {
  --ui-tlc-ink: rgba(255, 255, 255, 0.9);
  --ui-tlc-text: rgba(255, 255, 255, 0.62);
  --ui-tlc-accent: #4883ce;
  --ui-tlc-bg: #061b3a;
  --ui-tlc-shadow: 0 0 0 0.5px rgba(255, 255, 255, 0.1), 0 1px 2px rgba(0, 22, 43, 0.4);
  --ui-tlc-shine: #ffffff;
}
`;export{s as t};