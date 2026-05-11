# 월정 숲 source asset generation-review

## 요약

#531의 plan-prompt를 실제 workspace PNG 후보로 승격했습니다. `seed_moon_grove_001_icon`과 `fx_moon_grove_source_reward_strip_v1`을 gpt-image-2 opaque 후보로 생성하고, seed alpha cleanup 및 FX strict 8x96x96 normalization을 적용했습니다.

## Small win

월정 문 첫 원정의 `clue_moon_grove_001` promise가 다음 source seed icon/FX 후보까지 이어졌습니다.

## 사용자/운영자 가치

- 사용자: 후속 runtime binding에서 월정 숲 source를 밤유리 source와 다른 보상으로 볼 수 있는 시각 후보가 준비됩니다.
- 운영자: manifest/runtime PR이 stable PNG, raw output, provenance, review, checker evidence를 기준으로 진행됩니다.

## Before / After 또는 Visual evidence

- Before: `seed_moon_grove_001_icon.png`, `fx_moon_grove_source_reward_strip_v1.png` output path가 없었습니다.
- After: 두 PNG가 workspace에 저장됐고, FX는 8 frames x 96x96 horizontal strip으로 정규화됐습니다.
- Visual evidence: `reports/assets/moon_grove_source_asset_contact_sheet_20260511.png`
- Review evidence: `reports/assets/moon_grove_source_asset_review_20260511.md`

## Playable mode

N/A - 이번 PR은 static asset generation/review입니다. Phaser runtime binding과 accepted manifest registration은 후속 issue에서 진행합니다.

## 검증

- [x] `npm run check:moon-grove-source-assets`
- [x] `npm run check:asset-provenance`
- [x] `npm run check:asset-style`
- [x] `npm run check:asset-alpha`
- [x] `npm run check:topology-generated-assets`
- [x] `npm run check:ci`
- [x] `git diff --check`
- [x] `npm run check:dashboard`
- [x] `npm run check:ops-live`

## 안전 범위

- Runtime image generation/API/cache 호출 없음.
- Manifest accepted registration 없음.
- Phaser runtime render/binding 변경 없음.
- 외부 채널/실결제/production user data 변경 없음.

## 남은 위험

- 이 PR만으로는 새 asset이 게임 화면에 표시되지 않습니다.
- 후속 PR에서 `public/assets/manifest/assetManifest.json` accepted entry와 Phaser preload/render/FX binding이 필요합니다.

## 작업 checklist

- [x] WorkUnit plan-first artifact 고정
- [x] GitHub issue #532 고정
- [x] seed icon PNG 생성/저장
- [x] FX strip PNG 생성/저장 및 8x96x96 정규화
- [x] generation/review evidence 갱신
- [x] local checks 통과
- [ ] PR checks 관찰
- [ ] merge 후 main CI 관찰

## 연결된 issue

Closes #532
