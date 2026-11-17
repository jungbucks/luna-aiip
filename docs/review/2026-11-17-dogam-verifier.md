# 도감(dogam.html) 사실 검증 보고서 — 검증자

- 검증일: 2026-11-17 (도감 원 리서치 기준일 2026-07)
- 대상: `data/issues.js` ISSUES 12건 · `dogam.html` 하단 고지 · 설계서 §8 검증표
- 방법: 건마다 웹 검색·원문 조회(법원 문서 목록, 로펌·법률 매체, 국내 언론), 출처 링크 18개 HTTP 상태 점검(curl)
- 원칙: 코드·데이터는 고치지 않았다. 아래 "제안 문구"는 `issues.js`에 바로 넣을 수 있게 썼고, `verify-dogam.mjs` 금칙어(정답은·무조건·반드시 승소·반드시 이긴다)는 쓰지 않았다.
- 표기: **[확인함]** = 이번 세션에서 웹 출처로 확인, **[미확인]** = 근거를 찾지 못했거나 2차 자료 한 곳뿐인 것, **[기억]** = 널리 알려진 사실이지만 이번 세션에서 출처를 다시 열어 보지 않은 것

---

## 0. 요약표

| id | 판정 | 심각도 | 한 줄 사유 |
|---|---|---|---|
| tmname | **수정필요** | **상** | "2026-05 법원이 구글 손을 들어줬다"는 근거 없음. Gemini Data v. Google은 2026-09에도 진행 중. 출처(IIPLA)는 **다른 사건**(P2B v. Google, 2026-03 가처분 기각) 기사. status `decided` → `ongoing` |
| tmmake | **수정필요** | **상** | 상표법에는 "창작 주체·인간 창작성" 요건이 없다. 쟁점 구도(B측)·요지가 법리상 오해를 낳음. 출처(ABA)는 403으로 내용 확인 불가 |
| oss | **갱신필요** | **상** | 제9연방항소법원이 2026-09-16 DMCA 1202(b) 청구 기각을 유지. "항소·심리가 이어지고 있다"는 이제 사실과 다름. 계약 청구만 1심에 남음 |
| provider | 갱신필요 | 중 | 2026-03 미 대법원 Cox v. Sony(회사 책임 기준 강화) 뒤 NYT가 OpenAI 상대 "기여 책임" 주장을 접음(2026-06). 쟁점("회사 vs 이용자 책임")의 핵심 갱신. 제기일 "2024"는 2023-12 |
| train | 수정필요 | 중 | Bartz는 1심 판단인데 "미국 법원은"으로 일반화. "불법 복제본 저장은 침해로 판단"은 과장(공정이용 아님 → 재판 전 합의). 합의 최종 승인(2026-07-20)·제3항소법원 Ross 판결(2026-09-29)·국내 소송 빠짐 |
| explain | 수정필요 | 중 | "예외적인 경우에만 영업비밀이 앞선다"는 판결 요지와 다름(영업비밀 정보는 감독기관·법원에 내고 그쪽이 저울질). 한국 개인정보보호법 제37조의2(2024-03 시행) 추가 가치 큼 |
| tsleak | 수정필요 | 중 | xAI 사건은 "증거 부족 각하"가 아니라 소장 단계 기각(2026-06-15, 재소 불허)이고 xAI가 **항소 중**. Apple 사건은 OpenAI 기각 신청(2026-08) 결과 미확인 |
| tmdilute | 수정필요 | 중 | 영국 판결은 희석은 기각했지만 **초기 모델 일부 출력에 상표 침해를 인정**(제한적). 미국 2026-04는 소송 초기(기각 신청 단계) 판단일 뿐임을 밝혀야 함 |
| inventor | 갱신필요 | 중 | 해외 서술은 정확. **한국 DABUS 소송**(서울행정법원 2023·서울고법 2024 패소, 대법원 계속) 누락. 일본 출처가 신뢰도 낮은 블로그 |
| aiwork | 정확 | 하 | 사실 정확. 한국 저작권 등록 안내서(2025-06)·Allen v. Perlmutter(진행 중) 한 줄 보강 권장 |
| patprotect | 정확(경미 수정) | 하 | "20년"은 출원일부터. AI 알고리즘 자체는 하드웨어와 결합돼야 특허 대상이 된다는 점 보강 권장. 출처(Lexology) 403으로 확인 불가 |
| tsstrategy | 정확(경미 수정) | 하 | "오픈소스 = 독점 이익 포기"는 다소 단정(저작권·라이선스 조건은 남음). 출처 동일(Lexology) 확인 불가 |
| (하단 고지) | 갱신필요 | 하 | 기준일 2026-07 → 재확인일 표기. "🔥 진행 중" 문구가 배지 라벨("논쟁 진행 중")과 다름 |

상 3건 · 중 6건 · 하 3건(+고지 1)

---

## 1. 이슈별 상세

### 1-1. train — 학습 데이터를 마음대로 써도 될까? (status: ongoing → **유지**)

**현재 서술**
> "Bartz 사건에서 미국 법원은 책으로 AI를 학습시키는 것 자체는 공정이용으로 보았지만, 불법 복제본을 저장한 것은 침해로 판단해 약 15억 달러 합의로 이어졌다. NYT가 OpenAI를 상대로 낸 소송은 AI 답변이 기사 시장을 대체하는지를 두고 아직 진행 중이다."

**확인된 사실**
- [확인함] Bartz v. Anthropic: 2025-06-23 Alsup 판사(캘리포니아 북부 연방지방법원, 1심)는 **합법적으로 구한 책**으로 학습한 것은 공정이용, **해적판 책을 내려받아 보관한 것**은 공정이용이 아니라고 보고 그 부분을 재판(2025-12 예정)에 넘겼다. 재판 전에 합의. 작가조합 페이지는 학습 관련 판단이 대표 원고 3명에게만 적용된다고도 적고 있다.
- [확인함] 합의금 15억 달러, 책 한 권당 약 3,000달러, 약 50만 권. **2026-07-20 최종 승인**(Martínez-Olguín 판사). 과거 행위(2025-08-25까지)만 대상, AI 출력물 관련 청구는 포함 안 됨. 첫 지급은 2026-11-23 주간 예정.
- [확인함] 같은 법원 Chhabria 판사는 이틀 뒤(2025-06-25) Kadrey v. Meta에서 Meta 승소(공정이용)를 선고했지만, 원고가 "시장 희석" 증거를 내지 못했기 때문이라며 다른 사건에선 결론이 달라질 수 있다고 했다 → 1심 판사끼리도 이유가 갈림.
- [확인함] **Thomson Reuters v. Ross**: 2026-09-29 제3연방항소법원이 법률 요약문(헤드노트)을 경쟁 AI 학습에 쓴 것은 공정이용이 **아니라는** 1심을 유지. AI 학습 공정이용에 대한 첫 연방 항소심 판단으로 보도됨. 단, 생성형 AI가 아닌 검색 도구 사건이다(판결 이유 공개 범위는 보도마다 엇갈림 [미확인]).
- [확인함] 한국: KBS·MBC·SBS가 2025-01 네이버(하이퍼클로바X)를 상대로 뉴스 무단 학습 소송(저작권·부정경쟁방지법) 제기, 서울중앙지법 진행 중(2026-04-09 4차 변론 보도). 문체부·한국저작권위원회 「생성형 AI의 저작물 학습에 대한 공정이용 안내서」 2026-02-26 발간(법적 구속력 없는 참고자료, 불법 복제물·로그인 우회 수집은 불리한 요소로 제시).
- [확인함] NYT v. OpenAI: 진행 중(아래 provider 참조).

