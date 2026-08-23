import React from 'react';
import { 
  Brain, 
  HelpCircle, 
  Trophy, 
  Sparkles, 
  ShieldAlert, 
  Zap, 
  ArrowRight, 
  Compass,
  CheckCircle2,
  Users,
  Target,
  FileQuestion,
  TrendingUp
} from 'lucide-react';

interface HeroProps {
  onExplore: () => void;
  onTakeQuiz: () => void;
  onViewLeaderboard: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExplore,
  onTakeQuiz,
  onViewLeaderboard,
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 py-16 sm:py-24 border-b border-slate-850">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-500/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[250px] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[200px] bg-pink-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs sm:text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>給高中生的 AI 測驗百科：不再被廠商宣傳術語唬住！</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight sm:leading-tight">
            AI 到底有多聰明？
            <span className="block mt-2 bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
              一張圖看懂 AI 基準測試 (Benchmark)
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg text-slate-300 leading-relaxed">
            常在新聞看到 <strong className="text-white">「某某 AI 在 MMLU 考了 90 分」、「在 GPQA 超越人類博士」</strong>？
            到底什麼是 Benchmark？分數是怎麼測出來的？測試集有沒有被偷看小抄？
            本站專為高中生打造，用最淺白的生活比喻與真實考題，帶你像 AI 科學家一樣看懂門道！
          </p>

          {/* Action CTA Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onExplore}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm sm:text-base shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-2 group cursor-pointer"
            >
              <span>瀏覽評測項目百科 (10+大項)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onTakeQuiz}
              className="px-6 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-200 font-semibold text-sm sm:text-base transition-all flex items-center gap-2 cursor-pointer"
            >
              <FileQuestion className="w-4 h-4 text-pink-400" />
              <span>親身體驗 AI 考卷 (5題挑戰)</span>
            </button>
            <button
              onClick={onViewLeaderboard}
              className="px-6 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-200 font-semibold text-sm sm:text-base transition-all flex items-center gap-2 cursor-pointer"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>2026 AI 天梯榜</span>
            </button>
          </div>
        </div>

        {/* 3 Core Metaphor Cards for High Schoolers */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700/80 rounded-2xl p-6 hover:border-indigo-500/50 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <span>什麼是 Benchmark？</span>
              <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">概念本質</span>
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              就像全台灣高三生的<strong className="text-indigo-300">「大學學測與模擬考」</strong>！如果沒有統一的標準量尺，每家 AI 公司都說自己第一名；有了 Benchmark，大家拿同一份封閉試卷同時考試，誰是學霸一目了然。
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur border border-slate-700/80 rounded-2xl p-6 hover:border-purple-500/50 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <span>AI 是怎麼被測試的？</span>
              <span className="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">評測方法</span>
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              不只選擇題！現代評測會把 AI 丟進<strong className="text-purple-300">「隔離沙盒」</strong>讓它自己下終端機指令寫 Code、跑單元測試；或者給它 10 萬字長篇小說，看它能不能揪出兇手細節。
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur border border-slate-700/80 rounded-2xl p-6 hover:border-pink-500/50 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 mb-4 group-hover:scale-110 transition-transform">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <span>分數高就真的聰明嗎？</span>
              <span className="text-xs px-2 py-0.5 rounded bg-pink-500/20 text-pink-300">破解盲點</span>
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              小心<strong className="text-pink-300">「資料污染 (偷背解答)」</strong>與<strong className="text-pink-300">「刷題偏見」</strong>！AI 可能背下了兩年前的題庫，但遇到全新題型就露餡。這就是為什麼需要像 LiveCodeBench 這樣每週抓新考題的動態測試！
            </p>
          </div>
        </div>

        {/* Quick high school mapping table */}
        <div className="mt-12 bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Compass className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">高中學科 vs AI Benchmark 對照地圖（一眼看懂各項測試在考什麼）</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs sm:text-sm">
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-750">
              <div className="text-indigo-400 font-semibold mb-1">高中全科指考</div>
              <div className="text-white font-bold text-base">MMLU-Pro</div>
              <div className="text-slate-400 text-xs mt-1">10選1綜合學科</div>
            </div>
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-750">
              <div className="text-purple-400 font-semibold mb-1">奧林匹亞數奧</div>
              <div className="text-white font-bold text-base">AIME 2025</div>
              <div className="text-slate-400 text-xs mt-1">30題000-999填空</div>
            </div>
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-750">
              <div className="text-pink-400 font-semibold mb-1">博士級科展</div>
              <div className="text-white font-bold text-base">GPQA Diamond</div>
              <div className="text-slate-400 text-xs mt-1">Google 查不到的難題</div>
            </div>
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-750">
              <div className="text-emerald-400 font-semibold mb-1">資訊能力競賽</div>
              <div className="text-white font-bold text-base">LiveCodeBench</div>
              <div className="text-slate-400 text-xs mt-1">即時 LeetCode 實戰</div>
            </div>
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-750">
              <div className="text-amber-400 font-semibold mb-1">資訊社工程師</div>
              <div className="text-white font-bold text-base">SWE-bench</div>
              <div className="text-slate-400 text-xs mt-1">真實開源專案修 Bug</div>
            </div>
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-750">
              <div className="text-cyan-400 font-semibold mb-1">全校人氣排位賽</div>
              <div className="text-white font-bold text-base">Chatbot Arena</div>
              <div className="text-slate-400 text-xs mt-1">百萬人類盲測 Elo 戰力</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
