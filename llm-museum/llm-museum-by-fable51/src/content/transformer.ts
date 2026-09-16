import { cloneBlock, type Block, type ModelSpec } from "./types.ts";

const inputEmbedding: Block = {
  id: "t-in-emb",
  kind: "embedding",
  label: { zh: "輸入嵌入", en: "Input Embedding" },
  brief: {
    zh: "把每個詞（token）換成一個 512 維的向量",
    en: "Turns each token into a 512-dimensional vector",
  },
  detail: {
    zh: "模型看不懂文字，只看得懂數字。輸入嵌入層是一張查表：詞彙表裡的每個 token 對應一個可學習的 512 維向量。原始 Transformer 讓輸入嵌入、輸出嵌入與最後的線性層共用同一張表，並把向量乘上 √d_model 來放大。",
    en: "A model cannot read text, only numbers. The input embedding is a lookup table: each token in the vocabulary maps to a learnable 512-dimensional vector. The original Transformer shares this table between the input embedding, the output embedding and the final linear layer, and scales the vectors by √d_model.",
  },
  facts: [
    { label: { zh: "維度", en: "Dimension" }, value: "512" },
    { label: { zh: "詞彙表", en: "Vocabulary" }, value: { zh: "約 37,000 個 BPE token（英德）", en: "~37,000 BPE tokens (En–De)" } },
  ],
  deco: { count: 8 },
};

const positionalEncoding: Block = {
  id: "t-in-pos",
  kind: "position",
  label: { zh: "位置編碼（正弦波）", en: "Positional Encoding (sinusoidal)" },
  short: { zh: "位置編碼", en: "Positional encoding" },
  brief: {
    zh: "用不同頻率的正弦、餘弦波告訴模型每個詞的位置",
    en: "Sine and cosine waves of different frequencies tell the model where each token sits",
  },
  detail: {
    zh: "注意力本身不在乎順序——把句子打亂，它算出來的結果幾乎一樣。所以要在嵌入向量上加一組位置編碼。原始論文用固定的正弦與餘弦函數：每個維度是一個不同頻率的波，像時鐘的秒針、分針、時針一樣組合出唯一的位置指紋，而且不需要學習，也能推廣到訓練時沒看過的長度。",
    en: "Attention by itself does not care about order: shuffle the sentence and the result is nearly identical. So a positional code is added to each embedding. The original paper uses fixed sine and cosine functions: every dimension is a wave with a different frequency, and together they form a unique fingerprint for each position, like the second, minute and hour hands of a clock. Nothing has to be learned, and it extends to lengths never seen in training.",
  },
  height: 0.55,
};

const selfAttention: Block = {
  id: "t-enc-attn",
  kind: "attention",
  label: { zh: "多頭自注意力", en: "Multi-Head Self-Attention" },
  brief: {
    zh: "每個詞同時看向句子裡所有其他的詞，8 個頭各看不同的關係",
    en: "Every token looks at every other token; 8 heads each track a different kind of relation",
  },
  detail: {
    zh: "這是 Transformer 的心臟。每個詞的向量會被投影成三種角色：查詢（Q）、鍵（K）、值（V）。用 Q 和所有 K 做內積、除以 √64 再過 softmax，就得到「該把多少注意力放在每個詞上」的權重，再用權重加總 V。八個頭平行做這件事，各自學到不同的關係，例如主詞與動詞、代名詞與它指的對象，最後把八份結果拼接起來。",
    en: "This is the heart of the Transformer. Each token's vector is projected into three roles: a query (Q), a key (K) and a value (V). Taking the dot product of Q with every K, dividing by √64 and applying softmax gives the weights that say how much attention to pay to each token; those weights then sum the values. Eight heads do this in parallel, each learning a different relation, such as subject–verb or a pronoun and what it refers to, and their outputs are concatenated.",
  },
  facts: [
    { label: { zh: "頭數", en: "Heads" }, value: { zh: "8 個，每頭 64 維", en: "8, 64 dims each" } },
    { label: { zh: "公式", en: "Formula" }, value: "softmax(QKᵀ / √dₖ) V" },
  ],
  height: 1.25,
  deco: { count: 8 },
};

