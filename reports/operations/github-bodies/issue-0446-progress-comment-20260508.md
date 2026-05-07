## 진행 상황

Actor/FX source candidates를 strict runtime strip으로 정규화하고 Phaser runtime에 연결했습니다.

## 변경 요약

- `node scripts/normalize-actor-fx-runtime-strips.mjs` 추가
  - `actor_pori_caretaker_strip_v1`: 6 frames, 128x128, 768x128
  - `actor_momo_carrier_strip_v1`: 6 frames, 128x128, 768x128
  - `fx_care_spark_strip_v1`: 6 frames, 96x96, 576x96
  - `fx_harvest_leaf_flyout_strip_v1`: 8 frames, 96x96, 768x96
- Phaser runtime 연결
  - Pori actor is rendered from generated spritesheet after harvest.
  - care/harvest FX textures are preloaded and animated on interaction.
  - `check:phaser` now verifies actor/FX texture keys.

## Visual evidence

- Strip contact sheet: `reports/assets/actor_fx_runtime_strip_contact_sheet_20260508.png`
- Visual report: `reports/visual/issue-0446-actor-fx-runtime-strips/visual-report-20260508.md`
- Screenshots:
  - `reports/visual/issue-0446-actor-fx-runtime-strips/phaser-check-fresh-start-393.png`
  - `reports/visual/issue-0446-actor-fx-runtime-strips/phaser-check-after-plant-393.png`
  - `reports/visual/issue-0446-actor-fx-runtime-strips/phaser-check-ready-393.png`
  - `reports/visual/issue-0446-actor-fx-runtime-strips/phaser-check-after-harvest-393.png`
  - `reports/visual/issue-0446-actor-fx-runtime-strips/phaser-check-workbench-claim-393.png`

## 검증

- `npm run check:phaser` — pass
- `npm run check:topology-generated-assets` — pass
- `npm run check:asset-provenance` — pass
- `npm run check:asset-style` — pass
- `npm run check:asset-alpha` — pass
- `npm run check:ci` — pass

## 남은 위험

- Momo strip is normalized and preloaded, but not yet assigned to a second runtime actor.
- 다음 WorkUnit은 manifest registration, order reward motion, Momo carrier task 중 하나를 이어가야 합니다.
