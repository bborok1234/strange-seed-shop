# 월정 숲 source asset review

- Issue: #532
- Source prompts: `assets/source/asset_prompts.json`
- Provider/model: OpenAI Images API `gpt-image-2` with `SEED_ASSET_IMAGE_BACKGROUND=opaque`
- Runtime separation: runtime image generation/API/cache 호출 없음. 생성 PNG는 workspace static asset으로 저장됨.
- Contact sheet: `reports/assets/moon_grove_source_asset_contact_sheet_20260511.png`

| Asset | Path | Size | Alpha | Review |
| --- | --- | --- | --- | --- |
| `seed_moon_grove_001_icon` | `public/assets/game/seeds/seed_moon_grove_001_icon.png` | 1024x1024 | yes | Issue #532 gpt-image-2 opaque candidate with border-connected checkerboard alpha cleanup; manifest/runtime binding remains follow-up. |
| `fx_moon_grove_source_reward_strip_v1` | `public/assets/game/fx/fx_moon_grove_source_reward_strip_v1.png` | 768x96 | yes | Issue #532 normalized strict 8x96x96 runtime strip from gpt-image-2 opaque source candidate; manifest/runtime binding remains follow-up. |

## Acceptance

- `seed_moon_grove_001_icon`: 48px/96px에서 moon-grove source seed로 읽히며 `seed_rare_001_icon`, `seed_lunar_002_icon`과 색/형태가 구분된다.
- `fx_moon_grove_source_reward_strip_v1`: strict horizontal strip, 8 frames, 96x96 per frame, 12fps intended, `animation.binding=moon_fence.reward.action.claim_source_clue`.
- 두 asset 모두 raster PNG이며 SVG/vector/code-native game graphic이 아니다.
- Manifest accepted registration과 Phaser runtime binding은 후속 WorkUnit에서 처리한다.

