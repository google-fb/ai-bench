import { cloneBlock, type Block, type ModelSpec } from "./types.ts";

const tokenEmbedding: Block = {
  id: "l-emb",
  kind: "embedding",
  label: { zh: "Token 嵌入（128K 詞彙）", en: "Token Embedding (128K vocab)" },
  short: { zh: "Token 嵌入", en: "Token embedding" },
  brief: {
    zh: "先用 tiktoken 式分詞器切成 token，再查表換成 4,096 維向量",
    en: "A tiktoken-style tokenizer splits text into tokens, then a table maps each to a 4,096-dim vector",
  },
  detail: {
    zh: "Llama 3 的詞彙表有 128,256 個 token，比 Llama 2 的 32,000 大了四倍，讓同一段文字可以用更少的 token 表示，對中文等非英語文字特別有幫助。每個 token 查表換成一個 4,096 維（8B 版）的向量。注意這裡沒有再加位置編碼——位置資訊改由每一層注意力裡的 RoPE 提供。",
    en: "Llama 3’s vocabulary has 128,256 tokens, four times Llama 2’s 32,000, so the same text needs fewer tokens, which helps non-English scripts in particular. Each token is looked up as a 4,096-dimensional vector (in the 8B model). Notice that no positional code is added here: position information is supplied by RoPE inside every attention layer instead.",
  },
  facts: [
    { label: { zh: "詞彙表", en: "Vocabulary" }, value: "128,256" },
    { label: { zh: "維度", en: "Dimension" }, value: { zh: "4,096 / 8,192 / 16,384", en: "4,096 / 8,192 / 16,384" } },
  ],
  deco: { count: 8 },
};

const rmsNorm: Block = {
  id: "l-norm1",
  kind: "norm",
  label: { zh: "RMSNorm（前置正規化）", en: "RMSNorm (pre-norm)" },
  short: { zh: "RMSNorm", en: "RMSNorm" },
  brief: {
    zh: "進入子層之前先正規化，只除以均方根，不減平均值",
    en: "Normalise before the sublayer, dividing by the root-mean-square only",
  },
  detail: {
    zh: "RMSNorm 是 LayerNorm 的簡化版：不再減去平均值，只把向量除以它的均方根，再乘上一組可學習的比例。運算更少、效果相當。Llama 把它放在每個子層的「前面」（Pre-Norm），主幹殘差流不被正規化打斷，訓練幾十層甚至上百層都很穩定。",
    en: "RMSNorm is a simplified LayerNorm: it no longer subtracts the mean, it just divides the vector by its root-mean-square and multiplies by a learned scale. Less computation, same benefit. Llama places it before each sublayer (pre-norm), so the main residual stream is never interrupted, which keeps training stable even at a hundred layers.",
  },
  height: 0.4,
};

const rope: Block = {
  id: "l-rope",
  kind: "position",
  label: { zh: "RoPE 旋轉位置編碼（作用在 Q、K）", en: "RoPE rotary positions (applied to Q, K)" },
  short: { zh: "RoPE", en: "RoPE" },
  brief: {
    zh: "把位置變成旋轉角度，讓注意力分數只取決於兩個詞的相對距離",
    en: "Encodes position as a rotation angle, so attention scores depend only on relative distance",
  },
  detail: {
    zh: "RoPE 不把位置加進向量，而是把查詢與鍵向量兩兩一組當成平面上的點，依照位置旋轉一個角度。兩個向量做內積時，旋轉角會相減，結果只跟「相對距離」有關。這讓模型自然懂得「前面第三個詞」這種關係，也比較容易把上下文從 8K 延長到 128K——Llama 3.1 就是把旋轉的基頻調到 500,000 來做到的。",
    en: "RoPE does not add position to the vector; it treats pairs of query and key dimensions as points on a plane and rotates them by an angle proportional to the position. When two vectors are dotted, the angles subtract, so the result depends only on relative distance. The model naturally understands relations like “three tokens back”, and context is easier to stretch from 8K to 128K, which Llama 3.1 did by raising the rotation base to 500,000.",
  },
  facts: [{ label: { zh: "基頻 θ", en: "Base θ" }, value: "500,000" }],
  height: 0.5,
};

