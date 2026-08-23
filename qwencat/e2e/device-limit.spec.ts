import { expect, test } from "@playwright/test";

test("refuses to load Qwen when workgroup storage is below 32KB", async ({ page }) => {
  await page.goto("/?forceWorkgroup=8192");
  await expect(page.getByTestId("model-pill")).toHaveText("此裝置不支援", { timeout: 15_000 });
  await expect(page.getByTestId("summary-status")).toContainText("上限是 8 KB");
  await expect(page.getByTestId("summary-status")).toContainText("至少需要 32 KB");
  await expect(page.getByTestId("summary-status")).toContainText("不支援這台裝置");
  await expect(page.getByTestId("device-pill")).toContainText("8 KB");
  await page.screenshot({
    path: "/opt/cursor/artifacts/qwencat_unsupported_workgroup.png",
    fullPage: true,
  });
});

test("shows the probed WebGPU workgroup limit when the device is capable", async ({ page }) => {
  await page.goto("/?skipModel=1");
  const info = await page.evaluate(async () => {
    const adapter =
      (await navigator.gpu?.requestAdapter()) ??
      (await navigator.gpu?.requestAdapter({ forceFallbackAdapter: true }));
    return adapter
      ? {
          workgroupStorage: adapter.limits.maxComputeWorkgroupStorageSize,
          vendor: adapter.info?.vendor ?? "",
        }
      : null;
  });
  expect(info, "WebGPU adapter required").toBeTruthy();
  expect(info!.workgroupStorage).toBeGreaterThan(0);
  console.log(`adapter workgroupStorage=${info!.workgroupStorage} vendor=${info!.vendor}`);
});
