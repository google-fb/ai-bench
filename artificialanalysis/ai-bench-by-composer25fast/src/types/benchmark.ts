export type BenchmarkCategory =
  | "composite"
  | "knowledge"
  | "math"
  | "coding"
  | "agentic"
  | "professional"
  | "multimodal"
  | "specialized";

export type ScoreType = "percentage" | "index" | "elo" | "completion";

export interface Benchmark {
  slug: string;
  nameZh: string;
  nameEn: string;
  category: BenchmarkCategory;
  summary: string;
  whatIsIt: string;
  testSet: string;
  howToTest: string;
  scoring: string;
  method: string;
  scoreType: ScoreType;
  tips?: string;
  sourceUrl: string;
}

export interface CategoryInfo {
  id: BenchmarkCategory;
  label: string;
  description: string;
  icon: string;
}
