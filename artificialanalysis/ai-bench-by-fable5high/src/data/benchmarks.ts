// 各 AI benchmark 條目內容(繁體中文,面向高中生)。
// 資料整理自 artificialanalysis.ai/evaluations 與其公開方法論(2026 年,Intelligence Index v4.1.1)。

export interface Category {
  id: string;
  title: string;
  icon: string;
  intro: string;
}

export interface Fact {
  label: string;
  value: string;
}

export interface Benchmark {
  id: string;
  name: string;
  zhName: string;
  category: string;
  badges: string[];
  oneLiner: string;
  analogy: string;
  whatItTests: string;
  dataset: string[];
  method: string[];
  scoring: string[];
  facts: Fact[];
  keywords: string[];
}

export const categories: Category[] = [
  {
    id: 'science',
    title: '科學知識與推理',
    icon: '🔬',
    intro: '這一類是「學科筆試」:考模型的科學知識深度與推理能力,題目從研究所等級一路難到「人類專家也要想很久」的程度。',
  },
  {
    id: 'knowledge',
    title: '知識廣度・多語言・看圖作答',
    icon: '🌏',
    intro: '這一類考「知道多少」與「會不會誠實說不知道」:涵蓋跨學科的知識廣度、16 種語言的多語言能力,以及看圖回答的多模態能力。',
  },
  {
    id: 'math',
    title: '數學',
    icon: '🧮',
    intro: '數學是最容易客觀評分的科目:答案是明確的數字或式子,對就是對。這兩個經典數學 benchmark 曾是各家模型必考科目,如今頂尖模型幾乎都能考接近滿分,因此已功成身退。',
  },
  {
    id: 'coding',
    title: '程式設計',
    icon: '💻',
    intro: '程式題的評分最鐵面無私:直接執行模型寫的程式碼,跑自動測試,全部通過才算對。這一類從「解演算法題」考到「在真實電腦上完成工程任務」。',
  },
  {
    id: 'longcontext',
    title: '長文本理解',
    icon: '📖',
    intro: '模型能不能一口氣「讀完好幾本書再回答問題」?這一類餵給模型數萬到十萬 tokens 的長文件,考它跨文件找線索、整合推理的能力。',
  },
  {
    id: 'instruction',
    title: '指令遵循',
    icon: '📏',
    intro: '聰明不等於聽話。這一類專門考模型能不能「一個字都不差」地遵守輸出規定——對寫程式自動化、格式化輸出等實際應用非常重要。',
  },
  {
    id: 'agents',
    title: 'AI 代理(Agent)實作測試',
    icon: '🤖',
    intro: '這是目前最前沿的一類:不再是紙筆測驗,而是「術科實作」。模型拿到一台虛擬電腦和一套工具,要自己規劃步驟、動手完成真實世界的工作——做簡報、當客服、寫法律文件、修伺服器。',
  },
];

