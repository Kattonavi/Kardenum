import type { SubpageContent } from "../types";

// Maqueta B-Sub-Software. English is provisional until the keywords are validated.
export const softwareALaMedida: SubpageContent = {
  id: "software-a-la-medida",
  pathname: "/servicios/desarrollo/software-a-la-medida",
  line: "desarrollo",
  hero: {
    titleLines: { es: ["Software"], en: ["Custom"] },
    titleAccent: { es: "a la medida.", en: "software." },
    titleBeside: { es: "Software a la medida.", en: "Custom software." },
    text: {
      es: "Sistemas construidos alrededor de cómo opera tu empresa. Escuchamos tus procesos y reemplazamos hojas de cálculo y tareas manuales por una sola herramienta confiable.",
      en: "Systems built around how your company operates. We listen to your processes and replace spreadsheets and manual tasks with one reliable tool.",
    },
    cta: { es: "Cotizar software", en: "Get a software quote" },
  },
  offer: {
    title: { es: "Tu operación, en una sola herramienta.", en: "Your operation, in a single tool." },
    items: [
      {
        title: { es: "Inventario y logística", en: "Inventory and logistics" },
        text: {
          es: "Control de existencias, despachos y entregas, con la información al día.",
          en: "Control of stock, shipments and deliveries, with up-to-date information.",
        },
      },
      {
        title: { es: "Ventas y caja", en: "Sales and cash register" },
        text: {
          es: "Registro de ventas, cierres de caja y cuentas, sin hojas sueltas.",
          en: "Sales records, cash closings and accounts, without loose spreadsheets.",
        },
      },
      {
        title: { es: "Paneles y reportes", en: "Dashboards and reports" },
        text: {
          es: "La información de tu operación en un solo lugar, para decidir con datos.",
          en: "Your operation's information in one place, so you can decide with data.",
        },
      },
      {
        title: { es: "Integraciones", en: "Integrations" },
        text: {
          es: "Conectamos tu sistema con tu tienda, tu sitio web u otras herramientas que ya usas.",
          en: "We connect your system with your store, your website or other tools you already use.",
        },
      },
    ],
  },
  deliverables: {
    title: { es: "Listo para que tu equipo lo use.", en: "Ready for your team to use." },
    items: [
      {
        es: "El sistema funcionando, con usuarios y permisos para tu equipo.",
        en: "The system up and running, with users and permissions for your team.",
      },
      { es: "Documentación para usarlo y mantenerlo.", en: "Documentation to use and maintain it." },
      { es: "El código fuente de tu proyecto.", en: "The source code of your project." },
      { es: "30 días de garantía sobre nuestro trabajo.", en: "A 30-day warranty on our work." },
    ],
    chips: {
      label: { es: "Trabajamos con", en: "We work with" },
      items: ["Next.js", "TypeScript", "Spring Boot", "PostgreSQL"],
    },
  },
  process: [
    {
      title: { es: "Nos cuentas", en: "You tell us" },
      text: {
        es: "Escuchamos cómo trabaja tu empresa y qué quieres resolver.",
        en: "We listen to how your company works and what you want to solve.",
      },
    },
    {
      title: { es: "Cotización", en: "Quote" },
      text: {
        es: "Revisamos los requerimientos y te enviamos una propuesta a la medida.",
        en: "We review the requirements and send you a proposal made to fit.",
      },
    },
    {
      title: { es: "Producción", en: "Production" },
      text: {
        es: "Trabajamos con revisiones hasta dejarlo listo.",
        en: "We work with rounds of revisions until it is ready.",
      },
    },
    {
      title: { es: "Entrega", en: "Delivery" },
      text: {
        es: "Recibes el proyecto listo para usar y respaldado por 30 días de garantía.",
        en: "You receive the project ready to use and backed by a 30-day warranty.",
      },
    },
  ],
  works: { title: { es: "Sistemas que hemos construido.", en: "Systems we have built." } },
  faq: {
    title: { es: "Sobre tu sistema.", en: "About your system." },
    items: [
      {
        id: "software-hojas-de-calculo",
        question: {
          es: "¿Pueden reemplazar las hojas de cálculo que usamos hoy?",
          en: "Can you replace the spreadsheets we use today?",
        },
        answer: {
          es: "Sí. Partimos de cómo trabajan hoy y llevamos esa información a un sistema que evita errores y trabajo repetido.",
          en: "Yes. We start from how you work today and move that information into a system that avoids errors and repeated work.",
        },
      },
      {
        id: "software-celular",
        question: { es: "¿Funciona desde el celular?", en: "Does it work from a phone?" },
        answer: {
          es: "Sí. Se usa desde el navegador en computador, tablet o celular, sin instalar nada.",
          en: "Yes. It runs in the browser on a computer, tablet or phone, with nothing to install.",
        },
      },
      {
        id: "software-codigo-fuente",
        question: { es: "¿Recibo el código fuente?", en: "Do I receive the source code?" },
        answer: {
          es: "Sí. Al finalizar recibes el sistema funcionando, junto con su código fuente.",
          en: "Yes. At the end you receive the working system, together with its source code.",
        },
      },
    ],
  },
  related: {
    title: { es: "También para tu empresa.", en: "Also for your company." },
    items: [
      { line: "desarrollo", name: { es: "Aplicaciones web", en: "Web applications" }, pathname: "/servicios/desarrollo" },
      {
        line: "desarrollo",
        name: { es: "Tiendas online", en: "Online stores" },
        pathname: "/servicios/desarrollo/tiendas-online",
      },
      { line: "desarrollo", name: { es: "Sitios web", en: "Websites" }, pathname: "/servicios/desarrollo" },
      {
        line: "desarrollo",
        name: { es: "Mejora y rediseño", en: "Improvement and redesign" },
        pathname: "/servicios/desarrollo",
      },
    ],
  },
  meta: {
    title: {
      es: "Desarrollo de software a la medida — Kardenum",
      en: "Custom software development — Kardenum",
    },
    description: {
      es: "Desarrollo de software a la medida: inventario, ventas, paneles e integraciones que reemplazan hojas de cálculo, con código fuente. Pide tu cotización.",
      en: "Custom software development: inventory, sales, dashboards and integrations that replace spreadsheets, with source code included. Get a quote.",
    },
    og: {
      es: { label: "Desarrollo · Software", lines: ["Software"], accent: "a la medida." },
      en: { label: "Development · Software", lines: ["Custom"], accent: "software." },
    },
  },
};
