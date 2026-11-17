import type { ComponentPropsWithoutRef } from "react";

// Page width from the mockups: 1200 px max, 20 px gutters on phones, 40 px from lg up.
export function Container({ className = "", ...props }: ComponentPropsWithoutRef<"div">) {
  return <div className={className ? `page-width ${className}` : "page-width"} {...props} />;
}
