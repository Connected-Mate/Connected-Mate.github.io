"use client";import{t as Ye}from"./react-BkAXpnfr.js";var Je=Ye();var{Children:ct,Component:ut,Fragment:pt,StrictMode:ft,cloneElement:gt,createContext:ht,createElement:bt,createRef:xt,forwardRef:_t,isValidElement:vt,lazy:yt,memo:wt,startTransition:kt,Suspense:Nt,use:Et,useCallback:Mt,useContext:St,useDebugValue:Tt,useDeferredValue:Ct,useEffect:k,useId:he,useImperativeHandle:At,useInsertionEffect:Lt,useLayoutEffect:be,useMemo:xe,useOptimistic:Rt,useReducer:Ft,useRef:p,useState:u,useSyncExternalStore:Dt,useTransition:Ht}=Je;import{t as Ge}from"./jsx-runtime-CTsRTJUX.js";var Qe=Ge(),{jsx:t,jsxs:o,Fragment:N}=Qe;var x="\0all";function B(n,s=28){let m=n.trim().replace(/\s+/g," ");return m.length>s?`${m.slice(0,s).trimEnd()}\u2026`:m}function Xe(){return new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"})}function Ze(){return`mem-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,7)}`}function _e(){return typeof window<"u"&&window.matchMedia?.("(prefers-reduced-motion: reduce)").matches}function ve(n,s,m){return`${n} ${n===1?s:m}`}var E={viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:1.4,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!0},et=()=>t("svg",{...E,children:t("path",{d:"M10.25 3 13 5.75 6 12.75H3.25V10z"})}),tt=()=>t("svg",{...E,children:t("path",{d:"M6 4v8M10 4v8"})}),at=()=>t("svg",{...E,children:t("path",{d:"M5.25 3.75v8.5L12 8z"})}),rt=()=>t("svg",{...E,children:t("path",{d:"M2.75 4.25h10.5M6.25 4.25V2.75h3.5v1.5M4.25 4.25l.6 9h6.3l.6-9"})}),ye=()=>o("svg",{...E,children:[t("circle",{cx:"7",cy:"7",r:"4.25"}),t("path",{d:"m10.25 10.25 3 3"})]}),it=()=>t("svg",{...E,children:t("path",{d:"m4.5 4.5 7 7m0-7-7 7"})}),nt=()=>t("svg",{...E,children:t("path",{d:"M8 3.25v9.5M3.25 8h9.5"})}),ot=()=>o("svg",{...E,children:[t("path",{d:"M5.5 3.75 2.75 6.5 5.5 9.25"}),t("path",{d:"M2.75 6.5h6.5a3.5 3.5 0 0 1 0 7h-2"})]});function Y({value:n}){let s=p(n),m=n>s.current?"up":n<s.current?"down":"none";return k(()=>{s.current=n},[n]),t("span",{className:"ui-at-mem__roll",children:t("span",{"data-dir":m,children:n},n)})}function we({value:n,onChange:s,onKeyDown:m,label:A,autoFocus:L}){let v=p(null);return be(()=>{let d=v.current;d&&(d.style.height="auto",d.style.height=`${d.scrollHeight}px`)},[n]),k(()=>{if(!L)return;let d=v.current;d&&(d.focus({preventScroll:!0}),d.setSelectionRange(d.value.length,d.value.length))},[L]),t("textarea",{ref:v,className:"ui-at-mem__field",rows:1,value:n,"aria-label":A,onChange:d=>s(d.target.value),onKeyDown:m})}function ke({memories:n,onChange:s,onAdd:m,onEdit:A,onPause:L,onForget:v,onRestore:d,enabled:K,defaultEnabled:J=!0,onEnabledChange:Me,categories:ae,title:Se="Memory",maxHeight:Te=360,undoFor:Ce=5e3,addedSource:Ae="You added",action:G,className:Le}){let D=he(),re=!!s,[Re,Fe]=u(n),M=re?n:Re,S=p(M);S.current=M;let[De,He]=u(J),H=K??De,[_,I]=u(x),[Ie,ie]=u(!1),[Q,q]=u(""),[f,T]=u(null),[l,y]=u(null),[R,ne]=u([]),[$e,O]=u([]),[g,X]=u(null),j=p(null),Pe=p(null),oe=p(null),se=p(null),de=p([]),U=p(void 0),b=p(null);k(()=>()=>{de.current.forEach(clearTimeout),clearTimeout(U.current)},[]);let ze=(e,i)=>{de.current.push(setTimeout(i,e))},$=e=>{re||Fe(e),s?.(e)},h=xe(()=>{let e=[...ae??[]];for(let i of M)e.includes(i.category)||e.push(i.category);return g&&!e.includes(g.memory.category)&&e.push(g.memory.category),e},[ae,M,g]);k(()=>{_!==x&&!h.includes(_)&&I(x)},[h,_]);let V=Q.trim().toLowerCase(),w=M.filter(e=>!R.includes(e.id)),P=e=>(_===x||e.category===_)&&(!V||e.text.toLowerCase().includes(V)),W=w.filter(e=>e.paused).length,me=w.filter(P).length,Ke=e=>{K===void 0&&He(e),Me?.(e)},qe=e=>{let i=!e.paused;$(S.current.map(a=>a.id===e.id?{...a,paused:i}:a)),L?.(e.id,i)},Oe=e=>{if(R.includes(e.id))return;let i=!!j.current?.contains(document.activeElement);f?.id===e.id&&T(null),ne(a=>[...a,e.id]),ze(_e()?0:300,()=>{let a=S.current,r=a.findIndex(c=>c.id===e.id);ne(c=>c.filter(F=>F!==e.id)),!(r<0)&&($(a.filter(c=>c.id!==e.id)),v?.(e.id),X({memory:a[r],index:r}),i&&(b.current={undo:!0}),clearTimeout(U.current),U.current=setTimeout(()=>X(null),Ce))})},je=()=>{if(!g)return;clearTimeout(U.current);let{memory:e,index:i}=g,a=S.current.filter(c=>c.id!==e.id),r=[...a.slice(0,i),e,...a.slice(i)];$(r),d?.(e),X(null),O(c=>[...c,e.id]),P(e)||(I(x),q("")),b.current={id:e.id},requestAnimationFrame(()=>requestAnimationFrame(()=>O(c=>c.filter(F=>F!==e.id))))},le=()=>{if(!f)return;let e=f.text.trim();if(!e)return;let i=S.current.find(a=>a.id===f.id);i&&i.text!==e&&($(S.current.map(a=>a.id===f.id?{...a,text:e}:a)),A?.(f.id,e)),b.current={id:f.id},T(null)},ce=()=>{if(!l)return;let e=l.text.trim();if(!e)return;let i={id:Ze(),text:e,category:l.category,source:Ae,date:Xe()};$([...S.current,i]),m?.(i),y(null),O(a=>[...a,i.id]),P(i)||(I(x),q("")),b.current={add:!0},requestAnimationFrame(()=>requestAnimationFrame(()=>O(a=>a.filter(r=>r!==i.id))))},ue=(e,i)=>a=>{a.key==="Enter"&&!a.shiftKey&&!a.nativeEvent.isComposing?(a.preventDefault(),e()):a.key==="Escape"&&(a.preventDefault(),a.stopPropagation(),i())};k(()=>{let e=b.current;if(!e)return;b.current=null;let i=j.current;if(i&&(e.undo&&se.current?.focus({preventScroll:!0}),e.add&&i.querySelector(".ui-at-mem__add")?.focus({preventScroll:!0}),e.id)){let a=i.querySelector(`[data-memory-id="${CSS.escape(e.id)}"]`);a?.querySelector("[data-act='edit']")?.focus({preventScroll:!0}),a?.scrollIntoView({block:"nearest",behavior:_e()?"auto":"smooth"})}});let C=[x,...h],Ue=e=>{let i=C.indexOf(_),a=-1;if(e.key==="ArrowRight"||e.key==="ArrowDown"?a=(i+1)%C.length:e.key==="ArrowLeft"||e.key==="ArrowUp"?a=(i-1+C.length)%C.length:e.key==="Home"?a=0:e.key==="End"&&(a=C.length-1),a<0)return;e.preventDefault(),I(C[a]);let r=e.currentTarget.querySelectorAll("[role=radio]")[a];r?.focus(),r?.scrollIntoView({block:"nearest",inline:"nearest"})},Ve=e=>{if(!l)return;let i=h.indexOf(l.category),a=-1;e.key==="ArrowRight"||e.key==="ArrowDown"?a=(i+1)%h.length:(e.key==="ArrowLeft"||e.key==="ArrowUp")&&(a=(i-1+h.length)%h.length),!(a<0)&&(e.preventDefault(),y({...l,category:h[a]}),e.currentTarget.querySelectorAll("[role=radio]")[a]?.focus())},We=()=>{ie(!0),requestAnimationFrame(()=>oe.current?.focus())},pe=()=>{ie(!1),q("")},z="counts",Z=o(N,{children:[t("strong",{children:t(Y,{value:w.length})})," ",w.length===1?"memory":"memories",W>0&&o(N,{children:[" \xB7 ",t(Y,{value:W})," paused"]})]}),ee=`${ve(w.length,"memory","memories")}${W?`, ${W} paused`:""}`;f||l?(z="hint",Z=o(N,{children:[t("kbd",{children:"Enter"})," to save \xB7 ",t("kbd",{children:"Shift"})," + ",t("kbd",{children:"Enter"})," new line \xB7 ",t("kbd",{children:"Esc"})," to cancel"]}),ee="Enter to save, Shift Enter for a new line, Escape to cancel"):g?(z=`undo-${g.memory.id}`,Z=o(N,{children:["Forgot \u201C",t("strong",{children:g.memory.text}),"\u201D"]}),ee=`Forgot \u201C${g.memory.text}\u201D. Undo is available.`):V&&!me&&(z="none");let fe=`${D}-note`,ge=M.length===0&&R.length===0;return o("div",{ref:j,className:["ui-at-mem",Le].filter(Boolean).join(" "),role:"group","aria-labelledby":`${D}-title`,"data-off":!H||void 0,children:[t("style",{href:"ui-memory-panel",precedence:"default",children:st}),o("div",{className:"ui-at-mem__panel",children:[o("div",{className:"ui-at-mem__head",children:[o("h3",{id:`${D}-title`,className:"ui-at-mem__title",children:[Se,t("span",{className:"ui-at-mem__badge","aria-label":ve(w.length,"memory","memories"),children:t(Y,{value:w.length})})]}),o("button",{type:"button",role:"switch","aria-checked":H,"aria-controls":fe,"aria-label":"Use memory",className:"ui-at-mem__switch",onClick:()=>Ke(!H),children:[t("span",{className:"ui-at-mem__switch-label","aria-hidden":"true",children:"Use memory"}),t("span",{className:"ui-at-mem__track","aria-hidden":"true",children:t("span",{className:"ui-at-mem__knob"})})]})]}),t("div",{id:fe,className:"ui-at-mem__fold","data-open":!H||void 0,inert:H,children:t("div",{children:t("p",{className:"ui-at-mem__note",children:"Memory is off. The assistant won't use or save memories in new chats \u2013 what's here stays until you forget it."})})}),!ge&&t("div",{className:"ui-at-mem__filters",children:Ie?o("div",{className:"ui-at-mem__search",children:[t(ye,{}),t("input",{ref:oe,type:"search",value:Q,placeholder:"Search memories","aria-label":"Search memories",onChange:e=>q(e.target.value),onKeyDown:e=>{e.key==="Escape"&&(e.preventDefault(),pe(),requestAnimationFrame(()=>j.current?.querySelector(".ui-at-mem__search-btn")?.focus()))}}),t("button",{type:"button",className:"ui-at-mem__icon-btn","aria-label":"Close search",onClick:pe,children:t(it,{})})]}):o(N,{children:[t("div",{className:"ui-at-mem__chips",role:"radiogroup","aria-label":"Category",onKeyDown:Ue,children:C.map(e=>{let i=w.filter(r=>e===x||r.category===e).length,a=e===_;return o("button",{type:"button",role:"radio","aria-checked":a,tabIndex:a?0:-1,className:"ui-at-mem__chip",onClick:()=>I(e),children:[e===x?"All":e,t("span",{className:"ui-at-mem__chip-n",children:t(Y,{value:i})})]},e)})}),t("button",{type:"button",className:"ui-at-mem__icon-btn ui-at-mem__search-btn","aria-label":"Search memories",onClick:We,children:t(ye,{})})]})}),t("div",{ref:Pe,className:"ui-at-mem__scroll",style:{maxHeight:Te},children:ge?t("p",{className:"ui-at-mem__empty",children:"Nothing remembered yet. What you add here, or what the assistant keeps from your chats, shows up here."}):o(N,{children:[h.map(e=>{let i=M.filter(r=>r.category===e);if(!i.length)return null;let a=i.some(r=>P(r)&&!R.includes(r.id));return t("section",{className:"ui-at-mem__fold","data-open":a||void 0,inert:!a,"aria-labelledby":`${D}-g-${e}`,children:o("div",{children:[t("h4",{id:`${D}-g-${e}`,className:"ui-at-mem__group",children:e}),i.map(r=>{let c=P(r)&&!R.includes(r.id)&&!$e.includes(r.id),F=f?.id===r.id;return t("div",{className:"ui-at-mem__fold ui-at-mem__fold--row","data-open":c||void 0,"data-leaving":R.includes(r.id)||void 0,"data-memory-id":r.id,inert:!c,children:t("div",{children:t("article",{className:"ui-at-mem__row","data-paused":r.paused||void 0,"data-editing":F||void 0,children:F?o("div",{className:"ui-at-mem__editor",children:[t(we,{value:f.text,label:`Edit memory \u201C${B(r.text)}\u201D`,onChange:Be=>T({id:r.id,text:Be}),onKeyDown:ue(le,()=>{b.current={id:r.id},T(null)}),autoFocus:!0}),o("div",{className:"ui-at-mem__editor-actions",children:[t("button",{type:"button",className:"ui-at-mem__btn","data-variant":"ghost",onClick:()=>{b.current={id:r.id},T(null)},children:"Cancel"}),t("button",{type:"button",className:"ui-at-mem__btn","data-variant":"primary","aria-disabled":!f.text.trim()||void 0,onClick:le,children:"Save"})]})]}):o(N,{children:[o("div",{className:"ui-at-mem__body",children:[t("p",{className:"ui-at-mem__text",children:r.text}),o("p",{className:"ui-at-mem__meta",children:[[r.source,r.date].filter(Boolean).join(" \xB7 "),t("span",{className:"ui-at-mem__paused","data-on":r.paused||void 0,children:"Paused"})]})]}),o("div",{className:"ui-at-mem__acts",children:[t("button",{type:"button","data-act":"edit",className:"ui-at-mem__icon-btn","aria-label":`Edit \u201C${B(r.text)}\u201D`,title:"Edit",onClick:()=>{y(null),T({id:r.id,text:r.text})},children:t(et,{})}),t("button",{type:"button","data-act":"pause",className:"ui-at-mem__icon-btn","aria-label":`${r.paused?"Resume":"Pause"} \u201C${B(r.text)}\u201D`,title:r.paused?"Resume":"Pause",onClick:()=>qe(r),children:t("span",{className:"ui-at-mem__swap",children:r.paused?t(at,{}):t(tt,{})},r.paused?"play":"pause")}),t("button",{type:"button","data-act":"forget",className:"ui-at-mem__icon-btn","data-tone":"danger","aria-label":`Forget \u201C${B(r.text)}\u201D`,title:"Forget",onClick:()=>Oe(r),children:t(rt,{})})]})]})})})},r.id)})]})},e)}),me===0&&t("p",{className:"ui-at-mem__empty",children:V?`No memories match \u201C${Q.trim()}\u201D.`:"No memories in this category."})]})}),t("div",{className:"ui-at-mem__foot",children:l?o("div",{className:"ui-at-mem__new",children:[t(we,{value:l.text,label:"New memory",onChange:e=>y({...l,text:e}),onKeyDown:ue(ce,()=>{b.current={add:!0},y(null)}),autoFocus:!0}),o("div",{className:"ui-at-mem__new-row",children:[t("div",{className:"ui-at-mem__cats",role:"radiogroup","aria-label":"Category of the new memory",onKeyDown:Ve,children:h.map(e=>t("button",{type:"button",role:"radio","aria-checked":l.category===e,tabIndex:l.category===e?0:-1,className:"ui-at-mem__chip","data-size":"s",onClick:()=>y({...l,category:e}),children:e},e))}),o("div",{className:"ui-at-mem__editor-actions",children:[t("button",{type:"button",className:"ui-at-mem__btn","data-variant":"ghost",onClick:()=>{b.current={add:!0},y(null)},children:"Cancel"}),t("button",{type:"button",className:"ui-at-mem__btn","data-variant":"primary","aria-disabled":!l.text.trim()||void 0,onClick:ce,children:"Save"})]})]})]}):o("button",{type:"button",className:"ui-at-mem__add",onClick:()=>{T(null),y({text:"",category:_!==x?_:h[0]??"General"})},children:[t(nt,{}),"New memory"]})})]}),o("div",{className:"ui-at-mem__tray",children:[t("p",{className:"ui-at-mem__tray-text","aria-hidden":"true",children:z==="none"?"Nothing found":Z},z),t("span",{className:"ui-at-mem__sr",role:"status","aria-live":"polite",children:ee}),g&&!f&&!l?o("button",{ref:se,type:"button",className:"ui-at-mem__tray-btn",onClick:je,children:[t(ot,{}),"Undo"]}):G&&t("button",{type:"button",className:"ui-at-mem__tray-btn",onClick:G.onClick,children:G.label})]})]})}var st=`
.ui-at-mem {
  --frame: #f2f6fa;
  --panel: #ffffff;
  --soft: rgba(26, 62, 112, 0.06);
  --hairline: #dae2ec;
  --firm: #cbd6e4;
  --ink: #00162b;
  --text: rgba(0, 22, 43, 0.66);
  --muted: rgba(0, 22, 43, 0.54);
  --berry: #851437;
  --berry-hover: #6d0f2d;
  --secondary: #fbfcfe;
  --info-ink: #1a3e70;
  --info-fill: #eef5ff;
  --info-line: #c1daff;
  --ring: #8fbdf2;
  --bad-ink: #8a3a22;
  --bad-fill: #fdeee8;
  --track-off: #cbd6e4;
  --shadow-drop: 0 8px 16px -8px rgba(26, 62, 112, 0.2);
  --shadow-raised: 0 18px 30px -16px rgba(26, 62, 112, 0.38), 0 4px 10px -6px rgba(26, 62, 112, 0.18);
  --shadow-float: 0 24px 48px -24px rgba(26, 62, 112, 0.3);
  --ease: cubic-bezier(0.16, 1, 0.3, 1);

  position: relative;
  box-sizing: border-box;
  width: 100%;
  max-width: 380px;
  min-width: 0;
  container-type: inline-size;
  background: var(--frame);
  border: 1px solid var(--hairline);
  border-radius: 22px;
  padding: 6px;
  box-shadow: var(--shadow-float);
  font-family: "Avenir Next", Avenir, system-ui, sans-serif;
  font-size: 13px;
  line-height: 1.45;
  color: var(--text);
  -webkit-font-smoothing: antialiased;
}
:where(.dark, [data-theme="dark"]) .ui-at-mem {
  --frame: #0f2747;
  --panel: #16345c;
  --soft: rgba(255, 255, 255, 0.07);
  --hairline: rgba(255, 255, 255, 0.12);
  --firm: rgba(255, 255, 255, 0.18);
  --ink: rgba(255, 255, 255, 0.94);
  --text: rgba(255, 255, 255, 0.72);
  --muted: rgba(255, 255, 255, 0.56);
  --berry: #a8204d;
  --berry-hover: #bd2a5a;
  --secondary: rgba(255, 255, 255, 0.06);
  --info-ink: #c1daff;
  --info-fill: rgba(143, 189, 242, 0.16);
  --info-line: rgba(143, 189, 242, 0.3);
  --ring: rgba(143, 189, 242, 0.6);
  --bad-ink: #f2a48c;
  --bad-fill: rgba(242, 164, 140, 0.14);
  --track-off: rgba(255, 255, 255, 0.22);
  --shadow-drop: 0 8px 16px -8px rgba(3, 12, 28, 0.6);
  --shadow-raised: 0 18px 30px -16px rgba(3, 12, 28, 0.8), 0 4px 10px -6px rgba(3, 12, 28, 0.6);
  --shadow-float: 0 24px 48px -24px rgba(3, 12, 28, 0.7);
}
.ui-at-mem *, .ui-at-mem *::before, .ui-at-mem *::after { box-sizing: border-box; }
.ui-at-mem p, .ui-at-mem h3, .ui-at-mem h4 { margin: 0; }

.ui-at-mem__panel {
  background: var(--panel);
  border: 1px solid var(--hairline);
  border-radius: 16px;
  box-shadow: var(--shadow-raised);
  overflow: hidden;
}
.ui-at-mem__head { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 12px 12px 8px 14px; }
.ui-at-mem__title {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  font-family: "Avenir Next Condensed", "Avenir Next", Avenir, system-ui, sans-serif;
  font-size: 17px;
  font-weight: 700;
  color: var(--ink);
}
.ui-at-mem__badge {
  display: inline-grid;
  place-items: center;
  min-width: 22px;
  height: 20px;
  padding: 0 6px;
  border-radius: 6px;
  border: 1px solid var(--hairline);
  background: var(--soft);
  color: var(--text);
  font: 600 11.5px/1 "Avenir Next", Avenir, system-ui, sans-serif;
  font-variant-numeric: tabular-nums;
}
.ui-at-mem__roll { display: inline-block; overflow: hidden; vertical-align: bottom; line-height: inherit; }
.ui-at-mem__roll > span { display: inline-block; }
.ui-at-mem__roll > span[data-dir="up"] { animation: ui-at-mem-up 300ms var(--ease) both; }
.ui-at-mem__roll > span[data-dir="down"] { animation: ui-at-mem-down 300ms var(--ease) both; }

.ui-at-mem__switch {
  appearance: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 4px 4px 8px;
  margin: -4px -4px -4px 0;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: var(--text);
  font: inherit;
  cursor: pointer;
}
.ui-at-mem__switch:focus-visible { outline: none; box-shadow: 0 0 0 3px var(--ring); }
.ui-at-mem__track {
  position: relative;
  width: 30px;
  height: 18px;
  border-radius: 999px;
  background: var(--track-off);
  box-shadow: inset 0 1px 2px rgba(0, 22, 43, 0.15);
  transition: background-color 300ms var(--ease);
}
.ui-at-mem__switch[aria-checked="true"] .ui-at-mem__track { background: var(--berry); }
.ui-at-mem__knob {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 22, 43, 0.3);
  transition: transform 150ms var(--ease);
}
.ui-at-mem__switch[aria-checked="true"] .ui-at-mem__knob { transform: translateX(12px); }

