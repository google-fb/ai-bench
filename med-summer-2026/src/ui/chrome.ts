import { prefs, savePrefs } from "../store";
import { hrefHome } from "../router";
import type { Prefs } from "../types";

function toggle<K extends keyof Prefs>(key: K, value: Prefs[K]): string {
  const on = prefs[key] === value ? "true" : "false";
  return `data-key="${key}" data-value="${value}" aria-pressed="${on}"`;
}

export function renderHeader(): string {
  return `
    <header class="site-header">
      <div class="header-inner">
        <a class="brand" href="${hrefHome()}">
          <strong>夏日醫學筆記</strong>
          <span>SUMMER MED NOTES · 2026</span>
        </a>
        <div class="controls" role="toolbar" aria-label="閱讀設定 / Reading settings">
          <button type="button" ${toggle("theme", "light")}>Light</button>
          <button type="button" ${toggle("theme", "dark")}>Dark</button>
          <button type="button" ${toggle("size", "sm")}>A−</button>
          <button type="button" ${toggle("size", "md")}>A</button>
          <button type="button" ${toggle("size", "lg")}>A+</button>
          <button type="button" ${toggle("lang", "zh")}>中</button>
          <button type="button" ${toggle("lang", "en")}>EN</button>
          <button type="button" ${toggle("lang", "both")}>中英</button>
        </div>
      </div>
    </header>
  `;
}

export function renderFooter(): string {
  return `
    <footer class="site-footer">
      <div class="disclaimer">
        <p lang="zh">這是科普整理，不是診斷或用藥建議。要不要打針、吃藥，請跟你的醫師討論。數字來自公開新聞與論文，我們用白話重寫，細節以原始來源為準。</p>
        <p lang="en">This is a reading guide, not medical advice. Talk to a clinician before any shot or drug. Figures come from public papers and press notes; the originals win if we simplified too hard.</p>
      </div>
    </footer>
  `;
}

export function bindChrome(root: HTMLElement, hooks?: { onLangChange?: () => void }): void {
  root.querySelectorAll<HTMLButtonElement>("[data-key]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.key as keyof Prefs;
      const value = btn.dataset.value as Prefs[typeof key];
      savePrefs({ [key]: value });
      root.querySelectorAll<HTMLButtonElement>(`[data-key="${key}"]`).forEach((b) => {
        b.setAttribute("aria-pressed", String(b.dataset.value === value));
      });
      if (key === "lang") hooks?.onLangChange?.();
    });
  });
}
