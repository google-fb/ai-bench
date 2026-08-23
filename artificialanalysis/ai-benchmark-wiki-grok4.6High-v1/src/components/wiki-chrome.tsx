"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpenText, Menu, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SITE } from "@/data/site";
import { GUIDE_LINKS, navGroups } from "@/lib/nav";
import { SearchBox } from "@/components/search-box";
import { cn } from "@/lib/utils";

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const groups = navGroups();

  return (
    <nav className="space-y-6 text-sm">
      <div>
        <p className="mb-2 px-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          先讀這三篇
        </p>
        <ul className="space-y-1">
          {GUIDE_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={onNavigate}
                  className={cn(
                    "block rounded-lg px-2 py-1.5 leading-snug",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent",
                  )}
                >
                  {link.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      {groups.map((group) => (
        <div key={group.id}>
          <Link
            href={`/category/${group.id}`}
            onClick={onNavigate}
            className="mb-2 block px-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase hover:text-foreground"
          >
            {group.title}
          </Link>
          <ul className="space-y-1">
            {group.items.map((item) => {
              const href = `/wiki/${item.slug}`;
              const active = pathname === href;
              return (
                <li key={item.slug}>
                  <Link
                    href={href}
                    onClick={onNavigate}
                    className={cn(
                      "block rounded-lg px-2 py-1.5 leading-snug",
                      active
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent",
                    )}
                  >
                    {item.name}
                    {item.status === "legacy" ? (
                      <span className="mt-0.5 block text-[11px] opacity-70">舊版</span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b bg-[color:var(--paper)]/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
        <Sheet>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="開啟目錄" />
            }
          >
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-[320px] p-0">
            <SheetHeader className="border-b p-4">
              <SheetTitle>百科目錄</SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-5rem)] px-3 py-4">
              <NavList />
            </ScrollArea>
          </SheetContent>
        </Sheet>
        <Link href="/" className="flex items-center gap-2 font-serif text-lg font-semibold">
          <GraduationCap className="size-5 text-primary" />
          <span>{SITE.name}</span>
        </Link>
        <span className="hidden text-sm text-muted-foreground md:inline">
          給高中生的 AI 考試導讀
        </span>
        <div className="ml-auto w-full max-w-sm">
          <SearchBox />
        </div>
      </div>
    </header>
  );
}

export function SiteSidebar() {
  return (
    <aside className="hidden w-72 shrink-0 border-r bg-[color:var(--sidebar-paper)] lg:block">
      <ScrollArea className="h-[calc(100vh-4rem)] px-3 py-6">
        <div className="mb-4 flex items-start gap-2 px-2">
          <BookOpenText className="mt-0.5 size-4 text-primary" />
          <p className="text-xs leading-relaxed text-muted-foreground">
            對照 {SITE.sourceName} 的公開評測，用教室語言翻譯給高中生。
          </p>
        </div>
        <Separator className="mb-4" />
        <NavList />
      </ScrollArea>
    </aside>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t bg-[color:var(--sidebar-paper)] px-4 py-6 text-xs leading-relaxed text-muted-foreground">
      <div className="mx-auto max-w-4xl">
        本站是教學用百科，分數與方法整理自{" "}
        <a className="underline underline-offset-2" href={SITE.sourceUrl} target="_blank" rel="noreferrer">
          {SITE.sourceName}
        </a>{" "}
        與{" "}
        <a
          className="underline underline-offset-2"
          href={SITE.methodologyUrl}
          target="_blank"
          rel="noreferrer"
        >
          Intelligence Benchmarking Methodology
        </a>
        。不是官方中文版，模型分數會持續更新，請以原站為準。
      </div>
    </footer>
  );
}
