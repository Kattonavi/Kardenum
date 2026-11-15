import type { LinePageContent } from "../types";

// Maqueta B-Linea-Discord. English is provisional until the keywords are validated.
export const discord: LinePageContent = {
  line: "discord",
  kind: "community",
  hero: {
    titleLines: { es: ["Bots y servidores"], en: ["Custom Discord"] },
    titleAccent: { es: "de Discord a la medida.", en: "bots and servers." },
    text: {
      es: "Bots, configuración de servidores, tickets, verificación e integraciones. Escuchamos cómo funciona tu comunidad y la dejamos organizada, segura y lista para crecer.",
      en: "Bots, server setup, tickets, verification and integrations. We listen to how your community works and leave it organized, safe and ready to grow.",
    },
    cta: { es: "Cotizar por Discord", en: "Get a quote on Discord" },
    visual: "bracket",
  },
  strip: {
    label: { es: "Configuramos", en: "We set up" },
    items: {
      es: ["Roles", "Permisos", "Canales", "Tickets", "Verificación", "Bots"],
      en: ["Roles", "Permissions", "Channels", "Tickets", "Verification", "Bots"],
    },
  },
  services: {
    title: { es: "Tu comunidad, organizada y segura.", en: "Your community, organized and safe." },
    items: [
      {
        title: { es: "Bots a medida", en: "Custom bots" },
        text: {
          es: "Bots con las funciones que tu comunidad necesita, hechos para tu servidor.",
          en: "Bots with the features your community needs, made for your server.",
        },
        subpage: "/servicios/discord/bots",
      },
      {
        title: { es: "Configuración de servidores", en: "Server setup" },
        text: {
          es: "Roles, permisos y canales ordenados para que cada miembro vea y haga lo que le corresponde.",
          en: "Roles, permissions and channels in order, so each member sees and does what they should.",
        },
      },
      {
        title: { es: "Tickets y soporte", en: "Tickets and support" },
        text: {
          es: "Un sistema de tickets para atender a tu comunidad sin perder ninguna solicitud.",
          en: "A ticket system to look after your community without losing a single request.",
        },
      },
      {
        title: { es: "Verificación y seguridad", en: "Verification and security" },
        text: {
          es: "Verificación de nuevos miembros y protección contra spam y cuentas falsas.",
          en: "Verification of new members and protection against spam and fake accounts.",
        },
      },
      {
        title: { es: "Integraciones", en: "Integrations" },
        text: {
          es: "Conectamos tu servidor de Discord con tu servidor de Minecraft o con tu sitio web.",
          en: "We connect your Discord server with your Minecraft server or your website.",
        },
      },
    ],
  },
  scope: {
    title: { es: "Claro desde el primer mensaje.", en: "Clear from the first message." },
    does: [
      { es: "Desarrollamos y configuramos lo acordado.", en: "We develop and configure what was agreed." },
      { es: "Probamos todo antes de entregarlo.", en: "We test everything before delivering it." },
      {
        es: "Te dejamos la documentación y los comandos para tu equipo.",
        en: "We leave you the documentation and the commands for your team.",
      },
      { es: "Respaldamos el trabajo con 30 días de garantía.", en: "We back the work with a 30-day warranty." },
    ],
    doesNot: [
      {
        es: "Moderación ni gestión diaria de tu comunidad.",
        en: "Moderation or day-to-day management of your community.",
      },
      {
        es: "Administración continua del servidor después de la entrega.",
        en: "Ongoing administration of the server after delivery.",
      },
    ],
  },
  processFirstStep: {
    es: "Escuchamos tu idea y qué quieres lograr con tu comunidad.",
    en: "We listen to your idea and what you want to achieve with your community.",
  },
  faq: {
    title: { es: "Sobre tu comunidad.", en: "About your community." },
    items: [
      {
        id: "organizar-servidor",
        question: {
          es: "¿Pueden organizar un servidor que ya tengo?",
          en: "Can you organize a server I already have?",
        },
        answer: {
          es: "Sí. Revisamos los roles, permisos y canales actuales y los reorganizamos sin que tu comunidad pierda miembros ni información.",
          en: "Yes. We review the current roles, permissions and channels and reorganize them without your community losing members or information.",
        },
      },
      {
        id: "bot-minecraft",
        question: {
          es: "¿El bot se puede conectar con mi servidor de Minecraft?",
          en: "Can the bot connect to my Minecraft server?",
        },
        answer: {
          es: "Sí. Definimos contigo qué debe compartir el bot entre Discord y tu servidor, y lo dejamos funcionando.",
          en: "Yes. We define with you what the bot should share between Discord and your server, and leave it running.",
        },
      },
      {
        id: "alojamiento-bot",
        question: { es: "¿Dónde queda alojado el bot?", en: "Where is the bot hosted?" },
        answer: {
          es: "En el proveedor de hosting que elijas. Si todavía no tienes uno, te recomendamos opciones según lo que necesita tu comunidad.",
          en: "On the hosting provider you choose. If you have none yet, we recommend options based on what your community needs.",
        },
      },
      {
        id: "administracion",
        question: {
          es: "¿Administran el servidor después de la entrega?",
          en: "Do you manage the server after delivery?",
        },
        answer: {
          es: "No. Entregamos el trabajo configurado y funcionando. Después de los 30 días de garantía, cualquier ajuste se atiende mediante una cotización nueva.",
          en: "No. We deliver the work configured and running. After the 30-day warranty, any change is handled through a new quote.",
        },
      },
    ],
  },
  meta: {
    title: {
      es: "Bots y servidores de Discord a la medida — Kardenum",
      en: "Custom Discord bots and server setup — Kardenum",
    },
    description: {
      es: "Bots a la medida, configuración de servidores, tickets, verificación e integraciones para tu comunidad de Discord. Cotiza por Discord.",
      en: "Custom Discord bot development, server setup, tickets, verification and integrations for your community. Get a quote on Discord.",
    },
    og: {
      es: { label: "V · Discord", lines: ["Bots y servidores"], accent: "de Discord a la medida." },
      en: { label: "V · Discord", lines: ["Custom Discord"], accent: "bots and servers." },
    },
  },
};
