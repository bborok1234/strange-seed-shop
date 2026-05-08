# 밤유리 source icon/FX generation review

## 범위

- Issue: #506
- WorkUnit: `items/0269-night-glass-source-asset-generation-review.md`
- Contact sheet: `reports/assets/night_glass_source_asset_contact_sheet_20260508.png`
- Generation command:
  - `SEED_ASSET_IMAGE_BACKGROUND=opaque npm run asset:generate:gpt-image -- --asset-id=seed_rare_001_icon`
  - `SEED_ASSET_IMAGE_BACKGROUND=opaque npm run asset:generate:gpt-image -- --asset-id=fx_night_glass_source_unlock_strip_v1`
- Postprocess command: `node scripts/postprocess-night-glass-source-assets.mjs`

## 판정 요약

두 후보 모두 `gpt-image-2` provenance가 있고 workspace PNG로 저장됐다. 생성 직후에는 checkerboard가 실제 픽셀로 들어간 opaque PNG였으므로, `edge_connected_checkerboard_alpha_cleanup` 후처리를 적용했다. FX 후보는 생성 이미지 안에 긴 horizontal sequence가 들어왔지만 1024 정사각 후보였기 때문에 `strict_strip_normalization`으로 `8 x 96 x 96` runtime strip 후보로 정규화했다.

이번 PR에서는 manifest acceptance와 Phaser runtime binding을 하지 않는다. 두 후보는 후속 runtime binding PR에서 작은 크기 판독성, 실제 HUD/playfield 배치, animation timing을 Browser Use 또는 현재 blocker+Playwright fallback으로 재검수해야 한다.

## Asset review

| asset_id | output | 후보 치수 | 후처리 후 치수 | 판정 | 근거 |
| --- | --- | --- | --- | --- | --- |
| `seed_rare_001_icon` | `public/assets/game/seeds/seed_rare_001_icon.png` | `1024x1024`, opaque | `1024x1024`, RGBA | manifest candidate, review required | 밤/달/유리 seed motif가 분명하고 64px에서도 rare source icon으로 읽힐 가능성이 높다. checkerboard background는 edge-connected alpha cleanup으로 제거했다. |
| `fx_night_glass_source_unlock_strip_v1` | `public/assets/game/fx/fx_night_glass_source_unlock_strip_v1.png` | `1024x1024`, opaque | `768x96`, RGBA | normalized runtime strip candidate, review required | 원본은 horizontal unlock sequence로 생성됐고 lock/crystal/moon glimmer motif가 있다. strict 8-frame strip으로 정규화했지만 frame 간 밝기/밀도는 runtime binding에서 재검수해야 한다. |

## Provenance

- Provider: `openai_images_api`
- Model: `gpt-image-2`
- Background: `opaque`
- Source prompts: `assets/source/asset_prompts.json`
- Style bible: `assets/source/asset_style_bible.json`
- Provenance file: `assets/source/gpt_image_asset_provenance.json`
- Generation status batch: `issue_0506_night_glass_source_asset_generation_review`

## 남은 위험

- `seed_rare_001_icon`은 alpha cleanup 후에도 아주 밝은 가장자리 feather 품질을 runtime 배경 위에서 봐야 한다.
- `fx_night_glass_source_unlock_strip_v1`은 strict strip 치수는 맞지만 AI 원본이 완전한 frame-by-frame sprite sheet로 생성된 것은 아니므로, Phaser animation에서 timing과 frame crop을 확인해야 한다.
- Browser Use hands-on QA는 runtime 화면 변경이 없어 이번 PR에서 N/A다. 후속 runtime binding WorkUnit에서 screenshot evidence와 visual regression을 남긴다.
