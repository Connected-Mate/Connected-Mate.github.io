import{t as e}from"./react-BkAXpnfr.js";import{t}from"./jsx-runtime-CTsRTJUX.js";/* empty css             */var n=e(),r=t(),i=[`No signal`,`Weak signal`,`Good signal`,`Strong signal`];function a({title:e=`Smart recommendation`,options:t,onAccept:a,onUndo:l,defaultOpen:u=!0,className:d}){let[f,p]=(0,n.useState)(t[0].id),[m,h]=(0,n.useState)(null),[g,_]=(0,n.useState)(u),[v,y]=(0,n.useState)(!1),b=(0,n.useRef)(null);(0,n.useEffect)(()=>{if(!v)return;let e=e=>!b.current?.contains(e.target)&&y(!1),t=e=>e.key===`Escape`&&y(!1);return window.addEventListener(`pointerdown`,e),window.addEventListener(`keydown`,t),()=>{window.removeEventListener(`pointerdown`,e),window.removeEventListener(`keydown`,t)}},[v]);let x=t.find(e=>e.id===f)??t[0],S=x.id===t[0].id,C=m===x.id;return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(`style`,{href:`ui-smart-recommendation`,precedence:`default`,children:c}),(0,r.jsxs)(`section`,{className:[`ui-sr`,d].filter(Boolean).join(` `),"aria-label":e,"data-accepted":C||void 0,children:[(0,r.jsxs)(`div`,{className:`ui-sr__card`,children:[(0,r.jsxs)(`button`,{type:`button`,className:`ui-sr__head`,"aria-expanded":g,onClick:()=>_(e=>!e),children:[(0,r.jsx)(o,{}),(0,r.jsx)(`span`,{className:`ui-sr__title`,children:e}),!S&&(0,r.jsx)(`span`,{className:`ui-sr__pill`,children:`Alternative`}),(0,r.jsx)(`span`,{className:`ui-sr__chevron`,children:(0,r.jsx)(s,{d:`m4.5 6.25 3.5 3.5 3.5-3.5`})})]}),(0,r.jsx)(`div`,{className:`ui-sr__body`,"data-open":g||void 0,inert:!g,children:(0,r.jsx)(`p`,{className:`ui-sr__reason`,children:x.reason},x.id)})]}),(0,r.jsxs)(`footer`,{className:`ui-sr__foot`,children:[(0,r.jsxs)(`span`,{className:`ui-sr__signal`,"data-level":x.signal,title:i[x.signal],children:[(0,r.jsx)(`span`,{className:`ui-sr__bars`,"aria-hidden":`true`,children:[1,2,3].map(e=>(0,r.jsx)(`span`,{"data-on":x.signal>=e||void 0},e))}),i[x.signal]]}),(0,r.jsxs)(`div`,{className:`ui-sr__actions`,children:[t.length>1&&!C&&(0,r.jsxs)(`div`,{className:`ui-sr__alt`,ref:b,children:[(0,r.jsx)(`button`,{type:`button`,className:`ui-sr__btn`,"aria-haspopup":`menu`,"aria-expanded":v,onClick:()=>y(e=>!e),children:`Alternatives`}),v&&(0,r.jsx)(`div`,{className:`ui-sr__menu`,role:`menu`,children:t.map((e,t)=>(0,r.jsxs)(`button`,{type:`button`,role:`menuitemradio`,"aria-checked":e.id===f,className:`ui-sr__option`,onClick:()=>{p(e.id),y(!1),_(!0)},children:[(0,r.jsxs)(`span`,{className:`ui-sr__option-label`,children:[e.label,t===0&&(0,r.jsx)(`span`,{className:`ui-sr__tag`,children:`Recommended`})]}),(0,r.jsx)(`span`,{className:`ui-sr__mini`,"data-level":e.signal,"aria-label":i[e.signal],children:[1,2,3].map(t=>(0,r.jsx)(`span`,{"data-on":e.signal>=t||void 0},t))})]},e.id))})]}),C?(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)(`span`,{className:`ui-sr__done`,role:`status`,children:[(0,r.jsx)(s,{d:`m3.5 8.5 3 3 6-7`,size:14}),x.label,` accepted`]}),(0,r.jsx)(`button`,{type:`button`,className:`ui-sr__btn`,onClick:()=>{h(null),l?.(x)},children:`Undo`})]}):(0,r.jsxs)(`button`,{type:`button`,className:`ui-sr__btn ui-sr__btn--primary`,onClick:()=>{h(x.id),y(!1),a?.(x)},children:[`Accept `,x.label.toLowerCase()]})]})]})]})]})}var o=()=>(0,r.jsxs)(`svg`,{className:`ui-sr__spark`,viewBox:`0 0 16 16`,width:`16`,height:`16`,fill:`none`,stroke:`currentColor`,strokeWidth:`1.4`,strokeLinecap:`round`,strokeLinejoin:`round`,"aria-hidden":`true`,children:[(0,r.jsx)(`path`,{d:`M9 3.5H4A1.5 1.5 0 0 0 2.5 5v7A1.5 1.5 0 0 0 4 13.5h7a1.5 1.5 0 0 0 1.5-1.5V8`}),(0,r.jsx)(`path`,{d:`M12.5 1.5v4M10.5 3.5h4`})]}),s=({d:e,size:t=16})=>(0,r.jsx)(`svg`,{viewBox:`0 0 16 16`,width:t,height:t,fill:`none`,stroke:`currentColor`,strokeWidth:`1.5`,strokeLinecap:`round`,strokeLinejoin:`round`,"aria-hidden":`true`,children:(0,r.jsx)(`path`,{d:e})}),c=`
.ui-sr {
  --ui-sr-tray: #ecf1f8;
  --ui-sr-card: #ffffff;
  --ui-sr-ink: #041632;
  --ui-sr-text: #274066;
  --ui-sr-muted: #8090a8;
  --ui-sr-accent: #326eb6;
  --ui-sr-ok: #1f8a4c;
  --ui-sr-accent-text: #326eb6;
  --ui-sr-border: #dfe6ef;
  --ui-sr-shadow: 0 1px 2px rgba(26, 62, 112, 0.06);
  --ui-sr-head-hover: #f6f8fc;
  --ui-sr-pill: #eff3f9;
  --ui-sr-pill-text: #891c3e;
  --ui-sr-bar: #ccd5e2;
  --ui-sr-btn: #fff;
  --ui-sr-btn-hover: #f4f7fc;
  --ui-sr-menu: #fff;
  --ui-sr-option-hover: #f2f5fb;
  --ui-sr-option-on: #f5f8fc;
  --ui-sr-tag: #eff3f9;
  --ui-sr-ease: cubic-bezier(0.22, 1, 0.36, 1);
  box-sizing: border-box;
  width: 100%;
  max-width: 440px;
  container-type: inline-size;
  /* Like the Chat Composer: the white card on a gray tray, the actions live in the tray below */
  background: var(--ui-sr-tray);
  /* The gray tray frames the white card on every side */
  padding: 6px;
  border-radius: 22px;
  font-family: Avenir Next,Avenir, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  color: var(--ui-sr-ink);
  -webkit-font-smoothing: antialiased;
}
.ui-sr *, .ui-sr *::before, .ui-sr *::after { box-sizing: border-box; }
.ui-sr button { margin: 0; font: inherit; color: inherit; cursor: pointer; }
.ui-sr button:focus-visible { outline: 2px solid var(--ui-sr-accent); outline-offset: 2px; }

.ui-sr__card {
  padding: 6px 8px 8px;
  background: var(--ui-sr-card);
  border: 1px solid var(--ui-sr-border);
  border-radius: 16px;
  box-shadow: var(--ui-sr-shadow);
}
.ui-sr__head {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  height: 40px;
  padding: 0 10px;
  border: 0;
  border-radius: 12px;
  background: transparent;
  text-align: left;
  transition: background-color 140ms ease;
}
.ui-sr__head:hover { background: var(--ui-sr-head-hover); }
.ui-sr__spark { flex: none; color: var(--ui-sr-accent-text); }
.ui-sr__title { font-size: 15px; font-weight: 500; }
.ui-sr__pill {
  padding: 1px 8px;
  border-radius: 999px;
  background: var(--ui-sr-pill);
  font-size: 11.5px;
  font-weight: 500;
  color: var(--ui-sr-pill-text);
}
.ui-sr__chevron { display: grid; margin-left: auto; color: var(--ui-sr-muted); transition: transform 280ms var(--ui-sr-ease); }
.ui-sr__head[aria-expanded="false"] .ui-sr__chevron { transform: rotate(-90deg); }
.ui-sr__body {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 340ms var(--ui-sr-ease);
}
.ui-sr__body[data-open] { grid-template-rows: 1fr; }
.ui-sr__reason {
  min-height: 0;
  overflow: hidden;
  margin: 0;
  padding: 0 10px;
  font-size: 14px;
  line-height: 21px;
  color: var(--ui-sr-text);
  animation: ui-sr-swap 360ms var(--ui-sr-ease);
}
.ui-sr__body[data-open] .ui-sr__reason { padding-bottom: 8px; }
.ui-sr__reason strong { font-weight: 500; color: var(--ui-sr-ink); }

.ui-sr__foot {
  display: flex;
  align-items: center;
  /* Narrow containers: the actions move below the signal instead of running out of the tray */
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 8px 10px;
  min-height: 50px;
  padding: 8px 8px 8px 16px;
}
.ui-sr__signal {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  white-space: nowrap;
  color: var(--ui-sr-muted);
}
.ui-sr__bars, .ui-sr__mini { display: inline-flex; align-items: flex-end; gap: 2px; }
.ui-sr__bars span, .ui-sr__mini span {
  width: 3px;
  border-radius: 1px;
  background: var(--ui-sr-bar);
  transition: background-color 260ms ease;
}
.ui-sr__bars span:nth-child(1), .ui-sr__mini span:nth-child(1) { height: 6px; }
.ui-sr__bars span:nth-child(2), .ui-sr__mini span:nth-child(2) { height: 9px; }
.ui-sr__bars span:nth-child(3), .ui-sr__mini span:nth-child(3) { height: 12px; }
[data-level="1"] > span[data-on] { background: #f59e0b; }
[data-level="2"] > span[data-on] { background: var(--ui-sr-accent); }
[data-level="3"] > span[data-on] { background: var(--ui-sr-ok); }
.ui-sr__signal[data-level="0"] .ui-sr__bars span:first-child { background: #8090a8; }

.ui-sr__actions { display: flex; align-items: center; gap: 6px; margin-left: auto; }
.ui-sr__btn {
  height: 32px;
  padding: 0 12px;
  border: 0;
  border-radius: 10px;
  background: var(--ui-sr-btn);
  box-shadow: 0 0 0 1px var(--ui-sr-border), 0 1px 2px rgba(26, 62, 112, 0.04);
  font-size: 13px !important;
  font-weight: 500;
  white-space: nowrap;
  transition: background-color 160ms ease, transform 160ms ease;
}
.ui-sr__btn:hover { background: var(--ui-sr-btn-hover); }
.ui-sr__btn:active { transform: scale(0.98); }
.ui-sr__btn--primary {
  background: linear-gradient(#173159, #081e3f);
  box-shadow: 0 0 0 1px #010c23, 0 2px 4px rgba(26, 62, 112, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.12);
  color: #fff !important;
}
.ui-sr__btn--primary:hover { background: linear-gradient(#213b61, #0c2448); }
.ui-sr__done {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding-right: 4px;
  font-size: 13px;
  font-weight: 500;
  color: var(--ui-sr-ok);
  animation: ui-sr-swap 300ms var(--ui-sr-ease);
}

.ui-sr__alt { position: relative; }
.ui-sr__menu {
  position: absolute;
  bottom: calc(100% + 8px);
  right: 0;
  z-index: 5;
  display: grid;
  gap: 2px;
  width: 260px;
  padding: 4px;
  border-radius: 12px;
  background: var(--ui-sr-menu);
  box-shadow: 0 0 0 1px var(--ui-sr-border), 0 12px 30px -8px rgba(26, 62, 112, 0.2);
  animation: ui-sr-drop 180ms var(--ui-sr-ease);
}
/* Narrow: the actions sit on their own row – the menu lines up with its right edge so it stays inside */
@container (max-width: 420px) {
  .ui-sr__actions { position: relative; }
  .ui-sr__alt { position: static; }
  .ui-sr__menu { width: min(260px, 100cqw - 24px); }
}
.ui-sr__option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  min-height: 34px;
  padding: 0 10px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  font-size: 13px !important;
  text-align: left;
}
.ui-sr__option:hover { background: var(--ui-sr-option-hover); }
.ui-sr__option[aria-checked="true"] { background: var(--ui-sr-option-on); }
.ui-sr__option-label { display: inline-flex; align-items: center; gap: 6px; }
.ui-sr__tag { padding: 0 6px; border-radius: 999px; background: var(--ui-sr-tag); font-size: 10.5px; font-weight: 500; line-height: 16px; color: var(--ui-sr-accent-text); }

@keyframes ui-sr-swap { from { opacity: 0; transform: translateY(2px); } }
@keyframes ui-sr-drop { from { opacity: 0; transform: translateY(4px) scale(0.98); } }
@media (prefers-reduced-motion: reduce) {
  .ui-sr__reason, .ui-sr__done, .ui-sr__menu { animation: none; }
  .ui-sr__body, .ui-sr__chevron { transition: none; }
}

/* Dark mode: follows a .dark class or data-theme="dark" on any ancestor, e.g. <html> */
:where(.dark, [data-theme="dark"]) .ui-sr {
  --ui-sr-tray: #041531;
  --ui-sr-card: #0b2345;
  --ui-sr-ink: #e8eef6;
  --ui-sr-text: #bbc5d5;
  --ui-sr-muted: #8090a8;
  --ui-sr-ok: #3dbb6f;
  --ui-sr-accent-text: #508cd7;
  --ui-sr-border: rgba(255, 255, 255, 0.08);
  --ui-sr-shadow: 0 1px 2px rgba(0, 22, 43, 0.4);
  --ui-sr-head-hover: rgba(255, 255, 255, 0.06);
  --ui-sr-pill: rgba(137, 28, 62, 0.18);
  --ui-sr-pill-text: #f9869e;
  --ui-sr-bar: rgba(255, 255, 255, 0.14);
  --ui-sr-btn: #0f2a50;
  --ui-sr-btn-hover: #163158;
  --ui-sr-menu: #0f2a50;
  --ui-sr-option-hover: #163158;
  --ui-sr-option-on: rgba(50, 110, 182, 0.16);
  --ui-sr-tag: rgba(50, 110, 182, 0.16);
}
:where(.dark, [data-theme="dark"]) .ui-sr__menu {
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1), 0 12px 30px -8px rgba(0, 22, 43, 0.5);
}
:where(.dark, [data-theme="dark"]) .ui-sr__btn--primary {
  background: linear-gradient(#f1f5fa, #dee5ef);
  box-shadow: 0 0 0 1px rgba(0, 22, 43, 0.6), 0 2px 4px rgba(0, 22, 43, 0.35), inset 0 1px 0 #ffffff;
  color: #02112b !important;
}
:where(.dark, [data-theme="dark"]) .ui-sr__btn--primary:hover { background: linear-gradient(#ffffff, #e7edf5); }
`,l=[{id:`incremental`,label:`Incremental sync`,reason:(0,r.jsxs)(r.Fragment,{children:[`Only 4% of rows changed since yesterday – switching to `,(0,r.jsx)(`strong`,{children:`Incremental sync`}),` saves about 40 minutes.`]}),signal:3},{id:`full`,label:`Full refresh`,reason:(0,r.jsxs)(r.Fragment,{children:[`A `,(0,r.jsx)(`strong`,{children:`Full refresh`}),` rebuilds every table. Safest after schema changes, but takes about 50 minutes.`]}),signal:1},{id:`skip`,label:`Skip tonight`,reason:(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(`strong`,{children:`Skip tonight`}),` keeps yesterday's data. Fine if nobody needs fresh numbers tomorrow morning.`]}),signal:0}];function u(){return(0,r.jsx)(`div`,{className:`recommendation-demo`,children:(0,r.jsx)(a,{options:l})})}export{u as default};