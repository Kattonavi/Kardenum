import type { ComponentPropsWithoutRef } from "react";

// Page width from the mockups: 1200 px max, 20 px gutters on phones, 40 px from lg up.
export function Container({ className = "", ...props }: ComponentPropsWithoutRef<"div">) {
  return <div className={`mx-auto w-full max-w-[1200px] px-5 lg:px-10 ${className}`} {...props} />;
}
