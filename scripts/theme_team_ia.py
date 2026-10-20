#!/usr/bin/env python3
"""Repaint the static mirror in the TGV INOUI / A-Team design system.

The mirror keeps every route, demo and layout of the original site. This pass
only changes what a viewer reads as the brand: colours, typeface and the
raster previews that show the components. Reference surfaces: the hub sign-in
page and the programme e-mails (bleu nuit vitrine, French berry calls to
action, Avenir Next Condensed capitals for display titles).

  * Greys become the charter's blue greys at the same lightness, so contrast
    and hierarchy stay as designed; dark greys become the bleu nuit vitrine.
  * Blues stay blue but move onto the charter's blues (bleu nuit #1a3e70,
    bleu charrette #254f8a, bleu ciel #307bbf, bleu clair #a4c2e7).
  * Violets, magentas and pinks become French berry #9c0c35 / rose poudre.
  * Semantic reds, greens and yellows are kept, and so are third-party brand
    colours (Slack, Stripe, Google…), which must not be repainted.
  * Black shadows and hairlines become the hub's navy-tinted ones.
  * Inter becomes Avenir Next, the hub typeface.

Usage:  python3 scripts/theme_team_ia.py [site-dir]
Runs once per mirror: a marker file stops a second pass from repainting an
already repainted site. Rebuild with `npm run mirror`, then run this again.
"""

import io
import json
import math
import re
import sys
from pathlib import Path

import numpy as np
from PIL import Image, UnidentifiedImageError

MARKER = ".theme-team-ia"
TEXT_SUFFIXES = {".css", ".js", ".json", ".svg", ".html", ".webmanifest"}
IMAGE_DIRS = ("previews", "landing", "illustrations")  # not photos of people or album covers
IMAGE_SUFFIXES = {".webp", ".png", ".jpg", ".jpeg"}

NEUTRAL_HUE = 258.0  # bleu nuit #1a3e70
BLUE_HUE = 255.0     # bleu charrette / bleu ciel
BERRY_HUE = 8.0      # French berry #9c0c35
# Chroma given to a grey, by lightness: white stays white, mid-greys take a
# visible steel tint, near-blacks become navy night.
CHROMA_L = np.array([0.0, 0.15, 0.30, 0.60, 0.85, 0.95, 0.985, 1.0])
CHROMA_C = np.array([0.0, 0.050, 0.080, 0.045, 0.022, 0.012, 0.005, 0.0])

# Third-party brand colours seen in the integration and logo demos.
BRAND_COLOURS = {
    "e01e5a", "36c5f0", "2eb67d", "ecb22e",          # Slack
    "635bff",                                        # Stripe
    "ff7a59",                                        # HubSpot
    "4285f4", "34a853", "fbbc05", "fbbc04", "ea4335",  # Google
    "f24e1e", "a259ff", "1abcfe", "0acf83", "ff7262",  # Figma
    "5e6ad2", "5865f2", "00a1e0", "0a66c2", "1877f2",  # Linear, Discord, Salesforce, LinkedIn, Facebook
    "ff4a00", "4a154b", "0052cc", "2684ff", "fc6d26",  # Zapier, Slack aubergine, Jira, GitLab
    "10a37f", "d97757", "cc785c", "7b68ee", "e8a87c",  # OpenAI, Anthropic, ClickUp
    "25d366", "00b2ff", "ff0000", "1db954", "6772e5",  # WhatsApp, YouTube, Spotify, Stripe legacy
}