**문제점**: "미국 법원은"이 미국 법 전체 결론처럼 읽힌다(1심 판사 1명). "침해로 판단"은 정확히는 "공정이용이 아니라고 보고 재판에 넘김 → 재판 전 합의".

**근거 URL**
- https://authorsguild.org/news/court-grants-final-approval-anthropic-copyright-settlement/
- https://authorsguild.org/advocacy/artificial-intelligence/what-authors-need-to-know-about-the-anthropic-settlement/ (현 출처, 200·2026-11-16 갱신)
- https://www.authorsalliance.org/2025/06/26/meta-wins-on-fair-use-for-now-but-court-leaves-door-open-for-market-dilution/
- https://www.jw.com/news/insights-ai-copyright-fair-use-case/ (Ross 항소심)
- https://news.mtn.co.kr/news-detail/2026040915330140911 (지상파 3사 v. 네이버)
- https://www.lawtimes.co.kr/news/articleViewAmp.html?idxno=217415 (공정이용 안내서)

**제안 문구**
```js
realCase: { name: 'Bartz v. Anthropic / Thomson Reuters v. Ross / 지상파 3사 v. 네이버', date: '2025~2026',
  gist: '2025년 미국의 한 1심 법원은 합법적으로 산 책으로 AI를 학습시킨 것은 공정이용이지만 해적판 책을 내려받아 쌓아 둔 것은 공정이용이 아니라고 보았고, 이 사건은 재판 전에 약 15억 달러(책 한 권당 약 3천 달러) 합의로 끝났다(2026-07 최종 승인). 같은 법원의 다른 판사는 비슷한 사건에서 이유를 달리했고, 2026년 9월 미국 항소법원은 경쟁 서비스를 만들려고 법률 요약문을 학습한 사건(생성형 AI는 아님)에서 공정이용을 인정하지 않았다. 한국에서도 방송 3사가 네이버를 상대로 뉴스 학습 소송을 내 진행 중이다.' },
sources: [
  { label: '작가조합(Anthropic 합의 최종 승인)', url: 'https://authorsguild.org/news/court-grants-final-approval-anthropic-copyright-settlement/' },
  { label: 'Jackson Walker(Ross 항소심)', url: 'https://www.jw.com/news/insights-ai-copyright-fair-use-case/' },
  { label: 'MTN(지상파 3사 v. 네이버)', url: 'https://news.mtn.co.kr/news-detail/2026040915330140911' },
],
```
(NYT 언급은 provider 카드와 겹치므로 train에서는 빼는 것을 권장. 남기려면 "뉴욕타임스 소송도 진행 중이다" 한 구절.)

---

### 1-2. aiwork — AI가 그린 그림, 저작권은 누구 것? (status: decided → **유지**)

**현재 서술**
> "…미국 대법원이 2026년 3월 상고를 받아들이지 않아 하급심 결론이 확정됐다. 사람의 저작이 없는 순수 AI 생성물은 저작권 등록 대상이 아니라는 원칙이 유지됐다. 다만 사람이 충분히 개입한 AI 보조 창작물은 별개 문제로 남았다."

**확인된 사실**
- [확인함] Thaler v. Perlmutter: D.C. 연방항소법원 2025-03-18 "저작물은 처음부터 사람이 저작해야" 판결, 미 대법원 **2026-03-02** 상고 불허(No. 25-449). Morgan Lewis는 상고 불허가 앞으로 대법원이 이 문제를 다루는 것을 막지는 않는다고 설명.
- [확인함] Allen v. Perlmutter(미드저니로 600회 넘게 프롬프트를 넣은 그림, 콜로라도 연방지법): 진행 중, 판결 보도 없음 [판결 여부 미확인].
- [확인함] 한국: 문체부·한국저작권위원회 「생성형 AI 활용 저작물의 저작권 등록 안내서」(2025-06): AI가 기계적으로 만든 산출물은 저작물이 아니고, 사람의 창작적 기여 부분만 등록 가능. AI 산출물을 사람 저작물처럼 등록하면 허위 등록 처벌 가능성 안내.

**문제점**: 없음. 고교생이 "상고 불허 = 대법원이 직접 판결했다"로 외울 수 있어 한 구절 보강 권장.

**근거 URL**
- https://www.morganlewis.com/pubs/2026/03/us-supreme-court-declines-to-consider-whether-ai-alone-can-create-copyrighted-works (현 출처, 200)
- https://www.bakerdonelson.com/supreme-court-denies-certiorari-in-thaler-v-perlmutter-ai-cannot-be-an-author-under-the-copyright-act (현 출처, 200)
- https://www.lawtimes.co.kr/news/articleViewAmp.html?idxno=209882 (한국 등록 안내서 해설)

**제안 문구 (gist 끝에 덧붙이기)**
```js
gist: '순수하게 AI가 자율 생성한 미술품의 저작권 등록을 두고 다툰 사건에서, 미국 대법원이 2026년 3월 상고를 받아들이지 않아 "저작물은 사람이 만들어야 한다"는 하급심 결론이 그대로 남았다(대법원이 직접 이유를 밝힌 판결은 아니다). 사람이 충분히 개입한 AI 보조 창작물은 별개 문제로, 미국에서는 관련 소송이 진행 중이다. 한국 정부 안내서(2025-06)도 AI가 기계적으로 만든 결과물은 저작물이 아니고, 사람이 창작적으로 기여한 부분만 등록할 수 있다고 안내한다.',
```
출처 추가: `{ label: '법률신문(한국 AI 저작물 등록 안내서)', url: 'https://www.lawtimes.co.kr/news/articleViewAmp.html?idxno=209882' }`

---

### 1-3. provider — AI가 남의 글을 베끼면 누가 책임지나? (status: ongoing → **유지**)

**현재 서술**
> name: 'NYT v. OpenAI', date: '2024~진행 중' / "…법원은 OpenAI의 각하 신청을 받아들이지 않아 본안 심리가 진행 중이다. AI 산출물에 대한 책임을 누가 지는지의 기준을 세울 대표 사건으로 꼽힌다."

**확인된 사실**
- [기억] NYT 소송 제기는 **2023-12**(이번 세션에서 원문 재확인은 안 함). "2024~"는 부정확.
- [확인함] 2025-03/04 Stein 판사가 OpenAI 기각 신청을 일부만 받아들이고 핵심 청구는 진행시킴(일부 청구는 기각). 사건은 뉴욕 남부연방지법 통합 사건(MDL 3143)으로 진행. 2026-01·03 출력 기록(2천만 건 등) 제출 명령.
- [확인함] **2026-03-25 미 대법원 Cox v. Sony**: 이용자의 침해를 알면서 서비스를 계속 제공했다는 것만으로는 "기여 책임"이 성립하지 않고, 침해를 부추겼거나 침해용으로 만든 서비스여야 한다(인터넷 접속 회사 사건).
- [확인함] 이 판결 뒤 **2026-06-25 NYT가 수정 소장에서 "OpenAI가 이용자의 침해를 도왔다"는 기여 책임 주장을 철회**하고, 그 이론은 마이크로소프트 쪽에 집중(2026-08-06 법원이 MS 관련 추가 청구는 늦었다며 불허). 2026-07 언론사들이 OpenAI 증거 관련 제재 신청.
- [미확인] 약식판결(서머리 저지먼트) 신청 결과·재판 날짜: 확인되는 보도 없음.
- 참고(추가 후보) [확인함] 디즈니·유니버설(+워너브러더스) v. 미드저니(2025-06 제기): 캐릭터 이미지 출력물을 문제 삼은 소송, 2026-08 조정 일정 이후 결과 [미확인].
- 참고 [확인함] GEMA v. OpenAI(뮌헨 지방법원 2025-11-11): 노래 가사를 모델이 "외워" 그대로 출력한 것은 복제라고 판단, OpenAI 항소 예정 → 나라마다 다른 결론.

