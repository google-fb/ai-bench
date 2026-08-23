# AI Benchmark 入門 Wiki

一個以繁體中文整理的 AI benchmark 教學網站，將 Artificial Analysis 的 evaluations 內容轉譯成高中生容易理解的入門導覽。

## 內容

- 用「AI 也要考試」的比喻介紹 benchmark 與測試集
- 以可篩選、可搜尋的卡片整理知識推理、程式、多模態、長文件與 Agent 任務
- 說明 Accuracy、Pass rate、Elo、Judge 等常見分數
- 用四步驟解釋一場 AI 評測如何設計、執行與比較
- 提醒不同 benchmark 的分數與測試條件不能直接混用
- 支援桌面與手機版排版，含行動版導覽選單

## 本機執行

需要 Node.js 18+。

```bash
npm install
npm run dev
```

開啟終端機顯示的網址（預設為 `http://localhost:4177`）。

建立正式版：

```bash
npm run build
```

## 資料來源

內容參考 [Artificial Analysis — AI Model Evaluations](https://artificialanalysis.ai/evaluations)，benchmark 名稱與內容可能隨來源版本更新。本網站為教育用途的繁體中文整理。
