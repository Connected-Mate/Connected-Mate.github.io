import{t as e}from"./react-BkAXpnfr.js";import{t}from"./jsx-runtime-CTsRTJUX.js";var n=e(),r=t(),i=[{n:1,x:30,y:68},{n:2,x:125,y:56},{n:3,x:220,y:44}];function a({className:e,label:t=`Three overlapping browser windows full of placeholder content`}){let a=`ui-to`+(0,n.useId)().replace(/[^a-zA-Z0-9_-]/g,``);return(0,r.jsxs)(`div`,{className:[`ui-to`,e].filter(Boolean).join(` `),role:`img`,"aria-label":t,children:[(0,r.jsx)(`style`,{href:`ui-tab-overload`,precedence:`default`,children:o}),(0,r.jsxs)(`svg`,{className:`ui-to-art`,viewBox:`0 0 360 240`,"aria-hidden":`true`,children:[(0,r.jsxs)(`defs`,{children:[(0,r.jsxs)(`linearGradient`,{id:`${a}-blob-h`,x1:`0%`,y1:`0%`,x2:`100%`,y2:`0%`,children:[(0,r.jsx)(`stop`,{offset:`0%`,stopColor:`#ffb89e`,stopOpacity:`0.3`}),(0,r.jsx)(`stop`,{offset:`50%`,stopColor:`#eb9fac`,stopOpacity:`0.3`}),(0,r.jsx)(`stop`,{offset:`100%`,stopColor:`#f69eae`,stopOpacity:`0.3`})]}),(0,r.jsxs)(`linearGradient`,{id:`${a}-blob-v`,x1:`0%`,y1:`100%`,x2:`0%`,y2:`0%`,children:[(0,r.jsx)(`stop`,{offset:`0%`,stopColor:`#ff6b5c`,stopOpacity:`0.3`}),(0,r.jsx)(`stop`,{offset:`100%`,stopColor:`#ffb89e`,stopOpacity:`0.3`})]}),(0,r.jsx)(`filter`,{id:`${a}-blur`,x:`-200%`,y:`-200%`,width:`500%`,height:`500%`,children:(0,r.jsx)(`feGaussianBlur`,{stdDeviation:`12`})}),(0,r.jsxs)(`linearGradient`,{id:`${a}-stroke`,x1:`100%`,y1:`0%`,x2:`0%`,y2:`100%`,children:[(0,r.jsx)(`stop`,{offset:`0%`,stopColor:`#f8adb9`}),(0,r.jsx)(`stop`,{offset:`40%`,stopColor:`#f4b3be`}),(0,r.jsx)(`stop`,{offset:`75%`,stopColor:`#ffc5ab`}),(0,r.jsx)(`stop`,{offset:`100%`,stopColor:`#ffb5bc`})]})]}),i.map(({n:e,x:t,y:n})=>(0,r.jsxs)(`g`,{children:[(0,r.jsxs)(`g`,{className:`ui-to-blobs ui-to-blobs-${e}`,children:[(0,r.jsx)(`ellipse`,{cx:t+70,cy:n+8,rx:`90`,ry:`14`,fill:`url(#${a}-blob-h)`,filter:`url(#${a}-blur)`}),(0,r.jsx)(`ellipse`,{cx:t+8,cy:n+96,rx:`14`,ry:`90`,fill:`url(#${a}-blob-v)`,filter:`url(#${a}-blur)`})]}),(0,r.jsxs)(`g`,{className:`ui-to-tab ui-to-tab-${e}`,transform:`translate(${t} ${n})`,children:[(0,r.jsx)(`rect`,{className:`ui-to-frame`,width:`380`,height:`300`,rx:`6`,fill:`#f2f5fb`,stroke:`#e1e7f1`,strokeWidth:`0.7`}),(0,r.jsx)(`circle`,{className:`ui-to-dot`,cx:`14`,cy:`14`,r:`3`,fill:`#c3cddb`}),(0,r.jsx)(`circle`,{className:`ui-to-dot`,cx:`24`,cy:`14`,r:`3`,fill:`#c3cddb`}),(0,r.jsx)(`circle`,{className:`ui-to-dot`,cx:`34`,cy:`14`,r:`3`,fill:`#c3cddb`}),(0,r.jsx)(`rect`,{className:`ui-to-page`,x:`4`,y:`24`,width:`372`,height:`272`,rx:`5`,fill:`#FFFFFF`,stroke:`#e1e7f1`,strokeWidth:`0.7`})]}),(0,r.jsxs)(`g`,{className:`ui-to-content ui-to-content-${e}`,transform:`translate(${t} ${n})`,children:[(0,r.jsx)(`rect`,{className:`ui-to-bar`,x:`12`,y:`36`,width:`30`,height:`30`,rx:`4`,fill:`#edf1f8`}),(0,r.jsx)(`rect`,{className:`ui-to-bar`,x:`52`,y:`38`,width:`100`,height:`6`,rx:`2`,fill:`#edf1f8`}),(0,r.jsx)(`rect`,{className:`ui-to-bar`,x:`52`,y:`46`,width:`100`,height:`6`,rx:`2`,fill:`#edf1f8`}),(0,r.jsx)(`rect`,{className:`ui-to-bar`,x:`52`,y:`54`,width:`35`,height:`6`,rx:`2`,fill:`#edf1f8`}),(0,r.jsx)(`rect`,{className:`ui-to-bar`,x:`12`,y:`72`,width:`140`,height:`6`,rx:`2`,fill:`#edf1f8`}),(0,r.jsx)(`rect`,{className:`ui-to-bar`,x:`12`,y:`80`,width:`140`,height:`6`,rx:`2`,fill:`#edf1f8`}),(0,r.jsx)(`rect`,{className:`ui-to-bar`,x:`12`,y:`88`,width:`55`,height:`6`,rx:`2`,fill:`#edf1f8`})]})]},e)),i.map(({n:e,x:t,y:n})=>(0,r.jsxs)(`g`,{className:`ui-to-front ui-to-front-${e}`,children:[(0,r.jsx)(`circle`,{cx:t+14,cy:n+14,r:`3`,fill:`#ff6b5c`}),(0,r.jsx)(`circle`,{cx:t+24,cy:n+14,r:`3`,fill:`#ffb89e`}),(0,r.jsx)(`circle`,{cx:t+34,cy:n+14,r:`3`,fill:`#f69eae`}),(0,r.jsx)(`path`,{d:`M ${t} 240 L ${t} ${n+6} A 6 6 0 0 1 ${t+6} ${n} L ${e===3?360:t+95} ${n}`,fill:`none`,stroke:`url(#${a}-stroke)`,strokeWidth:`0.8`})]},e))]})]})}var o=`
.ui-to {
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 2;
  overflow: hidden;
  /* Fade out towards the right and bottom edge */
  -webkit-mask-image:
    linear-gradient(to right, #000000 70%, transparent 100%),
    linear-gradient(to bottom, #000000 70%, transparent 100%);
  -webkit-mask-composite: source-in;
  mask-image:
    linear-gradient(to right, #000000 70%, transparent 100%),
    linear-gradient(to bottom, #000000 70%, transparent 100%);
  mask-composite: intersect;
}
.ui-to-art {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
}

/* Placeholder blocks shimmer softly */
.ui-to-bar { animation: ui-to-shimmer 2.4s ease-in-out infinite; }
@keyframes ui-to-shimmer {
  0%, 100% { fill: #edf1f8; }
  50% { fill: #dae1ec; }
}

/* The highlight follows the hovered window; the front window is active by default */
.ui-to-blobs,
.ui-to-front {
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}
.ui-to-content {
  opacity: 0.2;
  pointer-events: none;
  transition: opacity 0.3s ease;
}
.ui-to-blobs-3,
.ui-to-front-3,
.ui-to-content-3 { opacity: 1; }

.ui-to-art:has(.ui-to-tab-1:hover) .ui-to-blobs-1,
.ui-to-art:has(.ui-to-tab-1:hover) .ui-to-front-1,
.ui-to-art:has(.ui-to-tab-1:hover) .ui-to-content-1,
.ui-to-art:has(.ui-to-tab-2:hover) .ui-to-blobs-2,
.ui-to-art:has(.ui-to-tab-2:hover) .ui-to-front-2,
.ui-to-art:has(.ui-to-tab-2:hover) .ui-to-content-2 { opacity: 1; }

.ui-to-art:has(.ui-to-tab-1:hover, .ui-to-tab-2:hover) .ui-to-blobs-3,
.ui-to-art:has(.ui-to-tab-1:hover, .ui-to-tab-2:hover) .ui-to-front-3 { opacity: 0; }
.ui-to-art:has(.ui-to-tab-1:hover, .ui-to-tab-2:hover) .ui-to-content-3 { opacity: 0.2; }

@media (prefers-reduced-motion: reduce) {
  .ui-to-bar { animation: none; }
  .ui-to-blobs, .ui-to-front, .ui-to-content { transition: none; }
}

/* Dark mode: follows a .dark class or data-theme="dark" on any ancestor, e.g. <html> */
:where(.dark, [data-theme="dark"]) .ui-to-frame { fill: #061a39; stroke: rgba(255, 255, 255, 0.1); }
:where(.dark, [data-theme="dark"]) .ui-to-dot { fill: #213b61; }
:where(.dark, [data-theme="dark"]) .ui-to-page { fill: #0b2345; stroke: rgba(255, 255, 255, 0.08); }
:where(.dark, [data-theme="dark"]) .ui-to-bar { fill: #122e56; }
@media (prefers-reduced-motion: no-preference) {
  :where(.dark, [data-theme="dark"]) .ui-to-bar { animation-name: ui-to-shimmer-dark; }
}
@keyframes ui-to-shimmer-dark {
  0%, 100% { fill: #122e56; }
  50% { fill: #213b61; }
}
`;function s(){return(0,r.jsx)(`div`,{className:`tab-overload-demo`,children:(0,r.jsx)(a,{})})}export{s as default};