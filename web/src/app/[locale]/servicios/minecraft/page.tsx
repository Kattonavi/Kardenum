import { LinePage, lineMetadata } from "@/components/pages/line-page";

export function generateMetadata({ params }: PageProps<"/[locale]/servicios/minecraft">) {
  return lineMetadata("minecraft", params);
}

export default function Page({ params }: PageProps<"/[locale]/servicios/minecraft">) {
  return <LinePage id="minecraft" params={params} />;
}
