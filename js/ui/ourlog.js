/* ourlog.js — 가상 SNS 앱 ourlog (정지 피드). 점수·배지·엔딩에는 손대지 않는 "보기" 전용 층.
   설계 docs/superpowers/specs/2026-11-20-ourlog-design.md §4. 문구는 data/strings.js ui.ourlog, 글은 data/ourlog.js. */
import { EPISODES } from '../../data/episodes.js';
import { STRINGS } from '../../data/strings.js';
import { OURLOG, ART_READY } from '../../data/ourlog.js';
import { feedOf, commentsFor, imageKey, followersFor, likesFor, fmtCount } from '../ourlog-feed.js';
import { esc } from './chat.js';
import { idolSVG, getIdol } from './character.js';
import { openApp } from './phone.js';

const $ = id => document.getElementById(id);
let getState = () => null;

const int = n => fmtCount(Number.isInteger(n) ? n : 0);   // 숫자는 정수 글자로만 화면에 넣는다

/* 반응 아이콘 — 직접 그린 선 모양(별 하트·말풍선 대신 달 조각 / 네모 말줄임). 장식이라 aria-hidden */
const ICON_LIKE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5l2.4 5.2 5.6.7-4.1 3.9 1.1 5.6L12 16.1 7 18.9l1.1-5.6L4 9.4l5.6-.7z"/></svg>';
const ICON_CMT = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="11" rx="3"/><path d="M8 9.5h8M8 12.5h5M9 19h6"/></svg>';

export function initOurlog(opts) {
  getState = opts.getState;
  const S = STRINGS.ui.ourlog;
  $('olLogo').textContent = S.name;
  $('olLiveText').textContent = S.live;
}

function artHTML(ep, variant, post) {
  const e = EPISODES[ep - 1];
  const emoji = `<span class="ol-emoji" aria-hidden="true">${e.rightEmoji}</span>`;
  /* ART_READY가 false면 <img>를 아예 만들지 않는다(404 요청 없음). 불러오기에 실패하면 그림만 빠지고 바탕+이모지가 남는다 */
  const img = ART_READY
    ? `<img src="assets/ourlog/${getIdol()}/${esc(imageKey(post, variant))}.webp" alt="" width="1080" height="1080" decoding="async" onerror="this.remove()">`
    : '';
  return `<div class="ol-art" data-v="${variant}">${emoji}${img}</div>`;
}

function postHTML(item, state, liveEp) {
  const S = STRINGS.ui.ourlog;
  const post = OURLOG.posts[item.ep];
  if (!post) return '';
  const fame = state.stats ? state.stats.fame : 0;
  const mode = item.ep === liveEp ? 'live' : 'later';
  const list = commentsFor(post, item.variant);
  const likes = likesFor(post, item.variant, fame, mode);
  return `<article class="ol-post" data-ep="${item.ep}" data-v="${item.variant}">
    <header class="ol-who"><span class="ol-ava ol-ava-s">${idolSVG(getIdol())}</span><b>${esc(OURLOG.account.handle)}</b><span class="ol-time">${esc(S.now)}</span></header>
    ${artHTML(item.ep, item.variant, post)}
    <div class="ol-react"><span class="ol-ic">${ICON_LIKE}<b class="ol-likes">${int(likes)}</b></span><span class="ol-ic">${ICON_CMT}<span class="ol-ccount">${esc(S.comments(Number.isInteger(list.length) ? list.length : 0))}</span></span></div>
    <p class="ol-cap">${esc(post.caption[item.variant])}</p>
    <ul class="ol-comments">${list.map(c => `<li><b>${esc(c.who)}</b> ${esc(c.text)}</li>`).join('')}</ul>
  </article>`;
}

export function renderFeed(state, liveEp) {
  const S = STRINGS.ui.ourlog;
  const feed = state ? feedOf(state) : [];
  const fame = state && state.stats ? state.stats.fame : 0;
  const head = `<section class="ol-acct"><span class="ol-ava">${idolSVG(getIdol())}</span>
    <div class="ol-acct-t"><b>${esc(OURLOG.account.handle)}</b><span>${esc(S.followers)} ${int(followersFor(fame))}</span></div></section>`;
  const body = feed.length
    ? feed.map(it => postHTML(it, state, liveEp)).join('')
    : `<p class="ol-empty">${esc(S.empty)}</p>`;
  $('olBody').innerHTML = head + body;
  $('olBody').scrollTop = 0;
  $('olLive').hidden = true;
}

/* 홈 아이콘으로 여는 정지 피드: 모든 게시물이 later 숫자, 댓글은 다 나온 상태 */
export function openFeed() {
  renderFeed(getState(), null);
  openApp('ourlog');
}
