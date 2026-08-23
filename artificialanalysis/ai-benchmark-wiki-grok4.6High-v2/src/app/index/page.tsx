import type { Metadata } from "next";
import Link from "next/link";
import { Callout } from "@/components/callout";
import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { benchmarks } from "@/data/benchmarks";

export const metadata: Metadata = {
  title: "智力指數",
};

const groups = [
  {
    name: "代理人 34%",
    why: "真實世界愈來愈常請 AI 自己查資料、改檔案、把工作做完，而不只是聊天。",
    items: [
      { slug: "gdpval-aa-v2", weight: "20%", note: "職業任務對打，人類專家 = 1000 Elo" },
      { slug: "tau3-banking", weight: "14%", note: "銀行客服：規定書 + 後台必須改對" },
    ],
  },
  {
    name: "程式 24%",
    why: "會寫能跑的東西，比會解釋語法重要。",
    items: [
      { slug: "terminal-bench-v21", weight: "16%", note: "終端機 89 任務，測試全過才算" },
      { slug: "scicode", weight: "8%", note: "科學家出的 Python 實驗步驟" },
    ],
  },
  {
    name: "科學推理 24%",
    why: "壓模型去解專家級難題，避免只靠常識選擇題拿高分。",
    items: [
      { slug: "hle", weight: "12%", note: "人類最後一考，兩千多題超難學術題" },
      { slug: "gpqa-diamond", weight: "6%", note: "博士級生科／物理／化學，抗搜尋" },
      { slug: "critpt", weight: "6%", note: "未公開的研究級物理挑戰" },
    ],
  },
  {
    name: "一般 18%",
    why: "還是要看知識準不準、會不會亂編，以及讀得動超長文件。",
    items: [
      { slug: "aa-omniscience", weight: "8% + 4%", note: "正確率與不幻覺率拆開算" },
      { slug: "aa-lcr", weight: "6%", note: "約 10 萬 token 的長文推理" },
    ],
  },
];

export default function IndexPage() {
  return (
    <div className="space-y-10">
      <SectionHeading
        eyebrow="v4.1.1"
        title="人工分析智力指數：九合一成績單"
        description="這不是另一場考試，而是把九場很難的考試加權平均。官方估計總分的 95% 信賴區間大約小於 ±1%，但單科波動可以更大。"
      />

      <Callout title="怎麼心算總分">
        總分 ≈ 代理人×34% + 程式×24% + 科學×24% + 一般×18%。代理人裡 GDPval 最重（整張成績單的
        20%）。所以一個很會做簡報、不太會背冷門知識的模型，仍可能總分很高。
      </Callout>

      <div className="grid gap-4 md:grid-cols-2">
        {groups.map((group) => (
          <Card key={group.name}>
            <CardHeader>
              <CardTitle>{group.name}</CardTitle>
              <p className="text-sm leading-7 text-muted-foreground">{group.why}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {group.items.map((item) => {
                const bench = benchmarks.find((entry) => entry.slug === item.slug);
                return (
                  <Link
                    key={item.slug}
                    href={`/benchmark/${item.slug}`}
                    className="block rounded-lg border bg-background/70 p-3 hover:border-primary/40"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium">{bench?.name ?? item.slug}</span>
                      <Badge variant="secondary">{item.weight}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{item.note}</p>
                  </Link>
                );
              })}
            </CardContent>
          </Card>
        ))}
      </div>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">這張成績單故意不考的東西</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-muted-foreground">
          <li>看圖、聽語音：另外測，例如 MMMU-Pro。</li>
          <li>多語：用 Global-MMLU-Lite 組成多語指數。</li>
          <li>開不開放：看開放指數，跟聰不聰明分開。</li>
          <li>已經太好考、分不出高下的舊考卷：IFBench、MMLU-Pro、MATH-500、AIME 等。</li>
        </ul>
      </section>

      <p className="text-sm leading-7">
        想看九項之外的代理人、法律、醫學考卷，到{" "}
        <Link className="text-primary underline-offset-2 hover:underline" href="/catalog">
          全部評測
        </Link>
        。
      </p>
    </div>
  );
}
