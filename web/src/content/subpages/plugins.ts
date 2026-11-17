import type { SubpageContent } from "../types";

// Maqueta B-Sub-Minecraft-plugins. English is provisional until the keywords are validated.
export const plugins: SubpageContent = {
  id: "plugins",
  pathname: "/servicios/minecraft/plugins",
  line: "minecraft",
  hero: {
    titleLines: { es: ["Plugins de Minecraft"], en: ["Custom Minecraft"] },
    titleAccent: { es: "a la medida.", en: "plugins." },
    titleBeside: { es: "Plugins / de Minecraft / a la medida.", en: "Custom Minecraft / plugins." },
    text: {
      es: "Creamos el plugin que tu servidor necesita, o ajustamos el que ya tienes para que funcione como lo imaginaste. Tú nos cuentas la mecánica; nosotros la construimos contigo.",
      en: "We build the plugin your server needs, or adjust the one you already have so it works the way you imagined. You tell us the mechanic; we build it with you.",
    },
    cta: { es: "Cotizar por Discord", en: "Get a quote on Discord" },
  },
  offer: {
    title: { es: "Lo que podemos construir para tu servidor.", en: "What we can build for your server." },
    items: [
      {
        title: { es: "Plugins desde cero", en: "Plugins from scratch" },
        text: {
          es: "Mecánicas, sistemas y minijuegos pensados para tu servidor, sin depender de plugins públicos.",
          en: "Mechanics, systems and minigames designed for your server, without relying on public plugins.",
        },
      },
      {
        title: { es: "Ajustes a tus plugins", en: "Changes to your plugins" },
        text: {
          es: "Corregimos errores, agregamos funciones o adaptamos un plugin que ya usas.",
          en: "We fix bugs, add features or adapt a plugin you already use.",
        },
      },
      {
        title: { es: "Configuración", en: "Configuration" },
        text: {
          es: "Dejamos tus plugins configurados y funcionando en conjunto, sin conflictos entre ellos.",
          en: "We leave your plugins configured and working together, with no conflicts between them.",
        },
      },
      {
        title: { es: "Integraciones", en: "Integrations" },
        text: {
          es: "Conectamos tu servidor con Tebex, Discord, bases de datos o tu sitio web.",
          en: "We connect your server with Tebex, Discord, databases or your website.",
        },
      },
    ],
  },
  deliverables: {
    title: { es: "Todo listo para instalar.", en: "Everything ready to install." },
    items: [
      {
        es: "El plugin compilado y probado en un servidor de prueba.",
        en: "The plugin compiled and tested on a test server.",
      },
      {
        es: "Archivo de configuración comentado, para que lo ajustes sin tocar el código.",
        en: "A commented configuration file, so you can adjust it without touching the code.",
      },
      { es: "Guía de instalación, comandos y permisos.", en: "An installation guide, commands and permissions." },
      {
        es: "El código fuente, si así se acuerda en la cotización.",
        en: "The source code, if agreed in the quote.",
      },
      { es: "30 días de garantía sobre nuestro trabajo.", en: "A 30-day warranty on our work." },
    ],
    chips: {
      label: { es: "Compatibilidad", en: "Compatibility" },
      items: ["Paper", "Spigot", "Velocity", "BungeeCord"],
    },
  },
  process: [
    {
      title: { es: "Nos cuentas", en: "You tell us" },
      text: {
        es: "Escuchamos la idea y cómo quieres que funcione en tu servidor.",
        en: "We listen to the idea and how you want it to work on your server.",
      },
    },
    {
      title: { es: "Cotización", en: "Quote" },
      text: {
        es: "Revisamos la mecánica y te enviamos una propuesta a la medida.",
        en: "We review the mechanic and send you a proposal made to fit.",
      },
    },
    {
      title: { es: "Desarrollo y pruebas", en: "Development and testing" },
      text: {
        es: "Lo construimos y lo probamos en un servidor de prueba antes de entregarlo.",
        en: "We build it and test it on a test server before delivering it.",
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
  works: { title: { es: "Plugins que hemos hecho.", en: "Plugins we have made." } },
  faq: {
    title: { es: "Sobre los plugins.", en: "About the plugins." },
    items: [
      {
        id: "plugins-modificar",
        question: { es: "¿Pueden modificar un plugin que ya tengo?", en: "Can you modify a plugin I already have?" },
        answer: {
          es: "Sí. Revisamos el plugin y definimos si conviene ajustarlo o construir uno nuevo. Si es de un tercero, verificamos antes que su licencia permita modificarlo.",
          en: "Yes. We review the plugin and decide whether it is better to adjust it or build a new one. If it belongs to a third party, we first check that its license allows modifying it.",
        },
      },
      {
        id: "plugins-codigo-fuente",
        question: { es: "¿Recibo el código fuente?", en: "Do I receive the source code?" },
        answer: {
          es: "Siempre recibes el plugin listo para usar. La entrega del código fuente y de sus derechos se define por escrito en la cotización, antes de empezar.",
          en: "You always receive the plugin ready to use. Delivery of the source code and its rights is defined in writing in the quote, before we start.",
        },
      },
      {
        id: "plugins-instalacion",
        question: { es: "¿Lo instalan en mi servidor?", en: "Do you install it on my server?" },
        answer: {
          es: "Sí, con acceso a tu panel. También podemos entregarlo con una guía para que lo instale tu equipo.",
          en: "Yes, with access to your panel. We can also deliver it with a guide so your team installs it.",
        },
      },
      {
        id: "plugins-administracion",
        question: {
          es: "¿Administran el servidor de Minecraft después de la entrega?",
          en: "Do you manage the Minecraft server after delivery?",
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
      {
        line: "minecraft",
        name: { es: "Servidores y networks", en: "Servers and networks" },
        pathname: "/servicios/minecraft/servidores",
      },
      { line: "minecraft", name: { es: "Tiendas Tebex", en: "Tebex stores" }, pathname: "/servicios/minecraft/tebex" },
      { line: "minecraft", name: { es: "Launchers", en: "Launchers" }, pathname: "/servicios/minecraft" },
      { line: "discord", name: { es: "Bots a medida", en: "Custom bots" }, pathname: "/servicios/discord/bots" },
    ],
  },
  meta: {
    title: {
      es: "Plugins de Minecraft a la medida — Kardenum",
      en: "Custom Minecraft Plugins — Kardenum",
    },
    description: {
      es: "Creamos plugins para tu servidor: mecánicas nuevas, ajustes a los plugins que ya usas e integraciones con Tebex y Discord. Pide tu cotización.",
      en: "Custom Minecraft plugins built for your server: new mechanics, fixes to the plugins you already use and integrations with Tebex and Discord. Get a quote.",
    },
    og: {
      es: { label: "Minecraft · Plugins", lines: ["Plugins de Minecraft"], accent: "a la medida." },
      en: { label: "Minecraft · Plugins", lines: ["Custom Minecraft"], accent: "plugins." },
    },
  },
};