# Design tokens of the site shell, set to the hub's own values rather than
# derived, so the frame matches the hub exactly. Appended after the original.
TOKENS = """
/* TGV INOUI / A-Team design system — appended by scripts/theme_team_ia.py */
:root{--font-sans:"Avenir Next","Avenir",-apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif;
--font-display:"Avenir Next Condensed","Arial Narrow","Helvetica Neue",Arial,sans-serif;
--bg:#eef2f8;--panel:#fff;--card:#fff;--preview:#f4f7fb;--muted-bg:#1a3e700d;--hover-bg:#1a3e7012;
--text:#00162b;--text-muted:#5a6a85;--text-subtle:#1a3e7099;--border:#dae2ec;--border-soft:#1a3e701a;
--card-stroke:#1a3e7014;--panel-stroke:#dae2ec;--tier-stroke:#e6ecf4;--guarantee-bg:#f4f7fb;--guarantee-tray:#e6ecf4;
--panel-shadow:0 1px 0 #1a3e700f,0 18px 30px -24px #1a3e7059;--primary:#9c0c35;--primary-fg:#fff;
--accent:#1a3e70;--accent-soft:#1a3e7014;--pro-bg:#fbe7ec;--pro-from:#9c0c35;--pro-to:#1a3e70;
--shadow-card:0 1px 1.5px #1a3e700f,inset 0 -1px 0 #1a3e7014;
--shadow-pop:0 24px 48px -24px #1a3e704d,0 8px 16px -4px #1a3e7029,0 0 0 1px #cbd6e4;
--dark-btn-top:#a8113d;--dark-btn-bottom:#8a0b2f;--dark-btn-top-hover:#b8164a;--dark-btn-bottom-hover:#9c0c35;
--dark-btn-edge-1:#c23a60;--dark-btn-edge-2:#9c0c35;--dark-btn-edge-3:#6d0822;--dark-btn-ring:#6d082259;--dark-btn-text:#fff;
--title:#1a3e70;--link:#254f8a;--grid:#1a3e700f}
:root:not([data-theme=light]){color-scheme:light}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]){
--bg:#0f2747;--panel:#12305a;--card:#16386a;--preview:#1a3e70;--muted-bg:#ffffff12;--hover-bg:#ffffff1a;
--text:#fff;--text-muted:#c3d3ea;--text-subtle:#ffffff99;--border:#2a4f82;--border-soft:#ffffff1f;
--card-stroke:#ffffff17;--panel-stroke:#244878;--tier-stroke:#1d406f;--guarantee-bg:#12305a;--guarantee-tray:#1a3e70;
--panel-shadow:0 1px 0 #0000004d,0 2px 1px -1px #00000059;--primary:#9c0c35;--primary-fg:#fff;
--accent:#a4c2e7;--accent-soft:#a4c2e726;--pro-bg:#9c0c3540;--pro-from:#f8c3c3;--pro-to:#a4c2e7;
--shadow-card:0 1px 1.5px #00000040,inset 0 -1px 0 #ffffff0f;--shadow-pop:0 24px 48px -20px #00000080,0 0 0 1px #ffffff26;
--title:#fff;--link:#a4c2e7;--grid:#ffffff0d;color-scheme:dark}}
:root[data-theme=dark]{
--bg:#0f2747;--panel:#12305a;--card:#16386a;--preview:#1a3e70;--muted-bg:#ffffff12;--hover-bg:#ffffff1a;
--text:#fff;--text-muted:#c3d3ea;--text-subtle:#ffffff99;--border:#2a4f82;--border-soft:#ffffff1f;
--card-stroke:#ffffff17;--panel-stroke:#244878;--tier-stroke:#1d406f;--guarantee-bg:#12305a;--guarantee-tray:#1a3e70;
--panel-shadow:0 1px 0 #0000004d,0 2px 1px -1px #00000059;--primary:#9c0c35;--primary-fg:#fff;
--accent:#a4c2e7;--accent-soft:#a4c2e726;--pro-bg:#9c0c3540;--pro-from:#f8c3c3;--pro-to:#a4c2e7;
--shadow-card:0 1px 1.5px #00000040,inset 0 -1px 0 #ffffff0f;--shadow-pop:0 24px 48px -20px #00000080,0 0 0 1px #ffffff26;
--title:#fff;--link:#a4c2e7;--grid:#ffffff0d;color-scheme:dark}
::selection{background:#f8c3c3;color:#00162b}
/* Ground: the hub's tinted canvas under a 56px grid */
body{background-color:var(--bg);background-image:linear-gradient(to right,var(--grid) 1px,transparent 1px),linear-gradient(to bottom,var(--grid) 1px,transparent 1px);background-size:56px 56px}
html:has(.lp),html:has(.lp) body{background-color:var(--bg)}
html.dark:has(.lp),html.dark:has(.lp) body,html[data-theme=dark]:has(.lp),html[data-theme=dark]:has(.lp) body{background-color:var(--bg)}
/* Display titles: Avenir Next Condensed bold capitals in bleu nuit, as on the hub and in the e-mails */
.lp-hero__title,.lp-lead,.doc__title,.page-head__title,.hero__title,.faq__title,.legal__title,.not-found__title{
font-family:var(--font-display);font-weight:700;text-transform:uppercase;letter-spacing:.2px;color:var(--title)}
.lp-hero__title{font-size:clamp(36px,6vw,60px);line-height:1}
.doc__h2{color:var(--title)}
/* Primary actions: French berry pill, as the hub "Se connecter" */
.btn--primary,.tier__cta--primary,.promo__cta{border-radius:999px;font-weight:600;box-shadow:0 8px 16px -6px #9c0c3566,0 0 0 1px var(--dark-btn-ring)}
.prompt-bar__code{background:#9c0c35;color:#fff;border-radius:999px}
.prompt-bar__code:hover{background:#b00d3c;opacity:1}
/* Avenir Next sets wider than Inter: keep one-line labels on one line */
.pro-badge{white-space:nowrap}
"""


