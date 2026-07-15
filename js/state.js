/* state.js — localStorage 저장/복원 (SPEC §7). 키·스키마 버전 고정. */
const KEY = 'luna_save_v1';
const SCHEMA = 1;

export function save(gameState, uiPhase) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ schemaVersion: SCHEMA, game: gameState, phase: uiPhase }));
  } catch (e) { /* 저장 실패는 치명적이지 않음(시크릿 모드 등) */ }
}

export function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data.schemaVersion !== SCHEMA) { localStorage.removeItem(KEY); return null; }  // 버전 불일치 = 조용히 폐기 (SPEC §7)
    return data;
  } catch (e) { return null; }
}

export function clear() {
  try { localStorage.removeItem(KEY); } catch (e) {}
}
