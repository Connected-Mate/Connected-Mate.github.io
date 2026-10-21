import{t as te}from"./react-BkAXpnfr.js";var re=te();var{Children:_e,Component:xe,Fragment:he,StrictMode:ve,cloneElement:we,createContext:ke,createElement:ye,createRef:Ne,forwardRef:Re,isValidElement:Ce,lazy:Ae,memo:ze,startTransition:Se,Suspense:Me,use:Le,useCallback:Ee,useContext:Pe,useDebugValue:Ie,useDeferredValue:$e,useEffect:N,useId:F,useImperativeHandle:De,useInsertionEffect:je,useLayoutEffect:Te,useMemo:Be,useOptimistic:Fe,useReducer:qe,useRef:R,useState:u,useSyncExternalStore:He,useTransition:Ke}=re;import{t as ie}from"./jsx-runtime-CTsRTJUX.js";var ne=ie(),{jsx:e,jsxs:a,Fragment:C}=ne;var oe=[{id:"read",label:"Lire les acc\xE8s actuels",detail:"membres de l'application"},{id:"prepare",label:"Pr\xE9parer le changement",detail:"r\xF4le avant \u2192 r\xF4le apr\xE8s"},{id:"check",label:"V\xE9rifier l'impact",detail:"au moins un admin reste"},{id:"apply",label:"Appliquer en base",detail:"une seule transaction"},{id:"notify",label:"Pr\xE9venir les personnes",detail:"courriel automatique"}],q={"Aucun acc\xE8s":0,Lecteur:1,\u00C9diteur:2,Admin:3},_=o=>o.before===o.after?"same":o.before==="Aucun acc\xE8s"?"added":o.after==="Aucun acc\xE8s"?"removed":(q[o.after]??0)>(q[o.before]??0)?"up":"down",le={added:"Acc\xE8s ajout\xE9",removed:"Acc\xE8s retir\xE9",up:"R\xF4le \xE9lev\xE9",down:"R\xF4le r\xE9duit",same:"Inchang\xE9"},H=o=>o.split(/\s+/).filter(Boolean).slice(0,2).map(c=>c[0].toUpperCase()).join(""),se=o=>new Promise(c=>window.setTimeout(c,o));function ce(){let[o,c]=u(!1);return N(()=>{let d=window.matchMedia?.("(prefers-reduced-motion: reduce)");if(!d)return;let s=()=>c(d.matches);return s(),d.addEventListener?.("change",s),()=>d.removeEventListener?.("change",s)},[]),o}var A=({children:o,size:c=14})=>e("svg",{width:c,height:c,viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",focusable:"false",children:o}),de=()=>a(A,{size:16,children:[e("ellipse",{cx:"8",cy:"3.8",rx:"5",ry:"1.8"}),e("path",{d:"M3 3.8v8.4c0 1 2.2 1.8 5 1.8s5-.8 5-1.8V3.8M3 8c0 1 2.2 1.8 5 1.8S13 9 13 8"})]}),L=()=>e(A,{size:12,children:e("path",{d:"m3.5 8.4 3 2.9 6-6.3"})}),pe=()=>e(A,{size:12,children:e("path",{d:"M3 8h10M9.5 4.5 13 8l-3.5 3.5"})}),ue=()=>a(A,{size:13,children:[e("path",{d:"M5.5 4 2.5 7l3 3"}),e("path",{d:"M2.5 7h7a4 4 0 0 1 0 8H8"})]}),K=()=>a("svg",{className:"ui-at-rc__spin",width:"12",height:"12",viewBox:"0 0 16 16","aria-hidden":"true",focusable:"false",children:[e("circle",{cx:"8",cy:"8",r:"5.6",fill:"none",stroke:"currentColor",strokeOpacity:".25",strokeWidth:"2"}),e("path",{d:"M8 2.4a5.6 5.6 0 0 1 5.6 5.6",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"})]});function V({title:o,target:c,rows:d,steps:s=oe,doneBefore:z=3,requestedBy:x,onApply:E,onCancel:U,onUndo:O,undoSeconds:h=30,className:W}){let P=F(),Y=ce(),i=d.filter(t=>_(t)!=="same"),[r,f]=u("review"),[m,v]=u(Math.min(z,s.length)),[J,w]=u(new Set),[k,S]=u(null),[M,I]=u(h),[G,g]=u(""),b=R(!0),$=R(null),D=R(null);N(()=>(b.current=!0,()=>{b.current=!1}),[]),N(()=>{if(r!=="applied")return;I(h);let t=window.setInterval(()=>I(n=>Math.max(0,n-1)),1e3);return()=>window.clearInterval(t)},[r,h]);let y=t=>se(Y?0:t),Q=async()=>{if(!(r==="applying"||!i.length)){S(null),f("applying"),w(new Set),g(`Application de ${i.length} changement${i.length>1?"s":""}`);try{let t=E?E(d):y(900);for(let n=m;n<s.length-1;n++){if(await y(500),!b.current)return;n===s.length-2&&await t,v(n+1)}m>=s.length-1&&await t;for(let n of i){if(await y(220),!b.current)return;w(l=>new Set(l).add(n.id))}if(await y(350),!b.current)return;v(s.length),f("applied"),g(`${i.length} r\xF4le${i.length>1?"s":""} chang\xE9${i.length>1?"s":""}. Annulation possible ${h} secondes.`),window.setTimeout(()=>D.current?.focus(),0)}catch(t){if(!b.current)return;let n=t instanceof Error&&t.message?t.message:"La base n'a pas accept\xE9 le changement";S(n),f("review"),g(`\xC9chec : ${n}. Rien n'a \xE9t\xE9 modifi\xE9.`),window.setTimeout(()=>$.current?.focus(),0)}}},X=()=>{f("cancelled"),g("Changement abandonn\xE9, rien n'a \xE9t\xE9 modifi\xE9"),U?.()},Z=async()=>{try{await O?.(d),f("undone"),w(new Set),v(Math.min(z,s.length)),g("Changement annul\xE9, les r\xF4les d'avant sont revenus")}catch{g("L'annulation a \xE9chou\xE9, les nouveaux r\xF4les sont toujours en place")}},ee=()=>{f("review"),w(new Set),v(Math.min(z,s.length)),S(null)},ae=s.length?m/s.length:0,j=2*Math.PI*15,p={added:i.filter(t=>_(t)==="added").length,removed:i.filter(t=>_(t)==="removed").length,moved:i.filter(t=>["up","down"].includes(_(t))).length},T=r==="applied"?{tone:"ok",text:"Appliqu\xE9"}:r==="applying"?{tone:"info",text:"En cours"}:r==="cancelled"?{tone:"muted",text:"Abandonn\xE9"}:r==="undone"?{tone:"muted",text:"Annul\xE9"}:k?{tone:"bad",text:"\xC9chec"}:{tone:"wait",text:"\xC0 valider"};return a("section",{className:["ui-at-rc",W].filter(Boolean).join(" "),"data-status":r,"aria-labelledby":`${P}-t`,children:[e("style",{href:"ui-role-change",precedence:"default",children:fe}),a("div",{className:"ui-at-rc__project",children:[a("div",{className:"ui-at-rc__head",children:[a("span",{className:"ui-at-rc__ring","aria-hidden":"true",children:[a("svg",{viewBox:"0 0 36 36",children:[e("circle",{cx:"18",cy:"18",r:"15",className:"ui-at-rc__ring-bg"}),e("circle",{cx:"18",cy:"18",r:"15",className:"ui-at-rc__ring-fg",style:{strokeDasharray:j,strokeDashoffset:j*(1-ae)}})]}),e("span",{children:m})]}),a("div",{className:"ui-at-rc__titles",children:[e("h3",{id:`${P}-t`,className:"ui-at-rc__title",children:o}),a("p",{className:"ui-at-rc__sub",children:[e("span",{className:"ui-at-rc__chip","data-tone":T.tone,children:T.text}),c?a("span",{className:"ui-at-rc__target",children:[e(de,{}),c]}):null]})]}),x?e("span",{className:"ui-at-rc__avatar",title:`Demand\xE9 par ${x}`,"aria-label":`Demand\xE9 par ${x}`,children:H(x)}):null]}),e("ol",{className:"ui-at-rc__plan","aria-label":"\xC9tapes du changement",children:s.map((t,n)=>{let l=n<m?"done":n===m&&r==="applying"?"active":"todo";return a("li",{className:"ui-at-rc__step","data-state":l,children:[e("span",{className:"ui-at-rc__marker","aria-hidden":"true",children:l==="done"?e(L,{}):l==="active"?e(K,{}):n+1}),a("span",{className:"ui-at-rc__step-text",children:[e("span",{className:"ui-at-rc__step-label",children:t.label}),t.detail?e("span",{className:"ui-at-rc__step-detail",children:t.detail}):null]}),e("span",{className:"ui-at-rc__sr",children:l==="done"?"fait":l==="active"?"en cours":"\xE0 faire"})]},t.id)})})]}),a("div",{className:"ui-at-rc__panel",children:[a("div",{className:"ui-at-rc__summary",children:[e("span",{className:"ui-at-rc__kicker",children:"Changement en base"}),a("span",{className:"ui-at-rc__counts",children:[p.added?a("span",{"data-tone":"ok",children:["+",p.added," acc\xE8s"]}):null,p.moved?a("span",{"data-tone":"info",children:[p.moved," r\xF4le",p.moved>1?"s":""," modifi\xE9",p.moved>1?"s":""]}):null,p.removed?a("span",{"data-tone":"bad",children:["\u2212",p.removed," acc\xE8s"]}):null]})]}),d.length?e("div",{className:"ui-at-rc__scroll",children:a("table",{className:"ui-at-rc__table",children:[e("thead",{children:a("tr",{children:[e("th",{scope:"col",children:"Personne"}),e("th",{scope:"col",children:"R\xF4le avant"}),e("th",{scope:"col","aria-label":"devient"}),e("th",{scope:"col",children:"R\xF4le apr\xE8s"}),e("th",{scope:"col",className:"ui-at-rc__th-state",children:"\xC9tat"})]})}),e("tbody",{children:d.map((t,n)=>{let l=_(t),B=J.has(t.id)||r==="applied"&&l!=="same";return a("tr",{"data-kind":l,"data-ok":B||void 0,style:{animationDelay:`${n*60}ms`},children:[e("td",{children:a("span",{className:"ui-at-rc__person",children:[e("span",{className:"ui-at-rc__pebble","aria-hidden":"true",children:H(t.name)}),a("span",{className:"ui-at-rc__who",children:[e("span",{className:"ui-at-rc__name",children:t.name}),t.email?e("span",{className:"ui-at-rc__email",children:t.email}):null]})]})}),e("td",{children:e("span",{className:"ui-at-rc__role","data-old":l!=="same"||void 0,children:t.before})}),e("td",{className:"ui-at-rc__arrow","aria-hidden":"true",children:e(pe,{})}),e("td",{children:e("span",{className:"ui-at-rc__role","data-new":l!=="same"?l:void 0,children:t.after})}),e("td",{className:"ui-at-rc__state",children:B?a("span",{className:"ui-at-rc__done",children:[e(L,{}),"Fait"]}):e("span",{className:"ui-at-rc__kind","data-kind":l,children:le[l]})})]},t.id)})})]})}):e("p",{className:"ui-at-rc__empty",children:"Aucun changement \xE0 appliquer."}),k?a("p",{className:"ui-at-rc__error",role:"alert",children:[k,". Rien n'a \xE9t\xE9 modifi\xE9."]}):null]}),e("div",{className:"ui-at-rc__foot",children:r==="applied"?a(C,{children:[a("p",{className:"ui-at-rc__result",tabIndex:-1,ref:D,children:[e("span",{className:"ui-at-rc__result-mark","aria-hidden":"true",children:e(L,{})}),i.length," r\xF4le",i.length>1?"s":""," chang\xE9",i.length>1?"s":"",M>0?a("span",{className:"ui-at-rc__left",children:[" \xB7 annulable ",M," s"]}):null]}),M>0?a("button",{type:"button",className:"ui-at-rc__btn",onClick:Z,children:[e(ue,{}),"Annuler"]}):null]}):r==="cancelled"||r==="undone"?a(C,{children:[e("p",{className:"ui-at-rc__result ui-at-rc__result--muted",children:r==="cancelled"?"Changement abandonn\xE9, rien n'a \xE9t\xE9 modifi\xE9.":"Changement annul\xE9, les r\xF4les d'avant sont revenus."}),e("button",{type:"button",className:"ui-at-rc__btn",onClick:ee,children:"Revoir le changement"})]}):a(C,{children:[e("span",{className:"ui-at-rc__hint",children:r==="applying"?"\xC9criture en base\u2026":`${i.length} personne${i.length>1?"s":""} concern\xE9e${i.length>1?"s":""}`}),a("div",{className:"ui-at-rc__actions",children:[e("button",{type:"button",className:"ui-at-rc__btn ui-at-rc__btn--ghost",onClick:X,disabled:r==="applying",children:"Abandonner"}),a("button",{ref:$,type:"button",className:"ui-at-rc__btn ui-at-rc__btn--main",onClick:Q,disabled:r==="applying"||!i.length,"aria-busy":r==="applying",children:[r==="applying"?e(K,{}):null,r==="applying"?"Application\u2026":k?"R\xE9essayer":"Appliquer le changement"]})]})]})}),e("p",{className:"ui-at-rc__sr",role:"status","aria-live":"polite",children:G})]})}var fe=`
.ui-at-rc {
  --frame: #f2f6fa; --panel: #ffffff; --soft: rgba(26, 62, 112, 0.06);
  --line: #dae2ec; --line-firm: #cbd6e4;
  --ink: #00162b; --text: rgba(0, 22, 43, 0.66); --muted: rgba(0, 22, 43, 0.54);
  --berry: #851437; --berry-hover: #6d0f2d;
  --info-ink: #1a3e70; --info-fill: #eef5ff; --info-line: #c1daff; --ring: #8fbdf2;
  --ok-ink: #1d6a34; --ok-fill: #eafbee; --ok-line: #c9f5cf;
  --wait-ink: #775810; --wait-fill: #fdf6dd; --wait-line: #fae6a0;
  --bad-ink: #8a3a22; --bad-fill: #fdeee8; --bad-line: #f5d5c9;
  --secondary: #fbfcfe;
  --pebble: inset 0 -2px 6px -4px rgba(26, 62, 112, 0.4);
  --drop: 0 8px 16px -8px rgba(26, 62, 112, 0.2);
  --raised: 0 18px 30px -16px rgba(26, 62, 112, 0.38), 0 4px 10px -6px rgba(26, 62, 112, 0.18);
  --float: 0 24px 48px -24px rgba(26, 62, 112, 0.3);
  --ease: cubic-bezier(.16, 1, .3, 1);
  box-sizing: border-box;
  width: 100%;
  max-width: 680px;
  padding: 6px;
  border-radius: 22px;
  background: var(--frame);
  border: 1px solid var(--line);
  box-shadow: var(--float);
  font-family: "Avenir Next", Avenir, system-ui, sans-serif;
  font-size: 14px;
  line-height: 1.45;
  color: var(--text);
  text-align: left;
  -webkit-font-smoothing: antialiased;
}
:where(.dark, [data-theme="dark"]) .ui-at-rc {
  --frame: #0f2747; --panel: #16345c; --soft: rgba(255, 255, 255, 0.07);
  --line: rgba(255, 255, 255, 0.12); --line-firm: rgba(255, 255, 255, 0.18);
  --ink: rgba(255, 255, 255, 0.94); --text: rgba(255, 255, 255, 0.72); --muted: rgba(255, 255, 255, 0.56);
  --berry: #a8204d; --berry-hover: #bd2a5a;
  --info-ink: #c1daff; --info-fill: rgba(143, 189, 242, 0.16); --info-line: rgba(143, 189, 242, 0.34); --ring: rgba(143, 189, 242, 0.6);
  --ok-ink: #7fe0a0; --ok-fill: rgba(127, 224, 160, 0.14); --ok-line: rgba(127, 224, 160, 0.3);
  --wait-ink: #f3d27a; --wait-fill: rgba(243, 210, 122, 0.14); --wait-line: rgba(243, 210, 122, 0.3);
  --bad-ink: #f2a48c; --bad-fill: rgba(242, 164, 140, 0.14); --bad-line: rgba(242, 164, 140, 0.3);
  --secondary: rgba(255, 255, 255, 0.06);
  --pebble: inset 0 -2px 6px -4px rgba(3, 12, 28, 0.8);
  --drop: 0 8px 16px -8px rgba(3, 12, 28, 0.6);
  --raised: 0 18px 30px -16px rgba(3, 12, 28, 0.8), 0 4px 10px -6px rgba(3, 12, 28, 0.6);
  --float: 0 24px 48px -24px rgba(3, 12, 28, 0.7);
}
.ui-at-rc *, .ui-at-rc *::before, .ui-at-rc *::after { box-sizing: border-box; }
.ui-at-rc button { font: inherit; }
.ui-at-rc :focus-visible { outline: none; box-shadow: 0 0 0 3px var(--ring); }
.ui-at-rc__sr { position: absolute; width: 1px; height: 1px; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }

/* Project card */
.ui-at-rc__project {
  background: var(--panel); border: 1px solid var(--line); border-radius: 16px; box-shadow: var(--raised);
  padding: 16px 16px 12px;
}
.ui-at-rc__head { display: flex; align-items: center; gap: 12px; }
.ui-at-rc__ring { position: relative; flex: none; width: 40px; height: 40px; display: grid; place-items: center; }
.ui-at-rc__ring svg { position: absolute; inset: 0; transform: rotate(-90deg); }
.ui-at-rc__ring circle { fill: none; stroke-width: 3; }
.ui-at-rc__ring-bg { stroke: var(--soft); }
.ui-at-rc__ring-fg { stroke: var(--berry); stroke-linecap: round; transition: stroke-dashoffset 450ms var(--ease); }
.ui-at-rc__ring > span { font-size: 13px; font-weight: 700; color: var(--ink); font-variant-numeric: tabular-nums; }
.ui-at-rc__titles { min-width: 0; flex: 1; }
.ui-at-rc__title {
  margin: 0; color: var(--ink); font-weight: 700; font-size: 18px; line-height: 1.25;
  font-family: "Avenir Next Condensed", "Avenir Next", Avenir, system-ui, sans-serif; overflow-wrap: anywhere;
}
.ui-at-rc__sub { margin: 4px 0 0; display: flex; align-items: center; flex-wrap: wrap; gap: 8px; font-size: 12.5px; color: var(--muted); }
.ui-at-rc__chip {
  display: inline-flex; align-items: center; height: 22px; padding: 0 9px; border-radius: 999px; border: 1px solid;
  font-weight: 600; transition: background-color 300ms var(--ease), color 300ms var(--ease), border-color 300ms var(--ease);
}
.ui-at-rc__chip[data-tone="wait"] { background: var(--wait-fill); color: var(--wait-ink); border-color: var(--wait-line); }
.ui-at-rc__chip[data-tone="info"] { background: var(--info-fill); color: var(--info-ink); border-color: var(--info-line); }
.ui-at-rc__chip[data-tone="ok"] { background: var(--ok-fill); color: var(--ok-ink); border-color: var(--ok-line); }
.ui-at-rc__chip[data-tone="bad"] { background: var(--bad-fill); color: var(--bad-ink); border-color: var(--bad-line); }
.ui-at-rc__chip[data-tone="muted"] { background: var(--soft); color: var(--muted); border-color: var(--line); }
.ui-at-rc__target { display: inline-flex; align-items: center; gap: 5px; font-family: ui-monospace, "SF Mono", Menlo, monospace; font-size: 12px; }
.ui-at-rc__avatar {
  flex: none; display: grid; place-items: center; width: 30px; height: 30px; border-radius: 999px;
  background: var(--info-fill); border: 1px solid var(--info-line); color: var(--info-ink); font-size: 11.5px; font-weight: 700;
}

.ui-at-rc__plan { list-style: none; margin: 14px 0 0; padding: 12px 0 0; border-top: 1px solid var(--line); display: grid; gap: 2px; }
.ui-at-rc__step { position: relative; display: flex; align-items: flex-start; gap: 10px; padding: 5px 6px; border-radius: 10px; }
.ui-at-rc__step:not(:last-child)::after {
  content: ""; position: absolute; left: 16px; top: 28px; bottom: -6px; width: 1px; background: var(--line);
}
.ui-at-rc__step[data-state="done"]:not(:last-child)::after { background: var(--berry); opacity: .45; }
.ui-at-rc__step[data-state="active"] { background: var(--info-fill); box-shadow: inset 2px 0 0 var(--berry); }
.ui-at-rc__marker {
  position: relative; z-index: 1; flex: none; display: grid; place-items: center; width: 22px; height: 22px; border-radius: 999px;
  background: var(--panel); border: 1px solid var(--line-firm); box-shadow: var(--pebble);
  font-size: 11px; font-weight: 700; color: var(--muted); font-variant-numeric: tabular-nums;
  transition: background-color 300ms var(--ease), border-color 300ms var(--ease), color 300ms var(--ease);
}
.ui-at-rc__step[data-state="done"] .ui-at-rc__marker { background: var(--berry); border-color: var(--berry); color: #fff; box-shadow: none; animation: ui-at-rc-pop 300ms var(--ease); }
.ui-at-rc__step[data-state="active"] .ui-at-rc__marker { color: var(--info-ink); border-color: var(--info-line); }
.ui-at-rc__step-text { display: grid; min-width: 0; padding-top: 1px; }
.ui-at-rc__step-label { color: var(--ink); font-weight: 600; font-size: 13.5px; }
.ui-at-rc__step[data-state="todo"] .ui-at-rc__step-label { color: var(--text); font-weight: 500; }
.ui-at-rc__step-detail { font-size: 12px; color: var(--muted); }
.ui-at-rc__spin { animation: ui-at-rc-spin 900ms linear infinite; }

/* The change */
.ui-at-rc__panel {
  margin-top: 6px; background: var(--panel); border: 1px solid var(--line); border-radius: 16px; box-shadow: var(--raised);
  overflow: hidden;
}
.ui-at-rc__summary { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; padding: 12px 16px 10px; }
.ui-at-rc__kicker { font-size: 10.5px; font-weight: 600; letter-spacing: .09em; text-transform: uppercase; color: var(--muted); }
.ui-at-rc__counts { display: inline-flex; flex-wrap: wrap; gap: 6px; }
.ui-at-rc__counts > span { height: 22px; display: inline-flex; align-items: center; padding: 0 8px; border-radius: 999px; border: 1px solid; font-size: 12px; font-weight: 600; font-variant-numeric: tabular-nums; }
.ui-at-rc__counts [data-tone="ok"] { background: var(--ok-fill); color: var(--ok-ink); border-color: var(--ok-line); }
.ui-at-rc__counts [data-tone="info"] { background: var(--info-fill); color: var(--info-ink); border-color: var(--info-line); }
.ui-at-rc__counts [data-tone="bad"] { background: var(--bad-fill); color: var(--bad-ink); border-color: var(--bad-line); }

.ui-at-rc__scroll { overflow-x: auto; scrollbar-width: thin; }
.ui-at-rc__table { width: 100%; min-width: 520px; border-collapse: collapse; font-size: 13.5px; }
.ui-at-rc__table th {
  height: 34px; padding: 0 12px; text-align: left; font-weight: 600; font-size: 11.5px; color: var(--muted);
  border-top: 1px solid var(--line); background: var(--soft);
}
.ui-at-rc__table td { height: 52px; padding: 0 12px; border-top: 1px solid var(--line); vertical-align: middle; }
.ui-at-rc__table tbody tr { animation: ui-at-rc-rise 300ms var(--ease) both; transition: background-color 300ms var(--ease); }
.ui-at-rc__table tbody tr[data-kind="same"] { opacity: .62; }
.ui-at-rc__table tbody tr[data-ok] { background: color-mix(in srgb, var(--ok-fill) 55%, transparent); }
.ui-at-rc__th-state { text-align: right !important; }
.ui-at-rc__person { display: flex; align-items: center; gap: 10px; min-width: 0; }
.ui-at-rc__pebble {
  flex: none; display: grid; place-items: center; width: 28px; height: 28px; border-radius: 9px;
  background: var(--panel); border: 1px solid var(--line); box-shadow: var(--pebble);
  font-size: 11px; font-weight: 700; color: var(--info-ink);
}
.ui-at-rc__who { display: grid; min-width: 0; }
.ui-at-rc__name { color: var(--ink); font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ui-at-rc__email { font-size: 12px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ui-at-rc__role {
  display: inline-flex; align-items: center; height: 24px; padding: 0 9px; border-radius: 8px; white-space: nowrap;
  background: var(--soft); border: 1px solid var(--line); color: var(--text); font-weight: 500;
}
.ui-at-rc__role[data-old] { text-decoration: line-through; text-decoration-color: var(--bad-ink); color: var(--muted); }
.ui-at-rc__role[data-new] { font-weight: 600; }
.ui-at-rc__role[data-new="added"], .ui-at-rc__role[data-new="up"] { background: var(--ok-fill); border-color: var(--ok-line); color: var(--ok-ink); }
.ui-at-rc__role[data-new="down"] { background: var(--wait-fill); border-color: var(--wait-line); color: var(--wait-ink); }
.ui-at-rc__role[data-new="removed"] { background: var(--bad-fill); border-color: var(--bad-line); color: var(--bad-ink); }
.ui-at-rc__arrow { width: 28px; padding: 0 !important; color: var(--muted); }
.ui-at-rc__state { text-align: right; white-space: nowrap; }
.ui-at-rc__kind { font-size: 12px; color: var(--muted); }
.ui-at-rc__kind[data-kind="added"], .ui-at-rc__kind[data-kind="up"] { color: var(--ok-ink); }
.ui-at-rc__kind[data-kind="removed"] { color: var(--bad-ink); }
.ui-at-rc__kind[data-kind="down"] { color: var(--wait-ink); }
.ui-at-rc__done {
  display: inline-flex; align-items: center; gap: 4px; height: 22px; padding: 0 8px; border-radius: 999px;
  background: var(--ok-fill); border: 1px solid var(--ok-line); color: var(--ok-ink); font-size: 12px; font-weight: 600;
  animation: ui-at-rc-pop 300ms var(--ease);
}
.ui-at-rc__empty { margin: 0; padding: 18px 16px 20px; color: var(--muted); border-top: 1px solid var(--line); }
.ui-at-rc__error {
  margin: 0; padding: 10px 16px; border-top: 1px solid var(--bad-line); background: var(--bad-fill); color: var(--bad-ink);
  font-size: 13px; font-weight: 600;
}

/* Footer, in the frame */
.ui-at-rc__foot { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; min-height: 52px; padding: 8px 6px 2px 12px; }
.ui-at-rc__hint { font-size: 13px; color: var(--muted); }
.ui-at-rc__actions { display: flex; gap: 8px; margin-left: auto; }
.ui-at-rc__btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 7px; height: 36px; padding: 0 14px;
  border-radius: 10px; border: 1px solid var(--line-firm); background: var(--secondary); box-shadow: var(--drop);
  color: var(--ink); font-size: 13.5px; font-weight: 600; cursor: pointer; white-space: nowrap;
  transition: background-color 150ms var(--ease), transform 150ms var(--ease), opacity 150ms var(--ease);
}
.ui-at-rc__btn:hover:not(:disabled) { background: var(--soft); }
.ui-at-rc__btn:active:not(:disabled) { transform: translateY(1px); }
.ui-at-rc__btn:disabled { opacity: .55; cursor: default; }
.ui-at-rc__btn--ghost { background: transparent; border-color: transparent; box-shadow: none; color: var(--text); }
.ui-at-rc .ui-at-rc__btn--main {
  background: var(--berry); border-color: var(--berry); color: #fff;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 6px 12px -6px rgba(133, 20, 55, 0.6);
}
.ui-at-rc .ui-at-rc__btn--main:hover:not(:disabled) { background: var(--berry-hover); border-color: var(--berry-hover); }
.ui-at-rc__result { margin: 0; display: inline-flex; align-items: center; gap: 8px; color: var(--ink); font-weight: 600; outline: none; }
.ui-at-rc__result:focus-visible { box-shadow: none; }
.ui-at-rc__result--muted { color: var(--text); font-weight: 500; }
.ui-at-rc__result-mark {
  display: grid; place-items: center; width: 22px; height: 22px; border-radius: 999px;
  background: var(--ok-fill); border: 1px solid var(--ok-line); color: var(--ok-ink); animation: ui-at-rc-pop 300ms var(--ease);
}
.ui-at-rc__left { color: var(--muted); font-weight: 500; font-variant-numeric: tabular-nums; }

@keyframes ui-at-rc-spin { to { transform: rotate(360deg); } }
@keyframes ui-at-rc-pop { from { transform: scale(.6); opacity: 0; } to { transform: none; opacity: 1; } }
@keyframes ui-at-rc-rise { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }

@media (max-width: 560px) {
  .ui-at-rc__table { min-width: 0; }
  .ui-at-rc__table thead { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
  .ui-at-rc__table tbody tr {
    display: grid; grid-template-columns: auto auto 1fr; align-items: center; gap: 8px 8px;
    padding: 12px 14px; border-top: 1px solid var(--line);
  }
  .ui-at-rc__table td { height: auto; padding: 0; border: 0; }
  .ui-at-rc__table td:first-child { grid-column: 1 / -1; }
  .ui-at-rc__state { grid-column: 1 / -1; text-align: left; }
}
@media (max-width: 480px) {
  .ui-at-rc__project { padding: 14px 12px 10px; }
  .ui-at-rc__actions { width: 100%; }
  .ui-at-rc__actions .ui-at-rc__btn--main { flex: 1; }
}
@media (pointer: coarse) {
  .ui-at-rc__btn { height: 44px; }
}
@media (prefers-reduced-motion: reduce) {
  .ui-at-rc *, .ui-at-rc *::before, .ui-at-rc *::after { animation: none !important; transition-duration: 0ms !important; }
}
`;var me=[{id:"1",name:"Camille Durand",email:"camille.durand@sncf.fr",before:"Lecteur",after:"\xC9diteur"},{id:"2",name:"Hugo Martin",email:"hugo.martin@sncf.fr",before:"Aucun acc\xE8s",after:"Lecteur"},{id:"3",name:"L\xE9a Bernard",email:"lea.bernard@sncf.fr",before:"Admin",after:"Admin"},{id:"4",name:"Thomas Petit",email:"thomas.petit@sncf.fr",before:"\xC9diteur",after:"Aucun acc\xE8s"},{id:"5",name:"In\xE8s Moreau",email:"ines.moreau@sncf.fr",before:"\xC9diteur",after:"Lecteur"}];function ge(){return e(V,{title:"R\xF4les d'acc\xE8s \u2013 Formulaires",target:"app_formulaires.membres",requestedBy:"Alex Martin",rows:me})}export{ge as default};