const gqa: Block = {
  id: "l-gqa",
  kind: "attention",
  label: { zh: "分組查詢注意力 GQA", en: "Grouped-Query Attention (GQA)" },
  short: { zh: "GQA 注意力", en: "GQA attention" },
  brief: {
    zh: "32 個查詢頭共用 8 組鍵值頭，KV 快取縮小 4 倍",
    en: "32 query heads share 8 key-value heads, shrinking the KV cache 4×",
  },
  detail: {
    zh: "多頭注意力裡最耗記憶體的是推理時要保存的鍵與值。GQA 讓多個查詢頭共用同一組鍵值頭：8B 版有 32 個查詢頭、但只有 8 個 KV 頭，每 4 個查詢頭一組。KV 快取因此只剩四分之一，品質卻幾乎不變。這一層仍然是因果遮罩的自注意力，跟 2017 年解碼器裡的遮罩注意力是同一個原理。",
    en: "The most memory-hungry part of multi-head attention is the keys and values that must be kept during inference. GQA lets several query heads share one key-value head: the 8B model has 32 query heads but only 8 KV heads, one per group of four. The KV cache shrinks to a quarter with almost no loss in quality. This is still causally-masked self-attention, the same principle as the masked attention in the 2017 decoder.",
  },
  facts: [
    { label: { zh: "查詢頭", en: "Query heads" }, value: "32 / 64 / 128" },
    { label: { zh: "KV 頭", en: "KV heads" }, value: "8" },
  ],
  height: 1.25,
  deco: { count: 32, groups: 8 },
};

const residual: Block = {
  id: "l-res1",
  kind: "residual",
  label: { zh: "⊕ 殘差相加", en: "⊕ Residual add" },
  short: { zh: "⊕ 殘差", en: "⊕ residual" },
  brief: { zh: "把子層的輸出加回主幹", en: "Adds the sublayer output back onto the trunk" },
  detail: {
    zh: "主幹上的向量像一條河，每個子層只往河裡加一點新的資訊，而不是取代它。這條殘差流貫穿全部 32 層，也是後來 DeepSeek 用 mHC 改造的對象。",
    en: "The trunk vector is like a river: each sublayer only adds a little new information rather than replacing it. This residual stream runs through all 32 layers, and it is exactly what DeepSeek later reworked with mHC.",
  },
  height: 0.3,
};

const swiglu: Block = {
  id: "l-swiglu",
  kind: "ffn",
  label: { zh: "SwiGLU 前饋網路", en: "SwiGLU Feed-Forward" },
  short: { zh: "SwiGLU 前饋", en: "SwiGLU FFN" },
  brief: {
    zh: "一路過 SiLU 當閘門，乘上另一路，再投影回來：4,096 → 14,336 → 4,096",
    en: "One path through SiLU acts as a gate, multiplies the other, then projects back: 4,096 → 14,336 → 4,096",
  },
  detail: {
    zh: "Llama 把 ReLU 前饋換成 SwiGLU。輸入同時經過兩個放大矩陣：一條過 SiLU 啟動函數當作「閘門」，逐元素乘上另一條，最後再用第三個矩陣壓回原維度。閘門讓網路能選擇性地放行資訊，同樣參數量下效果更好。8B 版的中間維度是 14,336。今天幾乎所有開源模型的前饋層都是這個設計。",
    en: "Llama swaps the ReLU feed-forward for SwiGLU. The input goes through two expansion matrices at once: one path passes through the SiLU activation and acts as a gate that multiplies the other element-wise, and a third matrix projects back to the original size. The gate lets the network pass information selectively, giving better quality for the same parameter count. The 8B model’s hidden size is 14,336. Nearly every open model’s feed-forward layer now uses this design.",
  },
  facts: [{ label: { zh: "隱藏維度", en: "Hidden size" }, value: "14,336 / 28,672 / 53,248" }],
  height: 1.1,
  deco: { count: 24 },
};

