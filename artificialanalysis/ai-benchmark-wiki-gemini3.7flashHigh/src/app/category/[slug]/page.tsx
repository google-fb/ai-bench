import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BenchmarkCard } from "@/components/benchmark-card";
import { getBenchmarksByCategory } from "@/data/benchmarks";
import { CATEGORIES, getCategory } from "@/data/site";
import type { CategoryId } from "@/data/types";

export function generateStaticParams() {
  return CATEGORIES.filter((item) => item.id !== "overview").map((item) => ({
    slug: item.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug as CategoryId);
  if (!category) return { title: "找不到分類" };
  return { title: category.title, description: category.description };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategory(slug as CategoryId);
  if (!category || category.id === "overview") notFound();
  const items = getBenchmarksByCategory(category.id);

  return (
    <div className="space-y-8">
      <header className="max-w-3xl space-y-3">
        <p className="text-sm text-muted-foreground">分類</p>
        <h1 className="font-serif text-4xl">{category.title}</h1>
        <p className="text-lg leading-relaxed text-muted-foreground">{category.description}</p>
      </header>
      {items.length === 0 ? (
        <p className="text-muted-foreground">這個分類目前沒有條目。</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <BenchmarkCard key={item.slug} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
