import type { MetadataRoute } from "next";
import { isSiteIndexable } from "@/lib/indexing";

export default function robots(): MetadataRoute.Robots {
  if (!isSiteIndexable()) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  // The sitemap line is added with the technical SEO step, once the domain is final.
  return { rules: { userAgent: "*", allow: "/" } };
}
