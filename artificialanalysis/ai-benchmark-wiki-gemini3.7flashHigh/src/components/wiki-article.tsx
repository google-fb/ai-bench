import Link from "next/link";
import { ArrowUpRight, Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { relatedBenchmarks } from "@/data/benchmarks";
import { getCategory } from "@/data/site";
import type { Benchmark } from "@/data/types";

const SECTIONS: { key: keyof Benchmark; title: string; hint: string }[] = [
  { key: "what", title: "這項考試在測什麼", hint: "先建立直覺，再看細節。" },
  { key: "scoreMeaning", title: "分數代表什麼", hint: "高分不一定是 90 分那種高。" },
  { key: "dataset", title: "測試集是什麼", hint: "真正拿來打分數的那包題。" },
  { key: "howTested", title: "怎麼測試", hint: "模型被放進什麼環境、能用什麼工具。" },
  { key: "method", title: "方法與閱卷", hint: "誰改考卷、怎麼決定對錯。" },
];

export function WikiArticle({ item }: { item: Benchmark }) {
  const category = getCategory(item.category);
  const related = relatedBenchmarks(item.slug);

  return (
    <article className="space-y-10">
      <header className="space-y-4">
        <p className="text-sm text-muted-foreground">
          <Link href={`/category/${item.category}`} className="hover:underline">
            {category?.title}
          </Link>
        </p>
        <h1 className="font-serif text-4xl leading-tight text-balance">{item.name}</h1>
        <p className="text-sm tracking-wide text-muted-foreground uppercase">{item.nameEn}</p>
        <div className="flex flex-wrap gap-2">
          {item.status === "index" ? <Badge>列入智力指數</Badge> : null}
          {item.status === "legacy" ? <Badge variant="outline">舊版／退役</Badge> : null}
          {item.status === "active" ? <Badge variant="secondary">獨立榜</Badge> : null}
          {item.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
        <p className="max-w-3xl text-lg leading-relaxed text-pretty">{item.oneLiner}</p>
        <a
          href={item.officialUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-sm text-primary underline-offset-4 hover:underline"
        >
          查看 Artificial Analysis 原頁
          <ArrowUpRight className="size-3.5" />
        </a>
      </header>

      <Card className="border-primary/20 bg-[color:var(--callout)]">
        <CardHeader className="flex-row items-start gap-3">
          <Lightbulb className="mt-0.5 size-5 text-primary" />
          <div>
            <CardTitle className="font-serif text-xl">教室比喻</CardTitle>
            <p className="mt-2 text-sm leading-relaxed">{item.classroomAnalogy}</p>
          </div>
        </CardHeader>
      </Card>

      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {item.facts.map((fact) => (
          <div key={fact.label} className="rounded-xl border bg-card px-3 py-3">
            <dt className="text-xs text-muted-foreground">{fact.label}</dt>
            <dd className="mt-1 text-sm font-medium">{fact.value}</dd>
          </div>
        ))}
      </dl>

      {SECTIONS.map((section) => {
        const paragraphs = item[section.key] as string[];
        return (
          <section key={section.title} className="space-y-3">
            <div>
              <h2 className="font-serif text-2xl">{section.title}</h2>
              <p className="text-sm text-muted-foreground">{section.hint}</p>
            </div>
            <Separator />
            <div className="space-y-3">
              {paragraphs.map((paragraph) => (
                <p key={paragraph} className="leading-relaxed text-pretty">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        );
      })}

      <section className="space-y-3">
        <h2 className="font-serif text-2xl">給高中生的閱讀提示</h2>
        <Separator />
        <ul className="list-disc space-y-2 pl-5 leading-relaxed">
          {item.studentTips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </section>

      {related.length > 0 ? (
        <section className="space-y-3">
          <h2 className="font-serif text-2xl">相關條目</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {related.map((rel) => (
              <Link
                key={rel.slug}
                href={`/wiki/${rel.slug}`}
                className="rounded-xl border bg-card p-4 hover:bg-accent"
              >
                <p className="font-medium">{rel.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{rel.oneLiner}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
