import { allBlocks, findBlock, findModel, MODELS, tourBlocks } from "./content/index.ts";
import type { Block, ModelSpec } from "./content/types.ts";
import { HTML_LANG, loadLocale, saveLocale, type Locale } from "./i18n.ts";
import { blockParts, estimateSpeechMs, introParts, joinParts } from "./reading.ts";
import { Museum } from "./scene/museum.ts";
import { SpeechController } from "./speech.ts";
import { UI, type ReadingKind } from "./ui.ts";

type TourStep = { kind: "intro" } | { kind: "block"; blockId: string };

const FLOW_KEY = "llm-museum.flow";

/** A setTimeout that can be paused and resumed with its remaining time intact. */
class PausableTimer {
  private handle: ReturnType<typeof setTimeout> | null = null;
  private fn: (() => void) | null = null;
  private remaining = 0;
  private startedAt = 0;

  start(ms: number, fn: () => void): void {
    this.clear();
    this.fn = fn;
    this.remaining = ms;
    this.arm();
  }

  pause(): void {
    if (!this.handle) return;
    clearTimeout(this.handle);
    this.handle = null;
    this.remaining = Math.max(400, this.remaining - (performance.now() - this.startedAt));
  }

  resume(): void {
    if (this.handle || !this.fn) return;
    this.arm();
  }

  clear(): void {
    if (this.handle) clearTimeout(this.handle);
    this.handle = null;
    this.fn = null;
    this.remaining = 0;
  }

  private arm(): void {
    this.startedAt = performance.now();
    this.handle = setTimeout(() => {
      this.handle = null;
      const fn = this.fn;
      this.fn = null;
      fn?.();
    }, this.remaining);
  }
}

class App {
  private locale: Locale = loadLocale();
  private readonly speech = new SpeechController();
  private readonly ui: UI;
  private readonly museum: Museum;
  private activeModelId: string | null = null;
  private selectedBlockId: string | null = null;
  private reading: ReadingKind | null = null;
  private flowOn = true;

  private tourActive = false;
  private tourSteps: TourStep[] = [];
  private tourIndex = 0;
  /** Advances to the next stop after narration (or, without speech, after an estimated time). */
  private readonly tourTimer = new PausableTimer();
  /** Never lets the tour stall if the speech engine forgets to fire "end". */
  private readonly tourWatchdog = new PausableTimer();
  /** True while the visitor has paused the tour; both timers and narration are held. */
  private tourHeld = false;
  private tourToken = 0;
  private silentTourRestarted = false;
  /** Pending deep-link selection; cancelled by any newer navigation. */
  private hashTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.ui = new UI({
      onSelectHall: (id) => this.goToHall(id),
      onSelectBlock: (modelId, blockId) => this.selectBlock(modelId, blockId, { pan: true }),
      onStepBlock: (delta) => this.stepBlock(delta),
      onToggleLocale: () => this.setLocale(this.locale === "zh" ? "en" : "zh"),
      onToggleFlow: () => this.setFlow(!this.flowOn),
      onSpeakIntro: () => this.speakIntro(),
      onSpeakBlock: () => this.speakBlock(),
      onSpeechPlay: () => this.play(),
      onSpeechPause: () => this.togglePause(),
      onSpeechStop: () => (this.tourActive ? this.stopTour() : this.stopSpeech()),
      onRateChange: (rate) => this.speech.setRate(rate),
      onVoiceChange: (uri) => {
        this.speech.setPreferredVoice(this.locale, uri);
        this.refreshVoices();
      },
      onTourToggle: () => (this.tourActive ? this.stopTour() : this.startTour()),
      onTourPrev: () => this.tourStep(this.tourIndex - 1),
      onTourNext: () => this.tourStep(this.tourIndex + 1),
      onPanelToggle: () => this.syncInsets(),
    });

    const viewport = document.getElementById("viewport");
    if (!viewport) throw new Error("Missing #viewport");
    this.museum = new Museum(viewport, MODELS, this.locale, {
      onSelect: (modelId, blockId) => this.selectBlock(modelId, blockId, { pan: false }),
      onFocus: (modelId) => this.goToHall(modelId),
      onHover: () => {},
    });

