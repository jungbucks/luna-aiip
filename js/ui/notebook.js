/* notebook.js — 권리 수첩 앱 (v0.6). 지나온 EP의 배지와 개념 한 줄을 모아 본다.
   보여 주기만 한다 — 규칙·게임 저장에는 손대지 않는다. 진행 중인 EP의 힌트는 보여 주지 않는다(선택을 마친 EP만 열림). */
import { EPISODES } from '../../data/episodes.js';
import { STRINGS } from '../../data/strings.js';
import { esc } from './chat.js';
import { openApp } from './phone.js';

const $ = id => document.getElementById(id);
let getState = () => null;

export function initNotebook(opts) {
  getState = opts.getState;
  $('notesTitle').textContent = STRINGS.ui.notes.title;
}

function cardHTML(e, i, state) {
  const S = STRINGS.ui.notes, badge = state ? state.badges[i] : null;
  if (badge == null) {       // 아직 선택을 마치지 않은 EP
    return `<div class="note-card" data-ep="${e.id}" data-state="locked">
      <b class="note-h">${e.rightEmoji} ${esc(e.right)}</b><p class="note-lock">${esc(S.locked(e.id))}</p></div>`;
  }
  return `<div class="note-card" data-ep="${e.id}" data-state="open">
    <b class="note-h">${e.rightEmoji} ${esc(e.right)} <span class="note-badge b-${badge}">${esc(STRINGS.report.badgeLabel[badge] || STRINGS.report.badgeLabel.none)}</span></b>
    <p class="note-hint">${esc(e.hint)}</p></div>`;
}

export function renderNotebook() {
  const state = getState();
  $('notesList').innerHTML = EPISODES.map((e, i) => cardHTML(e, i, state)).join('');
}

export function openNotebook() {
  renderNotebook();
  openApp('notes');
}
