"use strict";
(() => {
  // src/data.ts
  var W = (en2, zh2) => ({ en: en2, zh: zh2 });
  var R = (en2, zh2, farm) => ({ name: W(en2, zh2), wiki: en2, farm });
  var RES = {
    sliver: R("Riven Sliver", "裂罅Mod碎片", { run: W("Eximus kill (level 30+)", "30 級以上卓越者擊殺"), min: 1, max: 1, chance: 0.02 }),
    pinion: R("Voidplume Pinion", "虛空翔羽", { run: W("Zariman mission", "扎里曼號任務"), min: 1, max: 1 }),
    steel: R("Steel Essence", "鋼韌精華", { run: W("Steel Path Incursion", "鋼韌難度每日 Incursion"), min: 5, max: 5 }),
    pathos: R("Pathos Clamp", "悲愴箍", { run: W("Orowyrm chest", "Orowyrm 寶箱"), min: 10, max: 10, minSP: 15, maxSP: 15 }),
    heart: R("Beating Heartstrings", "跳動心弦", { run: W("Stage Defense rotation", "舞台防禦輪次"), min: 4, max: 9, minSP: 7, maxSP: 12 }),
    husk: R("Scuttler Husk", "蛛繭", { run: W("Isleweaver run", "織島者任務"), min: 16, max: 20, minSP: 20, maxSP: 24 }),
    // 賞金 11–15（鋼韌 15–19）＋每個階段 1 朵隨機蘑菇 × 5 階段，已完整分析的可各堆肥成 1 個
    fergo: R("Fergolyte", "鐵光晶", { run: W("Deepmines bounty (incl. 5 composted mushrooms, 1 per stage)", "深谷賞金（含 5 朵蘑菇堆肥，每階段 1 朵）"), base: 5, min: 11, max: 15, minSP: 15, maxSP: 19 }),
    // 完成獎勵 15（鋼韌 25）＋ 12 顆氣球各 2–4（鋼韌 3–6）
    atra: R("Atramentum", "黯墨", { run: W("Follie’s Hunt", "Follie 的狩獵"), base: 15, baseSP: 25, dice: 12, min: 2, max: 4, minSP: 3, maxSP: 6 }),
    crimson: R("Crimson Talent", "赤紅天賦", { run: W("Scoria’s Angel", "Scoria’s Angel"), min: 12, max: 16, minSP: 18, maxSP: 22 }),
    emerald: R("Emerald Talent", "翠綠天賦", { run: W("The Kuva Wytch", "The Kuva Wytch"), min: 12, max: 16, minSP: 18, maxSP: 22 }),
    cryobell: { name: W("Cryobell", "冰鈴珠"), wiki: "Icebind" },
    // 每週在承體峰領 3 個，最多存 6 個
    entropic: R("Entropic Kuva", "熵變赤毒", { run: W("Entropic Eximus kill", "熵變卓越者擊殺"), min: 3, max: 5 })
  };
  var VENDORS = [
    {
      id: "palladino",
      kuva: 35e3,
      limit: 1,
      cost: [{ n: 10, item: RES.sliver }],
      vendor: W("Palladino", "Palladino"),
      vendorWiki: "Palladino",
      where: W("Iron Wake, Earth", "地球 鋼鐵防線"),
      get: W("Requiem Relics, Empyrean missions, and Eximus above level 30 (2%).", "開鎮魂遺物、Empyrean 任務、30 級以上卓越者（2%）。")
    },
    {
      id: "yonta",
      kuva: 35e3,
      limit: 1,
      cost: [{ n: 5, item: RES.pinion }],
      vendor: W("Archimedean Yonta", "哲士 Yonta"),
      vendorWiki: "Archimedean Yonta",
      where: W("Chrysalith, Zariman", "扎里曼 蛹巖"),
      get: W("Kill the dormant Void Angel in a Zariman mission, or trade with Yonta (one every 8 hours).", "扎里曼號任務中擊殺虛空天使，或與哲士 Yonta交換（每 8 小時一個）。")
    },
    {
      id: "teshin",
      kuva: 1e4,
      limit: 25,
      cost: [{ n: 15, item: RES.steel }],
      vendor: W("Teshin", "Teshin"),
      vendorWiki: "Teshin",
      where: W("Conclave room, any relay", "各中繼站"),
      get: W("Steel Path: 5 per daily Incursion (6 a day), 2 per Acolyte.", "鋼韌難度：每日 Incursion 每個 5 個（一天 6 個），侍僧每隻 2 個。")
    },
    {
      id: "acrithis-pathos",
      kuva: 1e4,
      limit: 1,
      cost: [{ n: 10, item: RES.pathos }],
      vendor: W("Acrithis", "言錄使"),
      vendorWiki: "Acrithis",
      where: W("Dormizone", "扎里曼 寢區／渡域"),
      req: [W("The Duviri Paradox quest", "完成系列任務《The Duviri Paradox》")],
      get: W("The Orowyrm chest in Duviri, or the Isleweaver boss chest.", "渡域 Orowyrm 寶箱，或織島者的頭目寶箱。")
    },
    {
      id: "flare",
      kuva: 14e3,
      limit: 3,
      cost: [{ n: 100, item: RES.heart }],
      vendor: W("Flare", "弗萊爾（Temple）"),
      vendorWiki: "Flare",
      where: W("Höllvania Central Mall", "霍爾瓦尼亞 商場"),
      req: [W("The Hex Rank 4 · Hot & Fresh", "集團 六煞 達到 4 級")],
      get: W("Stage Defense in Höllvania.", "霍爾瓦尼亞 舞台防禦任務。")
    },
    {
      id: "acrithis-scuttler",
      kuva: 14e3,
      limit: 3,
      cost: [{ n: 25, item: RES.husk }],
      vendor: W("Acrithis", "言錄使"),
      vendorWiki: "Acrithis",
      where: W("Dormizone", "扎里曼 寢區／渡域"),
      req: [W("The Hex quest", "完成系列任務《六煞》")],
      get: W("Isleweaver in Duviri.", "渡域 織島者任務。")
    },
    {
      id: "nightcap",
      kuva: 14e3,
      limit: 3,
      cost: [{ n: 75, item: RES.fergo }],
      vendor: W("Nightcap", "睡帽"),
      vendorWiki: "Nightcap",
      where: W("Fortuna, Venus", "金星 福爾圖娜"),
      req: [
        W("The New War quest", "完成系列任務《新紀之戰》"),
        W("Nightcap Rank 3 · Seeker (analyze mushrooms for his Field Guide)", "集團 睡帽 達到 3 級（提交各元素蘑菇集滿圖鑑）")
      ],
      get: W("Deepmines bounties on Venus. Once a mushroom is fully analyzed in Nightcap’s Field Guide, you can compost it for 1 Fergolyte each.", "金星深谷賞金。睡帽圖鑑裡完整分析過的蘑菇可以拿去堆肥，每朵換 1 個鐵光晶。")
    },
    {
      id: "zorba",
      kuva: 6e3,
      limit: 7,
      cost: [{ n: 500, item: RES.atra }],
      vendor: W("Aspirant Zorba", "見習仲裁者佐巴"),
      vendorWiki: "Aspirant Zorba",
      where: W("Any relay", "各中繼站"),
      get: W("Follie’s Hunt at Vesper Relay, Venus.", "金星 Vesper 中斷站—Follie 的狩獵。")
    },
    {
      id: "hunhow",
      kuva: 17e3,
      limit: 3,
      cost: [{ n: 35, item: RES.crimson }, { n: 35, item: RES.emerald }],
      vendor: W("Hunhow", "Hunhow"),
      vendorWiki: "Hunhow",
      where: W("Pontis Tower, Uranus", "天王星 龐提斯塔"),
      req: [W("Jade Shadows: Constellations quest", "完成系列任務《翠玉遺影：眾星》")],
      get: W("Two assassinations in Uranus Proxima: Scoria’s Angel for Crimson, The Kuva Wytch for Emerald.", "天王星比鄰星的兩關刺殺任務：Scoria’s Angel 掉赤紅，The Kuva Wytch 掉翠綠。")
    },
    {
      id: "melica",
      kuva: 10500,
      limit: 4,
      cost: [{ n: 150, item: RES.entropic }],
      vendor: W("Cephalon Melica", "中樞 Melica"),
      vendorWiki: "Cephalon Melica",
      where: W("Yuvan Peak or Zariman Ten Zero", "地球 承體峰／扎里曼 蛹巖"),
      get: W("Entropic Eximus units on the Zariman.", "扎里曼的熵變卓越者。")
    }
  ];
  var WEEKLY = [
    {
      id: "circuit-sp",
      kuva: 2e4,
      limit: 1,
      cost: [],
      vendor: W("The Circuit (Steel Path)", "無盡坐牢（鋼韌難度）"),
      vendorWiki: "The Circuit",
      where: W("Duviri", "扎里曼 寢區／渡域"),
      note: W("Pick Kuva as the Tier 5 or Tier 10 reward. Tiers 1–4 and 6–9 can roll more.", "自選 5 級或 10 級獎勵。1–4、6–9 級獎勵有機會再多赤毒。")
    },
    {
      id: "icebind",
      kuva: 7500,
      atLeast: true,
      limit: 3,
      cost: [{ n: 1, item: RES.cryobell }],
      vendor: W("Icebind", "冰縛任務"),
      vendorWiki: "Icebind",
      where: W("Yuvan Peak, Earth", "地球 承體峰"),
      req: [
        W("Angels of the Zariman quest", "完成系列任務《扎里曼的天使》"),
        W("Whispers in the Walls quest", "完成系列任務《牆中低語》"),
        W("Elite Deep Archimedea or Elite Temporal Archimedea unlocked", "解鎖火衛二解剖聖堂 精英深度探研，或霍爾瓦尼亞商場 精英時光探研")
      ],
      get: W(
        "Pick up 3 Cryobells at Yuvan Peak each weekly reset; you can hold up to 6. With a stock saved from earlier weeks you can run it up to 9 times in one week; this tracker counts the 3 new ones.",
        "每週重置後在承體峰撿 3 個，最多存 6 個。有前幾週存下的話，一週最多可以跑 9 次；這裡只算每週新拿的 3 次。"
      ),
      note: W(
        "After the ritual, open the chests in the frozen lab. Crested chest 7,500–100,000, plus 1,750–7,000 per side objective (3 per run). Counted here at the 7,500 minimum.",
        "儀式完成後傳送到冰封實驗室開寶箱。大寶箱 7,500–100,000，每完成一個支線再開小寶箱 1,750–7,000（每次 3 個支線）。這裡以保底 7,500 計。"
      )
    }
  ];
  var ALL = [...VENDORS, ...WEEKLY];
  var EXTRAS = [
    {
      kuva: "10,000",
      wiki: "Nightwave/Offerings",
      what: W("Nightwave Offerings, 50 Nightwave Credits each. Credits per season are limited; rank rewards also give Kuva.", "午夜電波，50 代幣換一次（每期代幣獲得量有限）。等級獎勵也有赤毒。")
    },
    {
      kuva: "10,000",
      wiki: "Arbitrations",
      what: W("Arbitrations vendor, 25 Vitus Essence each. No limit; the Arbitration changes every hour.", "仲裁商店，生息精華 25 個換一次，不限次數。仲裁每小時換一關。")
    },
    {
      kuva: "50,000",
      wiki: "The_Steel_Path",
      what: W("Teshin’s Steel Path Honors, 55 Steel Essence. In the rotation once every 8 weeks.", "Teshin，鋼韌精華 55 個換一次。每八週輪到一次。")
    },
    {
      kuva: "35,000",
      wiki: "Void_Surplus",
      what: W("Void Surplus from Baro Ki’Teer (every two weeks), possible reward.", "虛空商人（每兩週出現）的剩餘品，有機會開到。")
    },
    {
      kuva: "12,000",
      wiki: "Archon_Hunt",
      what: W("Weekly Archon Hunt, 12% chance.", "每週執政官刺殺，12% 機率。")
    },
    {
      kuva: "6,000",
      wiki: "Sortie",
      what: W("Daily Sortie, 12% chance.", "每日突擊任務，12% 機率。")
    },
    {
      kuva: "6,000",
      wiki: "1999_Calendar",
      what: W("1999 Calendar, sometimes offered.", "霍爾瓦尼亞月曆獎勵，有機會出現。")
    },
    {
      kuva: "7k / 14k / 21k",
      wiki: "Clan_Weekly_Initiatives",
      what: W("Clan Weekly Initiatives, tiers 2 / 3 / 4.", "氏族每週行動，第 2／3／4 階。")
    },
    {
      kuva: "1,200",
      wiki: "Requiem_Relic",
      what: W("Requiem Relics from Kuva Fortress Void Fissures, chance on open.", "赤毒要塞虛空裂縫任務，開鎮魂遺物有機會獲得。")
    },
    {
      kuva: "100–700",
      wiki: "Kuva_Fortress",
      what: W("Kuva Survival and Disruption on the Kuva Fortress. No limit; farm Steel Essence at the same time on Steel Path.", "赤毒要塞的赤毒生存（用催化劑採集）與中斷，不限次數。打鋼韌難度可以同時農鋼韌精華。")
    },
    {
      kuva: "550–1,400",
      wiki: "Kuva_Siphon",
      what: W("Kuva Siphon / Kuva Flood on nodes near the Kuva Fortress.", "赤毒要塞附近星圖的赤毒虹吸器／洪潮任務。")
    }
  ];
  var wikiUrl = (page) => "https://wiki.warframe.com/w/" + encodeURIComponent(page.replace(/ /g, "_")).replace(/%2F/g, "/");

  // src/calc.ts
  var hasSP = (f) => f.minSP !== void 0 && f.maxSP !== void 0;
  function spec(f, sp) {
    return {
      lo: sp ? f.minSP ?? f.min : f.min,
      hi: sp ? f.maxSP ?? f.max : f.max,
      base: (sp ? f.baseSP : void 0) ?? f.base ?? 0,
      dice: f.dice ?? 1,
      chance: f.chance ?? 1
    };
  }
  function span(f, sp) {
    const s = spec(f, sp);
    return [s.base + s.dice * s.lo, s.base + s.dice * s.hi];
  }
  function mean(f, sp) {
    const s = spec(f, sp);
    return (s.base + s.dice * (s.lo + s.hi) / 2) * s.chance;
  }
  function dist(f, sp) {
    const s = spec(f, sp);
    let d = /* @__PURE__ */ new Map([[s.base, 1]]);
    const w = 1 / (s.hi - s.lo + 1);
    for (let i = 0; i < s.dice; i++) {
      const nd = /* @__PURE__ */ new Map();
      for (const [v, p] of d) for (let k = s.lo; k <= s.hi; k++) nd.set(v + k, (nd.get(v + k) ?? 0) + p * w);
      d = nd;
    }
    if (s.chance < 1) {
      for (const [v, p] of d) d.set(v, p * s.chance);
      d.set(0, (d.get(0) ?? 0) + 1 - s.chance);
    }
    return d;
  }
  function runs(f, sp, need) {
    const d = [...dist(f, sp)];
    const p0 = d.find(([v]) => v === 0)?.[1] ?? 0;
    const pos = d.filter(([v]) => v > 0);
    const E = new Float64Array(need + 1);
    for (let r = 1; r <= need; r++) {
      let s = 0;
      for (const [k, p] of pos) s += p * E[Math.max(r - k, 0)];
      E[r] = (1 + s) / (1 - p0);
    }
    let cur = new Float64Array(need + 1);
    cur[0] = 1;
    let t = 0;
    while (cur[need] < 0.9 && t < 1e5) {
      const nx = new Float64Array(need + 1);
      nx[need] = cur[need];
      for (let v = 0; v < need; v++) {
        if (!cur[v]) continue;
        for (const [k, p] of d) nx[Math.min(v + k, need)] += cur[v] * p;
      }
      cur = nx;
      t++;
    }
    return { naive: need / mean(f, sp), mean: E[need], q90: t };
  }

  // src/dom.ts
  var $ = (id) => document.getElementById(id);
  var closest = (e, sel) => e.target.closest(sel);

  // src/i18n.ts
  var en = {
    eyebrow: "Warframe · Weekly Kuva",
    unit: "Kuva",
    needs: "Needs",
    get: "Farm",
    "theme-auto": "Auto",
    "theme-light": "Light",
    "theme-dark": "Dark",
    "theme-group": "Theme",
    title: "Kuva This Week",
    lede: "Every weekly-capped Kuva vendor in one list. Tick off what you bought and the page shows what is still on the table until the Monday reset. Progress stays in this browser and clears itself when the week turns over.",
    "week-of": (a, b) => `Week of ${a} – ${b} (UTC)`,
    "reset-in": (d, h, m) => `Resets in ${d ? `${d}d ` : ""}${h}h ${m}m`,
    "reset-at": (t) => `Monday 00:00 UTC · ${t} your time`,
    left: "Still to claim",
    of: (t) => `of ${t} this week`,
    "src-left": (n) => n === 1 ? "1 source not finished" : `${n} sources not finished`,
    "all-done": "Everything claimed. See you after reset.",
    claimed: (t) => `${t} claimed`,
    "skipped-out": (t) => `${t} left out by skipped sources`,
    "h-vendors": "Vendors",
    "h-vendors-sub": "Capped per week. Amounts are per purchase.",
    "h-weekly": "Other weekly",
    "h-weekly-sub": "Not a shop, still capped per week.",
    "h-skipped": (n) => `Skipped (${n})`,
    "h-skipped-sub": "Not unlocked yet, or not worth it to you. Kept across weeks and left out of the totals.",
    "h-extra": "Not tracked",
    "h-extra-sub": "No cap, chance-based, or not every week.",
    "per-week": (n) => `× ${n} a week`,
    each: "each",
    "cost-left": (s) => `${s} left to spend`,
    done: "Done",
    "mark-done": "Mark claimed",
    undo: "Undo",
    max: "Max",
    minus: (n) => `One fewer from ${n}`,
    plus: (n) => `One more from ${n}`,
    "count-label": (n) => `Purchases from ${n} this week`,
    skip: "Skip",
    unskip: "Restore",
    "skip-label": (n) => `Skip ${n}`,
    "unskip-label": (n) => `Restore ${n}`,
    "hide-done": "Hide finished",
    reset: "Clear this week",
    "reset-confirm": "Click again to clear",
    "new-week": "New week. Progress cleared.",
    expect: "Per buy",
    "exp-runs": (n, run) => `≈ ${n} × ${run}`,
    "exp-sp": (n) => ` (Steel Path ${n})`,
    "drop-tag": "Drops",
    drop: (res, run, r, e, pct) => pct ? `${res}: ${pct} chance of ${r} per ${run}, expected ${e}` : `${res}: ${r} per ${run}` + (r.includes("–") ? `, expected ${e}` : ""),
    "drop-sp": (r, e) => ` (Steel Path ${r}` + (r.includes("–") ? `, expected ${e})` : ")"),
    "exp-and": " + ",
    "vendor-wiki": "Wiki",
    "h-runs": "Runs per purchase",
    "h-runs-sub": "How many runs it takes to farm one purchase.",
    "col-res": "Resource",
    "col-need": "Needed",
    "col-run": "Per run of",
    "col-naive": "Cost ÷ expected",
    "col-shown": "Shown above",
    "col-mean": "True average",
    "col-q90": "90% within",
    "col-n": "Normal",
    "col-sp": "Steel Path",
    "runs-note": `<p>One run drops a uniform random amount in the range listed in each card (Atramentum adds up 12 balloons separately), times the drop chance. <b>Cost ÷ expected</b> is the simple estimate, rounded up in the cards. The last run usually overshoots, so the <b>true average</b> number of runs is a little higher; it and the <b>90%</b> column are computed exactly over every possible drop sequence. Extra Talents from the Ramsled phase, Atramentum from enemies, other Riven Sliver sources and Yonta’s Pinion trade are not counted, so real numbers can be lower.</p>`,
    foot: `<p><b>Source.</b> Amounts, prices and limits from the <a href="https://wiki.warframe.com/w/Kuva_(Resource)#Vendor_Sources" target="_blank" rel="noopener">Kuva page on the Warframe wiki</a>, read on 11 Nov 2026. Icebind’s Kuva varies, so totals count its minimum and show “≥”. Vendors change with updates; check the wiki if a number looks off.</p>
<p><b>Reset.</b> Weekly limits reset on Monday at 00:00 UTC. Progress is saved only in this browser, so other devices start from zero.</p>`
  };
  var zh = {
    eyebrow: "Warframe · 每週赤毒",
    unit: "赤毒",
    needs: "條件",
    get: "取得",
    "theme-auto": "自動",
    "theme-light": "淺色",
    "theme-dark": "深色",
    "theme-group": "主題",
    title: "本週赤毒",
    lede: "所有每週限購的赤毒來源列在同一頁。買過的打勾，就看得到週一重置前還剩哪些沒領。進度只存在這個瀏覽器，跨週會自動歸零。",
    "week-of": (a, b) => `本週 ${a} – ${b}（UTC）`,
    "reset-in": (d, h, m) => `${d ? `${d} 天 ` : ""}${h} 小時 ${m} 分後重置`,
    "reset-at": (t) => `UTC 週一 00:00・你的時間 ${t}`,
    left: "還沒領",
    of: (t) => `本週共 ${t}`,
    "src-left": (n) => `還有 ${n} 個來源沒領完`,
    "all-done": "全部領完了，重置後見。",
    claimed: (t) => `已領 ${t}`,
    "skipped-out": (t) => `略過的來源不計：${t}`,
    "h-vendors": "商店",
    "h-vendors-sub": "每週限購，赤毒數量為單次購買。",
    "h-weekly": "其他每週來源",
    "h-weekly-sub": "不是商店，但同樣有每週次數。",
    "h-skipped": (n) => `已略過（${n}）`,
    "h-skipped-sub": "還沒解鎖或不打算買的來源。跨週保留，不算進總數。",
    "h-extra": "不追蹤",
    "h-extra-sub": "不限次數、靠機率，或不是每週都有。",
    "per-week": (n) => `× ${n} 次／週`,
    each: "每次",
    "cost-left": (s) => `還要花 ${s}`,
    done: "已領",
    "mark-done": "標為已領",
    undo: "復原",
    max: "買滿",
    minus: (n) => `${n} 少一次`,
    plus: (n) => `${n} 多一次`,
    "count-label": (n) => `本週向 ${n} 購買的次數`,
    skip: "略過",
    unskip: "恢復",
    "skip-label": (n) => `略過 ${n}`,
    "unskip-label": (n) => `恢復 ${n}`,
    "hide-done": "隱藏已領完",
    reset: "清除本週進度",
    "reset-confirm": "再按一次確認清除",
    "new-week": "新的一週，進度已歸零。",
    expect: "每買一次",
    "exp-runs": (n, run) => `約 ${n} 次${/^[A-Za-z0-9]/.test(run) ? " " : ""}${run}`,
    // 接英文名稱時補空格
    "exp-sp": (n) => `（鋼韌難度 ${n} 次）`,
    "drop-tag": "掉落",
    drop: (res, run, r, e, pct) => {
      const sp = /^[A-Za-z0-9]/.test(run) ? " " : "";
      return pct ? `${res}：每次${sp}${run} ${pct} 機率掉 ${r} 個，期望 ${e}` : `${res}：每次${sp}${run} ${r} 個` + (r.includes("–") ? `，期望 ${e}` : "");
    },
    "drop-sp": (r, e) => `（鋼韌難度 ${r}` + (r.includes("–") ? `，期望 ${e}）` : "）"),
    "exp-and": "＋",
    "vendor-wiki": "Wiki",
    "h-runs": "每買一次要跑幾次",
    "h-runs-sub": "湊滿一次購買需要的資源，要跑幾次。",
    "col-res": "資源",
    "col-need": "需要",
    "col-run": "每次跑",
    "col-naive": "花費 ÷ 期望",
    "col-shown": "上方顯示",
    "col-mean": "真期望",
    "col-q90": "90% 在幾次內",
    "col-n": "一般",
    "col-sp": "鋼韌",
    "runs-note": `<p>每次掉落量在卡片上的範圍內均勻隨機（黯墨是 12 顆氣球分別疊加），再乘上掉落機率。<b>花費 ÷ 期望</b>是簡化估算，上方卡片顯示的是它無條件進位。最後一次通常會拿超過需要的量，所以<b>真期望</b>次數會略高；真期望和 <b>90%</b> 兩欄是把所有可能的掉落順序逐一算出來的精確值。天賦任務 Ramsled 階段的額外獎勵、黯墨的敵人掉落、裂罅Mod碎片的其他來源、哲士 Yonta 的虛空翔羽交換都沒算進去，實際可能更少。</p>`,
    foot: `<p><b>來源。</b>數量、價格與購買上限取自 <a href="https://wiki.warframe.com/w/Kuva_(Resource)#Vendor_Sources" target="_blank" rel="noopener">Warframe wiki 的 Kuva 頁面</a>，2026 年 11 月 11 日擷取；中文譯名照遊戲繁中版。冰縛任務的赤毒數量不固定，總數以保底計，所以標成「≥」。商店內容會隨改版調整，數字看起來不對時請以 wiki 為準。</p>
<p><b>重置。</b>每週上限在 UTC 週一 00:00（台灣時間週一 08:00）重置。進度只存在這個瀏覽器，換裝置會從零開始。</p>`
  };
  var I18N = { en, zh };
  var LANG_KEY = "kuva-week-lang";
  var lang = "zh";
  function restoreLang() {
    try {
      const l = localStorage.getItem(LANG_KEY);
      if (l === "en" || l === "zh") lang = l;
    } catch {
    }
  }
  function setLang(l) {
    lang = l;
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch {
    }
  }
  function tr(key, ...args) {
    const v = I18N[lang][key];
    return typeof v === "function" ? v(...args) : v;
  }
  var nm = (o) => o[lang];

  // src/week.ts
  var DAY = 864e5;
  function weekStart(now) {
    const d = new Date(now);
    const midnight = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
    const sinceMon = (d.getUTCDay() + 6) % 7;
    return midnight - sinceMon * DAY;
  }
  var nextReset = (now) => weekStart(now) + 7 * DAY;
  var weekKey = (now) => new Date(weekStart(now)).toISOString().slice(0, 10);
  function untilReset(now) {
    const mins = Math.ceil((nextReset(now) - now) / 6e4);
    return { d: Math.floor(mins / 1440), h: Math.floor(mins % 1440 / 60), m: mins % 60 };
  }

  // src/state.ts
  var KEY = "kuva-week-state";
  var fresh = (now) => ({ week: weekKey(now), counts: {}, skip: [], hideDone: false });
  function load(now) {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return fresh(now);
      const s = JSON.parse(raw);
      const ids = new Set(ALL.map((x) => x.id));
      const counts = {};
      for (const [k, v] of Object.entries(s.counts ?? {})) if (ids.has(k) && typeof v === "number") counts[k] = v;
      return {
        week: typeof s.week === "string" ? s.week : weekKey(now),
        counts,
        skip: Array.isArray(s.skip) ? s.skip.filter((id) => ids.has(id)) : [],
        hideDone: s.hideDone === true
      };
    } catch {
      return fresh(now);
    }
  }
  function save(s) {
    try {
      localStorage.setItem(KEY, JSON.stringify(s));
    } catch {
    }
  }
  function rollover(s, now) {
    const k = weekKey(now);
    if (s.week === k) return false;
    s.week = k;
    s.counts = {};
    return true;
  }

  // src/theme.ts
  var THEME_KEY = "kuva-week-theme";
  function currentTheme() {
    const t = document.documentElement.dataset.theme;
    return t === "light" || t === "dark" ? t : "auto";
  }
  function showTheme() {
    const t = currentTheme();
    for (const b of document.querySelectorAll(".theme button")) b.setAttribute("aria-pressed", String(b.dataset.themeSet === t));
  }
  function setTheme(t) {
    if (t === "auto") delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = t;
    try {
      if (t === "auto") localStorage.removeItem(THEME_KEY);
      else localStorage.setItem(THEME_KEY, t);
    } catch {
    }
    showTheme();
  }

  // src/main.ts
  var fmt = (n) => n.toLocaleString("en-US");
  var byId = new Map(ALL.map((s) => [s.id, s]));
  var st = load(Date.now());
  if (rollover(st, Date.now())) save(st);
  var count = (s) => Math.min(st.counts[s.id] ?? 0, s.limit);
  var isSkipped = (s) => st.skip.includes(s.id);
  var leftOf = (s) => (s.limit - count(s)) * s.kuva;
  function costText(s, times) {
    return s.cost.map((c) => `${fmt(c.n * times)} ${nm(c.item.name)}`).join(" + ");
  }
  function costLinks(s) {
    return s.cost.map((c) => `${fmt(c.n)} <a href="${wikiUrl(c.item.wiki)}" target="_blank" rel="noopener">${nm(c.item.name)}</a>`).join(" + ");
  }
  var num1 = (n) => (Math.round(n * 100) / 100).toLocaleString("en-US");
  var range = ([a, b]) => a === b ? fmt(a) : `${fmt(a)}–${fmt(b)}`;
  function dropText(s) {
    return s.cost.map((c) => {
      const f = c.item.farm;
      if (!f) return "";
      const sp = hasSP(f) ? tr("drop-sp", range(span(f, true)), num1(mean(f, true))) : "";
      return tr("drop", nm(c.item.name), nm(f.run), range(span(f, false)), num1(mean(f, false)), f.chance ? `${f.chance * 100}%` : "") + sp;
    }).filter(Boolean).join("<br>");
  }
  function expectText(s) {
    return s.cost.map((c) => {
      const f = c.item.farm;
      if (!f) return "";
      const n = Math.ceil(c.n / mean(f, false));
      const sp = hasSP(f) ? Math.ceil(c.n / mean(f, true)) : 0;
      return tr("exp-runs", fmt(n), nm(f.run)) + (sp && sp !== n ? tr("exp-sp", fmt(sp)) : "");
    }).filter(Boolean).join(tr("exp-and"));
  }
  var runsCache = /* @__PURE__ */ new Map();
  function renderRunsTable() {
    const seen = /* @__PURE__ */ new Set();
    const rows = [];
    for (const s of ALL) for (const c of s.cost) {
      const f = c.item.farm;
      const key = `${c.item.wiki}:${c.n}`;
      if (!f || seen.has(key)) continue;
      seen.add(key);
      const cell = (sp, pick) => {
        if (sp && !hasSP(f)) return "—";
        const k = `${key}:${sp}`;
        let r = runsCache.get(k);
        if (!r) {
          r = runs(f, sp, c.n);
          runsCache.set(k, r);
        }
        return pick(r);
      };
      const pair = (pick) => `<td class="num">${cell(false, pick)}</td><td class="num sp">${cell(true, pick)}</td>`;
      rows.push(`<tr>
      <th scope="row"><a href="${wikiUrl(c.item.wiki)}" target="_blank" rel="noopener">${nm(c.item.name)}</a></th>
      <td class="num">${fmt(c.n)}</td>
      <td>${nm(f.run)}</td>
      ${pair((r) => num1(r.naive))}
      ${pair((r) => fmt(Math.ceil(r.naive)))}
      ${pair((r) => r.mean.toFixed(1))}
      ${pair((r) => `<b>${fmt(r.q90)}</b>`)}
    </tr>`);
    }
    $("runs-body").innerHTML = rows.join("");
  }
  function pips(s) {
    const n = count(s);
    if (s.limit === 1) return "";
    if (s.limit <= 7) return `<div class="pips" aria-hidden="true">${Array.from({ length: s.limit }, (_, i) => `<i class="${i < n ? "on" : ""}"></i>`).join("")}</div>`;
    return `<div class="pips bar" aria-hidden="true"><i style="width:${n / s.limit * 100}%"></i></div>`;
  }
  function vendorName(s) {
    return `<a href="${wikiUrl(s.vendorWiki)}" target="_blank" rel="noopener">${nm(s.vendor)}</a>`;
  }
  var ge = (s) => s.atLeast ? "≥ " : "";
  function row(s) {
    const n = count(s), done = n >= s.limit, left = leftOf(s), name = nm(s.vendor);
    const costEach = s.cost.length ? `${costLinks(s)} <span class="muted">${tr("each")}</span>` : "";
    const exp = expectText(s), drop = dropText(s);
    const costLeft = s.cost.length && !done && n > 0 ? `<span class="cost-left">${tr("cost-left", costText(s, s.limit - n))}</span>` : "";
    const ctl = s.limit === 1 ? `<button type="button" class="tick" data-act="toggle" aria-pressed="${done}">${done ? `✓ ${tr("done")}` : tr("mark-done")}</button>` : `<div class="stepper">
         <button type="button" data-act="minus" aria-label="${tr("minus", name)}" ${n === 0 ? "disabled" : ""}>−</button>
         <output class="num" aria-label="${tr("count-label", name)}"><b>${n}</b>/${s.limit}</output>
         <button type="button" data-act="plus" aria-label="${tr("plus", name)}" ${done ? "disabled" : ""}>+</button>
       </div>
       <button type="button" class="ghost" data-act="${done ? "zero" : "max"}">${done ? tr("undo") : tr("max")}</button>`;
    return `<article class="src${done ? " is-done" : ""}" data-id="${s.id}">
    <div class="amt">
      <div class="num left">${done ? `<span class="pill">✓ ${tr("done")}</span>` : ge(s) + fmt(left)}</div>
      <div class="per num muted">${ge(s)}${fmt(s.kuva)} ${tr("per-week", s.limit)}</div>
    </div>
    <div class="info">
      <div class="who">${vendorName(s)} <span class="where muted">· ${nm(s.where)}</span></div>
      ${costEach ? `<div class="cost small">${costEach}${costLeft ? " · " + costLeft : ""}</div>` : ""}
      ${s.req ? `<div class="req small muted"><span class="tag">${tr("needs")}</span>${s.req.map(nm).join("<br>")}</div>` : ""}
      ${s.get ? `<div class="req small muted"><span class="tag">${tr("get")}</span>${nm(s.get)}</div>` : ""}
      ${drop ? `<div class="req small muted"><span class="tag">${tr("drop-tag")}</span><span>${drop}</span></div>` : ""}
      ${exp ? `<div class="req small muted"><span class="tag">${tr("expect")}</span>${exp}</div>` : ""}
      ${s.note ? `<div class="req small muted">${nm(s.note)}</div>` : ""}
      ${pips(s)}
    </div>
    <div class="ctl">
      ${ctl}
      <button type="button" class="skip" data-act="skip" aria-label="${tr("skip-label", name)}" title="${tr("skip-label", name)}">${tr("skip")}</button>
    </div>
  </article>`;
  }
  function skippedRow(s) {
    return `<article class="src mini" data-id="${s.id}">
    <div class="who">${vendorName(s)} <span class="where muted">· ${nm(s.where)}</span></div>
    <div class="per num muted">${ge(s)}${fmt(s.kuva * s.limit)} ${tr("unit")}</div>
    <button type="button" class="ghost" data-act="unskip" aria-label="${tr("unskip-label", nm(s.vendor))}">${tr("unskip")}</button>
  </article>`;
  }
  function renderLists() {
    const vis = (s) => !isSkipped(s) && !(st.hideDone && count(s) >= s.limit);
    $("list-vendors").innerHTML = VENDORS.filter(vis).map(row).join("");
    $("list-weekly").innerHTML = WEEKLY.filter(vis).map(row).join("");
    const sk = ALL.filter(isSkipped);
    $("sec-skipped").hidden = sk.length === 0;
    $("h-skipped").textContent = tr("h-skipped", sk.length);
    $("list-skipped").innerHTML = sk.map(skippedRow).join("");
  }
  function renderSummary() {
    const active = ALL.filter((s) => !isSkipped(s));
    const total = active.reduce((a, s) => a + s.kuva * s.limit, 0);
    const left = active.reduce((a, s) => a + leftOf(s), 0);
    const open = active.filter((s) => count(s) < s.limit).length;
    const skippedOut = ALL.filter(isSkipped).reduce((a, s) => a + leftOf(s), 0);
    const approx = active.some((s) => s.atLeast && count(s) < s.limit) ? "≥ " : "";
    $("left-ge").textContent = approx;
    $("left-n").textContent = fmt(left);
    $("left-of").textContent = tr("of", (active.some((s) => s.atLeast) ? "≥ " : "") + fmt(total));
    $("meter-fill").style.width = total ? `${left / total * 100}%` : "0%";
    $("src-left").textContent = open ? tr("src-left", open) : tr("all-done");
    $("claimed").textContent = tr("claimed", fmt(total - left));
    $("skipped-out").textContent = skippedOut ? tr("skipped-out", fmt(skippedOut)) : "";
  }
  function renderClock() {
    const now = Date.now();
    const ws = weekStart(now);
    const md = (t) => {
      const d = new Date(t);
      return `${d.getUTCMonth() + 1}/${d.getUTCDate()}`;
    };
    $("week-of").textContent = tr("week-of", md(ws), md(ws + 6 * 864e5));
    const u = untilReset(now);
    $("reset-in").textContent = tr("reset-in", u.d, u.h, u.m);
    const local = new Date(nextReset(now)).toLocaleString(lang === "zh" ? "zh-TW" : "en-US", {
      weekday: "short",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
    $("reset-at").textContent = tr("reset-at", local);
  }
  function renderStatic() {
    document.documentElement.lang = lang === "zh" ? "zh-Hant" : "en";
    for (const el of document.querySelectorAll("[data-t]")) {
      const v = tr(el.dataset.t ?? "");
      if (el.hasAttribute("data-html")) el.innerHTML = v;
      else el.textContent = v;
    }
    $("theme-group").setAttribute("aria-label", tr("theme-group"));
    for (const b of document.querySelectorAll(".lang button")) b.setAttribute("aria-pressed", String(b.dataset.lang === lang));
    $("hide-done").checked = st.hideDone;
    $("extras").innerHTML = EXTRAS.map((x) => `<li><span class="num kv">${x.kuva}</span><span>${nm(x.what)} <a href="${wikiUrl(x.wiki)}" target="_blank" rel="noopener">${tr("vendor-wiki")}</a></span></li>`).join("");
    renderRunsTable();
    showTheme();
  }
  function renderAll() {
    renderStatic();
    renderLists();
    renderSummary();
    renderClock();
  }
  function commit() {
    save(st);
    renderLists();
    renderSummary();
  }
  function act(id, a) {
    const s = byId.get(id);
    if (!s) return;
    const n = count(s);
    const set = (v) => {
      if (v <= 0) delete st.counts[id];
      else st.counts[id] = Math.min(v, s.limit);
    };
    switch (a) {
      case "plus":
        set(n + 1);
        break;
      case "minus":
        set(n - 1);
        break;
      case "max":
        set(s.limit);
        break;
      case "zero":
        set(0);
        break;
      case "toggle":
        set(n >= s.limit ? 0 : s.limit);
        break;
      case "skip":
        if (!st.skip.includes(id)) st.skip.push(id);
        break;
      case "unskip":
        st.skip = st.skip.filter((x) => x !== id);
        break;
    }
    commit();
    const el = document.querySelector(`[data-id="${id}"] [data-act="${a}"]`) ?? document.querySelector(`[data-id="${id}"] [data-act]:not([disabled])`);
    el?.focus();
  }
  document.addEventListener("click", (e) => {
    const b = closest(e, "button[data-act]");
    const card = b && closest(e, "[data-id]");
    if (b && card?.dataset.id) act(card.dataset.id, b.dataset.act ?? "");
    const th = closest(e, "[data-theme-set]");
    if (th) setTheme(th.dataset.themeSet);
    const lg = closest(e, "[data-lang]");
    if (lg && (lg.dataset.lang === "en" || lg.dataset.lang === "zh")) {
      setLang(lg.dataset.lang);
      renderAll();
    }
  });
  $("hide-done").addEventListener("change", (e) => {
    st.hideDone = e.target.checked;
    commit();
  });
  var armed = 0;
  $("reset-week").addEventListener("click", () => {
    const b = $("reset-week");
    if (!armed) {
      b.textContent = tr("reset-confirm");
      b.classList.add("armed");
      armed = window.setTimeout(() => {
        armed = 0;
        b.textContent = tr("reset");
        b.classList.remove("armed");
      }, 4e3);
      return;
    }
    clearTimeout(armed);
    armed = 0;
    b.textContent = tr("reset");
    b.classList.remove("armed");
    st.counts = {};
    commit();
  });
  function toast(msg) {
    const t = $("toast");
    t.textContent = msg;
    window.setTimeout(() => {
      if (t.textContent === msg) t.textContent = "";
    }, 8e3);
  }
  function tick() {
    if (rollover(st, Date.now())) {
      save(st);
      commit();
      toast(tr("new-week"));
    }
    renderClock();
  }
  window.setInterval(tick, 2e4);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) tick();
  });
  window.addEventListener("storage", (e) => {
    if (e.key === "kuva-week-state") {
      st = load(Date.now());
      rollover(st, Date.now());
      renderAll();
    }
  });
  restoreLang();
  renderAll();
})();
