import{t as nt}from"./react-BkAXpnfr.js";var at=nt();var{Children:At,Component:Ct,Fragment:Nt,StrictMode:$t,cloneElement:St,createContext:Tt,createElement:Rt,createRef:Et,forwardRef:Dt,isValidElement:zt,lazy:Lt,memo:Wt,startTransition:It,Suspense:Ft,use:Ht,useCallback:Ie,useContext:Bt,useDebugValue:Ot,useDeferredValue:Vt,useEffect:C,useId:Fe,useImperativeHandle:Gt,useInsertionEffect:jt,useLayoutEffect:he,useMemo:_e,useOptimistic:qt,useReducer:Pt,useRef:f,useState:N,useSyncExternalStore:Qt,useTransition:Zt}=at;import{t as it}from"./jsx-runtime-CTsRTJUX.js";var ot=it(),{jsx:t,jsxs:s,Fragment:ve}=ot;var st=560,Ve=16,Ge=24,je=18,xe="cubic-bezier(.16, 1, .3, 1)",He="http://www.w3.org/2000/svg",lt=r=>`$${r.toFixed(2)}`;function dt(r){let o=Math.max(0,Math.floor(r/1e3));if(o<60)return`${o}s`;let p=Math.floor(o/60);return p<60?`${p}m ${String(o%60).padStart(2,"0")}s`:`${Math.floor(p/60)}h ${String(p%60).padStart(2,"0")}m`}var ut=r=>r.split(/\s+/).filter(Boolean).slice(0,2).map(o=>o[0]?.toUpperCase()).join(""),Be={queued:"Queued",running:"Running",waiting:"Needs you",done:"Done",failed:"Failed",stopped:"Stopped"};function ct(){let[r,o]=N(!1);return C(()=>{let p=window.matchMedia?.("(prefers-reduced-motion: reduce)");if(!p)return;let h=()=>o(p.matches);return h(),p.addEventListener?.("change",h),()=>p.removeEventListener?.("change",h)},[]),r}function pt(r){let o=new Map,p=[],h=(_,z,n)=>{p.push(_);let u=_.cost??0,k=_.status==="running",$=0;for(let R of _.children??[]){let E=h(R,z+1,_.id);u+=E.cost,k||=E.climbing,$+=1+E.descendants}let T={cost:u,climbing:k,descendants:$,parent:n,depth:z};return o.set(_.id,T),T};return h(r,0),{map:o,all:p}}var ft=()=>s("svg",{width:"13",height:"13",viewBox:"0 0 16 16","aria-hidden":"true",focusable:"false",children:[t("path",{fill:"currentColor",d:"M8 1.2c.35 2.9 1.9 4.45 4.8 4.8-2.9.35-4.45 1.9-4.8 4.8-.35-2.9-1.9-4.45-4.8-4.8 2.9-.35 4.45-1.9 4.8-4.8Z"}),t("path",{fill:"currentColor",opacity:".55",d:"M12.6 10.2c.15 1.2.8 1.85 2 2-1.2.15-1.85.8-2 2-.15-1.2-.8-1.85-2-2 1.2-.15 1.85-.8 2-2Z"})]}),Oe=({status:r})=>{let o={width:11,height:11,viewBox:"0 0 16 16","aria-hidden":!0,focusable:!1};return r==="running"?s("svg",{...o,className:"ui-at-tree__spin",children:[t("circle",{cx:"8",cy:"8",r:"5.6",fill:"none",stroke:"currentColor",strokeOpacity:".25",strokeWidth:"2"}),t("path",{d:"M8 2.4a5.6 5.6 0 0 1 5.6 5.6",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"})]}):r==="done"?t("svg",{...o,children:t("path",{d:"M3.5 8.5l3 3 6-7",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})}):r==="failed"?t("svg",{...o,children:t("path",{fill:"currentColor",d:"M7.1 2.3a1 1 0 0 1 1.8 0l5.6 10.2a1 1 0 0 1-.9 1.5H2.4a1 1 0 0 1-.9-1.5L7.1 2.3Z"})}):r==="waiting"?s("svg",{...o,children:[t("circle",{cx:"8",cy:"8",r:"6",fill:"none",stroke:"currentColor",strokeWidth:"1.8"}),t("path",{d:"M8 4.8V8l2.2 1.4",fill:"none",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"})]}):t("svg",{...o,children:t("circle",{cx:"8",cy:"8",r:"5.5",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeDasharray:"2 2.4"})})},gt=()=>t("svg",{width:"12",height:"12",viewBox:"0 0 24 24","aria-hidden":"true",focusable:"false",className:"ui-at-tree__chev",children:t("path",{d:"M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})});function qe({root:r,collapsed:o,defaultCollapsed:p=[],onCollapsedChange:h,onResolve:_,onSelect:z,now:n,formatCost:u=lt,title:k="Agents",className:$}){let T=Fe(),R=ct(),{map:E,all:x}=_e(()=>pt(r),[r]),q=x.some(e=>e.status==="running"),[F,Z]=N(()=>Date.now());C(()=>{if(n!==void 0||!q)return;Z(Date.now());let e=window.setInterval(()=>Z(Date.now()),1e3);return()=>window.clearInterval(e)},[n,q]);let Ke=n??F,[de,Ye]=N(p),V=o??de,[ue,ye]=N(null),Me=f([]);C(()=>()=>Me.current.forEach(e=>window.clearTimeout(e)),[]);let ce=e=>{o===void 0&&Ye(e),h?.(e)},Ue=e=>{if(V.includes(e))return ce(V.filter(a=>a!==e));if(R||document.hidden)return ce([...V,e]);ye(e),Me.current.push(window.setTimeout(()=>{ye(null),ce([...o??Ae.current,e])},260))},Ae=f(de);Ae.current=o??de;let G=f(null),[K,Je]=N(0);he(()=>{let e=G.current;if(!e)return;let a=()=>Je(e.clientWidth-16);if(a(),typeof ResizeObserver>"u")return;let i=new ResizeObserver(a);return i.observe(e),()=>i.disconnect()},[]);let pe=e=>V.includes(e.id)?[]:e.children??[],fe=(e,a)=>Math.max(a,...pe(e).map(i=>fe(i,a+1))),P=pe(r),Xe=P.length?Math.max(...P.map(e=>fe(e,0))):0,Ce=P.length?(K-(P.length-1)*Ve)/P.length-Ge*Xe:K,Y=K>=st&&Ce>=168,et=Math.round(Y?Math.min(240,Ce):Math.max(180,Math.min(300,K-je*fe(r,0)))),w={agents:x.length,running:x.filter(e=>e.status==="running").length,waiting:x.filter(e=>e.status==="waiting").length,failed:x.filter(e=>e.status==="failed").length},Ne=E.get(r.id)?.cost??0,$e=[`${w.agents} ${w.agents===1?"agent":"agents"}`,w.running?`${w.running} running`:"",w.waiting?`${w.waiting} needs you`:"",w.failed?`${w.failed} failed`:""].filter(Boolean),[tt,rt]=N(""),Se=`${$e.join(", ")}`;C(()=>{let e=window.setTimeout(()=>rt(`${Se}, ${u(Ne)}`),600);return()=>window.clearTimeout(e)},[Se]);let U=f(null);U.current===null&&(U.current=new Set(x.map(e=>e.id)));let ge=new Map;x.forEach(e=>{U.current.has(e.id)||ge.set(e.id,ge.size)}),C(()=>{x.forEach(e=>U.current.add(e.id))});let Te=f(null),j=f(new Map),J=f(new Map),Q=f(new Map),Re=f(!0),Ee=f({wide:Y,rootId:r.id});Ee.current={wide:Y,rootId:r.id};let De=_e(()=>{let e=[],a=(i,y)=>{for(let v of pe(i)){let M=y||ue===i.id;e.push({key:`${i.id}>${v.id}`,parent:i.id,child:v.id,muted:v.status==="queued"||v.status==="stopped",leaving:M}),a(v,M)}};return a(r,!1),e},[r,V,ue]),ze=f(De);ze.current=De;let X=Ie(()=>{let e=Te.current,a=G.current;if(!e||!a)return;let i=a.getBoundingClientRect();e.setAttribute("width",String(a.clientWidth)),e.setAttribute("height",String(a.scrollHeight));let y=l=>{let c=j.current.get(l);if(!c)return null;let d=c.getBoundingClientRect();return{l:d.left-i.left,r:d.right-i.left,t:d.top-i.top,b:d.bottom-i.top,cx:d.left-i.left+d.width/2}},{wide:v,rootId:M}=Ee.current,A=new Set,H=new Set,L=!Re.current&&!document.hidden&&!R;for(let l of ze.current){let c=y(l.parent),d=y(l.child);if(!c||!d)continue;let W,b;if(v&&l.parent===M){let m=c.b,D=m+(d.t-m)/2,B=d.cx-c.cx,ie=Math.min(8,Math.abs(B)/2,(d.t-D)/2);b=[c.cx,m],W=Math.abs(B)<1?`M ${c.cx} ${m} V ${d.t}`:`M ${c.cx} ${m} V ${D-ie} Q ${c.cx} ${D} ${c.cx+Math.sign(B)*ie} ${D} H ${d.cx-Math.sign(B)*ie} Q ${d.cx} ${D} ${d.cx} ${D+ie} V ${d.t}`}else{let m=c.l+(v?18:14),D=d.t+22,B=Math.min(8,Math.max(0,d.l-m)/2);b=[m,c.b],W=`M ${m} ${c.b} V ${D-B} Q ${m} ${D} ${m+B} ${D} H ${d.l}`}A.add(l.key);let g=J.current.get(l.key);if(g)g.setAttribute("d",W);else if(g=document.createElementNS(He,"path"),g.setAttribute("class","ui-at-tree__link"),e.appendChild(g),J.current.set(l.key,g),g.setAttribute("d",W),L&&typeof g.animate=="function"){let m=g.getTotalLength();g.animate([{strokeDasharray:`${m}`,strokeDashoffset:m},{strokeDasharray:`${m}`,strokeDashoffset:0}],{duration:360,easing:xe})}if(g.toggleAttribute("data-muted",l.muted),l.leaving&&!g.hasAttribute("data-leaving")&&L){g.setAttribute("data-leaving","");let m=g.getTotalLength();g.animate([{strokeDasharray:`${m}`,strokeDashoffset:0},{strokeDasharray:`${m}`,strokeDashoffset:m}],{duration:240,easing:xe,fill:"forwards"})}H.add(l.parent);let I=Q.current.get(l.parent);I||(I=document.createElementNS(He,"circle"),I.setAttribute("class","ui-at-tree__dot"),I.setAttribute("r","3.5"),e.appendChild(I),Q.current.set(l.parent,I)),I.setAttribute("cx",String(b[0])),I.setAttribute("cy",String(b[1]))}J.current.forEach((l,c)=>{A.has(c)||(l.remove(),J.current.delete(c))}),Q.current.forEach((l,c)=>{H.has(c)||(l.remove(),Q.current.delete(c))}),Q.current.forEach(l=>e.appendChild(l)),Re.current=!1},[R]),me=f(null);if(typeof window<"u"&&j.current.size){let e=new Map;j.current.forEach((a,i)=>e.set(i,a.getBoundingClientRect())),me.current=e}let ee=f(0);he(()=>{let e=me.current;me.current=null;let a=!1;if(e&&!R&&!document.hidden&&j.current.forEach((i,y)=>{let v=e.get(y);if(!v||typeof i.animate!="function")return;i.getAnimations().forEach(l=>{l.id==="flip"&&l.cancel()});let M=i.getBoundingClientRect(),A=v.left-M.left,H=v.top-M.top;if(Math.abs(A)<1&&Math.abs(H)<1)return;let L=i.animate([{transform:`translate(${A}px, ${H}px)`},{transform:"translate(0, 0)"}],{duration:420,easing:xe});L.id="flip",a=!0}),X(),a){cancelAnimationFrame(ee.current);let i=performance.now()+460,y=()=>{X(),performance.now()<i&&(ee.current=requestAnimationFrame(y))};ee.current=requestAnimationFrame(y)}}),C(()=>()=>cancelAnimationFrame(ee.current),[]),C(()=>{let e=G.current;if(!e||typeof ResizeObserver>"u")return;let a=new ResizeObserver(()=>X());a.observe(e);let i=e.firstElementChild;return i&&a.observe(i),()=>a.disconnect()},[X]);let[S,te]=N(null),re=f(new Map),be=f(null),ne=S?x.find(e=>e.id===S):void 0;C(()=>{S&&(!ne||ne.status!=="waiting"&&ne.status!=="failed")&&te(null)}),C(()=>{if(!S)return;let e=document.activeElement;(!e||e===document.body||G.current?.contains(e))&&be.current?.querySelector("button")?.focus({preventScroll:!0});let a=i=>{let y=i.target;be.current?.contains(y)||re.current.get(S)?.contains(y)||te(null)};return document.addEventListener("pointerdown",a),()=>document.removeEventListener("pointerdown",a)},[S]);let Le=()=>{let e=S;te(null);let a=document.activeElement;e&&(!a||a===document.body||G.current?.contains(a))&&re.current.get(e)?.focus({preventScroll:!0})},ae=(e,a)=>{_?.(e,a),Le()},We=(e,a,i,y)=>{let v=E.get(e.id),M=e.children??[],A=V.includes(e.id),H=ue===e.id,L=A?[]:M,l=e.started!=null?dt((e.ended??(e.status==="running"||e.status==="waiting"?Ke:e.started))-e.started):null,c=e.status==="waiting"||e.status==="failed",d=ge.get(e.id),W={};return d!==void 0&&(W.animationDelay=`${d*90}ms`),i&&(W.animationDelay=`${y*50}ms`),s("li",{role:"treeitem","aria-label":`${e.name}, ${Be[e.status]}`,"aria-expanded":M.length?!A:void 0,"aria-selected":!1,className:"ui-at-tree__item",children:[s("div",{ref:b=>{b?j.current.set(e.id,b):j.current.delete(e.id)},className:"ui-at-tree__node","data-status":e.status,"data-rise":d!==void 0||void 0,"data-leaving":i||void 0,style:W,children:[s("div",{className:"ui-at-tree__card","data-selectable":z?"":void 0,children:[z?t("button",{type:"button",className:"ui-at-tree__select","aria-label":`Open ${e.name}`,onClick:()=>z(e)}):null,s("div",{className:"ui-at-tree__top",children:[t("span",{className:"ui-at-tree__avatar","aria-hidden":"true",children:e.avatar??t("span",{className:"ui-at-tree__initials",children:ut(e.name)})}),s("span",{className:"ui-at-tree__id",children:[t("span",{className:"ui-at-tree__name",children:e.name}),e.model?t("span",{className:"ui-at-tree__model",children:e.model}):null]}),c?s("button",{type:"button",ref:b=>{b?re.current.set(e.id,b):re.current.delete(e.id)},className:"ui-at-tree__pill ui-at-tree__pill--button","data-status":e.status,"aria-expanded":S===e.id,"aria-haspopup":"dialog","aria-controls":S===e.id?`${T}-ask`:void 0,onClick:()=>te(S===e.id?null:e.id),children:[t(Oe,{status:e.status}),e.status==="waiting"?"Needs you":"Failed"]}):s("span",{className:"ui-at-tree__pill","data-status":e.status,children:[t(Oe,{status:e.status}),Be[e.status]]})]}),s("p",{className:"ui-at-tree__task",children:[e.tools?.length?t("span",{className:"ui-at-tree__tools","aria-hidden":"true",children:e.tools.slice(0,3).map((b,g)=>t("span",{className:"ui-at-tree__tool",children:b},g))}):null,e.task]}),S===e.id&&ne?s("div",{ref:be,id:`${T}-ask`,role:"dialog","aria-label":e.status==="waiting"?`${e.name} needs you`:`${e.name} failed`,className:"ui-at-tree__ask",onKeyDown:b=>{b.key==="Escape"&&(b.preventDefault(),Le())},children:[t("p",{className:"ui-at-tree__ask-text",children:e.status==="waiting"?e.ask??"This agent waits for your decision.":e.error??"This agent stopped with an error."}),t("div",{className:"ui-at-tree__ask-actions",children:e.status==="waiting"?s(ve,{children:[t("button",{type:"button",className:"ui-at-tree__btn ui-at-tree__btn--main",onClick:()=>ae(e,"approve"),children:"Approve"}),t("button",{type:"button",className:"ui-at-tree__btn",onClick:()=>ae(e,"reject"),children:"Reject"})]}):s(ve,{children:[t("button",{type:"button",className:"ui-at-tree__btn ui-at-tree__btn--main",onClick:()=>ae(e,"retry"),children:"Retry"}),t("button",{type:"button",className:"ui-at-tree__btn",onClick:()=>ae(e,"dismiss"),children:"Dismiss"})]})})]}):null]}),s("div",{className:"ui-at-tree__foot",children:[s("span",{className:"ui-at-tree__meta",children:[t("span",{className:"ui-at-tree__cost","data-climbing":v.climbing||void 0,children:u(v.cost)}),l?s("span",{className:"ui-at-tree__time",children:[" \xB7 ",l]}):null]}),M.length?s("button",{type:"button",className:"ui-at-tree__fold","aria-label":`${A?"Show":"Hide"} ${M.length} sub-agent${M.length===1?"":"s"} of ${e.name}`,"aria-expanded":!A,"data-folded":A||void 0,onClick:()=>Ue(e.id),children:[A?`+${v.descendants}`:M.length,t(gt,{})]}):null]})]}),L.length?t("ul",{role:"group",className:"ui-at-tree__group","data-depth":a+1,children:L.map((b,g)=>We(b,a+1,i||H,L.length-g))}):null]},e.id)};return s("div",{className:["ui-at-tree",$].filter(Boolean).join(" "),children:[t("style",{href:"ui-agent-tree",precedence:"default",children:mt}),s("div",{className:"ui-at-tree__bar",children:[t("span",{className:"ui-at-tree__mark",children:t(ft,{})}),t("h3",{className:"ui-at-tree__title",children:k}),s("span",{className:"ui-at-tree__totals","aria-hidden":"true",children:[t("span",{children:$e[0]}),w.running?s("span",{"data-kind":"running",children:[w.running," running"]}):null,w.waiting?s("span",{"data-kind":"waiting",children:[w.waiting," needs you"]}):null,w.failed?s("span",{"data-kind":"failed",children:[w.failed," failed"]}):null,t("strong",{className:"ui-at-tree__total","data-climbing":E.get(r.id)?.climbing||void 0,children:u(Ne)})]})]}),s("div",{ref:G,className:"ui-at-tree__wrap","data-layout":Y?"wide":"narrow",style:{"--card-w":`${et}px`},children:[t("ul",{role:"tree","aria-label":k,className:"ui-at-tree__tree",children:We(r,0,!1,0)}),t("svg",{ref:Te,className:"ui-at-tree__links","aria-hidden":"true"})]}),t("p",{className:"ui-at-tree__sr",role:"status","aria-live":"polite",children:tt})]})}var mt=`
.ui-at-tree {
  --frame: #f2f6fa; --panel: #ffffff; --soft: rgba(26, 62, 112, 0.06);
  --line: #dae2ec; --line-firm: #cbd6e4;
  --ink: #00162b; --text: rgba(0, 22, 43, 0.66); --muted: rgba(0, 22, 43, 0.54);
  --berry: #851437; --berry-hover: #6d0f2d;
  --info-ink: #1a3e70; --info-fill: #eef5ff; --info-line: #c1daff; --ring: #8fbdf2;
  --ok-ink: #1d6a34; --ok-fill: #eafbee; --ok-line: #c9f5cf;
  --wait-ink: #775810; --wait-fill: #fdf6dd; --wait-line: #fae6a0;
  --bad-ink: #8a3a22; --bad-fill: #fdeee8; --bad-line: #f5d5c9;
  --ui-agt-link: #8ebbf5; --link-muted: #cbd6e4; --mark: #2f6fc4;
  --tile: #ffffff; --secondary: #fbfcfe; --shine: #6f9fe0;
  --pebble-shade: inset 0 -2px 6px -4px rgba(26, 62, 112, 0.4);
  --drop: 0 8px 16px -8px rgba(26, 62, 112, 0.2);
  --raised: 0 18px 30px -16px rgba(26, 62, 112, 0.38), 0 4px 10px -6px rgba(26, 62, 112, 0.18);
  --float: 0 24px 48px -24px rgba(26, 62, 112, 0.3);
  --ease: cubic-bezier(.16, 1, .3, 1);
  box-sizing: border-box;
  position: relative;
  width: 100%;
  max-width: 820px;
  padding: 6px 6px 18px;
  border-radius: 22px;
  background: var(--frame);
  border: 1px solid var(--line);
  box-shadow: var(--float);
  font-family: "Avenir Next", Avenir, system-ui, sans-serif;
  color: var(--text);
  font-size: 14px;
  line-height: 1.4;
  text-align: left;
}
:where(.dark, [data-theme="dark"]) .ui-at-tree {
  --frame: #0f2747; --panel: #16345c; --soft: rgba(255, 255, 255, 0.07);
  --line: rgba(255, 255, 255, 0.12); --line-firm: rgba(255, 255, 255, 0.18);
  --ink: rgba(255, 255, 255, 0.94); --text: rgba(255, 255, 255, 0.72); --muted: rgba(255, 255, 255, 0.56);
  --berry: #a8204d; --berry-hover: #bd2a5a;
  --info-ink: #c1daff; --info-fill: rgba(143, 189, 242, 0.16); --info-line: rgba(143, 189, 242, 0.34); --ring: rgba(143, 189, 242, 0.6);
  --ok-ink: #7fe0a0; --ok-fill: rgba(127, 224, 160, 0.14); --ok-line: rgba(127, 224, 160, 0.3);
  --wait-ink: #f3d27a; --wait-fill: rgba(243, 210, 122, 0.14); --wait-line: rgba(243, 210, 122, 0.3);
  --bad-ink: #f2a48c; --bad-fill: rgba(242, 164, 140, 0.14); --bad-line: rgba(242, 164, 140, 0.3);
  --ui-agt-link: #8ebbf5; --link-muted: rgba(255, 255, 255, 0.2); --mark: #8fbdf2;
  --tile: #ffffff; --secondary: rgba(255, 255, 255, 0.06); --shine: rgba(255, 255, 255, 0.55);
  --pebble-shade: inset 0 -2px 6px -4px rgba(3, 12, 28, 0.8);
  --drop: 0 8px 16px -8px rgba(3, 12, 28, 0.6);
  --raised: 0 18px 30px -16px rgba(3, 12, 28, 0.8), 0 4px 10px -6px rgba(3, 12, 28, 0.6);
  --float: 0 24px 48px -24px rgba(3, 12, 28, 0.7);
}
.ui-at-tree *, .ui-at-tree *::before, .ui-at-tree *::after { box-sizing: border-box; }
.ui-at-tree :where(button) { font: inherit; color: inherit; cursor: pointer; }
.ui-at-tree :focus-visible { outline: none; box-shadow: 0 0 0 3px var(--ring); }
.ui-at-tree__sr {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0;
}

.ui-at-tree__bar { display: flex; align-items: center; flex-wrap: wrap; gap: 6px 8px; padding: 10px 12px 14px 14px; }
.ui-at-tree__mark { display: inline-flex; color: var(--mark); }
.ui-at-tree__title {
  margin: 0; color: var(--ink); font-size: 16px; font-weight: 700; letter-spacing: 0;
  font-family: "Avenir Next Condensed", "Avenir Next", Avenir, system-ui, sans-serif;
}
.ui-at-tree__totals {
  margin-left: auto; display: flex; flex-wrap: wrap; align-items: center; gap: 4px 14px;
  font-size: 13px; color: var(--muted); font-variant-numeric: tabular-nums;
}
.ui-at-tree__totals [data-kind="running"] { color: var(--info-ink); }
.ui-at-tree__totals [data-kind="waiting"] { color: var(--wait-ink); }
.ui-at-tree__totals [data-kind="failed"] { color: var(--bad-ink); }
.ui-at-tree__total { color: var(--ink); font-weight: 600; }

.ui-at-tree__wrap { position: relative; padding: 0 8px; }
.ui-at-tree__links { position: absolute; left: 0; top: 0; pointer-events: none; overflow: visible; }
.ui-at-tree__link { fill: none; stroke: var(--ui-agt-link); stroke-width: 1.5; stroke-linecap: round; }
.ui-at-tree__link[data-muted] { stroke: var(--link-muted); stroke-dasharray: 3 4; }
.ui-at-tree__dot { fill: var(--panel); stroke: var(--ui-agt-link); stroke-width: 1.5; }

.ui-at-tree__tree, .ui-at-tree__group { list-style: none; margin: 0; padding: 0; }
.ui-at-tree__item { display: flex; flex-direction: column; align-items: flex-start; }
.ui-at-tree__group { display: flex; flex-direction: column; gap: 12px; margin-top: 14px; }
.ui-at-tree__wrap[data-layout="narrow"] .ui-at-tree__group { margin-left: ${je}px; }
.ui-at-tree__wrap[data-layout="wide"] .ui-at-tree__tree > .ui-at-tree__item { align-items: center; }
.ui-at-tree__wrap[data-layout="wide"] .ui-at-tree__group[data-depth="1"] {
  flex-direction: row; align-items: flex-start; justify-content: center; gap: ${Ve}px; margin-top: 44px; align-self: stretch;
}
.ui-at-tree__wrap[data-layout="wide"] .ui-at-tree__group:not([data-depth="1"]) { margin-left: ${Ge}px; }

.ui-at-tree__node {
  position: relative; z-index: 1; width: var(--card-w); padding: 0 0 0; border-radius: 18px;
  background: var(--frame); border: 1px solid var(--line); box-shadow: var(--drop);
}
.ui-at-tree__node[data-rise] { animation: ui-at-tree-rise 420ms var(--ease) both; }
@keyframes ui-at-tree-rise { from { opacity: 0; transform: translateY(10px); } }
.ui-at-tree__node[data-leaving] { animation: ui-at-tree-leave 220ms var(--ease) both; }
@keyframes ui-at-tree-leave { to { opacity: 0; transform: translateY(-6px); } }
.ui-at-tree__node[data-status="queued"], .ui-at-tree__node[data-status="stopped"] { opacity: .72; }

.ui-at-tree__card {
  position: relative; margin: -1px -1px 0; padding: 10px 10px 10px; border-radius: 14px;
  background: var(--panel); border: 1px solid var(--line); box-shadow: var(--raised);
}
.ui-at-tree__card[data-selectable] { cursor: pointer; transition: border-color 150ms var(--ease); }
.ui-at-tree__card[data-selectable]:hover { border-color: var(--line-firm); }
.ui-at-tree__select { position: absolute; inset: 0; z-index: 0; border: 0; border-radius: 14px; background: transparent; padding: 0; }
.ui-at-tree__top { position: relative; display: flex; align-items: flex-start; gap: 8px; pointer-events: none; }
.ui-at-tree__top > .ui-at-tree__pill--button { pointer-events: auto; }
.ui-at-tree__avatar {
  flex: none; width: 28px; height: 28px; display: grid; place-items: center; border-radius: 9px;
  background: var(--tile); border: 1px solid var(--line); box-shadow: var(--pebble-shade); overflow: hidden;
}
.ui-at-tree__avatar > svg, .ui-at-tree__avatar > img { width: 16px; height: 16px; }
.ui-at-tree__initials { font-size: 10.5px; font-weight: 700; color: #1a3e70; }
.ui-at-tree__id { min-width: 0; flex: 1; display: flex; flex-direction: column; }
.ui-at-tree__name { color: var(--ink); font-weight: 700; font-size: 14px; line-height: 1.25; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ui-at-tree__model { font-size: 12px; color: var(--muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ui-at-tree__pill {
  flex: none; display: inline-flex; align-items: center; gap: 4px; height: 22px; padding: 0 8px; border-radius: 999px;
  background: var(--soft); border: 1px solid var(--line); color: var(--muted); font-size: 11.5px; font-weight: 600; white-space: nowrap;
  transition: background-color 300ms var(--ease), color 300ms var(--ease), border-color 300ms var(--ease);
}
.ui-at-tree__pill[data-status="running"] { background: var(--info-fill); border-color: var(--info-line); color: var(--info-ink); }
.ui-at-tree__pill[data-status="done"] { background: var(--ok-fill); border-color: var(--ok-line); color: var(--ok-ink); }
.ui-at-tree__pill[data-status="waiting"] { background: var(--wait-fill); border-color: var(--wait-line); color: var(--wait-ink); }
.ui-at-tree__pill[data-status="failed"] { background: var(--bad-fill); border-color: var(--bad-line); color: var(--bad-ink); }
.ui-at-tree__pill--button { position: relative; z-index: 1; }
.ui-at-tree__pill--button:hover { filter: brightness(0.97); }
.ui-at-tree__spin { animation: ui-at-tree-spin 900ms linear infinite; }
@keyframes ui-at-tree-spin { to { transform: rotate(360deg); } }
.ui-at-tree__task { position: relative; margin: 8px 0 0; font-size: 13px; line-height: 1.4; color: var(--text); overflow-wrap: anywhere; pointer-events: none; }
.ui-at-tree__tools { display: inline-flex; vertical-align: -4px; margin-right: 6px; }
.ui-at-tree__tool {
  width: 18px; height: 18px; display: inline-grid; place-items: center; border-radius: 5px;
  background: var(--tile); border: 1px solid var(--line); box-shadow: 0 1px 2px rgba(26, 62, 112, 0.12);
}
.ui-at-tree__tool + .ui-at-tree__tool { margin-left: -4px; }
.ui-at-tree__tool > svg, .ui-at-tree__tool > img { width: 11px; height: 11px; }

.ui-at-tree__foot { display: flex; align-items: center; justify-content: space-between; gap: 8px; min-height: 32px; padding: 4px 6px 4px 10px; }
.ui-at-tree__meta { font-size: 12.5px; color: var(--muted); font-variant-numeric: tabular-nums; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ui-at-tree__cost { color: var(--ink); font-weight: 600; }
.ui-at-tree__cost[data-climbing], .ui-at-tree__total[data-climbing] {
  background: linear-gradient(100deg, var(--ink) 40%, var(--shine) 50%, var(--ink) 60%) 0 0 / 250% 100%;
  -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
  animation: ui-at-tree-shimmer 2.2s linear infinite;
}
:where(.dark, [data-theme="dark"]) .ui-at-tree__cost[data-climbing],
:where(.dark, [data-theme="dark"]) .ui-at-tree__total[data-climbing] {
  background-image: linear-gradient(100deg, var(--ink) 40%, #8fbdf2 50%, var(--ink) 60%);
}
@keyframes ui-at-tree-shimmer { from { background-position: 100% 0; } to { background-position: -150% 0; } }
.ui-at-tree__fold {
  flex: none; display: inline-flex; align-items: center; gap: 2px; height: 24px; padding: 0 6px; border: 0; border-radius: 7px;
  background: transparent; color: var(--muted); font-size: 12px; font-weight: 600; font-variant-numeric: tabular-nums;
  transition: background-color 150ms var(--ease), color 150ms var(--ease);
}
.ui-at-tree__fold:hover { background: var(--soft); color: var(--ink); }
.ui-at-tree__chev { transition: transform 150ms var(--ease); }
.ui-at-tree__fold[data-folded] .ui-at-tree__chev { transform: rotate(-90deg); }

.ui-at-tree__ask {
  position: absolute; z-index: 5; top: 40px; right: 8px; width: min(250px, calc(100% - 16px)); padding: 12px;
  border-radius: 12px; background: var(--panel); border: 1px solid var(--line-firm); box-shadow: var(--raised);
  animation: ui-at-tree-pop 150ms var(--ease);
}
@keyframes ui-at-tree-pop { from { opacity: 0; transform: translateY(-4px); } }
.ui-at-tree__ask-text { margin: 0; font-size: 13px; color: var(--ink); }
.ui-at-tree__ask-actions { display: flex; flex-direction: row-reverse; justify-content: flex-start; gap: 8px; margin-top: 10px; }
.ui-at-tree__btn {
  height: 30px; padding: 0 12px; border-radius: 10px; border: 1px solid var(--line-firm);
  background: var(--secondary); color: var(--ink); font-size: 13px; font-weight: 600; box-shadow: var(--drop);
  transition: background-color 150ms var(--ease);
}
.ui-at-tree__btn:hover { background: var(--soft); }
.ui-at-tree .ui-at-tree__btn--main {
  background: var(--berry); border-color: var(--berry); color: #fff;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 6px 12px -6px rgba(133, 20, 55, 0.6);
}
.ui-at-tree .ui-at-tree__btn--main:hover { background: var(--berry-hover); }

@media (pointer: coarse) {
  .ui-at-tree__fold { height: 32px; padding: 0 10px; }
  .ui-at-tree__btn { height: 38px; }
}
@media (prefers-reduced-motion: reduce) {
  .ui-at-tree *, .ui-at-tree *::before, .ui-at-tree *::after { transition-duration: 0ms !important; animation: none !important; }
  .ui-at-tree__cost[data-climbing], .ui-at-tree__total[data-climbing] { -webkit-text-fill-color: currentColor; background: none; }
}
`;var bt=6,ht=21e3,we=(r,o)=>t("svg",{viewBox:"0 0 16 16",width:"16",height:"16","aria-hidden":"true",focusable:"false",style:{color:o},children:r}),oe=we(t("path",{stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",d:"M8 2v12M2.8 5l10.4 6M2.8 11l10.4-6"}),"#c8553d"),ke=we(t("circle",{cx:"8",cy:"8",r:"5",fill:"none",stroke:"currentColor",strokeWidth:"1.8",strokeDasharray:"5 2.6"}),"#00162b"),_t=we(t("path",{fill:"currentColor",d:"M8 1.5c.5 3.6 2.9 6 6.5 6.5-3.6.5-6 2.9-6.5 6.5-.5-3.6-2.9-6-6.5-6.5 3.6-.5 6-2.9 6.5-6.5Z"}),"#3a6fd8"),O=(r,o)=>t("svg",{viewBox:"0 0 12 12",width:"11",height:"11","aria-hidden":"true",focusable:"false",style:{color:o},children:r}),vt=O(t("circle",{cx:"6",cy:"6",r:"4.2",fill:"none",stroke:"currentColor",strokeWidth:"1.4"}),"#1a6fd1"),se=O(t("path",{d:"M3 1.5h4l2 2v7H3z",fill:"none",stroke:"currentColor",strokeWidth:"1.3"}),"#00162b"),Pe=O(t("path",{d:"M2 3h8v5H5L3 10V8H2z",fill:"currentColor"}),"#7a3fbf"),Qe=O(t("path",{d:"M2 10l1-3 5-5 2 2-5 5z",fill:"currentColor"}),"#d0402b"),le=O(t("path",{d:"M4.5 3 1.5 6l3 3M7.5 3l3 3-3 3",fill:"none",stroke:"currentColor",strokeWidth:"1.4"}),"#00162b"),xt=O(t("rect",{x:"1.5",y:"3",width:"9",height:"6",rx:"1.2",fill:"currentColor"}),"#635bff"),kt=O(t("path",{d:"M6 1.5l1.3 2.9 3.2.3-2.4 2.1.7 3.1L6 8.3 3.2 9.9l.7-3.1L1.5 4.7l3.2-.3z",fill:"currentColor"}),"#ff6a3d"),Ze=[{id:"lead",name:"Orchestrator",model:"Opus 5.5",avatar:oe,tools:[Pe,se,le],task:"Launch the new pricing page by Friday",start:0,end:100,rate:.0035},{id:"research",parent:"lead",name:"Researcher",model:"Sonnet 5.5",avatar:oe,tools:[se,Pe],task:"Compare the pricing of five competitors",start:4,end:45,rate:.0044},{id:"scraper",parent:"research",name:"Scraper",model:"Gemini 3.8 Flash",avatar:_t,tools:[vt],task:"Read the pricing pages of Linear, Notion and three more",start:8,end:30,rate:.00136},{id:"analyst",parent:"research",name:"Analyst",model:"Sonnet 5.5",avatar:oe,tools:[kt,se],task:"Summarize 120 G2 reviews that mention price",start:18,end:45,rate:.003},{id:"writer",parent:"lead",name:"Writer",model:"Sonnet 5.5",avatar:oe,tools:[se,Qe],task:"Write the copy for the three plans",start:6,end:75,rate:.0033,waitFrom:40,ask:"Show yearly prices with the 20% discount, or monthly prices only?"},{id:"coder",parent:"lead",name:"Coder",model:"GPT-6 Sol",avatar:ke,tools:[le,xt,Qe],task:"Build the page and wire up checkout",start:8,end:88,rate:.006},{id:"tester",parent:"coder",name:"Tester",model:"GPT-6 Mini",avatar:ke,tools:[le],task:"Write and run the checkout tests",start:22,end:49,rate:.0015,failAt:49,error:"2 of 14 checkout tests failed: coupons over 100% are accepted."},{id:"tester-2",parent:"coder",name:"Tester",model:"GPT-6 Mini",avatar:ke,tools:[le],task:"Fix the coupon test and run all again",start:52,end:78,rate:.0015}];function wt(r,o,p){let h=new Map;for(let n of Ze){if(r<n.start)continue;let u=n.end,k=r>=u?n.failAt?"failed":"done":"running",$=Math.min(r,u)-n.start;n.waitFrom!=null&&r>=n.waitFrom&&(p==null?(k="waiting",$=n.waitFrom-n.start,u=1/0):(u=p+(n.end-n.waitFrom)/2,k=r>=u?"done":"running",$=n.waitFrom-n.start+Math.max(0,Math.min(r,u)-p))),h.set(n.id,{id:n.id,name:n.name,model:n.model,avatar:n.avatar,tools:n.tools,task:n.task,status:k,ask:n.ask,error:n.error,cost:Math.round($*n.rate*1e4)/1e4,started:o+n.start*1e3,ended:k==="done"||k==="failed"?o+Math.min(u,r)*1e3:void 0,children:[]})}for(let n of Ze){let u=h.get(n.id);u&&n.parent&&h.get(n.parent)?.children?.push(u)}let _=h.get("lead");return[...h.values()].some(n=>n.id!=="lead"&&(n.status==="running"||n.status==="waiting"))&&_.status==="done"&&(_.status="running",_.ended=void 0),_}function yt(){let r=f(Date.now()),[o,p]=N(0),[h,_]=N(null),[z,n]=N([]),u=f(null),k=f(0);k.current=o,C(()=>{let T=performance.now(),R=window.setInterval(()=>p((performance.now()-T)/1e3*bt),250),E=[],x=(F,Z)=>E.push(window.setTimeout(Z,F)),q=()=>{T=performance.now(),r.current=Date.now(),p(0),_(null),n([]),x(7600,()=>u.current?.querySelector('button[aria-haspopup="dialog"][data-status="waiting"]')?.click()),x(8800,()=>Array.from(u.current?.querySelectorAll('[role="dialog"] button')??[]).find(F=>F.textContent==="Approve")?.click()),x(10400,()=>u.current?.querySelector('button[aria-label^="Hide 2 sub-agents of Researcher"]')?.click()),x(18200,()=>n([])),x(ht,q)};return q(),()=>{window.clearInterval(R),E.forEach(F=>window.clearTimeout(F))}},[]);let $=Math.min(o,110);return t("div",{ref:u,style:{width:"100%",display:"grid",placeItems:"center"},children:t(qe,{root:wt($,r.current,h),now:r.current+$*1e3,collapsed:z,onCollapsedChange:n,onResolve:(T,R)=>{T.id==="writer"&&R==="approve"&&_(k.current)},onSelect:()=>{}})})}export{yt as default};
