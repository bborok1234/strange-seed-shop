# Issue #494 visual QA

## Route

- Game Studio route: `game-studio:game-studio -> game-studio:game-ui-frontend -> game-studio:phaser-2d-game -> game-studio:game-playtest`
- Browser Use: not exposed in this session; Playwright fallback used through `npm run check:phaser`.
- Runtime target: Phaser garden at `http://127.0.0.1:4183/`

## Evidence

- `npm run check:phaser` passed.
- Screenshot directory: `reports/visual/issue-0494-expedition-gate-raster-review/`
- Key screenshots:
  - `phaser-check-expedition-gate-preview-393.png`
  - `phaser-check-expedition-traveling-393.png`
  - `phaser-check-expedition-returned-393.png`
  - `phaser-check-expedition-claimed-393.png`

## Findings

- First actionable screen remains unchanged and playable.
- 원정 문 preview/traveling/returned/claimed states render with `facility_expedition_gate_v1`.
- returned state shows `facility_expedition_return_crate_v1` as a distinct reward cargo overlay.
- claim state plays `fx_expedition_return_reward_strip_v1` without covering the bottom action rail.
- Mobile viewport invariant passed: body/document scroll height stayed at 852 and no failure was reported by the checker.

## Remaining Risk

- Browser Use hands-on QA was unavailable, so visual acceptance relies on Playwright screenshots and manual screenshot inspection in this run.
- The expedition gate is detail-rich; if later slots get denser, its display size may need a simplified runtime crop.
