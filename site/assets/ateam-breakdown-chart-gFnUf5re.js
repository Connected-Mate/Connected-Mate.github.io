import{t as pt}from"./react-BkAXpnfr.js";var ft=pt();var{Children:Ct,Component:Rt,Fragment:Lt,StrictMode:Dt,cloneElement:Pt,createContext:zt,createElement:Bt,createRef:$t,forwardRef:At,isValidElement:It,lazy:Kt,memo:Ht,startTransition:Ot,Suspense:jt,use:Ut,useCallback:Ft,useContext:Wt,useDebugValue:Vt,useDeferredValue:Yt,useEffect:at,useId:K,useImperativeHandle:Xt,useInsertionEffect:qt,useLayoutEffect:Gt,useMemo:et,useOptimistic:Jt,useReducer:Zt,useRef:H,useState:v,useSyncExternalStore:Qt,useTransition:ta}=ft;import{t as gt}from"./jsx-runtime-CTsRTJUX.js";var mt=gt(),{jsx:a,jsxs:n,Fragment:O}=mt;var _t=8,xt=200,j="none",M=d=>d.toLocaleString("en-US",{maximumFractionDigits:1});function ht(d){if(!(d>0))return[0,1,2,3,4,5];let o=d/5,l=Math.pow(10,Math.floor(Math.log10(o))),f=10*l;for(let s of[1,2,2.5,5,10])if(s*l>=o){f=s*l;break}return Array.from({length:6},(s,p)=>p*f)}function V({label:d,options:o,value:l,onChange:f}){let s=K(),p=H(null),w=H(null),D=H(null),[m,N]=v(!1),[C,x]=v(0),P=o.find(e=>e.id===l)??o[0],z=e=>{x(e??Math.max(0,o.findIndex(i=>i.id===l))),N(!0)},S=(e=!0)=>{N(!1),e&&w.current?.focus()},R=e=>{let i=o[e];S(),i&&i.id!==l&&f(i.id)};at(()=>{if(!m)return;D.current?.focus();let e=i=>{p.current&&!p.current.contains(i.target)&&N(!1)};return document.addEventListener("pointerdown",e),()=>document.removeEventListener("pointerdown",e)},[m]);let E=e=>{e.key==="ArrowDown"?(e.preventDefault(),x(i=>Math.min(o.length-1,i+1))):e.key==="ArrowUp"?(e.preventDefault(),x(i=>Math.max(0,i-1))):e.key==="Home"?(e.preventDefault(),x(0)):e.key==="End"?(e.preventDefault(),x(o.length-1)):e.key==="Enter"||e.key===" "?(e.preventDefault(),R(C)):e.key==="Escape"?(e.preventDefault(),e.stopPropagation(),S()):e.key==="Tab"&&N(!1)};return n("div",{className:"ui-at-bc__picker",ref:p,children:[a("span",{className:"ui-at-bc__picker-label",id:`${s}-label`,children:d}),n("button",{ref:w,type:"button",className:"ui-at-bc__picker-button","aria-haspopup":"listbox","aria-expanded":m,"aria-controls":m?`${s}-list`:void 0,"aria-labelledby":`${s}-label ${s}-value`,onClick:()=>m?S(!1):z(),onKeyDown:e=>{(e.key==="ArrowDown"||e.key==="ArrowUp")&&(e.preventDefault(),z(e.key==="ArrowUp"?o.length-1:void 0))},children:[a("span",{id:`${s}-value`,children:P?.label}),a("svg",{viewBox:"0 0 16 16",width:"13",height:"13","aria-hidden":"true",children:a("path",{d:"m4.5 6.5 3.5 3.5 3.5-3.5",fill:"none",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})})]}),m&&a("ul",{ref:D,id:`${s}-list`,role:"listbox",tabIndex:-1,"aria-labelledby":`${s}-label`,"aria-activedescendant":`${s}-o${C}`,className:"ui-at-bc__list",onKeyDown:E,children:o.map((e,i)=>n("li",{id:`${s}-o${i}`,role:"option","aria-selected":e.id===l,"data-active":i===C?"":void 0,className:"ui-at-bc__opt",onPointerMove:()=>x(i),onClick:()=>R(i),children:[a("span",{children:e.label}),e.id===l&&a("svg",{viewBox:"0 0 16 16",width:"13",height:"13","aria-hidden":"true",children:a("path",{d:"m3.5 8.3 3 3 6-6.6",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round"})})]},e.id))})]})}function it({records:d,dimensions:o,measures:l,title:f="Workload",defaultMeasure:s,defaultSlice:p,defaultSegment:w,className:D}){let m=K(),N=K(),[C,x]=v(s??l[0]?.key??""),[P,z]=v(p??o[0]?.key??""),[S,R]=v(w??o.find(t=>t.key!==(p??o[0]?.key))?.key??j),[E,e]=v(()=>new Set),[i,h]=v(null),y=l.find(t=>t.key===C)??l[0],u=o.find(t=>t.key===P)??o[0],b=S===j?void 0:o.find(t=>t.key===S&&t.key!==u?.key),q=y?.unit??"",ct=t=>{t===S&&R(P),z(t),h(null)},st=t=>{R(t),e(new Set)},k=b?b.values:["\0all"],B=(t,r)=>b?.colors?.[t]??`var(--ui-at-bc-c${r%_t+1})`,{matrix:$,totals:G,grand:J}=et(()=>{let t=new Map,r=new Map,c=0;if(!u||!y)return{matrix:t,totals:r,grand:0};for(let g of u.values)t.set(g,new Map(k.map(_=>[_,0]))),r.set(g,0);for(let g of d){let _=y.field?Number(g[y.field]):1;if(!Number.isFinite(_))continue;c+=_;let F=String(g[u.key]??""),I=t.get(F);if(!I)continue;let W=b?String(g[b.key]??""):"\0all";I.has(W)&&(I.set(W,(I.get(W)??0)+_),r.set(F,(r.get(F)??0)+_))}return{matrix:t,totals:r,grand:c}},[d,u,b,y]),Z=k.filter(t=>!E.has(t)),Q=t=>Z.reduce((r,c)=>r+($.get(t)?.get(c)??0),0),U=ht(Math.max(0,...(u?.values??[]).map(Q))),tt=U[U.length-1]||1,lt=t=>e(r=>{let c=new Set(r);return c.has(t)?c.delete(t):k.length-c.size>1&&c.add(t),c}),T=u?.values??[],A=i?T.indexOf(i):-1,ut=A>=0&&(A+.5)/T.length>.6?"left":"right",bt=J===0,dt=(t,r)=>{let c=t.currentTarget.parentElement?.parentElement?.querySelectorAll(".ui-at-bc__bar");if(t.key==="Escape")h(null);else if((t.key==="ArrowRight"||t.key==="ArrowLeft")&&c){t.preventDefault();let g=Math.min(c.length-1,Math.max(0,r+(t.key==="ArrowRight"?1:-1)));c[g]?.focus()}};return n("section",{className:["ui-at-bc",D].filter(Boolean).join(" "),"aria-labelledby":m,"data-hovering":i?"":void 0,children:[a("style",{href:"ui-breakdown-chart",precedence:"default",children:yt}),n("header",{className:"ui-at-bc__head",children:[a("h3",{className:"ui-at-bc__title",id:m,children:f}),n("p",{className:"ui-at-bc__grand",children:[a("strong",{children:M(J)})," ",q]})]}),n("div",{className:"ui-at-bc__panel",children:[n("div",{className:"ui-at-bc__pickers",children:[a(V,{label:"Measure",options:l.map(t=>({id:t.key,label:t.label})),value:y?.key??"",onChange:x}),a(V,{label:"Slice",options:o.map(t=>({id:t.key,label:t.label})),value:u?.key??"",onChange:ct}),a(V,{label:"Segment",options:[{id:j,label:"None"},...o.filter(t=>t.key!==u?.key).map(t=>({id:t.key,label:t.label}))],value:b?.key??j,onChange:st})]}),n("div",{className:"ui-at-bc__chart",children:[n("div",{className:"ui-at-bc__plot",onPointerLeave:()=>h(null),children:[a("div",{className:"ui-at-bc__grid","aria-hidden":"true",children:U.map(t=>a("span",{style:{bottom:`${t/tt*100}%`},children:a("em",{children:M(t)})},t))}),a("div",{className:"ui-at-bc__cols",children:T.map((t,r)=>a("div",{className:"ui-at-bc__col","data-active":i===t?"":void 0,children:a("button",{type:"button",className:"ui-at-bc__bar","aria-label":`${t}: ${M(G.get(t)??0)} ${q}`.trim(),"aria-describedby":N,onPointerEnter:()=>h(t),onFocus:()=>h(t),onBlur:()=>h(c=>c===t?null:c),onKeyDown:c=>dt(c,r),children:a("span",{className:"ui-at-bc__stack","aria-hidden":"true",children:k.map((c,g)=>{let _=E.has(c)?0:$.get(t)?.get(c)??0;return a("span",{className:"ui-at-bc__seg","data-zero":_===0?"":void 0,style:{height:`${_/tt*100}%`,"--ui-at-bc-part":b?B(c,g):"var(--ui-at-bc-single)"}},c)})})})},t))}),i&&A>=0&&n("div",{className:"ui-at-bc__tip","aria-hidden":"true","data-side":ut,style:{left:`${(A+.5)/T.length*100}%`},children:[n("p",{className:"ui-at-bc__tip-head",children:[u?.icons?.[i]&&a("span",{className:"ui-at-bc__icon",children:u.icons[i]}),a("span",{children:i}),a("strong",{children:M(Q(i))})]}),b&&a("ul",{children:[...Z].reverse().map(t=>n("li",{style:{"--ui-at-bc-part":B(t,k.indexOf(t))},children:[a("span",{className:"ui-at-bc__swatch"}),a("span",{children:t}),a("span",{className:"ui-at-bc__tip-value",children:M($.get(i)?.get(t)??0)})]},t))})]}),bt&&a("p",{className:"ui-at-bc__empty",children:"No records to show yet."})]}),a("div",{className:"ui-at-bc__x","aria-hidden":"true",children:T.map(t=>{let r=u?.icons?.[t];return n("span",{className:"ui-at-bc__tick","data-active":i===t?"":void 0,"data-text":r?void 0:"",children:[r?a("span",{className:"ui-at-bc__icon",children:r}):null,a("span",{className:"ui-at-bc__tick-label",children:t})]},t)})})]}),a("div",{className:"ui-at-bc__table-wrap",children:n("table",{className:"ui-at-bc__table",id:N,children:[n("caption",{className:"ui-at-bc__sr",children:[y?.label," by ",u?.label,b?` and ${b.label}`:""]}),a("thead",{children:n("tr",{children:[a("th",{scope:"col",children:u?.label}),a("th",{scope:"col",className:"ui-at-bc__num",children:y?.label}),b&&k.map((t,r)=>n("th",{scope:"col",className:"ui-at-bc__num","data-hidden":E.has(t)?"":void 0,style:{"--ui-at-bc-part":B(t,r)},children:[a("span",{className:"ui-at-bc__swatch","aria-hidden":"true"}),t]},t))]})}),a("tbody",{children:T.map(t=>n("tr",{"data-active":i===t?"":void 0,onPointerEnter:()=>h(t),onPointerLeave:()=>h(null),children:[a("th",{scope:"row",children:n("span",{className:"ui-at-bc__row-name",children:[u?.icons?.[t]&&a("span",{className:"ui-at-bc__icon",children:u.icons[t]}),a("span",{children:t})]})}),a("td",{className:"ui-at-bc__num ui-at-bc__strong",children:M(G.get(t)??0)}),b&&k.map(r=>a("td",{className:"ui-at-bc__num","data-hidden":E.has(r)?"":void 0,children:M($.get(t)?.get(r)??0)},r))]},t))})]})})]}),b&&a("div",{className:"ui-at-bc__legend",role:"group","aria-label":`${b.label} \u2013 click to show or hide`,children:k.map((t,r)=>n("button",{type:"button",className:"ui-at-bc__chip","aria-pressed":!E.has(t),style:{"--ui-at-bc-part":B(t,r)},onClick:()=>lt(t),children:[a("span",{className:"ui-at-bc__swatch","aria-hidden":"true"}),t]},t))})]})}var yt=`
.ui-at-bc {
  --ui-at-bc-frame: #f2f6fa;
  --ui-at-bc-panel: #ffffff;
  --ui-at-bc-pale: #fbfcfe;
  --ui-at-bc-soft: rgba(26, 62, 112, 0.06);
  --ui-at-bc-line: #dae2ec;
  --ui-at-bc-firm: #cbd6e4;
  --ui-at-bc-ink: #00162b;
  --ui-at-bc-text: rgba(0, 22, 43, 0.66);
  --ui-at-bc-muted: rgba(0, 22, 43, 0.54);
  --ui-at-bc-berry: #851437;
  --ui-at-bc-ring: #8fbdf2;
  --ui-at-bc-info-ink: #1a3e70;
  --ui-at-bc-info-fill: #eef5ff;
  --ui-at-bc-info-line: #c1daff;
  --ui-at-bc-grid: rgba(26, 62, 112, 0.1);
  --ui-at-bc-single: #2c5a96;
  --ui-at-bc-c1: #851437;
  --ui-at-bc-c2: #b8456b;
  --ui-at-bc-c3: #2c5a96;
  --ui-at-bc-c4: #8fbdf2;
  --ui-at-bc-c5: #cdd5e0;
  --ui-at-bc-c6: #2e8b57;
  --ui-at-bc-c7: #b07d12;
  --ui-at-bc-c8: #6c7a8f;
  --ui-at-bc-inner: inset 0 1px 2px rgba(26, 62, 112, 0.08);
  --ui-at-bc-drop: 0 8px 16px -8px rgba(26, 62, 112, 0.2);
  --ui-at-bc-raised: 0 18px 30px -16px rgba(26, 62, 112, 0.38), 0 4px 10px -6px rgba(26, 62, 112, 0.18);
  --ui-at-bc-floating: 0 24px 48px -24px rgba(26, 62, 112, 0.3);
  --ui-at-bc-ease: cubic-bezier(0.16, 1, 0.3, 1);

  container-type: inline-size;
  box-sizing: border-box;
  width: 100%;
  max-width: 600px;
  padding: 6px;
  border-radius: 22px;
  background: var(--ui-at-bc-frame);
  border: 1px solid var(--ui-at-bc-line);
  box-shadow: var(--ui-at-bc-floating);
  color: var(--ui-at-bc-ink);
  font-family: "Avenir Next", Avenir, system-ui, sans-serif;
  font-size: 13px;
  line-height: 1.4;
  -webkit-font-smoothing: antialiased;
}
:where(.dark, [data-theme="dark"]) .ui-at-bc {
  --ui-at-bc-frame: #0f2747;
  --ui-at-bc-panel: #16345c;
  --ui-at-bc-pale: #1d416f;
  --ui-at-bc-soft: rgba(255, 255, 255, 0.07);
  --ui-at-bc-line: rgba(255, 255, 255, 0.12);
  --ui-at-bc-firm: rgba(255, 255, 255, 0.18);
  --ui-at-bc-ink: rgba(255, 255, 255, 0.94);
  --ui-at-bc-text: rgba(255, 255, 255, 0.72);
  --ui-at-bc-muted: rgba(255, 255, 255, 0.56);
  --ui-at-bc-berry: #a8204d;
  --ui-at-bc-ring: rgba(143, 189, 242, 0.6);
  --ui-at-bc-info-ink: #c1daff;
  --ui-at-bc-info-fill: rgba(143, 189, 242, 0.16);
  --ui-at-bc-info-line: rgba(143, 189, 242, 0.32);
  --ui-at-bc-grid: rgba(255, 255, 255, 0.09);
  --ui-at-bc-single: #8fbdf2;
  --ui-at-bc-c1: #c2335f;
  --ui-at-bc-c2: #e88aa8;
  --ui-at-bc-c3: #5b8fd0;
  --ui-at-bc-c4: #a9cdf5;
  --ui-at-bc-c5: #d5dde8;
  --ui-at-bc-c6: #7fe0a0;
  --ui-at-bc-c7: #f3d27a;
  --ui-at-bc-c8: #8d9bb0;
  --ui-at-bc-inner: inset 0 1px 2px rgba(3, 12, 28, 0.4);
  --ui-at-bc-drop: 0 8px 16px -8px rgba(3, 12, 28, 0.6);
  --ui-at-bc-raised: 0 18px 30px -16px rgba(3, 12, 28, 0.8), 0 4px 10px -6px rgba(3, 12, 28, 0.6);
  --ui-at-bc-floating: 0 24px 48px -24px rgba(3, 12, 28, 0.7);
}

.ui-at-bc__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 12px 8px;
}
.ui-at-bc__title {
  margin: 0;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: "Avenir Next Condensed", "Avenir Next", Avenir, system-ui, sans-serif;
  font-size: 17px;
  font-weight: 700;
}
.ui-at-bc__grand { margin: 0; color: var(--ui-at-bc-muted); white-space: nowrap; }
.ui-at-bc__grand strong { color: var(--ui-at-bc-ink); font-size: 15px; font-weight: 600; font-variant-numeric: tabular-nums; }

.ui-at-bc__panel {
  padding: 12px 0 0;
  border-radius: 16px;
  background: var(--ui-at-bc-panel);
  border: 1px solid var(--ui-at-bc-line);
  box-shadow: var(--ui-at-bc-raised);
  overflow: hidden;
}

.ui-at-bc__pickers {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 8px;
  padding: 0 12px;
}
.ui-at-bc__picker { position: relative; display: grid; gap: 4px; min-width: 0; }
.ui-at-bc__picker-label { color: var(--ui-at-bc-muted); font-size: 12px; }
.ui-at-bc__picker-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  height: 36px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid var(--ui-at-bc-firm);
  background: var(--ui-at-bc-pale);
  box-shadow: var(--ui-at-bc-inner);
  color: var(--ui-at-bc-ink);
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition: border-color 150ms var(--ui-at-bc-ease);
}
.ui-at-bc__picker-button > span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ui-at-bc__picker-button svg { flex: none; color: var(--ui-at-bc-muted); transition: transform 150ms var(--ui-at-bc-ease); }
.ui-at-bc__picker-button[aria-expanded="true"] svg { transform: rotate(180deg); }
.ui-at-bc__picker-button:hover { border-color: var(--ui-at-bc-muted); }
.ui-at-bc__picker-button:focus-visible { outline: none; box-shadow: var(--ui-at-bc-inner), 0 0 0 3px var(--ui-at-bc-ring); }
.ui-at-bc__list {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  z-index: 20;
  box-sizing: border-box;
  min-width: 100%;
  margin: 0;
  padding: 4px;
  list-style: none;
  border-radius: 12px;
  background: var(--ui-at-bc-panel);
  border: 1px solid var(--ui-at-bc-firm);
  box-shadow: var(--ui-at-bc-floating), var(--ui-at-bc-drop);
  outline: none;
  transform-origin: top left;
  animation: ui-at-bc-scale 150ms var(--ui-at-bc-ease) both;
}
.ui-at-bc__opt {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 7px 10px;
  border-radius: 8px;
  white-space: nowrap;
  cursor: pointer;
}
.ui-at-bc__opt[data-active] { background: var(--ui-at-bc-info-fill); }
.ui-at-bc__opt[aria-selected="true"] { color: var(--ui-at-bc-info-ink); font-weight: 600; }

.ui-at-bc__chart { padding: 16px 12px 10px; }
.ui-at-bc__plot {
  position: relative;
  height: ${xt}px;
  margin-right: 34px;
}
.ui-at-bc__grid { position: absolute; inset: 0; pointer-events: none; }
.ui-at-bc__grid span {
  position: absolute;
  left: 0;
  right: -34px;
  height: 0;
  border-top: 1px dashed var(--ui-at-bc-grid);
}
.ui-at-bc__grid span:first-child { border-top-style: solid; border-top-color: var(--ui-at-bc-line); }
.ui-at-bc__grid em {
  position: absolute;
  right: 0;
  transform: translateY(-50%);
  color: var(--ui-at-bc-muted);
  font-size: 11px;
  font-style: normal;
  font-variant-numeric: tabular-nums;
  background: var(--ui-at-bc-panel);
  padding-left: 4px;
}
.ui-at-bc__cols { position: absolute; inset: 0; display: flex; }
.ui-at-bc__col { position: relative; flex: 1 1 0; min-width: 0; display: flex; justify-content: center; }
.ui-at-bc__bar {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  width: 100%;
  max-width: 56px;
  height: 100%;
  margin: 0;
  padding: 0 6px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  cursor: default;
  outline: none;
  transition: opacity 300ms var(--ui-at-bc-ease), background-color 150ms var(--ui-at-bc-ease);
}
.ui-at-bc__bar:focus-visible { box-shadow: 0 0 0 2px var(--ui-at-bc-ring); }
.ui-at-bc__col[data-active] .ui-at-bc__bar { background: var(--ui-at-bc-soft); }
.ui-at-bc[data-hovering] .ui-at-bc__col:not([data-active]) .ui-at-bc__bar { opacity: 0.35; }
.ui-at-bc__stack {
  display: flex;
  flex-direction: column-reverse;
  width: 12px;
  height: 100%;
  transform-origin: 50% 100%;
  animation: ui-at-bc-grow 700ms var(--ui-at-bc-ease) both;
}
.ui-at-bc__seg {
  box-sizing: border-box;
  flex: none;
  width: 100%;
  border-top: 2px solid transparent;
  background: var(--ui-at-bc-part);
  background-clip: padding-box;
  transition: height 420ms var(--ui-at-bc-ease);
}
.ui-at-bc__seg:first-child { border-radius: 0 0 2px 2px; }
.ui-at-bc__seg[data-zero] { border-top-width: 0; }

.ui-at-bc__tip {
  position: absolute;
  top: 0;
  z-index: 5;
  min-width: 150px;
  padding: 9px 11px;
  border-radius: 12px;
  background: var(--ui-at-bc-panel);
  border: 1px solid var(--ui-at-bc-firm);
  box-shadow: var(--ui-at-bc-floating), var(--ui-at-bc-drop);
  pointer-events: none;
  transform: translateX(22px);
  transition: left 150ms var(--ui-at-bc-ease);
  animation: ui-at-bc-fade 150ms var(--ui-at-bc-ease) both;
}
.ui-at-bc__tip[data-side="left"] { transform: translateX(calc(-100% - 22px)); }
.ui-at-bc__tip-head { display: flex; align-items: center; gap: 7px; margin: 0; font-weight: 600; }
.ui-at-bc__tip-head strong { margin-left: auto; padding-left: 14px; font-variant-numeric: tabular-nums; }
.ui-at-bc__tip ul { list-style: none; margin: 6px 0 0; padding: 6px 0 0; border-top: 1px solid var(--ui-at-bc-line); }
.ui-at-bc__tip li { display: grid; grid-template-columns: 8px minmax(0, 1fr) auto; align-items: center; gap: 8px; height: 20px; color: var(--ui-at-bc-text); font-size: 12px; }
.ui-at-bc__tip-value { color: var(--ui-at-bc-ink); font-variant-numeric: tabular-nums; }
.ui-at-bc__swatch { display: inline-block; flex: none; width: 8px; height: 8px; border-radius: 2px; background: var(--ui-at-bc-part); }

.ui-at-bc__x { display: flex; margin: 8px 34px 0 0; height: 24px; }
.ui-at-bc__tick {
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  color: var(--ui-at-bc-muted);
  font-size: 11.5px;
  white-space: nowrap;
}
.ui-at-bc__tick-label { display: none; overflow: hidden; text-overflow: ellipsis; }
.ui-at-bc__tick[data-text] .ui-at-bc__tick-label { display: block; }
.ui-at-bc__tick[data-active] .ui-at-bc__tick-label {
  display: block;
}
.ui-at-bc__tick[data-active] {
  color: var(--ui-at-bc-ink);
}
.ui-at-bc__tick[data-active]:not([data-text]) {
  flex: 0 0 auto;
  margin: 0 -40px;
  padding: 0 9px;
  height: 24px;
  border-radius: 999px;
  background: var(--ui-at-bc-panel);
  border: 1px solid var(--ui-at-bc-line);
  box-shadow: var(--ui-at-bc-drop);
  position: relative;
  z-index: 1;
  animation: ui-at-bc-fade 150ms var(--ui-at-bc-ease) both;
}
.ui-at-bc__icon { display: inline-grid; place-items: center; flex: none; width: 14px; height: 14px; color: var(--ui-at-bc-muted); }
.ui-at-bc__icon svg { width: 14px; height: 14px; }
.ui-at-bc__empty {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  margin: 0;
  color: var(--ui-at-bc-muted);
}

.ui-at-bc__table-wrap { overflow-x: auto; border-top: 1px solid var(--ui-at-bc-line); }
.ui-at-bc__table { width: 100%; border-collapse: collapse; font-variant-numeric: tabular-nums; }
.ui-at-bc__table th, .ui-at-bc__table td { padding: 0 12px; height: 38px; white-space: nowrap; text-align: left; }
.ui-at-bc__table thead th {
  background: var(--ui-at-bc-soft);
  color: var(--ui-at-bc-text);
  font-weight: 500;
  font-size: 12.5px;
  border-bottom: 1px solid var(--ui-at-bc-line);
}
.ui-at-bc__table thead .ui-at-bc__swatch { margin-right: 6px; }
.ui-at-bc__table tbody tr { border-bottom: 1px solid var(--ui-at-bc-line); transition: background-color 150ms var(--ui-at-bc-ease); }
.ui-at-bc__table tbody tr:last-child { border-bottom: 0; }
.ui-at-bc__table tbody th { font-weight: 500; }
.ui-at-bc__table tbody tr[data-active] { background: var(--ui-at-bc-info-fill); box-shadow: inset 2px 0 0 var(--ui-at-bc-berry); }
.ui-at-bc__row-name { display: flex; align-items: center; gap: 8px; }
.ui-at-bc__num { text-align: right !important; color: var(--ui-at-bc-text); }
.ui-at-bc__strong { color: var(--ui-at-bc-ink); font-weight: 500; }
.ui-at-bc__table [data-hidden] { opacity: 0.4; }

.ui-at-bc__legend {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 6px;
  padding: 10px 8px 4px;
}
.ui-at-bc__chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 26px;
  padding: 0 8px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: transparent;
  color: var(--ui-at-bc-text);
  font: inherit;
  font-size: 12.5px;
  cursor: pointer;
  transition: background-color 150ms var(--ui-at-bc-ease), color 150ms var(--ui-at-bc-ease), opacity 150ms var(--ui-at-bc-ease);
}
.ui-at-bc__chip:hover { background: var(--ui-at-bc-soft); color: var(--ui-at-bc-ink); }
.ui-at-bc__chip[aria-pressed="false"] { color: var(--ui-at-bc-muted); text-decoration: line-through; opacity: 0.7; }
.ui-at-bc__chip[aria-pressed="false"] .ui-at-bc__swatch { background: transparent; box-shadow: inset 0 0 0 1.5px var(--ui-at-bc-part); }
.ui-at-bc__chip:focus-visible { outline: 3px solid var(--ui-at-bc-ring); outline-offset: 0; }

.ui-at-bc__sr {
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

@container (max-width: 420px) {
  .ui-at-bc__pickers { grid-template-columns: 1fr 1fr; }
  .ui-at-bc__picker:last-child { grid-column: 1 / -1; }
  .ui-at-bc__bar { padding: 0 2px; }
  .ui-at-bc__stack { width: 10px; }
  .ui-at-bc__tick[data-active]:not([data-text]) .ui-at-bc__tick-label { display: none; }
  .ui-at-bc__tick[data-active]:not([data-text]) { margin: 0; padding: 0 5px; }
}
@media (pointer: coarse) {
  .ui-at-bc__picker-button { height: 42px; }
  .ui-at-bc__opt { padding: 11px 10px; }
  .ui-at-bc__chip { height: 34px; }
}

@keyframes ui-at-bc-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes ui-at-bc-grow { from { transform: scaleY(0); } to { transform: scaleY(1); } }
@keyframes ui-at-bc-scale { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
@media (prefers-reduced-motion: reduce) {
  .ui-at-bc *, .ui-at-bc *::before, .ui-at-bc *::after {
    animation: none !important;
    transition: none !important;
  }
}
`;var nt=["Backlog","Todo","In progress","In review","Done","Canceled"],ot=["Urgent","High","Medium","Low","None"],Y=["Web","Mobile","Platform","Data"],X=["Feature","Bug","Chore"],kt=[[3,6,6,8,3],[1,7,12,11,5],[1,9,12,7,5],[0,1,6,4,2],[7,14,23,25,27],[0,1,3,1,2]],rt=[1,2,3,5,8];function vt(){let d=[],o=0;return kt.forEach((l,f)=>l.forEach((s,p)=>{for(let w=0;w<s;w++)o+=1,d.push({id:`T-${100+o}`,status:nt[f],priority:ot[p],team:Y[(o*7+f)%Y.length],type:X[(o*5+p)%X.length],points:rt[(o*3+p+f)%rt.length]})})),d}var L=d=>a("svg",{viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round",children:d}),wt={Backlog:L(a("path",{d:"M2.5 9.5 4 3.5h8l1.5 6v3h-11zM2.5 9.5H6l.8 1.5h2.4l.8-1.5h3.5"})),Todo:L(a("rect",{x:"3.5",y:"3.5",width:"9",height:"9",rx:"2"})),"In progress":a("span",{style:{color:"var(--ui-at-bc-c3)",display:"inline-grid"},children:L(n(O,{children:[a("circle",{cx:"8",cy:"8",r:"5.5"}),a("path",{d:"M8 5v3l2 1.5"})]}))}),"In review":a("span",{style:{color:"var(--ui-at-bc-c1)",display:"inline-grid"},children:L(n(O,{children:[a("path",{d:"M1.8 8S4 3.8 8 3.8 14.2 8 14.2 8 12 12.2 8 12.2 1.8 8 1.8 8z"}),a("circle",{cx:"8",cy:"8",r:"1.8"})]}))}),Done:a("span",{style:{color:"var(--ui-at-bc-c3)",display:"inline-grid"},children:n("svg",{viewBox:"0 0 16 16",children:[a("rect",{x:"2.5",y:"2.5",width:"11",height:"11",rx:"2.5",fill:"currentColor"}),a("path",{d:"m5.3 8.2 1.9 1.9 3.6-4",fill:"none",stroke:"#fff",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})]})}),Canceled:L(n(O,{children:[a("circle",{cx:"8",cy:"8",r:"5.5"}),a("path",{d:"m4.2 11.8 7.6-7.6"})]}))},Nt=[{key:"status",label:"Status",values:nt,icons:wt},{key:"priority",label:"Priority",values:ot},{key:"team",label:"Team",values:Y},{key:"type",label:"Type",values:X}],St=[{key:"count",label:"Task count",unit:"tasks"},{key:"points",label:"Story points",unit:"points",field:"points"}],Et=vt();function Mt(){return a(it,{title:"Sprint 24",records:Et,dimensions:Nt,measures:St,defaultSlice:"status",defaultSegment:"priority"})}export{Mt as default};
