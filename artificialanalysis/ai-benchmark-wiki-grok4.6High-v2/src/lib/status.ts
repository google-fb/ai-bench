import type { BenchmarkStatus } from "@/data/types";

export const statusLabel: Record<BenchmarkStatus, string> = {
  index: "智力指數組成",
  standalone: "獨立評測",
  legacy: "舊版／已退役",
};

export const statusHint: Record<BenchmarkStatus, string> = {
  index: "目前會計入 Artificial Analysis 智力指數 v4.1.1。",
  standalone: "會單獨公布榜，但不加進智力總分。",
  legacy: "曾用來排名，現在主要留下當歷史對照。",
};
