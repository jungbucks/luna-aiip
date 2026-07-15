/* main.js — 화면 전환·게임 루프 오케스트레이터.
   규칙 계산은 전부 engine.js에 위임 — 이 파일에 수치·판정 로직을 쓰지 말 것. */
import * as engine from './engine.js';
import * as store from './state.js';
import { EPISODES } from '../data/episodes.js';
import { STRINGS } from '../data/strings.js';
import { startChat, advance, showChoices, esc } from './ui/chat.js';
import { showPopup, deltaLine } from './ui/popup.js';
import { renderCourt, renderEnding } from './ui/ending.js';
import { IDOLS, idolSVG, setIdol, getIdol, T, setExpression, autoExpression } from './ui/character.js';

let G = null;
const $ = id => document.getElementById(id);
const ep = () => EPISODES[G.ep - 1];

function show(id) {
  document.querySelectorAll('.scr').forEach(s => s.classList.toggle('active', s.id === id));
}

/* ── 스탯바 ── */
function updateStatbar() {
  $('stMoney').textContent = G.stats.money;
  $('stFame').textContent = G.stats.fame;
  $('stSafety').textContent = G.stats.safety;
  $('badgeRow').innerHTML = EPISODES.map((e, i) => {
    const b = G.badges[i];
    const cls = b === 'full' ? 'bd-full' : b === 'half' ? 'bd-half' : 'bd-off';
    return `<span class="bd ${cls}" title="${esc(e.right)}">${e.rightEmoji}</span>`;
  }).join('');
}

/* ── 타이틀 / 캐릭터 선택 / 인트로 ── */
function boot() {
  $('titleChars').innerHTML = idolSVG('sol') + idolSVG('luna');
  $('selRow').innerHTML = Object.keys(IDOLS).map(k =>
    `<button class="sel-card" data-idol="${k}" aria-label="${IDOLS[k].label} 선택">
      <div class="sel-svg">${idolSVG(k)}</div><b>${IDOLS[k].label}</b><i>${IDOLS[k].tag}</i></button>`).join('');
  $('selRow').querySelectorAll('.sel-card').forEach(btn => btn.onclick = () => pickIdol(btn.dataset.idol));
  const saved = store.load();
  $('btnContinue').style.display = saved ? '' : 'none';
  $('btnContinue').onclick = () => { G = saved.game; applyIdol(G.idol); enterEp(); };
  $('btnNew').onclick = () => { store.clear(); G = engine.newGame(); show('scr-select'); };
  $('btnReset').onclick = () => { store.clear(); location.reload(); };
  show('scr-title');
}

function applyIdol(key) {
  setIdol(key);
  $('epChar').innerHTML = idolSVG(getIdol());
}

function pickIdol(key) {
  G.idol = key;
  applyIdol(key);
  store.save(G, 'intro');
  intro(0);
}

function intro(i) {
  if (i >= STRINGS.intro.length) { store.save(G, 'ep'); enterEp(); return; }
  const c = STRINGS.intro[i];
  $('introCard').innerHTML = `<div class="intro-emoji">${c.emoji}</div><p>${esc(c.text).replace(/\n/g, '<br>')}</p>
    <div class="tap-hint">👆 눌러서 계속 (${i + 1}/${STRINGS.intro.length})</div>`;
  $('introCard').onclick = () => intro(i + 1);
  show('scr-intro');
}

/* ── 에피소드 ── */
function enterEp() {
  updateStatbar();
  autoExpression(G);
  $('epHead').textContent = T(`EP${G.ep} 「${ep().title}」 — ${ep().rightEmoji} ${ep().right}`);
  show('scr-ep');
  startChat(ep(), choicesPhase);
}

function choicesPhase() {
  const c = ep().choices;
  showChoices('어떻게 할까?', [
    { label: 'A. ' + c.wrong.label, cls: 'risky', disabled: G.retryUsed, cb: showWrongPopup },
    { label: 'B. ' + c.right.label, cb: rightFlow },
    { label: 'C. ' + c.info.label, cls: 'info', cb: showHint },
  ]);
}

