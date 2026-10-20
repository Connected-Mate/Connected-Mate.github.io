#!/usr/bin/env node

import { createReadStream } from "node:fs";
import fs from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE = path.join(ROOT, "site");
const LIBRARY = path.join(ROOT, "library");
const ORIGIN = (process.env.MIRROR_ORIGIN || "https://www.affectui.com").replace(/\/$/, "");
const FALLBACK_SOURCE_ORIGIN = "https://affectui.vercel.app";
let sourceOrigin = (process.env.MIRROR_SOURCE_ORIGIN || ORIGIN).replace(/\/$/, "");
const CONCURRENCY = 8;
const args = new Set(process.argv.slice(2));
const portFlag = process.argv.indexOf("--port");
const port = Number(portFlag >= 0 ? process.argv[portFlag + 1] : process.env.PORT || 4173);
const assetPattern = /\.(?:avif|css|gif|ico|jpe?g|js|json|png|svg|ttf|webmanifest|webp|woff2?)$/i;
const textPattern = /\.(?:css|js|json|svg|webmanifest)$/i;
const excludedAssetPattern = /\/(?:AccountPage|LoginPage|PartnerPage|PricingPage)-[^/]+\.(?:css|js)$/i;
const excludedRoutePattern = /^\/(?:account|api|login|partner)(?:\/|$)/;
const salesRoutePattern = /^\/(?:pricing|pro)(?:\/|$)/;
const aiComponentSlugs = new Set(["email-draft", "prompt-library", "smart-recommendation"]);
const publicRoutes = [
  "/",
  "/components",
  "/screens",
  "/blocks",
  "/illustrations",
  "/motion",
  "/docs",
  "/docs/introduction",
  "/docs/installation",
  "/docs/theming",
  "/docs/accessibility",
  "/docs/ai",
  "/pricing",
  "/contact",
  "/license",
  "/terms",
  "/privacy",
  "/refund",
  "/imprint",
];
const publicResources = ["/robots.txt", "/llms.txt", "/llms-full.txt", "/og.jpg"];
const mimeTypes = {
  ".avif": "image/avif",
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ttf": "font/ttf",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".xml": "application/xml; charset=utf-8",
};

function routeFile(route) {
  return route === "/" ? path.join(SITE, "index.html") : path.join(SITE, route.slice(1), "index.html");
}

function localFile(pathname) {
  const decoded = decodeURIComponent(pathname).replace(/^\/+/, "");
  const resolved = path.resolve(SITE, decoded);
  if (resolved !== SITE && !resolved.startsWith(`${SITE}${path.sep}`)) {
    throw new Error(`Unsafe local path: ${pathname}`);
  }
  return resolved;
}

async function exists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

async function walk(directory) {
  if (!(await exists(directory))) return [];
  const files = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(target)));
    else if (entry.isFile()) files.push(target);
  }
  return files;
}

async function mapLimit(values, limit, worker) {
  const results = new Array(values.length);
  let cursor = 0;
  async function run() {
    while (cursor < values.length) {
      const index = cursor++;
      results[index] = await worker(values[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, values.length) }, run));
  return results;
}

async function request(pathname, options = {}) {
  const url = new URL(pathname, `${sourceOrigin}/`);
  if (url.origin !== sourceOrigin) throw new Error(`Refusing cross-origin fetch: ${url}`);
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(url, {
        headers: { "user-agent": "Connected-Mate-authorized-static-mirror/1.0", accept: options.accept || "*/*" },
        redirect: "follow",
        signal: AbortSignal.timeout(30_000),
      });
      const body = Buffer.from(await response.arrayBuffer());
      if (response.ok || [401, 403, 404].includes(response.status)) {
        return { body, contentType: response.headers.get("content-type") || "", status: response.status, url };
      }
      lastError = new Error(`${response.status} ${response.statusText}: ${url}`);
      if (response.status < 500 && response.status !== 429) throw lastError;
    } catch (error) {
      lastError = error;
    }
    if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, attempt * 750));
  }
  throw lastError;
}

const SITE_URL = "https://connected-mate.github.io";
const SITE_REPO = "https://github.com/Connected-Mate/Connected-Mate.github.io";
const SCALING_ROUTE = "/components/agent-tree-scaling";

function compatibilityScript() {
  return `<script data-static-mirror-compatibility>
(() => {
  const serverOnly = /^\\/(?:login|account|partner|api)(?:\\/|$)/;
  const salesOnly = /^\\/(?:pricing|pro)(?:\\/|$)/;
  const scalingPath = ${JSON.stringify(SCALING_ROUTE)};
  const libraryPath = (value) => {
    const target = new URL(value, window.location.href);
    return target.origin === window.location.origin && (salesOnly.test(target.pathname) || serverOnly.test(target.pathname))
      ? "/components" + target.search + target.hash
      : value;
  };
  if (salesOnly.test(window.location.pathname) || serverOnly.test(window.location.pathname)) {
    window.location.replace("/components" + window.location.search + window.location.hash);
    return;
  }
  for (const method of ["pushState", "replaceState"]) {
    const original = window.history[method].bind(window.history);
    window.history[method] = (state, title, url) => original(state, title, url == null ? url : libraryPath(url));
  }
  const relabel = (root) => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (node.textContent.trim() === "Agent Tree") node.textContent = node.textContent.replace("Agent Tree", "Agent Tree Scaling");
    }
  };
  const injectScaling = () => {
    document.querySelectorAll('a[href="/components/agent-tree"]').forEach((anchor) => {
      const parent = anchor.parentElement;
      if (!parent || parent.querySelector('a[href="' + scalingPath + '"]')) return;
      const clone = anchor.cloneNode(true);
      clone.setAttribute("href", scalingPath);
      clone.removeAttribute("aria-current");
      clone.classList.remove("active", "nav-link--active");
      relabel(clone);
      const image = clone.querySelector("img[src*='/previews/']");
      if (image) image.src = "/previews/agent-tree-scaling.webp";
      anchor.insertAdjacentElement("afterend", clone);
    });
  };
  const removeSalesLayer = () => {
    document.querySelectorAll(".offer-banner, .consent").forEach((element) => element.remove());
    document.querySelectorAll("a[href]").forEach((anchor) => {
      const target = new URL(anchor.getAttribute("href"), window.location.href);
      if (target.origin === window.location.origin && (salesOnly.test(target.pathname) || serverOnly.test(target.pathname))) anchor.remove();
    });
    document.querySelectorAll("button").forEach((button) => {
      const label = button.textContent.trim().replace(/\s+/g, " ");
      if (/^(?:Get Pro|Unlock (?:with )?Pro|See Pro|Get lifetime access|Cookie settings|Sign in|Log in)$/i.test(label)) button.remove();
    });
    injectScaling();
  };
  let queued = false;
  const scheduleCleanup = () => {
    if (queued) return;
    queued = true;
    queueMicrotask(() => {
      queued = false;
      removeSalesLayer();
    });
  };
  new MutationObserver(scheduleCleanup).observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener("DOMContentLoaded", scheduleCleanup);
  scheduleCleanup();
  document.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = event.target?.closest?.("a[href]");
    if (!anchor) return;
    const target = new URL(anchor.getAttribute("href"), window.location.href);
    if (target.origin !== window.location.origin) return;
    if (target.pathname === scalingPath) {
      event.preventDefault();
      event.stopImmediatePropagation();
      window.location.assign(scalingPath);
    } else if (salesOnly.test(target.pathname) || serverOnly.test(target.pathname)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      window.location.assign("/components" + target.search + target.hash);
    }
  }, true);
})();
</script>`;
}

