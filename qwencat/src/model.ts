import {
  AutoProcessor,
  Qwen3_5ForConditionalGeneration,
  RawImage,
  TextStreamer,
  env,
  type PreTrainedModel,
  type Processor,
} from "@huggingface/transformers";

const MODEL_ID = "onnx-community/Qwen3.5-0.8B-ONNX-OPT";
const PROMPT =
  "用繁體中文寫 2 到 4 句圖片摘要：描述這隻貓的毛色、姿勢、表情與背景。不要列點。";

type DtypeMap = {
  embed_tokens: "q4" | "q4f16" | "q8" | "fp32";
  vision_encoder: "q4" | "q4f16" | "q8" | "fp16" | "fp32";
  decoder_model_merged: "q4" | "q4f16" | "q8";
};

export type ModelBundle = {
  processor: Processor;
  model: PreTrainedModel;
  device: "webgpu";
  dtype: DtypeMap;
};

export type WebGpuInfo = {
  available: boolean;
  workgroupStorage: number;
  detectedWorkgroupStorage: number;
  shaderF16: boolean;
  vendor: string;
  device: string;
};

// ORT 1.30 Flash Attention for head_dim=256 uses max_k_step=16:
// k_tile + v_tile = 2 * 2 bytes * 256 * 16 = 16KB. Qualcomm o_tile can add ~16KB.
// We cannot shrink C++ tiles from JS, so refuse devices below 32KB before downloading.
export const MIN_GQA_WORKGROUP_STORAGE = 32 * 1024;

export function formatBytes(bytes: number): string {
  if (bytes <= 0) {
    return "0 bytes";
  }
  const kb = bytes / 1024;
  return Number.isInteger(kb) ? `${kb} KB（${bytes} bytes）` : `${kb.toFixed(1)} KB（${bytes} bytes）`;
}

function workgroupOverride(): number | null {
  const raw = Number(new URLSearchParams(window.location.search).get("forceWorkgroup"));
  return Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : null;
}

export async function probeWebGpu(): Promise<WebGpuInfo> {
  if (!navigator.gpu) {
    return {
      available: false,
      workgroupStorage: 0,
      detectedWorkgroupStorage: 0,
      shaderF16: false,
      vendor: "",
      device: "",
    };
  }
  const adapter =
    (await navigator.gpu.requestAdapter()) ??
    (await navigator.gpu.requestAdapter({ forceFallbackAdapter: true }));
  if (!adapter) {
    return {
      available: false,
      workgroupStorage: 0,
      detectedWorkgroupStorage: 0,
      shaderF16: false,
      vendor: "",
      device: "",
    };
  }
  const info = "info" in adapter ? adapter.info : undefined;
  const detected = adapter.limits.maxComputeWorkgroupStorageSize;
  const override = workgroupOverride();
  return {
    available: true,
    workgroupStorage: override ?? detected,
    detectedWorkgroupStorage: detected,
    shaderF16: adapter.features.has("shader-f16"),
    vendor: info?.vendor ?? "",
    device: info?.device ?? "",
  };
}

export function qwenUnsupportedReason(gpu: WebGpuInfo): string | null {
  if (!gpu.available) {
    return "這台裝置沒有 WebGPU。Qwen3.5 只能走 WebGPU，因此這個網頁不支援。";
  }
  if (gpu.workgroupStorage < MIN_GQA_WORKGROUP_STORAGE) {
    const who = [gpu.vendor, gpu.device].filter(Boolean).join(" ");
    return (
      `偵測到這台裝置的 WebGPU 工作組記憶體上限是 ${formatBytes(gpu.workgroupStorage)}` +
      `${who ? `（${who}）` : ""}。` +
      `Qwen3.5 的注意力核至少需要 ${formatBytes(MIN_GQA_WORKGROUP_STORAGE)}，` +
      `這個上限沒辦法從網頁再往下調，因此這個網頁不支援這台裝置。`
    );
  }
  return null;
}

export async function detectWebGpu(): Promise<boolean> {
  return (await probeWebGpu()).available;
}

export function friendlyOrtError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  if (/workgroup storage|GroupQueryAttention/i.test(message)) {
    return (
      "推理時 WebGPU 工作組記憶體仍不夠（GroupQueryAttention）。" +
      "這個網頁不支援這台裝置，請改用電腦 Chrome 或工作組記憶體更大的手機。"
    );
  }
  return message;
}

async function hasShaderF16(): Promise<boolean> {
  return (await probeWebGpu()).shaderF16;
}

function maxNewTokens(): number {
  const raw = Number(new URLSearchParams(window.location.search).get("maxTokens"));
  if (Number.isFinite(raw) && raw > 0) {
    return Math.min(Math.floor(raw), 512);
  }
  return 160;
}

function dtypeTries(fp16: boolean): DtypeMap[] {
  const tries: DtypeMap[] = [];
  // Official ONNX repo has no FP4/q2. Smallest published packs are q4f16 / q4.
  if (fp16) {
    tries.push({
      embed_tokens: "q4f16",
      vision_encoder: "q4f16",
      decoder_model_merged: "q4f16",
    });
  }
  tries.push(
    {
      embed_tokens: "q4",
      vision_encoder: "q4",
      decoder_model_merged: "q4",
    },
    {
      embed_tokens: "q4",
      vision_encoder: "q8",
      decoder_model_merged: "q4",
    },
  );
  return tries;
}

function formatError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export async function loadModel(
  onStatus: (message: string) => void,
  gpu?: WebGpuInfo,
): Promise<ModelBundle> {
  const info = gpu ?? (await probeWebGpu());
  const blocked = qwenUnsupportedReason(info);
  if (blocked) {
    throw new Error(blocked);
  }

  const processor = await AutoProcessor.from_pretrained(MODEL_ID);
  const fp16 = await hasShaderF16();
  const errors: string[] = [];
  const ortVersion = env.backends?.onnx?.versions?.web ?? "unknown";

  for (const dtype of dtypeTries(fp16)) {
    onStatus(
      `ORT ${ortVersion} / 4-bit，正在載入 Qwen3.5 0.8B（embed=${dtype.embed_tokens} vision=${dtype.vision_encoder} decoder=${dtype.decoder_model_merged}）…`,
    );
    try {
      const model = await Qwen3_5ForConditionalGeneration.from_pretrained(MODEL_ID, {
        dtype,
        device: "webgpu",
      });
      return { processor, model, device: "webgpu", dtype };
    } catch (error) {
      errors.push(`${dtype.vision_encoder}: ${formatError(error)}`);
      onStatus(`這組精度載入失敗，改試下一組…`);
    }
  }

  throw new Error(`WebGPU 載入 Qwen3.5 失敗：${errors.join(" | ")}`);
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
    max_new_tokens: maxNewTokens(),
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
