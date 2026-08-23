# AI Benchmark 小百科

一個以繁體中文撰寫、給高中生看的 wiki 網站,介紹 [Artificial Analysis](https://artificialanalysis.ai/evaluations) 上的主要 AI 模型評測(benchmark):

- 每個 benchmark **測什麼能力**
- **測試集(題庫)**是什麼、有幾題、誰出的
- **怎麼測**:提示方式、重複次數、工具與限制
- **分數怎麼算、代表什麼意義**(pass@1、pass^5、Elo、加權指數)

內容涵蓋 Artificial Analysis Intelligence Index v4.1.1 的九個成分測試(GDPval-AA、𝜏³-Banking、Terminal-Bench、SciCode、AA-LCR、AA-Omniscience、HLE、GPQA Diamond、CritPt),以及 MMLU-Pro、AIME、LiveCodeBench、IFBench、MMMU-Pro 等經典與獨立評測,共 23 個條目、6 篇入門概念文章與 22 則名詞解釋。

## 本機執行

```bash
npm install
npm run dev
```

開啟 http://127.0.0.1:4972 即可瀏覽。

## 技術

- [Vite](https://vitejs.dev/) + TypeScript,無框架的靜態單頁網站
- 所有條目內容集中於 `src/data/benchmarks.ts` 與 `src/data/concepts.ts`,新增條目只需增加資料即可
- 內建即時搜尋、側欄目錄導覽、響應式(手機/桌機)版面

## 資料來源

內容整理自 Artificial Analysis 的公開評測方法論(2026 年,Intelligence Index v4.1.1)。各 benchmark 權利屬原開發團隊;最新分數請以原網站為準。
