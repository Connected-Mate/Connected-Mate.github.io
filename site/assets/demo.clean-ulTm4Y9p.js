import{t as e}from"./react-BkAXpnfr.js";import{t}from"./jsx-runtime-CTsRTJUX.js";/* empty css             */var n=e(),r=t(),i=()=>typeof window<`u`&&window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches;function a({id:e,children:t,className:i}){let a=(0,n.useRef)({id:e,node:t}),[o,s]=(0,n.useState)(e),[c,l]=(0,n.useState)(null);return o!==e&&(s(e),l(a.current)),a.current={id:e,node:t},(0,n.useEffect)(()=>{if(!c)return;let e=window.setTimeout(()=>l(null),300);return()=>window.clearTimeout(e)},[c]),(0,r.jsxs)(`span`,{className:[`ui-mac__swap`,i].filter(Boolean).join(` `),children:[c&&(0,r.jsx)(`span`,{className:`ui-mac__swap-item`,"data-out":``,"aria-hidden":`true`,children:c.node},`out-${c.id}`),(0,r.jsx)(`span`,{className:`ui-mac__swap-item`,children:t},e)]})}function o({version:e,children:t,className:i}){let o=(0,n.useRef)(null),[s,c]=(0,n.useState)(void 0);return(0,n.useEffect)(()=>{let e=o.current;if(!e||typeof ResizeObserver>`u`)return;let t=new ResizeObserver(()=>c(e.offsetHeight));return t.observe(e),()=>t.disconnect()},[]),(0,r.jsxs)(`div`,{className:[`ui-mac-text`,i].filter(Boolean).join(` `),style:{height:s},children:[(0,r.jsx)(`style`,{href:`ui-message-actions-clean`,precedence:`default`,children:g}),(0,r.jsx)(`div`,{ref:o,className:`ui-mac-text__inner`,dir:`auto`,children:(0,r.jsx)(a,{id:String(e),className:`ui-mac-text__swap`,children:t})})]})}var s=({d:e,solid:t})=>(0,r.jsx)(`svg`,{viewBox:`0 0 16 16`,className:`ui-mac__glyph`,"data-solid":t||void 0,"aria-hidden":`true`,children:(0,r.jsx)(`path`,{d:e})}),c=()=>(0,r.jsxs)(`svg`,{viewBox:`0 0 16 16`,className:`ui-mac__glyph`,"aria-hidden":`true`,children:[(0,r.jsx)(`path`,{className:`ui-mac__fill`,d:`M7.4 3.2a.6.6 0 0 1 1 .46v8.68a.6.6 0 0 1-1 .46L4.6 10.5H3A1.5 1.5 0 0 1 1.5 9V7A1.5 1.5 0 0 1 3 5.5h1.6l2.8-2.3Z`}),(0,r.jsx)(`path`,{d:`M10.6 6.2a2.6 2.6 0 0 1 0 3.6M12.4 4.4a5.2 5.2 0 0 1 0 7.2`})]}),l={copy:`M5.5 2A1.5 1.5 0 0 0 4 3.5V4h5A3 3 0 0 1 12 7v5h.5a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 12.5 2h-7ZM3.5 5A1.5 1.5 0 0 0 2 6.5v6A1.5 1.5 0 0 0 3.5 14H9a1.5 1.5 0 0 0 1.5-1.5v-6A1.5 1.5 0 0 0 9 5H3.5Z`,check:`M1.5 8a6.5 6.5 0 1 1 13 0 6.5 6.5 0 0 1-13 0Zm8.9-1.2a.5.5 0 0 0-.8-.6L7.44 9.23 6.35 8.15a.5.5 0 1 0-.7.7l1.5 1.5a.5.5 0 0 0 .76-.06l2.5-3.5Z`,tick:`M3.5 8.5 6.5 11.5 12.5 4.5`,redo:`M13 8a5 5 0 1 1-1.46-3.54M13 2.5v2.5h-2.5`,thumb:`M4.5 7v6.5H3a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h1.5Zm1 6.5h5.95a1.5 1.5 0 0 0 1.47-1.2l.86-4.3A1.5 1.5 0 0 0 12.31 6.2H9.5l.42-2.08A1.4 1.4 0 0 0 7.3 3.1L5.5 6.8v6.7Z`,next:`M10.85 7.65a.5.5 0 0 1 0 .7L7.2 12a.5.5 0 0 1-.7-.7L9.79 8 6.5 4.7a.5.5 0 1 1 .7-.7l3.65 3.65Z`,close:`m4.5 4.5 7 7m0-7-7 7`},u=[`copy`,`regenerate`,`feedback`,`speak`],d=e=>Array.isArray(e)?[...new Set(e)].filter(e=>u.includes(e)):u,f=(e,t)=>typeof e==`number`&&Number.isFinite(e)?Math.floor(e):t,p=e=>e.toLocaleString(`en-US`),m=[`Not accurate`,`Too long`,`Didn't follow instructions`,`Other`];function h({text:e,actions:t=u,versions:o,version:h,defaultVersion:_,onVersionChange:v,onCopy:y,onRegenerate:ee,regenerating:b=!1,onFeedback:x,reasons:S=m,onSpeak:C,speaking:w,speakDuration:T,quiet:te=!0,label:ne=`Message actions`,className:re}){let E=(0,n.useId)(),ie=d(t),D=Math.max(1,f(typeof o==`number`?o:Array.isArray(o)?o.length:1,1)),[ae,O]=(0,n.useState)(()=>Math.min(D-1,Math.max(0,f(_,D-1)))),[k,oe]=(0,n.useState)(D),[A,j]=(0,n.useState)(null),[M,N]=(0,n.useState)(!1),[P,F]=(0,n.useState)(null),[I,L]=(0,n.useState)(``),[R,z]=(0,n.useState)(!1);k!==D&&(D>k&&(O(D-1),j(null),N(!1)),oe(D));let B=Math.min(D-1,Math.max(0,f(h,ae))),V=e=>{let t=Math.min(D-1,Math.max(0,e));t!==B&&(h===void 0&&O(t),v?.(t),H(`Version ${p(t+1)} of ${p(D)}`))},[se,ce]=(0,n.useState)(``),H=e=>ce(t=>t===e?`${e} `:e),[U,W]=(0,n.useState)(0);(0,n.useEffect)(()=>{if(!U)return;let e=window.setTimeout(()=>W(0),1600);return()=>window.clearTimeout(e)},[U]);let le=()=>{try{e!==void 0&&navigator.clipboard?.writeText(e).catch(()=>{})}catch{}y?.(e),W(Date.now()),H(`Copied`)},[G,ue]=(0,n.useState)(0),de=()=>{ue(e=>e+1),ee?.(),H(`Regenerating`)},fe=()=>{if(A===`up`){j(null),x?.(null);return}j(`up`),N(!1),x?.(`up`),H(`Marked as good response`)},pe=()=>{if(A===`down`){j(null),N(!1),x?.(null);return}j(`down`),N(!0),z(!1),F(null),L(``),x?.(`down`),H(`Marked as bad response. Tell us what went wrong below`)},K=()=>{P&&!R&&(x?.(`down`,P===`Other`?I.trim()||`Other`:P),z(!0),H(`Thanks for the feedback`))};(0,n.useEffect)(()=>{if(!R)return;let e=window.setTimeout(()=>N(!1),i()?1200:1500);return()=>window.clearTimeout(e)},[R]);let q=(0,n.useRef)(null),J=()=>{N(!1),q.current?.focus()},[Y,X]=(0,n.useState)(!1),Z=w??Y,me=e?e.trim().split(/\s+/).length:0,Q=typeof T==`number`&&T>0?T:Math.max(2600,me*380);(0,n.useEffect)(()=>{if(w!==void 0||!Y)return;let e=window.setTimeout(()=>{X(!1),C?.(!1),H(`Finished reading`)},Q);return()=>window.clearTimeout(e)},[Y,w,Q]);let he=()=>{let e=!Z;w===void 0&&X(e),C?.(e),H(e?`Reading aloud`:`Stopped reading`)},ge=!!U||M||Z||b,$=e=>(0,r.jsxs)(`span`,{className:`ui-mac__item`,"data-flash":e.flash?``:void 0,children:[(0,r.jsx)(`button`,{ref:e.refEl,type:`button`,className:`ui-mac__btn ui-mac__btn--${e.key}`,"aria-label":e.labelText,"aria-pressed":e.pressed,"aria-expanded":e.expanded,"aria-controls":e.controls,onClick:e.onClick,...e.extra,children:e.children}),(0,r.jsx)(`span`,{className:`ui-mac__tip`,"aria-hidden":`true`,children:(0,r.jsx)(a,{id:e.tip,children:e.tip})})]},e.key),_e=ie.map(e=>e===`copy`?$({key:`copy`,tip:U?`Copied`:`Copy`,labelText:U?`Copied`:`Copy message`,onClick:le,flash:!!U,extra:{"data-done":U?``:void 0},children:(0,r.jsxs)(`span`,{className:`ui-mac__icon ui-mac__morph`,children:[(0,r.jsx)(`span`,{className:`ui-mac__layer`,"data-on":U?void 0:``,children:(0,r.jsx)(s,{d:l.copy,solid:!0})}),(0,r.jsx)(`span`,{className:`ui-mac__layer ui-mac__layer--check`,"data-on":U?``:void 0,children:(0,r.jsx)(s,{d:l.check,solid:!0})})]})}):e===`regenerate`?(0,r.jsxs)(`span`,{className:`ui-mac__regen`,children:[$({key:`regenerate`,tip:b?`Writing…`:`Regenerate`,labelText:`Regenerate response`,onClick:de,extra:{"data-busy":b?``:void 0},children:(0,r.jsx)(`span`,{className:`ui-mac__icon`,children:(0,r.jsx)(`span`,{className:`ui-mac__spin`,"data-spin":G?``:void 0,children:(0,r.jsx)(s,{d:l.redo})},G)})}),(0,r.jsx)(`span`,{className:`ui-mac__versions`,"data-open":D>1?``:void 0,inert:D<2,children:(0,r.jsxs)(`span`,{className:`ui-mac__versions-clip`,role:`group`,"aria-label":`Versions`,children:[(0,r.jsx)(`button`,{type:`button`,className:`ui-mac__step`,"data-dir":`prev`,"aria-label":`Previous version`,disabled:B===0,onClick:()=>V(B-1),children:(0,r.jsx)(s,{d:l.next,solid:!0})}),(0,r.jsxs)(`span`,{className:`ui-mac__count`,"aria-label":`Version ${p(B+1)} of ${p(D)}`,children:[(0,r.jsx)(a,{id:String(B),className:`ui-mac__count-now`,children:p(B+1)}),(0,r.jsx)(`span`,{"aria-hidden":`true`,children:`/`}),(0,r.jsx)(a,{id:String(D),children:p(D)})]}),(0,r.jsx)(`button`,{type:`button`,className:`ui-mac__step`,"data-dir":`next`,"aria-label":`Next version`,disabled:B>=D-1,onClick:()=>V(B+1),children:(0,r.jsx)(s,{d:l.next,solid:!0})})]})})]},`regenerate`):e===`feedback`?(0,r.jsxs)(n.Fragment,{children:[$({key:`up`,tip:A===`up`?`Thanks!`:`Good response`,labelText:`Good response`,pressed:A===`up`,onClick:fe,children:(0,r.jsx)(`span`,{className:`ui-mac__icon ui-mac__thumb`,children:(0,r.jsx)(s,{d:l.thumb,solid:!0})})}),$({key:`down`,tip:`Bad response`,labelText:`Bad response`,pressed:A===`down`,expanded:M,controls:`${E}-feedback`,onClick:pe,refEl:q,children:(0,r.jsx)(`span`,{className:`ui-mac__icon ui-mac__thumb`,children:(0,r.jsx)(s,{d:l.thumb,solid:!0})})})]},`feedback`):$({key:`speak`,tip:Z?`Stop`:`Read aloud`,labelText:Z?`Stop reading`:`Read aloud`,pressed:Z,onClick:he,children:(0,r.jsxs)(`span`,{className:`ui-mac__icon ui-mac__morph`,children:[(0,r.jsx)(`span`,{className:`ui-mac__layer`,"data-on":Z?void 0:``,children:(0,r.jsx)(c,{})}),(0,r.jsxs)(`span`,{className:`ui-mac__layer ui-mac__eq`,"data-on":Z?``:void 0,children:[(0,r.jsx)(`i`,{}),(0,r.jsx)(`i`,{}),(0,r.jsx)(`i`,{}),(0,r.jsx)(`i`,{})]})]})}));return(0,r.jsxs)(`div`,{className:[`ui-mac`,re].filter(Boolean).join(` `),"data-quiet":te?``:void 0,"data-active":ge?``:void 0,children:[(0,r.jsx)(`style`,{href:`ui-message-actions-clean`,precedence:`default`,children:g}),(0,r.jsx)(`div`,{className:`ui-mac__bar`,role:`group`,"aria-label":ne,children:_e}),ie.includes(`feedback`)&&(0,r.jsx)(`div`,{id:`${E}-feedback`,className:`ui-mac__fold`,"data-open":M?``:void 0,inert:!M,children:(0,r.jsx)(`div`,{className:`ui-mac__clip`,children:(0,r.jsxs)(`div`,{className:`ui-mac__panel`,role:`group`,"aria-labelledby":`${E}-ask`,onKeyDown:e=>{e.key===`Escape`&&(e.stopPropagation(),J())},children:[(0,r.jsxs)(`div`,{className:`ui-mac__panel-head`,children:[(0,r.jsx)(`span`,{id:`${E}-ask`,className:`ui-mac__ask`,children:`What went wrong?`}),(0,r.jsx)(`button`,{type:`button`,className:`ui-mac__close`,"aria-label":`Close feedback`,onClick:J,children:(0,r.jsx)(s,{d:l.close})})]}),(0,r.jsxs)(`div`,{className:`ui-mac__chips`,children:[(Array.isArray(S)?S:[]).map((e,t)=>(0,r.jsx)(`button`,{type:`button`,className:`ui-mac__chip`,"aria-pressed":P===e,disabled:R,onClick:()=>F(P===e?null:e),title:e,dir:`auto`,children:e},`${e}-${t}`)),(0,r.jsx)(`button`,{type:`button`,className:`ui-mac__send`,"data-sent":R?``:void 0,disabled:!P,"aria-disabled":R||void 0,onClick:K,children:(0,r.jsx)(a,{id:R?`sent`:`send`,children:R?(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(s,{d:l.tick}),`Thanks!`]}):`Send`})})]}),Array.isArray(S)&&S.includes(`Other`)&&(0,r.jsx)(`div`,{className:`ui-mac__fold`,"data-open":P===`Other`&&!R?``:void 0,inert:P!==`Other`||R,children:(0,r.jsx)(`div`,{className:`ui-mac__clip`,children:(0,r.jsx)(`input`,{className:`ui-mac__input`,value:I,placeholder:`Tell us more (optional)`,dir:`auto`,"aria-label":`What went wrong, in your words`,onChange:e=>L(e.target.value),onKeyDown:e=>{e.key===`Enter`&&K()}})})})]})})}),(0,r.jsx)(`span`,{className:`ui-mac__sr`,"aria-live":`polite`,children:se})]})}var g=`
/* Colors and motion as variables – override them on .ui-mac */
.ui-mac {
  --ui-mac-card: #ffffff;
  --ui-mac-strong: #000000;
  --ui-mac-ink: rgba(0, 22, 43, 0.88);
  --ui-mac-text: rgba(0, 22, 43, 0.61);
  --ui-mac-muted: rgba(0, 22, 43, 0.45);
  --ui-mac-faint: rgba(0, 22, 43, 0.27);
  --ui-mac-icon: rgba(0, 22, 43, 0.447);
  --ui-mac-line: rgba(26, 62, 112, 0.06);
  --ui-mac-fill: rgba(26, 62, 112, 0.06);
  --ui-mac-wash: rgba(26, 62, 112, 0.03);
  --ui-mac-solid: rgba(0, 22, 43, 0.88);
  --ui-mac-solid-hover: rgba(0, 22, 43, 0.8);
  --ui-mac-on-solid: #fbfcfe;
  --ui-mac-accent: rgba(35, 95, 166, 0.765);
  --ui-mac-ok: #1a9a52;
  --ui-mac-ok-bg: rgba(26, 154, 82, 0.08);
  /* Strokes are shadows: a 0.5px hairline plus a soft lift */
  --ui-mac-shadow: 0 0 0 0.5px rgba(26, 62, 112, 0.06), 0 1px 1px -1px rgba(26, 62, 112, 0.1), 0 1px 2px 0 rgba(26, 62, 112, 0.05);
  --ui-mac-shadow-pop: 0 0 0 0.5px rgba(26, 62, 112, 0.08), 0 12px 28px -10px rgba(26, 62, 112, 0.16), 0 1px 2px 0 rgba(26, 62, 112, 0.05);
  --ui-mac-focus: rgba(35, 95, 166, 0.35);
  --ui-mac-ease: cubic-bezier(0.22, 1, 0.36, 1);
  box-sizing: border-box;
  display: block;
  width: 100%;
  min-width: 0;
  container-type: inline-size;
  font-family: Avenir Next,Avenir, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  font-size: 13px;
  font-weight: 400;
  line-height: 20px;
  color: var(--ui-mac-ink);
  text-align: left;
  -webkit-font-smoothing: antialiased;
}
.ui-mac *, .ui-mac *::before, .ui-mac *::after { box-sizing: border-box; }
:where(.ui-mac) button { margin: 0; padding: 0; border: 0; background: none; font: inherit; color: inherit; text-align: inherit; cursor: pointer; -webkit-tap-highlight-color: transparent; }
.ui-mac button:focus-visible, .ui-mac input:focus-visible { outline: 2px solid var(--ui-mac-focus); outline-offset: 1px; }
.ui-mac svg { display: block; flex: none; }
.ui-mac__sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }

/* ----- The bar: quiet until the message is hovered, something inside is focused or busy ----- */
/* Wraps to a second row in a very narrow message instead of running out of it */
.ui-mac__bar { display: flex; flex-wrap: wrap; align-items: center; gap: 2px; min-height: 28px; transition: opacity 240ms ease; }
.ui-mac[data-quiet] .ui-mac__bar { opacity: 0.6; }
.ui-mac[data-quiet]:hover .ui-mac__bar,
.ui-mac[data-quiet]:focus-within .ui-mac__bar,
.ui-mac[data-quiet][data-active] .ui-mac__bar,
:where([data-ui-message]:hover, [data-ui-message]:focus-within) .ui-mac[data-quiet] .ui-mac__bar { opacity: 1; }

/* Ghost icon buttons; pressed takes the selected-tab look */
.ui-mac__item { position: relative; display: inline-flex; flex: none; }
.ui-mac__btn { display: grid; place-items: center; width: 28px; height: 28px; border-radius: 6px; color: var(--ui-mac-icon); transition: background-color 160ms ease, color 160ms ease, box-shadow 160ms ease; }
.ui-mac__btn:hover { background: var(--ui-mac-wash); color: var(--ui-mac-ink); }
.ui-mac__btn:active .ui-mac__icon { transform: scale(0.9); }
.ui-mac__btn[aria-pressed="true"],
.ui-mac__btn[aria-pressed="true"]:hover { background: var(--ui-mac-fill); box-shadow: inset 0 0 0 0.5px var(--ui-mac-line); color: var(--ui-mac-ink); }
.ui-mac__btn--copy[data-done] { color: var(--ui-mac-ok); }

.ui-mac__icon { position: relative; display: grid; place-items: center; width: 16px; height: 16px; transition: transform 160ms var(--ui-mac-ease); }
.ui-mac__glyph { width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 1.1; stroke-linecap: round; stroke-linejoin: round; }
.ui-mac__glyph[data-solid] { fill: currentColor; stroke: none; }
.ui-mac__fill { fill: currentColor; stroke: none; }

/* Two icons on top of each other – one blurs away while the other comes in */
.ui-mac__morph { display: grid; }
.ui-mac__layer { grid-area: 1 / 1; display: grid; place-items: center; opacity: 0; transform: scale(0.6); filter: blur(2px); transition: opacity 200ms ease, transform 300ms var(--ui-mac-ease), filter 200ms ease; }
.ui-mac__layer[data-on] { opacity: 1; transform: none; filter: none; }

/* Regenerate spins once per press, and keeps going while busy */
.ui-mac__spin { display: grid; place-items: center; }
.ui-mac__spin[data-spin] { animation: ui-mac-spin 640ms var(--ui-mac-ease); }
.ui-mac__btn[data-busy] { color: var(--ui-mac-ink); }
.ui-mac__btn[data-busy] .ui-mac__spin { animation: ui-mac-spin 900ms linear infinite; }

/* Thumbs: down is the same glyph turned upside down; a vote gives it a little pop */
.ui-mac__btn--down .ui-mac__glyph { transform: scaleY(-1); }
.ui-mac__btn[aria-pressed="true"] .ui-mac__thumb { animation: ui-mac-pop 420ms var(--ui-mac-ease); }

/* Read aloud: four bars in the accent blue that bounce while it plays */
.ui-mac__eq { display: flex; align-items: center; justify-content: center; gap: 2px; width: 16px; height: 16px; color: var(--ui-mac-accent); }
.ui-mac__eq i { display: block; width: 2px; height: 11px; border-radius: 1px; background: currentColor; transform: scaleY(0.3); }
.ui-mac__eq[data-on] i { animation: ui-mac-eq 900ms ease-in-out infinite; }
.ui-mac__eq[data-on] i:nth-child(2) { animation-delay: -300ms; animation-duration: 760ms; }
.ui-mac__eq[data-on] i:nth-child(3) { animation-delay: -520ms; animation-duration: 1000ms; }
.ui-mac__eq[data-on] i:nth-child(4) { animation-delay: -140ms; animation-duration: 820ms; }

/* ----- Tooltips: a small white popover above the button – on hover after a beat, on keyboard focus, and briefly after Copy ----- */
.ui-mac__tip { position: absolute; bottom: calc(100% + 6px); left: 50%; z-index: 3; display: block; width: max-content; padding: 2px 8px; border-radius: 6px; background: var(--ui-mac-card); box-shadow: var(--ui-mac-shadow-pop); font-size: 12px; font-weight: 500; line-height: 20px; color: var(--ui-mac-ink); white-space: nowrap; pointer-events: none; opacity: 0; transform: translate(-50%, 3px); transition: opacity 140ms ease, transform 200ms var(--ui-mac-ease); }
.ui-mac__btn:focus-visible + .ui-mac__tip,
.ui-mac__item[data-flash] .ui-mac__tip { opacity: 1; transform: translate(-50%, 0); transition-delay: 0ms; }
@media (hover: hover) {
  .ui-mac__item:hover .ui-mac__tip { opacity: 1; transform: translate(-50%, 0); transition-delay: 380ms; }
}

/* ----- Version switcher: unfolds next to Regenerate once there are two versions ----- */
.ui-mac__regen { display: inline-flex; align-items: center; flex: none; }
.ui-mac__versions { display: grid; grid-template-columns: 0fr; opacity: 0; transition: grid-template-columns 420ms var(--ui-mac-ease), opacity 220ms ease; }
.ui-mac__versions[data-open] { grid-template-columns: 1fr; opacity: 1; transition: grid-template-columns 420ms var(--ui-mac-ease), opacity 320ms ease 100ms; }
.ui-mac__versions-clip { display: flex; align-items: center; min-width: 0; overflow: hidden; padding-right: 2px; }
.ui-mac__step { display: grid; flex: none; place-items: center; width: 20px; height: 28px; border-radius: 6px; color: var(--ui-mac-icon); transition: background-color 160ms ease, color 160ms ease, opacity 160ms ease; }
.ui-mac__step[data-dir="prev"] .ui-mac__glyph { transform: scaleX(-1); }
.ui-mac__step:hover:not(:disabled) { background: var(--ui-mac-wash); color: var(--ui-mac-ink); }
.ui-mac__step:disabled { cursor: default; opacity: 0.45; }
.ui-mac__count { display: inline-flex; align-items: center; gap: 2px; padding: 0 2px; font-size: 12px; line-height: 16px; color: var(--ui-mac-faint); white-space: nowrap; font-variant-numeric: tabular-nums; }
.ui-mac__count-now { color: var(--ui-mac-ink); font-weight: 500; }
.ui-mac__count > .ui-mac__swap:last-child { color: var(--ui-mac-muted); }

/* ----- Swapping text ----- */
.ui-mac__swap { display: inline-grid; min-width: 0; }
.ui-mac__swap-item { grid-area: 1 / 1; display: inline-flex; align-items: center; justify-content: center; gap: 4px; min-width: 0; animation: ui-mac-in 300ms ease both; }
.ui-mac__swap-item[data-out] { animation: ui-mac-out 220ms ease both; }

/* ----- Feedback row: unfolds below the bar, no card of its own – it sits in the card the bar sits in ----- */
.ui-mac__fold { display: grid; grid-template-rows: 0fr; opacity: 0; transition: grid-template-rows 420ms var(--ui-mac-ease), opacity 220ms ease; }
.ui-mac__fold[data-open] { grid-template-rows: 1fr; opacity: 1; transition: grid-template-rows 420ms var(--ui-mac-ease), opacity 320ms ease 80ms; }
.ui-mac__clip { min-height: 0; overflow: hidden; margin: -3px; padding: 3px; }  /* the 3px keep hairlines and focus rings from being clipped */
.ui-mac__panel { padding: 10px 8px 8px; }
.ui-mac__panel-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; min-height: 24px; }
.ui-mac__ask { font-size: 13px; font-weight: 500; line-height: 20px; color: var(--ui-mac-strong); }
.ui-mac__close { display: grid; flex: none; place-items: center; width: 24px; height: 24px; margin-right: -4px; border-radius: 6px; color: var(--ui-mac-icon); transition: background-color 160ms ease, color 160ms ease; }
.ui-mac__close:hover { background: var(--ui-mac-wash); color: var(--ui-mac-ink); }
.ui-mac__chips { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-top: 8px; }
/* Reasons: the tab-button look – a hairline, gray text; the picked one gets the gray fill */
.ui-mac__chip { max-width: 100%; overflow: hidden; text-overflow: ellipsis; height: 28px; padding: 4px 10px; border-radius: 6px; box-shadow: inset 0 0 0 0.5px var(--ui-mac-line); font-size: 13px; font-weight: 500; line-height: 20px; color: var(--ui-mac-text); white-space: nowrap; transition: background-color 140ms ease, color 140ms ease, opacity 200ms ease; }
.ui-mac__chip:hover:not(:disabled) { background: var(--ui-mac-wash); color: var(--ui-mac-ink); }
.ui-mac__chip[aria-pressed="true"], .ui-mac__chip[aria-pressed="true"]:hover:not(:disabled) { background: var(--ui-mac-fill); color: var(--ui-mac-ink); }
.ui-mac__chip:disabled { cursor: default; }
.ui-mac__chip:disabled:not([aria-pressed="true"]) { opacity: 0.45; }
/* Send: the dark chip; once sent a soft green fill */
.ui-mac__send { display: inline-flex; align-items: center; justify-content: center; min-width: 60px; height: 28px; margin-left: auto; padding: 0 10px; border-radius: 6px; background: var(--ui-mac-solid); font-size: 13px; font-weight: 500; line-height: 20px; color: var(--ui-mac-on-solid); white-space: nowrap; transition: background-color 220ms ease, color 220ms ease, opacity 200ms ease; }
.ui-mac__send:hover:not(:disabled):not([data-sent]) { background: var(--ui-mac-solid-hover); }
.ui-mac__send:disabled { cursor: default; opacity: 0.3; }
.ui-mac__send[data-sent] { cursor: default; background: var(--ui-mac-ok-bg); color: var(--ui-mac-ok); }
.ui-mac__send .ui-mac__glyph { width: 14px; height: 14px; stroke-width: 1.5; }
.ui-mac__input { display: block; width: 100%; height: 32px; margin-top: 8px; padding: 0 10px; border: 0; border-radius: 6px; background: var(--ui-mac-card); box-shadow: var(--ui-mac-shadow); font: inherit; font-size: 13px; line-height: 20px; color: var(--ui-mac-ink); outline: none; }
.ui-mac__input::placeholder { color: var(--ui-mac-faint); }

/* ----- Message text that crossfades between versions (MessageText) ----- */
.ui-mac-text { overflow: hidden; transition: height 360ms var(--ui-mac-ease, cubic-bezier(0.22, 1, 0.36, 1)); }
.ui-mac-text__swap { display: grid; }
.ui-mac-text__inner { min-width: 0; overflow-wrap: anywhere; }
.ui-mac-text__swap > .ui-mac__swap-item { display: block; animation: ui-mac-text-in 420ms ease both; }
.ui-mac-text__swap > .ui-mac__swap-item[data-out] { animation: ui-mac-out 260ms ease both; }

@keyframes ui-mac-in { from { opacity: 0; filter: blur(2px); } }
@keyframes ui-mac-text-in { from { opacity: 0; filter: blur(3px); } }
@keyframes ui-mac-out { from { opacity: 1; } to { opacity: 0; filter: blur(2px); } }
@keyframes ui-mac-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes ui-mac-pop { 0% { transform: scale(1); } 40% { transform: scale(1.22) rotate(-8deg); } 100% { transform: scale(1); } }
@keyframes ui-mac-eq { 0%, 100% { transform: scaleY(0.3); } 50% { transform: scaleY(1); } }

/* Narrow: the feedback row stacks its send button under the reasons */
@container (max-width: 320px) {
  .ui-mac__send { flex-basis: 100%; }
}

@media (pointer: coarse) {
  .ui-mac[data-quiet] .ui-mac__bar { opacity: 1; }
  .ui-mac__btn { width: 36px; height: 36px; }
  .ui-mac__step { width: 28px; height: 36px; }
  .ui-mac__chip, .ui-mac__send { height: 34px; padding-top: 7px; padding-bottom: 7px; }
  .ui-mac__close { width: 32px; height: 32px; }
  .ui-mac__input { height: 38px; }
}

@media (prefers-reduced-motion: reduce) {
  .ui-mac *, .ui-mac *::before, .ui-mac *::after, .ui-mac-text, .ui-mac-text * { animation: none !important; transition: none !important; }
  .ui-mac__eq[data-on] i:nth-child(odd) { transform: scaleY(0.8); }
  .ui-mac__eq[data-on] i:nth-child(even) { transform: scaleY(0.5); }
}

/* Dark mode: follows a .dark class or data-theme="dark" on any ancestor, e.g. <html> */
:where(.dark, [data-theme="dark"]) .ui-mac {
  --ui-mac-card: #061b3a;
  --ui-mac-strong: #ffffff;
  --ui-mac-ink: rgba(255, 255, 255, 0.9);
  --ui-mac-text: rgba(255, 255, 255, 0.62);
  --ui-mac-muted: rgba(255, 255, 255, 0.46);
  --ui-mac-faint: rgba(255, 255, 255, 0.3);
  --ui-mac-icon: rgba(255, 255, 255, 0.5);
  --ui-mac-line: rgba(255, 255, 255, 0.08);
  --ui-mac-fill: rgba(255, 255, 255, 0.08);
  --ui-mac-wash: rgba(255, 255, 255, 0.04);
  --ui-mac-solid: rgba(255, 255, 255, 0.9);
  --ui-mac-solid-hover: rgba(255, 255, 255, 0.8);
  --ui-mac-on-solid: #061b3a;
  --ui-mac-accent: #4883ce;
  --ui-mac-ok: #3ec27a;
  --ui-mac-ok-bg: rgba(62, 194, 122, 0.14);
  --ui-mac-shadow: 0 0 0 0.5px rgba(255, 255, 255, 0.1), 0 1px 2px 0 rgba(0, 22, 43, 0.4);
  --ui-mac-shadow-pop: 0 0 0 0.5px rgba(255, 255, 255, 0.12), 0 12px 28px -10px rgba(0, 22, 43, 0.6);
  --ui-mac-focus: rgba(72, 131, 206, 0.5);
}
`,_=[`Version 2.4 adds shared workspaces, cuts sync time in half and fixes the export bug on Windows.`,`Shared workspaces arrive in 2.4, sync is twice as fast, and exports on Windows work again.`,`In short: teams can now share a workspace, syncing takes half as long and Windows exports are fixed.`];function v(){let e=(0,n.useRef)(null),[t,i]=(0,n.useState)(0),[a,s]=(0,n.useState)(1),[c,l]=(0,n.useState)(0),[u,d]=(0,n.useState)(!1),[f,p]=(0,n.useState)(!1),m=(0,n.useRef)(!1),g=()=>{u||(d(!0),window.setTimeout(()=>{d(!1),s(e=>Math.min(_.length,e+1))},1e3))};(0,n.useEffect)(()=>l(a-1),[a]),(0,n.useEffect)(()=>{let t=t=>()=>e.current?.querySelector(t)?.click(),n=[[700,t(`.ui-mac__btn--copy`)],[1e3,t(`.ui-mac__btn--down`)],[700,t(`.ui-mac__chip:nth-child(2)`)],[900,t(`.ui-mac__send`)],[2600,t(`.ui-mac__btn--regenerate`)],[2800,t(`.ui-mac__step[data-dir='prev']`)],[2e3,t(`.ui-mac__step[data-dir='next']`)],[3e3,()=>{s(1),l(0),i(e=>e+1)}]],r=0,a=0,o=()=>{m.current||r>=n.length||(a=window.setTimeout(()=>{m.current||(n[r][1](),r++,o())},n[r][0]))};return o(),()=>window.clearTimeout(a)},[t]);let v=()=>{m.current=!0,p(!0)},y=_[c];return(0,r.jsx)(`div`,{ref:e,className:`ma-demo ma-demo--clean`,onPointerEnter:v,onPointerDownCapture:v,onKeyDownCapture:v,onFocusCapture:v,children:(0,r.jsxs)(`div`,{className:`mac-demo__card`,"data-ui-message":``,children:[(0,r.jsxs)(`div`,{className:`mac-demo__body`,children:[(0,r.jsx)(`p`,{className:`mac-demo__ask`,children:`Summarize the 2.4 release notes in one sentence.`}),(0,r.jsxs)(`div`,{className:`mac-demo__who`,children:[(0,r.jsx)(`span`,{className:`mac-demo__dot`,"aria-hidden":`true`}),`Sonnet 5.5`]}),(0,r.jsx)(`div`,{className:`mac-demo__answer`,"data-writing":u?``:void 0,children:(0,r.jsx)(o,{version:c,children:y})})]}),(0,r.jsx)(`div`,{className:`mac-demo__foot`,children:(0,r.jsx)(h,{text:f?y:void 0,versions:a,version:c,onVersionChange:l,onRegenerate:g,regenerating:u},t)})]})})}export{v as default};