# AI 評測學生 Wiki

用繁體中文介紹 [Artificial Analysis Evaluations](https://artificialanalysis.ai/evaluations) 上的 AI benchmark，給高中生讀懂：

- 這個評測**測什麼**
- **分數**代表什麼（pass@1、Elo、pass^5、開放指數……）
- **測試集**是什麼、有幾題
- **怎麼測**、重複幾次、能不能用工具
- **方法**怎麼批改（規則、執行測試、資料庫狀態、LLM 評審）

內容依官方公開方法翻譯改寫，並加上課堂比喻；這不是 Artificial Analysis 的官方中文版。

## 本機執行

需要 Node.js 20+。

```bash
npm install
npm run dev
```

瀏覽器打開 [http://127.0.0.1:43127](http://127.0.0.1:43127)。

```bash
npm run build
npm start
```

## 網站怎麼逛

| 路徑 | 內容 |
| --- | --- |
| `/` | 這座 Wiki 的入口與分類 |
| `/start` | 評測、測試集、分數、方法的基礎課 |
| `/index` | 智力指數 v4.1.1 九項加權 |
| `/catalog` | 全部 28 項評測，可搜尋、依分類篩選 |
| `/benchmark/[slug]` | 單一評測的完整條目 |
| `/glossary` | 專有名詞 |
| `/sources` | 原站與方法論文 |

## 技術

Next.js、TypeScript、Tailwind CSS、shadcn/ui。評測內容寫在 `src/data/benchmarks.ts`。
