import type { LinePageContent } from "../types";

// Maqueta B-Linea-Desarrollo. English is provisional until the keywords are validated.
export const desarrollo: LinePageContent = {
  line: "desarrollo",
  kind: "service",
  hero: {
    titleLines: { es: ["Desarrollo web y"], en: ["Web development and"] },
    titleAccent: { es: "software a la medida.", en: "custom software." },
    text: {
      es: "Sitios web, tiendas online, aplicaciones web y software para tu empresa. Escuchamos cómo funciona tu negocio y construimos contigo la herramienta que necesita.",
      en: "Websites, online stores, web apps and software for your company. We listen to how your business works and build with you the tool it needs.",
    },
    cta: { es: "Cotizar proyecto", en: "Get a quote" },
    visual: "none",
  },
  strip: {
    label: { es: "Trabajamos con", en: "We work with" },
    items: {
      es: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Spring Boot", "PostgreSQL"],
      en: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Spring Boot", "PostgreSQL"],
    },
  },
  services: {
    title: { es: "Lo que podemos construir para tu empresa.", en: "What we can build for your company." },
    items: [
      {
        title: { es: "Sitios web", en: "Websites" },
        text: {
          es: "La presencia oficial de tu empresa: quién eres, qué ofreces y cómo contactarte. Rápido y fácil de encontrar en Google.",
          en: "Your company's official presence: who you are, what you offer and how to reach you. Fast and easy to find on Google.",
        },
      },
      {
        title: { es: "Tiendas online", en: "Online stores" },
        text: {
          es: "Catálogo, carrito y medios de pago en un solo lugar, para vender sin intermediarios.",
          en: "Catalog, cart and payment methods in one place, to sell without intermediaries.",
        },
        subpage: "/servicios/desarrollo/tiendas-online",
      },
      {
        title: { es: "Aplicaciones web", en: "Web applications" },
        text: {
          es: "Plataformas a las que tus clientes o tu equipo entran con su cuenta para reservar, gestionar o hacer seguimiento.",
          en: "Platforms your customers or your team sign in to with their own account to book, manage or track.",
        },
      },
      {
        title: { es: "Software a la medida", en: "Custom software" },
        text: {
          es: "Sistemas internos para inventario, facturación o logística, construidos alrededor de cómo opera tu empresa.",
          en: "Internal systems for inventory, invoicing or logistics, built around how your company operates.",
        },
        subpage: "/servicios/desarrollo/software-a-la-medida",
      },
      {
        title: { es: "Mejora y rediseño", en: "Improvement and redesign" },
        text: {
          es: "Diagnosticamos tu sitio actual y definimos si conviene optimizarlo, reestructurarlo o reconstruirlo.",
          en: "We assess your current site and define whether it is best to optimize, restructure or rebuild it.",
        },
      },
    ],
    note: {
      es: "También desarrollamos aplicaciones móviles. Cuéntanos tu proyecto y definimos si conviene una app móvil o una aplicación web.",
      en: "We also develop mobile apps. Tell us about your project and we define whether a mobile app or a web application fits best.",
    },
  },
  chooser: {
    title: { es: "Depende de lo que tu cliente necesita hacer.", en: "It depends on what your customer needs to do." },
    options: [
      {
        condition: { es: "Si tu cliente quiere", en: "If your customer wants to" },
        need: { es: "Informarse", en: "Find out" },
        answer: { es: "Sitio web", en: "Website" },
        text: { es: "Quien llega quiere conocerte y contactarte.", en: "Visitors want to know you and get in touch." },
      },
      {
        condition: { es: "Si tu cliente quiere", en: "If your customer wants to" },
        need: { es: "Comprar", en: "Buy" },
        answer: { es: "Tienda online", en: "Online store" },
        text: {
          es: "Quien llega quiere elegir y pagar sin asesoría previa.",
          en: "Visitors want to choose and pay without prior advice.",
        },
      },
      {
        condition: { es: "Si tu cliente quiere", en: "If your customer wants to" },
        need: { es: "Operar con su cuenta", en: "Work from their account" },
        answer: { es: "Aplicación web", en: "Web application" },
        text: {
          es: "Quien entra necesita reservar, gestionar o consultar.",
          en: "People who sign in need to book, manage or look things up.",
        },
      },
      {
        condition: { es: "Si tu equipo necesita", en: "If your team needs to" },
        need: { es: "Ordenar sus procesos", en: "Organize its processes" },
        answer: { es: "Software a la medida", en: "Custom software" },
        text: {
          es: "Inventario, facturación o logística en una sola herramienta.",
          en: "Inventory, invoicing or logistics in a single tool.",
        },
      },
    ],
  },
  deliverables: {
    title: { es: "Listo para crecer contigo.", en: "Ready to grow with you." },
    items: [
      { es: "Diseño adaptado a celular, tablet y computador.", en: "Design adapted to phone, tablet and computer." },
      { es: "Velocidad y SEO técnico desde el primer día.", en: "Speed and technical SEO from day one." },
      {
        es: "Publicación en tu dominio, con accesos y documentación.",
        en: "Published on your domain, with access credentials and documentation.",
      },
      { es: "El código fuente de tu proyecto.", en: "The source code of your project." },
      { es: "30 días de garantía sobre nuestro trabajo.", en: "A 30-day warranty on our work." },
    ],
  },
  processFirstStep: {
    es: "Escuchamos tu idea y qué quieres lograr con tu proyecto.",
    en: "We listen to your idea and what you want to achieve with your project.",
  },
  faq: {
    title: { es: "Sobre tu proyecto.", en: "About your project." },
    items: [
      {
        id: "mejorar-sitio",
        question: { es: "¿Pueden mejorar el sitio que ya tengo?", en: "Can you improve the site I already have?" },
        answer: {
          es: "Sí. Hacemos un diagnóstico de lo que existe y definimos si conviene optimizarlo, reestructurarlo o reconstruirlo. La recomendación y su alcance quedan claros antes de cotizar.",
          en: "Yes. We assess what exists and define whether it is best to optimize, restructure or rebuild it. The recommendation and its scope are clear before quoting.",
        },
      },
      {
        id: "celulares",
        question: { es: "¿Funciona bien en celulares?", en: "Does it work well on phones?" },
        answer: {
          es: "Sí. Todo lo que desarrollamos se diseña primero para celular y se adapta a tablet y computador.",
          en: "Yes. Everything we develop is designed for phones first and adapts to tablet and computer.",
        },
      },
      {
        id: "apps-moviles",
        question: { es: "¿Desarrollan aplicaciones móviles?", en: "Do you develop mobile apps?" },
        answer: {
          es: "Sí. Antes de cotizar definimos contigo si conviene una aplicación móvil o una aplicación web, que funciona en cualquier dispositivo sin necesidad de descargarla.",
          en: "Yes. Before quoting we define with you whether a mobile app or a web application fits best; a web application works on any device without downloading it.",
        },
      },
      {
        id: "codigo-fuente",
        question: { es: "¿Recibo el código fuente?", en: "Do I receive the source code?" },
        answer: {
          es: "Sí. Al finalizar recibes el proyecto publicado y funcionando, junto con su código fuente.",
          en: "Yes. At the end you receive the project published and working, together with its source code.",
        },
      },
    ],
  },
  meta: {
    title: {
      es: "Desarrollo web y software a la medida — Kardenum",
      en: "Web development and custom software — Kardenum",
    },
    description: {
      es: "Sitios web, tiendas online, aplicaciones web y software a la medida, con el código fuente incluido y 30 días de garantía. Cotiza tu proyecto.",
      en: "Websites, online stores, web applications and custom software, with the source code included and a 30-day warranty. Get a quote for your project.",
    },
    og: {
      es: { label: "I · Desarrollo", lines: ["Desarrollo web y"], accent: "software a la medida." },
      en: { label: "I · Development", lines: ["Web development and"], accent: "custom software." },
    },
  },
};
