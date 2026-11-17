import type { SubpageContent } from "../types";

// Maqueta B-Sub-Tiendas-online. English is provisional until the keywords are validated.
export const tiendasOnline: SubpageContent = {
  id: "tiendas-online",
  pathname: "/servicios/desarrollo/tiendas-online",
  line: "desarrollo",
  hero: {
    titleLines: { es: ["Desarrollo de"], en: ["Custom ecommerce"] },
    titleAccent: { es: "tiendas online.", en: "websites." },
    titleBeside: { es: "Desarrollo de / tiendas online.", en: "Custom / ecommerce websites." },
    text: {
      es: "Tu catálogo, tu carrito y tus medios de pago en un solo lugar, con tu marca. Escuchamos cómo vendes hoy y construimos contigo la tienda que te deja vender sin intermediarios.",
      en: "Your catalog, your cart and your payment methods in one place, with your brand. We listen to how you sell today and build with you the store that lets you sell without middlemen.",
    },
    cta: { es: "Cotizar tienda", en: "Get a store quote" },
  },
  offer: {
    title: { es: "Todo lo que tu tienda necesita para vender.", en: "Everything your store needs to sell." },
    items: [
      {
        title: { es: "Tienda desde cero", en: "Store from scratch" },
        text: {
          es: "Diseño y desarrollo de tu tienda con tu identidad, pensada para que comprar sea fácil.",
          en: "Design and development of your store with your identity, built to make buying easy.",
        },
      },
      {
        title: { es: "Catálogo y productos", en: "Catalog and products" },
        text: {
          es: "Tus productos ordenados por categorías, con fotos, precios y variantes como talla o color.",
          en: "Your products organized by category, with photos, prices and variants such as size or color.",
        },
      },
      {
        title: { es: "Medios de pago", en: "Payment methods" },
        text: {
          es: "La pasarela de pagos que mejor funcione para tu negocio y los países donde vendes.",
          en: "The payment gateway that works best for your business and the countries where you sell.",
        },
      },
      {
        title: { es: "Mejora de tu tienda", en: "Improving your store" },
        text: {
          es: "Optimizamos la tienda que ya tienes o la llevamos a una nueva.",
          en: "We optimize the store you already have or move it to a new one.",
        },
      },
    ],
  },
  deliverables: {
    title: { es: "Lista para recibir pedidos.", en: "Ready to take orders." },
    items: [
      {
        es: "La tienda publicada en tu dominio y adaptada a celular.",
        en: "The store published on your domain and adapted to mobile.",
      },
      {
        es: "Un panel para manejar productos, inventario y pedidos.",
        en: "A panel to manage products, inventory and orders.",
      },
      { es: "Velocidad y SEO técnico desde el primer día.", en: "Speed and technical SEO from day one." },
      { es: "El código fuente de tu proyecto.", en: "The source code of your project." },
      { es: "30 días de garantía sobre nuestro trabajo.", en: "A 30-day warranty on our work." },
    ],
  },
  process: [
    {
      title: { es: "Nos cuentas", en: "You tell us" },
      text: {
        es: "Escuchamos tu idea y qué quieres lograr con tu tienda.",
        en: "We listen to your idea and what you want to achieve with your store.",
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
  works: { title: { es: "Tiendas que hemos construido.", en: "Stores we have built." } },
  faq: {
    title: { es: "Sobre tu tienda.", en: "About your store." },
    items: [
      {
        id: "tiendas-online-pasarelas",
        question: { es: "¿Con qué pasarelas de pago trabajan?", en: "Which payment gateways do you work with?" },
        answer: {
          es: "Con la que mejor se ajuste a tu negocio y a los países donde vendes. La definimos contigo antes de cotizar.",
          en: "With the one that best fits your business and the countries where you sell. We define it with you before quoting.",
        },
      },
      {
        id: "tiendas-online-administrar",
        question: { es: "¿Puedo administrar la tienda yo mismo?", en: "Can I manage the store myself?" },
        answer: {
          es: "Sí. Entregamos la tienda con un panel para gestionar productos, precios y pedidos, junto con la documentación para usarlo.",
          en: "Yes. We deliver the store with a panel to manage products, prices and orders, together with the documentation to use it.",
        },
      },
      {
        id: "tiendas-online-mejorar",
        question: { es: "¿Pueden mejorar la tienda que ya tengo?", en: "Can you improve the store I already have?" },
        answer: {
          es: "Sí. Revisamos lo que existe y definimos si conviene optimizarla o construir una nueva. La recomendación queda clara antes de cotizar.",
          en: "Yes. We review what exists and decide whether it is better to optimize it or build a new one. The recommendation is clear before we quote.",
        },
      },
    ],
  },
  related: {
    title: { es: "También para tu negocio.", en: "Also for your business." },
    items: [
      {
        line: "desarrollo",
        name: { es: "Software a la medida", en: "Custom software" },
        pathname: "/servicios/desarrollo/software-a-la-medida",
      },
      { line: "desarrollo", name: { es: "Aplicaciones web", en: "Web applications" }, pathname: "/servicios/desarrollo" },
      { line: "diseno", name: { es: "Identidad visual", en: "Brand identity" }, pathname: "/servicios/diseno" },
      { line: "diseno", name: { es: "Catálogos", en: "Catalogs" }, pathname: "/servicios/diseno" },
    ],
  },
  meta: {
    title: {
      es: "Desarrollo de tiendas online con tu marca — Kardenum",
      en: "Ecommerce website development — Kardenum",
    },
    description: {
      es: "Desarrollo de tiendas online con tu marca: catálogo, carrito, medios de pago y un panel para manejar productos y pedidos. Pide tu cotización.",
      en: "Ecommerce website development with your brand: catalog, cart, payment gateways and a panel to manage products, stock and orders. Get a quote.",
    },
    og: {
      es: { label: "Desarrollo · Tiendas online", lines: ["Desarrollo de"], accent: "tiendas online." },
      en: { label: "Development · Online stores", lines: ["Custom ecommerce"], accent: "websites." },
    },
  },
};
