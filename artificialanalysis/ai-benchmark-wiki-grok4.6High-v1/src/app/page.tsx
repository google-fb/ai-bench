import Link from "next/link";
import { BenchmarkCard } from "@/components/benchmark-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BENCHMARKS } from "@/data/benchmarks";
import { INDEX_WEIGHTS, WHAT_IS_BENCHMARK } from "@/data/guides";
import { CATEGORIES } from "@/data/site";
import { SITE } from "@/data/site";
import { GUIDE_LINKS } from "@/lib/nav";

export default function HomePage() {
  const featured = BENCHMARKS.filter((item) => item.status === "index");
  const categories = CATEGORIES.filter((item) => item.id !== "overview");

  return (
    <div className="space-y-14">
      <section className="max-w-3xl space-y-5">
        <Badge variant="secondary">繁體中文教學百科</Badge>
        <h1 className="font-serif text-4xl leading-tight text-balance sm:text-5xl">
          {SITE.tagline}
        </h1>
        <p className="text-lg leading-relaxed text-muted-foreground text-pretty">
          {SITE.sourceName} 把全世界主要的 AI
          模型拿去「考試」。本站把那一頁上的評測翻譯成高中生聽得懂的話：它在考什麼、分數代表什麼、測試集是什麼、怎麼測、方法是什麼。
        </p>
        <div className="flex flex-wrap gap-3">
          <Button render={<Link href="/guide" />}>從「什麼是評測」開始</Button>
          <Button variant="outline" render={<Link href="/scores" />}>
            先學會看分數
          </Button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {WHAT_IS_BENCHMARK.points.map((point) => (
          <Card key={point.title}>
            <CardHeader>
              <CardTitle className="font-serif text-xl">{point.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-muted-foreground">
              {point.text}
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-3xl">智力指數的九科</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              現行 v4.1.1 把代理人、程式、科學推理與一般能力加權平均。點進去可看每一科的教室版說明。
            </p>
          </div>
          <Button variant="ghost" render={<Link href="/wiki/intelligence-index" />}>
            看總分條目
          </Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {INDEX_WEIGHTS.map((group) => (
            <Card key={group.category}>
              <CardHeader>
                <CardTitle className="text-base">{group.category}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-accent"
                  >
                    <span>{item.name}</span>
                    <span className="text-muted-foreground">{item.weight}</span>
                  </Link>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-3xl">列入總分的評測</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {featured.map((item) => (
            <BenchmarkCard key={item.slug} item={item} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-3xl">依主題逛百科</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.id}`}
              className="rounded-xl border bg-card p-5 hover:bg-accent"
            >
              <h3 className="font-serif text-xl">{category.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {category.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border bg-[color:var(--callout)] p-6">
        <h2 className="font-serif text-2xl">建議閱讀順序</h2>
        <ol className="mt-4 list-decimal space-y-3 pl-5">
          {GUIDE_LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="font-medium hover:underline">
                {link.title}
              </Link>
              <span className="text-muted-foreground"> — {link.description}</span>
            </li>
          ))}
          <li>
            再選你有興趣的一科，例如{" "}
            <Link href="/wiki/gpqa-diamond" className="underline">
              博士科學題
            </Link>
            或{" "}
            <Link href="/wiki/terminal-bench-v21" className="underline">
              終端機實作
            </Link>
            。
          </li>
        </ol>
      </section>
    </div>
  );
}
