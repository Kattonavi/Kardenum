import { SubPage, subpageMetadata } from "@/components/pages/sub-page";
import type { LocalePageProps } from "@/routes";

export function generateMetadata({ params }: LocalePageProps) {
  return subpageMetadata("software-a-la-medida", params);
}

export default function Page({ params }: LocalePageProps) {
  return <SubPage id="software-a-la-medida" params={params} />;
}
