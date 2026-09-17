import { pickViz, type Block, type BlockKind, type ModelSpec } from "./content/types.ts";
import { format, pick, UI as T, type L, type Locale } from "./i18n.ts";
import { blockParts, introParts, type ReadingPart } from "./reading.ts";
import { hex, KIND_COLOR } from "./scene/palette.ts";
import { splitSentences, type SpeechSnapshot } from "./speech.ts";
import { catImageSvg, renderViz } from "./viz.ts";

export interface UIHandlers {
  onSelectHall: (modelId: string | null) => void;
  onSelectBlock: (modelId: string, blockId: string) => void;
  onStepBlock: (delta: number) => void;
  onToggleLocale: () => void;
  onToggleFlow: () => void;
  onSpeakIntro: () => void;
  onSpeakBlock: () => void;
  onSpeechPlay: () => void;
  onSpeechPause: () => void;
  onSpeechStop: () => void;
  onRateChange: (rate: number) => void;
  onVoiceChange: (voiceURI: string | null) => void;
  onTourToggle: () => void;
  onTourPrev: () => void;
  onTourNext: () => void;
  onPanelToggle: (open: boolean) => void;
}

export interface TourState {
  active: boolean;
  index: number;
  total: number;
}

export type ReadingKind = "intro" | "block";

const WELCOME: Record<"title" | "body" | "pick", L> = {
  title: { zh: "歡迎來到 LLM 建築博物館", en: "Welcome to the LLM Architecture Museum" },
  body: {
    zh: "這裡收藏了三代大語言模型的建築藍圖：2017 年的原始 Transformer、2024 年的 Llama 3，以及 2026 年的 DeepSeek V4.1 Flash。每座展品都以真實的層數與模組堆疊而成，由下往上就是資料流動的方向。慢慢走，慢慢看；需要的話，讓導覽員為你朗讀。",
    en: "Three generations of large language model blueprints live here: the original Transformer of 2017, Llama 3 of 2024, and DeepSeek V4.1 Flash of 2026. Each exhibit is stacked from the real layers and modules, and data flows from bottom to top. Take your time, and let the guide read to you whenever you like.",
  },
  pick: { zh: "選一座展品開始", en: "Choose an exhibit to begin" },
};

function el<K extends keyof HTMLElementTagNameMap>(tag: K, className?: string, text?: string): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function must<T extends HTMLElement>(id: string): T {
  const node = document.getElementById(id);
  if (!node) throw new Error(`Missing element #${id}`);
  return node as T;
}

/**
 * Renders one reading part as sentence spans so the sentence being read aloud can
 * be highlighted. Single-sentence parts (titles) show their display text so the
 * terminator added for speech never appears on screen.
 */
function sentenceSpans(container: HTMLElement, part: ReadingPart | undefined, counter: { i: number }): void {
  if (!part) return;
  const sentences = splitSentences(part.spoken);
  if (sentences.length <= 1) {
    const span = el("span", "s", part.text);
    span.dataset.index = String(counter.i++);
    container.append(span);
    return;
  }
  sentences.forEach((sentence, n) => {
    const span = el("span", "s", sentence);
    span.dataset.index = String(counter.i++);
    container.append(span);
    if (n < sentences.length - 1) container.append(" ");
  });
}

export class UI {
  private locale: Locale = "zh";
  private models: ModelSpec[] = [];
  private activeModelId: string | null = null;
  private currentBlock: { model: ModelSpec; block: Block } | null = null;
  private readingKind: ReadingKind | null = null;
  private panelOpen = true;
  private flowOn = true;
  private tour: TourState = { active: false, index: 0, total: 0 };
  private speechSupported = true;
  private hasVoice = true;