const finalNorm: Block = {
  id: "l-final-norm",
  kind: "norm",
  label: { zh: "最終 RMSNorm", en: "Final RMSNorm" },
  brief: { zh: "離開最後一層後再正規化一次", en: "One more normalisation after the last layer" },
  detail: {
    zh: "所有層跑完之後，主幹向量再做一次 RMSNorm，才交給輸出層。這是 Pre-Norm 架構的必要收尾：因為中途沒有任何正規化直接作用在主幹上，最後要把數值範圍整理好。",
    en: "After all layers, the trunk vector is normalised once more before the output layer. This is the necessary closing step of a pre-norm architecture: since nothing normalised the trunk directly along the way, its scale is tidied up at the end.",
  },
  height: 0.4,
};

const lmHead: Block = {
  id: "l-head",
  kind: "output",
  label: { zh: "LM Head（線性層）", en: "LM Head (linear)" },
  short: { zh: "LM Head", en: "LM Head" },
  brief: { zh: "把 4,096 維投影成 128,256 個分數", en: "Projects 4,096 dims to 128,256 scores" },
  detail: {
    zh: "輸出頭是一個 4,096 × 128,256 的矩陣，算出每個候選 token 的分數。Llama 3 不與嵌入表共用權重，8B 版光這兩張表就佔了約 10 億參數。",
    en: "The output head is a 4,096 × 128,256 matrix that scores every candidate token. Llama 3 does not tie it to the embedding table; in the 8B model these two tables alone hold about a billion parameters.",
  },
  height: 0.6,
};

const sample: Block = {
  id: "l-sample",
  kind: "output",
  label: { zh: "Softmax → 取樣下一個 token", en: "Softmax → sample next token" },
  short: { zh: "Softmax · 取樣", en: "Softmax · sample" },
  brief: {
    zh: "把分數變成機率，依溫度取樣，再把新 token 接回底部",
    en: "Scores become probabilities, a token is sampled with a temperature, and fed back to the bottom",
  },
  detail: {
    zh: "分數經 softmax 變成機率分佈。生成時可以用溫度、top-p 等方式抽樣出下一個 token，接回輸入序列，再跑一次整個堆疊。因為前面的鍵值都存在 KV 快取裡，每次只需要為新的一個 token 計算。",
    en: "Softmax turns the scores into a probability distribution. At generation time the next token is sampled with a temperature or top-p rule, appended to the input, and the whole stack runs again. Because earlier keys and values are stored in the KV cache, only the single new token needs computing.",
  },
  height: 0.8,
  deco: { count: 10 },
};

const kvCache: Block = {
  id: "l-kvcache",
  kind: "memory",
  label: { zh: "KV 快取", en: "KV Cache" },
  brief: {
    zh: "推理時保存每層每個 token 的鍵與值，避免重算",
    en: "Stores every layer’s keys and values for each token during inference so they are not recomputed",
  },
  detail: {
    zh: "生成第 100 個 token 時，前 99 個 token 的鍵和值其實不會改變，所以把它們存起來。8B 版每個 token 每層要存 8 個 KV 頭 × 128 維 × 2（K 和 V），32 層加起來約 128 KB（bf16）。上下文越長、快取越大，這正是 DeepSeek 一連串壓縮技術要解決的問題。",
    en: "When generating token 100, the keys and values of the first 99 tokens do not change, so they are cached. In the 8B model each token stores 8 KV heads × 128 dims × 2 (K and V) per layer, about 128 KB across 32 layers in bf16. The longer the context, the larger the cache, and this is precisely the problem DeepSeek’s series of compression techniques set out to solve.",
  },
  facts: [{ label: { zh: "每 token（8B，bf16）", en: "Per token (8B, bf16)" }, value: "≈ 128 KB" }],
  height: 1.2,
  deco: { count: 32 },
};

