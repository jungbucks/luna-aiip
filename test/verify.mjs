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
  E.settle(st); if (st.ep < 6) E.nextEp(st);
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

console.log('[경로 B] 전부 오답(대가 진행) → 위기 점검 회의 EP3·EP4·EP6, 그래도 6편 끝까지 (2026-11-20 — 법정·집행유예 없음)');
{
  const st = E.newGame();
  const crisisAt = [];
  for (let i = 1; i <= 6; i++) {
    const before = st.ep;
    if (playWrongAccept(st) === 'crisis') crisisAt.push(before);
  }
  t('6편을 모두 지나감(중간에 끝나지 않음)', st.ep === 6 && st.badges.every(b => b === 'none'), 'ep ' + st.ep);
  t('위기 점검 회의 = EP3·EP4·EP6, 회의 뒤 신뢰 30으로 회복', JSON.stringify(crisisAt) === '[3,4,6]' && st.crisisCount === 3, JSON.stringify(crisisAt));
  t('최종 스탯 10/0/30', st.stats.money === 10 && st.stats.fame === 0 && st.stats.safety === 30, fmt(st));
  t('엔딩 = crisis(운영 결과)', E.judgeEnding(st) === 'crisis');
  t('checkCrisis는 게임을 끝내지 않음(ending 미정)', (() => { const x = E.newGame(); x.stats.safety = 0; const r = E.checkCrisis(x); return r === 'crisis' && x.stats.safety === 30 && x.ending === null; })());
}

console.log('[경로 C] 오답 EP1·EP4(대가 진행) + 나머지 정답 → 생존');
{
  const st = E.newGame();
  for (let i = 1; i <= 6; i++) (i === 1 || i === 4) ? playWrongAccept(st) : playRight(st);
  const end = E.judgeEnding(st);
  // 2026-11-20: EP4 오답 📈-5, EP4 끝 💰0 → 통장 바닥 → EP5 정답 보상 📈·🛡️ 절반(+5/+5), EP6 끝 💰0도 바닥(엔딩용)
  t('최종 스탯 10/55/60', st.stats.money === 10 && st.stats.fame === 55 && st.stats.safety === 60, fmt(st));
  t('통장 바닥을 겪음(brokeEver)', st.brokeEver === true);
  t('완전 배지 4 + none 2', st.badges.filter(b => b === 'full').length === 4 && st.badges.filter(b => b === 'none').length === 2);
  t('위기 점검 회의 0회', st.crisisCount === 0);
  t('엔딩 = survive', end === 'survive', end);
}

console.log('[경로 D] EP1 오답→[다시 선택]→정답 + 나머지 정답 → 반쪽 배지 → 생존');
{
  const st = E.newGame();
  E.chooseWrongRetry(st, 1, ep(1).choices.wrong.delta);   // 50% trunc: 💰-15 🛡-12 📈-2
  E.chooseRight(st, 1, ep(1).choices.right.delta);
  E.settle(st); E.nextEp(st);
  t('EP1 종료 30/38/73 (trunc 검증)', st.stats.money === 30 && st.stats.fame === 38 && st.stats.safety === 73, fmt(st));
  t('EP1 배지 = half', st.badges[0] === 'half');
  for (let i = 2; i <= 6; i++) playRight(st);
  const end = E.judgeEnding(st);
  t('최종 스탯 30/93/100', st.stats.money === 30 && st.stats.fame === 93 && st.stats.safety === 100, fmt(st));
  t('반쪽 1 + 완전 5', st.badges.filter(b => b === 'half').length === 1 && st.badges.filter(b => b === 'full').length === 5);
  t('반쪽이 유니콘 차단 → survive', end === 'survive', end);
}

console.log('[인지도 밸런스] 오답은 📈를 올리지 않고, 다시 선택한 경로가 바로 맞힌 경로보다 📈가 높게 끝나지 않음 (2026-11-24 플레이테스트 [3])');
{
  t('오답 📈 ≤ 0 (6편)', EPISODES.every(e => (e.choices.wrong.delta.fame || 0) <= 0), EPISODES.map(e => e.choices.wrong.delta.fame).join());
  const finalFame = k => {   // k편만 다시 선택, 나머지는 바로 맞힘(k=0이면 전부 바로 맞힘)
    const st = E.newGame();
    for (let i = 1; i <= 6; i++) {
      if (i === k) E.chooseWrongRetry(st, i, ep(i).choices.wrong.delta);
      E.chooseRight(st, i, ep(i).choices.right.delta); E.settle(st); if (i < 6) E.nextEp(st);
    }
    return st.stats.fame;
  };
  const base = finalFame(0);
  t('편마다: 다시 선택한 판의 최종 📈 < 바로 맞힌 판', [1, 2, 3, 4, 5, 6].every(k => finalFame(k) < base), [1, 2, 3, 4, 5, 6].map(finalFame).join() + ' vs ' + base);
  t('엔딩 📈 한 줄: 놓친 편이 있으면 그 수를 말함', STRINGS.fameLine(90, 3).includes('3편') && !STRINGS.fameLine(90, 0).includes('편에서'));
}

