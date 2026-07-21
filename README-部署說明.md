# FanDiary PWA 部署說明

## 包裡有什麼

```
index.html            ← App 本體(已注入 PWA 標籤與安裝引導)
manifest.webmanifest  ← App 身分證:名稱、圖示、獨立視窗模式
sw.js                 ← Service Worker:離線快取(含 Google Fonts)
icons/                ← 5 個圖示(Android 192/512、maskable、iOS 180)
```

## 為什麼不能再用單一檔案

瀏覽器規定 Service Worker 必須是「同網域的獨立檔案」,不能內嵌;
而 Chrome 的「安裝」條件就是要有 Service Worker + manifest + HTTPS。
所以最小可安裝組合就是這 4 件,缺一不可。

## 部署(三選一,都免費)

### A. Netlify Drop(最快,拖進去就上線)
1. 開 https://app.netlify.com/drop
2. 把整個 pwa 資料夾拖進網頁
3. 拿到 https://xxxx.netlify.app 網址,完成

### B. GitHub Pages
1. 開一個 repo,把 4 件檔案放在根目錄(或 /docs)
2. Settings → Pages → 選分支與目錄 → Save
3. 網址是 https://帳號.github.io/repo名/

### C. Cloudflare Pages
1. https://pages.cloudflare.com → Create → Direct Upload
2. 上傳資料夾即可

⚠️ 一定要用 **https 網址**開啟。直接雙擊 index.html(file://)
   App 能用,但無法安裝、無法離線快取。

## 使用者怎麼安裝

- **Android(Chrome)**:開網址 → 設定頁點「📲 安裝到主畫面」會跳原生安裝視窗
  (或 Chrome 選單 ⋮ →「安裝應用程式」)
- **iPhone(必須用 Safari)**:分享 ⬆️ →「加入主畫面」→ 加入
  (App 內建圖解教學:設定 → 📲 安裝到主畫面)

## 資料注意事項(重要)

1. **資料綁網址**:localStorage / IndexedDB 依網域隔離。
   之前用檔案或其他網址累積的紀錄不會自動搬過來——
   請在舊的地方「設定 → 備份」,到新網址「還原」。
2. **請定期備份**:手機儲存空間吃緊時,系統有機率清掉網頁資料
   (iOS 對主畫面 App 較寬容,但仍建議每次大量記錄後備份一次)。
3. **更新 App**:改了 index.html 後,把 sw.js 第一行的
   目前為 `VERSION = 'fandiary-v7'`;下次更新請改成 v8,使用者重開 App 就會拿到新版。

## PWA 給了什麼 / 沒給什麼

✅ 主畫面圖示、全螢幕獨立視窗(無瀏覽器網址列)
✅ 離線可開(首次上線後,App 外殼與字型都有快取)
✅ 更新即時(改版不用等審核,重開即生效)
❌ 推播通知:iOS 16.4+ 才支援且體驗有限——搶票提醒目前仍靠
   App 內倒數 + 使用者自行設鬧鐘;未來若做原生包裝(Capacitor)可補上
❌ 上架 App Store / Google Play:PWA 不經商店;要上架時
   同一份程式碼可用 Capacitor 包成原生 App,再議

## v8 發佈提醒

本包已包含完整 `icons/` 資料夾。部署時請整個資料夾一起上傳，不要只替換 `index.html`；`sw.js` 已更新為 `fandiary-v8`，使用者重新開啟 App 後會取得新版快取。
