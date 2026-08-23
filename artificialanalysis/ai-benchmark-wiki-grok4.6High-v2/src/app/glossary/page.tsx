import type { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { glossary } from "@/data/glossary";

export const metadata: Metadata = {
  title: "詞彙表",
};

export default function GlossaryPage() {
  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="對照"
        title="高中生詞彙表"
        description="新聞與原站常直接丟英文縮寫。這裡用最短的中文把意思釘下來。"
      />
      <div className="grid gap-4 md:grid-cols-2">
        {glossary.map((item) => (
          <Card key={item.term} id={item.term}>
            <CardHeader>
              <CardTitle className="text-lg">
                {item.term}
                {item.english ? (
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    {item.english}
                  </span>
                ) : null}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm leading-7">
              <p>{item.definition}</p>
              {item.example ? (
                <p className="text-muted-foreground">例如：{item.example}</p>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
