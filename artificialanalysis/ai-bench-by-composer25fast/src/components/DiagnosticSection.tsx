'use client';

import React, { useState } from 'react';
import { Bot, Sparkles, Check, ArrowRight, Compass } from 'lucide-react';

interface QuestionOption {
  label: string;
  value: string;
}

export const DiagnosticSection: React.FC<{ onNavigateToBenchmark: (id: string) => void }> = ({
  onNavigateToBenchmark,
}) => {
  const [taskType, setTaskType] = useState<string>('code');
  const [importance, setImportance] = useState<string>('reasoning');

  const recommendations: { [key: string]: { benchmarkId: string; benchmarkName: string; model: string; reason: string } } = {
    'code-reasoning': {
      benchmarkId: 'swe-bench-verified',
      benchmarkName: 'SWE-bench Verified & LiveCodeBench',
      model: 'Claude 3.7 Sonnet (Thinking)',
      reason: '需要自主定位多檔案 Bug、理解龐大軟體專案架構並通過單元測試，SWE-bench 是唯一標準。'
    },
    'code-speed': {
      benchmarkId: 'livecodebench',
      benchmarkName: 'LiveCodeBench',
      model: 'Claude 3.5 Sonnet / GPT-4o',
      reason: '快速輔助生成日常函式，需要極低延遲與高 Pass@1 演算法正確率。'
    },
    'math-reasoning': {
      benchmarkId: 'aime-2025',
      benchmarkName: 'AIME 2025 & MATH-500',
      model: 'o3-mini (High) / DeepSeek-R1',
      reason: '需要極致的符號推理與數論演算，在 AIME 2025 答對 80%+ 的推理模型最能避免計算錯誤。'
    },
    'math-speed': {
      benchmarkId: 'math-500',
      benchmarkName: 'MATH-500',
      model: 'o3-mini / GPT-4o',
      reason: '標準高中數學題型，速度與準確率取得良好平衡。'
    },
    'long-reasoning': {
      benchmarkId: 'aa-long-context',
      benchmarkName: 'AA Long Context Reasoning',
      model: 'Gemini 2.0 Pro / Claude 3.7',
      reason: '在 10 萬字以上文件中跨章節抓取矛盾線索並多跳推導，需要極佳的長上下文記憶力。'
    },
    'long-speed': {
      benchmarkId: 'aa-long-context',
      benchmarkName: 'AA Long Context Reasoning',
      model: 'Gemini 2.0 Flash (2M 窗口)',
      reason: '百萬字快速檢索大海撈針，速度極快且性價比極高。'
    },
    'chat-reasoning': {
      benchmarkId: 'chatbot-arena',
      benchmarkName: 'LMSYS Chatbot Arena',
      model: 'Claude 3.7 Sonnet / GPT-4o',
      reason: '在 Elo 天梯排位賽中獲得全球百萬用戶最高滿意度，語氣生動有條理。'
    },
    'chat-speed': {
      benchmarkId: 'chatbot-arena',
      benchmarkName: 'LMSYS Chatbot Arena',
      model: 'GPT-4o / Gemini 2.0 Flash',
      reason: '對話反應如飛，日常問答流暢自然。'
    }
  };

  const currentRecKey = `${taskType}-${importance}`;
  const currentRec = recommendations[currentRecKey] || recommendations['code-reasoning'];

  return (
    <section className="py-12 bg-slate-950 border-t border-slate-800 text-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-3">
            <Compass className="w-4 h-4" />
            <span>智慧選型小助手</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white">
            AI 選型診斷器：高中生做專案該看哪個 Benchmark？
          </h2>
          <p className="mt-3 text-slate-300 text-sm">
            告訴我你現在想做什麼任務，我們幫你找出最該參考的 Benchmark 指標與最合適的 AI！
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          {/* Step 1: Task selection */}
          <div>
            <label className="block text-sm font-bold text-slate-200 mb-3">
              1. 你目前主要想讓 AI 幫你做什麼事？
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'code', label: '💻 寫程式 / 專案開發' },
                { id: 'math', label: '🧮 數理解題 / 奧賽' },
                { id: 'long', label: '📚 讀整本書 / 超長論文' },
                { id: 'chat', label: '💬 日常寫作 / 創意對話' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setTaskType(item.id)}
                  className={`p-3 rounded-xl border text-xs sm:text-sm font-medium transition-all text-left cursor-pointer ${
                    taskType === item.id
                      ? 'bg-indigo-600/30 border-indigo-500 text-white font-bold shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Priority */}
          <div>
            <label className="block text-sm font-bold text-slate-200 mb-3">
              2. 你最在乎的核心考量是什麼？
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'reasoning', label: '🧠 極致深度邏輯（慢一點沒關係，要 100% 嚴謹對）' },
                { id: 'speed', label: '⚡ 反應極速流暢（秒回、省錢、日常夠用就好）' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setImportance(item.id)}
                  className={`p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all text-left cursor-pointer ${
                    importance === item.id
                      ? 'bg-purple-600/30 border-purple-500 text-white font-bold shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Diagnosis Result Box */}
          <div className="bg-gradient-to-br from-indigo-950/80 via-slate-950 to-purple-950/40 border border-indigo-500/40 rounded-2xl p-6 mt-6">
            <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">
              💡 診斷建議報告
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-xs text-slate-400">你最該關注的基準測試 (Benchmark)：</span>
                <div className="text-lg font-extrabold text-white flex items-center gap-2 mt-0.5">
                  <span>{currentRec.benchmarkName}</span>
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-400">目前最推薦搭配的頂尖 AI 模型：</span>
                <div className="text-base font-bold text-amber-300 mt-0.5">
                  👑 {currentRec.model}
                </div>
              </div>

              <div className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-slate-800/80">
                <span className="font-semibold text-indigo-300">為什麼是這個標準？</span> {currentRec.reason}
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onNavigateToBenchmark(currentRec.benchmarkId)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center gap-1.5 underline cursor-pointer"
                >
                  <span>查看此 Benchmark 的詳細百科規格與真題</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
