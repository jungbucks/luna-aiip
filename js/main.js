/* main.js — 화면 전환·게임 루프 오케스트레이터.
   규칙 계산은 전부 engine.js에 위임 — 이 파일에 수치·판정 로직을 쓰지 말 것. */
import * as engine from './engine.js';
import * as store from './state.js';
import { EPISODES } from '../data/episodes.js';
import { STRINGS } from '../data/strings.js';
import { startChat, advance, showChoices, esc } from './ui/chat.js';
import { showPopup, deltaLine } from './ui/popup.js';
import { QUIZ } from '../data/quiz.js';
import * as quiz from './quiz.js';
import * as resume from './resume.js';
import { renderCourt, renderEnding } from './ui/ending.js';
import { IDOLS, idolSVG, setIdol, getIdol, T, setExpression, autoExpression } from './ui/character.js';

let G = null;
const $ = id => document.getElementById(id);
const ep = () => EPISODES[G.ep - 1];

function show(id) {
  document.querySelectorAll('.scr').forEach(s => s.classList.toggle('active', s.id === id));
}

/* ── 스탯바 (카운트업 연출 — ROADMAP #2. 규칙 계산 아님, 표시만) ── */
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const shownStats = {};      // 마지막으로 화면에 그린 값
let shownBadges = [];

function animateStat(el, from, to) {
  if (REDUCED || from === to || from == null) { el.textContent = to; return; }
  el.classList.remove('st-up', 'st-down'); void el.offsetWidth;
  el.classList.add(to < from ? 'st-down' : 'st-up');
  const t0 = performance.now(), dur = 400;
  const tick = now => {
    const p = Math.min(1, (now - t0) / dur);
    el.textContent = Math.round(from + (to - from) * p);
    if (p < 1) requestAnimationFrame(tick);
    else setTimeout(() => el.classList.remove('st-up', 'st-down'), 250);
  };
  requestAnimationFrame(tick);
}

function updateStatbar() {
  [['stMoney', 'money'], ['stFame', 'fame'], ['stSafety', 'safety']].forEach(([id, k]) => {
    animateStat($(id), shownStats[k], G.stats[k]);
    shownStats[k] = G.stats[k];
  });
  // v0.3.1 최적화: 배지 행은 배지가 실제로 바뀐 때만 재구축 (스탯만 바뀌는 대부분의 갱신에서 DOM 재생성 0)
  const prev = shownBadges;
  const changed = prev.length !== G.badges.length || G.badges.some((b, i) => b !== prev[i]);
  if (changed) {
    shownBadges = [...G.badges];
    $('badgeRow').innerHTML = EPISODES.map((e, i) => {
      const b = G.badges[i];
      const cls = b === 'full' ? 'bd-full' : b === 'half' ? 'bd-half' : 'bd-off';
      return `<span class="bd ${cls}" title="${esc(e.right)}">${e.rightEmoji}</span>`;
    }).join('');
    if (!REDUCED) G.badges.forEach((b, i) => {        // 새로 획득한 배지는 팝!
      if (b && b !== 'none' && b !== prev[i]) $('badgeRow').children[i].classList.add('bd-pop');
    });
  }
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
  $('btnContinue').onclick = () => { G = resume.resumeState(saved.game); applyIdol(G.idol); enterEp(); };   // EP 시작 상태에서 다시(점수 두 번 방지)
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

/* ── 에피소드 (v0.4: 스토리 씬 → 폰 슬라이드업 → 채팅 자동 재생) ── */
let sceneIdx = 0;

function enterEp() {
  resume.markEpStart(G); store.save(G, 'ep');   // 이어 하기 시작점(2026-11-14 — 선택·퀴즈·정산 중 새로 고침해도 점수가 두 번 들어가지 않게)
  updateStatbar();
  autoExpression(G);
  $('epHead').textContent = T(`EP${G.ep} 「${ep().title}」 — ${ep().rightEmoji} ${ep().right}`);
  show('scr-ep');
  sceneIdx = 0;
  $('phoneWrap').classList.remove('on');
  renderScene();
}

function renderScene() {
  const scenes = ep().scenes || [];
  if (sceneIdx >= scenes.length) { showPhone(); return; }
  const s = scenes[sceneIdx];
  const stage = $('storyStage');
  stage.classList.remove('on'); void stage.offsetWidth; stage.classList.add('on');
  $('storyEmoji').textContent = s.emoji;
  $('storyText').innerHTML = esc(T(s.text)).replace(/\n/g, '<br>');
  $('storyIdx').textContent = (sceneIdx + 1) + '/' + scenes.length;
}

function showPhone() {
  $('storyStage').classList.remove('on');
  const d = new Date();
  $('phoneTime').textContent = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
  $('phoneWrap').classList.add('on');
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
  if (ev) return courtScene(ev === 'court', () => quizThen(bridge));   // 최종 법정이면 엔딩으로 가서 퀴즈 없음
  quizThen(bridge);
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
    buttons: [{ label: '계속 →', cb: () => quizThen(bridge) }],
  });
}

/* ── O/X 확인 퀴즈(2026-11-14, 스탯 무관) — 정산(bridge) 직전. 틀리면 하나 더, 결과는 G.quiz에(js/quiz.js) ── */
const QUIZ_GUARD_MS = 300;   // 팝업이 뜬 직후 연타가 다음 팝업 버튼을 누르지 않게
function quizThen(next) {
  const set = QUIZ[G.ep], E = ep(), S = STRINGS.quiz;
  if (!set) return next();
  let first;
  const ask = (item, stage) => showPopup({
    title: S.title,
    html: `<p class="quiz-tag">${E.rightEmoji} ${esc(E.right)}</p><p class="quiz-q">${esc(item.q)}</p>`,
    buttons: [{ label: S.o, cb: () => answer(item, stage, true) }, { label: S.x, cb: () => answer(item, stage, false) }],
    guardMs: QUIZ_GUARD_MS,
  });
  const answer = (item, stage, v) => {
    const correct = v === item.a;
    if (stage === 'main') first = correct;
    const more = stage === 'main' && !correct;
    showPopup({
      title: correct ? S.right : S.wrong,
      html: `<p class="quiz-ans">${esc(S.answer(item.a))}</p><p>${esc(item.exp)}</p>`,
      buttons: [more ? { label: S.more, cb: () => ask(set.more, 'more') }
        : { label: S.cont, cb: () => { quiz.record(G, G.ep, quiz.resultOf(first, stage === 'more' ? correct : undefined)); store.save(G, 'ep'); next(); } }],
      guardMs: QUIZ_GUARD_MS,
    });
  };
  ask(set.main, 'main');
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
document.getElementById('storyStage').addEventListener('click', () => { sceneIdx++; renderScene(); });
window.LUNA = { get state() { return G; }, engine, showEnding: key => endingScene(key) };   // 프로브·디버그용(showEnding = 상태 주입 뒤 엔딩 화면 바로 그리기)
boot();
