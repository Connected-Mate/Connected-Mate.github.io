import{t as Z}from"./react-BkAXpnfr.js";var ee=Z();var{Children:de,Component:ce,Fragment:le,StrictMode:me,cloneElement:pe,createContext:ue,createElement:he,createRef:fe,forwardRef:ge,isValidElement:xe,lazy:be,memo:ve,startTransition:_e,Suspense:ke,use:ye,useCallback:we,useContext:Me,useDebugValue:Ne,useDeferredValue:Ce,useEffect:C,useId:j,useImperativeHandle:Ee,useInsertionEffect:De,useLayoutEffect:B,useMemo:T,useOptimistic:Re,useReducer:Ie,useRef:w,useState:v,useSyncExternalStore:ze,useTransition:Te}=ee;import{t as te}from"./jsx-runtime-CTsRTJUX.js";var ne=te(),{jsx:t,jsxs:a,Fragment:d}=ne;var s=c=>t("svg",{viewBox:"0 0 16 16","aria-hidden":"true",children:c}),r={mail:s(a(d,{children:[t("rect",{x:"2.5",y:"3.5",width:"11",height:"9",rx:"2"}),t("path",{d:"M3 5l5 3.5L13 5"})]})),sparkle:s(t("path",{d:"M8 2.5l1.3 3.6 3.7 1.4-3.7 1.4L8 12.5l-1.3-3.6L3 7.5l3.7-1.4z"})),task:s(a(d,{children:[t("rect",{x:"2.5",y:"2.5",width:"11",height:"11",rx:"3"}),t("path",{d:"M5.5 8.2l1.7 1.7 3.3-3.6"})]})),contact:s(a(d,{children:[t("circle",{cx:"6.5",cy:"6",r:"2.5"}),t("path",{d:"M2.5 13c.6-2.2 2.2-3.3 4-3.3s3.4 1.1 4 3.3M12 5v4M10 7h4"})]})),calendar:s(a(d,{children:[t("rect",{x:"2.5",y:"3.5",width:"11",height:"10",rx:"2"}),t("path",{d:"M2.5 6.5h11M5.5 2v3M10.5 2v3"})]})),megaphone:s(a(d,{children:[t("path",{d:"M3 6.5v3h2l5 3v-9l-5 3z"}),t("path",{d:"M12.5 6.5c.7.5.7 2.5 0 3"})]})),page:s(a(d,{children:[t("path",{d:"M4 2.5h5l3 3v8H4z"}),t("path",{d:"M9 2.5v3h3M6 8.5h4M6 11h3"})]})),plus:s(a(d,{children:[t("path",{d:"M4 2.5h5l3 3v8H4z"}),t("path",{d:"M8 7v4M6 9h4"})]})),people:s(a(d,{children:[t("circle",{cx:"6",cy:"6",r:"2.2"}),t("path",{d:"M2.5 12.5c.5-2 1.9-3 3.5-3s3 1 3.5 3M10.5 4.2a2 2 0 010 3.6M11.5 9.6c1 .4 1.7 1.4 2 2.9"})]})),upload:s(a(d,{children:[t("path",{d:"M8 10.5V3M5 5.8L8 3l3 2.8"}),t("path",{d:"M3 10v2.5h10V10"})]})),moon:s(t("path",{d:"M12.8 9.6A5 5 0 016.4 3.2a5 5 0 106.4 6.4z"})),home:s(a(d,{children:[t("path",{d:"M2.5 7.5L8 3l5.5 4.5"}),t("path",{d:"M4 6.5v6.5h8V6.5"})]})),inbox:s(a(d,{children:[t("path",{d:"M2.5 9l1.8-5.5h7.4L13.5 9v3.5h-11z"}),t("path",{d:"M2.5 9h3l.8 1.5h3.4l.8-1.5h3"})]})),chart:s(a(d,{children:[t("path",{d:"M3 13V3M3 13h10"}),t("path",{d:"M5.5 10.5V8M8 10.5V5.5M10.5 10.5V7"})]})),gear:s(a(d,{children:[t("circle",{cx:"8",cy:"8",r:"2"}),t("path",{d:"M8 2v1.6M8 12.4V14M2 8h1.6M12.4 8H14M3.8 3.8l1.1 1.1M11.1 11.1l1.1 1.1M3.8 12.2l1.1-1.1M11.1 4.9l1.1-1.1"})]})),help:s(a(d,{children:[t("circle",{cx:"8",cy:"8",r:"5.5"}),t("path",{d:"M6.4 6.4a1.7 1.7 0 113 1.1c-.6.4-1.4.8-1.4 1.6M8 11.1v.1"})]}))},ie=[{id:"suggestions",label:"Suggestions",commands:[{id:"email",label:"Write an email",hint:"Mail",icon:r.mail,keywords:["compose","message"]},{id:"ask",label:"Ask assistant",hint:"Summaries, drafts, answers",icon:r.sparkle,keywords:["ai","chat"]},{id:"task",label:"Create a task",hint:"Tasks",icon:r.task,keywords:["todo"]},{id:"crm",label:"Add contact to CRM",hint:"Contacts",icon:r.contact,keywords:["lead","customer"]},{id:"meeting",label:"Schedule a meeting",hint:"Calendar",icon:r.calendar,keywords:["event","call"]}]},{id:"share",label:"Share",commands:[{id:"post",label:"Post an update",hint:"#team-updates",icon:r.megaphone},{id:"save-page",label:"Save as page",hint:"Wiki \xB7 Meeting notes",icon:r.page}]},{id:"general",label:"General",commands:[{id:"new-doc",label:"New document",icon:r.plus,keys:["N"]},{id:"invite",label:"Invite teammates",icon:r.people,keys:["I"]},{id:"upload",label:"Upload files",icon:r.upload,keys:["U"]},{id:"theme",label:"Switch to dark mode",icon:r.moon,keys:["\u21E7","D"],keywords:["theme","light"]}]},{id:"goto",label:"Go to",commands:[{id:"home",label:"Home",icon:r.home,keys:["G","H"]},{id:"inbox",label:"Inbox",icon:r.inbox,keys:["G","I"]},{id:"reports",label:"Reports",icon:r.chart,keys:["G","R"]},{id:"settings",label:"Settings",icon:r.gear,keys:["G","S"]},{id:"help",label:"Help & feedback",icon:r.help,keys:["?"]}]}],H=c=>c.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().trim();function ae(c,E,M){if(!M)return 1;let N=H(c.label),b=H(M).split(/\s+/),D=H([c.label,c.hint??"",E,...c.keywords??[]].join(" "));return b.every(f=>D.includes(f))?N.startsWith(b[0])?3:N.includes(b[0])?2:1:0}function U({groups:c=ie,placeholder:E="Type a command or search\u2026",onRun:M,onClose:N,autoFocus:b,className:D}){let f=j(),[u,S]=v(""),[W,x]=v(0),[q,L]=v(null),[_,K]=v(null),[F,O]=v(!0),k=w(null),$=w(null),A=w(null),R=w([]);C(()=>{let e=navigator.userAgentData?.platform??navigator.platform??"";O(/mac|iphone|ipad|ipod/i.test(e));let i=R.current;return()=>i.forEach(n=>window.clearTimeout(n))},[]),C(()=>{b&&k.current?.focus({preventScroll:!0})},[b]);let g=T(()=>{let e=[],i=0;c.forEach((o,h)=>{let y=o.commands.map(m=>({c:m,s:ae(m,o.label,u)})).filter(m=>m.s>0).sort((m,z)=>u?z.s-m.s:0).map(({c:m})=>({command:m,group:o.id,groupIndex:h,id:`${f}-o${i++}`}));y.length&&e.push({id:o.id,label:o.label,rows:y})});let n=u.trim();return n&&e.push({id:"__ask",label:"Assistant",rows:[{command:{id:"ask",label:`Ask assistant \u201C${n}\u201D`,icon:r.sparkle},group:"__ask",groupIndex:c.length,id:`${f}-o${i++}`,fallback:!0}]}),e},[c,u,f]),l=T(()=>g.flatMap(e=>e.rows),[g]),p=l.length?Math.min(W,l.length-1):-1,Y=!!u.trim()&&l.length===1,V=c.find(e=>e.id==="suggestions")?.commands.slice(0,5)??[],I=e=>{if(!e)return;let i=u.trim();L(e.id);let n=e.fallback?"Asked assistant":e.command.label;K(o=>({label:n,n:(o?.n??0)+1})),R.current.push(window.setTimeout(()=>L(null),180)),R.current.push(window.setTimeout(()=>K(o=>o&&o.label===n?null:o),2800)),M?.(e.command.id,e.command.id==="ask"&&i?i:void 0)};C(()=>{let e=i=>{(i.metaKey||i.ctrlKey)&&(i.key==="k"||i.key==="K")&&(i.preventDefault(),k.current?.focus(),k.current?.select())};return document.addEventListener("keydown",e),()=>document.removeEventListener("keydown",e)},[]),B(()=>{let e=$.current,i=A.current;if(!e||!i)return;let n=p>=0?document.getElementById(l[p].id):null;if(!n){i.style.opacity="0";return}i.style.opacity="1",i.style.transform=`translateY(${n.offsetTop}px)`,i.style.height=`${n.offsetHeight}px`;let o=n.offsetTop,h=o+n.offsetHeight;o<e.scrollTop+4?e.scrollTop=Math.max(0,o-34):h>e.scrollTop+e.clientHeight&&(e.scrollTop=h-e.clientHeight+6)},[p,l]);let J=e=>{let i=0;for(let n=0;n<e;n++)i+=g[n].rows.length;return i},Q=e=>{let i=0;for(let n=0;n<g.length;n++)if(i+=g[n].rows.length,e<i)return n;return 0},X=e=>{if((e.metaKey||e.ctrlKey)&&/^[1-5]$/.test(e.key)){let n=V[Number(e.key)-1];if(n){e.preventDefault();let o=l.find(h=>h.command.id===n.id&&h.group==="suggestions");I(o??{command:n,group:"suggestions",groupIndex:0,id:""})}return}switch(e.key){case"ArrowDown":case"ArrowUp":{if(e.preventDefault(),!l.length)return;let n=e.key==="ArrowDown"?1:-1;x((p+n+l.length)%l.length);return}case"Home":case"End":u||(e.preventDefault(),x(e.key==="Home"?0:l.length-1));return;case"PageDown":case"PageUp":{e.preventDefault();let n=e.key==="PageDown"?5:-5;x(Math.max(0,Math.min(l.length-1,p+n)));return}case"Tab":{if(g.length<2)return;e.preventDefault();let o=(Q(p)+(e.shiftKey?-1:1)+g.length)%g.length;x(J(o));return}case"Enter":e.preventDefault(),I(l[p]);return;case"Escape":e.preventDefault(),u?(S(""),x(0)):N?.();return}},G=F?"\u2318":"Ctrl",P=-1;return a("div",{className:["ui-cmd",D].filter(Boolean).join(" "),children:[t("style",{href:"ui-command-menu",precedence:"default",children:oe}),a("div",{className:"ui-cmd__panel",children:[a("div",{className:"ui-cmd__search",children:[a("svg",{className:"ui-cmd__lens",viewBox:"0 0 16 16","aria-hidden":"true",children:[t("circle",{cx:"7",cy:"7",r:"4.5"}),t("path",{d:"M10.5 10.5L14 14"})]}),t("input",{ref:k,className:"ui-cmd__input",type:"text",role:"combobox","aria-expanded":"true","aria-controls":`${f}-list`,"aria-autocomplete":"list","aria-activedescendant":p>=0?l[p].id:void 0,"aria-label":"Command",autoComplete:"off",spellCheck:!1,placeholder:E,value:u,onChange:e=>{S(e.target.value),x(0)},onKeyDown:X}),a("span",{className:"ui-cmd__enter","aria-hidden":"true",children:[t("svg",{viewBox:"0 0 12 12",children:t("path",{d:"M10 2.5v3.5H3M5 3.8L2.7 6 5 8.2"})}),"Enter"]})]}),a("div",{ref:$,id:`${f}-list`,className:"ui-cmd__list",role:"listbox","aria-label":"Commands",onPointerDown:e=>e.preventDefault(),children:[t("div",{ref:A,className:"ui-cmd__glide","aria-hidden":"true"}),Y?a("p",{className:"ui-cmd__empty",role:"presentation",children:["No commands match \u201C",u.trim(),"\u201D"]}):null,g.map(e=>a("div",{className:"ui-cmd__group",role:"group","aria-labelledby":`${f}-${e.id}`,children:[t("div",{id:`${f}-${e.id}`,className:"ui-cmd__group-title",role:"presentation",children:e.label}),e.rows.map(i=>{P++;let n=P,o=i.command,h=i.group==="suggestions"?V.findIndex(m=>m.id===o.id):-1,y=h>=0?[G,String(h+1)]:o.keys;return a("div",{id:i.id,role:"option","aria-selected":n===p,className:"ui-cmd__row","data-pressed":q===i.id?"":void 0,onPointerMove:()=>n!==p&&x(n),onClick:()=>{x(n),I(i),k.current?.focus({preventScroll:!0})},children:[t("span",{className:"ui-cmd__pebble","aria-hidden":"true",children:o.logo??o.icon}),a("span",{className:"ui-cmd__text",children:[t("span",{className:"ui-cmd__label",children:o.label}),o.hint?t("span",{className:"ui-cmd__hint",children:o.hint}):null]}),y?.length?t("span",{className:"ui-cmd__keys","aria-hidden":"true",children:y.map((m,z)=>t("kbd",{children:m},z))}):null]},i.id)})]},e.id))]})]}),a("div",{className:"ui-cmd__foot",children:[_?a("span",{className:"ui-cmd__ran",children:[t("span",{className:"ui-cmd__ran-check","aria-hidden":"true",children:t("svg",{viewBox:"0 0 12 12",children:t("path",{d:"M2.8 6.3l2.1 2.1 4.3-4.8"})})}),t("span",{className:"ui-cmd__ran-label",children:_.label})]},_.n):a("span",{className:"ui-cmd__tip","aria-hidden":"true",children:[t("kbd",{children:"Tab"})," to jump between sections"]}),a("span",{className:"ui-cmd__tip ui-cmd__tip--end","aria-hidden":"true",children:[t("kbd",{children:G}),t("kbd",{children:"K"})," to open"]})]}),t("span",{className:"ui-cmd__sr","aria-live":"polite",children:_?`Ran ${_.label}`:""})]})}var oe=`
.ui-cmd {
  --cmd-frame: #f2f6fa;
  --cmd-panel: #ffffff;
  --cmd-soft: rgba(26, 62, 112, 0.06);
  --cmd-line: #dae2ec;
  --cmd-firm: #cbd6e4;
  --cmd-ink: #00162b;
  --cmd-text: rgba(0, 22, 43, 0.66);
  --cmd-muted: rgba(0, 22, 43, 0.54);
  --cmd-berry: #851437;
  --cmd-info-ink: #1a3e70;
  --cmd-info-fill: #eef5ff;
  --cmd-info-line: #c1daff;
  --cmd-success-ink: #1d6a34;
  --cmd-success-fill: #eafbee;
  --cmd-success-line: #c9f5cf;
  --cmd-pebble: inset 0 -2px 6px -4px rgba(26, 62, 112, 0.4);
  --cmd-drop: 0 8px 16px -8px rgba(26, 62, 112, 0.2);
  --cmd-raised: 0 18px 30px -16px rgba(26, 62, 112, 0.38), 0 4px 10px -6px rgba(26, 62, 112, 0.18);
  --cmd-ease: cubic-bezier(0.16, 1, 0.3, 1);
  width: 100%;
  max-width: 600px;
  padding: 6px;
  background: var(--cmd-frame);
  border: 1px solid var(--cmd-line);
  border-radius: 22px;
  box-shadow: var(--cmd-raised);
  container-type: inline-size;
  font-family: "Avenir Next", Avenir, system-ui, sans-serif;
  font-size: 14px;
  line-height: 1.35;
  color: var(--cmd-ink);
  -webkit-font-smoothing: antialiased;
}
:where(.dark, [data-theme="dark"]) .ui-cmd {
  --cmd-frame: #0f2747;
  --cmd-panel: #16345c;
  --cmd-soft: rgba(255, 255, 255, 0.07);
  --cmd-line: rgba(255, 255, 255, 0.12);
  --cmd-firm: rgba(255, 255, 255, 0.18);
  --cmd-ink: rgba(255, 255, 255, 0.94);
  --cmd-text: rgba(255, 255, 255, 0.72);
  --cmd-muted: rgba(255, 255, 255, 0.56);
  --cmd-berry: #a8204d;
  --cmd-info-ink: #c1daff;
  --cmd-info-fill: rgba(143, 189, 242, 0.16);
  --cmd-info-line: rgba(143, 189, 242, 0.34);
  --cmd-success-ink: #7fe0a0;
  --cmd-success-fill: rgba(127, 224, 160, 0.14);
  --cmd-success-line: rgba(127, 224, 160, 0.3);
  --cmd-pebble: inset 0 -2px 6px -4px rgba(3, 12, 28, 0.8);
  --cmd-drop: 0 8px 16px -8px rgba(3, 12, 28, 0.6);
  --cmd-raised: 0 18px 30px -16px rgba(3, 12, 28, 0.8), 0 4px 10px -6px rgba(3, 12, 28, 0.6);
}
.ui-cmd *, .ui-cmd *::before, .ui-cmd *::after { box-sizing: border-box; }

.ui-cmd__panel {
  background: var(--cmd-panel);
  border: 1px solid var(--cmd-line);
  border-radius: 16px;
  box-shadow: var(--cmd-drop);
  overflow: hidden;
}
.ui-cmd__search {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 52px;
  padding: 0 16px;
  border-bottom: 1px solid var(--cmd-line);
}
.ui-cmd__lens { flex: none; width: 16px; height: 16px; fill: none; stroke: var(--cmd-muted); stroke-width: 1.6; stroke-linecap: round; }
.ui-cmd__input {
  flex: 1;
  min-width: 0;
  height: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  font: inherit;
  font-size: 15px;
  color: var(--cmd-ink);
  caret-color: var(--cmd-berry);
}
.ui-cmd__input::placeholder { color: var(--cmd-muted); }
.ui-cmd__search:focus-within { box-shadow: inset 0 -2px 0 -0.5px var(--cmd-info-line); }
.ui-cmd__enter {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  flex: none;
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: var(--cmd-muted);
}
.ui-cmd__enter svg { width: 11px; height: 11px; fill: none; stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }

.ui-cmd__list {
  position: relative;
  max-height: 340px;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 6px;
  scrollbar-width: thin;
}
.ui-cmd__glide {
  position: absolute;
  left: 6px;
  right: 6px;
  top: 0;
  border-radius: 10px;
  background: var(--cmd-soft);
  box-shadow: inset 0 0 0 1px var(--cmd-line);
  pointer-events: none;
  transition: transform 150ms var(--cmd-ease), height 150ms var(--cmd-ease), opacity 150ms var(--cmd-ease);
}
.ui-cmd__group-title {
  padding: 10px 10px 6px;
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: var(--cmd-muted);
}
.ui-cmd__row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 40px;
  padding: 5px 10px;
  border-radius: 10px;
  cursor: pointer;
  user-select: none;
  transition: transform 150ms var(--cmd-ease);
}
.ui-cmd__row[aria-selected="true"]::before {
  content: "";
  position: absolute;
  left: 3px;
  top: 10px;
  bottom: 10px;
  width: 2px;
  border-radius: 2px;
  background: var(--cmd-berry);
}
.ui-cmd__row[data-pressed] { transform: scale(0.985); }
.ui-cmd__pebble {
  display: grid;
  place-items: center;
  flex: none;
  width: 26px;
  height: 26px;
  border-radius: 8px;
  background: var(--cmd-panel);
  border: 1px solid var(--cmd-line);
  box-shadow: var(--cmd-pebble);
  color: var(--cmd-info-ink);
}
.ui-cmd__pebble svg { width: 15px; height: 15px; fill: none; stroke: currentColor; stroke-width: 1.4; stroke-linecap: round; stroke-linejoin: round; }
.ui-cmd__pebble img { width: 16px; height: 16px; object-fit: contain; }
.ui-cmd__text { display: flex; align-items: baseline; gap: 8px; flex: 1; min-width: 0; }
.ui-cmd__label { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 500; }
.ui-cmd__hint { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--cmd-muted); font-size: 13px; min-width: 0; }
.ui-cmd__keys { display: inline-flex; gap: 3px; flex: none; }
.ui-cmd kbd {
  display: inline-grid;
  place-items: center;
  min-width: 22px;
  height: 22px;
  padding: 0 5px;
  font: inherit;
  font-size: 11px;
  font-weight: 600;
  color: var(--cmd-text);
  background: var(--cmd-panel);
  border: 1px solid var(--cmd-line);
  border-bottom: 2px solid var(--cmd-firm);
  border-radius: 6px;
}
.ui-cmd__empty { margin: 0; padding: 16px 10px 4px; color: var(--cmd-muted); text-align: center; }

.ui-cmd__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 38px;
  padding: 6px 8px 2px 8px;
  font-size: 12.5px;
  color: var(--cmd-muted);
}
.ui-cmd__tip { display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; }
.ui-cmd__tip kbd + kbd { margin-left: -3px; }
.ui-cmd__ran { display: inline-flex; align-items: center; gap: 8px; min-width: 0; color: var(--cmd-ink); font-weight: 500; animation: ui-cmd-in 300ms var(--cmd-ease); }
.ui-cmd__ran-label { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ui-cmd__ran-check {
  display: grid;
  place-items: center;
  flex: none;
  width: 20px;
  height: 20px;
  border-radius: 999px;
  background: var(--cmd-success-fill);
  border: 1px solid var(--cmd-success-line);
  color: var(--cmd-success-ink);
  animation: ui-cmd-pop 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
.ui-cmd__ran-check svg { width: 11px; height: 11px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }

.ui-cmd__sr {
  position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; border: 0;
  overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap;
}

@container (max-width: 480px) {
  .ui-cmd__hint, .ui-cmd__keys, .ui-cmd__enter, .ui-cmd__tip--end { display: none; }
}
@media (pointer: coarse) {
  .ui-cmd__row { min-height: 44px; }
  .ui-cmd__input { font-size: 16px; }
  .ui-cmd__keys, .ui-cmd__foot .ui-cmd__tip { display: none; }
}

@keyframes ui-cmd-in { from { opacity: 0; transform: translateY(4px); } }
@keyframes ui-cmd-pop { from { transform: scale(0.4); opacity: 0; } }

@media (prefers-reduced-motion: reduce) {
  .ui-cmd *, .ui-cmd *::before, .ui-cmd *::after {
    animation: none !important;
    transition-property: background-color, border-color, color, opacity !important;
  }
  .ui-cmd__row[data-pressed] { transform: none; }
}
`;function re(){return t("div",{style:{width:"100%",maxWidth:600,display:"grid",placeItems:"center"},children:t(U,{onRun:()=>{}})})}export{re as default};
