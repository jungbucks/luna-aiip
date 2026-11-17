# 도감(dogam.html) 사실 검증 보고서 — 검증자 4회차

- 검증일: 2026-11-17 · 대상: `data/issues.js` ISSUES 12건(커밋 f9c4828 기준)
- 이번 회차의 질문: **3회차 이후 새로 들어가거나 바뀐 문장이 맞는가? 짧게 줄인 법리 요약(provider의 Cox 기준)이 오해를 낳지 않는가?**
- 방법: 3회차 보고서의 결론은 믿지 않았다. `git diff 11fd6a3 f9c4828 -- data/issues.js`로 바뀐 곳 9군데를 뽑아 출처와 다시 맞췄다. Hunton(Cox 판결)·ChatGPT Is Eating the World(NYT 청구 정리)·IIPLA(P2B)·MacRumors(OpenAI 기각 신청)·govinfo(Gemini Data 결정 목록)는 본문을 내려받아 해당 문장을 찾았다. 상표법 제3조는 국가법령정보센터를 헤드리스 Edge로 그려 조문을 다시 읽었다. 미결 사건 4건(Apple v. OpenAI, P2B v. Google, 한국 DABUS 대법원, Allen v. Perlmutter)은 11월 기준으로 새 소식이 있는지 찾아봤다. 고유 출처 링크 30개는 모두 curl로 상태를 봤다.
- 원칙: 코드·데이터는 고치지 않았다. 교체 문구는 verify-dogam 규칙(사례 칸 200자 이하·문장 80자 이하·괄호 1개 이하·단정 금칙어 없음)에 맞는지 node로 쟀다(같은 문장 나누기 규칙 사용). 현재 데이터는 `node test/verify-dogam.mjs` 전체 PASS.
- 표기: **[확인함]** 이번 세션에서 출처 본문이나 조문을 직접 확인 · **[2차]** 검색 요약·2차 자료로만 확인 · **[미확인]** 근거를 찾지 못함

---

## 0. 점수판

**사실 점수: 1회차 33.3 → 2회차 88.9 → 3회차 91.7 → 4회차 94.4** (34/36)

| id | 3회차 | 4회차 | 사유 한 줄 |
|---|---|---|---|
| train | 3 | **3** | "회사는"→"Anthropic은"으로 주어만 바뀜. 맞음 |
| aiwork | 2 | **3** | 새 끝 문장 "사람이 얼마나 관여해야 보호받는지는 아직 다퉈지고 있다"가 `decided` 배지의 범위를 바로잡음. Morgan Lewis "would not prevent the Court from considering the human authorship requirement in future cases"와 맞고, Allen v. Perlmutter도 판결 보도가 없음 [확인함/2차] |
| provider | 3 | **2** | 판결 날짜(2026-03-25)·두 갈래 기준(부추김·침해용 서비스)은 맞음. 그러나 "알기만 한 회사는 **책임이 없고**"는 **기여 책임(도운 책임)** 하나에 대한 판단을 책임 전체로 넓혀 읽히게 함. Hunton: "Vicarious liability remains a live theory." 이 카드의 토론 주제가 바로 "회사 책임 vs 이용자 책임"이라, 대법원이 그 토론을 회사 쪽 무책임으로 끝낸 것처럼 보일 수 있음 → 지적 1 |
| oss | 3 | **3** | 바뀐 곳 없음. 3회차 Gibson Dunn 대조 유효 |
| patprotect | 3 | **3** | 바뀐 곳 없음 |
| inventor | 3 | **3** | 바뀐 곳 없음. 법무법인 세종 2026-02 뉴스레터 PDF가 "현재 상고심 계속 중(대법원 2024두45177)"이라 적어 "대법원 선고 소식은 아직 없다"를 2026-02까지는 받침 [확인함] |
| tmmake | 2 | **3** | 새 문장 "상표는 실제로 쓰거나 쓰려는 사람만 등록받을 수 있다"가 상표법 제3조 ① "국내에서 상표를 사용하는 자 또는 사용하려는 자는 자기의 상표를 등록받을 수 있다"와 일치 [확인함 — 조문 직접]. B측 "더 꼼꼼히"의 전제가 이제 사례 칸에 보임. 새 think는 의견 질문이라 사실 문제 없음. Gerben 출처를 뺐지만 남은 세 출처가 사례 칸 세 문장을 모두 받침 |
| tmdilute | 3 | **3** | B측 stance가 "흉내만으로 침해라 하면 안 된다. 헷갈림과 고의를 따져야 한다"로 바뀜. 한쪽 주장으로 표시돼 있어 사실 오류 아님(참고 1) |
| tmname | 3 | **3** | 새 문장 "P2B는 재판 도중 구글의 사용부터 막아 달라고 했지만 받아들여지지 않았다"는 IIPLA "failed to demonstrate a substantial likelihood … In a brief order issued on March 20"과 일치 [확인함]. "두 소송 모두 최종 판결은 아직"도 맞음: Gemini Data는 govinfo 마지막 항목이 2026-09-29 Daubert 일정 명령 [확인함], P2B는 2026-10 말까지 증거 조사 일정 [2차] |
| tsstrategy | 3 | **3** | 바뀐 곳 없음 |
| explain | 3 | **3** | "완전히 자동화된 결정"이 제37조의2 ① 문언과 같아짐(3회차 조문 확인 그대로). 더 정확해짐 |
| tsleak | 2 | **2** | 3회차 지적(출처 없음)은 해결: MacRumors "OpenAI's motion argues Apple never properly identified what information actually counts as a protectable trade secret" [확인함]. 그러나 10월 증거 문장을 지우면서 **최신 상황이 빠짐**: 2026-10-14 심리에서 판사가 Apple의 가처분을 "highly likely" 받아줄 것이라 했고, OpenAI는 재판 동안 Apple이 문제 삼은 정보를 쓰지 않기로 약속했다 [확인함 — 9to5Mac 2026-10-14]. 지금 카드는 8월 OpenAI 반론으로 멈춰 있어 한쪽으로 기운 그림을 줌 → 지적 2 |

