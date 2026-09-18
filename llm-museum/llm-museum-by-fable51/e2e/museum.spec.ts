import { expect, test, type Page } from "@playwright/test";

interface RecordedUtterance {
  text: string;
  lang: string;
  rate: number;
  voice: string | null;
}

declare global {
  interface Window {
    __utterances: RecordedUtterance[];
    __utteranceMs: number;
  }
}

/**
 * Headless Chrome has no speech engine, so install a deterministic fake
 * `speechSynthesis` that records every utterance and fires start/end events.
 */
async function installFakeSpeech(page: Page, utteranceMs = 120, silent = false): Promise<void> {
  await page.addInitScript(({ ms, silent }: { ms: number; silent: boolean }) => {
    window.__utterances = [];
    window.__utteranceMs = ms;
    class FakeUtterance {
      text: string;
      lang = "";
      rate = 1;
      pitch = 1;
      voice: { voiceURI: string } | null = null;
      onstart: ((e: unknown) => void) | null = null;
      onend: ((e: unknown) => void) | null = null;
      onerror: ((e: { error: string }) => void) | null = null;
      constructor(text: string) {
        this.text = text;
      }
    }
    const voices = [
      { name: "Fake Mei-Jia", lang: "zh-TW", voiceURI: "fake-zh-tw", localService: true, default: false },
      { name: "Fake Tingting", lang: "zh-CN", voiceURI: "fake-zh-cn", localService: true, default: false },
      { name: "Fake Samantha", lang: "en-US", voiceURI: "fake-en-us", localService: true, default: true },
    ];
    let current: FakeUtterance | null = null;
    const synth = {
      speaking: false,
      paused: false,
      pending: false,
      getVoices: () => voices,
      speak(u: FakeUtterance) {
        window.__utterances.push({ text: u.text, lang: u.lang, rate: u.rate, voice: u.voice ? u.voice.voiceURI : null });
        current = u;
        synth.speaking = true;
        // A silent engine accepts utterances but never fires start/end events.
        if (silent) return;
        setTimeout(() => {
          if (current === u) u.onstart?.({});
        }, 5);
        setTimeout(() => {
          if (current === u && !synth.paused) {
            current = null;
            synth.speaking = false;
            u.onend?.({});
          }
        }, window.__utteranceMs);
      },
      cancel() {
        const u = current;
        current = null;
        synth.speaking = false;
        synth.paused = false;
        if (u) setTimeout(() => u.onerror?.({ error: "interrupted" }), 0);
      },
      pause() {
        synth.paused = true;
      },
      resume() {
        synth.paused = false;
        const u = current;
        if (u) {
          setTimeout(() => {
            if (current === u && !synth.paused) {
              current = null;
              synth.speaking = false;
              u.onend?.({});
            }
          }, window.__utteranceMs);
        }
      },
      addEventListener() {},
      removeEventListener() {},
    };
    Object.defineProperty(window, "speechSynthesis", { value: synth, configurable: true });
    (window as unknown as { SpeechSynthesisUtterance: unknown }).SpeechSynthesisUtterance = FakeUtterance;
  }, { ms: utteranceMs, silent });
}

async function openMuseum(page: Page, hash = ""): Promise<void> {
  await page.goto(`/${hash}`);
  await expect(page.locator("#loading")).toHaveClass(/is-hidden/, { timeout: 60_000 });
}

async function setRate(page: Page, rate: number): Promise<void> {
  await page.locator("#rate-slider").evaluate((el, value) => {
    const input = el as HTMLInputElement;
    input.value = String(value);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }, rate);
}

