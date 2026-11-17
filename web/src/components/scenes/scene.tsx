import { useTranslations } from "next-intl";
import type { ServiceLineId } from "@/content/types";
// Loaded only by the pages that draw a scene, as a sheet of their own (spec 013, RF-40).
import "@/app/motion.css";

/**
 * A scene: what a service line delivers, drawn with HTML and CSS (spec 012, RF-10 to RF-14;
 * styles, words and movement in src/app/scenes.css). It is a picture, so the container is
 * role="img" with a translated description and everything inside is hidden from screen readers.
 *
 * Server component, no script. Limits of what a scene may show: no client names, no result
 * figures, no official Minecraft art, no Discord logo or exact interface.
 *
 * Two things here are shaped by the weight of the page (spec 012, decisions 11 and 20; the home
 * page shows thirteen scenes and its document has to fit in the first TCP flight):
 *
 * - The words inside a scene are not in the document: the stylesheet draws them, in the language
 *   of the page (`content` under `:lang()`). They are part of the picture. As text of the page,
 *   a few pixels tall, every audit would count them as illegible and, on the dimmed slides of the
 *   carousel, as low-contrast text; and a search engine would read "Carrito, Pagar" as content.
 * - What is inside a scene is one fixed piece of HTML per line, written once below, and not a
 *   tree of React elements: Next writes every element of a page twice (the HTML and the data it
 *   sends along), and as elements the scenes took a quarter of the document.
 */

type SceneProps = {
  line: ServiceLineId;
  /** Without its own border, for a card that already draws one. */
  bare?: boolean;
  className?: string;
};

const FRAME: Record<ServiceLineId, string> = {
  desarrollo: "scene-frame",
  diseno: "scene-frame scene-frame--light",
  video: "scene-frame scene-frame--ink",
  minecraft: "scene-frame scene-frame--coal",
  discord: "scene-frame",
};

/** One piece of a scene. They are all spans: the stylesheet decides how each one is laid out. */
const piece = (name: string, inside = "") => `<span class="${name}">${inside}</span>`;
const times = (count: number, html: string) => html.repeat(count);

/** The symbol of the brand, for the board of the design scene. Its colors are set in the stylesheet. */
const SYMBOL =
  '<svg viewBox="0 0 640 640">' +
  '<path d="M0 0 L160 0 L160 80 L80 80 L80 560 L160 560 L160 640 L0 640 Z"/>' +
  '<path d="M526.86 0 L640 0 L320 320 L640 640 L526.86 640 L206.86 320 Z"/>' +
  '<path d="M416 272 L512 272 L512 368 L416 368 Z"/>' +
  "</svg>";

/**
 * What is inside each scene. Static and written here, never from data: it is the only thing
 * that feeds dangerouslySetInnerHTML below.
 */
const BODY: Record<ServiceLineId, string> = {
  // I · A browser window with a store: a grid of products and the cart.
  desarrollo: piece(
    "sc-dev",
    piece("sc-dev-bar", times(3, piece("sc-dev-dot")) + piece("sc-dev-url")) +
      piece(
        "sc-dev-body",
        piece("sc-dev-grid", times(6, piece("sc-dev-item", piece("sc-dev-name") + piece("sc-dev-price")))) +
          piece("sc-dev-cart", piece("sc-dev-cart-title") + times(2, piece("sc-dev-line")) + piece("sc-dev-pay")),
      ),
  ),
  // II · A brand board: symbol, palette, type sample and a piece for social media.
  diseno: piece(
    "sc-des",
    piece("sc-des-symbol", SYMBOL) +
      piece("sc-des-palette", times(5, piece("sc-des-swatch"))) +
      piece("sc-des-type", piece("sc-des-sample") + piece("sc-des-face")) +
      piece("sc-des-piece", times(2, piece("sc-des-bar")) + piece("sc-des-caption")),
  ),
  // III · A viewer, the formats a piece is delivered in and a timeline with three tracks (4, 3 and 3 clips).
  video:
    piece(
      "sc-vid-top",
      piece("sc-vid-viewer", piece("sc-vid-runner") + piece("sc-vid-title") + piece("sc-vid-sub") + piece("sc-vid-time")) +
        piece("sc-vid-formats", times(4, piece("sc-vid-format"))),
    ) +
    piece("sc-vid-timeline", [4, 3, 3].map((clips) => piece("sc-vid-track", times(clips, piece("sc-vid-clip")))).join("") + piece("sc-vid-head")),
  // IV · The console of a server and its panel: players, performance and the server store.
  minecraft: piece(
    "sc-mc",
    piece("sc-mc-console", piece("sc-mc-title") + times(4, piece("sc-mc-line")) + piece("sc-mc-line sc-mc-ready") + piece("sc-mc-prompt", piece("sc-mc-cursor"))) +
      piece(
        "sc-mc-panel",
        piece("sc-mc-box", piece("sc-mc-label") + piece("sc-mc-bars", times(8, piece("sc-mc-bar")))) +
          piece("sc-mc-box", piece("sc-mc-label") + piece("sc-mc-meter")) +
          piece("sc-mc-box", piece("sc-mc-label") + piece("sc-mc-items", piece("sc-mc-item"))),
      ),
  ),
  // V · A chat with its channels: a member runs a command and a bot answers with a ticket.
  discord: piece(
    "sc-dc",
    piece("sc-dc-channels", piece("sc-dc-server") + times(2, piece("sc-dc-channel")) + piece("sc-dc-channel sc-dc-channel--on") + piece("sc-dc-channel")) +
      piece(
        "sc-dc-chat",
        piece("sc-dc-message", piece("sc-dc-body", piece("sc-dc-author") + piece("sc-dc-command"))) +
          piece(
            "sc-dc-message sc-dc-message--bot",
            piece("sc-dc-body", piece("sc-dc-author") + piece("sc-dc-card", piece("sc-dc-card-title") + piece("sc-dc-actions", times(2, piece("sc-dc-action"))))),
          ) +
          piece("sc-dc-typing", times(3, piece("sc-dc-dot"))),
      ),
  ),
};

export function Scene({ line, bare = false, className }: SceneProps) {
  const t = useTranslations("Scenes");

  return (
    <div role="img" aria-label={t(`${line}.label`)} data-scene={line} className={`scene${bare ? " scene--bare" : ""}${className ? ` ${className}` : ""}`}>
      <div aria-hidden="true" className={FRAME[line]} dangerouslySetInnerHTML={{ __html: BODY[line] }} />
    </div>
  );
}
