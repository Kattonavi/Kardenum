import { LegalPage, legalMetadata } from "@/components/pages/legal-page";
import { privacyDocument } from "@/content/legal";
import { siteConfig } from "@/site.config";

export function generateMetadata({ params }: PageProps<"/[locale]/legal/privacidad">) {
  return legalMetadata(privacyDocument.pathname, params);
}

export default function PrivacyPage({ params }: PageProps<"/[locale]/legal/privacidad">) {
  return <LegalPage document={privacyDocument} data={siteConfig.legal.privacy} params={params} />;
}