  private readonly app = must<HTMLElement>("app");
  private readonly title = must<HTMLElement>("app-title");
  private readonly subtitle = must<HTMLElement>("app-subtitle");
  private readonly hallNav = must<HTMLElement>("hall-nav");
  private readonly flowToggle = must<HTMLButtonElement>("flow-toggle");
  private readonly langToggle = must<HTMLButtonElement>("lang-toggle");
  private readonly loading = must<HTMLElement>("loading");
  private readonly loadingText = must<HTMLElement>("loading-text");
  private readonly hint = must<HTMLElement>("hint");
  private readonly panel = must<HTMLElement>("panel");
  private readonly panelToggle = must<HTMLButtonElement>("panel-toggle");
  private readonly panelScroll = must<HTMLElement>("panel-scroll");
  private readonly modelCard = must<HTMLElement>("model-card");
  private readonly moduleDetail = must<HTMLElement>("module-detail");
  private readonly moduleList = must<HTMLElement>("module-list");
  private readonly legend = must<HTMLElement>("legend");
  private readonly sources = must<HTMLElement>("sources");
  private readonly speechTitle = must<HTMLElement>("speech-title");
  private readonly playBtn = must<HTMLButtonElement>("speech-play");
  private readonly pauseBtn = must<HTMLButtonElement>("speech-pause");
  private readonly stopBtn = must<HTMLButtonElement>("speech-stop");
  private readonly rateLabel = must<HTMLElement>("rate-label");
  private readonly rateSlider = must<HTMLInputElement>("rate-slider");
  private readonly rateValue = must<HTMLOutputElement>("rate-value");
  private readonly voiceLabel = must<HTMLElement>("voice-label");
  private readonly voiceSelect = must<HTMLSelectElement>("voice-select");
  private readonly speechStatus = must<HTMLElement>("speech-status");
  private readonly tourTitle = must<HTMLElement>("tour-title");
  private readonly tourPrev = must<HTMLButtonElement>("tour-prev");
  private readonly tourToggle = must<HTMLButtonElement>("tour-toggle");
  private readonly tourNext = must<HTMLButtonElement>("tour-next");
  private readonly tourProgress = must<HTMLElement>("tour-progress");

  constructor(private readonly handlers: UIHandlers) {
    this.langToggle.addEventListener("click", () => handlers.onToggleLocale());
    this.flowToggle.addEventListener("click", () => handlers.onToggleFlow());
    this.playBtn.addEventListener("click", () => handlers.onSpeechPlay());
    this.pauseBtn.addEventListener("click", () => handlers.onSpeechPause());
    this.stopBtn.addEventListener("click", () => handlers.onSpeechStop());
    this.rateSlider.addEventListener("input", () => {
      const rate = Number(this.rateSlider.value);
      this.rateValue.value = `${rate.toFixed(1)}×`;
      handlers.onRateChange(rate);
    });
    this.voiceSelect.addEventListener("change", () => {
      handlers.onVoiceChange(this.voiceSelect.value || null);
    });
    this.tourToggle.addEventListener("click", () => handlers.onTourToggle());
    this.tourPrev.addEventListener("click", () => handlers.onTourPrev());
    this.tourNext.addEventListener("click", () => handlers.onTourNext());
    this.panelToggle.addEventListener("click", () => {
      this.setPanelOpen(!this.panelOpen);
      handlers.onPanelToggle(this.panelOpen);
    });
  }

  /** Width in CSS pixels that the side panel covers on the right of the viewport (0 when stacked). */
  panelInset(): { right: number; bottom: number } {
    const rect = this.panel.getBoundingClientRect();
    const stacked = window.matchMedia("(max-width: 900px)").matches;
    if (!this.panelOpen) return { right: 0, bottom: 0 };
    if (stacked) return { right: 0, bottom: rect.height };
    return { right: rect.width + 16, bottom: 0 };
  }

  setPanelOpen(open: boolean): void {
    this.panelOpen = open;
    this.panel.classList.toggle("is-collapsed", !open);
    this.panelToggle.setAttribute("aria-expanded", String(open));
    this.panelToggle.textContent = open ? "›" : "‹";
    this.panelToggle.title = pick(open ? T.panelCollapse : T.panelExpand, this.locale);
    this.panelToggle.setAttribute("aria-label", this.panelToggle.title);
  }

  hideLoading(): void {
    this.loading.classList.add("is-hidden");
  }

  setModels(models: ModelSpec[]): void {
    this.models = models;
    this.renderHallNav();
  }

