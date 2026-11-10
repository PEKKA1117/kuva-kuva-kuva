// 進度存在 localStorage：每週的購買次數（跨週自動歸零）＋跨週保留的「略過」清單與篩選
import { ALL } from "./data";
import { weekKey } from "./week";

const KEY = "kuva-week-state";

export interface State {
  week: string;
  counts: Record<string, number>;
  skip: string[];       // 還沒解鎖或不打算買的來源，跨週保留
  hideDone: boolean;
}

const fresh = (now: number): State => ({ week: weekKey(now), counts: {}, skip: [], hideDone: false });

export function load(now: number): State {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return fresh(now);
    const s = JSON.parse(raw) as Partial<State>;
    const ids = new Set(ALL.map(x => x.id));
    const counts: Record<string, number> = {};
    for (const [k, v] of Object.entries(s.counts ?? {})) if (ids.has(k) && typeof v === "number") counts[k] = v;
    return {
      week: typeof s.week === "string" ? s.week : weekKey(now),
      counts,
      skip: Array.isArray(s.skip) ? s.skip.filter(id => ids.has(id)) : [],
      hideDone: s.hideDone === true,
    };
  } catch { return fresh(now); }
}

export function save(s: State): void {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* 忽略：私密視窗等情況 */ }
}

// 跨週就把次數歸零；回傳是否真的換了週
export function rollover(s: State, now: number): boolean {
  const k = weekKey(now);
  if (s.week === k) return false;
  s.week = k;
  s.counts = {};
  return true;
}
