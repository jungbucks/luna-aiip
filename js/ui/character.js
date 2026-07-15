/* character.js — 루나 인라인 SVG + 표정 전환 (SPEC §12.5).
   표정 4종: neutral / happy / panic / shock — 눈·입 요소를 클래스로 토글.
   TODO(Opus): 일러스트 정교화 가능 — 단, id/클래스 계약(luna-svg, data-expr, .exp-*)은 유지할 것. */

export function lunaSVG() {
  return `
  <svg class="luna-svg" data-expr="neutral" viewBox="0 0 200 200" aria-label="루나" role="img">
    <!-- 트윈테일 -->
    <circle cx="38" cy="70" r="26" fill="url(#lunaHair)"/>
    <circle cx="162" cy="70" r="26" fill="url(#lunaHair)"/>
    <path d="M30 70 Q 24 130 44 158" stroke="url(#lunaHair)" stroke-width="14" fill="none" stroke-linecap="round"/>
    <path d="M170 70 Q 176 130 156 158" stroke="url(#lunaHair)" stroke-width="14" fill="none" stroke-linecap="round"/>
    <defs>
      <linearGradient id="lunaHair" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#a78bfa"/><stop offset="1" stop-color="#22d3ee"/>
      </linearGradient>
    </defs>
    <!-- 얼굴 -->
    <circle cx="100" cy="92" r="54" fill="#fff5f0"/>
    <path d="M46 84 Q 60 30 100 34 Q 140 30 154 84 Q 128 62 100 64 Q 72 62 46 84 Z" fill="url(#lunaHair)"/>
    <circle cx="100" cy="40" r="7" fill="#facc15"/><!-- 달 장식 -->
    <!-- 볼터치 -->
    <ellipse cx="66" cy="106" rx="8" ry="5" fill="#fda4af" opacity=".55"/>
    <ellipse cx="134" cy="106" rx="8" ry="5" fill="#fda4af" opacity=".55"/>
    <!-- 눈 (neutral/happy/shock 공용 — blink는 CSS) -->
    <g class="eyes eyes-open">
      <ellipse class="blink" cx="76" cy="94" rx="8" ry="10" fill="#312e81"/>
      <ellipse class="blink" cx="124" cy="94" rx="8" ry="10" fill="#312e81"/>
      <circle cx="79" cy="90" r="3" fill="#fff"/><circle cx="127" cy="90" r="3" fill="#fff"/>
    </g>
    <g class="eyes eyes-panic"><!-- 당황: 소용돌이 대신 처진 눈썹+작은 눈 -->
      <path d="M66 84 L86 90" stroke="#312e81" stroke-width="3" stroke-linecap="round"/>
      <path d="M134 84 L114 90" stroke="#312e81" stroke-width="3" stroke-linecap="round"/>
      <circle cx="76" cy="97" r="5" fill="#312e81"/><circle cx="124" cy="97" r="5" fill="#312e81"/>
      <path d="M140 76 q 6 -8 2 -14" stroke="#60a5fa" stroke-width="3" fill="none" stroke-linecap="round"/><!-- 식은땀 -->
    </g>
    <!-- 입 4종 -->
    <path class="exp exp-neutral" d="M92 122 Q 100 127 108 122" stroke="#b45309" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path class="exp exp-happy" d="M86 118 Q 100 134 114 118 Z" fill="#f87171"/>
    <ellipse class="exp exp-shock" cx="100" cy="124" rx="8" ry="11" fill="#7c2d12"/>
    <path class="exp exp-panic" d="M90 126 Q 100 118 110 126" stroke="#b45309" stroke-width="3" fill="none" stroke-linecap="round"/>
  </svg>`;
}

/* 표정 전환 규칙(§12.5): 정답·배지 = happy / 오답 = shock / 법정·안전도<30 = panic / 그 외 neutral */
export function setExpression(expr) {
  document.querySelectorAll('.luna-svg').forEach(svg => svg.dataset.expr = expr);
}

export function autoExpression(state) {
  setExpression(state.stats.safety < 30 ? 'panic' : 'neutral');
}
