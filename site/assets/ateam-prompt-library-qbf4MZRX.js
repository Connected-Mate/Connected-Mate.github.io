"use client";import{t as Mi}from"./react-BkAXpnfr.js";var Si=Mi();var{Children:Wi,Component:qi,Fragment:U,StrictMode:Ui,cloneElement:Yi,createContext:Ji,createElement:Qi,createRef:Zi,forwardRef:Gi,isValidElement:Xi,lazy:ie,memo:ee,startTransition:te,Suspense:re,use:ae,useCallback:Y,useContext:ne,useDebugValue:le,useDeferredValue:oe,useEffect:w,useId:oi,useImperativeHandle:pe,useInsertionEffect:se,useLayoutEffect:pi,useMemo:k,useOptimistic:ue,useReducer:de,useRef:P,useState:f,useSyncExternalStore:be,useTransition:ce}=Si;import{t as Li}from"./jsx-runtime-CTsRTJUX.js";var Ai=Li(),{jsx:r,jsxs:o,Fragment:ge}=Ai;var Ii=/\{([A-Za-z0-9_-]+)\}/g,si=["blue","violet","amber","green","red","gray"];function ui(a){let l=[],p=0;for(let m of a.matchAll(Ii)){let E=m.index??0;E>p&&l.push({kind:"text",text:a.slice(p,E)}),l.push({kind:"var",name:m[1]}),p=E+m[0].length}return p<a.length&&l.push({kind:"text",text:a.slice(p)}),l}function di(a){let l=[];for(let p of a)p.kind==="var"&&!l.includes(p.name)&&l.push(p.name);return l}function Di(a,l){return a.map(p=>p.kind==="text"?p.text:l[p.name]?.trim()||`{${p.name}}`).join("")}function J(a){let l={};for(let[p,m]of Object.entries(a.variables??{}))m.default&&(l[p]=m.default);return l}function I(a){return a.replace(/[-_]+/g," ")}async function Vi(a){try{if(navigator.clipboard?.writeText)return await navigator.clipboard.writeText(a),!0}catch{}try{let l=document.createElement("textarea");l.value=a,l.setAttribute("readonly",""),l.style.position="fixed",l.style.opacity="0",document.body.appendChild(l),l.select();let p=document.execCommand("copy");return l.remove(),p}catch{return!1}}var Hi=typeof window>"u"?w:pi;function bi({templates:a,value:l,defaultValue:p,onSelect:m,onUse:E,onCopy:ci,title:Q="Prompts",useLabel:fi="Use prompt",className:mi}){let h=oi().replace(/:/g,""),[gi,hi]=f(p??a[0]?.id??""),N=l??gi,n=a.find(i=>i.id===N)??a[0],[z,D]=f(""),[V,_i]=f({}),[T,Z]=f(null),[C,H]=f(!1),[G,xi]=f(0),[vi,R]=f(""),M=P(null),K=P(null),O=P(new Map),X=k(()=>{let i=new Map;for(let t of a)t.category&&t.tone&&!i.has(t.category)&&i.set(t.category,t.tone);let e=0;for(let t of a)!t.category||i.has(t.category)||i.set(t.category,si[e++%si.length]);return t=>t.tone??(t.category?i.get(t.category)??"gray":"gray")},[a]),u=k(()=>{let i=z.trim().toLowerCase();return i?a.filter(e=>[e.title,e.category??"",e.body].some(t=>t.toLowerCase().includes(i))):a},[a,z]),F=Y(i=>{i!==N&&(l===void 0&&hi(i),m?.(i))},[N,l,m]),$=k(()=>n?ui(n.body):[],[n]),_=k(()=>di($),[$]),x=k(()=>n?{...J(n),...V[n.id]??{}}:{},[n,V]),yi=_.filter(i=>x[i]?.trim()).length,d=_.length-yi,S=k(()=>Di($,x),[$,x]),ii=Math.max(0,Math.ceil(S.length/4)),ei=P({});w(()=>{let i=ei.current;i.id===n?.id&&i.missing>0&&d===0&&(xi(e=>e+1),R("All variables filled. Ready to use.")),ei.current={id:n?.id,missing:d}},[d,n?.id]),w(()=>{if(!C)return;let i=setTimeout(()=>H(!1),1400);return()=>clearTimeout(i)},[C]),w(()=>{if(!T)return;let i=setTimeout(()=>Z(null),900);return()=>clearTimeout(i)},[T]);let[B,ti]=f(null),j=P(n?.id);w(()=>{if(j.current===n?.id)return;let i=a.find(t=>t.id===j.current)??null;j.current=n?.id,ti(i),H(!1);let e=setTimeout(()=>ti(null),320);return()=>clearTimeout(e)},[n?.id,a]);let[L,wi]=f(null),A=Y(()=>{let i=M.current?.querySelector('[aria-selected="true"]');wi(i?{top:i.offsetTop,height:i.offsetHeight}:null)},[]);Hi(A,[A,N,u]),w(()=>{let i=M.current;if(!i||typeof ResizeObserver>"u")return;let e=new ResizeObserver(A);return e.observe(i),()=>e.disconnect()},[A]);let ki=(i,e)=>{n&&(_i(t=>({...t,[n.id]:{...J(n),...t[n.id]??{},[i]:e}})),Z(t=>({name:i,key:(t?.key??0)+1})))},ri=i=>{let e=M.current?.querySelector(`[data-id="${CSS.escape(i)}"]`);e?.focus(),e?.scrollIntoView?.({block:"nearest"})},Ni=i=>{if(!u.length)return;let e=Math.max(0,u.findIndex(c=>c.id===N)),t=-1;if(i.key==="ArrowDown")t=Math.min(u.length-1,e+1);else if(i.key==="ArrowUp")t=e-1;else if(i.key==="Home")t=0;else if(i.key==="End")t=u.length-1;else return;if(i.preventDefault(),t<0){K.current?.focus();return}F(u[t].id),ri(u[t].id)},Ti=i=>{if(i.key==="Escape"&&z)i.preventDefault(),D("");else if(i.key==="ArrowDown"&&u.length){i.preventDefault();let e=u.find(t=>t.id===N)??u[0];F(e.id),ri(e.id)}},ai=i=>{let e=i?_.indexOf(i)+1:0,c=[..._.slice(e),..._.slice(0,e)].find(v=>!x[v]?.trim()&&v!==i);return c&&O.current.get(c)?.focus(),!!c},ni=()=>{if(!n)return;if(d>0){R(`${d} ${d===1?"variable is":"variables are"} still empty.`),ai();return}let i={};for(let e of _)i[e]=x[e].trim();E?.(S,n,i),R(`Prompt used: ${n.title}.`)},Ci=async()=>{await Vi(S)?(H(!0),R("Prompt copied."),ci?.(S)):R("Could not copy \u2013 select the preview text instead.")},Pi=(i,e)=>{if(i.key!=="Enter")return;i.preventDefault();let t=ai(e);!t&&!x[e]?.trim()||!t&&d===0&&ni()},Ei=L?{"--ui-plib-marker-y":`${L.top}px`,"--ui-plib-marker-h":`${L.height}px`}:void 0,li=(i,e)=>{let t=e?$:ui(i.body),c=e?_:di(t),v=e?x:{...J(i),...V[i.id]??{}},zi=c.filter(b=>v[b]?.trim()).length,Ri=i.variables??{};return o("div",{className:"ui-plib__view","data-live":e?"":void 0,inert:e?void 0:!0,"aria-hidden":e?void 0:!0,children:[o("div",{className:"ui-plib__view-head",children:[r("h3",{className:"ui-plib__view-title",children:i.title}),i.category?r("span",{className:"ui-plib__chip","data-tone":X(i),children:i.category}):null,c.length?o("span",{className:"ui-plib__progress",children:[r("span",{className:"ui-plib__bars","aria-hidden":"true",children:c.map(b=>r("span",{className:"ui-plib__bar","data-on":v[b]?.trim()?"":void 0},b))}),o("span",{className:"ui-plib__progress-text",children:[zi," of ",c.length," filled"]})]}):null]}),r("p",{className:"ui-plib__sentence",children:t.map((b,y)=>{if(b.kind==="text")return r(U,{children:b.text},y);let s=b.name,W=v[s]??"",q=Ri[s]?.description,$i=t.findIndex(g=>g.kind==="var"&&g.name===s)===y;return r("span",{className:"ui-plib__field","data-filled":W.trim()?"":void 0,"data-flash":e&&T?.name===s?T.key%2?"a":"b":void 0,"data-value":W||I(s),children:r("input",{ref:g=>{!e||!$i||(g?O.current.set(s,g):O.current.delete(s))},className:"ui-plib__input",value:W,placeholder:I(s),size:1,spellCheck:!1,autoComplete:"off","aria-label":q?`${I(s)} \u2013 ${q}`:I(s),title:q,tabIndex:e?void 0:-1,onChange:g=>ki(s,g.target.value),onKeyDown:g=>Pi(g,s)})},y)})}),r("div",{className:"ui-plib__label",id:`${h}-${e?"preview":"preview-out"}`,children:"Preview"}),r("p",{className:"ui-plib__preview","aria-labelledby":`${h}-${e?"preview":"preview-out"}`,children:t.map((b,y)=>{if(b.kind==="text")return r(U,{children:b.text},y);let s=v[b.name]?.trim();return s?r("strong",{className:"ui-plib__filled","data-flash":e&&T?.name===b.name?T.key%2?"a":"b":void 0,children:s},y):r("span",{className:"ui-plib__hole",children:`{${b.name}}`},y)})})]},e?`live-${i.id}`:`out-${i.id}`)};return o("div",{className:["ui-plib",mi].filter(Boolean).join(" "),role:"group","aria-labelledby":`${h}-title`,children:[r("style",{href:"ui-prompt-library",precedence:"default",children:Ki}),o("div",{className:"ui-plib__frame",children:[o("div",{className:"ui-plib__panel",children:[o("div",{className:"ui-plib__side",children:[o("div",{className:"ui-plib__side-head",children:[r("h2",{className:"ui-plib__title",id:`${h}-title`,children:Q}),r("span",{className:"ui-plib__count","aria-label":`${a.length} templates`,children:a.length})]}),o("label",{className:"ui-plib__search",children:[o("svg",{viewBox:"0 0 16 16","aria-hidden":"true",children:[r("circle",{cx:"7",cy:"7",r:"4.4"}),r("path",{d:"M10.3 10.3l3.2 3.2"})]}),r("input",{ref:K,type:"search",value:z,placeholder:"Search templates","aria-label":"Search templates","aria-controls":`${h}-list`,autoComplete:"off",spellCheck:!1,onChange:i=>D(i.target.value),onKeyDown:Ti})]}),o("div",{ref:M,className:"ui-plib__list",id:`${h}-list`,role:"listbox","aria-label":Q,style:Ei,onKeyDown:Ni,children:[L?r("span",{className:"ui-plib__marker","aria-hidden":"true"}):null,u.map(i=>{let e=i.id===n?.id,t=e||!u.some(c=>c.id===n?.id)&&i===u[0];return o("div",{"data-id":i.id,role:"option","aria-selected":e,tabIndex:t?0:-1,className:"ui-plib__option",onClick:()=>F(i.id),children:[r("span",{className:"ui-plib__option-title",children:i.title}),i.category?r("span",{className:"ui-plib__chip","data-tone":X(i),children:i.category}):null]},i.id)}),u.length?null:o("div",{className:"ui-plib__empty",children:["No template matches \u201C",z.trim(),"\u201D.",r("button",{type:"button",className:"ui-plib__ghost",onClick:()=>{D(""),K.current?.focus()},children:"Clear search"})]})]})]}),r("div",{className:"ui-plib__main",children:n?o("div",{className:"ui-plib__stack",children:[B&&B.id!==n.id?li(B,!1):null,li(n,!0)]}):r("div",{className:"ui-plib__blank",children:"No templates yet. Saved prompts will show up here."})})]}),o("div",{className:"ui-plib__tray",children:[o("span",{className:"ui-plib__tokens",title:"Estimate \u2013 about four characters per token",children:["~",r("span",{className:"ui-plib__tokens-num",children:ii},ii)," tokens"]}),r("span",{className:"ui-plib__tray-note","aria-hidden":d===0?!0:void 0,children:n&&d>0?`${d} to fill`:""}),o("button",{type:"button",className:"ui-plib__copy",onClick:Ci,disabled:!n,"data-copied":C?"":void 0,"aria-label":C?"Copied":"Copy prompt",children:[r("span",{className:"ui-plib__copy-icon","aria-hidden":"true",children:C?r("svg",{viewBox:"0 0 16 16",children:r("path",{d:"M3.6 8.4l2.9 2.9 6-6.5"})}):o("svg",{viewBox:"0 0 16 16",children:[r("rect",{x:"5.4",y:"5.4",width:"7.6",height:"7.6",rx:"1.6"}),r("path",{d:"M10.4 3.6V3.4A1.4 1.4 0 0 0 9 2H4.4A1.4 1.4 0 0 0 3 3.4V8a1.4 1.4 0 0 0 1.4 1.4h.2"})]})}),r("span",{className:"ui-plib__copy-label",children:C?"Copied":"Copy"})]}),o("button",{type:"button",className:"ui-plib__use","aria-disabled":d>0||!n?!0:void 0,"aria-describedby":`${h}-missing`,"data-pulse":G?G%2?"a":"b":void 0,onClick:ni,children:[fi,r("svg",{viewBox:"0 0 16 16","aria-hidden":"true",children:r("path",{d:"M3.5 8h8.6M8.6 4.4 12.2 8l-3.6 3.6"})})]}),r("span",{className:"ui-plib__sr",id:`${h}-missing`,children:d>0?`${d} ${d===1?"variable":"variables"} still empty`:"Ready"})]})]}),r("div",{className:"ui-plib__sr",role:"status","aria-live":"polite","aria-atomic":"true",children:vi})]})}var Ki=`
.ui-plib {
  --ui-plib-frame: #f2f6fa;
  --ui-plib-panel: #ffffff;
  --ui-plib-soft: rgba(26, 62, 112, 0.06);
  --ui-plib-hairline: #dae2ec;
  --ui-plib-firm: #cbd6e4;
  --ui-plib-ink: #00162b;
  --ui-plib-text: rgba(0, 22, 43, 0.66);
  --ui-plib-muted: rgba(0, 22, 43, 0.54);
  --ui-plib-secondary: #fbfcfe;
  --ui-plib-field: #ffffff;
  --ui-plib-berry: #851437;
  --ui-plib-berry-hover: #6d0f2d;
  --ui-plib-ring: #8fbdf2;
  --ui-plib-info-ink: #1a3e70;
  --ui-plib-info-fill: #eef5ff;
  --ui-plib-info-line: #c1daff;
  --ui-plib-success-ink: #1d6a34;
  --ui-plib-success-fill: #eafbee;
  --ui-plib-success-line: #c9f5cf;
  --ui-plib-waiting-ink: #775810;
  --ui-plib-waiting-fill: #fdf6dd;
  --ui-plib-waiting-line: #fae6a0;
  --ui-plib-danger-ink: #8a3a22;
  --ui-plib-danger-fill: #fdeee8;
  --ui-plib-danger-line: #f5d5c9;
  --ui-plib-brand-ink: #851437;
  --ui-plib-brand-fill: #fbeef2;
  --ui-plib-brand-line: #f1cdd8;
  --ui-plib-inner: inset 0 1px 2px rgba(26, 62, 112, 0.08);
  --ui-plib-drop: 0 8px 16px -8px rgba(26, 62, 112, 0.2);
  --ui-plib-short: 0 2px 4px -2px rgba(26, 62, 112, 0.2);
  --ui-plib-raised: 0 18px 30px -16px rgba(26, 62, 112, 0.38), 0 4px 10px -6px rgba(26, 62, 112, 0.18);
  --ui-plib-floating: 0 24px 48px -24px rgba(26, 62, 112, 0.3);
  --ui-plib-ease: cubic-bezier(0.16, 1, 0.3, 1);
  container-type: inline-size;
  width: 100%;
  max-width: 640px;
  font-family: "Avenir Next", Avenir, system-ui, sans-serif;
  color: var(--ui-plib-ink);
}
:where(.dark, [data-theme="dark"]) .ui-plib {
  --ui-plib-frame: #0f2747;
  --ui-plib-panel: #16345c;
  --ui-plib-soft: rgba(255, 255, 255, 0.07);
  --ui-plib-hairline: rgba(255, 255, 255, 0.12);
  --ui-plib-firm: rgba(255, 255, 255, 0.18);
  --ui-plib-ink: rgba(255, 255, 255, 0.94);
  --ui-plib-text: rgba(255, 255, 255, 0.72);
  --ui-plib-muted: rgba(255, 255, 255, 0.56);
  --ui-plib-secondary: rgba(255, 255, 255, 0.05);
  --ui-plib-field: rgba(255, 255, 255, 0.04);
  --ui-plib-berry: #a8204d;
  --ui-plib-berry-hover: #bd2a5a;
  --ui-plib-ring: rgba(143, 189, 242, 0.6);
  --ui-plib-info-ink: #c1daff;
  --ui-plib-info-fill: rgba(143, 189, 242, 0.16);
  --ui-plib-info-line: rgba(143, 189, 242, 0.3);
  --ui-plib-success-ink: #7fe0a0;
  --ui-plib-success-fill: rgba(127, 224, 160, 0.14);
  --ui-plib-success-line: rgba(127, 224, 160, 0.28);
  --ui-plib-waiting-ink: #f3d27a;
  --ui-plib-waiting-fill: rgba(243, 210, 122, 0.14);
  --ui-plib-waiting-line: rgba(243, 210, 122, 0.28);
  --ui-plib-danger-ink: #f2a48c;
  --ui-plib-danger-fill: rgba(242, 164, 140, 0.14);
  --ui-plib-danger-line: rgba(242, 164, 140, 0.28);
  --ui-plib-brand-ink: #f3a3bd;
  --ui-plib-brand-fill: rgba(243, 163, 189, 0.14);
  --ui-plib-brand-line: rgba(243, 163, 189, 0.28);
  --ui-plib-inner: inset 0 1px 2px rgba(3, 12, 28, 0.4);
  --ui-plib-drop: 0 8px 16px -8px rgba(3, 12, 28, 0.6);
  --ui-plib-short: 0 2px 4px -2px rgba(3, 12, 28, 0.6);
  --ui-plib-raised: 0 18px 30px -16px rgba(3, 12, 28, 0.8), 0 4px 10px -6px rgba(3, 12, 28, 0.6);
  --ui-plib-floating: 0 24px 48px -24px rgba(3, 12, 28, 0.8);
}
.ui-plib *, .ui-plib *::before, .ui-plib *::after { box-sizing: border-box; }

.ui-plib__frame {
  padding: 6px;
  border-radius: 22px;
  background: var(--ui-plib-frame);
  border: 1px solid var(--ui-plib-hairline);
  box-shadow: var(--ui-plib-floating), var(--ui-plib-drop);
}
.ui-plib__panel {
  display: grid;
  grid-template-columns: minmax(180px, 34%) 1fr;
  border-radius: 16px;
  background: var(--ui-plib-panel);
  border: 1px solid var(--ui-plib-hairline);
  box-shadow: var(--ui-plib-raised);
  overflow: hidden;
}

/* List side */
.ui-plib__side { display: flex; flex-direction: column; gap: 10px; min-width: 0; padding: 14px 8px 10px; border-right: 1px solid var(--ui-plib-hairline); }
.ui-plib__side-head { display: flex; align-items: baseline; gap: 6px; padding: 0 6px; }
.ui-plib__title {
  margin: 0;
  font-family: "Avenir Next Condensed", "Avenir Next", Avenir, system-ui, sans-serif;
  font-weight: 700;
  font-size: 16px;
  line-height: 20px;
}
.ui-plib__count { font-size: 12px; font-weight: 600; color: var(--ui-plib-muted); font-variant-numeric: tabular-nums; }

.ui-plib__search {
  display: flex;
  align-items: center;
  gap: 7px;
  height: 34px;
  margin: 0 2px;
  padding: 0 10px;
  border-radius: 10px;
  border: 1px solid var(--ui-plib-firm);
  background: var(--ui-plib-field);
  box-shadow: var(--ui-plib-inner);
  transition: box-shadow 150ms var(--ui-plib-ease), border-color 150ms var(--ui-plib-ease);
}
.ui-plib__search:focus-within { border-color: var(--ui-plib-info-line); box-shadow: var(--ui-plib-inner), 0 0 0 3px var(--ui-plib-ring); }
.ui-plib__search svg { flex: none; width: 14px; height: 14px; fill: none; stroke: var(--ui-plib-muted); stroke-width: 1.5; stroke-linecap: round; }
.ui-plib__search input {
  flex: 1;
  min-width: 0;
  height: 100%;
  border: 0;
  padding: 0;
  background: transparent;
  outline: none;
  font: inherit;
  font-size: 13px;
  color: var(--ui-plib-ink);
  caret-color: var(--ui-plib-berry);
}
.ui-plib__search input::placeholder { color: var(--ui-plib-muted); }
.ui-plib__search input::-webkit-search-cancel-button { display: none; }

.ui-plib__list { position: relative; display: grid; grid-template-columns: minmax(0, 1fr); align-content: start; gap: 2px; min-height: 0; max-height: 260px; overflow-y: auto; padding: 0 2px; scrollbar-width: thin; }
.ui-plib__marker {
  position: absolute;
  left: 2px;
  right: 2px;
  top: 0;
  height: var(--ui-plib-marker-h);
  transform: translateY(var(--ui-plib-marker-y));
  border-radius: 10px;
  background: var(--ui-plib-info-fill);
  box-shadow: inset 2px 0 0 var(--ui-plib-berry);
  transition: transform 300ms var(--ui-plib-ease), height 300ms var(--ui-plib-ease);
  pointer-events: none;
}
.ui-plib__option {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-width: 0;
  min-height: 36px;
  padding: 6px 8px 6px 10px;
  border-radius: 10px;
  font-size: 13.5px;
  color: var(--ui-plib-text);
  cursor: pointer;
  outline: none;
  transition: background-color 150ms var(--ui-plib-ease), color 150ms var(--ui-plib-ease);
}
.ui-plib__option:hover:not([aria-selected="true"]) { background: var(--ui-plib-soft); }
.ui-plib__option[aria-selected="true"] { color: var(--ui-plib-ink); font-weight: 600; }
.ui-plib__option:focus-visible { box-shadow: 0 0 0 3px var(--ui-plib-ring); }
.ui-plib__option-title { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ui-plib__empty { display: grid; justify-items: start; gap: 6px; padding: 8px 8px 4px; font-size: 13px; color: var(--ui-plib-muted); overflow-wrap: anywhere; }
.ui-plib__ghost {
  padding: 4px 8px;
  margin-left: -8px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  font: inherit;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--ui-plib-info-ink);
  cursor: pointer;
}
.ui-plib__ghost:hover { background: var(--ui-plib-soft); }
.ui-plib__ghost:focus-visible { outline: none; box-shadow: 0 0 0 3px var(--ui-plib-ring); }

/* Chips \u2013 fill + hairline + ink */
.ui-plib__chip {
  --tone-ink: var(--ui-plib-muted);
  --tone-fill: var(--ui-plib-soft);
  --tone-line: var(--ui-plib-hairline);
  flex: none;
  display: inline-flex;
  align-items: center;
  height: 20px;
  padding: 0 6px;
  border-radius: 6px;
  border: 1px solid var(--tone-line);
  background: var(--tone-fill);
  color: var(--tone-ink);
  font-size: 11.5px;
  font-weight: 600;
  white-space: nowrap;
}
.ui-plib__chip[data-tone="blue"] { --tone-ink: var(--ui-plib-info-ink); --tone-fill: var(--ui-plib-info-fill); --tone-line: var(--ui-plib-info-line); }
.ui-plib__chip[data-tone="violet"] { --tone-ink: var(--ui-plib-brand-ink); --tone-fill: var(--ui-plib-brand-fill); --tone-line: var(--ui-plib-brand-line); }
.ui-plib__chip[data-tone="amber"] { --tone-ink: var(--ui-plib-waiting-ink); --tone-fill: var(--ui-plib-waiting-fill); --tone-line: var(--ui-plib-waiting-line); }
.ui-plib__chip[data-tone="green"] { --tone-ink: var(--ui-plib-success-ink); --tone-fill: var(--ui-plib-success-fill); --tone-line: var(--ui-plib-success-line); }
.ui-plib__chip[data-tone="red"] { --tone-ink: var(--ui-plib-danger-ink); --tone-fill: var(--ui-plib-danger-fill); --tone-line: var(--ui-plib-danger-line); }

/* Template side */
.ui-plib__main { position: relative; min-width: 0; }
.ui-plib__stack { display: grid; }
.ui-plib__view { grid-area: 1 / 1; min-width: 0; padding: 16px 16px 16px; }
.ui-plib__view[data-live] { animation: ui-plib-in 300ms var(--ui-plib-ease); }
.ui-plib__view:not([data-live]) { animation: ui-plib-out 300ms var(--ui-plib-ease) forwards; pointer-events: none; }
.ui-plib__view-head { display: flex; align-items: center; flex-wrap: wrap; gap: 6px 8px; margin-bottom: 12px; }
.ui-plib__view-title {
  margin: 0;
  min-width: 0;
  font-family: "Avenir Next Condensed", "Avenir Next", Avenir, system-ui, sans-serif;
  font-weight: 700;
  font-size: 16px;
  line-height: 20px;
  overflow-wrap: anywhere;
}
.ui-plib__progress { display: inline-flex; align-items: center; gap: 7px; margin-left: auto; font-size: 12px; color: var(--ui-plib-muted); white-space: nowrap; }
.ui-plib__bars { display: inline-flex; gap: 3px; }
.ui-plib__bar { width: 9px; height: 4px; border-radius: 2px; background: var(--ui-plib-firm); transition: background-color 300ms var(--ui-plib-ease); }
.ui-plib__bar[data-on] { background: var(--ui-plib-berry); }

.ui-plib__sentence { margin: 0; font-size: 14px; line-height: 30px; color: var(--ui-plib-text); overflow-wrap: anywhere; }

/* Inline field that grows with what is typed */
.ui-plib__field {
  display: inline-grid;
  vertical-align: middle;
  max-width: 100%;
  margin: 0 1px;
}
.ui-plib__field::after,
.ui-plib__input {
  grid-area: 1 / 1;
  min-width: 2ch;
  padding: 0 7px;
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  line-height: 24px;
}
.ui-plib__field::after {
  content: attr(data-value) " ";
  visibility: hidden;
  white-space: pre;
  overflow: hidden;
  border: 1px solid transparent;
}
.ui-plib__input {
  width: 100%;
  min-width: 0;
  height: 26px;
  border-radius: 7px;
  border: 1px solid var(--ui-plib-firm);
  background: var(--ui-plib-field);
  box-shadow: var(--ui-plib-inner);
  color: var(--ui-plib-ink);
  caret-color: var(--ui-plib-berry);
  outline: none;
  text-overflow: ellipsis;
  transition: border-color 150ms var(--ui-plib-ease), background-color 300ms var(--ui-plib-ease), box-shadow 150ms var(--ui-plib-ease);
}
.ui-plib__input::placeholder { color: var(--ui-plib-muted); font-weight: 500; }
.ui-plib__field[data-filled] .ui-plib__input { border-color: var(--ui-plib-info-line); background: var(--ui-plib-info-fill); color: var(--ui-plib-info-ink); box-shadow: none; }
.ui-plib__input:focus { border-color: var(--ui-plib-info-line); box-shadow: 0 0 0 3px var(--ui-plib-ring); }
.ui-plib__field[data-flash="a"] .ui-plib__input { animation: ui-plib-glow-a 900ms var(--ui-plib-ease); }
.ui-plib__field[data-flash="b"] .ui-plib__input { animation: ui-plib-glow-b 900ms var(--ui-plib-ease); }

.ui-plib__label {
  margin: 16px 0 6px;
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: var(--ui-plib-muted);
}
.ui-plib__preview {
  margin: 0;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid var(--ui-plib-hairline);
  background: var(--ui-plib-frame);
  font-size: 13.5px;
  line-height: 21px;
  color: var(--ui-plib-text);
  overflow-wrap: anywhere;
  white-space: pre-wrap;
  user-select: text;
}
.ui-plib__filled { font-weight: 600; color: var(--ui-plib-ink); border-radius: 4px; }
.ui-plib__filled[data-flash="a"] { animation: ui-plib-mark-a 900ms var(--ui-plib-ease); }
.ui-plib__filled[data-flash="b"] { animation: ui-plib-mark-b 900ms var(--ui-plib-ease); }
.ui-plib__hole { color: var(--ui-plib-muted); font-style: italic; }
.ui-plib__blank { display: grid; place-items: center; min-height: 200px; padding: 24px; text-align: center; font-size: 13.5px; color: var(--ui-plib-muted); }

/* Tray */
.ui-plib__tray { display: flex; align-items: center; gap: 8px; min-height: 48px; padding: 6px 2px 0 10px; }
.ui-plib__tokens { display: inline-flex; overflow: hidden; font-size: 12.5px; color: var(--ui-plib-muted); font-variant-numeric: tabular-nums; white-space: pre; }
.ui-plib__tokens-num { display: inline-block; animation: ui-plib-roll 300ms var(--ui-plib-ease); }
.ui-plib__tray-note { flex: 1; min-width: 0; font-size: 12.5px; color: var(--ui-plib-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ui-plib__copy {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 34px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid var(--ui-plib-firm);
  background: var(--ui-plib-secondary);
  box-shadow: var(--ui-plib-short);
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  color: var(--ui-plib-ink);
  cursor: pointer;
  transition: background-color 150ms var(--ui-plib-ease), color 150ms var(--ui-plib-ease);
}
.ui-plib__copy:hover { background: var(--ui-plib-soft); }
.ui-plib__copy[data-copied] { color: var(--ui-plib-success-ink); }
.ui-plib__copy-icon { display: grid; place-items: center; }
.ui-plib__copy-icon svg { width: 15px; height: 15px; fill: none; stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }
.ui-plib__copy[data-copied] .ui-plib__copy-icon svg { animation: ui-plib-pop 300ms var(--ui-plib-ease); }
.ui-plib__use {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 34px;
  padding: 0 12px 0 14px;
  border: 0;
  border-radius: 10px;
  background: var(--ui-plib-berry);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 6px 12px -6px rgba(133, 20, 55, 0.6);
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  color: #ffffff;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 150ms var(--ui-plib-ease), opacity 300ms var(--ui-plib-ease), transform 150ms var(--ui-plib-ease);
}
.ui-plib__use svg { width: 14px; height: 14px; fill: none; stroke: currentColor; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; }
.ui-plib__use:hover { background: var(--ui-plib-berry-hover); }
.ui-plib__use:active { transform: translateY(1px); }
.ui-plib__use[aria-disabled="true"] { opacity: 0.45; cursor: not-allowed; box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16); }
.ui-plib__use[aria-disabled="true"]:hover { background: var(--ui-plib-berry); }
.ui-plib__use[data-pulse="a"] { animation: ui-plib-pulse-a 600ms var(--ui-plib-ease); }
.ui-plib__use[data-pulse="b"] { animation: ui-plib-pulse-b 600ms var(--ui-plib-ease); }
.ui-plib__copy:focus-visible,
.ui-plib__use:focus-visible { outline: none; box-shadow: 0 0 0 3px var(--ui-plib-ring); }
.ui-plib__copy:disabled { opacity: 0.5; cursor: not-allowed; }

.ui-plib__sr { position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }

/* Touch: taller targets */
@media (hover: none), (pointer: coarse) {
  .ui-plib__option { min-height: 44px; }
  .ui-plib__search { height: 40px; }
  .ui-plib__input { height: 32px; }
  .ui-plib__sentence { line-height: 36px; }
  .ui-plib__copy, .ui-plib__use { height: 40px; }
}

/* Narrow: list on top */
@container (max-width: 539px) {
  .ui-plib__panel { grid-template-columns: 1fr; }
  .ui-plib__side { border-right: 0; border-bottom: 1px solid var(--ui-plib-hairline); }
  .ui-plib__list { max-height: 168px; }
}
@container (max-width: 359px) {
  .ui-plib__copy { padding: 0 9px; }
  .ui-plib__copy-label { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
  .ui-plib__tray-note { display: none; }
  .ui-plib__tray { padding-left: 6px; }
  .ui-plib__view { padding: 14px 12px; }
  .ui-plib__progress { margin-left: 0; }
}

@keyframes ui-plib-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes ui-plib-out { from { opacity: 1; } to { opacity: 0; } }
@keyframes ui-plib-roll { from { transform: translateY(70%); opacity: 0; } to { transform: none; opacity: 1; } }
@keyframes ui-plib-pop { from { transform: scale(0.6); } to { transform: scale(1); } }
@keyframes ui-plib-glow-a { from { box-shadow: 0 0 0 3px var(--ui-plib-ring); } }
@keyframes ui-plib-glow-b { from { box-shadow: 0 0 0 3px var(--ui-plib-ring); } }
@keyframes ui-plib-mark-a { from { background: var(--ui-plib-info-fill); box-shadow: 0 0 0 2px var(--ui-plib-info-fill); } }
@keyframes ui-plib-mark-b { from { background: var(--ui-plib-info-fill); box-shadow: 0 0 0 2px var(--ui-plib-info-fill); } }
@keyframes ui-plib-pulse-a { 0% { box-shadow: 0 0 0 0 rgba(133, 20, 55, 0.45); } 100% { box-shadow: 0 0 0 10px rgba(133, 20, 55, 0); } }
@keyframes ui-plib-pulse-b { 0% { box-shadow: 0 0 0 0 rgba(133, 20, 55, 0.45); } 100% { box-shadow: 0 0 0 10px rgba(133, 20, 55, 0); } }

@media (prefers-reduced-motion: reduce) {
  .ui-plib__marker,
  .ui-plib__option,
  .ui-plib__bar,
  .ui-plib__input,
  .ui-plib__use { transition: none; }
  .ui-plib__view[data-live],
  .ui-plib__tokens-num,
  .ui-plib__copy[data-copied] .ui-plib__copy-icon svg,
  .ui-plib__use[data-pulse="a"],
  .ui-plib__use[data-pulse="b"] { animation: none; }
  .ui-plib__view:not([data-live]) { display: none; }
  .ui-plib__use:active { transform: none; }
}
`;var Oi=[{id:"meeting",title:"Summarize a meeting",category:"Notes",body:"Summarize the meeting below for {audience} in under {length}. List decisions first, then open questions with an owner each.",variables:{audience:{description:"Who will read the summary"},length:{description:"Maximum length",default:"150 words"}}},{id:"release",title:"Write release notes",category:"Product",body:"Write release notes for {product} {version} for {audience}. Keep the tone {tone} and group the changes into New, Improved and Fixed.",variables:{product:{description:"Name of the product",default:"Relay"},version:{description:"Version number, e.g. 2.4",default:"2"},audience:{description:"Who the notes are for"},tone:{description:"How it should sound",default:"friendly"}}},{id:"error",title:"Explain an error",category:"Debug",body:"Explain this {language} error in plain words, say what most likely caused it and suggest one fix: {error}",variables:{language:{description:"Programming language",default:"TypeScript"},error:{description:"The error message"}}},{id:"outreach",title:"Draft a cold email",category:"Sales",body:"Draft a short first email to {name}, {role} at {company}, about {topic}. Three sentences at most, one clear question at the end.",variables:{name:{description:"First name of the person"},role:{description:"Their job title"},company:{description:"Their company"},topic:{description:"What you want to talk about"}}}];function Fi(){let[a,l]=f(null);return o("div",{style:{width:"100%",maxWidth:640,display:"grid",gap:12},children:[r(bi,{templates:Oi,defaultValue:"release",onUse:p=>l(p)}),r("style",{href:"ui-prompt-library-demo",precedence:"default",children:Bi}),r("p",{className:"ui-plib-demo__sent","aria-live":"polite",children:a?`Sent to the composer: \u201C${a.slice(0,90)}${a.length>90?"\u2026":""}\u201D`:""})]})}var Bi=`
.ui-plib-demo__sent {
  --demo-muted: rgba(0, 22, 43, 0.54);
  min-height: 36px;
  margin: 0 8px;
  font-family: "Avenir Next", Avenir, system-ui, sans-serif;
  font-size: 12.5px;
  line-height: 18px;
  color: var(--demo-muted);
  overflow-wrap: anywhere;
}
:where(.dark, [data-theme="dark"]) .ui-plib-demo__sent { --demo-muted: rgba(255, 255, 255, 0.56); }
`;export{Fi as default};
