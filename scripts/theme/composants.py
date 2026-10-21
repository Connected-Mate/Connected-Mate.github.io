#!/usr/bin/env python3
"""Generate scripts/theme/composants.css: the A-Team Osmose material for the components themselves.

Two layers, both read from the components' own built CSS (site/assets: the template strings of
the "clean" style, *.clean-*.js, and the "classic" style, demo-* and component-*), so nothing is guessed:

1. Palette. Every component declares its colours as custom properties on its root
   (`.ui-ansc{--ui-ansc-card:…}`), light first, then dark under
   `:where(.dark, [data-theme="dark"])`. Each known token is re-pointed at the hub value.
   Unknown tokens (chart series, brand colours…) are left alone.
2. Shape. The hub is not only a palette: objects are rounder and framed, the main action
   is a flat berry block, titles are condensed, state chips carry their family hairline,
   icon tiles are pebbles lit from below. Those rules target the selectors that play each
   role, found by what they declare (a card is what paints `--…-card` with a 10px radius).

Usage: python3 scripts/theme/composants.py site
"""
import json
import pathlib
import re
import sys

DARK_WHERE = ':where(.dark, [data-theme="dark"])'
DARK = ':is(.dark, [data-theme="dark"])'

# Light: the hub "Osmose" — objects on #eaeff6, navy-tinted shadows, berry for action,
# the info family (navy ink on pale blue) for selection and links.
LIGHT_TOKENS = {
    "card": "#ffffff",
    "bg": "#ffffff",
    "soft": "#f7f9fc",
    "tray": "#f2f6fa",
    "surface": "#ffffff",
    "tile": "#f2f6fa",
    "title": "#00162b",
    "ink": "#00162b",
    "strong": "#00162b",
    "text": "rgba(0, 22, 43, 0.66)",
    "muted": "rgba(0, 22, 43, 0.56)",
    "faint": "rgba(0, 22, 43, 0.36)",
    "icon": "rgba(0, 22, 43, 0.52)",
    "line": "#dae2ec",
    "hairline": "#dae2ec",
    "line-strong": "#cbd6e4",
    "fill": "rgba(26, 62, 112, 0.06)",
    "fill-strong": "rgba(26, 62, 112, 0.1)",
    "hover": "rgba(26, 62, 112, 0.06)",
    "wash": "rgba(26, 62, 112, 0.035)",
    "wash-soft": "rgba(26, 62, 112, 0.02)",
    "track": "rgba(26, 62, 112, 0.1)",
    "accent": "#1a3e70",
    "accent-bg": "#eef5ff",
    "accent-soft": "#eef5ff",
    "accent-wash": "#eef5ff",
    "accent-fill": "#eef5ff",
    "accent-line": "#c1daff",
    "accent-ring": "#c1daff",
    "on-accent": "#ffffff",
    "focus": "rgba(143, 189, 242, 0.8)",
    "solid": "#851437",
    "dark-top": "#921a40",
    "btn-top": "#921a40",
    "btn-bottom": "#7a1131",
    "btn-ring": "#5c0b25",
    "btn-text": "#ffffff",
    "dark-bottom": "#7a1131",
    "dark-hover-top": "#7f1536",
    "dark-hover-bottom": "#650d2a",
    "edge-top": "#b04468",
    "edge-mid": "#851437",
    "edge-bottom": "#5c0b25",
    "dark-shadow": "rgba(133, 20, 55, 0.22)",
    "on-solid": "#ffffff",
    "solid-hover": "#6d0f2d",
    "shine-on-solid": "#ffffff",
    "primary": "#851437",
    "on-primary": "#ffffff",
    "primary-ink": "#ffffff",
    "primary-hover": "#6d0f2d",
    "tag": "#1a3e70",
    "tag-bg": "#eef5ff",
    "chip": "#f2f6fa",
    "chip-hover": "#e9eff6",
    "on-chip": "#1a3e70",
    "ok": "#1d6a34",
    "ok-fg": "#1d6a34",
    "ok-ink": "#1d6a34",
    "ok-bg": "#eafbee",
    "ok-soft": "#c9f5cf",
    "success": "#1d6a34",
    "warn": "#775810",
    "warn-fg": "#775810",
    "warn-text": "#775810",
    "warn-bg": "#fdf6dd",
    "danger": "#8a3a22",
    "danger-fg": "#8a3a22",
    "danger-bg": "#fdeee8",
    "danger-bg-hover": "#fbe2d8",
    "danger-soft": "#f5d5c9",
    "shadow": "0 0 0 1px #dae2ec, 0 8px 16px -8px rgba(26, 62, 112, 0.2)",
    "shadow-hover": "0 0 0 1px #cbd6e4, 0 14px 24px -14px rgba(26, 62, 112, 0.38), 0 4px 10px -6px rgba(26, 62, 112, 0.18)",
    "shadow-pop": "0 0 0 1px #cbd6e4, 0 24px 48px -24px rgba(26, 62, 112, 0.3), 0 8px 16px -4px rgba(26, 62, 112, 0.16)",
    "shadow-float": "0 0 0 1px #cbd6e4, 0 24px 48px -24px rgba(26, 62, 112, 0.3), 0 8px 16px -4px rgba(26, 62, 112, 0.16)",
    "ease": "cubic-bezier(0.16, 1, 0.3, 1)",
}

