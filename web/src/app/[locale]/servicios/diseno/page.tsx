import { LinePage, lineMetadata } from "@/components/pages/line-page";

export function generateMetadata({ params }: PageProps<"/[locale]/servicios/diseno">) {
  return lineMetadata("diseno", params);
}

export default function Page({ params }: PageProps<"/[locale]/servicios/diseno">) {
  return <LinePage id="diseno" params={params} />;
}