/* Folding: rows, groups and the off note open and close on a grid track. */
.ui-at-mem__fold {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  transition: grid-template-rows 300ms var(--ease), opacity 300ms var(--ease), filter 300ms var(--ease);
}
.ui-at-mem__fold > div { min-height: 0; overflow: hidden; }
.ui-at-mem__fold[data-open] { grid-template-rows: 1fr; opacity: 1; }
.ui-at-mem__fold[data-leaving] { filter: blur(3px); }

.ui-at-mem__note {
  margin: 0 12px 8px !important;
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid var(--info-line);
  background: var(--info-fill);
  color: var(--info-ink);
  font-size: 12px;
}

.ui-at-mem__filters {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 8px 8px 12px;
  border-bottom: 1px solid var(--hairline);
  min-width: 0;
}
.ui-at-mem__chips {
  flex: 1;
  display: flex;
  gap: 2px;
  min-width: 0;
  overflow-x: auto;
  scrollbar-width: none;
  padding: 2px;
  margin: -2px;
  mask-image: linear-gradient(to right, #000 calc(100% - 20px), transparent);
}
.ui-at-mem__chips::-webkit-scrollbar { display: none; }
.ui-at-mem__chip {
  appearance: none;
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 28px;
  padding: 0 9px;
  border-radius: 9px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--text);
  font: inherit;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 150ms var(--ease), color 150ms var(--ease), border-color 150ms var(--ease);
}
.ui-at-mem__chip:hover { color: var(--ink); background: var(--soft); }
.ui-at-mem__chip[aria-checked="true"] { background: var(--info-fill); border-color: var(--info-line); color: var(--info-ink); }
.ui-at-mem__chip:focus-visible { outline: none; box-shadow: 0 0 0 3px var(--ring); }
.ui-at-mem__chip[data-size="s"] { height: 26px; font-size: 12px; }
.ui-at-mem__chip-n { color: var(--muted); font-size: 12px; font-variant-numeric: tabular-nums; }
.ui-at-mem__chip[aria-checked="true"] .ui-at-mem__chip-n { color: inherit; opacity: 0.75; }

