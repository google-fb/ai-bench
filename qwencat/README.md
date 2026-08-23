# qwencat

純前端用 WebGPU 跑 [Qwen3.5 0.8B](https://huggingface.co/onnx-community/Qwen3.5-0.8B-ONNX-OPT)。頁面會定時呼叫 [The Cat API](https://thecatapi.com/)，把新照片交給瀏覽器裡的模型，底部顯示繁體中文圖片摘要。

模型權重在使用者瀏覽器下載，不經過後端。沒有 WebGPU 時會退回 WASM。

本機：

```bash
cd qwencat
npm install
npm run dev
```

GitHub Pages：<https://google-fb.github.io/ai-bench/qwencat/>
