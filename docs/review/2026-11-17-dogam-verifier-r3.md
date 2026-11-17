# 도감(dogam.html) 사실 검증 보고서 — 검증자 3회차

- 검증일: 2026-11-17 · 대상: `data/issues.js` ISSUES 12건(커밋 11fd6a3 기준) + `dogam.html` 하단 고지
- 이번 회차의 질문: **사례 칸을 줄이면서(평균 242→162자) 사실이 틀어지거나 오해를 낳게 단순화됐는가?**
- 방법: 2회차 보고서의 결론은 믿지 않고, 줄어든 현재 문장을 출처와 다시 대조했다. 고유 출처 링크 30개는 모두 curl로 상태를 봤다. 새로 붙은 출처 5개(ChatGPT Is Eating the World 2026-08, World IP Review, 9to5Mac, DCD, 작가조합 해설)와 핵심 기존 출처(Hunton, Al Jazeera, TechCrunch, Morgan Lewis, 법률신문, Gibson Dunn, Legal 500, govinfo)는 본문을 내려받아 해당 문장을 찾아 맞춰 봤다. 상표법 제3조와 개인정보보호법 제37조의2는 국가법령정보센터 페이지를 헤드리스 Edge로 그려서 조문을 직접 읽었다.
- 원칙: 코드·데이터는 고치지 않았다. 교체 문구는 verify-dogam 규칙(사례 칸 200자 이하·문장 80자 이하·괄호 1개 이하·단정 금칙어 없음)에 맞춰 길이를 재 두었다. 현재 데이터는 `node test/verify-dogam.mjs` 전체 PASS.
- 표기: **[확인함]** 이번 세션에서 출처 본문이나 조문을 직접 확인 · **[2차]** 검색 요약·2차 자료로만 확인 · **[미확인]** 근거를 찾지 못함

---

## 0. 점수판

**사실 점수: 1회차 33.3 → 2회차 88.9 → 3회차 91.7** (33/36)

| id | 2회차 | 3회차 | 사유 한 줄 |
|---|---|---|---|
| train | 3 | **3** | 줄인 문장이 작가조합 해설과 그대로 맞음: "합법적으로 산 책으로 학습 = 공정이용, 해적판 = 공정이용 아님", 15억 달러. Ross를 뺀 건 사실 누락이 아니라 범위 축소 |
| aiwork | 3 | **2** | 문장은 다 맞음("항소법원 판결이 확정됐다"는 상고 불허라 정확). 그러나 2회차에 `decided` 배지를 맞다고 본 근거였던 단서("사람이 개입한 AI 보조 창작물은 별개, 다투는 중")가 잘려 나감 → 제목 옆 "⚖️ 판결" 배지가 "기획자에게 인정" 쪽 논쟁까지 끝난 것처럼 읽힘 |
| provider | 2 | **3** | 새 출처(ChatGPT Is Eating the World, 2026-08-07)가 "NYT·Daily News가 '이용자 직접 침해에 대한 기여 책임' 청구를 접었고 법원이 재소 불가로 정리"를 그대로 뒷받침. "알기만 한 회사에는 책임을 묻기 어렵다"는 Hunton의 "knowledge … is not sufficient"와 맞음 |
| oss | 3 | **3** | "AI가 새로 만든 코드에 표시가 없다고 해서 제거로 볼 수 없다"는 Gibson Dunn("simply generated new code that never contained CMI")과 정확히 일치 |
| patprotect | 3 | **3** | 줄인 문장도 지식재산처 안내서 취지와 맞음 |
| inventor | 2 | **3** | 일본 최고재판소 날짜를 빼고 "일본 법원"으로 바꾸면서 World IP Review(2025-02, 일본 지식재산고등법원) 출처로 뒷받침됨. 최고재판소 2026-03 상고 기각도 국내외 보도로 확인 [2차]. 한국 1·2심 맞음 |
| tmmake | 3 | **2** | 양측 모두 의견으로는 문제없음. 다만 B측이 "실제로 쓸 계획인지 더 꼼꼼히"를 들고 나왔는데, 사례 칸이 등록 요건을 "식별력 + 선등록 상표와 안 비슷함"으로만 적어 **상표법 제3조(쓰거나 쓰려는 사람만 등록)** 가 빠짐 → 학생이 "지금은 쓸 계획을 전혀 안 본다"로 잘못 전제할 수 있음 |
| tmdilute | 3 | **3** | Legal 500(2026-04-23 기각 신청 불허, 희석 포함 진행)과 일치. 영국 부분도 맞음 |
| tmname | 3 | **3** | "거절 의견을 냈다"로 정확해짐. govinfo 결정 목록의 마지막 항목이 2026-09-29 일정 명령 → "아직 재판 준비 단계" 맞음 |
| tsstrategy | 2 | **3** | 영업비밀 단점이 "남이 스스로 개발하거나 분석해 알아내면 막을 수 없다"로 고쳐짐. 법리 맞음 |
| explain | 3 | **3** | "자동화된 결정"은 제37조의2가 '완전히 자동화된 시스템…으로 이루어지는 결정'을 줄여 부르는 법률 용어 그 자체라 틀리지 않음. 다만 일반 독자용으로 "완전히"를 넣으면 더 좋음(참고) |
| tsleak | 2 | **2** | Apple 증거 조기 열람(9to5Mac)·xAI 항소(DCD)는 출처와 맞음. 그러나 "OpenAI는 어떤 비밀인지 밝히지 못했다며 맞서고"는 카드 출처 4개 중 어디에도 없음(TechCrunch는 7월 소장 기사, 9to5Mac은 증거 열람 결정) |