**문제점**: 이 카드의 질문("회사 책임 vs 이용자 책임")에 딱 맞는 2026년 사건(Cox v. Sony와 NYT의 주장 철회)이 빠져 있다. 현재 요지는 "기준을 세울 대표 사건"이라고만 해서 학생이 무엇이 쟁점인지 잡기 어렵다.

**근거 URL**
- https://www.aipla.org/detail/news/2026/03/25/supreme-court-issues-unanimous-decision-in-cox-communications--inc.-v.-sony-music-entertainment
- https://www.hunton.com/insights/legal/knowledge-is-not-enough-supreme-court-limits-contributory-copyright-liability-for-isps
- https://news.bloomberglaw.com/ip-law/new-york-times-narrows-openai-suit-targets-microsofts-conduct (유료 기사, 요지만 확인)
- https://www.nortonrosefulbright.com/en/knowledge/publications/ce8eaa5f/ai-in-litigation-series-an-update-on-ai-copyright-cases-in-2026 (현 출처, 200)

**제안 문구**
```js
realCase: { name: 'NYT v. OpenAI / Cox v. Sony', date: '2023~진행 중',
  gist: '뉴욕타임스는 챗봇이 자사 기사를 거의 그대로 재현한다며 2023년 말 OpenAI를 상대로 소송을 냈고, 핵심 청구는 기각되지 않아 재판이 진행 중이다. 그런데 2026년 3월 미국 대법원은 인터넷 회사 사건(Cox v. Sony)에서 "이용자가 침해하는 걸 알면서 서비스를 계속했다"는 것만으로는 회사에 책임을 묻기 어렵고, 침해를 부추겼거나 침해용으로 만든 서비스여야 한다고 정리했다. 그 뒤 뉴욕타임스는 "이용자의 침해를 OpenAI가 도왔다"는 주장을 접고, OpenAI가 직접 베꼈다는 주장에 집중하고 있다.' },
sources: [
  { label: 'AIPLA(Cox v. Sony 대법원 판결)', url: 'https://www.aipla.org/detail/news/2026/03/25/supreme-court-issues-unanimous-decision-in-cox-communications--inc.-v.-sony-music-entertainment' },
  { label: 'Norton Rose Fulbright(2026 소송 업데이트)', url: 'https://www.nortonrosefulbright.com/en/knowledge/publications/ce8eaa5f/ai-in-litigation-series-an-update-on-ai-copyright-cases-in-2026' },
],
```

---

### 1-4. oss — 공짜 오픈소스, 조건은 지켜야 할까? (status: ongoing → **유지 가능**, 요지 갱신 필수)

**현재 서술**
> "…저작권 관리정보 제거(DMCA 1202) 쟁점으로 초점이 옮겨간 채 항소·심리가 이어지고 있으며, 본안 결론은 아직 나지 않았다."

**확인된 사실**
- [확인함] **2026-09-16 제9연방항소법원**(Doe v. GitHub, No. 24-7700, 만장일치)이 DMCA 1202(b) 청구 기각을 유지. 이유: Copilot·Codex가 내놓은 것은 새로 생성된 코드이고, 원래 붙어 있던 저작권 표시를 "제거·변경"한 복제본이 아니다. 1심의 "똑같아야 한다(identicality)" 요건은 받아들이지 않았지만 결론은 같음. **학습 단계에서 표시를 떼어 낸 문제는 절차상 판단하지 않음.**
- [확인함] EFF: 원고들의 **계약(라이선스) 청구는 아직 남아 있다**. 이 사건엔 처음부터 저작권 직접 침해 청구는 없었다(BakerHostetler).
- [확인함] 현 출처 BakerHostetler 페이지는 아직 "항소심 판결 대기"로 갱신 안 됨(내용이 낡음).

**근거 URL**
- https://www.gibsondunn.com/ninth-circuit-clarifies-limits-of-dmca-liability-for-ai-generated-code/
- https://www.eff.org/deeplinks/2026/09/victory-appeals-court-rejects-expansive-new-copyright-claim
- https://www.courthousenews.com/wp-content/uploads/2026/09/doe-vs-github-ninth-circuit.pdf (판결문 PDF, 열람 미시도)

**제안 문구**
```js
realCase: { name: 'Doe v. GitHub Copilot', date: '2022~진행 중',
  gist: '개발자들은 코드 생성 AI가 오픈소스 코드를 내놓으면서 저작자 표시와 라이선스 문구를 떼어 냈다며 소송을 냈다. 2026년 9월 미국 항소법원은 AI가 새로 만들어 낸 코드에 저작권 표시가 없다는 것만으로는 "표시를 제거했다"고 볼 수 없다며 이 주장을 받아들이지 않았다. 다만 학습 단계의 문제는 판단하지 않았고, 오픈소스 라이선스(계약)를 어겼다는 주장은 1심에서 계속 다퉈지고 있다.' },
sources: [
  { label: 'Gibson Dunn(제9항소법원 판결)', url: 'https://www.gibsondunn.com/ninth-circuit-clarifies-limits-of-dmca-liability-for-ai-generated-code/' },
  { label: 'EFF(판결 해설)', url: 'https://www.eff.org/deeplinks/2026/09/victory-appeals-court-rejects-expansive-new-copyright-claim' },
  { label: 'GitHub Copilot Litigation(원고 측)', url: 'https://githubcopilotlitigation.com/' },
],
```
※ 이 판결은 "새 창작이다" 편 논리에 가까운 결론이지만 범위가 좁다(표시 제거 조항 하나). 카드가 한쪽 편 승리처럼 보이지 않게 위 문구처럼 "남은 쟁점"을 같이 쓰는 것을 권장.

---

### 1-5. patprotect — AI 핵심 기술, 특허로 공개할까 숨길까? (status: varies → **유지**)

**현재 서술**
> stance: "특허로 공개하면 20년간 보호받고 기술도 발전한다." / gist: 리버스 엔지니어링 쉬운 기술은 특허, 감출 수 있는 기술은 영업비밀이 유리하다는 견해.

**확인된 사실**
- 특허 존속기간은 **출원일부터 20년**(설정등록 후 존속, 의약 등 일부 연장 제도 있음) [기억 — 특허법 제88조, 이번 세션에서 조문 재확인 안 함]. "20년간 보호"만 쓰면 "등록 후 20년"으로 외울 수 있음.
- [확인함] 지식재산처(2025-10-01 특허청이 승격·개편) 「AI 시대 올바른 특허출원 안내서」(2026-06-09): AI 자체에 관한 발명은 하드웨어와 결합해 정보처리를 수행하는 형태여야 하고, 사람이 하던 일을 AI로 단순 대체한 것만으로는 특허를 받기 어렵다.
- [미확인] 현 출처 Lexology 기사: 403(봇 차단 추정)으로 내용·생존 확인 불가.

**제안 문구**
```js
{ label: '특허(공개)', stance: '특허로 공개하면 출원일부터 최대 20년간 보호받고 기술도 발전한다.', ... }
gist: '특정 판례로 정해지는 문제가 아니라, 기업이 기술 성격에 따라 특허·영업비밀 중 무엇으로 보호할지 선택하는 전략 논쟁이다. 리버스 엔지니어링이 쉬운 기술은 특허가, 내부에 감출 수 있는 기술은 영업비밀이 유리하다는 견해가 맞선다. 또 AI 알고리즘 같은 수학적 방법 자체는 특허를 받기 어렵고 컴퓨터 등에서 구체적으로 실행되는 형태여야 한다는 점도 선택에 영향을 준다.',
```
출처 추가: `{ label: '헤럴드경제(지식재산처 AI 특허출원 안내서)', url: 'https://www.heraldk.com/article/2026060818200872635' }`