const addNorm: Block = {
  id: "t-enc-an1",
  kind: "norm",
  label: { zh: "殘差相加 & LayerNorm", en: "Add & LayerNorm" },
  short: { zh: "Add & Norm", en: "Add & Norm" },
  brief: {
    zh: "把子層的輸出加回原本的輸入，再做層正規化",
    en: "Add the sublayer output back to its input, then normalise",
  },
  detail: {
    zh: "每個子層外面都包著一條「殘差連接」：輸出等於輸入加上子層算出的修正量。這讓梯度有一條捷徑可以直接往下傳，深層網路才練得起來。相加之後再做 LayerNorm，把每個位置的向量調整成平均 0、變異數 1，讓數值穩定。原始 Transformer 把正規化放在相加之後（Post-LN），後來的模型大多改成放在子層之前。",
    en: "Every sublayer is wrapped in a residual connection: the output equals the input plus the correction the sublayer computed. This gives gradients a shortcut straight down the network, which is what makes deep stacks trainable. After the addition, LayerNorm rescales each position's vector to mean 0 and variance 1 to keep the numbers stable. The original Transformer normalises after the addition (Post-LN); most later models moved the norm in front of the sublayer.",
  },
  height: 0.4,
};

const feedForward: Block = {
  id: "t-enc-ffn",
  kind: "ffn",
  label: { zh: "前饋網路（ReLU）", en: "Feed-Forward Network (ReLU)" },
  short: { zh: "前饋網路", en: "Feed-forward" },
  brief: {
    zh: "對每個位置各自做兩層全連接：512 → 2048 → 512",
    en: "Two dense layers applied to each position on its own: 512 → 2048 → 512",
  },
  detail: {
    zh: "注意力負責「詞與詞之間」的交流，前饋網路則負責「每個詞自己」的加工。它是兩層全連接：先把 512 維放大到 2048 維、經過 ReLU 只留下正值，再壓回 512 維。同一組權重套用在每個位置上。後來的研究發現，模型記住的大量事實知識，主要就存放在這些前饋層裡。",
    en: "Attention handles communication between tokens; the feed-forward network processes each token on its own. It is two dense layers: expand 512 dims to 2048, keep only the positive values with ReLU, then project back to 512. The same weights are applied at every position. Later research found that much of a model's factual knowledge lives in these feed-forward layers.",
  },
  facts: [{ label: { zh: "隱藏維度", en: "Hidden size" }, value: "2048" }],
  height: 1.1,
  deco: { count: 24 },
};

const encoderOutput: Block = {
  id: "t-enc-out",
  kind: "io",
  label: { zh: "編碼器輸出（提供 K、V）", en: "Encoder output (supplies K, V)" },
  short: { zh: "編碼器輸出", en: "Encoder output" },
  brief: {
    zh: "六層之後的向量序列，交給解碼器的交叉注意力使用",
    en: "The sequence after six layers, handed to the decoder's cross-attention",
  },
  detail: {
    zh: "六層編碼器疊完後，每個原文詞都變成一個吸收了整句脈絡的向量。這些向量不會直接變成輸出，而是被解碼器的每一層當成鍵（K）與值（V）來查詢——這條連線就是編碼器與解碼器之間唯一的橋。",
    en: "After six encoder layers, every source token has become a vector that has absorbed the context of the whole sentence. These vectors are not turned into output directly; instead every decoder layer uses them as keys (K) and values (V) to query. This connection is the only bridge between encoder and decoder.",
  },
  height: 0.5,
};

const outputEmbedding: Block = {
  id: "t-out-emb",
  kind: "embedding",
  label: { zh: "輸出嵌入（右移一格）", en: "Output Embedding (shifted right)" },
  short: { zh: "輸出嵌入", en: "Output embedding" },
  brief: {
    zh: "把已經產生的目標詞嵌入，往右移一格好預測下一個",
    en: "Embeds the target tokens produced so far, shifted one step right to predict the next",
  },
  detail: {
    zh: "解碼器的輸入是「到目前為止已經產生的目標句」。訓練時把整個正確答案往右移一格、前面補一個起始符號，這樣第 t 個位置看到的都是前 t−1 個詞，任務就是預測第 t 個詞。這種「用前文預測下一個詞」的做法，正是後來所有 GPT 類模型的訓練方式。",
    en: "The decoder's input is the target sentence produced so far. During training the whole correct answer is shifted one position to the right with a start symbol in front, so position t only sees the first t−1 tokens and must predict token t. This \"predict the next token from the prefix\" recipe became the training objective of every GPT-style model.",
  },
  deco: { count: 8 },
};

