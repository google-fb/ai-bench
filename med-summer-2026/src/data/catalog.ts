import type { Article, Copy, UnitId } from "../types";
import { articles } from "./articles";
import { breadArticles } from "./bread";

export type UnitMeta = {
  id: UnitId;
  kicker: Copy;
  title: Copy;
  subhead: Copy;
  lede: Copy;
};

export const units: UnitMeta[] = [
  {
    id: "med",
    kicker: { zh: "單元 01 · 2026 夏天", en: "Unit 01 · Summer 2026" },
    title: { zh: "醫學筆記", en: "Medicine notes" },
    subhead: { zh: "十篇疫苗與藥物故事。細胞可以戳。", en: "Ten vaccine and drug stories. Cells you can poke." },
    lede: {
      zh: "7、8 月的疫苗、基因、癌症與大腦。每篇有一格可以動手的生物畫布。",
      en: "Vaccines, genes, cancer, and brains from July and August. Each piece has a canvas you can poke.",
    },
  },
  {
    id: "bread",
    kicker: { zh: "單元 02 · 酸種入門", en: "Unit 02 · Sourdough 101" },
    title: { zh: "酸種麵包", en: "Sourdough" },
    subhead: { zh: "十篇廚房課。麵團會動。最後沒有考卷。", en: "Ten kitchen lessons. Dough that moves. No exam." },
    lede: {
      zh: "材料、養種、水合、摺疊、整型、蒸氣與器材。用 SVG 動畫看氣泡怎麼長、麵筋怎麼拉。",
      en: "Flour, starter, hydration, folds, shaping, steam, and tools. SVG animations show bubbles and gluten.",
    },
  },
];

export function articlesFor(unit: UnitId): Article[] {
  return unit === "bread" ? breadArticles : articles.map((item) => ({ ...item, unit: "med" as const }));
}

export function findArticle(slug: string): Article | undefined {
  const bread = breadArticles.find((item) => item.slug === slug);
  if (bread) return bread;
  const med = articles.find((item) => item.slug === slug);
  return med ? { ...med, unit: "med" } : undefined;
}

export function unitOf(article: Article): UnitId {
  return article.unit ?? "med";
}
