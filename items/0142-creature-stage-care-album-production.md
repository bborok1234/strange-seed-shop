# 대표 생명체 stage / 돌보기 반응 / 도감 감상면 production 복구

Status: ready_for_pr
Work type: game_feature
Issue: #275
Branch: codex/0275-creature-stage-care-album-production
Owner: Codex
Created: 2026-05-03
Updated: 2026-05-03
Scope-risk: broad

## GitHub 권위 WorkUnit

- Source of truth: GitHub issue #275 `대표 생명체 stage, 돌보기 반응, 도감 감상면을 production으로 복구`
- Queue decision: #276 PR #279와 #274 PR #280은 merge/main CI 완료. 남은 GitHub queue는 #275이며 visible game/UI production WorkUnit이다.
- Local ledger rule: stash/recovery branch의 v2 Keep/Release 기록은 authority가 아니다. #275 issue body, PR, current Browser Use evidence, checks만 완료 권한을 가진다.
- 관련 recovery evidence: `reports/operations/local-studio-work-recovery-20260503.md`, #274 migration backfill report.

## Game Studio route

- Umbrella: `game-studio:game-studio`
  - Classification: 2D browser idle collection game, React DOM + Phaser playfield host.
  - Fantasy: 플레이어가 정원에서 대표 생명체를 크게 보고, 돌보면 반응과 단서를 얻고, 도감에서 추억 사진처럼 감상한다.
  - Player verbs: 보기, 돌보기, 단서 확인, 도감 감상.
- Specialist routes:
  - `game-studio:game-ui-frontend`: 첫 화면을 카드/대시보드가 아니라 game scene/stage로 읽히게 하고 playfield를 보호한다.
  - `game-studio:game-playtest`: first actionable screen, main verbs, HUD readability, playfield obstruction, screenshot evidence를 severity order로 확인한다.
  - `browser-use:browser`: Browser Use `iab`를 current session 기준으로 반드시 시도하고, screenshots를 `reports/visual/`에 저장한다.
- Not routed:
  - `sprite-pipeline`: 새 sprite/FX asset generation 없음. 기존 accepted assets만 사용한다.
  - `phaser-2d-game`: Phaser runtime boundary를 직접 바꾸지 않고 React UI/stage surface 복구가 중심이다.

## Studio Campaign Gate

- Campaign source of truth: `P0.5 Idle Core + Creative Rescue`
- Reference teardown: 현재 첫 화면은 생산/카드/하단탭 요소가 강하고 대표 생명체가 “얘 귀엽다” stage로 크게 읽히지 않는다. 경쟁작 production gap은 수집 캐릭터를 카드 텍스트보다 먼저 감정적 초점으로 보여주는 hero/stage surface가 부족하다는 점이다.
- Creative brief: 말랑잎 포리/대표 resident를 정원 중앙 stage의 감정 초점으로 키우고, `돌보기` 후 pose/FX/clue state를 world note처럼 보여준다. 도감은 작은 카드 그리드보다 큰 creature memory photo와 clue focus를 우선한다.
- Strategic Jump Check: 작은 copy/test-only 변경이 아니라 첫 화면 시각 위계, care reaction, album appreciation surface를 함께 복구해 first 5 minutes “하나만 더” 감정 loop를 직접 바꾼다.
- Title Contract: issue title은 `screen moment(첫 화면/도감) + player verb(돌보기/감상) + production role(production 복구)`를 담는다.

## Game Studio Department Signoff

- 기획팀: player value는 수확 후 생명체를 소유 카드가 아니라 “정원 resident”로 느끼고, 돌보기→단서→도감 감상으로 이어지는 첫 5분 emotional progression이다.
- 리서치팀: 경쟁작 production gap은 collectible character를 large hero/stage/memory view로 보여주는 감상면 부족. Rejected alternative: 단순 여백/copy polish는 production gap을 닫지 못한다.
- 아트팀: 새 asset generation 없음. 기존 accepted raster creature/seed assets를 큰 stage와 memory photo treatment로 재사용한다. asset/FX payoff는 `playfield state`, `sprite/FX-like care reaction`, `reward motion/clue state` 중 stage/pose/FX/clue state로 충족한다.
- 개발팀: `src/App.tsx`, `src/styles.css`, `tests/visual/p0-mobile-game-shell.spec.ts`만 후보 write scope. economy/schema/persistence migration은 건드리지 않는다.
- 검수팀: Browser Use `iab` screenshots: first stage, care reaction/clue, album appreciation. Playwright visual regression and `npm run check:ci` required.
- 마케팅팀: mock-only devlog angle은 “대표 생명체를 크게 보고 돌보는 첫 정원 경험 복구”. 실채널 action 없음.
- 고객지원팀: support risk는 “돌보기 후 무엇이 바뀌었는지 모름”, “도감이 작은 카드 그리드로만 보여 캐릭터 감상이 안 됨”, “하단 탭/카드 clipping”. Screenshot과 mobile layout invariant로 확인한다.

## Candidate issue comparison

1. Selected — #275 full production recovery: 대표 생명체 stage + care reaction + album appreciation. Axes: player verb, production role, screen moment, visual payoff, playtest evidence 모두 충족.
2. Smaller alternative — stage만 복구: 첫 화면은 개선하지만 care→clue→album loop가 끊겨 감정 progression이 약하다.
3. Big direction alternative — 전체 art direction/new asset family: asset generation/provenance gate와 scope가 커서 현재 recovery diff를 GitHub WorkUnit으로 격리/검증하는 blocker보다 뒤로 둔다.

