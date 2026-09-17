import type { BarItem, ExampleMap, ModelExample, TokenChip, Viz } from "../types.ts";

/**
 * Running example for the DeepSeek V4.1 Flash hall: a picture of a cat on a
 * mat plus a question about it. Layer counts and CSA2 mode assignments are the
 * real configuration; patch counts, token splits, chosen experts, selected
 * positions and probabilities are illustrative.
 */

type Loc = "zh" | "en";

const QUESTION = {
  zh: ["圖片", "裡", "的", "動物", "在", "做", "什麼", "？"],
  en: ["What", "is", "the", "animal", "in", "the", "picture", "doing", "?"],
} as const;

const ANSWER = {
  zh: ["一隻", "貓", "坐在", "墊子", "上", "。"],
  en: ["A", "cat", "is", "sitting", "on", "a", "mat", "."],
} as const;

const VISUAL_TOKENS = 196;
const seqLen = (locale: Loc) => VISUAL_TOKENS + QUESTION[locale].length;

export const deepseekExample: ModelExample = {
  input: {
    zh: "一張「貓坐在墊子上」的圖片，加上文字問題「圖片裡的動物在做什麼？」",
    en: "A picture of a cat sitting on a mat, plus the question \"What is the animal in the picture doing?\"",
  },
  output: { zh: "一隻貓坐在墊子上。", en: "A cat is sitting on a mat." },
  note: {
    zh: "層數與 CSA2 模式分配是真實設定；patch 數量、token 切法、被選中的專家與位置、機率則是示意。",
    en: "Layer counts and CSA2 mode assignments are the real configuration; patch counts, token splits, chosen experts, selected positions and probabilities are illustrative.",
  },
  image: true,
};

export const deepseekFlowTokens = {
  encoder: {
    zh: ["img", "img", ...QUESTION.zh],
    en: ["img", "img", ...QUESTION.en],
  },
  decoder: { zh: [...ANSWER.zh], en: [...ANSWER.en] },
};

function visualChips(count: number, sub?: string): TokenChip[] {
  return Array.from({ length: count }, (_, i) => ({ text: `img${i + 1}`, sub, state: "source" as const }));
}

function sequenceChips(locale: Loc, opts: { sub?: string; textSub?: (i: number) => string } = {}): TokenChip[] {
  const q = QUESTION[locale];
  return [
    { text: "img1", sub: opts.sub ?? "#0", state: "source" },
    { text: "img2", sub: opts.sub ?? "#1", state: "source" },
    { text: "…", state: "muted" },
    { text: `img${VISUAL_TOKENS}`, sub: opts.sub ?? `#${VISUAL_TOKENS - 1}`, state: "source" },
    ...q.map((text, i) => ({ text, sub: opts.textSub ? opts.textSub(i) : opts.sub ?? `#${VISUAL_TOKENS + i}` })),
  ];
}

const MHC_MIX: number[][] = [
  [0.55, 0.15, 0.2, 0.1],
  [0.15, 0.5, 0.1, 0.25],
  [0.2, 0.1, 0.6, 0.1],
  [0.1, 0.25, 0.1, 0.55],
];

function swaViz(locale: Loc): Viz {
  // One cell stands for 4 tokens: 51 cells ≈ the 204/205-token sequence.
  const cells = 51;
  const windowCells = 32; // 128 tokens
  const current = cells - 1;
  const secondary = Array.from({ length: windowCells }, (_, i) => current - 1 - i);
  const faded = Array.from({ length: current - windowCells }, (_, i) => i);
  return {
    type: "grid",
    cols: 17,
    rows: 3,
    active: [current],
    secondary,
    faded,
    legend:
      locale === "zh"
        ? { active: "目前 token「什麼」", secondary: "看得到：前 128 個 token", faded: "看不到：圖片上半部" }
        : { active: "current token \"doing\"", secondary: "visible: the 128 tokens before it", faded: "out of view: the upper picture" },
    caption: locale === "zh" ? "每格代表 4 個 token，整條序列共 204 個" : "Each cell stands for 4 tokens of the 205-token sequence",
  };
}

const ANIMAL_EXPERTS = [17, 88, 141, 203, 290, 377];
const DOING_EXPERTS = [5, 60, 199, 240, 311, 366];

