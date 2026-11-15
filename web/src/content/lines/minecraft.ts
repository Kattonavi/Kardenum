import type { LinePageContent } from "../types";

// Maqueta B-Linea-Minecraft. English is provisional until the keywords are validated.
export const minecraft: LinePageContent = {
  line: "minecraft",
  kind: "community",
  hero: {
    titleLines: { es: ["Todo para tu servidor"], en: ["Everything for your"] },
    titleAccent: { es: "de Minecraft.", en: "Minecraft server." },
    text: {
      es: "Plugins, servidores, networks, launchers y tiendas Tebex. Escuchamos lo que imaginas para tu comunidad y lo construimos contigo, listo para recibir a tus jugadores.",
      en: "Plugins, servers, networks, launchers and Tebex stores. We listen to what you imagine for your community and build it with you, ready to welcome your players.",
    },
    cta: { es: "Cotizar por Discord", en: "Get a quote on Discord" },
    visual: "bracket",
  },
  strip: {
    label: { es: "Trabajamos con", en: "We work with" },
    items: {
      es: ["Paper", "Spigot", "Velocity", "BungeeCord", "Pterodactyl", "WHMCS", "NamelessMC", "Tebex"],
      en: ["Paper", "Spigot", "Velocity", "BungeeCord", "Pterodactyl", "WHMCS", "NamelessMC", "Tebex"],
    },
  },
  services: {
    title: {
      es: "Lo que tu servidor necesita, en un solo lugar.",
      en: "What your server needs, in one place.",
    },
    items: [
      {
        title: { es: "Plugins", en: "Plugins" },
        text: {
          es: "Plugins desde cero, ajustes a los que ya usas, configuración e integraciones con Tebex, Discord o tu web.",
          en: "Plugins from scratch, changes to the ones you already use, configuration and integrations with Tebex, Discord or your website.",
        },
        subpage: "/servicios/minecraft/plugins",
      },
      {
        title: { es: "Servidores y networks", en: "Servers and networks" },
        text: {
          es: "Montamos tu servidor o tu network completa: proxy, modalidades, permisos y todo conectado entre sí.",
          en: "We set up your server or your whole network: proxy, game modes, permissions and everything connected.",
        },
        subpage: "/servicios/minecraft/servidores",
      },
      {
        title: { es: "Tiendas Tebex", en: "Tebex stores" },
        text: {
          es: "Tu tienda lista para vender rangos y artículos, con tu marca e integrada con el servidor.",
          en: "Your store ready to sell ranks and items, with your brand and integrated with the server.",
        },
        subpage: "/servicios/minecraft/tebex",
      },
      {
        title: { es: "Dedicados", en: "Dedicated servers" },
        text: {
          es: "Configuración, seguridad e instalación de software en tu dedicado: Pterodactyl, WHMCS, NamelessMC y demás. Trabajo puntual, sin administración continua.",
          en: "Configuration, security and software installation on your dedicated server: Pterodactyl, WHMCS, NamelessMC and more. One-off work, without ongoing administration.",
        },
      },
      {
        title: { es: "Launchers", en: "Launchers" },
        text: {
          es: "Un launcher con la identidad de tu servidor, para que tus jugadores entren directo y con todo lo que necesitan.",
          en: "A launcher with your server's identity, so your players get in directly with everything they need.",
        },
      },
      {
        title: { es: "Webs para servidores", en: "Server websites" },
        text: {
          es: "El sitio de tu servidor: presentación, normas y enlaces a tu tienda y a tu Discord.",
          en: "Your server's site: introduction, rules and links to your store and your Discord.",
        },
      },
    ],
  },
  scope: {
    title: { es: "Claro desde el primer mensaje.", en: "Clear from the first message." },
    does: [
      {
        es: "Desarrollamos, configuramos e instalamos lo acordado.",
        en: "We develop, configure and install what was agreed.",
      },
      { es: "Probamos todo antes de entregarlo.", en: "We test everything before delivering it." },
      {
        es: "Te dejamos la documentación para que tu equipo lo maneje.",
        en: "We leave you the documentation so your team can run it.",
      },
      { es: "Respaldamos el trabajo con 30 días de garantía.", en: "We back the work with a 30-day warranty." },
    ],
    doesNot: [
      {
        es: "Administración continua del servidor después de la entrega.",
        en: "Ongoing administration of the server after delivery.",
      },
      {
        es: "Ajustes fuera de la garantía sin una cotización nueva.",
        en: "Changes outside the warranty without a new quote.",
      },
    ],
  },
  processFirstStep: {
    es: "Escuchamos tu idea y qué quieres lograr con tu servidor.",
    en: "We listen to your idea and what you want to achieve with your server.",
  },
  faq: {
    title: { es: "Sobre tu servidor.", en: "About your server." },
    items: [
      {
        id: "servidores-en-marcha",
        question: {
          es: "¿Trabajan con servidores que ya están en marcha?",
          en: "Do you work with servers that are already running?",
        },
        answer: {
          es: "Sí. Revisamos lo que existe y definimos qué conviene ajustar, reemplazar o construir. El objetivo es mejorar el servidor interrumpiendo lo menos posible a tu comunidad.",
          en: "Yes. We review what exists and define what is best to adjust, replace or build. The goal is to improve the server while interrupting your community as little as possible.",
        },
      },
      {
        id: "network-desde-cero",
        question: { es: "¿Pueden montar una network desde cero?", en: "Can you set up a network from scratch?" },
        answer: {
          es: "Sí. Definimos contigo las modalidades, el proxy y la estructura de permisos, y entregamos la network configurada y probada.",
          en: "Yes. We define with you the game modes, the proxy and the permission structure, and deliver the network configured and tested.",
        },
      },
      {
        id: "proveedor-hosting",
        question: {
          es: "¿Trabajan con mi proveedor de hosting?",
          en: "Do you work with my hosting provider?",
        },
        answer: {
          es: "Sí, siempre que nos des acceso al panel o al servidor. Si todavía no tienes proveedor, te explicamos qué tener en cuenta para elegirlo según tu proyecto.",
          en: "Yes, as long as you give us access to the panel or the server. If you have no provider yet, we explain what to consider when choosing one for your project.",
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
      es: "Plugins y servidores de Minecraft a la medida — Kardenum",
      en: "Custom Minecraft plugins and server setup — Kardenum",
    },
    description: {
      es: "Desarrollo de plugins, configuración de servidores y networks, launchers y tiendas Tebex para tu servidor de Minecraft. Cotiza por Discord.",
      en: "Custom Minecraft plugin development, server and network setup, launchers and Tebex stores for your community. Get a quote on Discord.",
    },
    og: {
      es: { label: "IV · Minecraft", lines: ["Todo para tu servidor"], accent: "de Minecraft." },
      en: { label: "IV · Minecraft", lines: ["Everything for your"], accent: "Minecraft server." },
    },
  },
};
