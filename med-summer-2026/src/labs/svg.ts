import type { Article, Copy } from "../types";
import { articleBySlug, currentStep, setNote } from "./engine";
import { svgScenes } from "./svg-scenes";

function paintHud(section: HTMLElement, article: Article, done: Record<string, boolean>): string | null {
  const ids = article.lab.steps.map((step) => step.id);
  const current = currentStep(ids, done);
  const cleared = ids.filter((id) => done[id]).length;
  section.querySelectorAll<HTMLElement>("[data-step]").forEach((item) => {
    const id = item.dataset.step ?? "";
    item.classList.toggle("is-done", !!done[id]);
    item.classList.toggle("is-current", id === current);
    item.setAttribute("aria-current", id === current ? "step" : "false");
  });
  const progress = section.querySelector("[data-lab-progress]");
  if (progress) progress.textContent = `${cleared}/${ids.length}`;
  return current;
}

export function mountSvgLab(section: HTMLElement): void {
  const host = section.querySelector<HTMLElement>("[data-svg-host]");
  const note = section.querySelector<HTMLElement>(".lab-note");
  const kind = section.dataset.lab ?? "";
  const slug = section.dataset.slug ?? "";
  if (!host || !note) return;
  const article = articleBySlug(slug);
  const markup = svgScenes[kind];
  if (!article || !markup) return;

  host.innerHTML = markup;
  const svg = host.querySelector("svg");
  const flags: Record<string, number> = {};

  const doneMap = () => {
    const done: Record<string, boolean> = {};
    article.lab.steps.forEach((step) => {
      done[step.id] = flags[step.id] === 1;
    });
    return done;
  };

  const paintScene = () => {
    if (!svg) return;
    const done = doneMap();
    const current = currentStep(
      article.lab.steps.map((step) => step.id),
      done,
    );
    svg.dataset.step = current ?? "done";
    svg.dataset.done = article.lab.steps.filter((step) => done[step.id]).map((step) => step.id).join(" ");
    if (flags.h80) svg.dataset.hydro = "80";
    else if (flags.h70) svg.dataset.hydro = "70";
    else if (flags.h60) svg.dataset.hydro = "60";
    else svg.dataset.hydro = "";
    svg.querySelectorAll("[data-hit]").forEach((el) => {
      const id = el.getAttribute("data-hit") ?? "";
      el.classList.toggle("is-now", id === current);
      el.classList.toggle("is-cleared", !!done[id]);
    });
  };

  const explain = (id: string | null, missed = false) => {
    const done = doneMap();
    const current = paintHud(section, article, done);
    paintScene();
    const complete = article.lab.steps.every((step) => done[step.id]);
    if (complete) {
      setNote(note, { zh: "做完了：這就是這篇的知識點", en: "Done — that’s the idea" }, article.lab.lesson);
      return;
    }
    if (id) {
      const spot = article.lab.hotspots.find((item) => item.id === id);
      if (spot) {
        setNote(note, spot.label, spot.body);
        return;
      }
    }
    const step = article.lab.steps.find((item) => item.id === current);
    if (missed) {
      const title: Copy = { zh: "這裡點不到", en: "Nothing to tap there" };
      const body: Copy = step
        ? { zh: `請點發亮的那一塊。下一步：${step.how.zh}`, en: `Tap the glowing piece. Next: ${step.how.en}` }
        : article.lab.how;
      setNote(note, title, body);
      return;
    }
    if (step) {
      setNote(note, { zh: `下一步：${step.title.zh}`, en: `Next: ${step.title.en}` }, step.how);
      return;
    }
    setNote(note, article.lab.hint, article.lab.how);
  };

  const activate = (id: string | null) => {
    if (!id) return;
    flags[id] = 1;
    explain(id);
  };

  const reset = () => {
    Object.keys(flags).forEach((key) => {
      delete flags[key];
    });
    explain(null);
  };

  host.addEventListener("click", (event) => {
    const hit = (event.target as Element | null)?.closest?.("[data-hit]");
    const id = hit?.getAttribute("data-hit");
    if (id) activate(id);
    else explain(null, true);
  });

  host.tabIndex = 0;
  host.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const current = currentStep(
        article.lab.steps.map((step) => step.id),
        doneMap(),
      );
      if (current) activate(current);
    }
    if (event.key === "r" || event.key === "R") {
      event.preventDefault();
      reset();
    }
  });

  section.querySelector("[data-lab-reset]")?.addEventListener("click", reset);
  explain(null);
}
