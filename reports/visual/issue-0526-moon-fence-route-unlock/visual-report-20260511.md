# Issue #526 visual report - 월정 문 route unlock

## Game Studio route

`game-studio:game-studio -> game-studio:phaser-2d-game -> game-studio:game-ui-frontend -> game-studio:game-playtest`

## Claim

`달빛 단서 2/2 ready`, `재료 3/3 ready`, `오로 explorer` 상태 이후 player verb `월정 문 열기`가 노출되고, 클릭 후 월정 문은 `expedition_moon_fence_unlocked` route state와 unlocked marker로 전환된다.

## Evidence

- Second clue ready state: `reports/visual/issue-0526-moon-fence-route-unlock/phaser-check-moon-fence-second-clue-393.png`
- Route unlock state: `reports/visual/issue-0526-moon-fence-route-unlock/phaser-check-moon-fence-route-unlocked-393.png`
- Browser Use blocker: `reports/visual/issue-0526-moon-fence-route-unlock/browser-use-blocker-20260511.md`
- Fallback command: `npm run check:phaser`

## Observed pass conditions

- `달빛 단서 포장` 이후 action rail에 `월정 문 열기`가 노출된다.
- After clicking the action, telemetry reports `moonFenceRouteUnlocked=true`, `moonFenceUnlockedMarkerVisible=true`, and `moonFenceUnlockedRouteId=expedition_moon_fence_unlocked`.
- Route preview telemetry reports `nextRareRoutePreviewId=expedition_moon_fence_unlocked` and `nextExpeditionRoutePreviewId=expedition_moon_fence_unlocked`.
- Objective contains `월정 문 열림 · expedition_moon_fence_unlocked · 오로 explorer`.
- HUD/action rail contains `월정 문 열림`, `단서 2/2 ready`, `재료 3/3 ready`, and `오로 explorer`.
- Runtime image generation/API/cache is not used.

## Verification

- `npm run check:phaser` pass
- `npm run check:content` pass
- `npm run check:asset-provenance` pass
- `npm run check:asset-style` pass
- `npm run check:ci` pass
- `git diff --check` pass

## Remaining risk

- The route-open marker uses compact text over the existing expedition gate art. Dedicated moon-fence door-open sprite/FX remains a follow-up polish candidate before the first unlocked route expedition payoff.
