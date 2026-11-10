#!/usr/bin/env bash
# 型別檢查 src/、打包成 docs/main.js、theme-init.js、style.css，
# 再把 artifact 用的頁面片段 index.html 包成完整的 HTML 文件，輸出到 docs/ 給 GitHub Pages
# （artifact 發布時平台會自動補 doctype/head；獨立網站要自己補）
set -euo pipefail
cd "$(dirname "$0")"

SITE="https://pekka1117.github.io/kuva-kuva-kuva/"
mkdir -p docs

[[ -d node_modules ]] || npm ci
node_modules/.bin/tsc
# iife 而非 ESM：module script 不能從 file:// 載入；--charset=utf8 保留中文不轉成 \uXXXX
node_modules/.bin/esbuild src/main.ts src/theme-init.ts src/style.css \
  --bundle --format=iife --target=es2022 --charset=utf8 --outdir=docs --log-level=warning

{
cat <<EOF
<!doctype html>
<html lang="zh-Hant">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="Warframe 每週限購赤毒（Kuva）來源清單：勾掉買過的，看週一重置前還剩哪些沒領。">
<meta property="og:type" content="website">
<meta property="og:title" content="本週赤毒 · Kuva This Week">
<meta property="og:description" content="每週限購的赤毒來源一覽，勾掉買過的，看重置前還剩多少。">
<meta property="og:url" content="${SITE}">
<meta property="og:image" content="${SITE}preview.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/svg+xml" href="favicon.svg">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
</head>
<body>
EOF
cat index.html
cat <<EOF
</body>
</html>
EOF
} > docs/index.html

# 預覽圖：用頁面截圖（post/ 不進版控，沒有時沿用 docs/ 既有的）
[[ -f post/preview.png ]] && cp post/preview.png docs/preview.png

# 分頁圖示：SVG 給瀏覽器，180px PNG 給 iOS 主畫面（透明背景，用 headless chromium 轉）
cp favicon.svg docs/favicon.svg
if command -v chromium >/dev/null; then
  tmp=$(mktemp -d)
  printf '<html><body style="margin:0"><img src="file://%s" width="180" height="180"></body></html>' "$PWD/favicon.svg" > "$tmp/i.html"
  chromium --headless --disable-gpu --hide-scrollbars --allow-file-access-from-files \
    --default-background-color=00000000 --window-size=180,180 \
    --screenshot="$PWD/docs/apple-touch-icon.png" "file://$tmp/i.html" 2>/dev/null
  rm -rf "$tmp"
fi
wc -c docs/index.html docs/main.js docs/theme-init.js docs/style.css
