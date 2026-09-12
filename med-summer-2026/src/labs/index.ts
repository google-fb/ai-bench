import { prefs } from "../store";
import type { Article } from "../types";
import {
  articleBySlug,
  copyText,
  currentStep,
  drawCoachMark,
  drawLegend,
  drawMission,
  paintLab,
  pointerOnCanvas,
  setNote,
  type LabState,
} from "./engine";
import { scenes } from "./scenes";

function pairNote(titleZh: string, titleEn: string, bodyZh: string, bodyEn: string): { title: string; body: string } {
  if (prefs.lang === "en") return { title: titleEn, body: bodyEn };
  if (prefs.lang === "zh") return { title: titleZh, body: bodyZh };
  return { title: `${titleZh} / ${titleEn}`, body: `${bodyZh} ${bodyEn}` };
}

function paintHud(section: HTMLElement, article: Article, done: Record<string, boolean>): string | null {
  const ids = article.lab.steps.map((step) => step.id);
  const current = currentStep(ids, done);
  const total = ids.length;
  const cleared = ids.filter((id) => done[id]).length;
  section.querySelectorAll<HTMLElement>("[data-step]").forEach((item) => {
    const id = item.dataset.step ?? "";
    item.classList.toggle("is-done", !!done[id]);
    item.classList.toggle("is-current", id === current);
  });
  const progress = section.querySelector("[data-lab-progress]");
  if (progress) progress.textContent = `${cleared}/${total}`;
  return current;
}

export function mountLab(section: HTMLElement): void {
  const canvas = section.querySelector("canvas");
  const note = section.querySelector<HTMLElement>(".lab-note");
  const kind = section.dataset.lab ?? "";
  const slug = section.dataset.slug ?? "";
  if (!canvas || !note) return;
  const article = articleBySlug(slug);
  const api = scenes[kind];
  if (!api || !article) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const state: LabState = { hover: null, selected: null, flags: {}, drag: null, missAt: 0 };
  let raf = 0;
  let downHit = false;

  const explain = (id: string | null, missed = false) => {
    const done = api.done(state);
    const current = paintHud(section, article, done);
    const complete = article.lab.steps.every((step) => done[step.id]);

    if (complete) {
      const recap = pairNote(
        "做完了：這就是這篇的知識點",
        "Done — that’s the idea",
        article.lab.lesson.zh,
        article.lab.lesson.en,
      );
      setNote(note, recap.title, recap.body);
      return;
    }

    if (id) {
      const spot = article.lab.hotspots.find((item) => item.id === id);
      if (spot) {
        const text = pairNote(spot.label.zh, spot.label.en, spot.body.zh, spot.body.en);
        setNote(note, text.title, text.body);
        return;
      }
    }

    const step = article.lab.steps.find((item) => item.id === current);
    if (missed) {
      const miss = pairNote(
        "這裡點不到",
        "Nothing to tap there",
        step ? `請看畫面上的「點我／拖我」。下一步：${step.how.zh}` : article.lab.how.zh,
        step ? `Follow the “Tap me / Drag me” tag. Next: ${step.how.en}` : article.lab.how.en,
      );
      setNote(note, miss.title, miss.body);
      return;
    }

    if (step) {
      const text = pairNote(`下一步：${step.title.zh}`, `Next: ${step.title.en}`, step.how.zh, step.how.en);
      setNote(note, text.title, text.body);
      return;
    }

    const idle = pairNote(article.lab.hint.zh, article.lab.hint.en, article.lab.how.zh, article.lab.how.en);
    setNote(note, idle.title, idle.body);
  };

  const loop = (t: number) => {
    if (!canvas.isConnected) return;
    paintLab(ctx, canvas.width, canvas.height);
    api.draw(ctx, state, t);
    const done = api.done(state);
    const current = currentStep(
      article.lab.steps.map((step) => step.id),
      done,
    );
    const step = article.lab.steps.find((item) => item.id === current);
    const complete = !current;
    drawMission(
      ctx,
      canvas.width,
      copyText(article.lab.lesson),
      complete
        ? copyText({ zh: "步驟都打勾了。可按「重來」再走一遍。", en: "All steps checked. Hit Reset to replay." })
        : step
          ? `${copyText({ zh: "下一步", en: "Next" })}：${copyText(step.how)}`
          : copyText(article.lab.how),
    );
    const coach = api.coach(state, t);
    if (coach && !state.drag) drawCoachMark(ctx, coach, t);
    else if (coach && state.drag && coach.kind === "drop") drawCoachMark(ctx, coach, t);
    drawLegend(ctx, canvas.width, canvas.height);
    if (state.missAt && t - state.missAt < 700) {
      ctx.fillStyle = "rgba(255,255,255,0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);
  explain(null);

  canvas.addEventListener("pointerdown", (event) => {
    const p = pointerOnCanvas(canvas, event);
    const id = api.hit(p, state);
    downHit = Boolean(id);
    if (id) {
      state.selected = id;
      api.down?.(id, p, state);
      explain(id);
      canvas.setPointerCapture(event.pointerId);
    } else {
      state.missAt = performance.now();
      explain(null, true);
    }
  });
  canvas.addEventListener("pointermove", (event) => {
    const p = pointerOnCanvas(canvas, event);
    state.hover = api.hit(p, state);
    api.move?.(p, state);
    if (!state.drag && state.hover && !state.selected) explain(state.hover);
    canvas.style.cursor = state.hover || state.drag ? "pointer" : "crosshair";
  });
  canvas.addEventListener("pointerup", (event) => {
    const p = pointerOnCanvas(canvas, event);
    const hadDrag = Boolean(state.drag);
    api.up?.(p, state);
    if (downHit || hadDrag) explain(state.selected);
    downHit = false;
  });

  section.querySelector("[data-lab-reset]")?.addEventListener("click", () => {
    state.hover = null;
    state.selected = null;
    state.flags = {};
    state.drag = null;
    state.missAt = 0;
    explain(null);
  });

  section.addEventListener(
    "remove",
    () => cancelAnimationFrame(raf),
    { once: true },
  );
}
