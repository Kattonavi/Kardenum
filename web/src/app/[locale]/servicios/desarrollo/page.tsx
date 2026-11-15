import { LinePage, lineMetadata } from "@/components/pages/line-page";

export function generateMetadata({ params }: PageProps<"/[locale]/servicios/desarrollo">) {
  return lineMetadata("desarrollo", params);
}

export default function Page({ params }: PageProps<"/[locale]/servicios/desarrollo">) {
  return <LinePage id="desarrollo" params={params} />;
}