function patchHtml(source) {
  if (source.includes("data-static-mirror-compatibility")) return source;
  const script = compatibilityScript();
  if (source.includes('<script type="module"')) return source.replace('<script type="module"', `${script}\n    <script type="module"`);
  return source.replace("</head>", `${script}\n  </head>`);
}

function redirectHtml(target) {
  const destination = JSON.stringify(target);
  return `<!doctype html>
<html lang="en" data-sales-redirect="${target}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex" />
    <meta http-equiv="refresh" content="0; url=${target}" />
    <title>Redirecting · affectUI</title>
    <script data-static-mirror-compatibility>window.location.replace(${destination});</script>
  </head>
  <body><p><a href="${target}">Continue to the component library</a></p></body>
</html>
`;
}

function replaceOnce(source, search, replacement, label) {
  if (!source.includes(search)) throw new Error(`Mirror customization target missing: ${label}`);
  return source.replace(search, replacement);
}

function replacePatternOnce(source, pattern, replacement, label) {
  if (!pattern.test(source)) throw new Error(`Mirror customization target missing: ${label}`);
  return source.replace(pattern, replacement);
}

function replaceFunction(source, startMarker, endMarker, replacement, label) {
  const start = source.indexOf(startMarker);
  const end = start < 0 ? -1 : source.indexOf(endMarker, start);
  if (start < 0 || end < 0) throw new Error(`Mirror customization function missing: ${label}`);
  return `${source.slice(0, start)}${replacement}${source.slice(end)}`;
}

function balancedRange(source, start, openCharacter, closeCharacter, label) {
  let quote = null;
  let escaped = false;
  let depth = 0;
  for (let index = start; index < source.length; index++) {
    const character = source[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (character === "\\") escaped = true;
      else if (character === quote) quote = null;
      continue;
    }
    if (character === '"' || character === "'" || character === "`") quote = character;
    else if (character === openCharacter) depth++;
    else if (character === closeCharacter && --depth === 0) return { start, end: index, text: source.slice(start, index + 1) };
  }
  throw new Error(`Unbalanced mirror customization target: ${label}`);
}

function replaceFunctionContaining(source, marker, replacement, label) {
  const markerIndex = source.indexOf(marker);
  const start = markerIndex < 0 ? -1 : source.lastIndexOf("function ", markerIndex);
  const parameters = start < 0 ? null : balancedRange(source, source.indexOf("(", start), "(", ")", label);
  const open = parameters ? source.indexOf("{", parameters.end) : -1;
  if (markerIndex < 0 || start < 0 || open < 0) throw new Error(`Mirror customization function missing: ${label}`);
  const range = balancedRange(source, open, "{", "}", label);
  const original = source.slice(start, range.end + 1);
  const name = original.match(/^function ([\w$]+)/)?.[1];
  if (!name) throw new Error(`Mirror customization function has no name: ${label}`);
  const next = typeof replacement === "function" ? replacement(name, original) : `function ${name}(){${replacement}}`;
  return `${source.slice(0, start)}${next}${source.slice(range.end + 1)}`;
}

function replaceLockedCardAction(source) {
  const marker = "Part of Pro – get Pro to copy";
  const markerIndex = source.indexOf(marker);
  const functionStart = markerIndex < 0 ? -1 : source.lastIndexOf("function ", markerIndex);
  const parameters = functionStart < 0 ? null : balancedRange(source, source.indexOf("(", functionStart), "(", ")", "locked card action");
  const functionOpen = parameters ? source.indexOf("{", parameters.end) : -1;
  if (markerIndex < 0 || functionStart < 0 || functionOpen < 0) throw new Error("Mirror customization target missing: locked card action");
  const functionRange = balancedRange(source, functionOpen, "{", "}", "locked card action");
  const original = source.slice(functionStart, functionRange.end + 1);
  const localMarker = original.indexOf(marker);
  const buttonStart = original.lastIndexOf("(0,", localMarker);
  const separator = original.indexOf("):(", localMarker);
  const childrenStart = original.lastIndexOf("children:", buttonStart);
  const entry = original.slice(childrenStart, buttonStart).match(/children:([\w$]+)\.pro/)?.[1];
  if (buttonStart < 0 || separator < 0 || childrenStart < 0 || !entry) throw new Error("Could not parse locked card action");
  const copyStart = separator + 2;
  const copyRange = balancedRange(original, copyStart, "(", ")", "locked card copy action");
  const updated = `${original.slice(0, childrenStart)}children:${entry}.pro?null:${original.slice(copyStart, copyRange.end + 1)}${original.slice(copyRange.end + 1)}`;
  return `${source.slice(0, functionStart)}${updated}${source.slice(functionRange.end + 1)}`;
}

