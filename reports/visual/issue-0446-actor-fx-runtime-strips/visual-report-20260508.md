# Issue #446 visual report

## Scope

Actor/FX runtime strip normalization and Phaser integration.

Generated source candidates normalized in this WorkUnit:

- `actor_pori_caretaker_strip_v1` -> 6 frames, 128x128, 768x128
- `actor_momo_carrier_strip_v1` -> 6 frames, 128x128, 768x128
- `fx_care_spark_strip_v1` -> 6 frames, 96x96, 576x96
- `fx_harvest_leaf_flyout_strip_v1` -> 8 frames, 96x96, 768x96

## Browser Use

Browser Use `iab` tool was not exposed after tool discovery in this turn. Fallback used the existing Playwright-based `scripts/check-phaser-foundation.mjs` smoke.

## Evidence

Contact sheet:

- `reports/assets/actor_fx_runtime_strip_contact_sheet_20260508.png`

Screenshots:

- `reports/visual/issue-0446-actor-fx-runtime-strips/phaser-check-fresh-start-393.png`
- `reports/visual/issue-0446-actor-fx-runtime-strips/phaser-check-after-plant-393.png`
- `reports/visual/issue-0446-actor-fx-runtime-strips/phaser-check-ready-393.png`
- `reports/visual/issue-0446-actor-fx-runtime-strips/phaser-check-after-harvest-393.png`
- `reports/visual/issue-0446-actor-fx-runtime-strips/phaser-check-workbench-claim-393.png`

Automated evidence:

- `npm run check:phaser` passes.
- Actor/FX texture keys are loaded:
  - `actor_pori_caretaker_strip_v1`
  - `actor_momo_carrier_strip_v1`
  - `fx_care_spark_strip_v1`
  - `fx_harvest_leaf_flyout_strip_v1`
- One Phaser canvas is present.
- Mobile viewport has no body/document scroll.

## Findings

- Pass: Pori is rendered from generated actor strip after harvest, replacing the shape placeholder.
- Pass: care interaction shows generated care spark FX in the ready-state screenshot.
- Pass: plant/care/harvest/workbench claim smoke still reaches leaves `20`, seeds `0`, and workbench claim receipt.
- Caution: Momo strip is normalized and preloaded but not yet assigned to a second runtime actor.
