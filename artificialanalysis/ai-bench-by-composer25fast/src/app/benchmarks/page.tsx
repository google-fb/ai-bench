import { Suspense } from "react";
import { BenchmarksPageContent } from "./benchmarks-content";

export default function BenchmarksPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center text-slate-500">
          載入中...
        </div>
      }
    >
      <BenchmarksPageContent />
    </Suspense>
  );
}
