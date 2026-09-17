import { attachExamples, cloneBlock, type Block, type ModelSpec } from "./types.ts";
import { deepseekExample, deepseekExamples, deepseekFlowTokens } from "./examples/deepseek-v41-flash.ts";

const visionEncoder: Block = {
  id: "d-vit",
  kind: "vision",
  label: { zh: "DeepSeek-ViT 視覺編碼器", en: "DeepSeek-ViT vision encoder" },
  short: { zh: "DeepSeek-ViT", en: "DeepSeek-ViT" },
  brief: {
    zh: "32 層的 Vision Transformer，用 14×14 像素的 patch 讀圖",
    en: "A 32-layer Vision Transformer reading 14×14-pixel patches",
  },
  detail: {
    zh: "圖片先被切成 14×14 像素的小方塊（patch），每塊用線性投影變成向量，再送進 32 層、隱藏維度 1,024、16 頭的 Vision Transformer。它用 2D-RoPE 表示位置，因此能處理任意解析度；也和語言主幹一樣採用 RMSNorm 與 SwiGLU。它是從零開始訓練的：先用約 470 億對圖文做對比學習，再接上一個小語言模型做自回歸微調。",
    en: "An image is first cut into 14×14-pixel patches, each linearly projected into a vector and fed through a 32-layer Vision Transformer with hidden size 1,024 and 16 heads. It encodes position with 2D-RoPE so it can handle any resolution, and like the language backbone it uses RMSNorm and SwiGLU. It was trained from scratch: contrastive learning on about 47 billion image–text pairs, then autoregressive fine-tuning attached to a small language model.",
  },
  facts: [
    { label: { zh: "層數 / 維度 / 頭", en: "Layers / dim / heads" }, value: "32 / 1,024 / 16" },
    { label: { zh: "Patch", en: "Patch" }, value: "14 × 14 px" },
  ],
  height: 1.2,
  deco: { count: 9 },
};

const projector: Block = {
  id: "d-projector",
  kind: "vision",
  label: { zh: "3×3 像素重排 + MLP 投影器", en: "3×3 pixel-unshuffle + MLP projector" },
  short: { zh: "投影器", en: "Projector" },
  brief: {
    zh: "把視覺特徵數量壓成九分之一，再投影到語言模型的向量空間",
    en: "Cuts the visual tokens to one ninth and projects them into the language model's space",
  },
  detail: {
    zh: "視覺編碼器輸出的特徵網格，先用 3×3 的 pixel-unshuffle 把九個相鄰格子合併成一個，token 數量變成九分之一，最高可支援約 1344×1344 的圖片。接著經過一個兩層、隱藏維度 5,120 的 MLP 投影器，變成和文字嵌入同一個空間的「視覺 token」，之後就和文字一起送進主幹。",
    en: "The feature grid from the vision encoder is first pixel-unshuffled 3×3, merging nine neighbouring cells into one so the token count drops to a ninth, supporting images up to about 1344×1344. A two-layer MLP projector with hidden size 5,120 then maps them into the same space as text embeddings as \"visual tokens\", which enter the backbone together with the text.",
  },
  height: 0.7,
};

const embedding: Block = {
  id: "d-emb",
  kind: "embedding",
  label: { zh: "文字嵌入 + 視覺 token", en: "Text embedding + visual tokens" },
  short: { zh: "嵌入（文字＋視覺）", en: "Embedding (text + vision)" },
  brief: {
    zh: "文字 token 查表成向量，和投影後的視覺 token 排成同一條序列",
    en: "Text tokens are looked up as vectors and lined up with the projected visual tokens in one sequence",
  },
  detail: {
    zh: "和其他模型一樣，文字先分詞、再查嵌入表。不同的是這裡的序列可以同時包含文字 token 與圖片投影出來的視覺 token，兩者從預訓練一開始就混在一起學。MoE 的負載平衡也會分別針對文字與圖片 token 計算，避免某一種模態霸占專家。",
    en: "As in other models, text is tokenised and looked up in an embedding table. The difference is that the sequence here can contain both text tokens and visual tokens projected from images, mixed together from the very start of pre-training. MoE load balancing is computed separately for text and image tokens so that neither modality monopolises the experts.",
  },
  deco: { count: 8 },
};

