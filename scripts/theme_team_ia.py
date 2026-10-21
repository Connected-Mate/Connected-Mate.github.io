#!/usr/bin/env python3
"""Repaint the static mirror in the A-Team design system (IA Innovation team).

The site itself stays exactly as the original: its pages, header, sidebar and
typeface are untouched. Only the COMPONENTS are dressed (the demo modules, the
registry code and the raster previews that show them), plus one stylesheet,
/ateam/composants.css, generated from their own CSS by theme/composants.py. Reference: the Vibe Creators hub
("Osmose", css/hub-osmose.css in the programme repo) — its sign-in page, the
account pages and the programme e-mails. Light objects on a tinted, gridded
ground (#eaeff6), each with a 1px hairline and a navy-tinted shadow; a navy
vitrine (#16345c → #0f2747); berry #851437 primary buttons, 12px corners;
Avenir Next Condensed bold titles in sentence case, ink #00162B.

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
import subprocess
import sys
from pathlib import Path

import numpy as np
from PIL import Image, UnidentifiedImageError

MARKER = ".theme-team-ia"
TEXT_SUFFIXES = {".css", ".js", ".json", ".svg", ".html", ".webmanifest"}
IMAGE_DIRS = ("previews", "illustrations")  # component pictures only: not the landing, people or covers
# The modules that hold the components (both styles), and the registry code people copy.
COMPONENT_ASSETS = re.compile(r"^(demo|component|docs)[.-]")
IMAGE_SUFFIXES = {".webp", ".png", ".jpg", ".jpeg"}

NEUTRAL_HUE = 258.0  # bleu nuit #1a3e70
BLUE_HUE = 255.0     # bleu charrette / bleu ciel
BERRY_HUE = 8.0      # hub berry #851437
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

THEME_DIR = Path(__file__).resolve().parent / "theme"
# The component layer, served from /ateam/.
THEME_FILES = ("composants.css",)
HEAD_TAGS = '<link rel="stylesheet" href="/ateam/composants.css">\n  '



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
    newL = np.where(berry & (L < 0.75), np.minimum(L, 0.42), newL)
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


def is_component(path, site):
    """A component's own file: a demo/component module, or a registry item (the code people copy)."""
    parts = path.relative_to(site).parts
    if parts[0] == "assets":
        return bool(COMPONENT_ASSETS.match(path.name))
    return parts[0] == "r" and path.suffix == ".json"


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
        if suffix in TEXT_SUFFIXES and is_component(path, site):
            before = path.read_text(encoding="utf-8")
            after = paint_text(before, painter)
            if suffix == ".json" and path.parent.name == "r":
                json.loads(after)  # registry items must stay valid JSON
            if after != before:
                path.write_text(after, encoding="utf-8")
                texts += 1
        elif suffix in IMAGE_SUFFIXES and path.relative_to(site).parts[0] in IMAGE_DIRS:
            images += paint_image(path)

    # The components' own layer is read from the repainted assets, so it is generated now.
    subprocess.run([sys.executable, str(THEME_DIR / "composants.py"), str(site)], check=True)

    out = site / "ateam"
    out.mkdir(exist_ok=True)
    for name in THEME_FILES:
        (out / name).write_bytes((THEME_DIR / name).read_bytes())
    pages = 0
    for page in sorted(site.rglob("*.html")):
        html = page.read_text(encoding="utf-8")
        if "</head>" not in html or "/ateam/composants.css" in html:
            continue
        page.write_text(html.replace("</head>", HEAD_TAGS + "</head>", 1), encoding="utf-8")
        pages += 1

    marker.write_text("Repainted in the A-Team design system by scripts/theme_team_ia.py\n", encoding="utf-8")
    print(f"Repainted {texts} text files and {images} images; component layer linked from {pages} pages.")


if __name__ == "__main__":
    main()
