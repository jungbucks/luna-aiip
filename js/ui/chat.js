/* chat.js — 채팅 로그 렌더 (SPEC §7-3).
   v0.4(스토리텔링 개편): 폰이 등장하면 채팅이 "두루루룩" 자동 재생된다 —
   타이핑 "···" 500ms → 대사 확정 → 700ms 뒤 다음 메시지 자동. 탭 = 빨리 감기(즉시 확정/즉시 다음). */
import { T } from './character.js';

const TYPING_MS = 500, AUTO_GAP = 700;
let msgs = [], idx = 0, onDone = null, logEl = null;
let typingEl = null, typingTimer = null, autoTimer = null;

export function startChat(ep, doneCb) {
  clearTimeout(typingTimer); clearTimeout(autoTimer);               // 이전 화면의 잔여 타이머 방어
  typingTimer = null; autoTimer = null; typingEl = null;
  msgs = ep.messages; idx = 0; onDone = doneCb;
  document.getElementById('chatRoom').textContent = '💬 ' + T(ep.roomName);
  logEl = document.getElementById('chatLog');
  logEl.innerHTML = '';
  document.getElementById('chatChoices').innerHTML = '';
  document.getElementById('chatTapHint').style.display = 'block';
  advance();
}

export function advance() {
  clearTimeout(autoTimer); autoTimer = null;      // 탭이 자동 대기를 앞지른다
  if (typingEl) { finalizeMsg(); return; }        // 탭 = 타이핑 스킵, 즉시 출력
  if (idx >= msgs.length) return;
  const m = msgs[idx];
  typingEl = document.createElement('div');
  typingEl.className = 'msg show typing';
  typingEl.innerHTML = `<span class="who">${esc(m.who)}</span><span class="bubble"><i class="dots"><s></s><s></s><s></s></i></span>`;
  logEl.appendChild(typingEl);
  logEl.scrollTop = logEl.scrollHeight;
  typingTimer = setTimeout(finalizeMsg, TYPING_MS);
}

function finalizeMsg() {
  clearTimeout(typingTimer); typingTimer = null;
  const m = msgs[idx++];
  typingEl.classList.remove('typing');
  typingEl.querySelector('.bubble').innerHTML = esc(m.text);
  typingEl = null;
  logEl.scrollTop = logEl.scrollHeight;
  if (idx >= msgs.length) {
    document.getElementById('chatTapHint').style.display = 'none';
    onDone && onDone();
  } else {
    autoTimer = setTimeout(advance, AUTO_GAP);    // v0.4 자동 연쇄 — "두루루룩"
  }
}

/* choices: [{label, cls, disabled, cb}] */
export function showChoices(title, choices) {
  const box = document.getElementById('chatChoices');
  box.innerHTML = `<div class="choice-title">${esc(title)}</div>`;
  choices.forEach(c => {
    const b = document.createElement('button');
    b.className = 'choice-btn ' + (c.cls || '');
    b.textContent = T(c.label);
    if (c.disabled) { b.disabled = true; b.classList.add('dead'); }
    else b.onclick = c.cb;
    box.appendChild(b);
  });
  box.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

/* 데이터 텍스트의 단일 통로: 이름 토큰({n}·{N}·조사) 치환 후 HTML 이스케이프 */
export function esc(s) {
  return T(s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}
