import type { AppLocale } from "../i18n/locales";

/**
 * The language bar (docs/specs/001-barra-de-idioma.md). The site never redirects by language:
 * a bar offers the other version and the visitor's choice is remembered in a first-party cookie.
 */
export const LANGUAGE_COOKIE = "kardenum_lang";
export const LANGUAGE_OFFER_ATTRIBUTE = "data-lang-offer";

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

/**
 * Inline script that runs before the first paint (pages are static, so the decision is made
 * in the browser) and marks <html> when the other language should be offered. Deciding before
 * paint means the bar never pushes the page down after it is visible (no layout shift).
 *
 * Preferred language = the remembered choice, or else Spanish for Spanish browsers and English
 * for everyone else. The bar is offered when it differs from the language of the page.
 */
export const languageOfferScript =
  "(function(){try{" +
  "var d=document.documentElement;" +
  `var m=document.cookie.match(/(?:^|; )${LANGUAGE_COOKIE}=(es|en)/);` +
  'var p=m?m[1]:(/^es(-|$)/i.test(navigator.language||"")?"es":"en");' +
  `if(p!==d.lang)d.setAttribute("${LANGUAGE_OFFER_ATTRIBUTE}","");` +
  "}catch(e){}})();";

/** Remembers the language the visitor chose (switching language or dismissing the bar). */
export function rememberLanguage(locale: AppLocale): void {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${LANGUAGE_COOKIE}=${locale}; Path=/; Max-Age=${ONE_YEAR_IN_SECONDS}; SameSite=Lax${secure}`;
}

export function hideLanguageOffer(): void {
  document.documentElement.removeAttribute(LANGUAGE_OFFER_ATTRIBUTE);
}
