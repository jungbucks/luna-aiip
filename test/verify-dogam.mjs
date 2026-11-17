/* verify-dogam.mjs — 쟁점 도감 데이터 정합. node test/verify-dogam.mjs */
import { ISSUES, STATUS_META, GLOSSARY } from '../data/issues.js';
import { EPISODES } from '../data/episodes.js';

let fail = 0;
const check = (name, ok) => { console.log((ok ? 'PASS' : 'FAIL') + ' ' + name); if (!ok) fail++; };

const RIGHTS = ['저작권', '특허권', '상표권', '영업비밀'];
const STATUSES = ['ongoing', 'partial', 'varies', 'strategy'];

check('쟁점 12개', ISSUES.length === 12);
check('id 유일', new Set(ISSUES.map(i => i.id)).size === 12);
check('필수 필드', ISSUES.every(i => i.id && i.right && i.rightEmoji && i.title && i.hook && i.think && i.realCase && i.realCase.name));
check('right 값 유효', ISSUES.every(i => RIGHTS.includes(i.right)));
check('권리 분포 저작권4·특허2·상표3·영업비밀3',
  RIGHTS.map(r => ISSUES.filter(i => i.right === r).length).join(',') === '4,2,3,3');
check('sides 2~3개, 각 points≥2', ISSUES.every(i => Array.isArray(i.sides) && i.sides.length >= 2 && i.sides.length <= 3 && i.sides.every(s => s.label && s.stance && Array.isArray(s.points) && s.points.length >= 2)));
check('status 값 유효', ISSUES.every(i => STATUSES.includes(i.status)));
check('sources ≥1 (label·url)', ISSUES.every(i => Array.isArray(i.sources) && i.sources.length >= 1 && i.sources.every(s => s.label && /^https?:\/\//.test(s.url))));
check('STATUS_META 4종(배지·이름·뜻)', STATUSES.every(k => STATUS_META[k] && STATUS_META[k].emoji && STATUS_META[k].label && STATUS_META[k].desc));
check('배지 이모지 서로 다름·게임 저작권 기호(⚖️) 안 씀', new Set(STATUSES.map(k => STATUS_META[k].emoji)).size === 4 && STATUSES.every(k => STATUS_META[k].emoji !== '⚖️'));
// 권리 이모지는 게임과 같게 (2026-11-17 평가 v2: 게임 ⚖️=저작권인데 도감 ⚖️=판결이었다)
const gameEmoji = Object.fromEntries(EPISODES.map(e => [e.right, e.rightEmoji]));
check('권리 이모지 = 게임 이모지', ISSUES.every(i => gameEmoji[i.right] === i.rightEmoji));
check('사례 나라(where) 필드', ISSUES.every(i => typeof i.realCase.where === 'string'));
// 낱말 풀이: 쓰이지 않는 풀이 없음, 짧게
const allText = ISSUES.map(i => [i.hook, i.think, i.realCase.gist, ...i.sides.flatMap(s => [s.label, s.stance, ...s.points])].join(' ')).join(' ');
check('낱말 풀이: 모든 낱말이 카드 글에 나옴', GLOSSARY.every(g => allText.includes(g.term)));
check('낱말 풀이: 풀이 80자 이하', GLOSSARY.every(g => g.def.length <= 80));

const text = ISSUES.map(i => [i.title, i.hook, i.think, i.realCase.gist, ...i.sides.flatMap(s => [s.stance, ...s.points])].join(' ')).join(' ');
check('단정 금칙어 없음', !/(정답은|무조건|반드시 승소|반드시 이긴다)/.test(text));
// 진행 중·나라마다 다름 카드가 결론 난 것처럼 쓰지 않기 (2026-11-17 검증: Gemini 사건을 '구글 승소·판결'로 잘못 적었던 일)
const VERDICT = /(손을 들어줬다|승소했다|확정됐다|확정되었다|최종 판결이 나왔다)/;
check('미결 카드 요지에 결론 단정 없음', ISSUES.filter(i => i.status !== 'partial').every(i => !VERDICT.test(i.realCase.gist)));
// 사례 칸 길이 (2026-11-17 평가 2회차: 사실을 보강하다 평균 135→242자로 늘어 고교생이 읽기 어려워졌던 일)
const sentences = g => g.split(/(?<=[.?!])\s+/);
check('사례 칸 200자 이하', ISSUES.every(i => i.realCase.gist.length <= 200));
check('사례 문장 80자 이하', ISSUES.every(i => sentences(i.realCase.gist).every(s => s.length <= 80)));
check('사례 칸 괄호 1개 이하', ISSUES.every(i => (i.realCase.gist.match(/\(/g) || []).length <= 1));
check('미결 카드 출처 이름에 "승소" 없음', ISSUES.filter(i => i.status !== 'partial').every(i => i.sources.every(s => !/승소/.test(s.label))));

console.log(fail === 0 ? '== 전체 PASS ==' : `== FAIL ${fail}건 ==`);
process.exit(fail === 0 ? 0 : 1);
