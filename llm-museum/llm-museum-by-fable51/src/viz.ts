import type { BarItem, HeatRow, TokenChip, Viz } from "./content/types.ts";
import type { Locale } from "./i18n.ts";

const PAPER = [250, 245, 236] as const;
const WARM = [196, 121, 90] as const; // terracotta for positive values
const COOL = [127, 149, 163] as const; // slate for negative values

function mix(a: readonly number[], b: readonly number[], t: number): string {
  const k = Math.min(1, Math.max(0, t));
  const c = a.map((v, i) => Math.round(v + ((b[i] ?? v) - v) * k));
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
}

/** Colour for a value in [-1, 1]: warm for positive, cool for negative, paper for zero. */
export function heatColor(value: number): string {
  if (value >= 0) return mix(PAPER, WARM, value);
  return mix(PAPER, COOL, -value);
}

function el<K extends keyof HTMLElementTagNameMap>(tag: K, className?: string, text?: string): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function caption(text: string | undefined): HTMLElement | null {
  return text ? el("p", "viz-caption", text) : null;
}

function renderStrip(values: number[]): HTMLElement {
  const strip = el("span", "chip-strip");
  for (const v of values) {
    const cell = el("i");
    cell.style.background = heatColor(v);
    cell.title = v.toFixed(2);
    strip.append(cell);
  }
  return strip;
}

function renderTokens(tokens: TokenChip[], cap?: string): HTMLElement {
  const wrap = el("div", "viz viz-tokens");
  const row = el("div", "chip-row");
  for (const token of tokens) {
    const chip = el("span", `chip state-${token.state ?? "plain"}`);
    chip.append(el("span", "chip-text", token.text));
    if (token.sub) chip.append(el("span", "chip-sub", token.sub));
    if (token.strip) chip.append(renderStrip(token.strip));
    row.append(chip);
  }
  wrap.append(row);
  const c = caption(cap);
  if (c) wrap.append(c);
  return wrap;
}

function renderHeat(rows: HeatRow[], cols: string[] | undefined, cap: string | undefined, showValues: boolean, colsLabel?: string): HTMLElement {
  const wrap = el("div", "viz viz-heat");
  const table = el("div", "heat-table");
  if (cols) {
    const head = el("div", "heat-row heat-head");
    head.append(el("span", "heat-label", colsLabel ?? ""));
    const cells = el("div", "heat-cells");
    for (const c of cols) cells.append(el("span", "heat-col", c));
    head.append(cells);
    table.append(head);
  }
  for (const row of rows) {
    const line = el("div", `heat-row${row.highlight ? " is-highlight" : ""}`);
    line.append(el("span", "heat-label", row.label));
    const cells = el("div", "heat-cells");
    for (const v of row.values) {
      const cell = el("span", `heat-cell${v === null ? " is-masked" : ""}`);
      if (v !== null) {
        cell.style.background = heatColor(v);
        cell.title = v.toFixed(2);
        if (showValues) {
          cell.textContent = v.toFixed(2).replace(/^0\./, ".").replace(/^-0\./, "-.");
          if (Math.abs(v) > 0.55) cell.classList.add("is-strong");
        }
      }
      cells.append(cell);
    }
    line.append(cells);
    table.append(line);
  }
  wrap.append(table);
  const c = caption(cap);
  if (c) wrap.append(c);
  return wrap;
}

function renderBars(items: BarItem[], max: number | undefined, cap?: string): HTMLElement {
  const wrap = el("div", "viz viz-bars");
  const top = max ?? Math.max(...items.map((i) => i.value), 0.0001);
  for (const item of items) {
    const row = el("div", `bar-row${item.highlight ? " is-highlight" : ""}${item.muted ? " is-muted" : ""}`);
    row.append(el("span", "bar-label", item.label));
    const track = el("span", "bar-track");
    const fill = el("span", "bar-fill");
    fill.style.width = `${Math.max(1.5, (item.value / top) * 100)}%`;
    track.append(fill);
    row.append(track);
    row.append(el("span", "bar-value", item.display ?? item.value.toFixed(2)));
    wrap.append(row);
  }
  const c = caption(cap);
  if (c) wrap.append(c);
  return wrap;
}

