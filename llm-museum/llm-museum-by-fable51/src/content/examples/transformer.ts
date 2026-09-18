import { fakeVector, type ExampleMap, type HeatRow, type ModelExample, type TokenChip, type Viz } from "../types.ts";

/**
 * Running example for the Transformer hall: translating
 * "The cat sat on the mat." The Chinese interface translates into Chinese,
 * the English interface into German (the task of the original paper).
 * All numbers are illustrative.
 */

export const SOURCE = ["The", "cat", "sat", "on", "the", "mat", "."];

const TARGET = {
  zh: { done: ["<s>", "貓", "坐在"], next: "墊子", rest: ["上", "。"] },
  en: { done: ["<s>", "Die", "Katze", "saß", "auf", "der"], next: "Matte", rest: ["."] },
} as const;

export const transformerExample: ModelExample = {
  input: {
    zh: "英文句子 \"The cat sat on the mat.\"，任務：翻譯成中文",
    en: "The English sentence \"The cat sat on the mat.\"; task: translate it into German",
  },
  output: { zh: "貓坐在墊子上。", en: "Die Katze saß auf der Matte." },
  note: {
    zh: "下面每一層的向量數值、注意力權重與機率都是示意，用來說明每一步「長什麼樣子」，不是真實模型算出來的數字。",
    en: "The vector values, attention weights and probabilities shown at each layer are illustrative: they show the shape of each step, not a real model's numbers.",
  },
};

export const transformerFlowTokens = {
  encoder: { zh: SOURCE, en: SOURCE },
  decoder: { zh: [...TARGET.zh.done, TARGET.zh.next, ...TARGET.zh.rest], en: [...TARGET.en.done, TARGET.en.next, ...TARGET.en.rest] },
};

// --- shared numbers ---------------------------------------------------------

const embeddingOf = (token: string, index: number): number[] => {
  const seed = token.toLowerCase() === "the" ? 11 : 20 + index;
  return fakeVector(seed, 8);
};

const sourceChips = (opts: { withStrip?: boolean; positions?: boolean; sub?: (i: number) => string } = {}): TokenChip[] =>
  SOURCE.map((t, i) => ({
    text: t,
    sub: opts.sub ? opts.sub(i) : opts.positions ? `#${i}` : undefined,
    strip: opts.withStrip ? embeddingOf(t, i) : undefined,
    state: "source",
  }));

const positionalRows = (): HeatRow[] =>
  SOURCE.map((t, pos) => ({
    label: `${pos} · ${t}`,
    values: Array.from({ length: 8 }, (_, d) => {
      const i = Math.floor(d / 2);
      const freq = Math.pow(10000, -(2 * i) / 512);
      const angle = pos * freq;
      return Math.round((d % 2 === 0 ? Math.sin(angle) : Math.cos(angle)) * 100) / 100;
    }),
  }));

const ENCODER_ATTENTION: number[][] = [
  [0.35, 0.4, 0.05, 0.05, 0.05, 0.05, 0.05],
  [0.2, 0.3, 0.3, 0.05, 0.05, 0.05, 0.05],
  [0.05, 0.4, 0.15, 0.1, 0.03, 0.22, 0.05],
  [0.03, 0.1, 0.3, 0.15, 0.05, 0.32, 0.05],
  [0.05, 0.05, 0.05, 0.1, 0.3, 0.4, 0.05],
  [0.03, 0.15, 0.25, 0.2, 0.1, 0.22, 0.05],
  [0.1, 0.15, 0.2, 0.05, 0.05, 0.15, 0.3],
];

const encoderAttentionViz = (): Extract<Viz, { type: "heat" }> => ({
  type: "heat",
  cols: SOURCE,
  rows: SOURCE.map((t, i) => ({ label: t, values: ENCODER_ATTENTION[i] ?? [], highlight: t === "sat" })),
  showValues: true,
});

