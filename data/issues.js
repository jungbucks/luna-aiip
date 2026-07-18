/* [데이터] AI 시대의 지식재산 쟁점 12건 — 도감이 이 데이터만 읽는다.
   설계·검증표: docs/superpowers/specs/2026-07-18-ip-dogam-design.md (§8 = 교사 검수 관문, 검수 전 배포 금지)
   스키마: {id,right,rightEmoji,title,hook,sides[2~3]{label,stance,points[≥2]},think,status,realCase{name,gist,date},sources[≥1]{label,url}}
   status: decided(판결)·ongoing(진행 중)·varies(국가·전략별 상이). 미결을 확정처럼 쓰지 말 것(verify가 금칙어 차단).
   리서치 기준일 2026-07. 진행 중 사건은 결과가 바뀔 수 있음. */

export const STATUS_META = {
  decided: { emoji: '⚖️', label: '판결' },
  ongoing: { emoji: '🔥', label: '논쟁 진행 중' },
  varies: { emoji: '🌍', label: '국가·상황별 상이' },
};

export const ISSUES = [
  // ── 저작권 (4) ──
  {
    id: 'train', right: '저작권', rightEmoji: '©️',
    title: '학습 데이터를 마음대로 써도 될까?',
    hook: 'AI는 남의 그림·글 수백만 개를 학습했다. 이건 도둑질일까, 사람처럼 "보고 배운" 것일까?',
    sides: [
      { label: '창작자 편', stance: '허락도 보상도 없이 통째로 복제해 학습한 것은 침해다.',
        points: ['원작 없이는 AI도 없다 — 기여에 대한 보상이 필요', '내 작품이 나를 대체하는 AI를 키운 셈'] },
      { label: 'AI 개발자 편', stance: '사람이 책을 읽고 배우듯, 학습은 공정이용에 가깝다.',
        points: ['학습 결과물이 원작을 그대로 보여주지 않으면 시장 대체가 아님', '일일이 허락받으면 기술 발전이 멈춘다'] },
    ],
    think: '"보고 배우는 것"과 "복제하는 것"의 경계는 어디일까?',
    status: 'ongoing',
    realCase: { name: 'Bartz v. Anthropic / NYT v. OpenAI', date: '2025~2026',
      gist: 'Bartz 사건에서 미국 법원은 책으로 AI를 학습시키는 것 자체는 공정이용으로 보았지만, 불법 복제본을 저장한 것은 침해로 판단해 약 15억 달러 합의로 이어졌다. NYT가 OpenAI를 상대로 낸 소송은 AI 답변이 기사 시장을 대체하는지를 두고 아직 진행 중이다.' },
    sources: [
      { label: '작가조합(Anthropic 합의)', url: 'https://authorsguild.org/advocacy/artificial-intelligence/what-authors-need-to-know-about-the-anthropic-settlement/' },
      { label: 'Norton Rose Fulbright(2026 소송 업데이트)', url: 'https://www.nortonrosefulbright.com/en/knowledge/publications/ce8eaa5f/ai-in-litigation-series-an-update-on-ai-copyright-cases-in-2026' },
    ],
  },
  {
    id: 'aiwork', right: '저작권', rightEmoji: '©️',
    title: 'AI가 그린 그림, 저작권은 누구 것?',
    hook: '버튼 한 번에 나온 그림. 저작권은 사람 것일까, AI 것일까, 아니면 아무의 것도 아닐까?',
    sides: [
      { label: '인간 저작만 인정', stance: '창작한 사람이 없으면 저작권도 없다.',
        points: ['저작권법은 "인간의 창작"을 전제로 만들어졌다', '누구나 자유롭게 쓰는 공공 영역이 될 수 있음'] },
      { label: '기획자에게 인정', stance: '무엇을, 어떻게 만들지 정한 사람의 창작으로 볼 수 있다.',
        points: ['프롬프트·수정·선택에도 사람의 판단이 들어간다', '보호가 없으면 창작 투자를 꺼리게 됨'] },
    ],
    think: '"어느 정도" 사람이 개입해야 사람의 창작이라 할 수 있을까?',
    status: 'decided',
    realCase: { name: 'Thaler v. Perlmutter', date: '2026-03',
      gist: '순수하게 AI가 자율 생성한 미술품의 저작권 등록을 두고 다툰 사건에서, 미국 대법원이 2026년 3월 상고를 받아들이지 않아 하급심 결론이 확정됐다. 사람의 저작이 없는 순수 AI 생성물은 저작권 등록 대상이 아니라는 원칙이 유지됐다. 다만 사람이 충분히 개입한 AI 보조 창작물은 별개 문제로 남았다.' },
    sources: [
      { label: 'Morgan Lewis(대법원 상고기각)', url: 'https://www.morganlewis.com/pubs/2026/03/us-supreme-court-declines-to-consider-whether-ai-alone-can-create-copyrighted-works' },
      { label: 'Baker Donelson(Thaler 해설)', url: 'https://www.bakerdonelson.com/supreme-court-denies-certiorari-in-thaler-v-perlmutter-ai-cannot-be-an-author-under-the-copyright-act' },
    ],
  },
  {
    id: 'provider', right: '저작권', rightEmoji: '©️',
    title: 'AI가 남의 글을 베끼면 누가 책임지나?',
    hook: 'AI가 신문 기사를 거의 그대로 뱉어냈다. 회사 책임일까, 그렇게 시킨 이용자 책임일까?',
    sides: [
      { label: '제공자 책임', stance: 'AI를 설계하고 학습시킨 회사가 책임져야 한다.',
        points: ['무엇을 학습하고 어떻게 답하는지는 회사가 통제한다', '피해를 막을 수 있는 위치에 있는 쪽이 책임진다'] },
      { label: '이용자 책임', stance: '침해가 되도록 실제로 지시·사용한 이용자 책임이다.',
        points: ['도구 자체는 중립적, 쓰는 방식이 문제', '모든 산출물을 회사가 미리 통제하긴 어렵다'] },
    ],
    think: '칼을 만든 사람과 칼을 쓴 사람, 책임은 어떻게 나눌까?',
    status: 'ongoing',
    realCase: { name: 'NYT v. OpenAI', date: '2024~진행 중',
      gist: '뉴욕타임스는 챗봇의 답변이 자사 기사를 재현해 시장을 대체한다고 주장했고, 법원은 OpenAI의 각하 신청을 받아들이지 않아 본안 심리가 진행 중이다. AI 산출물에 대한 책임을 누가 지는지의 기준을 세울 대표 사건으로 꼽힌다.' },
    sources: [
      { label: 'Norton Rose Fulbright(2026 소송 업데이트)', url: 'https://www.nortonrosefulbright.com/en/knowledge/publications/ce8eaa5f/ai-in-litigation-series-an-update-on-ai-copyright-cases-in-2026' },
    ],
  },
  {
    id: 'oss', right: '저작권', rightEmoji: '©️',
    title: '공짜 오픈소스, 조건은 지켜야 할까?',
    hook: '누구나 쓰라고 공개한 코드로 AI를 만들었다. "출처를 밝히라"는 조건도 지켜야 할까?',
    sides: [
      { label: '준수해야', stance: '오픈소스도 "조건부 허락", 저작권 표시·라이선스를 지켜야 한다.',
        points: ['"공개"가 "조건 없음"은 아니다', '표시를 떼면 만든 사람의 권리가 사라진다'] },
      { label: '새 창작이다', stance: '학습해 변형한 결과는 원본과 다른 새 산출물이다.',
        points: ['조각조각 학습한 것을 원본 복제로 보긴 어렵다', '지나친 제약은 AI 개발을 막는다'] },
    ],
    think: '"자유롭게 쓰세요"라는 말에는 어떤 조건까지 담겨 있을까?',
    status: 'ongoing',
    realCase: { name: 'Doe v. GitHub Copilot', date: '2022~진행 중',
      gist: '개발자들이 코드 생성 AI가 오픈소스 코드를 학습·출력하면서 저작권 표시를 없앴다고 문제 삼은 사건. 저작권 관리정보 제거(DMCA 1202) 쟁점으로 초점이 옮겨간 채 항소·심리가 이어지고 있으며, 본안 결론은 아직 나지 않았다.' },
    sources: [
      { label: 'BakerHostetler(Copilot 소송)', url: 'https://www.bakerlaw.com/the-copilot-litigation/' },
      { label: 'GitHub Copilot Litigation(원고 측)', url: 'https://githubcopilotlitigation.com/' },
    ],
  },
  // ── 특허권 (2) ──
  {
    id: 'patprotect', right: '특허권', rightEmoji: '🔬',
    title: 'AI 핵심 기술, 특허로 공개할까 숨길까?',
    hook: '어렵게 만든 AI 기술. 특허로 공개하고 보호받을까, 비밀로 감추고 독점할까?',
    sides: [
      { label: '특허(공개)', stance: '특허로 공개하면 20년간 보호받고 기술도 발전한다.',
        points: ['법적으로 강하게 보호받는다', '공개된 기술 위에 다음 발전이 쌓인다'] },
      { label: '영업비밀(비공개)', stance: '공개하면 모방당하기 쉬우니 비밀로 지키는 게 낫다.',
        points: ['핵심 알고리즘은 공개 즉시 따라잡힐 수 있다', '기간 제한 없이 지킬 수 있다'] },
    ],
    think: '"공개하고 보호받기"와 "숨기고 독점하기" 중 무엇이 더 안전할까?',
    status: 'varies',
    realCase: { name: '보호 전략의 선택 문제', date: '상시',
      gist: '특정 판례로 정해지는 문제가 아니라, 기업이 기술 성격에 따라 특허·영업비밀 중 무엇으로 보호할지 선택하는 전략 논쟁이다. 리버스 엔지니어링이 쉬운 기술은 특허가, 내부에 감출 수 있는 기술은 영업비밀이 유리하다는 견해가 맞선다.' },
    sources: [
      { label: 'Lexology(AI 보호 전략)', url: 'https://www.lexology.com/library/detail.aspx?g=15568a55-2a68-436e-8ebd-22240712987d' },
    ],
  },
  {
    id: 'inventor', right: '특허권', rightEmoji: '🔬',
    title: 'AI를 발명자로 인정할 수 있을까?',
    hook: 'AI가 새로운 기술을 발명했다. 특허 서류의 "발명자" 칸에 AI 이름을 쓸 수 있을까?',
    sides: [
      { label: '자연인만', stance: '발명자는 사람이어야 한다.',
        points: ['특허 제도는 사람의 창의를 북돋우려 만든 것', 'AI는 권리·의무의 주체가 될 수 없다'] },
      { label: 'AI도 인정', stance: '실제로 발명했다면 그 사실을 인정해야 한다.',
        points: ['진짜 발명한 존재를 숨기면 서류가 거짓이 된다', '기술 현실을 제도가 따라가야 한다'] },
    ],
    think: '"누가 발명했는가"와 "누구 이름으로 권리를 갖는가"는 같은 질문일까?',
    status: 'varies',
    realCase: { name: 'DABUS (Thaler) 국제 소송', date: '2021~2026',
      gist: '발명 AI "DABUS"를 발명자로 올리려는 시도가 나라마다 다르게 판단됐다. 일본 대법원(2026-03)·미국·영국은 발명자는 자연인이어야 한다며 거부했고, 독일은 "사람을 발명자로 두되 AI를 활용한 발명 자체는 특허 가능"한 쪽으로 정리됐다. 어느 나라든 AI 활용 발명 자체를 금지하진 않는다.' },
    sources: [
      { label: 'The Leveraged Years(일본 대법원)', url: 'https://www.theleveragedyears.com/ai-regulation-news/japan-supreme-court-ai-inventor-dabus-final-2026' },
      { label: 'JUVE Patent(영국 대법원)', url: 'https://www.juve-patent.com/cases/uk-supreme-court-dabus-named-inventor-patent-stephen-thaler/' },
    ],
  },
  // ── 상표권 (3) ──
  {
    id: 'tmmake', right: '상표권', rightEmoji: '™️',
    title: 'AI가 디자인한 로고, 상표로 등록될까?',
    hook: 'AI가 뚝딱 만든 브랜드 로고. 상표로 등록해 독점할 수 있을까?',
    sides: [
      { label: '등록 가능', stance: '실제로 쓰이고 브랜드를 구별해 준다면 누가 만들었는지는 상관없다.',
        points: ['상표의 핵심은 "출처를 구별하는 힘"', '소비자가 그 표시로 브랜드를 알아보면 기능을 다한 것'] },
      { label: '요건 문제', stance: '창작 주체·창작성 요건을 어떻게 볼지 문제가 남는다.',
        points: ['저작권처럼 인간 창작성을 따질 여지', '대량 자동 생성으로 표시가 넘쳐날 우려'] },
    ],
    think: '상표에서 중요한 건 "누가 만들었나"일까, "어떻게 쓰이나"일까?',
    status: 'ongoing',
    realCase: { name: 'AI 생성 상표의 등록 요건 논쟁', date: '진행 중',
      gist: '상표는 저작권·특허와 달리 "식별력"과 "실제 사용"을 중심으로 판단해 AI 생성물도 등록 가능성이 열려 있다는 견해가 있으나, 창작 주체 요건을 어떻게 적용할지는 아직 정리되지 않았다.' },
    sources: [
      { label: 'ABA(누가 소유하는가)', url: 'https://www.americanbar.org/groups/intellectual_property_law/resources/newsletters/ai-creates-who-owns-it-law-catches-up/' },
    ],
  },
  {
    id: 'tmdilute', right: '상표권', rightEmoji: '™️',
    title: 'AI가 유명 브랜드를 흉내 내면?',
    hook: 'AI가 유명 로고와 비슷한 이미지를 대량으로 만들어낸다. 상표 침해일까?',
    sides: [
      { label: '침해다', stance: '소비자를 헷갈리게 하거나 브랜드 가치를 흐리면 침해다.',
        points: ['가짜 워터마크가 붙으면 출처를 오해하게 된다', '유명 상표의 식별력이 약해지는 "희석"이 생긴다'] },
      { label: '판단 어렵다', stance: '유사성·고의를 입증하기가 쉽지 않다.',
        points: ['우연히 비슷해진 것과 베낀 것을 가르기 어렵다', '나라마다 희석 인정 기준이 다르다'] },
    ],
    think: '"비슷하다"는 느낌만으로 침해라 할 수 있을까?',
    status: 'varies',
    realCase: { name: 'Getty Images v. Stability AI', date: '2025~2026',
      gist: 'AI가 만든 이미지에 왜곡된 Getty 워터마크가 나타난 것을 두고 다툰 사건. 미국 법원은 상표 희석 주장을 진행시켰지만(2026-04), 영국 고등법원은 희석을 인정하지 않았다(2025-11). 같은 사안도 나라에 따라 결론이 갈렸다.' },
    sources: [
      { label: 'Mondaq(미국 판단)', url: 'https://www.mondaq.com/unitedstates/trademark/1802566/trademark-law-meets-generative-ai-key-takeaways-from-the-getty-v-stability-ai-ruling' },
      { label: 'Taylor Wessing(영국 판단)', url: 'https://www.taylorwessing.com/en/insights-and-events/insights/2025/11/getty-vs-stability-trade-marks' },
    ],
  },
  {
    id: 'tmname', right: '상표권', rightEmoji: '™️',
    title: '"먼저 쓴 이름"을 대기업이 가져가면?',
    hook: '작은 회사가 먼저 쓰던 이름을, 거대 AI가 같은 이름으로 서비스를 냈다. 누가 쓸 수 있을까?',
    sides: [
      { label: '먼저 쓴 쪽 보호', stance: '먼저 등록·사용한 상표를 보호해야 한다.',
        points: ['상표는 먼저 쌓아온 신뢰를 지키는 제도', '나중에 큰 회사가 덮어써도 된다면 불공정'] },
      { label: '분야 다르면 OK', stance: '쓰는 분야가 달라 소비자가 헷갈리지 않으면 함께 쓸 수 있다.',
        points: ['같은 이름도 업종이 다르면 공존하는 경우가 많다', '핵심은 실제 "혼동 가능성"'] },
    ],
    think: '같은 이름이라도 "헷갈리지 않으면" 함께 써도 될까?',
    status: 'decided',
    realCase: { name: 'Gemini Data v. Google', date: '2026-05',
      gist: '"Gemini"라는 이름을 먼저 쓰던 회사가 구글의 AI 브랜드 사용을 문제 삼은 사건에서, 법원은 2026년 5월 구글의 손을 들어줬다. 상표가 같아도 혼동 가능성 판단에 따라 결론이 달라질 수 있음을 보여준 사례다.' },
    sources: [
      { label: 'IIPLA(구글 승소)', url: 'https://iipla.org/news/google-wins-trademark-suit-over-gemini-branding' },
      { label: 'National Law Review(사건 해설)', url: 'https://natlawreview.com/article/gemini-spells-double-trouble-googles-ai-gemini-data-inc-sues-trademark-infringement' },
    ],
  },
  // ── 영업비밀 (3) ──
  {
    id: 'tsstrategy', right: '영업비밀', rightEmoji: '🔒',
    title: '핵심 기술, 특허·오픈소스·영업비밀 중 무엇?',
    hook: '회사의 가장 중요한 AI 기술. 공개할까, 공유할까, 감출까? 세 갈래 길이 있다.',
    sides: [
      { label: '특허', stance: '공개하고 법으로 20년 독점한다.',
        points: ['보호가 강하고 권리가 명확하다', '단, 내용이 세상에 공개된다'] },
      { label: '오픈소스', stance: '공유해서 생태계와 함께 성장한다.',
        points: ['많은 사람이 쓰며 표준이 될 수 있다', '단, 독점 이익은 포기한다'] },
      { label: '영업비밀', stance: '감춰서 기간 제한 없이 독점한다.',
        points: ['공개 비용 없이 오래 지킬 수 있다', '단, 유출되면 보호가 사라진다'] },
    ],
    think: '무엇을 얻는 대신 무엇을 포기해야 할까?',
    status: 'varies',
    realCase: { name: '보호 전략의 3지선다', date: '상시',
      gist: '하나의 정답이 있는 문제가 아니라, 기술의 성격·모방 난이도·사업 전략에 따라 특허·오픈소스·영업비밀 중 무엇을 택할지 저울질하는 논쟁이다. 실제 기업은 기술마다 다른 조합을 쓰기도 한다.' },
    sources: [
      { label: 'Lexology(AI 보호 전략)', url: 'https://www.lexology.com/library/detail.aspx?g=15568a55-2a68-436e-8ebd-22240712987d' },
    ],
  },
  {
    id: 'explain', right: '영업비밀', rightEmoji: '🔒',
    title: 'AI가 나를 거절한 이유, 알 권리가 있을까?',
    hook: 'AI가 내 대출을 거절했다. "왜죠?"라고 물을 권리 vs "그건 회사 비밀"이라는 방패.',
    sides: [
      { label: '설명 요구권', stance: '나에 대한 자동 결정은 이유를 설명받을 권리가 있다.',
        points: ['영향을 받는 사람은 근거를 알아야 다툴 수 있다', '"비밀"이라는 말로 모든 설명을 막을 순 없다'] },
      { label: '영업비밀', stance: '알고리즘은 기업의 핵심 자산이라 통째로 공개할 순 없다.',
        points: ['공개하면 악용·모방 위험이 크다', '전부 밝히지 않고도 설명할 방법이 있다'] },
    ],
    think: '"이유를 아는 것"과 "알고리즘을 통째로 보는 것"은 같은 요구일까?',
    status: 'varies',
    realCase: { name: '유럽사법재판소(CJEU) 판결', date: '2025-02',
      gist: '자동화된 결정에 대한 설명 요구를 두고, 유럽 최고법원은 기업이 "영업비밀"만 내세워 설명을 거부할 수는 없지만 알고리즘 자체를 통째로 공개할 필요는 없고, 예외적인 경우에만 영업비밀이 앞선다고 정리했다. 알 권리와 비밀 보호의 균형점을 제시한 사례다.' },
    sources: [
      { label: 'Inside Privacy(CJEU 판결)', url: 'https://www.insideprivacy.com/gdpr/cjeu-clarifies-gdpr-rights-on-automated-decision-making-and-trade-secrets/' },
      { label: 'Stibbe(설명 요구권)', url: 'https://www.stibbe.com/publications-and-insights/cjeu-confirms-right-of-explanation-in-battle-between-trade-secrets-and' },
    ],
  },
  {
    id: 'tsleak', right: '영업비밀', rightEmoji: '🔒',
    title: '직원이 AI 비밀을 들고 이직하면?',
    hook: '핵심 개발자가 경쟁사로 옮겨간다. 머릿속의 기술은 회사 것일까, 그 사람 것일까?',
    sides: [
      { label: '강하게 보호', stance: '계약·접근통제로 기밀 유출을 막아야 한다.',
        points: ['핵심 기술이 새 나가면 회복이 어렵다', '비밀 유지 약속은 지켜져야 한다'] },
      { label: '과하면 문제', stance: '지나친 통제는 인재의 이동과 혁신을 막는다.',
        points: ['개인이 쌓은 경험·지식까지 묶을 순 없다', '인재가 못 옮기면 산업 전체가 굳는다'] },
    ],
    think: '"회사의 비밀"과 "개인의 경험"은 어디서 나뉠까?',
    status: 'ongoing',
    realCase: { name: 'Apple v. OpenAI / xAI v. OpenAI', date: '2025~2026',
      gist: 'Apple은 전직 직원과 채용 과정을 통해 기밀 설계가 유출됐다며 OpenAI를 상대로 소송을 냈고(2026-07) 진행 중이다. 반면 xAI가 OpenAI를 상대로 낸 유사 주장은 증거 부족으로 각하됐다. 인재 이동과 영업비밀 보호의 경계가 계속 다퉈지고 있다.' },
    sources: [
      { label: 'TechCrunch(Apple v. OpenAI)', url: 'https://techcrunch.com/2026/07/13/the-wildest-allegations-in-apples-trade-secrets-lawsuit-against-openai/' },
      { label: 'Courthouse News(xAI 각하)', url: 'https://www.courthousenews.com/judge-tosses-xai-claims-that-openai-stole-trade-secrets/' },
    ],
  },
];
