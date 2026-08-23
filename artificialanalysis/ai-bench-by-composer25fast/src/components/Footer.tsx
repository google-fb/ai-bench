import React from 'react';
import { Brain, Heart, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 py-12 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 text-white font-bold text-base mb-3">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <span>AI Benchmark 高中生科普百科</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              專為台灣與華語區高中生、大學生及 AI 愛好者設計的繁體中文科普百科。
              資料參考權威評測機構 Artificial Analysis (artificialanalysis.ai)、LMSYS Org、OpenAI 與各大前沿學術團隊。
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
              三大核心觀念複習
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <span>認明 Pass@1，警惕 Pass@k 猜題次數虛胖</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                <span>警惕資料集污染 (訓練集包含考卷答案)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                <span>不同任務看不同指標，沒有單一全能神話</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
              權威資料來源 (Source)
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a 
                  href="https://artificialanalysis.ai/evaluations" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-indigo-400 hover:underline inline-flex items-center gap-1"
                >
                  <span>Artificial Analysis AI Model Evaluations</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://chat.lmsys.org/" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-indigo-400 hover:underline inline-flex items-center gap-1"
                >
                  <span>LMSYS Chatbot Arena Leaderboard</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/princeton-nlp/SWE-bench" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-indigo-400 hover:underline inline-flex items-center gap-1"
                >
                  <span>SWE-bench Verified (Princeton / OpenAI)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div>
            © 2026 AI Benchmark 高中生科普百科 · 繁體中文精心編撰
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>旨在普及 AI 科普素養，讓每一位高中生都能理性看懂 AI 發展</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
