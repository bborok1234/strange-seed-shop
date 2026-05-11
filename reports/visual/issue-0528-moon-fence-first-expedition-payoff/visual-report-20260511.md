# Issue #528 visual report - 월정 문 첫 원정 payoff

## Game Studio route

`game-studio:game-studio -> game-studio:phaser-2d-game -> game-studio:game-ui-frontend -> game-studio:game-playtest`

## Claim

`expedition_moon_fence_unlocked` route open 이후 player verb `월정 문 원정 보내기`가 노출되고, 클릭 후 `월정 문 원정 중`, `월정 문 귀환 상자`, `월정 문 보상 수령`으로 이어진다.

## Evidence

- Route open state: `reports/visual/issue-0528-moon-fence-first-expedition-payoff/phaser-check-moon-fence-route-unlocked-393.png`
- Traveling state: `reports/visual/issue-0528-moon-fence-first-expedition-payoff/phaser-check-moon-fence-expedition-traveling-393.png`
- Return crate state: `reports/visual/issue-0528-moon-fence-first-expedition-payoff/phaser-check-moon-fence-expedition-returned-393.png`
- Claimed reward state: `reports/visual/issue-0528-moon-fence-first-expedition-payoff/phaser-check-moon-fence-expedition-claimed-393.png`
- Browser Use blocker: `reports/visual/issue-0528-moon-fence-first-expedition-payoff/browser-use-blocker-20260511.md`
- Fallback command: `npm run check:phaser`

## Observed pass conditions

- `월정 문 열림` 이후 action rail에 `월정 문 원정 보내기`가 노출된다.
- Start action sets `activeExpeditionRouteId=expedition_moon_fence_unlocked`, `moonFenceExpeditionState=traveling`, and reward leaves `88`.
- Return state reports `moonFenceExpeditionState=returned`, `moonFenceReturnCrateVisible=true`, and action `월정 문 귀환 상자 열기`.
- Claim state reports `moonFenceRewardClaimed=true`, `moonFenceRewardMotionVisible=true`, `moonFenceNextClueVisible=true`, and `moonFenceNextClueId=clue_moon_grove_001`.
- Final objective contains `월정 문 보상 수령 · clue_moon_grove_001 · 다음 source promise`.
- Final leaves are `387`, which is the prior `299` plus moon-fence reward `88`.
- Runtime image generation/API/cache is not used.

## Verification

- `npm run check:phaser` pass
- `npm run check:content` pass
- `npm run check:asset-provenance` pass
- `npm run check:asset-style` pass
- `npm run check:ci` pass
- `git diff --check` pass

## Remaining risk

- The next clue is currently a promise/telemetry surface, not a new accepted seed/source asset. The follow-up WorkUnit should turn `clue_moon_grove_001` into a concrete source/asset path or a dedicated moon-fence FX bundle.
