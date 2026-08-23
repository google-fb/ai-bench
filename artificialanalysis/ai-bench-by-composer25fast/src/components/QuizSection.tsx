'use client';

import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '@/data/benchmarks';
import confetti from 'canvas-confetti';
import { 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Sparkles, 
  Award, 
  Lightbulb, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

export const QuizSection: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [userScore, setUserScore] = useState<number>(0);
  const [answeredList, setAnsweredList] = useState<{ isCorrect: boolean; selected: number }[]>([]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const currentQ = QUIZ_QUESTIONS[currentIdx];

  const handleSelectOption = (idx: number) => {
    if (selectedOption !== null) return; // Prevent changing after answer
    setSelectedOption(idx);
    setShowExplanation(true);

    const isCorrect = idx === currentQ.correctIndex;
    if (isCorrect) {
      setUserScore((prev) => prev + 1);
      // trigger confetti on correct answer
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 }
        });
      } catch (e) {
        // ignore if not supported
      }
    }

    setAnsweredList((prev) => [...prev, { isCorrect, selected: idx }]);
  };

  const handleNext = () => {
    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setIsCompleted(true);
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setUserScore(0);
    setAnsweredList([]);
    setIsCompleted(false);
  };

  return (
    <section className="py-12 bg-slate-900 border-t border-slate-800 text-slate-100 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs font-semibold mb-3">
            <Sparkles className="w-4 h-4" />
            <span>互動挑戰實驗室</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            高中生 vs 頂級 AI：親身體驗 Benchmark 經典真題
          </h2>
          <p className="mt-3 text-slate-300 text-sm sm:text-base">
            我們精選了 5 道涵蓋 MMLU-Pro、AIME 數學、IFEval、GPQA 與 SWE-bench 的代表性考題，
            來看看你能不能避開 AI 常犯的思維陷阱！
          </p>
        </div>

        {!isCompleted ? (
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
            {/* Progress Bar & Header */}
            <div className="flex items-center justify-between text-xs text-slate-400 mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white px-2.5 py-1 rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 font-mono">
                  第 {currentIdx + 1} / {QUIZ_QUESTIONS.length} 題
                </span>
                <span className="text-slate-300 font-medium">{currentQ.benchmarkName}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-slate-800 text-pink-300 text-[11px] border border-slate-700">
                  {currentQ.difficulty}
                </span>
                <span className="font-mono text-indigo-400">得分: {userScore}</span>
              </div>
            </div>

            {/* Question Text */}
            <div className="my-6">
              <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">
                領域：{currentQ.category}
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
                {currentQ.question}
              </h3>
            </div>

            {/* Options */}
            <div className="space-y-3 mb-6">
              {currentQ.options.map((option, idx) => {
                let btnStyle = 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-850 text-slate-200';
                
                if (selectedOption !== null) {
                  if (idx === currentQ.correctIndex) {
                    btnStyle = 'bg-emerald-950/70 border-emerald-500 text-emerald-200 shadow-lg shadow-emerald-500/10';
                  } else if (idx === selectedOption) {
                    btnStyle = 'bg-rose-950/70 border-rose-500 text-rose-200';
                  } else {
                    btnStyle = 'bg-slate-900/50 border-slate-850 text-slate-500 opacity-60';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={selectedOption !== null}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-4 rounded-xl border transition-all text-sm sm:text-base font-medium flex items-start justify-between gap-3 cursor-pointer ${btnStyle}`}
                  >
                    <span>{option}</span>
                    {selectedOption !== null && idx === currentQ.correctIndex && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    )}
                    {selectedOption !== null && idx === selectedOption && idx !== currentQ.correctIndex && (
                      <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation & AI Mistake Reveal */}
            {showExplanation && (
              <div className="space-y-4 pt-4 border-t border-slate-800 animate-fadeIn">
                <div className={`p-4 rounded-xl border ${
                  selectedOption === currentQ.correctIndex 
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
                    : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                }`}>
                  <div className="font-bold text-sm mb-1 flex items-center gap-2">
                    {selectedOption === currentQ.correctIndex ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>太強了！完全答對！</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-rose-400" />
                        <span>答錯囉！正確答案是：{currentQ.options[currentQ.correctIndex].split('.')[0]}</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
                    {currentQ.explanation}
                  </p>
                </div>

                <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-xl p-4">
                  <div className="text-xs font-bold text-indigo-300 flex items-center gap-1.5 mb-1">
                    <Lightbulb className="w-4 h-4 text-amber-400" />
                    <span>AI 模型最容易在這裡翻車的原因：</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {currentQ.aiTypicalMistake}
                  </p>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleNext}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>{currentIdx < QUIZ_QUESTIONS.length - 1 ? '下一題' : '查看總成績結算'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Completion Result Screen */
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 text-center shadow-2xl">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-purple-500/20">
              <Award className="w-10 h-10 text-white" />
            </div>

            <h3 className="text-3xl font-extrabold text-white mb-2">
              測試完成！總成績結算
            </h3>
            <p className="text-slate-400 text-sm mb-6">
              你一共答對了 <span className="text-indigo-400 font-bold font-mono text-xl">{userScore}</span> / {QUIZ_QUESTIONS.length} 題！
            </p>

            <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-8 text-left">
              <div className="text-xs font-semibold text-slate-400 mb-2">AI 戰力評語：</div>
              <div className="text-sm text-slate-200 leading-relaxed">
                {userScore === 5 ? (
                  <span className="text-emerald-300 font-medium">
                    🏆 滿分神人！你的邏輯嚴密度與細節洞察力堪比 o3-mini (High) 和 Claude 3.7 (Thinking)！連陷阱題都難不倒你！
                  </span>
                ) : userScore >= 3 ? (
                  <span className="text-indigo-300 font-medium">
                    ✨ 非常優秀！你具備極強的高中數理與邏輯思維，超越了許多未具備思維鏈的傳統大型語言模型！
                  </span>
                ) : (
                  <span className="text-amber-300 font-medium">
                    💪 這些題目本來就是為了測試博士級專家與頂尖 AI 設計的！透過這份測驗，你已經親身體會了 AI 測試集設計的狡猾之處！
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={handleRestart}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm transition-all inline-flex items-center gap-2 cursor-pointer border border-slate-700"
            >
              <RotateCcw className="w-4 h-4" />
              <span>重新挑戰一次</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
