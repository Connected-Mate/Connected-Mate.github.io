#!/usr/bin/env node
// Standalone preview of A-Team components, for building and testing them one by one.
// Bundles components/ateam/<slug>.demo.tsx with React 19 into validation/ateam/<slug>/,
// with a page that switches theme by URL: index.html (light) or index.html?dark=1.
//
// Usage: node scripts/ateam_preview.mjs <slug> [<slug> ...]
// Then serve validation/ateam on a port of your own and open /<slug>/.

import { build } from "esbuild";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const slugs = process.argv.slice(2);
if (!slugs.length) {
  console.error("usage: node scripts/ateam_preview.mjs <slug> [...]");
  process.exit(1);
}

const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>A-Team preview</title>
<style>
  html { color-scheme: light; }
  html.dark { color-scheme: dark; }
  body { margin: 0; min-height: 100vh; display: grid; place-items: center; padding: 48px 16px; box-sizing: border-box;
         background: #fafafa; font-family: "Avenir Next", Avenir, system-ui, sans-serif; }
  html.dark body { background: #0b0b0c; }
  #root { width: 100%; display: grid; place-items: center; }
  #err { color: #b00020; white-space: pre-wrap; }
</style>
<script>if (new URLSearchParams(location.search).get("dark") === "1") document.documentElement.classList.add("dark");</script>
</head>
<body><div id="root"></div><script src="app.js"></script></body>
</html>
`;

for (const slug of slugs) {
  const out = path.join(root, "validation", "ateam", slug);
  await mkdir(out, { recursive: true });
  const entry = `import { createRoot } from "react-dom/client";
import { Component } from "react";
import Demo from ${JSON.stringify(path.join(root, "components", "ateam", `${slug}.demo.tsx`))};
class Boundary extends Component<{ children: any }, { error?: string }> {
  state: { error?: string } = {};
  static getDerivedStateFromError(e: unknown) { return { error: String((e as Error)?.stack ?? e) }; }
  render() { return this.state.error ? <pre id="err">{this.state.error}</pre> : this.props.children; }
}
createRoot(document.getElementById("root")!).render(<Boundary><Demo /></Boundary>);
`;
  await build({
    stdin: { contents: entry, loader: "tsx", resolveDir: root, sourcefile: "entry.tsx" },
    bundle: true,
    outfile: path.join(out, "app.js"),
    jsx: "automatic",
    target: "es2022",
    define: { "process.env.NODE_ENV": '"development"' },
    nodePaths: [path.join(root, "node_modules")],
    logLevel: "error",
  });
  await writeFile(path.join(out, "index.html"), page);
  console.log(`built validation/ateam/${slug}/`);
}