- 0점(상) 0건 · 1점(중) 0건 · 2점(하) 3건 · 3점 9건
- **출처 링크 생존율: 29/30 = 96.7%** (고유 URL 기준. 카드별 항목 32개 기준 30/32 = 93.8% — Lexology가 두 카드에 걸려 있음). 403은 Lexology 1개(2회차와 같음)
- **미확인: 6건**(§4)

### 핵심 질문에 대한 답 — 줄이면서 틀어졌는가?

**틀린 사실은 생기지 않았다.** 의뢰서가 짚은 다섯 군데를 하나씩 봤다.

| 짚은 곳 | 판단 | 근거 |
|---|---|---|
| provider "알기만 한 회사에는 책임을 묻기 어렵다" | 정확 | Hunton: "an ISP's knowledge that its subscribers are committing copyright infringement is not sufficient to establish contributory liability" [확인함]. "다른 사건에서"라고 밝혀 NYT 사건 판결로 오해할 여지도 막음 |
| aiwork "항소법원 판결이 확정됐다" | 정확 | Morgan Lewis: 2026-03-02 상고 불허, "leaving in place the … DC Circuit's refusal" [확인함]. 상고 불허로 판결이 확정된 것이 맞고, 대법원이 직접 판단했다고 쓰지도 않음. **문제는 문장이 아니라 잘려 나간 단서**(위 점수 사유) |
| tmmake B측 "실제로 쓸 계획인지 더 꼼꼼히 봐야 한다" | 의견으로는 괜찮음, 사례 칸 보완 필요 | 상표법 제3조 ① "국내에서 상표를 사용하는 자 또는 사용하려는 자는 자기의 상표를 등록받을 수 있다" [확인함 — 조문 직접]. "더"가 지금도 확인한다는 걸 전제하므로 B측 문장 자체는 현행 제도를 틀리게 전제하지 않는다. 다만 사례 칸이 이 요건을 안 적어 학생에게는 전제가 보이지 않는다 → 지적 2 |
| tsleak xAI 사유 "면접에서 이전 일을 묻는 것만으로 유출을 부추겼다고 볼 수 없다" | 정확(좁은 요약) | Al Jazeera: "asking job candidates to discuss their prior work was routine, and one could not infer that OpenAI pushed Li to leak anything confidential" [확인함]. DCD가 인용한 더 넓은 사유("OpenAI가 유출을 부추겼거나 훔친 비밀을 썼다는 사실 주장이 없다")의 한 갈래라 틀리지 않음 → 참고만 |
| explain "자동화된 결정에 설명을 요구할 권리" | 정확(법률 용어 그대로) | 제37조의2 ① "완전히 자동화된 시스템…으로 … 이루어지는 결정(… 이하 이 조에서 '자동화된 결정'이라 한다)", ② "자동화된 결정을 한 경우에는 … 설명 등을 요구할 수 있다" [확인함 — 조문 직접]. 법이 그 용어를 쓰므로 감점하지 않음 → 참고만 |

