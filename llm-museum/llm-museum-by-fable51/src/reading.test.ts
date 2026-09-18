import { test } from "node:test";
import assert from "node:assert/strict";
import { MODELS, findBlock, tourBlocks } from "./content/index.ts";
import { pickViz } from "./content/types.ts";
import { blockParts, exampleSentence, introParts, joinParts } from "./reading.ts";
import { splitSentences } from "./speech.ts";

test("every exhibit has a running example and every tour stop explains it", () => {
  for (const model of MODELS) {
    assert.ok(model.example, `${model.id} has no running example`);
    for (const block of tourBlocks(model)) {
      assert.ok(block.example, `${model.id}/${block.id} has no example story`);
      for (const locale of ["zh", "en"] as const) {
        assert.ok(block.example.story[locale].length > 40, `${block.id} ${locale} story is too short`);
        const viz = pickViz(block.example.viz, locale);
        assert.ok(viz, `${block.id} ${locale} has no visualisation`);
      }
    }
  }
});

test("repeated layers inherit the example of the block they were cloned from", () => {
  const deepseek = MODELS.find((m) => m.id === "deepseek-v41-flash");
  assert.ok(deepseek);
  const clone = findBlock(deepseek, "d-moe-g");
  const original = findBlock(deepseek, "d-moe-a");
  assert.ok(clone && original);
  assert.equal(clone.clonedFrom, "d-moe-a");
  assert.equal(clone.example, original.example);
});

test("module narration reads title, one-liner, example story, then the explanation", () => {
  const llama = MODELS.find((m) => m.id === "llama3");
  assert.ok(llama);
  const gqa = findBlock(llama, "l-gqa");
  assert.ok(gqa);
  const parts = blockParts(gqa, "zh");
  assert.deepEqual(
    parts.map((p) => p.role),
    ["title", "brief", "story", "detail"],
  );
  assert.equal(parts[0]?.spoken, "分組查詢注意力 GQA。");
  assert.ok(parts[2]?.spoken.includes("「是」把注意力放在「山」"));
  // Sentence boundaries used for highlighting line up with the spoken text.
  const spokenSentences = splitSentences(joinParts(parts));
  const perPart = parts.flatMap((p) => splitSentences(p.spoken));
  assert.deepEqual(spokenSentences, perPart);
});

test("the exhibit introduction ends with the example sentence without doubling punctuation", () => {
  for (const model of MODELS) {
    for (const locale of ["zh", "en"] as const) {
      const parts = introParts(model, locale);
      assert.equal(parts.at(-1)?.role, "example");
      const sentence = exampleSentence(model, locale);
      assert.equal(parts.at(-1)?.spoken, sentence);
      assert.doesNotMatch(sentence, /[。.]["」]\s*[。.]$/, `${model.id} ${locale} doubles the terminator`);
    }
  }
});

test("attention visualisations have rows that sum to one", () => {
  const transformer = MODELS.find((m) => m.id === "transformer");
  assert.ok(transformer);
  for (const id of ["t-enc-attn", "t-dec-mattn", "t-dec-xattn"]) {
    const block = findBlock(transformer, id);
    assert.ok(block?.example);
    for (const locale of ["zh", "en"] as const) {
      const viz = pickViz(block.example.viz, locale);
      assert.ok(viz && viz.type === "heat", `${id} ${locale} should be a heat map`);
      for (const row of viz.rows) {
        const sum = row.values.reduce<number>((a, v) => a + (v ?? 0), 0);
        assert.ok(Math.abs(sum - 1) < 0.011, `${id} ${locale} row ${row.label} sums to ${sum}`);
      }
    }
  }
});
