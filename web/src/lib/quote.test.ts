import assert from "node:assert/strict";
import { test } from "node:test";
import { QUOTE_LIMITS, buildQuoteMessage, buildWhatsAppUrl, cleanDescription, cleanName, parseLineParam } from "@/lib/quote";

const labels = { greeting: "Hola, Kardenum.", introduction: "Soy {name}.", line: "Línea", project: "Proyecto", deadline: "Plazo" };
const base = { name: "Ana, Café Sur", line: "Desarrollo", projectType: "Tienda online", deadline: "En uno a tres meses", description: "Quiero vender café en línea." };

test("RF-4: the message carries greeting, line, project, deadline and the idea", () => {
  assert.equal(
    buildQuoteMessage(base, labels),
    "Hola, Kardenum. Soy Ana, Café Sur.\nLínea: Desarrollo\nProyecto: Tienda online\nPlazo: En uno a tres meses\n\nQuiero vender café en línea.",
  );
});

test("RF-4: without a name there is no introduction; without an idea, no last paragraph", () => {
  assert.equal(
    buildQuoteMessage({ ...base, name: "   ", description: "" }, labels),
    "Hola, Kardenum.\nLínea: Desarrollo\nProyecto: Tienda online\nPlazo: En uno a tres meses",
  );
});

test("RF-7: the name becomes one clean line within its limit", () => {
  assert.equal(cleanName("  Ana \n  María\t Ruiz  "), "Ana María Ruiz");
  assert.equal(cleanName("x".repeat(200)).length, QUOTE_LIMITS.name);
  assert.equal(cleanName("Ana\u0000\u0007 Ruiz"), "Ana Ruiz");
});

test("RF-7: the idea keeps its paragraphs, without runs of blank lines, within its limit", () => {
  assert.equal(cleanDescription("  Uno.  \r\n\r\n\r\n\r\nDos   con   espacios. \n Tres.  "), "Uno.\n\nDos con espacios.\nTres.");
  assert.equal(cleanDescription("a".repeat(5000)).length, QUOTE_LIMITS.description);
  assert.equal(cleanDescription("\u0001\u0002"), "");
});

test("RF-4: the WhatsApp link encodes the whole message and uses only the digits of the number", () => {
  const message = buildQuoteMessage({ ...base, description: "¿Precio & plazo? 100% listo #ya\nSegunda línea + más" }, labels);
  const url = buildWhatsAppUrl("+57 (300) 123-4567", message);
  assert.ok(url.startsWith("https://wa.me/573001234567?text="));
  const parsed = new URL(url);
  assert.equal(parsed.searchParams.get("text"), message);
  // Nothing of the message can escape into another parameter or the fragment.
  assert.deepEqual([...parsed.searchParams.keys()], ["text"]);
  assert.equal(parsed.hash, "");
});

test("RF-8: only the five known lines are accepted from the address", () => {
  const ids = ["desarrollo", "diseno", "video", "minecraft", "discord"] as const;
  assert.equal(parseLineParam("minecraft", ids), "minecraft");
  for (const value of [null, undefined, "", "Minecraft", "minecraft ", "otra", "<script>", "__proto__"]) {
    assert.equal(parseLineParam(value, ids), null, String(value));
  }
});
