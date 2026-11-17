// The pages Lighthouse CI measures, in the order it measures them (lighthouserc.cjs).
// scripts/warm-up.mjs asks for each one, in the same order, before measuring.
//
// The complete check (by hand, required before the launch) measures one page of each kind: home
// in both languages, the services index, a line page, the questions page in both languages (the
// longest document of the site; spec 013, RF-41), about, contact (with the quote form) and a
// legal page.
const complete = ["/", "/en", "/servicios", "/servicios/minecraft", "/preguntas-frecuentes", "/en/faq", "/nosotros", "/contacto", "/legal/privacidad"];

// The short check, after every deployment (LHCI_PAGES=short; spec 013, RF-46): the home page, a
// page with a scene beside its title and the longest document. The three that have been closest
// to the minimum.
const short = ["/", "/servicios/minecraft", "/preguntas-frecuentes"];

module.exports = process.env.LHCI_PAGES === "short" ? short : complete;
