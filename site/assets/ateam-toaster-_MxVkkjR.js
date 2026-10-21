"use client";import{t as Rt}from"./react-BkAXpnfr.js";var Et=Rt();var{Children:Yt,Component:Ut,Fragment:Qt,StrictMode:qt,cloneElement:Zt,createContext:Wt,createElement:Jt,createRef:Gt,forwardRef:te,isValidElement:ee,lazy:oe,memo:ae,startTransition:ie,Suspense:se,use:re,useCallback:at,useContext:ne,useDebugValue:de,useDeferredValue:ce,useEffect:b,useId:ue,useImperativeHandle:le,useInsertionEffect:pe,useLayoutEffect:xt,useMemo:pt,useOptimistic:me,useReducer:fe,useRef:P,useState:N,useSyncExternalStore:bt,useTransition:ge}=Et;import{t as Pt}from"./jsx-runtime-CTsRTJUX.js";var St=Pt(),{jsx:o,jsxs:p,Fragment:be}=St;var It=220,g=[],Lt=0,ft=new Set;function gt(){g=g.slice(),ft.forEach(t=>t())}function Ct(t){return ft.add(t),()=>{ft.delete(t)}}var Dt=()=>g,At=[],Ht=()=>At;function I(t,e,r={}){let n=r.id??`t${++Lt}`,u=g.findIndex(d=>d.id===n);if(u>=0){let d=g[u];g[u]={...d,...r,id:n,type:t,title:e,description:"description"in r?r.description:d.description,version:d.version+1,closing:!1}}else g.push({...r,id:n,type:t,title:e,version:0,closing:!1});return gt(),n}function Z(t){let e=g.filter(n=>!n.closing&&(t===void 0||n.id===t));if(!e.length)return;let r=new Set(e.map(n=>n.id));g=g.map(n=>r.has(n.id)?{...n,closing:!0}:n),gt();for(let n of e)n.onDismiss?.(n.id);setTimeout(()=>{let n=new Set(e.map(d=>d.id)),u=g.length;g=g.filter(d=>!(n.has(d.id)&&d.closing)),g.length!==u&&gt()},It)}function mt(t){return t&&typeof t=="object"&&"title"in t?t:{title:t}}var B=Object.assign((t,e)=>I("default",t,e),{success:(t,e)=>I("success",t,e),error:(t,e)=>I("error",t,e),info:(t,e)=>I("info",t,e),loading:(t,e)=>I("loading",t,e),promise(t,e,r={}){let n=mt(e.loading),u=I("loading",n.title,{...r,description:n.description}),d;try{d=typeof t=="function"?t():t}catch(h){d=Promise.reject(h)}return d.then(h=>{let v=typeof e.success=="function"?e.success(h):e.success,m=mt(v);I("success",m.title,{...r,id:u,description:m.description})},h=>{let v=typeof e.error=="function"?e.error(h):e.error,m=mt(v);I("error",m.title,{...r,id:u,description:m.description})}),d},dismiss:Z}),Bt=typeof window>"u"?b:xt;function Ot(){let[t,e]=N(!1);return b(()=>{let r=()=>e(document.visibilityState==="hidden");return r(),document.addEventListener("visibilitychange",r),()=>document.removeEventListener("visibilitychange",r)},[]),t}function vt(t,e){let r=V(t).trim(),n=V(e).trim();return!r||!n?r||n:/[.…!?:]$/.test(r)?`${r} ${n}`:`${r}. ${n}`}function V(t){return t==null||typeof t=="boolean"?"":typeof t=="string"||typeof t=="number"?String(t):Array.isArray(t)?t.map(V).join(""):typeof t=="object"&&"props"in t?V(t.props.children):""}function _t({position:t="bottom-right",inline:e=!1,id:r,duration:n=4e3,visibleToasts:u=3,expand:d=!1,offset:h,gap:v=10,hotkey:m="F8",hairline:st=!0,closeButton:W=!0,label:J="Notifications",className:k}){let L=bt(Ct,Dt,Ht),f=pt(()=>L.filter(a=>r?a.toaster===r:!a.toaster),[L,r]),_=pt(()=>f.slice().reverse(),[f]).slice(0,Math.max(1,u)),[tt,y]=N(!1),[C,O]=N(!1),[D,z]=N(!1),S=d||tt||C||D,A=Ot(),F=tt||C||D||A,w=P(null),T=P(null),[$,Y]=N({}),[et,rt]=t.split("-"),nt=et==="bottom",dt=at((a,i)=>{Y(c=>c[a]===i?c:{...c,[a]:i})},[]);b(()=>{Y(a=>{let i=new Set(f.map(E=>String(E.id))),c={},R=!1;for(let E of Object.keys(a))i.has(E)?c[E]=a[E]:R=!0;return R?c:a})},[f]),b(()=>{f.length||(y(!1),z(!1))},[f.length]),b(()=>{if(!m)return;let a=i=>{if(i.key!==m&&i.code!==m)return;let c=w.current?.querySelector("[data-toast]:not([data-closing])");c&&(i.preventDefault(),w.current?.contains(document.activeElement)||(T.current=document.activeElement),c.focus())};return window.addEventListener("keydown",a),()=>window.removeEventListener("keydown",a)},[m]),b(()=>{if(!D)return;let a=i=>{w.current?.contains(i.target)||z(!1)};return document.addEventListener("pointerdown",a),()=>document.removeEventListener("pointerdown",a)},[D]);let[ct,U]=N(""),[j,ut]=N(""),Q=P(new Map);b(()=>{for(let i of f){if(i.closing||Q.current.get(i.id)===i.version)continue;Q.current.set(i.id,i.version);let c=vt(i.title,i.description);i.type==="error"?ut(c):U(c)}let a=new Set(f.map(i=>i.id));for(let i of Q.current.keys())a.has(i)||Q.current.delete(i)},[f]);let ht=at(a=>{let i=Array.from(w.current?.querySelectorAll("[data-toast]:not([data-closing])")??[]).filter(c=>c.dataset.toast!==String(a));if(i.length)i[0].focus();else{let c=T.current;T.current=null,c&&document.contains(c)?c.focus():document.activeElement?.blur?.()}},[]),lt=_[0]?String(_[0].id):"",q=$[lt]??64,ot=10,s=0,l=_.map((a,i)=>{let c=String(a.id),R=$[c]??q,E=S?s:i*ot;return S&&(s+=R+v),{item:a,index:i,key:c,y:E,height:R}}),M=_.length?S?Math.max(0,s-v):q+(_.length-1)*ot:0,x=m?`${J} (${m})`:J,K={"--ui-toast-offset":`${h??(e?20:24)}px`,"--ui-toast-gap":`${v}px`};return p("section",{ref:w,className:["ui-toaster",k].filter(Boolean).join(" "),"aria-label":x,tabIndex:-1,"data-position":t,"data-y":et,"data-x":rt,"data-inline":e?"":void 0,"data-expanded":S?"":void 0,"data-empty":_.length?void 0:"",style:K,onPointerEnter:a=>{a.pointerType==="mouse"&&y(!0)},onPointerLeave:a=>{a.pointerType==="mouse"&&y(!1)},onPointerDown:a=>{a.pointerType!=="mouse"&&_.length>1&&z(!0)},onFocus:()=>O(!0),onBlur:a=>{a.currentTarget.contains(a.relatedTarget)||O(!1)},children:[o("style",{href:"ui-toaster",precedence:"default",children:jt}),o("ol",{className:"ui-toaster__list",style:{height:M},children:l.map(({item:a,index:i,key:c,y:R,height:E})=>o(Ft,{record:a,index:i,y:R,height:S||i===0?E:q,fromBottom:nt,expanded:S,paused:F,defaultDuration:n,hairline:st,closeButton:W,onHeight:dt,onEscape:ht},c))}),o("div",{className:"ui-toaster__sr",role:"status","aria-live":"polite","aria-atomic":"true",children:ct}),o("div",{className:"ui-toaster__sr",role:"alert","aria-atomic":"true",children:j})]})}var zt=56;function Ft({record:t,index:e,y:r,height:n,fromBottom:u,expanded:d,paused:h,defaultDuration:v,hairline:m,closeButton:st,onHeight:W,onEscape:J}){let{id:k,type:L,title:f,description:G,action:_,icon:tt,closing:y,version:C}=t,O=String(k),D=P(null),[z,S]=N(!1),[A,F]=N({x:0,y:0,dragging:!1,out:!1}),w=P(null);b(()=>{let s=requestAnimationFrame(()=>S(!0));return()=>cancelAnimationFrame(s)},[]),Bt(()=>{let s=D.current;if(!s)return;let l=()=>W(O,Math.ceil(s.getBoundingClientRect().height));if(l(),typeof ResizeObserver>"u")return;let M=new ResizeObserver(l);return M.observe(s),()=>M.disconnect()},[O,W]);let T=L==="loading"?1/0:t.duration??v,$=P(T);b(()=>{$.current=T},[T,C]),b(()=>{if(y||h||!Number.isFinite(T))return;let s=Date.now(),l=setTimeout(()=>Z(k),Math.max(0,$.current));return()=>{clearTimeout(l),$.current-=Date.now()-s}},[y,h,T,C,k]);let Y=at(()=>Z(k),[k]),et=s=>{s.key==="Escape"&&(s.preventDefault(),s.stopPropagation(),J(k),Z(k))},rt=s=>{y||s.button!==0||s.target.closest("button")||(w.current={x:s.clientX,y:s.clientY,t:performance.now(),pointer:s.pointerId,moved:!1})},nt=s=>{let l=w.current;if(!l||l.pointer!==s.pointerId)return;let M=s.clientX-l.x,x=s.clientY-l.y;if(!l.moved&&Math.hypot(M,x)<6)return;l.moved||(l.moved=!0,s.currentTarget.setPointerCapture(s.pointerId)),(u?x>0:x<0)||(x=x*.15);let K=Math.abs(M)>Math.abs(x);F({x:K?M:0,y:K?0:x,dragging:!0,out:!1})},dt=s=>{let l=w.current;if(w.current=null,!l||!l.moved)return;let M=Math.max(1,performance.now()-l.t),x=s.clientX-l.x,H=s.clientY-l.y,K=u?H>0:H<0,a=Math.abs(x)>Math.abs(H),i=a?Math.abs(x):K?Math.abs(H):0,c=i/M;if(i>zt||i>16&&c>.45){let R=s.currentTarget.offsetWidth;F({x:a?Math.sign(x)*(R+40):0,y:a?0:Math.sign(H)*120,dragging:!1,out:!0}),Z(k)}else F({x:0,y:0,dragging:!1,out:!1})},ct=()=>{w.current=null,F({x:0,y:0,dragging:!1,out:!1})},U=u?-1:1,j=!d&&e>0,ut=j?1-e*.05:1,lt={"--ui-toast-y":`${(z?y&&!A.out?U*r-U*6:U*r:u?24:-24)+A.y}px`,"--ui-toast-x":`${A.x}px`,"--ui-toast-scale":ut,height:n,zIndex:100-e},q=L==="error"?"alert":"status",ot=Number.isFinite(T)&&m;return p("li",{className:"ui-toaster__toast","data-toast":O,"data-type":L,"data-front":e===0?"":void 0,"data-behind":j?"":void 0,"data-mounted":z?"":void 0,"data-closing":y?"":void 0,"data-dragging":A.dragging?"":void 0,"data-swiped":A.out?"":void 0,tabIndex:0,"aria-roledescription":"notification","aria-label":vt(f,G)||void 0,"aria-hidden":j?!0:void 0,inert:j||y?!0:void 0,style:lt,onKeyDown:et,onPointerDown:rt,onPointerMove:nt,onPointerUp:dt,onPointerCancel:ct,children:[p("div",{ref:D,className:"ui-toaster__inner","data-role":q,children:[o("span",{className:"ui-toaster__icon","aria-hidden":"true",children:tt??o($t,{type:L})}),p("div",{className:"ui-toaster__text",children:[o("div",{className:"ui-toaster__title",children:f}),G?o("div",{className:"ui-toaster__description",children:G}):null]},C),_?o("button",{type:"button",className:"ui-toaster__action",onClick:s=>{_.onClick(s),s.defaultPrevented||Y()},children:_.label}):null,st?o("button",{type:"button",className:"ui-toaster__close","aria-label":`Close notification${V(f)?`: ${V(f)}`:""}`,onClick:Y,children:o("svg",{viewBox:"0 0 16 16","aria-hidden":"true",children:o("path",{d:"M4.5 4.5l7 7M11.5 4.5l-7 7"})})}):null]}),ot?o("span",{className:"ui-toaster__hairline","aria-hidden":"true",style:{animationDuration:`${T}ms`,animationPlayState:h||y?"paused":"running"}},`h${C}`):null]})}function $t({type:t}){return t==="default"?p("svg",{viewBox:"0 0 20 20",className:"ui-toaster__glyph","data-kind":"bell",children:[o("path",{d:"M10 3.2a4.2 4.2 0 0 0-4.2 4.2v2.4L4.4 13h11.2l-1.4-3.2V7.4A4.2 4.2 0 0 0 10 3.2Z"}),o("path",{d:"M8.2 15.4a1.9 1.9 0 0 0 3.6 0"})]}):t==="info"?p("svg",{viewBox:"0 0 20 20",className:"ui-toaster__glyph","data-kind":"info",children:[o("circle",{cx:"10",cy:"10",r:"7.25"}),o("path",{d:"M10 9v4.6M10 6.4v.1"})]}):p("svg",{viewBox:"0 0 20 20",className:"ui-toaster__status","data-kind":t,children:[o("circle",{className:"ui-toaster__ring",cx:"10",cy:"10",r:"7.25",pathLength:100}),o("path",{className:"ui-toaster__mark","data-mark":"check",d:"M6.6 10.3l2.3 2.3 4.6-4.9",pathLength:100}),o("path",{className:"ui-toaster__mark","data-mark":"cross",d:"M7.4 7.4l5.2 5.2M12.6 7.4l-5.2 5.2",pathLength:100})]})}var jt=`
.ui-toaster {
  --ui-toast-panel: #ffffff;
  --ui-toast-hairline: #dae2ec;
  --ui-toast-firm: #cbd6e4;
  --ui-toast-soft: rgba(26, 62, 112, 0.06);
  --ui-toast-ink: #00162b;
  --ui-toast-text: rgba(0, 22, 43, 0.66);
  --ui-toast-muted: rgba(0, 22, 43, 0.54);
  --ui-toast-secondary: #fbfcfe;
  --ui-toast-ring: #8fbdf2;
  --ui-toast-info: #1a3e70;
  --ui-toast-success: #1d6a34;
  --ui-toast-danger: #8a3a22;
  --ui-toast-shadow: 0 18px 30px -16px rgba(26, 62, 112, 0.38), 0 4px 10px -6px rgba(26, 62, 112, 0.18);
  --ui-toast-shadow-back: 0 8px 16px -8px rgba(26, 62, 112, 0.2);
  --ui-toast-drop: 0 2px 4px -2px rgba(26, 62, 112, 0.2);
  --ui-toast-ease: cubic-bezier(0.16, 1, 0.3, 1);
  position: fixed;
  z-index: 2147483000;
  width: 356px;
  max-width: calc(100vw - 2 * var(--ui-toast-offset));
  box-sizing: border-box;
  font-family: "Avenir Next", Avenir, system-ui, sans-serif;
  color: var(--ui-toast-ink);
  outline: none;
  pointer-events: none;
}
:where(.dark, [data-theme="dark"]) .ui-toaster {
  --ui-toast-panel: #16345c;
  --ui-toast-hairline: rgba(255, 255, 255, 0.12);
  --ui-toast-firm: rgba(255, 255, 255, 0.18);
  --ui-toast-soft: rgba(255, 255, 255, 0.07);
  --ui-toast-ink: rgba(255, 255, 255, 0.94);
  --ui-toast-text: rgba(255, 255, 255, 0.72);
  --ui-toast-muted: rgba(255, 255, 255, 0.56);
  --ui-toast-secondary: rgba(255, 255, 255, 0.07);
  --ui-toast-ring: rgba(143, 189, 242, 0.6);
  --ui-toast-info: #c1daff;
  --ui-toast-success: #7fe0a0;
  --ui-toast-danger: #f2a48c;
  --ui-toast-shadow: 0 18px 30px -16px rgba(3, 12, 28, 0.8), 0 4px 10px -6px rgba(3, 12, 28, 0.6);
  --ui-toast-shadow-back: 0 8px 16px -8px rgba(3, 12, 28, 0.6);
  --ui-toast-drop: 0 2px 4px -2px rgba(3, 12, 28, 0.6);
}
.ui-toaster[data-inline] { position: absolute; z-index: 20; max-width: calc(100% - 2 * var(--ui-toast-offset)); }
.ui-toaster[data-y="top"] { top: var(--ui-toast-offset); }
.ui-toaster[data-y="bottom"] { bottom: var(--ui-toast-offset); }
.ui-toaster[data-x="left"] { left: var(--ui-toast-offset); }
.ui-toaster[data-x="right"] { right: var(--ui-toast-offset); }
.ui-toaster[data-x="center"] { left: 50%; transform: translateX(-50%); }
@media (max-width: 599px) {
  .ui-toaster:not([data-inline]) { left: 12px; right: 12px; width: auto; max-width: none; transform: none; }
  .ui-toaster:not([data-inline])[data-y="top"] { top: calc(12px + env(safe-area-inset-top, 0px)); }
  .ui-toaster:not([data-inline])[data-y="bottom"] { bottom: calc(12px + env(safe-area-inset-bottom, 0px)); }
}

.ui-toaster__list {
  position: relative;
  margin: 0;
  padding: 0;
  list-style: none;
  transition: height 300ms var(--ui-toast-ease);
}

.ui-toaster__toast {
  position: absolute;
  left: 0;
  right: 0;
  box-sizing: border-box;
  overflow: hidden;
  border-radius: 16px;
  background: var(--ui-toast-panel);
  border: 1px solid var(--ui-toast-hairline);
  box-shadow: var(--ui-toast-shadow);
  pointer-events: auto;
  touch-action: none;
  outline: none;
  opacity: 0;
  transform: translate3d(var(--ui-toast-x), var(--ui-toast-y), 0) scale(var(--ui-toast-scale));
  transition:
    transform 400ms var(--ui-toast-ease),
    opacity 300ms var(--ui-toast-ease),
    height 300ms var(--ui-toast-ease),
    box-shadow 300ms var(--ui-toast-ease);
  user-select: none;
  -webkit-user-select: none;
}
.ui-toaster[data-y="bottom"] .ui-toaster__toast { bottom: 0; transform-origin: 50% 0%; }
.ui-toaster[data-y="top"] .ui-toaster__toast { top: 0; transform-origin: 50% 100%; }
.ui-toaster__toast[data-mounted] { opacity: 1; }
.ui-toaster__toast[data-behind] { box-shadow: var(--ui-toast-shadow-back); }
.ui-toaster__toast[data-behind] .ui-toaster__inner { opacity: 0; }
.ui-toaster__toast[data-closing] { opacity: 0; pointer-events: none; }
.ui-toaster__toast[data-swiped] { transition: transform 260ms var(--ui-toast-ease), opacity 260ms linear; }
.ui-toaster__toast[data-dragging] { transition: none; cursor: grabbing; }
.ui-toaster__toast:focus-visible { box-shadow: 0 0 0 3px var(--ui-toast-ring), var(--ui-toast-shadow); }

.ui-toaster__inner {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 14px 14px 16px;
  transition: opacity 200ms var(--ui-toast-ease);
}
.ui-toaster__icon {
  flex: none;
  display: grid;
  place-items: center;
  width: 20px;
  height: 20px;
  margin-top: 1px;
  color: var(--ui-toast-muted);
}
.ui-toaster__icon svg { width: 20px; height: 20px; display: block; }
.ui-toaster__glyph { fill: none; stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }
.ui-toaster__glyph[data-kind="info"] { color: var(--ui-toast-info); }

.ui-toaster__status { fill: none; stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; overflow: visible; }
.ui-toaster__ring {
  stroke: currentColor;
  stroke-dasharray: 100 100;
  transform-origin: 10px 10px;
  transition: stroke-dasharray 420ms var(--ui-toast-ease), stroke 300ms ease;
}
.ui-toaster__mark { stroke: currentColor; stroke-dasharray: 100 100; stroke-dashoffset: 100; opacity: 0; }
.ui-toaster__status[data-kind="loading"] .ui-toaster__ring {
  stroke-dasharray: 24 100;
  animation: ui-toaster-spin 800ms linear infinite;
}
.ui-toaster__icon:has([data-kind="success"]) { color: var(--ui-toast-success); }
.ui-toaster__icon:has([data-kind="error"]) { color: var(--ui-toast-danger); }
.ui-toaster__status[data-kind="success"] [data-mark="check"],
.ui-toaster__status[data-kind="error"] [data-mark="cross"] {
  opacity: 1;
  animation: ui-toaster-draw 380ms 120ms var(--ui-toast-ease) forwards;
}

.ui-toaster__text { flex: 1; min-width: 0; animation: ui-toaster-fade 300ms var(--ui-toast-ease); }
.ui-toaster__title {
  font-size: 14px;
  line-height: 20px;
  font-weight: 600;
  color: var(--ui-toast-ink);
  overflow-wrap: anywhere;
}
.ui-toaster__description {
  margin-top: 2px;
  font-size: 13px;
  line-height: 18px;
  color: var(--ui-toast-text);
  overflow-wrap: anywhere;
}

.ui-toaster__action {
  flex: none;
  align-self: center;
  position: relative;
  height: 30px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid var(--ui-toast-firm);
  background: var(--ui-toast-secondary);
  box-shadow: var(--ui-toast-drop);
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  color: var(--ui-toast-ink);
  cursor: pointer;
  transition: background-color 150ms var(--ui-toast-ease), border-color 150ms var(--ui-toast-ease);
}
.ui-toaster__action:hover { background: var(--ui-toast-soft); }
.ui-toaster__action:focus-visible,
.ui-toaster__close:focus-visible { outline: none; box-shadow: 0 0 0 3px var(--ui-toast-ring); }

.ui-toaster__close {
  position: absolute;
  top: 6px;
  right: 6px;
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  padding: 0;
  border: 1px solid var(--ui-toast-hairline);
  border-radius: 999px;
  background: var(--ui-toast-panel);
  color: var(--ui-toast-muted);
  cursor: pointer;
  opacity: 0;
  transition: opacity 150ms var(--ui-toast-ease), color 150ms var(--ui-toast-ease);
}
.ui-toaster__close svg { width: 12px; height: 12px; fill: none; stroke: currentColor; stroke-width: 1.6; stroke-linecap: round; }
.ui-toaster__close:hover { color: var(--ui-toast-ink); }
.ui-toaster__toast:hover .ui-toaster__close,
.ui-toaster__toast:focus-within .ui-toaster__close { opacity: 1; }
.ui-toaster__toast:has(.ui-toaster__close) .ui-toaster__inner { padding-right: 30px; }

.ui-toaster__hairline {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background: var(--ui-toast-firm);
  transform-origin: 0 50%;
  animation-name: ui-toaster-time;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}

.ui-toaster__sr {
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

@media (hover: none) {
  .ui-toaster__close { opacity: 1; }
  .ui-toaster__close::after { content: ""; position: absolute; inset: -10px; }
  .ui-toaster__action { height: 36px; padding: 0 14px; }
}

@keyframes ui-toaster-spin { to { transform: rotate(360deg); } }
@keyframes ui-toaster-draw { to { stroke-dashoffset: 0; } }
@keyframes ui-toaster-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes ui-toaster-time { from { transform: scaleX(1); } to { transform: scaleX(0); } }

@media (prefers-reduced-motion: reduce) {
  .ui-toaster__list,
  .ui-toaster__toast,
  .ui-toaster__toast[data-swiped],
  .ui-toaster__inner,
  .ui-toaster__ring { transition: none; }
  .ui-toaster__text { animation: none; }
  .ui-toaster__status[data-kind="success"] [data-mark="check"],
  .ui-toaster__status[data-kind="error"] [data-mark="cross"] { animation: none; stroke-dashoffset: 0; }
  .ui-toaster__hairline { animation: none; opacity: 0; }
}
`;var X="ateam-toaster-demo",Mt=t=>new Promise(e=>setTimeout(e,t));function yt(){B.success("Draft saved",{toaster:X,description:"Q3 Board Report \xB7 all changes kept"})}function wt(){B("File moved to trash",{toaster:X,description:"Q3-Board-Report.pdf",action:{label:"Undo",onClick:()=>B.info("File restored",{toaster:X,description:"Back in Finance"})}})}function Tt(){B.promise(Mt(2200).then(()=>({people:12})),{loading:{title:"Uploading report\u2026",description:"Q3-Board-Report.pdf \xB7 4.2 MB"},success:t=>({title:"Report uploaded",description:`Shared with ${t.people} people`}),error:{title:"Upload failed",description:"Try again in a moment"}},{toaster:X}).catch(()=>{})}function kt(){B.promise(Mt(1800).then(()=>Promise.reject(new Error("offline"))),{loading:{title:"Syncing with Drive\u2026",description:"3 files"},success:{title:"Everything is in sync"},error:{title:"Sync failed",description:"Drive is unreachable \xB7 we'll retry in 5 min"}},{toaster:X}).catch(()=>{})}function Kt(){let t=P(null);return b(()=>{let e=!1,r=[],n=[[700,Tt],[4200,yt],[6200,wt],[8600,kt]];for(let[h,v]of n)r.push(setTimeout(()=>!e&&v(),h));let u=()=>{e=!0,r.forEach(clearTimeout)},d=t.current;return d?.addEventListener("pointerdown",u,{once:!0}),d?.addEventListener("keydown",u,{once:!0}),d?.addEventListener("click",u,{once:!0}),()=>{u(),d?.removeEventListener("pointerdown",u),d?.removeEventListener("keydown",u),d?.removeEventListener("click",u),B.dismiss()}},[]),p("div",{ref:t,className:"ui-toaster-demo",children:[o("style",{href:"ui-toaster-demo",precedence:"default",children:Vt}),p("div",{className:"ui-toaster-demo__frame",children:[p("div",{className:"ui-toaster-demo__panel",children:[p("div",{className:"ui-toaster-demo__head",children:[o("span",{className:"ui-toaster-demo__pebble","aria-hidden":"true",children:o(Nt,{d:"M6 2.75h5.2L15 6.6v10.15a.5.5 0 0 1-.5.5h-8.5a.5.5 0 0 1-.5-.5V3.25a.5.5 0 0 1 .5-.5ZM11 2.9v3.85h3.85M7.9 10.5h4.2M7.9 13.3h4.2"})}),p("div",{children:[o("div",{className:"ui-toaster-demo__title",children:"Q3 Board Report"}),o("div",{className:"ui-toaster-demo__meta",children:"Finance \xB7 edited 2 min ago"})]})]}),p("div",{className:"ui-toaster-demo__actions",children:[o(it,{onClick:yt,icon:"M4.75 3.25h8.4l2.1 2.1v10.9a.5.5 0 0 1-.5.5H4.75a.5.5 0 0 1-.5-.5V3.75a.5.5 0 0 1 .5-.5ZM7 3.4v3.35h5.4V3.4M7 16.6v-4.6h6v4.6",children:"Save draft"}),o(it,{onClick:wt,icon:"M4 5.75h12M8.25 5.6V4.1a.6.6 0 0 1 .6-.6h2.3a.6.6 0 0 1 .6.6v1.5M5.6 5.9l.75 10.35a.8.8 0 0 0 .8.75h5.7a.8.8 0 0 0 .8-.75l.75-10.35M8.6 8.9v5.2M11.4 8.9v5.2",children:"Delete file"}),o(it,{onClick:Tt,icon:"M10 12.75V3.9M6.6 7.1 10 3.7l3.4 3.4M4 11.9v3.6a.75.75 0 0 0 .75.75h10.5a.75.75 0 0 0 .75-.75v-3.6",children:"Upload report"}),o(it,{onClick:kt,icon:"M15.3 8.3A5.5 5.5 0 0 0 5.2 6.4M4.7 11.7a5.5 5.5 0 0 0 10.1 1.9M15.6 3.9v4.5h-4.5M4.4 16.1v-4.5h4.5",children:"Sync"})]})]}),p("p",{className:"ui-toaster-demo__hint",children:["Press ",o("kbd",{children:"F8"})," to jump to notifications"]})]}),o("div",{className:"ui-toaster-demo__stage",children:o(_t,{id:X,inline:!0,position:"top-center",offset:0})})]})}function it({icon:t,onClick:e,children:r}){return p("button",{type:"button",className:"ui-toaster-demo__button",onClick:e,children:[o(Nt,{d:t}),o("span",{children:r})]})}function Nt({d:t}){return o("svg",{viewBox:"0 0 20 20","aria-hidden":"true",className:"ui-toaster-demo__icon",children:o("path",{d:t})})}var Vt=`
.ui-toaster-demo {
  --demo-frame: #f2f6fa;
  --demo-panel: #ffffff;
  --demo-hairline: #dae2ec;
  --demo-firm: #cbd6e4;
  --demo-soft: rgba(26, 62, 112, 0.06);
  --demo-ink: #00162b;
  --demo-text: rgba(0, 22, 43, 0.66);
  --demo-muted: rgba(0, 22, 43, 0.54);
  --demo-secondary: #fbfcfe;
  --demo-ring: #8fbdf2;
  --demo-pebble-light: inset 0 -2px 6px -4px rgba(26, 62, 112, 0.4);
  --demo-drop: 0 8px 16px -8px rgba(26, 62, 112, 0.2);
  --demo-raised: 0 18px 30px -16px rgba(26, 62, 112, 0.38), 0 4px 10px -6px rgba(26, 62, 112, 0.18);
  --demo-short: 0 2px 4px -2px rgba(26, 62, 112, 0.2);
  width: 100%;
  max-width: 356px;
  font-family: "Avenir Next", Avenir, system-ui, sans-serif;
  color: var(--demo-ink);
}
:where(.dark, [data-theme="dark"]) .ui-toaster-demo {
  --demo-frame: #0f2747;
  --demo-panel: #16345c;
  --demo-hairline: rgba(255, 255, 255, 0.12);
  --demo-firm: rgba(255, 255, 255, 0.18);
  --demo-soft: rgba(255, 255, 255, 0.07);
  --demo-ink: rgba(255, 255, 255, 0.94);
  --demo-text: rgba(255, 255, 255, 0.72);
  --demo-muted: rgba(255, 255, 255, 0.56);
  --demo-secondary: rgba(255, 255, 255, 0.05);
  --demo-ring: rgba(143, 189, 242, 0.6);
  --demo-pebble-light: inset 0 -2px 6px -4px rgba(3, 12, 28, 0.8);
  --demo-drop: 0 8px 16px -8px rgba(3, 12, 28, 0.6);
  --demo-raised: 0 18px 30px -16px rgba(3, 12, 28, 0.8), 0 4px 10px -6px rgba(3, 12, 28, 0.6);
  --demo-short: 0 2px 4px -2px rgba(3, 12, 28, 0.6);
}
.ui-toaster-demo__frame {
  padding: 6px;
  border-radius: 22px;
  background: var(--demo-frame);
  border: 1px solid var(--demo-hairline);
  box-shadow: var(--demo-drop);
}
.ui-toaster-demo__panel {
  padding: 14px;
  border-radius: 16px;
  background: var(--demo-panel);
  border: 1px solid var(--demo-hairline);
  box-shadow: var(--demo-raised);
}
.ui-toaster-demo__head { display: flex; align-items: center; gap: 12px; padding: 2px 2px 14px; min-width: 0; }
.ui-toaster-demo__head > div { min-width: 0; }
.ui-toaster-demo__pebble {
  flex: none;
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--demo-panel);
  border: 1px solid var(--demo-hairline);
  box-shadow: var(--demo-pebble-light);
  color: var(--demo-ink);
}
.ui-toaster-demo__title {
  font-family: "Avenir Next Condensed", "Avenir Next", Avenir, system-ui, sans-serif;
  font-weight: 700;
  font-size: 16px;
  line-height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-toaster-demo__meta { font-size: 12.5px; line-height: 18px; color: var(--demo-muted); }
.ui-toaster-demo__actions { display: grid; grid-template-columns: repeat(auto-fit, minmax(128px, 1fr)); gap: 6px; }
.ui-toaster-demo__button {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 38px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid var(--demo-firm);
  background: var(--demo-secondary);
  box-shadow: var(--demo-short);
  font: inherit;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--demo-ink);
  cursor: pointer;
  text-align: left;
  transition: background-color 150ms cubic-bezier(0.16, 1, 0.3, 1);
}
.ui-toaster-demo__button:hover { background: var(--demo-soft); }
.ui-toaster-demo__button:active { transform: translateY(1px); }
.ui-toaster-demo__button:focus-visible { outline: none; box-shadow: 0 0 0 3px var(--demo-ring); }
.ui-toaster-demo__icon {
  flex: none;
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.4;
  stroke-linecap: round;
  stroke-linejoin: round;
  color: var(--demo-muted);
}
.ui-toaster-demo__pebble .ui-toaster-demo__icon { color: var(--demo-ink); }
.ui-toaster-demo__hint { margin: 0; padding: 9px 8px 5px; text-align: center; font-size: 12.5px; color: var(--demo-muted); }
.ui-toaster-demo__hint kbd {
  display: inline-block;
  min-width: 18px;
  padding: 1px 5px;
  margin: 0 2px;
  border-radius: 6px;
  border: 1px solid var(--demo-hairline);
  border-bottom-color: var(--demo-firm);
  border-bottom-width: 2px;
  background: var(--demo-panel);
  font: inherit;
  font-size: 11.5px;
  font-weight: 600;
  color: var(--demo-ink);
}
.ui-toaster-demo__stage { position: relative; height: 200px; margin-top: 14px; }
.ui-toaster-demo__stage .ui-toaster { width: 100%; max-width: 100%; }
@media (prefers-reduced-motion: reduce) {
  .ui-toaster-demo__button { transition: none; }
  .ui-toaster-demo__button:active { transform: none; }
}
`;export{Kt as default};