function replaceJsxSection(source, idMarker, nextIdMarker, replacement, label) {
  const id = source.indexOf(idMarker);
  const nextId = id < 0 ? -1 : source.indexOf(nextIdMarker, id);
  const start = id < 0 ? -1 : source.lastIndexOf("(0,", id);
  const end = nextId < 0 ? -1 : source.lastIndexOf(",(0,", nextId);
  if (id < 0 || nextId < 0 || start < 0 || end <= start) throw new Error(`Mirror customization section missing: ${label}`);
  const original = source.slice(start, end);
  const parts = original.match(/^\(0,([\w$]+)\.jsx[s]?\)\(([\w$]+),/);
  if (!parts) throw new Error(`Mirror customization section has no JSX namespace: ${label}`);
  return `${source.slice(0, start)}${replacement(parts[1], parts[2])}${source.slice(end)}`;
}

function patchJavaScript(source) {
  let output = source;
  output = output.replaceAll(/sk-live-[A-Za-z0-9]{20}/g, "sk-live-••••••••••••••••••••");
  if (output.includes("/_vercel/insights/script.js")) {
    output = output.replaceAll("`/_vercel/insights/script.js`", "`data:application/javascript,`");
    output = output.replaceAll("`https://va.vercel-scripts.com/v1/script.debug.js`", "`data:application/javascript,`");
  }
  output = output.replaceAll("fetch(`/api/checkout`,{method:`GET`})", "Promise.resolve()");
  const checkout = output.indexOf("fetch(`/api/checkout`,{method:`POST`");
  if (checkout >= 0) {
    const start = output.lastIndexOf("async function ", checkout);
    const end = output.indexOf("}var ", checkout);
    const signature = start >= 0 ? output.slice(start, checkout).match(/^async function ([\w$]+)\(/) : null;
    if (!signature || end < 0) throw new Error("Could not safely externalize the checkout handler");
    output = `${output.slice(0, start)}async function ${signature[1]}(){window.location.assign(${JSON.stringify(`${ORIGIN}/pricing`)})}${output.slice(end + 1)}`;
  }

  if (output.includes("card__pro") && output.includes("offer-banner")) {
    let badgeName;
    output = replaceFunctionContaining(output, "className:`pro-badge ${e}`", (name, original) => {
      badgeName = name;
      const className = original.match(/\{className:([\w$]+)=``\}/)?.[1];
      if (!className || !original.includes("children:`Pro`")) throw new Error("Could not parse Pro badge renderer");
      let updated = original.replace(`function ${name}({className:${className}=\`\`})`, `function ${name}({className:${className}=\`\`,entry:t})`);
      updated = updated.replace("return", "return t&&(!t.kind||t.kind===`component`)&&(t.category===`Agents`||t.category===`Chat`||[`email-draft`,`prompt-library`,`smart-recommendation`].includes(t.slug))?");
      updated = updated.replace("children:`Pro`", "children:`AI component`");
      return `${updated.slice(0, -1)}:null}`;
    }, "AI component badge renderer");
    output = replacePatternOnce(output, /([\w$]+)\.pro&&\(0,([\w$]+)\.jsx\)\(([\w$]+),\{className:`card__pro`\}\)/, "$1.pro&&(0,$2.jsx)($3,{className:`card__pro`,entry:$1})", "card badge entry");
    output = output.replaceAll(/([\w$]+)\.pro&&\(0,([\w$]+)\.jsx\)\(([\w$]+),\{className:`nav-link__pro`\}\)/g, "$1.pro&&(0,$2.jsx)($3,{className:`nav-link__pro`,entry:$1})");
    output = replacePatternOnce(output, /([\w$]+)\.pro&&\(0,([\w$]+)\.jsx\)\(`span`,\{className:`nav-link__pro-mark`,role:`img`,"aria-label":`Pro`,"data-tip":`Pro`,children:\(0,\2\.jsx\)\([\w$]+,\{icon:[\w$]+,size:10\}\)\}\)/, `$1.pro&&(0,$2.jsx)(${badgeName},{className:\`nav-link__pro\`,entry:$1})`, "sidebar icon badge entry");
    output = replaceFunctionContaining(output, "className:`btn pro-badge btn--pro", "return null", "Get Pro button");
    output = replaceFunctionContaining(output, "className:`locked`", (name, original) => {
      let updated = original.replace("[t,` is part of Pro`]", "[t,` is not included in this static mirror`]");
      updated = updated.replace("Get Pro to copy the code, install it with the CLI and use it in your projects.", "The preview and documentation remain available.");
      updated = updated.replace(/,\(0,[\w$]+\.jsx\)\([\w$]+,\{label:[\w$]+\?`Get Pro`:`Unlock with Pro`\}\)/, "");
      if (updated === original) throw new Error("Could not neutralize locked-source panel");
      return updated;
    }, "neutral locked-source panel");
    output = replaceFunctionContaining(output, "className:`offer-banner`", "return null", "offer banner");
    output = replaceFunctionContaining(output, "googletagmanager.com/gtag/js", "return null", "Google Analytics loader");
    output = replaceFunctionContaining(output, "connect.facebook.net/en_US/fbevents.js", "return null", "Meta Pixel loader");
    output = replaceFunctionContaining(output, "className:`consent`", "return null", "cookie consent banner");
    output = replaceFunctionContaining(output, "className:`promo upsell`", "return null", "upsell modal");
    output = replaceFunctionContaining(output, "id:`promo-title`", "return null", "promotional modal");
    output = replaceLockedCardAction(output);
    output = replaceFunctionContaining(output, "id:`copy-nudge`", "return null", "Pro copy toast");
    output = replaceOnce(output, "q:`What is free and what is Pro?`", "q:`What is included in this static mirror?`", "landing FAQ question");
    output = replaceOnce(output, " items are free to copy and keep. Pro unlocks every item with source and all future updates – you pay once, there is no subscription.", " items are free to copy and keep. Locked previews and documentation remain available; their source is not included in this static mirror.", "landing FAQ answer");
    output = replaceOnce(output, "a:`Yes. Pro includes a commercial license for unlimited projects, for you and your clients.`", "a:`Yes. The included free library is MIT licensed, including use in client projects.`", "landing license answer");
    output = replaceOnce(output, "`Works with every MCP client. No key needed for the free items and all docs; Pro members add their access key for the Pro source. Prefer plain text? `", "`Works with every MCP client. No key is needed for the free items and all docs in this mirror; locked source is not included. Prefer plain text? `", "landing MCP note");
    output = replaceJsxSection(output, "id:`free-and-pro`", "title:`Installation`", (jsx, section) => `(0,${jsx}.jsx)(${section},{id:\`free-and-pro\`,title:\`Free and server-backed items\`,children:(0,${jsx}.jsx)(\`p\`,{className:\`doc__p\`,children:\`Free items can be used in any project. Locked previews and documentation remain available; their source is not included in this static mirror.\`})})`, "introduction Pro documentation");
    output = replaceJsxSection(output, "id:`pro`", "id:`manual`", (jsx, section) => `(0,${jsx}.jsx)(${section},{id:\`server-backed-source\`,title:\`Locked source\`,children:(0,${jsx}.jsx)(\`p\`,{className:\`doc__p\`,children:\`Locked previews and documentation remain available. Their source and registry packages are not included in this static mirror; no account or access-key flow is mirrored.\`})})`, "installation Pro documentation");
    output = replaceJsxSection(output, "id:`mcp-pro`", "id:`llms`", (jsx, section) => `(0,${jsx}.jsx)(${section},{id:\`mcp-locked\`,title:\`Locked source and MCP\`,children:(0,${jsx}.jsx)(\`p\`,{className:\`doc__p\`,children:\`The mirrored documentation and free registry work without a key. Locked source is not included in this static mirror.\`})})`, "MCP Pro documentation");
  }

  if (output.includes(" as ComponentPage")) {
    output = replacePatternOnce(output, /`   It's a Pro item – the command needs my \$\{[\w$]+\.name\} access key, set up as described at \$\{[\w$]+\.url\}\/docs\/installation#pro`/, "`   Its source is not included in this static mirror; use the preview and documentation as the reference.`", "locked AI prompt");
    output = replacePatternOnce(output, /onClick:async\(\)=>\{if\(!t\)return [\w$]+\(`Get Pro`,\{from:`page copy`,item:e\.slug\}\),[\w$]+\(\{entry:e,from:`page copy`\}\);if\(n\)try\{/, "onClick:async()=>{if(!t)return;if(n)try{", "locked copy action");
    output = replaceOnce(output, "title:t?`Copy the source code`:`The code is part of Pro`,children:", "title:t?`Copy the source code`:`Source is not included in this static mirror.`,disabled:!t||void 0,children:", "locked copy button");
    output = replacePatternOnce(output, /\(0,([\w$]+)\.jsx\)\(([\w$]+),\{label:`Get Pro to install`\}\)/, "(0,$1.jsx)(`span`,{className:`doc__p`,children:`Source is not included in this static mirror.`})", "locked install callout");
    output = replaceOnce(output, "lead:`${e.name} is a Pro component.`", "lead:`${e.name} source is not included in this static mirror.`", "locked installation heading");
  }
  return output;
}

// ---------- Phase 2: debrand, open bundled source, custom component ----------

function swapAll(source, search, replacement, label, warnings) {
  if (!source.includes(search)) {
    if (!source.includes(replacement)) warnings.push(`${label}: target not found`);
    return source;
  }
  return source.split(search).join(replacement);
}

function debrand(source) {
  let out = source;
  const ordered = [
    ["affectUI · Agent-ready React UI for AI products", "Agent-ready React UI for AI products"],
    ["affectUI · Agent-ready UI for AI products", "Agent-ready UI for AI products"],
    ["affectUI – Agent-ready UI for AI products", "Agent-ready UI for AI products"],
    ["affectUI – Polished UI for React, ready to ship", "Polished UI for React, ready to ship"],
    ["Connect the affectUI MCP server", "Connect the MCP server"],
    ["Use the affectUI MCP server", "Use the MCP server"],
    ["What is affectUI?", "What is this library?"],
    ["affectUI Team", "Team plan"],
    ["affectUI Individual", "Individual plan"],
    ["www.affectui.com", "connected-mate.github.io"],
    ["affectui.com", "connected-mate.github.io"],
    ["@affectui", "@components"],
    ["AFFECTUI_TOKEN", "COMPONENTS_TOKEN"],
    ["AffectUI", "Components"],
    ["affectUI", "Components"],
    ["affectui", "components"],
  ];
  for (const [search, replacement] of ordered) out = out.split(search).join(replacement);
  return out;
}

function phase2IndexBundle(source, warnings) {
  let out = source;
  const swap = (search, replacement, label) => { out = swapAll(out, search, replacement, label, warnings); };
  swap(
    "async function R(e){if(!e.pro)return e.loadSource();",
    "async function R(e){if(!e.pro)return e.loadSource();{let z=await fetch(`/demo-source/${e.sourceSlug??e.slug}.js`);if(z.ok)return z.text()}",
    "open bundled source loader",
  );
  swap("if(r(null),a&&!t)return;", "if(r(null),!1)return;", "code loads without session");
  swap("[t,` is not included in this static mirror`]", "[t,` — source under the Code tab`]", "locked panel title");
  swap("The preview and documentation remain available.", "Open the Code tab to copy the bundled source.", "locked panel body");
  swap(
    "Free items can be used in any project. Locked previews and documentation remain available; their source is not included in this static mirror.",
    "Free items ship their original source in the registry. Every other item includes the bundled source of its live preview under the Code tab.",
    "introduction source note",
  );
  swap(
    "Locked previews and documentation remain available. Their source and registry packages are not included in this static mirror; no account or access-key flow is mirrored.",
    "Every item includes its live preview, its documentation and the bundled source of that preview under the Code tab.",
    "installation source note",
  );
  swap(
    "The mirrored documentation and free registry work without a key. Locked source is not included in this static mirror.",
    "The documentation and the free registry work without a key; every page also ships the bundled source of its preview.",
    "MCP source note",
  );
  swap(
    "Works with every MCP client. No key is needed for the free items and all docs in this mirror; locked source is not included. Prefer plain text? ",
    "Works with every MCP client. No key is needed for the free items and all docs. Prefer plain text? ",
    "landing MCP note",
  );
  swap(
    " items are free to copy and keep. Locked previews and documentation remain available; their source is not included in this static mirror.",
    " items are free to copy and keep. Every other item ships the bundled source of its live preview under the Code tab.",
    "landing FAQ answer",
  );
  swap("title:`Locked source and MCP`", "title:`Source and MCP`", "MCP section title");
  swap("title:`Locked source`", "title:`Component source`", "installation section title");
  swap("title:`Free and server-backed items`", "title:`Free and bundled items`", "introduction section title");
  swap("title:`What ${c.name} is`", "title:`What this is`", "introduction heading");
  swap("[c.name,` is a library of React components", "[`This`,` is a library of React components", "introduction first sentence");
  swap("description:`What ${c.name} is, how it is organized", "description:`What this library is, how it is organized", "docs nav description");
  swap("`${e} · ${c.name}`", "`${e}`", "document title template");
  swap("`${c.name} · Agent-ready React UI for AI products`", "`Agent-ready React UI for AI products`", "home document title");
  swap("`${c.name} home`", "`Home`", "logo aria label");
  swap("`${c.name} on GitHub, ${t} stars`", "`${t} stars on GitHub`", "GitHub stars aria label");
  swap("`${c.name} on GitHub`", "`GitHub repository`", "GitHub aria label");
  return out;
}

function phase2ComponentPage(source, warnings) {
  let out = source;
  const swap = (search, replacement, label) => { out = swapAll(out, search, replacement, label, warnings); };
  swap("x=!l.pro||y?.plan===`pro`,S=N(l,x)", "x=!0,S=N(l,x)", "every page unlocked");
  swap(
    "title:t?`Copy the source code`:`Source is not included in this static mirror.`",
    "title:`Copy the source code`",
    "copy button title",
  );
  swap(
    "Source is not included in this static mirror.",
    "Copy the source from the Code tab above.",
    "install locked note",
  );
  swap("x?(0,R.jsx)(c,{command:n(f)", "x&&!l.pro?(0,R.jsx)(c,{command:n(f)", "header install command only for registry items");
  swap("o=e.sourceSlug??e.slug;return t?", "o=e.sourceSlug??e.slug;return t&&!e.pro?", "install section only for registry items");
  swap(
    "lead:`${e.name} source is not included in this static mirror.`",
    "lead:`Copy the source of ${e.name} from the Code tab above.`",
    "install lead",
  );
  swap(
    "Its source is not included in this static mirror; use the preview and documentation as the reference.",
    "Use the bundled source from the Code tab, the preview and the documentation as the reference.",
    "AI prompt source note",
  );
  return out;
}

function phase2SiteConfig(source, warnings) {
  let out = source;
  const swap = (search, replacement, label) => { out = swapAll(out, search, replacement, label, warnings); };
  swap("name:`affectUI`", "name:``", "site name removed");
  swap("registry:`@affectui`", "registry:`@components`", "registry name");
  swap("url:`https://www.affectui.com`", `url:\`${SITE_URL}\``, "site url");
  swap("author:{name:`Flo`,url:`https://x.com/flohoeller`}", "author:{name:`Connected Mate`,url:`https://github.com/Connected-Mate`}", "author");
  swap("contactEmail:`office@adfects.com`", "contactEmail:``", "contact email");
  swap(
    "links:{pro:`/pricing`,github:`https://github.com/flohoeller/affectui`,feedback:`#`,x:`https://x.com/flohoeller`,support:`/contact?topic=support`}",
    `links:{pro:\`/components\`,github:\`${SITE_REPO}\`,feedback:\`${SITE_REPO}/issues\`,x:\`https://github.com/Connected-Mate\`,support:\`/contact\`}`,
    "footer links",
  );
  return out;
}

function phase2LegalPage(source, warnings) {
  let out = source;
  const swap = (search, replacement, label) => { out = swapAll(out, search, replacement, label, warnings); };
  swap(
    "a={name:`Florian Höller`,trade:`adfects`,street:`Romana Dmowskiego 1b/40`,city:`50-203 Wrocław`,country:`Poland`,email:`office@adfects.com`,phone:`+48 608 678 868`,vat:`PL8982328320`}",
    "a={name:`Connected Mate`,trade:`Connected Mate`,street:``,city:``,country:``,email:``,phone:``,vat:``}",
    "legal entity",
  );
  swap(
    "c=()=>(0,i.jsxs)(i.Fragment,{children:[a.name,`, trading as `,a.trade,`, `,a.street,`, `,a.city,`, `,a.country,`, VAT ID `,a.vat]})",
    "c=()=>(0,i.jsx)(i.Fragment,{children:`Connected Mate (github.com/Connected-Mate)`})",
    "legal entity sentence",
  );
  swap(
    "s=()=>(0,i.jsx)(`a`,{href:`mailto:${a.email}`,children:a.email})",
    `s=()=>(0,i.jsx)(\`a\`,{href:\`${SITE_REPO}\`,children:\`github.com/Connected-Mate\`})`,
    "legal contact link",
  );
  swap(
    "lead:`The rules for using ${t.name} and for buying a Pro license. Written to be read, not skimmed past.`",
    "lead:`The rules for using this library. Written to be read, not skimmed past.`",
    "terms lead",
  );
  const imprintMarker = "imprint:{title:`Imprint`";
  const markerIndex = out.indexOf(imprintMarker);
  if (markerIndex >= 0) {
    const open = out.indexOf("{", markerIndex);
    const range = balancedRange(out, open, "{", "}", "imprint section");
    const replacement = `{title:\`Imprint\`,lead:\`Who runs this site.\`,body:(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(\`p\`,{children:\`This site is published by Connected Mate.\`}),(0,i.jsxs)(\`p\`,{children:[\`Source, issues and contact: \`,(0,i.jsx)(\`a\`,{href:\`${SITE_REPO}\`,children:\`github.com/Connected-Mate/Connected-Mate.github.io\`})]})]})}`;
    out = `${out.slice(0, open)}${replacement}${out.slice(range.end + 1)}`;
  } else if (!out.includes("Who runs this site.")) {
    warnings.push("imprint section: target not found");
  }
  return out;
}

const CONTACT_PAGE_SOURCE = `import{t as e}from"./react-BkAXpnfr.js";import{t as r}from"./jsx-runtime-CTsRTJUX.js";import{j as l}from"./index-C2dRF6Sj.js";var u=e(),d=r();function p(){return(0,d.jsxs)(\`div\`,{className:\`login\`,children:[(0,d.jsxs)(\`button\`,{className:\`btn btn--ghost login__back\`,onClick:()=>window.history.length>1?window.history.back():window.location.assign(\`/\`),children:[\`Back\`]}),(0,d.jsxs)(\`div\`,{className:\`login__card\`,children:[(0,d.jsx)(l,{size:28,className:\`login__mark\`}),(0,d.jsx)(\`h1\`,{className:\`login__title\`,children:\`Get in touch\`}),(0,d.jsx)(\`p\`,{className:\`login__sub\`,children:\`Questions, feedback or ideas – open an issue on GitHub, we read everything.\`}),(0,d.jsx)(\`a\`,{className:\`tier__cta tier__cta--primary login__submit\`,href:\`${SITE_REPO}/issues\`,target:\`_blank\`,rel:\`noreferrer\`,children:\`Open a GitHub issue\`})]})]})}export{p as ContactPage};
`;

function llmsTxt() {
  return `# Components

> Agent-ready React UI for AI products and SaaS: components, screens, blocks, illustrations and motion effects. Free items are one .tsx file each with styles inside – no Tailwind, no animation library, no other dependencies. React 19, dark mode and reduced motion built in.

Free items are open source (MIT). Every other page ships its live preview, its documentation and the bundled source of that preview under the Code tab.

## How to add a free item

- \`npx shadcn@latest add ${SITE_URL}/r/<slug>.json\` – the file lands in components/ui.
- Short names: register \`"@components": "${SITE_URL}/r/{name}.json"\` under "registries" in components.json, then \`npx shadcn@latest add @components/<slug>\`.
- Import from \`@/components/ui/<slug>\` and keep the component's own styles and motion; adapt only content and props.

## Docs

- [Introduction](${SITE_URL}/docs/introduction): what this library is and how it is organized
- [Installation](${SITE_URL}/docs/installation): shadcn CLI, short names
- [Theming](${SITE_URL}/docs/theming): colors via CSS variables, dark mode
- [Accessibility](${SITE_URL}/docs/accessibility): keyboard, focus, reduced motion
- [Using with AI](${SITE_URL}/docs/ai): prompts and setup for coding assistants
- [Full docs in one file](${SITE_URL}/llms-full.txt): every item's usage, props and notes

## Components

Browse every component at ${SITE_URL}/components – each page has a live preview, a Code tab with source, documentation and a Copy prompt bar for coding assistants.
`;
}

async function generateDemoSources(mainSource, warnings) {
  const mod = await import("js-beautify");
  const js_beautify = mod.js_beautify ?? mod.default?.js_beautify ?? mod.default;
  if (typeof js_beautify !== "function") throw new Error("js-beautify is not available; run npm install");
  const outDir = path.join(SITE, "demo-source");
  await fs.mkdir(outDir, { recursive: true });
  const seen = new Set();
  let count = 0;
  for (const match of mainSource.matchAll(/slug:`([a-z0-9-]+)`/g)) {
    const slug = match[1];
    if (seen.has(slug)) continue;
    seen.add(slug);
    let entry;
    try {
      entry = objectLiteralAt(mainSource, match.index);
    } catch {
      continue;
    }
    if (!/pro:!0/.test(entry)) continue;
    const name = entry.match(/name:`([^`]+)`/)?.[1] ?? slug;
    const demo = entry.match(/import\(`\.\/(demo-[A-Za-z0-9_-]+)\.js`\)/)?.[1];
    const demoClean = entry.match(/import\(`\.\/(demo\.clean-[A-Za-z0-9_-]+)\.js`\)/)?.[1];
    for (const [chunk, fileSlug] of [[demo, slug], [demoClean, `${slug}-clean`]]) {
      if (!chunk) continue;
      const file = path.join(SITE, "assets", `${chunk}.js`);
      if (!(await exists(file))) {
        warnings.push(`demo chunk missing for ${slug}: ${chunk}`);
        continue;
      }
      const pretty = js_beautify(await fs.readFile(file, "utf8"), { indent_size: 2 });
      const header = `// ${name} – bundled source of the live preview on this page.\n// Beautified from the production build; the bundler shortened identifier names.\n// Free items ship their original authored source through the registry instead.\n\n`;
      await fs.writeFile(path.join(outDir, `${fileSlug}.js`), header + pretty);
      count++;
    }
  }
  return count;
}

async function postprocess() {
  const warnings = [];
  const rootHtml = await fs.readFile(path.join(SITE, "index.html"), "utf8");
  const mainAsset = referencesIn(rootHtml, "/").find((pathname) => /\/assets\/index-[^/]+\.js$/.test(pathname));
  if (!mainAsset) throw new Error("Could not find the main JavaScript bundle for postprocess");
  const mainSource = await fs.readFile(localFile(mainAsset), "utf8");
  const demoCount = await generateDemoSources(mainSource, warnings);

  const files = await walk(SITE);
  for (const file of files) {
    const extension = path.extname(file);
    if (![".html", ".js", ".json", ".txt", ".webmanifest", ".svg"].includes(extension)) continue;
    const relative = path.relative(SITE, file).split(path.sep).join("/");
    if (relative === "routes.json") continue;
    let source = await fs.readFile(file, "utf8");
    let updated = source;
    if (extension === ".js" && !relative.startsWith("demo-source/")) {
      if (updated.includes("async function R(e){if(!e.pro)return e.loadSource();") || updated.includes("[t,` is not included in this static mirror`]") || updated.includes("if(r(null),a&&!t)return;")) {
        updated = phase2IndexBundle(updated, warnings);
      }
      if (updated.includes("prompt-bar__code") || updated.includes("x=!l.pro||y?.plan===`pro`")) {
        updated = phase2ComponentPage(updated, warnings);
      }
      if (updated.includes("name:`affectUI`") && updated.includes("tagline:")) {
        updated = phase2SiteConfig(updated, warnings);
      }
      if (updated.includes("trade:`adfects`") || updated.includes("imprint:{title:`Imprint`")) {
        updated = phase2LegalPage(updated, warnings);
      }
      if (updated.includes("/api/contact") && updated.includes("export{p as ContactPage}")) {
        updated = CONTACT_PAGE_SOURCE;
      }
    }
    if (extension === ".html") {
      updated = updated.replace(/<script data-static-mirror-compatibility>[\s\S]*?<\/script>/, () => compatibilityScript());
    }
    if (relative === "llms.txt") updated = llmsTxt();
    updated = debrand(updated);
    if (extension === ".txt") {
      updated = updated.split("(Pro, ").join("(").split(" (Pro)").join("");
    }
    if (updated !== source) await fs.writeFile(file, updated);
  }

  const inventoryPath = path.join(SITE, "routes.json");
  const inventory = JSON.parse(await fs.readFile(inventoryPath, "utf8"));
  if (!inventory.routes.includes(SCALING_ROUTE)) {
    inventory.routes.push(SCALING_ROUTE);
    inventory.routes.sort((a, b) => a.localeCompare(b));
  }
  inventory.custom = { ...inventory.custom, agentTreeScaling: SCALING_ROUTE };
  await fs.writeFile(inventoryPath, `${JSON.stringify(inventory, null, 2)}\n`);

  console.log(`Postprocess: generated ${demoCount} bundled-source files`);
  for (const warning of warnings) console.warn(`Postprocess warning: ${warning}`);
}

function normalizeReference(reference, basePath = "/") {
  const value = reference.trim();
  if (!value || /^(?:data|blob|mailto|tel|javascript):/i.test(value) || value.includes("${") || value.includes("{name}")) return null;
  let url;
  try {
    url = value.startsWith("assets/") ? new URL(`/${value}`, `${sourceOrigin}/`) : new URL(value, `${sourceOrigin}${basePath}`);
  } catch {
    return null;
  }
  if (url.origin !== sourceOrigin || excludedRoutePattern.test(url.pathname) || !assetPattern.test(url.pathname)) return null;
  return url.pathname;
}

function referencesIn(source, basePath = "/") {
  const found = new Set();
  const patterns = [
    /["'`](\/[^"'`\s]+?\.(?:avif|css|gif|ico|jpe?g|js|json|png|svg|ttf|webmanifest|webp|woff2?)(?:\?[^"'`\s]*)?)["'`]/gi,
    /["'`](\.\.?\/[^"'`\s]+?\.(?:avif|css|gif|ico|jpe?g|js|json|png|svg|ttf|webmanifest|webp|woff2?)(?:\?[^"'`\s]*)?)["'`]/gi,
    /["'`](assets\/[^"'`\s]+?\.(?:avif|css|gif|ico|jpe?g|js|json|png|svg|ttf|webmanifest|webp|woff2?)(?:\?[^"'`\s]*)?)["'`]/gi,
    /url\(\s*["']?([^"')\s]+)["']?\s*\)/gi,
  ];
  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) {
      const reference = normalizeReference(match[1], basePath);
      if (reference) found.add(reference);
    }
  }
  return [...found];
}

