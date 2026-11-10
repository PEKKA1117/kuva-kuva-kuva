// 介面文字。en 是型別基準，zh 少任何一個 key 都會編譯失敗
import type { Named } from "./data";

const en = {
  eyebrow: "Warframe · Weekly Kuva", unit: "Kuva", needs: "Needs", get: "Farm",
  "theme-auto": "Auto", "theme-light": "Light", "theme-dark": "Dark", "theme-group": "Theme",
  title: "Kuva This Week",
  "sis-title": "Riven Splice Calculator",
  lede: "Every weekly-capped Kuva vendor in one list. Tick off what you bought and the page shows what is still on the table until the Monday reset. Progress stays in this browser and clears itself when the week turns over.",
  "week-of": (a: string, b: string) => `Week of ${a} – ${b} (UTC)`,
  "reset-in": (d: number, h: number, m: number) => `Resets in ${d ? `${d}d ` : ""}${h}h ${m}m`,
  "reset-at": (t: string) => `Monday 00:00 UTC · ${t} your time`,
  left: "Still to claim", of: (t: string) => `of ${t} this week`,
  "src-left": (n: number) => n === 1 ? "1 source not finished" : `${n} sources not finished`,
  "all-done": "Everything claimed. See you after reset.",
  claimed: (t: string) => `${t} claimed`,
  "skipped-out": (t: string) => `${t} left out by skipped sources`,
  "h-vendors": "Vendors", "h-vendors-sub": "Capped per week. Amounts are per purchase.",
  "h-weekly": "Other weekly", "h-weekly-sub": "Not a shop, still capped per week.",
  "h-skipped": (n: number) => `Skipped (${n})`, "h-skipped-sub": "Not unlocked yet, or not worth it to you. Kept across weeks and left out of the totals.",
  "h-extra": "Not tracked", "h-extra-sub": "No cap, chance-based, or not every week.",
  "per-week": (n: number) => `× ${n} a week`,
  each: "each",
  "cost-left": (s: string) => `${s} left to spend`,
  done: "Done", "mark-done": "Mark claimed", undo: "Undo",
  max: "Max", minus: (n: string) => `One fewer from ${n}`, plus: (n: string) => `One more from ${n}`,
  "count-label": (n: string) => `Purchases from ${n} this week`,
  skip: "Skip", unskip: "Restore", "skip-label": (n: string) => `Skip ${n}`, "unskip-label": (n: string) => `Restore ${n}`,
  "hide-done": "Hide finished",
  reset: "Clear this week", "reset-confirm": "Click again to clear",
  "new-week": "New week. Progress cleared.",
  expect: "Per buy",
  "exp-runs": (n: string, run: string) => `≈ ${n} × ${run}`,
  "exp-sp": (n: string) => ` (Steel Path ${n})`,
  "drop-tag": "Drops",
  drop: (res: string, run: string, r: string, e: string, pct: string) =>
    pct ? `${res}: ${pct} chance of ${r} per ${run}, expected ${e}` : `${res}: ${r} per ${run}` + (r.includes("–") ? `, expected ${e}` : ""),
  "drop-sp": (r: string, e: string) => ` (Steel Path ${r}` + (r.includes("–") ? `, expected ${e})` : ")"),
  "exp-and": " + ",
  "vendor-wiki": "Wiki",
  "h-runs": "Runs per purchase", "h-runs-sub": "How many runs it takes to farm one purchase.",
  "col-res": "Resource", "col-need": "Needed", "col-run": "Per run of",
  "col-naive": "Cost ÷ expected", "col-shown": "Shown above", "col-mean": "True average", "col-q90": "90% within",
  "col-n": "Normal", "col-sp": "Steel Path",
  "runs-note": `<p>One run drops a uniform random amount in the range listed in each card (Atramentum adds up 12 balloons separately), times the drop chance. <b>Cost ÷ expected</b> is the simple estimate, rounded up in the cards. The last run usually overshoots, so the <b>true average</b> number of runs is a little higher; it and the <b>90%</b> column are computed exactly over every possible drop sequence. Extra Talents from the Ramsled phase, Atramentum from enemies, other Riven Sliver sources and Yonta’s Pinion trade are not counted, so real numbers can be lower.</p>`,
  foot: `<p><b>Source.</b> Amounts, prices and limits from the <a href="https://wiki.warframe.com/w/Kuva_(Resource)#Vendor_Sources" target="_blank" rel="noopener">Kuva page on the Warframe wiki</a>, read on 11 Nov 2026. Icebind’s Kuva varies, so totals count its minimum and show “≥”. Vendors change with updates; check the wiki if a number looks off.</p>
<p><b>Reset.</b> Weekly limits reset on Monday at 00:00 UTC. Progress is saved only in this browser, so other devices start from zero.</p>`,
};
type Dict = typeof en;
export type Key = keyof Dict;
type Args<K extends Key> = Dict[K] extends (...args: infer A) => string ? A : [];

