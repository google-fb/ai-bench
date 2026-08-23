import { test } from "@playwright/test";

test("probe WebGPU adapters", async ({ page }) => {
  await page.goto("/");
  const info = await page.evaluate(async () => {
    const gpu = Boolean(navigator.gpu);
    let adapter = null;
    let error = null;
    try {
      const a = navigator.gpu ? await navigator.gpu.requestAdapter() : null;
      adapter = a
        ? {
            features: [...a.features],
            isFallback: a.isFallbackAdapter,
          }
        : null;
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
    }
    return { gpu, adapter, error, userAgent: navigator.userAgent };
  });
  console.log(JSON.stringify(info, null, 2));
});
