import * as ort from "onnxruntime-web/webgpu";

const ORT_SYMBOL = Symbol.for("onnxruntime");

// Transformers.js next.11 still pins onnxruntime-web 1.25.0-dev (March 2026),
// which predates CausalConvWithState / LinearAttention WebGPU kernels.
// Install a newer ORT first and hand it to transformers via the documented hook.
(globalThis as Record<symbol, unknown>)[ORT_SYMBOL] = ort;

if (ort.env.wasm) {
  const version = ort.env.versions?.web;
  if (version && !ort.env.wasm.wasmPaths) {
    ort.env.wasm.wasmPaths = `https://cdn.jsdelivr.net/npm/onnxruntime-web@${version}/dist/`;
  }
  ort.env.wasm.proxy = false;
}

if (ort.env.webgpu) {
  ort.env.webgpu.powerPreference = "high-performance";
}
