"use strict";
(() => {
  // src/theme.ts
  var THEME_KEY = "kuva-week-theme";

  // src/theme-init.ts
  try {
    const t = localStorage.getItem(THEME_KEY);
    if (t === "light" || t === "dark") document.documentElement.dataset.theme = t;
  } catch {
  }
})();
