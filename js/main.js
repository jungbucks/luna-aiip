/* main.js — 화면 전환·게임 루프 오케스트레이터.
   규칙 계산은 전부 engine.js에 위임 — 이 파일에 수치·판정 로직을 쓰지 말 것. */
import * as engine from './engine.js';
import * as store from './state.js';
import { EPISODES } from '../data/episodes.js';
import { STRINGS } from '../data/strings.js';
import { startChat, advance, showChoices, choiceOrder, esc, setComposer, sendMine, undoLastMine } from './ui/chat.js';
import { showPopup, deltaLine } from './ui/popup.js';
import { QUIZ } from '../data/quiz.js';
import * as quiz from './quiz.js';
import * as resume from './resume.js';
import { renderCrisis, renderEnding } from './ui/ending.js';
import { IDOLS, idolSVG, setIdol, getIdol, T, setExpression, autoExpression } from './ui/character.js';
import { applyTheme, toggleTheme, watchSystemTheme } from './ui/theme.js';
import * as phone from './ui/phone.js';
import { initSettings, openSettings } from './ui/settings.js';
import * as notebook from './ui/notebook.js';
import * as ourlog from './ui/ourlog.js';
import { initNotebook, openNotebook, askNote, openProduct } from './ui/notebook.js';
import { clearNotes, loadNotes } from './notes.js';

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
  document.querySelectorAll('.js-stat').forEach(el => { el.textContent = G.stats[el.dataset.k]; });   // 메신저 안 점수 알약(끝 값만)
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
  applyTheme(); watchSystemTheme();
  phone.initPhone({ onMessenger: openMessenger, onNotes: openNotebook, onSettings: openSettings, onOurlog: ourlog.openFeed }); phone.startClock();
  initSettings({ onReset: () => resetAll('setReset') });
  initNotebook({ getState: () => G });
  ourlog.initOurlog({ getState: () => G });
  $('btnTheme').onclick = toggleTheme;
  $('lockApp').textContent = STRINGS.ui.lockApp; $('lockNow').textContent = STRINGS.ui.lockNow;
  $('titleChars').innerHTML = idolSVG('sol') + idolSVG('luna');
  $('selRow').innerHTML = Object.keys(IDOLS).map(k =>
    `<button class="sel-card" data-idol="${k}" aria-label="${IDOLS[k].label} 선택">
      <div class="sel-svg">${idolSVG(k)}</div><b>${IDOLS[k].label}</b><i>${IDOLS[k].tag}</i></button>`).join('');
  $('selRow').querySelectorAll('.sel-card').forEach(btn => btn.onclick = () => pickIdol(btn.dataset.idol));
  $('selBack').onclick = () => {   // 제목 화면으로(2026-11-24). 기록은 [새로 시작]에서 이미 지웠으니 이어 하기는 숨긴다
    $('btnContinue').style.display = store.load() ? '' : 'none';
    show('scr-title');
    $('btnNew').focus({ preventScroll: true });
  };
  const saved = store.load();
  $('btnContinue').style.display = saved ? '' : 'none';
  $('btnContinue').onclick = () => {   // 진행 중이면 EP 시작 상태에서 다시(점수 두 번 방지), 끝난 판이면 그 엔딩·리포트 그대로
    const p = resume.resumePoint(saved);
    G = p.state; applyIdol(G.idol);
    if (p.ended) endingScene(engine.judgeEnding(G)); else enterEp();
  };
  const U = STRINGS.ui, S = U.settings;
  $('btnNew').onclick = () => {
    if (!$('scr-title').classList.contains('active')) return;
    askWipe('btnNew', U.newTitle, U.newAsk, U.newNo, U.newYes, startNew);
  };
  $('btnReset').onclick = () => askWipe('btnReset', S.reset, S.resetAsk, S.resetNo, S.resetYes, () => resetAll('btnReset'));
  show('scr-title');
}

/* 타이틀의 새로 시작·기록 초기화: 지울 기록(게임·적은 글)이 있으면 한 번 묻고, 승인한 뒤에만 지운다.
   처음 온 사람(기록 없음)은 묻지 않는다. 그만두면 누른 단추로 초점을 돌려준다 */
const hasRecords = () => !!store.load() || Object.keys(loadNotes()).length > 0;
function askWipe(btnId, title, ask, no, yes, onYes) {
  if (!hasRecords()) return onYes();
  showPopup({
    title,
    html: `<p>${esc(ask)}</p>`,
    buttons: [{ label: no, cls: 'ghost', cb: () => $(btnId).focus() }, { label: yes, cls: 'danger', cb: onYes }], esc: 0,
  });
}