function addNormRows(labels: [string, string, string, string]): HeatRow[] {
  const x = embeddingOf("sat", 2);
  const attn = fakeVector(103, 8).map((v) => Math.round(v * 60) / 100);
  const sum = x.map((v, i) => Math.round((v + (attn[i] ?? 0)) * 100) / 100);
  const mean = sum.reduce((a, b) => a + b, 0) / sum.length;
  const variance = sum.reduce((a, b) => a + (b - mean) ** 2, 0) / sum.length;
  const std = Math.sqrt(variance) || 1;
  const normed = sum.map((v) => Math.round(((v - mean) / std) * 50) / 100);
  return [
    { label: labels[0], values: x },
    { label: labels[1], values: attn },
    { label: labels[2], values: sum },
    { label: labels[3], values: normed, highlight: true },
  ];
}

function ffnRows(labels: [string, string, string, string]): HeatRow[] {
  const input = fakeVector(301, 8);
  const expanded = fakeVector(302, 16);
  const relu = expanded.map((v) => (v > 0 ? v : null));
  const output = fakeVector(303, 8);
  return [
    { label: labels[0], values: input },
    { label: labels[1], values: expanded },
    { label: labels[2], values: relu },
    { label: labels[3], values: output, highlight: true },
  ];
}

const MASKED_ZH: (number | null)[][] = [
  [1, null, null],
  [0.35, 0.65, null],
  [0.15, 0.5, 0.35],
];
const MASKED_EN: (number | null)[][] = [
  [1, null, null, null, null, null],
  [0.4, 0.6, null, null, null, null],
  [0.1, 0.45, 0.45, null, null, null],
  [0.05, 0.1, 0.55, 0.3, null, null],
  [0.05, 0.05, 0.25, 0.45, 0.2, null],
  [0.03, 0.07, 0.15, 0.25, 0.3, 0.2],
];
const CROSS_ZH: number[][] = [
  [0.4, 0.25, 0.1, 0.05, 0.05, 0.1, 0.05],
  [0.1, 0.6, 0.1, 0.05, 0.05, 0.05, 0.05],
  [0.02, 0.05, 0.1, 0.25, 0.05, 0.5, 0.03],
];
const CROSS_EN: number[][] = [
  [0.4, 0.25, 0.1, 0.05, 0.05, 0.1, 0.05],
  [0.55, 0.25, 0.05, 0.05, 0.03, 0.05, 0.02],
  [0.08, 0.65, 0.12, 0.05, 0.03, 0.05, 0.02],
  [0.03, 0.15, 0.6, 0.1, 0.02, 0.08, 0.02],
  [0.02, 0.05, 0.15, 0.55, 0.05, 0.15, 0.03],
  [0.02, 0.05, 0.08, 0.2, 0.3, 0.32, 0.03],
];

function targetChips(locale: "zh" | "en", withStrip: boolean): TokenChip[] {
  const t = TARGET[locale];
  const chips: TokenChip[] = t.done.map((text, i) => ({
    text,
    sub: `#${i}`,
    strip: withStrip ? fakeVector(400 + i, 8) : undefined,
    state: i === t.done.length - 1 ? "current" : "done",
  }));
  chips.push({ text: "?", sub: locale === "zh" ? "下一個" : "next", state: "future" });
  return chips;
}

function maskedViz(locale: "zh" | "en"): Viz {
  const t = TARGET[locale];
  const m = locale === "zh" ? MASKED_ZH : MASKED_EN;
  return {
    type: "heat",
    cols: [...t.done],
    rows: t.done.map((tok, i) => ({ label: tok, values: m[i] ?? [], highlight: i === t.done.length - 1 })),
    showValues: true,
  };
}

function crossViz(locale: "zh" | "en"): Viz {
  const t = TARGET[locale];
  const m = locale === "zh" ? CROSS_ZH : CROSS_EN;
  return {
    type: "heat",
    cols: SOURCE,
    colsLabel: locale === "zh" ? "解碼器 ↓ · 編碼器 →" : "decoder ↓ · encoder →",
    rows: t.done.map((tok, i) => ({ label: tok, values: m[i] ?? [], highlight: i === t.done.length - 1 })),
    showValues: true,
  };
}

