import{t as xe}from"./react-BkAXpnfr.js";var ve=xe();var{Children:qe,Component:He,Fragment:$e,StrictMode:Be,cloneElement:Oe,createContext:Ve,createElement:We,createRef:Pe,forwardRef:Fe,isValidElement:Ye,lazy:Ke,memo:Ue,startTransition:Xe,Suspense:Je,use:Ze,useCallback:se,useContext:Ge,useDebugValue:Qe,useDeferredValue:et,useEffect:z,useId:de,useImperativeHandle:le,useInsertionEffect:tt,useLayoutEffect:fe,useMemo:K,useOptimistic:it,useReducer:nt,useRef:I,useState:E,useSyncExternalStore:at,useTransition:rt}=ve;import{t as _e}from"./jsx-runtime-CTsRTJUX.js";var ye=_e(),{jsx:a,jsxs:b,Fragment:dt}=ye;var ke=4e6;function we(l,x){let y=/\s+|[\p{L}\p{N}'’_-]+|[^\s\p{L}\p{N}]/gu,p=l.match(y)??[],k=x.match(y)??[];if(l===x)return l?[{type:"equal",text:l}]:[];if(p.length*k.length>ke)return[{type:"change",remove:l,insert:x}];let w=k.length+1,C=new Uint32Array((p.length+1)*w);for(let r=p.length-1;r>=0;r--)for(let t=k.length-1;t>=0;t--)C[r*w+t]=p[r]===k[t]?C[(r+1)*w+t+1]+1:Math.max(C[(r+1)*w+t],C[r*w+t+1]);let M=[],_=0,D=0;for(;_<p.length&&D<k.length;)p[_]===k[D]?(M.push({k:"eq",t:p[_]}),_++,D++):C[(_+1)*w+D]>=C[_*w+D+1]?M.push({k:"del",t:p[_++]}):M.push({k:"ins",t:k[D++]});for(;_<p.length;)M.push({k:"del",t:p[_++]});for(;D<k.length;)M.push({k:"ins",t:k[D++]});let m=[];for(let r of M){let t=m[m.length-1];if(r.k==="eq")t?.type==="equal"?t.text+=r.t:m.push({type:"equal",text:r.t});else{t?.type!=="change"&&m.push({type:"change",remove:"",insert:""});let d=m[m.length-1];r.k==="del"?d.remove+=r.t:d.insert+=r.t}}let v=[];for(let r=0;r<m.length;r++){let t=m[r],d=v[v.length-1],u=m[r+1];if(t.type==="equal"&&/^\s+$/.test(t.text)&&d?.type==="change"&&u?.type==="change"){d.remove+=t.text+u.remove,d.insert+=t.text+u.insert,r++;continue}if(t.type==="change"&&d?.type==="change"){d.remove+=t.remove,d.insert+=t.insert;continue}v.push(t.type==="equal"?{...t}:{...t})}let N=[],f=r=>{if(!r)return;let t=N[N.length-1];t?.type==="equal"?t.text+=r:N.push({type:"equal",text:r})};for(let r of v){if(r.type==="equal"){f(r.text);continue}let{remove:t,insert:d}=r,u="",g="";for(;t&&d&&/\s/.test(t[0])&&t[0]===d[0];)u+=t[0],t=t.slice(1),d=d.slice(1);for(;t&&d&&/\s/.test(t.at(-1))&&t.at(-1)===d.at(-1);)g=t.at(-1)+g,t=t.slice(0,-1),d=d.slice(0,-1);f(u),(t||d)&&N.push({type:"change",remove:t,insert:d}),f(g)}return N}function W(l){let x=l.trim();return`\u201C${x.length>60?`${x.slice(0,57)}\u2026`:x}\u201D`}function Ne(l){return l.insert.trim()?l.remove.trim()?`replace ${W(l.remove)} with ${W(l.insert)}`:`add ${W(l.insert)}`:`remove ${W(l.remove)}`}function De(){let[l,x]=E(!1);return z(()=>{let y=window.matchMedia?.("(prefers-reduced-motion: reduce)");if(!y)return;x(y.matches);let p=()=>x(y.matches);return y.addEventListener?.("change",p),()=>y.removeEventListener?.("change",p)},[]),l}var Le=()=>a("svg",{width:"12",height:"12",viewBox:"0 0 16 16","aria-hidden":"true",children:a("path",{d:"M8 1.5 9.3 6.7 14.5 8 9.3 9.3 8 14.5 6.7 9.3 1.5 8l5.2-1.3L8 1.5Z",fill:"currentColor"})}),Ee=()=>a("svg",{width:"14",height:"14",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.7",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:a("path",{d:"m10 3.5-4.5 4.5 4.5 4.5"})}),Ce=()=>a("svg",{width:"14",height:"14",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.7",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:a("path",{d:"m6 3.5 4.5 4.5L6 12.5"})}),Me=()=>a("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.9",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:a("path",{d:"m3.5 8.5 3 3 6-6.5"})}),je=()=>a("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.9",strokeLinecap:"round","aria-hidden":"true",children:a("path",{d:"m4.5 4.5 7 7M11.5 4.5l-7 7"})});function ce({original:l="",suggested:x="",changes:y,onChange:p,onDone:k,label:w,ref:C,className:M}){let _=de(),D=De(),m=K(()=>y??we(l,x),[y,l,x]),v=K(()=>m.flatMap((e,i)=>e.type==="change"?[i]:[]),[m]),N=v.length,[f,r]=E(()=>v.map(()=>"pending")),[t,d]=E([]),[u,g]=E(null),[ue,P]=E(""),[q,U]=E(null),[pe,X]=E(0),[ge,J]=E(()=>new Set),Z=I([]);z(()=>()=>Z.current.forEach(e=>window.clearTimeout(e)),[]);let G=I(null),F=I(null),Q=I(null),j=I(new Map),H=I(null),T=I(void 0);z(()=>()=>window.clearTimeout(T.current),[]),z(()=>{r(v.map(()=>"pending")),d([]),g(null)},[v]);let Y=se(e=>m.map((i,o)=>{if(i.type==="equal")return i.text;let s=v.indexOf(o);return e[s]==="accepted"?i.insert:i.remove}).join(""),[m,v]),$=e=>e.flatMap((i,o)=>i==="pending"?[o]:[]),ee=(e,i,o)=>{let s=$(e).length,c=e.flatMap((n,h)=>n!==f[h]?[h]:[]);J(n=>new Set([...n,...c])),Z.current.push(window.setTimeout(()=>{J(n=>new Set([...n].filter(h=>!c.includes(h)))),X(n=>n+1)},340)),d(n=>[...n,f]),r(e);let L=Y(e);if(p?.(L),P(s?`${i}. ${s} left`:`${i}. All changes reviewed`),s===0){H.current="undo",g(null),k?.(L);return}if(o!==void 0){let n=$(e),h=n.find(V=>V>o)??n[0];H.current=h??null}},A=(e,i,o=!1)=>{if(f[e]!=="pending")return;let s=f.slice();s[e]=i;let c=o||document.activeElement===j.current.get(e);ee(s,i==="accepted"?"Accepted":"Rejected",c?e:void 0),c||g(null)},B=e=>{$(f).length&&ee(f.map(i=>i==="pending"?e:i),e==="accepted"?"Accepted all":"Rejected all")},te=()=>{let e=t[t.length-1];if(!e)return;d(s=>s.slice(0,-1)),r(e),p?.(Y(e));let i=$(e).length;P(`Undone. ${i} left`);let o=e.findIndex((s,c)=>s==="pending"&&f[c]!=="pending");o>=0&&(H.current=o)},be=()=>{let e=v.map(()=>"pending");d([]),r(e),g(null),p?.(Y(e)),P(`Reset. ${e.length} left`)};z(()=>{let e=H.current;e!==null&&(H.current=null,e==="undo"?Q.current?.focus():j.current.get(e)?.focus())},[f]);let ie=e=>{let i=e.getBoundingClientRect();(i.top<0||i.bottom>window.innerHeight)&&e.scrollIntoView({block:"center",behavior:D?"auto":"smooth"})},ne=e=>{let i=$(f);if(!i.length)return;let o=u?.k??(e===1?-1:N),s=e===1?i.find(n=>n>o)??i[0]:[...i].reverse().find(n=>n<o)??i[i.length-1],c=j.current.get(s);[...j.current.values()].includes(document.activeElement)?c?.focus():(g({k:s,by:"arrow"}),c&&ie(c))};le(C,()=>({highlight:e=>{if(e===null||f[e]!=="pending")return g(null);g({k:e,by:"arrow"});let i=j.current.get(e);i&&ie(i)},accept:e=>A(e,"accepted"),reject:e=>A(e,"rejected"),acceptAll:()=>B("accepted"),rejectAll:()=>B("rejected"),undo:te,reset:be})),fe(()=>{if(!u||f[u.k]!=="pending"){U(null);return}let e=()=>{let i=j.current.get(u.k),o=G.current,s=F.current;if(!i||!o||!s)return;let c=o.getBoundingClientRect(),L=i.getClientRects(),n=L[0]??i.getBoundingClientRect(),h=s.offsetWidth,V=s.offsetHeight,he=n.left+n.width/2-c.left,me=Math.max(8,Math.min(he-h/2,c.width-h-8)),re=n.top-c.top-V-8,oe=!1;n.top-V-8<0&&(re=(L[L.length-1]??n).bottom-c.top+8,oe=!0),U({left:me,top:re,below:oe})};return e(),window.addEventListener("resize",e),()=>window.removeEventListener("resize",e)},[u,f,pe]);let S=f.filter(e=>e==="pending").length,O=N>0&&S===0,R=u&&f[u.k]==="pending"?u.k:null,ae=()=>{window.clearTimeout(T.current),T.current=window.setTimeout(()=>{g(e=>e?.by==="hover"?null:e)},160)};return b("section",{className:["ui-at-diff",M].filter(Boolean).join(" "),"aria-label":w??"Suggested changes",children:[a("style",{href:"ui-inline-diff",precedence:"default",children:Re}),w&&b("p",{className:"ui-at-diff__label",children:[a(Le,{}),a("span",{children:w})]}),b("div",{className:"ui-at-diff__panel",children:[b("div",{className:"ui-at-diff__bar",children:[b("div",{className:"ui-at-diff__layer","data-show":!O||void 0,inert:O,children:[b("span",{className:"ui-at-diff__count",children:[a("span",{className:"ui-at-diff__num",children:S}),a("span",{className:"ui-at-diff__countlabel",children:N===0?"No changes":S===1?"suggestion":"suggestions"})]}),b("span",{className:"ui-at-diff__arrows",children:[a("button",{type:"button",className:"ui-at-diff__arrow","aria-label":"Previous change",onClick:()=>ne(-1),disabled:!S,children:a(Ee,{})}),a("button",{type:"button",className:"ui-at-diff__arrow","aria-label":"Next change",onClick:()=>ne(1),disabled:!S,children:a(Ce,{})})]}),a("button",{type:"button",className:"ui-at-diff__secondary",onClick:()=>B("rejected"),disabled:!S,children:"Reject all"}),a("button",{type:"button",className:"ui-at-diff__primary",onClick:()=>B("accepted"),disabled:!S,children:"Accept all"})]}),b("div",{className:"ui-at-diff__layer","data-show":O||void 0,inert:!O,children:[b("span",{className:"ui-at-diff__done",children:[b("svg",{className:"ui-at-diff__tick",width:"20",height:"20",viewBox:"0 0 20 20","aria-hidden":"true",children:[a("circle",{cx:"10",cy:"10",r:"10"}),a("path",{d:"m5.8 10.3 2.8 2.8 5.6-6"})]}),"All changes reviewed"]}),a("button",{ref:Q,type:"button",className:"ui-at-diff__secondary",onClick:te,disabled:!t.length,children:"Undo"})]})]}),b("div",{className:"ui-at-diff__body",ref:G,onAnimationEnd:()=>X(e=>e+1),onKeyDown:e=>{e.key==="Escape"&&u?.by==="arrow"&&g(null)},children:[a("p",{className:"ui-at-diff__text",children:m.map((e,i)=>{if(e.type==="equal")return a("span",{children:e.text},i);let o=v.indexOf(i),s=f[o]??"pending";if(s==="pending")return b("span",{ref:n=>{n?j.current.set(o,n):j.current.delete(o)},className:"ui-at-diff__chg","data-state":"pending","data-active":R===o||void 0,role:"button",tabIndex:0,"aria-label":`Suggestion ${o+1} of ${N}: ${Ne(e)}. Press Y to accept, N to reject`,"aria-describedby":R===o?`${_}-pop`:void 0,onFocus:()=>{window.clearTimeout(T.current),g({k:o,by:"focus"})},onBlur:n=>{F.current?.contains(n.relatedTarget)||g(h=>h?.k===o&&h.by==="focus"?null:h)},onMouseEnter:()=>{window.clearTimeout(T.current),g(n=>n?.by==="focus"?n:{k:o,by:"hover"})},onMouseLeave:ae,onClick:n=>n.currentTarget.focus(),onKeyDown:n=>{let h=n.key.toLowerCase();h==="y"||n.key==="Enter"?(n.preventDefault(),A(o,"accepted",!0)):h==="n"||n.key==="Backspace"?(n.preventDefault(),A(o,"rejected",!0)):n.key==="Escape"&&(n.preventDefault(),n.currentTarget.blur(),g(null))},children:[e.remove&&a("del",{className:"ui-at-diff__del",children:e.remove}),e.insert&&a("ins",{className:"ui-at-diff__ins",children:e.insert})]},i);let c=s==="accepted"?e.insert:e.remove,L=s==="accepted"?e.remove:e.insert;return b("span",{className:"ui-at-diff__chg","data-state":s,children:[L&&ge.has(o)&&a("span",{className:"ui-at-diff__gone","data-side":s==="accepted"?"del":"ins","aria-hidden":"true",children:L}),c&&a("span",{className:"ui-at-diff__kept","data-side":s==="accepted"?"ins":"del",children:c})]},i)})}),N===0&&a("p",{className:"ui-at-diff__empty",children:"Nothing to review \u2013 the suggestion matches the text."}),b("div",{ref:F,id:`${_}-pop`,className:"ui-at-diff__pop","data-show":R!==null&&q!==null||void 0,"data-below":q?.below||void 0,style:q?{left:q.left,top:q.top}:{left:8,top:0},"aria-hidden":R===null,onMouseEnter:()=>window.clearTimeout(T.current),onMouseLeave:ae,children:[b("button",{type:"button",tabIndex:-1,"aria-label":"Accept change",onMouseDown:e=>e.preventDefault(),onClick:()=>R!==null&&A(R,"accepted",u?.by==="focus"),children:[a(Me,{}),"Accept",a("kbd",{children:"Y"})]}),a("span",{className:"ui-at-diff__sep","aria-hidden":"true"}),b("button",{type:"button",tabIndex:-1,"aria-label":"Reject change",onMouseDown:e=>e.preventDefault(),onClick:()=>R!==null&&A(R,"rejected",u?.by==="focus"),children:[a(je,{}),"Reject",a("kbd",{children:"N"})]})]})]})]}),a("div",{className:"ui-at-diff__sr",role:"status","aria-live":"polite",children:ue})]})}var Re=`
.ui-at-diff {
  --on-berry: #ffffff;
  --frame: #f2f6fa; --panel: #ffffff; --soft: rgba(26, 62, 112, 0.06);
  --line: #dae2ec; --line-firm: #cbd6e4;
  --ink: #00162b; --text: rgba(0, 22, 43, 0.66); --muted: rgba(0, 22, 43, 0.54);
  --berry: #851437; --berry-hover: #6d0f2d;
  --info-ink: #1a3e70; --info-fill: #eef5ff; --info-line: #c1daff; --ring: #8fbdf2;
  --ok-ink: #1d6a34; --ok-fill: #eafbee; --ok-line: #c9f5cf;
  --bad-ink: #8a3a22; --bad-fill: #fdeee8; --bad-line: #f5d5c9;
  --secondary: #fbfcfe;
  --pebble: #ffffff; --pebble-shade: inset 0 -2px 6px -4px rgba(26, 62, 112, 0.4);
  --short-drop: 0 2px 4px -2px rgba(26, 62, 112, 0.22);
  --drop: 0 8px 16px -8px rgba(26, 62, 112, 0.2);
  --raised: 0 18px 30px -16px rgba(26, 62, 112, 0.38), 0 4px 10px -6px rgba(26, 62, 112, 0.18);
  --float: 0 24px 48px -24px rgba(26, 62, 112, 0.3);
  --berry-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 6px 12px -6px rgba(133, 20, 55, 0.6);
  --ease: cubic-bezier(.16, 1, .3, 1);
  container-type: inline-size;
  box-sizing: border-box;
  width: 100%;
  max-width: 560px;
  min-width: 0;
  padding: 6px;
  border-radius: 22px;
  background: var(--frame);
  border: 1px solid var(--line);
  box-shadow: var(--float);
  font-family: "Avenir Next", Avenir, system-ui, sans-serif;
  font-size: 15px;
  color: var(--text);
  text-align: left;
}
:where(.dark, [data-theme="dark"]) .ui-at-diff {
  --frame: #0f2747; --panel: #16345c; --soft: rgba(255, 255, 255, 0.07);
  --line: rgba(255, 255, 255, 0.12); --line-firm: rgba(255, 255, 255, 0.18);
  --ink: rgba(255, 255, 255, 0.94); --text: rgba(255, 255, 255, 0.72); --muted: rgba(255, 255, 255, 0.56);
  --berry: #a8204d; --berry-hover: #bd2a5a;
  --info-ink: #c1daff; --info-fill: rgba(143, 189, 242, 0.16); --info-line: rgba(143, 189, 242, 0.34); --ring: rgba(143, 189, 242, 0.6);
  --ok-ink: #7fe0a0; --ok-fill: rgba(127, 224, 160, 0.14); --ok-line: rgba(127, 224, 160, 0.3);
  --bad-ink: #f2a48c; --bad-fill: rgba(242, 164, 140, 0.14); --bad-line: rgba(242, 164, 140, 0.3);
  --secondary: #1b3d68;
  --pebble: #1d4170; --pebble-shade: inset 0 -2px 6px -4px rgba(3, 12, 28, 0.8);
  --short-drop: 0 2px 4px -2px rgba(3, 12, 28, 0.6);
  --drop: 0 8px 16px -8px rgba(3, 12, 28, 0.6);
  --raised: 0 18px 30px -16px rgba(3, 12, 28, 0.8), 0 4px 10px -6px rgba(3, 12, 28, 0.6);
  --float: 0 24px 48px -24px rgba(3, 12, 28, 0.7);
  --berry-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 6px 12px -6px rgba(3, 12, 28, 0.8);
}
.ui-at-diff *, .ui-at-diff *::before, .ui-at-diff *::after { box-sizing: border-box; }
.ui-at-diff button { font: inherit; color: inherit; }
.ui-at-diff :focus-visible { outline: none; box-shadow: 0 0 0 3px var(--ring); }

.ui-at-diff__label { display: flex; align-items: center; gap: 7px; margin: 0; padding: 4px 10px 8px; font-size: 12.5px; color: var(--muted); }
.ui-at-diff__label svg { flex: none; color: var(--berry); }
.ui-at-diff__label span { min-width: 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }

.ui-at-diff__panel { background: var(--panel); border: 1px solid var(--line); border-radius: 16px; box-shadow: var(--raised); }
.ui-at-diff__bar { display: grid; padding: 10px 10px 10px 14px; border-bottom: 1px solid var(--line); }
.ui-at-diff__layer {
  grid-area: 1 / 1;
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  opacity: 0;
  visibility: hidden;
  transition: opacity 300ms var(--ease), visibility 0s linear 300ms;
}
.ui-at-diff__layer[data-show] { opacity: 1; visibility: visible; transition: opacity 300ms var(--ease), visibility 0s; }
.ui-at-diff__count { flex: 1; min-width: 0; display: inline-flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; color: var(--ink); }
.ui-at-diff__num {
  display: grid;
  place-items: center;
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  border-radius: 999px;
  background: var(--ok-fill);
  border: 1px solid var(--ok-line);
  color: var(--ok-ink);
  font-size: 12px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}
.ui-at-diff__countlabel { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.ui-at-diff__arrows { display: inline-flex; gap: 2px; margin-right: 4px; }
.ui-at-diff__arrow {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border: 0;
  border-radius: 9px;
  background: transparent;
  color: var(--muted);
  cursor: pointer;
  transition: background-color 150ms var(--ease), color 150ms var(--ease);
}
.ui-at-diff__arrow:hover:not(:disabled) { background: var(--soft); color: var(--ink); }
.ui-at-diff__arrow:disabled { opacity: 0.4; cursor: default; }
.ui-at-diff__secondary, .ui-at-diff__primary {
  flex: none;
  height: 34px;
  padding: 0 12px;
  border-radius: 10px;
  font-size: 13.5px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 150ms var(--ease), border-color 150ms var(--ease), box-shadow 150ms var(--ease);
}
.ui-at-diff__secondary { border: 1px solid var(--line-firm); background: var(--secondary); box-shadow: var(--short-drop); color: var(--ink) !important; }
.ui-at-diff__secondary:hover:not(:disabled) { border-color: var(--info-line); }
.ui-at-diff__primary { border: 0; background: var(--berry); box-shadow: var(--berry-shadow); color: var(--on-berry) !important; }
.ui-at-diff__primary:hover:not(:disabled) { background: var(--berry-hover); }
.ui-at-diff__secondary:disabled, .ui-at-diff__primary:disabled { opacity: 0.5; cursor: default; }
.ui-at-diff__done { flex: 1; min-width: 0; display: inline-flex; align-items: center; gap: 9px; font-size: 14px; font-weight: 600; color: var(--ink); }
.ui-at-diff__tick circle { fill: var(--ok-fill); stroke: var(--ok-line); }
.ui-at-diff__tick path { fill: none; stroke: var(--ok-ink); stroke-width: 1.9; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 13; stroke-dashoffset: 13; }
.ui-at-diff__layer[data-show] .ui-at-diff__tick path { animation: ui-at-diff-draw 360ms var(--ease) 120ms forwards; }

.ui-at-diff__body { position: relative; padding: 16px 18px 18px; }
.ui-at-diff__text { margin: 0; line-height: 1.75; overflow-wrap: anywhere; }
.ui-at-diff__empty { margin: 6px 0 0; font-size: 13px; color: var(--muted); }
.ui-at-diff__chg { border-radius: 5px; }
.ui-at-diff__chg[data-state="pending"] { cursor: pointer; transition: box-shadow 150ms var(--ease); }
.ui-at-diff__chg[data-state="pending"]:focus-visible,
.ui-at-diff__chg[data-active] { box-shadow: 0 0 0 2px var(--info-line); }
.ui-at-diff__chg[data-state="pending"]:focus-visible { box-shadow: 0 0 0 3px var(--ring); }
.ui-at-diff__del, .ui-at-diff__ins, .ui-at-diff__kept, .ui-at-diff__gone {
  border-radius: 4px;
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
}
.ui-at-diff__del {
  padding: 1px 2px;
  background: var(--bad-fill);
  color: var(--bad-ink);
  text-decoration: line-through;
  text-decoration-color: currentColor;
  text-decoration-thickness: 1.5px;
}
.ui-at-diff__ins { margin-left: 3px; padding: 1px 3px; background: var(--ok-fill); color: var(--ok-ink); text-decoration: none; }
.ui-at-diff__del:only-child, .ui-at-diff__ins:only-child { margin-left: 0; }

/* after a decision: the kept side settles, the dropped side shrinks away */
.ui-at-diff__kept { animation: ui-at-diff-settle-ins 300ms var(--ease) both; }
.ui-at-diff__kept[data-side="del"] { animation-name: ui-at-diff-settle-del; }
.ui-at-diff__gone {
  display: inline;
  user-select: none;
  animation: ui-at-diff-shrink 300ms var(--ease) forwards;
}
.ui-at-diff__gone[data-side="del"] { color: var(--bad-ink); background: var(--bad-fill); text-decoration: line-through; }
.ui-at-diff__gone[data-side="ins"] { color: var(--ok-ink); background: var(--ok-fill); }

.ui-at-diff__pop {
  position: absolute;
  z-index: 5;
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 4px;
  border-radius: 12px;
  background: var(--panel);
  border: 1px solid var(--line-firm);
  box-shadow: var(--raised);
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transform: translateY(4px);
  pointer-events: none;
  transition: opacity 150ms var(--ease), transform 150ms var(--ease), left 150ms var(--ease), top 150ms var(--ease), visibility 0s linear 150ms;
}
.ui-at-diff__pop[data-below] { transform: translateY(-4px); }
.ui-at-diff__pop[data-show] { opacity: 1; visibility: visible; transform: none; pointer-events: auto; transition: opacity 150ms var(--ease), transform 150ms var(--ease), left 150ms var(--ease), top 150ms var(--ease), visibility 0s; }
.ui-at-diff__pop button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 30px;
  padding: 0 6px 0 9px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  font-size: 13px;
  font-weight: 600;
  color: var(--ink);
  cursor: pointer;
  transition: background-color 150ms var(--ease), color 150ms var(--ease);
}
.ui-at-diff__pop button:first-child:hover { background: var(--ok-fill); color: var(--ok-ink); }
.ui-at-diff__pop button:last-child:hover { background: var(--bad-fill); color: var(--bad-ink); }
.ui-at-diff__pop kbd {
  display: grid;
  place-items: center;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  border-radius: 5px;
  background: var(--pebble);
  border: 1px solid var(--line);
  border-bottom-color: var(--line-firm);
  box-shadow: 0 1px 0 var(--line-firm);
  font: 600 10.5px/1 "Avenir Next", Avenir, system-ui, sans-serif;
  color: var(--muted);
}
.ui-at-diff__sep { width: 1px; height: 18px; background: var(--line); }
.ui-at-diff__sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); clip-path: inset(50%); white-space: nowrap; }

