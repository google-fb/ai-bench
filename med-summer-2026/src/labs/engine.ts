import { articles } from "../data/articles";
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
  return prefs.lang === "en" ? copy.en : copy.zh;
}

export function L(zh: string, en: string): string {
  return prefs.lang === "en" ? en : zh;
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
  const w = Math.min(ctx.measureText(text).width + 16, 280);
  ctx.fillStyle = "#fff";
  roundRectPath(ctx, x, y, w, 22, 3);
  ctx.fill();
  ctx.fillStyle = "#111";
  ctx.fillText(text, x + 8, y + 15);
}

export function drawCoachMark(ctx: CanvasRenderingContext2D, coach: Coach, t: number): void {
  pulseRing(ctx, coach.x, coach.y, 28, t);
  const verb =
    coach.kind === "drag"
      ? L("拖我", "Drag me")
      : coach.kind === "drop"
        ? L("放這裡", "Drop here")
        : L("點我", "Tap me");
  badge(ctx, `${verb} · ${L(coach.zh, coach.en)}`, coach.x + 36, coach.y - 36);
  if (coach.kind === "drag" || coach.kind === "drop") {
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(coach.x + 22, coach.y - 8);
    ctx.lineTo(coach.x + 48, coach.y - 18);
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

export function setNote(box: HTMLElement, title: string, body: string): void {
  box.innerHTML = `<b>${title}</b><p>${body}</p>`;
}

export function articleBySlug(slug: string) {
  return articles.find((item) => item.slug === slug);
}

function ellipsize(ctx: CanvasRenderingContext2D, text: string, max: number): string {
  if (ctx.measureText(text).width <= max) return text;
  let cut = text;
  while (cut.length > 1 && ctx.measureText(`${cut}…`).width > max) {
    cut = cut.slice(0, -1);
  }
  return `${cut}…`;
}
