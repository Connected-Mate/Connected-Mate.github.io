import{t as Qt}from"./react-BkAXpnfr.js";var Zt=Qt();var{Children:Sa,Component:Ma,Fragment:$a,StrictMode:Na,cloneElement:Aa,createContext:Ca,createElement:Ra,createRef:Ea,forwardRef:Da,isValidElement:za,lazy:Ta,memo:Ia,startTransition:La,Suspense:Wa,use:Oa,useCallback:Mt,useContext:qa,useDebugValue:Ba,useDeferredValue:Va,useEffect:W,useId:$t,useImperativeHandle:Fa,useInsertionEffect:Pa,useLayoutEffect:De,useMemo:se,useOptimistic:Ha,useReducer:Ka,useRef:S,useState:D,useSyncExternalStore:ja,useTransition:Ga}=Zt;import{t as Jt}from"./jsx-runtime-CTsRTJUX.js";var Yt=Jt(),{jsx:t,jsxs:l,Fragment:ze}=Yt;var Xt=560,Rt=16,Et=24,Dt=18,Qe="cubic-bezier(.16, 1, .3, 1)",Nt="http://www.w3.org/2000/svg",At=24,ea=28,$=new Intl.NumberFormat("en-US"),ta=a=>`$${a.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}`;function aa(a){let i=Math.max(0,Math.floor(a/1e3));if(i<60)return`${i}s`;let r=Math.floor(i/60);return r<60?`${r}m ${String(i%60).padStart(2,"0")}s`:`${Math.floor(r/60)}h ${String(r%60).padStart(2,"0")}m`}var na=a=>a.split(/\s+/).filter(Boolean).slice(0,2).map(i=>i[0]?.toUpperCase()).join(""),Ct={queued:"Queued",running:"Running",waiting:"Needs you",done:"Done",failed:"Failed",stopped:"Stopped"},zt=["waiting","failed","running","queued","stopped","done"],ia=(a,i)=>a.kind??(i?"root":a.children?.length?"chief":"agent");function sa(){let[a,i]=D(!1);return W(()=>{let r=window.matchMedia?.("(prefers-reduced-motion: reduce)");if(!r)return;let p=()=>i(r.matches);return p(),r.addEventListener?.("change",p),()=>r.removeEventListener?.("change",p)},[]),a}function ra(a){let i=new Map,r=[],p=[],C=(c,d,u)=>{let h=ia(c,d===0),g=c.children??[],_={node:c,kind:h,cost:c.cost??0,climbing:c.status==="running",descendants:0,agents:0,c:{queued:0,running:0,waiting:0,done:0,failed:0,stopped:0},parent:u,depth:d};i.set(c.id,_),r.push(_),!g.length&&h==="agent"&&(_.agents=1,_.c[c.status]+=1,c.status==="waiting"&&p.push(c.id));for(let ee of g){let I=C(ee,d+1,c.id);_.cost+=I.cost,_.climbing||=I.climbing,_.descendants+=1+I.descendants,_.agents+=I.agents;for(let H of zt)_.c[H]+=I.c[H]}return _};return C(a,0),{map:i,all:r,waiting:p}}function Ze(a,i){let r=[];for(let p=i;p;p=a.map.get(p)?.parent)r.unshift(p);return r}function Je(a,i,r,p=new Set){let C=a.map.get(i),c=C?.node.children??[];if(!C||!c.length)return p;p.add(i);let d=c.length,u=C.kind==="team"?[]:[...c];for(;u.length;){let h=u.shift(),g=a.map.get(h.id),_=h.children??[];!g||g.kind==="team"||g.kind==="agent"||!_.length||d+_.length>r||(p.add(h.id),d+=_.length,u.push(..._))}return p}var oa=()=>l("svg",{width:"13",height:"13",viewBox:"0 0 16 16","aria-hidden":"true",focusable:"false",children:[t("path",{fill:"currentColor",d:"M8 1.2c.35 2.9 1.9 4.45 4.8 4.8-2.9.35-4.45 1.9-4.8 4.8-.35-2.9-1.9-4.45-4.8-4.8 2.9-.35 4.45-1.9 4.8-4.8Z"}),t("path",{fill:"currentColor",opacity:".55",d:"M12.6 10.2c.15 1.2.8 1.85 2 2-1.2.15-1.85.8-2 2-.15-1.2-.8-1.85-2-2 1.2-.15 1.85-.8 2-2Z"})]}),Y=({status:a})=>{let i={width:11,height:11,viewBox:"0 0 16 16","aria-hidden":!0,focusable:!1};return a==="running"?l("svg",{...i,className:"ui-at-scale__spin",children:[t("circle",{cx:"8",cy:"8",r:"5.6",fill:"none",stroke:"currentColor",strokeOpacity:".25",strokeWidth:"2"}),t("path",{d:"M8 2.4a5.6 5.6 0 0 1 5.6 5.6",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"})]}):a==="done"?t("svg",{...i,children:t("path",{d:"M3.5 8.5l3 3 6-7",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})}):a==="failed"?t("svg",{...i,children:t("path",{fill:"currentColor",d:"M7.1 2.3a1 1 0 0 1 1.8 0l5.6 10.2a1 1 0 0 1-.9 1.5H2.4a1 1 0 0 1-.9-1.5L7.1 2.3Z"})}):a==="waiting"?l("svg",{...i,children:[t("circle",{cx:"8",cy:"8",r:"6",fill:"none",stroke:"currentColor",strokeWidth:"1.8"}),t("path",{d:"M8 4.8V8l2.2 1.4",fill:"none",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"})]}):t("svg",{...i,children:t("circle",{cx:"8",cy:"8",r:"5.5",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeDasharray:"2 2.4"})})},la=()=>t("svg",{width:"12",height:"12",viewBox:"0 0 24 24","aria-hidden":"true",focusable:"false",className:"ui-at-scale__chev",children:t("path",{d:"M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})}),ca=()=>l("svg",{width:"13",height:"13",viewBox:"0 0 16 16","aria-hidden":"true",focusable:"false",children:[t("circle",{cx:"7",cy:"7",r:"4.6",fill:"none",stroke:"currentColor",strokeWidth:"1.6"}),t("path",{d:"M10.5 10.5 14 14",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round"})]}),da=()=>l("svg",{width:"15",height:"15",viewBox:"0 0 16 16","aria-hidden":"true",focusable:"false",style:{color:"#1a3e70"},children:[t("circle",{cx:"8",cy:"4",r:"2",fill:"currentColor"}),t("path",{d:"M8 6.5V9M3.5 12V9h9v3",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round"}),t("circle",{cx:"3.5",cy:"13",r:"1.4",fill:"currentColor"}),t("circle",{cx:"12.5",cy:"13",r:"1.4",fill:"currentColor"})]}),ua=()=>l("svg",{width:"15",height:"15",viewBox:"0 0 16 16","aria-hidden":"true",focusable:"false",style:{color:"#2f6fc4"},children:[t("circle",{cx:"5",cy:"5.5",r:"2.2",fill:"currentColor"}),t("circle",{cx:"11",cy:"5.5",r:"2.2",fill:"currentColor",opacity:".7"}),t("circle",{cx:"8",cy:"11",r:"2.2",fill:"currentColor",opacity:".45"})]});function Tt({root:a,defaultExpanded:i,onExpandedChange:r,defaultFocus:p,onFocusChange:C,onResolve:c,onSelect:d,pageSize:u=40,now:h,formatCost:g=ta,title:_="Agents",className:ee}){let I=$t(),H=sa(),R=se(()=>ra(a),[a]),T=R.map,[te,v]=D(p??a.id),k=T.has(te)&&(T.get(te).node.children?.length??0)>0?te:a.id,M=T.get(k).node,w=T.get(k),K=R.map.get(a.id).climbing,[B,oe]=D(()=>Date.now());W(()=>{if(h!==void 0||!K)return;oe(Date.now());let e=window.setInterval(()=>oe(Date.now()),1e3);return()=>window.clearInterval(e)},[h,K]);let Wt=h??B,[le,Ot]=D(()=>i?new Set(i):Je(R,te,At)),Z=S(le);Z.current=le;let _e=e=>{Z.current=e,Ot(e),r?.([...e])},[We,at]=D(null),nt=S([]);W(()=>()=>nt.current.forEach(e=>window.clearTimeout(e)),[]);let it=e=>{if(!Z.current.has(e))return _e(new Set(Z.current).add(e));let n=()=>{let s=new Set(Z.current);s.delete(e),_e(s)};if(H||document.hidden)return n();at(e),nt.current.push(window.setTimeout(()=>{at(null),n()},260))},[ce,st]=D({}),rt=e=>u+(ce[e]??0),ae=S(null),[de,qt]=D(0);De(()=>{let e=ae.current;if(!e)return;let n=()=>qt(e.clientWidth-16);if(n(),typeof ResizeObserver>"u")return;let s=new ResizeObserver(n);return s.observe(e),()=>s.disconnect()},[]);let Oe=e=>le.has(e.id)?(e.children??[]).slice(0,rt(e.id)):[],qe=(e,n)=>Math.max(n,...Oe(e).map(s=>qe(s,n+1))),ue=Oe(M),Bt=ue.length?Math.max(...ue.map(e=>qe(e,0))):0,ot=ue.length?(de-(ue.length-1)*Rt)/ue.length-Et*Bt:de,xe=de>=Xt&&ot>=168,Vt=Math.round(xe?Math.min(240,ot):Math.max(180,Math.min(300,de-Dt*Math.min(qe(M,0),6)))),L={agents:w.agents,running:w.c.running,waiting:w.c.waiting,failed:w.c.failed},lt=w.cost,ct=[`${$.format(L.agents)} ${L.agents===1?"agent":"agents"}`,L.running?`${$.format(L.running)} running`:"",L.waiting?`${$.format(L.waiting)} needs you`:"",L.failed?`${$.format(L.failed)} failed`:""].filter(Boolean),[Ft,Pt]=D(""),dt=`${M.name}: ${ct.join(", ")}`;W(()=>{let e=window.setTimeout(()=>Pt(`${dt}, ${g(lt)}`),600);return()=>window.clearTimeout(e)},[dt]);let ve=S(null);ve.current===null&&(ve.current=new Set(R.all.map(e=>e.node.id)));let ke=new Map;for(let e of R.all)!ve.current.has(e.node.id)&&ke.size<60&&ke.set(e.node.id,ke.size);W(()=>{for(let e of R.all)ve.current.add(e.node.id)},[R]);let ut=S(null),J=S(new Map),we=S(new Map),pe=S(new Map),pt=S(!0),ft=S({wide:xe,rootId:k});ft.current={wide:xe,rootId:k};let Be=se(()=>{let e=[],n=(s,f)=>{for(let o of Oe(s)){let E=f||We===s.id;e.push({key:`${s.id}>${o.id}`,parent:s.id,child:o.id,muted:o.status==="queued"||o.status==="stopped",leaving:E}),n(o,E)}};return n(M,!1),e},[M,le,We,ce]),gt=S(Be);gt.current=Be;let ye=Mt(()=>{let e=ut.current,n=ae.current;if(!e||!n)return;let s=n.getBoundingClientRect();e.setAttribute("width",String(n.clientWidth)),e.setAttribute("height",String(n.scrollHeight));let f=m=>{let x=J.current.get(m);if(!x)return null;let y=x.getBoundingClientRect();return{l:y.left-s.left,r:y.right-s.left,t:y.top-s.top,b:y.bottom-s.top,cx:y.left-s.left+y.width/2}},{wide:o,rootId:E}=ft.current,N=new Set,V=new Set,F=!pt.current&&!document.hidden&&!H;for(let m of gt.current){let x=f(m.parent),y=f(m.child);if(!x||!y)continue;let U,Q;if(o&&m.parent===E){let A=x.b,O=A+(y.t-A)/2,b=y.cx-x.cx,q=Math.min(8,Math.abs(b)/2,(y.t-O)/2);Q=[x.cx,A],U=Math.abs(b)<1?`M ${x.cx} ${A} V ${y.t}`:`M ${x.cx} ${A} V ${O-q} Q ${x.cx} ${O} ${x.cx+Math.sign(b)*q} ${O} H ${y.cx-Math.sign(b)*q} Q ${y.cx} ${O} ${y.cx} ${O+q} V ${y.t}`}else{let A=x.l+(o?18:14),O=y.t+22,b=Math.min(8,Math.max(0,y.l-A)/2);Q=[A,x.b],U=`M ${A} ${x.b} V ${O-b} Q ${A} ${O} ${A+b} ${O} H ${y.l}`}N.add(m.key);let z=we.current.get(m.key);if(z)z.setAttribute("d",U);else if(z=document.createElementNS(Nt,"path"),z.setAttribute("class","ui-at-scale__link"),e.appendChild(z),we.current.set(m.key,z),z.setAttribute("d",U),F&&typeof z.animate=="function"){let A=z.getTotalLength();z.animate([{strokeDasharray:`${A}`,strokeDashoffset:A},{strokeDasharray:`${A}`,strokeDashoffset:0}],{duration:360,easing:Qe})}if(z.toggleAttribute("data-muted",m.muted),m.leaving&&!z.hasAttribute("data-leaving")&&F){z.setAttribute("data-leaving","");let A=z.getTotalLength();z.animate([{strokeDasharray:`${A}`,strokeDashoffset:0},{strokeDasharray:`${A}`,strokeDashoffset:A}],{duration:240,easing:Qe,fill:"forwards"})}V.add(m.parent);let j=pe.current.get(m.parent);j||(j=document.createElementNS(Nt,"circle"),j.setAttribute("class","ui-at-scale__dot"),j.setAttribute("r","3.5"),e.appendChild(j),pe.current.set(m.parent,j)),j.setAttribute("cx",String(Q[0])),j.setAttribute("cy",String(Q[1]))}we.current.forEach((m,x)=>{N.has(x)||(m.remove(),we.current.delete(x))}),pe.current.forEach((m,x)=>{V.has(x)||(m.remove(),pe.current.delete(x))}),pe.current.forEach(m=>e.appendChild(m)),pt.current=!1},[H]),Ve=S(null),Se=S(!1),Fe=`${de}|${k}|${Be.map(e=>e.key).join(",")}`,mt=S(Fe),Ht=mt.current!==Fe;if(typeof window<"u"&&J.current.size&&Ht){let e=new Map;J.current.forEach((n,s)=>e.set(s,n.getBoundingClientRect())),Ve.current=e}let Me=S(0);De(()=>{mt.current=Fe;let e=Ve.current;Ve.current=null;let n=!1;if(e&&!H&&!document.hidden&&!Se.current&&J.current.forEach((s,f)=>{let o=e.get(f);if(!o||typeof s.animate!="function")return;s.getAnimations().forEach(m=>{m.id==="flip"&&m.cancel()});let E=s.getBoundingClientRect(),N=o.left-E.left,V=o.top-E.top;if(Math.abs(N)<1&&Math.abs(V)<1)return;let F=s.animate([{transform:`translate(${N}px, ${V}px)`},{transform:"translate(0, 0)"}],{duration:420,easing:Qe});F.id="flip",n=!0}),Se.current=!1,ye(),n){cancelAnimationFrame(Me.current);let s=performance.now()+460,f=()=>{ye(),performance.now()<s&&(Me.current=requestAnimationFrame(f))};Me.current=requestAnimationFrame(f)}}),W(()=>()=>cancelAnimationFrame(Me.current),[]),W(()=>{let e=ae.current;if(!e||typeof ResizeObserver>"u")return;let n=new ResizeObserver(()=>ye());n.observe(e);let s=e.firstElementChild;return s&&n.observe(s),()=>n.disconnect()},[ye]);let[P,fe]=D(null),ge=S(new Map),Pe=S(null),$e=P?T.get(P)?.node:void 0;W(()=>{P&&(!$e||$e.status!=="waiting"&&$e.status!=="failed")&&fe(null)}),W(()=>{if(!P)return;let e=document.activeElement;(!e||e===document.body||ae.current?.contains(e))&&Pe.current?.querySelector("button")?.focus({preventScroll:!0});let n=s=>{let f=s.target;Pe.current?.contains(f)||ge.current.get(P)?.contains(f)||fe(null)};return document.addEventListener("pointerdown",n),()=>document.removeEventListener("pointerdown",n)},[P]);let ht=()=>{let e=P;fe(null);let n=document.activeElement;e&&(!n||n===document.body||ae.current?.contains(n))&&ge.current.get(e)?.focus({preventScroll:!0})},Ne=(e,n)=>{c?.(e,n),ht()},He=e=>{let n=T.get(e);if(!n||!n.node.children?.length)return;Se.current=!0,v(e),fe(null);let s=new Set(Z.current);Je(R,e,At,s),_e(s),C?.(n.node)},Kt=()=>{let e=T.get(k)?.parent;e&&He(e)},[Ke,bt]=D(null),je=S(null),_t=(e,n=!1)=>{let s=T.get(e);if(!s)return;let f=Ze(R,e);f.includes(k)||(Se.current=!0,v(a.id));let o=new Set;Z.current.forEach(N=>{T.get(N)?.kind!=="team"&&o.add(N)});let E={...ce};for(let N=0;N<f.length-1;N++){let V=f[N];o.add(V);let x=(T.get(V).node.children??[]).findIndex(y=>y.id===f[N+1])+1-u;x>(E[V]??0)&&(E[V]=Math.ceil(x/u)*u)}s.node.children?.length&&s.kind!=="team"&&Je(R,e,8,o),_e(o),st(E),bt(e),je.current={id:e,focusPill:n}};De(()=>{let e=je.current;if(!e)return;let n=J.current.get(e.id);n&&(je.current=null,n.scrollIntoView?.({block:"center",behavior:H?"auto":"smooth"}),e.focusPill&&ge.current.get(e.id)?.focus({preventScroll:!0}))}),W(()=>{if(!Ke)return;let e=window.setTimeout(()=>bt(null),2400);return()=>window.clearTimeout(e)},[Ke]);let[Ge,jt]=D(null),Gt=()=>{let e=R.waiting;if(!e.length)return;let n=(e.indexOf(Ge??"")+1)%e.length;jt(e[n]),_t(e[n],!0)},[G,xt]=D(""),[Ae,ne]=D(!1),[me,Ce]=D(0),vt=S(null),ie=se(()=>{let e=G.trim().toLowerCase();if(!e)return[];let n=[],s=[];for(let f of R.all){let o=f.node.name.toLowerCase();if(o.startsWith(e)?n.push(f):s.length<8&&(o.includes(e)||f.node.task.toLowerCase().includes(e))&&s.push(f),n.length>=8)break}return[...n,...s].slice(0,8)},[G,R]),kt=e=>{e&&(ne(!1),_t(e.node.id))},Ut=e=>{e.key==="ArrowDown"?(e.preventDefault(),ne(!0),Ce(n=>Math.min(ie.length-1,n+1))):e.key==="ArrowUp"?(e.preventDefault(),Ce(n=>Math.max(0,n-1))):e.key==="Enter"?(e.preventDefault(),kt(ie[me]??ie[0])):e.key==="Escape"&&(e.preventDefault(),e.stopPropagation(),Ae&&G?ne(!1):xt(""))},wt=S(null);W(()=>{let e=n=>{if(n.key!=="/"||n.ctrlKey||n.metaKey||n.altKey)return;let s=document.activeElement,f=!!s&&(s.isContentEditable||/^(INPUT|TEXTAREA|SELECT)$/.test(s.tagName)),o=!!s&&!!wt.current?.contains(s);f||!o&&s&&s!==document.body||(n.preventDefault(),vt.current?.focus())};return document.addEventListener("keydown",e),()=>document.removeEventListener("keydown",e)},[]);let yt=(e,n,s,f)=>{let o=T.get(e.id),E=e.children??[],N=!le.has(e.id),V=We===e.id,F=N?[]:E.slice(0,rt(e.id)),m=E.length>0,x=e.started!=null?aa((e.ended??(e.status==="running"||e.status==="waiting"?Wt:e.started))-e.started):null,y=!m&&(e.status==="waiting"||e.status==="failed"),U=ke.get(e.id),Q={};U!==void 0&&(Q.animationDelay=`${U*90}ms`),s&&(Q.animationDelay=`${f*50}ms`);let z=m&&e.id!==k,j=e.avatar??(o.kind==="chief"?t(da,{}):o.kind==="team"?t(ua,{}):null),A=m?`${e.name}, ${o.kind==="team"?"team":"chief of staff"}, ${$.format(o.agents)} agents${o.c.running?`, ${$.format(o.c.running)} running`:""}${o.c.waiting?`, ${$.format(o.c.waiting)} need you`:""}${o.c.failed?`, ${$.format(o.c.failed)} failed`:""}`:`${e.name}, ${Ct[e.status]}`,O=null;if(o.kind==="team"&&N&&o.agents){let b=[];for(let q of zt)for(let Ee=0;Ee<o.c[q]&&b.length<ea;Ee++)b.push(q);O=l("button",{type:"button",className:"ui-at-scale__dots","aria-label":`Show the ${$.format(o.agents)} agents of ${e.name}`,onClick:()=>it(e.id),children:[b.map((q,Ee)=>t("span",{"data-status":q},Ee)),o.agents>b.length?l("span",{className:"ui-at-scale__dots-more",children:["+",$.format(o.agents-b.length)]}):null]})}return l("li",{role:"treeitem","aria-label":A,"aria-expanded":m?!N:void 0,"aria-selected":!1,className:"ui-at-scale__item",children:[l("div",{ref:b=>{b?J.current.set(e.id,b):J.current.delete(e.id)},className:"ui-at-scale__node","data-status":e.status,"data-kind":o.kind,"data-rise":U!==void 0||void 0,"data-leaving":s||void 0,"data-hit":Ke===e.id||void 0,style:Q,children:[l("div",{className:"ui-at-scale__card","data-selectable":d?"":void 0,children:[d?t("button",{type:"button",className:"ui-at-scale__select","aria-label":`Open ${e.name}`,onClick:()=>d(e)}):null,l("div",{className:"ui-at-scale__top",children:[t("span",{className:"ui-at-scale__avatar","aria-hidden":"true",children:j??t("span",{className:"ui-at-scale__initials",children:na(e.name)})}),l("span",{className:"ui-at-scale__id",children:[z?t("button",{type:"button",className:"ui-at-scale__name ui-at-scale__name--link","aria-label":`Focus on ${e.name}`,onClick:()=>He(e.id),children:e.name}):t("span",{className:"ui-at-scale__name",children:e.name}),e.model?t("span",{className:"ui-at-scale__model",children:e.model}):null]}),y?l("button",{type:"button",ref:b=>{b?ge.current.set(e.id,b):ge.current.delete(e.id)},className:"ui-at-scale__pill ui-at-scale__pill--button","data-status":e.status,"aria-expanded":P===e.id,"aria-haspopup":"dialog","aria-controls":P===e.id?`${I}-ask`:void 0,onClick:()=>fe(P===e.id?null:e.id),children:[t(Y,{status:e.status}),e.status==="waiting"?"Needs you":"Failed"]}):l("span",{className:"ui-at-scale__pill","data-status":e.status,children:[t(Y,{status:e.status}),Ct[e.status]]})]}),l("p",{className:"ui-at-scale__task",children:[e.tools?.length?t("span",{className:"ui-at-scale__tools","aria-hidden":"true",children:e.tools.slice(0,3).map((b,q)=>t("span",{className:"ui-at-scale__tool",children:b},q))}):null,e.task]}),O,P===e.id&&$e?l("div",{ref:Pe,id:`${I}-ask`,role:"dialog","aria-label":e.status==="waiting"?`${e.name} needs you`:`${e.name} failed`,className:"ui-at-scale__ask",onKeyDown:b=>{b.key==="Escape"&&(b.preventDefault(),b.stopPropagation(),ht())},children:[t("p",{className:"ui-at-scale__ask-text",children:e.status==="waiting"?e.ask??"This agent waits for your decision.":e.error??"This agent stopped with an error."}),t("div",{className:"ui-at-scale__ask-actions",children:e.status==="waiting"?l(ze,{children:[t("button",{type:"button",className:"ui-at-scale__btn ui-at-scale__btn--main",onClick:()=>Ne(e,"approve"),children:"Approve"}),t("button",{type:"button",className:"ui-at-scale__btn",onClick:()=>Ne(e,"reject"),children:"Reject"})]}):l(ze,{children:[t("button",{type:"button",className:"ui-at-scale__btn ui-at-scale__btn--main",onClick:()=>Ne(e,"retry"),children:"Retry"}),t("button",{type:"button",className:"ui-at-scale__btn",onClick:()=>Ne(e,"dismiss"),children:"Dismiss"})]})})]}):null]}),l("div",{className:"ui-at-scale__foot",children:[l("span",{className:"ui-at-scale__meta",children:[t("span",{className:"ui-at-scale__cost","data-climbing":o.climbing||void 0,children:g(o.cost)}),m?l("span",{className:"ui-at-scale__roll","aria-hidden":"true",children:[o.c.running?l("span",{"data-status":"running",children:[t(Y,{status:"running"}),$.format(o.c.running)]}):null,o.c.waiting?l("span",{"data-status":"waiting",children:[t(Y,{status:"waiting"}),$.format(o.c.waiting)]}):null,o.c.failed?l("span",{"data-status":"failed",children:[t(Y,{status:"failed"}),$.format(o.c.failed)]}):null]}):x?l("span",{className:"ui-at-scale__time",children:["\xB7 ",x]}):null]}),m?l("button",{type:"button",className:"ui-at-scale__fold","aria-label":`${N?"Show":"Hide"} ${E.length} ${o.kind==="team"?"agent":"sub-agent"}${E.length===1?"":"s"} of ${e.name}`,"aria-expanded":!N,"data-folded":N||void 0,onClick:()=>it(e.id),children:[N?`+${$.format(o.descendants)}`:$.format(E.length),t(la,{})]}):null]})]}),F.length?l("ul",{role:"group",className:"ui-at-scale__group","data-depth":n+1,children:[F.map((b,q)=>yt(b,n+1,s||V,F.length-q)),E.length>F.length?t("li",{role:"none",className:"ui-at-scale__item",children:l("button",{type:"button",className:"ui-at-scale__more",onClick:()=>st({...ce,[e.id]:(ce[e.id]??0)+u}),children:["Show ",Math.min(u,E.length-F.length)," more",l("span",{children:[" \xB7 ",$.format(E.length-F.length)," left"]})]})}):null]}):null]},e.id)},Ue=Ze(R,k),Re=R.waiting.length,St=Ge?R.waiting.indexOf(Ge):-1;return l("div",{ref:wt,className:["ui-at-scale",ee].filter(Boolean).join(" "),onKeyDown:e=>{e.key!=="Escape"||e.defaultPrevented||k===a.id||e.target.closest('[role="dialog"]')||(e.preventDefault(),Kt())},children:[t("style",{href:"ui-agent-tree-scale",precedence:"default",children:pa}),l("div",{className:"ui-at-scale__bar",children:[t("span",{className:"ui-at-scale__mark",children:t(oa,{})}),t("h3",{className:"ui-at-scale__title",children:Ue.length>1?t("nav",{"aria-label":"Branch",className:"ui-at-scale__crumbs",children:t("ol",{children:Ue.map((e,n)=>{let s=n===Ue.length-1,f=n===0?_:T.get(e)?.node.name;return l("li",{children:[n?t("span",{className:"ui-at-scale__sep","aria-hidden":"true",children:"\u203A"}):null,s?t("span",{"aria-current":"location",children:f}):t("button",{type:"button",onClick:()=>He(e),children:f})]},e)})})}):_}),l("span",{className:"ui-at-scale__totals","aria-hidden":"true",children:[t("span",{children:ct[0]}),L.running?l("span",{"data-kind":"running",children:[$.format(L.running)," running"]}):null,L.waiting?l("span",{"data-kind":"waiting",children:[$.format(L.waiting)," needs you"]}):null,L.failed?l("span",{"data-kind":"failed",children:[$.format(L.failed)," failed"]}):null,t("strong",{className:"ui-at-scale__total","data-climbing":w.climbing||void 0,children:g(lt)})]}),l("div",{className:"ui-at-scale__tools-row",children:[l("div",{className:"ui-at-scale__search",role:"search",children:[t(ca,{}),t("input",{ref:vt,type:"search",className:"ui-at-scale__field",placeholder:"Find an agent or team","aria-label":"Find an agent or team",role:"combobox","aria-expanded":Ae&&!!G.trim(),"aria-controls":`${I}-results`,"aria-autocomplete":"list","aria-activedescendant":Ae&&ie[me]?`${I}-opt-${me}`:void 0,value:G,onChange:e=>{xt(e.target.value),Ce(0),ne(!0)},onFocus:()=>G&&ne(!0),onBlur:()=>ne(!1),onKeyDown:Ut}),t("kbd",{className:"ui-at-scale__kbd","aria-hidden":"true",children:"/"}),Ae&&G.trim()?l("div",{className:"ui-at-scale__results",children:[t("ul",{id:`${I}-results`,role:"listbox","aria-label":"Matches",children:ie.map((e,n)=>{let s=Ze(R,e.node.id).slice(1,-1).map(f=>T.get(f)?.node.name).join(" \u203A ");return l("li",{id:`${I}-opt-${n}`,role:"option","aria-selected":n===me,"data-active":n===me||void 0,onPointerDown:f=>f.preventDefault(),onPointerEnter:()=>Ce(n),onClick:()=>kt(e),children:[t("span",{className:"ui-at-scale__pill","data-status":e.agents===1&&!e.node.children?.length?e.node.status:void 0,children:e.node.children?.length?$.format(e.agents):t(Y,{status:e.node.status})}),l("span",{className:"ui-at-scale__id",children:[t("span",{className:"ui-at-scale__name",children:e.node.name}),t("span",{className:"ui-at-scale__model",children:s||(e.kind==="root"?"Top":"")})]})]},e.node.id)})}),ie.length?null:l("p",{className:"ui-at-scale__empty",children:["Nothing called \u201C",G.trim(),"\u201D"]})]}):null]}),l("button",{type:"button",className:"ui-at-scale__btn ui-at-scale__btn--main ui-at-scale__queue",disabled:!Re,onClick:Gt,children:[t(Y,{status:"waiting"}),Re?l(ze,{children:["Needs you ",t("span",{className:"ui-at-scale__qn",children:St>=0?`${St+1}/${$.format(Re)}`:$.format(Re)})]}):"Nobody needs you"]})]})]}),l("div",{ref:ae,className:"ui-at-scale__wrap","data-layout":xe?"wide":"narrow",style:{"--card-w":`${Vt}px`},children:[t("ul",{role:"tree","aria-label":M.name,className:"ui-at-scale__tree",children:yt(M,0,!1,0)}),t("svg",{ref:ut,className:"ui-at-scale__links","aria-hidden":"true"})]}),t("p",{className:"ui-at-scale__sr",role:"status","aria-live":"polite",children:Ft})]})}var pa=`
.ui-at-scale {
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
  --dot-run: #4b86d1; --dot-wait: #d9a514; --dot-fail: #c4573a; --dot-done: #3f9a5c; --dot-idle: #cbd6e4;
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
:where(.dark, [data-theme="dark"]) .ui-at-scale {
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
  --dot-run: #7fb0ee; --dot-wait: #f3d27a; --dot-fail: #f2a48c; --dot-done: #7fe0a0; --dot-idle: rgba(255, 255, 255, 0.22);
  --pebble-shade: inset 0 -2px 6px -4px rgba(3, 12, 28, 0.8);
  --drop: 0 8px 16px -8px rgba(3, 12, 28, 0.6);
  --raised: 0 18px 30px -16px rgba(3, 12, 28, 0.8), 0 4px 10px -6px rgba(3, 12, 28, 0.6);
  --float: 0 24px 48px -24px rgba(3, 12, 28, 0.7);
}
.ui-at-scale *, .ui-at-scale *::before, .ui-at-scale *::after { box-sizing: border-box; }
.ui-at-scale :where(button) { font: inherit; color: inherit; cursor: pointer; }
.ui-at-scale :focus-visible { outline: none; box-shadow: 0 0 0 3px var(--ring); }
.ui-at-scale__sr {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0;
}

.ui-at-scale__bar { position: relative; z-index: 6; display: flex; align-items: center; flex-wrap: wrap; gap: 6px 8px; padding: 10px 12px 14px 14px; }
.ui-at-scale__mark { display: inline-flex; color: var(--mark); }
.ui-at-scale__title {
  margin: 0; min-width: 0; color: var(--ink); font-size: 16px; font-weight: 700; letter-spacing: 0;
  font-family: "Avenir Next Condensed", "Avenir Next", Avenir, system-ui, sans-serif;
}
.ui-at-scale__crumbs ol { display: flex; flex-wrap: wrap; align-items: center; gap: 0 4px; list-style: none; margin: 0; padding: 0; }
.ui-at-scale__crumbs li { display: inline-flex; align-items: center; gap: 4px; min-width: 0; }
.ui-at-scale__crumbs button {
  border: 0; background: transparent; padding: 0 2px; border-radius: 6px; color: var(--muted); font-weight: 700;
  transition: color 150ms var(--ease);
}
.ui-at-scale__crumbs button:hover { color: var(--ink); }
.ui-at-scale__sep { color: var(--muted); font-weight: 600; }
.ui-at-scale__totals {
  margin-left: auto; display: flex; flex-wrap: wrap; align-items: center; gap: 4px 14px;
  font-size: 13px; color: var(--muted); font-variant-numeric: tabular-nums;
}
.ui-at-scale__totals [data-kind="running"] { color: var(--info-ink); }
.ui-at-scale__totals [data-kind="waiting"] { color: var(--wait-ink); }
.ui-at-scale__totals [data-kind="failed"] { color: var(--bad-ink); }
.ui-at-scale__total { color: var(--ink); font-weight: 600; }

.ui-at-scale__tools-row { flex-basis: 100%; display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-top: 6px; }
.ui-at-scale__search { position: relative; flex: 1 1 200px; max-width: 280px; display: flex; align-items: center; color: var(--muted); }
.ui-at-scale__search > svg { position: absolute; left: 10px; pointer-events: none; }
.ui-at-scale__search > .ui-at-scale__kbd { position: absolute; right: 8px; pointer-events: none; }
.ui-at-scale__field {
  width: 100%; height: 30px; padding: 0 30px; border-radius: 10px; border: 1px solid var(--line-firm);
  background: var(--panel); color: var(--ink); font: inherit; font-size: 13px; caret-color: var(--berry);
  box-shadow: inset 0 1px 2px rgba(26, 62, 112, 0.08); -webkit-appearance: none; appearance: none;
}
.ui-at-scale__field::placeholder { color: var(--muted); }
.ui-at-scale__field::-webkit-search-cancel-button { display: none; }
.ui-at-scale__kbd {
  display: inline-grid; place-items: center; min-width: 18px; height: 18px; padding: 0 4px; border-radius: 5px;
  background: var(--tile); border: 1px solid var(--line); border-bottom-width: 2px; color: #1a3e70; font: 600 11px/1 "Avenir Next", Avenir, system-ui, sans-serif;
}
.ui-at-scale__results {
  position: absolute; z-index: 8; left: 0; top: calc(100% + 6px); width: max(100%, 260px); padding: 6px;
  border-radius: 12px; background: var(--panel); border: 1px solid var(--line-firm); box-shadow: var(--raised);
  animation: ui-at-scale-pop 150ms var(--ease);
}
.ui-at-scale__results ul { list-style: none; margin: 0; padding: 0; max-height: 300px; overflow: auto; }
.ui-at-scale__results li { position: relative; display: flex; align-items: center; gap: 8px; padding: 6px 8px; border-radius: 8px; cursor: pointer; }
.ui-at-scale__results li[data-active] { background: var(--info-fill); }
.ui-at-scale__results li[data-active]::before { content: ""; position: absolute; left: 0; top: 7px; bottom: 7px; width: 2px; border-radius: 2px; background: var(--berry); }
.ui-at-scale__results .ui-at-scale__pill { min-width: 30px; justify-content: center; font-variant-numeric: tabular-nums; }
.ui-at-scale__empty { margin: 4px 6px; font-size: 13px; color: var(--muted); }
.ui-at-scale__queue { display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; }
.ui-at-scale__queue:disabled { background: var(--ok-fill) !important; border-color: var(--ok-line) !important; color: var(--ok-ink) !important; box-shadow: none !important; cursor: default; }
.ui-at-scale__qn { padding: 0 6px; border-radius: 999px; background: rgba(255, 255, 255, 0.18); font-size: 12px; font-variant-numeric: tabular-nums; }

.ui-at-scale__wrap { position: relative; padding: 0 8px; }
.ui-at-scale__links { position: absolute; left: 0; top: 0; pointer-events: none; overflow: visible; }
.ui-at-scale__link { fill: none; stroke: var(--ui-agt-link); stroke-width: 1.5; stroke-linecap: round; }
.ui-at-scale__link[data-muted] { stroke: var(--link-muted); stroke-dasharray: 3 4; }
.ui-at-scale__dot { fill: var(--panel); stroke: var(--ui-agt-link); stroke-width: 1.5; }

.ui-at-scale__tree, .ui-at-scale__group { list-style: none; margin: 0; padding: 0; }
.ui-at-scale__item { display: flex; flex-direction: column; align-items: flex-start; }
.ui-at-scale__group { display: flex; flex-direction: column; gap: 12px; margin-top: 14px; }
.ui-at-scale__wrap[data-layout="narrow"] .ui-at-scale__group { margin-left: ${Dt}px; }
.ui-at-scale__wrap[data-layout="narrow"] .ui-at-scale__group .ui-at-scale__group .ui-at-scale__group .ui-at-scale__group .ui-at-scale__group .ui-at-scale__group { margin-left: 0; }
.ui-at-scale__wrap[data-layout="wide"] .ui-at-scale__tree > .ui-at-scale__item { align-items: center; }
.ui-at-scale__wrap[data-layout="wide"] .ui-at-scale__group[data-depth="1"] {
  flex-direction: row; align-items: flex-start; justify-content: center; gap: ${Rt}px; margin-top: 44px; align-self: stretch;
}
.ui-at-scale__wrap[data-layout="wide"] .ui-at-scale__group:not([data-depth="1"]) { margin-left: ${Et}px; }

.ui-at-scale__node {
  position: relative; z-index: 1; width: var(--card-w); padding: 0 0 0; border-radius: 18px;
  background: var(--frame); border: 1px solid var(--line); box-shadow: var(--drop);
}
.ui-at-scale__node[data-rise] { animation: ui-at-scale-rise 420ms var(--ease) both; }
@keyframes ui-at-scale-rise { from { opacity: 0; transform: translateY(10px); } }
.ui-at-scale__node[data-leaving] { animation: ui-at-scale-leave 220ms var(--ease) both; }
@keyframes ui-at-scale-leave { to { opacity: 0; transform: translateY(-6px); } }
.ui-at-scale__node[data-status="queued"], .ui-at-scale__node[data-status="stopped"] { opacity: .72; }
.ui-at-scale__node[data-hit] { border-color: var(--info-line); animation: ui-at-scale-hit 1.2s var(--ease) 2; }
@keyframes ui-at-scale-hit {
  0%, 100% { box-shadow: 0 0 0 3px var(--info-fill), 0 0 0 4px var(--info-line), var(--drop); }
  50% { box-shadow: 0 0 0 8px var(--info-fill), 0 0 0 9px var(--info-line), var(--drop); }
}

.ui-at-scale__card {
  position: relative; margin: -1px -1px 0; padding: 10px 10px 10px; border-radius: 14px;
  background: var(--panel); border: 1px solid var(--line); box-shadow: var(--raised);
}
.ui-at-scale__card[data-selectable] { cursor: pointer; transition: border-color 150ms var(--ease); }
.ui-at-scale__card[data-selectable]:hover { border-color: var(--line-firm); }
.ui-at-scale__select { position: absolute; inset: 0; z-index: 0; border: 0; border-radius: 14px; background: transparent; padding: 0; }
.ui-at-scale__top { position: relative; display: flex; align-items: flex-start; gap: 8px; pointer-events: none; }
.ui-at-scale__top > .ui-at-scale__pill--button, .ui-at-scale__name--link { pointer-events: auto; }
.ui-at-scale__avatar {
  flex: none; width: 28px; height: 28px; display: grid; place-items: center; border-radius: 9px;
  background: var(--tile); border: 1px solid var(--line); box-shadow: var(--pebble-shade); overflow: hidden;
}
.ui-at-scale__avatar > svg, .ui-at-scale__avatar > img { width: 16px; height: 16px; }
.ui-at-scale__initials { font-size: 10.5px; font-weight: 700; color: #1a3e70; }
.ui-at-scale__id { min-width: 0; flex: 1; display: flex; flex-direction: column; align-items: flex-start; }
.ui-at-scale__name { max-width: 100%; color: var(--ink); font-weight: 700; font-size: 14px; line-height: 1.25; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ui-at-scale__name--link {
  position: relative; z-index: 1; padding: 0; border: 0; background: transparent; text-align: left; border-radius: 4px;
  text-decoration: underline; text-decoration-color: transparent; text-underline-offset: 3px;
  transition: text-decoration-color 150ms var(--ease), color 150ms var(--ease);
}
.ui-at-scale__name--link:hover { text-decoration-color: currentColor; color: var(--info-ink); }
.ui-at-scale__model { max-width: 100%; font-size: 12px; color: var(--muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ui-at-scale__pill {
  flex: none; display: inline-flex; align-items: center; gap: 4px; height: 22px; padding: 0 8px; border-radius: 999px;
  background: var(--soft); border: 1px solid var(--line); color: var(--muted); font-size: 11.5px; font-weight: 600; white-space: nowrap;
  transition: background-color 300ms var(--ease), color 300ms var(--ease), border-color 300ms var(--ease);
}
.ui-at-scale__pill[data-status="running"] { background: var(--info-fill); border-color: var(--info-line); color: var(--info-ink); }
.ui-at-scale__pill[data-status="done"] { background: var(--ok-fill); border-color: var(--ok-line); color: var(--ok-ink); }
.ui-at-scale__pill[data-status="waiting"] { background: var(--wait-fill); border-color: var(--wait-line); color: var(--wait-ink); }
.ui-at-scale__pill[data-status="failed"] { background: var(--bad-fill); border-color: var(--bad-line); color: var(--bad-ink); }
.ui-at-scale__pill--button { position: relative; z-index: 1; }
.ui-at-scale__pill--button:hover { filter: brightness(0.97); }
.ui-at-scale__spin { animation: ui-at-scale-spin 900ms linear infinite; }
@keyframes ui-at-scale-spin { to { transform: rotate(360deg); } }
.ui-at-scale__task { position: relative; margin: 8px 0 0; font-size: 13px; line-height: 1.4; color: var(--text); overflow-wrap: anywhere; pointer-events: none; }
.ui-at-scale__tools { display: inline-flex; vertical-align: -4px; margin-right: 6px; }
.ui-at-scale__tool {
  width: 18px; height: 18px; display: inline-grid; place-items: center; border-radius: 5px;
  background: var(--tile); border: 1px solid var(--line); box-shadow: 0 1px 2px rgba(26, 62, 112, 0.12);
}
.ui-at-scale__tool + .ui-at-scale__tool { margin-left: -4px; }
.ui-at-scale__tool > svg, .ui-at-scale__tool > img { width: 11px; height: 11px; }

.ui-at-scale__dots {
  position: relative; z-index: 1; display: flex; flex-wrap: wrap; align-items: center; gap: 4px; width: calc(100% + 8px);
  margin: 8px -4px 0; padding: 4px; border: 0; border-radius: 8px; background: transparent;
  transition: background-color 150ms var(--ease);
}
.ui-at-scale__dots:hover { background: var(--soft); }
.ui-at-scale__dots > span[data-status] {
  width: 8px; height: 8px; border-radius: 50%; background: var(--dot-idle);
  box-shadow: inset 0 -1px 2px rgba(0, 22, 43, 0.2); transition: background-color 300ms var(--ease);
}
.ui-at-scale__dots > span[data-status="running"] { background: var(--dot-run); }
.ui-at-scale__dots > span[data-status="waiting"] { background: var(--dot-wait); }
.ui-at-scale__dots > span[data-status="failed"] { background: var(--dot-fail); }
.ui-at-scale__dots > span[data-status="done"] { background: var(--dot-done); }
.ui-at-scale__dots-more { font-size: 11.5px; font-weight: 600; color: var(--muted); font-variant-numeric: tabular-nums; margin-left: 2px; }

.ui-at-scale__foot { display: flex; align-items: center; justify-content: space-between; gap: 8px; min-height: 32px; padding: 4px 6px 4px 10px; }
.ui-at-scale__meta { min-width: 0; display: inline-flex; align-items: center; font-size: 12.5px; color: var(--muted); font-variant-numeric: tabular-nums; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ui-at-scale__cost { color: var(--ink); font-weight: 600; }
.ui-at-scale__time { margin-left: 4px; }
.ui-at-scale__cost[data-climbing], .ui-at-scale__total[data-climbing] {
  background: linear-gradient(100deg, var(--ink) 40%, var(--shine) 50%, var(--ink) 60%) 0 0 / 250% 100%;
  -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
  animation: ui-at-scale-shimmer 2.2s linear infinite;
}
:where(.dark, [data-theme="dark"]) .ui-at-scale__cost[data-climbing],
:where(.dark, [data-theme="dark"]) .ui-at-scale__total[data-climbing] {
  background-image: linear-gradient(100deg, var(--ink) 40%, #8fbdf2 50%, var(--ink) 60%);
}
@keyframes ui-at-scale-shimmer { from { background-position: 100% 0; } to { background-position: -150% 0; } }
.ui-at-scale__roll { display: inline-flex; align-items: center; gap: 8px; margin-left: 8px; font-weight: 600; }
.ui-at-scale__roll > span { display: inline-flex; align-items: center; gap: 3px; }
.ui-at-scale__roll > [data-status="running"] { color: var(--info-ink); }
.ui-at-scale__roll > [data-status="waiting"] { color: var(--wait-ink); }
.ui-at-scale__roll > [data-status="failed"] { color: var(--bad-ink); }
.ui-at-scale__fold {
  flex: none; display: inline-flex; align-items: center; gap: 2px; height: 24px; padding: 0 6px; border: 0; border-radius: 7px;
  background: transparent; color: var(--muted); font-size: 12px; font-weight: 600; font-variant-numeric: tabular-nums;
  transition: background-color 150ms var(--ease), color 150ms var(--ease);
}
.ui-at-scale__fold:hover { background: var(--soft); color: var(--ink); }
.ui-at-scale__chev { transition: transform 150ms var(--ease); }
.ui-at-scale__fold[data-folded] .ui-at-scale__chev { transform: rotate(-90deg); }
.ui-at-scale__more {
  width: var(--card-w); max-width: 100%; height: 36px; padding: 0 12px; border-radius: 12px; border: 1px dashed var(--line-firm);
  background: transparent; color: var(--ink); font-size: 13px; font-weight: 600; text-align: left;
  transition: background-color 150ms var(--ease), border-color 150ms var(--ease);
}
.ui-at-scale__more > span { color: var(--muted); font-weight: 500; }
.ui-at-scale__more:hover { background: var(--soft); border-color: var(--info-line); }

.ui-at-scale__ask {
  position: absolute; z-index: 5; top: 40px; right: 8px; width: min(250px, calc(100% - 16px)); padding: 12px;
  border-radius: 12px; background: var(--panel); border: 1px solid var(--line-firm); box-shadow: var(--raised);
  animation: ui-at-scale-pop 150ms var(--ease);
}
@keyframes ui-at-scale-pop { from { opacity: 0; transform: translateY(-4px); } }
.ui-at-scale__ask-text { margin: 0; font-size: 13px; color: var(--ink); }
.ui-at-scale__ask-actions { display: flex; flex-direction: row-reverse; justify-content: flex-start; gap: 8px; margin-top: 10px; }
.ui-at-scale__btn {
  height: 30px; padding: 0 12px; border-radius: 10px; border: 1px solid var(--line-firm);
  background: var(--secondary); color: var(--ink); font-size: 13px; font-weight: 600; box-shadow: var(--drop);
  transition: background-color 150ms var(--ease);
}
.ui-at-scale__btn:hover { background: var(--soft); }
.ui-at-scale .ui-at-scale__btn--main {
  background: var(--berry); border-color: var(--berry); color: #fff;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 6px 12px -6px rgba(133, 20, 55, 0.6);
}
.ui-at-scale .ui-at-scale__btn--main:hover { background: var(--berry-hover); }

@media (pointer: coarse) {
  .ui-at-scale__fold { height: 32px; padding: 0 10px; }
  .ui-at-scale__btn { height: 38px; }
  .ui-at-scale__field { height: 38px; }
}
@media (prefers-reduced-motion: reduce) {
  .ui-at-scale *, .ui-at-scale *::before, .ui-at-scale *::after { transition-duration: 0ms !important; animation: none !important; }
  .ui-at-scale__cost[data-climbing], .ui-at-scale__total[data-climbing] { -webkit-text-fill-color: currentColor; background: none; }
  .ui-at-scale__node[data-hit] { box-shadow: 0 0 0 3px var(--info-fill), 0 0 0 4px var(--info-line), var(--drop); }
}
`;var tt=(a,i)=>t("svg",{viewBox:"0 0 16 16",width:"16",height:"16","aria-hidden":"true",focusable:"false",style:{color:i},children:a}),Te=tt(t("path",{stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",d:"M8 2v12M2.8 5l10.4 6M2.8 11l10.4-6"}),"#c8553d"),Xe=tt(t("circle",{cx:"8",cy:"8",r:"5",fill:"none",stroke:"currentColor",strokeWidth:"1.8",strokeDasharray:"5 2.6"}),"#00162b"),fa=tt(t("path",{fill:"currentColor",d:"M8 1.5c.5 3.6 2.9 6 6.5 6.5-3.6.5-6 2.9-6.5 6.5-.5-3.6-2.9-6-6.5-6.5 3.6-.5 6-2.9 6.5-6.5Z"}),"#3a6fd8"),X=(a,i)=>t("svg",{viewBox:"0 0 12 12",width:"11",height:"11","aria-hidden":"true",focusable:"false",style:{color:i},children:a}),ga=X(t("circle",{cx:"6",cy:"6",r:"4.2",fill:"none",stroke:"currentColor",strokeWidth:"1.4"}),"#1a6fd1"),Ie=X(t("path",{d:"M3 1.5h4l2 2v7H3z",fill:"none",stroke:"currentColor",strokeWidth:"1.3"}),"#00162b"),Lt=X(t("path",{d:"M2 3h8v5H5L3 10V8H2z",fill:"currentColor"}),"#7a3fbf"),It=X(t("path",{d:"M2 10l1-3 5-5 2 2-5 5z",fill:"currentColor"}),"#d0402b"),et=X(t("path",{d:"M4.5 3 1.5 6l3 3M7.5 3l3 3-3 3",fill:"none",stroke:"currentColor",strokeWidth:"1.4"}),"#00162b"),ma=X(t("rect",{x:"1.5",y:"3",width:"9",height:"6",rx:"1.2",fill:"currentColor"}),"#635bff"),ha=X(t("path",{d:"M6 1.5l1.3 2.9 3.2.3-2.4 2.1.7 3.1L6 8.3 3.2 9.9l.7-3.1L1.5 4.7l3.2-.3z",fill:"currentColor"}),"#ff6a3d"),Le=[{name:"Researcher",model:"Sonnet 5.5",avatar:Te,tools:[Ie,Lt],tasks:["Compare the pricing of five competitors","Collect what customers say about price"]},{name:"Scraper",model:"Gemini 3.8 Flash",avatar:fa,tools:[ga],tasks:["Read the pricing pages of Linear, Notion and three more","Pull last year's plan changes"]},{name:"Analyst",model:"Sonnet 5.5",avatar:Te,tools:[ha,Ie],tasks:["Summarize 120 G2 reviews that mention price","Find which plan sells best by country"]},{name:"Writer",model:"Sonnet 5.5",avatar:Te,tools:[Ie,It],tasks:["Write the copy for the three plans","Draft the launch e-mail"],ask:"Show yearly prices with the 20% discount, or monthly prices only?"},{name:"Coder",model:"GPT-6 Sol",avatar:Xe,tools:[et,ma,It],tasks:["Build the page and wire up checkout","Add the plan switcher"]},{name:"Tester",model:"GPT-6 Mini",avatar:Xe,tools:[et],tasks:["Write and run the checkout tests","Test the page on phones"],error:"2 of 14 checkout tests failed: coupons over 100% are accepted."}],re=["Research","Copy","Checkout","Design","Data","Quality","Growth","Support"],Ye=["France","Germany","Spain","Italy","Benelux","Nordics","UK","Switzerland"],ba=[{id:60,label:"60"},{id:1200,label:"1,200"},{id:5e3,label:"5,000"}];function _a(a){let i=a>>>0;return()=>{i=i+1831565813|0;let r=Math.imul(i^i>>>15,1|i);return r=r+Math.imul(r^r>>>7,61|r)^r,((r^r>>>14)>>>0)/4294967296}}function xa(a,i){let r=_a(11+a),p=new Map,C=[],c=[],d=0,u=(v,k)=>{let M={id:`${k.kind}-${++d}`,status:"running",cost:0,rate:0,parent:v,kids:[],v:1,snapV:0,...k};return v?.kids.push(M),p.set(M.id,M),M},h=u(null,{kind:"root",name:"Chief of Staff",model:"Opus 5.5",avatar:Te,tools:[Lt,Ie,et],task:"Launch the new pricing page by Friday",started:i-9*6e4,cost:.42}),g=a===60?2:a===1200?6:8,_=a===60?0:a===1200?3:4,ee=a===60?2:a===1200?4:5;for(let v=0;v<g;v++){let k=u(h,{kind:"chief",name:a===60?["Research chief","Build chief"][v]:`${Ye[v]} lead`,model:"Opus 5.5",avatar:Xe,task:a===60?["Find the right prices and the words for them","Ship the page and its checkout"][v]:`Run the launch in ${Ye[v]}`,started:i-(6+r()*3)*6e4,cost:.1+r()*.2});_||c.push(k);for(let M=0;M<_;M++){let w=re[(v+M)%re.length];c.push(u(k,{kind:"chief",name:`${w} chief`,model:"Opus 5.5",task:`Coordinate ${w.toLowerCase()} for ${Ye[v]}`,started:i-(3+r()*4)*6e4,cost:.05+r()*.1}))}}let I=a/(c.length*ee);for(let v of c)for(let k=0;k<ee;k++){let M=a===60?v.name.startsWith("Research")?["Pricing research","Copy"][k]:["Checkout","Quality"][k]:`${re[Math.floor(r()*re.length)]} team ${k+1}`,w=u(v,{kind:"team",name:M,model:"Sonnet 5.5",task:`Team of ${v.name.replace(/ (chief|lead)$/,"")}`,started:i-r()*5*6e4,cost:.02}),K=Math.max(3,Math.round(I*(a===60?1:.6+r()*.8)));w.task=`${K} agents on ${M.toLowerCase()}`;for(let B=0;B<K;B++)C.push(H(w,B,i))}function H(v,k,M){let w=Le[Math.floor(r()*Le.length)],K=r(),B=K<.3?"done":K<.72?"running":K<.95?"queued":K<.98&&w.ask?"waiting":w.error?"failed":"running",oe=M-r()*6*6e4;return u(v,{kind:"agent",name:`${w.name} ${k+1}`,model:w.model,avatar:w.avatar,tools:w.tools,task:w.tasks[Math.floor(r()*w.tasks.length)],ask:w.ask,error:w.error,role:w,status:B,started:B==="queued"?void 0:oe,ended:B==="done"||B==="failed"?oe+r()*3*6e4:void 0,cost:B==="queued"?0:Math.round(r()*.3*1e4)/1e4,rate:.0015+r()*.0045,waitedAt:B==="waiting"?M:void 0})}let R=C.find(v=>v.role?.ask);R&&Object.assign(R,{status:"waiting",waitedAt:te(),ended:void 0,started:i-9e4});let T=C.find(v=>v.role?.error);T&&Object.assign(T,{status:"failed",ended:i-2e4,started:i-8e4});function te(){return i+6e4}return{root:h,agents:C,byId:p,chiefs:c,rng:r,seq:d,spawned:0,cap:Math.ceil(a*.1)}}var he=a=>{for(let i=a;i;i=i.parent)i.v++};function be(a){if(a.snap&&a.snapV===a.v)return a.snap;let{rate:i,role:r,waitedAt:p,parent:C,kids:c,v:d,snap:u,snapV:h,...g}=a;return a.snap={...g,children:c.length?c.map(be):g.kind==="agent"?void 0:[]},a.snapV=a.v,a.snap}function va(a,i,r){let{rng:p}=a;for(let c of a.agents)c.status==="running"&&(c.cost=Math.round(((c.cost??0)+c.rate)*1e4)/1e4,he(c));let C=Math.max(2,Math.round(a.agents.length*.008));for(let c=0;c<C;c++){let d=a.agents[Math.floor(p()*a.agents.length)],u=d.status,h=p();d.status==="queued"?(d.status="running",d.started=i):d.status==="running"?h<.04&&d.role?.ask?(d.status="waiting",d.waitedAt=i):h<.07&&d.role?.error?(d.status="failed",d.ended=i):h<.6&&(d.status="done",d.ended=i):d.status==="done"&&h<.08&&(d.status="queued",d.started=void 0,d.ended=void 0,d.task=d.role?.tasks[Math.floor(p()*d.role.tasks.length)]??d.task),d.status!==u&&he(d)}for(let c of a.agents)c.status==="waiting"&&c.waitedAt&&i-c.waitedAt>45e3&&(c.status="running",he(c));if(r%12===0&&a.spawned<a.cap){let c=a.chiefs[Math.floor(p()*a.chiefs.length)],d={id:`team-${++a.seq}`,kind:"team",name:`${re[Math.floor(p()*re.length)]} team ${c.kids.length+1}`,model:"Sonnet 5.5",task:"",status:"running",started:i,cost:0,rate:0,parent:c,kids:[],v:1,snapV:0};c.kids.push(d),a.byId.set(d.id,d);let u=3+Math.floor(p()*5);d.task=`${u} agents, just started`;for(let h=0;h<u;h++){let g=Le[Math.floor(p()*Le.length)],_={id:`agent-${++a.seq}`,kind:"agent",name:`${g.name} ${h+1}`,model:g.model,avatar:g.avatar,tools:g.tools,task:g.tasks[0],ask:g.ask,error:g.error,role:g,status:h<2?"running":"queued",started:h<2?i:void 0,cost:0,rate:.0015+p()*.004,parent:d,kids:[],v:1,snapV:0};d.kids.push(_),a.agents.push(_),a.byId.set(_.id,_)}a.spawned+=u,he(c)}}function ka(){let[a,i]=D(60),r=se(()=>xa(a,Date.now()),[a]),[p,C]=D(()=>be(r.root)),c=S(0);return W(()=>{C(be(r.root)),c.current=0;let u=window.setInterval(()=>{c.current+=1,va(r,Date.now(),c.current),C(be(r.root))},1e3);return()=>window.clearInterval(u)},[r]),l("div",{style:{width:"100%",display:"grid",placeItems:"center",gap:10},children:[t(Tt,{root:p,title:"Agents",onResolve:(u,h)=>{let g=r.byId.get(u.id);g&&(h==="approve"||h==="retry"?(g.status="running",g.ended=void 0,h==="retry"&&(g.started=Date.now())):(g.status="stopped",g.ended=Date.now()),he(g),C(be(r.root)))}},a),l("div",{className:"ats-size",role:"group","aria-label":"Demo size",children:[t("style",{children:wa}),"Try it with",ba.map(u=>t("button",{type:"button","aria-pressed":a===u.id,onClick:()=>i(u.id),children:u.label},u.id)),"agents"]})]})}var wa=`
.ats-size { display: flex; align-items: center; gap: 4px; font: 12px/1.4 "Avenir Next", Avenir, system-ui, sans-serif; color: rgba(0, 22, 43, 0.54); }
:where(.dark, [data-theme="dark"]) .ats-size { color: rgba(255, 255, 255, 0.56); }
.ats-size button { font: inherit; color: inherit; border: 0; background: transparent; padding: 2px 6px; border-radius: 6px; cursor: pointer; }
.ats-size button:hover { background: rgba(26, 62, 112, 0.06); }
.ats-size button[aria-pressed="true"] { color: #1a3e70; font-weight: 600; text-decoration: underline; text-underline-offset: 3px; }
:where(.dark, [data-theme="dark"]) .ats-size button[aria-pressed="true"] { color: #c1daff; }
.ats-size button:focus-visible { outline: none; box-shadow: 0 0 0 3px #8fbdf2; }
`;export{ka as default};
