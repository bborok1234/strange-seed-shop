# 0244 Repeat order after third plot harvest

## Problem

#453 lets the player plant `3번 햇살 밭`, but the next loop still has weak repeat-order language. A later harvest can reuse the first-harvest receipt, and the second delivery still sounds like the first order. v1 needs the newly expanded plot to feed a repeat order chain, not only another isolated plant state.

## Goal

After planting and harvesting `plot_03`, the player can refill the order crate and claim a second delivery with repeat-order copy, reward state, and screenshot evidence.

## Reference Teardown

- Egg, Inc. / Idle Miner style idle loops make extra capacity immediately increase repeat production pressure.
- AdVenture Capitalist style repeat claims keep the same verb but update the reward/result language so the player sees compounding progress.
- Rejected alternative: introduce a full storage upgrade now. Storage is the next likely blocker, but without a dedicated storage raster asset in the current Phaser runtime bundle it would either reuse the crate visual too heavily or expand scope into asset generation.

## Creative Brief

`3번 햇살 밭` should feel like a productive new tile. The player plants it, grows it, harvests it, then sees the order crate fill and dispatch again. The smallest v1 payoff is a visible second order delivery, with repeat-order receipts and `completedDeliveries: 2`.

## Game Studio Route

- `game-studio:game-studio`: next v1 vertical-slice WorkUnit selection
- `game-studio:phaser-2d-game`: repeat harvest/delivery state and smoke path
- `game-studio:game-ui-frontend`: action rail copy and receipt affordance
- `game-studio:game-playtest`: plot_03 harvest -> second crate delivery screenshot evidence

## Game Studio Department Signoff

- 기획팀: player verb is `3번 밭 수확 -> 두 번째 주문 납품`; production role is repeat loop proof.
- 리서치팀: competitive gap is idle repeat claims showing compounding output after capacity growth.
- 아트팀: no new accepted asset; uses existing generated plot/order crate/leaf FX raster states.
- 개발팀: mutate existing Phaser state and verifier only; no persistence migration.
- 검수팀: `check:phaser` must assert completedDeliveries `2`, repeat receipt, and screenshots.
- 마케팅팀: no real channel/payment promise.
- 고객지원팀: reduces confusion where a second harvest still reads like first Pori discovery.

## Department Scorecard

| 부서 | 판정 | 근거 artifact |
| --- | --- | --- |
| 기획팀 | approve | Repeat order closes the loop after expansion. |
| 리서치팀 | approve | Capacity upgrades should visibly increase repeated production/delivery. |
| 아트팀 | approve | Existing generated order crate state and harvest FX are enough for this slice. |
| 개발팀 | approve | Narrow changes in `gameState.ts`, `main.ts`, verifier. |
| 검수팀 | approve | Smoke path extends from #453 to second delivery. |
| 마케팅팀 | approve | Mock/local game loop only. |
| 고객지원팀 | approve | Copy distinguishes first discovery from repeat harvest. |

## Subagent/Team Routing

Solo execute. The task is a narrow continuation in the same Phaser state machine and verifier; subagents would add coordination overhead without independent evidence.

## QA / Playtest Plan

1. Run `npm run check:phaser`.
2. Verify screenshots under `reports/visual/issue-0455-repeat-order-after-third-plot-harvest/`.
3. Run `npm run check:ci`.
4. Record Browser Use blocker if `iab` is still unavailable.

## Plan

1. Create GitHub issue and branch evidence.
2. Fix repeat harvest receipt/objective for non-first harvest.
3. Fix second delivery receipt/objective after completedDeliveries > 1.
4. Extend Phaser smoke path through plot_03 care/harvest, crate refill, second delivery.
5. Update visual report, roadmap, dashboard, control room, heartbeat, issue comment, and PR.

## Acceptance Criteria

- `plot_03` can be cared to ready and harvested after #453 flow.
- Repeat harvest no longer says `말랑잎 포리 합류` when Pori already exists.
- Second delivery increments `completedDeliveries` to `2` and uses repeat-order receipt/objective.
- Screenshot evidence shows second delivery state.
- Runtime image generation/API/cache remains disabled.
- `npm run check:phaser` and `npm run check:ci` pass.

## Verification Commands

- `npm run check:phaser`
- `npm run check:ci`

## Browser Use

Browser Use `iab`가 노출되면 plot_03 harvest -> second delivery를 직접 확인한다. 노출되지 않으면 현재 세션 blocker와 Playwright fallback screenshot evidence를 남긴다.

## GitHub

- Issue: https://github.com/bborok1234/strange-seed-shop/issues/455
- Draft PR: https://github.com/bborok1234/strange-seed-shop/pull/456

## Evidence

- `npm run check:phaser` pass
- `npm run check:ci` pass
- `reports/visual/issue-0455-repeat-order-after-third-plot-harvest/phaser-check-third-plot-ready-393.png`
- `reports/visual/issue-0455-repeat-order-after-third-plot-harvest/phaser-check-third-plot-harvested-393.png`
- `reports/visual/issue-0455-repeat-order-after-third-plot-harvest/phaser-check-second-delivery-393.png`
- `reports/visual/issue-0455-repeat-order-after-third-plot-harvest/visual-report-20260508.md`
