// 進入點：畫面渲染與事件
import { ALL, EXTRAS, VENDORS, WEEKLY, wikiUrl, type Source } from "./data";
import { hasSP, mean, runs, span, type Runs } from "./calc";
import { $, closest } from "./dom";
import { lang, nm, restoreLang, setLang, tr } from "./i18n";
import { load, rollover, save, type State } from "./state";
import { nextReset, untilReset, weekStart } from "./week";
import { setTheme, showTheme, type Theme } from "./theme";

const fmt = (n: number): string => n.toLocaleString("en-US");
const byId = new Map(ALL.map(s => [s.id, s]));

let st: State = load(Date.now());
if (rollover(st, Date.now())) save(st);

const count = (s: Source): number => Math.min(st.counts[s.id] ?? 0, s.limit);
const isSkipped = (s: Source): boolean => st.skip.includes(s.id);
const leftOf = (s: Source): number => (s.limit - count(s)) * s.kuva;

// ---------- 渲染 ----------

function costText(s: Source, times: number): string {
  return s.cost.map(c => `${fmt(c.n * times)} ${nm(c.item.name)}`).join(" + ");
}

// 單次花費，資源名稱連到 wiki
function costLinks(s: Source): string {
  return s.cost.map(c => `${fmt(c.n)} <a href="${wikiUrl(c.item.wiki)}" target="_blank" rel="noopener">${nm(c.item.name)}</a>`).join(" + ");
}

// 掉落量與期望值，例如「每次深谷賞金 16–20 個，期望 18（鋼韌難度 20–24，期望 22）」
const num1 = (n: number): string => (Math.round(n * 100) / 100).toLocaleString("en-US");
const range = ([a, b]: [number, number]): string => a === b ? fmt(a) : `${fmt(a)}–${fmt(b)}`;

function dropText(s: Source): string {
  return s.cost.map(c => {
    const f = c.item.farm;
    if (!f) return "";
    const sp = hasSP(f) ? tr("drop-sp", range(span(f, true)), num1(mean(f, true))) : "";
    return tr("drop", nm(c.item.name), nm(f.run), range(span(f, false)), num1(mean(f, false)), f.chance ? `${f.chance * 100}%` : "") + sp;
  }).filter(Boolean).join("<br>");
}

// 買一次平均要跑幾次：花費 ÷ 每次期望值，無條件進位（真期望與 90% 分位在頁底的表）
function expectText(s: Source): string {
  return s.cost.map(c => {
    const f = c.item.farm;
    if (!f) return "";
    const n = Math.ceil(c.n / mean(f, false));
    const sp = hasSP(f) ? Math.ceil(c.n / mean(f, true)) : 0;
    return tr("exp-runs", fmt(n), nm(f.run)) + (sp && sp !== n ? tr("exp-sp", fmt(sp)) : "");
  }).filter(Boolean).join(tr("exp-and"));
}

// 頁底的期望次數表：每種資源一列，一般／鋼韌難度並列
const runsCache = new Map<string, Runs>();  // 換語言重繪時不用重算
function renderRunsTable(): void {
  const seen = new Set<string>();
  const rows: string[] = [];
  for (const s of ALL) for (const c of s.cost) {
    const f = c.item.farm;
    const key = `${c.item.wiki}:${c.n}`;
    if (!f || seen.has(key)) continue;
    seen.add(key);
    const cell = (sp: boolean, pick: (r: Runs) => string): string => {
      if (sp && !hasSP(f)) return "—";
      const k = `${key}:${sp}`;
      let r = runsCache.get(k);
      if (!r) { r = runs(f, sp, c.n); runsCache.set(k, r); }
      return pick(r);
    };
    const pair = (pick: (r: Runs) => string): string =>
      `<td class="num">${cell(false, pick)}</td><td class="num sp">${cell(true, pick)}</td>`;
    rows.push(`<tr>
      <th scope="row"><a href="${wikiUrl(c.item.wiki)}" target="_blank" rel="noopener">${nm(c.item.name)}</a></th>
      <td class="num">${fmt(c.n)}</td>
      <td>${nm(f.run)}</td>
      ${pair(r => num1(r.naive))}
      ${pair(r => fmt(Math.ceil(r.naive)))}
      ${pair(r => r.mean.toFixed(1))}
      ${pair(r => `<b>${fmt(r.q90)}</b>`)}
    </tr>`);
  }
  $("runs-body").innerHTML = rows.join("");
}

