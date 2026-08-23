import { expect, test } from "@playwright/test";
import path from "node:path";

const fixture = path.resolve(import.meta.dirname, "fixtures/cat.jpg");

test("loads Qwen3.5 0.8B and summarizes a cat photo", async ({ page }, testInfo) => {
  const pageErrors: string[] = [];
  const consoleErrors: string[] = [];
  const failedUrls: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push(msg.text());
    }
  });
  page.on("requestfailed", (request) => {
    failedUrls.push(`${request.failure()?.errorText ?? "failed"} ${request.url()}`);
  });
  page.on("response", (response) => {
    if (response.status() >= 400) {
      failedUrls.push(`${response.status()} ${response.url()}`);
    }
  });

  await page.route("https://api.thecatapi.com/**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([{ id: "e2e-cat", url: "https://e2e.local/cat.jpg" }]),
    });
  });
  await page.route("https://e2e.local/cat.jpg", async (route) => {
    await route.fulfill({ path: fixture, contentType: "image/jpeg" });
  });

  await page.goto("/?maxTokens=48");
  await expect(page.getByRole("heading", { name: "Qwen3.5 0.8B 看貓" })).toBeVisible();

  const modelPill = page.getByTestId("model-pill");
  await expect
    .poll(async () => modelPill.innerText(), { timeout: 10 * 60 * 1000 })
    .toMatch(/Qwen3\.5 0\.8B|模型載入失敗/);
  if ((await modelPill.innerText()).includes("失敗")) {
    throw new Error(
      `model load failed: ${await page.getByTestId("summary-status").innerText()}\nconsole=${consoleErrors.join(" | ")}\nhttp=${failedUrls.join(" | ")}`,
    );
  }

  const image = page.getByTestId("cat-image");
  await expect
    .poll(async () => image.evaluate((el: HTMLImageElement) => el.naturalWidth))
    .toBeGreaterThan(32);

  const summary = page.getByTestId("summary-text");
  await expect
    .poll(async () => summary.getAttribute("data-state"), { timeout: 12 * 60 * 1000 })
    .toMatch(/done|error/);
  if ((await summary.getAttribute("data-state")) === "error") {
    throw new Error(
      `summarize failed: ${await page.getByTestId("summary-status").innerText()}\nconsole=${consoleErrors.join(" | ")}`,
    );
  }

  const text = (await summary.innerText()).trim();
  expect(text.length, `summary too short: ${text}`).toBeGreaterThan(12);
  expect(text).toMatch(/[\u4e00-\u9fff]/);
  expect(page.getByTestId("summary-status")).toContainText("摘要完成");
  expect(pageErrors, `page errors: ${pageErrors.join(" | ")}`).toEqual([]);

  const shot = testInfo.outputPath("qwen-cat-summary.png");
  await page.screenshot({ path: shot, fullPage: true });
  await page.screenshot({
    path: "/opt/cursor/artifacts/qwencat_e2e_summary.png",
    fullPage: true,
  });

  console.log(`device=${await page.getByTestId("device-pill").innerText()}`);
  console.log(`model=${await modelPill.innerText()}`);
  console.log(`summary=${text}`);
});