# Dark: the navy vitrine of the hub — objects a step lighter than #0f2747, white hairlines,
# info-vif for selection, a berry bright enough to read on navy.
DARK_TOKENS = {
    "card": "#16345c",
    "bg": "#16345c",
    "soft": "#1b3c68",
    "tray": "#0f2747",
    "surface": "#16345c",
    "tile": "#1b3c68",
    "title": "#ffffff",
    "ink": "rgba(255, 255, 255, 0.94)",
    "strong": "#ffffff",
    "text": "rgba(255, 255, 255, 0.72)",
    "muted": "rgba(255, 255, 255, 0.58)",
    "faint": "rgba(255, 255, 255, 0.36)",
    "icon": "rgba(255, 255, 255, 0.62)",
    "line": "rgba(255, 255, 255, 0.12)",
    "hairline": "rgba(255, 255, 255, 0.12)",
    "line-strong": "rgba(255, 255, 255, 0.2)",
    "fill": "rgba(255, 255, 255, 0.07)",
    "fill-strong": "rgba(255, 255, 255, 0.12)",
    "hover": "rgba(255, 255, 255, 0.07)",
    "wash": "rgba(255, 255, 255, 0.04)",
    "wash-soft": "rgba(255, 255, 255, 0.02)",
    "track": "rgba(255, 255, 255, 0.12)",
    "accent": "#8fbdf2",
    "accent-bg": "rgba(143, 189, 242, 0.16)",
    "accent-soft": "rgba(143, 189, 242, 0.16)",
    "accent-wash": "rgba(143, 189, 242, 0.1)",
    "accent-fill": "rgba(143, 189, 242, 0.16)",
    "accent-line": "rgba(143, 189, 242, 0.4)",
    "accent-ring": "rgba(143, 189, 242, 0.4)",
    "on-accent": "#0f2747",
    "focus": "rgba(143, 189, 242, 0.6)",
    "solid": "#a8204d",
    "dark-top": "#b02654",
    "btn-top": "#b02654",
    "btn-bottom": "#951b44",
    "btn-ring": "#6d0f2d",
    "btn-text": "#ffffff",
    "dark-bottom": "#951b44",
    "dark-hover-top": "#bd2f5f",
    "dark-hover-bottom": "#a2214d",
    "edge-top": "#cf5a80",
    "edge-mid": "#a8204d",
    "edge-bottom": "#6d0f2d",
    "dark-shadow": "rgba(3, 12, 28, 0.5)",
    "on-solid": "#ffffff",
    "solid-hover": "#bd2a5a",
    "shine-on-solid": "#ffffff",
    "primary": "#a8204d",
    "on-primary": "#ffffff",
    "primary-ink": "#ffffff",
    "primary-hover": "#bd2a5a",
    "tag": "#c1daff",
    "tag-bg": "rgba(143, 189, 242, 0.16)",
    "chip": "rgba(255, 255, 255, 0.07)",
    "chip-hover": "rgba(255, 255, 255, 0.11)",
    "on-chip": "#c1daff",
    "ok": "#7fe0a0",
    "ok-fg": "#7fe0a0",
    "ok-ink": "#7fe0a0",
    "ok-bg": "rgba(127, 224, 160, 0.14)",
    "ok-soft": "rgba(127, 224, 160, 0.3)",
    "success": "#7fe0a0",
    "warn": "#f3d27a",
    "warn-fg": "#f3d27a",
    "warn-text": "#f3d27a",
    "warn-bg": "rgba(243, 210, 122, 0.14)",
    "danger": "#f2a48c",
    "danger-fg": "#f2a48c",
    "danger-bg": "rgba(242, 164, 140, 0.14)",
    "danger-bg-hover": "rgba(242, 164, 140, 0.22)",
    "danger-soft": "rgba(242, 164, 140, 0.3)",
    "shadow": "0 0 0 1px rgba(255, 255, 255, 0.11), 0 8px 16px -8px rgba(3, 12, 28, 0.6)",
    "shadow-hover": "0 0 0 1px rgba(255, 255, 255, 0.18), 0 14px 24px -14px rgba(3, 12, 28, 0.75)",
    "shadow-pop": "0 0 0 1px rgba(255, 255, 255, 0.14), 0 24px 44px -20px rgba(3, 12, 28, 0.75), 0 8px 16px -8px rgba(3, 12, 28, 0.5)",
    "shadow-float": "0 0 0 1px rgba(255, 255, 255, 0.14), 0 24px 44px -20px rgba(3, 12, 28, 0.75), 0 8px 16px -8px rgba(3, 12, 28, 0.5)",
    "ease": "cubic-bezier(0.16, 1, 0.3, 1)",
}