function showHint() {
  showPopup({
    title: '💡 ' + ep().right + ' 개념 카드',
    html: `<p>${esc(ep().hint)}</p>`,
    buttons: [{ label: '↩ 다시 고민하기', cb: () => {} }],
  });
}

function showWrongPopup() {
  const w = ep().choices.wrong;
  setExpression('shock');
  const buttons = [];
  if (!G.retryUsed) buttons.push({ label: '다시 선택하기 (대가 절반)', cls: 'ghost', cb: retryFlow });
  buttons.push({ label: '대가를 치르고 진행', cls: 'danger', cb: acceptFlow });
  showPopup({
    title: w.popup.title,
    html: `<p class="analogy">${esc(w.popup.analogy)}</p>
      <p class="delta bad">${deltaLine(w.delta)}</p>
      <p class="lesson">📚 배운 것: ${esc(w.popup.lesson)}</p>`,
    buttons,
  });
}

function retryFlow() {
  const ev = engine.chooseWrongRetry(G, G.ep, ep().choices.wrong.delta);
  store.save(G, 'ep');
  updateStatbar(); autoExpression(G);
  if (ev) return courtScene(ev === 'court', choicesPhase);
  choicesPhase();   // 오답 비활성 상태로 재선택
}

function acceptFlow() {
  const ev = engine.chooseWrongAccept(G, G.ep, ep().choices.wrong.delta);
  store.save(G, 'ep');
  updateStatbar(); autoExpression(G);
  if (ev) return courtScene(ev === 'court', bridge);
  bridge();
}

function rightFlow() {
  const isRetry = G.retryUsed;
  engine.chooseRight(G, G.ep, ep().choices.right.delta);
  store.save(G, 'ep');
  updateStatbar();
  setExpression('happy');
  const r = ep().choices.right;
  showPopup({
    title: r.popup.title + (isRetry ? ' (반쪽 배지)' : ''),
    html: `<p>${esc(r.popup.body)}</p><p class="delta good">${deltaLine(r.delta)}</p>`,
    buttons: [{ label: '계속 →', cb: bridge }],
  });
}

/* ── 브릿지(정산) → 다음 EP / 엔딩 ── */
function bridge() {
  engine.settle(G);
  store.save(G, 'ep');
  updateStatbar();
  if (G.ep === 6) {
    const end = engine.judgeEnding(G);
    store.save(G, 'end');
    return endingScene(end);
  }
  const next = EPISODES[G.ep];   // 다음 EP (0-index라 현재 ep가 곧 다음)
  const zero = G.stats.money === 0 ? `<p class="money-zero">${esc(STRINGS.moneyZero)}</p>` : '';
  showPopup({
    title: STRINGS.bridgeSettle,
    html: `${zero}<p>${esc(STRINGS.bridgeNext(next)).replace(/\n/g, '<br>')}</p>`,
    buttons: [{ label: `EP${next.id} 시작 →`, cb: () => { engine.nextEp(G); store.save(G, 'ep'); enterEp(); } }],
  });
}

/* ── 법정 / 엔딩 ── */
function courtScene(isFinal, contCb) {
  setExpression('panic');
  show('scr-court');
  renderCourt(G, isFinal, () => {
    if (isFinal) { store.save(G, 'end'); return endingScene('court'); }
    store.save(G, 'ep');
    updateStatbar(); autoExpression(G);
    show('scr-ep');
    contCb();
  });
}

function endingScene(key) {
  if (key === 'unicorn') setExpression('happy');
  renderEnding(G, key, () => { store.clear(); location.reload(); });
  show('scr-end');
}

/* ── 부트 ── */
document.getElementById('chatLog').addEventListener('click', advance);
document.getElementById('chatTapHint').addEventListener('click', advance);
window.LUNA = { get state() { return G; }, engine };   // 프로브·디버그용
boot();
