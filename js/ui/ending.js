/* ending.js — 법정 씬·엔딩·최종 리포트 (SPEC §6.6~6.7). */
import { STRINGS } from '../../data/strings.js';
import { EPISODES } from '../../data/episodes.js';
import { esc } from './chat.js';

/* 법정 복습 목록 — 오답 EP들의 권리·교훈 */
function reviewList(state) {
  const eps = EPISODES.filter(e => state.wrongs.includes(e.id));
  if (!eps.length) return `<p class="rv-clean">${esc(STRINGS.report.cleanReview)}</p>`;
  return eps.map(e =>
    `<div class="rv-item"><b>${e.rightEmoji} ${esc(e.right)}</b> — ${esc(e.choices.wrong.popup.lesson)}</div>`).join('');
}

export function renderCourt(state, isFinal, contBtnCb) {
  const c = STRINGS.court;
  const el = document.getElementById('scr-court');
  el.innerHTML = `
    <div class="court-card">
      <div class="court-gavel">⚖️</div>
      <h2>${esc(isFinal ? c.finalTitle : c.probationTitle)}</h2>
      <p class="judge">🧑‍⚖️ "${esc(isFinal ? c.finalJudge : c.probationJudge)}"</p>
      <h3>${esc(c.reviewHead)}</h3>
      <div class="rv-list">${reviewList(state)}</div>
      <button class="choice-btn primary" id="courtBtn">${esc(isFinal ? c.retryBtn : c.probationBtn)}</button>
    </div>`;
  document.getElementById('courtBtn').onclick = contBtnCb;
}

export function renderEnding(state, endingKey, restartCb) {
  const e = STRINGS.endings[endingKey];
  const r = STRINGS.report;
  const badges = EPISODES.map((ep, i) => {
    const b = state.badges[i];
    const cls = b === 'full' ? 'b-full' : b === 'half' ? 'b-half' : 'b-none';
    return `<div class="rp-badge ${cls}"><span>${ep.rightEmoji}</span><b>${esc(ep.right)}</b><i>${esc(r.badgeLabel[b] || r.badgeLabel.none)}</i></div>`;
  }).join('');
  const el = document.getElementById('scr-end');
  el.innerHTML = `
    <div class="end-card">
      <div class="end-emoji">${e.emoji}</div>
      <h2>${esc(e.name)}</h2>
      <p class="end-body">${esc(e.body).replace(/\n/g, '<br>')}</p>
      <h3>${esc(r.head)}</h3>
      <div class="rp-stats">💰 ${state.stats.money} · 📈 ${state.stats.fame} · 🛡️ ${state.stats.safety}</div>
      <div class="rp-badges">${badges}</div>
      <h3>${esc(r.reviewHead)}</h3>
      <div class="rv-list">${reviewList(state)}</div>
      <p class="disclaimer">${esc(r.disclaimer)}</p>
      <a class="dogam-teaser" href="dogam.html">🧭 법은 여기까지 배웠어요. 그런데 AI 시대엔? → 쟁점 도감 열기</a>
      <button class="choice-btn primary" id="endRestart">🔄 처음부터 다시</button>
    </div>`;
  document.getElementById('endRestart').onclick = restartCb;
}
