import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl space-y-4 py-16 text-center">
      <h1 className="font-serif text-3xl">這一頁不存在</h1>
      <p className="text-muted-foreground">
        百科裡沒有這個網址。回首頁，或用右上角搜尋評測名稱、英文縮寫。
      </p>
      <Button render={<Link href="/" />}>回百科首頁</Button>
    </div>
  );
}
