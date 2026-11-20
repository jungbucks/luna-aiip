/* [데이터] ourlog 팬 반응 글 — 가상 SNS 앱(설계 docs/superpowers/specs/2026-11-20-ourlog-design.md §3).
   ⚠️ 교사 검수 대기: 캡션·댓글 문구 전부(팬 말투, 점잖은 비판만, 40자 이하, 실존 계정 닮은 아이디 금지).
   이름은 {N}/{n} 토큰 — 하드코딩 금지. 아이디는 지어낸 영문 소문자.
   likes: live = 알림으로 막 열었을 때(오답이 더 터짐), later = 지난 게시물로 다시 볼 때(역풍 반영, 오답이 덜함).
   half.at = right 목록에 끼워 넣은 뒤의 자리(0부터). posts에는 EP별 글이 들어간다. */

export const ART_READY = true;    // 그림(assets/ourlog) 16장 납품됨(2026-11-20). 없거나 불러오기 실패한 칸은 그라데이션 바탕 + 권리 이모지

export const OURLOG = {
  account: { handle: '{N}_official' },
  /* 그림 키마다 짧은 설명(<img alt>). EP5·6은 그림이 곧 수업 내용(팬 얼굴·닮은꼴 광고). 이름 하드코딩 금지 */
  alt: {
    ep1: '녹음실 문 앞에서 헤드폰을 목에 걸고 찍은 셀카',
    ep2: '작은 무대에서 립싱크 기술을 시연하는 사진',
    ep3: '새 공식 로고 마크 옆에서 찍은 사진',
    ep4: '좁은 사무실에서 팀이 새 노래를 준비하는 모습',
    ep5: '팬들의 얼굴이 그대로 보이는 팬미팅 단체 사진',
    'ep5-blur': '팬 얼굴을 스티커로 가린 팬미팅 단체 사진',
    ep6: '원래 모습 그대로 캔 음료를 든 광고 사진',
    'ep6-k': '유명 배우처럼 꾸민 광고 사진',
  },
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
          { who: 'moon_1004', text: '노래 너무 좋아요ㅋㅋ 벌써 열 번째 듣는 중' },
          { who: 'haneul_bbang', text: '데뷔곡부터 이런 퀄리티라니 🔥' },
          { who: 'cloud.nine', text: '후렴 중독성이 정말 강해요' },
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
    2: {
      img: { right: 'ep2', wrong: 'ep2' },
      caption: {
        right: '립싱크 기술을 공개해요. 특허 출원을 마친 뒤에 보여드리는 거예요 🎤',
        wrong: '립싱크 기술을 먼저 공개해요. 개발 과정도 전부 담았어요 🎤',
      },
      comments: {
        right: [
          { who: 'moon_1004', text: '입 모양이 노래랑 딱 맞아요, 신기해요' },
          { who: 'haneul_bbang', text: '이 기술을 직접 만들었다니 놀라워요 👏' },
          { who: 'cloud.nine', text: '공개가 늦어져서 애탔는데 이유가 있었네요' },
          { who: 'dalgom_92', text: '출원부터 하고 공개한 거죠? 든든해요' },
          { who: 'sora_note', text: '무대에서 쓰는 모습이 벌써 기대돼요' },
          { who: 'pinkdot77', text: '영상 계속 돌려 보는 중이에요 🎧' },
          { who: 'winter_ij', text: '기다린 만큼 완성도가 높네요' },
          { who: 'bori_tea', text: '꼼꼼한 회사라 믿음이 가요 💜' },
        ],
        wrong: [
          { who: 'moon_1004', text: '와, 립싱크 기술까지 직접 만든 거예요?' },
          { who: 'haneul_bbang', text: '개발 과정을 다 보여 주니 신기해요 🔥' },
          { who: 'cloud.nine', text: '이런 걸 공개해 주시다니 고마워요' },
          { who: 'dalgom_92', text: '영상 보고 바로 친구한테 공유했어요' },
          { who: 'pinkdot77', text: '입 모양이 정말 자연스러워요 🎤' },
          { who: 'sora_note', text: '다른 회사 신제품이 이거랑 똑같던데요?' },
          { who: 'winter_ij', text: '우리 기술을 보고 따라 만든 것 같아요' },
          { who: 'bori_tea', text: '특허는 내셨나요? 걱정돼요' },
          { who: 'nuri_log', text: '공개하기 전에 지켜 뒀으면 좋았을 텐데요' },
        ],
        half: [
          { at: 3, who: 'jam_jam01', text: '출원이 먼저였는지 처음엔 헷갈렸어요' },
          { at: 7, who: 'ddoong_e', text: '조금 불안했지만 결과가 좋아서 안심이에요' },
        ],
      },
      likes: {
        live: { right: 1.0, half: 0.9, wrong: 1.3 },
        later: { right: 1.0, half: 0.9, wrong: 0.6 },
      },
    },
    3: {
      img: { right: 'ep3', wrong: 'ep3' },
      caption: {
        right: '상표 등록을 마쳤어요. 이제 {n} 이름은 공식으로 지켜져요 📋',
        wrong: '비슷한 이름의 앱이 생겼지만 저희는 저희 길을 갈게요 📋',
      },
      comments: {
        right: [
          { who: 'moon_1004', text: '등록 축하해요! 이름이 이제 확실하네요' },
          { who: 'haneul_bbang', text: '공식 이름이 굳어지니 마음이 놓여요 🎉' },
          { who: 'cloud.nine', text: '짝퉁 앱 때문에 걱정했는데 다행이에요' },
          { who: 'dalgom_92', text: '앞으로도 {n} 이름 크게 키워 가요' },
          { who: 'sora_note', text: '경고장까지 보낼 수 있다니 든든해요' },
          { who: 'pinkdot77', text: '공식 계정만 믿고 따라갈게요 💜' },
          { who: 'winter_ij', text: '이름을 지키는 일도 중요하군요' },
          { who: 'bori_tea', text: '응원하는 마음은 그대로예요, 파이팅!' },
        ],
        wrong: [
          { who: 'moon_1004', text: '힘내요, 항상 응원하고 있어요 💜' },
          { who: 'haneul_bbang', text: '무슨 일이 있어도 팬들은 곁에 있어요' },
          { who: 'cloud.nine', text: '묵묵히 가는 모습이 멋있어요' },
          { who: 'dalgom_92', text: '일단 오늘 올려 준 사진 잘 봤어요' },
          { who: 'pinkdot77', text: '{N}-AI 앱이 공식 거야?' },
          { who: 'sora_note', text: '저 그 앱 설치했는데 공식 아니었어요?' },
          { who: 'winter_ij', text: '이름이 같아서 너무 헷갈려요' },
          { who: 'bori_tea', text: '공식 앱이 어느 쪽인지 알려 주세요' },
          { who: 'nuri_log', text: '조금 실망스러워요' },
        ],
        half: [
          { at: 1, who: 'jam_jam01', text: '한동안 이름 문제로 마음 졸였어요' },
          { at: 8, who: 'ddoong_e', text: '정리가 되어 가는 것 같아 다행이에요' },
        ],
      },
      likes: {
        live: { right: 1.0, half: 0.9, wrong: 1.3 },
        later: { right: 1.0, half: 0.9, wrong: 0.6 },
      },
    },
    4: {
      img: { right: 'ep4', wrong: 'ep4' },
      caption: {
        right: '새 노래를 준비 중이에요. 아직은 비밀이라 조금만 기다려 주세요 🔐',
        wrong: '새 노래를 준비 중이에요. 작업 중인 모습을 살짝 보여드려요 🎶',
      },
      comments: {
        right: [
          { who: 'moon_1004', text: '비밀이라니 더 기대돼요' },
          { who: 'haneul_bbang', text: '기다리는 것도 팬의 몫이죠 🎧' },
          { who: 'cloud.nine', text: '천천히 만들어 주세요, 기다릴게요' },
          { who: 'dalgom_92', text: '회사가 알아서 잘 챙기겠죠, 믿어요' },
          { who: 'sora_note', text: '작업 소식만 들어도 설레요' },
          { who: 'pinkdot77', text: '담담하게 소식 전해 줘서 고마워요' },
          { who: 'winter_ij', text: '무리하지 말고 건강 챙기세요' },
          { who: 'bori_tea', text: '언제든 나오면 바로 들을게요 💜' },
        ],
        wrong: [
          { who: 'moon_1004', text: '새 노래 소식이네요, 기대할게요' },
          { who: 'haneul_bbang', text: '작업 모습 보니 열심히 하시네요 🎶' },
          { who: 'cloud.nine', text: '응원합니다, 천천히 해 주세요' },
          { who: 'dalgom_92', text: '그냥 지나가다 들렀어요, 파이팅' },
          { who: 'pinkdot77', text: '경쟁사 신제품이랑 기능이 똑같네요' },
          { who: 'sora_note', text: '그쪽 신제품이 먼저 나온 건가요?' },
          { who: 'winter_ij', text: '우리가 준비하던 것과 너무 비슷해요' },
          { who: 'bori_tea', text: '이런 일이 생기다니 실망이에요' },
          { who: 'nuri_log', text: '내부 관리가 잘 되고 있는지 걱정돼요' },
        ],
        half: [
          { at: 4, who: 'jam_jam01', text: '처음엔 뭔가 새어 나갈까 불안했어요' },
          { at: 9, who: 'ddoong_e', text: '지금은 안심하고 기다려도 되겠네요' },
        ],
      },
      likes: {
        live: { right: 1.0, half: 0.9, wrong: 1.3 },
        later: { right: 1.0, half: 0.9, wrong: 0.6 },
      },
    },
    5: {
      img: { right: 'ep5-blur', wrong: 'ep5' },
      caption: {
        right: '팬미팅에 와 주셔서 고마워요. 동의받은 사진만 올리고 나머지는 가렸어요 🙅',
        wrong: '팬미팅 현장 사진이에요. 모두 얼굴이 잘 보이죠 📸',
      },
      comments: {
        right: [
          { who: 'moon_1004', text: '얼굴 가려 줘서 정말 고마워요' },
          { who: 'haneul_bbang', text: '팬 배려해 줘서 고마워요 💜' },
          { who: 'cloud.nine', text: '동의 먼저 구한다니 믿음이 가요' },
          { who: 'dalgom_92', text: '사진 올릴 때 이렇게 신경 써 주시네요' },
          { who: 'sora_note', text: '그날 즐거웠어요, 또 만나요!' },
          { who: 'pinkdot77', text: '팬을 존중하는 회사라 좋아요 🎤' },
          { who: 'winter_ij', text: '저도 얼굴 나오는 건 조심스러웠어요' },
          { who: 'bori_tea', text: '앞으로도 이런 모습 기대할게요' },
        ],
        wrong: [
          { who: 'moon_1004', text: '어, 나 찍혔다! 현장 사진 반가워요' },
          { who: 'haneul_bbang', text: '이 날 정말 행복했어요 🥰' },
          { who: 'cloud.nine', text: '저도 저기 있었어요, 뒷줄이에요!' },
          { who: 'dalgom_92', text: '사진 올려 줘서 고마워요 📸' },
          { who: 'pinkdot77', text: '다음 팬미팅도 꼭 갈게요' },
          { who: 'sora_note', text: '제 얼굴 내려 주세요' },
          { who: 'winter_ij', text: '동의는 받은 거예요?' },
          { who: 'bori_tea', text: '미리 말해 줬으면 좋았을 텐데요' },
          { who: 'nuri_log', text: '조용히 내려 주시면 좋겠어요' },
        ],
        half: [
          { at: 2, who: 'jam_jam01', text: '얼굴이 나올까 봐 처음엔 걱정했어요' },
          { at: 6, who: 'ddoong_e', text: '가려 놓은 걸 보고 마음이 놓였어요' },
        ],
      },
      likes: {
        live: { right: 1.0, half: 0.9, wrong: 1.3 },
        later: { right: 1.0, half: 0.9, wrong: 0.6 },
      },
    },
    6: {
      img: { right: 'ep6', wrong: 'ep6-k' },
      caption: {
        right: '이번 광고 제안은 정중히 거절했어요. {n는} {n} 그대로 무대에 설게요 ✨',
        wrong: '새 광고가 공개됐어요. 어디선가 본 듯한 얼굴일지도요 ✨',
      },
      comments: {
        right: [
          { who: 'moon_1004', text: '거절했다니, 멋있어요' },
          { who: 'haneul_bbang', text: '있는 그대로가 제일 좋아요 💜' },
          { who: 'cloud.nine', text: '계약을 놓쳐도 응원하는 마음은 그대로예요' },
          { who: 'dalgom_92', text: '원래 모습이 최고예요' },
          { who: 'sora_note', text: '누구를 닮지 않아도 충분해요' },
          { who: 'pinkdot77', text: '다음 무대도 기다릴게요 🎤' },
          { who: 'winter_ij', text: '신중하게 결정한 게 느껴져요' },
          { who: 'bori_tea', text: '결국 {n}다운 선택이었네요' },
        ],
        wrong: [
          { who: 'moon_1004', text: '배우 K 닮았다고 난리 났어요' },
          { who: 'haneul_bbang', text: '댓글창이 다 이 얘기뿐이에요 🔥' },
          { who: 'cloud.nine', text: '광고 화제성이 엄청나네요' },
          { who: 'dalgom_92', text: '정말 닮긴 했어요, 놀랐어요' },
          { who: 'pinkdot77', text: '친구들 단톡방에서도 그 얘기예요' },
          { who: 'sora_note', text: '이거 K 씨 허락받은 거야?' },
          { who: 'winter_ij', text: '닮은 얼굴로 광고해도 괜찮은 걸까요?' },
          { who: 'bori_tea', text: '허락 없이 썼다면 문제가 될 것 같아요' },
          { who: 'nuri_log', text: '경고장이 왔다는 얘기도 들었어요' },
        ],
        half: [
          { at: 3, who: 'jam_jam01', text: '광고 얘기 나올 땐 조금 아쉬웠어요' },
          { at: 7, who: 'ddoong_e', text: '끝까지 지켜보니 잘 마무리돼서 좋아요' },
        ],
      },
      likes: {
        live: { right: 1.0, half: 0.9, wrong: 1.3 },
        later: { right: 1.0, half: 0.9, wrong: 0.6 },
      },
    },
  },
};
