/* chat.js — 채팅 로그 렌더 (SPEC §7-3). 탭/클릭마다 1줄, 전부 출력 후 선택지 콜백.
   타이핑 인디케이터(2026-07-16, ROADMAP #3): 탭하면 "···" 버블이 뜨고 500ms 뒤 대사 확정.
   타이핑 중에 다시 탭하면 즉시 확정(스킵) — 참을성 없는 학생 배려. */
import { T } from './character.js';

const TYPING_MS = 500;
let msgs = [], idx = 0, onDone = null, logEl = null;
let typingEl = null, typingTimer = null;

export function startChat(ep, doneCb) {
  clearTimeout(typingTimer); typingTimer = null; typingEl = null;   // 이전 화면의 잔여 타이머 방어
  msgs = ep.messages; idx = 0; onDone = doneCb;
  document.getElementById('chatRoom').textContent = '💬 단톡방: ' + T(ep.roomName);
  logEl = document.getElementById('chatLog');
  logEl.innerHTML = '';
  document.getElementById('chatChoices').innerHTML = '';
  document.getElementById('chatTapHint').style.display = 'block';
  advance();
}

export function advance() {
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
