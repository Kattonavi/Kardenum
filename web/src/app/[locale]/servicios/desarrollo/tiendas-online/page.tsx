import { SubPage, subpageMetadata } from "@/components/pages/sub-page";

export function generateMetadata({ params }: PageProps<"/[locale]/servicios/desarrollo/tiendas-online">) {
  return subpageMetadata("tiendas-online", params);
}

export default function Page({ params }: PageProps<"/[locale]/servicios/desarrollo/tiendas-online">) {
  return <SubPage id="tiendas-online" params={params} />;
}
