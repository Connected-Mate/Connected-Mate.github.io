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

function compatibilityScript() {
  const origin = JSON.stringify(ORIGIN);
  return `<script data-static-mirror-compatibility>
(() => {
  const origin = ${origin};
  const serverOnly = /^\\/(?:login|account|partner)(?:\\/|$)/;
  const salesOnly = /^\\/(?:pricing|pro)(?:\\/|$)/;
  const libraryPath = (value) => {
    const target = new URL(value, window.location.href);
    return target.origin === window.location.origin && salesOnly.test(target.pathname)
      ? "/components" + target.search + target.hash
      : value;
  };
  if (salesOnly.test(window.location.pathname)) {
    window.location.replace("/components" + window.location.search + window.location.hash);
    return;
  }
  if (serverOnly.test(window.location.pathname)) {
    window.location.replace(origin + window.location.pathname + window.location.search + window.location.hash);
    return;
  }
  for (const method of ["pushState", "replaceState"]) {
    const original = window.history[method].bind(window.history);
    window.history[method] = (state, title, url) => original(state, title, url == null ? url : libraryPath(url));
  }
  const removeSalesLayer = () => {
    document.querySelectorAll(".offer-banner, .consent").forEach((element) => element.remove());
    document.querySelectorAll("a[href]").forEach((anchor) => {
      const target = new URL(anchor.getAttribute("href"), window.location.href);
      if (target.origin === window.location.origin && salesOnly.test(target.pathname)) anchor.remove();
    });
    document.querySelectorAll("button").forEach((button) => {
      const label = button.textContent.trim().replace(/\s+/g, " ");
      if (/^(?:Get Pro|Unlock (?:with )?Pro|See Pro|Get lifetime access|Cookie settings)$/i.test(label)) button.remove();
    });
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
    if (salesOnly.test(target.pathname)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      window.location.assign("/components" + target.search + target.hash);
    } else if (serverOnly.test(target.pathname)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      window.location.assign(origin + target.pathname + target.search + target.hash);
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