---

### 1-6. inventor — AI를 발명자로 인정할 수 있을까? (status: varies → **유지**)

**현재 서술**
> "…일본 대법원(2026-03)·미국·영국은 발명자는 자연인이어야 한다며 거부했고, 독일은 '사람을 발명자로 두되 AI를 활용한 발명 자체는 특허 가능'한 쪽으로 정리됐다. 어느 나라든 AI 활용 발명 자체를 금지하진 않는다."

**확인된 사실**
- [확인함] 일본: 도쿄지법 2024-05-16 → 지재고법 2025-01-30 → 최고재판소 2026-03 상고 기각. 날짜는 보도마다 3월 4일/6일로 엇갈림 [정확한 날짜 미확인, "2026-03" 표기는 안전].
- [확인함] 영국 대법원 2023-12, 미국 연방순회항소법원 2022(Thaler v. Vidal) — 기존 서술 정확. 독일 연방대법원 2024 [기억, 서술은 일반적 이해와 일치].
- [확인함] **한국**: 특허청이 DABUS 출원 무효 처분 → 서울행정법원 2023-06-30(2022구합89524) 청구 기각 → 서울고법 2024-05-16(2023누52088) "AI는 발명자가 될 수 없다" → 대법원 2024두45177 **계속 중(2026-02 로펌 뉴스레터 기준)**. 그 뒤 선고 여부 [미확인].
- [확인함] 미국 특허청 2025-11-28 AI 보조 발명 지침 개정(2024-02 지침 철회): 발명자는 자연인만, 판단 기준은 기존 "착상(conception)". 한국 지식재산처 2026-06 안내서: 사람이 창작 과정에 실질적으로 기여해야 발명자.
- 출처 문제: The Leveraged Years는 신뢰도 확인이 어려운 블로그형 사이트. 교체 권장.

**근거 URL**
- https://www.shinkim.com/kor/media/lawinfo/373 (한국 사건 경과, 세종 뉴스레터)
- https://www.jonesday.com/en/insights/2024/06/tokyo-court-holds-ai-system-cannot-be-inventor-under-patent-law (일본 1심)
- https://www.mlex.com/mlex/amp/articles/2294484 (일본 최고재판소 보도, 유료일 수 있음 [열람 미시도])
- https://www.morganlewis.com/pubs/2025/12/uspto-issues-revised-inventorship-guidance-for-ai-assisted-inventions
- https://www.juve-patent.com/cases/uk-supreme-court-dabus-named-inventor-patent-stephen-thaler/ (현 출처, 200)

**제안 문구**
```js
realCase: { name: 'DABUS (Thaler) 국제 소송', date: '2021~2026',
  gist: '발명 AI "DABUS"를 발명자로 올리려는 시도가 나라마다 다르게 판단됐다. 일본 최고재판소(2026-03)·미국·영국은 발명자는 사람이어야 한다며 거부했고, 독일은 사람을 발명자로 적되 AI를 활용한 발명 자체는 특허를 받을 수 있는 쪽으로 정리됐다. 한국에서도 서울행정법원(2023)과 서울고등법원(2024)이 "AI는 발명자가 될 수 없다"고 판단했고 대법원 판단이 남아 있다. 어느 나라든 사람이 실질적으로 기여해 AI를 도구로 쓴 발명까지 막지는 않는다.' },
sources: [
  { label: '법무법인 세종(한국 DABUS 소송)', url: 'https://www.shinkim.com/kor/media/lawinfo/373' },
  { label: 'JUVE Patent(영국 대법원)', url: 'https://www.juve-patent.com/cases/uk-supreme-court-dabus-named-inventor-patent-stephen-thaler/' },
  { label: 'Jones Day(일본 법원 판단)', url: 'https://www.jonesday.com/en/insights/2024/06/tokyo-court-holds-ai-system-cannot-be-inventor-under-patent-law' },
],
```
※ 세종 링크는 검색 결과로만 확인(본문 열람 미시도). 배포 전 한 번 열어 볼 것. 한국 대법원 선고가 나면 "대법원 판단이 남아 있다"를 고쳐야 함.

---

### 1-7. tmmake — AI가 디자인한 로고, 상표로 등록될까? (status: ongoing → **varies 권장**) ★상

**현재 서술**
> B측 "요건 문제": "창작 주체·창작성 요건을 어떻게 볼지 문제가 남는다." / points "저작권처럼 인간 창작성을 따질 여지"
> gist: "…'식별력'과 '실제 사용'을 중심으로 판단해 AI 생성물도 등록 가능성이 열려 있다는 견해가 있으나, 창작 주체 요건을 어떻게 적용할지는 아직 정리되지 않았다."

**확인된 사실**
- 상표법(한국 제33·34조, 미국 랜험법)의 등록 요건은 **식별력**과 **먼저 등록된 상표와 헷갈리지 않는지(불등록 사유)** 등이며, "누가/무엇이 만들었는가"나 "인간 창작성"은 요건이 아니다 [확인함 — 미국 로펌 해설 다수, 국내 변리사 해설; 법조문 원문 재열람은 안 함].
- 실제 쟁점은 따로 있다 [확인함, 2차 자료]: (1) 로고 **그림 자체의 저작권**은 사람의 창작 기여가 없으면 인정되지 않을 수 있음(한국 2025-06 등록 안내서·미국 저작권청 입장) → 상표 밖 쓰임에서 보호의 빈틈. (2) AI가 이미 등록된 남의 상표와 닮은 로고를 만들 위험. (3) 생성 도구 이용약관상 상업 이용·출원 가능 여부.
- 한국은 **등록주의**라 출원 전 "실제 사용"이 등록 요건이 아니다(사용 의사는 요구) [기억]. gist의 "실제 사용을 중심으로"는 미국식 설명.
- [미확인] AI 생성 로고를 직접 다룬 한국 지식재산처의 공식 기준·대표 판례는 이번 조사에서 찾지 못함.
- [미확인] 현 출처 ABA 뉴스레터: 403으로 내용 확인 불가.

**문제점**: B측이 "상표에도 인간 창작성 요건이 있을 수 있다"는 식으로 읽혀, 저작권과 상표의 차이를 가르치는 게임 본편(지재권 6종)과 어긋난다. 고교생이 잘못 외울 위험이 가장 큰 카드.

**근거 URL**
- https://www.gerbenlaw.com/blog/ai-guided-trademark-development-mitigating-infringement-risks/ (미국 상표 전문 로펌: 창작 주체는 상표 보호와 무관)
- https://news.bloomberglaw.com/us-law-week/ai-generated-logos-require-careful-steps-to-protect-ip-rights (유료, 제목·요지만)
- https://www.lawtimes.co.kr/news/articleViewAmp.html?idxno=209882 (한국 AI 저작물 등록 안내서)

