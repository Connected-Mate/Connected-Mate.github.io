import{t as oe}from"./react-BkAXpnfr.js";var se=oe();var{Children:ke,Component:we,Fragment:Ne,StrictMode:Ce,cloneElement:Se,createContext:Le,createElement:Ee,createRef:Me,forwardRef:$e,isValidElement:qe,lazy:ze,memo:Ae,startTransition:Re,Suspense:Te,use:Fe,useCallback:Ie,useContext:Be,useDebugValue:De,useDeferredValue:He,useEffect:V,useId:Y,useImperativeHandle:Ke,useInsertionEffect:We,useLayoutEffect:je,useMemo:y,useOptimistic:Oe,useReducer:Pe,useRef:$,useState:k,useSyncExternalStore:Qe,useTransition:Ue}=se;import{t as de}from"./jsx-runtime-CTsRTJUX.js";var ce=de(),{jsx:t,jsxs:i,Fragment:I}=ce;function pe(p){if(!p)return"";try{return new URL(p).hostname.replace(/^www\./,"")}catch{return""}}function le(p){return p.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function ue(p,s,b){let g=null;if(s?.length){let d=s.filter(c=>c.trim()).sort((c,l)=>l.length-c.length);d.length&&(g=new RegExp(`(${d.map(le).join("|")})`,"gi"))}else{let d=new Set((b.toLowerCase().match(/[\p{L}\p{N}%]+/gu)??[]).filter(c=>c.length>=5||/\d/.test(c)));if(d.size)return p.split(/([\p{L}\p{N}%]+)/u).map((l,q)=>d.has(l.toLowerCase())?t("mark",{className:"ui-at-cited__mark",children:l},q):l)}return g?p.split(g).map((d,c)=>c%2===1?t("mark",{className:"ui-at-cited__mark",children:d},c):d):[p]}var me=()=>t("svg",{width:"12",height:"12",viewBox:"0 0 12 12","aria-hidden":"true",children:t("path",{d:"M3 3l6 6M9 3l-6 6",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round"})}),ge=()=>t("svg",{width:"12",height:"12",viewBox:"0 0 12 12","aria-hidden":"true",children:t("path",{d:"M4 8l4-4M4.5 4H8v3.5",stroke:"currentColor",strokeWidth:"1.6",fill:"none",strokeLinecap:"round",strokeLinejoin:"round"})}),he=()=>i("svg",{width:"13",height:"13",viewBox:"0 0 14 14","aria-hidden":"true",children:[t("rect",{x:"4.5",y:"4.5",width:"7.5",height:"7.5",rx:"1.6",stroke:"currentColor",strokeWidth:"1.4",fill:"none"}),t("path",{d:"M9.5 4.5V3.6A1.6 1.6 0 0 0 7.9 2H3.6A1.6 1.6 0 0 0 2 3.6v4.3a1.6 1.6 0 0 0 1.6 1.6h.9",stroke:"currentColor",strokeWidth:"1.4",fill:"none"})]}),fe=()=>t("svg",{width:"13",height:"13",viewBox:"0 0 14 14","aria-hidden":"true",children:t("path",{d:"M2.5 7h9M8 3.5 11.5 7 8 10.5",stroke:"currentColor",strokeWidth:"1.6",fill:"none",strokeLinecap:"round",strokeLinejoin:"round"})});function J({segments:p,sources:s,pagesRead:b,defaultOpen:g,onOpenSource:d,onPreviewChange:c,action:l,className:q}){let z=Y(),h=y(()=>new Map(s.map((e,n)=>[e.id,n])),[s]),[o,X]=k(g&&h.has(g)?g:null),[_,u]=k(null),[B,w]=k(!1),D=$(o);o&&(D.current=o);let N=$(new Map),A=$(void 0);V(()=>()=>window.clearTimeout(A.current),[]);let H=e=>{X(e),w(!1),c?.(e)},K=e=>H(o===e?null:e),C=y(()=>p.map(e=>({...e,cite:(e.cite??[]).filter(n=>h.has(n))})),[p,h]),W=y(()=>{let e=[];return C.forEach((n,r)=>{(r===0||n.paragraph)&&e.push([]),e[e.length-1].push(n)}),e},[C]),R=_?.id??o,f=o??D.current,a=f?s[h.get(f)??-1]:void 0,j=f?(h.get(f)??0)+1:0,G=y(()=>f?C.filter(e=>e.cite.includes(f)).map(e=>e.text).join(" "):"",[C,f]),O=(e,n)=>`Source ${n}: ${e.site} \u2013 ${e.title}`,Z=async()=>{if(a?.quote)try{await navigator.clipboard.writeText(a.quote),w(!0),window.clearTimeout(A.current),A.current=window.setTimeout(()=>w(!1),1800)}catch{w(!1)}},P=()=>{let e=o;e&&(H(null),N.current.get(e)?.focus())},ee=(e,n)=>{let r=s.length,v={ArrowRight:n+1,ArrowLeft:n-1,Home:0,End:r-1}[e.key];v!==void 0&&(e.preventDefault(),N.current.get(s[(v+r)%r].id)?.focus())},S=_?s[h.get(_.id)??-1]:void 0,x=B?{key:"copied",node:"Quote copied"}:S?{key:`h-${S.id}`,node:i(I,{children:[t("b",{children:S.site})," \xB7 ",S.title]})}:o&&a?{key:`o-${o}`,node:i(I,{children:["Quote from ",t("b",{children:a.site})]})}:{key:"idle",node:"Pick a number to check its source"},[L,te]=k({cur:x.key,node:x.node,prev:null});L.cur!==x.key&&te({cur:x.key,node:x.node,prev:{key:L.cur,node:L.node}});let T=L.prev;return i("section",{className:["ui-at-cited",q].filter(Boolean).join(" "),"data-dim":_?.from==="chip"||void 0,"aria-label":"Answer with sources",onKeyDown:e=>{e.key==="Escape"&&o&&(e.preventDefault(),P())},children:[t("style",{href:"ui-cited-answer",precedence:"default",children:xe}),i("div",{className:"ui-at-cited__panel",children:[i("div",{className:"ui-at-cited__head",children:[t("span",{className:"ui-at-cited__stack","aria-hidden":"true",children:s.slice(0,4).map(e=>t("span",{className:"ui-at-cited__pebble",children:e.icon??e.site.slice(0,1).toUpperCase()},e.id))}),i("span",{children:[s.length," source",s.length===1?"":"s",b!==void 0&&` \xB7 ${b} page${b===1?"":"s"} read`]})]}),i("div",{className:"ui-at-cited__text",children:[W.length===0&&t("p",{className:"ui-at-cited__empty",children:"No answer yet."}),W.map((e,n)=>t("p",{children:e.map((r,v)=>{let Q=/^\s*/.exec(r.text)[0],U=/\s*$/.exec(r.text)[0],E=r.text.slice(Q.length,r.text.length-U.length),ie=R!==null&&r.cite.includes(R);if(!r.cite.length)return t("span",{className:"ui-at-cited__seg",children:r.text},v);let M=E.search(/\S+$/),ae=M>0?E.slice(0,M):"",re=M>=0?E.slice(M):E;return i("span",{children:[Q,i("span",{className:"ui-at-cited__seg","data-cites":!0,"data-lit":ie||void 0,children:[ae,i("span",{className:"ui-at-cited__tail",children:[re,r.cite.map(m=>{let F=(h.get(m)??0)+1,ne=s[F-1];return t("button",{type:"button",className:"ui-at-cited__marker","data-on":o===m||void 0,"data-lit":_?.id===m||void 0,"aria-label":O(ne,F),"aria-expanded":o===m,"aria-controls":`${z}-pv`,onClick:()=>K(m),onMouseEnter:()=>u({id:m,from:"marker"}),onMouseLeave:()=>u(null),onFocus:()=>u({id:m,from:"marker"}),onBlur:()=>u(null),children:F},m)})]})]}),U]},v)})},n))]}),t("div",{className:"ui-at-cited__pv","data-open":o?"":void 0,children:t("div",{className:"ui-at-cited__pvclip",children:t("div",{id:`${z}-pv`,role:"region","aria-label":a?`Preview of ${a.site}`:"Source preview",className:"ui-at-cited__pvbox",inert:!o,children:a&&i("div",{className:"ui-at-cited__pvin",children:[i("div",{className:"ui-at-cited__pvhead",children:[t("span",{className:"ui-at-cited__pebble","aria-hidden":"true",children:a.icon??a.site.slice(0,1).toUpperCase()}),i("span",{className:"ui-at-cited__where",children:[pe(a.url)||a.site,a.date&&` \xB7 ${a.date}`]}),t("span",{className:"ui-at-cited__tag","aria-label":`Source ${j}`,children:j}),t("button",{type:"button",className:"ui-at-cited__close","aria-label":"Close preview",onClick:P,children:t(me,{})})]}),t("p",{className:"ui-at-cited__title",children:a.title}),a.quote&&t("blockquote",{className:"ui-at-cited__quote",children:ue(a.quote,a.highlight,G)}),i("div",{className:"ui-at-cited__pvbtns",children:[(a.url||d)&&i("a",{className:"ui-at-cited__open",href:a.url??"#",target:d?void 0:"_blank",rel:"noopener noreferrer",onClick:e=>{d&&(e.preventDefault(),d(a))},children:["Open source",t(ge,{})]}),a.quote&&i("button",{type:"button",className:"ui-at-cited__copy",onClick:Z,children:[t(he,{}),t("span",{className:"ui-at-cited__copylabel",children:B?"Copied":"Copy quote"})]})]})]},a.id)})})})]}),i("div",{className:"ui-at-cited__tray",children:[t("div",{className:"ui-at-cited__chips",role:"group","aria-label":"Sources",children:s.map((e,n)=>i("button",{ref:r=>{r?N.current.set(e.id,r):N.current.delete(e.id)},type:"button",className:"ui-at-cited__chip","data-on":o===e.id||void 0,"data-lit":R===e.id||void 0,"aria-label":O(e,n+1),"aria-expanded":o===e.id,"aria-controls":`${z}-pv`,onClick:()=>K(e.id),onKeyDown:r=>ee(r,n),onMouseEnter:()=>u({id:e.id,from:"chip"}),onMouseLeave:()=>u(null),onFocus:()=>u({id:e.id,from:"chip"}),onBlur:()=>u(null),children:[t("span",{className:"ui-at-cited__pebble","aria-hidden":"true",children:e.icon??e.site.slice(0,1).toUpperCase()}),t("span",{className:"ui-at-cited__chipname",children:e.site}),t("span",{className:"ui-at-cited__chipnum","aria-hidden":"true",children:n+1})]},e.id))}),i("div",{className:"ui-at-cited__foot",children:[i("div",{className:"ui-at-cited__line",role:"status","aria-live":"polite",children:[T&&t("span",{className:"ui-at-cited__lineout","aria-hidden":"true",children:T.node},`f-${T.key}`),t("span",{className:"ui-at-cited__linein",children:x.node},x.key)]}),l&&i("button",{type:"button",className:"ui-at-cited__action",onClick:l.onClick,children:[l.label,t(fe,{})]})]})]})]})}var xe=`
.ui-at-cited {
  --frame: #f2f6fa; --panel: #ffffff; --soft: rgba(26, 62, 112, 0.06);
  --line: #dae2ec; --line-firm: #cbd6e4;
  --ink: #00162b; --text: rgba(0, 22, 43, 0.66); --muted: rgba(0, 22, 43, 0.54);
  --berry: #851437;
  --info-ink: #1a3e70; --info-fill: #eef5ff; --info-line: #c1daff; --ring: #8fbdf2;
  --tint: rgba(143, 189, 242, 0.24);
  --pebble: #ffffff; --pebble-shade: inset 0 -2px 6px -4px rgba(26, 62, 112, 0.4);
  --secondary: #fbfcfe;
  --drop: 0 8px 16px -8px rgba(26, 62, 112, 0.2);
  --short-drop: 0 2px 4px -2px rgba(26, 62, 112, 0.22);
  --raised: 0 18px 30px -16px rgba(26, 62, 112, 0.38), 0 4px 10px -6px rgba(26, 62, 112, 0.18);
  --float: 0 24px 48px -24px rgba(26, 62, 112, 0.3);
  --ease: cubic-bezier(.16, 1, .3, 1);
  box-sizing: border-box;
  width: 100%;
  max-width: 460px;
  min-width: 0;
  padding: 6px;
  border-radius: 22px;
  background: var(--frame);
  border: 1px solid var(--line);
  box-shadow: var(--float);
  font-family: "Avenir Next", Avenir, system-ui, sans-serif;
  font-size: 14.5px;
  line-height: 1.6;
  color: var(--text);
  text-align: left;
}
:where(.dark, [data-theme="dark"]) .ui-at-cited {
  --frame: #0f2747; --panel: #16345c; --soft: rgba(255, 255, 255, 0.07);
  --line: rgba(255, 255, 255, 0.12); --line-firm: rgba(255, 255, 255, 0.18);
  --ink: rgba(255, 255, 255, 0.94); --text: rgba(255, 255, 255, 0.72); --muted: rgba(255, 255, 255, 0.56);
  --berry: #a8204d;
  --info-ink: #c1daff; --info-fill: rgba(143, 189, 242, 0.16); --info-line: rgba(143, 189, 242, 0.34); --ring: rgba(143, 189, 242, 0.6);
  --tint: rgba(143, 189, 242, 0.2);
  --pebble: #1d4170; --pebble-shade: inset 0 -2px 6px -4px rgba(3, 12, 28, 0.8);
  --secondary: #1b3d68;
  --drop: 0 8px 16px -8px rgba(3, 12, 28, 0.6);
  --short-drop: 0 2px 4px -2px rgba(3, 12, 28, 0.6);
  --raised: 0 18px 30px -16px rgba(3, 12, 28, 0.8), 0 4px 10px -6px rgba(3, 12, 28, 0.6);
  --float: 0 24px 48px -24px rgba(3, 12, 28, 0.7);
}
.ui-at-cited *, .ui-at-cited *::before, .ui-at-cited *::after { box-sizing: border-box; }
.ui-at-cited button { font: inherit; color: inherit; }
.ui-at-cited :focus-visible { outline: none; box-shadow: 0 0 0 3px var(--ring); }

.ui-at-cited__panel {
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 16px;
  box-shadow: var(--raised);
  padding: 14px 16px 16px;
}
.ui-at-cited__head { display: flex; align-items: center; gap: 8px; font-size: 12.5px; color: var(--muted); margin-bottom: 8px; }
.ui-at-cited__stack { display: inline-flex; }
.ui-at-cited__stack .ui-at-cited__pebble + .ui-at-cited__pebble { margin-left: -5px; }
.ui-at-cited__pebble {
  flex: none;
  display: inline-grid;
  place-items: center;
  width: 18px;
  height: 18px;
  border-radius: 6px;
  background: var(--pebble);
  border: 1px solid var(--line);
  box-shadow: var(--pebble-shade);
  font-size: 10px;
  font-weight: 700;
  line-height: 1;
  color: var(--info-ink);
}
.ui-at-cited__pebble svg, .ui-at-cited__pebble img { width: 12px; height: 12px; }

.ui-at-cited__text p { margin: 0 0 10px; overflow-wrap: anywhere; }
.ui-at-cited__text p:last-child { margin-bottom: 0; }
.ui-at-cited__empty { color: var(--muted); }
.ui-at-cited__seg {
  border-radius: 4px;
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
  transition: background-color 150ms var(--ease), color 150ms var(--ease), opacity 300ms var(--ease);
}
.ui-at-cited__seg[data-lit] { background: var(--tint); color: var(--ink); }
.ui-at-cited[data-dim] .ui-at-cited__seg:not([data-lit]) { opacity: 0.42; }
.ui-at-cited__tail { white-space: nowrap; }
.ui-at-cited__marker {
  position: relative;
  display: inline-grid;
  place-items: center;
  min-width: 17px;
  height: 17px;
  margin-left: 3px;
  padding: 0 4px;
  vertical-align: 1px;
  border-radius: 5px;
  border: 1px solid var(--line-firm);
  background: var(--pebble);
  font-size: 10.5px;
  font-weight: 700;
  line-height: 1;
  color: var(--info-ink);
  cursor: pointer;
  transition: background-color 150ms var(--ease), color 150ms var(--ease), border-color 150ms var(--ease);
}
.ui-at-cited__marker::after { content: ""; position: absolute; inset: -5px -3px; }
.ui-at-cited__marker[data-lit] { border-color: var(--info-line); background: var(--info-fill); }
.ui-at-cited__marker[data-on] { background: var(--ink); border-color: var(--ink); color: var(--panel); }

.ui-at-cited__pv { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 300ms var(--ease); }
.ui-at-cited__pv[data-open] { grid-template-rows: 1fr; }
.ui-at-cited__pvclip { min-height: 0; overflow: hidden; }
.ui-at-cited__pvbox {
  margin-top: 14px;
  padding: 12px 12px 12px;
  border-radius: 12px;
  background: var(--frame);
  border: 1px solid var(--line);
  opacity: 0;
  transform: translateY(-4px);
  transition: opacity 300ms var(--ease), transform 300ms var(--ease);
}
.ui-at-cited__pv[data-open] .ui-at-cited__pvbox { opacity: 1; transform: none; }
.ui-at-cited__pvin { animation: ui-at-cited-fade 300ms var(--ease) both; }
.ui-at-cited__pvhead { display: flex; align-items: center; gap: 8px; min-width: 0; font-size: 12px; color: var(--muted); }
.ui-at-cited__where { flex: 1; min-width: 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.ui-at-cited__tag {
  display: grid;
  place-items: center;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  border-radius: 5px;
  border: 1px solid var(--line-firm);
  background: var(--pebble);
  font-size: 10.5px;
  font-weight: 700;
  color: var(--ink);
}
.ui-at-cited__close {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  margin: -4px -4px -4px 0;
  border: 0;
  border-radius: 7px;
  background: transparent;
  color: var(--muted);
  cursor: pointer;
  transition: background-color 150ms var(--ease), color 150ms var(--ease);
}
.ui-at-cited__close:hover { background: var(--soft); color: var(--ink); }
.ui-at-cited__title { margin: 8px 0 6px; font-weight: 650; color: var(--ink); line-height: 1.35; }
.ui-at-cited__quote {
  margin: 0 0 12px;
  padding: 0 0 0 11px;
  border-left: 2px solid var(--line-firm);
  font-size: 13.5px;
  line-height: 1.55;
  color: var(--muted);
}
.ui-at-cited__mark {
  background: var(--tint);
  color: var(--ink);
  border-radius: 3px;
  padding: 0 1px;
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
}
.ui-at-cited__pvbtns { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.ui-at-cited__open {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid var(--line-firm);
  background: var(--secondary);
  box-shadow: var(--short-drop);
  font-size: 13px;
  font-weight: 600;
  color: var(--ink);
  text-decoration: none;
  transition: border-color 150ms var(--ease), box-shadow 150ms var(--ease);
}
.ui-at-cited__open:hover { border-color: var(--info-line); box-shadow: var(--drop); }
.ui-at-cited__copy {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 10px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  font-size: 13px;
  color: var(--muted) !important;
  cursor: pointer;
  transition: background-color 150ms var(--ease), color 150ms var(--ease);
}
.ui-at-cited__copy:hover { background: var(--soft); color: var(--ink) !important; }

.ui-at-cited__tray { padding: 8px 6px 4px; }
.ui-at-cited__chips { display: flex; flex-wrap: wrap; gap: 4px; }
.ui-at-cited__chip {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  min-width: 0;
  max-width: 100%;
  height: 30px;
  padding: 0 9px 0 6px;
  border-radius: 10px;
  border: 1px solid transparent;
  background: transparent;
  font-size: 13px;
  color: var(--text);
  cursor: pointer;
  transition: background-color 150ms var(--ease), border-color 150ms var(--ease), box-shadow 150ms var(--ease), color 150ms var(--ease);
}
.ui-at-cited__chip:hover, .ui-at-cited__chip[data-lit] { background: var(--soft); color: var(--ink); }
.ui-at-cited__chip[data-on] { background: var(--panel); border-color: var(--line-firm); box-shadow: var(--short-drop); color: var(--ink); }
.ui-at-cited__chipname { min-width: 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.ui-at-cited__chipnum { font-size: 11.5px; color: var(--muted); font-variant-numeric: tabular-nums; }
.ui-at-cited__foot { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 8px 4px 2px 6px; min-height: 36px; }
.ui-at-cited__line { position: relative; flex: 1; min-width: 0; display: grid; font-size: 12.5px; color: var(--muted); }
.ui-at-cited__line > span { grid-area: 1 / 1; min-width: 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.ui-at-cited__line b { color: var(--ink); font-weight: 600; }
.ui-at-cited__linein { animation: ui-at-cited-in 300ms var(--ease) both; }
.ui-at-cited__lineout { animation: ui-at-cited-out 300ms var(--ease) both; pointer-events: none; }
.ui-at-cited__action {
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 30px;
  padding: 0 8px;
  border: 0;
  border-radius: 9px;
  background: transparent;
  font-size: 13px;
  font-weight: 600;
  color: var(--ink);
  cursor: pointer;
  transition: background-color 150ms var(--ease);
}
.ui-at-cited__action svg { color: var(--berry); transition: transform 150ms var(--ease); }
.ui-at-cited__action:hover { background: var(--soft); }
.ui-at-cited__action:hover svg { transform: translateX(2px); }

@keyframes ui-at-cited-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes ui-at-cited-in { from { opacity: 0; transform: translateY(3px); } to { opacity: 1; transform: none; } }
@keyframes ui-at-cited-out { from { opacity: 1; } to { opacity: 0; transform: translateY(-3px); } }

@media (max-width: 360px) {
  .ui-at-cited__panel { padding: 12px 12px 14px; }
  .ui-at-cited__tag { display: none; }
  .ui-at-cited__chip { padding: 0 7px 0 5px; }
}
@media (max-width: 280px) { .ui-at-cited__copylabel { display: none; } }
@media (pointer: coarse) {
  .ui-at-cited__marker::after { inset: -10px -6px; }
  .ui-at-cited__chip { height: 38px; }
  .ui-at-cited__open, .ui-at-cited__copy { height: 40px; }
}
@media (prefers-reduced-motion: reduce) {
  .ui-at-cited *, .ui-at-cited *::before, .ui-at-cited *::after { animation-duration: 0s !important; transition-duration: 0s !important; }
}
`;var be=[{id:"caching",site:"Tokenwise",title:"Prompt caching, explained: what gets stored and for how long",url:"https://tokenwise.dev/blog/prompt-caching",date:"Sep 18, 2026",quote:"A cached prefix is read instead of recomputed. On prompts over 10,000 tokens this cut time to first token by up to 80% in our tests, and cached input is billed at a fraction of the normal rate.",highlight:["read instead of recomputed","cut time to first token by up to 80%"]},{id:"layout",site:"Latency Notes",title:"Designing cache-friendly prompts",url:"https://latencynotes.io/cache-friendly-prompts",date:"Aug 2, 2026",quote:"Keep the stable part \u2013 system prompt, tool definitions, long documents \u2013 at the very start, and put anything that changes per request after it. A single changed character early on invalidates everything behind it.",highlight:["at the very start","anything that changes per request after it","invalidates everything behind it"]},{id:"semantic",site:"Inference Weekly",title:"Semantic caching for LLM apps in production",url:"https://inferenceweekly.com/semantic-caching",date:"Jul 24, 2026",quote:"For FAQ-style traffic, the semantic cache answered 31% of requests without calling the model at all, at a median of 40 ms. We only serve a stored answer above a similarity of 0.92.",highlight:["answered 31% of requests","median of 40 ms"]}],_e=[{text:"The biggest win is prompt caching: the provider reuses the processed start of your prompt, so a long system prompt isn't recomputed on every call.",cite:["caching"]},{text:" On prompts over 10K tokens that can cut time to first token by up to 80%.",cite:["caching"]},{text:" It only works while that start stays identical, so put the system prompt, tools and long documents first and anything that changes per request last.",cite:["layout","caching"]},{text:"For repeated questions, add a semantic cache in front of the model: close matches get a stored answer in about 40 ms,",cite:["semantic"],paragraph:!0},{text:" which covered nearly a third of FAQ-style traffic in one production setup.",cite:["semantic"]},{text:" Stream the rest, so people see the first words while the answer is still being written."}];function ve(){return t(J,{segments:_e,sources:be,pagesRead:12,defaultOpen:"layout",action:{label:"Follow up",onClick:()=>{}}})}export{ve as default};
