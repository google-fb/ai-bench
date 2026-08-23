import type { Benchmark } from "./types";

export const benchmarks: Benchmark[] = [
  {
    slug: "intelligence-index",
    name: "人工分析智力指數 v4.1.1",
    englishName: "Artificial Analysis Intelligence Index v4.1.1",
    status: "index",
    category: "composite",
    inIndex: true,
    oneLiner: "把九場很難的考試加權平均，變成一張「AI 有多聰明」的總成績單。",
    analogy:
      "像學測總級分：國英數社自各科權重不同，最後合成一個數字方便比較。但它不能告訴你「這個人適不適合當醫生」，只能說整體學業表現大概如何。",
    whatItTests:
      "同時看代理人做事、寫程式、科學推理、一般知識與長文理解。目前版本特別加重「會自己用工具把事情做完」的能力，因為真實世界的 AI 越來越常被拿去當助理，而不只是回答選擇題。",
    scoreMeaning:
      "智力指數是四個大類的加權平均：代理人 34%、程式 24%、科學推理 24%、一般能力 18%。分數越高代表在這九場考試上整體越強。官方估計 95% 信賴區間大約小於 ±1%，意思是重測很多次，總分通常只會差一點點。請記住：這主要是英文、文字為主的考試，看圖、聽語音、多語能力另算。",
    scoreType: "加權平均（0–100 尺度的合成分數）",
    testSet:
      "由九項評測組成：GDPval-AA v2（20%）、Terminal-Bench v2.1（16%）、τ³-Banking（14%）、Humanity's Last Exam（12%）、AA-Omniscience 正確率（8%）與不幻覺率（4%）、SciCode（8%）、GPQA Diamond（6%）、AA-LCR（6%）、CritPt（6%）。",
    howTested:
      "每場考試各自出題、各自計分，再依權重合成。大多數考試用 pass@1（第一次就要對）。同一題可能重複考 1–5 次再平均，減少運氣成分。所有模型用同一套提示詞、溫度與規則，盡量公平。",
    method:
      "四大原則：標準化（條件相同）、不偏心（不因格式小差異就扣分）、零樣本（不給範例，只給清楚指令）、透明（公開方法）。非推理模型溫度通常設 0；推理模型常用 0.6。API 失敗會自動重試最多 30 次。",
    classroomExample:
      "假設小明代理人考試 80、程式 70、科學 60、一般 50。總分 ≈ 0.34×80 + 0.24×70 + 0.24×60 + 0.18×50。代理人權重大，所以「會做事」比「會背知識」更能拉高總分。",
    questions: "九場考試合計數千題／數百項任務",
    repeats: "依各評測為 1–5 次",
    responseType: "混合：選擇、開放作答、程式、代理人交件",
    tools: true,
    misconceptions: [
      "分數 70 不代表「比人類聰明 70%」，只代表在這套考卷上的相對表現。",
      "智力指數高，不代表一定比較會講中文、比較會畫圖，或比較安全。",
      "不能拿 Elo 分數直接跟正確率百分比相加；合成前會先正規化。",
    ],
    sources: [
      {
        label: "Artificial Analysis 智力評測方法",
        href: "https://artificialanalysis.ai/methodology/intelligence-benchmarking/",
      },
      {
        label: "評測總覽",
        href: "https://artificialanalysis.ai/evaluations",
      },
    ],
    related: ["openness-index", "gdpval-aa-v2", "terminal-bench-v21"],
  },
  {
    slug: "openness-index",
    name: "人工分析開放指數",
    englishName: "Artificial Analysis Openness Index",
    status: "standalone",
    category: "composite",
    inIndex: false,
    oneLiner: "不考聰不聰明，改考這個模型「有多開放」：權重能不能下載、資料與方法有沒有公開。",
    analogy:
      "像評估一間補習班：不只看學生分數，還看它願不願意公開講義、題庫與教學流程。有的班成績很好但什麼都不公開；有的班講義全公開，別人也能複製它的教法。",
    whatItTests:
      "兩個面向。可用性：權重能不能自己下載部署、授權能不能商用。透明度：訓練資料、訓練方法、程式碼有沒有講清楚、能不能拿去研究或重做。",
    scoreMeaning:
      "各子項先用 0–3 分的「開放樣板」打分，加總最高 18 分，再換算成 0–100。越高越開放。100 分代表權重開放、授權寬鬆，而且訓練程式與資料幾乎都能重做；目前幾乎沒有模型拿到滿分。封閉大廠模型常常只有個位數到十幾分。",
    scoreType: "0–100 正規化開放分數（原始滿分 18）",
    testSet:
      "不是考卷，而是公開第一手資料：官網、技術報告、授權條款、權重下載頁。若模型是改別人的底模，也會被上游授權限制。版本更新只看這次新發布有沒有新說明。",
    howTested:
      "人工分析團隊依公開資訊對齊樣板打分，不靠模型自己答題。資料分成預訓練與後訓練，兩段先各自計分再平均，避免只公開其中一段就拿滿分。",
    method:
      "可用性最多 6 分（權重取得 + 授權）。透明度最多 12 分（方法揭露與授權、預訓練資料、後訓練資料）。資料兩段平均後，全部相加再 ×(100/18)。",
    classroomExample:
      "假設權重可下載且可商用（6 分），方法講得很完整（6 分），資料只公開來源分類（平均約 2 分），原始分約 14/18，換算大概 78 分：算很開放，但還不能完全重訓。",
    questions: "不適用（文件審查，不是題目）",
    repeats: "不適用",
    responseType: "公開文件與授權審查",
    tools: false,
    misconceptions: [
      "開放指數高 ≠ 比較聰明。有些很開放的模型智力指數其實不高。",
      "有 API 可以用，不代表開放。那只是「你可以租它」，不是「你可以拆開看」。",
      "開源權重也不一定滿分，還要看資料、方法、授權有沒有限制。",
    ],
    sources: [
      {
        label: "開放指數方法",
        href: "https://artificialanalysis.ai/methodology/openness-index",
      },
    ],
    related: ["intelligence-index"],
  },
  {
    slug: "aa-briefcase",
    name: "AA-Briefcase：代理人知識工作",
    englishName: "AA-Briefcase: Agentic Knowledge Work Benchmark",
    status: "standalone",
    category: "agents",
    inIndex: false,
    oneLiner: "讓 AI 當實習生，在多週專案裡做試算表、簡報、備忘錄，看它交不交得出像樣成品。",
    analogy:
      "像連續好幾週的專題：老師每週出一個任務，給你一堆 Slack 紀錄、問卷、PDF。你不能問老師，要自己整理資料、做出指定檔名的成品。",
    whatItTests:
      "長時間、真實商業情境的知識工作：找資料、分析、寫文件、做簡報。不只問「答案對不對」，還看分析深不深、成品漂不專業。",
    scoreMeaning:
      "頭條分數是 Elo：把「評分表通過率」加上「分析品質對打」與「呈現品質對打」合成。Elo 越高代表評審比較常覺得它的成品比較好。另外也有評分表通過率，比較像「有沒有做到必做事項」。",
    scoreType: "Elo + 評分表通過率",
    testSet:
      "91 項任務、4 個情境。每個情境像多週專案，一週 2–5 個任務。資料夾裡混了真實、改寫與合成檔案：郵件、試算表、訪談逐字稿、市場研究等。公開有精簡版 AA-Briefcase-Lite。",
    howTested:
      "每次任務獨立作答（不會沿用自己上週交件）。在沒有網路的沙盒裡，用終端機讀檔、寫檔，最多 500 回合。做完要呼叫 finish 交出指定檔名；真的做不到才能放棄。",
    method:
      "兩種批改：二元評分表（有或沒有，沒有半分）；配對比較（兩個模型的成品比誰分析更好、誰比較專業）。三位前沿模型評審輪流打分，降低「自己人評自己人」的偏誤。",
    classroomExample:
      "任務：根據本週訪談與銷售表，交出 `市場備忘錄.docx`。評分表檢查有沒有引用數據、有沒有結論；另一組評審再拿兩份備忘錄互相比「誰比較像顧問寫的」。",
    questions: "91 任務／4 情境",
    repeats: "1 次",
    responseType: "交出檔案（文件、試算表、簡報）",
    tools: true,
    misconceptions: [
      "這不是聊天考試。講得漂亮但沒交對檔名，等於沒交作業。",
      "沒有網路，不能上網查；只能用老師放進資料夾的檔案。",
    ],
    sources: [
      {
        label: "AA-Briefcase Lite 資料集",
        href: "https://huggingface.co/datasets/ArtificialAnalysis/AA-Briefcase-Lite",
      },
    ],
    related: ["gdpval-aa-v2", "apex-agents-aa", "aa-analyst-agent"],
  },
  {
    slug: "gdpval-aa-v2",
    name: "GDPval-AA v2",
    englishName: "GDPval-AA v2",
    status: "index",
    category: "agents",
    inIndex: true,
    indexWeight: "20%",
    indexCategory: "代理人（34%）",
    oneLiner: "用真實職業任務考 AI：做簡報、寫報告、處理辦公室檔案，再跟人類專家作品對打。",
    analogy:
      "像職業技能競賽。評審不看選擇題，而是把你做的簡報跟資深員工做的放在一起，盲選哪一份比較能交差。",
    whatItTests:
      "對經濟有價值的實務工作，涵蓋美國 44 種職業、9 大產業。模型要自己上網查、寫程式、看圖、產出檔案。這是智力指數權重最高的一項（20%）。",
    scoreMeaning:
      "Elo 分數。人類專家成品錨在 1000 分。比 1000 高，代表評審常覺得它比人類專家交件更好；比 1000 低則相反。納入智力指數時會先凍結並用公式 clamp((Elo-500)/2000) 壓到穩定區間，避免 Elo 飄走讓總分失真。",
    scoreType: "Elo（人類專家 = 1000）",
    testSet:
      "以 OpenAI 公開的 GDPval gold 資料集為基礎，取 220 項任務。部分 Office 檔案修過損壞的中繼資料，方便 LibreOffice 開啟，但內文與版面沒改。",
    howTested:
      "用開源代理人框架 Stirrup，在全新沙盒裡給六個工具：抓網頁、搜尋、看圖、執行程式、完成、放棄。最多 250 回合。先交件，再由三位不同實驗室的前沿模型評審盲比兩份成品。",
    method:
      "配對排名用 Bradley-Terry 模型估 Elo，信賴區間用 sandwich estimator。v2 升級了沙盒套件、改成三人評審團、人類錨點 1000，並允許模型覺得做不到就提前放棄。",
    classroomExample:
      "任務：根據一份銷售 CSV 與品牌規範，做出給主管看的季度簡報。評審不知道哪份是人類、哪份是 AI，只選「哪份比較能拿去開會」。",
    questions: "220 任務",
    repeats: "1 次",
    responseType: "代理人交件（檔案）",
    tools: true,
    misconceptions: [
      "Elo 1200 不是 1200 分滿分，是相對排名。",
      "不能直接跟 80% 正確率比大小。",
      "這是 Artificial Analysis 的實作（GDPval-AA），分數不必等於 OpenAI 原論文數字。",
    ],
    sources: [
      {
        label: "GDPval 論文",
        href: "https://arxiv.org/abs/2510.04374",
      },
      {
        label: "資料集",
        href: "https://huggingface.co/datasets/openai/gdpval",
      },
    ],
    related: ["intelligence-index", "aa-briefcase", "apex-agents-aa"],
  },
  {
    slug: "apex-agents-aa",
    name: "APEX-Agents-AA",
    englishName: "APEX-Agents-AA",
    status: "standalone",
    category: "agents",
    inIndex: false,
    oneLiner: "考 AI 在投行、顧問、法律辦公室裡，跨很多軟體把長任務做完。",
    analogy:
      "像實習第一天：桌上有郵件、試算表、合約資料庫，你要自己找該開哪些軟體、一步步做完，最後交出一份能過主管檢查表的成果。",
    whatItTests:
      "長時間、跨應用的專業服務工作。重點是規劃、找對工具、在真實工作環境裡改檔案，而不是背誦法條或公式。",
    scoreMeaning:
      "pass@1：每次重測只有「評分表每一項都過」才算成功，再把 3 次平均。70% 代表平均十次任務大約七次整份都過關，不是「七成項目有做到」。",
    scoreType: "pass@1（整份評分表全過才算）",
    testSet:
      "公開 APEX-Agents 480 題中評了 452 題（排除兩個有外部相依的投行世界）。涵蓋投資銀行、管理顧問、法律。",
    howTested:
      "Stirrup 代理人最多 200 回合。一開始只有很少的元工具，必須自己列出、檢查、加入 MCP 工具。還有待辦清單，沒勾完不能交卷。",
    method:
      "本地檔案評分器看最終答案與檔案系統前後差異。Gemini 3 Flash（低推理）當評審。工具輸出會被截斷，圖片會壓縮，避免把模型餵爆。",
    classroomExample:
      "任務：從資料室找出三份合約的變更條款，填進指定試算表。少填一格、或待辦沒清完，整次重測就算失敗。",
    questions: "452 任務",
    repeats: "3 次",
    responseType: "代理人交件 + 環境檔案變更",
    tools: true,
    misconceptions: [
      "這是 AA 的獨立實作，分數不要直接跟 Mercor 原榜比。",
      "通過率是「整份全對」，比「平均做到幾成」更嚴。",
    ],
    sources: [
      {
        label: "APEX-Agents 論文",
        href: "https://arxiv.org/abs/2601.14242",
      },
      {
        label: "資料集",
        href: "https://huggingface.co/datasets/mercor/apex-agents",
      },
    ],
    related: ["aa-briefcase", "harvey-lab-aa", "gdpval-aa-v2"],
  },
  {
    slug: "aa-analyst-agent",
    name: "AA-AnalystAgent 分析師代理人",
    englishName: "AA-AnalystAgent",
    status: "standalone",
    category: "agents",
    inIndex: false,
    oneLiner: "讓 AI 當商業／資料分析師：打開試算表與報告，算出一個可靠的數字。",
    analogy:
      "像數學課的應用題，但數字藏在很多 Excel 分頁裡。老師要的是那個數字本身，不要過程作文。而且同一題連考五次，五次都要對才算會。",
    whatItTests:
      "從原始試算表與文件找出數量答案：查來源、篩選加總、比率、趨勢、損益與估值模型。覆蓋 14 個領域，像能源成本、政府預算、醫療支出、水文氣象等。",
    scoreMeaning:
      "頭條是 pass^5：一題連做 5 次必須全對才算這題通過。這比 pass@1 嚴很多，因為分析師給錯數字一次就可能害決策。網站也會附 pass@1（平均每次對幾成）與 pass@5（五次裡至少對一次），用來分開「穩定性」與「天花板」。",
    scoreType: "pass^5（五次全對）",
    testSet:
      "80 題、14 領域、5 種工作原型。題目、標準答案與原始檔未公開，避免被訓練資料污染。每題有一份人類寫好、再經 AA 核對的參考答案。",
    howTested:
      "Stirrup 沙盒最多 100 回合，可執行 Python、抓網址、看圖。模型被要求只交答案值，不要解釋。",
    method:
      "先用另一個 AI 評審判對錯，再用確定性的數字等值檢查覆寫：單位與精度對得上就保證通過。預檢查只會「救」答案，不會把答案判死。評審是 Gemini 3 Flash（推理）。",
    classroomExample:
      "題目：2023 年該計畫的人事成本佔總成本百分之幾，取到小數兩位。模型要自己打開三份 xlsx 對齊科目。五次裡只要有一次算錯，這題的 pass^5 就是 0。",
    questions: "80 題／14 領域",
    repeats: "5 次",
    responseType: "自由格式最終答案（只要值）",
    tools: true,
    misconceptions: [
      "pass^5 = 80% 遠比 pass@1 = 80% 難，兩者不能當同一種分數看。",
      "寫了正確思路但數字格式錯（題目要百分比卻交小數）仍可能被判錯。",
    ],
    sources: [
      {
        label: "評測方法（Artificial Analysis）",
        href: "https://artificialanalysis.ai/methodology/intelligence-benchmarking/",
      },
    ],
    related: ["aa-briefcase", "mlcr-aa", "scicode"],
  },
  {
    slug: "automationbench-aa",
    name: "AutomationBench-AA：SaaS 工作流程",
    englishName: "AutomationBench-AA",
    status: "standalone",
    category: "agents",
    inIndex: false,
    oneLiner: "考 AI 會不會在模擬的 Gmail、Slack、Salesforce 裡把自動化流程做完，而且不能踩雷。",
    analogy:
      "像社團幹部要在很多 App 之間完成任務：建表、寄信、開工單。目標要達成，但把「不該改的權限」改掉就整題零分。",
    whatItTests:
      "跨多個模擬商務軟體的代理人任務完成度。領域包含財務、人資、行銷、營運、業務、客服。",
    scoreMeaning:
      "若觸發任何防護欄（guardrail），該任務直接 0 分。沒踩雷才計算「目標完成百分比」。所以 60% 可能是「大多目標有做到且沒犯規」，不是「六成任務完美」。",
    scoreType: "目標完成率（踩防護欄則整題 0）",
    testSet:
      "AutomationBench 1.0 的私有 657 題保留集。模擬環境包含 Gmail、Google Sheets、Slack、Salesforce、Zendesk、Jira、HubSpot 等。",
    howTested:
      "多回合環境，最多 50 回合。模型用結構化工具呼叫去發現並打 REST API。每題只跑一次。",
    method:
      "用程式檢查最終環境狀態，不用另外的 AI 評審。斷言分成「目標」（必須變成真）與「防護欄」（一開始是過的，不能被弄破）。基礎設施錯誤或缺題也算 0。",
    classroomExample:
      "任務：把合格應徵者加進試算表並通知主管，但不可把薪資欄寄到公開頻道。通知成功但薪資外洩，整題 0 分。",
    questions: "657 任務",
    repeats: "1 次",
    responseType: "SaaS 工作流程（REST API）",
    tools: true,
    misconceptions: [
      "這是 AA 跑 Zapier 的 AutomationBench，分數不必等於 Zapier 官榜。",
      "App 分解可以重疊（一題用到多個 App）；領域分解不重疊。",
    ],
    sources: [
      {
        label: "AutomationBench 論文",
        href: "https://arxiv.org/abs/2604.18934",
      },
      {
        label: "Zapier 排行榜",
        href: "https://zapier.com/benchmarks",
      },
    ],
    related: ["enterpriseops-gym-aa", "tau3-banking"],
  },
  {
    slug: "harvey-lab-aa",
    name: "Harvey LAB-AA 法律代理人",
    englishName: "Harvey LAB-AA",
    status: "standalone",
    category: "agents",
    inIndex: false,
    oneLiner: "給 AI 一疊案件文件，要它寫備忘錄、揭露表、證詞摘要，再用法律評分表一條一條打勾。",
    analogy:
      "像模擬法庭作業：老師給你合約與筆錄，指定交 `備忘錄.docx`。助教拿檢查表看有沒有寫到管轄法院、有沒有漏掉當事人。漏一條就那條失敗，沒有「寫得還可以」的半分。",
    whatItTests:
      "真實法律工作產出，涵蓋 24 個執業領域。重點是讀案件、產出專業文件，不是考律師高考選擇題。",
    scoreMeaning:
      "預設看「準則通過率」：所有原子檢查項通過的比例。另外有「全過率」：整題每一條都過的比例。準則通過率較寬；全過率很嚴，比較像「這份文件能不能直接給合夥律師」。",
    scoreType: "準則通過率（預設）／全過率",
    testSet:
      "Harvey 的 120 題私有任務。公開只有 5 題示例。頭條數字來自私有集，所以你在家無法完整重跑。",
    howTested:
      "離線沙盒、最多 200 回合、沒有網路。必須交出完全一樣的檔名；檔名差一個字視同沒交。AA 不提供 Harvey 原版的文件產生腳本，因此更能看出模型自己的能力。",
    method:
      "每條準則等權重、二元通過。評審（Gemini 3.1 Pro）只看抽出的文字，不看排版美觀。若該準則需要的檔案一個都沒交，直接失敗、不送評審。",
    classroomExample:
      "準則：「備忘錄必須列出三個可能的管轄異議。」只寫了兩個，這條就是 fail。其他條仍可過，所以準則通過率可能是 8/10，但全過率這題是 0。",
    questions: "120 任務／24 領域",
    repeats: "1 次",
    responseType: "法律文件交件",
    tools: true,
    misconceptions: [
      "AA 分數與 Harvey 自家數字不可直接比：檔名規則更嚴、工具更少。",
      "這不是法律執照考試，也不是法律建議。",
    ],
    sources: [
      {
        label: "Harvey 公開示例",
        href: "https://github.com/harveyai/harvey-labs",
      },
    ],
    related: ["apex-agents-aa", "aa-briefcase"],
  },
  {
    slug: "enterpriseops-gym-aa",
    name: "EnterpriseOps-Gym-AA 企業流程",
    englishName: "EnterpriseOps-Gym-AA",
    status: "standalone",
    category: "agents",
    inIndex: false,
    oneLiner: "讓 AI 操作客服、人資、IT、郵件、行事曆等企業系統，看最後資料庫對不對。",
    analogy:
      "像電腦教室的模擬公司：你去工單系統改狀態、寄信、排會議。老師不看你點了哪些選單，只在下課後打開資料庫檢查「該關的單關了沒、不該改的權限有沒有被改」。",
    whatItTests:
      "有狀態、多步驟的企業工作流程。八個領域：客服、人資、IT 服務、郵件、行事曆、Teams、雲端硬碟，以及要跨系統的混合任務。",
    scoreMeaning:
      "頭條是嚴格 pass@1：每一條 SQL 驗證都過才算成功。另外有「驗證器通過率」，看個別檢查過了幾成，比較細。",
    scoreType: "嚴格 pass@1（資料庫最終狀態）",
    testSet:
      "1,117 題 oracle 模式任務。每題有自己的 SQLite 與可重置伺服器。AA 只跑「已經給齊所需工具」的 oracle 模式，不跑故意混進多餘工具的 distractor 模式。",
    howTested:
      "Stirrup 最多 100 回合、每題 3 次。代理人透過 MCP 對真實（模擬）系統採取行動。",
    method:
      "結束後對資料庫快照跑官方 SQL 驗證：目標完成、狀態與完整性、權限與流程合規、沒有副作用。步驟對不對不重要，結果對才重要。",
    classroomExample:
      "任務：把高優先工單轉給正確群組並通知顧客。工單轉對了但誤改另一張單的優先級，驗證器會抓副作用，整題失敗。",
    questions: "1,117 oracle 任務／8 領域",
    repeats: "3 次",
    responseType: "多回合工具使用（MCP）",
    tools: true,
    misconceptions: [
      "這是 AA 獨立實作，不要直接對 ServiceNow 論文數字。",
      "「過程看起來很合理」若資料庫不對仍是 0 分。",
    ],
    sources: [
      {
        label: "EnterpriseOps-Gym 論文",
        href: "https://arxiv.org/abs/2603.13594",
      },
      {
        label: "資料集",
        href: "https://huggingface.co/datasets/ServiceNow-AI/EnterpriseOps-Gym",
      },
    ],
    related: ["automationbench-aa", "itbench-aa"],
  },
  {
    slug: "tau3-banking",
    name: "τ³-Banking 銀行客服",
    englishName: "τ³-Banking",
    status: "index",
    category: "agents",
    inIndex: true,
    indexWeight: "14%",
    indexCategory: "代理人（34%）",
    oneLiner: "模擬銀行客服：AI 要在超大規定書裡找規則，再真的把帳戶狀態改對。",
    analogy:
      "像超商工讀生面對客訴退款。牆上有一本快 20 萬字的SOP。你要找到對的規定、問清楚狀況，並在後台把「爭議案件」真的建立起來。只會安慰顧客但沒改系統，就不算完成。",
    whatItTests:
      "在金融科技客服裡，能不能從龐大非結構化知識庫找到政策，並完成多步工具操作。屬於 Sierra 的 τ-Knowledge 框架。",
    scoreMeaning:
      "pass@1，看後端資料庫狀態，不看說話好不好聽。例如該不該開爭議、有沒有給臨時貸記。5 次平均。智力指數權重 14%。",
    scoreType: "pass@1（後端世界狀態）",
    testSet:
      "完整 97 題。知識庫約 700 份互相關聯政策、約 195K tokens、21 個產品類別。有些工具只寫在文件裡，工具清單不會直接列給你。",
    howTested:
      "雙人控制：一個模型演顧客、一個演客服。AA 用 GPT-5.4 Mini（中推理）當顧客模擬器與部分判定。知識檢索開 BM25 + grep。每題最多 200 步（含顧客說話）。",
    method:
      "使用上游 tau2-bench v1.0.1 資料與評分器。成功與否以資料庫為準。v4.1.1 改用這套官方評分，取代較舊的實作。",
    classroomExample:
      "顧客說卡片被盜刷。客服必須找到「臨時貸記」政策、核對條件、呼叫正確 API。講得很有同理心但沒開單，分數是 0。",
    questions: "97 任務",
    repeats: "5 次",
    responseType: "雙人對話 + 工具操作",
    tools: true,
    misconceptions: [
      "這不是「會不會聊天」，是「有沒有把系統改對」。",
      "它取代了舊的 τ²-Bench Telecom，兩套分數不要混著比趨勢。",
    ],
    sources: [
      {
        label: "τ-Knowledge 論文",
        href: "https://arxiv.org/abs/2603.04370",
      },
    ],
    related: ["tau2-telecom", "intelligence-index", "automationbench-aa"],
  },
  {
    slug: "terminal-bench-v21",
    name: "Terminal-Bench v2.1",
    englishName: "Terminal-Bench v2.1",
    status: "index",
    category: "coding",
    inIndex: true,
    indexWeight: "16%",
    indexCategory: "程式（24%）",
    oneLiner: "把 AI 關進 Linux 終端機，要它自己把軟體、系統、資料與資安任務做完，並通過測試。",
    analogy:
      "像電腦老師只給你黑色命令列視窗：安裝套件、修設定、處理資料。最後用自動測試腳本檢查，有一個測試沒過就不算。",
    whatItTests:
      "在終端機環境解決 89 道精選任務：軟體工程、系統管理、資料處理、模型訓練、資安。v2.1 修正環境與說明，讓分數比較能反映能力，而不是環境坑。",
    scoreMeaning:
      "pass@1，3 次平均。只有該任務全部測試通過才算成功。70% 大概是 89 題裡約 62 題能穩定做完。智力指數權重 16%，是程式類最重的一項。",
    scoreType: "pass@1（測試套件全過）",
    testSet:
      "完整 89 題。由史丹佛、Laude Institute 與開源社群維護。",
    howTested:
      "Terminus 2 代理人在 E2B 沙盒。最多 250 個 episode、每題逾時兩小時（或題目自訂更長）。限制主要是防止模型卡死迴圈。",
    method:
      "每題自帶驗證測試。不另外用 AI 評審作文。AA 在智力指數裡標成不額外給「網路搜尋類工具」，但模型仍透過終端機操作環境。",
    classroomExample:
      "任務：把一份壞掉的設定檔修好，讓網站能啟動。網站起來了但測試還檢查權限與 log，少一項就失敗。",
    questions: "89 任務",
    repeats: "3 次",
    responseType: "終端機操作",
    tools: false,
    misconceptions: [
      "這不是 LeetCode 寫函式，是「在真實電腦環境把事情做完」。",
      "v2.1 與舊的 Terminal-Bench Hard 題數與限制不同，分數不能直接當同一條趨勢。",
    ],
    sources: [
      {
        label: "論文",
        href: "https://arxiv.org/abs/2601.11868",
      },
      {
        label: "官方榜",
        href: "https://www.tbench.ai/leaderboard/terminal-bench/2.1",
      },
    ],
    related: ["terminal-bench-hard", "scicode", "livecodebench"],
  },
  {
    slug: "aa-lcr",
    name: "人工分析長文推理（AA-LCR）",
    englishName: "Artificial Analysis Long Context Reasoning",
    status: "index",
    category: "general",
    inIndex: true,
    indexWeight: "6%",
    indexCategory: "一般（18%）",
    oneLiner: "丟給 AI 一本很厚的資料（約 10 萬 token），看它能不能找到線索並推理出答案。",
    analogy:
      "像考試發一本 200 頁報告書，只准問 1 題：某年某部門的結論跟附錄數字是否矛盾。你不能只靠開頭結尾，中間某處藏著關鍵表。",
    whatItTests:
      "從超長文件抽取、推理、綜合資訊的能力。文件類型含公司年報、產業報告、政府諮詢、學術、法律、行銷、調查報告。",
    scoreMeaning:
      "pass@1，用平等檢查 AI 判斷答案是否語意上等價。不是比誰寫得長。智力指數權重 6%。模型至少要能吃 128K 上下文，否則這項會考不了。",
    scoreType: "pass@1（平等檢查 LLM）",
    testSet:
      "100 題難題、7 大類、約 230 份文件。每題輸入約 100k tokens（cl100k_base 計算），整場約 300 萬不重複輸入 token。",
    howTested:
      "把長文與問題一次給模型。每題 3 次。評審是 GPT-5.6 Luna（中）。只需回答 CORRECT / INCORRECT 是否與官方答案一致。",
    method:
      "開放作答，不靠選項碰運氣。平等檢查看語意，不要求用字完全相同。",
    classroomExample:
      "問：三份年報裡，哪一年研發支出成長但管理層卻說「持平」？答案可能是年份或短句，評審比的是意思對不對。",
    questions: "100 題",
    repeats: "3 次",
    responseType: "開放作答",
    tools: false,
    misconceptions: [
      "上下文視窗寫 100 萬，不代表真的會用中間的資訊。這項就是在抓「假裝看完」。",
      "跟醫學長文 MLCR 不同：AA-LCR 是一般長文件，不是病歷。",
    ],
    sources: [
      {
        label: "評測方法",
        href: "https://artificialanalysis.ai/methodology/intelligence-benchmarking/",
      },
    ],
    related: ["mlcr-aa", "aa-omniscience"],
  },
  {
    slug: "aa-omniscience",
    name: "AA-Omniscience 知識與幻覺",
    englishName: "AA-Omniscience",
    status: "index",
    category: "general",
    inIndex: true,
    indexWeight: "12%（正確 8% + 不幻覺 4%）",
    indexCategory: "一般（18%）",
    oneLiner: "考 AI 知不知道事實；更重要的是：不知道時會不會亂編。",
    analogy:
      "像口試。老師問冷門史實。答對加分；說「我不知道」不扣分；掰一個聽起來很真的假答案要倒扣。會承認不會，比硬猜好。",
    whatItTests:
      "跨經濟相關領域的事實回憶，以及區分「已知／未知」。題目涵蓋商業、人文社科、健康、法律、軟體工程、科學工程數學等 42 個主題。",
    scoreMeaning:
      "Omniscience 指數：答對加分、幻覺扣分、放棄中立。智力指數拆成兩塊：正確率 8%、不幻覺率（1−幻覺率）4%。一個很會猜的模型可能正確率還行，但不幻覺率會很差。",
    scoreType: "正確率 + 不幻覺率（另有合成指數）",
    testSet:
      "6,000 題。公開集在 Hugging Face：ArtificialAnalysis/AA-Omniscience-Public。",
    howTested:
      "開放作答、每題 1 次。評審 GPT-5.6 Luna（中）把答案標成 CORRECT、INCORRECT、PARTIAL_ANSWER、NOT_ATTEMPTED。",
    method:
      "獎勵精確知識、懲罰亂猜。設計目的是對抗「永遠給一個自信答案」的壞習慣。",
    classroomExample:
      "問某冷門法規條號。模型 A 說不知道 → 中立。模型 B 編造條號 → 幻覺、扣分。模型 C 答對 → 加分。",
    questions: "6,000 題／42 主題",
    repeats: "1 次",
    responseType: "開放作答",
    tools: false,
    misconceptions: [
      "正確率高不一定可靠；要一起看幻覺率。",
      "「我不知道」在這裡是好行為，不是懦弱。",
    ],
    sources: [
      {
        label: "論文",
        href: "https://arxiv.org/abs/2511.13029",
      },
      {
        label: "公開資料集",
        href: "https://huggingface.co/datasets/ArtificialAnalysis/AA-Omniscience-Public",
      },
    ],
    related: ["hle", "mmlu-pro", "intelligence-index"],
  },
  {
    slug: "scicode",
    name: "SciCode 科學程式",
    englishName: "SciCode",
    status: "index",
    category: "coding",
    inIndex: true,
    indexWeight: "8%",
    indexCategory: "程式（24%）",
    oneLiner: "科學家出的實驗室程式題：AI 要寫 Python，而且要通過單元測試。",
    analogy:
      "像理化實驗課要寫分析程式。老師會先給背景知識與前面步驟的函式，你只要把「下一步」寫對，還要通過隱藏測試資料。",
    whatItTests:
      "科學計算程式能力，涵蓋 16 個科學領域、80 個實驗室問題。重點是把科學步驟變成可執行、可驗證的程式。",
    scoreMeaning:
      "以子問題計分的 pass@1，3 次平均。不是 80 題全對才給分，而是 288 個子問題分別看過不過測試。比較能看出部分能力。",
    scoreType: "pass@1（子問題、程式執行）",
    testSet:
      "測試集 288 個子問題，來自 80 個實驗室問題。提示含科學家標註的背景知識。",
    howTested:
      "模型寫出下一步的 Python 函式，不能亂加套件，也不能寫示範用法。抽出程式碼後真的拿去跑單元測試。",
    method:
      "沿用原作者的 Scientist Annotated Background 提示。評分看執行，不看註解寫美不美。",
    classroomExample:
      "前一步已寫好讀取光譜的函式。下一步要實作峰值偵測。測資對了才算這個子問題通過。",
    questions: "288 個子問題（80 題）",
    repeats: "3 次",
    responseType: "Python 程式",
    tools: false,
    misconceptions: [
      "這比一般演算法題更「科學」，常要理解公式與實驗流程。",
      "子問題分數高，不代表整個實驗室問題從頭到尾都能獨立完成。",
    ],
    sources: [
      {
        label: "論文",
        href: "https://arxiv.org/abs/2407.13168",
      },
      {
        label: "官網",
        href: "https://scicode-bench.github.io/",
      },
    ],
    related: ["terminal-bench-v21", "livecodebench", "critpt"],
  },
  {
    slug: "hle",
    name: "人類最後一考（HLE）",
    englishName: "Humanity's Last Exam",
    status: "index",
    category: "science",
    inIndex: true,
    indexWeight: "12%",
    indexCategory: "科學推理（24%）",
    oneLiner: "專家出的 2,000 多題超難學術題，被設計成「選擇題時代的最後一場大考」。",
    analogy:
      "像把各科奧林匹亞、研究所資格考混在一起。很多題連該領域研究生都要想很久。它被叫「最後一考」，是因為再簡單的閉卷學術題很快就被 AI 考滿分了。",
    whatItTests:
      "數學、自然科學、人文的前沿學術能力。由 Center for AI Safety（Dan Hendrycks 團隊）蒐集、專家審過。",
    scoreMeaning:
      "pass@1，用平等檢查 AI 看開放答案是否等價於標準答案。目前前沿模型分數仍遠低於滿分，所以它還能分出高下。智力指數權重 12%。",
    scoreType: "pass@1（平等檢查 LLM）",
    testSet:
      "2025 年 5 月修訂版共 2,500 題；AA 只用其中 2,158 題純文字題，方便不會看圖的模型也能比。出題時曾用 GPT-4o、Gemini 1.5 Pro、Claude 3.5 Sonnet、o1 等做對抗篩選，這些模型可能被這份考卷「針對」，不宜跟後來模型直接比。",
    howTested:
      "要求依指定格式寫 Explanation / Exact Answer / Confidence。評審 GPT-5.6 Luna（中）抽最終答案再比對。",
    method:
      "零樣本、開放作答為主。平等檢查允許數值小誤差，但不接受模糊或不等價的說法。",
    classroomExample:
      "一題可能是很偏的代數數論或科學史事實。模型寫長篇推理，評審只抽最後精確答案看對不對。",
    questions: "2,158 題純文字（出自 2,500）",
    repeats: "1 次",
    responseType: "開放作答（少數選擇）",
    tools: false,
    misconceptions: [
      "低分不代表模型「很笨」，代表這份考卷本來就極難。",
      "參與過出題篩選的舊模型，分數可能被低估。",
    ],
    sources: [
      {
        label: "論文",
        href: "https://arxiv.org/abs/2501.14249v2",
      },
      {
        label: "資料集",
        href: "https://huggingface.co/datasets/cais/hle",
      },
    ],
    related: ["gpqa-diamond", "critpt", "aime-2025"],
  },
  {
    slug: "critpt",
    name: "CritPt 研究級物理",
    englishName: "CritPt",
    status: "index",
    category: "science",
    inIndex: true,
    indexWeight: "6%",
    indexCategory: "科學推理（24%）",
    oneLiner: "70 道還沒公開過的研究級物理挑戰，答案可能是數字、符號或一段 Python。",
    analogy:
      "不是高中物理選擇題，比較像教授把研究過程拆成關卡：推公式、寫成 SymPy 表達式，或寫函式通過數值測試。考卷不公開，比較不怕被背答案。",
    whatItTests:
      "研究層級的物理推理，跨很多分支。用來補「舊物理考卷已經太好考、分不出頂尖模型」的問題。",
    scoreMeaning:
      "pass@1，5 次平均。官方評分伺服器判定正確與否。分數低很正常，因為題目接近真實研究挑戰。",
    scoreType: "pass@1（官方評分伺服器）",
    testSet:
      "測試集 70 題挑戰級（示例題不算）。答案格式包含數值、SymPy 符號、用測資檢驗的 Python 函式。",
    howTested:
      "兩步：先讓模型推理解題，再請它把答案排成評分要的程式格式。兩步的 token 與成本都算進去。",
    method:
      "與 CritPt 團隊合作實作。評分 API 需申請。不靠網路上已流出的標準答案。",
    classroomExample:
      "挑戰可能要求寫出某個物理量的符號解，再用官方伺服器的隱藏測資驗證。",
    questions: "70 題挑戰",
    repeats: "5 次",
    responseType: "數值／符號／Python 函式",
    tools: false,
    misconceptions: [
      "這不是學測物理，低分不代表連牛頓定律都不會。",
      "官方數字是 70 題測試挑戰；有些介紹寫 71 是含示例。",
    ],
    sources: [
      {
        label: "論文",
        href: "https://arxiv.org/abs/2509.26574",
      },
      {
        label: "官網",
        href: "https://critpt.com/",
      },
    ],
    related: ["hle", "gpqa-diamond", "scicode"],
  },
  {
    slug: "gpqa-diamond",
    name: "GPQA Diamond",
    englishName: "GPQA Diamond",
    status: "index",
    category: "science",
    inIndex: true,
    indexWeight: "6%",
    indexCategory: "科學推理（24%）",
    oneLiner: "198 題博士級生科／物理／化學選擇題，設計成「會搜尋的非專家也難靠 Google 過關」。",
    analogy:
      "像只有該領域博士才穩的考題。原論文裡專家約 65% 正確，會上網的非專家只有約 34%。所以它常被叫 Google-Proof：不是完全搜不到，而是搜了也很容易選錯。",
    whatItTests:
      "研究所等級的科學知識與推理。Diamond 是全套 448 題裡品質最高的子集：兩位專家都答對，而且多數非專家答錯。",
    scoreMeaning:
      "四選一的 pass@1，5 次平均。亂猜期望約 25%。人類專家 65% 是很好的參照：模型若到這個區間，代表它在這份「抗搜尋」考卷上接近領域專家。",
    scoreType: "pass@1（四選一、正則抽取）",
    testSet:
      "198 題 Diamond。生物、物理、化學。",
    howTested:
      "零樣本選擇題，最後一行要寫 `Answer: A`。用多段正則把答案字母抓出來，取最後一次出現，允許模型中途改答案。",
    method:
      "不給範例。溫度與重試規則跟其他智力指數考試相同。",
    classroomExample:
      "題目可能涉及很細的有機反應或量子細節。四個選項都「看起來很科學」，非專家很容易被干擾項騙走。",
    questions: "198 題",
    repeats: "5 次",
    responseType: "四選一",
    tools: false,
    misconceptions: [
      "50% 看起來像及格，但亂猜就有 25%，而且專家也只有約 65%。",
      "Diamond 比完整 GPQA 更難、更好用來分出高下。",
    ],
    sources: [
      {
        label: "論文",
        href: "https://arxiv.org/abs/2311.12022",
      },
    ],
    related: ["hle", "mmlu-pro", "critpt"],
  },
  {
    slug: "itbench-aa",
    name: "ITBench-AA 維運事故",
    englishName: "ITBench-AA",
    status: "standalone",
    category: "agents",
    inIndex: false,
    oneLiner: "給 AI 一包 Kubernetes 事故快照，要它當 SRE 找出真正害系統掛掉的元件。",
    analogy:
      "像偵探看案發現場照片：有警報、log、追蹤、拓樸圖。你要指出「哪個 Deployment／Pod／網路政策才是根因」，不能只報一堆症狀。少抓一個真兇，或亂抓太多無辜者，分數都會掉。",
    whatItTests:
      "IBM ITBench 的 SRE 能力：離線 Kubernetes 事故的根因分析。",
    scoreMeaning:
      "主要分數是「全召回下的精確率」。漏掉任何一個真正根因實體就得 0；沒漏才計算你交的名單裡有多少是對的。亂猜一長串會被假陽性懲罰。",
    scoreType: "Precision at full recall",
    testSet:
      "59 個情境：公開 40 + 私有 19，頭條是兩邊平均。每題是離線快照，含警報、事件、追蹤、指標、log、拓樸。",
    howTested:
      "Stirrup 最多 100 回合，只給 shell 與 finish。必須寫出結構化 JSON，列出最少的獨立根因實體與證據。最後 20 回合會提醒快沒時間。",
    method:
      "GPT-5.5（中推理）只負責把模型寫的名稱對齊官方實體與別名。Pod 與對應 Deployment 可能算同一組，避免重複計分。",
    classroomExample:
      "真兇是某個 NetworkPolicy。模型只寫「延遲很高」→ 沒指出實體 → 0 分。指出該政策但又多怪了三個無辜 Pod → 沒漏兇但精確率下降。",
    questions: "59 情境",
    repeats: "3 次",
    responseType: "結構化 JSON 根因名單",
    tools: true,
    misconceptions: [
      "這不是現場連到正式叢集，而是看事故當下的離線快照。",
      "AA 實作分數不必等於 IBM 原論文。",
    ],
    sources: [
      {
        label: "ITBench 論文",
        href: "https://arxiv.org/abs/2502.05352",
      },
    ],
    related: ["enterpriseops-gym-aa", "terminal-bench-v21"],
  },
  {
    slug: "mmmu-pro",
    name: "MMMU-Pro 多模態學科",
    englishName: "MMMU-Pro",
    status: "standalone",
    category: "other",
    inIndex: false,
    oneLiner: "看圖加學科知識的加強版考試，把猜題捷徑堵掉，十選一更難蒙對。",
    analogy:
      "像指考要看實驗裝置圖或樂譜再作答。舊版有時不必真的看圖也能靠文字常識猜。Pro 版把這種捷徑拿掉，而且從四選一改成十選一。",
    whatItTests:
      "跨 30 個學科的視覺＋語言推理：圖表、照片、圖示、試題影像。不進入智力指數，因為智力指數主要是文字考。",
    scoreMeaning:
      "十選一 pass@1。亂猜只有 10%。分數應讀成「在堵住捷徑後，還會不會看圖思考」。",
    scoreType: "pass@1（十選一）",
    testSet: "1,730 題，資料集 MMMU/MMMU_Pro。",
    howTested: "每題 1 次。正則抽出答案字母。",
    method: "與其他選擇題相同的指令格式，選項 A–J。",
    classroomExample:
      "給一張電路圖問等效電阻。選項有十個相近數字，沒看圖幾乎無法穩穩選中。",
    questions: "1,730 題",
    repeats: "1 次",
    responseType: "十選一（需看圖）",
    tools: false,
    misconceptions: [
      "不會看圖的純文字模型不該拿這項當智力代表。",
      "比原始 MMMU 更嚴，分數通常較低是預期的。",
    ],
    sources: [
      {
        label: "資料集",
        href: "https://huggingface.co/datasets/MMMU/MMMU_Pro",
      },
    ],
    related: ["mmlu-pro", "global-mmlu-lite"],
  },
  {
    slug: "ifbench",
    name: "IFBench 精準遵從指令",
    englishName: "IFBench",
    status: "standalone",
    category: "other",
    inIndex: false,
    oneLiner: "不管內容聰不聰明，先看 AI 能不能完全遵守奇怪但明確的格式規定。",
    analogy:
      "老師說：「作文要剛好 8 句、第三句必須問句、不准出現逗號。」內容再好，格式錯就扣光。這考的是「有沒有照做」，不是「有沒有思想」。",
    whatItTests:
      "單回合、可自動驗證的 58 類域外限制：計數、格式、句子操作等。智力指數 v4.1 因「頂尖模型都太滿分、分不出高下」而把它移出總分，但仍繼續測新模型。",
    scoreMeaning:
      "提示層正確率：294 題 × 5 次的平均通過率。用官方寬鬆模式，會嘗試去掉首尾行或星號再檢查，避免因多餘寒暄就整題失敗。",
    scoreType: "pass@1（規則驗證、寬鬆模式）",
    testSet: "allenai/IFBench_test 的 294 題單回合集。AA 不跑多回合版本。",
    howTested: "每題 5 次，用官方程式驗證輸出是否滿足限制。",
    method: "規則驅動，不是 AI 評審作文美感。",
    classroomExample:
      "「用恰好 4 個項目的項目符號回答，且每個項目以動詞開頭。」寫成一段文章就失敗。",
    questions: "294 題",
    repeats: "5 次",
    responseType: "開放作答（受格式約束）",
    tools: false,
    misconceptions: [
      "這項高分 ≠ 比較聰明，只代表比較聽指令。",
      "它離開智力指數是因為太好考了，不是因為不重要。",
    ],
    sources: [
      {
        label: "論文",
        href: "https://arxiv.org/abs/2507.02833",
      },
    ],
    related: ["aa-omniscience", "intelligence-index"],
  },
  {
    slug: "terminal-bench-hard",
    name: "Terminal-Bench Hard（舊版）",
    englishName: "Terminal-Bench Hard",
    status: "legacy",
    category: "coding",
    inIndex: false,
    oneLiner: "舊版較難的終端機任務集，已被 v2.1 取代，只留著方便看歷史分數。",
    analogy:
      "像舊學測綱要。現在改新綱了，還看得到學長姊的分數，但不能拿來跟今年考生直接比。",
    whatItTests:
      "終端機裡的軟體工程、系統管理、資料處理，甚至遊戲與逆向等硬任務。",
    scoreMeaning:
      "44 題、3 次平均的 pass@1。限制比 v2.1 更緊（最多 100 episode、累積輸入 100 萬 token）。",
    scoreType: "pass@1（已退役）",
    testSet:
      "terminal-bench-core 的 hard 子集（2025-08-14 版本），因外部相依排除少數題後剩 44 題。",
    howTested: "同樣用 Terminus 2，逾時兩小時，但 100 episode 通常先碰到。",
    method: "每題測試套件全過才算成功。",
    classroomExample:
      "任務名稱像安裝 Windows XP、為 MIPS 做 Doom、從零訓練 word2vec，都是又長又容易卡關的環境題。",
    questions: "44 任務",
    repeats: "3 次",
    responseType: "終端機操作",
    tools: false,
    misconceptions: [
      "不要把它和 Terminal-Bench v2.1 畫在同一條進步曲線上當同一場考試。",
    ],
    sources: [
      {
        label: "Terminal-Bench",
        href: "https://www.tbench.ai/",
      },
    ],
    related: ["terminal-bench-v21"],
  },
  {
    slug: "tau2-telecom",
    name: "τ²-Bench Telecom（舊版）",
    englishName: "τ²-Bench Telecom",
    status: "legacy",
    category: "agents",
    inIndex: false,
    oneLiner: "舊的電信客服雙人對話考，已被 τ³-Banking 取代。",
    analogy:
      "像舊的「修手機網路」角色扮演考。現在改考銀行SOP了，題目領域不同，分數不能當同一科。",
    whatItTests:
      "雙人控制的技術支援：代理人和「模擬用戶」都要動作，才能把電信服務修好。",
    scoreMeaning:
      "114 題、3 次平均 pass@1。成敗看世界狀態，例如用戶的行動數據修好了沒。",
    scoreType: "pass@1（已退役於指數）",
    testSet:
      "電信領域 114 題（從 2,285 題程式生成任務抽樣），意圖含服務、行動數據、MMS。",
    howTested:
      "預設雙人模式，用戶模擬器曾用 Qwen3 235B。每題最多 100 步。",
    method: "以最終世界狀態評分，不是看對話禮貌。",
    classroomExample:
      "用戶說打不開熱點。代理人要診斷方案限制、請用戶重設設定，並在後台把功能打開。",
    questions: "114 任務",
    repeats: "3 次",
    responseType: "雙人對話 + 工具",
    tools: true,
    misconceptions: [
      "它不是比較簡單的 Banking，而是另一個領域的上一世代考卷。",
    ],
    sources: [
      {
        label: "τ²-Bench 論文",
        href: "https://arxiv.org/abs/2506.07982",
      },
    ],
    related: ["tau3-banking"],
  },
  {
    slug: "mmlu-pro",
    name: "MMLU-Pro",
    englishName: "MMLU-Pro",
    status: "legacy",
    category: "other",
    inIndex: false,
    oneLiner: "研究所程度的綜合知識選擇題，十個選項，比舊 MMLU 更難蒙。",
    analogy:
      "像超大型科科都有的學力測驗。舊 MMLU 四選一太好猜，Pro 改十選一，並要求更深推理。AA 已從智力指數拿掉，因為頂尖模型逐漸考滿。",
    whatItTests: "14 個學科領域的進階知識與推理。",
    scoreMeaning:
      "十選一 pass@1。亂猜 10%。仍可用來比較中小型模型，但對最前沿模型鑑別度下降。",
    scoreType: "pass@1（十選一，已退役於指數）",
    testSet: "約 12,000 題，TIGER-Lab/MMLU-Pro。",
    howTested: "與 GPQA 相同風格的指令，選項到 J。",
    method: "正則抽取答案字母。",
    classroomExample:
      "一題可能是法律或工程情境，十個選項只有一個完全正確，其餘是常見迷思。",
    questions: "約 12,000 題",
    repeats: "1 次（方法表）",
    responseType: "十選一",
    tools: false,
    misconceptions: [
      "MMLU-Pro 高分不再自動等於「最聰明的前沿模型」。",
    ],
    sources: [
      {
        label: "論文",
        href: "https://arxiv.org/abs/2406.01574",
      },
    ],
    related: ["global-mmlu-lite", "gpqa-diamond"],
  },
  {
    slug: "livecodebench",
    name: "LiveCodeBench 即時代碼",
    englishName: "LiveCodeBench",
    status: "legacy",
    category: "coding",
    inIndex: false,
    oneLiner: "持續從 LeetCode、AtCoder、Codeforces 抓新題，降低「考卷已出現在訓練資料」的問題。",
    analogy:
      "像老師每天從新比賽抓題，避免學生背去年考古題。誰在截止日期後才訓練，就不該看過這些新題。",
    whatItTests: "程式生成、自我修復、執行。AA 主要報程式生成的 pass@1。",
    scoreMeaning:
      "程式跑測資通過的比例。因為題目會隨時間更新，不同月份的分數比較要小心。",
    scoreType: "pass@1（已退役於指數）",
    testSet: "livecodebench/code_generation_lite，來自三大競賽站的新鮮題。",
    howTested:
      "有的題給起始程式碼，有的要從標準輸入讀資料。AA 不用 LiveCodeBench 官方那些依模型而變的系統提示。",
    method: "抽出 ```python``` 區塊後實際執行。",
    classroomExample:
      "一道新的圖論競賽題。模型交的 Python 要在隱藏測資上全對。",
    questions: "持續更新的競賽題",
    repeats: "pass@1",
    responseType: "Python 程式",
    tools: false,
    misconceptions: [
      "「Live」代表題目會過期與更新，不是現場直播比賽。",
    ],
    sources: [
      {
        label: "論文",
        href: "https://arxiv.org/abs/2403.07974",
      },
    ],
    related: ["scicode", "terminal-bench-v21"],
  },
  {
    slug: "math-500",
    name: "MATH-500",
    englishName: "MATH-500",
    status: "legacy",
    category: "science",
    inIndex: false,
    oneLiner: "從經典 MATH 競賽題庫抽出的 500 題，涵蓋高中競賽代數、幾何、數論等。",
    analogy:
      "像把數學校隊講義抽 500 題當小考。現在頂尖模型已經太會考這份，AA 不再把它放進總分。",
    whatItTests: "競賽程度數學，六大領域。",
    scoreMeaning: "正確率。高分很常見，鑑別前沿模型的能力變弱。",
    scoreType: "正確率（已退役）",
    testSet: "HuggingFaceH4/MATH-500，MATH 的固定 500 題子集。",
    howTested: "請模型寫出解題過程與最終答案，再核對。",
    method: "經典數學基準的精簡版，方便重複比較。",
    classroomExample:
      "可能是較難的數列或立體幾何，答案常是整數或簡短算式。",
    questions: "500 題",
    repeats: "依歷史設定",
    responseType: "數學作答",
    tools: false,
    misconceptions: [
      "這比較接近高中競賽，不是研究級數學。",
    ],
    sources: [
      {
        label: "資料集",
        href: "https://huggingface.co/datasets/HuggingFaceH4/MATH-500",
      },
    ],
    related: ["aime-2025", "hle"],
  },
  {
    slug: "aime-2025",
    name: "AIME 2025",
    englishName: "AIME 2025",
    status: "legacy",
    category: "science",
    inIndex: false,
    oneLiner: "2025 年美國數學邀請賽完整 30 題，答案必須是 000 到 999 的整數。",
    analogy:
      "AIME 是 AMC 之後的美國高中數學邀請賽，比學測難、比 IMO 短。每題答案是三位數整數，很好自動批改。",
    whatItTests: "奧林匹亞前階段的競賽數學推理。",
    scoreMeaning:
      "30 題的 pass@1，AA 曾每題重複 10 次再平均。因為題數少，分數波動比大考卷大。現已退出積極報表。",
    scoreType: "pass@1（整數答案，已退役）",
    testSet: "2025 AIME I 與 II，共 30 題。",
    howTested:
      "要求把答案放進 \\boxed{}。先用 SymPy 正規化腳本批改，必要時再用平等檢查 AI 當備援。",
    method: "格式嚴格，便於自動評分。",
    classroomExample:
      "答 64 或 064 都可；答 64.0 通常也能被數學等值檢查接受，但寫成算式可能要看正規化。",
    questions: "30 題",
    repeats: "10 次（歷史設定）",
    responseType: "整數 000–999",
    tools: false,
    misconceptions: [
      "30 題太少，差 2 題就會讓百分比看起來差很多。",
    ],
    sources: [
      {
        label: "AIME 介紹（維基）",
        href: "https://en.wikipedia.org/wiki/American_Invitational_Mathematics_Examination",
      },
    ],
    related: ["math-500", "hle"],
  },
  {
    slug: "global-mmlu-lite",
    name: "Global-MMLU-Lite 多語知識",
    englishName: "Global-MMLU-Lite",
    status: "standalone",
    category: "other",
    inIndex: false,
    oneLiner: "輕量多語版 MMLU，用來組成「這個模型會不會多種語言」的指數。",
    analogy:
      "同一份常識／學科選擇題，翻譯成很多語言再考一次。英文很高、斯瓦希里語很低，代表多語能力不均衡。",
    whatItTests:
      "跨語言與文化脈絡的知識推理。AA 的多語指數就建立在這項上，語言含英、中、印地、西、法、阿、孟加拉、葡、印尼、日、斯瓦希里、德、韓、義、約魯巴、緬甸等。",
    scoreMeaning:
      "各語言約 400 題四選一的 pass@1。可看單一語言，也可看平均。不進入英文為主的智力指數。",
    scoreType: "pass@1（四選一，多語）",
    testSet: "約 6,000 題（每語約 400），CohereLabs/Global-MMLU-Lite。",
    howTested: "每題 1 次，正則抽答案。",
    method: "與其他選擇題相同原則，但題目語言不同。",
    classroomExample:
      "同一道歷史題用日文與約魯巴語各考一次。只會英文的模型，後者可能接近亂猜。",
    questions: "約 6,000 題",
    repeats: "1 次",
    responseType: "四選一",
    tools: false,
    misconceptions: [
      "智力指數高，不保證 Global-MMLU 的中文或非洲語言也高。",
    ],
    sources: [
      {
        label: "資料集",
        href: "https://huggingface.co/datasets/CohereLabs/Global-MMLU-Lite",
      },
    ],
    related: ["mmlu-pro"],
  },
  {
    slug: "mlcr-aa",
    name: "MLCR-AA 醫學長文推理",
    englishName: "Medical Long Context Reasoning (MLCR-AA)",
    status: "standalone",
    category: "other",
    inIndex: false,
    oneLiner: "讀又長又碎的病歷，做保險與醫療審查才需要的跨文件推理。",
    analogy:
      "像把好幾年的就醫紀錄、檢查報告、申請書打亂給你，問「這次住院跟三年前那次跌倒有沒有因果」。答案要完整、正確，還不能寫成長篇小說。",
    whatItTests:
      "Wisedocs 的醫學長文基準：重建時間線、因果、治療型態、理賠相關性。AA 只評最難的 expert 與 compound 層。",
    scoreMeaning:
      "總通過率：先過「簡潔門檻」，再被三位評審多數決判定「完整且正確」。寫超過參考答案五倍長度直接 0，不送審。這在逼模型講重點。",
    scoreType: "pass@1（簡潔門檻 + 三評審多數決）",
    testSet:
      "公開集有六個難度層、約 25k–64k tokens 的合成但逼真病例。AA 頭條用私有 60 題最難集，每題 3 次，與公開集分開，降低洩題。",
    howTested: "開放作答。三位 LLM 評審分別投完整、正確，多數決。",
    method:
      "主分數只承認「簡潔 + 完整 + 正確」。另外會公布在已送審答案裡的正確率／完整率，以及全體的簡潔率。",
    classroomExample:
      "問：申請單寫的受傷日期，跟急診紀錄、復健筆記是否一致？漏掉互相矛盾的一頁，完整性就可能被投否。",
    questions: "AA 頭條：60 題最難層",
    repeats: "3 次",
    responseType: "開放作答",
    tools: false,
    misconceptions: [
      "這不是醫師執照考，也不能拿來當醫療建議。",
      "公開集分數與 AA 私有最難集分數不是同一件事。",
    ],
    sources: [
      {
        label: "Wisedocs MLCR",
        href: "https://huggingface.co/datasets/Wisedocs/mlcr-dataset",
      },
    ],
    related: ["aa-lcr", "aa-analyst-agent"],
  },
];

export function getBenchmark(slug: string): Benchmark | undefined {
  return benchmarks.find((item) => item.slug === slug);
}

export function getBenchmarksByCategory(category: Benchmark["category"]) {
  return benchmarks.filter((item) => item.category === category);
}

export function getRelated(benchmark: Benchmark): Benchmark[] {
  return benchmark.related
    .map((slug) => getBenchmark(slug))
    .filter((item): item is Benchmark => Boolean(item));
}
