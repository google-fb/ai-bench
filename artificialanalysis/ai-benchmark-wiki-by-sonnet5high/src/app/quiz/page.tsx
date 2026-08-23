"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QUIZ_QUESTIONS } from "@/data/interactive-data";

export default function QuizPage() {
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQ = QUIZ_QUESTIONS[currentQIdx];

  const handleSelect = (idx: number) => {
    if (selectedOpt !== null) return;
    setSelectedOpt(idx);
    setShowAnswer(true);
    if (idx === currentQ.correctIndex) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentQIdx((i) => i + 1);
      setSelectedOpt(null);
      setShowAnswer(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentQIdx(0);
    setSelectedOpt(null);
    setShowAnswer(false);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header className="space-y-3">
        <Badge variant="secondary">互動考場</Badge>
        <h1 className="font-serif text-4xl">高中生 vs AI 真題挑戰</h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          精選 5 道代表性評測考題（涵蓋 MMLU-Pro、AIME 數學、IFEval、GPQA 與 SWE-bench），
          親身體驗 AI 最容易在哪裡「翻車」，以及題庫是怎麼設計思維陷阱的！
        </p>
      </header>

      {!quizFinished ? (
        <Card className="border-2 shadow-sm">
          <CardHeader className="border-b bg-muted/40">
            <div className="flex items-center justify-between">
              <Badge variant="default">
                第 {currentQIdx + 1} / {QUIZ_QUESTIONS.length} 題
              </Badge>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{currentQ.benchmarkName}</span>
                <span>•</span>
                <Badge variant="outline">{currentQ.difficulty}</Badge>
              </div>
            </div>
            <CardTitle className="mt-3 font-serif text-xl leading-relaxed">
              {currentQ.question}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3 pt-6">
            {currentQ.options.map((opt, idx) => {
              let customStyle = "border-border hover:bg-accent text-foreground";

              if (selectedOpt !== null) {
                if (idx === currentQ.correctIndex) {
                  customStyle = "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold";
                } else if (idx === selectedOpt) {
                  customStyle = "border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400";
                } else {
                  customStyle = "border-border/40 text-muted-foreground opacity-50";
                }
              }

              return (
                <button
                  key={idx}
                  disabled={selectedOpt !== null}
                  onClick={() => handleSelect(idx)}
                  className={`w-full text-left p-4 rounded-xl border transition-all text-sm font-medium flex items-center justify-between cursor-pointer ${customStyle}`}
                >
                  <span>{opt}</span>
                  {selectedOpt !== null && idx === currentQ.correctIndex && (
                    <span className="text-emerald-600 font-bold ml-2">✓ 正確</span>
                  )}
                  {selectedOpt !== null && idx === selectedOpt && idx !== currentQ.correctIndex && (
                    <span className="text-rose-600 font-bold ml-2">✗ 答錯</span>
                  )}
                </button>
              );
            })}

            {showAnswer && (
              <div className="mt-6 space-y-4 pt-4 border-t">
                <div className={`p-4 rounded-xl text-sm leading-relaxed ${
                  selectedOpt === currentQ.correctIndex ? "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30" : "bg-rose-500/10 text-rose-800 dark:text-rose-300 border border-rose-500/30"
                }`}>
                  <div className="font-bold mb-1">
                    {selectedOpt === currentQ.correctIndex ? "🎉 恭喜答對！" : `❌ 答錯囉！正確答案為：${currentQ.options[currentQ.correctIndex].split('.')[0]}`}
                  </div>
                  <p>{currentQ.explanation}</p>
                </div>

                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-sm">
                  <span className="font-bold">💡 大語言模型最常翻車的原因：</span>
                  <p className="mt-1">{currentQ.aiTypicalMistake}</p>
                </div>

                <div className="flex justify-end pt-2">
                  <Button onClick={handleNext}>
                    {currentQIdx < QUIZ_QUESTIONS.length - 1 ? "下一題 →" : "查看總結算 →"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="text-center p-8 border-2">
          <span className="text-6xl">🏆</span>
          <h2 className="text-2xl font-serif font-bold mt-4">挑戰結算</h2>
          <p className="text-lg text-muted-foreground mt-2">
            你一共答對了 <strong className="text-primary text-3xl">{score}</strong> / {QUIZ_QUESTIONS.length} 題
          </p>
          <p className="max-w-md mx-auto text-sm text-muted-foreground mt-4 leading-relaxed">
            {score >= 4
              ? "太強了！你的思維嚴謹度與反覆驗證習慣，完全不輸具備深度思維鏈 (Chain-of-Thought) 的前沿推理模型！"
              : "表現很棒！這些考題連許多博士專家第一次做都很容易被誘答項騙倒，這正是高水準 Benchmark 的精髓所在！"}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button variant="outline" onClick={handleRestart}>
              🔄 重新測驗
            </Button>
            <Button render={<Link href="/scores" />}>
              進一步了解分數門道 →
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
