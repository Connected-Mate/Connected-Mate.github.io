import{t as te}from"./react-BkAXpnfr.js";var ie=te();var{Children:ge,Component:be,Fragment:xe,StrictMode:_e,cloneElement:he,createContext:ve,createElement:ke,createRef:we,forwardRef:ye,isValidElement:$e,lazy:ze,memo:Ne,startTransition:Me,Suspense:Re,use:Ce,useCallback:V,useContext:je,useDebugValue:De,useDeferredValue:Ee,useEffect:C,useId:Y,useImperativeHandle:Ae,useInsertionEffect:Se,useLayoutEffect:Be,useMemo:Ie,useOptimistic:Te,useReducer:Ue,useRef:_,useState:j,useSyncExternalStore:Pe,useTransition:Fe}=ie;import{t as ne}from"./jsx-runtime-CTsRTJUX.js";var se=ne(),{jsx:a,jsxs:c,Fragment:Le}=se;var g=1024*1024;function w(r){return r<1024?`${r} B`:r<g?`${Math.max(1,Math.round(r/1024))} KB`:r<1024*g?`${(r/g).toFixed(1).replace(/\.0$/,"")} MB`:`${(r/(1024*g)).toFixed(1).replace(/\.0$/,"")} GB`}var O=r=>{let d=r.lastIndexOf(".");return d>0?r.slice(d+1).toLowerCase():""};function de(r){return r==="pdf"?"danger":["png","jpg","jpeg","gif","webp","svg","heic","avif"].includes(r)?"info":["xls","xlsx","csv","numbers","ods"].includes(r)?"success":["mp4","mov","webm","mp3","wav","m4a"].includes(r)?"waiting":["doc","docx","txt","md","pages","rtf"].includes(r)?"info":"neutral"}function pe(r,d){let m=`up to ${w(d)} each`;if(!r?.length)return`Any file \xB7 ${m}`;let s=r.map(f=>f.replace(/^\./,"").toUpperCase());return`${s.length>3?`${s.slice(0,3).join(", ")} and more`:s.join(", ")} \xB7 ${m}`}function le(r,d,m,s){return new Promise((h,f)=>{let z=s?.seconds??Math.min(6,1.6+r/(1.4*g)),v=performance.now(),p=()=>{let u=Math.min(1,(performance.now()-v)/(z*1e3));if(s?.failAt!==void 0&&u>=s.failAt){d(s.failAt),f(new Error("Connection lost"));return}if(d(u),u>=1)h();else{let b=window.setTimeout(()=>{m.delete(b),p()},120);m.add(b)}};p()})}function q({accept:r,maxSize:d=25*g,onUpload:m,onChange:s,hint:h,autoplay:f=!1,className:z}){let v=Y(),[p,u]=j([]),[b,N]=j(0),[G,D]=j(""),[,J]=j(0),T=_(null),E=_(new Set),y=_(new Set),M=_(new Map),R=_(0),K=_(0),U=_(s);U.current=s;let S=V((e,o)=>{let t=window.setTimeout(()=>{E.current.delete(t),e()},o);E.current.add(t)},[]);C(()=>{let e=E.current,o=y.current;return()=>{e.forEach(t=>window.clearTimeout(t)),e.clear(),o.clear()}},[]);let P=_(!0);C(()=>{if(P.current){P.current=!1;return}U.current?.(p.filter(e=>!e.leaving).map(({id:e,name:o,size:t,status:l,progress:i,error:x,file:k})=>({id:e,name:o,size:t,status:l,progress:i,error:x,file:k})))},[p]);let F=p.some(e=>e.status==="uploading");C(()=>{if(!F)return;let e=window.setInterval(()=>J(o=>o+1),500);return()=>window.clearInterval(e)},[F]);let B=(e,o)=>u(t=>t.map(l=>l.id===e?{...l,...o}:l)),X=e=>{y.current.add(e.id),B(e.id,{status:"uploading",progress:0,error:void 0,startedAt:performance.now()});let o=i=>{if(!y.current.has(e.id))return;let x=Math.max(0,Math.min(1,Number.isFinite(i)?i:0));u(k=>k.map(n=>n.id===e.id&&n.status==="uploading"?{...n,progress:Math.max(n.progress,x)}:n))},t=M.current.get(e.id),l;try{l=m&&e.file&&!t?m(e.file,o):le(e.size,o,E.current,t)}catch(i){l=Promise.reject(i)}l.then(()=>{y.current.has(e.id)&&(B(e.id,{status:"done",progress:1}),D(`${e.name} uploaded`))},i=>{if(!y.current.has(e.id))return;let x=i instanceof Error&&i.message?i.message:"Upload failed";u(k=>k.map(n=>n.id===e.id?{...n,status:"error",error:x,shake:(n.shake??0)+1}:n)),D(`${e.name} failed: ${x}`)})},I=e=>{let o=r?.map(i=>i.toLowerCase().replace(/^\./,"")),t=[],l=[];for(let i of e){let x=`${v}-f${K.current++}`,k=O(i.name),n;o&&!o.includes(k)?n=`Not allowed \u2013 ${o.map(ae=>ae.toUpperCase()).slice(0,4).join(", ")} only`:i.size>d&&(n=`Too large \u2013 max ${w(d)}`),i.sim&&M.current.set(x,i.sim),n&&l.push(`${i.name}: ${n}`),t.push({id:x,name:i.name,size:i.size,file:i.file,status:n?"rejected":"uploading",progress:0,error:n,startedAt:performance.now(),order:t.length})}u(i=>[...i,...t]);for(let i of t)i.status==="uploading"&&X(i);l.length&&D(l.join(". "))},Q=e=>{y.current.delete(e.id),M.current.delete(e.id),B(e.id,{leaving:!0}),D(`${e.name} removed`),S(()=>u(o=>o.filter(t=>t.id!==e.id)),200)};C(()=>{f&&(S(()=>N(4),500),S(()=>{N(0),I([{name:"Q3-Board-Report.pdf",size:4.2*g,sim:{seconds:7}},{name:"Hero-Shot.png",size:2.6*g,sim:{seconds:5.5}},{name:"Budget-2027.xlsx",size:1.8*g,sim:{seconds:4,failAt:.62}},{name:"Product-Demo.mp4",size:48*g}])},1700))},[f]);let W=e=>e.dataTransfer?.items?[...e.dataTransfer.items].filter(o=>o.kind==="file").length:0,$=p.filter(e=>!e.leaving),A=$.filter(e=>e.status==="uploading"),Z=$.filter(e=>e.status==="done").length,H=$.filter(e=>e.status==="error"||e.status==="rejected").length,ee=A.reduce((e,o)=>e+o.size*o.progress,0),re=A.reduce((e,o)=>e+o.size,0),L=A.length?`Uploading ${A.length} of ${$.length} \xB7 ${w(ee)} of ${w(re)}`:$.length?`${Z} of ${$.length} uploaded${H?` \xB7 ${H} failed`:""}`:"",oe=h??pe(r,d);return c("div",{className:["ui-drop",z].filter(Boolean).join(" "),"data-drag":b?"":void 0,onDragEnter:e=>{[...e.dataTransfer?.types??[]].includes("Files")&&(e.preventDefault(),R.current++,N(Math.max(1,W(e))))},onDragOver:e=>{[...e.dataTransfer?.types??[]].includes("Files")&&(e.preventDefault(),e.dataTransfer.dropEffect="copy")},onDragLeave:()=>{R.current=Math.max(0,R.current-1),R.current||N(0)},onDrop:e=>{e.preventDefault(),R.current=0,N(0);let o=[...e.dataTransfer?.files??[]];o.length&&I(o.map(t=>({name:t.name,size:t.size,file:t})))},children:[a("style",{href:"ui-dropzone",precedence:"default",children:ce}),c("div",{className:"ui-drop__panel",children:[c("button",{type:"button",className:"ui-drop__area","aria-describedby":`${v}-hint`,onClick:()=>T.current?.click(),children:[c("span",{className:"ui-drop__docs","aria-hidden":"true",children:[a("span",{className:"ui-drop__doc ui-drop__doc--l"}),a("span",{className:"ui-drop__doc ui-drop__doc--r"}),a("span",{className:"ui-drop__doc ui-drop__doc--c",children:a("svg",{viewBox:"0 0 16 16",children:a("path",{d:"M8 10.5V3M5 5.8L8 3l3 2.8M3 10v2.5h10V10"})})})]}),a("span",{className:"ui-drop__title",children:b?c("span",{children:["Drop ",b," ",b===1?"file":"files"]},"drag"):c("span",{children:["Drop files here or ",a("span",{className:"ui-drop__browse",children:"browse"})]},"idle")}),a("span",{id:`${v}-hint`,className:"ui-drop__hint",children:oe})]}),a("input",{ref:T,type:"file",multiple:!0,hidden:!0,tabIndex:-1,accept:r?.join(","),onChange:e=>{let o=[...e.target.files??[]];o.length&&I(o.map(t=>({name:t.name,size:t.size,file:t}))),e.target.value=""}}),p.length?a("ul",{className:"ui-drop__list","aria-label":"Uploads",children:p.map(e=>a(ue,{row:e,onRemove:()=>Q(e),onRetry:()=>{let o=M.current.get(e.id);o&&M.current.set(e.id,{seconds:o.seconds}),X(e)}},e.id))}):null]}),L?a("p",{className:"ui-drop__foot","aria-hidden":"true",children:L}):null,a("span",{className:"ui-drop__sr","aria-live":"polite",children:G})]})}function ue({row:r,onRemove:d,onRetry:m}){let s=O(r.name),h=r.size*r.progress,f;if(r.status==="uploading"){let v=(performance.now()-r.startedAt)/1e3,p=v>.3&&r.progress>0?h/v:0,u=p?(r.size-h)/p:1/0,b=p?r.progress>=.9||u<1.5?"almost done":`${Math.ceil(u)}s left`:"starting\u2026";f=`${w(h)} of ${w(r.size)} \xB7 ${b}`}else r.status==="done"?f=`${w(r.size)} \xB7 Uploaded`:f=r.error??"Upload failed";let z=r.status==="error"||r.status==="rejected";return c("li",{className:"ui-drop__row","data-status":r.status,"data-leaving":r.leaving?"":void 0,"data-shake":r.shake?r.shake%2:void 0,style:{"--i":r.order},children:[c("span",{className:"ui-drop__badge","data-tone":de(s),"aria-hidden":"true",children:[c("svg",{viewBox:"0 0 24 28",children:[a("path",{d:"M4 2.5h11l5.5 5.5v17.5H4z"}),a("path",{d:"M15 2.5V8h5.5"})]}),a("span",{className:"ui-drop__ext",children:(s||"file").slice(0,4)})]}),c("span",{className:"ui-drop__body",children:[a("span",{className:"ui-drop__name",title:r.name,children:r.name}),a("span",{className:"ui-drop__meta","data-bad":z?"":void 0,children:f}),r.status==="uploading"||r.status==="error"?a("span",{className:"ui-drop__bar",role:"progressbar","aria-label":`Upload of ${r.name}`,"aria-valuemin":0,"aria-valuemax":100,"aria-valuenow":Math.round(r.progress*100),children:a("span",{className:"ui-drop__fill",style:{transform:`scaleX(${r.progress})`}})}):null]}),c("span",{className:"ui-drop__actions",children:[r.status==="done"?a("span",{className:"ui-drop__ok","aria-hidden":"true",children:a("svg",{viewBox:"0 0 12 12",children:a("path",{d:"M2.8 6.3l2.1 2.1 4.3-4.8"})})}):null,r.status==="error"?a("button",{type:"button",className:"ui-drop__icon","aria-label":`Retry ${r.name}`,onClick:m,children:a("svg",{viewBox:"0 0 16 16","aria-hidden":"true",children:a("path",{d:"M13 8a5 5 0 11-1.5-3.6M13 2.8v2.6h-2.6"})})}):null,a("button",{type:"button",className:"ui-drop__icon","aria-label":`Remove ${r.name}`,onClick:d,children:a("svg",{viewBox:"0 0 16 16","aria-hidden":"true",children:a("path",{d:"M4.5 4.5l7 7M11.5 4.5l-7 7"})})})]})]})}var ce=`
.ui-drop {
  --drop-frame: #f2f6fa;
  --drop-panel: #ffffff;
  --drop-soft: rgba(26, 62, 112, 0.06);
  --drop-line: #dae2ec;
  --drop-firm: #cbd6e4;
  --drop-ink: #00162b;
  --drop-text: rgba(0, 22, 43, 0.66);
  --drop-muted: rgba(0, 22, 43, 0.54);
  --drop-berry: #851437;
  --drop-info-ink: #1a3e70;
  --drop-info-fill: #eef5ff;
  --drop-info-line: #c1daff;
  --drop-ring: #8fbdf2;
  --drop-success-ink: #1d6a34;
  --drop-success-fill: #eafbee;
  --drop-success-line: #c9f5cf;
  --drop-waiting-ink: #775810;
  --drop-waiting-fill: #fdf6dd;
  --drop-waiting-line: #fae6a0;
  --drop-danger-ink: #8a3a22;
  --drop-danger-fill: #fdeee8;
  --drop-danger-line: #f5d5c9;
  --drop-pebble: inset 0 -2px 6px -4px rgba(26, 62, 112, 0.4);
  --drop-drop: 0 8px 16px -8px rgba(26, 62, 112, 0.2);
  --drop-raised: 0 18px 30px -16px rgba(26, 62, 112, 0.38), 0 4px 10px -6px rgba(26, 62, 112, 0.18);
  --drop-ease: cubic-bezier(0.16, 1, 0.3, 1);
  width: 100%;
  max-width: 520px;
  padding: 6px;
  background: var(--drop-frame);
  border: 1px solid var(--drop-line);
  border-radius: 22px;
  box-shadow: var(--drop-raised);
  font-family: "Avenir Next", Avenir, system-ui, sans-serif;
  font-size: 14px;
  line-height: 1.35;
  color: var(--drop-ink);
  -webkit-font-smoothing: antialiased;
}
:where(.dark, [data-theme="dark"]) .ui-drop {
  --drop-frame: #0f2747;
  --drop-panel: #16345c;
  --drop-soft: rgba(255, 255, 255, 0.07);
  --drop-line: rgba(255, 255, 255, 0.12);
  --drop-firm: rgba(255, 255, 255, 0.18);
  --drop-ink: rgba(255, 255, 255, 0.94);
  --drop-text: rgba(255, 255, 255, 0.72);
  --drop-muted: rgba(255, 255, 255, 0.56);
  --drop-berry: #a8204d;
  --drop-info-ink: #c1daff;
  --drop-info-fill: rgba(143, 189, 242, 0.16);
  --drop-info-line: rgba(143, 189, 242, 0.34);
  --drop-ring: rgba(143, 189, 242, 0.6);
  --drop-success-ink: #7fe0a0;
  --drop-success-fill: rgba(127, 224, 160, 0.14);
  --drop-success-line: rgba(127, 224, 160, 0.3);
  --drop-waiting-ink: #f3d27a;
  --drop-waiting-fill: rgba(243, 210, 122, 0.14);
  --drop-waiting-line: rgba(243, 210, 122, 0.3);
  --drop-danger-ink: #f2a48c;
  --drop-danger-fill: rgba(242, 164, 140, 0.14);
  --drop-danger-line: rgba(242, 164, 140, 0.3);
  --drop-pebble: inset 0 -2px 6px -4px rgba(3, 12, 28, 0.8);
  --drop-drop: 0 8px 16px -8px rgba(3, 12, 28, 0.6);
  --drop-raised: 0 18px 30px -16px rgba(3, 12, 28, 0.8), 0 4px 10px -6px rgba(3, 12, 28, 0.6);
}
.ui-drop *, .ui-drop *::before, .ui-drop *::after { box-sizing: border-box; }
.ui-drop button { font: inherit; }

.ui-drop__panel {
  padding: 6px;
  background: var(--drop-panel);
  border: 1px solid var(--drop-line);
  border-radius: 16px;
  box-shadow: var(--drop-drop);
}
.ui-drop__area {
  display: grid;
  justify-items: center;
  gap: 4px;
  width: 100%;
  padding: 24px 16px 22px;
  background: var(--drop-soft);
  border: 1.5px dashed var(--drop-firm);
  border-radius: 12px;
  color: var(--drop-ink);
  text-align: center;
  cursor: pointer;
  transition: background-color 150ms var(--drop-ease), border-color 150ms var(--drop-ease);
}
.ui-drop__area:hover { border-color: var(--drop-info-line); }
.ui-drop__area:focus-visible { outline: none; border-style: solid; border-color: var(--drop-info-line); box-shadow: 0 0 0 3px color-mix(in srgb, var(--drop-ring) 45%, transparent); }
.ui-drop[data-drag] .ui-drop__area { border-style: solid; border-color: var(--drop-info-ink); background: var(--drop-info-fill); }

.ui-drop__docs { position: relative; width: 56px; height: 46px; margin-bottom: 8px; }
.ui-drop__doc {
  position: absolute;
  left: 50%;
  top: 2px;
  width: 34px;
  height: 40px;
  margin-left: -17px;
  background: var(--drop-panel);
  border: 1px solid var(--drop-line);
  border-radius: 8px;
  box-shadow: var(--drop-pebble), var(--drop-drop);
  transition: transform 300ms var(--drop-ease);
}
.ui-drop__doc--l { transform: translateX(-5px) rotate(-8deg); }
.ui-drop__doc--r { transform: translateX(5px) rotate(8deg); }
.ui-drop__doc--l::after, .ui-drop__doc--r::after {
  content: "";
  position: absolute;
  left: 6px;
  right: 6px;
  bottom: 7px;
  height: 5px;
  border-radius: 2px;
  background: var(--drop-danger-line);
}
.ui-drop__doc--r::after { background: var(--drop-info-line); }
.ui-drop__doc--c { display: grid; place-items: center; color: var(--drop-ink); }
.ui-drop__doc--c svg { width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; transition: transform 300ms var(--drop-ease); }
.ui-drop[data-drag] .ui-drop__doc--l { transform: translateX(-20px) translateY(4px) rotate(-16deg); }
.ui-drop[data-drag] .ui-drop__doc--r { transform: translateX(20px) translateY(4px) rotate(16deg); }
.ui-drop[data-drag] .ui-drop__doc--c { transform: translateY(-4px); }
.ui-drop[data-drag] .ui-drop__doc--c svg { transform: translateY(-2px); }

.ui-drop__title { font-weight: 600; font-size: 15px; }
.ui-drop__title > span { display: inline-block; animation: ui-drop-fade 300ms var(--drop-ease); }
.ui-drop__browse { color: var(--drop-info-ink); text-decoration: underline; text-decoration-color: var(--drop-info-line); text-underline-offset: 3px; }
.ui-drop__hint { color: var(--drop-muted); font-size: 12.5px; }

.ui-drop__list { list-style: none; margin: 4px 0 0; padding: 0; }
.ui-drop__row {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 11px 6px 11px 8px;
  border-top: 1px solid var(--drop-line);
  animation: ui-drop-grow 300ms var(--drop-ease) both;
  animation-delay: calc(var(--i, 0) * 90ms);
}
.ui-drop__row:first-child { border-top: 0; }
.ui-drop__row[data-leaving] { max-height: 90px; animation: ui-drop-fold 200ms var(--drop-ease) forwards; overflow: hidden; }
.ui-drop__row[data-shake="1"] { animation: ui-drop-shake 380ms var(--drop-ease); }
.ui-drop__row[data-shake="0"] { animation: ui-drop-shake2 380ms var(--drop-ease); }

.ui-drop__badge { position: relative; display: grid; width: 30px; height: 36px; flex: none; }
.ui-drop__badge svg { width: 30px; height: 36px; fill: var(--drop-panel); stroke: var(--drop-firm); stroke-width: 1; stroke-linejoin: round; }
.ui-drop__ext {
  position: absolute;
  left: -1px;
  bottom: 6px;
  padding: 1px 3px;
  border-radius: 4px;
  font-size: 7.5px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--drop-muted);
  background: var(--drop-soft);
  border: 1px solid var(--drop-line);
}
.ui-drop__badge[data-tone="danger"] .ui-drop__ext { color: var(--drop-danger-ink); background: var(--drop-danger-fill); border-color: var(--drop-danger-line); }
.ui-drop__badge[data-tone="info"] .ui-drop__ext { color: var(--drop-info-ink); background: var(--drop-info-fill); border-color: var(--drop-info-line); }
.ui-drop__badge[data-tone="success"] .ui-drop__ext { color: var(--drop-success-ink); background: var(--drop-success-fill); border-color: var(--drop-success-line); }
.ui-drop__badge[data-tone="waiting"] .ui-drop__ext { color: var(--drop-waiting-ink); background: var(--drop-waiting-fill); border-color: var(--drop-waiting-line); }

.ui-drop__body { display: grid; gap: 2px; min-width: 0; }
.ui-drop__name { font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ui-drop__meta { color: var(--drop-muted); font-size: 12.5px; font-variant-numeric: tabular-nums; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ui-drop__meta[data-bad] { color: var(--drop-danger-ink); }
.ui-drop__bar { position: relative; display: block; height: 4px; margin-top: 6px; overflow: hidden; border-radius: 999px; background: var(--drop-soft); box-shadow: inset 0 0 0 1px var(--drop-line); }
.ui-drop__fill { position: absolute; inset: 0; border-radius: inherit; background: var(--drop-berry); transform-origin: left center; transition: transform 300ms linear, background-color 300ms var(--drop-ease); }
.ui-drop__row[data-status="error"] .ui-drop__fill { background: var(--drop-danger-ink); }

.ui-drop__actions { display: flex; align-items: center; gap: 2px; }
.ui-drop__icon {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  padding: 0;
  border: 1px solid transparent;
  border-radius: 8px;
  background: transparent;
  color: var(--drop-muted);
  cursor: pointer;
  transition: background-color 150ms var(--drop-ease), color 150ms var(--drop-ease);
}
.ui-drop__icon:hover { background: var(--drop-soft); color: var(--drop-ink); border-color: var(--drop-line); }
.ui-drop__icon:focus-visible { outline: 2px solid var(--drop-ring); outline-offset: 1px; }
.ui-drop__icon svg { width: 14px; height: 14px; fill: none; stroke: currentColor; stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; }
.ui-drop__ok {
  display: grid;
  place-items: center;
  width: 20px;
  height: 20px;
  margin-right: 4px;
  border-radius: 999px;
  background: var(--drop-success-fill);
  border: 1px solid var(--drop-success-line);
  color: var(--drop-success-ink);
  animation: ui-drop-pop 320ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
.ui-drop__ok svg { width: 11px; height: 11px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }

.ui-drop__foot { margin: 0; padding: 10px 10px 4px; color: var(--drop-muted); font-size: 12.5px; font-variant-numeric: tabular-nums; }

.ui-drop__sr {
  position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; border: 0;
  overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap;
}

@media (pointer: coarse) {
  .ui-drop__icon { width: 40px; height: 40px; }
}

@keyframes ui-drop-grow { from { opacity: 0; transform: translateY(-6px); } }
@keyframes ui-drop-fold { to { opacity: 0; transform: scale(0.98); max-height: 0; padding-top: 0; padding-bottom: 0; } }
@keyframes ui-drop-fade { from { opacity: 0; transform: translateY(3px); } }
@keyframes ui-drop-pop { from { opacity: 0; transform: scale(0.3); } }
@keyframes ui-drop-shake { 20%, 60% { transform: translateX(-4px); } 40%, 80% { transform: translateX(4px); } }
@keyframes ui-drop-shake2 { 20%, 60% { transform: translateX(-4px); } 40%, 80% { transform: translateX(4px); } }

@media (prefers-reduced-motion: reduce) {
  .ui-drop *, .ui-drop *::before, .ui-drop *::after {
    animation: none !important;
    transition-property: background-color, border-color, color, opacity !important;
  }
  .ui-drop__fill { transition: none !important; }
}
`;function fe(){return a("div",{style:{width:"100%",maxWidth:520,minHeight:470},children:a(q,{accept:[".pdf",".png",".jpg",".xlsx",".mp4",".docx"],autoplay:!0})})}export{fe as default};
