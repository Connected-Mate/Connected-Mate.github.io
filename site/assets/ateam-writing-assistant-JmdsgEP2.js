import{t as ae}from"./react-BkAXpnfr.js";var te=ae();var{Children:he,Component:we,Fragment:me,StrictMode:be,cloneElement:xe,createContext:ve,createElement:_e,createRef:ye,forwardRef:ke,isValidElement:Ne,lazy:Ce,memo:Re,startTransition:Te,Suspense:Se,use:Le,useCallback:I,useContext:Me,useDebugValue:Ee,useDeferredValue:ze,useEffect:S,useId:V,useImperativeHandle:Ae,useInsertionEffect:We,useLayoutEffect:U,useMemo:De,useOptimistic:Ie,useReducer:He,useRef:h,useState:v,useSyncExternalStore:Fe,useTransition:$e}=te;import{t as ie}from"./jsx-runtime-CTsRTJUX.js";var re=ie(),{jsx:a,jsxs:s,Fragment:Pe}=re;var ne=["Polish my email","Make it shorter","Fix the tone","Draft a reply"];function oe(o){let u=o.toLowerCase();return/short|tight|trim|brief/.test(u)?"Here's a tighter version: \u201CThanks for the quick turnaround \u2013 the new draft reads much better. Let's ship it Friday.\u201D":/polish|email|mail/.test(u)?"Polished: \u201CHi Sam, thanks for sending the draft over. I've added two comments on pricing \u2013 could you take a look before Thursday? Happy to jump on a call if that's easier.\u201D":/tone|friend|warm|polite/.test(u)?"Warmer tone: \u201CThanks so much for pulling this together \u2013 it's really close. Could we tweak the intro so it sounds a little more like us?\u201D":/reply|answer|respond/.test(u)?"Draft reply: \u201CThanks for the update! Thursday works for us. I'll share the final slides by Wednesday evening so you have time to review.\u201D":`Here's a first draft: \u201C${o.trim().replace(/[.!?]*$/,"")} \u2013 I've kept it short and clear so it's easy to send as is.\u201D Want it more formal or more casual?`}function se(){if(typeof window>"u")return null;let o=window;return o.SpeechRecognition??o.webkitSpeechRecognition??null}function le(){let[o,u]=v(!1);return S(()=>{let w=window.matchMedia?.("(prefers-reduced-motion: reduce)");if(!w)return;u(w.matches);let _=()=>u(w.matches);return w.addEventListener?.("change",_),()=>w.removeEventListener?.("change",_)},[]),o}var de=()=>s("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round","aria-hidden":"true",children:[a("rect",{x:"9",y:"3",width:"6",height:"11",rx:"3"}),a("path",{d:"M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"})]}),ue=()=>a("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:a("path",{d:"M12 19V5M6 11l6-6 6 6"})}),pe=()=>a("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round","aria-hidden":"true",children:a("path",{d:"M12 5v14M5 12h14"})});function Y({name:o="Quill",tagline:u="Your writing companion.",greeting:w="What should we write?",suggestions:_=ne,placeholder:O="Ask anything\u2026",respond:H=oe,speech:q="auto",dictation:G="Make my note to the client sound a bit friendlier",className:K}){let J=V(),R=le(),[L,m]=v([]),[y,b]=v(""),[k,N]=v(!1),[p,T]=v(!1),[Q,f]=v(""),F=h(1),c=h(0),x=h([]),g=h(null),M=h(""),E=h(null),$=h(null),z=()=>{x.current.forEach(e=>window.clearTimeout(e)),x.current=[]};S(()=>()=>{z(),g.current?.abort()},[]),U(()=>{let e=E.current;if(!e)return;e.style.height="auto";let t=parseFloat(getComputedStyle(e).lineHeight)||22;e.style.height=`${Math.min(e.scrollHeight,t*4+2)}px`},[y]),S(()=>{let e=$.current;e&&e.scrollTo({top:e.scrollHeight,behavior:R?"auto":"smooth"})},[L,R]);let j=I((e,t,r)=>{let n=t.split(/(?<=\s)/).length;if(R){m(C=>C.map(l=>l.id===e?{...l,text:t,shown:n}:l)),N(!1),f(t);return}m(C=>C.map(l=>l.id===e?{...l,text:t,shown:0}:l));let i=0,d=()=>{c.current===r&&(i+=1,m(C=>C.map(l=>l.id===e?{...l,shown:i}:l)),i<n?x.current.push(window.setTimeout(d,45)):(N(!1),f(t)))};x.current.push(window.setTimeout(d,45))},[R]),A=I(async(e,t)=>{let r=c.current,n=t??F.current++;N(!0),m(t===void 0?i=>[...i,{id:F.current++,role:"user",text:e},{id:n,role:"assistant",text:"",prompt:e}]:i=>i.map(d=>d.id===n?{...d,text:"",error:!1,shown:void 0}:d)),f(`${o} is writing`);try{let i=await H(e);if(c.current!==r)return;j(n,String(i??""),r)}catch{if(c.current!==r)return;m(i=>i.map(d=>d.id===n?{...d,error:!0}:d)),N(!1),f("Couldn't write a reply. Try again")}},[o,H,j]),W=(e=y)=>{let t=e.trim();!t||k||(b(""),A(t))},X=()=>{c.current+=1,z(),g.current?.abort(),T(!1),m([]),N(!1),b(""),f("New chat"),E.current?.focus()},D=e=>{T(!1),g.current=null;let t=e.trim();t?(b(""),A(t)):f("Didn't catch that")},B=()=>{let e=G.split(/\s+/).filter(Boolean),t=c.current,r=0;b("");let n=()=>{if(c.current!==t)return;r+=1;let i=e.slice(0,r).join(" ");b(i),r<e.length?x.current.push(window.setTimeout(n,190)):x.current.push(window.setTimeout(()=>c.current===t&&D(i),650))};x.current.push(window.setTimeout(n,450))},Z=()=>{if(k)return;T(!0),f("Listening");let e=q==="auto"?se():null;if(!e){B();return}try{let t=new e;t.lang=document.documentElement.lang||navigator.language||"en-US",t.interimResults=!0,t.continuous=!1,M.current="",t.onresult=r=>{let n="";for(let i=0;i<r.results.length;i++)n+=r.results[i][0].transcript;M.current=n,b(n)},t.onerror=r=>{g.current=null,T(!1),f(r.error==="not-allowed"||r.error==="service-not-allowed"?"Microphone blocked \u2013 you can type instead":"Couldn't hear you \u2013 try again or type")},t.onend=()=>{g.current===t&&D(M.current)},g.current=t,t.start()}catch{B()}},ee=()=>{g.current?g.current.stop():(c.current+=1,z(),D(y))},P=L.length>0;return s("section",{className:["ui-at-wa",K].filter(Boolean).join(" "),"aria-label":`${o} \u2013 writing assistant`,children:[a("style",{href:"ui-writing-assistant",precedence:"default",children:ce}),s("header",{className:"ui-at-wa__head",children:[s("div",{className:"ui-at-wa__titles",children:[a("h3",{className:"ui-at-wa__name",children:o}),a("p",{className:"ui-at-wa__tagline",children:u})]}),P&&a("button",{type:"button",className:"ui-at-wa__new",onClick:X,"aria-label":"New chat",title:"New chat",children:a(pe,{})})]}),s("div",{className:"ui-at-wa__stage",children:[s("div",{className:"ui-at-wa__glow","aria-hidden":"true",children:[a("span",{}),a("span",{}),a("span",{})]}),P?a("div",{className:"ui-at-wa__log",ref:$,role:"log","aria-label":"Conversation",children:L.map(e=>{if(e.role==="user")return a("p",{className:"ui-at-wa__msg","data-role":"user",children:e.text},e.id);if(e.error)return s("div",{className:"ui-at-wa__msg","data-role":"assistant","data-error":"",children:[a("span",{children:"Couldn't write that one."}),a("button",{type:"button",onClick:()=>e.prompt&&void A(e.prompt,e.id),disabled:k,children:"Try again"})]},e.id);if(e.shown===void 0)return s("p",{className:"ui-at-wa__msg ui-at-wa__typing","data-role":"assistant",role:"img","aria-label":`${o} is writing`,children:[a("span",{}),a("span",{}),a("span",{})]},e.id);let t=e.text.split(/(?<=\s)/);return a("p",{className:"ui-at-wa__msg","data-role":"assistant",children:t.slice(0,e.shown).map((r,n)=>a("span",{className:"ui-at-wa__w",children:r},n))},e.id)})},"log"):s("div",{className:"ui-at-wa__welcome",children:[a("p",{className:"ui-at-wa__greeting",children:w}),_.length>0&&a("div",{className:"ui-at-wa__chips",role:"group","aria-label":"Suggestions",children:_.map(e=>a("button",{type:"button",className:"ui-at-wa__chip",onClick:()=>W(e),children:e},e))})]},"welcome"),s("form",{className:"ui-at-wa__prompt",onSubmit:e=>{e.preventDefault(),W()},children:[s("div",{className:"ui-at-wa__field","data-listening":p||void 0,children:[a("textarea",{ref:E,id:`${J}-field`,rows:1,value:y,placeholder:p?"Listening\u2026":O,"aria-label":"Message",readOnly:p,onChange:e=>b(e.target.value),onKeyDown:e=>{e.key==="Enter"&&!e.shiftKey&&!e.nativeEvent.isComposing&&(e.preventDefault(),W())}}),y.trim()&&!p&&a("button",{type:"submit",className:"ui-at-wa__send","aria-label":"Send",disabled:k,children:a(ue,{})})]}),a("button",{type:"button",className:"ui-at-wa__mic","aria-pressed":p,"aria-label":p?"Stop dictation and send":"Start dictation",disabled:k&&!p,onClick:()=>p?ee():Z(),children:p?s("span",{className:"ui-at-wa__bars","aria-hidden":"true",children:[a("span",{}),a("span",{}),a("span",{})]}):a(de,{})})]})]}),a("div",{className:"ui-at-wa__sr",role:"status","aria-live":"polite",children:Q})]})}var ce=`
.ui-at-wa {
  --on-berry: #ffffff;
  --frame: #f2f6fa; --panel: #ffffff; --soft: rgba(26, 62, 112, 0.06);
  --line: #dae2ec; --line-firm: #cbd6e4;
  --ink: #00162b; --text: rgba(0, 22, 43, 0.66); --muted: rgba(0, 22, 43, 0.54);
  --berry: #851437; --berry-hover: #6d0f2d;
  --info-ink: #1a3e70; --info-fill: #eef5ff; --info-line: #c1daff; --ring: #8fbdf2;
  --bad-ink: #8a3a22; --bad-fill: #fdeee8; --bad-line: #f5d5c9;
  --stage: #fbfcfe;
  --glow-a: rgba(133, 20, 55, 0.26); --glow-b: rgba(143, 189, 242, 0.5); --glow-c: rgba(133, 20, 55, 0.14);
  --user-fill: #1a3e70; --user-ink: #ffffff;
  --mic-on: #00162b; --mic-on-ink: #ffffff;
  --pebble-shade: inset 0 -2px 6px -4px rgba(26, 62, 112, 0.4);
  --field-shade: inset 0 1px 3px rgba(26, 62, 112, 0.08);
  --drop: 0 8px 16px -8px rgba(26, 62, 112, 0.2);
  --raised: 0 18px 30px -16px rgba(26, 62, 112, 0.38), 0 4px 10px -6px rgba(26, 62, 112, 0.18);
  --float: 0 24px 48px -24px rgba(26, 62, 112, 0.3);
  --berry-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 6px 12px -6px rgba(133, 20, 55, 0.6);
  --ease: cubic-bezier(.16, 1, .3, 1);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 380px;
  min-width: 0;
  height: 460px;
  padding: 6px;
  border-radius: 22px;
  background: var(--frame);
  border: 1px solid var(--line);
  box-shadow: var(--float);
  font-family: "Avenir Next", Avenir, system-ui, sans-serif;
  font-size: 14.5px;
  line-height: 1.5;
  color: var(--text);
  text-align: left;
}
:where(.dark, [data-theme="dark"]) .ui-at-wa {
  --frame: #0f2747; --panel: #16345c; --soft: rgba(255, 255, 255, 0.07);
  --line: rgba(255, 255, 255, 0.12); --line-firm: rgba(255, 255, 255, 0.18);
  --ink: rgba(255, 255, 255, 0.94); --text: rgba(255, 255, 255, 0.72); --muted: rgba(255, 255, 255, 0.56);
  --berry: #a8204d; --berry-hover: #bd2a5a;
  --info-ink: #c1daff; --info-fill: rgba(143, 189, 242, 0.16); --info-line: rgba(143, 189, 242, 0.34); --ring: rgba(143, 189, 242, 0.6);
  --bad-ink: #f2a48c; --bad-fill: rgba(242, 164, 140, 0.14); --bad-line: rgba(242, 164, 140, 0.3);
  --stage: #12305a;
  --glow-a: rgba(168, 32, 77, 0.4); --glow-b: rgba(143, 189, 242, 0.24); --glow-c: rgba(168, 32, 77, 0.22);
  --user-fill: #c1daff; --user-ink: #00162b;
  --mic-on: #f2f6fa; --mic-on-ink: #00162b;
  --pebble-shade: inset 0 -2px 6px -4px rgba(3, 12, 28, 0.8);
  --field-shade: inset 0 1px 3px rgba(3, 12, 28, 0.3);
  --drop: 0 8px 16px -8px rgba(3, 12, 28, 0.6);
  --raised: 0 18px 30px -16px rgba(3, 12, 28, 0.8), 0 4px 10px -6px rgba(3, 12, 28, 0.6);
  --float: 0 24px 48px -24px rgba(3, 12, 28, 0.7);
  --berry-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 6px 12px -6px rgba(3, 12, 28, 0.8);
}
.ui-at-wa *, .ui-at-wa *::before, .ui-at-wa *::after { box-sizing: border-box; }
.ui-at-wa button { font: inherit; color: inherit; }
.ui-at-wa :focus-visible { outline: none; box-shadow: 0 0 0 3px var(--ring); }

.ui-at-wa__head { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; padding: 12px 14px 12px 18px; }
.ui-at-wa__titles { min-width: 0; }
.ui-at-wa__name {
  margin: 0;
  font-family: "Avenir Next Condensed", "Avenir Next", Avenir, system-ui, sans-serif;
  font-size: 21px;
  font-weight: 700;
  line-height: 1.2;
  color: var(--ink);
}
.ui-at-wa__tagline { margin: 1px 0 0; font-size: 13px; color: var(--muted); overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.ui-at-wa__new {
  flex: none;
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  border: 1px solid var(--line-firm);
  background: var(--panel);
  box-shadow: var(--pebble-shade), var(--drop);
  color: var(--ink);
  cursor: pointer;
  animation: ui-at-wa-pop 300ms var(--ease) both;
  transition: border-color 150ms var(--ease);
}
.ui-at-wa__new:hover { border-color: var(--info-line); }

.ui-at-wa__stage {
  position: relative;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 16px;
  background: var(--stage);
  border: 1px solid var(--line);
  box-shadow: var(--raised);
  isolation: isolate;
}
.ui-at-wa__glow { position: absolute; inset: 40% -20% -30%; z-index: -1; filter: blur(34px); pointer-events: none; }
.ui-at-wa__glow span { position: absolute; border-radius: 50%; animation: ui-at-wa-drift 14s ease-in-out infinite alternate; }
.ui-at-wa__glow span:nth-child(1) { left: 10%; top: 10%; width: 62%; height: 70%; background: var(--glow-a); }
.ui-at-wa__glow span:nth-child(2) { right: 4%; top: 30%; width: 55%; height: 70%; background: var(--glow-b); animation-duration: 17s; animation-delay: -5s; }
.ui-at-wa__glow span:nth-child(3) { left: 32%; bottom: 0; width: 46%; height: 50%; background: var(--glow-c); animation-duration: 11s; animation-delay: -8s; }

.ui-at-wa__welcome { flex: 1; display: flex; flex-direction: column; justify-content: flex-end; gap: 12px; padding: 18px 16px 12px; animation: ui-at-wa-rise 420ms var(--ease) both; }
.ui-at-wa__greeting { margin: 0; font-size: 23px; font-weight: 600; line-height: 1.25; letter-spacing: -0.005em; color: var(--ink); overflow-wrap: anywhere; }
.ui-at-wa__chips { display: flex; flex-wrap: wrap; gap: 8px; }
.ui-at-wa__chip {
  padding: 6px 13px;
  border-radius: 999px;
  border: 1px solid var(--line-firm);
  background: var(--panel);
  box-shadow: var(--drop);
  font-size: 13px;
  color: var(--ink);
  cursor: pointer;
  transition: border-color 150ms var(--ease), transform 150ms var(--ease), box-shadow 150ms var(--ease);
}
.ui-at-wa__chip:hover { border-color: var(--info-line); transform: translateY(-1px); }

.ui-at-wa__log {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px 14px 10px;
  scrollbar-width: thin;
  -webkit-mask-image: linear-gradient(180deg, transparent 0, #000 18px);
  mask-image: linear-gradient(180deg, transparent 0, #000 18px);
  animation: ui-at-wa-rise 420ms var(--ease) both;
}
.ui-at-wa__log > :first-child { margin-top: auto; }
.ui-at-wa__msg {
  max-width: 86%;
  margin: 0;
  padding: 9px 13px;
  border-radius: 14px;
  font-size: 14px;
  line-height: 1.45;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
  animation: ui-at-wa-rise 300ms var(--ease) both;
}
.ui-at-wa__msg[data-role="user"] { align-self: flex-end; border-bottom-right-radius: 5px; background: var(--user-fill); color: var(--user-ink); }
.ui-at-wa__msg[data-role="assistant"] {
  align-self: flex-start;
  border-bottom-left-radius: 5px;
  background: var(--panel);
  border: 1px solid var(--line);
  box-shadow: var(--drop);
  color: var(--ink);
}
.ui-at-wa__msg[data-error] { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; background: var(--bad-fill); border-color: var(--bad-line); color: var(--bad-ink); }
.ui-at-wa__msg[data-error] button {
  padding: 2px 10px;
  border-radius: 8px;
  border: 1px solid var(--bad-line);
  background: var(--panel);
  font-size: 12.5px;
  font-weight: 600;
  color: var(--bad-ink);
  cursor: pointer;
}
.ui-at-wa__w { animation: ui-at-wa-word 300ms var(--ease) both; }
.ui-at-wa__typing { display: inline-flex; gap: 4px; padding: 13px 14px; }
.ui-at-wa__typing span { width: 6px; height: 6px; border-radius: 50%; background: var(--muted); animation: ui-at-wa-dot 1.1s ease-in-out infinite; }
.ui-at-wa__typing span:nth-child(2) { animation-delay: 150ms; }
.ui-at-wa__typing span:nth-child(3) { animation-delay: 300ms; }

.ui-at-wa__prompt { display: flex; align-items: flex-end; gap: 8px; padding: 10px 12px 12px; }
.ui-at-wa__field {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: flex-end;
  gap: 6px;
  min-height: 50px;
  padding: 6px 6px 6px 18px;
  border-radius: 25px;
  background: var(--panel);
  border: 1px solid var(--line-firm);
  box-shadow: var(--field-shade), var(--drop);
  transition: border-color 150ms var(--ease), box-shadow 150ms var(--ease);
}
.ui-at-wa__field:focus-within { border-color: var(--info-line); box-shadow: var(--field-shade), 0 0 0 3px var(--ring); }
.ui-at-wa__field[data-listening] { border-color: var(--info-line); }
.ui-at-wa__field textarea {
  flex: 1;
  min-width: 0;
  margin: 0;
  padding: 7px 0;
  border: 0;
  outline: none;
  resize: none;
  background: transparent;
  font: inherit;
  font-size: 15px;
  line-height: 22px;
  color: var(--ink);
  caret-color: var(--berry);
  overflow-y: auto;
}
.ui-at-wa__field textarea:focus-visible { box-shadow: none; }
.ui-at-wa__field textarea::placeholder { color: var(--muted); }
.ui-at-wa__send {
  flex: none;
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 50%;
  background: var(--berry);
  color: var(--on-berry) !important;
  box-shadow: var(--berry-shadow);
  cursor: pointer;
  animation: ui-at-wa-pop 200ms var(--ease) both;
  transition: background-color 150ms var(--ease);
}
.ui-at-wa__send:hover:not(:disabled) { background: var(--berry-hover); }
.ui-at-wa__send:disabled { opacity: 0.5; cursor: default; }
.ui-at-wa__mic {
  position: relative;
  flex: none;
  display: grid;
  place-items: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 1px solid var(--line-firm);
  background: var(--panel);
  box-shadow: var(--pebble-shade), var(--drop);
  color: var(--ink);
  cursor: pointer;
  transition: background-color 300ms var(--ease), color 300ms var(--ease), border-color 300ms var(--ease);
}
.ui-at-wa__mic:hover:not(:disabled) { border-color: var(--info-line); }
.ui-at-wa__mic:disabled { opacity: 0.5; cursor: default; }
.ui-at-wa__mic[aria-pressed="true"] { background: var(--mic-on); border-color: var(--mic-on); color: var(--mic-on-ink); }
.ui-at-wa__mic[aria-pressed="true"]::after {
  content: "";
  position: absolute;
  inset: -1px;
  border-radius: 50%;
  border: 2px solid var(--mic-on);
  animation: ui-at-wa-breathe 1.8s var(--ease) infinite;
  pointer-events: none;
}
.ui-at-wa__bars { display: inline-flex; align-items: center; gap: 3px; height: 18px; }
.ui-at-wa__bars span { width: 3px; height: 8px; border-radius: 2px; background: currentColor; animation: ui-at-wa-bar 900ms ease-in-out infinite; }
.ui-at-wa__bars span:nth-child(2) { animation-delay: 150ms; }
.ui-at-wa__bars span:nth-child(3) { animation-delay: 300ms; }
.ui-at-wa__sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); clip-path: inset(50%); white-space: nowrap; }

@keyframes ui-at-wa-rise { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
@keyframes ui-at-wa-pop { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: none; } }
@keyframes ui-at-wa-word { from { opacity: 0; } to { opacity: 1; } }
@keyframes ui-at-wa-dot { 0%, 100% { opacity: 0.3; transform: none; } 40% { opacity: 1; transform: translateY(-2px); } }
@keyframes ui-at-wa-drift {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(8%, -6%) scale(1.08); }
  100% { transform: translate(-6%, 4%) scale(0.95); }
}
@keyframes ui-at-wa-breathe { from { transform: scale(1); opacity: 0.55; } to { transform: scale(1.45); opacity: 0; } }
@keyframes ui-at-wa-bar { 0%, 100% { height: 6px; } 50% { height: 16px; } }

@media (max-width: 360px) {
  .ui-at-wa__greeting { font-size: 21px; }
  .ui-at-wa__mic { width: 46px; height: 46px; }
  .ui-at-wa__field { min-height: 46px; padding-left: 14px; }
}
@media (prefers-reduced-motion: reduce) {
  .ui-at-wa *, .ui-at-wa *::before, .ui-at-wa *::after {
    animation-duration: 0s !important;
    animation-delay: 0s !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0s !important;
  }
  .ui-at-wa__mic[aria-pressed="true"]::after { display: none; }
}
`;function fe(){return a(Y,{speech:"simulate"})}export{fe as default};
