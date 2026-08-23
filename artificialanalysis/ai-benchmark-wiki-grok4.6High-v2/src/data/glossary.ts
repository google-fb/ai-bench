export type GlossaryTerm = {
  term: string;
  english?: string;
  definition: string;
  example?: string;
};

export const glossary: GlossaryTerm[] = [
  {
    term: "基準測試／評測",
    english: "Benchmark",
    definition:
      "一套固定規則的考試，用來比較不同 AI。好的評測要題目穩定、計分清楚、盡量不讓模型事先背過答案。",
    example: "GPQA Diamond 就是一場 198 題的科學選擇考。",
  },
  {
    term: "測試集",
    english: "Test set",
    definition:
      "真正拿來打分數的那批題目。訓練時不該看過，否則像考前偷看到考卷。",
    example: "SciCode 的測試集有 288 個子問題。",
  },
  {
    term: "pass@1",
    definition:
      "第一次嘗試就要對的比例。若同一題重複考 k 次，就把所有次數加起來平均。這是 AA 最常用的計分。",
    example: "10 題各考 1 次對 7 題 = 70%。",
  },
  {
    term: "pass@k 與 pass^k",
    definition:
      "pass@k 是 k 次裡至少對一次的比例，看「天花板」。pass^k 是 k 次全對的比例，看「穩不穩」。AA-AnalystAgent 頭條用更嚴的 pass^5。",
  },
  {
    term: "Elo",
    definition:
      "來自棋類的相對分數。不看絕對對錯，而看「盲比時比較常贏誰」。GDPval 與 AA-Briefcase 用這種方法，因為簡報好不好很難用唯一標準答案打勾。",
    example: "人類專家錨在 1000。1200 代表評審常覺得它比專家成品更好。",
  },
  {
    term: "代理人",
    english: "Agent",
    definition:
      "不只回一句話，還會規劃、呼叫工具、讀寫檔案、多步把任務做完的 AI。",
    example: "在 Terminal-Bench 裡，代理人要自己在 Linux 終端機下指令。",
  },
  {
    term: "工具使用",
    english: "Tool use",
    definition:
      "模型可以呼叫搜尋、執行程式、讀網頁、操作 API。有工具的考試比較像真實助理，也比較難只靠背誦過關。",
  },
  {
    term: "沙盒",
    english: "Sandbox",
    definition:
      "隔離的小電腦環境。考完就丟，避免模型弄壞真實系統，也能保證大家用同一套軟體。",
  },
  {
    term: "LLM 評審",
    english: "LLM-as-judge",
    definition:
      "用另一個語言模型當閱卷老師，判斷兩個答案是否等價，或哪一份報告比較好。省人力，但可能偏愛某個寫作風格，所以重要考試會用評審團。",
  },
  {
    term: "平等檢查",
    english: "Equality checker",
    definition:
      "一種 LLM 評審，只問「意思一不一樣」，不管句子怎麼寫。HLE 與 AA-LCR 用這個。",
  },
  {
    term: "幻覺",
    english: "Hallucination",
    definition:
      "把編造的內容講得很有自信。AA-Omniscience 會特別扣這種行為。",
  },
  {
    term: "污染／洩題",
    english: "Contamination",
    definition:
      "考卷進了訓練資料，模型其實是在背題。LiveCodeBench 用新題、有些基準用私有集，就是在降低這件事。",
  },
  {
    term: "零樣本",
    english: "Zero-shot",
    definition:
      "不給示範題，只給說明就開考。比較接近你第一次看到新題型。",
  },
  {
    term: "溫度",
    english: "Temperature",
    definition:
      "控制輸出隨機程度的旋鈕。0 比較死板穩定；高一點比較會探索。AA 對非推理模型常用 0，推理模型常用 0.6。",
  },
  {
    term: "Token",
    definition:
      "模型切字的單位，英文常是一個詞的一截，中文常接近一個字或詞。100k tokens 大約是一本中篇報告的長度。",
  },
  {
    term: "上下文視窗",
    english: "Context window",
    definition:
      "模型一次能「看見」的最長輸入。視窗很大不代表它真的會用到中間內容，所以才有長文推理考。",
  },
  {
    term: "防護欄",
    english: "Guardrail",
    definition:
      "不能做的事，例如洩漏薪資或亂改權限。AutomationBench 踩到就整題 0 分。",
  },
  {
    term: "飽和",
    english: "Saturation",
    definition:
      "大家都考接近滿分，這張考卷就分不出誰強誰弱。IFBench、MATH-500、MMLU-Pro 都曾因此離開智力指數。",
  },
];
