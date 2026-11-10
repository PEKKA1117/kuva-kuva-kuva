// 掉落量的機率計算：期望值、湊滿一次購買要跑幾次的真期望與 90% 分位
import type { Farm } from "./data";

// 一次掉落 = base + dice 個 min..max 的均勻整數，整體再乘上掉落機率
interface Spec { lo: number; hi: number; base: number; dice: number; chance: number }

export const hasSP = (f: Farm): boolean => f.minSP !== undefined && f.maxSP !== undefined;

function spec(f: Farm, sp: boolean): Spec {
  return {
    lo: sp ? f.minSP ?? f.min : f.min,
    hi: sp ? f.maxSP ?? f.max : f.max,
    base: (sp ? f.baseSP : undefined) ?? f.base ?? 0,
    dice: f.dice ?? 1,
    chance: f.chance ?? 1,
  };
}

// 一次掉落的範圍
export function span(f: Farm, sp: boolean): [number, number] {
  const s = spec(f, sp);
  return [s.base + s.dice * s.lo, s.base + s.dice * s.hi];
}

// 一次掉落的期望值
export function mean(f: Farm, sp: boolean): number {
  const s = spec(f, sp);
  return (s.base + s.dice * (s.lo + s.hi) / 2) * s.chance;
}

// 一次掉落的機率分布（數量 → 機率）
function dist(f: Farm, sp: boolean): Map<number, number> {
  const s = spec(f, sp);
  let d = new Map<number, number>([[s.base, 1]]);
  const w = 1 / (s.hi - s.lo + 1);
  for (let i = 0; i < s.dice; i++) {
    const nd = new Map<number, number>();
    for (const [v, p] of d) for (let k = s.lo; k <= s.hi; k++) nd.set(v + k, (nd.get(v + k) ?? 0) + p * w);
    d = nd;
  }
  if (s.chance < 1) {
    for (const [v, p] of d) d.set(v, p * s.chance);
    d.set(0, (d.get(0) ?? 0) + 1 - s.chance);
  }
  return d;
}

export interface Runs { naive: number; mean: number; q90: number }

// 累積到 need 個要跑幾次：naive = need ÷ 期望；mean = 真期望（最後一次會溢出，所以略大）；q90 = 90% 機率在幾次內
export function runs(f: Farm, sp: boolean, need: number): Runs {
  const d = [...dist(f, sp)];
  const p0 = d.find(([v]) => v === 0)?.[1] ?? 0;
  const pos = d.filter(([v]) => v > 0);
  // E[r] = 還差 r 個時的期望次數；E[r] = (1 + Σ p·E[r−k]) / (1 − p0)
  const E = new Float64Array(need + 1);
  for (let r = 1; r <= need; r++) {
    let s = 0;
    for (const [k, p] of pos) s += p * E[Math.max(r - k, 0)];
    E[r] = (1 + s) / (1 - p0);
  }
  // 逐次推進「已累積量」的分布，直到湊滿的機率 ≥ 90%
  let cur = new Float64Array(need + 1); cur[0] = 1;
  let t = 0;
  while (cur[need] < 0.9 && t < 100_000) {
    const nx = new Float64Array(need + 1);
    nx[need] = cur[need];
    for (let v = 0; v < need; v++) {
      if (!cur[v]) continue;
      for (const [k, p] of d) nx[Math.min(v + k, need)] += cur[v] * p;
    }
    cur = nx; t++;
  }
  return { naive: need / mean(f, sp), mean: E[need], q90: t };
}
