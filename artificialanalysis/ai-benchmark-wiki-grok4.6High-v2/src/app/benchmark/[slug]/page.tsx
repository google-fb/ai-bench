import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BenchmarkCard } from "@/components/benchmark-card";
import { Callout } from "@/components/callout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { benchmarks, getBenchmark, getRelated } from "@/data/benchmarks";
import { categories } from "@/data/categories";
import { statusHint, statusLabel } from "@/lib/status";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return benchmarks.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getBenchmark(slug);
  if (!item) return { title: "找不到評測" };
  return {
    title: item.name,
    description: item.oneLiner,
  };
}

const sections = [
  ["whatItTests", "測什麼"],
  ["scoreMeaning", "分數意義"],
  ["testSet", "測試集是什麼"],
  ["howTested", "怎麼測試"],
  ["method", "方法是什麼"],
] as const;

export default async function BenchmarkPage({ params }: Props) {
  const { slug } = await params;
  const item = getBenchmark(slug);
  if (!item) notFound();

  const category = categories.find((entry) => entry.id === item.category);
  const related = getRelated(item);

  return (
    <article className="space-y-8">
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Badge>{statusLabel[item.status]}</Badge>
          {category ? <Badge variant="secondary">{category.name}</Badge> : null}
          {item.inIndex && item.indexWeight ? (
            <Badge variant="outline">
              {item.indexCategory} · {item.indexWeight}
            </Badge>
          ) : null}
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-balance md:text-4xl">
          {item.name}
        </h1>
        <p className="text-muted-foreground">{item.englishName}</p>
        <p className="max-w-3xl text-lg leading-8">{item.oneLiner}</p>
        <p className="text-sm text-muted-foreground">{statusHint[item.status]}</p>
      </div>

      <Callout title="用高中生活來想">{item.analogy}</Callout>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Fact label="計分方式" value={item.scoreType} />
        <Fact label="題數／任務數" value={item.questions} />
        <Fact label="重複次數" value={item.repeats} />
        <Fact label="能不能用工具" value={item.tools ? "可以（代理人／API／沙盒）" : "原則上不用外掛工具"} />
      </div>

      <div className="grid gap-4">
        {sections.map(([key, title]) => (
          <Card key={key}>
            <CardHeader>
              <CardTitle className="text-xl">{title}</CardTitle>
            </CardHeader>
            <CardContent className="leading-8">{item[key]}</CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">課堂例題</CardTitle>
        </CardHeader>
        <CardContent className="leading-8">{item.classroomExample}</CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">作答型態</CardTitle>
        </CardHeader>
        <CardContent className="leading-8">{item.responseType}</CardContent>
      </Card>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">容易誤會的地方</h2>
        <ul className="list-disc space-y-2 pl-5 leading-8">
          {item.misconceptions.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </section>

      {related.length > 0 ? (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">相關條目</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {related.map((entry) => (
              <BenchmarkCard key={entry.slug} item={entry} />
            ))}
          </div>
        </section>
      ) : null}

      <Separator />

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">延伸閱讀</h2>
        <ul className="space-y-2 text-sm">
          {item.sources.map((source) => (
            <li key={source.href}>
              <a
                className="text-primary underline-offset-2 hover:underline"
                href={source.href}
                target="_blank"
                rel="noreferrer"
              >
                {source.label}
              </a>
            </li>
          ))}
          <li>
            <Link className="text-muted-foreground hover:text-foreground" href="/catalog">
              回到全部評測
            </Link>
          </li>
        </ul>
      </section>
    </article>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <p className="text-xs tracking-wide text-muted-foreground uppercase">{label}</p>
      <p className="mt-1 text-sm leading-7 font-medium">{value}</p>
    </div>
  );
}
