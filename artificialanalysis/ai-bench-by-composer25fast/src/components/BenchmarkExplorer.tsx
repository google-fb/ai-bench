'use client';

import React, { useState } from 'react';
import { BenchmarkItem, CategoryType } from '@/data/types';
import { 
  Brain, 
  Calculator, 
  Code2, 
  Bot, 
  Eye, 
  FileText, 
  ListChecks, 
  Sparkles,
  ChevronRight,
  ExternalLink,
  HelpCircle,
  AlertTriangle,
  Award,
  CheckCircle2,
  Terminal,
  BookOpen,
  Filter
} from 'lucide-react';

interface BenchmarkExplorerProps {
  benchmarks: BenchmarkItem[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const BenchmarkExplorer: React.FC<BenchmarkExplorerProps> = ({
  benchmarks,
  searchQuery,
  setSearchQuery,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'all'>('all');
  const [selectedBenchmarkId, setSelectedBenchmarkId] = useState<string>(benchmarks[0].id);

  const categories: { id: CategoryType | 'all'; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'all', label: '全部評測項目', icon: Sparkles },
    { id: 'overview', label: '綜合指數與排位', icon: Award },
    { id: 'reasoning', label: '邏輯與學科推理', icon: Brain },
    { id: 'math', label: '數學與奧林匹亞', icon: Calculator },
    { id: 'coding', label: '程式碼與軟體工程', icon: Code2 },
    { id: 'agentic', label: 'Agent 代理人與職場實戰', icon: Bot },
    { id: 'multimodal', label: '多模態與視覺理解', icon: Eye },
    { id: 'long-context', label: '長文本與大海撈針', icon: FileText },
    { id: 'instruction-following', label: '精確指令遵循', icon: ListChecks },
  ];

  // Filter benchmarks
  const filteredBenchmarks = benchmarks.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.highSchoolMetaphor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const activeBenchmark = benchmarks.find((b) => b.id === selectedBenchmarkId) || filteredBenchmarks[0] || benchmarks[0];

  return (
    <section className="py-12 bg-slate-950 min-h-screen text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm mb-1">
            <BookOpen className="w-4 h-4" />
            <span>AI 評測維基百科 (Artificial Analysis 核心項目)</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            評測項目深度全解：測試集、方法與分數白話解析
          </h2>
          <p className="mt-2 text-slate-400 text-sm sm:text-base">
            點選左側或上方分類清單，探索每項 AI 考試的本質、高中生秒懂比喻、真題範例與防作弊機制。
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex overflow-x-auto pb-3 mb-8 gap-2 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  // if active is not in new list, pick first
                  const firstOfCat = cat.id === 'all' ? benchmarks[0] : benchmarks.find(b => b.category === cat.id);
                  if (firstOfCat) setSelectedBenchmarkId(firstOfCat.id);
                }}
                className={`flex-shrink-0 flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Two Column Layout: List (Left) + Detailed Wiki View (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: List of Benchmarks */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 px-1 mb-2">
              <span>評測列表 ({filteredBenchmarks.length} 個項目)</span>
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="text-indigo-400 hover:underline"
                >
                  清除搜尋
                </button>
              )}
            </div>

            {filteredBenchmarks.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
                <HelpCircle className="w-8 h-8 mx-auto mb-2 text-slate-500" />
                <p>找不到符合「{searchQuery}」的評測項目</p>
              </div>
            ) : (
              filteredBenchmarks.map((item) => {
                const isSelected = activeBenchmark.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedBenchmarkId(item.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'bg-gradient-to-br from-indigo-950/80 to-slate-900 border-indigo-500 shadow-lg shadow-indigo-500/10'
                        : 'bg-slate-900/90 border-slate-800/80 hover:border-slate-700 hover:bg-slate-850'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-indigo-300 border border-slate-700">
                          {item.categoryName}
                        </span>
                        <h4 className="font-bold text-base text-white mt-1.5 flex items-center gap-1.5">
                          {item.name}
                        </h4>
                      </div>
                      <ChevronRight className={`w-5 h-5 transition-transform ${isSelected ? 'text-indigo-400 translate-x-1' : 'text-slate-600'}`} />
                    </div>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                      {item.tagline}
                    </p>
                    <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-800/60 pt-2">
                      <span>指標：{item.metricType}</span>
                      <span className="text-indigo-400 font-mono">頂尖 ~ {item.topModelScores[0]?.score || 'N/A'}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column: Detailed Wiki Content */}
          <div className="lg:col-span-8">
            {activeBenchmark && (
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8 shadow-2xl">
                {/* Header */}
                <div className="border-b border-slate-800 pb-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {activeBenchmark.categoryName}
                    </span>
                    <span className="text-xs text-slate-400">
                      出處/開發：{activeBenchmark.origin}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                    {activeBenchmark.name}
                  </h3>
                  <p className="text-indigo-300 font-medium text-sm sm:text-base mt-2">
                    {activeBenchmark.tagline}
                  </p>
                </div>

                {/* High School Metaphor (Most Important Box!) */}
                <div className="bg-gradient-to-br from-indigo-950/90 via-purple-950/40 to-slate-900 border-2 border-indigo-500/40 rounded-2xl p-5 sm:p-6 relative overflow-hidden shadow-lg">
                  <div className="flex items-center gap-2.5 text-indigo-300 font-bold text-base mb-2">
                    <span className="text-xl">🎓</span>
                    <span>高中生秒懂白話比喻</span>
                  </div>
                  <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                    {activeBenchmark.highSchoolMetaphor}
                  </p>
                </div>

                {/* 4-Box Grid: Scale, Method, Metric, Baseline */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      📚 測試集本質與規模 (Dataset)
                    </div>
                    <div className="text-sm text-slate-200 font-medium">
                      {activeBenchmark.datasetScale}
                    </div>
                  </div>

                  <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      🔬 測試方法與流程 (Method)
                    </div>
                    <div className="text-sm text-slate-200 font-medium">
                      {activeBenchmark.evalMethod}
                    </div>
                  </div>

                  <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      📊 分數指標類型 (Metric)
                    </div>
                    <div className="text-sm text-indigo-300 font-bold">
                      {activeBenchmark.metricType}
                    </div>
                  </div>

                  <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      👤 人類基準分數 (Human Baseline)
                    </div>
                    <div className="text-sm text-emerald-400 font-medium">
                      {activeBenchmark.humanBaseline}
                    </div>
                  </div>
                </div>

                {/* Top Models Performance Comparison Bar */}
                <div>
                  <h4 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    <span>各家頂尖 AI 模型實測戰報 (Artificial Analysis 最新數據)</span>
                  </h4>
                  <div className="space-y-2.5">
                    {activeBenchmark.topModelScores.map((scoreItem, idx) => (
                      <div key={idx} className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                            idx === 0 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                            idx === 1 ? 'bg-slate-400/20 text-slate-300 border border-slate-400/40' :
                            idx === 2 ? 'bg-amber-700/20 text-amber-500 border border-amber-700/40' :
                            'bg-slate-800 text-slate-400'
                          }`}>
                            {idx + 1}
                          </span>
                          <span className="text-sm font-semibold text-slate-200">{scoreItem.model}</span>
                        </div>
                        <span className="font-mono text-sm font-bold text-indigo-400 px-2.5 py-1 rounded-lg bg-indigo-950/50 border border-indigo-800/50">
                          {scoreItem.score}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Abilities Tested */}
                <div>
                  <h4 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>這項測試到底在考 AI 什麼能力？</span>
                  </h4>
                  <ul className="space-y-2">
                    {activeBenchmark.whatItTests.map((ability, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                        <span>{ability}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Real Exam Example (Interactive / Visual Box) */}
                <div className="bg-slate-950 border border-indigo-900/50 rounded-2xl p-5 sm:p-6">
                  <div className="flex items-center gap-2 text-pink-400 font-bold text-sm mb-3">
                    <HelpCircle className="w-4 h-4" />
                    <span>真實考題示例與 AI 翻車點解析</span>
                  </div>

                  <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 font-mono text-xs sm:text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
                    {activeBenchmark.highSchoolExample.question}
                  </div>

                  {activeBenchmark.highSchoolExample.options && (
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {activeBenchmark.highSchoolExample.options.map((opt, idx) => (
                        <div key={idx} className="text-xs p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-mono">
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-2 text-xs sm:text-sm">
                    <div className="flex items-start gap-2 text-emerald-300">
                      <span className="font-bold whitespace-nowrap">【正確解答】</span>
                      <span>{activeBenchmark.highSchoolExample.answer}</span>
                    </div>
                    <div className="flex items-start gap-2 text-slate-400">
                      <span className="font-bold whitespace-nowrap">【題目解析】</span>
                      <span>{activeBenchmark.highSchoolExample.explanation}</span>
                    </div>
                    <div className="flex items-start gap-2 text-amber-300">
                      <span className="font-bold whitespace-nowrap">【AI 常犯錯誤】</span>
                      <span>{activeBenchmark.highSchoolExample.whyAiFindsItHard}</span>
                    </div>
                  </div>
                </div>

                {/* Limitations and Data Contamination Alert */}
                <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-4 sm:p-5 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-amber-300 text-sm">
                      盲點與資料污染警訊（為什麼不能盲目迷信這個分數？）
                    </h5>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                      {activeBenchmark.limitationsAndContamination}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
