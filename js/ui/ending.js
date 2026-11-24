/* ending.js — 회사 위기 점검 회의·엔딩·최종 리포트 (SPEC §6.6~6.8, 2026-11-20 개편).
   위기 점검 회의는 법원 판결이 아니다: 놓친 결정을 '우리 권리의 확보·관리 문제'(kind 'own')와 '타인 권리 침해 위험'(kind 'others')으로 나눠 본다.
   엔딩은 회사 운영 결과(엔딩 이름·점수·위기 횟수)와 학습 결과(처음 판단 / 새 사례 적용)를 따로 보여 준다. */
import { STRINGS } from '../../data/strings.js';
import { EPISODES } from '../../data/episodes.js';
import { esc, statsLine, num } from './chat.js';
import { learnAt, reviewEps } from '../quiz.js';

/* 놓친 결정 목록(kind별). 비어 있으면 '이번에는 없어요' */
function missedList(state, kind) {
  const eps = EPISODES.filter(e => e.kind === kind && state.wrongs.includes(e.id));
  if (!eps.length) return `<p class="rv-clean">${esc(STRINGS.crisis.none)}</p>`;
  return eps.map(e =>
    `<div class="rv-item"><b>${e.rightEmoji} ${esc(e.right)}</b> — ${esc(e.choices.wrong.popup.lesson)}</div>`).join('');
}

/* 신뢰 0 → 회사 위기 점검 회의. 게임은 계속된다(신뢰 30으로 회복) */
export function renderCrisis(state, contBtnCb) {
  const c = STRINGS.crisis;
  const el = document.getElementById('scr-court');   // 화면 id는 그대로(옛 법정 화면 자리)
  el.innerHTML = `
    <div class="court-card">
      <div class="court-gavel">🗂️</div>
      <h2>${esc(c.title)}</h2>
      <p class="judge">${esc(c.lead)}</p>
      <h3>${esc(c.ownHead)}</h3>
      <div class="rv-list" data-kind="own">${missedList(state, 'own')}</div>
      <h3>${esc(c.othersHead)}</h3>
      <div class="rv-list" data-kind="others">${missedList(state, 'others')}</div>
      <p class="crisis-note">${esc(c.note)}</p>
      <button class="choice-btn primary" id="courtBtn">${esc(c.btn)}</button>
    </div>`;
  document.getElementById('courtBtn').onclick = contBtnCb;
}

/* 학습 결과 카드: 처음 판단(배지 기록) + 새 사례 적용(적용 문제) */
function learnCards(state) {
  const r = STRINGS.report;
  return EPISODES.map((e, i) => {
    const first = state.badges[i], learn = learnAt(state, e.id);
    const firstTxt = r.firstLabel[first] || r.firstLabel.none0;
    const learnTxt = r.learnLabel[learn] || r.learnLabel.none0;
    const cls = learn === 'confirmed' ? 'l-ok' : learn === 'partial' ? 'l-part' : learn === 'review' ? 'l-review' : 'l-none';
    return `<div class="rp-badge ${cls}" data-ep="${e.id}"><span>${e.rightEmoji}</span><b>${esc(e.right)}</b>
      <i>${esc(r.firstHead)}: ${esc(firstTxt)}</i><i class="rp-learn">${esc(r.learnHead)}: ${esc(learnTxt)}</i></div>`;
  }).join('');
}

/* 다시 볼 개념: 새 사례 적용을 다 확인하지 못한 편의 개념 요약. 처음에 놓쳤어도 적용을 확인했으면 '이해 확인'으로 따로 알린다 */
function learnReview(state) {
  const r = STRINGS.report, rev = reviewEps(state);
  const recovered = EPISODES.filter(e => state.wrongs.includes(e.id) && learnAt(state, e.id) === 'confirmed');
  const parts = [];
  if (rev.length) parts.push(EPISODES.filter(e => rev.includes(e.id))
    .map(e => `<div class="rv-item"><b>${e.rightEmoji} ${esc(e.right)}</b> — ${esc(e.concept)}</div>`).join(''));
  else if (EPISODES.every(e => learnAt(state, e.id) === 'confirmed')) parts.push(`<p class="rv-clean">${esc(r.cleanReview)}</p>`);   // 여섯 편 모두 확인했을 때만(기록 없는 편이 있으면 말하지 않음)
  if (recovered.length) parts.push(`<p class="rv-sub">${esc(r.recoveredHead)}</p>` + recovered
    .map(e => `<div class="rv-item rv-ok"><b>${e.rightEmoji} ${esc(e.right)}</b> — ${esc(r.recoveredLine)}</div>`).join(''));
  return parts.join('');
}

export function renderEnding(state, endingKey, restartCb, productCb) {
  const e = STRINGS.endings[endingKey] || STRINGS.endings.survive;
  const r = STRINGS.report;
  const crisis = Number.isInteger(state.crisisCount) ? state.crisisCount : 0;
  // 생존 엔딩: 위기 회의가 없었으면 그 말을 하지 않고, 통장이 바닥났던 판이면 한 줄 더
  const body = endingKey === 'survive'
    ? (crisis ? e.body : e.bodyNoCrisis) + (state.brokeEver ? '\n' + e.debtLine : '')
    : e.body;
  const el = document.getElementById('scr-end');
  el.innerHTML = `
    <div class="end-card">
      <div class="end-emoji">${e.emoji}</div>
      <h2 tabindex="-1">${esc(e.name)}</h2>
      <p class="end-body">${esc(body).replace(/\n/g, '<br>')}</p>
      <h3>${esc(r.opsHead)}</h3>
      <div class="rp-stats">${statsLine(state.stats)}</div>
      <p class="rp-fame">${esc(STRINGS.fameLine(state.stats.fame, state.badges.filter(b => b === 'none').length))}</p>
      <p class="rp-fame rp-crisis">${esc(r.crisisLine(num(crisis)))}</p>
      <p class="rp-note">${esc(r.opsNote)}</p>
      <h3>${esc(r.learnTitle)}</h3>
      <div class="rp-badges">${learnCards(state)}</div>
      <h3>${esc(r.reviewHead)}</h3>
      <div class="rv-list">${learnReview(state)}</div>
      <p class="disclaimer">${esc(r.disclaimer)}</p>
      <a class="dogam-teaser" href="dogam.html">🧭 법은 여기까지 배웠어요. 그런데 AI 시대엔? → 쟁점 도감 열기</a>
      <button class="choice-btn" id="endProduct">${esc(STRINGS.ui.notes.product)}</button>
      <button class="choice-btn primary" id="endRestart">🔄 처음부터 다시</button>
    </div>`;
  document.getElementById('endRestart').onclick = restartCb;
  document.getElementById('endProduct').onclick = productCb;
}
