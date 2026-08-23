# ai-bench

用來比較多個 agent 做出來的網頁。每個實驗資料夾裡可以放多個 React / 靜態專案，並透過 GitHub Pages 一起部署。

部署後的入口：<https://google-fb.github.io/ai-bench/>

## 資料夾慣例

```text
<實驗名稱>/
  <agent 或專案名稱>/   ← 一個 React 專案或靜態站
```

目前的實驗：

| 資料夾 | 說明 |
| --- | --- |
| [`artificialanalysis/`](artificialanalysis/) | 多個 agent 重製同一份 Artificial Analysis 網頁的結果 |

每個子專案會對應一個網址：

```text
https://google-fb.github.io/ai-bench/<實驗名稱>/<專案名稱>/
```

## 部署方式

推到 `main` 後，[`.github/workflows/pages.yml`](.github/workflows/pages.yml) 會：

1. 掃描各實驗資料夾
2. 有 `package.json` 的專案會安裝依賴並 build（自動帶上 GitHub Pages 的 base path）
3. 已經是靜態檔（有 `index.html`）的資料夾會直接複製
4. 產生首頁與各實驗的索引頁
5. 部署到 GitHub Pages

第一次使用前，請在 GitHub repo 設定 **Settings → Pages → Source = GitHub Actions**。
