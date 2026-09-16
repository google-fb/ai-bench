import { BCP47, type Locale } from "./i18n.ts";

export type SpeechState = "idle" | "speaking" | "paused";

export interface SpeechSnapshot {
  state: SpeechState;
  sentenceIndex: number;
  sentenceCount: number;
}

const HARD_BREAK = /([。！？；!?]|\.(?=\s|$))(["”」』）)]*)/g;
const SOFT_BREAK = /([，、；,;:：]|\s—\s|——)/g;

/**
 * Splits text into sentence-sized chunks for speech synthesis.
 * Chrome silently stops long utterances (~15 s), so we keep chunks short and
 * use the same boundaries to highlight the sentence being read.
 */
export function splitSentences(text: string, maxLen = 160): string[] {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) return [];

  const sentences: string[] = [];
  let last = 0;
  for (const match of normalized.matchAll(HARD_BREAK)) {
    const end = match.index + match[0].length;
    sentences.push(normalized.slice(last, end).trim());
    last = end;
  }
  if (last < normalized.length) sentences.push(normalized.slice(last).trim());

  const out: string[] = [];
  for (const sentence of sentences) {
    if (!sentence) continue;
    if (sentence.length <= maxLen) {
      out.push(sentence);
      continue;
    }
    out.push(...splitLong(sentence, maxLen));
  }
  return out;
}

function splitLong(sentence: string, maxLen: number): string[] {
  const parts: string[] = [];
  let buffer = "";
  let last = 0;
  const pushBuffer = () => {
    const trimmed = buffer.trim();
    if (trimmed) parts.push(trimmed);
    buffer = "";
  };
  for (const match of sentence.matchAll(SOFT_BREAK)) {
    const end = match.index + match[0].length;
    const piece = sentence.slice(last, end);
    if (buffer && buffer.length + piece.length > maxLen) pushBuffer();
    buffer += piece;
    last = end;
  }
  const tail = sentence.slice(last);
  if (buffer && buffer.length + tail.length > maxLen) pushBuffer();
  buffer += tail;
  pushBuffer();

  // Last resort for text without any punctuation at all.
  return parts.flatMap((p) => {
    if (p.length <= maxLen) return [p];
    const chunks: string[] = [];
    for (let i = 0; i < p.length; i += maxLen) chunks.push(p.slice(i, i + maxLen));
    return chunks;
  });
}

/** Ranks how well a voice matches the requested BCP-47 tag (higher is better). */
export function scoreVoice(voice: { lang: string; localService?: boolean; default?: boolean; name: string }, wanted: string): number {
  const lang = voice.lang.replace("_", "-").toLowerCase();
  const target = wanted.toLowerCase();
  const prefix = target.split("-")[0] ?? target;
  let score = 0;
  if (lang === target) score += 100;
  else if (lang.startsWith(prefix + "-") || lang === prefix) score += 60;
  else return 0;
  if (prefix === "zh") {
    if (lang === "zh-tw") score += 20;
    else if (lang === "zh-hk") score += 8;
  }
  if (voice.localService) score += 5;
  if (voice.default) score += 3;
  if (/natural|neural|premium|enhanced/i.test(voice.name)) score += 6;
  return score;
}

export interface SpeakOptions {
  onDone?: () => void;
}

type Listener = (snapshot: SpeechSnapshot) => void;

const RATE_KEY = "llm-museum.rate";
const VOICE_KEY = "llm-museum.voice.";

export class SpeechController {
  readonly supported: boolean;
  rate = 1;
  private synth: SpeechSynthesis | null = null;
  private queue: string[] = [];
  private index = 0;
  private current: SpeechSynthesisUtterance | null = null;
  private lang = BCP47.zh;
  private currentLocale: Locale = "zh";
  private state: SpeechState = "idle";
  private onDone: (() => void) | undefined;
  private listeners = new Set<Listener>();
  private voiceListeners = new Set<() => void>();
  private restartTimer: ReturnType<typeof setTimeout> | null = null;
  private rateTimer: ReturnType<typeof setTimeout> | null = null;
  private preferredVoice: Record<string, string | null> = {};

  constructor() {
    this.supported =
      typeof window !== "undefined" && "speechSynthesis" in window && typeof SpeechSynthesisUtterance !== "undefined";
    if (this.supported) {
      this.synth = window.speechSynthesis;
      this.synth.addEventListener?.("voiceschanged", () => {
        for (const l of this.voiceListeners) l();
      });
    }
    try {
      const savedRate = Number(localStorage.getItem(RATE_KEY));
      if (savedRate >= 0.5 && savedRate <= 2) this.rate = savedRate;
    } catch {
      /* storage unavailable */
    }
  }

  snapshot(): SpeechSnapshot {
    return { state: this.state, sentenceIndex: this.index, sentenceCount: this.queue.length };
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  onVoicesChanged(listener: () => void): () => void {
    this.voiceListeners.add(listener);
    return () => this.voiceListeners.delete(listener);
  }

  voicesFor(locale: Locale): SpeechSynthesisVoice[] {
    if (!this.synth) return [];
    const wanted = BCP47[locale];
    return this.synth
      .getVoices()
      .filter((v) => scoreVoice(v, wanted) > 0)
      .sort((a, b) => scoreVoice(b, wanted) - scoreVoice(a, wanted));
  }

  /** null means "pick automatically". */
  preferredVoiceFor(locale: Locale): string | null {
    if (locale in this.preferredVoice) return this.preferredVoice[locale] ?? null;
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(VOICE_KEY + locale);
    } catch {
      /* storage unavailable */
    }
    this.preferredVoice[locale] = saved;
    return saved;
  }

  setPreferredVoice(locale: Locale, voiceURI: string | null): void {
    this.preferredVoice[locale] = voiceURI;
    try {
      if (voiceURI) localStorage.setItem(VOICE_KEY + locale, voiceURI);
      else localStorage.removeItem(VOICE_KEY + locale);
    } catch {
      /* storage unavailable */
    }
    if (this.state !== "idle") this.restartCurrent();
  }

  resolveVoice(locale: Locale): SpeechSynthesisVoice | null {
    const candidates = this.voicesFor(locale);
    const preferred = this.preferredVoiceFor(locale);
    if (preferred) {
      const hit = this.synth?.getVoices().find((v) => v.voiceURI === preferred);
      if (hit) return hit;
    }
    return candidates[0] ?? null;
  }

  speak(text: string, locale: Locale, options: SpeakOptions = {}): void {
    if (!this.synth) {
      options.onDone?.();
      return;
    }
    this.cancelInternal();
    this.queue = splitSentences(text);
    this.index = 0;
    this.lang = BCP47[locale];
    this.currentLocale = locale;
    this.onDone = options.onDone;
    if (this.queue.length === 0) {
      this.setState("idle");
      options.onDone?.();
      return;
    }
    this.setState("speaking");
    // Chrome drops an utterance queued in the same tick as cancel().
    this.restartTimer = setTimeout(() => this.speakNext(), 40);
  }

  private speakNext(): void {
    if (!this.synth) return;
    if (this.index >= this.queue.length) {
      this.current = null;
      this.setState("idle");
      const done = this.onDone;
      this.onDone = undefined;
      done?.();
      return;
    }
    const sentence = this.queue[this.index] ?? "";
    const utterance = new SpeechSynthesisUtterance(sentence);
    utterance.lang = this.lang;
    utterance.rate = this.rate;
    utterance.pitch = 1;
    const voice = this.resolveVoice(this.currentLocale);
    if (voice) utterance.voice = voice;
    utterance.onstart = () => {
      if (this.current === utterance) this.emit();
    };
    utterance.onend = () => {
      if (this.current !== utterance) return;
      this.index += 1;
      this.speakNext();
    };
    utterance.onerror = (event) => {
      if (this.current !== utterance) return;
      if (event.error === "interrupted" || event.error === "canceled") return;
      this.index += 1;
      this.speakNext();
    };
    this.current = utterance;
    this.synth.speak(utterance);
    this.emit();
  }

  pause(): void {
    if (!this.synth || this.state !== "speaking") return;
    this.synth.pause();
    this.setState("paused");
  }

  resume(): void {
    if (!this.synth || this.state !== "paused") return;
    this.synth.resume();
    this.setState("speaking");
  }

  toggle(): void {
    if (this.state === "speaking") this.pause();
    else if (this.state === "paused") this.resume();
  }

  stop(): void {
    this.cancelInternal();
    this.queue = [];
    this.index = 0;
    this.onDone = undefined;
    this.setState("idle");
  }

  setRate(rate: number): void {
    this.rate = Math.min(2, Math.max(0.5, Math.round(rate * 10) / 10));
    try {
      localStorage.setItem(RATE_KEY, String(this.rate));
    } catch {
      /* storage unavailable */
    }
    if (this.state !== "idle") {
      // Sliders fire many events per second; restart once the value settles.
      if (this.rateTimer) clearTimeout(this.rateTimer);
      this.rateTimer = setTimeout(() => this.restartCurrent(), 150);
    }
  }

  /** Re-speaks the current sentence so a new rate or voice takes effect immediately. */
  private restartCurrent(): void {
    if (!this.synth) return;
    const index = this.index;
    this.current = null;
    if (this.restartTimer) clearTimeout(this.restartTimer);
    this.synth.cancel();
    this.index = index;
    this.setState("speaking");
    this.restartTimer = setTimeout(() => this.speakNext(), 40);
  }

  private cancelInternal(): void {
    if (this.restartTimer) {
      clearTimeout(this.restartTimer);
      this.restartTimer = null;
    }
    if (this.rateTimer) {
      clearTimeout(this.rateTimer);
      this.rateTimer = null;
    }
    this.current = null;
    this.synth?.cancel();
  }

  private setState(state: SpeechState): void {
    this.state = state;
    this.emit();
  }

  private emit(): void {
    const snap = this.snapshot();
    for (const l of this.listeners) l(snap);
  }
}
