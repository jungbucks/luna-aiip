/* settings.js — 설정 앱 (v0.6): 화면 모드(기기 설정 따름/라이트/다크) + 기록 초기화(한 번 더 묻는다). */
import { STRINGS } from '../../data/strings.js';
import { esc } from './chat.js';
import { showPopup } from './popup.js';
import { openApp } from './phone.js';
import { getThemePref, setThemePref } from './theme.js';

const $ = id => document.getElementById(id);
let onReset = () => {};

function render() {
  const S = STRINGS.ui.settings, pref = getThemePref();
  const seg = ['system', 'light', 'dark'].map(p =>
    `<button type="button" data-theme-pref="${p}" aria-pressed="${p === pref}">${esc(S[p])}</button>`).join('');
  $('settingsBody').innerHTML = `
    <div class="set-group">
      <div class="set-label" id="setModeLabel">${esc(S.mode)}</div>
      <div class="seg" role="group" aria-labelledby="setModeLabel">${seg}</div>
    </div>
    <div class="set-group">
      <button type="button" class="set-row danger" id="setReset">${esc(S.reset)}</button>
    </div>
    <p class="set-ver">${esc(S.version)}</p>`;
  $('settingsBody').querySelectorAll('[data-theme-pref]').forEach(b => {
    b.onclick = () => { setThemePref(b.dataset.themePref); render(); $('settingsBody').querySelector(`[data-theme-pref="${b.dataset.themePref}"]`).focus(); };
  });
  $('setReset').onclick = () => showPopup({
    title: S.reset,
    html: `<p>${esc(S.resetAsk)}</p>`,
    buttons: [{ label: S.resetNo, cls: 'ghost', cb: () => $('setReset').focus() }, { label: S.resetYes, cls: 'danger', cb: onReset }], esc: 0,
  });
}

export function initSettings(opts) {
  onReset = opts.onReset;
  $('settingsTitle').textContent = STRINGS.ui.settings.title;
}

export function openSettings() {
  render();
  openApp('settings');
}