export const llama3: ModelSpec = {
  id: "llama3",
  name: { zh: "Llama 3", en: "Llama 3" },
  shortName: { zh: "Llama 3", en: "Llama 3" },
  year: 2024,
  org: { zh: "Meta AI", en: "Meta AI" },
  tagline: {
    zh: "純解碼器稠密模型的標準配方",
    en: "The standard recipe for dense decoder-only models",
  },
  intro: {
    zh: "Llama 3 是 Meta 在 2024 年開放權重的模型家族，有 8B、70B、405B 三種尺寸。它代表了今天「純解碼器」稠密模型的標準配方：拿掉編碼器，只留下一疊解碼器層；把 LayerNorm 換成前置的 RMSNorm、位置編碼換成旋轉式的 RoPE、ReLU 前饋換成 SwiGLU，注意力則用分組查詢（GQA）來縮小推理時的 KV 快取。Qwen、Mistral、Gemma 等開源模型幾乎都沿用同一套骨架。",
    en: "Llama 3 is Meta’s open-weight model family from 2024, in 8B, 70B and 405B sizes. It represents today’s standard recipe for dense decoder-only models: drop the encoder and keep a single stack of decoder layers; replace LayerNorm with pre-norm RMSNorm, sinusoidal positions with rotary RoPE, the ReLU feed-forward with SwiGLU, and shrink the inference KV cache with grouped-query attention (GQA). Qwen, Mistral, Gemma and most other open models follow nearly the same skeleton.",
  },
  facts: [
    { label: { zh: "類型", en: "Type" }, value: { zh: "純解碼器、稠密", en: "Decoder-only, dense" } },
    { label: { zh: "層數", en: "Layers" }, value: { zh: "32 / 80 / 126（8B / 70B / 405B）", en: "32 / 80 / 126 (8B / 70B / 405B)" } },
    { label: { zh: "模型維度", en: "Model dim" }, value: "4,096 / 8,192 / 16,384" },
    { label: { zh: "注意力頭", en: "Attention heads" }, value: { zh: "32 / 64 / 128 個查詢頭，皆 8 個 KV 頭", en: "32 / 64 / 128 query heads, 8 KV heads each" } },
    { label: { zh: "前饋隱藏維度", en: "FFN hidden size" }, value: "14,336 / 28,672 / 53,248" },
    { label: { zh: "詞彙表", en: "Vocabulary" }, value: { zh: "128,256 個 token", en: "128,256 tokens" } },
    { label: { zh: "上下文長度", en: "Context length" }, value: { zh: "8K（3.0）→ 128K（3.1）", en: "8K (3.0) → 128K (3.1)" } },
    { label: { zh: "訓練資料", en: "Training tokens" }, value: { zh: "超過 15 兆 token", en: "Over 15 trillion" } },
    { label: { zh: "授權", en: "License" }, value: { zh: "Llama 3 社群授權", en: "Llama 3 Community License" } },
  ],
  columns: [
    {
      id: "kv",
      title: { zh: "推理時的記憶", en: "Inference memory" },
      x: -3.6,
      z: 0.8,
      scale: 0.72,
      baseY: 1.7,
      labelSide: "left",
      blocks: [kvCache],
    },
    {
      id: "decoder",
      title: { zh: "解碼器堆疊", en: "Decoder stack" },
      x: 0.6,
      z: 0,
      labelSide: "right",
      main: true,
      blocks: [
        tokenEmbedding,
        rmsNorm,
        rope,
        gqa,
        residual,
        cloneBlock(rmsNorm, "l-norm2"),
        swiglu,
        cloneBlock(residual, "l-res2"),
        finalNorm,
        lmHead,
        sample,
      ],
      groups: [
        {
          id: "l-x32",
          from: "l-norm1",
          to: "l-res2",
          repeat: 32,
          label: { zh: "32 層（8B）· 80 層（70B）· 126 層（405B）", en: "32 layers (8B) · 80 (70B) · 126 (405B)" },
        },
      ],
    },
  ],
  links: [{ from: "l-gqa", to: "l-kvcache", style: "kv", label: { zh: "存入／讀取 K、V", en: "Store / read K, V" } }],
  tourOrder: ["l-emb", "l-norm1", "l-rope", "l-gqa", "l-kvcache", "l-res1", "l-swiglu", "l-final-norm", "l-head", "l-sample"],
  sources: [
    { label: "Meta, “The Llama 3 Herd of Models” (2024)", url: "https://arxiv.org/abs/2407.21783" },
    { label: "meta-llama/llama-models · GitHub", url: "https://github.com/meta-llama/llama-models" },
  ],
  accent: 0x8b9a5b,
};
