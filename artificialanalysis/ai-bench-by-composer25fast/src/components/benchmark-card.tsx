import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Benchmark } from "@/types/benchmark";
import { getCategoryById } from "@/data/categories";
import { scoreTypeLabels } from "@/data/concepts";

interface BenchmarkCardProps {
  benchmark: Benchmark;
}

export function BenchmarkCard({ benchmark }: BenchmarkCardProps) {
  const category = getCategoryById(benchmark.category);
  const scoreInfo = scoreTypeLabels[benchmark.scoreType];

  return (
    <Link href={`/benchmarks/${benchmark.slug}`}>
      <Card className="h-full transition-all hover:border-blue-200 hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base leading-snug">{benchmark.nameZh}</CardTitle>
            {category && (
              <Badge variant="secondary" className="shrink-0 text-xs">
                {category.icon} {category.label}
              </Badge>
            )}
          </div>
          <CardDescription className="text-xs">{benchmark.nameEn}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="line-clamp-2 text-sm text-slate-600">{benchmark.summary}</p>
          <p className="mt-3 text-xs text-slate-400">評分方式：{scoreInfo?.label}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
