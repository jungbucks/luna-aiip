# 도감(dogam.html) 사실 검증 보고서 — 검증자 2회차

- 검증일: 2026-11-17 · 대상: `data/issues.js` ISSUES 12건(커밋 dc0ead5 기준) + `dogam.html` 하단 고지
- 방법: 1회차 결론을 전제로 두지 않고, 현재 문장을 웹 출처(판결 보도·법원 기록·로펌·법률 매체·국가법령정보센터)로 다시 확인했다. 출처 링크 27개(중복 빼고)는 curl로 상태를 보고, 대부분은 본문을 열어 카드 문장과 맞는지 대조했다. 국가법령정보센터 링크 2개는 스크립트로 그려지는 페이지라 헤드리스 Edge로 그려서 조문을 직접 읽었다.
- 원칙: 코드·데이터는 고치지 않았다. 아래 교체 문구에는 verify-dogam 금칙어(정답은·무조건·반드시 승소·반드시 이긴다)를 쓰지 않았다.
- 표기: **[확인함]** 이번 세션에서 출처를 직접 확인 · **[2차]** 검색 요약이나 2차 자료로만 확인 · **[미확인]** 근거를 찾지 못함

---

## 0. 점수판

**사실 점수: 1회차 33.3 → 2회차 88.9** (32/36)

| id | 1회차 | 2회차 | 사유 한 줄 |
|---|---|---|---|
| train | 1 | **3** | Bartz(1심 판단, 합의 2026-07-20 최종 승인, 한 권당 약 3천 달러), Ross 제3항소법원 2026-09-29, 지상파 3사 v. 네이버(서울중앙지법, 2026-04 4차 변론) 모두 출처와 맞음 |
| aiwork | 2 | **3** | Thaler 상고 불허 2026-03-02, "직접 이유를 밝힌 판결은 아님"이라는 단서 정확. 한국 등록 안내서(2025-06 자료실 등록, 2025-07 보도)도 맞음 |
| provider | 1 | **2** | 문장은 모두 사실(Cox v. Sony 판결 요지, NYT의 기여 책임 주장 철회). 다만 **NYT가 주장을 접었다는 문장을 뒷받침하는 출처가 카드에 없다** |
| oss | 0 | **3** | 제9항소법원 2026-09-16 DMCA 1202(b) 기각 유지, 학습 단계는 판단 안 함, 라이선스(계약) 청구는 1심에 남아 있음 — 모두 맞음 |
| patprotect | 2 | **3** | "출원일부터 최대 20년"으로 고쳐짐. 지식재산처 안내서(AI 자체 발명은 하드웨어와 결합해 정보처리를 해야 함)와 gist가 맞음 |
| inventor | 1 | **2** | 한국 DABUS(서울고법 2024-05-16 2023누52088, 대법원 2024두45177 계속) 정확, "2026년 2월 기준" 단서도 적절. 다만 **일본 최고재판소(2026-03)를 뒷받침하는 출처가 없다**(Jones Day 링크는 2024년 도쿄지법 판단) |
| tmmake | 0 | **3** | 상표법 제33조에 "누가 만들었나" 요건이 없음을 조문으로 확인. 교사 의도("AI가 만들었다고 상표가 안 되는 건 아니다")가 법적으로 정확하게 전달됨 |
| tmdilute | 1 | **3** | 영국: 초기 버전(v1.x·v2.x) 일부 출력만 "과거의, 아주 제한적인" 침해, 10조 3항(희석) 기각. 미국: 2026-04-23 기각 신청 불허(소송 초기). 정확 |
| tmname | 0 | **3** | Gemini Data v. Google은 2026-09-29까지 판결 없음(govinfo). P2B v. Google은 2026-03-20 결정, IIPLA 링크 라벨도 P2B로 바로잡힘. `ongoing` 배지 맞음 |
| tsstrategy | 2 | **2** | 오픈소스 문구는 고쳐짐. 그러나 영업비밀 쪽 "**유출되면 보호가 사라진다**"는 법적으로 부정확(유출은 소송으로 다툴 수 있음 — 바로 tsleak 카드의 내용). 남이 스스로 개발·분석해 알아내는 건 못 막는다는 점이 빠짐 |
| explain | 1 | **3** | CJEU C-203/22(2025-02-27, 휴대전화 계약 거절) 요지와 영업비밀 정보를 감독기관·법원에 내 저울질하는 구조가 출처와 맞음. 개인정보보호법 제37조의2 조문을 국가법령정보센터에서 직접 확인 |
| tsleak | 1 | **2** | 문장은 사실(Apple 2026-07-10 제소·OpenAI 기각 신청, xAI 2026-06-15 기각 사유). 다만 **xAI 항소의 출처가 없고**, Apple 사건은 2026-10 법원이 Apple에 증거 조기 열람을 일부 허락한 뒤라 "맞서고 있다"만으로는 낡음 |

