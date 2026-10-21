import{t as ue}from"./react-BkAXpnfr.js";var ce=ue();var{Children:Ne,Component:Te,Fragment:Ce,StrictMode:Re,cloneElement:Pe,createContext:Se,createElement:$e,createRef:De,forwardRef:Le,isValidElement:Ae,lazy:He,memo:ze,startTransition:Be,Suspense:Ie,use:Ke,useCallback:G,useContext:Oe,useDebugValue:Fe,useDeferredValue:je,useEffect:R,useId:J,useImperativeHandle:qe,useInsertionEffect:We,useLayoutEffect:Ve,useMemo:Ue,useOptimistic:Xe,useReducer:Qe,useRef:y,useState:c,useSyncExternalStore:Ge,useTransition:Je}=ce;import{t as fe}from"./jsx-runtime-CTsRTJUX.js";var ge=fe(),{jsx:e,jsxs:r,Fragment:Y}=ge;var I=["low","medium","high"],be={low:"Low",medium:"Medium",high:"High"},_e={low:1.6,medium:2.5,high:4};function D(i,d,o){let[f,g]=c(d),s=i===void 0?f:i,h=G(l=>{i===void 0&&g(l),o?.(l)},[i,o]);return[s,h]}var he=i=>i.speed===void 0&&i.quality===void 0&&i.cost===void 0;function ie({models:i,value:d,defaultValue:o,onChange:f,thinking:g,defaultThinking:s=!1,onThinkingChange:h,webSearch:l,defaultWebSearch:E=!1,onWebSearchChange:N,effort:L,defaultEffort:K="medium",onEffortChange:P,open:b,defaultOpen:a=!1,onOpenChange:p,align:S="start",side:O="bottom",className:A}){let n=J(),[H,ne]=D(d,o??i[0]?.id??"",f),[k,re]=D(g,s,h),[q,ae]=D(l,E,N),[W,oe]=D(L,K,P),[u,$]=D(b,a,p),T=Math.max(0,i.findIndex(t=>t.id===H)),C=i[T],[x,z]=c(T),[de,le]=c(""),V=y(null),U=y(null),F=y(null),B=y(!1);R(()=>{u&&(z(T),B.current&&(B.current=!1,F.current?.focus({preventScroll:!0})))},[u]),R(()=>{if(!u)return;let t=m=>{V.current?.contains(m.target)||$(!1)};return document.addEventListener("pointerdown",t),()=>document.removeEventListener("pointerdown",t)},[u,$]);let w=i[Math.min(x,i.length-1)]??C,se=k?_e[W]:1,M=w?.latencyMs!==void 0?w.latencyMs*se/1e3:void 0,v=w?.pricePerM;R(()=>{if(!u||!w)return;let t=window.setTimeout(()=>{le(M===void 0&&v===void 0?`${w.name}: speed and price vary by message`:`${w.name}: about ${M?.toFixed(1)} seconds to first token${v!==void 0?`, $${v} per million tokens`:""}`)},700);return()=>window.clearTimeout(t)},[u,w,M,v]);let X=(t=!0)=>{$(!1),t&&U.current?.focus()},Q=t=>{let m=i[t];m&&(ne(m.id),X())},me=t=>{if(["ArrowDown","ArrowUp","Enter"," "].includes(t.key)){if(t.preventDefault(),u){F.current?.focus();return}B.current=!0,$(!0)}},pe=t=>{let m=i.length-1,_=null;if(t.key==="ArrowDown")_=Math.min(m,x+1);else if(t.key==="ArrowUp")_=Math.max(0,x-1);else if(t.key==="Home")_=0;else if(t.key==="End")_=m;else if(t.key==="Enter"||t.key===" "){t.preventDefault(),Q(x);return}_!==null&&(t.preventDefault(),z(_))};return r("div",{ref:V,className:["ui-mdl",A].filter(Boolean).join(" "),"data-open":u?"":void 0,"data-side":O,"data-align":S,children:[e("style",{href:"ui-model-picker",precedence:"default",children:ye}),r("button",{ref:U,type:"button",className:"ui-mdl__trigger","aria-haspopup":"dialog","aria-expanded":u,"aria-controls":`${n}-menu`,"aria-label":`Model: ${C?.name??"none"}${k?", extended thinking on":""}`,onClick:()=>{u||(B.current=!0),$(!u)},onKeyDown:me,children:[e("span",{className:"ui-mdl__glyph ui-mdl__glyph--sm","aria-hidden":"true",children:C?.icon??C?.name.charAt(0)}),e("span",{className:"ui-mdl__trigger-name",children:C?.name},C?.id),e("span",{className:"ui-mdl__bulb","data-on":k?"":void 0,"aria-hidden":"true",children:e(te,{})}),e("svg",{className:"ui-mdl__chev",viewBox:"0 0 12 12","aria-hidden":"true",children:e("path",{d:"M3 7.5L6 4.5l3 3"})})]}),r("div",{id:`${n}-menu`,className:"ui-mdl__menu",role:"dialog","aria-label":"Model settings",inert:!u,onKeyDown:t=>{t.key==="Escape"&&(t.preventDefault(),t.stopPropagation(),X())},children:[r("div",{className:"ui-mdl__panel",children:[r("div",{className:"ui-mdl__head","aria-hidden":"true",children:[e("span",{children:"Model"}),r("span",{className:"ui-mdl__cols",children:[e("span",{children:"Speed"}),e("span",{children:"Quality"}),e("span",{children:"Cost"})]})]}),e("div",{ref:F,className:"ui-mdl__list",role:"listbox",tabIndex:0,"aria-label":"Model","aria-activedescendant":`${n}-m${x}`,"data-pointing":x!==T?"":void 0,onKeyDown:pe,onPointerLeave:()=>z(T),children:i.map((t,m)=>{let _=m===T;return r("div",{id:`${n}-m${m}`,role:"option","aria-selected":_,className:"ui-mdl__row","data-hot":m===x?"":void 0,onPointerMove:()=>m!==x&&z(m),onClick:()=>Q(m),children:[e("span",{className:"ui-mdl__glyph","aria-hidden":"true",children:t.icon??t.name.charAt(0)}),r("span",{className:"ui-mdl__text",children:[r("span",{className:"ui-mdl__name",children:[t.name,_?e("svg",{className:"ui-mdl__tick",viewBox:"0 0 12 12","aria-hidden":"true",children:e("path",{d:"M2.8 6.3l2.1 2.1 4.3-4.8"})}):null]}),t.description?e("span",{className:"ui-mdl__desc",children:t.description}):null]}),he(t)?e("span",{className:"ui-mdl__varies",children:"Varies"}):r("span",{className:"ui-mdl__cols ui-mdl__bars","aria-hidden":"true",children:[e(j,{n:t.speed}),e(j,{n:t.quality}),e(j,{n:t.cost})]})]},t.id)})}),e("div",{className:"ui-mdl__sep"}),e(Z,{id:`${n}-think`,icon:e(te,{}),label:"Extended thinking",on:k,onToggle:()=>re(!k)}),e("div",{className:"ui-mdl__effort-wrap","data-show":k?"":void 0,inert:!k,children:e("div",{className:"ui-mdl__effort-inner",children:r("div",{className:"ui-mdl__setting ui-mdl__setting--effort",children:[e("span",{className:"ui-mdl__setting-icon","aria-hidden":"true"}),e("span",{className:"ui-mdl__setting-label",id:`${n}-effort`,children:"Effort"}),e(xe,{value:W,onChange:oe,labelledBy:`${n}-effort`})]})})}),e(Z,{id:`${n}-web`,icon:e(ve,{}),label:"Web search",on:q,onToggle:()=>ae(!q)})]}),r("div",{className:"ui-mdl__tray",children:[e("span",{className:"ui-mdl__stats","aria-hidden":"true",children:M===void 0&&v===void 0?e("span",{children:"Speed and price vary by message"}):r(Y,{children:[M!==void 0?r("span",{children:["~",e("b",{children:e(ee,{value:M,format:t=>`${t.toFixed(1)}s`})})," first token"]}):null,M!==void 0&&v!==void 0?e("span",{className:"ui-mdl__dot",children:"\xB7"}):null,v!==void 0?r("span",{children:[e("b",{children:e(ee,{value:v,format:t=>`$${Math.round(t)}`})})," / M tokens"]}):null]})}),r("span",{className:"ui-mdl__keys","aria-hidden":"true",children:[e("kbd",{children:"\u2191\u2193"}),e("kbd",{children:"\u21B5"})]})]}),e("span",{className:"ui-mdl__sr","aria-live":"polite",children:de})]})]})}function j({n:i=0}){let d=Math.max(0,Math.min(5,Math.round(i)));return e("span",{className:"ui-mdl__bar",children:[0,1,2,3,4].map(o=>e("i",{"data-on":o<d?"":void 0,style:{transitionDelay:`${o*30}ms`}},o))})}function Z({id:i,icon:d,label:o,on:f,onToggle:g}){return r("div",{className:"ui-mdl__setting",onClick:s=>{s.target.closest("button")||g()},children:[e("span",{className:"ui-mdl__setting-icon","aria-hidden":"true",children:d}),e("span",{className:"ui-mdl__setting-label",id:`${i}-l`,children:o}),e("button",{type:"button",role:"switch","aria-checked":f,"aria-labelledby":`${i}-l`,className:"ui-mdl__switch",onClick:g,children:e("span",{className:"ui-mdl__knob"})})]})}function xe({value:i,onChange:d,labelledBy:o}){let f=y([]),g=I.indexOf(i);return r("div",{className:"ui-mdl__effort",role:"radiogroup","aria-labelledby":o,style:{"--i":g},children:[e("span",{className:"ui-mdl__thumb","aria-hidden":"true"}),I.map((s,h)=>e("button",{ref:l=>{f.current[h]=l},type:"button",role:"radio","aria-checked":i===s,tabIndex:i===s?0:-1,className:"ui-mdl__effort-opt",onClick:()=>d(s),onKeyDown:l=>{let E=l.key==="ArrowRight"||l.key==="ArrowDown"?1:l.key==="ArrowLeft"||l.key==="ArrowUp"?-1:0;if(!E)return;l.preventDefault();let N=Math.max(0,Math.min(I.length-1,h+E));d(I[N]),f.current[N]?.focus()},children:be[s]},s))]})}function ee({value:i,format:d}){let o=d(i);return e("span",{className:"ui-mdl__roll",children:e("span",{children:o},o)})}function te(){return e("svg",{viewBox:"0 0 16 16",children:e("path",{d:"M6 12.5h4M6.5 14.5h3M8 1.8a4.2 4.2 0 00-2.5 7.6c.5.4.8 1 .8 1.6v.3h3.4V11c0-.6.3-1.2.8-1.6A4.2 4.2 0 008 1.8z"})})}function ve(){return r("svg",{viewBox:"0 0 16 16",children:[e("circle",{cx:"8",cy:"8",r:"5.8"}),e("path",{d:"M2.2 8h11.6M8 2.2c1.6 1.6 2.4 3.6 2.4 5.8S9.6 12.2 8 13.8M8 2.2C6.4 3.8 5.6 5.8 5.6 8s.8 4.2 2.4 5.8"})]})}var ye=`
.ui-mdl {
  --mdl-frame: #f2f6fa;
  --mdl-panel: #ffffff;
  --mdl-soft: rgba(26, 62, 112, 0.06);
  --mdl-line: #dae2ec;
  --mdl-firm: #cbd6e4;
  --mdl-ink: #00162b;
  --mdl-text: rgba(0, 22, 43, 0.66);
  --mdl-muted: rgba(0, 22, 43, 0.54);
  --mdl-faint: rgba(0, 22, 43, 0.36);
  --mdl-berry: #851437;
  --mdl-info-ink: #1a3e70;
  --mdl-info-fill: #eef5ff;
  --mdl-info-line: #c1daff;
  --mdl-ring: #8fbdf2;
  --mdl-seg-on: #00162b;
  --mdl-seg-dim: #b9c6d6;
  --mdl-seg-off: #e6ecf3;
  --mdl-switch-off: #d5dee9;
  --mdl-pebble: inset 0 -2px 6px -4px rgba(26, 62, 112, 0.4);
  --mdl-drop: 0 8px 16px -8px rgba(26, 62, 112, 0.2);
  --mdl-float: 0 24px 48px -24px rgba(26, 62, 112, 0.3), 0 8px 16px -8px rgba(26, 62, 112, 0.18);
  --mdl-ease: cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  display: inline-block;
  font-family: "Avenir Next", Avenir, system-ui, sans-serif;
  font-size: 14px;
  line-height: 1.35;
  color: var(--mdl-ink);
  -webkit-font-smoothing: antialiased;
}
:where(.dark, [data-theme="dark"]) .ui-mdl {
  --mdl-frame: #0f2747;
  --mdl-panel: #16345c;
  --mdl-soft: rgba(255, 255, 255, 0.07);
  --mdl-line: rgba(255, 255, 255, 0.12);
  --mdl-firm: rgba(255, 255, 255, 0.18);
  --mdl-ink: rgba(255, 255, 255, 0.94);
  --mdl-text: rgba(255, 255, 255, 0.72);
  --mdl-muted: rgba(255, 255, 255, 0.56);
  --mdl-faint: rgba(255, 255, 255, 0.36);
  --mdl-berry: #a8204d;
  --mdl-info-ink: #c1daff;
  --mdl-info-fill: rgba(143, 189, 242, 0.16);
  --mdl-info-line: rgba(143, 189, 242, 0.34);
  --mdl-ring: rgba(143, 189, 242, 0.6);
  --mdl-seg-on: rgba(255, 255, 255, 0.94);
  --mdl-seg-dim: rgba(255, 255, 255, 0.32);
  --mdl-seg-off: rgba(255, 255, 255, 0.1);
  --mdl-switch-off: rgba(255, 255, 255, 0.2);
  --mdl-pebble: inset 0 -2px 6px -4px rgba(3, 12, 28, 0.8);
  --mdl-drop: 0 8px 16px -8px rgba(3, 12, 28, 0.6);
  --mdl-float: 0 24px 48px -24px rgba(3, 12, 28, 0.8), 0 8px 16px -8px rgba(3, 12, 28, 0.6);
}
.ui-mdl *, .ui-mdl *::before, .ui-mdl *::after { box-sizing: border-box; }
:where(.ui-mdl) button { font: inherit; color: inherit; }
.ui-mdl :focus-visible { outline: 2px solid var(--mdl-ring); outline-offset: 2px; }

.ui-mdl__trigger {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 32px;
  padding: 0 8px 0 5px;
  border: 1px solid transparent;
  border-radius: 10px;
  background: var(--mdl-soft);
  cursor: pointer;
  font-weight: 600;
  transition: background-color 150ms var(--mdl-ease), border-color 150ms var(--mdl-ease);
}
.ui-mdl__trigger:hover, .ui-mdl[data-open] .ui-mdl__trigger { border-color: var(--mdl-line); background: var(--mdl-panel); }
.ui-mdl__trigger-name { white-space: nowrap; animation: ui-mdl-fade 300ms var(--mdl-ease); }
.ui-mdl__bulb { display: grid; place-items: center; width: 0; overflow: hidden; opacity: 0; color: var(--mdl-berry); transition: width 150ms var(--mdl-ease), opacity 150ms var(--mdl-ease); }
.ui-mdl__bulb[data-on] { width: 14px; opacity: 1; }
.ui-mdl__bulb svg { width: 14px; height: 14px; flex: none; fill: none; stroke: currentColor; stroke-width: 1.4; stroke-linecap: round; stroke-linejoin: round; }
.ui-mdl__chev { width: 11px; height: 11px; fill: none; stroke: var(--mdl-muted); stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; rotate: 180deg; transition: rotate 150ms var(--mdl-ease); }
.ui-mdl[data-side="top"] .ui-mdl__chev { rotate: 0deg; }
.ui-mdl[data-open] .ui-mdl__chev { rotate: 0deg; }
.ui-mdl[data-open][data-side="top"] .ui-mdl__chev { rotate: 180deg; }

.ui-mdl__glyph {
  display: grid;
  place-items: center;
  flex: none;
  width: 26px;
  height: 26px;
  border-radius: 8px;
  background: var(--mdl-panel);
  border: 1px solid var(--mdl-line);
  box-shadow: var(--mdl-pebble);
  color: var(--mdl-info-ink);
  font-size: 11px;
  font-weight: 700;
}
.ui-mdl__glyph svg { width: 13px; height: 13px; }
.ui-mdl__glyph--sm { width: 22px; height: 22px; border-radius: 7px; font-size: 10px; }

/* Menu: matte frame, raised panel, tray in the frame. Kept mounted and inert while closed. */
.ui-mdl__menu {
  position: absolute;
  z-index: 40;
  width: 320px;
  max-width: calc(100vw - 32px);
  padding: 6px;
  background: var(--mdl-frame);
  border: 1px solid var(--mdl-line);
  border-radius: 20px;
  box-shadow: var(--mdl-float);
  opacity: 0;
  visibility: hidden;
  transform: scale(0.96);
  transition: opacity 150ms var(--mdl-ease), transform 150ms var(--mdl-ease), visibility 0s linear 150ms;
}
.ui-mdl[data-open] .ui-mdl__menu { opacity: 1; visibility: visible; transform: none; transition: opacity 150ms var(--mdl-ease), transform 150ms var(--mdl-ease), visibility 0s; }
.ui-mdl[data-side="bottom"] .ui-mdl__menu { top: calc(100% + 8px); }
.ui-mdl[data-side="top"] .ui-mdl__menu { bottom: calc(100% + 8px); }
.ui-mdl[data-align="start"] .ui-mdl__menu { left: 0; }
.ui-mdl[data-align="end"] .ui-mdl__menu { right: 0; }
.ui-mdl[data-side="bottom"][data-align="start"] .ui-mdl__menu { transform-origin: top left; }
.ui-mdl[data-side="bottom"][data-align="end"] .ui-mdl__menu { transform-origin: top right; }
.ui-mdl[data-side="top"][data-align="start"] .ui-mdl__menu { transform-origin: bottom left; }
.ui-mdl[data-side="top"][data-align="end"] .ui-mdl__menu { transform-origin: bottom right; }

.ui-mdl__panel {
  padding: 6px;
  background: var(--mdl-panel);
  border: 1px solid var(--mdl-line);
  border-radius: 15px;
  box-shadow: var(--mdl-drop);
}
.ui-mdl__head { display: flex; align-items: center; justify-content: space-between; padding: 6px 9px 6px 10px; font-size: 11.5px; color: var(--mdl-muted); }
.ui-mdl__cols { display: grid; grid-template-columns: repeat(3, 34px); gap: 4px; text-align: center; flex: none; }
.ui-mdl__list { display: grid; gap: 2px; outline: none; border-radius: 10px; }
.ui-mdl__list:focus-visible { box-shadow: 0 0 0 2px var(--mdl-ring); outline: none; }
.ui-mdl__row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 8px;
  border: 1px solid transparent;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 150ms var(--mdl-ease), border-color 150ms var(--mdl-ease);
}
.ui-mdl__row[data-hot] { background: var(--mdl-soft); border-color: var(--mdl-line); }
.ui-mdl__row[aria-selected="true"]::before {
  content: "";
  position: absolute;
  left: 2px;
  top: 12px;
  bottom: 12px;
  width: 2px;
  border-radius: 2px;
  background: var(--mdl-berry);
}
.ui-mdl__text { display: grid; flex: 1; min-width: 0; transition: opacity 150ms var(--mdl-ease); }
.ui-mdl__list[data-pointing] .ui-mdl__row:not([data-hot]) .ui-mdl__text { opacity: 0.55; }
.ui-mdl__name { display: inline-flex; align-items: center; gap: 5px; font-weight: 500; white-space: nowrap; }
.ui-mdl__tick { width: 12px; height: 12px; fill: none; stroke: var(--mdl-berry); stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
:where(.dark, [data-theme="dark"]) .ui-mdl__tick { stroke: var(--mdl-info-ink); }
.ui-mdl__desc { font-size: 12.5px; color: var(--mdl-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ui-mdl__varies { width: 110px; flex: none; text-align: center; font-size: 12px; color: var(--mdl-faint); }
.ui-mdl__bar { display: inline-flex; justify-content: center; gap: 1.5px; }
.ui-mdl__bar i { width: 5px; height: 4px; border-radius: 1.5px; background: var(--mdl-seg-off); transition: background-color 150ms var(--mdl-ease); }
.ui-mdl__bar i[data-on] { background: var(--mdl-seg-dim); }
.ui-mdl__row[data-hot] .ui-mdl__bar i[data-on] { background: var(--mdl-seg-on); }

.ui-mdl__sep { height: 1px; margin: 6px 4px; background: var(--mdl-line); }
.ui-mdl__setting { display: flex; align-items: center; gap: 10px; min-height: 36px; padding: 4px 8px; border-radius: 10px; cursor: pointer; }
.ui-mdl__setting:hover { background: var(--mdl-soft); }
.ui-mdl__setting--effort { cursor: default; }
.ui-mdl__setting--effort:hover { background: transparent; }
.ui-mdl__setting-icon { display: grid; place-items: center; width: 26px; flex: none; color: var(--mdl-text); }
.ui-mdl__setting-icon svg { width: 15px; height: 15px; fill: none; stroke: currentColor; stroke-width: 1.4; stroke-linecap: round; stroke-linejoin: round; }
.ui-mdl__setting-label { flex: 1; color: var(--mdl-text); }
.ui-mdl__switch {
  position: relative;
  flex: none;
  width: 30px;
  height: 18px;
  padding: 0;
  border: 1px solid var(--mdl-firm);
  border-radius: 999px;
  background: var(--mdl-switch-off);
  cursor: pointer;
  transition: background-color 150ms var(--mdl-ease), border-color 150ms var(--mdl-ease);
}
.ui-mdl__knob { position: absolute; top: 1px; left: 1px; width: 14px; height: 14px; border-radius: 999px; background: #ffffff; box-shadow: 0 1px 2px rgba(0, 22, 43, 0.3); transition: transform 150ms var(--mdl-ease); }
.ui-mdl__switch[aria-checked="true"] { background: var(--mdl-berry); border-color: var(--mdl-berry); }
.ui-mdl__switch[aria-checked="true"] .ui-mdl__knob { transform: translateX(12px); }

.ui-mdl__effort-wrap { display: grid; grid-template-rows: 0fr; opacity: 0; transition: grid-template-rows 300ms var(--mdl-ease), opacity 150ms var(--mdl-ease); }
.ui-mdl__effort-wrap[data-show] { grid-template-rows: 1fr; opacity: 1; }
.ui-mdl__effort-inner { overflow: hidden; min-height: 0; }
.ui-mdl__effort {
  --i: 1;
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: 178px;
  padding: 2px;
  background: var(--mdl-soft);
  border: 1px solid var(--mdl-line);
  border-radius: 9px;
}
.ui-mdl__thumb {
  position: absolute;
  top: 2px;
  bottom: 2px;
  left: 2px;
  width: calc((100% - 4px) / 3);
  border-radius: 7px;
  background: var(--mdl-panel);
  border: 1px solid var(--mdl-line);
  box-shadow: var(--mdl-drop);
  transform: translateX(calc(var(--i) * 100%));
  transition: transform 150ms var(--mdl-ease);
}
.ui-mdl__effort-opt { position: relative; height: 26px; padding: 0 6px; border: 0; background: transparent; border-radius: 7px; color: var(--mdl-muted); font-size: 12.5px; cursor: pointer; transition: color 150ms var(--mdl-ease); }
.ui-mdl__effort-opt[aria-checked="true"] { color: var(--mdl-ink); font-weight: 600; }

.ui-mdl__tray { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 8px 6px 2px 10px; font-size: 12.5px; color: var(--mdl-muted); }
.ui-mdl__stats { display: inline-flex; flex-wrap: wrap; gap: 0 5px; }
.ui-mdl__stats b { color: var(--mdl-ink); font-weight: 600; font-variant-numeric: tabular-nums; }
.ui-mdl__keys { display: inline-flex; gap: 3px; }
.ui-mdl__roll { display: inline-flex; overflow: hidden; vertical-align: bottom; }
.ui-mdl__roll > span { display: inline-block; animation: ui-mdl-roll 300ms var(--mdl-ease); }
.ui-mdl kbd {
  display: inline-grid;
  place-items: center;
  min-width: 20px;
  height: 20px;
  padding: 0 4px;
  font: inherit;
  font-size: 11px;
  color: var(--mdl-text);
  background: var(--mdl-panel);
  border: 1px solid var(--mdl-line);
  border-bottom: 2px solid var(--mdl-firm);
  border-radius: 6px;
}

.ui-mdl__sr {
  position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; border: 0;
  overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap;
}

@media (max-width: 300px) {
  .ui-mdl__row > .ui-mdl__glyph, .ui-mdl__keys, .ui-mdl__setting-icon { display: none; }
  .ui-mdl__cols { grid-template-columns: repeat(3, 32px); gap: 2px; }
}
@media (pointer: coarse) {
  .ui-mdl__trigger { height: 40px; }
  .ui-mdl__row { padding: 10px 8px; }
  .ui-mdl__setting { min-height: 44px; }
  .ui-mdl__switch { width: 40px; height: 24px; }
  .ui-mdl__knob { width: 20px; height: 20px; }
  .ui-mdl__switch[aria-checked="true"] .ui-mdl__knob { transform: translateX(16px); }
  .ui-mdl__effort-opt { height: 34px; }
  .ui-mdl__keys { display: none; }
}

@keyframes ui-mdl-fade { from { opacity: 0; } }
@keyframes ui-mdl-roll { from { opacity: 0; transform: translateY(70%); } }

@media (prefers-reduced-motion: reduce) {
  .ui-mdl *, .ui-mdl *::before, .ui-mdl *::after {
    animation: none !important;
    transition-property: background-color, border-color, color, opacity !important;
  }
  .ui-mdl__menu, .ui-mdl[data-open] .ui-mdl__menu { transform: none; transition-property: opacity, visibility !important; }
}
`;var ke=[{id:"opus",name:"Opus 5.5",description:"Hardest problems",speed:2,quality:5,cost:5,latencyMs:2100,pricePerM:25},{id:"sonnet",name:"Sonnet 5.5",description:"Everyday work",speed:4,quality:4,cost:3,latencyMs:900,pricePerM:15},{id:"haiku",name:"Haiku 5.5",description:"Quick and light",speed:5,quality:3,cost:1,latencyMs:400,pricePerM:4},{id:"auto",name:"Auto",description:"Picks per message",icon:e("svg",{viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",children:e("path",{d:"M8 3v10M3 8h10"})})}];function we(){let[i,d]=c(!1),[o,f]=c("sonnet"),[g,s]=c(!1),[h,l]=c("medium"),[E,N]=c(!1),[L,K]=c(!0),P=y(null);R(()=>{if(!L)return;let a=[],p=(n,H)=>a.push(window.setTimeout(H,n)),S=n=>{P.current?.querySelectorAll("[role=option]")[n]?.dispatchEvent(new PointerEvent("pointermove",{bubbles:!0}))},O=()=>P.current?.querySelector("[role=listbox]")?.dispatchEvent(new PointerEvent("pointerout",{bubbles:!0,relatedTarget:document.body})),A=n=>{p(n+500,()=>d(!0)),p(n+1300,()=>S(0)),p(n+2700,()=>S(2)),p(n+3900,()=>S(1)),p(n+4700,()=>O()),p(n+5300,()=>s(!0)),p(n+6600,()=>l("high")),p(n+7800,()=>l("medium")),p(n+9e3,()=>s(!1)),p(n+10200,()=>d(!1)),p(n+11600,()=>A(0))};return A(0),()=>a.forEach(n=>window.clearTimeout(n))},[L]);let b=()=>K(!1);return e("div",{ref:P,style:{width:"100%",maxWidth:360,minHeight:470},onPointerDownCapture:a=>a.isTrusted&&b(),onKeyDownCapture:a=>a.isTrusted&&b(),children:r("div",{className:"demo-composer",children:[e("style",{href:"demo-model-picker",precedence:"default",children:Me}),e("input",{className:"demo-composer__input",placeholder:"Ask anything\u2026","aria-label":"Message"}),r("div",{className:"demo-composer__bar",children:[e(ie,{models:ke,value:o,onChange:a=>{b(),f(a)},open:i,onOpenChange:a=>{b(),d(a)},thinking:g,onThinkingChange:a=>{b(),s(a)},effort:h,onEffortChange:a=>{b(),l(a)},webSearch:E,onWebSearchChange:a=>{b(),N(a)}}),e("button",{type:"button",className:"demo-composer__send","aria-label":"Send",children:e("svg",{viewBox:"0 0 16 16","aria-hidden":"true",children:e("path",{d:"M8 13V3.5M4 7.2L8 3.2l4 4"})})})]})]})})}var Me=`
.demo-composer {
  --c-panel: #ffffff; --c-line: #dae2ec; --c-ink: #00162b; --c-muted: rgba(0,22,43,.54);
  --c-drop: 0 8px 16px -8px rgba(26,62,112,.2);
  display: grid; gap: 10px; padding: 14px 10px 10px 14px;
  background: var(--c-panel); border: 1px solid var(--c-line); border-radius: 18px; box-shadow: var(--c-drop);
  font-family: "Avenir Next", Avenir, system-ui, sans-serif;
}
:where(.dark, [data-theme="dark"]) .demo-composer {
  --c-panel: #16345c; --c-line: rgba(255,255,255,.12); --c-ink: rgba(255,255,255,.94); --c-muted: rgba(255,255,255,.56);
  --c-drop: 0 8px 16px -8px rgba(3,12,28,.6);
}
.demo-composer__input { border: 0; outline: 0; background: transparent; font: inherit; font-size: 15px; color: var(--c-ink); caret-color: #851437; padding: 2px; }
.demo-composer__input::placeholder { color: var(--c-muted); }
.demo-composer__bar { display: flex; align-items: center; justify-content: space-between; }
.demo-composer__send { display: grid; place-items: center; width: 32px; height: 32px; border: 0; border-radius: 999px; background: var(--c-ink); color: var(--c-panel); cursor: pointer; }
.demo-composer__send svg { width: 14px; height: 14px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
`;export{we as default};
