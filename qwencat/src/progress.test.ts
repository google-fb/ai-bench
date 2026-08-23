import assert from "node:assert/strict";
import { test } from "node:test";
import {
  createLoadProgressTracker,
  formatDataSize,
  shortFileName,
  type LoadProgress,
} from "./progress.ts";

test("formatDataSize uses MB for model weights", () => {
  assert.equal(formatDataSize(0), "0 B");
  assert.equal(formatDataSize(512), "512 B");
  assert.equal(formatDataSize(2048), "2.0 KB");
  assert.equal(formatDataSize(634 * 1024 * 1024), "634.0 MB");
});

test("shortFileName keeps the leaf onnx path", () => {
  assert.equal(shortFileName("onnx/decoder_model_merged.onnx"), "decoder_model_merged.onnx");
});

test("progress_total drives a determinate overall percent", () => {
  const seen: LoadProgress[] = [];
  const tracker = createLoadProgressTracker((progress) => seen.push(progress));
  tracker.beginStage("weights");

  tracker.handleHub({
    status: "progress_total",
    name: "onnx-community/Qwen3.5-0.8B-ONNX-OPT",
    progress: 42.4,
    loaded: 268_435_456,
    total: 634_388_480,
    files: {
      "onnx/embed_tokens.onnx": { loaded: 80_000_000, total: 80_000_000 },
      "onnx/decoder_model_merged.onnx": { loaded: 188_435_456, total: 554_388_480 },
    },
  });

  const last = seen.at(-1);
  assert.ok(last);
  assert.equal(last.phase, "download");
  assert.equal(last.stage, "weights");
  assert.equal(last.percent, 42);
  assert.match(last.label, /42%/);
  assert.match(last.detail, /256\.0 MB \/ 605\.0 MB/);
});

test("per-file progress aggregates when totals are known", () => {
  const seen: LoadProgress[] = [];
  const tracker = createLoadProgressTracker((progress) => seen.push(progress));
  tracker.beginStage("weights");

  tracker.handleHub({
    status: "progress",
    file: "onnx/a.onnx",
    loaded: 50 * 1024 * 1024,
    total: 100 * 1024 * 1024,
  });
  tracker.handleHub({
    status: "progress",
    file: "onnx/b.onnx",
    loaded: 25 * 1024 * 1024,
    total: 100 * 1024 * 1024,
  });

  const last = seen.at(-1);
  assert.ok(last);
  assert.equal(last.percent, 38);
  assert.equal(last.loadedBytes, 75 * 1024 * 1024);
  assert.equal(last.totalBytes, 200 * 1024 * 1024);
  assert.equal(last.file, "b.onnx");
});

test("100% download switches to compile so the bar does not look stuck", () => {
  const seen: LoadProgress[] = [];
  const tracker = createLoadProgressTracker((progress) => seen.push(progress));
  tracker.beginStage("weights");

  tracker.handleHub({
    status: "progress_total",
    progress: 100,
    loaded: 100,
    total: 100,
    files: { "onnx/model.onnx": { loaded: 100, total: 100 } },
  });

  const last = seen.at(-1);
  assert.ok(last);
  assert.equal(last.phase, "compile");
  assert.equal(last.percent, 100);
  assert.match(last.label, /編譯 WebGPU/);
});

test("unknown totals stay indeterminate", () => {
  const seen: LoadProgress[] = [];
  const tracker = createLoadProgressTracker((progress) => seen.push(progress));
  tracker.setPrepare();
  assert.equal(seen.at(-1)?.percent, null);
  assert.equal(seen.at(-1)?.phase, "download");
});

test("tiny weight-stage files do not show 100% before ONNX totals arrive", () => {
  const seen: LoadProgress[] = [];
  const tracker = createLoadProgressTracker((progress) => seen.push(progress));
  tracker.beginStage("weights");
  tracker.handleHub({
    status: "done",
    file: "config.json",
    loaded: 2800,
    total: 2800,
  });
  const last = seen.at(-1);
  assert.ok(last);
  assert.equal(last.percent, null);
  assert.equal(last.phase, "download");
  assert.match(last.detail, /收集完整權重清單|config\.json/);
});

test("processor files never report 100% as if the whole model finished", () => {
  const seen: LoadProgress[] = [];
  const tracker = createLoadProgressTracker((progress) => seen.push(progress));
  tracker.beginStage("processor");
  tracker.handleHub({
    status: "done",
    file: "preprocessor_config.json",
    loaded: 336,
    total: 336,
  });
  const last = seen.at(-1);
  assert.ok(last);
  assert.equal(last.stage, "processor");
  assert.equal(last.phase, "download");
  assert.equal(last.percent, null);
  assert.match(last.detail, /權重還在後面/);
});
