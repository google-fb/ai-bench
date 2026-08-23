import { defineConfig } from "vite";

export default defineConfig({
  optimizeDeps: {
    exclude: ["@huggingface/transformers"],
    include: ["onnxruntime-web", "onnxruntime-web/webgpu"],
  },
});
