# Issue #524 visual report - 월정 문 두 번째 달빛 단서 payoff

## Game Studio route

`game-studio:game-studio -> game-studio:phaser-2d-game -> game-studio:game-ui-frontend -> game-studio:game-playtest`

## Claim

`월정 문 준비 납품` 이후 player verb `달빛 단서 포장`이 노출되고, 클릭 후 clue requirement가 `달빛 단서 2/2 ready`로 바뀌며 material requirement는 `재료 3/3 ready`로 유지된다.

## Evidence

- Prep delivery state: `reports/visual/issue-0524-moon-fence-second-clue-payoff/phaser-check-moon-fence-prep-delivery-393.png`
- Second clue state: `reports/visual/issue-0524-moon-fence-second-clue-payoff/phaser-check-moon-fence-second-clue-393.png`
- Browser Use blocker: `reports/visual/issue-0524-moon-fence-second-clue-payoff/browser-use-blocker-20260511.md`
- Fallback command: `npm run check:phaser`

## Observed pass conditions

- `달빛 단서 포장` action is present after `월정 문 준비 납품`.
- After clicking the action, telemetry reports `moonFenceSecondCluePackaged=true`, `moonFenceClueStampVisible=true`, and `moonFenceCluesReady=true`.
- Requirements telemetry reports `moonFenceRequiredClues=2`, `moonFenceCurrentClues=2`, `moonFenceRequiredMaterials=3`, and `moonFenceCurrentMaterials=3`.
- Objective contains `달빛 단서 포장 완료 · 단서 2/2 · 재료 3/3 · 월정 문 열기 대기`.
- HUD/action rail contains `달빛 단서 2/2 ready`, `재료 3/3 ready`, and `월정 문 열기 대기`.
- Runtime image generation/API/cache is not used.

## Remaining risk

- The clue stamp uses compact text over existing expedition gate art. If manual playtest reads it as too small, split a dedicated moon-fence clue stamp sprite/FX WorkUnit before route unlock.
