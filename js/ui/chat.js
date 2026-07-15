/* chat.js — 채팅 로그 렌더 (SPEC §7-3). 탭/클릭마다 1줄, 전부 출력 후 선택지 콜백. */

let msgs = [], idx = 0, onDone = null, logEl = null;

export function startChat(ep, doneCb) {
  msgs = ep.messages; idx = 0; onDone = doneCb;
  document.getElementById('chatRoom').textContent = '💬 단톡방: ' + ep.roomName;
  logEl = document.getElementById('chatLog');
  logEl.innerHTML = '';
  document.getElementById('chatChoices').innerHTML = '';
  document.getElementById('chatTapHint').style.display = 'block';
  advance();
}

export function advance() {
  if (idx >= msgs.length) return;
  const m = msgs[idx++];
  const div = document.createElement('div');
  div.className = 'msg';
  div.innerHTML = `<span class="who">${esc(m.who)}</span><span class="bubble">${esc(m.text)}</span>`;
  logEl.appendChild(div);
  requestAnimationFrame(() => div.classList.add('show'));
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
    b.textContent = c.label;
    if (c.disabled) { b.disabled = true; b.classList.add('dead'); }
    else b.onclick = c.cb;
    box.appendChild(b);
  });
  box.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

export function esc(s) {
  return String(s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}
