import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function BenchmarkNotFound() {
  return (
    <div className="mx-auto max-w-lg space-y-4 py-10 text-center">
      <h1 className="text-3xl font-semibold">沒有這個評測條目</h1>
      <p className="leading-8 text-muted-foreground">
        目錄裡目前沒有這個代號。請從評測列表選一個存在的項目。
      </p>
      <Button render={<Link href="/catalog" />}>回到評測目錄</Button>
    </div>
  );
}
