import { SubPage, subpageMetadata } from "@/components/pages/sub-page";

export function generateMetadata({ params }: PageProps<"/[locale]/servicios/minecraft/tebex">) {
  return subpageMetadata("tebex", params);
}

export default function Page({ params }: PageProps<"/[locale]/servicios/minecraft/tebex">) {
  return <SubPage id="tebex" params={params} />;
}
