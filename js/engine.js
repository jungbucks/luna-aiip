/* engine.js — 게임 규칙의 단일 원천 (SPEC §6). DOM 없음 — Node로 검산 가능(test/verify.mjs).
   상태 객체를 받아 갱신하고 이벤트 문자열을 돌려준다. 수치·규칙 변경은 SPEC 개정 없이는 금지. */

export const START_STATS = { money: 50, fame: 20, safety: 70 };
export const SETTLE_MONEY = 10;          // 월간 정산 (§6.1)
export const PROBATION_SAFETY = 30;      // 집행유예 복구값 (§6.6)
export const UNICORN_SAFETY = 60;        // 유니콘 안전도 조건 (§6.7)

const clamp = v => Math.max(0, Math.min(100, v));

/* 재선택 50% — 소수점은 0 방향 버림(trunc). SPEC §6.3 확정 규칙 */
export function halfDelta(d) {
  return {
    money: Math.trunc((d.money || 0) / 2),
    fame: Math.trunc((d.fame || 0) / 2),
    safety: Math.trunc((d.safety || 0) / 2),
  };
}

export function newGame() {
  return {
    schemaVersion: 1,
    idol: 'luna',                            // 선택 캐릭터 'sol'|'luna' — 표시용, 규칙에 영향 없음
    ep: 1,                                   // 현재 에피소드 1~6
    stats: { ...START_STATS },
    badges: [null, null, null, null, null, null],  // null | 'full' | 'half' | 'none'
    wrongs: [],                              // 오답을 한 번이라도 고른 EP 번호들 (법정 씬 복습용)
    courtCount: 0,                           // 안전도 0 도달 횟수
    retryUsed: false,                        // 현재 EP에서 재선택 사용 여부
    ending: null,                            // null | 'court' | 'unicorn' | 'survive'
  };
}

export function applyDelta(state, delta) {
  const s = state.stats;
  state.stats = {
    money: clamp(s.money + (delta.money || 0)),
    fame: clamp(s.fame + (delta.fame || 0)),
    safety: clamp(s.safety + (delta.safety || 0)),
  };
}

/* 스탯 반영 직후에만 호출 (§6.6 판정 시점).
   반환: null | 'probation'(집행유예) | 'court'(법정 엔딩 확정) */
export function checkCourt(state) {
  if (state.stats.safety > 0) return null;
  state.courtCount++;
  if (state.courtCount >= 2) { state.ending = 'court'; return 'court'; }
  state.stats.safety = PROBATION_SAFETY;
  return 'probation';
}

function markWrong(state, ep) {
  if (!state.wrongs.includes(ep)) state.wrongs.push(ep);
}

/* [대가를 치르고 진행] — 오답 델타 100%, 배지 없음 (§6.3) */
export function chooseWrongAccept(state, ep, wrongDelta) {
  markWrong(state, ep);
  state.badges[ep - 1] = 'none';
  applyDelta(state, wrongDelta);
  return checkCourt(state);
}

/* [다시 선택하기] — 오답 델타 50%(trunc) 즉시 반영, 재선택 플래그 (§6.3) */
export function chooseWrongRetry(state, ep, wrongDelta) {
  markWrong(state, ep);
  state.retryUsed = true;
  applyDelta(state, halfDelta(wrongDelta));
  return checkCourt(state);
}

/* 정답 — 첫 선택이면 완전 배지, 재선택 경유면 반쪽 배지 (§6.5) */
export function chooseRight(state, ep, rightDelta) {
  state.badges[ep - 1] = state.retryUsed ? 'half' : 'full';
  applyDelta(state, rightDelta);
  return checkCourt(state);   // 정답은 안전도 상승이라 실질 무해하지만 판정 시점 일관성 유지
}

/* 월간 정산 — 브릿지에서 (§6.1) */
export function settle(state) {
  applyDelta(state, { money: SETTLE_MONEY });
}

export function nextEp(state) {
  state.ep++;
  state.retryUsed = false;
}

/* EP6 정산까지 끝난 뒤 호출 (§6.7 우선순위) */
export function judgeEnding(state) {
  if (state.ending === 'court') return 'court';
  const fullCount = state.badges.filter(b => b === 'full').length;
  state.ending = (fullCount === 6 && state.stats.safety >= UNICORN_SAFETY) ? 'unicorn' : 'survive';
  return state.ending;
}
