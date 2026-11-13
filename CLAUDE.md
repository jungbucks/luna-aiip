# luna-ip-game

지식재산권 6종 학습 선택형 스토리 웹게임(고교 수업용) + 자매 페이지 도감(`dogam.html`, AI 지재권 쟁점 12건).
바닐라 ES 모듈, 빌드 없음. 스펙 `SPEC.md`(v3) · 계획 `ROADMAP.md`(10항목).

## 현재 상태 (2026-07-20)

- **게임 v0.5 완성**: 타이틀 → 캐릭터 선택(솔/루나) → 인트로 → EP1~6(채팅·A/B/C 선택·결과·정산) → 법정 → 엔딩 3종 + 리포트 + 이어하기. EP2~6 대사·스토리 씬·연출(스탯 카운트업·타이핑 인디케이터) 완결.
- **캐릭터 에셋 개선**: 솔·루나 각각 neutral/happy/panic/shock 4종의 512px 투명 PNG. 기존 `.idol-svg`, `data-idol`, `data-expr` DOM 계약과 표정 전환 규칙은 유지하고 `img.src`를 교체한다.
- **O/X 확인 퀴즈(2026-11-14)**: 정산 직전 O/X(틀리면 하나 더), 스탯·배지·엔딩 무관, 엔딩 '다시 볼 개념'에 둘 다 놓친 개념. 설계 `docs/superpowers/specs/2026-11-14-ox-quiz-design.md`, 계획 `docs/superpowers/plans/2026-11-14-ox-quiz.md`. 팝업 `guardMs`(퀴즈만 0.3초 버튼 잠금 — 연타가 다음 문제를 누르지 않게). 프로브용 `window.LUNA.showEnding(key)`. **문항 법적 정확성 교사 검수 대기.**
- **도감 완성**: AI 지재권 쟁점 12건(저작권4·특허2·상표3·영업비밀3), 실제 판례 + 상태 배지, 게임 엔딩에 티저 링크 1줄.
- **배포 대기**: GitHub Pages 예정. 원격 없음 → 사용자가 `luna-ip-game` public 레포 생성 후 "luna push" 지시 시 remote·push·Pages. dogam SPEC §8 개별 사실 검수는 교사 판단으로 기존 고지(법률자문 아님·기준일·상태배지·출처) 하에 배포 결정(미검수 상태).

## 구조 (전부 바닐라 ES 모듈)

```
index.html          화면 셸 6개(scr-title/select/intro/ep/court/end) + 팝업 오버레이 + modulepreload
css/style.css       다크 네온(퍼플~시안) 메신저 무드, 본문 15px+, 480px 카드
css/dogam.css       도감 스타일(게임 팔레트 공유)
js/engine.js        규칙 단일 원천(SPEC §6). DOM 없음, 수치 변경 금지
js/state.js         localStorage(luna_save_v1, schemaVersion 검사)
js/main.js          게임 루프 오케스트레이터(규칙 계산 금지 — engine 위임)
js/ui/chat.js       채팅 로그·선택지 + esc()=토큰 치환+이스케이프 단일 통로
js/ui/popup.js      팝업·델타 / ending.js 법정·엔딩·리포트
assets/characters/  솔·루나 PNG 각 4표정(512×512, 투명 배경)
js/ui/character.js  PNG 경로·표정 전환 + T() 토큰 치환. 계약: .idol-svg, data-idol, data-expr
js/dogam/render.js·main.js  도감 엔진
data/episodes.js    EP1~6 시나리오(스키마 SPEC §8), 이름은 {n} 토큰
data/strings.js     인트로·브릿지·법정·엔딩·리포트·퀴즈 문구
data/quiz.js        O/X 확인 퀴즈 12문항(EP마다 본 문제+하나 더, 교사 검수 대기)
js/quiz.js          퀴즈 판정·기록(G.quiz)·다시 볼 개념 목록(DOM 없음, verify가 검산)
data/issues.js      도감 ISSUES 12·STATUS_META(양측 대립·상태 배지·실제 사례·출처)
test/verify.mjs     게임 검산 25건 / verify-dogam.mjs 도감 10건
test/probe.html     게임 E2E / probe-dogam.html 도감 E2E
```

## 규칙·함정

- **데이터에 이름 하드코딩 금지** — 이름은 `{n}` 토큰, 받침 자동 조사(`{n가}{n는}{n를}{n랑}{n와}`). 치환기 `T()`=character.js, 통로=chat.js `esc()`. verify가 잡는다. 실존 인물 닮은꼴 금지(SPEC §12.5).
- **미결 사건을 확정처럼 쓰지 말 것** — dogam은 status(decided/ongoing/varies) 배지로 표시, verify-dogam이 단정 금칙어 차단. 사례 갱신 시 웹 재확인 후 issues.js의 realCase·status·sources·하단 기준일 함께 수정.
- **ES 모듈이라 HTTP/Pages 전용** — `<script type="module">`은 file://(더블클릭)에서 CORS로 안 뜬다(코드 버그 아님). 게임·도감 모두 서버 서빙 필요.
- engine.js는 규칙 단일 원천(수치 변경 금지). main.js는 계산 금지(engine 위임).
- 이어하기 복원 = 현재 EP 시작 지점부터(채팅 중간 저장 안 함 — 의도된 단순화).

## 검증 (수정 후 필수)

1. 게임 `node test/verify.mjs`(25건) — 미달 시 배포 금지. 도감 `node test/verify-dogam.mjs`(10건).
2. E2E 프로브(구조·흐름 변경 시): **게임과 같은 오리진에서 서빙 필수** — file:// 프로브 + http iframe은 크로스오리진으로 조용히 죽는다(2026-07-15 실제 발생). 절차: `probe.html`을 루트에 복사 → Node 정적 서버(scratchpad) → `msedge --headless=new --user-data-dir=<임시> --virtual-time-budget=20000 --dump-dom http://localhost:PORT/...` → 수확 후 복사본 삭제. 채팅은 타이핑 인디케이터 때문에 메시지당 최대 2탭.

## 참고 문서

- `SPEC.md` — 규칙·수치·완료기준(v3, 완결형)
- `ROADMAP.md` — 성장 계획 10항목(잔여: #4 O/X 퀴즈, #10 배포)
- `docs/superpowers/specs/2026-07-18-ip-dogam-design.md` — 도감 설계·검증표
