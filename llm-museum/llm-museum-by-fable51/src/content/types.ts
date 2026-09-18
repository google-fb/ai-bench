import type { L } from "../i18n.ts";

export type BlockKind =
  | "embedding"
  | "position"
  | "attention"
  | "norm"
  | "residual"
  | "ffn"
  | "moe"
  | "output"
  | "memory"
  | "vision"
  | "spec"
  | "io";

export interface Fact {
  label: L;
  value: L | string;
}

/** One token chip in an example visualisation. */
export interface TokenChip {
  text: string;
  /** Small annotation under the chip (id, position, K/V state…). */
  sub?: string;
  /** A few illustrative vector components drawn as a heat strip. */
  strip?: number[];
  state?: "current" | "done" | "future" | "source" | "muted" | "new";
}

export interface HeatRow {
  label: string;
  /** null cells are drawn as masked/blank. */
  values: (number | null)[];
  highlight?: boolean;
}

export interface BarItem {
  label: string;
  value: number;
  /** Text shown after the bar (e.g. "0.71" or "178 KB"). */
  display?: string;
  highlight?: boolean;
  muted?: boolean;
}

/**
 * Small, data-driven pictures that show what happens to the running example
 * at one module. Rendered as HTML/SVG in the side panel.
 */
export type Viz =
  | { type: "tokens"; tokens: TokenChip[]; caption?: string }
  | { type: "heat"; rows: HeatRow[]; cols?: string[]; caption?: string; showValues?: boolean; colsLabel?: string }
  | { type: "bars"; items: BarItem[]; max?: number; caption?: string }
  | {
      type: "grid";
      cols: number;
      rows: number;
      active?: number[];
      secondary?: number[];
      faded?: number[];
      labels?: Record<number, string>;
      legend?: { active?: string; secondary?: string; faded?: string };
      caption?: string;
    }
  | { type: "dial"; positions: number[]; labels?: string[]; caption?: string }
  | { type: "image"; grid: number; merge?: number; caption?: string }
  | { type: "steps"; items: string[]; caption?: string }
  | { type: "stack"; items: Viz[] };

/** A visualisation that may differ per language (token texts, labels). */
export type LViz = Viz | { zh: Viz; en: Viz };

export interface BlockExample {
  /** What happens to the running example at this module. Read aloud after the brief. */
  story: L;
  viz?: LViz;
}

export interface ModelExample {
  /** Short description of the example input (text, or image + text). */
  input: L;
  /** The answer the model produces for it. */
  output: L;
  /** Optional caveat, e.g. that numbers are illustrative. */
  note?: L;
  /** Show the built-in illustration of the example image. */
  image?: boolean;
}

export interface Block {
  id: string;
  kind: BlockKind;
  /** Concrete walkthrough of the running example at this module. */
  example?: BlockExample;
  /** Full module name shown in the panel and list. */
  label: L;
  /** Compact label painted next to the 3D block (defaults to `label`). */
  short?: L;
  /** Repeated clones can skip their 3D label to keep the stack readable. */
  hideLabel?: boolean;
  /** One sentence shown in the list and tooltip. */
  brief: L;
  /** The full explanation, also used for read-aloud. */
  detail: L;
  facts?: Fact[];
  /** Relative thickness of the slab (1 = standard). */
  height?: number;
  /** Optional decoration hint, e.g. how many heads/experts to draw. */
  deco?: {
    count?: number;
    active?: number;
    groups?: number;
  };
  /** Set by cloneBlock so repeated layers can share the original's example. */
  clonedFrom?: string;
}

/** A bracket drawn around a contiguous run of blocks, marked ×repeat. */
export interface Group {
  id: string;
  from: string;
  to: string;
  repeat: number;
  label?: L;
}

export type LabelSide = "left" | "right" | "top";

export interface Column {
  id: string;
  title: L;
  x: number;
  z: number;
  scale?: number;
  baseY?: number;
  labelSide: LabelSide;
  blocks: Block[];
  groups?: Group[];
  /** Main columns carry the animated token flow. */
  main?: boolean;
  /** Example tokens shown riding the token flow up this column. */
  flowTokens?: { zh: string[]; en: string[] };
}

export interface Link {
  from: string;
  to: string;
  label?: L;
  style: "kv" | "flow" | "memory";
}

export interface Source {
  label: string;
  url: string;
}

export interface ModelSpec {
  id: string;
  name: L;
  shortName: L;
  year: number;
  org: L;
  tagline: L;
  intro: L;
  /** The running example that every module of this exhibit is explained with. */
  example?: ModelExample;
  facts: Fact[];
  columns: Column[];
  links?: Link[];
  /** Block ids visited by the guided tour, in order. Defaults to every block. */
  tourOrder?: string[];
  sources: Source[];
  accent: number;
}

/** Copies a block under a new id; used for layers that repeat with identical meaning. */
export function cloneBlock(block: Block, id: string, overrides: Partial<Block> = {}): Block {
  return { ...block, id, clonedFrom: block.clonedFrom ?? block.id, ...overrides };
}

export type ExampleMap = Record<string, BlockExample>;

/** Attaches the running example to each block; clones fall back to the block they were copied from. */
export function attachExamples(spec: ModelSpec, examples: ExampleMap): ModelSpec {
  for (const column of spec.columns) {
    for (const block of column.blocks) {
      const own = examples[block.id];
      const inherited = block.clonedFrom ? examples[block.clonedFrom] : undefined;
      const example = own ?? inherited;
      if (example) block.example = example;
    }
  }
  return spec;
}

export function pickViz(viz: LViz | undefined, locale: "zh" | "en"): Viz | undefined {
  if (!viz) return undefined;
  if ("type" in viz) return viz;
  return viz[locale];
}

/** Deterministic pseudo-random values in [-1, 1] so illustrative vectors look the same every visit. */
export function fakeVector(seed: number, length: number): number[] {
  const out: number[] = [];
  let state = (seed * 2654435761) >>> 0;
  for (let i = 0; i < length; i++) {
    state = (state * 1664525 + 1013904223) >>> 0;
    out.push(Math.round(((state / 0x100000000) * 2 - 1) * 100) / 100);
  }
  return out;
}
