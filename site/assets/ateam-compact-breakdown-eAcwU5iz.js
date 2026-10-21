import{t as le}from"./react-BkAXpnfr.js";var de=le();var{Children:Se,Component:Ee,Fragment:Ne,StrictMode:Me,cloneElement:Le,createContext:Pe,createElement:$e,createRef:Ae,forwardRef:Te,isValidElement:Oe,lazy:ze,memo:Ce,startTransition:Ie,Suspense:De,use:Be,useCallback:te,useContext:Fe,useDebugValue:je,useDeferredValue:He,useEffect:_,useId:ae,useImperativeHandle:qe,useInsertionEffect:Ue,useLayoutEffect:V,useMemo:K,useOptimistic:Ve,useReducer:Ke,useRef:w,useState:h,useSyncExternalStore:Je,useTransition:Ye}=de;import{t as be}from"./jsx-runtime-CTsRTJUX.js";var pe=be(),{jsx:i,jsxs:g,Fragment:ie}=pe;var fe=7,me=620,F=320,ge=t=>Math.round(t).toLocaleString("en-US"),N=t=>t.id??t.label,ve=t=>1-Math.pow(1-t,4);function he(){let[t,d]=h(!1);return _(()=>{if(typeof window>"u"||!window.matchMedia)return;let n=window.matchMedia("(prefers-reduced-motion: reduce)"),s=()=>d(n.matches);return s(),n.addEventListener("change",s),()=>n.removeEventListener("change",s)},[]),t}function xe(t,d){let[n,s]=h(()=>Object.fromEntries(Object.keys(t).map(c=>[c,0]))),m=w(n);m.current=n;let p=JSON.stringify(t);return _(()=>{let c=JSON.parse(p);if(d){s(c);return}let x={...m.current},r=Array.from(new Set([...Object.keys(x),...Object.keys(c)])),o=performance.now(),b=0,y=k=>{let $=Math.min(1,(k-o)/me),j=ve($),M={};for(let L of r){if($>=1&&!(L in c))continue;let v=x[L]??0,T=c[L]??0;M[L]=v+(T-v)*j}s(M),$<1&&(b=requestAnimationFrame(y))};return b=requestAnimationFrame(y),()=>cancelAnimationFrame(b)},[p,d]),n}function _e({periods:t,value:d,onChange:n}){let s=w(null),[m,p]=h(null),c=te(()=>{let o=s.current?.querySelector('[aria-checked="true"]');o&&p({left:o.offsetLeft,width:o.offsetWidth})},[]);return V(c,[d,t,c]),_(()=>{let r=s.current;if(!r||typeof ResizeObserver>"u")return;let o=new ResizeObserver(c);return o.observe(r),()=>o.disconnect()},[c]),g("div",{className:"ui-at-cb__switch",role:"radiogroup","aria-label":"Period",ref:s,onKeyDown:r=>{let o=Math.max(0,t.findIndex(y=>y.id===d)),b=-1;r.key==="ArrowRight"||r.key==="ArrowDown"?b=(o+1)%t.length:r.key==="ArrowLeft"||r.key==="ArrowUp"?b=(o-1+t.length)%t.length:r.key==="Home"?b=0:r.key==="End"&&(b=t.length-1),!(b<0)&&(r.preventDefault(),n(t[b].id),s.current?.querySelectorAll('[role="radio"]')[b]?.focus())},children:[m&&i("span",{className:"ui-at-cb__pill","aria-hidden":"true",style:{transform:`translateX(${m.left}px)`,width:m.width}}),t.map(r=>{let o=r.id===d;return i("button",{type:"button",role:"radio","aria-checked":o,tabIndex:o?0:-1,className:"ui-at-cb__option",onClick:()=>n(r.id),children:r.label},r.id)})]})}function re({items:t,title:d="Breakdown",periods:n,period:s,defaultPeriod:m,onPeriodChange:p,delta:c,format:x=ge,totalLabel:r="Total",footer:o,className:b}){let y=ae(),k=he(),[$,j]=h(m??n?.[0]?.id??""),M=s??$,L=e=>{e!==M&&(s===void 0&&j(e),p?.(e))},v=w(new Map);for(let e of t){let a=N(e);v.current.has(a)||v.current.set(a,v.current.size)}let T=(e,a)=>a??`var(--ui-at-cb-c${(v.current.get(e)??0)%fe+1})`,P=K(()=>t.map(e=>({...e,value:Number.isFinite(e.value)?Math.max(0,e.value):0})),[t]),A=P.reduce((e,a)=>e+a.value,0),O=K(()=>[...P].sort((e,a)=>a.value-e.value),[P]),[z,Y]=h(()=>O.map(e=>({id:N(e),label:e.label,color:e.color,leaving:!1}))),oe=O.map(e=>`${N(e)}\0${e.label}\0${e.color??""}`).join("");_(()=>{Y(a=>{let u=O.map(l=>({id:N(l),label:l.label,color:l.color,leaving:!1})),f=new Set(u.map(l=>l.id));return a.forEach((l,U)=>{f.has(l.id)||u.splice(Math.min(U,u.length),0,{...l,leaving:!0})}),u});let e=window.setTimeout(()=>Y(a=>a.filter(u=>!u.leaving)),k?0:F);return()=>window.clearTimeout(e)},[oe,k]);let[R,S]=h(null),E=R?P.find(e=>N(e)===R):void 0;_(()=>{R&&!E&&S(null)},[R,E]);let W={"\0big":E?E.value:A};for(let e of P)W[N(e)]=e.value;let C=xe(W,k),I=z.reduce((e,a)=>e+(C[a.id]??0),0),X=w(null),Z=w(new Map),ce=z.map(e=>e.id).join("");V(()=>{let e=X.current;if(!e)return;let a=new Map;e.querySelectorAll("[data-row]").forEach(u=>a.set(u.dataset.row,u.offsetTop)),!k&&typeof e.animate=="function"&&e.querySelectorAll("[data-row]").forEach(u=>{let f=Z.current.get(u.dataset.row),l=a.get(u.dataset.row);f===void 0||l===void 0||f===l||u.animate([{transform:`translateY(${f-l}px)`},{transform:"translateY(0)"}],{duration:420,easing:"cubic-bezier(.16, 1, .3, 1)"})}),Z.current=a},[ce,k]);let H=O[0],G=o===null?null:o!==void 0?o:H&&H.value>0?g(ie,{children:["Largest: ",i("strong",{children:H.label})]}):null,q=typeof c=="number"&&Number.isFinite(c),D=q?c:0,Q=`${Math.abs(D).toLocaleString("en-US",{maximumFractionDigits:1})}%`,se=`${r}: ${x(A)}${q?`, ${D>=0?"up":"down"} ${Q} against the previous period`:""}`,ue=[...z].sort((e,a)=>(v.current.get(e.id)??0)-(v.current.get(a.id)??0)),ee=A<=0;return g("div",{role:"group","aria-labelledby":y,className:["ui-at-cb",b].filter(Boolean).join(" "),"data-hovering":R?"":void 0,children:[i("style",{href:"ui-compact-breakdown",precedence:"default",children:we}),g("div",{className:"ui-at-cb__panel",children:[g("div",{className:"ui-at-cb__head",children:[i("h3",{className:"ui-at-cb__title",id:y,children:d}),n&&n.length>0&&i(_e,{periods:n,value:M,onChange:L})]}),g("div",{className:"ui-at-cb__figure","aria-hidden":"true",children:[i("span",{className:"ui-at-cb__big",children:x(C["\0big"]??0)}),q&&!E&&g("span",{className:"ui-at-cb__delta","data-down":D<0?"":void 0,children:[i("svg",{viewBox:"0 0 12 12",width:"10",height:"10","aria-hidden":"true",children:i("path",{d:"M6 10V2M2.5 5.5 6 2l3.5 3.5",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round"})}),Q]},`${M}:${D}`)]}),i("p",{className:"ui-at-cb__sub","aria-hidden":"true",children:E?E.label:r}),i("p",{className:"ui-at-cb__sr","aria-live":"polite",children:se}),i("div",{className:"ui-at-cb__bar","aria-hidden":"true",children:!ee&&ue.map(e=>{let a=C[e.id]??0,u=I>0?a/I*100:0;return i("span",{className:"ui-at-cb__seg","data-active":R===e.id?"":void 0,style:{width:`${u}%`,"--ui-at-cb-part":T(e.id,e.color)},onPointerEnter:f=>f.pointerType==="mouse"&&!e.leaving&&S(e.id),onPointerLeave:f=>f.pointerType==="mouse"&&S(null)},e.id)})}),ee?i("p",{className:"ui-at-cb__empty",children:"Nothing to show for this period yet."}):i("ul",{className:"ui-at-cb__list",ref:X,onPointerLeave:()=>S(null),children:z.map(e=>{let a=C[e.id]??0,f=P.find(B=>N(B)===e.id)?.value??0,l=I>0?Math.round(a/I*100):0,U=A>0?Math.round(f/A*100):0;return i("li",{"data-row":e.id,className:"ui-at-cb__item","data-leaving":e.leaving?"":void 0,children:i("div",{className:"ui-at-cb__fold",children:g("div",{className:"ui-at-cb__row",tabIndex:e.leaving?-1:0,"aria-label":`${e.label}: ${x(f)}, ${U}%`,"data-active":R===e.id?"":void 0,style:{"--ui-at-cb-part":T(e.id,e.color)},onPointerEnter:()=>!e.leaving&&S(e.id),onFocus:()=>!e.leaving&&S(e.id),onBlur:()=>S(B=>B===e.id?null:B),children:[i("span",{className:"ui-at-cb__dot","aria-hidden":"true"}),i("span",{className:"ui-at-cb__label","aria-hidden":"true",children:e.label}),i("span",{className:"ui-at-cb__value","aria-hidden":"true",children:x(a)}),g("span",{className:"ui-at-cb__share","aria-hidden":"true",children:[l,"%"]})]})})},e.id)})})]}),G!==null&&i("div",{className:"ui-at-cb__tray",children:G})]})}var we=`
.ui-at-cb {
  --ui-at-cb-frame: #f2f6fa;
  --ui-at-cb-panel: #ffffff;
  --ui-at-cb-soft: rgba(26, 62, 112, 0.06);
  --ui-at-cb-line: #dae2ec;
  --ui-at-cb-firm: #cbd6e4;
  --ui-at-cb-ink: #00162b;
  --ui-at-cb-text: rgba(0, 22, 43, 0.66);
  --ui-at-cb-muted: rgba(0, 22, 43, 0.54);
  --ui-at-cb-info-ink: #1a3e70;
  --ui-at-cb-info-fill: #eef5ff;
  --ui-at-cb-ring: #8fbdf2;
  --ui-at-cb-up-ink: #1d6a34;
  --ui-at-cb-up-fill: #eafbee;
  --ui-at-cb-up-line: #c9f5cf;
  --ui-at-cb-down-ink: #8a3a22;
  --ui-at-cb-down-fill: #fdeee8;
  --ui-at-cb-down-line: #f5d5c9;
  --ui-at-cb-pebble: #ffffff;
  --ui-at-cb-c1: #2c5a96;
  --ui-at-cb-c2: #5b8fd0;
  --ui-at-cb-c3: #a9cdf5;
  --ui-at-cb-c4: #98a5b8;
  --ui-at-cb-c5: #cdd5e0;
  --ui-at-cb-c6: #851437;
  --ui-at-cb-c7: #2e8b57;
  --ui-at-cb-drop: 0 8px 16px -8px rgba(26, 62, 112, 0.2);
  --ui-at-cb-raised: 0 18px 30px -16px rgba(26, 62, 112, 0.38), 0 4px 10px -6px rgba(26, 62, 112, 0.18);
  --ui-at-cb-floating: 0 24px 48px -24px rgba(26, 62, 112, 0.3);
  --ui-at-cb-ease: cubic-bezier(0.16, 1, 0.3, 1);

  container-type: inline-size;
  box-sizing: border-box;
  width: 100%;
  max-width: 360px;
  padding: 6px;
  border-radius: 22px;
  background: var(--ui-at-cb-frame);
  border: 1px solid var(--ui-at-cb-line);
  box-shadow: var(--ui-at-cb-floating);
  color: var(--ui-at-cb-ink);
  font-family: "Avenir Next", Avenir, system-ui, sans-serif;
  font-size: 13px;
  line-height: 1.4;
  -webkit-font-smoothing: antialiased;
}
:where(.dark, [data-theme="dark"]) .ui-at-cb {
  --ui-at-cb-frame: #0f2747;
  --ui-at-cb-panel: #16345c;
  --ui-at-cb-soft: rgba(255, 255, 255, 0.07);
  --ui-at-cb-line: rgba(255, 255, 255, 0.12);
  --ui-at-cb-firm: rgba(255, 255, 255, 0.18);
  --ui-at-cb-ink: rgba(255, 255, 255, 0.94);
  --ui-at-cb-text: rgba(255, 255, 255, 0.72);
  --ui-at-cb-muted: rgba(255, 255, 255, 0.56);
  --ui-at-cb-info-ink: #c1daff;
  --ui-at-cb-info-fill: rgba(143, 189, 242, 0.16);
  --ui-at-cb-ring: rgba(143, 189, 242, 0.6);
  --ui-at-cb-up-ink: #7fe0a0;
  --ui-at-cb-up-fill: rgba(127, 224, 160, 0.14);
  --ui-at-cb-up-line: rgba(127, 224, 160, 0.3);
  --ui-at-cb-down-ink: #f2a48c;
  --ui-at-cb-down-fill: rgba(242, 164, 140, 0.14);
  --ui-at-cb-down-line: rgba(242, 164, 140, 0.3);
  --ui-at-cb-pebble: #1d416f;
  --ui-at-cb-c1: #8fbdf2;
  --ui-at-cb-c2: #5b8fd0;
  --ui-at-cb-c3: #2f5f9e;
  --ui-at-cb-c4: #a9b6c8;
  --ui-at-cb-c5: #6f7f96;
  --ui-at-cb-c6: #e0628a;
  --ui-at-cb-c7: #7fe0a0;
  --ui-at-cb-drop: 0 8px 16px -8px rgba(3, 12, 28, 0.6);
  --ui-at-cb-raised: 0 18px 30px -16px rgba(3, 12, 28, 0.8), 0 4px 10px -6px rgba(3, 12, 28, 0.6);
  --ui-at-cb-floating: 0 24px 48px -24px rgba(3, 12, 28, 0.7);
}

.ui-at-cb__panel {
  padding: 14px 14px 10px;
  border-radius: 16px;
  background: var(--ui-at-cb-panel);
  border: 1px solid var(--ui-at-cb-line);
  box-shadow: var(--ui-at-cb-raised);
}
.ui-at-cb__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  min-width: 0;
}
.ui-at-cb__title {
  margin: 0;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: "Avenir Next Condensed", "Avenir Next", Avenir, system-ui, sans-serif;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.005em;
}

.ui-at-cb__switch {
  position: relative;
  display: inline-flex;
  flex: none;
  padding: 2px;
  border-radius: 10px;
  background: var(--ui-at-cb-soft);
  border: 1px solid var(--ui-at-cb-line);
}
.ui-at-cb__pill {
  position: absolute;
  top: 2px;
  bottom: 2px;
  left: 0;
  border-radius: 8px;
  background: var(--ui-at-cb-pebble);
  border: 1px solid var(--ui-at-cb-firm);
  box-sizing: border-box;
  box-shadow: var(--ui-at-cb-drop);
  transition: transform 300ms var(--ui-at-cb-ease), width 300ms var(--ui-at-cb-ease);
}
.ui-at-cb__option {
  position: relative;
  z-index: 1;
  min-width: 34px;
  height: 24px;
  padding: 0 8px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--ui-at-cb-muted);
  font: inherit;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: color 150ms var(--ui-at-cb-ease);
}
.ui-at-cb__option[aria-checked="true"] { color: var(--ui-at-cb-ink); font-weight: 600; }
.ui-at-cb__option:hover { color: var(--ui-at-cb-ink); }
.ui-at-cb__option:focus-visible { outline: 3px solid var(--ui-at-cb-ring); outline-offset: 0; }

.ui-at-cb__figure {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 14px;
  min-height: 34px;
}
.ui-at-cb__big {
  font-size: 28px;
  font-weight: 600;
  letter-spacing: -0.01em;
  font-variant-numeric: tabular-nums;
  line-height: 1.1;
  white-space: nowrap;
}
.ui-at-cb__delta {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  height: 20px;
  padding: 0 7px;
  border-radius: 999px;
  font-size: 11.5px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: var(--ui-at-cb-up-ink);
  background: var(--ui-at-cb-up-fill);
  border: 1px solid var(--ui-at-cb-up-line);
  animation: ui-at-cb-pop 300ms var(--ui-at-cb-ease) both;
}
.ui-at-cb__delta[data-down] {
  color: var(--ui-at-cb-down-ink);
  background: var(--ui-at-cb-down-fill);
  border-color: var(--ui-at-cb-down-line);
}
.ui-at-cb__delta[data-down] svg { transform: rotate(180deg); }
.ui-at-cb__sub {
  margin: 2px 0 0;
  color: var(--ui-at-cb-muted);
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ui-at-cb__sr {
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

.ui-at-cb__bar {
  display: flex;
  height: 8px;
  margin: 14px 0 8px;
  border-radius: 999px;
  background: var(--ui-at-cb-soft);
  overflow: visible;
}
.ui-at-cb__seg {
  box-sizing: border-box;
  flex: none;
  height: 100%;
  padding-right: 2px;
  background: var(--ui-at-cb-part);
  background-clip: content-box;
  border-radius: 3px;
  transition: opacity 300ms var(--ui-at-cb-ease), transform 150ms var(--ui-at-cb-ease);
}
.ui-at-cb__seg:first-child { border-radius: 999px 3px 3px 999px; }
.ui-at-cb__seg:last-child { padding-right: 0; border-radius: 3px 999px 999px 3px; }
.ui-at-cb__seg:only-child { border-radius: 999px; }
.ui-at-cb[data-hovering] .ui-at-cb__seg { opacity: 0.32; }
.ui-at-cb[data-hovering] .ui-at-cb__seg[data-active] { opacity: 1; transform: scaleY(1.5); }

.ui-at-cb__list { list-style: none; margin: 0; padding: 0; }
.ui-at-cb__item {
  display: grid;
  grid-template-rows: 1fr;
  transition: grid-template-rows ${F}ms var(--ui-at-cb-ease), opacity ${F}ms var(--ui-at-cb-ease);
  animation: ui-at-cb-unfold ${F}ms var(--ui-at-cb-ease) both;
}
.ui-at-cb__item[data-leaving] { grid-template-rows: 0fr; opacity: 0; }
.ui-at-cb__fold { min-height: 0; overflow: hidden; }
.ui-at-cb__row {
  display: grid;
  grid-template-columns: 8px minmax(0, 1fr) auto 3.2em;
  align-items: center;
  gap: 10px;
  height: 30px;
  margin: 0 -6px;
  padding: 0 6px;
  border-radius: 8px;
  outline: none;
  cursor: default;
  transition: background-color 150ms var(--ui-at-cb-ease), opacity 300ms var(--ui-at-cb-ease);
}
.ui-at-cb[data-hovering] .ui-at-cb__row { opacity: 0.55; }
.ui-at-cb[data-hovering] .ui-at-cb__row[data-active] { opacity: 1; background: var(--ui-at-cb-soft); }
.ui-at-cb__row:focus-visible { box-shadow: inset 0 0 0 2px var(--ui-at-cb-ring); }
.ui-at-cb__dot { width: 8px; height: 8px; border-radius: 2px; background: var(--ui-at-cb-part); }
.ui-at-cb__label {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--ui-at-cb-text);
}
.ui-at-cb__row[data-active] .ui-at-cb__label { color: var(--ui-at-cb-ink); }
.ui-at-cb__value {
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  color: var(--ui-at-cb-ink);
}
.ui-at-cb__share {
  text-align: right;
  font-variant-numeric: tabular-nums;
  color: var(--ui-at-cb-muted);
}
.ui-at-cb__empty {
  margin: 4px 0 6px;
  padding: 14px;
  border-radius: 10px;
  border: 1px dashed var(--ui-at-cb-firm);
  color: var(--ui-at-cb-muted);
  text-align: center;
  font-size: 12.5px;
}

.ui-at-cb__tray {
  padding: 10px 12px 6px;
  color: var(--ui-at-cb-muted);
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-at-cb__tray strong { color: var(--ui-at-cb-ink); font-weight: 600; }
.ui-at-cb__tray a { color: var(--ui-at-cb-info-ink); font-weight: 600; text-decoration: none; }
.ui-at-cb__tray a:hover { text-decoration: underline; }
.ui-at-cb__tray a:focus-visible { outline: 3px solid var(--ui-at-cb-ring); border-radius: 4px; }

@container (max-width: 250px) {
  .ui-at-cb__row { grid-template-columns: 8px minmax(0, 1fr) auto; }
  .ui-at-cb__share { display: none; }
  .ui-at-cb__head { flex-wrap: wrap; }
}
@media (pointer: coarse) {
  .ui-at-cb__row { height: 38px; }
  .ui-at-cb__option { height: 32px; }
}

@keyframes ui-at-cb-pop {
  from { opacity: 0; transform: scale(0.85); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes ui-at-cb-unfold {
  from { grid-template-rows: 0fr; opacity: 0; }
  to { grid-template-rows: 1fr; opacity: 1; }
}
@media (prefers-reduced-motion: reduce) {
  .ui-at-cb *, .ui-at-cb *::before, .ui-at-cb *::after {
    animation: none !important;
    transition: none !important;
  }
}
`;var ne=[{id:"7d",label:"7d"},{id:"30d",label:"30d"},{id:"90d",label:"90d"}],ye={"7d":{delta:12.4,items:[{id:"direct",label:"Direct",value:4210},{id:"organic",label:"Organic search",value:3980},{id:"referrals",label:"Referrals",value:2360},{id:"social",label:"Social",value:1840},{id:"email",label:"Email",value:1200}]},"30d":{delta:8.1,items:[{id:"direct",label:"Direct",value:16900},{id:"organic",label:"Organic search",value:18400},{id:"referrals",label:"Referrals",value:7300},{id:"social",label:"Social",value:9800},{id:"email",label:"Email",value:5200}]},"90d":{delta:-3.2,items:[{id:"direct",label:"Direct",value:47600},{id:"organic",label:"Organic search",value:58300},{id:"referrals",label:"Referrals",value:21900},{id:"social",label:"Social",value:36400}]}},J=ne.map(t=>t.id);function ke(){let[t,d]=h("7d"),n=w(!1);_(()=>{let p=window.setInterval(()=>{n.current||d(c=>J[(J.indexOf(c)+1)%J.length])},2800);return()=>window.clearInterval(p)},[]);let{items:s,delta:m}=ye[t];return i(re,{title:"Revenue by channel",periods:ne,period:t,onPeriodChange:p=>{n.current=!0,d(p)},items:s,delta:m,format:p=>`$${Math.round(p).toLocaleString("en-US")}`,totalLabel:"Total revenue"})}export{ke as default};
