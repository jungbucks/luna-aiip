/* character.js — 아이돌 캐릭터 모듈: PNG 2종(솔/루나) × 표정 4종 + 이름 토큰 치환.
   DOM 계약(CSS·main.js·프로브가 의존): .idol-svg, data-idol, data-expr — 유지한다.
   데이터 텍스트의 이름 토큰: {n}=이름, {N}=영문명, {n가}{n는}{n를}{n랑}{n와}=받침 자동 조사. */

export const IDOLS = {
  sol:  { name: '솔',   en: 'SOL',  label: '솔 (SOL)',   tag: '태양 컨셉 · 보이 아이돌' },
  luna: { name: '루나', en: 'LUNA', label: '루나 (LUNA)', tag: '달빛 컨셉 · 걸 아이돌' },
};

const EXPRESSIONS = new Set(['neutral', 'happy', 'panic', 'shock']);
let current = 'luna';
let currentExpr = 'neutral';   // 마지막으로 정한 표정(새로 그리는 얼굴도 이 표정으로 — 결과 알림창)

export function setIdol(key) { if (IDOLS[key]) current = key; }
export function getIdol() { return current; }
export function getExpression() { return currentExpr; }

/* 받침 유무에 따른 조사 선택: 루나가/솔이, 루나를/솔을 … */
const JOSA = { '가': '이', '는': '은', '를': '을', '랑': '이랑', '와': '과' };
export function T(s) {
  const d = IDOLS[current];
  const batchim = (d.name.charCodeAt(d.name.length - 1) - 0xAC00) % 28 > 0;
  return String(s)
    .replace(/\{N\}/g, d.en)
    .replace(/\{n(가|는|를|랑|와)\}/g, (_, j) => d.name + (batchim ? JOSA[j] : j))
    .replace(/\{n\}/g, d.name);
}

function assetPath(idol, expr) {
  return `assets/characters/${idol}-${expr}.png`;
}

export function idolSVG(key, expr = 'neutral') {
  const k = IDOLS[key] ? key : current;
  const e = EXPRESSIONS.has(expr) ? expr : 'neutral';
  return `<img class="idol-svg" data-idol="${k}" data-expr="${e}"
    src="${assetPath(k, e)}" alt="${IDOLS[k].name}" width="512" height="512" decoding="async">`;
}

/* 정답·배지 = happy / 오답 = shock / 법정·안전도<30 = panic / 그 외 neutral */
export function setExpression(expr) {
  const next = EXPRESSIONS.has(expr) ? expr : 'neutral';
  currentExpr = next;
  document.querySelectorAll('.idol-svg').forEach(img => {
    img.dataset.expr = next;
    img.src = assetPath(img.dataset.idol, next);
  });
}

export function autoExpression(state) {
  setExpression(state.stats.safety < 30 ? 'panic' : 'neutral');
}
