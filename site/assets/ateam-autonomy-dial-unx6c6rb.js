"use client";import{t as ae}from"./react-BkAXpnfr.js";var ie=ae();var{Children:ye,Component:we,Fragment:ke,StrictMode:Ae,cloneElement:Ne,createContext:Me,createElement:Le,createRef:Ce,forwardRef:Ie,isValidElement:ze,lazy:Re,memo:Se,startTransition:Ee,Suspense:$e,use:De,useCallback:Pe,useContext:Te,useDebugValue:He,useDeferredValue:Be,useEffect:y,useId:W,useImperativeHandle:Ve,useInsertionEffect:je,useLayoutEffect:F,useMemo:We,useOptimistic:Fe,useReducer:Oe,useRef:l,useState:s,useSyncExternalStore:Ye,useTransition:Ke}=ie;import{t as te}from"./jsx-runtime-CTsRTJUX.js";var ne=te(),{jsx:e,jsxs:i,Fragment:Ue}=ne;function O(t,n,u=[]){return u.includes(t.id)||n===0?!0:n===1?t.risk!=="safe":!1}var S=[{value:0,label:"Always ask",meaning:"Every action waits for your OK."},{value:1,label:"If risky",meaning:"Safe actions run on their own; risky and destructive ones ask you first."},{value:2,label:"Full auto",meaning:"Everything runs on its own, except the actions you lock."}];function re(){return typeof window<"u"&&window.matchMedia?.("(prefers-reduced-motion: reduce)").matches}var w={fill:"none",stroke:"currentColor",strokeWidth:1.4,strokeLinecap:"round",strokeLinejoin:"round"};function oe(){return e("svg",{viewBox:"0 0 16 16","aria-hidden":"true",...w,children:e("path",{d:"M8 2.5c.4 2.7 1.8 4.1 4.5 4.5-2.7.4-4.1 1.8-4.5 4.5C7.6 8.8 6.2 7.4 3.5 7c2.7-.4 4.1-1.8 4.5-4.5Z"})})}function le(){return e("svg",{viewBox:"0 0 16 16","aria-hidden":"true",...w,children:e("circle",{cx:"8",cy:"8",r:"2.25"})})}function se(){return i("svg",{viewBox:"0 0 16 16","aria-hidden":"true",...w,children:[e("path",{d:"M8 2.75 14 13H2z"}),e("path",{d:"M8 6.75v2.5M8 11.1v.05"})]})}function de(){return i("svg",{viewBox:"0 0 16 16","aria-hidden":"true",...w,children:[e("circle",{cx:"8",cy:"8",r:"5.75"}),e("path",{d:"M8 5.25v3.25M8 10.6v.05"})]})}function pe({open:t}){return i("svg",{viewBox:"0 0 16 16","aria-hidden":"true",...w,children:[e("rect",{x:"3.5",y:"7.25",width:"9",height:"6.5",rx:"1.75"}),e("path",{d:t?"M5.5 7.25V5.5a2.5 2.5 0 0 1 4.9-.7":"M5.5 7.25V5.5a2.5 2.5 0 0 1 5 0v1.75"}),e("path",{d:"M8 10v1"})]})}function Y({value:t}){let n=l(t),u=t>n.current?"up":t<n.current?"down":"none";return y(()=>{n.current=t},[t]),e("span",{className:"ui-at-dial__count","aria-hidden":"true",children:e("span",{"data-dir":u,children:t},t)})}function K({actions:t,level:n,defaultLevel:u=1,onLevelChange:A,pinned:N,defaultPinned:M=[],onPinnedChange:L,title:R="Agent permissions",subtitle:C="What it may do without asking you",className:I}){let d=W(),[m,q]=s(u),r=n??m,[J,U]=s(M),p=N??J,[X,Z]=s(""),g=t.filter(a=>!O(a,r,p)),f=t.filter(a=>O(a,r,p)),G=a=>{n===void 0&&q(a),A?.(a)},Q=a=>{let o=p.includes(a)?p.filter(z=>z!==a):[...p,a];N===void 0&&U(o),L?.(o)},E=l(!0);y(()=>{if(E.current){E.current=!1;return}let a=S[r].label;Z(`${a}: ${g.length} action${g.length===1?"":"s"} run on their own, ${f.length} ask${f.length===1?"s":""} you first.`)},[r,p.join("|")]);let $=l(null),D=l(new Map),P=l(null),T=l(null),ee=`${r}|${p.join(",")}|${t.map(a=>a.id).join(",")}`;F(()=>{let a=$.current;if(!a)return;let o=Array.from(a.querySelectorAll("[data-flip]")),z=re(),x=P.current;if(x){let c=x.offsetHeight,v=T.current;if(T.current=c,v!==null&&Math.abs(v-c)>1&&!z){x.style.overflow="clip";let _=x.animate([{height:`${v}px`},{height:`${c}px`}],{duration:300,easing:"cubic-bezier(0.16, 1, 0.3, 1)"}),b=()=>{x.style.overflow=""};_.onfinish=b,_.oncancel=b}}let V=0;for(let c of o){let v=c.dataset.flip,_=c.getBoundingClientRect().top,b=D.current.get(v);if(D.current.set(v,_),b===void 0||z)continue;let j=b-_;Math.abs(j)<1||(c.animate([{transform:`translateY(${j}px)`},{transform:"translateY(0)"}],{duration:420,delay:Math.min(V,6)*30,easing:"cubic-bezier(0.16, 1, 0.3, 1)",fill:"backwards"}),V+=1)}},[ee]);let H=a=>{let o=p.includes(a.id);return i("li",{className:"ui-at-dial__row","data-flip":a.id,"data-pinned":o||void 0,children:[e("span",{className:"ui-at-dial__icon","aria-hidden":"true",children:a.icon??e(le,{})}),i("span",{className:"ui-at-dial__text",children:[i("span",{className:"ui-at-dial__label-line",children:[e("span",{className:"ui-at-dial__label",children:a.label}),a.risk!=="safe"&&i("span",{className:"ui-at-dial__tag","data-risk":a.risk,children:[a.risk==="destructive"?e(de,{}):e(se,{}),a.risk==="destructive"?"Destructive":"Risky"]})]}),a.detail&&e("span",{className:"ui-at-dial__detail",children:a.detail})]}),e("button",{type:"button",className:"ui-at-dial__lock","aria-pressed":o,"aria-label":`Always ask before ${a.label}`,title:o?"Always asks \u2013 click to unlock":"Lock: always ask",onClick:()=>Q(a.id),children:e(pe,{open:!o})})]},a.id)},B=`${d}-meaning`;return i("div",{className:["ui-at-dial",I].filter(Boolean).join(" "),children:[e("style",{href:"ui-autonomy-dial",precedence:"default",children:ue}),i("div",{ref:P,className:"ui-at-dial__frame",children:[i("div",{className:"ui-at-dial__panel",children:[i("div",{className:"ui-at-dial__head",children:[e("span",{className:"ui-at-dial__mark","aria-hidden":"true",children:e(oe,{})}),i("div",{className:"ui-at-dial__heading",children:[e("h3",{className:"ui-at-dial__title",children:R}),C&&e("p",{className:"ui-at-dial__subtitle",children:C})]})]}),i("div",{className:"ui-at-dial__levels",role:"radiogroup","aria-label":"Autonomy","aria-describedby":B,children:[S.map(a=>i("label",{className:"ui-at-dial__level","data-on":a.value===r||void 0,children:[e("input",{type:"radio",name:`${d}-level`,value:a.value,checked:a.value===r,onChange:()=>G(a.value)}),e("span",{children:a.label})]},a.value)),e("span",{className:"ui-at-dial__pill","aria-hidden":"true",style:{transform:`translateX(${r*100}%)`}})]}),e("p",{id:B,className:"ui-at-dial__sr",children:S[r].meaning})]}),i("div",{ref:$,className:"ui-at-dial__groups",children:[i("section",{className:"ui-at-dial__group","aria-labelledby":`${d}-runs`,children:[i("h4",{id:`${d}-runs`,className:"ui-at-dial__group-title","data-flip":"__runs",children:["Runs on its own ",e(Y,{value:g.length}),i("span",{className:"ui-at-dial__sr",children:[" (",g.length,")"]})]}),g.length?e("ul",{className:"ui-at-dial__list",children:g.map(H)}):e("p",{className:"ui-at-dial__empty","data-flip":"__runs-empty",children:"Every action waits for you"})]}),i("section",{className:"ui-at-dial__group","aria-labelledby":`${d}-asks`,children:[i("h4",{id:`${d}-asks`,className:"ui-at-dial__group-title","data-flip":"__asks",children:["Asks you first ",e(Y,{value:f.length}),i("span",{className:"ui-at-dial__sr",children:[" (",f.length,")"]})]}),f.length?e("ul",{className:"ui-at-dial__list",children:f.map(H)}):e("p",{className:"ui-at-dial__empty","data-flip":"__asks-empty",children:"Nothing waits for you \u2013 lock an action to make it ask"})]})]})]}),e("span",{className:"ui-at-dial__sr",role:"status","aria-live":"polite",children:X})]})}var ue=`
.ui-at-dial {
  --frame: #f2f6fa;
  --panel: #ffffff;
  --soft: rgba(26, 62, 112, 0.06);
  --hairline: #dae2ec;
  --firm: #cbd6e4;
  --ink: #00162b;
  --text: rgba(0, 22, 43, 0.66);
  --muted: rgba(0, 22, 43, 0.54);
  --berry: #851437;
  --ring: #8fbdf2;
  --wait-ink: #775810;
  --wait-fill: #fdf6dd;
  --wait-line: #fae6a0;
  --bad-ink: #8a3a22;
  --bad-fill: #fdeee8;
  --bad-line: #f5d5c9;
  --pebble-light: rgba(26, 62, 112, 0.4);
  --shadow-drop: 0 8px 16px -8px rgba(26, 62, 112, 0.2);
  --shadow-raised: 0 18px 30px -16px rgba(26, 62, 112, 0.38), 0 4px 10px -6px rgba(26, 62, 112, 0.18);
  --shadow-float: 0 24px 48px -24px rgba(26, 62, 112, 0.3);
  --ease: cubic-bezier(0.16, 1, 0.3, 1);

  position: relative;
  box-sizing: border-box;
  width: 100%;
  max-width: 400px;
  container-type: inline-size;
  font-family: "Avenir Next", Avenir, system-ui, sans-serif;
  font-size: 13px;
  line-height: 1.45;
  color: var(--text);
  -webkit-font-smoothing: antialiased;
}
:where(.dark, [data-theme="dark"]) .ui-at-dial {
  --frame: #0f2747;
  --panel: #16345c;
  --soft: rgba(255, 255, 255, 0.07);
  --hairline: rgba(255, 255, 255, 0.12);
  --firm: rgba(255, 255, 255, 0.18);
  --ink: rgba(255, 255, 255, 0.94);
  --text: rgba(255, 255, 255, 0.72);
  --muted: rgba(255, 255, 255, 0.56);
  --berry: #a8204d;
  --ring: rgba(143, 189, 242, 0.6);
  --wait-ink: #f3d27a;
  --wait-fill: rgba(243, 210, 122, 0.14);
  --wait-line: rgba(243, 210, 122, 0.3);
  --bad-ink: #f2a48c;
  --bad-fill: rgba(242, 164, 140, 0.14);
  --bad-line: rgba(242, 164, 140, 0.3);
  --pebble-light: rgba(3, 12, 28, 0.6);
  --shadow-drop: 0 8px 16px -8px rgba(3, 12, 28, 0.6);
  --shadow-raised: 0 18px 30px -16px rgba(3, 12, 28, 0.8), 0 4px 10px -6px rgba(3, 12, 28, 0.6);
  --shadow-float: 0 24px 48px -24px rgba(3, 12, 28, 0.7);
}
.ui-at-dial *, .ui-at-dial *::before, .ui-at-dial *::after { box-sizing: border-box; }
.ui-at-dial p, .ui-at-dial h3, .ui-at-dial h4, .ui-at-dial ul { margin: 0; padding: 0; }

.ui-at-dial__frame {
  background: var(--frame);
  border: 1px solid var(--hairline);
  border-radius: 22px;
  padding: 6px;
  box-shadow: var(--shadow-float);
}
.ui-at-dial__panel {
  background: var(--panel);
  border: 1px solid var(--hairline);
  border-radius: 16px;
  padding: 14px 14px 12px;
  box-shadow: var(--shadow-raised);
  display: grid;
  gap: 12px;
}
.ui-at-dial__head { display: flex; align-items: center; gap: 10px; min-width: 0; }
.ui-at-dial__mark {
  flex: none;
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: var(--panel);
  border: 1px solid var(--hairline);
  box-shadow: inset 0 -2px 6px -4px var(--pebble-light);
  color: var(--berry);
}
.ui-at-dial__mark svg { width: 16px; height: 16px; }
.ui-at-dial__heading { min-width: 0; }
.ui-at-dial__title {
  font-family: "Avenir Next Condensed", "Avenir Next", Avenir, system-ui, sans-serif;
  font-weight: 700;
  font-size: 18px;
  line-height: 1.2;
  color: var(--ink);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-at-dial__subtitle { color: var(--text); font-size: 12.5px; }

.ui-at-dial__levels {
  position: relative;
  display: flex;
  padding: 3px;
  border-radius: 12px;
  background: var(--soft);
  border: 1px solid var(--hairline);
}
.ui-at-dial__level {
  position: relative;
  z-index: 1;
  flex: 1 1 0;
  display: grid;
  place-items: center;
  min-width: 0;
  height: 32px;
  border-radius: 9px;
  color: var(--text);
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  transition: color 150ms var(--ease);
}
.ui-at-dial__level > span { overflow: hidden; text-overflow: ellipsis; padding: 0 6px; }
.ui-at-dial__level[data-on] { color: var(--ink); font-weight: 600; }
.ui-at-dial__level:hover:not([data-on]) { color: var(--ink); }
.ui-at-dial__level input { position: absolute; inset: 0; opacity: 0; margin: 0; cursor: pointer; }
.ui-at-dial__level:has(input:focus-visible) { box-shadow: 0 0 0 3px var(--ring); }
.ui-at-dial__pill {
  position: absolute;
  top: 3px;
  bottom: 3px;
  left: 3px;
  width: calc((100% - 6px) / 3);
  border-radius: 9px;
  background: var(--panel);
  border: 1px solid var(--hairline);
  box-shadow: var(--shadow-drop);
  transition: transform 300ms var(--ease);
}

.ui-at-dial__groups { display: grid; gap: 4px; padding: 10px 2px 2px; }
.ui-at-dial__group { display: grid; gap: 6px; }
.ui-at-dial__group + .ui-at-dial__group { margin-top: 8px; }
.ui-at-dial__group-title {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 8px;
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: var(--muted);
}
.ui-at-dial__count {
  display: inline-grid;
  place-items: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 6px;
  border: 1px solid var(--hairline);
  background: var(--panel);
  color: var(--ink);
  letter-spacing: 0;
  font-variant-numeric: tabular-nums;
  overflow: hidden;
}
.ui-at-dial__count > span { display: block; }
.ui-at-dial__count > span[data-dir="up"] { animation: ui-at-dial-roll-up 300ms var(--ease) both; }
.ui-at-dial__count > span[data-dir="down"] { animation: ui-at-dial-roll-down 300ms var(--ease) both; }
.ui-at-dial__list { list-style: none; display: grid; gap: 6px; }
.ui-at-dial__row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 42px;
  padding: 7px 8px 7px 12px;
  border-radius: 12px;
  background: var(--panel);
  border: 1px solid var(--hairline);
  box-shadow: var(--shadow-drop);
  color: var(--ink);
  min-width: 0;
}
.ui-at-dial__icon { flex: none; display: grid; place-items: center; width: 18px; height: 18px; color: var(--ink); }
.ui-at-dial__icon svg { width: 16px; height: 16px; }
.ui-at-dial__text { flex: 1; min-width: 0; display: grid; }
.ui-at-dial__label-line { display: flex; align-items: center; gap: 6px; min-width: 0; }
.ui-at-dial__label { min-width: 0; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ui-at-dial__detail { color: var(--muted); font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ui-at-dial__tag {
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 3px;
  height: 20px;
  padding: 0 7px;
  border-radius: 999px;
  border: 1px solid var(--wait-line);
  background: var(--wait-fill);
  color: var(--wait-ink);
  font-size: 11px;
  font-weight: 600;
}
.ui-at-dial__tag svg { width: 11px; height: 11px; }
.ui-at-dial__tag[data-risk="destructive"] { border-color: var(--bad-line); background: var(--bad-fill); color: var(--bad-ink); }
.ui-at-dial__lock {
  appearance: none;
  flex: none;
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--muted);
  cursor: pointer;
  opacity: 0;
  transition: opacity 150ms var(--ease), background-color 150ms var(--ease), color 150ms var(--ease), transform 150ms var(--ease);
}
.ui-at-dial__lock svg { width: 15px; height: 15px; }
.ui-at-dial__row:hover .ui-at-dial__lock,
.ui-at-dial__lock:focus-visible,
.ui-at-dial__lock[aria-pressed="true"] { opacity: 1; }
.ui-at-dial__lock:hover { background: var(--soft); color: var(--ink); }
.ui-at-dial__lock:active { transform: scale(0.92); }
.ui-at-dial__lock[aria-pressed="true"] { color: var(--ink); }
.ui-at-dial__lock:focus-visible { outline: none; box-shadow: 0 0 0 3px var(--ring); }
.ui-at-dial__empty {
  display: grid;
  place-items: center;
  min-height: 42px;
  padding: 8px 12px;
  border-radius: 12px;
  border: 1px dashed var(--firm);
  background: var(--soft);
  color: var(--muted);
  font-size: 12px;
  text-align: center;
  animation: ui-at-dial-fade 300ms var(--ease) both;
}

.ui-at-dial__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}

@keyframes ui-at-dial-roll-up { from { transform: translateY(70%); opacity: 0; } to { transform: none; opacity: 1; } }
@keyframes ui-at-dial-roll-down { from { transform: translateY(-70%); opacity: 0; } to { transform: none; opacity: 1; } }
@keyframes ui-at-dial-fade { from { opacity: 0; } to { opacity: 1; } }

@container (max-width: 340px) {
  .ui-at-dial__detail { display: none; }
  .ui-at-dial__level { height: 30px; font-size: 12px; }
  .ui-at-dial__level > span { padding: 0 3px; }
  .ui-at-dial__row { padding-left: 10px; gap: 8px; }
}
@media (hover: none) {
  .ui-at-dial__lock { opacity: 1; width: 36px; height: 36px; }
  .ui-at-dial__row { min-height: 50px; }
  .ui-at-dial__level { height: 40px; }
}
@media (prefers-reduced-motion: reduce) {
  .ui-at-dial, .ui-at-dial *, .ui-at-dial *::before, .ui-at-dial *::after {
    transition-duration: 0ms !important;
    animation-duration: 0ms !important;
    animation-delay: 0ms !important;
  }
}
`;var h={viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:1.4,strokeLinecap:"round",strokeLinejoin:"round"},ce=()=>i("svg",{...h,children:[e("path",{d:"M4.25 2.25h5l2.5 2.5v9h-7.5z"}),e("path",{d:"M6.25 7.5h3.5M6.25 10h3.5"})]}),ge=()=>e("svg",{...h,children:e("path",{d:"M10.5 2.75 13.25 5.5 6 12.75H3.25V10z"})}),fe=()=>i("svg",{...h,children:[e("circle",{cx:"6",cy:"6",r:"2.25"}),e("path",{d:"M2.25 13c.5-2 1.9-3.25 3.75-3.25S9.25 11 9.75 13M10.5 4.5h3.25M10.5 7h3.25M11.5 9.5h2.25"})]}),ve=()=>e("svg",{...h,children:e("path",{d:"M13.75 2.25 7 9M13.75 2.25 9.5 13.75 7 9 2.25 6.5z"})}),he=()=>e("svg",{...h,children:e("path",{d:"M2.75 4.25h10.5M6.25 4.25V2.75h3.5v1.5M4.25 4.25l.6 9h6.3l.6-9"})}),me=()=>i("svg",{...h,children:[e("rect",{x:"2",y:"3.75",width:"12",height:"8.5",rx:"1.75"}),e("path",{d:"M2 6.5h12M4.5 9.75h2"})]}),xe=[{id:"read",label:"Read files and docs",risk:"safe",icon:e(ce,{})},{id:"draft",label:"Draft emails",risk:"safe",icon:e(ge,{})},{id:"crm",label:"Update CRM records",risk:"risky",icon:e(fe,{})},{id:"send",label:"Send emails",risk:"risky",icon:e(ve,{})},{id:"delete",label:"Delete files",risk:"destructive",icon:e(he,{})},{id:"spend",label:"Spend money",risk:"destructive",icon:e(me,{})}],k=[{level:1,pinned:["spend"]},{level:2,pinned:["spend"]},{level:2,pinned:["spend","delete"]},{level:0,pinned:["spend","delete"]},{level:1,pinned:["spend","delete"]},{level:1,pinned:["spend"]}];function _e(){let[t,n]=s(0),[u,A]=s(k[0].level),[N,M]=s(k[0].pinned),[L,R]=s(!0),C=l(null);y(()=>{if(!L)return;let d=setTimeout(()=>{let m=(t+1)%k.length;n(m),A(k[m].level),M(k[m].pinned)},1600);return()=>clearTimeout(d)},[t,L]);let I=()=>R(!1);return e("div",{ref:C,style:{width:"100%",maxWidth:400},onPointerDownCapture:I,onKeyDownCapture:I,children:e(K,{title:"Sales agent",actions:xe,level:u,onLevelChange:A,pinned:N,onPinnedChange:M})})}export{_e as default};
