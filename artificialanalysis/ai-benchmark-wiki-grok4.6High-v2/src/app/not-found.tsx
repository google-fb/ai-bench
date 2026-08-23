import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg space-y-4 py-16 text-center">
      <h1 className="text-3xl font-semibold">找不到這一頁</h1>
      <p className="leading-8 text-muted-foreground">
        可能是網址打錯，或這個評測代號不存在。你可以回目錄再找一次。
      </p>
      <div className="flex justify-center gap-3">
        <Button render={<Link href="/catalog" />}>看全部評測</Button>
        <Button variant="outline" render={<Link href="/" />}>
          回首頁
        </Button>
      </div>
    </div>
  );
}
