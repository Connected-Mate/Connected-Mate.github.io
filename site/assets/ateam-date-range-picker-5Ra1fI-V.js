import{t as gt}from"./react-BkAXpnfr.js";var ft=gt();var{Children:Nt,Component:Rt,Fragment:Ft,StrictMode:Ct,cloneElement:Yt,createContext:Et,createElement:Pt,createRef:$t,forwardRef:Lt,isValidElement:Tt,lazy:St,memo:At,startTransition:It,Suspense:zt,use:Bt,useCallback:ue,useContext:Ht,useDebugValue:Kt,useDeferredValue:Ut,useEffect:G,useId:Le,useImperativeHandle:jt,useInsertionEffect:Vt,useLayoutEffect:qt,useMemo:Te,useOptimistic:Ot,useReducer:Wt,useRef:T,useState:c,useSyncExternalStore:Xt,useTransition:Jt}=ft;import{t as mt}from"./jsx-runtime-CTsRTJUX.js";var bt=mt(),{jsx:r,jsxs:p,Fragment:Q}=bt;var i=e=>new Date(e.getFullYear(),e.getMonth(),e.getDate()),g=(e,n)=>new Date(e.getFullYear(),e.getMonth(),e.getDate()+n),x=e=>new Date(e.getFullYear(),e.getMonth(),1),fe=(e,n)=>new Date(e,n+1,0).getDate();function U(e,n){let s=e.getFullYear(),v=e.getMonth()+n,m=new Date(s,v,1);return new Date(m.getFullYear(),m.getMonth(),Math.min(e.getDate(),fe(m.getFullYear(),m.getMonth())))}function ee(e,n){let s=e.getFullYear()+n;return new Date(s,e.getMonth(),Math.min(e.getDate(),fe(s,e.getMonth())))}var b=(e,n)=>!!e&&!!n&&e.getFullYear()===n.getFullYear()&&e.getMonth()===n.getMonth()&&e.getDate()===n.getDate(),Se=e=>`${e.getFullYear()}-${e.getMonth()+1}-${e.getDate()}`,Z=e=>Math.round((i(e.end).getTime()-i(e.start).getTime())/864e5)+1,ce=(e,n)=>e<=n?{start:e,end:n}:{start:n,end:e},_t=(e,n)=>b(e.start,n.start)&&b(e.end,n.end),Ae=new Intl.DateTimeFormat("en-US",{month:"long",year:"numeric"}),A=new Intl.DateTimeFormat("en-US",{month:"short",day:"numeric"}),Ie=new Intl.DateTimeFormat("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"}),ht=new Intl.DateTimeFormat("en-US",{weekday:"short"});function S(e){let n=i(e.start),s=i(e.end);return b(n,s)?`${A.format(n)}, ${n.getFullYear()}`:n.getFullYear()===s.getFullYear()?`${A.format(n)} \u2013 ${A.format(s)}, ${s.getFullYear()}`:`${A.format(n)}, ${n.getFullYear()} \u2013 ${A.format(s)}, ${s.getFullYear()}`}function ge(e,n){if(n==="off")return null;if(n==="year")return{start:ee(i(e.start),-1),end:ee(i(e.end),-1)};let s=g(i(e.start),-1);return{start:g(s,-(Z(e)-1)),end:s}}var xt=[{id:"today",label:"Today",range:e=>({start:i(e),end:i(e)})},{id:"yesterday",label:"Yesterday",range:e=>({start:g(e,-1),end:g(e,-1)})},{id:"7d",label:"Last 7 days",range:e=>({start:g(e,-6),end:i(e)})},{id:"30d",label:"Last 30 days",range:e=>({start:g(e,-29),end:i(e)})},{id:"90d",label:"Last 90 days",range:e=>({start:g(e,-89),end:i(e)})},{id:"month",label:"This month",range:e=>({start:x(e),end:i(e)})},{id:"last-month",label:"Last month",range:e=>{let n=new Date(e.getFullYear(),e.getMonth()-1,1);return{start:n,end:new Date(n.getFullYear(),n.getMonth()+1,0)}}},{id:"quarter",label:"This quarter",range:e=>({start:new Date(e.getFullYear(),Math.floor(e.getMonth()/3)*3,1),end:i(e)})},{id:"ytd",label:"Year to date",range:e=>({start:new Date(e.getFullYear(),0,1),end:i(e)})}],vt={off:"Off",previous:"Previous period",year:"Previous year"};function ze({value:e,defaultValue:n,onChange:s,presets:v=xt,compare:m=!0,defaultCompare:R="previous",weekStartsOn:F=1,min:_,max:j,defaultOpen:V=!1,today:Be,className:He}){let I=Le(),[C]=c(()=>i(Be??new Date)),z=i(j??C),y=_?i(_):null,te=ue(t=>t>z?z:y&&t<y?y:t,[z.getTime(),y?.getTime()]),ae=t=>ce(te(i(t.start)),te(i(t.end))),me=t=>t>z||!!y&&t<y,[Ke,Ue]=c(()=>ae(n??{start:g(C,-29),end:C})),k=e?{start:i(e.start),end:i(e.end)}:Ke,[je,Ve]=c(m?R:"off"),re=m?je:"off",[D,ne]=c(V),[M,q]=c(k),[P,be]=c(re),[l,$]=c(null),[_e,w]=c(null),[B,H]=c(k.end),[N,oe]=c(x(k.end)),[qe,de]=c(0),[ie,Oe]=c(!1),[We,O]=c(""),he=T(0),[xe,ve]=c(0),we=T(null),ye=T(null),ke=T(null);G(()=>{if(typeof window>"u"||!window.matchMedia)return;let t=window.matchMedia("(max-width: 600px)"),a=()=>Oe(t.matches);return a(),t.addEventListener("change",a),()=>t.removeEventListener("change",a)},[]);let Xe=()=>{q(k),be(re),$(null),w(null),H(k.end),oe(x(k.end)),de(0),ne(!0),ve(++he.current)},W=ue(t=>{if(t){let a=l?{start:l,end:l}:M;e||Ue(a),Ve(P),s?.(a,ge(a,P),P)}$(null),w(null),ne(!1),ye.current?.focus()},[l,M,P,s,e]);G(()=>{if(!D)return;let t=a=>{we.current?.contains(a.target)||($(null),w(null),ne(!1))};return document.addEventListener("pointerdown",t),()=>document.removeEventListener("pointerdown",t)},[D]),G(()=>{if(!D||!xe)return;ke.current?.querySelector(`[data-day="${Se(B)}"]`)?.focus({preventScroll:!0})},[xe,D]);let pe=ie?[N]:[U(N,-1),N],X=pe[0],J=t=>{let a=U(N,t);de(t>0?1:-1),oe(a);let u=ie?[a]:[U(a,-1),a];O(u.map(d=>Ae.format(d)).join(" \u2013 "))},Je=t=>{let a=x(t),u=N;if(a>u){let d=(a.getFullYear()-u.getFullYear())*12+a.getMonth()-u.getMonth();J(d)}else if(a<X){let d=(a.getFullYear()-X.getFullYear())*12+a.getMonth()-X.getMonth();J(d)}},Ge=t=>{let a=te(i(t));H(a),Je(a),l&&w(a),ve(++he.current)},Qe=t=>{if(!me(t))if(H(t),!l)$(t),w(t),q({start:t,end:t}),O(`Start ${Ie.format(t)}. Pick the end date.`);else{let a=ce(l,t);q(a),$(null),w(null),O(`${S(a)}, ${Z(a)} days`)}},Ze=(t,a)=>{let u=(a.getDay()-F+7)%7,d=null;switch(t.key){case"ArrowLeft":d=g(a,-1);break;case"ArrowRight":d=g(a,1);break;case"ArrowUp":d=g(a,-7);break;case"ArrowDown":d=g(a,7);break;case"PageUp":d=t.shiftKey?ee(a,-1):U(a,-1);break;case"PageDown":d=t.shiftKey?ee(a,1):U(a,1);break;case"Home":d=g(a,-u);break;case"End":d=g(a,6-u);break;default:return}t.preventDefault(),Ge(d)},Y=l&&_e?ce(l,_e):M,et=!!l,h=m?ge(l?{start:l,end:l}:M,P):null,De=l?null:v.find(t=>_t(ae(t.range(C)),M))?.id??null,tt=Te(()=>{let t=new Date(2024,0,7+F);return Array.from({length:7},(a,u)=>{let d=g(t,u);return{short:ht.format(d).slice(0,2),long:new Intl.DateTimeFormat("en-US",{weekday:"long"}).format(d)}})},[F]),at=!y||X>x(y),rt=x(N)<x(z),Me=ge(k,re),nt=(t,a)=>{let u=t.getFullYear(),d=t.getMonth(),se=fe(u,d),ot=(new Date(u,d,1).getDay()-F+7)%7,K=[...Array(ot).fill(null)];for(let f=1;f<=se;f++)K.push(new Date(u,d,f));for(;K.length%7;)K.push(null);let Ne=[];for(let f=0;f<K.length;f+=7)Ne.push(K.slice(f,f+7));let Re=`${I}-m${a}`,Fe=B.getMonth()===d&&B.getFullYear()===u?B:null;return p("div",{className:"ui-at-drp__month","data-dir":qe||void 0,children:[p("div",{className:"ui-at-drp__month-head",children:[a===0?r("button",{type:"button",className:"ui-at-drp__nav","aria-label":"Previous month",disabled:!at,onClick:()=>J(-1),children:r("svg",{viewBox:"0 0 12 12","aria-hidden":"true",children:r("path",{d:"M7.5 2.5L4 6l3.5 3.5"})})}):r("span",{className:"ui-at-drp__nav-space"}),r("h3",{id:Re,className:"ui-at-drp__month-title",children:Ae.format(t)}),a===pe.length-1?r("button",{type:"button",className:"ui-at-drp__nav","aria-label":"Next month",disabled:!rt,onClick:()=>J(1),children:r("svg",{viewBox:"0 0 12 12","aria-hidden":"true",children:r("path",{d:"M4.5 2.5L8 6 4.5 9.5"})})}):r("span",{className:"ui-at-drp__nav-space"})]}),p("div",{role:"grid","aria-labelledby":Re,className:"ui-at-drp__grid",children:[r("div",{role:"row",className:"ui-at-drp__week ui-at-drp__week--head",children:tt.map(f=>r("span",{role:"columnheader",className:"ui-at-drp__wd",children:r("abbr",{title:f.long,children:f.short})},f.long))}),Ne.map((f,dt)=>r("div",{role:"row",className:"ui-at-drp__week",children:f.map((o,L)=>{if(!o)return r("span",{role:"gridcell",className:"ui-at-drp__cell ui-at-drp__cell--blank"},L);let E=!!Y&&o>=Y.start&&o<=Y.end,Ce=!!Y&&b(o,Y.start),Ye=!!Y&&b(o,Y.end),le=!!h&&o>=h.start&&o<=h.end,Ee=!!h&&b(o,h.start),Pe=!!h&&b(o,h.end),it=Ce||L===0||o.getDate()===1,pt=Ye||L===6||o.getDate()===se,st=Ee||L===0||o.getDate()===1,lt=Pe||L===6||o.getDate()===se,$e=me(o),ut=Fe?b(o,Fe):!1;return r("span",{role:"gridcell",className:"ui-at-drp__cell","aria-selected":E,"data-range":E?"":void 0,"data-preview":E&&et?"":void 0,"data-cap-l":E&&it?"":void 0,"data-cap-r":E&&pt?"":void 0,"data-cmp":le&&!E?"":void 0,"data-cmp-cap-l":le&&st?"":void 0,"data-cmp-cap-r":le&&lt?"":void 0,children:r("button",{type:"button",className:"ui-at-drp__day","data-day":Se(o),"data-end":Ce||Ye?"":void 0,"data-cmp-end":(Ee||Pe)&&!E?"":void 0,"data-today":b(o,C)?"":void 0,"aria-current":b(o,C)?"date":void 0,"aria-label":Ie.format(o),"aria-disabled":$e||void 0,tabIndex:ut?0:-1,onClick:()=>Qe(o),onPointerEnter:()=>l&&!$e&&w(o),onFocus:()=>!b(o,B)&&H(o),onKeyDown:ct=>Ze(ct,o),children:o.getDate()})},L)})},dt))]})]},`${u}-${d}`)};return p("div",{ref:we,className:["ui-at-drp",He].filter(Boolean).join(" "),"data-open":D?"":void 0,"data-narrow":ie?"":void 0,children:[r("style",{href:"ui-date-range-picker",precedence:"default",children:yt}),p("button",{ref:ye,type:"button",className:"ui-at-drp__trigger","aria-haspopup":"dialog","aria-expanded":D,"aria-controls":`${I}-panel`,onClick:()=>D?W(!1):Xe(),children:[p("svg",{className:"ui-at-drp__cal",viewBox:"0 0 16 16","aria-hidden":"true",children:[r("rect",{x:"2.5",y:"3.5",width:"11",height:"10",rx:"2"}),r("path",{d:"M2.5 6.5h11M5.5 2v3M10.5 2v3"})]}),p("span",{className:"ui-at-drp__trigger-text",children:[r("span",{className:"ui-at-drp__trigger-range",children:S(k)}),Me?p("span",{className:"ui-at-drp__trigger-cmp",children:["vs. ",S(Me)]}):null]}),r("svg",{className:"ui-at-drp__chev",viewBox:"0 0 12 12","aria-hidden":"true",children:r("path",{d:"M3 4.5L6 7.5l3-3"})})]}),D?p("div",{ref:ke,id:`${I}-panel`,className:"ui-at-drp__panel",role:"dialog","aria-label":"Choose a date range",onKeyDown:t=>{t.key==="Escape"&&(t.preventDefault(),t.stopPropagation(),W(!1))},children:[p("div",{className:"ui-at-drp__sheet",children:[p("div",{className:"ui-at-drp__presets",role:"group","aria-label":"Presets",children:[v.map(t=>r("button",{type:"button",className:"ui-at-drp__preset","aria-pressed":De===t.id,onClick:()=>{let a=ae(t.range(C));q(a),$(null),w(null),H(a.end),b(x(a.end),N)||(de(x(a.end)>N?1:-1),oe(x(a.end))),O(`${t.label}: ${S(a)}`)},children:t.label},t.id)),r("span",{className:"ui-at-drp__preset ui-at-drp__preset--custom","aria-hidden":"true","data-on":De?void 0:"",children:"Custom"})]}),r("div",{className:"ui-at-drp__months",onPointerLeave:()=>l&&w(l),children:pe.map(nt)})]}),p("div",{className:"ui-at-drp__foot",children:[p("div",{className:"ui-at-drp__summary",children:[r("p",{className:"ui-at-drp__sum-line",children:l?p(Q,{children:[p("strong",{children:[A.format(l)," \u2013 \u2026"]}),r("span",{className:"ui-at-drp__muted",children:"Pick the end date"})]}):p(Q,{children:[r("strong",{children:S(M)}),p("span",{className:"ui-at-drp__muted",children:[Z(M)," ",Z(M)===1?"day":"days"]})]})}),m?p(Q,{children:[p("div",{className:"ui-at-drp__cmp-row",children:[r("span",{className:"ui-at-drp__muted",id:`${I}-cmp`,children:"Compare"}),r(wt,{value:P,onChange:be,labelledBy:`${I}-cmp`})]}),p("p",{className:"ui-at-drp__cmp-line","data-off":h?void 0:"",children:[r("span",{className:"ui-at-drp__swatch","aria-hidden":"true"}),h?`vs. ${S(h)}`:"No comparison"]})]}):null]}),p("div",{className:"ui-at-drp__actions",children:[r("button",{type:"button",className:"ui-at-drp__btn ui-at-drp__btn--ghost",onClick:()=>W(!1),children:"Cancel"}),r("button",{type:"button",className:"ui-at-drp__btn ui-at-drp__btn--main",onClick:()=>W(!0),children:"Apply"})]})]}),r("span",{className:"ui-at-drp__sr","aria-live":"polite",children:We})]}):null]})}function wt({value:e,onChange:n,labelledBy:s}){let v=["off","previous","year"],m=T([]);return r("div",{className:"ui-at-drp__seg",role:"radiogroup","aria-labelledby":s,children:v.map((R,F)=>r("button",{ref:_=>{m.current[F]=_},type:"button",role:"radio","aria-checked":e===R,tabIndex:e===R?0:-1,className:"ui-at-drp__seg-opt",onClick:()=>n(R),onKeyDown:_=>{let j=_.key==="ArrowRight"||_.key==="ArrowDown"?1:_.key==="ArrowLeft"||_.key==="ArrowUp"?-1:0;if(!j)return;_.preventDefault();let V=(F+j+v.length)%v.length;n(v[V]),m.current[V]?.focus()},children:vt[R]},R))})}var yt=`
.ui-at-drp {
  --drp-frame: #f2f6fa;
  --drp-panel: #ffffff;
  --drp-pale: #fbfcfe;
  --drp-soft: rgba(26, 62, 112, 0.06);
  --drp-line: #dae2ec;
  --drp-firm: #cbd6e4;
  --drp-ink: #00162b;
  --drp-text: rgba(0, 22, 43, 0.66);
  --drp-muted: rgba(0, 22, 43, 0.54);
  --drp-faint: rgba(0, 22, 43, 0.3);
  --drp-berry: #851437;
  --drp-berry-hover: #6d0f2d;
  --drp-info-ink: #1a3e70;
  --drp-info-fill: #eef5ff;
  --drp-info-line: #c1daff;
  --drp-ring: #8fbdf2;
  --drp-band: #e3eefc;
  --drp-band-preview: #f1f6fd;
  --drp-end-ink: #ffffff;
  --drp-pebble: inset 0 -2px 6px -4px rgba(26, 62, 112, 0.4);
  --drp-drop: 0 8px 16px -8px rgba(26, 62, 112, 0.2);
  --drp-float: 0 24px 48px -24px rgba(26, 62, 112, 0.3), 0 8px 16px -8px rgba(26, 62, 112, 0.18);
  --drp-main-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 6px 12px -6px rgba(133, 20, 55, 0.6);
  --drp-ease: cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  display: inline-block;
  max-width: 100%;
  font-family: "Avenir Next", Avenir, system-ui, sans-serif;
  font-size: 14px;
  line-height: 1.35;
  color: var(--drp-ink);
  -webkit-font-smoothing: antialiased;
}
:where(.dark, [data-theme="dark"]) .ui-at-drp {
  --drp-frame: #0f2747;
  --drp-panel: #16345c;
  --drp-pale: #1a3b66;
  --drp-soft: rgba(255, 255, 255, 0.07);
  --drp-line: rgba(255, 255, 255, 0.12);
  --drp-firm: rgba(255, 255, 255, 0.18);
  --drp-ink: rgba(255, 255, 255, 0.94);
  --drp-text: rgba(255, 255, 255, 0.72);
  --drp-muted: rgba(255, 255, 255, 0.56);
  --drp-faint: rgba(255, 255, 255, 0.3);
  --drp-berry: #a8204d;
  --drp-berry-hover: #bd2a5a;
  --drp-info-ink: #c1daff;
  --drp-info-fill: rgba(143, 189, 242, 0.16);
  --drp-info-line: rgba(143, 189, 242, 0.34);
  --drp-ring: rgba(143, 189, 242, 0.6);
  --drp-band: rgba(143, 189, 242, 0.2);
  --drp-band-preview: rgba(143, 189, 242, 0.1);
  --drp-end-ink: #0f2747;
  --drp-pebble: inset 0 -2px 6px -4px rgba(3, 12, 28, 0.8);
  --drp-drop: 0 8px 16px -8px rgba(3, 12, 28, 0.6);
  --drp-float: 0 24px 48px -24px rgba(3, 12, 28, 0.8), 0 8px 16px -8px rgba(3, 12, 28, 0.6);
  --drp-main-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.14), 0 6px 12px -6px rgba(3, 12, 28, 0.7);
}
.ui-at-drp *, .ui-at-drp *::before, .ui-at-drp *::after { box-sizing: border-box; }
:where(.ui-at-drp) button { font: inherit; color: inherit; }
.ui-at-drp :focus-visible { outline: 2px solid var(--drp-ring); outline-offset: 2px; }

/* Trigger: secondary button. */
.ui-at-drp__trigger {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  max-width: 100%;
  min-height: 46px;
  padding: 6px 12px;
  background: var(--drp-pale);
  border: 1px solid var(--drp-firm);
  border-radius: 12px;
  box-shadow: var(--drp-drop);
  cursor: pointer;
  text-align: left;
  transition: border-color 150ms var(--drp-ease), background-color 150ms var(--drp-ease);
}
.ui-at-drp__trigger:hover { border-color: var(--drp-info-line); }
.ui-at-drp__cal, .ui-at-drp__chev { flex: none; fill: none; stroke: var(--drp-text); stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }
.ui-at-drp__cal { width: 16px; height: 16px; }
.ui-at-drp__chev { width: 12px; height: 12px; transition: rotate 150ms var(--drp-ease); }
.ui-at-drp[data-open] .ui-at-drp__chev { rotate: 180deg; }
.ui-at-drp__trigger-text { display: grid; min-width: 0; }
.ui-at-drp__trigger-range { font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ui-at-drp__trigger-cmp { font-size: 12.5px; color: var(--drp-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* Panel: matte frame, raised sheet, footer in the frame. */
.ui-at-drp__panel {
  position: absolute;
  z-index: 40;
  top: calc(100% + 8px);
  left: 0;
  width: var(--ui-at-drp-panel-width, min(652px, calc(100vw - 32px)));
  padding: 6px;
  background: var(--drp-frame);
  border: 1px solid var(--drp-line);
  border-radius: 22px;
  box-shadow: var(--drp-float);
  transform-origin: top left;
  animation: ui-at-drp-open 180ms var(--drp-ease);
}
.ui-at-drp__sheet {
  display: grid;
  grid-template-columns: 136px 1fr;
  background: var(--drp-panel);
  border: 1px solid var(--drp-line);
  border-radius: 16px;
  box-shadow: var(--drp-drop);
  overflow: hidden;
}
.ui-at-drp__presets {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px 6px;
  border-right: 1px solid var(--drp-line);
}
.ui-at-drp__preset {
  display: block;
  width: 100%;
  padding: 7px 10px;
  border: 1px solid transparent;
  border-radius: 9px;
  background: transparent;
  color: var(--drp-text);
  font-size: 13.5px;
  text-align: left;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 150ms var(--drp-ease), color 150ms var(--drp-ease);
}
.ui-at-drp__preset:hover { background: var(--drp-soft); color: var(--drp-ink); }
.ui-at-drp__preset[aria-pressed="true"], .ui-at-drp__preset--custom[data-on] {
  position: relative;
  background: var(--drp-info-fill);
  border-color: var(--drp-info-line);
  color: var(--drp-info-ink);
  font-weight: 600;
}
.ui-at-drp__preset[aria-pressed="true"]::before, .ui-at-drp__preset--custom[data-on]::before {
  content: "";
  position: absolute;
  left: 3px;
  top: 8px;
  bottom: 8px;
  width: 2px;
  border-radius: 2px;
  background: var(--drp-berry);
}
.ui-at-drp__preset--custom { cursor: default; color: var(--drp-muted); }
.ui-at-drp__preset--custom:hover { background: transparent; }

.ui-at-drp__months {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  gap: 20px;
  padding: 10px 16px 14px;
  overflow: hidden;
}
.ui-at-drp__month { min-width: 0; animation: ui-at-drp-in 220ms var(--drp-ease); }
.ui-at-drp__month[data-dir="1"] { animation-name: ui-at-drp-from-right; }
.ui-at-drp__month[data-dir="-1"] { animation-name: ui-at-drp-from-left; }
.ui-at-drp__month-head { display: flex; align-items: center; justify-content: space-between; height: 32px; margin-bottom: 6px; }
.ui-at-drp__month-title {
  margin: 0;
  font-family: "Avenir Next Condensed", "Avenir Next", Avenir, system-ui, sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: var(--drp-ink);
}
.ui-at-drp__nav, .ui-at-drp__nav-space { width: 28px; height: 28px; flex: none; }
.ui-at-drp__nav {
  display: grid;
  place-items: center;
  padding: 0;
  border: 1px solid transparent;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
}
.ui-at-drp__nav:hover:not(:disabled) { background: var(--drp-soft); border-color: var(--drp-line); }
.ui-at-drp__nav:disabled { opacity: 0.35; cursor: default; }
.ui-at-drp__nav svg { width: 12px; height: 12px; fill: none; stroke: var(--drp-ink); stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; }

.ui-at-drp__grid { display: grid; gap: 4px; }
.ui-at-drp__week { display: grid; grid-template-columns: repeat(7, 1fr); }
.ui-at-drp__wd { display: grid; place-items: center; height: 24px; font-size: 11.5px; font-weight: 600; color: var(--drp-muted); }
.ui-at-drp__wd abbr { text-decoration: none; }
.ui-at-drp__cell { position: relative; display: grid; place-items: center; height: 34px; }
.ui-at-drp__cell[data-cmp] { background: var(--drp-soft); }
.ui-at-drp__cell[data-cmp-cap-l] { border-top-left-radius: 10px; border-bottom-left-radius: 10px; }
.ui-at-drp__cell[data-cmp-cap-r] { border-top-right-radius: 10px; border-bottom-right-radius: 10px; }
.ui-at-drp__cell[data-range] { background: var(--drp-band); transition: background-color 150ms var(--drp-ease); }
.ui-at-drp__cell[data-preview] { background: var(--drp-band-preview); }
.ui-at-drp__cell[data-cap-l] { border-top-left-radius: 10px; border-bottom-left-radius: 10px; }
.ui-at-drp__cell[data-cap-r] { border-top-right-radius: 10px; border-bottom-right-radius: 10px; }
.ui-at-drp__day {
  position: relative;
  display: grid;
  place-items: center;
  width: 100%;
  max-width: 36px;
  height: 32px;
  padding: 0;
  border: 1px solid transparent;
  border-radius: 9px;
  background: transparent;
  color: var(--drp-ink);
  font-size: 13.5px;
  font-variant-numeric: tabular-nums;
  cursor: pointer;
  transition: background-color 150ms var(--drp-ease), color 150ms var(--drp-ease), border-color 150ms var(--drp-ease);
}
.ui-at-drp__day:hover:not([aria-disabled]):not([data-end]) { background: var(--drp-panel); border-color: var(--drp-firm); }
.ui-at-drp__day[aria-disabled] { color: var(--drp-faint); cursor: default; }
.ui-at-drp__day[data-cmp-end] { border-color: var(--drp-firm); background: var(--drp-panel); }
.ui-at-drp__day[data-end] {
  background: var(--drp-info-ink);
  border-color: var(--drp-info-ink);
  color: var(--drp-end-ink);
  font-weight: 700;
  box-shadow: var(--drp-drop);
}
.ui-at-drp__day[data-today]::after {
  content: "";
  position: absolute;
  bottom: 3px;
  left: 50%;
  width: 4px;
  height: 4px;
  margin-left: -2px;
  border-radius: 999px;
  background: var(--drp-berry);
}
.ui-at-drp__day[data-today][data-end]::after { background: currentColor; }

.ui-at-drp__foot {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 8px 4px 10px;
}
.ui-at-drp__summary { display: grid; gap: 8px; min-width: 0; }
.ui-at-drp__sum-line { display: flex; align-items: baseline; flex-wrap: wrap; gap: 4px 10px; margin: 0; }
.ui-at-drp__sum-line strong { font-weight: 600; }
.ui-at-drp__muted { color: var(--drp-muted); font-size: 12.5px; }
.ui-at-drp__cmp-row { display: flex; align-items: center; flex-wrap: wrap; gap: 6px 10px; }
.ui-at-drp__seg {
  display: inline-flex;
  padding: 3px;
  gap: 2px;
  background: var(--drp-panel);
  border: 1px solid var(--drp-line);
  border-radius: 10px;
  box-shadow: var(--drp-drop);
}
.ui-at-drp__seg-opt {
  padding: 4px 9px;
  border: 1px solid transparent;
  border-radius: 7px;
  background: transparent;
  color: var(--drp-muted);
  font-size: 12.5px;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 150ms var(--drp-ease), color 150ms var(--drp-ease);
}
.ui-at-drp__seg-opt:hover { color: var(--drp-ink); }
.ui-at-drp__seg-opt[aria-checked="true"] {
  background: var(--drp-info-fill);
  border-color: var(--drp-info-line);
  color: var(--drp-info-ink);
  font-weight: 600;
}
.ui-at-drp__cmp-line { display: flex; align-items: center; gap: 8px; margin: 0; font-size: 12.5px; color: var(--drp-muted); }
.ui-at-drp__swatch { width: 16px; height: 8px; border-radius: 4px; background: var(--drp-soft); border: 1px solid var(--drp-firm); }
.ui-at-drp__cmp-line[data-off] .ui-at-drp__swatch { opacity: 0.4; }
.ui-at-drp__actions { display: flex; gap: 8px; flex: none; }
.ui-at-drp__btn {
  height: 38px;
  padding: 0 16px;
  border-radius: 10px;
  border: 1px solid transparent;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 150ms var(--drp-ease), transform 150ms var(--drp-ease);
}
.ui-at-drp__btn--ghost { background: transparent; color: var(--drp-text); }
.ui-at-drp__btn--ghost:hover { background: var(--drp-soft); color: var(--drp-ink); }
.ui-at-drp__btn--main { background: var(--drp-berry); color: #ffffff; box-shadow: var(--drp-main-shadow); }
.ui-at-drp__btn--main:hover { background: var(--drp-berry-hover); }
.ui-at-drp__btn--main:active { transform: translateY(1px); }

.ui-at-drp__sr {
  position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; border: 0;
  overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap;
}

/* Phones: presets become chips, one month, stacked footer. */
.ui-at-drp[data-narrow] .ui-at-drp__sheet { grid-template-columns: 1fr; }
.ui-at-drp[data-narrow] .ui-at-drp__presets {
  flex-direction: row;
  gap: 6px;
  padding: 8px;
  overflow-x: auto;
  border-right: 0;
  border-bottom: 1px solid var(--drp-line);
  scrollbar-width: none;
}
.ui-at-drp[data-narrow] .ui-at-drp__preset { width: auto; flex: none; border-color: var(--drp-line); border-radius: 999px; padding: 6px 12px; }
.ui-at-drp[data-narrow] .ui-at-drp__preset::before { display: none; }
.ui-at-drp[data-narrow] .ui-at-drp__preset--custom:not([data-on]) { display: none; }
.ui-at-drp[data-narrow] .ui-at-drp__months { padding: 8px 10px 12px; }
.ui-at-drp[data-narrow] .ui-at-drp__foot { flex-direction: column; align-items: stretch; }
.ui-at-drp[data-narrow] .ui-at-drp__actions { justify-content: flex-end; }
.ui-at-drp[data-narrow] .ui-at-drp__panel { left: 0; }

@media (pointer: coarse) {
  .ui-at-drp__cell { height: 42px; }
  .ui-at-drp__day { height: 40px; max-width: 44px; font-size: 15px; }
  .ui-at-drp__btn { height: 44px; }
  .ui-at-drp__nav { width: 36px; height: 36px; }
}

@keyframes ui-at-drp-open { from { opacity: 0; transform: translateY(-4px) scale(0.97); } }
@keyframes ui-at-drp-in { from { opacity: 0.4; } }
@keyframes ui-at-drp-from-right { from { opacity: 0; transform: translateX(18px); } }
@keyframes ui-at-drp-from-left { from { opacity: 0; transform: translateX(-18px); } }

@media (prefers-reduced-motion: reduce) {
  .ui-at-drp *, .ui-at-drp *::before, .ui-at-drp *::after {
    animation: none !important;
    transition-property: background-color, border-color, color, opacity !important;
  }
}
`;function kt(){return r("div",{style:{width:"100%",maxWidth:664,minHeight:540,paddingTop:4},children:r(ze,{today:new Date(2026,9,21),defaultOpen:!0})})}export{kt as default};