console.log('[통장 바닥] 정산 직전 💰0 → 다음 EP 정답 보상 절반·유니콘 불가 (SPEC §6.1-2, 2026-11-20)');
{
  const st = E.newGame();
  st.stats.money = 0;
  t('정산 직전 💰0 → settle이 true, 정산 뒤 💰10', E.settle(st) === true && st.broke && st.brokeEver && st.stats.money === 10);
  E.nextEp(st);
  const d = E.rightDeltaFor(st, { money: -15, fame: 15, safety: 15 });
  t('바닥난 다음 EP: 📈·🛡️ 상승분 절반(trunc), 💰 비용은 그대로', d.money === -15 && d.fame === 7 && d.safety === 7, JSON.stringify(d));
  t('바닥난 다음 EP: 감점은 줄이지 않음', E.rightDeltaFor(st, { money: 0, fame: -4, safety: 0 }).fame === -4);
  t('다음 정산에서 💰>0이면 보상은 원래대로', E.settle(st) === false && !st.broke && st.brokeEver
    && JSON.stringify(E.rightDeltaFor(st, { money: -15, fame: 15, safety: 15 })) === JSON.stringify({ money: -15, fame: 15, safety: 15 }));
  const u = E.newGame(); u.badges = u.badges.map(() => 'full'); u.stats.safety = 100; u.ep = 6;
  t('완전 배지 6 + 🛡️100이어도 바닥난 적 있으면 유니콘 불가', E.judgeEnding({ ...u, brokeEver: true }) === 'survive' && E.judgeEnding({ ...u, ending: null }) === 'unicorn');
  t('newGame: broke·brokeEver false', E.newGame().broke === false && E.newGame().brokeEver === false);
}

console.log('[시스템 줄] 방 나가기 (2026-11-20)');
{
  const sys = EPISODES.flatMap(e => e.messages.filter(m => m.sys).map(m => ({ ep: e.id, ...m })));
  t('EP6: 코스모 담당자가 나가면 시스템 줄 + 방 인원 (4)→(3)', EPISODES[5].roomName.endsWith('(4)') && sys.some(m => m.ep === 6 && m.sys.includes('코스모 담당자') && m.room.endsWith('(3)')));
  t('시스템 줄은 첫 줄·마지막 줄이 아니고 who·text가 없음', EPISODES.every(e => !e.messages[0].sys && !e.messages[e.messages.length - 1].sys) && sys.every(m => !m.who && !m.text));
}

