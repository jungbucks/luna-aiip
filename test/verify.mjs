/* verify.mjs — SPEC §13-1 검산 4경로. `node test/verify.mjs` (루트에서 실행).
   기대값이 하나라도 어긋나면 exit 1 — 배포 금지. */
import * as E from '../js/engine.js';
import { EPISODES } from '../data/episodes.js';
import { STRINGS } from '../data/strings.js';
import { T, idolSVG, setIdol } from '../js/ui/character.js';
import { QUIZ } from '../data/quiz.js';
import * as Q from '../js/quiz.js';
import * as R from '../js/resume.js';

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
  t('v0.4 스토리 씬 2~5장 + emoji/text', EPISODES.every(e =>
    Array.isArray(e.scenes) && e.scenes.length >= 2 && e.scenes.length <= 5 &&
    e.scenes.every(s => s.emoji && s.text)));
  t('마지막 씬은 폰 등장 예고(📱)', EPISODES.every(e => e.scenes[e.scenes.length - 1].emoji === '📱'));
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

console.log('[토큰 치환] 캐릭터 이름·조사 (character.js T)');
{
  const raw = JSON.stringify(EPISODES) + JSON.stringify(STRINGS) + STRINGS.bridgeNext(EPISODES[2]);
  t('데이터에 하드코딩 루나/LUNA 없음', !raw.includes('루나') && !raw.includes('LUNA'));
  setIdol('sol');
  t('솔 조사(이/은/을/이랑)', T('{n가} {n는} {n를} {n랑} {N}') === '솔이 솔은 솔을 솔이랑 SOL');
  t('솔 적용 후 토큰 잔여 없음', !/\{[nN][가는를랑와]?\}/.test(T(raw)));
  setIdol('luna');
  t('루나 조사(가/는/를/랑)', T('{n가} {n는} {n를} {n랑} {N}') === '루나가 루나는 루나를 루나랑 LUNA');
  t('루나 적용 후 토큰 잔여 없음', !/\{[nN][가는를랑와]?\}/.test(T(raw)));
}

console.log('[캐릭터 에셋] PNG 표정 렌더링');
{
  const sol = idolSVG('sol');
  const luna = idolSVG('luna');
  t('솔 neutral PNG를 img로 렌더링', /<img[^>]+src="assets\/characters\/sol-neutral\.png"/.test(sol));
  t('루나 neutral PNG를 img로 렌더링', /<img[^>]+src="assets\/characters\/luna-neutral\.png"/.test(luna));
  t('기존 DOM 계약 유지', sol.includes('class="idol-svg"') && sol.includes('data-idol="sol"') && sol.includes('data-expr="neutral"'));
}

