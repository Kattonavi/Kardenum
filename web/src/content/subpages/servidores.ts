import type { SubpageContent } from "../types";

// Maqueta B-Sub-Servidores. English is provisional until the keywords are validated.
export const servidores: SubpageContent = {
  id: "servidores",
  pathname: "/servicios/minecraft/servidores",
  line: "minecraft",
  hero: {
    titleLines: { es: ["Servidores y networks"], en: ["Minecraft server and"] },
    titleAccent: { es: "de Minecraft.", en: "network setup." },
    titleBeside: { es: "Servidores y networks / de Minecraft.", en: "Minecraft server / and network setup." },
    text: {
      es: "Montamos tu servidor o tu network completa: proxy, modalidades, permisos y todo conectado entre sí, listo para recibir a tus jugadores.",
      en: "We set up your server or your whole network: proxy, game modes, permissions and everything connected, ready to welcome your players.",
    },
    cta: { es: "Cotizar por Discord", en: "Get a quote on Discord" },
  },
  offer: {
    title: { es: "Tu servidor, listo para crecer.", en: "Your server, ready to grow." },
    items: [
      {
        title: { es: "Servidor desde cero", en: "Server from scratch" },
        text: {
          es: "Instalación y configuración con los plugins y ajustes que pide tu modalidad.",
          en: "Installation and configuration with the plugins and settings your game mode calls for.",
        },
      },
      {
        title: { es: "Networks", en: "Networks" },
        text: {
          es: "Varias modalidades conectadas por un proxy, con lobby y permisos compartidos.",
          en: "Several game modes connected through a proxy, with a shared lobby and permissions.",
        },
      },
      {
        title: { es: "Optimización", en: "Optimization" },
        text: {
          es: "Ajustes de rendimiento para que tu servidor aguante más jugadores con menos lag.",
          en: "Performance tuning so your server handles more players with less lag.",
        },
      },
      {
        title: { es: "Seguridad", en: "Security" },
        text: {
          es: "Accesos protegidos, permisos bien definidos y copias de seguridad configuradas.",
          en: "Protected access, well-defined permissions and backups configured.",
        },
      },
    ],
  },
  deliverables: {
    title: { es: "Listo para abrir.", en: "Ready to open." },
    items: [
      {
        es: "El servidor o la network funcionando y probada.",
        en: "The server or network up, running and tested.",
      },
      { es: "Rangos y permisos configurados.", en: "Ranks and permissions configured." },
      {
        es: "Accesos y documentación para tu staff.",
        en: "Access and documentation for your staff.",
      },
      { es: "30 días de garantía sobre nuestro trabajo.", en: "A 30-day warranty on our work." },
    ],
    chips: {
      label: { es: "Compatibilidad", en: "Compatibility" },
      items: ["Paper", "Spigot", "Velocity", "BungeeCord", "Pterodactyl"],
    },
  },
  process: [
    {
      title: { es: "Nos cuentas", en: "You tell us" },
      text: {
        es: "Escuchamos tu idea y cómo quieres que funcione tu servidor.",
        en: "We listen to your idea and how you want your server to work.",
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
  works: { title: { es: "Servidores que hemos montado.", en: "Servers we have set up." } },
  faq: {
    title: { es: "Sobre tu servidor.", en: "About your server." },
    items: [
      {
        id: "servidores-pasar-a-network",
        question: { es: "¿Pueden pasar mi servidor a una network?", en: "Can you move my server into a network?" },
        answer: {
          es: "Sí. Revisamos tu servidor actual y planeamos la migración para conservar los mundos, los rangos y los datos de tus jugadores.",
          en: "Yes. We review your current server and map out the migration so your worlds, ranks and player data are kept.",
        },
      },
      {
        id: "servidores-proveedor-hosting",
        question: { es: "¿Trabajan con mi proveedor de hosting?", en: "Do you work with my hosting provider?" },
        answer: {
          es: "Sí, siempre que nos des acceso al panel o al servidor. Si todavía no tienes proveedor, te explicamos qué tener en cuenta para elegirlo según tu proyecto.",
          en: "Yes, as long as you give us access to the panel or the server. If you have no provider yet, we explain what to consider when choosing one for your project.",
        },
      },
      {
        id: "servidores-administracion",
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
  related: {
    title: { es: "También para tu servidor.", en: "Also for your server." },
    items: [
      { line: "minecraft", name: { es: "Plugins", en: "Plugins" }, pathname: "/servicios/minecraft/plugins" },
      { line: "minecraft", name: { es: "Tiendas Tebex", en: "Tebex stores" }, pathname: "/servicios/minecraft/tebex" },
      { line: "minecraft", name: { es: "Launchers", en: "Launchers" }, pathname: "/servicios/minecraft" },
      { line: "discord", name: { es: "Bots a medida", en: "Custom bots" }, pathname: "/servicios/discord/bots" },
    ],
  },
  meta: {
    title: {
      es: "Configuración de servidores de Minecraft — Kardenum",
      en: "Minecraft server and network setup — Kardenum",
    },
    description: {
      es: "Configuración de servidores y networks de Minecraft: proxy, modalidades, permisos y copias de seguridad, listos para tus jugadores. Pide tu cotización.",
      en: "Minecraft server and network setup with a proxy, game modes, permissions and backups, tested and ready to welcome your players. Get a quote.",
    },
    og: {
      es: { label: "Minecraft · Servidores y networks", lines: ["Servidores y networks"], accent: "de Minecraft." },
      en: { label: "Minecraft · Servers and networks", lines: ["Minecraft server and"], accent: "network setup." },
    },
  },
};
