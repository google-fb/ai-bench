export type LoadPhase = "idle" | "download" | "compile" | "done" | "error";
export type LoadStage = "prepare" | "processor" | "weights" | "compile";

export type LoadProgress = {
  phase: LoadPhase;
  stage: LoadStage;
  percent: number | null;
  label: string;
  detail: string;
  loadedBytes: number;
  totalBytes: number;
  file?: string;
};

/** Subset of `@huggingface/transformers` ProgressInfo we actually read. */
export type HubProgressInfo = {
  status?: string;
  name?: string;
  file?: string;
  progress?: number;
  loaded?: number;
  total?: number;
  files?: Record<string, { loaded: number; total: number }>;
};

export function formatDataSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 B";
  }
  if (bytes < 1024) {
    return `${Math.round(bytes)} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function shortFileName(path: string): string {
  const parts = path.split("/").filter(Boolean);
  return parts.at(-1) || path;
}

function percentFrom(loaded: number, total: number, reported?: number): number | null {
  if (typeof reported === "number" && Number.isFinite(reported) && reported >= 0) {
    return Math.min(100, Math.max(0, Math.round(reported)));
  }
  if (total > 0) {
    return Math.min(100, Math.round((loaded / total) * 100));
  }
  return null;
}

const WEIGHTS_PERCENT_MIN_BYTES = 10 * 1024 * 1024;

export function createLoadProgressTracker(onProgress: (progress: LoadProgress) => void) {
  const files = new Map<string, { loaded: number; total: number }>();
  let stage: LoadStage = "prepare";
  let sawAggregateTotal = false;

  function totals() {
    let loaded = 0;
    let total = 0;
    let unknown = files.size === 0;
    for (const file of files.values()) {
      loaded += file.loaded;
      if (file.total > 0) {
        total += file.total;
      } else {
        unknown = true;
      }
    }
    return { loaded, total, unknown };
  }

  function emit(progress: Omit<LoadProgress, "stage"> & { stage?: LoadStage }) {
    onProgress({ ...progress, stage: progress.stage ?? stage });
  }

  function emitDownload(opts: {
    loaded?: number;
    total?: number;
    percent?: number | null;
    file?: string;
    label?: string;
  }) {
    const summed = totals();
    const loaded = opts.loaded ?? summed.loaded;
    const total = opts.total ?? summed.total;
    const file = opts.file ? shortFileName(opts.file) : undefined;
    const size =
      total > 0
        ? `${formatDataSize(loaded)} / ${formatDataSize(total)}`
        : loaded > 0
          ? `已下載 ${formatDataSize(loaded)}`
          : "正在向 Hugging Face 查檔案大小";

    if (stage === "processor") {
      emit({
        phase: "download",
        percent: null,
        label: opts.label ?? "正在下載 tokenizer / processor…",
        detail: file
          ? `${file} · ${size}。這段只有小檔，600–700 MB 權重還在後面。`
          : "先下載設定檔與 tokenizer，主權重還在後面。",
        loadedBytes: loaded,
        totalBytes: total,
        file,
      });
      return;
    }

    const canShowPercent = sawAggregateTotal || total >= WEIGHTS_PERCENT_MIN_BYTES;
    const percent = canShowPercent
      ? opts.percent !== undefined
        ? opts.percent
        : percentFrom(loaded, total)
      : null;
    const weightsComplete =
      canShowPercent &&
      percent !== null &&
      percent >= 100 &&
      total > 0 &&
      loaded >= total;
    emit({
      phase: weightsComplete ? "compile" : "download",
      percent: weightsComplete ? 100 : percent,
      label:
        opts.label ??
        (weightsComplete
          ? "下載完成，正在編譯 WebGPU session…"
          : percent !== null
            ? `下載模型權重 ${percent}%`
            : "正在下載模型權重…"),
      detail: file
        ? `${size} · ${file}`
        : canShowPercent
          ? size
          : `${size}。還在收集完整權重清單。`,
      loadedBytes: loaded,
      totalBytes: total,
      file,
    });
  }

  function handleHub(info: HubProgressInfo) {
    const file = info.file;

    if (info.status === "progress_total") {
      sawAggregateTotal = true;
      if (info.files) {
        for (const [name, part] of Object.entries(info.files)) {
          files.set(name, { loaded: part.loaded, total: part.total });
        }
      }
      emitDownload({
        loaded: info.loaded,
        total: info.total,
        percent: percentFrom(info.loaded ?? 0, info.total ?? 0, info.progress),
        file,
      });
      return;
    }

    if (info.status === "initiate" || info.status === "download") {
      if (file && !files.has(file)) {
        files.set(file, { loaded: 0, total: info.total ?? 0 });
      }
      emitDownload({
        file,
        label: file ? `開始下載 ${shortFileName(file)}` : "開始下載模型…",
      });
      return;
    }

    if (info.status === "progress") {
      if (file) {
        files.set(file, { loaded: info.loaded ?? 0, total: info.total ?? 0 });
      }
      emitDownload({ file });
      return;
    }

    if (info.status === "done") {
      if (file) {
        const prev = files.get(file) ?? { loaded: 0, total: 0 };
        const total = prev.total || info.total || prev.loaded;
        files.set(file, { loaded: total, total });
      }
      emitDownload({
        file,
        label: file ? `已下載 ${shortFileName(file)}` : "檔案下載完成",
      });
      return;
    }

    if (info.status === "ready" && stage === "weights") {
      setCompile();
    }
  }

  function beginStage(next: "processor" | "weights", label?: string) {
    files.clear();
    sawAggregateTotal = false;
    stage = next;
    emit({
      phase: "download",
      percent: null,
      label:
        label ??
        (next === "processor"
          ? "正在下載 tokenizer / processor…"
          : "正在下載模型權重…"),
      detail:
        next === "processor"
          ? "先下載設定檔與 tokenizer。主權重約 600–700 MB，會在下一步顯示百分比。"
          : "正在向 Hugging Face 查 ONNX 檔案大小，百分比以這一批權重為準。",
      loadedBytes: 0,
      totalBytes: 0,
    });
  }

  function setPrepare(label = "正在準備下載清單…") {
    stage = "prepare";
    emit({
      phase: "download",
      percent: null,
      label,
      detail: "先向 Hugging Face 查 tokenizer 與 ONNX 檔案大小，接著才會開始下載。",
      loadedBytes: 0,
      totalBytes: 0,
    });
  }

  function setCompile(label = "正在編譯 WebGPU session…") {
    stage = "compile";
    const { loaded, total } = totals();
    emit({
      phase: "compile",
      percent: total > 0 ? 100 : null,
      label,
      detail: "權重已就緒，正在建立 GPU 計算圖。這段不會再跳百分比，請不要關掉分頁。",
      loadedBytes: loaded,
      totalBytes: total,
    });
  }

  function setDone() {
    const { loaded, total } = totals();
    emit({
      phase: "done",
      percent: 100,
      label: "模型就緒",
      detail: "",
      loadedBytes: loaded,
      totalBytes: total,
    });
  }

  function setError(message: string) {
    const { loaded, total } = totals();
    emit({
      phase: "error",
      percent: null,
      label: "模型載入失敗",
      detail: message,
      loadedBytes: loaded,
      totalBytes: total,
    });
  }

  return { handleHub, beginStage, setPrepare, setCompile, setDone, setError };
}
