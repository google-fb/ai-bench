import { BENCHMARKS } from "@/data/benchmarks";
import { CATEGORIES, CATEGORY_ORDER } from "@/data/site";
import type { CategoryId } from "@/data/types";

export const GUIDE_LINKS = [
  { href: "/guide", title: "什麼是評測", description: "用學測比喻搞懂 benchmark" },
  { href: "/scores", title: "怎麼讀分數", description: "正確率、Elo、pass@1 差在哪" },
  { href: "/glossary", title: "詞彙表", description: "幻覺、污染、沙盒……一次看懂" },
  { href: "/quiz", title: "🎯 高中生挑戰 AI 真題", description: "5題經典真題與陷阱解析" },
  { href: "/diagnostic", title: "🧭 AI 選型診斷器", description: "寫code/解題該看哪個指標" },
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
