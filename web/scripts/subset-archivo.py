"""Cuts Archivo down to what the site draws (spec 013, RF-40; src/assets/fonts/README.md).

The file next/font used to download for the site was the whole Latin subset of the variable font:
weights 100 to 900, widths 62 to 125 and 230 characters, 90 KB. The site uses weights 400 to 800,
widths 100 and 125, and about half of those characters. On the first visit that file is the
largest thing a page waits for after its JavaScript.

    py -3 -m pip install fonttools brotli
    py -3 scripts/subset-archivo.py

It reads src/assets/fonts/source/Archivo-latin-variable.woff2 (the file Google Fonts serves for the
Latin subset, unchanged) and writes Archivo-site.woff2 and Archivo-site.json next to it. The JSON
lists the characters kept and the ones the source had: src/lib/fonts.test.ts fails the build when a
text of the site uses a character that the source font has and the cut one lost. Run this again
then, and commit the three files.
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
SOURCE = FONTS / "source" / "Archivo-latin-variable.woff2"
OUTPUT = FONTS / "Archivo-site.woff2"
REPORT = FONTS / "Archivo-site.json"

# The ranges of each axis the stylesheets ask for (font-weight 400 to 800, font-stretch 100% and 125%).
AXES = {"wght": (400, 800), "wdth": (100, 125)}

# Always kept, whatever the texts say today: printable ASCII, the letters and marks of Spanish, and
# the punctuation a text editor writes by itself. Whatever else the texts use is added to these.
#
# What is left out on purpose: the letters of other languages (ã, ç, è, ö...). A visitor who types
# "João" into the quote form sees that one letter in the system font; the texts of the site never
# do, because the build fails first. Measured on 2026-11-17: this set is 40.6 KB; with the letters
# of Portuguese and French, 44.4 KB; with the whole Latin-1 block, 52.2 KB. Up to 42.9 KB the file
# arrives in two TCP flights on a new connection, and over that in three, as the 90 KB one did.
ALWAYS = set(range(0x20, 0x7F)) | {ord(char) for char in " ¡¿ªº«»·©®°áéíóúüñÁÉÍÓÚÜÑ–—‘’“”•…€™"}


def site_texts() -> str:
    """Every file a text of the site can come from, read whole: the code in them is ASCII."""
    files = [*sorted((WEB / "messages").glob("*.json")), *sorted((WEB / "src").rglob("*.ts")), *sorted((WEB / "src").rglob("*.tsx")), *sorted((WEB / "src").rglob("*.mdx"))]
    return "".join(io.open(path, encoding="utf-8").read() for path in files if ".test." not in path.name)


def main() -> None:
    font = TTFont(SOURCE)
    in_source = set(font.getBestCmap())
    # Titles and buttons are set in capitals by the stylesheet (text-transform), so each character
    # counts in both forms: a "ç" written in a title is drawn as "Ç".
    used = {ord(form) for char in site_texts() for form in (char + char.upper() + char.lower())}
    kept = sorted((ALWAYS | used) & in_source)

    instancer.instantiateVariableFont(font, AXES, inplace=True)
    options = subset.Options()
    options.layout_features = ["*"]
    options.name_IDs = ["*"]
    options.notdef_outline = True
    options.flavor = "woff2"
    subsetter = subset.Subsetter(options)
    subsetter.populate(unicodes=kept)
    subsetter.subset(font)
    font.flavor = "woff2"
    font.save(OUTPUT)

    REPORT.write_text(
        json.dumps({"kept": "".join(chr(code) for code in kept), "source": "".join(chr(code) for code in sorted(in_source) if code >= 0x20)}, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
        newline="\n",
    )
    result = TTFont(OUTPUT)
    axes = ", ".join(f"{axis.axisTag} {axis.minValue:g} to {axis.maxValue:g}" for axis in result["fvar"].axes)
    sys.stdout.reconfigure(encoding="utf-8")
    print(f"{SOURCE.name}: {SOURCE.stat().st_size} bytes, {len(in_source)} characters")
    print(f"{OUTPUT.name}: {OUTPUT.stat().st_size} bytes, {len(kept)} characters, {len(result.getGlyphOrder())} glyphs, {axes}")


if __name__ == "__main__":
    main()