function moeViz(locale: Loc): Viz {
  return {
    type: "grid",
    cols: 24,
    rows: 16,
    active: ANIMAL_EXPERTS,
    secondary: DOING_EXPERTS,
    legend:
      locale === "zh"
        ? { active: "「動物」被路由到的 6 位專家", secondary: "「什麼」被路由到的 6 位專家" }
        : { active: "the 6 experts routed for \"animal\"", secondary: "the 6 experts routed for \"doing\"" },
    caption: locale === "zh" ? "384 位路由專家（24 × 16）；共享專家未畫出" : "384 routed experts (24 × 16); the shared expert is not drawn",
  };
}

const SELECTED = [88, 89, 90, 105, 106, 107, 108, 122, 123, 124, 139, 140, 160, 161, 162, 163, 199, 201, 202];

function selectedBlocks(): number[] {
  const blocks = new Set<number>();
  for (const s of SELECTED) blocks.add(Math.floor(s / 8));
  return [...blocks].sort((a, b) => a - b);
}

function decFullViz(locale: Loc): Viz {
  const blockCells = selectedBlocks().flatMap((b) => Array.from({ length: 8 }, (_, i) => b * 8 + i)).filter((i) => !SELECTED.includes(i) && i < 204);
  return {
    type: "grid",
    cols: 17,
    rows: 12,
    active: SELECTED,
    secondary: blockCells,
    legend:
      locale === "zh"
        ? { active: "被選入 Top-512 的位置（示意）", secondary: "同一區塊（8 個位置）→ 進候選池" }
        : { active: "positions selected into the Top-512 (illustrative)", secondary: "same 8-position block → into the candidate pool" },
    caption: locale === "zh" ? "204 筆全域 KV：前 196 筆是圖片，最後 8 筆是問題" : "204 global-KV entries: the first 196 are the picture, the last 8 the question",
  };
}

function poolViz(locale: Loc): Viz {
  const blocks = selectedBlocks();
  const cells = blocks.length * 8;
  const active: number[] = [];
  const labels: Record<number, string> = {};
  blocks.forEach((b, row) => {
    labels[row * 8] = `${b * 8}`;
    for (let i = 0; i < 8; i++) if (SELECTED.includes(b * 8 + i)) active.push(row * 8 + i);
  });
  return {
    type: "grid",
    cols: 8,
    rows: cells / 8,
    active,
    labels,
    legend: locale === "zh" ? { active: "第 21 層選中的位置" } : { active: "positions chosen by layer 21" },
    caption:
      locale === "zh"
        ? `候選池：${blocks.length} 塊 × 8 個位置 = ${cells} 個候選（上限 2,048 塊 × 8 = 16,384）`
        : `Candidate pool: ${blocks.length} blocks × 8 positions = ${cells} candidates (limit 2,048 blocks × 8 = 16,384)`,
  };
}

function reindexBars(locale: Loc): BarItem[] {
  return locale === "zh"
    ? [
        { label: "墊子 img160–163", value: 0.91, highlight: true },
        { label: "貓身體 img105–108", value: 0.62 },
        { label: "動物・做・什麼", value: 0.55 },
        { label: "貓臉 img88–90", value: 0.31, muted: true },
      ]
    : [
        { label: "mat img160–163", value: 0.91, highlight: true },
        { label: "cat body img105–108", value: 0.62 },
        { label: "animal · picture · doing", value: 0.55 },
        { label: "cat face img88–90", value: 0.31, muted: true },
      ];
}

function kvViz(locale: Loc): Viz {
  const n = seqLen(locale);
  const v41 = (n * 890) / 1024;
  const llama = n * 128;
  return {
    type: "stack",
    items: [
      {
        type: "bars",
        items: [
          { label: locale === "zh" ? `V4.1 Flash · ${n} token` : `V4.1 Flash · ${n} tokens`, value: v41, display: `${Math.round(v41)} KB`, highlight: true },
          { label: locale === "zh" ? `Llama 3 8B · ${n} token` : `Llama 3 8B · ${n} tokens`, value: llama, display: `${(llama / 1024).toFixed(1)} MB` },
        ],
        caption: locale === "zh" ? "同一段輸入的全域／全部 KV 快取大小" : "Global / total KV cache for the same input",
      },
      {
        type: "bars",
        items: [
          { label: locale === "zh" ? "V4.1 Flash · 100 萬 token" : "V4.1 Flash · 1M tokens", value: 0.85, display: "0.85 GB", highlight: true },
          { label: locale === "zh" ? "Llama 3 8B · 100 萬 token" : "Llama 3 8B · 1M tokens", value: 128, display: "128 GB" },
        ],
        caption: locale === "zh" ? "塞滿一百萬 token 時" : "With a million-token context",
      },
    ],
  };
}

