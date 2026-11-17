import type { LinePageContent } from "../types";

// Maqueta B-Linea-Diseno. English is provisional until the keywords are validated.
export const diseno: LinePageContent = {
  line: "diseno",
  kind: "service",
  hero: {
    titleLines: { es: ["Identidad visual"], en: ["Brand identity"] },
    titleAccent: { es: "y diseño gráfico.", en: "and graphic design." },
    titleBeside: { es: "Identidad visual / y diseño gráfico.", en: "Brand identity and / graphic design." },
    text: {
      es: "Logos, identidad de marca, presentaciones, catálogos y piezas para tus campañas. Entendemos lo que quieres transmitir y lo convertimos en una imagen que tus clientes reconocen.",
      en: "Logos, brand identity, presentations, catalogs and pieces for your campaigns. We understand what you want to convey and turn it into an image your customers recognize.",
    },
    cta: { es: "Cotizar diseño", en: "Get a design quote" },
    visual: "none",
  },
  strip: {
    label: { es: "Formatos de entrega", en: "Delivery formats" },
    items: {
      es: ["SVG", "PNG", "PDF", "JPG", "PSD editable"],
      en: ["SVG", "PNG", "PDF", "JPG", "Editable PSD"],
    },
  },
  services: {
    title: {
      es: "Todo lo que tu marca necesita para verse bien.",
      en: "Everything your brand needs to look good.",
    },
    items: [
      {
        title: { es: "Identidad visual", en: "Brand identity" },
        text: {
          es: "Logo, colores, tipografías y un manual básico para usar tu marca siempre igual.",
          en: "Logo, colors, typefaces and a basic guide to use your brand the same way every time.",
        },
      },
      {
        title: { es: "Piezas para redes", en: "Social media graphics" },
        text: {
          es: "Publicaciones, portadas e historias con la imagen de tu marca, por proyecto o por campaña.",
          en: "Posts, covers and stories with your brand's image, by project or by campaign.",
        },
      },
      {
        title: { es: "Presentaciones y propuestas", en: "Presentations and proposals" },
        text: {
          es: "Presentaciones y propuestas comerciales que explican tu oferta con claridad.",
          en: "Presentations and business proposals that explain your offer clearly.",
        },
      },
      {
        title: { es: "Catálogos", en: "Catalogs" },
        text: {
          es: "Catálogos de productos y servicios, para imprimir o para compartir en digital.",
          en: "Product and service catalogs, to print or to share digitally.",
        },
      },
      {
        title: { es: "Campañas gráficas", en: "Graphic campaigns" },
        text: {
          es: "Piezas para fechas especiales, regalos corporativos y bienestar laboral.",
          en: "Pieces for special dates, corporate gifts and workplace wellbeing.",
        },
      },
      {
        title: { es: "Eventos y prospección", en: "Events and prospecting" },
        text: {
          es: "Material para ferias, eventos y prospección comercial.",
          en: "Material for trade fairs, events and sales prospecting.",
        },
      },
    ],
  },
  deliverables: {
    title: { es: "Listo para usar donde lo necesites.", en: "Ready to use wherever you need it." },
    items: [
      {
        es: "Archivos para imprimir y para pantalla, en el formato que pide cada uso.",
        en: "Files for print and for screen, in the format each use requires.",
      },
      {
        es: "Archivos editables en PSD, compatibles con Affinity.",
        en: "Editable PSD files, compatible with Affinity.",
      },
      {
        es: "Versiones de tu logo para fondo claro, fondo oscuro y espacios pequeños.",
        en: "Versions of your logo for light backgrounds, dark backgrounds and small spaces.",
      },
      {
        es: "Manual básico de marca, cuando el proyecto es de identidad visual.",
        en: "A basic brand guide, when the project is a brand identity.",
      },
      { es: "30 días de garantía sobre nuestro trabajo.", en: "A 30-day warranty on our work." },
    ],
  },
  processFirstStep: {
    es: "Escuchamos tu idea y qué quieres transmitir con tu marca.",
    en: "We listen to your idea and what you want your brand to convey.",
  },
  faq: {
    title: { es: "Sobre tu marca.", en: "About your brand." },
    items: [
      {
        id: "identidad-visual",
        question: { es: "¿Qué incluye una identidad visual?", en: "What does a brand identity include?" },
        answer: {
          es: "El logo en sus versiones principales, la paleta de colores, las tipografías y un manual básico que explica cómo usarlos. El alcance exacto se define en la cotización.",
          en: "The logo in its main versions, the color palette, the typefaces and a basic guide that explains how to use them. The exact scope is defined in the quote.",
        },
      },
      {
        id: "renovar-logo",
        question: { es: "¿Pueden renovar el logo que ya tengo?", en: "Can you refresh the logo I already have?" },
        answer: {
          es: "Sí. Evaluamos qué funciona de tu marca actual y definimos si conviene renovarla o crear una nueva.",
          en: "Yes. We evaluate what works in your current brand and define whether it is best to refresh it or create a new one.",
        },
      },
      {
        id: "redes-sociales",
        question: {
          es: "¿Manejan las redes sociales de mi marca?",
          en: "Do you manage my brand's social media?",
        },
        answer: {
          es: "No. Diseñamos las piezas por proyecto o por campaña, cotizadas a la medida. La publicación y la gestión de las redes quedan a cargo de tu equipo.",
          en: "No. We design the pieces by project or by campaign, quoted to fit. Publishing and managing the accounts stay with your team.",
        },
      },
    ],
  },
  meta: {
    title: {
      es: "Identidad visual y diseño gráfico — Kardenum",
      en: "Brand identity and graphic design — Kardenum",
    },
    description: {
      es: "Logos, identidad de marca, presentaciones, catálogos y piezas para campañas, con archivos editables y 30 días de garantía. Cotiza tu diseño.",
      en: "Logos, brand identity, presentations, catalogs and campaign pieces, with editable files and a 30-day warranty. Get a quote for your design.",
    },
    og: {
      es: { label: "II · Diseño", lines: ["Identidad visual"], accent: "y diseño gráfico." },
      en: { label: "II · Design", lines: ["Brand identity"], accent: "and graphic design." },
    },
  },
};
