"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { BenchmarkCard } from "@/components/benchmark-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { benchmarks } from "@/data/benchmarks";
import { categories } from "@/data/categories";
import type { BenchmarkStatus, CategoryId } from "@/data/types";
import { statusLabel } from "@/lib/status";

const statuses: Array<BenchmarkStatus | "all"> = ["all", "index", "standalone", "legacy"];

export function CatalogExplorer() {
  const params = useSearchParams();
  const router = useRouter();
  const initialCat = (params.get("cat") as CategoryId | null) ?? "all";
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryId | "all">(
    categories.some((item) => item.id === initialCat) ? initialCat : "all",
  );
  const [status, setStatus] = useState<BenchmarkStatus | "all">("all");

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return benchmarks.filter((item) => {
      if (category !== "all" && item.category !== category) return false;
      if (status !== "all" && item.status !== status) return false;
      if (!needle) return true;
      const hay = [item.name, item.englishName, item.oneLiner, item.scoreType].join(" ").toLowerCase();
      return hay.includes(needle);
    });
  }, [category, query, status]);

  function chooseCategory(next: CategoryId | "all") {
    setCategory(next);
    const nextParams = new URLSearchParams(params.toString());
    if (next === "all") nextParams.delete("cat");
    else nextParams.set("cat", next);
    const qs = nextParams.toString();
    router.replace(qs ? `/catalog?${qs}` : "/catalog", { scroll: false });
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="pointer-events-none absolute top-2.5 left-3 size-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="搜尋評測名稱、英文名或一句話介紹"
          className="h-10 bg-card pl-9"
          aria-label="搜尋評測"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={category === "all" ? "default" : "outline"}
          onClick={() => chooseCategory("all")}
        >
          全部分類
        </Button>
        {categories.map((item) => (
          <Button
            key={item.id}
            size="sm"
            variant={category === item.id ? "default" : "outline"}
            onClick={() => chooseCategory(item.id)}
          >
            {item.name}
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {statuses.map((item) => (
          <Button
            key={item}
            size="sm"
            variant={status === item ? "secondary" : "ghost"}
            onClick={() => setStatus(item)}
          >
            {item === "all" ? "全部狀態" : statusLabel[item]}
          </Button>
        ))}
      </div>

      {results.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-card p-10 text-center">
          <p className="font-medium">沒有符合的評測</p>
          <p className="mt-2 text-sm text-muted-foreground">
            試試看清掉搜尋字，或改回「全部分類」。你也可以從首頁的類型卡片再進來。
          </p>
          <Button
            className="mt-4"
            variant="outline"
            onClick={() => {
              setQuery("");
              setStatus("all");
              chooseCategory("all");
            }}
          >
            清除條件
          </Button>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">找到 {results.length} 項</p>
          <div className="grid gap-4 md:grid-cols-2">
            {results.map((item) => (
              <BenchmarkCard key={item.slug} item={item} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