## Plan

1. `stash@{0}`/`stash@{1}`의 `src/App.tsx`, `src/styles.css`, `tests/visual/p0-mobile-game-shell.spec.ts` diff를 현재 main과 비교한다.
2. production game code만 선택 적용한다. `campaigns/**`, `prototypes/**`, legacy v2 harness, asset prompt prep은 포함하지 않는다.
3. 첫 화면 대표 생명체 stage, 돌보기 반응/clue state, 도감 큰 감상면을 구현하거나 recovery diff에서 복구한다.
4. visual regression test를 #275 failure mode에 맞게 보강한다.
5. Browser Use `iab`로 current session screenshots를 `reports/visual/creature-stage-production-20260503.png`, `care-clue-production-20260503.png`, `album-appreciation-production-20260503.png` 또는 동등명으로 저장한다. Browser Use가 막히면 현재 세션 blocker를 기록한다.
6. `npm run check:visual`, `npm run check:ci`를 실행한다.
7. Issue #275 acceptance checkbox, PR body, GateEvent, PR checks, merge, main CI까지 진행한다.

## 수용 기준

- [x] production diff가 v3 GitHub issue/PR 범위로 묶인다.
- [x] 첫 화면에서 대표 생명체가 기존 카드 UI보다 우선 읽힌다.
- [x] 돌보기 후 pose/FX/clue state가 screenshot에서 확인된다.
- [x] 도감에서 수집 캐릭터를 큰 비주얼로 감상할 수 있다.
- [x] Browser Use `iab` evidence가 현재 세션 기준으로 갱신된다. 현재 세션 blocker와 Playwright fallback evidence로 갱신.
- [x] focused visual regression과 `npm run check:ci`가 통과한다. (`npm run check:visual` 52 passed, `npm run check:ci` passed)

## 검증 명령 / QA plan

- Browser Use `iab` current session screenshots and severity findings
- `npm run check:visual`
- `npm run check:ci`
- 필요 시 focused: `npm run check:visual -- --grep "대표 생명체|도감|돌보기"`

## Subagent/Team Routing decision

- 사용: Codex native `explorer` 1개가 stash production diff와 selector/QA URL/test scope를 read-only 매핑한다.
- 미사용: worker 병렬 구현은 `src/App.tsx`/`src/styles.css` write scope 충돌 위험이 크므로 leader가 통합한다.

## 안전 범위 / 비범위

- 새 asset generation/manifest 등록 없음.
- economy/schema migration 없음.
- v2 campaign ledger authority merge 없음.
- payment/login/ads/customer data/external deploy/real GTM 없음.
- `stash@{0}` drop, reset --hard, clean -fd 금지.

## 리스크

- Recovery diff가 1,200줄 규모라 current main과 충돌할 수 있다. 필요한 production slice만 적용하고, 기능이 커지면 stage/care와 album 분리 follow-up을 남긴다.
- Browser Use `iab` 도구 노출이 막히면 skill 지침대로 Node REPL `js` discovery를 시도하고 blocker를 현재 세션 evidence로 기록한다.
- UI/visual 작업은 DOM text/assertion만으로 통과하지 않는다. Screenshot에서 stage/care/album이 실제로 읽혀야 한다.

## Evidence

- 2026-05-03: #276 PR #279, #274 PR #280 merge 및 main CI 통과 후 #275 plan-first 시작.
- 2026-05-03: `stash@{0}`/`stash@{1}`의 #275 대상 3개 파일 diff가 동일함을 explorer가 확인. production slice만 적용했고 local campaign/prototype/legacy harness는 제외.
- 2026-05-03: Browser Use current-session blocker 기록: `reports/visual/browser-use-blocker-0275-20260503.md`. Node REPL `js` tool 미노출로 `setupAtlasRuntime({ backend: "iab" })` 호출 surface에 도달하지 못함.
- 2026-05-03: Playwright fallback screenshot/metrics/playtest evidence:
  - `reports/visual/creature-stage-production-20260503.png`
  - `reports/visual/care-clue-production-20260503.png`
  - `reports/visual/album-appreciation-production-20260503.png`
  - `reports/visual/album-clue-focus-production-20260503.png`
  - `reports/visual/0275-production-visual-metrics-20260503.json`
  - `reports/visual/0275-production-playtest-20260503.md`
- 2026-05-03: focused visual regression 통과:
  - `npm run check:visual -- --grep "creature stage|도감은 보상표"` → 2 passed
  - `npm run check:visual -- --grep "복귀 후 온실 선반|온실 선반 정리|온실 확장 준비|온실 동선|온실 물길|온실 물안개|연구 단서는|creature stage|달빛 보호 주문"` → 12 passed after order/stage scope repair
- 2026-05-03: 전체 visual regression 통과: `npm run check:visual` → 52 passed (4.6m).
- 2026-05-03: 전체 CI gate 통과: `npm run check:ci`.

## Follow-up note

- #275 stage는 기존 연구/온실 progression surface를 압박하지 않도록 달빛 resident 발견 상태에서만 켠다. 일반 연구/온실 QA 화면은 기존 action surface를 유지한다.
- 온실 chain과 달빛 주문이 동시에 가능한 QA 상태에서는 온실 chain 완료/다음 주문을 먼저 유지하고, `qaLunarOrderReady=1` 같은 달빛 전용 순간에서 달빛 보호 주문을 노출한다.
