import type { Metadata } from "next";
import { Geist_Mono, Noto_Sans_TC, Noto_Serif_TC } from "next/font/google";
import { SiteFooter, SiteHeader, SiteSidebar } from "@/components/wiki-chrome";
import { SITE } from "@/data/site";
import "./globals.css";

const sans = Noto_Sans_TC({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const serif = Noto_Serif_TC({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const mono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${SITE.name}｜給高中生的 AI Benchmark 導讀`,
    template: `%s｜${SITE.name}`,
  },
  description: SITE.tagline,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="zh-Hant"
      className={`${sans.variable} ${serif.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background font-sans text-foreground">
        <SiteHeader />
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl">
          <SiteSidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <main className="flex-1 px-4 py-8 sm:px-8">{children}</main>
            <SiteFooter />
          </div>
        </div>
      </body>
    </html>
  );
}