function renderGrid(viz: Extract<Viz, { type: "grid" }>): HTMLElement {
  const wrap = el("div", "viz viz-grid");
  const grid = el("div", "grid-cells");
  grid.style.setProperty("--cols", String(viz.cols));
  const active = new Set(viz.active ?? []);
  const secondary = new Set(viz.secondary ?? []);
  const faded = new Set(viz.faded ?? []);
  const total = viz.cols * viz.rows;
  for (let i = 0; i < total; i++) {
    const cell = el("span", "grid-cell");
    if (active.has(i)) cell.classList.add("is-active");
    else if (secondary.has(i)) cell.classList.add("is-secondary");
    else if (faded.has(i)) cell.classList.add("is-faded");
    const label = viz.labels?.[i];
    if (label) {
      cell.textContent = label;
      cell.classList.add("has-label");
    }
    grid.append(cell);
  }
  wrap.append(grid);
  if (viz.legend) {
    const legend = el("div", "grid-legend");
    const entries: [string, string | undefined][] = [
      ["is-active", viz.legend.active],
      ["is-secondary", viz.legend.secondary],
      ["is-faded", viz.legend.faded],
    ];
    for (const [cls, text] of entries) {
      if (!text) continue;
      const item = el("span", "grid-legend-item");
      item.append(el("i", `grid-cell ${cls}`), el("span", undefined, text));
      legend.append(item);
    }
    wrap.append(legend);
  }
  const c = caption(viz.caption);
  if (c) wrap.append(c);
  return wrap;
}

const SVG_NS = "http://www.w3.org/2000/svg";

function svg<K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string | number>): SVGElementTagNameMap[K] {
  const node = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, String(v));
  return node;
}

/** Rotating arrows: how RoPE turns a vector by a position-dependent angle. */
function renderDial(positions: number[], labels: string[] | undefined, cap?: string): HTMLElement {
  const wrap = el("div", "viz viz-dial");
  const row = el("div", "dial-row");
  const step = 32;
  positions.forEach((pos, i) => {
    const item = el("div", "dial-item");
    const size = 56;
    const s = svg("svg", { viewBox: "0 0 60 60", width: size, height: size, "aria-hidden": "true" });
    s.append(svg("circle", { cx: 30, cy: 30, r: 26, fill: "#fbf6ec", stroke: "#bfae97", "stroke-width": 1.5 }));
    s.append(svg("line", { x1: 30, y1: 30, x2: 56, y2: 30, stroke: "#d8cbb8", "stroke-width": 1, "stroke-dasharray": "2 2" }));
    const angle = -(pos * step * Math.PI) / 180;
    const x2 = 30 + Math.cos(angle) * 24;
    const y2 = 30 + Math.sin(angle) * 24;
    s.append(svg("line", { x1: 30, y1: 30, x2, y2, stroke: "#b5773f", "stroke-width": 3, "stroke-linecap": "round" }));
    s.append(svg("circle", { cx: x2, cy: y2, r: 3.2, fill: "#c9a24c" }));
    item.append(s);
    item.append(el("span", "dial-label", labels?.[i] ?? String(pos)));
    item.append(el("span", "dial-angle", `${pos * step}°`));
    row.append(item);
  });
  wrap.append(row);
  const c = caption(cap);
  if (c) wrap.append(c);
  return wrap;
}