function objectLiteralAt(source, markerIndex) {
  const start = source.lastIndexOf("{", markerIndex);
  if (start < 0) throw new Error("Could not find item metadata object");
  let quote = null;
  let escaped = false;
  let depth = 0;
  for (let index = start; index < source.length; index++) {
    const character = source[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (character === "\\") escaped = true;
      else if (character === quote) quote = null;
      continue;
    }
    if (character === '"' || character === "'" || character === "`") quote = character;
    else if (character === "{") depth++;
    else if (character === "}" && --depth === 0) return source.slice(start, index + 1);
  }
  throw new Error("Unterminated item metadata object");
}

function isAiTaggedItem(item) {
  return item.kind === "components" && item.pro && (item.category === "Agents" || item.category === "Chat" || aiComponentSlugs.has(item.slug));
}

function discoverItems(mainSource) {
  const items = [];
  const seen = new Set();
  const add = (kind, slug) => {
    const key = `${kind}/${slug}`;
    if (seen.has(key)) return;
    seen.add(key);
    const marker = mainSource.indexOf(`slug:\`${slug}\``);
    if (marker < 0) throw new Error(`Could not discover metadata for ${key}`);
    const entry = objectLiteralAt(mainSource, marker);
    const category = entry.match(/category:`([^`]+)`/)?.[1];
    if (!category) throw new Error(`Could not discover category for ${key}`);
    items.push({ kind, slug, category, pro: /pro:!0/.test(entry) });
  };
  for (const match of mainSource.matchAll(/["`]\.\/([a-z0-9-]+)\/index\.ts["`]/g)) add("components", match[1]);
  for (const match of mainSource.matchAll(/["`]\.\.\/(blocks|illustrations|screens|motion)\/([a-z0-9-]+)\/index\.ts["`]/g)) add(match[1], match[2]);
  if (!items.some((item) => item.kind === "components" && item.slug === "progress-tracker")) {
    throw new Error("Route discovery did not find components/progress-tracker");
  }
  const registryNames = new Map();
  for (const item of items) {
    if (registryNames.has(item.slug) && registryNames.get(item.slug) !== item.kind) {
      throw new Error(`Registry slug is ambiguous: ${item.slug}`);
    }
    registryNames.set(item.slug, item.kind);
  }
  return items;
}

function discoverRoutes(items) {
  const routes = new Set(publicRoutes);
  for (const item of items) {
    routes.add(`/${item.kind}/${item.slug}`);
    if (item.kind === "screens") routes.add(`/${item.kind}/${item.slug}/full`);
    const category = item.category.toLowerCase().replace(/\s+/g, "-");
    routes.add(item.kind === "components" ? `/category/${category}` : `/${item.kind}/category/${category}`);
  }
  return [...routes].sort((a, b) => a.localeCompare(b));
}

async function saveRemote(pathname, options = {}) {
  if (excludedAssetPattern.test(pathname) || excludedRoutePattern.test(pathname)) return null;
  const response = await request(pathname, options);
  if (options.optional && [401, 403, 404].includes(response.status)) return response;
  if (response.status !== 200) throw new Error(`Could not mirror ${pathname}: HTTP ${response.status}`);
  if (options.image && /(?:text\/html|application\/json)/i.test(response.contentType)) return response;
  if (options.html && !/<html[\s>]/i.test(response.body.toString("utf8", 0, 4096))) {
    throw new Error(`Expected HTML at ${pathname}`);
  }
  let body = response.body;
  if (options.html) body = Buffer.from(patchHtml(body.toString("utf8")));
  else if (pathname.endsWith(".js")) body = Buffer.from(patchJavaScript(body.toString("utf8")));
  const target = options.html ? routeFile(pathname) : localFile(pathname);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, body);
  return { ...response, body, saved: true, target };
}

async function crawlAssets(initialSources) {
  const queue = [];
  const queued = new Set();
  const downloaded = new Set();
  const excluded = new Set();
  const enqueue = (reference, basePath = "/") => {
    const pathname = normalizeReference(reference, basePath);
    if (!pathname) return;
    if (excludedAssetPattern.test(pathname)) {
      excluded.add(pathname);
      return;
    }
    if (!queued.has(pathname)) {
      queued.add(pathname);
      queue.push({ pathname, basePath });
    }
  };
  for (const { source, basePath } of initialSources) {
    for (const reference of referencesIn(source, basePath)) enqueue(reference, basePath);
  }
  while (queue.length) {
    const batch = queue.splice(0, queue.length);
    await mapLimit(batch, CONCURRENCY, async ({ pathname }) => {
      const result = await saveRemote(pathname);
      downloaded.add(pathname);
      if (textPattern.test(pathname) && !pathname.startsWith("/r/")) {
        const source = result.body.toString("utf8");
        for (const reference of referencesIn(source, pathname)) enqueue(reference, pathname);
      }
    });
  }
  return { downloaded: [...downloaded].sort(), excluded: [...excluded].sort() };
}

function landingImageSlugs(mainSource, items) {
  const known = new Set(items.map((item) => item.slug));
  const marker = mainSource.indexOf("/landing/iso/");
  const slugs = new Set();
  if (marker < 0) return [];
  const context = mainSource.slice(Math.max(0, marker - 5000), marker);
  for (const match of context.matchAll(/\[((?:`[a-z0-9-]+`,?)+)\]/g)) {
    for (const slug of match[1].matchAll(/`([a-z0-9-]+)`/g)) {
      if (known.has(slug[1])) slugs.add(slug[1]);
    }
  }
  return [...slugs];
}

async function mirror() {
  await fs.mkdir(SITE, { recursive: true });
  let root;
  try {
    root = await request("/", { accept: "text/html" });
  } catch (error) {
    if (sourceOrigin !== ORIGIN || FALLBACK_SOURCE_ORIGIN === ORIGIN) throw error;
    console.warn(`Primary source unavailable; using ${FALLBACK_SOURCE_ORIGIN}`);
    sourceOrigin = FALLBACK_SOURCE_ORIGIN;
    root = await request("/", { accept: "text/html" });
  }
  if (root.status !== 200) throw new Error(`Could not load ${sourceOrigin}: HTTP ${root.status}`);
  const rootHtml = root.body.toString("utf8");
  const mainAsset = referencesIn(rootHtml, "/").find((pathname) => /\/assets\/index-[^/]+\.js$/.test(pathname));
  if (!mainAsset) throw new Error("Could not find the main JavaScript bundle");
  const main = await saveRemote(mainAsset);
  const mainSource = main.body.toString("utf8");
  const items = discoverItems(mainSource);
  const routes = discoverRoutes(items);
  console.log(`Discovered ${items.length} public items and ${routes.length} routes`);

  const assets = await crawlAssets([
    { source: rootHtml, basePath: "/" },
    { source: mainSource, basePath: mainAsset },
  ]);
  const currentAssets = new Set(assets.downloaded);
  for (const name of await fs.readdir(path.join(SITE, "assets")).catch(() => [])) {
    if (!currentAssets.has(`/assets/${name}`) || excludedAssetPattern.test(`/assets/${name}`)) await fs.unlink(path.join(SITE, "assets", name));
  }
  await mapLimit(publicResources, CONCURRENCY, (pathname) => saveRemote(pathname));

  await mapLimit(routes, CONCURRENCY, async (route) => {
    if (route === "/") {
      const target = routeFile(route);
      await fs.writeFile(target, patchHtml(rootHtml));
      return;
    }
    if (route === "/pricing") {
      const target = routeFile(route);
      await fs.mkdir(path.dirname(target), { recursive: true });
      await fs.writeFile(target, redirectHtml("/components"));
      return;
    }
    await saveRemote(route, { html: true, accept: "text/html" });
  });
  await fs.writeFile(path.join(SITE, "404.html"), patchHtml(rootHtml));
  await fs.writeFile(path.join(SITE, ".nojekyll"), "");

  const imagePaths = new Set();
  for (const item of items) {
    imagePaths.add(`/previews/${item.slug}.webp`);
    if (item.kind === "screens") imagePaths.add(`/previews/dark/${item.slug}.webp`);
  }
  for (const slug of landingImageSlugs(mainSource, items)) {
    imagePaths.add(`/landing/iso/${slug}-light.webp`);
    imagePaths.add(`/landing/iso/${slug}-dark.webp`);
  }
  const images = await mapLimit([...imagePaths], CONCURRENCY, (pathname) => saveRemote(pathname, { optional: true, image: true }));
  const imageCount = images.filter((result) => result?.saved).length;

  const registryCandidates = items.flatMap((item) => item.kind === "components" ? [item.slug, `${item.slug}-clean`] : [item.slug]);
  const registryResults = await mapLimit(registryCandidates, CONCURRENCY, async (name) => {
    const pathname = `/r/${name}.json`;
    const response = await request(pathname, { accept: "application/json" });
    if (response.status !== 200) return { name, status: response.status, mirrored: false };
    try {
      const parsed = JSON.parse(response.body.toString("utf8"));
      if (parsed.name !== name || !Array.isArray(parsed.files)) throw new Error("Unexpected registry payload");
    } catch {
      return { name, status: response.status, mirrored: false };
    }
    const target = localFile(pathname);
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, response.body);
    return { name, status: response.status, mirrored: true };
  });
  const registry = registryResults.filter((result) => result.mirrored).map((result) => result.name).sort();
  const serverBackedRegistry = registryResults.filter((result) => !result.mirrored).map((result) => result.name).sort();
  const aiTagged = items.filter(isAiTaggedItem).map((item) => item.slug).sort();

  const inventory = {
    source: ORIGIN,
    fetchedFrom: sourceOrigin,
    routes,
    items: Object.fromEntries(
      ["components", "screens", "blocks", "illustrations", "motion"].map((kind) => [
        kind,
        items.filter((item) => item.kind === kind).map((item) => ({ slug: item.slug, category: item.category, pro: item.pro })),
      ]),
    ),
    registry: { mirrored: registry, serverBacked: serverBackedRegistry },
    redirects: { "/pricing": "/components", "/pro": "/components" },
    customization: { aiComponentBadgeCount: aiTagged.length, aiComponentBadges: aiTagged },
    excludedRoutes: ["/account", "/api", "/login", "/partner"],
    excludedAssets: assets.excluded,
  };
  await fs.writeFile(path.join(SITE, "routes.json"), `${JSON.stringify(inventory, null, 2)}\n`);
  const report = await checkSite();
  console.log(`Mirrored ${imageCount} dynamic images and ${registry.length} public registry items`);
  console.log(`Applied ${aiTagged.length} AI component badges; excluded ${assets.excluded.length} auth/partner/pricing chunks`);
  console.log(`Kept ${serverBackedRegistry.length} registry items server-backed`);
  console.log(`Integrity OK: ${report.routes} routes, ${report.assets} bundle assets, ${report.files} total site files`);
}

async function libraryRegistrySlugs() {
  const slugs = [];
  for (const kind of ["components", "blocks", "illustrations", "motion"]) {
    const directory = path.join(LIBRARY, kind);
    if (!(await exists(directory))) continue;
    for (const name of await fs.readdir(directory)) {
      if (name.endsWith(".tsx")) slugs.push(name.slice(0, -4));
    }
  }
  return slugs.sort();
}

async function checkSite() {
  const inventoryPath = path.join(SITE, "routes.json");
  if (!(await exists(inventoryPath))) throw new Error("Missing site/routes.json; run npm run mirror first");
  const inventory = JSON.parse(await fs.readFile(inventoryPath, "utf8"));
  const pricingHtml = await fs.readFile(routeFile("/pricing"), "utf8");
  if (!pricingHtml.includes('data-sales-redirect="/components"')) throw new Error("Missing /pricing to /components redirect");
  const inventoryItems = Object.entries(inventory.items).flatMap(([kind, values]) => values.map((item) => ({ ...item, kind })));
  const expectedAiTagged = inventoryItems.filter(isAiTaggedItem).map((item) => item.slug).sort();
  if (inventory.customization?.aiComponentBadgeCount !== expectedAiTagged.length) {
    throw new Error(`AI component badge count mismatch: expected ${expectedAiTagged.length}`);
  }
  const missingRoutes = [];
  for (const route of inventory.routes) {
    const file = routeFile(route);
    if (!(await exists(file))) missingRoutes.push(route);
    else {
      const html = await fs.readFile(file, "utf8");
      if (!html.includes("data-static-mirror-compatibility")) missingRoutes.push(`${route} (compatibility script missing)`);
    }
  }
  if (!(await exists(path.join(SITE, "404.html")))) missingRoutes.push("/404.html");
  if (missingRoutes.length) throw new Error(`Missing route HTML:\n${missingRoutes.join("\n")}`);

  const files = await walk(SITE);
  const missingReferences = new Set();
  for (const file of files) {
    const extension = path.extname(file);
    if (![".html", ".js", ".css", ".json", ".svg", ".webmanifest"].includes(extension)) continue;
    const pathname = `/${path.relative(SITE, file).split(path.sep).join("/")}`;
    if (pathname.startsWith("/r/") || pathname === "/routes.json" || /llms.*\.txt$/.test(pathname)) continue;
    const source = await fs.readFile(file, "utf8");
    for (const reference of referencesIn(source, pathname)) {
      if (excludedAssetPattern.test(reference)) continue;
      if (!(await exists(localFile(reference)))) missingReferences.add(`${pathname} -> ${reference}`);
    }
    if (extension === ".js" && (source.includes("/_vercel/insights/script.js") || source.includes("va.vercel-scripts.com") || source.includes("googletagmanager.com") || source.includes("connect.facebook.net") || source.includes("className:`consent`"))) {
      throw new Error(`Analytics or consent UI is still enabled in ${pathname}`);
    }
    if (extension === ".js" && source.includes("fetch(`/api/checkout`")) {
      throw new Error(`Local checkout endpoint remains in ${pathname}`);
    }
    if (extension === ".js" && ["Part of Pro – get Pro to copy", "Get Pro to copy the code", "Like it? ${e} more components are in Pro.", "The code is part of Pro", "Get Pro to install"].some((text) => source.includes(text))) {
      throw new Error(`Old Pro sales copy remains in ${pathname}`);
    }
    if (excludedAssetPattern.test(pathname)) throw new Error(`Excluded credential/account/pricing asset was mirrored: ${pathname}`);
  }
  if (missingReferences.size) throw new Error(`Missing local assets:\n${[...missingReferences].join("\n")}`);

  const rootHtml = await fs.readFile(path.join(SITE, "index.html"), "utf8");
  const mainAsset = referencesIn(rootHtml, "/").find((pathname) => /\/assets\/index-[^/]+\.js$/.test(pathname));
  const mainSource = mainAsset ? await fs.readFile(localFile(mainAsset), "utf8") : "";
  if (!mainSource.includes("children:`AI component`") || !mainSource.includes("is not included in this static mirror")) {
    throw new Error("Main bundle customization is incomplete");
  }

  const missingRegistry = [];
  for (const slug of await libraryRegistrySlugs()) {
    if (!(await exists(path.join(SITE, "r", `${slug}.json`)))) missingRegistry.push(slug);
  }
  for (const slug of inventory.registry.mirrored) {
    const file = path.join(SITE, "r", `${slug}.json`);
    if (!(await exists(file))) missingRegistry.push(slug);
    else JSON.parse(await fs.readFile(file, "utf8"));
  }
  if (missingRegistry.length) throw new Error(`Missing free registry JSON: ${[...new Set(missingRegistry)].join(", ")}`);
  return {
    routes: inventory.routes.length,
    assets: (await walk(path.join(SITE, "assets"))).length,
    files: files.length,
    registry: inventory.registry.mirrored.length,
    aiComponentBadges: inventory.customization.aiComponentBadgeCount,
  };
}

async function serve() {
  await checkSite();
  const server = createServer(async (request, response) => {
    try {
      if (!['GET', 'HEAD'].includes(request.method)) {
        response.writeHead(405, { allow: "GET, HEAD" });
        response.end();
        return;
      }
      const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
      let file = localFile(pathname);
      let stat = await fs.stat(file).catch(() => null);
      if (stat?.isDirectory()) {
        file = path.join(file, "index.html");
        stat = await fs.stat(file).catch(() => null);
      }
      if (!stat?.isFile() && !path.extname(pathname)) {
        file = routeFile(pathname.replace(/\/$/, "") || "/");
        stat = await fs.stat(file).catch(() => null);
      }
      const notFound = !stat?.isFile();
      if (notFound) file = path.join(SITE, "404.html");
      const contentType = mimeTypes[path.extname(file).toLowerCase()] || "application/octet-stream";
      response.writeHead(notFound ? 404 : 200, {
        "content-type": contentType,
        "content-length": (await fs.stat(file)).size,
        "cache-control": "no-store",
        "x-content-type-options": "nosniff",
      });
      if (request.method === "HEAD") response.end();
      else createReadStream(file).pipe(response);
    } catch {
      response.writeHead(400, { "content-type": "text/plain; charset=utf-8" });
      response.end("Bad request");
    }
  });
  server.on("error", (error) => {
    console.error(error);
    process.exitCode = 1;
  });
  server.listen(port, "127.0.0.1", () => console.log(`Preview: http://127.0.0.1:${port}`));
  for (const signal of ["SIGINT", "SIGTERM"]) {
    process.once(signal, () => server.close(() => process.exit(0)));
  }
}

if (args.has("--serve")) await serve();
else if (args.has("--check")) {
  const report = await checkSite();
  console.log(`Integrity OK: ${report.routes} routes, ${report.assets} bundle assets, ${report.registry} registry items, ${report.files} total site files`);
} else await mirror();