줄이는 과정에서 생긴 문제는 **사실 오류가 아니라 "잘린 단서"** 두 곳(aiwork 배지 단서, tmmake 사용 의사 요건)이다.

---

## 1. 남은 지적

### 지적 1 — aiwork: `decided` 배지를 받쳐 주던 단서가 잘림 (하)

- 배지는 제목 줄(`render.js` 34행)에 붙어 "AI가 그린 그림, 저작권은 누구 것? ⚖️ 판결"로 보인다. 그런데 이 카드의 두 편 중 하나는 "기획자에게 인정"(프롬프트·수정·선택도 창작)이다. 결론이 난 것은 **AI가 혼자 만든 경우**뿐이고, 사람이 얼마나 관여해야 하는지는 끝나지 않았다.
- Morgan Lewis도 "the Court denial of certiorari … would not prevent the Court from considering the human authorship requirement in future cases"라고 적었다 [확인함]. 미국의 AI 보조 작품 소송(Allen v. Perlmutter, 콜로라도 연방지법)은 2026-01까지 약식판결 서면이 오간 기록만 찾았고, 그 뒤 판결은 찾지 못했다 [2차/미확인]. 그래서 교체 문구에 사건 이름은 넣지 않았다.
- 한국 안내서도 "사람의 창작적 기여가 인정될 수 있는 부분"(수정·선택·배열 등)을 따로 다룬다 [확인함 — 법률신문].
- 근거: https://www.morganlewis.com/pubs/2026/03/us-supreme-court-declines-to-consider-whether-ai-alone-can-create-copyrighted-works

**교체 문구** (gist 끝에 한 문장 추가 — 190자, 문장 최대 53자, 괄호 1개)
```js
gist: 'AI가 혼자 만든 그림의 저작권 등록을 두고 다툰 사건이다. 미국 항소법원은 "저작물은 사람이 만들어야 한다"고 판결했다. 2026년 3월 대법원이 상고를 받지 않아 이 판결이 확정됐다. 한국 정부 안내서(2025-06)도 사람이 창작적으로 기여한 부분만 등록할 수 있다고 안내한다. 사람이 얼마나 관여해야 보호받는지는 아직 다퉈지고 있다.' },
```

### 지적 2 — tmmake: 사례 칸에 "쓰거나 쓰려는 사람만 등록" 요건이 없음 (하)

- 3회차에서 B측이 "AI로 대량으로 찍어 선점 → 실제로 쓸 계획인지 더 꼼꼼히"로 바뀌었다. 한쪽 주장이라 의견이어도 되고, "더"가 현행 확인을 전제하므로 틀리지 않다.
- 그러나 사례 칸은 등록 조건을 "식별력이 있고 먼저 등록된 상표와 비슷하지 않으면"으로만 적는다. 한국 상표법 제3조 ①은 **사용하거나 사용하려는 자**만 등록받을 수 있다고 정한다 [확인함 — 국가법령정보센터 조문 직접]. 이게 빠지면 학생은 "지금은 쓸 계획을 전혀 안 본다 → B측이 새 제도를 만들자는 것"으로 읽게 되고, 토론의 전제가 틀어진다.
- 근거: https://www.law.go.kr/%EB%B2%95%EB%A0%B9/%EC%83%81%ED%91%9C%EB%B2%95/%EC%A0%9C3%EC%A1%B0

**교체 문구** (gist 167자, 문장 최대 52자, 괄호 0개 + 출처 1개 추가)
```js
gist: '한국 상표법은 "사람이 만들었는가"를 등록 요건으로 두지 않는다. 그래서 AI가 만든 로고도 식별력이 있고 먼저 등록된 상표와 비슷하지 않으면 등록될 수 있다. 또 상표는 실제로 쓰거나 쓰려는 사람만 등록받을 수 있다. 로고 그림 자체는 사람의 창작 기여가 없으면 저작권 보호를 받지 못할 수 있다.' },
```
```js
{ label: '국가법령정보센터(상표법 제3조 — 쓰거나 쓰려는 사람)', url: 'https://www.law.go.kr/%EB%B2%95%EB%A0%B9/%EC%83%81%ED%91%9C%EB%B2%95/%EC%A0%9C3%EC%A1%B0' },
```
※ 원래 사례 칸에서 빠진 "다만"을 "또"로 바꿔 접속어가 겹치지 않게 했다. 출처는 지금 3개라 4개가 된다(tsleak도 4개).