/* 게임 기록·적은 글을 각각 지우고 확인한다(보안 검토 2026-11-18 B). 다 지워졌을 때만 then()(새 판·새로 고침).
   하나라도 남으면 남은 것을 알리고 [다시 지우기]를 준다 — 그만두면 누른 단추(backId)로 초점을 돌려준다 */
function wipeThen(then, backId) {
  const W = STRINGS.ui.wipeFail, left = [];
  if (!store.clear()) left.push(W.save);
  if (!clearNotes()) left.push(W.notes);
  if (!left.length) { if (window.GameCertificate) return window.GameCertificate.begin().then(then); return then(); }
  showPopup({
    title: W.title,
    html: `<p>${esc(W.ask)}</p><ul class="wipe-left">${left.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`,
    buttons: [{ label: W.no, cls: 'ghost', cb: () => { const b = $(backId); if (b && b.offsetParent !== null) b.focus(); } },
      { label: W.retry, cls: 'danger', cb: () => wipeThen(then, backId) }], esc: 0,
  });
}

function startNew() {
  wipeThen(() => {
    G = engine.newGame();
    show('scr-select');
    $('selRow').querySelector('.sel-card').focus();   // 키보드로 바로 고를 수 있게
  }, 'btnNew');
}

/* 기록 초기화(타이틀·설정·엔딩 공통): 게임 기록 + 수첩에 적은 글. 화면 모드(luna_theme)는 지우지 않는다.
   다 지워졌을 때만 새로 고친다 */
function resetAll(backId) {
  wipeThen(() => location.reload(), backId);
}

