# A-Team components — design and code contract

These components are written by us, from scratch, in the A-Team design system of the IA
Innovation team: the Vibe Creators hub "Osmose" (sign-in page, account pages, e-mails).
Each one is a single self-contained file that people copy from the site's Code tab.

## Files, per component `<slug>`

- `<slug>.tsx` — the component people copy. `"use client";` first line, imports only from
  `react`, no other dependency, no `react-dom` (no portals). Exported named component(s) plus
  their prop types. Styles live in the same file in `const css = /* css */ \`...\`;`, rendered
  with React 19's `<style href="ui-<slug>" precedence="default">{css}</style>`.
- `<slug>.demo.tsx` — `export default function Demo()` that renders the component with
  realistic sample data and, when the component is about time or streaming, drives it so the
  preview shows the full behaviour (stream, timers, state changes). It imports `./<slug>`.

## Clean-room rule (non-negotiable)

Never open, read, grep or copy the affectUI implementation files for a Pro item:
`site/assets/demo-*`, `demo.clean-*`, `component-*`, `component.clean-*`, `ateam-*` of other
people, or any CSS of them. Work from what is visible (screenshots, the live preview in a
browser, its animations and interactions) and from the item's documentation text
(`site/assets/docs-*.js`, `docs.clean-*.js`: description, props, usage, keyboard, accessibility,
motion). Keep the documented prop names and behaviour so the page's docs stay true. Write every
line yourself.

## Tokens

Class prefix `ui-<short>` (e.g. `ui-at-answer`), BEM elements `__x`, modifiers via data attributes.
Declare every colour as a custom property on the root class, light first, then dark under
`:where(.dark, [data-theme="dark"]) .ui-...` — never hard-code a colour in a rule.

| Role | Light | Dark |
|---|---|---|
| frame (matte tray) | `#f2f6fa` | `#0f2747` |
| panel / card | `#ffffff` | `#16345c` |
| soft fill | `rgba(26, 62, 112, 0.06)` | `rgba(255, 255, 255, 0.07)` |
| hairline | `#dae2ec` | `rgba(255, 255, 255, 0.12)` |
| firm hairline (fields, buttons) | `#cbd6e4` | `rgba(255, 255, 255, 0.18)` |
| ink | `#00162b` | `rgba(255, 255, 255, 0.94)` |
| text | `rgba(0, 22, 43, 0.66)` | `rgba(255, 255, 255, 0.72)` |
| muted | `rgba(0, 22, 43, 0.54)` | `rgba(255, 255, 255, 0.56)` |
| berry (main action, brand rail) | `#851437`, hover `#6d0f2d` | `#a8204d`, hover `#bd2a5a` |
| info (selection, links, focus) | ink `#1a3e70`, fill `#eef5ff`, line `#c1daff`, ring `#8fbdf2` | ink `#c1daff`, fill `rgba(143,189,242,.16)`, ring `rgba(143,189,242,.6)` |
| success | ink `#1d6a34`, fill `#eafbee`, line `#c9f5cf` | ink `#7fe0a0`, fill `rgba(127,224,160,.14)` |
| waiting | ink `#775810`, fill `#fdf6dd`, line `#fae6a0` | ink `#f3d27a`, fill `rgba(243,210,122,.14)` |
| refusal / danger | ink `#8a3a22`, fill `#fdeee8`, line `#f5d5c9` | ink `#f2a48c`, fill `rgba(242,164,140,.14)` |

Shadows are navy-tinted, never grey: drop `0 8px 16px -8px rgba(26,62,112,.2)`, raised
`0 18px 30px -16px rgba(26,62,112,.38), 0 4px 10px -6px rgba(26,62,112,.18)`, floating
`0 24px 48px -24px rgba(26,62,112,.3)`. Dark: `rgba(3,12,28,.6–.8)`.

## Material (the six hub rules)

1. Every object is a light surface on a tinted ground. Nothing is flat.
2. Object = surface + 1px hairline + negative-spread navy shadow — always the three.
3. Important objects are DOUBLE: a matte frame (`#f2f6fa`, its own hairline, 6px padding,
   radius 22px) holds a raised panel (white, hairline, radius 16px); the footer lives in the
   frame, under the panel.
4. Icon tiles are pebbles: white, hairline, light from below
   (`inset 0 -2px 6px -4px rgba(26,62,112,.4)`).
5. One motion cadence: 150 ms, ease-out `cubic-bezier(.16, 1, .3, 1)`; state fades 300 ms.
   Respect `prefers-reduced-motion` (no movement, colour changes only).
6. States are a family: fill + hairline + ink, never a fill alone.

## Type and controls

- Typeface `"Avenir Next", Avenir, system-ui, sans-serif`; titles `"Avenir Next Condensed"`
  bold, sentence case, a size above the body; small labels 10.5px uppercase, `0.09em` tracking.
- Main action: flat berry block, white label, radius 10px, `inset 0 1px 0 rgba(255,255,255,.16),
  0 6px 12px -6px rgba(133,20,55,.6)`. Secondary: pale panel `#fbfcfe`, firm hairline, short
  navy drop, weight 600. Ghost: text only, soft fill on hover.
- Fields: 10px radius, firm hairline, soft inner shade, berry caret, focus = info ring 3px.
- Ticked boxes, switches on, progress fills: berry.
- Keys (`kbd`): white pebble, hairline, 1px firmer bottom.
- Selected rows: info fill with a 2px berry marker on the left.

## Quality bar

Production-ready: keyboard and screen-reader support (roles, labels, focus-visible),
light and dark, 320px wide without overflow, long text, empty and error states where the
component has them, no console errors, no layout shift on mount, timers cleaned up on unmount.
