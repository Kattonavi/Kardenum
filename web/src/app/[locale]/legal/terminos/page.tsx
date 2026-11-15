import { LegalPage, legalMetadata } from "@/components/pages/legal-page";
import { termsDocument } from "@/content/legal";
import { siteConfig } from "@/site.config";

export function generateMetadata({ params }: PageProps<"/[locale]/legal/terminos">) {
  return legalMetadata(termsDocument.pathname, params);
}

export default function TermsPage({ params }: PageProps<"/[locale]/legal/terminos">) {
  return <LegalPage document={termsDocument} data={siteConfig.legal.terms} params={params} />;
}
