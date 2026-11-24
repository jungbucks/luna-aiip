/* ourlog.js — 가상 SNS 앱 ourlog. 점수·배지·엔딩에는 손대지 않는 "보기" 전용 층.
   · 정지 피드(홈 아이콘): 모든 게시물이 later 숫자, 댓글이 다 나온 상태
   · 알림 카드(offer): 수첩 적기 뒤·정산 앞. [열기]면 그 편 게시물에 반응이 실시간처럼 붙고(openLive), 앱을 닫아야 onDone(정산)
   설계 docs/superpowers/specs/2026-11-20-ourlog-design.md §1·§4·§6. 문구는 data/strings.js ui.ourlog, 글은 data/ourlog.js. */
import { EPISODES } from '../../data/episodes.js';
import { STRINGS } from '../../data/strings.js';
import { OURLOG, ART_READY } from '../../data/ourlog.js';
import { feedOf, commentsFor, imageKey, captionFor, followersFor, likesFor, fmtCount, variantOf, recordPost, fameAt } from '../ourlog-feed.js';
import { esc } from './chat.js';
import { idolSVG, getIdol, IDOLS } from './character.js';
import { openApp, isOpen, onceClosed } from './phone.js';

const $ = id => document.getElementById(id);
let getState = () => null;

const int = n => fmtCount(Number.isInteger(n) ? n : 0);   // 숫자는 정수 글자로만 화면에 넣는다
const LIVE_MS = 700;                                       // 댓글 하나가 붙는 간격
const HEART_MS = 1300;                                     // 떠오르는 별 하나가 사는 시간(css olFloat와 같게)
/* 움직임 줄이기면 처음부터 끝 상태. window.__olForceMotion = 검사 페이지(test/probe.html)만 쓰는 표시 —
   run-probe가 움직임 줄이기를 강제하므로 재생 경로를 볼 때만 켠다 */
const reduced = () => !window.__olForceMotion && matchMedia('(prefers-reduced-motion: reduce)').matches;

/* 반응 아이콘 — 직접 그린 선 모양(별 하트·말풍선 대신 달 조각 / 네모 말줄임). 장식이라 aria-hidden */
const STAR = 'M12 3.5l2.4 5.2 5.6.7-4.1 3.9 1.1 5.6L12 16.1 7 18.9l1.1-5.6L4 9.4l5.6-.7z';
const ICON_LIKE = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${STAR}"/></svg>`;
const ICON_CMT = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="11" rx="3"/><path d="M8 9.5h8M8 12.5h5M9 19h6"/></svg>';

export function initOurlog(opts) {
  getState = opts.getState;
  const S = STRINGS.ui.ourlog;
  $('olLogo').textContent = S.name;
  $('olLiveText').textContent = S.live;
  $('olNTitle').textContent = S.notifyTitle;
  $('olNText').textContent = S.notifyText;
  $('olOpen').textContent = S.open;
  $('olSkip').textContent = S.skip;
  $('olTapAll').textContent = S.tapAll;
  $('olBody').addEventListener('click', finishLive);       // 화면을 누르면 남은 반응이 한 번에(채팅의 빨리 감기와 같은 문법)
  $('olTapAll').addEventListener('click', finishLive);     // 머리줄 단추 — 키보드로도(‹는 앱을 닫고 정산으로 간다)
  document.addEventListener('keydown', onNoticeKey, true);   // 잡기 단계 — 팝업의 키 처리기보다 먼저
}

function artHTML(ep, variant, post) {
  const e = EPISODES[ep - 1];
  const emoji = `<span class="ol-emoji" aria-hidden="true">${e.rightEmoji}</span>`;
  /* ART_READY가 false면 <img>를 아예 만들지 않는다(404 요청 없음). 아이돌 칸은 알려진 값(sol/luna)일 때만 경로에 쓴다.
     불러오기에 실패하면 그 칸의 그림만 빠지고 바탕+이모지가 남는다 */
  const idol = getIdol();
  const key = imageKey(post, variant);
  const alt = Object.hasOwn(OURLOG.alt, key) ? OURLOG.alt[key] : '';   // 그림이 곧 수업 내용(EP5 얼굴·EP6 닮은꼴) — 키마다 짧은 설명
  const img = ART_READY && Object.hasOwn(IDOLS, idol)
    ? `<img src="assets/ourlog/${idol}/${esc(key)}.webp" alt="${esc(alt)}" loading="lazy" decoding="async" onerror="this.remove()">`
    : '';
  return `<div class="ol-art" data-v="${variant}">${emoji}${img}</div>`;
}

