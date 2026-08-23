'use client';

import React, { useState } from 'react';
import { AI_MODELS_DATA } from '@/data/benchmarks';
import { 
  Trophy, 
  Sparkles, 
  Zap, 
  ExternalLink, 
  Flame, 
  Layers, 
  Cpu, 
  HelpCircle,
  TrendingUp
} from 'lucide-react';

export const LeaderboardSection: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<string>(AI_MODELS_DATA[0].name);

  return (
    <section className="py-12 bg-slate-950 text-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
            <Trophy className="w-4 h-4" />
            <span>2026 前沿 AI 綜合戰力榜</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            各大頂尖 AI 模型真實戰力與長短板對決
          </h2>
          <p className="mt-3 text-slate-300 text-sm sm:text-base">
            參考 Artificial Analysis 綜合智能指數 (Intelligence Index) 與各大客觀 Benchmark，
            帶高中生看懂不同模型「偏科」在哪裡，哪隻模型寫程式最強、哪隻解微積分最強！
          </p>
        </div>

        {/* Model Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {AI_MODELS_DATA.map((model, idx) => {
            const isFirst = idx === 0;
            return (
              <div
                key={model.name}
                onClick={() => setSelectedModel(model.name)}
                className={`bg-slate-900/90 border rounded-2xl p-6 transition-all cursor-pointer flex flex-col justify-between ${
                  selectedModel === model.name
                    ? 'border-indigo-500 shadow-xl shadow-indigo-500/10 ring-1 ring-indigo-500'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {model.company}
                    </span>
                    <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {model.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-white mb-1">
                    {model.name}
                  </h3>
                  <div className="text-xs text-slate-400 mb-4">
                    {model.type}
                  </div>

                  {/* Key Scores */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <div className="text-[11px] text-slate-400">AA 綜合智力指數</div>
                      <div className="text-xl font-extrabold text-indigo-400 font-mono mt-0.5">
                        {model.overallIndex} <span className="text-xs text-slate-500 font-normal">/ 100</span>
                      </div>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <div className="text-[11px] text-slate-400">Chatbot Arena Elo</div>
                      <div className="text-xl font-extrabold text-amber-400 font-mono mt-0.5">
                        {model.arenaElo}
                      </div>
                    </div>
                  </div>

                  {/* Strengths */}
                  <div className="space-y-1.5 mb-4">
                    <div className="text-xs font-semibold text-slate-300">🔥 核心強項優勢：</div>
                    {model.strengths.map((st, i) => (
                      <div key={i} className="text-xs text-slate-300 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                        <span>{st}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-800/80 pt-3 mt-2">
                  <div className="text-xs text-slate-400">
                    <span className="font-semibold text-slate-300">最佳適用場景：</span>
                    {model.bestUseCases}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Deep Dive on Model Categories */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-400" />
            <span>高中生科普：為什麼 2025~2026 年出現了「推理模型 (Reasoning Model)」？</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-300 leading-relaxed">
            <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800/80">
              <h4 className="font-bold text-indigo-300 text-base mb-2">
                1. 傳統基礎模型 (Base / Chat LLM)
              </h4>
              <p>
                例如 GPT-4o、傳統 Claude。它的作答方式就像<strong className="text-white">「直覺脫口而出」</strong>，看到題目第一個字就立刻開始吐出答案，速度非常快，但遇到需要轉 3 個彎的高難度數學競賽或大專案除錯，容易因為「沒多想一秒」而講出看似合理卻錯誤的胡言亂語（幻覺）。
              </p>
            </div>
            <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800/80">
              <h4 className="font-bold text-purple-300 text-base mb-2">
                2. 思維鏈推理模型 (Reasoning Model)
              </h4>
              <p>
                例如 o3-mini、DeepSeek-R1、Claude 3.7 (Thinking)。在正式回答你之前，它會在後台花 5~30 秒進行<strong className="text-white">「內部草稿推導（Chain of Thought）」</strong>，自己列方程式、驗證假設、推翻錯誤分支。這就是為什麼它們能在 AIME 數學競賽和 SWE-bench 軟體修復中碾壓傳統模型！
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