- 0점(상) 0건 · 1점(중) 0건 · 2점(하) 2건 · 3점 10건
- **출처 링크 생존율: 29/30 = 96.7%** (고유 URL 기준. 카드별 항목 32개 기준 30/32 = 93.8% — Lexology가 두 카드에 걸림). 403은 Lexology 하나(1~3회차와 같음)
- **미확인: 6건**(§4)

### 핵심 질문에 대한 답

**새로 들어간 문장 가운데 틀린 사실은 없다.** 다만 Cox 기준 문장은 줄이면서 법리의 범위가 넓어졌다.

| 짚은 곳 | 판단 | 근거 |
|---|---|---|
| provider "알기만 한 회사는 책임이 없고" | **범위가 넓어짐(하)** | 대법원이 받은 쟁점은 기여 책임뿐이다: "The Supreme Court granted certiorari on the contributory liability question alone." 대위 책임은 다루지 않았다: "The Court did not address vicarious liability … Copyright owners may continue to pursue vicarious-liability claims" [확인함 — Hunton]. 회사가 직접 베낀 책임도 별개다(카드 마지막 문장이 이 점을 다룸). 그래서 "책임이 없고"는 "도운 책임이 없고"로 좁혀야 한다 |
| provider "부추기거나 침해용 서비스를 만들어야 책임진다" | 정확 | Hunton: "an ISP must intend its service to be used for infringement, which can be shown in only one of two ways—through active inducement or by providing a service tailored to infringement" [확인함]. "침해용 서비스" = 침해 말고는 쓸모가 거의 없는 서비스(Sony 기준)로 풀어 읽으면 맞음 |
| provider "2026년 3월" | 정확 | 2026-03-25 선고 [2차 — AIPLA·Faegre Drinker 날짜 표기] |
| provider "이후 뉴욕타임스는 '도왔다'는 주장을 접고" | 정확 | "dismissal with prejudice of their 'material contribution' contributory copyright infringement claims … premised on alleged direct infringement by end users", 2026-08-07 [확인함]. NYT가 Microsoft를 상대로 다른 기여 책임 주장을 새로 넣으려다 거절당한 사실도 있지만, "접고"가 틀리게 만들지는 않음 |
| tmmake 상표법 제3조 문장 | 정확 | 조문 직접 확인(위) |
| tmname P2B 문장 | 정확 | IIPLA·Bloomberg Law(2026-03-23) 모두 "substantial likelihood" 미달로 막아 달라는 요청 거절. "받아들여지지 않았다"는 맞고, IIPLA 제목 "Google Wins Trademark Suit"보다 카드 쪽이 더 정확함 |
| tsleak 주어 수정·MacRumors | 정확하나 낡음 | 위 점수 사유 |
| tmdilute B측 stance | 의견으로는 괜찮음 | 참고 1 |
| explain "완전히 자동화된" | 정확 | 법률 문언 그대로 |

