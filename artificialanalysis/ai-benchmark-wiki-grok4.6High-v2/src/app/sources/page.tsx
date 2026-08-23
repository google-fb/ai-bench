import type { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "資料來源",
};

const sources = [
  {
    title: "評測總覽",
    href: "https://artificialanalysis.ai/evaluations",
    note: "本 Wiki 條目清單以這個頁面為準。",
  },
  {
    title: "智力評測方法（最完整）",
    href: "https://artificialanalysis.ai/methodology/intelligence-benchmarking/",
    note: "題數、重複次數、計分、提示詞與版本沿革都在這裡。",
  },
  {
    title: "開放指數方法",
    href: "https://artificialanalysis.ai/methodology/openness-index",
    note: "0–18 分如何換成 0–100。",
  },
  {
    title: "智力指數 v4.1 說明",
    href: "https://artificialanalysis.ai/articles/artificial-analysis-intelligence-index-v4-1",
    note: "為什麼加重代理人、為什麼拿掉 IFBench。",
  },
];

export default function SourcesPage() {
  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="出處"
        title="這本 Wiki 的資料從哪來"
        description="我們把官方英文方法翻成給高中生的說明，並加上課堂比喻。數字、題數與計分以 Artificial Analysis 2026 年公開方法為準；這不是他們的官方中文翻譯。"
      />
      <div className="grid gap-4">
        {sources.map((item) => (
          <Card key={item.href}>
            <CardHeader>
              <CardTitle className="text-lg">
                <a
                  className="hover:underline"
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {item.title}
                </a>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-7 text-muted-foreground">
              {item.note}
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="text-sm leading-7 text-muted-foreground">
        各評測頁底部還有論文、資料集與程式庫連結。若官方改版，請以原站為準。
      </p>
    </div>
  );
}
