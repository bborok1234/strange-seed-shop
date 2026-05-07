# 0235 Garden board topology scaffold

## Problem

`apps/seed-garden-phaser/`는 아직 빌드 가능한 placeholder에 가깝다. `docs/GAME_BIBLE.md`와 `docs/GAME_PRODUCTION_SPEC.md`가 v1 방향을 새로 고정했지만, 실제 runtime은 아직 world topology, plot/facility entity, actor task, HUD/action rail을 증명하지 못한다.

기존 GitHub Issue #433은 리부트 전 `낮은 관리 카메라` 문맥으로 열려 있고, Issue #434/#432는 그 이후 단계다. 따라서 #433을 `garden board foundation`으로 재해석해 v1 구현의 첫 runtime blocker를 제거한다.

## Goal

신규 Phaser active lane에서 첫 5분 v1의 가장 작은 playable foundation을 만든다.

- 시작 화면에 최소 3개 build slot을 표시한다.
- plot/facility/order/storage가 배경이 아니라 runtime entity로 보인다.
- 무료 starter seed를 심고, 돌보고, 수확해 첫 actor가 world에 합류한다.
- actor task path와 contextual DOM HUD/action rail이 동작한다.
- 세 번째 plot unlock preview가 다음 성장 목표로 읽힌다.

## Game Studio Route

- `game-studio:game-studio`: v1 구현 issue 선택
- `game-studio:web-game-foundations`: topology, simulation/render/input/save boundary
- `game-studio:game-ui-frontend`: persistent HUD budget, contextual action rail
- `game-studio:phaser-2d-game`: scene/entity/task path implementation
- `game-studio:sprite-pipeline`: 이번 slice는 raster/sprite 제작 전 topology placeholder만 사용
- `game-studio:game-playtest`: Browser Use 또는 blocker + Playwright/build evidence

## Department Scorecard

| 부서 | 판정 | 근거 artifact |
| --- | --- | --- |
| 기획팀 | approve | Player verbs: slot 선택, 심기, 돌보기, 수확, actor 합류, unlock preview. First 5m moment는 첫 생명체가 world actor로 합류하는 장면이다. |
| 리서치팀 | approve | `docs/NORTH_STAR.md`와 `docs/GAME_BIBLE.md`의 production bar: 생산 엔진, build slot, actor task, 다음 해금 목표를 우선한다. 기존 #434 감상 모드는 Stage 1 이후로 보류한다. |
| 아트팀 | revise | 새 raster asset은 아직 만들지 않는다. 이번 slice는 manifest에 등록되지 않는 runtime placeholder로 topology를 고정하고, 다음 asset WorkUnit에서 gpt-image-2/Codex native raster bundle을 만든다. |
| 개발팀 | approve | Simulation state는 Phaser Scene 밖의 typed state로 두고, Scene은 render/input만 담당한다. Rollback boundary는 `apps/seed-garden-phaser/src/*`와 이 item/issue body다. |
| 검수팀 | approve | `npm run build:phaser`, `npm run check:phaser`, 가능하면 Browser Use/Playwright screenshot으로 fresh-start -> plant -> care -> harvest 경로를 확인한다. |
| 마케팅팀 | approve | 외부 채널/실결제/광고 없음. 플레이어 약속은 “신규 Phaser v1 foundation” 내부 증거로만 제한한다. |
| 고객지원팀 | approve | 시작 행동은 빈 plot과 `심기` action rail로 드러나야 하며, 세 번째 slot preview가 다음 목표를 설명한다. |

## Self-Evaluation Loop

Claim: `apps/seed-garden-phaser`가 더 이상 placeholder가 아니라 v1 garden board foundation의 첫 playable proof다.

Smallest verifier:

- `npm run build:phaser`
- `npm run check:phaser`
- fresh start 화면에서 `plot_01`, `plot_02`, `plot_03 locked preview`, `facility_workbench`, `facility_order_crate`가 runtime entity로 렌더된다.

Rubric:

| 항목 | 통과 기준 |
| --- | --- |
| topology | 최소 3개 build slot과 facility anchors가 data-driven으로 렌더된다 |
| player verb | 심기/돌보기/수확 중 최소 3개 action이 실제 state를 바꾼다 |
| actor task | 수확 후 첫 actor가 world에 생기고 task path 또는 work state가 보인다 |
| HUD budget | top resource, objective chip, bottom action rail이 playfield를 가리지 않는다 |
| v1 continuation | 다음 WorkUnit이 asset bundle 또는 first 5m vertical slice로 분해된다 |

Artifact path:

- `apps/seed-garden-phaser/src/main.ts`
- `apps/seed-garden-phaser/src/styles.css`
- `reports/visual/issue-0433-garden-board-foundation/`

Iteration log:

- Iteration 1: topology/runtime scaffold 구현 및 build 검증
- Iteration 2: Browser/visual evidence 또는 blocker 기록

Stop condition:

- #433 foundation이 build/check/visual evidence를 갖고 draft PR 또는 다음 checkpoint로 이동하거나, Browser Use/tool outage blocker가 report로 남을 때.

## Plan

1. #433 GitHub issue body를 리부트된 `garden board foundation` 기준으로 갱신한다.
2. `apps/seed-garden-phaser` README source-of-truth를 `GAME_BIBLE`/`GAME_PRODUCTION_SPEC`/`REBOOT_FOUNDATION_SPEC`로 갱신한다.
3. Phaser runtime에 typed topology, plot/facility/actor/task state, contextual action rail을 구현한다.
4. `npm run build:phaser`와 `npm run check:phaser`를 실행한다.
5. 가능하면 Browser Use 또는 Playwright screenshot evidence를 남긴다.
6. Roadmap/control room/heartbeat를 현 WorkUnit으로 갱신한다.

## Acceptance Criteria

- `apps/seed-garden-phaser` 첫 화면이 placeholder text가 아니라 garden board runtime으로 보인다.
- 시작 상태에서 최소 3개 build slot이 보이고, 1개는 locked preview다.
- `심기`, `돌보기`, `수확` action이 state와 화면을 바꾼다.
- 첫 수확 후 `말랑잎 포리` actor가 world에 나타나고 task 상태가 HUD 또는 scene에 보인다.
- workbench/order/storage는 배경이 아니라 runtime facility/preview entity로 표시된다.
- `npm run build:phaser`와 `npm run check:phaser`가 통과한다.

## Verification Commands

- `npm run build:phaser`
- `npm run check:phaser`
- `npm run check:ci`

## Browser Use

Visible gameplay work이므로 Browser Use `iab` 우선이다. Browser Use가 tool/runtime 문제로 막히면 blocker report를 `reports/visual/issue-0433-garden-board-foundation/`에 남기고 Playwright 또는 build evidence를 fallback으로 기록한다.

## GitHub

- Issue: https://github.com/bborok1234/strange-seed-shop/issues/433
- Draft PR: https://github.com/bborok1234/strange-seed-shop/pull/439
- Rebooted body: `reports/operations/github-bodies/issue-0433-garden-board-foundation-20260508.md`

## Evidence

- `npm run build:phaser` — pass
- `npm run check:phaser` — pass
- `npm run check:ci` — pass
- Issue checkpoint comment: https://github.com/bborok1234/strange-seed-shop/issues/433#issuecomment-4398763856
- Draft PR: https://github.com/bborok1234/strange-seed-shop/pull/439
