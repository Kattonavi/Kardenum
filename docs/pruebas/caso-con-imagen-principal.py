"""Scratch clone only: give the fake named case a real main picture, so the `priority` branch of the image
component is rendered. Usage: fixture_hero.py <web dir> <image file>"""
import shutil
import sys
from pathlib import Path

web, image = Path(sys.argv[1]), Path(sys.argv[2])
assets = web / "src" / "assets" / "cases" / "bot-de-prueba"
assets.mkdir(parents=True, exist_ok=True)
shutil.copyfile(image, assets / "principal-de-prueba.webp")

registry = web / "src" / "components" / "portfolio" / "case-images.ts"
source = registry.read_text(encoding="utf-8")
old = "export const caseImages: Readonly<Record<string, StaticImageData>> = {};"
assert source.count(old) == 1
source = source.replace(old, 'export const caseImages: Readonly<Record<string, StaticImageData>> = { "bot-de-prueba-principal": botDePruebaPrincipal };')
source = source.replace('import type { StaticImageData } from "next/image";', 'import type { StaticImageData } from "next/image";\nimport botDePruebaPrincipal from "@/assets/cases/bot-de-prueba/principal-de-prueba.webp";')
registry.write_text(source, encoding="utf-8", newline="")

fixtures = web / "src" / "content" / "cases" / "fixtures.ts"
source = fixtures.read_text(encoding="utf-8")
# The named case is the second one that uses `hero: visual,`.
head, sep, tail = source.rpartition("  hero: visual,\n")
assert sep, "fixtures.ts not found or changed"
source = head + '  hero: { kind: "image", image: "bot-de-prueba-principal", alt: { es: "Imagen principal de prueba", en: "Test main picture" } },\n' + tail
fixtures.write_text(source, encoding="utf-8", newline="")
print("hero picture added to the fake named case")
