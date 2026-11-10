// 在畫面繪製前同步套用記住的主題，避免深色模式閃白；必須是阻塞式的傳統 script，不能 defer
import { THEME_KEY } from "./theme";

try {
  const t = localStorage.getItem(THEME_KEY);
  if (t === "light" || t === "dark") document.documentElement.dataset.theme = t;
} catch { /* 忽略 */ }
