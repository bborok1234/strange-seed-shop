## Studio operate checkpoint

Issue #433을 `items/0235-garden-board-topology-scaffold.md` 기준으로 재작성하고 첫 Phaser v1 foundation slice를 구현했다.

### 구현

- `apps/seed-garden-phaser/src/gameState.ts`: data-driven board slot, plot/facility/actor/task state
- `apps/seed-garden-phaser/src/main.ts`: Phaser garden board scene, runtime plot/facility entity, actor task path, contextual DOM HUD/action rail
- `apps/seed-garden-phaser/src/styles.css`: mobile frame HUD, no-scroll canvas handling
- `scripts/check-phaser-foundation.mjs`: fresh start -> 심기 -> 돌보기 -> 수확 -> 작업대 수령 smoke

### Evidence

- `npm run build:phaser` pass
- `npm run check:phaser` pass
- Visual report: `reports/visual/issue-0433-garden-board-foundation/visual-report-20260508.md`
- Screenshots:
  - `reports/visual/issue-0433-garden-board-foundation/phaser-fresh-start-393-20260508.png`
  - `reports/visual/issue-0433-garden-board-foundation/phaser-after-harvest-actor-393-20260508.png`
  - `reports/visual/issue-0433-garden-board-foundation/phaser-workbench-claim-393-20260508.png`

### 남은 위험

이번 slice는 final art가 아니라 runtime topology proof다. 다음 WorkUnit은 accepted raster asset/sprite bundle 또는 first 5m vertical slice로 이어져야 한다.
