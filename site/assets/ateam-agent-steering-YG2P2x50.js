import{t as xe}from"./react-BkAXpnfr.js";var ge=xe();var{Children:Pe,Component:He,Fragment:Be,StrictMode:Ie,cloneElement:Oe,createContext:Ke,createElement:We,createRef:Qe,forwardRef:Fe,isValidElement:je,lazy:Ve,memo:Ze,startTransition:Ue,Suspense:Ge,use:Je,useCallback:Ye,useContext:Xe,useDebugValue:et,useDeferredValue:tt,useEffect:y,useId:Y,useImperativeHandle:at,useInsertionEffect:rt,useLayoutEffect:$,useMemo:nt,useOptimistic:it,useReducer:st,useRef:f,useState:x,useSyncExternalStore:ot,useTransition:dt}=ge;import{t as me}from"./jsx-runtime-CTsRTJUX.js";var _e=me(),{jsx:t,jsxs:n,Fragment:pt}=_e;var be=620,he="cubic-bezier(.16, 1, .3, 1)",X=p=>p instanceof Date?p.getTime():p,ee=p=>`${(Math.max(0,p)/1e3).toFixed(1)}s`;function te(p){let l=Math.max(0,Math.floor(p/1e3)),d=Math.floor(l/3600),u=Math.floor(l%3600/60);return d?`${d}h ${String(u).padStart(2,"0")}m`:`${u}m ${String(l%60).padStart(2,"0")}s`}function ve(){let[p,l]=x(!1);return y(()=>{let d=window.matchMedia?.("(prefers-reduced-motion: reduce)");if(!d)return;let u=()=>l(d.matches);return u(),d.addEventListener?.("change",u),()=>d.removeEventListener?.("change",u)},[]),p}var we=()=>typeof navigator<"u"&&/Mac|iPhone|iPad/.test(navigator.platform||navigator.userAgent),I=({children:p,size:l=14})=>t("svg",{width:l,height:l,viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",focusable:"false",children:p}),ke=()=>n("svg",{width:"14",height:"14",viewBox:"0 0 16 16","aria-hidden":"true",focusable:"false",children:[t("path",{fill:"currentColor",d:"M8 1.2c.35 2.9 1.9 4.45 4.8 4.8-2.9.35-4.45 1.9-4.8 4.8-.35-2.9-1.9-4.45-4.8-4.8 2.9-.35 4.45-1.9 4.8-4.8Z"}),t("path",{fill:"currentColor",opacity:".55",d:"M12.6 10.2c.15 1.2.8 1.85 2 2-1.2.15-1.85.8-2 2-.15-1.2-.8-1.85-2-2 1.2-.15 1.85-.8 2-2Z"})]}),ye=()=>t(I,{size:12,children:t("path",{d:"M5.5 3.5v9M10.5 3.5v9",strokeWidth:"2"})}),Ne=()=>t("svg",{width:"12",height:"12",viewBox:"0 0 16 16","aria-hidden":"true",focusable:"false",children:t("path",{fill:"currentColor",d:"M5 3.2v9.6a.6.6 0 0 0 .9.5l7.4-4.8a.6.6 0 0 0 0-1L5.9 2.7a.6.6 0 0 0-.9.5Z"})}),Se=()=>t("svg",{width:"11",height:"11",viewBox:"0 0 16 16","aria-hidden":"true",focusable:"false",children:t("path",{fill:"currentColor",d:"M9.2 1.5 3.5 9h3.8l-.9 5.5L12.5 7H8.6l.6-5.5Z"})}),Me=()=>t(I,{size:11,children:t("path",{d:"M4 4l8 8M12 4l-8 8"})}),Ee=()=>t(I,{size:13,children:t("path",{d:"M8 13V3.5M4 7.5l4-4 4 4",strokeWidth:"1.8"})}),ae=()=>t(I,{size:11,children:t("path",{d:"M12.5 3.5v4.5a2 2 0 0 1-2 2H4M6.5 7.5 4 10l2.5 2.5"})}),De=()=>n("svg",{width:"16",height:"16",viewBox:"0 0 16 16","aria-hidden":"true",focusable:"false",children:[t("circle",{cx:"8",cy:"8",r:"7",fill:"currentColor"}),t("path",{className:"ui-at-steer__tick",d:"M4.8 8.3l2.2 2.1 4.2-4.6",fill:"none",stroke:"var(--on-ink)",strokeWidth:"1.7",strokeLinecap:"round",strokeLinejoin:"round"})]}),Ae=()=>n("svg",{className:"ui-at-steer__spin",width:"16",height:"16",viewBox:"0 0 16 16","aria-hidden":"true",focusable:"false",children:[t("circle",{cx:"8",cy:"8",r:"6.2",fill:"none",stroke:"currentColor",strokeOpacity:".25",strokeWidth:"1.8"}),t("path",{d:"M8 1.8a6.2 6.2 0 0 1 0 12.4",fill:"none",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"})]}),Re=()=>t("svg",{width:"16",height:"16",viewBox:"0 0 16 16","aria-hidden":"true",focusable:"false",children:t("circle",{cx:"8",cy:"8",r:"6.2",fill:"none",stroke:"currentColor",strokeWidth:"1.3",strokeDasharray:"2.2 2.4"})});function re({title:p,agent:l,steps:d,queue:u=[],status:g="running",startedAt:N,onQueue:O,onInterrupt:h,onRemove:q,onPause:S,onResume:A,draft:k,onDraftChange:R,placeholder:L="Steer the agent\u2026",className:_}){let M=Y(),K=ve(),[C,W]=x(""),v=k??C,s=e=>{k===void 0&&W(e),R?.(e)},[r,i]=x(()=>Date.now());y(()=>{if(g!=="running")return;i(Date.now());let e=window.setInterval(()=>i(Date.now()),100);return()=>window.clearInterval(e)},[g]);let b=f(null);g==="running"?b.current=null:b.current===null&&(b.current=Date.now());let c=g==="running"?Math.max(r,Date.now()):b.current??r,m=X(N),T=d.findIndex(e=>e.status==="active"),ie=d.filter(e=>e.status==="done").length,se=T>=0?T+1:Math.min(d.length,ie+1),[oe,V]=x(""),P=f(null),H=f(null);y(()=>{let e=d.flatMap(a=>(a.notes??[]).filter(o=>o.picked).map(o=>o));if(P.current===null||H.current===null){P.current=new Set(e.map(a=>a.id)),H.current=new Set(u.map(a=>a.id));return}for(let a of u)H.current.has(a.id)||(H.current.add(a.id),V(`Queued for the next step: ${a.text}`));for(let a of e)P.current.has(a.id)||(P.current.add(a.id),V(a.picked==="now"?`Interrupted with: ${a.text}`:`${l??"The agent"} picked up: ${a.text}`))},[d,u,l]);let B=f(null),Q=f(null);if(typeof window<"u"&&B.current){let e=new Map;B.current.querySelectorAll("[data-note]").forEach(a=>{e.set(`${a.dataset.where}:${a.dataset.note}`,a.getBoundingClientRect())}),Q.current=e}$(()=>{let e=Q.current;Q.current=null;let a=B.current;!e||!a||a.querySelectorAll('[data-where="step"]').forEach(o=>{let z=o.dataset.note,D=e.get(`queue:${z}`);if(!D||e.has(`step:${z}`))return;if(o.classList.remove("ui-at-steer__note--landed"),K||document.hidden||typeof o.animate!="function"){o.classList.add("ui-at-steer__note--landed");return}let w=o.getBoundingClientRect(),fe=o.animate([{transform:`translate(${D.left-w.left}px, ${D.top-w.top}px)`,opacity:.9},{transform:"translate(0, 0)",opacity:1}],{duration:be,easing:he});fe.onfinish=()=>o.classList.add("ui-at-steer__note--landed")})});let F=f(null),[j,Z]=x(null);$(()=>{let e=F.current;if(!e)return;let a=()=>Z(e.offsetHeight);if(a(),typeof ResizeObserver>"u")return;let o=new ResizeObserver(a);return o.observe(e),()=>o.disconnect()},[]),$(()=>{let e=F.current?.offsetHeight;e!=null&&e!==j&&Z(e)});let[de,le]=x(!1);y(()=>{let e=requestAnimationFrame(()=>le(!0));return()=>cancelAnimationFrame(e)},[]);let U=f(null);$(()=>{let e=U.current;e&&(e.style.height="auto",e.style.height=`${Math.min(e.scrollHeight,120)}px`)},[v]);let G=e=>{let a=v.trim();a&&(e==="now"&&h?h(a):O?.(a),s(""))},ue=e=>{e.nativeEvent.isComposing||(e.key==="Enter"&&!e.shiftKey?(e.preventDefault(),G((e.metaKey||e.ctrlKey)&&h?"now":"queue")):e.key==="Escape"&&v&&(e.preventDefault(),s("")))},pe=we()?"\u2318":"Ctrl",E=g==="done",ce=E&&m!=null?`Done in ${te(c-m)}`:`${g==="paused"?"Paused":"Running"}${m!=null?` \xB7 ${te(c-m)}`:""}`,J=`${M}-hint`;return n("div",{ref:B,className:["ui-at-steer",_].filter(Boolean).join(" "),"data-status":g,style:j!=null?{height:j+2}:void 0,"data-armed":de||void 0,children:[t("style",{href:"ui-agent-steering",precedence:"default",children:Ce}),n("div",{ref:F,className:"ui-at-steer__inner",children:[n("div",{className:"ui-at-steer__panel",children:[n("div",{className:"ui-at-steer__head",children:[t("span",{className:"ui-at-steer__pebble",children:t(ke,{})}),n("div",{className:"ui-at-steer__who",children:[p?t("h3",{className:"ui-at-steer__title",children:p}):null,n("p",{className:"ui-at-steer__sub",children:[l?t("span",{children:l}):null,l?t("span",{"aria-hidden":"true",children:"\xB7"}):null,t("span",{children:E?`${d.length} steps`:`Step ${se} of ${d.length}`})]})]}),n("span",{className:"ui-at-steer__state","data-status":g,children:[t("span",{className:"ui-at-steer__state-dot","aria-hidden":"true"}),ce]}),g==="running"&&S?t("button",{type:"button",className:"ui-at-steer__icon-btn","aria-label":"Pause",onClick:S,children:t(ye,{})}):g==="paused"&&A?t("button",{type:"button",className:"ui-at-steer__icon-btn","aria-label":"Resume",onClick:A,children:t(Ne,{})}):null]}),t("ol",{className:"ui-at-steer__steps","aria-label":"Plan",children:d.map((e,a)=>{let o=e.status??"pending",z=X(e.startedAt),D=o==="done"&&e.duration!=null?ee(e.duration):o==="active"&&z!=null?ee(c-z):null;return n("li",{className:"ui-at-steer__step","data-status":o,"aria-current":o==="active"?"step":void 0,children:[n("span",{className:"ui-at-steer__mark","aria-hidden":"true",children:[o==="done"?t(De,{}):o==="active"?t(Ae,{}):t(Re,{}),a<d.length-1?t("span",{className:"ui-at-steer__link"}):null]}),n("span",{className:"ui-at-steer__step-body",children:[n("span",{className:"ui-at-steer__step-row",children:[n("span",{className:"ui-at-steer__step-title",children:[e.title,n("span",{className:"ui-at-steer__sr",children:[", ",o==="active"?"in progress":o]})]}),D?t("span",{className:"ui-at-steer__step-time",children:D}):null]}),e.notes?.length?t("ul",{className:"ui-at-steer__picked","aria-label":"Notes taken in",children:e.notes.map(w=>n("li",{className:"ui-at-steer__note","data-note":w.id,"data-where":"step","data-picked":w.picked??"next",children:[t("span",{className:"ui-at-steer__note-text",children:w.text}),t("span",{className:"ui-at-steer__note-tag",children:w.picked==="now"?"Interrupted":"Picked up"})]},w.id))}):null]})]},e.id)})})]}),u.length?n("div",{className:"ui-at-steer__queue",children:[n("p",{className:"ui-at-steer__queue-head",id:`${M}-q`,children:[E?"Notes still in the queue were not used":"Queued for the next step",t("span",{className:"ui-at-steer__count",children:u.length})]}),t("ul",{className:"ui-at-steer__queue-list","aria-labelledby":`${M}-q`,children:u.map(e=>n("li",{className:"ui-at-steer__queued","data-note":e.id,"data-where":"queue",children:[t("span",{className:"ui-at-steer__queued-text",children:e.text}),h&&!E?n("button",{type:"button",className:"ui-at-steer__now",onClick:()=>h(e.text,e.id),children:[t(Se,{}),"Now"]}):null,q?t("button",{type:"button",className:"ui-at-steer__x","aria-label":`Remove \u201C${e.text}\u201D`,onClick:()=>q(e.id),children:t(Me,{})}):null]},e.id))})]}):null,t("div",{className:"ui-at-steer__fold","data-open":!E||void 0,inert:E,children:t("div",{className:"ui-at-steer__fold-in",children:n("div",{className:"ui-at-steer__compose",children:[n("div",{className:"ui-at-steer__field",children:[t("textarea",{ref:U,rows:1,className:"ui-at-steer__input",placeholder:L,"aria-label":"Steer the agent","aria-describedby":J,value:v,onChange:e=>s(e.target.value),onKeyDown:ue}),t("button",{type:"button",className:"ui-at-steer__send","aria-label":"Queue for the next step",disabled:!v.trim(),onClick:()=>G("queue"),children:t(Ee,{})})]}),n("p",{className:"ui-at-steer__hints",id:J,children:[n("span",{className:"ui-at-steer__hint",children:[n("kbd",{className:"ui-at-steer__kbd",children:[t(ae,{}),t("span",{className:"ui-at-steer__sr",children:"Enter"})]}),"next step"]}),h?n("span",{className:"ui-at-steer__hint",children:[t("kbd",{className:"ui-at-steer__kbd",children:pe}),n("kbd",{className:"ui-at-steer__kbd",children:[t(ae,{}),t("span",{className:"ui-at-steer__sr",children:"Enter"})]}),"interrupt now"]}):null]})]})})})]}),t("p",{className:"ui-at-steer__sr",role:"status","aria-live":"polite",children:oe})]})}var Ce=`
.ui-at-steer {
  --frame: #f2f6fa; --panel: #ffffff; --soft: rgba(26, 62, 112, 0.06);
  --line: #dae2ec; --line-firm: #cbd6e4;
  --ink: #00162b; --on-ink: #ffffff; --text: rgba(0, 22, 43, 0.66); --muted: rgba(0, 22, 43, 0.54);
  --berry: #851437; --berry-hover: #6d0f2d; --berry-soft: rgba(133, 20, 55, 0.18);
  --info-ink: #1a3e70; --info-fill: #eef5ff; --info-line: #c1daff; --ring: #8fbdf2; --run: #2f6fc4;
  --ok-ink: #1d6a34; --ok-fill: #eafbee; --ok-line: #c9f5cf;
  --wait-ink: #775810; --wait-fill: #fdf6dd; --wait-line: #fae6a0;
  --secondary: #fbfcfe;
  --pebble-shade: inset 0 -2px 6px -4px rgba(26, 62, 112, 0.4);
  --field-shade: inset 0 1px 2px rgba(26, 62, 112, 0.08);
  --drop: 0 8px 16px -8px rgba(26, 62, 112, 0.2);
  --raised: 0 18px 30px -16px rgba(26, 62, 112, 0.38), 0 4px 10px -6px rgba(26, 62, 112, 0.18);
  --float: 0 24px 48px -24px rgba(26, 62, 112, 0.3);
  --ease: cubic-bezier(.16, 1, .3, 1);
  box-sizing: border-box;
  position: relative;
  width: 100%;
  max-width: 460px;
  border-radius: 22px;
  background: var(--frame);
  border: 1px solid var(--line);
  box-shadow: var(--float);
  overflow: hidden;
  font-family: "Avenir Next", Avenir, system-ui, sans-serif;
  color: var(--text);
  font-size: 14px;
  line-height: 1.45;
  text-align: left;
  container-type: inline-size;
}
.ui-at-steer[data-armed] { transition: height 300ms var(--ease); }
:where(.dark, [data-theme="dark"]) .ui-at-steer {
  --frame: #0f2747; --panel: #16345c; --soft: rgba(255, 255, 255, 0.07);
  --line: rgba(255, 255, 255, 0.12); --line-firm: rgba(255, 255, 255, 0.18);
  --ink: rgba(255, 255, 255, 0.94); --on-ink: #16345c; --text: rgba(255, 255, 255, 0.72); --muted: rgba(255, 255, 255, 0.56);
  --berry: #a8204d; --berry-hover: #bd2a5a; --berry-soft: rgba(168, 32, 77, 0.3);
  --info-ink: #c1daff; --info-fill: rgba(143, 189, 242, 0.16); --info-line: rgba(143, 189, 242, 0.34); --ring: rgba(143, 189, 242, 0.6); --run: #8fbdf2;
  --ok-ink: #7fe0a0; --ok-fill: rgba(127, 224, 160, 0.14); --ok-line: rgba(127, 224, 160, 0.3);
  --wait-ink: #f3d27a; --wait-fill: rgba(243, 210, 122, 0.14); --wait-line: rgba(243, 210, 122, 0.3);
  --secondary: rgba(255, 255, 255, 0.06);
  --pebble-shade: inset 0 -2px 6px -4px rgba(3, 12, 28, 0.8);
  --field-shade: inset 0 1px 2px rgba(3, 12, 28, 0.4);
  --drop: 0 8px 16px -8px rgba(3, 12, 28, 0.6);
  --raised: 0 18px 30px -16px rgba(3, 12, 28, 0.8), 0 4px 10px -6px rgba(3, 12, 28, 0.6);
  --float: 0 24px 48px -24px rgba(3, 12, 28, 0.7);
}
.ui-at-steer *, .ui-at-steer *::before, .ui-at-steer *::after { box-sizing: border-box; }
.ui-at-steer :where(button) { font: inherit; color: inherit; cursor: pointer; }
.ui-at-steer :focus-visible { outline: none; box-shadow: 0 0 0 3px var(--ring); }
.ui-at-steer__sr {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0;
}
.ui-at-steer__inner { padding: 6px; }

.ui-at-steer__panel { background: var(--panel); border: 1px solid var(--line); border-radius: 16px; box-shadow: var(--raised); }
.ui-at-steer__head { display: flex; align-items: center; gap: 10px; padding: 14px 14px 14px 16px; border-bottom: 1px solid var(--line); }
.ui-at-steer__pebble {
  flex: none; width: 30px; height: 30px; display: grid; place-items: center; border-radius: 10px;
  background: var(--panel); border: 1px solid var(--line); box-shadow: var(--pebble-shade); color: var(--run);
}
.ui-at-steer__who { min-width: 0; flex: 1; }
.ui-at-steer__title {
  margin: 0; color: var(--ink); font-size: 16px; font-weight: 700; line-height: 1.25; letter-spacing: 0;
  font-family: "Avenir Next Condensed", "Avenir Next", Avenir, system-ui, sans-serif; overflow-wrap: anywhere;
}
.ui-at-steer__sub { margin: 2px 0 0; display: flex; flex-wrap: wrap; gap: 0 6px; font-size: 12.5px; color: var(--muted); }
.ui-at-steer__state {
  flex: none; display: inline-flex; align-items: center; gap: 6px; height: 26px; padding: 0 10px; border-radius: 999px;
  background: var(--info-fill); border: 1px solid var(--info-line); color: var(--info-ink);
  font-size: 12.5px; font-weight: 600; font-variant-numeric: tabular-nums; white-space: nowrap;
  transition: background-color 300ms var(--ease), color 300ms var(--ease), border-color 300ms var(--ease);
}
.ui-at-steer__state-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
.ui-at-steer__state[data-status="running"] .ui-at-steer__state-dot { animation: ui-at-steer-blink 1.6s ease-in-out infinite; }
@keyframes ui-at-steer-blink { 50% { opacity: .35; } }
.ui-at-steer__state[data-status="paused"] { background: var(--wait-fill); border-color: var(--wait-line); color: var(--wait-ink); }
.ui-at-steer__state[data-status="done"] { background: var(--ok-fill); border-color: var(--ok-line); color: var(--ok-ink); }
.ui-at-steer__icon-btn {
  flex: none; width: 32px; height: 32px; display: grid; place-items: center; border-radius: 10px;
  background: var(--secondary); border: 1px solid var(--line-firm); box-shadow: var(--drop); color: var(--ink);
  transition: background-color 150ms var(--ease);
}
.ui-at-steer__icon-btn:hover { background: var(--soft); }

.ui-at-steer__steps { list-style: none; margin: 0; padding: 12px 16px 14px; }
.ui-at-steer__step { display: flex; gap: 12px; }
.ui-at-steer__mark { position: relative; flex: none; width: 16px; display: flex; flex-direction: column; align-items: center; padding-top: 4px; color: var(--muted); }
.ui-at-steer__step[data-status="done"] .ui-at-steer__mark { color: var(--ink); }
.ui-at-steer__step[data-status="active"] .ui-at-steer__mark { color: var(--run); }
.ui-at-steer__link { flex: 1; width: 0; min-height: 8px; margin: 3px 0 -1px; border-left: 1.5px dashed var(--line-firm); }
.ui-at-steer__step[data-status="done"] .ui-at-steer__link { border-left-style: solid; border-color: var(--line-firm); }
.ui-at-steer__spin { animation: ui-at-steer-spin 900ms linear infinite; }
@keyframes ui-at-steer-spin { to { transform: rotate(360deg); } }
.ui-at-steer__tick { stroke-dasharray: 12; animation: ui-at-steer-draw 360ms var(--ease) both; }
@keyframes ui-at-steer-draw { from { stroke-dashoffset: 12; } to { stroke-dashoffset: 0; } }
.ui-at-steer__step[data-status="done"] .ui-at-steer__mark svg { animation: ui-at-steer-pop 300ms var(--ease); }
@keyframes ui-at-steer-pop { from { transform: scale(.6); } }
.ui-at-steer__step-body { min-width: 0; flex: 1; padding: 2px 0 10px; }
.ui-at-steer__step:last-child .ui-at-steer__step-body { padding-bottom: 0; }
.ui-at-steer__step-row { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; }
.ui-at-steer__step-title { min-width: 0; color: var(--text); font-size: 14.5px; overflow-wrap: anywhere; }
.ui-at-steer__step[data-status="pending"] .ui-at-steer__step-title { color: var(--muted); }
.ui-at-steer__step[data-status="active"] .ui-at-steer__step-title {
  color: var(--ink); font-weight: 600;
  background: linear-gradient(100deg, var(--ink) 40%, var(--run) 50%, var(--ink) 60%) 0 0 / 250% 100%;
  -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
  animation: ui-at-steer-shimmer 2.6s linear infinite;
}
@keyframes ui-at-steer-shimmer { from { background-position: 100% 0; } to { background-position: -150% 0; } }
.ui-at-steer__step-time { flex: none; font-size: 12.5px; color: var(--muted); font-variant-numeric: tabular-nums; }
.ui-at-steer__picked { list-style: none; margin: 6px 0 0; padding: 0; display: grid; gap: 4px; }
.ui-at-steer__note {
  display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; padding: 6px 8px 6px 10px;
  border-radius: 9px; background: var(--soft); border: 1px solid var(--line); border-left: 2px solid var(--berry);
  font-size: 13px; color: var(--ink); position: relative; z-index: 2;
}
.ui-at-steer__note--landed { animation: ui-at-steer-glow 900ms var(--ease); }
@keyframes ui-at-steer-glow { 0% { box-shadow: 0 0 0 4px var(--berry-soft); } 100% { box-shadow: 0 0 0 0 transparent; } }
.ui-at-steer__note-text { min-width: 0; overflow-wrap: anywhere; }
.ui-at-steer__note-tag {
  flex: none; height: 18px; display: inline-flex; align-items: center; padding: 0 6px; border-radius: 6px;
  background: var(--info-fill); border: 1px solid var(--info-line); color: var(--info-ink); font-size: 10.5px; font-weight: 600;
  letter-spacing: 0.04em; text-transform: uppercase;
}
.ui-at-steer__note[data-picked="now"] .ui-at-steer__note-tag { background: var(--wait-fill); border-color: var(--wait-line); color: var(--wait-ink); }

.ui-at-steer__queue { padding: 12px 6px 0; }
.ui-at-steer__queue-head { margin: 0 0 8px 8px; display: flex; align-items: center; gap: 6px; font-size: 12.5px; color: var(--muted); }
.ui-at-steer__count {
  min-width: 18px; height: 18px; padding: 0 5px; display: inline-grid; place-items: center; border-radius: 999px;
  background: var(--panel); border: 1px solid var(--line); box-shadow: var(--pebble-shade);
  font-size: 11px; font-weight: 600; color: var(--text);
}
.ui-at-steer__queue-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 6px; }
.ui-at-steer__queued {
  display: flex; align-items: center; gap: 6px; min-height: 38px; padding: 4px 6px 4px 12px; border-radius: 12px;
  background: var(--panel); border: 1px solid var(--line); border-left: 3px solid var(--berry); box-shadow: var(--drop);
  font-size: 13.5px; color: var(--ink); animation: ui-at-steer-in 300ms var(--ease);
}
@keyframes ui-at-steer-in { from { opacity: 0; transform: translateY(6px); } }
.ui-at-steer__queued-text { min-width: 0; flex: 1; overflow-wrap: anywhere; }
.ui-at-steer__now {
  flex: none; display: inline-flex; align-items: center; gap: 4px; height: 28px; padding: 0 8px; border: 0; border-radius: 8px;
  background: transparent; font-size: 12.5px; font-weight: 600; color: var(--ink); transition: background-color 150ms var(--ease);
}
.ui-at-steer__now:hover { background: var(--soft); }
.ui-at-steer__x {
  flex: none; width: 28px; height: 28px; display: grid; place-items: center; border: 0; border-radius: 8px;
  background: transparent; color: var(--muted); transition: background-color 150ms var(--ease);
}
.ui-at-steer__x:hover { background: var(--soft); color: var(--ink); }

.ui-at-steer__fold { display: grid; grid-template-rows: 0fr; opacity: 0; transition: grid-template-rows 300ms var(--ease), opacity 300ms var(--ease); }
.ui-at-steer__fold[data-open] { grid-template-rows: 1fr; opacity: 1; }
.ui-at-steer__fold-in { overflow: hidden; min-height: 0; }
.ui-at-steer__compose { padding: 10px 0 4px; }
.ui-at-steer__field {
  display: flex; align-items: flex-end; gap: 8px; padding: 6px 6px 6px 14px; border-radius: 14px;
  background: var(--panel); border: 1px solid var(--line-firm); box-shadow: var(--field-shade);
  transition: box-shadow 150ms var(--ease);
}
.ui-at-steer__field:focus-within { box-shadow: 0 0 0 3px var(--ring), var(--field-shade); }
.ui-at-steer__input {
  flex: 1; min-width: 0; min-height: 30px; max-height: 120px; padding: 5px 0; border: 0; outline: none; resize: none;
  background: transparent; color: var(--ink); caret-color: var(--berry); font: inherit; font-size: 14.5px; line-height: 20px;
}
.ui-at-steer__input::placeholder { color: var(--muted); }
.ui-at-steer__input:focus-visible { box-shadow: none; }
.ui-at-steer__send {
  flex: none; width: 32px; height: 32px; display: grid; place-items: center; border-radius: 10px; border: 1px solid var(--berry);
  background: var(--berry); color: #fff !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 6px 12px -6px rgba(133, 20, 55, 0.6);
  transition: background-color 150ms var(--ease), opacity 150ms var(--ease);
}
.ui-at-steer__send:hover:not(:disabled) { background: var(--berry-hover); }
.ui-at-steer__send:disabled { opacity: .28; cursor: default; box-shadow: none; }
.ui-at-steer__hints { margin: 8px 0 0 6px; display: flex; flex-wrap: wrap; gap: 4px 16px; font-size: 12px; color: var(--muted); }
.ui-at-steer__hint { display: inline-flex; align-items: center; gap: 4px; }
.ui-at-steer__kbd {
  min-width: 20px; height: 20px; padding: 0 4px; display: inline-grid; place-items: center; border-radius: 6px;
  background: var(--panel); border: 1px solid var(--line); border-bottom-color: var(--line-firm); border-bottom-width: 2px;
  font: 600 11px/1 "Avenir Next", Avenir, system-ui, sans-serif; color: var(--text);
}
.ui-at-steer__hint .ui-at-steer__kbd + .ui-at-steer__kbd { margin-left: -1px; }

@container (max-width: 380px) {
  .ui-at-steer__head { padding: 12px 10px 12px 12px; gap: 8px; flex-wrap: wrap; }
  .ui-at-steer__who { flex-basis: calc(100% - 40px); }
  .ui-at-steer__state { order: 3; }
  .ui-at-steer__steps { padding: 10px 12px 12px; }
  .ui-at-steer__inner { padding: 5px; }
}
@media (pointer: coarse) {
  .ui-at-steer__now, .ui-at-steer__x { height: 36px; min-width: 36px; }
  .ui-at-steer__icon-btn, .ui-at-steer__send { width: 40px; height: 40px; }
}
@media (prefers-reduced-motion: reduce) {
  .ui-at-steer *, .ui-at-steer *::before, .ui-at-steer *::after { transition-duration: 0ms !important; animation: none !important; }
  .ui-at-steer { transition: none !important; }
  .ui-at-steer__step[data-status="active"] .ui-at-steer__step-title { -webkit-text-fill-color: currentColor; background: none; }
}
`;var ze="Use Postgres 16 syntax \u2013 prod isn't on 17 yet",$e="Keep the old users view for a week",qe=25e3;function ne(p){return[{id:"read",title:"Read schema and 14 migrations",status:"done",duration:1400},{id:"plan",title:"Plan the split into accounts and profiles",status:"active",startedAt:p},{id:"write",title:"Write migration 0042_split_users",status:"pending"},{id:"dry",title:"Dry run on staging",status:"pending"},{id:"pr",title:"Open a pull request for review",status:"pending"}]}function Le(){let[p,l]=x(()=>ne(Date.now())),[d,u]=x([]),[g,N]=x("running"),[O,h]=x(()=>Date.now()-124e3),[q,S]=x(""),A=f(d);A.current=d;let k=f([]),R=f(null),L=f(0),_=(s,r)=>k.current.push(window.setTimeout(r,s)),M=(s,r)=>{for(let i=1;i<=r.length;i++)_(s+i*32,()=>{S(r.slice(0,i)),i===r.length&&_(350,K)});return s+r.length*32},K=()=>{R.current?.querySelector("textarea")?.dispatchEvent(new KeyboardEvent("keydown",{key:"Enter",bubbles:!0}))},C=(s,r)=>{let i=Date.now(),b=A.current.map(c=>({...c,picked:"next"}));l(c=>c.map((m,T)=>m.status==="active"?{...m,status:"done",duration:i-Number(m.startedAt??i)}:T===s?{...m,title:r??m.title,status:"active",startedAt:i,notes:[...m.notes??[],...b]}:m)),u([])},W=()=>{let s=Date.now();l(r=>r.map(i=>i.status==="active"?{...i,status:"done",duration:s-Number(i.startedAt??s)}:i)),N("done")},v=()=>{k.current.forEach(i=>window.clearTimeout(i)),k.current=[];let s=Date.now();l(ne(s)),u([]),S(""),N("running"),h(s-124e3);let r=M(1e3,ze);_(r+2600,()=>C(2,"Write migration 0042 for Postgres 16")),r=M(r+4e3,$e),_(r+2e3,()=>R.current?.querySelectorAll("button").forEach(i=>i.textContent?.trim()==="Now"&&i.click())),_(r+6500,()=>C(3)),_(r+8500,()=>C(4)),_(r+1e4,W),_(qe,v)};return y(()=>(v(),()=>k.current.forEach(s=>window.clearTimeout(s))),[]),t("div",{ref:R,style:{width:"100%",display:"grid",placeItems:"center"},children:t(re,{title:"Migrate users table",agent:"Opus 5.5",steps:p,queue:d,status:g,startedAt:O,draft:q,onDraftChange:S,onQueue:s=>u(r=>[...r,{id:`note-${++L.current}`,text:s}]),onInterrupt:(s,r)=>{let i=r??`note-${++L.current}`;r&&u(b=>b.filter(c=>c.id!==r)),l(b=>b.map(c=>c.status==="active"?{...c,startedAt:Date.now(),notes:[...c.notes??[],{id:i,text:s,picked:"now"}]}:c))},onRemove:s=>u(r=>r.filter(i=>i.id!==s)),onPause:()=>N("paused"),onResume:()=>N("running")})})}export{Le as default};