/* 프로필 사진: 옆에 아이디가 있으니 장식(alt="") — 피드에 같은 이름이 7번 읽히지 않게 */
const avatar = () => idolSVG(getIdol(), 'neutral', { decorative: true });

/* newest: 피드 맨 위(= 알림으로 연 그 편)만 "방금", 지난 게시물은 편 이름 */
function postHTML(item, state, liveEp, newest) {
  const S = STRINGS.ui.ourlog;
  const post = OURLOG.posts[item.ep];
  if (!post) return '';
  const mode = item.ep === liveEp ? 'live' : 'later';
  const list = commentsFor(post, item.variant);
  const likes = likesFor(post, item.variant, fameAt(state, item.ep), mode);   // 올린 때의 📈(지난 게시물이 지금 📈로 다시 계산되지 않게)
  const when = newest ? S.now : S.epTime(Number.isInteger(item.ep) ? item.ep : 0);
  return `<article class="ol-post" data-ep="${item.ep}" data-v="${item.variant}">
    <header class="ol-who"><span class="ol-ava ol-ava-s">${avatar()}</span><b>${esc(OURLOG.account.handle)}</b><span class="ol-time">${esc(when)}</span></header>
    ${artHTML(item.ep, item.variant, post)}
    <div class="ol-react"><span class="ol-ic">${ICON_LIKE}<b class="ol-likes">${int(likes)}</b></span><span class="ol-ic">${ICON_CMT}<span class="ol-ccount">${esc(S.comments(Number.isInteger(list.length) ? list.length : 0))}</span></span></div>
    <p class="ol-cap">${esc(captionFor(post, item.variant))}</p>
    <ul class="ol-comments">${list.map(c => `<li><b>${esc(c.who)}</b> ${esc(c.text)}</li>`).join('')}</ul>
    ${newest ? `<p class="ol-think">${esc(S.think)}</p>` : ''}
  </article>`;
}

/* liveEp: 알림으로 연 그 편(그 게시물만 live 숫자). 그 게시물이 피드에 있고 움직일 수 있을 때만 LIVE 점을 켠다 */
export function renderFeed(state, liveEp) {
  stopLive();
  const S = STRINGS.ui.ourlog;
  const feed = state ? feedOf(state) : [];
  const fame = state && state.stats ? state.stats.fame : 0;
  const head = `<section class="ol-acct"><span class="ol-ava">${avatar()}</span>
    <div class="ol-acct-t"><b>${esc(OURLOG.account.handle)}</b><span>${esc(S.followers)} ${int(followersFor(fame))}</span></div></section>`;
  const body = feed.length
    ? feed.map((it, i) => postHTML(it, state, liveEp, i === 0)).join('')
    : `<p class="ol-empty">${esc(S.empty)}</p>`;
  $('olBody').innerHTML = head + body;
  $('olBody').scrollTop = 0;
  $('olLive').hidden = !(liveEp && feed.some(it => it.ep === liveEp) && !reduced());
}

/* 홈 아이콘으로 여는 정지 피드: 모든 게시물이 later 숫자, 댓글은 다 나온 상태 */
export function openFeed() {
  renderFeed(getState(), null);
  openApp('ourlog');
}

/* ── 실시간 재생 ── 렌더된 끝 상태에서 댓글을 떼어 두었다가 하나씩 다시 붙인다. 타이머는 이 객체 하나에만 */
let live = null;   // { art, ul, items, shown, likesEl, countEl, target, top, timer, hearts:Set }