const PROBS = {
  zh: [
    { label: "一隻", value: 0.63, highlight: true },
    { label: "這是", value: 0.15 },
    { label: "貓", value: 0.09 },
    { label: "圖片", value: 0.03 },
    { label: "其他", value: 0.1, muted: true },
  ],
  en: [
    { label: "A", value: 0.61, highlight: true },
    { label: "The", value: 0.17 },
    { label: "It", value: 0.08 },
    { label: "In", value: 0.03 },
    { label: "other", value: 0.11, muted: true },
  ],
};

function generatedChips(locale: Loc): TokenChip[] {
  const a = ANSWER[locale];
  return [
    { text: a[0] ?? "", state: "new", sub: locale === "zh" ? "剛選出" : "just chosen" },
    ...a.slice(1).map((text) => ({ text, state: "future" as const })),
  ];
}

function dsparkViz(locale: Loc): Viz {
  const accepted = locale === "zh" ? ["貓", "坐在", "墊子", "上"] : ["cat", "is", "sitting", "on"];
  const rejected = locale === "zh" ? "了" : "the";
  const corrected = locale === "zh" ? "。" : "a";
  const chips: TokenChip[] = [
    ...accepted.map((text) => ({ text, state: "done" as const, sub: locale === "zh" ? "接受" : "accepted" })),
    { text: rejected, state: "muted", sub: locale === "zh" ? "拒絕" : "rejected" },
    { text: corrected, state: "new", sub: locale === "zh" ? "主模型改寫" : "main model's fix" },
  ];
  const confidence: Viz = {
    type: "bars",
    items: [0.95, 0.9, 0.88, 0.8, 0.45].map((v, i) => ({ label: locale === "zh" ? `草稿 ${i + 1}` : `draft ${i + 1}`, value: v, muted: i === 4 })),
    max: 1,
    caption: locale === "zh" ? "信心頭預測的接受機率；排程器據此決定下次驗證幾個" : "Acceptance probability from the confidence head; the scheduler sizes the next batch from it",
  };
  return { type: "stack", items: [{ type: "tokens", tokens: chips, caption: locale === "zh" ? "一次猜 5 個，主模型一次驗證" : "5 drafted at once, verified in one pass" }, confidence] };
}