const swa: Block = {
  id: "d-swa",
  kind: "attention",
  label: { zh: "滑動視窗注意力 SWA（視窗 128）", en: "Sliding-window attention (window 128)" },
  short: { zh: "SWA（視窗 128）", en: "SWA (window 128)" },
  brief: {
    zh: "最底下兩層只看最近 128 個 token，專心處理局部關係",
    en: "The bottom two layers only look at the latest 128 tokens, focusing on local structure",
  },
  detail: {
    zh: "前兩層不使用全域注意力，只用滑動視窗：每個 token 只跟自己前面 128 個 token 互動。這種局部注意力便宜又適合抓字詞層級的模式。事實上，V4.1 的每一層都保留一條 SWA 分支，全域的稀疏注意力只是加在它旁邊。",
    en: "The first two layers use no global attention, only a sliding window: each token interacts with just the 128 tokens before it. This local attention is cheap and well suited to word-level patterns. In fact every layer of V4.1 keeps an SWA branch; the global sparse attention is added alongside it.",
  },
  height: 1.0,
  deco: { count: 8 },
};

const moe: Block = {
  id: "d-moe-a",
  kind: "moe",
  label: { zh: "DeepSeekMoE（1 共享 + 384 路由，啟用 6）", en: "DeepSeekMoE (1 shared + 384 routed, 6 active)" },
  short: { zh: "MoE（384 選 6）", en: "MoE (6 of 384)" },
  brief: {
    zh: "前饋層被拆成 385 位小專家，每個 token 只找其中 7 位處理",
    en: "The feed-forward layer is split into 385 small experts; each token visits only 7 of them",
  },
  detail: {
    zh: "混合專家（MoE）把一個大前饋網路換成很多個小前饋網路。V4.1 每層有 384 個路由專家，加上 1 個每個 token 都會經過的共享專家；每個專家是中間維度 2,304 的 SwiGLU（並把啟動值夾在 10 以內）。一個小小的路由器替每個 token 打分、挑出 6 個專家，只有這 7 個專家真的參與計算。這就是總參數 5,520 億、每 token 卻只用 80 到 160 億的祕密：知識容量很大，計算量很小。",
    en: "Mixture-of-Experts replaces one big feed-forward network with many small ones. Each V4.1 layer has 384 routed experts plus one shared expert that every token passes through; each expert is a SwiGLU with hidden size 2,304 (activations clamped at 10). A tiny router scores every token and picks 6 experts, and only those 7 experts actually compute. This is the secret behind 552 billion total parameters but only 8 to 16 billion used per token: huge knowledge capacity with small compute.",
  },
  facts: [
    { label: { zh: "專家", en: "Experts" }, value: { zh: "1 共享 + 384 路由", en: "1 shared + 384 routed" } },
    { label: { zh: "每 token 啟用", en: "Active per token" }, value: "6" },
    { label: { zh: "專家中間維度", en: "Expert hidden size" }, value: "2,304" },
  ],
  height: 1.1,
  deco: { count: 48, active: 6 },
};

const csa2EncFull: Block = {
  id: "d-csa2-enc-full",
  kind: "attention",
  label: { zh: "CSA2（壓縮 2:1，Full 模式）", en: "CSA2 (2:1 compression, Full mode)" },
  short: { zh: "CSA2 · 2:1 · Full", en: "CSA2 · 2:1 · Full" },
  brief: {
    zh: "自己算主 KV，每兩個 token 壓成一筆，並用索引器挑 Top-512",
    en: "Computes its own main KV, compresses every two tokens into one entry, and picks Top-512 with an indexer",
  },
  detail: {
    zh: "壓縮稀疏注意力第二代（CSA2）是 V4.1 的全域注意力。Full 模式的層會自己產生「主 KV」：在編碼器裡，每兩個 token 的鍵值被壓成一筆，長度直接減半。接著一個輕量索引器（32 頭 × 128 維）替每個查詢替所有主 KV 打分，只挑分數最高的 512 筆做真正的注意力，再加上本層的滑動視窗。每六層只有第一層是 Full 模式，它算出的主 KV 與 Top-512 索引會分給後面五層重用。",
    en: "Compressed Sparse Attention 2 (CSA2) is V4.1's global attention. A Full-mode layer produces its own main KV: in the encoder every two tokens' keys and values are compressed into one entry, halving the length. A lightweight indexer (32 heads × 128 dims) then scores all main KV entries for each query and keeps only the top 512 for real attention, plus the layer's own sliding window. Only the first layer of every group of six is Full mode; the main KV and Top-512 indices it computes are handed to the next five layers.",
  },
  facts: [
    { label: { zh: "查詢頭", en: "Query heads" }, value: { zh: "64 個 × 512 維", en: "64 × 512 dims" } },
    { label: { zh: "索引器", en: "Indexer" }, value: { zh: "32 頭 × 128 維，Top-512", en: "32 heads × 128 dims, Top-512" } },
  ],
  height: 1.25,
  deco: { count: 16 },
};

