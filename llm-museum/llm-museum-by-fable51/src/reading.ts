import type { Block, ModelSpec } from "./content/types.ts";
import { pick, type Locale } from "./i18n.ts";

/** One piece of narration: what is displayed and what is spoken (always ends a sentence). */
export interface ReadingPart {
  /** Which part of the card this is, so the panel can place its sentence spans. */
  role: "title" | "tagline" | "intro" | "example" | "brief" | "story" | "detail";
  text: string;
  spoken: string;
}

/**
 * The pieces of text that are read aloud for an exhibit or a module, in order.
 * The panel renders exactly these pieces (split into sentences) so the sentence
 * being spoken can be highlighted.
 */
export function introParts(model: ModelSpec, locale: Locale): ReadingPart[] {
  const parts: ReadingPart[] = [
    part("title", pick(model.name, locale), locale),
    part("tagline", pick(model.tagline, locale), locale),
    part("intro", pick(model.intro, locale), locale),
  ];
  if (model.example) parts.push(part("example", exampleSentence(model, locale), locale));
  return parts;
}

/** The one-sentence summary of the running example, used in the card and read aloud. */
export function exampleSentence(model: ModelSpec, locale: Locale): string {
  if (!model.example) return "";
  const input = pick(model.example.input, locale);
  const output = pick(model.example.output, locale);
  // The output already ends a sentence, so no terminator is appended after the closing quote.
  return locale === "zh"
    ? `本廳的範例：輸入是${input}，模型最後輸出「${output}」`
    : `Our running example: the input is ${input}, and the model finally answers "${output}"`;
}

export function blockParts(block: Block, locale: Locale): ReadingPart[] {
  const parts: ReadingPart[] = [part("title", pick(block.label, locale), locale), part("brief", pick(block.brief, locale), locale)];
  if (block.example) parts.push(part("story", pick(block.example.story, locale), locale));
  parts.push(part("detail", pick(block.detail, locale), locale));
  return parts;
}

export function joinParts(parts: ReadingPart[]): string {
  return parts.map((p) => p.spoken).join(" ");
}

/** Estimated speaking time used when the browser has no speech engine. */
export function estimateSpeechMs(text: string, locale: Locale, rate: number): number {
  const charsPerSecond = locale === "zh" ? 4.2 : 14;
  const ms = (text.length / (charsPerSecond * Math.max(0.5, rate))) * 1000;
  return Math.min(90_000, Math.max(3_000, Math.round(ms)));
}

function part(role: ReadingPart["role"], text: string, locale: Locale): ReadingPart {
  const trimmed = text.trim();
  if (/[。！？；!?.]["”」』）)]*$/.test(trimmed)) return { role, text: trimmed, spoken: trimmed };
  return { role, text: trimmed, spoken: trimmed + (locale === "zh" ? "。" : ".") };
}
