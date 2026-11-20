/* notebook.js — 권리 수첩 앱 + 산출물 "나의 권리 수첩" (v0.6).
   · 보기: 선택을 마친 EP의 배지·개념 한 줄·내가 적은 글. 진행 중인 EP의 힌트는 보여 주지 않는다.
   · 적기: EP의 O/X 퀴즈 뒤 저절로 열려 알게 된 것을 적는다(5자 이상, 건너뛰기 없음). 평소에는 [고치기]로.
   · 산출물: 한 장으로 모아 인쇄·PDF 저장 / 글 복사.
   규칙·게임 저장에는 손대지 않는다. 학생이 적은 글은 반드시 escPlain()을 거쳐 그린다. */
import { EPISODES } from '../../data/episodes.js';
import { STRINGS } from '../../data/strings.js';
import { esc, statsLine } from './chat.js';
import { T } from './character.js';
import { openApp, closeApp, lockApps, armBack, onSheetBack } from './phone.js';
import { getNote, saveNote, isValid, MIN_LEN, MAX_LEN, buildProductText } from '../notes.js';

const $ = id => document.getElementById(id);
let getState = () => null;
let writing = null;         // { epId, done } — done이 있으면 "적어야 다음으로"(퀴즈 뒤), 없으면 고치기
let productResult = null;   // 산출물에 적을 결과 이름(엔딩에서 열면 엔딩 이름)
let productOpener = null;   // 산출물을 연 버튼 — 닫으면 여기로 초점을 돌려준다

/* 학생이 적은 글 전용 이스케이프 — esc()와 달리 이름 토큰({n})을 바꾸지 않는다(적은 글자 그대로) */
function escPlain(s) {
  return String(s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}
const badgeLabel = b => STRINGS.report.badgeLabel[b] || STRINGS.report.badgeLabel.none;
const BADGE_CLS = { full: 'b-full', half: 'b-half', none: 'b-none' };   // 저장값을 class에 그대로 넣지 않는다(보안 검토 2026-11-18 C)
const badgeCls = b => (Object.prototype.hasOwnProperty.call(BADGE_CLS, b) ? BADGE_CLS[b] : 'b-none');

export function initNotebook(opts) {
  getState = opts.getState;
  $('notesTitle').textContent = STRINGS.ui.notes.title;
  $('prodTitle').textContent = STRINGS.ui.product.title;
  $('btnPrint').textContent = STRINGS.ui.product.print;
  $('btnCopy').textContent = STRINGS.ui.product.copy;
  $('prodBack').onclick = closeProduct;      // 산출물 층은 앱 스택 밖(엔딩 화면에서도 열린다)
  onSheetBack(closeProduct);                 // 폰의 뒤로 가기로 닫힐 때도 같은 길로(잠금 해제·초점 복원)
  $('btnPrint').onclick = () => window.print();
  $('btnCopy').onclick = copyProduct;
  document.addEventListener('keydown', e => {   // 산출물 층도 모달: ESC로 닫고, Tab은 층 안에서만(2026-11-20)
    const sheet = $('productSheet');
    if (!sheet.classList.contains('on')) return;
    if (e.key === 'Escape') { e.preventDefault(); closeProduct(); return; }
    if (e.key !== 'Tab') return;
    const f = [...sheet.querySelectorAll('button:not(:disabled), a[href], input, textarea')].filter(x => x.offsetParent !== null);
    if (!f.length) return;
    const i = f.indexOf(document.activeElement);
    if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && (i === -1 || i === f.length - 1)) { e.preventDefault(); f[0].focus(); }
  });
}

/* ── 목록 ── */
function cardHTML(e, i, state) {
  const S = STRINGS.ui.notes, badge = state ? state.badges[i] : null;
  if (writing && writing.epId === e.id) {
    return `<div class="note-card" data-ep="${e.id}" data-state="write">
      <b class="note-h">${e.rightEmoji} ${esc(e.right)}</b>
      <label class="note-prompt" for="noteInput">${esc(S.prompt)}</label>
      <textarea id="noteInput" rows="4" maxlength="${MAX_LEN}" placeholder="${esc(S.placeholder)}">${escPlain(getNote(e.id))}</textarea>
      <div class="note-meta"><span id="noteNeed">${esc(S.need(MIN_LEN))}</span><span id="noteCount"></span></div>
      <button type="button" class="choice-btn primary" id="noteSave">${esc(S.save)}</button>
    </div>`;
  }
  if (badge == null) {       // 아직 선택을 마치지 않은 EP
    return `<div class="note-card" data-ep="${e.id}" data-state="locked">
      <b class="note-h">${e.rightEmoji} ${esc(e.right)}</b><p class="note-lock">${esc(S.locked(e.id))}</p></div>`;
  }
  const note = getNote(e.id);
  const mustWrite = !!(writing && writing.done);   // 필수 적기 중에는 다른 카드를 고칠 수 없다 — 고치기가 필수 진행을 덮어 갇히던 것(2026-11-17 검토)
  return `<div class="note-card" data-ep="${e.id}" data-state="open">
    <b class="note-h">${e.rightEmoji} ${esc(e.right)} <span class="note-badge ${badgeCls(badge)}">${esc(badgeLabel(badge))}</span></b>
    <p class="note-hint">${esc(e.concept)}</p>
    ${note ? `<div class="note-mine"><span class="note-mine-l">${esc(S.mine)}</span><p>${escPlain(note)}</p></div>` : ''}
    ${mustWrite ? '' : `<button type="button" class="note-edit" data-ep="${e.id}">${esc(note ? S.edit : S.save)}</button>`}
  </div>`;
}

