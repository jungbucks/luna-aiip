/* resume.js — 이어 하기 시작점(2026-11-14). DOM 없음(node 검산).
   이어 하기는 '현재 EP 시작 지점부터'(CLAUDE.md)인데, 저장은 선택 직후(점수 반영 뒤)에도 일어나서
   정답·퀴즈·정산 팝업 중에 새로 고치면 그 EP를 다시 하며 점수가 두 번 들어갔다.
   → EP에 들어설 때 상태 사본(epStart)을 함께 저장하고, 이어 하기는 그 사본에서 다시 시작한다. 규칙(engine.js)은 그대로. */

/** EP 시작 상태를 state.epStart에 담는다(사본 안에는 epStart를 넣지 않음) */
export function markEpStart(state) {
  const { epStart, ...rest } = state;
  state.epStart = JSON.parse(JSON.stringify(rest));
}

/** 저장된 상태 → 이어 할 상태. 사본이 있으면 그 EP 시작 상태(사본도 다시 달아 둠), 없으면(옛 저장) 그대로 */
export function resumeState(saved) {
  if (!saved || !saved.epStart) return saved;
  const back = JSON.parse(JSON.stringify(saved.epStart));
  back.epStart = JSON.parse(JSON.stringify(saved.epStart));
  return back;
}