/** The museum's example picture: a cat sitting on a mat, drawn with simple shapes. */
export function catImageSvg(grid: number, merge?: number): SVGSVGElement {
  const size = 120;
  const s = svg("svg", { viewBox: `0 0 ${size} ${size}`, class: "cat-image", role: "img" });
  s.append(svg("rect", { x: 0, y: 0, width: size, height: size, fill: "#efe6d8" }));
  // Wall and floor line.
  s.append(svg("rect", { x: 0, y: 84, width: size, height: 36, fill: "#c9b18f" }));
  // Mat.
  s.append(svg("rect", { x: 12, y: 80, width: 96, height: 20, rx: 4, fill: "#b5773f" }));
  for (let i = 0; i < 5; i++) s.append(svg("rect", { x: 18 + i * 18, y: 84, width: 8, height: 12, rx: 2, fill: "#8f5c2c", opacity: 0.55 }));
  // Tail.
  s.append(svg("path", { d: "M 84 74 C 100 70, 106 50, 96 42", fill: "none", stroke: "#5a4736", "stroke-width": 6, "stroke-linecap": "round" }));
  // Body and head.
  s.append(svg("ellipse", { cx: 62, cy: 68, rx: 26, ry: 17, fill: "#6b5a4a" }));
  s.append(svg("circle", { cx: 40, cy: 50, r: 15, fill: "#6b5a4a" }));
  s.append(svg("polygon", { points: "28,42 30,26 40,38", fill: "#6b5a4a" }));
  s.append(svg("polygon", { points: "52,42 50,26 40,38", fill: "#6b5a4a" }));
  s.append(svg("polygon", { points: "30,40 31,31 37,38", fill: "#c4795a" }));
  s.append(svg("polygon", { points: "50,40 49,31 43,38", fill: "#c4795a" }));
  // Face.
  s.append(svg("ellipse", { cx: 34, cy: 50, rx: 2.6, ry: 3.2, fill: "#f2c14e" }));
  s.append(svg("ellipse", { cx: 46, cy: 50, rx: 2.6, ry: 3.2, fill: "#f2c14e" }));
  s.append(svg("circle", { cx: 34, cy: 50.5, r: 1.1, fill: "#2b221b" }));
  s.append(svg("circle", { cx: 46, cy: 50.5, r: 1.1, fill: "#2b221b" }));
  s.append(svg("polygon", { points: "38.5,55 41.5,55 40,57.5", fill: "#c4795a" }));
  // Front paws.
  s.append(svg("ellipse", { cx: 46, cy: 82, rx: 6, ry: 3.5, fill: "#5a4736" }));
  s.append(svg("ellipse", { cx: 60, cy: 83, rx: 6, ry: 3.5, fill: "#5a4736" }));
  // Patch grid overlay.
  if (grid > 0) {
    const g = svg("g", { class: "cat-grid" });
    const cell = size / grid;
    for (let i = 0; i <= grid; i++) {
      const strong = merge ? i % merge === 0 : false;
      const attrs = {
        stroke: strong ? "#3b2f25" : "#3b2f25",
        "stroke-width": strong ? 1.4 : 0.5,
        opacity: strong ? 0.85 : 0.45,
      };
      g.append(svg("line", { x1: i * cell, y1: 0, x2: i * cell, y2: size, ...attrs }));
      g.append(svg("line", { x1: 0, y1: i * cell, x2: size, y2: i * cell, ...attrs }));
    }
    s.append(g);
  }
  return s;
}

function renderImage(grid: number, merge: number | undefined, cap?: string): HTMLElement {
  const wrap = el("div", "viz viz-image");
  wrap.append(catImageSvg(grid, merge));
  const c = caption(cap);
  if (c) wrap.append(c);
  return wrap;
}

function renderSteps(items: string[], cap?: string): HTMLElement {
  const wrap = el("div", "viz viz-steps");
  const ol = el("ol", "steps-list");
  for (const item of items) ol.append(el("li", undefined, item));
  wrap.append(ol);
  const c = caption(cap);
  if (c) wrap.append(c);
  return wrap;
}

export function renderViz(viz: Viz, locale: Locale): HTMLElement {
  switch (viz.type) {
    case "tokens":
      return renderTokens(viz.tokens, viz.caption);
    case "heat":
      return renderHeat(viz.rows, viz.cols, viz.caption, viz.showValues ?? false, viz.colsLabel);
    case "bars":
      return renderBars(viz.items, viz.max, viz.caption);
    case "grid":
      return renderGrid(viz);
    case "dial":
      return renderDial(viz.positions, viz.labels, viz.caption);
    case "image":
      return renderImage(viz.grid, viz.merge, viz.caption);
    case "steps":
      return renderSteps(viz.items, viz.caption);
    case "stack": {
      const wrap = el("div", "viz viz-stack");
      for (const item of viz.items) wrap.append(renderViz(item, locale));
      return wrap;
    }
  }
}
