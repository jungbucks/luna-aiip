/* phone.js — 폰 껍데기의 움직임 (v0.6): 시계·날짜, 홈 화면 상태(스토리/알림/평소), 앱 열기·닫기, 뒤로 가기, 장식 앱.
   규칙 계산 없음. 게임 진행(무엇을 언제 여는가)은 main.js가 정하고, 여기는 화면만 바꾼다. */
import { STRINGS } from '../../data/strings.js';

const $ = id => document.getElementById(id);
const LAYER = { messenger: 'phoneWrap', notes: 'appNotes', settings: 'appSettings' };
const DOCK = { messenger: 'dockMsg', notes: 'dockNotes', settings: 'dockSettings' };

/* ── 시계·날짜: 분이 바뀔 때마다 ── */
export function startClock() {
  const d = new Date();
  const hm = d.getHours() + ':' + String(d.getMinutes()).padStart(2, '0');
  $('phoneTime').textContent = hm;
  $('lockClock').textContent = hm;
  $('lockDate').textContent = `${d.getMonth() + 1}월 ${d.getDate()}일 ${'일월화수목금토'[d.getDay()]}요일`;
  $('calDow').textContent = '일월화수목금토'[d.getDay()];
  $('calDay').textContent = d.getDate();
  setTimeout(startClock, (60 - d.getSeconds()) * 1000 + 50);
}

/* ── 홈 화면 상태 ── story: 스토리 카드가 덮고 앱은 안 눌림 / notify: 알림 대기 / idle: 평소 */
export function setHome(state) {
  $('scr-ep').dataset.home = state;
  sync();
}
const homeState = () => $('scr-ep').dataset.home;

export function showNotify({ room, preview }) {
  const b = $('notifBanner');
  b.querySelector('.nb-room').textContent = room;
  b.querySelector('.nb-preview').textContent = preview;
  b.querySelector('.nb-time').textContent = STRINGS.ui.lockNow;
  $('homeHint').textContent = STRINGS.ui.notifyHint;
  setHome('notify');
  b.classList.add('in');
}

export function clearNotify() {
  $('notifBanner').classList.remove('in');
  $('homeHint').textContent = '';
  if (homeState() === 'notify') setHome('idle');
}

/* ── 앱 층 ── stack의 맨 뒤가 맨 위에 열린 앱 */
const stack = [];
let armed = false, locked = false;

export const topApp = () => stack[stack.length - 1] || null;
export const isOpen = name => stack.includes(name);

/* 가려진 층은 키보드·읽어 주기에도 닿지 않게 */
function sync() {
  const top = topApp();
  $('homeScreen').inert = homeState() === 'story' || stack.length > 0;
  Object.keys(LAYER).forEach(n => { $(LAYER[n]).inert = isOpen(n) && n !== top; });
  $('scr-ep').dataset.msgopen = isOpen('messenger') ? '1' : '';
}

export function openApp(name) {
  if (!LAYER[name] || isOpen(name)) return;
  stack.push(name);
  $(LAYER[name]).classList.add('on');
  sync();
  arm();
  const back = $(LAYER[name]).querySelector('.app-back');
  if (back && !locked) back.focus({ preventScroll: true });
}

export function closeApp(name, restoreFocus = true) {
  const n = name || topApp();
  const i = stack.indexOf(n);
  if (i < 0) return;
  stack.splice(i, 1);
  $(LAYER[n]).classList.remove('on');
  sync();
  if (restoreFocus && !stack.length) $(DOCK[n]).focus({ preventScroll: true });
}

/* 적기 단계처럼 "끝내야 나갈 수 있는" 동안: 뒤로 버튼을 숨기고 뒤로 가기를 무시 */
export function lockApps(on) {
  locked = on;
  $('app').toggleAttribute('data-locked', on);
}

/* ── 뒤로 가기 ── 방문 기록을 한 칸만 쓴다. 프로그램이 history.back()을 부르지 않는다(경합 방지).
   앱이 닫힌 뒤 한 칸이 남아 있으면 홈에서의 첫 뒤로 가기가 한 번 헛돌 수 있다 — 감수한다. */
function arm() {
  if (armed) return;
  try { history.pushState({ lunaApp: 1 }, ''); armed = true; } catch (e) { /* 일부 환경에서 막혀도 게임은 계속 */ }
}

function onPopState() {
  armed = false;                                   // 방금 그 한 칸을 썼다
  const popup = $('popup').classList.contains('show');
  if (locked || popup) { if (stack.length) arm(); return; }   // 무시하고 한 칸 되채움
  if (stack.length) { closeApp(); if (stack.length) arm(); }
}

/* ── 초기화 ── 독 아이콘 클릭을 거는 곳은 여기 하나뿐 */
export function initPhone({ onMessenger, onNotes, onSettings }) {
  const A = STRINGS.ui.apps;
  const label = { appCity: A.city, appCal: A.cal, dockCall: A.call, dockMsg: A.msg, dockNotes: A.notes, dockSettings: A.settings };
  Object.keys(label).forEach(id => {
    const el = $(id);
    el.querySelector('.app-name').textContent = label[id];
    if (el.classList.contains('app-decor')) el.setAttribute('aria-label', label[id] + STRINGS.ui.decorSuffix);
  });
  document.querySelectorAll('.app-back').forEach(b => b.setAttribute('aria-label', STRINGS.ui.back));

  const guarded = fn => () => { if (homeState() !== 'story') fn(); };
  $('notifBanner').onclick = guarded(onMessenger);
  $('dockMsg').onclick = guarded(onMessenger);
  $('dockNotes').onclick = guarded(onNotes || (() => openApp('notes')));
  $('dockSettings').onclick = guarded(onSettings || (() => openApp('settings')));

  document.querySelectorAll('.app-back').forEach(b => { b.onclick = () => { if (!locked) closeApp(); }; });
  document.querySelectorAll('.app-decor').forEach(a => {     // 장식 앱: 살짝 흔들리고 끝
    a.onclick = () => { a.classList.remove('nope'); void a.offsetWidth; a.classList.add('nope'); };
  });
  window.addEventListener('popstate', onPopState);
  sync();
}
