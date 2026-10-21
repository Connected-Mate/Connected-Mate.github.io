import{t as F}from"./react-BkAXpnfr.js";var W=F();var{Children:Q,Component:Z,Fragment:tt,StrictMode:et,cloneElement:it,createContext:at,createElement:nt,createRef:rt,forwardRef:ot,isValidElement:st,lazy:lt,memo:dt,startTransition:pt,Suspense:ct,use:ht,useCallback:ut,useContext:kt,useDebugValue:ft,useDeferredValue:mt,useEffect:d,useId:I,useImperativeHandle:bt,useInsertionEffect:gt,useLayoutEffect:_t,useMemo:xt,useOptimistic:vt,useReducer:wt,useRef:w,useState:s,useSyncExternalStore:yt,useTransition:Nt}=W;import{t as j}from"./jsx-runtime-CTsRTJUX.js";var P=j(),{jsx:t,jsxs:a,Fragment:E}=P;var U=3200;function V(i){if(!i)return"";try{return new URL(i).hostname.replace(/^www\./,"")}catch{return i}}var Y=()=>a("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"none","aria-hidden":"true",children:[t("circle",{cx:"7",cy:"7",r:"4.5",stroke:"currentColor",strokeWidth:"1.6"}),t("path",{d:"m10.5 10.5 3 3",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round"})]}),G=()=>t("svg",{width:"14",height:"14",viewBox:"0 0 16 16",fill:"none","aria-hidden":"true",children:t("path",{d:"m4 6 4 4 4-4",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round"})});function H({s:i,delay:b,tipId:p}){let o=i.tooltip??V(i.href),c=a(E,{children:[t("span",{className:"ui-at-think__icon","aria-hidden":"true",children:i.icon??i.label.slice(0,1).toUpperCase()}),t("span",{className:"ui-at-think__srclabel",children:i.label}),o&&t("span",{className:"ui-at-think__tip",role:"tooltip",id:p,children:o})]}),k={className:"ui-at-think__src",style:{animationDelay:`${b}ms`},"aria-describedby":o?p:void 0};return i.href?t("a",{...k,href:i.href,target:"_blank",rel:"noopener noreferrer",children:c}):t("span",{...k,tabIndex:o?0:void 0,children:c})}function B({steps:i,doneLabel:b="Finished thinking",stepMs:p=1300,loop:o=!1,onDone:c,className:k}){let g=I(),[f,D]=s(0),[m,y]=s(i.length?1:0),[N,S]=s(0),[h,T]=s(null),[_,M]=s(!0),[C,L]=s({}),x=w(0),R=w(c);R.current=c;let n=m>i.length;d(()=>{x.current=performance.now(),y(i.length?1:0),S(0),T(null),L({})},[f,i]),d(()=>{if(n||!i.length)return;let e=window.setTimeout(()=>y(r=>r+1),p);return()=>window.clearTimeout(e)},[m,n,p,i.length]),d(()=>{if(n)return;let e=window.setInterval(()=>{S(Math.floor((performance.now()-x.current)/1e3))},250);return()=>window.clearInterval(e)},[n,f]),d(()=>{if(!n||h!==null)return;let e=Math.max(1,Math.round((performance.now()-x.current)/1e3));T(e),R.current?.(e)},[n,h]),d(()=>{if(!o||h===null)return;let e=window.setTimeout(()=>D(r=>r+1),U);return()=>window.clearTimeout(e)},[o,h]);let A=i.slice(0,Math.min(m,i.length));return a("section",{className:["ui-at-think",k].filter(Boolean).join(" "),"data-state":n?"done":"thinking","aria-label":"Assistant progress",children:[t("style",{href:"ui-thinking-state",precedence:"default",children:J}),a("button",{type:"button",className:"ui-at-think__head","aria-expanded":_,"aria-controls":`${g}-steps`,onClick:()=>M(e=>!e),children:[t("span",{className:"ui-at-think__chev","aria-hidden":"true",children:t(G,{})}),n?a("span",{className:"ui-at-think__title",children:["Worked for ",h??N,"s"]},"done"):a("span",{className:"ui-at-think__title",children:[t("span",{className:"ui-at-think__shine",children:"Thinking"}),a("span",{className:"ui-at-think__timer","aria-hidden":"true",children:[N,"s"]})]},"live")]}),t("div",{className:"ui-at-think__fold","data-open":_||void 0,children:t("div",{className:"ui-at-think__clip",inert:!_,children:a("ol",{className:"ui-at-think__steps",id:`${g}-steps`,"aria-live":"polite",children:[A.map((e,r)=>{let $=!n&&r===m-1,O=$&&e.activeLabel?e.activeLabel:e.label,l=e.moreSources??[],z=[...e.sources??[],...C[r]?l:[]];return a("li",{className:"ui-at-think__step","data-kind":e.kind,"data-active":$||void 0,children:[t("span",{className:"ui-at-think__node","aria-hidden":"true",children:e.kind==="search"?t(Y,{}):t("span",{className:"ui-at-think__dot"})}),a("div",{className:"ui-at-think__body",children:[t("span",{className:"ui-at-think__label",children:O}),(z.length>0||l.length>0)&&a("div",{className:"ui-at-think__sources",children:[z.map((v,u)=>t(H,{s:v,tipId:`${g}-tip-${r}-${u}`,delay:u<(e.sources?.length??0)?120+u*140:(u-(e.sources?.length??0))*80},u)),l.length>0&&!C[r]&&a("button",{type:"button",className:"ui-at-think__more",style:{animationDelay:`${120+(e.sources?.length??0)*140}ms`},onClick:()=>L(v=>({...v,[r]:!0})),"aria-label":`Show ${l.length} more source${l.length===1?"":"s"}`,children:["+",l.length," more"]})]})]})]},`${f}-${r}`)}),n&&a("li",{className:"ui-at-think__step","data-kind":"done",children:[t("span",{className:"ui-at-think__node","aria-hidden":"true",children:a("svg",{className:"ui-at-think__check",width:"18",height:"18",viewBox:"0 0 18 18",children:[t("circle",{cx:"9",cy:"9",r:"9"}),t("path",{d:"m5.2 9.3 2.5 2.5 5-5.3"})]})}),t("div",{className:"ui-at-think__body",children:t("span",{className:"ui-at-think__label",children:b})})]},`${f}-done`)]})})})]})}var J=`
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
`;var X=[{kind:"search",label:"Searched",activeLabel:"Searching your workspace and the web",sources:[{label:"Slack \u2013 #team-offsite",href:"https://slack.com",tooltip:"slack.com/archives/team-offsite"},{label:"X \u2013 @lisbonguide",href:"https://x.com/lisbonguide"},{label:"Notion \u2013 Offsite plan",href:"https://www.notion.so",tooltip:"Team offsite plan, updated yesterday"},{label:"Wikipedia \u2013 Lisbon",href:"https://en.wikipedia.org/wiki/Lisbon"}],moreSources:[{label:"Google Flights \u2013 BER \u2192 LIS",href:"https://www.google.com/travel/flights"},{label:"Airbnb \u2013 Alfama houses",href:"https://www.airbnb.com"},{label:"Booking.com \u2013 Baixa hotels",href:"https://www.booking.com"}]},{kind:"step",label:"Reading 7 sources about the trip"},{kind:"step",label:"Comparing flights and hotels"},{kind:"step",label:"Checking dates against the team calendar"},{kind:"step",label:"Drafting the offsite agenda"}];function q(){return t(B,{steps:X,loop:!0})}export{q as default};