**제안 문구**
```js
sides: [
  { label: '등록 가능', stance: '브랜드를 구별해 주는 힘(식별력)이 있고 남의 상표와 헷갈리지 않으면, 누가 만들었는지는 따지지 않는다.',
    points: ['상표의 핵심은 "출처를 구별하는 힘"', '소비자가 그 표시로 브랜드를 알아보면 기능을 다한 것'] },
  { label: '보호의 빈틈', stance: '상표로 등록되더라도 AI 로고에는 따로 챙겨야 할 위험이 남는다.',
    points: ['로고 그림 자체는 저작권 보호를 받지 못할 수 있다', 'AI가 이미 등록된 남의 상표와 닮은 로고를 만들 수 있다'] },
],
think: '상표에서 중요한 건 "누가 만들었나"일까, "어떻게 쓰이나"일까?',
status: 'varies',
realCase: { name: 'AI 생성 로고의 상표·저작권 보호', date: '상시',
  gist: '상표법은 저작권법과 달리 "사람이 만들었는가"를 등록 요건으로 두지 않아, AI가 만든 로고도 식별력이 있고 먼저 등록된 상표와 비슷하지 않으면 등록될 수 있다는 설명이 일반적이다. 다만 같은 로고의 그림에 대한 저작권은 사람의 창작 기여가 없으면 인정되지 않을 수 있고, 생성 도구의 이용약관도 확인해야 한다. 이 문제를 직접 다룬 대표 판례는 이번 조사에서 찾지 못했다.' },
sources: [
  { label: 'Gerben Law(AI 로고와 상표)', url: 'https://www.gerbenlaw.com/blog/ai-guided-trademark-development-mitigating-infringement-risks/' },
  { label: '법률신문(한국 AI 저작물 등록 안내서)', url: 'https://www.lawtimes.co.kr/news/articleViewAmp.html?idxno=209882' },
],
```
※ 마지막 문장("이번 조사에서 찾지 못했다")은 학생 카드에 어색하면 "아직 대표 판례는 알려지지 않았다"로 바꿔도 됨. 단 "판례가 없다"고 단정하지는 말 것. Gerben 링크는 검색 결과로만 확인(본문 열람 미시도).

---

### 1-8. tmdilute — AI가 유명 브랜드를 흉내 내면? (status: varies → **유지**)

**현재 서술**
> "…미국 법원은 상표 희석 주장을 진행시켰지만(2026-04), 영국 고등법원은 희석을 인정하지 않았다(2025-11). 같은 사안도 나라에 따라 결론이 갈렸다."

**확인된 사실**
- [확인함] 영국 고등법원 2025-11-04(Joanna Smith 판사, [2025] EWHC 2863 (Ch)): 상표 **희석(10조 3항) 주장은 기각**. 그러나 **초기 버전(v1.x·v2.x) 모델이 만든 일부 이미지의 Getty 워터마크는 상표 침해**로 인정 — 판사는 "과거의, 극히 제한적인" 침해라고 표현. 2025-12-16 Stability의 상표 부분 항소 허가 신청은 1심이 거부. Getty는 저작권(2차 침해) 부분 항소 허가를 받아 항소심 진행 중(CA-2026-000007).
- [확인함] 미국: 2026-04-23 캘리포니아 북부 연방지법이 Stability의 기각 신청을 받아들이지 않고 상표 침해·희석 청구를 진행시킴(소장 단계 판단, 최종 결론 아님).

**문제점**: (1) 영국 판결을 "희석 불인정"만 쓰면 학생이 "영국에선 상표 문제 없음"으로 오해. (2) 미국 "진행시켰다"가 "인정했다"로 읽힐 수 있음. 두 나라 결론이 "갈렸다"기보다 **단계가 다르다**(영국=본안 판결, 미국=소송 초기).

**근거 URL**
- https://www.legal500.com/intelligence/united-states/intellectual-property/trademark-law-meets-generative-ai-key-takeaways-from-the-getty-v-stability-ai-ruling (현 Mondaq 링크가 301로 여기로 이동 — URL 교체 권장)
- https://www.taylorwessing.com/en/insights-and-events/insights/2025/11/getty-vs-stability-trade-marks (현 출처, curl 200 / 요약 도구 403)
- https://www.burges-salmon.com/articles/102lydc/getty-images-v-stability-ai-getty-granted-permission-to-appeal

**제안 문구**
```js
realCase: { name: 'Getty Images v. Stability AI', date: '2025~2026',
  gist: 'AI가 만든 이미지에 일그러진 Getty 워터마크가 나타난 것을 두고 다툰 사건. 영국 고등법원(2025-11)은 초기 버전 모델이 만든 일부 이미지에 대해서만 상표 침해를 인정하면서 "아주 제한적"이라고 했고, 유명 상표의 가치를 흐린다는 희석 주장은 받아들이지 않았다. 미국에서는 2026년 4월 법원이 희석을 포함한 상표 청구를 소송 초기에 기각하지 않고 본격 심리로 넘겼을 뿐, 결론은 아직 나지 않았다.' },
sources: [
  { label: 'Legal 500(미국 판단)', url: 'https://www.legal500.com/intelligence/united-states/intellectual-property/trademark-law-meets-generative-ai-key-takeaways-from-the-getty-v-stability-ai-ruling' },
  { label: 'Taylor Wessing(영국 판단)', url: 'https://www.taylorwessing.com/en/insights-and-events/insights/2025/11/getty-vs-stability-trade-marks' },
],
```

---

### 1-9. tmname — "먼저 쓴 이름"을 대기업이 가져가면? (status: decided → **ongoing**) ★상

**현재 서술**
> name: 'Gemini Data v. Google', date: '2026-05' / "…법원은 2026년 5월 구글의 손을 들어줬다. 상표가 같아도 혼동 가능성 판단에 따라 결론이 달라질 수 있음을 보여준 사례다." / 출처 'IIPLA(구글 승소)'

**확인된 사실**
- [확인함] **Gemini Data, Inc. v. Google LLC**(캘리포니아 북부 연방지법 4:24-cv-06412, 2024-09-11 제기)는 **판결이 나지 않았다**. govinfo 공개 결정 목록: 2025-11-25·2026-01-27(수정 소장 허가)·2026-03-20·2026-06-15(증거개시 관련)·**2026-09-29(전문가 증거 신청 일정, Breyer 판사)** — 2026년 가을에도 재판 준비 절차 진행 중. 2026-05 구글 승소 판결은 찾지 못함.
- [확인함] 현 출처 **IIPLA 기사("Google Wins Trademark Suit Over 'Gemini' Branding", 2026-03-23)는 다른 사건**: **P2B Trading Co. v. Google**(플로리다 중부 연방지법, 스피커·헤드폰 회사). 2026-03-20 Corrigan 판사가 P2B의 **예비적 금지명령(소송 중 사용 중단) 신청을 기각** — "그럴듯한 주장이지만 승소 가능성이 상당하다고까지는 못 봤다". 최종 판결이 아니며 사건은 계속 중(2026-07 기록 존재).
- [확인함] 미국 특허상표청은 2024-05·08 구글의 GEMINI 상표 출원 2건을 Gemini Data의 선등록 상표와 **혼동 우려를 이유로 거절**(구글은 소송 결과까지 심사 정지 요청) — National Law Review(현 출처, 2024-10-28 기사).

**문제점**: 사건 결과·날짜·상태 배지가 모두 틀렸다. 학생이 "선사용자가 대기업에 졌다"로 외울 위험. `decided` 배지는 CLAUDE.md "미결 사건을 확정처럼 쓰지 말 것" 규칙에 정면으로 어긋남.

**근거 URL**
- https://www.govinfo.gov/app/details/USCOURTS-cand-3_24-cv-06412/context (Gemini Data 사건 결정 목록)
- https://natlawreview.com/article/gemini-spells-double-trouble-googles-ai-gemini-data-inc-sues-trademark-infringement (현 출처, 200)
- https://iipla.org/news/google-wins-trademark-suit-over-gemini-branding (현 출처 — 실제로는 P2B 사건)
- https://dockets.justia.com/docket/florida/flmdce/3:2026cv00174/453238 (P2B 사건 기록)

