import type { Metadata } from "next";
import Link from "next/link";
import { HOW_TO_READ, INDEX_WEIGHTS } from "@/data/guides";

export const metadata: Metadata = {
  title: "怎麼讀分數",
};

export default function ScoresPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header className="space-y-3">
        <p className="text-sm text-muted-foreground">導讀</p>
        <h1 className="font-serif text-4xl">{HOW_TO_READ.title}</h1>
        <p className="text-lg leading-relaxed text-muted-foreground">{HOW_TO_READ.intro}</p>
      </header>

      {HOW_TO_READ.sections.map((section) => (
        <section key={section.heading} className="space-y-3">
          <h2 className="font-serif text-2xl">{section.heading}</h2>
          {section.body.map((paragraph) => (
            <p key={paragraph} className="leading-relaxed">
              {paragraph}
            </p>
          ))}
        </section>
      ))}

      <section className="space-y-3">
        <h2 className="font-serif text-2xl">智力指數現在怎麼加權</h2>
        <p className="leading-relaxed text-muted-foreground">
          v4.1.1 比較重視「會不會自己把事情做完」。下面是教室版速查表。
        </p>
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left">
              <tr>
                <th className="px-3 py-2 font-medium">類別</th>
                <th className="px-3 py-2 font-medium">評測</th>
                <th className="px-3 py-2 font-medium">權重</th>
              </tr>
            </thead>
            <tbody>
              {INDEX_WEIGHTS.flatMap((group) =>
                group.items.map((item, index) => (
                  <tr key={item.href} className="border-t">
                    {index === 0 ? (
                      <td className="px-3 py-2 align-top" rowSpan={group.items.length}>
                        {group.category}
                      </td>
                    ) : null}
                    <td className="px-3 py-2">
                      <Link href={item.href} className="hover:underline">
                        {item.name}
                      </Link>
                    </td>
                    <td className="px-3 py-2">{item.weight}</td>
                  </tr>
                )),
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3 leading-relaxed">
        <h2 className="font-serif text-2xl">讀排行榜時的三個陷阱</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>不要把不同網站的分數直接相減。提示詞、步數、閱卷老師一換，數字就變。</li>
          <li>舊版指數（例如還含 MMLU-Pro 或 Terminal-Bench Hard 的版本）不能跟 v4.1.1 硬比。</li>
          <li>
            總分第一名不一定最適合你。寫中文報告請看{" "}
            <Link href="/wiki/global-mmlu-lite" className="underline">
              多語評測
            </Link>
            ；怕亂掰請看{" "}
            <Link href="/wiki/aa-omniscience" className="underline">
              全知
            </Link>
            。
          </li>
        </ul>
      </section>
    </div>
  );
}
