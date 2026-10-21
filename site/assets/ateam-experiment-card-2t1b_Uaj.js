import{t as Se}from"./react-BkAXpnfr.js";var Pe=Se();var{Children:Je,Component:Ge,Fragment:Xe,StrictMode:Ze,cloneElement:Qe,createContext:Ye,createElement:ei,createRef:ii,forwardRef:ni,isValidElement:ri,lazy:ti,memo:oi,startTransition:ai,Suspense:pi,use:ui,useCallback:ne,useContext:si,useDebugValue:di,useDeferredValue:li,useEffect:E,useId:fe,useImperativeHandle:ci,useInsertionEffect:xi,useLayoutEffect:be,useMemo:fi,useOptimistic:bi,useReducer:mi,useRef:v,useState:b,useSyncExternalStore:gi,useTransition:vi}=Pe;import{t as De}from"./jsx-runtime-CTsRTJUX.js";var $e=De(),{jsx:n,jsxs:p,Fragment:O}=$e;var Oe=560,ze=5,Ae=r=>1-Math.pow(1-r,4),Ve=r=>r.toLocaleString("en-US",{maximumFractionDigits:2}),U=r=>`${r>0?"+":r<0?"\u2212":"\xB1"}${Math.abs(r).toLocaleString("en-US",{minimumFractionDigits:1,maximumFractionDigits:1})}%`;function Ie(){let[r,o]=b(!1);return E(()=>{if(typeof window>"u"||!window.matchMedia)return;let t=window.matchMedia("(prefers-reduced-motion: reduce)"),u=()=>o(t.matches);return u(),t.addEventListener("change",u),()=>t.removeEventListener("change",u)},[]),r}function Fe(r,o){let[t,u]=b(r),h=v(t);h.current=t;let _=JSON.stringify(r);return E(()=>{let d=JSON.parse(_);if(o){u(d);return}let c={...h.current},w=performance.now(),l=0,m=s=>{let z=Math.min(1,(s-w)/Oe),A=Ae(z),V={};for(let T of Object.keys(d)){let I=c[T]??d[T];V[T]=I+(d[T]-I)*A}u(V),z<1&&(l=requestAnimationFrame(m))};return l=requestAnimationFrame(m),()=>cancelAnimationFrame(l)},[_,o]),t}function re(r,o,t){let[u,h]=b(o),_=r!==void 0?r:u,d=ne(c=>{r===void 0&&h(c),t?.(c)},[r,t]);return[_,d]}function me({title:r,variants:o,metrics:t,metric:u,defaultMetric:h,onMetricChange:_,winner:d,defaultWinner:c=null,onWinnerChange:w,status:l,note:m,action:s,hint:z="Pick a winner",trigger:A="hover",open:V,defaultOpen:T=!1,onOpenChange:I,className:ge}){let ve=Ie(),te=fe(),F=v(null),J=v(null),[x,C]=re(V,T,I),[$,oe]=re(u,h??t[0]?.id??"",_),[S,he]=re(d,c,w),[B,M]=b(null),f=t.find(e=>e.id===$)??t[0],ae=f?.format??Ve,R=o.find(e=>e.control)??o[0],G=e=>{let i=f?e.values[f.id]:void 0;return typeof i=="number"&&Number.isFinite(i)?i:null},H=R?G(R):null,X=e=>{let i=G(e);return e===R||i===null||H===null||H===0?null:(i-H)/Math.abs(H)*100},pe=e=>f?.lowerIsBetter?e<0:e>0,P=R,y=null;for(let e of o){let i=X(e);i===null||!pe(i)||(y===null||Math.abs(i)>Math.abs(y))&&(P=e,y=i)}let Z=o.map(G),K=Math.max(0,...Z.filter(e=>e!==null)),ue={};o.forEach((e,i)=>{ue[e.id]=Z[i]??0});let se=Fe(ue,ve),de=(e,i)=>e.color??(e===R?"var(--ui-xp-c0)":`var(--ui-xp-c${i%(ze-1)+1})`),W=v(void 0);E(()=>()=>window.clearTimeout(W.current),[]);let _e=e=>{A!=="hover"||e.pointerType!=="mouse"||(window.clearTimeout(W.current),x||C(!0))},we=e=>{M(null),!(A!=="hover"||e.pointerType!=="mouse")&&(window.clearTimeout(W.current),W.current=window.setTimeout(()=>{(!F.current?.contains(document.activeElement)||document.activeElement===J.current)&&C(!1)},180))};E(()=>{if(!x)return;let e=i=>{F.current&&!F.current.contains(i.target)&&C(!1)};return document.addEventListener("pointerdown",e),()=>document.removeEventListener("pointerdown",e)},[x,C]);let ye=e=>{e.key==="Escape"&&x&&(e.stopPropagation(),C(!1),J.current?.focus())},j=v(null),[Q,ke]=b(null),q=ne(()=>{let e=j.current?.querySelector('[aria-checked="true"]');e&&ke({left:e.offsetLeft,width:e.offsetWidth})},[]);be(q,[$,t,x,q]),E(()=>{let e=j.current;if(!e||typeof ResizeObserver>"u")return;let i=new ResizeObserver(q);return i.observe(e),()=>i.disconnect()},[q]);let Ee=e=>{let i=Math.max(0,t.findIndex(g=>g.id===$)),a=-1;e.key==="ArrowRight"||e.key==="ArrowDown"?a=(i+1)%t.length:e.key==="ArrowLeft"||e.key==="ArrowUp"?a=(i-1+t.length)%t.length:e.key==="Home"?a=0:e.key==="End"&&(a=t.length-1),!(a<0)&&(e.preventDefault(),oe(t[a].id),j.current?.querySelectorAll('[role="radio"]')[a]?.focus())},le=v(null),ce=e=>he(S===e?null:e),Me=S&&o.some(e=>e.id===S)?S:o[0]?.id,Re=e=>{let i=Array.from(le.current?.querySelectorAll('[role="radio"]')??[]),a=i.indexOf(document.activeElement);if(a<0)return;let g=-1;e.key==="ArrowDown"||e.key==="ArrowRight"?g=(a+1)%i.length:(e.key==="ArrowUp"||e.key==="ArrowLeft")&&(g=(a-1+i.length)%i.length),!(g<0)&&(e.preventDefault(),i[g].focus())},N=o.find(e=>e.id===S),k=o.find(e=>e.id===B),Ne=l?.tone??"gray",Le=P&&y!==null?`${P.key} ahead on ${f?.label??""} by ${U(y)}`:"no variant ahead yet",Te=[r,l?.label,m,Le].filter(Boolean).join(", "),Y=z;if(k){let e=X(k);Y=p(O,{children:[n("strong",{children:k.key})," ",k.name,k.visitors!==void 0&&p(O,{children:[" \xB7 ",k.visitors.toLocaleString("en-US")," visitors"]}),e!==null&&f?.id&&k.confidence?.[f.id]!==void 0&&p(O,{children:[" \xB7 ",Math.round(k.confidence[f.id]),"% confidence"]})]})}else N&&(Y=p(O,{children:["Winner: ",n("strong",{children:N.key})," ",N.name]}));return p("div",{ref:F,className:["ui-xp",ge].filter(Boolean).join(" "),"data-open":x?"":void 0,"data-hovering":B?"":void 0,onPointerEnter:_e,onPointerLeave:we,onKeyDown:ye,children:[n("style",{href:"ui-experiment-card",precedence:"default",children:Be}),p("div",{className:"ui-xp__panel",children:[p("button",{ref:J,type:"button",className:"ui-xp__head","aria-expanded":x,"aria-controls":te,"aria-label":Te,onClick:()=>C(!x),children:[n("span",{className:"ui-xp__chart","aria-hidden":"true",children:o.map((e,i)=>{let a=se[e.id]??0;return n("span",{className:"ui-xp__col","data-active":B===e.id?"":void 0,style:{height:`${K>0?Math.max(14,a/K*100):14}%`,"--ui-xp-part":de(e,i)},onPointerEnter:()=>x&&M(e.id),onPointerLeave:()=>M(null)},e.id)})}),p("span",{className:"ui-xp__id",children:[n("span",{className:"ui-xp__title",children:r}),(l||m)&&p("span",{className:"ui-xp__meta",children:[l&&p("span",{className:"ui-xp__status","data-tone":Ne,children:[p("svg",{viewBox:"0 0 12 12",width:"11",height:"11","aria-hidden":"true",children:[n("circle",{cx:"6",cy:"6",r:"4.6",fill:"none",stroke:"currentColor",strokeWidth:"1.3"}),n("circle",{cx:"6",cy:"6",r:"1.9",fill:"currentColor"})]}),l.label]}),m&&n("span",{className:"ui-xp__note",children:m})]})]}),P&&y!==null&&p("span",{className:"ui-xp__lead","data-good":"",children:[n("strong",{children:P.key}),n("svg",{viewBox:"0 0 12 12",width:"10",height:"10","aria-hidden":"true",children:n("path",{d:y>=0?"M2 9 5.5 5.5 7.5 7.5 10 4M7 4h3v3":"M2 3l3.5 3.5 2-2L10 8M7 8h3V5",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round"})}),U(y)]},`${P.id}:${$}`)]}),n("div",{className:"ui-xp__fold",id:te,inert:!x,children:p("div",{className:"ui-xp__body",children:[t.length>1&&p("div",{className:"ui-xp__switch",role:"radiogroup","aria-label":"Metric",ref:j,onKeyDown:Ee,children:[Q&&n("span",{className:"ui-xp__pill","aria-hidden":"true",style:{transform:`translateX(${Q.left}px)`,width:Q.width}}),t.map(e=>{let i=e.id===$;return n("button",{type:"button",role:"radio","aria-checked":i,tabIndex:i?0:-1,className:"ui-xp__option",onClick:()=>oe(e.id),children:e.label},e.id)})]}),o.length===0?n("p",{className:"ui-xp__empty",children:"No variants yet."}):n("div",{className:"ui-xp__rows",role:"radiogroup","aria-label":"Pick a winner",ref:le,onKeyDown:Re,children:o.map((e,i)=>{let a=Z[i],g=se[e.id]??0,L=X(e),ee=e===R,ie=S===e.id,xe=f?e.confidence?.[f.id]:void 0,Ce=`${e.key}, ${e.name}: ${a===null?"no data":ae(a)}, ${ee?"baseline":L===null?"no change":`${U(L)} against ${R?.key}`}${xe!==void 0?`, ${Math.round(xe)}% confidence`:""}`;return p("div",{role:"radio","aria-checked":ie,"aria-label":Ce,tabIndex:e.id===Me?0:-1,className:"ui-xp__row","data-active":B===e.id?"":void 0,"data-picked":ie?"":void 0,style:{"--ui-xp-part":de(e,i)},onPointerEnter:()=>M(e.id),onPointerLeave:()=>M(null),onFocus:()=>M(e.id),onBlur:()=>M(D=>D===e.id?null:D),onClick:()=>ce(e.id),onKeyDown:D=>{(D.key===" "||D.key==="Enter")&&(D.preventDefault(),ce(e.id))},children:[n("span",{className:"ui-xp__badge","aria-hidden":"true",children:ie?n("svg",{viewBox:"0 0 12 12",width:"11",height:"11",children:n("path",{d:"M2.5 6.3 5 8.6 9.6 3.6",fill:"none",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"})}):e.key}),n("span",{className:"ui-xp__name","aria-hidden":"true",children:e.name}),n("span",{className:"ui-xp__value","aria-hidden":"true",children:a===null?"\u2013":ae(g)}),n("span",{className:"ui-xp__chip","aria-hidden":"true","data-kind":ee?"base":L===null||L===0?"flat":pe(L)?"good":"bad",children:ee?"Base":L===null?"\u2013":U(L)}),n("span",{className:"ui-xp__track","aria-hidden":"true",children:n("span",{style:{width:`${K>0?g/K*100:0}%`}})})]},e.id)})})]})})]}),n("div",{className:"ui-xp__tray-fold",inert:!x,children:p("div",{className:"ui-xp__tray",children:[n("p",{className:"ui-xp__hint","aria-live":"polite",children:Y}),s&&N&&n("button",{type:"button",className:"ui-xp__action",onClick:()=>s.onClick(N),children:typeof s.label=="function"?s.label(N):s.label},N.id)]})})]})}var Be=`
.ui-xp {
  --ui-xp-frame: #f2f6fa;
  --ui-xp-panel: #ffffff;
  --ui-xp-soft: rgba(26, 62, 112, 0.06);
  --ui-xp-line: #dae2ec;
  --ui-xp-firm: #cbd6e4;
  --ui-xp-ink: #00162b;
  --ui-xp-text: rgba(0, 22, 43, 0.66);
  --ui-xp-muted: rgba(0, 22, 43, 0.54);
  --ui-xp-berry: #851437;
  --ui-xp-berry-hover: #6d0f2d;
  --ui-xp-ring: #8fbdf2;
  --ui-xp-info-ink: #1a3e70;
  --ui-xp-info-fill: #eef5ff;
  --ui-xp-info-line: #c1daff;
  --ui-xp-good-ink: #1d6a34;
  --ui-xp-good-fill: #eafbee;
  --ui-xp-good-line: #c9f5cf;
  --ui-xp-wait-ink: #775810;
  --ui-xp-wait-fill: #fdf6dd;
  --ui-xp-wait-line: #fae6a0;
  --ui-xp-bad-ink: #8a3a22;
  --ui-xp-bad-fill: #fdeee8;
  --ui-xp-bad-line: #f5d5c9;
  --ui-xp-brand-ink: #851437;
  --ui-xp-brand-fill: #fbeef2;
  --ui-xp-brand-line: #f1cbd7;
  --ui-xp-c0: #a3afc0;
  --ui-xp-c1: #2c5a96;
  --ui-xp-c2: #851437;
  --ui-xp-c3: #2e8b57;
  --ui-xp-c4: #b07d12;
  --ui-xp-pebble-shade: inset 0 -2px 6px -4px rgba(26, 62, 112, 0.4);
  --ui-xp-drop: 0 8px 16px -8px rgba(26, 62, 112, 0.2);
  --ui-xp-raised: 0 18px 30px -16px rgba(26, 62, 112, 0.38), 0 4px 10px -6px rgba(26, 62, 112, 0.18);
  --ui-xp-floating: 0 24px 48px -24px rgba(26, 62, 112, 0.3);
  --ui-xp-ease: cubic-bezier(0.16, 1, 0.3, 1);

  container-type: inline-size;
  box-sizing: border-box;
  width: 100%;
  max-width: 340px;
  padding: 4px;
  border-radius: 20px;
  background: var(--ui-xp-frame);
  border: 1px solid var(--ui-xp-line);
  box-shadow: var(--ui-xp-floating);
  color: var(--ui-xp-ink);
  font-family: "Avenir Next", Avenir, system-ui, sans-serif;
  font-size: 13px;
  line-height: 1.4;
  -webkit-font-smoothing: antialiased;
  transition: padding 300ms var(--ui-xp-ease), border-radius 300ms var(--ui-xp-ease);
}
.ui-xp[data-open] { padding: 6px; border-radius: 22px; }
:where(.dark, [data-theme="dark"]) .ui-xp {
  --ui-xp-frame: #0f2747;
  --ui-xp-panel: #16345c;
  --ui-xp-soft: rgba(255, 255, 255, 0.07);
  --ui-xp-line: rgba(255, 255, 255, 0.12);
  --ui-xp-firm: rgba(255, 255, 255, 0.18);
  --ui-xp-ink: rgba(255, 255, 255, 0.94);
  --ui-xp-text: rgba(255, 255, 255, 0.72);
  --ui-xp-muted: rgba(255, 255, 255, 0.56);
  --ui-xp-berry: #a8204d;
  --ui-xp-berry-hover: #bd2a5a;
  --ui-xp-ring: rgba(143, 189, 242, 0.6);
  --ui-xp-info-ink: #c1daff;
  --ui-xp-info-fill: rgba(143, 189, 242, 0.16);
  --ui-xp-info-line: rgba(143, 189, 242, 0.32);
  --ui-xp-good-ink: #7fe0a0;
  --ui-xp-good-fill: rgba(127, 224, 160, 0.14);
  --ui-xp-good-line: rgba(127, 224, 160, 0.3);
  --ui-xp-wait-ink: #f3d27a;
  --ui-xp-wait-fill: rgba(243, 210, 122, 0.14);
  --ui-xp-wait-line: rgba(243, 210, 122, 0.3);
  --ui-xp-bad-ink: #f2a48c;
  --ui-xp-bad-fill: rgba(242, 164, 140, 0.14);
  --ui-xp-bad-line: rgba(242, 164, 140, 0.3);
  --ui-xp-brand-ink: #f3a7c0;
  --ui-xp-brand-fill: rgba(224, 98, 138, 0.16);
  --ui-xp-brand-line: rgba(224, 98, 138, 0.34);
  --ui-xp-c0: #8d9bb0;
  --ui-xp-c1: #8fbdf2;
  --ui-xp-c2: #e0628a;
  --ui-xp-c3: #7fe0a0;
  --ui-xp-c4: #f3d27a;
  --ui-xp-pebble-shade: inset 0 -2px 6px -4px rgba(3, 12, 28, 0.8);
  --ui-xp-drop: 0 8px 16px -8px rgba(3, 12, 28, 0.6);
  --ui-xp-raised: 0 18px 30px -16px rgba(3, 12, 28, 0.8), 0 4px 10px -6px rgba(3, 12, 28, 0.6);
  --ui-xp-floating: 0 24px 48px -24px rgba(3, 12, 28, 0.7);
}

.ui-xp__panel {
  border-radius: 16px;
  background: var(--ui-xp-panel);
  border: 1px solid var(--ui-xp-line);
  box-shadow: var(--ui-xp-raised);
}
.ui-xp__head {
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 11px 12px;
  border: 0;
  border-radius: 16px;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
}
.ui-xp__head:focus-visible { outline: 3px solid var(--ui-xp-ring); outline-offset: -1px; }

.ui-xp__chart {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 3px;
  box-sizing: border-box;
  width: 34px;
  height: 34px;
  padding: 7px 6px 6px;
  border-radius: 10px;
  background: var(--ui-xp-panel);
  border: 1px solid var(--ui-xp-line);
  box-shadow: var(--ui-xp-pebble-shade);
}
.ui-xp__col {
  width: 5px;
  border-radius: 2px;
  background: var(--ui-xp-part);
  transition: width 150ms var(--ui-xp-ease), opacity 150ms var(--ui-xp-ease);
}
.ui-xp[data-hovering] .ui-xp__col { opacity: 0.3; }
.ui-xp[data-hovering] .ui-xp__col[data-active] { opacity: 1; width: 8px; }

.ui-xp__id { display: grid; gap: 3px; min-width: 0; }
.ui-xp__title {
  font-weight: 600;
  font-size: 13.5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-xp__meta { display: flex; align-items: center; gap: 8px; min-width: 0; }
.ui-xp__status {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  flex: none;
  height: 19px;
  padding: 0 6px;
  border-radius: 6px;
  font-size: 11.5px;
  font-weight: 600;
  color: var(--ui-xp-muted);
  background: var(--ui-xp-soft);
  border: 1px solid var(--ui-xp-line);
}
.ui-xp__status[data-tone="green"] { color: var(--ui-xp-good-ink); background: var(--ui-xp-good-fill); border-color: var(--ui-xp-good-line); }
.ui-xp__status[data-tone="amber"] { color: var(--ui-xp-wait-ink); background: var(--ui-xp-wait-fill); border-color: var(--ui-xp-wait-line); }
.ui-xp__status[data-tone="red"] { color: var(--ui-xp-bad-ink); background: var(--ui-xp-bad-fill); border-color: var(--ui-xp-bad-line); }
.ui-xp__status[data-tone="blue"] { color: var(--ui-xp-info-ink); background: var(--ui-xp-info-fill); border-color: var(--ui-xp-info-line); }
.ui-xp__status[data-tone="violet"] { color: var(--ui-xp-brand-ink); background: var(--ui-xp-brand-fill); border-color: var(--ui-xp-brand-line); }
.ui-xp__note { color: var(--ui-xp-muted); font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.ui-xp__lead {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 22px;
  padding: 0 7px;
  border-radius: 7px;
  font-size: 12px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  color: var(--ui-xp-good-ink);
  background: var(--ui-xp-good-fill);
  border: 1px solid var(--ui-xp-good-line);
  animation: ui-xp-pop 300ms var(--ui-xp-ease) both;
}

.ui-xp__fold {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  transition: grid-template-rows 300ms var(--ui-xp-ease), opacity 300ms var(--ui-xp-ease);
}
.ui-xp[data-open] .ui-xp__fold { grid-template-rows: 1fr; opacity: 1; }
.ui-xp__fold > .ui-xp__body { min-height: 0; overflow: hidden; }
.ui-xp__body { padding: 0 12px; }
.ui-xp[data-open] .ui-xp__body { padding-bottom: 12px; }

.ui-xp__switch {
  position: relative;
  display: flex;
  margin-top: 1px;
  padding: 2px;
  border-radius: 10px;
  background: var(--ui-xp-soft);
  border: 1px solid var(--ui-xp-line);
}
.ui-xp__pill {
  position: absolute;
  top: 2px;
  bottom: 2px;
  left: 0;
  box-sizing: border-box;
  border-radius: 8px;
  background: var(--ui-xp-panel);
  border: 1px solid var(--ui-xp-firm);
  box-shadow: var(--ui-xp-drop);
  transition: transform 300ms var(--ui-xp-ease), width 300ms var(--ui-xp-ease);
}
.ui-xp__option {
  position: relative;
  z-index: 1;
  flex: 1 1 0;
  min-width: 0;
  height: 26px;
  padding: 0 6px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--ui-xp-muted);
  font: inherit;
  font-size: 12.5px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  transition: color 150ms var(--ui-xp-ease);
}
.ui-xp__option[aria-checked="true"] { color: var(--ui-xp-ink); font-weight: 600; }
.ui-xp__option:hover { color: var(--ui-xp-ink); }
.ui-xp__option:focus-visible { outline: 3px solid var(--ui-xp-ring); outline-offset: 0; }

.ui-xp__rows { display: grid; gap: 2px; margin-top: 8px; }
.ui-xp__row {
  display: grid;
  grid-template-columns: 20px minmax(0, 1fr) auto auto;
  grid-template-rows: auto 4px;
  align-items: center;
  column-gap: 9px;
  row-gap: 6px;
  margin: 0 -6px;
  padding: 7px 6px 8px;
  border-radius: 10px;
  cursor: pointer;
  outline: none;
  transition: background-color 150ms var(--ui-xp-ease), opacity 150ms var(--ui-xp-ease);
}
.ui-xp__row:hover, .ui-xp__row[data-active] { background: var(--ui-xp-soft); }
.ui-xp[data-hovering] .ui-xp__row:not([data-active]):not([data-picked]) { opacity: 0.6; }
.ui-xp__row:focus-visible { box-shadow: inset 0 0 0 2px var(--ui-xp-ring); }
.ui-xp__row[data-picked] { background: var(--ui-xp-info-fill); box-shadow: inset 2px 0 0 var(--ui-xp-berry); }
.ui-xp__row[data-picked]:focus-visible { box-shadow: inset 2px 0 0 var(--ui-xp-berry), inset 0 0 0 2px var(--ui-xp-ring); }

.ui-xp__badge {
  display: grid;
  place-items: center;
  width: 20px;
  height: 20px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  color: var(--ui-xp-part);
  background: color-mix(in srgb, var(--ui-xp-part) 14%, transparent);
  border: 1px solid color-mix(in srgb, var(--ui-xp-part) 30%, transparent);
  transition: background-color 150ms var(--ui-xp-ease), color 150ms var(--ui-xp-ease);
}
.ui-xp__row[data-picked] .ui-xp__badge {
  color: #ffffff;
  background: var(--ui-xp-berry);
  border-color: transparent;
  animation: ui-xp-pop 300ms var(--ui-xp-ease) both;
}
.ui-xp__name { min-width: 0; color: var(--ui-xp-text); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ui-xp__row[data-active] .ui-xp__name, .ui-xp__row[data-picked] .ui-xp__name { color: var(--ui-xp-ink); }
.ui-xp__value { font-weight: 600; font-variant-numeric: tabular-nums; white-space: nowrap; }
.ui-xp__chip {
  min-width: 44px;
  height: 20px;
  padding: 0 6px;
  box-sizing: border-box;
  border-radius: 6px;
  font-size: 11.5px;
  font-weight: 600;
  line-height: 18px;
  text-align: center;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  color: var(--ui-xp-muted);
  background: var(--ui-xp-soft);
  border: 1px solid var(--ui-xp-line);
}
.ui-xp__chip[data-kind="good"] { color: var(--ui-xp-good-ink); background: var(--ui-xp-good-fill); border-color: var(--ui-xp-good-line); }
.ui-xp__chip[data-kind="bad"] { color: var(--ui-xp-bad-ink); background: var(--ui-xp-bad-fill); border-color: var(--ui-xp-bad-line); }
.ui-xp__track {
  grid-column: 2 / -1;
  height: 4px;
  border-radius: 999px;
  background: var(--ui-xp-soft);
  overflow: hidden;
}
.ui-xp__track > span { display: block; height: 100%; border-radius: inherit; background: var(--ui-xp-part); }
.ui-xp__empty { margin: 10px 0 0; color: var(--ui-xp-muted); text-align: center; }

.ui-xp__tray-fold {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  transition: grid-template-rows 300ms var(--ui-xp-ease), opacity 300ms var(--ui-xp-ease);
}
.ui-xp[data-open] .ui-xp__tray-fold { grid-template-rows: 1fr; opacity: 1; }
.ui-xp__tray-fold > .ui-xp__tray { min-height: 0; overflow: hidden; }
.ui-xp__tray {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.ui-xp__hint {
  min-width: 0;
  margin: 0;
  padding: 10px 10px 6px;
  color: var(--ui-xp-muted);
  font-size: 12.5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ui-xp__hint strong { color: var(--ui-xp-ink); font-weight: 600; }
.ui-xp__action {
  flex: none;
  height: 30px;
  margin: 6px 0 0;
  padding: 0 13px;
  border: 0;
  border-radius: 10px;
  background: var(--ui-xp-berry);
  color: #ffffff;
  font: inherit;
  font-size: 12.5px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 6px 12px -6px rgba(133, 20, 55, 0.6);
  transition: background-color 150ms var(--ui-xp-ease);
  animation: ui-xp-pop 300ms var(--ui-xp-ease) both;
}
.ui-xp__action:hover { background: var(--ui-xp-berry-hover); }
.ui-xp__action:focus-visible { outline: 3px solid var(--ui-xp-ring); outline-offset: 1px; }

@container (max-width: 300px) {
  .ui-xp__note { display: none; }
  .ui-xp__chip { min-width: 0; padding: 0 4px; }
  .ui-xp__head { gap: 8px; padding: 10px; }
}
@media (pointer: coarse) {
  .ui-xp__option { height: 34px; }
  .ui-xp__row { padding-top: 10px; padding-bottom: 11px; }
  .ui-xp__action { height: 36px; }
}

@keyframes ui-xp-pop {
  0% { opacity: 0; transform: scale(0.8); }
  70% { opacity: 1; transform: scale(1.06); }
  100% { opacity: 1; transform: scale(1); }
}
@media (prefers-reduced-motion: reduce) {
  .ui-xp, .ui-xp *, .ui-xp *::before, .ui-xp *::after {
    animation: none !important;
    transition: none !important;
  }
}
`;var He=[{id:"conversion",label:"Conversion",format:r=>`${r.toFixed(1)}%`},{id:"revenue",label:"Revenue",format:r=>`$${r.toFixed(2)}`},{id:"bounce",label:"Bounce",format:r=>`${r.toFixed(1)}%`,lowerIsBetter:!0}],Ke=[{id:"a",key:"A",name:"Start free trial",control:!0,visitors:4790,values:{conversion:4.2,revenue:18.4,bounce:38.2}},{id:"b",key:"B",name:"Try it free",visitors:4812,values:{conversion:4.7,revenue:19.1,bounce:36.4},confidence:{conversion:96,revenue:81,bounce:88}},{id:"c",key:"C",name:"Get started \u2013 $0",visitors:4776,values:{conversion:4,revenue:21.6,bounce:41.5},confidence:{conversion:64,revenue:93,bounce:90}}],We=[{at:900,open:!0,metric:"conversion"},{at:3100,open:!0,metric:"revenue"},{at:5300,open:!0,metric:"bounce"},{at:7500,open:!0,metric:"conversion"},{at:9e3,open:!1,metric:"conversion"}],je=11500;function qe(){let[r,o]=b(!1),[t,u]=b("conversion"),[h,_]=b(null),d=v(!1);E(()=>{let w=[],l=()=>{w=We.map(s=>window.setTimeout(()=>{d.current||(o(s.open),u(s.metric))},s.at))};l();let m=window.setInterval(()=>{d.current||l()},je);return()=>{w.forEach(s=>window.clearTimeout(s)),window.clearInterval(m)}},[]);let c=()=>{d.current=!0};return n("div",{onPointerDown:c,onPointerEnter:c,onKeyDown:c,onFocus:c,style:{width:"100%",maxWidth:340},children:n(me,{title:"Signup button copy",status:{label:"Running",tone:"green"},note:"Day 9 of 14",metrics:He,variants:Ke,open:r,onOpenChange:o,metric:t,onMetricChange:u,winner:h,onWinnerChange:_,action:{label:w=>`Ship ${w.key}`,onClick:()=>{}}})})}export{qe as default};