**제안 문구**
```js
status: 'ongoing',
realCase: { name: 'Gemini Data v. Google / P2B v. Google', date: '2024~진행 중',
  gist: '"Gemini"라는 이름을 먼저 등록해 쓰던 미국의 작은 AI 회사가 2024년 구글을 상대로 상표 소송을 냈다. 미국 특허상표청은 같은 해 구글의 GEMINI 상표 출원을 이 회사 상표와 헷갈릴 수 있다는 이유로 거절했고, 소송은 2026년 가을에도 재판 준비 단계에 있다. 같은 이름을 쓰던 스피커 회사가 낸 다른 소송에서는 2026년 3월 법원이 "재판 도중 구글의 사용부터 막아 달라"는 신청을 받아들이지 않았지만, 이것도 최종 판결은 아니다.' },
sources: [
  { label: 'National Law Review(Gemini Data 소송·특허상표청 거절)', url: 'https://natlawreview.com/article/gemini-spells-double-trouble-googles-ai-gemini-data-inc-sues-trademark-infringement' },
  { label: 'govinfo(Gemini Data 사건 결정 목록)', url: 'https://www.govinfo.gov/app/details/USCOURTS-cand-3_24-cv-06412/context' },
  { label: 'IIPLA(P2B 사건 금지명령 신청 기각)', url: 'https://iipla.org/news/google-wins-trademark-suit-over-gemini-branding' },
],
```
※ 사이드 "분야 다르면 OK"의 근거로는 P2B 사건(스피커 vs AI)이 오히려 잘 맞는다. 단, P2B는 구글이 오디오 기기에도 Gemini를 쓰려 한다는 주장이라 "분야가 겹치는지"가 다툼거리다.

---

### 1-10. tsstrategy — 특허·오픈소스·영업비밀 중 무엇? (status: varies → **유지**)

**현재 서술**
> 특허 stance "공개하고 법으로 20년 독점한다." / 오픈소스 point "단, 독점 이익은 포기한다"

**확인된 사실·문제점**
- "20년"은 출원일부터(patprotect와 같은 문제) [기억].
- 오픈소스로 공개해도 저작권은 남고, 라이선스 조건(표시·공개 의무 등)·상표·이중 라이선스로 일부 이익을 지킬 수 있다 → "독점 이익은 포기"는 다소 단정. oss 카드(조건을 지켜야 하나)와 논리가 어긋날 수 있음.
- [미확인] 출처 Lexology 403(patprotect와 같은 링크). 두 카드가 같은 출처 하나에 기대고 있어 출처 다양화 권장.

**제안 문구**
```js
{ label: '특허', stance: '공개하고 법으로 출원일부터 최대 20년 독점한다.', ... }
{ label: '오픈소스', stance: '공유해서 생태계와 함께 성장한다.',
  points: ['많은 사람이 쓰며 표준이 될 수 있다', '단, 그 코드로 얻는 독점 이익은 대부분 포기한다(저작권과 라이선스 조건은 남는다)'] },
```

---

### 1-11. explain — AI가 나를 거절한 이유, 알 권리가 있을까? (status: varies → **유지**)

**현재 서술**
> "…기업이 '영업비밀'만 내세워 설명을 거부할 수는 없지만 알고리즘 자체를 통째로 공개할 필요는 없고, 예외적인 경우에만 영업비밀이 앞선다고 정리했다."

**확인된 사실**
- [확인함] 유럽사법재판소 **C-203/22 Dun & Bradstreet Austria, 2025-02-27**. 사실관계: 신용평가 점수 때문에 **휴대전화 계약**(월 10유로)이 거절된 사람. 판단: (1) "실제로 적용된 절차와 원리"를 간결하고 이해할 수 있게 설명해야 하며, 알고리즘이 복잡하다는 이유로 숨을 수 없다. (2) 공식·알고리즘 자체를 공개할 필요는 없다. 개인 정보가 달랐다면 결과가 어떻게 바뀌었을지 설명하는 방식이 충분할 수 있다. (3) 영업비밀은 **일괄 거부 사유가 될 수 없고**, 회사는 해당 정보를 **감독기관이나 법원에 제출**하고 그쪽이 무엇을 얼마나 알려줄지 저울질한다.
- "예외적인 경우에만 영업비밀이 앞선다"는 판결 요지로 확인되지 않음 → 수정 필요.
- [확인함] 한국: 개인정보보호법 **제37조의2**(2023 개정, **2024-03-15 시행**): 완전히 자동화된 결정이 권리·의무에 중대한 영향을 미치면 거부하거나 설명을 요구할 수 있다(행정청의 자동 처분은 제외). 시행령은 결정 기준·처리 과정·주요 개인정보 유형 등을 설명 사항으로 둠.
- [미확인] 현 출처 Inside Privacy: 403(봇 차단 추정). Stibbe 링크는 200, 내용 일치.

**근거 URL**
- https://www.stibbe.com/publications-and-insights/cjeu-confirms-right-of-explanation-in-battle-between-trade-secrets-and (현 출처)
- https://www.itwiki.kr/w/%EA%B0%9C%EC%9D%B8%EC%A0%95%EB%B3%B4_%EB%B3%B4%ED%98%B8%EB%B2%95_%EC%A0%9C37%EC%A1%B0%EC%9D%982 (조문 정리, 2차 자료 — 배포 시 국가법령정보센터 링크로 교체 권장)

**제안 문구**
```js
realCase: { name: '유럽사법재판소(CJEU) Dun & Bradstreet 판결', date: '2025-02',
  gist: '신용평가 점수 때문에 휴대전화 계약이 자동으로 거절된 사람이 이유를 물은 사건에서, 유럽 최고법원은 회사가 "영업비밀"이라는 말만으로 설명을 통째로 거부할 수 없고 실제로 적용된 절차와 원리를 이해할 수 있게 알려야 한다고 했다. 다만 알고리즘 공식 자체를 공개할 필요는 없고, 영업비밀이 걸린 부분은 회사가 감독기관이나 법원에 내면 그쪽이 무엇을 얼마나 알려줄지 저울질하도록 했다. 한국도 2024년 3월부터 개인정보보호법에 완전히 자동화된 결정에 대해 설명을 요구하거나 거부할 수 있는 권리가 생겼다.' },
sources: [
  { label: 'Stibbe(설명 요구권)', url: 'https://www.stibbe.com/publications-and-insights/cjeu-confirms-right-of-explanation-in-battle-between-trade-secrets-and' },
  { label: '국가법령정보센터(개인정보보호법 제37조의2)', url: 'https://www.law.go.kr/법령/개인정보보호법' },
],
```
※ 국가법령정보센터 URL은 형식만 제안(이번 세션에서 열어 보지 않음 [미확인]). 넣기 전에 실제 링크 확인.
※ hook의 "대출 거절"은 가상 상황이라 그대로 둬도 되지만, 사례가 "휴대전화 계약"임을 gist에서 밝히면 혼동이 없다.

---

### 1-12. tsleak — 직원이 AI 비밀을 들고 이직하면? (status: ongoing → **유지**)

**현재 서술**
> "Apple은 전직 직원과 채용 과정을 통해 기밀 설계가 유출됐다며 OpenAI를 상대로 소송을 냈고(2026-07) 진행 중이다. 반면 xAI가 OpenAI를 상대로 낸 유사 주장은 증거 부족으로 각하됐다."

