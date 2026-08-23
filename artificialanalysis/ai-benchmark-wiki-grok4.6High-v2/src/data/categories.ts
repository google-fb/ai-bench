import type { CategoryMeta } from "./types";

export const categories: CategoryMeta[] = [
  {
    id: "composite",
    name: "綜合指數",
    description: "把很多考試合成一張成績單，用來快速比較模型。",
  },
  {
    id: "agents",
    name: "代理人任務",
    description: "AI 要自己用工具、查資料、改檔案，完成像上班一樣的工作。",
  },
  {
    id: "coding",
    name: "程式與終端機",
    description: "考寫程式、修系統、在電腦終端機裡把事情做完。",
  },
  {
    id: "science",
    name: "科學推理",
    description: "考很難的數學、物理、化學、生物與學術問題。",
  },
  {
    id: "general",
    name: "知識與長文",
    description: "考事實記憶、會不會亂講，以及讀超長文件後再推理。",
  },
  {
    id: "other",
    name: "其他能力",
    description: "多語、看圖、遵從指令、醫學長文等額外考試。",
  },
];
