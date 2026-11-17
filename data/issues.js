/* [데이터] AI 시대의 지식재산 쟁점 12건 — 도감이 이 데이터만 읽는다.
   설계·검증표: docs/superpowers/specs/2026-07-18-ip-dogam-design.md (§8 = 교사 검수 관문, 검수 전 배포 금지)
   스키마: {id,right,rightEmoji,title,hook,sides[2~3]{label,stance,points[≥2]},think,status,realCase{name,gist,date},sources[≥1]{label,url}}
   status: decided(판결)·ongoing(진행 중)·varies(국가·전략별 상이). 미결을 확정처럼 쓰지 말 것(verify가 금칙어 차단).
   리서치 2026-07, 재확인 2026-11-17(docs/review/2026-11-17-dogam-verifier.md 교체 문구 전부 반영). 진행 중 사건은 결과가 바뀔 수 있음. */

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
    realCase: { name: 'Bartz v. Anthropic / 지상파 3사 v. 네이버', date: '2025~2026',
      gist: '미국의 한 1심 법원은 산 책으로 AI를 학습시킨 것은 공정이용이라고 보았다. 하지만 해적판 책을 내려받아 쌓아 둔 것은 공정이용이 아니라고 했고, Anthropic은 약 15억 달러를 물어주기로 합의했다. 한국에서는 지상파 3사가 뉴스 학습을 두고 네이버와 소송 중이다.' },
    sources: [
      { label: '작가조합(Anthropic 합의 최종 승인)', url: 'https://authorsguild.org/news/court-grants-final-approval-anthropic-copyright-settlement/' },
      { label: '작가조합(합의와 판결 해설)', url: 'https://authorsguild.org/advocacy/artificial-intelligence/what-authors-need-to-know-about-the-anthropic-settlement/' },
      { label: 'MTN(지상파 3사 v. 네이버)', url: 'https://news.mtn.co.kr/news-detail/2026040915330140911' },
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
      gist: 'AI가 혼자 만든 그림의 저작권 등록을 두고 다툰 사건이다. 미국 항소법원은 "저작물은 사람이 만들어야 한다"고 판결했다. 2026년 3월 대법원이 상고를 받지 않아 이 판결이 확정됐다. 한국 정부 안내서(2025-06)도 사람이 창작적으로 기여한 부분만 등록할 수 있다고 안내한다. 사람이 얼마나 관여해야 보호받는지는 아직 다퉈지고 있다.' },
    sources: [
      { label: 'Morgan Lewis(대법원 상고기각)', url: 'https://www.morganlewis.com/pubs/2026/03/us-supreme-court-declines-to-consider-whether-ai-alone-can-create-copyrighted-works' },
      { label: 'Baker Donelson(Thaler 해설)', url: 'https://www.bakerdonelson.com/supreme-court-denies-certiorari-in-thaler-v-perlmutter-ai-cannot-be-an-author-under-the-copyright-act' },
      { label: '법률신문(한국 AI 저작물 등록 안내서)', url: 'https://www.lawtimes.co.kr/news/articleViewAmp.html?idxno=209882' },
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
    realCase: { name: 'NYT v. OpenAI / Cox v. Sony', date: '2023~진행 중',
      gist: '뉴욕타임스는 챗봇이 자사 기사를 거의 그대로 내놓는다며 2023년 말 OpenAI에 소송을 냈다. 2026년 3월 미국 대법원은 인터넷 회사 사건(Cox v. Sony)에서 기준을 정했다. 이용자의 침해를 알기만 한 회사는 책임이 없고, 부추기거나 침해용 서비스를 만들어야 책임진다. 이후 뉴욕타임스는 "도왔다"는 주장을 접고 직접 베꼈다는 주장에 집중한다.' },
    sources: [
      { label: 'Hunton(Cox v. Sony 대법원 판결)', url: 'https://www.hunton.com/insights/legal/knowledge-is-not-enough-supreme-court-limits-contributory-copyright-liability-for-isps' },
      { label: 'ChatGPT Is Eating the World(NYT 주장 정리, 2026-08)', url: 'https://chatgptiseatingtheworld.com/2026/08/07/judge-stein-denies-news-plaintiffs-leave-to-add-new-contributory-infringement-claim-v-microsoft-news-plaintiffs-ziff-davis-already-abandoned-contributory-infringement-claim-foreclosed-by-cox-commun/' },
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
      gist: '개발자들은 코드 생성 AI가 오픈소스 코드를 내놓으며 저작자 표시를 떼어 냈다고 소송을 냈다. 2026년 9월 미국 항소법원은 AI가 새로 만든 코드에 표시가 없다고 해서 "표시를 제거했다"고 볼 수는 없다고 했다. 다만 라이선스(계약)를 어겼다는 주장은 1심에서 계속 다퉈지고 있다.' },
    sources: [
      { label: 'Gibson Dunn(제9항소법원 판결)', url: 'https://www.gibsondunn.com/ninth-circuit-clarifies-limits-of-dmca-liability-for-ai-generated-code/' },
      { label: 'EFF(판결 해설)', url: 'https://www.eff.org/deeplinks/2026/09/victory-appeals-court-rejects-expansive-new-copyright-claim' },
      { label: 'GitHub Copilot Litigation(원고 측)', url: 'https://githubcopilotlitigation.com/' },
    ],
  },
  // ── 특허권 (2) ──
  {
    id: 'patprotect', right: '특허권', rightEmoji: '🔬',
    title: 'AI 핵심 기술, 특허로 공개할까 숨길까?',
    hook: '어렵게 만든 AI 기술. 특허로 공개하고 보호받을까, 비밀로 감추고 독점할까?',
    sides: [
      { label: '특허(공개)', stance: '특허로 공개하면 출원일부터 최대 20년간 보호받고 기술도 발전한다.',
        points: ['법적으로 강하게 보호받는다', '공개된 기술 위에 다음 발전이 쌓인다'] },
      { label: '영업비밀(비공개)', stance: '공개하면 모방당하기 쉬우니 비밀로 지키는 게 낫다.',
        points: ['핵심 알고리즘은 공개 즉시 따라잡힐 수 있다', '기간 제한 없이 지킬 수 있다'] },
    ],
    think: '"공개하고 보호받기"와 "숨기고 독점하기" 중 무엇이 더 안전할까?',
    status: 'varies',
    realCase: { name: '보호 전략의 선택 문제', date: '상시',
      gist: '판례로 정해지는 문제가 아니라 기업이 고르는 전략 문제다. 제품을 뜯어보면 알 수 있는 기술은 특허가, 안에 감출 수 있는 기술은 영업비밀이 유리하다는 견해가 많다. 또 AI 알고리즘 같은 수학적 방법 자체는 특허를 받기 어렵고, 컴퓨터에서 구체적으로 실행되는 형태여야 한다.' },
    sources: [
      { label: 'Lexology(AI 보호 전략)', url: 'https://www.lexology.com/library/detail.aspx?g=15568a55-2a68-436e-8ebd-22240712987d' },
      { label: '헤럴드경제(지식재산처 AI 특허출원 안내서)', url: 'https://www.heraldk.com/article/2026060818200872635' },
    ],
  },
  {
    id: 'inventor', right: '특허권', rightEmoji: '🔬',
    title: 'AI를 발명자로 인정할 수 있을까?',
    hook: 'AI가 새로운 기술을 발명했다. 특허 서류의 "발명자" 칸에 AI 이름을 쓸 수 있을까?',
    sides: [
      { label: '사람만', stance: '발명자는 사람이어야 한다.',
        points: ['특허 제도는 사람의 창의를 북돋우려 만든 것', 'AI는 권리·의무의 주체가 될 수 없다'] },
      { label: 'AI도 인정', stance: '실제로 발명했다면 그 사실을 인정해야 한다.',
        points: ['진짜 발명한 존재를 숨기면 서류가 거짓이 된다', '기술 현실을 제도가 따라가야 한다'] },
    ],
    think: '"누가 발명했는가"와 "누구 이름으로 권리를 갖는가"는 같은 질문일까?',
    status: 'varies',
    realCase: { name: 'DABUS (Thaler) 국제 소송', date: '2021~2026',
      gist: '발명 AI "DABUS"를 발명자로 적은 특허 출원이 여러 나라에서 다퉈졌다. 일본·미국·영국 법원은 발명자는 사람이어야 한다며 받아들이지 않았다. 독일은 사람을 발명자로 적으면 AI를 활용한 발명도 특허를 받을 수 있다고 봤다. 한국도 1·2심이 "AI는 발명자가 될 수 없다"고 했고, 대법원 선고 소식은 아직 없다.' },
    sources: [
      { label: '법무법인 세종(한국 DABUS 소송)', url: 'https://www.shinkim.com/kor/media/lawinfo/373' },
      { label: 'JUVE Patent(영국 대법원)', url: 'https://www.juve-patent.com/cases/uk-supreme-court-dabus-named-inventor-patent-stephen-thaler/' },
      { label: 'World IP Review(일본 지식재산고등법원, 2025)', url: 'https://www.worldipreview.com/artificial-intelligence/inventors-on-patents-must-be-human-japan-court-tells-dabus-owner' },
    ],
  },
  // ── 상표권 (3) ──
  {
    id: 'tmmake', right: '상표권', rightEmoji: '™️',
    title: 'AI가 디자인한 로고, 상표로 등록될까?',
    hook: 'AI가 뚝딱 만든 브랜드 로고. 상표로 등록해 독점할 수 있을까?',
    sides: [
      { label: '지금처럼', stance: '누가 만들었는지는 묻지 않는다. 구별만 되면 된다.',
        points: ['상표의 핵심은 "출처를 구별하는 힘"이다', '사람이 그렸든 AI가 그렸든 소비자에겐 같은 표시다'] },
      { label: '더 엄격하게', stance: 'AI로 로고를 대량으로 찍어 선점하면 남이 쓸 표시가 줄어든다.',
        points: ['쓰지도 않을 상표를 쌓아 두기가 쉬워진다', '실제로 쓸 계획인지 더 꼼꼼히 봐야 한다'] },
    ],
    think: '로고 만들기가 쉬워진 지금, 상표 등록 문턱을 높여야 할까?',
    status: 'varies',
    realCase: { name: 'AI 생성 로고의 상표·저작권 보호', date: '상시',
      gist: '한국 상표법은 "사람이 만들었는가"를 등록 요건으로 두지 않는다. 그래서 AI가 만든 로고도 식별력이 있고 먼저 등록된 상표와 비슷하지 않으면 등록될 수 있다. 또 상표는 실제로 쓰거나 쓰려는 사람만 등록받을 수 있다. 로고 그림 자체는 사람의 창작 기여가 없으면 저작권 보호를 받지 못할 수 있다.' },
    sources: [
      { label: '국가법령정보센터(상표법 제33조 — 등록 요건)', url: 'https://www.law.go.kr/%EB%B2%95%EB%A0%B9/%EC%83%81%ED%91%9C%EB%B2%95/%EC%A0%9C33%EC%A1%B0' },
      { label: '국가법령정보센터(상표법 제3조 — 쓰거나 쓰려는 사람)', url: 'https://www.law.go.kr/%EB%B2%95%EB%A0%B9/%EC%83%81%ED%91%9C%EB%B2%95/%EC%A0%9C3%EC%A1%B0' },
      { label: '법률신문(한국 AI 저작물 등록 안내서)', url: 'https://www.lawtimes.co.kr/news/articleViewAmp.html?idxno=209882' },
    ],
  },
  {
    id: 'tmdilute', right: '상표권', rightEmoji: '™️',
    title: 'AI가 유명 브랜드를 흉내 내면?',
    hook: 'AI가 유명 로고와 비슷한 이미지를 대량으로 만들어낸다. 상표 침해일까?',
    sides: [
      { label: '침해다', stance: '소비자를 헷갈리게 하거나 브랜드 가치를 흐리면 침해다.',
        points: ['가짜 워터마크가 붙으면 출처를 오해하게 된다', '유명 상표의 식별력이 약해지는 "희석"이 생긴다'] },
      { label: '신중하게', stance: '흉내만으로 침해라 하면 안 된다. 헷갈림과 고의를 따져야 한다.',
        points: ['우연히 비슷해진 것과 베낀 것을 가르기 어렵다', '나라마다 희석 인정 기준이 다르다'] },
    ],
    think: '"비슷하다"는 느낌만으로 침해라 할 수 있을까?',
    status: 'varies',
    realCase: { name: 'Getty Images v. Stability AI', date: '2025~2026',
      gist: 'AI가 만든 이미지에 일그러진 Getty 워터마크가 찍혀 나온 사건이다. 영국 법원은 2025년 11월, 초기 모델이 만든 일부 이미지만 상표 침해로 보았다. 유명 상표의 가치를 흐린다는 "희석" 주장은 받아들이지 않았다. 미국 법원은 2026년 4월 상표 청구를 본격 심리로 넘겼을 뿐, 결론은 아직 나지 않았다.' },
    sources: [
      { label: 'Legal 500(미국 판단)', url: 'https://www.legal500.com/intelligence/united-states/intellectual-property/trademark-law-meets-generative-ai-key-takeaways-from-the-getty-v-stability-ai-ruling' },
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
      { label: '함께 쓰기', stance: '쓰는 분야가 달라 소비자가 헷갈리지 않으면 함께 쓸 수 있다.',
        points: ['같은 이름도 업종이 다르면 공존하는 경우가 많다', '핵심은 실제 "혼동 가능성"'] },
    ],
    think: '같은 이름이라도 "헷갈리지 않으면" 함께 써도 될까?',
    status: 'ongoing',
    realCase: { name: 'Gemini Data v. Google / P2B v. Google', date: '2024~진행 중',
      gist: '"Gemini"라는 이름을 먼저 등록해 쓰던 미국의 작은 AI 회사가 2024년 구글에 상표 소송을 냈다. 미국 특허상표청은 같은 해 구글의 GEMINI 상표 출원에 "헷갈릴 수 있다"며 거절 의견을 냈다. 같은 이름의 스피커 회사(P2B)는 재판 도중 구글의 사용부터 막아 달라고 했지만 받아들여지지 않았다. 두 소송 모두 최종 판결은 아직이다.' },
    sources: [
      { label: 'National Law Review(Gemini Data 소송·특허상표청 거절)', url: 'https://natlawreview.com/article/gemini-spells-double-trouble-googles-ai-gemini-data-inc-sues-trademark-infringement' },
      { label: 'govinfo(Gemini Data 사건 결정 목록)', url: 'https://www.govinfo.gov/app/details/USCOURTS-cand-3_24-cv-06412/context' },
      { label: 'IIPLA(P2B 사건 금지명령 신청 기각)', url: 'https://iipla.org/news/google-wins-trademark-suit-over-gemini-branding' },
    ],
  },
  // ── 영업비밀 (3) ──
  {
    id: 'tsstrategy', right: '영업비밀', rightEmoji: '🔒',
    title: '핵심 기술, 특허·오픈소스·영업비밀 중 무엇?',
    hook: '회사의 가장 중요한 AI 기술. 공개할까, 공유할까, 감출까? 세 갈래 길이 있다.',
    sides: [
      { label: '특허', stance: '공개하고 법으로 출원일부터 최대 20년 독점한다.',
        points: ['보호가 강하고 권리가 명확하다', '단, 내용이 세상에 공개된다'] },
      { label: '오픈소스', stance: '공유해서 생태계와 함께 성장한다.',
        points: ['많은 사람이 쓰며 표준이 될 수 있다', '단, 코드를 독점하지는 못한다(조건은 라이선스로 정한다)'] },
      { label: '영업비밀', stance: '감춰서 기간 제한 없이 독점한다.',
        points: ['공개 비용 없이 오래 지킬 수 있다', '단, 남이 스스로 개발하거나 분석해 알아내면 막을 수 없다'] },
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
    hook: 'AI가 내 휴대전화 계약을 거절했다. "왜죠?"라고 물을 권리 vs "그건 회사 비밀"이라는 방패.',
    sides: [
      { label: '설명 요구권', stance: '나에 대한 자동 결정은 이유를 설명받을 권리가 있다.',
        points: ['영향을 받는 사람은 근거를 알아야 다툴 수 있다', '"비밀"이라는 말로 모든 설명을 막을 순 없다'] },
      { label: '영업비밀', stance: '알고리즘은 기업의 핵심 자산이라 통째로 공개할 순 없다.',
        points: ['공개하면 악용·모방 위험이 크다', '전부 밝히지 않고도 설명할 방법이 있다'] },
    ],
    think: '"이유를 아는 것"과 "알고리즘을 통째로 보는 것"은 같은 요구일까?',
    status: 'varies',
    realCase: { name: '유럽사법재판소(CJEU) Dun & Bradstreet 판결', date: '2025-02',
      gist: '신용평가 점수로 휴대전화 계약이 자동 거절된 사람이 이유를 물은 사건이다. 유럽 최고법원은 "영업비밀"이라는 말만으로 설명을 거부할 수 없다고 했다. 다만 알고리즘 공식까지 공개할 필요는 없고, 비밀이 걸린 부분은 감독기관이나 법원이 따져 보게 했다. 한국도 2024년 3월부터 완전히 자동화된 결정에 설명을 요구할 권리가 생겼다.' },
    sources: [
      { label: 'Stibbe(설명 요구권)', url: 'https://www.stibbe.com/publications-and-insights/cjeu-confirms-right-of-explanation-in-battle-between-trade-secrets-and' },
      { label: '국가법령정보센터(개인정보보호법 제37조의2)', url: 'https://www.law.go.kr/%EB%B2%95%EB%A0%B9/%EA%B0%9C%EC%9D%B8%EC%A0%95%EB%B3%B4%EB%B3%B4%ED%98%B8%EB%B2%95/%EC%A0%9C37%EC%A1%B0%EC%9D%982' },
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
      gist: 'Apple은 전직 직원들이 기밀 설계를 들고 OpenAI로 옮겼다며 2026년 7월 소송을 냈다. OpenAI는 Apple이 어떤 비밀인지 밝히지 못했다며 맞선다. xAI의 비슷한 소송은 1심에서 기각됐다. 면접에서 이전 일을 묻는 것만으로 유출을 부추겼다고 볼 수 없다는 이유였고, xAI는 항소했다.' },
    sources: [
      { label: 'TechCrunch(Apple v. OpenAI)', url: 'https://techcrunch.com/2026/07/13/the-wildest-allegations-in-apples-trade-secrets-lawsuit-against-openai/' },
      { label: 'MacRumors(OpenAI 기각 신청, 2026-08)', url: 'https://www.macrumors.com/2026/08/06/openai-asks-judge-to-dismiss-apple-lawsuit/' },
      { label: 'Al Jazeera(xAI 소송 기각)', url: 'https://www.aljazeera.com/economy/2026/6/15/us-judge-dismisses-musks-xai-trade-secret-lawsuit-against-openai' },
      { label: 'DCD(xAI 항소)', url: 'https://www.datacenterdynamics.com/en/news/xai-appeals-to-ninth-circuit-after-us-court-dismisses-data-center-trade-secret-case-against-openai/' },
    ],
  },
];