# State families of the hub: each fill gets its hairline.
FAMILY_LINE = {
    "ok-bg": ("#c9f5cf", "rgba(127, 224, 160, 0.32)"),
    "green-bg": ("#c9f5cf", "rgba(127, 224, 160, 0.32)"),
    "warn-bg": ("#fae6a0", "rgba(243, 210, 122, 0.32)"),
    "amber-bg": ("#fae6a0", "rgba(243, 210, 122, 0.32)"),
    "danger-bg": ("#f5d5c9", "rgba(242, 164, 140, 0.32)"),
    "red-bg": ("#f5d5c9", "rgba(242, 164, 140, 0.32)"),
    "tag-bg": ("#c1daff", "rgba(143, 189, 242, 0.34)"),
    "accent-bg": ("#c1daff", "rgba(143, 189, 242, 0.34)"),
}

ACTION = re.compile(r"__(btn--primary|btn-primary|send|use|primary|text-btn--main)(?![a-z-])|__action\[data-strong\]|__xc__action|ui-xc__action")
# The classic style's raised navy button, written out instead of through a token.
NAVY_GRADIENT = re.compile(r"background:\s*linear-gradient\(\s*#173159\s*,\s*#081e3f\s*\)")
TEMPLATE = re.compile(r"`([^`]*\.ui-[^`]*)`")
RULE = re.compile(r"([^{}]+)\{([^{}]*)\}")
COMMENT = re.compile(r"/\*.*?\*/", re.S)


def rules(site: pathlib.Path):
    """Yield (selector, declarations, in_at_rule) for every component rule, deduplicated."""
    seen = set()
    # Both styles: "clean" (*.clean-*.js) and "classic" (demo-*, component-*).
    paths = sorted(
        path
        for pattern in ("*.clean-*.js", "demo-*.js", "demo-*.css", "component-*.js")
        for path in (site / "assets").glob(pattern)
    )
    for path in paths:
        text = path.read_text(encoding="utf-8")
        chunks = [text] if path.suffix == ".css" else TEMPLATE.findall(text)
        # Never read back what embed_sources() wrote into the copyable code.
        chunks = [chunk.split(EMBED_MARK)[0] for chunk in chunks]
        for chunk in chunks:
            # Some modules keep their CSS as an escaped string ("\\n.ui-fm {\\n  --ui-fm-…").
            css = COMMENT.sub("", chunk.replace("\\n", "\n").replace("\\t", "\t").replace('\\"', '"'))
            depth = []
            pos = 0
            for token in re.finditer(r"[{}]", css):
                text = css[pos:token.start()]
                pos = token.end()
                if token.group() == "{":
                    depth.append(text.strip())
                    continue
                if not depth:
                    continue
                selector = depth.pop()
                if selector.startswith("@") or not text.strip():
                    continue
                key = (selector, text.strip(), bool(depth))
                if key not in seen:
                    seen.add(key)
                    yield key


def split(selector: str) -> list[str]:
    """Split a selector list on its top-level commas (not the ones inside :where(…))."""
    parts, depth, current = [], 0, ""
    for char in selector:
        depth += char == "("
        depth -= char == ")"
        if char == "," and depth == 0:
            parts.append(current)
            current = ""
        else:
            current += char
    parts.append(current)
    return [part.strip() for part in parts if part.strip()]


COLOUR = re.compile(r"^(#[0-9a-f]{3,8}|rgba?\(|hsla?\(|oklch\(|color-mix\(|transparent$|white$|black$|currentcolor$)", re.I)


def same_kind(name: str, value: str) -> bool:
    """Only replace a token with a value of the same kind: colour, shadow or easing."""
    value = value.strip()
    if name == "ease":
        return value.startswith("cubic-bezier(")
    if name.startswith("shadow"):
        return "px" in value and bool(re.search(r"#|rgba?\(", value))
    return bool(COLOUR.match(value))


