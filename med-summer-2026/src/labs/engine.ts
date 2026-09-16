import { findArticle } from "../data/catalog";
import { prefs } from "../store";
import type { Copy } from "../types";

export type Point = { x: number; y: number };

export type LabState = {
  hover: string | null;
  selected: string | null;
  flags: Record<string, number>;
  drag: { id: string; x: number; y: number } | null;
  missAt: number;
};

export type Coach = {
  x: number;
  y: number;
  kind: "tap" | "drag" | "drop";
  zh: string;
  en: string;
};

export type LabApi = {
  draw: (ctx: CanvasRenderingContext2D, state: LabState, t: number) => void;
  hit: (p: Point, state: LabState) => string | null;
  down?: (id: string, p: Point, state: LabState) => void;
  move?: (p: Point, state: LabState) => void;
  up?: (p: Point, state: LabState) => void;
  done: (state: LabState) => Record<string, boolean>;
  coach: (state: LabState, t: number) => Coach | null;
};

export function copyText(copy: Copy): string {
  if (prefs.lang === "en") return copy.en;
  if (prefs.lang === "zh") return copy.zh;
  return `${copy.zh} · ${copy.en}`;
}

export function L(zh: string, en: string): string {
  return copyText({ zh, en });
}

export function hitCircle(p: Point, c: Point, r: number): boolean {
  const dx = p.x - c.x;
  const dy = p.y - c.y;
  return dx * dx + dy * dy <= r * r;
}

export function hitRect(p: Point, x: number, y: number, w: number, h: number): boolean {
  return p.x >= x && p.x <= x + w && p.y >= y && p.y <= y + h;
}

export function pointerOnCanvas(canvas: HTMLCanvasElement, event: PointerEvent): Point {
  const rect = canvas.getBoundingClientRect();
  const sx = canvas.width / rect.width;
  const sy = canvas.height / rect.height;
  return { x: (event.clientX - rect.left) * sx, y: (event.clientY - rect.top) * sy };
}

export function paintLab(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = "#1c1c1c";
  ctx.lineWidth = 1;
  for (let x = 40; x < w; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 40; y < h; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
}

export function label(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, active = false): void {
  ctx.font = "13px Geist, ui-sans-serif, sans-serif";
  ctx.fillStyle = active ? "#fff" : "#b4b4b4";
  ctx.fillText(text, x, y);
}

export function nameAt(
  ctx: CanvasRenderingContext2D,
  zh: string,
  en: string,
  x: number,
  y: number,
  active = false,
): void {
  label(ctx, L(zh, en), x, y, active);
}

export function glowCircle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  active: boolean,
): void {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.strokeStyle = active ? "#fff" : "#6a6a6a";
  ctx.lineWidth = active ? 2.4 : 1.4;
  ctx.stroke();
  if (active) {
    ctx.beginPath();
    ctx.arc(x, y, r + 7, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255,255,255,0.25)";
    ctx.stroke();
  }
}

export function dashedCircle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  t: number,
): void {
  ctx.save();
  ctx.setLineDash([7, 7]);
  ctx.lineDashOffset = -t / 80;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(255,255,255,0.55)";
  ctx.lineWidth = 1.6;
  ctx.stroke();
  ctx.restore();
}

