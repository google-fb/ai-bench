export type CategoryId =
  | "overview"
  | "index"
  | "agent"
  | "coding"
  | "science"
  | "knowledge"
  | "math"
  | "language"
  | "professional";

export type BenchmarkStatus = "index" | "active" | "legacy";

export type Benchmark = {
  slug: string;
  name: string;
  nameEn: string;
  category: CategoryId;
  status: BenchmarkStatus;
  tags: string[];
  officialUrl: string;
  oneLiner: string;
  classroomAnalogy: string;
  what: string[];
  scoreMeaning: string[];
  dataset: string[];
  howTested: string[];
  method: string[];
  studentTips: string[];
  related: string[];
  facts: { label: string; value: string }[];
};

export type GlossaryTerm = {
  term: string;
  english?: string;
  definition: string;
  example?: string;
};

export type Category = {
  id: CategoryId;
  title: string;
  description: string;
};
