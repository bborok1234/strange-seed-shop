# Topology asset review 2026-05-08

## Summary

#442 / WorkUnit 0237은 #440의 topology asset plan/prompt batch를 실제 PNG 후보로 생성했다. `OPENAI_API_KEY`와 `.env`의 image 설정을 사용했고, model은 `gpt-image-2`다.

첫 시도에서 `background=transparent`는 API가 `transparent background is not supported for this model.`로 거부했다. 따라서 이번 후보는 `SEED_ASSET_IMAGE_BACKGROUND=opaque`로 생성했다. 모든 후보 PNG는 1024x1024 RGB 파일이며, manifest 투입 전 알파/배경 후처리 필요 상태로 남긴다.

Contact sheet:

- `reports/assets/topology_asset_contact_sheet_20260508.png`

## Review Verdict

| asset_id | path | verdict | notes |
| --- | --- | --- | --- |
| `bg_garden_terrain_open_v1` | `public/assets/game/backgrounds/bg_garden_terrain_open_v1.png` | source candidate accepted | Background is intentionally full-frame and can remain opaque. It avoids baked plots/facilities and reads as an open garden board. |
| `tile_plot_empty_v1` | `public/assets/game/tiles/tile_plot_empty_v1.png` | manifest_candidate_requires_alpha_review | Strong empty soil silhouette and readable plot frame. Opaque checkerboard-like background must be removed before manifest/runtime layering. |
| `tile_plot_sprout_v1` | `public/assets/game/tiles/tile_plot_sprout_v1.png` | manifest_candidate_requires_alpha_review | Sprout state reads clearly at small size. Needs alpha/background cleanup before runtime layering. |
| `tile_plot_growing_v1` | `public/assets/game/tiles/tile_plot_growing_v1.png` | manifest_candidate_requires_alpha_review | Growing state is visually distinct from sprout and ready. Needs alpha/background cleanup before runtime layering. |
| `tile_plot_ready_v1` | `public/assets/game/tiles/tile_plot_ready_v1.png` | manifest_candidate_requires_alpha_review | Ready/harvestable state reads with denser leaves and larger growth. Needs alpha/background cleanup before runtime layering. |
| `tile_plot_locked_preview_v1` | `public/assets/game/tiles/tile_plot_locked_preview_v1.png` | manifest_candidate_requires_alpha_review | Lock state reads immediately and fits expansion-preview use. Needs alpha/background cleanup before runtime layering. |
| `facility_workbench_v1` | `public/assets/game/facilities/facility_workbench_v1.png` | manifest_candidate_requires_alpha_review | Strong facility identity and production-table silhouette. Detail density is high but acceptable for a zoomed board prop; alpha cleanup required. |
| `facility_order_crate_empty_v1` | `public/assets/game/facilities/facility_order_crate_empty_v1.png` | manifest_candidate_requires_alpha_review | Empty crate reads clearly and is distinct from filled crate. Alpha cleanup required. |
| `facility_order_crate_filled_v1` | `public/assets/game/facilities/facility_order_crate_filled_v1.png` | manifest_candidate_requires_alpha_review | Filled state reads through lid/leaf bundle and color mass. Alpha cleanup required. |
| `actor_pori_caretaker_strip_v1` | `public/assets/game/sprites/actor_pori_caretaker_strip_v1.png` | sprite_pipeline_followup_required | Horizontal 6-pose read is present, but the image is 1024x1024 with baked background. It needs extraction into strict 6x96x96 or equivalent before manifest acceptance. |
| `actor_momo_carrier_strip_v1` | `public/assets/game/sprites/actor_momo_carrier_strip_v1.png` | sprite_pipeline_followup_required | Horizontal 6-pose read is present and distinct from Pori. It needs alpha/background removal and strict strip normalization before runtime use. |
| `fx_care_spark_strip_v1` | `public/assets/game/fx/fx_care_spark_strip_v1.png` | sprite_pipeline_followup_required | FX timing reads left-to-right, but baked background and 1024x1024 canvas prevent direct spritesheet use. Needs strict strip normalization. |
| `fx_harvest_leaf_flyout_strip_v1` | `public/assets/game/fx/fx_harvest_leaf_flyout_strip_v1.png` | sprite_pipeline_followup_required | Reward leaf motion reads left-to-right. Needs alpha/background removal and strict strip normalization. |
| `ui_shadow_soft_v1` | `public/assets/game/ui/ui_shadow_soft_v1.png` | manifest_candidate_requires_alpha_review | Utility intent is correct, but a shadow utility must be alpha-first. Rebuild or alpha-mask before manifest acceptance. |

## Runtime Separation

No runtime path calls image generation. The generation step saved raw PNGs under `assets/source/generated/gpt-image/**` and copied candidate files into `public/assets/game/**`. Runtime integration must use workspace files or manifest paths only.

## Follow-Up

1. Apply alpha/background cleanup to plot/facility/UI candidates or regenerate through an alpha-capable path.
2. Extract actor/FX candidates into strict horizontal strips with animation metadata before manifest registration.
3. Register only post-review accepted assets in `public/assets/manifest/assetManifest.json`.
4. Run Browser Use or fallback visual QA during the runtime integration WorkUnit, not in this static generation review.
