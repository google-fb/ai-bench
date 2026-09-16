import { test } from "node:test";
import assert from "node:assert/strict";
import { scoreVoice, splitSentences } from "./speech.ts";

test("splits Traditional Chinese text on full-width terminators and keeps them", () => {
  const text = "模型看不懂文字，只看得懂數字。輸入嵌入層是一張查表！它需要學習嗎？不需要。";
  assert.deepEqual(splitSentences(text), [
    "模型看不懂文字，只看得懂數字。",
    "輸入嵌入層是一張查表！",
    "它需要學習嗎？",
    "不需要。",
  ]);
});

test("splits English text on sentence punctuation but not on decimals or abbreviations", () => {
  const text = "Llama 3.1 raised the base to 500,000. It works well! Does it scale? Yes.";
  assert.deepEqual(splitSentences(text), [
    "Llama 3.1 raised the base to 500,000.",
    "It works well!",
    "Does it scale?",
    "Yes.",
  ]);
});

test("keeps closing quotes and brackets attached to the sentence", () => {
  const text = "它叫做「因果語言模型」。The paper is “Attention Is All You Need”. Done.";
  assert.deepEqual(splitSentences(text), [
    "它叫做「因果語言模型」。",
    "The paper is “Attention Is All You Need”.",
    "Done.",
  ]);
});

test("breaks over-long sentences at commas so Chrome does not cut them off", () => {
  const clause = "這是一個非常長的子句，";
  const text = clause.repeat(30) + "結束。";
  const parts = splitSentences(text, 60);
  assert.ok(parts.length > 1);
  for (const part of parts) assert.ok(part.length <= 60, `chunk too long: ${part.length}`);
  assert.equal(parts.join(""), text);
});

test("hard-splits punctuation-free text as a last resort", () => {
  const text = "a".repeat(400);
  const parts = splitSentences(text, 160);
  assert.deepEqual(
    parts.map((p) => p.length),
    [160, 160, 80],
  );
});

test("collapses whitespace and ignores empty input", () => {
  assert.deepEqual(splitSentences("   \n\t  "), []);
  assert.deepEqual(splitSentences("One   two.\n\nThree."), ["One two.", "Three."]);
});

test("scoreVoice prefers Taiwanese Mandarin, then other Chinese, and rejects other languages", () => {
  const tw = scoreVoice({ lang: "zh-TW", name: "Mei-Jia" }, "zh-TW");
  const cn = scoreVoice({ lang: "zh-CN", name: "Tingting" }, "zh-TW");
  const hk = scoreVoice({ lang: "zh_HK", name: "Sin-ji" }, "zh-TW");
  const en = scoreVoice({ lang: "en-US", name: "Samantha" }, "zh-TW");
  assert.ok(tw > hk && hk > cn && cn > 0);
  assert.equal(en, 0);
});

test("scoreVoice rewards natural-sounding local English voices", () => {
  const plain = scoreVoice({ lang: "en-GB", name: "Daniel" }, "en-US");
  const natural = scoreVoice({ lang: "en-US", name: "Microsoft Aria Online (Natural)", localService: false }, "en-US");
  const local = scoreVoice({ lang: "en-US", name: "Alex", localService: true, default: true }, "en-US");
  assert.ok(natural > plain);
  assert.ok(local > plain);
});
