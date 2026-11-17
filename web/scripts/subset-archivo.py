"""Cuts Archivo into the two files the site serves (spec 013, RF-43; src/assets/fonts/README.md).

The file next/font used to download for the site was the whole Latin subset of the variable font:
weights 100 to 900, widths 62 to 125 and 230 characters, 90 KB. The site uses weights 400 to 800,
widths 100 and 125, and about half of those characters. On the first visit that file is the
largest thing a page waits for after its JavaScript.

    py -3 -m pip install fonttools brotli
    py -3 scripts/subset-archivo.py

It reads the two files of src/assets/fonts/source/ (both unchanged, as published) and writes:

- Archivo-site.woff2: the base file, the one every page loads. The characters of the site's texts
  plus all of Spanish. Cut from Archivo-latin-variable.woff2, the file Google Fonts serves for the
  Latin subset (cut from the whole font it comes out 5 KB heavier: more alternates survive).
- Archivo-ext.woff2: the rest of the Latin letters and signs the font has (ã, ç, è, ő, ...), cut
  from Archivo-variable.ttf, the whole font of google/fonts. Its @font-face rule carries a
  unicode-range, so a browser asks for it only on a page that shows one of those characters: a
  visitor who types "João" into the quote form, for instance. No text of the site may need it:
  a character the texts use and the base file lacks is left out of this file too, and is drawn
  with the system font, as it always was (e2e/fonts.spec.ts checks that no page asks for it).
- Archivo-site.json: the characters of each file and their unicode-range. src/lib/fonts.test.ts
  reads it and fails the build when a text of the site uses a character that is not in the base
  file, or when the ranges written in src/app/fonts.ts and src/app/globals.css are not these.

A file is written again only when its characters change, so running this twice changes nothing.
When the build fails for a lost character: run this, copy the two ranges it prints into
src/app/fonts.ts (base) and src/app/globals.css (extended), and commit.
"""

import io
import json
import sys
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

WEB = Path(__file__).resolve().parent.parent
FONTS = WEB / "src" / "assets" / "fonts"
LATIN_SOURCE = FONTS / "source" / "Archivo-latin-variable.woff2"
WHOLE_SOURCE = FONTS / "source" / "Archivo-variable.ttf"
BASE = FONTS / "Archivo-site.woff2"
EXTENDED = FONTS / "Archivo-ext.woff2"
REPORT = FONTS / "Archivo-site.json"

# The ranges of each axis the stylesheets ask for (font-weight 400 to 800, font-stretch 100% and 125%).
AXES = {"wght": (400, 800), "wdth": (100, 125)}

# Always in the base file, whatever the texts say today: printable ASCII, the letters and marks of
# Spanish, and the punctuation a text editor writes by itself. Whatever else the texts use is added.
#
# The letters of other languages are left for the extended file on purpose. Measured on
# 2026-11-17: this set is 40.5 KB; with the letters of Portuguese and French, 44.4 KB; with the
# whole Latin-1 block, 52.2 KB. Up to 42.9 KB the file arrives in two TCP flights on a new
# connection, and over that in three, as the 90 KB one did.
ALWAYS = set(range(0x20, 0x7F)) | {ord(char) for char in " ¡¿ªº«»·©®°áéíóúüñÁÉÍÓÚÜÑ–—‘’“”•…€™"}


def in_extended(code: int) -> bool:
    """Latin letters and the signs that go with them: Latin-1, Extended A and B, Extended Additional, punctuation, currency, arrows."""
    return code <= 0x024F or 0x1E00 <= code <= 0x1EFF or 0x2000 <= code <= 0x20CF or code in (0x2113, 0x2190, 0x2191, 0x2192, 0x2193, 0x2212, 0x2215)


def site_texts() -> str:
    """Every file a text of the site can come from, read whole: the code in them is ASCII."""
    files = [*sorted((WEB / "messages").glob("*.json")), *sorted((WEB / "src").rglob("*.ts")), *sorted((WEB / "src").rglob("*.tsx")), *sorted((WEB / "src").rglob("*.mdx"))]
    return "".join(io.open(path, encoding="utf-8").read() for path in files if ".test." not in path.name)


def unicode_range(codes: list[int]) -> str:
    """The characters as a CSS unicode-range: runs of consecutive code points joined."""
    out: list[str] = []
    start = previous = codes[0]
    for code in [*codes[1:], None]:
        if code is not None and code == previous + 1:
            previous = code
            continue
        out.append(f"U+{start:04X}" if start == previous else f"U+{start:04X}-{previous:04X}")
        if code is not None:
            start = previous = code
    return ", ".join(out)


def cut(source: Path, codes: list[int], output: Path) -> None:
    """A source font with only these characters and only the ranges of AXES, as woff2."""
    font = TTFont(source)
    options = subset.Options()
    options.layout_features = ["*"]
    options.name_IDs = ["*"]
    options.notdef_outline = True
    options.flavor = "woff2"
    subsetter = subset.Subsetter(options)
    subsetter.populate(unicodes=codes)
    subsetter.subset(font)
    instancer.instantiateVariableFont(font, AXES, inplace=True)
    font.flavor = "woff2"
    font.save(output)


def main() -> None:
    sys.stdout.reconfigure(encoding="utf-8")
    in_latin = {code for code in TTFont(LATIN_SOURCE).getBestCmap() if code >= 0x20}
    in_whole = {code for code in TTFont(WHOLE_SOURCE).getBestCmap() if code >= 0x20}
    # Titles and buttons are set in capitals by the stylesheet (text-transform), so each character
    # counts in both forms: a "ç" written in a title is drawn as "Ç".
    used = {ord(form) for char in site_texts() for form in (char + char.upper() + char.lower())}
    base = sorted((ALWAYS | used) & in_latin)
    # Not what the texts use: that is either in the base file or was never in the font the site served.
    extended = sorted({code for code in in_whole if in_extended(code)} - set(base) - used)

    before = json.loads(REPORT.read_text(encoding="utf-8")) if REPORT.exists() else {}
    as_text = lambda codes: "".join(chr(code) for code in codes)  # noqa: E731
    for source, codes, output, key in ((LATIN_SOURCE, base, BASE, "kept"), (WHOLE_SOURCE, extended, EXTENDED, "extended")):
        if before.get(key) == as_text(codes) and output.exists():
            print(f"{output.name}: unchanged, {output.stat().st_size} bytes, {len(codes)} characters")
            continue
        cut(source, codes, output)
        result = TTFont(output)
        axes = ", ".join(f"{axis.axisTag} {axis.minValue:g} to {axis.maxValue:g}" for axis in result["fvar"].axes)
        print(f"{output.name}: written, {output.stat().st_size} bytes, {len(codes)} characters, {len(result.getGlyphOrder())} glyphs, {axes}")

    report = {"kept": as_text(base), "extended": as_text(extended), "baseRange": unicode_range(base), "extendedRange": unicode_range(extended)}
    REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n")
    print(f"\nunicode-range of the base file (src/app/fonts.ts):\n{report['baseRange']}")
    print(f"\nunicode-range of the extended file (src/app/globals.css):\n{report['extendedRange']}")


if __name__ == "__main__":
    main()
