## Studio operate checkpoint

Issue #440의 plan/prompt batch를 구현했다.

### 구현

- `assets/source/asset_plan.json`: v1 topology foundation asset 14개 추가
- `assets/source/asset_prompts.json`: 동일 14개 prompt 추가
- `scripts/update-topology-asset-plan.mjs`: idempotent updater
- `scripts/check-topology-asset-plan.mjs`: required ids, exact plan/prompt match, sprite metadata, background baked-in 금지 검증
- `package.json`: `npm run check:topology-asset-plan`

### 추가 asset ids

- `bg_garden_terrain_open_v1`
- `tile_plot_empty_v1`
- `tile_plot_sprout_v1`
- `tile_plot_growing_v1`
- `tile_plot_ready_v1`
- `tile_plot_locked_preview_v1`
- `facility_workbench_v1`
- `facility_order_crate_empty_v1`
- `facility_order_crate_filled_v1`
- `actor_pori_caretaker_strip_v1`
- `actor_momo_carrier_strip_v1`
- `fx_care_spark_strip_v1`
- `fx_harvest_leaf_flyout_strip_v1`
- `ui_shadow_soft_v1`

### Evidence

- `node scripts/update-topology-asset-plan.mjs` — pass, plan/prompt count 67/67
- `npm run check:topology-asset-plan` — pass
- `npm run check:asset-provenance` — pass
- `npm run check:asset-style` — pass

### 남은 위험

이번 issue는 plan/prompt-only다. 다음 WorkUnit은 실제 PNG generation, small-size review, manifest registration, runtime binding까지 이어져야 한다.
