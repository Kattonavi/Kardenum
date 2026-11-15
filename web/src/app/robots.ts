import type { MetadataRoute } from "next";
import { isSiteIndexable } from "@/lib/indexing";
import { absoluteUrl } from "@/routes";

export default function robots(): MetadataRoute.Robots {
  if (!isSiteIndexable()) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return { rules: { userAgent: "*", allow: "/" }, sitemap: absoluteUrl("/sitemap.xml") };
}