const csa2EncReuse: Block = {
  id: "d-csa2-enc-reuse",
  kind: "attention",
  label: { zh: "CSA2（2:1，Reuse 模式）", en: "CSA2 (2:1, Reuse mode)" },
  short: { zh: "CSA2 · 2:1 · Reuse", en: "CSA2 · 2:1 · Reuse" },
  brief: {
    zh: "不算自己的 KV 也不做索引，直接沿用前面 Full 層的主 KV 與 Top-512",
    en: "Computes no KV and no indexing; reuses the preceding Full layer's main KV and Top-512",
  },
  detail: {
    zh: "Reuse 模式的層最省：它只算自己的查詢與滑動視窗 KV，主 KV 和 Top-512 選擇都直接沿用同一組裡 Full 層的結果。這就是「跨層共享」——六層只存一份 KV、只做一次索引，KV 快取和索引計算都大幅下降。因為省掉的步驟多，這種層在推理時只需要十來個 GPU kernel 就能跑完。",
    en: "A Reuse-mode layer is the cheapest: it computes only its own queries and sliding-window KV, and borrows both the main KV and the Top-512 selection from the Full layer in its group. This is cross-layer sharing: six layers store one KV and run the indexer once, cutting both cache size and indexing work sharply. With so many steps skipped, such a layer runs in only about a dozen GPU kernels at inference time.",
  },
  height: 1.0,
  deco: { count: 16 },
};

const encoderOutput: Block = {
  id: "d-enc-out",
  kind: "io",
  label: { zh: "編碼器輸出 → 解碼器全域 KV", en: "Encoder output → decoder global KV" },
  short: { zh: "編碼器輸出", en: "Encoder output" },
  brief: {
    zh: "第 20 層的隱藏狀態，被投影成後面 20 層解碼器要用的全域 KV",
    en: "The layer-20 hidden state is projected into the global KV used by all 20 decoder layers",
  },
  detail: {
    zh: "這是 CED 架構的關鍵。傳統模型每一層都用自己的隱藏狀態算 KV；V4.1 的解碼器則把「全域 KV」統一從編碼器最後一層的隱藏狀態投影出來（每個 Full 層有自己的一組投影權重）。因此在讀取長提示（prefill）時，只需要跑完 20 層編碼器就能把解碼器要用的 KV 全部備妥，計算量幾乎減半。",
    en: "This is the key to the CED architecture. In a conventional model every layer derives KV from its own hidden state; V4.1's decoder instead projects its global KV from the hidden state of the encoder's last layer (each Full layer with its own projection weights). So when reading a long prompt (prefill), running the 20 encoder layers is enough to prepare all the KV the decoder needs, cutting computation nearly in half.",
  },
  height: 0.5,
};

