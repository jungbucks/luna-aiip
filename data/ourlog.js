/* [데이터] ourlog 팬 반응 글 — 가상 SNS 앱(설계 docs/superpowers/specs/2026-11-20-ourlog-design.md §3).
   ⚠️ 교사 검수 대기: 캡션·댓글 문구 전부(팬 말투, 점잖은 비판만, 40자 이하, 실존 계정 닮은 아이디 금지).
   이름은 {N}/{n} 토큰 — 하드코딩 금지. 아이디는 지어낸 영문 소문자.
   likes: live = 알림으로 막 열었을 때(오답이 더 터짐), later = 지난 게시물로 다시 볼 때(역풍 반영, 오답이 덜함).
   half.at = right 목록에 끼워 넣은 뒤의 자리(0부터). posts에는 EP별 글이 들어간다(EP2~6은 다음 작업). */

export const ART_READY = false;   // 그림(assets/ourlog) 납품 전엔 그라데이션 바탕 + 권리 이모지

export const OURLOG = {
  account: { handle: '{N}_official', bio: '{N}의 공식 계정' },
  posts: {
    1: {
      img: { right: 'ep1', wrong: 'ep1' },
      caption: {
        right: '데뷔곡이 나왔어요. 허락받은 음원으로 한 달을 더 다듬었어요 🎵',
        wrong: '데뷔곡이 나왔어요. 처음 들려드리는 노래예요 🎵',
      },
      comments: {
        right: [
          { who: 'moon_1004', text: '드디어 나왔다ㅠㅠ 기다린 보람 있어' },
          { who: 'haneul_bbang', text: '첫 소절부터 귀에 쏙 들어와요 🎧' },
          { who: 'cloud.nine', text: '한 달 기다리느라 목 빠지는 줄 알았어요' },
          { who: 'dalgom_92', text: '믿고 기다렸더니 이렇게 좋은 노래가' },
          { who: 'sora_note', text: '허락받은 음원이라 마음 편히 들어요' },
          { who: 'pinkdot77', text: '후렴 계속 흥얼거리는 중ㅋㅋ' },
          { who: 'winter_ij', text: '늦어진 건 아쉬웠지만 들으니 이해돼요' },
          { who: 'bori_tea', text: '데뷔 축하해요! 오래 응원할게요 💜' },
        ],
        wrong: [
          { who: 'moon_1004', text: '노래 미쳤다ㅋㅋ 벌써 열 번째 듣는 중' },
          { who: 'haneul_bbang', text: '데뷔곡부터 이런 퀄리티라니 🔥' },
          { who: 'cloud.nine', text: '후렴 중독성 대박이에요' },
          { who: 'dalgom_92', text: '작곡가 누구예요? 궁금해요' },
          { who: 'pinkdot77', text: '친구한테 바로 공유했어요 🎧' },
          { who: 'sora_note', text: '후렴 어디서 들어 본 것 같은데..?' },
          { who: 'winter_ij', text: '그 노래랑 진행이 비슷하지 않아요?' },
          { who: 'bori_tea', text: '좋긴 한데 어디서 가져온 건지 궁금해요' },
          { who: 'nuri_log', text: '출처 설명이 있으면 좋겠어요' },
        ],
        half: [
          { at: 2, who: 'jam_jam01', text: '처음 공지 땐 좀 불안했는데 다행이에요' },
          { at: 6, who: 'ddoong_e', text: '결국 잘 풀려서 다행이다 싶어요' },
        ],
      },
      likes: {
        live: { right: 1.0, half: 0.9, wrong: 1.3 },
        later: { right: 1.0, half: 0.9, wrong: 0.6 },
      },
    },
  },
};
