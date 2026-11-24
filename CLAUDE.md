# luna-ip-game

지식재산권 6종 학습 선택형 스토리 웹게임(고교 수업용) + 자매 페이지 도감(`dogam.html`, AI 지재권 쟁점 12건).
바닐라 ES 모듈, 빌드 없음. 스펙 `SPEC.md`(v3) · 계획 `ROADMAP.md`(10항목).

## 현재 상태 (2026-11-24)

- **플레이테스트 9항목 반영(2026-11-24)**: ① ourlog 재선택(half) 캡션 undefined → `ourlog-feed.js captionFor`(half 없으면 right, 없으면 빈 글) + EP별 half 캡션 ② 정산 팝업에서 새로 고치면 끝낸 EP 처음으로 돌아가던 것 → `bridge()`가 정산 직후 `nextEp`+`markEpStart`+저장(버튼은 `enterEp`만) ③ **오답 📈 ≤ 0**(EP1 +5→-5, EP2 +10→-5, EP6 +15→-10, SPEC §6.2) — 재선택 경로가 바로 맞힌 경로보다 📈가 높게 끝나지 않음, 엔딩 `fameLine(f, missed)`가 놓친 편 수를 말함 ④ 선택 직전 대화의 결론 줄을 지우고 C 질문 카드(`hint`)로 옮김(의견 대립은 남김) ⑤ O/X 정답 배치 XO·OX·XO·XO·OX·OX, EP5 두 번째 문항 = 동아리 공연 영상 유튜브 광고 ⑥ 처음 판단 이름표 = 바로 맞힘 / 다시 생각해서 맞힘 / 놓치고 그대로 진행, 수첩 글 `notes.js noteIssue`(완성형 한글·영문 5자 이상·3종 이상 — 'ㅋㅋㅋㅋㅋ'·'하하하하하' 막고 안내 `ui.notes.issue`) ⑦ ourlog 좋아요 = 게시물 올린 때의 📈(`state.postFame`, `recordPost`/`fameAt`, checkSave에 추가) ⑧ 알림 배너는 점수 카드 아래(`phone.js placeNotify`), 채팅 수치 칩·결과 팝업 델타·리포트 점수에 자금/인지도/신뢰 이름표, 선택 화면 [‹ 처음 화면으로](`#selBack`). 통화·달력은 이미 div+aria-hidden(장식) ⑨ 세아는 대표에게 존댓말·준호에게 반말, 상대가 바뀌면 `messages`의 `to`로 묶음을 나눔(`chat.js`). verify 163·E2E 214. ⚠️ 바뀐 대화·질문 카드·O/X·캡션 문구 교사 검수 대기.