---

## 1. 남은 지적

### 지적 1 — provider: Cox 기준이 "책임 전체"로 읽힘 (하)

- 지금: `이용자의 침해를 알기만 한 회사는 책임이 없고, 부추기거나 침해용 서비스를 만들어야 책임진다.`
- 문제: 판결은 **기여 책임(남의 침해를 도운 책임)** 에 대한 것이다. 대위 책임(감독할 수 있고 이익을 얻었으면 지는 책임)은 판단하지 않았고, 회사 자신의 직접 침해도 별개다. 학생은 "대법원이 AI 회사는 이용자 침해에 책임이 없다고 했다 → 제공자 책임 편이 졌다"로 읽을 수 있다. 카드가 `ongoing`인데 토론의 한쪽이 판결로 정리된 것처럼 보인다.
- 고치는 방법: "책임"을 "도운 책임"으로 좁히면 바로 뒤 문장의 "도왔다"는 주장과도 이어진다. 200자를 넘지 않게 첫 문장의 "2023년 말"을 "2023년"으로 줄였다(소송은 2023-12-27이라 "2023년"도 맞음).
- 근거: https://www.hunton.com/insights/legal/knowledge-is-not-enough-supreme-court-limits-contributory-copyright-liability-for-isps

**교체 문구** (gist 199자, 문장 최대 53자, 괄호 1개, 금칙어 없음)
```js
gist: '뉴욕타임스는 챗봇이 자사 기사를 거의 그대로 내놓는다며 2023년 OpenAI에 소송을 냈다. 2026년 3월 미국 대법원은 인터넷 회사 사건(Cox v. Sony)에서 기준을 정했다. 이용자의 침해를 알기만 한 회사는 도운 책임이 없고, 부추기거나 침해용 서비스를 만들어야 진다. 이후 뉴욕타임스는 "도왔다"는 주장을 접고 직접 베꼈다는 주장에 집중한다.' },
```
※ "도운 책임"에 따옴표를 치면 203자가 되어 규칙을 넘는다. 따옴표 없이도 뜻은 통한다.

### 지적 2 — tsleak: 10월의 가장 큰 진전이 빠져 OpenAI 반론으로 멈춰 있음 (하)

- 지금: `OpenAI는 Apple이 어떤 비밀인지 밝히지 못했다며 맞선다.` (2026-08 기각 신청 내용)
- 그 뒤 일: 2026-10-14 심리에서 Davila 판사가 Apple의 가처분을 받아줄 가능성이 "highly likely"라고 했고, OpenAI는 "voluntarily agreed not to use Apple's alleged trade secrets while the legal battle between the two companies plays out". 판사가 이 약속을 강제할 수 있고, OpenAI는 직원 14명의 기기 포렌식 이미지도 모으기로 했다 [확인함 — 9to5Mac 2026-10-14 본문, Bloomberg Government 2026-10-14 요약]. 기각 신청 판단은 찾지 못했다 [미확인] — "맞선다"는 지금도 틀리지 않다.
- 문제: 3회차 반영 때 10월 증거 문장을 지우면서 Apple 쪽 진전이 모두 빠지고 OpenAI 반론만 남았다. 학생에게는 "Apple 주장이 약하다"로 기운 그림이 된다.
- 근거: https://9to5mac.com/2026/10/14/openai-agrees-not-to-use-alleged-apple-trade-secrets-amid-ongoing-lawsuit/ (curl 200, 무료로 읽힘)

**교체 문구** (gist 194자, 문장 최대 61자, 괄호 0개, 금칙어 없음)
```js
gist: 'Apple은 전직 직원들이 기밀 설계를 들고 OpenAI로 옮겼다며 2026년 7월 소송을 냈다. OpenAI는 어떤 비밀인지 밝히지 못했다며 맞서지만, 10월 재판 동안 문제의 정보를 쓰지 않기로 약속했다. xAI의 비슷한 소송은 1심에서 기각됐다. 면접에서 이전 일을 묻는 것만으로 유출을 부추겼다고 볼 수 없다는 이유였고, xAI는 항소했다.' },
```
```js
{ label: '9to5Mac(OpenAI 사용 중단 약속, 2026-10)', url: 'https://9to5mac.com/2026/10/14/openai-agrees-not-to-use-alleged-apple-trade-secrets-amid-ongoing-lawsuit/' },
```
※ 출처가 5개가 된다. 지금 네 개는 문장을 하나씩 맡고 있다(TechCrunch=소장의 "기밀 설계" 주장, MacRumors=OpenAI 반론, Al Jazeera=xAI 기각 사유, DCD=xAI 항소). 9to5Mac 10-14 기사는 약속만 받친다. 하나를 빼야 한다면 TechCrunch가 가장 덜 아깝다 — MacRumors 본문도 7월 소장을 "a scheme to pull confidential product information out of job candidates and new hires"로 소개한다[확인함]. 다만 "기밀 설계를 들고 옮겼다"를 가장 자세히 받치는 건 TechCrunch라, 5개를 그대로 두는 쪽을 먼저 권한다.
※ "판사가 Apple 쪽 손을 들 가능성이 크다고 했다"는 넣지 않았다. verify-dogam의 결론 단정 금칙어("손을 들어줬다")와 겹치기 쉽고, 약속 쪽이 더 구체적인 사실이다.

