/* verify-dogam.mjs — 쟁점 도감 데이터 정합. node test/verify-dogam.mjs */
import { ISSUES, STATUS_META } from '../data/issues.js';

let fail = 0;
const check = (name, ok) => { console.log((ok ? 'PASS' : 'FAIL') + ' ' + name); if (!ok) fail++; };

const RIGHTS = ['저작권', '특허권', '상표권', '영업비밀'];
const STATUSES = ['decided', 'ongoing', 'varies'];

check('쟁점 12개', ISSUES.length === 12);
check('id 유일', new Set(ISSUES.map(i => i.id)).size === 12);
check('필수 필드', ISSUES.every(i => i.id && i.right && i.rightEmoji && i.title && i.hook && i.think && i.realCase && i.realCase.name));
check('right 값 유효', ISSUES.every(i => RIGHTS.includes(i.right)));
check('권리 분포 저작권4·특허2·상표3·영업비밀3',
  RIGHTS.map(r => ISSUES.filter(i => i.right === r).length).join(',') === '4,2,3,3');
check('sides 2~3개, 각 points≥2', ISSUES.every(i => Array.isArray(i.sides) && i.sides.length >= 2 && i.sides.length <= 3 && i.sides.every(s => s.label && s.stance && Array.isArray(s.points) && s.points.length >= 2)));
check('status 값 유효', ISSUES.every(i => STATUSES.includes(i.status)));
check('sources ≥1 (label·url)', ISSUES.every(i => Array.isArray(i.sources) && i.sources.length >= 1 && i.sources.every(s => s.label && /^https?:\/\//.test(s.url))));
check('STATUS_META 3종', ['decided', 'ongoing', 'varies'].every(k => STATUS_META[k] && STATUS_META[k].emoji && STATUS_META[k].label));

const text = ISSUES.map(i => [i.title, i.hook, i.think, i.realCase.gist, ...i.sides.flatMap(s => [s.stance, ...s.points])].join(' ')).join(' ');
check('단정 금칙어 없음', !/(정답은|무조건|반드시 승소|반드시 이긴다)/.test(text));

console.log(fail === 0 ? '== 전체 PASS ==' : `== FAIL ${fail}건 ==`);
process.exit(fail === 0 ? 0 : 1);