console.log('[O/X 퀴즈] 문항·판정·기록 (2026-11-14, 스탯 무관)');
{
  const eps = [1, 2, 3, 4, 5, 6];
  const ok = (it) => it && typeof it.q === 'string' && it.q.trim() && typeof it.exp === 'string' && it.exp.trim() && typeof it.a === 'boolean';
  t('quiz-shape: EP1~6 본 문제·하나 더 = 12문항', Object.keys(QUIZ).length === 6 && eps.every(e => QUIZ[e] && ok(QUIZ[e].main) && ok(QUIZ[e].more)));
  t('quiz-answers: 설계 표 그대로', JSON.stringify(eps.map(e => QUIZ[e].main.a)) === JSON.stringify([false, false, false, true, true, false]) && JSON.stringify(eps.map(e => QUIZ[e].more.a)) === JSON.stringify([false, true, true, false, true, true]));
  const texts = eps.flatMap(e => [QUIZ[e].main.q, QUIZ[e].main.exp, QUIZ[e].more.q, QUIZ[e].more.exp]);
  t('quiz-no-names: 이름 토큰·캐릭터 이름 없음', texts.every(x => !/{[nN]|솔|루나|SOL|LUNA/.test(x)));
  t('quiz-guardrail: 단정 금칙어 없음', texts.every(x => !/무조건 불법|반드시|절대로/.test(x)));
  t('resultOf: 맞음 ok / 둘째에서 맞음 more-ok / 둘 다 틀림 missed', Q.resultOf(true) === 'ok' && Q.resultOf(false, true) === 'more-ok' && Q.resultOf(false, false) === 'missed');
  const s1 = {}; Q.record(s1, 2, 'missed'); Q.record(s1, 2, 'ok');
  t('record-overwrite: 같은 EP는 덮어씀', s1.quiz && s1.quiz[2] === 'ok');
  t('missed-excludes-unplayed: 둘 다 틀린 EP만, 오름차순', JSON.stringify(Q.missedEps({ quiz: { 5: 'missed', 1: 'missed', 3: 'ok' } })) === '[1,5]');
  const old = {};
  t('missed-old-save: quiz 없는 옛 저장 → [] (상태를 바꾸지 않음)', JSON.stringify(Q.missedEps(old)) === '[]' && !('quiz' in old));
}

console.log('[이어 하기] 에피소드 시작 상태에서 다시 (2026-11-14 — 퀴즈·정산 중 새로 고침 시 점수 두 번 방지)');
{
  const st = E.newGame(); st.idol = 'sol';
  R.markEpStart(st);
  const startStats = JSON.stringify(st.stats);
  E.chooseRight(st, st.ep, ep(1).choices.right.delta); Q.record(st, 1, 'ok');      // 정답 + 퀴즈까지 한 뒤 저장된 상태
  const saved = JSON.parse(JSON.stringify(st));                                      // localStorage 왕복
  const back = R.resumeState(saved);
  t('resume: 에피소드 시작 수치로', JSON.stringify(back.stats) === startStats && back.ep === 1 && back.badges[0] === null, fmt(back));
  t('resume: 그 EP의 퀴즈 기록도 시작 상태로(다시 풀면 덮어씀)', !back.quiz || back.quiz[1] === undefined);
  t('resume: 캐릭터 그대로', back.idol === 'sol');
  t('resume: 다시 시작해도 사본이 이어짐(겹치지 않음)', back.epStart && !back.epStart.epStart && JSON.stringify(back.epStart.stats) === startStats);
  E.chooseRight(back, back.ep, ep(1).choices.right.delta); E.settle(back); E.nextEp(back); R.markEpStart(back);
  t('resume: 다음 EP 시작 때 사본 갱신', back.epStart.ep === 2 && back.epStart.badges[0] === 'full');
  const old = { ...E.newGame(), ep: 3 };
  t('resume: 사본 없는 옛 저장은 그대로(지금 동작)', R.resumeState(old) === old);
}

console.log('[모드] 다크/라이트 결정 (theme.js)');
{
  const Th = await import('../js/ui/theme.js');
  t('theme-system-dark', Th.resolveTheme('system', true) === 'dark');
  t('theme-system-light', Th.resolveTheme('system', false) === 'light');
  t('theme-explicit', Th.resolveTheme('light', true) === 'light' && Th.resolveTheme('dark', false) === 'dark');
  t('theme-garbage→system', Th.resolveTheme('purple', true) === 'dark' && Th.resolveTheme(undefined, false) === 'light');
  t('ui 문구 블록', STRINGS.ui && STRINGS.ui.composer.playing === '탭하면 빨리 감기' && STRINGS.ui.apps.notes === '권리 수첩');
  t('ui 문구에 이름 하드코딩 없음', !/루나|LUNA/.test(JSON.stringify(STRINGS.ui, (k, v) => typeof v === 'function' ? v(1) : v)));
}

console.log('─'.repeat(40));
if (fail) { console.log(`❌ ${fail}건 실패 / ${pass}건 통과 — 배포 금지`); process.exit(1); }
console.log(`✅ ${pass}건 전부 통과 — 엔진 검산 완료`);
