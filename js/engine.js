/* engine.js — 게임 규칙의 단일 원천 (SPEC §6). DOM 없음 — Node로 검산 가능(test/verify.mjs).
   상태 객체를 받아 갱신하고 이벤트 문자열을 돌려준다. 수치·규칙 변경은 SPEC 개정 없이는 금지. */

export const START_STATS = { money: 50, fame: 20, safety: 70 };
export const SETTLE_MONEY = 10;          // 월간 정산 (§6.1)
export const CRISIS_SAFETY = 30;         // 위기 점검 회의 뒤 신뢰 복구값 (§6.6, 2026-11-20 — 법정·집행유예를 대신함)
export const PROBATION_SAFETY = CRISIS_SAFETY;   // 옛 이름(호환)
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
    crisisCount: 0,                          // 신뢰 0 도달 = 회사 위기 점검 회의 횟수(운영 결과, 법적 판정 아님)
    retryUsed: false,                        // 현재 EP에서 재선택 사용 여부
    ending: null,                            // null | 'court' | 'unicorn' | 'survive'
    broke: false,                            // 지난 정산 직전 💰가 0이었나 — 이번 EP 정답 보상(📈·🛡️ 상승분) 절반 (§6.1-2, 2026-11-20)
    brokeEver: false,                        // 한 번이라도 통장이 바닥났나 — 유니콘 불가·생존 엔딩 문구
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

/* 스탯 반영 직후에만 호출 (§6.6 판정 시점). 신뢰가 0이면 회사 위기 점검 회의 — 게임은 끝나지 않는다(6편을 끝까지 배운다).
   반환: null | 'crisis' */
export function checkCrisis(state) {
  if (state.stats.safety > 0) return null;
  state.crisisCount = (state.crisisCount || 0) + 1;
  state.stats.safety = CRISIS_SAFETY;
  return 'crisis';
}

function markWrong(state, ep) {
  if (!state.wrongs.includes(ep)) state.wrongs.push(ep);
}

/* [대가를 치르고 진행] — 오답 델타 100%, 배지 없음 (§6.3) */
export function chooseWrongAccept(state, ep, wrongDelta) {
  markWrong(state, ep);
  state.badges[ep - 1] = 'none';
  applyDelta(state, wrongDelta);
  return checkCrisis(state);
}

/* [다시 선택하기] — 오답 델타 50%(trunc) 즉시 반영, 재선택 플래그 (§6.3) */
export function chooseWrongRetry(state, ep, wrongDelta) {
  markWrong(state, ep);
  state.retryUsed = true;
  applyDelta(state, halfDelta(wrongDelta));
  return checkCrisis(state);
}

/* 정답 보상 — 통장이 바닥난 다음 EP에서는 📈·🛡️ 상승분이 절반(trunc). 💰 비용은 그대로 (§6.1-2) */
export function rightDeltaFor(state, d) {
  const half = v => (state.broke && v > 0 ? Math.trunc(v / 2) : v);
  return { money: d.money || 0, fame: half(d.fame || 0), safety: half(d.safety || 0) };
}

/* 정답 — 첫 선택이면 완전 배지, 재선택 경유면 반쪽 배지 (§6.5) */
export function chooseRight(state, ep, rightDelta) {
  state.badges[ep - 1] = state.retryUsed ? 'half' : 'full';
  applyDelta(state, rightDeltaFor(state, rightDelta));
  return checkCrisis(state);   // 정답은 신뢰 상승이라 실질 무해하지만 판정 시점 일관성 유지
}

/* 월간 정산 — 브릿지에서 (§6.1). 정산 직전 💰가 0이면 '통장 바닥'(다음 EP 정답 보상 절반, §6.1-2).
   반환: 이번 정산에서 통장이 바닥났었나(true면 화면이 경고를 띄운다) */
export function settle(state) {
  const broke = state.stats.money === 0;
  state.broke = broke;
  if (broke) state.brokeEver = true;
  applyDelta(state, { money: SETTLE_MONEY });
  return broke;
}

export function nextEp(state) {
  state.ep++;
  state.retryUsed = false;
}

/* EP6 정산까지 끝난 뒤 호출 (§6.7) — 회사 운영 결과만 정한다. 학습 결과(js/quiz.js)와 따로 본다.
   위기 엔딩: 위기 점검 회의 2번 이상 / 유니콘: 6편 모두 첫 판단으로 지킴 + 신뢰 60 이상 + 통장이 바닥난 적 없음 / 그 밖: 생존 */
export function judgeEnding(state) {
  const fullCount = state.badges.filter(b => b === 'full').length;
  state.ending = (state.crisisCount || 0) >= 2 ? 'crisis'
    : (fullCount === 6 && state.stats.safety >= UNICORN_SAFETY && !state.brokeEver) ? 'unicorn' : 'survive';
  return state.ending;
}
