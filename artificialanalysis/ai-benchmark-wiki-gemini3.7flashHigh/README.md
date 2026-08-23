# AI 評測百科

給高中生的繁體中文 Wiki，用來讀懂 [Artificial Analysis Evaluations](https://artificialanalysis.ai/evaluations) 上的 AI benchmark。

每一個條目都用教室語言說明五件事：

- 這項考試在測什麼
- 分數代表什麼
- 測試集是什麼
- 怎麼測試
- 方法與閱卷怎麼做

內容依官方 [Intelligence Benchmarking Methodology](https://artificialanalysis.ai/methodology/intelligence-benchmarking/) 整理，並翻譯、改寫成高中生能讀完的版本。本站不是官方中文版，模型分數請以原站為準。

## 本機執行

需要 Node.js 20 以上。

```bash
npm install
npm run dev
```

瀏覽器開啟 [http://127.0.0.1:43127](http://127.0.0.1:43127)。

正式建置：

```bash
npm run build
npm start
```

## 網站結構

- `/` 百科首頁與智力指數九科速覽
- `/guide` 什麼是 benchmark
- `/scores` 怎麼讀正確率、Elo、pass@1
- `/glossary` 詞彙表
- `/category/[slug]` 依主題瀏覽
- `/wiki/[slug]` 各評測條目

條目資料在 `src/data/benchmarks.ts`。
