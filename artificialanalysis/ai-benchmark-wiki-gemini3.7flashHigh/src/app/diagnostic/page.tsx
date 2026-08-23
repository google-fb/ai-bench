"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DiagnosticPage() {
  const [taskType, setTaskType] = useState<string>("code");
  const [priority, setPriority] = useState<string>("reasoning");

  const [eloDiff, setEloDiff] = useState(100);
  const [passKRate, setPassKRate] = useState(40);
  const [kAttempts, setKAttempts] = useState(5);

  const winProbability = Math.round((1 / (1 + Math.pow(10, -eloDiff / 400))) * 100);
  const passKProb = Math.round((1 - Math.pow(1 - passKRate / 100, kAttempts)) * 100);

  const diagnosticRecs: Record<string, { benchmarkSlug: string; benchmarkName: string; model: string; reason: string }> = {
    "code-reasoning": {
      benchmarkSlug: "terminal-bench-v21",
      benchmarkName: "Terminal-Bench v2.1 & LiveCodeBench",
      model: "Claude 3.7 Sonnet (Thinking)",
      reason: "需要多步驟排錯、修復軟體 Bug 並通過單元測試，終端機與競賽級即時評測是最高標準。"
    },
    "code-speed": {
      benchmarkSlug: "livecodebench",
      benchmarkName: "LiveCodeBench",
      model: "Claude 3.5 Sonnet / GPT-4o",
      reason: "演算法日常快速寫作，兼顧生成速度與一次性通過率。"
    },
    "math-reasoning": {
      benchmarkSlug: "aime-2025",
      benchmarkName: "AIME 2025 & MATH-500",
      model: "o3-mini (High) / DeepSeek-R1",
      reason: "奧林匹亞級深度符號演繹，在 000-999 填空題中能自主糾錯推導。"
    },
    "math-speed": {
      benchmarkSlug: "math-500",
      benchmarkName: "MATH-500",
      model: "o3-mini / GPT-4o",
      reason: "常規高中數學難度，解答快速且邏輯健全。"
    },
    "long-reasoning": {
      benchmarkSlug: "long-context-reasoning",
      benchmarkName: "AA Long Context Reasoning",
      model: "Gemini 2.0 Pro / Claude 3.7",
      reason: "跨越數萬字長篇報告交叉比對線索，需要極高長文本注意力與抗遺忘能力。"
    },
    "long-speed": {
      benchmarkSlug: "long-context-reasoning",
      benchmarkName: "AA Long Context Reasoning",
      model: "Gemini 2.0 Flash (2M 窗口)",
      reason: "超大百萬字窗口快速讀取，速度極快性價比高。"
    },
    "chat-reasoning": {
      benchmarkSlug: "intelligence-index",
      benchmarkName: "Artificial Analysis 綜合智力指數",
      model: "Claude 3.7 Sonnet / o3-mini",
      reason: "文筆細膩、格式排版嚴整，且具備頂尖多科邏輯底蘊。"
    },
    "chat-speed": {
      benchmarkSlug: "global-mmlu-lite",
      benchmarkName: "Global-MMLU-Lite",
      model: "GPT-4o / Gemini 2.0 Flash",
      reason: "對話如行雲流水，跨多國語言常識理解全面。"
    }
  };

  const recKey = `${taskType}-${priority}`;
  const rec = diagnosticRecs[recKey] || diagnosticRecs["code-reasoning"];

  return (
    <div className="mx-auto max-w-3xl space-y-12">
      <header className="space-y-3">
        <Badge variant="secondary">選型與指標實驗室</Badge>
        <h1 className="font-serif text-4xl">AI 選型診斷與計算小工具</h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          高中生做專案或寫作業，不知道該挑哪個模型？想知道 Elo 天梯分差 100 分代表什麼？
          這裡提供互動診斷與即時試算！
        </p>
      </header>

      {/* Diagnostic tool */}
      <section className="space-y-6">
        <h2 className="font-serif text-2xl">🧭 任務選型診斷器</h2>
        <Card>
          <CardContent className="pt-6 space-y-6">
            <div>
              <label className="block text-sm font-bold text-foreground mb-3">
                1. 你現在最想讓 AI 幫你做什麼事？
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: "code", label: "💻 寫程式 / 專案開發" },
                  { id: "math", label: "🧮 數理解題 / 奧賽" },
                  { id: "long", label: "📚 讀整本書 / 查長報告" },
                  { id: "chat", label: "💬 日常寫作 / 創意對話" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setTaskType(item.id)}
                    className={`p-3 rounded-xl border text-sm font-medium transition-all text-left cursor-pointer ${
                      taskType === item.id
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "bg-muted/30 border-border hover:bg-muted"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground mb-3">
                2. 你最看重的核心特質是什麼？
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { id: "reasoning", label: "🧠 極致嚴謹邏輯（慢一點沒關係，答案必須 100% 正確）" },
                  { id: "speed", label: "⚡ 反應極速流暢（秒回、省費用、日常快速夠用就好）" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setPriority(item.id)}
                    className={`p-3.5 rounded-xl border text-sm font-medium transition-all text-left cursor-pointer ${
                      priority === item.id
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "bg-muted/30 border-border hover:bg-muted"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-muted/60 border border-border space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-primary">💡 診斷建議</p>
              <h3 className="text-lg font-serif font-bold text-foreground">
                最該參考的 Benchmark：{rec.benchmarkName}
              </h3>
              <p className="text-sm font-semibold text-primary">
                推薦首選模型梯隊：{rec.model}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <strong>推薦原因：</strong>{rec.reason}
              </p>
              <div className="pt-2">
                <Button variant="outline" size="sm" render={<Link href={`/wiki/${rec.benchmarkSlug}`} />}>
                  查看該評測條目解密 →
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Interactive calculators */}
      <section className="space-y-6">
        <h2 className="font-serif text-2xl">📊 分數換算與防忽悠實驗室</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Elo Calculator */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <span>♟️ Elo 天梯勝率換算器</span>
                <Badge variant="outline">Chatbot Arena 原理</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-muted-foreground">
                當模型 A 比模型 B 的 Elo 分數高出多少時，在雙盲實測中勝率會是多少？
              </p>
              <div>
                <div className="flex justify-between text-sm font-semibold mb-1">
                  <span>Elo 分數差距：</span>
                  <span className="text-primary font-bold">+{eloDiff} 分</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="400"
                  step="10"
                  value={eloDiff}
                  onChange={(e) => setEloDiff(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>0分 (五五波 50%)</span>
                  <span>200分 (勝率 76%)</span>
                  <span>400分 (碾壓 91%)</span>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-muted/40 border flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground">模型 A 預期勝率</div>
                  <div className="text-2xl font-black text-primary font-mono">{winProbability}%</div>
                </div>
                <div className="text-xs text-muted-foreground max-w-[170px] text-right">
                  {eloDiff < 50 ? "兩者實力相當，人類很難分出高下。" :
                   eloDiff < 150 ? "模型 A 在精準度與排版上明顯勝出！" :
                   "巨大世代差距，模型 A 呈現壓倒性優勢！"}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pass@k Trick */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <span>🎯 Pass@1 vs Pass@k 盲點</span>
                <Badge variant="outline">警惕宣傳陷阱</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-muted-foreground">
                單次答對率不高時，如果允許 AI 猜 k 次只要中一次就算對，分數會如何虛胖？
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold block mb-1">Pass@1 實力: {passKRate}%</label>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    step="5"
                    value={passKRate}
                    onChange={(e) => setPassKRate(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">重猜次數: {kAttempts} 次</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={kAttempts}
                    onChange={(e) => setKAttempts(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>
              </div>
              <div className="p-4 rounded-xl bg-muted/40 border flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground">膨脹後的 Pass@{kAttempts} 分數</div>
                  <div className="text-2xl font-black text-primary font-mono">{passKProb}%</div>
                </div>
                <div className="text-xs text-muted-foreground max-w-[170px] text-right">
                  {passKProb - passKRate > 30 ? "⚠️ 分數大幅虛胖！認明 Pass@1 才是真本事！" : "Pass@1 才能客觀評估 AI 的穩定能力。"}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
