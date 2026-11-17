// The pages Lighthouse CI measures after each deployment, in the order it measures them
// (lighthouserc.cjs). scripts/warm-up.mjs asks for each one, in the same order, before measuring.
//
// One page of each kind: home in both languages, the services index, a line page, the questions
// page in both languages (the longest document of the site; spec 013, RF-41), about, contact
// (with the quote form) and a legal page.
module.exports = ["/", "/en", "/servicios", "/servicios/minecraft", "/preguntas-frecuentes", "/en/faq", "/nosotros", "/contacto", "/legal/privacidad"];