console.log('[교육 개선] 법 개념·평가 구조 지킴이 (2026-11-20)');
{
  const OL = (await import('../data/ourlog.js')).OURLOG;
  const strSrc = (await import('node:fs')).readFileSync(new URL('../data/strings.js', import.meta.url), 'utf8');
  const e = n => EPISODES[n - 1];
  t('kind: 우리 권리 관리(특허·상표·영업비밀) / 남의 권리 침해 위험(저작권·초상권·퍼블리시티)', EPISODES.map(x => x.kind).join() === 'others,own,own,own,others,others');
  t('notePrompt: 편마다 구체적인 질문(물음표, 서로 다름)', EPISODES.every(x => typeof x.notePrompt === 'string' && x.notePrompt.endsWith('?')) && new Set(EPISODES.map(x => x.notePrompt)).size === 6);
  t('공용 문구(화면에 나오는 값)에 법정·피고·집행유예·판사·완전/반쪽 배지 없음', !/법정|피고|집행유예|판사|반쪽 배지|완전 배지/.test(JSON.stringify(STRINGS)) && strSrc.includes('crisis:'));
  // 바로잡은 오개념이 돌아오지 않게
  t('EP1: 정답은 학습 이용 조건 확인(음원 구매가 아님), 요리책 비유 없음', /학습/.test(e(1).choices.right.label) && !/사용료를 내고/.test(e(1).choices.right.label + e(1).choices.right.popup.body) && !/요리책/.test(e(1).choices.wrong.popup.analogy)
    && /듣는/.test(e(1).concept) && /결과물|나온 노래/.test(e(1).concept));
  t('EP2: 출원만으로 베끼기를 막는다고 하지 않음(등록되어야 특허권)', !/베낄 수 없/.test(e(2).choices.right.popup.body) && /등록/.test(e(2).choices.right.popup.body) && /예외/.test(e(2).concept));
  t('EP3: 출원했다(등록했다 아님)·신고와 출원을 함께·구청 간판 비유 없음·사업자 등록 ≠ 상표 등록', /출원/.test(e(3).choices.right.popup.body) && !/등록했다/.test(e(3).choices.right.popup.body)
    && /신고/.test(e(3).choices.right.label) && /출원/.test(e(3).choices.right.label) && !/구청/.test(e(3).choices.wrong.popup.analogy) && /사업자 등록/.test(e(3).concept));
  t('EP4: 세 조건(비공지·경제적 가치·비밀 관리) + 일반 경험과 구분, 모든 직원에게 같은 절차', /알려지지 않/.test(e(4).concept) && /경제적 가치/.test(e(4).concept) && /비밀로 관리/.test(e(4).concept) && /일반적인 경험/.test(e(4).concept) && /모든 직원/.test(e(4).choices.right.label));
  t('EP5: 촬영 동의와 홍보·광고 이용 동의를 구분', /촬영/.test(e(5).choices.wrong.popup.lesson) && /광고|홍보/.test(e(5).choices.wrong.popup.lesson) && /홍보/.test(e(5).choices.right.label));
  t('EP6: 남의 인기를 무단으로 광고에 쓰는 문제 + 닮은꼴 + 정식 협업 여지 + 여러 권리가 함께', /협업/.test(e(6).choices.right.label + e(6).choices.right.popup.body) && /닮은꼴/.test(e(6).concept) && /함께/.test(e(6).concept));
  t('대화: 편마다 준호·세아가 둘 다 말한다(한쪽만 정답 단서를 내지 않게)', EPISODES.every(x => ['개발자 준호', '마케터 세아'].every(w => x.messages.some(m => m.who === w))));
  const olAll = Object.values(OL.posts).flatMap(p => ['right', 'wrong'].flatMap(v => p.comments[v]).concat(p.comments.half)).map(c => c.text);
  t('ourlog: 팬이 내부 사정(경고장·내용증명·내부 관리)을 아는 댓글 없음', olAll.every(x => !/경고장|내용증명|내부 관리/.test(x)));
  t('ourlog EP1: 학습 데이터 문제를 결과물 표절 의혹과 섞지 않음', OL.posts[1].comments.wrong.every(c => !/표절|베낀|비슷하지|들어 본 것 같/.test(c.text)));
  t('ourlog: 정답 게시물에도 아쉬움·갈리는 반응이 있다(정답 = 늘 칭찬이 아님)', Object.values(OL.posts).filter(p => p.comments.right.some(c => /아쉬|낯설|평범|짧아서/.test(c.text))).length >= 4);
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
    e.hint && e.concept && e.choices?.wrong?.label && e.choices?.wrong?.delta && e.choices?.wrong?.popup?.title &&
    e.choices?.right?.label && e.choices?.right?.delta && e.choices?.right?.popup?.title && e.choices?.info?.label));
  t('SPEC §6.2 델타 일치', JSON.stringify(EPISODES.map(e => [e.choices.wrong.delta, e.choices.right.delta])) ===
    JSON.stringify([
      [{ money: -30, safety: -25, fame: -5 }, { money: -15, safety: 15, fame: 20 }],
      [{ money: -20, safety: -20, fame: -5 }, { money: -10, safety: 15, fame: 10 }],
      [{ money: -25, safety: -25, fame: -10 }, { money: -10, safety: 10, fame: 15 }],
      [{ money: -30, safety: -30, fame: -5 }, { money: -10, safety: 15, fame: 5 }],
      [{ money: -20, safety: -25, fame: -10 }, { money: -5, safety: 10, fame: 10 }],
      [{ money: -25, safety: -25, fame: -10 }, { money: -15, safety: 15, fame: 15 }],
    ]));
}

