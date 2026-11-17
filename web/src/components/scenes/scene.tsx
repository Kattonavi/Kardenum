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
        <span className="sc-dev-url">{t("url")}</span>
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
          <span className="sc-dev-cart-title">{t("cart")}</span>
          <span className="sc-dev-line" />
          <span className="sc-dev-line" />
          <span className="sc-dev-pay">{t("pay")}</span>
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
        <span className="sc-des-sample">Aa</span>
        <span className="sc-des-face">Archivo Expanded</span>
      </div>
      <div className="sc-des-piece">
        <span className="sc-des-bar" />
        <span className="sc-des-bar" />
        <span className="sc-des-caption">{t("piece")}</span>
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
          <span className="sc-vid-time">00:12:08</span>
        </div>
        <div className="sc-vid-formats">
          {VIDEO_FORMATS.map((format) => (
            <span key={format} className="sc-vid-format">
              {format}
            </span>
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
        <span className="sc-mc-title">{t("console")}</span>
        {CONSOLE_LINES.map((line, index) => (
          <span key={line} className="sc-mc-line">
            [12:04:1{index + 1}] {t(line)}
          </span>
        ))}
        <span className="sc-mc-line sc-mc-ready">[12:04:16] {t("ready")}</span>
        <span className="sc-mc-prompt">
          &gt; <span>_</span>
        </span>
      </div>
      <div className="sc-mc-panel">
        <div className="sc-mc-box">
          <span className="sc-mc-label">{t("players")}</span>
          <div className="sc-mc-bars">
            {range(8).map((bar) => (
              <span key={bar} className="sc-mc-bar" />
            ))}
          </div>
        </div>
        <div className="sc-mc-box">
          <span className="sc-mc-label">{t("performance")}</span>
          <span className="sc-mc-meter" />
        </div>
        <div className="sc-mc-box">
          <span className="sc-mc-label">{t("shop")}</span>
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
        <span className="sc-dc-server">{t("server")}</span>
        {CHANNELS.map((channel) => (
          <span key={channel} className={`sc-dc-channel${channel === "support" ? " sc-dc-channel--on" : ""}`}>
            # {t(channel)}
          </span>
        ))}
      </div>
      <div className="sc-dc-chat">
        <div className="sc-dc-message">
          <div className="sc-dc-body">
            <span className="sc-dc-author">{t("member")}</span>
            <span className="sc-dc-command">{t("command")}</span>
          </div>
        </div>
        <div className="sc-dc-message sc-dc-message--bot">
          <div className="sc-dc-body">
            <span className="sc-dc-author">{t("bot")}</span>
            <div className="sc-dc-card">
              <span className="sc-dc-card-title">{t("ticket")}</span>
              <span className="sc-dc-actions">
                <span className="sc-dc-action">{t("assign")}</span>
                <span className="sc-dc-action">{t("close")}</span>
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
