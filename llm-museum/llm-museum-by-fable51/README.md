# LLM 建築博物館 · LLM Architecture Museum

用 Three.js 打造的 3D 博物館，把三代大語言模型的架構堆成可以走近、旋轉、點選的展品，一層一層看懂每個模組在做什麼。

| 展廳 | 展品 | 重點 |
| --- | --- | --- |
| 1 · 2017 | 原始 Transformer（Google） | 編碼器–解碼器、多頭注意力、Add & Norm、正弦位置編碼 |
| 2 · 2024 | Llama 3（Meta） | 純解碼器稠密模型：RMSNorm、RoPE、GQA、SwiGLU、KV 快取 |
| 3 · 2026 | DeepSeek V4.1 Flash（DeepSeek-AI） | 因果編碼器–解碼器（CED）、CSA2 三種模式、DeepSeekMoE、mHC、Engram、DSpark、FP4 共享 KV |

每座展品的層數、模組順序與數字都取自論文／技術報告（見面板底部的「資料來源」），並附上繁體中文與英文的講解。

## 貫穿全程的具體範例

每座展品都用同一個例子從頭走到尾，點任一模組就能看到「這個範例在這一層長什麼樣子」：token 方塊、注意力權重矩陣、被路由到的專家、候選位置、機率長條……配上一段講故事式的說明，也會一起被朗讀。

| 展廳 | 範例輸入 | 範例輸出 |
| --- | --- | --- |
| Transformer | 英文句子 "The cat sat on the mat."（中文介面翻成中文、英文介面翻成德文） | 「貓坐在墊子上。」／"Die Katze saß auf der Matte." |
| Llama 3 | 提示「台灣最高的山是」／"The highest mountain in Taiwan is" | 「玉山，海拔 3,952 公尺。」／"Yushan, at 3,952 metres." |
| DeepSeek V4.1 Flash | 一張貓坐在墊子上的圖片 ＋ 問題「圖片裡的動物在做什麼？」 | 「一隻貓坐在墊子上。」／"A cat is sitting on a mat." |

層數與模式分配是真實設定；向量數值、注意力權重、被選中的專家與位置、機率都是示意（面板上有註明）。3D 場景裡沿主幹上升的光點也會帶著範例的 token（例如 "cat"、「玉山」）。

## 功能

- **3D 展廳**：拖曳旋轉、滾輪縮放、右鍵平移；點展品底座的名牌可走近該展品，點任一方塊或標籤可看說明。外框標「×N」表示那組方塊重複 N 層。方塊內部有小裝飾暗示模組本質（注意力頭、MoE 專家格會輪流亮起 6 位被路由到的專家、輸出機率長條……）。2D 標籤會在每次鏡頭移動後做一次碰撞排開，避免彼此重疊。
- **手機版面**：面板變成底部抽屜、工具列縮成一列、只保留被選取方塊的 3D 標籤；點選模組會直接飛到該方塊並展開抽屜。
- **中英文切換**：右上角 `EN／中文`，介面、3D 標籤、名牌、講解全部切換，選擇會記住。
- **語音朗讀**：使用瀏覽器內建的 Web Speech API。可播放／暫停／停止、0.5×–2.0× 調整語速（朗讀中調整會立即生效）、選擇語音；朗讀時面板會同步標示正在唸的句子。長文會依句子切段，避免 Chrome 中途停掉。
- **導覽模式**：從展品介紹開始，鏡頭自動走到每個模組並朗讀，可上一站／下一站或隨時結束；沒有語音引擎時改用估算時間自動前進。
- **資料流動畫**：主幹上緩慢上升的光點示意 token 由下往上流動，可關閉。
- 可用 `#/<模型>/<模組>` 直接分享某個模組，例如 `#/deepseek-v41-flash/d-moe-a`。鍵盤：`←` `→` 切換模組或導覽站、`Esc` 停止、空白鍵暫停／繼續朗讀。

## 開發

```bash
cd llm-museum/llm-museum-by-fable51
npm install
npm run dev          # http://localhost:5174
npm run build        # tsc --noEmit && vite build → dist/
npm run test:unit    # 句子切分、語音挑選、範例資料完整性（node:test）
npm run test:e2e     # Playwright，使用系統 Chrome + SwiftShader 軟體 WebGL
```

e2e 測試會以假的 `speechSynthesis` 記錄每段朗讀的語言、語速與語音，驗證中英文切換、語速調整、暫停／停止與導覽流程。

## 專案結構

```text
src/
  content/        三個模型的雙語架構資料（types.ts 定義 Block / Column / Group / Link / Viz）
  content/examples/  每個模型的貫穿範例：各模組的故事文字與視覺化資料
  viz.ts          範例視覺化的渲染（token 方塊、熱度圖、長條、格子、RoPE 轉盤、範例圖片）
  scene/          Three.js：museum.ts（展廳、燈光、鏡頭、點選）、exhibit.ts（單一展品）、palette.ts（大地色系）
  speech.ts       Web Speech 控制器與句子切分
  reading.ts      朗讀文字組合（標題、一句話、詳細說明）
  ui.ts           側邊面板、底部工具列、展廳導覽列
  main.ts         狀態串接與導覽模式
```

新增展品只需在 `src/content/` 加一個 `ModelSpec` 並加入 `MODELS`。

GitHub Pages：<https://google-fb.github.io/ai-bench/llm-museum/llm-museum-by-fable51/>