  setLocale(locale: Locale): void {
    this.locale = locale;
    this.app.dataset.locale = locale;
    this.renderChrome();
    this.renderHallNav();
    this.renderLegend();
    this.renderModel();
    this.renderBlock();
    this.renderTour();
    this.setPanelOpen(this.panelOpen);
  }

  setFlow(on: boolean): void {
    this.flowOn = on;
    this.flowToggle.textContent = pick(on ? T.flowOn : T.flowOff, this.locale);
    this.flowToggle.setAttribute("aria-pressed", String(on));
  }

  setActiveModel(modelId: string | null): void {
    this.activeModelId = modelId;
    this.renderHallNav();
    this.renderModel();
    this.renderTour();
  }

  setBlock(model: ModelSpec | null, block: Block | null): void {
    const changed = this.currentBlock?.block.id !== block?.id;
    this.currentBlock = model && block ? { model, block } : null;
    this.renderBlock();
    for (const item of this.moduleList.querySelectorAll<HTMLButtonElement>(".module-item")) {
      item.classList.toggle("is-active", item.dataset.blockId === block?.id);
    }
    // The detail card sits at the top of the panel; jump there when a new module is chosen.
    if (block && changed) this.panelScroll.scrollTo({ top: 0 });
  }

  private renderChrome(): void {
    const l = this.locale;
    this.title.textContent = pick(T.appTitle, l);
    this.subtitle.textContent = pick(T.appSubtitle, l);
    document.title = l === "zh" ? "LLM 建築博物館 · LLM Architecture Museum" : "LLM Architecture Museum · LLM 建築博物館";
    this.langToggle.textContent = pick(T.langToggle, l);
    this.langToggle.title = pick(T.langToggleTitle, l);
    this.langToggle.setAttribute("aria-label", pick(T.langToggleTitle, l));
    this.loadingText.textContent = pick(T.loading, l);
    this.hint.textContent = pick(T.hint, l);
    this.setFlow(this.flowOn);
    this.speechTitle.textContent = pick(T.speech, l);
    this.playBtn.textContent = `▶ ${pick(T.play, l)}`;
    this.pauseBtn.textContent = `⏸ ${pick(T.pause, l)}`;
    this.stopBtn.textContent = `■ ${pick(T.stop, l)}`;
    this.rateLabel.textContent = pick(T.rate, l);
    this.voiceLabel.textContent = pick(T.voice, l);
    this.tourTitle.textContent = pick(T.tour, l);
    this.tourPrev.textContent = `◀ ${pick(T.tourPrev, l)}`;
    this.tourNext.textContent = `${pick(T.tourNext, l)} ▶`;
    const auto = this.voiceSelect.querySelector<HTMLOptionElement>('option[value=""]');
    if (auto) auto.textContent = pick(T.voiceAuto, l);
  }

  private renderHallNav(): void {
    this.hallNav.innerHTML = "";
    const overview = el("button", `hall-btn${this.activeModelId === null ? " is-active" : ""}`);
    overview.type = "button";
    overview.dataset.hall = "overview";
    overview.textContent = pick(T.overview, this.locale);
    overview.addEventListener("click", () => this.handlers.onSelectHall(null));
    this.hallNav.append(overview);
    this.models.forEach((model, index) => {
      const btn = el("button", `hall-btn${this.activeModelId === model.id ? " is-active" : ""}`);
      btn.type = "button";
      btn.dataset.hall = model.id;
      const num = el("span", "hall-num", String(index + 1));
      const name = el("span", "hall-name", pick(model.shortName, this.locale));
      const year = el("span", "hall-year", String(model.year));
      btn.append(num, name, year);
      btn.style.setProperty("--accent", hex(model.accent));
      btn.addEventListener("click", () => this.handlers.onSelectHall(model.id));
      this.hallNav.append(btn);
    });
  }

