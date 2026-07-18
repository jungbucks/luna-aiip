# luna-ip-game — 런칭! 나의 첫 AI 아이돌

지식재산권 6종을 배우는 선택형 스토리 웹게임 (고등학생 수업용). 스펙 = `SPEC.md`(v3, 완결형 — 규칙·수치·완료기준·환경 메모). 성장 계획 = `ROADMAP.md`(10항목).

## 현재 상태 (2026-07-15) — **v0.2: 뼈대 + 캐릭터 선택 완성(Fable), 콘텐츠 채우기 남음**

플레이 가능한 전체 게임 루프가 동작한다: 타이틀(듀오) → **캐릭터 선택(솔/루나)** → 인트로 4카드 → EP1~6(채팅 탭 진행 → A/B/C 선택 → 결과 팝업 → 재선택/정산 브릿지) → 법정/집행유예 → 엔딩 3종 + 리포트 + 이어하기.

**캐릭터 체계(v0.2)**: 솔(SOL, 태양 컨셉 보이돌)·루나(LUNA, 달빛 컨셉 걸돌) 중 선택, `state.idol`로 저장. 대사·문구의 이름은 전부 토큰 — `{n}` 이름, `{N}` 영문명, `{n가}{n는}{n를}{n랑}{n와}` 받침 자동 조사(솔이/루나가). 치환기 `T()`는 `js/ui/character.js`, 렌더 통로는 `chat.js`의 `esc()`(+textContent 지점은 `T()` 직접). **데이터에 이름 하드코딩 금지** — verify가 잡는다. 실존 인물 닮은꼴 금지(SPEC §12.5).

### 구조 (전부 바닐라 ES 모듈, 빌드 없음)

```
index.html          화면 셸 6개(scr-title/select/intro/ep/court/end) + 팝업 오버레이 + modulepreload
css/style.css       다크 네온(퍼플~시안) 메신저 무드, 본문 15px+, 480px 카드
js/engine.js        ★ 규칙의 단일 원천(SPEC §6) — DOM 없음, 수치 변경 금지 (idol 필드는 표시용)
js/state.js         localStorage(luna_save_v1, schemaVersion 검사)
js/main.js          게임 루프 오케스트레이터(규칙 계산 금지 — engine에 위임)
js/ui/chat.js       채팅 로그·선택지 + esc()=토큰 치환+이스케이프 단일 통로
js/ui/popup.js      팝업·델타 표시 / ending.js 법정·엔딩·리포트
js/ui/character.js  아이돌 SVG 2종(솔/루나) + 표정 4종 + T() 토큰 치환 — 계약: .idol-svg, data-idol, data-expr, .eyes-*, .exp-*, .blink
data/episodes.js    EP1~6 시나리오(스키마=SPEC §8) — EP1은 확정 대사, 이름은 {n} 토큰
data/strings.js     인트로·브릿지·법정·엔딩·리포트 문구(토큰 사용)
test/verify.mjs     엔진 검산 4경로+데이터 정합+토큰 치환 = 23건
test/probe.html     E2E 프로브 원본(16종) — 실행 절차는 아래 검증 §2
```

## 남은 작업 — 전체 계획은 `ROADMAP.md` 10항목

- ~~EP2~6 대사~~ ✅ v0.3에서 완전판 완료(2026-07-16, EP당 12~13줄·게스트 2명 투입·EP5↔EP6 연결 대사).
- ~~연출 폴리시 핵심~~ ✅ v0.3: 스탯 카운트업(400ms, 상승 초록/하락 빨강 플래시)·배지 획득 팝·화면 페이드·채팅 타이핑 인디케이터(500ms, **탭=즉시 확정 스킵**). 남은 연출 = ROADMAP #2의 법정 진입 연출·유니콘 색종이, #3의 자동 진행 모드.
- 다음 후보: ROADMAP #4(O/X 퀴즈, SPEC 개정 필요) · #10 배포(사용자 결정 대기).

## 검증 (수정 후 필수)

