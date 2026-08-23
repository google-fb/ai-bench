import type { Metadata } from "next";
import Link from "next/link";
import { Callout } from "@/components/callout";
import { SectionHeading } from "@/components/section-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "先搞懂這些",
};

const ideas = [
  {
    title: "評測 = 考試",
    body: "出題者先決定要考什麼能力，再規定答題方式與批改規則。模型不能跟老師討價還價。同一套規則套在所有模型上，分數才能互相比。",
  },
  {
    title: "測試集 = 考卷題目",
    body: "測試集是真正計分的那包題。如果這些題早就出現在訓練資料裡，模型可能是在背答案，不是真的會。所以有些考卷保持私有，有些持續換新題。",
  },
  {
    title: "分數 = 這場考試的成績，不是人生分數",
    body: "70% 可能是「198 題對了約 139 題」，也可能是「89 個終端機任務做完 62 個」。Elo 1200 更不是 1200 分滿分。先看計分單位，再看數字。",
  },
];

const scoreTypes = [
  {
    name: "正確率／pass@1",
    meaning: "第一次就要對的比例。選擇題、開放問答、程式測試都常用。",
    trap: "四選一亂猜也有 25%。所以 40% 在 GPQA 其實不算差。",
  },
  {
    name: "pass^5",
    meaning: "同一題連做五次都要對。AA-AnalystAgent 用這個，因為分析師給錯一次數字就很麻煩。",
    trap: "它比 pass@1 嚴很多，兩個 80% 不能互相比。",
  },
  {
    name: "Elo（對打分）",
    meaning: "請評審盲比兩份成品，誰比較常贏誰，分數就比較高。人類專家可被錨在 1000。",
    trap: "這不是正確率。800 的 Elo 不代表「只對 80%」。",
  },
  {
    name: "資料庫／環境狀態",
    meaning: "不管話說得漂不漂亮，後台有沒有改對才算。銀行客服、企業流程都是這種。",
    trap: "客服很有同理心但沒開爭議單，仍是 0 分。",
  },
  {
    name: "開放指數 0–100",
    meaning: "權重、授權、資料、方法有多公開，不是聰明分數。",
    trap: "最開放的模型不一定最強；最封閉的大廠模型常常智力很高。",
  },
];

const steps = [
  {
    title: "1. 出同一份題",
    body: "提示詞、溫度、可不可用工具，大家都一樣。這叫標準化。",
  },
  {
    title: "2. 模型作答",
    body: "有的只回 A/B/C/D；有的要寫程式；有的要在沙盒裡連續操作幾百步。",
  },
  {
    title: "3. 抽出答案",
    body: "選擇題用規則把「Answer: C」抓出來；程式題抽出程式碼去跑；開放題請另一個 AI 看意思一不一樣。",
  },
  {
    title: "4. 重複幾次再平均",
    body: "模型有隨機性。同一題做 3 次或 5 次，比較不會因為一次好運就衝高。",
  },
];

export default function StartPage() {
  return (
    <div className="space-y-10">
      <SectionHeading
        eyebrow="上課前"
        title="先搞懂：評測、測試集、分數、方法"
        description="把 Artificial Analysis 想成一間很嚴格的聯考中心。下面四件事搞懂，後面 28 項評測就只是「不同科目的考卷說明」。"
      />

      <div className="grid gap-4 md:grid-cols-3">
        {ideas.map((idea) => (
          <Card key={idea.title}>
            <CardHeader>
              <CardTitle className="text-lg">{idea.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-7 text-muted-foreground">
              {idea.body}
            </CardContent>
          </Card>
        ))}
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">常見分數分別在說什麼</h2>
        <div className="overflow-x-auto rounded-xl border bg-card">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b bg-secondary/60">
              <tr>
                <th className="px-4 py-3 font-semibold">分數種類</th>
                <th className="px-4 py-3 font-semibold">代表什麼</th>
                <th className="px-4 py-3 font-semibold">高中生最容易踩的坑</th>
              </tr>
            </thead>
            <tbody>
              {scoreTypes.map((row) => (
                <tr key={row.name} className="border-b last:border-0">
                  <td className="px-4 py-3 align-top font-medium">{row.name}</td>
                  <td className="px-4 py-3 align-top leading-7">{row.meaning}</td>
                  <td className="px-4 py-3 align-top leading-7 text-muted-foreground">
                    {row.trap}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">他們通常怎麼測</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {steps.map((step) => (
            <Card key={step.title}>
              <CardHeader>
                <CardTitle className="text-lg">{step.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-7 text-muted-foreground">
                {step.body}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Callout title="課堂比喻：為什麼要「零樣本」？">
        老師如果先做兩題給你看，你比較像在模仿格式，不一定真的懂。Artificial Analysis
        大多不給示範題，只給清楚指令，比較接近「第一次看到新題能不能自己讀題」。
      </Callout>

      <p className="text-sm leading-7 text-muted-foreground">
        下一站看{" "}
        <Link className="text-primary underline-offset-2 hover:underline" href="/index">
          智力指數怎麼合成
        </Link>
        ，或直接進入{" "}
        <Link className="text-primary underline-offset-2 hover:underline" href="/catalog">
          全部評測
        </Link>
        。
      </p>
    </div>
  );
}
