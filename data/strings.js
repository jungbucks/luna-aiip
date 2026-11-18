/* [데이터] 공용 문구 — 인트로·브릿지·법정·엔딩·리포트. 문구 수정은 여기서만.
   2026-11-17 인트로·법정·엔딩·리포트 문구 다듬음(명언풍·느낌표 걷어 냄, 의미·규칙 그대로). */

export const STRINGS = {
  title: '런칭! 나의 첫 AI 아이돌',
  subtitle: '통장 87만 원으로 시작한 AI 아이돌 회사. 여섯 가지 권리를 지켜야 한다.',

  intro: [
    { emoji: '🎓', text: '대학 동아리 \'코드팩토리\'.\n심심해서 AI 버추얼 아이돌을 하나 만들었다.\n이름은 {n}({N}).' },
    { emoji: '🚀', text: '어느 날 {n}의 커버 영상이 알고리즘을 탔다.\n조회수 300만, 팔로워 10만.\n"이거… 회사 차려야 하는 거 아냐?"' },
    { emoji: '📄', text: '얼떨결에 사업자 등록까지 했다.\n대표는 동아리 회장이던 나.\n개발은 후배 준호, 마케팅은 후배 세아.' },
    { emoji: '⚖️', text: '회사가 커질 때마다\n\'이건 누구 것인가\' 하는 문제가 생긴다.\n이제 단톡방에서 결정은 내가 한다.' },
  ],

  bridgeSettle: '📈 월간 정산 — {n} 활동 수익 💰 +10',
  bridgeNext: ep => `다음 이야기 — EP${ep.id} 「${ep.title}」\n${ep.intro}`,
  moneyZero: '💸 통장이 0원이 됐다. 당분간 라면으로 버틴다. (게임은 계속됩니다)',

  court: {
    probationTitle: '⚖️ 법정 — 마지막 기회',
    probationJudge: '피고 회사의 잘못은 분명합니다. 다만 처음이고 바로잡으려는 뜻이 보여 집행유예를 선고합니다. 다음은 없습니다.',
    probationBtn: '🛡️ 안전도 30 회복 — 다시 일어서기',
    finalTitle: '⚖️ 법정 엔딩 — 판결 선고',
    finalJudge: '피고 회사는 권리 침해를 되풀이해 더는 신뢰를 회복하기 어렵게 되었습니다. 아래 기록을 다시 살펴보십시오.',
    reviewHead: '📜 판사가 짚어 주는 침해 기록',
    retryBtn: '🔄 처음부터 다시 하기',
  },

  endings: {
    unicorn: {
      emoji: '🦄', name: '유니콘 엔딩',
      body: '{n}의 월드투어가 결정됐다. 여섯 가지 권리를 모두 지킨 회사에 투자 제안이 이어진다.\n권리를 지키느라 쓴 돈과 시간이 결국 회사를 지켰다.',
    },
    survive: {
      emoji: '🏢', name: '생존 엔딩',
      body: '회사는 살아남았다. 다만 소송과 실수의 대가도 치렀다.\n아래 리포트에서 무엇을 놓쳤는지 확인해 보자. 다음 판은 다를 수 있다.',
    },
    court: {
      emoji: '⚖️', name: '법정 엔딩',
      body: '회사는 문을 닫았다.\n그래도 무엇이 잘못이었는지는 알게 됐다. 아래 기록을 보고 다시 해 보자.',
    },
  },

  // O/X 확인 퀴즈(2026-11-14) — 스탯 무관. 문항은 data/quiz.js
  quiz: {
    title: '개념 확인 O/X',
    o: '⭕ 맞아요', x: '❌ 아니에요',
    right: '맞았어요', wrong: '아쉬워요',
    answer: a => '정답: ' + (a ? 'O' : 'X'),
    more: '비슷한 문제 하나 더 →', cont: '계속 →',
    reviewHead: '개념 확인 O/X에서 두 번 다 놓친 개념',
  },
  report: {
    head: '📊 최종 리포트',
    badgeLabel: { full: '완전', half: '반쪽', none: '미획득' },
    reviewHead: '📚 다시 볼 개념 (틀렸던 권리)',
    cleanReview: '틀린 개념이 없습니다. 여섯 가지 권리를 모두 지켰어요.',
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
    // 타이틀 [새로 시작] — 이어 할 기록이나 적은 글이 있을 때만 묻는다(기록 초기화는 settings 문구를 같이 쓴다)
    newTitle: '새로 시작',
    newAsk: '게임 기록과 수첩에 적은 글이 모두 지워집니다. 새로 시작할까요?',
    newYes: '지우고 새로 시작', newNo: '돌아가기',
  },
};
