// 主題：auto = 不設 data-theme，跟著 prefers-color-scheme；light / dark 強制套用
export type Theme = "auto" | "light" | "dark";
export const THEME_KEY = "kuva-week-theme";

function currentTheme(): Theme {
  const t = document.documentElement.dataset.theme;
  return t === "light" || t === "dark" ? t : "auto";
}
export function showTheme(): void {
  const t = currentTheme();
  for (const b of document.querySelectorAll<HTMLElement>(".theme button")) b.setAttribute("aria-pressed", String(b.dataset.themeSet === t));
}
export function setTheme(t: Theme): void {
  if (t === "auto") delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = t;
  try { if (t === "auto") localStorage.removeItem(THEME_KEY); else localStorage.setItem(THEME_KEY, t); } catch { /* 忽略 */ }
  showTheme();
}
