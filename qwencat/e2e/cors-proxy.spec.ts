import { expect, test } from "@playwright/test";

test("downloads a Cat API photo through the CORS proxy", async ({ page }) => {
  await page.goto("/?skipModel=1");
  await expect(page.getByRole("heading", { name: "Qwen3.5 0.8B 看貓" })).toBeVisible();

  const image = page.getByTestId("cat-image");
  await expect
    .poll(async () => image.evaluate((el: HTMLImageElement) => el.naturalWidth), {
      timeout: 60_000,
    })
    .toBeGreaterThan(32);

  const caption = await page.getByTestId("cat-caption").innerText();
  expect(caption).toMatch(/^來源 https?:\/\//);
  await page.screenshot({
    path: "/opt/cursor/artifacts/qwencat_e2e_cors_proxy.png",
    fullPage: true,
  });
});

test("browser fetch of S3 cat CDN fails CORS, weserv proxy works", async ({ page }) => {
  await page.goto("/?skipModel=1");
  const info = await page.evaluate(async () => {
    const src = "https://s3.us-west-2.amazonaws.com/cdn2.thecatapi.com/images/dqg.jpg";
    let direct = "ok";
    try {
      const response = await fetch(src, { cache: "no-store" });
      direct = `status:${response.status}`;
    } catch (error) {
      direct = error instanceof Error ? error.message : String(error);
    }
    const proxied = `https://wsrv.nl/?url=${encodeURIComponent(src)}&output=jpg`;
    const response = await fetch(proxied, { cache: "no-store" });
    const blob = await response.blob();
    return { direct, status: response.status, type: blob.type, size: blob.size };
  });

  expect(info.direct, `direct S3 should fail CORS: ${info.direct}`).toMatch(
    /Failed to fetch|NetworkError|CORS|blocked/i,
  );
  expect(info.status).toBe(200);
  expect(info.size).toBeGreaterThan(1000);
  expect(info.type).toMatch(/image\//);
});
