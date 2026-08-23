import {
  AutoProcessor,
  Qwen3_5ForConditionalGeneration,
  RawImage,
  TextStreamer,
  type PreTrainedModel,
  type Processor,
} from "@huggingface/transformers";

const MODEL_ID = "onnx-community/Qwen3.5-0.8B-ONNX-OPT";
const PROMPT =
  "用繁體中文寫 2 到 4 句圖片摘要：描述這隻貓的毛色、姿勢、表情與背景。不要列點。";

export type ModelBundle = {
  processor: Processor;
  model: PreTrainedModel;
  device: "webgpu" | "wasm";
};

export async function detectWebGpu(): Promise<boolean> {
  return Boolean(navigator.gpu && (await navigator.gpu.requestAdapter()));
}

export async function loadModel(
  onStatus: (message: string) => void,
): Promise<ModelBundle> {
  const preferGpu = await detectWebGpu();
  const device = preferGpu ? "webgpu" : "wasm";
  onStatus(
    preferGpu
      ? "找到 WebGPU，正在把 Qwen3.5 0.8B 載入顯存…"
      : "沒有 WebGPU，改用 WASM 載入 Qwen3.5 0.8B（會比較慢）…",
  );

  const processor = await AutoProcessor.from_pretrained(MODEL_ID);
  const model = await Qwen3_5ForConditionalGeneration.from_pretrained(MODEL_ID, {
    dtype: {
      embed_tokens: "q4",
      vision_encoder: preferGpu ? "fp16" : "q4",
      decoder_model_merged: "q4",
    },
    device,
  });

  return { processor, model, device };
}

export async function summarizeCat(
  bundle: ModelBundle,
  imageBlob: Blob,
  onToken: (text: string) => void,
): Promise<string> {
  const image = await (await RawImage.fromBlob(imageBlob)).resize(448, 448);
  const conversation = [
    {
      role: "user",
      content: [
        { type: "image" },
        { type: "text", text: PROMPT },
      ],
    },
  ];
  const text = bundle.processor.apply_chat_template(conversation, {
    add_generation_prompt: true,
  });
  const inputs = await bundle.processor(text, image);
  let streamed = "";

  const outputs = await bundle.model.generate({
    ...inputs,
    max_new_tokens: 160,
    temperature: 0.7,
    top_p: 0.8,
    streamer: new TextStreamer(bundle.processor.tokenizer, {
      skip_prompt: true,
      skip_special_tokens: true,
      callback_function: (piece: string) => {
        streamed += piece;
        onToken(streamed.trim());
      },
    }),
  });

  const decoded = bundle.processor.batch_decode(
    outputs.slice(null, [inputs.input_ids.dims.at(-1), null]),
    { skip_special_tokens: true },
  );
  return String(decoded[0] ?? streamed).trim();
}
