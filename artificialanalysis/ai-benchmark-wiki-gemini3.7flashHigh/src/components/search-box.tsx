"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { searchBenchmarks } from "@/data/benchmarks";
import { GLOSSARY } from "@/data/glossary";
import { GUIDE_LINKS } from "@/lib/nav";

export function SearchBox() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const q = query.trim();

  const results = useMemo(() => {
    if (!q) return { benches: [], terms: [], guides: [] };
    const lower = q.toLowerCase();
    return {
      benches: searchBenchmarks(q).slice(0, 6),
      terms: GLOSSARY.filter(
        (term) =>
          term.term.toLowerCase().includes(lower) ||
          term.english?.toLowerCase().includes(lower) ||
          term.definition.includes(q),
      ).slice(0, 4),
      guides: GUIDE_LINKS.filter(
        (link) => link.title.includes(q) || link.description.includes(q),
      ),
    };
  }, [q]);

  const total =
    results.benches.length + results.terms.length + results.guides.length;
  const open = q.length > 0;

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="搜尋評測、詞彙……"
        aria-label="搜尋百科"
        className="bg-card pl-8"
        onKeyDown={(event) => {
          if (event.key === "Enter" && results.benches[0]) {
            router.push(`/wiki/${results.benches[0].slug}`);
            setQuery("");
          }
        }}
      />
      {open ? (
        <div className="absolute top-full right-0 left-0 z-40 mt-2 overflow-hidden rounded-xl border bg-card shadow-lg">
          {total === 0 ? (
            <p className="px-3 py-4 text-sm text-muted-foreground">
              找不到「{q}」。試試英文縮寫，例如 HLE、GPQA、Elo。
            </p>
          ) : (
            <div className="max-h-80 overflow-auto py-2 text-sm">
              {results.guides.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setQuery("")}
                  className="block px-3 py-2 hover:bg-accent"
                >
                  <p className="font-medium">{link.title}</p>
                  <p className="text-xs text-muted-foreground">{link.description}</p>
                </Link>
              ))}
              {results.benches.map((item) => (
                <Link
                  key={item.slug}
                  href={`/wiki/${item.slug}`}
                  onClick={() => setQuery("")}
                  className="block px-3 py-2 hover:bg-accent"
                >
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.nameEn}</p>
                </Link>
              ))}
              {results.terms.map((term) => (
                <Link
                  key={term.term}
                  href="/glossary"
                  onClick={() => setQuery("")}
                  className="block px-3 py-2 hover:bg-accent"
                >
                  <p className="font-medium">{term.term}</p>
                  <p className="line-clamp-2 text-xs text-muted-foreground">
                    {term.definition}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
