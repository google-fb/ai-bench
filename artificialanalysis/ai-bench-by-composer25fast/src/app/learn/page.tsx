import { WikiLayout } from "@/components/wiki-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { concepts, scoreTypeLabels } from "@/data/concepts";

export default function LearnPage() {
  return (
    <WikiLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">基礎概念</h1>
        <p className="mt-2 text-lg text-slate-600">
          在深入各項測試之前，先了解 AI Benchmark 的基本知識。
        </p>
      </div>

      <div className="mb-10 space-y-6">
        {concepts.map((concept, i) => (
          <Card key={concept.title} className="overflow-hidden">
            <CardHeader className="bg-slate-50">
              <CardTitle className="flex items-center gap-3 text-lg">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                  {i + 1}
                </span>
                {concept.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-slate-700 leading-relaxed">{concept.content}</p>
              <div className="mt-4 rounded-lg border-l-4 border-amber-400 bg-amber-50 p-4">
                <p className="text-sm font-medium text-amber-800">💡 生活類比</p>
                <p className="mt-1 text-sm text-amber-700">{concept.analogy}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <section>
        <h2 className="mb-4 text-2xl font-bold text-slate-900">常見評分方式</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {Object.entries(scoreTypeLabels).map(([key, info]) => (
            <Card key={key}>
              <CardHeader>
                <CardTitle className="text-base">{info.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 leading-relaxed">{info.explanation}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-xl border border-blue-200 bg-blue-50 p-6">
        <h3 className="font-bold text-blue-900">讀分數的小提醒</h3>
        <ul className="mt-3 space-y-2 text-sm text-blue-800">
          <li>• 不同測試的分數<strong>不能直接比較</strong>——在 HLE 上 55% 可能比在 MMLU 上 95% 更厲害。</li>
          <li>• 看分數時注意<strong>測試難度</strong>和<strong>人類基準</strong>（例如 GPQA 上博士專家約 65%）。</li>
          <li>• 單一分數不能代表一切——聰明的 AI 可能在數學很強但法律很弱。</li>
          <li>• Benchmark 分數會隨著新模型推出而改變，這是正常現象。</li>
        </ul>
      </section>
    </WikiLayout>
  );
}
