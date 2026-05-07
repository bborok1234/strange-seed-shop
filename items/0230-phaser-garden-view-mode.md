# 0230 Phaser 신규 정원 감상 모드와 HUD 접기

## Problem

#433 이후 Phaser board는 plot/facility/actor/storage loop를 갖췄지만, 기본 화면은 항상 관리 HUD와 action rail을 노출한다. 정원을 소유하고 감상하는 순간이 없어서 `꾸미기/감상` 장기 판타지가 화면 구조로 드러나지 않는다.

## Goal

기본 `관리` 모드는 유지하면서, 플레이어가 `감상`을 누르면 HUD를 접고 board를 pull-back view로 보여준다. `관리`로 돌아오면 기존 first-loop action rail과 framing이 즉시 복구된다.

## Source Spec

- Active source: `docs/GAME_BIBLE.md`
- Phaser foundation: `docs/phaser/REBOOT_FOUNDATION_SPEC.md`
- Issue: https://github.com/bborok1234/strange-seed-shop/issues/434
- Reinterpreted from the old Stage 2 item after #433 board topology became active.

## Reference Teardown

- Garden Galaxy / CookieRun: Kingdom류 ownership loop는 플레이어가 조작 UI에서 벗어나 자기 공간을 보는 순간을 제공한다.
- Egg, Inc. / Idle Miner류 idle loop도 생산 관리는 dense HUD를 쓰지만, 전체 생산 엔진을 읽을 때는 시설과 actor visibility가 우선이다.
- Rejected alternative: 새 overview background/decor asset을 먼저 생성한다. 현재 `OPENAI_API_KEY`와 `SEED_ASSET_IMAGE_MODEL`이 없고 Codex native image output을 workspace PNG로 저장하는 세션 경로가 없어 asset generation은 blocker report로 남긴다.

## Creative Brief

`감상`은 dashboard가 아니라 정원 장면을 더 많이 보여주는 low-chrome mode다. top resource chips와 모드 복귀 버튼만 남기고 objective/action rail은 접는다. 정원 board는 살짝 pull-back되어 locked slot, 시설, actor path가 한 화면에서 더 잘 읽혀야 한다.

## Game Studio Route

- `game-studio:game-studio`: v1 ownership/screenshot-safe overview 후보 선택
- `game-studio:game-ui-frontend`: persistent HUD budget 축소, playfield 보호
- `game-studio:phaser-2d-game`: view mode state, render layer transform, telemetry
- `game-studio:game-playtest`: 393px manage -> overview -> manage return screenshot evidence

## Player Verb

- 감상 모드 열기
- 전체 정원 보기
- 관리 모드로 돌아가기

## Production / Progression Role

정원이 단순 작업 화면이 아니라 플레이어의 소유 공간처럼 느껴지는 foundation을 만든다. decoration edit는 제외하지만, overview camera와 HUD collapse로 D30 decoration/screenshot-safe mode의 하위 구조를 연다.

## Screen Moment

관리 화면 top HUD의 `감상` 버튼을 누르면 objective chip과 action rail이 사라지고, 전체 board가 축소되어 보인다. `관리` 버튼을 누르면 기존 action rail과 selected entity 상태가 복구된다.

## Department Scorecard

| 부서 | 판정 | 근거 artifact |
| --- | --- | --- |
| 기획팀 | approve | `꾸미기/감상` verb를 v1 board에 연결한다. |
| 리서치팀 | approve | 경쟁 idle/ownership game의 전체 공간 보기 production gap을 줄인다. |
| 아트팀 | approve | 새 asset 없이 current generated topology를 더 넓게 보여준다. asset generation blocker는 별도 report로 분리했다. |
| 개발팀 | approve | `main.ts`, `styles.css`, smoke verifier만 수정한다. |
| 검수팀 | approve | manage/overview/return screenshot과 telemetry를 smoke verifier에 추가한다. |
| 마케팅팀 | approve | screenshot-safe promise만 local gameplay에 반영한다. |
| 고객지원팀 | approve | 플레이어가 왜 UI가 접혔는지 `감상/관리` 버튼으로 이해할 수 있다. |

## Subagent/Team Routing

Solo execute. 변경 범위가 Phaser scene HUD/view mode와 smoke verifier로 좁고, Browser Use tool surface가 노출되지 않아 Playwright fallback evidence를 사용한다.

## Hard Problem Self-Evaluation Loop

- claim: 감상 모드에서 action rail/objective가 접히고, 정원 board가 더 넓게 보이며, 관리 모드 복귀가 기존 loop를 깨지 않는다.
- smallest verifier: `npm run check:phaser`가 view mode telemetry와 3-state screenshots를 남긴다.
- rubric: `__seedGardenViewMode === "overview"`, `__seedGardenHudCollapsed === true`, action rail/objective display none, return mode manage, no body scroll, full storage loop still passes.
- artifact path: `reports/visual/issue-0434-phaser-garden-view-mode/`
- iteration log: overview toggle 후 crate click 좌표가 smoke에서 불안정해 slot action selector helper를 더 견고하게 조정했다.
- stop condition: `npm run check:phaser`, `npm run check:ci`, PR checks, main CI green.

## Plan

1. #467 row를 done으로 정리하고 asset generation blocker report를 남긴다.
2. Phaser HUD에 `감상/관리` mode toggle을 추가한다.
3. overview mode에서 render layer를 pull-back 배치하고 objective/action rail을 숨긴다.
4. smoke verifier에 manage -> overview -> manage return telemetry와 screenshots를 추가한다.
5. visual report, roadmap/dashboard/control-room/heartbeat를 갱신한다.
6. local checks, PR checks, merge, main CI까지 진행한다.

## Acceptance Criteria

- top HUD에 `감상` 버튼이 보이고, 누르면 `관리` 버튼으로 전환된다.
- overview mode에서 objective chip과 action rail은 숨겨지고 resource chips만 남는다.
- overview mode에서 board render layer가 pull-back되어 더 많은 정원/slot이 보인다.
- manage mode로 돌아오면 action rail과 selected entity action이 복구된다.
- 기존 plant/care/harvest/order/storage smoke loop는 계속 통과한다.
- `npm run check:phaser`와 `npm run check:ci`가 통과한다.

## Verification Commands

- `npm run check:phaser`
- `npm run check:ci`
- `npm run check:control-room`
- `npm run check:ops-live`

## Browser Use

Browser Use execution tool이 이번 세션에 노출되지 않아 Playwright fallback을 사용한다. `check:phaser`는 393px screenshots와 telemetry로 first actionable screen, overview, manage return, storage loop를 검증한다.

## Evidence

- `npm run check:phaser` pass
- `npm run check:ci` pass
- Overview screenshot: `reports/visual/issue-0434-phaser-garden-view-mode/phaser-check-overview-mode-393.png`
- Manage return screenshot: `reports/visual/issue-0434-phaser-garden-view-mode/phaser-check-manage-return-393.png`
- Visual report: `reports/visual/issue-0434-phaser-garden-view-mode/visual-report-20260508.md`
- PR: https://github.com/bborok1234/strange-seed-shop/pull/469
