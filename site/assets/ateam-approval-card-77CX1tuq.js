"use client";import{t as Oe}from"./react-BkAXpnfr.js";var He=Oe();var{Children:pa,Component:sa,Fragment:da,StrictMode:la,cloneElement:ua,createContext:ca,createElement:va,createRef:fa,forwardRef:ma,isValidElement:ba,lazy:ga,memo:ha,startTransition:xa,Suspense:_a,use:wa,useCallback:R,useContext:ka,useDebugValue:ya,useDeferredValue:Na,useEffect:c,useId:le,useImperativeHandle:Aa,useInsertionEffect:Ra,useLayoutEffect:ue,useMemo:Ea,useOptimistic:Ta,useReducer:Sa,useRef:d,useState:n,useSyncExternalStore:Ca,useTransition:Da}=He;import{t as Ke}from"./jsx-runtime-CTsRTJUX.js";var Fe=Ke(),{jsx:e,jsxs:r,Fragment:La}=Fe;var We={low:"Low",medium:"Medium",high:"High"};function Ve(){if(typeof navigator>"u")return!0;let o=navigator.userAgentData?.platform??navigator.platform??"";return/mac|iphone|ipad|ipod/i.test(o)}function Je(o){let i=Math.max(0,Math.ceil(o));return`${Math.floor(i/60)}:${String(i%60).padStart(2,"0")}`}function Ze(o){let i=Math.max(0,Math.ceil(o));if(i<60)return`${i} second${i===1?"":"s"}`;let p=Math.floor(i/60),v=i%60;return`${p} minute${p===1?"":"s"}${v?` ${v} second${v===1?"":"s"}`:""}`}function qe(o,i){let p=Math.floor((i-o)/6e4);return p<1?"just now":p<60?`${p} min ago`:`${Math.floor(p/60)} h ago`}function ce(){return typeof window<"u"&&window.matchMedia?.("(prefers-reduced-motion: reduce)").matches}function Ge(){return r("svg",{viewBox:"0 0 16 16","aria-hidden":"true",children:[e("path",{d:"M8 1.75 2.75 3.6v4.1c0 3.1 2.2 5.5 5.25 6.55 3.05-1.05 5.25-3.45 5.25-6.55V3.6L8 1.75Z"}),e("path",{d:"m5.75 8 1.6 1.6 2.9-3.1"})]})}function Qe(){return e("svg",{viewBox:"0 0 16 16","aria-hidden":"true",children:e("path",{pathLength:1,d:"m4.25 8.25 2.5 2.5 5-5.25"})})}function Ue(){return r("svg",{viewBox:"0 0 16 16","aria-hidden":"true",children:[e("path",{pathLength:1,d:"m5 5 6 6"}),e("path",{pathLength:1,d:"m11 5-6 6"})]})}function Xe(){return r("svg",{viewBox:"0 0 16 16","aria-hidden":"true",children:[e("circle",{pathLength:1,cx:"8",cy:"8",r:"5.25"}),e("path",{pathLength:1,d:"M8 5.25V8l1.75 1.25"})]})}function Ye(){return e("svg",{className:"ui-at-approve__spinner",viewBox:"0 0 16 16","aria-hidden":"true",children:e("circle",{cx:"8",cy:"8",r:"5.5"})})}function ve({title:o,description:i,risk:p,icon:v,details:m,preview:fe,children:me,status:O,defaultStatus:be="pending",onApprove:H,onDeny:K,onEdit:F,expiresIn:x,onExpire:W,allowAlways:ge=!0,alwaysLabel:he="Always allow this action",approveLabel:xe="Approve",denyLabel:_e="Deny",editLabel:we="Edit",shortcuts:V=!0,label:J,actions:E="tray",className:ke}){let T=le(),Z=`${T}-title`,q=`${T}-desc`,G=`${T}-timer`,S=O!==void 0,[ye,Ne]=n(be),t=S?O:ye,[f,C]=n(t==="pending"?null:{kind:t,at:Date.now()}),[l,_]=n(!1),[D,Q]=n(!1),[u,M]=n(x),[U,w]=n({hover:!1,focus:!1}),[Ae,X]=n(()=>Date.now()),[Y,$]=n(t),[Re,Ee]=n(""),[Te,Se]=n(!0),ee=d(null),ae=d(null),re=d(null),L=d(!1),k=d(!0),y=d(void 0),N=d({onApprove:H,onDeny:K,onExpire:W});N.current={onApprove:H,onDeny:K,onExpire:W},c(()=>(k.current=!0,Se(Ve()),()=>{k.current=!1,clearTimeout(y.current)}),[]);let Ce=t!=="pending"&&Y==="pending",b=t!=="pending"&&Y!=="pending",[De,Me]=n(void 0),[$e,Le]=n(!1),[Ie,te]=n(!1),I=d(void 0);c(()=>()=>clearTimeout(I.current),[]),ue(()=>{let a=ae.current;if(!a)return;let s=()=>Me(a.offsetHeight);s();let de=typeof ResizeObserver<"u"?new ResizeObserver(s):null;de?.observe(a);let Pe=requestAnimationFrame(()=>Le(!0));return()=>{de?.disconnect(),cancelAnimationFrame(Pe)}},[]);let ie=d(t);c(()=>{let a=ie.current;if(ie.current=t,a!==t){if(te(!0),clearTimeout(I.current),I.current=setTimeout(()=>te(!1),ce()?0:560),t==="pending"){clearTimeout(y.current),$("pending"),C(null),_(!1),Q(!1),M(x);return}if(C(s=>s&&s.kind==="expired"&&t==="denied"?s:{kind:t,at:Date.now()}),clearTimeout(y.current),a!=="pending"){$(t);return}L.current=!!ee.current?.contains(document.activeElement),y.current=setTimeout(()=>$(t),ce()?0:200)}},[t]),c(()=>{b&&(Ee(`${f?.kind==="approved"?"Approved":f?.kind==="expired"?"Expired":"Denied"}: ${o}`),L.current&&(L.current=!1,re.current?.focus({preventScroll:!0})))},[b,f,o]),c(()=>{if(!b)return;X(Date.now());let a=setInterval(()=>X(Date.now()),3e4);return()=>clearInterval(a)},[b]);let g=R(a=>{S||Ne(a)},[S]),oe=R(async()=>{if(t!=="pending"||l)return;let a=N.current.onApprove?.({always:D});if(a&&typeof a.then=="function"){_(!0);try{if(await a,!k.current)return;_(!1),g("approved")}catch{k.current&&_(!1)}return}g("approved")},[t,l,D,g]),A=R(a=>{t!=="pending"||l||(a==="timeout"&&C({kind:"expired",at:Date.now()}),N.current.onDeny?.({reason:a}),g("denied"))},[t,l,g]),ne=U.hover||U.focus||l;c(()=>{M(x)},[x]),c(()=>{if(t!=="pending"||u===void 0||ne||u<=0)return;let a=setTimeout(()=>M(s=>s===void 0?s:s-1),1e3);return()=>clearTimeout(a)},[t,u,ne]);let z=d(!1);c(()=>{if(t!=="pending"){z.current=!1;return}u!==void 0&&u<=0&&!z.current&&(z.current=!0,N.current.onExpire?.(),A("timeout"))},[u,t,A]);let ze=a=>{t==="pending"&&(a.key==="Enter"&&(a.metaKey||a.ctrlKey)?(a.preventDefault(),oe()):a.key==="Escape"&&(a.preventDefault(),A("user")))},j=fe??me,je=!!j||m&&m.length>0,Be=u!==void 0&&u<=10,B=u!==void 0&&t==="pending",h=f?.kind??(t==="approved"?"approved":"denied"),pe=h==="approved"?"Approved":h==="expired"?"Expired":"Denied",se=r("div",{className:"ui-at-approve__actions",children:[B&&r("span",{className:"ui-at-approve__timer","data-urgent":Be||void 0,"aria-hidden":"true",children:["Expires in ",Je(u)]}),F&&e("button",{type:"button",className:"ui-at-approve__btn","data-variant":"secondary",onClick:F,"aria-disabled":l||void 0,children:we}),r("button",{type:"button",className:"ui-at-approve__btn","data-variant":"ghost","aria-keyshortcuts":"Escape","aria-disabled":l||void 0,onClick:()=>A("user"),children:[_e,V&&e("kbd",{className:"ui-at-approve__kbd","aria-hidden":"true",children:"Esc"})]}),r("button",{type:"button",className:"ui-at-approve__btn","data-variant":"primary","data-busy":l||void 0,"aria-keyshortcuts":"Meta+Enter Control+Enter","aria-disabled":l||void 0,onClick:()=>void oe(),children:[xe,l?e(Ye,{}):V&&e("kbd",{className:"ui-at-approve__kbd","data-on":"berry","aria-hidden":"true",children:Te?"\u2318\u21B5":"Ctrl \u21B5"})]})]});return r("div",{ref:ee,className:["ui-at-approve",ke].filter(Boolean).join(" "),"data-status":t,"data-leaving":Ce||void 0,"data-actions":E,"data-ready":$e||void 0,"data-gliding":Ie||void 0,style:{height:De},onPointerEnter:()=>w(a=>({...a,hover:!0})),onPointerLeave:()=>w(a=>({...a,hover:!1})),onFocus:()=>w(a=>({...a,focus:!0})),onBlur:a=>{a.currentTarget.contains(a.relatedTarget)||w(s=>({...s,focus:!1}))},children:[e("style",{href:"ui-approval-card",precedence:"default",children:ea}),e("div",{ref:ae,className:"ui-at-approve__measure",children:b?e("div",{className:"ui-at-approve__resolved",children:r("div",{ref:re,className:"ui-at-approve__row","data-kind":h,tabIndex:-1,"aria-label":`${pe}: ${o}`,children:[e("span",{className:"ui-at-approve__mark","aria-hidden":"true",children:h==="approved"?e(Qe,{}):h==="expired"?e(Xe,{}):e(Ue,{})}),e("span",{className:"ui-at-approve__row-title",children:o}),r("span",{className:"ui-at-approve__row-meta",children:[pe,r("span",{className:"ui-at-approve__row-time",children:[" \xB7 ",f?qe(f.at,Ae):"just now"]})]})]})}):r("div",{className:"ui-at-approve__pending",role:"group","aria-labelledby":Z,"aria-describedby":[i?q:null,B?G:null].filter(Boolean).join(" ")||void 0,"aria-busy":l||void 0,onKeyDown:ze,children:[J&&e("div",{className:"ui-at-approve__label",children:J}),r("div",{className:"ui-at-approve__card",children:[r("div",{className:"ui-at-approve__head",children:[e("span",{className:"ui-at-approve__tile","aria-hidden":"true",children:v??e(Ge,{})}),r("div",{className:"ui-at-approve__heading",children:[e("h3",{id:Z,className:"ui-at-approve__title",children:o}),i&&e("p",{id:q,className:"ui-at-approve__desc",children:i})]}),p&&r("span",{className:"ui-at-approve__risk","data-risk":p,children:[e("span",{className:"ui-at-approve__dot","aria-hidden":"true"}),We[p],e("span",{className:"ui-at-approve__risk-word",children:" risk"})]})]}),je&&r("div",{className:"ui-at-approve__preview",children:[j&&e("div",{className:"ui-at-approve__custom",children:j}),m&&m.length>0&&e("dl",{className:"ui-at-approve__details",children:m.map((a,s)=>r("div",{className:"ui-at-approve__detail",children:[e("dt",{children:a.label}),e("dd",{children:a.value})]},`${a.label}-${s}`))})]}),ge&&r("label",{className:"ui-at-approve__check",children:[e("input",{type:"checkbox",checked:D,disabled:l,onChange:a=>Q(a.target.checked)}),e("span",{className:"ui-at-approve__box","aria-hidden":"true",children:e("svg",{viewBox:"0 0 12 12",children:e("path",{d:"m2.75 6.25 2 2 4.5-4.75"})})}),e("span",{children:he})]}),E==="card"&&se]}),E==="tray"&&se,B&&r("span",{id:G,className:"ui-at-approve__sr",children:["Expires in ",Ze(u)," unless approved. The countdown pauses while you are here."]})]})}),e("span",{className:"ui-at-approve__sr",role:"status","aria-live":"polite",children:Re})]})}var ea=`
.ui-at-approve {
  --frame: #f2f6fa;
  --panel: #ffffff;
  --soft: rgba(26, 62, 112, 0.06);
  --hairline: #dae2ec;
  --firm: #cbd6e4;
  --ink: #00162b;
  --text: rgba(0, 22, 43, 0.66);
  --muted: rgba(0, 22, 43, 0.54);
  --berry: #851437;
  --berry-hover: #6d0f2d;
  --secondary: #fbfcfe;
  --info-ink: #1a3e70;
  --ring: #8fbdf2;
  --ok-ink: #1d6a34;
  --ok-fill: #eafbee;
  --ok-line: #c9f5cf;
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
  max-width: 440px;
  container-type: inline-size;
  font-family: "Avenir Next", Avenir, system-ui, sans-serif;
  font-size: 13px;
  line-height: 1.45;
  color: var(--text);
  -webkit-font-smoothing: antialiased;
}
:where(.dark, [data-theme="dark"]) .ui-at-approve {
  --frame: #0f2747;
  --panel: #16345c;
  --soft: rgba(255, 255, 255, 0.07);
  --hairline: rgba(255, 255, 255, 0.12);
  --firm: rgba(255, 255, 255, 0.18);
  --ink: rgba(255, 255, 255, 0.94);
  --text: rgba(255, 255, 255, 0.72);
  --muted: rgba(255, 255, 255, 0.56);
  --berry: #a8204d;
  --berry-hover: #bd2a5a;
  --secondary: rgba(255, 255, 255, 0.06);
  --info-ink: #c1daff;
  --ring: rgba(143, 189, 242, 0.6);
  --ok-ink: #7fe0a0;
  --ok-fill: rgba(127, 224, 160, 0.14);
  --ok-line: rgba(127, 224, 160, 0.3);
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
.ui-at-approve[data-ready] { transition: height 300ms var(--ease); }
.ui-at-approve[data-gliding] { overflow: clip; overflow-clip-margin: 48px; }
.ui-at-approve *, .ui-at-approve *::before, .ui-at-approve *::after { box-sizing: border-box; }
.ui-at-approve__measure { display: block; }

.ui-at-approve__pending,
.ui-at-approve__resolved {
  background: var(--frame);
  border: 1px solid var(--hairline);
  border-radius: 22px;
  padding: 6px;
  box-shadow: var(--shadow-float);
  transition: opacity 180ms var(--ease), filter 180ms var(--ease), transform 180ms var(--ease);
}
.ui-at-approve[data-leaving] .ui-at-approve__pending {
  opacity: 0;
  filter: blur(4px);
  transform: scale(0.985);
  pointer-events: none;
}
.ui-at-approve__label {
  padding: 4px 10px 8px;
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: var(--muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ui-at-approve__card {
  background: var(--panel);
  border: 1px solid var(--hairline);
  border-radius: 16px;
  padding: 14px;
  box-shadow: var(--shadow-raised);
  display: grid;
  gap: 12px;
}

.ui-at-approve__head { display: flex; align-items: flex-start; gap: 10px; min-width: 0; }
.ui-at-approve__tile {
  flex: none;
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: var(--panel);
  border: 1px solid var(--hairline);
  box-shadow: inset 0 -2px 6px -4px var(--pebble-light);
  color: var(--ink);
}
.ui-at-approve__tile svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.4;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.ui-at-approve__heading { flex: 1; min-width: 0; }
.ui-at-approve__title {
  margin: 0;
  font-family: "Avenir Next Condensed", "Avenir Next", Avenir, system-ui, sans-serif;
  font-weight: 700;
  font-size: 16px;
  line-height: 1.25;
  color: var(--ink);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ui-at-approve__desc {
  margin: 1px 0 0;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ui-at-approve__risk {
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  border: 1px solid var(--hairline);
  background: var(--soft);
  color: var(--text);
  font-size: 11.5px;
  font-weight: 600;
  white-space: nowrap;
}
.ui-at-approve__risk-word { font-weight: 500; opacity: 0.8; }
.ui-at-approve__dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
.ui-at-approve__risk[data-risk="medium"] { background: var(--wait-fill); border-color: var(--wait-line); color: var(--wait-ink); }
.ui-at-approve__risk[data-risk="high"] { background: var(--bad-fill); border-color: var(--bad-line); color: var(--bad-ink); }

.ui-at-approve__preview {
  background: var(--soft);
  border: 1px solid var(--hairline);
  border-radius: 12px;
  padding: 10px 12px;
  display: grid;
  gap: 10px;
  min-width: 0;
}
.ui-at-approve__custom { min-width: 0; }
.ui-at-approve__custom + .ui-at-approve__details { border-top: 1px solid var(--hairline); padding-top: 10px; }
.ui-at-approve__details { margin: 0; display: grid; gap: 6px; }
.ui-at-approve__detail { display: grid; grid-template-columns: minmax(56px, auto) 1fr; gap: 12px; min-width: 0; }
.ui-at-approve__detail dt { color: var(--muted); }
.ui-at-approve__detail dd { margin: 0; color: var(--ink); min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.ui-at-approve__check {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  justify-self: start;
  color: var(--text);
  cursor: pointer;
  user-select: none;
}
.ui-at-approve__check input { position: absolute; opacity: 0; width: 16px; height: 16px; margin: 0; cursor: pointer; }
.ui-at-approve__box {
  display: grid;
  place-items: center;
  width: 16px;
  height: 16px;
  border-radius: 5px;
  border: 1px solid var(--firm);
  background: var(--panel);
  box-shadow: inset 0 1px 2px rgba(26, 62, 112, 0.08);
  transition: background-color 150ms var(--ease), border-color 150ms var(--ease);
}
.ui-at-approve__box svg {
  width: 12px;
  height: 12px;
  fill: none;
  stroke: #fff;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
  transform: scale(0.4);
  opacity: 0;
  transition: transform 150ms var(--ease), opacity 150ms var(--ease);
}
.ui-at-approve__check input:checked + .ui-at-approve__box { background: var(--berry); border-color: var(--berry); }
.ui-at-approve__check input:checked + .ui-at-approve__box svg { transform: scale(1); opacity: 1; }
.ui-at-approve__check input:focus-visible + .ui-at-approve__box { box-shadow: 0 0 0 3px var(--ring); }
.ui-at-approve__check input:disabled ~ * { opacity: 0.55; cursor: default; }

.ui-at-approve__actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding: 8px 4px 2px 10px;
  min-width: 0;
}
.ui-at-approve[data-actions="card"] .ui-at-approve__actions { padding: 2px 0 0; }
.ui-at-approve__timer {
  margin-right: auto;
  color: var(--muted);
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  transition: color 300ms var(--ease);
}
.ui-at-approve__timer[data-urgent] { color: var(--wait-ink); font-weight: 600; }
.ui-at-approve__btn {
  appearance: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 34px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid transparent;
  font: inherit;
  font-weight: 600;
  font-size: 13px;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 150ms var(--ease), transform 150ms var(--ease), opacity 150ms var(--ease), box-shadow 150ms var(--ease);
}
.ui-at-approve__btn:active:not([aria-disabled]) { transform: scale(0.97); }
.ui-at-approve__btn:focus-visible { outline: none; box-shadow: 0 0 0 3px var(--ring); }
.ui-at-approve__btn[aria-disabled] { cursor: default; }
.ui-at-approve__btn[data-variant="ghost"] { background: transparent; color: var(--ink); }
.ui-at-approve__btn[data-variant="ghost"]:hover:not([aria-disabled]) { background: var(--soft); }
.ui-at-approve__btn[data-variant="ghost"][aria-disabled] { opacity: 0.5; }
.ui-at-approve__btn[data-variant="secondary"] {
  background: var(--secondary);
  border-color: var(--firm);
  color: var(--ink);
  box-shadow: var(--shadow-drop);
}
.ui-at-approve__btn[data-variant="secondary"][aria-disabled] { opacity: 0.5; }
.ui-at-approve__btn[data-variant="primary"] {
  background: var(--berry);
  color: #fff;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 6px 12px -6px rgba(133, 20, 55, 0.6);
}
.ui-at-approve__btn[data-variant="primary"]:hover:not([aria-disabled]) { background: var(--berry-hover); }
.ui-at-approve__kbd {
  display: inline-grid;
  place-items: center;
  min-width: 20px;
  height: 18px;
  padding: 0 5px;
  border-radius: 5px;
  border: 1px solid var(--hairline);
  border-bottom-color: var(--firm);
  background: var(--panel);
  color: var(--muted);
  font: 500 10.5px/1 "Avenir Next", Avenir, system-ui, sans-serif;
}
.ui-at-approve__kbd[data-on="berry"] {
  background: rgba(255, 255, 255, 0.14);
  border-color: rgba(255, 255, 255, 0.28);
  color: rgba(255, 255, 255, 0.9);
}
.ui-at-approve__spinner {
  width: 14px;
  height: 14px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-dasharray: 22 40;
  animation: ui-at-approve-spin 700ms linear infinite;
}
@keyframes ui-at-approve-spin { to { transform: rotate(360deg); } }

.ui-at-approve__resolved { padding: 4px; border-radius: 20px; animation: ui-at-approve-in 300ms var(--ease) both; }
.ui-at-approve__row {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  min-height: 46px;
  padding: 10px 14px;
  border-radius: 16px;
  background: var(--panel);
  border: 1px solid var(--hairline);
  box-shadow: var(--shadow-raised);
}
.ui-at-approve__row:focus { outline: none; }
.ui-at-approve__row:focus-visible { box-shadow: var(--shadow-raised), 0 0 0 3px var(--ring); }
.ui-at-approve__mark {
  flex: none;
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 1px solid var(--ok-line);
  background: var(--ok-fill);
  color: var(--ok-ink);
}
.ui-at-approve__row[data-kind="denied"] .ui-at-approve__mark { border-color: var(--bad-line); background: var(--bad-fill); color: var(--bad-ink); }
.ui-at-approve__row[data-kind="expired"] .ui-at-approve__mark { border-color: var(--wait-line); background: var(--wait-fill); color: var(--wait-ink); }
.ui-at-approve__mark svg {
  width: 13px;
  height: 13px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.9;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.ui-at-approve__mark svg > * {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: ui-at-approve-draw 300ms var(--ease) 120ms forwards;
}
.ui-at-approve__mark svg > *:nth-child(2) { animation-delay: 220ms; }
.ui-at-approve__row-title {
  flex: 1;
  min-width: 0;
  color: var(--ink);
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ui-at-approve__row-meta { flex: none; color: var(--muted); font-size: 12px; white-space: nowrap; }
@keyframes ui-at-approve-draw { to { stroke-dashoffset: 0; } }
@keyframes ui-at-approve-in { from { opacity: 0; filter: blur(3px); } to { opacity: 1; filter: none; } }

.ui-at-approve__sr {
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

@container (max-width: 400px) {
  .ui-at-approve__actions { flex-wrap: wrap; padding-left: 4px; }
  .ui-at-approve__timer { flex-basis: 100%; padding: 0 6px 2px; }
  .ui-at-approve__actions .ui-at-approve__btn { flex: 1 1 0; }
  .ui-at-approve__kbd { display: none; }
}
@container (max-width: 340px) {
  .ui-at-approve__risk-word, .ui-at-approve__row-time { display: none; }
}
@media (hover: none) {
  .ui-at-approve__kbd { display: none; }
  .ui-at-approve__btn { height: 40px; }
}
@media (prefers-reduced-motion: reduce) {
  .ui-at-approve, .ui-at-approve *, .ui-at-approve *::before, .ui-at-approve *::after {
    transition-duration: 0ms !important;
    animation-duration: 0ms !important;
    animation-delay: 0ms !important;
  }
  .ui-at-approve__spinner { animation-duration: 1600ms !important; }
  .ui-at-approve[data-leaving] .ui-at-approve__pending { transform: none; filter: none; }
}
`;var aa=o=>new Promise(i=>setTimeout(i,o)),P=["Mia","Jonas","Sara","Alex"];function ra(){return r("svg",{viewBox:"0 0 16 16","aria-hidden":"true",children:[e("rect",{x:"2.25",y:"3.5",width:"11.5",height:"9",rx:"2"}),e("path",{d:"m2.75 4.75 5.25 4 5.25-4"})]})}function ta(){return r("div",{style:{display:"flex",alignItems:"center",gap:10,minWidth:0},children:[e("span",{style:{display:"flex",flex:"none"},"aria-hidden":"true",children:P.map((o,i)=>e("span",{className:"demo-at-approve__avatar",style:{marginLeft:i?-6:0,zIndex:P.length-i},children:o[0]},o))}),r("span",{style:{minWidth:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:[e("span",{className:"demo-at-approve__names",children:P.join(", ")})," ",e("span",{className:"demo-at-approve__more",children:"+38 more"})]})]})}function ia(){let[o,i]=n("pending"),p=d(void 0);return c(()=>{if(o!=="pending")return p.current=setTimeout(()=>i("pending"),2600),()=>clearTimeout(p.current)},[o]),r("div",{className:"demo-at-approve",children:[e("style",{href:"demo-at-approve",precedence:"default",children:oa}),r("div",{className:"demo-at-approve__bubble",children:[e("span",{className:"demo-at-approve__agent","aria-hidden":"true",children:e("svg",{viewBox:"0 0 16 16",children:e("path",{d:"M8 2.5c.4 2.7 1.8 4.1 4.5 4.5-2.7.4-4.1 1.8-4.5 4.5C7.6 8.8 6.2 7.4 3.5 7c2.7-.4 4.1-1.8 4.5-4.5Z"})})}),e("p",{children:"I drafted the October newsletter. Ready to send?"})]}),e(ve,{title:"Send campaign email",description:"October product update \xB7 Newsletter",risk:"medium",icon:e(ra,{}),status:o,details:[{label:"Subject",value:"What's new in October"},{label:"Send",value:"Today, 9:00 AM"}],onApprove:async()=>{await aa(900),i("approved")},onDeny:()=>i("denied"),children:e(ta,{})})]})}var oa=`
.demo-at-approve {
  --ink: #00162b;
  --bubble: #eef5ff;
  --bubble-line: #c1daff;
  --avatar: #ffffff;
  --avatar-line: #dae2ec;
  --muted: rgba(0, 22, 43, 0.54);
  width: 100%;
  max-width: 440px;
  display: grid;
  gap: 14px;
  font-family: "Avenir Next", Avenir, system-ui, sans-serif;
}
:where(.dark, [data-theme="dark"]) .demo-at-approve {
  --ink: rgba(255, 255, 255, 0.94);
  --bubble: rgba(143, 189, 242, 0.16);
  --bubble-line: rgba(143, 189, 242, 0.3);
  --avatar: #16345c;
  --avatar-line: rgba(255, 255, 255, 0.18);
  --muted: rgba(255, 255, 255, 0.56);
}
.demo-at-approve__bubble { display: flex; align-items: center; gap: 10px; min-width: 0; }
.demo-at-approve__bubble p {
  margin: 0;
  padding: 8px 14px;
  border-radius: 16px;
  background: var(--bubble);
  border: 1px solid var(--bubble-line);
  color: var(--ink);
  font-size: 14px;
  line-height: 1.4;
}
.demo-at-approve__agent {
  flex: none;
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #00162b;
  color: #fff;
}
:where(.dark, [data-theme="dark"]) .demo-at-approve__agent { background: #ffffff; color: #00162b; }
.demo-at-approve__agent svg { width: 12px; height: 12px; fill: currentColor; }
.demo-at-approve__avatar {
  position: relative;
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--avatar);
  border: 1px solid var(--avatar-line);
  color: var(--ink);
  font-size: 10.5px;
  font-weight: 600;
}
.demo-at-approve__names { color: var(--ink); }
.demo-at-approve__more { color: var(--muted); }
`;export{ia as default};