# Tokens whose lightness is MEANT to flip: the main action becomes a berry block in both
# themes (the dark theme used a white chip), selection turns to the info family.
FLIPS = {
    "accent", "solid", "solid-hover", "primary", "primary-hover", "primary-ink", "on-solid",
    "on-primary", "on-accent", "focus", "text",
    "btn-top", "btn-bottom", "btn-ring", "btn-text", "dark-top", "dark-bottom", "dark-hover-top", "dark-hover-bottom", "edge-top", "edge-mid", "edge-bottom",
}


def lightness(value: str, base: tuple[int, int, int]):
    """Perceived lightness 0..1 of a plain colour composited on `base`; None if not plain."""
    value = value.strip()
    match = re.fullmatch(r"#([0-9a-f]{3,8})", value, re.I)
    if match:
        hexa = match.group(1)
        if len(hexa) in (3, 4):
            hexa = "".join(c * 2 for c in hexa)
        rgb = [int(hexa[i:i + 2], 16) for i in (0, 2, 4)]
        alpha = int(hexa[6:8], 16) / 255 if len(hexa) == 8 else 1.0
    else:
        match = re.fullmatch(r"rgba?\(([^)]*)\)", value)
        if not match:
            return None
        numbers = [float(x) for x in re.split(r"[ ,/]+", match.group(1).strip()) if x]
        rgb, alpha = numbers[:3], numbers[3] if len(numbers) > 3 else 1.0
    mixed = [c * alpha + base[i] * (1 - alpha) for i, c in enumerate(rgb)]
    linear = sum(w * (c / 255) ** 2.2 for w, c in zip((0.2126, 0.7152, 0.0722), mixed))
    return linear ** (1 / 2.2)


def keeps_role(name: str, old: str, new: str, dark: bool) -> bool:
    """Same name, other job: `--ui-seg-soft` is a text colour, `--ui-db-ink` is white text on a
    dark tip. A replacement that turns dark into light (or back) is skipped unless meant."""
    if not same_kind(name, old):
        return False
    if name in FLIPS:
        return True
    base = (15, 39, 71) if dark else (255, 255, 255)
    before, after = lightness(old, base), lightness(new, base)
    return before is None or after is None or abs(before - after) <= 0.22


def palette(all_rules) -> list[str]:
    # {class: (var prefix, {"light": {name: value}, "dark": {name: value}})}
    roots: dict[str, tuple[str, dict[str, dict[str, str]]]] = {}
    for selector, decls, nested in all_rules:
        if nested:
            continue
        names = re.findall(r"--ui-([a-z0-9]+)-([a-z0-9-]+)\s*:\s*([^;]+)", decls)
        if not names:
            continue
        for part in split(selector):
            match = re.fullmatch(r'(:where\(\s*\.dark\s*,\s*\[data-theme="dark"\]\s*\)\s+)?\.ui-([a-z0-9-]+)', part)
            if not match:
                continue
            mode = "dark" if match.group(1) else "light"
            var, modes = roots.setdefault(match.group(2), (names[0][0], {"light": {}, "dark": {}}))
            for prefix, name, value in names:
                if prefix == var:
                    modes[mode].setdefault(name, value.strip())
    out = []
    for cls in sorted(roots):
        var, modes = roots[cls]
        light_lines, dark_lines = [], []
        for name, light_value in modes["light"].items():
            if name not in LIGHT_TOKENS or not keeps_role(name, light_value, LIGHT_TOKENS[name], False):
                continue
            dark_value = modes["dark"].get(name)
            if dark_value is not None and keeps_role(name, dark_value, DARK_TOKENS[name], True):
                dark_lines.append(f"  --ui-{var}-{name}: {DARK_TOKENS[name]};")
            elif dark_value is not None:
                # Our light value outranks the component's dark root: put its own dark value back.
                dark_lines.append(f"  --ui-{var}-{name}: {dark_value};")
            elif name in DARK_TOKENS and keeps_role(name, light_value, DARK_TOKENS[name], True):
                dark_lines.append(f"  --ui-{var}-{name}: {DARK_TOKENS[name]};")
            else:
                continue  # no safe dark counterpart: leave the token alone in both themes
            light_lines.append(f"  --ui-{var}-{name}: {LIGHT_TOKENS[name]};")
        for selector, lines in ((f".ui-{cls}.ui-{cls}", light_lines), (f"{DARK} .ui-{cls}.ui-{cls}", dark_lines)):
            if lines:
                out.append(f"{selector} {{\n" + "\n".join(lines) + "\n}\n")
    return out


def radius(decls: str):
    match = re.search(r"border-radius:\s*([^;]+)", decls)
    return match.group(1).strip() if match else None


