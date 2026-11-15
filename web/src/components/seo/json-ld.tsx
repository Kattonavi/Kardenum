import { type JsonLdNode, serializeJsonLd } from "@/lib/seo/json-ld";

/** Structured data of a page. The content is built from typed data and serialized with "<" escaped. */
export function JsonLd({ nodes }: { nodes: readonly JsonLdNode[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(nodes) }} />;
}
