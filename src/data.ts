// Kuva 每週來源，取自 wiki「Kuva (Resource)」的 Vendor Sources / Other Sources 段落
// https://wiki.warframe.com/w/Kuva_(Resource)#Vendor_Sources（2026-11-11 擷取）
// 中文名稱用遊戲繁中譯名；英文照 wiki

export interface Named { en: string; zh: string }

const W = (en: string, zh: string): Named => ({ en, zh });

// 一次「跑圖」掉多少資源，用來算期望值與買一次要跑幾次（數字照 wiki）
export interface Farm {
  run: Named;            // 一次跑的是什麼
  // 一次掉落 = base + dice 個 min..max 的均勻整數（dice 預設 1、base 預設 0），整體再乘上 chance
  min: number; max: number;          // 一般難度
  minSP?: number; maxSP?: number;    // 鋼韌難度
  base?: number; baseSP?: number;    // 固定獎勵
  dice?: number;
  chance?: number;       // 掉落機率（沒有就是必掉）
}

export interface Res { name: Named; wiki: string; farm?: Farm }

const R = (en: string, zh: string, farm?: Farm): Res => ({ name: W(en, zh), wiki: en, farm });

// 資源名稱與掉落量
const RES = {
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
  crimson: R("Crimson Talent", "赤紅天賦", { run: W("Scoria’s Angel", "火燼天使"), min: 12, max: 16, minSP: 18, maxSP: 22 }),
  emerald: R("Emerald Talent", "翠綠天賦", { run: W("The Kuva Wytch", "赤毒魔女"), min: 12, max: 16, minSP: 18, maxSP: 22 }),
  cryobell: { name: W("Cryobell", "冰鈴珠"), wiki: "Icebind" },   // 每週在承體峰領 3 個，最多存 6 個
  entropic: R("Entropic Kuva", "熵變赤毒", { run: W("Entropic Eximus kill", "熵變卓越者擊殺"), min: 3, max: 5 }),
} satisfies Record<string, Res>;

export interface Cost { n: number; item: Res }

export interface Source {
  id: string;            // localStorage 的 key，改了會讓使用者的進度消失
  kuva: number;          // 每次得到的 Kuva（atLeast 時為保底值）
  atLeast?: boolean;     // 數量不固定，kuva 是保底
  limit: number;         // 每週次數
  cost: Cost[];          // 每次的花費
  vendor: Named;
  vendorWiki: string;    // wiki 頁面名稱
  where: Named;
  req?: Named[];         // 解鎖條件
  get?: Named;           // 花費的資源去哪裡拿
  note?: Named;
}

