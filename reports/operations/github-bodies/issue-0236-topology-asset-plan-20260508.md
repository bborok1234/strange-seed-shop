## 요약

#433 Phaser garden board foundation이 merge/main CI까지 통과했으므로, 다음 WorkUnit은 placeholder art를 production asset으로 굳히지 않기 위한 topology asset plan/prompt batch다.

`assets/source/asset_plan.json`과 `assets/source/asset_prompts.json`에 v1 garden board foundation용 raster asset/sprite/FX bundle을 추가한다.

## Small win

다음 image generation pass가 product decision 없이 실행될 수 있도록 terrain, plot states, facility states, actor strips, FX strips, grounding shadow의 stable asset id와 prompt를 확정한다.

## Campaign source of truth

- `docs/GAME_BIBLE.md`
- `docs/GAME_PRODUCTION_SPEC.md`
- `docs/phaser/REBOOT_FOUNDATION_SPEC.md`
- `items/0236-topology-asset-plan.md`

## Game Studio Department Signoff / Department Scorecard

| 부서 | 판정 | 근거 |
| --- | --- | --- |
| 기획팀 | approve | #433 foundation의 next blocker는 placeholder art이며, asset bundle은 first 5m plot/actor/order screen moment를 강화한다. |
| 리서치팀 | approve | Production gap은 plot/order/worker state가 텍스트 없이 읽히는가다. |
| 아트팀 | approve | gpt-image-2/Codex native raster provenance를 위한 ids, frame specs, manifest binding을 먼저 고정한다. |
| 개발팀 | approve | 이번 범위는 JSON plan/prompt이며 runtime은 이후 manifest asset id로 교체한다. |
| 검수팀 | approve | JSON parse, id uniqueness, plan/prompt match, sprite metadata를 검증한다. |
| 마케팅팀 | approve | 외부 채널/실결제/광고 없음. |
| 고객지원팀 | approve | state readability가 첫 5분 혼란을 줄인다. |

## Self-evaluation loop

- Claim: v1 topology asset generation이 바로 가능한 plan/prompt 상태다.
- Smallest verifier: JSON parse, id uniqueness, prompt-plan exact match.
- Rubric: required 14 assets, PNG workspace output paths, sprite metadata, prompt completeness.
- Artifact path: `assets/source/asset_plan.json`, `assets/source/asset_prompts.json`.
- Stop condition: plan/prompt 검증 통과 또는 generation blocker 기록.

## Asset bundle

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

## 검증

- JSON parse/id uniqueness
- plan/prompt exact match
- sprite/FX metadata presence
- `npm run check:asset-provenance`
- `npm run check:asset-style`

## 안전 범위

- 이번 issue는 plan/prompt-only다.
- accepted manifest game asset 추가는 generation/review issue에서만 한다.
- SVG/vector/code-native accepted game graphics 금지.
- runtime image generation 금지.

## 연결된 issue

이 issue가 생성되면 `items/0236-topology-asset-plan.md`에 번호를 기록한다.
