import type { Prefs } from "./types";

const KEY = "med-summer-2026-prefs";

const defaults: Prefs = {
  theme: matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
  size: "md",
  lang: "both",
};

function read(): Prefs {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...defaults };
    return { ...defaults, ...JSON.parse(raw) };
  } catch {
    return { ...defaults };
  }
}

export const prefs: Prefs = read();

export function applyPrefs(): void {
  const root = document.documentElement;
  root.dataset.theme = prefs.theme;
  root.dataset.size = prefs.size;
  root.dataset.lang = prefs.lang;
}

export function savePrefs(patch: Partial<Prefs>): void {
  Object.assign(prefs, patch);
  localStorage.setItem(KEY, JSON.stringify(prefs));
  applyPrefs();
}