def paints(decls: str, *roles: str) -> bool:
    return bool(re.search(r"background:\s*var\(--ui-[a-z0-9]+-(%s)\)" % "|".join(roles), decls))


def plain(part: str) -> bool:
    """A selector with no state (hover, checked…) and no pseudo-element: the resting look."""
    return ":" not in part.replace(":where(", "").replace(":is(", "")


def collect_shapes(all_rules):
    cards, menus, primaries, secondaries, fields, titles, pebbles = (set() for _ in range(7))
    inked, inked_hover = set(), set()
    trays, classic_cards = set(), set()
    families: dict[str, str] = {}
    for selector, decls, nested in all_rules:
        if nested or ".ui-" not in selector:
            continue
        parts = [p for p in split(selector) if p.startswith((".ui-", ":where(.ui-"))]
        r = radius(decls)
        for part in parts:
            is_overlay = re.search(r"__(menu|pop|tooltip|picker|menu-panel|tip)\b", part)
            if r == "10px" and paints(decls, "card", "surface") and plain(part):
                (menus if is_overlay else cards).add(part)
            # Classic style is already double: a tray (the frame) holding a card (the panel).
            if re.fullmatch(r"\.ui-[a-z0-9-]+", part) and paints(decls, "tray") and r:
                trays.add(part)
            if (re.search(r"__(card|panel|body|kpi|receipt|sheet)(?![a-z-])", part) and plain(part)
                    and r in ("12px", "14px", "16px", "18px", "20px") and paints(decls, "card", "bg", "paper", "surface")):
                classic_cards.add(part)
            if paints(decls, "solid", "primary") and plain(part) and "__send" not in part and "input" not in part:
                primaries.add(part)
            # Classic style: the main action is painted with the ink (a navy chip). It turns berry.
            if ACTION.search(part) and (
                re.search(r"background(-color)?:[^;]*var\(--ui-[a-z0-9]+-(ink|strong)\)", decls)
                or NAVY_GRADIENT.search(decls)
            ):
                (inked_hover if ":hover" in part else inked).add(part)
            elif re.search(r"__(btn|button|action|secondary)(?![a-z])", part) and r in ("6px", "8px") and plain(part):
                secondaries.add(part)
            if re.search(r"(__input|__field|__search|__select)(?![a-z-])", part) and r in ("6px", "8px") and plain(part):
                fields.add(part)
            size = re.search(r"font-size:\s*(1[4-9]|2[0-6])px", decls)
            if re.search(r"__(title|heading|question)\b", part) and size and plain(part):
                titles.add((part, int(size.group(1))))
            if re.search(r"__(icon|glyph|logo|mark)(?![a-z-])", part) and paints(decls, "card", "surface") and "box-shadow" in decls and plain(part):
                pebbles.add(part)
            family = re.search(r"background:\s*var\(--ui-[a-z0-9]+-(%s)\)" % "|".join(FAMILY_LINE), decls)
            if family and "__btn" not in part and "button" not in part:
                families[part] = family.group(1)
    return cards, menus, primaries, secondaries, fields, titles, pebbles, families, inked, inked_hover, trays, classic_cards


def scoped(parts, dark=False) -> str:
    """Raise specificity by two type selectors only, so the component's own states still win."""
    if not dark:
        return ",\n".join(f"html body {p}" for p in sorted(parts))
    # The dark class can sit on <html> itself or on any wrapper (the preview stage).
    return ",\n".join(
        f"html{DARK} body {p},\nhtml body {DARK} {p}" for p in sorted(parts)
    )