export const deepseekExamples: ExampleMap = {
  "d-vit": {
    story: {
      zh: "圖片先被縮放成 14 的倍數（示意為 588×588），切成 42×42 = 1,764 塊 14×14 像素的 patch。每塊先線性投影成 1,024 維向量，再經過 32 層 ViT——每一層裡各 patch 互相注意，所以到最後，貓耳朵那一塊的向量已經知道自己屬於一隻坐著的貓，墊子那一塊也知道上面有東西。",
      en: "The picture is resized to a multiple of 14 (say 588×588) and cut into 42×42 = 1,764 patches of 14×14 pixels. Each patch is linearly projected to a 1,024-dim vector and passed through 32 ViT layers in which patches attend to each other, so by the end the vector for the cat's ear knows it belongs to a sitting cat, and the mat patch knows something is on it.",
    },
    viz: {
      zh: { type: "image", grid: 9, caption: "實際切成 42×42 = 1,764 塊（圖中以 9×9 示意）" },
      en: { type: "image", grid: 9, caption: "Really 42×42 = 1,764 patches (drawn as 9×9)" },
    },
  },
  "d-projector": {
    story: {
      zh: "3×3 的 pixel-unshuffle 把相鄰 9 塊接成一個長向量，1,764 塊變成 196 個（14×14），再經過兩層、隱藏 5,120 維的 MLP 投影到語言模型的向量空間。結果是 196 個「視覺 token」，語言模型會把它們當成一般 token 來讀。",
      en: "A 3×3 pixel-unshuffle concatenates each group of 9 neighbouring patches into one long vector, turning 1,764 patches into 196 (14×14), and a two-layer MLP with hidden size 5,120 projects them into the language model's vector space. The result is 196 \"visual tokens\" that the language model reads like ordinary tokens.",
    },
    viz: {
      zh: {
        type: "stack",
        items: [
          { type: "image", grid: 9, merge: 3, caption: "粗線框 = 3×3 合併後的一個視覺 token（示意 81 → 9；實際 1,764 → 196）" },
          { type: "tokens", tokens: visualChips(9, "視覺 token"), caption: "投影後的視覺 token，和文字嵌入同一個空間" },
        ],
      },
      en: {
        type: "stack",
        items: [
          { type: "image", grid: 9, merge: 3, caption: "Thick frame = one visual token after the 3×3 merge (81 → 9 here; really 1,764 → 196)" },
          { type: "tokens", tokens: visualChips(9, "visual token"), caption: "Projected visual tokens in the same space as text embeddings" },
        ],
      },
    },
  },
  "d-emb": {
    story: {
      zh: "文字問題「圖片裡的動物在做什麼？」切成 8 個 token（示意）。序列變成 196 個視覺 token 接著 8 個文字 token，共 204 個。從這裡開始模型不分圖文，一律當 token 處理；只有 MoE 的負載平衡會分別為圖片與文字 token 計算。",
      en: "The question \"What is the animal in the picture doing?\" becomes 9 text tokens (illustrative). The sequence is now 196 visual tokens followed by 9 text tokens, 205 in all. From here on the model treats picture and text alike, as tokens; only MoE load balancing is computed separately for image and text tokens.",
    },
    viz: {
      zh: { type: "tokens", tokens: sequenceChips("zh"), caption: "一條 204 個 token 的序列：位置 0–195 是圖片，196–203 是問題" },
      en: { type: "tokens", tokens: sequenceChips("en"), caption: "One 205-token sequence: positions 0–195 are the picture, 196–204 the question" },
    },
  },
  "d-engram": {
    story: {
      zh: "Engram 在第 1 層看每個位置最近的 2、3、4 個 token 組成的 n-gram，例如「動物 在」「在 做 什麼」「動物 在 做 什麼」，各用 8 個雜湊頭去查表，取回記憶向量，再由閘門依上下文決定加多少進主幹。像是直接翻字典，不用計算。視覺 token 也會被查，但多半查不到有意義的條目。",
      en: "At layer 1, Engram forms n-grams from each position's latest 2, 3 and 4 tokens, such as \"picture doing\", \"the picture doing\" and \"in the picture doing\", hashes each with 8 heads to look up a memory table, and a context-aware gate decides how much of the returned vector to add to the trunk. It is a dictionary lookup rather than computation. Visual tokens are looked up too but rarely hit meaningful entries.",
    },
    viz: {
      zh: {
        type: "stack",
        items: [
          { type: "tokens", tokens: [{ text: "動物 在", sub: "2-gram" }, { text: "在 做 什麼", sub: "3-gram" }, { text: "動物 在 做 什麼", sub: "4-gram" }], caption: "位置「什麼」前後組成的 n-gram（示意）" },
          { type: "bars", items: [{ label: "2-gram", value: 0.32 }, { label: "3-gram", value: 0.58, highlight: true }, { label: "4-gram", value: 0.15 }], max: 1, caption: "閘門開度：這次 3-gram 的記憶最有用" },
        ],
      },
      en: {
        type: "stack",
        items: [
          { type: "tokens", tokens: [{ text: "picture doing", sub: "2-gram" }, { text: "the picture doing", sub: "3-gram" }, { text: "in the picture doing", sub: "4-gram" }], caption: "n-grams ending at the position \"doing\" (illustrative)" },
          { type: "bars", items: [{ label: "2-gram", value: 0.32 }, { label: "3-gram", value: 0.58, highlight: true }, { label: "4-gram", value: 0.15 }], max: 1, caption: "Gate openness: this time the 3-gram memory is most useful" },
        ],
      },
    },
  },
  "d-swa": {
    story: {
      zh: "前兩層只用滑動視窗：token「什麼」（位置 202）只跟前面 128 個 token 互動——也就是整段問題加上最後約 120 個視覺 token（圖片下半部）；圖片上半部的視覺 token 在這層看不到。",
      en: "The first two layers use only the sliding window: the token doing (position 203) interacts with just the 128 tokens before it, the whole question plus the last 119 or so visual tokens (the lower part of the picture); the upper part of the picture is out of view in this layer.",
    },
    viz: { zh: swaViz("zh"), en: swaViz("en") },
  },
  "d-moe-a": {
    story: {
      zh: "路由器替每個 token 打分、選 6 個專家。以「動物」為例，它被送到專家 #17、#88、#141、#203、#290、#377（示意）；「什麼」則挑到另外 6 位。加上每個 token 都經過的共享專家，384 位裡真正動起來的只有 7 位——所以 5,520 億參數的模型，每個 token 只用到 80 億。",
      en: "The router scores every token and picks 6 experts. For animal they are experts #17, #88, #141, #203, #290 and #377 (illustrative); doing gets a different six. Together with the shared expert every token visits, only 7 of the 384 experts actually run, which is how a 552-billion-parameter model spends only 8 billion per token.",
    },
    viz: { zh: moeViz("zh"), en: moeViz("en") },
  },
  "d-mhc": {
    story: {
      zh: "每一層之間有 4 條殘差流。第 5 層算出的結果由一組依 token 計算的係數決定寫回哪幾條——下面的 4×4 混合矩陣是示意：對「動物」這個 token，主要寫回第 1、3 條——下一層再從各條混合讀入。Sinkhorn-Knopp 迭代讓這些係數每行每列的加總都接近 1，訊號才不會越傳越大。",
      en: "Between layers there are 4 residual streams. Which streams layer 5's output is written back to is decided by token-wise coefficients; the 4×4 mixing matrix below is illustrative: for animal it mostly writes to streams 1 and 3, and the next layer reads a mixture of the streams. Sinkhorn-Knopp iterations keep every row and column of these coefficients summing to about 1, so the signal cannot grow layer after layer.",
    },
    viz: {
      zh: { type: "heat", cols: ["流 1", "流 2", "流 3", "流 4"], colsLabel: "來源 ↓ · 目的 →", rows: MHC_MIX.map((r, i) => ({ label: `流 ${i + 1}`, values: r })), showValues: true, caption: "「動物」這個 token 的混合係數（示意，每行每列加總為 1）" },
      en: { type: "heat", cols: ["s1", "s2", "s3", "s4"], colsLabel: "from ↓ · to →", rows: MHC_MIX.map((r, i) => ({ label: `s${i + 1}`, values: r })), showValues: true, caption: "Mixing coefficients for the token animal (illustrative; rows and columns sum to 1)" },
    },
  },
  "d-csa2-enc-full": {
    story: {
      zh: "第 2 層是 Full 模式。先壓縮：204 個 token 每 2 個併成 1 筆主 KV，變成 102 筆。接著索引器（32 頭 × 128 維）替「什麼」對這 102 筆打分，挑出最相關的 512 筆——這裡序列短，全部都入選；上下文有一百萬 token 時，才會真的只留 512 筆。這一層算出的主 KV 與 Top-512 名單，接下來 5 層直接沿用。",
      en: "Layer 2 is Full mode. First compression: the 205 tokens are merged in pairs into 103 main-KV entries. Then the indexer (32 heads × 128 dims) scores those entries for doing and keeps the 512 most relevant; the sequence is short here, so all of them qualify, and only with a million-token context does the cut to 512 bite. The main KV and Top-512 list this layer computes are reused by the next 5 layers.",
    },
    viz: {
      zh: {
        type: "stack",
        items: [
          { type: "tokens", tokens: [{ text: "img1 + img2", sub: "→ KV 1", state: "source" }, { text: "img3 + img4", sub: "→ KV 2", state: "source" }, { text: "…", state: "muted" }, { text: "動物 + 在", sub: "→ KV 101" }, { text: "做 + 什麼", sub: "→ KV 102" }], caption: "2:1 壓縮：204 個 token → 102 筆主 KV" },
          { type: "grid", cols: 17, rows: 6, active: Array.from({ length: 102 }, (_, i) => i), legend: { active: "被索引器選入 Top-512" }, caption: "102 筆全部入選；長文時只留 512 筆" },
        ],
      },
      en: {
        type: "stack",
        items: [
          { type: "tokens", tokens: [{ text: "img1 + img2", sub: "→ KV 1", state: "source" }, { text: "img3 + img4", sub: "→ KV 2", state: "source" }, { text: "…", state: "muted" }, { text: "picture + doing", sub: "→ KV 102" }, { text: "? + (pad)", sub: "→ KV 103" }], caption: "2:1 compression: 205 tokens → 103 main-KV entries" },
          { type: "grid", cols: 13, rows: 8, active: Array.from({ length: 103 }, (_, i) => i), faded: [103], legend: { active: "selected into the Top-512 by the indexer" }, caption: "All 103 entries qualify; with long inputs only 512 survive" },
        ],
      },
    },
  },
  "d-csa2-enc-reuse": {
    story: {
      zh: "第 3–7 層是 Reuse：不重算主 KV、也不重跑索引器，直接拿第 2 層的 102 筆主 KV 和 Top-512 名單，只算自己的查詢與滑動視窗 KV。五層共用一份，KV 快取只存一次。",
      en: "Layers 3–7 are Reuse: they neither recompute the main KV nor run the indexer; they take layer 2's 103 main-KV entries and its Top-512 list and compute only their own queries and sliding-window KV. Five layers share one copy, stored in the KV cache once.",
    },
    viz: {
      zh: { type: "steps", items: ["第 2 層（Full）：壓縮出 102 筆主 KV，索引器選出 Top-512", "第 3 層（Reuse）：借用第 2 層的主 KV 與名單，只算 Q 和滑動視窗", "第 4–7 層（Reuse）：同上，四層都借同一份", "第 8 層（Full）：新的一組開始，重新計算"] },
      en: { type: "steps", items: ["Layer 2 (Full): compresses 103 main-KV entries, indexer picks the Top-512", "Layer 3 (Reuse): borrows layer 2's main KV and list; computes only Q and the sliding window", "Layers 4–7 (Reuse): the same, all four borrowing one copy", "Layer 8 (Full): a new group starts and recomputes"] },
    },
  },
  "d-enc-out": {
    story: {
      zh: "第 20 層的隱藏狀態被投影成解碼器要用的全域 KV：不壓縮，204 個 token 各一筆（每個解碼器 Full 層有自己的一組投影權重）。讀圖和讀問題（prefill）到這裡就算完成——只跑了 20 層，解碼器不必為這 204 個 token 再跑一次。",
      en: "The hidden state of layer 20 is projected into the decoder's global KV: uncompressed, one entry per token for all 205 (each decoder Full layer has its own projection weights). Reading the picture and the question (prefill) is complete at this point, after only 20 layers; the decoder never needs to run over these 205 tokens.",
    },
    viz: {
      zh: { type: "tokens", tokens: sequenceChips("zh", { sub: "→ 全域 KV" }), caption: "204 筆解碼器全域 KV 準備好了；prefill 每 token 只動用 80 億參數" },
      en: { type: "tokens", tokens: sequenceChips("en", { sub: "→ global KV" }), caption: "205 decoder global-KV entries are ready; prefill used only 8B parameters per token" },
    },
  },
  "d-csa2-dec-full": {
    story: {
      zh: "開始生成第一個字。第 21 層（解碼器第 1 層）是 Full：新位置的查詢對 204 筆全域 KV 打分、選出 Top-512——示意中最相關的是貓身體與墊子那幾個視覺 token，以及「動物」「做」「什麼」——並把它們所在的區塊（每塊 8 個位置）收進候選池。",
      en: "Generation of the first word begins. Layer 21 (decoder layer 1) is Full: the new position's query scores all global-KV entries and selects a Top-512, illustratively the visual tokens on the cat's body and the mat plus animal, picture and doing, and the 8-position blocks containing them are gathered into the candidate pool.",
    },
    viz: { zh: decFullViz("zh"), en: decFullViz("en") },
  },
  "d-pool": {
    story: {
      zh: "候選池的上限是 2,048 塊 × 8 個位置 = 16,384 個候選，這個例子只用到 6 塊（示意）。後面的 Reindex 層只在這些塊裡重新打分，長文時每個查詢的成本就從「隨長度成長」變成「固定」。",
      en: "The pool can hold up to 2,048 blocks × 8 positions = 16,384 candidates; this example uses just 6 blocks (illustrative). Later Reindex layers rescore only within these blocks, so for long inputs the per-query cost goes from growing with length to constant.",
    },
    viz: { zh: poolViz("zh"), en: poolViz("en") },
  },
  "d-csa2-dec-reindex": {
    story: {
      zh: "第 25 層是 Reindex：共用同一份主 KV，但用自己的索引器在候選池裡重新排名。這一層更在意「坐在什麼上面」，所以墊子附近的視覺 token 排到前面，貓臉的 token 往後掉。",
      en: "Layer 25 is Reindex: it shares the same main KV but re-ranks within the candidate pool with its own indexer. This layer cares more about \"sitting on what\", so the visual tokens near the mat move up and the cat-face tokens drop.",
    },
    viz: {
      zh: { type: "bars", items: reindexBars("zh"), max: 1, caption: "第 25 層索引器在候選池內重新打分（示意）" },
      en: { type: "bars", items: reindexBars("en"), max: 1, caption: "Layer 25's indexer rescoring inside the pool (illustrative)" },
    },
  },
  "d-csa2-dec-reuse": {
    story: {
      zh: "解碼器其餘 15 層是 Reuse：直接沿用同組第一層（Full 或 Reindex）選好的名單，只算自己的查詢與滑動視窗。20 層解碼器只跑 5 次索引器。",
      en: "The other 15 decoder layers are Reuse: they take the list chosen by the first layer of their group (Full or Reindex) and compute only their own queries and sliding window. Twenty decoder layers run the indexer just 5 times.",
    },
    viz: {
      zh: { type: "steps", items: ["第 21 層 Full → 第 22–24 層 Reuse", "第 25 層 Reindex → 第 26–28 層 Reuse", "第 29 層 Reindex → 第 30–32 層 Reuse", "第 33 層 Reindex → 第 34–36 層 Reuse", "第 37 層 Reindex → 第 38–40 層 Reuse"] },
      en: { type: "steps", items: ["Layer 21 Full → layers 22–24 Reuse", "Layer 25 Reindex → layers 26–28 Reuse", "Layer 29 Reindex → layers 30–32 Reuse", "Layer 33 Reindex → layers 34–36 Reuse", "Layer 37 Reindex → layers 38–40 Reuse"] },
    },
  },
  "d-kv": {
    story: {
      zh: "這 204 個 token 的全域 KV 經過跨層共享與 FP4 儲存後，只佔 204 × 890 bytes ≈ 177 KB。同樣的內容若用 Llama 3 8B 的方式（每層各存一份、bf16）要 204 × 128 KB ≈ 25.5 MB。塞滿一百萬 token 時，V4.1 的全域 KV 也只要約 0.85 GB。",
      en: "After cross-layer sharing and FP4 storage, the global KV for these 205 tokens takes only 205 × 890 bytes ≈ 178 KB. The same content stored the Llama 3 8B way (one copy per layer, bf16) would need 205 × 128 KB ≈ 25.6 MB. With a million tokens, V4.1's global KV is still only about 0.85 GB.",
    },
    viz: { zh: kvViz("zh"), en: kvViz("en") },
  },
  "d-head": {
    story: {
      zh: "第 40 層在新位置的輸出經過預測頭變成詞彙分數，softmax 後：「一隻」0.63、「這是」0.15、「貓」0.09……選出「一隻」。接著一個字一個字產生「貓」「坐在」「墊子」「上」「。」，每一步只重跑 20 層解碼器，全域 KV 不必重算。",
      en: "Layer 40's output at the new position passes through the prediction head into vocabulary scores; after softmax: A 0.61, The 0.17, It 0.08… A is chosen. Then, word by word, cat, is, sitting, on, a, mat and \".\" follow, each step rerunning only the 20 decoder layers, with the global KV never recomputed.",
    },
    viz: {
      zh: { type: "stack", items: [{ type: "bars", items: PROBS.zh, max: 1, caption: "第一個字的機率" }, { type: "tokens", tokens: generatedChips("zh"), caption: "逐字生成完整回答" }] },
      en: { type: "stack", items: [{ type: "bars", items: PROBS.en, max: 1, caption: "Probabilities for the first word" }, { type: "tokens", tokens: generatedChips("en"), caption: "The full answer, generated word by word" }] },
    },
  },
  "d-dspark": {
    story: {
      zh: "正式服務時不會一次只產生一個字。DSpark 的 3 層小草稿器一次猜 5 個：「貓」「坐在」「墊子」「上」「了」，主模型用一次前向同時驗證：前 4 個和自己的預測一致、被接受；第 5 個主模型想接的是「。」，就從那裡改寫。信心頭預測每個位置的接受率，排程器據此決定下一輪要驗證幾個。",
      en: "In production the model does not emit one word at a time. DSpark's 3-block drafter guesses 5 at once: cat, is, sitting, on, the; the main model verifies them in a single forward pass: the first 4 match its own predictions and are accepted, while for the fifth it wanted a, so it rewrites from there. A confidence head predicts each position's acceptance rate and the scheduler uses it to decide how many to verify next round.",
    },
    viz: { zh: dsparkViz("zh"), en: dsparkViz("en") },
  },
};