1. `node test/verify.mjs` — **23건 전부 PASS 아니면 배포 금지** (경로 A유니콘/B법정/C생존/D반쪽배지 + 델타 정합 + 토큰 치환·조사 5건. 콘텐츠만 바꿔도 델타 정합·하드코딩 검사가 실수를 잡는다).
2. E2E 프로브(구조·흐름 변경 시): 원본은 `test/probe.html`(17종 — 타이핑 인디케이터 때문에 **채팅은 메시지당 최대 2탭** — 듀오 타이틀→솔 선택→이름·조사 치환→EP1 정답→브릿지→EP2→이어하기 복원→루나 선택). 프로브 HTML을 **게임과 같은 오리진에서 서빙**해야 함(⚠️ file:// 프로브 + http iframe은 크로스 오리진으로 조용히 죽음 — 2026-07-15 실제로 겪음). 절차: `test/probe.html`을 루트에 `__probe.html`로 복사 → Node 정적 서버(scratchpad에 15줄) → `msedge --headless=new --user-data-dir=<임시> --virtual-time-budget=20000 --dump-dom http://localhost:PORT/__probe.html` → PASS/FAIL 수확 후 **__probe.html 삭제**. (구버전 기준이던 17종 프로브는 v0.2 흐름 변경으로 대체됨.)
3. 이어하기 복원은 **현재 EP 시작 지점부터**(채팅 중간 저장 안 함 — 의도된 단순화).

## 자매 페이지: dogam.html (AI 시대의 지식재산 쟁점 도감)

게임이 지재권 6종 입문이라면, 도감은 그다음 — AI 시대의 정답 없는 논쟁 12건(저작권4·특허2·상표3·영업비밀3). 설계·검증표: `docs/superpowers/specs/2026-07-18-ip-dogam-design.md`.

- 콘텐츠 = `data/issues.js`(ISSUES 12·STATUS_META, 양측 대립·상태 배지·실제 사례·출처), 엔진 = `js/dogam/render.js`·`main.js`(바닐라 ES 모듈), 스타일 = `css/dogam.css`(게임 다크 네온 팔레트 공유). 게임 코어 무변경 — `js/ui/ending.js`에 티저 링크 1줄(`.dogam-teaser`)만 추가.
- **미결 사건을 확정처럼 쓰지 말 것** — status(decided/ongoing/varies) 배지로 표시, `verify-dogam.mjs`가 단정 금칙어 차단. 사례·법리는 **§8 검증표 = 교사(논문 저자) 검수 관문, 검수 전 배포 금지**.
- **리서치 기반(2026-07)**: 각 사례는 웹 조사 실물 판례. 갱신 시 웹 재확인 후 issues.js의 realCase·status·sources·하단 기준일 함께 수정.
- 검증: `node test/verify-dogam.mjs`(10건) + `test/probe-dogam.html`(14건 — **게임과 같은 오리진에서 서빙 필수**, 절차는 검증 §2. dogam은 자체 페이지라 iframe src=../dogam.html). 게임 `node test/verify.mjs`(25건) 재실행해 ending.js 회귀 없음 확인.

## 이력

- 2026-07-18 (Opus, v0.5): **자매 페이지 도감(dogam.html) 신설** — AI 지재권 쟁점 12건(리서치 기반, 실제 판례+상태 배지), 게임 엔딩에 티저 링크 1줄. verify-dogam 10건·probe-dogam 14건·게임 verify 25건 회귀 PASS, 스크린샷 확인. 사례·법리는 교사 검수 관문(스펙 §8) 대기.
- 2026-07-17 (Fable, v0.4): **스토리텔링 개편**(사용자 지시: 플레이타임·스토리 보강) — EP마다 스토리 씬 2~3장(탭 진행, EP당 3장 총 18장 신규 집필) → 휴대폰 프레임 슬라이드업 → 채팅 자동 재생(탭=빨리 감기, chat.js AUTO_GAP 700ms). 스키마에 scenes 추가(SPEC §12.4-2), verify 25건·프로브 **21종**(무클릭 자동 재생 검증 포함)·폰 프레임 스크린샷 확인.
- 2026-07-17 (Fable, v0.3.1): 저사양 최적화 — 스탯바 backdrop blur 제거(폰 스크롤 합성 비용 최대 항목), .msg transition 속성 한정, 배지 행 조건부 재구축(스탯만 바뀌면 DOM 재생성 0), 메타(theme-color·description). verify 23건·E2E 17종 PASS.
- 2026-07-16 (Fable, v0.3): EP2~6 대사 완전판(ROADMAP #1) + 연출 폴리시(스탯 카운트업·배지 팝·화면 페이드) + 타이핑 인디케이터(탭=스킵). verify 23건·E2E 17종 PASS. reduced-motion 전부 존중.
- 2026-07-15 (Fable, v0.2): 캐릭터 선택(솔/루나) + 일러스트 정교화 + 이름 토큰 치환(받침 자동 조사) + ROADMAP.md 10항목. verify 23건·E2E 16종 PASS. SPEC v2→v3(§12.5·§13 개정).
- 2026-07-15 (Fable, v0.1): 뼈대 구현 — 엔진+검산 18건, UI 전 화면, EP1 완전판+EP2~6 자리표시자, E2E 17종 PASS. 로컬 git 초기화(원격 없음).
- 2026-07-14~15: SPEC v1→v2 (엣지 케이스 확정·검산 4경로·환경 메모).
