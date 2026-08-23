import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WikiArticle } from "@/components/wiki-article";
import { BENCHMARKS, getBenchmark } from "@/data/benchmarks";

export function generateStaticParams() {
  return BENCHMARKS.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = getBenchmark(slug);
  if (!item) return { title: "找不到條目" };
  return {
    title: item.name,
    description: item.oneLiner,
  };
}

export default async function WikiPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getBenchmark(slug);
  if (!item) notFound();
  return (
    <div className="mx-auto max-w-3xl">
      <WikiArticle item={item} />
    </div>
  );
}
