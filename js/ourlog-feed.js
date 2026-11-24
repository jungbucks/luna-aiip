/* [ourlog 피드 계산] 배지 → 갈래, 댓글 목록, 좋아요·팔로워 숫자. DOM 없음 — verify가 검산한다.
   점수·배지·엔딩에는 영향을 주지 않는다(보기만 하는 연출). 설계 docs/superpowers/specs/2026-11-20-ourlog-design.md */

const VARIANT = { full: 'right', half: 'half', none: 'wrong' };

export const variantOf = badge => VARIANT[badge] || null;

/* right·wrong은 목록 그대로, half는 right 목록에 post.comments.half를 at 위치에 끼운 새 배열 */
export function commentsFor(post, variant) {
  const c = post.comments;
  if (variant !== 'half') return c[variant].slice();
  const list = c.right.slice();
  [...c.half].sort((a, b) => a.at - b.at).forEach(h => list.splice(h.at, 0, { who: h.who, text: h.text }));
  return list;
}

/* half는 right 그림 */
export const imageKey = (post, variant) => post.img[variant === 'half' ? 'right' : variant];

/* 캡션: half 글이 없으면 right 글. 값이 문자열이 아니면 빈 글 — 화면에 undefined·null이 나오지 않게(2026-11-24 플레이테스트 [1]) */
export function captionFor(post, variant) {
  const c = post && post.caption ? post.caption : {};
  const v = variant === 'half' && typeof c.half !== 'string' ? 'right' : variant;
  return typeof c[v] === 'string' ? c[v] : '';
}

/* 게시물을 올린 때의 📈를 그 편에 적어 둔다(알림 카드가 뜨는 순간 = 게시물이 올라온 순간). 지난 게시물 좋아요가 지금 📈로 다시 계산되지 않게(플레이테스트 [7]) */
export function recordPost(state, ep) {
  if (!state || !state.stats || !Number.isInteger(state.stats.fame)) return;
  state.postFame = { ...(state.postFame || {}), [ep]: state.stats.fame };
}

/* 그 게시물의 📈: 적어 둔 값, 없으면(옛 저장·아직 안 올린 편) 지금 📈 */
export function fameAt(state, ep) {
  const v = state && state.postFame ? state.postFame[ep] : undefined;
  if (Number.isInteger(v)) return v;
  return state && state.stats && Number.isInteger(state.stats.fame) ? state.stats.fame : 0;
}

/* 📈 0~100 → 팔로워. 오르면 늘고 내리면 준다 */
export function followersFor(fame) {
  const f = Math.max(0, Math.min(100, Math.round(Number(fame) || 0)));
  return 2000 + f * 800;
}

/* 좋아요 = 팔로워 × 12% × 갈래 배율(live: 막 올렸을 때 / later: 나중에 다시 볼 때) */
export function likesFor(post, variant, fame, mode) {
  return Math.round(followersFor(fame) * 0.12 * post.likes[mode][variant]);
}

/* 배지가 있는 EP만, 최신(큰 ep) 먼저 */
export function feedOf(state) {
  return state.badges
    .map((b, i) => ({ ep: i + 1, variant: variantOf(b) }))
    .filter(x => x.variant !== null)
    .reverse();
}

/* 1만 미만 1,234 / 1만 이상 2.4만(.0 생략) */
export function fmtCount(n) {
  if (n < 10000) return n.toLocaleString('en-US');
  return String(Math.round(n / 1000) / 10) + '만';
}