  private renderLegend(): void {
    this.legend.innerHTML = "";
    this.legend.append(el("h3", "section-title", pick(T.legend, this.locale)));
    const grid = el("div", "legend-grid");
    for (const kind of Object.keys(KIND_COLOR) as BlockKind[]) {
      const item = el("div", "legend-item");
      const swatch = el("span", "legend-swatch");
      swatch.style.background = hex(KIND_COLOR[kind]);
      item.append(swatch, el("span", "legend-name", pick(T.kindNames[kind] ?? { zh: kind, en: kind }, this.locale)));
      grid.append(item);
    }
    this.legend.append(grid, el("p", "muted", pick(T.legendNote, this.locale)));
  }

  private renderModel(): void {
    const model = this.models.find((m) => m.id === this.activeModelId) ?? null;
    this.modelCard.innerHTML = "";
    this.moduleList.innerHTML = "";
    this.sources.innerHTML = "";
    const l = this.locale;

    if (!model) {
      this.modelCard.append(el("p", "eyebrow", pick(T.exhibit, l)));
      this.modelCard.append(el("h2", "model-name", pick(WELCOME.title, l)));
      this.modelCard.append(el("p", "prose", pick(WELCOME.body, l)));
      this.modelCard.append(el("h3", "section-title", pick(WELCOME.pick, l)));
      const cards = el("div", "hall-cards");
      this.models.forEach((m) => {
        const card = el("button", "hall-card");
        card.type = "button";
        card.dataset.hall = m.id;
        card.style.setProperty("--accent", hex(m.accent));
        card.append(el("span", "hall-card-year", String(m.year)), el("strong", "hall-card-name", pick(m.name, l)), el("span", "hall-card-tag", pick(m.tagline, l)));
        card.addEventListener("click", () => this.handlers.onSelectHall(m.id));
        cards.append(card);
      });
      this.modelCard.append(cards);
      return;
    }

    const parts = introParts(model, l);
    const counter = { i: 0 };
    const eyebrow = el("p", "eyebrow");
    eyebrow.append(`${pick(T.hall, l)} ${this.models.indexOf(model) + 1} · ${model.year}${pick(T.year, l)} · ${pick(model.org, l)}`);
    const name = el("h2", "model-name");
    sentenceSpans(name, parts.find((p) => p.role === "title"), counter);
    const tagline = el("p", "tagline");
    sentenceSpans(tagline, parts.find((p) => p.role === "tagline"), counter);
    const intro = el("p", "prose");
    sentenceSpans(intro, parts.find((p) => p.role === "intro"), counter);
    this.modelCard.append(eyebrow, name, tagline, intro);

    if (model.example) {
      const box = el("section", "example-box");
      box.append(el("h3", "example-title", `✦ ${pick(T.exampleTitle, l)}`));
      if (model.example.image) {
        const figure = el("figure", "example-figure");
        const img = catImageSvg(0);
        img.setAttribute("aria-label", pick(T.exampleImageAlt, l));
        figure.append(img);
        box.append(figure);
      }
      const io = el("dl", "example-io");
      io.append(el("dt", undefined, pick(T.exampleInput, l)), el("dd", undefined, pick(model.example.input, l)));
      io.append(el("dt", undefined, pick(T.exampleOutput, l)), el("dd", "example-output", pick(model.example.output, l)));
      box.append(io);
      const sentence = el("p", "example-sentence");
      sentenceSpans(sentence, parts.find((p) => p.role === "example"), counter);
      box.append(sentence);
      if (model.example.note) box.append(el("p", "muted example-note", pick(model.example.note, l)));
      box.append(el("p", "muted example-hint", pick(T.exampleHint, l)));
      this.modelCard.append(box);
    }

    const readBtn = el("button", "read-btn", `🔈 ${pick(T.readIntro, l)}`);
    readBtn.type = "button";
    readBtn.dataset.read = "intro";
    readBtn.addEventListener("click", () => this.handlers.onSpeakIntro());
    this.modelCard.append(readBtn);
    this.modelCard.dataset.reading = "intro";

    const factsTitle = el("h3", "section-title", pick(T.keyFacts, l));
    const facts = el("dl", "facts");
    for (const fact of model.facts) {
      facts.append(el("dt", undefined, pick(fact.label, l)), el("dd", undefined, pick(fact.value, l)));
    }
    this.modelCard.append(factsTitle, facts);

    this.moduleList.append(el("h3", "section-title", pick(T.modules, l)), el("p", "muted", pick(T.modulesHint, l)));
    for (const column of model.columns) {
      const colTitle = el("h4", "column-title", pick(column.title, l));
      this.moduleList.append(colTitle);
      const list = el("div", "module-items");
      // Top of the stack first, so the list reads like the 3D model.
      for (const block of [...column.blocks].reverse()) {
        const item = el("button", "module-item");
        item.type = "button";
        item.dataset.blockId = block.id;
        item.classList.toggle("is-active", this.currentBlock?.block.id === block.id);
        const swatch = el("span", "module-swatch");
        swatch.style.background = hex(KIND_COLOR[block.kind]);
        const text = el("span", "module-text");
        text.append(el("strong", undefined, pick(block.label, l)), el("span", "module-brief", pick(block.brief, l)));
        item.append(swatch, text);
        item.addEventListener("click", () => this.handlers.onSelectBlock(model.id, block.id));
        list.append(item);
      }
      this.moduleList.append(list);
    }

    this.sources.append(el("h3", "section-title", pick(T.sources, l)));
    const ul = el("ul", "source-list");
    for (const source of model.sources) {
      const li = el("li");
      const a = el("a", undefined, source.label);
      a.href = source.url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      li.append(a);
      ul.append(li);
    }
    this.sources.append(ul);
  }