console.log('[말투] 캐릭터 톡 — 사람이 하는 말 (2026-11-17, docs/superpowers/specs/2026-11-17-chat-dialogue-design.md)');
{
  const talk = e => e.messages.filter(m => !m.sys);   // 시스템 줄(누가 나감)은 말풍선이 아니다
  const all = EPISODES.flatMap(e => talk(e).map(m => ({ ep: e.id, ...m })));
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

  t('한 편 10~16줄', EPISODES.every(e => talk(e).length >= 10 && talk(e).length <= 16));
  none('말풍선 45자 이하 + 첫 줄(알림 미리보기) 30자 이하', all.filter(m => len(m.text) > 45).concat(EPISODES.map(e => ({ ep: e.id, ...e.messages[0] })).filter(m => len(m.text) > 30)));
  none('유행어 없음(개이득·~각·ㄱㄱ·ㅇㅇ·ㄷㄷ·콜?)', all.filter(m => SLANG.some(s => m.text.includes(s)) || words(m.text).some(isGak)));
  none('"~임/~음" 끝맺음 없음', all.filter(m => isEumseum(m.text)));
  none('느낌표·물음표 연달아 쓰지 않음', all.filter(m => /[!?]{2,}/.test(m.text)));
  t('ㅋㅋ는 한 편에 두 번까지, 이모지는 하나까지', EPISODES.every(e =>
    talk(e).filter(m => m.text.includes('ㅋㅋ')).length <= 2 && talk(e).filter(m => EMOJI.test(m.text)).length <= 1));
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
    ['정답 제목', e.choices.right.popup.title], ['정답 본문', e.choices.right.popup.body], ['개념 요약', e.concept], ['질문 카드', e.hint],
  ].map(([who, text]) => ({ ep: e.id, who, text })));
  none('알림: 느낌표·경보 이모지(🚨✨)·"셈입니다/격입니다"·유행어 없음', pops.filter(m => /[!🚨✨]|셈입니다|격입니다/u.test(m.text) || SLANG.some(s => m.text.includes(s))));
  none('알림: 비유는 "~와 같아요."로, 배운 것·정답 본문은 "~다."로, 개념 요약은 "~요."로, 질문 카드는 "~요?"로 끝남', pops.filter(m =>
    (m.who === '비유' && !m.text.endsWith('같아요.')) || (['배운 것', '정답 본문'].includes(m.who) && !m.text.endsWith('다.')) || (m.who === '개념 요약' && !m.text.endsWith('요.')) || (m.who === '질문 카드' && !m.text.endsWith('요?'))));
  // 2026-11-20: 선택지를 문장 모양만 보고 고르지 않게 — C는 권리 이름 없이 한 문장, 정답 쪽 "번거로워도/늦어져도/돈이 더 들어도" 틀 금지, 질문 카드는 정답 요약을 그대로 옮기지 않음
  none('선택지: C는 6편 모두 "잠깐, 확인할 게 있어."', EPISODES.filter(e => e.choices.info.label !== '잠깐, 확인할 게 있어.').map(e => ({ ep: e.id, who: '선택지 info', text: e.choices.info.label })));
  none('선택지: 정답에 "번거로워도·늦어져도·돈이 더 들어도·시간이 걸려도" 틀 없음, 오답에 "그냥·바로" 시작 없음',
    EPISODES.filter(e => /번거로워도|늦어져도|돈이 더 들어도|시간이 걸려도/.test(e.choices.right.label) || /^(그냥|바로)/.test(e.choices.wrong.label))
      .map(e => ({ ep: e.id, who: '선택지', text: e.choices.wrong.label + ' ↔ ' + e.choices.right.label })));
  none('질문 카드: 개념 요약과 다른 글이고 물음표가 있음', EPISODES.filter(e => e.hint === e.concept || !e.hint.includes('?')).map(e => ({ ep: e.id, who: '질문 카드', text: e.hint })));
  t('알림: 정답 제목 = "(권리) 배지를 얻었다 (배지 그림)"', EPISODES.every(e => e.choices.right.popup.title === `${e.right === '퍼블리시티권' ? '퍼블리시티' : e.right} 배지를 얻었다 ${e.rightEmoji}`));
  // 스토리 장면·편 소개·인트로·엔딩: 명언풍·느낌표 없이 있었던 일을 담담하게. 장면은 세 줄까지
  const story = EPISODES.flatMap(e => [...e.scenes.map(s => ({ ep: e.id, who: '장면', text: s.text })), { ep: e.id, who: '편 소개', text: e.intro }])
    .concat(STRINGS.intro.map(c => ({ ep: 0, who: '인트로', text: c.text })), Object.values(STRINGS.endings).map(c => ({ ep: 0, who: '엔딩', text: c.body })));
  none('장면·소개·인트로·엔딩: 느낌표 없음, 장면·인트로는 세 줄까지, 한 줄 30자 이하',
    story.filter(m => m.text.includes('!') || (['장면', '인트로'].includes(m.who) && (m.text.split('\n').length > 3 || m.text.split('\n').some(l => len(l) > 30)))));
  const C = await import('../js/ui/chat.js');
  t('선택지 순서: 오답·정답 자리가 섞이고 확인은 늘 맨 끝', C.choiceOrder(0.1).join() === 'wrong,right,info' && C.choiceOrder(0.9).join() === 'right,wrong,info');

  console.log('[ourlog] 피드 계산·글 (docs/superpowers/specs/2026-11-20-ourlog-design.md)');
  const F = await import('../js/ourlog-feed.js');
  const { OURLOG } = await import('../data/ourlog.js');
  const EPS = [1, 2, 3, 4, 5, 6];
  t('variantOf: full→right, half→half, none→wrong, null→null',
    F.variantOf('full') === 'right' && F.variantOf('half') === 'half' && F.variantOf('none') === 'wrong' && F.variantOf(null) === null);
  const p = OURLOG.posts[1];
  const half = F.commentsFor(p, 'half');
  t('commentsFor half: right에 끼워 넣고 원본은 그대로', half.length === p.comments.right.length + p.comments.half.length
    && p.comments.half.every(h => half[h.at].text === h.text) && F.commentsFor(p, 'right').length === p.comments.right.length);
  t('좋아요: 실시간은 오답이 더, 나중엔 오답이 덜(6편 배율)', EPS.every(i => {
    const L = OURLOG.posts[i].likes; return L.live.wrong > L.live.right && L.later.wrong < L.later.right; }));
  t('좋아요·팔로워: 정수, 📈와 같은 방향', [0, 20, 50, 100].every(f => Number.isInteger(F.followersFor(f)) && Number.isInteger(F.likesFor(p, 'wrong', f, 'live')))
    && F.followersFor(80) > F.followersFor(20) && F.likesFor(p, 'right', 80, 'later') > F.likesFor(p, 'right', 20, 'later')
    && F.likesFor(p, 'wrong', 50, 'live') > F.likesFor(p, 'right', 50, 'live') && F.likesFor(p, 'wrong', 50, 'later') < F.likesFor(p, 'right', 50, 'later'));
  t('fmtCount: 1,234 / 2.4만 / 8만', F.fmtCount(1234) === '1,234' && F.fmtCount(24000) === '2.4만' && F.fmtCount(80000) === '8만');
  const g = E.newGame(); g.badges = ['full', 'none', 'half', null, null, null];
  t('feedOf: 배지 있는 EP만, 최신 먼저', JSON.stringify(F.feedOf(g)) === JSON.stringify([{ ep: 3, variant: 'half' }, { ep: 2, variant: 'wrong' }, { ep: 1, variant: 'right' }]));
  t('6편 모두 있음', [1, 2, 3, 4, 5, 6].every(i => OURLOG.posts[i]));
  t('imageKey: half는 right 그림', F.imageKey(p, 'half') === p.img.right);
  // 2026-11-24 플레이테스트 [1]: 재선택(half) 게시물 본문에 "undefined"가 나왔다
  t('captionFor: 6편·3갈래 모두 빈 글이 아닌 문자열(undefined·null 없음)', EPS.every(i => ['right', 'wrong', 'half'].every(v => { const c = F.captionFor(OURLOG.posts[i], v); return typeof c === 'string' && c.length > 0 && !/undefined|null/.test(c); })));
  t('captionFor: half 글이 없으면 right 글, 값이 없으면 빈 글', F.captionFor({ caption: { right: 'R' } }, 'half') === 'R' && F.captionFor({ caption: {} }, 'wrong') === '' && F.captionFor({}, 'right') === '' && F.captionFor(null, 'half') === '');
  // [7]: 지난 게시물 좋아요가 지금 📈로 다시 계산돼 EP1·3·4가 같은 숫자였다
  { const st = E.newGame(); st.stats.fame = 40; F.recordPost(st, 1); st.stats.fame = 70; F.recordPost(st, 3); st.stats.fame = 90;
    t('fameAt: 게시물을 올린 때의 📈, 적어 두지 않은 편은 지금 📈', F.fameAt(st, 1) === 40 && F.fameAt(st, 3) === 70 && F.fameAt(st, 4) === 90 && F.likesFor(p, 'right', F.fameAt(st, 1), 'later') !== F.likesFor(p, 'right', F.fameAt(st, 3), 'later')); }
  t('imageKey: EP5 half=ep5-blur, wrong=ep5', F.imageKey(OURLOG.posts[5], 'half') === 'ep5-blur' && F.imageKey(OURLOG.posts[5], 'wrong') === 'ep5');
  const lines = EPS.flatMap(i => ['right', 'wrong', 'half'].map(v => ({ i, v, list: F.commentsFor(OURLOG.posts[i], v) })));
  none('댓글: 편·갈래마다 8~10개(half는 끼운 뒤)', lines.filter(x => x.list.length < 8 || x.list.length > 10).map(x => ({ ep: x.i, who: x.v, text: String(x.list.length) })));
  none('댓글: 40자 이하, 유행어 없음, 이름 하드코딩 없음', lines.flatMap(x => x.list.map(c => ({ ep: x.i, who: c.who, text: c.text })))
    .filter(c => [...c.text].length > 40 || SLANG.some(s => c.text.includes(s)) || /솔|루나|SOL|LUNA/.test(c.text)));
  none('아이디: 영문 소문자 3~20자, 한 화면(half·wrong 목록) 안에서 겹치지 않음', EPS.flatMap(i => ['half', 'wrong'].flatMap(v => {
    const list = F.commentsFor(OURLOG.posts[i], v), ids = list.map(c => c.who);
    return list.filter((c, k) => !/^[a-z0-9_.]{3,20}$/.test(c.who) || ids.indexOf(c.who) !== k).map(c => ({ ep: i, who: c.who, text: v }));
  })));
  t('계정 = {N}_official 토큰', OURLOG.account.handle === '{N}_official');
  {
    const fsx = await import('node:fs');
    const { ART_READY } = await import('../data/ourlog.js');
    const keys = ['ep1', 'ep2', 'ep3', 'ep4', 'ep5', 'ep5-blur', 'ep6', 'ep6-k'];
    const { fileURLToPath } = await import('node:url');
    t('ourlog 그림: ART_READY면 16장이 다 있고 장당 150KB·합계 2.5MB 이하', (() => {
      if (!ART_READY) return true;
      const files = ['sol', 'luna'].flatMap(i => keys.map(k => fileURLToPath(new URL(`../assets/ourlog/${i}/${k}.webp`, import.meta.url))));   // 레포 기준(어느 폴더에서 실행해도)
      const sizes = files.map(f => fsx.existsSync(f) ? fsx.statSync(f).size : -1);
      return sizes.every(s => s > 0 && s <= 150 * 1024) && sizes.reduce((a, b) => a + b, 0) <= 2.5 * 1024 * 1024;
    })());
    t('ourlog 그림 키 = 의뢰서 키', EPS.flatMap(i => Object.values(OURLOG.posts[i].img)).every(k => keys.includes(k)));
    t('ourlog 그림 설명(alt): 8키 모두 1~30자, 이름 하드코딩 없음, 키 밖 설명 없음', keys.every(k => typeof OURLOG.alt[k] === 'string' && [...OURLOG.alt[k]].length >= 1 && [...OURLOG.alt[k]].length <= 30
      && !/솔|루나|SOL|LUNA/.test(OURLOG.alt[k])) && Object.keys(OURLOG.alt).every(k => keys.includes(k)), JSON.stringify(OURLOG.alt));
  }
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

