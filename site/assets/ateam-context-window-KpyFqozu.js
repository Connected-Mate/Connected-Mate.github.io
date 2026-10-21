"use client";import{t as Mt}from"./react-BkAXpnfr.js";var Nt=Mt();var{Children:jt,Component:qt,Fragment:Kt,StrictMode:Ut,cloneElement:Vt,createContext:Jt,createElement:Xt,createRef:Gt,forwardRef:Qt,isValidElement:Yt,lazy:Zt,memo:te,startTransition:ee,Suspense:ae,use:ie,useCallback:ne,useContext:oe,useDebugValue:re,useDeferredValue:se,useEffect:$,useId:ot,useImperativeHandle:ce,useInsertionEffect:le,useLayoutEffect:de,useMemo:ue,useOptimistic:pe,useReducer:me,useRef:T,useState:c,useSyncExternalStore:xe,useTransition:fe}=Nt;import{t as St}from"./jsx-runtime-CTsRTJUX.js";var $t=St(),{jsx:a,jsxs:l,Fragment:rt}=$t;var Tt=.28,Pt=.95;function x(n){let r=Math.max(0,n);return r>=1e6?`${st((r/1e6).toFixed(r>=1e7?0:1))}M`:r>=1e3?`${st((r/1e3).toFixed(1))}K`:String(Math.round(r))}function st(n){return n.endsWith(".0")?n.slice(0,-2):n}function Rt(n,r){return n.items&&n.items.length?n.items.filter(f=>!r.includes(`${n.id}/${f.id}`)).reduce((f,h)=>f+Math.max(0,h.tokens),0):Math.max(0,n.tokens??0)}function G(){return typeof window<"u"&&window.matchMedia?.("(prefers-reduced-motion: reduce)").matches}function Et(n,r=600){let[f,h]=c(n),g=T(n);return $(()=>{let _=g.current;if(_===n||G()){g.current=n,h(n);return}let m=0,k=performance.now(),d=p=>{let u=Math.min(1,(p-k)/r),w=1-Math.pow(1-u,3),y=_+(n-_)*w;g.current=y,h(y),u<1&&(m=requestAnimationFrame(d))};return m=requestAnimationFrame(d),()=>cancelAnimationFrame(m)},[n,r]),f}var W={viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:1.5,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!0},Lt=()=>a("svg",{...W,children:a("path",{d:"m5 6.5 3 3 3-3"})}),At=()=>a("svg",{...W,children:a("path",{d:"M8 2.5v4M6 4.75 8 6.75l2-2M8 13.5v-4M6 11.25l2-2 2 2M3.5 8h9"})}),It=()=>a("svg",{...W,children:a("path",{d:"m4 8.25 2.5 2.5 5.5-5.5"})}),zt=()=>a("svg",{...W,children:a("path",{d:"m5 5 6 6m0-6-6 6"})}),Ft=()=>a("svg",{...W,children:a("path",{d:"M3.5 8h9M9 4.5 12.5 8 9 11.5"})});function ct({parts:n,limit:r,title:f="Context window",model:h,modelIcon:g,onRemoveItem:_,onCompact:m,action:k,warnAt:d=.8,cells:p=216,columns:u=36,className:w}){let y=ot(),[Y,dt]=c([]),[Z,tt]=c([]),[ut,pt]=c([]),[P,R]=c(null),[et,mt]=c({}),[b,H]=c(null),[K,U]=c({}),[O,A]=c(null),[xt,D]=c(null),at=T([]),I=T(!0);$(()=>(I.current=!0,()=>{I.current=!1,at.current.forEach(clearTimeout)}),[]);let E=(t,e)=>{at.current.push(setTimeout(()=>I.current&&e(),t))},N=Math.max(1,r),v=n.map((t,e)=>{let i=Rt(t,_?[]:Y),o=et[t.id]!==void 0&&!m?Math.min(i,et[t.id]):i;return{part:t,tokens:o,color:t.color??`var(--c${e%6+1})`}}),z=v.reduce((t,e)=>t+e.tokens,0),V=z/N,B=V>=Pt?"full":V>=d?"warn":"ok";$(()=>{let t=!1,e={...K};for(let i of v){let o=K[i.part.id];o!==void 0&&i.tokens>o&&(delete e[i.part.id],t=!0)}t&&U(e)});let ft=N/Math.max(1,p),F=[];{let t=v.map(i=>i.tokens>0?Math.max(1,Math.round(i.tokens/ft)):0),e=t.reduce((i,o)=>i+o,0);for(;e>p;){let i=t.indexOf(Math.max(...t));if(t[i]<=1)break;t[i]-=1,e-=1}for(t=t.map(i=>Math.max(0,i)),t.forEach((i,o)=>{for(let s=0;s<i&&F.length<p;s++)F.push(o)});F.length<p;)F.push(null)}let ht=t=>pt(e=>e.includes(t)?e.filter(i=>i!==t):[...e,t]),_t=(t,e)=>{let i=`${t}/${e}`;Z.includes(i)||(tt(o=>[...o,i]),E(G()?0:240,()=>{tt(o=>o.filter(s=>s!==i)),_?_(t,e):dt(o=>[...o,i])}))},bt=async t=>{if(b)return;let e=v.find(o=>o.part.id===t)?.tokens??0;H(t),A(null);let i=o=>{H(null),U(s=>({...s,[t]:o})),A({partId:t,tokens:Math.max(0,e-o)}),D(t),E(1600,()=>D(s=>s===t?null:s)),E(3200,()=>A(s=>s?.partId===t?null:s))};if(m){try{await m(t)}catch{I.current&&H(null);return}if(!I.current)return;J.current={partId:t,before:e},H(null);return}E(G()?0:1100,()=>{let o=Math.round(e*Tt);mt(s=>({...s,[t]:o})),i(o)})},J=T(null);$(()=>{let t=J.current;if(!t)return;J.current=null;let e=v.find(i=>i.part.id===t.partId)?.tokens??0;U(i=>({...i,[t.partId]:e})),A({partId:t.partId,tokens:Math.max(0,t.before-e)}),D(t.partId),E(1600,()=>D(i=>i===t.partId?null:i)),E(3200,()=>A(i=>i?.partId===t.partId?null:i))});let S=P?v.find(t=>t.part.id===P):void 0,gt=Et(S?S.tokens:z),vt=Math.round((S?S.tokens:z)/N*100),j=Math.max(0,N-z),L=`${x(j)} free`,X="muted";b?L="Compacting\u2026":O?(L=`Saved ${x(O.tokens)} tokens`,X="ok"):B==="full"?(L=`Window is full \u2013 ${x(j)} left`,X="bad"):B==="warn"&&(L=`${x(j)} left`);let kt=b?`Compacting ${v.find(t=>t.part.id===b)?.part.label??""}`:O?`Compacted. Saved ${x(O.tokens)} tokens.`:B!=="ok"?`${x(j)} tokens left of ${x(N)}.`:"";return l("div",{className:["ui-at-ctx",w].filter(Boolean).join(" "),role:"group","aria-labelledby":`${y}-title`,"data-level":B,style:{"--cols":u,"--cols-narrow":Math.max(6,Math.round(u/2))},children:[a("style",{href:"ui-context-window",precedence:"default",children:Wt}),l("div",{className:"ui-at-ctx__panel",children:[l("div",{className:"ui-at-ctx__head",children:[a("h3",{id:`${y}-title`,className:"ui-at-ctx__title",children:f}),h&&l("span",{className:"ui-at-ctx__model",title:h,children:[g&&a("span",{className:"ui-at-ctx__model-icon","aria-hidden":"true",children:g}),a("span",{className:"ui-at-ctx__model-name",children:h})]})]}),l("div",{className:"ui-at-ctx__numbers",children:[a("span",{className:"ui-at-ctx__big","aria-hidden":"true",children:x(gt)}),a("span",{className:"ui-at-ctx__of","aria-hidden":"true",children:S?S.part.label:`of ${x(N)} tokens`},S?.part.id??"all"),l("span",{className:"ui-at-ctx__pct","aria-hidden":"true",children:[vt,"%"]}),l("span",{className:"ui-at-ctx__sr",children:[z.toLocaleString("en-US")," of ",N.toLocaleString("en-US")," tokens used, ",Math.round(V*100),"percent."]})]}),a("div",{className:"ui-at-ctx__field","aria-hidden":"true",onPointerLeave:()=>R(null),children:F.map((t,e)=>{let i=t===null?void 0:v[t],o=i?.part.id;return a("span",{className:"ui-at-ctx__cell","data-empty":t===null||void 0,"data-dim":P!==null&&o!==P||void 0,"data-shimmer":b!==null&&o===b||void 0,onPointerEnter:()=>R(o??null),style:{"--cell":i?i.color:void 0,"--i":e}},e)})}),a("ul",{className:"ui-at-ctx__parts",children:v.map(t=>{let e=t.part,i=(e.items??[]).filter(M=>_||!Y.includes(`${e.id}/${M.id}`)),o=i.length>0,s=o&&ut.includes(e.id),C=K[e.id]!==void 0,wt=e.compact&&!e.locked&&t.tokens>0,it=`${y}-items-${e.id}`,nt=l(rt,{children:[a("span",{className:"ui-at-ctx__swatch",style:{"--cell":t.color}}),a("span",{className:"ui-at-ctx__label",children:e.label}),o&&a("span",{className:"ui-at-ctx__chev","data-open":s||void 0,children:a(Lt,{})})]});return l("li",{className:"ui-at-ctx__part","data-dim":P!==null&&P!==e.id||void 0,onPointerEnter:()=>R(e.id),onPointerLeave:()=>R(null),children:[l("div",{className:"ui-at-ctx__line",children:[o?a("button",{type:"button",className:"ui-at-ctx__name","aria-expanded":s,"aria-controls":it,onClick:()=>ht(e.id),onFocus:()=>R(e.id),onBlur:()=>R(null),children:nt}):a("span",{className:"ui-at-ctx__name",children:nt}),wt&&(C&&xt!==e.id?null:l("button",{type:"button",className:"ui-at-ctx__compact","data-state":b===e.id?"busy":C?"done":void 0,"aria-disabled":b!==null||C||void 0,"aria-label":C?`${e.label} compacted`:`Compact ${e.label}`,onClick:()=>!C&&void bt(e.id),children:[a("span",{className:"ui-at-ctx__compact-icon",children:b===e.id?a("span",{className:"ui-at-ctx__spin"}):C?a(It,{}):a(At,{})},b===e.id?"busy":C?"done":"idle"),a("span",{className:"ui-at-ctx__compact-label",children:C?"Compacted":"Compact"})]})),a("span",{className:"ui-at-ctx__tokens",children:x(t.tokens)})]}),e.items&&e.items.length>0&&a("div",{id:it,className:"ui-at-ctx__fold","data-open":s||void 0,inert:!s,children:a("div",{children:a("ul",{className:"ui-at-ctx__items",children:i.map(M=>{let yt=`${e.id}/${M.id}`,Ct=Z.includes(yt);return a("li",{className:"ui-at-ctx__fold","data-open":!Ct||void 0,children:a("div",{children:l("div",{className:"ui-at-ctx__item",children:[a("span",{className:"ui-at-ctx__item-label",children:M.label}),a("span",{className:"ui-at-ctx__tokens","data-soft":"",children:x(M.tokens)}),!e.locked&&a("button",{type:"button",className:"ui-at-ctx__remove","aria-label":`Remove ${M.label}`,onClick:()=>_t(e.id,M.id),children:a(zt,{})})]})})},M.id)})})})})]},e.id)})})]}),l("div",{className:"ui-at-ctx__tray",children:[a("p",{className:"ui-at-ctx__tray-text","data-tone":X,children:L},L.replace(/[\d.]+[KM]?/g,"#")),a("span",{className:"ui-at-ctx__sr",role:"status","aria-live":"polite",children:kt}),k&&l("button",{type:"button",className:"ui-at-ctx__action",onClick:k.onClick,children:[k.label,a(Ft,{})]})]})]})}var Wt=`
.ui-at-ctx {
  --frame: #f2f6fa;
  --panel: #ffffff;
  --soft: rgba(26, 62, 112, 0.06);
  --cell-empty: rgba(26, 62, 112, 0.09);
  --hairline: #dae2ec;
  --firm: #cbd6e4;
  --ink: #00162b;
  --text: rgba(0, 22, 43, 0.66);
  --muted: rgba(0, 22, 43, 0.54);
  --ring: #8fbdf2;
  --ok-ink: #1d6a34;
  --ok-fill: #eafbee;
  --ok-line: #c9f5cf;
  --wait-ink: #775810;
  --bad-ink: #8a3a22;
  --c1: #00162b;
  --c2: #6b7f99;
  --c3: #b4c2d4;
  --c4: #2d5fa6;
  --c5: #8fbdf2;
  --c6: #851437;
  --shadow-drop: 0 8px 16px -8px rgba(26, 62, 112, 0.2);
  --shadow-raised: 0 18px 30px -16px rgba(26, 62, 112, 0.38), 0 4px 10px -6px rgba(26, 62, 112, 0.18);
  --shadow-float: 0 24px 48px -24px rgba(26, 62, 112, 0.3);
  --ease: cubic-bezier(0.16, 1, 0.3, 1);
  --mono: ui-monospace, "SF Mono", Menlo, Consolas, monospace;

  position: relative;
  box-sizing: border-box;
  width: 100%;
  max-width: 360px;
  min-width: 0;
  container-type: inline-size;
  background: var(--frame);
  border: 1px solid var(--hairline);
  border-radius: 22px;
  padding: 6px;
  box-shadow: var(--shadow-float);
  font-family: "Avenir Next", Avenir, system-ui, sans-serif;
  font-size: 13px;
  line-height: 1.45;
  color: var(--text);
  -webkit-font-smoothing: antialiased;
}
:where(.dark, [data-theme="dark"]) .ui-at-ctx {
  --frame: #0f2747;
  --panel: #16345c;
  --soft: rgba(255, 255, 255, 0.07);
  --cell-empty: rgba(255, 255, 255, 0.08);
  --hairline: rgba(255, 255, 255, 0.12);
  --firm: rgba(255, 255, 255, 0.18);
  --ink: rgba(255, 255, 255, 0.94);
  --text: rgba(255, 255, 255, 0.72);
  --muted: rgba(255, 255, 255, 0.56);
  --ring: rgba(143, 189, 242, 0.6);
  --ok-ink: #7fe0a0;
  --ok-fill: rgba(127, 224, 160, 0.14);
  --ok-line: rgba(127, 224, 160, 0.3);
  --wait-ink: #f3d27a;
  --bad-ink: #f2a48c;
  --c1: #eef4fb;
  --c2: #9db0c8;
  --c3: #536c8d;
  --c4: #6f9fe0;
  --c5: #c1daff;
  --c6: #e0628b;
  --shadow-drop: 0 8px 16px -8px rgba(3, 12, 28, 0.6);
  --shadow-raised: 0 18px 30px -16px rgba(3, 12, 28, 0.8), 0 4px 10px -6px rgba(3, 12, 28, 0.6);
  --shadow-float: 0 24px 48px -24px rgba(3, 12, 28, 0.7);
}
.ui-at-ctx *, .ui-at-ctx *::before, .ui-at-ctx *::after { box-sizing: border-box; }
.ui-at-ctx p, .ui-at-ctx h3, .ui-at-ctx ul { margin: 0; padding: 0; }
.ui-at-ctx ul { list-style: none; }

.ui-at-ctx__panel {
  background: var(--panel);
  border: 1px solid var(--hairline);
  border-radius: 16px;
  box-shadow: var(--shadow-raised);
  padding: 12px 14px 8px;
}
.ui-at-ctx__head { display: flex; align-items: center; justify-content: space-between; gap: 10px; min-width: 0; }
.ui-at-ctx__title {
  font-family: "Avenir Next Condensed", "Avenir Next", Avenir, system-ui, sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: var(--ink);
  white-space: nowrap;
}
.ui-at-ctx__model {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  min-width: 0;
  height: 22px;
  padding: 0 7px;
  border-radius: 7px;
  border: 1px solid var(--hairline);
  background: var(--soft);
  color: var(--text);
  font: 500 11px/1 var(--mono);
}
.ui-at-ctx__model-icon { display: grid; place-items: center; width: 12px; height: 12px; flex: none; }
.ui-at-ctx__model-icon > * { width: 12px; height: 12px; }
.ui-at-ctx__model-name { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.ui-at-ctx__numbers { display: flex; align-items: baseline; gap: 6px; margin: 8px 0 10px; min-width: 0; }
.ui-at-ctx__big { font-size: 24px; font-weight: 700; color: var(--ink); letter-spacing: -0.01em; font-variant-numeric: tabular-nums; }
.ui-at-ctx__of { flex: 1; min-width: 0; color: var(--muted); font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; animation: ui-at-ctx-fade 300ms var(--ease) both; }
.ui-at-ctx__pct { color: var(--muted); font-size: 12px; font-weight: 600; font-variant-numeric: tabular-nums; transition: color 300ms var(--ease); }
.ui-at-ctx[data-level="warn"] .ui-at-ctx__pct { color: var(--wait-ink); }
.ui-at-ctx[data-level="full"] .ui-at-ctx__pct { color: var(--bad-ink); }

.ui-at-ctx__field {
  display: grid;
  grid-template-columns: repeat(var(--cols), minmax(0, 1fr));
  gap: 2px;
  margin-bottom: 6px;
}
.ui-at-ctx__cell {
  aspect-ratio: 1;
  border-radius: 2px;
  background: var(--cell, var(--cell-empty));
  transition: background-color 220ms var(--ease) calc(var(--i) * 2ms), opacity 150ms var(--ease);
}
.ui-at-ctx__cell[data-empty] { background: var(--cell-empty); }
.ui-at-ctx__cell[data-dim] { opacity: 0.22; }
.ui-at-ctx__cell[data-shimmer] { animation: ui-at-ctx-shimmer 1100ms ease-in-out calc(var(--i) * 8ms) infinite; }

.ui-at-ctx__parts { display: grid; }
.ui-at-ctx__part { transition: opacity 150ms var(--ease); }
.ui-at-ctx__part[data-dim] { opacity: 0.5; }
.ui-at-ctx__line { display: flex; align-items: center; gap: 8px; min-height: 30px; min-width: 0; }
.ui-at-ctx__name {
  appearance: none;
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  padding: 0;
  margin: 0;
  border: 0;
  background: none;
  color: var(--text);
  font: inherit;
  text-align: left;
}
button.ui-at-ctx__name { cursor: pointer; border-radius: 6px; }
button.ui-at-ctx__name:hover { color: var(--ink); }
button.ui-at-ctx__name:focus-visible { outline: none; box-shadow: 0 0 0 3px var(--ring); }
.ui-at-ctx__swatch { flex: none; width: 8px; height: 8px; border-radius: 2px; background: var(--cell); }
.ui-at-ctx__label { min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ui-at-ctx__chev { display: grid; place-items: center; width: 14px; height: 14px; flex: none; color: var(--muted); transition: transform 300ms var(--ease); }
.ui-at-ctx__chev svg { width: 13px; height: 13px; }
.ui-at-ctx__chev[data-open] { transform: rotate(180deg); }
.ui-at-ctx__tokens { flex: none; color: var(--ink); font-variant-numeric: tabular-nums; }
.ui-at-ctx__tokens[data-soft] { color: var(--muted); }

.ui-at-ctx__compact {
  appearance: none;
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 24px;
  padding: 0 8px;
  border-radius: 8px;
  border: 1px solid var(--hairline);
  background: var(--panel);
  box-shadow: var(--shadow-drop);
  color: var(--ink);
  font: inherit;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  animation: ui-at-ctx-fade 300ms var(--ease) both;
  transition: background-color 150ms var(--ease), color 300ms var(--ease), border-color 300ms var(--ease), transform 150ms var(--ease);
}
.ui-at-ctx__compact:hover:not([aria-disabled]) { background: var(--soft); }
.ui-at-ctx__compact:active:not([aria-disabled]) { transform: scale(0.96); }
.ui-at-ctx__compact:focus-visible { outline: none; box-shadow: 0 0 0 3px var(--ring); }
.ui-at-ctx__compact[aria-disabled] { cursor: default; }
.ui-at-ctx__compact[data-state="busy"] { color: var(--text); }
.ui-at-ctx__compact[data-state="done"] {
  border-color: var(--ok-line);
  background: var(--ok-fill);
  color: var(--ok-ink);
  box-shadow: none;
  animation: ui-at-ctx-done 1600ms var(--ease) both;
}
.ui-at-ctx__compact-icon { display: grid; place-items: center; width: 13px; height: 13px; animation: ui-at-ctx-pop 200ms var(--ease) both; }
.ui-at-ctx__compact-icon svg { width: 13px; height: 13px; }
.ui-at-ctx__spin {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  border: 1.5px solid currentColor;
  border-right-color: transparent;
  animation: ui-at-ctx-spin 700ms linear infinite;
}

.ui-at-ctx__fold {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  transition: grid-template-rows 300ms var(--ease), opacity 300ms var(--ease);
}
.ui-at-ctx__fold > div { min-height: 0; overflow: hidden; }
.ui-at-ctx__fold[data-open] { grid-template-rows: 1fr; opacity: 1; }
.ui-at-ctx__items { padding: 2px 0 4px 16px !important; }
.ui-at-ctx__item { display: flex; align-items: center; gap: 8px; min-height: 28px; min-width: 0; }
.ui-at-ctx__item-label { flex: 1; min-width: 0; color: var(--ink); font: 12px/1.4 var(--mono); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ui-at-ctx__remove {
  appearance: none;
  flex: none;
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  border-radius: 6px;
  border: 0;
  background: transparent;
  color: var(--muted);
  cursor: pointer;
  transition: background-color 150ms var(--ease), color 150ms var(--ease);
}
.ui-at-ctx__remove svg { width: 12px; height: 12px; }
.ui-at-ctx__remove:hover { background: var(--soft); color: var(--ink); }
.ui-at-ctx__remove:focus-visible { outline: none; box-shadow: 0 0 0 3px var(--ring); }

.ui-at-ctx__tray { display: flex; align-items: center; gap: 8px; min-height: 40px; padding: 4px 6px 2px 10px; }
.ui-at-ctx__tray-text { flex: 1; min-width: 0; color: var(--muted); font-size: 12.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; animation: ui-at-ctx-fade 300ms var(--ease) both; }
.ui-at-ctx__tray-text[data-tone="ok"] { color: var(--ok-ink); font-weight: 600; }
.ui-at-ctx__tray-text[data-tone="bad"] { color: var(--bad-ink); font-weight: 600; }
.ui-at-ctx[data-level="warn"] .ui-at-ctx__tray-text[data-tone="muted"] { color: var(--wait-ink); }
.ui-at-ctx__action {
  appearance: none;
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 30px;
  padding: 0 8px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: var(--ink);
  font: inherit;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 150ms var(--ease);
}
.ui-at-ctx__action svg { width: 13px; height: 13px; transition: transform 150ms var(--ease); }
.ui-at-ctx__action:hover { background: var(--soft); }
.ui-at-ctx__action:hover svg { transform: translateX(2px); }
.ui-at-ctx__action:focus-visible { outline: none; box-shadow: 0 0 0 3px var(--ring); }

.ui-at-ctx__sr {
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

@keyframes ui-at-ctx-shimmer { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
@keyframes ui-at-ctx-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes ui-at-ctx-pop { from { transform: scale(0.5); opacity: 0; } to { transform: none; opacity: 1; } }
@keyframes ui-at-ctx-spin { to { transform: rotate(360deg); } }
@keyframes ui-at-ctx-done { 0%, 75% { opacity: 1; } 100% { opacity: 0; } }

@container (max-width: 310px) {
  .ui-at-ctx__field { grid-template-columns: repeat(var(--cols-narrow), minmax(0, 1fr)); }
  .ui-at-ctx__model-name { max-width: 9ch; }
  .ui-at-ctx__compact-label { display: none; }
  .ui-at-ctx__compact { padding: 0 6px; }
}
@media (hover: none) {
  .ui-at-ctx__line { min-height: 40px; }
  .ui-at-ctx__item { min-height: 38px; }
  .ui-at-ctx__remove { width: 32px; height: 32px; }
  .ui-at-ctx__compact { height: 32px; }
  .ui-at-ctx__action { height: 40px; }
}
@media (prefers-reduced-motion: reduce) {
  .ui-at-ctx, .ui-at-ctx *, .ui-at-ctx *::before, .ui-at-ctx *::after {
    transition-duration: 0ms !important;
    transition-delay: 0ms !important;
    animation-duration: 0ms !important;
    animation-delay: 0ms !important;
  }
  .ui-at-ctx__cell[data-shimmer] { animation: none !important; opacity: 0.55; }
  .ui-at-ctx__spin { animation: ui-at-ctx-spin 1600ms linear infinite !important; }
  .ui-at-ctx__compact[data-state="done"] { animation: none !important; }
}
`;var Ht=n=>new Promise(r=>setTimeout(r,n)),Q=[{id:"system",label:"System prompt",tokens:4200,locked:!0},{id:"tools",label:"Tools",tokens:12800},{id:"files",label:"Files",items:[{id:"schema",label:"schema.prisma",tokens:9400},{id:"billing",label:"billing.ts",tokens:21300},{id:"notes",label:"meeting-notes.md",tokens:15400}]},{id:"chat",label:"Conversation",tokens:108600,compact:!0},{id:"memory",label:"Memory",tokens:3900}];function Ot(){return a("svg",{viewBox:"0 0 12 12",fill:"none",stroke:"currentColor",strokeWidth:1.3,strokeLinecap:"round",children:a("path",{d:"M6 1.5v9M1.5 6h9M2.8 2.8l6.4 6.4M9.2 2.8 2.8 9.2"})})}var q=(n,r)=>n.querySelector(r)?.click(),lt=[{wait:1500,run:n=>q(n,'button[aria-controls$="items-files"]')},{wait:1300,run:n=>q(n,'button[aria-label="Remove schema.prisma"]')},{wait:1500,run:n=>q(n,'button[aria-label="Compact Conversation"]')},{wait:4200,run:n=>q(n,'button[aria-controls$="items-files"]')},{wait:2200,run:(n,r)=>r()}];function Dt(){let[n,r]=c(Q),[f,h]=c(!0),[g,_]=c(0),m=T(null);$(()=>{if(!f)return;let d=lt[g],p=setTimeout(()=>{m.current&&d.run(m.current,()=>r(Q)),_(u=>(u+1)%lt.length)},d.wait);return()=>clearTimeout(p)},[g,f]);let k=d=>{d.isTrusted&&h(!1)};return a("div",{ref:m,style:{width:"100%",maxWidth:360},onPointerDownCapture:k,onKeyDownCapture:k,children:a(ct,{limit:2e5,model:"claude-sonnet-5-5",modelIcon:a(Ot,{}),parts:n,onRemoveItem:(d,p)=>r(u=>u.map(w=>w.id===d?{...w,items:w.items?.filter(y=>y.id!==p)}:w)),onCompact:async d=>{await Ht(1400),r(p=>p.map(u=>u.id===d?{...u,tokens:30400}:u))},action:{label:"New chat",onClick:()=>r(Q)}})})}export{Dt as default};
