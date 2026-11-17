import type { SubpageContent } from "../types";

// Maqueta B-Sub-Bots. English is provisional until the keywords are validated.
export const bots: SubpageContent = {
  id: "bots",
  pathname: "/servicios/discord/bots",
  line: "discord",
  hero: {
    titleLines: { es: ["Bots de Discord"], en: ["Custom"] },
    titleAccent: { es: "a la medida.", en: "Discord bots." },
    titleBeside: { es: "Bots de Discord / a la medida.", en: "Custom / Discord bots." },
    text: {
      es: "Bots con las funciones que tu comunidad necesita, hechos para tu servidor. Escuchamos cómo se mueve tu comunidad y lo automatizamos contigo.",
      en: "Bots with the features your community needs, made for your server. We listen to how your community moves and automate it with you.",
    },
    cta: { es: "Cotizar por Discord", en: "Get a quote on Discord" },
  },
  offer: {
    title: { es: "Lo que tu bot puede hacer por tu comunidad.", en: "What your bot can do for your community." },
    items: [
      {
        title: { es: "Bots desde cero", en: "Bots from scratch" },
        text: {
          es: "Comandos, sistemas y automatizaciones pensados para tu servidor.",
          en: "Commands, systems and automations designed for your server.",
        },
      },
      {
        title: { es: "Tickets y soporte", en: "Tickets and support" },
        text: {
          es: "Atención a tu comunidad ordenada por categorías, sin perder solicitudes.",
          en: "Support for your community organized by category, without losing requests.",
        },
      },
      {
        title: { es: "Moderación automática", en: "Automatic moderation" },
        text: {
          es: "Filtros, registros y sanciones automáticas para cuidar tu servidor.",
          en: "Filters, logs and automatic sanctions to look after your server.",
        },
      },
      {
        title: { es: "Integraciones", en: "Integrations" },
        text: {
          es: "Conexión con tu servidor de Minecraft, tu tienda o tu sitio web.",
          en: "Connection with your Minecraft server, your store or your website.",
        },
      },
    ],
  },
  deliverables: {
    title: { es: "Listo para tu comunidad.", en: "Ready for your community." },
    items: [
      {
        es: "El bot funcionando en tu servidor de Discord.",
        en: "The bot up and running on your Discord server.",
      },
      {
        es: "Lista de comandos y permisos documentada.",
        en: "A documented list of commands and permissions.",
      },
      {
        es: "El código fuente, si así se acuerda en la cotización.",
        en: "The source code, if agreed in the quote.",
      },
      { es: "30 días de garantía sobre nuestro trabajo.", en: "A 30-day warranty on our work." },
    ],
  },
  process: [
    {
      title: { es: "Nos cuentas", en: "You tell us" },
      text: {
        es: "Escuchamos tu idea y qué quieres lograr con tu comunidad.",
        en: "We listen to your idea and what you want to achieve with your community.",
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
  works: { title: { es: "Bots que hemos desarrollado.", en: "Bots we have developed." } },
  faq: {
    title: { es: "Sobre tu bot.", en: "About your bot." },
    items: [
      {
        id: "bots-alojamiento",
        question: { es: "¿Dónde queda alojado el bot?", en: "Where is the bot hosted?" },
        answer: {
          es: "En el proveedor de hosting que elijas. Si todavía no tienes uno, te recomendamos opciones según lo que necesita tu comunidad.",
          en: "With the hosting provider you choose. If you do not have one yet, we recommend options based on what your community needs.",
        },
      },
      {
        id: "bots-modificar",
        question: { es: "¿Pueden modificar un bot que ya tengo?", en: "Can you modify a bot I already have?" },
        answer: {
          es: "Sí. Revisamos el bot y definimos si conviene ajustarlo o construir uno nuevo.",
          en: "Yes. We review the bot and decide whether it is better to adjust it or build a new one.",
        },
      },
      {
        id: "bots-minecraft",
        question: {
          es: "¿El bot se puede conectar con mi servidor de Minecraft?",
          en: "Can the bot connect to my Minecraft server?",
        },
        answer: {
          es: "Sí. Definimos contigo qué debe compartir el bot entre Discord y tu servidor, y lo dejamos funcionando.",
          en: "Yes. We define with you what the bot should share between Discord and your server, and leave it working.",
        },
      },
    ],
  },
  related: {
    title: { es: "También para tu comunidad.", en: "Also for your community." },
    items: [
      {
        line: "discord",
        name: { es: "Configuración de servidores", en: "Server setup" },
        pathname: "/servicios/discord",
      },
      {
        line: "discord",
        name: { es: "Verificación y seguridad", en: "Verification and security" },
        pathname: "/servicios/discord",
      },
      { line: "minecraft", name: { es: "Plugins", en: "Plugins" }, pathname: "/servicios/minecraft/plugins" },
      { line: "minecraft", name: { es: "Tiendas Tebex", en: "Tebex stores" }, pathname: "/servicios/minecraft/tebex" },
    ],
  },
  meta: {
    title: {
      es: "Bots de Discord a medida — Kardenum",
      en: "Custom Discord bot development — Kardenum",
    },
    description: {
      es: "Bots de Discord a medida: comandos, tickets, moderación automática e integraciones con tu servidor de Minecraft o tu sitio web. Pide tu cotización.",
      en: "Custom Discord bot development: commands, tickets, automatic moderation and integrations with your Minecraft server or website. Get a quote.",
    },
    og: {
      es: { label: "Discord · Bots a medida", lines: ["Bots de Discord"], accent: "a la medida." },
      en: { label: "Discord · Custom bots", lines: ["Custom"], accent: "Discord bots." },
    },
  },
};
