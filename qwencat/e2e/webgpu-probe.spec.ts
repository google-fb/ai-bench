import { expect, test } from "@playwright/test";

test("probe WebGPU adapters", async ({ page }) => {
  await page.goto("/");
  const info = await page.evaluate(async () => {
    const gpu = Boolean(navigator.gpu);
    const read = async (opts?: GPURequestAdapterOptions) => {
      try {
        const a = navigator.gpu ? await navigator.gpu.requestAdapter(opts) : null;
        return a
          ? {
              features: [...a.features],
              isFallback: a.isFallbackAdapter,
            }
          : null;
      } catch (e) {
        return { error: e instanceof Error ? e.message : String(e) };
      }
    };
    return {
      gpu,
      adapter: await read(),
      fallback: await read({ forceFallbackAdapter: true }),
      userAgent: navigator.userAgent,
    };
  });
  console.log(JSON.stringify(info, null, 2));
  expect(info.gpu, "navigator.gpu missing").toBeTruthy();
  expect(info.adapter ?? info.fallback, "no WebGPU adapter").toBeTruthy();
});
