import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Callout({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <aside className={cn("rounded-xl border border-accent bg-accent/40 p-4", className)}>
      <p className="mb-1 text-sm font-semibold text-accent-foreground">{title}</p>
      <div className="text-sm leading-7 text-foreground/90">{children}</div>
    </aside>
  );
}