  private renderBlock(): void {
    this.moduleDetail.innerHTML = "";
    const l = this.locale;
    if (!this.currentBlock) {
      this.moduleDetail.classList.remove("is-open");
      return;
    }
    const { model, block } = this.currentBlock;
    this.moduleDetail.classList.add("is-open");
    this.moduleDetail.style.setProperty("--accent", hex(KIND_COLOR[block.kind]));
    const parts = blockParts(block, l);
    const counter = { i: 0 };

    const badge = el("span", "kind-badge", pick(T.kindNames[block.kind] ?? { zh: block.kind, en: block.kind }, l));
    badge.style.background = hex(KIND_COLOR[block.kind]);
    const column = model.columns.find((c) => c.blocks.includes(block));
    const where = el("span", "muted", column ? pick(column.title, l) : "");
    const head = el("div", "detail-head");
    const steps = el("span", "detail-steps");
    const prev = el("button", "step-btn", "◀");
    prev.type = "button";
    prev.title = pick(T.prevModule, l);
    prev.setAttribute("aria-label", prev.title);
    prev.addEventListener("click", () => this.handlers.onStepBlock(-1));
    const next = el("button", "step-btn", "▶");
    next.type = "button";
    next.title = pick(T.nextModule, l);
    next.setAttribute("aria-label", next.title);
    next.addEventListener("click", () => this.handlers.onStepBlock(1));
    steps.append(prev, next);
    head.append(badge, where, steps);

    const title = el("h3", "detail-title");
    sentenceSpans(title, parts.find((p) => p.role === "title"), counter);
    const brief = el("p", "detail-brief");
    sentenceSpans(brief, parts.find((p) => p.role === "brief"), counter);
    this.moduleDetail.append(head, title, brief);

    const storyPart = parts.find((p) => p.role === "story");
    if (block.example && storyPart) {
      const section = el("section", "example-section");
      section.append(el("h4", "example-section-title", `✦ ${pick(T.exampleAtModule, l)}`));
      const viz = pickViz(block.example.viz, l);
      if (viz) section.append(renderViz(viz, l));
      const story = el("p", "prose example-story");
      sentenceSpans(story, storyPart, counter);
      section.append(story);
      this.moduleDetail.append(section);
    }

    const detail = el("p", "prose");
    sentenceSpans(detail, parts.find((p) => p.role === "detail"), counter);
    this.moduleDetail.append(detail);

    if (block.facts?.length) {
      const facts = el("dl", "facts facts-compact");
      for (const fact of block.facts) facts.append(el("dt", undefined, pick(fact.label, l)), el("dd", undefined, pick(fact.value, l)));
      this.moduleDetail.append(facts);
    }

    const readBtn = el("button", "read-btn", `🔈 ${pick(T.readModule, l)}`);
    readBtn.type = "button";
    readBtn.dataset.read = "block";
    readBtn.addEventListener("click", () => this.handlers.onSpeakBlock());
    this.moduleDetail.append(readBtn);
  }

