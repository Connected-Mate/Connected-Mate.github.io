"use client";import{t as Y}from"./react-BkAXpnfr.js";var G=Y();var{Children:si,Component:pi,Fragment:ci,StrictMode:ui,cloneElement:di,createContext:li,createElement:fi,createRef:mi,forwardRef:gi,isValidElement:hi,lazy:xi,memo:ki,startTransition:_i,Suspense:bi,use:vi,useCallback:I,useContext:wi,useDebugValue:yi,useDeferredValue:Ni,useEffect:f,useId:T,useImperativeHandle:Ci,useInsertionEffect:Si,useLayoutEffect:B,useMemo:b,useOptimistic:zi,useReducer:Ei,useRef:S,useState:d,useSyncExternalStore:Di,useTransition:Mi}=G;import{t as J}from"./jsx-runtime-CTsRTJUX.js";var Q=J(),{jsx:e,jsxs:r,Fragment:Li}=Q;var W=[{id:"linear",name:"Linear",domain:"linear.app",category:"Project management",description:"Turn requests from chat into issues and keep their status in sync both ways.",features:["Create issues from any message","Two-way status sync","Link issues to customers"],color:"#5e6ad2",connected:!0},{id:"notion",name:"Notion",domain:"notion.so",category:"Docs & wiki",description:"Search your workspace pages and save answers back as new docs.",features:["Search across pages","Save answers as pages","Respect page permissions"],color:"#2f3437",connected:!0},{id:"stripe",name:"Stripe",domain:"stripe.com",category:"Payments",description:"Look up customers, invoices and refunds without leaving the conversation.",features:["Customer and invoice lookup","Refund with confirmation","Payment alerts"],color:"#635bff",connected:!0},{id:"figma",name:"Figma",domain:"figma.com",category:"Design",description:"Preview frames inline and get notified when a file you follow changes.",features:["Inline frame previews","Comment notifications","Link files to tasks"],color:"#a259ff"},{id:"hubspot",name:"HubSpot",domain:"hubspot.com",category:"CRM",description:"See the contact and deal behind every conversation, and log calls in one click.",features:["Contact cards","Log activity","Deal stage updates"],color:"#ff7a59"},{id:"shopify",name:"Shopify",domain:"shopify.com",category:"Commerce",description:"Answer order questions with live order, shipping and stock data.",features:["Order lookup","Shipping status","Stock levels"],color:"#5e8e3e"},{id:"airtable",name:"Airtable",domain:"airtable.com",category:"Database",description:"Read and update records in your bases from a simple sentence.",features:["Read any base","Update records","Create views"],color:"#e08d00"},{id:"slack",name:"Slack",domain:"slack.com",category:"Messaging",description:"Post summaries to channels and answer questions right where they are asked.",features:["Channel summaries","Answer in threads","Daily digests"],color:"#4a154b"},{id:"github",name:"GitHub",domain:"github.com",category:"Code",description:"Follow pull requests, review status and releases from one place.",features:["Pull request status","Release notes","Issue triage"],color:"#24292f"},{id:"zendesk",name:"Zendesk",domain:"zendesk.com",category:"Support",description:"Draft replies from your help centre and hand tickets over with full context.",features:["Drafted replies","Ticket hand-over","Help centre search"],color:"#03363d"}],ii=typeof window>"u"?f:B;function ei(){let t=S(null),[p,l]=d(!0);return f(()=>{let m=t.current;if(!m||typeof IntersectionObserver>"u")return;let h=new IntersectionObserver(([z])=>l(z.isIntersecting));return h.observe(m),()=>h.disconnect()},[]),[t,p]}function H({item:t,size:p}){return e("span",{className:"ui-ipick__tile","data-size":p,style:{"--tile":t.color??"var(--ui-ip-ink)"},"aria-hidden":"true",children:t.icon??(t.path?e("svg",{viewBox:"0 0 24 24",children:e("path",{d:t.path})}):e("span",{className:"ui-ipick__monogram",children:t.name.trim().slice(0,1).toUpperCase()}))})}function ai(){return e("svg",{viewBox:"0 0 24 24","aria-hidden":"true",children:e("path",{d:"M12 4.5 5.5 19h3.1l1.3-3.1h4.2l1.3 3.1h3.1L12 4.5Zm0 6.1 1.4 3.3h-2.8L12 10.6Z"})})}function j({integrations:t=W,appName:p="A-Team",appIcon:l,defaultSelected:m,onToggle:h,onExplore:z,onBack:v,onClose:L,className:O}){let c=T().replace(/:/g,""),x=S(null),w=S(null),[g,E]=d(""),D=b(()=>Object.fromEntries(t.map(i=>[i.id,!!i.connected])),[t]),[u,A]=d(D);f(()=>A(D),[D]);let[k,M]=d(m??t[0]?.id??""),$=b(()=>{let i=g.trim().toLowerCase();return i?t.filter(a=>[a.name,a.category,a.domain].some(n=>n.toLowerCase().includes(i))):t},[t,g]),y=b(()=>{let i=$.filter(n=>u[n.id]),a=$.filter(n=>!u[n.id]);return[{key:"on",label:"Connected",items:i},{key:"off",label:"Available",items:a}].filter(n=>n.items.length)},[$,u]),s=b(()=>y.flatMap(i=>i.items),[y]);f(()=>{s.length&&!s.some(i=>i.id===k)&&M(s[0].id)},[s,k]);let o=t.find(i=>i.id===k)??s[0]??t[0],_=o?!!u[o.id]:!1,K=t.filter(i=>u[i.id]).length,R=I(i=>{let a=!u[i];A(n=>({...n,[i]:a})),h?.(i,a)},[u,h]),[N,q]=d(null),C=I(()=>{let i=w.current?.querySelector('[aria-selected="true"]');q(i?{top:i.offsetTop,height:i.offsetHeight}:null)},[]);ii(C,[C,k,y]),f(()=>{let i=w.current;if(!i||typeof ResizeObserver>"u")return;let a=new ResizeObserver(C);return a.observe(i),()=>a.disconnect()},[C]);let V=i=>{w.current?.querySelector(`[data-id="${CSS.escape(i)}"]`)?.scrollIntoView?.({block:"nearest"})};f(()=>{let i=a=>{a.key==="/"&&(a.metaKey||a.ctrlKey)&&(a.preventDefault(),x.current?.focus(),x.current?.select())};return window.addEventListener("keydown",i),()=>window.removeEventListener("keydown",i)},[]);let F=i=>{let a=s.findIndex(n=>n.id===k);switch(i.key){case"ArrowDown":case"ArrowUp":{if(!s.length)return;i.preventDefault();let n=i.key==="ArrowDown"?1:-1,P=s[(Math.max(0,a)+n+s.length)%s.length];M(P.id),V(P.id);return}case"Enter":if(!o||!s.length)return;i.preventDefault(),R(o.id);return;case"Escape":g?(i.preventDefault(),i.stopPropagation(),E("")):L&&(i.preventDefault(),L());return;case"ArrowLeft":case"Backspace":!g&&v&&i.key==="ArrowLeft"&&(i.preventDefault(),v());return}},[U,Z]=ei(),X=typeof navigator<"u"&&/Mac|iPhone|iPad/.test(navigator.platform||navigator.userAgent)?"\u2318/":"Ctrl /";return r("div",{className:["ui-ipick",O].filter(Boolean).join(" "),children:[e("style",{href:"ui-integration-picker",precedence:"default",children:ri}),r("div",{className:"ui-ipick__frame",children:[r("div",{className:"ui-ipick__bar",children:[v?e("button",{type:"button",className:"ui-ipick__back",onClick:v,"aria-label":"Back",children:e("svg",{viewBox:"0 0 16 16","aria-hidden":"true",children:e("path",{d:"M9.8 3.6 5.4 8l4.4 4.4"})})}):null,e("h2",{className:"ui-ipick__heading",id:`${c}-heading`,children:"Integrations"}),r("span",{className:"ui-ipick__count",children:[K," of ",t.length," connected"]})]}),r("div",{className:"ui-ipick__panel",children:[r("div",{className:"ui-ipick__search",children:[r("svg",{viewBox:"0 0 16 16","aria-hidden":"true",children:[e("circle",{cx:"7",cy:"7",r:"4.4"}),e("path",{d:"M10.3 10.3l3.2 3.2"})]}),e("input",{ref:x,type:"text",role:"combobox","aria-expanded":"true","aria-autocomplete":"list","aria-controls":`${c}-list`,"aria-activedescendant":o&&s.length?`${c}-opt-${o.id}`:void 0,"aria-label":"Search integrations",placeholder:"Search integrations",autoComplete:"off",spellCheck:!1,value:g,onChange:i=>E(i.target.value),onKeyDown:F}),e("kbd",{className:"ui-ipick__kbd","aria-hidden":"true",children:X})]}),r("div",{className:"ui-ipick__body",children:[r("div",{ref:w,className:"ui-ipick__list",id:`${c}-list`,role:"listbox","aria-labelledby":`${c}-heading`,style:N?{"--ui-ip-marker-y":`${N.top}px`,"--ui-ip-marker-h":`${N.height}px`}:void 0,children:[N&&s.length?e("span",{className:"ui-ipick__marker","aria-hidden":"true"}):null,y.map(i=>r("div",{role:"group","aria-labelledby":`${c}-g-${i.key}`,className:"ui-ipick__group",children:[e("div",{className:"ui-ipick__group-label",id:`${c}-g-${i.key}`,role:"presentation",children:i.label}),i.items.map(a=>r("div",{id:`${c}-opt-${a.id}`,"data-id":a.id,role:"option","aria-selected":a.id===o?.id,className:"ui-ipick__option",onPointerDown:n=>n.preventDefault(),onClick:()=>{M(a.id),x.current?.focus()},children:[e(H,{item:a,size:"s"}),r("span",{className:"ui-ipick__option-text",children:[e("span",{className:"ui-ipick__option-name",children:a.name}),e("span",{className:"ui-ipick__option-cat",children:a.category})]}),u[a.id]?e("span",{className:"ui-ipick__dot",role:"img","aria-label":"Connected"}):null]},a.id))]},i.key)),s.length?null:r("div",{className:"ui-ipick__empty",children:[r("span",{children:["No integration matches \u201C",g.trim(),"\u201D."]}),e("button",{type:"button",className:"ui-ipick__ghost",onClick:()=>{E(""),x.current?.focus()},children:"Clear search"})]})]}),o?r("section",{className:"ui-ipick__detail","aria-labelledby":`${c}-title`,"data-on":_?"":void 0,children:[r("div",{ref:U,className:"ui-ipick__art","data-on":_?"":void 0,"data-paused":Z?void 0:"","aria-hidden":"true",children:[e("span",{className:"ui-ipick__wave"}),e("span",{className:"ui-ipick__wave","data-late":""}),e("span",{className:"ui-ipick__app",children:l??e(ai,{})}),e("svg",{className:"ui-ipick__arrows",viewBox:"0 0 24 24",children:e("path",{d:"M5 9h13l-3.2-3.2M19 15H6l3.2 3.2"})}),e("span",{className:"ui-ipick__swap",children:e(H,{item:o,size:"l"})},o.id)]}),r("div",{className:"ui-ipick__title-row",children:[r("h3",{className:"ui-ipick__title",id:`${c}-title`,children:[p," + ",o.name]}),e("button",{type:"button",role:"switch","aria-checked":_,"aria-label":_?`Disconnect ${o.name}`:`Connect ${o.name}`,className:"ui-ipick__switch",onClick:()=>R(o.id),children:e("span",{className:"ui-ipick__thumb"})})]}),e("div",{className:"ui-ipick__domain",children:o.domain}),e("p",{className:"ui-ipick__desc",children:o.description}),o.features?.length?e("ul",{className:"ui-ipick__features","aria-label":"What it can do",children:o.features.map(i=>r("li",{children:[e("svg",{viewBox:"0 0 16 16","aria-hidden":"true",children:e("path",{d:"M3.6 8.4l2.9 2.9 6-6.5"})}),i]},i))}):null,r("button",{type:"button",className:"ui-ipick__explore",onClick:()=>z?.(o.id),children:["Explore integration",e("svg",{viewBox:"0 0 16 16","aria-hidden":"true",children:e("path",{d:"M6.2 3.6 10.6 8l-4.4 4.4"})})]}),e("div",{className:"ui-ipick__sr","aria-live":"polite","aria-atomic":"true",children:`${o.name}, ${o.category}. ${_?"Connected":"Not connected"}.`})]}):e("div",{className:"ui-ipick__blank",children:"No integrations to show yet."})]})]})]})]})}var ri=`
.ui-ipick {
  --ui-ip-frame: #f2f6fa;
  --ui-ip-panel: #ffffff;
  --ui-ip-soft: rgba(26, 62, 112, 0.06);
  --ui-ip-hairline: #dae2ec;
  --ui-ip-firm: #cbd6e4;
  --ui-ip-ink: #00162b;
  --ui-ip-text: rgba(0, 22, 43, 0.66);
  --ui-ip-muted: rgba(0, 22, 43, 0.54);
  --ui-ip-secondary: #fbfcfe;
  --ui-ip-berry: #851437;
  --ui-ip-berry-hover: #6d0f2d;
  --ui-ip-ring: #8fbdf2;
  --ui-ip-info-ink: #1a3e70;
  --ui-ip-info-fill: #eef5ff;
  --ui-ip-info-line: #c1daff;
  --ui-ip-success-ink: #1d6a34;
  --ui-ip-mark: #00162b;
  --ui-ip-mark-ink: #ffffff;
  --ui-ip-tile-ink: #ffffff;
  --ui-ip-wave: rgba(26, 62, 112, 0.14);
  --ui-ip-wave-on: rgba(133, 20, 55, 0.22);
  --ui-ip-switch-off: #cbd6e4;
  --ui-ip-pebble: inset 0 -2px 6px -4px rgba(26, 62, 112, 0.4);
  --ui-ip-drop: 0 8px 16px -8px rgba(26, 62, 112, 0.2);
  --ui-ip-short: 0 2px 4px -2px rgba(26, 62, 112, 0.2);
  --ui-ip-raised: 0 18px 30px -16px rgba(26, 62, 112, 0.38), 0 4px 10px -6px rgba(26, 62, 112, 0.18);
  --ui-ip-floating: 0 24px 48px -24px rgba(26, 62, 112, 0.3);
  --ui-ip-ease: cubic-bezier(0.16, 1, 0.3, 1);
  container-type: inline-size;
  width: 100%;
  max-width: 660px;
  font-family: "Avenir Next", Avenir, system-ui, sans-serif;
  color: var(--ui-ip-ink);
}
:where(.dark, [data-theme="dark"]) .ui-ipick {
  --ui-ip-frame: #0f2747;
  --ui-ip-panel: #16345c;
  --ui-ip-soft: rgba(255, 255, 255, 0.07);
  --ui-ip-hairline: rgba(255, 255, 255, 0.12);
  --ui-ip-firm: rgba(255, 255, 255, 0.18);
  --ui-ip-ink: rgba(255, 255, 255, 0.94);
  --ui-ip-text: rgba(255, 255, 255, 0.72);
  --ui-ip-muted: rgba(255, 255, 255, 0.56);
  --ui-ip-secondary: rgba(255, 255, 255, 0.05);
  --ui-ip-berry: #a8204d;
  --ui-ip-berry-hover: #bd2a5a;
  --ui-ip-ring: rgba(143, 189, 242, 0.6);
  --ui-ip-info-ink: #c1daff;
  --ui-ip-info-fill: rgba(143, 189, 242, 0.16);
  --ui-ip-info-line: rgba(143, 189, 242, 0.3);
  --ui-ip-success-ink: #7fe0a0;
  --ui-ip-mark: #ffffff;
  --ui-ip-mark-ink: #00162b;
  --ui-ip-wave: rgba(255, 255, 255, 0.12);
  --ui-ip-wave-on: rgba(243, 163, 189, 0.28);
  --ui-ip-switch-off: rgba(255, 255, 255, 0.22);
  --ui-ip-pebble: inset 0 -2px 6px -4px rgba(3, 12, 28, 0.8);
  --ui-ip-drop: 0 8px 16px -8px rgba(3, 12, 28, 0.6);
  --ui-ip-short: 0 2px 4px -2px rgba(3, 12, 28, 0.6);
  --ui-ip-raised: 0 18px 30px -16px rgba(3, 12, 28, 0.8), 0 4px 10px -6px rgba(3, 12, 28, 0.6);
  --ui-ip-floating: 0 24px 48px -24px rgba(3, 12, 28, 0.8);
}
.ui-ipick *, .ui-ipick *::before, .ui-ipick *::after { box-sizing: border-box; }

.ui-ipick__frame {
  padding: 0 6px 6px;
  border-radius: 22px;
  background: var(--ui-ip-frame);
  border: 1px solid var(--ui-ip-hairline);
  box-shadow: var(--ui-ip-floating), var(--ui-ip-drop);
}
.ui-ipick__bar { display: flex; align-items: center; gap: 4px; min-height: 42px; padding: 4px 8px 2px 6px; }
.ui-ipick__back {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--ui-ip-ink);
  cursor: pointer;
  transition: background-color 150ms var(--ui-ip-ease);
}
.ui-ipick__back svg { width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; }
.ui-ipick__back:hover { background: var(--ui-ip-soft); }
.ui-ipick__heading {
  flex: 1;
  min-width: 0;
  margin: 0 0 0 4px;
  font-family: "Avenir Next Condensed", "Avenir Next", Avenir, system-ui, sans-serif;
  font-weight: 700;
  font-size: 16px;
  line-height: 20px;
}
.ui-ipick__count { font-size: 12.5px; color: var(--ui-ip-muted); white-space: nowrap; font-variant-numeric: tabular-nums; }

.ui-ipick__panel {
  overflow: hidden;
  border-radius: 16px;
  background: var(--ui-ip-panel);
  border: 1px solid var(--ui-ip-hairline);
  box-shadow: var(--ui-ip-raised);
}

.ui-ipick__search { display: flex; align-items: center; gap: 9px; height: 46px; padding: 0 14px; border-bottom: 1px solid var(--ui-ip-hairline); }
.ui-ipick__search > svg { flex: none; width: 15px; height: 15px; fill: none; stroke: var(--ui-ip-muted); stroke-width: 1.5; stroke-linecap: round; }
.ui-ipick__search input {
  flex: 1;
  min-width: 0;
  height: 100%;
  padding: 0;
  border: 0;
  outline: none;
  background: transparent;
  font: inherit;
  font-size: 14px;
  color: var(--ui-ip-ink);
  caret-color: var(--ui-ip-berry);
}
.ui-ipick__search input::placeholder { color: var(--ui-ip-muted); }
.ui-ipick__search:focus-within { box-shadow: inset 0 -2px 0 var(--ui-ip-ring); }
.ui-ipick__kbd {
  flex: none;
  padding: 1px 6px;
  border-radius: 6px;
  border: 1px solid var(--ui-ip-hairline);
  border-bottom: 2px solid var(--ui-ip-firm);
  background: var(--ui-ip-panel);
  font: inherit;
  font-size: 11px;
  font-weight: 600;
  color: var(--ui-ip-muted);
}

.ui-ipick__body { display: grid; grid-template-columns: minmax(0, 42%) minmax(0, 1fr); min-height: 320px; }

/* List */
.ui-ipick__list { position: relative; max-height: 380px; overflow-y: auto; padding: 6px 8px 10px; border-right: 1px solid var(--ui-ip-hairline); scrollbar-width: thin; }
.ui-ipick__marker {
  position: absolute;
  left: 8px;
  right: 8px;
  top: 0;
  height: var(--ui-ip-marker-h);
  transform: translateY(var(--ui-ip-marker-y));
  border-radius: 10px;
  background: var(--ui-ip-info-fill);
  box-shadow: inset 2px 0 0 var(--ui-ip-berry);
  transition: transform 300ms var(--ui-ip-ease), height 300ms var(--ui-ip-ease);
  pointer-events: none;
}
.ui-ipick__group-label {
  padding: 10px 8px 5px;
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: var(--ui-ip-muted);
}
.ui-ipick__option {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  padding: 6px 8px;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 150ms var(--ui-ip-ease);
}
.ui-ipick__option:hover:not([aria-selected="true"]) { background: var(--ui-ip-soft); }
.ui-ipick__option-text { display: grid; flex: 1; min-width: 0; }
.ui-ipick__option-name { font-size: 13.5px; font-weight: 600; line-height: 18px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ui-ipick__option-cat { font-size: 12px; line-height: 16px; color: var(--ui-ip-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ui-ipick__dot { flex: none; width: 6px; height: 6px; border-radius: 999px; background: var(--ui-ip-success-ink); }
.ui-ipick__empty { display: grid; justify-items: start; gap: 6px; padding: 14px 8px; font-size: 13px; color: var(--ui-ip-muted); overflow-wrap: anywhere; }
.ui-ipick__ghost {
  margin-left: -8px;
  padding: 4px 8px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  font: inherit;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--ui-ip-info-ink);
  cursor: pointer;
}
.ui-ipick__ghost:hover { background: var(--ui-ip-soft); }

/* Tiles \u2013 a pebble of colour */
.ui-ipick__tile {
  flex: none;
  display: grid;
  place-items: center;
  border-radius: 9px;
  background: var(--tile);
  border: 1px solid rgba(0, 22, 43, 0.12);
  box-shadow: inset 0 -2px 6px -4px rgba(0, 0, 0, 0.45), var(--ui-ip-short);
  color: var(--ui-ip-tile-ink);
}
.ui-ipick__tile[data-size="s"] { width: 30px; height: 30px; }
.ui-ipick__tile[data-size="l"] { width: 48px; height: 48px; border-radius: 13px; }
.ui-ipick__tile svg { width: 60%; height: 60%; fill: currentColor; }
.ui-ipick__monogram { font-weight: 700; line-height: 1; }
.ui-ipick__tile[data-size="s"] .ui-ipick__monogram { font-size: 14px; }
.ui-ipick__tile[data-size="l"] .ui-ipick__monogram { font-size: 22px; }

/* Detail */
.ui-ipick__detail { display: flex; flex-direction: column; min-width: 0; padding: 8px 8px 12px; }
.ui-ipick__art {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  height: 108px;
  margin-bottom: 12px;
  overflow: hidden;
  border-radius: 12px;
  background: var(--ui-ip-frame);
  border: 1px solid var(--ui-ip-hairline);
}
.ui-ipick__wave {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 150px;
  height: 150px;
  margin: -75px 0 0 -75px;
  border-radius: 999px;
  border: 1px solid var(--ui-ip-wave);
  transform: scale(0.75);
}
.ui-ipick__wave[data-late] { transform: scale(1.25); }
.ui-ipick__art[data-on] .ui-ipick__wave { border-color: var(--ui-ip-wave-on); animation: ui-ipick-wave 2.8s var(--ui-ip-ease) infinite; }
.ui-ipick__art[data-on] .ui-ipick__wave[data-late] { animation-delay: 1.4s; }
.ui-ipick__art[data-paused] .ui-ipick__wave { animation-play-state: paused; }
.ui-ipick__app {
  position: relative;
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border-radius: 13px;
  background: var(--ui-ip-mark);
  color: var(--ui-ip-mark-ink);
  border: 1px solid var(--ui-ip-hairline);
  box-shadow: inset 0 -2px 6px -4px rgba(0, 0, 0, 0.45), var(--ui-ip-short);
}
.ui-ipick__app svg { width: 26px; height: 26px; fill: currentColor; }
.ui-ipick__arrows {
  position: relative;
  width: 22px;
  height: 22px;
  fill: none;
  stroke: var(--ui-ip-muted);
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: transform 600ms var(--ui-ip-ease), stroke 300ms var(--ui-ip-ease);
}
.ui-ipick__art[data-on] .ui-ipick__arrows { transform: rotate(180deg); stroke: var(--ui-ip-berry); }
.ui-ipick__swap { position: relative; display: grid; animation: ui-ipick-swap 300ms var(--ui-ip-ease); }

.ui-ipick__title-row { display: flex; align-items: center; gap: 12px; padding: 0 6px; }
.ui-ipick__title {
  flex: 1;
  min-width: 0;
  margin: 0;
  font-family: "Avenir Next Condensed", "Avenir Next", Avenir, system-ui, sans-serif;
  font-weight: 700;
  font-size: 17px;
  line-height: 22px;
  overflow-wrap: anywhere;
}
.ui-ipick__switch {
  flex: none;
  position: relative;
  width: 38px;
  height: 22px;
  padding: 0;
  border-radius: 999px;
  border: 1px solid var(--ui-ip-firm);
  background: var(--ui-ip-switch-off);
  box-shadow: inset 0 1px 2px rgba(0, 22, 43, 0.12);
  cursor: pointer;
  transition: background-color 300ms var(--ui-ip-ease), border-color 300ms var(--ui-ip-ease);
}
.ui-ipick__switch[aria-checked="true"] { background: var(--ui-ip-berry); border-color: var(--ui-ip-berry); }
.ui-ipick__thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  border-radius: 999px;
  background: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 22, 43, 0.3);
  transition: transform 150ms var(--ui-ip-ease);
}
.ui-ipick__switch[aria-checked="true"] .ui-ipick__thumb { transform: translateX(16px); }
.ui-ipick__switch:focus-visible,
.ui-ipick__back:focus-visible,
.ui-ipick__ghost:focus-visible,
.ui-ipick__explore:focus-visible { outline: none; box-shadow: 0 0 0 3px var(--ui-ip-ring); }
.ui-ipick__domain { padding: 0 6px; margin-top: 2px; font-size: 12.5px; color: var(--ui-ip-muted); overflow-wrap: anywhere; }
.ui-ipick__desc { margin: 10px 0 0; padding: 0 6px; font-size: 13.5px; line-height: 20px; color: var(--ui-ip-text); overflow-wrap: anywhere; }
.ui-ipick__features { display: grid; gap: 4px; margin: 12px 0 0; padding: 0 6px; list-style: none; }
.ui-ipick__features li { display: flex; align-items: flex-start; gap: 8px; font-size: 13px; line-height: 18px; color: var(--ui-ip-text); }
.ui-ipick__features svg { flex: none; width: 14px; height: 14px; margin-top: 2px; fill: none; stroke: var(--ui-ip-success-ink); stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; }
.ui-ipick__explore {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 38px;
  margin: 16px 6px 0;
  padding: 0 14px;
  border-radius: 10px;
  border: 1px solid var(--ui-ip-firm);
  background: var(--ui-ip-secondary);
  box-shadow: var(--ui-ip-short);
  font: inherit;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--ui-ip-ink);
  cursor: pointer;
  transition: background-color 150ms var(--ui-ip-ease);
}
.ui-ipick__explore svg { width: 14px; height: 14px; fill: none; stroke: currentColor; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; transition: transform 150ms var(--ui-ip-ease); }
.ui-ipick__explore:hover { background: var(--ui-ip-soft); }
.ui-ipick__explore:hover svg { transform: translateX(2px); }
.ui-ipick__blank { display: grid; place-items: center; padding: 24px; font-size: 13.5px; color: var(--ui-ip-muted); }

.ui-ipick__sr { position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }

@media (hover: none), (pointer: coarse) {
  .ui-ipick__option { padding: 9px 8px; }
  .ui-ipick__back { width: 36px; height: 36px; }
  .ui-ipick__explore { min-height: 44px; }
  .ui-ipick__kbd { display: none; }
}

/* Narrow: list above the details, no illustration, no capabilities */
@container (max-width: 559px) {
  .ui-ipick__body { grid-template-columns: minmax(0, 1fr); min-height: 0; }
  .ui-ipick__list { max-height: 216px; border-right: 0; border-bottom: 1px solid var(--ui-ip-hairline); }
  .ui-ipick__art, .ui-ipick__features { display: none; }
  .ui-ipick__detail { padding-top: 14px; }
}

@keyframes ui-ipick-wave {
  0% { transform: scale(0.55); opacity: 0; }
  20% { opacity: 1; }
  100% { transform: scale(1.6); opacity: 0; }
}
@keyframes ui-ipick-swap {
  from { opacity: 0; filter: blur(4px); transform: translateY(4px); }
  to { opacity: 1; filter: none; transform: none; }
}

@media (prefers-reduced-motion: reduce) {
  .ui-ipick__marker,
  .ui-ipick__arrows,
  .ui-ipick__thumb,
  .ui-ipick__switch,
  .ui-ipick__explore svg { transition: none; }
  .ui-ipick__swap,
  .ui-ipick__art[data-on] .ui-ipick__wave { animation: none; }
  .ui-ipick__explore:hover svg { transform: none; }
}
`;function ti(){let[t,p]=d("");return r("div",{className:"ui-ipick-demo",children:[e("style",{href:"ui-integration-picker-demo",precedence:"default",children:oi}),e(j,{onToggle:(l,m)=>p(`${l} ${m?"connected":"disconnected"}`),onExplore:l=>p(`Opening the ${l} page\u2026`),onBack:()=>p("Back to the menu"),onClose:()=>p("Menu closed")}),e("p",{className:"ui-ipick-demo__note","aria-live":"polite",children:t})]})}var oi=`
.ui-ipick-demo { width: 100%; max-width: 660px; display: grid; gap: 10px; }
.ui-ipick-demo__note {
  --demo-muted: rgba(0, 22, 43, 0.54);
  min-height: 18px;
  margin: 0 10px;
  font-family: "Avenir Next", Avenir, system-ui, sans-serif;
  font-size: 12.5px;
  line-height: 18px;
  color: var(--demo-muted);
}
:where(.dark, [data-theme="dark"]) .ui-ipick-demo__note { --demo-muted: rgba(255, 255, 255, 0.56); }
`;export{ti as default};