const csa2DecFull: Block = {
  id: "d-csa2-dec-full",
  kind: "attention",
  label: { zh: "CSA2（1:1，Full）— 建立候選池", en: "CSA2 (1:1, Full) — builds the candidate pool" },
  short: { zh: "CSA2 · 1:1 · Full", en: "CSA2 · 1:1 · Full" },
  brief: {
    zh: "解碼器第一層：KV 來自編碼器輸出，不壓縮，並替後面的層選出候選池",
    en: "The decoder's first layer: KV from the encoder output, uncompressed, and it picks a candidate pool for later layers",
  },
  detail: {
    zh: "解碼器的 CSA2 壓縮比是 1，也就是不壓縮，每個 token 一筆主 KV，但這些 KV 是從編碼器輸出投影來的。第一層是 Full 模式：它替每個查詢挑出 Top-512，並且把被選到的位置所在的區塊（每塊 8 個位置，最多 2,048 塊）集合成一個「候選池」，最多 16,384 個候選位置。後面的 Reindex 層只在這個池子裡重新打分，讓索引成本不再隨上下文長度成長。",
    en: "The decoder's CSA2 uses a compression ratio of 1, so there is one main KV entry per token, but those entries are projected from the encoder output. The first layer is Full mode: it selects Top-512 for each query and gathers the blocks containing the chosen positions (8 positions per block, up to 2,048 blocks) into a candidate pool of at most 16,384 positions. Later Reindex layers rescore only within this pool, so indexing cost no longer grows with context length.",
  },
  height: 1.25,
  deco: { count: 16 },
};

const csa2DecReuse: Block = {
  id: "d-csa2-dec-reuse",
  kind: "attention",
  label: { zh: "CSA2（1:1，Reuse）", en: "CSA2 (1:1, Reuse)" },
  short: { zh: "CSA2 · 1:1 · Reuse", en: "CSA2 · 1:1 · Reuse" },
  brief: {
    zh: "沿用同組前一個 Full／Reindex 層的 KV 與選擇",
    en: "Reuses the KV and selection from its group's Full or Reindex layer",
  },
  detail: {
    zh: "解碼器每四層一組，其中三層是 Reuse 模式，直接使用同組第一層的主 KV 和 Top-512 選擇，自己只算查詢與滑動視窗。二十層解碼器因此只需要五次索引。",
    en: "Decoder layers come in groups of four, three of which are Reuse mode: they take the main KV and Top-512 selection from the group's first layer and compute only their own queries and sliding window. Twenty decoder layers therefore need just five indexing passes.",
  },
  height: 1.0,
  deco: { count: 16 },
};

const csa2DecReindex: Block = {
  id: "d-csa2-dec-reindex",
  kind: "attention",
  label: { zh: "CSA2（1:1，Reindex 模式）", en: "CSA2 (1:1, Reindex mode)" },
  short: { zh: "CSA2 · 1:1 · Reindex", en: "CSA2 · 1:1 · Reindex" },
  brief: {
    zh: "沿用共享的主 KV，但在候選池裡重新挑自己的 Top-512",
    en: "Shares the main KV, but re-picks its own Top-512 inside the candidate pool",
  },
  detail: {
    zh: "Reindex 模式介於 Full 和 Reuse 之間：主 KV 與索引器的鍵繼續共享，不多存任何快取，但這一層會用自己的索引器查詢重新打分，選出一組新的 Top-512。這讓不同深度的層可以關注不同的位置。在解碼器裡，重新打分只在第一個 Full 層建立的候選池內進行，這就是「階層式稀疏索引器」。",
    en: "Reindex mode sits between Full and Reuse: the main KV and indexer keys remain shared, so no extra cache is stored, but the layer rescores with its own indexer query and selects a fresh Top-512. Different depths can therefore attend to different positions. In the decoder this rescoring happens only inside the candidate pool built by the first Full layer, which is the Hierarchical Sparse Indexer.",
  },
  height: 1.15,
  deco: { count: 16 },
};

const outputHead: Block = {
  id: "d-head",
  kind: "output",
  label: { zh: "輸出頭 → 下一個 token", en: "Output head → next token" },
  short: { zh: "輸出頭", en: "Output head" },
  brief: {
    zh: "解碼器頂端的向量投影成詞彙表分數，取樣出新 token",
    en: "The vector at the top of the decoder is projected into vocabulary scores and a new token is sampled",
  },
  detail: {
    zh: "和其他模型一樣，最後一層的輸出經過預測頭變成每個 token 的分數，再抽樣出下一個 token。不同的是，正式服務時 V4.1 不會一次只產生一個 token，而是交給旁邊的 DSpark 先一次猜五個，再由主模型驗證。",
    en: "As in other models, the last layer's output passes through a prediction head to score every token, and the next token is sampled. The difference is that in production V4.1 does not produce one token at a time: DSpark, alongside, first drafts five at once and the main model verifies them.",
  },
  height: 0.8,
  deco: { count: 10 },
};

