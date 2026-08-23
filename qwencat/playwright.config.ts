import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 15 * 60 * 1000,
  expect: { timeout: 15 * 60 * 1000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]],
  use: {
    baseURL: "http://127.0.0.1:5173",
    channel: "chrome",
    headless: true,
    launchOptions: {
      args: [
        "--enable-unsafe-webgpu",
        "--enable-webgpu-developer-features",
        "--ignore-gpu-blocklist",
        "--disable-gpu-sandbox",
        "--use-angle=vulkan",
        "--enable-features=Vulkan,DefaultANGLEVulkan,VulkanFromANGLE",
      ],
      env: {
        ...process.env,
        VK_ICD_FILENAMES: "/usr/share/vulkan/icd.d/lvp_icd.json",
      },
    },
    viewport: { width: 1280, height: 900 },
    ignoreHTTPSErrors: true,
    trace: "retain-on-failure",
    screenshot: "on",
    video: "off",
  },
  webServer: {
    command: "npm run dev -- --host 127.0.0.1 --port 5173",
    url: "http://127.0.0.1:5173",
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
