import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const bread = readFileSync(join(root, "src/data/bread.ts"), "utf8");
const svg = readFileSync(join(root, "src/labs/svg.ts"), "utf8");
const engine = readFileSync(join(root, "src/labs/engine.ts"), "utf8");
const chrome = readFileSync(join(root, "src/ui/chrome.ts"), "utf8");
const covid = readFileSync(join(root, "src/data/articles.ts"), "utf8");

const fail = (msg) => {
  console.error(msg);
  process.exitCode = 1;
};

if (!engine.includes("export function resolveLabTap")) fail("missing resolveLabTap");
if (!svg.includes("resolveLabTap")) fail("svg lab does not gate taps");
if (bread.includes('["east", { zh: "轉碗"')) fail("fold east still says 轉碗");
if (bread.includes('["south", { zh: "一組"')) fail("fold south still says 一組");
if (bread.includes('["west", { zh: "休息"')) fail("fold west still says 休息");
if (!bread.includes('["east", { zh: "右摺"')) fail("fold east should be 右摺");
if (bread.includes("再點蓋")) fail("uncover how still says tap the lid again");
if (!bread.includes("點右邊「揭蓋」")) fail("uncover how should name the 揭蓋 hit");
if (bread.includes("撒米糠")) fail("米糠 should be 米粉");
if (bread.includes("一間 fort") || bread.includes("想成一間 fort")) fail("fort should be 小城堡");
if (bread.includes("麵包機 knead")) fail("Chinese knead leftover");
if (bread.includes("發酵籃或布碗")) fail("布碗 should be 碗加布");
if (!bread.includes("50 g 舊種 + 50 g 粉 + 50 g 水")) fail("feed ratios need gram examples");
if (bread.includes("只要一小份就能帶菌")) fail("feed hotspot should use grams, not 一小份");
if (!bread.includes("留下 20–50 g 就能帶菌")) fail("feed hotspot should say 20–50 g");
if (!bread.includes("只算碗裡加的水")) fail("68% example should mention starter water");
if (!bread.includes("揭蓋時鍋口會噴熱蒸氣")) fail("missing steam-burn caution");
if (!chrome.includes("unit === \"bread\" ? bread : unit === \"med\" ? med")) fail("home footer should show both units");

if (!covid.includes("棘蛋白是病毒插進細胞的鑰匙，細胞上的 ACE2 是鎖")) {
  fail("ACE2/spike lock-key copy inverted or missing");
}

function resolveLabTap(id, current, alreadyDone) {
  if (id === current) return "mark";
  if (alreadyDone) return "recap";
  return "miss";
}

const cases = [
  ["lid", "score", false, "miss"],
  ["uncover", "uncover", false, "mark"],
  ["lid", "uncover", true, "recap"],
  ["east", "north", false, "miss"],
  ["east", "east", false, "mark"],
];
for (const [id, current, done, want] of cases) {
  const got = resolveLabTap(id, current, done);
  if (got !== want) fail(`resolveLabTap(${id}, ${current}, ${done}) => ${got}, want ${want}`);
}

if (!process.exitCode) console.log("sourdough QA checks passed");
