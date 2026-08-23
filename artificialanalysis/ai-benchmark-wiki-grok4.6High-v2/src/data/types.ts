export type BenchmarkStatus = "index" | "standalone" | "legacy";

export type CategoryId =
  | "composite"
  | "agents"
  | "coding"
  | "science"
  | "general"
  | "other";

export type SourceLink = {
  label: string;
  href: string;
};

export type Benchmark = {
  slug: string;
  name: string;
  englishName: string;
  status: BenchmarkStatus;
  category: CategoryId;
  inIndex: boolean;
  indexWeight?: string;
  indexCategory?: string;
  oneLiner: string;
  analogy: string;
  whatItTests: string;
  scoreMeaning: string;
  scoreType: string;
  testSet: string;
  howTested: string;
  method: string;
  classroomExample: string;
  questions: string;
  repeats: string;
  responseType: string;
  tools: boolean;
  misconceptions: string[];
  sources: SourceLink[];
  related: string[];
};

export type CategoryMeta = {
  id: CategoryId;
  name: string;
  description: string;
};
