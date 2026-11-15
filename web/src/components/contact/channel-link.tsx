import type { ReactNode } from "react";
import { type ContactChannel, getChannelHref } from "@/lib/contact";

type ChannelLinkProps = {
  channel: ContactChannel;
  className?: string;
  children: ReactNode;
};

/**
 * Link to a contact channel. While the channel's data is pending in site.config.ts it keeps
 * its look but is not a link: it is announced as unavailable and cannot be activated.
 */
export function ChannelLink({ channel, className = "", children }: ChannelLinkProps) {
  const href = getChannelHref(channel);

  if (href === null) {
    return (
      <span role="link" aria-disabled="true" className={`${className} cursor-not-allowed`}>
        {children}
      </span>
    );
  }

  const external = href.startsWith("http");
  return (
    <a href={href} className={className} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {children}
    </a>
  );
}