.ui-at-mem__icon-btn {
  appearance: none;
  flex: none;
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--muted);
  cursor: pointer;
  transition: background-color 150ms var(--ease), color 150ms var(--ease), transform 150ms var(--ease);
}
.ui-at-mem__icon-btn svg { width: 15px; height: 15px; }
.ui-at-mem__icon-btn:hover { background: var(--soft); color: var(--ink); }
.ui-at-mem__icon-btn[data-tone="danger"]:hover { background: var(--bad-fill); color: var(--bad-ink); }
.ui-at-mem__icon-btn:active { transform: scale(0.92); }
.ui-at-mem__icon-btn:focus-visible { outline: none; box-shadow: 0 0 0 3px var(--ring); }

.ui-at-mem__search {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 2px 0 10px;
  border-radius: 10px;
  border: 1px solid var(--firm);
  background: var(--panel);
  box-shadow: inset 0 1px 2px rgba(26, 62, 112, 0.08);
  color: var(--muted);
  animation: ui-at-mem-fade 150ms var(--ease) both;
}
.ui-at-mem__search:focus-within { box-shadow: 0 0 0 3px var(--ring); }
.ui-at-mem__search > svg { width: 14px; height: 14px; flex: none; }
.ui-at-mem__search input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--ink);
  caret-color: var(--berry);
  font: inherit;
}
.ui-at-mem__search input::-webkit-search-cancel-button { display: none; }
.ui-at-mem__search .ui-at-mem__icon-btn { width: 26px; height: 26px; }

