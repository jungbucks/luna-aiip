/* quiz.js — O/X 확인 퀴즈 판정·기록(2026-11-14). DOM 없음(node 검산 가능). 스탯·배지·엔딩과 무관 — engine.js를 부르지 않는다.
   기록: state.quiz[ep] = 'ok'(첫 문제 맞음) | 'more-ok'(하나 더에서 맞음) | 'missed'(둘 다 틀림). 옛 저장은 state.quiz가 없다. */

/** 첫 문제·하나 더 결과 → 기록 값 */
export function resultOf(firstCorrect, secondCorrect) {
  if (firstCorrect) return 'ok';
  return secondCorrect ? 'more-ok' : 'missed';
}

/** 그 EP의 결과를 기록(같은 EP를 다시 거치면 덮어씀). state.quiz가 없으면 만든다 */
export function record(state, ep, result) {
  if (!state.quiz || typeof state.quiz !== 'object') state.quiz = {};
  state.quiz[ep] = result;
}

/** 두 문제 다 놓친 EP 번호(오름차순). 기록이 없으면 [] — 상태는 바꾸지 않는다 */
export function missedEps(state) {
  const q = state && state.quiz;
  if (!q || typeof q !== 'object') return [];
  return Object.keys(q).filter(k => q[k] === 'missed').map(Number).sort((a, b) => a - b);
}
