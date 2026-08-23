import { expect, test } from "@playwright/test";

test("skipModel never shows the model download bar", async ({ page }) => {
  await page.goto("/?skipModel=1");
  await expect(page.getByTestId("model-pill")).toHaveText("未載入 · 測抓圖", { timeout: 15_000 });
  await expect(page.getByTestId("load-progress")).toBeHidden();
});

test("unsupported devices hide the bar instead of pretending to download", async ({ page }) => {
  await page.goto("/?forceWorkgroup=8192");
  await expect(page.getByTestId("model-pill")).toHaveText("此裝置不支援", { timeout: 15_000 });
  await expect(page.getByTestId("load-progress")).toBeHidden();
});

test("real model load shows a live progress bar before weights finish", async ({ page }) => {
  await page.goto("/");
  const bar = page.getByTestId("load-progress");
  await expect(bar).toBeVisible({ timeout: 30_000 });
  await expect(page.getByTestId("load-progress-hint")).toContainText("600–700 MB");
  await expect(page.getByTestId("load-progress-label")).not.toHaveText("");
  await expect(page.getByTestId("load-progress-fill")).toBeVisible();

  await expect
    .poll(async () => bar.getAttribute("data-stage"), { timeout: 15_000 })
    .toMatch(/processor|weights|compile/);

  await page.screenshot({
    path: "/opt/cursor/artifacts/qwencat_load_progress_processor.png",
    fullPage: true,
  });

  await expect
    .poll(async () => bar.getAttribute("data-stage"), { timeout: 90_000 })
    .toMatch(/weights|compile/);

  await expect
    .poll(async () => {
      const detail = (await page.getByTestId("load-progress-detail").innerText()) ?? "";
      const percent = (await page.getByTestId("load-progress-pct").textContent())?.trim() ?? "";
      return /\d+(\.\d+)? MB/.test(detail) && (percent === "" || /^\d+%$/.test(percent));
    }, { timeout: 120_000 })
    .toBeTruthy();

  const snapshot = {
    stage: await bar.getAttribute("data-stage"),
    label: await page.getByTestId("load-progress-label").innerText(),
    percent: await page.getByTestId("load-progress-pct").innerText(),
    detail: await page.getByTestId("load-progress-detail").innerText(),
    indeterminate: await bar.evaluate((el) => el.classList.contains("is-indeterminate")),
  };
  console.log(`load-progress snapshot: ${JSON.stringify(snapshot)}`);
  expect(snapshot.stage === "processor" && snapshot.percent === "100%").toBeFalsy();

  await page.screenshot({
    path: "/opt/cursor/artifacts/qwencat_load_progress.png",
    fullPage: true,
  });
});