.ui-at-mem__scroll { overflow-y: auto; overscroll-behavior: contain; padding: 6px 0; scrollbar-width: thin; }
.ui-at-mem__group { padding: 8px 14px 2px; font-size: 12px; font-weight: 500; color: var(--muted); }
.ui-at-mem__row {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 6px;
  padding: 6px 8px 6px 14px;
  transition: background-color 150ms var(--ease);
}
.ui-at-mem__row:hover, .ui-at-mem__row:focus-within { background: var(--soft); }
.ui-at-mem__row[data-editing] { background: transparent; }
.ui-at-mem__body { flex: 1; min-width: 0; }
.ui-at-mem__text { color: var(--ink); overflow-wrap: anywhere; transition: color 300ms var(--ease); }
.ui-at-mem__row[data-paused] .ui-at-mem__text { color: var(--muted); }
.ui-at-mem__meta { display: flex; align-items: center; flex-wrap: wrap; gap: 0 6px; margin-top: 2px !important; color: var(--muted); font-size: 12px; }
.ui-at-mem__paused {
  display: none;
  height: 18px;
  padding: 0 6px;
  border-radius: 5px;
  border: 1px solid var(--info-line);
  background: var(--info-fill);
  color: var(--info-ink);
  font-size: 11px;
  font-weight: 600;
  line-height: 16px;
}
.ui-at-mem__paused[data-on] { display: inline-block; animation: ui-at-mem-fade 300ms var(--ease) both; }
.ui-at-mem__acts {
  position: absolute;
  top: 4px;
  right: 6px;
  display: flex;
  gap: 1px;
  padding: 2px;
  border-radius: 10px;
  background: var(--panel);
  border: 1px solid var(--hairline);
  box-shadow: var(--shadow-drop);
  opacity: 0;
  pointer-events: none;
  transition: opacity 150ms var(--ease);
}
.ui-at-mem__row:hover .ui-at-mem__acts, .ui-at-mem__row:focus-within .ui-at-mem__acts { pointer-events: auto; }
.ui-at-mem__row:hover .ui-at-mem__acts, .ui-at-mem__row:focus-within .ui-at-mem__acts { opacity: 1; }
.ui-at-mem__swap { display: grid; animation: ui-at-mem-pop 150ms var(--ease) both; }

