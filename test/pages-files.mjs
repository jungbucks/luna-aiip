/* pages-files.mjs — GitHub Pages(Jekyll 기본 빌드)가 올릴 파일 목록을 흉내 낸다(보안 검토 2026-11-18 A).
   규칙: 저장소에 추적되는 파일 중
     ① 경로의 어느 칸이든 '.'·'_'로 시작하면 빠진다(Jekyll 기본 — _config.yml·__probe.html 포함)
     ② 루트 _config.yml의 exclude 목록에 걸리면 빠진다(그 이름 자체이거나 그 폴더 아래)
   진짜 Jekyll 빌드가 아니라 그 규칙의 근사다 — 실제 결과는 배포 뒤 주소로 확인할 것.
   verify.mjs(배포 범위 검사)와 run-probe.mjs --pages(배포될 파일만 서빙)가 같이 쓴다. */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/* 배포해도 되는 것: 게임·도감 페이지와 그 자산 */
export const ALLOWED = ['index.html', 'dogam.html', 'css/', 'js/', 'data/', 'assets/'];

/* _config.yml의 exclude 목록(간단한 "- 항목" 목록만 읽는다) */
export function excludes() {
  const f = path.join(ROOT, '_config.yml');
  if (!fs.existsSync(f)) return [];
  const out = [];
  let inEx = false;
  for (const line of fs.readFileSync(f, 'utf8').split(/\r?\n/)) {
    if (/^\S/.test(line)) { inEx = /^exclude\s*:/.test(line); continue; }
    const m = inEx && line.match(/^\s+-\s*["']?([^"'#]+?)["']?\s*(#.*)?$/);
    if (m) out.push(m[1].replace(/\/$/, ''));
  }
  return out;
}

/* 저장소에 추적되는 파일(git이 없으면 폴더를 훑는다) */
export function trackedFiles() {
  try {
    return execFileSync('git', ['ls-files', '-z'], { cwd: ROOT, encoding: 'utf8' }).split('\0').filter(Boolean);
  } catch (e) {
    const walk = d => fs.readdirSync(path.join(ROOT, d), { withFileTypes: true }).flatMap(x => {
      const p = d ? d + '/' + x.name : x.name;
      if (x.name === '.git') return [];
      return x.isDirectory() ? walk(p) : [p];
    });
    return walk('');
  }
}

export function isPublished(rel, ex = excludes()) {
  if (rel.split('/').some(seg => seg.startsWith('.') || seg.startsWith('_'))) return false;
  return !ex.some(e => rel === e || rel.startsWith(e + '/'));
}

export function publishedFiles() {
  const ex = excludes();
  return trackedFiles().filter(f => isPublished(f, ex)).sort();
}