    try {
      this.flowOn = localStorage.getItem(FLOW_KEY) !== "off";
    } catch {
      /* storage unavailable */
    }

    this.ui.setModels(MODELS);
    this.setLocale(this.locale, { silent: true });
    this.setFlow(this.flowOn);
    this.ui.setRate(this.speech.rate);
    this.ui.setSpeechSupport(this.speech.supported, this.speech.voicesFor(this.locale).length > 0);
    this.refreshVoices();
    this.speech.onVoicesChanged(() => this.refreshVoices());
    this.speech.subscribe((snap) => {
      this.ui.setSpeech(snap);
      if (snap.state === "idle" && !this.tourActive) {
        this.reading = null;
        this.ui.setReading(null);
      }
      // Pausing the narration (dock, Space) must hold the tour; resuming releases it.
      if (this.tourActive) {
        if (snap.state === "paused" && !this.tourHeld) this.holdTour();
        else if (snap.state === "speaking" && this.tourHeld) this.releaseTour();
      }
      // The engine never started talking: restart this stop on the silent timer instead of waiting.
      if (snap.engine === "silent" && this.tourActive && !this.silentTourRestarted) {
        this.silentTourRestarted = true;
        this.tourStep(this.tourIndex);
      }
    });
    this.ui.setSpeech(this.speech.snapshot());
    this.ui.setTour({ active: false, index: 0, total: 0, held: false });

    window.addEventListener("resize", () => this.syncInsets());
    document.addEventListener("keydown", (e) => this.onKey(e));
    // Pasted links and back/forward navigation change the hash without reloading.
    window.addEventListener("hashchange", () => this.applyHash());

