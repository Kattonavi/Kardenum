"use client";

import { usePathname } from "@/i18n/navigation";
import { type FooterNotice, footerNotices } from "@/routes";

/**
 * Trademark notices at the bottom of the footer. Which ones apply depends on the page, and the
 * footer lives in the layout, so the route is read here. It is rendered at build time for each
 * page: the notices are in the server HTML, not added by JavaScript.
 */
export function FooterNotices({ texts }: { texts: Record<FooterNotice, string> }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-1 font-mono text-[11px] leading-[1.6] tracking-[0.08em] text-(--muted-text) uppercase">
      {footerNotices(pathname).map((notice) => (
        <p key={notice}>{texts[notice]}</p>
      ))}
    </div>
  );
}
