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

export interface Block {
  id: string;
  kind: BlockKind;
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
  return { ...block, id, ...overrides };
}
