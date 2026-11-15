import type { LinePageContent } from "../types";

// Maqueta B-Linea-Video. English is provisional until the keywords are validated.
// Pending in the handoff, so left out: the reel of the studio (hidden until it exists) and the
// question "¿Ustedes graban el video?", whose answer the founder has not defined yet.
export const video: LinePageContent = {
  line: "video",
  kind: "service",
  hero: {
    titleLines: { es: ["Edición de video"], en: ["Video editing"] },
    titleAccent: { es: "y animación.", en: "and animation." },
    text: {
      es: "Edición, motion graphics y animación 2D para tu marca, tus redes o tu comunidad. Escuchamos lo que quieres contar y lo convertimos en un video que se entiende y se recuerda.",
      en: "Editing, motion graphics and 2D animation for your brand, your channels or your community. We listen to what you want to tell and turn it into a video people understand and remember.",
    },
    cta: { es: "Cotizar video", en: "Get a video quote" },
    visual: "reel",
  },
  strip: {
    label: { es: "Formatos para cada plataforma", en: "Formats for every platform" },
    items: {
      es: ["16:9 horizontal", "9:16 vertical", "1:1 cuadrado", "4:5 retrato"],
      en: ["16:9 landscape", "9:16 vertical", "1:1 square", "4:5 portrait"],
    },
  },
  services: {
    title: { es: "Lo que podemos hacer con tu historia.", en: "What we can do with your story." },
    items: [
      {
        title: { es: "Edición de video", en: "Video editing" },
        text: {
          es: "Corte, ritmo, color y sonido para que tu video cuente lo que quieres en el tiempo justo.",
          en: "Cut, pacing, color and sound so your video tells what you want in just the right time.",
        },
      },
      {
        title: { es: "Motion graphics", en: "Motion graphics" },
        text: {
          es: "Gráficos en movimiento para explicar, presentar o promocionar tu marca, tu producto o tu servicio.",
          en: "Graphics in motion to explain, present or promote your brand, your product or your service.",
        },
      },
      {
        title: { es: "Animación 2D", en: "2D animation" },
        text: {
          es: "Ilustraciones, personajes y logos animados, con detalles en 3D cuando el proyecto lo pide.",
          en: "Animated illustrations, characters and logos, with 3D details when the project calls for them.",
        },
      },
      {
        title: { es: "Títulos y efectos", en: "Titles and effects" },
        text: {
          es: "Títulos animados, efectos y transiciones con la identidad de tu marca.",
          en: "Animated titles, effects and transitions with your brand's identity.",
        },
      },
      {
        title: { es: "Audio", en: "Audio" },
        text: {
          es: "Limpieza de audio, efectos de sonido y mezcla, para que el video suene tan bien como se ve.",
          en: "Audio cleanup, sound effects and mixing, so the video sounds as good as it looks.",
        },
      },
    ],
  },
  deliverables: {
    title: { es: "Listo para publicar.", en: "Ready to publish." },
    items: [
      { es: "El video final en alta calidad, listo para subir.", en: "The final video in high quality, ready to upload." },
      {
        es: "Versiones horizontal, vertical o cuadrada, según dónde se publique.",
        en: "Landscape, vertical or square versions, depending on where it is published.",
      },
      { es: "Rondas de revisión hasta su aprobación.", en: "Review rounds until it is approved." },
      { es: "30 días de garantía sobre nuestro trabajo.", en: "A 30-day warranty on our work." },
    ],
  },
  processFirstStep: {
    es: "Escuchamos tu idea y qué quieres lograr con tu video.",
    en: "We listen to your idea and what you want to achieve with your video.",
  },
  faq: {
    title: { es: "Sobre tu video.", en: "About your video." },
    items: [
      {
        id: "para-empezar",
        question: { es: "¿Qué necesitan para empezar?", en: "What do you need to get started?" },
        answer: {
          es: "El material que tengas: grabaciones, logos, imágenes o referencias. Si todavía no tienes material, definimos juntos qué hace falta antes de cotizar.",
          en: "Whatever material you have: footage, logos, images or references. If you have none yet, we define together what is needed before quoting.",
        },
      },
      {
        id: "versiones-redes",
        question: {
          es: "¿Entregan versiones para cada red social?",
          en: "Do you deliver versions for each social network?",
        },
        answer: {
          es: "Sí. Adaptamos el video a los formatos que necesitas, como horizontal para YouTube o vertical para historias y reels.",
          en: "Yes. We adapt the video to the formats you need, such as landscape for YouTube or vertical for stories and reels.",
        },
      },
    ],
  },
  meta: {
    title: {
      es: "Edición de video y animación — Kardenum",
      en: "Video editing and motion graphics — Kardenum",
    },
    description: {
      es: "Edición de video, motion graphics y animación 2D para tu marca, tus redes o tu comunidad, en el formato de cada plataforma. Cotiza tu video.",
      en: "Video editing, motion graphics and 2D animation for your brand, your channels or your community, in each platform's format. Get a quote for your video.",
    },
    og: {
      es: { label: "III · Video y animación", lines: ["Edición de video"], accent: "y animación." },
      en: { label: "III · Video and animation", lines: ["Video editing"], accent: "and animation." },
    },
  },
};
