/* verify.mjs — SPEC §13-1 검산 4경로. `node test/verify.mjs` (루트에서 실행).
   기대값이 하나라도 어긋나면 exit 1 — 배포 금지. */
import * as E from '../js/engine.js';
import { EPISODES } from '../data/episodes.js';

let pass = 0, fail = 0;
const t = (name, cond, extra = '') => {
  if (cond) { pass++; console.log('  ✓ ' + name); }
  else { fail++; console.log('  ✗ FAIL ' + name + (extra ? ' — ' + extra : '')); };
};
const fmt = s => `💰${s.stats.money} 📈${s.stats.fame} 🛡${s.stats.safety}`;
const ep = n => EPISODES[n - 1];

function playRight(st) { E.chooseRight(st, st.ep, ep(st.ep).choices.right.delta); E.settle(st); E.nextEp(st); }
function playWrongAccept(st) {
  const ev = E.chooseWrongAccept(st, st.ep, ep(st.ep).choices.wrong.delta);
  if (ev === 'court') return 'court';
  E.settle(st); E.nextEp(st);
  return ev;
}

console.log('[경로 A] 전부 정답 → 유니콘');
{
  const st = E.newGame();
  for (let i = 1; i <= 6; i++) playRight(st);
  const end = E.judgeEnding(st);
  t('최종 스탯 45/95/100', st.stats.money === 45 && st.stats.fame === 95 && st.stats.safety === 100, fmt(st));
  t('완전 배지 6', st.badges.every(b => b === 'full'));
  t('엔딩 = unicorn', end === 'unicorn', end);
}

console.log('[경로 B] 전부 오답(대가 진행) → EP3 집행유예 → EP4 법정');
{
  const st = E.newGame();
  let probationAt = 0, courtAt = 0;
  for (let i = 1; i <= 6 && !courtAt; i++) {
    const before = st.ep;
    const ev = playWrongAccept(st);
    if (ev === 'probation') probationAt = before;
    if (ev === 'court') courtAt = before;
  }
  t('집행유예 = EP3', probationAt === 3, 'at EP' + probationAt);
  t('법정 확정 = EP4', courtAt === 4, 'at EP' + courtAt);
  t('엔딩 = court', E.judgeEnding(st) === 'court');
}

console.log('[경로 C] 오답 EP1·EP4(대가 진행) + 나머지 정답 → 생존');
{
  const st = E.newGame();
  for (let i = 1; i <= 6; i++) (i === 1 || i === 4) ? playWrongAccept(st) : playRight(st);
  const end = E.judgeEnding(st);
  t('최종 스탯 10/75/65', st.stats.money === 10 && st.stats.fame === 75 && st.stats.safety === 65, fmt(st));
  t('완전 배지 4 + none 2', st.badges.filter(b => b === 'full').length === 4 && st.badges.filter(b => b === 'none').length === 2);
  t('법정 씬 0회', st.courtCount === 0);
  t('엔딩 = survive', end === 'survive', end);
}

console.log('[경로 D] EP1 오답→[다시 선택]→정답 + 나머지 정답 → 반쪽 배지 → 생존');
{
  const st = E.newGame();
  E.chooseWrongRetry(st, 1, ep(1).choices.wrong.delta);   // 50% trunc: 💰-15 🛡-12 📈+2
  E.chooseRight(st, 1, ep(1).choices.right.delta);
  E.settle(st); E.nextEp(st);
  t('EP1 종료 30/42/73 (trunc 검증)', st.stats.money === 30 && st.stats.fame === 42 && st.stats.safety === 73, fmt(st));
  t('EP1 배지 = half', st.badges[0] === 'half');
  for (let i = 2; i <= 6; i++) playRight(st);
  const end = E.judgeEnding(st);
  t('최종 스탯 30/97/100', st.stats.money === 30 && st.stats.fame === 97 && st.stats.safety === 100, fmt(st));
  t('반쪽 1 + 완전 5', st.badges.filter(b => b === 'half').length === 1 && st.badges.filter(b => b === 'full').length === 5);
  t('반쪽이 유니콘 차단 → survive', end === 'survive', end);
}

console.log('[데이터 정합] episodes.js');
{
  t('EP 6개', EPISODES.length === 6);
  t('스키마 필수 필드', EPISODES.every(e =>
    e.id && e.title && e.right && e.roomName && e.intro && Array.isArray(e.messages) && e.messages.length > 0 &&
    e.hint && e.choices?.wrong?.label && e.choices?.wrong?.delta && e.choices?.wrong?.popup?.title &&
    e.choices?.right?.label && e.choices?.right?.delta && e.choices?.right?.popup?.title && e.choices?.info?.label));
  t('SPEC §6.2 델타 일치', JSON.stringify(EPISODES.map(e => [e.choices.wrong.delta, e.choices.right.delta])) ===
    JSON.stringify([
      [{ money: -30, safety: -25, fame: 5 }, { money: -15, safety: 15, fame: 20 }],
      [{ money: -20, safety: -20, fame: 10 }, { money: -10, safety: 15, fame: 10 }],
      [{ money: -25, safety: -25, fame: 0 }, { money: -10, safety: 10, fame: 15 }],
      [{ money: -30, safety: -30, fame: 0 }, { money: -10, safety: 15, fame: 5 }],
      [{ money: -20, safety: -25, fame: 10 }, { money: -5, safety: 10, fame: 10 }],
      [{ money: -25, safety: -25, fame: 15 }, { money: -15, safety: 15, fame: 15 }],
    ]));
}

console.log('─'.repeat(40));
if (fail) { console.log(`❌ ${fail}건 실패 / ${pass}건 통과 — 배포 금지`); process.exit(1); }
console.log(`✅ ${pass}건 전부 통과 — 엔진 검산 완료`);
