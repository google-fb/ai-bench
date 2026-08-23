import type { Metadata } from "next";
import { Noto_Sans_TC } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const notoSans = Noto_Sans_TC({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "AI 評測學生 Wiki",
    template: "%s｜AI 評測學生 Wiki",
  },
  description:
    "用繁體中文、高中生能懂的方式，介紹 Artificial Analysis 上的 AI benchmark：測什麼、分數意義、測試集、怎麼測、方法是什麼。",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-Hant" className={`${notoSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <TooltipProvider>
          <SiteHeader />
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 md:py-12">
            {children}
          </main>
          <SiteFooter />
        </TooltipProvider>
      </body>
    </html>
  );
}
