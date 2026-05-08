## 요약

#506에서 `밤유리 source` 전용 rare seed icon과 unlock FX strip PNG 후보를 생성/검토했다.

## Small win

`밤유리 source 보기`가 accepted creature silhouette stand-in에 머무르지 않고, 후속 runtime binding에서 사용할 dedicated source icon/FX 후보와 provenance를 갖게 됐다.

## 사용자/운영자 가치

플레이어에게 rare route가 placeholder promise가 아니라 실제 보상물로 보이게 만드는 asset/FX 토대다. 운영자 관점에서는 plan/prompt(#504)에서 PNG 후보, provenance, review report까지 이어지는 Studio asset pipeline evidence가 닫힌다.

## Before / After 또는 Visual evidence

- Before: #503 runtime은 `seed_rare_001` 전용 source icon/FX 없이 accepted `creature_lunar_rare_001` silhouette stand-in을 사용했다.
- After: `public/assets/game/seeds/seed_rare_001_icon.png`와 `public/assets/game/fx/fx_night_glass_source_unlock_strip_v1.png`가 생성됐다.
- Contact sheet: `reports/assets/night_glass_source_asset_contact_sheet_20260508.png`
- Review report: `reports/assets/night_glass_source_asset_review_20260508.md`

## Playable mode

Runtime 화면 변경 없음. 이번 PR은 asset candidate generation/review slice이며, manifest acceptance와 Phaser runtime binding은 후속 WorkUnit에서 수행한다.

## 검증

- `SEED_ASSET_IMAGE_BACKGROUND=opaque npm run asset:generate:gpt-image -- --asset-id=seed_rare_001_icon`
- `SEED_ASSET_IMAGE_BACKGROUND=opaque npm run asset:generate:gpt-image -- --asset-id=fx_night_glass_source_unlock_strip_v1`
- `node scripts/postprocess-night-glass-source-assets.mjs`
- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:asset-alpha`
- targeted metadata check: `seed_rare_001_icon` `1024x1024` RGBA, `fx_night_glass_source_unlock_strip_v1` `768x96` RGBA
- `npm run check:ci`
- `git diff --check`

## 안전 범위

- Runtime image generation/API 호출을 추가하지 않는다.
- SVG/vector/code-native game graphics를 추가하지 않는다.
- Manifest acceptance와 Phaser runtime binding은 하지 않는다.
- `gpt-image-2` opaque 후보를 후처리해 workspace PNG와 provenance를 남긴다.

## 남은 위험

- `seed_rare_001_icon`은 후속 runtime binding에서 작은 크기와 배경 위 edge quality를 Browser Use 또는 blocker+Playwright fallback으로 확인해야 한다.
- `fx_night_glass_source_unlock_strip_v1`은 strict `8 x 96 x 96` strip으로 정규화됐지만 Phaser animation timing과 frame crop은 후속 PR에서 검수해야 한다.

## 연결된 issue

Closes #506

## 작업 checklist

- [x] Game Studio route 기록
- [x] Department Scorecard 기록
- [x] gpt-image-2 provenance 기록
- [x] asset review/contact sheet 기록
- [x] local verification 통과
- [ ] PR checks 통과
