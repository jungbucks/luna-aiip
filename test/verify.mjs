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

console.log('[말투] 캐릭터 톡 — 사람이 하는 말 (2026-11-17, docs/superpowers/specs/2026-11-17-chat-dialogue-design.md)');
{
  const all = EPISODES.flatMap(e => e.messages.map(m => ({ ep: e.id, ...m })));
  const none = (name, list) => {   // 걸린 줄을 보여 주고 판정
    if (list.length) console.log('    ↳ ' + list.slice(0, 5).map(m => `EP${m.ep} ${m.who}: ${m.text}`).join(' / '));
    t(name, list.length === 0);
  };
  const len = s => [...s].length;
  const EMOJI = /\p{Extended_Pictographic}/u;
  const words = s => s.split(/\s+/).map(w => w.replace(/^["'(]+|(?:[.?!…~,"')ㅋㅎ]|\p{Extended_Pictographic}|️)+$/gu, '')).filter(Boolean);
  const SLANG = ['개이득', '승천', 'ㄱㄱ', 'ㅇㅇ', 'ㄷㄷ', '콜?'];
  const GAK_OK = new Set(['제각각']);                                   // '~각' 유행어(파산각·고소각) — 세 글자 이상만 본다(생각·착각은 두 글자)
  const isGak = w => { const m = w.match(/^(.+각)(?:인데|이지|이네|임|이야)?$/); return !!m && len(m[1]) >= 3 && !GAK_OK.has(m[1]); };
  const NOUN = new Set(['다음', '처음', '마음', '모임', '게임', '책임', '웃음', '믿음', '도움', '소음', '얼음', '걸음', '만남', '봄', '돌봄', '타임', '프레임']);
  const isEumseum = t0 => { const w = words(t0).pop() || ''; return /[임음함됨남봄]$/.test(w) && !NOUN.has(w); };   // "~임/~음/~함" 끝맺음
  const SEA = '마케터 세아', JUNHO = '개발자 준호';

  t('한 편 10~16줄', EPISODES.every(e => e.messages.length >= 10 && e.messages.length <= 16));
  none('말풍선 45자 이하 + 첫 줄(알림 미리보기) 30자 이하', all.filter(m => len(m.text) > 45).concat(EPISODES.map(e => ({ ep: e.id, ...e.messages[0] })).filter(m => len(m.text) > 30)));
  none('유행어 없음(개이득·~각·ㄱㄱ·ㅇㅇ·ㄷㄷ·콜?)', all.filter(m => SLANG.some(s => m.text.includes(s)) || words(m.text).some(isGak)));
  none('"~임/~음" 끝맺음 없음', all.filter(m => isEumseum(m.text)));
  none('느낌표·물음표 연달아 쓰지 않음', all.filter(m => /[!?]{2,}/.test(m.text)));
  t('ㅋㅋ는 한 편에 두 번까지, 이모지는 하나까지', EPISODES.every(e =>
    e.messages.filter(m => m.text.includes('ㅋㅋ')).length <= 2 && e.messages.filter(m => EMOJI.test(m.text)).length <= 1));
  none('세아는 온점(또는 물음표·말줄임표·ㅋㅋ·이모지)으로 끝맺고, 준호는 온점을 찍지 않음',
    all.filter(m => (m.who === SEA && !/(?:[.?…]|ㅋㅋ|\p{Extended_Pictographic}️?)$/u.test(m.text)) || (m.who === JUNHO && m.text.endsWith('.'))));
  t('마지막 줄(결정 넘기기)은 6편이 서로 다름', new Set(EPISODES.map(e => e.messages[e.messages.length - 1].text)).size === EPISODES.length);

  // 선택지 = 대표가 단톡에 보내는 답장. 말투·길이로 정답이 드러나지 않게(2026-11-17 교사: "너무 노골적이라 답이 정해져 있음")
  const labels = EPISODES.flatMap(e => ['wrong', 'right', 'info'].map(k => ({ ep: e.id, who: '선택지 ' + k, text: e.choices[k].label })));
  none('선택지: 45자 이하, 유행어·괄호·기호(+ / or) 없음, 온점으로 끝남',
    labels.filter(m => len(m.text) > 45 || SLANG.some(s => m.text.includes(s)) || words(m.text).some(isGak) || /[()+/]|\bor\b|뭐 어때|겠지$/.test(m.text) || !m.text.endsWith('.')));
  none('선택지: 오답과 정답의 길이 차 8자 이하(둘 다 결정 + 이유 두 문장)',
    EPISODES.filter(e => Math.abs(len(e.choices.wrong.label) - len(e.choices.right.label)) > 8 ||
      [e.choices.wrong.label, e.choices.right.label].some(s => s.split('. ').length !== 2))
      .map(e => ({ ep: e.id, who: '선택지', text: e.choices.wrong.label + ' ↔ ' + e.choices.right.label })));
  // 결과 알림·개념 카드: 훈계조("~한 셈입니다", "~는 필수!")와 경보 이모지 없이, 일어난 일 → 비유 → 배운 것
  const pops = EPISODES.flatMap(e => [
    ['오답 제목', e.choices.wrong.popup.title], ['비유', e.choices.wrong.popup.analogy], ['배운 것', e.choices.wrong.popup.lesson],
    ['정답 제목', e.choices.right.popup.title], ['정답 본문', e.choices.right.popup.body], ['개념 카드', e.hint],
  ].map(([who, text]) => ({ ep: e.id, who, text })));
  none('알림: 느낌표·경보 이모지(🚨✨)·"셈입니다/격입니다"·유행어 없음', pops.filter(m => /[!🚨✨]|셈입니다|격입니다/u.test(m.text) || SLANG.some(s => m.text.includes(s))));
  none('알림: 비유는 "~와 같아요."로, 배운 것·정답 본문은 "~다."로, 개념 카드는 "~요."로 끝남', pops.filter(m =>
    (m.who === '비유' && !m.text.endsWith('같아요.')) || (['배운 것', '정답 본문'].includes(m.who) && !m.text.endsWith('다.')) || (m.who === '개념 카드' && !m.text.endsWith('요.'))));
  t('알림: 정답 제목 = "(권리) 배지를 얻었다 (배지 그림)"', EPISODES.every(e => e.choices.right.popup.title === `${e.right === '퍼블리시티권' ? '퍼블리시티' : e.right} 배지를 얻었다 ${e.rightEmoji}`));
  // 스토리 장면·편 소개·인트로·엔딩: 명언풍·느낌표 없이 있었던 일을 담담하게. 장면은 세 줄까지
  const story = EPISODES.flatMap(e => [...e.scenes.map(s => ({ ep: e.id, who: '장면', text: s.text })), { ep: e.id, who: '편 소개', text: e.intro }])
    .concat(STRINGS.intro.map(c => ({ ep: 0, who: '인트로', text: c.text })), Object.values(STRINGS.endings).map(c => ({ ep: 0, who: '엔딩', text: c.body })));
  none('장면·소개·인트로·엔딩: 느낌표 없음, 장면·인트로는 세 줄까지, 한 줄 30자 이하',
    story.filter(m => m.text.includes('!') || (['장면', '인트로'].includes(m.who) && (m.text.split('\n').length > 3 || m.text.split('\n').some(l => len(l) > 30)))));
  const C = await import('../js/ui/chat.js');
  t('선택지 순서: 오답·정답 자리가 섞이고 확인은 늘 맨 끝', C.choiceOrder(0.1).join() === 'wrong,right,info' && C.choiceOrder(0.9).join() === 'right,wrong,info');
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

console.log('[이어 하기] 끝난 판은 엔딩 그대로 (2026-11-18 검토 P1 — 엔딩 저장에서 이어 하면 EP6 시작으로 되돌아가 배지가 6→5)');
{
  const finish = kind => {                     // main.js 순서: EP마다 시작 사본 → 선택 → 정산 → 다음 EP, 끝나면 판정 + 'end' 저장
    const st = E.newGame(); st.idol = 'luna';
    for (;;) {
      R.markEpStart(st);
      const right = kind === 'unicorn' || (kind === 'survive' && st.ep !== 1 && st.ep !== 4);
      if (right) E.chooseRight(st, st.ep, ep(st.ep).choices.right.delta);
      else if (E.chooseWrongAccept(st, st.ep, ep(st.ep).choices.wrong.delta) === 'court') break;
      E.settle(st);
      if (st.ep === 6) break;
      E.nextEp(st);
    }
    const end = E.judgeEnding(st);
    return { end, data: JSON.parse(JSON.stringify({ schemaVersion: 1, game: st, phase: 'end' })) };   // localStorage 왕복
  };
  for (const kind of ['unicorn', 'survive', 'court']) {
    const { end, data } = finish(kind);
    const p = R.resumePoint(JSON.parse(JSON.stringify(data)));
    t(`resume-end: ${kind} — 엔딩·점수·배지 그대로`, end === kind && p.ended === true && E.judgeEnding(p.state) === kind
      && JSON.stringify(p.state.stats) === JSON.stringify(data.game.stats) && JSON.stringify(p.state.badges) === JSON.stringify(data.game.badges), fmt(p.state));
  }
  { const st = E.newGame(); R.markEpStart(st); E.chooseRight(st, 1, ep(1).choices.right.delta);
    const p = R.resumePoint({ schemaVersion: 1, game: JSON.parse(JSON.stringify(st)), phase: 'ep' });
    t('resume-end: 진행 중 저장은 지금처럼 EP 시작 사본에서', p.ended === false && p.state.ep === 1 && p.state.badges[0] === null); }
  { const st = E.newGame(); st.idol = 'sol';
    const p = R.resumePoint({ schemaVersion: 1, game: st, phase: 'intro' });
    t('resume-end: 인트로 저장(사본 없음)은 그대로 EP1로', p.ended === false && p.state === st); }
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

console.log('[메신저] 프로필 색 (chat.js avatarTone)');
{
  const C = await import('../js/ui/chat.js');
  const senders = [...new Set(EPISODES.flatMap(e => e.messages.map(m => m.who)))];
  t('avatar: 데이터의 보낸이는 서로 다른 색', new Set(senders.map(C.avatarTone)).size === senders.length);
  t('avatar: 색 번호는 0~' + (C.AVATAR_TONES - 1), [...senders, '처음 보는 사람', ''].every(w => Number.isInteger(C.avatarTone(w)) && C.avatarTone(w) >= 0 && C.avatarTone(w) < C.AVATAR_TONES));
  t('avatar: 같은 이름은 늘 같은 색, 처음 보는 이름은 고정 번호와 안 겹침', C.avatarTone('팬 하늘') === C.avatarTone('팬 하늘') && C.avatarTone('팬 하늘') >= 4);
}

console.log('[수첩] 알게 된 것 적기 (notes.js — 점수와 무관)');
{
  const N = await import('../js/notes.js');
  const mem = () => { const m = {}; return { getItem: k => (k in m ? m[k] : null), setItem: (k, v) => { m[k] = String(v); }, removeItem: k => { delete m[k]; } }; };
  const boom = { getItem() { throw new Error('x'); }, setItem() { throw new Error('x'); }, removeItem() { throw new Error('x'); } };
  t('notes-valid: 5자부터', !N.isValid('1234') && N.isValid('12345') && !N.isValid('   \n  ') && !N.isValid(' 1 2 3 4 ') && N.isValid('가 나 다 라 마'));
  t('notes-normalize: 200자로 자르고 앞뒤 공백 제거', N.normalize('  ' + '가'.repeat(250) + '  ').length === 200 && N.normalize('  abc  ') === 'abc');
  const s = mem();
  t('notes-save/load', N.saveNote(2, '  특허는 먼저 출원  ', s) === true && N.getNote(2, s) === '특허는 먼저 출원' && JSON.parse(s.getItem('luna_notes_v1'))[2] === '특허는 먼저 출원');
  t('notes-empty', N.getNote(5, s) === '' && Object.keys(N.loadNotes(mem())).length === 0);
  s.setItem('luna_notes_v1', '{깨짐');
  t('notes-broken→빈 수첩', Object.keys(N.loadNotes(s)).length === 0);
  N.clearNotes(s);
  t('notes-clear', s.getItem('luna_notes_v1') === null && N.getNote(2, s) === '');
  t('notes-storage-throws: 저장 실패해도 그 판에서는 보임', N.saveNote(1, '저작권은 표현을 보호', boom) === false && N.getNote(1, boom) === '저작권은 표현을 보호');
  N.clearNotes(mem());
  const txt = N.buildProductText({ title: '나의 권리 수첩', name: '10101 홍길동', date: '2026-11-17', idol: 'X', result: '유니콘', stats: { money: 1, fame: 2, safety: 3 },
    items: [{ emoji: '⚖️', right: '저작권', badge: '완전', hint: '힌트', note: '<b>내 글</b>' }, { emoji: '🛡️', right: '특허권', badge: '미획득', hint: '힌트2', note: '' }] });
  t('product-text: 권리·배지·내 글·빈칸 표시', txt.includes('나의 권리 수첩') && txt.includes('10101 홍길동') && txt.includes('⚖️ 저작권 (완전)') && txt.includes('<b>내 글</b>') && txt.includes('(아직 적지 않음)') && txt.includes('💰 1'));
  t('notes는 게임 저장 키를 쓰지 않음', N.NOTES_KEY !== 'luna_save_v1');
  // 검토 반영(2026-11-17): 읽기는 되는데 쓰기만 실패하는 저장소(용량 초과 등) — 적은 글이 다음 읽기에서 사라지면 안 된다
  const full = (() => { const m = { luna_notes_v1: JSON.stringify({ 1: '전에 적은 글' }) }; return { getItem: k => (k in m ? m[k] : null), setItem() { throw new Error('quota'); }, removeItem: k => { delete m[k]; } }; })();
  t('notes-write-fails: 쓰기만 실패해도 그 판에서는 새 글이 보임', N.saveNote(2, '방금 적은 글 다섯 자', full) === false && N.getNote(2, full) === '방금 적은 글 다섯 자' && N.getNote(1, full) === '전에 적은 글');
  t('notes-write-fails: 고친 글도 유지', N.saveNote(1, '고친 글 다섯 자 넘게', full) === false && N.getNote(1, full) === '고친 글 다섯 자 넘게');
  N.clearNotes(mem());
  t('notes-normalize: 빈 줄을 여러 번 넣어도 한 줄바꿈으로', N.normalize('가\n\n\n\n나') === '가\n나' && N.normalize('가 \n \n 나').split('\n').length === 2);
}

console.log('[기록 지우기] 진행·수첩 키마다 지워졌는지 확인 (보안 검토 2026-11-18 B — 예외를 삼키고 성공으로 처리했다)');
{
  const S = await import('../js/state.js');
  const N = await import('../js/notes.js');
  const store = blocked => {     // blocked 키는 removeItem이 던진다
    const m = { luna_save_v1: '{"schemaVersion":1}', luna_notes_v1: JSON.stringify({ 1: '저작권은 표현을 보호' }), luna_theme: 'dark' };
    return { getItem: k => (k in m ? m[k] : null), setItem: (k, v) => { m[k] = String(v); }, removeItem: k => { if (k === blocked) throw new Error('blocked'); delete m[k]; } };
  };
  const a = store('luna_notes_v1');
  t('wipe: 지워진 게임 키 → true', S.clear(a) === true && a.getItem('luna_save_v1') === null);
  t('wipe: 안 지워진 수첩 키 → false, 남은 글은 그대로 보임', N.clearNotes(a) === false && N.getNote(1, a) === '저작권은 표현을 보호');
  const b = store('luna_save_v1');
  t('wipe: 안 지워진 게임 키 → false', S.clear(b) === false && b.getItem('luna_save_v1') !== null);
  t('wipe: 지워진 수첩 키 → true, 모드 키는 남음', N.clearNotes(b) === true && b.getItem('luna_notes_v1') === null && b.getItem('luna_theme') === 'dark');
  const liar = { getItem: () => 'x', setItem() {}, removeItem() {} };   // 던지지 않는데 값이 남는 저장소
  t('wipe: 지운 척만 하는 저장소도 false', S.clear(liar) === false && N.clearNotes(liar) === false);
  const boom = { getItem() { throw new Error('x'); }, setItem() { throw new Error('x'); }, removeItem() { throw new Error('x'); } };
  t('wipe: 아예 못 쓰는 저장소(남은 기록을 읽을 길도 없음) → true', S.clear(boom) === true && N.clearNotes(boom) === true && S.clear(null) === true);
  N.clearNotes({ getItem: () => null, setItem() {}, removeItem() {} });
}

console.log('[저장 불러오기] 타입·범위·허용값 검사 (보안 검토 2026-11-18 C — 버전만 보고 game을 그대로 돌려줬다)');
{
  const S = await import('../js/state.js');
  const mem = raw => { const m = { luna_save_v1: raw }; return { m, getItem: k => (k in m ? m[k] : null), setItem: (k, v) => { m[k] = String(v); }, removeItem: k => { delete m[k]; } }; };
  const wrap = (game, phase = 'ep') => JSON.stringify({ schemaVersion: 1, game, phase });
  const load = (game, phase) => S.load(mem(wrap(game, phase)));
  // 정상 저장: EP 셋까지 하고(오답·재선택·퀴즈·시작 사본 포함) 저장 → 그대로 돌아온다
  const g = E.newGame(); g.idol = 'sol';
  R.markEpStart(g); E.chooseWrongRetry(g, 1, ep(1).choices.wrong.delta); E.chooseRight(g, 1, ep(1).choices.right.delta); Q.record(g, 1, 'more-ok'); E.settle(g); E.nextEp(g);
  R.markEpStart(g); E.chooseWrongAccept(g, 2, ep(2).choices.wrong.delta); Q.record(g, 2, 'missed'); E.settle(g); E.nextEp(g);
  R.markEpStart(g);
  const canon = v => Array.isArray(v) ? v.map(canon) : v && typeof v === 'object' ? Object.fromEntries(Object.keys(v).sort().map(k => [k, canon(v[k])])) : v;
  const same = (a, b) => JSON.stringify(canon(a)) === JSON.stringify(canon(b));   // 칸 순서는 따지지 않는다
  const ok = load(g);
  t('load: 정상 저장은 그대로', !!ok && same(ok.game, g) && ok.phase === 'ep', ok ? '' : 'null');
  const old = JSON.parse(JSON.stringify(g)); delete old.quiz; delete old.epStart; delete old.schemaVersion;   // 퀴즈·시작 사본 이전의 옛 저장
  const okOld = load(old);
  t('load: 옛 저장(퀴즈·시작 사본 없음)도 예전처럼', !!okOld && same(okOld.game, old) && R.resumePoint(okOld).state.ep === 3);
  const done = E.newGame(); for (let i = 1; i <= 6; i++) { E.chooseRight(done, i, ep(i).choices.right.delta); E.settle(done); if (i < 6) E.nextEp(done); } E.judgeEnding(done);
  t('load: 끝난 판(end)도 그대로', (r => !!r && r.phase === 'end' && r.game.ending === 'unicorn')(load(done, 'end')));
  const vOld = mem(JSON.stringify({ schemaVersion: 0, game: g, phase: 'ep' }));
  t('load: 다른 버전은 예전처럼 버림', S.load(vOld) === null && vOld.getItem('luna_save_v1') === null);
  const bad = f => { const x = JSON.parse(JSON.stringify(g)); f(x); return load(x); };
  t('load: 점수 자리에 마크업 → 거부', bad(x => { x.stats.money = '<img src=x onerror=alert(1)>'; }) === null);
  t('load: 모르는 배지 값 → 거부', bad(x => { x.badges[0] = '"><b>pwn</b>'; }) === null);
  t('load: 숫자 범위 밖·소수·문자 숫자 → 거부', [x => { x.stats.fame = 101; }, x => { x.stats.safety = -1; }, x => { x.stats.money = 1.5; }, x => { x.stats.money = '50'; },
    x => { x.ep = 7; }, x => { x.ep = 0; }, x => { x.courtCount = 3; }, x => { x.wrongs = [9]; }, x => { x.wrongs = ['1']; }].every(f => bad(f) === null));
  t('load: 모양이 틀린 칸 → 거부', [x => { x.badges = x.badges.slice(0, 5); }, x => { x.badges = 'full'; }, x => { x.stats = null; }, x => { x.idol = '<b>'; },
    x => { x.retryUsed = 'yes'; }, x => { x.ending = 'win'; }, x => { x.quiz = { 1: '<i>' }; }, x => { x.quiz = { 9: 'ok' }; }, x => { x.epStart.stats.money = '<b>'; }].every(f => bad(f) === null));
  t('load: 단계 값이 이상하면 거부', load(g, '<b>') === null && S.load(mem(JSON.stringify({ schemaVersion: 1, game: null, phase: 'ep' }))) === null);
  t('load: 모르는 칸은 버리고 불러옴', (r => !!r && !('evil' in r.game) && !('evil' in r.game.stats))(bad(x => { x.evil = '<b>'; x.stats.evil = 1; })));
  t('load: 깨진 JSON → null', S.load(mem('{깨짐')) === null);
}

console.log('[배포] GitHub Pages에 올라갈 파일 (보안 검토 2026-11-18 A — 테스트 페이지가 같은 오리진에서 게임 저장을 지울 수 있었다)');
{
  const P = await import('./pages-files.mjs');
  const fs = await import('node:fs');
  const path = await import('node:path');
  const pub = P.publishedFiles(), set = new Set(pub);
  const outside = pub.filter(f => !P.ALLOWED.some(a => f === a || (a.endsWith('/') && f.startsWith(a))));
  t('pages: 게임·도감과 그 자산만 올라감', outside.length === 0, outside.slice(0, 8).join(', '));
  t('pages: 테스트·문서는 빠짐(캡처 프로브 포함)', !pub.some(f => f.startsWith('test/') || f.startsWith('docs/')) && !set.has('test/probe-shots.html'));
  t('pages: index.html·dogam.html은 올라감', set.has('index.html') && set.has('dogam.html'));
  // 게임·도감이 부르는 파일(HTML의 src·href, JS import, CSS url, 캐릭터 PNG)이 전부 올라가는지 — 빠지면 배포본이 깨진다
  const need = new Set(), missing = [];
  const rel = (from, ref) => path.posix.normalize(path.posix.join(path.posix.dirname(from), ref));
  const visit = f => {
    if (need.has(f)) return; need.add(f);
    const p = path.join(P.ROOT, f);
    if (!set.has(f)) missing.push(f);
    if (!fs.existsSync(p)) return;
    const src = fs.readFileSync(p, 'utf8');
    const refs = f.endsWith('.html') ? [...src.matchAll(/(?:src|href)="([^"#?:]+)"/g)].map(m => m[1])
      : f.endsWith('.js') ? [...src.matchAll(/(?:from|import\()\s*'([^']+)'/g)].map(m => m[1])
      : f.endsWith('.css') ? [...src.matchAll(/url\('?([^')]+)'?\)/g)].map(m => m[1]).filter(u => !u.startsWith('data:')) : [];
    refs.forEach(r => visit(rel(f, r)));
  };
  ['index.html', 'dogam.html'].forEach(visit);
  ['sol', 'luna'].forEach(k => ['neutral', 'happy', 'panic', 'shock'].forEach(e => visit(`assets/characters/${k}-${e}.png`)));
  t('pages: 게임·도감이 부르는 파일이 전부 올라감', missing.length === 0 && need.size > 20, missing.join(', ') + ' / ' + need.size + '개');
}

console.log('─'.repeat(40));
if (fail) { console.log(`❌ ${fail}건 실패 / ${pass}건 통과 — 배포 금지`); process.exit(1); }
console.log(`✅ ${pass}건 전부 통과 — 엔진 검산 완료`);
