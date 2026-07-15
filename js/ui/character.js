/* character.js — 아이돌 캐릭터 모듈: SVG 2종(솔/루나) + 표정 전환 + 이름 토큰 치환 (SPEC §12.5).
   표정 4종: neutral / happy / panic / shock — 눈·입 요소를 클래스로 토글.
   계약(CSS·main.js·프로브가 의존): .idol-svg, data-idol, data-expr, .eyes-*, .exp-*, .blink — 유지할 것.
   데이터 텍스트의 이름 토큰: {n}=이름, {N}=영문명, {n가}{n는}{n를}{n랑}{n와}=받침 자동 조사. */

export const IDOLS = {
  sol:  { name: '솔',   en: 'SOL',  label: '솔 (SOL)',   tag: '태양 컨셉 · 보이 아이돌' },
  luna: { name: '루나', en: 'LUNA', label: '루나 (LUNA)', tag: '달빛 컨셉 · 걸 아이돌' },
};

let current = 'luna';
export function setIdol(key) { if (IDOLS[key]) current = key; }
export function getIdol() { return current; }

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

/* ── 루나: 롱헤어(퍼플→시안) + 달 핀 + 무대의상 버스트업 ── */
function lunaBody() {
  return `
    <defs>
      <linearGradient id="lunaHair" x1="0" y1="0" x2=".6" y2="1">
        <stop offset="0" stop-color="#c4b5fd"/><stop offset=".55" stop-color="#a78bfa"/><stop offset="1" stop-color="#22d3ee"/>
      </linearGradient>
      <linearGradient id="lunaIris" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#8b5cf6"/><stop offset="1" stop-color="#0ea5e9"/>
      </linearGradient>
      <linearGradient id="lunaDress" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#7c3aed"/><stop offset="1" stop-color="#312e81"/>
      </linearGradient>
    </defs>
    <!-- 뒷머리(롱헤어) -->
    <path d="M100 16 C 56 16 34 48 36 92 C 37 128 28 162 22 186 C 44 196 60 190 66 178 C 70 190 84 196 100 196 C 116 196 130 190 134 178 C 140 190 156 196 178 186 C 172 162 163 128 164 92 C 166 48 144 16 100 16 Z" fill="url(#lunaHair)"/>
    <path d="M52 70 C 46 110 42 140 36 168" stroke="#ede9fe" stroke-width="3" fill="none" opacity=".45" stroke-linecap="round"/>
    <path d="M148 70 C 154 110 158 140 164 168" stroke="#a5f3fc" stroke-width="3" fill="none" opacity=".45" stroke-linecap="round"/>
    <!-- 목·의상 -->
    <path d="M92 130 h16 v26 h-16 z" fill="#ffe8da"/>
    <path d="M40 200 C 46 170 68 158 100 158 C 132 158 154 170 160 200 Z" fill="url(#lunaDress)"/>
    <path d="M74 164 Q 100 177 126 164" stroke="#67e8f9" stroke-width="2.5" fill="none" opacity=".8"/>
    <!-- 얼굴 -->
    <path d="M100 30 C 138 30 152 60 152 90 C 152 118 137 139 119 148 C 111 152 104 153 100 153 C 96 153 89 152 81 148 C 63 139 48 118 48 90 C 48 60 62 30 100 30 Z" fill="#fff1e8"/>
    <!-- 앞머리(커튼뱅) -->
    <path d="M48 92 C 46 46 70 26 100 26 C 130 26 154 46 152 92 C 146 66 134 56 120 68 C 114 56 107 52 100 52 C 93 52 86 56 80 68 C 66 56 54 66 48 92 Z" fill="url(#lunaHair)"/>
    <!-- 달 핀 · 별 귀걸이 -->
    <path d="M136 40 a 10 10 0 1 0 11 13 a 7.5 7.5 0 1 1 -11 -13 Z" fill="#facc15"/>
    <path d="M47 122 q 2 6 7 8 q -5 2 -7 8 q -2 -6 -7 -8 q 5 -2 7 -8 Z" fill="#facc15"/>
    <path d="M153 122 q 2 6 7 8 q -5 2 -7 8 q -2 -6 -7 -8 q 5 -2 7 -8 Z" fill="#facc15"/>
    <!-- 볼터치 · 코 · 눈썹 -->
    <ellipse cx="66" cy="113" rx="8.5" ry="4.5" fill="#fda4af" opacity=".45"/>
    <ellipse cx="134" cy="113" rx="8.5" ry="4.5" fill="#fda4af" opacity=".45"/>
    <path d="M99 106 q 3 5 0 8" stroke="#f3c6ad" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M63 82 Q 74 76 86 81" stroke="#5b4a9f" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M114 81 Q 126 76 137 82" stroke="#5b4a9f" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <!-- 눈 -->
    <g class="eyes eyes-open">
      <g class="blink">
        <ellipse cx="75" cy="97" rx="8.5" ry="11" fill="url(#lunaIris)"/>
        <ellipse cx="75" cy="99" rx="4" ry="6" fill="#1e1b4b"/>
        <circle cx="71.5" cy="92" r="2.8" fill="#fff"/>
        <circle cx="78.5" cy="102" r="1.4" fill="#fff" opacity=".9"/>
      </g>
      <g class="blink">
        <ellipse cx="125" cy="97" rx="8.5" ry="11" fill="url(#lunaIris)"/>
        <ellipse cx="125" cy="99" rx="4" ry="6" fill="#1e1b4b"/>
        <circle cx="121.5" cy="92" r="2.8" fill="#fff"/>
        <circle cx="128.5" cy="102" r="1.4" fill="#fff" opacity=".9"/>
      </g>
      <path d="M64 91 Q 75 84 86 91" stroke="#312e81" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <path d="M114 91 Q 125 84 136 91" stroke="#312e81" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    </g>
    <g class="eyes eyes-panic">
      <path d="M64 86 L 86 93" stroke="#312e81" stroke-width="3" stroke-linecap="round"/>
      <path d="M136 86 L 114 93" stroke="#312e81" stroke-width="3" stroke-linecap="round"/>
      <circle cx="75" cy="100" r="4.5" fill="#312e81"/><circle cx="125" cy="100" r="4.5" fill="#312e81"/>
      <path d="M143 78 q 6 -9 2 -15" stroke="#60a5fa" stroke-width="3" fill="none" stroke-linecap="round"/>
    </g>
    <!-- 입 4종 -->
    <path class="exp exp-neutral" d="M91 127 Q 100 133 109 127" stroke="#d6455f" stroke-width="2.8" fill="none" stroke-linecap="round"/>
    <path class="exp exp-happy" d="M87 124 Q 100 141 113 124 Z" fill="#fb7185"/>
    <path class="exp exp-happy" d="M91 125 Q 100 131 109 125 Z" fill="#fff"/>
    <ellipse class="exp exp-shock" cx="100" cy="129" rx="6.5" ry="8.5" fill="#9f1239"/>
    <path class="exp exp-panic" d="M90 131 Q 95 126 100 131 Q 105 136 110 131" stroke="#d6455f" stroke-width="2.8" fill="none" stroke-linecap="round"/>`;
}

