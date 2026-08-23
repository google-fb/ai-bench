export const QUIZ_QUESTIONS = [
  {
    id: 1,
    benchmarkName: "MMLU-Pro 綜合學科考題",
    category: "物理與熱力學",
    difficulty: "高中段考題",
    question: "在一封閉絕熱容器中，理想氣體進行自由膨脹（Free Expansion），體積變為原來的兩倍。請問氣體的溫度會發生什麼變化？",
    options: [
      "A. 溫度升高，因為分子運動空間增加擴散加快",
      "B. 溫度降低，因為氣體向外膨脹消耗了能量",
      "C. 溫度維持不變，因為自由膨脹對外不做功且無熱量交換",
      "D. 溫度減半，因為波以耳定律壓力與體積成反比"
    ],
    correctIndex: 2,
    explanation: "根據熱力學第一定律 ΔU = Q - W。絕熱容器 Q=0，真空自由膨脹對外不做功 W=0，故內能變化 ΔU=0。對於理想氣體，內能僅為溫度的函數，因此溫度維持不變！",
    aiTypicalMistake: "許多非推理型 AI 會直覺聯想到「膨脹冷卻（如氣體噴霧罐噴出時變冷）」，誤以為氣體對外做了功，因而選 B。"
  },
  {
    id: 2,
    benchmarkName: "AIME 2025 數學邀請賽",
    category: "代數與數論",
    difficulty: "奧林匹亞/競賽級",
    question: "若二次方程式 x^2 - 10x + c = 0 的兩根均為質數，求常數 c 的所有可能值？",
    options: [
      "A. c = 21 (兩根為 3 與 7)",
      "B. c = 9 (兩根為 1 與 9)",
      "C. c = 25 (兩根為 5 與 5)",
      "D. c = 21 或 c = 25 (兩根可為 3, 7 或 5, 5)"
    ],
    correctIndex: 3,
    explanation: "設兩根為質數 p, q。由根與係數關係：p + q = 10，c = p * q。和為 10 的兩質數組合有：(3, 7) 和 (5, 5)（題目未限定相異根，5 是質數）。因此 c = 3*7=21 或 c = 5*5=25。",
    aiTypicalMistake: "AI 容易忽略「重根 (5, 5)」也是質數根的可能，只回答 c=21。"
  },
  {
    id: 3,
    benchmarkName: "IFEval 嚴格指令遵循",
    category: "格式約束",
    difficulty: "高中段考題",
    question: "假設使用者下達指令：「用一句話說明什麼是光速，限制：字數必須在 25 字以內，且整句話絕不能出現『每秒』這兩個字。」以下哪個回答完全符合？",
    options: [
      "A. 光速是光在真空中前進的速度，大約是每秒三十萬公里。",
      "B. 光速是宇宙最高速度極限，真空傳播率約三十萬公里一秒。",
      "C. 光速就是光在真空中傳播的速度，這是物理學上目前所知最快的訊號極限速率。",
      "D. 光子在真空每秒可奔馳三十萬公里，是宇宙最極限速度！"
    ],
    correctIndex: 1,
    explanation: "選項 B 字數為 24 字，且用「一秒」代替「每秒」，完美避開負面約束；A 與 D 出現了「每秒」，C 字數為 34 字嚴重超標！",
    aiTypicalMistake: "一般 AI 在生成時很難精確計算字數倒數計時器，常在最後幾字超標，或隨手順口帶出習慣用語「每秒」。"
  },
  {
    id: 4,
    benchmarkName: "GPQA Diamond 博士級科學推理",
    category: "分子生物學",
    difficulty: "學測/指考題",
    question: "在真核生物的 DNA 複製過程中，為什麼後隨股（Lagging strand）必須以岡崎片段（Okazaki fragments）的不連續方式合成？",
    options: [
      "A. 因為解旋酶（Helicase）只能向單一方向解開雙股螺旋",
      "B. 因為 DNA 聚合酶（DNA Polymerase）催化合成的方向只能嚴格由 5' 端朝向 3' 端",
      "C. 因為 RNA 引子（Primer）無法附著在後隨股的 3' 端",
      "D. 因為拓撲異構酶（Topoisomerase）會阻礙連續合成"
    ],
    correctIndex: 1,
    explanation: "DNA 雙螺旋為反向平行結構。所有已知的 DNA 聚合酶只能在既有核苷酸的 3'-OH 端加上新的去氧核糖核苷酸（即只能 5' -> 3' 合成）。後隨股的模板方向為 5' -> 3'，因此必須隨複製叉前進方向反覆逆向分段合成。",
    aiTypicalMistake: "非專業模型容易把解旋酶的行進方向與聚合酶催化活性位點的極性方向混為一談。"
  },
  {
    id: 5,
    benchmarkName: "SWE-bench Verified 軟體工程實戰",
    category: "程式開發",
    difficulty: "學測/指考題",
    question: "在大型真實軟體專案中，為什麼單純修好當前 Bug 的程式碼還不夠，還必須跑過「回歸測試（Regression Testing）」？",
    options: [
      "A. 為了確保修復 Bug 的同時，沒有破壞原本其他模組已經正常運作的功能",
      "B. 為了把程式碼重新格式化成規定的縮排風格",
      "C. 為了把程式碼自動編譯成更小的二進位檔案",
      "D. 為了測試使用者的網路連線速度是否正常"
    ],
    correctIndex: 0,
    explanation: "大型系統中各模組高度耦合，常常改了 A 檔案的一行程式碼，卻導致依賴它的 B 模組崩潰。回歸測試就是透過上千個既有測資，確保系統「舊功能完全沒被改壞」。",
    aiTypicalMistake: "傳統 AI 常只盯著局部報錯修改，容易引入副作用（Side Effects），導致 SWE-bench 測試大量失敗。"
  }
];
