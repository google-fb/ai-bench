import type { Metadata } from "next";
import { Suspense } from "react";
import { CatalogExplorer } from "@/components/catalog-explorer";
import { SectionHeading } from "@/components/section-heading";
import { benchmarks } from "@/data/benchmarks";

export const metadata: Metadata = {
  title: "全部評測",
};

export default function CatalogPage() {
  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="目錄"
        title="Artificial Analysis 評測條目"
        description={`目前收錄 ${benchmarks.length} 項：智力指數組成、獨立榜，以及已退役但仍常被新聞提到的舊考卷。每頁都固定講：測什麼、分數意義、測試集、怎麼測、方法。`}
      />
      <Suspense
        fallback={
          <div className="rounded-xl border bg-card p-8 text-sm text-muted-foreground">
            正在載入評測目錄…
          </div>
        }
      >
        <CatalogExplorer />
      </Suspense>
    </div>
  );
}
