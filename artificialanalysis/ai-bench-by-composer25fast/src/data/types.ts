export type CategoryType = 
  | 'overview'
  | 'reasoning'
  | 'math'
  | 'coding'
  | 'agentic'
  | 'multimodal'
  | 'long-context'
  | 'instruction-following';

export interface BenchmarkItem {
  id: string;
  name: string;
  category: CategoryType;
  categoryName: string;
  tagline: string;
  highSchoolMetaphor: string; // 高中生秒懂的比喻
  origin: string; // 出處/開發機構 (如 Artificial Analysis, OpenAI, Berkeley 等)
  datasetScale: string; // 測試集規模 (題目數/資料量)
  evalMethod: string; // 測試方法 (Prompt、Sandboxed Code Execution、LLM-as-a-judge、Elo 對戰等)
  metricType: string; // 指標類型 (Pass@1, Accuracy %, Elo Rating, Success Rate %)
  humanBaseline: string; // 人類基準 (例如：一般大學生 34%，PhD 專家 65%)
  topModelScores: {
    model: string;
    score: string;
    note?: string;
  }[];
  whatItTests: string[]; // 考什麼能力
  whyItMatters: string; // 為什麼這項測試重要
  highSchoolExample: {
    question: string;
    options?: string[];
    answer: string;
    explanation: string;
    whyAiFindsItHard: string;
  };
  limitationsAndContamination: string; // 盲點與資料污染（為什麼不能只看這個分數）
}

export interface MetricExplainer {
  name: string;
  english: string;
  formula: string;
  easyExplanation: string;
  schoolAnalogy: string;
  trapToWatch: string;
}

export interface QuizQuestion {
  id: number;
  benchmarkId: string;
  benchmarkName: string;
  category: string;
  difficulty: '高中段考題' | '學測/指考題' | '奧林匹亞/博士級';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  aiTypicalMistake: string;
}
