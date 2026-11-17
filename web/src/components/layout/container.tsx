import type { ComponentPropsWithoutRef } from "react";

// Page width from the phase 2 mockups (spec 013, RF-1): 1320 px max, 20 px gutters on phones, 48 px from lg up.
export function Container({ className = "", ...props }: ComponentPropsWithoutRef<"div">) {
  return <div className={className ? `page-width ${className}` : "page-width"} {...props} />;
}
