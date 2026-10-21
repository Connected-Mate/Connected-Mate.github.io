import{t as nt}from"./react-BkAXpnfr.js";var rt=nt();var{Children:Nt,Component:Dt,Fragment:Mt,StrictMode:St,cloneElement:Ct,createContext:Lt,createElement:Et,createRef:Rt,forwardRef:It,isValidElement:Tt,lazy:At,memo:$t,startTransition:zt,Suspense:Bt,use:Ut,useCallback:Pt,useContext:Ft,useDebugValue:Ot,useDeferredValue:Ht,useEffect:T,useId:L,useImperativeHandle:jt,useInsertionEffect:Kt,useLayoutEffect:Vt,useMemo:Yt,useOptimistic:Wt,useReducer:qt,useRef:C,useState:N,useSyncExternalStore:Gt,useTransition:Jt}=rt;import{t as ot}from"./jsx-runtime-CTsRTJUX.js";var ut=ot(),{jsx:t,jsxs:i,Fragment:A}=ut;var lt=[{name:"Set-up fee",repeat:"once",price:4999},{name:"Platform licence",repeat:"monthly",price:1200},{name:"Premium support",repeat:"monthly",price:350},{name:"Extra seats (10)",repeat:"monthly",price:240},{name:"Onboarding workshop",repeat:"once",price:1500}],dt=[{id:"setup",kind:"product",name:"Set-up fee",repeat:"once",price:4999}],Y=[{id:"milestone",label:"Milestone"},{id:1,label:"1 month"},{id:3,label:"3 months"},{id:6,label:"6 months"},{id:12,label:"12 months"}],bt=0,F=()=>`line-${Date.now().toString(36)}-${++bt}`,z=n=>n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});function W(n){let s=n.replace(/[\s,]/g,"");if(!/^\d+(\.\d{0,2})?$|^\.\d{1,2}$/.test(s))return null;let o=Number(s);return Number.isFinite(o)?o:null}function pt(n){let s=/^(\d{4})-(\d{2})-(\d{2})$/.exec(n);if(!s)return null;let o=new Date(Date.UTC(+s[1],+s[2]-1,+s[3]));return Number.isNaN(o.getTime())?null:o}var q=n=>n.toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric",timeZone:"UTC"});function ct(n,s){let o=new Date(Date.UTC(n.getUTCFullYear(),n.getUTCMonth()+s,n.getUTCDate()));return o.setUTCDate(o.getUTCDate()-1),o}function mt(n,s){let o=s==="milestone"?1:s,g=0,v=0,m=0,y=0;for(let b of n)b.kind==="product"?b.repeat==="once"?g+=b.price:v+=b.price:b.kind==="discount"?m=Math.min(100,Math.max(0,b.percent)):y=Math.max(0,b.amount);let w=1-m/100,f=(g+v)*w,_=(g+v*o)*w,x=y>0&&y>_;return{firstInvoice:f,phaseTotal:x?y:_,minimumApplies:x}}var D=(n,s=14)=>t("svg",{viewBox:"0 0 16 16",width:s,height:s,"aria-hidden":"true",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round",children:n}),ft=()=>D(t("path",{d:"M8 3.5v9M3.5 8h9"})),G=()=>D(i(A,{children:[t("circle",{cx:"8",cy:"8",r:"5.5"}),t("path",{d:"M5.8 10.2 10.2 5.8"}),t("circle",{cx:"6",cy:"6",r:".6",fill:"currentColor"}),t("circle",{cx:"10",cy:"10",r:".6",fill:"currentColor"})]})),J=()=>D(t("path",{d:"M3 13h10M5 10.5h6M8 3v5M6.2 6.2 8 8l1.8-1.8"})),_t=()=>D(t("path",{d:"M3 7V6a2 2 0 0 1 2-2h7m-2-2 2 2-2 2M13 9v1a2 2 0 0 1-2 2H4m2 2-2-2 2-2"})),ht=()=>D(i(A,{children:[t("circle",{cx:"8",cy:"8",r:"5.5"}),t("path",{d:"M8 5.5V8l1.6 1.6"})]})),gt=()=>D(t("path",{d:"m4.5 6.5 3.5 3.5 3.5-3.5"}),13),xt=()=>D(t("path",{d:"m4.5 4.5 7 7m0-7-7 7"}),13),vt=()=>D(t("path",{d:"m3.5 8.3 3 3 6-6.6"}),13);function Z({label:n,options:s,selected:o,onSelect:g,className:v,children:m,align:y="start",buttonRef:w}){let f=L(),_=C(null),x=C(null),b=w??x,h=C(null),[p,c]=N(!1),[k,r]=N(0),M=e=>{let l=e??Math.max(0,s.findIndex($=>$.id===o));r(l),c(!0)},d=(e=!0)=>{c(!1),e&&b.current?.focus()};T(()=>{if(!p)return;h.current?.focus();let e=l=>{_.current&&!_.current.contains(l.target)&&c(!1)};return document.addEventListener("pointerdown",e),()=>document.removeEventListener("pointerdown",e)},[p]),T(()=>{p&&h.current?.querySelector(`[data-index="${k}"]`)?.scrollIntoView?.({block:"nearest"})},[p,k]);let E=e=>{(e.key==="ArrowDown"||e.key==="ArrowUp")&&(e.preventDefault(),M(e.key==="ArrowUp"?s.length-1:void 0))},B=e=>{if(e.key==="ArrowDown")e.preventDefault(),r(l=>Math.min(s.length-1,l+1));else if(e.key==="ArrowUp")e.preventDefault(),r(l=>Math.max(0,l-1));else if(e.key==="Home")e.preventDefault(),r(0);else if(e.key==="End")e.preventDefault(),r(s.length-1);else if(e.key==="Enter"||e.key===" "){e.preventDefault();let l=s[k];l&&(d(),g(l.id))}else e.key==="Escape"?(e.preventDefault(),e.stopPropagation(),d()):e.key==="Tab"&&c(!1)};return i("div",{className:"ui-at-bs__menu",ref:_,children:[t("button",{ref:b,type:"button",className:v,"aria-haspopup":"listbox","aria-expanded":p,"aria-controls":p?`${f}-list`:void 0,"aria-label":n,onClick:()=>p?d(!1):M(),onKeyDown:E,children:m}),p&&t("ul",{ref:h,id:`${f}-list`,role:"listbox",tabIndex:-1,"aria-label":n,"aria-activedescendant":`${f}-o${k}`,className:"ui-at-bs__list","data-align":y,onKeyDown:B,children:s.map((e,l)=>i("li",{id:`${f}-o${l}`,"data-index":l,role:"option","aria-selected":e.id===o,"data-active":l===k?"":void 0,className:"ui-at-bs__opt",onPointerMove:()=>r(l),onClick:()=>{d(),g(e.id)},children:[t("span",{className:"ui-at-bs__opt-label",children:e.label}),e.detail&&t("span",{className:"ui-at-bs__opt-detail",children:e.detail}),e.id===o&&t(vt,{})]},e.id))})]})}function O({value:n,onCommit:s,label:o,prefix:g,suffix:v,max:m,decimals:y=2}){let w=L(),f=r=>y===0?`${Math.round(r)}`:z(r),[_,x]=N(()=>f(n)),[b,h]=N(!1),p=W(_),c=p===null||m!==void 0&&p>m;T(()=>{b||x(f(n))},[n,b]);let k=()=>x(f(n));return i("span",{className:"ui-at-bs__amount","data-invalid":c?"":void 0,children:[g&&t("span",{className:"ui-at-bs__affix","aria-hidden":"true",children:g}),t("input",{className:"ui-at-bs__amount-input",inputMode:"decimal",autoComplete:"off","aria-label":o,"aria-invalid":c||void 0,"aria-describedby":c?w:void 0,value:_,size:Math.max(3,_.length),onFocus:r=>{h(!0),r.currentTarget.select()},onBlur:()=>{h(!1),k()},onChange:r=>{let M=r.target.value;x(M);let d=W(M);d!==null&&(m===void 0||d<=m)&&s(d)},onKeyDown:r=>{r.key==="Enter"?(r.preventDefault(),k()):r.key==="Escape"&&x(f(n))}}),v&&t("span",{className:"ui-at-bs__affix ui-at-bs__affix--after","aria-hidden":"true",children:v}),c&&t("span",{id:w,className:"ui-at-bs__sr",children:m!==void 0?`Enter a number from 0 to ${m}`:"Enter an amount, like 1200.00"})]})}function Q({title:n="Create a billing schedule",phase:s="Build-out phase",currency:o="$",catalog:g=lt,defaultLines:v=dt,defaultStart:m="2026-01-01",defaultDuration:y="milestone",onChange:w,className:f}){let _=L(),x=L(),b=L(),[h,p]=N(s),[c,k]=N(m),[r,M]=N(y),[d,E]=N(v),[B,e]=N(null),l=C(null),$=C(w);$.current=w;let H=C(!1);T(()=>{if(!H.current){H.current=!0;return}$.current?.({phase:h,start:c,duration:r,lines:d})},[h,c,r,d]);let R=pt(c),j=r==="milestone"?"Milestone":R?q(ct(R,r)):`${r} months`,{firstInvoice:X,phaseTotal:tt,minimumApplies:K}=mt(d,r),at=d.some(a=>a.kind==="discount"),et=d.some(a=>a.kind==="minimum"),it=Y.find(a=>a.id===r)?.label??"Milestone",U=a=>{E(u=>{if(a.kind!=="product")return[...u,a];let S=u.findIndex(I=>I.kind!=="product");return S<0?[...u,a]:[...u.slice(0,S),a,...u.slice(S)]}),e(a.id)},P=(a,u)=>E(S=>S.map(I=>I.id===a?{...I,...u}:I)),st=a=>{E(u=>u.filter(S=>S.id!==a)),l.current?.focus()},V=a=>a.kind==="product"?a.name:a.kind==="discount"?"Discount":"Minimum commitment";return i("section",{className:["ui-at-bs",f].filter(Boolean).join(" "),"aria-labelledby":_,children:[t("style",{href:"ui-billing-schedule",precedence:"default",children:yt}),t("h3",{className:"ui-at-bs__title",id:_,children:n}),i("div",{className:"ui-at-bs__panel",children:[i("div",{className:"ui-at-bs__summary",children:[t("input",{className:"ui-at-bs__phase","aria-label":"Phase name",value:h,placeholder:"Phase name",maxLength:80,size:Math.max(8,h.length||10),onChange:a=>p(a.target.value),onBlur:()=>!h.trim()&&p(s)}),i("span",{className:"ui-at-bs__range",children:[t("span",{children:R?q(R):"No start date"}),t("span",{"aria-hidden":"true",children:"\u2192"}),t("span",{className:"ui-at-bs__end",children:j},j)]})]}),i("div",{className:"ui-at-bs__fields",children:[i("div",{className:"ui-at-bs__field",children:[t("label",{htmlFor:x,children:"Start date"}),t("input",{id:x,className:"ui-at-bs__input",type:"date",value:c,required:!0,"aria-invalid":!R||void 0,onChange:a=>k(a.target.value)})]}),i("div",{className:"ui-at-bs__field",children:[t("span",{id:b,children:"Duration"}),i(Z,{label:"Duration",options:Y.map(a=>({id:String(a.id),label:a.label})),selected:String(r),onSelect:a=>M(a==="milestone"?"milestone":Number(a)),className:"ui-at-bs__input ui-at-bs__select",children:[t("span",{children:it}),t(gt,{})]})]})]}),t("div",{className:"ui-at-bs__table-wrap",children:i("table",{className:"ui-at-bs__table",children:[i("caption",{className:"ui-at-bs__sr",children:["Lines of the ",h||"phase"]}),t("thead",{children:i("tr",{children:[t("th",{scope:"col",children:"Name"}),t("th",{scope:"col",className:"ui-at-bs__col-repeat",children:"Repeats"}),t("th",{scope:"col",className:"ui-at-bs__col-price",children:"Price"}),t("th",{scope:"col",className:"ui-at-bs__col-act",children:t("span",{className:"ui-at-bs__sr",children:"Remove"})})]})}),i("tbody",{children:[d.length===0&&t("tr",{children:t("td",{colSpan:4,className:"ui-at-bs__empty",children:"No lines yet \u2013 add a product to start the phase."})}),d.map(a=>i("tr",{"data-kind":a.kind,"data-fresh":B===a.id?"":void 0,children:[t("th",{scope:"row",className:"ui-at-bs__name",children:i("span",{className:"ui-at-bs__name-in",children:[a.kind!=="product"&&t("span",{className:"ui-at-bs__pebble","aria-hidden":"true",children:a.kind==="discount"?t(G,{}):t(J,{})}),t("span",{children:V(a)})]})}),t("td",{className:"ui-at-bs__col-repeat",children:a.kind==="product"?i("span",{className:"ui-at-bs__repeat",children:[a.repeat==="once"?t(ht,{}):t(_t,{}),a.repeat==="once"?"Once":"Monthly"]}):t("span",{className:"ui-at-bs__muted",children:"Whole phase"})}),i("td",{className:"ui-at-bs__col-price",children:[a.kind==="product"&&i(A,{children:[t(O,{label:`Price of ${a.name}`,value:a.price,prefix:o,suffix:a.repeat==="once"?"/ once":"/ month",onCommit:u=>P(a.id,{price:u})}),t("span",{className:"ui-at-bs__note",children:"Billed in advance"})]}),a.kind==="discount"&&t(O,{label:"Discount in percent",value:a.percent,decimals:0,max:100,suffix:"% off",onCommit:u=>P(a.id,{percent:u})}),a.kind==="minimum"&&i(A,{children:[t(O,{label:"Minimum commitment for the phase",value:a.amount,prefix:o,suffix:"min.",onCommit:u=>P(a.id,{amount:u})}),t("span",{className:"ui-at-bs__note",children:K?"Applies to this phase":"Not reached \u2013 no effect"})]})]}),t("td",{className:"ui-at-bs__col-act",children:t("button",{type:"button",className:"ui-at-bs__remove","aria-label":`Remove ${V(a)}`,onClick:()=>st(a.id),children:t(xt,{})})})]},a.id))]})]})}),i("div",{className:"ui-at-bs__actions",children:[i(Z,{label:"Add product",options:g.map((a,u)=>({id:String(u),label:a.name,detail:`${o}${z(a.price)} \xB7 ${a.repeat==="once"?"once":"monthly"}`})),onSelect:a=>{let u=g[Number(a)];u&&U({id:F(),kind:"product",name:u.name,repeat:u.repeat,price:u.price})},className:"ui-at-bs__button",buttonRef:l,children:[t(ft,{}),t("span",{children:"Add product"})]}),t("span",{className:"ui-at-bs__spacer"}),i("button",{type:"button",className:"ui-at-bs__button",disabled:at,onClick:()=>U({id:F(),kind:"discount",percent:10}),children:[t(G,{}),t("span",{children:"Add discount"})]}),i("button",{type:"button",className:"ui-at-bs__button",disabled:et,onClick:()=>U({id:F(),kind:"minimum",amount:1e4}),children:[t(J,{}),t("span",{children:"Add minimum"})]})]})]}),i("footer",{className:"ui-at-bs__totals",role:"status","aria-live":"polite",children:[i("span",{children:["First invoice ",i("strong",{children:[o,z(X)]})]}),i("span",{children:["Phase total ",i("strong",{children:[o,z(tt)]}),K&&t("em",{children:" minimum applies"})]})]})]})}var yt=`
.ui-at-bs {
  --ui-at-bs-frame: #f2f6fa;
  --ui-at-bs-panel: #ffffff;
  --ui-at-bs-pale: #fbfcfe;
  --ui-at-bs-soft: rgba(26, 62, 112, 0.06);
  --ui-at-bs-line: #dae2ec;
  --ui-at-bs-firm: #cbd6e4;
  --ui-at-bs-ink: #00162b;
  --ui-at-bs-text: rgba(0, 22, 43, 0.66);
  --ui-at-bs-muted: rgba(0, 22, 43, 0.54);
  --ui-at-bs-berry: #851437;
  --ui-at-bs-ring: #8fbdf2;
  --ui-at-bs-info-ink: #1a3e70;
  --ui-at-bs-info-fill: #eef5ff;
  --ui-at-bs-bad-ink: #8a3a22;
  --ui-at-bs-bad-fill: #fdeee8;
  --ui-at-bs-bad-line: #f5d5c9;
  --ui-at-bs-inner: inset 0 1px 2px rgba(26, 62, 112, 0.08);
  --ui-at-bs-pebble-shade: inset 0 -2px 6px -4px rgba(26, 62, 112, 0.4);
  --ui-at-bs-drop: 0 8px 16px -8px rgba(26, 62, 112, 0.2);
  --ui-at-bs-short: 0 2px 4px -2px rgba(26, 62, 112, 0.18);
  --ui-at-bs-raised: 0 18px 30px -16px rgba(26, 62, 112, 0.38), 0 4px 10px -6px rgba(26, 62, 112, 0.18);
  --ui-at-bs-floating: 0 24px 48px -24px rgba(26, 62, 112, 0.3);
  --ui-at-bs-ease: cubic-bezier(0.16, 1, 0.3, 1);

  container-type: inline-size;
  box-sizing: border-box;
  width: 100%;
  max-width: 560px;
  padding: 6px;
  border-radius: 22px;
  background: var(--ui-at-bs-frame);
  border: 1px solid var(--ui-at-bs-line);
  box-shadow: var(--ui-at-bs-floating);
  color: var(--ui-at-bs-ink);
  font-family: "Avenir Next", Avenir, system-ui, sans-serif;
  font-size: 13px;
  line-height: 1.4;
  -webkit-font-smoothing: antialiased;
}
:where(.dark, [data-theme="dark"]) .ui-at-bs {
  --ui-at-bs-frame: #0f2747;
  --ui-at-bs-panel: #16345c;
  --ui-at-bs-pale: #1d416f;
  --ui-at-bs-soft: rgba(255, 255, 255, 0.07);
  --ui-at-bs-line: rgba(255, 255, 255, 0.12);
  --ui-at-bs-firm: rgba(255, 255, 255, 0.18);
  --ui-at-bs-ink: rgba(255, 255, 255, 0.94);
  --ui-at-bs-text: rgba(255, 255, 255, 0.72);
  --ui-at-bs-muted: rgba(255, 255, 255, 0.56);
  --ui-at-bs-berry: #a8204d;
  --ui-at-bs-ring: rgba(143, 189, 242, 0.6);
  --ui-at-bs-info-ink: #c1daff;
  --ui-at-bs-info-fill: rgba(143, 189, 242, 0.16);
  --ui-at-bs-bad-ink: #f2a48c;
  --ui-at-bs-bad-fill: rgba(242, 164, 140, 0.14);
  --ui-at-bs-bad-line: rgba(242, 164, 140, 0.4);
  --ui-at-bs-inner: inset 0 1px 2px rgba(3, 12, 28, 0.4);
  --ui-at-bs-pebble-shade: inset 0 -2px 6px -4px rgba(3, 12, 28, 0.8);
  --ui-at-bs-drop: 0 8px 16px -8px rgba(3, 12, 28, 0.6);
  --ui-at-bs-short: 0 2px 4px -2px rgba(3, 12, 28, 0.6);
  --ui-at-bs-raised: 0 18px 30px -16px rgba(3, 12, 28, 0.8), 0 4px 10px -6px rgba(3, 12, 28, 0.6);
  --ui-at-bs-floating: 0 24px 48px -24px rgba(3, 12, 28, 0.7);
}

.ui-at-bs__title {
  margin: 0;
  padding: 10px 12px 8px;
  font-family: "Avenir Next Condensed", "Avenir Next", Avenir, system-ui, sans-serif;
  font-size: 17px;
  font-weight: 700;
  line-height: 1.2;
}
.ui-at-bs__panel {
  padding: 12px;
  border-radius: 16px;
  background: var(--ui-at-bs-panel);
  border: 1px solid var(--ui-at-bs-line);
  box-shadow: var(--ui-at-bs-raised);
}

.ui-at-bs__summary {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 14px;
  padding: 0 2px 10px;
}
.ui-at-bs__phase {
  min-width: 0;
  max-width: 100%;
  margin: 0 -6px;
  padding: 3px 6px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: transparent;
  color: var(--ui-at-bs-ink);
  caret-color: var(--ui-at-bs-berry);
  font: inherit;
  font-size: 14px;
  font-weight: 500;
  transition: border-color 150ms var(--ui-at-bs-ease), background-color 150ms var(--ui-at-bs-ease);
}
.ui-at-bs__phase:hover { border-color: var(--ui-at-bs-line); }
.ui-at-bs__phase:focus { outline: none; border-color: var(--ui-at-bs-firm); background: var(--ui-at-bs-pale); box-shadow: 0 0 0 3px var(--ui-at-bs-ring); }
.ui-at-bs__range {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--ui-at-bs-muted);
  white-space: nowrap;
}
.ui-at-bs__end { animation: ui-at-bs-fade 300ms var(--ui-at-bs-ease) both; }

.ui-at-bs__fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  padding: 10px;
  border-radius: 12px;
  background: var(--ui-at-bs-soft);
}
.ui-at-bs__field { display: grid; gap: 5px; min-width: 0; }
.ui-at-bs__field > label, .ui-at-bs__field > span { color: var(--ui-at-bs-muted); font-size: 12px; }
.ui-at-bs__menu { position: relative; min-width: 0; }
.ui-at-bs__input {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  height: 38px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid var(--ui-at-bs-firm);
  background: var(--ui-at-bs-panel);
  box-shadow: var(--ui-at-bs-inner);
  color: var(--ui-at-bs-ink);
  caret-color: var(--ui-at-bs-berry);
  font: inherit;
  font-size: 13px;
  color-scheme: light;
  transition: border-color 150ms var(--ui-at-bs-ease), box-shadow 150ms var(--ui-at-bs-ease);
}
:where(.dark, [data-theme="dark"]) .ui-at-bs__input { color-scheme: dark; }
.ui-at-bs__input:focus, .ui-at-bs__input:focus-visible { outline: none; box-shadow: var(--ui-at-bs-inner), 0 0 0 3px var(--ui-at-bs-ring); }
.ui-at-bs__input[aria-invalid="true"] { border-color: var(--ui-at-bs-bad-line); background: var(--ui-at-bs-bad-fill); }
.ui-at-bs__select { cursor: pointer; text-align: left; }
.ui-at-bs__select > span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ui-at-bs__select svg { flex: none; color: var(--ui-at-bs-muted); transition: transform 150ms var(--ui-at-bs-ease); }
.ui-at-bs__select[aria-expanded="true"] svg { transform: rotate(180deg); }

.ui-at-bs__list {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  z-index: 20;
  box-sizing: border-box;
  min-width: 100%;
  max-height: 260px;
  margin: 0;
  padding: 4px;
  overflow-y: auto;
  list-style: none;
  border-radius: 12px;
  background: var(--ui-at-bs-panel);
  border: 1px solid var(--ui-at-bs-firm);
  box-shadow: var(--ui-at-bs-floating), var(--ui-at-bs-drop);
  outline: none;
  transform-origin: top left;
  animation: ui-at-bs-scale 150ms var(--ui-at-bs-ease) both;
}
.ui-at-bs__list[data-align="end"] { left: auto; right: 0; transform-origin: top right; }
.ui-at-bs__list:focus-visible { box-shadow: var(--ui-at-bs-floating), 0 0 0 3px var(--ui-at-bs-ring); }
.ui-at-bs__opt {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  column-gap: 12px;
  padding: 7px 10px;
  border-radius: 8px;
  cursor: pointer;
  white-space: nowrap;
}
.ui-at-bs__opt[data-active] { background: var(--ui-at-bs-info-fill); }
.ui-at-bs__opt[aria-selected="true"] { color: var(--ui-at-bs-info-ink); font-weight: 600; }
.ui-at-bs__opt svg { grid-column: 2; grid-row: 1; color: var(--ui-at-bs-info-ink); }
.ui-at-bs__opt-label { overflow: hidden; text-overflow: ellipsis; }
.ui-at-bs__opt-detail { grid-column: 1 / -1; color: var(--ui-at-bs-muted); font-size: 11.5px; }

.ui-at-bs__table-wrap { margin-top: 6px; }
.ui-at-bs__table { width: 100%; border-collapse: collapse; table-layout: fixed; }
.ui-at-bs__table th, .ui-at-bs__table td { padding: 0 6px; text-align: left; vertical-align: middle; }
.ui-at-bs__table thead th {
  height: 38px;
  border-bottom: 1px solid var(--ui-at-bs-line);
  color: var(--ui-at-bs-muted);
  font-size: 12px;
  font-weight: 500;
}
.ui-at-bs__table tbody tr { border-bottom: 1px solid var(--ui-at-bs-line); }
.ui-at-bs__table tbody tr[data-fresh] { animation: ui-at-bs-slide 300ms var(--ui-at-bs-ease) both; }
.ui-at-bs__table tbody td, .ui-at-bs__table tbody th { height: 56px; padding-top: 8px; padding-bottom: 8px; }
.ui-at-bs__col-repeat { width: 26%; }
.ui-at-bs__col-price { width: 40%; text-align: right !important; }
.ui-at-bs__col-act { width: 34px; text-align: right !important; padding-right: 0 !important; }
.ui-at-bs__name { font-weight: 500; overflow-wrap: anywhere; }
.ui-at-bs__name-in { display: flex; align-items: center; gap: 8px; min-width: 0; }
.ui-at-bs__pebble {
  display: inline-grid;
  place-items: center;
  flex: none;
  width: 24px;
  height: 24px;
  border-radius: 8px;
  background: var(--ui-at-bs-panel);
  border: 1px solid var(--ui-at-bs-line);
  box-shadow: var(--ui-at-bs-pebble-shade);
  color: var(--ui-at-bs-info-ink);
}
.ui-at-bs__repeat { display: inline-flex; align-items: center; gap: 6px; color: var(--ui-at-bs-text); }
.ui-at-bs__repeat svg { color: var(--ui-at-bs-muted); }
.ui-at-bs__muted { color: var(--ui-at-bs-muted); }
.ui-at-bs__note { display: block; margin-top: 2px; color: var(--ui-at-bs-muted); font-size: 12px; }
.ui-at-bs__empty { height: 64px; color: var(--ui-at-bs-muted); text-align: center !important; }

.ui-at-bs__amount {
  display: inline-flex;
  align-items: baseline;
  justify-content: flex-end;
  gap: 5px;
  max-width: 100%;
}
.ui-at-bs__affix { color: var(--ui-at-bs-text); white-space: nowrap; }
.ui-at-bs__affix--after { color: var(--ui-at-bs-muted); font-size: 12px; }
.ui-at-bs__amount-input {
  min-width: 2.5em;
  max-width: 9em;
  padding: 2px 6px;
  margin: -3px -2px;
  border: 1px solid transparent;
  border-radius: 7px;
  background: transparent;
  color: var(--ui-at-bs-ink);
  caret-color: var(--ui-at-bs-berry);
  font: inherit;
  font-size: 13.5px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  text-align: right;
  transition: border-color 150ms var(--ui-at-bs-ease), background-color 150ms var(--ui-at-bs-ease);
}
.ui-at-bs__amount-input:hover { border-color: var(--ui-at-bs-line); }
.ui-at-bs__amount-input:focus { outline: none; border-color: var(--ui-at-bs-firm); background: var(--ui-at-bs-pale); box-shadow: 0 0 0 3px var(--ui-at-bs-ring); }
.ui-at-bs__amount[data-invalid] .ui-at-bs__amount-input { border-color: var(--ui-at-bs-bad-line); background: var(--ui-at-bs-bad-fill); color: var(--ui-at-bs-bad-ink); }

.ui-at-bs__remove {
  display: inline-grid;
  place-items: center;
  width: 26px;
  height: 26px;
  padding: 0;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--ui-at-bs-muted);
  cursor: pointer;
  opacity: 0;
  transition: opacity 150ms var(--ui-at-bs-ease), background-color 150ms var(--ui-at-bs-ease), color 150ms var(--ui-at-bs-ease);
}
.ui-at-bs__table tbody tr:hover .ui-at-bs__remove, .ui-at-bs__table tbody tr:focus-within .ui-at-bs__remove { opacity: 1; }
.ui-at-bs__remove:hover { background: var(--ui-at-bs-bad-fill); color: var(--ui-at-bs-bad-ink); }
.ui-at-bs__remove:focus-visible { opacity: 1; outline: 3px solid var(--ui-at-bs-ring); }
@media (hover: none) { .ui-at-bs__remove { opacity: 1; } }

.ui-at-bs__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding: 8px;
  border-radius: 12px;
  background: var(--ui-at-bs-soft);
}
.ui-at-bs__spacer { flex: 1 1 0; }
.ui-at-bs__button {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 36px;
  padding: 0 13px;
  border-radius: 10px;
  border: 1px solid var(--ui-at-bs-firm);
  background: var(--ui-at-bs-pale);
  color: var(--ui-at-bs-ink);
  box-shadow: var(--ui-at-bs-short);
  font: inherit;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition: border-color 150ms var(--ui-at-bs-ease), opacity 300ms var(--ui-at-bs-ease), transform 150ms var(--ui-at-bs-ease);
}
.ui-at-bs__button svg { color: var(--ui-at-bs-muted); }
.ui-at-bs__button:hover:not(:disabled) { border-color: var(--ui-at-bs-muted); }
.ui-at-bs__button:active:not(:disabled) { transform: translateY(1px); }
.ui-at-bs__button:focus-visible { outline: 3px solid var(--ui-at-bs-ring); outline-offset: 1px; }
.ui-at-bs__button:disabled { cursor: default; opacity: 0.45; box-shadow: none; }

.ui-at-bs__totals {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 4px 16px;
  padding: 10px 10px 6px;
  color: var(--ui-at-bs-muted);
  font-size: 12.5px;
}
.ui-at-bs__totals strong { margin-left: 6px; color: var(--ui-at-bs-ink); font-weight: 600; font-variant-numeric: tabular-nums; }
.ui-at-bs__totals em { font-style: normal; color: var(--ui-at-bs-info-ink); font-size: 12px; }
.ui-at-bs__sr {
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

@container (max-width: 460px) {
  .ui-at-bs__fields { grid-template-columns: 1fr; }
  .ui-at-bs__col-repeat { display: none; }
  .ui-at-bs__col-price { width: 52%; }
  .ui-at-bs__spacer { display: none; }
  .ui-at-bs__actions .ui-at-bs__menu, .ui-at-bs__actions > .ui-at-bs__button { flex: 1 1 auto; }
  .ui-at-bs__actions .ui-at-bs__button { justify-content: center; width: 100%; }
}
@media (pointer: coarse) {
  .ui-at-bs__input, .ui-at-bs__button { height: 42px; }
  .ui-at-bs__remove { width: 34px; height: 34px; }
  .ui-at-bs__opt { padding: 11px 10px; }
}

@keyframes ui-at-bs-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes ui-at-bs-scale { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
@keyframes ui-at-bs-slide { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
@media (prefers-reduced-motion: reduce) {
  .ui-at-bs *, .ui-at-bs *::before, .ui-at-bs *::after {
    animation: none !important;
    transition: none !important;
  }
}
`;function wt(){return t("div",{style:{width:"100%",maxWidth:560},children:t(Q,{phase:"Build-out phase",defaultStart:"2026-01-01",onChange:()=>{}})})}export{wt as default};
