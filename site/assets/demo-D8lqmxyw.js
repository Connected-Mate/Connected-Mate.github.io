import{t as e}from"./react-BkAXpnfr.js";import{t}from"./jsx-runtime-CTsRTJUX.js";/* empty css             */var n=e(),r=t(),i=[{id:`all`,label:`All`},{id:`needs-you`,label:`Needs you`},{id:`running`,label:`Running`},{id:`done`,label:`Done`}],a={waiting:`Needs you`,running:`Running`,done:`Done`,failed:`Failed`},o={waiting:0,failed:1,running:2,done:3},s=(e,t)=>e===`all`||e===`needs-you`&&(t===`waiting`||t===`failed`)||e===`running`&&t===`running`||e===`done`&&t===`done`,c=e=>e===`running`||e===`waiting`,l=e=>typeof e==`number`?e:e.getTime(),u=e=>String(e).padStart(2,`0`),d=e=>{let t=Math.max(0,Math.floor(e/1e3));if(t<60)return`${t}s`;let n=Math.floor(t/60);return n<60?`${n}m ${u(t%60)}s`:`${Math.floor(n/60)}h ${u(n%60)}m`},f=()=>typeof window<`u`&&window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,p=`cubic-bezier(0.32, 0.72, 0.24, 1)`;function m({id:e,tone:t,className:i,children:a}){let o=(0,n.useRef)({id:e,tone:t,node:a}),[s,c]=(0,n.useState)(e),[l,u]=(0,n.useState)(null);return s!==e&&(c(e),u(o.current)),o.current={id:e,tone:t,node:a},(0,n.useEffect)(()=>{if(!l)return;let e=window.setTimeout(()=>u(null),260);return()=>window.clearTimeout(e)},[l]),(0,r.jsxs)(`span`,{className:[`ui-ai__swap`,i].filter(Boolean).join(` `),children:[l&&(0,r.jsx)(`span`,{className:`ui-ai__swap-item`,"data-out":``,"data-tone":l.tone,"aria-hidden":`true`,children:l.node},`out-${l.id}`),(0,r.jsx)(`span`,{className:`ui-ai__swap-item`,"data-tone":t,children:a},e)]})}function ee({value:e}){let[t,i]=(0,n.useState)({now:e,old:null,up:!0});return t.now!==e&&i({now:e,old:t.now,up:e>t.now}),(0,n.useEffect)(()=>{if(t.old===null)return;let e=window.setTimeout(()=>i(e=>({...e,old:null})),340);return()=>window.clearTimeout(e)},[t.old,t.now]),(0,r.jsxs)(`span`,{className:`ui-ai__roll`,"data-dir":t.up?`up`:`down`,children:[t.old!==null&&(0,r.jsx)(`span`,{"data-out":``,"aria-hidden":`true`,children:t.old},`out-${t.old}-${t.now}`),(0,r.jsx)(`span`,{children:t.now},t.now)]})}var h={stroke:`currentColor`,strokeWidth:1.5,strokeLinecap:`round`,strokeLinejoin:`round`},g=()=>(0,r.jsx)(`svg`,{width:`10`,height:`10`,viewBox:`0 0 10 10`,fill:`none`,"aria-hidden":`true`,children:(0,r.jsx)(`path`,{d:`m2.4 5.2 1.7 1.7 3.6-3.9`,...h,strokeWidth:1.6})}),te=()=>(0,r.jsx)(`svg`,{width:`10`,height:`10`,viewBox:`0 0 10 10`,fill:`none`,"aria-hidden":`true`,children:(0,r.jsx)(`path`,{d:`M5 2.6v3M5 7.4v.01`,...h,strokeWidth:1.7})}),ne=()=>(0,r.jsx)(`svg`,{width:`12`,height:`12`,viewBox:`0 0 12 12`,fill:`none`,"aria-hidden":`true`,children:(0,r.jsx)(`path`,{d:`M3.5 8.5 8.5 3.5M4.5 3.5h4v4`,...h,strokeWidth:1.4})}),re=()=>(0,r.jsx)(`svg`,{width:`12`,height:`12`,viewBox:`0 0 12 12`,fill:`none`,"aria-hidden":`true`,children:(0,r.jsx)(`path`,{d:`M9.6 6A3.6 3.6 0 1 1 8.5 3.4M9.3 1.8v2.1H7.2`,...h,strokeWidth:1.4})}),ie=()=>(0,r.jsx)(`svg`,{width:`12`,height:`12`,viewBox:`0 0 12 12`,fill:`none`,"aria-hidden":`true`,children:(0,r.jsx)(`path`,{d:`M6 2.5v7M2.5 6h7`,...h,strokeWidth:1.4})});function ae({status:e}){return(0,r.jsxs)(`span`,{className:`ui-ai__glyph`,"data-status":e,children:[e===`running`&&(0,r.jsx)(`span`,{className:`ui-ai__spin`}),e===`waiting`&&(0,r.jsx)(`span`,{className:`ui-ai__wait`}),e===`done`&&(0,r.jsx)(g,{}),e===`failed`&&(0,r.jsx)(te,{})]})}function _({tasks:e,onApprove:t,onReject:u,onRetry:h,onOpen:g,filter:te,defaultFilter:_=`all`,onFilterChange:v,action:y,className:b}){let x=(0,n.useId)(),se=(0,n.useRef)(null),[ce,le]=(0,n.useState)(_),S=te??ce,[C,ue]=(0,n.useState)(null),[w,T]=(0,n.useState)(null),[E,de]=(0,n.useState)(()=>Date.now()),D=(0,n.useRef)({}),O=(0,n.useRef)({}),[fe,pe]=(0,n.useState)({}),k=e.map(e=>{let t=fe[e.id];return t?{...e,status:t.status,startedAt:t.startedAt??e.startedAt,steps:[...e.steps??[],...t.steps]}:e});for(let e of k)D.current[e.id]??=E;let A=k.some(e=>c(e.status));(0,n.useEffect)(()=>{if(!A)return;let e=window.setInterval(()=>de(Date.now()),1e3);return()=>window.clearInterval(e)},[A]);let j=k.map(e=>`${e.id}:${e.status}`).join(`|`);(0,n.useEffect)(()=>{for(let e of k)c(e.status)?delete O.current[e.id]:O.current[e.id]??=Date.now()},[j]);let M=e=>{let t=e.startedAt===void 0?D.current[e.id]-(e.elapsed??0):l(e.startedAt);return c(e.status)?d(E-t):e.elapsed===void 0?e.startedAt===void 0?null:d((O.current[e.id]??E)-t):d(e.elapsed)},[N,P]=(0,n.useState)(()=>Object.fromEntries(e.map(e=>[e.id,e.status]))),F=e=>N[e.id]??e.status,I=(0,n.useRef)(new Map),L=(0,n.useRef)(null),R=(0,n.useRef)(k);R.current=k,(0,n.useEffect)(()=>{let e=k.some(e=>N[e.id]!==void 0&&N[e.id]!==e.status),t=k.filter(e=>N[e.id]===void 0);if(t.length&&P(e=>({...e,...Object.fromEntries(t.map(e=>[e.id,e.status]))})),!e)return;let n=window.setTimeout(()=>{let e=new Map;I.current.forEach((t,n)=>e.set(n,t.getBoundingClientRect().top)),L.current=e,P(Object.fromEntries(R.current.map(e=>[e.id,e.status])))},f()?0:950);return()=>window.clearTimeout(n)},[j]);let z=k.map((e,t)=>({t:e,i:t})).sort((e,t)=>o[F(e.t)]-o[F(t.t)]||e.i-t.i).map(({t:e})=>e),me=z.map(e=>e.id).join(`|`);(0,n.useLayoutEffect)(()=>{let e=L.current;if(L.current=null,!e||f())return;let t=null,n=0;I.current.forEach((r,i)=>{let a=e.get(i);if(a===void 0)return;let o=a-r.getBoundingClientRect().top;Math.abs(o)<1||(r.animate([{transform:`translateY(${o}px)`},{transform:`none`}],{duration:560,easing:p}),Math.abs(o)>n&&(n=Math.abs(o),t=r))});let r=t;r&&(r.style.zIndex=`1`,window.setTimeout(()=>r.style.zIndex=``,600))},[me]);let B=(0,n.useRef)(null);B.current||=new Set(e.map(e=>e.id));let[he,ge]=(0,n.useState)({}),V=k.filter(e=>!B.current.has(e.id)).map(e=>e.id);(0,n.useLayoutEffect)(()=>{if(!V.length||(V.forEach(e=>B.current.add(e)),f()))return;ge(e=>({...e,...Object.fromEntries(V.map(e=>[e,!0]))}));let e=requestAnimationFrame(()=>{e=requestAnimationFrame(()=>ge({}))});return()=>cancelAnimationFrame(e)},[V.join(`|`)]);let H=e=>k.filter(t=>s(e,t.status)).length,_e=k.filter(e=>e.status===`waiting`).length,ve=k.filter(e=>e.status===`failed`).length,U=H(`running`),W=_e+ve,G=(e,t,n,r=!1)=>pe(i=>({...i,[e.id]:{status:t,startedAt:r?Date.now():i[e.id]?.startedAt,steps:[...i[e.id]?.steps??[],{label:n,time:`now`}]}})),ye=e=>t?t(e):G(e,`running`,`Approved – continuing`),be=e=>u?u(e):G(e,`failed`,`Rejected by you`),xe=e=>h?h(e):G(e,`running`,`Retrying`,!0),[Se,Ce]=(0,n.useState)(``),K=(0,n.useRef)({});(0,n.useEffect)(()=>{let e=k.filter(e=>K.current[e.id]&&K.current[e.id]!==e.status);e.length&&Ce(e.map(e=>`${e.title}: ${a[e.status].toLowerCase()}`).join(`. `)),K.current=Object.fromEntries(k.map(e=>[e.id,e.status]))},[j]);let we=e=>{le(e),v?.(e)},q=(0,n.useRef)(null),[J,Te]=(0,n.useState)(null);(0,n.useLayoutEffect)(()=>{let e=q.current;if(!e)return;let t=()=>{let t=e.querySelector(`[data-filter="${S}"]`);t&&Te({x:t.offsetLeft,w:t.offsetWidth})};t();let n=new ResizeObserver(t);return e.querySelectorAll(`button`).forEach(e=>n.observe(e)),()=>n.disconnect()},[S]);let Ee=e=>{let t=i.findIndex(e=>e.id===S),n=e.key===`ArrowRight`||e.key===`ArrowDown`?(t+1)%i.length:e.key===`ArrowLeft`||e.key===`ArrowUp`?(t-1+i.length)%i.length:e.key===`Home`?0:e.key===`End`?i.length-1:-1;n<0||(e.preventDefault(),we(i[n].id),q.current?.querySelector(`[data-filter="${i[n].id}"]`)?.focus())},De=e=>{if(e.key!==`Escape`||!C)return;e.stopPropagation();let t=C;ue(null),I.current.get(t)?.querySelector(`.ui-ai__head`)?.focus({preventScroll:!0})},Y=w&&`task`in w?k.find(e=>e.id===w.task):void 0,X=w&&`filter`in w?w.filter:null,Oe=e=>e.steps?.[e.steps.length-1]?.label,Z,Q;if(Y){let e=Oe(Y),t=M(Y);Z=Y.status===`waiting`?(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(`b`,{children:`Asks`}),` · `,e??`Waiting for your answer`]}):Y.status===`running`?(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(`b`,{children:`Now`}),` · `,e??`Working`]}):Y.status===`failed`?(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(`b`,{children:`Failed`}),` · `,e??`Stopped with an error`]}):(0,r.jsxs)(r.Fragment,{children:[`Finished`,t?(0,r.jsxs)(r.Fragment,{children:[` in `,(0,r.jsx)(`b`,{children:t})]}):``]}),Q=`task-${Y.id}-${Y.status}`}else if(X){let e=H(X);Z=X===`needs-you`?W?`${_e} waiting for approval · ${ve} failed`:`Nothing needs you`:X===`running`?`${e} ${e===1?`agent`:`agents`} working`:X===`done`?`${e} finished`:`${e} ${e===1?`task`:`tasks`}`,Q=`filter-${X}`}else{let e=(e,t)=>(0,r.jsx)(`span`,{className:`ui-ai__part`,onPointerEnter:t=>t.pointerType===`mouse`&&T({filter:e}),children:t});Z=W||U?(0,r.jsxs)(r.Fragment,{children:[W>0&&e(`needs-you`,`${W} ${W===1?`needs`:`need`} you`),W>0&&U>0&&` · `,U>0&&e(`running`,`${U} running`)]}):k.length?`All done`:`No tasks yet`,Q=`rest`}let $=z.filter(e=>s(S,F(e))),ke=S===`needs-you`?`Nothing needs you`:S===`running`?`No agent is running`:S===`done`?`Nothing finished yet`:`No tasks yet`;return(0,r.jsxs)(`div`,{ref:se,className:[`ui-ai`,b].filter(Boolean).join(` `),role:`group`,"aria-label":`Agent tasks`,onPointerLeave:()=>T(null),onKeyDown:De,children:[(0,r.jsx)(`style`,{href:`ui-agent-inbox`,precedence:`default`,children:oe}),(0,r.jsxs)(`div`,{className:`ui-ai__card`,children:[(0,r.jsxs)(`div`,{ref:q,className:`ui-ai__tabs`,role:`radiogroup`,"aria-label":`Show`,onKeyDown:Ee,onPointerLeave:()=>T(null),children:[(0,r.jsx)(`span`,{className:`ui-ai__thumb`,"aria-hidden":`true`,"data-ready":J?``:void 0,style:J?{transform:`translateX(${J.x}px)`,width:J.w}:void 0}),i.map(e=>(0,r.jsxs)(`button`,{type:`button`,role:`radio`,"aria-checked":S===e.id,tabIndex:S===e.id?0:-1,className:`ui-ai__tab`,"data-filter":e.id,"data-active":S===e.id?``:void 0,onClick:()=>we(e.id),onPointerEnter:t=>t.pointerType===`mouse`&&T({filter:e.id}),children:[(0,r.jsx)(`span`,{className:`ui-ai__tab-label`,"data-text":e.label,children:e.label}),(0,r.jsx)(`span`,{className:`ui-ai__count`,"data-zero":H(e.id)===0?``:void 0,children:(0,r.jsx)(ee,{value:H(e.id)})})]},e.id))]}),(0,r.jsx)(`ul`,{className:`ui-ai__list`,onPointerLeave:()=>T(null),children:z.map(e=>{let t=s(S,F(e))&&!he[e.id],n=C===e.id&&t,i=M(e),o=(e.steps??[]).slice(-4),l=(e.steps?.length??0)-o.length,u=X&&!s(X,e.status)||Y&&Y.id!==e.id;return(0,r.jsx)(`li`,{ref:t=>{t?I.current.set(e.id,t):I.current.delete(e.id)},className:`ui-ai__item`,"aria-hidden":!t||void 0,children:(0,r.jsx)(`div`,{className:`ui-ai__fold`,"data-open":t?``:void 0,inert:!t,children:(0,r.jsx)(`div`,{className:`ui-ai__clip`,children:(0,r.jsxs)(`div`,{className:`ui-ai__row`,"data-status":e.status,"data-open":n?``:void 0,"data-hot":Y?.id===e.id?``:void 0,"data-dim":u&&!n?``:void 0,onPointerEnter:t=>t.pointerType===`mouse`&&T({task:e.id}),children:[(0,r.jsxs)(`button`,{type:`button`,className:`ui-ai__head`,"aria-expanded":n,"aria-controls":`${x}-${e.id}`,onClick:()=>ue(n?null:e.id),onFocus:()=>T({task:e.id}),onBlur:()=>T(null),children:[(0,r.jsx)(m,{id:e.status,className:`ui-ai__glyph-box`,children:(0,r.jsx)(ae,{status:e.status})}),(0,r.jsxs)(`span`,{className:`ui-ai__text`,children:[(0,r.jsx)(`span`,{className:`ui-ai__title`,children:e.title}),(0,r.jsxs)(`span`,{className:`ui-ai__meta`,children:[(0,r.jsx)(`span`,{className:`ui-ai__agent`,children:e.agent}),i&&(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(`span`,{"aria-hidden":`true`,children:`·`}),(0,r.jsx)(`span`,{className:`ui-ai__time`,"data-live":c(e.status)?``:void 0,children:i})]})]})]}),(0,r.jsxs)(`span`,{className:`ui-ai__tag`,"data-status":e.status,children:[Object.keys(a).map(e=>(0,r.jsx)(`span`,{className:`ui-ai__tag-size`,"aria-hidden":`true`,children:a[e]},e)),(0,r.jsx)(m,{id:e.status,children:a[e.status]})]})]}),(0,r.jsx)(`div`,{id:`${x}-${e.id}`,className:`ui-ai__fold ui-ai__fold--panel`,"data-open":n?``:void 0,inert:!n,children:(0,r.jsx)(`div`,{className:`ui-ai__clip`,children:(0,r.jsxs)(`div`,{className:`ui-ai__panel`,children:[o.length>0&&(0,r.jsx)(`ol`,{className:`ui-ai__steps`,"aria-label":`Latest steps`,children:o.map((t,n)=>{let i=n===o.length-1;return(0,r.jsxs)(`li`,{className:`ui-ai__step`,"data-last":i?``:void 0,"data-status":i?e.status:void 0,children:[(0,r.jsx)(`span`,{className:`ui-ai__dot`}),(0,r.jsx)(`span`,{className:`ui-ai__step-label`,children:t.label}),t.time&&(0,r.jsx)(`span`,{className:`ui-ai__step-time`,children:t.time})]},l+n)})}),(0,r.jsx)(`div`,{className:`ui-ai__actions`,children:(0,r.jsx)(m,{id:`${e.status}`,className:`ui-ai__actions-swap`,children:(0,r.jsxs)(`span`,{className:`ui-ai__buttons`,children:[e.status===`waiting`&&(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(`button`,{type:`button`,className:`ui-ai__btn`,"data-kind":`primary`,onClick:()=>ye(e),children:`Approve`}),(0,r.jsx)(`button`,{type:`button`,className:`ui-ai__btn`,onClick:()=>be(e),children:`Reject`})]}),e.status===`failed`&&(0,r.jsxs)(`button`,{type:`button`,className:`ui-ai__btn`,"data-kind":`primary`,onClick:()=>xe(e),children:[(0,r.jsx)(re,{}),`Retry`]}),(e.status===`done`||e.status===`running`)&&g&&(0,r.jsxs)(`button`,{type:`button`,className:`ui-ai__btn`,onClick:()=>g(e),children:[`Open`,(0,r.jsx)(ne,{})]}),e.status===`running`&&!g&&(0,r.jsx)(`span`,{className:`ui-ai__note`,children:`Working on it…`}),e.status===`done`&&!g&&(0,r.jsx)(`span`,{className:`ui-ai__note`,children:`Finished`})]})})})]})})})]})})})},e.id)})}),(0,r.jsx)(`div`,{className:`ui-ai__fold`,"data-open":$.length===0?``:void 0,"aria-hidden":$.length?!0:void 0,children:(0,r.jsx)(`div`,{className:`ui-ai__clip`,children:(0,r.jsx)(`div`,{className:`ui-ai__empty`,children:(0,r.jsx)(m,{id:S,children:ke})})})})]}),(0,r.jsxs)(`div`,{className:`ui-ai__foot`,children:[(0,r.jsx)(`span`,{className:`ui-ai__caption`,children:(0,r.jsx)(m,{id:Q,children:Z})}),y&&(0,r.jsxs)(`button`,{type:`button`,className:`ui-ai__action`,onClick:y.onClick,children:[(0,r.jsx)(ie,{}),y.label]})]}),(0,r.jsx)(`span`,{className:`ui-ai__sr`,"aria-live":`polite`,children:Se})]})}var oe=`
.ui-ai {
  --ui-ai-tray: #f0f0f0;
  --ui-ai-card: #ffffff;
  --ui-ai-line: #ececec;
  --ui-ai-ink: #171717;
  --ui-ai-text: #404040;
  --ui-ai-muted: #8f8f8f;
  --ui-ai-well: #f4f4f5;
  --ui-ai-soft: #fafafa;
  --ui-ai-thread: #e4e4e7;
  --ui-ai-blue: #2f6bff;
  --ui-ai-blue-text: #1f55d6;
  --ui-ai-blue-bg: rgba(47, 107, 255, 0.09);
  --ui-ai-green: #18794e;
  --ui-ai-green-bg: rgba(34, 160, 90, 0.11);
  --ui-ai-red: #b42318;
  --ui-ai-red-bg: rgba(229, 72, 77, 0.1);
  --ui-ai-amber: #96590a;
  --ui-ai-amber-dot: #e8930c;
  --ui-ai-amber-bg: rgba(240, 160, 32, 0.14);
  --ui-ai-thumb-shadow: 0 0 0 1px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.08);
  --ui-ai-focus: rgba(23, 23, 23, 0.22);
  --ui-ai-ease: ${p};
  box-sizing: border-box;
  width: 100%;
  max-width: 400px;
  min-width: 0;
  container-type: inline-size;
  padding: 4px;
  border-radius: 20px;
  background: var(--ui-ai-tray);
  font-family: "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  font-size: 13px;
  line-height: 20px;
  color: var(--ui-ai-text);
  text-align: left;
  -webkit-font-smoothing: antialiased;
}
.ui-ai *, .ui-ai *::before, .ui-ai *::after { box-sizing: border-box; }
:where(.ui-ai) button { margin: 0; padding: 0; border: 0; background: none; font: inherit; color: inherit; text-align: inherit; cursor: pointer; -webkit-tap-highlight-color: transparent; }
.ui-ai button:focus-visible { outline: 2px solid var(--ui-ai-focus); outline-offset: 2px; }
.ui-ai svg { display: block; flex: none; }
.ui-ai b { font-weight: 500; color: var(--ui-ai-ink); }
.ui-ai ul, .ui-ai ol { margin: 0; padding: 0; list-style: none; }
.ui-ai__sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }

.ui-ai__card { position: relative; padding: 8px; border-radius: 16px; background: var(--ui-ai-card); box-shadow: 0 0 0 1px var(--ui-ai-line), 0 1px 2px rgba(0, 0, 0, 0.04); }

/* ----- Filter tabs: a well with a white thumb that slides to the picked one ----- */
.ui-ai__tabs { position: relative; display: flex; gap: 2px; padding: 3px; border-radius: 11px; background: var(--ui-ai-well); }
.ui-ai__thumb { position: absolute; top: 3px; bottom: 3px; left: 0; border-radius: 8px; background: var(--ui-ai-card); box-shadow: var(--ui-ai-thumb-shadow); opacity: 0; pointer-events: none; }
.ui-ai__thumb[data-ready] { opacity: 1; transition: transform 380ms var(--ui-ai-ease), width 380ms var(--ui-ai-ease), opacity 160ms ease; }
.ui-ai__tab { position: relative; z-index: 1; display: flex; flex: 1 0 auto; align-items: center; justify-content: center; gap: 6px; height: 28px; padding: 0 9px; border-radius: 8px; font-size: 12.5px; font-weight: 500; color: var(--ui-ai-muted); white-space: nowrap; transition: color 200ms ease; }
.ui-ai__tab:hover, .ui-ai__tab[data-active] { color: var(--ui-ai-ink); }
.ui-ai__tab:focus-visible { outline-offset: 0; }
/* The semibold width is reserved, so picking a tab never nudges the others */
.ui-ai__tab-label { display: inline-grid; }
.ui-ai__tab-label::after { content: attr(data-text); height: 0; overflow: hidden; font-weight: 600; visibility: hidden; }
.ui-ai__tab[data-active] .ui-ai__tab-label { font-weight: 600; }
.ui-ai__count { display: inline-grid; min-width: 18px; height: 18px; padding: 0 5px; border-radius: 6px; background: rgba(0, 0, 0, 0.05); font-size: 11px; font-weight: 600; line-height: 18px; text-align: center; color: var(--ui-ai-text); font-variant-numeric: tabular-nums; transition: background-color 200ms ease, color 200ms ease, opacity 200ms ease; }
.ui-ai__tab[data-active] .ui-ai__count { background: var(--ui-ai-well); color: var(--ui-ai-ink); }
.ui-ai__count[data-zero] { opacity: 0.55; }
.ui-ai__roll { display: inline-grid; overflow: hidden; }
.ui-ai__roll > span { grid-area: 1 / 1; animation: ui-ai-roll-in 340ms var(--ui-ai-ease) both; }
.ui-ai__roll > span[data-out] { animation: ui-ai-roll-out 300ms var(--ui-ai-ease) both; }
.ui-ai__roll[data-dir="down"] > span { animation-name: ui-ai-roll-in-down; }
.ui-ai__roll[data-dir="down"] > span[data-out] { animation-name: ui-ai-roll-out-down; }

/* ----- Rows ----- */
.ui-ai__list { margin-top: 6px !important; }
.ui-ai__item { position: relative; }
/* Everything that comes and goes does it the same quiet way: it unfolds and fades, nothing flies */
.ui-ai__fold { display: grid; grid-template-rows: 0fr; opacity: 0; transition: grid-template-rows 440ms var(--ui-ai-ease), opacity 220ms ease; }
.ui-ai__fold[data-open] { grid-template-rows: 1fr; opacity: 1; transition: grid-template-rows 440ms var(--ui-ai-ease), opacity 320ms ease 80ms; }
.ui-ai__clip { min-height: 0; overflow: hidden; }
.ui-ai__row { margin-bottom: 2px; border-radius: 12px; transition: background-color 180ms ease, opacity 220ms ease; }
.ui-ai__row[data-hot], .ui-ai__row[data-open] { background: var(--ui-ai-well); }
.ui-ai__row[data-dim] { opacity: 0.45; }
.ui-ai__head { display: flex; align-items: center; gap: 10px; width: 100%; min-height: 50px; padding: 7px 10px; border-radius: 12px; }
.ui-ai__head:focus-visible { outline-offset: -2px; }
.ui-ai__text { display: grid; flex: 1; min-width: 0; }
.ui-ai__title { overflow: hidden; font-weight: 500; color: var(--ui-ai-ink); white-space: nowrap; text-overflow: ellipsis; }
.ui-ai__meta { display: flex; gap: 5px; min-width: 0; overflow: hidden; font-size: 12px; line-height: 16px; color: var(--ui-ai-muted); white-space: nowrap; }
.ui-ai__agent { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
.ui-ai__time { flex: none; font-variant-numeric: tabular-nums; }

/* Status glyph – each one crossfades into the next */
.ui-ai__glyph-box { flex: none; width: 16px; height: 16px; }
.ui-ai__glyph-box > .ui-ai__swap-item { animation-name: ui-ai-pop-in; }
.ui-ai__glyph-box > .ui-ai__swap-item[data-out] { animation-name: ui-ai-pop-out; }
.ui-ai__glyph { display: grid; place-items: center; width: 16px; height: 16px; border-radius: 50%; }
.ui-ai__glyph[data-status="done"] { background: var(--ui-ai-green-bg); color: var(--ui-ai-green); }
.ui-ai__glyph[data-status="failed"] { background: var(--ui-ai-red-bg); color: var(--ui-ai-red); }
.ui-ai__glyph[data-status="waiting"] { background: var(--ui-ai-amber-bg); }
.ui-ai__spin { width: 14px; height: 14px; border: 1.6px solid var(--ui-ai-blue-bg); border-top-color: var(--ui-ai-blue); border-radius: 50%; animation: ui-ai-spin 800ms linear infinite; }
.ui-ai__wait { width: 6px; height: 6px; border-radius: 50%; background: var(--ui-ai-amber-dot); animation: ui-ai-pulse 2000ms ease-in-out infinite; }

/* Status tag: colored text on a light fill of the same color; all tags are as wide as the longest */
.ui-ai__tag { display: inline-grid; flex: none; justify-items: center; height: 20px; padding: 0 7px; border-radius: 5px; background: var(--ui-ai-tag-bg); font-size: 12px; font-weight: 500; line-height: 20px; color: var(--ui-ai-tag); white-space: nowrap; transition: background-color 300ms ease, color 300ms ease; }
.ui-ai__tag > * { grid-area: 1 / 1; }
.ui-ai__tag-size { visibility: hidden; }
.ui-ai__tag[data-status="waiting"] { --ui-ai-tag: var(--ui-ai-amber); --ui-ai-tag-bg: var(--ui-ai-amber-bg); }
.ui-ai__tag[data-status="running"] { --ui-ai-tag: var(--ui-ai-blue-text); --ui-ai-tag-bg: var(--ui-ai-blue-bg); }
.ui-ai__tag[data-status="done"] { --ui-ai-tag: var(--ui-ai-green); --ui-ai-tag-bg: var(--ui-ai-green-bg); }
.ui-ai__tag[data-status="failed"] { --ui-ai-tag: var(--ui-ai-red); --ui-ai-tag-bg: var(--ui-ai-red-bg); }

/* ----- The open row: the last steps as a tiny timeline, then what you can do ----- */
.ui-ai__panel { padding: 0 10px 10px; }
.ui-ai__steps { padding-bottom: 6px !important; }
.ui-ai__step { position: relative; display: flex; align-items: center; gap: 10px; height: 24px; font-size: 12.5px; animation: ui-ai-step-in 360ms var(--ui-ai-ease) both; }
.ui-ai__step:not(:last-child)::before { content: ""; position: absolute; top: 16px; left: 7.5px; width: 1px; height: 16px; background: var(--ui-ai-thread); }
.ui-ai__dot { display: grid; flex: none; place-items: center; width: 16px; height: 16px; }
.ui-ai__dot::before { content: ""; width: 5px; height: 5px; border-radius: 50%; background: var(--ui-ai-dot, #c4c4ca); transition: background-color 300ms ease, box-shadow 300ms ease; }
.ui-ai__step[data-status="running"] { --ui-ai-dot: var(--ui-ai-blue); }
.ui-ai__step[data-status="waiting"] { --ui-ai-dot: var(--ui-ai-amber-dot); }
.ui-ai__step[data-status="done"] { --ui-ai-dot: var(--ui-ai-green); }
.ui-ai__step[data-status="failed"] { --ui-ai-dot: var(--ui-ai-red); }
.ui-ai__step[data-last] .ui-ai__dot::before { width: 7px; height: 7px; box-shadow: 0 0 0 3px color-mix(in srgb, var(--ui-ai-dot, #c4c4ca) 18%, transparent); }
.ui-ai__step-label { flex: 1; min-width: 0; overflow: hidden; color: var(--ui-ai-muted); white-space: nowrap; text-overflow: ellipsis; }
.ui-ai__step[data-last] .ui-ai__step-label { color: var(--ui-ai-ink); }
.ui-ai__step-time { flex: none; font-size: 12px; color: var(--ui-ai-muted); font-variant-numeric: tabular-nums; }
.ui-ai__actions { padding-left: 26px; }
.ui-ai__actions-swap { display: grid; }
.ui-ai__buttons { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; min-height: 28px; }
.ui-ai__btn { display: inline-flex; align-items: center; gap: 5px; height: 28px; padding: 0 11px; border-radius: 8px; background: var(--ui-ai-card); box-shadow: 0 0 0 1px var(--ui-ai-line), 0 1px 1px rgba(0, 0, 0, 0.03); font-size: 12.5px; font-weight: 500; color: var(--ui-ai-ink); white-space: nowrap; transition: background-color 160ms ease, box-shadow 160ms ease, transform 160ms var(--ui-ai-ease); }
.ui-ai__btn:hover { box-shadow: 0 0 0 1px #dcdce0, 0 1px 2px rgba(0, 0, 0, 0.06); }
.ui-ai__btn:active { transform: scale(0.97); }
.ui-ai__btn[data-kind="primary"] { background: var(--ui-ai-ink); box-shadow: none; color: var(--ui-ai-card); }
.ui-ai__btn[data-kind="primary"]:hover { background: #2a2a2a; }
.ui-ai__btn svg { margin: 0 -1px; }
.ui-ai__note { font-size: 12.5px; color: var(--ui-ai-muted); }

.ui-ai__empty { display: grid; place-items: center; height: 72px; font-size: 12.5px; color: var(--ui-ai-muted); }

/* ----- Tray ----- */
.ui-ai__foot { display: flex; align-items: center; gap: 8px; min-height: 38px; padding: 4px 4px 0 10px; }
.ui-ai__caption { flex: 1; min-width: 0; overflow: hidden; font-size: 12.5px; color: var(--ui-ai-muted); white-space: nowrap; text-overflow: ellipsis; }
.ui-ai__part { border-radius: 4px; transition: color 160ms ease; }
.ui-ai__part:hover { color: var(--ui-ai-ink); }
.ui-ai__swap { display: grid; min-width: 0; }
.ui-ai__swap-item { grid-area: 1 / 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; animation: ui-ai-swap-in 320ms ease both; }
.ui-ai__swap-item[data-out] { animation: ui-ai-swap-out 220ms ease both; pointer-events: none; }
.ui-ai__action { display: inline-flex; flex: none; align-items: center; gap: 5px; height: 26px; padding: 0 8px 0 7px; border-radius: 10px; font-size: 12.5px; font-weight: 500; color: var(--ui-ai-text); white-space: nowrap; transition: background-color 160ms ease, color 160ms ease; }
.ui-ai__action:hover { background: var(--ui-ai-card); color: var(--ui-ai-ink); }

@keyframes ui-ai-swap-in { from { opacity: 0; filter: blur(2px); } }
@keyframes ui-ai-swap-out { from { opacity: 1; } to { opacity: 0; filter: blur(2px); } }
@keyframes ui-ai-pop-in { from { opacity: 0; transform: scale(0.6); } }
@keyframes ui-ai-pop-out { to { opacity: 0; transform: scale(0.6); } }
@keyframes ui-ai-roll-in { from { opacity: 0; transform: translateY(70%); } }
@keyframes ui-ai-roll-out { to { opacity: 0; transform: translateY(-70%); } }
@keyframes ui-ai-roll-in-down { from { opacity: 0; transform: translateY(-70%); } }
@keyframes ui-ai-roll-out-down { to { opacity: 0; transform: translateY(70%); } }
@keyframes ui-ai-step-in { from { opacity: 0; transform: translateY(4px); } }
@keyframes ui-ai-spin { to { transform: rotate(360deg); } }
@keyframes ui-ai-pulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(232, 147, 12, 0.35); } 50% { box-shadow: 0 0 0 3px rgba(232, 147, 12, 0); } }

/* Narrow cards: the tabs tighten and the count of "All" gives way, the tags shrink a little */
@container (max-width: 380px) {
  .ui-ai__tabs { gap: 0; }
  .ui-ai__tab { gap: 5px; padding: 0 7px; font-size: 12px; }
  .ui-ai__count { min-width: 16px; padding: 0 4px; font-size: 10.5px; }
}
@container (max-width: 330px) {
  .ui-ai__tab[data-filter="all"] .ui-ai__count { display: none; }
  .ui-ai__tab { padding: 0 6px; }
  .ui-ai__card { padding: 6px; }
  .ui-ai__head { gap: 9px; padding: 7px 8px; }
  .ui-ai__panel { padding: 0 8px 10px; }
  .ui-ai__tag { padding: 0 6px; font-size: 11.5px; }
}
/* Phones: titles may take two lines and each tag is only as wide as its own word, so little gets cut */
@container (max-width: 360px) {
  .ui-ai__tag-size { display: none; }
  .ui-ai__title { display: -webkit-box; white-space: normal; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
}

@media (pointer: coarse) {
  .ui-ai__tab { height: 34px; }
  .ui-ai__head { min-height: 56px; }
  .ui-ai__btn { height: 34px; padding: 0 14px; }
  .ui-ai__action { height: 32px; }
}

@media (prefers-reduced-motion: reduce) {
  .ui-ai *, .ui-ai *::before, .ui-ai *::after { animation: none !important; transition: none !important; }
  .ui-ai__spin { border-color: var(--ui-ai-blue); border-right-color: var(--ui-ai-blue-bg); }
}

/* Dark mode: follows a .dark class or data-theme="dark" on any ancestor, e.g. <html> */
:where(.dark, [data-theme="dark"]) .ui-ai {
  --ui-ai-tray: #111113;
  --ui-ai-card: #19191b;
  --ui-ai-line: #2a2a2e;
  --ui-ai-ink: #ededed;
  --ui-ai-text: #c8c8cc;
  --ui-ai-muted: #8b8b92;
  --ui-ai-well: #222225;
  --ui-ai-thread: #34343a;
  --ui-ai-blue: #6f9bff;
  --ui-ai-blue-text: #9bb8ff;
  --ui-ai-blue-bg: rgba(79, 130, 255, 0.16);
  --ui-ai-green: #6ee7a8;
  --ui-ai-green-bg: rgba(52, 199, 120, 0.14);
  --ui-ai-red: #ff9b93;
  --ui-ai-red-bg: rgba(255, 99, 99, 0.14);
  --ui-ai-amber: #f5c264;
  --ui-ai-amber-dot: #f0a83a;
  --ui-ai-amber-bg: rgba(240, 160, 32, 0.16);
  --ui-ai-thumb-shadow: 0 0 0 1px rgba(255, 255, 255, 0.06), 0 1px 2px rgba(0, 0, 0, 0.4);
  --ui-ai-focus: rgba(255, 255, 255, 0.3);
}
:where(.dark, [data-theme="dark"]) .ui-ai__tabs { background: #111113; }
:where(.dark, [data-theme="dark"]) .ui-ai__thumb { background: #2a2a2e; }
:where(.dark, [data-theme="dark"]) .ui-ai__count { background: rgba(255, 255, 255, 0.07); }
:where(.dark, [data-theme="dark"]) .ui-ai__tab[data-active] .ui-ai__count { background: rgba(255, 255, 255, 0.1); }
:where(.dark, [data-theme="dark"]) .ui-ai__btn:hover { box-shadow: 0 0 0 1px #3a3a40; }
:where(.dark, [data-theme="dark"]) .ui-ai__btn[data-kind="primary"] { color: #111113; }
:where(.dark, [data-theme="dark"]) .ui-ai__btn[data-kind="primary"]:hover { background: #ffffff; }
:where(.dark, [data-theme="dark"]) .ui-ai__dot::before { background: var(--ui-ai-dot, #55555c); }
`,v=6e4,y=()=>{let e=Date.now();return[{id:`migrate`,title:`Migrate users table to Postgres 17`,agent:`Opus 5.5`,status:`waiting`,startedAt:e-6*v-12e3,steps:[{label:`Read schema and 14 migrations`,time:`6m ago`},{label:`Wrote migration 0042_split_users`,time:`4m ago`},{label:`Dry run on staging – no errors`,time:`2m ago`},{label:`Wants to run it on production`,time:`1m ago`}]},{id:`review`,title:`Review PR #482 – billing webhooks`,agent:`Sonnet 5.5`,status:`running`,startedAt:e-3*v-4e4,steps:[{label:`Checked out feature/billing-hooks`,time:`3m ago`},{label:`Read 12 changed files`,time:`2m ago`},{label:`Ran the test suite – 214 passed`,time:`1m ago`},{label:`Writing review comments`,time:`now`}]},{id:`crm`,title:`Clean up duplicate CRM contacts`,agent:`Haiku 5.5`,status:`failed`,elapsed:161e3,steps:[{label:`Loaded 18,240 contacts`,time:`9m ago`},{label:`Matched 1,312 likely duplicates`,time:`8m ago`},{label:`Merge stopped – API rate limit (429)`,time:`7m ago`}]},{id:`notes`,title:`Write release notes for v2.4`,agent:`Sonnet 5.5`,status:`running`,startedAt:e-1*v-18e3,steps:[{label:`Collected 23 merged pull requests`,time:`1m ago`},{label:`Grouped them into features and fixes`,time:`40s ago`},{label:`Drafting the highlights`,time:`now`}]},{id:`translate`,title:`Translate onboarding emails to German`,agent:`Haiku 5.5`,status:`running`,startedAt:e-52e3,steps:[{label:`Found 6 email templates`,time:`50s ago`},{label:`Translated 4 of 6`,time:`now`}]},{id:`digest`,title:`Weekly metrics digest`,agent:`Haiku 5.5`,status:`done`,elapsed:252e3,steps:[{label:`Pulled numbers from 3 dashboards`,time:`22m ago`},{label:`Wrote the summary`,time:`19m ago`},{label:`Posted to #metrics`,time:`18m ago`}]},{id:`react`,title:`Upgrade React to 19.2`,agent:`Opus 5.5`,status:`done`,elapsed:663e3,steps:[{label:`Bumped 4 packages`,time:`1h ago`},{label:`Fixed 2 type errors`,time:`58m ago`},{label:`All checks green`,time:`52m ago`}]}]},b=()=>({id:`interviews-${Date.now()}`,title:`Summarize 9 customer interviews`,agent:`Sonnet 5.5`,status:`running`,startedAt:Date.now(),steps:[{label:`Reading the transcripts`,time:`now`}]});function x(){let e=(0,n.useRef)(null),[t,i]=(0,n.useState)(0),[a,o]=(0,n.useState)(y),s=(0,n.useRef)(!1),c=(0,n.useRef)([]),l=(e,t,n)=>o(r=>r.map(r=>r.id===e?{...r,...t,steps:n?[...r.steps??[],{label:n,time:`now`}]:r.steps}:r)),u=(e,t)=>c.current.push(window.setTimeout(e,t)),d=e=>{l(e.id,{status:`running`},`Approved by you – running on production`),u(()=>l(e.id,{status:`done`,elapsed:Date.now()-Number(e.startedAt??Date.now())},`Migrated 48,210 rows`),5e3)},f=e=>{l(e.id,{status:`running`,startedAt:Date.now(),elapsed:void 0},`Retrying with a slower pace`),u(()=>l(e.id,{status:`done`,elapsed:4200},`Merged 1,312 duplicates`),4200)},p=e=>l(e.id,{status:`failed`,elapsed:Date.now()-Number(e.startedAt??Date.now())},`Rejected by you`);(0,n.useEffect)(()=>()=>c.current.forEach(e=>window.clearTimeout(e)),[]),(0,n.useEffect)(()=>{let t=t=>()=>e.current?.querySelector(t)?.click(),n=[[700,t(`.ui-ai__head`)],[2700,t(`.ui-ai__row[data-open] .ui-ai__btn[data-kind='primary']`)],[2400,t(`.ui-ai__row[data-open] .ui-ai__head`)],[1100,t(`.ui-ai__tab[data-filter='running']`)],[1500,()=>o(e=>[b(),...e])],[3e3,t(`.ui-ai__tab[data-filter='done']`)],[2600,t(`.ui-ai__tab[data-filter='all']`)],[3200,()=>{c.current.forEach(e=>window.clearTimeout(e)),c.current=[],o(y()),i(e=>e+1)}]],r=0,a=0,l=()=>{s.current||r>=n.length||(a=window.setTimeout(()=>{s.current||(n[r][1](),r++,l())},n[r][0]))};return l(),()=>window.clearTimeout(a)},[t]);let m=()=>s.current=!0;return(0,r.jsx)(`div`,{ref:e,className:`ai-demo`,onPointerEnter:m,onPointerDownCapture:m,onKeyDownCapture:m,onFocusCapture:m,children:(0,r.jsx)(_,{tasks:a,onApprove:d,onReject:p,onRetry:f,onOpen:()=>{},action:{label:`New task`,onClick:()=>o(e=>[b(),...e])}},t)})}export{x as default};