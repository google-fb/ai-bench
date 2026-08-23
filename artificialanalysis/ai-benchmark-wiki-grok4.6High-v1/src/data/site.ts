import type { Category, CategoryId } from "./types";

export const SITE = {
  name: "AI 評測百科",
  englishName: "AI Benchmark Wiki",
  tagline: "用高中生聽得懂的話，讀懂 Artificial Analysis 上的 AI 考試",
  sourceName: "Artificial Analysis Evaluations",
  sourceUrl: "https://artificialanalysis.ai/evaluations",
  methodologyUrl:
    "https://artificialanalysis.ai/methodology/intelligence-benchmarking/",
};

export const CATEGORIES: Category[] = [
  {
    id: "overview",
    title: "先搞懂評測",
    description: "什麼是 benchmark、分數怎麼讀、為什麼同一家模型會有很多種成績。",
  },
  {
    id: "index",
    title: "綜合指數",
    description: "把很多考試合成一張成績單，用來比較「整體有多聰明」或「有多開放」。",
  },
  {
    id: "agent",
    title: "智慧代理人",
    description: "不只回答問題，還要自己查資料、按工具、交出報告或改好系統。",
  },
  {
    id: "coding",
    title: "程式與終端機",
    description: "寫程式、修環境、在黑色終端機裡把任務做完。",
  },
  {
    id: "science",
    title: "科學與推理",
    description: "博士等級的科學題、物理研究題、人類最後一場學術考試。",
  },
  {
    id: "knowledge",
    title: "知識、長文與守規則",
    description: "會不會亂掰、能不能讀超長文件、能不能照指令格式交卷。",
  },
  {
    id: "math",
    title: "數學競賽",
    description: "像奧林匹亞或學測進階數學一樣，看模型會不會解難題。",
  },
  {
    id: "language",
    title: "語言與多模態",
    description: "多國語言選擇題，以及看圖再答學科問題。",
  },
  {
    id: "professional",
    title: "專業職場",
    description: "法律、醫療、企業系統、客服與資料分析等真實工作情境。",
  },
];

export const CATEGORY_ORDER: CategoryId[] = [
  "overview",
  "index",
  "agent",
  "coding",
  "science",
  "knowledge",
  "math",
  "language",
  "professional",
];

export function getCategory(id: CategoryId) {
  return CATEGORIES.find((category) => category.id === id);
}
