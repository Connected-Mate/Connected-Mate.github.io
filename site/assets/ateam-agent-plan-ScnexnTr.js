import{t as Be}from"./react-BkAXpnfr.js";var He=Be();var{Children:tt,Component:nt,Fragment:at,StrictMode:rt,cloneElement:it,createContext:ot,createElement:lt,createRef:st,forwardRef:pt,isValidElement:dt,lazy:ut,memo:ct,startTransition:ft,Suspense:gt,use:mt,useCallback:_t,useContext:xt,useDebugValue:bt,useDeferredValue:ht,useEffect:b,useId:ve,useImperativeHandle:vt,useInsertionEffect:yt,useLayoutEffect:ee,useMemo:kt,useOptimistic:wt,useReducer:St,useRef:g,useState:x,useSyncExternalStore:Mt,useTransition:Nt}=He;import{t as Ye}from"./jsx-runtime-CTsRTJUX.js";var Ke=Ye(),{jsx:n,jsxs:d,Fragment:U}=Ke;var ye="cubic-bezier(.16, 1, .3, 1)",Fe={pending:"Pending",active:"In progress",done:"Done",failed:"Failed"},ke=u=>`${(Math.max(0,u)/1e3).toFixed(1)}s`;function te(u){let f=Math.max(0,Math.round(u/1e3));return f<60?`${f}s`:`${Math.floor(f/60)}m ${String(f%60).padStart(2,"0")}s`}var je=0,Oe=()=>`step-${Date.now().toString(36)}-${(je++).toString(36)}`;function Ue(){let[u,f]=x(!1);return b(()=>{let i=window.matchMedia?.("(prefers-reduced-motion: reduce)");if(!i)return;let k=()=>f(i.matches);return k(),i.addEventListener?.("change",k),()=>i.removeEventListener?.("change",k)},[]),u}var W=({children:u,size:f=14})=>n("svg",{width:f,height:f,viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",focusable:"false",children:u}),We=()=>n(W,{size:12,children:n("path",{d:"M6 4h7M6 8h7M6 12h7M3 4h.01M3 8h.01M3 12h.01"})}),qe=()=>n("svg",{width:"10",height:"14",viewBox:"0 0 10 14","aria-hidden":"true",focusable:"false",children:[3,7,11].map(u=>d("g",{fill:"currentColor",children:[n("circle",{cx:"3",cy:u,r:"1.1"}),n("circle",{cx:"7",cy:u,r:"1.1"})]},u))}),Ge=()=>n(W,{size:12,children:n("path",{d:"M4 4l8 8M12 4l-8 8"})}),Ve=()=>n(W,{size:13,children:n("path",{d:"M8 3v10M3 8h10"})}),we=({size:u=14})=>n("svg",{className:"ui-at-plan__rays",width:u,height:u,viewBox:"0 0 16 16","aria-hidden":"true",focusable:"false",children:Array.from({length:8},(f,i)=>n("line",{x1:"8",y1:"1.8",x2:"8",y2:"4.6",stroke:"currentColor",strokeWidth:"1.7",strokeLinecap:"round",opacity:.25+i/8*.75,transform:`rotate(${i*45} 8 8)`},i))}),Se=()=>n("svg",{width:"12",height:"12",viewBox:"0 0 16 16","aria-hidden":"true",focusable:"false",children:n("path",{className:"ui-at-plan__check",d:"M3.5 8.4l3 3 6-6.6",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})}),Me=()=>n("svg",{width:"12",height:"12",viewBox:"0 0 16 16","aria-hidden":"true",focusable:"false",children:n("path",{d:"M8 4v5M8 11.6v.1",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"})}),Qe=()=>n(W,{size:12,children:n("path",{d:"M3 8a5 5 0 1 0 1.6-3.7M3 3v2.8h2.8"})});function Ne({steps:u,defaultSteps:f=[],status:i="draft",onChange:k,onRun:E,onCancel:P,onRetry:R,title:I,estimate:y,className:$}){let A=ve(),C=Ue(),[T,c]=x(f),a=u??T,s=i==="draft",_=e=>{u===void 0&&c(e),k?.(e)},[L,Ee]=x(""),S=e=>Ee(e),Y=g(new Map),K=g(new Map),w=g(null),M=g(null),ae=g(new Map),F=Date.now();i==="running"&&w.current===null&&(w.current=F),i==="running"&&(M.current=null),i==="done"&&w.current!==null&&M.current===null&&(M.current=F),i==="draft"&&(w.current=null,M.current=null);for(let e of a){let t=e.status??"pending",r=ae.current.get(e.id);if(t==="active"&&r!=="active"&&(Y.current.set(e.id,F),K.current.delete(e.id)),(t==="done"||t==="failed")&&r==="active"){let o=Y.current.get(e.id);o!=null&&K.current.set(e.id,F-o)}t==="pending"&&(Y.current.delete(e.id),K.current.delete(e.id))}ee(()=>{ae.current=new Map(a.map(e=>[e.id,e.status??"pending"]))});let re=i==="running",[,Pe]=x(0);b(()=>{if(!re)return;let e=window.setInterval(()=>Pe(t=>t+1),100);return()=>window.clearInterval(e)},[re]);let Re=e=>{let t=e.status??"pending";if(t==="active"){let r=Y.current.get(e.id);return r!=null?ke(Date.now()-r):null}if(t==="done"||t==="failed"){let r=e.duration??K.current.get(e.id);return r!=null?ke(r):null}return null},q=a.findIndex(e=>e.status==="active"),ie=a.findIndex(e=>e.status==="failed"),Ie=a.filter(e=>e.status==="done").length,G=g(new Map);b(()=>{if(i==="draft"){G.current.clear();return}a.forEach((e,t)=>{let r=e.status??"pending";G.current.get(e.id)!==r&&(G.current.set(e.id,r),r==="done"&&S(`Step ${t+1} done: ${e.title}`),r==="failed"&&S(`Step ${t+1} failed: ${e.title}${e.error?` \u2013 ${e.error}`:""}`))}),i==="done"&&w.current!=null&&M.current!=null&&S(`Plan done in ${te(M.current-w.current)}`)},[a,i]),b(()=>{i==="running"&&S("Running plan")},[i]);let h=g(new Map),V=g(null);if(typeof window<"u"&&h.current.size){let e=new Map;h.current.forEach((t,r)=>e.set(r,t.getBoundingClientRect().top)),V.current=e}ee(()=>{let e=V.current;V.current=null,!(!e||C||document.hidden)&&h.current.forEach((t,r)=>{let o=e.get(r);if(o==null||typeof t.animate!="function"||t.dataset.dragging)return;let m=o-t.getBoundingClientRect().top;Math.abs(m)<1||t.animate([{transform:`translateY(${m}px)`},{transform:"translateY(0)"}],{duration:300,easing:ye})})});let j=g(null);j.current===null&&(j.current=new Set(a.map(e=>e.id)));let oe=a.filter(e=>!j.current.has(e.id)).map(e=>e.id);b(()=>{oe.forEach(e=>j.current.add(e))});let[N,D]=x(null),[le,se]=x(new Set),[Q,B]=x(null),[pe,J]=x(""),Ce=g(null),de=g(null),ue=g([]);b(()=>()=>ue.current.forEach(e=>window.clearTimeout(e)),[]),b(()=>{Q&&(h.current.get(Q)?.focus(),B(null))},[Q]),b(()=>{N&&de.current?.select()},[N?.id]),b(()=>{s||D(null)},[s]);let ce=(e,t)=>{let r=a.findIndex(v=>v.id===e);if(r<0||t<0||t>=a.length||t===r)return;let o=a.slice(),[m]=o.splice(r,1);o.splice(t,0,m),_(o),S(`Moved '${m.title}' to position ${t+1} of ${a.length}`)},fe=e=>{let t=a.findIndex(l=>l.id===e),r=a[t];if(!r||le.has(e))return;let o=a[t+1]??a[t-1],m=()=>{se(l=>{let H=new Set(l);return H.delete(e),H}),_(a.filter(l=>l.id!==e)),S(`Removed '${r.title}'. ${a.length-1} steps left`),o&&B(o.id)},v=h.current.get(e);if(C||!v||typeof v.animate!="function")return m();se(l=>new Set(l).add(e));let z=v.offsetHeight;v.animate([{height:`${z}px`,opacity:1},{height:"0px",opacity:0,paddingTop:"0px",paddingBottom:"0px",marginBottom:"-2px"}],{duration:220,easing:ye,fill:"forwards"}),ue.current.push(window.setTimeout(m,220))},ge=()=>{if(!N)return;let e=N.text.trim(),t=a.find(r=>r.id===N.id);D(null),t&&e&&e!==t.title&&(_(a.map(r=>r.id===t.id?{...r,title:e}:r)),S(`Renamed to '${e}'`)),t&&B(t.id)},De=()=>{let e=pe.trim();e&&(_([...a,{id:Oe(),title:e,status:"pending"}]),J(""),S(`Added '${e}' as step ${a.length+1}`))},ze=(e,t,r)=>{if(e.target===e.currentTarget){if(e.key==="ArrowUp"||e.key==="ArrowDown"){e.preventDefault();let o=e.key==="ArrowUp"?r-1:r+1;s&&e.altKey?(ce(t.id,o),B(t.id)):a[o]&&h.current.get(a[o].id)?.focus();return}s&&(e.key==="Enter"?(e.preventDefault(),D({id:t.id,text:t.title})):(e.key==="Delete"||e.key==="Backspace")&&(e.preventDefault(),fe(t.id)))}},[p,X]=x(null),$e=(e,t,r)=>{if(!s||e.button!==0)return;let o=h.current.get(t.id);if(!o)return;e.preventDefault(),e.currentTarget.setPointerCapture(e.pointerId),X({id:t.id,from:r,to:r,dy:0,startY:e.clientY,height:o.offsetHeight+2,pointer:e.pointerId})},Ae=e=>{if(!p||e.pointerId!==p.pointer)return;let t=e.clientY-p.startY,r=a.filter(l=>l.id!==p.id),o=h.current.get(p.id);if(!o)return;let m=o.getBoundingClientRect(),v=m.top-(p.dy-t)+m.height/2,z=0;r.forEach(l=>{let H=h.current.get(l.id);if(!H)return;let he=H.getBoundingClientRect(),Te=_e(l.id),Le=he.top-Te+he.height/2;v>Le&&z++}),X({...p,dy:t,to:z})},me=e=>{if(!p||e.pointerId!==p.pointer)return;let{id:t,to:r,from:o}=p;X(null),r!==o&&ce(t,r)},_e=e=>{if(!p||e===p.id)return 0;let t=a.findIndex(r=>r.id===e);return p.from<p.to&&t>p.from&&t<=p.to?-p.height:p.from>p.to&&t>=p.to&&t<p.from?p.height:0},xe=w.current!=null?(M.current??(i==="running"?Date.now():w.current))-w.current:0,be=`${A}-hint`,Z=i==="running"&&ie>=0&&q<0,O;return s?O=d(U,{children:[n("span",{className:"ui-at-plan__hint",children:"Drag to reorder \xB7 double-click to rename"}),d("span",{className:"ui-at-plan__tray-actions",children:[P?n("button",{type:"button",className:"ui-at-plan__btn",onClick:P,children:"Cancel"}):null,n("button",{type:"button",className:"ui-at-plan__btn ui-at-plan__btn--main",disabled:!a.length,onClick:()=>E?.(a),children:"Run plan"})]})]}):i==="running"?O=d(U,{children:[d("span",{className:"ui-at-plan__state","data-kind":Z?"failed":"running",children:[Z?n("span",{className:"ui-at-plan__state-mark",children:n(Me,{})}):n(we,{size:13}),Z?`Stopped at step ${ie+1} of ${a.length}`:`Running \xB7 ${Math.min(a.length,(q>=0?q:Ie)+1)} of ${a.length}`]}),n("span",{className:"ui-at-plan__elapsed",children:te(xe)})]}):O=d(U,{children:[d("span",{className:"ui-at-plan__state","data-kind":"done",children:[n("span",{className:"ui-at-plan__state-mark",children:n(Se,{})}),"Done in ",te(xe)]}),E?n("button",{type:"button",className:"ui-at-plan__btn",onClick:()=>E(a),children:"Run again"}):null]}),d("div",{className:["ui-at-plan",$].filter(Boolean).join(" "),"data-status":i,"data-dragging":p?"":void 0,children:[n("style",{href:"ui-agent-plan",precedence:"default",children:Je}),d("div",{className:"ui-at-plan__panel",children:[d("div",{className:"ui-at-plan__head",children:[d("p",{className:"ui-at-plan__eyebrow",children:[n(We,{}),"Plan \xB7 ",a.length," ",a.length===1?"step":"steps"]}),s&&y?d("p",{className:"ui-at-plan__estimate",children:[n("span",{className:"ui-at-plan__sr",children:"Estimated time "}),y]}):null]}),I?n("h3",{className:"ui-at-plan__title",children:I}):null,n("p",{id:be,className:"ui-at-plan__sr",children:"Press Enter to rename, Alt plus arrow keys to move, Delete to remove."}),a.length===0?d("p",{className:"ui-at-plan__empty",children:["No steps yet",s?" \u2013 add the first one below.":"."]}):n("ol",{className:"ui-at-plan__list",ref:Ce,"aria-label":I??"Plan",children:a.map((e,t)=>{let r=e.status??"pending",o=Re(e),m=p?.id===e.id,v=m?p.dy:_e(e.id),z=N?.id===e.id;return d("li",{ref:l=>{l?h.current.set(e.id,l):h.current.delete(e.id)},className:"ui-at-plan__step","data-status":r,"data-new":oe.includes(e.id)||void 0,"data-leaving":le.has(e.id)||void 0,"data-dragging":m||void 0,"data-done-line":r==="done"||void 0,tabIndex:0,"aria-current":r==="active"?"step":void 0,"aria-describedby":s?be:void 0,style:v||m?{transform:`translateY(${v}px)`}:void 0,onKeyDown:l=>ze(l,e,t),onDoubleClick:()=>s&&D({id:e.id,text:e.title}),children:[s?n("span",{className:"ui-at-plan__grip","aria-hidden":"true",onPointerDown:l=>$e(l,e,t),onPointerMove:Ae,onPointerUp:me,onPointerCancel:me,children:n(qe,{})}):null,d("span",{className:"ui-at-plan__rail","aria-hidden":"true",children:[n("span",{className:"ui-at-plan__marker","data-status":r,children:r==="active"?n(we,{}):r==="done"?n(Se,{}):r==="failed"?n(Me,{}):t+1}),t<a.length-1?n("span",{className:"ui-at-plan__line"}):null]}),d("span",{className:"ui-at-plan__body",children:[z?n("input",{ref:de,className:"ui-at-plan__rename","aria-label":`Rename step ${t+1}`,value:N.text,onChange:l=>D({id:e.id,text:l.target.value}),onKeyDown:l=>{l.key==="Enter"?(l.preventDefault(),ge()):l.key==="Escape"&&(l.preventDefault(),D(null),B(e.id)),l.stopPropagation()},onBlur:ge}):n("span",{className:"ui-at-plan__name",children:e.title}),e.detail||e.tool?d("span",{className:"ui-at-plan__detail",children:[e.detail?n("span",{children:e.detail}):null,e.tool?n("code",{className:"ui-at-plan__tool",children:e.tool}):null]}):null,s?null:d("span",{className:"ui-at-plan__sr",children:[", ",Fe[r]]}),r==="failed"?d("span",{className:"ui-at-plan__error",children:[e.error?n("span",{children:e.error}):null,R&&i==="running"?d("button",{type:"button",className:"ui-at-plan__retry",onClick:()=>R(e.id),children:[n(Qe,{}),"Retry from here"]}):null]}):null]}),o?d("span",{className:"ui-at-plan__time",children:[r==="done"?n("span",{className:"ui-at-plan__sr",children:"took "}):null,o]}):null,s?n("button",{type:"button",className:"ui-at-plan__remove","aria-label":`Remove \u201C${e.title}\u201D`,onClick:()=>fe(e.id),children:n(Ge,{})}):null]},e.id)})}),n("div",{className:"ui-at-plan__fold","data-open":s||void 0,inert:!s,children:n("div",{className:"ui-at-plan__fold-in",children:d("label",{className:"ui-at-plan__add",children:[n("span",{className:"ui-at-plan__add-mark",children:n(Ve,{})}),n("input",{className:"ui-at-plan__add-input",placeholder:"Add step","aria-label":"Add step",value:pe,onChange:e=>J(e.target.value),onKeyDown:e=>{e.key==="Enter"?(e.preventDefault(),De()):e.key==="Escape"&&J("")}})]})})})]}),n("div",{className:"ui-at-plan__tray",children:O}),n("p",{className:"ui-at-plan__sr",role:"status","aria-live":"polite",children:L})]})}var Je=`
.ui-at-plan {
  --frame: #f2f6fa; --panel: #ffffff; --soft: rgba(26, 62, 112, 0.06);
  --line: #dae2ec; --line-firm: #cbd6e4;
  --ink: #00162b; --text: rgba(0, 22, 43, 0.66); --muted: rgba(0, 22, 43, 0.54);
  --berry: #851437; --berry-hover: #6d0f2d;
  --info-ink: #1a3e70; --info-fill: #eef5ff; --info-line: #c1daff; --ring: #8fbdf2;
  --ok-ink: #1d6a34; --ok-fill: #eafbee; --ok-line: #c9f5cf;
  --bad-ink: #8a3a22; --bad-fill: #fdeee8; --bad-line: #f5d5c9;
  --chip: #eef3f9; --chip-ink: #1a3e70; --done-fill: #e9eef5;
  --secondary: #fbfcfe;
  --pebble-shade: inset 0 -2px 6px -4px rgba(26, 62, 112, 0.4);
  --field-shade: inset 0 1px 2px rgba(26, 62, 112, 0.08);
  --drop: 0 8px 16px -8px rgba(26, 62, 112, 0.2);
  --raised: 0 18px 30px -16px rgba(26, 62, 112, 0.38), 0 4px 10px -6px rgba(26, 62, 112, 0.18);
  --float: 0 24px 48px -24px rgba(26, 62, 112, 0.3);
  --ease: cubic-bezier(.16, 1, .3, 1);
  box-sizing: border-box;
  width: 100%;
  max-width: 460px;
  padding: 6px;
  border-radius: 22px;
  background: var(--frame);
  border: 1px solid var(--line);
  box-shadow: var(--float);
  font-family: "Avenir Next", Avenir, system-ui, sans-serif;
  color: var(--text);
  font-size: 14px;
  line-height: 1.45;
  text-align: left;
  container-type: inline-size;
}
:where(.dark, [data-theme="dark"]) .ui-at-plan {
  --frame: #0f2747; --panel: #16345c; --soft: rgba(255, 255, 255, 0.07);
  --line: rgba(255, 255, 255, 0.12); --line-firm: rgba(255, 255, 255, 0.18);
  --ink: rgba(255, 255, 255, 0.94); --text: rgba(255, 255, 255, 0.72); --muted: rgba(255, 255, 255, 0.56);
  --berry: #a8204d; --berry-hover: #bd2a5a;
  --info-ink: #c1daff; --info-fill: rgba(143, 189, 242, 0.16); --info-line: rgba(143, 189, 242, 0.34); --ring: rgba(143, 189, 242, 0.6);
  --ok-ink: #7fe0a0; --ok-fill: rgba(127, 224, 160, 0.14); --ok-line: rgba(127, 224, 160, 0.3);
  --bad-ink: #f2a48c; --bad-fill: rgba(242, 164, 140, 0.14); --bad-line: rgba(242, 164, 140, 0.3);
  --chip: rgba(143, 189, 242, 0.12); --chip-ink: #c1daff; --done-fill: rgba(255, 255, 255, 0.1);
  --secondary: rgba(255, 255, 255, 0.06);
  --pebble-shade: inset 0 -2px 6px -4px rgba(3, 12, 28, 0.8);
  --field-shade: inset 0 1px 2px rgba(3, 12, 28, 0.4);
  --drop: 0 8px 16px -8px rgba(3, 12, 28, 0.6);
  --raised: 0 18px 30px -16px rgba(3, 12, 28, 0.8), 0 4px 10px -6px rgba(3, 12, 28, 0.6);
  --float: 0 24px 48px -24px rgba(3, 12, 28, 0.7);
}
.ui-at-plan *, .ui-at-plan *::before, .ui-at-plan *::after { box-sizing: border-box; }
.ui-at-plan :where(button) { font: inherit; color: inherit; cursor: pointer; }
.ui-at-plan :focus-visible { outline: none; box-shadow: 0 0 0 3px var(--ring); }
.ui-at-plan__sr {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0;
}

.ui-at-plan__panel {
  position: relative; background: var(--panel); border: 1px solid var(--line);
  border-radius: 16px; box-shadow: var(--raised); padding: 18px 18px 14px;
}
.ui-at-plan__head { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.ui-at-plan__eyebrow { margin: 0; display: inline-flex; align-items: center; gap: 6px; font-size: 12.5px; color: var(--muted); }
.ui-at-plan__estimate {
  margin: 0; height: 22px; display: inline-flex; align-items: center; padding: 0 8px; border-radius: 7px;
  background: var(--soft); border: 1px solid var(--line); font-size: 12px; font-weight: 600; color: var(--text);
}
.ui-at-plan__title {
  margin: 4px 0 12px; color: var(--ink); font-size: 18px; font-weight: 700; line-height: 1.25; letter-spacing: 0;
  font-family: "Avenir Next Condensed", "Avenir Next", Avenir, system-ui, sans-serif; overflow-wrap: anywhere;
}
.ui-at-plan__empty { margin: 4px 0 8px; color: var(--muted); font-size: 13.5px; }

.ui-at-plan__list { list-style: none; margin: 0 -8px; padding: 0; display: flex; flex-direction: column; gap: 2px; }
.ui-at-plan__step {
  position: relative; display: flex; align-items: flex-start; gap: 10px; padding: 6px 8px 8px 22px;
  border-radius: 12px; outline: none; background: transparent;
  transition: background-color 150ms var(--ease), opacity 220ms var(--ease);
}
.ui-at-plan[data-dragging] .ui-at-plan__step:not([data-dragging]) { transition: transform 220ms var(--ease); }
.ui-at-plan[data-status="draft"] .ui-at-plan__step:hover { background: var(--soft); }
.ui-at-plan__step:focus-visible { box-shadow: 0 0 0 3px var(--ring); }
.ui-at-plan__step[data-dragging] {
  z-index: 3; background: var(--panel); box-shadow: var(--raised); border-radius: 12px; cursor: grabbing;
}
.ui-at-plan__step[data-new] { animation: ui-at-plan-in 300ms var(--ease); }
@keyframes ui-at-plan-in { from { opacity: 0; transform: translateY(8px); } }
.ui-at-plan__step[data-leaving] { overflow: hidden; pointer-events: none; }

.ui-at-plan__grip {
  position: absolute; left: 4px; top: 10px; width: 16px; height: 20px; display: grid; place-items: center;
  color: var(--muted); cursor: grab; opacity: 0; touch-action: none; transition: opacity 150ms var(--ease);
}
.ui-at-plan__step:hover .ui-at-plan__grip, .ui-at-plan__step:focus-visible .ui-at-plan__grip, .ui-at-plan__step[data-dragging] .ui-at-plan__grip { opacity: 1; }

.ui-at-plan__rail { position: relative; flex: none; width: 22px; align-self: stretch; display: flex; flex-direction: column; align-items: center; }
.ui-at-plan__marker {
  position: relative; z-index: 1; width: 22px; height: 22px; margin-top: 1px; border-radius: 50%;
  display: grid; place-items: center; background: var(--panel); border: 1px solid var(--line-firm);
  font-size: 11.5px; font-weight: 600; color: var(--muted); font-variant-numeric: tabular-nums;
  transition: background-color 300ms var(--ease), border-color 300ms var(--ease), color 300ms var(--ease);
}
.ui-at-plan__marker[data-status="active"] { border-color: transparent; background: transparent; color: var(--info-ink); }
.ui-at-plan__marker[data-status="done"] { background: var(--done-fill); border-color: var(--line); color: var(--ink); }
.ui-at-plan__marker[data-status="failed"] { background: var(--bad-fill); border-color: var(--bad-line); color: var(--bad-ink); }
.ui-at-plan__rays { animation: ui-at-plan-spin 1s steps(8) infinite; }
@keyframes ui-at-plan-spin { to { transform: rotate(360deg); } }
.ui-at-plan__check { stroke-dasharray: 16; stroke-dashoffset: 0; animation: ui-at-plan-draw 360ms var(--ease) both; }
@keyframes ui-at-plan-draw { from { stroke-dashoffset: 16; } }
.ui-at-plan__line {
  position: absolute; top: 25px; bottom: -11px; left: 50%; width: 1.5px; margin-left: -0.75px;
  background: var(--line); border-radius: 1px; overflow: hidden;
}
.ui-at-plan__line::after {
  content: ""; position: absolute; inset: 0; background: var(--berry);
  transform: scaleY(0); transform-origin: top; transition: transform 420ms var(--ease);
}
.ui-at-plan__step[data-done-line] .ui-at-plan__line::after { transform: scaleY(1); }
.ui-at-plan[data-status="draft"] .ui-at-plan__line { opacity: .7; }

.ui-at-plan__body { min-width: 0; flex: 1; display: flex; flex-direction: column; gap: 2px; }
.ui-at-plan__name { color: var(--ink); font-size: 15px; line-height: 1.45; overflow-wrap: anywhere; }
.ui-at-plan__step[data-status="pending"] .ui-at-plan__name { color: var(--text); }
.ui-at-plan[data-status="draft"] .ui-at-plan__step .ui-at-plan__name { color: var(--ink); }
.ui-at-plan__step[data-status="active"] .ui-at-plan__name { font-weight: 600; }
.ui-at-plan__detail { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 8px; font-size: 13px; color: var(--muted); }
.ui-at-plan__detail > span { overflow-wrap: anywhere; }
.ui-at-plan__tool {
  height: 20px; display: inline-flex; align-items: center; padding: 0 6px; border-radius: 6px;
  background: var(--chip); color: var(--chip-ink); white-space: nowrap;
  font: 500 11.5px/1 ui-monospace, "SF Mono", Menlo, monospace;
}
.ui-at-plan__error { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 10px; margin-top: 4px; font-size: 13px; color: var(--bad-ink); }
.ui-at-plan__retry {
  display: inline-flex; align-items: center; gap: 5px; height: 26px; padding: 0 10px; border-radius: 8px;
  background: var(--bad-fill); border: 1px solid var(--bad-line); color: var(--bad-ink) !important;
  font-size: 12.5px; font-weight: 600; transition: background-color 150ms var(--ease);
}
.ui-at-plan__retry:hover { background: var(--panel); }
.ui-at-plan__time { flex: none; margin-top: 2px; font-size: 12.5px; color: var(--muted); font-variant-numeric: tabular-nums; }
.ui-at-plan__step[data-status="active"] .ui-at-plan__time { color: var(--ink); }
.ui-at-plan__remove {
  flex: none; width: 26px; height: 26px; margin: -1px -2px 0 0; display: grid; place-items: center;
  border: 0; border-radius: 8px; background: transparent; color: var(--muted); opacity: 0;
  transition: opacity 150ms var(--ease), background-color 150ms var(--ease);
}
.ui-at-plan__step:hover .ui-at-plan__remove, .ui-at-plan__step:focus-within .ui-at-plan__remove { opacity: 1; }
.ui-at-plan__remove:hover { background: var(--bad-fill); color: var(--bad-ink); }
.ui-at-plan__rename {
  width: 100%; height: 30px; margin: -3px 0 -1px -6px; padding: 0 6px; border-radius: 8px;
  border: 1px solid var(--line-firm); background: var(--panel); color: var(--ink); caret-color: var(--berry);
  font: inherit; font-size: 15px; box-shadow: var(--field-shade); outline: none;
}
.ui-at-plan__rename:focus { box-shadow: 0 0 0 3px var(--ring); }

.ui-at-plan__fold { display: grid; grid-template-rows: 0fr; opacity: 0; transition: grid-template-rows 300ms var(--ease), opacity 300ms var(--ease); }
.ui-at-plan__fold[data-open] { grid-template-rows: 1fr; opacity: 1; }
.ui-at-plan__fold-in { overflow: hidden; min-height: 0; }
.ui-at-plan__add {
  display: flex; align-items: center; gap: 8px; margin: 10px 0 2px; height: 38px; padding: 0 10px;
  border-radius: 10px; border: 1px dashed var(--line-firm); background: transparent; cursor: text;
  transition: border-color 150ms var(--ease), background-color 150ms var(--ease);
}
.ui-at-plan__add:focus-within { border-style: solid; border-color: var(--line-firm); background: var(--panel); box-shadow: 0 0 0 3px var(--ring), var(--field-shade); }
.ui-at-plan__add-mark { display: inline-flex; color: var(--muted); }
.ui-at-plan__add-input {
  flex: 1; min-width: 0; height: 100%; border: 0; background: transparent; outline: none;
  font: inherit; font-size: 14px; color: var(--ink); caret-color: var(--berry);
}
.ui-at-plan__add-input::placeholder { color: var(--muted); }

.ui-at-plan__tray { display: flex; align-items: center; justify-content: space-between; gap: 10px; min-height: 50px; padding: 8px 8px 6px 12px; }
.ui-at-plan__hint { font-size: 12.5px; color: var(--muted); }
.ui-at-plan__tray-actions { display: flex; gap: 8px; margin-left: auto; }
.ui-at-plan__state { display: inline-flex; align-items: center; gap: 8px; font-size: 13.5px; color: var(--ink); font-weight: 500; }
.ui-at-plan__state[data-kind="running"] { color: var(--info-ink); }
.ui-at-plan__state-mark { width: 18px; height: 18px; display: grid; place-items: center; border-radius: 50%; }
.ui-at-plan__state[data-kind="done"] .ui-at-plan__state-mark { background: var(--ok-fill); color: var(--ok-ink); border: 1px solid var(--ok-line); }
.ui-at-plan__state[data-kind="failed"] { color: var(--bad-ink); }
.ui-at-plan__state[data-kind="failed"] .ui-at-plan__state-mark { background: var(--bad-fill); border: 1px solid var(--bad-line); }
.ui-at-plan__elapsed { font-size: 12.5px; color: var(--muted); font-variant-numeric: tabular-nums; }
.ui-at-plan__btn {
  height: 34px; padding: 0 14px; border-radius: 10px; border: 1px solid var(--line-firm);
  background: var(--secondary); color: var(--ink); font-size: 13.5px; font-weight: 600; box-shadow: var(--drop);
  transition: background-color 150ms var(--ease), transform 150ms var(--ease);
}
.ui-at-plan__btn:hover { background: var(--soft); }
.ui-at-plan__btn:active { transform: translateY(1px); }
.ui-at-plan__btn:disabled { opacity: .5; cursor: not-allowed; }
.ui-at-plan .ui-at-plan__btn--main {
  background: var(--berry); border-color: var(--berry); color: #fff;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 6px 12px -6px rgba(133, 20, 55, 0.6);
}
.ui-at-plan .ui-at-plan__btn--main:hover:not(:disabled) { background: var(--berry-hover); }

@container (max-width: 400px) { .ui-at-plan__hint { display: none; } }
@container (max-width: 340px) {
  .ui-at-plan__panel { padding: 14px 12px 12px; }
  .ui-at-plan__tray { padding-left: 8px; }
}
@media (pointer: coarse) {
  .ui-at-plan__grip, .ui-at-plan__remove { opacity: 1; }
  .ui-at-plan__btn { height: 40px; }
}
@media (prefers-reduced-motion: reduce) {
  .ui-at-plan *, .ui-at-plan *::before, .ui-at-plan *::after { transition-duration: 0ms !important; animation: none !important; }
}
`;var ne=[{id:"revenue",title:"Pull Q3 revenue and ARR",detail:"Monthly revenue, ARR and net retention",tool:"stripe.query"},{id:"launches",title:"Summarize product launches",detail:"Shipped projects and adoption",tool:"linear.search"},{id:"slides",title:"Build the KPI slides",detail:"Six charts in the board template",tool:"slides.create"},{id:"memo",title:"Draft the board memo",detail:"One page, wins, risks and asks",tool:"docs.write"},{id:"send",title:"Send the draft to Maya for review",tool:"gmail.draft"}],Xe=2e3;function Ze(){let[u,f]=x(ne),[i,k]=x("draft"),E=g(null),P=g([]),R=g(!1),I=g(u);I.current=u;let y=(c,a)=>P.current.push(window.setTimeout(a,c)),$=()=>{P.current.forEach(c=>window.clearTimeout(c)),P.current=[]},A=c=>Array.from(E.current?.querySelectorAll("button")??[]).find(a=>a.textContent?.trim()===c)?.click(),C=c=>{f(a=>a.map((s,_)=>_===c?{...s,status:"active"}:s)),y(Xe,()=>{let a=I.current[c]?.id==="slides"&&!R.current;f(s=>s.map((_,L)=>L===c?a?{..._,status:"failed",error:"Slides API timed out after 30s"}:{..._,status:"done",error:void 0}:_)),a?(R.current=!0,y(2200,()=>A("Retry from here"))):c+1<ne.length?C(c+1):(k("done"),y(4200,()=>A("Run again")))})},T=()=>{$(),R.current=!1,k("draft"),f(ne.map(c=>({...c}))),y(1600,()=>f(c=>{let a=c.slice(),[s]=a.splice(3,1);return a.splice(2,0,s),a})),y(3600,()=>A("Run plan"))};return b(()=>(T(),$),[]),n("div",{ref:E,style:{width:"100%",display:"grid",placeItems:"center"},children:n(Ne,{title:"Prepare the Q3 board update",estimate:"~2 min",steps:u,status:i,onChange:f,onRun:c=>{if(i==="done")return T();$(),f(c.map(a=>({...a,status:"pending",error:void 0}))),k("running"),y(500,()=>C(0))},onCancel:()=>T(),onRetry:c=>{let a=u.findIndex(s=>s.id===c);f(s=>s.map((_,L)=>L>=a?{..._,status:"pending",error:void 0}:_)),y(300,()=>C(a))}})})}export{Ze as default};