console.log('[적용 문제] 문항·판정·학습 결과 (2026-11-20 — 두 문항 모두, 재선택만으로 이해 인정 안 함)');
{
  const eps = [1, 2, 3, 4, 5, 6];
  const ok = (it) => it && typeof it.q === 'string' && it.q.trim() && typeof it.exp === 'string' && it.exp.trim() && typeof it.a === 'boolean';
  t('quiz-shape: EP1~6 편마다 두 문항(모두 출제, 숨은 문항 없음)', Object.keys(QUIZ).length === 6 && eps.every(e => QUIZ[e] && Array.isArray(QUIZ[e].items) && QUIZ[e].items.length === 2 && QUIZ[e].items.every(ok) && !('more' in QUIZ[e])));
  t('quiz-balance: O·X가 섞임(한쪽으로 몰리지 않음)', (n => n >= 4 && n <= 8)(eps.flatMap(e => QUIZ[e].items).filter(it => it.a).length));
  const texts = eps.flatMap(e => QUIZ[e].items.flatMap(it => [it.q, it.exp]));
  t('quiz-no-names: 이름 토큰·캐릭터 이름 없음', texts.every(x => !/{[nN]|솔|루나|SOL|LUNA/.test(x)));
  t('quiz-guardrail: 단정 금칙어 없음', texts.every(x => !/무조건 불법|반드시|절대로/.test(x)));
  const qs = eps.flatMap(e => QUIZ[e].items.map(it => it.q));
  t('quiz-no-cue: 문제에 답을 흘리는 말(마음대로·아무 문제 없다·자동으로·모두) 없음', qs.every(x => !/마음대로|아무 문제|문제가 없다|자동으로|모두/.test(x)), qs.filter(x => /마음대로|아무 문제|문제가 없다|자동으로|모두/.test(x)).join(' / '));
  t('scoreOf: 맞힌 수 → 2/2·1/2·0/2', Q.scoreOf(2) === '2/2' && Q.scoreOf(1) === '1/2' && Q.scoreOf(0) === '0/2');
  t('learnOf: 2/2 확인 · 1/2 일부 · 0/2 다시 + 옛 값(ok·more-ok·missed)', Q.learnOf('2/2') === 'confirmed' && Q.learnOf('1/2') === 'partial' && Q.learnOf('0/2') === 'review'
    && Q.learnOf('ok') === 'confirmed' && Q.learnOf('more-ok') === 'partial' && Q.learnOf('missed') === 'review' && Q.learnOf(undefined) === null);
  const s1 = {}; Q.record(s1, 2, '0/2'); Q.record(s1, 2, '2/2');
  t('record-overwrite: 같은 EP는 덮어씀', s1.quiz && s1.quiz[2] === '2/2');
  t('reviewEps: 다 확인하지 못한 편만, 오름차순', JSON.stringify(Q.reviewEps({ quiz: { 5: '0/2', 1: '1/2', 3: '2/2' } })) === '[1,5]');
  const old = {};
  t('reviewEps-old-save: quiz 없는 옛 저장 → [] (상태를 바꾸지 않음)', JSON.stringify(Q.reviewEps(old)) === '[]' && !('quiz' in old));
  // 재선택 후 학습 인정: 처음 판단은 틀렸어도(배지 half) 새 사례 두 문항을 맞히면 학습 결과는 '확인'
  const st = E.newGame();
  E.chooseWrongRetry(st, 1, ep(1).choices.wrong.delta); E.chooseRight(st, 1, ep(1).choices.right.delta); Q.record(st, 1, Q.scoreOf(2));
  t('재선택 후 학습 인정: 처음 판단 기록(half)과 학습 결과(confirmed)가 따로', st.badges[0] === 'half' && Q.learnAt(st, 1) === 'confirmed');
  const st2 = E.newGame();
  E.chooseRight(st2, 1, ep(1).choices.right.delta); Q.record(st2, 1, Q.scoreOf(0));
  t('처음에 맞혀도 적용을 못 하면 학습 결과는 다시 볼 것', st2.badges[0] === 'full' && Q.learnAt(st2, 1) === 'review');
}

console.log('[이어 하기] 에피소드 시작 상태에서 다시 (2026-11-14 — 퀴즈·정산 중 새로 고침 시 점수 두 번 방지)');
{
  const st = E.newGame(); st.idol = 'sol';
  R.markEpStart(st);
  const startStats = JSON.stringify(st.stats);
  E.chooseRight(st, st.ep, ep(1).choices.right.delta); Q.record(st, 1, '2/2');      // 정답 + 퀴즈까지 한 뒤 저장된 상태
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
      else E.chooseWrongAccept(st, st.ep, ep(st.ep).choices.wrong.delta);
      E.settle(st);
      if (st.ep === 6) break;
      E.nextEp(st);
    }
    const end = E.judgeEnding(st);
    return { end, data: JSON.parse(JSON.stringify({ schemaVersion: 1, game: st, phase: 'end' })) };   // localStorage 왕복
  };
  for (const kind of ['unicorn', 'survive', 'crisis']) {
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
  const senders = [...new Set(EPISODES.flatMap(e => e.messages.filter(m => !m.sys).map(m => m.who)))];
  t('avatar: 데이터의 보낸이는 서로 다른 색', new Set(senders.map(C.avatarTone)).size === senders.length);
  t('avatar: 색 번호는 0~' + (C.AVATAR_TONES - 1), [...senders, '처음 보는 사람', ''].every(w => Number.isInteger(C.avatarTone(w)) && C.avatarTone(w) >= 0 && C.avatarTone(w) < C.AVATAR_TONES));
  t('avatar: 같은 이름은 늘 같은 색, 처음 보는 이름은 고정 번호와 안 겹침', C.avatarTone('팬 하늘') === C.avatarTone('팬 하늘') && C.avatarTone('팬 하늘') >= 4);
}

