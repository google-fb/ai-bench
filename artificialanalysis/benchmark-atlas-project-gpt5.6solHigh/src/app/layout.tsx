import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Benchmark Atlas｜高中生 AI 評測指南",
  description:
    "用繁體中文看懂 AI benchmark、測試集、評測方法與分數意義，收錄 Artificial Analysis 主要評測項目。",
  keywords: ["AI benchmark", "人工智慧評測", "測試集", "高中生", "繁體中文"],
  openGraph: {
    title: "Benchmark Atlas｜看懂 AI 評測分數",
    description: "面向高中生的繁體中文 AI benchmark 互動圖鑑。",
    type: "website",
    locale: "zh_TW",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="zh-Hant"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