/* ── 솔: 다크 인디고 투블럭 + 해 핀 + 재킷 버스트업 ── */
function solBody() {
  return `
    <defs>
      <linearGradient id="solHair" x1="0" y1="0" x2=".7" y2="1">
        <stop offset="0" stop-color="#4338ca"/><stop offset="1" stop-color="#1e1b4b"/>
      </linearGradient>
      <linearGradient id="solIris" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#92400e"/><stop offset="1" stop-color="#f59e0b"/>
      </linearGradient>
      <linearGradient id="solSuit" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#343b5e"/><stop offset="1" stop-color="#14172b"/>
      </linearGradient>
    </defs>
    <!-- 목·의상 -->
    <path d="M92 130 h16 v26 h-16 z" fill="#ffe9d9"/>
    <path d="M38 200 C 44 170 66 159 100 159 C 134 159 156 170 162 200 Z" fill="url(#solSuit)"/>
    <path d="M86 160 L 100 180 L 114 160 Q 107 156 100 156 Q 93 156 86 160 Z" fill="#eef1fb"/>
    <path d="M84 161 L 100 181 L 116 161" stroke="#67e8f9" stroke-width="2" fill="none" opacity=".7"/>
    <!-- 귀 · 귀걸이 -->
    <ellipse cx="47" cy="103" rx="6" ry="9" fill="#fff0e2"/>
    <ellipse cx="153" cy="103" rx="6" ry="9" fill="#fff0e2"/>
    <circle cx="153" cy="112" r="2.5" fill="#facc15"/>
    <!-- 얼굴 -->
    <path d="M100 30 C 140 30 154 60 154 90 C 154 118 140 140 121 149 C 112 153 104 154 100 154 C 96 154 88 153 79 149 C 60 140 46 118 46 90 C 46 60 60 30 100 30 Z" fill="#fff0e2"/>
    <!-- 헤어(투블럭 + 시스루 프린지) -->
    <path d="M44 98 C 38 38 68 20 100 20 C 132 20 162 38 156 98 C 154 74 148 60 138 56 C 141 66 138 74 131 77 C 128 62 122 50 100 50 C 80 50 68 60 66 78 C 58 74 54 64 58 54 C 48 60 45 76 44 98 Z" fill="url(#solHair)"/>
    <path d="M44 96 C 43 104 44 112 47 118 L 52 116 C 49 108 48 100 48 94 Z" fill="url(#solHair)"/>
    <path d="M156 96 C 157 104 156 112 153 118 L 148 116 C 151 108 152 100 152 94 Z" fill="url(#solHair)"/>
    <path d="M74 32 C 88 26 116 26 130 34" stroke="#22d3ee" stroke-width="3" opacity=".45" fill="none" stroke-linecap="round"/>
    <!-- 해 핀 -->
    <circle cx="139" cy="42" r="4.5" fill="#facc15"/>
    <path d="M139 33 v4 M139 47 v4 M130 42 h4 M144 42 h4" stroke="#facc15" stroke-width="2" stroke-linecap="round"/>
    <!-- 코 · 눈썹(일자 굵게) -->
    <path d="M100 104 q 3 7 0 11" stroke="#eec3a4" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <path d="M63 84 Q 75 80 87 83" stroke="#1e1b4b" stroke-width="3.6" fill="none" stroke-linecap="round"/>
    <path d="M113 83 Q 125 80 137 84" stroke="#1e1b4b" stroke-width="3.6" fill="none" stroke-linecap="round"/>
    <!-- 눈 -->
    <g class="eyes eyes-open">
      <g class="blink">
        <ellipse cx="76" cy="97" rx="7.5" ry="9.5" fill="url(#solIris)"/>
        <ellipse cx="76" cy="99" rx="3.6" ry="5" fill="#1c1917"/>
        <circle cx="73" cy="93" r="2.4" fill="#fff"/>
        <circle cx="79" cy="101" r="1.2" fill="#fff" opacity=".9"/>
      </g>
      <g class="blink">
        <ellipse cx="124" cy="97" rx="7.5" ry="9.5" fill="url(#solIris)"/>
        <ellipse cx="124" cy="99" rx="3.6" ry="5" fill="#1c1917"/>
        <circle cx="121" cy="93" r="2.4" fill="#fff"/>
        <circle cx="127" cy="101" r="1.2" fill="#fff" opacity=".9"/>
      </g>
      <path d="M66 92 Q 76 87 86 91" stroke="#1e1b4b" stroke-width="3.4" fill="none" stroke-linecap="round"/>
      <path d="M114 91 Q 124 87 134 92" stroke="#1e1b4b" stroke-width="3.4" fill="none" stroke-linecap="round"/>
    </g>
    <g class="eyes eyes-panic">
      <path d="M65 86 L 87 93" stroke="#1e1b4b" stroke-width="3" stroke-linecap="round"/>
      <path d="M135 86 L 113 93" stroke="#1e1b4b" stroke-width="3" stroke-linecap="round"/>
      <circle cx="76" cy="100" r="4.5" fill="#1e1b4b"/><circle cx="124" cy="100" r="4.5" fill="#1e1b4b"/>
      <path d="M143 78 q 6 -9 2 -15" stroke="#60a5fa" stroke-width="3" fill="none" stroke-linecap="round"/>
    </g>
    <!-- 입 4종 -->
    <path class="exp exp-neutral" d="M92 129 Q 100 134 108 129" stroke="#c05656" stroke-width="2.8" fill="none" stroke-linecap="round"/>
    <path class="exp exp-happy" d="M88 126 Q 100 142 112 126 Z" fill="#f87171"/>
    <path class="exp exp-happy" d="M92 127 Q 100 132 108 127 Z" fill="#fff"/>
    <ellipse class="exp exp-shock" cx="100" cy="130" rx="6" ry="8" fill="#7f1d1d"/>
    <path class="exp exp-panic" d="M91 132 Q 96 127 101 132 Q 106 137 111 132" stroke="#c05656" stroke-width="2.8" fill="none" stroke-linecap="round"/>`;
}

export function idolSVG(key) {
  const k = IDOLS[key] ? key : current;
  return `
  <svg class="idol-svg" data-idol="${k}" data-expr="neutral" viewBox="0 0 200 200" aria-label="${IDOLS[k].name}" role="img">
    ${k === 'sol' ? solBody() : lunaBody()}
  </svg>`;
}

/* 표정 전환 규칙(§12.5): 정답·배지 = happy / 오답 = shock / 법정·안전도<30 = panic / 그 외 neutral */
export function setExpression(expr) {
  document.querySelectorAll('.idol-svg').forEach(svg => svg.dataset.expr = expr);
}

export function autoExpression(state) {
  setExpression(state.stats.safety < 30 ? 'panic' : 'neutral');
}