- 0점(상) 0건 · 1점(중) 0건 · 2점(하) 4건 · 3점 8건
- **출처 링크 생존율: 26/27 = 96.3%** (고유 URL 기준. 카드별 항목 29개 기준 27/29 = 93.1% — Lexology가 두 카드에 걸려 있음). 살아 있지 않거나 내용을 확인할 수 없는 링크는 Lexology 1개(403, 봇 차단으로 추정, 본문 확인 불가)
  - 살아 있지만 카드의 **특정 문장을 뒷받침하지 못하는** 경우(링크 자체는 주장과 어긋나지 않음): provider의 NYT 철회 문장, inventor의 일본 최고재판소, tsleak의 xAI 항소 → 아래 지적 1~3
- **미확인: 6건**(§3)

---

## 1. 남은 지적

### 지적 1 — provider: NYT 철회 문장의 출처 없음 (하)

- 현재 출처 2개 중 Hunton은 Cox v. Sony 판결만, Norton Rose Fulbright(2026-03 게시)는 NYT 철회 이전 기사라 철회 이야기가 없다. [확인함]
- 사실 자체는 맞다 [확인함]: 2026-06-25 NYT가 OpenAI의 판결 신청에 대응하며 OpenAI 상대 기여 책임 청구를 완전히 접었고, 2026-08 Stein 판사가 뉴스 원고들(NYT·Daily News)의 "이용자 침해를 도운" 기여 책임 청구를 OpenAI·MS 모두에 대해 재소 불가로 정리하고, MS 상대 새 기여 책임 이론 추가는 허락하지 않았다.
- Cox v. Sony: 2026-03-25, 결론은 만장일치(토머스 대법관 다수의견, 소토마요르·잭슨은 결론에만 동의). "알고만 있었다"로는 부족하고, 침해를 부추겼거나 침해용으로 만든 서비스여야 한다 [확인함 — Hunton, AIPLA]. 카드 문장과 맞다.
- 근거: https://chatgptiseatingtheworld.com/2026/08/07/judge-stein-denies-news-plaintiffs-leave-to-add-new-contributory-infringement-claim-v-microsoft-news-plaintiffs-ziff-davis-already-abandoned-contributory-infringement-claim-foreclosed-by-cox-commun/ (curl 200, 본문 확인) · https://chatgptiseatingtheworld.com/2026/06/25/new-york-times-abandons-contributory-infringement-claim-v-openai-in-light-of-supreme-courts-cox-decision/

**교체 문구** (gist는 그대로, sources에 하나 추가)
```js
{ label: 'ChatGPT Is Eating the World(NYT 기여 책임 청구 정리, 2026-08)', url: 'https://chatgptiseatingtheworld.com/2026/08/07/judge-stein-denies-news-plaintiffs-leave-to-add-new-contributory-infringement-claim-v-microsoft-news-plaintiffs-ziff-davis-already-abandoned-contributory-infringement-claim-foreclosed-by-cox-commun/' },
```
※ 원하면 gist 마지막 문장을 조금 더 정확히: `'그 뒤 뉴욕타임스는 "이용자의 침해를 OpenAI가 도왔다"는 주장을 접었고(2026-08 법원이 정리), OpenAI가 직접 베꼈다는 주장으로 재판을 이어 가고 있다.'`

### 지적 2 — inventor: 일본 최고재판소 판단의 출처 없음 (하)

