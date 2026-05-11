# Issue #518 visual report - 밤유리 오로 월정 문 route action

## Game Studio route

`game-studio:game-studio -> game-studio:phaser-2d-game -> game-studio:game-ui-frontend -> game-studio:game-playtest`

## Claim

`밤유리 오로 합류` 이후 player verb `월정 문 단서 보기`가 노출되고, 클릭 후 `expedition_moon_fence_locked` locked route preview가 playfield/HUD/objective/telemetry에 남는다.

## Evidence

- Before action: `reports/visual/issue-0518-night-glass-oro-moon-fence-route-action/phaser-check-night-glass-oro-handoff-393.png`
- After action: `reports/visual/issue-0518-night-glass-oro-moon-fence-route-action/phaser-check-moon-fence-route-action-393.png`
- Browser Use blocker: `reports/visual/issue-0518-night-glass-oro-moon-fence-route-action/browser-use-blocker-20260511.md`
- Fallback command: `npm run check:phaser`

## Observed pass conditions

- `nightGlassOroRouteActionAvailable=true` after `밤유리 수확`.
- `월정 문 단서 보기` action is present after `actor_oro` handoff.
- After clicking the action, telemetry reports `moonFenceRoutePreviewVisible=true`, `moonFenceRouteInspected=true`, and `nightGlassOroRouteActionAvailable=false`.
- Objective contains `월정 문 단서 확인 · expedition_moon_fence_locked locked`.
- HUD/action rail contains `월정 문 단서 확인` and `expedition_moon_fence_locked`.
- Runtime image generation/API/cache is not used.

## Remaining risk

- The locked route marker reuses existing expedition gate and night-glass FX. If production review requires a more distinctive route silhouette, open a dedicated `facility_moon_fence_locked_v1` asset WorkUnit.
