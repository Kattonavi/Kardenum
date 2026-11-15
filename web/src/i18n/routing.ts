import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["es", "en"],
  // Spanish is the main language and lives at the root; English lives under /en.
  defaultLocale: "es",
  localePrefix: "as-needed",
  // No redirect by browser language or cookie (Google's recommendation): "/" always answers in Spanish.
  // A language bar offers the other version and remembers the choice (built with the navigation).
  localeDetection: false,
  localeCookie: false,
  // hreflang is emitted from page metadata, because x-default must point to English.
  alternateLinks: false,
  // Translated routes are added here as pages are built (e.g. "/servicios": { es: "/servicios", en: "/services" }).
  pathnames: {
    "/": "/",
  },
});

export type AppLocale = (typeof routing.locales)[number];
