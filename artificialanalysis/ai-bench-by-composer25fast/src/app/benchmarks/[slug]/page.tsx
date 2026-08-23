import { notFound } from "next/navigation";
import Link from "next/link";
import { WikiLayout } from "@/components/wiki-layout";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { benchmarks, getBenchmarkBySlug } from "@/data/benchmarks";
import { getCategoryById } from "@/data/categories";
import { scoreTypeLabels } from "@/data/concepts";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return benchmarks.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const benchmark = getBenchmarkBySlug(slug);
  if (!benchmark) return { title: "找不到測試" };
  return {
    title: `${benchmark.nameZh} | AI Benchmark Wiki`,
    description: benchmark.summary,
  };
}

const sections = [
  { key: "whatIsIt", title: "這是什麼？", icon: "❓" },
  { key: "testSet", title: "測試集是什麼？", icon: "📋" },
  { key: "howToTest", title: "怎麼測試？", icon: "🔬" },
  { key: "scoring", title: "分數代表什麼？", icon: "📊" },
  { key: "method", title: "評分方法", icon: "⚙️" },
] as const;

export default async function BenchmarkDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const benchmark = getBenchmarkBySlug(slug);
  if (!benchmark) notFound();

  const category = getCategoryById(benchmark.category);
  const scoreInfo = scoreTypeLabels[benchmark.scoreType];

  return (
    <WikiLayout activeSlug={slug}>
      <nav className="mb-4 text-sm text-slate-500">
        <Link href="/benchmarks" className="hover:text-blue-600">
          所有測試
        </Link>
        <span className="mx-2">/</span>
        <span className="text-slate-800">{benchmark.nameZh}</span>
      </nav>

      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {category && (
            <Badge variant="secondary">
              {category.icon} {category.label}
            </Badge>
          )}
          <Badge variant="outline">{scoreInfo?.label}</Badge>
        </div>
        <h1 className="text-3xl font-bold text-slate-900">{benchmark.nameZh}</h1>
        <p className="mt-1 text-lg text-slate-500">{benchmark.nameEn}</p>
        <p className="mt-4 text-lg text-slate-700 leading-relaxed">{benchmark.summary}</p>
        <a
          href={benchmark.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: "outline" }), "mt-4 inline-flex")}
        >
          查看 Artificial Analysis 原始頁面 ↗
        </a>
      </header>

      <div className="space-y-6">
        {sections.map((section) => (
          <Card key={section.key}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <span>{section.icon}</span>
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 leading-relaxed">
                {benchmark[section.key]}
              </p>
            </CardContent>
          </Card>
        ))}

        {benchmark.tips && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
            <p className="font-medium text-amber-900">💡 小提示</p>
            <p className="mt-2 text-sm text-amber-800 leading-relaxed">{benchmark.tips}</p>
          </div>
        )}
      </div>

      <Separator className="my-10" />

      <section>
        <h2 className="mb-4 text-lg font-bold text-slate-900">相關測試</h2>
        <div className="flex flex-wrap gap-2">
          {benchmarks
            .filter((b) => b.category === benchmark.category && b.slug !== slug)
            .slice(0, 5)
            .map((b) => (
              <Link key={b.slug} href={`/benchmarks/${b.slug}`}>
                <Badge
                  variant="outline"
                  className="cursor-pointer px-3 py-1.5 text-sm hover:bg-slate-100"
                >
                  {b.nameZh}
                </Badge>
              </Link>
            ))}
        </div>
      </section>
    </WikiLayout>
  );
}
