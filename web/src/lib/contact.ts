import type { AppLocale } from "../i18n/locales";
import { localizedPath } from "../routes";
import { type SiteConfig, siteConfig } from "../site.config";

export const contactChannels = ["whatsapp", "discord", "email"] as const;
export type ContactChannel = (typeof contactChannels)[number];

/**
 * Where a contact channel leads, or null while its data is still pending in site.config.ts.
 * A pending channel is shown but is not a link: the site never points to an invented number or address.
 */
export function getChannelHref(channel: ContactChannel, config: SiteConfig = siteConfig): string | null {
  switch (channel) {
    case "whatsapp": {
      const { whatsapp } = config.contact;
      return whatsapp.status === "ready" ? `https://wa.me/${whatsapp.value.replace(/\D/g, "")}` : null;
    }
    case "discord": {
      const { discordInvite } = config.contact;
      return discordInvite.status === "ready" ? discordInvite.value : null;
    }
    case "email": {
      const { email } = config.contact;
      return email.status === "ready" ? `mailto:${email.value}` : null;
    }
  }
}

export function hasPendingChannels(channels: readonly ContactChannel[] = contactChannels, config: SiteConfig = siteConfig): boolean {
  return channels.some((channel) => getChannelHref(channel, config) === null);
}

/**
 * Address of the WhatsApp quote form on the Contact page, optionally with a service line
 * preselected (docs/specs/002-cotizador-whatsapp.md, RF-8). `anchor` is the id of the form section.
 */
export function quoteFormHref(locale: AppLocale, anchor: string, line?: string): string {
  const query = line ? `?linea=${encodeURIComponent(line)}` : "";
  return `${localizedPath("/contacto", locale)}${query}#${anchor}`;
}
