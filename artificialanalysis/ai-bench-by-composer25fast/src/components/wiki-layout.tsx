import Link from "next/link";
import { categories } from "@/data/categories";
import { benchmarks } from "@/data/benchmarks";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "首頁" },
  { href: "/learn", label: "基礎概念" },
  { href: "/benchmarks", label: "所有測試" },
];

interface WikiLayoutProps {
  children: React.ReactNode;
  activeSlug?: string;
}

export function WikiLayout({ children, activeSlug }: WikiLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">📚</span>
            <div>
              <p className="text-sm font-bold text-slate-900">AI Benchmark Wiki</p>
              <p className="text-xs text-slate-500">繁體中文入門指南</p>
            </div>
          </Link>
          <nav className="hidden items-center gap-1 sm:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                {item.label}
              </Link>
            ))}
            <a
              href="https://artificialanalysis.ai/evaluations"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50"
            >
              原始網站 ↗
            </a>
          </nav>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8 sm:px-6">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-20 space-y-6">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                導覽
              </p>
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                分類
              </p>
              <nav className="space-y-1">
                {categories.map((cat) => {
                  const count = benchmarks.filter((b) => b.category === cat.id).length;
                  return (
                    <Link
                      key={cat.id}
                      href={`/benchmarks?category=${cat.id}`}
                      className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-white hover:shadow-sm"
                    >
                      <span>
                        {cat.icon} {cat.label}
                      </span>
                      <span className="text-xs text-slate-400">{count}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {activeSlug && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  所有測試
                </p>
                <nav className="max-h-64 space-y-0.5 overflow-y-auto">
                  {benchmarks.map((b) => (
                    <Link
                      key={b.slug}
                      href={`/benchmarks/${b.slug}`}
                      className={cn(
                        "block rounded-lg px-3 py-1.5 text-xs leading-snug transition-colors",
                        activeSlug === b.slug
                          ? "bg-blue-100 font-medium text-blue-800"
                          : "text-slate-500 hover:bg-white hover:text-slate-800"
                      )}
                    >
                      {b.nameZh}
                    </Link>
                  ))}
                </nav>
              </div>
            )}
          </div>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>

      <footer className="border-t bg-white/50 py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-slate-500 sm:px-6">
          <p>
            資料來源：{" "}
            <a
              href="https://artificialanalysis.ai/evaluations"
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Artificial Analysis Evaluations
            </a>
          </p>
          <p className="mt-1">本 Wiki 為教育用途，以高中生能理解的語言介紹 AI 基準測試。</p>
        </div>
      </footer>
    </div>
  );
}
