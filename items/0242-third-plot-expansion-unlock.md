# 0242 Third plot expansion unlock

## Problem

#432 closes the first production chain with order crate delivery, and the objective now points at `3번 밭 확장 준비`. The board already shows a preview third plot, but the player cannot spend the delivery reward to unlock it. v1 needs that next growth verb so delivery reward turns into visible garden expansion.

## Goal

Turn the order crate delivery reward into a third plot unlock action, visible plot state change, and deterministic Phaser smoke evidence.

## Game Studio Route

- `game-studio:game-studio`: delivery reward 이후 production/progression WorkUnit 선택
- `game-studio:phaser-2d-game`: plot unlock state, action branch, smoke path
- `game-studio:game-ui-frontend`: action rail affordance for expansion cost/result
- `game-studio:game-playtest`: delivery -> expand plot screenshot evidence

## Reference Teardown

- Idle/tycoon references usually convert the first completed order into an immediate capacity/station expansion.
- Current Phaser v1 loop gives enough leaves after delivery but leaves the third plot as a passive preview.
- Rejected alternative: add repeat order first. Reason: repeat orders are less meaningful until the board has a visible new capacity unlock.

## Creative Brief

The third plot should shift from preview to playable board space. The affordance should say cost and result clearly, then the board should show an empty usable plot instead of a locked preview.

## Department Scorecard

| 부서 | 판정 | 근거 artifact |
| --- | --- | --- |
| 기획팀 | approve | Player verb becomes `3번 밭 확장`, converting delivery reward into progression. |
| 리서치팀 | approve | Idle production games turn first contract rewards into station/capacity expansion. |
| 아트팀 | approve | Uses existing generated plot empty/locked raster states; payoff is playfield state transition, not new asset acceptance. |
| 개발팀 | approve | Adds one plot unlock transition and smoke branch; no persistence migration. |
| 검수팀 | approve | `check:phaser` will verify delivery reward, expansion action, unlocked third plot, screenshot evidence. |
| 마케팅팀 | approve | No real channel/payment; in-game promise only. |
| 고객지원팀 | approve | The reward answer is visible: a new plot opens for more planting. |

## Role Debate

N/A. No department is `revise` or `block`.

## Subagent/Team Routing

Solo execute. The state/action/render/test files are tightly coupled and small.

## Self-Evaluation Loop

Claim: after first order delivery, the player can spend leaves to unlock the third plot without breaking the existing plant/care/harvest/workbench/delivery flow.

Smallest verifier:

- delivery leaves are sufficient for expansion
- selecting `plot_03` exposes expansion action with cost/result
- expansion deducts leaves and changes slot unlock state to `unlocked`
- third plot has an empty plot entity and can become a future planting target
- `npm run check:phaser`

Stop condition: local `check:phaser` and `check:ci` pass, PR checks pass, merge/main CI observed.

## Plan

1. GitHub issue를 생성한다.
2. Board slot unlock state를 runtime state로 mutable하게 만든다.
3. `unlockThirdPlot` transition과 action rail affordance를 추가한다.
4. `check-phaser-foundation`에 delivery -> expand third plot branch를 추가한다.
5. visual report, roadmap, control room, heartbeat를 갱신하고 PR로 검증한다.

## Acceptance Criteria

- First order delivery reward can unlock the third plot.
- Third plot changes from preview/locked visual language to empty usable plot state.
- Leaves are deducted with clear receipt/objective.
- Runtime image generation remains disabled and only existing generated raster plot states are used.
- `npm run check:phaser` and `npm run check:ci` pass.

## Verification Commands

- `npm run check:phaser`
- `npm run check:ci`

## Browser Use

Browser Use `iab`가 노출되면 delivery -> third plot expansion을 직접 확인한다. 노출되지 않으면 현재 세션 blocker와 Playwright fallback screenshot evidence를 남긴다.

## GitHub

- Issue: https://github.com/bborok1234/strange-seed-shop/issues/451
- Draft PR: pending

## Evidence

- pending
