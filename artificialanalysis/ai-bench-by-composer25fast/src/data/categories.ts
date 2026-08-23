import type { CategoryInfo } from "@/types/benchmark";

export const categories: CategoryInfo[] = [
  {
    id: "composite",
    label: "綜合指數",
    description: "把多個測試合併成一個總分，像「全科成績」一樣衡量 AI 整體能力。",
    icon: "📊",
  },
  {
    id: "knowledge",
    label: "知識與推理",
    description: "測試 AI 是否具備各學科知識，以及能不能正確推理出答案。",
    icon: "🧠",
  },
  {
    id: "math",
    label: "數學",
    description: "從高中競賽到奧林匹亞等級的數學題，考驗邏輯與計算能力。",
    icon: "🔢",
  },
  {
    id: "coding",
    label: "程式設計",
    description: "讓 AI 寫程式、除錯、在終端機完成任務。",
    icon: "💻",
  },
  {
    id: "agentic",
    label: "AI 代理",
    description: "AI 不只是回答問題，還要能像助理一樣使用工具、完成多步驟任務。",
    icon: "🤖",
  },
  {
    id: "professional",
    label: "專業應用",
    description: "模擬法律、醫療、企業營運等真實工作場景。",
    icon: "💼",
  },
  {
    id: "multimodal",
    label: "多模態",
    description: "同時處理文字、圖片等多種輸入的測試。",
    icon: "🖼️",
  },
  {
    id: "specialized",
    label: "專項測試",
    description: "針對特定能力（如長文理解、指令遵循、幻覺）的專門評估。",
    icon: "🎯",
  },
];

export function getCategoryById(id: string) {
  return categories.find((c) => c.id === id);
}
