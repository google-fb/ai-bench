import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function WikiNotFound() {
  return (
    <div className="mx-auto max-w-xl space-y-4 py-16 text-center">
      <h1 className="font-serif text-3xl">找不到這個條目</h1>
      <p className="text-muted-foreground">
        也許網址打錯了，或這個評測還沒有教室版說明。你可以回首頁從目錄再找一次。
      </p>
      <Button render={<Link href="/" />}>回百科首頁</Button>
    </div>
  );
}