def shapes(all_rules) -> list[str]:
    (cards, menus, primaries, secondaries, fields, titles, pebbles, families, inked, inked_hover,
     trays, classic_cards) = collect_shapes(all_rules)
    out = ["/* ——— Shape: the hub's objects, not only its colours ——— */\n"]
    if cards:
        out.append(
            "/* Objects are DOUBLE, as in the hub: the raised panel sits in a matte frame\n"
            " * (#f2f6fa, its own hairline), and the navy shadow falls from the frame. */\n"
            f"{scoped(cards)} {{\n"
            "  border-radius: 16px;\n"
            "  box-shadow: 0 0 0 1px #dae2ec, 0 0 0 6px #f2f6fa, 0 0 0 7px #dae2ec,\n"
            "    0 26px 38px -22px rgba(26, 62, 112, 0.45), 0 6px 14px -8px rgba(26, 62, 112, 0.18);\n"
            "}\n"
            f"{scoped(cards, dark=True)} {{\n"
            "  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.12), 0 0 0 6px #0f2747, 0 0 0 7px rgba(255, 255, 255, 0.1),\n"
            "    0 26px 40px -20px rgba(3, 12, 28, 0.8);\n"
            "}\n"
        )
    if trays:
        out.append(
            "/* Classic: the tray is the hub's matte frame — its own hairline, the navy shadow falls from it. */\n"
            f"{scoped(trays)} {{\n"
            "  box-shadow: 0 0 0 1px #dae2ec, 0 26px 38px -22px rgba(26, 62, 112, 0.45), 0 6px 14px -8px rgba(26, 62, 112, 0.16);\n"
            "}\n"
            f"{scoped(trays, dark=True)} {{\n"
            "  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1), 0 26px 40px -20px rgba(3, 12, 28, 0.8);\n"
            "}\n"
        )
    if classic_cards:
        out.append(
            "/* Classic: the card is the raised panel in that frame — hairline and a short navy drop. */\n"
            f"{scoped(classic_cards)} {{\n"
            "  box-shadow: 0 0 0 1px #dae2ec, 0 12px 20px -14px rgba(26, 62, 112, 0.4);\n"
            "}\n"
            f"{scoped(classic_cards, dark=True)} {{\n"
            "  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.12), 0 12px 20px -12px rgba(3, 12, 28, 0.7);\n"
            "}\n"
        )
    if menus:
        out.append(f"{scoped(menus)} {{\n  border-radius: 12px;\n}}\n")
    if primaries:
        out.append(
            "/* The main action: a flat berry block, 1px lighter edge on top, a berry-tinted drop. */\n"
            f"{scoped(primaries)} {{\n"
            "  border-radius: 9px;\n"
            "  font-weight: 600;\n"
            "  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 6px 12px -6px rgba(133, 20, 55, 0.6);\n"
            "  transition: background-color .15s, box-shadow .15s, transform .15s cubic-bezier(.16, 1, .3, 1);\n"
            "}\n"
            f"{scoped(primaries, dark=True)} {{\n"
            "  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 6px 14px -6px rgba(3, 12, 28, 0.8);\n"
            "}\n"
        )
    if inked:
        out.append(
            "/* Classic style: its navy main action becomes the berry block, white label in both themes. */\n"
            f"{scoped(inked)} {{\n"
            "  background: #851437;\n"
            "  color: #ffffff;\n"
            "  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 6px 12px -6px rgba(133, 20, 55, 0.6);\n"
            "}\n"
            f"{scoped(inked, dark=True)} {{\n"
            "  background: #a8204d;\n"
            "  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 6px 14px -6px rgba(3, 12, 28, 0.8);\n"
            "}\n"
        )
    if inked_hover:
        out.append(
            f"{scoped(inked_hover)} {{\n  background: #6d0f2d;\n  color: #ffffff;\n}}\n"
            f"{scoped(inked_hover, dark=True)} {{\n  background: #bd2a5a;\n}}\n"
        )
    if secondaries:
        out.append(f"{scoped(secondaries)} {{\n  border-radius: 9px;\n}}\n")
    if fields:
        out.append(
            "/* Fields: the hub shell — 10px corners, berry caret. */\n"
            f"{scoped(fields)} {{\n  border-radius: 10px;\n  caret-color: #851437;\n}}\n"
            f"{scoped(fields, dark=True)} {{\n  caret-color: #f6bcc8;\n}}\n"
        )
    if titles:
        out.append("/* Titles: the hub's condensed bold, two sizes up so it keeps its presence. */\n")
        for size in sorted({s for _, s in titles}):
            out.append(
                f"{scoped({p for p, s in titles if s == size})} {{\n"
                '  font-family: "Avenir Next Condensed", "Avenir Next", Avenir, "Arial Narrow", system-ui, sans-serif;\n'
                f"  font-size: {size + 2 if size <= 15 else size + 1}px;\n"
                "  font-weight: 700;\n"
                "  letter-spacing: 0.002em;\n"
                "}\n"
            )
    if pebbles:
        out.append(
            "/* Icon tiles: pebbles, lit from below. */\n"
            f"{scoped(pebbles)} {{\n"
            "  box-shadow: 0 0 0 1px #dae2ec, 0 4px 10px -4px rgba(26, 62, 112, 0.3), inset 0 -2px 6px -4px rgba(26, 62, 112, 0.4);\n"
            "}\n"
            f"{scoped(pebbles, dark=True)} {{\n"
            "  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.14), 0 4px 10px -4px rgba(3, 12, 28, 0.7), inset 0 -2px 6px -4px rgba(255, 255, 255, 0.25);\n"
            "}\n"
        )
    by_family: dict[str, set[str]] = {}
    for part, family in families.items():
        by_family.setdefault(family, set()).add(part)
    if by_family:
        out.append("/* State chips: each family is a fill AND its hairline, as in the hub. */\n")
    for family in sorted(by_family):
        light, dark = FAMILY_LINE[family]
        parts = by_family[family]
        out.append(f"{scoped(parts)} {{\n  box-shadow: inset 0 0 0 1px {light};\n}}\n")
        out.append(f"{scoped(parts, dark=True)} {{\n  box-shadow: inset 0 0 0 1px {dark};\n}}\n")
    return out


