import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("Home");

  return (
    <main className="flex min-h-dvh flex-col justify-center bg-ink px-6 text-stone">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
        <h1 className="text-4xl font-semibold tracking-[0.06em] uppercase font-stretch-[125%]">Kardenum</h1>
        <p className="text-lg text-ash">{t("descriptor")}</p>
        <p className="font-mono text-xs tracking-[0.14em] text-ash uppercase">{t("status")}</p>
      </div>
    </main>
  );
}
