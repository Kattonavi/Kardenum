import { SubPage, subpageMetadata } from "@/components/pages/sub-page";

export function generateMetadata({ params }: PageProps<"/[locale]/servicios/minecraft/servidores">) {
  return subpageMetadata("servidores", params);
}

export default function Page({ params }: PageProps<"/[locale]/servicios/minecraft/servidores">) {
  return <SubPage id="servidores" params={params} />;
}
