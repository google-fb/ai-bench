import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Benchmark } from "@/data/types";
import { statusLabel } from "@/lib/status";

export function BenchmarkCard({ item }: { item: Benchmark }) {
  return (
    <Link href={`/benchmark/${item.slug}`} className="block h-full">
      <Card className="h-full transition-colors hover:border-primary/40 hover:bg-secondary/40">
        <CardHeader>
          <div className="mb-2 flex flex-wrap gap-1.5">
            <Badge variant="secondary">{statusLabel[item.status]}</Badge>
            {item.inIndex && item.indexWeight ? (
              <Badge variant="outline">指數 {item.indexWeight}</Badge>
            ) : null}
          </div>
          <CardTitle className="text-lg leading-snug">{item.name}</CardTitle>
          <CardDescription>{item.englishName}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-7 text-foreground/90">{item.oneLiner}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
