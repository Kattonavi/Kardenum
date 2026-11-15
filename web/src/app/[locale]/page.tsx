import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { use } from "react";
import { Container } from "@/components/layout/container";
import { JsonLd } from "@/components/seo/json-ld";
import { isAppLocale } from "@/i18n/locales";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();
  return buildPageMetadata("/", locale);
}

// Placeholder until the home page is built from maqueta B-Gremio-inicio-v2.
export default function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = use(params);
  if (!isAppLocale(locale)) notFound();
  const t = useTranslations("Home");

  return (
    <section className="flex flex-1 flex-col justify-center bg-ink py-24 text-stone">
      <JsonLd nodes={[organizationJsonLd(locale), websiteJsonLd(locale)]} />
      <Container className="flex flex-col gap-4">
        <h1 className="text-4xl font-semibold tracking-[0.06em] uppercase font-stretch-[125%]">Kardenum</h1>
        <p className="text-lg text-ash">{t("descriptor")}</p>
        <p className="font-mono text-xs tracking-[0.14em] text-ash uppercase">{t("status")}</p>
      </Container>
    </section>
  );
}
