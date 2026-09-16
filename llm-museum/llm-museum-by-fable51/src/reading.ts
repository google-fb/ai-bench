import type { Block, ModelSpec } from "./content/types.ts";
import { pick, type Locale } from "./i18n.ts";

/** One piece of narration: what is displayed and what is spoken (always ends a sentence). */
export interface ReadingPart {
  text: string;
  spoken: string;
}

/**
 * The pieces of text that are read aloud for an exhibit or a module, in order.
 * The panel renders exactly these pieces (split into sentences) so the sentence
 * being spoken can be highlighted.
 */
export function introParts(model: ModelSpec, locale: Locale): ReadingPart[] {
  return [pick(model.name, locale), pick(model.tagline, locale), pick(model.intro, locale)].map((t) => part(t, locale));
}

export function blockParts(block: Block, locale: Locale): ReadingPart[] {
  return [pick(block.label, locale), pick(block.brief, locale), pick(block.detail, locale)].map((t) => part(t, locale));
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

function part(text: string, locale: Locale): ReadingPart {
  const trimmed = text.trim();
  if (/[。！？；!?.]["”」』）)]*$/.test(trimmed)) return { text: trimmed, spoken: trimmed };
  return { text: trimmed, spoken: trimmed + (locale === "zh" ? "。" : ".") };
}
