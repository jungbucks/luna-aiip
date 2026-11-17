# luna-ip-game

지식재산권 6종 학습 선택형 스토리 웹게임(고교 수업용) + 자매 페이지 도감(`dogam.html`, AI 지재권 쟁점 12건).
바닐라 ES 모듈, 빌드 없음. 스펙 `SPEC.md`(v3) · 계획 `ROADMAP.md`(10항목).

## 현재 상태 (2026-11-17)

- **캐릭터 톡 다시 씀(2026-11-17)**: EP1~6 `messages` 전부 — 대표에겐 존댓말·둘끼리 반말, **세아는 온점 / 준호는 온점 없이 짧게 끊어**, 유행어·"~임/~음" 금지, 편마다 상황→유혹→의심(질문만)→결정 넘기기. SPEC §5의 "수정 금지"는 교사가 해제. 규칙은 verify [말투] 15건이 지킨다. **스토리 장면·편 소개·인트로·법정·엔딩 문구도 다시 씀**(명언풍·느낌표 없음. 인트로에 "대표 = 동아리 회장, 준호·세아 = 후배" — 존댓말의 까닭). EP2 오답 사건은 "경쟁사가 글을 보고 비슷한 제품"으로 바꿈(법 정확성). **결과 알림·개념 카드도 다시 씀**(제목은 담담하게, 비유 "~와 같아요.", 배운 것 "~다."). **선택지도 다시 씀**: 대표의 답장(결정 + 이유 두 문장), 오답·정답 자리는 편마다 섞이고(`chat.js choiceOrder`, 프로브는 `window.__rand`·`data-k`로 고름) 겉모습은 같다. 메신저 프로필은 글자 대신 **색 바탕 + 얼굴 없는 사람 모양**(`chat.js avatarTone`, `phone.css .ava[data-c]`). 설계 `docs/superpowers/specs/2026-11-17-chat-dialogue-design.md`. **글 다듬기(ROADMAP #12) 끝 — O/X 퀴즈 문장 손질·타이틀 부제·단추 문구(새로 시작/이어서 하기/뭐라고 답할까?)까지. 다음 = 교사가 해 보고 판단(선택지가 뻔하면 B안: 그럴듯한 오답 하나 더 · EP2 오답 사건 변경 승인) · O/X 12문항 검수.** 깃헙엔 아직 안 올림(교사 지시).

- **v0.6 루나폰(2026-11-17)**: 게임 전체가 폰 한 대 — 잠금화면 타이틀 → 홈 화면(위젯·장식 앱·독) 위 스토리 → **알림을 눌러야** 메신저 앱에서 채팅 → 선택(내 답장 말풍선) → 결과 알림창 → O/X → **권리 수첩에 알게 된 것 적기** → 정산. 다크/라이트 모드, 설정 앱, 산출물 "나의 권리 수첩"(인쇄·PDF·글 복사). 규칙·대사는 그대로. 설계 `docs/superpowers/specs/2026-11-17-phone-ux-design.md`, 계획 `docs/superpowers/plans/2026-11-17-phone-ux.md`. main에 합쳐 올림(2026-11-17).

- **게임 v0.5 완성**: 타이틀 → 캐릭터 선택(솔/루나) → 인트로 → EP1~6(채팅·A/B/C 선택·결과·정산) → 법정 → 엔딩 3종 + 리포트 + 이어하기. EP2~6 대사·스토리 씬·연출(스탯 카운트업·타이핑 인디케이터) 완결.
- **캐릭터 에셋 개선**: 솔·루나 각각 neutral/happy/panic/shock 4종의 512px 투명 PNG. 기존 `.idol-svg`, `data-idol`, `data-expr` DOM 계약과 표정 전환 규칙은 유지하고 `img.src`를 교체한다.
- **O/X 확인 퀴즈(2026-11-14)**: 정산 직전 O/X(틀리면 하나 더), 스탯·배지·엔딩 무관, 엔딩 '다시 볼 개념'에 둘 다 놓친 개념. 설계 `docs/superpowers/specs/2026-11-14-ox-quiz-design.md`, 계획 `docs/superpowers/plans/2026-11-14-ox-quiz.md`. 팝업 `guardMs`(퀴즈만 0.3초 버튼 잠금 — 연타가 다음 문제를 누르지 않게). 프로브용 `window.LUNA.showEnding(key)`. **문항 법적 정확성 교사 검수 대기.**
- **도감 완성**: AI 지재권 쟁점 12건(저작권4·특허2·상표3·영업비밀3), 실제 판례 + 상태 배지, 게임 엔딩에 티저 링크 1줄.
- **배포 대기**: GitHub Pages 예정. 원격 없음 → 사용자가 `luna-ip-game` public 레포 생성 후 "luna push" 지시 시 remote·push·Pages. dogam SPEC §8 개별 사실 검수는 교사 판단으로 기존 고지(법률자문 아님·기준일·상태배지·출처) 하에 배포 결정(미검수 상태).

## 구조 (전부 바닐라 ES 모듈)

```
index.html          폰 껍데기(.device > #app) + 화면 6개(scr-title/select/intro/ep/court/end) + 산출물 층 + 팝업. scr-ep 안에 홈 화면·알림 배너·스토리 무대·앱 층 3개
css/style.css       색 토큰(다크/라이트)·글꼴·폰 껍데기·유리 면·잠금화면·선택·인트로·법정·엔딩·팝업. 본문 15px+
css/phone.css       홈 화면·앱 층(메신저·권리 수첩·설정)·적기·산출물·인쇄용
assets/fonts/       Pretendard 서브셋 woff2 3종(400·600·800) + LICENSE.txt (외부 CDN 없음)
css/dogam.css       도감 스타일(게임 팔레트 공유)
js/engine.js        규칙 단일 원천(SPEC §6). DOM 없음, 수치 변경 금지
js/state.js         localStorage(luna_save_v1, schemaVersion 검사)
js/main.js          게임 루프 오케스트레이터(규칙 계산 금지 — engine 위임)
js/ui/chat.js       채팅 로그·선택지 + esc()=토큰 치환+이스케이프 단일 통로
js/ui/popup.js      팝업·델타 / ending.js 법정·엔딩·리포트
assets/characters/  솔·루나 PNG 각 4표정(512×512, 투명 배경)
js/ui/character.js  PNG 경로·표정 전환 + T() 토큰 치환. 계약: .idol-svg, data-idol, data-expr
js/ui/theme.js      다크/라이트 모드(키 luna_theme — 게임 기록과 별개)
js/ui/phone.js      시계, 홈 상태(story/notify/idle), 앱 열기·닫기, 뒤로 가기, 장식 앱. 독 아이콘 클릭은 여기서만 건다
js/ui/settings.js   설정 앱(모드·기록 초기화)
js/ui/notebook.js   권리 수첩 앱(보기·적기·고치기) + 산출물 층(인쇄·글 복사)
js/notes.js         적은 글 저장·검사·산출물 글(키 luna_notes_v1, DOM 없음, verify가 검산)
js/dogam/render.js·main.js  도감 엔진
data/episodes.js    EP1~6 시나리오(스키마 SPEC §8), 이름은 {n} 토큰
data/strings.js     인트로·브릿지·법정·엔딩·리포트·퀴즈 문구 + ui(폰 화면 문구 — 새 UI 문구는 여기에만)
data/quiz.js        O/X 확인 퀴즈 12문항(EP마다 본 문제+하나 더, 교사 검수 대기)
js/quiz.js          퀴즈 판정·기록(G.quiz)·다시 볼 개념 목록(DOM 없음, verify가 검산)
data/issues.js      도감 ISSUES 12·STATUS_META(양측 대립·상태 배지·실제 사례·출처)
test/verify.mjs     게임 검산 78건(퀴즈 8·이어 하기 6·모드 6·프로필 3·수첩 12·말투·선택지·알림·장면 15 포함) / verify-dogam.mjs 도감 10건
test/probe.html     게임 E2E / probe-dogam.html 도감 E2E
test/run-probe.mjs  프로브 실행기(서버 + 헤드리스 Edge + 수확) — `node test/run-probe.mjs`
test/probe-shots.html  캡처용 프로브(원하는 장면까지 자동 진행)
```

## 규칙·함정

- **데이터에 이름 하드코딩 금지** — 이름은 `{n}` 토큰, 받침 자동 조사(`{n가}{n는}{n를}{n랑}{n와}`). 치환기 `T()`=character.js, 통로=chat.js `esc()`. verify가 잡는다. 실존 인물 닮은꼴 금지(SPEC §12.5).
- **미결 사건을 확정처럼 쓰지 말 것** — dogam은 status(decided/ongoing/varies) 배지로 표시, verify-dogam이 단정 금칙어 차단. 사례 갱신 시 웹 재확인 후 issues.js의 realCase·status·sources·하단 기준일 함께 수정.
- **ES 모듈이라 HTTP/Pages 전용** — `<script type="module">`은 file://(더블클릭)에서 CORS로 안 뜬다(코드 버그 아님). 게임·도감 모두 서버 서빙 필요.
- engine.js는 규칙 단일 원천(수치 변경 금지). main.js는 계산 금지(engine 위임).
- 이어하기 복원 = 현재 EP 시작 지점부터(채팅 중간 저장 안 함 — 의도된 단순화). **EP에 들어설 때 `G.epStart` 사본을 저장하고 이어 하기는 그 사본에서 다시**(`js/resume.js`, 2026-11-14) — 예전엔 선택·퀴즈·정산 중 새로 고치면 점수가 두 번 들어갔다. 사본 없는 옛 저장은 예전처럼.

- **새 층은 `#app`의 자손이어야 한다** — 팝업이 떠 있는 동안 `popup.js`가 `#app`의 직계 자식(팝업 제외)에 `inert`를 건다. 밖에 두면 팝업 뒤에서 눌려 점수가 두 번 들어가는 옛 결함이 돌아온다.
- **저장 키 셋은 서로 별개**: `luna_save_v1`(게임) · `luna_notes_v1`(적은 글) · `luna_theme`(모드). 기록 초기화·처음부터는 게임+글을 지우고 모드는 남긴다. 적은 글은 점수·배지·엔딩과 무관.
- **학생이 적은 글은 `notebook.js`의 `escPlain()`으로** — `esc()`는 `{n}` 토큰을 아이돌 이름으로 바꿔 버린다.
- **뒤로 가기는 방문 기록 한 칸 규칙**(`phone.js`): 앱이 열릴 때만 한 칸을 채우고, 프로그램이 `history.back()`을 부르지 않는다. 팝업·적기 단계에서는 무시.
- **흐림(`backdrop-filter`)은 배경화면 위에 떠 있고 스크롤되지 않는 면에만.** 메신저 안·수첩 목록·리포트에는 쓰지 않는다(저사양 폰, v0.3.1의 교훈).
- **아이폰 그대로 금지** — 다이내믹 아일랜드·광택 사각 아이콘 등. 지재권을 가르치는 게임이다.
- **헤드리스에서는 CSS 전환이 멈춰 있다** — 앱 층이 scale(.1)·opacity 0인 채라 배치 검사가 거짓 통과한다. `run-probe.mjs`가 "움직임 줄이기"를 강제해 끝 상태로 그린다(`--motion`으로 끔). 실제 전환 모습은 눈으로 확인.

## 검증 (수정 후 필수)

1. 게임 `node test/verify.mjs`(78건) — 미달 시 배포 금지. 도감 `node test/verify-dogam.mjs`(10건).
2. E2E 프로브(구조·흐름 변경 시): **`node test/run-probe.mjs`** 한 줄(종료 코드 0 = 전부 PASS). 캡처는 `node test/run-probe.mjs test/probe-shots.html --shot=<png> --url="/__probe.html?scene=home&theme=light&w=1366&h=700" --size=1366,700`. 아래는 실행기가 대신 해 주는 옛 수동 절차(원리 참고용): **게임과 같은 오리진에서 서빙 필수** — file:// 프로브 + http iframe은 크로스오리진으로 조용히 죽는다(2026-07-15 실제 발생). 절차: `probe.html`을 루트에 복사 → Node 정적 서버(scratchpad) → `msedge --headless=new --user-data-dir=<임시> --virtual-time-budget=20000 --dump-dom http://localhost:PORT/...` → 수확 후 복사본 삭제. 채팅은 타이핑 인디케이터 때문에 메시지당 최대 2탭.

## 참고 문서

- `SPEC.md` — 규칙·수치·완료기준(v3, 완결형)
- `ROADMAP.md` — 성장 계획 10항목(잔여: #4 O/X 퀴즈, #10 배포)
- `docs/superpowers/specs/2026-07-18-ip-dogam-design.md` — 도감 설계·검증표
