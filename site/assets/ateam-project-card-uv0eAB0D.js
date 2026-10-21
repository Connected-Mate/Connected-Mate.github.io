"use client";import{t as ke}from"./react-BkAXpnfr.js";var ye=ke();var{Children:Oe,Component:Re,Fragment:Be,StrictMode:De,cloneElement:Le,createContext:Ie,createElement:Ae,createRef:He,forwardRef:Fe,isValidElement:Ke,lazy:We,memo:Je,startTransition:Ue,Suspense:Ve,use:qe,useCallback:Q,useContext:Xe,useDebugValue:Ye,useDeferredValue:Ze,useEffect:k,useId:ee,useImperativeHandle:Ge,useInsertionEffect:Qe,useLayoutEffect:ea,useMemo:ae,useOptimistic:aa,useReducer:ia,useRef:y,useState:d,useSyncExternalStore:na,useTransition:ra}=ye;import{t as we}from"./jsx-runtime-CTsRTJUX.js";var Ne=we(),{jsx:a,jsxs:o,Fragment:sa}=Ne;var ie=[{id:"todo",label:"To do",tone:"gray"},{id:"progress",label:"In progress",tone:"amber"},{id:"review",label:"In review",tone:"blue"},{id:"done",label:"Done",tone:"green"}];function Te(n){let i=n.trim().split(/\s+/).filter(Boolean);return i.length?i[0].slice(0,1).toUpperCase():"?"}function Pe(n){let i=0;for(let r=0;r<n.length;r++)i=i*31+n.charCodeAt(r)>>>0;return i%4}function ne(n,i,r,c){let l=(c-90)*Math.PI/180;return{x:n+r*Math.cos(l),y:i+r*Math.sin(l)}}function Ce(n,i,r,c,l){let m=ne(n,i,r,c),_=ne(n,i,r,l),p=l-c>180?1:0;return`M ${m.x.toFixed(3)} ${m.y.toFixed(3)} A ${r} ${r} 0 ${p} 1 ${_.x.toFixed(3)} ${_.y.toFixed(3)}`}function Me(){let[n,i]=d(!1);return k(()=>{if(typeof window>"u"||!window.matchMedia)return;let r=window.matchMedia("(hover: none), (pointer: coarse)"),c=()=>i(r.matches);return c(),r.addEventListener?.("change",c),()=>r.removeEventListener?.("change",c)},[]),n}function oe({title:n,tasks:i,onTasksChange:r,status:c,statuses:l=ie,onStatusChange:m,due:_,members:p=[],action:w,hint:j,trigger:f="hover",open:N,defaultOpen:W=!1,onOpenChange:J,className:se}){let x=ee().replace(/:/g,""),L=y(null),U=y(null),S=y(null),ce=Me(),[pe,V]=d(i),O=JSON.stringify(i),q=y(O);k(()=>{q.current!==O&&(q.current=O,V(i))},[O,i]);let v=r?i:pe,R=l.length?l:ie,[de,X]=d(c??R[0].id);k(()=>{c!==void 0&&X(c)},[c]);let b=R.find(e=>e.id===de)??R[0],Y=y(null),[T,C]=d(!1),[ue,le]=d(W),t=N??ue,[M,B]=d(W),h=Q(e=>{N===void 0&&le(e),e!==t&&J?.(e),e||(B(!1),C(!1))},[t,N,J]),[I,$]=d(null),[fe,E]=d(null),[z,Z]=d(null),g=fe??z;k(()=>{if(!T)return;let e=setTimeout(()=>{Y.current?.querySelector("input:checked")?.focus()},0);return()=>clearTimeout(e)},[T]),k(()=>{z&&!p.some(e=>e.name===z)&&Z(null)},[p,z]),k(()=>{if(!t)return;let e=s=>{L.current?.contains(s.target)||s.pointerType==="mouse"&&f==="hover"&&!M||h(!1)};return document.addEventListener("pointerdown",e),()=>document.removeEventListener("pointerdown",e)},[t,M,f,h]);let D=v.length,A=v.filter(e=>e.done).length,G=D-A,ge=e=>{let s=v.map(u=>u.id===e?{...u,done:!u.done}:u);r?r(s):V(s)},_e=e=>{X(e),m?.(e)},ve=ae(()=>new Map(p.map(e=>[e.name,e])),[p]),P=v.find(e=>e.id===I),H="summary",F=j??(D===0?"No subtasks yet":G?`${G} left`:"All done");if(t&&P)H=`task-${P.id}`,F=P.assignee?`${P.assignee} \xB7 ${P.done?"done":"to do"}`:P.done?"Done \xB7 nobody assigned":"Nobody assigned yet";else if(t&&g){let e=v.filter(u=>u.assignee===g),s=e.filter(u=>u.done).length;H=`person-${g}`,F=e.length?`${g} \xB7 ${s} of ${e.length} done`:`${g} \xB7 no subtasks`}let he=[n,D?`${A} of ${D} subtasks done`:"no subtasks",b.label,_?`due ${_}`:""].filter(Boolean).join(", "),me=e=>{e.key==="Escape"&&(T?(e.stopPropagation(),C(!1),S.current?.focus()):t&&(e.stopPropagation(),h(!1),U.current?.focus()))},xe=e=>{if(e==="mouse"&&f==="hover"){if(t&&!M){B(!0);return}h(!t),B(!t);return}h(!t),B(!t)},K=y("keyboard"),be=(e,s)=>{if(!e)return null;let u=ve.get(e);return a(re,{name:e,src:u?.avatar,size:s})};return o("div",{ref:L,className:["ui-pcard",se].filter(Boolean).join(" "),"data-open":t?"":void 0,"data-touch":ce?"":void 0,"data-filtered":t&&g?"":void 0,onKeyDown:me,onPointerEnter:e=>{e.pointerType==="mouse"&&f==="hover"&&!t&&h(!0)},onPointerLeave:e=>{e.pointerType==="mouse"&&($(null),E(null),f==="hover"&&!M&&!L.current?.contains(document.activeElement)&&h(!1))},onBlur:e=>{f!=="hover"||M||e.currentTarget.contains(e.relatedTarget)||e.currentTarget.matches(":hover")||h(!1)},children:[a("style",{href:"ui-project-card",precedence:"default",children:Ee}),o("div",{className:"ui-pcard__frame",children:[o("div",{className:"ui-pcard__panel",children:[o("div",{className:"ui-pcard__head",children:[a("button",{ref:U,type:"button",className:"ui-pcard__toggle","aria-expanded":t,"aria-controls":`${x}-body`,"aria-label":he,onPointerDown:e=>{K.current=e.pointerType},onClick:()=>{xe(K.current),K.current="keyboard"}}),a($e,{tasks:v,hoverTask:I,person:t?g:null,done:A}),o("div",{className:"ui-pcard__main",children:[a("div",{className:"ui-pcard__title",title:n,children:n}),o("div",{className:"ui-pcard__meta",children:[o("button",{ref:S,type:"button",className:"ui-pcard__status","data-tone":b.tone??"gray","aria-expanded":T,"aria-controls":`${x}-status`,"aria-label":`Status: ${b.label}. Change status`,tabIndex:t?0:-1,"data-live":t?"":void 0,onClick:()=>t&&C(e=>!e),children:[a("span",{className:"ui-pcard__status-icon","aria-hidden":"true",children:b.icon??a(te,{tone:b.tone??"gray"})}),a("span",{className:"ui-pcard__status-label",children:b.label})]}),_?o("span",{className:"ui-pcard__due",children:[a("span",{className:"ui-pcard__due-word",children:"Due "}),_]}):null]})]}),p.length?a("div",{className:"ui-pcard__people",role:"group","aria-label":"People \u2013 show only their subtasks",children:p.map(e=>a("button",{type:"button",className:"ui-pcard__person","aria-pressed":z===e.name,"aria-label":e.name,title:e.name,tabIndex:t?0:-1,"data-live":t?"":void 0,"data-dim":t&&g&&g!==e.name?"":void 0,onPointerEnter:s=>s.pointerType==="mouse"&&E(e.name),onPointerLeave:s=>s.pointerType==="mouse"&&E(null),onFocus:()=>E(e.name),onBlur:()=>E(null),onClick:()=>Z(s=>s===e.name?null:e.name),children:a(re,{name:e.name,src:e.avatar,size:"m"})},e.name))}):null]}),a("div",{className:"ui-pcard__fold","data-open":t?"":void 0,children:o("div",{className:"ui-pcard__fold-inner",id:`${x}-body`,inert:t?void 0:!0,children:[a("div",{className:"ui-pcard__fold","data-open":T?"":void 0,children:a("div",{className:"ui-pcard__fold-inner",inert:T?void 0:!0,children:a("div",{ref:Y,className:"ui-pcard__options",id:`${x}-status`,role:"radiogroup","aria-label":"Status",children:R.map(e=>o("label",{className:"ui-pcard__option","data-tone":e.tone??"gray",children:[a("input",{type:"radio",name:`${x}-status`,value:e.id,checked:e.id===b.id,onChange:()=>_e(e.id),onKeyDown:s=>{s.key==="Enter"&&(s.preventDefault(),C(!1),S.current?.focus())},onClick:s=>{s.detail>0&&(C(!1),S.current?.focus())}}),a("span",{className:"ui-pcard__status-icon","aria-hidden":"true",children:e.icon??a(te,{tone:e.tone??"gray"})}),a("span",{className:"ui-pcard__option-label",children:e.label}),a("svg",{className:"ui-pcard__option-tick",viewBox:"0 0 16 16","aria-hidden":"true",children:a("path",{d:"M3.5 8.4l2.9 2.9 6.1-6.6"})})]},e.id))})})}),a("div",{className:"ui-pcard__rule"}),v.length?a("ul",{className:"ui-pcard__tasks","aria-label":`Subtasks of ${n}`,children:v.map(e=>{let s=t&&g?e.assignee!==g:!1;return o("li",{className:"ui-pcard__task","data-done":e.done?"":void 0,"data-dim":s?"":void 0,"data-hover":I===e.id?"":void 0,onPointerEnter:u=>u.pointerType==="mouse"&&$(e.id),onPointerLeave:u=>u.pointerType==="mouse"&&$(null),children:[o("label",{className:"ui-pcard__task-label",children:[a("input",{type:"checkbox",className:"ui-pcard__check-input",checked:!!e.done,onChange:()=>ge(e.id),onFocus:()=>$(e.id),onBlur:()=>$(null),"aria-describedby":e.assignee?`${x}-${e.id}-who`:void 0}),a("span",{className:"ui-pcard__check","aria-hidden":"true",children:a("svg",{viewBox:"0 0 16 16",children:a("path",{d:"M4.4 8.3l2.4 2.4 4.8-5.2",pathLength:1})})}),a("span",{className:"ui-pcard__task-text",children:e.label})]}),e.assignee?o("span",{className:"ui-pcard__assignee",id:`${x}-${e.id}-who`,children:[o("span",{className:"ui-pcard__sr",children:["Assigned to ",e.assignee]}),a("span",{"aria-hidden":"true",children:be(e.assignee,"s")})]}):null]},e.id)})}):a("p",{className:"ui-pcard__empty",children:"No subtasks yet."})]})})]}),o("div",{className:"ui-pcard__tray",children:[a("span",{className:"ui-pcard__hint","aria-live":"polite","aria-atomic":"true",children:a("span",{className:"ui-pcard__hint-text",children:F},H)}),w?o("button",{type:"button",className:"ui-pcard__action",tabIndex:t?0:-1,onClick:w.onClick,children:[w.label,a("svg",{viewBox:"0 0 16 16","aria-hidden":"true",children:a("path",{d:"M3.5 8h8.6M8.6 4.4 12.2 8l-3.6 3.6"})})]}):null]})]})]})}function $e({tasks:n,hoverTask:i,person:r,done:c}){let p=n.length,w=p>1?Math.min(14,120/p):0,j=p?360/p:360;return o("span",{className:"ui-pcard__ring","aria-hidden":"true",children:[a("svg",{viewBox:"0 0 36 36",width:36,height:36,children:p===0?a("circle",{className:"ui-pcard__segment",cx:18,cy:18,r:14}):p===1?a("circle",{className:"ui-pcard__segment","data-done":n[0].done?"":void 0,"data-hover":i===n[0].id?"":void 0,"data-dim":r&&n[0].assignee!==r?"":void 0,cx:18,cy:18,r:14}):n.map((f,N)=>a("path",{className:"ui-pcard__segment","data-done":f.done?"":void 0,"data-hover":i===f.id?"":void 0,"data-dim":r&&f.assignee!==r?"":void 0,d:Ce(18,18,14,N*j+w/2,(N+1)*j-w/2)},f.id))}),a("span",{className:"ui-pcard__count",children:p>0&&c===p?a("svg",{viewBox:"0 0 16 16",className:"ui-pcard__count-check",children:a("path",{d:"M4.4 8.3l2.4 2.4 4.8-5.2"})}):c},c)]})}function re({name:n,src:i,size:r}){let[c,l]=d(!1);return a("span",{className:"ui-pcard__avatar","data-size":r,"data-hue":Pe(n),children:i&&!c?a("img",{src:i,alt:"",onError:()=>l(!0)}):Te(n)})}function te({tone:n}){let i={viewBox:"0 0 16 16",className:"ui-pcard__tone-icon"};switch(n){case"green":return o("svg",{...i,children:[a("circle",{cx:"8",cy:"8",r:"5.6"}),a("path",{d:"M5.6 8.2l1.7 1.7 3.2-3.5"})]});case"red":return o("svg",{...i,children:[a("circle",{cx:"8",cy:"8",r:"5.6"}),a("path",{d:"M6 6l4 4M10 6l-4 4"})]});case"amber":return o("svg",{...i,children:[a("circle",{cx:"8",cy:"8",r:"5.6"}),a("path",{d:"M8 4.6a3.4 3.4 0 0 1 0 6.8Z","data-fill":""})]});case"blue":return o("svg",{...i,children:[a("circle",{cx:"8",cy:"8",r:"5.6"}),a("path",{d:"M8 4.6a3.4 3.4 0 1 1-3.4 3.4H8Z","data-fill":""})]});case"violet":return o("svg",{...i,children:[a("circle",{cx:"8",cy:"8",r:"5.6"}),a("circle",{cx:"8",cy:"8",r:"1.8","data-fill":""})]});default:return a("svg",{...i,children:a("circle",{cx:"8",cy:"8",r:"5.6",strokeDasharray:"2.2 2.2"})})}}var Ee=`
.ui-pcard {
  --ui-pc-frame: #f2f6fa;
  --ui-pc-panel: #ffffff;
  --ui-pc-soft: rgba(26, 62, 112, 0.06);
  --ui-pc-hairline: #dae2ec;
  --ui-pc-firm: #cbd6e4;
  --ui-pc-ink: #00162b;
  --ui-pc-text: rgba(0, 22, 43, 0.66);
  --ui-pc-muted: rgba(0, 22, 43, 0.54);
  --ui-pc-berry: #851437;
  --ui-pc-berry-hover: #6d0f2d;
  --ui-pc-ring: #8fbdf2;
  --ui-pc-info-ink: #1a3e70;
  --ui-pc-info-fill: #eef5ff;
  --ui-pc-info-line: #c1daff;
  --ui-pc-success-ink: #1d6a34;
  --ui-pc-success-fill: #eafbee;
  --ui-pc-success-line: #c9f5cf;
  --ui-pc-waiting-ink: #775810;
  --ui-pc-waiting-fill: #fdf6dd;
  --ui-pc-waiting-line: #fae6a0;
  --ui-pc-danger-ink: #8a3a22;
  --ui-pc-danger-fill: #fdeee8;
  --ui-pc-danger-line: #f5d5c9;
  --ui-pc-brand-ink: #851437;
  --ui-pc-brand-fill: #fbeef2;
  --ui-pc-brand-line: #f1cdd8;
  --ui-pc-pebble: inset 0 -2px 6px -4px rgba(26, 62, 112, 0.4);
  --ui-pc-drop: 0 8px 16px -8px rgba(26, 62, 112, 0.2);
  --ui-pc-raised: 0 18px 30px -16px rgba(26, 62, 112, 0.38), 0 4px 10px -6px rgba(26, 62, 112, 0.18);
  --ui-pc-floating: 0 24px 48px -24px rgba(26, 62, 112, 0.3);
  --ui-pc-ease: cubic-bezier(0.16, 1, 0.3, 1);
  container-type: inline-size;
  width: 100%;
  max-width: 320px;
  font-family: "Avenir Next", Avenir, system-ui, sans-serif;
  color: var(--ui-pc-ink);
  -webkit-tap-highlight-color: transparent;
}
:where(.dark, [data-theme="dark"]) .ui-pcard {
  --ui-pc-frame: #0f2747;
  --ui-pc-panel: #16345c;
  --ui-pc-soft: rgba(255, 255, 255, 0.07);
  --ui-pc-hairline: rgba(255, 255, 255, 0.12);
  --ui-pc-firm: rgba(255, 255, 255, 0.18);
  --ui-pc-ink: rgba(255, 255, 255, 0.94);
  --ui-pc-text: rgba(255, 255, 255, 0.72);
  --ui-pc-muted: rgba(255, 255, 255, 0.56);
  --ui-pc-berry: #a8204d;
  --ui-pc-berry-hover: #bd2a5a;
  --ui-pc-ring: rgba(143, 189, 242, 0.6);
  --ui-pc-info-ink: #c1daff;
  --ui-pc-info-fill: rgba(143, 189, 242, 0.16);
  --ui-pc-info-line: rgba(143, 189, 242, 0.3);
  --ui-pc-success-ink: #7fe0a0;
  --ui-pc-success-fill: rgba(127, 224, 160, 0.14);
  --ui-pc-success-line: rgba(127, 224, 160, 0.28);
  --ui-pc-waiting-ink: #f3d27a;
  --ui-pc-waiting-fill: rgba(243, 210, 122, 0.14);
  --ui-pc-waiting-line: rgba(243, 210, 122, 0.28);
  --ui-pc-danger-ink: #f2a48c;
  --ui-pc-danger-fill: rgba(242, 164, 140, 0.14);
  --ui-pc-danger-line: rgba(242, 164, 140, 0.28);
  --ui-pc-brand-ink: #f3a3bd;
  --ui-pc-brand-fill: rgba(243, 163, 189, 0.14);
  --ui-pc-brand-line: rgba(243, 163, 189, 0.28);
  --ui-pc-pebble: inset 0 -2px 6px -4px rgba(3, 12, 28, 0.8);
  --ui-pc-drop: 0 8px 16px -8px rgba(3, 12, 28, 0.6);
  --ui-pc-raised: 0 18px 30px -16px rgba(3, 12, 28, 0.8), 0 4px 10px -6px rgba(3, 12, 28, 0.6);
  --ui-pc-floating: 0 24px 48px -24px rgba(3, 12, 28, 0.8);
}
.ui-pcard *, .ui-pcard *::before, .ui-pcard *::after { box-sizing: border-box; }

.ui-pcard__frame {
  padding: 6px;
  border-radius: 22px;
  background: var(--ui-pc-frame);
  border: 1px solid var(--ui-pc-hairline);
  box-shadow: var(--ui-pc-drop);
  transition: box-shadow 300ms var(--ui-pc-ease);
}
.ui-pcard[data-open] .ui-pcard__frame { box-shadow: var(--ui-pc-floating), var(--ui-pc-drop); }
.ui-pcard__panel {
  border-radius: 16px;
  background: var(--ui-pc-panel);
  border: 1px solid var(--ui-pc-hairline);
  box-shadow: var(--ui-pc-raised);
}

/* Head */
.ui-pcard__head {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  min-width: 0;
}
.ui-pcard__toggle {
  position: absolute;
  inset: 0;
  z-index: 0;
  width: 100%;
  padding: 0;
  border: 0;
  border-radius: 15px;
  background: transparent;
  cursor: pointer;
}
.ui-pcard__toggle:focus-visible { outline: none; box-shadow: 0 0 0 3px var(--ui-pc-ring); }
.ui-pcard__ring, .ui-pcard__main, .ui-pcard__people { position: relative; z-index: 1; pointer-events: none; }
.ui-pcard__main { flex: 1; min-width: 0; }
.ui-pcard__title {
  font-family: "Avenir Next Condensed", "Avenir Next", Avenir, system-ui, sans-serif;
  font-weight: 700;
  font-size: 16px;
  line-height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-pcard__meta { display: flex; align-items: center; gap: 7px; margin-top: 3px; min-width: 0; }
.ui-pcard__due { min-width: 0; font-size: 12.5px; color: var(--ui-pc-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* Status chip and options \u2013 a state family: fill + hairline + ink */
.ui-pcard [data-tone] {
  --tone-ink: var(--ui-pc-muted);
  --tone-fill: var(--ui-pc-soft);
  --tone-line: var(--ui-pc-hairline);
}
.ui-pcard [data-tone="amber"] { --tone-ink: var(--ui-pc-waiting-ink); --tone-fill: var(--ui-pc-waiting-fill); --tone-line: var(--ui-pc-waiting-line); }
.ui-pcard [data-tone="green"] { --tone-ink: var(--ui-pc-success-ink); --tone-fill: var(--ui-pc-success-fill); --tone-line: var(--ui-pc-success-line); }
.ui-pcard [data-tone="blue"] { --tone-ink: var(--ui-pc-info-ink); --tone-fill: var(--ui-pc-info-fill); --tone-line: var(--ui-pc-info-line); }
.ui-pcard [data-tone="red"] { --tone-ink: var(--ui-pc-danger-ink); --tone-fill: var(--ui-pc-danger-fill); --tone-line: var(--ui-pc-danger-line); }
.ui-pcard [data-tone="violet"] { --tone-ink: var(--ui-pc-brand-ink); --tone-fill: var(--ui-pc-brand-fill); --tone-line: var(--ui-pc-brand-line); }
.ui-pcard__status {
  flex: none;
  max-width: 100%;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  min-width: 0;
  height: 22px;
  padding: 0 6px 0 4px;
  border-radius: 7px;
  border: 1px solid var(--tone-line);
  background: var(--tone-fill);
  color: var(--tone-ink);
  font: inherit;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  cursor: default;
  transition: box-shadow 150ms var(--ui-pc-ease), filter 150ms var(--ui-pc-ease);
}
.ui-pcard__status[data-live] { pointer-events: auto; cursor: pointer; }
.ui-pcard__status[data-live]:hover { filter: saturate(1.2); box-shadow: 0 2px 6px -3px rgba(26, 62, 112, 0.35); }
.ui-pcard__status-label { overflow: hidden; text-overflow: ellipsis; }
.ui-pcard__status-icon { display: grid; place-items: center; flex: none; color: var(--tone-ink); }
.ui-pcard__tone-icon { width: 14px; height: 14px; fill: none; stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }
.ui-pcard__tone-icon [data-fill] { fill: currentColor; stroke: none; }

.ui-pcard__options { display: grid; gap: 2px; padding: 0 8px 8px; }
.ui-pcard__option {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 32px;
  padding: 0 10px 0 12px;
  border-radius: 9px;
  font-size: 13px;
  color: var(--ui-pc-ink);
  cursor: pointer;
  transition: background-color 150ms var(--ui-pc-ease);
}
.ui-pcard__option:hover { background: var(--ui-pc-soft); }
.ui-pcard__option input { position: absolute; opacity: 0; width: 1px; height: 1px; margin: 0; pointer-events: none; }
.ui-pcard__option:has(input:checked) { background: var(--ui-pc-info-fill); box-shadow: inset 2px 0 0 var(--ui-pc-berry); }
.ui-pcard__option:has(input:focus-visible) { box-shadow: 0 0 0 3px var(--ui-pc-ring); }
.ui-pcard__option-label { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ui-pcard__option-tick { width: 14px; height: 14px; fill: none; stroke: var(--ui-pc-berry); stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; opacity: 0; }
.ui-pcard__option:has(input:checked) .ui-pcard__option-tick { opacity: 1; }

/* People */
.ui-pcard__people { display: flex; align-items: center; flex: none; padding-left: 4px; }
.ui-pcard__person {
  position: relative;
  margin-left: -7px;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: none;
  cursor: default;
  transition: opacity 300ms var(--ui-pc-ease), transform 150ms var(--ui-pc-ease);
}
.ui-pcard__person[data-live] { pointer-events: auto; cursor: pointer; }
.ui-pcard__person[data-live]:hover { transform: translateY(-1px); z-index: 1; }
.ui-pcard__person[data-dim] { opacity: 0.4; }
.ui-pcard__person[aria-pressed="true"] .ui-pcard__avatar { box-shadow: 0 0 0 2px var(--ui-pc-panel), 0 0 0 3.5px var(--ui-pc-berry); }
.ui-pcard__person:focus-visible { outline: none; }
.ui-pcard__person:focus-visible .ui-pcard__avatar { box-shadow: 0 0 0 2px var(--ui-pc-panel), 0 0 0 5px var(--ui-pc-ring); }

.ui-pcard__avatar {
  display: grid;
  place-items: center;
  overflow: hidden;
  border-radius: 999px;
  border: 1px solid var(--ui-pc-hairline);
  box-shadow: 0 0 0 2px var(--ui-pc-panel);
  font-weight: 700;
  line-height: 1;
  --av-fill: var(--ui-pc-info-fill);
  --av-ink: var(--ui-pc-info-ink);
  background: var(--av-fill);
  color: var(--av-ink);
}
.ui-pcard__avatar[data-hue="1"] { --av-fill: var(--ui-pc-success-fill); --av-ink: var(--ui-pc-success-ink); }
.ui-pcard__avatar[data-hue="2"] { --av-fill: var(--ui-pc-brand-fill); --av-ink: var(--ui-pc-brand-ink); }
.ui-pcard__avatar[data-hue="3"] { --av-fill: var(--ui-pc-waiting-fill); --av-ink: var(--ui-pc-waiting-ink); }
.ui-pcard__avatar[data-size="m"] { width: 24px; height: 24px; font-size: 10.5px; }
.ui-pcard__avatar[data-size="s"] { width: 20px; height: 20px; font-size: 9px; box-shadow: none; }
.ui-pcard__avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }

/* Ring */
.ui-pcard__ring { position: relative; display: grid; place-items: center; flex: none; width: 36px; height: 36px; }
.ui-pcard__ring svg { position: absolute; inset: 0; overflow: visible; }
.ui-pcard__segment {
  fill: none;
  stroke: var(--ui-pc-firm);
  stroke-width: 2.6;
  stroke-linecap: round;
  transition: stroke 300ms var(--ui-pc-ease), stroke-width 150ms var(--ui-pc-ease), opacity 300ms var(--ui-pc-ease);
}
.ui-pcard__segment[data-done] { stroke: var(--ui-pc-berry); }
.ui-pcard__segment[data-hover] { stroke-width: 4.2; }
.ui-pcard__segment[data-dim] { opacity: 0.25; }
.ui-pcard__count {
  position: relative;
  font-size: 13px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: var(--ui-pc-ink);
  animation: ui-pcard-pop 300ms var(--ui-pc-ease);
}
.ui-pcard__count-check { display: block; width: 14px; height: 14px; fill: none; stroke: var(--ui-pc-berry); stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

/* Fold \u2013 grows downward in place */
.ui-pcard__fold {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  transition: grid-template-rows 300ms var(--ui-pc-ease), opacity 300ms var(--ui-pc-ease);
}
.ui-pcard__fold[data-open] { grid-template-rows: 1fr; opacity: 1; }
.ui-pcard__fold-inner { min-height: 0; overflow: hidden; }
.ui-pcard__rule { height: 1px; margin: 0 12px; background: var(--ui-pc-hairline); }

/* Subtasks */
.ui-pcard__tasks { list-style: none; margin: 0; padding: 6px 6px 8px; }
.ui-pcard__task {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-right: 6px;
  border-radius: 10px;
  transition: opacity 300ms var(--ui-pc-ease), background-color 150ms var(--ui-pc-ease);
}
.ui-pcard__task[data-hover] { background: var(--ui-pc-soft); }
.ui-pcard__task[data-dim] { opacity: 0.35; }
.ui-pcard__task-label {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 32px;
  padding: 0 6px;
  cursor: pointer;
}
.ui-pcard__check-input { position: absolute; opacity: 0; width: 1px; height: 1px; margin: 0; pointer-events: none; }
.ui-pcard__check {
  flex: none;
  display: grid;
  place-items: center;
  width: 17px;
  height: 17px;
  border-radius: 999px;
  border: 1.5px solid var(--ui-pc-firm);
  background: var(--ui-pc-panel);
  transition: background-color 300ms var(--ui-pc-ease), border-color 300ms var(--ui-pc-ease), box-shadow 150ms var(--ui-pc-ease);
}
.ui-pcard__check svg { width: 13px; height: 13px; fill: none; stroke: #ffffff; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.ui-pcard__check path { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 300ms var(--ui-pc-ease) 60ms; }
.ui-pcard__task[data-done] .ui-pcard__check { background: var(--ui-pc-berry); border-color: var(--ui-pc-berry); }
.ui-pcard__task[data-done] .ui-pcard__check path { stroke-dashoffset: 0; }
.ui-pcard__check-input:focus-visible + .ui-pcard__check { box-shadow: 0 0 0 3px var(--ui-pc-ring); }
.ui-pcard__task-text {
  min-width: 0;
  font-size: 13.5px;
  line-height: 18px;
  color: var(--ui-pc-ink);
  overflow-wrap: anywhere;
  transition: color 300ms var(--ui-pc-ease);
}
.ui-pcard__task[data-done] .ui-pcard__task-text { color: var(--ui-pc-muted); }
.ui-pcard__assignee { flex: none; display: grid; opacity: 0; transform: translateX(4px); transition: opacity 150ms var(--ui-pc-ease), transform 150ms var(--ui-pc-ease); }
.ui-pcard__task[data-hover] .ui-pcard__assignee,
.ui-pcard[data-touch] .ui-pcard__assignee,
.ui-pcard[data-filtered] .ui-pcard__task:not([data-dim]) .ui-pcard__assignee { opacity: 1; transform: none; }
.ui-pcard__empty { margin: 0; padding: 14px 14px 16px; font-size: 13px; color: var(--ui-pc-muted); }

/* Tray */
.ui-pcard__tray {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  min-height: 38px;
  padding: 4px 6px 0 10px;
}
.ui-pcard__hint { position: relative; flex: 1; min-width: 0; overflow: hidden; font-size: 12.5px; color: var(--ui-pc-muted); }
.ui-pcard__hint-text { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; animation: ui-pcard-rise 300ms var(--ui-pc-ease); }
.ui-pcard__action {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 28px;
  padding: 0 8px 0 10px;
  border: 0;
  border-radius: 9px;
  background: transparent;
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  color: var(--ui-pc-ink);
  cursor: pointer;
  transition: background-color 150ms var(--ui-pc-ease);
}
.ui-pcard__action svg { width: 14px; height: 14px; fill: none; stroke: currentColor; stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; transition: transform 150ms var(--ui-pc-ease); }
.ui-pcard__action:hover { background: var(--ui-pc-soft); }
.ui-pcard__action:hover svg { transform: translateX(2px); }
.ui-pcard__action:focus-visible { outline: none; box-shadow: 0 0 0 3px var(--ui-pc-ring); }

.ui-pcard__sr { position: absolute; width: 1px; height: 1px; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }

/* Touch: taller rows and options */
.ui-pcard[data-touch] .ui-pcard__task-label { min-height: 42px; }
.ui-pcard[data-touch] .ui-pcard__option { min-height: 42px; }
.ui-pcard[data-touch] .ui-pcard__action { height: 36px; }

/* Narrow */
@container (max-width: 289px) {
  .ui-pcard__due-word { display: none; }
  .ui-pcard__person { margin-left: -8px; }
  .ui-pcard__head { gap: 9px; padding: 11px 10px; }
}

@keyframes ui-pcard-pop { 0% { transform: scale(0.6); opacity: 0.2; } 60% { transform: scale(1.12); opacity: 1; } 100% { transform: scale(1); } }
@keyframes ui-pcard-rise { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: none; } }

@media (prefers-reduced-motion: reduce) {
  .ui-pcard__fold,
  .ui-pcard__frame,
  .ui-pcard__segment,
  .ui-pcard__check,
  .ui-pcard__check path,
  .ui-pcard__assignee,
  .ui-pcard__person,
  .ui-pcard__action svg { transition: none; }
  .ui-pcard__count, .ui-pcard__hint-text { animation: none; }
  .ui-pcard__person[data-live]:hover, .ui-pcard__action:hover svg { transform: none; }
  .ui-pcard__assignee { transform: none; }
}
`;var ze=[{id:"welcome",label:"Welcome screen",done:!0,assignee:"Mara Okafor"},{id:"workspace",label:"Workspace setup",done:!0,assignee:"Jonas Weber"},{id:"invite",label:"Invite teammates",done:!0,assignee:"Mara Okafor"},{id:"checklist",label:"First-run checklist",assignee:"Priya Nair"},{id:"emails",label:"Lifecycle emails",assignee:"Jonas Weber"}];function je(){let[n,i]=d(ze),[r,c]=d("progress"),[l,m]=d(0);return a("div",{style:{width:"100%",maxWidth:320,minHeight:300},children:a(oe,{title:"Onboarding flow",tasks:n,onTasksChange:i,status:r,onStatusChange:c,due:"Oct 24",members:[{name:"Mara Okafor"},{name:"Jonas Weber"},{name:"Priya Nair"}],action:{label:"Open",onClick:()=>m(_=>_+1)},hint:l?"Opening the project\u2026":void 0,defaultOpen:!0})})}export{je as default};
