# P0.5 core asset generation first pass - 2026-04-29

## Summary

Issue #127의 P0.5 production/order asset 5개를 Codex native image generation으로 한 개씩 생성했고, Codex cache에만 두지 않고 workspace `public/assets/game/` 아래에 저장했다. 런타임 이미지 생성 경로는 추가하지 않았다.

## Generated Assets

| Asset id | Workspace path | Review | Notes |
| --- | --- | --- | --- |
| `creature_herb_common_001_work` | `public/assets/game/creatures/states/creature_herb_common_001_work.png` | accepted candidate | work state, leaf satchel, 생산 행동 판독성 좋음 |
| `creature_herb_common_001_celebrate` | `public/assets/game/creatures/states/creature_herb_common_001_celebrate.png` | accepted candidate | 같은 생명체로 읽히고 delivery celebrate 감정이 분명함 |
| `ui_order_crate_leaf_001` | `public/assets/game/ui/ui_order_crate_leaf_001.png` | accepted candidate | leaf order crate icon으로 48/96px 판독성 좋음 |
| `fx_production_tick_leaf_001` | `public/assets/game/fx/fx_production_tick_leaf_001_strip.png` | needs normalization candidate | 4-frame strip 후보. glow/magenta halo가 있어 manifest 연결 전 frame crop/alpha pass 필요 |
| `fx_order_delivery_burst_001` | `public/assets/game/fx/fx_order_delivery_burst_001_strip.png` | needs normalization candidate | 4-frame strip 후보. 보상 burst는 선명하지만 spacing/alpha normalization 필요 |

## Visual Evidence

- Contact sheet: `reports/assets/p0-core-asset-generation-first-pass-20260429.png`

## Generation Notes

- 각 asset은 개별 prompt로 생성했다.
- 첫 crate 후보는 checkerboard 배경으로 나와 거절했고, pure magenta chroma-key 배경으로 한 번 재생성했다.
- 모든 채택 후보는 chroma-key alpha conversion 후 workspace output path로 저장했다.
- `assets/source/asset_generation_status.json`은 기존 26개 ledger를 보존하고 이번 5개 batch를 `batches.p0_5_core_asset_generation_first_pass`에 추가했다.

## Runtime Separation

- 게임 runtime에서 Codex native image generation, GPT-image API, OpenAI SDK image runner를 호출하지 않는다.
- 이번 PR은 static source asset 후보와 generation ledger/report만 추가한다.
- manifest integration은 아직 하지 않았다. FX strip normalization이 먼저 필요하다.

## Remaining Risk

- FX strip 2개는 magenta halo/glow edge가 남아 있어 바로 runtime manifest에 연결하지 않는다.
- creature state 2개와 crate는 후보 품질이 좋지만 실제 Phaser scale/crop은 후속 runtime integration issue에서 확인해야 한다.
