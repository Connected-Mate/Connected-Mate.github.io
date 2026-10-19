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
const CONCURRENCY = 8;
const args = new Set(process.argv.slice(2));
const portFlag = process.argv.indexOf("--port");
const port = Number(portFlag >= 0 ? process.argv[portFlag + 1] : process.env.PORT || 4173);
const assetPattern = /\.(?:avif|css|gif|ico|jpe?g|js|json|png|svg|ttf|webmanifest|webp|woff2?)$/i;
const textPattern = /\.(?:css|js|json|svg|webmanifest)$/i;
const excludedAssetPattern = /\/(?:LoginPage|AccountPage|PartnerPage)-[^/]+\.(?:css|js)$/i;
const excludedRoutePattern = /^\/(?:account|api|login|partner)(?:\/|$)/;
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
  const url = new URL(pathname, `${ORIGIN}/`);
  if (url.origin !== ORIGIN) throw new Error(`Refusing cross-origin fetch: ${url}`);
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
  if (serverOnly.test(window.location.pathname)) {
    window.location.replace(origin + window.location.pathname + window.location.search + window.location.hash);
    return;
  }
  document.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = event.target?.closest?.("a[href]");
    if (!anchor) return;
    const target = new URL(anchor.getAttribute("href"), window.location.href);
    if (target.origin === window.location.origin && serverOnly.test(target.pathname)) {
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
  return output;
}

function normalizeReference(reference, basePath = "/") {
  const value = reference.trim();
  if (!value || /^(?:data|blob|mailto|tel|javascript):/i.test(value) || value.includes("${") || value.includes("{name}")) return null;
  let url;
  try {
    url = value.startsWith("assets/") ? new URL(`/${value}`, `${ORIGIN}/`) : new URL(value, `${ORIGIN}${basePath}`);
  } catch {
    return null;
  }
  if (url.origin !== ORIGIN || excludedRoutePattern.test(url.pathname) || !assetPattern.test(url.pathname)) return null;
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

function discoverItems(mainSource) {
  const items = [];
  const seen = new Set();
  const add = (kind, slug) => {
    const key = `${kind}/${slug}`;
    if (seen.has(key)) return;
    seen.add(key);
    const entry = mainSource.indexOf(`slug:\`${slug}\``);
    if (entry < 0) throw new Error(`Could not discover metadata for ${key}`);
    const category = mainSource.slice(entry, entry + 1600).match(/category:`([^`]+)`/)?.[1];
    if (!category) throw new Error(`Could not discover category for ${key}`);
    items.push({ kind, slug, category });
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
  const root = await request("/", { accept: "text/html" });
  if (root.status !== 200) throw new Error(`Could not load ${ORIGIN}: HTTP ${root.status}`);
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
  await mapLimit(publicResources, CONCURRENCY, (pathname) => saveRemote(pathname));

  await mapLimit(routes, CONCURRENCY, async (route) => {
    if (route === "/") {
      const target = routeFile(route);
      await fs.writeFile(target, patchHtml(rootHtml));
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

  const inventory = {
    source: ORIGIN,
    routes,
    items: Object.fromEntries(
      ["components", "screens", "blocks", "illustrations", "motion"].map((kind) => [
        kind,
        items.filter((item) => item.kind === kind).map((item) => ({ slug: item.slug, category: item.category })),
      ]),
    ),
    registry: { mirrored: registry, serverBacked: serverBackedRegistry },
    excludedRoutes: ["/account", "/api", "/login", "/partner"],
    excludedAssets: assets.excluded,
  };
  await fs.writeFile(path.join(SITE, "routes.json"), `${JSON.stringify(inventory, null, 2)}\n`);
  const report = await checkSite();
  console.log(`Mirrored ${imageCount} dynamic images and ${registry.length} public registry items`);
  console.log(`Kept ${serverBackedRegistry.length} registry items server-backed; excluded ${assets.excluded.length} auth/partner chunks`);
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
    if (extension === ".js" && (source.includes("/_vercel/insights/script.js") || source.includes("va.vercel-scripts.com"))) {
      throw new Error(`Vercel analytics is still enabled in ${pathname}`);
    }
    if (extension === ".js" && source.includes("fetch(`/api/checkout`")) {
      throw new Error(`Local checkout endpoint remains in ${pathname}`);
    }
    if (excludedAssetPattern.test(pathname)) throw new Error(`Excluded credential/account asset was mirrored: ${pathname}`);
  }
  if (missingReferences.size) throw new Error(`Missing local assets:\n${[...missingReferences].join("\n")}`);

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
