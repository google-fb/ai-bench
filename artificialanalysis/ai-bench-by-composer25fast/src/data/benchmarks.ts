import type { Benchmark } from "@/types/benchmark";

export const benchmarks: Benchmark[] = [
  {
    slug: "artificial-analysis-intelligence-index",
    nameZh: "AA 智慧指數 v4.1.1",
    nameEn: "Artificial Analysis Intelligence Index v4.1.1",
    category: "composite",
    summary:
      "把九項困難測試合併成一個總分，用來衡量 AI 在數學、科學、程式與推理上的整體能力。",
    whatIsIt:
      "想像你要評估一位學生的「全科能力」，不會只看數學或英文一科，而是把多科成績加權平均。AA 智慧指數就是 AI 界的「全科成績單」，整合了 Humanity's Last Exam、GPQA、MMLU-Pro 等九項高難度測試，給出一個 0–100 左右的綜合分數。",
    testSet:
      "不是單一題庫，而是九個子測試的加權組合，涵蓋學術知識、科學推理、程式能力與數學競賽等面向。每個子測試都有自己的題目與權重。",
    howToTest:
      "Artificial Analysis 會讓每個 AI 模型分別跑完九項子測試，再依各測試的權重計算加權平均分。測試過程由同一機構獨立執行，確保各家模型在相同條件下比較。",
    scoring:
      "分數大約在 0–100 之間，越高代表綜合能力越強。這不是「答對百分比」，而是多項測試加權後的指數。目前頂尖模型約在 60 分左右，代表這些測試整體非常困難。",
    method:
      "採用加權平均法：每個子測試先算出該測試的分數，再乘以對應權重後加總。權重設計反映各能力面向對「通用智慧」的重要程度。",
    scoreType: "index",
    tips: "看單一測試分數能了解 AI 的強項；看智慧指數則能了解整體水準。",
    sourceUrl:
      "https://artificialanalysis.ai/evaluations/artificial-analysis-intelligence-index",
  },
  {
    slug: "artificial-analysis-openness-index",
    nameZh: "AA 開放性指數",
    nameEn: "Artificial Analysis Openness Index",
    category: "composite",
    summary:
      "衡量 AI 模型有多「開放」——是否公開權重、訓練資料、程式碼等，方便開發者與研究者使用。",
    whatIsIt:
      "有些 AI 像「黑盒子」，你只能使用、卻不知道裡面怎麼做的；有些則會公開模型權重、訓練方法或授權條款。開放性指數就像一份「透明度報告」，幫助大家比較不同模型的開放程度。",
    testSet:
      "評估項目涵蓋：是否公開模型權重、訓練資料說明、程式碼、使用授權、API 文件等面向，不是傳統的「考題」，而是一張檢核清單。",
    howToTest:
      "研究人員根據各模型公開的資訊，逐項檢查是否符合開放標準，再計算綜合分數。",
    scoring:
      "分數越高，代表模型越開放、越適合需要自行部署或研究的用途。分數低不代表模型不聰明，只代表資訊較不公開。",
    method:
      "採用標準化評分表，對多個開放性維度打分後加總，形成可比較的產業標準。",
    scoreType: "index",
    tips: "如果你要做學校專題或想自己改模型，開放性高的模型通常比較適合。",
    sourceUrl:
      "https://artificialanalysis.ai/evaluations/artificial-analysis-openness-index",
  },
  {
    slug: "aa-briefcase",
    nameZh: "AA-Briefcase：知識工作代理測試",
    nameEn: "AA-Briefcase: Agentic Knowledge Work Benchmark",
    category: "agentic",
    summary:
      "測試 AI 能否像上班族一樣，完成需要製作試算表、簡報、備忘錄等真實知識工作。",
    whatIsIt:
      "這不是選擇題考試，而是給 AI 一個真實的工作任務，例如「根據這份資料做一份週報簡報」。AI 必須在較長的時間內規劃、執行多個步驟，最後交出像樣的成果檔案。",
    testSet:
      "由 Artificial Analysis 自行開發的私有測試集，模擬商業環境中的知識工作流程，任務需要產出實際可交付的文件或檔案。",
    howToTest:
      "AI 代理會收到任務說明與相關資料，在模擬工作環境中操作工具、撰寫內容，最後提交成果。評分者會檢查成果是否達到任務要求。",
    scoring:
      "依任務完成度評分，看 AI 是否正確理解需求、產出品質如何、是否遺漏重要步驟。",
    method:
      "長期任務（long-horizon）評估：允許 AI 多輪操作，模擬真實工作中需要反覆修改、整合資訊的情況。",
    scoreType: "completion",
    tips: "這類測試更接近「AI 能不能當實習生」，而不只是「AI 能不能答題」。",
    sourceUrl: "https://artificialanalysis.ai/evaluations/aa-briefcase",
  },
  {
    slug: "gdpval-aa-v2",
    nameZh: "GDPval-AA v2",
    nameEn: "GDPval-AA v2 Leaderboard",
    category: "agentic",
    summary:
      "用 OpenAI 的 GDPval 資料集，測試 AI 能否完成 44 種職業、9 大產業中的真實工作任務。",
    whatIsIt:
      "GDPval 的任務來自真實經濟活動，例如零售店主管要製作每日工作清單、金融分析師要整理報表。AI 會獲得終端機與網頁瀏覽能力，像真人一樣在電腦上完成工作。",
    testSet:
      "涵蓋 44 種職業、9 大產業的任務，每個任務都有明確的工作說明與預期交付成果，部分任務附有參考文件。",
    howToTest:
      "AI 在代理迴圈（agentic loop）中執行任務，可使用 shell 指令與網頁瀏覽。完成後，系統會將不同模型的成果進行「盲測」兩兩比較。",
    scoring:
      "使用 Elo 評分系統（類似棋類排名）：兩個模型的成果放在一起，由評審（或評分系統）判斷哪個更好，贏家 Elo 分數上升。分數越高，代表在真實工作任務上表現越好。",
    method:
      "盲測成對比較（blind pairwise comparison）：評分時不知道是哪個模型的作品，減少偏見，讓排名更公平。",
    scoreType: "elo",
    tips: "Elo 分沒有上限，重點是看模型之間的相對強弱，就像網球或電競排名。",
    sourceUrl: "https://artificialanalysis.ai/evaluations/gdpval-aa-v2",
  },
  {
    slug: "apex-agents-aa",
    nameZh: "APEX-Agents-AA",
    nameEn: "APEX-Agents-AA Benchmark Leaderboard",
    category: "agentic",
    summary:
      "測試 AI 代理能否在專業服務環境中，跨多個應用程式完成長期、複雜的任務。",
    whatIsIt:
      "現實工作中，你可能要在 Word 寫文件、在 Excel 算數據、在郵件系統發信——APEX-Agents 就是測試 AI 能不能像專業人士一樣，在多個軟體之間切換、協作完成任務。",
    testSet:
      "基於 APEX-Agents 基準測試，任務模擬專業服務（如顧問、會計）的工作流程，包含跨應用程式的操作情境。",
    howToTest:
      "AI 代理在模擬的專業軟體環境中執行任務，需要規劃步驟、使用工具、處理中間結果，最終完成指定交付物。",
    scoring:
      "依任務目標達成程度評分，包括正確性、完整性與是否遵守工作流程規範。",
    method:
      "長期跨應用任務評估，強調 AI 在真實工具鏈中的執行能力，而非單純文字回答。",
    scoreType: "completion",
    sourceUrl: "https://artificialanalysis.ai/evaluations/apex-agents-aa",
  },
  {
    slug: "aa-analyst-agent",
    nameZh: "AA-AnalystAgent 資料分析測試",
    nameEn: "AA-AnalystAgent Benchmark Leaderboard",
    category: "agentic",
    summary:
      "測試 AI 能否像商業分析師或資料分析師一樣，用試算表和文件回答量化問題。",
    whatIsIt:
      "商業分析師每天面對的是一堆 Excel 和報告，要從中找出趨勢、計算指標、回答老闆的問題。這個測試就是讓 AI 做同樣的事。",
    testSet:
      "包含試算表、商業文件等資料，以及分析師日常會遇到的量化問題，例如「上季各區域銷售額成長率是多少？」",
    howToTest:
      "AI 需要讀取提供的資料檔案，進行計算與分析，最後給出準確的數字或結論。",
    scoring:
      "答案的正確性為主，也會考量分析過程是否合理、是否遺漏重要資料。",
    method:
      "代理式資料分析：AI 可操作試算表工具、執行計算，模擬真實分析工作流程。",
    scoreType: "percentage",
    sourceUrl: "https://artificialanalysis.ai/evaluations/aa-analyst-agent",
  },
  {
    slug: "automationbench-aa",
    nameZh: "AutomationBench-AA：SaaS 工作流程測試",
    nameEn: "AutomationBench-AA: Agentic SaaS Workflow Benchmark",
    category: "agentic",
    summary:
      "在模擬的 SaaS 軟體環境中，測試 AI 能否完成自動化工作流程任務。",
    whatIsIt:
      "SaaS（軟體即服務）是我們常用的雲端工具，如 CRM、專案管理系統。這個測試看 AI 能不能在這類介面中，正確完成「建立客戶紀錄」「更新任務狀態」等操作。",
    testSet:
      "模擬多種 SaaS 應用環境，每個任務有多個子目標，AI 需要逐步完成且不能違反安全規則（guardrail）。",
    howToTest:
      "AI 在模擬介面中操作，系統記錄完成了多少子目標，以及是否有違規行為。",
    scoring:
      "分數 = 完成的任務目標比例。例如任務有 5 個步驟，完成 4 個就得 80%。若有違反安全規則，可能扣分或判失敗。",
    method:
      "目標完成率評分，同時監控 guardrail violations（例如刪除不該刪的資料）。",
    scoreType: "completion",
    sourceUrl: "https://artificialanalysis.ai/evaluations/automationbench-aa",
  },
  {
    slug: "harvey-lab-aa",
    nameZh: "Harvey LAB-AA 法律代理測試",
    nameEn: "Harvey LAB-AA Benchmark Leaderboard",
    category: "professional",
    summary:
      "測試 AI 能否完成真實法律工作，如撰寫法律備忘錄、整理開示文件、摘要證詞。",
    whatIsIt:
      "法律工作不是背法條而已，還要閱讀大量案件文件、整理重點、寫出專業文書。LAB（Legal Agent Benchmark）讓 AI 在沙盒中閱讀案件資料，產出法律交付物。",
    testSet:
      "來自 Harvey 資料集的 120 項私有任務，涵蓋 24 個法律實務領域，每項任務都有明確的評分標準（rubric）。",
    howToTest:
      "AI 閱讀案件文件，在沙盒環境中撰寫法律文書。評分由 LLM 評審依 rubric 逐項檢查。",
    scoring:
      "逐項標準評分：每個交付物有多個評分項目（如「是否正確引用法條」「邏輯是否清楚」），全部加總得出最終分數。",
    method:
      "LLM rubric judge：用另一個 AI 當評審，依預先定義的標準逐項打分，確保評分一致性。",
    scoreType: "percentage",
    tips: "法律測試分數低不代表 AI 不適合一般用途，因為法律專業門檻極高。",
    sourceUrl: "https://artificialanalysis.ai/evaluations/harvey-lab-aa",
  },
  {
    slug: "enterpriseops-gym-aa",
    nameZh: "EnterpriseOps-Gym-AA 企業營運測試",
    nameEn: "EnterpriseOps-Gym-AA Benchmark Leaderboard",
    category: "professional",
    summary:
      "測試 AI 能否透過即時工具操作，完成企業內部的多步驟、有狀態工作流程。",
    whatIsIt:
      "企業營運涉及訂單、庫存、人事等多個系統，且操作會改變資料庫狀態（例如下單後庫存要減少）。這個測試看 AI 能否正確完成這類連鎖操作。",
    testSet:
      "基於 ServiceNow 的 EnterpriseOps-Gym，涵蓋 8 個商業領域的有狀態工作流程任務。",
    howToTest:
      "AI 透過 live tool use（即時工具呼叫）操作企業系統，完成多步驟任務後，檢查底層資料庫的最終狀態是否正確。",
    scoring:
      "以資料庫最終狀態為準：不管過程如何，最後系統資料是否達到預期結果。這比「答對一題」更接近真實系統操作。",
    method:
      "狀態導向評分（state-based grading）：評估的是系統最終狀態，而非單一文字答案。",
    scoreType: "percentage",
    sourceUrl:
      "https://artificialanalysis.ai/evaluations/enterpriseops-gym-aa",
  },
  {
    slug: "tau3-banking",
    nameZh: "τ³-Banking 金融科技客服測試",
    nameEn: "τ³-Banking Benchmark Leaderboard",
    category: "professional",
    summary:
      "測試 AI 能否在銀行客服情境中，查閱知識庫並執行多步驟工具操作來解決客戶問題。",
    whatIsIt:
      "銀行客服要處理「推薦信用卡」「查詢帳戶」等問題，需要查公司規章、呼叫後台系統。τ³-Banking 模擬這種需要知識檢索 + 工具操作的複合任務。",
    testSet:
      "來自 τ-Knowledge 框架的金融科技客服情境，包含大型非結構化知識庫與多步驟銀行業務流程。",
    howToTest:
      "AI 扮演客服代理，需先從知識庫找到正確資訊，再透過工具呼叫完成客戶請求。",
    scoring:
      "依任務是否正確完成評分，包括是否給出正確建議、是否正確執行後台操作。",
    method:
      "知識檢索 + 工具呼叫的複合評估，模擬真實客服 AI 的工作模式。",
    scoreType: "percentage",
    sourceUrl: "https://artificialanalysis.ai/evaluations/tau3-banking",
  },
  {
    slug: "terminal-bench-v2-1",
    nameZh: "Terminal-Bench v2.1",
    nameEn: "Terminal-Bench v2.1 Benchmark Leaderboard",
    category: "coding",
    summary:
      "在終端機環境中測試 AI 的軟體工程、系統管理、資料處理、模型訓練與資安能力。",
    whatIsIt:
      "程式設計師常在終端機（命令列）工作。Terminal-Bench 給 AI 一個 Linux 環境和任務說明，看它能不能用指令完成工作，例如修 bug、設定伺服器、處理資料。",
    testSet:
      "89 項精選任務，涵蓋軟體工程、系統管理、資料處理、模型訓練、資安五大類。v2.1 修正了環境與題目描述問題，讓分數更能反映 AI 真實能力。",
    howToTest:
      "AI 在隔離的終端機環境中執行指令，系統會自動檢查任務是否完成（例如檔案是否產生、程式是否通過測試）。",
    scoring:
      "通過率：完成任務數 ÷ 總任務數。每個任務有明確的成功條件，通常由自動化腳本判定。",
    method:
      "自動化驗證：任務完成後執行測試腳本，客觀判定對錯，減少人為主觀評分。",
    scoreType: "percentage",
    sourceUrl:
      "https://artificialanalysis.ai/evaluations/terminal-bench-v2-1",
  },
  {
    slug: "long-context-reasoning",
    nameZh: "AA 長文本推理測試",
    nameEn: "Artificial Analysis Long Context Reasoning Benchmark",
    category: "specialized",
    summary:
      "測試 AI 能否從 1 萬到 10 萬字元的長文件中，提取、推理並綜合資訊。",
    whatIsIt:
      "有時候重要資訊散落在一本很長的報告裡，你要從頭讀到尾、交叉比對才能回答問題。這個測試就是考 AI 的「長文閱讀理解 + 推理」能力。",
    testSet:
      "包含 10,000 到 100,000 tokens（約數萬到數十萬字元）的長文件，以及需要跨段落推理的問題。",
    howToTest:
      "將長文件與問題一起餵給 AI，AI 需要從大量文字中找到相關資訊、進行推理，給出正確答案。",
    scoring:
      "答案正確率。由於文件很長，AI 容易漏看或誤解，因此分數通常比短問答測試低。",
    method:
      "長上下文問答評估，使用 cl100k_base tokenizer 計算 token 長度，確保測試長度標準一致。",
    scoreType: "percentage",
    tips: "token 是 AI 處理文字的基本單位，大約 1 個中文字 ≈ 1–2 個 token。",
    sourceUrl:
      "https://artificialanalysis.ai/evaluations/long-context-reasoning",
  },
  {
    slug: "aa-omniscience",
    nameZh: "AA-Omniscience：知識與幻覺測試",
    nameEn: "AA-Omniscience: Knowledge and Hallucination Benchmark",
    category: "specialized",
    summary:
      "測試 AI 能否正確回憶事實，以及會不會「胡說八道」（幻覺）。",
    whatIsIt:
      "AI 有時會自信地說出錯誤資訊，這叫做「幻覺」（hallucination）。Omniscience 測試 AI 在經濟相關領域的事實記憶是否準確，以及面對不確定問題時會不會亂編答案。",
    testSet:
      "涵蓋多個與經濟、商業相關的知識領域，包含可驗證的事實問題，以及用來偵測幻覺的陷阱題。",
    howToTest:
      "AI 回答事實性問題，系統比對標準答案。對於應該回答「不知道」的問題，若 AI 硬編故事就算幻覺。",
    scoring:
      "同時衡量「正確回憶率」與「幻覺率」。理想情況是：該答對的答對，不確定的要誠實說不知道。",
    method:
      "事實查核 + 幻覺偵測的雙重評估，幫助了解 AI 的可信度。",
    scoreType: "percentage",
    tips: "分數高不代表 AI 永遠正確，使用 AI 時仍要查證重要資訊。",
    sourceUrl: "https://artificialanalysis.ai/evaluations/aa-omniscience",
  },
  {
    slug: "scicode",
    nameZh: "SciCode 科學程式測試",
    nameEn: "SciCode Benchmark Leaderboard",
    category: "coding",
    summary:
      "由科學家設計的程式測試，涵蓋 16 個科學領域的 80 個實驗室問題。",
    whatIsIt:
      "科學研究常需要寫程式模擬實驗、分析數據。SciCode 的題目來自真實實驗室問題，例如物理模擬、生物資料處理，比一般的「寫排序演算法」更貼近科研。",
    testSet:
      "288 個測試子問題，來自 80 個實驗室問題，橫跨 16 個科學學科（物理、化學、生物、地質等）。",
    howToTest:
      "AI 根據科學問題描述撰寫程式，系統用自動測試檢查程式輸出是否正確。",
    scoring:
      "通過的自動測試比例。每個子問題有明確的輸入輸出標準，由測試框架客觀判定。",
    method:
      "科學家出題 + 自動化單元測試，確保題目品質與評分客觀性。",
    scoreType: "percentage",
    sourceUrl: "https://artificialanalysis.ai/evaluations/scicode",
  },
  {
    slug: "humanitys-last-exam",
    nameZh: "人類最後考試（HLE）",
    nameEn: "Humanity's Last Exam Benchmark",
    category: "knowledge",
    summary:
      "由 1000 多位專家共同出題的 2,500 道前沿學術題，被設計為「最後的封閉式學術測驗」。",
    whatIsIt:
      "當 AI 在一般考試上已能拿 90% 以上，我們需要更難的題目來分辨誰更強。HLE 的題目由全球專家出題，設計成「Google 也搜不到答案」，必須真正理解才能解。",
    testSet:
      "2,500 道專家審核的題目，涵蓋數學、人文、自然科學等。Artificial Analysis 評測其中 2,158 道純文字題（排除多模態題以公平比較）。",
    howToTest:
      "每題只給 AI 一次作答機會（pass@1），答案由 LLM 評分器與標準答案比對（數字題允許小誤差）。",
    scoring:
      "正確率（%）。頂尖模型目前約 55%，代表即使最強的 AI 也會錯近一半，可見題目極難。",
    method:
      "pass@1 評分：每題只允許一次回答，模擬考試「不能重考」的情境。",
    scoreType: "percentage",
    tips: "55% 聽起來不高，但在這個測試上已是世界頂尖水準。",
    sourceUrl:
      "https://artificialanalysis.ai/evaluations/humanitys-last-exam",
  },
  {
    slug: "critpt",
    nameZh: "CritPt 物理研究推理測試",
    nameEn: "CritPt Benchmark Leaderboard",
    category: "knowledge",
    summary:
      "測試 AI 能否解決研究級別的物理推理問題，共 71 道複合研究挑戰。",
    whatIsIt:
      "這不是高中物理題，而是需要像研究生一樣思考的前沿物理問題。題目由物理研究者設計，測試 AI 的深度推理而非死記公式。",
    testSet:
      "71 道複合研究挑戰題，每題可能整合多個物理概念，需要多步推理。",
    howToTest:
      "AI 閱讀物理問題，進行推理並給出答案，與專家標準答案比對。",
    scoring:
      "答案正確率。由於是研究級難度，整體分數通常較低。",
    method:
      "專家出題 + 標準答案比對，強調推理過程的正確性。",
    scoreType: "percentage",
    sourceUrl: "https://artificialanalysis.ai/evaluations/critpt",
  },
  {
    slug: "gpqa-diamond",
    nameZh: "GPQA Diamond",
    nameEn: "GPQA Diamond Benchmark Leaderboard",
    category: "knowledge",
    summary:
      "GPQA 中最難的 198 道題：博士專家正確率 65%，一般高手即使上網查也只有 34%。",
    whatIsIt:
      "GPQA（Google-Proof Q&A）的題目專門設計成「上網也搜不到」。Diamond 子集是其中最難的 198 題，用來區分真正理解 vs 死記硬背。",
    testSet:
      "198 道高難度科學問題，由領域博士專家出題並驗證。",
    howToTest:
      "AI 回答選擇題或短答題，與專家確認的正確答案比對。",
    scoring:
      "正確率（%）。參考基準：博士專家約 65%，有網路的一般人約 34%，可用來理解分數意義。",
    method:
      "專家出題 + 自動評分，題目經過多輪專家驗證確保品質。",
    scoreType: "percentage",
    tips: "若 AI 分數超過 65%，代表在這類科學推理上已接近博士專家水準。",
    sourceUrl: "https://artificialanalysis.ai/evaluations/gpqa-diamond",
  },
  {
    slug: "itbench-aa",
    nameZh: "ITBench-AA 維運故障診斷測試",
    nameEn: "ITBench-AA Benchmark Leaderboard",
    category: "professional",
    summary:
      "測試 AI 能否像維運工程師一樣，從 Kubernetes 事故快照中找出故障根因。",
    whatIsIt:
      "當網站掛了，維運人員要查看警報、日誌、追蹤紀錄，找出是哪個服務、哪個設定出了問題。ITBench 讓 AI 做同樣的故障排除工作。",
    testSet:
      "基於 IBM ITBench，使用離線事故快照，包含警報、事件、追蹤與拓撲資訊。",
    howToTest:
      "AI 分析事故資料，指出造成故障的實體（如某個 Pod、Deployment、網路政策等）。",
    scoring:
      "是否正確識別出根因實體。部分正確可能得部分分數，視評分標準而定。",
    method:
      "根因分析（Root Cause Analysis）評估，模擬真實 DevOps 故障排除流程。",
    scoreType: "percentage",
    sourceUrl: "https://artificialanalysis.ai/evaluations/itbench-aa",
  },
  {
    slug: "mmmu-pro",
    nameZh: "MMMU-Pro 多模態學科測試",
    nameEn: "MMMU-Pro Benchmark Leaderboard",
    category: "multimodal",
    summary:
      "強化版 MMMU，消除捷徑與猜題策略，更嚴格測試多模態模型在 30 個學科的能力。",
    whatIsIt:
      "MMMU 要求 AI 同時看圖片和讀文字來答題，例如看一張化學結構圖回答問題。Pro 版本修正了可以「矇對」的漏洞，讓分數更能反映真實能力。",
    testSet:
      "涵蓋 30 個學科的多模態題目，每題包含圖片與文字，需要結合兩者才能解答。",
    howToTest:
      "將圖片與問題一起輸入多模態 AI，AI 給出答案後與標準答案比對。",
    scoring:
      "正確率（%）。只有能處理圖片的模型才能參加此測試。",
    method:
      "多模態問答評估，Pro 版加強了題目設計以防止模型用捷徑猜答案。",
    scoreType: "percentage",
    sourceUrl: "https://artificialanalysis.ai/evaluations/mmmu-pro",
  },
  {
    slug: "ifbench",
    nameZh: "IFBench 指令遵循測試",
    nameEn: "IFBench Benchmark Leaderboard",
    category: "specialized",
    summary:
      "測試 AI 能否精確遵守 58 種多樣化的輸出格式與約束條件。",
    whatIsIt:
      "有時候重要的不是 AI 知道什麼，而是它能不能「照規矩來」——例如「用恰好 3 句話回答」「每句話以動詞開頭」「不要用字母 e」。IFBench 就是測這種精確遵循指令的能力。",
    testSet:
      "58 種可自動驗證的約束條件，涵蓋格式、長度、用詞等多種要求，且刻意設計成模型訓練時沒見過的類型（out-of-domain）。",
    howToTest:
      "給 AI 帶有特定約束的指令，用程式自動檢查輸出是否完全符合所有條件。",
    scoring:
      "完全遵守所有約束的題目比例。一個條件沒滿足就算錯，標準很嚴格。",
    method:
      "可驗證約束的自動評分，確保客觀且可重現。",
    scoreType: "percentage",
    tips: "這測的是「聽話程度」，跟知識多寡是不同維度的能力。",
    sourceUrl: "https://artificialanalysis.ai/evaluations/ifbench",
  },
  {
    slug: "terminal-bench-hard",
    nameZh: "Terminal-Bench Hard",
    nameEn: "Terminal-Bench Hard Benchmark Leaderboard",
    category: "coding",
    summary:
      "終端機環境中的高難度代理測試，涵蓋軟體工程、系統管理與資料處理。",
    whatIsIt:
      "這是 Terminal-Bench 的困難版本，任務更複雜、需要更多步驟與更深入的技能。適合測試 AI 在真實開發環境中的極限能力。",
    testSet:
      "精選的高難度終端機任務，需要 AI 具備較強的程式設計與系統管理能力。",
    howToTest:
      "AI 在終端機環境中自主完成任務，系統自動驗證結果。",
    scoring:
      "任務完成率，與 Terminal-Bench v2.1 類似但題目更難，分數通常較低。",
    method:
      "自動化環境驗證，確保評分客觀。",
    scoreType: "percentage",
    sourceUrl:
      "https://artificialanalysis.ai/evaluations/terminal-bench-hard",
  },
  {
    slug: "tau2-bench-telecom",
    nameZh: "τ²-Bench 電信客服測試",
    nameEn: "τ²-Bench Telecom Benchmark Leaderboard",
    category: "agentic",
    summary:
      "雙方協作式對話測試：AI 客服與模擬用戶必須配合行動，才能解決電信服務問題。",
    whatIsIt:
      "真實客服不是單方面回答問題，而是要和客戶來回溝通、請客戶配合操作（例如「請您重開機」）。τ²-Bench 模擬這種雙向協作的客服情境。",
    testSet:
      "電信技術支援情境，包含需要用戶配合的操作步驟，AI 與模擬用戶需協調完成。",
    howToTest:
      "AI 扮演客服，與另一個 AI 扮演的用戶對話，雙方需配合完成故障排除等任務。",
    scoring:
      "問題是否成功解決，以及對話過程是否有效率、有禮貌。",
    method:
      "雙控制（dual-control）對話評估，同時測試 AI 的溝通與問題解決能力。",
    scoreType: "percentage",
    sourceUrl:
      "https://artificialanalysis.ai/evaluations/tau2-bench-telecom",
  },
  {
    slug: "mmlu-pro",
    nameZh: "MMLU-Pro 多領域語言理解測試",
    nameEn: "MMLU-Pro Benchmark Leaderboard",
    category: "knowledge",
    summary:
      "MMLU 的強化版：12,000 道研究生程度選擇題，10 個選項，更重視推理而非死記。",
    whatIsIt:
      "MMLU 是最知名的 AI 知識測試之一，但近年頂尖模型分數太高（>90%），難以區分。MMLU-Pro 增加題目難度、選項從 4 個變 10 個，並移除太簡單或有噪音的題目。",
    testSet:
      "12,000 道研究生程度選擇題，涵蓋 14 個學科領域，每題 10 個選項（A–J）。",
    howToTest:
      "AI 閱讀問題與選項，選出最佳答案。研究發現「逐步推理」（Chain of Thought）在 MMLU-Pro 上特別有效。",
    scoring:
      "正確率（%）。相較 MMLU，各模型分數普遍下降 16–33 個百分點，更能拉開差距。",
    method:
      "多選題自動評分。MMLU-Pro 對不同提示方式的敏感度較低（約 2%），結果更穩定。",
    scoreType: "percentage",
    tips: "這是衡量 AI「學科知識 + 推理」的經典測試，適合快速了解模型廣度。",
    sourceUrl: "https://artificialanalysis.ai/evaluations/mmlu-pro",
  },
  {
    slug: "livecodebench",
    nameZh: "LiveCodeBench 即時程式競賽測試",
    nameEn: "LiveCodeBench Benchmark Leaderboard",
    category: "coding",
    summary:
      "持續從 LeetCode、AtCoder、CodeForces 收集最新競賽題，避免 AI「背答案」。",
    whatIsIt:
      "若測試題目在 AI 訓練資料中出現過，分數會失真（稱為「資料污染」）。LiveCodeBench 持續收錄最新競賽題，確保 AI 沒見過這些題目。",
    testSet:
      "持續更新的競賽程式題，來自 LeetCode、AtCoder、CodeForces 等平台。",
    howToTest:
      "AI 根據題目撰寫程式，系統用隱藏測資執行並檢查是否通過。也評估自我修復（寫錯後能否改正）能力。",
    scoring:
      "通過測資的題目比例。程式必須在時間與記憶體限制內正確執行。",
    method:
      "動態題庫 + 自動化執行評測，確保無資料污染且評分客觀。",
    scoreType: "percentage",
    tips: "這是衡量 AI「寫程式解題」能力的可靠指標，因為題目永遠是新的。",
    sourceUrl: "https://artificialanalysis.ai/evaluations/livecodebench",
  },
  {
    slug: "math-500",
    nameZh: "MATH-500 數學競賽測試",
    nameEn: "MATH-500 Benchmark Leaderboard",
    category: "math",
    summary:
      "從 MATH 資料集挑選的 500 道競賽級數學題，涵蓋代數、幾何、數論等六大領域。",
    whatIsIt:
      "MATH 資料集收錄美國高中數學競賽（如 AMC）風格的題目。MATH-500 是其中精選的 500 題子集，用來快速評估 AI 的數學推理能力。",
    testSet:
      "500 道競賽級數學題，涵蓋代數、幾何、數論、機率、微積分前置、綜合等六大類。",
    howToTest:
      "AI 閱讀數學問題，進行推理並給出最終數值或表達式答案。",
    scoring:
      "答案正確率。通常需要 AI 進行多步推理，不是簡單代入公式。",
    method:
      "標準答案比對，數學題允許等價形式（如 1/2 與 0.5）。",
    scoreType: "percentage",
    sourceUrl: "https://artificialanalysis.ai/evaluations/math-500",
  },
  {
    slug: "aime-2025",
    nameZh: "AIME 2025 美國數學邀請賽",
    nameEn: "AIME 2025 Benchmark Leaderboard",
    category: "math",
    summary:
      "2025 年美國數學邀請賽全部 30 題，奧林匹亞等級，答案為 000–999 的整數。",
    whatIsIt:
      "AIME 是美國數學奧林匹亞選拔賽的重要關卡，題目難度遠超一般高中數學。能解 AIME 題代表 AI 具備很強的數學競賽推理能力。",
    testSet:
      "2025 年 AIME 全部 30 道題，每題答案為 000 到 999 之間的整數。",
    howToTest:
      "AI 進行奧林匹亞級推理，給出整數答案，與標準答案比對。",
    scoring:
      "正確題數 ÷ 30。頂尖模型通常只能解出部分題目，可見難度極高。",
    method:
      "整數答案精確比對，不允許誤差。",
    scoreType: "percentage",
    tips: "AIME 是數學 AI 能力的「試金石」，分數提升往往代表推理能力重大突破。",
    sourceUrl: "https://artificialanalysis.ai/evaluations/aime-2025",
  },
  {
    slug: "global-mmlu-lite",
    nameZh: "Global-MMLU-Lite 多語言測試",
    nameEn: "Global-MMLU-Lite Benchmark Leaderboard",
    category: "knowledge",
    summary:
      "輕量版多語言 MMLU，評估 AI 在不同語言與文化背景下的知識與推理能力。",
    whatIsIt:
      "大部分 AI 測試只用英文，但 AI 要在全球使用，必須懂多種語言。Global-MMLU-Lite 用多種語言出題，測試 AI 是否具備跨語言的知識與推理能力。",
    testSet:
      "多語言版本的 MMLU 精簡題庫，涵蓋多種語言與文化情境。",
    howToTest:
      "以不同語言呈現問題，AI 用對應語言回答，與標準答案比對。",
    scoring:
      "各語言的正確率，也可看整體平均。幫助了解 AI 是否「只會英文」還是 truly multilingual。",
    method:
      "多語言平行評測，確保題目在不同語言間語意等價。",
    scoreType: "percentage",
    sourceUrl:
      "https://artificialanalysis.ai/evaluations/global-mmlu-lite",
  },
  {
    slug: "mlcr-aa",
    nameZh: "MLCR-AA 醫療長文本推理測試",
    nameEn: "Medical Long Context Reasoning (MLCR-AA)",
    category: "professional",
    summary:
      "測試 AI 能否閱讀零散、冗長的醫療紀錄，像保險審核員一樣做跨文件綜合判斷。",
    whatIsIt:
      "醫療審核員要閱讀病患的多份病歷、檢查報告、保險文件，從中判斷理賠是否合理。MLCR 測試 AI 能否做這種需要專業知識 + 長文理解的綜合推理。",
    testSet:
      "來自 Wisedocs 的開放基準，Artificial Analysis 使用其中難度最高的私有測試集（專家級與複合型案例）。",
    howToTest:
      "AI 閱讀多份醫療文件，回答需要跨文件推理的問題，由 LLM 評審對照專家標註的答案評分。",
    scoring:
      "準確性與完整性兩個維度，由 LLM 評審依專家標準打分。",
    method:
      "專家標註 + LLM 評審的混合評分，兼顧專業性與可擴展性。",
    scoreType: "percentage",
    tips: "醫療 AI 分數僅供研究參考，實際醫療決策仍需專業醫師把關。",
    sourceUrl: "https://artificialanalysis.ai/evaluations/mlcr-aa",
  },
];

export function getBenchmarkBySlug(slug: string): Benchmark | undefined {
  return benchmarks.find((b) => b.slug === slug);
}

export function getBenchmarksByCategory(category: string): Benchmark[] {
  return benchmarks.filter((b) => b.category === category);
}
