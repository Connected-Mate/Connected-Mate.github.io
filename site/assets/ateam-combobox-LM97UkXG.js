import{t as me}from"./react-BkAXpnfr.js";var he=me();var{Children:Ee,Component:$e,Fragment:Me,StrictMode:Oe,cloneElement:Re,createContext:Pe,createElement:Le,createRef:Te,forwardRef:ze,isValidElement:He,lazy:Be,memo:Se,startTransition:Ae,Suspense:Ie,use:je,useCallback:G,useContext:Ke,useDebugValue:Fe,useDeferredValue:Ve,useEffect:Q,useId:X,useImperativeHandle:Ye,useInsertionEffect:Je,useLayoutEffect:Z,useMemo:P,useOptimistic:Ue,useReducer:We,useRef:M,useState:h,useSyncExternalStore:qe,useTransition:Ge}=he;import{t as ve}from"./jsx-runtime-CTsRTJUX.js";var _e=ve(),{jsx:a,jsxs:p,Fragment:Ze}=_e;var L=r=>r.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().trim();function ke(r){let o=r.trim().split(/\s+/).filter(Boolean),s=o[0]?.[0]??"",C=o.length>1?o[o.length-1][0]:o[0]?.[1]??"";return(s+C).toUpperCase()}function we(r,o){if(!o)return!0;let s=L([r.label,r.hint??"",r.group??"",...r.keywords??[]].join(" "));return L(o).split(/\s+/).every(C=>s.includes(C))}function te({options:r,multiple:o=!0,value:s,defaultValue:C=[],onChange:T,placeholder:z="Search\u2026",creatable:j=!1,onCreate:ae,createLabel:ie=x=>`Create \u201C${x}\u201D`,maxVisibleTags:H,label:w,defaultOpen:re=!1,emptyText:ne="No results",className:oe}){let x=X(),b={label:`${x}-label`,input:`${x}-input`,list:`${x}-list`,status:`${x}-status`,row:e=>`${x}-row-${e}`},[se,K]=h(C),f=s??se,[F,le]=h([]),[l,g]=h(re),[_,O]=h(""),[ce,N]=h(0),[V,D]=h(!1),[pe,Y]=h(""),J=M(null),E=M(null),U=M(null),W=M(null),$=P(()=>{let e=new Set(r.map(t=>t.value));return[...r,...F.filter(t=>!e.has(t.value))]},[r,F]),R=P(()=>new Map($.map(e=>[e.value,e])),[$]),m=f.map(e=>R.get(e)).filter(Boolean),{rows:c,groups:be}=P(()=>{let e=$.filter(v=>we(v,_)),t=[],i=new Map;for(let v of e){let k=v.group??"";i.has(k)||(i.set(k,[]),t.push(k)),i.get(k).push(v)}let n=[],u=[];for(let v of t){let k=i.get(v);u.push({title:v,start:n.length,count:k.length});for(let ge of k)n.push({kind:"option",option:ge,id:b.row(n.length)})}let y=_.trim();return j&&y&&!$.some(v=>L(v.label)===L(y))&&n.push({kind:"create",text:y,id:b.row(n.length)}),{rows:n,groups:u}},[$,_,j,x]),d=c.length?Math.min(ce,c.length-1):-1,B=G((e,t)=>{s===void 0&&K(e),T?.(e,e.map(n=>R.get(n)).filter(Boolean));let i=e.length;Y(`${t}. ${i} selected.`)},[s,T,R]),de=e=>{let t=f.includes(e.value);if(!o){B(t?[]:[e.value],`${t?"Removed":"Picked"} ${e.label}`),O(""),g(!1);return}let i=t?f.filter(n=>n!==e.value):[...f,e.value];B(i,`${t?"Removed":"Added"} ${e.label}`)},ue=e=>{let t=ae?.(e)??{value:e,label:e};le(n=>[...n.filter(u=>u.value!==t.value),t]);let i=o?[...f.filter(n=>n!==t.value),t.value]:[t.value];s===void 0&&K(i),T?.(i,i.map(n=>n===t.value?t:R.get(n)).filter(Boolean)),Y(`Created ${t.label}. ${i.length} selected.`),O(""),o||g(!1)},q=e=>{B(f.filter(t=>t!==e.value),`Removed ${e.label}`),D(!1)},S=e=>{e&&(e.kind==="create"?ue(e.text):de(e.option))};Q(()=>{if(!l)return;let e=t=>{J.current?.contains(t.target)||g(!1)};return document.addEventListener("pointerdown",e),()=>document.removeEventListener("pointerdown",e)},[l]),Z(()=>{let e=U.current,t=W.current;if(!l||!e||!t)return;let i=d>=0?e.querySelector(`#${CSS.escape(b.row(d))}`):null;if(!i){t.style.opacity="0";return}t.style.opacity="1",t.style.transform=`translateY(${i.offsetTop}px)`,t.style.height=`${i.offsetHeight}px`;let n=i.offsetTop,u=n+i.offsetHeight;n<e.scrollTop+4?e.scrollTop=Math.max(0,n-30):u>e.scrollTop+e.clientHeight&&(e.scrollTop=u-e.clientHeight+6)},[d,l,c]);let xe=e=>{switch(e.key!=="Backspace"&&D(!1),e.key){case"ArrowDown":case"ArrowUp":{if(e.preventDefault(),!l){g(!0);return}if(!c.length)return;let t=e.key==="ArrowDown"?1:-1;N((d+t+c.length)%c.length);return}case"Home":case"End":l&&c.length&&!_&&(e.preventDefault(),N(e.key==="Home"?0:c.length-1));return;case"Enter":l&&d>=0?(e.preventDefault(),S(c[d])):l||(e.preventDefault(),g(!0));return;case"Escape":l?(e.preventDefault(),g(!1)):_&&(e.preventDefault(),O(""));return;case"Tab":g(!1);return;case"Backspace":{if(_||!m.length)return;e.preventDefault(),V?q(m[m.length-1]):D(!0);return}}},A=H!==void 0&&m.length>H?Math.max(0,H):m.length,I=m.length-A,fe=f.length===0?"Nothing selected":o?`${f.length} selected`:"1 selected";return p("div",{ref:J,className:["ui-at-cbx",oe].filter(Boolean).join(" "),"data-open":l?"":void 0,"data-multiple":o?"":void 0,children:[a("style",{href:"ui-combobox",precedence:"default",children:ye}),w?a("label",{id:b.label,htmlFor:b.input,className:"ui-at-cbx__label",children:w}):null,p("div",{className:"ui-at-cbx__field",onPointerDown:e=>{e.target!==E.current&&(e.target.closest("button")||(e.preventDefault(),E.current?.focus(),g(!0)))},children:[m.slice(0,A).map((e,t)=>p("span",{className:"ui-at-cbx__chip","data-armed":V&&t===m.length-1?"":void 0,children:[a(ee,{option:e,small:!0}),a("span",{className:"ui-at-cbx__chip-text",children:e.label}),a("button",{type:"button",className:"ui-at-cbx__chip-x","aria-label":`Remove ${e.label}`,onPointerDown:i=>i.preventDefault(),onClick:()=>{q(e),E.current?.focus()},children:a("svg",{viewBox:"0 0 12 12","aria-hidden":"true",children:a("path",{d:"M3 3l6 6M9 3l-6 6"})})})]},e.value)),I>0?p("span",{className:"ui-at-cbx__more",title:m.slice(A).map(e=>e.label).join(", "),children:["+",I]},I):null,a("input",{ref:E,id:b.input,className:"ui-at-cbx__input",role:"combobox",type:"text",autoComplete:"off",spellCheck:!1,"aria-expanded":l,"aria-controls":b.list,"aria-autocomplete":"list","aria-labelledby":w?b.label:void 0,"aria-label":w?void 0:z,"aria-activedescendant":l&&d>=0?c[d]?.id:void 0,"aria-describedby":b.status,placeholder:m.length?"":z,value:_,onChange:e=>{O(e.target.value),N(0),g(!0),D(!1)},onKeyDown:xe,onBlur:()=>D(!1)}),a("button",{type:"button",className:"ui-at-cbx__toggle",tabIndex:-1,"aria-label":l?"Close list":"Open list",onPointerDown:e=>e.preventDefault(),onClick:()=>{g(e=>!e),E.current?.focus()},children:a("svg",{viewBox:"0 0 12 12","aria-hidden":"true",children:a("path",{d:"M3 7.5L6 4.5l3 3"})})})]}),p("div",{className:"ui-at-cbx__pop",hidden:!l,children:[p("div",{ref:U,id:b.list,className:"ui-at-cbx__list",role:"listbox","aria-labelledby":w?b.label:void 0,"aria-label":w?void 0:z,"aria-multiselectable":o||void 0,onPointerDown:e=>e.preventDefault(),children:[a("div",{ref:W,className:"ui-at-cbx__glide","aria-hidden":"true"}),be.map((e,t)=>p("div",{role:"group","aria-labelledby":e.title?`${x}-g${t}`:void 0,className:"ui-at-cbx__group",children:[e.title?a("div",{id:`${x}-g${t}`,className:"ui-at-cbx__group-title",role:"presentation",children:e.title}):null,c.slice(e.start,e.start+e.count).map((i,n)=>{let u=e.start+n;if(i.kind!=="option")return null;let y=f.includes(i.option.value);return p("div",{id:i.id,role:"option","aria-selected":y,className:"ui-at-cbx__row","data-active":u===d?"":void 0,onPointerMove:()=>u!==d&&N(u),onClick:()=>S(i),children:[a(ee,{option:i.option}),p("span",{className:"ui-at-cbx__row-text",children:[a("span",{className:"ui-at-cbx__row-label",children:i.option.label}),i.option.hint?a("span",{className:"ui-at-cbx__row-hint",children:i.option.hint}):null]}),y?a("svg",{className:"ui-at-cbx__check",viewBox:"0 0 16 16","aria-hidden":"true",children:a("path",{d:"M3.5 8.5l3 3 6-7"})}):null]},i.option.value)})]},e.title||`g${t}`)),c.map((e,t)=>e.kind==="create"?p("div",{id:e.id,role:"option","aria-selected":!1,className:"ui-at-cbx__row ui-at-cbx__row--create","data-active":t===d?"":void 0,onPointerMove:()=>t!==d&&N(t),onClick:()=>S(e),children:[a("span",{className:"ui-at-cbx__glyph ui-at-cbx__glyph--plus","aria-hidden":"true",children:a("svg",{viewBox:"0 0 12 12",children:a("path",{d:"M6 2.5v7M2.5 6h7"})})}),a("span",{className:"ui-at-cbx__row-label",children:ie(e.text)})]},"create"):null),c.length===0?a("div",{className:"ui-at-cbx__empty",role:"presentation",children:ne}):null]}),p("div",{className:"ui-at-cbx__foot","aria-hidden":"true",children:[a("span",{className:"ui-at-cbx__count",children:fe},f.length),p("span",{className:"ui-at-cbx__keys",children:[a("kbd",{children:"\u2191"}),a("kbd",{children:"\u2193"})," to move ",a("kbd",{children:"\u21B5"})," to ",o?"toggle":"pick"]})]})]}),a("span",{id:b.status,className:"ui-at-cbx__sr","aria-live":"polite",children:pe})]})}function ee({option:r,small:o}){let s=`ui-at-cbx__glyph${o?" ui-at-cbx__glyph--sm":""}`;return r.icon?a("span",{className:s,"aria-hidden":"true",children:r.icon}):typeof r.avatar=="string"?a("span",{className:s,"aria-hidden":"true",children:a("img",{src:r.avatar,alt:""})}):r.avatar?a("span",{className:s,"aria-hidden":"true",children:ke(r.label)}):r.color?a("span",{className:"ui-at-cbx__dot","aria-hidden":"true",style:{background:r.color}}):null}var ye=`
.ui-at-cbx {
  --cbx-frame: #f2f6fa;
  --cbx-panel: #ffffff;
  --cbx-soft: rgba(26, 62, 112, 0.06);
  --cbx-line: #dae2ec;
  --cbx-firm: #cbd6e4;
  --cbx-ink: #00162b;
  --cbx-text: rgba(0, 22, 43, 0.66);
  --cbx-muted: rgba(0, 22, 43, 0.54);
  --cbx-berry: #851437;
  --cbx-info-ink: #1a3e70;
  --cbx-info-fill: #eef5ff;
  --cbx-info-line: #c1daff;
  --cbx-ring: #8fbdf2;
  --cbx-check: #851437;
  --cbx-danger-ink: #8a3a22;
  --cbx-danger-fill: #fdeee8;
  --cbx-danger-line: #f5d5c9;
  --cbx-field-shade: inset 0 1px 2px rgba(26, 62, 112, 0.07);
  --cbx-pebble: inset 0 -2px 6px -4px rgba(26, 62, 112, 0.4);
  --cbx-drop: 0 8px 16px -8px rgba(26, 62, 112, 0.2);
  --cbx-float: 0 24px 48px -24px rgba(26, 62, 112, 0.3), 0 8px 16px -8px rgba(26, 62, 112, 0.2);
  --cbx-ease: cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  width: 100%;
  max-width: 420px;
  font-family: "Avenir Next", Avenir, system-ui, sans-serif;
  font-size: 14px;
  line-height: 1.35;
  color: var(--cbx-ink);
  -webkit-font-smoothing: antialiased;
}
:where(.dark, [data-theme="dark"]) .ui-at-cbx {
  --cbx-frame: #0f2747;
  --cbx-panel: #16345c;
  --cbx-soft: rgba(255, 255, 255, 0.07);
  --cbx-line: rgba(255, 255, 255, 0.12);
  --cbx-firm: rgba(255, 255, 255, 0.18);
  --cbx-ink: rgba(255, 255, 255, 0.94);
  --cbx-text: rgba(255, 255, 255, 0.72);
  --cbx-muted: rgba(255, 255, 255, 0.56);
  --cbx-berry: #a8204d;
  --cbx-info-ink: #c1daff;
  --cbx-info-fill: rgba(143, 189, 242, 0.16);
  --cbx-info-line: rgba(143, 189, 242, 0.34);
  --cbx-ring: rgba(143, 189, 242, 0.6);
  --cbx-check: #c1daff;
  --cbx-danger-ink: #f2a48c;
  --cbx-danger-fill: rgba(242, 164, 140, 0.14);
  --cbx-danger-line: rgba(242, 164, 140, 0.34);
  --cbx-field-shade: inset 0 1px 2px rgba(3, 12, 28, 0.35);
  --cbx-pebble: inset 0 -2px 6px -4px rgba(3, 12, 28, 0.8);
  --cbx-drop: 0 8px 16px -8px rgba(3, 12, 28, 0.6);
  --cbx-float: 0 24px 48px -24px rgba(3, 12, 28, 0.8), 0 8px 16px -8px rgba(3, 12, 28, 0.6);
}
.ui-at-cbx *, .ui-at-cbx *::before, .ui-at-cbx *::after { box-sizing: border-box; }

.ui-at-cbx__label {
  display: block;
  margin: 0 0 8px 2px;
  font-weight: 600;
  font-size: 13.5px;
  color: var(--cbx-ink);
}

.ui-at-cbx__field {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 5px;
  min-height: 44px;
  padding: 5px 38px 5px 6px;
  position: relative;
  background: var(--cbx-panel);
  border: 1px solid var(--cbx-firm);
  border-radius: 12px;
  box-shadow: var(--cbx-field-shade), var(--cbx-drop);
  cursor: text;
  transition: border-color 150ms var(--cbx-ease), box-shadow 150ms var(--cbx-ease);
}
.ui-at-cbx__field:focus-within {
  border-color: var(--cbx-info-line);
  box-shadow: var(--cbx-field-shade), 0 0 0 3px color-mix(in srgb, var(--cbx-ring) 45%, transparent), var(--cbx-drop);
}

.ui-at-cbx__chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  max-width: 100%;
  min-width: 0;
  height: 28px;
  padding: 0 4px 0 4px;
  background: var(--cbx-info-fill);
  border: 1px solid var(--cbx-info-line);
  border-radius: 8px;
  color: var(--cbx-ink);
  font-size: 13px;
  font-weight: 500;
  animation: ui-at-cbx-pop 220ms var(--cbx-ease);
  transition: background-color 150ms var(--cbx-ease), border-color 150ms var(--cbx-ease);
}
.ui-at-cbx__chip[data-armed] {
  background: var(--cbx-danger-fill);
  border-color: var(--cbx-danger-line);
  color: var(--cbx-danger-ink);
}
.ui-at-cbx__chip-text { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; }
.ui-at-cbx__chip-x {
  display: grid;
  place-items: center;
  flex: none;
  width: 20px;
  height: 20px;
  padding: 0;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--cbx-muted);
  cursor: pointer;
  transition: background-color 150ms var(--cbx-ease), color 150ms var(--cbx-ease);
}
.ui-at-cbx__chip-x:hover { background: var(--cbx-soft); color: var(--cbx-ink); }
.ui-at-cbx__chip-x:focus-visible { outline: 2px solid var(--cbx-ring); outline-offset: 1px; }
.ui-at-cbx__chip-x svg { width: 10px; height: 10px; fill: none; stroke: currentColor; stroke-width: 1.6; stroke-linecap: round; }

.ui-at-cbx__more {
  display: inline-grid;
  place-items: center;
  height: 28px;
  min-width: 34px;
  padding: 0 8px;
  border-radius: 8px;
  background: var(--cbx-soft);
  border: 1px solid var(--cbx-line);
  color: var(--cbx-text);
  font-size: 12.5px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  animation: ui-at-cbx-roll 220ms var(--cbx-ease);
}

.ui-at-cbx__input {
  flex: 1 1 80px;
  min-width: 60px;
  height: 30px;
  padding: 0 6px;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--cbx-ink);
  caret-color: var(--cbx-berry);
  font: inherit;
}
.ui-at-cbx__input::placeholder { color: var(--cbx-muted); }

.ui-at-cbx__toggle {
  position: absolute;
  right: 6px;
  top: 50%;
  translate: 0 -50%;
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--cbx-muted);
  cursor: pointer;
}
.ui-at-cbx__toggle:hover { background: var(--cbx-soft); color: var(--cbx-ink); }
.ui-at-cbx__toggle svg {
  width: 12px; height: 12px; fill: none; stroke: currentColor; stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round;
  rotate: 180deg;
  transition: rotate 150ms var(--cbx-ease);
}
.ui-at-cbx[data-open] .ui-at-cbx__toggle svg { rotate: 0deg; }

/* Popover: matte frame, raised list panel, footer in the frame. */
.ui-at-cbx__pop {
  position: absolute;
  z-index: 30;
  left: 0;
  right: 0;
  top: calc(100% + 6px);
  padding: 5px;
  background: var(--cbx-frame);
  border: 1px solid var(--cbx-line);
  border-radius: 18px;
  box-shadow: var(--cbx-float);
  transform-origin: top center;
  animation: ui-at-cbx-open 180ms var(--cbx-ease);
}
.ui-at-cbx__pop[hidden] { display: none; }
.ui-at-cbx__list {
  position: relative;
  max-height: 300px;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 6px;
  background: var(--cbx-panel);
  border: 1px solid var(--cbx-line);
  border-radius: 13px;
  box-shadow: var(--cbx-drop);
  scrollbar-width: thin;
}
.ui-at-cbx__glide {
  position: absolute;
  left: 6px;
  right: 6px;
  top: 0;
  border-radius: 9px;
  background: var(--cbx-soft);
  pointer-events: none;
  transition: transform 150ms var(--cbx-ease), height 150ms var(--cbx-ease), opacity 150ms var(--cbx-ease);
}
.ui-at-cbx__group + .ui-at-cbx__group { margin-top: 4px; }
.ui-at-cbx__group-title {
  padding: 8px 10px 6px;
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: var(--cbx-muted);
}
.ui-at-cbx__row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 36px;
  padding: 5px 10px;
  border-radius: 9px;
  cursor: pointer;
  user-select: none;
}
.ui-at-cbx__row[aria-selected="true"] { background: color-mix(in srgb, var(--cbx-info-fill) 70%, transparent); }
.ui-at-cbx__row[aria-selected="true"][data-active] { background: var(--cbx-info-fill); box-shadow: inset 0 0 0 1px var(--cbx-info-line); }
.ui-at-cbx__row[aria-selected="true"]::before {
  content: "";
  position: absolute;
  left: 3px;
  top: 9px;
  bottom: 9px;
  width: 2px;
  border-radius: 2px;
  background: var(--cbx-berry);
}
.ui-at-cbx__row-text { display: flex; align-items: baseline; gap: 8px; min-width: 0; flex: 1; }
.ui-at-cbx__row-label { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--cbx-ink); font-weight: 500; }
.ui-at-cbx__row-hint { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--cbx-muted); font-size: 12.5px; }
.ui-at-cbx__row--create .ui-at-cbx__row-label { color: var(--cbx-info-ink); font-weight: 600; }
.ui-at-cbx__check {
  flex: none;
  width: 16px;
  height: 16px;
  fill: none;
  stroke: var(--cbx-check);
  stroke-width: 1.9;
  stroke-linecap: round;
  stroke-linejoin: round;
  animation: ui-at-cbx-check 260ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
.ui-at-cbx__empty { padding: 18px 10px; text-align: center; color: var(--cbx-muted); }

.ui-at-cbx__glyph {
  display: inline-grid;
  place-items: center;
  flex: none;
  width: 26px;
  height: 26px;
  overflow: hidden;
  border-radius: 999px;
  background: var(--cbx-panel);
  border: 1px solid var(--cbx-line);
  box-shadow: var(--cbx-pebble);
  color: var(--cbx-info-ink);
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 0.03em;
}
.ui-at-cbx__glyph img { width: 100%; height: 100%; object-fit: cover; }
.ui-at-cbx__glyph svg { width: 12px; height: 12px; fill: none; stroke: currentColor; stroke-width: 1.6; stroke-linecap: round; }
.ui-at-cbx__glyph--sm { width: 20px; height: 20px; font-size: 8px; }
.ui-at-cbx__glyph--plus { border-radius: 8px; }
.ui-at-cbx__dot { flex: none; width: 9px; height: 9px; margin: 0 4px; border-radius: 999px; box-shadow: 0 0 0 2px var(--cbx-panel), 0 0 0 3px var(--cbx-line); }

.ui-at-cbx__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 8px 8px 3px 10px;
  font-size: 12.5px;
  color: var(--cbx-muted);
}
.ui-at-cbx__count { font-variant-numeric: tabular-nums; animation: ui-at-cbx-roll 220ms var(--cbx-ease); }
.ui-at-cbx__keys { display: inline-flex; align-items: center; gap: 4px; white-space: nowrap; }
.ui-at-cbx__keys kbd {
  display: inline-grid;
  place-items: center;
  min-width: 20px;
  height: 20px;
  padding: 0 4px;
  font: inherit;
  font-size: 11px;
  color: var(--cbx-text);
  background: var(--cbx-panel);
  border: 1px solid var(--cbx-line);
  border-bottom-color: var(--cbx-firm);
  border-bottom-width: 2px;
  border-radius: 6px;
}
.ui-at-cbx__keys kbd + kbd { margin-left: -1px; }

.ui-at-cbx__sr {
  position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; border: 0;
  overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap;
}

@media (max-width: 420px) { .ui-at-cbx__keys { display: none; } }
@media (pointer: coarse) {
  .ui-at-cbx__row { min-height: 44px; }
  .ui-at-cbx__input { font-size: 16px; }
  .ui-at-cbx__chip { height: 32px; }
  .ui-at-cbx__chip-x { width: 28px; height: 28px; }
  .ui-at-cbx__keys { display: none; }
}

@keyframes ui-at-cbx-open { from { opacity: 0; transform: translateY(-4px) scale(0.98); } }
@keyframes ui-at-cbx-pop { from { opacity: 0; transform: scale(0.85); } }
@keyframes ui-at-cbx-check { from { opacity: 0; transform: scale(0.4); } }
@keyframes ui-at-cbx-roll { from { opacity: 0; transform: translateY(40%); } }

@media (prefers-reduced-motion: reduce) {
  .ui-at-cbx *, .ui-at-cbx *::before, .ui-at-cbx *::after {
    animation: none !important;
    transition-property: background-color, border-color, color, opacity !important;
  }
}
`;var Ce=[{value:"maya",label:"Maya Chen",hint:"Product Designer",avatar:!0,group:"Design"},{value:"jonas",label:"Jonas Weber",hint:"Design Lead",avatar:!0,group:"Design"},{value:"priya",label:"Priya Raman",hint:"Brand Designer",avatar:!0,group:"Design"},{value:"sara",label:"Sara Okafor",hint:"Staff Engineer",avatar:!0,group:"Engineering"},{value:"leo",label:"Leo Martins",hint:"Frontend",avatar:!0,group:"Engineering"},{value:"nina",label:"Nina Petrova",hint:"Backend",avatar:!0,group:"Engineering"},{value:"tom",label:"Tom Becker",hint:"iOS",avatar:!0,group:"Engineering"},{value:"elif",label:"Elif Yilmaz",hint:"Head of Product",avatar:!0,group:"Product"},{value:"daniel",label:"Daniel Kim",hint:"Product Manager",avatar:!0,group:"Product"},{value:"lucas",label:"Lucas Moreau",hint:"Product Analyst",avatar:!0,group:"Product"}];function Ne(){let[r,o]=h(["maya","sara"]);return a("div",{style:{width:"100%",maxWidth:420,minHeight:440,paddingTop:8},children:a(te,{label:"Reviewers",options:Ce,value:r,onChange:o,placeholder:"Add reviewers\u2026",maxVisibleTags:4,creatable:!0,createLabel:s=>`Invite \u201C${s}\u201D`,onCreate:s=>({value:s.toLowerCase(),label:s,avatar:!0,group:"Invited"}),defaultOpen:!0})})}export{Ne as default};