export function pulseRing(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  t: number,
): void {
  const extra = 6 + Math.sin(t / 180) * 5;
  ctx.beginPath();
  ctx.arc(x, y, r + extra, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(255,255,255,0.35)";
  ctx.lineWidth = 2;
  ctx.stroke();
}

export function badge(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
): void {
  ctx.font = "12px Geist, ui-sans-serif, sans-serif";
  const w = Math.min(ctx.measureText(text).width + 16, 320);
  ctx.fillStyle = "#fff";
  roundRectPath(ctx, x, y, w, 22, 3);
  ctx.fill();
  ctx.fillStyle = "#111";
  ctx.fillText(text, x + 8, y + 15);
}

export function drawCoachMark(ctx: CanvasRenderingContext2D, coach: Coach, t: number): void {
  pulseRing(ctx, coach.x, coach.y, 28, t);
  const verbZh = coach.kind === "drag" ? "拖我" : coach.kind === "drop" ? "放這裡" : "點我";
  const verbEn = coach.kind === "drag" ? "Drag me" : coach.kind === "drop" ? "Drop here" : "Tap me";
  const lines =
    prefs.lang === "en"
      ? [`${verbEn} · ${coach.en}`]
      : prefs.lang === "zh"
        ? [`${verbZh} · ${coach.zh}`]
        : [`${verbZh} · ${coach.zh}`, `${verbEn} · ${coach.en}`];
  ctx.font = "12px Geist, ui-sans-serif, sans-serif";
  const bw = Math.min(Math.max(...lines.map((line) => ctx.measureText(line).width)) + 16, 300);
  const bh = lines.length * 16 + 8;
  const badgeX = coach.x > 700 ? coach.x - bw - 20 : coach.x + 36;
  const badgeY = Math.max(90, Math.min(470 - bh, coach.y - 36));
  ctx.fillStyle = "#fff";
  roundRectPath(ctx, badgeX, badgeY, bw, bh, 3);
  ctx.fill();
  ctx.fillStyle = "#111";
  lines.forEach((line, i) => {
    ctx.fillText(line, badgeX + 8, badgeY + 16 + i * 16);
  });
  if (coach.kind === "drag" || coach.kind === "drop") {
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(coach.x + (coach.x > 700 ? -18 : 22), coach.y - 8);
    ctx.lineTo(badgeX + (coach.x > 700 ? bw : 12), badgeY + 11);
    ctx.stroke();
  }
}

export function drawMission(
  ctx: CanvasRenderingContext2D,
  w: number,
  title: string,
  next: string,
): void {
  ctx.fillStyle = "rgba(0,0,0,0.78)";
  ctx.fillRect(16, 12, w - 32, 62);
  ctx.strokeStyle = "#333";
  ctx.strokeRect(16, 12, w - 32, 62);
  ctx.fillStyle = "#8d8d8d";
  ctx.font = "11px Geist, ui-sans-serif, sans-serif";
  ctx.fillText(L("這堂在學 / LESSON", "LESSON"), 28, 30);
  ctx.fillStyle = "#fff";
  ctx.font = "600 15px Geist, ui-sans-serif, sans-serif";
  ctx.fillText(ellipsize(ctx, title, w - 70), 28, 48);
  ctx.fillStyle = "#d7d7d7";
  ctx.font = "12px Geist, ui-sans-serif, sans-serif";
  ctx.fillText(ellipsize(ctx, next, w - 70), 28, 66);
}

export function drawLegend(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  ctx.fillStyle = "rgba(0,0,0,0.62)";
  ctx.fillRect(16, h - 34, w - 32, 22);
  ctx.fillStyle = "#c4c4c4";
  ctx.font = "11px Geist, ui-sans-serif, sans-serif";
  ctx.fillText(
    L("白圈／標籤＝可點　虛線圈＝拖進去　箭頭＝請拖曳", "Glow = tap   Dashed ring = drop   Arrow = drag"),
    26,
    h - 19,
  );
}

export function drawY(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  on: boolean,
): void {
  ctx.strokeStyle = on ? "#fff" : "#cfcfcf";
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x - 16, y - 28);
  ctx.moveTo(x, y);
  ctx.lineTo(x + 16, y - 28);
  ctx.moveTo(x, y);
  ctx.lineTo(x, y + 18);
  ctx.stroke();
}

export function drawVirus(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  spikes = 8,
): void {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 1.4;
  for (let i = 0; i < spikes; i += 1) {
    const a = (i / spikes) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
    ctx.lineTo(x + Math.cos(a) * (r + 9), y + Math.sin(a) * (r + 9));
    ctx.stroke();
  }
}

export function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function fillRound(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  color: string,
): void {
  ctx.fillStyle = color;
  roundRectPath(ctx, x, y, w, h, r);
  ctx.fill();
}