const zh: Dict = {
  eyebrow: "Warframe · 每週赤毒", unit: "赤毒", needs: "條件", get: "取得",
  "theme-auto": "自動", "theme-light": "淺色", "theme-dark": "深色", "theme-group": "主題",
  title: "本週赤毒",
  "sis-title": "紫卡拼接計算機",
  lede: "所有每週限購的赤毒來源列在同一頁。買過的打勾，就看得到週一重置前還剩哪些沒領。進度只存在這個瀏覽器，跨週會自動歸零。",
  "week-of": (a, b) => `本週 ${a} – ${b}（UTC）`,
  "reset-in": (d, h, m) => `${d ? `${d} 天 ` : ""}${h} 小時 ${m} 分後重置`,
  "reset-at": (t) => `UTC 週一 00:00・你的時間 ${t}`,
  left: "還沒領", of: (t) => `本週共 ${t}`,
  "src-left": (n) => `還有 ${n} 個來源沒領完`,
  "all-done": "全部領完了，重置後見。",
  claimed: (t) => `已領 ${t}`,
  "skipped-out": (t) => `略過的來源不計：${t}`,
  "h-vendors": "商店", "h-vendors-sub": "每週限購，赤毒數量為單次購買。",
  "h-weekly": "其他每週來源", "h-weekly-sub": "不是商店，但同樣有每週次數。",
  "h-skipped": (n) => `已略過（${n}）`, "h-skipped-sub": "還沒解鎖或不打算買的來源。跨週保留，不算進總數。",
  "h-extra": "不追蹤", "h-extra-sub": "不限次數、靠機率，或不是每週都有。",
  "per-week": (n) => `× ${n} 次／週`,
  each: "每次",
  "cost-left": (s) => `還要花 ${s}`,
  done: "已領", "mark-done": "標為已領", undo: "復原",
  max: "買滿", minus: (n) => `${n} 少一次`, plus: (n) => `${n} 多一次`,
  "count-label": (n) => `本週向 ${n} 購買的次數`,
  skip: "略過", unskip: "恢復", "skip-label": (n) => `略過 ${n}`, "unskip-label": (n) => `恢復 ${n}`,
  "hide-done": "隱藏已領完",
  reset: "清除本週進度", "reset-confirm": "再按一次確認清除",
  "new-week": "新的一週，進度已歸零。",
  expect: "每買一次",
  "exp-runs": (n, run) => `約 ${n} 次${/^[A-Za-z0-9]/.test(run) ? " " : ""}${run}`,  // 接英文名稱時補空格
  "exp-sp": (n) => `（鋼韌難度 ${n} 次）`,
  "drop-tag": "掉落",
  drop: (res, run, r, e, pct) => {
    const sp = /^[A-Za-z0-9]/.test(run) ? " " : "";
    return pct ? `${res}：每次${sp}${run} ${pct} 機率掉 ${r} 個，期望 ${e}` : `${res}：每次${sp}${run} ${r} 個` + (r.includes("–") ? `，期望 ${e}` : "");
  },
  "drop-sp": (r, e) => `（鋼韌難度 ${r}` + (r.includes("–") ? `，期望 ${e}）` : "）"),
  "exp-and": "＋",
  "vendor-wiki": "Wiki",
  "h-runs": "每買一次要跑幾次", "h-runs-sub": "湊滿一次購買需要的資源，要跑幾次。",
  "col-res": "資源", "col-need": "需要", "col-run": "每次跑",
  "col-naive": "花費 ÷ 期望", "col-shown": "上方顯示", "col-mean": "真期望", "col-q90": "90% 在幾次內",
  "col-n": "一般", "col-sp": "鋼韌",
  "runs-note": `<p>每次掉落量在卡片上的範圍內均勻隨機（黯墨是 12 顆氣球分別疊加），再乘上掉落機率。<b>花費 ÷ 期望</b>是簡化估算，上方卡片顯示的是它無條件進位。最後一次通常會拿超過需要的量，所以<b>真期望</b>次數會略高；真期望和 <b>90%</b> 兩欄是把所有可能的掉落順序逐一算出來的精確值。天賦任務 Ramsled 階段的額外獎勵、黯墨的敵人掉落、裂罅Mod碎片的其他來源、哲士 Yonta 的虛空翔羽交換都沒算進去，實際可能更少。</p>`,
  foot: `<p><b>來源。</b>數量、價格與購買上限取自 <a href="https://wiki.warframe.com/w/Kuva_(Resource)#Vendor_Sources" target="_blank" rel="noopener">Warframe wiki 的 Kuva 頁面</a>，2026 年 11 月 11 日擷取；中文譯名照遊戲繁中版。冰縛任務的赤毒數量不固定，總數以保底計，所以標成「≥」。商店內容會隨改版調整，數字看起來不對時請以 wiki 為準。</p>
<p><b>重置。</b>每週上限在 UTC 週一 00:00（台灣時間週一 08:00）重置。進度只存在這個瀏覽器，換裝置會從零開始。</p>`,
};

export type Lang = "en" | "zh";
const I18N: Record<Lang, Dict> = { en, zh };
const LANG_KEY = "kuva-week-lang";

export let lang: Lang = "zh";  // 預設正體中文；只有使用者按過語言鈕才記住

export function restoreLang(): void {
  try { const l = localStorage.getItem(LANG_KEY); if (l === "en" || l === "zh") lang = l; } catch { /* 忽略 */ }
}
export function setLang(l: Lang): void {
  lang = l;
  try { localStorage.setItem(LANG_KEY, lang); } catch { /* 忽略 */ }
}
export function tr<K extends Key>(key: K, ...args: Args<K>): string {
  const v = I18N[lang][key] as string | ((...a: Args<K>) => string);
  return typeof v === "function" ? v(...args) : v;
}
export const nm = (o: Named): string => o[lang];