const maskedAttention: Block = {
  id: "t-dec-mattn",
  kind: "attention",
  label: { zh: "遮罩多頭自注意力", en: "Masked Multi-Head Self-Attention" },
  short: { zh: "遮罩自注意力", en: "Masked self-attention" },
  brief: {
    zh: "跟自注意力一樣，但每個詞只能看到自己和前面的詞",
    en: "Like self-attention, but each token may only look at itself and earlier tokens",
  },
  detail: {
    zh: "解碼器是一個字一個字生成的，所以在訓練時不能讓第 t 個位置偷看後面的答案。做法是在注意力分數上蓋一張三角形遮罩，把「未來」的位置設成負無限大，softmax 之後權重就變成 0。這個因果遮罩就是「因果語言模型」名字的由來，也是今天 Llama、DeepSeek 等模型每一層都在用的機制。",
    en: "The decoder generates one token at a time, so during training position t must not peek at later answers. A triangular mask sets the scores of all future positions to minus infinity, so after softmax their weights become zero. This causal mask is where the name \"causal language model\" comes from, and it is the mechanism every layer of Llama and DeepSeek still uses today.",
  },
  height: 1.25,
  deco: { count: 8 },
};

const crossAttention: Block = {
  id: "t-dec-xattn",
  kind: "attention",
  label: { zh: "編碼器–解碼器注意力（交叉注意力）", en: "Encoder–Decoder Attention (cross-attention)" },
  short: { zh: "交叉注意力", en: "Cross-attention" },
  brief: {
    zh: "查詢來自解碼器，鍵和值來自編碼器輸出",
    en: "Queries come from the decoder; keys and values come from the encoder output",
  },
  detail: {
    zh: "這一層讓解碼器「回頭看原文」。查詢（Q）來自解碼器目前的狀態，鍵（K）與值（V）則來自編碼器的輸出，所以每產生一個目標詞，模型都能重新決定該對齊原文的哪幾個詞。純解碼器的模型（GPT、Llama）沒有這一層，因為它們把「原文」和「答案」放在同一條序列裡處理。",
    en: "This layer lets the decoder look back at the source. Queries (Q) come from the decoder's current state, while keys (K) and values (V) come from the encoder output, so for every target token the model can re-decide which source words to align with. Decoder-only models such as GPT and Llama have no such layer, because they place the source and the answer in the same sequence.",
  },
  height: 1.25,
  deco: { count: 8 },
};

const linear: Block = {
  id: "t-linear",
  kind: "output",
  label: { zh: "線性層", en: "Linear" },
  brief: {
    zh: "把 512 維向量投影到詞彙表大小的分數",
    en: "Projects the 512-dim vector to one score per vocabulary entry",
  },
  detail: {
    zh: "最後一步先把解碼器頂端的向量乘上一個矩陣，變成詞彙表裡每個 token 的分數（logits）。原始 Transformer 讓這個矩陣直接重用嵌入表的權重，省下大量參數。",
    en: "The final step multiplies the vector at the top of the decoder by a matrix to obtain a score (logit) for every token in the vocabulary. The original Transformer reuses the embedding table's weights for this matrix, saving many parameters.",
  },
  height: 0.6,
};

const softmax: Block = {
  id: "t-softmax",
  kind: "output",
  label: { zh: "Softmax → 輸出機率", en: "Softmax → Output probabilities" },
  short: { zh: "Softmax", en: "Softmax" },
  brief: {
    zh: "把分數變成加總為 1 的機率，選出下一個詞",
    en: "Turns scores into probabilities that sum to 1, then picks the next token",
  },
  detail: {
    zh: "Softmax 把所有分數指數化再正規化，變成一組加總為 1 的機率。訓練時拿它和正確答案算交叉熵損失；生成時則從中挑出下一個詞——可以取最高分，也可以依機率抽樣，再把它接回解碼器輸入，繼續產生下一個。",
    en: "Softmax exponentiates and normalises the scores into probabilities that sum to one. During training they are compared with the correct token using cross-entropy loss; during generation the next token is chosen from them, either the top score or a sample, and fed back into the decoder to produce the one after it.",
  },
  height: 0.8,
  deco: { count: 10 },
};

