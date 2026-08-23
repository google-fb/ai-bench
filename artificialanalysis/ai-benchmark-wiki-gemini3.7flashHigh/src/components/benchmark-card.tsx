import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Benchmark } from "@/data/types";

const statusLabel = {
  index: "列入智力指數",
  active: "獨立榜",
  legacy: "舊版／退役",
} as const;

export function BenchmarkCard({ item }: { item: Benchmark }) {
  return (
    <Link href={`/wiki/${item.slug}`} className="block h-full">
      <Card className="h-full border-border/80 transition-shadow hover:shadow-md">
        <CardHeader className="gap-2">
          <div className="flex flex-wrap gap-1.5">
            <Badge variant={item.status === "legacy" ? "outline" : "secondary"}>
              {statusLabel[item.status]}
            </Badge>
            {item.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
          <CardTitle className="font-serif text-xl leading-snug">{item.name}</CardTitle>
          <p className="text-xs tracking-wide text-muted-foreground uppercase">
            {item.nameEn}
          </p>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-pretty">{item.oneLiner}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