### 지적 3 — tsleak: "OpenAI는 어떤 비밀인지 밝히지 못했다며 맞서고"의 출처 없음 (하)

- 사실 자체는 맞다: OpenAI는 2026-08-05 기각 신청에서 "Apple never properly identified what information actually counts as a protectable trade secret"이라고 주장했다 [확인함 — MacRumors 2026-08-06 본문].
- 그런데 카드 출처 중 TechCrunch(2026-07-13)는 Apple 소장 내용, 9to5Mac(2026-10-13)은 증거 조기 열람 결정("OpenAI opposed the motion, arguing that Apple's demands were overly broad")이라 이 문장을 직접 받치지 못한다 [확인함].
- 기각 신청 판단: 심리가 2026-10 초·중순에 잡혀 있었다는 보도까지만 찾았고 결과는 찾지 못했다 [미확인]. 판단이 났다면 "맞서고"가 낡을 수 있으니 교사가 한 번 더 볼 것.
- 근거: https://www.macrumors.com/2026/08/06/openai-asks-judge-to-dismiss-apple-lawsuit/ (curl 200, 본문 확인)

**교체 문구** (gist는 그대로, sources에 하나 추가)
```js
{ label: 'MacRumors(OpenAI 기각 신청, 2026-08)', url: 'https://www.macrumors.com/2026/08/06/openai-asks-judge-to-dismiss-apple-lawsuit/' },
```
※ 출처가 5개가 되는 게 부담이면 TechCrunch를 빼고 MacRumors로 바꿔도 된다. 다만 TechCrunch가 "기밀 설계를 들고 옮겼다"를 가장 자세히 받치므로 남기는 쪽을 권한다(9to5Mac도 같은 주장을 짧게 소개함).

### 참고(점수에 반영 안 함)

- **explain**: "한국도 2024년 3월부터 자동화된 결정에…"는 법률 용어 그대로라 정확하다. 학생이 "AI가 조금이라도 쓰이면 다 해당"으로 읽지 않게 하려면 `'한국도 2024년 3월부터 완전히 자동화된 결정에 설명을 요구할 권리가 생겼다.'`(문장 44자, gist 185자). 국가법령정보센터에 2026-09-08 개정, 2027-03-09 시행 표시가 있으니 2027년 3월 이후 다시 볼 것(2회차와 같음).
- **inventor**: "대법원 선고 소식은 아직 없다"는 이번에도 선고 보도를 찾지 못해 틀렸다고 볼 근거는 없다[미확인 — 없음을 증명할 수는 없음]. 2회차에 있던 "2026년 2월 기준"이 빠졌으니, 기준 시점을 붙이려면 `'한국도 1·2심이 "AI는 발명자가 될 수 없다"고 했고, 대법원 선고는 아직 없다(2026-11 기준).'`(문장 59자, gist 188자, 괄호 1개). 독일 문장은 카드에 출처가 없다(2회차부터 그대로, 사실은 맞음).
- **inventor**: World IP Review 기사는 유료라 본문은 못 읽었고, 제목·부제("Japan IP High Court follows decisions in UK, US and Europe that machines cannot be recognised as inventors", 2025-02-03)까지만 확인했다. 카드 문장("일본 법원은 … 받아들이지 않았다")을 받치기에는 충분하다. 학생이 눌렀을 때 유료 벽이 뜬다는 점은 평가자 몫.
- **tsleak**: xAI 사유는 Al Jazeera 판사 인용과 맞다. 더 넓게 쓰려면 DCD가 인용한 판결문("xAI does not allege any facts indicating that OpenAI induced xAI's former employees to steal … or that these former xAI employees used any stolen trade secrets")에 맞춰 `'OpenAI가 유출을 부추기거나 그 비밀을 썼다고 볼 근거가 없다는 이유였고, xAI는 항소했다.'` — 지금 문장이 인재 이동이라는 카드 주제에 더 잘 맞으므로 그대로 둬도 된다.
- **provider**: Hunton은 Cox 판결을 "7-2"로 적고 소토마요르·잭슨이 결론에만 동의했다고 쓴다(결론은 9-0). 카드는 표결을 적지 않으므로 상관없다.
- **train**: 작가조합 해설은 "Judge Alsup certified the class only for piracy … the fair use ruling on training applies only with respect to the three named plaintiffs"라고도 적는다. 카드의 "한 1심 법원은 … 보았다"는 이 범위를 넘지 않는다.

