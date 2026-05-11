# Issue #522 visual report - 월정 문 준비 납품 material payoff

## Game Studio route

`game-studio:game-studio -> game-studio:phaser-2d-game -> game-studio:game-ui-frontend -> game-studio:game-playtest`

## Claim

`개방 조건 보기` 이후 player verb `월정 문 준비 납품`이 노출되고, 클릭 후 material requirement가 `재료 3/3 ready`로 바뀌며 `달빛 단서 1/2` blocker가 남는다.

## Evidence

- Requirements state: `reports/visual/issue-0522-moon-fence-prep-delivery-payoff/phaser-check-moon-fence-requirements-393.png`
- Prep delivery state: `reports/visual/issue-0522-moon-fence-prep-delivery-payoff/phaser-check-moon-fence-prep-delivery-393.png`
- Browser Use blocker: `reports/visual/issue-0522-moon-fence-prep-delivery-payoff/browser-use-blocker-20260511.md`
- Fallback command: `npm run check:phaser`

## Observed pass conditions

- `월정 문 준비 납품` action is present after `개방 조건 보기`.
- After clicking the action, telemetry reports `moonFencePrepDeliveryCompleted=true`, `moonFencePrepDeliveryCrateVisible=true`, and `moonFenceMaterialsReady=true`.
- Requirements telemetry reports `moonFenceRequiredMaterials=3`, `moonFenceCurrentMaterials=3`, `moonFenceRequiredClues=2`, and `moonFenceCurrentClues=1`.
- Objective contains `월정 문 준비 납품 완료 · 재료 3/3 · 달빛 단서 1/2`.
- HUD/action rail contains `재료 3/3 ready` and `달빛 단서 1/2`.
- Runtime image generation/API/cache is not used.

## Remaining risk

- The prep crate uses compact text over existing expedition gate art. If manual playtest reads it as too small, split a dedicated moon-fence prep crate sprite/FX WorkUnit before route unlock.
