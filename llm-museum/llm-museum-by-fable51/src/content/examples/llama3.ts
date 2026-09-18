import { fakeVector, type ExampleMap, type HeatRow, type ModelExample, type TokenChip, type Viz } from "../types.ts";

/**
 * Running example for the Llama 3 hall: completing a prompt about Taiwan's
 * highest mountain. Token splits, ids and every number are illustrative.
 */

const PROMPT = {
  zh: { tokens: ["台灣", "最高", "的", "山", "是"], ids: ["116489", "105218", "9554", "58231", "21043"], next: "玉山", rest: ["，", "海拔", "3,952", "公尺", "。"] },
  en: { tokens: ["The", "highest", "mountain", "in", "Taiwan", "is"], ids: ["791", "8592", "16700", "304", "28713", "374"], next: "Yushan", rest: [",", "at", "3,952", "metres", "."] },
} as const;

type Loc = "zh" | "en";

export const llama3Example: ModelExample = {
  input: {
    zh: "提示：「台灣最高的山是」，讓模型接著寫下去",
    en: "Prompt: \"The highest mountain in Taiwan is\"; the model continues it",
  },
  output: { zh: "玉山，海拔 3,952 公尺。", en: "Yushan, at 3,952 metres." },
  note: {
    zh: "token 切法、token 編號、向量數值、注意力權重與機率都是示意，用來說明每一層的形狀。",
    en: "Token splits, token ids, vector values, attention weights and probabilities are illustrative; they show the shape of each layer.",
  },
};

export const llama3FlowTokens = {
  zh: [...PROMPT.zh.tokens, PROMPT.zh.next],
  en: [...PROMPT.en.tokens, PROMPT.en.next],
};

function promptChips(locale: Loc, opts: { ids?: boolean; strip?: boolean; sub?: (i: number) => string; current?: boolean } = {}): TokenChip[] {
  const p = PROMPT[locale];
  return p.tokens.map((text, i) => ({
    text,
    sub: opts.sub ? opts.sub(i) : opts.ids ? `id ${p.ids[i]}` : undefined,
    strip: opts.strip ? fakeVector(600 + i, 8) : undefined,
    state: opts.current && i === p.tokens.length - 1 ? "current" : "source",
  }));
}

function normRows(labels: [string, string]): HeatRow[] {
  const before = fakeVector(701, 8).map((v) => Math.round(v * 250) / 100);
  const rms = Math.sqrt(before.reduce((a, b) => a + b * b, 0) / before.length) || 1;
  const after = before.map((v) => Math.round((v / rms) * 100) / 100);
  return [
    { label: labels[0], values: before.map((v) => Math.max(-1, Math.min(1, v / 2.5))) },
    { label: labels[1], values: after.map((v) => Math.max(-1, Math.min(1, v))), highlight: true },
  ];
}

const GQA_ZH: (number | null)[][] = [
  [1, null, null, null, null],
  [0.45, 0.55, null, null, null],
  [0.2, 0.5, 0.3, null, null],
  [0.3, 0.35, 0.1, 0.25, null],
  [0.3, 0.1, 0.05, 0.45, 0.1],
];
const GQA_EN: (number | null)[][] = [
  [1, null, null, null, null, null],
  [0.4, 0.6, null, null, null, null],
  [0.15, 0.5, 0.35, null, null, null],
  [0.1, 0.15, 0.55, 0.2, null, null],
  [0.05, 0.1, 0.4, 0.2, 0.25, null],
  [0.05, 0.1, 0.4, 0.05, 0.3, 0.1],
];

function gqaViz(locale: Loc): Viz {
  const p = PROMPT[locale];
  const m = locale === "zh" ? GQA_ZH : GQA_EN;
  const heads: Viz = {
    type: "grid",
    cols: 8,
    rows: 4,
    active: [0, 8, 16, 24],
    secondary: Array.from({ length: 28 }, (_, i) => i).filter((i) => i % 8 !== 0),
    labels: Object.fromEntries(Array.from({ length: 8 }, (_, c) => [c + 24, `KV${c + 1}`])),
    legend:
      locale === "zh"
        ? { active: "第 1 組的 4 個查詢頭", secondary: "其他 28 個查詢頭" }
        : { active: "the 4 query heads of group 1", secondary: "the other 28 query heads" },
    caption: locale === "zh" ? "32 個查詢頭排成 8 直行，每直行共用一組 K、V（KV1–KV8）" : "32 query heads in 8 columns; each column shares one K/V set (KV1–KV8)",
  };
  const attention: Viz = {
    type: "heat",
    cols: [...p.tokens],
    rows: p.tokens.map((tok, i) => ({ label: tok, values: m[i] ?? [], highlight: i === p.tokens.length - 1 })),
    showValues: true,
    caption: locale === "zh" ? "其中一個頭的因果注意力；空白 = 被遮罩的未來" : "Causal attention in one head; blank = masked future",
  };
  return { type: "stack", items: [attention, heads] };
}

