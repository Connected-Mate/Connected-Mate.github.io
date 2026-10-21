import{t as re}from"./react-BkAXpnfr.js";var ce=re();var{Children:Le,Component:Ae,Fragment:De,StrictMode:Te,cloneElement:Se,createContext:Pe,createElement:Ve,createRef:$e,forwardRef:Be,isValidElement:He,lazy:qe,memo:je,startTransition:Ke,Suspense:Ue,use:We,useCallback:Fe,useContext:Xe,useDebugValue:Ze,useDeferredValue:Ye,useEffect:v,useId:V,useImperativeHandle:Ge,useInsertionEffect:Je,useLayoutEffect:$,useMemo:Oe,useOptimistic:Qe,useReducer:ea,useRef:m,useState:u,useSyncExternalStore:aa,useTransition:ta}=ce;import{t as se}from"./jsx-runtime-CTsRTJUX.js";var de=se(),{jsx:e,jsxs:o,Fragment:na}=de;var n=({children:N,size:r=18})=>e("svg",{width:r,height:r,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:1.7,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:N}),pe=()=>e(n,{children:e("path",{d:"M12 5v14M5 12h14"})}),le=()=>o(n,{children:[e("path",{d:"M8 13V6.5a1.5 1.5 0 0 1 3 0V12M11 11V4.5a1.5 1.5 0 0 1 3 0V11M14 11V5.5a1.5 1.5 0 0 1 3 0V13"}),e("path",{d:"M17 9.5a1.5 1.5 0 0 1 3 0V14a7 7 0 0 1-7 7h-1a7 7 0 0 1-5.6-2.8L4 15.6a1.6 1.6 0 0 1 2.5-2L8 15"})]}),ue=()=>o(n,{size:16,children:[e("path",{d:"M12 3 5 6v5.5c0 4.3 3 8.1 7 9.5 4-1.4 7-5.2 7-9.5V6l-7-3Z"}),e("path",{d:"M12 8v4.5M12 15.5v.5"})]}),fe=()=>e(n,{size:14,children:e("path",{d:"m6 9 6 6 6-6"})}),he=()=>o(n,{children:[e("rect",{x:"9",y:"3",width:"6",height:"11",rx:"3"}),e("path",{d:"M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"})]}),me=()=>e(n,{size:16,children:e("path",{d:"M12 19V5M6 11l6-6 6 6"})}),be=()=>e(n,{size:16,children:e("path",{d:"M6 6l12 12M18 6 6 18"})}),ge=()=>e(n,{size:16,children:e("path",{d:"m5 12.5 4.5 4.5L19 7.5"})}),ve=()=>e(n,{size:16,children:e("path",{d:"M3.5 7.5A2 2 0 0 1 5.5 5.5h3.6l2 2h7.4a2 2 0 0 1 2 2v7.5a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2V7.5Z"})}),xe=()=>e(n,{size:14,children:e("path",{d:"m5 12.5 4.5 4.5L19 7.5"})}),_e=()=>e(n,{size:16,children:e("path",{d:"M12 3.5 13.8 10.2 20.5 12l-6.7 1.8L12 20.5l-1.8-6.7L3.5 12l6.7-1.8L12 3.5Z"})}),we=()=>e(n,{size:16,children:e("path",{d:"M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4"})}),ke=()=>e(n,{size:16,children:e("path",{d:"M13 3 5 13.5h6L10 21l9-11h-6.2L13 3Z"})}),ye=[{id:"auto",name:"Auto",description:"Picks the best model for each task",icon:e(_e,{})},{id:"claude",name:"Claude",description:"Thoughtful writing and code",icon:e(we,{})},{id:"chatgpt",name:"ChatGPT",description:"Quick answers for everyday tasks",icon:e(ke,{})}],Me=()=>o("svg",{width:"14",height:"14",viewBox:"0 0 16 16","aria-hidden":"true",children:[e("rect",{x:"1.5",y:"3.5",width:"13",height:"9",rx:"2",fill:"none",stroke:"var(--berry)",strokeWidth:"1.5"}),e("path",{d:"m2.5 4.5 5.5 4 5.5-4",fill:"none",stroke:"var(--berry)",strokeWidth:"1.5",strokeLinejoin:"round"})]}),Ne=()=>e("svg",{width:"14",height:"14",viewBox:"0 0 16 16","aria-hidden":"true",children:e("path",{d:"M5.5 2.5v11M10.5 2.5v11M2.5 5.5h11M2.5 10.5h11",stroke:"var(--info-ink)",strokeWidth:"1.5",strokeLinecap:"round"})}),Ce=()=>e("svg",{width:"14",height:"14",viewBox:"0 0 16 16","aria-hidden":"true",children:e("path",{d:"m3 8.5 3 3 7-7",fill:"none",stroke:"var(--ok-ink)",strokeWidth:"1.7",strokeLinecap:"round",strokeLinejoin:"round"})});function B({placeholder:N="Start by typing...",models:r=ye,loadMs:z=1300,dictation:H="Draft a short update for the team about the launch moving to Thursday",onSend:q,onModelChange:j,onAttach:K,onConnectApps:U,onRequestApproval:W,onSelectProject:F,className:X}){let x=V(),[_,C]=u(""),[f,R]=u(r[0]),[d,L]=u("idle"),[p,I]=u("idle"),[Z,l]=u(""),[c,b]=u({open:!1,active:0,up:!0}),[i,w]=u({on:!1,words:0}),h=m(null),k=m(null),E=m(null),Y=m(null),A=m([]);v(()=>()=>A.current.forEach(a=>window.clearTimeout(a)),[]);let y=(a,t)=>{A.current.push(window.setTimeout(a,t))};v(()=>{R(a=>r.find(t=>t.id===a?.id)??r[0])},[r]),$(()=>{let a=h.current;a&&(a.style.height="auto",a.style.height=`${Math.min(a.scrollHeight,200)}px`)},[_,i.on]);let D=()=>{let a=_.trim();a&&(q?.(a,{model:f?.id??""}),C(""),l("Message sent"),h.current?.focus())},G=()=>{d==="idle"&&(L("loading"),l("Connecting apps\u2026"),U?.(),y(()=>{L("done"),l("Apps connected. Select a project to continue")},z))},J=()=>{if(p!=="loading"){if(p==="done"){I("idle"),l("Access back to normal");return}I("loading"),l("Requesting approval\u2026"),W?.(),y(()=>{I("done"),l("Approved: unrestricted access for this run")},z)}},T=(a=Math.max(0,r.findIndex(t=>t.id===f?.id)))=>{let t=k.current?.getBoundingClientRect(),s=t?t.top>window.innerHeight-t.bottom:!0;b({open:!0,active:a,up:s})},M=(a=!0)=>{b(t=>({...t,open:!1})),a&&k.current?.focus()},S=a=>{let t=r[a];t&&(R(t),j?.(t),l(`Model: ${t.name}`),M())};v(()=>{if(!c.open)return;E.current?.focus();let a=t=>{!E.current?.contains(t.target)&&!k.current?.contains(t.target)&&b(s=>({...s,open:!1}))};return document.addEventListener("pointerdown",a),()=>document.removeEventListener("pointerdown",a)},[c.open]);let O=a=>{let t=r.length,s=ie=>{a.preventDefault(),b(ne=>({...ne,active:(ie+t)%t}))};switch(a.key){case"ArrowDown":return s(c.active+1);case"ArrowUp":return s(c.active-1);case"Home":return s(0);case"End":return s(t-1);case"Enter":case" ":return a.preventDefault(),S(c.active);case"Escape":return a.preventDefault(),a.stopPropagation(),M();case"Tab":return M(!1)}},g=H.split(/\s+/).filter(Boolean);v(()=>{if(!i.on||i.words>=g.length)return;let a=window.setTimeout(()=>w(t=>({...t,words:t.words+1})),260);return()=>window.clearTimeout(a)},[i,g.length]);let Q=()=>{w({on:!0,words:0}),l("Recording. Press Escape to discard")},P=()=>{w({on:!1,words:0}),l("Recording discarded"),y(()=>h.current?.focus(),0)},ee=()=>{let a=g.slice(0,i.words).join(" ");w({on:!1,words:0}),a&&C(t=>t.trim()?`${t.trimEnd()} ${a}`:a),l(a?"Transcript added":"Nothing heard"),y(()=>{let t=h.current;t&&(t.focus(),t.setSelectionRange(t.value.length,t.value.length))},0)},ae=i.words>=g.length?i.words:Math.max(0,i.words-2),te=a=>{a.target.closest("button, a, textarea, [role='listbox']")||(a.preventDefault(),h.current?.focus())},oe=_.trim().length>0;return o("div",{ref:Y,className:["ui-at-cc",X].filter(Boolean).join(" "),"data-apps":d,onKeyDown:a=>{a.key==="Escape"&&i.on&&(a.preventDefault(),P())},children:[e("style",{href:"ui-chat-composer",precedence:"default",children:Ie}),e("div",{className:"ui-at-cc__fold","data-open":d==="done"||void 0,children:e("div",{className:"ui-at-cc__clip",inert:d!=="done","aria-hidden":d!=="done",children:e("div",{className:"ui-at-cc__top",children:o("button",{type:"button",className:"ui-at-cc__ghost",onClick:()=>F?.(),children:[e("span",{className:"ui-at-cc__folder",children:e(ve,{})}),"Select a project"]})})})}),o("div",{className:"ui-at-cc__card",onMouseDown:te,children:[e("div",{className:"ui-at-cc__fieldwrap",children:i.on?o("p",{className:"ui-at-cc__transcript","aria-live":"off",children:[i.words===0&&e("span",{className:"ui-at-cc__listening",children:"Listening\u2026"}),g.slice(0,i.words).map((a,t)=>o("span",{className:"ui-at-cc__word","data-pending":t>=ae||void 0,children:[a," "]},t))]}):e("textarea",{ref:h,className:"ui-at-cc__field",rows:1,value:_,placeholder:N,"aria-label":"Message",onChange:a=>C(a.target.value),onKeyDown:a=>{a.key==="Enter"&&!a.shiftKey&&!a.nativeEvent.isComposing&&(a.preventDefault(),D())}})}),i.on?o("div",{className:"ui-at-cc__bar",children:[e("button",{type:"button",className:"ui-at-cc__icon",onClick:P,"aria-label":"Discard recording",children:e(be,{})}),e("span",{className:"ui-at-cc__trace","aria-hidden":"true",children:e("span",{})}),e("button",{type:"button",className:"ui-at-cc__send",onClick:ee,"aria-label":"Use transcript",children:e(ge,{})})]},"rec"):o("div",{className:"ui-at-cc__bar",children:[e("button",{type:"button",className:"ui-at-cc__icon","aria-label":"Add files",title:"Add files",onClick:()=>K?.(),children:e(pe,{})}),o("button",{type:"button",className:"ui-at-cc__approval","data-phase":p,"aria-busy":p==="loading",title:p==="done"?"Unrestricted access":"Request approval","aria-label":p==="done"?"Unrestricted access \u2013 click to go back to normal access":p==="loading"?"Requesting approval":"Request approval",onClick:J,children:[e("span",{className:"ui-at-cc__approvalicon","aria-hidden":"true",children:p==="done"?e(ue,{}):e(le,{})}),e("span",{className:"ui-at-cc__approvallabel",children:p==="done"?"Unrestricted access":p==="loading"?"Requesting\u2026":"Request approval"},p)]}),e("span",{className:"ui-at-cc__spacer"}),o("div",{className:"ui-at-cc__modelwrap",children:[o("button",{ref:k,type:"button",className:"ui-at-cc__model","aria-haspopup":"listbox","aria-expanded":c.open,"aria-controls":`${x}-models`,"aria-label":`Model: ${f?.name??"none"}`,onClick:()=>c.open?M():T(),onKeyDown:a=>{if(a.key==="ArrowDown"||a.key==="ArrowUp"){a.preventDefault();let t=Math.max(0,r.findIndex(s=>s.id===f?.id));T(t)}},children:[e("span",{className:"ui-at-cc__modelname",children:f?.name}),e(fe,{})]}),c.open&&o("ul",{ref:E,id:`${x}-models`,role:"listbox",tabIndex:-1,"aria-label":"Model","aria-activedescendant":`${x}-m-${c.active}`,className:"ui-at-cc__list","data-up":c.up||void 0,onKeyDown:O,children:[e("li",{role:"presentation",className:"ui-at-cc__hl","aria-hidden":"true",style:{transform:`translateY(${c.active*100}%)`}}),r.map((a,t)=>o("li",{id:`${x}-m-${t}`,role:"option","aria-selected":a.id===f?.id,className:"ui-at-cc__opt","data-active":t===c.active||void 0,onMouseEnter:()=>b(s=>({...s,active:t})),onClick:()=>S(t),children:[e("span",{className:"ui-at-cc__opticon","aria-hidden":"true",children:a.icon??a.name.slice(0,1)}),o("span",{className:"ui-at-cc__opttext",children:[e("span",{className:"ui-at-cc__optname",children:a.name}),a.description&&e("span",{className:"ui-at-cc__optdesc",children:a.description})]}),a.id===f?.id&&e("span",{className:"ui-at-cc__tick","aria-hidden":"true",children:e(xe,{})})]},a.id))]})]}),e("button",{type:"button",className:"ui-at-cc__icon",onClick:Q,"aria-label":"Dictate a message",children:e(he,{})}),e("button",{type:"button",className:"ui-at-cc__send",onClick:D,disabled:!oe,"aria-label":"Send message",children:e(me,{})})]},"tools")]}),e("div",{className:"ui-at-cc__fold","data-open":d!=="done"||void 0,children:e("div",{className:"ui-at-cc__clip",inert:d==="done","aria-hidden":d==="done",children:e("div",{className:"ui-at-cc__bottom",children:o("button",{type:"button",className:"ui-at-cc__ghost ui-at-cc__connect","data-phase":d,"aria-busy":d==="loading",onClick:G,children:[o("span",{className:"ui-at-cc__apps","aria-hidden":"true",children:[e("span",{children:e(Me,{})}),e("span",{children:e(Ne,{})}),e("span",{children:e(Ce,{})})]}),d==="loading"?"Connecting apps\u2026":"Connect apps"]})})})}),e("div",{className:"ui-at-cc__sr",role:"status","aria-live":"polite",children:Z})]})}var Ie=`
.ui-at-cc {
  --on-berry: #ffffff; --sweep: rgba(143, 189, 242, 0.35);
  --frame: #f2f6fa; --panel: #ffffff; --soft: rgba(26, 62, 112, 0.06);
  --line: #dae2ec; --line-firm: #cbd6e4;
  --ink: #00162b; --text: rgba(0, 22, 43, 0.66); --muted: rgba(0, 22, 43, 0.54);
  --berry: #851437; --berry-hover: #6d0f2d;
  --info-ink: #1a3e70; --info-fill: #eef5ff; --info-line: #c1daff; --ring: #8fbdf2;
  --ok-ink: #1d6a34;
  --bad-ink: #8a3a22; --bad-fill: #fdeee8; --bad-line: #f5d5c9;
  --pebble: #ffffff; --pebble-shade: inset 0 -2px 6px -4px rgba(26, 62, 112, 0.4);
  --field-shade: inset 0 1px 2px rgba(26, 62, 112, 0.05);
  --drop: 0 8px 16px -8px rgba(26, 62, 112, 0.2);
  --raised: 0 18px 30px -16px rgba(26, 62, 112, 0.38), 0 4px 10px -6px rgba(26, 62, 112, 0.18);
  --float: 0 24px 48px -24px rgba(26, 62, 112, 0.3);
  --berry-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 6px 12px -6px rgba(133, 20, 55, 0.6);
  --ease: cubic-bezier(.16, 1, .3, 1);
  container-type: inline-size;
  box-sizing: border-box;
  width: 100%;
  max-width: 680px;
  min-width: 0;
  padding: 6px;
  border-radius: 22px;
  background: var(--frame);
  border: 1px solid var(--line);
  box-shadow: var(--float);
  font-family: "Avenir Next", Avenir, system-ui, sans-serif;
  font-size: 15px;
  color: var(--text);
  text-align: left;
}
:where(.dark, [data-theme="dark"]) .ui-at-cc {
  --frame: #0f2747; --panel: #16345c; --soft: rgba(255, 255, 255, 0.07);
  --line: rgba(255, 255, 255, 0.12); --line-firm: rgba(255, 255, 255, 0.18);
  --ink: rgba(255, 255, 255, 0.94); --text: rgba(255, 255, 255, 0.72); --muted: rgba(255, 255, 255, 0.56);
  --berry: #a8204d; --berry-hover: #bd2a5a;
  --info-ink: #c1daff; --info-fill: rgba(143, 189, 242, 0.16); --info-line: rgba(143, 189, 242, 0.34); --ring: rgba(143, 189, 242, 0.6);
  --ok-ink: #7fe0a0;
  --bad-ink: #f2a48c; --bad-fill: rgba(242, 164, 140, 0.14); --bad-line: rgba(242, 164, 140, 0.3);
  --pebble: #1d4170; --pebble-shade: inset 0 -2px 6px -4px rgba(3, 12, 28, 0.8);
  --field-shade: inset 0 1px 2px rgba(3, 12, 28, 0.3);
  --drop: 0 8px 16px -8px rgba(3, 12, 28, 0.6);
  --raised: 0 18px 30px -16px rgba(3, 12, 28, 0.8), 0 4px 10px -6px rgba(3, 12, 28, 0.6);
  --float: 0 24px 48px -24px rgba(3, 12, 28, 0.7);
  --berry-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 6px 12px -6px rgba(3, 12, 28, 0.8);
}
.ui-at-cc *, .ui-at-cc *::before, .ui-at-cc *::after { box-sizing: border-box; }
.ui-at-cc button { font: inherit; color: inherit; }
.ui-at-cc :focus-visible { outline: none; box-shadow: 0 0 0 3px var(--ring); }

.ui-at-cc__fold { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 300ms var(--ease); }
.ui-at-cc__fold[data-open] { grid-template-rows: 1fr; }
.ui-at-cc__clip { min-height: 0; overflow: hidden; }
.ui-at-cc__fold:not([data-open]) .ui-at-cc__clip > * { opacity: 0; }
.ui-at-cc__clip > * { transition: opacity 300ms var(--ease); }
.ui-at-cc__top { padding: 4px 8px 8px; }
.ui-at-cc__bottom { padding: 8px 8px 4px; }

.ui-at-cc__ghost {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  height: 34px;
  padding: 0 10px 0 6px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  font-size: 14px;
  color: var(--text);
  cursor: pointer;
  transition: background-color 150ms var(--ease), color 150ms var(--ease);
}
.ui-at-cc__ghost:hover { background: var(--soft); color: var(--ink); }
.ui-at-cc__folder { display: grid; place-items: center; width: 24px; height: 24px; border-radius: 7px; background: var(--pebble); border: 1px solid var(--line); box-shadow: var(--pebble-shade); color: var(--info-ink); }

.ui-at-cc__connect { position: relative; overflow: hidden; }
.ui-at-cc__connect[data-phase="loading"] { color: var(--ink); cursor: progress; }
.ui-at-cc__connect[data-phase="loading"]::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(100deg, transparent 20%, var(--sweep) 50%, transparent 80%);
  transform: translateX(-100%);
  animation: ui-at-cc-sweep 650ms var(--ease) 2;
}
.ui-at-cc__apps { display: inline-flex; }
.ui-at-cc__apps > span {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 7px;
  background: var(--pebble);
  border: 1px solid var(--line);
  box-shadow: var(--pebble-shade);
}
.ui-at-cc__apps > span + span { margin-left: -4px; }
.ui-at-cc__connect[data-phase="loading"] .ui-at-cc__apps > span { animation: ui-at-cc-hop 520ms var(--ease) infinite; }
.ui-at-cc__connect[data-phase="loading"] .ui-at-cc__apps > span:nth-child(2) { animation-delay: 90ms; }
.ui-at-cc__connect[data-phase="loading"] .ui-at-cc__apps > span:nth-child(3) { animation-delay: 180ms; }

.ui-at-cc__card {
  position: relative;
  padding: 14px 12px 10px 16px;
  border-radius: 16px;
  background: var(--panel);
  border: 1px solid var(--line);
  box-shadow: var(--raised);
  cursor: text;
}
.ui-at-cc__fieldwrap { min-height: 30px; padding-right: 4px; }
.ui-at-cc__field {
  display: block;
  width: 100%;
  min-height: 30px;
  max-height: 200px;
  margin: 0;
  padding: 3px 0;
  border: 0;
  outline: none;
  resize: none;
  background: transparent;
  font: inherit;
  font-size: 16px;
  line-height: 1.5;
  color: var(--ink);
  caret-color: var(--berry);
}
.ui-at-cc__field::placeholder { color: var(--muted); }
.ui-at-cc__field:focus-visible { box-shadow: none; }
.ui-at-cc__card:focus-within { border-color: var(--info-line); }
.ui-at-cc__transcript { margin: 0; padding: 3px 0; font-size: 16px; line-height: 1.5; color: var(--ink); min-height: 30px; }
.ui-at-cc__word { transition: color 300ms var(--ease); animation: ui-at-cc-fade 300ms var(--ease) both; }
.ui-at-cc__word[data-pending] { color: var(--muted); }
.ui-at-cc__listening { color: var(--muted); }

.ui-at-cc__bar { display: flex; align-items: center; gap: 4px; margin-top: 10px; margin-left: -6px; animation: ui-at-cc-fade 300ms var(--ease) both; }
.ui-at-cc__spacer { flex: 1; min-width: 4px; }
.ui-at-cc__icon {
  flex: none;
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: var(--text);
  cursor: pointer;
  transition: background-color 150ms var(--ease), color 150ms var(--ease);
}
.ui-at-cc__icon:hover { background: var(--soft); color: var(--ink); }
.ui-at-cc__approval {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  min-width: 0;
  height: 34px;
  padding: 0 10px 0 7px;
  border: 1px solid transparent;
  border-radius: 10px;
  background: transparent;
  font-size: 14px;
  color: var(--text);
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 300ms var(--ease), border-color 300ms var(--ease), color 300ms var(--ease), padding 300ms var(--ease);
}
.ui-at-cc__approval:hover { background: var(--soft); color: var(--ink); }
.ui-at-cc__approvalicon { display: grid; place-items: center; }
.ui-at-cc__approval[data-phase="loading"] { cursor: progress; color: var(--ink); }
.ui-at-cc__approval[data-phase="loading"] .ui-at-cc__approvalicon { animation: ui-at-cc-wave 650ms var(--ease) 2; transform-origin: 60% 90%; }
.ui-at-cc__approval[data-phase="done"] { background: var(--bad-fill); border-color: var(--bad-line); color: var(--bad-ink); font-weight: 600; font-size: 13.5px; }
.ui-at-cc__approval[data-phase="done"] .ui-at-cc__approvalicon { animation: ui-at-cc-pop 300ms var(--ease) both; }
.ui-at-cc__approvallabel { overflow: hidden; text-overflow: ellipsis; animation: ui-at-cc-fade 300ms var(--ease) both; }

.ui-at-cc__modelwrap { position: relative; flex: none; }
.ui-at-cc__model {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 34px;
  padding: 0 8px 0 10px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  font-size: 14px;
  color: var(--text);
  cursor: pointer;
  transition: background-color 150ms var(--ease), color 150ms var(--ease);
}
.ui-at-cc__model svg { transition: transform 300ms var(--ease); }
.ui-at-cc__model[aria-expanded="true"] svg { transform: rotate(180deg); }
.ui-at-cc__model:hover, .ui-at-cc__model[aria-expanded="true"] { background: var(--soft); color: var(--ink); }
.ui-at-cc__list {
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  z-index: 10;
  width: 292px;
  max-width: calc(100cqw - 24px);
  margin: 0;
  padding: 6px;
  list-style: none;
  border-radius: 16px;
  background: var(--panel);
  border: 1px solid var(--line-firm);
  box-shadow: var(--raised);
  outline: none;
  transform-origin: top right;
  animation: ui-at-cc-morph 200ms var(--ease) both;
}
.ui-at-cc__list[data-up] { top: auto; bottom: calc(100% + 8px); transform-origin: bottom right; }
.ui-at-cc__list:focus-visible { box-shadow: var(--raised), 0 0 0 3px var(--ring); }
.ui-at-cc__hl {
  position: absolute;
  left: 6px;
  right: 6px;
  top: 6px;
  height: 54px;
  border-radius: 10px;
  background: var(--info-fill);
  box-shadow: inset 2px 0 0 var(--berry);
  transition: transform 150ms var(--ease);
  pointer-events: none;
}
.ui-at-cc__opt {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  height: 54px;
  padding: 0 10px;
  border-radius: 10px;
  cursor: pointer;
}
.ui-at-cc__opticon {
  flex: none;
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 9px;
  background: var(--pebble);
  border: 1px solid var(--line);
  box-shadow: var(--pebble-shade);
  color: var(--berry);
  font-size: 12px;
  font-weight: 700;
}
.ui-at-cc__opttext { flex: 1; min-width: 0; display: grid; line-height: 1.3; }
.ui-at-cc__optname { font-size: 14px; font-weight: 600; color: var(--ink); }
.ui-at-cc__optdesc { font-size: 12px; color: var(--muted); overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.ui-at-cc__tick { flex: none; color: var(--berry); }

.ui-at-cc__send {
  flex: none;
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  margin-left: 2px;
  border: 0;
  border-radius: 10px;
  background: var(--berry);
  color: var(--on-berry) !important;
  box-shadow: var(--berry-shadow);
  cursor: pointer;
  transition: background-color 150ms var(--ease), opacity 300ms var(--ease), box-shadow 150ms var(--ease);
}
.ui-at-cc__send:hover:not(:disabled) { background: var(--berry-hover); }
.ui-at-cc__send:disabled { background: var(--soft); color: var(--muted) !important; box-shadow: inset 0 0 0 1px var(--line); cursor: default; }

.ui-at-cc__trace {
  flex: 1;
  height: 24px;
  margin: 0 6px;
  overflow: hidden;
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 18%, #000 82%, transparent);
  mask-image: linear-gradient(90deg, transparent, #000 18%, #000 82%, transparent);
}
.ui-at-cc__trace span {
  display: block;
  width: 200%;
  height: 100%;
  background-image:
    radial-gradient(circle, var(--berry) 1.6px, transparent 2px),
    radial-gradient(circle, var(--info-ink) 1.3px, transparent 1.8px);
  background-size: 9px 8px, 9px 14px;
  background-position: 0 50%, 4.5px 50%;
  background-repeat: repeat-x;
  opacity: 0.8;
  animation: ui-at-cc-scroll 1.6s linear infinite;
}
.ui-at-cc__sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); clip-path: inset(50%); white-space: nowrap; }

@keyframes ui-at-cc-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes ui-at-cc-pop { from { transform: scale(0.6); opacity: 0; } to { transform: none; opacity: 1; } }
@keyframes ui-at-cc-morph { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: none; } }
@keyframes ui-at-cc-sweep { to { transform: translateX(100%); } }
@keyframes ui-at-cc-hop { 0%, 100% { transform: none; } 40% { transform: translateY(-4px); } }
@keyframes ui-at-cc-wave { 0%, 100% { transform: rotate(0); } 25% { transform: rotate(-16deg); } 60% { transform: rotate(12deg); } }
@keyframes ui-at-cc-scroll { to { transform: translateX(-50%); } }

@container (max-width: 420px) {
  .ui-at-cc__approvallabel { display: none; }
  .ui-at-cc__approval { padding: 0 8px; }
  .ui-at-cc__approval[data-phase="done"] .ui-at-cc__approvallabel { display: inline; max-width: 18ch; }
  .ui-at-cc__card { padding: 12px 10px 8px 14px; }
}
@container (max-width: 330px) {
  .ui-at-cc__approval[data-phase="done"] .ui-at-cc__approvallabel { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .ui-at-cc *, .ui-at-cc *::before, .ui-at-cc *::after {
    animation-duration: 0s !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0s !important;
  }
}
`;function Ee(){return e(B,{onSend:()=>{}})}export{Ee as default};
