import type { Metadata } from "next";
import { GLOSSARY } from "@/data/glossary";

export const metadata: Metadata = {
  title: "詞彙表",
};

export default function GlossaryPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header className="space-y-3">
        <p className="text-sm text-muted-foreground">導讀</p>
        <h1 className="font-serif text-4xl">詞彙表</h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          讀排行榜時常冒出來的詞。每個詞都配一個高中教室裡的解釋。
        </p>
      </header>
      <dl className="space-y-6">
        {GLOSSARY.map((item) => (
          <div key={item.term} id={item.term} className="rounded-xl border bg-card p-5">
            <dt className="font-serif text-2xl">
              {item.term}
              {item.english ? (
                <span className="ml-2 text-sm font-sans tracking-wide text-muted-foreground uppercase">
                  {item.english}
                </span>
              ) : null}
            </dt>
            <dd className="mt-3 leading-relaxed">{item.definition}</dd>
            {item.example ? (
              <p className="mt-2 text-sm text-muted-foreground">例子：{item.example}</p>
            ) : null}
          </div>
        ))}
      </dl>
    </div>
  );
}
