import{t as ke}from"./react-BkAXpnfr.js";var we=ke();var{Children:Me,Component:Te,Fragment:je,StrictMode:De,cloneElement:Ve,createContext:G,createElement:Fe,createRef:He,forwardRef:Ie,isValidElement:Ae,lazy:Pe,memo:Be,startTransition:Oe,Suspense:Ke,use:Ue,useCallback:$,useContext:M,useDebugValue:We,useDeferredValue:qe,useEffect:Q,useId:Z,useImperativeHandle:Xe,useInsertionEffect:Ye,useLayoutEffect:I,useMemo:Je,useOptimistic:Ge,useReducer:Qe,useRef:N,useState:v,useSyncExternalStore:Ze,useTransition:et}=we;import{t as Ne}from"./jsx-runtime-CTsRTJUX.js";var Se=Ne(),{jsx:e,jsxs:o,Fragment:A}=Se;var P=G({errors:{},shake:0,next:()=>{}}),ee=G(null),le=t=>Object.fromEntries(Object.entries(t).filter(([,i])=>!!i));function ue({steps:t,initialValues:i,onComplete:s,initialStep:d=0,step:k,onStepChange:u,submitLabel:S="Finish",submittingLabel:m="Creating\u2026",success:c,className:g}){let a=Z(),[p,_]=v(i),[f,L]=v(Math.max(0,Math.min(d,t.length-1))),b=Math.max(0,Math.min(k??f,t.length-1)),[T,j]=v({}),[l,h]=v(0),[C,E]=v(1),[y,D]=v(!1),[ie,O]=v(null),[R,re]=v(!1),[_e,V]=v(""),[ne,K]=v(void 0),U=N(null),W=N(null),F=N(!1),q=N(!1),H=N(!0);Q(()=>(H.current=!0,()=>{H.current=!1}),[]);let w=t[b],be=le(w?.validate?.(p)??{}),ve=Object.keys(be).length>0,z=$(n=>{let r=Math.max(0,Math.min(n,t.length-1));k===void 0&&L(r),u?.(r),F.current=!0,j({}),O(null),V(`Step ${r+1} of ${t.length}: ${t[r].title}`)},[t,k,u]),xe=$(n=>{_(r=>({...r,...n})),j(r=>{let x=Object.keys(n);if(!x.some(J=>r[J]))return r;let pe={...r};for(let J of x)delete pe[J];return pe})},[]),X=$(n=>{let r=typeof n=="number"?n:t.findIndex(x=>x.id===n);r<0||r===b||(E(r>b?1:-1),z(r))},[t,b,z]),Y=$(async()=>{if(y||R)return;let n=le(w.validate?.(p)??{});if(Object.keys(n).length){j(n),h(r=>r+1),q.current=!0,V(Object.values(n).join(". "));return}if(b<t.length-1){E(1),z(b+1);return}O(null);try{let r=s?.(p);if(r&&typeof r.then=="function"&&(D(!0),await r),!H.current)return;D(!1),re(!0),F.current=!0,V("All done")}catch(r){if(!H.current)return;D(!1);let x=r instanceof Error&&r.message?r.message:"Something went wrong. Try again.";O(x),V(x)}},[w,p,b,t.length,s,z,y,R]),ae=$(()=>{_(i),re(!1),E(-1),z(0)},[i,z]);I(()=>{let n=W.current;if(!n||typeof ResizeObserver>"u")return;let r=new ResizeObserver(()=>K(n.offsetHeight));return r.observe(n),K(n.offsetHeight),()=>r.disconnect()},[]),I(()=>{let n=W.current?.offsetHeight;n!==void 0&&n!==ne&&K(n)}),Q(()=>{let n=U.current;if(!n)return;if(q.current){q.current=!1,n.querySelector('[aria-invalid="true"]')?.focus();return}if(!F.current)return;F.current=!1,(n.querySelector('input:not([disabled]):not([type="hidden"]), textarea, select, [role="radio"][tabindex="0"]')??n.querySelector("[data-step-heading]"))?.focus({preventScroll:!0})});let he={values:p,setValues:xe,errors:T,goTo:X,next:()=>void Y()},oe=b===t.length-1,ye=w.heading??w.title;return e(P.Provider,{value:{errors:T,shake:l,next:()=>void Y()},children:o("div",{className:["ui-step",g].filter(Boolean).join(" "),"data-done":R?"":void 0,children:[e("style",{href:"ui-stepper-form",precedence:"default",children:Ee}),o("nav",{"aria-label":"Progress",className:"ui-step__nav",children:[e("ol",{className:"ui-step__list",children:t.map((n,r)=>{let x=R||r<b?"done":r===b?"current":"todo";return e("li",{className:"ui-step__item","data-state":x,"aria-current":x==="current"?"step":void 0,children:x==="done"&&!R?o("button",{type:"button",className:"ui-step__jump",onClick:()=>X(r),children:[e(de,{}),e("span",{children:n.title}),e("span",{className:"ui-step__sr",children:" (done, go back)"})]}):o("span",{className:"ui-step__label",children:[x==="done"?e(de,{}):o("span",{className:"ui-step__num",children:[r+1,"."]}),e("span",{children:n.title}),x==="done"?e("span",{className:"ui-step__sr",children:" (done)"}):null]})},n.id)})}),e("p",{className:"ui-step__compact","aria-hidden":"true",children:R?"All done":`Step ${b+1} of ${t.length} \xB7 ${w.title}`})]}),e("div",{className:"ui-step__card",style:{height:ne},children:e("div",{ref:W,className:"ui-step__inner",children:R?e("div",{className:"ui-step__body",ref:U,"data-dir":"1",children:c?c(p,ae):e(se,{title:"All done",onAction:ae,actionLabel:"Start over"})},"done"):o("form",{noValidate:!0,className:"ui-step__form","aria-labelledby":`${a}-h`,onSubmit:n=>{n.preventDefault(),Y()},children:[o("div",{className:"ui-step__body",ref:U,"data-dir":C,children:[e("h2",{id:`${a}-h`,className:"ui-step__heading",tabIndex:-1,"data-step-heading":"",children:ye}),w.description?e("p",{className:"ui-step__desc",children:w.description}):null,e("div",{className:"ui-step__fields",children:w.render(he)})]},w.id),o("div",{className:"ui-step__foot",children:[b>0?o("button",{type:"button",className:"ui-step__btn ui-step__btn--ghost",disabled:y,onClick:()=>X(b-1),children:[e("svg",{viewBox:"0 0 12 12","aria-hidden":"true",children:e("path",{d:"M7.5 2.5L4 6l3.5 3.5"})}),"Back"]}):e("span",{}),o("div",{className:"ui-step__submit",children:[ie?e("span",{className:"ui-step__submit-error",role:"alert",children:ie}):null,o("button",{type:"submit",className:"ui-step__btn ui-step__btn--main","data-dim":ve?"":void 0,"aria-busy":y||void 0,children:[y?e("span",{className:"ui-step__spin","aria-hidden":"true"}):null,e("span",{className:"ui-step__btn-label",children:y?m:oe?S:"Continue"},y?"s":oe?"l":"c")]})]})]})]})})}),e("span",{className:"ui-step__sr","aria-live":"polite",children:_e})]})})}function de(){return e("svg",{className:"ui-step__check",viewBox:"0 0 12 12","aria-hidden":"true",children:e("path",{d:"M2.6 6.4l2.2 2.2 4.6-5",pathLength:1})})}function B({name:t,label:i,hint:s,optional:d,children:k}){let u=Z(),{errors:S,shake:m}=M(P),c=S[t],g={control:`${u}-c`,hint:`${u}-hint`,error:`${u}-err`},a=[c?g.error:null,s?g.hint:null].filter(Boolean).join(" ")||void 0;return e(ee.Provider,{value:{id:g.control,describedBy:a,invalid:!!c,name:t},children:o("div",{className:"ui-step__field","data-invalid":c?"":void 0,children:[o("label",{className:"ui-step__field-label",htmlFor:g.control,children:[i,d?e("span",{className:"ui-step__optional",children:"Optional"}):null]}),e("div",{className:"ui-step__control","data-shake":c?"":void 0,children:k},c?`e${m}`:"ok"),c?e("p",{id:g.error,className:"ui-step__error",children:c}):null,s?e("p",{id:g.hint,className:"ui-step__hint",children:s}):null]})})}function te({prefix:t,className:i,...s}){let d=M(ee);return o("span",{className:["ui-step__input-wrap",i].filter(Boolean).join(" "),children:[t?e("span",{className:"ui-step__prefix","aria-hidden":"true",children:t}):null,e("input",{id:d?.id,name:d?.name,"aria-invalid":d?.invalid||void 0,"aria-describedby":d?.describedBy,className:"ui-step__input",...s})]})}var Ce=/^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]{2,}$/;function ce({value:t,onChange:i,validate:s=u=>Ce.test(u)?void 0:`\u201C${u}\u201D isn't an email address`,max:d,placeholder:k="name@company.com"}){let u=M(ee),{next:S}=M(P),[m,c]=v(""),[g,a]=v(null),[p,_]=v(!1),f=N(null),L=l=>{let h=[...t],C=[];for(let E of l.map(y=>y.trim()).filter(Boolean)){if(h.some(D=>D.toLowerCase()===E.toLowerCase()))continue;if(d!==void 0&&h.length>=d){C.push(`Up to ${d} entries`);break}let y=s(E);y?C.push(y):h.push(E)}return h.length!==t.length&&i(h),a(C[0]??null),C.length===0},b=l=>{l.key!=="Backspace"&&_(!1),l.key==="Enter"?(l.preventDefault(),m.trim()?L([m])&&c(""):S()):l.key===","||l.key===";"?(l.preventDefault(),m.trim()&&L([m])&&c("")):l.key==="Backspace"&&!m&&t.length&&(l.preventDefault(),p?(i(t.slice(0,-1)),_(!1)):_(!0))},T=u?`${u.id}-note`:void 0,j=[u?.describedBy,g?T:null].filter(Boolean).join(" ")||void 0;return o(A,{children:[o("div",{className:"ui-step__tags","data-invalid":u?.invalid?"":void 0,onPointerDown:l=>{l.target.closest("button, input")||(l.preventDefault(),f.current?.focus())},children:[t.map((l,h)=>o("span",{className:"ui-step__tag","data-armed":p&&h===t.length-1?"":void 0,children:[e("span",{className:"ui-step__tag-text",children:l}),e("button",{type:"button",className:"ui-step__tag-x","aria-label":`Remove ${l}`,onClick:()=>{i(t.filter(C=>C!==l)),f.current?.focus()},children:e("svg",{viewBox:"0 0 12 12","aria-hidden":"true",children:e("path",{d:"M3 3l6 6M9 3l-6 6"})})})]},l)),e("input",{ref:f,id:u?.id,name:u?.name,className:"ui-step__tags-input",type:"text",inputMode:"email",autoComplete:"off",spellCheck:!1,"aria-invalid":u?.invalid||!!g||void 0,"aria-describedby":j,placeholder:t.length?"":k,value:m,onChange:l=>{c(l.target.value),a(null)},onKeyDown:b,onBlur:()=>{_(!1),m.trim()&&L([m])&&c("")},onPaste:l=>{let h=l.clipboardData.getData("text");/[\s,;]/.test(h.trim())&&(l.preventDefault(),L(h.split(/[\s,;]+/)))}})]}),g?e("p",{id:T,className:"ui-step__error",role:"status",children:g}):null]})}function fe({value:t,onChange:i,options:s,label:d}){let{next:k}=M(P),u=N(null),S=N(null),m=Math.max(0,s.findIndex(a=>a.value===t)),c=$(()=>{let a=u.current,p=S.current,_=a?.querySelectorAll("[role=radio]")[m];!a||!p||!_||(p.style.transform=`translate(${_.offsetLeft}px, ${_.offsetTop}px)`,p.style.width=`${_.offsetWidth}px`,p.style.height=`${_.offsetHeight}px`,p.style.opacity=s.some(f=>f.value===t)?"1":"0")},[m,s,t]);I(()=>{c();let a=u.current;if(!a||typeof ResizeObserver>"u")return;let p=new ResizeObserver(c);return p.observe(a),()=>p.disconnect()},[c]);let g=a=>{let p=(a+s.length)%s.length;i(s[p].value),u.current?.querySelectorAll("[role=radio]")[p]?.focus()};return o("div",{ref:u,className:"ui-step__choices",role:"radiogroup","aria-label":d,children:[e("span",{ref:S,className:"ui-step__ring","aria-hidden":"true"}),s.map((a,p)=>{let _=a.value===t;return o("div",{role:"radio","aria-checked":_,tabIndex:p===m?0:-1,className:"ui-step__choice",onClick:()=>i(a.value),onKeyDown:f=>{f.key==="ArrowRight"||f.key==="ArrowDown"?(f.preventDefault(),g(p+1)):f.key==="ArrowLeft"||f.key==="ArrowUp"?(f.preventDefault(),g(p-1)):f.key===" "?(f.preventDefault(),i(a.value)):f.key==="Enter"&&(f.preventDefault(),i(a.value),k())},children:[o("span",{className:"ui-step__choice-head",children:[e("span",{className:"ui-step__choice-title",children:a.title}),a.badge?e("span",{className:"ui-step__badge",children:a.badge}):null,e("span",{className:"ui-step__radio","aria-hidden":"true"})]}),a.aside?e("span",{className:"ui-step__choice-aside",children:a.aside}):null,a.description?e("span",{className:"ui-step__choice-desc",children:a.description}):null]},a.value)})]})}function me({rows:t,onEdit:i}){return e("dl",{className:"ui-step__review",children:t.map(s=>o("div",{className:"ui-step__review-row",children:[e("dt",{children:s.label}),o("dd",{children:[e("span",{className:"ui-step__review-value",children:s.value}),s.detail?e("span",{className:"ui-step__review-detail",children:s.detail}):null]}),s.step&&i?o("button",{type:"button",className:"ui-step__edit",onClick:()=>i(s.step),children:["Edit",o("span",{className:"ui-step__sr",children:[" ",s.label]})]}):null]},s.label))})}function se({title:t,description:i,actionLabel:s,onAction:d}){return o("div",{className:"ui-step__success",children:[e("span",{className:"ui-step__success-check","aria-hidden":"true",children:e("svg",{viewBox:"0 0 16 16",children:e("path",{d:"M3.5 8.5l3 3 6-7"})})}),e("h2",{className:"ui-step__heading",tabIndex:-1,"data-step-heading":"",children:t}),i?e("p",{className:"ui-step__desc",children:i}):null,s&&d?e("button",{type:"button",className:"ui-step__btn ui-step__btn--secondary",onClick:d,children:s}):null]})}var Ee=`
.ui-step {
  --step-frame: #f2f6fa;
  --step-panel: #ffffff;
  --step-pale: #fbfcfe;
  --step-soft: rgba(26, 62, 112, 0.06);
  --step-line: #dae2ec;
  --step-firm: #cbd6e4;
  --step-ink: #00162b;
  --step-text: rgba(0, 22, 43, 0.66);
  --step-muted: rgba(0, 22, 43, 0.54);
  --step-berry: #851437;
  --step-berry-hover: #6d0f2d;
  --step-info-ink: #1a3e70;
  --step-info-fill: #eef5ff;
  --step-info-line: #c1daff;
  --step-ring: #8fbdf2;
  --step-success-ink: #1d6a34;
  --step-success-fill: #eafbee;
  --step-success-line: #c9f5cf;
  --step-danger-ink: #8a3a22;
  --step-danger-fill: #fdeee8;
  --step-danger-line: #f5d5c9;
  --step-field-shade: inset 0 1px 2px rgba(26, 62, 112, 0.07);
  --step-pebble: inset 0 -2px 6px -4px rgba(26, 62, 112, 0.4);
  --step-drop: 0 8px 16px -8px rgba(26, 62, 112, 0.2);
  --step-raised: 0 18px 30px -16px rgba(26, 62, 112, 0.38), 0 4px 10px -6px rgba(26, 62, 112, 0.18);
  --step-main-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 6px 12px -6px rgba(133, 20, 55, 0.6);
  --step-ease: cubic-bezier(0.16, 1, 0.3, 1);
  width: 100%;
  max-width: 520px;
  padding: 6px;
  background: var(--step-frame);
  border: 1px solid var(--step-line);
  border-radius: 22px;
  box-shadow: var(--step-raised);
  container-type: inline-size;
  font-family: "Avenir Next", Avenir, system-ui, sans-serif;
  font-size: 14px;
  line-height: 1.4;
  color: var(--step-ink);
  -webkit-font-smoothing: antialiased;
}
:where(.dark, [data-theme="dark"]) .ui-step {
  --step-frame: #0f2747;
  --step-panel: #16345c;
  --step-pale: #1a3b66;
  --step-soft: rgba(255, 255, 255, 0.07);
  --step-line: rgba(255, 255, 255, 0.12);
  --step-firm: rgba(255, 255, 255, 0.18);
  --step-ink: rgba(255, 255, 255, 0.94);
  --step-text: rgba(255, 255, 255, 0.72);
  --step-muted: rgba(255, 255, 255, 0.56);
  --step-berry: #a8204d;
  --step-berry-hover: #bd2a5a;
  --step-info-ink: #c1daff;
  --step-info-fill: rgba(143, 189, 242, 0.16);
  --step-info-line: rgba(143, 189, 242, 0.34);
  --step-ring: rgba(143, 189, 242, 0.6);
  --step-success-ink: #7fe0a0;
  --step-success-fill: rgba(127, 224, 160, 0.14);
  --step-success-line: rgba(127, 224, 160, 0.3);
  --step-danger-ink: #f2a48c;
  --step-danger-fill: rgba(242, 164, 140, 0.14);
  --step-danger-line: rgba(242, 164, 140, 0.3);
  --step-field-shade: inset 0 1px 2px rgba(3, 12, 28, 0.35);
  --step-pebble: inset 0 -2px 6px -4px rgba(3, 12, 28, 0.8);
  --step-drop: 0 8px 16px -8px rgba(3, 12, 28, 0.6);
  --step-raised: 0 18px 30px -16px rgba(3, 12, 28, 0.8), 0 4px 10px -6px rgba(3, 12, 28, 0.6);
  --step-main-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.14), 0 6px 12px -6px rgba(3, 12, 28, 0.7);
}
.ui-step *, .ui-step *::before, .ui-step *::after { box-sizing: border-box; }
:where(.ui-step) button { font: inherit; }
.ui-step :focus-visible { outline: 2px solid var(--step-ring); outline-offset: 2px; }
.ui-step .ui-step__heading:focus-visible { outline: none; }
.ui-step .ui-step__card { box-sizing: content-box; }

.ui-step__nav { padding: 4px 8px 8px; }
.ui-step__list { display: grid; grid-auto-flow: column; grid-auto-columns: 1fr; margin: 0; padding: 0; list-style: none; }
.ui-step__item { display: flex; justify-content: center; min-width: 0; font-size: 13px; color: var(--step-muted); }
.ui-step__label, .ui-step__jump { display: inline-flex; align-items: center; gap: 5px; min-width: 0; padding: 4px 6px; white-space: nowrap; }
.ui-step__label > span:not(.ui-step__sr):last-of-type, .ui-step__jump > span:not(.ui-step__sr) { overflow: hidden; text-overflow: ellipsis; }
.ui-step__jump { border: 0; border-radius: 8px; background: transparent; color: var(--step-text); cursor: pointer; transition: background-color 150ms var(--step-ease), color 150ms var(--step-ease); }
.ui-step__jump:hover { background: var(--step-soft); color: var(--step-ink); }
.ui-step__item[data-state="current"] { color: var(--step-ink); font-weight: 600; }
.ui-step__item[data-state="done"] { color: var(--step-text); }
.ui-step__num { font-variant-numeric: tabular-nums; }
.ui-step__check { width: 12px; height: 12px; flex: none; fill: none; stroke: var(--step-berry); stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
:where(.dark, [data-theme="dark"]) .ui-step__check { stroke: var(--step-success-ink); }
.ui-step__check path { stroke-dasharray: 1; stroke-dashoffset: 0; animation: ui-step-draw 300ms var(--step-ease) both; }
.ui-step__compact { display: none; margin: 0; padding: 4px 6px; font-size: 13px; font-weight: 600; color: var(--step-ink); }

.ui-step__card {
  overflow: hidden;
  background: var(--step-panel);
  border: 1px solid var(--step-line);
  border-radius: 16px;
  box-shadow: var(--step-drop);
  transition: height 300ms var(--step-ease);
}
.ui-step__inner { padding: 22px 20px 16px; }
.ui-step__form { margin: 0; }
.ui-step__body { animation: ui-step-in 300ms var(--step-ease); }
.ui-step__body[data-dir="-1"] { animation-name: ui-step-in-back; }
.ui-step__heading {
  margin: 0;
  font-family: "Avenir Next Condensed", "Avenir Next", Avenir, system-ui, sans-serif;
  font-weight: 700;
  font-size: 20px;
  line-height: 1.2;
  color: var(--step-ink);
  outline: none;
}
.ui-step__desc { margin: 4px 0 0; color: var(--step-muted); }
.ui-step__fields { display: grid; gap: 16px; margin-top: 18px; }

.ui-step__field { display: grid; gap: 6px; min-width: 0; }
.ui-step__field-label { display: flex; align-items: baseline; gap: 8px; font-size: 13.5px; font-weight: 600; color: var(--step-ink); }
.ui-step__optional { font-size: 10.5px; font-weight: 600; letter-spacing: 0.09em; text-transform: uppercase; color: var(--step-muted); }
.ui-step__control[data-shake] { animation: ui-step-shake 360ms var(--step-ease); }
.ui-step__hint { margin: 0; font-size: 12.5px; color: var(--step-muted); }
.ui-step__error { margin: 0; font-size: 12.5px; color: var(--step-danger-ink); animation: ui-step-fold 300ms var(--step-ease); }

.ui-step__input-wrap, .ui-step__tags {
  display: flex;
  align-items: center;
  min-height: 42px;
  width: 100%;
  background: var(--step-panel);
  border: 1px solid var(--step-firm);
  border-radius: 10px;
  box-shadow: var(--step-field-shade);
  transition: border-color 150ms var(--step-ease), box-shadow 150ms var(--step-ease);
}
.ui-step__input-wrap:focus-within, .ui-step__tags:focus-within {
  border-color: var(--step-info-line);
  box-shadow: var(--step-field-shade), 0 0 0 3px color-mix(in srgb, var(--step-ring) 45%, transparent);
}
.ui-step__input-wrap:has([aria-invalid="true"]), .ui-step__tags[data-invalid] { border-color: var(--step-danger-ink); }
.ui-step__prefix { padding-left: 12px; color: var(--step-muted); white-space: nowrap; }
.ui-step__input, .ui-step__tags-input {
  flex: 1;
  min-width: 0;
  height: 40px;
  padding: 0 12px;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--step-ink);
  caret-color: var(--step-berry);
  font: inherit;
  font-size: 14.5px;
}
.ui-step__prefix + .ui-step__input { padding-left: 1px; }
.ui-step__input::placeholder, .ui-step__tags-input::placeholder { color: var(--step-muted); }
.ui-step__input:focus-visible, .ui-step__tags-input:focus-visible { outline: none; }

.ui-step__tags { flex-wrap: wrap; gap: 5px; padding: 5px; cursor: text; }
.ui-step__tags-input { height: 30px; padding: 0 6px; flex-basis: 140px; }
.ui-step__tag {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  max-width: 100%;
  height: 28px;
  padding: 0 3px 0 9px;
  background: var(--step-info-fill);
  border: 1px solid var(--step-info-line);
  border-radius: 8px;
  font-size: 13px;
  animation: ui-step-pop 220ms var(--step-ease);
}
.ui-step__tag[data-armed] { background: var(--step-danger-fill); border-color: var(--step-danger-line); color: var(--step-danger-ink); }
.ui-step__tag-text { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ui-step__tag-x { display: grid; place-items: center; width: 22px; height: 22px; padding: 0; border: 0; border-radius: 6px; background: transparent; color: var(--step-muted); cursor: pointer; }
.ui-step__tag-x:hover { background: var(--step-soft); color: var(--step-ink); }
.ui-step__tag-x svg { width: 10px; height: 10px; fill: none; stroke: currentColor; stroke-width: 1.6; stroke-linecap: round; }

.ui-step__choices { position: relative; display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 8px; }
.ui-step__ring {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
  border: 2px solid var(--step-berry);
  border-radius: 12px;
  pointer-events: none;
  transition: transform 300ms var(--step-ease), width 300ms var(--step-ease), height 300ms var(--step-ease), opacity 150ms;
}
.ui-step__choice {
  display: grid;
  align-content: start;
  gap: 2px;
  padding: 12px;
  background: var(--step-pale);
  border: 1px solid var(--step-line);
  border-radius: 12px;
  box-shadow: var(--step-drop);
  cursor: pointer;
  transition: background-color 150ms var(--step-ease), border-color 150ms var(--step-ease);
}
.ui-step__choice:hover { border-color: var(--step-firm); }
.ui-step__choice[aria-checked="true"] { background: var(--step-info-fill); border-color: var(--step-info-line); }
.ui-step__choice:focus-visible { outline-offset: 3px; }
.ui-step__choice-head { display: flex; align-items: center; gap: 6px; }
.ui-step__choice-title { font-weight: 700; }
.ui-step__badge { padding: 1px 6px; border-radius: 6px; font-size: 10.5px; font-weight: 600; letter-spacing: 0.04em; color: var(--step-info-ink); background: var(--step-panel); border: 1px solid var(--step-info-line); }
.ui-step__radio { width: 16px; height: 16px; margin-left: auto; flex: none; border-radius: 999px; border: 1.5px solid var(--step-firm); background: var(--step-panel); transition: border-color 150ms var(--step-ease), box-shadow 150ms var(--step-ease); }
.ui-step__choice[aria-checked="true"] .ui-step__radio { border-color: var(--step-berry); box-shadow: inset 0 0 0 3px var(--step-panel), inset 0 0 0 8px var(--step-berry); }
.ui-step__choice-aside { color: var(--step-text); font-variant-numeric: tabular-nums; }
.ui-step__choice-desc { margin-top: 4px; color: var(--step-muted); font-size: 12.5px; }

.ui-step__review { margin: 0; border: 1px solid var(--step-line); border-radius: 12px; overflow: hidden; }
.ui-step__review-row { display: grid; grid-template-columns: 110px 1fr auto; gap: 12px; align-items: start; padding: 12px 14px; }
.ui-step__review-row + .ui-step__review-row { border-top: 1px solid var(--step-line); }
.ui-step__review dt { color: var(--step-muted); font-size: 13px; padding-top: 1px; }
.ui-step__review dd { display: grid; min-width: 0; margin: 0; }
.ui-step__review-value { font-weight: 600; overflow: hidden; text-overflow: ellipsis; }
.ui-step__review-detail { color: var(--step-muted); font-size: 12.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ui-step__edit { padding: 2px 6px; border: 0; border-radius: 6px; background: transparent; color: var(--step-info-ink); font-weight: 600; font-size: 13px; cursor: pointer; }
.ui-step__edit:hover { background: var(--step-info-fill); }

.ui-step__foot { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 24px; }
.ui-step__submit { display: flex; align-items: center; gap: 12px; min-width: 0; }
.ui-step__submit-error { color: var(--step-danger-ink); font-size: 12.5px; text-align: right; }
.ui-step__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 40px;
  padding: 0 16px;
  border: 1px solid transparent;
  border-radius: 10px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 150ms var(--step-ease), opacity 150ms var(--step-ease), transform 150ms var(--step-ease);
}
.ui-step__btn svg { width: 12px; height: 12px; fill: none; stroke: currentColor; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; }
.ui-step__btn--ghost { padding: 0 10px; background: transparent; color: var(--step-text); }
.ui-step__btn--ghost:hover:not(:disabled) { background: var(--step-soft); color: var(--step-ink); }
.ui-step__btn--ghost:disabled { opacity: 0.5; cursor: default; }
.ui-step__btn--main { background: var(--step-berry); color: #ffffff; box-shadow: var(--step-main-shadow); }
.ui-step__btn--main:hover { background: var(--step-berry-hover); }
.ui-step__btn--main:active { transform: translateY(1px); }
.ui-step__btn--main[data-dim] { opacity: 0.62; }
.ui-step__btn--main[aria-busy] { cursor: progress; }
.ui-step__btn--secondary { background: var(--step-pale); border-color: var(--step-firm); color: var(--step-ink); box-shadow: var(--step-drop); }
.ui-step__btn--secondary:hover { border-color: var(--step-info-line); }
.ui-step__btn-label { animation: ui-step-label 300ms var(--step-ease); }
.ui-step__spin { width: 14px; height: 14px; border-radius: 999px; border: 2px solid rgba(255, 255, 255, 0.35); border-top-color: #ffffff; animation: ui-step-spin 800ms linear infinite; }

.ui-step__success { display: grid; justify-items: center; gap: 4px; padding: 18px 0 8px; text-align: center; }
.ui-step__success-check {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  margin-bottom: 10px;
  border-radius: 999px;
  background: var(--step-success-fill);
  border: 1px solid var(--step-success-line);
  color: var(--step-success-ink);
  box-shadow: var(--step-pebble), var(--step-drop);
  animation: ui-step-pop-big 420ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
.ui-step__success-check svg { width: 22px; height: 22px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.ui-step__success .ui-step__btn { margin-top: 14px; }

.ui-step__sr {
  position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; border: 0;
  overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap;
}

@container (max-width: 420px) {
  .ui-step__list { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
  .ui-step__compact { display: block; }
  .ui-step__inner { padding: 18px 14px 14px; }
  .ui-step__choices { grid-template-columns: 1fr; }
  .ui-step__review-row { grid-template-columns: 1fr auto; }
  .ui-step__review dt { grid-column: 1 / -1; }
  .ui-step__review dd { grid-column: 1; }
}
@media (pointer: coarse) {
  .ui-step__input, .ui-step__tags-input { font-size: 16px; }
  .ui-step__btn { min-height: 44px; }
  .ui-step__tag-x { width: 30px; height: 30px; }
}

@keyframes ui-step-in { from { opacity: 0; transform: translateX(24px); } }
@keyframes ui-step-in-back { from { opacity: 0; transform: translateX(-24px); } }
@keyframes ui-step-shake { 20%, 60% { transform: translateX(-5px); } 40%, 80% { transform: translateX(5px); } }
@keyframes ui-step-fold { from { opacity: 0; transform: translateY(-4px); } }
@keyframes ui-step-pop { from { opacity: 0; transform: scale(0.85); } }
@keyframes ui-step-pop-big { from { opacity: 0; transform: scale(0.4); } }
@keyframes ui-step-draw { from { stroke-dashoffset: 1; } }
@keyframes ui-step-label { from { opacity: 0; } }
@keyframes ui-step-spin { to { transform: rotate(360deg); } }

@media (prefers-reduced-motion: reduce) {
  .ui-step *, .ui-step *::before, .ui-step *::after {
    animation: none !important;
    transition-property: background-color, border-color, color, opacity !important;
  }
  .ui-step__spin { animation: ui-step-spin 1600ms linear infinite !important; }
  .ui-step__card { transition: none !important; }
}
`;var ge=[{value:"free",title:"Free",aside:"$0",description:"Up to 3 members and 5 projects"},{value:"pro",title:"Pro",badge:"Popular",aside:"$12 / seat",description:"Unlimited projects, guests and history"},{value:"business",title:"Business",aside:"$24 / seat",description:"SSO, audit log and priority support"}],Re=t=>t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,""),$e=[{id:"workspace",title:"Workspace",heading:"Name your workspace",description:"This is where your team's projects live.",render:({values:t,setValues:i})=>o(A,{children:[e(B,{name:"name",label:"Workspace name",children:e(te,{value:t.name,autoComplete:"organization",onChange:s=>i({name:s.target.value,slug:Re(s.target.value)})})}),e(B,{name:"slug",label:"Workspace URL",hint:"Lowercase letters, numbers and dashes",children:e(te,{prefix:"acme.app/",value:t.slug,onChange:s=>i({slug:s.target.value})})})]}),validate:t=>({name:t.name.trim()?void 0:"Give your workspace a name",slug:t.slug?/^[a-z0-9]+(-[a-z0-9]+)*$/.test(t.slug)?void 0:"Use lowercase letters, numbers and single dashes":"Pick an address for your workspace"})},{id:"team",title:"Team",heading:"Invite your teammates",description:"They'll get an email with a link to join.",render:({values:t,setValues:i})=>e(B,{name:"invites",label:"Email addresses",hint:"Press Enter or comma to add",optional:!0,children:e(ce,{value:t.invites,onChange:s=>i({invites:s}),max:20})})},{id:"plan",title:"Plan",heading:"Pick a plan",description:"Every plan starts with a 14-day trial.",render:({values:t,setValues:i})=>e(fe,{label:"Plan",value:t.plan,options:ge,onChange:s=>i({plan:s})})},{id:"review",title:"Review",heading:"Review and create",description:"Everything can be changed later in settings.",render:({values:t,goTo:i})=>{let s=ge.find(k=>k.value===t.plan),d=t.invites.length;return e(me,{onEdit:i,rows:[{label:"Workspace",value:t.name,detail:`acme.app/${t.slug}`,step:"workspace"},{label:"Teammates",value:d?`${d} ${d===1?"invite":"invites"}`:"Just you for now",detail:d?t.invites.join(", "):void 0,step:"team"},{label:"Plan",value:`${s?.title} \xB7 ${s?.aside}`,step:"plan"}]})}}];function Le(){return e("div",{style:{width:"100%",maxWidth:520,minHeight:470,display:"grid",alignContent:"start"},children:e(ue,{steps:$e,initialValues:{name:"Northwind Studio",slug:"northwind-studio",invites:["maya@northwind.studio","leo@northwind.studio"],plan:"pro"},submitLabel:"Create workspace",onComplete:()=>new Promise(t=>setTimeout(t,1400)),success:(t,i)=>{let s=t.invites.length;return e(se,{title:`${t.name} is ready`,description:`${s?`${s} ${s===1?"invite is":"invites are"} on the way. `:""}Your trial runs for 14 days.`,actionLabel:"Start over",onAction:i})}})})}export{Le as default};
