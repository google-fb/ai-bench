'use client';

import React from 'react';
import { 
  Brain, 
  Calculator, 
  Code2, 
  Bot, 
  Eye, 
  FileText, 
  ListChecks, 
  Sparkles,
  Trophy,
  HelpCircle,
  BarChart3,
  BookOpen,
  Search
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
}) => {
  const navItems = [
    { id: 'home', label: '首頁導覽', icon: BookOpen },
    { id: 'benchmarks', label: '評測百科 (10+大項)', icon: Sparkles },
    { id: 'metrics', label: '分數與指標白話解密', icon: BarChart3 },
    { id: 'leaderboard', label: 'AI 模型天梯對決', icon: Trophy },
    { id: 'quiz', label: '高中生挑戰 AI 考題', icon: HelpCircle },
    { id: 'diagnostic', label: 'AI 選型診斷器', icon: Bot },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-bold text-lg bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                AI Benchmark 高中生科普百科
              </div>
              <div className="text-xs text-indigo-400 font-mono flex items-center gap-1.5">
                <span>Artificial Analysis 繁中解密版</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
            </div>
          </div>

          {/* Search bar */}
          <div className="hidden md:flex items-center relative w-64 lg:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="搜尋評測 (如 GPQA, MATH, Elo...)"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeTab !== 'benchmarks') {
                  setActiveTab('benchmarks');
                }
              }}
              className="w-full bg-slate-800/80 text-sm text-slate-100 placeholder-slate-400 pl-9 pr-4 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>

          {/* Nav links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Mobile Submenu */}
        <div className="lg:hidden flex overflow-x-auto py-2.5 space-x-2 scrollbar-none border-t border-slate-800/60">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex-shrink-0 flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