  /** Which text (intro or module) speech is currently reading, for sentence highlighting. */
  setReading(kind: ReadingKind | null): void {
    this.readingKind = kind;
    this.modelCard.classList.toggle("is-reading", kind === "intro");
    this.moduleDetail.classList.toggle("is-reading", kind === "block");
    if (!kind) this.clearHighlight();
  }

  private clearHighlight(): void {
    for (const s of this.panel.querySelectorAll(".s.is-current")) s.classList.remove("is-current");
  }

  setSpeechSupport(supported: boolean, hasVoice: boolean): void {
    this.speechSupported = supported;
    this.hasVoice = hasVoice;
    this.playBtn.disabled = !supported;
    this.pauseBtn.disabled = !supported;
    this.stopBtn.disabled = !supported;
    this.rateSlider.disabled = !supported;
    this.voiceSelect.disabled = !supported;
  }

  setSpeech(snapshot: SpeechSnapshot): void {
    const l = this.locale;
    const { state } = snapshot;
    this.pauseBtn.textContent = state === "paused" ? `▶ ${pick(T.resume, l)}` : `⏸ ${pick(T.pause, l)}`;
    this.pauseBtn.disabled = !this.speechSupported || state === "idle";
    this.stopBtn.disabled = !this.speechSupported || state === "idle";
    this.app.dataset.speech = state;

    let status = "";
    if (!this.speechSupported) status = pick(T.speechUnsupported, l);
    else if (snapshot.engine === "silent") status = pick(T.speechSilent, l);
    else if (state === "speaking") status = `${pick(T.speechSpeaking, l)} ${snapshot.sentenceIndex + 1}/${snapshot.sentenceCount}`;
    else if (state === "paused") status = pick(T.speechPaused, l);
    else if (!this.hasVoice) status = pick(T.speechNoVoice, l);
    this.speechStatus.textContent = status;

    this.clearHighlight();
    if (state === "idle" || !this.readingKind) return;
    const container = this.readingKind === "intro" ? this.modelCard : this.moduleDetail;
    const current = container.querySelector<HTMLElement>(`.s[data-index="${snapshot.sentenceIndex}"]`);
    if (current) {
      current.classList.add("is-current");
      current.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }

  setRate(rate: number): void {
    this.rateSlider.value = String(rate);
    this.rateValue.value = `${rate.toFixed(1)}×`;
  }

  setVoices(voices: SpeechSynthesisVoice[], preferred: string | null): void {
    this.voiceSelect.innerHTML = "";
    const auto = el("option", undefined, pick(T.voiceAuto, this.locale));
    auto.value = "";
    this.voiceSelect.append(auto);
    for (const voice of voices) {
      const option = el("option", undefined, `${voice.name} (${voice.lang})`);
      option.value = voice.voiceURI;
      this.voiceSelect.append(option);
    }
    this.voiceSelect.value = preferred && voices.some((v) => v.voiceURI === preferred) ? preferred : "";
  }

  setTour(state: TourState): void {
    this.tour = state;
    this.renderTour();
  }

  private renderTour(): void {
    const l = this.locale;
    const { active, index, total } = this.tour;
    this.tourToggle.textContent = active ? `■ ${pick(T.tourStop, l)}` : `▶ ${pick(T.tourStart, l)}`;
    this.tourToggle.classList.toggle("is-active", active);
    this.tourToggle.disabled = !this.activeModelId && !active;
    this.tourPrev.disabled = !active || index <= 0;
    this.tourNext.disabled = !active || index >= total - 1;
    this.tourProgress.textContent = active ? format(pick(T.tourStep, l), { i: index + 1, n: total }) : "";
    this.app.dataset.tour = active ? "on" : "off";
  }

  /** Read-aloud availability for the currently shown texts. */
  hasBlock(): boolean {
    return this.currentBlock !== null;
  }
}