**확인된 사실**
- [확인함] Apple v. OpenAI 등: **2026-07-10** 제기(캘리포니아 북부 연방지법). 피고 OpenAI·io Products·전직 직원 2명. 연방 영업비밀보호법(DTSA) 4건 + 계약 위반 2건. 2026-08-03 Apple 예비적 금지명령 신청, 2026-08-05/06 OpenAI 기각 신청("어떤 비밀인지 특정 못 함"), 2026-10-01 심리 예정(Davila 판사). **심리 결과·판단 [미확인]**.
- [확인함] xAI v. OpenAI: 2026-02 1차 기각(수정 기회 부여) → **2026-06-15 재소 불허 기각**(Rita Lin 판사). 이유: 면접에서 이전 경력을 묻는 것만으로 OpenAI가 비밀 유출을 유도했다고 보기 어렵고, OpenAI가 유출을 알았다는 점도 그럴듯하게 주장하지 못함 → **소장 단계 판단**이지 "증거 부족" 판단이 아님. **xAI가 2026-07 제9연방항소법원에 항소**, 진행 중. 전 직원 개인 상대 소송은 별도 진행.
- 용어: 한국 법률 용어로 "각하"는 소송 요건 불비로 내용 판단 없이 끝내는 것. 이 사건은 청구 자체가 성립하지 않는다는 판단이라 "기각"이 더 가깝다.
- 참고 [확인함] 한국 부정경쟁방지법 개정(2024-08-21 시행): 고의적 영업비밀 침해 징벌 배상 한도 3배 → **5배**.

**근거 URL**
- https://www.axios.com/2026/07/10/apple-sues-openai-trade-secret-theft
- https://www.axios.com/2026/08/06/openai-apple-motion-to-dismiss
- https://www.aljazeera.com/economy/2026/6/15/us-judge-dismisses-musks-xai-trade-secret-lawsuit-against-openai
- https://www.datacenterdynamics.com/en/news/xai-appeals-to-ninth-circuit-after-us-court-dismisses-data-center-trade-secret-case-against-openai/
- https://techcrunch.com/2026/07/13/the-wildest-allegations-in-apples-trade-secrets-lawsuit-against-openai/ (현 출처, 200)
- https://www.courthousenews.com/judge-tosses-xai-claims-that-openai-stole-trade-secrets/ (현 출처, curl 200 / 요약 도구 403 — 1차 기각(2월) 기사인지 2차(6월) 기사인지 [미확인])

**제안 문구**
```js
realCase: { name: 'Apple v. OpenAI / xAI v. OpenAI', date: '2025~2026',
  gist: 'Apple은 전직 직원들이 기밀 설계를 들고 OpenAI로 옮겼고 채용 과정에서도 기밀을 요구했다며 2026년 7월 소송을 냈고, OpenAI는 "어떤 비밀인지 구체적으로 밝히지 못했다"며 소송을 끝내 달라고 맞서고 있다. xAI가 OpenAI를 상대로 낸 비슷한 소송은 1심에서 "면접에서 이전 경력을 묻는 것만으로 비밀 유출을 유도했다고 보기 어렵다"는 이유로 기각됐고(2026-06), xAI가 항소해 다투고 있다. 인재 이동과 영업비밀 보호의 경계가 계속 다퉈지고 있다.' },
sources: [
  { label: 'TechCrunch(Apple v. OpenAI)', url: 'https://techcrunch.com/2026/07/13/the-wildest-allegations-in-apples-trade-secrets-lawsuit-against-openai/' },
  { label: 'Al Jazeera(xAI 소송 기각)', url: 'https://www.aljazeera.com/economy/2026/6/15/us-judge-dismisses-musks-xai-trade-secret-lawsuit-against-openai' },
],
```

---

## 2. 추가 제안 (우선순위: 기존 건 갱신 > 교체 > 추가)

`verify-dogam.mjs`가 "쟁점 12개·분포 4/2/3/3"을 강제하므로, 새 카드를 더하려면 verify 수정이 함께 필요하다. 그래서 대부분 **기존 카드 안에 흡수**하는 방식으로 제안한다.

| 순위 | 유형 | 내용 | 넣을 곳 | 근거 | 확인 |
|---|---|---|---|---|---|
| 1 | 갱신 | **Cox v. Sony(2026-03 미 대법원)** — 서비스 회사가 이용자 침해에 책임지는 기준(알기만 해선 부족, 부추김·침해용 설계 필요). "회사 vs 이용자 책임" 토론의 가장 직접적인 실제 기준 | provider | §1-3 | 확인함 |
| 2 | 갱신 | **한국 사례 3종**: 지상파 3사 v. 네이버(학습, 진행 중) · DABUS 한국 소송(서울고법 2024, 대법원 계속) · 개인정보보호법 제37조의2(2024-03) | train · inventor · explain | §1-1, 1-6, 1-11 | 확인함(대법원 선고 여부만 미확인) |
| 3 | 갱신 | **한국 정부 안내서 2종**: AI 활용 저작물 등록 안내서(2025-06) · AI 학습 공정이용 안내서(2026-02) — 법적 구속력은 없음을 함께 표기 | aiwork · train(또는 교사용 메모) | §1-1, 1-2 | 확인함 |
| 4 | 갱신 | **Thomson Reuters v. Ross 항소심(2026-09-29)** — AI 학습 공정이용 첫 항소심, 결론은 "공정이용 아님"(비생성형) | train | §1-1 | 확인함 |
| 5 | 갱신(선택) | **GEMA v. OpenAI(뮌헨 지법 2025-11-11)** — 가사를 "외워서" 그대로 내놓은 것은 복제, 항소 예정. 미국·영국과 다른 결론이라 "나라별 차이" 수업에 좋음 | provider 또는 train | https://www.gema.de/en/w/landmark-ruling-gema-against-openai , https://www.taylorwessing.com/de/insights-and-events/insights/2025/11/gema-v-openai | 확인함(항소 결과 미확인) |
| 6 | 갱신(선택) | **디즈니·유니버설 v. 미드저니(2025-06~)** — 캐릭터 출력물 책임 | provider | https://www.insurancejournal.com/news/national/2025/06/12/827252.htm | 확인함(이후 진행 미확인) |
| 7 | 교체 후보 | patprotect와 tsstrategy가 **같은 구도·같은 출처(Lexology)** 로 겹친다. patprotect(특허 칸)를 **"AI로 만든 발명, 특허 받을 수 있을까?"** — 지식재산처 「AI 시대 올바른 특허출원 안내서」(2026-06): 사람이 실질적으로 기여해야 함, AI가 만든 가짜 실험 결과를 내면 책임, 미국 특허청 2025-11 지침 — 로 바꾸는 안. 단 inventor 카드와 일부 겹치므로 교사 판단 | patprotect 자리 | https://www.heraldk.com/article/2026060818200872635 , https://www.morganlewis.com/pubs/2025/12/uspto-issues-revised-inventorship-guidance-for-ai-assisted-inventions | 확인함 |
| 8 | 추가(구조 변경 필요) | **얼굴·목소리 도용(퍼블리시티권·딥페이크)** — 고교생 생활과 가장 가깝다. 한국 부정경쟁방지법 "유명인 성명·초상·음성 무단 사용" 조항(2022 시행으로 기억), AI 기본법(2026-01-22 시행) 생성물 표시·딥페이크 워터마크 의무(과태료는 최소 1년 계도) | 새 카드(권리 분류 추가 필요) 또는 교사용 보충 | AI 기본법: https://www.mt.co.kr/tech/2025/12/31/2025123009504430416 | AI 기본법=확인함 / 부경법 퍼블리시티 조항=**미확인**(이번에 검색 안 함) |
| 9 | 추가(맥락) | **EU AI Act 범용 AI 저작권 의무** — 2025-08-02 적용(학습 데이터 요약 공개, 저작권 정책·robots.txt 등 거부 표시 존중), 집행은 2026-08-02부터 | train 또는 하단 "더 알아보기" | https://www.mayerbrown.com/en/insights/publications/2025/08/eu-ai-act-news-rules-on-general-purpose-ai-start-applying-guidelines-and-template-for-summary-of-training-data-finalized | 확인함 |
| 10 | 추가(맥락) | 한국 부정경쟁방지법 개정(2024-08-21): 영업비밀 침해 징벌 배상 최대 5배 | tsleak(한 구절) | https://www.newsseoul.co.kr/news/view/1065579624231488 | 확인함 |

