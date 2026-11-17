/* run-probe.mjs — E2E 프로브 실행기 (루트에서 `node test/run-probe.mjs`).
   프로브 파일을 루트에 __probe.html로 복사 → 같은 오리진 정적 서버 → 헤드리스 Edge → PASS/FAIL 수확 → 정리.
   사용법:
     node test/run-probe.mjs [test/probe.html] [--budget=60000]
     node test/run-probe.mjs [프로브] --shot=<png> [--url=/index.html] [--size=W,H]   (캡처)
   종료 코드 0 = PROBE-DONE이 있고 FAIL이 없다. */
import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const EDGE = process.env.EDGE_PATH || 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const args = process.argv.slice(2);
const opt = k => { const a = args.find(x => x.startsWith('--' + k + '=')); return a ? a.slice(k.length + 3) : null; };
const probeFile = path.resolve(ROOT, args.find(a => !a.startsWith('--')) || 'test/probe.html');
const shot = opt('shot'), budget = opt('budget') || '60000';
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.png': 'image/png', '.woff2': 'font/woff2', '.json': 'application/json', '.txt': 'text/plain; charset=utf-8' };

const server = http.createServer((req, res) => {
  const p = decodeURIComponent(req.url.split('?')[0]);
  const file = path.join(ROOT, p === '/' ? 'index.html' : p);
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404); res.end('not found'); return; }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store' });
  fs.createReadStream(file).pipe(res);
});

const edge = (flags, url, profile) => new Promise(resolve => {
  execFile(EDGE, [...flags, '--disable-gpu', '--no-first-run', '--user-data-dir=' + profile, '--virtual-time-budget=' + budget, url],
    { maxBuffer: 64 * 1024 * 1024, timeout: 180000 }, (err, stdout) => resolve(stdout || ''));
});
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
    await edge(['--headless=new', '--hide-scrollbars', '--screenshot=' + out, '--window-size=' + (opt('size') || '1366,700')], base + (opt('url') || '/index.html'), tmp);
    const ok = fs.existsSync(out) && fs.statSync(out).size > 0;
    console.log(ok ? 'SHOT ' + out : 'SHOT-FAIL ' + out);
    code = ok ? 0 : 1;
  } else {
    let dom = await edge(['--headless=new', '--dump-dom'], base + '/__probe.html', tmp);
    if (!dom.includes('id="out"')) dom = await edge(['--headless', '--dump-dom'], base + '/__probe.html', tmp);   // --headless=new가 빈 출력을 줄 때
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
