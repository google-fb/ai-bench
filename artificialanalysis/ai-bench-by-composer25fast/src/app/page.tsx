import Link from "next/link";
import { WikiLayout } from "@/components/wiki-layout";
import { BenchmarkCard } from "@/components/benchmark-card";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { benchmarks } from "@/data/benchmarks";
import { categories } from "@/data/categories";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const featured = [
    benchmarks.find((b) => b.slug === "artificial-analysis-intelligence-index")!,
    benchmarks.find((b) => b.slug === "humanitys-last-exam")!,
    benchmarks.find((b) => b.slug === "mmlu-pro")!,
    benchmarks.find((b) => b.slug === "livecodebench")!,
    benchmarks.find((b) => b.slug === "aime-2025")!,
    benchmarks.find((b) => b.slug === "gdpval-aa-v2")!,
  ];

  return (
    <WikiLayout>
      <section className="mb-12">
        <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white shadow-lg sm:p-12">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            AI Benchmark 百科全書
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-blue-100">
            用高中生也聽得懂的語言，介紹 Artificial Analysis 網站上的{" "}
            <strong className="text-white">{benchmarks.length} 項</strong> AI
            基準測試——它們在測什麼、分數代表什麼、怎麼評分。
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/learn"
              className={cn(buttonVariants({ variant: "secondary", size: "lg" }))}
            >
              從基礎概念開始
            </Link>
            <Link
              href="/benchmarks"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "border-white/30 bg-white/10 text-white hover:bg-white/20"
              )}
            >
              瀏覽所有測試
            </Link>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-xl font-bold text-slate-900">一分鐘搞懂 Benchmark</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: "📝",
              title: "測試集 = 考題",
              desc: "專家設計的題目庫，AI 訓練時沒見過，用來公平比較不同模型。",
            },
            {
              icon: "📊",
              title: "分數 = 成績",
              desc: "通常是正確率（%），但不同測試難度差很多，不能隨便比。",
            },
            {
              icon: "⚙️",
              title: "方法 = 閱卷方式",
              desc: "自動對答案、AI 評審打分、或比較兩個模型的成果。",
            },
            {
              icon: "🤖",
              title: "代理 = 會行動的 AI",
              desc: "不只回答問題，還能寫程式、操作軟體、完成多步驟任務。",
            },
          ].map((item) => (
            <Card key={item.title} className="border-slate-200">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <span className="text-2xl">{item.icon}</span>
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-xl font-bold text-slate-900">八大分類</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => {
            const count = benchmarks.filter((b) => b.category === cat.id).length;
            return (
              <Link key={cat.id} href={`/benchmarks?category=${cat.id}`}>
                <Card className="h-full transition-all hover:border-blue-200 hover:shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <span className="text-xl">{cat.icon}</span>
                      {cat.label}
                      <span className="ml-auto text-sm font-normal text-slate-400">
                        {count}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm">{cat.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">熱門測試項目</h2>
          <Link
            href="/benchmarks"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            查看全部 →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((b) => (
            <BenchmarkCard key={b.slug} benchmark={b} />
          ))}
        </div>
      </section>
    </WikiLayout>
  );
}
