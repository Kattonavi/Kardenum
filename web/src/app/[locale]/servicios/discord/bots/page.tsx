import { SubPage, subpageMetadata } from "@/components/pages/sub-page";

export function generateMetadata({ params }: PageProps<"/[locale]/servicios/discord/bots">) {
  return subpageMetadata("bots", params);
}

export default function Page({ params }: PageProps<"/[locale]/servicios/discord/bots">) {
  return <SubPage id="bots" params={params} />;
}
