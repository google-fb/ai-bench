import { tagCopy } from "../data/articles";
import { articlesFor, units } from "../data/catalog";
import { hrefArticle, hrefUnit } from "../router";
import type { Article, UnitId } from "../types";

function card(article: Article): string {
  const tag = tagCopy[article.tag];
  return `
    <a class="card" href="${hrefArticle(article.slug)}" data-tag="${article.tag}">
      <div class="rank">NO. ${String(article.rank).padStart(2, "0")}</div>
      <div>
        <div class="meta">
          <span lang="zh">${article.dateLabel.zh}</span>
          <span lang="en">${article.dateLabel.en}</span>
          <span>${tag.zh} / ${tag.en}</span>
        </div>
        <h2 class="card-title" lang="zh">${article.title.zh}</h2>
        <p class="card-en" lang="en">${article.title.en}</p>
        <p lang="zh">${article.dek.zh}</p>
        <p lang="en">${article.dek.en}</p>
      </div>
    </a>
  `;
}

export function renderHome(): string {
  return `
    <main class="page">
      <section class="hero">
        <p class="kicker">Two units · 兩個單元</p>
        <h1 lang="zh">先選一間教室</h1>
        <h1 lang="en">Pick a classroom</h1>
        <p class="subhead" lang="zh">醫學筆記還在。旁邊新開一間酸種廚房。</p>
        <p class="subhead" lang="en">The medicine notes stay. A sourdough kitchen opened next door.</p>
      </section>
      <section class="unit-grid">
        ${units
          .map(
            (unit) => `
          <a class="unit-card" href="${hrefUnit(unit.id)}">
            <p class="kicker">${unit.kicker.zh} · ${unit.kicker.en}</p>
            <h2 lang="zh">${unit.title.zh}</h2>
            <h2 lang="en">${unit.title.en}</h2>
            <p lang="zh">${unit.subhead.zh}</p>
            <p lang="en">${unit.subhead.en}</p>
          </a>`,
          )
          .join("")}
      </section>
    </main>
  `;
}

export function renderUnitHome(unit: UnitId): string {
  const meta = units.find((item) => item.id === unit) ?? units[0];
  const list = articlesFor(unit);
  const filters =
    unit === "bread"
      ? [
          ["all", "全部 / All"],
          ["starter", "菌種 / Starter"],
          ["ingredient", "材料 / Ingredients"],
          ["method", "工法 / Method"],
          ["bake", "烘烤 / Bake"],
          ["tools", "器材 / Tools"],
        ]
      : [
          ["all", "全部 / All"],
          ["vaccine", "疫苗 / Vaccine"],
          ["gene", "基因 / Gene"],
          ["cancer", "癌症 / Cancer"],
          ["brain", "大腦 / Brain"],
        ];

  return `
    <main class="page">
      <section class="hero">
        <p class="kicker">${meta.kicker.zh} · ${meta.kicker.en}</p>
        ${
          unit === "bread"
            ? `<svg class="hero-mark" viewBox="0 0 80 80" aria-hidden="true">
          <ellipse cx="40" cy="52" rx="18" ry="8" fill="none" stroke="currentColor"/>
          <rect x="28" y="22" width="24" height="30" fill="none" stroke="currentColor"/>
          <circle cx="36" cy="34" r="2" fill="currentColor">
            <animate attributeName="cy" values="36;28;36" dur="2.4s" repeatCount="indefinite"/>
          </circle>
        </svg>`
            : `<svg class="hero-mark" viewBox="0 0 80 80" aria-hidden="true">
          <circle cx="40" cy="40" r="24" fill="none" stroke="currentColor" stroke-width="1.4"/>
          <circle cx="40" cy="40" r="7" fill="currentColor">
            <animate attributeName="r" values="6;8;6" dur="3.2s" repeatCount="indefinite"/>
          </circle>
        </svg>`
        }
        <h1 lang="zh">${meta.title.zh}</h1>
        <h1 lang="en">${meta.title.en}</h1>
        <p class="subhead" lang="zh">${meta.subhead.zh}</p>
        <p class="subhead" lang="en">${meta.subhead.en}</p>
        <div class="pair lede">
          <p lang="zh">${meta.lede.zh}</p>
          <p lang="en">${meta.lede.en}</p>
        </div>
        <div class="toolbar" role="group" aria-label="篩選 / Filter">
          ${filters
            .map(
              ([id, label], i) =>
                `<button class="chip" type="button" data-filter="${id}" aria-pressed="${i === 0 ? "true" : "false"}">${label}</button>`,
            )
            .join("")}
        </div>
      </section>
      <section class="feed">
        ${list.map(card).join("")}
        <div class="feed-empty" hidden>
          <p lang="zh">這個分類現在沒有文章。</p>
          <p lang="en">Nothing in this filter yet.</p>
        </div>
      </section>
    </main>
  `;
}

export function bindHome(root: HTMLElement): void {
  const chips = root.querySelectorAll<HTMLButtonElement>("[data-filter]");
  const cards = root.querySelectorAll<HTMLElement>(".card");
  const empty = root.querySelector<HTMLElement>(".feed-empty");
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const filter = chip.dataset.filter ?? "all";
      chips.forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));
      cards.forEach((cardEl) => {
        const show = filter === "all" || cardEl.dataset.tag === filter;
        cardEl.style.display = show ? "" : "none";
      });
      if (empty) empty.hidden = [...cards].every((cardEl) => cardEl.style.display === "none");
    });
  });
}