---

## 2. 배지(status) 점검

| id | 배지 | 판단 |
|---|---|---|
| train | ongoing | 맞음 — 지상파 3사 v. 네이버는 5차 이후 변론까지 진행, 판결 보도 없음 [2차] |
| aiwork | decided | 사례(Thaler)는 확정이라 맞음. 다만 제목 옆 배지가 쟁점 전체를 덮으므로 지적 1 반영 권장 |
| provider | ongoing | 맞음 — NYT 직접 침해 청구 계속 |
| oss | ongoing | 맞음 — 계약 청구 1심 계속 |
| patprotect · tsstrategy | varies | 맞음 — 전략 선택 |
| inventor | varies | 맞음 — 독일만 다른 길, 한국 대법원 계속 |
| tmmake | varies | 받아들일 만함 |
| tmdilute | varies | 맞음 — 영국 1심 판결(항소심 진행 중, 주로 저작권 쟁점) vs 미국 초기 |
| tmname | ongoing | 맞음 — 두 사건 모두 판결 없음 |
| explain | varies | 맞음 |
| tsleak | ongoing | 맞음 — Apple 1심 초기, xAI 제9항소법원 |

미결 카드에 결론 단정 표현 없음(verify-dogam [미결 카드 요지에 결론 단정 없음] PASS). "확정됐다"는 `decided` 카드(aiwork)에만 있다.

---

## 3. 출처 링크 점검 (curl, 2026-11-17)

| URL(줄임) | 상태 | 카드 문장과 대조 |
|---|---|---|
| authorsguild …final-approval | 200 | 2회차 확인(합의 최종 승인) |
| authorsguild …what-authors-need-to-know (신규) | 200 | **맞음** — 합법 취득 책 학습 = 공정이용, 해적판 = 공정이용 아님, 15억 달러·약 3천 달러 [확인함] |
| news.mtn.co.kr …2026040915330140911 | 200 | 맞음 |
| morganlewis …thaler | 200 | **맞음** — 2026-03-02 상고 불허, DC Circuit 판단 유지 [확인함] |
| bakerdonelson …thaler | 200 | 2회차 확인 |
| lawtimes …209882 (2개 카드) | 200 | **맞음** — 사람의 창작적 기여 부분만 등록 [확인함] |
| hunton …knowledge-is-not-enough | 200 | **맞음** — 알기만 해선 부족 [확인함] |
| chatgptiseatingtheworld …2026/08/07 (신규) | 200 | **맞음** — NYT·Daily News "material contribution" 기여 책임 청구, 이용자 직접 침해 전제, 재소 불가 기각 [확인함] |
| nortonrosefulbright …2026 | 200 | 2회차 확인 |
| gibsondunn …ninth-circuit | 200 | **맞음** — 2026-09-16, 새로 만든 코드는 표시를 담은 적이 없음 [확인함] |
| eff.org …victory-appeals-court | 200 | 2회차 확인 |
| githubcopilotlitigation.com | 200 | 원고 측 사이트, 본문 미열람 |
| lexology …15568a55 (2개 카드) | **403** | **확인 불가** |
| heraldk …2026060818200872635 | 200 | 2회차 확인 |
| shinkim …lawinfo/373 | 200 | 2회차 확인 |
| juve-patent …dabus | 200 | 2회차 확인(제목 일치) |
| worldipreview …japan-court (신규) | 200 | 제목·부제·날짜로 **맞음**, 본문은 유료 |
| law.go.kr 상표법 제33조 | 200 | 2회차 확인 |
| gerbenlaw …ai-guided-trademark | 200 | 2회차 확인 |
| legal500 …getty | 200 | **맞음** — 2026-04-23 기각 신청 불허, 희석 진행 [확인함] |
| taylorwessing …getty-vs-stability-trade-marks | 200 | 본문 미열람(2회차와 같음) |
| natlawreview …gemini-data | 200 | 2회차 확인 |
| govinfo …cand-3_24-cv-06412 | 200 | **맞음** — 마지막 항목 2026-09-29 일정 명령, 판결 없음 [확인함] |
| iipla …google-wins | 200 | 2회차 확인 |
| stibbe …cjeu | 200 | 2회차 확인 |
| law.go.kr 개인정보보호법 제37조의2 | 200 | **맞음** — 헤드리스 Edge로 조문 재확인 [확인함] |
| techcrunch …apple…openai | 200 | **맞음** — 소장 주장 [확인함]. 기각 신청 내용은 없음(지적 3) |
| 9to5mac …apple-wins-early-access (신규) | 200 | **맞음** — 2026-10-13 Davila 판사가 Apple의 증거 조기 열람 요청 대부분을 일부 허락 [확인함] |
| aljazeera …xai | 200 | **맞음** — 2026-06-15 재소 불가 기각, 면접 사유 [확인함] |
| datacenterdynamics …xai-appeals (신규) | 200 | **맞음** — 2026-07 제9항소법원 항소 [확인함] |