- 일본 최고재판소 제2소법정이 2026년 3월 초 Thaler의 상고를 기각했다 [2차 — 여러 보도가 일치, 날짜는 3월 4일(수)/3월 6일 보도로 엇갈림]. 카드의 "2026-03" 표기는 안전하다.
- 그런데 카드의 일본 출처(Jones Day)는 **2024-05 도쿄지방법원** 판단 기사다 [확인함]. 라벨 "일본 법원 판단"은 틀리지 않지만, 학생이 최고재판소 판단의 출처로 오해한다.
- 한국 경과(세종 뉴스레터): 서울고법 2024-05-16 2023누52088 "AI는 발명자가 될 수 없다", 대법원 2024두45177 상고심 계속 [확인함]. 서울행정법원(2023-06-30, 2022구합89524)은 세종 페이지에는 안 나오고 1회차 확인·기억에 기댄다 [2차]. 2026-02 이후 대법원 선고는 찾지 못함 [미확인] — 카드가 "2026년 2월 기준"을 달아 둔 것은 적절.
- 근거: https://www.mlex.com/mlex/amp/articles/2294484 (curl 200, 본문은 403 — 유료일 수 있음, 내용 미확인)

**교체 문구**
```js
{ label: 'Jones Day(일본 1심 판단, 2024)', url: 'https://www.jonesday.com/en/insights/2024/06/tokyo-court-holds-ai-system-cannot-be-inventor-under-patent-law' },
{ label: 'MLex(일본 최고재판소 판단, 2026)', url: 'https://www.mlex.com/mlex/amp/articles/2294484' },
```
※ MLex는 본문을 못 열어 봤다. 교사가 브라우저로 열어 보고 유료 벽이면 넣지 말고 Jones Day 라벨만 고칠 것.

### 지적 3 — tsleak: xAI 항소 출처 없음 + Apple 사건 갱신 (하)

- xAI: 2026-02-24 1차 기각(수정 허락) → 2026-06-15 재소 불가 기각, 사유는 "면접에서 이전 일을 묻는 것은 흔한 일이라 유출을 부추겼다고 볼 수 없다"(Al Jazeera 인용: "To hold otherwise would potentially expose employers to liability any time they inquire about a candidate's past work.") [확인함]. 카드 문장과 맞다. 2026-07 제9항소법원에 항소, OpenAI는 기각 유지를 요청 [2차]. 그러나 카드 출처(Al Jazeera, 6-15)는 항소 전 기사라 "항소해 다투고 있다"를 뒷받침하지 못한다.
- Apple: 2026-07-10 제소, 피고 OpenAI·io 등, 전 직원이 금속 마감 설계 등을 가져가고 채용 면접에 "실제 부품·CAD 자료"를 가져오라 했다는 주장 [확인함 — TechCrunch]. OpenAI 기각 신청(2026-08)은 2026-10-01 심리 예정이었고 결과 보도는 찾지 못함 [미확인]. 대신 **2026-10-13·10-27 Davila 판사가 Apple의 증거 조기 열람(포렌식 이미지·면접 자료·증인 신문 등)을 일부 허락**했다 [2차 — 9to5Mac 등, 침해 여부 판단은 아님].
- 근거: https://www.datacenterdynamics.com/en/news/xai-appeals-to-ninth-circuit-after-us-court-dismisses-data-center-trade-secret-case-against-openai/ (curl 200) · https://9to5mac.com/2026/10/13/apple-wins-early-access-to-openai-documents-and-employee-testimony-in-trade-secrets-lawsuit/ (curl 200)