# ——— OKLCH, vectorised (shape (..., 3), sRGB in 0..1) ———

def _to_linear(c):
    return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)


def _to_srgb(c):
    c = np.clip(c, 0.0, 1.0)
    return np.where(c <= 0.0031308, c * 12.92, 1.055 * np.power(c, 1 / 2.4) - 0.055)


def rgb_to_oklch(rgb):
    lin = _to_linear(rgb)
    lms = lin @ np.array([[0.4122214708, 0.2119034982, 0.0883024619],
                          [0.5363325363, 0.6806995451, 0.2817188376],
                          [0.0514459929, 0.1073969566, 0.6299787005]])
    lms = np.cbrt(lms)
    lab = lms @ np.array([[0.2104542553, 1.9779984951, 0.0259040371],
                          [0.7936177850, -2.4285922050, 0.7827717662],
                          [-0.0040720468, 0.4505937099, -0.8086757660]])
    L, a, b = lab[..., 0], lab[..., 1], lab[..., 2]
    return L, np.hypot(a, b), np.degrees(np.arctan2(b, a)) % 360


def _oklch_to_linear(L, C, H):
    h = np.radians(H)
    lab = np.stack([L, C * np.cos(h), C * np.sin(h)], axis=-1)
    lms = lab @ np.array([[1.0, 1.0, 1.0],
                          [0.3963377774, -0.1055613458, -0.0894841775],
                          [0.2158037573, -0.0638541728, -1.2914855480]])
    lms = lms ** 3
    return lms @ np.array([[4.0767416621, -1.2684380046, -0.0041960863],
                           [-3.3077115913, 2.6097574011, -0.7034186147],
                           [0.2309699292, -0.3413193965, 1.7076147010]])


def oklch_to_rgb(L, C, H):
    """Back to sRGB, lowering chroma until the colour fits the gamut."""
    C = np.array(C, dtype=float)
    for _ in range(12):
        lin = _oklch_to_linear(L, C, H)
        out = np.any((lin < -1e-4) | (lin > 1 + 1e-4), axis=-1)
        if not out.any():
            break
        C = np.where(out, C * 0.85, C)
    return _to_srgb(_oklch_to_linear(L, C, H))


