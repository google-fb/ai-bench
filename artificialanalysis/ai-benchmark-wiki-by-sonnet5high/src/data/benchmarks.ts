import type { Benchmark, CategoryId } from "./types";

export const BENCHMARKS: Benchmark[] = [
  {
    slug: "intelligence-index",
    name: "人工分析智力指數",
    nameEn: "Artificial Analysis Intelligence Index v4.1.1",
    category: "index",
    status: "index",
    tags: ["綜合分數", "九合一", "最常被引用"],
    officialUrl:
      "https://artificialanalysis.ai/evaluations/artificial-analysis-intelligence-index",
    oneLiner:
      "把九場很難的 AI 考試合成一張總成績單，用來比較模型「整體有多聰明」。",
    classroomAnalogy:
      "像把學測國英數自社、加上專題實作與實驗報告，依比重算出一個總級分。它方便比較，但不代表每一科都強。",
    what: [
      "這是 Artificial Analysis 自己做的「總分」，不是單一題庫。現行版本是 v4.1.1。",
      "它刻意選很難、比較接近真實能力的考試，涵蓋代理人工作、寫程式、科學推理、知識與長文。",
      "總分用加權平均：代理人 34%、程式 24%、科學推理 24%、一般能力 18%。現在比較重視「會不會自己把事情做完」。",
      "這套考試主要是英文、文字為主。看圖、聽聲音、多國語言另外算，不併進這個指數。",
    ],
    scoreMeaning: [
      "分數越高，代表模型在這九項難考題上平均表現越好。官方估計這個總分的 95% 信賴區間大約小於 ±1 分。",
      "權重拆開來看：GDPval-AA v2 占 20%、Terminal-Bench v2.1 占 16%、τ³-Banking 占 14%、人類最後一考 12%、AA-Omniscience 12%（其中正確率 8%、不亂掰 4%）、SciCode 8%、GPQA Diamond 6%、CritPt 6%、AA-LCR 6%。",
      "看到「某模型 63 分」時，不要把它想成百分制考試的 63。這是很難的綜合指標，前段班通常落在這個區間，不是人人都能考 90。",
      "總分高不代表你的作業一定適合用它。例如它幾乎不測中文作文，也不測畫圖。",
    ],
    dataset: [
      "沒有一份叫做「智力指數題庫」的單一檔案，而是九份不同測試集的組合。",
      "包含：220 件真實職業任務、97 題銀行客服流程、89 題終端機任務、288 個科學程式子問題、2,158 題人類最後一考文字題、198 題 GPQA Diamond、70 題 CritPt、6,000 題知識題、100 題長文推理。",
      "官方自己保存內部副本，並用相同提示詞、相同溫度規則測所有模型，才叫「公平比較」。",
    ],
    howTested: [
      "幾乎都用零樣本：只給清楚說明，不先餵範例。",
      "非推理模型溫度常設 0，推理模型常設 0.6（除非原廠另有建議）。",
      "多數項目用 pass@1：第一次做對才算。有些題會重測 3 或 5 次再平均，減少運氣。",
      "GDPval 比較特別，是用盲測互相比、再換成 Elo，不是對標準答案打勾。",
    ],
    method: [
      "原則有四個：標準化、不偏心、零樣本指令、方法公開。",
      "答案抓取會盡量寬容合理的寫法，避免「其實對了但格式差一個空格就零分」。",
      "API 失敗會自動重試最多 30 次；一直失敗的題會人工檢查，不會隨便公布壞成績。",
      "最新補丁 v4.1.1 主要是換更穩的閱卷模型，以及把 τ³-Banking 對齊上游最新版本。",
    ],
    studentTips: [
      "先把智力指數當「班級總排名」，再點進各科看強弱。",
      "若你只在乎寫程式，請看 Terminal-Bench 與 SciCode，不要只看總分。",
      "指數會改版。舊新聞裡的分數，不一定能跟新版直接比。",
    ],
    related: [
      "gdpval-aa",
      "tau3-banking",
      "terminal-bench-v21",
      "scicode",
      "hle",
      "gpqa-diamond",
      "critpt",
      "aa-omniscience",
      "aa-lcr",
    ],
    facts: [
      { label: "版本", value: "v4.1.1" },
      { label: "組成", value: "9 項評測" },
      { label: "計分", value: "加權平均" },
      { label: "語言", value: "主要英文文字" },
    ],
  },
  {
    slug: "openness-index",
    name: "開放指數",
    nameEn: "Artificial Analysis Openness Index",
    category: "index",
    status: "active",
    tags: ["開放程度", "不是智力", "授權與透明度"],
    officialUrl:
      "https://artificialanalysis.ai/evaluations/artificial-analysis-openness-index",
    oneLiner:
      "這不是考智力，而是打「這模型有多開放」：權重能不能下載、資料有沒有公開、授權能不能自由用。",
    classroomAnalogy:
      "像評一本參考書：不只看寫得好不好，還看能不能免費影印、有沒有附解答思路、作者有沒有說明資料從哪來。",
    what: [
      "開放指數看兩大塊：可用性（你能不能取得、自己架、自由使用）與透明度（訓練方法與資料有沒有講清楚）。",
      "可用性最高 6 分，透明度最高 12 分，再正規化成 0 到 100。越高越開放。",
      "封閉的商用模型通常很低；把權重、資料與訓練程式都公開的研究模型會很高。",
    ],
    scoreMeaning: [
      "接近 90 分代表幾乎能自己下載、重現、改作；接近個位數通常是只能透過官方 API 使用的封閉模型。",
      "開放 ≠ 比較聰明。很多最強模型開放指數很低，很多最開放的模型智力指數也不高。",
      "這張表適合問：我想自己架、想做研究、想知道它吃了什麼資料時，該挑誰。",
    ],
    dataset: [
      "沒有考題。評分依據是公開資訊：權重、授權、訓練資料、方法論文與程式碼是否公開。",
      "會拆成預訓練資料、微調資料、方法揭露、模型可用性等項目。",
    ],
    howTested: [
      "研究員根據公開文件與授權條款打分，不是讓模型答題。",
      "同一套規則套到每家模型，才有辦法做成排行榜。",
    ],
    method: [
      "把「拿不拿得到」和「看不看得懂它怎麼做的」分開計分，避免只會喊 open 的行銷話術。",
      "授權是否寬鬆、資料能不能真的下載，都會影響分數。",
    ],
    studentTips: [
      "想聊天選智力指數；想自己架或做專題研究，再看開放指數。",
      "「開源」三個字很模糊，這張表就是在把它量化。",
    ],
    related: ["intelligence-index"],
    facts: [
      { label: "分數範圍", value: "0–100" },
      { label: "可用性", value: "最高 6 分" },
      { label: "透明度", value: "最高 12 分" },
      { label: "考試方式", value: "文件與授權審查" },
    ],
  },
  {
    slug: "aa-briefcase",
    name: "公文包：長程知識工作",
    nameEn: "AA-Briefcase",
    category: "agent",
    status: "active",
    tags: ["代理人", "報告與簡報", "私有評測"],
    officialUrl: "https://artificialanalysis.ai/evaluations/aa-briefcase",
    oneLiner:
      "模擬好幾週的職場專案：讀一堆雜檔，交出試算表、簡報或備忘錄。",
    classroomAnalogy:
      "像跨週專題：老師給你 Slack 紀錄、問卷、PDF 與會議逐字稿，你要自己整理，週週交成果，不能問老師提示。",
    what: [
      "這是 Artificial Analysis 自己做的私有評測，專門看「長時間、很亂、很像上班」的知識工作。",
      "每個情境像一個多週專案，一週有 2 到 5 個任務。目前每個任務獨立跑，不會把模型上週自己交的作業接著用。",
      "模型要在沒有網路的沙盒裡，只靠提供的原始檔案，產出指定檔名的成品。",
    ],
    scoreMeaning: [
      "頭條分數是 Elo：綜合「有沒有做到清單上的硬要求」、「分析深不深」、「成品漂不專業」。",
      "硬要求用是非題評分，沒有半分；分析品質與呈現則是兩份作業匿名對打。",
      "Elo 高代表整體成品比較常贏過其他模型，不代表每一頁都完美。",
    ],
    dataset: [
      "91 個任務、4 個情境。來源混合真實、改寫與合成檔案，例如信件、試算表、訪談稿、市調與董事會資料。",
      "完整題庫不公開，避免被背答案；公開的精簡例子在 Hugging Face 的 AA-Briefcase-Lite。",
    ],
    howTested: [
      "用 Stirrup 代理人框架，在 E2B 沙盒裡最多走 500 步。",
      "主要工具是執行程式／終端機指令；有視覺能力的模型可以看圖。沙盒沒有網路。",
      "做完要呼叫 finish 交出檔案路徑；真的做不了才能放棄。",
    ],
    method: [
      "閱卷用三位不同公司的前沿模型當評審團，降低「自己人給自己人打高分」。",
      "同一條評分規則固定由同一位評審看，方便跨模型比較。",
      "每個任務測 1 次，pass@1。",
    ],
    studentTips: [
      "這測的是專題能力，不是選擇題智商。",
      "若你未來想用 AI 幫你做報告，這比學科選擇題更接近真實使用。",
    ],
    related: ["gdpval-aa", "apex-agents-aa", "harvey-lab-aa", "aa-analyst"],
    facts: [
      { label: "任務數", value: "91（4 情境）" },
      { label: "步數上限", value: "500" },
      { label: "計分", value: "Elo + 評分規" },
      { label: "網路", value: "沙盒離線" },
    ],
  },
  {
    slug: "gdpval-aa",
    name: "GDPval-AA v2 真實職業任務",
    nameEn: "GDPval-AA v2",
    category: "agent",
    status: "index",
    tags: ["智力指數 20%", "Elo", "44 種職業"],
    officialUrl: "https://artificialanalysis.ai/evaluations/gdpval-aa",
    oneLiner:
      "讓 AI 做會影響經濟的真實工作：44 種職業、9 大產業，交出真正的檔案。",
    classroomAnalogy:
      "不是考選擇題，而是請你扮演會計、顧問、分析師，在有電腦與瀏覽器的辦公室裡，限時交出客戶要的成品。",
    what: [
      "題目來自 OpenAI 的 GDPval 公開資料，Artificial Analysis 用自己的框架重測，所以叫 GDPval-AA。",
      "v2 升級了沙盒軟體、把人類專家成品錨在 Elo 1000、改用三位評審，步數上限加到 250，也允許模型中途放棄。",
      "它是目前智力指數裡權重最重的一項（20%）。",
    ],
    scoreMeaning: [
      "頭條是 Elo。人類專家大約 1000 分。模型若遠低於 1000，代表成品整體還明顯不如熟練的人。",
      "進智力指數時，會把 Elo 凍結並縮放到 0–1：clamp((Elo − 500) / 2000)。",
      "這不是正確率。一份報告可以文筆很好但漏了關鍵數字，評審就會判輸。",
    ],
    dataset: [
      "公開金標資料約 220 件任務，覆蓋美國 GDP 重要產業的 44 種職業。",
      "有些 Office 檔缺中繼資料，官方只修到能用 LibreOffice 打開，不改內容版面。",
    ],
    howTested: [
      "模型在 Stirrup 裡得到：上網搜尋、抓網頁、執行指令、看圖（若支援）、完成、放棄。",
      "每個任務一個新沙盒，裡面預裝大量辦公與資料套件。",
      "繳交後進入第二階段：評審盲測兩份成品，選比較好的。",
    ],
    method: [
      "把很多場兩兩對決擬合成分數（Bradley-Terry），再算信賴區間。",
      "三位不同實驗室的前沿模型輪流當評審，降低單一閱卷老師的偏見。",
    ],
    studentTips: [
      "這最接近「AI 能不能上班」。分數高代表比較常交出像樣的職業成品。",
      "因為是互相比，新模型加入後，舊的 Elo 在指數裡會被凍結，以免排行榜一直晃。",
    ],
    related: ["intelligence-index", "aa-briefcase", "apex-agents-aa"],
    facts: [
      { label: "任務", value: "220" },
      { label: "職業", value: "44 種" },
      { label: "指數權重", value: "20%" },
      { label: "計分", value: "Elo（人類=1000）" },
    ],
  },
  {
    slug: "apex-agents-aa",
    name: "APEX-Agents-AA 專業服務代理人",
    nameEn: "APEX-Agents-AA",
    category: "agent",
    status: "active",
    tags: ["投行顧問法律", "跨軟體", "評分規"],
    officialUrl: "https://artificialanalysis.ai/evaluations/apex-agents-aa",
    oneLiner:
      "在模擬的投行、顧問、法律辦公室裡，跨好幾個軟體把長任務做完。",
    classroomAnalogy:
      "像實習：你要自己找 Excel、郵件、資料庫這些「辦公室 App」，一步步完成主管交辦，最後交成果接受檢查清單。",
    what: [
      "這是 Artificial Analysis 重做 Mercor 的 APEX-Agents。測長時間、跨應用程式的專業服務工作。",
      "公開資料約 480 題，他們實際測 452 題（去掉兩個有外部依賴的投行世界）。",
    ],
    scoreMeaning: [
      "每題做 3 次，用 pass@1。一次要通過該題全部評分規才算過。",
      "分數是「平均過關率」。50% 代表大約一半任務能完整做到檢查清單。",
      "數字不能直接跟 Mercor 原版比，因為框架與提示詞不同。",
    ],
    dataset: [
      "公開資料在 Hugging Face 的 mercor/apex-agents。",
      "情境涵蓋投資銀行、管理顧問與法律，任務需要跨多個模擬應用。",
    ],
    howTested: [
      "用 Stirrup，最多 200 步。代理人先只拿到很少工具，要自己查、加入、移除 MCP 工具。",
      "還有待辦清單與 finish。沒有正式交卷就不閱卷。",
      "閱卷看最終答案，也看檔案系統前後差異。",
    ],
    method: [
      "本地檔案評分器搭配評分規；LLM 評審使用 Gemini 3 Flash（低推理）。",
      "工具逾時 60 秒，輸出過長會被截斷，避免模型被海量文字淹沒。",
    ],
    studentTips: [
      "這測「會不會在複雜辦公室軟體裡把專案做完」，不是背公式。",
    ],
    related: ["aa-briefcase", "gdpval-aa", "enterpriseops-gym-aa"],
    facts: [
      { label: "任務", value: "452 / 480" },
      { label: "重複", value: "3 次" },
      { label: "計分", value: "評分規全過才算" },
      { label: "步數", value: "最多 200" },
    ],
  },
  {
    slug: "aa-analyst",
    name: "分析師代理人",
    nameEn: "AA-AnalystAgent",
    category: "professional",
    status: "active",
    tags: ["試算表", "資料分析", "要很穩"],
    officialUrl: "https://artificialanalysis.ai/evaluations/aa-analyst-agent",
    oneLiner:
      "給一堆試算表與文件，問商業或科學上的數字題，看 AI 能不能當可靠的分析師。",
    classroomAnalogy:
      "像研究課：老師丟給你很多 Excel 與報告，問「今年支出比去年高幾％」。你要自己找欄位、算對，而且每次重算都要一樣。",
    what: [
      "80 道量化題，跨 14 個領域，例如能源成本、政府預算、水文氣象、財報與專案時程。",
      "五種典型工作：找來源、篩選加總、比率與敏感度、損益模型、現金／資產負債／評價。",
      "題庫保密，降低被背答案的風險。",
    ],
    scoreMeaning: [
      "頭條是 pass^5：同一題做 5 次必須全對。偶爾算對不夠，要穩。",
      "也會附 pass@1（平均一次成功率）與 pass@5（5 次裡至少對一次），用來分開看「穩定性」與「天花板」。",
      "答案通常只要數字或標籤，不要寫一堆解釋。格式錯（該百分比卻寫小數）也可能算錯。",
    ],
    dataset: [
      "每題搭配一組 xlsx / docx 原始檔，標準答案對模型保密，只給閱卷老師。",
      "標準答案由人工撰寫並經 Artificial Analysis 複核。",
    ],
    howTested: [
      "Stirrup 沙盒，Python 3.12 與常見資料套件已裝好，最多 100 步。",
      "可以執行程式、抓網址、看圖，最後只交答案本身。",
    ],
    method: [
      "先用 LLM 評審對錯，再用「數字等價」規則覆蓋明顯算對的情況，避免格式害你零分。",
      "數字預檢只會救人、不會判死，拿不准的仍聽評審。",
    ],
    studentTips: [
      "這很像「作業要驗算」。AI 若五次裡只有兩次對，上班還是不能用。",
    ],
    related: ["aa-briefcase", "scicode", "mlcr-aa"],
    facts: [
      { label: "題數", value: "80 題 / 14 領域" },
      { label: "頭條分數", value: "pass^5" },
      { label: "重複", value: "5 次" },
      { label: "指數", value: "不列入智力指數" },
    ],
  },
  {
    slug: "automationbench-aa",
    name: "自動化流程評測",
    nameEn: "AutomationBench-AA",
    category: "agent",
    status: "active",
    tags: ["SaaS", "API", "防護欄"],
    officialUrl:
      "https://artificialanalysis.ai/evaluations/automationbench-aa",
    oneLiner:
      "在模擬的 Gmail、Slack、Salesforce 等軟體裡，用 API 把跨 App 流程做完，且不能踩紅線。",
    classroomAnalogy:
      "像社團幹部要同時用表單、社團群組與雲端硬碟辦活動。事情要做成，但亂刪資料或寄錯信就整場零分。",
    what: [
      "這是 Zapier AutomationBench 的獨立重跑，測模型能不能完成跨多個模擬商務軟體的流程。",
      "657 題私有保留集，涵蓋財務、人資、行銷、營運、業務與客服。",
    ],
    scoreMeaning: [
      "每題先看有沒有違反防護欄。踩到任何一條，該題直接 0。",
      "沒踩紅線，分數才是「完成了幾成目標」。",
      "所以高分代表「又做對又守規矩」，不是只會猛按按鈕。",
    ],
    dataset: [
      "資料集版本 1.0 的 657 題保留分割。模擬 App 包含 Gmail、Google 試算表、Slack、Salesforce、Zendesk、Jira、HubSpot 等。",
      "領域互斥；App 可以重疊，一題可能同時算進好幾個 App。",
    ],
    howTested: [
      "多輪環境，最多 50 步，用結構化工具呼叫 REST API。",
      "只測一次。基礎建設錯誤或缺題也算 0。",
    ],
    method: [
      "用程式檢查最終環境狀態，不用另一個 AI 當閱卷老師。",
      "斷言語句分成「目標必須達成」與「防護欄不能破」。",
    ],
    studentTips: [
      "真實世界裡，亂自動化比不做更可怕。這項特別懲罰「幫倒忙」。",
    ],
    related: ["enterpriseops-gym-aa", "tau3-banking", "apex-agents-aa"],
    facts: [
      { label: "任務", value: "657" },
      { label: "步數", value: "最多 50" },
      { label: "閱卷", value: "程式檢查狀態" },
      { label: "紅線", value: "一破即 0 分" },
    ],
  },
  {
    slug: "harvey-lab-aa",
    name: "Harvey 法律代理人",
    nameEn: "Harvey LAB-AA",
    category: "professional",
    status: "active",
    tags: ["法律", "評分規", "私有 120 題"],
    officialUrl: "https://artificialanalysis.ai/evaluations/harvey-lab-aa",
    oneLiner:
      "讀案件資料，寫律師備忘錄、揭露清單或證詞摘要，再一條條對清單打勾。",
    classroomAnalogy:
      "像公民科加深版：給你一疊合約與筆錄，要寫出指定格式的報告。漏一個必填項目就那一條不及格。",
    what: [
      "Harvey 的 Legal Agent Benchmark，120 題私有任務、24 個法律領域。",
      "模型在離線沙盒讀案件，產出 .docx / .xlsx / .md 等指定檔名成品。",
      "這是獨立重做，分數不能直接跟 Harvey 自己公布的比。",
    ],
    scoreMeaning: [
      "預設看「準則通過率」：所有是非檢查項的平均通過比例。",
      "也報告「全過率」：整題每一條都過才算。後者嚴很多。",
      "檔名必須完全正確，差一個字視同沒交。",
    ],
    dataset: [
      "頭條數字來自 120 題私有集。公開只能看到少數範例任務。",
      "輸入是合約、備忘錄、證詞等案件材料。",
    ],
    howTested: [
      "Stirrup，最多 200 步，沒有網路，也不提供 Harvey 原版的文書產生腳本。",
      "這是在測模型「生的能力」，不是測有沒有現成範本工具。",
    ],
    method: [
      "單一 LLM 評審（Gemini 3.1 Pro）依評分規逐條給過或不過，沒有半分。",
      "評審只看抽出來的文字，不另外上網查證。",
    ],
    studentTips: [
      "法律工作最怕漏點。這項用檢查清單逼模型細心，不是比文筆華麗。",
    ],
    related: ["aa-briefcase", "apex-agents-aa", "mlcr-aa"],
    facts: [
      { label: "任務", value: "120 / 24 領域" },
      { label: "計分", value: "準則通過率" },
      { label: "步數", value: "最多 200" },
      { label: "檔名", value: "必須完全符合" },
    ],
  },
  {
    slug: "enterpriseops-gym-aa",
    name: "企業作業健身房",
    nameEn: "EnterpriseOps-Gym-AA",
    category: "professional",
    status: "active",
    tags: ["企業系統", "資料庫驗收", "ServiceNow"],
    officialUrl:
      "https://artificialanalysis.ai/evaluations/enterpriseops-gym-aa",
    oneLiner:
      "在模擬的人資、客服、IT、信件、日曆等系統裡，把多步驟流程做完，最後看資料庫有沒有變成正確狀態。",
    classroomAnalogy:
      "像社團網頁後台實習：你要請假、改班表、寄通知。老師不看你點了哪些按鈕，只看最後資料庫對不對，有沒有誤刪別人的資料。",
    what: [
      "ServiceNow EnterpriseOps-Gym 的獨立實作。測有狀態、要連續決策的企業流程。",
      "八個領域：客服、人資、IT 服務、信件、日曆、團隊協作、雲端硬碟，以及要跨系統的混合任務。",
      "只跑「神諭工具模式」：該用的工具直接給齊，專心測規劃與執行，不額外考找工具。",
    ],
    scoreMeaning: [
      "頭條是嚴格 pass@1：每條 SQL 驗證都過才算成功。",
      "也看「驗證器通過率」，了解是完全不會還是只差一點。",
      "不跟原論文分數直接比。",
    ],
    dataset: [
      "1,117 道神諭模式任務。每題有自己的 SQLite 與可重置伺服器。",
      "公開資料在 Hugging Face 的 ServiceNow-AI/EnterpriseOps-Gym。",
    ],
    howTested: [
      "Stirrup，最多 100 步，每題 3 次取平均。",
      "系統透過 MCP 即時給工具。做完拍攝資料庫，用官方 SQL 驗證器檢查。",
    ],
    method: [
      "看結果不看路徑：步驟不同沒關係，最後狀態對、沒副作用、沒越權才算。",
      "驗證包含目標完成、狀態完整、權限流程，以及沒有意外副作用。",
    ],
    studentTips: [
      "這很像「過程可以不同，答案狀態要對」的實驗課評分。",
    ],
    related: ["automationbench-aa", "itbench-aa", "tau3-banking"],
    facts: [
      { label: "任務", value: "1,117" },
      { label: "領域", value: "8 + 混合" },
      { label: "閱卷", value: "SQL 狀態檢查" },
      { label: "步數", value: "最多 100" },
    ],
  },
  {
    slug: "tau3-banking",
    name: "τ³-Banking 銀行客服",
    nameEn: "𝜏³-Banking",
    category: "agent",
    status: "index",
    tags: ["智力指數 14%", "雙人控制", "知識庫"],
    officialUrl: "https://artificialanalysis.ai/evaluations/tau3-banking",
    oneLiner:
      "AI 客服要在超大銀行知識庫裡找對政策，再連續呼叫工具，把帳戶問題真正處理完。",
    classroomAnalogy:
      "像超難的服務業實習：政策手冊有幾百頁，客人說話又不精準。你不但要會講，還要在系統裡真的把爭議案件開好。",
    what: [
      "來自 Sierra 的 τ-Knowledge。測金融科技客服：又要會查文件，又要會操作後台。",
      "知識庫約 700 份互相關聯的政策（約 19.5 萬 token、21 類產品）。有些工具只寫在文件裡，工具清單不會直接列出來。",
      "智力指數權重 14%，是代理人類第二重的項目。",
    ],
    scoreMeaning: [
      "看後台資料庫最後對不對，例如有沒有真的開爭議、有沒有入暫記貸項。不是看「講得有沒有禮貌」。",
      "97 題各做 5 次，報 pass@1 平均。",
      "對話好聽但系統沒改對，仍是 0 分。",
    ],
    dataset: [
      "完整 97 題，使用上游 tau2-bench v1.0.1 資料與閱卷器。",
      "程式庫公開在 sierra-research/tau2-bench。",
    ],
    howTested: [
      "雙人控制：另有模型扮演顧客。知識檢索用 BM25 + grep。",
      "每題最多 200 步（含模擬顧客的訊息）。",
      "顧客模擬與部分自然語言斷言，使用 GPT-5.4 Mini。",
    ],
    method: [
      "成功與否由後端狀態決定，比較不容易被「說得好聽」騙到。",
      "v4.1.1 換成最新上游版本，修了一些「先錯後修」軌跡被誤判的問題。",
    ],
    studentTips: [
      "這教我們：客服 AI 的真正考題是「系統有沒有改對」，不是「會不會道歉」。",
    ],
    related: ["tau2-telecom", "automationbench-aa", "intelligence-index"],
    facts: [
      { label: "任務", value: "97" },
      { label: "重複", value: "5 次" },
      { label: "指數權重", value: "14%" },
      { label: "知識庫", value: "約 700 份文件" },
    ],
  },
  {
    slug: "terminal-bench-v21",
    name: "終端機評測 v2.1",
    nameEn: "Terminal-Bench v2.1",
    category: "coding",
    status: "index",
    tags: ["智力指數 16%", "終端機", "89 題"],
    officialUrl:
      "https://artificialanalysis.ai/evaluations/terminal-bench-2",
    oneLiner:
      "把 AI 丟進黑色終端機，做軟體工程、系統管理、資料處理、訓練模型與資安任務。",
    classroomAnalogy:
      "像資訊課進階：沒有圖形介面，你要自己輸入指令，把環境裝好、程式修好、測試全過。",
    what: [
      "由史丹佛、Laude Institute 與開源社群維護。v2.1 是 v2.0 的驗證更新：題數仍是 89，但修了環境與說明，讓分數比較能反映能力而不是環境坑。",
      "智力指數裡程式類最重的一項（16%）。",
    ],
    scoreMeaning: [
      "每題自帶測試。全部測試通過才算成功，否則失敗。",
      "89 題各做 3 次，報 pass@1 平均。60% 代表大約六成任務能一次做完。",
      "卡在環境 bug 的機會比舊版小，所以比較能拿來比模型。",
    ],
    dataset: [
      "89 道精選題，涵蓋工程、系統管理、資料、訓練與安全。",
      "官方排行也在 tbench.ai。",
    ],
    howTested: [
      "Terminus 2 代理人 + E2B 沙盒。",
      "最多 250 個「回合」（先觀察再規劃一連串指令），每題最多約 2 小時。",
      "這些上限主要是防止模型陷入無限迴圈。",
    ],
    method: [
      "用測試套件自動判對錯，不是老師看感覺。",
      "所有模型同一套代理人框架，減少「有人用比較強的外掛」造成不公平。",
    ],
    studentTips: [
      "會聊天 ≠ 會在終端機把事情做完。這項專門拆穿這種落差。",
    ],
    related: ["terminal-bench-hard", "scicode", "livecodebench"],
    facts: [
      { label: "任務", value: "89" },
      { label: "重複", value: "3 次" },
      { label: "指數權重", value: "16%" },
      { label: "成功條件", value: "測試全過" },
    ],
  },
  {
    slug: "aa-lcr",
    name: "長文推理",
    nameEn: "AA-LCR / Long Context Reasoning",
    category: "knowledge",
    status: "index",
    tags: ["智力指數 6%", "超長文件", "開放作答"],
    officialUrl: "https://artificialanalysis.ai/evaluations/aa-lcr",
    oneLiner:
      "把公司年報、法律文件、學術與政府資料一次塞進去，看模型能不能從超長文本裡推理出答案。",
    classroomAnalogy:
      "像發一本 300 頁資料夾，再問跨章節的綜合題。不是找一句原話，而是要對照、整理、下結論。",
    what: [
      "Artificial Analysis 自製，專門測長上下文推理，不是只測「找得到那個詞」。",
      "文件長度約 1 萬到 10 萬 token（用 cl100k_base 計算）。",
      "智力指數權重 6%。",
    ],
    scoreMeaning: [
      "開放式作答，由 LLM 等式檢查器判斷是否等於標準答案，報 pass@1。",
      "上下文不夠長的模型可能整項都做不了。",
      "分數高代表比較能在長文裡抓住重點並正確推理。",
    ],
    dataset: [
      "100 道難題，7 類文件：公司報告、產業報告、政府諮詢、學術、法律、行銷與調查報告。",
      "整項大約 230 份文件、300 萬不重複輸入 token。模型至少要有 128K 上下文。",
    ],
    howTested: [
      "每題 3 次。不給上網工具，得靠讀進去的文件。",
      "閱卷模型在 v4.1.1 換成 GPT-5.6 Luna。",
    ],
    method: [
      "用等式檢查器而不是關鍵字比對，避免「意思對但用詞不同」被誤殺。",
      "屬於智力指數的「一般能力」類。",
    ],
    studentTips: [
      "模型廣告常寫「支援 100 萬上下文」。這項在問：塞得進去之後，還會不會思考。",
    ],
    related: ["mlcr-aa", "aa-omniscience", "intelligence-index"],
    facts: [
      { label: "題數", value: "100" },
      { label: "輸入", value: "約 10 萬 token / 題" },
      { label: "指數權重", value: "6%" },
      { label: "閱卷", value: "LLM 等式檢查" },
    ],
  },
  {
    slug: "aa-omniscience",
    name: "全知：知識與幻覺",
    nameEn: "AA-Omniscience",
    category: "knowledge",
    status: "index",
    tags: ["智力指數 12%", "事實", "不要亂猜"],
    officialUrl: "https://artificialanalysis.ai/evaluations/omniscience",
    oneLiner:
      "考模型知不知道事實，更考它知不知道自己不知道。亂掰會被扣分。",
    classroomAnalogy:
      "像歷史科口試：答對加分，亂編會倒扣，誠實說「我不確定」不扣分。這在逼你不要唬爛。",
    what: [
      "6,000 題，涵蓋 42 個跟經濟相關的主題，分六大領域：商業、人文社科、健康、法律、軟體工程、理工數學。",
      "題目來自權威與產業來源，測事實回憶與「知識校準」。",
      "智力指數權重 12%，拆成正確率 8% 與「不幻覺率」4%。",
    ],
    scoreMeaning: [
      "獨立的 Omniscience Index 大約從 -100 到 100：答對加分、幻覺減分、放棄保持中性。",
      "一個「對一半、錯一半」的模型指數會接近 0。寧可放棄也不要亂猜的模型，往往比愛吹的模型好看。",
      "進智力指數時，正確率與不幻覺率是分開加進去的，所以「很會講但常講錯」會被看見。",
    ],
    dataset: [
      "公開子集在 Hugging Face：ArtificialAnalysis/AA-Omniscience-Public。",
      "每題有標準答案，回答被標成正確、錯誤、部分正確或未作答。",
    ],
    howTested: [
      "開放作答，每題 1 次。",
      "GPT-5.6 Luna 當閱卷模型。",
    ],
    method: [
      "刻意獎勵「知道自己的邊界」。這跟很多只看正確率的知識考不同。",
      "不同領域領先的模型可能來自不同公司，選模型時該看你在乎哪一科。",
    ],
    studentTips: [
      "生活中用 AI 查事實，這項比「很會聊天」更重要。",
      "看到很高的聊天好感，也要查它的幻覺率。",
    ],
    related: ["hle", "mmlu-pro", "intelligence-index"],
    facts: [
      { label: "題數", value: "6,000 / 42 主題" },
      { label: "指數權重", value: "12%" },
      { label: "特別之處", value: "幻覺會扣分" },
      { label: "論文", value: "arXiv:2511.13029" },
    ],
  },
  {
    slug: "scicode",
    name: "SciCode 科學程式",
    nameEn: "SciCode",
    category: "coding",
    status: "index",
    tags: ["智力指數 8%", "實驗室程式", "單元測試"],
    officialUrl: "https://artificialanalysis.ai/evaluations/scicode",
    oneLiner:
      "科學家出的程式題：要寫出能通過數值測試的 Python，而且常常要一步一步解。",
    classroomAnalogy:
      "像物化實驗課加資訊課。不是印 Hello World，而是把公式寫成函式，數字對了測試才會過。",
    what: [
      "80 道實驗室等級問題，拆成 288 個測試集子問題，跨 16 個科學領域。",
      "智力指數權重 8%。提示會附上科學家註解的背景知識。",
    ],
    scoreMeaning: [
      "看子問題通過率：寫出的 Python 必須通過全部單元測試。",
      "pass@1，每題重測 3 次再平均。",
      "程式能跑但數值不對，仍是錯。",
    ],
    dataset: [
      "測試集 288 子問題。官網 scicode-bench.github.io，論文 arXiv:2407.13168。",
      "前面步驟的程式會當成下一步的基礎，很像在寫一份連續的實驗程式。",
    ],
    howTested: [
      "給題目步驟、背景、函式標題與允許的套件，模型只寫下一步。",
      "不準亂加範例或測試程式。抽出 ```python``` 區塊後真正執行。",
    ],
    method: [
      "用執行結果判分，不是看程式好不好看。",
      "這比一般演算法題更接近科研寫程式。",
    ],
    studentTips: [
      "想當科研或工程方向，這比普通選擇題更能看出「會不會把科學變成程式」。",
    ],
    related: ["terminal-bench-v21", "livecodebench", "critpt"],
    facts: [
      { label: "題目", value: "80 題 / 288 子題" },
      { label: "學科", value: "16 個" },
      { label: "指數權重", value: "8%" },
      { label: "判分", value: "單元測試" },
    ],
  },
  {
    slug: "hle",
    name: "人類最後一考",
    nameEn: "Humanity's Last Exam",
    category: "science",
    status: "index",
    tags: ["智力指數 12%", "專家題", "開放作答"],
    officialUrl: "https://artificialanalysis.ai/evaluations/hle",
    oneLiner:
      "2,500 題專家審過的超難學術題，被設計成「人類學術選擇／簡答的最後一場閉卷考」。",
    classroomAnalogy:
      "把各科奧林匹亞、研究所資格考與最難的學測非選混在一起。連很多專家都覺得棘手。",
    what: [
      "由 Center for AI Safety（Dan Hendrycks 團隊）推出。涵蓋數學、科學與人文。",
      "完整集 2,500 題；Artificial Analysis 用 2,158 題純文字版，方便不會看圖的模型也能比。",
      "智力指數權重 12%。",
    ],
    scoreMeaning: [
      "開放作答，LLM 等式檢查後算 pass@1。現在最頂尖模型也遠不到滿分，這是刻意的。",
      "分數從 10% 升到 20% 是很大進步，不要用學測 60 分及格的感覺來看。",
      "出題時曾用某些舊模型當「反面教材」挑難題，那些舊模型的分數可能被壓低，不宜跟新模型直接比。",
    ],
    dataset: [
      "Hugging Face：cais/hle。2025 年 5 月修訂版。",
      "題目經領域專家審核，目標是成為閉卷學術評測的終點。",
    ],
    howTested: [
      "每題 1 次。用改寫自原論文的等式檢查提示，閱卷模型為 GPT-5.6 Luna。",
      "不給搜尋工具，靠模型自己的知識與推理。",
    ],
    method: [
      "因為是開放作答，閱卷老師必須判斷「等不等價」，不能只比字串。",
      "它測的是前沿學術能力，不是日常常識。",
    ],
    studentTips: [
      "這是給最強模型的天花板考試。低分不代表對高中作業沒用。",
    ],
    related: ["gpqa-diamond", "critpt", "aa-omniscience"],
    facts: [
      { label: "題數", value: "2,158 文字題" },
      { label: "指數權重", value: "12%" },
      { label: "形式", value: "開放作答" },
      { label: "論文", value: "arXiv:2501.14249" },
    ],
  },
  {
    slug: "critpt",
    name: "CritPt 研究級物理",
    nameEn: "CritPt",
    category: "science",
    status: "index",
    tags: ["智力指數 6%", "物理研究", "官方閱卷伺服器"],
    officialUrl: "https://artificialanalysis.ai/evaluations/critpt",
    oneLiner:
      "尚未公開解答的前沿物理題，答案可能是數字、符號或一段 Python 函式。",
    classroomAnalogy:
      "比指考物理難一個量級，比較像大學研究群組的小問題：要想方法，還要把想法寫成算式或程式。",
    what: [
      "研究級物理推理，題目刻意未公開完整解答，減少被背。",
      "官方網站說 71 道綜合挑戰；Artificial Analysis 實作 70 道測試集挑戰（範例題不算）。",
      "智力指數權重 6%。",
    ],
    scoreMeaning: [
      "每題 5 次，pass@1。由官方閱卷伺服器判定。",
      "對了就是對，格式不對或符號不等價都可能錯。",
      "分數低很正常，這本來就不是高中段考。",
    ],
    dataset: [
      "Hugging Face：CritPt-Benchmark/CritPt。涵蓋多個物理子領域。",
      "答案型態：數值、SymPy 符號、或用測試案例檢查的 Python 函式。",
    ],
    howTested: [
      "兩步：先推理解題，再把答案收成指定格式。兩步的 token 都算成本。",
      "不經過官方伺服器，外面的人很難自己複現同樣分數。",
    ],
    method: [
      "跟原團隊合作只跑 challenge 級。",
      "用官方伺服器是為了保護未公開題解，同時保持一致。",
    ],
    studentTips: [
      "這在看「能不能像研究生一樣攻物理難題」，不是高中公式背誦。",
    ],
    related: ["hle", "gpqa-diamond", "scicode"],
    facts: [
      { label: "挑戰數", value: "70（測試集）" },
      { label: "重複", value: "5 次" },
      { label: "指數權重", value: "6%" },
      { label: "閱卷", value: "官方伺服器" },
    ],
  },
  {
    slug: "gpqa-diamond",
    name: "GPQA Diamond 博士科學題",
    nameEn: "GPQA Diamond",
    category: "science",
    status: "index",
    tags: ["智力指數 6%", "四選一", "Google 也難救"],
    officialUrl: "https://artificialanalysis.ai/evaluations/gpqa-diamond",
    oneLiner:
      "生物、物理、化學裡最硬的 198 題。博士約 65% 對，會搜尋的非專家只有約 34%。",
    classroomAnalogy:
      "像研究所資格考選擇題。題目寫得讓你就算上網，也很难靠關鍵字找到現成答案。",
    what: [
      "GPQA 全名是 Graduate-Level Google-Proof Q&A，意思是「研究所等級、不太能靠 Google 秒解」。",
      "Diamond 是原作者挑出的最高品質子集：專家會、多數非專家不會。",
      "智力指數權重 6%。",
    ],
    scoreMeaning: [
      "四選一，用規則抓「Answer: C」後對答案，pass@1，每題 5 次。",
      "亂猜期望大約 25%。博士 65% 是人類參考線。",
      "模型若接近或超過博士，代表科學推理已經非常強；若只比亂猜好一點，就還差得遠。",
    ],
    dataset: [
      "全 GPQA 448 題，這裡只用 Diamond 198 題。",
      "只有生物、物理、化學，沒有歷史或文學。",
    ],
    howTested: [
      "零樣本選擇題。提示要求最後一行寫 Answer: A/B/C/D。",
      "不給搜尋。這是在測模型自己會不會，不是測它會不會上網。",
    ],
    method: [
      "選擇題能自動、穩定地判分，所以很適合作跨模型比較。",
      "「Google-proof」是出題目標，不代表世界上完全搜不到。",
    ],
    studentTips: [
      "這是科學推理的經典尺。很多論文都會報 Diamond。",
      "不要跟學測生物 80 分比，難度完全不同。",
    ],
    related: ["hle", "critpt", "mmlu-pro"],
    facts: [
      { label: "題數", value: "198" },
      { label: "形式", value: "四選一" },
      { label: "人類專家", value: "約 65%" },
      { label: "指數權重", value: "6%" },
    ],
  },
  {
    slug: "itbench-aa",
    name: "ITBench-AA 網站可靠性",
    nameEn: "ITBench-AA",
    category: "professional",
    status: "active",
    tags: ["Kubernetes", "找根因", "SRE"],
    officialUrl: "https://artificialanalysis.ai/evaluations/itbench-aa",
    oneLiner:
      "給一份離線的 Kubernetes 事故快照，找出真正害系統掛掉的元件，不要只回報表面症狀。",
    classroomAnalogy:
      "像修電腦：螢幕黑了不一定是螢幕壞掉。你要看紀錄、對時間，找出最源頭的那一個設定或元件。",
    what: [
      "IBM ITBench 的獨立實作，測網站可靠性工程（SRE）的根因分析。",
      "59 個事故：40 個公開、19 個私有。頭條是兩部分平均。",
    ],
    scoreMeaning: [
      "主分數是「完整召回下的精確率」。漏掉任何一個真正根因，該次直接 0。",
      "沒漏的話，再看你多報了多少無關元件。亂槍打鳥會被扣。",
      "所以它同時懲罰「沒找齊」與「亂猜一堆」。",
    ],
    dataset: [
      "每個事故是離線快照：警示、事件、追蹤、指標、日誌與拓樸，掛在沙盒 /home/user。",
      "公開加私有共 59 題。",
    ],
    howTested: [
      "Stirrup，最多 100 步，每題 3 次。只能跑指令看快照，最後交一份 JSON。",
      "實體名稱必須是 namespace/Kind/name 這種格式。",
    ],
    method: [
      "LLM 評審只負責把模型講的名字對應到標準實體，真正計分用集合比對。",
      "Pod 與對應的 Deployment 可能算同一組，避免同一根因被算兩次。",
    ],
    studentTips: [
      "這很像除錯：找到源頭比列出所有警報更重要。",
    ],
    related: ["enterpriseops-gym-aa", "terminal-bench-v21"],
    facts: [
      { label: "事故數", value: "59" },
      { label: "計分", value: "精確率＠完整召回" },
      { label: "步數", value: "最多 100" },
      { label: "輸出", value: "結構化 JSON" },
    ],
  },
  {
    slug: "mmmu-pro",
    name: "MMMU-Pro 看圖學科",
    nameEn: "MMMU-Pro",
    category: "language",
    status: "active",
    tags: ["看圖", "30 學科", "十選一"],
    officialUrl: "https://artificialanalysis.ai/evaluations/mmmu-pro",
    oneLiner:
      "看圖再答大學程度學科題，而且把猜題捷徑盡量堵死。",
    classroomAnalogy:
      "像指考自然加圖表題：圖看不懂就答不出來，而且選項有 10 個，瞎猜更難。",
    what: [
      "MMMU 的加強版，測多模態模型在 30 個學科的能力。",
      "不列入智力指數，因為智力指數主要是文字。",
    ],
    scoreMeaning: [
      "1,730 題、十選一，規則抓答案後算 pass@1。",
      "亂猜約 10%。比四選一更能拉開模型差距。",
      "高分代表真的會看圖推理，不是靠文字捷徑。",
    ],
    dataset: [
      "資料集 MMMU/MMMU_Pro。題目含圖表、試題掃描、實驗裝置等。",
      "加強版拿掉比較容易猜或取巧的題。",
    ],
    howTested: [
      "每題 1 次。模型要同時看圖與文字。",
      "不會看圖的純文字模型基本上沒有公平比較基礎。",
    ],
    method: [
      "用十個選項與去捷徑設計，降低「沒看圖也能蒙對」。",
    ],
    studentTips: [
      "若你常用 AI 看講義截圖或實驗圖，這項比純文字指數更相關。",
    ],
    related: ["mmlu-pro", "global-mmlu-lite"],
    facts: [
      { label: "題數", value: "1,730" },
      { label: "選項", value: "10 個" },
      { label: "學科", value: "30" },
      { label: "指數", value: "不列入智力指數" },
    ],
  },
  {
    slug: "ifbench",
    name: "IFBench 照指示作答",
    nameEn: "IFBench",
    category: "knowledge",
    status: "active",
    tags: ["守規則", "格式", "曾列入指數"],
    officialUrl: "https://artificialanalysis.ai/evaluations/ifbench",
    oneLiner:
      "不管內容會不會，先看你有沒有乖乖照奇怪但明確的格式要求交卷。",
    classroomAnalogy:
      "老師說「第二段必須恰好 4 句、禁止用逗號、最後用 JSON」。內容對但格式錯，還是不及格。",
    what: [
      "測精確的指令遵循，尤其是沒見過的限制：計數、排版、改句子等。",
      "官方介紹常說 58 種可驗證限制；Artificial Analysis 用單輪 294 題。",
      "v4.1 後不再計入智力指數，但仍持續測新模型。",
    ],
    scoreMeaning: [
      "294 題各 5 次，報題目層級的平均正確率（pass@1）。",
      "高分代表比較聽得懂、也做得到瑣碎限制。",
      "這不是知識考。很聰明但愛自由發揮的模型，這裡可能摔跤。",
    ],
    dataset: [
      "allenai/IFBench_test 的單輪集。不做多輪版。",
    ],
    howTested: [
      "用官方程式自動檢查輸出，不靠老師給印象分。",
      "採寬鬆模式：會試著拿掉首行、末行或星號再檢查，避免多餘的前後綴害你零分。",
    ],
    method: [
      "限制都可以程式驗證，所以很客觀。",
      "從指數拿掉，是因為現在更想強調代理人與真實工作，不是格式體操。",
    ],
    studentTips: [
      "你要 AI 產出指定格式（表格、字數、禁止某詞）時，這項特別有參考價值。",
    ],
    related: ["aa-omniscience", "mmlu-pro"],
    facts: [
      { label: "題數", value: "294（單輪）" },
      { label: "重複", value: "5 次" },
      { label: "閱卷", value: "官方規則程式" },
      { label: "指數", value: "v4.1 起移除" },
    ],
  },
  {
    slug: "terminal-bench-hard",
    name: "終端機評測 Hard（舊版）",
    nameEn: "Terminal-Bench Hard",
    category: "coding",
    status: "legacy",
    tags: ["舊版", "已被 v2.1 取代", "44 題"],
    officialUrl:
      "https://artificialanalysis.ai/evaluations/terminalbench-hard",
    oneLiner:
      "舊的困難終端機任務集。現在已被 Terminal-Bench v2.1 取代，只留著方便看歷史。",
    classroomAnalogy:
      "像舊課綱的困難實作考。題目精神還在，但計分環境已換新。不要拿它跟新榜直接比。",
    what: [
      "v4.1 之前曾是智力指數的一員。現在屬退役／被取代。",
      "從 terminal-bench-core 的 hard 子集選 44 題（有些因外部依賴被拿掉）。",
    ],
    scoreMeaning: [
      "測試全過才算成功，3 次平均 pass@1。",
      "舊分數用來了解歷史，不代表現在官方總排名。",
    ],
    dataset: [
      "44 題，例如編譯、設伺服器、訓練小模型、除錯、甚至玩文字遊戲。",
      "資料版本釘在 2025-08-14 的某個 commit。",
    ],
    howTested: [
      "同樣用 Terminus 2。最多 100 回合、2 小時，累積輸入最多 100 萬 token。",
    ],
    method: [
      "與 v2.1 相比，題數較少、上限較緊。v2.1 提高回合上限並取消 token 上限。",
    ],
    studentTips: [
      "寫報告請引用 v2.1。這頁是為了讓你看懂舊新聞在說什麼。",
    ],
    related: ["terminal-bench-v21"],
    facts: [
      { label: "任務", value: "44" },
      { label: "狀態", value: "已被 v2.1 取代" },
      { label: "重複", value: "3 次" },
      { label: "計分", value: "測試全過" },
    ],
  },
  {
    slug: "tau2-telecom",
    name: "τ²-Bench 電信客服（舊版）",
    nameEn: "𝜏²-Bench Telecom",
    category: "agent",
    status: "legacy",
    tags: ["舊版", "雙人控制", "已被銀行版取代"],
    officialUrl: "https://artificialanalysis.ai/evaluations/tau2-bench",
    oneLiner:
      "模擬電信客服：AI 與顧客都要動手，一起把手機上網或簡訊修好。",
    classroomAnalogy:
      "客服叫你關掉飛航模式、重開行動數據，你（由另一個 AI 扮演）真的去按，世界狀態才會變。",
    what: [
      "Sierra 的 τ²-Bench 電信領域。v4.1 起被 τ³-Banking 取代，不再進智力指數。",
      "重點是雙人控制：客服與使用者都能改同一個世界。",
    ],
    scoreMeaning: [
      "114 題各 3 次，看世界狀態有沒有修好，報 pass@1。",
      "例如行動數據最後到底通不通，不是看對話舒不舒服。",
    ],
    dataset: [
      "電信領域從 2,285 道程式化任務中抽出 114 題，意圖涵蓋服務、行動數據、MMS。",
      "公開在 sierra-research/tau2-bench。",
    ],
    howTested: [
      "預設雙人控制，使用獨立的模擬顧客。最多 100 步。",
      "顧客模擬曾使用 Qwen3 235B，方便設定一致。",
    ],
    method: [
      "任務由原子子任務組合，並用斷言函式驗證完成。",
      "退役是因為新版銀行任務更能代表「查大知識庫 + 改後台」的能力。",
    ],
    studentTips: [
      "看到舊文章寫 τ²-Bench，把它當「客服雙人合作」的概念即可，新榜請看 τ³-Banking。",
    ],
    related: ["tau3-banking"],
    facts: [
      { label: "任務", value: "114" },
      { label: "狀態", value: "已被 τ³-Banking 取代" },
      { label: "重複", value: "3 次" },
      { label: "成功條件", value: "世界狀態正確" },
    ],
  },
  {
    slug: "mmlu-pro",
    name: "MMLU-Pro 進階學科選擇題",
    nameEn: "MMLU-Pro",
    category: "language",
    status: "legacy",
    tags: ["12,000 題", "十選一", "舊指數成員"],
    officialUrl: "https://artificialanalysis.ai/evaluations/mmlu-pro",
    oneLiner:
      "研究所程度的跨學科選擇題，10 個選項，比舊的 MMLU 更重推理、更難蒙對。",
    classroomAnalogy:
      "把各科很難的學測／指考選擇題合成一包，而且每題有 10 個陷阱。背誦不夠，要想。",
    what: [
      "MMLU 的加強版：約 12,000 題、14 個學科領域，選項從 4 個變 10 個。",
      "曾是智力指數成員，v4.0 後退役，因為頂尖模型已經太接近滿分，分不出高下。",
    ],
    scoreMeaning: [
      "正確率。亂猜約 10%。現在前段模型可到接近 90%，所以辨識力下降。",
      "仍適合作為「廣博學科知識」的參考，只是不再是最前線的尺子。",
    ],
    dataset: [
      "TIGER-Lab/MMLU-Pro。拿掉原 MMLU 太簡單或有雜訊的題，加入更需推理的題。",
    ],
    howTested: [
      "零樣本十選一，規則抓 Answer: A–J，pass@1。",
      "論文發現用「一步步想」通常比直接猜更好，代表題目真的需要推理。",
    ],
    method: [
      "對提示詞變化比舊 MMLU 更穩定。",
      "退役理由：太容易被現在的強模型刷滿，改成更難的代理人與科學題更有用。",
    ],
    studentTips: [
      "聽到 MMLU 就想「常識選擇題大會考」。Pro 是比較難的哥哥，但現在也逐漸不夠難。",
    ],
    related: ["global-mmlu-lite", "gpqa-diamond", "hle"],
    facts: [
      { label: "題數", value: "約 12,000" },
      { label: "選項", value: "10 個" },
      { label: "領域", value: "14" },
      { label: "狀態", value: "智力指數已移除" },
    ],
  },
  {
    slug: "livecodebench",
    name: "LiveCodeBench 即時程式競賽",
    nameEn: "LiveCodeBench",
    category: "coding",
    status: "legacy",
    tags: ["競賽程式", "抗污染", "舊指數成員"],
    officialUrl: "https://artificialanalysis.ai/evaluations/livecodebench",
    oneLiner:
      "持續從 LeetCode、AtCoder、CodeForces 抓新題，降低「答案早就被訓練過」的風險。",
    classroomAnalogy:
      "像每周更新的程式競賽考卷。舊考古題可能被背過，所以一直出新的。",
    what: [
      "測程式生成、自我修復與執行。v4.0 起不再進智力指數，但仍常見於討論。",
      "Artificial Analysis 不用原團隊為特定模型客製的系統提示，以求公平。",
    ],
    scoreMeaning: [
      "pass@1：寫出的程式真正跑測資要過。",
      "因為題目會隨時間更新，不同月份的分數不一定能硬比。",
    ],
    dataset: [
      "常用 livecodebench/code_generation_lite。題目持續從三大競賽站採集。",
    ],
    howTested: [
      "有的題給起始程式，有的要從標準輸入讀資料、寫到標準輸出。",
      "用規則抽出 python 程式碼再執行。",
    ],
    method: [
      "最大賣點是抗污染：新題比較不可能早早進訓練資料。",
      "從指數拿掉，是為了把位子讓給更像真實工作的終端機與科學程式。",
    ],
    studentTips: [
      "想比較「會不會寫競賽題」，這仍有用；想比較「會不會在真實電腦做事」，看 Terminal-Bench。",
    ],
    related: ["terminal-bench-v21", "scicode"],
    facts: [
      { label: "來源", value: "LeetCode / AtCoder / CodeForces" },
      { label: "計分", value: "pass@1 執行" },
      { label: "特色", value: "持續更新抗污染" },
      { label: "狀態", value: "智力指數已移除" },
    ],
  },
  {
    slug: "math-500",
    name: "MATH-500 競賽數學",
    nameEn: "MATH-500",
    category: "math",
    status: "legacy",
    tags: ["高中競賽", "500 題", "已退役"],
    officialUrl: "https://artificialanalysis.ai/evaluations/math-500",
    oneLiner:
      "從經典 MATH 資料集抽出 500 題，涵蓋代數、幾何、數論等競賽數學。",
    classroomAnalogy:
      "像全國高中數學競賽的混合卷，比學測難，比國際奧林匹亞略常見、較舊。",
    what: [
      "MATH 的 500 題子集，跨六個領域。曾是指數成員，後來被更難、更新的 AIME 等取代，現已退役。",
      "現在很多強模型在這類資料上已經很高分，辨識力變弱。",
    ],
    scoreMeaning: [
      "答對比例。對現在的前沿模型來說，高分比較像「基本盤」，不是決定冠軍的關鍵。",
    ],
    dataset: [
      "HuggingFaceH4/MATH-500。題目來自 Hendrycks 等人的 MATH。",
    ],
    howTested: [
      "模型寫出解題過程與最終答案，再與標準答案比對。",
    ],
    method: [
      "退役主因是太容易被刷、也較舊，可能有污染。",
    ],
    studentTips: [
      "你在學高中競賽數學時，這仍能幫助理解「模型數學考從哪裡開始」。新比較請看 AIME 2025。",
    ],
    related: ["aime-2025", "hle"],
    facts: [
      { label: "題數", value: "500" },
      { label: "程度", value: "高中競賽" },
      { label: "狀態", value: "已退役" },
      { label: "領域", value: "六個數學分支" },
    ],
  },
  {
    slug: "aime-2025",
    name: "AIME 2025 美國數學邀請賽",
    nameEn: "AIME 2025",
    category: "math",
    status: "legacy",
    tags: ["奧林匹亞前哨", "30 題", "整數答案"],
    officialUrl: "https://artificialanalysis.ai/evaluations/aime-2025",
    oneLiner:
      "2025 年美國數學邀請賽 I、II 共 30 題，答案是 000 到 999 的整數。",
    classroomAnalogy:
      "比學測數甲難很多，是美國通往奧林匹亞國家隊的邀請賽。每題答案是三位數整數，對就是對。",
    what: [
      "AIME 是美國高中頂尖數學競賽。這裡用 2025 完整 30 題。",
      "曾進指數，v4.0 後退役，因為題數太少、分數波動大，也逐漸被更強模型刷高。",
    ],
    scoreMeaning: [
      "每題 10 次，pass@1。因為只有 30 題，差一題就會讓百分比跳很多。",
      "15/30 對人類已經非常強；對模型也代表競賽推理能力出色。",
    ],
    dataset: [
      "2025 AIME I 與 AIME II 的官方題。答案必須是 1–999 的整數。",
    ],
    howTested: [
      "腳本用 SymPy 正規化數字，必要時再用 LLM 等式檢查當後援。",
    ],
    method: [
      "整數答案讓自動閱卷很乾淨。",
      "題數少是優點也是缺點：乾淨，但不適合當唯一總分。",
    ],
    studentTips: [
      "這是最接近「模型會不會奧林匹亞數學」的公開尺之一。",
    ],
    related: ["math-500", "hle", "critpt"],
    facts: [
      { label: "題數", value: "30" },
      { label: "答案", value: "整數 000–999" },
      { label: "重複", value: "10 次" },
      { label: "狀態", value: "智力指數已移除" },
    ],
  },
  {
    slug: "global-mmlu-lite",
    name: "Global-MMLU-Lite 多語輕量版",
    nameEn: "Global-MMLU-Lite",
    category: "language",
    status: "active",
    tags: ["多國語言", "多語指數", "選擇題"],
    officialUrl:
      "https://artificialanalysis.ai/evaluations/global-mmlu-lite",
    oneLiner:
      "把學科選擇題翻成很多語言，看模型是不是只有英文很強。",
    classroomAnalogy:
      "同一份常識考卷，分別用中文、日文、阿拉伯文、史瓦希利文來考。只會英文的模型會原形畢露。",
    what: [
      "Global-MMLU 的輕量版，支撐 Artificial Analysis 的多語指數。",
      "支援英、中、印地、西、法、阿、孟加拉、葡、印尼、日、斯瓦希里、德、韓、義、約魯巴、緬甸等語言。",
      "不計入（英文）智力指數。",
    ],
    scoreMeaning: [
      "大約 6,000 題（每種語言約 400），四選一，pass@1。",
      "可看總平均，也可看某一語言。中文使用情境請特別看中文分數，不要只看英文總分。",
    ],
    dataset: [
      "CohereLabs/Global-MMLU-Lite。題目考慮不同語言與文化脈絡。",
    ],
    howTested: [
      "每題 1 次，規則抓 A–D。",
    ],
    method: [
      "用同一套題型跨語言，才能分開「很聰明」與「很會英文」。",
    ],
    studentTips: [
      "在台灣用 AI 寫中文報告，這項比純英文智力指數更值得瞄一眼。",
    ],
    related: ["mmlu-pro", "mmmu-pro"],
    facts: [
      { label: "題數", value: "約 6,000" },
      { label: "每種語言", value: "約 400 題" },
      { label: "形式", value: "四選一" },
      { label: "用途", value: "多語指數" },
    ],
  },
  {
    slug: "mlcr-aa",
    name: "醫療長文推理",
    nameEn: "MLCR-AA",
    category: "professional",
    status: "active",
    tags: ["醫療紀錄", "保險理賠", "長文"],
    officialUrl: "https://artificialanalysis.ai/evaluations/mlcr-aa",
    oneLiner:
      "讀又長又碎的病歷，做保險與醫療理賠人員常做的跨文件整理。",
    classroomAnalogy:
      "像把好幾年的就醫紀錄、檢驗與醫師筆記攤在桌上，還原時間線：先發生什麼、後來怎麼治療、跟這張理賠單有沒有關。",
    what: [
      "Wisedocs 的公開基準 MLCR，Artificial Analysis 測其中最難的私有保留題。",
      "只看 expert 與 compound 兩級，共 60 題，每題 3 次。",
    ],
    scoreMeaning: [
      "主分數是總通過率：必須先夠精簡，且評審多數決認為「完整又正確」。",
      "答案比參考答案長超過 5 倍，直接 0 分，不送審。這在懲罰流水帳。",
      "正確與完整是分開投的；精簡率則包含所有回答。",
    ],
    dataset: [
      "合成但很像真的病例，長度約 25,000–64,000 token。",
      "公開集與 AA 用的最難題是分開的，頭條分數不是公開集分數。",
    ],
    howTested: [
      "開放作答。三位 LLM 評審對正確與完整做多數決。",
      "對的是專家標註的標準，不是模型互評感覺。",
    ],
    method: [
      "六個難度層從「找一個事實」到「專家級綜合」與「複合多問」。AA 只報最難兩層。",
    ],
    studentTips: [
      "這提醒我們：醫療 AI 要會整理長紀錄，還要寫得精準，不能寫小說。",
    ],
    related: ["aa-lcr", "harvey-lab-aa", "aa-omniscience"],
    facts: [
      { label: "AA 題數", value: "60（最難兩層）" },
      { label: "文件長度", value: "約 2.5–6.4 萬 token" },
      { label: "閱卷", value: "三評審多數決" },
      { label: "特規", value: "太長直接 0 分" },
    ],
  },
];

export function getBenchmark(slug: string) {
  return BENCHMARKS.find((item) => item.slug === slug);
}

export function getBenchmarksByCategory(category: CategoryId) {
  return BENCHMARKS.filter((item) => item.category === category);
}

export function searchBenchmarks(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return BENCHMARKS;
  return BENCHMARKS.filter((item) => {
    const haystack = [
      item.name,
      item.nameEn,
      item.oneLiner,
      item.tags.join(" "),
      item.classroomAnalogy,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}

export function relatedBenchmarks(slug: string) {
  const current = getBenchmark(slug);
  if (!current) return [];
  return current.related
    .map((relatedSlug) => getBenchmark(relatedSlug))
    .filter((item): item is Benchmark => Boolean(item));
}
