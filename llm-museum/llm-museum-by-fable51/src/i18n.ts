export type Locale = "zh" | "en";

/** A string that exists in both museum languages. */
export interface L {
  zh: string;
  en: string;
}

export const LOCALES: Locale[] = ["zh", "en"];

export const BCP47: Record<Locale, string> = {
  zh: "zh-TW",
  en: "en-US",
};

export const HTML_LANG: Record<Locale, string> = {
  zh: "zh-Hant",
  en: "en",
};

export function pick(text: L | string, locale: Locale): string {
  return typeof text === "string" ? text : text[locale];
}

const STORAGE_KEY = "llm-museum.locale";

export function loadLocale(): Locale {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "zh" || saved === "en") return saved;
  } catch {
    /* storage unavailable */
  }
  return "zh";
}

export function saveLocale(locale: Locale): void {
  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    /* storage unavailable */
  }
}

export const UI = {
  appTitle: { zh: "LLM 建築博物館", en: "LLM Architecture Museum" },
  appSubtitle: {
    zh: "走進大語言模型的內部，一層一層看懂它",
    en: "Step inside a large language model, one layer at a time",
  },
  overview: { zh: "全景", en: "Overview" },
  langToggle: { zh: "EN", en: "中文" },
  langToggleTitle: { zh: "Switch to English", en: "切換成中文" },
  flowOn: { zh: "資料流：開", en: "Token flow: on" },
  flowOff: { zh: "資料流：關", en: "Token flow: off" },
  loading: { zh: "正在布置展廳…", en: "Setting up the halls…" },
  hint: {
    zh: "拖曳旋轉 · 滾輪縮放 · 右鍵平移 · 點擊模組看說明",
    en: "Drag to orbit · Scroll to zoom · Right-drag to pan · Click a module to read about it",
  },
  hall: { zh: "展廳", en: "Hall" },
  hallsNav: { zh: "展廳導覽列", en: "Halls" },
  viewportLabel: { zh: "3D 博物館場景", en: "3D museum scene" },
  exhibit: { zh: "展品", en: "Exhibit" },
  keyFacts: { zh: "關鍵數據", en: "Key facts" },
  modules: { zh: "模組導覽", en: "Modules" },
  modulesHint: {
    zh: "點選 3D 模型中的任一方塊，或從下面的清單挑選。由下往上就是資料流動的順序。",
    en: "Click any block in the 3D model or pick one from the list below. Bottom to top is the order data flows.",
  },
  selectPrompt: {
    zh: "尚未選擇模組。先從左邊的全景挑一座展品開始吧。",
    en: "No module selected yet. Start by choosing an exhibit from the overview.",
  },
  exampleTitle: { zh: "本廳的範例", en: "Running example" },
  exampleInput: { zh: "輸入", en: "Input" },
  exampleOutput: { zh: "輸出", en: "Output" },
  exampleHint: {
    zh: "點選任一模組，就會看到這個範例在那一層「長什麼樣子」。",
    en: "Pick any module to see what this example looks like at that layer.",
  },
  exampleAtModule: { zh: "以範例來看，這一層做了什麼", en: "With our example: what this layer does" },
  exampleImageAlt: { zh: "範例圖片：一隻貓坐在墊子上", en: "Example picture: a cat sitting on a mat" },
  readIntro: { zh: "朗讀這座展品的介紹", en: "Read this exhibit's introduction aloud" },
  readModule: { zh: "朗讀這個模組", en: "Read this module aloud" },
  legend: { zh: "顏色圖例", en: "Colour legend" },
  legendNote: {
    zh: "外框加上「×N」代表這組方塊重複 N 次（N 層）。",
    en: "A frame marked \"×N\" means that group of blocks repeats N times (N layers).",
  },
  sources: { zh: "資料來源", en: "Sources" },
  speech: { zh: "朗讀", en: "Read aloud" },
  play: { zh: "播放", en: "Play" },
  pause: { zh: "暫停", en: "Pause" },
  resume: { zh: "繼續", en: "Resume" },
  stop: { zh: "停止", en: "Stop" },
  rate: { zh: "語速", en: "Speed" },
  voice: { zh: "語音", en: "Voice" },
  voiceAuto: { zh: "自動（依語言）", en: "Automatic (by language)" },
  speechUnsupported: {
    zh: "此瀏覽器不支援語音朗讀",
    en: "This browser does not support speech synthesis",
  },
  speechNoVoice: {
    zh: "找不到對應語言的語音，將使用瀏覽器預設語音",
    en: "No voice for this language was found; the browser default will be used",
  },
  speechSilent: {
    zh: "語音引擎沒有回應：這個裝置可能沒有安裝語音，請換個瀏覽器或裝置再試",
    en: "The speech engine did not respond: this device may have no voices installed; try another browser or device",
  },
  speechSpeaking: { zh: "朗讀中", en: "Speaking" },
  speechPaused: { zh: "已暫停", en: "Paused" },
  speechIdle: { zh: "", en: "" },
  tour: { zh: "導覽", en: "Guided tour" },
  tourStart: { zh: "開始導覽", en: "Start tour" },
  tourStop: { zh: "結束導覽", en: "End tour" },
  tourPrev: { zh: "上一站", en: "Previous" },
  tourNext: { zh: "下一站", en: "Next" },
  tourStep: { zh: "第 {i} / {n} 站", en: "Stop {i} of {n}" },
  tourIntro: { zh: "展品介紹", en: "Exhibit introduction" },
  prevModule: { zh: "上一個模組", en: "Previous module" },
  nextModule: { zh: "下一個模組", en: "Next module" },
  panelCollapse: { zh: "收合說明", en: "Hide panel" },
  panelExpand: { zh: "展開說明", en: "Show panel" },
  year: { zh: "年", en: "" },
  kindNames: {
    embedding: { zh: "嵌入", en: "Embedding" },
    position: { zh: "位置編碼", en: "Positional encoding" },
    attention: { zh: "注意力", en: "Attention" },
    norm: { zh: "正規化", en: "Normalisation" },
    residual: { zh: "殘差", en: "Residual" },
    ffn: { zh: "前饋網路", en: "Feed-forward" },
    moe: { zh: "混合專家", en: "Mixture of Experts" },
    output: { zh: "輸出", en: "Output" },
    memory: { zh: "記憶／快取", en: "Memory & cache" },
    vision: { zh: "視覺", en: "Vision" },
    spec: { zh: "推測解碼", en: "Speculative decoding" },
    io: { zh: "資料流", en: "Data flow" },
  } as Record<string, L>,
} as const;

export function format(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? ""));
}
