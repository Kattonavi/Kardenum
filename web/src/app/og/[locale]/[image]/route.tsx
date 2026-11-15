import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { getPageMeta, hasPageMeta } from "@/content/pages";
import { type AppLocale, isAppLocale, locales } from "@/i18n/locales";
import { brand } from "@/lib/brand";
import { OG_IMAGE_SIZE, OG_PADDING_X, ogImageName, ogTitleFontSize } from "@/lib/seo/metadata";
import { type AppPathname, appPathnames } from "@/routes";
import { siteConfig } from "@/site.config";

// Social images (Open Graph), one per page and language, generated at build time:
// /og/es/inicio.png, /og/en/home.png. Nothing is rendered on demand.
export const dynamic = "force-static";
export const dynamicParams = false;

const imagePages = appPathnames.filter(hasPageMeta);

export function generateStaticParams() {
  return imagePages.flatMap((pathname) => locales.map((locale) => ({ locale, image: ogImageName(pathname, locale) })));
}

const fontDir = path.join(process.cwd(), "src", "assets", "fonts");

function findPage(locale: string, image: string): { pathname: AppPathname; locale: AppLocale } | undefined {
  if (!isAppLocale(locale)) return undefined;
  const pathname = imagePages.find((page) => ogImageName(page, locale) === image);
  return pathname ? { pathname, locale } : undefined;
}

export async function GET(_request: Request, context: RouteContext<"/og/[locale]/[image]">) {
  const params = await context.params;
  const page = findPage(params.locale, params.image);
  if (!page) return new Response("Not found", { status: 404 });

  const text = getPageMeta(page.pathname).og[page.locale];
  const lines = text.accent ? [...text.lines, text.accent] : text.lines;
  const fontSize = ogTitleFontSize(lines);
  const [archivo, mono] = await Promise.all([
    readFile(path.join(fontDir, "ArchivoExpanded-SemiBold.ttf")),
    readFile(path.join(fontDir, "JetBrainsMono-Medium.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: brand.ink,
          color: brand.stone,
          padding: `64px ${OG_PADDING_X}px 68px`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="44" height="44" viewBox="0 0 640 640">
            <path fill={brand.stone} d="M0 0 L160 0 L160 80 L80 80 L80 560 L160 560 L160 640 L0 640 Z" />
            <path fill={brand.stone} d="M526.86 0 L640 0 L320 320 L640 640 L526.86 640 L206.86 320 Z" />
            <path fill={brand.bronze} d="M416 272 L512 272 L512 368 L416 368 Z" />
          </svg>
          <div style={{ fontFamily: "Archivo", fontSize: 30, letterSpacing: "0.16em" }}>{siteConfig.name.toUpperCase()}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 12, height: 12, backgroundColor: brand.bronze }} />
            <div style={{ fontFamily: "JetBrains Mono", fontSize: 20, letterSpacing: "0.16em", color: brand.ash }}>
              {text.label.toUpperCase()}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontFamily: "Archivo",
              fontSize,
              lineHeight: 1.08,
              letterSpacing: "0.01em",
              whiteSpace: "nowrap",
            }}
          >
            {text.lines.map((line) => (
              <div key={line}>{line.toUpperCase()}</div>
            ))}
            {text.accent ? <div style={{ color: brand.bronze }}>{text.accent.toUpperCase()}</div> : null}
          </div>
        </div>
      </div>
    ),
    {
      ...OG_IMAGE_SIZE,
      fonts: [
        { name: "Archivo", data: archivo, weight: 600, style: "normal" },
        { name: "JetBrains Mono", data: mono, weight: 500, style: "normal" },
      ],
    },
  );
}
