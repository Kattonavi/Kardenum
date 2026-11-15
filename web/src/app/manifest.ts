import type { MetadataRoute } from "next";
import { brand } from "@/lib/brand";
import { siteConfig } from "@/site.config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.name,
    description: siteConfig.descriptor.es,
    lang: "es",
    start_url: "/",
    display: "browser",
    background_color: brand.ink,
    theme_color: brand.ink,
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
