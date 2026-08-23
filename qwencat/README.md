# qwencat

純前端用 WebGPU 跑 [Qwen3.5 0.8B](https://huggingface.co/onnx-community/Qwen3.5-0.8B-ONNX-OPT)。頁面會定時呼叫 [The Cat API](https://thecatapi.com/)，把新照片交給瀏覽器裡的模型，底部顯示繁體中文圖片摘要。

模型權重在使用者瀏覽器下載，不經過後端（首次約 600–700 MB）。頁面會顯示下載進度條，編譯 WebGPU session 時改成不確定進度，避免以為卡住。沒有 WebGPU、或工作組記憶體低於 32 KB 的裝置會直接提示不支援。

本機：

```bash
cd qwencat
npm install
npm run dev
```

GitHub Pages：<https://google-fb.github.io/ai-bench/qwencat/>