// 每週有上限的商店，順序照 wiki
export const VENDORS: Source[] = [
  { id: "palladino", kuva: 35000, limit: 1, cost: [{ n: 10, item: RES.sliver }],
    vendor: W("Palladino", "Palladino"), vendorWiki: "Palladino", where: W("Iron Wake, Earth", "地球 鋼鐵防線"),
    get: W("Requiem Relics, Empyrean missions, and Eximus above level 30 (2%).", "開鎮魂遺物、Empyrean 任務、30 級以上卓越者（2%）。") },
  { id: "yonta", kuva: 35000, limit: 1, cost: [{ n: 5, item: RES.pinion }],
    vendor: W("Archimedean Yonta", "哲士 Yonta"), vendorWiki: "Archimedean Yonta", where: W("Chrysalith, Zariman", "扎里曼 蛹巖"),
    get: W("Kill the dormant Void Angel in a Zariman mission, or trade with Yonta (one every 8 hours).", "扎里曼號任務中擊殺虛空天使，或與哲士 Yonta 交換（每 8 小時一個）。") },
  { id: "teshin", kuva: 10000, limit: 25, cost: [{ n: 15, item: RES.steel }],
    vendor: W("Teshin", "Teshin"), vendorWiki: "Teshin", where: W("Conclave room, any relay", "各中繼站"),
    get: W("Steel Path: 5 per daily Incursion (6 a day), 2 per Acolyte.", "鋼韌難度：每日 Incursion 每個 5 個（一天 6 個），侍僧每隻 2 個。") },
  { id: "acrithis-pathos", kuva: 10000, limit: 1, cost: [{ n: 10, item: RES.pathos }],
    vendor: W("Acrithis", "言錄使"), vendorWiki: "Acrithis", where: W("Dormizone", "扎里曼 寢區／渡域"),
    req: [W("The Duviri Paradox quest", "完成系列任務《The Duviri Paradox》")],
    get: W("The Orowyrm chest in Duviri, or the Isleweaver boss chest.", "渡域 Orowyrm 寶箱，或織島者的頭目寶箱。") },
  { id: "flare", kuva: 14000, limit: 3, cost: [{ n: 100, item: RES.heart }],
    vendor: W("Flare", "弗萊爾（Temple）"), vendorWiki: "Flare", where: W("Höllvania Central Mall", "霍爾瓦尼亞 商場"),
    req: [W("The Hex Rank 4 · Hot & Fresh", "集團 六煞 達到 4 級")],
    get: W("Stage Defense in Höllvania.", "霍爾瓦尼亞 舞台防禦任務。") },
  { id: "acrithis-scuttler", kuva: 14000, limit: 3, cost: [{ n: 25, item: RES.husk }],
    vendor: W("Acrithis", "言錄使"), vendorWiki: "Acrithis", where: W("Dormizone", "扎里曼 寢區／渡域"),
    req: [W("The Hex quest", "完成系列任務《六煞》")],
    get: W("Isleweaver in Duviri.", "渡域 織島者任務。") },
  { id: "nightcap", kuva: 14000, limit: 3, cost: [{ n: 75, item: RES.fergo }],
    vendor: W("Nightcap", "睡帽"), vendorWiki: "Nightcap", where: W("Fortuna, Venus", "金星 福爾圖娜"),
    req: [W("The New War quest", "完成系列任務《新紀之戰》"),
      W("Nightcap Rank 3 · Seeker (analyze mushrooms for his Field Guide)", "集團 睡帽 達到 3 級（提交各元素蘑菇集滿圖鑑）")],
    get: W("Deepmines bounties on Venus. Once a mushroom is fully analyzed in Nightcap’s Field Guide, you can compost it for 1 Fergolyte each.", "金星深谷賞金。睡帽圖鑑裡完整分析過的蘑菇可以拿去堆肥，每朵換 1 個鐵光晶。") },
  { id: "zorba", kuva: 6000, limit: 7, cost: [{ n: 500, item: RES.atra }],
    vendor: W("Aspirant Zorba", "見習仲裁者佐巴"), vendorWiki: "Aspirant Zorba", where: W("Any relay", "各中繼站"),
    get: W("Follie’s Hunt at Vesper Relay, Venus.", "金星 Vesper 中斷站—Follie 的狩獵。") },
  { id: "hunhow", kuva: 17000, limit: 3, cost: [{ n: 35, item: RES.crimson }, { n: 35, item: RES.emerald }],
    vendor: W("Hunhow", "Hunhow"), vendorWiki: "Hunhow", where: W("Pontis Tower, Uranus", "天王星 龐堤斯塔"),
    req: [W("Jade Shadows: Constellations quest", "完成系列任務《翠玉遺影：眾星》")],
    get: W("Two assassinations in Uranus Proxima: Scoria’s Angel for Crimson, The Kuva Wytch for Emerald.", "天王星比鄰星的兩關刺殺任務：火燼天使掉赤紅，赤毒魔女掉翠綠。") },
  { id: "melica", kuva: 10500, limit: 4, cost: [{ n: 150, item: RES.entropic }],
    vendor: W("Cephalon Melica", "中樞 Melica"), vendorWiki: "Cephalon Melica", where: W("Yuvan Peak or Zariman Ten Zero", "地球 承體峰／扎里曼 蛹巖"),
    get: W("Entropic Eximus units on the Zariman.", "扎里曼的熵變卓越者。") },
];