export const benchmarks: Benchmark[] = [
  // ── 科學知識與推理 ──────────────────────────────────────────
  {
    id: 'gpqa-diamond',
    name: 'GPQA Diamond',
    zhName: '博士級科學選擇題(Google 也查不到答案)',
    category: 'science',
    badges: ['智慧指數成分・權重 6%'],
    oneLiner: '198 題生物、物理、化學的博士級選擇題,設計成「就算讓你上網查也答不出來」。',
    analogy: '像一場開放上網的科學考試,但題目刁鑽到 Google 也救不了你——只有真正讀通的專家才答得出來。',
    whatItTests:
      'GPQA 全名是 Graduate-Level Google-Proof Q&A(研究所等級、防 Google 問答)。它測試模型是否具備<strong>深層的科學知識與推理能力</strong>,而不是表面的關鍵字檢索。出題時經過殘酷驗證:相關領域的博士專家答對率約 65%,而「非本領域但很聰明、還可以上網查」的人只能答對 34%——證明這些題目真的無法靠搜尋破解。',
    dataset: [
      '完整 GPQA 共 448 題,Diamond(鑽石)子集是其中<strong>品質最高的 198 題</strong>:必須「兩位專家都答對、多數非專家答錯」才能入選。',
      '涵蓋生物、物理、化學三大領域,由各領域博士出題並互相驗證。',
      '每題為 4 選 1 的選擇題。',
    ],
    method: [
      '用標準化的指令提示,要求模型最後一行輸出「Answer: A/B/C/D」格式。',
      '每題重複測 5 次,降低隨機性影響。',
      '不提供範例(zero-shot)、不允許使用工具。',
    ],
    scoring: [
      '用正規表達式(regex)從回答中抓出字母答案,直接比對正確選項。',
      '分數 = pass@1 答對率(5 次重複的平均)。',
      '<strong>分數意義</strong>:65 分約等於人類博士專家水準;頂尖模型目前已超過 90 分。注意 4 選 1 用猜的期望值就有 25 分,所以「25 分」其實等於什麼都不會。',
    ],
    facts: [
      { label: '題數', value: '198 題' },
      { label: '題型', value: '4 選 1 選擇題' },
      { label: '重複次數', value: '5 次' },
      { label: '評分', value: 'regex 抓答案,pass@1' },
      { label: '人類基準', value: '博士專家 65%/非專家(可上網)34%' },
    ],
    keywords: ['GPQA', '科學', '選擇題', '博士', '生物', '物理', '化學'],
  },
  {
    id: 'hle',
    name: "Humanity's Last Exam(HLE)",
    zhName: '人類的最後一場考試',
    category: 'science',
    badges: ['智慧指數成分・權重 12%'],
    oneLiner: '2,500 題由全球專家出的「最終大魔王」學術題,涵蓋數學、自然科學與人文,目標是成為人類能出的最難閉卷考試。',
    analogy: '如果學測是高中程度、GPQA 是博士程度,HLE 就是「集合全世界教授出一份沒人能考好的考卷」——它的名字直譯就是「人類的最後一場考試」。',
    whatItTests:
      '由 AI 安全中心(Center for AI Safety,Dan Hendrycks 主導)集合上千位專家出題,刻意挑選<strong>當時最強的 AI 模型都答錯</strong>的題目,測試模型在人類知識最前緣的推理能力。它的目標是成為「最後一個」封閉式學術 benchmark——如果連這份都被考滿分,紙筆測驗就再也考不倒 AI 了。',
    dataset: [
      '完整資料集 2,500 題,橫跨數學、自然科學、人文學科等上百個領域。',
      'Artificial Analysis 使用其中<strong>純文字的 2,158 題</strong>(排除需要看圖的題目),讓不支援圖片的模型也能公平比較。',
      '題型包含精確簡答與選擇題;每題都經過專家審核。',
      '注意:出題時用 GPT-4o、Claude 3.5 Sonnet 等模型做過「對抗式篩選」(這些模型答得出的題目就不收),所以這些老模型的 HLE 分數天生偏低,不宜直接比較。',
    ],
    method: [
      '使用原論文的標準提示語,要求模型給出明確的最終答案與信心度。',
      '每題測 1 次(題目量夠大,單次即具統計意義)。',
      '不允許使用工具、不給範例。',
    ],
    scoring: [
      '開放式答案無法用規則比對,由 <strong>LLM 評審(equality checker)</strong>判斷模型答案與標準答案語意是否一致。',
      '分數 = pass@1 答對率。',
      '<strong>分數意義</strong>:這是目前最難的知識型 benchmark 之一,2025 年初頂尖模型只有個位數分;能考到 25~35 分已是最前沿水準。分數的「絕對值低」正是它的設計目的——留下足夠的進步空間。',
    ],
    facts: [
      { label: '題數', value: '2,158 題(文字題)/全集 2,500 題' },
      { label: '題型', value: '精確簡答+選擇題' },
      { label: '重複次數', value: '1 次' },
      { label: '評分', value: 'LLM 評審比對語意,pass@1' },
      { label: '出題單位', value: 'Center for AI Safety+全球專家' },
    ],
    keywords: ['HLE', 'Humanity', '最後考試', '學術', '前沿'],
  },
  {
    id: 'critpt',
    name: 'CritPt',
    zhName: '研究等級物理推理',
    category: 'science',
    badges: ['智慧指數成分・權重 6%'],
    oneLiner: '70 道「未發表」的前沿物理研究難題,答案可能是數字、符號式或一段 Python 函式,由官方評分伺服器判定。',
    analogy: '像把物理研究生的期末專題拿來當考題:題目來自真實研究、從未公開過,連背答案的機會都沒有。',
    whatItTests:
      'CritPt 測試模型能否進行<strong>研究等級的物理推理</strong>:不是套公式的課本習題,而是需要建立模型、推導、計算的真實研究問題,橫跨凝態、量子、天文等多個物理子領域。因為題目未曾發表,幾乎不可能出現資料污染。',
    dataset: [
      '70 道「挑戰級」研究問題(另有 1 題公開範例不計分),由物理研究者供題。',
      '題目跨越廣泛物理子領域,皆為<strong>未發表的原創問題</strong>。',
      '答案格式多元:數值、SymPy 符號運算式、或需通過測試的 Python 函式。',
    ],
    method: [
      '兩階段作答:第一步讓模型自由推理解題,第二步再把答案整理成規定的程式格式送交評分。',
      '每題重複 5 次,pass@1 計分。',
      '與 CritPt 團隊合作實作,token 用量與成本涵蓋兩個階段。',
    ],
    scoring: [
      '由 <strong>CritPt 官方評分伺服器</strong>判定答案正確性(數值容差、符號等價、函式測試)。',
      '<strong>分數意義</strong>:代表模型在「真實物理研究問題」上的解題率。目前即使最強模型分數也偏低,是鑑別頂尖推理能力的利器。',
    ],
    facts: [
      { label: '題數', value: '70 題' },
      { label: '題型', value: '數值/符號式/Python 函式' },
      { label: '重複次數', value: '5 次' },
      { label: '評分', value: '官方評分伺服器,pass@1' },
      { label: '特色', value: '題目未發表,幾乎零污染' },
    ],
    keywords: ['CritPt', '物理', '研究', '推理', 'SymPy'],
  },
  {
    id: 'aa-omniscience',
    name: 'AA-Omniscience',
    zhName: '知識廣度與幻覺測試',
    category: 'science',
    badges: ['智慧指數成分・權重 12%'],
    oneLiner: '6,000 題橫跨 42 個主題的知識問答——答對加分、亂掰扣分、誠實說「不知道」不扣分。',
    analogy: '像有倒扣的考試:亂猜會被扣分,所以「知道自己不知道」也是一種實力。這治的就是 AI 最惡名昭彰的毛病——一本正經地胡說八道。',
    whatItTests:
      'Omniscience 意為「全知」。這個 benchmark 同時測兩件事:<strong>事實知識的廣度</strong>與<strong>幻覺(hallucination)傾向</strong>。特別之處在計分方式:它獎勵精確的知識、懲罰捏造的答案、對「棄答」保持中立——逼模型誠實面對自己的知識邊界。',
    dataset: [
      '6,000 題,涵蓋 42 個主題:商業、人文社科、健康醫療、法律、軟體工程、科學工程數學等與經濟活動高度相關的領域。',
      '開放式簡答題,附專家標準答案。',
      '公開版資料集發布於 Hugging Face。',
    ],
    method: [
      '每題測 1 次,開放式作答;模型可以選擇回答或明確表示不知道。',
      '由評分模型將每個回答分類為:CORRECT(正確)、INCORRECT(錯誤=幻覺)、PARTIAL_ANSWER(部分正確)、NOT_ATTEMPTED(棄答)。',
    ],
    scoring: [
      '<strong>Omniscience 指數</strong>:答對加分、答錯(幻覺)扣分、棄答不加不扣——所以指數可能是負的!很多模型因為太愛亂猜而得負分。',
      '在智慧指數中拆成兩個成分:準確率(權重 8%)+「非幻覺率」= 1 − 幻覺率(權重 4%)。',
      '<strong>分數意義</strong>:高分代表「知識既廣又可靠」;準確率高但幻覺率也高的模型,總分會被拉低。',
    ],
    facts: [
      { label: '題數', value: '6,000 題/42 個主題' },
      { label: '題型', value: '開放式簡答' },
      { label: '重複次數', value: '1 次' },
      { label: '評分', value: 'LLM 分級:對/錯/部分/棄答' },
      { label: '特色', value: '答錯倒扣,誠實棄答不扣分' },
    ],
    keywords: ['Omniscience', '幻覺', 'hallucination', '知識', '倒扣'],
  },

  // ── 知識廣度・多語言・多模態 ──────────────────────────────
  {
    id: 'mmlu-pro',
    name: 'MMLU-Pro',
    zhName: '進階跨學科知識測驗',
    category: 'knowledge',
    badges: ['已退役(v4.0 起移出指數)'],
    oneLiner: '12,000 題研究所等級、14 個學科的選擇題,是經典 MMLU 的強化版:選項從 4 個加到 10 個,更考推理、更難用猜的。',
    analogy: '像超大型的跨學科模擬考,從法律、醫學考到工程數學。選項多達 10 個,亂猜只剩 10% 期望值——逼你真的要會。',
    whatItTests:
      'MMLU(大規模多任務語言理解)是 AI 界最有名的知識 benchmark 之一,曾是「模型聰不聰明」的代名詞。Pro 版做了兩大強化:<strong>題目更難</strong>(研究所等級、需要多步推理)、<strong>選項從 4 個增為 10 個</strong>(大幅降低猜對機率)。它測的是模型跨領域的知識廣度與應用能力。',
    dataset: [
      '約 12,000 題,涵蓋 14 個學科:數學、物理、化學、法律、工程、心理學、商業等。',
      '從原版 MMLU 篩選並強化:移除瑣碎題與錯題,新增更需要推理的題目。',
      '每題 10 選 1。',
    ],
    method: [
      '標準化指令提示,要求最後一行輸出「Answer: A~J」。',
      '零範例(zero-shot)、不允許工具。',
    ],
    scoring: [
      'regex 抓取答案字母,pass@1 計分。',
      '<strong>分數意義</strong>:頂尖模型已能考到 85 分以上,鑑別度逐漸飽和——這正是它從智慧指數退役(v4.0 起)、由更難的 benchmark 接棒的原因。',
    ],
    facts: [
      { label: '題數', value: '約 12,000 題/14 學科' },
      { label: '題型', value: '10 選 1 選擇題' },
      { label: '評分', value: 'regex 抓答案,pass@1' },
      { label: '狀態', value: '已退役,由更難的測試接棒' },
    ],
    keywords: ['MMLU', 'MMLU-Pro', '知識', '選擇題', '跨學科'],
  },
  {
    id: 'global-mmlu-lite',
    name: 'Global-MMLU-Lite',
    zhName: '多語言知識測驗',
    category: 'knowledge',
    badges: ['多語言指數的基礎'],
    oneLiner: '把 MMLU 翻譯成 16 種語言的輕量版,每種語言約 400 題,測模型「換一種語言還會不會」。',
    analogy: '像同一份考卷出了 16 種語言版本:英文考得好、換成中文或斯瓦希里語就不會,代表模型的能力沒有真正跨語言。',
    whatItTests:
      '大多數 benchmark 都是英文的,但全世界的使用者說著不同語言。Global-MMLU-Lite 測試模型在<strong>英語、中文、印地語、西班牙語、法語、阿拉伯語、日語、韓語、斯瓦希里語、約魯巴語、緬甸語</strong>等 16 種語言下的知識與推理是否穩定,是 Artificial Analysis「多語言指數」的資料來源。',
    dataset: [
      '約 6,000 題(每語言約 400 題),由 Cohere Labs 整理。',
      '題目經文化在地化調整,兼顧「文化相關」與「文化中立」題型。',
      '4 選 1 選擇題。',
    ],
    method: ['與 MMLU 相同的標準化選擇題流程,對每種語言分別測試。', '每題 1 次,zero-shot。'],
    scoring: [
      'regex 抓答案,pass@1。',
      '<strong>分數意義</strong>:各語言分數平均後構成多語言指數;不同語言之間的分數落差,反映模型對「低資源語言」(訓練資料較少的語言)的掌握程度。',
    ],
    facts: [
      { label: '題數', value: '約 6,000 題(16 語言 × 約 400 題)' },
      { label: '題型', value: '4 選 1 選擇題' },
      { label: '評分', value: 'regex 抓答案,pass@1' },
      { label: '語言數', value: '16 種' },
    ],
    keywords: ['Global-MMLU', '多語言', '翻譯', '語言'],
  },
  {
    id: 'mmmu-pro',
    name: 'MMMU-Pro',
    zhName: '看圖作答的多模態測驗',
    category: 'knowledge',
    badges: ['多模態(視覺)測試'],
    oneLiner: '1,730 題必須「看懂圖」才能回答的大學等級題目,涵蓋 30 個學科,專測模型的視覺理解能力。',
    analogy: '像地科考等高線圖、生物考顯微鏡照片、藝術史考畫作辨識——題目的關鍵資訊在圖裡,光會讀文字沒用。',
    whatItTests:
      'MMMU 測的是<strong>多模態</strong>能力:同時理解文字與圖像(圖表、地圖、樂譜、電路圖、醫學影像……)。Pro 版特別堵住了投機取巧的漏洞:過濾掉「不看圖也能答對」的題目,並把選項增加到 10 個,確保分數真正反映視覺理解。',
    dataset: [
      '1,730 題,涵蓋 30 個大學學科:藝術、商業、科學、醫學、工程等。',
      '每題附一張以上的圖片,且經過驗證「必須看圖才能作答」。',
      '10 選 1 選擇題;部分題目甚至把題幹嵌在圖片裡(screenshot 形式),模擬真實閱讀情境。',
    ],
    method: ['圖片與題目一起輸入模型(僅支援視覺輸入的模型能參加)。', '每題 1 次,zero-shot,regex 抓答案。'],
    scoring: [
      'pass@1 答對率。',
      '<strong>分數意義</strong>:反映模型「眼睛」的水準。同一個模型的 MMMU-Pro 分數通常明顯低於純文字測驗,顯示視覺推理仍是 AI 的相對弱項。',
    ],
    facts: [
      { label: '題數', value: '1,730 題/30 學科' },
      { label: '題型', value: '10 選 1(含圖)' },
      { label: '評分', value: 'regex 抓答案,pass@1' },
      { label: '參加資格', value: '需支援圖片輸入的模型' },
    ],
    keywords: ['MMMU', '多模態', '圖片', '視覺', '看圖'],
  },

  // ── 數學 ────────────────────────────────────────────────
  {
    id: 'aime-2025',
    name: 'AIME 2025',
    zhName: '美國數學邀請賽',
    category: 'math',
    badges: ['已退役'],
    oneLiner: '2025 年美國數學邀請賽(AIME)全部 30 題,奧林匹亞等級的數學推理,答案一律是 0~999 的整數。',
    analogy: '這是真人高中生的頂尖競賽:全美數學前 5% 的學生才有資格參加,平均也只能解出 5、6 題。AI 拿這份考卷來考,直接和最強的人類高中生同場較勁。',
    whatItTests:
      'AIME 是介於 AMC 與美國數學奧林匹亞(USAMO)之間的正式競賽,測試<strong>創造性的多步驟數學推理</strong>:數論、組合、幾何、代數。題目無法靠背公式解決,需要靈活的解題策略。用「今年剛考完」的真題也能降低資料污染(模型訓練時還沒看過)。',
    dataset: [
      '2025 年 AIME I 與 AIME II 共 30 題。',
      '每題答案都是 000~999 的整數——這是 AIME 的傳統設計,方便精確對答案。',
    ],
    method: [
      '每題重複 10 次(題目少,更需要多次重複來穩定分數),pass@1 計分。',
      '要求模型給出最終整數答案。',
    ],
    scoring: [
      '程式自動評分:先用 SymPy(數學符號運算庫)把答案標準化再比對;疑難情況由 LLM 等值檢查員備援。',
      '<strong>分數意義</strong>:人類參賽者平均約 33 分(解出 10 題中的 5 題);頂尖推理模型已能考到 90 分以上,因此功成身退。',
    ],
    facts: [
      { label: '題數', value: '30 題' },
      { label: '題型', value: '整數答案(000~999)' },
      { label: '重複次數', value: '10 次' },
      { label: '評分', value: 'SymPy 標準化+LLM 備援,pass@1' },
      { label: '人類基準', value: '頂尖高中生平均解出約 1/3' },
    ],
    keywords: ['AIME', '數學', '競賽', '奧林匹亞', '整數'],
  },
  {
    id: 'math-500',
    name: 'MATH-500',
    zhName: '高中競賽數學 500 題',
    category: 'math',
    badges: ['已退役'],
    oneLiner: '從經典 MATH 資料集抽出的 500 題高中競賽數學,涵蓋代數、幾何、數論等六大領域、五個難度層級。',
    analogy: '像一本高中數學競賽的分級題本:從基礎到艱難共五級,可以看出模型的數學能力到哪一級開始「破功」。',
    whatItTests:
      'MATH 資料集是 AI 數學能力測試的老牌經典(2021 年發布),收錄美國高中競賽(AMC、AIME 等)題目。MATH-500 是 OpenAI 研究時抽出的 500 題代表子集,測試<strong>系統化的數學解題能力</strong>:理解題意、選擇方法、逐步推導、給出答案。',
    dataset: [
      '500 題,來自 MATH 資料集的測試分割。',
      '六大領域:初等代數、代數、數論、計數與機率、幾何、初等微積分。',
      '每題標有 1~5 的難度等級,答案為數字或數學式。',
    ],
    method: ['要求模型逐步推理後給出最終答案。', 'pass@1 計分。'],
    scoring: [
      '答案經數學標準化後比對(例如 0.5 與 1/2 視為相同)。',
      '<strong>分數意義</strong>:頂尖模型已接近滿分(飽和),因此退役。它的歷史地位在於:2021 年時最強模型只能考 6.9 分,見證了 AI 數學能力數年內的飛躍。',
    ],
    facts: [
      { label: '題數', value: '500 題/6 領域' },
      { label: '題型', value: '數字或數學式' },
      { label: '評分', value: '數學等價比對,pass@1' },
      { label: '狀態', value: '已飽和退役' },
    ],
    keywords: ['MATH', 'MATH-500', '數學', '競賽', '代數', '幾何'],
  },

  // ── 程式設計 ─────────────────────────────────────────────
  {
    id: 'terminal-bench',
    name: 'Terminal-Bench v2.1',
    zhName: '終端機實戰任務',
    category: 'coding',
    badges: ['智慧指數成分・權重 16%'],
    oneLiner: '把模型丟進一台只有「黑底白字終端機」的電腦,完成 89 個真實工程任務:寫程式、修系統、處理資料、訓練模型、資安攻防。',
    analogy: '像資訊科的術科考試:給你一台電腦和一個任務(例如「把這個壞掉的服務修好」),時間內做完、通過驗收才算過關——過程全靠自己敲指令。',
    whatItTests:
      'Terminal-Bench 由史丹佛研究者、Laude Institute 與開源社群共同開發,測試模型<strong>在終端機(命令列)環境完成真實任務</strong>的能力:軟體工程、系統管理、資料處理、模型訓練、資訊安全五大類。這比「寫一段程式」難得多——模型要自己探索環境、規劃步驟、執行指令、除錯,直到通過驗收。',
    dataset: [
      '89 個精心策劃的任務(v2.1 是 v2.0 的驗證修正版:修正了環境與題目敘述的瑕疵,確保分數反映模型實力而非環境問題)。',
      '每個任務內建一套「驗收測試」,定義怎樣才算完成。',
      '前身 Terminal-Bench Hard(44 題困難子集)已被 v2.1 取代。',
    ],
    method: [
      '使用 Terminus 2 代理框架,在 E2B 沙盒(隔離虛擬機)中執行。',
      '模型以「觀察狀態 → 規劃 → 執行指令」的循環工作,最多 250 個回合、每任務上限 2 小時。',
      '每任務重複 3 次,pass@1 計分。',
    ],
    scoring: [
      '任務的驗收測試<strong>全部通過</strong>才算成功,部分完成 = 0 分。',
      '分數 = 成功任務比例(3 次重複平均)。',
      '<strong>分數意義</strong>:50 分代表能獨立完成一半的真實工程任務——這是衡量「AI 能不能當工程師助手」最直接的指標之一。',
    ],
    facts: [
      { label: '任務數', value: '89 個' },
      { label: '型態', value: 'Agent 終端機實作' },
      { label: '重複次數', value: '3 次' },
      { label: '評分', value: '驗收測試全過才算成功,pass@1' },
      { label: '限制', value: '250 回合/2 小時' },
    ],
    keywords: ['Terminal-Bench', '終端機', '命令列', '工程', 'agent', '沙盒'],
  },
  {
    id: 'scicode',
    name: 'SciCode',
    zhName: '科學計算程式題',
    category: 'coding',
    badges: ['智慧指數成分・權重 8%'],
    oneLiner: '由科學家出題的 80 個真實研究計算問題,拆成 288 個子問題,要求用 Python 寫出能通過所有測試的程式。',
    analogy: '像物理系的計算物理作業:教授給你研究問題的背景,要你把數值模擬一步步寫成程式——每一步都有測資檢查,錯一步就零分。',
    whatItTests:
      'SciCode 測試模型能否<strong>把科學知識轉成正確的程式碼</strong>。題目來自 16 個科學領域(物理、化學、生物、材料科學等)的真實研究情境,由博士科學家出題。它同時考驗兩件事:看懂科學問題+寫出數值計算程式,是「科學 × 程式」的交叉考驗。',
    dataset: [
      '80 個主問題,拆解成 288 個子問題(測試集)。',
      '涵蓋 16 個科學領域,每題附科學家撰寫的背景說明。',
      '每個子問題都配有單元測試(unit tests)。',
    ],
    method: [
      '提示中附上科學家註解的背景知識(測「程式能力」而非「知識回憶」)。',
      '模型針對每個子問題產出 Python 程式碼。',
      '每題重複 3 次,pass@1。',
    ],
    scoring: [
      '實際執行程式,子問題的單元測試<strong>全部通過</strong>才得分。',
      '以子問題為單位計分(288 個子問題的通過率)。',
      '<strong>分數意義</strong>:反映模型能否勝任科學研究的程式助手。題目極難,頂尖模型也只有 40~50 分左右。',
    ],
    facts: [
      { label: '題數', value: '80 主問題/288 子問題' },
      { label: '題型', value: 'Python 程式' },
      { label: '重複次數', value: '3 次' },
      { label: '評分', value: '單元測試全過,pass@1(子問題計分)' },
      { label: '出題者', value: '16 領域的博士科學家' },
    ],
    keywords: ['SciCode', '科學計算', 'Python', '程式', '單元測試'],
  },
  {
    id: 'livecodebench',
    name: 'LiveCodeBench',
    zhName: '即時更新的競程題庫',
    category: 'coding',
    badges: ['已退役'],
    oneLiner: '持續從 LeetCode、AtCoder、Codeforces 收集「剛出爐」的競賽程式題,確保模型不可能背過答案。',
    analogy: '像每週更新題目的程式檢定:永遠考最新的題目,補習班(訓練資料)來不及押題,考的是真正的解題能力。',
    whatItTests:
      'LiveCodeBench 的核心賣點是<strong>防污染設計</strong>:它「即時(live)」收集三大競程平台的新題,只用模型訓練截止日<em>之後</em>發布的題目來評測,保證模型沒看過。測試內容是經典的演算法解題:讀懂題意、設計演算法、寫出正確且高效的 Python 程式。',
    dataset: [
      '持續擴充的題庫,來自 LeetCode、AtCoder、Codeforces 三大競賽平台。',
      '每題附官方測資;依模型的訓練截止日選用「它不可能看過」的題目子集。',
    ],
    method: [
      '兩種模式:給定函式骨架撰寫解答,或從標準輸入讀資料、輸出到標準輸出。',
      '不使用平台的客製系統提示,統一條件,pass@1。',
    ],
    scoring: [
      '執行程式、跑完整測資,全部通過才算對。',
      '<strong>分數意義</strong>:反映演算法解題能力。已從主要指數退役,由更全面的 Terminal-Bench、SciCode 接棒。',
    ],
    facts: [
      { label: '題庫', value: 'LeetCode/AtCoder/Codeforces 新題' },
      { label: '題型', value: 'Python 程式' },
      { label: '評分', value: '測資全過,pass@1' },
      { label: '特色', value: '只考模型訓練截止日之後的新題' },
    ],
    keywords: ['LiveCodeBench', '競程', 'LeetCode', 'Codeforces', '演算法'],
  },

  // ── 長文本理解 ────────────────────────────────────────────
  {
    id: 'aa-lcr',
    name: 'AA-LCR',
    zhName: '長文本推理(Long Context Reasoning)',
    category: 'longcontext',
    badges: ['智慧指數成分・權重 6%'],
    oneLiner: '每題塞給模型約 10 萬 tokens(相當於一本厚書)的多份文件,考它跨文件找線索、整合推理的能力。',
    analogy: '像開書考的進階版:發給你七、八份公司財報和研究報告(共幾百頁),問一個要「翻好幾份文件、把數字兜起來」才答得出的問題。',
    whatItTests:
      'AA-LCR(Artificial Analysis Long Context Reasoning)是 Artificial Analysis 自建的 benchmark,測試模型<strong>讀完超長文件後的推理能力</strong>。重點不是「大海撈針」式的單點查找,而是要跨越多份文件提取、比對、綜合資訊——這正是真實世界處理報告、法律文件、研究資料的核心需求。',
    dataset: [
      '100 道困難的文字題,文件分成 7 類:公司財報、產業報告、政府諮詢文件、學術論文、法律文件、行銷素材、調查報告。',
      '每題輸入約 10 萬 tokens(cl100k_base 計算),整個測試約 230 份文件、300 萬 tokens。',
      '模型的上下文視窗至少要 128K tokens 才能參加。',
    ],
    method: ['整包文件+問題一次輸入模型,要求直接作答。', '每題重複 3 次,pass@1。'],
    scoring: [
      '開放式答案由 LLM 等值檢查員比對語意。',
      '<strong>分數意義</strong>:高分代表模型能「真的讀懂」長文件,而不是讀到後面忘了前面。長輸入下推理品質常明顯下降,此測試專門抓出這個弱點。',
    ],
    facts: [
      { label: '題數', value: '100 題/7 類文件' },
      { label: '輸入長度', value: '每題約 10 萬 tokens' },
      { label: '重複次數', value: '3 次' },
      { label: '評分', value: 'LLM 等值檢查,pass@1' },
      { label: '門檻', value: '需支援 128K 上下文視窗' },
    ],
    keywords: ['AA-LCR', '長文本', 'long context', '文件', '財報'],
  },
  {
    id: 'mlcr-aa',
    name: 'MLCR-AA',
    zhName: '醫療長文本推理',
    category: 'longcontext',
    badges: ['獨立排行榜'],
    oneLiner: '給模型一疊零散的醫療病歷(2.5 萬~6.4 萬 tokens),考它重建病程時間軸、因果與理賠關聯的能力——答案還必須簡潔。',
    analogy: '像保險理賠審查員的工作:面對一大疊來自不同醫院、順序混亂的病歷,要拼出「事情發生的先後與因果」,還得用三言兩語講清楚。',
    whatItTests:
      'MLCR(Medical Long Context Reasoning)由醫療文件公司 Wisedocs 開發,測試模型處理<strong>長而零散的醫療紀錄</strong>的能力:重建時間軸、判斷因果、歸納治療模式、評估理賠關聯。Artificial Analysis 只評測其中最難的兩級題目。',
    dataset: [
      '擬真的合成醫療案例(約 25,000~64,000 tokens),避免真實病人隱私問題。',
      '題目分六個難度層級;AA 評測私有保留集的最難兩級(專家級臨床綜合+複合多段推理)共 60 題。',
      '私有保留集不公開,降低污染風險。',
    ],
    method: [
      '每題重複 3 次。',
      '<strong>簡潔門檻</strong>:回答長度超過參考答案 5 倍,直接 0 分不送評——防止模型「亂槍打鳥把所有可能都寫上去」。',
      '通過門檻的回答由三位 LLM 評審投票,完整性與準確性各以多數決判定。',
    ],
    scoring: [
      '總通過率 = 簡潔 + 完整 + 準確三關全過的比例(pass@1)。',
      '<strong>分數意義</strong>:反映模型能否勝任醫療、保險文件分析這類高風險場景——不但要對,還要精煉。',
    ],
    facts: [
      { label: '題數', value: '60 題(最難兩級)' },
      { label: '輸入長度', value: '2.5 萬~6.4 萬 tokens' },
      { label: '重複次數', value: '3 次' },
      { label: '評分', value: '簡潔門檻+3 位 LLM 評審多數決' },
      { label: '開發者', value: 'Wisedocs(AA 實作評測)' },
    ],
    keywords: ['MLCR', '醫療', '病歷', '長文本', '保險'],
  },

  // ── 指令遵循 ─────────────────────────────────────────────
  {
    id: 'ifbench',
    name: 'IFBench',
    zhName: '精確指令遵循測試',
    category: 'instruction',
    badges: ['獨立排行榜(v4.1 起移出指數)'],
    oneLiner: '294 題附帶「奇怪但可驗證」的輸出規定——例如字數限制、每句開頭字母、禁用某些字——考模型能不能一個字都不差地照辦。',
    analogy: '像作文比賽附加嚴格格式規定:「全文恰好 300 字、分 5 段、每段以問句結尾」。內容再好,格式錯了就不及格——考的是「聽話的精確度」。',
    whatItTests:
      'IFBench(Instruction Following Benchmark)由 Allen AI 開發,測試模型<strong>精確遵循指令</strong>的能力。指令涵蓋 58 種「可程式驗證」的限制:計數(字數、句數)、格式(大小寫、標點、段落)、句子操作等。這些限制刻意設計成訓練時很少見的「域外」題型,測的是泛化的服從能力,而非背過的格式。',
    dataset: [
      '單輪版資料集共 294 題,每題附一至多條可驗證的輸出限制。',
      '58 種不同類型的限制,皆可由程式自動檢查。',
    ],
    method: [
      '每題重複 5 次。',
      '使用官方評測程式,採「寬鬆模式」判定:自動容忍無關緊要的裝飾差異(例如開頭多一行說明、markdown 星號),避免冤枉答案。',
    ],
    scoring: [
      '規則式自動檢查每條限制是否滿足;以「整題所有限制全部滿足」的比例計分(prompt-level accuracy,pass@1)。',
      '<strong>分數意義</strong>:對開發者非常實際——分數高的模型,在自動化流程中輸出的格式更可靠,不用寫一堆補救程式。',
    ],
    facts: [
      { label: '題數', value: '294 題/58 種限制' },
      { label: '題型', value: '開放式+格式限制' },
      { label: '重複次數', value: '5 次' },
      { label: '評分', value: '規則自動驗證,pass@1' },
      { label: '開發者', value: 'Allen AI(Ai2)' },
    ],
    keywords: ['IFBench', '指令遵循', '格式', 'instruction following'],
  },

  // ── AI 代理 ──────────────────────────────────────────────
  {
    id: 'gdpval-aa',
    name: 'GDPval-AA v2',
    zhName: '真實職業工作測試',
    category: 'agents',
    badges: ['智慧指數成分・權重 20%', '指數中權重最高'],
    oneLiner: '220 個來自 44 種真實職業(橫跨 9 大產業)的工作任務——做簡報、拉試算表、寫報告——成品和「人類專家的作品」盲測對決,用 Elo 計分。',
    analogy: '像廚藝節目的盲測評審:模型和人類專家各交一份作品,評審不知道誰做的,只選比較好的那份。贏過專家越多次,Elo 分數越高。',
    whatItTests:
      'GDPval 是 OpenAI 建立的資料集,任務取材自<strong>對美國 GDP 有實質貢獻的 44 種職業</strong>:金融分析師、律師、工程師、設計師等的真實工作。GDPval-AA 是 Artificial Analysis 的評測框架,測試模型能否產出「有經濟價值的專業成品」——這是智慧指數中權重最高(20%)的單一測試。',
    dataset: [
      '220 個任務,基於 OpenAI 公開的 GDPval gold 資料集,涵蓋 44 職業、9 大產業。',
      '每個任務附參考檔案(文件、試算表、簡報等),要求模型產出一或多個成品檔案。',
    ],
    method: [
      '模型在開源代理框架 Stirrup + E2B 沙盒中工作,可用 6 種工具:網頁搜尋、網頁抓取、看圖、執行程式、交件(finish)、放棄(abandon)。',
      '每任務上限 250 回合,允許超長工作流程。',
      '成品兩兩配對,由三位前沿 LLM 評審組成的評審團<strong>盲測</strong>比較(不知道作者是誰),包含與人類專家作品的對決。',
    ],
    scoring: [
      '把所有兩兩勝負用 Bradley-Terry 模型擬合成 <strong>Elo 分數</strong>,人類專家錨定在 1000 分。',
      '<strong>分數意義</strong>:超過 1000 分表示「作品平均而言比人類專家的更常被評審選中」——AI 是否達到專業工作水準,這個數字最直觀。',
      '納入智慧指數時以 (Elo − 500) / 2000 正規化。',
    ],
    facts: [
      { label: '任務數', value: '220 個/44 職業/9 產業' },
      { label: '型態', value: 'Agent 產出檔案成品' },
      { label: '評分', value: '盲測兩兩比較 → Elo(專家=1000)' },
      { label: '評審', value: '3 位前沿 LLM 評審團' },
      { label: '限制', value: '250 回合' },
    ],
    keywords: ['GDPval', '職業', '工作', 'Elo', '簡報', '專家'],
  },
  {
    id: 'tau3-banking',
    name: '𝜏³-Banking',
    zhName: '銀行客服代理測試',
    category: 'agents',
    badges: ['智慧指數成分・權重 14%'],
    oneLiner: '模型扮演銀行客服,面對(由另一個 AI 模擬的)客戶,要在約 700 份政策文件中查對規定、執行多步驟帳務操作,最後看資料庫狀態對不對。',
    analogy: '像客服員的實習考核:客人說「我的卡被盜刷了」,你要翻員工手冊確認流程、開爭議單、發臨時額度——考完不看你講話多好聽,只查系統裡的單子開對了沒。',
    whatItTests:
      '𝜏(tau)系列由 AI 客服公司 Sierra 開發,𝜏³-Banking 是金融客服領域的最新版。它測試模型的<strong>三合一能力</strong>:在大量非結構化文件中檢索正確政策+多步驟工具操作+與客戶對話協調。特別的是「雙控制」設計:客戶也由 AI 模擬,雙方要互相配合才能完成任務。',
    dataset: [
      '97 個銀行客服任務(基於 tau2-bench v1.0.1)。',
      '知識庫約 700 份相互關聯的政策文件(約 19.5 萬 tokens、21 個產品類別)——有些工具只寫在文件裡,沒有明白列出,要靠自己讀出來。',
    ],
    method: [
      '模型可用 BM25 關鍵字搜尋與 grep 在知識庫中查資料,並呼叫帳務工具執行操作。',
      '客戶由 GPT-5.4 Mini 模擬;每次任務上限 200 步(含雙方所有訊息)。',
      '每任務重複 5 次,pass@1。',
    ],
    scoring: [
      '<strong>只驗收後端資料庫的最終狀態</strong>:爭議單有沒有開、臨時額度有沒有發。對話再流暢,結果錯了就是 0 分。',
      '<strong>分數意義</strong>:模擬企業導入 AI 客服的真實可靠度——這種「結果導向」評分正是業界最在乎的。',
    ],
    facts: [
      { label: '任務數', value: '97 個' },
      { label: '型態', value: '雙控制對話 Agent+知識檢索' },
      { label: '重複次數', value: '5 次' },
      { label: '評分', value: '後端資料庫狀態驗收,pass@1' },
      { label: '開發者', value: 'Sierra(𝜏-Knowledge 框架)' },
    ],
    keywords: ['tau', 'banking', '銀行', '客服', '對話', '工具'],
  },
  {
    id: 'tau2-telecom',
    name: '𝜏²-Bench Telecom',
    zhName: '電信客服代理測試(前代)',
    category: 'agents',
    badges: ['已由 𝜏³-Banking 取代'],
    oneLiner: '𝜏³ 的前身:模型扮演電信客服,幫(AI 模擬的)用戶解決手機斷網、簡訊故障等問題,雙方都要動手操作才能修好。',
    analogy: '像電話技術支援:客服要一邊指導客戶「你先重開機、檢查設定」,一邊在自己系統操作。兩邊都做對,網路才會通。',
    whatItTests:
      '「雙控制(dual control)」是它的招牌:<strong>客服(受測模型)與用戶(模擬 AI)各自握有不同的操作權限</strong>,必須靠溝通協調才能解決問題——考驗規劃、工具使用、與「指導別人做事」的溝通能力。',
    dataset: [
      '114 個電信客服任務(從 2,285 個程式生成任務中抽選),涵蓋通話、行動數據、簡訊等故障類型。',
    ],
    method: [
      '預設雙控制模式:用戶由 Qwen3 235B 模擬。',
      '每任務上限 100 步、重複 3 次,pass@1。',
    ],
    scoring: [
      '以最終「世界狀態」驗收——例如用戶的行動數據是否真的恢復。',
      '<strong>分數意義</strong>:歷史比較用;v4.1 起由知識庫更龐大、更難的 𝜏³-Banking 接棒。',
    ],
    facts: [
      { label: '任務數', value: '114 個' },
      { label: '型態', value: '雙控制對話 Agent' },
      { label: '重複次數', value: '3 次' },
      { label: '評分', value: '世界狀態驗收,pass@1' },
      { label: '狀態', value: '已退役' },
    ],
    keywords: ['tau2', 'telecom', '電信', '客服', '雙控制'],
  },
  {
    id: 'aa-briefcase',
    name: 'AA-Briefcase',
    zhName: '長期知識工作專案測試',
    category: 'agents',
    badges: ['獨立排行榜', 'AA 自建'],
    oneLiner: '模擬「數週的職場專案」:91 個環環相扣的任務、上千份輸入檔案,模型要交出分析報告、簡報等成品,由三位 LLM 評審打分數並換算 Elo。',
    analogy: '像多週的專題實習:第一週整理市場資料、第二週寫分析、第三週做提案簡報——每週的任務都建立在之前的資料上,考的是長期、連貫的工作能力。',
    whatItTests:
      'AA-Briefcase 是 Artificial Analysis 自建的前沿 agent benchmark,測試<strong>長時程知識工作</strong>:每個情境是產業專家設計的多週商業專案,輸入包含 Slack 對話紀錄、試算表、PDF、訪談逐字稿、董事會資料等擬真素材。同時評「有沒有做對」與「做得漂不漂亮」。',
    dataset: [
      '91 個任務,分屬 4 個多週情境;每情境有數千份共用與週別檔案。',
      '素材混合真實、改編與合成資料,模擬真實職場的雜亂輸入。',
    ],
    method: [
      'Stirrup 框架+週別 E2B 沙盒,無網路,只能用提供的檔案。',
      '每任務上限 500 回合;工具為程式執行+交件/放棄(視覺模型另有看圖工具)。',
      '三種評分並行:規準(rubric)逐條打勾、「分析品質」兩兩比較、「呈現品質」兩兩比較。',
      '由三位不同家族的 LLM 評審(Claude、GPT、Gemini)分擔評分,避免「評審偏袒自家模型」。',
    ],
    scoring: [
      '主指標 <strong>AA-Briefcase Elo</strong>:整合分析品質 Elo、呈現品質 Elo 與規準通過率(轉成虛擬對戰)的綜合 Elo。',
      '<strong>分數意義</strong>:目前最接近「AI 能不能獨立完成一份實習生專案」的量化指標。',
    ],
    facts: [
      { label: '任務數', value: '91 個/4 情境' },
      { label: '型態', value: 'Agent 多週專案' },
      { label: '評分', value: 'rubric+兩兩比較 → 綜合 Elo' },
      { label: '評審', value: '3 位跨家族 LLM 評審' },
      { label: '限制', value: '500 回合、無網路' },
    ],
    keywords: ['Briefcase', '知識工作', '專案', '商業', '簡報'],
  },
  {
    id: 'harvey-lab',
    name: 'Harvey LAB-AA',
    zhName: '法律工作代理測試',
    category: 'agents',
    badges: ['獨立排行榜'],
    oneLiner: '120 個真實法律工作任務(橫跨 24 個執業領域):讀案件文件、寫備忘錄、做揭露清單——逐條對照評分規準打勾。',
    analogy: '像法律事務所的新人考核:給你一疊合約和筆錄,要求交出一份備忘錄。主管拿著檢核表逐項檢查:「有沒有指出關鍵條款?日期對不對?」全對才滿分。',
    whatItTests:
      'LAB(Legal Agent Benchmark)由法律 AI 公司 Harvey 建立,測試模型執行<strong>真實法律工作</strong>的能力:合約審閱、備忘錄、揭露時程表、證詞摘要、修訂比對(redline)等。Artificial Analysis 獨立實作評測,不提供 Harvey 原版的輔助工具,測的是模型「裸實力」。',
    dataset: [
      '120 個私有任務(不公開,防污染),涵蓋 24 個法律執業領域。',
      '每任務附案件文件(合約、協議、筆錄等)與指定的交件檔名。',
    ],
    method: [
      'Stirrup + 無網路沙盒,上限 200 回合;要求以<strong>精確檔名</strong>交件,檔名錯就視同未交。',
      '每任務有一套原子化、二元(過/不過)的評分規準;由 LLM 評審(Gemini 3.1 Pro)逐條判定,無部分給分。',
    ],
    scoring: [
      '主指標:<strong>規準通過率</strong>(所有檢核項目中通過的比例);另報「全過率」(整個任務每條都過的比例)。',
      '<strong>分數意義</strong>:直接對應法律 AI 助理的可用度;二元評分讓分數嚴格且可重現。',
    ],
    facts: [
      { label: '任務數', value: '120 個/24 執業領域' },
      { label: '型態', value: 'Agent 產出法律文件' },
      { label: '評分', value: '二元規準逐條判定(LLM 評審)' },
      { label: '資料', value: '私有資料集(防污染)' },
      { label: '限制', value: '200 回合、無網路' },
    ],
    keywords: ['Harvey', 'LAB', '法律', '合約', '備忘錄'],
  },
  {
    id: 'apex-agents',
    name: 'APEX-Agents-AA',
    zhName: '專業服務跨應用代理測試',
    category: 'agents',
    badges: ['獨立排行榜'],
    oneLiner: '452 個投資銀行、管理顧問、法律領域的長時程任務,模型要在模擬的辦公環境裡跨多個應用程式完成工作。',
    analogy: '像顧問公司的專案日:你要在信箱、雲端硬碟、試算表軟體之間穿梭,把散在各處的資料整合成交付成果——還要自己決定該打開哪個工具。',
    whatItTests:
      'APEX-Agents 由 Mercor 開發,測試<strong>跨應用程式的長時程工作能力</strong>。特別之處是「工具管理」:模型面對一大堆可用工具(透過 MCP 協定連接),必須自己查詢、挑選、掛載需要的工具——就像真人要自己決定開哪些軟體。',
    dataset: [
      '452 個任務(取自公開版 480 個,排除少數有外部依賴的),分屬投資銀行、管理顧問、法律三大專業服務領域。',
      '每任務在 Archipelago 模擬工作環境中執行,附完整的檔案與應用狀態。',
    ],
    method: [
      'Stirrup 框架、上限 200 回合、每任務重複 3 次。',
      '模型用「列出工具/檢視工具/掛載工具/移除工具」的元工具自主管理工具箱,還有待辦清單工具管理進度。',
      '評分用最終交答+檔案系統前後差異,由 LLM 評審依規準判定。',
    ],
    scoring: [
      '<strong>整題全過才算通過</strong>:一次嘗試中所有規準項目都滿足才計 1 分;分數 = 3 次重複的平均通過率(pass@1)。',
      '<strong>分數意義</strong>:反映 AI 在「多軟體、多步驟」的白領工作流程中的實戰能力。',
    ],
    facts: [
      { label: '任務數', value: '452 個/3 專業領域' },
      { label: '型態', value: 'Agent 跨應用工作' },
      { label: '重複次數', value: '3 次' },
      { label: '評分', value: '規準全過制,pass@1' },
      { label: '開發者', value: 'Mercor(AA 獨立實作)' },
    ],
    keywords: ['APEX', '顧問', '投資銀行', '跨應用', 'MCP'],
  },
  {
    id: 'automationbench',
    name: 'AutomationBench-AA',
    zhName: 'SaaS 工作流程自動化測試',
    category: 'agents',
    badges: ['獨立排行榜'],
    oneLiner: '657 個企業自動化任務:模型透過 REST API 操作模擬版的 Gmail、Slack、Salesforce 等軟體完成工作——但踩到「護欄」直接 0 分。',
    analogy: '像自動化助理的上工考:老闆說「把這批客訴開成工單並通知業務」,你要在各系統間正確操作;但如果誤發信給全公司(踩護欄),整題直接不及格。',
    whatItTests:
      'AutomationBench 由自動化平台 Zapier 開發,測試模型能否完成<strong>跨多個 SaaS 軟體的真實工作流程</strong>(財務、人資、行銷、營運、業務、客服六大領域)。獨特設計是「護欄(guardrail)」:有些狀態一開始是好的、絕不能被弄壞——測的不只是能力,還有<strong>不闖禍的分寸</strong>。',
    dataset: [
      '私有保留集 657 個任務(v1.0),不公開防污染。',
      '模擬環境包含 Gmail、Google Sheets、Slack、Salesforce、Zendesk、Jira、HubSpot 等常見商用軟體。',
    ],
    method: [
      '模型透過結構化工具呼叫探索並使用 REST API,上限 50 回合、每任務 1 次。',
      '每個任務的檢核點分為「目標」(要達成)與「護欄」(不能打破)。',
      '全部用程式檢查最終環境狀態,<strong>不用 LLM 評審</strong>——完全客觀。',
    ],
    scoring: [
      '違反任何護欄 → 該任務 0 分;沒違反 → 得分 = 完成目標的百分比。',
      '<strong>分數意義</strong>:模擬企業導入 AI 自動化的實際風險與效益——能幹又不闖禍才能拿高分。',
    ],
    facts: [
      { label: '任務數', value: '657 個/6 商業領域' },
      { label: '型態', value: 'Agent 操作 REST API' },
      { label: '評分', value: '程式驗收;踩護欄=0 分' },
      { label: '限制', value: '50 回合' },
      { label: '開發者', value: 'Zapier(AA 實作)' },
    ],
    keywords: ['AutomationBench', 'Zapier', 'SaaS', '自動化', 'API', '護欄'],
  },
  {
    id: 'aa-analystagent',
    name: 'AA-AnalystAgent',
    zhName: '數據分析師代理測試',
    category: 'agents',
    badges: ['獨立排行榜', 'AA 自建', '最嚴格計分 pass^5'],
    oneLiner: '80 道商業/科學數據分析題:模型讀試算表與文件、寫 Python 算出答案——同一題連做 5 次全對才算通過。',
    analogy: '像數據分析師的面試實作題:「根據這三份 Excel,算出去年第四季的毛利率變化」。而且要連續五次都算對——偶爾矇對沒有用,考的是穩定的專業。',
    whatItTests:
      'AA-AnalystAgent 測試模型做<strong>端到端數據分析</strong>的能力:從原始試算表和文件出發,理解資料結構、寫程式計算、給出量化答案。涵蓋商業分析師日常的五種工作型態:查數診斷、篩選加總、比率計算、趨勢敏感度分析、損益與估值建模。',
    dataset: [
      '80 道量化問題、14 個領域:環境報告、貿易統計、醫療支出、水文氣象、政府預算、能源成本、財務模型、專案排程等。',
      '每題附一資料夾的參考檔案(xlsx、docx);<strong>私有題庫</strong>不公開,參考答案經人工獨立驗證。',
    ],
    method: [
      'Stirrup 框架+沙盒 Python 執行環境,模型自由寫程式分析資料。',
      '每題獨立重複 5 次。',
      'LLM 評審判定對錯,數值題另有程式預檢(數字對不對優先由程式判斷)。',
    ],
    scoring: [
      '<strong>pass^5</strong>:5 次全對才算通過該題;分數 = 全對題目的比例。',
      '<strong>分數意義</strong>:這是可靠度指標——企業要的不是「有時算對」的分析師,是「每次都算對」的分析師。',
    ],
    facts: [
      { label: '題數', value: '80 題/14 領域' },
      { label: '型態', value: 'Agent 寫 Python 分析資料' },
      { label: '重複次數', value: '5 次' },
      { label: '評分', value: 'pass^5(5 次全對)' },
      { label: '資料', value: '私有題庫' },
    ],
    keywords: ['AnalystAgent', '數據分析', 'Excel', '試算表', 'Python'],
  },
  {
    id: 'enterpriseops',
    name: 'EnterpriseOps-Gym-AA',
    zhName: '企業系統操作測試',
    category: 'agents',
    badges: ['獨立排行榜'],
    oneLiner: '1,117 個企業內部流程任務(8 大部門):模型透過工具即時操作模擬的企業系統,最後直接檢查資料庫改對了沒。',
    analogy: '像新進行政人員的系統操作考:「幫這位員工辦理離職流程」——要在人資、資產、帳號等系統裡把每一筆資料都改對。考官只看系統最終資料,不看你點了哪些按鈕。',
    whatItTests:
      'EnterpriseOps-Gym 由 ServiceNow 開發,測試模型能否完成<strong>有狀態、多步驟的企業工作流程</strong>:人資、IT、財務等 8 個業務領域的日常營運操作。「Gym(健身房)」指可重置的模擬環境——每次測試都從相同的乾淨狀態開始。',
    dataset: [
      '1,117 個「oracle 任務」(附標準答案狀態),分屬 8 個業務領域。',
      '在可重置的模擬企業伺服器(gym servers)上執行。',
    ],
    method: [
      '模型透過 MCP 工具與企業系統多輪互動,即時讀寫真實運作的資料庫。',
      '每任務重複 3 次。',
    ],
    scoring: [
      '<strong>SQL 狀態驗證器</strong>檢查資料庫最終狀態:結果導向,不管操作順序,做對就算對;嚴格 pass@1。',
      '<strong>分數意義</strong>:預測 AI 能否接手企業後台的例行流程——這類工作量大、規則明確,是 AI 自動化的第一線戰場。',
    ],
    facts: [
      { label: '任務數', value: '1,117 個/8 領域' },
      { label: '型態', value: 'Agent 操作企業系統(MCP 工具)' },
      { label: '重複次數', value: '3 次' },
      { label: '評分', value: 'SQL 狀態驗證,pass@1' },
      { label: '開發者', value: 'ServiceNow(AA 獨立實作)' },
    ],
    keywords: ['EnterpriseOps', 'ServiceNow', '企業', '流程', '資料庫'],
  },
  {
    id: 'itbench',
    name: 'ITBench-AA',
    zhName: 'IT 事故根因分析測試',
    category: 'agents',
    badges: ['獨立排行榜'],
    oneLiner: '59 個 Kubernetes 系統故障情境:模型翻閱警報、事件、追蹤紀錄,找出「到底是哪個元件害系統掛掉」。',
    analogy: '像系統管理員的破案考:網站半夜掛了,你面對一整面警報牆和紀錄檔,要找出真兇——是某個服務設定錯?還是網路規則擋住了流量?',
    whatItTests:
      'ITBench 由 IBM 開發,測試模型做<strong>網站可靠性工程(SRE)</strong>的核心技能:Kubernetes 叢集事故的根因分析。模型拿到故障當下的離線快照(警報、事件、追蹤、拓撲圖),要指認出造成故障的元件(部署、Pod、命名空間、網路政策等)。',
    dataset: [
      '59 個事故情境(公開+私有),每個都是真實型態的 Kubernetes 故障快照。',
      '答案是「肇因元件清單」,附專家標註的標準答案。',
    ],
    method: [
      '模型以六階段流程辦案:掌握環境 → 分析症狀 → 提出假說 → 蒐集證據 → 建立因果鏈 → 下結論,最後輸出結構化 JSON 指認肇因。',
      '每情境重複 3 次。',
    ],
    scoring: [
      '答案經 LLM 正規化後與標準答案比對實體;計分採「完整找出所有肇因時的平均精確率」——既要全找到,又不能亂指無辜元件。',
      '<strong>分數意義</strong>:反映 AI 能否協助(甚至取代)輪班待命的系統工程師做事故診斷。',
    ],
    facts: [
      { label: '情境數', value: '59 個' },
      { label: '型態', value: 'Agent 分析事故快照' },
      { label: '重複次數', value: '3 次' },
      { label: '評分', value: '實體比對,全召回下的平均精確率' },
      { label: '開發者', value: 'IBM(AA 獨立實作)' },
    ],
    keywords: ['ITBench', 'Kubernetes', 'SRE', '故障', '根因分析'],
  },
];