**교체 문구**
```js
realCase: { name: 'Apple v. OpenAI / xAI v. OpenAI', date: '2025~2026',
  gist: 'Apple은 전직 직원들이 기밀 설계를 들고 OpenAI로 옮겼고 채용 과정에서도 기밀을 요구했다며 2026년 7월 소송을 냈다. OpenAI는 "어떤 비밀인지 구체적으로 밝히지 못했다"며 소송을 끝내 달라고 맞서고 있고, 법원은 10월 Apple이 일부 증거를 먼저 살펴볼 수 있게 허락했다(침해 여부를 판단한 것은 아니다). xAI가 OpenAI를 상대로 낸 비슷한 소송은 1심에서 "면접에서 이전 경력을 묻는 것만으로 비밀 유출을 유도했다고 보기 어렵다"는 이유로 기각됐고(2026-06), xAI가 항소해 다투고 있다. 인재 이동과 영업비밀 보호의 경계가 계속 다퉈지고 있다.' },
sources: [
  { label: 'TechCrunch(Apple v. OpenAI)', url: 'https://techcrunch.com/2026/07/13/the-wildest-allegations-in-apples-trade-secrets-lawsuit-against-openai/' },
  { label: '9to5Mac(Apple 증거 조기 열람 허락, 2026-10)', url: 'https://9to5mac.com/2026/10/13/apple-wins-early-access-to-openai-documents-and-employee-testimony-in-trade-secrets-lawsuit/' },
  { label: 'Al Jazeera(xAI 소송 기각)', url: 'https://www.aljazeera.com/economy/2026/6/15/us-judge-dismisses-musks-xai-trade-secret-lawsuit-against-openai' },
  { label: 'DCD(xAI 항소)', url: 'https://www.datacenterdynamics.com/en/news/xai-appeals-to-ninth-circuit-after-us-court-dismisses-data-center-trade-secret-case-against-openai/' },
],
```
※ 9to5Mac 문장은 본문을 직접 열지 않고 검색 요약으로 확인했다[2차]. 넣기 전 한 번 열어 볼 것. 싫으면 "법원은 10월…" 한 구절과 9to5Mac 링크를 빼고 DCD만 더해도 지적은 풀린다(그 경우 Apple 부분 갱신은 남음).

### 지적 4 — tsstrategy: "유출되면 보호가 사라진다" (하, 법리)

- 영업비밀은 몰래 빼 간 사람(부정취득·부정사용)을 상대로 금지·손해배상을 청구할 수 있다. 직원이 들고 나가도 보호가 바로 사라지지 않는다 — 같은 도감의 tsleak 카드가 바로 그 소송들이다. 보호가 끝나는 건 **비밀성을 잃었을 때**(세상에 공개됨)이고, 영업비밀의 진짜 약점은 **남이 스스로 개발하거나 제품을 분석해 알아내는 것(리버스 엔지니어링)은 막지 못한다**는 점이다 [기억 — 부정경쟁방지법 제2조 제2·3호, 제10·11조의 일반 법리. 이번 세션에서 조문 재열람은 안 함].
- 같은 맥락에서 stance "감춰서 기간 제한 없이 독점한다"의 "독점"도 엄밀하지 않지만 한쪽 주장 문장이라 그대로 둬도 된다.

**교체 문구** (영업비밀 points 두 번째만)
```js
{ label: '영업비밀', stance: '감춰서 기간 제한 없이 독점한다.',
  points: ['공개 비용 없이 오래 지킬 수 있다', '단, 남이 스스로 개발하거나 제품을 분석해 알아내는 것은 막을 수 없고, 세상에 공개돼 버리면 보호가 끝난다'] },
```

### 참고(점수에 반영 안 함)

