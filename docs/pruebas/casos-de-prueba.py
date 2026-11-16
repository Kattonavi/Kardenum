"""Scratch clone only. Usage: flags5b_patch.py <web dir> flag|fixtures
flag: turn features.portfolio on. fixtures: add three fake cases (reserved, named, private) so every line has a piece."""
import sys
from pathlib import Path

web, what = Path(sys.argv[1]), sys.argv[2]

if what == "flag":
    config = web / "src" / "site.config.ts"
    source = config.read_text(encoding="utf-8")
    assert source.count("portfolio: false") == 1
    config.write_text(source.replace("portfolio: false", "portfolio: true"), encoding="utf-8", newline="")
    print("features.portfolio = true")
else:
    (web / "src" / "content" / "cases" / "fixtures.ts").write_text(
        '''import type { PortfolioCase } from "../types";

const visual = { kind: "mark", alt: { es: "Símbolo de prueba", en: "Test mark" } } as const;

export const reservedCase: PortfolioCase = {
  id: "video-de-prueba",
  visibilidad: "reservado",
  client: { kind: "reserved" },
  slug: { es: "video-de-prueba", en: "test-video" },
  name: "Proyecto de prueba",
  summary: { es: "Pieza de video de prueba.", en: "Test video piece." },
  cardText: { es: "Pieza de video de prueba", en: "Test video piece" },
  lines: ["video"],
  year: 2026,
  cover: visual,
  hero: visual,
  challenge: { es: "Reto de prueba del caso reservado.", en: "Test challenge of the reserved case." },
  work: [{ es: "Primera tarea de prueba.", en: "First test task." }],
  result: { es: "Resultado de prueba.", en: "Test result." },
  pieces: [],
  meta: {
    title: { es: "Proyecto de prueba reservado — Kardenum", en: "Reserved test project — Kardenum" },
    description: {
      es: "Caso de prueba reservado para comprobar la plantilla del portafolio con un cliente cuyo nombre no se muestra. No es un caso real del estudio.",
      en: "Reserved test case used to check the portfolio template with a client whose name is not shown. It is not a real case of the studio.",
    },
  },
};

export const namedCase: PortfolioCase = {
  id: "bot-de-prueba",
  visibilidad: "publico",
  client: { kind: "named", name: "Cliente Ficticio" },
  slug: { es: "bot-de-prueba", en: "test-bot" },
  name: "Bot de prueba",
  summary: { es: "Bot de Discord de prueba.", en: "Test Discord bot." },
  cardText: { es: "Bot de Discord de prueba", en: "Test Discord bot" },
  lines: ["discord"],
  year: 2026,
  cover: visual,
  hero: visual,
  challenge: { es: "Reto de prueba del caso con nombre.", en: "Test challenge of the named case." },
  work: [{ es: "Tarea de prueba.", en: "Test task." }],
  result: { es: "Resultado de prueba del bot.", en: "Test result of the bot." },
  pieces: [],
  meta: {
    title: { es: "Bot de prueba con cliente — Kardenum", en: "Test bot with a client — Kardenum" },
    description: {
      es: "Caso de prueba con cliente nombrado para comprobar la plantilla del portafolio con un proyecto público. No es un caso real del estudio.",
      en: "Test case with a named client used to check the portfolio template with a public project. It is not a real case of the studio at all.",
    },
  },
};

export const privateCase: PortfolioCase = { visibilidad: "privado", id: "secreto-zeta", lines: ["video"], year: 2026 };
''',
        encoding="utf-8",
        newline="",
    )
    index = web / "src" / "content" / "cases" / "index.ts"
    source = index.read_text(encoding="utf-8")
    old = "export const portfolioCases: readonly PortfolioCase[] = [kardenumCase, kaelionCase];"
    assert source.count(old) == 1
    source = source.replace(old, "export const portfolioCases: readonly PortfolioCase[] = [kardenumCase, kaelionCase, reservedCase, namedCase, privateCase];")
    source = source.replace('import { kaelionCase } from "./kaelion";', 'import { namedCase, privateCase, reservedCase } from "./fixtures";\nimport { kaelionCase } from "./kaelion";')
    index.write_text(source, encoding="utf-8", newline="")
    print("fixtures added: reserved (video), named (discord), private")