function applyIdol(key) {
  setIdol(key);
  $('epChar').innerHTML = idolSVG(getIdol());
  $('introChar').innerHTML = idolSVG(getIdol());
  $('chatAva').innerHTML = idolSVG(getIdol());
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
    <button type="button" class="tap-hint" id="introNext">눌러서 계속 (${i + 1}/${STRINGS.intro.length})</button>`;
  $('introCard').onclick = () => intro(i + 1);   // 카드 어디를 눌러도, 단추를 Enter·Space로 눌러도 click 한 번 = 한 장면(keydown은 따로 받지 않는다)
  show('scr-intro');
  $('introNext').focus({ preventScroll: true });
}

/* ── 에피소드 (v0.6: 홈 화면 위 스토리 씬 → 알림 대기 → 알림·메신저를 누르면 채팅 자동 재생) ── */
let sceneIdx = 0;
let chatStarted = false;   // 이 EP의 채팅을 이미 시작했는가(알림 연타·다시 열기에 두 번 시작하지 않게)
let settled = false;       // 이 EP의 정산(bridge)을 이미 했는가 — 💰+10은 EP마다 한 번(ourlog 알림·앱 닫기 연타 방지)
let choiceKeys = ['wrong', 'right', 'info'];   // 이 EP의 선택지 순서(enterEp에서 섞는다)

function enterEp() {
  resume.markEpStart(G); store.save(G, 'ep');   // 이어 하기 시작점(2026-11-14 — 선택·퀴즈·정산 중 새로 고침해도 점수가 두 번 들어가지 않게)
  updateStatbar();
  autoExpression(G);
  $('epHead').textContent = T(`EP${G.ep} 「${ep().title}」 — ${ep().rightEmoji} ${ep().right}`);
  $('statHelp').textContent = G.ep === 1 ? STRINGS.statHelp : '';   // 점수 이름표의 뜻은 첫 편에서 한 번(2026-11-20)
  show('scr-ep');
  sceneIdx = 0;
  chatStarted = false;
  choiceKeys = choiceOrder((window.__rand || Math.random)());   // window.__rand = 프로브가 순서를 정해 두는 자리
  while (phone.topApp()) phone.closeApp(null, false);   // 열려 있던 앱은 닫고 홈에서 시작
  settled = false;   // 앱을 다 닫은 뒤에 — 그 사이 남아 있던 onceClosed(지난 편 ourlog 정산)가 불려도 새 편을 정산하지 않게
  phone.clearNotify();
  phone.setHome('story');
  renderScene();
}

function renderScene() {
  const scenes = ep().scenes || [];
  if (sceneIdx >= scenes.length) { notifyPhase(); return; }
  const s = scenes[sceneIdx];
  const stage = $('storyStage');
  stage.classList.remove('on'); void stage.offsetWidth; stage.classList.add('on');
  $('storyEmoji').textContent = s.emoji;
  $('storyText').innerHTML = esc(T(s.text)).replace(/\n/g, '<br>');
  $('storyIdx').textContent = (sceneIdx + 1) + '/' + scenes.length;
  $('storyNext').setAttribute('aria-label', '눌러서 계속 (' + (sceneIdx + 1) + '/' + scenes.length + ')');   // 읽어 주기 이름이 '()'로 비던 것(2026-11-20)
  $('storyNext').focus({ preventScroll: true });   // 키보드: 다음 장면 단추(click은 무대가 받는다 — 한 번에 한 장면)
}

/* 스토리가 끝나면 알림이 온다 — 그 EP 첫 메시지 미리보기. 누를 때까지 기다린다 */
function notifyPhase() {
  $('storyStage').classList.remove('on');
  const m = ep().messages[0];
  phone.showNotify({ room: T(ep().roomName), preview: T(m.who + ': ' + m.text) });
  $('notifBanner').focus({ preventScroll: true });   // 키보드: 장면 단추가 사라졌으니 알림으로(Enter로 메신저)
}

function openMessenger() {
  phone.clearNotify();
  phone.openApp('messenger');
  if (!chatStarted) { chatStarted = true; startChat(ep(), choicesPhase); }
}

/* 내 답장 말풍선: A·B를 고르면 그 문구가 먼저 나가고, 잠깐 뒤에 결과가 온다.
   기다리는 동안 규칙은 아직 적용 전 — 이때 새로 고쳐도 점수가 어긋나지 않는다. */
const MINE_DELAY_MS = 600;
let pickLocked = false;
function sayThen(label, next) {
  if (pickLocked) return;                            // 연타 방지
  pickLocked = true;
  $('chatChoices').innerHTML = '';                   // 버튼을 먼저 없앤다
  setComposer('idle');
  sendMine(label);
  phone.holdApps(true);                              // 기다리는 동안 메신저를 나가 다른 앱을 열지 못하게(2026-11-17 검토)
  setTimeout(() => { phone.holdApps(false); next(); }, REDUCED ? 0 : MINE_DELAY_MS);
}

function choicesPhase() {
  const c = ep().choices;
  pickLocked = false;
  const byKey = {
    wrong: { text: c.wrong.label, disabled: G.retryUsed, cb: () => sayThen(c.wrong.label, showWrongPopup) },
    right: { text: c.right.label, cb: () => sayThen(c.right.label, rightFlow) },
    info: { text: c.info.label, cls: 'info', cb: showHint },
  };
  // 오답·정답은 겉모습이 같고 자리만 편마다 다르다(순서는 EP에 들어설 때 한 번 정해 다시 선택 때도 그대로)
  showChoices('뭐라고 답할까?', choiceKeys.map((k, i) => ({ ...byKey[k], key: k, label: 'ABC'[i] + '. ' + byKey[k].text })));
  if (focusLost()) focusIn($('chatChoices').querySelector('.choice-btn:not(:disabled)'));   // [다시 선택하기]로 팝업이 닫히면 초점이 갈 곳이 없었다
}

/* 키보드 초점이 사라졌는가 — 팝업·법정 화면이 닫히며 초점 있던 단추가 안 보이게 된 경우(2026-11-20 검토).
   보이는 곳(메신저 뒤로 단추 등)에 초점이 있으면 건드리지 않는다 */
function focusLost() {
  const a = document.activeElement;
  return !a || a === document.body || !a.isConnected || a.getClientRects().length === 0;
}
const focusIn = el => { if (el) el.focus({ preventScroll: true }); };

function showHint() {
  showPopup({
    title: '💡 생각해 볼 것',   // 질문 카드(2026-11-20) — 정답 요약(concept)은 선택 뒤 수첩에서
    html: `<p>${esc(ep().hint)}</p>`,
    buttons: [{ label: '↩ 다시 고민하기', cb: () => focusIn($('chatChoices').querySelector('.choice-btn[data-k="info"]')) }],   // 연 단추로 초점을 돌려준다
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
      <p class="delta">${deltaLine(w.delta)}</p>
      <p class="lesson">📚 배운 것: ${esc(w.popup.lesson)}</p>`,
    buttons, face: true,
  });
}

function retryFlow() {
  undoLastMine(STRINGS.ui.rethink);
  const ev = engine.chooseWrongRetry(G, G.ep, ep().choices.wrong.delta);
  store.save(G, 'ep');
  updateStatbar(); autoExpression(G);
  if (ev) return crisisScene(choicesPhase);
  choicesPhase();   // 오답 비활성 상태로 재선택
}

