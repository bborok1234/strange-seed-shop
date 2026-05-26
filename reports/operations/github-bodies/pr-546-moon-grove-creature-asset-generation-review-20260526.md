## 요약

월정 숲 새벽이끼의 전용 creature portrait, idle/work actor strip, discovery bloom FX를 gpt-image-2 opaque 경로로 생성하고, alpha cleanup과 strict 8x96x96 strip normalization을 적용했습니다. 후속 runtime binding PR이 accepted manifest asset을 참조할 수 있도록 provenance/status/review/contact sheet와 전용 checker를 추가했습니다.

## Small win

`월정 숲 새벽이끼`가 source badge 대체물이 아니라 고유 silhouette, actor motion, reveal FX를 가진 named creature로 확장될 준비를 마쳤습니다.

## Plan-first evidence

- WorkUnit: `items/0289-moon-grove-creature-asset-generation-review.md`
- Issue: #546
- Campaign source: `docs/ROADMAP.md` Current Next Action
- Review: `reports/assets/moon_grove_creature_asset_review_20260526.md`
- Contact sheet: `reports/assets/moon_grove_creature_asset_contact_sheet_20260526.png`

## Game Studio route

`game-studio:game-studio -> game-studio:sprite-pipeline -> game-studio:game-playtest -> game-studio:phaser-2d-game`

## 작업 checklist

- [x] Plan-first WorkUnit 생성
- [x] GitHub issue #546 생성
- [x] 4개 target prompt dry-run 확인
- [x] gpt-image-2 opaque 생성
- [x] portrait alpha cleanup
- [x] actor/FX strict strip normalization
- [x] provenance/status/review/contact sheet 갱신
- [x] 전용 checker 추가
- [x] local `check:ci` 통과

## 사용자/운영자 가치

플레이어는 후속 runtime binding에서 rare discovery가 실제 creature와 motion payoff로 이어지는 흐름을 보게 됩니다. 운영자는 새 asset 후보를 provenance와 checker로 고정해 manifest/runtime binding을 별도 PR에서 안전하게 진행할 수 있습니다.

## Before / After 또는 Visual evidence

- Before: #543 이후 plan/prompt는 있었지만 `creature_moon_grove_001`, idle/work actor strip, discovery bloom FX workspace PNG가 없었습니다.
- After: 4개 PNG 후보가 생성/정규화됐고 `check:moon-grove-creature-assets`가 크기, alpha, provenance, status, review/contact sheet를 검증합니다.
- Visual evidence: `reports/assets/moon_grove_creature_asset_contact_sheet_20260526.png`

## Playable mode

이번 PR은 asset generation/review만 수행합니다. Phaser runtime binding과 playable 화면 변경은 후속 WorkUnit으로 분리합니다.

## 검증

- `npm run asset:generate:gpt-image -- --dry-run --asset-id=creature_moon_grove_001` - pass
- `npm run asset:generate:gpt-image -- --dry-run --asset-id=actor_moon_grove_miru_idle_strip_v1` - pass
- `npm run asset:generate:gpt-image -- --dry-run --asset-id=actor_moon_grove_miru_work_strip_v1` - pass
- `npm run asset:generate:gpt-image -- --dry-run --asset-id=fx_moon_grove_discovery_bloom_strip_v1` - pass
- `SEED_ASSET_IMAGE_BACKGROUND=opaque npm run asset:generate:gpt-image -- --asset-id=creature_moon_grove_001` - pass
- `SEED_ASSET_IMAGE_BACKGROUND=opaque npm run asset:generate:gpt-image -- --asset-id=actor_moon_grove_miru_idle_strip_v1` - pass
- `SEED_ASSET_IMAGE_BACKGROUND=opaque npm run asset:generate:gpt-image -- --asset-id=actor_moon_grove_miru_work_strip_v1` - pass
- `SEED_ASSET_IMAGE_BACKGROUND=opaque npm run asset:generate:gpt-image -- --asset-id=fx_moon_grove_discovery_bloom_strip_v1` - pass
- `node scripts/postprocess-moon-grove-creature-assets.mjs` - pass
- `npm run check:moon-grove-creature-assets` - pass
- `npm run check:asset-provenance` - pass
- `npm run check:asset-style` - pass
- `npm run check:asset-alpha` - pass
- `npm run check:dashboard` - pass
- `npm run check:ops-live` - pass
- `npm run check:ci` - pass
- `git diff --check` - pass

## 안전 범위

- Runtime image generation 없음
- SVG/vector/code-native game graphics 없음
- 기존 accepted manifest asset overwrite 없음
- 결제, 광고, 고객 데이터, 외부 배포 없음
- Runtime binding/manifest accepted registration은 후속 PR로 분리

## 남은 위험

이번 PR은 runtime에 asset을 연결하지 않습니다. 다음 WorkUnit에서 manifest accepted entry, Phaser preload/render/telemetry, Browser Use/playtest evidence를 추가해야 합니다.

## 연결된 issue

Closes #546
