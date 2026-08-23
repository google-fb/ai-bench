import Link from "next/link";
import { ArrowRight, BookOpenCheck, GraduationCap, ListChecks, Scale } from "lucide-react";
import { BenchmarkCard } from "@/components/benchmark-card";
import { Callout } from "@/components/callout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { benchmarks } from "@/data/benchmarks";
import { categories } from "@/data/categories";

const featured = ["intelligence-index", "gdpval-aa-v2", "hle", "aa-omniscience"]
  .map((slug) => benchmarks.find((item) => item.slug === slug))
  .filter((item): item is NonNullable<typeof item> => Boolean(item));

const starters = [
  {
    href: "/start",
    icon: GraduationCap,
    title: "先搞懂這些詞",
    body: "評測像考試、測試集像考卷、分數不是百分制那麼單純。",
  },
  {
    href: "/index",
    icon: Scale,
    title: "看懂智力指數",
    body: "九場考試怎麼加權，為什麼「會做事」權重比背知識高。",
  },
  {
    href: "/catalog",
    icon: ListChecks,
    title: "翻全部 28 項",
    body: "代理人、程式、科學、長文、多語與舊考卷都在這裡。",
  },
  {
    href: "/glossary",
    icon: BookOpenCheck,
    title: "查詞彙表",
    body: "pass@1、Elo、幻覺、污染、沙盒，用一句話講完。",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
        <div className="space-y-4">
          <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
            Traditional Chinese student wiki
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-balance md:text-5xl">
            把 AI 排行榜讀成一本評測課本
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
            Artificial Analysis 把很多很難的 AI 考試放在同一站。這個 Wiki
            用繁體中文說明每項測什麼、分數代表什麼、測試集是什麼、怎麼測、方法是什麼，讓高中生也能看懂新聞裡的「某模型拿下第一」。
          </p>
          <div className="flex flex-wrap gap-3">
            <Button render={<Link href="/start" />}>
              從基礎開始
              <ArrowRight />
            </Button>
            <Button variant="outline" render={<Link href="/catalog" />}>
              直接看評測目錄
            </Button>
          </div>
        </div>
        <Callout title="先記住一件事">
          排行榜不是「誰比較像人」，而是「誰在這套固定考卷上表現比較好」。換一套考卷，名次就可能換人。所以讀懂考試本身，比背分數更重要。
        </Callout>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {starters.map((item) => (
          <Link key={item.href} href={item.href} className="block">
            <Card className="h-full transition-colors hover:border-primary/40">
              <CardHeader className="flex-row items-start gap-3">
                <item.icon className="mt-1 size-5 text-primary" />
                <div>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.body}</p>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold">先看四個最常被提到的</h2>
          <Link href="/catalog" className="text-sm text-primary hover:underline">
            看全部
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {featured.map((item) => (
            <BenchmarkCard key={item.slug} item={item} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">依考試類型逛</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const count = benchmarks.filter((item) => item.category === category.id).length;
            return (
              <Card key={category.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm leading-7 text-muted-foreground">{category.description}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    render={<Link href={`/catalog?cat=${category.id}`} />}
                  >
                    {count} 項評測
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
