import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import type { ServiceLineId } from "@/content/types";

/**
 * A scene: what a service line delivers, drawn with HTML and CSS (spec 012, RF-10 to RF-14;
 * styles and movement in src/app/scenes.css). It is a picture, so the container is role="img"
 * with a translated description and everything inside is hidden from screen readers.
 *
 * Server component, no script. Limits of what a scene may show: no client names, no result
 * figures, no official Minecraft art, no Discord logo or exact interface.
 *
 * The words inside a scene are not text of the page: each one travels in a `data-t` attribute and
 * the stylesheet draws it (`content: attr(data-t)`). On a phone they are a few pixels tall, so as
 * real text every audit would count them as illegible and, on the dimmed slides of the carousel,
 * as low-contrast text; and a search engine would read "Carrito, Pagar" as content of the page.
 * They are translated all the same.
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

const BODY: Record<ServiceLineId, () => ReactNode> = {
  desarrollo: DevelopmentScene,
  diseno: DesignScene,
  video: VideoScene,
  minecraft: MinecraftScene,
  discord: DiscordScene,
};

export function Scene({ line, bare = false, className }: SceneProps) {
  const t = useTranslations("Scenes");
  const Body = BODY[line];

  return (
    <div role="img" aria-label={t(`${line}.label`)} data-scene={line} className={`scene${bare ? " scene--bare" : ""}${className ? ` ${className}` : ""}`}>
      <div aria-hidden="true" className={FRAME[line]}>
        <Body />
      </div>
    </div>
  );
}

const range = (length: number) => Array.from({ length }, (_, index) => index);

/** I · A browser window with a store: a grid of products and the cart. */
function DevelopmentScene() {
  const t = useTranslations("Scenes.desarrollo");

  return (
    <div className="sc-dev">
      <div className="sc-dev-bar">
        <span className="sc-dev-dot" />
        <span className="sc-dev-dot" />
        <span className="sc-dev-dot" />
        <span className="sc-dev-url sc-t" data-t={t("url")} />
      </div>
      <div className="sc-dev-body">
        <div className="sc-dev-grid">
          {range(6).map((item) => (
            <div key={item} className="sc-dev-item">
              <span className="sc-dev-name" />
              <span className="sc-dev-price" />
            </div>
          ))}
        </div>
        <div className="sc-dev-cart">
          <span className="sc-dev-cart-title sc-t" data-t={t("cart")} />
          <span className="sc-dev-line" />
          <span className="sc-dev-line" />
          <span className="sc-dev-pay sc-t" data-t={t("pay")} />
        </div>
      </div>
    </div>
  );
}

/** II · A brand board: symbol, palette, type sample and a piece for social media. */
function DesignScene() {
  const t = useTranslations("Scenes.diseno");

  return (
    <div className="sc-des">
      <div className="sc-des-symbol">
        <svg viewBox="0 0 640 640" focusable="false">
          <path fill="var(--color-stone)" d="M0 0 L160 0 L160 80 L80 80 L80 560 L160 560 L160 640 L0 640 Z" />
          <path fill="var(--color-stone)" d="M526.86 0 L640 0 L320 320 L640 640 L526.86 640 L206.86 320 Z" />
          <path fill="var(--color-bronze)" d="M416 272 L512 272 L512 368 L416 368 Z" />
        </svg>
      </div>
      <div className="sc-des-palette">
        {range(5).map((swatch) => (
          <span key={swatch} className="sc-des-swatch" />
        ))}
      </div>
      <div className="sc-des-type">
        <span className="sc-des-sample sc-t" data-t="Aa" />
        <span className="sc-des-face sc-t" data-t="Archivo Expanded" />
      </div>
      <div className="sc-des-piece">
        <span className="sc-des-bar" />
        <span className="sc-des-bar" />
        <span className="sc-des-caption sc-t" data-t={t("piece")} />
      </div>
    </div>
  );
}

const VIDEO_FORMATS = ["16:9", "9:16", "1:1", "4:5"] as const;
/** Clips per track of the timeline; their widths and colors are set in the stylesheet. */
const VIDEO_TRACKS = [4, 3, 3] as const;

