// 週次計算：Warframe 每週重置是 UTC 週一 00:00（台灣時間週一 08:00）
const DAY = 86_400_000;

// 本週起點（UTC 週一 00:00）的毫秒時間
export function weekStart(now: number): number {
  const d = new Date(now);
  const midnight = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  const sinceMon = (d.getUTCDay() + 6) % 7;  // 週一 = 0
  return midnight - sinceMon * DAY;
}

export const nextReset = (now: number): number => weekStart(now) + 7 * DAY;

// 存檔用的週次 key，例如 "2026-11-09"
export const weekKey = (now: number): string => new Date(weekStart(now)).toISOString().slice(0, 10);

// 剩餘時間拆成天、時、分（無條件進位到分，避免顯示 0 分但還沒重置）
export function untilReset(now: number): { d: number; h: number; m: number } {
  const mins = Math.ceil((nextReset(now) - now) / 60_000);
  return { d: Math.floor(mins / 1440), h: Math.floor((mins % 1440) / 60), m: mins % 60 };
}
