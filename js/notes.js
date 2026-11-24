/* notes.js — "알게 된 것 적기"의 저장·검사·산출물 글 (v0.6). DOM 없음.
   게임 저장(luna_save_v1)과 별개 키. 점수·배지·엔딩과 무관하다(O/X 퀴즈와 같은 원칙).
   저장소는 인자로 받는다(기본 localStorage) — verify.mjs가 가짜 저장소로 검산한다. */
import { removeAndCheck } from './state.js';

export const NOTES_KEY = 'luna_notes_v1';
export const MIN_LEN = 5;
export const MAX_LEN = 200;

let cache = {};   // 저장소를 못 쓰는 브라우저(시크릿 등)에서도 그 판에서는 글이 보이게 하는 메모리 사본
let pending = {}; // 저장에 실패한 글 — 읽기는 되고 쓰기만 안 되는 저장소(용량 초과)에서 다음 읽기가 옛 값으로 덮지 않게

const defaultStorage = () => { try { return globalThis.localStorage; } catch (e) { return null; } };

/* 앞뒤 공백 제거, 빈 줄 여러 개는 줄바꿈 하나로(산출물이 빈 줄로 길어지지 않게), MAX_LEN자로 자름(코드 포인트 기준) */
export function normalize(text) {
  const s = String(text == null ? '' : text).replace(/\r\n?/g, '\n').replace(/[ \t]*\n[\s]*/g, '\n').trim();
  return [...s].slice(0, MAX_LEN).join('');
}

/* 적은 글 검사(2026-11-24 플레이테스트 [6] — 'ㅋㅋㅋㅋㅋ'·같은 글자 반복이 통과하던 것).
   '' = 통과 / 'short' = 공백 뺀 글자가 MIN_LEN 미만 / 'letters' = 완성형 한글·영문이 MIN_LEN 미만(자음·모음·숫자·기호만) /
   'repeat' = 한글·영문 글자 종류가 MIN_KINDS 미만(같은 글자 반복). 화면 안내는 strings.js ui.notes.issue */
export const MIN_KINDS = 3;
export function noteIssue(text) {
  const chars = [...String(text == null ? '' : text).replace(/\s/g, '')];
  if (chars.length < MIN_LEN) return 'short';
  const letters = chars.filter(c => /[가-힣A-Za-z]/.test(c)).map(c => c.toLowerCase());
  if (letters.length < MIN_LEN) return 'letters';
  if (new Set(letters).size < MIN_KINDS) return 'repeat';
  return '';
}
export function isValid(text) {
  return noteIssue(text) === '';
}

/* 매번 저장소에서 읽어 사본을 갈아 끼운다. 저장소가 던질 때만 지금 사본을 돌려준다 */
export function loadNotes(storage = defaultStorage()) {
  try {
    const raw = storage.getItem(NOTES_KEY);
    let data = {};
    if (raw) { try { const p = JSON.parse(raw); if (p && typeof p === 'object' && !Array.isArray(p)) data = p; } catch (e) { data = {}; } }
    cache = {};
    Object.keys(data).forEach(k => { if (typeof data[k] === 'string') cache[k] = data[k]; });
    Object.assign(cache, pending);
  } catch (e) { /* 저장소 접근 불가 — 메모리 사본 유지 */ }
  return cache;
}

export function getNote(epId, storage = defaultStorage()) {
  return loadNotes(storage)[epId] || '';
}

/* 저장 성공 여부를 돌려준다. 실패해도 메모리 사본에는 남는다 */
export function saveNote(epId, text, storage = defaultStorage()) {
  loadNotes(storage);
  cache[epId] = normalize(text);
  try { storage.setItem(NOTES_KEY, JSON.stringify(cache)); pending = {}; return true; }
  catch (e) { pending[epId] = cache[epId]; return false; }
}

/* 지웠으면 true(state.js clear와 같은 판단 — 보안 검토 2026-11-18 B). 실패하면 남은 글은 다음 읽기에서 그대로 보인다 */
export function clearNotes(storage = defaultStorage()) {
  cache = {}; pending = {};
  return removeAndCheck(storage, NOTES_KEY);
}

/* 산출물 "나의 권리 수첩"을 붙여 넣기용 글로. items = [{ emoji, right, badge(처음 판단), learn(새 사례 적용), prompt(편별 질문), hint(개념), note }].
   교사가 '판단 기준 설명'과 '적절한 행동 제안'을 확인하도록 질문과 확인란을 함께 싣는다(자동 채점 없음) */
export function buildProductText({ title, name, date, idol, result, stats, items }) {
  const head = [
    title,
    '학번·이름: ' + (name || ''),
    '날짜: ' + date,
    '함께한 아이돌: ' + idol,
    `결과: ${result}  (💰 ${stats.money} · 📈 ${stats.fame} · 🛡️ ${stats.safety})`,
  ];
  const body = items.map(it => [
    `${it.emoji} ${it.right} (처음 판단: ${it.badge} · 새 사례 적용: ${it.learn || '—'})`,
    '- 개념: ' + it.hint,
    '- 질문: ' + (it.prompt || ''),
    '- 내 답: ' + (it.note || '(아직 적지 않음)'),
    '- 교사 확인: [ ] 판단 기준을 설명함  [ ] 적절한 행동을 제안함',
  ].join('\n'));
  return head.join('\n') + '\n\n' + body.join('\n\n') + '\n';
}
