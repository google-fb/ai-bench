import type { GlossaryTerm } from "./types";

export const GLOSSARY: GlossaryTerm[] = [
  {
    term: "基準測試 / Benchmark",
    english: "Benchmark",
    definition:
      "一套固定的考題、規則與計分方式，用來比較不同 AI 模型。有點像全國學測：題目一樣、時間規則一樣，分數才能互相比。",
    example: "GPQA Diamond 就是一套 198 題的科學選擇題基準測試。",
  },
  {
    term: "測試集",
    english: "Test set",
    definition:
      "真正拿來打分數的題目。理想上模型在訓練時沒看過這些題，否則就像考前偷看考卷。",
    example: "SciCode 的測試集有 288 個子問題，來自 80 道實驗室等級的科學題。",
  },
  {
    term: "訓練資料污染",
    english: "Contamination",
    definition:
      "如果考題早就出現在網路上，模型可能「背過答案」而不是真的會解。新一點、會持續更新的測試集比較能避免這種狀況。",
    example: "LiveCodeBench 會持續抓最新程式競賽題，就是為了減少污染。",
  },
  {
    term: "Pass@1",
    definition:
      "只看「第一次就做對」的比例。考試不能重考、不能改到對才算。若同一題測好幾次，會把所有次數平均起來。",
    example: "10 題裡第一次就對 7 題，pass@1 大約是 70%。",
  },
  {
    term: "Pass^5",
    definition:
      "同一題做 5 次，必須 5 次全對才算過關。比 pass@1 嚴格很多，用來檢查「穩不穩」，不是「偶爾會不會」。",
    example: "AA-AnalystAgent 用 pass^5，因為資料分析錯一次就可能誤導決策。",
  },
  {
    term: "Elo 分數",
    english: "Elo",
    definition:
      "像圍棋或電競段位。不是「答對幾題」，而是把兩份作業匿名互相比，贏的加分、輸的減分。適合沒有標準答案、只能比誰比較好的任務。",
    example: "GDPval-AA 把人類專家的成品錨在 1000 分，模型再跟它比。",
  },
  {
    term: "智慧代理人",
    english: "Agent",
    definition:
      "不只聊天，還能自己規劃步驟、呼叫工具、讀檔、寫檔、查網，把一件工作做完。像會自己查課本、開試算表、交報告的實習生。",
    example: "Terminal-Bench 裡的模型要在終端機下指令，把整個任務跑完。",
  },
  {
    term: "工具使用",
    english: "Tool use",
    definition:
      "模型可以呼叫搜尋、執行程式、讀資料庫等工具。沒有工具時它只能靠記憶回答；有工具時比較像真人在工作。",
  },
  {
    term: "幻覺",
    english: "Hallucination",
    definition:
      "模型講得頭頭是道，但其實是編出來的。考試時「亂猜」通常比「承認不會」更糟。",
    example: "AA-Omniscience 會扣幻覺分，鼓勵模型在不確定時說不知道。",
  },
  {
    term: "LLM 評審",
    english: "LLM-as-a-judge",
    definition:
      "用另一個 AI 當閱卷老師，判斷開放式答案是否等於標準答案，或兩份報告誰比較好。方便但不是完美，所以重要評測常會用多位評審或程式驗證來互相制衡。",
  },
  {
    term: "零樣本",
    english: "Zero-shot",
    definition:
      "不先給範例，只給清楚的考試說明，看模型能不能自己看懂題目。Artificial Analysis 大多用這種方式，比較接近你平常跟聊天機器人講話。",
  },
  {
    term: "上下文長度",
    english: "Context window",
    definition:
      "模型一次能「看進去」的文字量，常用 token 計算。上下文不夠長，超長文件考題會直接做不了。",
    example: "AA-LCR 每題大約 10 萬 token，模型至少要有 12.8 萬上下文才有機會得分。",
  },
  {
    term: "Token",
    definition:
      "模型讀字的最小單位，大約是英文一個單詞的一部分，或中文的一個字／詞。不是「字數」，但可以想成「模型的閱讀字數」。",
  },
  {
    term: "溫度",
    english: "Temperature",
    definition:
      "控制回答的隨機程度。接近 0 比較穩定、少亂發揮；高一點比較有變化。評測時通常會固定溫度，才不會今天 80 分、明天 60 分。",
  },
  {
    term: "Regex 擷取答案",
    definition:
      "用規則把模型最後寫的「Answer: C」抓出來對答案。選擇題常用，因為標準答案很明確。",
  },
  {
    term: "配對比較",
    english: "Pairwise comparison",
    definition:
      "不打絕對分數，而是把 A、B 兩份成品並排，請評審選比較好的那一份。很多報告、簡報沒有唯一正確答案，就適合這樣比。",
  },
  {
    term: "防護欄",
    english: "Guardrail",
    definition:
      "不能踩的紅線，例如亂刪資料、把不該公開的信件寄出去。有些評測只要踩到紅線，整題直接 0 分。",
    example: "AutomationBench-AA 違反任何防護欄，該任務分數歸零。",
  },
  {
    term: "沙盒",
    english: "Sandbox",
    definition:
      "一個隔離的練習電腦。模型可以在裡面下指令、開檔案，但通常上不了真正的網路，也不會弄壞外面的系統。",
  },
  {
    term: "雙人控制",
    english: "Dual control",
    definition:
      "客服情境裡，AI 客服與「模擬顧客」都要動手。例如客服請你關掉飛航模式，模擬顧客真的去按開關，問題才解得掉。",
  },
  {
    term: "Intelligence Index",
    definition:
      "Artificial Analysis 的綜合智力分數。把 9 項很難的評測依權重平均，用來比較模型的整體能力，不是單一科成績。",
  },
];
