import { LinePage, lineMetadata } from "@/components/pages/line-page";

export function generateMetadata({ params }: PageProps<"/[locale]/servicios/discord">) {
  return lineMetadata("discord", params);
}

export default function Page({ params }: PageProps<"/[locale]/servicios/discord">) {
  return <LinePage id="discord" params={params} />;
}