function kvViz(locale: Loc): Viz {
  const p = PROMPT[locale];
  const n = p.tokens.length;
  const chips: TokenChip[] = p.tokens.map((text) => ({ text, sub: "K ✓ V ✓", state: "done" }));
  chips.push({ text: p.next, sub: locale === "zh" ? "下一輪才算" : "computed next round", state: "new" });
  const perToken = 128;
  const bars: Viz = {
    type: "bars",
    items: [
      { label: locale === "zh" ? `${n} 個 token` : `${n} tokens`, value: n * perToken, display: `${n * perToken} KB` },
      { label: locale === "zh" ? "1,000 個 token" : "1,000 tokens", value: 1000 * perToken, display: "125 MB" },
      { label: locale === "zh" ? "128K 個 token" : "128K tokens", value: 131072 * perToken, display: "16 GB", highlight: true },
    ],
    caption: locale === "zh" ? "8B 模型、bf16：每 token 每層 4 KB × 32 層 = 128 KB" : "8B model, bf16: 4 KB per token per layer × 32 layers = 128 KB",
  };
  return { type: "stack", items: [{ type: "tokens", tokens: chips, caption: locale === "zh" ? "這一層快取裡的 K、V" : "K and V held in this layer's cache" }, bars] };
}

function residualRows(labels: [string, string, string]): HeatRow[] {
  const x = fakeVector(801, 8);
  const attn = fakeVector(802, 8).map((v) => Math.round(v * 45) / 100);
  const sum = x.map((v, i) => Math.max(-1, Math.min(1, Math.round((v + (attn[i] ?? 0)) * 100) / 100)));
  return [
    { label: labels[0], values: x },
    { label: labels[1], values: attn },
    { label: labels[2], values: sum, highlight: true },
  ];
}

function silu(v: number): number {
  return v / (1 + Math.exp(-v * 3));
}

function swigluRows(labels: [string, string, string, string, string]): HeatRow[] {
  const input = fakeVector(901, 8);
  const gateRaw = fakeVector(902, 16);
  const gate = gateRaw.map((v) => Math.round(silu(v) * 100) / 100);
  const value = fakeVector(903, 16);
  const product = gate.map((g, i) => Math.round(g * (value[i] ?? 0) * 100) / 100);
  const output = fakeVector(904, 8);
  return [
    { label: labels[0], values: input },
    { label: labels[1], values: gate },
    { label: labels[2], values: value },
    { label: labels[3], values: product },
    { label: labels[4], values: output, highlight: true },
  ];
}

const LOGITS = {
  zh: [
    { label: "玉山", value: 12.3, highlight: true },
    { label: "阿里山", value: 8.9 },
    { label: "雪山", value: 8.1 },
    { label: "台北", value: 4.0 },
    { label: "富士山", value: 2.2 },
  ],
  en: [
    { label: "Yushan", value: 12.6, highlight: true },
    { label: "Jade", value: 9.4 },
    { label: "Alishan", value: 8.7 },
    { label: "Taipei", value: 3.9 },
    { label: "Mount", value: 3.1 },
  ],
};

const PROBS = {
  zh: [
    { label: "玉山", value: 0.78, highlight: true },
    { label: "阿里山", value: 0.06 },
    { label: "雪山", value: 0.03 },
    { label: "台北", value: 0.01 },
    { label: "其他 (128k)", value: 0.12, muted: true },
  ],
  en: [
    { label: "Yushan", value: 0.79, highlight: true },
    { label: "Jade", value: 0.07 },
    { label: "Alishan", value: 0.04 },
    { label: "Taipei", value: 0.01 },
    { label: "other (128k)", value: 0.09, muted: true },
  ],
};

function generatedChips(locale: Loc): TokenChip[] {
  const p = PROMPT[locale];
  return [
    ...p.tokens.map((text) => ({ text, state: "muted" as const })),
    { text: p.next, state: "new" as const, sub: locale === "zh" ? "剛抽樣到" : "just sampled" },
    ...p.rest.map((text) => ({ text, state: "future" as const })),
  ];
}

