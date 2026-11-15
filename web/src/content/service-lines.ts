import type { ServiceLine } from "./types";

/** The five service lines, in menu order. Texts from the approved mockups (docs/handoff). */
export const serviceLines: readonly ServiceLine[] = [
  {
    id: "desarrollo",
    numeral: "I",
    pathname: "/servicios/desarrollo",
    name: { es: "Desarrollo", en: "Development" },
    shortName: { es: "Desarrollo", en: "Development" },
    summary: {
      es: "Sitios web, tiendas online, aplicaciones web y software a medida.",
      en: "Websites, online stores, web apps and custom software.",
    },
    subpages: [
      { pathname: "/servicios/desarrollo/tiendas-online", label: { es: "Tiendas online", en: "Online stores" } },
      { pathname: "/servicios/desarrollo/software-a-la-medida", label: { es: "Software a la medida", en: "Custom software" } },
    ],
  },
  {
    id: "diseno",
    numeral: "II",
    pathname: "/servicios/diseno",
    name: { es: "Diseño", en: "Design" },
    shortName: { es: "Diseño", en: "Design" },
    summary: {
      es: "Identidad visual, piezas para redes, presentaciones y catálogos.",
      en: "Brand identity, social media graphics, presentations and catalogs.",
    },
    subpages: [],
  },
  {
    id: "video",
    numeral: "III",
    pathname: "/servicios/video",
    name: { es: "Video y animación", en: "Video and animation" },
    shortName: { es: "Video", en: "Video" },
    summary: {
      es: "Edición de video, motion graphics y animación 2D.",
      en: "Video editing, motion graphics and 2D animation.",
    },
    subpages: [],
  },
  {
    id: "minecraft",
    numeral: "IV",
    pathname: "/servicios/minecraft",
    name: { es: "Minecraft", en: "Minecraft" },
    shortName: { es: "Minecraft", en: "Minecraft" },
    summary: {
      es: "Desarrollo de plugins, configuración de servidores y networks, launchers y tiendas Tebex.",
      en: "Plugin development, server and network setup, launchers and Tebex stores.",
    },
    subpages: [
      { pathname: "/servicios/minecraft/plugins", label: { es: "Plugins", en: "Plugins" } },
      { pathname: "/servicios/minecraft/servidores", label: { es: "Servidores y networks", en: "Servers and networks" } },
      { pathname: "/servicios/minecraft/tebex", label: { es: "Tiendas Tebex", en: "Tebex stores" } },
    ],
  },
  {
    id: "discord",
    numeral: "V",
    pathname: "/servicios/discord",
    name: { es: "Discord", en: "Discord" },
    shortName: { es: "Discord", en: "Discord" },
    summary: {
      es: "Bots a la medida, configuración de servidores, sistemas de tickets y seguridad.",
      en: "Custom bots, server setup, ticket systems and security.",
    },
    subpages: [{ pathname: "/servicios/discord/bots", label: { es: "Bots a medida", en: "Custom bots" } }],
  },
];