/** III · A viewer, the formats a piece is delivered in and a timeline with three tracks. */
function VideoScene() {
  return (
    <>
      <div className="sc-vid-top">
        <div className="sc-vid-viewer">
          <span className="sc-vid-runner" />
          <span className="sc-vid-title" />
          <span className="sc-vid-sub" />
          <span className="sc-vid-time sc-t" data-t="00:12:08" />
        </div>
        <div className="sc-vid-formats">
          {VIDEO_FORMATS.map((format) => (
            <span key={format} className="sc-vid-format sc-t" data-t={format} />
          ))}
        </div>
      </div>
      <div className="sc-vid-timeline">
        {VIDEO_TRACKS.map((clips, track) => (
          <div key={track} className="sc-vid-track">
            {range(clips).map((clip) => (
              <span key={clip} className="sc-vid-clip" />
            ))}
          </div>
        ))}
        <span className="sc-vid-head" />
      </div>
    </>
  );
}

const CONSOLE_LINES = ["starting", "world", "plugins", "store"] as const;

/** IV · The console of a server and its panel: players, performance and the server store. */
function MinecraftScene() {
  const t = useTranslations("Scenes.minecraft");

  return (
    <div className="sc-mc">
      <div className="sc-mc-console">
        <span className="sc-mc-title">
          <span className="sc-t" data-t={t("console")} />
        </span>
        {CONSOLE_LINES.map((line, index) => (
          <span key={line} className="sc-mc-line sc-t" data-t={`[12:04:1${index + 1}] ${t(line)}`} />
        ))}
        <span className="sc-mc-line sc-mc-ready sc-t" data-t={`[12:04:16] ${t("ready")}`} />
        <span className="sc-mc-prompt sc-t" data-t=">">
          <span className="sc-t" data-t="_" />
        </span>
      </div>
      <div className="sc-mc-panel">
        <div className="sc-mc-box">
          <span className="sc-mc-label sc-t" data-t={t("players")} />
          <div className="sc-mc-bars">
            {range(8).map((bar) => (
              <span key={bar} className="sc-mc-bar" />
            ))}
          </div>
        </div>
        <div className="sc-mc-box">
          <span className="sc-mc-label sc-t" data-t={t("performance")} />
          <span className="sc-mc-meter" />
        </div>
        <div className="sc-mc-box">
          <span className="sc-mc-label sc-t" data-t={t("shop")} />
          <span className="sc-mc-items">
            <span />
          </span>
        </div>
      </div>
    </div>
  );
}

const CHANNELS = ["announcements", "general", "support", "store"] as const;

/** V · A chat with its channels: a member runs a command and a bot answers with a ticket. */
function DiscordScene() {
  const t = useTranslations("Scenes.discord");

  return (
    <div className="sc-dc">
      <div className="sc-dc-channels">
        <span className="sc-dc-server sc-t" data-t={t("server")} />
        {CHANNELS.map((channel) => (
          <span key={channel} className={`sc-dc-channel sc-t${channel === "support" ? " sc-dc-channel--on" : ""}`} data-t={`# ${t(channel)}`} />
        ))}
      </div>
      <div className="sc-dc-chat">
        <div className="sc-dc-message">
          <div className="sc-dc-body">
            <span className="sc-dc-author sc-t" data-t={t("member")} />
            <span className="sc-dc-command sc-t" data-t={t("command")} />
          </div>
        </div>
        <div className="sc-dc-message sc-dc-message--bot">
          <div className="sc-dc-body">
            <span className="sc-dc-author sc-t" data-t={t("bot")} />
            <div className="sc-dc-card">
              <span className="sc-dc-card-title sc-t" data-t={t("ticket")} />
              <span className="sc-dc-actions">
                <span className="sc-dc-action sc-t" data-t={t("assign")} />
                <span className="sc-dc-action sc-t" data-t={t("close")} />
              </span>
            </div>
          </div>
        </div>
        <span className="sc-dc-typing">
          <span />
          <span />
          <span />
        </span>
      </div>
    </div>
  );
}
