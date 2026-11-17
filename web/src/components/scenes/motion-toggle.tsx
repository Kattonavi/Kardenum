import { useTranslations } from "next-intl";

/**
 * The control that pauses the movement of every scene on the page (spec 012, RF-15; WCAG 2.2.2:
 * anything that moves by itself for more than five seconds can be paused). One per page.
 *
 * It is a native checkbox with the look of a button, and the pause is a style rule that reads it
 * (`:has(:checked)` in src/app/scenes.css): it works before any script loads, and without one.
 * The label stays the same in both states, so the name a screen reader says is the text on screen.
 */
export function MotionToggle({ className }: { className?: string }) {
  const t = useTranslations("Scenes");

  return (
    <label className={`motion-toggle${className ? ` ${className}` : ""}`}>
      <input type="checkbox" />
      <span aria-hidden="true" className="motion-toggle-mark" />
      {t("pause")}
    </label>
  );
}
