import{t as ve}from"./react-BkAXpnfr.js";var we=ve();var{Children:Pe,Component:He,Fragment:We,StrictMode:je,cloneElement:qe,createContext:Ke,createElement:Fe,createRef:Ue,forwardRef:Ze,isValidElement:Ge,lazy:Je,memo:Ye,startTransition:Qe,Suspense:Xe,use:et,useCallback:J,useContext:tt,useDebugValue:at,useDeferredValue:nt,useEffect:v,useId:Y,useImperativeHandle:it,useInsertionEffect:ot,useLayoutEffect:V,useMemo:Q,useOptimistic:rt,useReducer:st,useRef:w,useState:g,useSyncExternalStore:lt,useTransition:dt}=we;import{t as ke}from"./jsx-runtime-CTsRTJUX.js";var ye=ke(),{jsx:t,jsxs:i,Fragment:pt}=ye;var Ne=[{id:"needs",label:"Needs you"},{id:"running",label:"Running"},{id:"done",label:"Done"}],O=o=>o==="waiting"||o==="failed"?"needs":o==="running"?"running":"done",X={running:"Running",waiting:"Needs you",done:"Done",failed:"Failed"},Ae=520,Te=620,ee=o=>o instanceof Date?o.getTime():o;function te(o){let l=Math.max(0,Math.floor(o/1e3)),u=Math.floor(l/3600),s=Math.floor(l%3600/60),r=l%60;return u?`${u}h ${String(s).padStart(2,"0")}m`:s?`${s}m ${String(r).padStart(2,"0")}s`:`${r}s`}function Me(){let[o,l]=g(!1);return v(()=>{let u=window.matchMedia?.("(prefers-reduced-motion: reduce)");if(!u)return;let s=()=>l(u.matches);return s(),u.addEventListener?.("change",s),()=>u.removeEventListener?.("change",s)},[]),o}var R=({children:o,size:l=14})=>t("svg",{width:l,height:l,viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",focusable:"false",children:o}),P=()=>i("svg",{width:"12",height:"12",viewBox:"0 0 16 16","aria-hidden":"true",focusable:"false",children:[t("path",{fill:"currentColor",d:"M8 1.2c.35 2.9 1.9 4.45 4.8 4.8-2.9.35-4.45 1.9-4.8 4.8-.35-2.9-1.9-4.45-4.8-4.8 2.9-.35 4.45-1.9 4.8-4.8Z"}),t("path",{fill:"currentColor",opacity:".55",d:"M12.6 10.2c.15 1.2.8 1.85 2 2-1.2.15-1.85.8-2 2-.15-1.2-.8-1.85-2-2 1.2-.15 1.85-.8 2-2Z"})]}),Ce=()=>i(R,{size:12,children:[t("circle",{cx:"7",cy:"7",r:"4.2"}),t("path",{d:"m10.2 10.2 3.3 3.3"})]}),Re=()=>t(R,{size:12,children:t("path",{d:"M10.4 2.2a3.3 3.3 0 0 0-3.9 4.3L2.3 10.7a1.4 1.4 0 0 0 2 2l4.2-4.2a3.3 3.3 0 0 0 4.3-3.9l-2 2-1.9-.4-.4-1.9 1.9-2.1Z"})}),Se=()=>i(R,{children:[t("rect",{x:"2.5",y:"3",width:"4",height:"10",rx:"1.2"}),t("rect",{x:"9.5",y:"3",width:"4",height:"7",rx:"1.2"})]}),Ee=()=>t(R,{children:t("path",{d:"M3 4.5h10M3 8h10M3 11.5h10"})}),Ie=()=>i("svg",{className:"ui-at-inbox__spin",width:"12",height:"12",viewBox:"0 0 16 16","aria-hidden":"true",focusable:"false",children:[t("circle",{cx:"8",cy:"8",r:"5.6",fill:"none",stroke:"currentColor",strokeOpacity:".25",strokeWidth:"2"}),t("path",{d:"M8 2.4a5.6 5.6 0 0 1 5.6 5.6",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"})]}),De=()=>i("svg",{width:"12",height:"12",viewBox:"0 0 16 16","aria-hidden":"true",focusable:"false",children:[t("path",{fill:"currentColor",d:"M7.1 2.3a1 1 0 0 1 1.8 0l5.6 10.2a1 1 0 0 1-.9 1.5H2.4a1 1 0 0 1-.9-1.5L7.1 2.3Z"}),t("path",{stroke:"var(--wait-fill)",strokeWidth:"1.5",strokeLinecap:"round",d:"M8 6.2v3.1M8 11.4v.1"})]}),Le=()=>i("svg",{width:"12",height:"12",viewBox:"0 0 16 16","aria-hidden":"true",focusable:"false",children:[t("circle",{cx:"8",cy:"8",r:"6.5",fill:"currentColor"}),t("path",{stroke:"var(--bad-fill)",strokeWidth:"1.6",strokeLinecap:"round",d:"M8 4.8v3.6M8 11v.1"})]}),ze=()=>t("svg",{width:"8",height:"8",viewBox:"0 0 8 8","aria-hidden":"true",focusable:"false",children:t("circle",{cx:"4",cy:"4",r:"3",fill:"currentColor"})});function ae({tasks:o,onApprove:l,onReject:u,onRetry:s,onOpen:r,title:b="Agent inbox",action:m,view:x,defaultView:d="board",onViewChange:M,className:ie}){let H=Y(),S=Me(),W=w(null),[E,oe]=g({}),p=Q(()=>o.map(e=>E[e.id]?{...e,...E[e.id]}:e),[o,E]),[re,se]=g(d),le=x??re,[j,de]=g(!1);V(()=>{let e=W.current;if(!e)return;let a=()=>de(e.clientWidth<Te);if(a(),typeof ResizeObserver>"u")return;let n=new ResizeObserver(a);return n.observe(e),()=>n.disconnect()},[]);let I=j?"list":le,q=e=>{x===void 0&&se(e),M?.(e)},[ue,K]=g(()=>Date.now()),F=p.some(e=>(e.status==="running"||e.status==="waiting")&&ee(e.startedAt)!=null);v(()=>{if(!F)return;K(Date.now());let e=window.setInterval(()=>K(Date.now()),1e3);return()=>window.clearInterval(e)},[F]);let[D,U]=g(()=>Object.fromEntries(p.map(e=>[e.id,O(e.status)]))),k=w(new Map);v(()=>{let e={},a=!1;for(let n of p){let c=O(n.status),f=D[n.id];if(f===void 0)e[n.id]=c,a=!0;else if(f!==c){if(S)e[n.id]=c,a=!0;else if(!k.current.has(n.id)){let y=window.setTimeout(()=>{k.current.delete(n.id),U(h=>({...h,[n.id]:c}))},Ae);k.current.set(n.id,y)}}else k.current.has(n.id)&&(window.clearTimeout(k.current.get(n.id)),k.current.delete(n.id))}a&&U(n=>({...n,...e}))},[p,D,S]),v(()=>{let e=k.current;return()=>e.forEach(a=>window.clearTimeout(a))},[]);let C=w(new Map),L=w(null),ce=()=>{let e=new Map;return C.current.forEach((a,n)=>{let c=a.getBoundingClientRect();e.set(n,{x:c.left,y:c.top})}),e};typeof window<"u"&&C.current.size&&(L.current=ce()),V(()=>{let e=L.current;L.current=null,!(!e||S||document.hidden)&&C.current.forEach((a,n)=>{let c=e.get(n);if(!c||typeof a.animate!="function")return;a.getAnimations?.().forEach(N=>N.cancel());let f=a.getBoundingClientRect(),y=c.x-f.left,h=c.y-f.top;Math.abs(y)<1&&Math.abs(h)<1||a.animate([{transform:`translate(${y}px, ${h}px)`},{transform:"translate(0, 0)"}],{duration:460,easing:"cubic-bezier(.16, 1, .3, 1)"})})});let[A,z]=g(null),$=w(new Map);v(()=>{A&&!p.some(e=>e.id===A)&&z(null)},[p,A]);let B=J((e,a)=>{oe(n=>({...n,[e]:{...n[e],...a}}))},[]),pe=e=>l?l(e):B(e.id,{status:"running"}),be=e=>u?u(e):B(e.id,{status:"failed"}),xe=e=>s?s(e):B(e.id,{status:"running",startedAt:Date.now(),elapsed:void 0}),ge=e=>{if(e.key==="Escape"&&A){e.preventDefault();let a=A;z(null),$.current.get(a)?.focus()}},Z=p.filter(e=>e.status==="waiting"||e.status==="failed").length,me=p.filter(e=>e.status==="running").length,fe=`${Z} ${Z===1?"task needs":"tasks need"} you, ${me} running`,_e=e=>p.filter(a=>(D[a.id]??O(a.status))===e),he=e=>{let a=A===e.id,n=ee(e.startedAt),f=(e.status==="running"||e.status==="waiting")&&n!=null?te(ue-n):e.elapsed!=null?te(e.elapsed):null,y=`${H}-${e.id}-details`,h=e.steps??[],N=[];return e.status==="waiting"?N.push(t("button",{type:"button",className:"ui-at-inbox__btn",onClick:()=>be(e),children:"Reject"},"r"),t("button",{type:"button",className:"ui-at-inbox__btn ui-at-inbox__btn--main",onClick:()=>pe(e),children:"Approve"},"a")):e.status==="failed"?N.push(t("button",{type:"button",className:"ui-at-inbox__btn ui-at-inbox__btn--main",onClick:()=>xe(e),children:"Retry"},"t")):r&&N.push(t("button",{type:"button",className:"ui-at-inbox__btn",onClick:()=>r(e),children:"Open"},"o")),i("li",{className:"ui-at-inbox__card","data-status":e.status,"data-open":a||void 0,"data-task":e.id,ref:_=>{_?C.current.set(e.id,_):C.current.delete(e.id)},children:[i("button",{type:"button",className:"ui-at-inbox__head","aria-expanded":a,"aria-controls":y,ref:_=>{_?$.current.set(e.id,_):$.current.delete(e.id)},onClick:()=>z(a?null:e.id),children:[i("span",{className:"ui-at-inbox__title",children:[t("span",{className:"ui-at-inbox__mark",children:t(P,{})}),t("span",{className:"ui-at-inbox__name",children:e.title})]}),e.description?t("span",{className:"ui-at-inbox__desc",children:e.description}):null,i("span",{className:"ui-at-inbox__meta",children:[i("span",{className:"ui-at-inbox__pill","data-status":e.status,children:[e.status==="running"?t(Ie,{}):e.status==="waiting"?t(De,{}):e.status==="failed"?t(Le,{}):t(ze,{}),i("span",{className:"ui-at-inbox__sr",children:[X[e.status],", "]}),t("span",{className:"ui-at-inbox__clock","aria-hidden":e.status==="failed"?void 0:!0,children:e.status==="failed"?"Failed":f??X[e.status]}),e.status!=="failed"&&f?t("span",{className:"ui-at-inbox__sr",children:f}):null]}),i("span",{className:"ui-at-inbox__counts",children:[e.sources!=null?i("span",{className:"ui-at-inbox__count",title:`${e.sources} sources`,children:[t(Ce,{}),e.sources,t("span",{className:"ui-at-inbox__sr",children:" sources"})]}):null,e.tools!=null?i("span",{className:"ui-at-inbox__count",title:`${e.tools} tool calls`,children:[t(Re,{}),e.tools,t("span",{className:"ui-at-inbox__sr",children:" tool calls"})]}):null]})]})]}),t("div",{className:"ui-at-inbox__fold",id:y,inert:!a,children:t("div",{className:"ui-at-inbox__fold-in",children:i("div",{className:"ui-at-inbox__details",children:[t("p",{className:"ui-at-inbox__agent",children:e.agent}),h.length?t("ol",{className:"ui-at-inbox__steps","aria-label":`Last steps of ${e.title}`,children:h.map((_,G)=>i("li",{className:"ui-at-inbox__step","data-last":G===h.length-1||void 0,children:[t("span",{className:"ui-at-inbox__step-label",children:_.label}),_.time?t("span",{className:"ui-at-inbox__step-time",children:_.time}):null]},G))}):t("p",{className:"ui-at-inbox__nosteps",children:"No steps reported yet."}),N.length?t("div",{className:"ui-at-inbox__actions",children:N}):null]})})})]},e.id)};return i("div",{ref:W,className:["ui-at-inbox",ie].filter(Boolean).join(" "),"data-view":I,onKeyDown:ge,children:[t("style",{href:"ui-agent-inbox",precedence:"default",children:$e}),i("div",{className:"ui-at-inbox__bar",children:[i("p",{className:"ui-at-inbox__crumbs",children:[t("span",{className:"ui-at-inbox__crumb",children:"Agents"}),t("span",{className:"ui-at-inbox__slash","aria-hidden":"true",children:"/"}),t("span",{className:"ui-at-inbox__heading",children:b})]}),i("div",{className:"ui-at-inbox__tools",children:[m?t("button",{type:"button",className:"ui-at-inbox__btn ui-at-inbox__btn--main",onClick:m.onClick,children:m.label}):null,j?null:t("div",{className:"ui-at-inbox__switch",role:"radiogroup","aria-label":"Layout",children:["board","list"].map(e=>i("button",{type:"button",role:"radio","aria-checked":I===e,tabIndex:I===e?0:-1,className:"ui-at-inbox__seg",onClick:()=>q(e),onKeyDown:a=>{if(["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(a.key)){a.preventDefault();let n=e==="board"?"list":"board";q(n),a.currentTarget.parentElement?.querySelector(`[data-v="${n}"]`)?.focus()}},"data-v":e,children:[e==="board"?t(Se,{}):t(Ee,{}),e==="board"?"Board":"List"]},e))})]})]}),p.length===0?i("div",{className:"ui-at-inbox__empty",children:[t("span",{className:"ui-at-inbox__empty-mark",children:t(P,{})}),t("p",{className:"ui-at-inbox__empty-title",children:"No agent tasks yet"}),t("p",{className:"ui-at-inbox__empty-text",children:"Tasks your agents run in the background show up here."})]}):t("div",{className:"ui-at-inbox__cols",children:Ne.map(e=>{let a=_e(e.id),n=`${H}-${e.id}`;return i("section",{className:"ui-at-inbox__col","data-col":e.id,"aria-labelledby":n,children:[i("h3",{className:"ui-at-inbox__col-head",id:n,children:[t("span",{className:"ui-at-inbox__col-mark",children:t(P,{})}),e.label,t("span",{className:"ui-at-inbox__badge","aria-label":`${a.length} ${a.length===1?"task":"tasks"}`,children:a.length})]}),a.length?t("ul",{className:"ui-at-inbox__cards",children:a.map(he)}):t("p",{className:"ui-at-inbox__none",children:e.id==="needs"?"Nothing waits for you":e.id==="running"?"Nothing running":"Nothing finished yet"})]},e.id)})}),t("p",{className:"ui-at-inbox__sr",role:"status","aria-live":"polite",children:p.length?fe:""})]})}var $e=`
.ui-at-inbox {
  --frame: #f2f6fa; --panel: #ffffff; --soft: rgba(26, 62, 112, 0.06);
  --line: #dae2ec; --line-firm: #cbd6e4;
  --ink: #00162b; --text: rgba(0, 22, 43, 0.66); --muted: rgba(0, 22, 43, 0.54);
  --berry: #851437; --berry-hover: #6d0f2d;
  --info-ink: #1a3e70; --info-fill: #eef5ff; --info-line: #c1daff; --ring: #8fbdf2;
  --ok-ink: #1d6a34; --ok-fill: #eafbee; --ok-line: #c9f5cf;
  --wait-ink: #775810; --wait-fill: #fdf6dd; --wait-line: #fae6a0;
  --bad-ink: #8a3a22; --bad-fill: #fdeee8; --bad-line: #f5d5c9;
  --mark-run: #2f6fc4; --mark-wait: #c48a12; --mark-done: #2f9a52; --mark-bad: #c4472a;
  --secondary: #fbfcfe;
  --drop: 0 8px 16px -8px rgba(26, 62, 112, 0.2);
  --raised: 0 18px 30px -16px rgba(26, 62, 112, 0.38), 0 4px 10px -6px rgba(26, 62, 112, 0.18);
  --float: 0 24px 48px -24px rgba(26, 62, 112, 0.3);
  --ease: cubic-bezier(.16, 1, .3, 1);
  box-sizing: border-box;
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
  line-height: 1.5;
  text-align: left;
}
:where(.dark, [data-theme="dark"]) .ui-at-inbox {
  --frame: #0f2747; --panel: #16345c; --soft: rgba(255, 255, 255, 0.07);
  --line: rgba(255, 255, 255, 0.12); --line-firm: rgba(255, 255, 255, 0.18);
  --ink: rgba(255, 255, 255, 0.94); --text: rgba(255, 255, 255, 0.72); --muted: rgba(255, 255, 255, 0.56);
  --berry: #a8204d; --berry-hover: #bd2a5a;
  --info-ink: #c1daff; --info-fill: rgba(143, 189, 242, 0.16); --info-line: rgba(143, 189, 242, 0.34); --ring: rgba(143, 189, 242, 0.6);
  --ok-ink: #7fe0a0; --ok-fill: rgba(127, 224, 160, 0.14); --ok-line: rgba(127, 224, 160, 0.3);
  --wait-ink: #f3d27a; --wait-fill: rgba(243, 210, 122, 0.14); --wait-line: rgba(243, 210, 122, 0.3);
  --bad-ink: #f2a48c; --bad-fill: rgba(242, 164, 140, 0.14); --bad-line: rgba(242, 164, 140, 0.3);
  --mark-run: #8fbdf2; --mark-wait: #f3d27a; --mark-done: #7fe0a0; --mark-bad: #f2a48c;
  --secondary: rgba(255, 255, 255, 0.06);
  --drop: 0 8px 16px -8px rgba(3, 12, 28, 0.6);
  --raised: 0 18px 30px -16px rgba(3, 12, 28, 0.8), 0 4px 10px -6px rgba(3, 12, 28, 0.6);
  --float: 0 24px 48px -24px rgba(3, 12, 28, 0.7);
}
.ui-at-inbox *, .ui-at-inbox *::before, .ui-at-inbox *::after { box-sizing: border-box; }
.ui-at-inbox :where(button) { font: inherit; color: inherit; cursor: pointer; }
.ui-at-inbox :focus-visible { outline: none; box-shadow: 0 0 0 3px var(--ring); }
.ui-at-inbox__sr {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0;
}

.ui-at-inbox__bar {
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  padding: 10px 10px 10px 14px; min-height: 52px;
}
.ui-at-inbox__crumbs {
  margin: 0; min-width: 0; display: flex; align-items: baseline; gap: 8px;
  font-family: "Avenir Next Condensed", "Avenir Next", Avenir, system-ui, sans-serif; font-size: 17px;
}
.ui-at-inbox__crumb { color: var(--muted); font-weight: 500; }
.ui-at-inbox__slash { color: var(--muted); opacity: .6; }
.ui-at-inbox__heading {
  color: var(--ink); font-weight: 700; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.ui-at-inbox__tools { display: flex; align-items: center; gap: 8px; flex: none; }
.ui-at-inbox__switch {
  display: inline-flex; padding: 3px; gap: 2px; border-radius: 12px;
  background: var(--soft); border: 1px solid var(--line);
}
.ui-at-inbox__seg {
  display: inline-flex; align-items: center; gap: 6px; height: 30px; padding: 0 12px;
  border: 1px solid transparent; border-radius: 9px; background: transparent;
  color: var(--muted); font-size: 13.5px; font-weight: 500;
  transition: background-color 150ms var(--ease), color 150ms var(--ease), box-shadow 150ms var(--ease);
}
.ui-at-inbox__seg:hover { color: var(--ink); }
.ui-at-inbox__seg[aria-checked="true"] {
  background: var(--panel); color: var(--ink); font-weight: 600;
  border-color: var(--line); box-shadow: var(--drop);
}

.ui-at-inbox__cols { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px; }
.ui-at-inbox[data-view="list"] .ui-at-inbox__cols { grid-template-columns: minmax(0, 1fr); gap: 4px; }
.ui-at-inbox__col { min-width: 0; display: flex; flex-direction: column; }
.ui-at-inbox__col-head {
  margin: 0; display: flex; align-items: center; gap: 7px; padding: 6px 10px 8px;
  font-size: 13.5px; font-weight: 600; color: var(--ink); letter-spacing: 0;
}
.ui-at-inbox__col-mark { display: inline-flex; }
.ui-at-inbox__col[data-col="needs"] .ui-at-inbox__col-mark { color: var(--mark-wait); }
.ui-at-inbox__col[data-col="running"] .ui-at-inbox__col-mark { color: var(--mark-run); }
.ui-at-inbox__col[data-col="done"] .ui-at-inbox__col-mark { color: var(--mark-done); }
.ui-at-inbox__badge {
  display: inline-grid; place-items: center; min-width: 20px; height: 20px; padding: 0 6px;
  border-radius: 999px; background: var(--panel); border: 1px solid var(--line);
  box-shadow: inset 0 -2px 6px -4px rgba(26, 62, 112, 0.4);
  font-size: 11.5px; font-weight: 600; color: var(--text); font-variant-numeric: tabular-nums;
}
.ui-at-inbox__cards { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
.ui-at-inbox__none {
  margin: 0; padding: 14px 12px; border-radius: 14px; border: 1px dashed var(--line-firm);
  color: var(--muted); font-size: 13px; text-align: center;
}
.ui-at-inbox[data-view="list"] .ui-at-inbox__none { text-align: left; }

.ui-at-inbox__card {
  position: relative; background: var(--panel); border: 1px solid var(--line);
  border-radius: 16px; box-shadow: var(--raised); will-change: transform;
  transition: border-color 300ms var(--ease);
}
.ui-at-inbox__head {
  display: flex; flex-direction: column; gap: 6px; width: 100%; padding: 13px 14px 12px;
  background: transparent; border: 0; border-radius: 16px; text-align: left;
}
.ui-at-inbox__title { display: flex; align-items: flex-start; gap: 9px; min-width: 0; }
.ui-at-inbox__mark { display: inline-flex; margin-top: 4px; color: var(--mark-run); transition: color 300ms var(--ease); }
.ui-at-inbox__card[data-status="waiting"] .ui-at-inbox__mark { color: var(--mark-wait); }
.ui-at-inbox__card[data-status="done"] .ui-at-inbox__mark { color: var(--mark-done); }
.ui-at-inbox__card[data-status="failed"] .ui-at-inbox__mark { color: var(--mark-bad); }
.ui-at-inbox__name {
  min-width: 0; color: var(--ink); font-weight: 700; font-size: 16px; line-height: 1.3;
  font-family: "Avenir Next Condensed", "Avenir Next", Avenir, system-ui, sans-serif;
  overflow-wrap: anywhere;
}
.ui-at-inbox__desc {
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  font-size: 13.5px; line-height: 1.45; color: var(--text); overflow-wrap: anywhere;
}
.ui-at-inbox__meta { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-top: 4px; flex-wrap: wrap; }
.ui-at-inbox__pill {
  display: inline-flex; align-items: center; gap: 6px; height: 24px; padding: 0 10px;
  border-radius: 999px; border: 1px solid var(--info-line); background: var(--info-fill); color: var(--info-ink);
  font-size: 12.5px; font-weight: 600; font-variant-numeric: tabular-nums; white-space: nowrap;
  transition: background-color 300ms var(--ease), color 300ms var(--ease), border-color 300ms var(--ease);
}
.ui-at-inbox__pill[data-status="waiting"] { background: var(--wait-fill); color: var(--wait-ink); border-color: var(--wait-line); }
.ui-at-inbox__pill[data-status="done"] { background: var(--ok-fill); color: var(--ok-ink); border-color: var(--ok-line); }
.ui-at-inbox__pill[data-status="failed"] { background: var(--bad-fill); color: var(--bad-ink); border-color: var(--bad-line); }
.ui-at-inbox__spin { animation: ui-at-inbox-spin 900ms linear infinite; }
@keyframes ui-at-inbox-spin { to { transform: rotate(360deg); } }
.ui-at-inbox__counts { display: inline-flex; align-items: center; color: var(--muted); font-size: 12.5px; font-variant-numeric: tabular-nums; }
.ui-at-inbox__count { display: inline-flex; align-items: center; gap: 4px; padding: 0 8px; }
.ui-at-inbox__count + .ui-at-inbox__count { border-left: 1px solid var(--line); }
.ui-at-inbox__count:last-child { padding-right: 0; }

.ui-at-inbox__fold {
  display: grid; grid-template-rows: 0fr; opacity: 0;
  transition: grid-template-rows 300ms var(--ease), opacity 300ms var(--ease);
}
.ui-at-inbox__card[data-open] .ui-at-inbox__fold { grid-template-rows: 1fr; opacity: 1; }
.ui-at-inbox__fold-in { overflow: hidden; min-height: 0; }
.ui-at-inbox__details { margin: 0 14px; padding: 12px 0 14px; border-top: 1px solid var(--line); }
.ui-at-inbox__agent { margin: 0 0 8px; font-size: 12.5px; font-weight: 600; color: var(--muted); }
.ui-at-inbox__steps { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
.ui-at-inbox__step {
  position: relative; display: flex; justify-content: space-between; gap: 10px;
  padding-left: 14px; font-size: 13px; line-height: 1.45; color: var(--muted);
}
.ui-at-inbox__step::before {
  content: ""; position: absolute; left: 2px; top: 7px; width: 5px; height: 5px; border-radius: 50%;
  background: var(--line-firm);
}
.ui-at-inbox__step[data-last] { color: var(--ink); }
.ui-at-inbox__step[data-last]::before { background: var(--berry); }
.ui-at-inbox__step-label { min-width: 0; overflow-wrap: anywhere; }
.ui-at-inbox__step-time { flex: none; font-size: 12px; color: var(--muted); font-variant-numeric: tabular-nums; }
.ui-at-inbox__nosteps { margin: 0; font-size: 13px; color: var(--muted); }
.ui-at-inbox__actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 12px; flex-wrap: wrap; }

.ui-at-inbox__btn {
  display: inline-flex; align-items: center; justify-content: center; height: 32px; padding: 0 14px;
  border-radius: 10px; border: 1px solid var(--line-firm); background: var(--secondary);
  color: var(--ink); font-size: 13.5px; font-weight: 600; box-shadow: var(--drop);
  transition: background-color 150ms var(--ease), transform 150ms var(--ease);
}
.ui-at-inbox__btn:hover { background: var(--soft); }
.ui-at-inbox__btn:active { transform: translateY(1px); }
.ui-at-inbox .ui-at-inbox__btn--main {
  background: var(--berry); border-color: var(--berry); color: #fff;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 6px 12px -6px rgba(133, 20, 55, 0.6);
}
.ui-at-inbox .ui-at-inbox__btn--main:hover { background: var(--berry-hover); border-color: var(--berry-hover); }

.ui-at-inbox__empty {
  margin: 0 0 4px; padding: 36px 20px; text-align: center; background: var(--panel);
  border: 1px solid var(--line); border-radius: 16px; box-shadow: var(--raised);
}
.ui-at-inbox__empty-mark {
  display: inline-grid; place-items: center; width: 36px; height: 36px; border-radius: 12px;
  background: var(--panel); border: 1px solid var(--line); color: var(--mark-run);
  box-shadow: inset 0 -2px 6px -4px rgba(26, 62, 112, 0.4);
}
.ui-at-inbox__empty-title { margin: 12px 0 4px; color: var(--ink); font-weight: 600; }
.ui-at-inbox__empty-text { margin: 0; font-size: 13px; color: var(--muted); }

@media (pointer: coarse) {
  .ui-at-inbox__head { padding-top: 15px; padding-bottom: 14px; }
  .ui-at-inbox__btn { height: 40px; padding: 0 18px; }
  .ui-at-inbox__seg { height: 36px; }
}
@media (prefers-reduced-motion: reduce) {
  .ui-at-inbox *, .ui-at-inbox *::before, .ui-at-inbox *::after { transition-duration: 0ms !important; animation: none !important; }
}
`;var T=6e4;function ne(){let o=Date.now();return[{id:"migrate",title:"Migrate users table",description:"Split users into accounts and profiles on Postgres 17. The dry run on staging passed.",agent:"Opus 5.5",status:"running",startedAt:o-6*T,sources:9,tools:14,steps:[{label:"Read schema and 14 migrations",time:"6m ago"},{label:"Wrote migration 0042_split_users",time:"4m ago"},{label:"Dry run on staging \u2013 no errors",time:"2m ago"}]},{id:"crm",title:"Clean up CRM contacts",description:"Matched 1,312 likely duplicates, then the merge hit the API rate limit.",agent:"Haiku 5.5",status:"failed",elapsed:2*T+14e3,sources:2,tools:6,steps:[{label:"Loaded 18,240 contacts",time:"9m ago"},{label:"Matched 1,312 likely duplicates",time:"8m ago"},{label:"Merge stopped \u2013 API rate limit (429)",time:"7m ago"}]},{id:"review",title:"Review PR #448822",description:"Billing webhooks: reading the diff and the test run, writing comments.",agent:"Sonnet 5.5",status:"running",startedAt:o-(3*T+4e4),sources:12,tools:21,steps:[{label:"Read 12 changed files",time:"2m ago"},{label:"Ran the test suite \u2013 214 passed",time:"1m ago"},{label:"Writing review comments",time:"now"}]},{id:"notes",title:"Release notes v2.4",description:"Grouping 23 merged pull requests into features and fixes.",agent:"Sonnet 5.5",status:"running",startedAt:o-(T+18e3),sources:23,tools:5,steps:[{label:"Collected 23 merged pull requests",time:"1m ago"},{label:"Drafting the highlights",time:"now"}]},{id:"digest",title:"Weekly metrics digest",description:"Pulled numbers from three dashboards and posted the summary to #metrics.",agent:"Haiku 5.5",status:"done",elapsed:4*T+12e3,sources:3,tools:8,steps:[{label:"Pulled numbers from 3 dashboards",time:"22m ago"},{label:"Posted to #metrics",time:"18m ago"}]}]}var Be={label:"Wants to run it on production",time:"1m ago"};function Ve(){let[o,l]=g(ne),u=w(null),s=(r,b)=>l(m=>m.map(x=>x.id===r?{...x,...b(x)}:x));return v(()=>{let r=[],b=(d,M)=>r.push(window.setTimeout(M,d)),m=d=>u.current?.querySelector(`[data-task="${d}"]`),x=()=>{l(ne()),b(1600,()=>s("migrate",d=>({status:"waiting",steps:[...d.steps??[],Be]}))),b(2600,()=>{m("migrate")?.querySelector("button[aria-expanded='false']")?.click()}),b(5200,()=>{Array.from(m("migrate")?.querySelectorAll("button")??[]).find(M=>M.textContent==="Approve")?.click()}),b(6600,()=>{m("migrate")?.querySelector("button[aria-expanded='true']")?.click()}),b(9400,()=>s("migrate",d=>({status:"done",elapsed:6*T+48e3,tools:17,steps:[...(d.steps??[]).slice(0,3),{label:"Ran it on production \u2013 2.1M rows",time:"now"}]}))),b(13e3,x)};return x(),()=>r.forEach(d=>window.clearTimeout(d))},[]),t("div",{ref:u,style:{width:"100%",display:"grid",placeItems:"center"},children:t(ae,{tasks:o,onApprove:r=>s(r.id,()=>({status:"running"})),onReject:r=>s(r.id,()=>({status:"failed",elapsed:Date.now()-Number(r.startedAt??Date.now())})),onRetry:r=>s(r.id,()=>({status:"running",startedAt:Date.now(),elapsed:void 0})),onOpen:()=>{}})})}export{Ve as default};
