import { SubPage, subpageMetadata } from "@/components/pages/sub-page";

export function generateMetadata({ params }: PageProps<"/[locale]/servicios/minecraft/plugins">) {
  return subpageMetadata("plugins", params);
}

export default function Page({ params }: PageProps<"/[locale]/servicios/minecraft/plugins">) {
  return <SubPage id="plugins" params={params} />;
}
