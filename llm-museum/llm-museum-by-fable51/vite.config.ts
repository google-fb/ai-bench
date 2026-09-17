import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "es2022",
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        // Keep three.js in its own long-lived chunk so content updates do not invalidate it.
        manualChunks: { three: ["three"] },
      },
    },
  },
});
