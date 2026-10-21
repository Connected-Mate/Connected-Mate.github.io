# affectUI static mirror

A local, reproducible mirror of the public [affectUI](https://www.affectui.com/) website, prepared for deployment as a root GitHub Pages user site. The original visual design, client-side React routes, interactive demos, and public assets are preserved.

The original MIT-licensed source library is included under [`library/`](library/) with its own license, README, contribution guide, components, blocks, illustrations, motion effects, and documentation assets.

## Attribution and license

- Website and library: [affectUI](https://www.affectui.com/) by Florian Höller / adfects.
- Original source library: [flohoeller/affectui](https://github.com/flohoeller/affectui), MIT licensed.
- The original license is retained at [`library/LICENSE`](library/LICENSE) and reproduced at the repository root as [`LICENSE`](LICENSE).

This copy was made with the founder's authorization. No authentication, locked Pro source, or private endpoint was accessed to create it.

## Team IA art direction

The site itself stays exactly as the original. Only the **components** wear the A-Team design system of the IA Innovation team — the Vibe Creators hub "Osmose" (sign-in page, account pages, e-mails) — in both of their styles (Classic and Clean) and both themes.

`scripts/theme_team_ia.py` repaints the component modules, the registry items and the component pictures (never the site's own pages, header or typeface), then runs `scripts/theme/composants.py`, which reads every component's own CSS and writes `/ateam/composants.css`:

- every component palette re-pointed at the hub tokens, light and dark paired (a token whose name is shared but whose job differs is left alone);
- each role in its hub shape: frame and raised panel (double object), flat berry main action, condensed bold titles, field shell with a berry caret, state chips with their family hairline, card feet in the frame, keys as pebbles, berry progress rail and ticked boxes.

The free components' **copyable code** (Code tab, Copy button, `/r/*.json` registry) carries the same rules at the end of its own `css` block, so a copied component looks the same in another app. Data Table, Comments Panel, Integration Settings and Setup Guide (Classic style) get their source back from the last MIT release of affectUI (`scripts/theme/mit/`, licence included). The 33 other items were never published with source. We rewrote them ourselves, from scratch and in the A-Team design system, in `components/ateam/` (`<slug>.tsx` is the copyable component, `<slug>.demo.tsx` the preview; contract and tokens in `components/ateam/DESIGN.md`). `npm run ateam` (also run by `npm run theme`) bundles each preview against the site's own React and points the item's preview and Code/Copy, in both styles, at our version. `npm run ateam:preview <slug>` builds a standalone test page in `validation/ateam/`.

```sh
npm run mirror   # refresh the original copy
npm run theme    # dress the components (needs Python 3 with numpy and Pillow); runs once per mirror
npm run check
```

After changing `composants.py` alone: `python3 scripts/theme/composants.py site && cp scripts/theme/composants.css site/ateam/`.

## Rebuild the mirror

Requirements: Node.js 20 or newer. There are no npm dependencies and no browser automation dependency.

```sh
npm run mirror
```

The command uses the public `https://www.affectui.com` site, with the public `https://affectui.vercel.app` deployment as an automatic read-only fallback if the custom domain is unavailable. It downloads:

- every discovered public route into `site/<route>/index.html`;
- JavaScript modules, CSS, fonts, images, icons, the web manifest, public text resources, and unauthenticated `/r/*.json` registry items;
- nested route files and `site/404.html` for static hosting;
- `site/routes.json`, the complete route, item, registry, customization, redirect, and exclusion inventory.

The crawl excludes `/account`, `/api`, `/login`, and `/partner`, including the lazy-loaded login, account, partner, and pricing-page bundles. Pro registry responses that require authentication remain server-backed and are not fetched with credentials.

To verify an existing mirror without accessing the network:

```sh
npm run check
```

The integrity pass checks every inventoried route, statically referenced local assets, free library registry JSON, analytics removal, checkout externalization, and excluded credential/account bundles.

## Local preview

```sh
npm run preview
```

Open <http://127.0.0.1:4173/components/progress-tracker>. Use `-- --port 5000` to choose another port. The preview command runs the same integrity checks before serving `site/`.

## GitHub Pages

[`.github/workflows/pages.yml`](.github/workflows/pages.yml) deploys only `site/` through the official GitHub Pages actions when `main` is pushed or the workflow is run manually. `site/.nojekyll` disables Jekyll processing. This workflow is configuration only; mirroring does not create a repository, commit, push, enable Pages, or publish anything.

## Mirror customizations

- The Pro sales layer is removed from the mirrored UI: offer banners, pricing links, Get Pro actions, promotional modals, upsells, and Pro copy toasts are not rendered.
- `/pricing` and `/pro` redirect to `/components`; the pricing application chunk is not mirrored.
- Locked items keep their public previews and documentation, but their source panels say that source is not included in this static mirror.
- Former Pro badges are replaced with the exact text `AI component` only for AI-related components: the Agents and Chat categories, plus `email-draft`, `prompt-library`, and `smart-recommendation`. Other former Pro badges disappear. Existing New and 2-styles badges are unchanged.

## Compatibility and server-backed limitations

- Login and account links redirect to `https://www.affectui.com`; no credential form is reproduced.
- Checkout and payment UI are not mirrored. No payment endpoint runs locally.
- Original Vercel, Google, and Meta analytics network loading is disabled; the cookie-consent banner is not rendered.
- Demo API-key-shaped sample strings are masked before publication.
- Free public registry JSON is mirrored. Pro source and Pro registry items still require the original authenticated service and are not exposed here.
- Features dependent on live server data—accounts, downloads, team management, dynamic offers, GitHub star counts, contact delivery, and authenticated Pro source—are not provided by the static copy. Their original public UI remains only where it is not part of the removed sales layer.
- The mirror is static React hosting, not a replacement for affectUI's backend. External services and original absolute links continue to refer to their original providers.
