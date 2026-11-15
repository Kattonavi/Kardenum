import type { Faq, ProcessStep } from "./types";

/** How we work, in four steps (texts approved in docs/handoff/docs/textos-sitio.md). */
export const processSteps: readonly ProcessStep[] = [
  {
    number: "01",
    title: { es: "Nos cuentas", en: "You tell us" },
    text: {
      es: "Escuchamos tu idea y qué quieres lograr.",
      en: "We listen to your idea and what you want to achieve.",
    },
  },
  {
    number: "02",
    title: { es: "Cotización", en: "Quote" },
    text: {
      es: "Revisamos los requerimientos y te enviamos una propuesta a la medida.",
      en: "We review the requirements and send you a proposal made to fit.",
    },
  },
  {
    number: "03",
    title: { es: "Producción", en: "Production" },
    text: {
      es: "Trabajamos con revisiones hasta dejarlo listo.",
      en: "We work in review rounds until it is ready.",
    },
  },
  {
    number: "04",
    title: { es: "Entrega", en: "Delivery" },
    text: {
      es: "Recibes el proyecto listo para usar y respaldado por 30 días de garantía.",
      en: "You receive the project ready to use, backed by a 30-day warranty.",
    },
  },
];

/**
 * General questions, shown on the home page (approved in docs/handoff/docs/plan-sitio-web.md §4).
 * Prices, deadlines and payments are not here: they are defined with each client in the quote.
 */
export const homeFaqs: readonly Faq[] = [
  {
    id: "sitio-web",
    question: { es: "¿Qué es un sitio web?", en: "What is a website?" },
    answer: {
      es: "Es la presencia oficial de tu empresa en internet. Presenta quién eres, qué ofreces y por qué elegirte, y convierte esa primera impresión en un contacto. Es el punto de partida para toda empresa que necesita ser encontrada y tomada en serio.",
      en: "It is your company's official presence on the internet. It presents who you are, what you offer and why to choose you, and turns that first impression into a contact. It is the starting point for any company that needs to be found and taken seriously.",
    },
  },
  {
    id: "tienda-online",
    question: { es: "¿Qué es una tienda online?", en: "What is an online store?" },
    answer: {
      es: "Es un sitio web preparado para vender. Reúne catálogo, carrito y medios de pago en un mismo lugar, de modo que tu cliente puede comprar en cualquier momento y sin intermediarios. Es la opción indicada cuando el producto se puede elegir y pagar sin asesoría previa.",
      en: "It is a website built to sell. It brings catalog, cart and payment methods together in one place, so your customer can buy at any time and without intermediaries. It is the right choice when the product can be chosen and paid for without prior advice.",
    },
  },
  {
    id: "aplicacion-web",
    question: { es: "¿Qué es una aplicación web?", en: "What is a web application?" },
    answer: {
      es: "Es una plataforma que funciona desde el navegador y a la que cada persona entra con su propia cuenta. No está hecha para informar, sino para operar: reservar, gestionar, consultar o hacer seguimiento. Es la opción indicada cuando tus clientes o tu equipo necesitan hacer algo, y no solo leer.",
      en: "It is a platform that runs in the browser, where each person signs in with their own account. It is not made to inform but to operate: booking, managing, looking things up or tracking. It is the right choice when your customers or your team need to do something, not just read.",
    },
  },
  {
    id: "software-a-la-medida",
    question: { es: "¿Qué es un software a la medida?", en: "What is custom software?" },
    answer: {
      es: "Es un sistema construido alrededor de la forma en que opera tu empresa, y no al revés. Ordena procesos internos como inventario, facturación o logística, y reemplaza hojas de cálculo y tareas manuales por una sola herramienta confiable. Es la opción indicada cuando ningún programa del mercado se ajusta a tu operación.",
      en: "It is a system built around the way your company operates, not the other way around. It organizes internal processes such as inventory, invoicing or logistics, and replaces spreadsheets and manual tasks with a single reliable tool. It is the right choice when no off-the-shelf program fits your operation.",
    },
  },
  {
    id: "que-necesito",
    question: {
      es: "No tengo claro qué necesito. ¿Me pueden ayudar?",
      en: "I am not sure what I need. Can you help me?",
    },
    answer: {
      es: "Sí, y es lo habitual. Antes de proponer una solución entendemos el objetivo de tu empresa. A partir de ahí recomendamos el tipo de proyecto que realmente conviene, aunque resulte más sencillo de lo que tenías en mente.",
      en: "Yes, and that is the usual case. Before proposing a solution we understand your company's goal. From there we recommend the type of project that truly fits, even if it turns out simpler than what you had in mind.",
    },
  },
  {
    id: "mejorar-sitio",
    question: {
      es: "Ya tengo un sitio web. ¿Lo pueden mejorar?",
      en: "I already have a website. Can you improve it?",
    },
    answer: {
      es: "Sí. Hacemos un diagnóstico de lo que existe y definimos si conviene optimizarlo, reestructurarlo o reconstruirlo. La recomendación y su alcance quedan claros antes de cotizar.",
      en: "Yes. We assess what exists and define whether it is best to optimize, restructure or rebuild it. The recommendation and its scope are clear before quoting.",
    },
  },
  {
    id: "garantia",
    question: { es: "¿Qué cubre la garantía?", en: "What does the warranty cover?" },
    answer: {
      es: "Todo proyecto tiene 30 días de garantía. En ese periodo corregimos sin costo cualquier falla atribuible a nuestro trabajo. Las fallas de origen externo también se atienden, mediante una cotización nueva.",
      en: "Every project has a 30-day warranty. During that period we fix, at no cost, any fault attributable to our work. Faults of external origin are also handled, through a new quote.",
    },
  },
];