.ui-at-mem__editor, .ui-at-mem__new { flex: 1; display: grid; gap: 8px; min-width: 0; }
.ui-at-mem__field {
  display: block;
  width: 100%;
  min-height: 36px;
  max-height: 160px;
  padding: 8px 10px;
  resize: none;
  border-radius: 10px;
  border: 1px solid var(--firm);
  background: var(--panel);
  box-shadow: inset 0 1px 2px rgba(26, 62, 112, 0.08);
  color: var(--ink);
  caret-color: var(--berry);
  font: inherit;
  line-height: 1.45;
  outline: none;
}
.ui-at-mem__field:focus { border-color: var(--ring); box-shadow: 0 0 0 3px var(--ring); }
.ui-at-mem__editor-actions { display: flex; justify-content: flex-end; gap: 6px; flex: none; }
.ui-at-mem__btn {
  appearance: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid transparent;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 150ms var(--ease), transform 150ms var(--ease), opacity 150ms var(--ease);
}
.ui-at-mem__btn:active:not([aria-disabled]) { transform: scale(0.97); }
.ui-at-mem__btn:focus-visible { outline: none; box-shadow: 0 0 0 3px var(--ring); }
.ui-at-mem__btn[data-variant="ghost"] { background: transparent; color: var(--ink); }
.ui-at-mem__btn[data-variant="ghost"]:hover { background: var(--soft); }
.ui-at-mem__btn[data-variant="primary"] {
  background: var(--berry);
  color: #fff;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 6px 12px -6px rgba(133, 20, 55, 0.6);
}
.ui-at-mem__btn[data-variant="primary"]:hover:not([aria-disabled]) { background: var(--berry-hover); }
.ui-at-mem__btn[aria-disabled] { opacity: 0.45; cursor: default; }