참고: 2025-10-01 특허청이 **지식재산처**로 개편됐다. 도감 본문엔 "특허청" 표기가 없지만, 게임·퀴즈(data/quiz.js 등)에 "특허청"이 나오면 맞춰 볼 것(이번 검증 범위 밖, 미점검).

---

## 3. 기준일·고지 문구 갱신 제안

**dogam.html 하단 (현재)**
> 교육용 토론 자료이며 법률 자문이 아닙니다. 리서치 기준일 2026년 7월 — <b>🔥 진행 중</b>으로 표시된 사건은 이후 결과가 바뀔 수 있습니다.

**제안** (배지 라벨 "논쟁 진행 중"과 맞춤, 재확인일 표기)
```html
<p class="d-note">교육용 토론 자료이며 법률 자문이 아닙니다. 리서치 2026년 7월, 마지막 확인 2026년 11월 17일 —
<b>🔥 논쟁 진행 중</b>으로 표시된 사건은 이후 결과가 바뀔 수 있습니다.</p>
```
※ 위 수정안을 모두 반영한 뒤에만 "마지막 확인 2026년 11월 17일"을 쓸 것. 일부만 반영하면 그 날짜가 거짓이 된다.

함께 고칠 곳
- `data/issues.js` 1~5행 주석: "리서치 기준일 2026-07" → "리서치 2026-07, 재확인 2026-11-17(docs/review/2026-11-17-dogam-verifier.md)"
- 설계서 §8 표: tmname 행 "Gemini Data v. Google 구글 승소(2026-05) / decided" → "진행 중 / ongoing", oss 행 "항소·정지" → "제9항소법원 DMCA 청구 기각 유지(2026-09), 계약 청구 계속". 개별 검수 체크(☑)는 교사가 직접.
- `verify-dogam.mjs` 보강 제안(선택): `decided` 카드의 realCase.date가 "진행 중"을 포함하지 않는지, `ongoing/varies` 카드 gist에 "확정됐다·승소했다·손을 들어줬다" 같은 표현이 없는지 검사. 이번 tmname 오류(결정 아닌 사건을 decided로)는 현재 검사로는 잡을 수 없다.

---

## 4. 출처 링크 점검 결과 (curl, 2026-11-17)

| URL | 상태 | 비고 |
|---|---|---|
| authorsguild.org …anthropic-settlement | 200 | 내용 일치, 2026-11-16 갱신 |
| nortonrosefulbright.com …2026 | 200 | 내용 일치(NYT는 MDL로 서술) |
| morganlewis.com …thaler | 200 | 내용 일치 |
| bakerdonelson.com …thaler | 200 | 열람 안 함(제목 일치) |
| bakerlaw.com/the-copilot-litigation | 200 | **낡음**: 항소심 판결 대기로 표시 |
| githubcopilotlitigation.com | 200 | 열람 안 함 |
| lexology.com …15568a55 | **403** | 봇 차단 추정, **내용 미확인** |
| theleveragedyears.com …dabus | 200 | 블로그형, 날짜를 3/4로 표기(다른 보도는 3/6). 교체 권장 |
| juve-patent.com …dabus | 200 | 열람 안 함(제목 일치) |
| americanbar.org …ai-creates-who-owns-it | **403** | 봇 차단 추정, **내용 미확인** |
| mondaq.com …1802566 | 301→legal500.com 200 | 내용 일치. URL 교체 권장 |
| taylorwessing.com …getty-vs-stability-trade-marks | 200(curl)/403(요약 도구) | 내용 직접 확인 못 함, 다른 자료로 사실 확인 |
| iipla.org …google-wins-trademark-suit… | 200 | **다른 사건(P2B v. Google)** |
| natlawreview.com …gemini-data | 200 | 2024-10 소 제기 기사, 내용 일치 |
| insideprivacy.com …cjeu | **403** | 봇 차단 추정, **내용 미확인** |
| stibbe.com …cjeu | 200 | 내용 일치 |
| techcrunch.com …apple…openai | 200 | 열람 안 함(제목 일치) |
| courthousenews.com …xai | 200(curl)/403(요약 도구) | 1차·2차 기각 중 어느 기사인지 미확인 |

---

## 5. 확인함 / 미확인 구분

**확인함 (웹 출처로 직접 확인)**
- Bartz 합의 최종 승인 2026-07-20·약 3천 달러/권·과거 행위만 대상, Alsup 판단 내용(합법 구매=공정이용, 해적판=공정이용 아님)
- Kadrey v. Meta 2025-06-25 판단 요지, Thomson Reuters v. Ross 제3항소법원 2026-09-29 유지
- 지상파 3사 v. 네이버 진행 중(2026-04 변론), 문체부 공정이용 안내서 2026-02-26, 저작권 등록 안내서 2025-06(보도 기준 7월 해설)
- Thaler v. Perlmutter 상고 불허 2026-03-02, Allen v. Perlmutter 진행 중(2026-07 보도 기준)
- NYT 기여 책임 주장 철회 2026-06-25, Cox v. Sony 2026-03-25 요지
- Doe v. GitHub 제9항소법원 2026-09-16 판결 요지, 계약 청구 잔존(EFF)
- DABUS 일본(2026-03)·한국 1·2심 경과·대법원 계속(2026-02 기준), USPTO 2025-11 지침, 지식재산처 2026-06 안내서, 특허청→지식재산처(2025-10-01)
- Getty 영국 판결(희석 기각+제한적 침해 인정)·항소 경과, 미국 2026-04-23 기각 신청 불허
- Gemini Data 사건 2026-09-29까지 결정 목록(판결 없음), USPTO의 구글 GEMINI 출원 거절(2024), IIPLA 기사=P2B 사건(2026-03-20)
- CJEU C-203/22 2025-02-27 판단 요지, 한국 개인정보보호법 제37조의2 시행 2024-03-15
- Apple v. OpenAI 제기 2026-07-10·OpenAI 기각 신청 2026-08, xAI 기각 2026-06-15·항소 2026-07
- AI 기본법 2026-01-22 시행·계도기간, EU AI Act GPAI 의무 2025-08-02, 부경법 5배 배상 2024-08-21, GEMA v. OpenAI 2025-11-11

**미확인 (12건)**
1. NYT v. OpenAI 약식판결 결과·재판 날짜
2. Apple v. OpenAI 2026-10-01 심리 결과(기각 신청·금지명령 신청 판단)
3. 한국 DABUS 대법원(2024두45177) 2026-02 이후 선고 여부
4. Allen v. Perlmutter 판결 여부(2026-07 이후)
5. Doe v. GitHub 1심에 남은 계약 청구의 정확한 범위·진행 상황
6. 일본 최고재판소 DABUS 정확한 날짜(3월 4일 vs 6일)
7. Gemini Data v. Google 재판 날짜·약식판결 신청 여부
8. Lexology·ABA·Inside Privacy 출처 3건의 실제 내용(403)
9. courthousenews xAI 기사가 1차(2월)·2차(6월) 중 어느 기각 기사인지
10. Thomson Reuters v. Ross 항소심 판결 이유의 공개 범위(봉인 여부 보도 엇갈림)
11. 한국 부정경쟁방지법 퍼블리시티(성명·초상·음성) 조항 — 이번에 검색하지 않음(기억 기반)
12. GEMA v. OpenAI·디즈니 v. 미드저니·Getty 영국 항소심의 2026년 하반기 진행

**기억 기반(출처 재확인 안 함, 낮은 위험)**: NYT 소 제기 2023-12, 특허 존속기간 출원일부터 20년(특허법 제88조), 한국 상표 등록주의, 독일 연방대법원 2024 DABUS 판단.
