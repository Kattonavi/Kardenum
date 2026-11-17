import assert from "node:assert/strict";
import { test } from "node:test";
import { faqAnchor, faqGroups } from "./faq";
import { homeFaqs } from "./home";
import { linePages } from "./lines";
import { serviceLines } from "./service-lines";

test("the questions page has the general questions first and then one group per line, in menu order", () => {
  assert.equal(faqGroups[0]?.line, undefined);
  assert.deepEqual(faqGroups[0]?.items, homeFaqs);
  assert.deepEqual(faqGroups.slice(1).map((group) => group.line?.id), serviceLines.map((line) => line.id));
});

test("every question of the site is on the questions page, and a line never repeats a general answer", () => {
  const shown = faqGroups.flatMap((group) => group.items);
  for (const faq of [...homeFaqs, ...serviceLines.flatMap((line) => linePages[line.id].faq.items)]) {
    assert.ok(shown.some((item) => item.answer.es === faq.answer.es), `missing: ${faq.question.es}`);
  }
  // Nothing is repeated inside a group, and a line never repeats a general answer.
  const general = new Set(homeFaqs.map((faq) => faq.answer.es));
  for (const group of faqGroups) {
    const name = group.line?.id ?? "general";
    const questions = group.items.map((faq) => faq.question.es);
    assert.equal(new Set(questions).size, questions.length, `a question is repeated in ${name}`);
    if (group.line) assert.deepEqual(group.items.filter((faq) => general.has(faq.answer.es)), [], `${name} repeats a general answer`);
    assert.ok(group.items.length >= 2, `${name} has ${group.items.length} questions`);
  }
});

test("RF-31 (spec 013): no question is repeated word for word on the questions page, in either language", () => {
  for (const locale of ["es", "en"] as const) {
    const questions = faqGroups.flatMap((group) => group.items.map((faq) => faq.question[locale]));
    const repeated = questions.filter((question, index) => questions.indexOf(question) !== index);
    assert.deepEqual(repeated, [], `repeated in ${locale}`);
  }
});

test("RF-30 (spec 013): Minecraft and Discord each ask about their own server", () => {
  const question = (line: "minecraft" | "discord") => linePages[line].faq.items.find((faq) => faq.id === "administracion")?.question;
  assert.deepEqual(question("minecraft"), {
    es: "¿Administran el servidor de Minecraft después de la entrega?",
    en: "Do you manage the Minecraft server after delivery?",
  });
  assert.deepEqual(question("discord"), {
    es: "¿Administran el servidor de Discord después de la entrega?",
    en: "Do you manage the Discord server after delivery?",
  });
});

test("each group has its own anchor, in the language of the page", () => {
  assert.deepEqual(serviceLines.map((line) => faqAnchor(line, "es")), ["desarrollo", "diseno", "video", "minecraft", "discord"]);
  assert.deepEqual(serviceLines.map((line) => faqAnchor(line, "en")), ["development", "design", "video", "minecraft", "discord"]);
});