- **tmname**: "특허상표청은 … 출원을 … 거절했고" — 기사 원문도 "refused"라 틀리지 않다. 다만 최종 거절이 아니라 심사 의견 단계이고 구글 요청으로 심사가 소송 결과까지 멈춰 있다 [확인함 — National Law Review]. 더 정확히 쓰려면 `'거절 의견을 냈고(구글 요청으로 심사는 소송 결과까지 멈춤)'`.
- **tmname**: Gemini Data 사건은 약식판결 심리가 2026-07-31로 잡혀 있었지만 govinfo 목록에 약식판결 결정은 없고 2026-09-29에 전문가 증거 신청 일정이 정해졌다 [확인함]. "2026년 가을에도 재판 준비 단계"는 맞다. IIPLA 기사 제목("Google Wins Trademark Suit")은 학생이 눌렀을 때 오해할 수 있지만 라벨이 "P2B 사건 금지명령 신청 기각"이라 충분히 막고 있다.
- **explain**: 국가법령정보센터 제37조의2 페이지에 **2026-09-08 개정, 시행 2027-03-09** 표시가 붙은 조문이 보인다. 카드 문장("2024년 3월부터 … 설명을 요구하거나 거부할 수 있는 권리")은 그대로 맞다. 2027년 3월 이후 한 번 다시 볼 것.
- **train**: Alsup 판사의 2025-06 판단 내용(합법 구매 책 = 공정이용, 해적판 보관 = 공정이용 아님)은 카드 출처 3개 어디에도 직접 나오지 않는다(작가조합 기사는 합의만 다룸). 문장은 정확하므로 점수는 깎지 않았다. 보강하려면 Authors Alliance 해설(https://www.authorsalliance.org/2025/06/26/meta-wins-on-fair-use-for-now-but-court-leaves-door-open-for-market-dilution/, 1회차 확인)을 넣을 수 있다.
- **oss**: "라이선스(계약) 주장은 1심에서 계속 다퉈지고 있다" — 1심은 항소 동안 절차를 멈췄었고, 항소 뒤 계약 청구가 1심에 남아 있다(Haynes Boone 2026-09-18, EFF "still in play") [2차]. 현재 문장 그대로 괜찮다.

---

## 2. tmmake 판단 — 교사 의도가 법적으로 정확하게 전달되는가

**결론: 예.** 

- 상표법 제33조(상표등록의 요건)를 국가법령정보센터에서 그려서 읽었다 [확인함]: 보통명칭·관용표장·성질표시·현저한 지리적 명칭·흔한 성·간단한 표장·식별할 수 없는 표장만 등록 제외 사유로 들고, "누가(무엇이) 만들었는가"는 어디에도 없다. 제34조는 국기·먼저 등록된 상표와 비슷한 표장 등 불등록 사유다. 따라서 카드의 "상표법은 저작권법과 달리 '사람이 만들었는가'를 등록 요건으로 두지 않는다", "AI가 만들었다는 이유만으로 등록이 막히지는 않는다"는 법적으로 정확하다.
- "보호의 빈틈" 쪽 두 점(로고 그림 자체의 저작권은 사람의 창작 기여가 없으면 인정되지 않을 수 있음 / 기존 상표와 닮을 위험)도 맞다 [확인함 — 법률신문 2025-07 기사: AI가 기계적으로 만든 산출물은 저작물이 아니고 사람의 창작 기여 부분만 등록 / Gerben IP: "an AI-generated name or logo might inadvertently resemble existing intellectual property", 닮으면 특허상표청이 거절].
- 1회차의 법리 오류(B측이 "상표에도 인간 창작성 요건이 있을 수 있다"로 읽힘)는 사라졌다. 저작권(사람이 만들어야)과 상표(출처를 구별하면 됨)의 차이를 가르치는 게임 본편과도 이제 맞는다.
- 사소한 단순화: "식별력이 있고 남의 상표와 헷갈리지 않으면 된다"는 제34조의 다른 불등록 사유(국기·공서양속 등)를 생략했다. 고교 카드로는 적절한 단순화라 지적하지 않는다.
- 배지 `varies`: 상표 등록 요건 자체는 나라마다 크게 다르지 않지만, 로고 그림의 저작권 보호는 나라·상황마다 다르므로 "국가·상황별 상이"는 받아들일 만하다.
- 구조 메모(사실 문제 아님, 평가자 몫): 두 편이 "등록 가능"과 "등록돼도 빈틈"이라 서로 맞서는 주장이라기보다 보완 관계다. 토론 카드로서의 긴장은 약해졌지만 교사 의도에는 맞는다.

---

## 3. 배지(status) 점검

| id | 배지 | 판단 |
|---|---|---|
| train | ongoing | 맞음 — 네이버 사건·미국 다수 사건 진행 중, Ross는 비생성형 |
| aiwork | decided | 맞음 — 실제 사례(Thaler)는 상고 불허로 확정. gist가 "AI 보조 창작물은 별개, 진행 중"을 따로 밝힘 |
| provider | ongoing | 맞음 — NYT 사건 진행 중(약식판결·재판 날짜 보도 없음) |
| oss | ongoing | 맞음 — 계약 청구 1심 계속 |
| patprotect · tsstrategy | varies | 맞음 — 판례가 아닌 전략 선택 |
| inventor | varies | 맞음 — 나라별 결론, 독일은 사람 발명자 기재로 AI 활용 발명 인정 |
| tmmake | varies | 받아들일 만함(위 §2) |
| tmdilute | varies | 맞음 — 영국 본안 판결(저작권 부분 항소 중) vs 미국 소송 초기 |
| tmname | ongoing | 맞음 — 두 사건 모두 판결 없음 |
| explain | varies | 맞음 — EU 판결 + 한국 법률, 나라별 제도 |
| tsleak | ongoing | 맞음 — Apple 1심, xAI 항소 |

미결 사건을 확정처럼 쓴 문장은 찾지 못했다. 하단 고지("리서치 2026년 7월, 마지막 확인 2026년 11월 17일 — 🔥 논쟁 진행 중…")도 배지 라벨과 맞는다. 단, 위 지적 3(Apple 갱신)을 반영하지 않으면 "마지막 확인 11월 17일"이 Apple 사건에 대해서는 살짝 앞선 날짜가 된다.

---

## 4. 출처 링크 점검 (curl, 2026-11-17)

| URL(줄임) | 상태 | 카드 문장과 대조 |
|---|---|---|
| authorsguild …final-approval | 200 | 맞음(2026-07-20 승인·15억 달러·약 3천 달러) |
| jw.com …ai-copyright-fair-use-case | 200 | 맞음(제3항소법원 2026-09-29, 비생성형) |
| news.mtn.co.kr …2026040915330140911 | 200 | 맞음(지상파 3사 v. 네이버, 서울중앙지법 4차 변론) |
| morganlewis …thaler | 200 | 맞음(1회차 본문 확인) |
| bakerdonelson …thaler | 200 | 맞음(상고 불허 2026-03-02) |
| lawtimes …209882 (2개 카드) | 200 | 맞음(문체부·저작권위 등록 안내서) |
| hunton …knowledge-is-not-enough | 200 | 맞음(Cox 판결 요지) |
| nortonrosefulbright …2026 | 200 | 맞음(핵심 청구 기각 신청 불허, 2026-03 게시 — 철회 이야기는 없음) |
| gibsondunn …ninth-circuit | 200 | 맞음(학습 단계 판단 안 함) |
| eff.org …victory-appeals-court | 200 | 맞음(2026-09-16, 계약 청구 "still in play") |
| githubcopilotlitigation.com | 200 | 원고 측 사이트, 본문 미열람 |
| lexology …15568a55 (2개 카드) | **403** | **확인 불가** |
| heraldk …2026060818200872635 | 200 | 맞음(지식재산처 안내서 2026-06-09) |
| shinkim …lawinfo/373 | 200 | 맞음(서울고법 2023누52088, 대법원 2024두45177 계속) |
| juve-patent …dabus | 200 | 제목 일치, 본문 미열람 |
| jonesday …tokyo-court | 200 | 2024 도쿄지법 기사 — 최고재판소 출처 아님(지적 2) |
| law.go.kr 상표법 제33조 | 200 | 맞음(헤드리스 Edge로 조문 확인) |
| gerbenlaw …ai-guided-trademark | 200 | 맞음(닮을 위험). "창작 주체 무관"은 이 글에 없음 — 그 문장은 제33조 링크가 뒷받침 |
| legal500 …getty | 200 | 맞음(2026-04-23 기각 신청 불허, 희석 진행) |
| taylorwessing …getty-vs-stability-trade-marks | 200(curl)/403(요약 도구) | 본문 직접 확인 못 함, 내용은 다른 자료로 확인 |
| natlawreview …gemini-data | 200 | 맞음(특허상표청 거절·심사 정지 요청) |
| govinfo …cand-3_24-cv-06412 | 200 | 맞음(2026-09-29까지 판결 없음) |
| iipla …google-wins | 200 | 맞음(P2B 사건, 2026-03-20) — 라벨 정확 |
| stibbe …cjeu | 200 | 맞음 |
| law.go.kr 개인정보보호법 제37조의2 | 200 | 맞음(헤드리스 Edge로 조문 확인) |
| techcrunch …apple…openai | 200 | 맞음(2026-07-10 제소, 채용 면접 주장) |
| aljazeera …xai | 200 | 맞음(2026-06-15 재소 불가 기각, 사유) |

생존율 26/27(96.3%). 1회차 대비: 낡은 링크(BakerHostetler)·블로그형(The Leveraged Years)·403 2건(ABA·Inside Privacy)·다른 사건 라벨(IIPLA)·Mondaq 이동이 모두 정리됐다. 남은 403은 Lexology 하나(patprotect·tsstrategy 공용). 두 카드 모두 다른 근거로 문장을 확인할 수 있어 점수는 깎지 않았지만, 교사가 브라우저로 한 번 열어 볼 것.

---

## 5. 확인함 / 미확인

**확인함 (이번 세션에서 출처 본문 또는 조문 직접 확인)**
- Bartz 합의 2026-07-20 최종 승인·15억 달러·약 3천 달러/권 / Ross 제3항소법원 2026-09-29 공정이용 부정·비생성형 / 지상파 3사 v. 네이버 2026-04-09 4차 변론(서울중앙지법)
- Thaler 상고 불허 2026-03-02 / 한국 등록 안내서 내용(기계적 산출물은 저작물 아님, 사람 기여 부분만 등록)
- Cox v. Sony 판결 요지(알기만 해선 부족, 부추김·침해용 설계) / NYT 기여 책임 청구 철회(2026-06-25)와 2026-08 정리 / In re OpenAI 기각 신청 불허(2025-10-27)
- Doe v. GitHub 제9항소법원 2026-09-16, 학습 단계 미판단, 계약 청구 "still in play"
- 지식재산처 안내서 2026-06-09 (AI 자체 발명 = 하드웨어 결합 요건)
- 한국 DABUS 서울고법 2024-05-16 2023누52088, 대법원 2024두45177 계속
- 상표법 제33조 조문(창작 주체 요건 없음) / Gerben IP(닮을 위험)
- Getty 미국 2026-04-23 기각 신청 불허(희석 포함)
- Gemini Data 사건 결정 목록(2026-09-29까지 판결 없음) / 특허상표청 거절·심사 정지 요청 / IIPLA = P2B 사건 2026-03-20
- CJEU C-203/22 2025-02-27 사실관계·판단 / 개인정보보호법 제37조의2 조문(본조신설 2023-03-14, 2026-09-08 개정분 시행 2027-03-09 표시)
- Apple v. OpenAI 2026-07-10 제소·주장 내용 / xAI 2026-06-15 재소 불가 기각과 사유

**2차 자료로만 확인**
- Getty 영국 판결 세부(v1.x·v2.x, "historic and extremely limited", 10조 3항 기각) — 로펌·블로그 요약 여러 곳 일치, 판결문 미열람
- 일본 최고재판소 2026-03 상고 기각(날짜 3/4·3/6 엇갈림)
- xAI 2026-07 항소 · Apple 2026-10 증거 조기 열람 허락 · Doe v. GitHub 계약 청구 1심 계속(Haynes Boone)
- Cox v. Sony 판결일 2026-03-25(AIPLA 등 다수)

**미확인 (6건)**
1. Lexology 기사(patprotect·tsstrategy 출처) 본문 — 403
2. Apple v. OpenAI 기각 신청·금지명령 신청 판단(2026-10-01 심리 이후)
3. 한국 DABUS 대법원(2024두45177) 2026-02 이후 선고 여부
4. NYT v. OpenAI 약식판결·재판 날짜
5. MLex 일본 최고재판소 기사 본문(지적 2 제안 링크) · 9to5Mac 본문(지적 3 제안 링크)
6. 영업비밀 법리(지적 4)의 부정경쟁방지법 조문 재열람 — 기억 기반

**기억 기반(낮은 위험)**: 서울행정법원 2023-06-30 2022구합89524(1회차 확인), 개인정보보호법 제37조의2 시행 2024-03-15(1회차 확인), 특허 존속기간 출원일부터 20년, 독일 연방대법원 2024 DABUS 판단.
