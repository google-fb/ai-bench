'use client';

import React, { useState } from 'react';
import { METRIC_EXPLAINERS } from '@/data/benchmarks';
import { 
  BarChart3, 
  HelpCircle, 
  AlertOctagon, 
  CheckCircle2, 
  School, 
  Calculator,
  Sliders,
  ArrowRight
} from 'lucide-react';

export const MetricsSection: React.FC = () => {
  const [eloDiff, setEloDiff] = useState<number>(100);
  const [passKRate, setPassKRate] = useState<number>(40);
  const [kAttempts, setKAttempts] = useState<number>(5);

  // Elo win probability calculation: P(A wins) = 1 / (1 + 10^((EloB - EloA)/400))
  const winProbability = Math.round((1 / (1 + Math.pow(10, -eloDiff / 400))) * 100);

  // Pass@k formula approximation: 1 - (1 - p)^k
  const passKProb = Math.round((1 - Math.pow(1 - passKRate / 100, kAttempts)) * 100);

  return (
    <section className="py-12 bg-slate-900 border-t border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-3">
            <BarChart3 className="w-4 h-4" />
            <span>分數解密與防忽悠手冊</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            看懂 Benchmark 分數的門道：Pass@1、Elo 與偷看小抄
          </h2>
          <p className="mt-3 text-slate-300 text-sm sm:text-base">
            很多廠商宣傳「我們準確率高達 95%！」，背後可能暗藏玄機。
            學會這 5 大核心指標，讓你一眼看穿 AI 分數的真正實力！
          </p>
        </div>

        {/* 5 Core Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {METRIC_EXPLAINERS.map((metric, idx) => (
            <div 
              key={idx} 
              className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-purple-500/40 transition-all shadow-lg"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-mono px-2 py-1 rounded bg-slate-800 text-purple-300 font-semibold">
                    {metric.english}
                  </span>
                  <span className="text-xl">
                    {idx === 0 ? '🎯' : idx === 1 ? '♟️' : idx === 2 ? '🔧' : idx === 3 ? '🚨' : '⚖️'}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-1">
                  {metric.name}
                </h3>

                <div className="text-xs text-indigo-400 font-mono mb-3 bg-indigo-950/40 p-2 rounded-lg border border-indigo-900/50">
                  公式：{metric.formula}
                </div>

                <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                  {metric.easyExplanation}
                </p>

                <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 mb-4">
                  <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mb-1">
                    <School className="w-3.5 h-3.5" />
                    <span>高中生生活比喻</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    {metric.schoolAnalogy}
                  </p>
                </div>
              </div>

              <div className="bg-pink-950/20 border border-pink-500/20 rounded-xl p-3">
                <div className="text-xs font-bold text-pink-300 flex items-center gap-1.5 mb-1">
                  <AlertOctagon className="w-3.5 h-3.5 text-pink-400" />
                  <span>避坑防騙指南</span>
                </div>
                <p className="text-xs text-slate-300">
                  {metric.trapToWatch}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Calculators for High School Students */}
        <div className="bg-slate-950 border border-indigo-900/40 rounded-3xl p-6 sm:p-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h3 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
              <Calculator className="w-6 h-6 text-indigo-400" />
              <span>互動實驗室：親自調整參數感受分數差異</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              自己動手拉拉看滑桿，感受天梯積分差與 Pass@k 猜題次數對勝率的巨大影響！
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Tool 1: Elo Difference Calculator */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-base text-white flex items-center gap-2">
                  <span>♟️ Elo 天梯勝率換算器</span>
                </h4>
                <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                  Chatbot Arena 核心原理
                </span>
              </div>

              <p className="text-xs text-slate-300 mb-4">
                當模型 A 比模型 B 的 Elo 分數高出多少時，兩者在盲測對決中的勝率會是多少？
              </p>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                    <span>Elo 分數差距 (A 比 B 高)：</span>
                    <span className="text-indigo-400 font-mono text-sm">+{eloDiff} 分</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="400"
                    step="10"
                    value={eloDiff}
                    onChange={(e) => setEloDiff(Number(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>0分 (實力相當 50%)</span>
                    <span>200分 (勝率 ~76%)</span>
                    <span>400分 (碾壓 ~91%)</span>
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-400">模型 A 對 模型 B 預期勝率</div>
                    <div className="text-2xl font-black text-indigo-400 font-mono mt-0.5">
                      {winProbability}%
                    </div>
                  </div>
                  <div className="text-xs text-right text-slate-300 max-w-[180px]">
                    {eloDiff < 30 ? '兩者實力伯仲之間，人類幾乎分不出差異。' :
                     eloDiff < 100 ? '模型 A 明顯在排版與細膩度上更討喜。' :
                     eloDiff < 200 ? '模型 A 在邏輯與複雜度上大幅超越！' :
                     '完全不是同一個世代的降維打擊！'}
                  </div>
                </div>
              </div>
            </div>

            {/* Tool 2: Pass@1 vs Pass@k Trick Expolder */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-base text-white flex items-center gap-2">
                  <span>🎯 Pass@1 vs Pass@k 盲點破解器</span>
                </h4>
                <span className="text-xs px-2 py-0.5 rounded bg-pink-500/20 text-pink-300">
                  警惕灌水陷阱
                </span>
              </div>

              <p className="text-xs text-slate-300 mb-4">
                如果單次作答只有 {passKRate}% 把握，給 AI 猜 {kAttempts} 次，只要猜中一次就算對，分數會膨脹成多少？
              </p>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-300 block mb-1">真實單次能力 (Pass@1): {passKRate}%</label>
                    <input
                      type="range"
                      min="10"
                      max="90"
                      step="5"
                      value={passKRate}
                      onChange={(e) => setPassKRate(Number(e.target.value))}
                      className="w-full accent-pink-500 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 block mb-1">允許重試次數 (k): {kAttempts} 次</label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="1"
                      value={kAttempts}
                      onChange={(e) => setKAttempts(Number(e.target.value))}
                      className="w-full accent-purple-500 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-400">膨脹後的 Pass@{kAttempts} 宣傳分數</div>
                    <div className="text-2xl font-black text-pink-400 font-mono mt-0.5">
                      {passKProb}%
                    </div>
                  </div>
                  <div className="text-xs text-right text-slate-300 max-w-[180px]">
                    {passKProb - passKRate > 30 ? '⚠️ 分數虛胖超多！實際上線使用時 AI 還是只會生成一次，別被 Pass@k 騙了！' : 'Pass@1 才是最誠實反映 AI 實際表現的指標。'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
