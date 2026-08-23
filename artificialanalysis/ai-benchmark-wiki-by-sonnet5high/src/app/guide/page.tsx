import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WHAT_IS_BENCHMARK } from "@/data/guides";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "什麼是 AI 評測",
};

export default function GuidePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header className="space-y-3">
        <p className="text-sm text-muted-foreground">導讀</p>
        <h1 className="font-serif text-4xl">{WHAT_IS_BENCHMARK.title}</h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          {WHAT_IS_BENCHMARK.intro}
        </p>
      </header>

      <section className="space-y-4 leading-relaxed">
        <p>
          想像全台高中要比較「誰的數學比較好」。如果每間學校自己出題、自己算分，第一名會到處都是。所以我們需要學測：同一天、同一張考卷、同一套閱卷規則。
        </p>
        <p>
          AI 的 benchmark 就是這件事。研究機構或公司出一包題，規定能不能上網、能不能跑程式、怎麼算對，然後讓不同模型在相同條件下應考。Artificial Analysis
          的角色比較像「獨立閱卷中心」：很多題不是他們原創的，但他們用同一套方法重測，分數才能並排比較。
        </p>
      </section>

      <div className="grid gap-4">
        {WHAT_IS_BENCHMARK.points.map((point) => (
          <Card key={point.title}>
            <CardHeader>
              <CardTitle className="font-serif text-2xl">{point.title}</CardTitle>
            </CardHeader>
            <CardContent className="leading-relaxed">{point.text}</CardContent>
          </Card>
        ))}
      </div>

      <section className="space-y-3 leading-relaxed">
        <h2 className="font-serif text-2xl">五個一定要分開看的東西</h2>
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            <strong>項目</strong>：這場考試的名字與目的。例如「博士科學選擇題」和「銀行客服實作」完全不同科。
          </li>
          <li>
            <strong>分數意義</strong>：有的是答對率，有的是 Elo 段位，有的是「資料庫最後對不對」。
          </li>
          <li>
            <strong>測試集</strong>：真正打分數的那包題。有公開的、有私有的。私有是為了防止被背答案。
          </li>
          <li>
            <strong>怎麼測</strong>：能不能搜尋、能不能開終端機、重測幾次、步數上限多少。
          </li>
          <li>
            <strong>方法</strong>：誰閱卷（程式、測試案例，還是另一個 AI）、提示詞長怎樣、規則公不公開。
          </li>
        </ol>
      </section>

      <section className="rounded-2xl border bg-[color:var(--callout)] p-6 leading-relaxed">
        <h2 className="font-serif text-2xl">接下來讀什麼</h2>
        <p className="mt-3">
          先看{" "}
          <Link href="/scores" className="underline">
            怎麼讀分數
          </Link>
          ，再看{" "}
          <Link href="/wiki/intelligence-index" className="underline">
            智力指數
          </Link>
          。若你只想先點一種考試，{" "}
          <Link href="/wiki/gpqa-diamond" className="underline">
            GPQA Diamond
          </Link>{" "}
          最像「很難的理科選擇題」，很好建立直覺。
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          原始榜單：{" "}
          <a href={SITE.sourceUrl} className="underline" target="_blank" rel="noreferrer">
            {SITE.sourceUrl}
          </a>
        </p>
      </section>
    </div>
  );
}
