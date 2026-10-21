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
import { mkdtemp, readdir, readFile, rm, unlink, writeFile } from "node:fs/promises";
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

    for (const f of files.filter((f) => f.startsWith(`ateam-${slug}-`) || f.startsWith(`ateam-src-${slug}-`))) {
      await unlink(path.join(assets, f));
    }
    const demoName = `ateam-${slug}-${hash(demo)}.js`;
    const srcName = `ateam-src-${slug}-${hash(sourceModule)}.js`;
    void demoName; // the demo is still compiled (it must build) but the site keeps its own preview
    await writeFile(path.join(assets, srcName), sourceModule);

    const start = index.indexOf("slug:`" + slug + "`");
    if (start < 0) throw new Error(`${slug}: not in the site index`);
    const end = index.indexOf("},", index.indexOf("clean:{", start)) + 2;
    const tail = index.indexOf("pro:!", end);
    let entry = index.slice(start, tail + 6);
    // The preview stays the original one (the porteur's choice, 21/10): only the code is ours.
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

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
