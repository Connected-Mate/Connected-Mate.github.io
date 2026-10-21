"use client";import{t as $e}from"./react-BkAXpnfr.js";var Te=$e();var{Children:Ze,Component:Ge,Fragment:Qe,StrictMode:ea,cloneElement:aa,createContext:ta,createElement:ia,createRef:ra,forwardRef:na,isValidElement:oa,lazy:sa,memo:la,startTransition:pa,Suspense:da,use:ca,useCallback:ma,useContext:ua,useDebugValue:fa,useDeferredValue:ha,useEffect:_,useId:pe,useImperativeHandle:ga,useInsertionEffect:va,useLayoutEffect:de,useMemo:xa,useOptimistic:ba,useReducer:_a,useRef:$,useState:m,useSyncExternalStore:wa,useTransition:ya}=Te;import{t as Ce}from"./jsx-runtime-CTsRTJUX.js";var Ee=Ce(),{jsx:e,jsxs:i,Fragment:Sa}=Ee;var ce=["once","timed","always"];function j(t){if(t%60===0){let n=t/60;return`${n} hour${n===1?"":"s"}`}return t>60?`${Math.floor(t/60)} h ${t%60} min`:`${t} minute${t===1?"":"s"}`}function ze(t,n){return t==="once"?"Just once":t==="always"?"Always":n%60===0?j(n):`${n} min`}function Ae(t,n){return t==="once"?"Allow once":t==="always"?"Always allow":`Allow for ${j(n)}`}function W(t){return new Date(t).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}function Le(t){let n=Math.max(0,Math.ceil(t/6e4));if(n<60)return`${n} min left`;let f=Math.floor(n/60),h=n%60;return h?`${f} h ${h} min left`:`${f} h left`}function Ie(t){return t.split(/\s+/).filter(Boolean).slice(0,2).map(n=>n[0].toUpperCase()).join("")}function He(){return typeof window<"u"&&window.matchMedia?.("(prefers-reduced-motion: reduce)").matches}var z={fill:"none",stroke:"currentColor",strokeWidth:1.4,strokeLinecap:"round",strokeLinejoin:"round"};function Oe(){return i("svg",{viewBox:"0 0 16 16","aria-hidden":"true",...z,children:[e("path",{d:"M4.25 2.25h5l2.5 2.5v9h-7.5z"}),e("path",{d:"M6.25 7.5h3.5M6.25 10h3.5"})]})}function Fe(){return i("svg",{viewBox:"0 0 16 16","aria-hidden":"true",...z,children:[e("path",{d:"M8 2.75 14 13H2z"}),e("path",{d:"M8 6.75v2.5M8 11.1v.05"})]})}function Be(){return i("svg",{viewBox:"0 0 16 16","aria-hidden":"true",...z,children:[e("circle",{cx:"8",cy:"8",r:"5.75"}),e("path",{d:"M8 5.25v3.25M8 10.6v.05"})]})}function qe({kind:t}){return i("svg",{viewBox:"0 0 20 20","aria-hidden":"true",...z,strokeWidth:1.5,children:[e("circle",{cx:"10",cy:"10",r:"7.5"}),t==="allowed"&&e("path",{className:"ui-at-perm__draw",pathLength:1,d:"m6.75 10.25 2.25 2.25 4.25-4.5"}),t==="denied"&&e("path",{className:"ui-at-perm__draw",pathLength:1,d:"m7.5 7.5 5 5m0-5-5 5"}),t==="expired"&&e("path",{className:"ui-at-perm__draw",pathLength:1,d:"M10 6.25V10l2.5 1.5"})]})}function A({agent:t,action:n,target:f,toolIcon:h,risk:u="risky",reason:v,preview:S,previewTitle:y="What will happen",previewLimit:M=3,scopes:x=ce,scope:D,defaultScope:P="once",onScopeChange:p,duration:d=60,decision:s,defaultDecision:g=null,onDecisionChange:C,now:o,className:L}){let I=pe(),Y=`${I}-title`,J=`${I}-reason`,U=x.filter((a,l)=>ce.includes(a)&&x.indexOf(a)===l&&!(u==="destructive"&&a==="always")),k=U.length?U:["once"],[he,ge]=m(P),X=D??he,b=k.includes(X)?X:k[0],Z=s!==void 0,[ve,xe]=m(g),r=Z?s:ve,[be,G]=m(()=>Date.now()),Q=o??be,H=!!r?.allow&&r.scope==="timed"&&r.until!==void 0;_(()=>{if(o!==void 0||!H)return;G(Date.now());let a=setInterval(()=>G(Date.now()),1e3);return()=>clearInterval(a)},[o,H]);let _e=a=>{D===void 0&&ge(a),p?.(a)},O=$(null),ee=$(null),F=$(null),B=a=>{F.current=O.current?.contains(document.activeElement)?a?"row":"card":null,Z||xe(a),C?.(a)},ae=()=>{let a=o??Date.now();B({allow:!0,scope:b,at:a,until:b==="timed"?a+d*6e4:void 0})},te=()=>B({allow:!1,scope:b,at:o??Date.now()}),we=a=>{if(!a.defaultPrevented){if(a.key==="Escape")a.preventDefault(),te();else if(a.key==="Enter"&&!a.shiftKey){let l=a.target;if(l.tagName==="BUTTON"||l.tagName==="A")return;a.preventDefault(),ae()}}},[ye,ke]=m(void 0),[Ne,Se]=m(!1),[Me,ie]=m(!1);de(()=>{let a=ee.current;if(!a)return;let l=()=>ke(a.offsetHeight);l();let R=typeof ResizeObserver<"u"?new ResizeObserver(l):null;R?.observe(a);let q=requestAnimationFrame(()=>Se(!0));return()=>{R?.disconnect(),cancelAnimationFrame(q)}},[]);let De=H&&Q>=r.until,c=r?De?"expired":r.allow?"allowed":"denied":"pending",re=$(c);_(()=>{if(re.current===c)return;re.current=c,ie(!0);let a=setTimeout(()=>ie(!1),He()?0:480);return()=>clearTimeout(a)},[c]),_(()=>{let a=F.current;if(!a)return;F.current=null;let l=O.current;if(!l)return;(a==="row"?l.querySelector(".ui-at-perm__undo"):l.querySelector(".ui-at-perm__allow"))?.focus({preventScroll:!0})},[c]);let E=S??[],ne=E.slice(0,M),oe=E.length-ne.length,Pe=t.avatar??e("span",{className:"ui-at-perm__initials",children:Ie(t.name)}),se=null;if(r){let a=r.until!==void 0?r.until-r.at:0,l=r.until!==void 0?r.until-Q:0,R=a>0?Math.max(0,Math.min(1,l/a)):0,q=c==="expired"?"Access expired":r.allow?r.scope==="once"?"Allowed once":r.scope==="always"?"Always allowed":`Allowed for ${j(Math.round(a/6e4))}`:"Denied",Re=c==="expired"?`${t.name} will ask again`:r.allow?r.scope==="once"?`At ${W(r.at)} \xB7 it won't carry over`:r.scope==="always"?`Since ${W(r.at)} \xB7 until you revoke it`:`${Le(l)} \xB7 until ${W(r.until)}`:`${t.name} was told and won't do it`,le=c==="expired"?"Ask again":r.allow&&r.scope!=="once"?"Revoke":"Change";se=e("div",{className:"ui-at-perm__frame ui-at-perm__frame--line",children:i("div",{className:"ui-at-perm__line","data-state":c,role:"status",children:[e("span",{className:"ui-at-perm__mark",children:e(qe,{kind:c==="expired"?"expired":r.allow?"allowed":"denied"})}),i("div",{className:"ui-at-perm__line-text",children:[i("p",{className:"ui-at-perm__line-head",children:[e("strong",{children:q}),i("span",{className:"ui-at-perm__line-action",children:[" \xB7 ",n]})]}),e("p",{className:"ui-at-perm__line-sub",children:Re})]}),e("button",{type:"button",className:"ui-at-perm__undo",onClick:()=>B(null),"aria-label":`${le}: ${t.name} ${n}`,children:le}),c==="allowed"&&r.scope==="timed"&&e("span",{className:"ui-at-perm__drain","aria-hidden":"true",children:e("span",{style:{transform:`scaleX(${R})`}})})]})},`line-${c}`)}return i("div",{ref:O,className:["ui-at-perm",L].filter(Boolean).join(" "),"data-risk":u,"data-state":c,"data-ready":Ne||void 0,"data-gliding":Me||void 0,style:{height:ye},children:[e("style",{href:"ui-permission-request",precedence:"default",children:We}),e("div",{ref:ee,children:r?se:i("div",{className:"ui-at-perm__frame",role:"dialog","aria-labelledby":Y,"aria-describedby":v?J:void 0,onKeyDown:we,children:[i("div",{className:"ui-at-perm__panel",children:[i("div",{className:"ui-at-perm__head",children:[e("span",{className:"ui-at-perm__avatar","aria-hidden":"true",children:Pe}),i("div",{className:"ui-at-perm__heading",children:[i("h3",{id:Y,className:"ui-at-perm__title",children:[e("strong",{children:t.name})," wants to ",e("strong",{children:n})]}),(f||t.model)&&i("p",{className:"ui-at-perm__target",children:[h&&e("span",{className:"ui-at-perm__tool","aria-hidden":"true",children:h}),e("span",{children:f??t.model})]})]}),u!=="safe"&&i("span",{className:"ui-at-perm__tag","data-risk":u,children:[u==="destructive"?e(Be,{}):e(Fe,{}),u==="destructive"?"Destructive":"Risky"]})]}),v&&e("p",{id:J,className:"ui-at-perm__reason",children:v}),E.length>0&&i("div",{className:"ui-at-perm__preview",children:[i("p",{className:"ui-at-perm__preview-title",children:[y,e("span",{className:"ui-at-perm__count",children:E.length})]}),e("ul",{className:"ui-at-perm__list",children:ne.map((a,l)=>i("li",{className:"ui-at-perm__item",style:{animationDelay:`${60+l*50}ms`},children:[e("span",{className:"ui-at-perm__item-icon","aria-hidden":"true",children:a.icon??e(Oe,{})}),e("span",{className:"ui-at-perm__item-label",children:a.label}),a.meta!=null&&e("span",{className:"ui-at-perm__item-meta",children:a.meta})]},a.id))}),oe>0&&i("p",{className:"ui-at-perm__more",children:[oe," more"]})]})]}),i("div",{className:"ui-at-perm__tray",children:[k.length>1&&i("div",{className:"ui-at-perm__scopes",role:"radiogroup","aria-label":"How long",children:[k.map(a=>i("label",{className:"ui-at-perm__scope","data-on":a===b||void 0,children:[e("input",{type:"radio",name:`${I}-scope`,value:a,checked:a===b,onChange:()=>_e(a)}),e("span",{children:ze(a,d)})]},a)),e("span",{className:"ui-at-perm__thumb","aria-hidden":"true",style:{width:`calc((100% - 6px) / ${k.length})`,transform:`translateX(${k.indexOf(b)*100}%)`}})]}),u==="destructive"&&x.includes("always")&&e("p",{className:"ui-at-perm__note",children:"Destructive actions can't be allowed for always"}),i("div",{className:"ui-at-perm__buttons",children:[i("button",{type:"button",className:"ui-at-perm__deny",onClick:te,"aria-keyshortcuts":"Escape",children:["Deny",e("kbd",{"aria-hidden":"true",children:"Esc"})]}),i("button",{type:"button",className:"ui-at-perm__allow",onClick:ae,"aria-keyshortcuts":"Enter",children:[e("span",{className:"ui-at-perm__allow-label",children:Ae(b,d)},b),e("kbd",{"aria-hidden":"true",children:"\u21B5"})]})]})]})]})})]})}var We=`
.ui-at-perm {
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
  --berry-shadow: rgba(133, 20, 55, 0.6);
  --danger-action: #8a3a22;
  --danger-action-hover: #73301c;
  --danger-shadow: rgba(138, 58, 34, 0.55);
  --secondary: #fbfcfe;
  --ring: #8fbdf2;
  --ok-ink: #1d6a34;
  --ok-fill: #eafbee;
  --ok-line: #c9f5cf;
  --ok-bar: #2f8a4b;
  --wait-ink: #775810;
  --wait-fill: #fdf6dd;
  --wait-line: #fae6a0;
  --bad-ink: #8a3a22;
  --bad-fill: #fdeee8;
  --bad-line: #f5d5c9;
  --pebble-light: rgba(26, 62, 112, 0.4);
  --plus: #1d6a34;
  --minus: #8a3a22;
  --shadow-drop: 0 8px 16px -8px rgba(26, 62, 112, 0.2);
  --shadow-raised: 0 18px 30px -16px rgba(26, 62, 112, 0.38), 0 4px 10px -6px rgba(26, 62, 112, 0.18);
  --shadow-float: 0 24px 48px -24px rgba(26, 62, 112, 0.3);
  --ease: cubic-bezier(0.16, 1, 0.3, 1);

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
:where(.dark, [data-theme="dark"]) .ui-at-perm {
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
  --berry-shadow: rgba(3, 12, 28, 0.6);
  --danger-action: #b5482a;
  --danger-action-hover: #c85636;
  --danger-shadow: rgba(3, 12, 28, 0.6);
  --secondary: rgba(255, 255, 255, 0.06);
  --ring: rgba(143, 189, 242, 0.6);
  --ok-ink: #7fe0a0;
  --ok-fill: rgba(127, 224, 160, 0.14);
  --ok-line: rgba(127, 224, 160, 0.3);
  --ok-bar: #7fe0a0;
  --wait-ink: #f3d27a;
  --wait-fill: rgba(243, 210, 122, 0.14);
  --wait-line: rgba(243, 210, 122, 0.3);
  --bad-ink: #f2a48c;
  --bad-fill: rgba(242, 164, 140, 0.14);
  --bad-line: rgba(242, 164, 140, 0.3);
  --pebble-light: rgba(3, 12, 28, 0.6);
  --plus: #7fe0a0;
  --minus: #f2a48c;
  --shadow-drop: 0 8px 16px -8px rgba(3, 12, 28, 0.6);
  --shadow-raised: 0 18px 30px -16px rgba(3, 12, 28, 0.8), 0 4px 10px -6px rgba(3, 12, 28, 0.6);
  --shadow-float: 0 24px 48px -24px rgba(3, 12, 28, 0.7);
}
.ui-at-perm *, .ui-at-perm *::before, .ui-at-perm *::after { box-sizing: border-box; }
.ui-at-perm[data-ready] { transition: height 300ms var(--ease); }
.ui-at-perm[data-gliding] { overflow: clip; overflow-clip-margin: 48px; }
.ui-at-perm p, .ui-at-perm h3, .ui-at-perm ul { margin: 0; padding: 0; }

.ui-at-perm__frame {
  background: var(--frame);
  border: 1px solid var(--hairline);
  border-radius: 22px;
  padding: 6px;
  box-shadow: var(--shadow-float);
  animation: ui-at-perm-in 300ms var(--ease) both;
}
.ui-at-perm__frame--line { padding: 4px; border-radius: 20px; }
.ui-at-perm__panel {
  background: var(--panel);
  border: 1px solid var(--hairline);
  border-radius: 16px;
  box-shadow: var(--shadow-raised);
  overflow: hidden;
}
.ui-at-perm__head { display: flex; align-items: flex-start; gap: 10px; padding: 14px 14px 0; min-width: 0; }
.ui-at-perm__avatar {
  flex: none;
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--panel);
  border: 1px solid var(--hairline);
  box-shadow: inset 0 -2px 6px -4px var(--pebble-light);
  color: var(--ink);
  overflow: hidden;
}
.ui-at-perm__avatar svg { width: 18px; height: 18px; }
.ui-at-perm__initials { font-size: 12px; font-weight: 700; letter-spacing: 0.02em; }
.ui-at-perm__heading { flex: 1; min-width: 0; padding-top: 1px; }
.ui-at-perm__title { font-size: 13.5px; font-weight: 500; line-height: 1.35; color: var(--text); overflow-wrap: anywhere; }
.ui-at-perm__title strong { color: var(--ink); font-weight: 700; }
.ui-at-perm__target { display: flex; align-items: center; gap: 5px; margin-top: 2px; color: var(--muted); font-size: 12px; min-width: 0; }
.ui-at-perm__target > span:last-child { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ui-at-perm__tool { display: inline-grid; place-items: center; width: 12px; height: 12px; flex: none; color: var(--ink); }
.ui-at-perm__tool svg { width: 12px; height: 12px; }
.ui-at-perm__tag {
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  border: 1px solid var(--wait-line);
  background: var(--wait-fill);
  color: var(--wait-ink);
  font-size: 11.5px;
  font-weight: 600;
}
.ui-at-perm__tag svg { width: 12px; height: 12px; }
.ui-at-perm__tag[data-risk="destructive"] { border-color: var(--bad-line); background: var(--bad-fill); color: var(--bad-ink); }
.ui-at-perm__reason {
  margin: 10px 14px 0 60px !important;
  padding-left: 11px !important;
  border-left: 2px solid var(--hairline);
  color: var(--text);
  overflow-wrap: anywhere;
}
.ui-at-perm__preview { margin-top: 14px; padding: 12px 14px 10px; border-top: 1px solid var(--hairline); }
.ui-at-perm__preview-title { display: flex; align-items: center; gap: 6px; color: var(--muted); font-size: 12px; font-weight: 500; margin-bottom: 4px !important; }
.ui-at-perm__count {
  display: inline-grid;
  place-items: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 999px;
  border: 1px solid var(--hairline);
  background: var(--soft);
  color: var(--text);
  font-size: 10.5px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
.ui-at-perm__list { list-style: none; }
.ui-at-perm__item {
  display: flex;
  align-items: center;
  gap: 9px;
  min-height: 30px;
  min-width: 0;
  color: var(--ink);
  animation: ui-at-perm-rise 300ms var(--ease) both;
}
.ui-at-perm__item-icon { flex: none; display: grid; place-items: center; width: 16px; height: 16px; color: var(--muted); }
.ui-at-perm__item-icon svg { width: 15px; height: 15px; }
.ui-at-perm__item-label { flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ui-at-perm__item-meta { flex: none; color: var(--muted); font-size: 12px; font-variant-numeric: tabular-nums; white-space: nowrap; }
.ui-at-perm__more { padding: 2px 0 0 25px !important; color: var(--muted); font-size: 12px; }

.ui-at-perm__tray { display: grid; gap: 8px; padding: 8px 2px 2px; }
.ui-at-perm__scopes {
  position: relative;
  display: flex;
  padding: 3px;
  border-radius: 12px;
  background: var(--soft);
  border: 1px solid var(--hairline);
}
.ui-at-perm__scope {
  position: relative;
  z-index: 1;
  flex: 1 1 0;
  display: grid;
  place-items: center;
  min-width: 0;
  height: 30px;
  border-radius: 9px;
  color: var(--text);
  font-weight: 500;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  transition: color 150ms var(--ease);
}
.ui-at-perm__scope[data-on] { color: var(--ink); font-weight: 600; }
.ui-at-perm__scope input { position: absolute; inset: 0; opacity: 0; margin: 0; cursor: pointer; }
.ui-at-perm__scope:has(input:focus-visible) { box-shadow: 0 0 0 3px var(--ring); }
.ui-at-perm__scope > span { overflow: hidden; text-overflow: ellipsis; padding: 0 6px; }
.ui-at-perm__thumb {
  position: absolute;
  top: 3px;
  bottom: 3px;
  left: 3px;
  border-radius: 9px;
  background: var(--panel);
  border: 1px solid var(--hairline);
  box-shadow: var(--shadow-drop);
  transition: transform 300ms var(--ease);
}
.ui-at-perm__note { padding: 0 6px !important; color: var(--muted); font-size: 11.5px; }
.ui-at-perm__buttons { display: grid; grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr); gap: 8px; }
.ui-at-perm__deny, .ui-at-perm__allow, .ui-at-perm__undo {
  appearance: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 38px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid transparent;
  font: inherit;
  font-size: 13.5px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 150ms var(--ease), transform 150ms var(--ease), box-shadow 150ms var(--ease);
}
.ui-at-perm__deny:active, .ui-at-perm__allow:active, .ui-at-perm__undo:active { transform: scale(0.97); }
.ui-at-perm__deny:focus-visible, .ui-at-perm__allow:focus-visible, .ui-at-perm__undo:focus-visible { outline: none; box-shadow: 0 0 0 3px var(--ring); }
.ui-at-perm__deny { background: var(--secondary); border-color: var(--firm); color: var(--ink); box-shadow: var(--shadow-drop); }
.ui-at-perm__deny:hover { background: var(--panel); }
.ui-at-perm__allow {
  background: var(--berry);
  color: #fff;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 6px 12px -6px var(--berry-shadow);
  overflow: hidden;
}
.ui-at-perm__allow:hover { background: var(--berry-hover); }
.ui-at-perm[data-risk="destructive"] .ui-at-perm__allow {
  background: var(--danger-action);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 6px 12px -6px var(--danger-shadow);
}
.ui-at-perm[data-risk="destructive"] .ui-at-perm__allow:hover { background: var(--danger-action-hover); }
.ui-at-perm__allow-label { display: inline-block; overflow: hidden; text-overflow: ellipsis; animation: ui-at-perm-swap 200ms var(--ease) both; }
.ui-at-perm kbd {
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
.ui-at-perm__allow kbd { background: rgba(255, 255, 255, 0.14); border-color: rgba(255, 255, 255, 0.3); color: rgba(255, 255, 255, 0.92); }

.ui-at-perm__line {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 52px;
  padding: 9px 10px 9px 14px;
  border-radius: 16px;
  background: var(--panel);
  border: 1px solid var(--hairline);
  box-shadow: var(--shadow-raised);
  overflow: hidden;
}
.ui-at-perm__mark { flex: none; display: grid; place-items: center; width: 20px; height: 20px; color: var(--ok-ink); animation: ui-at-perm-pop 300ms var(--ease) both; }
.ui-at-perm__mark svg { width: 20px; height: 20px; }
.ui-at-perm__line[data-state="denied"] .ui-at-perm__mark { color: var(--bad-ink); }
.ui-at-perm__line[data-state="expired"] .ui-at-perm__mark { color: var(--muted); }
.ui-at-perm__draw { stroke-dasharray: 1; stroke-dashoffset: 1; animation: ui-at-perm-draw 300ms var(--ease) 120ms forwards; }
.ui-at-perm__line-text { flex: 1; min-width: 0; }
.ui-at-perm__line-head { color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ui-at-perm__line-head strong { color: var(--ink); font-weight: 700; }
.ui-at-perm__line-sub { color: var(--muted); font-size: 12px; font-variant-numeric: tabular-nums; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ui-at-perm__undo { flex: none; height: 32px; background: var(--soft); border-color: var(--hairline); color: var(--ink); font-size: 13px; }
.ui-at-perm__undo:hover { background: var(--secondary); border-color: var(--firm); }
.ui-at-perm__drain { position: absolute; left: 0; right: 0; bottom: 0; height: 3px; background: var(--soft); }
.ui-at-perm__drain > span {
  display: block;
  height: 100%;
  background: var(--ok-bar);
  transform-origin: left center;
  transition: transform 1000ms linear;
}

@keyframes ui-at-perm-in { from { opacity: 0; filter: blur(3px); transform: translateY(4px); } to { opacity: 1; filter: none; transform: none; } }
@keyframes ui-at-perm-rise { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
@keyframes ui-at-perm-swap { from { opacity: 0; transform: translateY(3px); } to { opacity: 1; transform: none; } }
@keyframes ui-at-perm-pop { from { transform: scale(0.6); opacity: 0; } to { transform: none; opacity: 1; } }
@keyframes ui-at-perm-draw { to { stroke-dashoffset: 0; } }

@container (max-width: 340px) {
  .ui-at-perm__reason { margin-left: 14px !important; }
  .ui-at-perm__buttons { grid-template-columns: 1fr 1fr; }
  .ui-at-perm kbd { display: none; }
  .ui-at-perm__tag { padding: 0 6px; }
}
@media (hover: none) {
  .ui-at-perm kbd { display: none; }
  .ui-at-perm__scope { height: 38px; }
  .ui-at-perm__deny, .ui-at-perm__allow { height: 44px; }
  .ui-at-perm__undo { height: 40px; }
}
@media (prefers-reduced-motion: reduce) {
  .ui-at-perm, .ui-at-perm *, .ui-at-perm *::before, .ui-at-perm *::after {
    transition-duration: 0ms !important;
    animation-duration: 0ms !important;
    animation-delay: 0ms !important;
  }
}
`;var w={viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:1.4,strokeLinecap:"round",strokeLinejoin:"round"},je=()=>e("svg",{...w,children:e("path",{d:"m5.5 4.75-3.25 3.25 3.25 3.25M10.5 4.75l3.25 3.25-3.25 3.25"})}),me=()=>i("svg",{...w,children:[e("rect",{x:"2.25",y:"3.5",width:"11.5",height:"9",rx:"2"}),e("path",{d:"m2.75 4.75 5.25 4 5.25-4"})]}),Ke=()=>e("svg",{...w,children:e("path",{d:"M8 2.5c.4 2.7 1.8 4.1 4.5 4.5-2.7.4-4.1 1.8-4.5 4.5C7.6 8.8 6.2 7.4 3.5 7c2.7-.4 4.1-1.8 4.5-4.5Z"})}),Ve=()=>i("svg",{...w,children:[e("path",{d:"M4 2.75h7.25v8.5H4.75A1.25 1.25 0 0 0 3.5 12.5V3.25c0-.28.22-.5.5-.5Z"}),e("path",{d:"M3.5 12.5c0 .7.56 1.25 1.25 1.25h6.5v-2.5"})]}),Ye=()=>i("svg",{...w,children:[e("rect",{x:"2",y:"3.75",width:"12",height:"8.5",rx:"1.75"}),e("path",{d:"M2 6.5h12"})]}),K=()=>i("svg",{...w,children:[e("circle",{cx:"8",cy:"5.75",r:"2.5"}),e("path",{d:"M3.5 13.25c.6-2.2 2.4-3.5 4.5-3.5s3.9 1.3 4.5 3.5"})]}),Je=()=>i("svg",{...w,children:[e("path",{d:"M9.5 2.75c2 0 3.75 1.75 3.75 3.75L8.5 11.25 4.75 7.5z"}),e("path",{d:"m5.5 10.5-2.75 2.75M4.75 7.5 2.75 7l1.5-1.75h2.5M8.5 11.25l.5 2 1.75-1.5v-2.5"})]}),ue=()=>i("svg",{...w,children:[e("path",{d:"M4 2.25h8v11.5l-2-1.25-2 1.25-2-1.25-2 1.25z"}),e("path",{d:"M6 5.5h4M6 8h4"})]}),fe=({plus:t,minus:n})=>i("span",{children:[i("span",{style:{color:"var(--plus)"},children:["+",t]})," ",i("span",{style:{color:"var(--minus)"},children:["\u2212",n]})]}),V=6e4,T=new Date(2026,9,21,14,45).getTime(),N=(t="once")=>({visible:!1,scope:t,decision:null});function Ue(){let[t,n]=m(T),[f,h]=m(!1),[u,v]=m({...N(),visible:!0}),[S,y]=m(N()),[M,x]=m(N());_(()=>{if(!f)return;let p=setInterval(()=>n(d=>d+3*V),250);return()=>clearInterval(p)},[f]),_(()=>{let p=!0,d=[],s=(o,L)=>d.push(setTimeout(()=>p&&L(),o)),g=T,C=()=>{g=T,n(T),h(!1),v({...N(),visible:!0}),y(N()),x(N()),s(1e3,()=>v(o=>({...o,scope:"timed"}))),s(2e3,()=>{v(o=>({...o,decision:{allow:!0,scope:"timed",at:g,until:g+60*V}})),h(!0)}),s(2800,()=>y(o=>({...o,visible:!0}))),s(6200,()=>y(o=>({...o,decision:{allow:!1,scope:"once",at:g}}))),s(7e3,()=>x(o=>({...o,visible:!0}))),s(9600,()=>x(o=>({...o,decision:{allow:!0,scope:"once",at:T+60*V}}))),s(12600,C)};return C(),()=>{p=!1,d.forEach(clearTimeout)}},[]);let D=[u,S,M].some(p=>p.decision?.allow&&p.decision.until!==void 0&&t<p.decision.until);_(()=>{f&&!D&&h(!1)},[f,D]);let P=(p,d)=>({scope:p.scope,onScopeChange:s=>d(g=>({...g,scope:s})),decision:p.decision,onDecisionChange:s=>{d(g=>({...g,decision:s})),s?.allow&&s.until!==void 0&&h(!0)},now:t});return i("div",{style:{width:"100%",maxWidth:400,display:"grid",gap:12},children:[u.visible&&e(A,{agent:{name:"Coder",model:"Code model",avatar:e(je,{})},action:"push to main",target:"acme/web",toolIcon:e(Ve,{}),risk:"risky",reason:"The fix for the flaky checkout test passed review and all 214 checks.",preview:[{id:"cart",label:"src/checkout/cart.ts",meta:e(fe,{plus:12,minus:4})},{id:"spec",label:"tests/checkout.spec.ts",meta:e(fe,{plus:31,minus:2})},{id:"deploy",label:"Deploys to production after the merge",icon:e(Je,{})}],...P(u,v)}),S.visible&&e(A,{agent:{name:"Sales agent",avatar:e(me,{})},action:"send 40 emails",target:"Mail \xB7 to customers",toolIcon:e(me,{}),risk:"risky",reason:"Follow-ups for everyone who started a trial last week and hasn't logged in since.",previewTitle:"Recipients",preview:[{id:"1",label:"anna.berg@northwind.com",meta:"Trial ends Fri",icon:e(K,{})},{id:"2",label:"j.chen@lumen.io",meta:"Trial ends Sat",icon:e(K,{})},{id:"3",label:"maria@acme-retail.co",meta:"Trial ends Sat",icon:e(K,{})},...Array.from({length:37},(p,d)=>({id:`r${d+4}`,label:`customer-${d+4}@example.com`}))],...P(S,y)}),M.visible&&e(A,{agent:{name:"Ops agent",avatar:e(Ke,{})},action:"refund $240",target:"Payments \xB7 live mode",toolIcon:e(Ye,{}),risk:"destructive",reason:"Two orders were charged twice after the checkout outage this morning.",previewTitle:"Refunds",preview:[{id:"o1",label:"Order #44882211 \xB7 Lena Fischer",meta:"$120.00",icon:e(ue,{})},{id:"o2",label:"Order #44882222 \xB7 Tom Okafor",meta:"$120.00",icon:e(ue,{})}],...P(M,x)})]})}export{Ue as default};