export const transformer: ModelSpec = {
  id: "transformer",
  name: { zh: "原始 Transformer", en: "Original Transformer" },
  shortName: { zh: "Transformer", en: "Transformer" },
  year: 2017,
  org: { zh: "Google（Vaswani 等人）", en: "Google (Vaswani et al.)" },
  tagline: {
    zh: "一切的起點：編碼器–解碼器，只靠注意力",
    en: "Where it all began: encoder–decoder, attention only",
  },
  intro: {
    zh: "2017 年的論文《Attention Is All You Need》提出了 Transformer。它是一個為機器翻譯設計的「編碼器–解碼器」模型：左邊的編碼器讀入整句原文，右邊的解碼器一次產生一個目標語言的詞。它完全拋棄了循環神經網路，只靠「注意力」讓每個詞直接看到句中任何其他詞，因此可以大量平行運算。今天所有的大語言模型，都是從這座建築的藍圖演變而來。",
    en: "The 2017 paper \"Attention Is All You Need\" introduced the Transformer. It is an encoder–decoder model built for machine translation: the encoder on the left reads the whole source sentence, and the decoder on the right produces the target sentence one token at a time. It dropped recurrence entirely and relies only on attention, so every word can look directly at every other word and computation runs in parallel. Every large language model today descends from this blueprint.",
  },
  facts: [
    { label: { zh: "層數", en: "Layers" }, value: { zh: "6 層編碼器 + 6 層解碼器", en: "6 encoder + 6 decoder" } },
    { label: { zh: "模型維度 d_model", en: "Model dim d_model" }, value: { zh: "512（Big 版 1,024）", en: "512 (1,024 in Big)" } },
    { label: { zh: "注意力頭", en: "Attention heads" }, value: { zh: "8 個，每頭 64 維", en: "8, 64 dims each" } },
    { label: { zh: "前饋隱藏維度", en: "FFN hidden size" }, value: "2,048" },
    { label: { zh: "參數量", en: "Parameters" }, value: { zh: "約 6,500 萬（Big 版 2.13 億）", en: "~65M (213M Big)" } },
    { label: { zh: "訓練資料", en: "Training data" }, value: { zh: "WMT 2014 英德 450 萬句對", en: "WMT 2014 En–De, 4.5M sentence pairs" } },
    { label: { zh: "訓練成本", en: "Training cost" }, value: { zh: "8 顆 P100 GPU，Base 版 12 小時", en: "8× P100 GPUs, 12 hours (Base)" } },
    { label: { zh: "正規化位置", en: "Norm placement" }, value: { zh: "後置（Post-LN）", en: "Post-LN" } },
  ],
  columns: [
    {
      id: "encoder",
      title: { zh: "編碼器", en: "Encoder" },
      x: -1.9,
      z: 0,
      labelSide: "left",
      main: true,
      blocks: [
        inputEmbedding,
        positionalEncoding,
        selfAttention,
        addNorm,
        feedForward,
        cloneBlock(addNorm, "t-enc-an2"),
        encoderOutput,
      ],
      groups: [{ id: "t-enc-x6", from: "t-enc-attn", to: "t-enc-an2", repeat: 6, label: { zh: "6 層", en: "6 layers" } }],
    },
    {
      id: "decoder",
      title: { zh: "解碼器", en: "Decoder" },
      x: 1.9,
      z: 0,
      labelSide: "right",
      main: true,
      blocks: [
        outputEmbedding,
        cloneBlock(positionalEncoding, "t-out-pos"),
        maskedAttention,
        cloneBlock(addNorm, "t-dec-an1"),
        crossAttention,
        cloneBlock(addNorm, "t-dec-an2"),
        cloneBlock(feedForward, "t-dec-ffn"),
        cloneBlock(addNorm, "t-dec-an3"),
        linear,
        softmax,
      ],
      groups: [{ id: "t-dec-x6", from: "t-dec-mattn", to: "t-dec-an3", repeat: 6, label: { zh: "6 層", en: "6 layers" } }],
    },
  ],
  links: [{ from: "t-enc-out", to: "t-dec-xattn", style: "kv", label: { zh: "K、V", en: "K, V" } }],
  tourOrder: [
    "t-in-emb",
    "t-in-pos",
    "t-enc-attn",
    "t-enc-an1",
    "t-enc-ffn",
    "t-enc-out",
    "t-out-emb",
    "t-dec-mattn",
    "t-dec-xattn",
    "t-linear",
    "t-softmax",
  ],
  sources: [
    { label: "Vaswani et al., \"Attention Is All You Need\" (2017)", url: "https://arxiv.org/abs/1706.03762" },
    { label: "The Annotated Transformer (Harvard NLP)", url: "https://nlp.seas.harvard.edu/annotated-transformer/" },
  ],
  accent: 0xc9a24c,
};
