import{t as la}from"./react-BkAXpnfr.js";var da=la();var{Children:Fa,Component:Wa,Fragment:Ka,StrictMode:Ha,cloneElement:qa,createContext:Va,createElement:Ba,createRef:ja,forwardRef:Ga,isValidElement:Ua,lazy:Xa,memo:qt,startTransition:Ya,Suspense:Za,use:Qa,useCallback:H,useContext:Ja,useDebugValue:er,useDeferredValue:tr,useEffect:ne,useId:Rn,useImperativeHandle:nr,useInsertionEffect:ar,useLayoutEffect:it,useMemo:ce,useOptimistic:rr,useReducer:ir,useRef:S,useState:W,useSyncExternalStore:sr,useTransition:or}=da;import{t as ca}from"./jsx-runtime-CTsRTJUX.js";var ua=ca(),{jsx:r,jsxs:u,Fragment:st}=ua;var Pn=["waiting","failed","running","idle","done"],Bt=["done","running","waiting","failed","idle"],Ee={running:"Running",waiting:"Needs you",done:"Done",failed:"Failed",idle:"Idle"},yt={root:"Lead",chief:"Chief of staff",team:"Team",agent:"Agent"},pa=[{id:"all",label:"All"},{id:"waiting",label:"Needs you"},{id:"failed",label:"Failed"},{id:"running",label:"Running"},{id:"idle",label:"Idle"},{id:"done",label:"Done"}],An={root:296,chief:272,team:256,agent:232},fa=146,ma=120,ga=14,ha=16,kt=48,ba=96,xa=18,xt=14,Ce=60,Vt=.62,Tn=.3,Be=.005,_t=2,$n=40,In=8,Ln=600,_a=a=>106+Math.ceil(Math.max(1,Math.min(a,kt))/ha)*ga,A=new Intl.NumberFormat("en-US"),wa=a=>`$${a.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}`,je=(a,o,p)=>Math.min(p,Math.max(o,a));function On(a){let o=Math.max(0,Math.floor(a/1e3));if(o<60)return`${o}s`;let p=Math.floor(o/60);return p<60?`${p}m ${String(o%60).padStart(2,"0")}s`:`${Math.floor(p/60)}h ${String(p%60).padStart(2,"0")}m`}function va(){let[a,o]=W(!1);return ne(()=>{let p=window.matchMedia?.("(prefers-reduced-motion: reduce)");if(!p)return;let d=()=>o(p.matches);return d(),p.addEventListener?.("change",d),()=>p.removeEventListener?.("change",d)},[]),a}function ka(a){let o=new Map,p=[],d=[],R=(h,x,k)=>{let b={node:h,parent:x,depth:k,agents:0,c:{running:0,waiting:0,done:0,failed:0,idle:0},cost:h.cost??0,started:h.startedAt};o.set(h.id,b),p.push(b),h.kind==="agent"&&(b.agents=1,b.c[h.status]+=1,h.status==="waiting"&&d.push(h.id));for(let N of h.children??[]){let y=R(N,h.id,k+1);b.agents+=y.agents,b.cost+=y.cost;for(let g of Pn)b.c[g]+=y.c[g];y.started!==void 0&&(b.started===void 0||y.started<b.started)&&(b.started=y.started)}return b},v=R(a,null,0);return{byId:o,list:p,waiting:d,root:v}}var Fn=(a,o)=>o==="all"||a.c[o]>0,F=a=>a.kind!=="agent";function Ge(a){return F(a.node)?Wn(a):a.node.status}function Wn(a){return a.c.waiting?"waiting":a.c.failed?"failed":a.c.running?"running":a.agents&&a.c.done===a.agents?"done":a.agents?"idle":a.node.status}function ya(a){return F(a.node)?a.c.running?"running":Wn(a):a.node.status}function wt(a,o){let p=[];for(let d=a.byId.get(o)?.parent??null;d;d=a.byId.get(d)?.parent??null)p.push(d);return p.reverse()}function vt(a,o,p,d=new Set){let R=a.byId.get(o);if(!R)return d;let v=R.node.children??[];v.length&&d.add(o);let h=v.length,x=R.node.kind==="team"?[]:[...v];for(;x.length;){let k=x.shift(),b=k.children??[];k.kind==="team"||k.kind==="agent"||!b.length||h+b.length>p||(d.add(k.id),h+=b.length,x.push(...b))}return d}function Kn(a,o,p){let d=[];for(let R of o.node.children??[]){let v=a.byId.get(R.id);v&&Fn(v,p)&&d.push(v)}return d}var Dn=(a,o)=>a.node.kind==="agent"?ma:a.node.kind==="team"?_a(o==="all"?a.agents:a.c[o]):fa;function Ma(a,o,p){let d=[],R=[],v=new Map,h=0,x=(b,N,y,g,_,C,re)=>{let E=Kn(a,b,p),j=E.length>0&&o.has(b.node.id),z=An[b.node.kind],T=Dn(b,p),I={id:b.node.id,e:b,x:N,y,w:z,h:T,level:g,parent:_,pos:C,size:re,kids:E.length,open:j,end:0},O=d.length;if(d.push(I),v.set(I.id,O),h=Math.max(h,N+z),!j)return I.end=d.length,y+T;let X=N+z+ba,ie=E.length>6&&E.every(Y=>!Y.node.children?.length),ee=[],q=y;if(ie){let Y=E.length<=16?2:E.length<=36?3:4,Z=Math.max(...E.map(we=>An[we.node.kind])),_e=Math.max(...E.map(we=>Dn(we,p)));E.forEach((we,Q)=>{let G=Math.floor(Q/Y);Q%Y===0&&ee.push(d.length),x(we,X+Q%Y*(Z+xt),y+G*(_e+xt),g+1,I.id,Q+1,E.length)}),q=y+Math.ceil(E.length/Y)*(_e+xt)-xt}else{let Y=y;E.forEach((Z,_e)=>{ee.push(d.length),q=x(Z,X,Y,g+1,I.id,_e+1,E.length),Y=q+xa})}let ue=q-y;if(ue<T){let Y=(T-ue)/2;for(let Z=O+1;Z<d.length;Z++)d[Z].y+=Y}I.y=y+(Math.max(ue,T)-T)/2,I.end=d.length;for(let Y of ee){let Z=d[Y];R.push({x1:N+z,y1:I.y+T/2,x2:Z.x,y2:Z.y+Z.h/2,tone:ya(Z.e)})}return y+Math.max(ue,T)},k=x(a.root,0,0,1,null,1,1);return{items:d,pos:v,links:R,w:h,h:k}}function Sa(a,o,p,d){let R=[],v=a.byId.get(o)??a.root,h=(x,k,b,N,y)=>{let g=Kn(a,x,d),_=g.length>0&&p.has(x.node.id);R.push({id:x.node.id,e:x,level:k,parent:b,pos:N,size:y,kids:g.length,open:_}),_&&g.forEach((C,re)=>h(C,k+1,x.node.id,re+1,g.length))};return h(v,1,null,1,1),R}var Ue={viewBox:"0 0 16 16","aria-hidden":!0,focusable:!1},jt=()=>u("svg",{...Ue,width:"14",height:"14",children:[r("path",{fill:"currentColor",d:"M8 1.2c.35 2.9 1.9 4.45 4.8 4.8-2.9.35-4.45 1.9-4.8 4.8-.35-2.9-1.9-4.45-4.8-4.8 2.9-.35 4.45-1.9 4.8-4.8Z"}),r("path",{fill:"currentColor",opacity:".55",d:"M12.6 10.2c.15 1.2.8 1.85 2 2-1.2.15-1.85.8-2 2-.15-1.2-.8-1.85-2-2 1.2-.15 1.85-.8 2-2Z"})]}),Na=()=>u("svg",{...Ue,width:"14",height:"14",children:[r("circle",{cx:"8",cy:"4",r:"2",fill:"currentColor"}),r("path",{d:"M8 6.5V9M3.5 12V9h9v3",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round"}),r("circle",{cx:"3.5",cy:"13",r:"1.4",fill:"currentColor"}),r("circle",{cx:"12.5",cy:"13",r:"1.4",fill:"currentColor"})]}),Ca=()=>u("svg",{...Ue,width:"14",height:"14",children:[r("circle",{cx:"5",cy:"5.5",r:"2.2",fill:"currentColor"}),r("circle",{cx:"11",cy:"5.5",r:"2.2",fill:"currentColor",opacity:".7"}),r("circle",{cx:"8",cy:"11",r:"2.2",fill:"currentColor",opacity:".45"})]});function Mt({status:a}){let o={...Ue,width:11,height:11};return a==="running"?u("svg",{...o,className:"ui-ats__spin",children:[r("circle",{cx:"8",cy:"8",r:"5.6",fill:"none",stroke:"currentColor",strokeOpacity:".25",strokeWidth:"2"}),r("path",{d:"M8 2.4a5.6 5.6 0 0 1 5.6 5.6",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"})]}):a==="done"?r("svg",{...o,children:r("path",{d:"M3.5 8.5l3 3 6-7",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})}):a==="failed"?r("svg",{...o,children:r("path",{fill:"currentColor",d:"M7.1 2.3a1 1 0 0 1 1.8 0l5.6 10.2a1 1 0 0 1-.9 1.5H2.4a1 1 0 0 1-.9-1.5L7.1 2.3Z"})}):a==="waiting"?u("svg",{...o,children:[r("circle",{cx:"8",cy:"8",r:"6",fill:"none",stroke:"currentColor",strokeWidth:"1.8"}),r("path",{d:"M8 4.8V8l2.2 1.4",fill:"none",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"})]}):r("svg",{...o,children:r("circle",{cx:"8",cy:"8",r:"5.5",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeDasharray:"2 2.4"})})}var Hn=()=>r("svg",{width:"12",height:"12",viewBox:"0 0 24 24","aria-hidden":"true",focusable:"false",children:r("path",{d:"M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})}),Ea=()=>u("svg",{...Ue,width:"14",height:"14",children:[r("circle",{cx:"7",cy:"7",r:"4.6",fill:"none",stroke:"currentColor",strokeWidth:"1.6"}),r("path",{d:"M10.5 10.5 14 14",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round"})]}),zn=({dir:a})=>r("svg",{...Ue,width:"12",height:"12",children:r("path",{d:a==="next"?"M6 3.5 10.5 8 6 12.5":"M10 3.5 5.5 8 10 12.5",fill:"none",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"})}),St=({kind:a})=>a==="root"?r(jt,{}):a==="chief"?r(Na,{}):a==="team"?r(Ca,{}):null;function Gt({e:a,thick:o}){let p=Math.max(1,a.agents);return r("span",{className:"ui-ats__bar","data-thick":o?"":void 0,"aria-hidden":"true",children:Bt.map(d=>a.c[d]?r("span",{"data-s":d,style:{width:`${a.c[d]/p*100}%`}},d):null)})}function qn(a,o){let p=a.node,d=[`${p.name}`,yt[p.kind],`${A.format(a.agents)} agents`];return a.c.waiting&&d.push(`${A.format(a.c.waiting)} need you`),a.c.failed&&d.push(`${A.format(a.c.failed)} failed`),a.c.running&&d.push(`${A.format(a.c.running)} running`),d.push(`${Math.round(a.c.done/Math.max(1,a.agents)*100)}% done`,`cost ${o(a.cost)}`),d.join(", ")}function Vn(a,o){let p=a.node;return[p.name,Ee[p.status],p.model,p.task,`cost ${o(a.cost)}`].filter(Boolean).join(", ")}var Ra=qt(function({it:o,lod:p,sel:d,tab:R,hit:v,pulse:h,fresh:x,focus:k,now:b,filter:N,fmt:y,act:g}){let _=o.e,C=_.node,re=F(C),E=Ge(_),j=re?qn(_,y):Vn(_,y),z={transform:`translate(${o.x}px, ${o.y}px)`,width:o.w,height:o.h},T=_.started!==void 0?On((C.endedAt??b)-_.started):null,I=o.kids>0?r("button",{type:"button",tabIndex:-1,"aria-hidden":"true",className:"ui-ats__chev","data-open":o.open?"":void 0,onClick:X=>{X.stopPropagation(),g(o.id,"toggle")},children:r(Hn,{})}):null,O;if(p==="far")O=null;else if(p==="lite")O=u("div",{className:"ui-ats__card ui-ats__card--lite",children:[r("span",{className:"ui-ats__lname",children:C.name}),re?u(st,{children:[r(Gt,{e:_,thick:!0}),u("span",{className:"ui-ats__lcount",children:[A.format(_.agents)," agents"]}),_.c.waiting?u("span",{className:"ui-ats__lcount","data-s":"waiting",children:[A.format(_.c.waiting)," need you"]}):_.c.failed?u("span",{className:"ui-ats__lcount","data-s":"failed",children:[A.format(_.c.failed)," failed"]}):null]}):r("span",{className:"ui-ats__lcount","data-s":C.status,children:Ee[C.status]})]});else if(C.kind==="agent")O=u("div",{className:"ui-ats__card ui-ats__card--agent",children:[u("div",{className:"ui-ats__row",children:[r("span",{className:"ui-ats__pebble","data-s":C.status,children:r(Mt,{status:C.status})}),u("span",{className:"ui-ats__id",children:[r("span",{className:"ui-ats__name",children:C.name}),C.model?r("span",{className:"ui-ats__sub",children:C.model}):null]}),r("span",{className:"ui-ats__pill","data-s":C.status,"data-pop":h?"":void 0,children:Ee[C.status]},C.status),I]}),C.task?r("p",{className:"ui-ats__task",children:C.task}):null,u("div",{className:"ui-ats__meta",children:[r("span",{className:"ui-ats__cost",children:y(_.cost)}),T?r("span",{children:T}):null]})]});else{let X=N==="all"?_.agents:_.c[N],ie=[];if(C.kind==="team"){let ee=X>kt?kt-1:kt;for(let q of Pn)if(!(N!=="all"&&q!==N))for(let ue=0;ue<_.c[q]&&ie.length<ee;ue++)ie.push(q)}O=u(st,{children:[u("div",{className:"ui-ats__card",children:[C.kind==="root"?r("span",{className:"ui-ats__rail","aria-hidden":"true"}):null,u("div",{className:"ui-ats__row",children:[r("span",{className:"ui-ats__pebble","data-kind":C.kind,children:r(St,{kind:C.kind})}),u("span",{className:"ui-ats__id",children:[r("span",{className:"ui-ats__name",children:C.name}),u("span",{className:"ui-ats__sub",children:[yt[C.kind],C.model?` \xB7 ${C.model}`:""]})]}),_.c.waiting?r("span",{className:"ui-ats__pill","data-s":"waiting","data-pop":h?"":void 0,children:A.format(_.c.waiting)}):_.c.failed?r("span",{className:"ui-ats__pill","data-s":"failed","data-pop":h?"":void 0,children:A.format(_.c.failed)}):null,I]}),C.kind==="team"?u("span",{className:"ui-ats__dots","aria-hidden":"true",children:[ie.map((ee,q)=>r("span",{"data-s":ee},q)),X>ie.length?u("span",{className:"ui-ats__more",children:["+",A.format(X-ie.length)]}):null,X?null:r("span",{className:"ui-ats__none",children:"No agents yet"})]}):u(st,{children:[r(Gt,{e:_}),u("span",{className:"ui-ats__counts",children:[u("span",{children:[r("b",{children:A.format(_.agents)})," agents"]}),_.c.running?u("span",{"data-s":"running",children:[r("b",{children:A.format(_.c.running)})," running"]}):null,_.c.waiting?u("span",{"data-s":"waiting",children:[r("b",{children:A.format(_.c.waiting)})," need you"]}):null,_.c.failed?u("span",{"data-s":"failed",children:[r("b",{children:A.format(_.c.failed)})," failed"]}):null]})]})]}),u("div",{className:"ui-ats__nfoot",children:[r("span",{className:"ui-ats__cost",children:y(_.cost)}),u("span",{children:[C.kind==="team"?`${A.format(_.agents)} agents \xB7 `:"",Math.round(_.c.done/Math.max(1,_.agents)*100),"% done"]}),T&&C.kind!=="team"?r("span",{children:T}):null]})]})}return r("div",{role:"treeitem","data-id":o.id,className:"ui-ats__node","data-kind":C.kind,"data-lod":p,"data-tone":E,"data-selected":d?"":void 0,"data-hit":v?"":void 0,"data-fresh":x?"":void 0,"data-focus":k?"":void 0,"aria-label":j,"aria-level":o.level,"aria-posinset":o.pos,"aria-setsize":o.size,"aria-expanded":o.kids?o.open:void 0,"aria-selected":d,tabIndex:R?0:-1,style:z,onClick:()=>g(o.id,re?"open":"select"),children:O})}),Aa=qt(function({r:o,top:p,sel:d,tab:R,hit:v,isFocus:h,fmt:x,act:k}){let b=o.e,N=b.node,y=F(N),g=Ge(b);return u("div",{role:"treeitem","data-id":o.id,className:"ui-ats__lrow","data-selected":d?"":void 0,"data-hit":v?"":void 0,"data-focus":h?"":void 0,"aria-label":y?qn(b,x):Vn(b,x),"aria-level":o.level,"aria-posinset":o.pos,"aria-setsize":o.size,"aria-expanded":o.kids?o.open:void 0,"aria-selected":d,tabIndex:R?0:-1,style:{transform:`translateY(${p}px)`,paddingLeft:10+Math.min(o.level-1,6)*14},onClick:()=>k(o.id,y&&!h?"open":y?"toggle":"select"),children:[o.kids?r("button",{type:"button",tabIndex:-1,"aria-hidden":"true",className:"ui-ats__chev","data-open":o.open?"":void 0,onClick:_=>{_.stopPropagation(),k(o.id,"toggle")},children:r(Hn,{})}):r("span",{className:"ui-ats__chev-gap","aria-hidden":"true"}),r("span",{className:"ui-ats__pebble","data-kind":y?N.kind:void 0,"data-s":y?void 0:N.status,children:y?r(St,{kind:N.kind}):r(Mt,{status:N.status})}),u("span",{className:"ui-ats__id",children:[r("span",{className:"ui-ats__name",children:N.name}),r("span",{className:"ui-ats__sub",children:y?`${A.format(b.agents)} agents${b.c.waiting?` \xB7 ${A.format(b.c.waiting)} need you`:""}${b.c.failed?` \xB7 ${A.format(b.c.failed)} failed`:""}`:N.task??N.model??""})]}),u("span",{className:"ui-ats__lside",children:[y?r(Gt,{e:b}):r("span",{className:"ui-ats__pill","data-s":N.status,children:Ee[N.status]}),r("span",{className:"ui-ats__cost","data-tone":g,children:x(b.cost)})]})]})});function Bn({root:a,defaultExpanded:o,defaultView:p="auto",height:d=620,onSelect:R,onFocusChange:v,now:h,formatCost:x=wa,title:k="Agent org",className:b}){let N=Rn(),y=va(),g=ce(()=>ka(a),[a]),_=g.root.c.running>0,[C,re]=W(()=>Date.now());ne(()=>{if(h!==void 0||!_)return;let e=window.setInterval(()=>re(Date.now()),1e3);return()=>window.clearInterval(e)},[h,_]);let E=h??C,[j,z]=W(()=>o?new Set(o):vt(g,a.id,In)),[T,I]=W(a.id),[O,X]=W(a.id),[ie,ee]=W(null),[q,ue]=W("all"),[Y,Z]=W(p),[_e,we]=W(!1),Q=g.byId.has(T)?T:a.id,G=g.byId.has(O)?O:a.id,Ye=ie&&g.byId.has(ie)?ie:null,D=Y==="auto"?_e?"list":"map":Y,Ze=S(null),ge=S(null),Ct=S(null),Zt=S(null),Et=S(null),Rt=S(null),At=S(null),Tt=S(null);it(()=>{let e=Ze.current;if(!e||(we(e.getBoundingClientRect().width<Ln),typeof ResizeObserver>"u"))return;let n=new ResizeObserver(([t])=>we(t.contentRect.width<Ln));return n.observe(e),()=>n.disconnect()},[]);let U=ce(()=>D==="map"?Ma(g,j,q):null,[g,j,q,D]),he=ce(()=>D==="list"?Sa(g,Q,j,q):null,[g,Q,j,q,D]),Qe=ce(()=>{let e=new Map;return he?.forEach((n,t)=>e.set(n.id,t)),e},[he]),Qt=S(null),[Jt,en]=W(()=>({pulse:new Set,fresh:new Set}));ne(()=>{let e=Qt.current,n=new Map,t=new Set,i=new Set;for(let l of g.list){let c=l.node.status;if(n.set(l.node.id,c),!e)continue;let f=e.get(l.node.id);f===void 0?i.size<400&&i.add(l.node.id):f!==c&&(c==="waiting"||c==="failed")&&(t.add(l.node.id),l.parent&&t.add(l.parent))}if(Qt.current=n,!t.size&&!i.size)return;en({pulse:t,fresh:i});let s=window.setTimeout(()=>en({pulse:new Set,fresh:new Set}),900);return()=>window.clearTimeout(s)},[g]);let[Un,tn]=W(""),nn=S(g.waiting.length),an=S(0);ne(()=>{let e=g.waiting.length,n=nn.current;nn.current=e,e>n&&Date.now()-an.current>5e3&&(an.current=Date.now(),tn(`${e-n} more ${e-n===1?"agent needs":"agents need"} you. ${A.format(e)} in total.`))},[g]);let K=S({x:0,y:0,k:1}),V=S({w:0,h:0}),rn=S(!1),ve=S(0),dt=S(0),$t=S(0),sn=S(!0),ke=S(null),It=S(y);It.current=y;let Lt=S("full"),[Le,Xn]=W({key:"",x0:0,y0:0,x1:0,y1:0,lod:"full"}),Dt=S(null),ct=S(""),De=H(()=>{let e=Ze.current,n=e?getComputedStyle(e):null,t=(i,s)=>n?.getPropertyValue(i).trim()||s;return{flow:t("--flow","#3f7fd0"),wait:t("--dot-wait","#d9a514"),fail:t("--dot-fail","#c4573a"),done:t("--dot-done","#3f9a5c"),idle:t("--dot-idle","#cbd6e4"),link:t("--link","#b9c8db"),panel:t("--panel","#ffffff"),line:t("--line","#dae2ec"),ink:t("--ink","#00162b"),berry:t("--berry","#851437"),ring:t("--ring","#8fbdf2")}},[]),on=(e,n)=>n==="running"?e.flow:n==="waiting"?e.wait:n==="failed"?e.fail:n==="done"?e.done:e.idle,ze=H(()=>{let e=ke.current,n=Et.current;if(!e||!n)return;let t=n.clientWidth||176,i=n.clientHeight||112,s=Math.min(2,window.devicePixelRatio||1),l=document.createElement("canvas");l.width=t*s,l.height=i*s;let c=l.getContext("2d");if(!c)return;c.scale(s,s);let f=Math.min((t-12)/Math.max(1,e.w),(i-12)/Math.max(1,e.h)),m=(t-e.w*f)/2,w=(i-e.h*f)/2,M=De();for(let L of e.items)c.fillStyle=L.e.node.kind==="agent"||L.e.node.kind==="team"?on(M,Ge(L.e)):M.ink,c.globalAlpha=L.e.node.kind==="agent"||L.e.node.kind==="team"?.9:.55,c.fillRect(m+L.x*f,w+L.y*f,Math.max(1,L.w*f),Math.max(1,L.h*f));c.globalAlpha=1,Dt.current={c:l,s:f,ox:m,oy:w},n.width=t*s,n.height=i*s},[De]),ln=H(()=>{let e=Et.current,n=Dt.current;if(!e||!n)return;let t=e.getContext("2d");if(!t)return;let i=e.width/(e.clientWidth||1);t.setTransform(1,0,0,1,0,0),t.clearRect(0,0,e.width,e.height),t.drawImage(n.c,0,0),t.setTransform(i,0,0,i,0,0);let{x:s,y:l,k:c}=K.current,{w:f,h:m}=V.current,w=n.ox+-s/c*n.s,M=n.oy+-l/c*n.s,L=f/c*n.s,ae=m/c*n.s,le=De();t.fillStyle=le.berry,t.globalAlpha=.06,t.fillRect(w,M,L,ae),t.globalAlpha=1,t.strokeStyle=le.berry,t.lineWidth=1.5,t.strokeRect(w,M,Math.max(3,L),Math.max(3,ae))},[De]),Yn=H(()=>{let e=Zt.current,n=ke.current;if(!e||!n)return;let t=e.getContext("2d");if(!t)return;let{w:i,h:s}=V.current,l=Math.min(2,window.devicePixelRatio||1);(e.width!==Math.round(i*l)||e.height!==Math.round(s*l))&&(e.width=Math.round(i*l),e.height=Math.round(s*l)),t.setTransform(l,0,0,l,0,0),t.clearRect(0,0,i,s);let{x:c,y:f,k:m}=K.current,w=De(),M=w.panel+w.ink;M!==ct.current&&(ct.current=M,ze());let L=-c/m,ae=-f/m,le=L+i/m,$e=ae+s/m,me={running:new Path2D,waiting:new Path2D,failed:new Path2D,done:new Path2D,idle:new Path2D},Mn=!1;for(let B of n.links){if(Math.max(B.x1,B.x2)<L||Math.min(B.x1,B.x2)>le||Math.max(B.y1,B.y2)<ae||Math.min(B.y1,B.y2)>$e)continue;let He=c+B.x1*m,qe=f+B.y1*m,Ie=c+B.x2*m,P=f+B.y2*m,Se=(He+Ie)/2,Ne=me[B.tone];Ne.moveTo(He,qe),Ne.bezierCurveTo(Se,qe,Se,P,Ie,P),B.tone==="running"&&(Mn=!0)}let oa=je(1.6*m,.6,2);t.lineCap="round",t.lineWidth=oa;for(let B of["idle","done"])t.strokeStyle=w.link,t.stroke(me[B]);t.strokeStyle=w.wait,t.stroke(me.waiting),t.strokeStyle=w.fail,t.stroke(me.failed),t.strokeStyle=w.flow;let Sn=Mn&&!It.current&&sn.current&&m>.12;if(Sn&&(t.setLineDash([6,8]),t.lineDashOffset=-(performance.now()/40%14)),t.stroke(me.running),t.setLineDash([]),Lt.current==="far"){let B=2/m,He=new Path2D,qe={running:new Path2D,waiting:new Path2D,failed:new Path2D,done:new Path2D,idle:new Path2D},Ie=[];for(let P of n.items){if(P.x+P.w<L-B||P.x>le||P.y+P.h<ae-B||P.y>$e)continue;let Se=c+P.x*m,Ne=f+P.y*m,de=Math.max(1.5,P.w*m),J=Math.max(1.5,P.h*m);de>6&&He.roundRect(Se,Ne,de,J,Math.min(6,de/6));let Ve=P.e;if(F(Ve.node)&&Ve.agents){let Nn=Math.max(1.5,J*.16),Cn=Se;for(let Ht of Bt){if(!Ve.c[Ht])continue;let En=Ve.c[Ht]/Ve.agents*de;qe[Ht].rect(Cn,Ne+J-Nn,En,Nn),Cn+=En}}else qe[Ge(Ve)].rect(Se,Ne+(de>6?J*.84:0),de,de>6?J*.16:J);de>70&&Ie.push(P)}t.fillStyle=w.panel,t.fill(He),t.strokeStyle=w.line,t.lineWidth=1,t.stroke(He);for(let P of Bt)t.fillStyle=on(w,P),t.fill(qe[P]);if(Ie.length&&Ie.length<600){t.fillStyle=w.ink,t.font='600 11px "Avenir Next", Avenir, system-ui, sans-serif',t.textBaseline="middle";for(let P of Ie){let Se=c+P.x*m+6,Ne=f+P.y*m+P.h*m*.42,de=P.w*m-12,J=P.e.node.name;if(t.measureText(J).width>de){for(;J.length>1&&t.measureText(J+"\u2026").width>de;)J=J.slice(0,-1);J+="\u2026"}t.fillText(J,Se,Ne)}}}ln(),window.clearTimeout($t.current),Sn&&($t.current=window.setTimeout(()=>Re.current(),40))},[De,ze,ln]),Re=S(()=>{});Re.current=()=>{dt.current||(dt.current=requestAnimationFrame(()=>{dt.current=0,Yn()}))};let dn=H(()=>{let{x:e,y:n,k:t}=K.current,{w:i,h:s}=V.current,l=t>=Vt?"full":t>=Tn?"lite":"far";Lt.current=l;let f=256/Math.pow(2,Math.floor(Math.log2(t))),m=Math.floor(-e/t/f)-1,w=Math.floor(-n/t/f)-1,M=Math.ceil((-e+i)/t/f)+1,L=Math.ceil((-n+s)/t/f)+1,ae=`${l}|${m}|${w}|${M}|${L}`;Xn(le=>le.key===ae?le:{key:ae,x0:m*f,y0:w*f,x1:M*f,y1:L*f,lod:l})},[]),Pe=H(()=>{let{x:e,y:n,k:t}=K.current,i=Ct.current,s=ge.current;if(i&&(i.style.transform=`translate3d(${e}px, ${n}px, 0) scale(${t})`),s){let l=32*t*Math.pow(2,-Math.floor(Math.log2(t)));s.style.backgroundSize=`${l}px ${l}px`,s.style.backgroundPosition=`${e}px ${n}px`}Rt.current&&(Rt.current.textContent=`${Math.round(t*100)}%`),dn(),Re.current()},[dn]),se=H((e,n,t)=>{K.current={x:e,y:n,k:je(t,Be,_t)},Pe()},[Pe]),be=H((e,n,t,i=360)=>{if(cancelAnimationFrame(ve.current),t=je(t,Be,_t),It.current||i<=0)return se(e,n,t);let s={...K.current},l=performance.now(),c=f=>{let m=Math.min(1,(f-l)/i),w=1-Math.pow(1-m,4),M=Math.exp(Math.log(s.k)+(Math.log(t)-Math.log(s.k))*w);se(s.x+(e-s.x)*w,s.y+(n-s.y)*w,M),m<1&&(ve.current=requestAnimationFrame(c))};ve.current=requestAnimationFrame(c)},[se]),Oe=H((e,n,t,i=0)=>{let{x:s,y:l,k:c}=K.current,f=je(c*t,Be,_t),m=(e-s)/c,w=(n-l)/c,M=e-m*f,L=n-w*f;i?be(M,L,f,i):(cancelAnimationFrame(ve.current),se(M,L,f))},[be,se]),ut=H((e,n,t,i,s,l,c)=>{let{w:f,h:m}=V.current;if(!f||!m)return;let w=Math.min((f-72)/Math.max(1,t-e),(m-72)/Math.max(1,i-n),l);if(w>=s||!c){let M=Math.max(w,Math.min(s,Be));be(f/2-(e+t)/2*M,m/2-(n+i)/2*M,M)}else{let M=Math.max(s,.78);be(40-c.x*M,m/2-(c.y+c.h/2)*M,M)}},[be]),pt=H(()=>{let e=ke.current;e&&ut(0,0,e.w,e.h,Be,1)},[ut]),zt=H(e=>{let n=ke.current,t=n?.pos.get(e);if(!n||t===void 0)return;let i=n.items[t],s=i.x+i.w,l=i.y,c=i.y+i.h;for(let f=t+1;f<i.end;f++){let m=n.items[f];s=Math.max(s,m.x+m.w),l=Math.min(l,m.y),c=Math.max(c,m.y+m.h)}ut(i.x,l,s,c,Vt,1,i)},[ut]),ft=H((e,n=.9)=>{let t=ke.current,i=t?.pos.get(e);if(!t||i===void 0)return;let s=t.items[i],{w:l,h:c}=V.current,f=Math.max(K.current.k,n);be(l/2-(s.x+s.w/2)*f,c/2-(s.y+s.h/2)*f,Math.min(f,1.2))},[be]),Zn=H(e=>{let n=ke.current,t=n?.pos.get(e);if(!n||t===void 0)return;let i=n.items[t],{x:s,y:l,k:c}=K.current,{w:f,h:m}=V.current;if(c<Vt)return ft(e,.85);let w=40,M=s+i.x*c,L=l+i.y*c,ae=M+i.w*c,le=L+i.h*c,$e=0,me=0;M<w?$e=w-M:ae>f-w&&($e=Math.max(f-w-ae,w-M)),L<w?me=w-L:le>m-w&&(me=Math.max(m-w-le,w-L)),($e||me)&&be(s+$e,l+me,c,200)},[ft,be]),Je=S(null);it(()=>{if(ke.current=U,!U)return;ze();let e=ge.current;if(e&&!rn.current){let t=e.getBoundingClientRect();if(V.current={w:t.width,h:t.height},t.width&&t.height){rn.current=!0;let i=Math.min((t.width-72)/Math.max(1,U.w),(t.height-72)/Math.max(1,U.h),1);if(i>=Tn)K.current={x:(t.width-U.w*i)/2,y:(t.height-U.h*i)/2,k:i};else{let s=U.items[0],l=.72;K.current={x:32,y:t.height/2-(s.y+s.h/2)*l,k:l}}}}Pe();let n=Je.current;n&&U.pos.has(n.id)&&(Je.current=null,n.kind==="subtree"?zt(n.id):ft(n.id))},[U,Pe,ze,zt,ft]),ne(()=>{if(D!=="map")return;let e=ge.current;if(!e)return;let n=typeof ResizeObserver<"u"?new ResizeObserver(([c])=>{V.current={w:c.contentRect.width,h:c.contentRect.height},ze(),Pe()}):null;n?.observe(e);let t=new MutationObserver(()=>{ct.current="",Re.current()});for(let c=Ze.current;c;c=c.parentElement)t.observe(c,{attributes:!0,attributeFilter:["class","data-theme"]});let i=typeof IntersectionObserver<"u"?new IntersectionObserver(([c])=>{sn.current=c.isIntersecting,c.isIntersecting&&Re.current()}):null;i?.observe(e);let s=window.matchMedia?.("(prefers-color-scheme: dark)"),l=()=>{ct.current="",Re.current()};return s?.addEventListener?.("change",l),()=>{n?.disconnect(),t.disconnect(),i?.disconnect(),s?.removeEventListener?.("change",l)}},[D,Pe,ze]),ne(()=>()=>{cancelAnimationFrame(ve.current),cancelAnimationFrame(dt.current),window.clearTimeout($t.current)},[]),ne(()=>{Re.current()},[y]);let cn=S(R);cn.current=R;let un=S(v);un.current=v;let pn=S(D);pn.current=D;let et=S(g);et.current=g;let fn=S(q);fn.current=q;let xe=S(!1),tt=S(!1),ye=H(e=>{let n=et.current,t=n.byId.get(e);if(!t)return;let i=new Set(wt(n,e));vt(n,e,$n,i),z(i),I(e),X(e),Je.current={kind:"subtree",id:e},tt.current=!0,un.current?.(t.node)},[]),nt=H(e=>{z(n=>{let t=new Set(n);return t.has(e)?t.delete(e):t.add(e),t})},[]),mn=H((e,n=!0)=>{let t=et.current,i=t.byId.get(e);if(!i)return;Fn(i,fn.current)||ue("all");let s=wt(t,e),l=new Set(s);F(i.node)&&vt(t,e,$n,l),z(l);let c=F(i.node)?e:i.parent??e;if(I(c),X(e),ee(e),Je.current={kind:F(i.node)?"subtree":"center",id:e},tt.current=!0,n){let f=s.slice(1).map(m=>t.byId.get(m)?.node.name).filter(Boolean).join(", ");tn(`${i.node.name}${f?`, in ${f}`:""}. ${F(i.node)?`${A.format(i.agents)} agents.`:Ee[i.node.status]}`)}},[]),Pt=H((e,n)=>{let t=et.current.byId.get(e);if(t){if(ee(null),n==="toggle"){X(e),nt(e);return}n==="open"?ye(e):X(e),cn.current?.(t.node)}},[ye,nt]),Qn=H(()=>{let n=et.current.byId.get(Q)?.parent;n?ye(n):(ee(null),pn.current==="map"&&pt())},[Q,ye,pt]),oe=(D==="map"?U?.items:he)??[],Ot=D==="map"?U?.pos??new Map:Qe,gn=Ot.has(G)?G:oe[0]?.id,Fe=e=>{X(e),ee(null),xe.current=!0,D==="map"?Zn(e):tt.current=!0},hn=e=>{if(e.altKey||e.ctrlKey||e.metaKey)return;let n=Ot.get(G)??-1,t=oe[n],i=e.key,s=()=>{e.preventDefault(),e.stopPropagation()};if(i==="ArrowDown"){s();let l=oe[Math.min(oe.length-1,n+1)];l&&Fe(l.id)}else if(i==="ArrowUp"){s();let l=oe[Math.max(0,n-1)];l&&Fe(l.id)}else if(i==="Home")s(),oe[0]&&Fe(oe[0].id);else if(i==="End"){s();let l=oe[oe.length-1];l&&Fe(l.id)}else if(i==="ArrowRight"){if(s(),!t)return;t.kids&&!t.open?(xe.current=!0,nt(t.id)):t.open&&oe[n+1]&&Fe(oe[n+1].id)}else if(i==="ArrowLeft"){if(s(),!t)return;t.open?(xe.current=!0,nt(t.id)):t.parent&&Ot.has(t.parent)?Fe(t.parent):D==="list"&&g.byId.get(t.id)?.parent&&(xe.current=!0,ye(g.byId.get(t.id).parent))}else if(i==="Enter"){if(s(),!t)return;xe.current=!0;let l=g.byId.get(t.id);l&&F(l.node)&&t.kids?ye(t.id):l&&(X(t.id),R?.(l.node))}else i===" "?(s(),t?.kids&&(xe.current=!0,nt(t.id))):i==="Escape"?(Q!==a.id||Ye)&&(s(),xe.current=!0,Qn()):D==="map"&&(i==="+"||i==="=")?(s(),Oe(V.current.w/2,V.current.h/2,1.25,150)):D==="map"&&i==="-"?(s(),Oe(V.current.w/2,V.current.h/2,.8,150)):D==="map"&&i==="0"&&(s(),pt())};it(()=>{if(!xe.current)return;let n=(D==="map"?Ct.current:At.current)?.querySelector(`[data-id="${CSS.escape(G)}"]`);n&&(xe.current=!1,n.focus({preventScroll:!0}))}),ne(()=>{let e=n=>{if(n.key!=="/"||n.ctrlKey||n.metaKey||n.altKey)return;let t=document.activeElement,i=!!t&&!!Ze.current?.contains(t);t&&(t.isContentEditable||/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))||!i&&t&&t!==document.body||(n.preventDefault(),Tt.current?.focus(),Tt.current?.select())};return document.addEventListener("keydown",e),()=>document.removeEventListener("keydown",e)},[]);let te=S(new Map),Ae=S(null),Te=S(null),at=S(!1),Ft=(e,n)=>{let t=ge.current?.getBoundingClientRect();return{x:e-(t?.left??0),y:n-(t?.top??0)}},Jn=(e,n)=>{let t=ke.current;if(!t)return null;let{x:i,y:s,k:l}=K.current,c=(e-i)/l,f=(n-s)/l,m=4/l;for(let w=t.items.length-1;w>=0;w--){let M=t.items[w];if(c>=M.x-m&&c<=M.x+M.w+m&&f>=M.y-m&&f<=M.y+M.h+m)return M}return null},ea=e=>{if(e.pointerType==="mouse"&&e.button!==0||e.target.closest("button, input, a, .ui-ats__overlay"))return;cancelAnimationFrame(ve.current);let n=Ft(e.clientX,e.clientY);if(te.current.set(e.pointerId,n),te.current.size===1)Ae.current={sx:n.x,sy:n.y,cx:K.current.x,cy:K.current.y,moved:!1};else if(te.current.size===2){let[t,i]=[...te.current.values()],{x:s,y:l,k:c}=K.current,f=(t.x+i.x)/2,m=(t.y+i.y)/2;Te.current={d:Math.hypot(t.x-i.x,t.y-i.y)||1,k:c,wx:(f-s)/c,wy:(m-l)/c},Ae.current&&(Ae.current.moved=!0)}},ta=e=>{if(!te.current.has(e.pointerId))return;let n=Ft(e.clientX,e.clientY);if(te.current.set(e.pointerId,n),Te.current&&te.current.size>=2){let[l,c]=[...te.current.values()],f=Math.hypot(l.x-c.x,l.y-c.y)||1,m=je(Te.current.k*(f/Te.current.d),Be,_t),w=(l.x+c.x)/2,M=(l.y+c.y)/2;se(w-Te.current.wx*m,M-Te.current.wy*m,m);return}let t=Ae.current;if(!t)return;let i=n.x-t.sx,s=n.y-t.sy;!t.moved&&Math.hypot(i,s)>4&&(t.moved=!0,ge.current?.setPointerCapture?.(e.pointerId),ge.current?.setAttribute("data-dragging","")),t.moved&&se(t.cx+i,t.cy+s,K.current.k)},bn=e=>{if(!te.current.has(e.pointerId))return;if(te.current.delete(e.pointerId),te.current.size<2&&(Te.current=null),te.current.size===1){let[t]=[...te.current.values()];Ae.current={sx:t.x,sy:t.y,cx:K.current.x,cy:K.current.y,moved:!0};return}let n=Ae.current;if(Ae.current=null,ge.current?.removeAttribute("data-dragging"),n?.moved)at.current=!0,window.setTimeout(()=>at.current=!1,0);else if(e.type==="pointerup"&&Lt.current==="far"){let t=Ft(e.clientX,e.clientY),i=Jn(t.x,t.y);i&&(at.current=!0,window.setTimeout(()=>at.current=!1,0),Pt(i.id,F(i.e.node)?"open":"select"))}};ne(()=>{if(D!=="map")return;let e=ge.current;if(!e)return;let n=t=>{if(t.target.closest(".ui-ats__overlay"))return;t.preventDefault();let i=t.deltaMode===1?16:t.deltaMode===2?V.current.h:1,s=t.deltaX*i,l=t.deltaY*i;if(t.ctrlKey||t.metaKey){let c=e.getBoundingClientRect();Oe(t.clientX-c.left,t.clientY-c.top,Math.exp(-je(l,-80,80)*.01))}else{cancelAnimationFrame(ve.current);let{x:c,y:f,k:m}=K.current;t.shiftKey&&!s?se(c-l,f,m):se(c-s,f-l,m)}};return e.addEventListener("wheel",n,{passive:!1}),()=>e.removeEventListener("wheel",n)},[D,Oe,se]);let xn=e=>{if(e.type==="pointerdown")e.currentTarget.setPointerCapture?.(e.pointerId);else if(!(e.buttons&1))return;let n=Dt.current;if(!n)return;let t=e.currentTarget.getBoundingClientRect(),i=(e.clientX-t.left-n.ox)/n.s,s=(e.clientY-t.top-n.oy)/n.s,{k:l}=K.current;cancelAnimationFrame(ve.current),se(V.current.w/2-i*l,V.current.h/2-s*l,l)},[Wt,_n]=W(0);it(()=>{if(D!=="list"||!tt.current)return;let e=At.current,n=Qe.get(G);if(!e||n===void 0)return;tt.current=!1;let t=n*Ce;t<e.scrollTop?e.scrollTop=t:t+Ce>e.scrollTop+e.clientHeight&&(e.scrollTop=t+Ce-e.clientHeight),_n(e.scrollTop)},[D,Qe,G]);let[pe,wn]=W(""),[mt,We]=W(!1),[rt,gt]=W(0),Me=ce(()=>{let e=pe.trim().toLowerCase();if(!e)return[];let n=[],t=[];for(let s of g.list){let l=s.node.name.toLowerCase();if(l.startsWith(e)?n.push(s):(l.includes(e)||s.node.task?.toLowerCase().includes(e))&&t.push(s),n.length>=8)break}let i=s=>s.node.kind==="agent"?1:0;return n.sort((s,l)=>i(s)-i(l)),[...n,...t].slice(0,8)},[pe,g]),ht=ce(()=>{let e=pe.trim().toLowerCase();if(!e)return 0;let n=0;for(let t of g.list)(t.node.name.toLowerCase().includes(e)||t.node.task?.toLowerCase().includes(e))&&n++;return n},[pe,g]),vn=`${N}-results`,kn=e=>{e&&(We(!1),mn(e.node.id))},na=e=>{e.key==="ArrowDown"?(e.preventDefault(),We(!0),gt(n=>Math.min(Me.length-1,n+1))):e.key==="ArrowUp"?(e.preventDefault(),gt(n=>Math.max(0,n-1))):e.key==="Enter"?(e.preventDefault(),kn(Me[rt]??Me[0])):e.key==="Escape"&&(e.preventDefault(),mt&&pe?We(!1):(wn(""),ee(null)))},bt=g.waiting.indexOf(G),Kt=e=>{let n=g.waiting;if(!n.length)return;let t;if(bt>=0)t=(bt+e+n.length)%n.length;else{let i=g.list.findIndex(l=>l.node.id===G),s=n.findIndex(l=>g.list.findIndex(c=>c.node.id===l)>i);t=e===1?s<0?0:s:s<=0?n.length-1:s-1}mn(n[t])},fe=g.root,yn=[...wt(g,Q),Q],$=g.byId.get(G)??fe,Ke=Le.lod,aa=ce(()=>{if(!U)return[];let e=[];if(Ke!=="far")for(let n of U.items)n.x+n.w<Le.x0||n.x>Le.x1||n.y+n.h<Le.y0||n.y>Le.y1||e.push(n);for(let n of[G,Ye]){if(!n)continue;let t=U.pos.get(n);t!==void 0&&!e.includes(U.items[t])&&e.push(U.items[t])}return e},[U,Le,Ke,G,Ye]),ra=ce(()=>{if(!he)return[];let e=d,n=Math.max(0,Math.floor(Wt/Ce)-6),t=Math.min(he.length,Math.ceil((Wt+e)/Ce)+6),i=he.slice(n,t).map((l,c)=>({r:l,i:n+c})),s=Qe.get(G);return s!==void 0&&(s<n||s>=t)&&i.push({r:he[s],i:s}),i},[he,Wt,d,Qe,G]),ia=!a.children?.length,sa=Math.round(fe.c.done/Math.max(1,fe.agents)*100);return u("div",{ref:Ze,className:`ui-ats${b?` ${b}`:""}`,"data-narrow":_e?"":void 0,"data-mode":D,children:[r("style",{href:"ui-agent-tree-scale",precedence:"default",children:Ta}),u("header",{className:"ui-ats__head",children:[u("div",{className:"ui-ats__titlebar",children:[r("span",{className:"ui-ats__mark","aria-hidden":"true",children:r(jt,{})}),r("h2",{className:"ui-ats__title",id:`${N}-title`,children:k}),u("dl",{className:"ui-ats__totals","aria-label":"Totals",children:[u("div",{children:[r("dt",{children:"Agents"}),r("dd",{children:A.format(fe.agents)})]}),u("div",{"data-s":"running",children:[r("dt",{children:"Running"}),r("dd",{children:A.format(fe.c.running)})]}),u("div",{"data-s":"waiting",children:[r("dt",{children:"Needs you"}),r("dd",{children:A.format(fe.c.waiting)})]}),u("div",{"data-s":"failed",children:[r("dt",{children:"Failed"}),r("dd",{children:A.format(fe.c.failed)})]}),u("div",{children:[r("dt",{children:"Done"}),u("dd",{children:[sa,"%"]})]}),u("div",{children:[r("dt",{children:"Cost"}),r("dd",{className:"ui-ats__total","data-climbing":_&&!y?"":void 0,children:x(fe.cost)})]})]})]}),u("div",{className:"ui-ats__tools",children:[u("div",{className:"ui-ats__search",role:"search",children:[r(Ea,{}),r("input",{ref:Tt,type:"search",className:"ui-ats__field",placeholder:"Find an agent or team","aria-label":"Find an agent or team",role:"combobox","aria-expanded":mt&&!!pe.trim(),"aria-controls":vn,"aria-autocomplete":"list","aria-activedescendant":mt&&Me[rt]?`${N}-opt-${rt}`:void 0,value:pe,onChange:e=>{wn(e.target.value),gt(0),We(!0)},onFocus:()=>pe&&We(!0),onBlur:()=>window.setTimeout(()=>We(!1),120),onKeyDown:na}),r("kbd",{className:"ui-ats__kbd","aria-hidden":"true",children:"/"}),mt&&pe.trim()?u("div",{className:"ui-ats__results ui-ats__overlay",children:[r("ul",{id:vn,role:"listbox","aria-label":"Matches",children:Me.map((e,n)=>{let t=wt(g,e.node.id).slice(1).map(i=>g.byId.get(i)?.node.name).join(" \u203A ");return u("li",{id:`${N}-opt-${n}`,role:"option","aria-selected":n===rt,"data-active":n===rt?"":void 0,onPointerDown:i=>i.preventDefault(),onClick:()=>kn(e),onPointerEnter:()=>gt(n),children:[r("span",{className:"ui-ats__pebble","data-kind":F(e.node)?e.node.kind:void 0,"data-s":F(e.node)?void 0:e.node.status,children:F(e.node)?r(St,{kind:e.node.kind}):r(Mt,{status:e.node.status})}),u("span",{className:"ui-ats__id",children:[r("span",{className:"ui-ats__name",children:e.node.name}),u("span",{className:"ui-ats__sub",children:[F(e.node)?`${yt[e.node.kind]} \xB7 ${A.format(e.agents)} agents`:Ee[e.node.status],t?` \xB7 ${t}`:""]})]})]},e.node.id)})}),r("p",{className:"ui-ats__rhint",children:Me.length?ht>Me.length?`${A.format(ht)} matches \xB7 showing the first ${Me.length}`:`${A.format(ht)} ${ht===1?"match":"matches"} \xB7 Enter to go`:`Nothing called \u201C${pe.trim()}\u201D`})]}):null]}),r("div",{className:"ui-ats__chips",role:"group","aria-label":"Show",children:pa.map(e=>{let n=e.id==="all"?fe.agents:fe.c[e.id];return u("button",{type:"button",className:"ui-ats__chip","data-s":e.id,"aria-pressed":q===e.id,onClick:()=>ue(e.id),children:[e.label,r("span",{className:"ui-ats__chipn",children:A.format(n)})]},e.id)})}),u("div",{className:"ui-ats__queue",role:"group","aria-label":"Agents that need you",children:[r("button",{type:"button",className:"ui-ats__ghost","aria-label":"Previous agent that needs you",disabled:!g.waiting.length,onClick:()=>Kt(-1),children:r(zn,{dir:"prev"})}),r("button",{type:"button",className:"ui-ats__primary",disabled:!g.waiting.length,onClick:()=>Kt(1),children:g.waiting.length?u(st,{children:["Needs you ",r("span",{className:"ui-ats__qn",children:bt>=0?`${bt+1}/${A.format(g.waiting.length)}`:A.format(g.waiting.length)})]}):"Nobody needs you"}),r("button",{type:"button",className:"ui-ats__ghost","aria-label":"Next agent that needs you",disabled:!g.waiting.length,onClick:()=>Kt(1),children:r(zn,{dir:"next"})})]}),u("div",{className:"ui-ats__seg",role:"group","aria-label":"View",children:[r("button",{type:"button","aria-pressed":D==="map",onClick:()=>Z("map"),children:"Map"}),r("button",{type:"button","aria-pressed":D==="list",onClick:()=>Z("list"),children:"List"})]})]})]}),u("div",{className:"ui-ats__panel",style:{height:d},children:[r("nav",{className:"ui-ats__crumbs ui-ats__overlay","aria-label":"Branch",children:r("ol",{children:yn.map((e,n)=>{let t=g.byId.get(e);if(!t)return null;let i=n===yn.length-1;return u("li",{children:[n?r("span",{className:"ui-ats__sep","aria-hidden":"true",children:"\u203A"}):null,r("button",{type:"button","aria-current":i?"location":void 0,onClick:()=>i&&D==="map"?zt(e):ye(e),children:t.node.name})]},e)})})}),ia?u("div",{className:"ui-ats__empty",children:[r("span",{className:"ui-ats__pebble","data-kind":"root",children:r(jt,{})}),r("p",{children:"No agents yet. Teams show here as soon as a chief of staff starts them."})]}):D==="map"?u("div",{ref:ge,className:"ui-ats__view",onPointerDown:ea,onPointerMove:ta,onPointerUp:bn,onPointerCancel:bn,onClickCapture:e=>{at.current&&(e.stopPropagation(),e.preventDefault())},onScroll:e=>{e.currentTarget.scrollTop=0,e.currentTarget.scrollLeft=0},children:[r("canvas",{ref:Zt,className:"ui-ats__canvas","aria-hidden":"true"}),r("div",{ref:Ct,className:"ui-ats__world",role:"tree","aria-labelledby":`${N}-title`,"aria-describedby":`${N}-help`,onKeyDown:hn,"data-lod":Ke,children:aa.map(e=>r(Ra,{it:e,lod:Ke==="far"?"far":Ke,sel:e.id===G,tab:e.id===gn,hit:e.id===Ye,pulse:Jt.pulse.has(e.id),fresh:Jt.fresh.has(e.id),focus:e.id===Q&&Q!==a.id,now:Ke==="full"&&(e.e.c.running>0||F(e.e.node))?E:0,filter:q,fmt:x,act:Pt},e.id))}),u("div",{className:"ui-ats__controls ui-ats__overlay",role:"group","aria-label":"Zoom",children:[r("button",{type:"button","aria-label":"Zoom out",onClick:()=>Oe(V.current.w/2,V.current.h/2,.8,150),children:"\u2212"}),r("span",{ref:Rt,className:"ui-ats__zoom","aria-hidden":"true",children:"100%"}),r("button",{type:"button","aria-label":"Zoom in",onClick:()=>Oe(V.current.w/2,V.current.h/2,1.25,150),children:"+"}),r("button",{type:"button",className:"ui-ats__textbtn",onClick:pt,children:"Fit"}),r("span",{className:"ui-ats__vsep","aria-hidden":"true"}),r("button",{type:"button",className:"ui-ats__textbtn","data-extra":"",onClick:()=>{let e=new Set;for(let n of g.list)n.node.children?.length&&e.add(n.node.id);z(e)},children:"Open all"}),r("button",{type:"button",className:"ui-ats__textbtn","data-extra":"",onClick:()=>{z(vt(g,a.id,In)),I(a.id),Je.current={kind:"subtree",id:a.id}},children:"Summaries"})]}),_e?null:r("canvas",{ref:Et,className:"ui-ats__mini ui-ats__overlay","aria-hidden":"true",onPointerDown:xn,onPointerMove:xn})]}):r("div",{ref:At,className:"ui-ats__list",role:"tree","aria-labelledby":`${N}-title`,"aria-describedby":`${N}-help`,onKeyDown:hn,onScroll:e=>_n(e.currentTarget.scrollTop),children:r("div",{className:"ui-ats__lspace",style:{height:(he?.length??0)*Ce},children:ra.map(({r:e,i:n})=>r(Aa,{r:e,top:n*Ce,sel:e.id===G,tab:e.id===gn,hit:e.id===Ye,isFocus:e.id===Q,fmt:x,act:Pt},e.id))})})]}),u("footer",{className:"ui-ats__foot",children:[u("div",{className:"ui-ats__inspect","aria-live":"off",children:[r("span",{className:"ui-ats__pebble","data-kind":F($.node)?$.node.kind:void 0,"data-s":F($.node)?void 0:$.node.status,children:F($.node)?r(St,{kind:$.node.kind}):r(Mt,{status:$.node.status})}),u("div",{className:"ui-ats__id",children:[u("span",{className:"ui-ats__name",children:[$.node.name,r("span",{className:"ui-ats__pill","data-s":Ge($),children:F($.node)?$.c.waiting?`${A.format($.c.waiting)} need you`:Ee[Ge($)]:Ee[$.node.status]})]}),u("span",{className:"ui-ats__sub",children:[yt[$.node.kind],$.node.model?` \xB7 ${$.node.model}`:"",F($.node)?` \xB7 ${A.format($.agents)} agents \xB7 ${Math.round($.c.done/Math.max(1,$.agents)*100)}% done`:"",` \xB7 ${x($.cost)}`,$.started!==void 0?` \xB7 ${On(($.node.endedAt??E)-$.started)}`:""]}),$.node.task?r("span",{className:"ui-ats__itask",children:$.node.task}):null]}),F($.node)&&$.node.children?.length?r("button",{type:"button",className:"ui-ats__secondary",onClick:()=>ye($.node.id),children:"Focus branch"}):null]}),u("p",{className:"ui-ats__help",id:`${N}-help`,children:[u("span",{children:[r("kbd",{className:"ui-ats__kbd",children:"/"})," Find"]}),u("span",{children:[r("kbd",{className:"ui-ats__kbd",children:"\u2191"}),r("kbd",{className:"ui-ats__kbd",children:"\u2193"})," Move"]}),u("span",{children:[r("kbd",{className:"ui-ats__kbd",children:"\u2190"}),r("kbd",{className:"ui-ats__kbd",children:"\u2192"})," Close, open"]}),u("span",{children:[r("kbd",{className:"ui-ats__kbd",children:"Enter"})," Focus"]}),u("span",{children:[r("kbd",{className:"ui-ats__kbd",children:"Esc"})," Up a level"]}),D==="map"?r("span",{children:"Drag to move \xB7 Ctrl + scroll or pinch to zoom"}):null]})]}),r("p",{className:"ui-ats__sr","aria-live":"polite",role:"status",children:Un})]})}var Ta=`
.ui-ats {
  --frame: #f2f6fa; --panel: #ffffff; --soft: rgba(26, 62, 112, 0.06);
  --line: #dae2ec; --line-firm: #cbd6e4;
  --ink: #00162b; --text: rgba(0, 22, 43, 0.66); --muted: rgba(0, 22, 43, 0.54);
  --berry: #851437; --berry-hover: #6d0f2d;
  --info-ink: #1a3e70; --info-fill: #eef5ff; --info-line: #c1daff; --ring: #8fbdf2;
  --ok-ink: #1d6a34; --ok-fill: #eafbee; --ok-line: #c9f5cf;
  --wait-ink: #775810; --wait-fill: #fdf6dd; --wait-line: #fae6a0;
  --bad-ink: #8a3a22; --bad-fill: #fdeee8; --bad-line: #f5d5c9;
  --ground: #eaeff6; --grid: rgba(26, 62, 112, 0.07);
  --flow: #3f7fd0; --link: #b9c8db;
  --dot-run: #4b86d1; --dot-wait: #d9a514; --dot-fail: #c4573a; --dot-done: #3f9a5c; --dot-idle: #cbd6e4;
  --tile: #ffffff; --secondary: #fbfcfe; --shine: #6f9fe0; --mark: #2f6fc4;
  --pebble-shade: inset 0 -2px 6px -4px rgba(26, 62, 112, 0.4);
  --drop: 0 8px 16px -8px rgba(26, 62, 112, 0.2);
  --raised: 0 18px 30px -16px rgba(26, 62, 112, 0.38), 0 4px 10px -6px rgba(26, 62, 112, 0.18);
  --float: 0 24px 48px -24px rgba(26, 62, 112, 0.3);
  --ease: cubic-bezier(.16, 1, .3, 1);
  box-sizing: border-box;
  position: relative;
  width: 100%;
  max-width: 1280px;
  min-width: 0;
  contain: inline-size;
  padding: 6px;
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
:where(.dark, [data-theme="dark"]) .ui-ats {
  --frame: #0f2747; --panel: #16345c; --soft: rgba(255, 255, 255, 0.07);
  --line: rgba(255, 255, 255, 0.12); --line-firm: rgba(255, 255, 255, 0.18);
  --ink: rgba(255, 255, 255, 0.94); --text: rgba(255, 255, 255, 0.72); --muted: rgba(255, 255, 255, 0.56);
  --berry: #a8204d; --berry-hover: #bd2a5a;
  --info-ink: #c1daff; --info-fill: rgba(143, 189, 242, 0.16); --info-line: rgba(143, 189, 242, 0.34); --ring: rgba(143, 189, 242, 0.6);
  --ok-ink: #7fe0a0; --ok-fill: rgba(127, 224, 160, 0.14); --ok-line: rgba(127, 224, 160, 0.3);
  --wait-ink: #f3d27a; --wait-fill: rgba(243, 210, 122, 0.14); --wait-line: rgba(243, 210, 122, 0.3);
  --bad-ink: #f2a48c; --bad-fill: rgba(242, 164, 140, 0.14); --bad-line: rgba(242, 164, 140, 0.3);
  --ground: #0b213f; --grid: rgba(255, 255, 255, 0.05);
  --flow: #8fbdf2; --link: rgba(255, 255, 255, 0.2);
  --dot-run: #7fb0ee; --dot-wait: #f3d27a; --dot-fail: #f2a48c; --dot-done: #7fe0a0; --dot-idle: rgba(255, 255, 255, 0.22);
  --tile: #ffffff; --secondary: rgba(255, 255, 255, 0.06); --shine: #8fbdf2; --mark: #8fbdf2;
  --pebble-shade: inset 0 -2px 6px -4px rgba(3, 12, 28, 0.8);
  --drop: 0 8px 16px -8px rgba(3, 12, 28, 0.6);
  --raised: 0 18px 30px -16px rgba(3, 12, 28, 0.8), 0 4px 10px -6px rgba(3, 12, 28, 0.6);
  --float: 0 24px 48px -24px rgba(3, 12, 28, 0.7);
}
.ui-ats *, .ui-ats *::before, .ui-ats *::after { box-sizing: border-box; }
.ui-ats :where(button) { font: inherit; color: inherit; cursor: pointer; }
.ui-ats :where(button:disabled) { cursor: default; }
.ui-ats :focus-visible { outline: none; box-shadow: 0 0 0 3px var(--ring); }
.ui-ats__sr { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }

/* header */
.ui-ats__head { position: relative; z-index: 10; padding: 8px 8px 12px; display: flex; flex-direction: column; gap: 10px; }
.ui-ats__titlebar { display: flex; align-items: center; flex-wrap: wrap; gap: 6px 10px; padding: 2px 4px 0; }
.ui-ats__mark { display: inline-flex; color: var(--mark); }
.ui-ats__title {
  margin: 0; color: var(--ink); font-size: 18px; font-weight: 700; letter-spacing: 0;
  font-family: "Avenir Next Condensed", "Avenir Next", Avenir, system-ui, sans-serif;
}
.ui-ats__totals { margin: 0 0 0 auto; display: flex; flex-wrap: wrap; gap: 4px 18px; font-variant-numeric: tabular-nums; }
.ui-ats__totals > div { display: flex; flex-direction: column; align-items: flex-end; min-width: 0; }
.ui-ats__totals dt { font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.09em; color: var(--muted); font-weight: 600; }
.ui-ats__totals dd { margin: 0; color: var(--ink); font-size: 15px; font-weight: 700; transition: color 300ms var(--ease); }
.ui-ats__totals [data-s="running"] dd { color: var(--info-ink); }
.ui-ats__totals [data-s="waiting"] dd { color: var(--wait-ink); }
.ui-ats__totals [data-s="failed"] dd { color: var(--bad-ink); }
.ui-ats__total[data-climbing] {
  background: linear-gradient(100deg, var(--ink) 40%, var(--shine) 50%, var(--ink) 60%) 0 0 / 250% 100%;
  -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
  animation: ui-ats-shimmer 2.2s linear infinite;
}
@keyframes ui-ats-shimmer { from { background-position: 100% 0; } to { background-position: -150% 0; } }

.ui-ats__tools { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
.ui-ats__search { position: relative; flex: 1 1 220px; min-width: 0; max-width: 340px; display: flex; align-items: center; color: var(--muted); }
.ui-ats__search > svg { position: absolute; left: 11px; pointer-events: none; }
.ui-ats__search > .ui-ats__kbd { position: absolute; right: 9px; pointer-events: none; }
.ui-ats__field {
  width: 100%; height: 36px; padding: 0 32px 0 32px; border-radius: 10px; border: 1px solid var(--line-firm);
  background: var(--panel); color: var(--ink); font: inherit; font-size: 14px; caret-color: var(--berry);
  box-shadow: inset 0 1px 2px rgba(26, 62, 112, 0.08); -webkit-appearance: none; appearance: none;
}
.ui-ats__field::placeholder { color: var(--muted); }
.ui-ats__field::-webkit-search-cancel-button { display: none; }
.ui-ats__field:focus-visible { box-shadow: 0 0 0 3px var(--ring); border-color: var(--info-line); }
.ui-ats__kbd {
  display: inline-grid; place-items: center; min-width: 20px; height: 20px; padding: 0 5px; border-radius: 6px;
  background: var(--tile); border: 1px solid var(--line); border-bottom-width: 2px; color: #1a3e70;
  font: 600 11px/1 "Avenir Next", Avenir, system-ui, sans-serif;
}
.ui-ats__results {
  position: absolute; left: 0; right: 0; top: calc(100% + 6px); z-index: 20; min-width: 280px;
  padding: 6px; border-radius: 14px; background: var(--panel); border: 1px solid var(--line); box-shadow: var(--float), var(--drop);
  animation: ui-ats-in 150ms var(--ease) both;
}
.ui-ats__results ul { list-style: none; margin: 0; padding: 0; max-height: 320px; overflow: auto; }
.ui-ats__results li { position: relative; display: flex; align-items: center; gap: 8px; padding: 7px 8px; border-radius: 9px; cursor: pointer; }
.ui-ats__results li[data-active] { background: var(--info-fill); }
.ui-ats__results li[data-active]::before { content: ""; position: absolute; left: 0; top: 8px; bottom: 8px; width: 2px; border-radius: 2px; background: var(--berry); }
.ui-ats__rhint { margin: 4px 8px 2px; font-size: 12px; color: var(--muted); }
@keyframes ui-ats-in { from { opacity: 0; transform: translateY(-4px); } }

.ui-ats__chips { display: flex; gap: 4px; flex-wrap: wrap; }
.ui-ats__chip {
  display: inline-flex; align-items: center; gap: 6px; height: 30px; padding: 0 10px; border-radius: 999px;
  background: var(--secondary); border: 1px solid var(--line); color: var(--text); font-size: 12.5px; font-weight: 600; white-space: nowrap;
  transition: background-color 150ms var(--ease), border-color 150ms var(--ease), color 150ms var(--ease);
}
.ui-ats__chip:hover { border-color: var(--line-firm); }
.ui-ats__chipn { font-variant-numeric: tabular-nums; color: var(--muted); font-weight: 600; }
.ui-ats__chip[aria-pressed="true"] { background: var(--info-fill); border-color: var(--info-line); color: var(--info-ink); }
.ui-ats__chip[aria-pressed="true"][data-s="waiting"] { background: var(--wait-fill); border-color: var(--wait-line); color: var(--wait-ink); }
.ui-ats__chip[aria-pressed="true"][data-s="failed"] { background: var(--bad-fill); border-color: var(--bad-line); color: var(--bad-ink); }
.ui-ats__chip[aria-pressed="true"][data-s="done"] { background: var(--ok-fill); border-color: var(--ok-line); color: var(--ok-ink); }
.ui-ats__chip[aria-pressed="true"] .ui-ats__chipn { color: inherit; }

.ui-ats__queue { display: inline-flex; align-items: center; gap: 2px; margin-left: auto; }
.ui-ats__primary {
  display: inline-flex; align-items: center; gap: 8px; height: 34px; padding: 0 14px; border-radius: 10px; border: 0;
  background: var(--berry); color: #fff !important; font-weight: 600; font-size: 13.5px; white-space: nowrap;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 6px 12px -6px rgba(133, 20, 55, 0.6);
  transition: background-color 150ms var(--ease);
}
.ui-ats__primary:hover:not(:disabled) { background: var(--berry-hover); }
.ui-ats__primary:disabled { background: var(--ok-fill); color: var(--ok-ink) !important; box-shadow: inset 0 0 0 1px var(--ok-line); }
.ui-ats__qn { font-variant-numeric: tabular-nums; padding: 1px 7px; border-radius: 999px; background: rgba(255, 255, 255, 0.18); font-size: 12px; }
.ui-ats__ghost {
  display: inline-grid; place-items: center; width: 30px; height: 30px; border: 0; border-radius: 9px; background: transparent; color: var(--ink);
  transition: background-color 150ms var(--ease);
}
.ui-ats__ghost:hover:not(:disabled) { background: var(--soft); }
.ui-ats__ghost:disabled { opacity: 0.4; }
.ui-ats__seg { display: inline-flex; padding: 2px; border-radius: 10px; background: var(--soft); border: 1px solid var(--line); }
.ui-ats__seg button { height: 28px; padding: 0 12px; border: 0; border-radius: 8px; background: transparent; color: var(--muted); font-weight: 600; font-size: 12.5px; }
.ui-ats__seg button[aria-pressed="true"] { background: var(--panel); color: var(--ink); box-shadow: 0 0 0 1px var(--line), var(--drop); }

/* panel */
.ui-ats__panel {
  position: relative; overflow: hidden; border-radius: 16px; background: var(--ground);
  border: 1px solid var(--line); box-shadow: var(--raised);
}
.ui-ats__view {
  position: absolute; inset: 0; overflow: hidden; touch-action: none; cursor: grab; user-select: none; -webkit-user-select: none;
  background-image: linear-gradient(var(--grid) 1px, transparent 1px), linear-gradient(90deg, var(--grid) 1px, transparent 1px);
}
.ui-ats__view[data-dragging] { cursor: grabbing; }
.ui-ats__canvas { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
.ui-ats__world { position: absolute; left: 0; top: 0; width: 0; height: 0; transform-origin: 0 0; will-change: transform; }
.ui-ats__overlay { z-index: 5; }

.ui-ats__crumbs {
  position: absolute; left: 10px; top: 10px; right: 10px; pointer-events: none; display: flex;
}
.ui-ats__crumbs ol {
  pointer-events: auto; display: flex; align-items: center; gap: 2px; list-style: none; margin: 0; padding: 3px; max-width: 100%;
  overflow-x: auto; scrollbar-width: none; border-radius: 12px; background: var(--panel); border: 1px solid var(--line); box-shadow: var(--drop);
}
.ui-ats__crumbs li { display: flex; align-items: center; gap: 2px; flex: none; }
.ui-ats__crumbs button {
  border: 0; background: transparent; padding: 4px 8px; border-radius: 8px; font-size: 12.5px; font-weight: 600; color: var(--muted);
  white-space: nowrap; max-width: 200px; overflow: hidden; text-overflow: ellipsis;
}
.ui-ats__crumbs button:hover { background: var(--soft); color: var(--ink); }
.ui-ats__crumbs button[aria-current] { color: var(--info-ink); background: var(--info-fill); }
.ui-ats__sep { color: var(--muted); font-size: 12px; }

.ui-ats__controls {
  position: absolute; left: 10px; bottom: 10px; display: flex; align-items: center; gap: 2px; padding: 3px;
  border-radius: 12px; background: var(--panel); border: 1px solid var(--line); box-shadow: var(--drop);
}
.ui-ats__controls button {
  min-width: 28px; height: 28px; padding: 0 6px; border: 0; border-radius: 8px; background: transparent; color: var(--ink);
  font-size: 16px; font-weight: 600; transition: background-color 150ms var(--ease);
}
.ui-ats__controls button:hover { background: var(--soft); }
.ui-ats__controls .ui-ats__textbtn { font-size: 12.5px; padding: 0 8px; }
.ui-ats__zoom { min-width: 42px; text-align: center; font-size: 12px; font-variant-numeric: tabular-nums; color: var(--muted); font-weight: 600; }
.ui-ats__vsep { width: 1px; height: 18px; background: var(--line); margin: 0 2px; }
.ui-ats__mini {
  position: absolute; right: 10px; bottom: 10px; width: 176px; height: 112px; border-radius: 12px; cursor: crosshair; touch-action: none;
  background: var(--panel); border: 1px solid var(--line); box-shadow: var(--drop);
}

/* nodes */
.ui-ats__node {
  position: absolute; left: 0; top: 0; display: flex; flex-direction: column; border-radius: 18px; cursor: pointer;
  background: var(--frame); border: 1px solid var(--line); box-shadow: var(--drop);
  transition: border-color 150ms var(--ease), box-shadow 150ms var(--ease);
}
.ui-ats__node[data-kind="agent"] { background: transparent; border: 0; box-shadow: none; }
.ui-ats__node:focus-visible { box-shadow: 0 0 0 3px var(--ring), var(--drop); }
.ui-ats__node[data-selected] { border-color: var(--info-line); box-shadow: 0 0 0 3px var(--info-fill), 0 0 0 4px var(--info-line), var(--drop); }
.ui-ats__node[data-selected]:focus-visible { box-shadow: 0 0 0 3px var(--ring), var(--drop); }
.ui-ats__node[data-selected]::before {
  content: ""; position: absolute; left: -1px; top: 18px; bottom: 18px; width: 3px; border-radius: 0 3px 3px 0; background: var(--berry); z-index: 2;
}
.ui-ats__node[data-hit] { animation: ui-ats-hit 1.6s var(--ease) 2; }
@keyframes ui-ats-hit { 0%, 100% { box-shadow: 0 0 0 3px var(--info-fill), 0 0 0 4px var(--info-line), var(--drop); } 50% { box-shadow: 0 0 0 10px var(--info-fill), 0 0 0 11px var(--info-line), var(--drop); } }
.ui-ats__node[data-fresh] > * { animation: ui-ats-rise 420ms var(--ease) both; }
@keyframes ui-ats-rise { from { opacity: 0; transform: translateY(10px); } }
.ui-ats__node[data-lod="far"] { background: transparent; border: 0; box-shadow: 0 0 0 3px var(--ring); }

.ui-ats__card {
  position: relative; flex: 1; min-height: 0; margin: -1px -1px 0; padding: 10px 10px 8px; border-radius: 14px;
  display: flex; flex-direction: column; gap: 8px; overflow: hidden;
  background: var(--panel); border: 1px solid var(--line); box-shadow: var(--raised);
  transition: border-color 150ms var(--ease);
}
.ui-ats__node:hover > .ui-ats__card { border-color: var(--line-firm); }
.ui-ats__card--agent { margin: 0; border-radius: 14px; }
.ui-ats__node[data-kind="agent"][data-tone="waiting"] > .ui-ats__card { border-color: var(--wait-line); }
.ui-ats__node[data-kind="agent"][data-tone="failed"] > .ui-ats__card { border-color: var(--bad-line); }
.ui-ats__node[data-kind="agent"][data-tone="idle"] > .ui-ats__card,
.ui-ats__node[data-kind="agent"][data-tone="done"] > .ui-ats__card { box-shadow: var(--drop); }
.ui-ats__rail { position: absolute; left: 0; top: 12px; bottom: 12px; width: 3px; border-radius: 0 3px 3px 0; background: var(--berry); }
.ui-ats__row { display: flex; align-items: center; gap: 8px; min-width: 0; }
.ui-ats__pebble {
  flex: none; width: 28px; height: 28px; display: grid; place-items: center; border-radius: 9px;
  background: var(--tile); border: 1px solid var(--line); box-shadow: var(--pebble-shade); color: #1a3e70;
  transition: color 300ms var(--ease);
}
.ui-ats__pebble[data-kind="root"] { color: #851437; }
.ui-ats__pebble[data-kind="team"] { color: #2f6fc4; }
.ui-ats__pebble[data-s="running"] { color: #2f6fc4; }
.ui-ats__pebble[data-s="waiting"] { color: #8a6514; }
.ui-ats__pebble[data-s="failed"] { color: #a8442a; }
.ui-ats__pebble[data-s="done"] { color: #1d6a34; }
.ui-ats__pebble[data-s="idle"] { color: rgba(0, 22, 43, 0.5); }
.ui-ats__id { min-width: 0; flex: 1; display: flex; flex-direction: column; }
.ui-ats__name { color: var(--ink); font-weight: 700; font-size: 14px; line-height: 1.25; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; display: flex; align-items: center; gap: 8px; }
.ui-ats__sub { font-size: 12px; color: var(--muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ui-ats__pill {
  flex: none; display: inline-flex; align-items: center; gap: 4px; height: 22px; padding: 0 8px; border-radius: 999px;
  background: var(--soft); border: 1px solid var(--line); color: var(--muted); font-size: 11.5px; font-weight: 600; white-space: nowrap;
  font-variant-numeric: tabular-nums;
  transition: background-color 300ms var(--ease), color 300ms var(--ease), border-color 300ms var(--ease);
}
.ui-ats__pill[data-s="running"] { background: var(--info-fill); border-color: var(--info-line); color: var(--info-ink); }
.ui-ats__pill[data-s="done"] { background: var(--ok-fill); border-color: var(--ok-line); color: var(--ok-ink); }
.ui-ats__pill[data-s="waiting"] { background: var(--wait-fill); border-color: var(--wait-line); color: var(--wait-ink); }
.ui-ats__pill[data-s="failed"] { background: var(--bad-fill); border-color: var(--bad-line); color: var(--bad-ink); }
.ui-ats__pill[data-pop] { animation: ui-ats-pop 300ms var(--ease); }
@keyframes ui-ats-pop { 40% { transform: scale(1.12); } }
.ui-ats__chev {
  flex: none; display: grid; place-items: center; width: 24px; height: 24px; border: 0; border-radius: 7px; background: transparent; color: var(--muted);
  transform: rotate(-90deg); transition: transform 150ms var(--ease), background-color 150ms var(--ease);
}
.ui-ats__chev:hover { background: var(--soft); color: var(--ink); }
.ui-ats__chev[data-open] { transform: rotate(90deg); }
.ui-ats__lrow .ui-ats__chev[data-open] { transform: none; }
.ui-ats__chev-gap { flex: none; width: 24px; }
.ui-ats__spin { animation: ui-ats-spin 900ms linear infinite; }
@keyframes ui-ats-spin { to { transform: rotate(360deg); } }

.ui-ats__bar { display: flex; height: 6px; border-radius: 999px; overflow: hidden; background: var(--soft); box-shadow: inset 0 0 0 1px var(--line); flex: none; }
.ui-ats__bar[data-thick] { height: 16px; }
.ui-ats__bar > span { height: 100%; transition: width 300ms var(--ease); }
.ui-ats__bar > [data-s="running"], .ui-ats__dots > [data-s="running"] { background: var(--dot-run); }
.ui-ats__bar > [data-s="waiting"], .ui-ats__dots > [data-s="waiting"] { background: var(--dot-wait); }
.ui-ats__bar > [data-s="failed"], .ui-ats__dots > [data-s="failed"] { background: var(--dot-fail); }
.ui-ats__bar > [data-s="done"], .ui-ats__dots > [data-s="done"] { background: var(--dot-done); }
.ui-ats__bar > [data-s="idle"], .ui-ats__dots > [data-s="idle"] { background: var(--dot-idle); }
.ui-ats__counts { display: flex; flex-wrap: wrap; gap: 2px 10px; font-size: 12px; color: var(--muted); font-variant-numeric: tabular-nums; }
.ui-ats__counts b { color: var(--ink); font-weight: 700; }
.ui-ats__counts [data-s="running"] b { color: var(--info-ink); }
.ui-ats__counts [data-s="waiting"] b { color: var(--wait-ink); }
.ui-ats__counts [data-s="failed"] b { color: var(--bad-ink); }
.ui-ats__dots { display: flex; flex-wrap: wrap; gap: 4px; align-content: flex-start; padding: 2px 1px 0; }
.ui-ats__dots > span[data-s] {
  width: 10px; height: 10px; border-radius: 50%; box-shadow: inset 0 -1px 2px rgba(0, 22, 43, 0.22);
  transition: background-color 300ms var(--ease);
}
.ui-ats__dots > [data-s="waiting"] { box-shadow: 0 0 0 2px var(--wait-fill), inset 0 -1px 2px rgba(0, 22, 43, 0.22); }
.ui-ats__more, .ui-ats__none { font-size: 11px; line-height: 10px; color: var(--muted); font-weight: 600; padding-left: 2px; }
.ui-ats__task {
  margin: 0; font-size: 12.5px; line-height: 1.35; color: var(--text); overflow: hidden;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
}
.ui-ats__meta { margin-top: auto; display: flex; justify-content: space-between; gap: 8px; font-size: 12px; color: var(--muted); font-variant-numeric: tabular-nums; }
.ui-ats__cost { color: var(--ink); font-weight: 600; font-variant-numeric: tabular-nums; }
.ui-ats__nfoot {
  flex: none; height: 30px; display: flex; align-items: center; gap: 10px; padding: 0 10px; font-size: 12px; color: var(--muted);
  font-variant-numeric: tabular-nums; white-space: nowrap; overflow: hidden;
}
.ui-ats__nfoot > :last-child:not(:first-child) { margin-left: auto; }

.ui-ats__card--lite { justify-content: center; gap: 6px; padding: 10px 16px; }
.ui-ats__card--lite > .ui-ats__bar { margin: 4px 0; }
.ui-ats__node[data-kind="agent"] .ui-ats__card--lite { margin: 0; }
.ui-ats__lname {
  color: var(--ink); font-weight: 700; font-size: 32px; line-height: 1.1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  font-family: "Avenir Next Condensed", "Avenir Next", Avenir, system-ui, sans-serif;
}
.ui-ats__lcount { font-size: 21px; line-height: 1.15; font-weight: 600; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-variant-numeric: tabular-nums; }
.ui-ats__lcount[data-s="waiting"] { color: var(--wait-ink); }
.ui-ats__lcount[data-s="failed"] { color: var(--bad-ink); }
.ui-ats__lcount[data-s="running"] { color: var(--info-ink); }
.ui-ats__lcount[data-s="done"] { color: var(--ok-ink); }

/* list */
.ui-ats__list { position: absolute; inset: 0; overflow-y: auto; overflow-x: hidden; padding-top: 52px; overscroll-behavior: contain; }
.ui-ats__lspace { position: relative; }
.ui-ats__lrow {
  position: absolute; left: 6px; right: 6px; top: 0; height: ${Ce-6}px; display: flex; align-items: center; gap: 8px; padding-right: 10px;
  border-radius: 12px; background: var(--panel); border: 1px solid var(--line); box-shadow: var(--drop); cursor: pointer;
  transition: border-color 150ms var(--ease), background-color 150ms var(--ease);
}
.ui-ats__lrow:hover { border-color: var(--line-firm); }
.ui-ats__lrow[data-focus] { background: var(--frame); }
.ui-ats__lrow[data-selected] { background: var(--info-fill); border-color: var(--info-line); }
.ui-ats__lrow[data-selected]::before { content: ""; position: absolute; left: -1px; top: 12px; bottom: 12px; width: 2px; border-radius: 2px; background: var(--berry); }
.ui-ats__lrow[data-hit] { animation: ui-ats-hit 1.6s var(--ease) 2; }
.ui-ats__lside { flex: none; display: flex; flex-direction: column; align-items: flex-end; gap: 4px; width: 84px; font-size: 12px; }
.ui-ats__lside .ui-ats__bar { width: 100%; }

.ui-ats__empty { position: absolute; inset: 0; display: grid; place-content: center; justify-items: center; gap: 10px; padding: 24px; text-align: center; }
.ui-ats__empty p { margin: 0; max-width: 300px; color: var(--muted); }

/* footer */
.ui-ats__foot { padding: 8px 8px 4px; display: flex; flex-direction: column; gap: 8px; }
.ui-ats__inspect { display: flex; align-items: center; gap: 10px; min-height: 44px; padding: 0 4px; }
.ui-ats__inspect .ui-ats__name { font-size: 15px; font-family: "Avenir Next Condensed", "Avenir Next", Avenir, system-ui, sans-serif; }
.ui-ats__itask { font-size: 12.5px; color: var(--text); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ui-ats__secondary {
  flex: none; height: 32px; padding: 0 12px; border-radius: 10px; background: var(--secondary); border: 1px solid var(--line-firm);
  color: var(--ink); font-weight: 600; font-size: 13px; box-shadow: var(--drop); white-space: nowrap;
}
.ui-ats__secondary:hover { border-color: var(--info-line); }
.ui-ats__help { margin: 0; display: flex; flex-wrap: wrap; gap: 4px 14px; padding: 0 4px 2px; font-size: 12px; color: var(--muted); }
.ui-ats__help > span { display: inline-flex; align-items: center; gap: 4px; }

/* narrow screens */
.ui-ats[data-narrow] .ui-ats__totals { margin: 0; width: 100%; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px; }
.ui-ats[data-narrow] .ui-ats__totals > div { align-items: flex-start; padding: 6px 8px; border-radius: 10px; background: var(--panel); border: 1px solid var(--line); }
.ui-ats[data-narrow] .ui-ats__search { flex: 1 1 100%; max-width: none; }
.ui-ats[data-narrow] .ui-ats__chips { flex-wrap: nowrap; overflow-x: auto; scrollbar-width: none; width: 100%; padding-bottom: 2px; }
.ui-ats[data-narrow] .ui-ats__queue { margin-left: 0; }
.ui-ats[data-narrow] .ui-ats__help { display: none; }
.ui-ats[data-narrow] .ui-ats__controls .ui-ats__vsep,
.ui-ats[data-narrow] .ui-ats__controls [data-extra] { display: none; }
.ui-ats[data-narrow] .ui-ats__inspect { flex-wrap: wrap; }
.ui-ats[data-narrow] .ui-ats__inspect .ui-ats__id { flex-basis: calc(100% - 40px); }
.ui-ats[data-narrow] .ui-ats__lside { width: 64px; }

@media (prefers-reduced-motion: reduce) {
  .ui-ats *, .ui-ats *::before, .ui-ats *::after { animation-duration: 1ms !important; animation-iteration-count: 1 !important; transition-property: color, background-color, border-color !important; }
  .ui-ats__spin { animation: none !important; }
  .ui-ats__total[data-climbing] { animation: none; }
}
`;var jn=[{id:"team",label:"\u2248 60 agents",agents:60},{id:"org",label:"\u2248 1,200",agents:1200},{id:"fleet",label:"5,000",agents:5e3}],Gn=800,$a=8;function Ia(a){let o=a>>>0;return()=>{o=o+1831565813|0;let p=Math.imul(o^o>>>15,1|o);return p=p+Math.imul(p^p>>>7,61|p)^p,((p^p>>>14)>>>0)/4294967296}}var lt=["Research","Content","Engineering","Data","Growth","Design","Quality","Outreach","Pricing","Support","Legal","Ops"],Xe=["France","Germany","Spain","Italy","Benelux","Nordics","UK","Swiss","Iberia","Poland","Austria","Ireland"],Xt=["Researcher","Writer","Coder","Scraper","Analyst","Reviewer","Planner","Tester","Designer","Translator","Monitor","Editor"],ot=["Compare the prices of five competitors","Write the copy for the three plans","Build the page and wire up checkout","Summarise 120 reviews that mention price","Cluster the interview notes by theme","Draft the launch announcement","Check the numbers in the forecast sheet","Translate the help pages","Test the sign-up flow on phones","Read the changelog and list breaking changes","Answer the 40 oldest support tickets","Polish the onboarding e-mails"],Yt=["Sonnet 5.5","Sonnet 5.5","Haiku 5.5","Haiku 5.5","Opus 5.5","GPT-6 Sol","Gemini 3.8 Flash"];function La(a,o,p){let d=Ia(o),R=E=>E[Math.floor(d()*E.length)%E.length],v=0,h=[],x=[],k=(E,j,z,T={})=>{let I={id:`${E}-${++v}`,kind:E,name:j,status:"running",cost:0,rate:0,children:[],parent:z,v:1,snapV:0,...T};return z?.children.push(I),I},b=k("root","Chief of Staff",null,{model:"Opus 5.5",task:"Ship the spring launch in twelve markets",startedAt:p-47*6e4,cost:4.2}),N=a>=4e3?8:a>=1e3?6:2,y=a>=4e3?4:a>=1e3?3:0;for(let E=0;E<N;E++){let j=k("chief",`${Xe[E%Xe.length]} lead`,b,{model:"Opus 5.5",task:`Run the launch in ${Xe[E%Xe.length]}`,startedAt:p-(30+d()*15)*6e4,cost:.6+d()*2});y||x.push(j);for(let z=0;z<y;z++){let T=lt[(E*3+z)%lt.length],I=k("chief",`${T} chief`,j,{model:d()<.7?"Opus 5.5":"Sonnet 5.5",task:`Coordinate ${T.toLowerCase()} for ${Xe[E%Xe.length]}`,startedAt:p-(10+d()*25)*6e4,cost:.2+d()});if(a>=4e3&&d()<.35)for(let O=0;O<2;O++)x.push(k("chief",`${T} ${O?"B":"A"} chief`,I,{model:"Sonnet 5.5",task:`Split the ${T.toLowerCase()} work, part ${O+1}`,startedAt:p-(5+d()*20)*6e4,cost:.1+d()*.5}));else x.push(I)}}let g=a>=1e3?5:3,_=x.length*g,C=a/_;for(let E of x){let j=g-1+Math.floor(d()*3);for(let z=0;z<j;z++){let T=k("team",`${R(lt)} team ${z+1}`,E,{model:"Sonnet 5.5",startedAt:p-d()*30*6e4,cost:.05+d()*.2}),I=Math.max(3,Math.min(48,Math.round(C*(.45+d()*1.1))));for(let O=0;O<I;O++)h.push(re(T,O,p))}}function re(E,j,z){let T=d(),I=T<.34?"done":T<.74?"running":T<.975?"idle":T<.988?"waiting":"failed",O=z-d()*25*6e4;return k("agent",`${R(Xt)} ${j+1}`,E,{model:R(Yt),task:R(ot),status:I,startedAt:I==="idle"?void 0:O,endedAt:I==="done"||I==="failed"?O+d()*10*6e4:void 0,cost:I==="idle"?0:d()*.6,rate:8e-4+d()*.004})}return{root:b,agents:h,leafChiefs:x,rng:d,seq:v,spawned:0,cap:Math.ceil(a*.08)}}function Ut(a){for(let o=a;o;o=o.parent)o.v++}function Nt(a){if(a.snap&&a.snapV===a.v)return a.snap;let o=a.kind==="agent"?a.status:"running";return a.snap={id:a.id,kind:a.kind,name:a.name,model:a.model,status:o,cost:a.cost,startedAt:a.startedAt,endedAt:a.endedAt,task:a.task,children:a.children.length?a.children.map(Nt):a.kind==="agent"?void 0:[]},a.snapV=a.v,a.snap}function Da(a,o,p){let{rng:d}=a;for(let v of a.agents)v.status==="running"&&(v.cost+=v.rate*(Gn/1e3)*4,Ut(v));let R=Math.max(2,Math.round(a.agents.length*.006));for(let v=0;v<R;v++){let h=a.agents[Math.floor(d()*a.agents.length)],x=d(),k=h.status;k==="idle"?(h.status="running",h.startedAt=o,h.endedAt=void 0):k==="running"?x<.04?h.status="waiting":x<.06?(h.status="failed",h.endedAt=o):x<.7&&(h.status="done",h.endedAt=o):k==="waiting"?x<.25&&(h.status="running"):k==="failed"?x<.12&&(h.status="running",h.startedAt=o,h.endedAt=void 0):k==="done"&&x<.05&&(h.status="idle",h.startedAt=void 0,h.endedAt=void 0,h.task=ot[Math.floor(d()*ot.length)]),h.status!==k&&Ut(h)}if(p%$a===0&&a.spawned<a.cap&&a.leafChiefs.length){let v=a.leafChiefs[Math.floor(d()*a.leafChiefs.length)],h={id:`team-${++a.seq}`,kind:"team",name:`${lt[Math.floor(d()*lt.length)]} team ${v.children.length+1}`,model:"Sonnet 5.5",status:"running",cost:0,rate:0,startedAt:o,children:[],parent:v,v:1,snapV:0};v.children.push(h);let x=4+Math.floor(d()*10);for(let k=0;k<x;k++){let b={id:`agent-${++a.seq}`,kind:"agent",name:`${Xt[Math.floor(d()*Xt.length)]} ${k+1}`,model:Yt[Math.floor(d()*Yt.length)],task:ot[Math.floor(d()*ot.length)],status:k<2?"running":"idle",startedAt:k<2?o:void 0,cost:0,rate:.001+d()*.003,children:[],parent:h,v:1,snapV:0};h.children.push(b),a.agents.push(b)}a.spawned+=x,Ut(v)}}function za(){let[a,o]=W("org"),[p,d]=W(!0),R=jn.find(b=>b.id===a).agents,v=ce(()=>La(R,7+R,Date.now()),[R]),[h,x]=W(()=>Nt(v.root)),k=S(0);return ne(()=>{x(Nt(v.root)),k.current=0},[v]),ne(()=>{if(!p)return;let b=window.setInterval(()=>{k.current+=1,Da(v,Date.now(),k.current),x(Nt(v.root))},Gn);return()=>window.clearInterval(b)},[v,p]),u("div",{className:"ats-demo",children:[r("style",{children:Pa}),u("div",{className:"ats-demo__bar",role:"group","aria-label":"Demo",children:[r("span",{className:"ats-demo__label",children:"Size"}),r("div",{className:"ats-demo__seg",children:jn.map(b=>r("button",{type:"button","aria-pressed":a===b.id,onClick:()=>o(b.id),children:b.label},b.id))}),r("button",{type:"button",className:"ats-demo__play","aria-pressed":!p,onClick:()=>d(b=>!b),children:p?"Pause live":"Resume live"})]}),r(Bn,{root:h,title:"Spring launch",height:620},a)]})}var Pa=`
.ats-demo { width: 100%; max-width: 1280px; min-width: 0; display: grid; gap: 12px; font-family: "Avenir Next", Avenir, system-ui, sans-serif;
  --d-ink: #00162b; --d-muted: rgba(0, 22, 43, 0.54); --d-line: #dae2ec; --d-panel: #ffffff; --d-soft: rgba(26, 62, 112, 0.06); }
:where(.dark, [data-theme="dark"]) .ats-demo { --d-ink: rgba(255, 255, 255, 0.94); --d-muted: rgba(255, 255, 255, 0.56);
  --d-line: rgba(255, 255, 255, 0.12); --d-panel: #16345c; --d-soft: rgba(255, 255, 255, 0.07); }
.ats-demo__bar { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
.ats-demo__label { font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.09em; font-weight: 600; color: var(--d-muted); }
.ats-demo__seg { display: inline-flex; padding: 2px; border-radius: 10px; background: var(--d-soft); border: 1px solid var(--d-line); }
.ats-demo button { font: inherit; cursor: pointer; }
.ats-demo__seg button { height: 28px; padding: 0 12px; border: 0; border-radius: 8px; background: transparent; color: var(--d-muted); font-weight: 600; font-size: 12.5px; }
.ats-demo__seg button[aria-pressed="true"] { background: var(--d-panel); color: var(--d-ink); box-shadow: 0 0 0 1px var(--d-line); }
.ats-demo__play { margin-left: auto; height: 30px; padding: 0 12px; border-radius: 10px; border: 1px solid var(--d-line); background: var(--d-panel); color: var(--d-ink); font-weight: 600; font-size: 12.5px; }
.ats-demo :focus-visible { outline: none; box-shadow: 0 0 0 3px #8fbdf2; }
`;export{za as default};
