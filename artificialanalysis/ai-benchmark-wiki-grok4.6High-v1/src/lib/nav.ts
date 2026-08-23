import { BENCHMARKS } from "@/data/benchmarks";
import { CATEGORIES, CATEGORY_ORDER } from "@/data/site";
import type { CategoryId } from "@/data/types";

export const GUIDE_LINKS = [
  { href: "/guide", title: "什麼是評測", description: "用學測比喻搞懂 benchmark" },
  { href: "/scores", title: "怎麼讀分數", description: "正確率、Elo、pass@1 差在哪" },
  { href: "/glossary", title: "詞彙表", description: "幻覺、污染、沙盒……一次看懂" },
];

export function navGroups() {
  return CATEGORY_ORDER.filter((id) => id !== "overview").map((id) => {
    const category = CATEGORIES.find((item) => item.id === id)!;
    return {
      ...category,
      items: BENCHMARKS.filter((bench) => bench.category === id),
    };
  });
}

export function categoryPath(id: CategoryId) {
  if (id === "overview") return "/guide";
  return `/category/${id}`;
}
