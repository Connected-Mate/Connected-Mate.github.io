import{t as Se}from"./react-BkAXpnfr.js";var Be=Se();var{Children:st,Component:lt,Fragment:dt,StrictMode:ut,cloneElement:ct,createContext:pt,createElement:gt,createRef:ft,forwardRef:mt,isValidElement:bt,lazy:xt,memo:ht,startTransition:_t,Suspense:vt,use:kt,useCallback:wt,useContext:yt,useDebugValue:Nt,useDeferredValue:It,useEffect:M,useId:ge,useImperativeHandle:Mt,useInsertionEffect:Dt,useLayoutEffect:fe,useMemo:me,useOptimistic:Et,useReducer:Rt,useRef:g,useState:k,useSyncExternalStore:Tt,useTransition:Ct}=Be;import{t as Oe}from"./jsx-runtime-CTsRTJUX.js";var He=Oe(),{jsx:a,jsxs:s,Fragment:be}=He;var xe=6e4,Pe=1e3,qe=4,Fe="cubic-bezier(.16, 1, .3, 1)",We=o=>`$${o.toFixed(2)}`,Xe=o=>o.split(/\s+/).filter(Boolean).slice(0,2).map(b=>b[0]?.toUpperCase()).join(""),he=null,_e=o=>(he??=new Intl.DateTimeFormat(void 0,{hour:"2-digit",minute:"2-digit"}),he.format(o));function Ye(){let[o,b]=k(!1);return M(()=>{let N=window.matchMedia?.("(prefers-reduced-motion: reduce)");if(!N)return;let w=()=>b(N.matches);return w(),N.addEventListener?.("change",w),()=>N.removeEventListener?.("change",w)},[]),o}var Ke=()=>s("svg",{width:"13",height:"13",viewBox:"0 0 16 16","aria-hidden":"true",focusable:"false",children:[a("path",{fill:"currentColor",d:"M8 1.2c.35 2.9 1.9 4.45 4.8 4.8-2.9.35-4.45 1.9-4.8 4.8-.35-2.9-1.9-4.45-4.8-4.8 2.9-.35 4.45-1.9 4.8-4.8Z"}),a("path",{fill:"currentColor",opacity:".55",d:"M12.6 10.2c.15 1.2.8 1.85 2 2-1.2.15-1.85.8-2 2-.15-1.2-.8-1.85-2-2 1.2-.15 1.85-.8 2-2Z"})]}),Ue=()=>a("svg",{width:"8",height:"12",viewBox:"0 0 10 14","aria-hidden":"true",focusable:"false",children:[3,7,11].map(o=>s("g",{fill:"currentColor",children:[a("circle",{cx:"3",cy:o,r:"1.1"}),a("circle",{cx:"7",cy:o,r:"1.1"})]},o))}),je=()=>s("svg",{className:"ui-at-dlg__spin",width:"11",height:"11",viewBox:"0 0 16 16","aria-hidden":"true",focusable:"false",children:[a("circle",{cx:"8",cy:"8",r:"5.6",fill:"none",stroke:"currentColor",strokeOpacity:".25",strokeWidth:"2"}),a("path",{d:"M8 2.4a5.6 5.6 0 0 1 5.6 5.6",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"})]});function ve({agents:o,tasks:b,onAssign:N,mode:w,defaultMode:z="manual",onModeChange:A,suggestion:h,now:x,formatCost:f=We,title:_="Delegate",className:I}){let c=ge(),D=Ye(),[E,y]=k({}),m=me(()=>b.map(e=>e.id in E?{...e,agentId:E[e.id]}:e),[b,E]),v=(e,t)=>{N?N(e,t):y(i=>({...i,[e]:t}));let n=m.find(i=>i.id===e),r=o.find(i=>i.id===t);n&&P(r?`${n.title} \u2192 ${r.name}`:`${n.title} \u2192 Unassigned`)},[$,Y]=k(z),L=w??$,Ie=e=>{w===void 0&&Y(e),A?.(e)},[Me,De]=k(()=>Date.now());M(()=>{if(x!==void 0)return;let e=window.setInterval(()=>De(Date.now()),3e4);return()=>window.clearInterval(e)},[x]);let ne=x??Me,[Ee,P]=k(""),q=new Set(o.map(e=>e.id)),K=m.filter(e=>!e.agentId||!q.has(e.agentId)),U=e=>m.filter(t=>t.agentId===e),Re=(e,t)=>t.length?(e.current??t[0].estimate)+t.slice(1).reduce((n,r)=>n+r.estimate,0):0,ie=new Map(o.map(e=>[e.id,Re(e,U(e.id))])),Te=o.reduce((e,t)=>e+(t.rate??0)*(ie.get(t.id)??0),0),Ce=o.some(e=>e.rate!=null),re=g(m);re.current=m;let j=g(v);j.current=v,M(()=>{if(L!=="auto")return;let e=window.setInterval(()=>{let t=re.current,n=t.find(l=>!l.agentId||!se.current.has(l.agentId));if(!n)return;let r=null,i=1/0;for(let l of oe.current){let u=t.filter(T=>T.agentId===l.id),R=u.length?(l.current??u[0].estimate)+u.slice(1).reduce((T,te)=>T+te.estimate,0):0;R<i&&(r=l,i=R)}r&&j.current(n.id,r.id)},Pe);return()=>window.clearInterval(e)},[L]);let oe=g(o);oe.current=o;let se=g(q);se.current=q;let S=g(null),V=g(null),G=g(null);if(typeof window<"u"&&S.current){let e=new Map;S.current.querySelectorAll("[data-task]").forEach(t=>e.set(t.dataset.task,t.getBoundingClientRect())),V.current=e}fe(()=>{let e=V.current;V.current=null;let t=G.current;G.current=null;let n=S.current;!n||D||document.hidden||n.querySelectorAll("[data-task]").forEach(r=>{let i=r.dataset.task,l=t?.taskId===i?t.rect:e?.get(i);if(!l||typeof r.animate!="function")return;let u=r.getBoundingClientRect(),R=l.left-u.left,T=l.top-u.top;if(Math.abs(R)<1&&Math.abs(T)<1)return;let te=t?.taskId===i&&u.width?l.width/u.width:1,Le=t?.taskId===i&&u.height?l.height/u.height:1;r.animate([{transform:`translate(${R}px, ${T}px) scale(${te}, ${Le})`,transformOrigin:"0 0"},{transform:"translate(0, 0) scale(1, 1)",transformOrigin:"0 0"}],{duration:t?.taskId===i?380:320,easing:Fe})})});let[d,F]=k(null),Z=g(new Map),le=g(null),ze=(e,t)=>{for(let[r,i]of Z.current){let l=i.getBoundingClientRect();if(e>=l.left&&e<=l.right&&t>=l.top&&t<=l.bottom)return r}let n=le.current?.getBoundingClientRect();if(n&&e>=n.left&&e<=n.right&&t>=n.top&&t<=n.bottom)return null},de=(e,t)=>{if(e.button!==0||p)return;let n=e.currentTarget.getBoundingClientRect();F({taskId:t.id,from:t.agentId&&q.has(t.agentId)?t.agentId:null,x:e.clientX,y:e.clientY,dx:e.clientX-n.left,dy:e.clientY-n.top,w:n.width,h:n.height,over:void 0,started:!1,pointerId:e.pointerId,sx:e.clientX,sy:e.clientY})},Q=g(d);Q.current=d,M(()=>{if(!d)return;let e=r=>{let i=Q.current;if(!i||r.pointerId!==i.pointerId)return;let l=i.started||Math.hypot(r.clientX-i.sx,r.clientY-i.sy)>qe;l&&r.preventDefault(),F({...i,x:r.clientX,y:r.clientY,started:l,over:l?ze(r.clientX,r.clientY):void 0})},t=r=>{let i=Q.current;!i||r.pointerId!==i.pointerId||(F(null),i.started&&(G.current={taskId:i.taskId,rect:new DOMRect(i.x-i.dx,i.y-i.dy,i.w,i.h)},i.over!==void 0&&i.over!==i.from&&j.current(i.taskId,i.over)))},n=()=>F(null);return window.addEventListener("pointermove",e,{passive:!1}),window.addEventListener("pointerup",t),window.addEventListener("pointercancel",n),()=>{window.removeEventListener("pointermove",e),window.removeEventListener("pointerup",t),window.removeEventListener("pointercancel",n)}},[d?.taskId]);let[p,W]=k(null),B=g(new Map),O=g(null);M(()=>{O.current&&(B.current.get(O.current)?.focus(),O.current=null)});let ue=(e,t)=>{if(p&&p.taskId===t.id){if(e.key==="ArrowDown"||e.key==="ArrowUp"){e.preventDefault();let n=o.length,r=(p.index+(e.key==="ArrowDown"?1:-1)+n)%n;W({...p,index:r}),P(`${o[r].name}, busy until ${ce(t,o[r]).until}`)}else if(e.key==="Enter"||e.key===" "){e.preventDefault();let n=o[p.index];W(null),n&&n.id!==t.agentId&&v(t.id,n.id),O.current=t.id}else e.key==="Escape"&&(e.preventDefault(),W(null),P(`${t.title} put back`));return}if(e.key==="Enter"||e.key===" "){if(e.preventDefault(),!o.length)return;let n=Math.max(0,o.findIndex(r=>r.id===t.agentId));W({taskId:t.id,index:n}),P(`Picked up ${t.title}. Choose an agent with the arrow keys, Enter to hand it over, Escape to put it back.`)}else if(/^[1-9]$/.test(e.key)){let n=o[Number(e.key)-1];n&&n.id!==t.agentId&&(e.preventDefault(),v(t.id,n.id),O.current=t.id)}},ce=(e,t)=>{let n=U(t.id).filter(i=>i.id!==e.id),r=n.length?(t.current??n[0].estimate)+n.slice(1).reduce((i,l)=>i+l.estimate,0):0;return{add:e.estimate,until:_e(ne+(r+e.estimate)*xe),cost:t.rate!=null?t.rate*e.estimate:null}},H=d?.started?m.find(e=>e.id===d.taskId):void 0,pe=p?m.find(e=>e.id===p.taskId):void 0,X=(()=>{if(H&&d?.over)return{task:H,agentId:d.over};if(pe&&p)return{task:pe,agentId:o[p.index]?.id};if(h){let e=m.find(t=>t.id===h.taskId);if(e)return{task:e,agentId:h.agentId}}return null})(),J=S.current?.getBoundingClientRect(),ee=`${c}-hint`,Ae=!!p||o.length<=9,$e=(e,t)=>a("li",{"data-task":e.id,className:"ui-at-dlg__chip","data-running":t||void 0,"data-lifted":d?.started&&d.taskId===e.id?"":void 0,children:s("button",{type:"button",className:"ui-at-dlg__chip-btn",ref:n=>{n?B.current.set(e.id,n):B.current.delete(e.id)},"aria-describedby":ee,"aria-pressed":p?.taskId===e.id?!0:void 0,onPointerDown:n=>de(n,e),onKeyDown:n=>ue(n,e),children:[t?a(je,{}):null,e.tools?.length?a("span",{className:"ui-at-dlg__tools","aria-hidden":"true",children:e.tools.slice(0,3).map((n,r)=>a("span",{className:"ui-at-dlg__tool",children:n},r))}):null,a("span",{className:"ui-at-dlg__chip-title",children:e.title}),s("span",{className:"ui-at-dlg__sr",children:[", ~",e.estimate," min",t?", running":", queued"]})]})},e.id);return s("div",{ref:S,className:["ui-at-dlg",I].filter(Boolean).join(" "),"data-dragging":d?.started||void 0,children:[a("style",{href:"ui-delegate-board",precedence:"default",children:Ve}),s("div",{className:"ui-at-dlg__bar",children:[a("span",{className:"ui-at-dlg__mark",children:a(Ke,{})}),a("h3",{className:"ui-at-dlg__title",children:_}),a("span",{className:"ui-at-dlg__sub",children:L==="auto"?"New tasks go to whoever is free first":"Drag a task onto an agent"}),s("label",{className:"ui-at-dlg__auto",children:[a("span",{id:`${c}-auto`,children:"Auto"}),a("button",{type:"button",role:"switch","aria-checked":L==="auto","aria-labelledby":`${c}-auto`,className:"ui-at-dlg__switch",onClick:()=>Ie(L==="auto"?"manual":"auto"),children:a("span",{className:"ui-at-dlg__knob"})})]})]}),s("div",{className:"ui-at-dlg__panel",children:[s("section",{ref:le,className:"ui-at-dlg__pile","aria-labelledby":`${c}-pile`,"data-over":d?.started&&d.over===null?"":void 0,children:[s("h4",{className:"ui-at-dlg__label",id:`${c}-pile`,children:["Unassigned ",a("span",{className:"ui-at-dlg__count",children:K.length})]}),K.length?a("ul",{className:"ui-at-dlg__tasks",children:K.map(e=>a("li",{"data-task":e.id,className:"ui-at-dlg__task","data-lifted":d?.started&&d.taskId===e.id?"":void 0,"data-suggested":h?.taskId===e.id||void 0,"data-picked":p?.taskId===e.id||void 0,children:s("button",{type:"button",className:"ui-at-dlg__task-btn",ref:t=>{t?B.current.set(e.id,t):B.current.delete(e.id)},"aria-describedby":ee,"aria-pressed":p?.taskId===e.id?!0:void 0,onPointerDown:t=>de(t,e),onKeyDown:t=>ue(t,e),children:[a("span",{className:"ui-at-dlg__grip","aria-hidden":"true",children:a(Ue,{})}),a("span",{className:"ui-at-dlg__task-title",children:e.title}),s("span",{className:"ui-at-dlg__task-meta",children:[e.tools?.length?a("span",{className:"ui-at-dlg__tools","aria-hidden":"true",children:e.tools.slice(0,3).map((t,n)=>a("span",{className:"ui-at-dlg__tool",children:t},n))}):null,"~",e.estimate," min"]})]})},e.id))}):a("p",{className:"ui-at-dlg__empty",children:"Everything is handed out"})]}),s("section",{className:"ui-at-dlg__agents","aria-labelledby":`${c}-agents`,children:[s("div",{className:"ui-at-dlg__agents-head",children:[a("h4",{className:"ui-at-dlg__label",id:`${c}-agents`,children:"Agents"}),Ce?s("span",{className:"ui-at-dlg__total",children:[f(Te)," in queues"]}):null]}),a("ul",{className:"ui-at-dlg__rows",children:o.map((e,t)=>{let n=U(e.id),r=ie.get(e.id)??0,i=X&&X.agentId===e.id&&X.task.agentId!==e.id?ce(X.task,e):null,l=n.length>3?n.slice(3):[];return s("li",{ref:u=>{u?Z.current.set(e.id,u):Z.current.delete(e.id)},className:"ui-at-dlg__row","data-target":i?"":void 0,children:[a("span",{className:"ui-at-dlg__avatar","aria-hidden":"true",children:e.avatar??a("span",{className:"ui-at-dlg__initials",children:Xe(e.name)})}),s("div",{className:"ui-at-dlg__who",children:[s("div",{className:"ui-at-dlg__who-top",children:[s("span",{className:"ui-at-dlg__name",children:[Ae&&t<9?a("kbd",{className:"ui-at-dlg__num","data-show":p?"":void 0,"aria-hidden":"true",children:t+1}):null,e.name]}),a("span",{className:"ui-at-dlg__state",children:i?s(be,{children:[i.cost!=null?s("span",{className:"ui-at-dlg__plus",children:["+",f(i.cost)]}):null,s("span",{className:"ui-at-dlg__busy","data-kind":"preview",children:["+",i.add,"m until ",i.until]})]}):r?s("span",{className:"ui-at-dlg__busy",children:["Busy until ",_e(ne+r*xe)]}):a("span",{className:"ui-at-dlg__busy","data-kind":"free",children:"Free"})})]}),s("p",{className:"ui-at-dlg__model",children:[e.model,e.rate!=null?s("span",{className:"ui-at-dlg__rate",children:[f(e.rate),"/min"]}):null]}),n.length?s("ul",{className:"ui-at-dlg__queue","aria-label":`Queue of ${e.name}`,children:[n.slice(0,3).map((u,R)=>$e(u,R===0)),l.length?s("li",{className:"ui-at-dlg__more",children:[s("button",{type:"button",className:"ui-at-dlg__more-btn","aria-label":`${l.length} more: ${l.map(u=>u.title).join(", ")}`,"aria-describedby":`${c}-${e.id}-more`,children:["+",l.length]}),a("span",{role:"tooltip",id:`${c}-${e.id}-more`,className:"ui-at-dlg__tip",children:l.map(u=>s("span",{children:[u.title," \xB7 ~",u.estimate," min"]},u.id))})]}):null]}):null]})]},e.id)})})]})]}),H&&d&&J?s("div",{className:"ui-at-dlg__ghost","aria-hidden":"true",style:{width:d.w,left:d.x-d.dx-J.left,top:d.y-d.dy-J.top},children:[a("span",{className:"ui-at-dlg__task-title",children:H.title}),s("span",{className:"ui-at-dlg__task-meta",children:["~",H.estimate," min"]})]}):null,a("p",{id:ee,className:"ui-at-dlg__sr",children:"Drag onto an agent, or press Enter, choose with the arrow keys and press Enter again. Number keys hand it over at once."}),a("p",{className:"ui-at-dlg__sr",role:"status","aria-live":"polite",children:Ee})]})}var Ve=`
.ui-at-dlg {
  --frame: #f2f6fa; --panel: #ffffff; --soft: rgba(26, 62, 112, 0.06); --tray: #f2f6fa;
  --line: #dae2ec; --line-firm: #cbd6e4;
  --ink: #00162b; --text: rgba(0, 22, 43, 0.66); --muted: rgba(0, 22, 43, 0.54);
  --berry: #851437; --berry-hover: #6d0f2d;
  --info-ink: #1a3e70; --info-fill: #eef5ff; --info-line: #c1daff; --ring: #8fbdf2; --mark: #2f6fc4;
  --ok-ink: #1d6a34; --ok-fill: #eafbee; --ok-line: #c9f5cf;
  --tile: #ffffff; --secondary: #fbfcfe; --switch-off: #cbd6e4;
  --tip-bg: #00162b; --tip-ink: rgba(255, 255, 255, 0.92);
  --pebble-shade: inset 0 -2px 6px -4px rgba(26, 62, 112, 0.4);
  --drop: 0 8px 16px -8px rgba(26, 62, 112, 0.2);
  --raised: 0 18px 30px -16px rgba(26, 62, 112, 0.38), 0 4px 10px -6px rgba(26, 62, 112, 0.18);
  --float: 0 24px 48px -24px rgba(26, 62, 112, 0.3);
  --ease: cubic-bezier(.16, 1, .3, 1);
  box-sizing: border-box;
  position: relative;
  width: 100%;
  max-width: 720px;
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
:where(.dark, [data-theme="dark"]) .ui-at-dlg {
  --frame: #0f2747; --panel: #16345c; --soft: rgba(255, 255, 255, 0.07); --tray: rgba(3, 12, 28, 0.22);
  --line: rgba(255, 255, 255, 0.12); --line-firm: rgba(255, 255, 255, 0.18);
  --ink: rgba(255, 255, 255, 0.94); --text: rgba(255, 255, 255, 0.72); --muted: rgba(255, 255, 255, 0.56);
  --berry: #a8204d; --berry-hover: #bd2a5a;
  --info-ink: #c1daff; --info-fill: rgba(143, 189, 242, 0.16); --info-line: rgba(143, 189, 242, 0.34); --ring: rgba(143, 189, 242, 0.6); --mark: #8fbdf2;
  --ok-ink: #7fe0a0; --ok-fill: rgba(127, 224, 160, 0.14); --ok-line: rgba(127, 224, 160, 0.3);
  --tile: #ffffff; --secondary: rgba(255, 255, 255, 0.06); --switch-off: rgba(255, 255, 255, 0.2);
  --tip-bg: #071a33; --tip-ink: rgba(255, 255, 255, 0.92);
  --pebble-shade: inset 0 -2px 6px -4px rgba(3, 12, 28, 0.8);
  --drop: 0 8px 16px -8px rgba(3, 12, 28, 0.6);
  --raised: 0 18px 30px -16px rgba(3, 12, 28, 0.8), 0 4px 10px -6px rgba(3, 12, 28, 0.6);
  --float: 0 24px 48px -24px rgba(3, 12, 28, 0.7);
}
.ui-at-dlg *, .ui-at-dlg *::before, .ui-at-dlg *::after { box-sizing: border-box; }
.ui-at-dlg :where(button) { font: inherit; color: inherit; cursor: pointer; }
.ui-at-dlg :focus-visible { outline: none; box-shadow: 0 0 0 3px var(--ring); }
.ui-at-dlg__sr {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0;
}
.ui-at-dlg[data-dragging] { cursor: grabbing; user-select: none; -webkit-user-select: none; }

.ui-at-dlg__bar { display: flex; align-items: center; gap: 8px; padding: 10px 12px 12px 14px; min-height: 48px; }
.ui-at-dlg__mark { display: inline-flex; color: var(--mark); }
.ui-at-dlg__title {
  margin: 0; color: var(--ink); font-size: 16px; font-weight: 700; letter-spacing: 0;
  font-family: "Avenir Next Condensed", "Avenir Next", Avenir, system-ui, sans-serif;
}
.ui-at-dlg__sub { min-width: 0; flex: 1; font-size: 13px; color: var(--muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ui-at-dlg__auto { display: inline-flex; align-items: center; gap: 8px; font-size: 13.5px; color: var(--text); cursor: pointer; }
.ui-at-dlg__switch {
  position: relative; width: 34px; height: 20px; padding: 0; border-radius: 999px; border: 1px solid var(--line-firm);
  background: var(--switch-off); transition: background-color 150ms var(--ease), border-color 150ms var(--ease);
}
.ui-at-dlg__switch[aria-checked="true"] { background: var(--berry); border-color: var(--berry); }
.ui-at-dlg__knob {
  position: absolute; top: 1px; left: 1px; width: 16px; height: 16px; border-radius: 50%; background: #fff;
  box-shadow: 0 1px 3px rgba(0, 22, 43, 0.3); transition: transform 150ms var(--ease);
}
.ui-at-dlg__switch[aria-checked="true"] .ui-at-dlg__knob { transform: translateX(14px); }

.ui-at-dlg__panel {
  display: grid; grid-template-columns: minmax(0, 0.42fr) minmax(0, 0.58fr); gap: 12px; padding: 10px;
  background: var(--panel); border: 1px solid var(--line); border-radius: 16px; box-shadow: var(--raised);
}
.ui-at-dlg__pile {
  padding: 10px 6px 6px; border-radius: 12px; background: var(--tray); border: 1px solid var(--line);
  transition: background-color 150ms var(--ease), border-color 150ms var(--ease); min-height: 120px;
}
.ui-at-dlg__pile[data-over] { background: var(--info-fill); border-color: var(--info-line); }
.ui-at-dlg__label { margin: 0 0 8px 6px; display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 500; color: var(--muted); }
.ui-at-dlg__count {
  min-width: 18px; height: 18px; padding: 0 5px; display: inline-grid; place-items: center; border-radius: 6px;
  background: var(--panel); border: 1px solid var(--line); box-shadow: var(--pebble-shade);
  font-size: 11px; font-weight: 600; color: var(--text); font-variant-numeric: tabular-nums;
}
.ui-at-dlg__tasks { list-style: none; margin: 0; padding: 0; display: grid; gap: 6px; }
.ui-at-dlg__task { border-radius: 12px; }
.ui-at-dlg__task-btn {
  position: relative; width: 100%; display: grid; grid-template-columns: auto minmax(0, 1fr); column-gap: 8px; row-gap: 2px;
  padding: 9px 12px 9px 8px; border-radius: 12px; text-align: left; touch-action: none;
  background: var(--panel); border: 1px solid var(--line); box-shadow: var(--drop); cursor: grab;
  transition: border-color 150ms var(--ease), background-color 150ms var(--ease), opacity 150ms var(--ease);
}
.ui-at-dlg__task-btn:hover { border-color: var(--line-firm); }
.ui-at-dlg__task[data-suggested] .ui-at-dlg__task-btn, .ui-at-dlg__task[data-picked] .ui-at-dlg__task-btn {
  background: var(--info-fill); border-color: var(--info-line);
}
.ui-at-dlg__task[data-lifted] .ui-at-dlg__task-btn, .ui-at-dlg__chip[data-lifted] .ui-at-dlg__chip-btn { opacity: .35; }
.ui-at-dlg__grip { grid-row: 1 / 3; align-self: center; display: inline-flex; color: var(--muted); }
.ui-at-dlg__task-title { color: var(--ink); font-weight: 500; font-size: 14px; overflow-wrap: anywhere; }
.ui-at-dlg__task-meta { display: inline-flex; align-items: center; gap: 6px; font-size: 12.5px; color: var(--muted); font-variant-numeric: tabular-nums; }
.ui-at-dlg__empty {
  margin: 0; padding: 18px 10px; border-radius: 10px; border: 1px dashed var(--line-firm);
  text-align: center; font-size: 13px; color: var(--muted);
}

.ui-at-dlg__agents { min-width: 0; padding-top: 10px; }
.ui-at-dlg__agents-head { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; padding-right: 6px; }
.ui-at-dlg__total { font-size: 12.5px; color: var(--muted); font-variant-numeric: tabular-nums; }
.ui-at-dlg__rows { list-style: none; margin: 0; padding: 0; display: grid; gap: 2px; }
.ui-at-dlg__row {
  display: flex; gap: 10px; padding: 10px; border-radius: 12px; border: 1px solid transparent;
  transition: background-color 150ms var(--ease), border-color 150ms var(--ease);
}
.ui-at-dlg__row[data-target] { background: var(--info-fill); border-color: var(--info-line); }
.ui-at-dlg__avatar {
  flex: none; width: 32px; height: 32px; display: grid; place-items: center; border-radius: 50%; overflow: hidden;
  background: var(--tile); border: 1px solid var(--line); box-shadow: var(--pebble-shade);
}
.ui-at-dlg__avatar > svg, .ui-at-dlg__avatar > img { width: 16px; height: 16px; }
.ui-at-dlg__initials { font-size: 11px; font-weight: 700; color: #1a3e70; }
.ui-at-dlg__who { min-width: 0; flex: 1; }
.ui-at-dlg__who-top { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 4px 8px; min-height: 24px; }
.ui-at-dlg__name { display: inline-flex; align-items: center; gap: 6px; min-width: 0; color: var(--ink); font-weight: 600; font-size: 14px; }
.ui-at-dlg__num {
  display: none; min-width: 18px; height: 18px; padding: 0 4px; place-items: center; border-radius: 5px;
  background: var(--panel); border: 1px solid var(--line); border-bottom: 2px solid var(--line-firm);
  font: 600 10.5px/1 "Avenir Next", Avenir, system-ui, sans-serif; color: var(--muted);
}
.ui-at-dlg__num[data-show], .ui-at-dlg:has(.ui-at-dlg__task-btn:focus-visible, .ui-at-dlg__chip-btn:focus-visible) .ui-at-dlg__num { display: inline-grid; }
.ui-at-dlg__state { display: inline-flex; flex-wrap: wrap; align-items: center; gap: 4px 8px; margin-left: auto; }
.ui-at-dlg__plus { font-size: 12.5px; font-weight: 600; color: var(--info-ink); font-variant-numeric: tabular-nums; }
.ui-at-dlg__busy {
  height: 22px; display: inline-flex; align-items: center; padding: 0 8px; border-radius: 999px;
  background: var(--soft); border: 1px solid var(--line); font-size: 12px; font-weight: 500; color: var(--text);
  font-variant-numeric: tabular-nums; white-space: nowrap;
}
.ui-at-dlg__busy[data-kind="free"] { background: var(--ok-fill); border-color: var(--ok-line); color: var(--ok-ink); font-weight: 600; }
.ui-at-dlg__busy[data-kind="preview"] { background: var(--panel); border-color: var(--info-line); color: var(--info-ink); font-weight: 600; }
.ui-at-dlg__model { margin: 0; display: flex; flex-wrap: wrap; gap: 0 8px; font-size: 12.5px; color: var(--muted); }
.ui-at-dlg__rate { opacity: .85; font-variant-numeric: tabular-nums; }
.ui-at-dlg__queue { list-style: none; margin: 8px 0 0; padding: 0; display: flex; flex-wrap: wrap; gap: 6px; }
.ui-at-dlg__chip { min-width: 0; max-width: 100%; }
.ui-at-dlg__chip-btn {
  max-width: 100%; display: inline-flex; align-items: center; gap: 6px; height: 28px; padding: 0 10px; border-radius: 999px;
  background: var(--panel); border: 1px solid var(--line-firm); color: var(--text); font-size: 13px; touch-action: none; cursor: grab;
  transition: opacity 150ms var(--ease);
}
.ui-at-dlg__chip[data-running] .ui-at-dlg__chip-btn { background: var(--info-fill); border-color: var(--info-line); color: var(--info-ink); }
.ui-at-dlg__chip-title { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ui-at-dlg__spin { flex: none; animation: ui-at-dlg-spin 900ms linear infinite; }
@keyframes ui-at-dlg-spin { to { transform: rotate(360deg); } }
.ui-at-dlg__tools { display: inline-flex; flex: none; }
.ui-at-dlg__tool {
  width: 16px; height: 16px; display: inline-grid; place-items: center; border-radius: 4px;
  background: var(--tile); border: 1px solid var(--line);
}
.ui-at-dlg__tool + .ui-at-dlg__tool { margin-left: -3px; }
.ui-at-dlg__tool > svg, .ui-at-dlg__tool > img { width: 11px; height: 11px; }
.ui-at-dlg__more { position: relative; }
.ui-at-dlg__more-btn {
  height: 28px; min-width: 34px; padding: 0 8px; border-radius: 999px; border: 1px solid var(--line-firm);
  background: var(--soft); font-size: 12.5px; font-weight: 600; color: var(--text);
}
.ui-at-dlg__tip {
  position: absolute; z-index: 4; bottom: calc(100% + 6px); right: 0; width: max-content; max-width: 240px;
  display: none; flex-direction: column; gap: 2px; padding: 8px 10px; border-radius: 10px;
  background: var(--tip-bg); color: var(--tip-ink); font-size: 12px; box-shadow: var(--raised);
}
.ui-at-dlg__more:hover .ui-at-dlg__tip, .ui-at-dlg__more:focus-within .ui-at-dlg__tip { display: flex; }

.ui-at-dlg__ghost {
  position: absolute; z-index: 10; pointer-events: none; display: grid; gap: 2px; padding: 9px 12px 9px 26px;
  border-radius: 12px; background: var(--panel); border: 1px solid var(--line-firm); box-shadow: var(--raised);
  transform: rotate(-2deg) scale(1.03); transform-origin: 30% 50%;
}

@container (max-width: 560px) {
  .ui-at-dlg__panel { grid-template-columns: minmax(0, 1fr); }
  .ui-at-dlg__row { padding: 10px 6px; gap: 8px; }
  .ui-at-dlg__pile { min-height: 0; }
  .ui-at-dlg__sub { display: none; }
}
@media (pointer: coarse) {
  .ui-at-dlg__task-btn { padding-top: 12px; padding-bottom: 12px; }
  .ui-at-dlg__chip-btn, .ui-at-dlg__more-btn { height: 34px; }
}
@media (prefers-reduced-motion: reduce) {
  .ui-at-dlg *, .ui-at-dlg *::before, .ui-at-dlg *::after { transition-duration: 0ms !important; animation: none !important; }
  .ui-at-dlg__ghost { transform: none; }
}
`;var Ge=17e3,ae=(o,b)=>a("svg",{viewBox:"0 0 16 16",width:"16",height:"16","aria-hidden":"true",focusable:"false",style:{color:b},children:o}),ke=ae(a("path",{stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",d:"M8 2v12M2.8 5l10.4 6M2.8 11l10.4-6"}),"#c8553d"),Ze=ae(a("circle",{cx:"8",cy:"8",r:"5",fill:"none",stroke:"currentColor",strokeWidth:"1.8",strokeDasharray:"5 2.6"}),"#00162b"),Qe=ae(a("path",{fill:"currentColor",d:"M8 1.5c.5 3.6 2.9 6 6.5 6.5-3.6.5-6 2.9-6.5 6.5-.5-3.6-2.9-6-6.5-6.5 3.6-.5 6-2.9 6.5-6.5Z"}),"#3a6fd8"),C=(o,b)=>a("svg",{viewBox:"0 0 12 12",width:"11",height:"11","aria-hidden":"true",focusable:"false",style:{color:b},children:o}),we=C(s("g",{fill:"none",stroke:"currentColor",strokeWidth:"1.3",children:[a("circle",{cx:"3.5",cy:"3",r:"1.3"}),a("circle",{cx:"3.5",cy:"9",r:"1.3"}),a("circle",{cx:"8.5",cy:"4.5",r:"1.3"}),a("path",{d:"M3.5 4.3v3.4M8.5 5.8c0 2-5 1.4-5 1.9"})]}),"#00162b"),Je=C(a("path",{d:"M2 3h8v5H5L3 10V8H2z",fill:"currentColor"}),"#7a3fbf"),ye=C(a("path",{d:"M3 1.5h4l2 2v7H3z",fill:"none",stroke:"currentColor",strokeWidth:"1.3"}),"#00162b"),et=C(a("path",{d:"M2 10l1-3 5-5 2 2-5 5z",fill:"currentColor"}),"#d0402b"),tt=C(s("g",{fill:"currentColor",children:[a("circle",{cx:"4",cy:"4",r:"1.8"}),a("circle",{cx:"8.5",cy:"4.5",r:"1.5"}),a("path",{d:"M1 10c0-2 1.4-3.2 3-3.2S7 8 7 10zM6.8 10c0-1.6 1-2.6 1.9-2.6S11 8.4 11 10z"})]}),"#ff6a3d"),at=C(a("rect",{x:"1.5",y:"3",width:"9",height:"6",rx:"1.2",fill:"currentColor"}),"#635bff"),nt=[{id:"research",name:"Researcher",model:"Opus 5.5",avatar:ke,current:12,rate:.08},{id:"writer",name:"Writer",model:"Sonnet 5.5",avatar:ke,rate:.03},{id:"coder",name:"Coder",model:"GPT-6 Sol",avatar:Ze,current:8,rate:.06},{id:"ops",name:"Ops",model:"Gemini 3.8 Flash",avatar:Qe,rate:.01}],Ne=()=>[{id:"notes",title:"Write release notes",estimate:12,tools:[ye]},{id:"flaky",title:"Fix flaky checkout test",estimate:20,tools:[we]},{id:"churn",title:"Summarize churn calls",estimate:15,tools:[Je,ye]},{id:"pricing",title:"Update pricing page",estimate:10,tools:[et]},{id:"crm",title:"Clean up CRM duplicates",estimate:18,tools:[tt]},{id:"scan",title:"Competitor scan",estimate:25,agentId:"research"},{id:"auth",title:"Refactor auth",estimate:30,agentId:"coder"},{id:"stripe",title:"Upgrade payment SDK",estimate:20,tools:[at,we],agentId:"coder"}],it=(()=>{let o=new Date;return o.setHours(14,42,0,0),o.getTime()})();function rt(){let[o,b]=k(Ne),[N,w]=k("manual"),z=g(null),A=(h,x,f,_)=>{let c={x:0,y:0},D={x:0,y:0};_(f,()=>{let y=z.current?.querySelector(`[data-task="${h}"] button`),m=Array.from(z.current?.querySelectorAll(".ui-at-dlg__row")??[]).find(Y=>Y.textContent?.includes(x));if(!y||!m)return;let v=y.getBoundingClientRect(),$=m.getBoundingClientRect();c={x:v.left+30,y:v.top+v.height/2},D={x:$.left+$.width*.55,y:$.top+22},y.dispatchEvent(new PointerEvent("pointerdown",{bubbles:!0,pointerId:7,clientX:c.x,clientY:c.y,button:0,isPrimary:!0}))});let E=24;for(let y=1;y<=E;y++)_(f+120+y*34,()=>{let m=y/E,v=1-Math.pow(1-m,3);window.dispatchEvent(new PointerEvent("pointermove",{bubbles:!0,pointerId:7,clientX:c.x+(D.x-c.x)*v,clientY:c.y+(D.y-c.y)*v-Math.sin(m*Math.PI)*24}))});_(f+120+E*34+500,()=>window.dispatchEvent(new PointerEvent("pointerup",{bubbles:!0,pointerId:7,clientX:D.x,clientY:D.y})))};return M(()=>{let h=[],x=(_,I)=>h.push(window.setTimeout(I,_)),f=()=>{b(Ne()),w("manual"),A("notes","Writer",1200,x),A("flaky","Coder",3800,x),A("stripe","Ops",6400,x),x(9200,()=>w("auto")),x(Ge,f)};return f(),()=>h.forEach(_=>window.clearTimeout(_))},[]),a("div",{ref:z,style:{width:"100%",display:"grid",placeItems:"center"},children:a(ve,{agents:nt,tasks:o,now:it,mode:N,onModeChange:w,onAssign:(h,x)=>b(f=>{let _=f.find(I=>I.id===h);return _?[...f.filter(I=>I.id!==h),{..._,agentId:x}]:f})})})}export{rt as default};