const LOGITS = {
  zh: [
    { label: "墊子", value: 7.9, highlight: true },
    { label: "墊", value: 6.1 },
    { label: "地上", value: 5.4 },
    { label: "桌子", value: 3.2 },
    { label: "貓", value: 1.1 },
  ],
  en: [
    { label: "Matte", value: 8.2, highlight: true },
    { label: "Decke", value: 6.0 },
    { label: "Matratze", value: 5.3 },
    { label: "Tisch", value: 3.1 },
    { label: "Katze", value: 0.9 },
  ],
};

const PROBS = {
  zh: [
    { label: "墊子", value: 0.71, highlight: true },
    { label: "墊", value: 0.12 },
    { label: "地上", value: 0.06 },
    { label: "桌子", value: 0.01 },
    { label: "其他 (37k)", value: 0.1, muted: true },
  ],
  en: [
    { label: "Matte", value: 0.74, highlight: true },
    { label: "Decke", value: 0.08 },
    { label: "Matratze", value: 0.04 },
    { label: "Tisch", value: 0.01 },
    { label: "other (37k)", value: 0.13, muted: true },
  ],
};

function generatedChips(locale: "zh" | "en"): TokenChip[] {
  const t = TARGET[locale];
  return [
    ...t.done.slice(1).map((text) => ({ text, state: "done" as const })),
    { text: t.next, state: "new" as const, sub: locale === "zh" ? "剛選出" : "just chosen" },
    ...t.rest.map((text) => ({ text, state: "future" as const })),
    { text: "</s>", state: "future" as const, sub: locale === "zh" ? "結束" : "end" },
  ];
}

// --- per-module stories -----------------------------------------------------

