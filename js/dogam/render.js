/* render.js — 쟁점 카드 렌더 (콘텐츠 수정은 data/issues.js만) */
import { STATUS_META, GLOSSARY } from '../../data/issues.js';

const RIGHTS = ['저작권', '특허권', '상표권', '영업비밀'];

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function filterHtml(issues) {
  const counts = RIGHTS.map(r => issues.filter(i => i.right === r).length);
  const chips = [`<button class="fchip on" data-right="all" aria-pressed="true">전체 <i>${issues.length}</i></button>`]
    .concat(RIGHTS.map((r, k) => `<button class="fchip" data-right="${r}" aria-pressed="false">${r} <i>${counts[k]}</i></button>`));
  return chips.join('');
}

/* 배지 줄 — 실제로 쓰이는 배지만(첫 화면용, 한 줄) */
const usedStatuses = issues => Object.keys(STATUS_META).filter(k => issues.some(i => i.status === k));
const badge = k => `<span class="status s-${k}"><span aria-hidden="true">${STATUS_META[k].emoji}</span> ${STATUS_META[k].label}</span>`;
export function legendHtml(issues) {
  return usedStatuses(issues).map(k => `<li>${badge(k)}</li>`).join('');
}
/* 배지 뜻 — STATUS_META.desc 그대로(접이식 안) */
export function legendFullHtml(issues) {
  return usedStatuses(issues).map(k => `<div><dt>${badge(k)}</dt><dd>${esc(STATUS_META[k].desc)}</dd></div>`).join('');
}

/* 카드 글에 나오는 낱말만, 화면에 보이는 순서(훅→양측→질문→사례)대로 */
export function termsFor(issue) {
  const text = [issue.hook, ...issue.sides.flatMap(s => [s.label, s.stance, ...s.points]), issue.think, issue.realCase.gist].join(' ');
  return GLOSSARY.filter(g => text.includes(g.term)).sort((a, b) => text.indexOf(a.term) - text.indexOf(b.term));
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
  const where = issue.realCase.where ? `<span class="issue-where">${esc(issue.realCase.where)}</span>` : '';
  const terms = termsFor(issue);
  const termsHtml = terms.length ? `<div class="terms"><p class="terms-title">낱말 풀이</p><dl>${
    terms.map(g => `<div><dt>${esc(g.term)}</dt><dd>${esc(g.def)}</dd></div>`).join('')}</dl></div>` : '';
  const sources = issue.sources.map(s =>
    `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)} ↗</a>`).join('');
  return `<article class="issue" data-right="${issue.right}" id="issue-${issue.id}">
    <h2 class="issue-h"><button class="issue-q" aria-expanded="false" aria-controls="body-${issue.id}">
      <span class="issue-right"><span aria-hidden="true">${issue.rightEmoji}</span> ${esc(issue.right)}</span>
      <span class="issue-title">${esc(issue.title)}${where}</span>
      <span class="status s-${issue.status}"><span aria-hidden="true">${st.emoji}</span> ${st.label}</span>
      <span class="chev" aria-hidden="true">▾</span>
    </button></h2>
    <div class="issue-body" id="body-${issue.id}" hidden>
      <p class="issue-hook">${esc(issue.hook)}</p>
      <div class="sides${three}">${issue.sides.map(sideHtml).join('<span class="vs" aria-hidden="true">VS</span>')}</div>
      <p class="think"><span aria-hidden="true">💭</span> ${esc(issue.think)}</p>
      ${termsHtml}
      <button class="more-btn" aria-expanded="false" aria-controls="more-${issue.id}"><span aria-hidden="true">📂</span> <span class="more-label">실제 사례 · 출처 보기</span></button>
      <div class="more" id="more-${issue.id}" hidden>
        <p class="case-name">${esc(issue.realCase.name)} <span class="case-date">${esc(issue.realCase.date)}</span></p>
        <p class="case-gist">${esc(issue.realCase.gist)}</p>
        <p class="sources">${sources}</p>
      </div>
      <a class="card-link" href="#issue-${issue.id}"><span aria-hidden="true">🔗</span> 이 카드 링크</a>
    </div>
  </article>`;
}

export function renderIssues(issues) {
  return issues.map(cardHtml).join('');
}