생존율 29/30(96.7%). 남은 403은 Lexology 하나(patprotect·tsstrategy 공용, 2회차와 같음). 두 카드 문장은 다른 근거로 확인돼 점수는 깎지 않았다.

---

## 4. 확인함 / 미확인

**확인함 (이번 세션에서 출처 본문 또는 조문 직접 확인)**
- Bartz 판단 요지(합법 취득 책 학습 = 공정이용, 해적판 = 아님)·15억 달러 합의 — 작가조합 해설
- Thaler 상고 불허 2026-03-02, DC Circuit 판단 유지 — Morgan Lewis / 한국 등록 안내서(사람의 창작적 기여 부분만) — 법률신문
- Cox v. Sony "알기만 해선 부족" — Hunton / NYT·Daily News 기여 책임 청구 정리 2026-08 — ChatGPT Is Eating the World
- Doe v. GitHub 2026-09-16, 새로 만든 코드 — Gibson Dunn
- 일본 지식재산고등법원 2025 판단 — World IP Review 제목·부제
- 상표법 제3조 ①(사용하거나 사용하려는 자) 조문
- Getty 미국 2026-04-23 기각 신청 불허·희석 진행 — Legal 500
- Gemini Data 사건 결정 목록(2026-09-29까지 판결 없음) — govinfo
- 개인정보보호법 제37조의2 ①②("자동화된 결정" = 완전히 자동화된 결정) 조문
- Apple 소장 주장 — TechCrunch / Apple 증거 조기 열람 일부 허락 2026-10-13 — 9to5Mac / OpenAI 기각 신청 사유("never properly identified … trade secret") — MacRumors
- xAI 2026-06-15 기각 사유 — Al Jazeera / xAI 2026-07 항소 — DCD

**2차 자료로만 확인**
- 일본 최고재판소 2026-03 상고 기각(국민일보·네이트 보도 3월 4일 기각, 영문 보도 3월 6일로 엇갈림)
- 지상파 3사 v. 네이버 진행 중(기자협회보 등, 5차 이후 변론)
- Getty 영국 판결 세부(Taylor Wessing 본문 미열람)
- Allen v. Perlmutter 2026-01까지 서면 공방

**미확인 (6건)**
1. Lexology 기사(patprotect·tsstrategy 출처) 본문 — 403
2. Apple v. OpenAI 기각 신청 판단(2026-10 심리 이후) — 결과 보도 못 찾음
3. 한국 DABUS 대법원(2024두45177) 선고 여부 — 선고 보도 못 찾음(없음을 증명할 수는 없음)
4. World IP Review 본문 — 유료, 제목·부제만 확인
5. Allen v. Perlmutter 2026-01 이후 판단 — 지적 1 교체 문구는 사건 이름을 넣지 않아 이 결과와 무관하게 성립
6. tsstrategy 영업비밀 법리(독자 개발·역설계는 못 막음)의 부정경쟁방지법 조문 — 이번에도 재열람 안 함, 일반 법리 기억 기반

**기억 기반(낮은 위험)**: 서울행정법원 2023-06-30(1회차 확인), 개인정보보호법 제37조의2 시행 2024-03-15(1회차 확인), 특허 존속기간 출원일부터 20년, 독일 연방대법원 2024 DABUS 판단, 영국 대법원 2023-12 DABUS 판단.