def repaint(rgb):
    """Map sRGB colours (..., 3) in 0..1 to the art direction."""
    L, C, H = rgb_to_oklch(rgb)
    newL, newC, newH = L.copy(), C.copy(), H.copy()

    neutral = C < 0.03
    newC = np.where(neutral, np.interp(L, CHROMA_L, CHROMA_C), newC)
    newH = np.where(neutral, NEUTRAL_HUE, newH)

    chroma = ~neutral
    blue = chroma & (H >= 195) & (H < 275)
    berry = chroma & ((H >= 275) | (H < 5))
    # Saturated web blues (#2f6bff) land on bleu ciel / charrette, never neon.
    newL = np.where(blue & (L < 0.75), L * 0.92, newL)
    newC = np.where(blue, np.minimum(C, 0.13), newC)
    newH = np.where(blue, BLUE_HUE, newH)
    newL = np.where(berry & (L < 0.75), np.minimum(L, 0.46), newL)
    newC = np.where(berry, np.minimum(C, 0.17), newC)
    newH = np.where(berry, BERRY_HUE, newH)

    changed = neutral | blue | berry
    out = oklch_to_rgb(newL, newC, newH)
    return np.where(changed[..., None], out, rgb)


# ——— Colours in text ———

HEX = re.compile(r'(?<=["\'`(\s:,=>])#([0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})(?![0-9a-zA-Z_-])')
RGB = re.compile(r'\brgba?\(\s*(\d{1,3})\s*[, ]\s*(\d{1,3})\s*[, ]\s*(\d{1,3})\s*(?:[,/]\s*([\d.]+%?)\s*)?\)')


def _expand(h):
    return "".join(ch * 2 for ch in h) if len(h) in (3, 4) else h


def _alpha_value(a):
    if a is None:
        return 1.0
    return float(a[:-1]) / 100 if a.endswith("%") else float(a)


def _map_rgba(r, g, b, alpha, brand_key):
    """Return new (r, g, b, alpha) 0..255 ints, or None to leave untouched."""
    if alpha == 0 or brand_key in BRAND_COLOURS:
        return None
    if max(r, g, b) <= 12 and alpha < 1:
        # Black veils: hairlines and shadows go navy, text veils go ink.
        return (26, 62, 112, alpha) if alpha <= 0.25 else (0, 22, 43, alpha)
    if (r, g, b) == (255, 255, 255):
        return None
    out = repaint(np.array([[r, g, b]], dtype=float) / 255)[0]
    return tuple(int(round(v * 255)) for v in out) + (alpha,)


class TextPainter:
    def __init__(self):
        self.cache = {}

    def hex(self, match):
        raw = match.group(1)
        key = raw.lower()
        if key not in self.cache:
            full = _expand(key)
            r, g, b = (int(full[i:i + 2], 16) for i in (0, 2, 4))
            alpha = int(full[6:8], 16) / 255 if len(full) == 8 else 1.0
            mapped = _map_rgba(r, g, b, alpha, full[:6])
            if mapped is None:
                self.cache[key] = None
            else:
                nr, ng, nb, na = mapped
                tail = "" if len(full) == 6 else f"{round(na * 255):02x}"
                self.cache[key] = f"{nr:02x}{ng:02x}{nb:02x}{tail}"
        new = self.cache[key]
        return match.group(0) if new is None else "#" + new

    def rgb(self, match):
        r, g, b = (int(match.group(i)) for i in (1, 2, 3))
        if max(r, g, b) > 255:
            return match.group(0)
        alpha = _alpha_value(match.group(4))
        mapped = _map_rgba(r, g, b, alpha, f"{r:02x}{g:02x}{b:02x}")
        if mapped is None:
            return match.group(0)
        nr, ng, nb, na = mapped
        if match.group(4) is None:
            return f"rgb({nr}, {ng}, {nb})"
        return f"rgba({nr}, {ng}, {nb}, {match.group(4)})"