// 不是商店、但同樣每週有次數的來源
export const WEEKLY: Source[] = [
  { id: "circuit-sp", kuva: 20000, limit: 1, cost: [],
    vendor: W("The Circuit (Steel Path)", "無盡坐牢（鋼韌難度）"), vendorWiki: "The Circuit", where: W("Duviri", "扎里曼 寢區／渡域"),
    note: W("Pick Kuva as the Tier 5 or Tier 10 reward. Tiers 1–4 and 6–9 can roll more.", "自選 5 級或 10 級獎勵。1–4、6–9 級獎勵有機會再多赤毒。") },
  { id: "icebind", kuva: 7500, atLeast: true, limit: 3, cost: [{ n: 1, item: RES.cryobell }],
    vendor: W("Icebind", "冰縛任務"), vendorWiki: "Icebind", where: W("Yuvan Peak, Earth", "地球 承體峰"),
    req: [W("Angels of the Zariman quest", "完成系列任務《扎里曼的天使》"),
      W("Whispers in the Walls quest", "完成系列任務《牆中低語》"),
      W("Elite Deep Archimedea or Elite Temporal Archimedea unlocked", "解鎖火衛二解剖聖堂 精英深度探研，或霍爾瓦尼亞商場 精英時光探研")],
    get: W("Pick up 3 Cryobells at Yuvan Peak each weekly reset; you can hold up to 6. With a stock saved from earlier weeks you can run it up to 9 times in one week; this tracker counts the 3 new ones.",
      "每週重置後在承體峰撿 3 個，最多存 6 個。有前幾週存下的話，一週最多可以跑 9 次；這裡只算每週新拿的 3 次。"),
    note: W("After the ritual, open the chests in the frozen lab. Crested chest 7,500–100,000, plus 1,750–7,000 per side objective (3 per run). Counted here at the 7,500 minimum.",
      "儀式完成後傳送到冰封實驗室開寶箱。大寶箱 7,500–100,000，每完成一個支線再開小寶箱 1,750–7,000（每次 3 個支線）。這裡以保底 7,500 計。") },
];

export const ALL: Source[] = [...VENDORS, ...WEEKLY];

// 只列出、不追蹤的來源（不限次數，或靠機率、輪替）
export interface Extra { kuva: string; what: Named; wiki: string }
export const EXTRAS: Extra[] = [
  { kuva: "10,000", wiki: "Nightwave/Offerings",
    what: W("Nightwave Offerings, 50 Nightwave Credits each. Credits per season are limited; rank rewards also give Kuva.", "午夜電波，50 代幣換一次（每期代幣獲得量有限）。等級獎勵也有赤毒。") },
  { kuva: "10,000", wiki: "Arbitrations",
    what: W("Arbitrations vendor, 25 Vitus Essence each. No limit; the Arbitration changes every hour.", "仲裁商店，生息精華 25 個換一次，不限次數。仲裁每小時換一關。") },
  { kuva: "50,000", wiki: "The_Steel_Path",
    what: W("Teshin’s Steel Path Honors, 55 Steel Essence. In the rotation once every 8 weeks.", "Teshin，鋼韌精華 55 個換一次。每八週輪到一次。") },
  { kuva: "35,000", wiki: "Void_Surplus",
    what: W("Void Surplus from Baro Ki’Teer (every two weeks), possible reward.", "虛空商人（每兩週出現）的剩餘品，有機會開到。") },
  { kuva: "12,000", wiki: "Archon_Hunt",
    what: W("Weekly Archon Hunt, 12% chance.", "每週執政官刺殺，12% 機率。") },
  { kuva: "6,000", wiki: "Sortie",
    what: W("Daily Sortie, 12% chance.", "每日突擊任務，12% 機率。") },
  { kuva: "6,000", wiki: "1999_Calendar",
    what: W("1999 Calendar, sometimes offered.", "霍爾瓦尼亞月曆獎勵，有機會出現。") },
  { kuva: "7k / 14k / 21k", wiki: "Clan_Weekly_Initiatives",
    what: W("Clan Weekly Initiatives, tiers 2 / 3 / 4.", "氏族每週行動，第 2／3／4 階。") },
  { kuva: "1,200", wiki: "Requiem_Relic",
    what: W("Requiem Relics from Kuva Fortress Void Fissures, chance on open.", "赤毒要塞虛空裂縫任務，開鎮魂遺物有機會獲得。") },
  { kuva: "100–700", wiki: "Kuva_Fortress",
    what: W("Kuva Survival and Disruption on the Kuva Fortress. No limit; farm Steel Essence at the same time on Steel Path.", "赤毒要塞的赤毒生存（用催化劑採集）與中斷，不限次數。打鋼韌難度可以同時農鋼韌精華。") },
  { kuva: "550–1,400", wiki: "Kuva_Siphon",
    what: W("Kuva Siphon / Kuva Flood on nodes near the Kuva Fortress.", "赤毒要塞附近星圖的赤毒虹吸器／洪潮任務。") },
];

export const wikiUrl = (page: string): string => "https://wiki.warframe.com/w/" + encodeURIComponent(page.replace(/ /g, "_")).replace(/%2F/g, "/");
