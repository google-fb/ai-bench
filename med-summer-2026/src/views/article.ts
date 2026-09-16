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

function escapeAttr(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

function figure(article: Article, index: number): string {
  const img = article.images[index];
  if (!img) return "";
  return `
    <figure class="figure">
      <img src="${import.meta.env.BASE_URL}${img.src}" alt="${escapeAttr(text(img.alt))}" />
      <figcaption>
        <span lang="zh">${img.alt.zh}</span>
        <span lang="en">${img.alt.en}</span>
      </figcaption>
    </figure>
  `;
}

function labBlock(article: Article): string {
  return `
      <section class="lab" data-lab="${article.lab.kind}" data-slug="${article.slug}">
        <div class="lab-head">
          <strong lang="zh">${article.lab.title.zh}</strong>
          <span lang="en">${article.lab.title.en}</span>
        </div>
        <div class="lab-brief">
          <div>
            <small>這堂在學什麼 / What you learn</small>
            <p lang="zh">${article.lab.lesson.zh}</p>
            <p lang="en">${article.lab.lesson.en}</p>
          </div>
          <div>
            <small>怎麼玩 / How to play</small>
            <p lang="zh">${article.lab.how.zh}</p>
            <p lang="en">${article.lab.how.en}</p>
          </div>
        </div>
        <ol class="lab-steps">
          ${article.lab.steps
            .map(
              (step, i) => `
            <li data-step="${step.id}" class="${i === 0 ? "is-current" : ""}" aria-current="${i === 0 ? "step" : "false"}">
              <span class="n">${i + 1}</span>
              <span class="lab-step-copy">
                <span lang="zh">${step.title.zh}</span>
                <span lang="en">${step.title.en}</span>
              </span>
            </li>`,
            )
            .join("")}
        </ol>
        <canvas width="960" height="540" tabindex="0" role="img" aria-label="${escapeAttr(text(article.lab.title))}" aria-describedby="lab-note-${article.slug}"></canvas>
        <div class="lab-note" id="lab-note-${article.slug}" aria-live="polite">
          <b lang="zh">${article.lab.hint.zh}</b>
          <p lang="zh">${article.lab.how.zh}</p>
          <b lang="en">${article.lab.hint.en}</b>
          <p lang="en">${article.lab.how.en}</p>
        </div>
        <p class="lab-keys" lang="zh">鍵盤：Enter／空白鍵跟下一步，R 重來。</p>
        <p class="lab-keys" lang="en">Keyboard: Enter or Space follows the next step; R resets.</p>
        <div class="lab-bar">
          <button type="button" data-lab-reset>重來 / Reset</button>
          <span data-lab-progress>0/${article.lab.steps.length}</span>
        </div>
      </section>
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
      <nav class="crumbs" aria-label="Breadcrumb">
        <a href="${hrefHome()}">目錄 / Index</a> · NO. ${String(article.rank).padStart(2, "0")}
      </nav>
      <p class="meta">
        <span lang="zh">${article.dateLabel.zh}</span>
        <span lang="en">${article.dateLabel.en}</span>
        <span>${tag.zh} / ${tag.en}</span>
        <span>${stage.zh} / ${stage.en}</span>
      </p>
      <h1 class="article-title" lang="zh" tabindex="-1">${article.title.zh}</h1>
      <h1 class="article-title" lang="en" tabindex="-1">${article.title.en}</h1>
      ${pair(article.dek)}
      <p class="hint lab-lead">
        <span lang="zh">先玩下面這格，再往下讀。</span>
        <span lang="en">Try the lab first, then keep reading.</span>
      </p>
      ${labBlock(article)}
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
      <p class="section-label">來源 / Sources</p>
      <ul class="sources">
        ${article.sources
          .map((source) => `<li><a href="${source.href}" target="_blank" rel="noreferrer">${source.label}</a></li>`)
          .join("")}
      </ul>
      <nav class="pager">
        <div>${
          prev
            ? `<a href="${hrefArticle(prev.slug)}"><small>上一篇 / Prev</small><span lang="zh">${prev.title.zh}</span><span lang="en">${prev.title.en}</span></a>`
            : ""
        }</div>
        <div>${
          next
            ? `<a href="${hrefArticle(next.slug)}"><small>下一篇 / Next</small><span lang="zh">${next.title.zh}</span><span lang="en">${next.title.en}</span></a>`
            : ""
        }</div>
      </nav>
    </article>
  `;
}
