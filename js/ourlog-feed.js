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