function startLive(ep) {
  const art = $('olBody').querySelector(`.ol-post[data-ep="${ep}"]`);
  if (!art || reduced()) { $('olLive').hidden = true; return; }
  const ul = art.querySelector('.ol-comments'), likesEl = art.querySelector('.ol-likes'), countEl = art.querySelector('.ol-ccount');
  const post = OURLOG.posts[ep], state = getState();
  const target = likesFor(post, art.dataset.v, fameAt(state, ep), 'live');
  const items = [...ul.children];
  items.forEach(li => li.remove());
  live = { art, ul, items, shown: 0, likesEl, countEl, target, top: $('olBody').scrollTop, timer: 0, hearts: new Set() };
  $('olTapAll').hidden = false;                            // 머리줄 — 본문이 아래로 따라가도 늘 보인다
  paint();
  live.timer = setInterval(step, LIVE_MS);
}

/* 새 댓글이 본문 화면 아래로 빠지면 그만큼 본문만 내린다(scrollIntoView는 기기 틀·페이지까지 움직일 수 있어 쓰지 않는다).
   학생이 재생 중에 본문을 움직였으면(마지막으로 맞춘 자리가 아니고 맨 아래도 아니면) 따라가지 않는다 — 다시 맨 아래로 오면 다시 따라간다.
   움직임 줄이기면 재생 자체가 없으므로(끝 상태) 여기에 오지 않는다 */
function follow(li) {
  const body = $('olBody');
  const atBottom = body.scrollTop + body.clientHeight >= body.scrollHeight - li.offsetHeight - 12;   // 방금 붙인 댓글(+목록 간격) 직전까지 맨 아래였는가
  if (Math.abs(body.scrollTop - live.top) > 2 && !atBottom) return;
  /* 화면 좌표(getBoundingClientRect) 차이를 본문 배율로 나눠 CSS px로 — 앱 층이 열리는 scale() 전환 중이어도 맞게 */
  const box = body.getBoundingClientRect(), s = box.height / body.offsetHeight || 1;
  const gap = (li.getBoundingClientRect().bottom - box.top) / s - (body.clientTop + body.clientHeight);
  if (gap > 0) body.scrollTop += Math.ceil(gap) + 8;
  live.top = body.scrollTop;
}

function paint() {
  const S = STRINGS.ui.ourlog, total = live.items.length;
  live.likesEl.textContent = int(total ? Math.round(live.target * live.shown / total) : live.target);
  live.countEl.textContent = S.comments(live.shown);
}

function step() {
  if (!live) return;
  const li = live.items[live.shown];
  live.ul.appendChild(li);
  live.shown++;
  paint();
  follow(li);
  heart();
  if (live.shown >= live.items.length) endLive();
}

/* 떠오르는 별: 그림 오른쪽 아래에서. 정해진 시간 뒤 스스로 지운다(애니메이션이 꺼진 환경에서도 남지 않게) */
function heart() {
  const h = document.createElement('span');
  h.className = 'ol-heart';
  h.setAttribute('aria-hidden', 'true');
  h.style.setProperty('--dx', (Math.round(Math.random() * 40) - 26) + 'px');
  h.innerHTML = `<svg viewBox="0 0 24 24"><path d="${STAR}"/></svg>`;
  live.art.querySelector('.ol-art').appendChild(h);
  const t = setTimeout(() => { h.remove(); if (live) live.hearts.delete(t); }, HEART_MS);
  live.hearts.add(t);
}

/* "모두 보기" 단추를 숨긴다. 초점이 그 단추에 있었으면 ‹로(숨은 단추에 초점이 남아 사라지지 않게) */
function hideTap() {
  const tap = $('olTapAll');
  if (tap.hidden) return;
  const had = document.activeElement === tap;
  tap.hidden = true;
  if (had) $('olBack').focus({ preventScroll: true });
}

/* 다 나왔다: LIVE 점·"모두 보기"를 끈다. 이미 떠오른 별은 제 시간에 사라진다 */
function endLive() {
  clearInterval(live.timer);
  live.timer = 0;
  hideTap();
  live.likesEl.textContent = int(live.target);
  $('olLive').hidden = true;
}

