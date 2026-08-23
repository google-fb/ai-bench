// 入門必讀:用高中生能理解的方式解釋 AI benchmark 的核心概念。
// 內容以 HTML 字串儲存,由 main.ts 渲染。

export interface Concept {
  id: string;
  title: string;
  icon: string;
  html: string;
  keywords: string[];
}

export const concepts: Concept[] = [
  {
    id: 'what-is-benchmark',
    title: '什麼是 AI Benchmark?',
    icon: '🎯',
    keywords: ['benchmark', '基準測試', '評測', '模擬考'],
    html: `
      <p>Benchmark(基準測試)就是<strong>給 AI 模型考的標準化考試</strong>。就像全國的高中生都考同一份學測,才能公平比較每個人的程度;AI 模型也要考同一份「考卷」、用同樣的規則改分,我們才能說「模型 A 比模型 B 聰明」。</p>
      <p>一個 benchmark 通常包含三個部分:</p>
      <ul>
        <li><strong>測試集(題庫)</strong>:一批事先準備好的題目,以及標準答案或評分標準。</li>
        <li><strong>測試方法</strong>:題目怎麼出給模型、模型可以用什麼工具、有沒有時間或步數限制。</li>
        <li><strong>計分方式</strong>:怎麼判斷模型答對或答錯,最後算出一個分數。</li>
      </ul>
      <div class="callout callout-analogy"><span class="callout-label">白話比喻</span>學測有國文、數學、自然等不同科目;AI benchmark 也一樣,有的考科學知識(GPQA)、有的考數學(AIME)、有的考寫程式(SciCode),還有的考「實際做事的能力」(各種 Agent 測試)。</div>
    `,
  },
  {
    id: 'what-is-dataset',
    title: '測試集(題庫)是什麼?',
    icon: '📚',
    keywords: ['測試集', 'dataset', '資料集', '題庫', '資料污染', 'contamination'],
    html: `
      <p>測試集(test set / dataset)就是 benchmark 的<strong>題庫</strong>:一批固定的題目加上標準答案。例如 GPQA Diamond 的測試集是 198 題博士級科學選擇題;AIME 2025 的測試集是 30 題數學競賽題。</p>
      <p>好的測試集有幾個講究:</p>
      <ul>
        <li><strong>題目品質</strong>:通常由領域專家(教授、博士、工程師)出題並反覆驗證,確保答案唯一且正確。</li>
        <li><strong>難度適中</strong>:太簡單大家都考 100 分,分不出高下(這叫「飽和」,saturation);太難大家都 0 分也沒意義。</li>
        <li><strong>避免資料污染(contamination)</strong>:AI 模型是讀網路上的大量文字訓練出來的。如果考題早就流傳在網路上,模型可能「背過答案」而不是真的會解題——就像考前拿到題目一樣不公平。所以有些 benchmark 會保密題目(如 AA-AnalystAgent),或持續用剛出爐的新題目(如 LiveCodeBench 用最新的程式競賽題)。</li>
      </ul>
      <div class="callout callout-analogy"><span class="callout-label">白話比喻</span>資料污染就像補習班押題剛好押中整份考卷:考出來的高分不代表真實力。所以出題者要嘛把題目鎖在保險箱,要嘛每次都出全新的題目。</div>
    `,
  },
  {
    id: 'how-to-test',
    title: '怎麼測試?——出題與作答規則',
    icon: '🧪',
    keywords: ['zero-shot', '提示', 'prompt', '溫度', 'temperature', '測試方法', 'repeats'],
    html: `
      <p>Artificial Analysis 測試所有模型時,遵守幾個公平原則:</p>
      <ul>
        <li><strong>標準化</strong>:每個模型都用一模一樣的題目、一模一樣的提示語(prompt)、一模一樣的評分規則,像同一間考場、同一份考卷。</li>
        <li><strong>零範例提示(zero-shot)</strong>:題目只給清楚的指示,不給範例解答,直接考模型「看得懂指令、會不會做」的真本事。</li>
        <li><strong>固定隨機性(溫度,temperature)</strong>:AI 回答時帶有一點隨機性,「溫度」就是控制隨機程度的旋鈕。測試時把它固定(一般模型設 0、推理模型設 0.6),讓結果穩定可重現。</li>
        <li><strong>多次重複(repeats)</strong>:因為模型的回答有隨機性,同一題常會考 3、5 甚至 10 次,取平均,分數才不會因為運氣好壞而失真。</li>
        <li><strong>透明公開</strong>:提示語範本、評分程式、限制條件全部公開,任何人都能檢驗。</li>
      </ul>
      <div class="callout callout-analogy"><span class="callout-label">白話比喻</span>「多次重複取平均」就像投籃測驗不是只投一球,而是投十球算命中率——排除單次的手氣成分。</div>
    `,
  },
  {
    id: 'how-to-grade',
    title: '誰來改考卷?——四種評分方式',
    icon: '✅',
    keywords: ['評分', 'regex', 'LLM 評審', 'judge', 'Elo', '單元測試', 'rubric'],
    html: `
      <p>AI 的答案五花八門,不同題型需要不同的「閱卷老師」:</p>
      <ol>
        <li><strong>規則比對(選擇題)</strong>:要求模型在最後一行寫「Answer: A」,再用程式(正規表達式,regex)把字母抓出來對答案。像電腦讀答案卡,快速又客觀。</li>
        <li><strong>程式自動測試(寫程式題)</strong>:直接執行模型寫的程式,跑一整套「單元測試」——全部通過才算對,錯一個就整題 0 分。程式能不能跑、對不對,電腦說了算。</li>
        <li><strong>LLM 評審(開放式問答)</strong>:答案是一句話或一段文字時,規則比對行不通(「4 分之 1」和「0.25」其實相同)。這時請另一個 AI 當「閱卷老師」(equality checker / LLM judge),判斷模型答案和標準答案<em>意思</em>是否相同。有些 benchmark 甚至用三位評審投票(多數決),減少單一評審的偏見。</li>
        <li><strong>兩兩比較 + Elo 分數(沒有唯一標準答案的作品)</strong>:像做簡報、寫報告這種題目沒有唯一解,就把兩個模型的作品成對送給評審「盲測」比較誰做得好,再用 <strong>Elo 制度</strong>(西洋棋、電競排位賽用的積分系統)換算成分數:贏強者加很多分,輸弱者扣很多分。</li>
      </ol>
      <div class="callout callout-analogy"><span class="callout-label">白話比喻</span>選擇題用讀卡機、程式題像 APCS 的自動評測、作文題請老師閱卷、美術作品比賽則是兩兩 PK 排名——AI 考試的評分邏輯其實跟人類考試一模一樣。</div>
    `,
  },
  {
    id: 'what-is-pass1',
    title: '分數怎麼看?——pass@1 與各種指標',
    icon: '📊',
    keywords: ['pass@1', 'pass^5', '分數', '準確率', 'accuracy', 'Elo', '信賴區間'],
    html: `
      <p>看懂 benchmark 分數,先認識幾個常見指標:</p>
      <ul>
        <li><strong>pass@1(一次答對率)</strong>:最常見的指標。模型<em>第一次作答</em>就答對的比例。如果同一題重複考 5 次,就是 5 次中答對的平均比例。GPQA Diamond 得 80 分,意思是「第一次作答平均能答對 80% 的題目」。</li>
        <li><strong>pass^5(五次全對率)</strong>:更嚴格——同一題連考 5 次,<em>5 次全對</em>才算通過。這是在考「穩定度」:偶爾矇對沒有用。(AA-AnalystAgent 採用)</li>
        <li><strong>Elo 積分</strong>:用於沒有標準答案的任務。分數是「相對強弱」,例如 GDPval-AA 把人類專家定在 1000 分,模型高於 1000 代表作品平均比人類專家的更常被評審選中。</li>
        <li><strong>加權綜合指數</strong>:把多個 benchmark 的分數依重要性加權平均,例如 Artificial Analysis Intelligence Index。</li>
      </ul>
      <p>另外要記得:<strong>分數有誤差範圍</strong>。就像民調有正負誤差,benchmark 分數也有「信賴區間」——兩個模型差 1 分以內,通常看不出誰真的比較強;而且<strong>不同 benchmark 的分數不能直接互比</strong>(GPQA 的 60 分和 HLE 的 30 分難度天差地遠)。</p>
      <div class="callout callout-analogy"><span class="callout-label">白話比喻</span>pass@1 像投籃命中率,pass^5 像「連續罰球五球全進才算過關」,Elo 像排位賽段位——三種分數回答的是不同的問題。</div>
    `,
  },
  {
    id: 'what-is-agent',
    title: '什麼是 AI Agent(代理)測試?',
    icon: '🤖',
    keywords: ['agent', '代理', '工具', 'sandbox', '沙盒', 'harness', '多步驟'],
    html: `
      <p>傳統 benchmark 是「一問一答」:給題目、收答案。但現在的 AI 已經能<strong>自己動手做事</strong>:操作終端機、寫檔案、查資料、呼叫軟體 API,一步一步完成複雜任務——這種模式叫 <strong>Agent(代理)</strong>。</p>
      <p>Agent 測試的共同特徵:</p>
      <ul>
        <li><strong>沙盒環境(sandbox)</strong>:給模型一台隔離的虛擬電腦,它可以在裡面執行指令、讀寫檔案,但不會影響外界。像給學生一間安全的實驗室。</li>
        <li><strong>工具(tools)</strong>:模型能呼叫的功能,例如「執行程式」「搜尋網頁」「讀取圖片」。模型要自己決定何時用哪個工具。</li>
        <li><strong>多步驟與步數上限(turns)</strong>:任務可能要幾十、幾百步才能完成,測試通常設上限(例如 200 步)避免模型無限鬼打牆。</li>
        <li><strong>看結果不看過程</strong>:很多 agent 測試只驗收「最終狀態」——例如客服任務結束後,資料庫裡的退款紀錄到底有沒有建立。過程再漂亮,結果不對就是 0 分。</li>
      </ul>
      <div class="callout callout-analogy"><span class="callout-label">白話比喻</span>一問一答的 benchmark 像筆試;Agent 測試像術科考試或實習——給你一間工作室、一套工具、一個任務,時間到了驗收成品。</div>
    `,
  },
];