# ——— Second wave: the smaller parts of a component, each in its hub form ———

INK_PAINT = r"background(-color)?:\s*var\(--ui-[a-z0-9]+-(ink|accent|solid|primary|strong)\)"

ROLES = [
    # (comment, predicate(part, decls), light declarations, dark declarations)
    (
        "Card feet live in the frame: the matte band under the raised panel.",
        lambda p, d: re.search(r"__(foot|footer)(?![a-z-])", p) and plain(p)
        and re.search(r"border-top|box-shadow:\s*inset 0 1px|box-shadow: 0 -1px", d),
        "background: #f5f8fb;\n  border-bottom-left-radius: 15px;\n  border-bottom-right-radius: 15px;",
        "background: rgba(4, 16, 38, 0.32);",
    ),
    (
        "Secondary actions: the hub's light object — pale panel, firm hairline, a short navy drop.",
        lambda p, d: re.search(r"__(btn|button|action|secondary)(?![a-z])", p) and plain(p)
        and (paints(d, "card", "surface", "bg") or re.search(r"box-shadow:\s*var\(--ui-[a-z0-9]+-shadow\)", d)),
        "box-shadow: 0 0 0 1px #cbd6e4, 0 6px 12px -8px rgba(26, 62, 112, 0.35);\n  font-weight: 600;",
        "box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.16), 0 6px 12px -8px rgba(3, 12, 28, 0.7);",
    ),
    (
        "Fields: the hub shell — firm hairline and a soft inner shade.",
        lambda p, d: re.search(r"(__input|__field|__search|__select)(?![a-z-])", p) and plain(p)
        and re.search(r"box-shadow|border", d) and "radius" in d,
        "box-shadow: 0 0 0 1px #cbd6e4, inset 0 2px 6px -4px rgba(26, 62, 112, 0.25);",
        "box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.16), inset 0 2px 6px -4px rgba(0, 0, 0, 0.4);",
    ),
    (
        "Ticked boxes and switches that are on: berry, the colour of a choice made.",
        lambda p, d: re.search(r"(__check|__box|__checkbox|__switch|__track|__toggle)", p)
        and re.search(r'aria-checked="true"|:checked|data-checked|data-on', p) and re.search(INK_PAINT, d),
        "background: #851437;\n  box-shadow: none;",
        "background: #a8204d;",
    ),
    (
        "Progress fills: the berry rail of the hub titles.",
        lambda p, d: re.search(r"__(fill|progress|bar|meter)(?![a-z-])|__bar > span", p) and re.search(INK_PAINT, d),
        "background: linear-gradient(90deg, #851437, #b5426a);",
        "background: linear-gradient(90deg, #a8204d, #d9608a);",
    ),
    (
        "Keys: small pebbles with a firmer bottom edge.",
        lambda p, d: re.search(r"(kbd|__kbd|__key)(?![a-z-])", p) and plain(p) and "primary" not in p and "background" in d,
        "background: #ffffff;\n  box-shadow: 0 0 0 1px #dae2ec, 0 1px 0 1px #cbd6e4;",
        "background: rgba(255, 255, 255, 0.08);\n  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.14), 0 1px 0 1px rgba(0, 0, 0, 0.3);",
    ),
    (
        "Group labels: the hub's small capitals.",
        lambda p, d: re.search(r"__(group-label|group-title|group-head|section-title|section-label|eyebrow|kicker)(?![a-z-])", p)
        and plain(p) and re.search(r"font-size:\s*1[12](\.5)?px", d),
        "font-size: 10.5px;\n  font-weight: 600;\n  letter-spacing: 0.09em;\n  text-transform: uppercase;",
        "",
    ),
    (
        "The highlighted row of a list: the info family, as a selected hub row.",
        lambda p, d: re.search(r"__(option|item|row)", p) and re.search(r"data-active|data-highlighted", p)
        and ":hover" not in p and re.search(r"background(-color)?:\s*var\(--ui-[a-z0-9]+-(fill|hover|wash|fill-strong)\)", d),
        "background: #eef5ff;\n  box-shadow: inset 2px 0 0 #851437;",
        "background: rgba(143, 189, 242, 0.14);\n  box-shadow: inset 2px 0 0 #d9608a;",
    ),
]


