/* main.js — 도감 오케스트레이터: 렌더·필터·펼침·더보기·모두 펼치기·주소로 카드 열기 */
import { ISSUES } from '../../data/issues.js';
import { renderIssues, filterHtml, legendHtml, legendFullHtml } from './render.js';

const MORE_LABEL = { closed: '실제 사례 · 출처 보기', open: '실제 사례 · 출처 접기' };

function setOpen(btn, open) {
  btn.setAttribute('aria-expanded', String(open));
  document.getElementById(btn.getAttribute('aria-controls')).hidden = !open;
  const label = btn.querySelector('.more-label');
  if (label) label.textContent = open ? MORE_LABEL.open : MORE_LABEL.closed;
}
const toggle = btn => setOpen(btn, btn.getAttribute('aria-expanded') !== 'true');

const visibleCards = () => [...document.querySelectorAll('.issue')].filter(c => !c.hidden);

function syncToggleAll() {
  const btn = document.getElementById('toggle-all');
  const allOpen = visibleCards().every(c => c.querySelector('.issue-q').getAttribute('aria-expanded') === 'true');
  // 이름만 바꾼다(aria-pressed와 함께 쓰면 화면 읽기에서 겹침 — 평가 v2 r3)
  btn.textContent = allOpen ? '모두 접기' : '모두 펼치기';
  btn.dataset.open = String(allOpen);
}

function setFilter(right, chip) {
  document.querySelectorAll('#filters .fchip').forEach(c => {
    c.classList.toggle('on', c === chip);
    c.setAttribute('aria-pressed', String(c === chip));
  });
  document.querySelectorAll('.issue').forEach(card => {
    card.hidden = right !== 'all' && card.dataset.right !== right;
  });
  const n = visibleCards().length;
  document.getElementById('count').textContent = right === 'all' ? `카드 ${n}장 모두 보기` : `${right} 카드 ${n}장`;
  syncToggleAll();
}

/* 주소 끝 #issue-<id> 로 들어오면 그 카드를 펼쳐 보여 준다(교사가 링크로 나눠 줄 때) */
function openFromHash() {
  const m = location.hash.match(/^#issue-([\w-]+)$/);
  const card = m && document.getElementById('issue-' + m[1]);
  if (!card) return;
  if (card.hidden) setFilter('all', document.querySelector('#filters .fchip[data-right="all"]'));
  setOpen(card.querySelector('.issue-q'), true);
  card.scrollIntoView({ block: 'start' });
  syncToggleAll();
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('filters').innerHTML = filterHtml(ISSUES);
  document.getElementById('legend').innerHTML = legendHtml(ISSUES);
  document.getElementById('legend-full').innerHTML = legendFullHtml(ISSUES);
  document.getElementById('issues').innerHTML = renderIssues(ISSUES);

  document.getElementById('filters').addEventListener('click', e => {
    const chip = e.target.closest('.fchip');
    if (chip) setFilter(chip.dataset.right, chip);
  });
  document.getElementById('toggle-all').addEventListener('click', () => {
    const open = document.getElementById('toggle-all').dataset.open !== 'true';
    visibleCards().forEach(c => setOpen(c.querySelector('.issue-q'), open));
    syncToggleAll();
  });
  document.getElementById('issues').addEventListener('click', e => {
    const q = e.target.closest('.issue-q');
    if (q) { toggle(q); syncToggleAll(); return; }
    const more = e.target.closest('.more-btn');
    if (more) toggle(more);
  });
  window.addEventListener('hashchange', openFromHash);
  openFromHash();
});
