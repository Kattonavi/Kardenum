import type { MetadataRoute } from "next";
import { notFound } from "next/navigation";
import { isSiteIndexable } from "@/lib/indexing";
import { buildSitemapEntries } from "@/lib/seo/sitemap";

// While the site is not indexable the sitemap is not published: /sitemap.xml answers 404.
export default function sitemap(): MetadataRoute.Sitemap {
  if (!isSiteIndexable()) notFound();
  return buildSitemapEntries();
}
