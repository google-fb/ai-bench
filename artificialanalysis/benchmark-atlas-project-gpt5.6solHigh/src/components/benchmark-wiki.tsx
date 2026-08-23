"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  CircleAlert,
  ExternalLink,
  FlaskConical,
  Gauge,
  Menu,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  benchmarks,
  categories,
  scoreTypes,
} from "@/data/benchmarks";

const navItems = [
  ["起點", "start"],
  ["怎麼測", "process"],
  ["分數課", "scores"],
  ["評測圖鑑", "library"],
  ["閱讀守則", "checklist"],
] as const;

const glossary = [
  {
    term: "Benchmark｜基準測試",
    text: "一套固定的題目、環境、作答規則與計分方式，用來公平比較不同 AI。就像大家考同一份考卷，但有些評測不是考卷，而是實作任務。",
  },
  {
    term: "Dataset｜資料集／測試集",
    text: "評測使用的題目、文件、圖片、程式測試或工作情境集合。測試集最好不要出現在模型的訓練資料裡，否則像考前偷看答案。",
  },
  {
    term: "Agent｜AI 代理",
    text: "不只輸出一段文字，還能規劃步驟、使用搜尋、終端機或應用程式來完成任務的 AI 系統。",
  },
  {
    term: "LLM-as-a-judge｜用 AI 當評審",
    text: "讓另一個語言模型依規準評答案。它能評長文與作品，但也可能偏好特定寫法，所以需要盲測、多人或其他檢查來降低偏差。",
  },
  {
    term: "Data contamination｜資料污染",
    text: "測試題或答案曾混入訓練資料，讓模型可能靠記憶而非能力答對。使用新題、私有題或持續更新題庫能降低風險。",
  },
  {
    term: "Confidence interval｜信賴區間",
    text: "表示分數估計的不確定範圍。如果兩個模型的區間大量重疊，小小的排名差距可能只是抽樣波動。",
  },
];

const process = [
  {
    n: "01",
    title: "設計要測的能力",
    text: "先說清楚要測知識、寫程式、看圖片，還是使用工具完成工作。",
  },
  {
    n: "02",
    title: "準備未見過的題目",
    text: "保留測試集，盡量避免模型在訓練時已看過題目與答案。",
  },
  {
    n: "03",
    title: "控制作答條件",
    text: "統一提示詞、工具、時間與取樣設定，否則比較不公平。",
  },
  {
    n: "04",
    title: "評分並報告誤差",
    text: "用答案比對、測試程式、人工規準或盲測評審，並交代樣本與限制。",
  },
];

