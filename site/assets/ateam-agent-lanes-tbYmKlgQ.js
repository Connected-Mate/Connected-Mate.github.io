import{t as we}from"./react-BkAXpnfr.js";var ye=we();var{Children:Ze,Component:Ge,Fragment:Ke,StrictMode:Je,cloneElement:Qe,createContext:Ue,createElement:Xe,createRef:Ye,forwardRef:ea,isValidElement:aa,lazy:ta,memo:na,startTransition:ia,Suspense:sa,use:ra,useCallback:oa,useContext:la,useDebugValue:da,useDeferredValue:pa,useEffect:M,useId:le,useImperativeHandle:ua,useInsertionEffect:ca,useLayoutEffect:ee,useMemo:V,useOptimistic:fa,useReducer:ga,useRef:v,useState:b,useSyncExternalStore:ma,useTransition:ba}=ye;import{t as Ne}from"./jsx-runtime-CTsRTJUX.js";var Me=Ne(),{jsx:a,jsxs:o,Fragment:_a}=Me;var z=6e4,k=48,de={done:"Done",running:"Running",waiting:"Needs you",failed:"Failed"};function pe(i){let n=Math.max(1,Math.round(i/z));if(n<60)return`${n}m`;let r=Math.floor(n/60),f=n%60;return f?`${r}h ${String(f).padStart(2,"0")}m`:`${r}h`}function Le(i){let n=Math.round(i/z);return n<60?`Last ${n}m`:n%60?`Last ${Math.floor(n/60)}h ${n%60}m`:`Last ${n/60}h`}function $e(i){return[1,2,5,10,15,30,60,120,240].map(r=>r*z).find(r=>i/r<=7)??240*z}function Ie(i){let n=Math.round(i/z);if(n<60)return`\u2212${n}m`;let r=Math.floor(n/60);return n%60?`\u2212${r}h ${n%60}m`:`\u2212${r}h`}var Re=i=>i.split(/\s+/).filter(Boolean).slice(0,2).map(n=>n[0]?.toUpperCase()).join("");function Te(){let[i,n]=b(!1);return M(()=>{let r=window.matchMedia?.("(prefers-reduced-motion: reduce)");if(!r)return;let f=()=>n(r.matches);return f(),r.addEventListener?.("change",f),()=>r.removeEventListener?.("change",f)},[]),i}var Ce=()=>o("svg",{width:"13",height:"13",viewBox:"0 0 16 16","aria-hidden":"true",focusable:"false",children:[a("path",{fill:"currentColor",d:"M8 1.2c.35 2.9 1.9 4.45 4.8 4.8-2.9.35-4.45 1.9-4.8 4.8-.35-2.9-1.9-4.45-4.8-4.8 2.9-.35 4.45-1.9 4.8-4.8Z"}),a("path",{fill:"currentColor",opacity:".55",d:"M12.6 10.2c.15 1.2.8 1.85 2 2-1.2.15-1.85.8-2 2-.15-1.2-.8-1.85-2-2 1.2-.15 1.85-.8 2-2Z"})]}),Se=()=>a("svg",{width:"10",height:"10",viewBox:"0 0 16 16","aria-hidden":"true",focusable:"false",children:a("path",{fill:"currentColor",d:"M7.1 2.3a1 1 0 0 1 1.8 0l5.6 10.2a1 1 0 0 1-.9 1.5H2.4a1 1 0 0 1-.9-1.5L7.1 2.3Z"})});function ue({agents:i,tasks:n,span:r=30*z,now:f,onApprove:$,onReject:I,onOpen:E,title:g="Agents",className:R}){let h=le(),m=Te(),[H,A]=b(()=>Date.now());M(()=>{if(f!==void 0)return;A(Date.now());let e=window.setInterval(()=>A(Date.now()),1e3);return()=>window.clearInterval(e)},[f]);let d=f??H,_=d-r,[G,te]=b({}),T=V(()=>n.map(e=>G[e.id]?{...e,...G[e.id]}:e),[n,G]),K=V(()=>new Map(T.map(e=>[e.id,e])),[T]),ne=v(null),[D,be]=b(0);ee(()=>{let e=ne.current;if(!e)return;let s=()=>be(e.clientWidth);if(s(),typeof ResizeObserver>"u")return;let t=new ResizeObserver(s);return t.observe(e),()=>t.disconnect()},[]);let J=V(()=>new Map(i.map((e,s)=>[e.id,s])),[i]),B=e=>(e-_)/r*100,Q=T.filter(e=>J.has(e.agentId)&&(e.end??d)>_&&e.start<d),[p,O]=b(null),P=v(new Map),W=v(null),F=v(null),[ie,xe]=b({opacity:0}),l=p?K.get(p.taskId):void 0,U=l?l.status==="waiting"?"decide":"tip":null;M(()=>{p&&(!l||!Q.some(e=>e.id===p.taskId))&&O(null)}),ee(()=>{if(!p)return;let e=P.current.get(p.taskId),s=F.current,t=W.current;if(!e||!s||!t)return;let c=e.getBoundingClientRect(),u=s.getBoundingClientRect(),x=t.offsetWidth,S=t.offsetHeight,w=Math.min(Math.max(8,Math.min(c.right,u.right)-u.left-x),u.width-x-8),y=c.top-u.top-S-6,N=y>=4?y:c.bottom-u.top+6;xe({left:Math.max(8,w),top:N})},[p,d,D]),M(()=>{if(!p)return;let e=document.activeElement,s=!e||e===document.body||F.current?.contains(e);U==="decide"&&s&&W.current?.querySelector("[data-approve]")?.focus({preventScroll:!0});let t=c=>{let u=c.target;W.current?.contains(u)||P.current.get(p.taskId)?.contains(u)||O(null)};return document.addEventListener("pointerdown",t),()=>document.removeEventListener("pointerdown",t)},[p?.taskId,U]);let se=(e=!0)=>{let s=p?.taskId;O(null);let t=document.activeElement,c=!t||t===document.body||F.current?.contains(t);e&&s&&c&&P.current.get(s)?.focus({preventScroll:!0})},re=(e,s)=>{s?$?$(e):te(t=>({...t,[e.id]:{...t[e.id],status:"running"}})):I?I(e):te(t=>({...t,[e.id]:{...t[e.id],status:"failed",end:Date.now()}})),se()},j=T.filter(e=>e.status==="running").length,C=T.filter(e=>e.status==="waiting").length,he=C?`${C} ${C===1?"task needs":"tasks need"} you`:j?`${j} running`:"Nothing running",oe=$e(r),X=[];for(let e=oe;e<r;e+=oe)X.push(e);let _e=Q.filter(e=>e.handoffTo&&K.has(e.handoffTo)).map(e=>{let s=K.get(e.handoffTo),t=J.get(e.agentId),c=J.get(s.agentId);if(t===void 0||c===void 0||!D)return null;let u=B(e.end??d)/100*D,x=B(s.start)/100*D,S=t*k+k/2,w=c*k+k/2,y=Math.max(14,Math.abs(x-u)/2+10),N=s.status==="running"||s.status==="waiting";return{id:`${e.id}-${s.id}`,d:`M ${u} ${S} C ${u+y} ${S}, ${x-y} ${w}, ${x} ${w}`,live:N}}).filter(Boolean),ve=e=>{let s=T.filter(t=>t.agentId===e);return s.some(t=>t.status==="waiting")?"waiting":s.some(t=>t.status==="running")?"running":"idle"};return o("div",{className:["ui-at-lanes",R].filter(Boolean).join(" "),"data-reduced":m||void 0,onKeyDown:e=>{e.key==="Escape"&&p&&(e.preventDefault(),se())},children:[a("style",{href:"ui-agent-lanes",precedence:"default",children:ze}),o("div",{className:"ui-at-lanes__bar",children:[a("span",{className:"ui-at-lanes__mark",children:a(Ce,{})}),a("h3",{className:"ui-at-lanes__title",children:g}),o("span",{className:"ui-at-lanes__stats",children:[j?o("span",{className:"ui-at-lanes__stat","data-kind":"running",children:[j," running"]}):null,C?o("span",{className:"ui-at-lanes__stat","data-kind":"waiting",children:[C," need",C===1?"s":""," you"]}):null]}),a("span",{className:"ui-at-lanes__span",children:Le(r)})]}),o("div",{className:"ui-at-lanes__panel",ref:F,children:[o("div",{className:"ui-at-lanes__grid",style:{"--lanes":i.length},children:[a("div",{className:"ui-at-lanes__corner","aria-hidden":"true"}),o("div",{className:"ui-at-lanes__scale","aria-hidden":"true",children:[X.map(e=>a("span",{className:"ui-at-lanes__tick",style:{left:`${100-e/r*100}%`},children:Ie(e)},e)),a("span",{className:"ui-at-lanes__now",children:"now"})]}),a("ul",{className:"ui-at-lanes__names","aria-hidden":"true",children:i.map(e=>{let s=ve(e.id);return o("li",{className:"ui-at-lanes__who",children:[a("span",{className:"ui-at-lanes__avatar",title:e.name,children:e.avatar??a("span",{className:"ui-at-lanes__initials",children:Re(e.name)})}),o("span",{className:"ui-at-lanes__id",children:[o("span",{className:"ui-at-lanes__name-row",children:[a("span",{className:"ui-at-lanes__name",children:e.name}),s==="waiting"?a("span",{className:"ui-at-lanes__tag","data-kind":"waiting",children:"Needs you"}):s==="idle"?a("span",{className:"ui-at-lanes__tag",children:"Idle"}):null]}),e.model?a("span",{className:"ui-at-lanes__model",children:e.model}):null]})]},e.id)})}),o("div",{className:"ui-at-lanes__track",ref:ne,children:[a("div",{className:"ui-at-lanes__lines","aria-hidden":"true",children:X.map(e=>a("span",{className:"ui-at-lanes__line",style:{left:`${100-e/r*100}%`}},e))}),a("svg",{className:"ui-at-lanes__curves",width:D,height:i.length*k,"aria-hidden":"true",children:_e.map(e=>a("path",{d:e.d,className:"ui-at-lanes__curve","data-live":e.live||void 0},e.id))}),i.map(e=>{let s=Q.filter(t=>t.agentId===e.id);return a("ul",{className:"ui-at-lanes__lane","aria-label":e.name,children:s.map(t=>{let c=B(t.start),u=B(t.end??d),x=Math.max(0,c),S=Math.max(.8,Math.min(100,u)-x),w=pe((t.end??d)-t.start),y=`${e.name}: ${t.title} \u2013 ${de[t.status]}, ${t.status==="done"?`took ${w}`:w}`,N=p?.taskId===t.id,Y=t.status==="waiting";return a("li",{className:"ui-at-lanes__slot",style:{left:`${x}%`,width:`${S}%`},"data-clipped":c<0||void 0,children:o("button",{type:"button",ref:q=>{q?P.current.set(t.id,q):P.current.delete(t.id)},className:"ui-at-lanes__block","data-status":t.status,"data-live":t.end===void 0||void 0,"aria-label":y,"aria-expanded":N,"aria-controls":N?`${h}-pop`:void 0,"aria-haspopup":Y?"dialog":void 0,onClick:()=>O(N?null:{taskId:t.id,kind:Y?"decide":"tip"}),children:[t.tools?.length?a("span",{className:"ui-at-lanes__tools",children:t.tools.slice(0,3).map((q,ke)=>a("span",{className:"ui-at-lanes__tool",children:q},ke))}):null,a("span",{className:"ui-at-lanes__label",children:t.title}),Y?o("span",{className:"ui-at-lanes__flag",children:[a(Se,{}),"Needs you"]}):null]})},t.id)})},e.id)})]})]}),p&&l?U==="decide"?o("div",{ref:W,id:`${h}-pop`,className:"ui-at-lanes__pop ui-at-lanes__pop--decide",role:"dialog","aria-label":`Decide: ${l.title}`,style:ie,children:[a("p",{className:"ui-at-lanes__pop-title",children:l.title}),l.ask?a("p",{className:"ui-at-lanes__pop-ask",children:l.ask}):null,o("div",{className:"ui-at-lanes__pop-actions",children:[a("button",{type:"button",className:"ui-at-lanes__btn",onClick:()=>re(l,!1),children:"Reject"}),a("button",{type:"button","data-approve":!0,className:"ui-at-lanes__btn ui-at-lanes__btn--main",onClick:()=>re(l,!0),children:"Approve"})]})]}):o("div",{ref:W,id:`${h}-pop`,className:"ui-at-lanes__pop ui-at-lanes__pop--tip",role:"tooltip",style:ie,children:[o("p",{className:"ui-at-lanes__tip-head",children:[i.find(e=>e.id===l.agentId)?.name," \xB7 ",de[l.status]," \xB7"," ",pe((l.end??d)-l.start)]}),l.summary?.length?a("ul",{className:"ui-at-lanes__tip-list",children:l.summary.map((e,s)=>a("li",{children:e},s))}):a("p",{className:"ui-at-lanes__tip-empty",children:l.title}),E?a("button",{type:"button",className:"ui-at-lanes__open",onClick:()=>E(l),children:"Open"}):null]}):null]}),a("p",{className:"ui-at-lanes__sr",role:"status","aria-live":"polite",children:he})]})}var ze=`
.ui-at-lanes {
  --frame: #f2f6fa; --panel: #ffffff; --soft: rgba(26, 62, 112, 0.06);
  --line: #dae2ec; --line-firm: #cbd6e4; --grid: rgba(26, 62, 112, 0.1);
  --ink: #00162b; --text: rgba(0, 22, 43, 0.66); --muted: rgba(0, 22, 43, 0.54);
  --berry: #851437; --berry-hover: #6d0f2d;
  --info-ink: #1a3e70; --info-fill: #eef5ff; --info-line: #c1daff; --ring: #8fbdf2;
  --ok-ink: #1d6a34; --ok-fill: #eafbee; --ok-line: #c9f5cf;
  --wait-ink: #775810; --wait-fill: #fdf6dd; --wait-line: #fae6a0;
  --bad-ink: #8a3a22; --bad-fill: #fdeee8; --bad-line: #f5d5c9;
  --done-fill: #f1f4f8; --done-ink: rgba(0, 22, 43, 0.6);
  --link: #8ebbf5; --dot-run: #2f6fc4; --dot-wait: #c48a12;
  --tile: #ffffff; --tip-bg: #00162b; --tip-ink: rgba(255, 255, 255, 0.92); --tip-muted: rgba(255, 255, 255, 0.62);
  --secondary: #fbfcfe;
  --pebble-shade: inset 0 -2px 6px -4px rgba(26, 62, 112, 0.4);
  --drop: 0 8px 16px -8px rgba(26, 62, 112, 0.2);
  --raised: 0 18px 30px -16px rgba(26, 62, 112, 0.38), 0 4px 10px -6px rgba(26, 62, 112, 0.18);
  --float: 0 24px 48px -24px rgba(26, 62, 112, 0.3);
  --ease: cubic-bezier(.16, 1, .3, 1);
  box-sizing: border-box;
  position: relative;
  width: 100%;
  max-width: 760px;
  padding: 6px;
  border-radius: 22px;
  background: var(--frame);
  border: 1px solid var(--line);
  box-shadow: var(--float);
  font-family: "Avenir Next", Avenir, system-ui, sans-serif;
  color: var(--text);
  font-size: 14px;
  line-height: 1.4;
  text-align: left;
  container-type: inline-size;
}
:where(.dark, [data-theme="dark"]) .ui-at-lanes {
  --frame: #0f2747; --panel: #16345c; --soft: rgba(255, 255, 255, 0.07);
  --line: rgba(255, 255, 255, 0.12); --line-firm: rgba(255, 255, 255, 0.18); --grid: rgba(255, 255, 255, 0.1);
  --ink: rgba(255, 255, 255, 0.94); --text: rgba(255, 255, 255, 0.72); --muted: rgba(255, 255, 255, 0.56);
  --berry: #a8204d; --berry-hover: #bd2a5a;
  --info-ink: #c1daff; --info-fill: rgba(143, 189, 242, 0.16); --info-line: rgba(143, 189, 242, 0.34); --ring: rgba(143, 189, 242, 0.6);
  --ok-ink: #7fe0a0; --ok-fill: rgba(127, 224, 160, 0.14); --ok-line: rgba(127, 224, 160, 0.3);
  --wait-ink: #f3d27a; --wait-fill: rgba(243, 210, 122, 0.14); --wait-line: rgba(243, 210, 122, 0.3);
  --bad-ink: #f2a48c; --bad-fill: rgba(242, 164, 140, 0.14); --bad-line: rgba(242, 164, 140, 0.3);
  --done-fill: rgba(255, 255, 255, 0.07); --done-ink: rgba(255, 255, 255, 0.6);
  --link: #8ebbf5; --dot-run: #8fbdf2; --dot-wait: #f3d27a;
  --tile: #ffffff; --tip-bg: #071a33; --tip-ink: rgba(255, 255, 255, 0.92); --tip-muted: rgba(255, 255, 255, 0.6);
  --secondary: rgba(255, 255, 255, 0.06);
  --pebble-shade: inset 0 -2px 6px -4px rgba(3, 12, 28, 0.8);
  --drop: 0 8px 16px -8px rgba(3, 12, 28, 0.6);
  --raised: 0 18px 30px -16px rgba(3, 12, 28, 0.8), 0 4px 10px -6px rgba(3, 12, 28, 0.6);
  --float: 0 24px 48px -24px rgba(3, 12, 28, 0.7);
}
.ui-at-lanes *, .ui-at-lanes *::before, .ui-at-lanes *::after { box-sizing: border-box; }
.ui-at-lanes :where(button) { font: inherit; color: inherit; cursor: pointer; }
.ui-at-lanes :focus-visible { outline: none; box-shadow: 0 0 0 3px var(--ring); }
.ui-at-lanes__sr {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0;
}

.ui-at-lanes__bar { display: flex; align-items: center; gap: 8px; padding: 8px 8px 10px 14px; min-height: 46px; }
.ui-at-lanes__mark { display: inline-flex; color: var(--dot-run); }
.ui-at-lanes__title {
  margin: 0; color: var(--ink); font-size: 16px; font-weight: 700; letter-spacing: 0;
  font-family: "Avenir Next Condensed", "Avenir Next", Avenir, system-ui, sans-serif;
}
.ui-at-lanes__stats { display: flex; flex-wrap: wrap; gap: 4px 12px; margin-left: 4px; min-width: 0; flex: 1; }
.ui-at-lanes__stat { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: var(--muted); white-space: nowrap; }
.ui-at-lanes__stat::before { content: ""; width: 6px; height: 6px; border-radius: 50%; background: var(--dot-run); }
.ui-at-lanes__stat[data-kind="waiting"] { color: var(--wait-ink); }
.ui-at-lanes__stat[data-kind="waiting"]::before { background: var(--dot-wait); }
.ui-at-lanes__span {
  flex: none; height: 26px; display: inline-flex; align-items: center; padding: 0 10px;
  border-radius: 9px; background: var(--panel); border: 1px solid var(--line); box-shadow: var(--pebble-shade);
  color: var(--ink); font-size: 12.5px; font-weight: 600;
}

.ui-at-lanes__panel {
  position: relative; background: var(--panel); border: 1px solid var(--line);
  border-radius: 16px; box-shadow: var(--raised); padding: 6px 16px 10px 14px;
}
.ui-at-lanes__grid {
  display: grid; grid-template-columns: 154px minmax(0, 1fr);
  grid-template-rows: 28px calc(var(--lanes) * ${k}px);
}
.ui-at-lanes__scale { position: relative; }
.ui-at-lanes__tick {
  position: absolute; top: 6px; transform: translateX(-50%);
  font-size: 11.5px; color: var(--muted); font-variant-numeric: tabular-nums; white-space: nowrap;
}
.ui-at-lanes__now {
  position: absolute; right: 0; top: 4px; height: 18px; display: inline-flex; align-items: center; padding: 0 6px;
  border-radius: 6px; background: var(--info-fill); border: 1px solid var(--info-line);
  color: var(--info-ink); font-size: 10.5px; font-weight: 600; letter-spacing: 0.04em;
}
.ui-at-lanes__names { list-style: none; margin: 0; padding: 0; }
.ui-at-lanes__who { height: ${k}px; display: flex; align-items: center; gap: 10px; min-width: 0; padding-right: 10px; }
.ui-at-lanes__avatar {
  flex: none; width: 30px; height: 30px; border-radius: 50%; display: grid; place-items: center; overflow: hidden;
  background: var(--tile); border: 1px solid var(--line); box-shadow: var(--pebble-shade);
}
.ui-at-lanes__avatar > svg, .ui-at-lanes__avatar > img { width: 16px; height: 16px; }
.ui-at-lanes__initials { font-size: 11px; font-weight: 700; color: #1a3e70; letter-spacing: 0.02em; }
.ui-at-lanes__id { min-width: 0; display: flex; flex-direction: column; }
.ui-at-lanes__name-row { display: flex; align-items: center; gap: 6px; min-width: 0; }
.ui-at-lanes__name { color: var(--ink); font-weight: 600; font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ui-at-lanes__model { font-size: 12.5px; color: var(--muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ui-at-lanes__tag {
  flex: none; height: 18px; display: inline-flex; align-items: center; padding: 0 6px; border-radius: 6px;
  background: var(--soft); border: 1px solid var(--line); color: var(--muted); font-size: 11px; font-weight: 600;
}
.ui-at-lanes__tag[data-kind="waiting"] { background: var(--wait-fill); border-color: var(--wait-line); color: var(--wait-ink); }

.ui-at-lanes__track {
  position: relative; display: grid; grid-auto-rows: ${k}px;
  -webkit-mask-image: linear-gradient(to right, transparent 0, #000 22px);
  mask-image: linear-gradient(to right, transparent 0, #000 22px);
}
.ui-at-lanes__lines { position: absolute; inset: 0; pointer-events: none; }
.ui-at-lanes__line { position: absolute; top: -6px; bottom: 0; border-left: 1px dashed var(--grid); }
.ui-at-lanes__curves { position: absolute; left: 0; top: 0; overflow: visible; pointer-events: none; z-index: 1; }
.ui-at-lanes__curve { fill: none; stroke: var(--link); stroke-width: 1.5; stroke-dasharray: 2 4; stroke-linecap: round; }
.ui-at-lanes__curve[data-live] { animation: ui-at-lanes-flow 900ms linear infinite; }
@keyframes ui-at-lanes-flow { to { stroke-dashoffset: -12; } }
.ui-at-lanes__lane { position: relative; list-style: none; margin: 0; padding: 0; border-bottom: 1px solid var(--line); }
.ui-at-lanes__lane:last-child { border-bottom: 0; }
.ui-at-lanes__slot { position: absolute; top: 9px; height: 30px; z-index: 2; }

.ui-at-lanes__block {
  position: relative; width: 100%; height: 100%; display: flex; align-items: center; gap: 6px;
  padding: 0 8px; border-radius: 9px; overflow: hidden; text-align: left;
  background: var(--done-fill); border: 1px solid var(--line); color: var(--done-ink);
  font-size: 13px; font-weight: 500;
  transition: background-color 300ms var(--ease), color 300ms var(--ease), border-color 300ms var(--ease);
}
.ui-at-lanes__block:hover { border-color: var(--line-firm); }
.ui-at-lanes__block[data-status="running"] { background: var(--info-fill); border-color: var(--info-line); color: var(--info-ink); }
.ui-at-lanes__block[data-status="running"][data-live] { border-right: 3px solid var(--dot-run); }
.ui-at-lanes__block[data-status="running"]::after {
  content: ""; position: absolute; inset: 0; pointer-events: none; mix-blend-mode: soft-light;
  background: linear-gradient(100deg, transparent 30%, rgba(255, 255, 255, 0.45) 50%, transparent 70%);
  background-size: 220% 100%; animation: ui-at-lanes-shimmer 2.4s linear infinite;
}
:where(.dark, [data-theme="dark"]) .ui-at-lanes__block[data-status="running"]::after {
  background-image: linear-gradient(100deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
}
@keyframes ui-at-lanes-shimmer { from { background-position: 120% 0; } to { background-position: -120% 0; } }
.ui-at-lanes__block[data-status="waiting"] { background: var(--wait-fill); border-color: var(--wait-line); color: var(--wait-ink); }
.ui-at-lanes__block[data-status="failed"] { background: var(--bad-fill); border-color: var(--bad-line); color: var(--bad-ink); }
.ui-at-lanes__slot[data-clipped] .ui-at-lanes__block { border-top-left-radius: 0; border-bottom-left-radius: 0; border-left-color: transparent; }
.ui-at-lanes__tools { display: inline-flex; flex: none; position: relative; z-index: 1; }
.ui-at-lanes__tool {
  width: 18px; height: 18px; display: grid; place-items: center; border-radius: 5px;
  background: var(--tile); border: 1px solid var(--line); box-shadow: 0 1px 2px rgba(26, 62, 112, 0.12);
}
.ui-at-lanes__tool + .ui-at-lanes__tool { margin-left: -4px; }
.ui-at-lanes__tool > svg, .ui-at-lanes__tool > img { width: 11px; height: 11px; }
.ui-at-lanes__label { position: relative; z-index: 1; min-width: 0; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ui-at-lanes__flag {
  position: relative; z-index: 1; flex: none; display: inline-flex; align-items: center; gap: 4px; height: 20px; padding: 0 7px; border-radius: 6px;
  background: var(--panel); border: 1px solid var(--wait-line); color: var(--wait-ink); font-size: 11.5px; font-weight: 600;
  animation: ui-at-lanes-pulse 1.8s var(--ease) infinite;
}
@keyframes ui-at-lanes-pulse { 50% { box-shadow: 0 0 0 4px var(--wait-fill); } }

.ui-at-lanes__pop {
  position: absolute; z-index: 5; width: min(280px, calc(100% - 16px)); border-radius: 12px;
  animation: ui-at-lanes-pop 150ms var(--ease);
}
@keyframes ui-at-lanes-pop { from { opacity: 0; transform: translateY(4px); } }
.ui-at-lanes__pop--decide {
  padding: 12px 14px; background: var(--panel); border: 1px solid var(--line-firm); box-shadow: var(--raised);
}
.ui-at-lanes__pop-title { margin: 0 0 4px; color: var(--ink); font-weight: 600; }
.ui-at-lanes__pop-ask { margin: 0; font-size: 13px; color: var(--text); }
.ui-at-lanes__pop-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 12px; }
.ui-at-lanes__btn {
  height: 32px; padding: 0 14px; border-radius: 10px; border: 1px solid var(--line-firm);
  background: var(--secondary); color: var(--ink); font-size: 13.5px; font-weight: 600; box-shadow: var(--drop);
  transition: background-color 150ms var(--ease);
}
.ui-at-lanes__btn:hover { background: var(--soft); }
.ui-at-lanes .ui-at-lanes__btn--main {
  background: var(--berry); border-color: var(--berry); color: #fff;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 6px 12px -6px rgba(133, 20, 55, 0.6);
}
.ui-at-lanes .ui-at-lanes__btn--main:hover { background: var(--berry-hover); }
.ui-at-lanes__pop--tip {
  width: min(250px, calc(100% - 16px)); padding: 10px 12px; background: var(--tip-bg); color: var(--tip-ink);
  border: 1px solid rgba(255, 255, 255, 0.08); box-shadow: 0 18px 30px -16px rgba(3, 12, 28, 0.6); font-size: 12.5px;
}
.ui-at-lanes__tip-head { margin: 0 0 6px; color: var(--tip-muted); font-size: 11.5px; font-weight: 600; }
.ui-at-lanes__tip-list { margin: 0; padding-left: 16px; display: grid; gap: 2px; }
.ui-at-lanes__tip-empty { margin: 0; }
.ui-at-lanes__open {
  margin-top: 8px; padding: 0; border: 0; background: none; color: #c1daff !important;
  font-size: 12.5px; font-weight: 600; text-decoration: underline; text-underline-offset: 3px;
}

@container (max-width: 520px) {
  .ui-at-lanes__grid { grid-template-columns: 42px minmax(0, 1fr); }
  .ui-at-lanes__id { display: none; }
  .ui-at-lanes__who { padding-right: 8px; }
  .ui-at-lanes__panel { padding: 6px 10px 8px 8px; }
  .ui-at-lanes__tick:nth-child(odd) { display: none; }
}
@media (pointer: coarse) {
  .ui-at-lanes__btn { height: 40px; padding: 0 18px; }
}
@media (prefers-reduced-motion: reduce) {
  .ui-at-lanes *, .ui-at-lanes *::before, .ui-at-lanes *::after { transition-duration: 0ms !important; animation: none !important; }
}
`;var me=6e4,ce=30,Ee=22e3,ae=(i,n)=>a("svg",{viewBox:"0 0 16 16",width:"16",height:"16","aria-hidden":"true",focusable:"false",style:{color:n},children:i}),fe=i=>ae(a("path",{stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",d:"M8 2v12M2.8 5l10.4 6M2.8 11l10.4-6"}),i),Ae=i=>ae(a("circle",{cx:"8",cy:"8",r:"5",fill:"none",stroke:"currentColor",strokeWidth:"1.8",strokeDasharray:"5 2.6"}),i),De=i=>ae(a("path",{fill:"currentColor",d:"M8 1.5c.5 3.6 2.9 6 6.5 6.5-3.6.5-6 2.9-6.5 6.5-.5-3.6-2.9-6-6.5-6.5 3.6-.5 6-2.9 6.5-6.5Z"}),i),L=(i,n)=>a("svg",{viewBox:"0 0 12 12",width:"11",height:"11","aria-hidden":"true",focusable:"false",style:{color:n},children:i}),Pe=L(a("circle",{cx:"6",cy:"6",r:"4.2",fill:"none",stroke:"currentColor",strokeWidth:"1.4"}),"#1a6fd1"),Z=L(a("path",{d:"M3 1.5h4l2 2v7H3z",fill:"none",stroke:"currentColor",strokeWidth:"1.3"}),"#00162b"),We=L(a("path",{d:"M2 3h8v5H5L3 10V8H2z",fill:"currentColor"}),"#7a3fbf"),He=L(a("path",{d:"M2 10l1-3 5-5 2 2-5 5z",fill:"currentColor"}),"#d0402b"),Be=L(o("g",{fill:"none",stroke:"currentColor",strokeWidth:"1.4",children:[a("circle",{cx:"4",cy:"6",r:"2"}),a("path",{d:"M6 6h4.5M9 6v2"})]}),"#635bff"),Oe=L(o("g",{fill:"none",stroke:"currentColor",strokeWidth:"1.3",children:[a("circle",{cx:"3.5",cy:"3",r:"1.3"}),a("circle",{cx:"3.5",cy:"9",r:"1.3"}),a("circle",{cx:"8.5",cy:"4.5",r:"1.3"}),a("path",{d:"M3.5 4.3v3.4M8.5 5.8c0 2-5 1.4-5 1.9"})]}),"#00162b"),Fe=L(a("path",{d:"M2.5 6a3.5 3.5 0 0 1 6-2.4M9.5 6a3.5 3.5 0 0 1-6 2.4M8 1.5v2.3h-2.3M4 10.5V8.2h2.3",fill:"none",stroke:"currentColor",strokeWidth:"1.3"}),"#ff6a3d"),je=[{id:"research",name:"Researcher",model:"Opus 5.5",avatar:fe("#c8553d")},{id:"writer",name:"Writer",model:"Sonnet 5.5",avatar:fe("#c8553d")},{id:"review",name:"Reviewer",model:"GPT-6 Sol",avatar:Ae("#00162b")},{id:"ops",name:"Ops",model:"Gemini 3.8 Flash",avatar:De("#3a6fd8")}];function ge(i){let n=r=>i-r*me;return[{id:"r1",agentId:"research",title:"Competitor pricing",status:"done",start:n(29),end:n(18),handoffTo:"w1",tools:[Pe,Z],summary:["Checked 6 competitors","Collected plans and prices","Handed the table to the Writer"]},{id:"r2",agentId:"research",title:"Customer interviews",status:"running",start:n(10),tools:[Z,We],summary:["Read 14 interview notes","Grouping quotes by theme"]},{id:"w1",agentId:"writer",title:"Draft pricing page",status:"running",start:n(17.5),tools:[He,Z],summary:["Outlined the page","Writing plan copy and FAQ"]},{id:"v1",agentId:"review",title:"PR #448822 billing",status:"done",start:n(34),end:n(23),summary:["Read 12 changed files","214 tests passed","Left 3 comments"]},{id:"o1",agentId:"ops",title:"Sync CRM",status:"failed",start:n(29),end:n(22),tools:[Fe],summary:["Loaded 18,240 contacts","Stopped at the API rate limit"]},{id:"o2",agentId:"ops",title:"Rotate API keys",status:"waiting",start:n(14),tools:[Be,Oe],ask:"Rotate the production payment and model API keys? Jobs reconnect in ~30 s.",summary:["Listed 4 keys older than 90 days","Prepared the new keys"]}]}function qe(){let i=v(Date.now()),[n,r]=b(i.current),[f,$]=b(()=>ge(i.current)),I=v(null);M(()=>{let g=performance.now(),R=window.setInterval(()=>r(i.current+(performance.now()-g)*ce),80),h=[],m=(d,_)=>h.push(window.setTimeout(_,d)),H=d=>i.current+d*ce,A=()=>{g=performance.now(),r(i.current),$(ge(i.current)),m(4e3,()=>$(d=>[...d.map(_=>_.id==="w1"?{..._,status:"done",end:H(4e3),handoffTo:"v2",summary:["Outlined the page","Wrote plan copy and FAQ"]}:_),{id:"v2",agentId:"review",title:"Review pricing copy",status:"running",start:H(4e3)+.5*me,tools:[Z],summary:["Reading the draft","Checking prices against the table"]}])),m(9e3,()=>I.current?.querySelector('button[aria-haspopup="dialog"]')?.click()),m(11800,()=>I.current?.querySelector("[data-approve]")?.click()),m(Ee,A)};return A(),()=>{window.clearInterval(R),h.forEach(d=>window.clearTimeout(d))}},[]);let E=(g,R)=>$(h=>h.map(m=>m.id===g?{...m,status:R,...R==="failed"?{end:n}:{}}:m));return a("div",{ref:I,style:{width:"100%",display:"grid",placeItems:"center"},children:a(ue,{agents:je,tasks:f,now:n,onApprove:g=>E(g.id,"running"),onReject:g=>E(g.id,"failed"),onOpen:()=>{}})})}export{qe as default};