const mhc: Block = {
  id: "d-mhc",
  kind: "residual",
  label: { zh: "Single-Pass mHC 殘差流（4 條）", en: "Single-Pass mHC residual streams (4)" },
  short: { zh: "mHC 殘差流", en: "mHC residual" },
  brief: {
    zh: "把單一殘差流擴成 4 條，用可學習的係數在層與層之間混合（每一層都有）",
    en: "Widens the single residual stream to 4, mixing them between layers with learned coefficients (in every layer)",
  },
  detail: {
    zh: "從 2017 年到 Llama，每層都是「輸入加上修正量」的一條殘差流。mHC（流形約束超連接）把它擴成 4 條平行的流，每一層由一組依 token 計算的係數決定要從哪些流讀、寫回哪些流，係數再用 Sinkhorn-Knopp 迭代約束在一個穩定的流形上。Single-Pass 版本讓每一層直接用前一層算好的混合係數，這樣殘差更新、輸入混合、係數預測就能融合成一個 GPU kernel，記憶體流量減半。",
    en: "From 2017 through Llama, every layer had a single residual stream: input plus a correction. mHC (manifold-constrained hyper-connections) widens it to four parallel streams; each layer uses token-wise coefficients to decide which streams to read from and write back to, and the coefficients are constrained to a stable manifold with Sinkhorn-Knopp iterations. The Single-Pass variant lets each layer use the mixing coefficients computed by the previous layer, so residual update, input mixing and coefficient prediction fuse into one GPU kernel and memory traffic halves.",
  },
  facts: [{ label: { zh: "擴展倍數 / Sinkhorn 迭代", en: "Expansion / Sinkhorn iterations" }, value: "4 / 20" }],
  height: 0.7,
  deco: { count: 4 },
};

const engram: Block = {
  id: "d-engram",
  kind: "memory",
  label: { zh: "Engram 條件記憶 ×2（第 1、14 層）", en: "Engram conditional memory ×2 (layers 1 and 14)" },
  short: { zh: "Engram ×2", en: "Engram ×2" },
  brief: {
    zh: "1,960 億參數的 n-gram 查表記憶，把「背知識」從「算」中分離",
    en: "196B parameters of n-gram lookup memory, separating memorisation from computation",
  },
  detail: {
    zh: "Engram 是一種用查表而不是用計算來記東西的模組。它把最近的 2、3、4 個 token 組成 n-gram，透過 8 個雜湊頭查詢各自約 1,600 萬筆的嵌入表（每個 n 階 2,048 維），再用上下文感知的閘門決定採納多少。兩個 Engram 模組共 1,960 億參數，放在第 1 層與第 14 層。因為查表位址只取決於輸入 token，推理時可以事先從主機記憶體用 RDMA 預取，幾乎不增加延遲。",
    en: "Engram is a module that remembers by table lookup rather than by computation. It forms n-grams from the most recent 2, 3 and 4 tokens, hashes them with 8 heads into embedding tables of about 16 million entries each (2,048 dims per order), and a context-aware gate decides how much to take in. The two Engram modules hold 196B parameters in total and sit at layers 1 and 14. Because the addresses depend only on the input tokens, embeddings can be prefetched from host memory over RDMA during inference with almost no added latency.",
  },
  facts: [
    { label: { zh: "參數", en: "Parameters" }, value: "196B" },
    { label: { zh: "n-gram 階數", en: "n-gram orders" }, value: "2, 3, 4" },
  ],
  height: 1.0,
  deco: { count: 32 },
};

