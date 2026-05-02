# #284 정원 첫 화면을 생산 엔진 중심으로 재배치해 수확·납품을 한 장면에 묶는다

- 상태: `planned`
- GitHub issue: #284 `정원 첫 화면을 생산 엔진 중심으로 재배치해 수확·납품을 한 장면에 묶는다`
- Branch: `codex/0284-first-screen-production-engine-layout`
- Game Studio route: `game-studio:game-studio` → `game-studio:game-ui-frontend`, `game-studio:game-playtest`, `browser-use:browser`
- WorkUnit authority: GitHub issue/PR/GateEvent. local campaign ledger, stash, `.omx` state는 권한이 아니라 evidence/cache로만 사용한다.

## Studio Campaign Gate

GitHub open queue가 비어 있어 P0.5 Production Bar 기준으로 새 Intake WorkUnit #284를 생성했다. #275/#282는 달빛 resident attachment와 돌보기 memory reward를 복구했지만, 첫 화면이 아직 “생산 엔진”보다 카드/패널 stack으로 읽히는 gap이 남아 있다.

## 후보 비교

1. **선택 / 큰 방향 점프: 정원 첫 화면 production engine layout 재배치**
   - `player verb`: 수확/생산 수령/주문 납품/돌보기.
   - `production/progression role`: 자동 생산, 주문/납품, 다음 성장 선택을 한 screen moment로 묶는다.
   - `screen moment`: 첫 수확 이후와 달방울 누누 발견 후 정원 첫 화면, 복귀 후 30초.
   - `asset/FX/game-feel`: playfield state, compact HUD affordance, order crate visual state, reward/progress motion 위치 정리.
   - `playtest evidence`: Browser Use `iab` 우선, blocker 시 current-session blocker와 Playwright screenshot/metrics.
2. **asset/FX 후보: 달방울 누누 idle/care sprite strip 제작**
   - 보류: 신규 game graphics asset은 gpt-image-2/Codex native generation provenance와 review/manifest까지 필요하다. 현재 더 큰 blocker는 이미 있는 actor/production UI가 하나의 engine scene으로 읽히지 않는 점이다.
3. **작은 연결 후보: 도감 기억 도장에서 다음 씨앗/원정 CTA로 이동**
   - 보류: 직전 issue 인접 기능이며, Production Bar의 핵심인 first-screen production readability를 크게 바꾸지 못한다.

## Strategic Jump Check

이번 WorkUnit은 작은 후속 기능이 아니라 큰 방향 점프를 선택한다. `docs/NORTH_STAR.md`와 `docs/IDLE_CORE_CREATIVE_GUIDE.md`는 첫 화면에서 생명체 actor, 자원 흐름, 주문 crate/progress, upgrade/next goal이 생산 엔진으로 읽혀야 한다고 요구한다. #282 이후 attachment는 좋아졌지만, 첫 화면을 “귀여운 카드 UI”에서 “idle production tycoon scene”으로 끌어올리는 화면 재배치가 다음 blocker다.

## Reference teardown

- Egg, Inc./Idle Miner 계열은 worker/transport/resource/progress CTA가 한 화면에서 동시에 읽힌다.
- 현재 구현은 `GardenPlayfieldHost`의 `.playfield-production-lane`/`.playfield-order-crate`와 `App.tsx`의 `.production-action-card`가 따로 읽히며, 모바일에서 카드 설명이 visual hierarchy를 많이 차지한다.
- 목표는 새 시스템 추가가 아니라 기존 생산/주문/돌보기 surfaces를 한 scene의 edge HUD로 압축하는 것이다.

## Creative brief

- 첫 화면 인상: “누누가 stage에 있고, 옆에서 자원이 쌓이고, 주문 상자가 채워지는 온실”이어야 한다.
- UI 언어: persistent card stack을 줄이고 playfield-adjacent tray/compact HUD를 우선한다.
- Motion tone: 새 asset 없이 progress, crate glow, reward pulse 위치를 정리한다.

## Game Studio Department Signoff

- 기획팀: player verbs는 `돌보기`, `생산 잎 수령`, `주문 납품`; progression role은 생산 엔진/주문/다음 성장 선택이다.
- 리서치팀: 경쟁작 production gap은 worker-resource-crate가 한 장면으로 읽히지 않는 점이다. 신규 sprite strip은 후속으로 보류한다.
- 아트팀: 신규 accepted manifest asset 없음. 기존 playfield actor/order crate/FX와 CSS 상태를 재배치한다.
- 개발팀: `src/App.tsx`, `src/styles.css`, 필요 시 playfield view-model/test만 수정한다. save/economy 수치 변경은 비범위다.
- 검수팀: Browser Use `iab` 우선. 막히면 #284 current-session blocker와 Playwright screenshot/metrics를 남긴다.
- 마케팅팀: mock-only player-facing promise다. 실채널/광고/결제 없음.
- 고객지원팀: 첫 화면에서 “무엇을 눌러야 하는지”가 더 명확해져야 하며, CTA가 하단 탭에 가리면 실패다.

## Subagent/Team Routing

- Explorer subagent가 3개 후보를 read-only로 비교했고, 1번 big strategic jump 후보를 다음 WorkUnit으로 추천했다.
- 구현은 layout/CSS/visual regression이 강하게 결합되어 본 agent가 직접 수행한다. QA는 Browser Use 또는 fallback screenshot evidence로 검증한다.
- team mode는 write scope가 `src/App.tsx`/`src/styles.css`에 집중되어 conflict 위험이 높아 사용하지 않는다.

## Plan

1. 현재 달빛 resident/production/order 화면의 first-screen metrics를 확인한다.
2. 모바일 `has-creature-stage` + production 상태에서 action surface를 compact engine tray처럼 재배치한다.
3. order crate/progress visual hierarchy가 카드 설명보다 먼저 보이도록 CSS/DOM 순서를 조정한다.
4. `돌보기`, `생산 잎 수령`, `주문 납품` CTA가 bottom tab 위에 남는지 visual regression을 추가한다.
5. Browser Use `iab` QA를 시도하고 blocker/fallback evidence를 남긴다.
6. `npm run check:visual`, `npm run check:ci`, GitHub PR/checks/merge/main CI까지 완료한다.

## 수용 기준

- [ ] 달방울 누누 발견 상태의 393x852 첫 정원 화면에서 stage, playfield, 자동 생산/주문 progress가 하나의 game scene으로 읽힌다.
- [ ] `돌보기`, `생산 잎 수령`, `주문 납품` 중 가능한 primary verbs가 viewport 안에서 하단 탭에 가리지 않는다.
- [ ] action surface가 body scroll 없이 bottom tab 위에 머물고, visible child overflow가 없다.
- [ ] order crate/progress visual state가 카드 본문보다 먼저 보인다.
- [ ] 신규 accepted manifest asset 없이 구현하고 runtime image generation을 추가하지 않는다.
- [ ] Browser Use `iab` current-session evidence 또는 blocker + Playwright fallback screenshot을 남긴다.
- [ ] focused visual regression과 `npm run check:ci`가 통과한다.

## 검증 명령

- Browser Use `iab` visual/playtest
- `npm run check:visual -- --grep "생산 엔진|한 장면|production engine"`
- `npm run check:visual`
- `npm run check:ci`

## 리스크와 롤백

- 큰 layout change라 기존 greenhouse/lunar visual regression을 깨뜨릴 수 있다.
- persistent HUD를 늘리면 playfield를 가릴 수 있으므로 edge/compact tray로 제한한다.
- 롤백은 #283 main 상태로 CSS/DOM 재배치 diff를 되돌리는 것이다.
