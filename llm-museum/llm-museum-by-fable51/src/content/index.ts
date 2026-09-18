import { transformer } from "./transformer.ts";
import { llama3 } from "./llama3.ts";
import { deepseekV41Flash } from "./deepseek-v41-flash.ts";
import type { Block, ModelSpec } from "./types.ts";

/** Exhibits in walking order: oldest hall first. */
export const MODELS: ModelSpec[] = [transformer, llama3, deepseekV41Flash];

export function findModel(id: string): ModelSpec | undefined {
  return MODELS.find((m) => m.id === id);
}

export function allBlocks(model: ModelSpec): Block[] {
  return model.columns.flatMap((c) => c.blocks);
}

export function findBlock(model: ModelSpec, blockId: string): Block | undefined {
  for (const column of model.columns) {
    const hit = column.blocks.find((b) => b.id === blockId);
    if (hit) return hit;
  }
  return undefined;
}

/** Blocks in the order the guided tour visits them. */
export function tourBlocks(model: ModelSpec): Block[] {
  if (!model.tourOrder) return allBlocks(model);
  return model.tourOrder
    .map((id) => findBlock(model, id))
    .filter((b): b is Block => b !== undefined);
}
