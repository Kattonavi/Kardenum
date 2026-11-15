import { notFound } from "next/navigation";
import * as rootParams from "next/root-params";
import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

// The locale comes from the [locale] root segment (next/root-params), which keeps pages static.
// Only the configured locales are accepted.
// Any other value (e.g. "/sitemap.xml" captured by the [locale] segment) is a 404, never a missing-file 500.
export default getRequestConfig(async ({ locale }) => {
  const resolved = locale ?? (await rootParams.locale());
  if (!hasLocale(routing.locales, resolved)) notFound();

  return {
    locale: resolved,
    messages: (await import(`../../messages/${resolved}.json`)).default,
  };
});
