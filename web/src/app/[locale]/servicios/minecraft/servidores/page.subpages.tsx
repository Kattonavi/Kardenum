import { SubPage, subpageMetadata } from "@/components/pages/sub-page";
import type { LocalePageProps } from "@/routes";

export function generateMetadata({ params }: LocalePageProps) {
  return subpageMetadata("servidores", params);
}

export default function Page({ params }: LocalePageProps) {
  return <SubPage id="servidores" params={params} />;
}
