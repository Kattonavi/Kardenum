import type { SubpageContent } from "../types";

// Maqueta B-Sub-Tebex. English is provisional until the keywords are validated.
export const tebex: SubpageContent = {
  id: "tebex",
  pathname: "/servicios/minecraft/tebex",
  line: "minecraft",
  hero: {
    titleLines: { es: ["Tiendas Tebex"], en: ["Tebex store setup"] },
    titleAccent: { es: "para tu servidor.", en: "for your server." },
    text: {
      es: "Tu tienda lista para vender rangos y artículos, con la identidad de tu servidor e integrada para que cada compra llegue directo al juego.",
      en: "Your store ready to sell ranks and items, with your server's identity and integrated so every purchase reaches the game directly.",
    },
    cta: { es: "Cotizar por Discord", en: "Get a quote on Discord" },
  },
  offer: {
    title: { es: "Tu tienda, lista para vender.", en: "Your store, ready to sell." },
    items: [
      {
        title: { es: "Configuración", en: "Configuration" },
        text: {
          es: "Categorías, paquetes y precios ordenados para que comprar sea fácil.",
          en: "Categories, packages and prices organized to make buying easy.",
        },
      },
      {
        title: { es: "Diseño con tu marca", en: "Design with your brand" },
        text: {
          es: "La tienda con los colores, el logo y el estilo de tu servidor.",
          en: "The store with your server's colors, logo and style.",
        },
      },
      {
        title: { es: "Entrega en el juego", en: "In-game delivery" },
        text: {
          es: "Cada compra se entrega automáticamente en tu servidor.",
          en: "Every purchase is delivered automatically on your server.",
        },
      },
      {
        title: { es: "Conexión con Discord", en: "Discord connection" },
        text: {
          es: "Avisos de compras y roles para tus compradores en tu servidor de Discord.",
          en: "Purchase notifications and roles for your buyers on your Discord server.",
        },
      },
    ],
  },
  deliverables: {
    title: { es: "Lista para recibir compras.", en: "Ready to take purchases." },
    items: [
      {
        es: "La tienda configurada y probada con compras de prueba.",
        en: "The store configured and tested with test purchases.",
      },
      {
        es: "Paquetes y comandos de entrega documentados.",
        en: "Packages and delivery commands documented.",
      },
      { es: "30 días de garantía sobre nuestro trabajo.", en: "A 30-day warranty on our work." },
    ],
    chips: {
      label: { es: "Compatibilidad", en: "Compatibility" },
      items: ["Tebex", "Paper", "Spigot", "Velocity", "BungeeCord"],
    },
  },
  process: [
    {
      title: { es: "Nos cuentas", en: "You tell us" },
      text: {
        es: "Escuchamos qué quieres vender y cómo quieres que se vea tu tienda.",
        en: "We listen to what you want to sell and how you want your store to look.",
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
  works: { title: { es: "Tiendas que hemos configurado.", en: "Stores we have set up." } },
  faq: {
    title: { es: "Sobre tu tienda.", en: "About your store." },
    items: [
      {
        id: "tebex-cuenta",
        question: { es: "¿Necesito una cuenta de Tebex?", en: "Do I need a Tebex account?" },
        answer: {
          es: "Sí. La tienda se crea en tu cuenta para que los pagos lleguen directamente a ti. Nosotros la configuramos con el acceso que nos des.",
          en: "Yes. The store is created in your account so payments reach you directly. We configure it with the access you give us.",
        },
      },
      {
        id: "tebex-que-vender",
        question: { es: "¿Qué se puede vender en la tienda?", en: "What can I sell in the store?" },
        answer: {
          es: "Revisamos contigo que los paquetes respeten las reglas de uso comercial de Minecraft, que limitan la venta de ventajas dentro del juego.",
          en: "We check with you that the packages respect Minecraft's commercial usage rules, which limit selling in-game advantages.",
        },
      },
      {
        id: "tebex-mejorar",
        question: { es: "¿Pueden mejorar una tienda que ya tengo?", en: "Can you improve a store I already have?" },
        answer: {
          es: "Sí. Revisamos tus paquetes, el diseño y las entregas, y te proponemos qué ajustar.",
          en: "Yes. We review your packages, the design and the deliveries, and suggest what to adjust.",
        },
      },
    ],
  },
  related: {
    title: { es: "También para tu servidor.", en: "Also for your server." },
    items: [
      { line: "minecraft", name: { es: "Plugins", en: "Plugins" }, pathname: "/servicios/minecraft/plugins" },
      {
        line: "minecraft",
        name: { es: "Servidores y networks", en: "Servers and networks" },
        pathname: "/servicios/minecraft/servidores",
      },
      { line: "minecraft", name: { es: "Webs para servidores", en: "Server websites" }, pathname: "/servicios/minecraft" },
      { line: "discord", name: { es: "Bots a medida", en: "Custom bots" }, pathname: "/servicios/discord/bots" },
    ],
  },
  meta: {
    title: {
      es: "Configuración de tienda Tebex para Minecraft — Kardenum",
      en: "Tebex store setup for Minecraft — Kardenum",
    },
    description: {
      es: "Configuración de tu tienda Tebex: paquetes, diseño con tu marca, entrega automática en el juego y conexión con Discord. Pide tu cotización.",
      en: "Tebex store setup for your Minecraft server: packages, your branding, automatic in-game delivery and a Discord link for buyers. Get a quote.",
    },
    og: {
      es: { label: "Minecraft · Tiendas Tebex", lines: ["Tiendas Tebex"], accent: "para tu servidor." },
      en: { label: "Minecraft · Tebex stores", lines: ["Tebex store setup"], accent: "for your server." },
    },
  },
};
