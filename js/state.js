/* state.js — localStorage 저장/복원 (SPEC §7). 키·스키마 버전 고정. */
const KEY = 'luna_save_v1';
const SCHEMA = 1;

const defaultStorage = () => { try { return globalThis.localStorage; } catch (e) { return null; } };

export function save(gameState, uiPhase) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ schemaVersion: SCHEMA, game: gameState, phase: uiPhase }));
  } catch (e) { /* 저장 실패는 치명적이지 않음(시크릿 모드 등) */ }
}

/* 저장소는 인자로 받는다(기본 localStorage) — verify.mjs가 가짜 저장소로 검산한다 */
export function load(storage = defaultStorage()) {
  try {
    const raw = storage.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || data.schemaVersion !== SCHEMA) { storage.removeItem(KEY); return null; }  // 버전 불일치 = 조용히 폐기 (SPEC §7)
    return checkSave(data);
  } catch (e) { return null; }
}

/* ── 불러온 저장 검사(보안 검토 2026-11-18 C) ──
   저장은 이 기기 사람 누구나 고칠 수 있다. 점수·배지 일부가 화면 HTML에 들어가므로
   알려진 칸만 타입·범위·허용값을 확인해 새 객체로 옮기고, 하나라도 어긋나면 저장 전체를 쓰지 않는다(null — 이어 하기 단추가 숨는다).
   모르는 칸은 버린다. 옛 저장(quiz·epStart 없음)은 그대로 통과. 지우지는 않는다(새로 시작하면 덮인다). */
const PHASES = ['intro', 'ep', 'end'];
const IDOLS = ['sol', 'luna'];
const BADGES = [null, 'full', 'half', 'none'];
const ENDINGS = [null, 'court', 'unicorn', 'survive'];
const QUIZ = ['ok', 'more-ok', 'missed'];
const EP_COUNT = 6;
const isObj = v => !!v && typeof v === 'object' && !Array.isArray(v);
const intIn = (v, lo, hi) => Number.isInteger(v) && v >= lo && v <= hi;
class Bad extends Error {}
const need = ok => { if (!ok) throw new Bad(); };

function checkGame(g, withStart) {
  need(isObj(g));
  need(g.schemaVersion === undefined || g.schemaVersion === SCHEMA);
  need(IDOLS.includes(g.idol));
  need(intIn(g.ep, 1, EP_COUNT));
  need(isObj(g.stats) && ['money', 'fame', 'safety'].every(k => intIn(g.stats[k], 0, 100)));
  need(Array.isArray(g.badges) && g.badges.length === EP_COUNT && g.badges.every(b => BADGES.includes(b)));
  need(Array.isArray(g.wrongs) && g.wrongs.every(n => intIn(n, 1, EP_COUNT)));
  need(intIn(g.courtCount, 0, 2));
  need(typeof g.retryUsed === 'boolean');
  need(ENDINGS.includes(g.ending));
  need(['broke', 'brokeEver'].every(k => g[k] === undefined || typeof g[k] === 'boolean'));   // 2026-11-20 — 옛 저장에는 없다
  const out = {
    ...(g.schemaVersion === undefined ? {} : { schemaVersion: SCHEMA }),
    idol: g.idol, ep: g.ep,
    stats: { money: g.stats.money, fame: g.stats.fame, safety: g.stats.safety },
    badges: [...g.badges], wrongs: [...new Set(g.wrongs)],
    courtCount: g.courtCount, retryUsed: g.retryUsed, ending: g.ending,
  };
  ['broke', 'brokeEver'].forEach(k => { if (g[k] !== undefined) out[k] = g[k]; });
  if (g.quiz !== undefined) {
    need(isObj(g.quiz) && Object.keys(g.quiz).every(k => /^[1-6]$/.test(k) && QUIZ.includes(g.quiz[k])));
    out.quiz = { ...g.quiz };
  }
  if (withStart && g.epStart !== undefined) out.epStart = checkGame(g.epStart, false);
  else need(g.epStart === undefined || withStart);
  return out;
}

/** 저장 {schemaVersion, game, phase} → 검사를 통과한 새 객체, 어긋나면 null */
export function checkSave(data) {
  try {
    need(isObj(data) && data.schemaVersion === SCHEMA && PHASES.includes(data.phase));
    return { schemaVersion: SCHEMA, game: checkGame(data.game, true), phase: data.phase };
  } catch (e) {
    if (e instanceof Bad) return null;
    throw e;
  }
}

/* 지웠으면 true. 지운 뒤 다시 읽어 확인한다(보안 검토 2026-11-18 B — 예전엔 예외를 삼키고 성공으로 처리했다).
   읽기조차 안 되는 저장소(시크릿 등)는 남은 기록을 불러올 길도 없으므로 true */
export function clear(storage = defaultStorage()) {
  return removeAndCheck(storage, KEY);
}

export function removeAndCheck(storage, key) {
  if (!storage) return true;
  try { storage.removeItem(key); } catch (e) { /* 아래에서 남았는지로 판단 */ }
  try { return storage.getItem(key) === null; } catch (e) { return true; }
}