/* 본문이나 머리줄 단추를 누르면 남은 댓글이 한 번에 다 나온다(본문은 그 자리 그대로 — 학생이 내려 읽는다) */
function finishLive() {
  if (!live || !live.timer) return;
  while (live.shown < live.items.length) live.ul.appendChild(live.items[live.shown++]);
  paint();
  live.hearts.forEach(clearTimeout);
  live.art.querySelectorAll('.ol-heart').forEach(h => h.remove());
  live.hearts.clear();
  endLive();
}

/* 앱이 닫히거나 피드를 다시 그릴 때: 타이머·별을 모두 지운다(남은 댓글은 붙이지 않는다 — 다시 열면 새로 그린다) */
function stopLive() {
  if (!live) return;
  clearInterval(live.timer);
  live.hearts.forEach(clearTimeout);
  live.art.querySelectorAll('.ol-heart').forEach(h => h.remove());
  live = null;
  $('olTapAll').hidden = true;
  $('olLive').hidden = true;
}

/* 그 편 게시물을 실시간으로 연다. 앱이 닫히면(‹·방문 기록 뒤로 가기 모두) 타이머를 지우고 onDone 한 번 */
export function openLive(state, ep, onDone) {
  renderFeed(state, ep);
  openApp('ourlog');
  const ok = isOpen('ourlog') && onceClosed('ourlog', () => { stopLive(); onDone(); });
  if (!ok) { stopLive(); onDone(); return; }   // 열리지 못했으면 기다리지 않고 다음으로(흐름이 멈추지 않게)
  startLive(ep);
}

/* ── 알림 카드 ── 떠 있는 동안 #app의 다른 자식(카드·팝업 제외)은 inert. Tab은 두 단추 안에서, ESC = [넘어가기] */
let noticeOpen = false;

function setNoticeInert(on) {
  [...$('app').children].forEach(el => { if (el.id !== 'olNotice' && el.id !== 'popup') el.toggleAttribute('inert', on); });
}

function hideNotice() {
  noticeOpen = false;
  $('olNotice').hidden = true;
  setNoticeInert(false);
}

function onNoticeKey(e) {
  if (!noticeOpen) return;
  /* ESC = [넘어가기]. 같은 키가 곧이어 뜨는 정산 팝업의 ESC 처리기(popup.js)에 닿아 [다음 EP 시작]까지 누르지 않게 여기서 멈춘다 */
  if (e.key === 'Escape') { e.preventDefault(); e.stopImmediatePropagation(); $('olSkip').click(); return; }
  if (e.key !== 'Tab') return;
  const f = [$('olOpen'), $('olSkip')].filter(b => !b.disabled);
  if (!f.length) { e.preventDefault(); return; }
  const i = f.indexOf(document.activeElement);
  if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
  else if (!e.shiftKey && (i === -1 || i === f.length - 1)) { e.preventDefault(); f[0].focus(); }
}

export function offer(state, { onDone }) {
  const S = STRINGS.ui.ourlog;
  const post = OURLOG.posts[state.ep], variant = variantOf(state.badges[state.ep - 1]);
  if (!post || !variant) { onDone(); return; }             // 게시물이 없으면 알림도 없이 다음으로
  recordPost(state, state.ep);                             // 지금 올라온 게시물 — 열든 넘어가든 이때의 📈로 좋아요를 센다(정산이 저장한다)
  $('olNCount').textContent = S.newComments(commentsFor(post, variant).length);
  const open = $('olOpen'), skip = $('olSkip');
  let used = false;                                        // 두 단추 모두 한 번 누르면 잠긴다(연타 방지)
  const once = fn => () => {
    if (used) return;
    used = true;
    open.disabled = skip.disabled = true;
    hideNotice();
    fn();
  };
  open.onclick = once(() => openLive(state, state.ep, onDone));
  skip.onclick = once(onDone);
  open.disabled = skip.disabled = false;
  noticeOpen = true;
  $('olNotice').hidden = false;
  setNoticeInert(true);
  open.focus({ preventScroll: true });
}
