# 本週赤毒 · Kuva This Week

https://pekka1117.github.io/kuva-kuva-kuva/

Warframe 每週限購的 Kuva 來源清單。買過的打勾，就看得到週一重置前還剩多少 Kuva 沒領。進度存在瀏覽器的 localStorage，跨週（UTC 週一 00:00）自動歸零；還沒解鎖或不打算買的來源可以「略過」，跨週保留、不算進總數。

每個來源也列出解鎖條件、花費資源的取得方式、每次掉落量與期望值；頁底的表格算出湊滿一次購買要跑幾次（真期望與 90% 分位，`src/calc.ts` 逐一算所有掉落順序）。

A checklist of Warframe's weekly-capped Kuva sources. Tick off what you bought and see what's left before the Monday reset.

## 資料

來源、價格與每週上限取自 [wiki Kuva (Resource) § Vendor Sources](https://wiki.warframe.com/w/Kuva_(Resource)#Vendor_Sources)，2026-11-11 擷取，寫死在 `src/data.ts`。wiki 改版時更新那個檔案即可；`id` 是存檔 key，不要改。

## 開發

結構與 `../riven-splice` 相同：執行時無相依套件，TypeScript 與 esbuild 只在建置時使用。

- `index.html`：頁面 markup，是沒有 doctype/head 的片段（artifact 用）
- `src/main.ts`：渲染與事件；`data.ts` 是 wiki 資料與掉落量，`calc.ts` 是期望次數計算，`week.ts` 是週次計算，`state.ts` 是存檔，`i18n.ts` 是介面文字
- `src/theme-init.ts`：阻塞式腳本，畫面繪製前套用主題

`./build.sh` 會先跑 `tsc` 型別檢查，再用 esbuild 打包，並把 `index.html` 包成完整文件輸出到 `docs/`（GitHub Pages 從 `main` 分支的 `/docs` 發布）。發布 artifact 時，`docs/` 裡的 `main.js`、`theme-init.js`、`style.css` 要跟 `index.html` 一起帶上。

## 授權 · License

© 2026 PEKKA，以 [CC BY 4.0](LICENSE)（[摘要](https://creativecommons.org/licenses/by/4.0/deed.zh-hant)）授權。可以自由轉載、修改、商用，但散佈原版或改作時**必須**：

1. 標示作者 **PEKKA**，並附上原作連結（下方 repo 或網頁擇一，放在使用者看得到的地方，例如頁尾）；
2. 註明以 CC BY 4.0 授權並附授權連結；
3. 若有修改，註明已修改。

建議寫法：`基於 PEKKA 的 <a href="https://pekka1117.github.io/kuva-kuva-kuva/">kuva-kuva-kuva</a>（CC BY 4.0），已修改`

© 2026 PEKKA, licensed under [CC BY 4.0](LICENSE). You may share, adapt and use this commercially, but any redistribution or adaptation **must** credit **PEKKA** with a visible link to the original (the repo or the page below, e.g. in your footer), link the license, and say whether you changed it.

- https://github.com/PEKKA1117/kuva-kuva-kuva
- https://pekka1117.github.io/kuva-kuva-kuva/