test.describe("LLM Architecture Museum", () => {
  test("renders the 3D museum with three halls in Traditional Chinese by default", async ({ page }) => {
    await openMuseum(page);
    await expect(page.locator("canvas.webgl")).toBeVisible();
    await expect(page).toHaveTitle(/LLM 建築博物館/);
    await expect(page.locator("html")).toHaveAttribute("lang", "zh-Hant");
    await expect(page.locator("#app-title")).toHaveText("LLM 建築博物館");
    await expect(page.locator(".hall-btn")).toHaveCount(4);
    await expect(page.locator(".hall-btn .hall-name")).toHaveText(["Transformer", "Llama 3", "DeepSeek V4.1"]);
    await expect(page.locator("#model-card h2")).toHaveText("歡迎來到 LLM 建築博物館");
    // Every exhibit has a plaque in the 3D scene.
    await expect(page.locator(".plaque")).toHaveCount(3);
    await expect(page.locator(".plaque-name")).toHaveText(["原始 Transformer", "Llama 3", "DeepSeek V4.1 Flash"]);
  });

  test("switches the whole interface between Chinese and English", async ({ page }) => {
    await openMuseum(page);
    await page.click(".hall-btn[data-hall='transformer']");
    await expect(page.locator("#model-card h2")).toHaveText("原始 Transformer");
    await expect(page.locator(".lbl[data-block-id='t-enc-attn'] .lbl-text")).toHaveText("多頭自注意力");

    await page.click("#lang-toggle");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("#app-title")).toHaveText("LLM Architecture Museum");
    await expect(page.locator(".hall-btn[data-hall='overview']")).toHaveText("Overview");
    await expect(page.locator("#model-card h2")).toHaveText("Original Transformer");
    await expect(page.locator(".lbl[data-block-id='t-enc-attn'] .lbl-text")).toHaveText("Multi-Head Self-Attention");
    await expect(page.locator(".plaque-name").first()).toHaveText("Original Transformer");
    await expect(page.locator("#speech-play")).toContainText("Play");

    // The choice survives a reload.
    await page.reload();
    await expect(page.locator("#loading")).toHaveClass(/is-hidden/, { timeout: 60_000 });
    await expect(page.locator("html")).toHaveAttribute("lang", "en");

    await page.click("#lang-toggle");
    await expect(page.locator("#app-title")).toHaveText("LLM 建築博物館");
  });

  test("focusing a hall lists its modules and selecting one shows the explanation", async ({ page }) => {
    await openMuseum(page);
    await page.click(".hall-btn[data-hall='transformer']");
    await expect(page.locator(".hall-btn[data-hall='transformer']")).toHaveClass(/is-active/);
    await expect(page.locator("#model-card h2")).toHaveText("原始 Transformer");
    await expect(page.locator(".facts dt").first()).toHaveText("層數");
    await expect(page.locator(".module-item")).toHaveCount(17);
    await expect(page.locator("#module-detail")).not.toHaveClass(/is-open/);

    await page.click(".module-item[data-block-id='t-enc-attn']");
    await expect(page.locator("#module-detail")).toHaveClass(/is-open/);
    await expect(page.locator(".detail-title")).toHaveText("多頭自注意力");
    await expect(page.locator(".kind-badge")).toHaveText("注意力");
    await expect(page.locator("#module-detail .prose").last()).toContainText("這是 Transformer 的心臟");
    await expect(page.locator(".lbl[data-block-id='t-enc-attn']")).toHaveClass(/is-selected/);
    await expect(page.locator(".module-item[data-block-id='t-enc-attn']")).toHaveClass(/is-active/);
    await expect(page).toHaveURL(/#\/transformer\/t-enc-attn$/);

    // Clicking a 3D label selects that module too.
    await page.click(".lbl[data-block-id='t-dec-xattn']");
    await expect(page.locator(".detail-title")).toHaveText("編碼器–解碼器注意力（交叉注意力）");

    // Stepping follows the curated learning order.
    await page.click(".step-btn[title='下一個模組']");
    await expect(page.locator(".detail-title")).toHaveText("線性層");
  });

  test("each module shows what the running example looks like at that layer", async ({ page }) => {
    await openMuseum(page, "#/transformer/t-enc-attn");
    await expect(page.locator(".detail-title")).toHaveText("多頭自注意力", { timeout: 15_000 });
    // The exhibit card states the example input and output.
    await expect(page.locator(".example-box .example-io dd").first()).toContainText("The cat sat on the mat.");
    await expect(page.locator(".example-box .example-output")).toHaveText("貓坐在墊子上。");
    // Attention over the example sentence: a 7×7 heat map with the row for "sat" highlighted.
    const example = page.locator("#module-detail .example-section");
    await expect(example.locator(".example-section-title")).toContainText("以範例來看");
    await expect(example.locator(".heat-col")).toHaveText(["The", "cat", "sat", "on", "the", "mat", "."]);
    await expect(example.locator(".heat-row:not(.heat-head)")).toHaveCount(7);
    await expect(example.locator(".heat-row.is-highlight .heat-label")).toHaveText("sat");
    await expect(example.locator(".example-story")).toContainText("cat（0.40");

    // The final layer shows the probabilities and the generated translation.
    await page.click(".module-item[data-block-id='t-softmax']");
    await expect(page.locator(".detail-title")).toHaveText("Softmax → 輸出機率");
    await expect(page.locator("#module-detail .bar-row.is-highlight .bar-label")).toHaveText("墊子");
    await expect(page.locator("#module-detail .chip.state-new .chip-text")).toHaveText("墊子");

    // In English the same walkthrough translates into German.
    await page.click("#lang-toggle");
    await expect(page.locator("#module-detail .bar-row.is-highlight .bar-label")).toHaveText("Matte");
    await expect(page.locator(".example-box .example-output")).toHaveText("Die Katze saß auf der Matte.");
    await expect(page.locator(".example-section-title")).toContainText("With our example");

    // Example tokens ride the token flow in the 3D scene.
    await expect(page.locator(".flow-token").filter({ hasText: /^(The|cat|sat|on|the|mat|\.)$/ }).first()).toBeAttached();
  });

  test("the DeepSeek walkthrough starts from a picture and shows expert routing", async ({ page }) => {
    await openMuseum(page, "#/deepseek-v41-flash");
    await expect(page.locator(".example-box .cat-image")).toBeVisible({ timeout: 15_000 });
    await expect(page.locator(".example-box .example-output")).toHaveText("一隻貓坐在墊子上。");

    await page.click(".module-item[data-block-id='d-vit']");
    await expect(page.locator("#module-detail .viz-image .cat-grid")).toBeAttached();
    await expect(page.locator("#module-detail .example-story")).toContainText("42×42");

    await page.click(".module-item[data-block-id='d-moe-a']");
    await expect(page.locator("#module-detail .grid-cells .grid-cell")).toHaveCount(384);
    await expect(page.locator("#module-detail .grid-cells .grid-cell.is-active")).toHaveCount(6);
    await expect(page.locator("#module-detail .grid-cells .grid-cell.is-secondary")).toHaveCount(6);

    // Repeated MoE layers reuse the same example.
    await page.click(".module-item[data-block-id='d-moe-g']");
    await expect(page.locator("#module-detail .grid-cells .grid-cell.is-active")).toHaveCount(6);
  });

  test("reading a module aloud includes the example story, in order", async ({ page }) => {
    await installFakeSpeech(page, 30);
    await openMuseum(page, "#/llama3/l-sample");
    await expect(page.locator(".detail-title")).toHaveText("Softmax → 取樣下一個 token", { timeout: 15_000 });
    await page.click("[data-read='block']");
    await expect
      .poll(() => page.evaluate(() => window.__utterances.some((u) => u.text.startsWith("分數經 softmax 變成機率分佈"))), { timeout: 20_000 })
      .toBe(true);
    const texts = await page.evaluate(() => window.__utterances.map((u) => u.text));
    const storyIndex = texts.findIndex((t) => t.startsWith("softmax 變成機率"));
    const detailIndex = texts.findIndex((t) => t.startsWith("分數經 softmax 變成機率分佈"));
    expect(texts[0]).toBe("Softmax → 取樣下一個 token。");
    expect(storyIndex).toBeGreaterThan(1);
    expect(detailIndex).toBeGreaterThan(storyIndex);
  });

  test("a deep link opens the right hall and module", async ({ page }) => {
    await openMuseum(page, "#/deepseek-v41-flash/d-moe-a");
    await expect(page.locator(".hall-btn[data-hall='deepseek-v41-flash']")).toHaveClass(/is-active/, { timeout: 15_000 });
    await expect(page.locator(".detail-title")).toHaveText("DeepSeekMoE（1 共享 + 384 路由，啟用 6）", { timeout: 15_000 });
    await expect(page.locator("#model-card")).toContainText("552B");
  });

  test("reads a module aloud in the current language at the chosen speed", async ({ page }) => {
    await installFakeSpeech(page, 5_000);
    await openMuseum(page, "#/llama3/l-gqa");
    await expect(page.locator(".detail-title")).toHaveText("分組查詢注意力 GQA", { timeout: 15_000 });
    await expect(page.locator("#voice-select option")).toHaveCount(3); // automatic + two Chinese voices

    await setRate(page, 1.5);
    await expect(page.locator("#rate-value")).toHaveText("1.5×");
    await page.click("[data-read='block']");

    await expect(page.locator("#speech-status")).toContainText("朗讀中");
    await expect(page.locator("#module-detail .s.is-current")).toHaveCount(1);
    await expect(page.locator("#module-detail .s.is-current")).toHaveText("分組查詢注意力 GQA");
    await expect.poll(() => page.evaluate(() => window.__utterances.length)).toBeGreaterThan(0);
    const zh = await page.evaluate(() => window.__utterances);
    expect(zh[0]).toMatchObject({ text: "分組查詢注意力 GQA。", lang: "zh-TW", rate: 1.5, voice: "fake-zh-tw" });

    // Switching language stops the narration; reading again uses an English voice.
    await page.click("#lang-toggle");
    await expect(page.locator("#speech-status")).not.toContainText("Speaking");
    await expect(page.locator("#voice-select option")).toHaveCount(2); // automatic + one English voice
    await setRate(page, 0.8);
    await page.click("[data-read='block']");
    await expect(page.locator("#speech-status")).toContainText("Speaking");
    await expect.poll(() => page.evaluate(() => window.__utterances.length)).toBeGreaterThan(zh.length);
    const all = await page.evaluate(() => window.__utterances);
    const en = all[all.length - 1];
    expect(en).toMatchObject({ text: "Grouped-Query Attention (GQA).", lang: "en-US", rate: 0.8, voice: "fake-en-us" });
  });

  test("changing the speed mid-sentence restarts it at the new rate", async ({ page }) => {
    await installFakeSpeech(page, 5_000);
    await openMuseum(page, "#/transformer/t-in-emb");
    await expect(page.locator(".detail-title")).toHaveText("輸入嵌入", { timeout: 15_000 });
    await page.click("[data-read='block']");
    await expect(page.locator("#speech-status")).toContainText("朗讀中");
    await expect.poll(() => page.evaluate(() => window.__utterances.length)).toBe(1);
    await setRate(page, 2);
    await expect.poll(async () => (await page.evaluate(() => window.__utterances)).map((u) => u.rate)).toEqual([1, 2]);
    const texts = await page.evaluate(() => window.__utterances.map((u) => u.text));
    expect(texts[0]).toBe(texts[1]);
  });

  test("pause, resume and stop control the narration", async ({ page }) => {
    await installFakeSpeech(page, 5_000);
    await openMuseum(page, "#/transformer/t-enc-ffn");
    await expect(page.locator(".detail-title")).toHaveText("前饋網路（ReLU）", { timeout: 15_000 });
    await page.click("#speech-play");
    await expect(page.locator("#speech-status")).toContainText("朗讀中");
    await expect(page.locator("#speech-pause")).toContainText("暫停");

    await page.click("#speech-pause");
    await expect(page.locator("#speech-status")).toHaveText("已暫停");
    await expect(page.locator("#speech-pause")).toContainText("繼續");

    await page.click("#speech-pause");
    await expect(page.locator("#speech-status")).toContainText("朗讀中");

    await page.click("#speech-stop");
    await expect(page.locator("#speech-status")).toHaveText("");
    await expect(page.locator(".s.is-current")).toHaveCount(0);
    await expect(page.locator("#speech-stop")).toBeDisabled();
  });

  test("the guided tour walks through the exhibit and can be ended", async ({ page }) => {
    await installFakeSpeech(page, 150);
    await openMuseum(page);
    await expect(page.locator("#tour-toggle")).toBeDisabled();
    await page.click(".hall-btn[data-hall='llama3']");
    await expect(page.locator("#tour-toggle")).toBeEnabled();

    await page.click("#tour-toggle");
    await expect(page.locator("#tour-progress")).toHaveText("第 1 / 11 站");
    await expect(page.locator("#model-card")).toHaveClass(/is-reading/);
    // The tour advances by itself once the narration of a stop finishes.
    await expect(page.locator("#tour-progress")).toHaveText("第 2 / 11 站", { timeout: 30_000 });
    // Make the remaining sentences very long so the tour holds still while we drive it manually.
    await page.evaluate(() => {
      window.__utteranceMs = 60_000;
    });
    await expect(page.locator(".detail-title")).toHaveText("Token 嵌入（128K 詞彙）");
    await expect(page.locator("#module-detail")).toHaveClass(/is-reading/);

    await page.click("#tour-next");
    await expect(page.locator("#tour-progress")).toHaveText("第 3 / 11 站");
    await expect(page.locator(".detail-title")).toHaveText("RMSNorm（前置正規化）");
    await expect
      .poll(() => page.evaluate(() => window.__utterances.some((u) => u.text.startsWith("RMSNorm"))))
      .toBe(true);

    await page.click("#tour-toggle");
    await expect(page.locator("#tour-progress")).toHaveText("");
    await expect(page.locator("#tour-toggle")).toContainText("開始導覽");
    await expect(page.locator("#speech-status")).toHaveText("");
  });

  test("pausing the narration holds the tour, and Stop ends it", async ({ page }) => {
    await installFakeSpeech(page, 400);
    await openMuseum(page, "#/llama3");
    await expect(page.locator("#tour-toggle")).toBeEnabled({ timeout: 15_000 });
    await page.click("#tour-toggle");
    await expect(page.locator("#tour-progress")).toHaveText("第 1 / 11 站");

    // Pause right away: the narration of stop 1 must not finish and advance the tour.
    await page.click("#speech-pause");
    await expect(page.locator("#speech-status")).toHaveText("已暫停");
    await page.waitForTimeout(4_500);
    await expect(page.locator("#tour-progress")).toHaveText("第 1 / 11 站 · 已暫停");

    // Resume: the tour continues to the next stop by itself.
    await page.click("#speech-pause");
    await expect(page.locator("#tour-progress")).toHaveText("第 2 / 11 站", { timeout: 30_000 });

    // Stop in the dock ends the tour rather than leaving it to auto-advance silently.
    await page.click("#speech-stop");
    await expect(page.locator("#tour-progress")).toHaveText("");
    await expect(page.locator("#tour-toggle")).toContainText("開始導覽");
    await page.waitForTimeout(3_000);
    await expect(page.locator("#tour-progress")).toHaveText("");
  });

  test("a speech engine that never starts is detected and reported instead of hanging", async ({ page }) => {
    await installFakeSpeech(page, 120, true);
    await openMuseum(page, "#/transformer/t-in-pos");
    await expect(page.locator(".detail-title")).toHaveText("位置編碼（正弦波）", { timeout: 15_000 });
    await page.click("[data-read='block']");
    await expect(page.locator("#speech-status")).toContainText("朗讀中");
    await expect(page.locator("#speech-status")).toContainText("語音引擎沒有回應", { timeout: 10_000 });
    await expect(page.locator(".s.is-current")).toHaveCount(0);
    await expect(page.locator("#speech-stop")).toBeDisabled();

    // The tour then falls back to timed advancing rather than waiting on speech.
    await page.click("#tour-toggle");
    await expect(page.locator("#tour-progress")).toHaveText("第 1 / 12 站");
    await page.click("#tour-next");
    await expect(page.locator("#tour-progress")).toHaveText("第 2 / 12 站");
    await expect(page.locator("#speech-status")).toContainText("語音引擎沒有回應");
  });

  test.describe("phone layout", () => {
    test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

    test("stacks the panel as a bottom sheet, hides unselected labels and opens the sheet on selection", async ({ page }) => {
      await openMuseum(page, "#/llama3");
      await expect(page.locator(".hall-btn[data-hall='llama3']")).toHaveClass(/is-active/, { timeout: 15_000 });

      const panel = await page.locator("#panel").boundingBox();
      const dock = await page.locator("#dock").boundingBox();
      const brand = await page.locator(".brand").boundingBox();
      const nav = await page.locator("#hall-nav").boundingBox();
      expect(panel && panel.width).toBeGreaterThan(380);
      expect(panel && panel.y).toBeGreaterThan(400);
      expect(dock && dock.height).toBeLessThan(70);
      expect(dock && panel && dock.y + dock.height).toBeLessThanOrEqual(panel.y + 1);
      // The hall navigation wraps onto its own row under the brand.
      expect(nav && brand && nav.y).toBeGreaterThan(brand.y + 20);

      // Only a selected block keeps its 3D label on a phone.
      await expect(page.locator(".lbl:visible")).toHaveCount(0);

      await page.click("#panel-toggle");
      await expect(page.locator("#panel")).toHaveClass(/is-collapsed/);
      await page.keyboard.press("ArrowRight");
      await expect(page.locator("#panel")).not.toHaveClass(/is-collapsed/);
      await expect(page.locator(".detail-title")).toHaveText("Token 嵌入（128K 詞彙）");
      await expect(page.locator(".lbl.is-selected:visible")).toHaveCount(1);
      await expect(page.locator(".lbl:visible")).toHaveCount(1);
    });
  });

  test("without a speech engine the controls explain why and the tour still advances", async ({ page }) => {
    await openMuseum(page);
    await page.click(".hall-btn[data-hall='transformer']");
    await expect(page.locator("#speech-status")).toContainText(/語音/);
    await page.click("#tour-toggle");
    await expect(page.locator("#tour-progress")).toHaveText("第 1 / 12 站");
    await page.click("#tour-next");
    await expect(page.locator("#tour-progress")).toHaveText("第 2 / 12 站");
    await expect(page.locator(".detail-title")).toHaveText("輸入嵌入");

    // Even with nothing to narrate, the visitor can hold the timed tour and release it.
    await expect(page.locator("#speech-pause")).toBeEnabled();
    await page.click("#speech-pause");
    await expect(page.locator("#tour-progress")).toHaveText("第 2 / 12 站 · 已暫停");
    await expect(page.locator("#speech-pause")).toContainText("繼續");
    await page.keyboard.press(" ");
    await expect(page.locator("#tour-progress")).toHaveText("第 2 / 12 站");
    await expect(page.locator("#speech-pause")).toContainText("暫停");
  });
});
