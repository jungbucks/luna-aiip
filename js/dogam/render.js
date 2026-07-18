/* render.js — 쟁점 카드 렌더 (콘텐츠 수정은 data/issues.js만) */
import { STATUS_META } from '../../data/issues.js';

const RIGHTS = ['저작권', '특허권', '상표권', '영업비밀'];

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function filterHtml(issues) {
  const counts = RIGHTS.map(r => issues.filter(i => i.right === r).length);
  const chips = [`<button class="fchip on" data-right="all">전체 <i>${issues.length}</i></button>`]
    .concat(RIGHTS.map((r, k) => `<button class="fchip" data-right="${r}">${r} <i>${counts[k]}</i></button>`));
  return chips.join('');
}

function sideHtml(side) {
  return `<div class="side">
    <p class="side-label">${esc(side.label)}</p>
    <p class="side-stance">${esc(side.stance)}</p>
    <ul>${side.points.map(p => `<li>${esc(p)}</li>`).join('')}</ul>
  </div>`;
}

export function cardHtml(issue) {
  const st = STATUS_META[issue.status];
  const three = issue.sides.length === 3 ? ' sides-3' : '';
  const sources = issue.sources.map(s =>
    `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)} ↗</a>`).join('');
  return `<article class="issue" data-right="${issue.right}" id="issue-${issue.id}">
    <button class="issue-q" aria-expanded="false" aria-controls="body-${issue.id}">
      <span class="issue-right">${issue.rightEmoji} ${esc(issue.right)}</span>
      <span class="issue-title">${esc(issue.title)}</span>
      <span class="status s-${issue.status}">${st.emoji} ${st.label}</span>
      <span class="chev" aria-hidden="true">▾</span>
    </button>
    <div class="issue-body" id="body-${issue.id}" hidden>
      <p class="issue-hook">${esc(issue.hook)}</p>
      <div class="sides${three}">${issue.sides.map(sideHtml).join('<span class="vs" aria-hidden="true">VS</span>')}</div>
      <p class="think">💭 ${esc(issue.think)}</p>
      <button class="more-btn" aria-expanded="false" aria-controls="more-${issue.id}">📂 실제 사례 · 출처 보기</button>
      <div class="more" id="more-${issue.id}" hidden>
        <p class="case-name">${esc(issue.realCase.name)} <span class="case-date">${esc(issue.realCase.date)}</span></p>
        <p class="case-gist">${esc(issue.realCase.gist)}</p>
        <p class="sources">${sources}</p>
      </div>
    </div>
  </article>`;
}

export function renderIssues(issues) {
  return issues.map(cardHtml).join('');
}