    this.museum.start();
    this.syncInsets();
    this.museum.focusOverview(0.01);
    requestAnimationFrame(() => {
      this.ui.hideLoading();
      this.applyHash();
    });
  }

  private cancelPendingHash(): void {
    if (this.hashTimer) clearTimeout(this.hashTimer);
    this.hashTimer = null;
  }

  private applyHash(): void {
    this.cancelPendingHash();
    const hash = decodeURIComponent(location.hash.replace(/^#\/?/, ""));
    const [modelId, blockId] = hash.split("/");
    const model = modelId ? findModel(modelId) : undefined;
    if (!model) {
      if (!hash && this.activeModelId !== null) this.goToHall(null);
      return;
    }
    const block = blockId ? findBlock(model, blockId) : undefined;
    const sameHall = this.activeModelId === model.id;
    if (block) {
      if (sameHall && this.selectedBlockId === block.id) return;
      if (sameHall) {
        this.selectBlock(model.id, block.id, { pan: true });
        return;
      }
      this.goToHall(model.id, 1.2);
      this.hashTimer = setTimeout(() => {
        this.hashTimer = null;
        this.selectBlock(model.id, block.id, { pan: true });
      }, 900);
    } else if (!sameHall || this.selectedBlockId !== null) {
      this.goToHall(model.id, 1.2);
    }
  }

  private syncInsets(): void {
    const inset = this.ui.panelInset();
    this.museum.setInsets(inset.right, inset.bottom);
  }

  private setLocale(locale: Locale, options: { silent?: boolean } = {}): void {
    this.locale = locale;
    saveLocale(locale);
    document.documentElement.lang = HTML_LANG[locale];
    this.museum.setLocale(locale);
    this.ui.setLocale(locale);
    this.ui.setActiveModel(this.activeModelId);
    this.ui.setBlock(...this.currentSelection());
    this.refreshVoices();
    if (!options.silent) {
      // A new language means new text; stop the old narration and any running tour.
      if (this.tourActive) this.stopTour();
      this.stopSpeech();
    }
  }

  private refreshVoices(): void {
    const voices = this.speech.voicesFor(this.locale);
    this.ui.setVoices(voices, this.speech.preferredVoiceFor(this.locale));
    this.ui.setSpeechSupport(this.speech.supported, voices.length > 0);
    this.ui.setSpeech(this.speech.snapshot());
  }

  private setFlow(on: boolean): void {
    this.flowOn = on;
    this.museum.setFlowVisible(on);
    this.ui.setFlow(on);
    try {
      localStorage.setItem(FLOW_KEY, on ? "on" : "off");
    } catch {
      /* storage unavailable */
    }
  }

  private currentSelection(): [ModelSpec | null, Block | null] {
    const model = this.activeModelId ? findModel(this.activeModelId) ?? null : null;
    const block = model && this.selectedBlockId ? findBlock(model, this.selectedBlockId) ?? null : null;
    return [model, block];
  }

  private goToHall(modelId: string | null, duration?: number): void {
    if (this.tourActive) this.stopTour();
    // A hall change supersedes any deep-link selection still in flight (applyHash re-arms its own).
    this.cancelPendingHash();
    this.stopSpeech();
    this.activeModelId = modelId;
    this.selectedBlockId = null;
    this.museum.select(modelId ?? "", null);
    if (modelId) this.museum.focusModel(modelId, duration);
    else this.museum.focusOverview(duration);
    this.ui.setActiveModel(modelId);
    this.ui.setBlock(null, null);
    history.replaceState(null, "", modelId ? `#/${modelId}` : "#/");
  }

  private selectBlock(modelId: string, blockId: string, options: { pan: boolean; fromTour?: boolean }): void {
    const model = findModel(modelId);
    const block = model ? findBlock(model, blockId) : undefined;
    if (!model || !block) return;
    this.cancelPendingHash();
    if (this.tourActive && !options.fromTour) this.stopTour();
    if (!options.fromTour) this.stopSpeech();
    if (this.activeModelId !== modelId) {
      this.activeModelId = modelId;
      this.ui.setActiveModel(modelId);
      if (!options.fromTour) this.museum.focusModel(modelId);
    }
    this.selectedBlockId = blockId;
    this.museum.select(modelId, blockId);
    if (!options.fromTour && this.ui.ensurePanelOpen()) this.syncInsets();
    if (options.pan && !options.fromTour) {
      // Phones hide the other labels, so move right up to the chosen block instead of only panning.
      if (this.ui.isStacked()) this.museum.focusBlock(modelId, blockId, 1.1, { narrow: true });
      else this.museum.panToBlock(modelId, blockId);
    }
    this.ui.setBlock(model, block);
    history.replaceState(null, "", `#/${modelId}/${blockId}`);
  }

  /** Moves to the previous/next module in the curated learning order. */
  private stepBlock(delta: number): void {
    const [model, block] = this.currentSelection();
    if (!model) return;
    let order = tourBlocks(model);
    let index = block ? order.findIndex((b) => b.id === block.id) : -1;
    if (block && index < 0) {
      order = allBlocks(model);
      index = order.findIndex((b) => b.id === block.id);
    }
    const next = order[(index + delta + order.length) % order.length];
    if (next) this.selectBlock(model.id, next.id, { pan: true });
  }

  private speakIntro(): void {
    const [model] = this.currentSelection();
    if (!model) return;
    this.startReading("intro", joinParts(introParts(model, this.locale)));
  }

  private speakBlock(): void {
    const [, block] = this.currentSelection();
    if (!block) return;
    this.startReading("block", joinParts(blockParts(block, this.locale)));
  }

  private startReading(kind: ReadingKind, text: string, onDone?: () => void): void {
    this.reading = kind;
    this.ui.setReading(kind);
    this.speech.speak(text, this.locale, { onDone });
  }

  /** Play button: resume if paused, otherwise read the module (or the exhibit intro). */
  private play(): void {
    const snap = this.speech.snapshot();
    if (snap.state === "paused") {
      this.speech.resume();
      return;
    }
    if (this.selectedBlockId) this.speakBlock();
    else this.speakIntro();
  }

  private stopSpeech(): void {
    this.speech.stop();
    this.reading = null;
    this.ui.setReading(null);
  }

  private startTour(): void {
    const model = this.activeModelId ? findModel(this.activeModelId) : undefined;
    if (!model) return;
    this.tourActive = true;
    this.tourSteps = [{ kind: "intro" }, ...tourBlocks(model).map((b) => ({ kind: "block" as const, blockId: b.id }))];
    this.tourStep(0);
  }

  private stopTour(): void {
    this.tourActive = false;
    this.tourHeld = false;
    this.tourToken += 1;
    this.clearTourTimers();
    this.speech.stop();
    this.reading = null;
    this.ui.setReading(null);
    this.ui.setTour({ active: false, index: 0, total: 0, held: false });
  }

  /** Pause button: pauses narration when there is any, otherwise holds the timed tour. */
  private togglePause(): void {
    const state = this.speech.snapshot().state;
    if (this.tourActive) {
      if (this.tourHeld) this.releaseTour();
      else this.holdTour();
      return;
    }
    if (state !== "idle") this.speech.toggle();
  }

  private holdTour(): void {
    if (!this.tourActive || this.tourHeld) return;
    this.tourHeld = true;
    this.tourTimer.pause();
    this.tourWatchdog.pause();
    if (this.speech.snapshot().state === "speaking") this.speech.pause();
    this.ui.setTour({ active: true, index: this.tourIndex, total: this.tourSteps.length, held: true });
  }

  private releaseTour(): void {
    if (!this.tourActive || !this.tourHeld) return;
    this.tourHeld = false;
    if (this.speech.snapshot().state === "paused") this.speech.resume();
    this.tourTimer.resume();
    this.tourWatchdog.resume();
    this.ui.setTour({ active: true, index: this.tourIndex, total: this.tourSteps.length, held: false });
  }

  private tourStep(index: number): void {
    const model = this.activeModelId ? findModel(this.activeModelId) : undefined;
    if (!this.tourActive || !model) return;
    if (index < 0 || index >= this.tourSteps.length) {
      this.stopTour();
      return;
    }
    this.tourIndex = index;
    this.tourToken += 1;
    const token = this.tourToken;
    this.clearTourTimers();
    this.tourHeld = false;
    this.ui.setTour({ active: true, index, total: this.tourSteps.length, held: false });

    const step = this.tourSteps[index];
    if (!step) return;
    let text: string;
    if (step.kind === "intro") {
      this.selectedBlockId = null;
      this.museum.select(model.id, null);
      this.ui.setBlock(null, null);
      this.museum.focusModel(model.id, 1.3);
      text = joinParts(introParts(model, this.locale));
      this.reading = "intro";
      this.ui.setReading("intro");
    } else {
      const block = findBlock(model, step.blockId);
      if (!block) return;
      this.selectBlock(model.id, step.blockId, { pan: false, fromTour: true });
      this.museum.focusBlock(model.id, step.blockId, 1.2);
      text = joinParts(blockParts(block, this.locale));
      this.reading = "block";
      this.ui.setReading("block");
    }

    const goNext = (delay: number) => {
      if (!this.tourActive || token !== this.tourToken) return;
      this.tourTimer.start(delay, () => {
        if (this.tourActive && token === this.tourToken) this.tourStep(index + 1);
      });
      if (this.tourHeld) this.tourTimer.pause();
    };

    const estimate = estimateSpeechMs(text, this.locale, this.speech.rate);
    if (this.speech.canSpeak(this.locale)) {
      this.speech.speak(text, this.locale, { onDone: () => goNext(900) });
      // Watchdog: some engines never fire "end"; never let the tour stall.
      this.tourWatchdog.start(estimate * 2.5 + 6000, () => goNext(0));
    } else {
      goNext(estimate);
    }
  }

  private clearTourTimers(): void {
    this.tourTimer.clear();
    this.tourWatchdog.clear();
  }

  private onKey(event: KeyboardEvent): void {
    const target = event.target as HTMLElement | null;
    if (target && (target.tagName === "INPUT" || target.tagName === "SELECT" || target.tagName === "TEXTAREA")) return;
    if (event.key === "Escape") {
      if (this.tourActive) this.stopTour();
      else this.stopSpeech();
    } else if (event.key === "ArrowRight") {
      if (this.tourActive) this.tourStep(this.tourIndex + 1);
      else if (this.activeModelId) this.stepBlock(1);
    } else if (event.key === "ArrowLeft") {
      if (this.tourActive) this.tourStep(this.tourIndex - 1);
      else if (this.activeModelId) this.stepBlock(-1);
    } else if (event.key === " " && (this.tourActive || this.speech.snapshot().state !== "idle")) {
      event.preventDefault();
      this.togglePause();
    }
  }
}

new App();
