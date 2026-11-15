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

export function hasPendingChannels(config: SiteConfig = siteConfig): boolean {
  return contactChannels.some((channel) => getChannelHref(channel, config) === null);
}
