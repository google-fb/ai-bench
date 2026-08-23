import { fetchCatPhoto, type CatPhoto } from "./cats";
import { detectWebGpu, loadModel, summarizeCat, type ModelBundle } from "./model";

const imageEl = document.querySelector<HTMLImageElement>("#cat-image")!;
const catCaptionEl = document.querySelector<HTMLElement>("#cat-caption")!;
const devicePill = document.querySelector<HTMLElement>("#device-pill")!;
const modelPill = document.querySelector<HTMLElement>("#model-pill")!;
const intervalEl = document.querySelector<HTMLSelectElement>("#interval")!;
const refreshBtn = document.querySelector<HTMLButtonElement>("#refresh")!;
const countdownEl = document.querySelector<HTMLElement>("#countdown")!;
const statusEl = document.querySelector<HTMLElement>("#summary-status")!;
const summaryEl = document.querySelector<HTMLElement>("#summary-text")!;

let bundle: ModelBundle | null = null;
let currentPhoto: CatPhoto | null = null;
let busy = false;
let deadline = 0;
let timer = 0;

function setStatus(message: string) {
  statusEl.textContent = message;
}

function intervalMs() {
  return Number(intervalEl.value) || 25000;
}

function scheduleNext() {
  deadline = Date.now() + intervalMs();
}

function tickCountdown() {
  if (!deadline) {
    countdownEl.textContent = "—";
    return;
  }
  const remain = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
  countdownEl.textContent = busy ? "推理中，下一張會等這輪結束" : `${remain} 秒後換圖`;
  if (!busy && remain <= 0) {
    void cyclePhoto("timer");
  }
}

async function describeCurrent() {
  if (!bundle || !currentPhoto) {
    return;
  }
  setStatus("模型正在看這張貓…");
  summaryEl.textContent = "";
  try {
    const text = await summarizeCat(bundle, currentPhoto.blob, (partial) => {
      summaryEl.textContent = partial;
    });
    summaryEl.textContent = text;
    summaryEl.dataset.state = "done";
    setStatus("摘要完成。下一張照片到了會再看一次。");
  } catch (error) {
    summaryEl.dataset.state = "error";
    setStatus(error instanceof Error ? error.message : "推理失敗");
  }
}

async function cyclePhoto(reason: "timer" | "manual") {
  if (busy) {
    return;
  }
  busy = true;
  refreshBtn.disabled = true;
  try {
    catCaptionEl.textContent =
      reason === "manual" ? "手動換圖，正在呼叫 Cat API…" : "時間到，正在呼叫 Cat API…";
    const photo = await fetchCatPhoto();
    if (currentPhoto) {
      URL.revokeObjectURL(currentPhoto.objectUrl);
    }
    currentPhoto = photo;
    imageEl.src = photo.objectUrl;
    catCaptionEl.textContent = `來源 ${photo.sourceUrl}`;
    await describeCurrent();
  } catch (error) {
    catCaptionEl.textContent =
      error instanceof Error ? error.message : "抓貓圖失敗";
  } finally {
    busy = false;
    refreshBtn.disabled = false;
    scheduleNext();
  }
}

async function boot() {
  if (new URLSearchParams(window.location.search).has("skipModel")) {
    devicePill.textContent = "略過模型";
    modelPill.textContent = "未載入 · 測抓圖";
    setStatus("略過模型載入，只測 Cat API / CORS proxy。");
    await cyclePhoto("manual");
    return;
  }

  const hasGpu = await detectWebGpu();
  devicePill.textContent = hasGpu ? "WebGPU 可用" : "WebGPU 不可用 · WASM";
  try {
    bundle = await loadModel(setStatus);
    modelPill.textContent = `Qwen3.5 0.8B · ${bundle.device} · ${bundle.dtype.embed_tokens}/${bundle.dtype.vision_encoder}/${bundle.dtype.decoder_model_merged}`;
    setStatus("模型就緒，開始抓第一張貓。");
    await cyclePhoto("manual");
  } catch (error) {
    modelPill.textContent = "模型載入失敗";
    setStatus(error instanceof Error ? error.message : "模型載入失敗");
  }
}

refreshBtn.addEventListener("click", () => {
  void cyclePhoto("manual");
});
intervalEl.addEventListener("change", () => {
  if (!busy) {
    scheduleNext();
  }
});

timer = window.setInterval(tickCountdown, 250);
void boot();

window.addEventListener("beforeunload", () => {
  window.clearInterval(timer);
  if (currentPhoto) {
    URL.revokeObjectURL(currentPhoto.objectUrl);
  }
});