def roles(all_rules) -> list[str]:
    found = [set() for _ in ROLES]
    for selector, decls, nested in all_rules:
        if nested or ".ui-" not in selector:
            continue
        for part in split(selector):
            if not part.startswith((".ui-", ":where(.ui-")):
                continue
            for i, (_, test, _, _) in enumerate(ROLES):
                if test(part, decls):
                    found[i].add(part)
    out = []
    for (comment, _, light, dark), parts in zip(ROLES, found):
        if not parts:
            continue
        if comment.startswith("Secondary"):
            # The base button class also carries the primary and ghost variants: leave those alone.
            # :where() keeps the specificity low, so the component's hover still wins.
            parts = {p + ':where(:not([class*="primary"]):not([class*="ghost"]):not([data-variant]))' for p in parts}
        out.append(f"/* {comment} */\n{scoped(parts)} {{\n  {light}\n}}\n")
        if dark:
            out.append(f"{scoped(parts, dark=True)} {{\n  {dark}\n}}\n")
    return out


# ——— The code people copy: free components carry the same design in their own file ———

EMBED_MARK = "/* ——— A-Team design system (Osmose), from scripts/theme/composants.py ——— */"
BLOCK = re.compile(r"(?:/\*.*?\*/\s*)?([^{}]+)\{([^{}]*)\}", re.S)


def roots_of(css: str) -> set[str]:
    """Component root names used in a stylesheet: `ui-di` for `.ui-di__btn`."""
    return set(re.findall(r"\.(ui-[a-z0-9-]+?)(?=__|[\s.:\[{,>)]|$)", css))


def subset(layer: str, roots: set[str]) -> str:
    """The rules of the generated layer that only concern these roots."""
    out = []
    for match in BLOCK.finditer(layer):
        body = match.group(2).strip()
        parts = [p for p in split(match.group(1)) if roots_of(p) and roots_of(p) <= roots]
        if parts and body:
            out.append(",\n".join(parts) + " {\n  " + "\n  ".join(l.strip() for l in body.splitlines() if l.strip()) + "\n}")
    return "\n".join(out)


def embed(source: str, layer: str, opening: str, closing: str):
    """Append the matching rules at the end of the source's `const css` block (idempotent)."""
    start = source.find(opening)
    if start < 0:
        return None
    end = source.find(closing, start + len(opening))
    if end < 0:
        return None
    css = source[start + len(opening):end]
    mark = css.find("\n" + EMBED_MARK)
    if mark >= 0:
        css = css[:mark]
    extra = subset(layer, roots_of(css))
    if not extra:
        return None
    return source[:start + len(opening)] + css + "\n" + EMBED_MARK + "\n" + extra + "\n" + source[end:]


def embed_sources(site: pathlib.Path, layer: str) -> int:
    changed = 0
    # Registry items (`npx shadcn add …`): plain TSX inside JSON.
    for path in sorted((site / "r").glob("*.json")):
        data = json.loads(path.read_text(encoding="utf-8"))
        touched = False
        for item in data.get("files", []):
            new = embed(item.get("content", ""), layer, "const css = /* css */ `", "\n`;")
            if new is not None and new != item["content"]:
                item["content"] = new
                touched = True
        if touched:
            path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
            changed += 1
    # The Code tab and the Copy button: the same TSX held in a JS template literal.
    for path in sorted((site / "assets").glob("component*.js")):
        text = path.read_text(encoding="utf-8")
        new = embed(text, layer, "const css = /* css */ \\`", "\n\\`;")
        if new is not None and new != text:
            path.write_text(new, encoding="utf-8")
            changed += 1
    return changed


def main() -> None:
    site = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else "site")
    all_rules = list(rules(site))
    if not all_rules:
        sys.exit("no component rules found: run on the built site directory")
    colours = palette(all_rules)
    head = (
        "/* Generated by scripts/theme/composants.py — do not edit by hand.\n"
        " * The components themselves, in the A-Team Osmose material.\n"
        " * Palette: doubled root class, above the component's own light and dark roots.\n"
        " * Shape: `html body` in front, so the component's hover and checked states still win. */\n"
    )
    target = pathlib.Path(__file__).with_name("composants.css")
    target.write_text("\n".join([head, *colours, *shapes(all_rules), *roles(all_rules)]), encoding="utf-8")
    print(f"{len(colours) // 2} palettes, {len(all_rules)} rules read -> {target}")
    print(f"design embedded in {embed_sources(site, target.read_text(encoding='utf-8'))} copyable sources")


if __name__ == "__main__":
    main()
