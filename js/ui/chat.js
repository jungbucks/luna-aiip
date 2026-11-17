/* chat.js — 메신저 대화 렌더 (SPEC §7-3, v0.6 루나폰).
   메신저가 열리면 채팅이 자동 재생된다 — 타이핑 "···" 500ms → 대사 확정 → 700ms 뒤 다음 메시지 자동. 탭 = 빨리 감기.
   v0.6: 한국 단톡방 문법(이름·프로필이 위, 이어 말하면 생략, 묶음 끝에 시각, 맨 위 날짜 칩) + 항상 남는 입력창 + 내 답장 말풍선.
   최상위에서 DOM을 만지지 않는다(verify.mjs가 Node에서 import). */
import { T } from './character.js';
import { STRINGS } from '../../data/strings.js';

const TYPING_MS = 500, AUTO_GAP = 700;
let msgs = [], idx = 0, onDone = null, logEl = null;
let typingEl = null, typingTimer = null, autoTimer = null;

/* 프로필: 얼굴 없는 사람 모양 + 사람마다 다른 바탕색(글자 대신 — 2026-11-17 교사 지시).
   색 번호 0~5는 phone.css의 .ava[data-c]. 자주 나오는 사람은 번호를 고정하고, 처음 보는 이름은 이름으로 정한다(늘 같은 색).
   색만으로 구분하지 않는다 — 말풍선 위 이름은 그대로 나온다. */
export const AVATAR_TONES = 6;
const TONE = { '개발자 준호': 0, '마케터 세아': 1, '변리사 한결': 2, '코스모 담당자': 3 };
export function avatarTone(who) {
  if (who in TONE) return TONE[who];
  let h = 0;
  for (const ch of String(who)) h = (h * 31 + ch.codePointAt(0)) % 9973;
  return 4 + (h % 2);   // 고정 번호(0~3)와 겹치지 않게 4·5만
}

const nowLabel = () => {
  const d = new Date(), h = d.getHours();
  return (h < 12 ? '오전 ' : '오후 ') + ((h + 11) % 12 + 1) + ':' + String(d.getMinutes()).padStart(2, '0');
};
const toBottom = () => {
  if (!logEl) return;
  logEl.scrollTop = logEl.scrollHeight;
  const wrap = logEl.closest('.applayer');           // 낮은 화면에서는 메신저 전체가 스크롤된다 — 선택지·입력창까지 내려 준다
  if (wrap) wrap.scrollTop = wrap.scrollHeight;
};

/* 입력창(항상 남는다 — 맨 아래 말풍선이 화면 끝에 가려지지 않게). 글자를 치는 곳이 아니라 상태 한 줄 */
export function setComposer(state) {
  const el = document.getElementById('chatTapHint');
  el.textContent = STRINGS.ui.composer[state] || '';
  el.dataset.state = state;
}

export function startChat(ep, doneCb) {
  clearTimeout(typingTimer); clearTimeout(autoTimer);               // 이전 화면의 잔여 타이머 방어
  typingTimer = null; autoTimer = null; typingEl = null;
  msgs = ep.messages; idx = 0; onDone = doneCb;
  document.getElementById('chatRoom').textContent = T(ep.roomName);
  logEl = document.getElementById('chatLog');
  logEl.innerHTML = `<div class="daychip">${esc(STRINGS.ui.today)}</div>`;
  document.getElementById('chatChoices').innerHTML = '';
  setComposer('playing');
  advance();
}

export function advance() {
  clearTimeout(autoTimer); autoTimer = null;      // 탭이 자동 대기를 앞지른다
  if (typingEl) { finalizeMsg(); return; }        // 탭 = 타이핑 스킵, 즉시 출력
  if (idx >= msgs.length) return;
  const m = msgs[idx];
  const cont = idx > 0 && msgs[idx - 1].who === m.who;   // 같은 사람이 이어 말하면 이름·프로필 생략
  typingEl = document.createElement('div');
  typingEl.className = 'msg show typing' + (cont ? ' cont' : '');
  typingEl.innerHTML = `<span class="ava" data-c="${avatarTone(m.who)}" aria-hidden="true"></span><div class="body">` +
    (cont ? '' : `<span class="who">${esc(m.who)}</span>`) +
    `<div class="row"><span class="bubble"><i class="dots"><s></s><s></s><s></s></i></span></div></div>`;
  logEl.appendChild(typingEl);
  toBottom();
  typingTimer = setTimeout(finalizeMsg, TYPING_MS);
}

function finalizeMsg() {
  clearTimeout(typingTimer); typingTimer = null;
  const m = msgs[idx++];
  typingEl.classList.remove('typing');
  typingEl.querySelector('.bubble').innerHTML = esc(m.text);
  if (idx >= msgs.length || msgs[idx].who !== m.who) {            // 묶음의 마지막 말풍선 옆에만 시각
    typingEl.querySelector('.row').insertAdjacentHTML('beforeend', `<span class="tm">${nowLabel()}</span>`);
  }
  typingEl = null;
  toBottom();
  if (idx >= msgs.length) {
    onDone && onDone();
  } else {
    autoTimer = setTimeout(advance, AUTO_GAP);    // 자동 연쇄 — "두루루룩"
  }
}

/* 선택지 순서: 오답·정답 자리를 편마다 섞는다(늘 "B가 정답"이면 읽지 않고 고른다). 확인(개념 카드)은 늘 맨 끝. r = 0~1 난수 */
export function choiceOrder(r) {
  return r < 0.5 ? ['wrong', 'right', 'info'] : ['right', 'wrong', 'info'];
}

/* choices: [{label, cls, disabled, cb, key}] — 입력창 바로 위에 올라오는 판. key는 data-k로만 남긴다(겉모습은 같게 — 프로브용) */
export function showChoices(title, choices) {
  const box = document.getElementById('chatChoices');
  box.innerHTML = `<div class="choice-title">${esc(title)}</div>`;
  choices.forEach(c => {
    const b = document.createElement('button');
    b.className = 'choice-btn ' + (c.cls || '');
    b.textContent = T(c.label);
    if (c.key) b.dataset.k = c.key;
    if (c.disabled) { b.disabled = true; b.classList.add('dead'); }
    else b.onclick = c.cb;
    box.appendChild(b);
  });
  setComposer('choose');
  toBottom();
}

/* 내 답장 말풍선(오른쪽) — 고른 선택지 문구 */
export function sendMine(text) {
  if (!logEl) return;
  const el = document.createElement('div');
  el.className = 'msg me show';
  el.innerHTML = `<div class="body"><div class="row"><span class="tm">${nowLabel()}</span><span class="bubble">${esc(text)}</span></div></div>`;
  logEl.appendChild(el);
  toBottom();
}

/* 데이터 텍스트의 단일 통로: 이름 토큰({n}·{N}·조사) 치환 후 HTML 이스케이프 */
export function esc(s) {
  return T(s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}
