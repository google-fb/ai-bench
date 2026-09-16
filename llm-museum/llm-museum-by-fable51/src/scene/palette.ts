import type { BlockKind } from "../content/types.ts";

/** Earth-tone palette shared by the 3D scene and the CSS legend. */
export const PALETTE = {
  background: 0xefe6d8,
  fog: 0xefe6d8,
  floor: 0x8c6f55,
  floorStripe: 0x7d6249,
  wall: 0xe6dac8,
  wallTrim: 0x5a4736,
  pedestal: 0x4f3f32,
  pedestalTop: 0x6b5644,
  edge: 0x3a2e24,
  bracket: 0x6b5a4a,
  linkKv: 0x9a7b8f,
  linkFlow: 0xb5773f,
  linkMemory: 0x7f95a3,
  token: 0xf2c14e,
  expertActive: 0xf2c14e,
} as const;

export const KIND_COLOR: Record<BlockKind, number> = {
  embedding: 0xc4795a,
  position: 0xd9b382,
  attention: 0xc9a24c,
  norm: 0xa7b08c,
  residual: 0xb9a58a,
  ffn: 0x8b9a5b,
  moe: 0xb5773f,
  output: 0x7f95a3,
  memory: 0x9a7b8f,
  vision: 0x6f8f76,
  spec: 0xd6c08f,
  io: 0x8f6e57,
};

export function hex(color: number): string {
  return `#${color.toString(16).padStart(6, "0")}`;
}