const scoreLab = {
  accuracy: {
    tab: "正確率",
    title: "10 題答對 7 題",
    value: "70%",
    visual: [1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
    text: "計算很直觀：7 ÷ 10 = 70%。但若是四選一，亂猜也可能約有 25%；還要看題目難不難。",
  },
  elo: {
    tab: "Elo",
    title: "匿名對決 10 次，贏 7 次",
    value: "+相對分",
    visual: [1, 1, 0, 1, 1, 1, 0, 1, 0, 1],
    text: "勝過高分對手通常加得更多。Elo 反映一群參賽者中的相對位置；換一批對手，分數尺度也可能改變。",
  },
  omniscience: {
    tab: "幻覺指數",
    title: "答對 6、答錯 2、拒答 2",
    value: "+40",
    visual: [1, 1, 1, 1, 1, 1, -1, -1, 2, 2],
    text: "以（答對－答錯）÷ 總題數 × 100 示意：亂猜會扣分，誠實說不知道不扣分。這和單純正確率回答不同問題。",
  },
} as const;

type ScoreLabKey = keyof typeof scoreLab;

function LogoMark() {
  return (
    <div className="grid size-9 place-items-center rounded-full bg-[var(--ink)] text-sm font-bold text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,.2)]">
      AI
    </div>
  );
}

export function BenchmarkWiki() {
  const [category, setCategory] = useState<(typeof categories)[number]>("全部");
  const [query, setQuery] = useState("");
  const [lab, setLab] = useState<ScoreLabKey>("accuracy");
  const [menuOpen, setMenuOpen] = useState(false);
  const [openBenchmark, setOpenBenchmark] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return benchmarks.filter((benchmark) => {
      const categoryMatch =
        category === "全部" || benchmark.category === category;
      const queryMatch =
        !normalized ||
        [
          benchmark.name,
          benchmark.zhName,
          benchmark.summary,
          benchmark.dataset,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalized);
      return categoryMatch && queryMatch;
    });
  }, [category, query]);

  const currentLab = scoreLab[lab];

  return (
    <main className="min-h-screen overflow-x-hidden">
      <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[color:var(--paper)/.92] backdrop-blur-xl">
        <div className="mx-auto flex h-17 max-w-[1440px] items-center justify-between px-5 lg:px-10">
          <a href="#start" className="flex items-center gap-3">
            <LogoMark />
            <div className="leading-tight">
              <p className="font-display text-[15px] font-extrabold tracking-[-.02em]">
                Benchmark Atlas
              </p>
              <p className="text-[11px] tracking-[.12em] text-[var(--muted-ink)]">
                高中生 AI 評測指南
              </p>
            </div>
          </a>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="主要導覽">
            {navItems.map(([label, id]) => (
              <a
                key={id}
                href={`#${id}`}
                className="text-sm font-medium text-[var(--muted-ink)] transition hover:text-[var(--ink)]"
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <span className="text-xs text-[var(--muted-ink)]">
              資料核對：2026.08
            </span>
            <Button
              nativeButton={false}
              render={
                <a
                  href="https://artificialanalysis.ai/evaluations"
                  target="_blank"
                  rel="noreferrer"
                />
              }
              className="h-9 rounded-full bg-[var(--ink)] px-4 text-white hover:bg-[var(--ink)]/85"
            >
              查看原始網站 <ExternalLink />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label={menuOpen ? "關閉選單" : "開啟選單"}
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? <X /> : <Menu />}
          </Button>
        </div>
        {menuOpen && (
          <nav className="border-t border-[var(--line)] bg-[var(--paper)] px-5 py-4 lg:hidden">
            {navItems.map(([label, id]) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between border-b border-[var(--line)] py-3 text-sm font-semibold last:border-0"
              >
                {label} <ChevronRight className="size-4" />
              </a>
            ))}
          </nav>
        )}
      </header>

      <section id="start" className="relative scroll-mt-24">
        <div className="hero-grid absolute inset-0 -z-10 opacity-50" />
        <div className="mx-auto grid max-w-[1440px] gap-12 px-5 pb-20 pt-16 lg:grid-cols-[1.1fr_.9fr] lg:px-10 lg:pb-28 lg:pt-24">
          <div className="max-w-3xl">
            <div className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-[var(--coral)]">
              <span className="h-px w-8 bg-[var(--coral)]" />
              AI literacy · 01
            </div>
            <h1 className="font-display text-[clamp(3.35rem,8vw,7.8rem)] font-black leading-[.84] tracking-[-.075em] text-[var(--ink)]">
              看懂 AI
              <br />
              <span className="text-outline">評測分數</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-[var(--muted-ink)] md:text-xl md:leading-9">
              排行榜不是一張「誰最聰明」的成績單。這本互動圖鑑帶你拆開
              benchmark、測試集與分數，學會問出比排名更重要的問題。
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button
                nativeButton={false}
                render={<a href="#process" />}
                className="h-12 rounded-full bg-[var(--coral)] px-6 text-base text-white shadow-[0_8px_24px_rgba(231,83,51,.22)] hover:bg-[var(--coral)]/90"
              >
                從零開始 <ArrowRight />
              </Button>
              <Button
                nativeButton={false}
                render={<a href="#library" />}
                variant="outline"
                className="h-12 rounded-full border-[var(--ink)] bg-transparent px-6 text-base"
              >
                直接查評測
              </Button>
            </div>
          </div>

          <div className="relative flex items-end justify-center lg:justify-end">
            <div className="relative w-full max-w-[520px]">
              <div className="absolute -left-5 -top-8 rotate-[-7deg] rounded-xl border border-[var(--ink)] bg-[var(--acid)] px-5 py-3 text-sm font-bold shadow-[4px_5px_0_var(--ink)] md:-left-10">
                高分 ≠ 什麼都會
              </div>
              <div className="report-card rotate-[2deg] rounded-[28px] border-2 border-[var(--ink)] bg-white p-6 shadow-[12px_14px_0_var(--ink)] md:p-8">
                <div className="flex items-start justify-between border-b-2 border-[var(--ink)] pb-5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[.18em] text-[var(--coral)]">
                      Model report
                    </p>
                    <h2 className="mt-1 font-display text-3xl font-black">
                      一張分數卡
                    </h2>
                  </div>
                  <div className="grid size-16 place-items-center rounded-full border-2 border-[var(--ink)] bg-[var(--blue)] font-display text-2xl font-black text-white">
                    63
                  </div>
                </div>
                <div className="space-y-5 py-6">
                  {[
                    ["知識問答", 84, "bg-[var(--coral)]"],
                    ["寫程式", 68, "bg-[var(--blue)]"],
                    ["工具操作", 42, "bg-[var(--green)]"],
                    ["長文推理", 57, "bg-[var(--yellow)]"],
                  ].map(([label, value, color]) => (
                    <div key={label as string}>
                      <div className="mb-1.5 flex justify-between text-sm font-semibold">
                        <span>{label}</span>
                        <span>{value}</span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-[var(--soft)]">
                        <div
                          className={`h-full rounded-full ${color}`}
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl bg-[var(--soft)] p-4 text-sm leading-6">
                  <span className="font-bold">先別急著下結論：</span>
                  總分相同的模型，能力形狀可能完全不同。
                </div>
              </div>
              <div className="absolute -bottom-8 right-2 rotate-[5deg] rounded-full border border-[var(--ink)] bg-white px-5 py-3 text-xs font-bold shadow-[3px_4px_0_var(--ink)] md:right-8">
                先看「考什麼」↗
              </div>
            </div>
          </div>
        </div>

        <div className="border-y border-[var(--line)] bg-white/60">
          <div className="mx-auto grid max-w-[1440px] grid-cols-2 divide-x divide-[var(--line)] px-5 lg:grid-cols-4 lg:px-10">
            {[
              ["28", "評測項目"],
              ["9", "綜合指數成員"],
              ["6", "能力類別"],
              ["4", "常見分數語言"],
            ].map(([number, label]) => (
              <div
                key={label}
                className="flex items-baseline gap-2 border-b border-[var(--line)] px-4 py-5 last:border-b-0 even:border-r-0 lg:border-b-0"
              >
                <span className="font-display text-3xl font-black">{number}</span>
                <span className="text-sm text-[var(--muted-ink)]">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-24 lg:px-10">
        <SectionLabel n="02" text="先建立三個觀念" />
        <div className="mt-8 grid gap-px overflow-hidden rounded-[24px] border border-[var(--ink)] bg-[var(--ink)] lg:grid-cols-3">
          {[
            {
              icon: <Gauge />,
              en: "BENCHMARK",
              title: "基準測試",
              text: "完整的比賽規則：測什麼、用哪些題、能用什麼工具，以及怎麼給分。",
              color: "bg-[var(--coral)]",
            },
            {
              icon: <BookOpen />,
              en: "TEST SET",
              title: "測試集",
              text: "真正拿來考 AI 的題目或任務。最好和訓練資料分開，才能測到泛化能力。",
              color: "bg-[var(--blue)]",
            },
            {
              icon: <FlaskConical />,
              en: "EVALUATION",
              title: "評測過程",
              text: "讓模型在固定條件作答，再用答案、測試程式或評審把表現變成分數。",
              color: "bg-[var(--green)]",
            },
          ].map((item) => (
            <article key={item.en} className="bg-[var(--paper)] p-7 md:p-9">
              <div
                className={`mb-10 grid size-12 place-items-center rounded-full border border-[var(--ink)] text-white ${item.color}`}
              >
                {item.icon}
              </div>
              <p className="text-[11px] font-bold tracking-[.18em] text-[var(--muted-ink)]">
                {item.en}
              </p>
              <h2 className="mt-2 font-display text-3xl font-black">
                {item.title}
              </h2>
              <p className="mt-4 leading-7 text-[var(--muted-ink)]">{item.text}</p>
            </article>
          ))}
        </div>
        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-[var(--line)] bg-white px-5 py-4 text-sm leading-6 text-[var(--muted-ink)]">
          <CircleAlert className="mt-0.5 size-5 shrink-0 text-[var(--coral)]" />
          <p>
            <strong className="text-[var(--ink)]">常見誤會：</strong>
            「評測」是整個測量活動，「benchmark」是讓比較可重複的一套標準；日常討論中兩個詞常被混用。
          </p>
        </div>
      </section>

      <section
        id="process"
        className="scroll-mt-20 border-y border-[var(--ink)] bg-[var(--ink)] text-white"
      >
        <div className="mx-auto max-w-[1440px] px-5 py-24 lg:px-10">
          <SectionLabel n="03" text="一場公平測試怎麼誕生" inverted />
          <div className="mt-5 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <h2 className="max-w-3xl font-display text-4xl font-black leading-tight tracking-[-.04em] md:text-6xl">
              從能力問題，到一個可以比較的數字。
            </h2>
            <p className="max-w-sm text-sm leading-6 text-white/60">
              每一步都可能影響結果。只看最後一欄分數，就像只看實驗結論、不看實驗設計。
            </p>
          </div>
          <div className="mt-14 grid gap-0 border-l border-white/20 md:grid-cols-2 lg:grid-cols-4 lg:border-l-0 lg:border-t">
            {process.map((step) => (
              <article
                key={step.n}
                className="relative border-b border-r border-white/20 px-6 py-8 last:border-b-0 lg:border-b-0 lg:py-10"
              >
                <span className="font-mono text-xs text-[var(--acid)]">
                  STEP {step.n}
                </span>
                <h3 className="mt-8 font-display text-2xl font-bold">
                  {step.title}
                </h3>
                <p className="mt-4 text-sm leading-6 text-white/60">{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="scores" className="scroll-mt-20">
        <div className="mx-auto max-w-[1440px] px-5 py-24 lg:px-10">
          <SectionLabel n="04" text="分數不是同一種語言" />
          <div className="mt-5 grid gap-8 lg:grid-cols-[.75fr_1.25fr] lg:items-end">
            <h2 className="font-display text-4xl font-black leading-tight tracking-[-.04em] md:text-6xl">
              先看單位，
              <br />
              再比高低。
            </h2>
            <p className="max-w-2xl text-lg leading-8 text-[var(--muted-ink)]">
              90% 正確率、1,500 Elo 和 63 分綜合指數是三種不同東西，不能直接排在同一條尺上。
              先問「這個數字怎麼算」，排名才有意義。
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {scoreTypes.map((score) => (
              <article
                key={score.name}
                className="score-card flex min-h-[330px] flex-col rounded-[24px] border border-[var(--ink)] bg-white p-6 transition hover:-translate-y-1 hover:shadow-[6px_7px_0_var(--ink)]"
              >
                <div
                  className={`score-mark score-mark-${score.color} grid size-14 place-items-center rounded-full border border-[var(--ink)] font-display text-2xl font-black`}
                >
                  {score.mark}
                </div>
                <h3 className="mt-8 font-display text-2xl font-black">
                  {score.name}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[var(--muted-ink)]">
                  {score.meaning}
                </p>
                <p className="mt-auto border-t border-[var(--line)] pt-5 text-sm leading-6">
                  <span className="font-bold text-[var(--coral)]">例：</span>
                  {score.example}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-16 overflow-hidden rounded-[28px] border border-[var(--ink)] bg-[var(--warm)]">
            <div className="grid lg:grid-cols-[.78fr_1.22fr]">
              <div className="border-b border-[var(--ink)] p-7 lg:border-b-0 lg:border-r lg:p-10">
                <div className="flex items-center gap-2 text-sm font-bold text-[var(--coral)]">
                  <Sparkles className="size-4" /> 互動分數實驗室
                </div>
                <h3 className="mt-4 font-display text-3xl font-black">
                  同樣是分數，
                  <br />
                  回答不同問題
                </h3>
                <div className="mt-8 flex flex-wrap gap-2">
                  {(Object.keys(scoreLab) as ScoreLabKey[]).map((key) => (
                    <Button
                      key={key}
                      onClick={() => setLab(key)}
                      variant={lab === key ? "default" : "outline"}
                      className={`rounded-full ${
                        lab === key
                          ? "bg-[var(--ink)] text-white"
                          : "border-[var(--ink)] bg-transparent"
                      }`}
                    >
                      {scoreLab[key].tab}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="bg-white p-7 lg:p-10">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-[var(--muted-ink)]">
                      {currentLab.title}
                    </p>
                    <p className="mt-2 font-display text-5xl font-black tracking-[-.05em]">
                      {currentLab.value}
                    </p>
                  </div>
                  <span className="rounded-full bg-[var(--soft)] px-4 py-2 text-xs font-bold">
                    示意例，不是模型實測
                  </span>
                </div>
                <div className="my-8 grid grid-cols-10 gap-1.5">
                  {currentLab.visual.map((value, index) => (
                    <div
                      key={`${lab}-${index}`}
                      className={`aspect-square rounded-md border border-[var(--ink)] ${
                        value === 1
                          ? "bg-[var(--green)]"
                          : value === -1
                            ? "bg-[var(--coral)]"
                            : value === 2
                              ? "bg-[var(--yellow)]"
                              : "bg-[var(--soft)]"
                      }`}
                    />
                  ))}
                </div>
                <p className="max-w-2xl leading-7 text-[var(--muted-ink)]">
                  {currentLab.text}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="library"
        className="scroll-mt-20 border-y border-[var(--line)] bg-white"
      >
        <div className="mx-auto max-w-[1440px] px-5 py-24 lg:px-10">
          <SectionLabel n="05" text="Artificial Analysis 評測圖鑑" />
          <div className="mt-5 flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
            <div>
              <h2 className="font-display text-4xl font-black tracking-[-.04em] md:text-6xl">
                28 項，一次拆解
              </h2>
              <p className="mt-4 max-w-2xl leading-7 text-[var(--muted-ink)]">
                點開卡片查看「測試集、測法、分數與生活化例子」。標有「Index
                ×9」的是綜合能力指數 v4.1.1 的成員。
              </p>
            </div>
            <div className="relative w-full lg:max-w-sm">
              <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[var(--muted-ink)]" />
              <Input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="搜尋評測、能力或題目…"
                aria-label="搜尋評測"
                className="h-12 rounded-full border-[var(--ink)] bg-[var(--paper)] pl-11 pr-4 text-base"
              />
            </div>
          </div>

          <div className="-mx-5 mt-8 flex gap-2 overflow-x-auto px-5 pb-3 lg:mx-0 lg:flex-wrap lg:px-0">
            {categories.map((item) => (
              <Button
                key={item}
                variant={category === item ? "default" : "outline"}
                onClick={() => setCategory(item)}
                className={`h-9 shrink-0 rounded-full px-4 ${
                  category === item
                    ? "bg-[var(--ink)] text-white"
                    : "border-[var(--line)] bg-white text-[var(--muted-ink)]"
                }`}
              >
                {item}
              </Button>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between border-y border-[var(--line)] py-3 text-xs text-[var(--muted-ink)]">
            <span>
              顯示 <strong className="text-[var(--ink)]">{filtered.length}</strong>{" "}
              項評測
            </span>
            <span>依原站列表整理 · 非即時排行榜</span>
          </div>

          {filtered.length > 0 ? (
            <div className="mt-8 grid items-start gap-4 lg:grid-cols-2">
              {filtered.map((benchmark, index) => (
                <article
                  key={benchmark.id}
                  className="overflow-hidden rounded-[22px] border border-[var(--line)] bg-[var(--paper)] transition hover:border-[var(--ink)]"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenBenchmark((current) =>
                        current === benchmark.id ? null : benchmark.id,
                      )
                    }
                    aria-expanded={openBenchmark === benchmark.id}
                    aria-controls={`benchmark-details-${benchmark.id}`}
                    className="flex w-full items-start justify-between p-5 text-left outline-none transition hover:bg-white/60 focus-visible:ring-3 focus-visible:ring-[var(--blue)]/40 md:p-6"
                  >
                    <div className="flex min-w-0 flex-1 items-start gap-4 pr-4">
                      <div
                        className={`grid size-12 shrink-0 place-items-center rounded-xl border border-[var(--ink)] font-display text-base font-black ${
                          index % 4 === 0
                            ? "bg-[var(--coral)] text-white"
                            : index % 4 === 1
                              ? "bg-[var(--blue)] text-white"
                              : index % 4 === 2
                                ? "bg-[var(--yellow)]"
                                : "bg-[var(--green)] text-white"
                        }`}
                      >
                        {benchmark.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge
                            variant="outline"
                            className="border-[var(--line)] bg-white text-[10px] font-semibold text-[var(--muted-ink)]"
                          >
                            {benchmark.category}
                          </Badge>
                          {benchmark.indexMember && (
                            <Badge className="bg-[var(--acid)] text-[10px] text-[var(--ink)]">
                              Index ×9
                            </Badge>
                          )}
                        </div>
                        <h3 className="mt-2 font-display text-xl font-black leading-tight">
                          {benchmark.zhName}
                        </h3>
                        <p className="mt-1 truncate text-xs font-normal text-[var(--muted-ink)]">
                          {benchmark.name}
                        </p>
                      </div>
                    </div>
                    <ChevronRight
                      className={`mt-3 size-5 shrink-0 text-[var(--muted-ink)] transition-transform ${
                        openBenchmark === benchmark.id ? "rotate-90" : ""
                      }`}
                    />
                  </button>
                  {openBenchmark === benchmark.id && (
                    <div
                      id={`benchmark-details-${benchmark.id}`}
                      className="px-5 pb-6 md:px-6"
                    >
                      <p className="border-t border-[var(--line)] pt-5 text-base leading-7 text-[var(--muted-ink)]">
                        {benchmark.summary}
                      </p>
                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        {[
                          ["測試集是什麼", benchmark.dataset],
                          ["怎麼測", benchmark.method],
                          ["分數怎麼看", benchmark.score],
                          ["想像一下", benchmark.example],
                        ].map(([label, text], detailIndex) => (
                          <div
                            key={label}
                            className={`rounded-2xl border border-[var(--line)] p-4 ${
                              detailIndex === 3 ? "bg-[var(--warm)]" : "bg-white"
                            }`}
                          >
                            <p className="text-xs font-bold text-[var(--coral)]">
                              {label}
                            </p>
                            <p className="mt-2 text-sm leading-6 text-[var(--muted-ink)]">
                              {text}
                            </p>
                          </div>
                        ))}
                      </div>
                      <a
                        href={benchmark.source}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold underline decoration-[var(--coral)] underline-offset-4"
                      >
                        到 Artificial Analysis 核對原文
                        <ExternalLink className="size-3" />
                      </a>
                    </div>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-[24px] border border-dashed border-[var(--line)] py-20 text-center">
              <Search className="mx-auto size-7 text-[var(--muted-ink)]" />
              <h3 className="mt-4 font-display text-xl font-bold">找不到相符評測</h3>
              <p className="mt-2 text-sm text-[var(--muted-ink)]">
                試試「程式」、「數學」或清除篩選條件。
              </p>
              <Button
                variant="outline"
                className="mt-5 rounded-full"
                onClick={() => {
                  setQuery("");
                  setCategory("全部");
                }}
              >
                清除篩選
              </Button>
            </div>
          )}
        </div>
      </section>

      <section id="checklist" className="scroll-mt-20">
        <div className="mx-auto max-w-[1440px] px-5 py-24 lg:px-10">
          <SectionLabel n="06" text="排行榜閱讀守則" />
          <div className="mt-6 grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <h2 className="font-display text-4xl font-black leading-tight tracking-[-.04em] md:text-6xl">
                四個問題，
                <br />
                擋住錯誤結論。
              </h2>
              <div className="mt-8 rounded-[22px] border border-[var(--ink)] bg-[var(--acid)] p-6 shadow-[6px_7px_0_var(--ink)]">
                <ShieldCheck className="size-7" />
                <p className="mt-4 font-display text-xl font-black">
                  最重要的判斷
                </p>
                <p className="mt-2 text-sm leading-6">
                  Benchmark 證明的是「在這套條件下的表現」，不是對所有真實情境的永久保證。
                </p>
              </div>
            </div>
            <div className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
              {[
                [
                  "01",
                  "它到底考什麼？",
                  "先看能力範圍、題型與是否能用工具。數學高分不能證明會做簡報，文字問答也不能代表看得懂圖片。",
                ],
                [
                  "02",
                  "分數單位相同嗎？",
                  "百分比、Elo、綜合指數不可直接相比；遇到「越低越好」的幻覺率、成本與延遲更要留意。",
                ],
                [
                  "03",
                  "差距真的穩定嗎？",
                  "看題數、重複測試與信賴區間。AIME 只有 30 題，多答對一題就差約 3.3 個百分點。",
                ],
                [
                  "04",
                  "和我的使用情境相符嗎？",
                  "選模型要看你的任務、語言、成本、速度、安全與可用工具，不是只拿排行榜第一名。",
                ],
              ].map(([n, title, text]) => (
                <article
                  key={n}
                  className="grid gap-3 py-7 sm:grid-cols-[52px_1fr] sm:gap-5"
                >
                  <span className="font-mono text-sm font-bold text-[var(--coral)]">
                    {n}
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-black">{title}</h3>
                    <p className="mt-2 leading-7 text-[var(--muted-ink)]">{text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--line)] bg-[var(--warm)]">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-24 lg:grid-cols-[.7fr_1.3fr] lg:px-10">
          <div>
            <SectionLabel n="07" text="術語翻譯機" />
            <h2 className="mt-6 font-display text-4xl font-black tracking-[-.04em]">
              看原文時，
              <br />
              你會遇到這些字
            </h2>
          </div>
          <Accordion className="border-t border-[var(--ink)]">
            {glossary.map((item, index) => (
              <AccordionItem
                key={item.term}
                value={`glossary-${index}`}
                className="border-b border-[var(--ink)]"
              >
                <AccordionTrigger className="py-5 text-base font-bold hover:no-underline">
                  {item.term}
                </AccordionTrigger>
                <AccordionContent className="max-w-2xl pb-5 text-base leading-7 text-[var(--muted-ink)]">
                  {item.text}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="bg-[var(--ink)] text-white">
        <div className="mx-auto max-w-[1440px] px-5 py-20 lg:px-10">
          <div className="grid gap-10 border-b border-white/20 pb-16 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.2em] text-[var(--acid)]">
                Your turn
              </p>
              <h2 className="mt-4 max-w-3xl font-display text-4xl font-black leading-tight tracking-[-.04em] md:text-6xl">
                下次看到「模型拿下第一」，先問：在哪一場考試？
              </h2>
            </div>
            <Button
              nativeButton={false}
              render={<a href="#library" />}
              className="h-12 rounded-full bg-white px-6 text-base text-[var(--ink)] hover:bg-white/85"
            >
              再查一項評測 <ArrowRight />
            </Button>
          </div>
          <div className="grid gap-10 pt-10 text-sm text-white/60 md:grid-cols-3">
            <div>
              <div className="flex items-center gap-3 text-white">
                <LogoMark />
                <span className="font-display font-bold">Benchmark Atlas</span>
              </div>
              <p className="mt-4 max-w-xs leading-6">
                為高中生整理的 AI 評測入門，不隸屬於 Artificial Analysis。
              </p>
            </div>
            <div>
              <p className="font-bold text-white">主要資料來源</p>
              <a
                href="https://artificialanalysis.ai/evaluations"
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 underline underline-offset-4 hover:text-white"
              >
                Artificial Analysis Evaluations <ExternalLink className="size-3" />
              </a>
              <p className="mt-2">資料核對日期：2026 年 8 月 23 日</p>
            </div>
            <div>
              <p className="font-bold text-white">編輯說明</p>
              <p className="mt-4 leading-6">
                本站採教學式意譯並保留英文名稱。評測版本與方法會更新，研究或採購決策請回到原始頁面核對。
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function SectionLabel({
  n,
  text,
  inverted = false,
}: {
  n: string;
  text: string;
  inverted?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 text-xs font-bold uppercase tracking-[.16em] ${
        inverted ? "text-[var(--acid)]" : "text-[var(--coral)]"
      }`}
    >
      <span
        className={`grid size-7 place-items-center rounded-full border ${
          inverted ? "border-white/40" : "border-[var(--coral)]"
        }`}
      >
        {n}
      </span>
      {text}
    </div>
  );
}