@keyframes ui-at-diff-shrink { from { font-size: 1em; opacity: 1; } to { font-size: 0; opacity: 0; padding: 0; margin: 0; } }
@keyframes ui-at-diff-settle-ins { from { background: var(--ok-fill); color: var(--ok-ink); } to { background: transparent; color: inherit; } }
@keyframes ui-at-diff-settle-del { from { background: var(--bad-fill); color: var(--bad-ink); text-decoration: line-through; } to { background: transparent; color: inherit; text-decoration: line-through transparent; } }
@keyframes ui-at-diff-draw { to { stroke-dashoffset: 0; } }

@container (max-width: 400px) {
  .ui-at-diff__arrows { display: none; }
  .ui-at-diff__bar { padding: 8px 8px 8px 12px; }
  .ui-at-diff__secondary, .ui-at-diff__primary { padding: 0 10px; font-size: 13px; }
  .ui-at-diff__body { padding: 14px 14px 16px; }
}
@container (max-width: 330px) {
  .ui-at-diff__countlabel { display: none; }
}
@media (pointer: coarse) {
  .ui-at-diff__pop button { height: 40px; padding: 0 12px; }
  .ui-at-diff__pop kbd { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .ui-at-diff *, .ui-at-diff *::before, .ui-at-diff *::after { animation-duration: 0s !important; animation-delay: 0s !important; transition-duration: 0s !important; }
  .ui-at-diff__tick path { stroke-dashoffset: 0; }
}
`;var Ie="Hi everyone, we are very excited to announce that the new dashboard is now available for all users. It loads a lot faster than before, and you can now export any report to CSV with just a single click. Let us know what you think!",Se="Hi everyone, the new dashboard is now live for all users. It loads twice as fast, and you can now export any report to CSV in one click. Let us know what you think!";function Te(){return a(ce,{label:"Suggested by AI \xB7 Make it shorter",original:Ie,suggested:Se})}export{Te as default};
