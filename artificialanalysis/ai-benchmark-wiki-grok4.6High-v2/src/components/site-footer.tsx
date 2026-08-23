import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t bg-card">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>
          內容依{" "}
          <a
            className="underline underline-offset-2 hover:text-foreground"
            href="https://artificialanalysis.ai/evaluations"
            target="_blank"
            rel="noreferrer"
          >
            Artificial Analysis Evaluations
          </a>{" "}
          公開方法翻譯改寫，給高中生讀懂評測，不是官方中文版。
        </p>
        <div className="flex gap-4">
          <Link className="hover:text-foreground" href="/sources">
            資料來源
          </Link>
          <Link className="hover:text-foreground" href="/glossary">
            詞彙表
          </Link>
        </div>
      </div>
    </footer>
  );
}