### 참고(점수에 반영 안 함)

1. **tmdilute B측** `흉내만으로 침해라 하면 안 된다. 헷갈림과 고의를 따져야 한다.` — 한쪽 주장이라 사실 오류는 아니다. 다만 미국 연방 희석 조항(15 U.S.C. §1125(c))은 "regardless of the presence or absence of actual or likely confusion"이라 **희석은 헷갈림이 없어도 인정될 수 있다**(기억 기반, 이번에 조문 재열람 안 함). B측은 "희석을 좁게 보자"는 정책 주장으로 읽혀야 한다. 교사가 수업에서 짚을 거리로 남긴다.
2. **tmname 출처 이름**: IIPLA 기사 제목은 "Google Wins Trademark Suit Over 'Gemini' Branding"이지만 본문은 가처분 거절이다. 카드 라벨("P2B 사건 금지명령 신청 기각")이 정확하므로 그대로 두되, 학생이 제목만 보고 "구글이 이겼다"로 읽을 수 있다는 점은 평가자 몫. 대안인 Bloomberg Law 기사(2026-03-23)는 유료 벽이라 권하지 않는다.
3. **explain**: 국가법령정보센터에 2026-09-08 개정·2027-03-09 시행 표시(3회차 확인)가 있으니 2027년 3월 이후 다시 볼 것.
4. **inventor**: "대법원 선고 소식은 아직 없다"는 세종 2026-02 뉴스레터까지는 받쳐진다. 그 뒤 선고 보도는 찾지 못했다(없음을 증명할 수는 없음). 기준 시점을 붙이려면 3회차 참고 문구(`…대법원 선고는 아직 없다(2026-11 기준).`)를 쓰면 된다.
5. **provider**: Cox 표결은 7인 다수의견 + 2인 결론 동의(결론은 9-0). 카드는 표결을 적지 않으므로 상관없다.

---

## 2. 배지(status) 점검

| id | 배지 | 판단 |
|---|---|---|
| train | ongoing | 맞음 — 지상파 3사 v. 네이버 판결 보도 없음 [2차, 3회차] |
| aiwork | decided | 맞음 — 새 끝 문장이 "결론은 AI 단독 창작에만"을 밝혀 3회차 지적 해소 |
| provider | ongoing | 맞음 — NYT 직접 침해 청구 계속. 지적 1 반영 시 배지와 문장이 더 잘 맞음 |
| oss | ongoing | 맞음 |
| patprotect · tsstrategy | varies | 맞음 |
| inventor | varies | 맞음 |
| tmmake | varies | 받아들일 만함 |
| tmdilute | varies | 맞음 |
| tmname | ongoing | 맞음 — 두 사건 모두 판결 없음 |
| explain | varies | 맞음 |
| tsleak | ongoing | 맞음 — Apple 1심 초기(가처분 대신 약속, 기각 신청 판단 미확인), xAI 제9항소법원 |

verify-dogam [미결 카드 요지에 결론 단정 없음] PASS. 교체 문구 2개도 VERDICT 금칙어에 걸리지 않음(node로 확인).

---

## 3. 출처 링크 점검 (curl -L, 2026-11-17)

30개 중 29개 200, Lexology 1개 403. 3회차와 달라진 링크만 적는다.