FONT_DECL = re.compile(r'(font-family:\s*)([^;}\n]*?)(?=;|}|\n|\\n|$)')
FONT_PROP = re.compile(r'(fontFamily:\s*)(\\?["\'`])(.*?)(\2)')
INTER_VAR = re.compile(r'\\?"?\bInterVariable\b\\?"?\s*,\s*')
INTER = re.compile(r'\\?"?\bInter\b\\?"?')


def _swap_font(stack):
    return INTER.sub("Avenir Next,Avenir", INTER_VAR.sub("", stack))


def paint_text(text, painter):
    text = HEX.sub(painter.hex, text)
    text = RGB.sub(painter.rgb, text)
    text = FONT_DECL.sub(lambda m: m.group(1) + _swap_font(m.group(2)), text)
    text = FONT_PROP.sub(lambda m: m.group(1) + m.group(2) + _swap_font(m.group(3)) + m.group(4), text)
    return text


def paint_image(path):
    try:
        img = Image.open(path)
    except UnidentifiedImageError:
        return False  # the mirror saved a page under an image name; leave it
    img.load()
    mode = "RGBA" if "A" in img.getbands() else "RGB"
    arr = np.asarray(img.convert(mode)).astype(float) / 255
    rgb = arr[..., :3]
    # Each distinct colour is mapped once: previews are flat UI, few colours.
    flat = (rgb.reshape(-1, 3) * 255).round().astype(np.uint8)
    keys, inverse = np.unique(flat, axis=0, return_inverse=True)
    painted = repaint(keys.astype(float) / 255)
    rgb = painted[inverse.reshape(-1)].reshape(rgb.shape)
    out = np.concatenate([rgb, arr[..., 3:]], axis=-1) if mode == "RGBA" else rgb
    result = Image.fromarray((np.clip(out, 0, 1) * 255).round().astype(np.uint8))
    buffer = io.BytesIO()
    suffix = path.suffix.lower()
    if suffix == ".webp":
        result.save(buffer, "WEBP", quality=90, method=6)
    elif suffix == ".png":
        result.save(buffer, "PNG", optimize=True)
    else:
        result.save(buffer, "JPEG", quality=90, optimize=True)
    path.write_bytes(buffer.getvalue())
    return True


def main():
    site = Path(sys.argv[1] if len(sys.argv) > 1 else Path(__file__).resolve().parent.parent / "site")
    marker = site / MARKER
    if marker.exists():
        sys.exit(f"{site} is already repainted ({MARKER} present). Rebuild the mirror first.")
    if not (site / "index.html").is_file():
        sys.exit(f"{site} does not look like the mirror (no index.html).")

    painter = TextPainter()
    texts = images = 0
    for path in sorted(p for p in site.rglob("*") if p.is_file()):
        suffix = path.suffix.lower()
        if suffix in TEXT_SUFFIXES:
            before = path.read_text(encoding="utf-8")
            after = paint_text(before, painter)
            if suffix == ".json" and path.parent.name == "r":
                json.loads(after)  # registry items must stay valid JSON
            if after != before:
                path.write_text(after, encoding="utf-8")
                texts += 1
        elif suffix in IMAGE_SUFFIXES and path.relative_to(site).parts[0] in IMAGE_DIRS:
            images += paint_image(path)

    main_css = sorted((site / "assets").glob("index-*.css"))
    if len(main_css) != 1:
        sys.exit(f"Expected one main stylesheet, found {len(main_css)}.")
    with main_css[0].open("a", encoding="utf-8") as handle:
        handle.write(TOKENS)

    marker.write_text("Repainted in the TGV INOUI / A-Team design system by scripts/theme_team_ia.py\n", encoding="utf-8")
    print(f"Repainted {texts} text files and {images} images; tokens appended to {main_css[0].name}.")


if __name__ == "__main__":
    main()