export function currentStep(stepIds: string[], done: Record<string, boolean>): string | null {
  return stepIds.find((id) => !done[id]) ?? null;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function setNote(box: HTMLElement, title: Copy, body: Copy): void {
  if (prefs.lang === "en") {
    box.innerHTML = `<b lang="en">${escapeHtml(title.en)}</b><p lang="en">${escapeHtml(body.en)}</p>`;
    return;
  }
  if (prefs.lang === "zh") {
    box.innerHTML = `<b lang="zh">${escapeHtml(title.zh)}</b><p lang="zh">${escapeHtml(body.zh)}</p>`;
    return;
  }
  box.innerHTML = `<b lang="zh">${escapeHtml(title.zh)}</b><p lang="zh">${escapeHtml(body.zh)}</p><b lang="en">${escapeHtml(title.en)}</b><p lang="en">${escapeHtml(body.en)}</p>`;
}

export function articleBySlug(slug: string) {
  return findArticle(slug);
}

export function wrapLabel(
  ctx: CanvasRenderingContext2D,
  zh: string,
  en: string,
  x: number,
  y: number,
  maxW = 150,
  active = false,
): void {
  ctx.font = "12px Geist, ui-sans-serif, sans-serif";
  const zhLines = prefs.lang === "en" ? [] : wrapLines(ctx, zh, maxW, 2);
  const enLines = prefs.lang === "zh" ? [] : wrapLines(ctx, en, maxW, 2);
  const lines = [...zhLines.map((line) => ({ line, dim: false })), ...enLines.map((line) => ({ line, dim: prefs.lang === "both" }))];
  const w = Math.min(maxW, Math.max(40, ...lines.map((item) => ctx.measureText(item.line).width)) + 16);
  const h = lines.length * 16 + 10;
  ctx.fillStyle = "rgba(0,0,0,0.72)";
  roundRectPath(ctx, x, y, w, h, 3);
  ctx.fill();
  lines.forEach((item, i) => {
    ctx.fillStyle = item.dim ? "#9a9a9a" : active ? "#fff" : "#c4c4c4";
    ctx.fillText(item.line, x + 8, y + 18 + i * 16);
  });
}

export function leaderLine(
  ctx: CanvasRenderingContext2D,
  ax: number,
  ay: number,
  lx: number,
  ly: number,
  zh: string,
  en: string,
  active = false,
): void {
  ctx.fillStyle = active ? "#fff" : "#9a9a9a";
  ctx.beginPath();
  ctx.arc(ax, ay, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#9a9a9a";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(ax, ay);
  if (Math.abs(lx - ax) > Math.abs(ly - ay)) {
    ctx.lineTo(lx, ay);
    ctx.lineTo(lx, ly + 10);
  } else {
    ctx.lineTo(ax, ly + 10);
    ctx.lineTo(lx, ly + 10);
  }
  ctx.stroke();
  wrapLabel(ctx, zh, en, lx, ly, 148, active);
}

export function dropZone(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  t: number,
  zh: string,
  en: string,
): void {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.fill();
  dashedCircle(ctx, x, y, r, t);
  wrapLabel(ctx, `放這裡｜${zh}`, `Drop · ${en}`, x - 48, y + r + 6, 140, true);
}

export function drawArrow(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color = "rgba(255,255,255,0.7)",
): void {
  const a = Math.atan2(y2 - y1, x2 - x1);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - 10 * Math.cos(a - 0.4), y2 - 10 * Math.sin(a - 0.4));
  ctx.lineTo(x2 - 10 * Math.cos(a + 0.4), y2 - 10 * Math.sin(a + 0.4));
  ctx.closePath();
  ctx.fill();
}

export function organelleFill(
  ctx: CanvasRenderingContext2D,
  kind: "cytoplasm" | "membrane" | "nucleus" | "ribosome" | "lymphocyte" | "tumor" | "rbc" | "astrocyte",
  x: number,
  y: number,
  r: number,
  extra?: { ry?: number; sickle?: boolean },
): void {
  const ry = extra?.ry ?? r;
  if (kind === "cytoplasm") {
    ctx.beginPath();
    ctx.ellipse(x, y, r, ry, 0, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.06)";
    ctx.fill();
    for (let i = 0; i < 28; i += 1) {
      const a = (i / 28) * Math.PI * 2;
      ctx.fillStyle = "rgba(255,255,255,0.12)";
      ctx.fillRect(x + Math.cos(a) * r * 0.55, y + Math.sin(a) * ry * 0.5, 1.2, 1.2);
    }
    return;
  }
  if (kind === "membrane") {
    ctx.strokeStyle = "#ececec";
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.ellipse(x, y, r, ry, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255,0.28)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(x, y, r + 6, ry + 6, 0, 0, Math.PI * 2);
    ctx.stroke();
    return;
  }
  if (kind === "nucleus") {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = "#161616";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y, r * 0.62, 0, Math.PI * 2);
    ctx.fillStyle = "#242424";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y, r * 0.28, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.strokeStyle = "#888";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
    return;
  }
  if (kind === "ribosome") {
    ctx.fillStyle = "#d9d9d9";
    ctx.beginPath();
    ctx.arc(x - 8, y - 4, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 8, y + 6, r * 0.72, 0, Math.PI * 2);
    ctx.fill();
    return;
  }
  if (kind === "lymphocyte") {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = "#2a2a2a";
    ctx.fill();
    ctx.strokeStyle = "#ddd";
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y, r * 0.62, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    return;
  }
  if (kind === "tumor") {
    ctx.fillStyle = "#1a1a1a";
    ctx.beginPath();
    ctx.ellipse(x - 16, y - 12, r * 0.62, r * 0.5, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + 18, y + 8, r * 0.55, r * 0.46, 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y, r * 0.72, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#777";
    ctx.stroke();
    return;
  }
  if (kind === "rbc") {
    ctx.strokeStyle = "#ddd";
    ctx.lineWidth = 2.2;
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.beginPath();
    if (extra?.sickle) ctx.ellipse(x, y, r + 10, r * 0.42, 0.55, 0, Math.PI * 2);
    else ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    if (!extra?.sickle) {
      ctx.beginPath();
      ctx.arc(x, y, r * 0.42, 0, Math.PI * 2);
      ctx.strokeStyle = "#666";
      ctx.stroke();
    }
    return;
  }
  ctx.strokeStyle = "#fff";
  for (let i = 0; i < 6; i += 1) {
    const a = (i / 6) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + Math.cos(a) * r * 0.45, y + Math.sin(a) * r * 0.45, x + Math.cos(a) * r, y + Math.sin(a) * r);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x + Math.cos(a) * r, y + Math.sin(a) * r, 5, 0, Math.PI * 2);
    ctx.fillStyle = "#2a2a2a";
    ctx.fill();
  }
  ctx.beginPath();
  ctx.ellipse(x, y, 22, 16, 0, 0, Math.PI * 2);
  ctx.fillStyle = "#1c1c1c";
  ctx.fill();
  ctx.strokeStyle = "#fff";
  ctx.stroke();
}

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxW: number, maxLines = 3): string[] {
  if (ctx.measureText(text).width <= maxW) return [text];
  const chars = [...text];
  const lines: string[] = [];
  let cur = "";
  chars.forEach((ch) => {
    const next = `${cur}${ch}`;
    if (ctx.measureText(next).width > maxW && cur) {
      lines.push(cur);
      cur = ch;
    } else cur = next;
  });
  if (cur) lines.push(cur);
  return lines.slice(0, maxLines);
}

function ellipsize(ctx: CanvasRenderingContext2D, text: string, max: number): string {
  if (ctx.measureText(text).width <= max) return text;
  let cut = text;
  while (cut.length > 1 && ctx.measureText(`${cut}…`).width > max) {
    cut = cut.slice(0, -1);
  }
  return `${cut}…`;
}
