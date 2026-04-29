# P0.5 core asset manifest normalization - 2026-04-29

## Summary

#127에서 생성한 P0.5 production/order asset 후보 5개를 manifest에서 추적 가능하게 정리했다. FX strip 2개는 4-frame strict strip으로 재저장해 PNG dimensions와 manifest frame metadata가 일치한다.

## Manifest Entries

| Asset id | Manifest status | Path | Notes |
| --- | --- | --- | --- |
| `creature_herb_common_001_work` | accepted | `/assets/game/creatures/states/creature_herb_common_001_work.png` | production work-state candidate |
| `creature_herb_common_001_celebrate` | accepted | `/assets/game/creatures/states/creature_herb_common_001_celebrate.png` | first order delivery celebrate-state candidate |
| `ui_order_crate_leaf_001` | accepted | `/assets/game/ui/ui_order_crate_leaf_001.png` | first commission crate icon |
| `fx_production_tick_leaf_001` | accepted | `/assets/game/fx/fx_production_tick_leaf_001_strip.png` | normalized 4 x 160px strict strip |
| `fx_order_delivery_burst_001` | accepted | `/assets/game/fx/fx_order_delivery_burst_001_strip.png` | normalized 4 x 160px strict strip |

## Visual Evidence

- Normalized contact sheet: `reports/assets/p0-core-asset-manifest-normalization-20260429.png`
- Before generation report: `reports/assets/p0-core-asset-generation-first-pass-20260429.md`

## Verification Notes

- `assetManifest.json` keeps `runtime_generation_allowed=false`.
- The two FX strip PNGs are both `640x160`, matching `frames=4`, `frameWidth=160`, `frameHeight=160`.
- Runtime UI connection was intentionally not added in this issue. Browser Use QA belongs to the follow-up runtime integration issue.

## Remaining Risk

- FX particles are readable as a first pass, but final timing/scale should be judged only after they are rendered in Phaser/DOM.
- Creature work/celebrate and crate are manifest-visible but not yet used by the garden UI.
