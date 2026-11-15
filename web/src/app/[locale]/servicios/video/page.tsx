import { LinePage, lineMetadata } from "@/components/pages/line-page";

export function generateMetadata({ params }: PageProps<"/[locale]/servicios/video">) {
  return lineMetadata("video", params);
}

export default function Page({ params }: PageProps<"/[locale]/servicios/video">) {
  return <LinePage id="video" params={params} />;
}
