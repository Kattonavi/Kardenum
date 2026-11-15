// Titles and H1s against the keyword map of docs/handoff/docs/seo-sitio.md §1 (candidates, still to be
// validated by the founder). It only reports; it changes nothing and fails nothing.
//   node --import ./scripts/test-register.mjs scripts/seo-audit.mjs
import { linePages } from "@/content/lines";
import { getPageMeta } from "@/content/pages";
import { locales } from "@/i18n/locales";

// seo-sitio.md §1, "Mapa de palabras clave": only the pages that exist today.
const KEYWORDS = {
  "/": { es: ["estudio de desarrollo, diseño y video"], en: ["software, design and video studio"] },
  "/servicios/desarrollo": { es: ["desarrollo de páginas web", "diseño de páginas web a la medida"], en: ["web development studio", "custom website development"] },
  "/servicios/diseno": { es: ["diseño de identidad visual", "diseño de marca"], en: ["brand identity design"] },
  "/servicios/video": { es: ["edición de video", "animación 2D"], en: ["motion graphics services", "video editing services"] },
  "/servicios/minecraft": { es: ["desarrollo de plugins de minecraft"], en: ["minecraft plugin development", "custom minecraft plugins"] },
  "/servicios/discord": { es: ["bots de discord a medida"], en: ["custom discord bot development"] },
};
const LINE_OF = { "/servicios/desarrollo": "desarrollo", "/servicios/diseno": "diseno", "/servicios/video": "video", "/servicios/minecraft": "minecraft", "/servicios/discord": "discord" };

const plain = (text) => text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const where = (text, keyword) => {
  const position = plain(text).indexOf(plain(keyword));
  return position === 0 ? "al inicio" : position > 0 ? "dentro" : "no";
};

for (const [pathname, keywords] of Object.entries(KEYWORDS)) {
  const meta = getPageMeta(pathname);
  const line = LINE_OF[pathname] ? linePages[LINE_OF[pathname]] : null;
  for (const locale of locales) {
    const h1 = line ? [...line.hero.titleLines[locale], line.hero.titleAccent[locale]].join(" ") : "(inicio: título de la maqueta)";
    console.log(`\n${pathname} [${locale}]`);
    console.log(`  título: ${meta.title[locale]}`);
    console.log(`  h1:     ${h1}`);
    for (const keyword of keywords[locale]) {
      console.log(`  "${keyword}" -> título: ${where(meta.title[locale], keyword)} · h1: ${line ? where(h1, keyword) : "—"}`);
    }
  }
}