// 購買次數格：上限 7 次以內畫成一格一格，超過就畫成進度條
function pips(s: Source): string {
  const n = count(s);
  if (s.limit === 1) return "";
  if (s.limit <= 7) return `<div class="pips" aria-hidden="true">${Array.from({ length: s.limit }, (_, i) => `<i class="${i < n ? "on" : ""}"></i>`).join("")}</div>`;
  return `<div class="pips bar" aria-hidden="true"><i style="width:${(n / s.limit) * 100}%"></i></div>`;
}

function vendorName(s: Source): string {
  return `<a href="${wikiUrl(s.vendorWiki)}" target="_blank" rel="noopener">${nm(s.vendor)}</a>`;
}

const ge = (s: Source): string => s.atLeast ? "≥ " : "";

function row(s: Source): string {
  const n = count(s), done = n >= s.limit, left = leftOf(s), name = nm(s.vendor);
  const costEach = s.cost.length ? `${costLinks(s)} <span class="muted">${tr("each")}</span>` : "";
  const exp = expectText(s), drop = dropText(s);
  const costLeft = s.cost.length && !done && n > 0 ? `<span class="cost-left">${tr("cost-left", costText(s, s.limit - n))}</span>` : "";
  const ctl = s.limit === 1
    ? `<button type="button" class="tick" data-act="toggle" aria-pressed="${done}">${done ? `✓ ${tr("done")}` : tr("mark-done")}</button>`
    : `<div class="stepper">
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

function skippedRow(s: Source): string {
  return `<article class="src mini" data-id="${s.id}">
    <div class="who">${vendorName(s)} <span class="where muted">· ${nm(s.where)}</span></div>
    <div class="per num muted">${ge(s)}${fmt(s.kuva * s.limit)} ${tr("unit")}</div>
    <button type="button" class="ghost" data-act="unskip" aria-label="${tr("unskip-label", nm(s.vendor))}">${tr("unskip")}</button>
  </article>`;
}

function renderLists(): void {
  const vis = (s: Source): boolean => !isSkipped(s) && !(st.hideDone && count(s) >= s.limit);
  $("list-vendors").innerHTML = VENDORS.filter(vis).map(row).join("");
  $("list-weekly").innerHTML = WEEKLY.filter(vis).map(row).join("");
  const sk = ALL.filter(isSkipped);
  $("sec-skipped").hidden = sk.length === 0;
  $("h-skipped").textContent = tr("h-skipped", sk.length);
  $("list-skipped").innerHTML = sk.map(skippedRow).join("");
}

function renderSummary(): void {
  const active = ALL.filter(s => !isSkipped(s));
  const total = active.reduce((a, s) => a + s.kuva * s.limit, 0);
  const left = active.reduce((a, s) => a + leftOf(s), 0);
  const open = active.filter(s => count(s) < s.limit).length;
  const skippedOut = ALL.filter(isSkipped).reduce((a, s) => a + leftOf(s), 0);
  // 有保底制的來源（冰縛）還沒領完時，總數只是下限
  const approx = active.some(s => s.atLeast && count(s) < s.limit) ? "≥ " : "";
  $("left-ge").textContent = approx;
  $("left-n").textContent = fmt(left);
  $("left-of").textContent = tr("of", (active.some(s => s.atLeast) ? "≥ " : "") + fmt(total));
  $("meter-fill").style.width = total ? `${(left / total) * 100}%` : "0%";  // 紅條 = 還剩的部分
  $("src-left").textContent = open ? tr("src-left", open) : tr("all-done");
  $("claimed").textContent = tr("claimed", fmt(total - left));
  $("skipped-out").textContent = skippedOut ? tr("skipped-out", fmt(skippedOut)) : "";
}

function renderClock(): void {
  const now = Date.now();
  const ws = weekStart(now);
  const md = (t: number): string => { const d = new Date(t); return `${d.getUTCMonth() + 1}/${d.getUTCDate()}`; };
  $("week-of").textContent = tr("week-of", md(ws), md(ws + 6 * 86_400_000));
  const u = untilReset(now);
  $("reset-in").textContent = tr("reset-in", u.d, u.h, u.m);
  const local = new Date(nextReset(now)).toLocaleString(lang === "zh" ? "zh-TW" : "en-US", {
    weekday: "short", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit",
  });
  $("reset-at").textContent = tr("reset-at", local);
}

function renderStatic(): void {
  document.documentElement.lang = lang === "zh" ? "zh-Hant" : "en";
  for (const el of document.querySelectorAll<HTMLElement>("[data-t]")) {
    const v = (tr as (k: string) => string)(el.dataset.t ?? "");
    if (el.hasAttribute("data-html")) el.innerHTML = v; else el.textContent = v;
  }
  $("theme-group").setAttribute("aria-label", tr("theme-group"));
  for (const b of document.querySelectorAll<HTMLElement>(".lang button")) b.setAttribute("aria-pressed", String(b.dataset.lang === lang));
  $<HTMLInputElement>("hide-done").checked = st.hideDone;
  $("extras").innerHTML = EXTRAS.map(x =>
    `<li><span class="num kv">${x.kuva}</span><span>${nm(x.what)} <a href="${wikiUrl(x.wiki)}" target="_blank" rel="noopener">${tr("vendor-wiki")}</a></span></li>`).join("");
  renderRunsTable();
  showTheme();
}

function renderAll(): void { renderStatic(); renderLists(); renderSummary(); renderClock(); }

function commit(): void { save(st); renderLists(); renderSummary(); }

// ---------- 事件 ----------

function act(id: string, a: string): void {
  const s = byId.get(id);
  if (!s) return;
  const n = count(s);
  const set = (v: number): void => { if (v <= 0) delete st.counts[id]; else st.counts[id] = Math.min(v, s.limit); };
  switch (a) {
    case "plus": set(n + 1); break;
    case "minus": set(n - 1); break;
    case "max": set(s.limit); break;
    case "zero": set(0); break;
    case "toggle": set(n >= s.limit ? 0 : s.limit); break;
    case "skip": if (!st.skip.includes(id)) st.skip.push(id); break;
    case "unskip": st.skip = st.skip.filter(x => x !== id); break;
  }
  commit();
  // 重繪後把焦點還給同一顆按鈕（或同一列），鍵盤操作才不會跳掉
  const el = document.querySelector<HTMLElement>(`[data-id="${id}"] [data-act="${a}"]`)
    ?? document.querySelector<HTMLElement>(`[data-id="${id}"] [data-act]:not([disabled])`);
  el?.focus();
}

document.addEventListener("click", e => {
  const b = closest<HTMLButtonElement>(e, "button[data-act]");
  const card = b && closest(e, "[data-id]");
  if (b && card?.dataset.id) act(card.dataset.id, b.dataset.act ?? "");
  const th = closest(e, "[data-theme-set]");
  if (th) setTheme(th.dataset.themeSet as Theme);
  const lg = closest(e, "[data-lang]");
  if (lg && (lg.dataset.lang === "en" || lg.dataset.lang === "zh")) { setLang(lg.dataset.lang); renderAll(); }
});

$<HTMLInputElement>("hide-done").addEventListener("change", e => {
  st.hideDone = (e.target as HTMLInputElement).checked;
  commit();
});

// 清除本週：按兩次才生效（artifact 裡不能用 confirm()）
let armed = 0;
$("reset-week").addEventListener("click", () => {
  const b = $("reset-week");
  if (!armed) {
    b.textContent = tr("reset-confirm"); b.classList.add("armed");
    armed = window.setTimeout(() => { armed = 0; b.textContent = tr("reset"); b.classList.remove("armed"); }, 4000);
    return;
  }
  clearTimeout(armed); armed = 0;
  b.textContent = tr("reset"); b.classList.remove("armed");
  st.counts = {};
  commit();
});

function toast(msg: string): void {
  const t = $("toast");
  t.textContent = msg;
  window.setTimeout(() => { if (t.textContent === msg) t.textContent = ""; }, 8000);
}

// 每 20 秒更新倒數；跨週時歸零（另一個分頁改了進度也一併同步）
function tick(): void {
  if (rollover(st, Date.now())) { save(st); commit(); toast(tr("new-week")); }
  renderClock();
}
window.setInterval(tick, 20_000);
document.addEventListener("visibilitychange", () => { if (!document.hidden) tick(); });
window.addEventListener("storage", e => {
  if (e.key === "kuva-week-state") { st = load(Date.now()); rollover(st, Date.now()); renderAll(); }
});

restoreLang();
renderAll();
