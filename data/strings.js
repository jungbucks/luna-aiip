/* [데이터] 공용 문구 — 인트로·브릿지·법정·엔딩·리포트. 문구 수정은 여기서만.
   TODO(Opus): 톤 다듬기 가능(의미·규칙 변경 금지). */

export const STRINGS = {
  title: '런칭! 나의 첫 AI 아이돌',
  subtitle: '지식재산권 6종을 지켜라 — 스타트업 생존 스토리',

  intro: [
    { emoji: '🎓', text: '대학 동아리 \'코드팩토리\'.\n우리는 심심해서 AI 버추얼 아이돌을 만들었다.\n이름은 {n}({N}).' },
    { emoji: '🚀', text: '어느 날 {n}의 커버 영상이 알고리즘을 탔다.\n조회수 300만. 팔로워 10만.\n"이거… 회사 차려야 하는 거 아냐?"' },
    { emoji: '📄', text: '얼떨결에 사업자등록을 마쳤다.\n대표는 나. 개발은 준호. 마케팅은 세아.\n통장 잔고 87만원의 초미니 스타트업.' },
    { emoji: '⚖️', text: '그런데 아무도 말해주지 않았다.\n성장의 고비마다 \'권리\'의 문제가 터진다는 걸.\n지금부터 당신의 선택이 회사의 운명을 정한다.' },
  ],

  bridgeSettle: '📈 월간 정산 — {n} 활동 수익 💰 +10',
  bridgeNext: ep => `다음 이야기 — EP${ep.id} 「${ep.title}」\n${ep.intro}`,
  moneyZero: '💸 통장 잔고 0원… 사무실에서 라면으로 버티는 중. (게임은 계속됩니다)',

  court: {
    probationTitle: '⚖️ 법정 — 그러나 마지막 기회',
    probationJudge: '피고 회사의 잘못은 명백하나, 초범이며 시정 의지가 보이므로 집행유예를 선고한다. 다음은 없습니다.',
    probationBtn: '🛡️ 안전도 30 회복 — 다시 일어서기',
    finalTitle: '⚖️ 법정 엔딩 — 판결 선고',
    finalJudge: '피고 회사는 반복된 권리 침해로 더 이상 신뢰를 회복할 수 없게 되었습니다. 아래 침해 목록을 되짚어 보십시오.',
    reviewHead: '📜 판사가 짚어주는 침해 기록',
    retryBtn: '🔄 처음부터 재도전',
  },

  endings: {
    unicorn: {
      emoji: '🦄', name: '유니콘 엔딩',
      body: '{n} 월드투어 성사! 6개의 권리를 모두 지켜낸 회사에 투자가 몰려든다.\n"IP를 지킨 자가 IP로 흥한다."',
    },
    survive: {
      emoji: '🏢', name: '생존 엔딩',
      body: '회사는 살아남았다. 하지만 소송과 실수의 흉터가 남았다.\n아래 리포트로 무엇을 놓쳤는지 복습하자 — 다음 창업(플레이)은 다를 것이다.',
    },
    court: {
      emoji: '⚖️', name: '법정 엔딩',
      body: '회사는 문을 닫았다. 하지만 이 판결문은 최고의 교과서다.\n무엇이 잘못이었는지 알았다면, 이미 절반은 이긴 것.',
    },
  },

  // O/X 확인 퀴즈(2026-11-14) — 스탯 무관. 문항은 data/quiz.js
  quiz: {
    title: '개념 확인 O/X',
    o: '⭕ 맞아요', x: '❌ 아니에요',
    right: '맞았어요!', wrong: '아쉬워요',
    answer: a => '정답: ' + (a ? 'O' : 'X'),
    more: '비슷한 문제 하나 더 →', cont: '계속 →',
    reviewHead: '개념 확인 O/X에서 두 번 다 놓친 개념',
  },
  report: {
    head: '📊 최종 리포트',
    badgeLabel: { full: '완전', half: '반쪽', none: '미획득' },
    reviewHead: '📚 다시 볼 개념 (틀렸던 권리)',
    cleanReview: '틀린 개념이 없습니다 — 완벽한 IP 감각! 👏',
    disclaimer: '※ 본 게임의 법 개념은 교육용으로 단순화한 것으로, 실제 법률 자문이 아닙니다.',
  },

  /* v0.6 루나폰 — 폰 화면의 문구(잠금화면·홈·메신저·권리 수첩·설정·산출물). 이름은 직접 쓰지 않는다. */
  ui: {
    lockApp: '코드팩토리', lockNow: '지금',
    themeToDark: '다크 모드로 바꾸기', themeToLight: '라이트 모드로 바꾸기',
    notifyHint: '새 메시지가 왔어요 — 눌러서 열기',
    apps: { city: '윤리시티', cal: '달력', call: '통화', msg: '메신저', notes: '권리 수첩', settings: '설정' },
    decorSuffix: ' (장식)', back: '홈으로', today: '오늘',
    composer: { playing: '탭하면 빨리 감기', choose: '위에서 답장을 골라 주세요', idle: '메시지 입력' },
    notes: {
      title: '권리 수첩', locked: n => `EP${n}에서 만나요`,
      prompt: '이번 사건에서 알게 된 것을 내 말로 적어 보세요', placeholder: '내 말로 한두 문장',
      save: '수첩에 적기', edit: '고치기', mine: '내가 적은 것',
      need: n => `${n}자 이상 적어 주세요`, local: '적은 내용은 이 기기에만 저장됩니다.',
      product: '📒 나의 권리 수첩 만들기',
    },
    product: {
      title: '나의 권리 수첩', name: '학번·이름', withIdol: '함께한 아이돌', result: '결과', inProgress: '진행 중',
      empty: '(아직 적지 않음)', print: '인쇄 · PDF로 저장', copy: '글 복사', copied: '복사했어요',
      copyFail: '복사하지 못했어요 — 글을 길게 눌러 직접 복사해 주세요',
    },
    settings: {
      title: '설정', mode: '화면 모드', system: '기기 설정 따름', light: '라이트', dark: '다크',
      reset: '기록 초기화', resetAsk: '게임 기록과 수첩에 적은 글이 모두 지워집니다. 지울까요?',
      resetYes: '지우기', resetNo: '그만두기', version: '버전 0.6',
    },
    restartTitle: '🔄 처음부터 다시',
    restartAsk: '처음부터 다시 하면 수첩에 적은 글도 지워집니다. 산출물을 먼저 저장했나요?',
    restartYes: '지우고 다시 하기', restartNo: '돌아가기',
  },
};
