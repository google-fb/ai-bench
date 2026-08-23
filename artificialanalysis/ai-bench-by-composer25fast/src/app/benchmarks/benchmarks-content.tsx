"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { WikiLayout } from "@/components/wiki-layout";
import { BenchmarkCard } from "@/components/benchmark-card";
import { Input } from "@/components/ui/input";
import { benchmarks } from "@/data/benchmarks";
import { categories } from "@/data/categories";
import { cn } from "@/lib/utils";

export function BenchmarksPageContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") ?? "all";
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  const filtered = useMemo(() => {
    return benchmarks.filter((b) => {
      const matchCategory = activeCategory === "all" || b.category === activeCategory;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        b.nameZh.toLowerCase().includes(q) ||
        b.nameEn.toLowerCase().includes(q) ||
        b.summary.toLowerCase().includes(q);
      return matchCategory && matchSearch;
    });
  }, [search, activeCategory]);

  return (
    <WikiLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">所有 Benchmark 測試</h1>
        <p className="mt-2 text-slate-600">
          共 {benchmarks.length} 項測試，資料來自{" "}
          <a
            href="https://artificialanalysis.ai/evaluations"
            className="text-blue-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Artificial Analysis
          </a>
        </p>
      </div>

      <div className="mb-6 space-y-4">
        <Input
          placeholder="搜尋測試名稱或關鍵字..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory("all")}
            className={cn(
              "rounded-full px-3 py-1 text-sm font-medium transition-colors",
              activeCategory === "all"
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            全部 ({benchmarks.length})
          </button>
          {categories.map((cat) => {
            const count = benchmarks.filter((b) => b.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "rounded-full px-3 py-1 text-sm font-medium transition-colors",
                  activeCategory === cat.id
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
              >
                {cat.icon} {cat.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center">
          <p className="text-slate-500">找不到符合條件的測試，試試其他關鍵字或分類。</p>
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm text-slate-500">找到 {filtered.length} 項測試</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((b) => (
              <BenchmarkCard key={b.slug} benchmark={b} />
            ))}
          </div>
        </>
      )}
    </WikiLayout>
  );
}