// 智慧指數的組成表(單獨渲染)
export interface IndexComponent {
  category: string;
  categoryWeight: string;
  eval_: string;
  evalId: string;
  weight: string;
  desc: string;
}

export const indexComponents: IndexComponent[] = [
  { category: '代理 Agents', categoryWeight: '34%', eval_: 'GDPval-AA v2', evalId: 'gdpval-aa', weight: '20%', desc: '真實職業工作成品(Elo)' },
  { category: '代理 Agents', categoryWeight: '34%', eval_: '𝜏³-Banking', evalId: 'tau3-banking', weight: '14%', desc: '銀行客服代理' },
  { category: '程式 Coding', categoryWeight: '24%', eval_: 'Terminal-Bench v2.1', evalId: 'terminal-bench', weight: '16%', desc: '終端機實戰任務' },
  { category: '程式 Coding', categoryWeight: '24%', eval_: 'SciCode', evalId: 'scicode', weight: '8%', desc: '科學計算程式題' },
  { category: '科學推理 Scientific Reasoning', categoryWeight: '24%', eval_: 'HLE', evalId: 'hle', weight: '12%', desc: '人類的最後一場考試' },
  { category: '科學推理 Scientific Reasoning', categoryWeight: '24%', eval_: 'GPQA Diamond', evalId: 'gpqa-diamond', weight: '6%', desc: '博士級科學選擇題' },
  { category: '科學推理 Scientific Reasoning', categoryWeight: '24%', eval_: 'CritPt', evalId: 'critpt', weight: '6%', desc: '研究級物理推理' },
  { category: '通用 General', categoryWeight: '18%', eval_: 'AA-LCR', evalId: 'aa-lcr', weight: '6%', desc: '長文本推理' },
  { category: '通用 General', categoryWeight: '18%', eval_: 'AA-Omniscience', evalId: 'aa-omniscience', weight: '12%', desc: '知識廣度與幻覺(準確率 8%+非幻覺率 4%)' },
];
