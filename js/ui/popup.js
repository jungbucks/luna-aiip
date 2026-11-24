/* popup.js — 결과·힌트 팝업 오버레이. 델타 표시는 데이터에서 자동 생성(문구 중복 금지). */
import { esc } from './chat.js';
import { idolSVG, getIdol, getExpression } from './character.js';

/* 수치 색은 결과(정답/오답)가 아니라 부호로: +는 초록, -는 빨강(2026-11-20) */
export function deltaLine(delta) {
  // 이름표(자금·인지도·신뢰)를 홈 카드와 같게 붙인다(2026-11-24 플레이테스트 [8])
  const part = (emoji, name, v) => (v ? `<span class="dl ${v > 0 ? 'up' : 'down'}">${emoji} ${name} ${v > 0 ? '+' : ''}${v}</span>` : '');
  return [part('💰', '자금', delta.money), part('📈', '인지도', delta.fame), part('🛡️', '신뢰', delta.safety)].filter(Boolean).join('  ');
}

/* ESC·Tab(2026-11-20): 떠 있는 동안 Tab은 팝업 안에서만 돌고, ESC는 escBtn(닫기에 해당하는 단추)을 누른다.
   escBtn = opts.esc 번째 단추, 없으면 단추가 하나일 때 그 단추. 고르기가 필요한 팝업(오답·O/X 문제)에는 없다 */
let escBtn = null, keysOn = false;
function onKey(e) {
  const ov = document.getElementById('popup');
  if (!ov || !ov.classList.contains('show')) return;
  if (e.key === 'Escape') {
    if (escBtn && escBtn.isConnected && !escBtn.disabled) { e.preventDefault(); escBtn.click(); }
  } else if (e.key === 'Tab') {
    const f = [...ov.querySelectorAll('button:not(:disabled), a[href], input, textarea')];
    if (!f.length) { e.preventDefault(); return; }
    const i = f.indexOf(document.activeElement);
    if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && (i === -1 || i === f.length - 1)) { e.preventDefault(); f[0].focus(); }
  }
}

/* opts: {title, titleCls, html, buttons:[{label, cls, cb}], esc, guardMs, face} — face: 정답·오답 결과에만 아이돌 얼굴 */
export function showPopup(opts) {
  if (!keysOn) { document.addEventListener('keydown', onKey); keysOn = true; }
  const ov = document.getElementById('popup');
  ov.querySelector('.pop-face').innerHTML = opts.face ? idolSVG(getIdol(), getExpression()) : '';
  ov.querySelector('.pop-title').innerHTML = esc(opts.title);
  ov.querySelector('.pop-title').className = 'pop-title' + (opts.titleCls ? ' ' + opts.titleCls : '');
  ov.querySelector('.pop-body').innerHTML = opts.html;   // 호출측에서 esc 처리된 조각만 전달
  const btns = ov.querySelector('.pop-btns');
  btns.innerHTML = '';
  opts.buttons.forEach(b => {
    const el = document.createElement('button');
    el.className = 'pop-btn ' + (b.cls || '');
    el.textContent = b.label;
    el.onclick = () => { hidePopup(); b.cb && b.cb(); };
    if (opts.guardMs) { el.disabled = true; setTimeout(() => { el.disabled = false; }, opts.guardMs); }
    btns.appendChild(el);
  });
  escBtn = opts.esc != null ? btns.children[opts.esc] : (opts.buttons.length === 1 ? btns.firstElementChild : null);
  ov.classList.add('show');
  setBackInert(true);
  // 첫 버튼에 초점(잠금이 있으면 풀린 뒤) — 이 팝업이 아직 떠 있고 버튼이 그대로일 때만
  const first = btns.firstElementChild;
  setTimeout(() => { if (first && first.isConnected && !first.disabled && ov.classList.contains('show')) first.focus(); }, opts.guardMs || 0);
}

export function hidePopup() {
  escBtn = null;
  document.getElementById('popup').classList.remove('show');
  setBackInert(false);
}

/* 팝업이 떠 있는 동안 뒤 화면(#app의 다른 자식)에 inert — 키보드 Tab·클릭이 뒤 선택지에 닿아
   같은 선택이 두 번 적용되던 것을 막는다(2026-11-14 퀴즈 최종 검토) */
function setBackInert(on) {
  const app = document.getElementById('app');
  if (!app) return;
  [...app.children].forEach(el => { if (el.id !== 'popup') el.toggleAttribute('inert', on); });
}