console.log('[수첩] 알게 된 것 적기 (notes.js — 점수와 무관)');
{
  const N = await import('../js/notes.js');
  const mem = () => { const m = {}; return { getItem: k => (k in m ? m[k] : null), setItem: (k, v) => { m[k] = String(v); }, removeItem: k => { delete m[k]; } }; };
  const boom = { getItem() { throw new Error('x'); }, setItem() { throw new Error('x'); }, removeItem() { throw new Error('x'); } };
  t('notes-valid: 5자부터', !N.isValid('1234') && N.isValid('abcde') && !N.isValid('   \n  ') && !N.isValid(' 1 2 3 4 ') && N.isValid('가 나 다 라 마'));
  t('notes-valid: 자음·모음·숫자만, 같은 글자 반복은 통과 못 함(완성형 한글·영문 5자·3종 이상, 2026-11-24)',
    ['ㅋㅋㅋㅋㅋ', 'ㅠㅠㅠㅠㅠㅠ', '12345', '!!!!!!', '하하하하하', '가나가나가나', 'aaaaaa', 'ㅋㅋㅋ좋아요'].every(x => !N.isValid(x))
    && N.noteIssue('ㅋㅋㅋㅋㅋ') === 'letters' && N.noteIssue('하하하하하') === 'repeat' && N.noteIssue('ㅋㅋ') === 'short'
    && ['구독은 듣는 이용이다', 'license 확인', '허락받고 쓰자', '좋아요 ㅋㅋ 출원 먼저'].every(x => N.isValid(x)));
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
    items: [{ emoji: '⚖️', right: '저작권', badge: '바로 맞힘', learn: '확인 (2/2)', prompt: '질문1', hint: '힌트', note: '<b>내 글</b>' }, { emoji: '🛡️', right: '특허권', badge: '바꾸지 않음', learn: '다시 (0/2)', prompt: '질문2', hint: '힌트2', note: '' }] });
  t('product-text: 처음 판단·새 사례 적용·편별 질문·내 답·빈칸·교사 확인란', txt.includes('나의 권리 수첩') && txt.includes('10101 홍길동') && txt.includes('⚖️ 저작권 (처음 판단: 바로 맞힘 · 새 사례 적용: 확인 (2/2))')
    && txt.includes('- 질문: 질문1') && txt.includes('<b>내 글</b>') && txt.includes('(아직 적지 않음)') && txt.includes('💰 1') && (txt.match(/교사 확인: \[ \] 판단 기준을 설명함/g) || []).length === 2);
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
  R.markEpStart(g); E.chooseWrongRetry(g, 1, ep(1).choices.wrong.delta); E.chooseRight(g, 1, ep(1).choices.right.delta); Q.record(g, 1, '1/2'); E.settle(g); E.nextEp(g);
  R.markEpStart(g); E.chooseWrongAccept(g, 2, ep(2).choices.wrong.delta); Q.record(g, 2, '0/2'); E.settle(g); E.nextEp(g);
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
    x => { x.ep = 7; }, x => { x.ep = 0; }, x => { x.crisisCount = 7; }, x => { x.crisisCount = -1; }, x => { x.wrongs = [9]; }, x => { x.wrongs = ['1']; }].every(f => bad(f) === null));
  t('load: 모양이 틀린 칸 → 거부', [x => { x.badges = x.badges.slice(0, 5); }, x => { x.badges = 'full'; }, x => { x.stats = null; }, x => { x.idol = '<b>'; },
    x => { x.retryUsed = 'yes'; }, x => { x.broke = 'yes'; }, x => { x.brokeEver = 1; }, x => { x.ending = 'win'; }, x => { x.quiz = { 1: '<i>' }; }, x => { x.quiz = { 9: 'ok' }; }, x => { x.epStart.stats.money = '<b>'; }].every(f => bad(f) === null));
  t('load: 단계 값이 이상하면 거부', load(g, '<b>') === null && S.load(mem(JSON.stringify({ schemaVersion: 1, game: null, phase: 'ep' }))) === null);
  t('load: 모르는 칸은 버리고 불러옴', (r => !!r && !('evil' in r.game) && !('evil' in r.game.stats))(bad(x => { x.evil = '<b>'; x.stats.evil = 1; })));
  t('load: 깨진 JSON → null', S.load(mem('{깨짐')) === null);
  // 2026-11-20 개편 전 저장: courtCount(법정 횟수)·ending 'court'·옛 퀴즈 값 → crisisCount·'crisis'로 읽고 이어 할 수 있다
  { const o = JSON.parse(JSON.stringify(done)); delete o.crisisCount; o.courtCount = 2; o.ending = 'court'; o.quiz = { 1: 'ok', 2: 'more-ok', 3: 'missed' };
    const r = load(o, 'end');
    t('load: 옛 저장(법정 횟수·법정 엔딩·옛 퀴즈 값) → 위기 횟수·위기 엔딩으로 호환', !!r && r.game.crisisCount === 2 && r.game.ending === 'crisis' && !('courtCount' in r.game) && Q.learnAt(r.game, 2) === 'partial'); }
  // 2026-11-24: ourlog 게시물 때의 📈(postFame) — 있으면 그대로, 모양이 틀리면 거부, 없으면 옛 저장처럼
  { const x = JSON.parse(JSON.stringify(g)); x.postFame = { 1: 38, 2: 33 }; x.epStart.postFame = { 1: 38, 2: 33 };
    const r = load(x);
    t('load: postFame(게시물 때의 📈)은 그대로 불러옴', !!r && r.game.postFame[1] === 38 && r.game.epStart.postFame[2] === 33);
    t('load: postFame 모양이 틀리면 거부', [y => { y.postFame = { 9: 1 }; }, y => { y.postFame = { 1: 101 }; }, y => { y.postFame = { 1: '<b>' }; }, y => { y.postFame = [1]; }].every(f => bad(f) === null)); }
}

console.log('[이어 하기] 정산을 마친 뒤 새로 고치면 다음 EP 처음에서 (2026-11-24 플레이테스트 [2])');
{
  // main.js bridge와 같은 순서: 정답·퀴즈·정산 → nextEp → markEpStart → 저장. 그 저장으로 이어 하면 EP2 처음, 배지·점수·퀴즈 유지, 정산은 한 번
  const st = E.newGame(); R.markEpStart(st);
  E.chooseRight(st, 1, ep(1).choices.right.delta); Q.record(st, 1, '2/2'); E.settle(st);
  const after = JSON.parse(JSON.stringify(st.stats));
  E.nextEp(st); R.markEpStart(st);
  const back = R.resumePoint({ phase: 'ep', game: JSON.parse(JSON.stringify(st)) }).state;
  t('정산 뒤 이어 하기 = EP2 처음, EP1 배지·퀴즈 남음', back.ep === 2 && back.badges[0] === 'full' && back.quiz && back.quiz[1] === '2/2' && back.retryUsed === false);
  t('정산 💰+10은 한 번만(이어 한 점수 = 정산 직후 점수)', JSON.stringify(back.stats) === JSON.stringify(after) && after.money === 45, JSON.stringify(back.stats));
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