export const transformerExamples: ExampleMap = {
  "t-in-emb": {
    story: {
      zh: "句子先被切成 7 個 token：The、cat、sat、on、the、mat、句點。每個 token 查表換成一個 512 維向量，這裡只畫出前 8 維。注意第 0 個 The 和第 4 個 the 拿到的向量幾乎一樣：嵌入表只知道「這是哪個詞」，還不知道它在哪個位置。",
      en: "The sentence is first split into 7 tokens: The, cat, sat, on, the, mat and the full stop. Each token is looked up as a 512-dimensional vector; only the first 8 dimensions are drawn. Notice that token 0, The, and token 4, the, get almost the same vector: the embedding table only knows which word this is, not where it sits.",
    },
    viz: {
      zh: { type: "tokens", tokens: sourceChips({ withStrip: true, positions: true }), caption: "7 個 token × 512 維（畫出前 8 維，暖色為正、冷色為負）" },
      en: { type: "tokens", tokens: sourceChips({ withStrip: true, positions: true }), caption: "7 tokens × 512 dims (first 8 shown; warm = positive, cool = negative)" },
    },
  },
  "t-in-pos": {
    story: {
      zh: "每個位置各加上一組固定的正弦、餘弦值：位置 0 加第 0 組、位置 1 加第 1 組……。加完之後，兩個 the 的向量終於不同了，模型從此分得出「第 0 個字」和「第 4 個字」。",
      en: "Each position adds its own fixed set of sine and cosine values: position 0 adds set 0, position 1 adds set 1, and so on. After the addition the two the vectors finally differ, so the model can tell token 0 from token 4.",
    },
    viz: {
      zh: { type: "heat", rows: positionalRows(), cols: ["d0", "d1", "d2", "d3", "d4", "d5", "d6", "d7"], colsLabel: "位置 · token", caption: "每個位置加上的正弦波值（前 8 維）" },
      en: { type: "heat", rows: positionalRows(), cols: ["d0", "d1", "d2", "d3", "d4", "d5", "d6", "d7"], colsLabel: "position · token", caption: "Sinusoidal values added at each position (first 8 dims)" },
    },
  },
  "t-enc-attn": {
    story: {
      zh: "每個 token 都看向全句。以 sat 這一行為例：它的查詢（Q）和 7 個鍵（K）做內積、過 softmax 後，把最多注意力給了 cat（0.40，誰在坐）和 mat（0.22，坐在哪），自己只拿 0.15。8 個頭各有各的分布，這裡畫的是其中一個頭。",
      en: "Every token looks at the whole sentence. Take the row for sat: its query (Q) is dotted with all 7 keys (K) and passed through softmax, and it gives most attention to cat (0.40, who is sitting) and mat (0.22, where), keeping only 0.15 for itself. Each of the 8 heads has its own pattern; this is one head.",
    },
    viz: {
      zh: { ...encoderAttentionViz(), caption: "一個頭的注意力權重；每一行加總為 1，列 = 被看的 token" },
      en: { ...encoderAttentionViz(), caption: "One head's attention weights; each row sums to 1, columns = tokens being looked at" },
    },
  },
  "t-enc-an1": {
    story: {
      zh: "注意力算出的「修正量」被加回 sat 原本的向量：現在它混進了 cat 和 mat 的資訊。接著 LayerNorm 把這個位置的 512 個數字調成平均 0、變異 1。下面四行是 sat 的前 8 維：輸入、注意力輸出、相加、正規化後。",
      en: "The correction computed by attention is added back to sat's original vector, which now carries information from cat and mat. LayerNorm then rescales this position's 512 numbers to mean 0 and variance 1. The four rows show sat's first 8 dims: input, attention output, their sum, and after normalisation.",
    },
    viz: {
      zh: { type: "heat", rows: addNormRows(["sat 輸入 x", "注意力輸出", "x + 輸出", "LayerNorm 後"]), caption: "同一色階：正規化後數值分布變得整齊" },
      en: { type: "heat", rows: addNormRows(["sat input x", "attention out", "x + out", "after LayerNorm"]), caption: "Same colour scale: after normalisation the spread is tidy" },
    },
  },
  "t-enc-ffn": {
    story: {
      zh: "前饋層一次只處理一個位置。sat 的 512 維先放大到 2,048 維、ReLU 把負值歸零（示意圖裡留白的格子），再壓回 512 維。這一步常被理解成「查閱知識」：把「坐」這個動作常見的搭配寫進向量。同一組權重對 7 個位置各做一次。",
      en: "The feed-forward layer processes one position at a time. sat's 512 dims are expanded to 2,048, ReLU zeroes the negative ones (the blank cells), and a second matrix projects back to 512. Think of it as a knowledge lookup that writes the usual companions of \"sitting\" into the vector. The same weights run once per position.",
    },
    viz: {
      zh: { type: "heat", rows: ffnRows(["輸入 512 維（前 8）", "放大 2,048 維（前 16）", "ReLU 後", "壓回 512 維（前 8）"]), caption: "空白格 = 被 ReLU 歸零的負值" },
      en: { type: "heat", rows: ffnRows(["input, 512 dims (first 8)", "expanded, 2,048 (first 16)", "after ReLU", "back to 512 (first 8)"]), caption: "Blank cells = negatives zeroed by ReLU" },
    },
  },
  "t-enc-out": {
    story: {
      zh: "六層之後，7 個 token 都變成帶著整句脈絡的向量：mat 的向量已經「知道」自己是 sat on 的地點。這 7 個向量會被複製給解碼器每一層當作 K 和 V，直到整句翻完都不會再改變。",
      en: "After six layers all 7 tokens have become context-rich vectors: mat's vector already \"knows\" it is the place of sat on. These 7 vectors are handed to every decoder layer as K and V and stay fixed until the whole sentence is translated.",
    },
    viz: {
      zh: { type: "tokens", tokens: sourceChips({ withStrip: true, sub: () => "K · V" }), caption: "7 個帶脈絡的向量，供解碼器查詢" },
      en: { type: "tokens", tokens: sourceChips({ withStrip: true, sub: () => "K · V" }), caption: "7 context-rich vectors for the decoder to query" },
    },
  },
  "t-out-emb": {
    story: {
      zh: "解碼器已經產生「貓」「坐在」。它的輸入是右移一格的序列：<s>（開始符號）、貓、坐在，共 3 個位置，任務是預測位置 2 後面該接什麼。這些 token 同樣查表、加上位置編碼。",
      en: "The decoder has produced \"Die Katze saß auf der\" so far. Its input is the sequence shifted right by one: <s> (start symbol) followed by those five words, six positions in all, and the task is to predict what follows position 5. They are embedded and given positional codes just like the source.",
    },
    viz: {
      zh: { type: "tokens", tokens: targetChips("zh", true), caption: "目標序列右移一格；「?」是要預測的下一個位置" },
      en: { type: "tokens", tokens: targetChips("en", true), caption: "Target sequence shifted right; \"?\" is the position to predict" },
    },
  },
  "t-dec-mattn": {
    story: {
      zh: "遮罩自注意力：位置 2 的「坐在」可以看 <s>、貓 和自己，但看不到還沒產生的未來。右上角的空白三角形就是遮罩——那些位置的分數被設成負無限大，softmax 後權重為 0。",
      en: "Masked self-attention: position 5, der, may look at <s>, Die, Katze, saß, auf and itself, but not at the future that has not been generated. The blank upper triangle is the mask: those scores are set to minus infinity, so their weights become 0 after softmax.",
    },
    viz: { zh: maskedViz("zh"), en: maskedViz("en") },
  },
  "t-dec-xattn": {
    story: {
      zh: "交叉注意力：「坐在」這個位置的查詢去問編碼器的 7 個向量，把注意力集中在 mat（0.50）和 on（0.25）——因為下一個該翻出來的正是「墊子」。這就是翻譯時的「對齊」，每產生一個字都會重新對齊一次。",
      en: "Cross-attention: the query at der asks the encoder's 7 vectors and concentrates on mat (0.32) and the (0.30), because the next word to produce is Matte. This is alignment in translation, redone for every generated word.",
    },
    viz: { zh: crossViz("zh"), en: crossViz("en") },
  },
  "t-linear": {
    story: {
      zh: "最頂層「坐在」位置的 512 維向量乘上詞彙表矩陣，得到每個候選 token 的分數（logits）：墊子 7.9、墊 6.1、地上 5.4、桌子 3.2……這些還只是分數，不是機率。",
      en: "The 512-dim vector at the top of position der is multiplied by the vocabulary matrix, giving a score (logit) for every candidate: Matte 8.2, Decke 6.0, Matratze 5.3, Tisch 3.1… These are still scores, not probabilities.",
    },
    viz: {
      zh: { type: "bars", items: LOGITS.zh, caption: "詞彙表 37,000 個 token 的分數，只列前 5 名" },
      en: { type: "bars", items: LOGITS.en, caption: "Scores for the 37,000-token vocabulary; top 5 shown" },
    },
  },
  "t-softmax": {
    story: {
      zh: "softmax 把分數變成機率：墊子 0.71、墊 0.12、地上 0.06……模型選出「墊子」，接回解碼器輸入的末端，下一輪再預測「上」，然後「。」，最後產生結束符號 </s>，翻譯完成：「貓坐在墊子上。」",
      en: "softmax turns the scores into probabilities: Matte 0.74, Decke 0.08, Matratze 0.04… The model picks Matte, appends it to the decoder input, predicts \".\" on the next round and finally the end symbol </s>. Translation done: \"Die Katze saß auf der Matte.\"",
    },
    viz: {
      zh: { type: "stack", items: [{ type: "bars", items: PROBS.zh, max: 1, caption: "機率加總為 1" }, { type: "tokens", tokens: generatedChips("zh"), caption: "逐字生成，直到 </s>" }] },
      en: { type: "stack", items: [{ type: "bars", items: PROBS.en, max: 1, caption: "Probabilities sum to 1" }, { type: "tokens", tokens: generatedChips("en"), caption: "Generated word by word until </s>" }] },
    },
  },
};
