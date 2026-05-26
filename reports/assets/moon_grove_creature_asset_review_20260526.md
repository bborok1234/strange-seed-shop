# 월정 숲 creature/actor asset review

- Issue: #546
- Source prompts: `assets/source/asset_prompts.json`
- Provider/model: OpenAI Images API `gpt-image-2` with `SEED_ASSET_IMAGE_BACKGROUND=opaque`
- Runtime separation: runtime image generation/API/cache 호출 없음. 생성 PNG는 workspace static asset으로 저장됨.
- Contact sheet: `reports/assets/moon_grove_creature_asset_contact_sheet_20260526.png`

| Asset | Path | Size | Alpha | Review |
| --- | --- | --- | --- | --- |
| `creature_moon_grove_001` | `public/assets/game/creatures/creature_moon_grove_001.png` | 1024x1024 | yes | Issue #546 gpt-image-2 opaque candidate with border-connected checkerboard alpha cleanup; manifest/runtime binding remains follow-up. |
| `actor_moon_grove_miru_idle_strip_v1` | `public/assets/game/actors/actor_moon_grove_miru_idle_strip_v1.png` | 768x96 | yes | Issue #546 normalized strict 8x96x96 runtime strip from gpt-image-2 opaque source candidate; animation.binding=moon_grove.discovery.actor.idle; manifest/runtime binding remains follow-up. |
| `actor_moon_grove_miru_work_strip_v1` | `public/assets/game/actors/actor_moon_grove_miru_work_strip_v1.png` | 768x96 | yes | Issue #546 normalized strict 8x96x96 runtime strip from gpt-image-2 opaque source candidate; animation.binding=moon_grove.discovery.actor.work; manifest/runtime binding remains follow-up. |
| `fx_moon_grove_discovery_bloom_strip_v1` | `public/assets/game/fx/fx_moon_grove_discovery_bloom_strip_v1.png` | 768x96 | yes | Issue #546 normalized strict 8x96x96 runtime strip from gpt-image-2 opaque source candidate; animation.binding=moon_grove.discovery.action.reveal; manifest/runtime binding remains follow-up. |

## Acceptance

- `creature_moon_grove_001`: 64px/128px에서 moon-grove named creature portrait로 읽히며 source seed icon과 구분된다.
- `actor_moon_grove_miru_idle_strip_v1`: strict horizontal strip, 8 frames, 96x96 per frame, 8fps intended, `animation.binding=moon_grove.discovery.actor.idle`.
- `actor_moon_grove_miru_work_strip_v1`: strict horizontal strip, 8 frames, 96x96 per frame, 10fps intended, `animation.binding=moon_grove.discovery.actor.work`.
- `fx_moon_grove_discovery_bloom_strip_v1`: strict horizontal strip, 8 frames, 96x96 per frame, 12fps intended, `animation.binding=moon_grove.discovery.action.reveal`.
- 네 asset 모두 raster PNG이며 SVG/vector/code-native game graphic이 아니다.
- Manifest accepted registration과 Phaser runtime binding은 후속 WorkUnit에서 처리한다.