export interface GlossaryItem {
  term: string;
  en: string;
  def: string;
}

export const glossary: GlossaryItem[] = [
  { term: '大型語言模型', en: 'LLM, Large Language Model', def: '用海量文字訓練出來、能理解與生成語言的 AI 模型,例如 GPT、Claude、Gemini。本站介紹的 benchmark 都是在測這類模型。' },
  { term: 'Token(詞元)', en: 'token', def: 'AI 處理文字的最小單位,大約是一個英文詞或半個中文詞。10 萬 tokens 大約等於一本 200 多頁的書。' },
  { term: '上下文視窗', en: 'context window', def: '模型一次能「看進眼裡」的文字量上限。視窗 128K tokens 的模型,一次能讀完約十幾萬字的資料。' },
  { term: '測試集', en: 'test set / dataset', def: 'Benchmark 的題庫:固定的題目與標準答案。' },
  { term: '資料污染', en: 'contamination', def: '考題混進了模型的訓練資料,使模型「背過答案」,分數失真。' },
  { term: '零範例提示', en: 'zero-shot', def: '只給指令、不給範例解答,直接測模型的理解與應用能力。' },
  { term: '溫度', en: 'temperature', def: '控制模型回答隨機程度的參數。0 = 最穩定;越高越有創意也越不穩定。' },
  { term: '推理模型', en: 'reasoning model', def: '回答前會先寫一長串「思考過程」的模型,擅長數學、科學等需要多步推理的題目。' },
  { term: 'pass@1', en: 'pass at 1', def: '第一次作答就答對的比例;多次重複時取平均。是最常見的計分方式。' },
  { term: '重複次數', en: 'repeats', def: '同一題考多次取平均,排除隨機運氣成分。' },
  { term: 'LLM 評審', en: 'LLM judge / equality checker', def: '請另一個 AI 模型當閱卷老師,判斷開放式答案是否正確或哪份作品較好。' },
  { term: 'Elo 積分', en: 'Elo rating', def: '源自西洋棋的相對實力積分制:靠兩兩對戰(比較)的勝負累積分數。' },
  { term: '評分規準', en: 'rubric', def: '把「好作品」拆成一條條可打勾的具體標準(例如「報告必須包含損益表」),逐條判定通過或不通過。' },
  { term: '單元測試', en: 'unit test', def: '驗證程式碼是否正確的自動化小測驗;程式題通常要全數通過才算答對。' },
  { term: '沙盒', en: 'sandbox', def: '隔離的虛擬電腦環境,讓 AI 安全地執行指令、讀寫檔案而不影響外界。' },
  { term: '代理', en: 'agent', def: '能自主規劃多個步驟、呼叫工具完成任務的 AI 使用模式。' },
  { term: '代理框架', en: 'agent harness', def: '讓模型跑 agent 任務的「腳手架」程式,負責提供工具、管理步數與回收結果。Artificial Analysis 使用自家開源的 Stirrup。' },
  { term: '幻覺', en: 'hallucination', def: 'AI 一本正經地講出錯誤或捏造的內容。AA-Omniscience 專門測量並懲罰這種行為。' },
  { term: '飽和', en: 'saturation', def: '當頂尖模型都能考接近滿分時,benchmark 便失去鑑別度,需要換更難的題目。' },
  { term: '正規表達式', en: 'regex', def: '一種文字比對規則,用來從模型回答中自動抓出「Answer: A」之類的答案。' },
  { term: '多模態', en: 'multimodal', def: '能同時處理文字以外的輸入(圖片、聲音等)的模型能力;MMMU-Pro 就是看圖作答的測試。' },
  { term: '信賴區間', en: 'confidence interval', def: '分數的誤差範圍。差距落在誤差範圍內的兩個模型,實力其實難分高下。' },
];
