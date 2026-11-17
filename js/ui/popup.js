/* popup.js — 결과·힌트 팝업 오버레이. 델타 표시는 데이터에서 자동 생성(문구 중복 금지). */
import { esc } from './chat.js';
import { idolSVG, getIdol, getExpression } from './character.js';

export function deltaLine(delta) {
  const part = (emoji, v) => (v ? `${emoji} ${v > 0 ? '+' : ''}${v}` : '');
  return [part('💰', delta.money), part('📈', delta.fame), part('🛡️', delta.safety)].filter(Boolean).join('  ');
}

/* opts: {title, html, buttons:[{label, cls, cb}], guardMs, face} — face: 정답·오답 결과에만 아이돌 얼굴 */
export function showPopup(opts) {
  const ov = document.getElementById('popup');
  ov.querySelector('.pop-face').innerHTML = opts.face ? idolSVG(getIdol(), getExpression()) : '';
  ov.querySelector('.pop-title').innerHTML = esc(opts.title);
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
  ov.classList.add('show');
  setBackInert(true);
  // 첫 버튼에 초점(잠금이 있으면 풀린 뒤) — 이 팝업이 아직 떠 있고 버튼이 그대로일 때만
  const first = btns.firstElementChild;
  setTimeout(() => { if (first && first.isConnected && !first.disabled && ov.classList.contains('show')) first.focus(); }, opts.guardMs || 0);
}

export function hidePopup() {
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
