/* main.js — 도감 오케스트레이터: 렌더·필터·펼침·더보기 */
import { ISSUES } from '../../data/issues.js';
import { renderIssues, filterHtml } from './render.js';

function toggle(btn) {
  const body = document.getElementById(btn.getAttribute('aria-controls'));
  const open = btn.getAttribute('aria-expanded') === 'true';
  btn.setAttribute('aria-expanded', String(!open));
  body.hidden = open;
}

function setFilter(right, chip) {
  document.querySelectorAll('.fchip').forEach(c => c.classList.toggle('on', c === chip));
  document.querySelectorAll('.issue').forEach(card => {
    card.hidden = right !== 'all' && card.dataset.right !== right;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('filters').innerHTML = filterHtml(ISSUES);
  document.getElementById('issues').innerHTML = renderIssues(ISSUES);

  document.getElementById('filters').addEventListener('click', e => {
    const chip = e.target.closest('.fchip');
    if (chip) setFilter(chip.dataset.right, chip);
  });
  document.getElementById('issues').addEventListener('click', e => {
    const q = e.target.closest('.issue-q');
    if (q) { toggle(q); return; }
    const more = e.target.closest('.more-btn');
    if (more) toggle(more);
  });
});
