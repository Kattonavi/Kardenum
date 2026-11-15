"use client";

import { useSyncExternalStore } from "react";

// Nothing changes after the first client render: there is nothing to subscribe to.
const subscribeToNothing = () => () => {};

/**
 * False in the server HTML and until React takes over the page; true from then on.
 *
 * A control that only works through its script (the menu button, the quote form) is `disabled`
 * while this is false. Before that moment a tap would do nothing and say nothing, and a field
 * would be emptied when React takes over; a disabled control is honest about it, to people,
 * to assistive technology and to the browser tests, which wait for it instead of racing it.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );
}
