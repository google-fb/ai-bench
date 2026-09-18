import { prefs, savePrefs } from "../store";
import { hrefHome, hrefUnit } from "../router";
import type { Prefs, UnitId } from "../types";

function toggle<K extends keyof Prefs>(key: K, value: Prefs[K]): string {
  const on = prefs[key] === value ? "true" : "false";
  return `data-key="${key}" data-value="${value}" aria-pressed="${on}"`;
}

export function renderHeader(unit?: UnitId): string {
  return `
    <header class="site-header">
      <div class="header-inner">
        <a class="brand" href="${hrefHome()}">
          <strong>筆記室</strong>
          <span>NOTES · MED + BREAD</span>
        </a>
        <nav class="unit-nav" aria-label="單元 / Units">
          <a href="${hrefUnit("med")}" ${unit === "med" ? 'aria-current="page"' : ""}>醫學 / Med</a>
          <a href="${hrefUnit("bread")}" ${unit === "bread" ? 'aria-current="page"' : ""}>酸種 / Bread</a>
        </nav>
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

export function renderFooter(unit?: UnitId): string {
  const med = `<p lang="zh">這是科普整理，不是診斷或用藥建議。要不要打針、吃藥，請跟你的醫師討論。數字來自公開新聞與論文，我們用白話重寫，細節以原始來源為準。</p>
        <p lang="en">This is a reading guide, not medical advice. Talk to a clinician before any shot or drug. Figures come from public papers and press notes; the originals win if we simplified too hard.</p>`;
  const bread = `<p lang="zh">這是廚房科普，不是食品安全檢驗，也不是職業烘焙課。發霉的種要整罐丟掉。數字是常見家用範圍，麵粉與室溫會改結果。</p>
        <p lang="en">This is kitchen literacy, not a food-safety lab or a bakery course. Toss a moldy starter. The numbers are home ranges; flour and room heat will move them.</p>`;
  const copy = unit === "bread" ? bread : unit === "med" ? med : `${med}${bread}`;
  return `
    <footer class="site-footer">
      <div class="disclaimer">
        ${copy}
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
