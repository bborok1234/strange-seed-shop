# Issue #451 Visual Report - Third plot expansion unlock

## Scope

- WorkUnit: `items/0242-third-plot-expansion-unlock.md`
- Route: `game-studio:game-studio` -> `game-studio:phaser-2d-game` -> `game-studio:game-ui-frontend` -> `game-studio:game-playtest`
- Target flow: fresh start -> plant -> care -> harvest -> workbench claims -> order delivery -> third plot expansion.

## Browser Use

Browser Use `iab` is not exposed in this Codex CLI session, so hands-on in-app Browser Use QA is blocked for this issue.

Fallback used: `npm run check:phaser`, which builds the Phaser app, runs a scripted Playwright smoke flow at `393x852`, records screenshots, and checks deterministic runtime state.

## Evidence

- `npm run check:phaser`: pass
- Runtime state after third plot expansion:
  - leaves: `14`
  - starter seeds: `0`
  - completed deliveries: `1`
  - unlocked slots include `plot_03`
  - plot entities include `plot_03`
  - action rail label: `3번 햇살 밭`
- Screenshot sequence:
  - `reports/visual/issue-0451-third-plot-expansion-unlock/phaser-check-fresh-start-393.png`
  - `reports/visual/issue-0451-third-plot-expansion-unlock/phaser-check-after-plant-393.png`
  - `reports/visual/issue-0451-third-plot-expansion-unlock/phaser-check-ready-393.png`
  - `reports/visual/issue-0451-third-plot-expansion-unlock/phaser-check-after-harvest-393.png`
  - `reports/visual/issue-0451-third-plot-expansion-unlock/phaser-check-workbench-claim-393.png`
  - `reports/visual/issue-0451-third-plot-expansion-unlock/phaser-check-crate-ready-393.png`
  - `reports/visual/issue-0451-third-plot-expansion-unlock/phaser-check-delivery-claim-393.png`
  - `reports/visual/issue-0451-third-plot-expansion-unlock/phaser-check-expand-ready-393.png`
  - `reports/visual/issue-0451-third-plot-expansion-unlock/phaser-check-third-plot-expanded-393.png`

## Findings

- Delivery reward leaves are enough to expose `확장 60잎` on the third plot.
- Expansion deducts 60 leaves, renames the slot to `3번 햇살 밭`, unlocks `plot_03`, and creates a new empty plot entity.
- The board changes from preview plot language to usable empty plot language without runtime image generation/API/cache.
- No body scroll regression: body and document height remain `852` at `393x852`, with one Phaser canvas.

## Remaining Risk

Browser Use hands-on interaction remains blocked in this Codex CLI session. The next WorkUnit should connect planting/new seed supply on `plot_03` so the unlocked board capacity becomes immediately usable.
