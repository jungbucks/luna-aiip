# luna-ip-game — 런칭! 나의 첫 AI 아이돌

지식재산권 6종을 배우는 선택형 스토리 웹게임 (고등학생 수업용). 스펙 = `SPEC.md`(v2, 완결형 — 규칙·수치·완료기준·환경 메모).

## 현재 상태 (2026-07-15) — **뼈대 완성(Fable), 콘텐츠 채우기 남음**

플레이 가능한 전체 게임 루프가 동작한다: 타이틀 → 인트로 4카드 → EP1~6(채팅 탭 진행 → A/B/C 선택 → 결과 팝업 → 재선택/정산 브릿지) → 법정/집행유예 → 엔딩 3종 + 리포트 + 이어하기.

### 구조 (전부 바닐라 ES 모듈, 빌드 없음)

```
index.html          화면 셸 5개(scr-*) + 팝업 오버레이 + modulepreload
css/style.css       다크 네온(퍼플~시안) 메신저 무드, 본문 15px+, 480px 카드
js/engine.js        ★ 규칙의 단일 원천(SPEC §6) — DOM 없음, 수치 변경 금지
js/state.js         localStorage(luna_save_v1, schemaVersion 검사)
js/main.js          게임 루프 오케스트레이터(규칙 계산 금지 — engine에 위임)
js/ui/chat.js       채팅 로그·선택지 / popup.js 팝업·델타 표시 / ending.js 법정·엔딩·리포트
js/ui/character.js  루나 SVG + 표정 4종(data-expr 토글) — id/클래스 계약 유지
data/episodes.js    EP1~6 시나리오(스키마=SPEC §8) — EP1은 확정 대사
data/strings.js     인트로·브릿지·법정·엔딩·리포트 문구
test/verify.mjs     엔진 검산 4경로+데이터 정합 = 18건
```

## 남은 작업 (하위 모델 위임)

1. **[Opus] EP2~6 대사 작문** — `data/episodes.js`의 `messages`만 교체(현재 4줄 자리표시자, `TODO(Opus)` 주석). SPEC §9 가이드: EP1 톤, 12~20줄, 구체적 숫자, 마지막은 "대표님 콜?"류 긴장 고조. **choices/delta/popup은 확정 — 건드리지 말 것.**
2. **[Opus] 루나 SVG 일러스트 정교화** — `js/ui/character.js`. 현재는 기능하는 기본형. `data-expr`·`.exp-*`·`.blink`·`.luna-svg` 계약 유지(CSS·main.js가 의존).
3. **[Opus] 연출 폴리시** — 스탯 변화 애니메이션(현재 즉시 갱신), 법정·엔딩 화면 연출 강화, 배지 획득 이펙트.
4. **[Sonnet] 문구 다듬기** — `data/strings.js`(의미·규칙 변경 금지).
5. 배포(사용자 결정 대기): GitHub Pages 직배포 전제(온라인 다파일). 배포 후 정글 앱스토어 등록 후보.

## 검증 (수정 후 필수)

1. `node test/verify.mjs` — **18건 전부 PASS 아니면 배포 금지** (경로 A유니콘/B법정/C생존/D반쪽배지 + 델타 정합. 콘텐츠만 바꿔도 델타 정합 검사가 실수를 잡는다).
2. E2E 프로브(구조·흐름 변경 시): 프로브 HTML을 **게임과 같은 오리진에서 서빙**해야 함(⚠️ file:// 프로브 + http iframe은 크로스 오리진으로 조용히 죽음 — 2026-07-15 실제로 겪음). 절차: 프로브를 루트에 `__probe.html`로 복사 → Node 정적 서버(scratchpad에 15줄) → `msedge --headless=new --user-data-dir=<임시> --dump-dom http://localhost:PORT/__probe.html` → 수확 후 **__probe.html 삭제**. 기준: 2026-07-15 17종(타이틀→C힌트→A오답→재선택 trunc 35/22/58→B반쪽→브릿지 30/42/73→EP2~6 완주→생존 엔딩→리포트→저장).
3. 이어하기 복원은 **현재 EP 시작 지점부터**(채팅 중간 저장 안 함 — 의도된 단순화).

## 이력

- 2026-07-15 (Fable): 뼈대 구현 — 엔진+검산 18건, UI 전 화면, EP1 완전판+EP2~6 자리표시자, E2E 17종 PASS. 로컬 git 초기화(원격 없음).
- 2026-07-14~15: SPEC v1→v2 (엣지 케이스 확정·검산 4경로·환경 메모).