export function renderNotebook() {
  const S = STRINGS.ui.notes, state = getState();
  const mustWrite = !!(writing && writing.done);
  $('notesList').innerHTML = EPISODES.map((e, i) => cardHTML(e, i, state)).join('') +
    `<p class="note-local">${esc(S.local)}</p>` +
    (mustWrite ? '' : `<button type="button" class="choice-btn" id="notesProduct">${esc(S.product)}</button>`);
  $('notesList').querySelectorAll('.note-edit').forEach(b => { b.onclick = () => startWriting(Number(b.dataset.ep), null); });
  const p = $('notesProduct');
  if (p) p.onclick = () => openProduct(null, p);
  if (writing) bindWriteCard();
}

function bindWriteCard() {
  const input = $('noteInput'), save = $('noteSave');
  const refresh = () => {
    const ok = isValid(input.value);
    save.disabled = !ok;
    $('noteNeed').style.visibility = ok ? 'hidden' : 'visible';
    $('noteCount').textContent = [...input.value].length + '/' + MAX_LEN;
  };
  input.oninput = refresh;
  save.onclick = () => {
    if (!isValid(input.value)) return;
    saveNote(writing.epId, input.value);      // 저장소를 못 써도 그 판에서는 메모리 사본으로 보인다
    const done = writing.done;
    writing = null;
    if (done) { lockApps(false); closeApp('notes', false); done(); }
    else renderNotebook();
  };
  refresh();
}

function startWriting(epId, done) {
  writing = { epId, done };
  renderNotebook();
  const input = $('noteInput');
  input.focus({ preventScroll: true });
  input.closest('.note-card').scrollIntoView({ block: 'center' });
}

export function openNotebook() {
  writing = null;
  renderNotebook();
  openApp('notes');
}

/* 퀴즈 뒤·정산 앞: 수첩이 열려 그 EP에서 알게 된 것을 적는다. 적어야 done()으로 넘어간다 */
export function askNote(epId, done) {
  lockApps(true);
  openApp('notes');
  startWriting(epId, done);
}

/* ── 산출물 "나의 권리 수첩" ── */
function productData() {
  const P = STRINGS.ui.product, state = getState(), d = new Date();
  const pad = n => String(n).padStart(2, '0');
  return {
    title: P.title,
    name: $('prodName') ? $('prodName').value.trim() : '',
    date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
    idol: T('{n}'),
    result: productResult || P.inProgress,
    stats: state ? state.stats : { money: 0, fame: 0, safety: 0 },
    items: EPISODES.map((e, i) => {
      const b = state ? state.badges[i] : null;      // 아직 선택을 마치지 않은 EP는 수첩과 똑같이 개념 힌트를 가린다
      return {
        id: e.id, emoji: e.rightEmoji, right: T(e.right), badge: b == null ? '—' : badgeLabel(b),
        hint: b == null ? STRINGS.ui.notes.locked(e.id) : T(e.concept), note: getNote(e.id),
      };
    }),
  };
}

export function openProduct(endingName, opener) {
  const P = STRINGS.ui.product;
  productResult = endingName || null;
  const data = productData();
  $('prodPaper').innerHTML = `
    <h2 class="prod-title">${escPlain(data.title)}</h2>
    <label class="prod-name"><span>${esc(P.name)}</span><input id="prodName" type="text" maxlength="30" autocomplete="off"></label>
    <div class="prod-meta"><span>${data.date}</span><span>${esc(P.withIdol)}: ${escPlain(data.idol)}</span></div>
    <div class="prod-result"><b>${esc(P.result)}: ${escPlain(data.result)}</b><span>${statsLine(data.stats)}</span></div>
    ${data.items.map(it => `<div class="prod-note" data-ep="${it.id}">
      <b>${it.emoji} ${escPlain(it.right)} <span class="prod-badge">${escPlain(it.badge)}</span></b>
      <p class="prod-hint">${escPlain(it.hint)}</p>
      <p class="prod-mine">${it.note ? escPlain(it.note) : `<i>${esc(P.empty)}</i>`}</p>
    </div>`).join('')}
    <p class="disclaimer">${esc(STRINGS.report.disclaimer)}</p>`;
  $('prodStatus').textContent = '';
  productOpener = opener || document.activeElement;
  setBackInert(true);
  $('productSheet').classList.add('on');
  armBack();                                  // 폰의 뒤로 가기로 이 층만 닫히게
  $('prodBack').focus({ preventScroll: true });
}

export function closeProduct() {
  if (!$('productSheet').classList.contains('on')) return;
  $('productSheet').classList.remove('on');
  setBackInert(false);
  if (productOpener && productOpener.isConnected) productOpener.focus({ preventScroll: true });
  productOpener = null;
}

/* 산출물이 떠 있는 동안 뒤 화면(#app의 다른 자식)은 키보드·읽어 주기에 닿지 않게 — 팝업과 같은 방식.
   산출물 위에서는 팝업이 뜨지 않으므로 팝업의 잠금과 겹치지 않는다. */
function setBackInert(on) {
  [...$('app').children].forEach(el => { if (el.id !== 'productSheet' && el.id !== 'popup') el.toggleAttribute('inert', on); });
}

async function copyProduct() {
  const P = STRINGS.ui.product, text = buildProductText(productData());
  let ok = false;
  try { await navigator.clipboard.writeText(text); ok = true; }
  catch (e) {                                 // 클립보드 API가 없거나 막힌 브라우저
    try {
      const ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;left:-9999px;top:0';
      document.body.appendChild(ta); ta.select();
      ok = document.execCommand('copy');
      ta.remove();
    } catch (e2) { ok = false; }
  }
  $('prodStatus').textContent = ok ? P.copied : P.copyFail;
}
