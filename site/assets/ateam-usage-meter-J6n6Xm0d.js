import{t as Da}from"./react-BkAXpnfr.js";var Ma=Da();var{Children:Ja,Component:Ya,Fragment:Wa,StrictMode:Za,cloneElement:Qa,createContext:ae,createElement:ee,createRef:te,forwardRef:ie,isValidElement:ue,lazy:re,memo:ne,startTransition:oe,Suspense:se,use:le,useCallback:ca,useContext:me,useDebugValue:de,useDeferredValue:ce,useEffect:M,useId:pa,useImperativeHandle:pe,useInsertionEffect:fe,useLayoutEffect:fa,useMemo:ga,useOptimistic:ge,useReducer:be,useRef:U,useState:k,useSyncExternalStore:he,useTransition:_e}=Ma;import{t as Aa}from"./jsx-runtime-CTsRTJUX.js";var Ea=Aa(),{jsx:t,jsxs:u,Fragment:F}=Ea;var Ra=6,Ua=700,J=320,La=864e5,p=e=>Math.round(e).toLocaleString("en-US"),G=(e,n)=>e.toLocaleString("en-US",{minimumFractionDigits:n,maximumFractionDigits:n}),Ta=e=>1-Math.pow(1-e,4),H=e=>typeof e=="number"&&Number.isFinite(e)?Math.max(0,e):0;function za(){let[e,n]=k(!1);return M(()=>{if(typeof window>"u"||!window.matchMedia)return;let l=window.matchMedia("(prefers-reduced-motion: reduce)"),s=()=>n(l.matches);return s(),l.addEventListener("change",s),()=>l.removeEventListener("change",s)},[]),e}function Ia(e,n){let[l,s]=k(()=>Object.fromEntries(Object.keys(e).map(d=>[d,0]))),h=U(l);h.current=l;let P=JSON.stringify(e);return M(()=>{let d=JSON.parse(P);if(n){s(d);return}let R={...h.current},o=Array.from(new Set([...Object.keys(R),...Object.keys(d)])),_=performance.now(),f=0,A=x=>{let L=Math.min(1,(x-_)/Ua),Y=Ta(L),K={};for(let T of o){if(L>=1&&!(T in d))continue;let C=R[T]??0,O=d[T]??0;K[T]=C+(O-C)*Y}s(K),L<1&&(f=requestAnimationFrame(A))};return f=requestAnimationFrame(A),()=>cancelAnimationFrame(f)},[P,n]),l}function Ca(e){if(e==null||e==="")return null;let n=typeof e=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(e)?new Date(`${e}T00:00:00`):new Date(e);return Number.isNaN(n.getTime())?null:n}function Oa(e){let n=Math.ceil((e.getTime()-Date.now())/La);return n<=0?"Resets today":n===1?"Resets tomorrow":`Resets in ${n} days`}function ja({periods:e,value:n,onChange:l}){let s=U(null),[h,P]=k(null),d=ca(()=>{let o=s.current?.querySelector('[aria-checked="true"]');o&&P({left:o.offsetLeft,width:o.offsetWidth})},[]);return fa(d,[n,e,d]),M(()=>{let o=s.current;if(!o||typeof ResizeObserver>"u")return;let _=new ResizeObserver(d);return _.observe(o),()=>_.disconnect()},[d]),u("div",{className:"ui-at-um__switch",role:"radiogroup","aria-label":"Period",ref:s,onKeyDown:o=>{let _=Math.max(0,e.findIndex(A=>A.id===n)),f=-1;o.key==="ArrowRight"||o.key==="ArrowDown"?f=(_+1)%e.length:o.key==="ArrowLeft"||o.key==="ArrowUp"?f=(_-1+e.length)%e.length:o.key==="Home"?f=0:o.key==="End"&&(f=e.length-1),!(f<0)&&(o.preventDefault(),l(e[f].id),s.current?.querySelectorAll('[role="radio"]')[f]?.focus())},children:[h&&t("span",{className:"ui-at-um__pill","aria-hidden":"true",style:{transform:`translateX(${h.left}px)`,width:h.width}}),e.map(o=>{let _=o.id===n;return t("button",{type:"button",role:"radio","aria-checked":_,tabIndex:_?0:-1,className:"ui-at-um__option",onClick:()=>l(o.id),children:o.label},o.id)})]})}function ba({total:e,used:n,limits:l=[],periods:s,period:h,defaultPeriod:P,onPeriodChange:d,resetAt:R,daily:o,onUpgrade:_,title:f="Usage",plan:A,unit:x="credits",warnAt:L=.8,upgradeLabel:Y="Upgrade",topUpLabel:K="Add credits",className:T}){let C=pa(),O=za(),[ha,_a]=k(P??s?.[0]?.id??""),ea=h??ha,xa=a=>{a!==ea&&(h===void 0&&_a(a),d?.(a))},N=H(e),g=ga(()=>n.map(a=>({...a,value:H(a.value)})),[n]),v=g.reduce((a,i)=>a+i.value,0),ta=N>0?v/N:0,$=ta>=1?"limit":ta>=L?"warn":"ok",ia=Math.max(0,N-v),q=U(new Map);for(let a of g)q.current.has(a.label)||q.current.set(a.label,q.current.size);let ua=(a,i)=>i??`var(--ui-at-um-c${(q.current.get(a)??0)%Ra+1})`,[j,ra]=k(()=>g.map(a=>({label:a.label,color:a.color,leaving:!1}))),va=g.map(a=>`${a.label}\0${a.color??""}`).join("");M(()=>{ra(i=>{let r=g.map(w=>({label:w.label,color:w.color,leaving:!1})),m=new Set(r.map(w=>w.label));return i.forEach((w,V)=>{m.has(w.label)||r.splice(Math.min(V,r.length),0,{...w,leaving:!0})}),r});let a=window.setTimeout(()=>ra(i=>i.filter(r=>!r.leaving)),O?0:J);return()=>window.clearTimeout(a)},[va,O]);let W={"\0used":v};for(let a of g)W[`p:${a.label}`]=a.value;l.forEach((a,i)=>W[`l:${i}`]=H(a.used));let z=Ia(W,O),[E,S]=k(null),y=E?g.find(a=>a.label===E):void 0;M(()=>{E&&!y&&S(null)},[E,y]);let ya=a=>{if(!g.length)return;let i=g.findIndex(r=>r.label===E);a.key==="ArrowRight"||a.key==="ArrowDown"?(a.preventDefault(),S(g[(i+1)%g.length].label)):a.key==="ArrowLeft"||a.key==="ArrowUp"?(a.preventDefault(),S(g[i<=0?g.length-1:i-1].label)):a.key==="Escape"&&E&&(a.preventDefault(),S(null))},c=o??[],[b,D]=k(null),B=c.filter(a=>typeof a.value=="number"&&Number.isFinite(a.value)),na=B.length?B.reduce((a,i)=>a+i.value,0)/B.length:0,wa=Math.max(1,...B.map(a=>a.value)),ka=a=>{if(!c.length)return;let i=b??-1;a.key==="ArrowRight"?(a.preventDefault(),D(Math.min(c.length-1,i+1))):a.key==="ArrowLeft"?(a.preventDefault(),D(i<0?c.length-1:Math.max(0,i-1))):a.key==="Home"?(a.preventDefault(),D(0)):a.key==="End"?(a.preventDefault(),D(c.length-1)):a.key==="Escape"&&b!==null&&(a.preventDefault(),D(null))};M(()=>{b!==null&&b>=c.length&&D(null)},[b,c.length]);let oa=`${f}: ${$==="limit"?"limit reached, ":$==="warn"?"running low, ":""}${p(v)} of ${p(N)} ${x} used`,[Na,$a]=k(""),sa=U(!0);M(()=>{if(sa.current){sa.current=!1;return}$a(oa)},[oa]);let I=Ca(R),la=z["\0used"]??0,X=Math.max(N,j.reduce((a,i)=>a+(z[`p:${i.label}`]??0),0)),Sa=N>0?Math.min(999,Math.round(la/N*100)):0,ma=0;if(y&&X>0){let a=0;for(let i of j){let r=z[`p:${i.label}`]??0;if(i.label===y.label){ma=(a+r/2)/X*100;break}a+=r}}let Z=$==="ok"?{label:Y,strong:!1}:{label:K,strong:!0};return u("section",{className:["ui-at-um",T].filter(Boolean).join(" "),"aria-labelledby":C,"data-state":$,"data-hovering":E?"":void 0,children:[t("style",{href:"ui-usage-meter",precedence:"default",children:Fa}),u("div",{className:"ui-at-um__panel",children:[u("header",{className:"ui-at-um__head",children:[u("div",{className:"ui-at-um__id",children:[t("h3",{className:"ui-at-um__title",id:C,children:f}),(A||I)&&u("p",{className:"ui-at-um__meta",children:[A&&t("span",{children:A}),A&&I&&t("span",{"aria-hidden":"true",children:" \xB7 "}),I&&t("time",{dateTime:I.toISOString(),title:I.toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"}),children:Oa(I)})]})]}),s&&s.length>0&&t(ja,{periods:s,value:ea,onChange:xa})]}),u("div",{className:"ui-at-um__figure","aria-hidden":"true",children:[t("span",{className:"ui-at-um__big",children:p(la)}),u("span",{className:"ui-at-um__of",children:["of ",p(N)," ",x]}),u("span",{className:"ui-at-um__pct",children:[$!=="ok"&&t("span",{className:"ui-at-um__flag"},$),Sa,"%"]})]}),u("div",{className:"ui-at-um__bar",role:"meter",tabIndex:0,"aria-label":`${f} ${x} used`,"aria-valuemin":0,"aria-valuemax":N,"aria-valuenow":Math.min(v,N),"aria-valuetext":`${p(v)} of ${p(N)} ${x}`,onKeyDown:ya,onBlur:()=>S(null),onPointerLeave:()=>S(null),children:[t("div",{className:"ui-at-um__track",children:j.map(a=>{let i=z[`p:${a.label}`]??0;return t("span",{className:"ui-at-um__seg","data-active":E===a.label?"":void 0,style:{width:`${X>0?i/X*100:0}%`,"--ui-at-um-part":ua(a.label,a.color)},onPointerEnter:()=>!a.leaving&&S(a.label),onPointerDown:()=>!a.leaving&&S(a.label)},a.label)})}),y&&u("span",{className:"ui-at-um__tip","aria-hidden":"true",style:{left:`${Math.min(88,Math.max(12,ma))}%`},children:[t("strong",{children:y.label})," ",p(y.value)," \xB7"," ",v>0?Math.round(y.value/v*100):0,"%"]}),t("span",{className:"ui-at-um__sr","aria-live":"polite",children:y?`${y.label}: ${p(y.value)} ${x}, ${v>0?Math.round(y.value/v*100):0}%`:""})]}),j.length===0?u("p",{className:"ui-at-um__empty",children:["No ",x," used in this period yet."]}):t("ul",{className:"ui-at-um__legend",children:j.map(a=>{let i=z[`p:${a.label}`]??0,r=g.find(m=>m.label===a.label)?.value??0;return t("li",{className:"ui-at-um__item","data-leaving":a.leaving?"":void 0,children:t("div",{className:"ui-at-um__fold",children:u("div",{className:"ui-at-um__row","data-active":E===a.label?"":void 0,style:{"--ui-at-um-part":ua(a.label,a.color)},onPointerEnter:()=>!a.leaving&&S(a.label),onPointerLeave:()=>S(null),onClick:()=>!a.leaving&&S(m=>m===a.label?null:a.label),children:[t("span",{className:"ui-at-um__dot","aria-hidden":"true"}),t("span",{className:"ui-at-um__label",children:a.label}),u("span",{className:"ui-at-um__value",children:[t("span",{"aria-hidden":"true",children:p(i)}),u("span",{className:"ui-at-um__sr",children:[p(r)," ",x]})]}),u("span",{className:"ui-at-um__share",children:[v>0?Math.round(r/v*100):0,"%"]})]})})},a.label)})}),c.length>0&&u("div",{className:"ui-at-um__daily",children:[u("div",{className:"ui-at-um__daily-head",children:[t("span",{children:"Per day"}),t("span",{"aria-hidden":"true",children:b!==null?u(F,{children:[c[b].label," \xB7"," ",t("strong",{children:c[b].value===null?"\u2013":p(c[b].value)})]}):u(F,{children:["Avg ",t("strong",{children:p(na)})," / day"]})})]}),u("div",{className:"ui-at-um__spark",tabIndex:0,role:"group","aria-label":`${x} per day, average ${p(na)} \u2013 use the arrow keys to read each day`,"data-few":c.length<=10?"":void 0,onKeyDown:ka,onBlur:()=>D(null),onPointerLeave:()=>D(null),children:[c.map((a,i)=>{let r=a.value===null||!Number.isFinite(a.value),m=r?0:Math.max(.06,a.value/wa);return t("span",{className:"ui-at-um__day","data-future":r?"":void 0,"data-active":b===i?"":void 0,style:{"--ui-at-um-h":m},onPointerEnter:()=>D(i),onPointerDown:()=>D(i)},`${a.label}-${i}`)}),t("span",{className:"ui-at-um__sr","aria-live":"polite",children:b!==null?`${c[b].label}: ${c[b].value===null?"no data yet":`${p(c[b].value)} ${x}`}`:""})]})]}),l.length>0&&t("ul",{className:"ui-at-um__limits",children:l.map((a,i)=>{let r=a.total===null||a.total===void 0,m=r?0:H(a.total),w=H(a.used),V=a.decimals??(Number.isInteger(w)?0:1),Q=!r&&m>0&&w/m>=L,Pa=`${G(w,V)} of ${r?"\u221E":G(m,a.decimals??(Number.isInteger(m)?0:1))}${a.unit?` ${a.unit}`:""}`,da=z[`l:${i}`]??0;return u("li",{className:"ui-at-um__limit","data-low":Q?"":void 0,children:[u("span",{className:"ui-at-um__limit-label",children:[a.label,Q&&t("span",{className:"ui-at-um__flag","aria-hidden":"true"})]}),u("span",{className:"ui-at-um__limit-value","aria-hidden":"true",children:[t("strong",{children:G(da,V)})," of ",r?"\u221E":G(m,a.decimals??(Number.isInteger(m)?0:1)),a.unit?` ${a.unit}`:""]}),t("span",{className:"ui-at-um__limit-track",role:"meter","aria-label":a.label,"aria-valuemin":0,"aria-valuemax":r?void 0:m,"aria-valuenow":r?void 0:Math.min(w,m),"aria-valuetext":`${Pa}${r?", unlimited":""}${Q?", running low":""}`,"data-unlimited":r?"":void 0,children:!r&&t("span",{style:{width:`${m>0?Math.min(100,da/m*100):0}%`}})})]},`${a.label}-${i}`)})})]}),u("footer",{className:"ui-at-um__tray",children:[u("span",{className:"ui-at-um__status",children:[$!=="ok"&&t("span",{className:"ui-at-um__flag","aria-hidden":"true"},$),$==="limit"?t("strong",{children:"Limit reached"}):$==="warn"?u(F,{children:[t("strong",{children:"Running low"})," \xB7 ",p(ia)," left"]}):u(F,{children:[p(ia)," ",x," left"]})]}),t("button",{type:"button",className:"ui-at-um__button","data-strong":Z.strong?"":void 0,onClick:()=>_?.($),children:Z.label},Z.strong?"strong":"quiet")]}),t("p",{className:"ui-at-um__sr","aria-live":"polite",children:Na})]})}var Fa=`
.ui-at-um {
  --ui-at-um-frame: #f2f6fa;
  --ui-at-um-panel: #ffffff;
  --ui-at-um-pale: #fbfcfe;
  --ui-at-um-soft: rgba(26, 62, 112, 0.06);
  --ui-at-um-line: #dae2ec;
  --ui-at-um-firm: #cbd6e4;
  --ui-at-um-ink: #00162b;
  --ui-at-um-text: rgba(0, 22, 43, 0.66);
  --ui-at-um-muted: rgba(0, 22, 43, 0.54);
  --ui-at-um-berry: #851437;
  --ui-at-um-berry-hover: #6d0f2d;
  --ui-at-um-ring: #8fbdf2;
  --ui-at-um-warn: #d99a0b;
  --ui-at-um-warn-ink: #775810;
  --ui-at-um-fill: #1a3e70;
  --ui-at-um-stub: #dae2ec;
  --ui-at-um-bar: rgba(26, 62, 112, 0.18);
  --ui-at-um-bar-hot: #2c5a96;
  --ui-at-um-c1: #2c5a96;
  --ui-at-um-c2: #5b8fd0;
  --ui-at-um-c3: #a9cdf5;
  --ui-at-um-c4: #98a5b8;
  --ui-at-um-c5: #c3ccd8;
  --ui-at-um-c6: #6c7a8f;
  --ui-at-um-drop: 0 8px 16px -8px rgba(26, 62, 112, 0.2);
  --ui-at-um-raised: 0 18px 30px -16px rgba(26, 62, 112, 0.38), 0 4px 10px -6px rgba(26, 62, 112, 0.18);
  --ui-at-um-floating: 0 24px 48px -24px rgba(26, 62, 112, 0.3);
  --ui-at-um-ease: cubic-bezier(0.16, 1, 0.3, 1);

  container-type: inline-size;
  position: relative;
  box-sizing: border-box;
  width: 100%;
  max-width: 460px;
  padding: 6px;
  border-radius: 22px;
  background: var(--ui-at-um-frame);
  border: 1px solid var(--ui-at-um-line);
  box-shadow: var(--ui-at-um-floating);
  color: var(--ui-at-um-ink);
  font-family: "Avenir Next", Avenir, system-ui, sans-serif;
  font-size: 13px;
  line-height: 1.4;
  -webkit-font-smoothing: antialiased;
}
:where(.dark, [data-theme="dark"]) .ui-at-um {
  --ui-at-um-frame: #0f2747;
  --ui-at-um-panel: #16345c;
  --ui-at-um-pale: #1d416f;
  --ui-at-um-soft: rgba(255, 255, 255, 0.07);
  --ui-at-um-line: rgba(255, 255, 255, 0.12);
  --ui-at-um-firm: rgba(255, 255, 255, 0.18);
  --ui-at-um-ink: rgba(255, 255, 255, 0.94);
  --ui-at-um-text: rgba(255, 255, 255, 0.72);
  --ui-at-um-muted: rgba(255, 255, 255, 0.56);
  --ui-at-um-berry: #a8204d;
  --ui-at-um-berry-hover: #bd2a5a;
  --ui-at-um-ring: rgba(143, 189, 242, 0.6);
  --ui-at-um-warn: #f3d27a;
  --ui-at-um-warn-ink: #f3d27a;
  --ui-at-um-fill: #c1daff;
  --ui-at-um-stub: rgba(255, 255, 255, 0.14);
  --ui-at-um-bar: rgba(255, 255, 255, 0.16);
  --ui-at-um-bar-hot: #8fbdf2;
  --ui-at-um-c1: #8fbdf2;
  --ui-at-um-c2: #5b8fd0;
  --ui-at-um-c3: #2f5f9e;
  --ui-at-um-c4: #a9b6c8;
  --ui-at-um-c5: #6f7f96;
  --ui-at-um-c6: #4c5d77;
  --ui-at-um-drop: 0 8px 16px -8px rgba(3, 12, 28, 0.6);
  --ui-at-um-raised: 0 18px 30px -16px rgba(3, 12, 28, 0.8), 0 4px 10px -6px rgba(3, 12, 28, 0.6);
  --ui-at-um-floating: 0 24px 48px -24px rgba(3, 12, 28, 0.7);
}

.ui-at-um__panel {
  padding: 16px 16px 14px;
  border-radius: 16px;
  background: var(--ui-at-um-panel);
  border: 1px solid var(--ui-at-um-line);
  box-shadow: var(--ui-at-um-raised);
}
.ui-at-um__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}
.ui-at-um__id { min-width: 0; }
.ui-at-um__title {
  margin: 0;
  font-family: "Avenir Next Condensed", "Avenir Next", Avenir, system-ui, sans-serif;
  font-size: 17px;
  font-weight: 700;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-at-um__meta {
  margin: 2px 0 0;
  color: var(--ui-at-um-muted);
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ui-at-um__meta time { cursor: help; }

.ui-at-um__switch {
  position: relative;
  display: inline-flex;
  flex: none;
  padding: 2px;
  border-radius: 10px;
  background: var(--ui-at-um-soft);
  border: 1px solid var(--ui-at-um-line);
}
.ui-at-um__pill {
  position: absolute;
  top: 2px;
  bottom: 2px;
  left: 0;
  box-sizing: border-box;
  border-radius: 8px;
  background: var(--ui-at-um-panel);
  border: 1px solid var(--ui-at-um-firm);
  box-shadow: var(--ui-at-um-drop);
  transition: transform 300ms var(--ui-at-um-ease), width 300ms var(--ui-at-um-ease);
}
.ui-at-um__option {
  position: relative;
  z-index: 1;
  height: 24px;
  padding: 0 9px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--ui-at-um-muted);
  font: inherit;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  transition: color 150ms var(--ui-at-um-ease);
}
.ui-at-um__option[aria-checked="true"] { color: var(--ui-at-um-ink); font-weight: 600; }
.ui-at-um__option:hover { color: var(--ui-at-um-ink); }
.ui-at-um__option:focus-visible { outline: 3px solid var(--ui-at-um-ring); outline-offset: 0; }

.ui-at-um__figure {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-top: 16px;
}
.ui-at-um__big {
  font-size: 28px;
  font-weight: 600;
  letter-spacing: -0.01em;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
}
.ui-at-um__of { color: var(--ui-at-um-muted); font-size: 12.5px; white-space: nowrap; }
.ui-at-um__pct {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
.ui-at-um__flag {
  display: inline-block;
  flex: none;
  width: 7px;
  height: 7px;
  margin-left: 5px;
  border-radius: 50%;
  background: var(--ui-at-um-warn);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--ui-at-um-warn) 22%, transparent);
  animation: ui-at-um-pop 300ms var(--ui-at-um-ease) both;
}
.ui-at-um__pct .ui-at-um__flag, .ui-at-um__status .ui-at-um__flag { margin-left: 0; }

.ui-at-um__bar {
  position: relative;
  margin: 12px -4px 6px;
  padding: 4px;
  border-radius: 8px;
  outline: none;
}
.ui-at-um__bar:focus-visible { box-shadow: 0 0 0 3px var(--ui-at-um-ring); }
.ui-at-um__track {
  display: flex;
  height: 10px;
  border-radius: 999px;
  background: var(--ui-at-um-soft);
  overflow: hidden;
}
.ui-at-um__seg {
  box-sizing: border-box;
  flex: none;
  height: 100%;
  padding-right: 2px;
  background: var(--ui-at-um-part);
  background-clip: content-box;
  transition: opacity 300ms var(--ui-at-um-ease);
}
.ui-at-um[data-hovering] .ui-at-um__seg { opacity: 0.35; }
.ui-at-um[data-hovering] .ui-at-um__seg[data-active] { opacity: 1; }
.ui-at-um__tip {
  position: absolute;
  bottom: calc(100% + 4px);
  transform: translateX(-50%);
  padding: 5px 9px;
  border-radius: 9px;
  background: var(--ui-at-um-panel);
  border: 1px solid var(--ui-at-um-firm);
  box-shadow: var(--ui-at-um-floating), var(--ui-at-um-drop);
  color: var(--ui-at-um-text);
  font-size: 12px;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
  pointer-events: none;
  transition: left 150ms var(--ui-at-um-ease);
  animation: ui-at-um-fade 150ms var(--ui-at-um-ease) both;
  z-index: 2;
}
.ui-at-um__tip strong { color: var(--ui-at-um-ink); font-weight: 600; }

.ui-at-um__legend { list-style: none; margin: 4px 0 0; padding: 0; }
.ui-at-um__item {
  display: grid;
  grid-template-rows: 1fr;
  transition: grid-template-rows ${J}ms var(--ui-at-um-ease), opacity ${J}ms var(--ui-at-um-ease);
  animation: ui-at-um-unfold ${J}ms var(--ui-at-um-ease) both;
}
.ui-at-um__item[data-leaving] { grid-template-rows: 0fr; opacity: 0; }
.ui-at-um__fold { min-height: 0; overflow: hidden; }
.ui-at-um__row {
  display: grid;
  grid-template-columns: 8px minmax(0, 1fr) auto 3em;
  align-items: center;
  gap: 10px;
  height: 30px;
  margin: 0 -6px;
  padding: 0 6px;
  border-radius: 8px;
  cursor: default;
  transition: background-color 150ms var(--ui-at-um-ease), opacity 300ms var(--ui-at-um-ease);
}
.ui-at-um[data-hovering] .ui-at-um__row { opacity: 0.55; }
.ui-at-um[data-hovering] .ui-at-um__row[data-active] { opacity: 1; background: var(--ui-at-um-soft); }
.ui-at-um__dot { width: 8px; height: 8px; border-radius: 2px; background: var(--ui-at-um-part); }
.ui-at-um__label { min-width: 0; color: var(--ui-at-um-text); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ui-at-um__value { font-weight: 500; font-variant-numeric: tabular-nums; white-space: nowrap; }
.ui-at-um__share { text-align: right; color: var(--ui-at-um-muted); font-variant-numeric: tabular-nums; }
.ui-at-um__empty {
  margin: 8px 0 4px;
  padding: 12px;
  border-radius: 10px;
  border: 1px dashed var(--ui-at-um-firm);
  color: var(--ui-at-um-muted);
  text-align: center;
  font-size: 12.5px;
}

.ui-at-um__daily { margin-top: 14px; }
.ui-at-um__daily-head {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  color: var(--ui-at-um-muted);
  font-size: 12px;
  white-space: nowrap;
}
.ui-at-um__daily-head strong { color: var(--ui-at-um-ink); font-weight: 600; font-variant-numeric: tabular-nums; }
.ui-at-um__spark {
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 34px;
  margin: 8px -3px 0;
  padding: 3px;
  border-radius: 6px;
  outline: none;
}
.ui-at-um__spark:focus-visible { box-shadow: 0 0 0 3px var(--ui-at-um-ring); }
.ui-at-um__spark[data-few] .ui-at-um__day { max-width: 34px; }
.ui-at-um__day {
  flex: 1 1 0;
  min-width: 2px;
  height: calc(var(--ui-at-um-h) * 100%);
  border-radius: 2px;
  background: var(--ui-at-um-bar);
  transition: height 300ms var(--ui-at-um-ease), background-color 150ms var(--ui-at-um-ease);
}
.ui-at-um__day[data-future] { height: 2px; background: var(--ui-at-um-stub); }
.ui-at-um__day[data-active] { background: var(--ui-at-um-bar-hot); }
.ui-at-um__day[data-future][data-active] { background: var(--ui-at-um-muted); }

.ui-at-um__limits {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px 18px;
  list-style: none;
  margin: 14px 0 0;
  padding: 14px 0 0;
  border-top: 1px solid var(--ui-at-um-line);
}
.ui-at-um__limit { display: grid; gap: 2px; min-width: 0; }
.ui-at-um__limit-label {
  display: inline-flex;
  align-items: center;
  color: var(--ui-at-um-muted);
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ui-at-um__limit-value { color: var(--ui-at-um-muted); font-size: 12.5px; white-space: nowrap; }
.ui-at-um__limit-value strong { color: var(--ui-at-um-ink); font-weight: 600; font-variant-numeric: tabular-nums; }
.ui-at-um__limit-track {
  display: block;
  height: 4px;
  margin-top: 6px;
  border-radius: 999px;
  background: var(--ui-at-um-soft);
  overflow: hidden;
}
.ui-at-um__limit-track > span { display: block; height: 100%; border-radius: inherit; background: var(--ui-at-um-fill); }
.ui-at-um__limit-track[data-unlimited] {
  background: repeating-linear-gradient(135deg, var(--ui-at-um-firm) 0 4px, transparent 4px 8px);
}

.ui-at-um__tray {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 6px 2px 12px;
  min-height: 40px;
}
.ui-at-um__status {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  min-width: 0;
  color: var(--ui-at-um-muted);
  font-size: 12.5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ui-at-um__status strong { color: var(--ui-at-um-ink); font-weight: 600; }
.ui-at-um[data-state="warn"] .ui-at-um__status strong { color: var(--ui-at-um-warn-ink); }
.ui-at-um__button {
  flex: none;
  height: 32px;
  padding: 0 14px;
  border-radius: 10px;
  border: 1px solid var(--ui-at-um-firm);
  background: var(--ui-at-um-pale);
  color: var(--ui-at-um-ink);
  box-shadow: var(--ui-at-um-drop);
  font: inherit;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 150ms var(--ui-at-um-ease), border-color 150ms var(--ui-at-um-ease), transform 150ms var(--ui-at-um-ease);
}
.ui-at-um__button:hover { border-color: var(--ui-at-um-muted); }
.ui-at-um__button:active { transform: translateY(1px); }
.ui-at-um__button:focus-visible { outline: 3px solid var(--ui-at-um-ring); outline-offset: 1px; }
.ui-at-um__button[data-strong] {
  border-color: transparent;
  background: var(--ui-at-um-berry);
  color: #ffffff;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 6px 12px -6px rgba(133, 20, 55, 0.6);
  animation: ui-at-um-nudge 520ms var(--ui-at-um-ease) both;
}
.ui-at-um__button[data-strong]:hover { background: var(--ui-at-um-berry-hover); }

.ui-at-um__sr {
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
  .ui-at-um__head { flex-direction: column; align-items: stretch; }
  .ui-at-um__switch { align-self: flex-start; max-width: 100%; }
  .ui-at-um__limits { grid-template-columns: 1fr; gap: 10px; }
  .ui-at-um__limit { grid-template-columns: minmax(0, 1fr) auto; align-items: center; column-gap: 10px; }
  .ui-at-um__limit-track { grid-column: 1 / -1; margin-top: 2px; }
}
@container (max-width: 300px) {
  .ui-at-um__row { grid-template-columns: 8px minmax(0, 1fr) auto; }
  .ui-at-um__share { display: none; }
  .ui-at-um__of { font-size: 11.5px; }
  .ui-at-um__big { font-size: 24px; }
}
@media (pointer: coarse) {
  .ui-at-um__row { height: 38px; }
  .ui-at-um__option { height: 34px; }
  .ui-at-um__button { height: 38px; }
  .ui-at-um__track { height: 14px; }
  .ui-at-um__spark { height: 40px; }
}

@keyframes ui-at-um-pop {
  0% { opacity: 0; transform: scale(0.3); }
  70% { opacity: 1; transform: scale(1.25); }
  100% { opacity: 1; transform: scale(1); }
}
@keyframes ui-at-um-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes ui-at-um-nudge {
  0% { transform: translateX(0) scale(0.96); }
  35% { transform: translateX(-3px) scale(1.02); }
  65% { transform: translateX(2px); }
  100% { transform: translateX(0) scale(1); }
}
@keyframes ui-at-um-unfold {
  from { grid-template-rows: 0fr; opacity: 0; }
  to { grid-template-rows: 1fr; opacity: 1; }
}
@media (prefers-reduced-motion: reduce) {
  .ui-at-um *, .ui-at-um *::before, .ui-at-um *::after {
    animation: none !important;
    transition: none !important;
  }
}
`;var Ha=[{id:"month",label:"This month"},{id:"last",label:"Last month"},{id:"7d",label:"7 days"}],Ka=[312,388,402,330,346,260,268,384,390,356,362,280,262,360,398,408,372,352,312,300],qa=[210,352,360,330,338,248,240,362,362,340,340,252,234,360,368,354,346,352,298,286,386,340,392,368,330,290,312,330],aa=(e,n)=>e.map((l,s)=>({label:`Oct ${n+s}`,value:l})),Ba={month:{used:[{label:"Chat",value:3980},{label:"Search",value:1640},{label:"Image",value:1120},{label:"API",value:680}],limits:[{label:"Seats",used:8,total:10},{label:"Storage",used:3.2,total:5,unit:"GB"},{label:"Projects",used:12,total:null}],daily:aa([...Ka.slice(0,22),...Array(9).fill(null)],1)},last:{used:[{label:"Chat",value:5210},{label:"Search",value:2140},{label:"Image",value:1690},{label:"API",value:960}],limits:[{label:"Seats",used:10,total:10},{label:"Storage",used:2.9,total:5,unit:"GB"},{label:"Projects",used:11,total:null}],daily:aa(qa,1)},"7d":{used:[{label:"Chat",value:1180},{label:"Search",value:560},{label:"API",value:400}],limits:[{label:"Seats",used:8,total:10},{label:"Storage",used:3.2,total:5,unit:"GB"},{label:"Projects",used:12,total:null}],daily:aa([298,334,312,286,302,318,290],16)}},Xa=["month","last","7d","month"];function Va(){let[e,n]=k("month"),l=U(!1),[s]=k(()=>Date.now()+8.5*864e5);M(()=>{let P=Xa.slice(1).map((d,R)=>window.setTimeout(()=>{l.current||n(d)},3e3*(R+1)));return()=>P.forEach(d=>window.clearTimeout(d))},[]);let h=Ba[e];return t(ba,{title:"Acme AI",plan:"Pro plan",total:1e4,used:h.used,limits:h.limits,daily:h.daily,periods:Ha,period:e,onPeriodChange:P=>{l.current=!0,n(P)},resetAt:s,onUpgrade:()=>{}})}export{Va as default};