const sharedKv: Block = {
  id: "d-kv",
  kind: "memory",
  label: { zh: "共享全域 KV 快取（FP4，890 bytes/token）", en: "Shared global KV cache (FP4, 890 bytes/token)" },
  short: { zh: "共享 KV（FP4）", en: "Shared KV (FP4)" },
  brief: {
    zh: "跨層共享、壓縮、再用 4 位元儲存的全域鍵值",
    en: "Global keys and values shared across layers, compressed, and stored in 4 bits",
  },
  detail: {
    zh: "把所有招數加起來：編碼器每 6 層共用一份 2:1 壓縮的主 KV，解碼器每 4 層共用一份；主 KV 再用 FP4（E2M1 格式，每 16 個通道一個 E4M3 比例）儲存。結果每個 token 常駐在 GPU 記憶體裡的全域 KV 只有 890 bytes，約為前一代 V4-Flash 的四分之一。回想 Llama 3 8B 每個 token 要 128 KB——這就是一百萬 token 上下文能夠負擔得起的原因。",
    en: "Add everything up: the encoder shares one 2:1-compressed main KV per 6 layers, the decoder one per 4 layers, and the main KV is stored in FP4 (E2M1 format with one E4M3 scale per 16 channels). The result is only 890 bytes of global KV per token resident in GPU memory, about a quarter of the previous V4-Flash. Recall that Llama 3 8B needs 128 KB per token; this is what makes a one-million-token context affordable.",
  },
  facts: [{ label: { zh: "每 token", en: "Per token" }, value: "890 bytes" }],
  height: 1.0,
  deco: { count: 32 },
};

const candidatePool: Block = {
  id: "d-pool",
  kind: "memory",
  label: { zh: "候選池（階層式稀疏索引器）", en: "Candidate pool (Hierarchical Sparse Indexer)" },
  short: { zh: "候選池", en: "Candidate pool" },
  brief: {
    zh: "解碼器第一層挑出的最多 16,384 個位置，後面的層只在這裡面搜尋",
    en: "Up to 16,384 positions picked by the decoder's first layer; later layers search only here",
  },
  detail: {
    zh: "在一百萬 token 的上下文裡，即使索引器很輕，每一層都替全部位置打分還是很貴。候選池讓深層的索引器只在淺層已經覺得重要的區塊裡尋找，每個查詢的成本從「隨長度成長」變成「固定」。這個機制是在後訓練階段加入的，讓模型學會與它共處。",
    en: "In a one-million-token context, even a light indexer is expensive if every layer scores every position. The candidate pool lets deeper indexers search only within blocks that shallower layers already found important, turning per-query cost from \"grows with length\" into \"constant\". The mechanism is introduced during post-training so the model learns to work with it.",
  },
  facts: [{ label: { zh: "大小", en: "Size" }, value: { zh: "最多 2,048 塊 × 8 個位置", en: "Up to 2,048 blocks × 8 positions" } }],
  height: 0.8,
  deco: { count: 32 },
};

const dspark: Block = {
  id: "d-dspark",
  kind: "spec",
  label: { zh: "DSpark 推測解碼草稿器", en: "DSpark speculative-decoding drafter" },
  short: { zh: "DSpark 草稿器", en: "DSpark drafter" },
  brief: {
    zh: "3 層小模型一次猜 5 個 token，主模型平行驗證，生成更快",
    en: "A 3-block drafter guesses 5 tokens at once; the main model verifies them in parallel for faster generation",
  },
  detail: {
    zh: "生成階段每算一步只得到一個 token，GPU 常常在等記憶體。DSpark 是一個掛在主模型旁邊、只有三個 Transformer 區塊（滑動視窗 128）的草稿器：一次前向就產生五個位置的草稿，用一個小的 Markov 頭處理草稿之間的依賴，還有一個信心頭預測每個位置被接受的機率。排程器根據這些信心與系統負載，動態決定每次要驗證幾個 token，讓整體吞吐最大。它在主幹預訓練之後才單獨訓練，取代了 V3 時代的 MTP 模組。",
    en: "During generation each step yields one token and the GPU often waits on memory. DSpark is a drafter attached beside the main model with only three Transformer blocks (window 128): one forward pass drafts five positions at once, a small Markov head models dependencies among the draft tokens, and a confidence head predicts how likely each position is to be accepted. A scheduler uses those confidences and the current system load to decide how many tokens to verify each step, maximising overall throughput. It is trained separately after backbone pre-training and replaces the MTP module of the V3 era.",
  },
  facts: [{ label: { zh: "草稿長度", en: "Draft length" }, value: { zh: "5 個 token", en: "5 tokens" } }],
  height: 0.9,
  deco: { count: 5 },
};

