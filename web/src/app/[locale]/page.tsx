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
    <section className="flex flex-1 flex-col justify-center py-24 surface-ink">
      <JsonLd nodes={[organizationJsonLd(locale), websiteJsonLd(locale)]} />
      <Container className="flex flex-col gap-4">
        <h1 className="text-4xl tracking-[0.01em] type-display">
          {t("heroTitleLine1")} {t("heroTitleLine2")} <span className="text-bronze">{t("heroTitleAccent")}</span>
        </h1>
        <p className="max-w-[34rem] text-lg leading-[1.6] text-(--muted-text)">{t("heroText")}</p>
      </Container>
    </section>
  );
}
