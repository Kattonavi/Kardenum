import { SubPage, subpageMetadata } from "@/components/pages/sub-page";

export function generateMetadata({ params }: PageProps<"/[locale]/servicios/desarrollo/software-a-la-medida">) {
  return subpageMetadata("software-a-la-medida", params);
}

export default function Page({ params }: PageProps<"/[locale]/servicios/desarrollo/software-a-la-medida">) {
  return <SubPage id="software-a-la-medida" params={params} />;
}