.ui-at-mem__foot { border-top: 1px solid var(--hairline); padding: 6px; }
.ui-at-mem__add {
  appearance: none;
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 32px;
  padding: 0 8px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: var(--muted);
  font: inherit;
  cursor: pointer;
  transition: background-color 150ms var(--ease), color 150ms var(--ease);
}
.ui-at-mem__add svg { width: 14px; height: 14px; }
.ui-at-mem__add:hover { background: var(--soft); color: var(--ink); }
.ui-at-mem__add:focus-visible { outline: none; box-shadow: 0 0 0 3px var(--ring); }
.ui-at-mem__new { padding: 4px; animation: ui-at-mem-fade 150ms var(--ease) both; }
.ui-at-mem__new-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; justify-content: space-between; }
.ui-at-mem__cats { display: flex; gap: 2px; flex-wrap: wrap; min-width: 0; }

.ui-at-mem__empty { padding: 18px 16px !important; text-align: center; color: var(--muted); font-size: 12.5px; }

.ui-at-mem__tray { display: flex; align-items: center; gap: 8px; min-height: 40px; padding: 4px 4px 2px 10px; }
.ui-at-mem__tray-text {
  flex: 1;
  min-width: 0;
  color: var(--muted);
  font-size: 12.5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  animation: ui-at-mem-fade 300ms var(--ease) both;
}
.ui-at-mem__tray-text strong { color: var(--ink); font-weight: 600; }
.ui-at-mem__tray-text kbd {
  display: inline-grid;
  place-items: center;
  min-width: 18px;
  height: 17px;
  padding: 0 4px;
  border-radius: 5px;
  border: 1px solid var(--hairline);
  border-bottom-color: var(--firm);
  background: var(--panel);
  color: var(--text);
  font: 500 10.5px/1 "Avenir Next", Avenir, system-ui, sans-serif;
}
.ui-at-mem__tray-btn {
  appearance: none;
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 30px;
  padding: 0 10px;
  border-radius: 10px;
  border: 1px solid var(--firm);
  background: var(--secondary);
  box-shadow: var(--shadow-drop);
  color: var(--ink);
  font: inherit;
  font-weight: 600;
  cursor: pointer;
  animation: ui-at-mem-fade 300ms var(--ease) both;
  transition: transform 150ms var(--ease);
}
.ui-at-mem__tray-btn svg { width: 14px; height: 14px; }
.ui-at-mem__tray-btn:active { transform: scale(0.97); }
.ui-at-mem__tray-btn:focus-visible { outline: none; box-shadow: 0 0 0 3px var(--ring); }

