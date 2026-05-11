# Issue #520 visual report - 월정 문 unlock requirements surface

## Game Studio route

`game-studio:game-studio -> game-studio:phaser-2d-game -> game-studio:game-ui-frontend -> game-studio:game-playtest`

## Claim

`월정 문 단서 확인` 이후 player verb `개방 조건 보기`가 노출되고, 클릭 후 월정 문 unlock requirements가 playfield/HUD/objective/telemetry에 남는다.

## Evidence

- Route action state: `reports/visual/issue-0520-moon-fence-unlock-requirements-surface/phaser-check-moon-fence-route-action-393.png`
- Requirements state: `reports/visual/issue-0520-moon-fence-unlock-requirements-surface/phaser-check-moon-fence-requirements-393.png`
- Browser Use blocker: `reports/visual/issue-0520-moon-fence-unlock-requirements-surface/browser-use-blocker-20260511.md`
- Fallback command: `npm run check:phaser`

## Observed pass conditions

- `개방 조건 보기` action is present after `월정 문 단서 보기`.
- After clicking the action, telemetry reports `moonFenceRequirementSurfaceVisible=true` and `moonFenceRequirementsInspected=true`.
- Requirements telemetry reports `moonFenceRequiredClues=2`, `moonFenceCurrentClues=1`, `moonFenceRequiredMaterials=3`, `moonFenceCurrentMaterials=2`, and `moonFenceRequiredExplorerId=actor_oro`.
- Objective contains `월정 문 개방 조건 확인 · 오로 explorer · 달빛 단서 1/2 · 재료 2/3`.
- HUD/action rail contains `오로 explorer`, `달빛 단서 1/2`, and `재료 2/3`.
- Runtime image generation/API/cache is not used.

## Remaining risk

- The requirements chip uses compact text over existing expedition gate art. If it feels crowded in manual playtest, move the requirements to a dedicated route panel or open a dedicated route requirements asset WorkUnit.
