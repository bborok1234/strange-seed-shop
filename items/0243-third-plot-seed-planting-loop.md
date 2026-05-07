# 0243 Third plot seed planting loop

## Problem

#451 opens `3번 햇살 밭`, but the player has `씨앗 0` after the scripted first-loop path. The new plot is visible capacity, yet it cannot be used immediately. v1 needs the expansion payoff to lead into another planting decision.

## Goal

After third plot expansion, grant or surface the next seed planting path so `plot_03` can receive a new seed in the same first-session chain.

## Game Studio Route

- `game-studio:game-studio`: expansion payoff 이후 next planting WorkUnit 선택
- `game-studio:phaser-2d-game`: seed inventory reward/action state, plot_03 planting branch, smoke path
- `game-studio:game-ui-frontend`: action rail affordance for new seed/result
- `game-studio:game-playtest`: expansion -> plant plot_03 screenshot evidence

## Department Scorecard

| 부서 | 판정 | 근거 artifact |
| --- | --- | --- |
| 기획팀 | approve | Player verb becomes `새 밭에 씨앗 심기`, extending the one-more loop. |
| 리서치팀 | approve | Idle/collection games make capacity expansion immediately usable with the next unit/seed. |
| 아트팀 | approve | Uses existing generated plot sprout/growing raster states; no new accepted asset. |
| 개발팀 | approve | Adds seed reward/action branch and smoke evidence; no persistence migration. |
| 검수팀 | approve | `check:phaser` will verify plot_03 unlock then planting state/screenshot. |
| 마케팅팀 | approve | No external channel/payment. |
| 고객지원팀 | approve | Player confusion drops because the new plot has an immediate next action. |

## Plan

1. GitHub issue를 생성한다.
2. Third plot unlock or delivery chain grants/surfaces the next seed.
3. `plantStarterSeed` can plant into `plot_03` after expansion.
4. `check-phaser-foundation` verifies expansion -> plot_03 planting.
5. visual report, roadmap, control room, heartbeat를 갱신하고 PR로 검증한다.

## Acceptance Criteria

- After third plot expansion, the player has a seed or clear seed action.
- `plot_03` can be selected and planted.
- Screenshot evidence shows `3번 햇살 밭` in planted/sprout state.
- Runtime image generation remains disabled.
- `npm run check:phaser` and `npm run check:ci` pass.

## Verification Commands

- `npm run check:phaser`
- `npm run check:ci`

## Browser Use

Browser Use `iab`가 노출되면 expansion -> plot_03 planting을 직접 확인한다. 노출되지 않으면 현재 세션 blocker와 Playwright fallback screenshot evidence를 남긴다.

## GitHub

- Issue: https://github.com/bborok1234/strange-seed-shop/issues/453
- Draft PR: pending

## Evidence

- `npm run check:phaser` pass
- `npm run check:ci` pass
- `reports/visual/issue-0453-third-plot-seed-planting-loop/phaser-check-third-plot-expanded-393.png`
- `reports/visual/issue-0453-third-plot-seed-planting-loop/phaser-check-third-plot-planted-393.png`
- `reports/visual/issue-0453-third-plot-seed-planting-loop/visual-report-20260508.md`
