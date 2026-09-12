import { articles, stageCopy, tagCopy } from "../data/articles";
import { hrefArticle, hrefHome } from "../router";
import { prefs } from "../store";
import type { Article, Copy } from "../types";

function text(copy: Copy): string {
  if (prefs.lang === "en") return copy.en;
  if (prefs.lang === "zh") return copy.zh;
  return `${copy.zh} · ${copy.en}`;
}

function pair(copy: Copy): string {
  return `<div class="pair"><p lang="zh">${copy.zh}</p><p lang="en">${copy.en}</p></div>`;
}

function figure(article: Article, index: number): string {
  const img = article.images[index];
  if (!img) return "";
  return `
    <figure class="figure">
      <img src="${import.meta.env.BASE_URL}${img.src}" alt="${img.alt.zh}" />
      <figcaption>${text(img.alt)}</figcaption>
    </figure>
  `;
}

export function renderArticle(slug: string): string {
  const article = articles.find((item) => item.slug === slug);
  if (!article) {
    return `
      <main class="article-wrap">
        <p class="empty">找不到這篇。 / Story not found.</p>
        <p><a href="${hrefHome()}">← 回目錄 / Index</a></p>
      </main>
    `;
  }

  const index = articles.findIndex((item) => item.slug === slug);
  const prev = articles[index - 1];
  const next = articles[index + 1];
  const tag = tagCopy[article.tag];
  const stage = stageCopy[article.stage];

  return `
    <article class="article-wrap">
      <p class="crumbs"><a href="${hrefHome()}">目錄 / Index</a> · NO. ${String(article.rank).padStart(2, "0")}</p>
      <p class="meta">
        <span>${article.dateLabel.zh}</span>
        <span>${tag.zh} / ${tag.en}</span>
        <span>${stage.zh} / ${stage.en}</span>
      </p>
      <h1 class="article-title" lang="zh">${article.title.zh}</h1>
      <h1 class="article-title" lang="en">${article.title.en}</h1>
      ${pair(article.dek)}
      ${figure(article, 0)}
      ${article.sections
        .map(
          (section, i) => `
            <p class="section-label">${section.label.zh} / ${section.label.en}</p>
            ${pair(section.body)}
            ${i === 1 ? figure(article, 1) : ""}
          `,
        )
        .join("")}
      <section class="lab" data-lab="${article.lab.kind}" data-slug="${article.slug}">
        <div class="lab-head">
          <strong>${article.lab.title.zh}</strong>
          <span>${article.lab.title.en}</span>
        </div>
        <canvas width="960" height="540" aria-label="${article.lab.title.zh}"></canvas>
        <div class="lab-note">
          <b class="hint">${article.lab.hint.zh}</b>
          <p class="hint">${article.lab.hint.en}</p>
        </div>
      </section>
      <p class="section-label">來源 / Sources</p>
      <ul class="sources">
        ${article.sources
          .map((source) => `<li><a href="${source.href}" target="_blank" rel="noreferrer">${source.label}</a></li>`)
          .join("")}
      </ul>
      <nav class="pager">
        <div>${
          prev
            ? `<a href="${hrefArticle(prev.slug)}"><small>上一篇 / Prev</small>${prev.title.zh}</a>`
            : ""
        }</div>
        <div>${
          next
            ? `<a href="${hrefArticle(next.slug)}"><small>下一篇 / Next</small>${next.title.zh}</a>`
            : ""
        }</div>
      </nav>
    </article>
  `;
}
