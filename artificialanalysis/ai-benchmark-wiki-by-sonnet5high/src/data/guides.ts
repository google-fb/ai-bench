export const HOW_TO_READ = {
  title: "分數到底在說什麼？",
  intro:
    "AI 排行榜看起來像電玩分數，但其實每一種分數的遊戲規則都不一樣。先學會看規則，再看名次。",
  sections: [
    {
      heading: "正確率不是學測級分",
      body: [
        "很多評測用「答對幾題除以總題數」。但題目難度差很多：GPQA Diamond 博士只約 65%，人類最後一考連最強模型也常常只有兩成左右。",
        "所以 40 分可能已經是前段班，90 分也可能只是舊考題被刷滿。先問「這張考卷有多難」，再問「這個分數高不高」。",
      ],
    },
    {
      heading: "Pass@1：第一次就要對",
      body: [
        "像考試不能重交。模型第一次交的答案才算。若同一題測 3 或 5 次，會把所有次數平均，減少「剛好蒙對」。",
        "AA-AnalystAgent 更嚴，用 pass^5：五次全對才算。這是在測穩定性，不是測天花板。",
      ],
    },
    {
      heading: "Elo：沒有標準答案時的段位",
      body: [
        "報告、簡報、備忘錄很難說「唯一正解」。評審就會把兩份作業匿名對打，贏的加分。",
        "GDPval-AA 把人類專家錨在 1000 分。低很多代表整體成品還明顯不如熟練的人；接近或超過則代表有時已能交出職業級成果。",
      ],
    },
    {
      heading: "看狀態，不看說話好聽",
      body: [
        "銀行客服、企業流程、SaaS 自動化，常常看資料庫最後對不對。講得很有同理心但沒把爭議案件開好，仍是 0 分。",
        "有防護欄的評測更狠：踩到紅線，整題直接零分。",
      ],
    },
    {
      heading: "綜合指數是加權總分",
      body: [
        "智力指數把九項成績依比重平均。代理人現在最重，因為大家愈來愈在乎「會不會把事情做完」。",
        "總分方便比大小，但選模型時仍要看你在乎的那一科：寫程式、守規則、中文、看圖、法律或數學。",
      ],
    },
  ],
};

export const WHAT_IS_BENCHMARK = {
  title: "什麼是 AI Benchmark？",
  intro:
    "Benchmark 就是 AI 的模擬考。題目固定、規則固定，才能比較 GPT、Claude、Gemini 誰比較強。",
  points: [
    {
      title: "為什麼需要統一考試",
      text: "如果每家公司自己出考卷、自己公布分數，人人都是第一名。獨立機構用同一套題測所有模型，比較像全國會考。",
    },
    {
      title: "測試集是什麼",
      text: "就是真正拿來打分數的那包題。好的測試集應該是模型沒背過的。如果考題早就在網路上到處貼，模型可能是「背答案」而不是「會解題」，這叫污染。",
    },
    {
      title: "怎麼測",
      text: "通常用同一套提示詞、同一溫度、同一個代理人框架。有的只准回答，有的准搜尋、跑程式、改資料庫。測完用程式、測試案例或另一個 AI 閱卷。",
    },
    {
      title: "方法為什麼重要",
      text: "換提示詞、換閱卷老師、換步數上限，分數就會變。所以要看「誰測的、怎麼測的」。本站內容以 Artificial Analysis 的獨立方法為準。",
    },
  ],
};

export const INDEX_WEIGHTS = [
  {
    category: "代理人 34%",
    items: [
      { name: "GDPval-AA v2", weight: "20%", href: "/wiki/gdpval-aa" },
      { name: "τ³-Banking", weight: "14%", href: "/wiki/tau3-banking" },
    ],
  },
  {
    category: "程式 24%",
    items: [
      { name: "Terminal-Bench v2.1", weight: "16%", href: "/wiki/terminal-bench-v21" },
      { name: "SciCode", weight: "8%", href: "/wiki/scicode" },
    ],
  },
  {
    category: "科學推理 24%",
    items: [
      { name: "人類最後一考", weight: "12%", href: "/wiki/hle" },
      { name: "GPQA Diamond", weight: "6%", href: "/wiki/gpqa-diamond" },
      { name: "CritPt", weight: "6%", href: "/wiki/critpt" },
    ],
  },
  {
    category: "一般能力 18%",
    items: [
      { name: "AA-Omniscience", weight: "12%", href: "/wiki/aa-omniscience" },
      { name: "AA-LCR", weight: "6%", href: "/wiki/aa-lcr" },
    ],
  },
];
