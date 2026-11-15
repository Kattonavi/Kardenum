import type { ComponentProps } from "react";
import { Link } from "@/i18n/navigation";
import { type AppPathname, isBuilt } from "@/routes";

type AppLinkProps = Omit<ComponentProps<typeof Link>, "href" | "prefetch"> & { href: AppPathname };

/**
 * Internal link to a route of the registry, in the visitor's language.
 * Routes whose page is not built yet are not prefetched, so the browser does not request
 * (and log) a 404 just because the link is on screen.
 */
export function AppLink({ href, ...props }: AppLinkProps) {
  return <Link href={href} prefetch={isBuilt(href) ? undefined : false} {...props} />;
}
