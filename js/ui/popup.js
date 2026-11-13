/* popup.js — 결과·힌트 팝업 오버레이. 델타 표시는 데이터에서 자동 생성(문구 중복 금지). */
import { esc } from './chat.js';

export function deltaLine(delta) {
  const part = (emoji, v) => (v ? `${emoji} ${v > 0 ? '+' : ''}${v}` : '');
  return [part('💰', delta.money), part('📈', delta.fame), part('🛡️', delta.safety)].filter(Boolean).join('  ');
}

/* opts: {title, html, buttons:[{label, cls, cb}]} */
export function showPopup(opts) {
  const ov = document.getElementById('popup');
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
}

export function hidePopup() {
  document.getElementById('popup').classList.remove('show');
}