export const llama3Examples: ExampleMap = {
  "l-emb": {
    story: {
      zh: "分詞器把「台灣最高的山是」切成 5 個 token（切法是示意，實際依 128K 詞彙表而定），每個 token 查出一個 4,096 維向量。這裡沒有加位置編碼——5 個向量目前只代表「是哪個詞」，位置要等 RoPE 在注意力裡補上。",
      en: "The tokenizer splits \"The highest mountain in Taiwan is\" into 6 tokens (the split is illustrative; the real one depends on the 128K vocabulary), and each token is looked up as a 4,096-dimensional vector. No positional code is added here: for now the 6 vectors only say which word each is; position arrives later, inside attention, via RoPE.",
    },
    viz: {
      zh: { type: "tokens", tokens: promptChips("zh", { ids: true, strip: true }), caption: "5 個 token、各 4,096 維（畫前 8 維）；編號為示意" },
      en: { type: "tokens", tokens: promptChips("en", { ids: true, strip: true }), caption: "6 tokens × 4,096 dims (first 8 shown); ids are illustrative" },
    },
  },
  "l-norm1": {
    story: {
      zh: "進入第 1 層前，每個 token 的 4,096 個數字先除以自己的均方根、再乘上學到的比例。下面是「是」的前 8 維：正規化前後形狀一樣、只是尺度變一致，所以不同 token 進入注意力時不會有人「音量太大」。",
      en: "Before layer 1, each token's 4,096 numbers are divided by their own root-mean-square and multiplied by a learned scale. Below are the first 8 dims of is: the shape is unchanged, only the scale is made consistent, so no token enters attention \"too loud\".",
    },
    viz: {
      zh: { type: "heat", rows: normRows(["「是」正規化前", "RMSNorm 後"]), caption: "同一色階；除以均方根後數值落在相近範圍" },
      en: { type: "heat", rows: normRows(["is, before", "after RMSNorm"]), caption: "Same colour scale; after dividing by the RMS the values share a range" },
    },
  },
  "l-rope": {
    story: {
      zh: "在注意力裡，「是」（位置 4）的查詢和每個鍵向量兩兩一組被旋轉：位置 0 轉 0°、位置 1 轉 θ、位置 4 轉 4θ（每一組維度的 θ 不同，這裡示意為 32°）。之後 Q·K 只剩相對角度，也就是相對距離——「是」離「山」1 格、離「台灣」4 格。",
      en: "Inside attention, the query of is (position 5) and every key are rotated pair by pair: position 0 by 0°, position 1 by θ, position 5 by 5θ (θ differs per pair of dims; 32° here for illustration). Q·K then depends only on the relative angle, that is, relative distance: is comes 3 tokens after mountain and 1 after Taiwan.",
    },
    viz: {
      zh: { type: "dial", positions: [0, 1, 2, 3, 4], labels: [...PROMPT.zh.tokens], caption: "同一對維度在不同位置被旋轉的角度" },
      en: { type: "dial", positions: [0, 1, 2, 3, 4, 5], labels: [...PROMPT.en.tokens], caption: "The angle one pair of dims is rotated by at each position" },
    },
  },
  "l-gqa": {
    story: {
      zh: "32 個查詢頭分成 8 組，每組 4 個頭共用一組 K、V。以其中一個頭為例，「是」把注意力放在「山」（0.45）和「台灣」（0.30）——它得知道「哪裡的什麼」才能接下去。因果遮罩讓每個 token 只能看到自己和前面（右上角空白）。",
      en: "The 32 query heads form 8 groups; the 4 heads in a group share one set of K and V. In one head, is attends to mountain (0.40) and Taiwan (0.30): it must know \"what, where\" to continue. The causal mask lets each token see only itself and earlier tokens (the blank upper-right).",
    },
    viz: { zh: gqaViz("zh"), en: gqaViz("en") },
  },
  "l-kvcache": {
    story: {
      zh: "這一層算好的 K、V 存進快取：5 個 token × 8 個 KV 頭。等模型選出「玉山」、再跑一輪預測「，」時，這 5 個 token 的 K、V 直接從快取讀，只需替「玉山」算一次新的。每 token 每層 4 KB，32 層共 128 KB；若上下文填滿 128K 個 token，光快取就要 16 GB。",
      en: "The K and V computed in this layer go into the cache: 6 tokens × 8 KV heads. Once the model has picked Yushan and runs again to predict \",\", those 6 tokens' K and V are read from the cache and only Yushan's are computed. Each token costs 4 KB per layer, 128 KB over 32 layers; a full 128K-token context needs 16 GB of cache alone.",
    },
    viz: { zh: kvViz("zh"), en: kvViz("en") },
  },
  "l-res1": {
    story: {
      zh: "注意力的輸出加回主幹：「是」的新向量 = 原向量 + 注意力帶回的「台灣、山」資訊。主幹只被加了一點修正，原本的內容都還在，這就是殘差連接的意義。",
      en: "The attention output is added onto the trunk: the new vector for is = the old vector + the \"Taiwan, mountain\" information attention brought back. The trunk receives only a small correction and keeps everything it had; that is the point of a residual connection.",
    },
    viz: {
      zh: { type: "heat", rows: residualRows(["主幹 x（是）", "注意力輸出", "x + 輸出"]), caption: "前 8 維示意" },
      en: { type: "heat", rows: residualRows(["trunk x (is)", "attention out", "x + out"]), caption: "First 8 dims, illustrative" },
    },
  },
  "l-swiglu": {
    story: {
      zh: "SwiGLU 對「是」這個位置做知識查閱：4,096 維走兩條路放大到 14,336——一條過 SiLU 當閘門、另一條當值，逐元素相乘後再壓回 4,096。可以把它想成：從「台灣＋最高＋山」提取出「玉山」的記憶，寫進向量。這件事 32 層各做一次。",
      en: "SwiGLU performs the knowledge lookup for the position is: the 4,096 dims are expanded along two paths to 14,336, one through SiLU acting as a gate, the other as values, multiplied element-wise and projected back to 4,096. Think of it as retrieving the memory \"Taiwan + highest + mountain → Yushan\" and writing it into the vector. Each of the 32 layers does this once.",
    },
    viz: {
      zh: { type: "heat", rows: swigluRows(["輸入 4,096（前 8）", "閘門路 SiLU（前 16）", "值路（前 16）", "相乘", "輸出 4,096（前 8）"]), caption: "閘門接近 0 的位置會把值「關掉」" },
      en: { type: "heat", rows: swigluRows(["input 4,096 (first 8)", "gate path, SiLU (first 16)", "value path (first 16)", "product", "output 4,096 (first 8)"]), caption: "Where the gate is near 0 the value is switched off" },
    },
  },
  "l-final-norm": {
    story: {
      zh: "32 層跑完之後，「是」位置的主幹向量再做一次 RMSNorm，整理好尺度，準備交給輸出頭。",
      en: "After all 32 layers the trunk vector at position is gets one more RMSNorm to tidy its scale before the output head.",
    },
    viz: {
      zh: { type: "heat", rows: normRows(["第 32 層輸出", "最終 RMSNorm 後"]) },
      en: { type: "heat", rows: normRows(["layer-32 output", "after final RMSNorm"]) },
    },
  },
  "l-head": {
    story: {
      zh: "4,096 維乘上 128,256 個 token 的輸出矩陣，得到每個候選的分數：玉山 12.3、阿里山 8.9、雪山 8.1、台北 4.0……分數最高的正是正確答案。",
      en: "The 4,096 dims are multiplied by the 128,256-token output matrix to score every candidate: Yushan 12.6, Jade 9.4, Alishan 8.7, Taipei 3.9… The highest score is the right answer.",
    },
    viz: {
      zh: { type: "bars", items: LOGITS.zh, caption: "128,256 個候選中的前 5 名（logits）" },
      en: { type: "bars", items: LOGITS.en, caption: "Top 5 of 128,256 candidates (logits)" },
    },
  },
  "l-sample": {
    story: {
      zh: "softmax 變成機率：玉山 0.78、阿里山 0.06、雪山 0.03……在溫度 0.7 下抽樣，選到「玉山」。它被接到序列末端，模型再跑一輪——靠 KV 快取只需算這 1 個新 token——接著產生「，」「海拔」「3,952」「公尺」「。」。",
      en: "softmax turns them into probabilities: Yushan 0.79, Jade 0.07, Alishan 0.04… Sampling at temperature 0.7 picks Yushan. It is appended to the sequence and the model runs again, computing only this one new token thanks to the KV cache, then produces \",\" \"at\" \"3,952\" \"metres\" \".\".",
    },
    viz: {
      zh: { type: "stack", items: [{ type: "bars", items: PROBS.zh, max: 1, caption: "機率加總為 1；溫度 0.7 抽樣" }, { type: "tokens", tokens: generatedChips("zh"), caption: "接回序列，逐字生成" }] },
      en: { type: "stack", items: [{ type: "bars", items: PROBS.en, max: 1, caption: "Probabilities sum to 1; sampled at temperature 0.7" }, { type: "tokens", tokens: generatedChips("en"), caption: "Appended and generated token by token" }] },
    },
  },
};