| URL(줄임) | 상태 | 카드 문장과 대조 |
|---|---|---|
| law.go.kr 상표법 제3조 (tmmake 신규) | 200 | **맞음** — 제3조 ① "사용하는 자 또는 사용하려는 자" [확인함, 헤드리스 Edge] |
| macrumors …openai-asks-judge-to-dismiss (tsleak 신규) | 200 | **맞음** — 2026-08-05 기각 신청, 영업비밀 특정 못 했다는 주장 [확인함] |
| gerbenlaw (tmmake에서 빠짐) | — | 해당 없음 |
| 9to5mac …2026/10/13 (tsleak에서 빠짐) | — | 해당 없음 |
| hunton …knowledge-is-not-enough | 200 | 판단 기준은 맞음, "책임 전체"로 넓힌 것은 맞지 않음(지적 1) [확인함] |
| chatgptiseatingtheworld …2026/08/07 | 200 | **맞음** — material contribution 청구 재소 불가 기각 [확인함] |
| iipla …google-wins | 200 | **맞음** — 2026-03-20 가처분 거절 [확인함] |
| govinfo …cand-3_24-cv-06412 | 200 | **맞음** — 마지막 항목 2026-09-29, 판결 없음 [확인함] |
| lexology …15568a55 (2개 카드) | **403** | 확인 불가(1~3회차와 같음). 두 카드 문장은 다른 근거로 확인돼 감점 안 함 |

지적 2 교체 시 추가될 9to5Mac 2026-10-14 기사도 200, 본문 확인함.

---

## 4. 확인함 / 미확인

**확인함 (이번 세션에서 출처 본문 또는 조문 직접 확인)**
- Cox v. Sony: 기여 책임만 판단, 부추김·침해용 서비스 두 갈래, 대위 책임은 판단 안 함 — Hunton
- NYT·Daily News "material contribution" 기여 책임 청구 재소 불가 기각 2026-08-07 — ChatGPT Is Eating the World
- 상표법 제3조 ① 조문 — 국가법령정보센터(헤드리스 Edge)
- P2B 가처분 거절 2026-03-20 — IIPLA 본문 / Bloomberg Law 첫 두 문단
- Gemini Data 사건 2026-09-29까지 판결 없음 — govinfo
- OpenAI 기각 신청 사유 — MacRumors 2026-08-06
- 2026-10-14 판사 "highly likely" 발언·OpenAI 사용 중단 약속·14명 포렌식 — 9to5Mac 2026-10-14 본문, Bloomberg Government 요약
- 한국 DABUS 상고심 계속 중(2026-02 기준) — 법무법인 세종 IP 뉴스레터 PDF(IP_kr2026027) 각주
- 링크 30개 상태

**2차 자료로만 확인**
- Cox 선고일 2026-03-25(AIPLA·Faegre Drinker·Orrick 검색 결과)
- P2B 사건 2026-10 말까지 증거 조사 진행(Justia 도켓 검색 요약, 직접 열람은 403)
- Allen v. Perlmutter 2026-02까지 서면 공방, 판결 보도 없음
- 3회차 2차 항목(일본 최고재판소 상고 기각, 지상파 3사 v. 네이버, Getty 영국 판결 세부)은 이번에 다시 보지 않음

**3회차 확인을 그대로 씀(이번에 다시 열지 않음)**: Morgan Lewis·작가조합·Gibson Dunn·Legal 500·Al Jazeera·DCD·Stibbe 본문, 개인정보보호법 제37조의2 조문. 이 카드들의 해당 문장은 3회차 이후 바뀌지 않았다(explain은 조문 문언에 더 가까워짐).

**미확인 (6건)**
1. Lexology 기사(patprotect·tsstrategy 출처) 본문 — 403
2. Apple v. OpenAI 기각 신청 판단 — 2026-10 심리 이후 결과 보도 못 찾음(지적 2 교체 문구는 "맞서지만"이라 결과와 무관하게 성립)
3. 한국 DABUS 대법원(2024두45177) 2026-02 이후 선고 여부 — 보도 못 찾음
4. World IP Review 본문 — 유료, 제목·부제만(3회차)
5. Allen v. Perlmutter 판결 여부 — aiwork 새 문장은 사건 이름을 쓰지 않아 결과와 무관하게 성립
6. tsstrategy 영업비밀 법리(독자 개발·역설계는 못 막음)의 부정경쟁방지법 조문 — 재열람 안 함

**기억 기반(낮은 위험)**: 미국 연방 희석 조항의 "혼동 여부와 무관" 문언(참고 1), 서울행정법원 2023-06-30, 개인정보보호법 제37조의2 시행 2024-03-15, 특허 존속기간 출원일부터 20년, 독일·영국 DABUS 판단.