export const deepseekV41Flash: ModelSpec = attachExamples({
  id: "deepseek-v41-flash",
  name: { zh: "DeepSeek V4.1 Flash", en: "DeepSeek V4.1 Flash" },
  shortName: { zh: "DeepSeek V4.1", en: "DeepSeek V4.1" },
  year: 2026,
  org: { zh: "DeepSeek-AI", en: "DeepSeek-AI" },
  tagline: {
    zh: "因果編碼器–解碼器 MoE，為百萬 token 上下文而生",
    en: "A causal encoder–decoder MoE built for million-token contexts",
  },
  intro: {
    zh: "DeepSeek-V4.1-Flash 是 DeepSeek 在 2026 年 9 月開放權重的多模態 MoE 模型：主幹 5,520 億參數，另有 1,960 億 Engram 記憶參數，但每個 token 在讀取（prefill）階段只啟用 80 億、生成（decode）階段 160 億，上下文可達一百萬 token。它的骨架叫「因果編碼器–解碼器」（CED）：40 層被分成 20 層因果編碼器與 20 層解碼器，解碼器的全域 KV 直接從編碼器的最終狀態投影出來，因此讀長文只要跑一半的層。再搭配跨層共享 KV 的 CSA2 稀疏注意力、FP4 KV 快取、Single-Pass mHC 殘差流、Engram 記憶與 DSpark 推測解碼，把每個 token 的全域 KV 快取壓到只有 890 bytes。",
    en: "DeepSeek-V4.1-Flash is the multimodal MoE model DeepSeek released with open weights in September 2026: 552B backbone parameters plus 196B Engram memory parameters, yet each token activates only 8B parameters while reading the prompt (prefill) and 16B while generating (decode), with a context of up to one million tokens. Its skeleton is a Causal Encoder–Decoder (CED): the 40 layers are split into a 20-layer causal encoder and a 20-layer decoder, and the decoder's global KV is projected straight from the encoder's final states, so reading a long prompt only runs half the layers. Combined with CSA2 sparse attention that shares KV across layers, FP4 KV caching, Single-Pass mHC residual streams, Engram memory and DSpark speculative decoding, the global KV cache shrinks to just 890 bytes per token.",
  },
  example: deepseekExample,
  facts: [
    { label: { zh: "類型", en: "Type" }, value: { zh: "多模態 MoE，因果編碼器–解碼器（CED）", en: "Multimodal MoE, Causal Encoder–Decoder (CED)" } },
    { label: { zh: "層數", en: "Layers" }, value: { zh: "20 層因果編碼器 + 20 層解碼器", en: "20 causal encoder + 20 decoder" } },
    { label: { zh: "參數", en: "Parameters" }, value: { zh: "主幹 552B + Engram 196B", en: "552B backbone + 196B Engram" } },
    { label: { zh: "每 token 啟用", en: "Active per token" }, value: { zh: "prefill 8B，decode 16B", en: "8B prefill, 16B decode" } },
    { label: { zh: "專家", en: "Experts" }, value: { zh: "每層 1 共享 + 384 路由，啟用 6", en: "1 shared + 384 routed per layer, 6 active" } },
    { label: { zh: "注意力", en: "Attention" }, value: { zh: "64 查詢頭 × 512 維；索引器 32 頭，Top-512", en: "64 query heads × 512 dims; 32-head indexer, Top-512" } },
    { label: { zh: "全域 KV 快取", en: "Global KV cache" }, value: { zh: "FP4，每 token 890 bytes", en: "FP4, 890 bytes per token" } },
    { label: { zh: "上下文", en: "Context" }, value: { zh: "1,000,000 token", en: "1,000,000 tokens" } },
    { label: { zh: "訓練資料", en: "Training data" }, value: { zh: "45 兆多模態 token", en: "45T multimodal tokens" } },
  ],
  columns: [
    {
      id: "inputs",
      title: { zh: "輸入與記憶", en: "Inputs & memory" },
      x: -7.4,
      z: 0.6,
      scale: 0.7,
      baseY: 0,
      labelSide: "left",
      blocks: [visionEncoder, projector, engram],
    },
    {
      id: "encoder",
      title: { zh: "因果編碼器 · 20 層", en: "Causal encoder · 20 layers" },
      x: -1.9,
      z: 0,
      labelSide: "left",
      main: true,
      flowTokens: deepseekFlowTokens.encoder,
      blocks: [
        embedding,
        swa,
        moe,
        csa2EncFull,
        cloneBlock(moe, "d-moe-b", { hideLabel: true }),
        csa2EncReuse,
        cloneBlock(moe, "d-moe-c", { hideLabel: true }),
        encoderOutput,
      ],
      groups: [
        { id: "d-g-swa", from: "d-swa", to: "d-moe-a", repeat: 2, label: { zh: "2 層", en: "2 layers" } },
        { id: "d-g-enc-reuse", from: "d-csa2-enc-reuse", to: "d-moe-c", repeat: 5 },
        { id: "d-g-enc-outer", from: "d-csa2-enc-full", to: "d-moe-c", repeat: 3, label: { zh: "3 組 × 6 層", en: "3 groups × 6 layers" } },
      ],
    },
    {
      id: "decoder",
      title: { zh: "解碼器 · 20 層", en: "Decoder · 20 layers" },
      x: 1.9,
      z: 0,
      labelSide: "right",
      main: true,
      flowTokens: deepseekFlowTokens.decoder,
      blocks: [
        csa2DecFull,
        cloneBlock(moe, "d-moe-d"),
        csa2DecReuse,
        cloneBlock(moe, "d-moe-e", { hideLabel: true }),
        csa2DecReindex,
        cloneBlock(moe, "d-moe-f", { hideLabel: true }),
        cloneBlock(csa2DecReuse, "d-csa2-dec-reuse2", { hideLabel: true }),
        cloneBlock(moe, "d-moe-g", { hideLabel: true }),
        outputHead,
      ],
      groups: [
        { id: "d-g-dec-reuse1", from: "d-csa2-dec-reuse", to: "d-moe-e", repeat: 3 },
        { id: "d-g-dec-reuse2", from: "d-csa2-dec-reuse2", to: "d-moe-g", repeat: 3 },
        { id: "d-g-dec-outer", from: "d-csa2-dec-reindex", to: "d-moe-g", repeat: 4, label: { zh: "4 組 × 4 層", en: "4 groups × 4 layers" } },
      ],
    },
    {
      id: "side",
      title: { zh: "貫穿全模型的模組", en: "Modules spanning the model" },
      x: 8.0,
      z: 0.6,
      scale: 0.7,
      baseY: 3.3,
      labelSide: "right",
      blocks: [mhc, sharedKv, candidatePool, dspark],
    },
  ],
  links: [
    { from: "d-projector", to: "d-emb", style: "flow", label: { zh: "視覺 token", en: "Visual tokens" } },
    { from: "d-enc-out", to: "d-csa2-dec-full", style: "kv", label: { zh: "全域 KV 投影", en: "Global KV projection" } },
    { from: "d-engram", to: "d-swa", style: "memory" },
    { from: "d-engram", to: "d-csa2-enc-full", style: "memory" },
    { from: "d-csa2-dec-reuse", to: "d-kv", style: "memory" },
    { from: "d-csa2-dec-full", to: "d-pool", style: "memory", label: { zh: "建立", en: "builds" } },
    { from: "d-pool", to: "d-csa2-dec-reindex", style: "memory", label: { zh: "搜尋範圍", en: "search domain" } },
    { from: "d-head", to: "d-dspark", style: "flow", label: { zh: "草稿 5 個 token", en: "drafts 5 tokens" } },
  ],
  tourOrder: [
    "d-vit",
    "d-projector",
    "d-emb",
    "d-engram",
    "d-swa",
    "d-moe-a",
    "d-mhc",
    "d-csa2-enc-full",
    "d-csa2-enc-reuse",
    "d-enc-out",
    "d-csa2-dec-full",
    "d-pool",
    "d-csa2-dec-reindex",
    "d-csa2-dec-reuse",
    "d-kv",
    "d-head",
    "d-dspark",
  ],
  sources: [
    { label: "DeepSeek-AI, \"DeepSeek-V4.1-Flash: Pushing the Limits of KV Cache Compression\" (2026)", url: "https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash/blob/main/DeepSeek_V41_Tech_Report.pdf" },
    { label: "deepseek-ai/DeepSeek-V4.1-Flash · Hugging Face", url: "https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash" },
    { label: "DeepSeek API Docs · V4.1-Flash release note", url: "https://api-docs.deepseek.com/news/news260910" },
  ],
  accent: 0xb5773f,
}, deepseekExamples);
