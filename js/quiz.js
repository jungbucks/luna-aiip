/* quiz.js — 적용 문제(O/X) 판정·기록과 학습 결과(2026-11-14, 2026-11-20 개편). DOM 없음(node 검산). 스탯·배지·엔딩과 무관 — engine.js를 부르지 않는다.
   EP마다 새 사례 두 문항을 모두 푼다(틀린 사람만 보는 문항 없음). 기록: state.quiz[ep] = '2/2' | '1/2' | '0/2'(맞힌 수).
   옛 저장 값 'ok'(첫 문제 맞음)·'more-ok'(하나 더에서 맞음)·'missed'(둘 다 틀림)도 읽는다.
   학습 결과는 처음 판단(배지)이 아니라 이 적용 결과로 정한다 — 재선택에서 남은 정답을 누른 것만으로 이해했다고 보지 않는다. */

/** 맞힌 수(0~2) → 기록 값 */
export function scoreOf(correct) {
  const n = Math.max(0, Math.min(2, correct | 0));
  return n + '/2';
}

/** 그 EP의 결과를 기록(같은 EP를 다시 거치면 덮어씀). state.quiz가 없으면 만든다 */
export function record(state, ep, result) {
  if (!state.quiz || typeof state.quiz !== 'object') state.quiz = {};
  state.quiz[ep] = result;
}

/** 기록 값 → 학습 확인 상태: 'confirmed'(새 사례에 적용함) | 'partial'(일부) | 'review'(다시 볼 것) | null(아직 안 풂) */
export function learnOf(value) {
  if (value === '2/2' || value === 'ok') return 'confirmed';
  if (value === '1/2' || value === 'more-ok') return 'partial';
  if (value === '0/2' || value === 'missed') return 'review';
  return null;
}

/** 그 EP의 학습 확인 상태 */
export function learnAt(state, ep) {
  const q = state && state.quiz;
  return q && typeof q === 'object' ? learnOf(q[ep]) : null;
}

/** 다시 볼 개념: 적용을 다 확인하지 못한 EP(일부·다시 볼 것), 오름차순. 기록이 없으면 [] — 상태는 바꾸지 않는다 */
export function reviewEps(state) {
  const q = state && state.quiz;
  if (!q || typeof q !== 'object') return [];
  return Object.keys(q).filter(k => ['partial', 'review'].includes(learnOf(q[k]))).map(Number).sort((a, b) => a - b);
}
