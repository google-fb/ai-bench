import { articles } from "../data/articles";
import { prefs } from "../store";
import type { Copy } from "../types";

export type Point = { x: number; y: number };

export type LabState = {
  hover: string | null;
  selected: string | null;
  flags: Record<string, number>;
  drag: { id: string; x: number; y: number } | null;
};

export function copyText(copy: Copy): string {
  return prefs.lang === "en" ? copy.en : copy.zh;
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

export function paintLab(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
): void {
  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = "#222";
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

export function label(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  active = false,
): void {
  ctx.font = "13px Geist, ui-sans-serif, sans-serif";
  ctx.fillStyle = active ? "#fff" : "#9a9a9a";
  ctx.fillText(text, x, y);
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

export function setNote(
  box: HTMLElement,
  title: string,
  body: string,
): void {
  box.innerHTML = `<b>${title}</b><p>${body}</p>`;
}

export function articleBySlug(slug: string) {
  return articles.find((item) => item.slug === slug);
}
