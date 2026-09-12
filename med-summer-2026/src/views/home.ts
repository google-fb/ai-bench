import { articles, stageCopy, tagCopy } from "../data/articles";
import { hrefArticle } from "../router";
import type { Article } from "../types";

function card(article: Article): string {
  const tag = tagCopy[article.tag];
  const stage = stageCopy[article.stage];
  return `
    <a class="card" href="${hrefArticle(article.slug)}" data-tag="${article.tag}">
      <div class="rank">NO. ${String(article.rank).padStart(2, "0")}</div>
      <div>
        <div class="meta">
          <span>${article.dateLabel.zh}</span>
          <span>${tag.zh} / ${tag.en}</span>
          <span>${stage.zh} / ${stage.en}</span>
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
        <p class="kicker">July – August 2026 · Top 10</p>
        <svg class="hero-mark" viewBox="0 0 80 80" aria-hidden="true">
          <circle cx="40" cy="40" r="24" fill="none" stroke="currentColor" stroke-width="1.4"/>
          <circle cx="40" cy="40" r="7" fill="currentColor">
            <animate attributeName="r" values="6;8;6" dur="3.2s" repeatCount="indefinite"/>
          </circle>
          <circle cx="40" cy="14" r="3" fill="currentColor">
            <animateTransform attributeName="transform" type="rotate" from="0 40 40" to="360 40 40" dur="8s" repeatCount="indefinite"/>
          </circle>
        </svg>
        <h1 lang="zh">今年夏天，醫學界在吵什麼</h1>
        <h1 lang="en">What medicine was shouting about this summer</h1>
        <p class="subhead" lang="zh">十篇故事。細胞可以戳。最後沒有考卷。</p>
        <p class="subhead" lang="en">Ten stories. Cells you can poke. No exam at the end.</p>
        <div class="pair lede">
          <p lang="zh">我們把 7、8 月跟疫苗、基因、癌症、大腦有關的大事收成十篇。用國中生物那種「點細胞核、看細胞壁」的方式，讓你動手摸一摸原理。口語、中英對照，不是考卷。</p>
          <p lang="en">Ten vaccine-first plus big-medicine stories from July and August. Each piece has a biology-class canvas — tap a nucleus, drag a memo, unstick a switch. Colloquial, bilingual, zero pop quiz.</p>
        </div>
        <div class="toolbar" role="tablist" aria-label="篩選">
          <button class="chip" type="button" data-filter="all" aria-pressed="true">全部 / All</button>
          <button class="chip" type="button" data-filter="vaccine">疫苗 / Vaccine</button>
          <button class="chip" type="button" data-filter="gene">基因 / Gene</button>
          <button class="chip" type="button" data-filter="cancer">癌症 / Cancer</button>
          <button class="chip" type="button" data-filter="brain">大腦 / Brain</button>
        </div>
      </section>
      <section class="feed">${articles.map(card).join("")}</section>
    </main>
  `;
}

export function bindHome(root: HTMLElement): void {
  const chips = root.querySelectorAll<HTMLButtonElement>("[data-filter]");
  const cards = root.querySelectorAll<HTMLElement>(".card");
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const filter = chip.dataset.filter ?? "all";
      chips.forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));
      cards.forEach((cardEl) => {
        const show = filter === "all" || cardEl.dataset.tag === filter;
        cardEl.style.display = show ? "" : "none";
      });
    });
  });
}