function acceptFlow() {
  const ev = engine.chooseWrongAccept(G, G.ep, ep().choices.wrong.delta);
  store.save(G, 'ep');
  updateStatbar(); autoExpression(G);
  if (ev) return crisisScene(() => quizThen(noteStep));   // 위기 점검 회의 뒤에도 이 편을 끝까지 배운다(2026-11-20)
  quizThen(noteStep);
}

function rightFlow() {
  const isRetry = G.retryUsed, r = ep().choices.right;
  const got = engine.rightDeltaFor(G, r.delta), halved = !!G.broke;   // 통장이 바닥난 다음 편이면 보상 절반(engine) — 실제로 들어온 값을 보여 준다
  engine.chooseRight(G, G.ep, r.delta);
  store.save(G, 'ep');
  updateStatbar();
  setExpression('happy');
  showPopup({
    title: r.popup.title + (isRetry ? STRINGS.ui.retrySuffix : ''),
    html: `<p>${esc(r.popup.body)}</p><p class="delta">${deltaLine(got)}</p>` + (halved ? `<p class="money-zero">${esc(STRINGS.brokeNote)}</p>` : '')
      + (isRetry && G.badges.filter(b => b === 'half').length === 1 ? `<p class="money-zero">${esc(STRINGS.ui.halfNote)}</p>` : ''),   // 다시 생각해 고친 첫 편에서 한 줄 — 이해는 다음 적용 문제로 확인
    buttons: [{ label: '계속 →', cb: () => quizThen(noteStep) }], face: true,
  });
}

/* ── 알게 된 것 적기(v0.6, 스탯 무관) — 퀴즈 뒤·정산 앞. 권리 수첩이 열려 적어야 다음으로 넘어간다 ── */
const noteStep = () => askNote(G.ep, ourlogStep);

/* ── ourlog 알림(2026-11-20, 스탯 무관) — 적기 뒤·정산 앞. [넘어가기]면 바로, [열기]면 ourlog 앱을 닫을 때 정산 ── */
function ourlogStep() { ourlog.offer(G, { onDone: bridge }); }

/* ── 새 사례 적용 문제(O/X, 2026-11-14 → 2026-11-20 개편, 스탯 무관) — 정산(bridge) 직전.
   두 문항을 모두 푼다(틀린 사람만 보는 문항 없음). 맞힌 수가 그 편의 학습 결과(G.quiz, js/quiz.js) ── */
const QUIZ_GUARD_MS = 300;   // 팝업이 뜬 직후 연타가 다음 팝업 버튼을 누르지 않게
function quizThen(next) {
  const set = QUIZ[G.ep], E = ep(), S = STRINGS.quiz;
  if (!set || !set.items || !set.items.length) return next();
  const items = set.items;
  let correctN = 0;
  const ask = i => showPopup({
    title: S.title + ' ' + (i + 1) + '/' + items.length,
    html: `<p class="quiz-tag">${E.rightEmoji} ${esc(E.right)}</p><p class="quiz-q">${esc(items[i].q)}</p>`,
    buttons: [{ label: S.o, cb: () => answer(i, true) }, { label: S.x, cb: () => answer(i, false) }],
    guardMs: QUIZ_GUARD_MS,
  });
  const answer = (i, v) => {
    const item = items[i], correct = v === item.a;
    if (correct) correctN++;
    const last = i === items.length - 1;
    showPopup({
      title: correct ? S.right : S.wrong, titleCls: correct ? 'ok' : 'warn',
      html: `<p class="quiz-ans">${esc(S.answer(item.a))}</p><p>${esc(item.exp)}</p>`,
      buttons: [last ? { label: S.cont, cb: () => { quiz.record(G, G.ep, quiz.scoreOf(correctN)); store.save(G, 'ep'); next(); } }
        : { label: S.next, cb: () => ask(i + 1) }],
      guardMs: QUIZ_GUARD_MS,
    });
  };
  ask(0);
}

