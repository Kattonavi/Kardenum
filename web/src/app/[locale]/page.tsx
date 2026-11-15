import { useTranslations } from "next-intl";
import { Container } from "@/components/layout/container";

// Placeholder until the home page is built from maqueta B-Gremio-inicio-v2.
export default function Home() {
  const t = useTranslations("Home");

  return (
    <section className="flex flex-1 flex-col justify-center bg-ink py-24 text-stone">
      <Container className="flex flex-col gap-4">
        <h1 className="text-4xl font-semibold tracking-[0.06em] uppercase font-stretch-[125%]">Kardenum</h1>
        <p className="text-lg text-ash">{t("descriptor")}</p>
        <p className="font-mono text-xs tracking-[0.14em] text-ash uppercase">{t("status")}</p>
      </Container>
    </section>
  );
}
