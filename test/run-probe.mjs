/* run-probe.mjs — E2E 프로브 실행기 (루트에서 `node test/run-probe.mjs`).
   프로브 파일을 루트에 __probe.html로 복사 → 같은 오리진 정적 서버 → 헤드리스 Edge → PASS/FAIL 수확 → 정리.
   사용법:
     node test/run-probe.mjs [test/probe.html] [--budget=60000]
     node test/run-probe.mjs [프로브] --shot=<png> [--url=/index.html] [--size=W,H]   (캡처)
   헤드리스에서는 CSS 전환·애니메이션이 프레임 없이 멈춰 있어(층이 scale(.1)·opacity 0인 채) 배치 검사가 거짓이 된다.
   그래서 기본으로 "움직임 줄이기"를 강제해 끝 상태를 바로 그린다. 움직임 경로를 보려면 --motion.
   종료 코드 0 = PROBE-DONE이 있고 FAIL이 없다.
   보안 검토 2026-11-18 A: 테스트 페이지는 자동화 브라우저(navigator.webdriver) + ?probe=1에서만 게임 저장을 만진다.
   이 실행기가 --enable-automation과 ?probe=1을 붙이고, 매번 새 임시 프로필(--user-data-dir)로 띄웠다가 지운다 —
   평소 쓰는 브라우저의 게임 기록에는 닿지 않는다.
     --pages   GitHub Pages에 올라갈 파일만 서빙(test/pages-files.mjs) — 배포본만으로 게임·도감이 도는지 본다 */
import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { publishedFiles } from './pages-files.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const EDGE = process.env.EDGE_PATH || 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const args = process.argv.slice(2);
const opt = k => { const a = args.find(x => x.startsWith('--' + k + '=')); return a ? a.slice(k.length + 3) : null; };
const probeFile = path.resolve(ROOT, args.find(a => !a.startsWith('--')) || 'test/probe.html');
const shot = opt('shot'), budget = opt('budget') || '60000';
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.png': 'image/png', '.woff2': 'font/woff2', '.json': 'application/json', '.txt': 'text/plain; charset=utf-8' };

const PAGES = args.includes('--pages') ? new Set(publishedFiles()) : null;
const server = http.createServer((req, res) => {
  const p = decodeURIComponent(req.url.split('?')[0]);
  const file = path.join(ROOT, p === '/' ? 'index.html' : p);
  const rel = path.relative(ROOT, file).split(path.sep).join('/');
  if (PAGES && rel !== '__probe.html' && !PAGES.has(rel)) { res.writeHead(404); res.end('not published'); return; }
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404); res.end('not found'); return; }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store' });
  fs.createReadStream(file).pipe(res);
});

const edge = (flags, url, profile) => new Promise(resolve => {
  execFile(EDGE, [...flags, '--disable-gpu', '--no-first-run', '--enable-automation', ...(args.includes('--motion') ? [] : ['--force-prefers-reduced-motion']), '--user-data-dir=' + profile, '--virtual-time-budget=' + budget, url],
    { maxBuffer: 64 * 1024 * 1024, timeout: 180000 }, (err, stdout) => resolve(stdout || ''));
});
const withFlag = u => u + (u.includes('?') ? '&' : '?') + 'probe=1';   // 테스트 페이지 가드를 여는 표시
const unesc = s => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'luna-probe-'));
const copy = path.join(ROOT, '__probe.html');
let code = 1;
try {
  fs.copyFileSync(probeFile, copy);
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const base = 'http://127.0.0.1:' + server.address().port;
  if (shot) {
    const out = path.resolve(shot);
    await edge(['--headless=new', '--hide-scrollbars', '--screenshot=' + out, '--window-size=' + (opt('size') || '1366,700')], base + withFlag(opt('url') || '/index.html'), tmp);
    const ok = fs.existsSync(out) && fs.statSync(out).size > 0;
    console.log(ok ? 'SHOT ' + out : 'SHOT-FAIL ' + out);
    code = ok ? 0 : 1;
  } else {
    const url = withFlag(base + '/__probe.html');
    let dom = await edge(['--headless=new', '--dump-dom'], url, tmp);
    if (!dom.includes('id="out"')) dom = await edge(['--headless', '--dump-dom'], url, tmp);   // --headless=new가 빈 출력을 줄 때
    const m = dom.match(/<pre id="out">([\s\S]*?)<\/pre>/);
    const text = m ? unesc(m[1]) : '';
    const lines = text.split('\n').filter(Boolean);
    const fails = lines.filter(l => l.startsWith('FAIL'));
    const passes = lines.filter(l => l.startsWith('PASS'));
    lines.forEach(l => { if (!l.startsWith('PASS') || args.includes('--all')) console.log(l); });
    const done = text.includes('PROBE-DONE');
    console.log(`── PASS ${passes.length} / FAIL ${fails.length}${done ? '' : ' / PROBE-DONE 없음(중간에 멈춤)'}`);
    code = done && !fails.length ? 0 : 1;
  }
} finally {
  try { fs.unlinkSync(copy); } catch (e) {}
  server.close();
  try { fs.rmSync(tmp, { recursive: true, force: true }); } catch (e) {}
}
process.exit(code);
