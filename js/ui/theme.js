/* theme.js — 다크/라이트 모드 (v0.6). 저장 키는 게임 기록(luna_save_v1)과 별개 — 기록 초기화가 지우지 않는다.
   최상위에서 document·localStorage를 만지지 않는다(verify.mjs가 Node에서 import). */
import { STRINGS } from '../../data/strings.js';

export const THEME_KEY = 'luna_theme';
const BAR = { dark: '#0b0e22', light: '#eef0fb' };   // 브라우저 주소창 색

/* 저장값(pref)과 기기 설정으로 실제 모드를 정한다 — 순수 함수 */
export function resolveTheme(pref, systemDark) {
  return pref === 'light' || pref === 'dark' ? pref : (systemDark ? 'dark' : 'light');
}

const media = () => matchMedia('(prefers-color-scheme: dark)');

export function getThemePref() {
  try {
    const p = localStorage.getItem(THEME_KEY);
    return p === 'light' || p === 'dark' ? p : 'system';
  } catch (e) { return 'system'; }
}

export function setThemePref(pref) {
  try {
    if (pref === 'light' || pref === 'dark') localStorage.setItem(THEME_KEY, pref);
    else localStorage.removeItem(THEME_KEY);
  } catch (e) { /* 저장 실패는 치명적이지 않음 */ }
  applyTheme(pref);
}

/* force: 저장소를 못 쓰는 브라우저에서도 방금 고른 모드가 보이게 */
export function applyTheme(force) {
  const pref = force === 'light' || force === 'dark' ? force : getThemePref();
  const theme = resolveTheme(pref, media().matches);
  document.documentElement.dataset.theme = theme;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = BAR[theme];
  const btn = document.getElementById('btnTheme');
  if (btn) {
    btn.setAttribute('aria-label', theme === 'dark' ? STRINGS.ui.themeToLight : STRINGS.ui.themeToDark);
    btn.textContent = theme === 'dark' ? STRINGS.ui.themeBtnLight : STRINGS.ui.themeBtnDark;   // 바꿀 모드를 글자로(2026-11-20 — 떠 있는 둥근 단추가 상태바에 겹쳤다)
  }
}

export function toggleTheme() {
  setThemePref(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
}

/* 기기 설정이 바뀌면(저장값이 '기기 따름'일 때만) 따라간다 — boot에서 한 번 호출 */
export function watchSystemTheme() {
  media().addEventListener('change', () => { if (getThemePref() === 'system') applyTheme(); });
}