.ui-at-mem[data-off] .ui-at-mem__scroll, .ui-at-mem[data-off] .ui-at-mem__filters { opacity: 0.5; transition: opacity 300ms var(--ease); }
.ui-at-mem__scroll, .ui-at-mem__filters { transition: opacity 300ms var(--ease); }

.ui-at-mem__sr {
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

@keyframes ui-at-mem-up { from { transform: translateY(70%); opacity: 0; } to { transform: none; opacity: 1; } }
@keyframes ui-at-mem-down { from { transform: translateY(-70%); opacity: 0; } to { transform: none; opacity: 1; } }
@keyframes ui-at-mem-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes ui-at-mem-pop { from { transform: scale(0.6); opacity: 0; } to { transform: none; opacity: 1; } }

@container (max-width: 340px) {
  .ui-at-mem__chip-n { display: none; }
}
@container (max-width: 320px) {
  .ui-at-mem__switch-label { display: none; }
}
@media (hover: none) {
  .ui-at-mem__acts { position: static; opacity: 1; pointer-events: auto; padding: 0; border: 0; background: none; box-shadow: none; }
  .ui-at-mem__icon-btn { width: 36px; height: 36px; }
  .ui-at-mem__chip { height: 36px; }
  .ui-at-mem__add, .ui-at-mem__btn, .ui-at-mem__tray-btn { height: 40px; }
}
@media (prefers-reduced-motion: reduce) {
  .ui-at-mem, .ui-at-mem *, .ui-at-mem *::before, .ui-at-mem *::after {
    transition-duration: 0ms !important;
    animation-duration: 0ms !important;
    animation-delay: 0ms !important;
  }
}
`;var dt=[{id:"ts",text:"Prefers TypeScript examples over plain JavaScript",category:"Preferences",source:"From chat",date:"Oct 12"},{id:"short",text:"Likes short answers first, details only when asked",category:"Preferences",source:"You added",date:"Oct 2",paused:!0},{id:"grid",text:"Designs with Inter and a 4px spacing grid",category:"Preferences",source:"From Figma",date:"Oct 7"},{id:"role",text:"Product designer and front-end developer at a small studio",category:"Work",source:"From chat",date:"Sep 28"},{id:"stack",text:"Ships with React, Vite and Tailwind; deploys on Vercel",category:"Work",source:"From chat",date:"Oct 3"},{id:"notes",text:"Sends release notes to clients every Friday",category:"Work",source:"From chat",date:"Oct 9"},{id:"fintech",text:"Redesigning the onboarding flow for a fintech client, due Oct 24",category:"Projects",source:"From chat",date:"Oct 11"},{id:"tokens",text:"Keeps design tokens in one tokens.json shared with the code",category:"Projects",source:"From chat",date:"Oct 5"}],te=(n,s)=>n.querySelector(s)?.click(),Ne=(n,s)=>Array.from(n.querySelectorAll(".ui-at-mem__chips [role=radio]")).find(m=>m.textContent?.startsWith(s))?.click(),Ee=[{wait:1400,run:n=>te(n,'[data-memory-id="ts"] [data-act="forget"]')},{wait:2600,run:n=>Array.from(n.querySelectorAll(".ui-at-mem__tray-btn")).find(s=>s.textContent?.includes("Undo"))?.click()},{wait:1600,run:n=>Ne(n,"Projects")},{wait:1800,run:n=>Ne(n,"All")},{wait:1400,run:n=>te(n,'[data-memory-id="short"] [data-act="pause"]')},{wait:1600,run:n=>te(n,'[data-memory-id="short"] [data-act="pause"]')}];function mt(){let n=p(null),[s,m]=u(!0),[A,L]=u(0);k(()=>{if(!s)return;let d=Ee[A],K=setTimeout(()=>{n.current&&d.run(n.current),L(J=>(J+1)%Ee.length)},d.wait);return()=>clearTimeout(K)},[A,s]);let v=d=>{d.isTrusted&&m(!1)};return t("div",{ref:n,style:{width:"100%",maxWidth:380},onPointerDownCapture:v,onKeyDownCapture:v,children:t(ke,{memories:dt,maxHeight:330})})}export{mt as default};