- **교육적 개선(2026-11-20, 교사 승인 범위)**: 법정·집행유예 → **회사 위기 점검 회의**(`engine.checkCrisis`, 신뢰 0 → 30 회복, `crisisCount`, 게임은 끝나지 않고 6편 완주). 회의는 놓친 결정을 `kind:'own'`(우리 권리 확보·관리: 특허·상표·영업비밀)과 `kind:'others'`(남의 권리 침해 위험: 저작권·초상권·퍼블리시티)로 나눠 보여 줌. 엔딩 = 운영 결과(위기·유니콘·생존) / 리포트는 **운영 결과와 학습 결과 분리**. `badges` = 처음 판단 기록(바로 맞힘·피드백 뒤 바꿈·바꾸지 않음), 학습 결과 = **새 사례 적용 O/X 두 문항 모두**(`quiz[ep]='2/2'|'1/2'|'0/2'`, `js/quiz.js learnOf`) — 재선택만으로 이해 인정 안 함, 처음 틀려도 적용하면 인정. 수첩 편별 질문(`notePrompt`)·산출물 교사 확인란. 6편 대화·선택지·결과·개념·질문 카드·O/X·ourlog 댓글 다시 씀(내용 원본 = data/*.js). 옛 저장 `courtCount`·`'court'`·옛 퀴즈 값은 불러올 때 호환. 법령 확인·미확인 목록 `docs/superpowers/specs/2026-11-20-education-improvement.md`. ⚠️ 문구 전부 교사 검수 대기. **원격에 아직 안 올림.**
- **외부 검토 7항목 반영(2026-11-20)**: ① 제목 화면 모드 단추 = 기록 초기화 옆 글자 단추 ② 이어서 하기 = 유리 바탕+테두리(바탕이 글자색과 같던 것) ③ 선택지 다시 씀(오답에 그럴듯한 근거·정답에 대가), C = "잠깐, 확인할 게 있어.", **`hint` = C 질문 카드('~요?') / `concept` = 정답 요약(수첩·산출물·엔딩)** ④ HUD 이름표 자금/인지도/**신뢰**(화면 이름만, 키는 safety)·EP1 위젯에 뜻 한 줄, **통장 바닥**(정산 직전 💰0 → 세아 경고 + 다음 EP 정답 📈·🛡️ 절반 + 유니콘 불가, `broke`·`brokeEver`), EP3·4·5 오답 📈 감소, 리포트 인지도 한 줄 ⑤ 다시 선택하면 보낸 답장 취소선 + 시스템 줄 ⑥ 생존 엔딩 '소송'은 법정 갔을 때만, 엔딩·법정 스크롤은 상태바 아래에서·맨 위부터 ⑦ 델타 색 = 부호, 알림 배너·내레이션 카드 불투명, 팝업 ESC(단추 하나면 그 단추, 확인창은 그만두기)·Tab 가두기, 산출물 층 ESC·Tab, 장식 앱 = div aria-hidden, O/X 결과 제목 초록/주황, 반쪽 배지 첫 설명, **messages의 시스템 줄 `{sys, room}`**(EP6 코스모 담당자 나감 → 방 인원 (3)), 내레이션 단추 aria-label, 상태바 z-index 60(산출물 층 위). SPEC §6.1·6.2·6.4·6.7 개정.
- **ourlog 완성(2026-11-20)**: 가상 SNS 앱(인스타와 비슷한 배치·베끼지 않음). 수첩 적기 뒤 "ourlog SNS 앱을 확인해 보자!" 카드(`#olNotice`, [열기]/[넘어가기] — 학생이 고름) → 열면 그 편 게시물이 맨 위에 올라오고 팬 반응(좋아요 숫자·댓글·LIVE·하트)이 실시간처럼 붙음, 닫아야 정산. 갈래(정답/오답/재선택)에 따라 반응이 다르고 홈 아이콘으로 다시 열면 정지 피드. 그림 16장 webp(`assets/ourlog/`, codex). 팬 반응 글 EP2~6은 교사 검수 대기. 설계 `docs/superpowers/specs/2026-11-20-ourlog-design.md`, 계획 `docs/superpowers/plans/2026-11-20-ourlog.md`, SPEC §7·§12.6, 그림 의뢰서 `docs/codex-art-brief-ourlog.md`.

- **캐릭터 톡 다시 씀(2026-11-17)**: EP1~6 `messages` 전부 — 대표에겐 존댓말·둘끼리 반말, **세아는 온점 / 준호는 온점 없이 짧게 끊어**, 유행어·"~임/~음" 금지, 편마다 상황→유혹→의심(질문만)→결정 넘기기. SPEC §5의 "수정 금지"는 교사가 해제. 규칙은 verify [말투] 15건이 지킨다. **스토리 장면·편 소개·인트로·법정·엔딩 문구도 다시 씀**(명언풍·느낌표 없음. 인트로에 "대표 = 동아리 회장, 준호·세아 = 후배" — 존댓말의 까닭). EP2 오답 사건은 "경쟁사가 글을 보고 비슷한 제품"으로 바꿈(법 정확성). **결과 알림·개념 카드도 다시 씀**(제목은 담담하게, 비유 "~와 같아요.", 배운 것 "~다."). **선택지도 다시 씀**: 대표의 답장(결정 + 이유 두 문장), 오답·정답 자리는 편마다 섞이고(`chat.js choiceOrder`, 프로브는 `window.__rand`·`data-k`로 고름) 겉모습은 같다. 메신저 프로필은 글자 대신 **색 바탕 + 얼굴 없는 사람 모양**(`chat.js avatarTone`, `phone.css .ava[data-c]`). 설계 `docs/superpowers/specs/2026-11-17-chat-dialogue-design.md`. **글 다듬기(ROADMAP #12) 끝 — O/X 퀴즈 문장 손질·타이틀 부제·단추 문구(새로 시작/이어서 하기/뭐라고 답할까?)까지. 다음 = 교사가 해 보고 판단(선택지가 뻔하면 B안: 그럴듯한 오답 하나 더 · EP2 오답 사건 변경 승인) · O/X 12문항 검수.** 원격 main에 올림(2026-11-17, 교사 지시 — github.com/jungbucks/luna-aiip).

- **v0.6 루나폰(2026-11-17)**: 게임 전체가 폰 한 대 — 잠금화면 타이틀 → 홈 화면(위젯·장식 앱·독) 위 스토리 → **알림을 눌러야** 메신저 앱에서 채팅 → 선택(내 답장 말풍선) → 결과 알림창 → O/X → **권리 수첩에 알게 된 것 적기** → 정산. 다크/라이트 모드, 설정 앱, 산출물 "나의 권리 수첩"(인쇄·PDF·글 복사). 규칙·대사는 그대로. 설계 `docs/superpowers/specs/2026-11-17-phone-ux-design.md`, 계획 `docs/superpowers/plans/2026-11-17-phone-ux.md`. main에 합쳐 올림(2026-11-17).

- **게임 v0.5 완성**: 타이틀 → 캐릭터 선택(솔/루나) → 인트로 → EP1~6(채팅·A/B/C 선택·결과·정산) → 법정 → 엔딩 3종 + 리포트 + 이어하기. EP2~6 대사·스토리 씬·연출(스탯 카운트업·타이핑 인디케이터) 완결.
- **캐릭터 에셋 개선**: 솔·루나 각각 neutral/happy/panic/shock 4종의 512px 투명 PNG. 기존 `.idol-svg`, `data-idol`, `data-expr` DOM 계약과 표정 전환 규칙은 유지하고 `img.src`를 교체한다.
- **O/X 확인 퀴즈(2026-11-14)**: 정산 직전 O/X(틀리면 하나 더), 스탯·배지·엔딩 무관, 엔딩 '다시 볼 개념'에 둘 다 놓친 개념. 설계 `docs/superpowers/specs/2026-11-14-ox-quiz-design.md`, 계획 `docs/superpowers/plans/2026-11-14-ox-quiz.md`. 팝업 `guardMs`(퀴즈만 0.3초 버튼 잠금 — 연타가 다음 문제를 누르지 않게). 프로브용 `window.LUNA.showEnding(key)`. **문항 법적 정확성 교사 검수 대기.**
- **도감 완성**: AI 지재권 쟁점 12건(저작권4·특허2·상표3·영업비밀3), 실제 판례 + 상태 배지, 게임 엔딩에 티저 링크 1줄.
- **도감 루프 마무리(2026-11-17, f13a392 push)**: 검증자 사실 97.2(→100 예상, provider 수정 후 재검증 안 함) · 평가 기준표 `docs/review/rubric.md` v2.2(닐슨+CRAP+교육4축) 종합 63.75→93.5. 읽는 법(배지 4종 🔥🏛️🌍🧭)·나라 꼬리표·낱말 풀이(GLOSSARY)·#issue-<id> 주소로 열기·모두 펼치기·접힘선 probe. 남은 것=심각도1뿐(히어로 학생 장면·게임 EP 연결·🔗 복사·라벨 형식·"(영어)"), tsstrategy 유일 출처 Lexology 403은 교사가 브라우저로 확인.
- **도감 검증자·평가자 루프 1회차(2026-11-17)**: 보고서 `docs/review/2026-11-17-dogam-verifier.md`(사실, 상3·중6·미확인12) · `-evaluator.md`(교육가치·가독성, P1 7·P2 16 + 재채점 체크리스트). **반영함**: 사실 상 2건(oss=제9항소법원 2026-09 DMCA 청구 기각 유지 / tmname=구글 승소 아님→`ongoing`), 가독성 P1 4건(keep-all·카드 1열·폰 머리줄 2줄·훅 왼쪽 띠 제거). **남음(교사 판단)**: tmmake 쟁점 재구성(상표법엔 인간 창작 요건 없음), 사실 중 6건, 배지 범례·고지 위치·나라 표시·용어 풀이(P1 4~6, 새 기능이라 설계 먼저), 한국 사례 추가. 기준일 문구는 나머지 사실 수정을 다 반영한 뒤 갱신.
- **배포 대기**: GitHub Pages 예정. 원격 없음 → 사용자가 `luna-ip-game` public 레포 생성 후 "luna push" 지시 시 remote·push·Pages. dogam SPEC §8 개별 사실 검수는 교사 판단으로 기존 고지(법률자문 아님·기준일·상태배지·출처) 하에 배포 결정(미검수 상태).

## 구조 (전부 바닐라 ES 모듈)

```
index.html          폰 껍데기(.device > #app) + 화면 6개(scr-title/select/intro/ep/court/end) + 산출물 층 + ourlog 알림 카드(`#olNotice`, #app 직계 자식) + 팝업. scr-ep 안에 홈 화면·알림 배너·스토리 무대·앱 층 4개(메신저·권리 수첩·설정·ourlog)
css/style.css       색 토큰(다크/라이트)·글꼴·폰 껍데기·유리 면·잠금화면·선택·인트로·법정·엔딩·팝업. 본문 15px+
css/phone.css       홈 화면·앱 층(메신저·권리 수첩·설정)·적기·산출물·인쇄용 — ourlog 앱·알림 카드는 css/ourlog.css
assets/fonts/       Pretendard 서브셋 woff2 3종(400·600·800) + LICENSE.txt (외부 CDN 없음)
css/dogam.css       도감 스타일(게임 팔레트 공유)
js/engine.js        규칙 단일 원천(SPEC §6). DOM 없음, 수치 변경 금지
js/state.js         localStorage(luna_save_v1, schemaVersion 검사 + checkSave: 칸마다 타입·범위·허용값, 어긋나면 null)
js/main.js          게임 루프 오케스트레이터(규칙 계산 금지 — engine 위임)
js/ui/chat.js       채팅 로그·선택지 + esc()=토큰 치환+이스케이프 단일 통로
js/ui/popup.js      팝업·델타 / ending.js 법정·엔딩·리포트
assets/characters/  솔·루나 PNG 각 4표정(512×512, 투명 배경)
js/ui/character.js  PNG 경로·표정 전환 + T() 토큰 치환. 계약: .idol-svg, data-idol, data-expr
js/ui/theme.js      다크/라이트 모드(키 luna_theme — 게임 기록과 별개)
js/ui/phone.js      시계, 홈 상태(story/notify/idle), 앱 열기·닫기, 뒤로 가기, 장식 앱. 독 아이콘 클릭은 여기서만 건다
js/ui/settings.js   설정 앱(모드·기록 초기화)
js/ourlog-feed.js   ourlog 피드 계산(좋아요·댓글 갈래별 선택, DOM 없음, verify가 검산)
js/ui/ourlog.js     ourlog 앱 층·알림 카드·실시간 재생(initOurlog·openFeed·renderFeed·offer·openLive)
data/ourlog.js      ourlog 게시물·댓글·ART_READY
css/ourlog.css      ourlog 앱·카드 스타일
assets/ourlog/      ourlog 그림 webp 16장(sol·luna 각 8)
docs/codex-art-brief-ourlog.md  codex 그림 의뢰서
js/ui/notebook.js   권리 수첩 앱(보기·적기·고치기) + 산출물 층(인쇄·글 복사)
js/notes.js         적은 글 저장·검사·산출물 글(키 luna_notes_v1, DOM 없음, verify가 검산)
js/dogam/render.js·main.js  도감 엔진
data/episodes.js    EP1~6 시나리오(스키마 SPEC §8), 이름은 {n} 토큰
data/strings.js     인트로·브릿지·법정·엔딩·리포트·퀴즈 문구 + ui(폰 화면 문구 — 새 UI 문구는 여기에만)
data/quiz.js        O/X 확인 퀴즈 12문항(EP마다 본 문제+하나 더, 교사 검수 대기)
js/quiz.js          퀴즈 판정·기록(G.quiz)·다시 볼 개념 목록(DOM 없음, verify가 검산)
data/issues.js      도감 ISSUES 12·STATUS_META(양측 대립·상태 배지·실제 사례·출처)
test/verify.mjs     게임 검산 152건 / verify-dogam.mjs 도감 15건(미결 카드 결론 단정·사례 칸 길이 200자/문장 80자/괄호 1개 검사 포함)
test/probe.html     게임 E2E / probe-dogam.html 도감 E2E 24건(`node test/run-probe.mjs test/probe-dogam.html`, 폰·넓은 화면 배치 포함)
test/run-probe.mjs  프로브 실행기(서버 + 헤드리스 Edge + 수확) — `node test/run-probe.mjs`
test/probe-shots.html  캡처용 프로브(원하는 장면까지 자동 진행)
test/probe-guard.html  테스트 페이지 가드 검사 7건(?probe=1 없이 열면 저장을 안 건드리는지)
test/pages-files.mjs   Pages에 올라갈 파일 계산(_config.yml exclude + Jekyll 기본 규칙) — verify [배포]·run-probe --pages가 씀
_config.yml         Pages(Jekyll) 배포 범위: test·docs·CLAUDE/SPEC/ROADMAP.md 제외 → 게임·도감과 css/js/data/assets만 올라감
```

## 규칙·함정

- **데이터에 이름 하드코딩 금지** — 이름은 `{n}` 토큰, 받침 자동 조사(`{n가}{n는}{n를}{n랑}{n와}`). 치환기 `T()`=character.js, 통로=chat.js `esc()`. verify가 잡는다. 실존 인물 닮은꼴 금지(SPEC §12.5).
- **미결 사건을 확정처럼 쓰지 말 것** — dogam은 status(ongoing 논쟁 진행 중/partial 일부 판결/varies 나라마다 다름/strategy 전략 선택, 뜻은 STATUS_META.desc 하나 — 도감 '배지 읽는 법'이 그대로 보여 줌) 배지로 표시. 권리 이모지는 게임과 같게(verify가 대조). 낱말 풀이는 issues.js GLOSSARY(카드 글에 나오는 낱말만 자동 표시), verify-dogam이 단정 금칙어 차단. 사례 갱신 시 웹 재확인 후 issues.js의 realCase·status·sources·하단 기준일 함께 수정.
- **ES 모듈이라 HTTP/Pages 전용** — `<script type="module">`은 file://(더블클릭)에서 CORS로 안 뜬다(코드 버그 아님). 게임·도감 모두 서버 서빙 필요.
- engine.js는 규칙 단일 원천(수치 변경 금지). main.js는 계산 금지(engine 위임).
- 이어하기 복원 = 현재 EP 시작 지점부터(채팅 중간 저장 안 함 — 의도된 단순화). **EP에 들어설 때 `G.epStart` 사본을 저장하고 이어 하기는 그 사본에서 다시**(`js/resume.js`, 2026-11-14) — 예전엔 선택·퀴즈·정산 중 새로 고치면 점수가 두 번 들어갔다. 사본 없는 옛 저장은 예전처럼. **끝난 판(저장 단계 `end`)은 사본으로 되돌리지 않고 그 엔딩·리포트를 그대로**(`resume.resumePoint`, 2026-11-18 — 예전엔 EP6 시작으로 돌아가 마지막 배지가 사라졌다).
- **타이틀의 새로 시작·기록 초기화는 기록(게임·적은 글)이 있을 때만 확인창**(`main.js askWipe`, 기존 팝업 재사용) — 승인한 뒤에만 지운다. 처음 온 사람은 묻지 않는다. **지운 뒤 키마다 남았는지 확인**(`state.clear()`·`clearNotes()`가 true/false, `main.js wipeThen`, 보안 검토 2026-11-18 B): 하나라도 남으면 남은 기록과 [다시 지우기]를 보여 주고 새 판·새로 고침은 하지 않는다.
- **키보드만으로 끝까지**: 인트로·스토리의 "눌러서 계속"은 `<button>`(`#introNext`·`#storyNext`)이고 장면이 바뀔 때마다 초점을 받는다. 스토리가 끝나면 초점은 알림 배너로. 클릭은 카드·무대가 받으므로 keydown 처리기를 따로 달지 말 것(두 번 넘어간다). **팝업·법정이 닫히며 초점이 사라지면 되돌린다**(2026-11-20, `main.js focusLost()`): 개념 카드 → [확인] 단추, 다시 선택하기 → 남은 첫 선택지, 법정 → 법정 단추, 엔딩 → 제목(`tabindex=-1`).

- **배포는 게임·도감과 그 자산만**(보안 검토 2026-11-18 A): Pages는 Jekyll 기본 빌드(.nojekyll 없음, 배포 전 SPEC.html·test/probe-shots.html이 공개돼 있었다). 루트에 파일·폴더를 더하면 `_config.yml` exclude에 넣거나 `test/pages-files.mjs` ALLOWED에 넣는다 — verify [배포]가 막는다. `_`·`.`로 시작하는 이름은 Jekyll이 안 올린다.
- **테스트 페이지는 자동화 브라우저 + `?probe=1`에서만 저장을 만진다**(`navigator.webdriver` 검사). `run-probe.mjs`가 `--enable-automation`·`?probe=1`·새 임시 프로필을 붙인다. 저장을 만지는 테스트 페이지를 새로 만들면 같은 가드를 넣고 probe-guard에 추가.
- **새 층은 `#app`의 자손이어야 한다** — 팝업이 떠 있는 동안 `popup.js`가 `#app`의 직계 자식(팝업 제외)에 `inert`를 건다. 밖에 두면 팝업 뒤에서 눌려 점수가 두 번 들어가는 옛 결함이 돌아온다.
- **저장 키 셋은 서로 별개**: `luna_save_v1`(게임) · `luna_notes_v1`(적은 글) · `luna_theme`(모드). 기록 초기화·처음부터는 게임+글을 지우고 모드는 남긴다. 적은 글은 점수·배지·엔딩과 무관.
- **불러온 저장은 믿지 않는다**(보안 검토 2026-11-18 C): `state.load()`가 `checkSave()`로 알려진 칸만 검사해 새 객체로 옮기고 하나라도 어긋나면 null(이어 하기 숨김, 모르는 칸은 버림). 저장에 칸을 새로 더하면 `checkSave`에도 넣을 것 — 안 넣으면 그 칸이 불러올 때 사라진다. 점수는 화면에 `chat.js statsLine()/num()`(정수만 숫자, 아니면 '-'), 배지 class는 `notebook.js badgeCls()` 허용값만.
- **시스템 줄**: `messages`에 `{sys, room?}`를 넣으면 말풍선이 아니라 가운데 줄로 나오고 방 이름(인원)이 바뀐다. verify 말투 규칙은 시스템 줄을 뺀 `talk(e)`로 센다 — 첫 줄·마지막 줄에는 두지 않는다.
- **팝업 ESC**: `showPopup({esc})` — 없으면 단추가 하나일 때만 그 단추. 고르기가 필요한 팝업(오답·O/X 문제)에는 ESC가 없다.
- **학생이 적은 글은 `notebook.js`의 `escPlain()`으로** — `esc()`는 `{n}` 토큰을 아이돌 이름으로 바꿔 버린다.
- **뒤로 가기는 방문 기록 한 칸 규칙**(`phone.js`): 앱이 열릴 때만 한 칸을 채우고, 프로그램이 `history.back()`을 부르지 않는다. 팝업·적기 단계에서는 무시.
- **처음 판단 ≠ 학습 결과**: `badges`는 처음 판단 기록(운영 결과·ourlog 갈래에 씀), 학습 성취는 `quiz`(새 사례 적용) — 둘을 섞어 평가하지 말 것. 위기 점검 회의는 법적 판정이 아니다(문구에 법정·피고·집행유예·판사 금지, verify).
- **ourlog 갈래 = 배지**: 저장 칸 없이 그 편 배지(`badges[ep-1]`)로 정한다(`ourlog-feed.js`): full→정답(right)·half→재선택(half)·none→오답(wrong), null(아직 안 한 편)이면 게시물·알림 없음. 저장에 칸을 더하지 않으니 checkSave 영향 없음.
- **`phone.onceClosed(app, fn)`**: 열려 있는 앱에만 등록되고, 그 앱이 닫힐 때 한 번만 부른다. ourlog가 열려 있는 동안 정산을 미루는 데 쓴다(닫혀 있는 앱에 걸면 안 불림).
- **`ART_READY`**(`data/ourlog.js`): false면 `<img>`를 만들지 않아 그림 404 요청이 없다. 지금 true(webp 16장 있음). 그림을 빼면 false로.
- **`main.js settled`**: ourlog를 열고 닫는 길이 여럿(열기·넘어가기·ESC·뒤로 가기)이라 정산 팝업이 한 번만 뜨게 막는 표시. 새 길을 더하면 settled를 거칠 것.
- **`window.__olForceMotion`은 검사 전용**: 헤드리스가 강제하는 움직임 줄이기를 ourlog에서만 끄는 표시(test/probe.html만 씀). 게임 코드에서 켜지 말 것. 캡처 장면 `olnotice·ollive·olfeed`(probe-shots)는 움직임 줄이기라 ollive가 끝 상태로 나온다.
- **ourlog 실시간 재생 = 본문이 새 댓글을 따라 내려간다**(`ourlog.js follow`, 2026-11-20 최종 검토 I1 — 기기 틀 600px에선 첫 댓글부터 화면 밖이었다): `#olBody`만 움직이고(scrollIntoView 금지 — 기기 틀까지 움직인다) 화면 좌표 차이를 본문 배율로 나눠 앱 층 scale() 전환 중에도 맞춘다. 학생이 재생 중에 본문을 움직이면 더 따라가지 않고, 맨 아래로 오면 다시 따라간다. "눌러서 댓글 모두 보기"는 머리줄의 `<button id="olTapAll">`(LIVE 옆 — 본문이 내려가도 보임). 게시물 시간은 맨 위만 "방금", 지난 게시물은 편 이름(`ui.ourlog.epTime`).
- **흐림(`backdrop-filter`)은 배경화면 위에 떠 있고 스크롤되지 않는 면에만.** 메신저 안·수첩 목록·리포트에는 쓰지 않는다(저사양 폰, v0.3.1의 교훈).
- **아이폰 그대로 금지** — 다이내믹 아일랜드·광택 사각 아이콘 등. 지재권을 가르치는 게임이다.
- **헤드리스에서는 CSS 전환이 멈춰 있다** — 앱 층이 scale(.1)·opacity 0인 채라 배치 검사가 거짓 통과한다. `run-probe.mjs`가 "움직임 줄이기"를 강제해 끝 상태로 그린다(`--motion`으로 끔). 실제 전환 모습은 눈으로 확인.

## 검증 (수정 후 필수)

1. 게임 `node test/verify.mjs`(163건) — 미달 시 배포 금지. 도감 `node test/verify-dogam.mjs`(20건) + `node test/run-probe.mjs test/probe-dogam.html`(45건). 게임 E2E 214건.
2. E2E 프로브(구조·흐름 변경 시): **`node test/run-probe.mjs`** 한 줄(종료 코드 0 = 전부 PASS). 배포본만으로 도는지는 `--pages`(올라갈 파일만 서빙). 가드는 `node test/run-probe.mjs test/probe-guard.html`. 캡처는 `node test/run-probe.mjs test/probe-shots.html --shot=<png> --url="/__probe.html?scene=home&theme=light&w=1366&h=700" --size=1366,700`. 아래는 실행기가 대신 해 주는 옛 수동 절차(원리 참고용): **게임과 같은 오리진에서 서빙 필수** — file:// 프로브 + http iframe은 크로스오리진으로 조용히 죽는다(2026-07-15 실제 발생). 절차: `probe.html`을 루트에 복사 → Node 정적 서버(scratchpad) → `msedge --headless=new --user-data-dir=<임시> --virtual-time-budget=20000 --dump-dom http://localhost:PORT/...` → 수확 후 복사본 삭제. 채팅은 타이핑 인디케이터 때문에 메시지당 최대 2탭.

## 참고 문서

- `SPEC.md` — 규칙·수치·완료기준(v3, 완결형)
- `ROADMAP.md` — 성장 계획 10항목(잔여: #4 O/X 퀴즈, #10 배포)
- `docs/superpowers/specs/2026-07-18-ip-dogam-design.md` — 도감 설계·검증표
