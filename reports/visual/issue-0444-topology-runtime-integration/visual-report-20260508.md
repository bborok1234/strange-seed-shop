# Issue #444 visual report

## Scope

Phaser v1 topology runtime integration. Generated topology source candidates from #442 are now visible in the Phaser board runtime:

- terrain background
- plot empty/sprout/growing/ready/locked-preview states
- workbench
- order crate empty/filled source states
- soft grounding shadow

## Browser Use

Browser Use `iab` tool was not exposed after tool discovery in this turn. `tool_search` exposed Node REPL and Computer Use, but no Browser Use browser-control namespace. Fallback used the existing Playwright-based `scripts/check-phaser-foundation.mjs` smoke.

## Evidence

Screenshots:

- `reports/visual/issue-0444-topology-runtime-integration/phaser-check-fresh-start-393.png`
- `reports/visual/issue-0444-topology-runtime-integration/phaser-check-after-plant-393.png`
- `reports/visual/issue-0444-topology-runtime-integration/phaser-check-ready-393.png`
- `reports/visual/issue-0444-topology-runtime-integration/phaser-check-workbench-claim-393.png`

Automated evidence:

- `npm run check:phaser` passes.
- One Phaser canvas is present.
- Mobile viewport has no body/document scroll.
- Loaded topology asset keys:
  - `bg_garden_terrain_open_v1`
  - `tile_plot_empty_v1`
  - `tile_plot_sprout_v1`
  - `tile_plot_growing_v1`
  - `tile_plot_ready_v1`
  - `tile_plot_locked_preview_v1`
  - `facility_workbench_v1`
  - `facility_order_crate_empty_v1`
  - `facility_order_crate_filled_v1`
  - `ui_shadow_soft_v1`

## Findings

- Pass: first screen now reads as a generated garden board instead of placeholder shapes.
- Pass: action rail no longer stretches over the playfield after CSS alignment fix.
- Pass: plant/care/ready/harvest/workbench claim smoke still reaches leaves `20`, seeds `0`, and workbench claim receipt.
- Caution: actor/FX generated candidates remain source candidates and are not normalized spritesheets in this WorkUnit.
