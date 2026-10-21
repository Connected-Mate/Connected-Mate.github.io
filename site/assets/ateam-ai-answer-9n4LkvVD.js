import{t as ze}from"./react-BkAXpnfr.js";var Ee=ze();var{Children:ea,Component:aa,Fragment:ta,StrictMode:na,cloneElement:ra,createContext:ia,createElement:sa,createRef:oa,forwardRef:la,isValidElement:pa,lazy:da,memo:ua,startTransition:ca,Suspense:ma,use:fa,useCallback:U,useContext:wa,useDebugValue:ba,useDeferredValue:ga,useEffect:C,useId:me,useImperativeHandle:ha,useInsertionEffect:xa,useLayoutEffect:fe,useMemo:we,useOptimistic:_a,useReducer:va,useRef:k,useState:u,useSyncExternalStore:ka,useTransition:ya}=Ee;import{t as Ie}from"./jsx-runtime-CTsRTJUX.js";var Be=Ie(),{jsx:e,jsxs:i,Fragment:X}=Be;var Le=["Not accurate","Wrong source","Too long","Out of date"];function De(l,n){let r=l;return n&&(r=r.replace(/\[[\d,\s]*$/,"")),(r.match(/\*\*/g)?.length??0)%2===1&&(r+="**"),r}function He(l,n,r){let c=De(l.replace(/\r\n?/g,`
`),r),o=0,f=N=>{let g=[],h=/\*\*([\s\S]+?)\*\*|\[(\d+(?:\s*,\s*\d+)*)\]/g,_=0,S=(m,v)=>{for(let w of m.match(/\S+\s*|\s+/g)??[])g.push({t:"w",text:w,bold:v,i:o++})};for(let m=h.exec(N);m;m=h.exec(N)){if(S(N.slice(_,m.index),!1),m[1]!==void 0)S(m[1],!0);else{let v=[...new Set(m[2].split(",").map(w=>Number(w.trim())-1))].filter(w=>w>=0&&w<n);v.length&&g.push({t:"c",ids:v,i:o++})}_=h.lastIndex}return S(N.slice(_),!1),g},y=[];for(let N of c.split(/\n\s*\n/)){let g=[],h=null,_=()=>{g.length&&y.push({kind:"p",toks:f(g.join(" ").trim())}),g=[]},S=()=>{h?.length&&y.push({kind:"ul",items:h}),h=null};for(let m of N.split(`
`)){let v=/^\s*[-*]\s+(.*)$/.exec(m);v?(_(),(h??=[]).push(f(v[1]))):m.trim()&&(S(),g.push(m.trim()))}_(),S()}return{blocks:y,total:o}}function Fe(l,n){let r=l.replace(/\*\*([\s\S]+?)\*\*/g,"$1").replace(/\s*\[(\d+(?:\s*,\s*\d+)*)\]/g,(o,f)=>` [${f.split(",").map(y=>y.trim()).join(", ")}]`).trim();if(!n.length)return r;let c=n.map((o,f)=>`${f+1}. ${o.name} \u2013 ${o.title}${o.href?` (${o.href})`:""}`).join(`
`);return`${r}

Sources
${c}`}function We(){let[l,n]=u(!1);return C(()=>{let r=window.matchMedia?.("(prefers-reduced-motion: reduce)");if(!r)return;n(r.matches);let c=()=>n(r.matches);return r.addEventListener?.("change",c),()=>r.removeEventListener?.("change",c)},[]),l}var $=({children:l,size:n=16})=>e("svg",{width:n,height:n,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:1.8,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:l}),je=()=>i($,{children:[e("rect",{x:"8",y:"8",width:"12",height:"12",rx:"2.5"}),e("path",{d:"M16 8V6.5A2.5 2.5 0 0 0 13.5 4h-7A2.5 2.5 0 0 0 4 6.5v7A2.5 2.5 0 0 0 6.5 16H8"})]}),Oe=()=>e($,{children:e("path",{d:"m5 12.5 4.5 4.5L19 7.5"})}),Ue=()=>i($,{children:[e("path",{d:"M20 11a8 8 0 1 0-2.3 5.7"}),e("path",{d:"M20 4v7h-7"})]}),qe=()=>e($,{children:e("path",{d:"M7 10v10H4.5A1.5 1.5 0 0 1 3 18.5v-7A1.5 1.5 0 0 1 4.5 10H7Zm0 0 4-7a2.5 2.5 0 0 1 2.5 2.8L13 10h5.6a2 2 0 0 1 2 2.4l-1.4 6A2 2 0 0 1 17.2 20H7"})}),Ve=()=>e($,{children:e("path",{d:"M17 14V4h2.5A1.5 1.5 0 0 1 21 5.5v7a1.5 1.5 0 0 1-1.5 1.5H17Zm0 0-4 7a2.5 2.5 0 0 1-2.5-2.8L11 14H5.4a2 2 0 0 1-2-2.4l1.4-6A2 2 0 0 1 6.8 4H17"})}),Pe=()=>e("svg",{width:"10",height:"10",viewBox:"0 0 10 10","aria-hidden":"true",children:e("rect",{width:"10",height:"10",rx:"2.5",fill:"currentColor"})}),Ge=()=>e($,{size:15,children:e("path",{d:"M5 12h14M13 6l6 6-6 6"})}),Je=()=>e($,{size:13,children:e("path",{d:"M8 16 16 8M9 8h7v7"})});function be({question:l,sources:n=[],answer:r="",streaming:c=!1,animate:o=!0,speed:f=38,followUps:y=[],onFollowUp:N,onRegenerate:g,onStop:h,onFeedback:_,feedbackReasons:S=Le,onCopy:m,className:v}){let w=me(),ge=We(),H=!o||ge,Q=c,{blocks:ee,total:p}=we(()=>He(r,n.length,Q),[r,n.length,Q]),[q,V]=u(()=>H?p:0),[A,ae]=u(!1),[F,te]=u(null),[W,I]=u(null),[ne,B]=u(!1),[re,ie]=u(!1),[he,R]=u(""),[P,z]=u(null),[T,L]=u(null),G=k(0),se=k(r),oe=k(null),D=k(void 0),J=k(void 0),Y=U(()=>{G.current=performance.now(),V(0),ae(!1),te(null),I(null),B(!1),L(null)},[]);C(()=>(G.current=performance.now(),()=>{window.clearTimeout(D.current),window.clearTimeout(J.current)}),[]),C(()=>{let t=se.current;se.current=r,t&&!r.startsWith(t)&&Y()},[r,Y]),C(()=>{if(A)return;if(H){V(p);return}if(q>=p)return;let t=window.setInterval(()=>{V(a=>a>=p?a:a+1)},1e3/Math.max(1,f));return()=>window.clearInterval(t)},[H,p,f,A,q>=p]);let j=Math.min(q,p),M=!A&&p===0&&c,E=!A&&!M&&(j<p||c),O=!M&&!E;C(()=>{O&&p>0&&F===null&&(te((performance.now()-G.current)/1e3),A||R("Answer complete"))},[O,p,F,A]);let Z=(t,a,x)=>{window.clearTimeout(D.current);let b=oe.current;if(!b)return;let d=b.getBoundingClientRect(),s=x.getBoundingClientRect(),Re=Math.min(288,d.width-24),$e=Math.max(12,Math.min(s.left-d.left,d.width-Re-12));L({key:t,ids:a,left:$e,top:s.bottom-d.top+8})},K=()=>{window.clearTimeout(D.current),D.current=window.setTimeout(()=>L(null),140)},xe=()=>window.clearTimeout(D.current),_e=async()=>{let t=Fe(r,n);try{await navigator.clipboard.writeText(t),ie(!0),R("Answer copied"),window.clearTimeout(J.current),J.current=window.setTimeout(()=>ie(!1),1600),m?.(t)}catch{R("Couldn't copy \u2013 select the text instead")}},ve=()=>{Y(),R("Writing a new answer"),g?.()},ke=()=>{ae(!0),R("Stopped"),h?.()},ye=()=>{if(W==="up"){I(null);return}I("up"),B(!1),R("Thanks for the feedback"),_?.("up")},Ne=()=>{if(W==="down"){I(null),B(!1);return}I("down"),B(!0)},Se=t=>{B(!1),R(`Thanks \u2013 noted: ${t}`),_?.("down",t)},le=k(null),[pe,Ae]=u(null);fe(()=>{let t=le.current;if(!t||typeof ResizeObserver>"u")return;let a=new ResizeObserver(()=>Ae(t.offsetHeight));return a.observe(t),()=>a.disconnect()},[]);let Te=t=>P!==null&&t.includes(P),Me=T?.ids??[],de=t=>t.filter(a=>a.i<j).map(a=>{if(a.t==="w"){let s=a.bold?"strong":"span";return e(s,{className:"ui-at-answer__w",children:a.text},a.i)}let x=n[a.ids[0]],b=a.ids.map(s=>n[s].name).join(", "),d=T?.key===a.i;return i("button",{type:"button",className:"ui-at-answer__cite","data-lit":Te(a.ids)||d||void 0,"aria-label":`Source${a.ids.length>1?"s":""}: ${b}`,"aria-describedby":d?`${w}-tip`:void 0,"aria-expanded":d,onMouseEnter:s=>Z(a.i,a.ids,s.currentTarget),onMouseLeave:K,onFocus:s=>Z(a.i,a.ids,s.currentTarget),onBlur:K,onClick:s=>d?L(null):Z(a.i,a.ids,s.currentTarget),onKeyDown:s=>{s.key==="Escape"&&T&&(s.stopPropagation(),L(null))},children:[x.name,a.ids.length>1&&i("span",{className:"ui-at-answer__more",children:["+",a.ids.length-1]})]},a.i)}),ue=(()=>{let t=-1;return ee.forEach((a,x)=>{(a.kind==="p"?a.toks:a.items.flat()).some(d=>d.i<j)&&(t=x)}),t})(),Ce=E&&e("span",{className:"ui-at-answer__cursor","aria-hidden":"true"}),ce=M?`Reading ${n.length} source${n.length===1?"":"s"}`:E?"Writing":"Answer";return i("section",{className:["ui-at-answer",v].filter(Boolean).join(" "),"data-instant":H||void 0,"aria-label":l??"Answer",children:[e("style",{href:"ui-ai-answer",precedence:"default",children:Ye}),i("div",{className:"ui-at-answer__panel",ref:oe,children:[e("div",{className:"ui-at-answer__glide",style:pe===null?void 0:{height:pe},children:i("div",{ref:le,className:"ui-at-answer__inner",children:[l&&e("h3",{className:"ui-at-answer__q",children:l}),n.length>0&&e("ul",{className:"ui-at-answer__sources","aria-label":"Sources",children:n.map((t,a)=>{let x=P===a||T!==null&&Me.includes(a)||void 0,b=i(X,{children:[i("span",{className:"ui-at-answer__srchead",children:[e("span",{className:"ui-at-answer__pebble","aria-hidden":"true",children:t.icon??t.name.slice(0,1).toUpperCase()}),e("span",{className:"ui-at-answer__srcname",children:t.name}),e("span",{className:"ui-at-answer__num","aria-hidden":"true",children:a+1})]}),e("span",{className:"ui-at-answer__srctitle",children:t.title})]});return e("li",{className:"ui-at-answer__src",style:{animationDelay:`${a*90}ms`},"data-lit":x,onMouseEnter:()=>z(a),onMouseLeave:()=>z(null),children:t.href?e("a",{className:"ui-at-answer__srcbox",href:t.href,target:"_blank",rel:"noopener noreferrer","aria-label":`${a+1}. ${t.name}: ${t.title} (opens in a new tab)`,onFocus:()=>z(a),onBlur:()=>z(null),children:b}):e("div",{className:"ui-at-answer__srcbox",tabIndex:0,"aria-label":`${a+1}. ${t.name}: ${t.title}`,onFocus:()=>z(a),onBlur:()=>z(null),children:b})},a)})}),i("div",{className:"ui-at-answer__label","data-phase":M?"reading":E?"writing":"done",children:[i("span",{className:"ui-at-answer__avatar","aria-hidden":"true",children:[e("span",{}),e("span",{})]}),e("span",{className:"ui-at-answer__status",children:ce},ce)]}),i("div",{className:"ui-at-answer__body","aria-busy":!O,"aria-live":"off",children:[M&&i("div",{className:"ui-at-answer__skeleton","aria-hidden":"true",children:[e("span",{}),e("span",{}),e("span",{})]}),ee.map((t,a)=>{if(a>ue)return null;let x=a===ue?Ce:null;if(t.kind==="p")return i("p",{className:"ui-at-answer__p",children:[de(t.toks),x]},a);let b=t.items.filter(d=>d.some(s=>s.i<j));return e("ul",{className:"ui-at-answer__ul",children:b.map((d,s)=>i("li",{children:[de(d),s===b.length-1?x:null]},s))},a)}),!M&&p===0&&!c&&e("p",{className:"ui-at-answer__empty",children:"No answer yet."})]}),O&&!A&&y.length>0&&i("div",{className:"ui-at-answer__related",children:[e("p",{className:"ui-at-answer__kicker",id:`${w}-rel`,children:"Related"}),e("ul",{"aria-labelledby":`${w}-rel`,children:y.map((t,a)=>e("li",{style:{animationDelay:`${a*70}ms`},children:i("button",{type:"button",onClick:()=>N?.(t),children:[e("span",{children:t}),e(Ge,{})]})},t))})]})]})}),T&&e("div",{id:`${w}-tip`,role:"tooltip",className:"ui-at-answer__tip",style:{left:T.left,top:T.top},onMouseEnter:xe,onMouseLeave:K,children:T.ids.map(t=>{let a=n[t];return i("div",{className:"ui-at-answer__tipitem",children:[i("span",{className:"ui-at-answer__srchead",children:[e("span",{className:"ui-at-answer__pebble","aria-hidden":"true",children:a.icon??a.name.slice(0,1).toUpperCase()}),e("span",{className:"ui-at-answer__srcname",children:a.name}),e("span",{className:"ui-at-answer__num",children:t+1})]}),a.href?i("a",{href:a.href,target:"_blank",rel:"noopener noreferrer",className:"ui-at-answer__tiptitle",children:[a.title,e(Je,{})]}):e("span",{className:"ui-at-answer__tiptitle",children:a.title}),a.snippet&&e("p",{className:"ui-at-answer__snippet",children:a.snippet})]},t)})})]}),ne&&i("div",{className:"ui-at-answer__reasons",role:"group","aria-label":"What went wrong?",children:[e("span",{className:"ui-at-answer__kicker",children:"What went wrong?"}),e("div",{children:S.map(t=>e("button",{type:"button",onClick:()=>Se(t),children:t},t))})]}),i("div",{className:"ui-at-answer__foot",children:[e("div",{className:"ui-at-answer__actions",children:M||E?i("button",{type:"button",className:"ui-at-answer__stop",onClick:ke,children:[e(Pe,{}),"Stop"]}):i(X,{children:[e("button",{type:"button",className:"ui-at-answer__act",onClick:_e,disabled:p===0,"aria-label":re?"Copied":"Copy answer",title:"Copy",children:re?e(Oe,{}):e(je,{})}),e("button",{type:"button",className:"ui-at-answer__act",onClick:ve,"aria-label":"Regenerate answer",title:"Regenerate",children:e(Ue,{})}),e("button",{type:"button",className:"ui-at-answer__act",onClick:ye,"aria-pressed":W==="up",disabled:p===0,"aria-label":"Good answer",title:"Good answer",children:e(qe,{})}),e("button",{type:"button",className:"ui-at-answer__act",onClick:Ne,"aria-pressed":W==="down","aria-expanded":ne,disabled:p===0,"aria-label":"Bad answer",title:"Bad answer",children:e(Ve,{})})]})}),e("span",{className:"ui-at-answer__meta",children:M?"Searching\u2026":E?"Writing\u2026":A?"Stopped":F!==null?`Answered in ${F.toFixed(1)}s`:""})]}),e("div",{className:"ui-at-answer__sr",role:"status","aria-live":"polite",children:he})]})}var Ye=`
.ui-at-answer {
  --frame: #f2f6fa; --panel: #ffffff; --soft: rgba(26, 62, 112, 0.06);
  --line: #dae2ec; --line-firm: #cbd6e4;
  --ink: #00162b; --text: rgba(0, 22, 43, 0.66); --muted: rgba(0, 22, 43, 0.54);
  --berry: #851437; --berry-hover: #6d0f2d;
  --info-ink: #1a3e70; --info-fill: #eef5ff; --info-line: #c1daff; --ring: #8fbdf2;
  --ok-ink: #1d6a34; --ok-fill: #eafbee; --ok-line: #c9f5cf;
  --bad-ink: #8a3a22; --bad-fill: #fdeee8; --bad-line: #f5d5c9;
  --pebble: #ffffff;
  --pebble-shade: inset 0 -2px 6px -4px rgba(26, 62, 112, 0.4);
  --drop: 0 8px 16px -8px rgba(26, 62, 112, 0.2);
  --raised: 0 18px 30px -16px rgba(26, 62, 112, 0.38), 0 4px 10px -6px rgba(26, 62, 112, 0.18);
  --float: 0 24px 48px -24px rgba(26, 62, 112, 0.3);
  --ease: cubic-bezier(.16, 1, .3, 1);
  box-sizing: border-box;
  width: 100%;
  max-width: 640px;
  min-width: 0;
  padding: 6px;
  border-radius: 22px;
  background: var(--frame);
  border: 1px solid var(--line);
  box-shadow: var(--float);
  font-family: "Avenir Next", Avenir, system-ui, sans-serif;
  color: var(--text);
  font-size: 15px;
  line-height: 1.65;
  text-align: left;
}
:where(.dark, [data-theme="dark"]) .ui-at-answer {
  --frame: #0f2747; --panel: #16345c; --soft: rgba(255, 255, 255, 0.07);
  --line: rgba(255, 255, 255, 0.12); --line-firm: rgba(255, 255, 255, 0.18);
  --ink: rgba(255, 255, 255, 0.94); --text: rgba(255, 255, 255, 0.72); --muted: rgba(255, 255, 255, 0.56);
  --berry: #a8204d; --berry-hover: #bd2a5a;
  --info-ink: #c1daff; --info-fill: rgba(143, 189, 242, 0.16); --info-line: rgba(143, 189, 242, 0.34); --ring: rgba(143, 189, 242, 0.6);
  --ok-ink: #7fe0a0; --ok-fill: rgba(127, 224, 160, 0.14); --ok-line: rgba(127, 224, 160, 0.3);
  --bad-ink: #f2a48c; --bad-fill: rgba(242, 164, 140, 0.14); --bad-line: rgba(242, 164, 140, 0.3);
  --pebble: #1d4170;
  --pebble-shade: inset 0 -2px 6px -4px rgba(3, 12, 28, 0.8);
  --drop: 0 8px 16px -8px rgba(3, 12, 28, 0.6);
  --raised: 0 18px 30px -16px rgba(3, 12, 28, 0.8), 0 4px 10px -6px rgba(3, 12, 28, 0.6);
  --float: 0 24px 48px -24px rgba(3, 12, 28, 0.7);
}
.ui-at-answer *, .ui-at-answer *::before, .ui-at-answer *::after { box-sizing: border-box; }
.ui-at-answer button { font: inherit; color: inherit; }
.ui-at-answer :focus-visible { outline: none; box-shadow: 0 0 0 3px var(--ring); }

.ui-at-answer__panel {
  position: relative;
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 16px;
  box-shadow: var(--raised);
}
.ui-at-answer__glide { overflow: hidden; border-radius: 16px; transition: height 300ms var(--ease); }
.ui-at-answer__inner { padding: 22px 24px 20px; }

.ui-at-answer__q {
  margin: 0 0 14px;
  font-family: "Avenir Next Condensed", "Avenir Next", Avenir, system-ui, sans-serif;
  font-weight: 700;
  font-size: 21px;
  line-height: 1.25;
  color: var(--ink);
  overflow-wrap: anywhere;
}

.ui-at-answer__sources {
  list-style: none;
  margin: 0 -24px 18px;
  padding: 2px 24px 6px;
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scroll-snap-type: x proximity;
  scroll-padding: 0 24px;
  scrollbar-width: none;
  -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 16px, #000 calc(100% - 28px), transparent);
  mask-image: linear-gradient(90deg, transparent 0, #000 16px, #000 calc(100% - 28px), transparent);
}
.ui-at-answer__sources::-webkit-scrollbar { display: none; }
.ui-at-answer__src {
  flex: 0 0 172px;
  scroll-snap-align: start;
  animation: ui-at-answer-pop 420ms var(--ease) both;
}
.ui-at-answer__srcbox {
  display: flex;
  flex-direction: column;
  gap: 6px;
  height: 100%;
  padding: 10px 12px 11px;
  border-radius: 12px;
  background: var(--info-fill);
  border: 1px solid transparent;
  color: var(--text);
  text-decoration: none;
  transition: border-color 150ms var(--ease), background-color 150ms var(--ease), transform 150ms var(--ease), box-shadow 150ms var(--ease);
}
.ui-at-answer__src[data-lit] .ui-at-answer__srcbox,
.ui-at-answer__srcbox:hover {
  border-color: var(--info-line);
  box-shadow: var(--drop);
  transform: translateY(-1px);
}
.ui-at-answer__srchead { display: flex; align-items: center; gap: 7px; min-width: 0; font-size: 12.5px; line-height: 1.2; }
.ui-at-answer__pebble {
  flex: none;
  display: grid;
  place-items: center;
  width: 18px;
  height: 18px;
  border-radius: 6px;
  background: var(--pebble);
  border: 1px solid var(--line);
  box-shadow: var(--pebble-shade);
  font-size: 10px;
  font-weight: 700;
  color: var(--info-ink);
}
.ui-at-answer__pebble > svg, .ui-at-answer__pebble > img { width: 12px; height: 12px; }
.ui-at-answer__srcname { flex: 1; min-width: 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; color: var(--muted); }
.ui-at-answer__num { flex: none; font-size: 11px; color: var(--muted); font-variant-numeric: tabular-nums; }
.ui-at-answer__srctitle {
  font-size: 13px;
  line-height: 1.4;
  color: var(--ink);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.ui-at-answer__label { display: flex; align-items: center; gap: 9px; margin-bottom: 8px; font-size: 13.5px; font-weight: 600; color: var(--ink); }
.ui-at-answer__avatar {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  width: 26px;
  height: 26px;
  border-radius: 9px;
  background: var(--pebble);
  border: 1px solid var(--line);
  box-shadow: var(--pebble-shade);
}
.ui-at-answer__avatar span { width: 4px; height: 6px; border-radius: 2px; background: var(--berry); transition: height 300ms var(--ease); }
.ui-at-answer__label[data-phase="reading"] .ui-at-answer__avatar span,
.ui-at-answer__label[data-phase="writing"] .ui-at-answer__avatar span { animation: ui-at-answer-blink 1.6s var(--ease) infinite; }
.ui-at-answer__label[data-phase="writing"] .ui-at-answer__avatar span:last-child { animation-delay: 120ms; }
.ui-at-answer__status { animation: ui-at-answer-fade 300ms var(--ease) both; }
.ui-at-answer__label:not([data-phase="done"]) .ui-at-answer__status {
  background: linear-gradient(90deg, var(--muted) 0%, var(--muted) 35%, var(--ink) 50%, var(--muted) 65%, var(--muted) 100%);
  background-size: 250% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: ui-at-answer-fade 300ms var(--ease) both, ui-at-answer-shine 1.8s linear infinite;
}

.ui-at-answer__body { min-height: 26px; overflow-wrap: anywhere; }
.ui-at-answer__p { margin: 0 0 12px; }
.ui-at-answer__ul { margin: 0 0 12px; padding-left: 22px; }
.ui-at-answer__ul li { margin: 0 0 6px; padding-left: 2px; }
.ui-at-answer__ul li::marker { color: var(--line-firm); }
.ui-at-answer__body strong { color: var(--ink); font-weight: 650; }
.ui-at-answer__w { animation: ui-at-answer-word 420ms var(--ease) both; }
.ui-at-answer__empty { margin: 0 0 8px; color: var(--muted); }
.ui-at-answer__skeleton { display: grid; gap: 9px; padding: 6px 0 14px; }
.ui-at-answer__skeleton span { height: 10px; border-radius: 5px; background: var(--soft); animation: ui-at-answer-blink 1.6s ease-in-out infinite; }
.ui-at-answer__skeleton span:nth-child(2) { width: 86%; animation-delay: 150ms; }
.ui-at-answer__skeleton span:nth-child(3) { width: 62%; animation-delay: 300ms; }

.ui-at-answer__cite {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  margin: 0 2px 0 3px;
  padding: 0 7px;
  height: 21px;
  vertical-align: 1px;
  border-radius: 7px;
  border: 1px solid var(--info-line);
  background: var(--info-fill);
  color: var(--info-ink);
  font-size: 11.5px;
  font-weight: 600;
  line-height: 1;
  cursor: pointer;
  white-space: nowrap;
  animation: ui-at-answer-pop 360ms var(--ease) both;
  transition: background-color 150ms var(--ease), border-color 150ms var(--ease), color 150ms var(--ease);
}
.ui-at-answer__cite[data-lit] { background: var(--info-ink); border-color: var(--info-ink); color: var(--panel); }
.ui-at-answer__more { opacity: 0.72; font-weight: 500; }
.ui-at-answer__cursor {
  display: inline-block;
  width: 8px;
  height: 8px;
  margin-left: 4px;
  border-radius: 50%;
  background: var(--berry);
  vertical-align: 1px;
  animation: ui-at-answer-pulse 1s var(--ease) infinite;
}

.ui-at-answer__tip {
  position: absolute;
  z-index: 5;
  width: min(288px, calc(100% - 24px));
  display: grid;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 14px;
  background: var(--panel);
  border: 1px solid var(--line-firm);
  box-shadow: var(--raised);
  font-size: 13px;
  line-height: 1.45;
  animation: ui-at-answer-rise 200ms var(--ease) both;
}
.ui-at-answer__tipitem { display: grid; gap: 5px; }
.ui-at-answer__tipitem + .ui-at-answer__tipitem { padding-top: 10px; border-top: 1px solid var(--line); }
.ui-at-answer__tiptitle { display: inline-flex; align-items: flex-start; gap: 4px; color: var(--ink); font-weight: 600; text-decoration: none; }
a.ui-at-answer__tiptitle:hover { color: var(--info-ink); text-decoration: underline; text-underline-offset: 3px; }
a.ui-at-answer__tiptitle svg { flex: none; margin-top: 3px; }
.ui-at-answer__snippet { margin: 0; color: var(--text); }

.ui-at-answer__related { margin-top: 6px; padding-top: 14px; border-top: 1px solid var(--line); }
.ui-at-answer__kicker { margin: 0 0 4px; font-size: 10.5px; font-weight: 600; letter-spacing: 0.09em; text-transform: uppercase; color: var(--muted); }
.ui-at-answer__related ul { list-style: none; margin: 0; padding: 0; }
.ui-at-answer__related li { animation: ui-at-answer-rise 300ms var(--ease) both; }
.ui-at-answer__related li + li { border-top: 1px solid var(--line); }
.ui-at-answer__related button {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 0 -8px;
  width: calc(100% + 16px);
  padding: 10px 8px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--ink);
  font-size: 14px;
  text-align: left;
  cursor: pointer;
  transition: background-color 150ms var(--ease);
}
.ui-at-answer__related button svg { flex: none; color: var(--muted); transition: transform 150ms var(--ease), color 150ms var(--ease); }
.ui-at-answer__related button:hover { background: var(--soft); }
.ui-at-answer__related button:hover svg { transform: translateX(2px); color: var(--berry); }

.ui-at-answer__reasons { display: grid; gap: 6px; padding: 10px 12px 2px; animation: ui-at-answer-rise 300ms var(--ease) both; }
.ui-at-answer__reasons .ui-at-answer__kicker { margin: 0; }
.ui-at-answer__reasons div { display: flex; flex-wrap: wrap; gap: 6px; }
.ui-at-answer__reasons button {
  padding: 4px 11px;
  border-radius: 999px;
  border: 1px solid var(--line-firm);
  background: var(--panel);
  box-shadow: var(--drop);
  font-size: 12.5px;
  font-weight: 600;
  color: var(--ink);
  cursor: pointer;
  transition: border-color 150ms var(--ease), background-color 150ms var(--ease);
}
.ui-at-answer__reasons button:hover { border-color: var(--bad-line); background: var(--bad-fill); color: var(--bad-ink); }

.ui-at-answer__foot { display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 44px; padding: 6px 8px 2px; }
.ui-at-answer__actions { display: flex; align-items: center; gap: 2px; }
.ui-at-answer__act {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border: 1px solid transparent;
  border-radius: 9px;
  background: transparent;
  color: var(--muted);
  cursor: pointer;
  transition: background-color 150ms var(--ease), color 150ms var(--ease), border-color 150ms var(--ease);
}
.ui-at-answer__act:hover:not(:disabled) { background: var(--soft); color: var(--ink); }
.ui-at-answer__act[aria-pressed="true"] { background: var(--info-fill); border-color: var(--info-line); color: var(--info-ink); }
.ui-at-answer__act:disabled { opacity: 0.4; cursor: default; }
.ui-at-answer__stop {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 32px;
  padding: 0 13px;
  border-radius: 10px;
  border: 1px solid var(--line-firm);
  background: var(--panel);
  box-shadow: var(--drop);
  font-size: 13px;
  font-weight: 600;
  color: var(--ink);
  cursor: pointer;
  animation: ui-at-answer-fade 300ms var(--ease) both;
}
.ui-at-answer__stop svg { color: var(--berry); }
.ui-at-answer__meta { font-size: 12.5px; color: var(--muted); font-variant-numeric: tabular-nums; white-space: nowrap; }
.ui-at-answer__sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); clip-path: inset(50%); white-space: nowrap; }

@keyframes ui-at-answer-pop { from { opacity: 0; transform: translateY(6px) scale(0.96); } to { opacity: 1; transform: none; } }
@keyframes ui-at-answer-rise { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
@keyframes ui-at-answer-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes ui-at-answer-word { from { opacity: 0; filter: blur(4px); } to { opacity: 1; filter: blur(0); } }
@keyframes ui-at-answer-pulse { 0%, 100% { transform: scale(0.7); opacity: 0.55; } 50% { transform: scale(1); opacity: 1; } }
@keyframes ui-at-answer-blink { 0%, 100% { opacity: 0.45; } 50% { opacity: 1; } }
@keyframes ui-at-answer-shine { from { background-position: 100% 0; } to { background-position: -150% 0; } }

@media (max-width: 480px) {
  .ui-at-answer__inner { padding: 18px 16px 16px; }
  .ui-at-answer__sources { margin: 0 -16px 16px; padding: 2px 16px 6px; scroll-padding: 0 16px; }
  .ui-at-answer__src { flex-basis: 150px; }
  .ui-at-answer__q { font-size: 19px; }
}
@media (pointer: coarse) {
  .ui-at-answer__cite { height: 26px; padding: 0 9px; }
  .ui-at-answer__act { width: 40px; height: 40px; }
}
.ui-at-answer[data-instant] *, .ui-at-answer[data-instant] *::before, .ui-at-answer[data-instant] *::after { animation-duration: 0s !important; animation-delay: 0s !important; }
@media (prefers-reduced-motion: reduce) {
  .ui-at-answer *, .ui-at-answer *::before, .ui-at-answer *::after {
    animation-duration: 0s !important;
    animation-delay: 0s !important;
    animation-iteration-count: 1 !important;
    transition-property: color, background-color, border-color, opacity !important;
  }
  .ui-at-answer__glide { transition: none; }
}
`;var Ze=[{name:"Notion",title:"Offsite plan \u2013 shortlist and budget",href:"https://www.notion.so",snippet:"Budget \u20AC4,500 for three nights, 12 people. Shortlist: Alfama, Baixa, Cascais."},{name:"Slack",title:"#team-offsite \u2013 who can make which dates",href:"https://slack.com",snippet:"Everyone is in for 14\u201316 May. Jonas: I can only join from Friday."},{name:"Wikipedia",title:"Alfama \u2013 the oldest district of Lisbon",href:"https://en.wikipedia.org/wiki/Alfama",snippet:"A maze of narrow streets between the castle and the river, mostly walkable."},{name:"Google Flights",title:"BER and MUC \u2192 LIS, Thursday 14 May",href:"https://www.google.com/travel/flights",snippet:"Direct flights land at 09:55 (from Berlin) and 10:20 (from Munich)."},{name:"Airbnb",title:"Two linked houses in Alfama, sleeps 14",href:"https://www.airbnb.com",snippet:"\u20AC960 a night for both houses. Only the 14\u201316 May weekend is still open in May."},{name:"Booking.com",title:"Hotels in Baixa for 12 guests",href:"https://www.booking.com",snippet:"Best match: \u20AC1,200 a night for six double rooms, breakfast included."}],Ke=`**Alfama** is the best fit for the 12-person offsite: walkable, quiet in the mornings and inside the budget you set [1,3].

- **Dates:** 14\u201316 May works for everyone, Jonas joins on day two [2].
- **Stay:** two linked houses in Alfama come to \u20AC2,880 for three nights, about 20% less than the hotel [5,6].
- **Flights:** direct flights from Berlin and Munich land before 10:30, so day one can start after lunch [4].

Book the houses this week \u2013 only one May weekend is still free [5].`;function Xe(){let[l,n]=u(""),[r,c]=u(!0),o=k(void 0),f=U(()=>{window.clearTimeout(o.current),n(""),c(!0),o.current=window.setTimeout(()=>{n(Ke),c(!1)},1800)},[]);return C(()=>(f(),()=>window.clearTimeout(o.current)),[f]),e(be,{question:"Where should we hold the team offsite in Lisbon?",sources:Ze,answer:l,streaming:r,followUps:["Compare the houses with the hotel","Draft a three-day agenda"],onRegenerate:f,onStop:()=>window.clearTimeout(o.current)})}export{Xe as default};
