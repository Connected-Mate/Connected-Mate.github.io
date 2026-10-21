import{t as oi}from"./react-BkAXpnfr.js";var ui=oi();var{Children:_i,Component:yi,Fragment:wi,StrictMode:Mi,cloneElement:Ei,createContext:Ni,createElement:$i,createRef:Pi,forwardRef:Ti,isValidElement:Ri,lazy:Ci,memo:Di,startTransition:Si,Suspense:Li,use:zi,useCallback:Ii,useContext:Ki,useDebugValue:Ai,useDeferredValue:Hi,useEffect:B,useId:$,useImperativeHandle:Fi,useInsertionEffect:Oi,useLayoutEffect:Xi,useMemo:W,useOptimistic:ji,useReducer:Bi,useRef:P,useState:f,useSyncExternalStore:Wi,useTransition:Vi}=ui;import{t as li}from"./jsx-runtime-CTsRTJUX.js";var ci=li(),{jsx:e,jsxs:u,Fragment:V}=ci;var di=6,M=128,U=6;function mi(a){let l=Math.abs(a),o=s=>s.toFixed(1).replace(/\.0$/,"");return l>=1e9?`${o(a/1e9)}B`:l>=1e6?`${o(a/1e6)}M`:l>=1e3?`${o(a/1e3)}k`:`${Math.round(a)}`}function fi(a){if(!(a>0))return 1;let l=a/2,o=Math.pow(10,Math.floor(Math.log10(l)));for(let s of[1,2,2.5,3,5,10])if(s*o>=l)return s*o;return 10*o}function G({title:a,value:l,delta:o,labels:s,tooltipLabels:J,series:T,format:k=mi,footer:R,defaultIndex:C,className:Y}){let D=$(),S=$(),L=P(null),[c,Z]=f(0),[z,x]=f(null),[q,b]=f(null),[Q,g]=f(!1),E=P(!1),r=s.length,v=W(()=>T.map((i,t)=>({...i,paint:i.color??`var(--ui-at-kpi-c${t%di+1})`,values:s.map((n,w)=>{let m=i.values[w];return typeof m=="number"&&Number.isFinite(m)?m:null})})),[T,s]),ii=Math.max(0,...v.flatMap(i=>i.values.filter(t=>t!==null))),I=fi(ii),K=I*2,A=[K,I,0];B(()=>{let i=L.current;if(!i)return;let t=()=>Z(i.clientWidth);if(t(),typeof ResizeObserver>"u")return;let n=new ResizeObserver(t);return n.observe(i),()=>n.disconnect()},[]);let H=i=>r<=1?c/2:i/(r-1)*c,d=i=>U+(1-i/(K||1))*(M-U),h=i=>Math.min(r-1,Math.max(0,i)),F=typeof C=="number"&&r>0?h(C):null,p=Q?null:z??q??F,O=i=>{let t=i.currentTarget.getBoundingClientRect();return r<=1||t.width===0?0:h(Math.round((i.clientX-t.left)/t.width*(r-1)))},ei=i=>{i.pointerType!=="mouse"&&!E.current||(g(!1),x(O(i)))},ti=i=>{i.pointerType!=="mouse"&&(E.current=!0,i.currentTarget.setPointerCapture?.(i.pointerId),g(!1),x(O(i)))},ai=i=>{i.pointerType!=="mouse"&&(E.current=!1,b(z),x(null))},ri=i=>{if(r===0)return;let t=p??F??-1,n=null;if(i.key==="ArrowRight")n=h(t+1);else if(i.key==="ArrowLeft")n=h(t<0?0:t-1);else if(i.key==="Home")n=0;else if(i.key==="End")n=r-1;else if(i.key==="Escape"){p!==null&&(i.preventDefault(),g(!0),b(null));return}n!==null&&(i.preventDefault(),g(!1),b(n))},X=p===null?[]:v.map(i=>({label:i.label,paint:i.paint,v:i.values[p]})).filter(i=>i.v!==null).sort((i,t)=>t.v-i.v),j=p===null?"":J?.[p]??s[p]??"",ni=p===null?"":`${j}: ${X.map(i=>`${i.label} ${k(i.v)}`).join(", ")}`,_=p===null?0:H(p),pi=p!==null&&c>0&&_>c*.55?"left":"right",N=typeof o=="number"&&Number.isFinite(o),y=N?o:0,si=Math.floor((r-1)/2);return u("section",{className:["ui-at-kpi",Y].filter(Boolean).join(" "),"aria-labelledby":a?D:void 0,"aria-label":a?void 0:"Chart",children:[e("style",{href:"ui-at-kpi-chart",precedence:"default",children:ki}),a&&e("h3",{className:"ui-at-kpi__title",id:D,children:a}),(l||N)&&u("p",{className:"ui-at-kpi__figure",children:[l&&e("span",{className:"ui-at-kpi__value",children:l}),N&&u("span",{className:"ui-at-kpi__delta","data-trend":y<0?"down":"up",children:[e("span",{className:"ui-at-kpi__sr",children:y<0?"down ":"up "}),y<0?"\u2212":"+",k(Math.abs(y))]})]}),u("div",{className:"ui-at-kpi__chart",children:[e("div",{className:"ui-at-kpi__axis","aria-hidden":"true",children:A.map(i=>e("span",{style:{top:d(i)},children:k(i)},i))}),u("div",{ref:L,className:"ui-at-kpi__plot",tabIndex:r>0?0:-1,role:"group","aria-roledescription":"chart","aria-label":`${a?`${a} chart`:"Chart"} \u2013 use the arrow keys to read the values per day`,"aria-describedby":S,onPointerMove:ei,onPointerDown:ti,onPointerUp:ai,onPointerLeave:i=>i.pointerType==="mouse"&&x(null),onKeyDown:ri,onBlur:()=>b(null),children:[c>0&&u("svg",{className:"ui-at-kpi__svg",width:c,height:M,"aria-hidden":"true",children:[A.map(i=>e("line",{className:"ui-at-kpi__grid",x1:0,x2:c,y1:d(i),y2:d(i)},i)),e("g",{className:"ui-at-kpi__lines",children:v.map(i=>{let t="",n=!1;return i.values.forEach((w,m)=>{if(w===null){n=!1;return}t+=`${n?"L":"M"}${H(m).toFixed(1)} ${d(w).toFixed(1)}`,n=!0}),e("path",{d:t,fill:"none",stroke:i.paint,strokeWidth:1.75,strokeLinejoin:"round",strokeLinecap:"round"},i.label)})})]}),p!==null&&c>0&&u(V,{children:[e("span",{className:"ui-at-kpi__guide","aria-hidden":"true",style:{transform:`translateX(${_}px)`}}),v.map(i=>{let t=i.values[p];return t===null?null:e("span",{className:"ui-at-kpi__dot","aria-hidden":"true",style:{transform:`translate(${_}px, ${d(t)}px)`,"--ui-at-kpi-series":i.paint}},i.label)}),e("div",{className:"ui-at-kpi__tip","aria-hidden":"true","data-side":pi,style:{transform:`translateX(${_}px)`},children:u("div",{className:"ui-at-kpi__tip-card",children:[e("p",{className:"ui-at-kpi__tip-head",children:j}),e("ul",{children:X.map(i=>u("li",{style:{"--ui-at-kpi-series":i.paint},children:[e("span",{className:"ui-at-kpi__tip-mark"}),e("span",{className:"ui-at-kpi__tip-label",children:i.label}),e("span",{className:"ui-at-kpi__tip-value",children:k(i.v)})]},i.label))})]})})]}),r===0&&e("p",{className:"ui-at-kpi__empty",children:"No data yet"})]}),u("div",{className:"ui-at-kpi__x","aria-hidden":"true",children:[r>0&&e("span",{children:s[0]}),r>2&&e("span",{children:s[si]}),r>1&&e("span",{children:s[r-1]})]})]}),e("p",{className:"ui-at-kpi__sr",id:S,role:"status","aria-live":"polite",children:ni}),R&&e("p",{className:"ui-at-kpi__footer",children:R})]})}var ki=`
.ui-at-kpi {
  --ui-at-kpi-panel: #ffffff;
  --ui-at-kpi-frame: #f2f6fa;
  --ui-at-kpi-line: #dae2ec;
  --ui-at-kpi-firm: #cbd6e4;
  --ui-at-kpi-ink: #00162b;
  --ui-at-kpi-text: rgba(0, 22, 43, 0.66);
  --ui-at-kpi-muted: rgba(0, 22, 43, 0.54);
  --ui-at-kpi-grid: rgba(26, 62, 112, 0.1);
  --ui-at-kpi-guide: rgba(26, 62, 112, 0.35);
  --ui-at-kpi-ring: #8fbdf2;
  --ui-at-kpi-up: #1d6a34;
  --ui-at-kpi-down: #8a3a22;
  --ui-at-kpi-c1: #2c5a96;
  --ui-at-kpi-c2: #851437;
  --ui-at-kpi-c3: #5b8fd0;
  --ui-at-kpi-c4: #2e8b57;
  --ui-at-kpi-c5: #98a5b8;
  --ui-at-kpi-c6: #b07d12;
  --ui-at-kpi-raised: 0 18px 30px -16px rgba(26, 62, 112, 0.38), 0 4px 10px -6px rgba(26, 62, 112, 0.18);
  --ui-at-kpi-floating: 0 24px 48px -24px rgba(26, 62, 112, 0.3), 0 8px 16px -8px rgba(26, 62, 112, 0.2);
  --ui-at-kpi-ease: cubic-bezier(0.16, 1, 0.3, 1);

  box-sizing: border-box;
  width: 100%;
  max-width: 460px;
  padding: 20px 20px 16px;
  border-radius: 16px;
  background: var(--ui-at-kpi-panel);
  border: 1px solid var(--ui-at-kpi-line);
  box-shadow: var(--ui-at-kpi-raised);
  color: var(--ui-at-kpi-ink);
  font-family: "Avenir Next", Avenir, system-ui, sans-serif;
  font-size: 13px;
  line-height: 1.4;
  -webkit-font-smoothing: antialiased;
}
:where(.dark, [data-theme="dark"]) .ui-at-kpi {
  --ui-at-kpi-panel: #16345c;
  --ui-at-kpi-frame: #0f2747;
  --ui-at-kpi-line: rgba(255, 255, 255, 0.12);
  --ui-at-kpi-firm: rgba(255, 255, 255, 0.18);
  --ui-at-kpi-ink: rgba(255, 255, 255, 0.94);
  --ui-at-kpi-text: rgba(255, 255, 255, 0.72);
  --ui-at-kpi-muted: rgba(255, 255, 255, 0.56);
  --ui-at-kpi-grid: rgba(255, 255, 255, 0.09);
  --ui-at-kpi-guide: rgba(255, 255, 255, 0.35);
  --ui-at-kpi-ring: rgba(143, 189, 242, 0.6);
  --ui-at-kpi-up: #7fe0a0;
  --ui-at-kpi-down: #f2a48c;
  --ui-at-kpi-c1: #8fbdf2;
  --ui-at-kpi-c2: #e0628a;
  --ui-at-kpi-c3: #4f86cc;
  --ui-at-kpi-c4: #7fe0a0;
  --ui-at-kpi-c5: #a9b6c8;
  --ui-at-kpi-c6: #f3d27a;
  --ui-at-kpi-raised: 0 18px 30px -16px rgba(3, 12, 28, 0.8), 0 4px 10px -6px rgba(3, 12, 28, 0.6);
  --ui-at-kpi-floating: 0 24px 48px -24px rgba(3, 12, 28, 0.8), 0 8px 16px -8px rgba(3, 12, 28, 0.6);
}

.ui-at-kpi__title {
  margin: 0;
  font-family: "Avenir Next Condensed", "Avenir Next", Avenir, system-ui, sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: var(--ui-at-kpi-text);
}
.ui-at-kpi__figure {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 4px 10px;
  margin: 4px 0 0;
}
.ui-at-kpi__value {
  font-size: 28px;
  font-weight: 600;
  letter-spacing: -0.01em;
  font-variant-numeric: tabular-nums;
}
.ui-at-kpi__delta {
  font-size: 13px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: var(--ui-at-kpi-up);
}
.ui-at-kpi__delta[data-trend="down"] { color: var(--ui-at-kpi-down); }

.ui-at-kpi__chart {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  column-gap: 12px;
  margin-top: 18px;
}
.ui-at-kpi__axis {
  position: relative;
  height: ${M}px;
  min-width: 28px;
  color: var(--ui-at-kpi-muted);
  font-size: 11px;
  font-variant-numeric: tabular-nums;
}
.ui-at-kpi__axis span {
  position: absolute;
  right: 0;
  transform: translateY(-50%);
  white-space: nowrap;
}
.ui-at-kpi__plot {
  position: relative;
  height: ${M}px;
  border-radius: 6px;
  outline: none;
  touch-action: pan-y;
  cursor: crosshair;
}
.ui-at-kpi__plot:focus-visible { box-shadow: 0 0 0 3px var(--ui-at-kpi-ring); }
.ui-at-kpi__svg { display: block; overflow: visible; }
.ui-at-kpi__grid { stroke: var(--ui-at-kpi-grid); stroke-width: 1; shape-rendering: crispEdges; }
.ui-at-kpi__lines { animation: ui-at-kpi-draw 1100ms var(--ui-at-kpi-ease) both; }

.ui-at-kpi__guide {
  position: absolute;
  top: 0;
  bottom: 0;
  left: -0.5px;
  width: 1px;
  background: var(--ui-at-kpi-guide);
  pointer-events: none;
  transition: transform 150ms var(--ui-at-kpi-ease);
}
.ui-at-kpi__dot {
  position: absolute;
  top: -4.5px;
  left: -4.5px;
  width: 9px;
  height: 9px;
  box-sizing: border-box;
  border-radius: 50%;
  background: var(--ui-at-kpi-series);
  border: 2px solid var(--ui-at-kpi-panel);
  box-shadow: 0 0 0 1px var(--ui-at-kpi-series);
  pointer-events: none;
  transition: transform 150ms var(--ui-at-kpi-ease);
}
.ui-at-kpi__tip {
  position: absolute;
  top: -6px;
  left: 0;
  z-index: 2;
  pointer-events: none;
  transition: transform 150ms var(--ui-at-kpi-ease);
}
.ui-at-kpi__tip-card {
  min-width: 140px;
  margin-left: 12px;
  padding: 9px 11px;
  border-radius: 12px;
  background: var(--ui-at-kpi-panel);
  border: 1px solid var(--ui-at-kpi-firm);
  box-shadow: var(--ui-at-kpi-floating);
  animation: ui-at-kpi-fade 150ms var(--ui-at-kpi-ease) both;
}
.ui-at-kpi__tip[data-side="left"] .ui-at-kpi__tip-card { margin-left: 0; transform: translateX(calc(-100% - 12px)); }
.ui-at-kpi__tip-head { margin: 0 0 4px; color: var(--ui-at-kpi-muted); font-size: 11.5px; white-space: nowrap; }
.ui-at-kpi__tip-card ul { list-style: none; margin: 0; padding: 0; }
.ui-at-kpi__tip-card li {
  display: grid;
  grid-template-columns: 10px minmax(0, 1fr) auto;
  align-items: center;
  gap: 8px;
  height: 22px;
  font-size: 12.5px;
}
.ui-at-kpi__tip-mark { width: 10px; height: 2px; border-radius: 2px; background: var(--ui-at-kpi-series); }
.ui-at-kpi__tip-label { color: var(--ui-at-kpi-text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ui-at-kpi__tip-value { font-weight: 600; font-variant-numeric: tabular-nums; }

.ui-at-kpi__x {
  grid-column: 2;
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  color: var(--ui-at-kpi-muted);
  font-size: 11.5px;
  white-space: nowrap;
}
.ui-at-kpi__empty {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  margin: 0;
  color: var(--ui-at-kpi-muted);
}
.ui-at-kpi__footer { margin: 16px 0 0; color: var(--ui-at-kpi-muted); font-size: 12.5px; }
.ui-at-kpi__sr {
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

@keyframes ui-at-kpi-draw {
  from { clip-path: inset(-10px 100% -10px -10px); }
  to { clip-path: inset(-10px -10px -10px -10px); }
}
@keyframes ui-at-kpi-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}
@media (prefers-reduced-motion: reduce) {
  .ui-at-kpi *, .ui-at-kpi *::before, .ui-at-kpi *::after {
    animation: none !important;
    transition: none !important;
  }
}
`;var xi=["Mar 3","Mar 4","Mar 5","Mar 6","Mar 7","Mar 8","Mar 9"],bi=["Mon, Mar 3","Tue, Mar 4","Wed, Mar 5","Thu, Mar 6","Fri, Mar 7","Sat, Mar 8","Sun, Mar 9"],gi=[{label:"Organic",values:[4200,4700,3900,4600,5400,5100,5900]},{label:"Paid ads",values:[3600,3300,4400,4800,4e3,4500,4200]},{label:"Referral",values:[1800,2300,2e3,1500,2400,2200,2700]},{label:"Email",values:[1200,1100,1700,2100,1600,1300,1500]},{label:"Direct",values:[600,900,700,800,1e3,1400,1100]}];function vi(){return e(G,{title:"Revenue",value:"$96.4k",delta:7900,format:a=>Math.abs(a)>=1e3?`$${(a/1e3).toFixed(1).replace(/\.0$/,"")}k`:`$${Math.round(a)}`,labels:xi,tooltipLabels:bi,series:gi,footer:"Top 5 channels"})}export{vi as default};
