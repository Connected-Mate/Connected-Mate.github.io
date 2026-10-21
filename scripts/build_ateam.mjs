#!/usr/bin/env node
// Plug the A-Team components (components/ateam/<slug>.tsx) into the mirror.
//
// For every slug that has both <slug>.tsx (the component people copy) and
// <slug>.demo.tsx (the preview), this:
//   1. bundles the demo into site/assets/ateam-<slug>-<hash>.js, sharing the site's own
//      React (the hashed react and jsx-runtime chunks) so hooks run in one React tree;
//   2. writes the component source as a string module, site/assets/ateam-src-<slug>-<hash>.js;
//   3. points the item's Classic and Clean Preview and loadSource at those files and
//      marks it free, in site/assets/index-*.js.
// Idempotent: rerunning replaces the previous ateam files of a slug.
//
// Usage: node scripts/build_ateam.mjs [site-dir] [slug ...]

import { build } from "esbuild";
import { createHash } from "node:crypto";
import { mkdir, mkdtemp, readdir, readFile, rm, unlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const site = path.resolve(process.argv[2] ?? path.join(root, "site"));
const only = new Set(process.argv.slice(3));
const sources = path.join(root, "components", "ateam");
const assets = path.join(site, "assets");

const HOOKS = [
  "Children", "Component", "Fragment", "StrictMode", "cloneElement", "createContext", "createElement",
  "createRef", "forwardRef", "isValidElement", "lazy", "memo", "startTransition", "Suspense",
  "use", "useCallback", "useContext", "useDebugValue", "useDeferredValue", "useEffect", "useId",
  "useImperativeHandle", "useInsertionEffect", "useLayoutEffect", "useMemo", "useOptimistic",
  "useReducer", "useRef", "useState", "useSyncExternalStore", "useTransition",
];

const hash = (text) => createHash("sha256").update(text).digest("base64url").slice(0, 8);

async function main() {
  const files = await readdir(assets);
  const reactChunk = files.find((f) => /^react-[\w-]+\.js$/.test(f));
  const jsxChunk = files.find((f) => /^jsx-runtime-[\w-]+\.js$/.test(f));
  const indexFile = files.find((f) => /^index-[\w-]+\.js$/.test(f));
  if (!reactChunk || !jsxChunk || !indexFile) throw new Error("site/assets lacks the react, jsx-runtime or index chunk");

  const slugs = (await readdir(sources))
    .filter((f) => f.endsWith(".demo.tsx"))
    .map((f) => f.slice(0, -".demo.tsx".length))
    .filter((slug) => !only.size || only.has(slug));

  // The site's chunks export a lazy getter `t` that returns the CommonJS module.
  const shims = await mkdtemp(path.join(tmpdir(), "ateam-shim-"));
  await writeFile(
    path.join(shims, "react.js"),
    `import { t } from "./${reactChunk}";\nconst React = t();\nexport default React;\n` +
      `export const { ${HOOKS.join(", ")} } = React;\n`,
  );
  await writeFile(
    path.join(shims, "jsx-runtime.js"),
    `import { t } from "./${jsxChunk}";\nconst J = t();\nexport const { jsx, jsxs, Fragment } = J;\n`,
  );
  const external = [`./${reactChunk}`, `./${jsxChunk}`];

  let index = await readFile(path.join(assets, indexFile), "utf8");
  // New items of our own (not in the original library), declared in components/ateam/items.json:
  // each is cloned from a base item's registry entry and gets its own route, docs and preview.
  const items = JSON.parse(await readFile(path.join(sources, "items.json"), "utf8").catch(() => "[]"));
  const isNew = new Map(items.map((item) => [item.slug, item]));
  for (const item of items) index = await addItem(index, item, files);
  const built = [];
  for (const slug of slugs) {
    const component = await readFile(path.join(sources, `${slug}.tsx`), "utf8");
    const result = await build({
      entryPoints: [path.join(sources, `${slug}.demo.tsx`)],
      bundle: true,
      write: false,
      format: "esm",
      jsx: "automatic",
      target: "es2022",
      minify: true,
      legalComments: "none",
      alias: { react: path.join(shims, "react.js"), "react/jsx-runtime": path.join(shims, "jsx-runtime.js") },
      external,
      logLevel: "error",
    });
    const demo = result.outputFiles[0].text;
    const sourceModule = "var e=`" + component.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${") + "`;export{e as default};\n";

    // Exact names only: "agent-tree" must not sweep "agent-tree-scale"'s files
    const ours = (kind, f) => f.length === `ateam-${kind}${slug}-`.length + 11 && f.startsWith(`ateam-${kind}${slug}-`);
    for (const f of (await readdir(assets)).filter((f) => ours("", f) || ours("src-", f))) {
      await unlink(path.join(assets, f));
    }
    const demoName = `ateam-${slug}-${hash(demo)}.js`;
    const srcName = `ateam-src-${slug}-${hash(sourceModule)}.js`;
    // The original items keep their own preview (the porteur's choice, 21/10); our new items use ours.
    if (isNew.has(slug)) await writeFile(path.join(assets, demoName), demo);
    await writeFile(path.join(assets, srcName), sourceModule);

    const start = index.indexOf("slug:`" + slug + "`");
    if (start < 0) throw new Error(`${slug}: not in the site index`);
    const end = index.indexOf("},", index.indexOf("clean:{", start)) + 2;
    const tail = index.indexOf("pro:!", end);
    let entry = index.slice(start, tail + 6);
    // The preview stays the original one (the porteur's choice, 21/10): only the code is ours.
    if (isNew.has(slug)) {
      entry = entry.replace(/import\(`\.\/(?:demo|demo\.clean|ateam-(?!src-|docs-)[\w-]+?)-[\w-]+\.js`\)/g, `import(\`./${demoName}\`)`);
    }
    entry = entry
      .replace(/import\(`\.\/(?:component|component\.clean|ateam-src-[\w-]+)-[\w-]+\.js`\)/g, `import(\`./${srcName}\`)`)
      .replace(/pro:!0$/, "pro:!1");
    index = index.slice(0, start) + entry + index.slice(tail + 6);
    built.push(slug);
  }
  await writeFile(path.join(assets, indexFile), index);
  await rm(shims, { recursive: true, force: true });
  console.log(`A-Team components plugged in: ${built.length ? built.join(", ") : "none"}`);
}

/** Clone a base item's registry entry for a new item; also writes its docs module, route and inventory. */
async function addItem(index, item, files) {
  const { slug, base, name, description, category, docs } = item;
  const docsBody = "var e=" + JSON.stringify(docs ?? {}) + ";export{e as docs};\n";
  const docsName = `ateam-docs-${slug}-${hash(docsBody)}.js`;
  for (const f of (await readdir(assets)).filter((f) => f.length === `ateam-docs-${slug}-`.length + 11 && f.startsWith(`ateam-docs-${slug}-`))) {
    await unlink(path.join(assets, f));
  }
  await writeFile(path.join(assets, docsName), docsBody);

  if (!index.includes("slug:`" + slug + "`")) {
    const head = new RegExp("([\\w$]+)=e\\(\\{entry:\\(\\)=>([\\w$]+)\\}\\),\\2=\\{slug:`" + base + "`");
    const m = head.exec(index);
    if (!m) throw new Error(`${slug}: base ${base} not found in the site index`);
    const objStart = m.index + m[0].indexOf("{slug:");
    const objEnd = index.indexOf("pro:!", index.indexOf("},", index.indexOf("clean:{", objStart))) + 7;
    const id = slug.replace(/[^a-z0-9]/gi, "_");
    const tick = (s) => s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
    let obj = index.slice(objStart, objEnd)
      .replace("slug:`" + base + "`", "slug:`" + slug + "`")
      .replace(/name:`[^`]*`/, "name:`" + tick(name) + "`")
      .replace(/description:`[^`]*`/, "description:`" + tick(description) + "`")
      .replace(/category:`[^`]*`/, "category:`" + tick(category) + "`")
      .replace(/added:`[^`]*`/, "added:`" + new Date().toISOString().replace(/\.\d+Z$/, "+00:00") + "`");
    const decl = `,$m_${id}=e({entry:()=>$e_${id}}),$e_${id}=${obj}`;
    index = index.slice(0, objEnd) + decl + index.slice(objEnd);
    const reg = `"./${base}/index.ts":${m[1]},`;
    if (!index.includes(reg)) throw new Error(`${slug}: registry line of ${base} not found`);
    index = index.replace(reg, reg + `"./${slug}/index.ts":$m_${id},`);
  }
  // Point the entry's docs at ours (both styles)
  const s = index.indexOf("slug:`" + slug + "`");
  const e2 = index.indexOf("pro:!", index.indexOf("},", index.indexOf("clean:{", s))) + 6;
  const entry = index.slice(s, e2).replace(/import\(`\.\/(?:docs|docs\.clean|ateam-docs-[\w-]+?)-[\w-]+\.js`\)/g, `import(\`./${docsName}\`)`);
  index = index.slice(0, s) + entry + index.slice(e2);

  // Route page, from the base item's page
  const baseHtml = await readFile(path.join(site, "components", base, "index.html"), "utf8");
  const baseName = (/<title>([^<·|]+)/.exec(baseHtml)?.[1] ?? base).trim();
  const html = baseHtml
    .split(`/components/${base}"`).join(`/components/${slug}"`)
    .split(`/components/${base}/`).join(`/components/${slug}/`)
    .split(baseName).join(name);
  await mkdir(path.join(site, "components", slug), { recursive: true });
  await writeFile(path.join(site, "components", slug, "index.html"), html);

  // Inventory
  const routesFile = path.join(site, "routes.json");
  const routes = JSON.parse(await readFile(routesFile, "utf8"));
  if (!routes.routes.includes(`/components/${slug}`)) {
    routes.routes.push(`/components/${slug}`);
    routes.routes.sort();
  }
  const list = routes.items?.components;
  if (Array.isArray(list) && !list.some((x) => x.slug === slug)) list.push({ slug, category, pro: false });
  await writeFile(routesFile, JSON.stringify(routes, null, 2) + "\n");
  return index;
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