/* ── 브릿지(정산) → 다음 EP / 엔딩 ── 한 EP에 한 번만(💰+10). 알림 카드·ourlog 닫기 어느 길로 두 번 와도 다음 enterEp까지 무시 */
function bridge() {
  if (settled) return;
  settled = true;
  const broke = engine.settle(G);   // 정산 직전 💰 0 = 통장 바닥(예전 검사는 +10 뒤에 봐서 한 번도 뜨지 않았다, 2026-11-20)
  store.save(G, 'ep');
  updateStatbar();
  if (G.ep === 6) {
    const end = engine.judgeEnding(G);
    store.save(G, 'end');
    return endingScene(end);
  }
  const next = EPISODES[G.ep];   // 다음 EP (0-index라 현재 ep가 곧 다음)
  /* 정산이 끝난 순간 다음 EP의 시작 지점으로 저장(2026-11-24 플레이테스트 [2]) — 예전엔 [EP 시작] 단추를 눌러야 저장돼서
     이 팝업에서 새로 고치면 방금 끝낸 EP 처음으로 돌아가 배지·점수가 사라졌다. 정산은 이 사본에 이미 들어 있어 두 번 들어가지 않는다 */
  engine.nextEp(G); resume.markEpStart(G); store.save(G, 'ep');
  const B = STRINGS.broke;
  const zero = broke ? `<p class="money-zero"><b>${esc(B.who)}</b>: ${esc(B.text)}</p><p class="money-zero">${esc(B.rule)}</p>` : '';
  showPopup({
    title: STRINGS.bridgeSettle,
    html: `${zero}<p>${esc(STRINGS.bridgeNext(next)).replace(/\n/g, '<br>')}</p>`,
    buttons: [{ label: `EP${next.id} 시작 →`, cb: enterEp }],
  });
}

/* ── 회사 위기 점검 회의 / 엔딩 ── 회의는 게임을 끝내지 않는다: 신뢰 30으로 회복하고 하던 결정으로 돌아간다 */
function crisisScene(contCb) {
  setExpression('panic');
  show('scr-court');
  renderCrisis(G, () => {
    store.save(G, 'ep');
    updateStatbar(); autoExpression(G);
    show('scr-ep');
    contCb();
  });
  $('scr-court').scrollTop = 0;
  focusIn($('courtBtn'));   // 키보드: 회의 화면의 단추로
}

/* 수료증 그림에 덧붙이는 것: 고른 아이돌 그림 + 운영 결과·처음 판단·새 사례 적용(공용 파일 js/completion-certificate.js는 게임 내용을 모른다) */
function certExtras(key) {
  const R = STRINGS.report, n = b => G.badges.filter(x => x === b).length;
  const learned = EPISODES.filter(e => quiz.learnAt(G, e.id) === 'confirmed').length;
  return {
    art: `assets/characters/${IDOLS[G.idol] ? G.idol : getIdol()}-happy.png`,
    lines: [
      { label: R.certOps, value: (STRINGS.endings[key] || STRINGS.endings.survive).name },
      { label: R.firstHead, value: R.certFirst(n('full'), n('half'), n('none')) },
      { label: R.learnHead, value: R.certLearn(learned, EPISODES.length) },
    ],
  };
}

function endingScene(key) {
  if (key === 'unicorn') setExpression('happy');
  const U = STRINGS.ui;
  renderEnding(G, key,
    () => showPopup({                                  // 다시 하기 전에 한 번 묻는다 — 적은 글도 지워지므로
      title: U.restartTitle,
      html: `<p>${esc(U.restartAsk)}</p>`,
      buttons: [{ label: U.restartNo, cls: 'ghost', cb: () => $('endRestart').focus() }, { label: U.restartYes, cls: 'danger', cb: () => resetAll('endRestart') }], esc: 0,
    }),
    () => openProduct((STRINGS.endings[key] || STRINGS.endings.survive).name, $('endProduct')));
  if (G.ep === 6 && G.ending && window.GameCertificate) window.GameCertificate.mount($('scr-end'), certExtras(key));
  show('scr-end');
  $('scr-end').scrollTop = 0;                   // 늘 엔딩 맨 위부터(2026-11-20)
  focusIn($('scr-end').querySelector('h2'));   // 키보드·읽어 주기: 엔딩 제목부터(ending.js가 tabindex="-1"을 단다)
}

/* ── 부트 ── */
document.getElementById('chatLog').addEventListener('click', advance);
document.getElementById('composer').addEventListener('click', advance);
document.getElementById('storyStage').addEventListener('click', () => { if ($('storyStage').classList.contains('on')) { sceneIdx++; renderScene(); } });
window.LUNA = { get state() { return G; }, engine, phone, notebook, showEnding: key => endingScene(key) };   // 프로브·디버그용(showEnding = 상태 주입 뒤 엔딩 화면 바로 그리기)
boot();
