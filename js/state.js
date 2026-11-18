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

const defaultStorage = () => { try { return globalThis.localStorage; } catch (e) { return null; } };

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
