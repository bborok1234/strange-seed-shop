## 문제 / 배경

Issue #542 / PR #543은 `월정 숲 새벽이끼` discovery 전용 creature portrait, idle/work actor strip, discovery bloom FX의 plan/prompt를 main에 추가했습니다. 그러나 아직 실제 workspace PNG/strip과 review evidence가 없어 후속 runtime binding은 accepted manifest asset을 참조할 수 없습니다.

현재 rare discovery는 source badge와 텍스트 payoff에 머무르며, 새 생명체가 화면에 남는 production payoff가 부족합니다.

## 목표

`creature_moon_grove_001`, `actor_moon_grove_miru_idle_strip_v1`, `actor_moon_grove_miru_work_strip_v1`, `fx_moon_grove_discovery_bloom_strip_v1`을 생성/정규화/리뷰해 후속 runtime binding이 가능한 workspace asset 후보와 provenance를 만듭니다.

## Small win

`월정 숲 새벽이끼`가 source icon 대체물이 아니라 고유 portrait, actor motion, reveal FX를 가진 named creature로 확장될 준비를 마칩니다.

## Game Studio route

`game-studio:game-studio -> game-studio:sprite-pipeline -> game-studio:game-playtest -> game-studio:phaser-2d-game`

## Plan

1. 기존 `assets/source/asset_prompts.json`의 4개 월정 숲 target prompt와 output path를 dry-run으로 확인합니다.
2. `SEED_ASSET_IMAGE_BACKGROUND=opaque`와 `SEED_ASSET_IMAGE_MODEL` 기준으로 gpt-image-2 생성 경로를 실행합니다.
3. portrait는 alpha-ready PNG로 cleanup하고 actor/FX는 8 frames, 96x96 strict strip으로 normalize합니다.
4. `assets/source/gpt_image_asset_provenance.json`, `assets/source/asset_generation_status.json`에 batch evidence를 남깁니다.
5. review report와 contact sheet를 생성하고 runtime generation separation을 명시합니다.
6. asset provenance/style/alpha와 전체 CI를 통과시킵니다.

## 플레이어 가치 또는 운영사 가치

플레이어는 rare source harvest 이후 새 이름의 creature가 실제 모습과 motion payoff로 이어질 것을 기대할 수 있습니다. 운영자는 후속 runtime binding PR에서 accepted manifest asset을 안전하게 참조할 수 있습니다.

## 수용 기준

- [ ] `public/assets/game/creatures/creature_moon_grove_001.png` 생성.
- [ ] `public/assets/game/actors/actor_moon_grove_miru_idle_strip_v1.png`가 8x96x96 strip으로 정규화.
- [ ] `public/assets/game/actors/actor_moon_grove_miru_work_strip_v1.png`가 8x96x96 strip으로 정규화.
- [ ] `public/assets/game/fx/fx_moon_grove_discovery_bloom_strip_v1.png`가 8x96x96 strip으로 정규화.
- [ ] provenance/status/review report/contact sheet 갱신.
- [ ] `npm run check:asset-provenance`, `npm run check:asset-style`, `npm run check:asset-alpha`, `npm run check:ci`, `git diff --check` 통과.
- [ ] PR checks, merge, main CI green.

## Visual evidence 계획

`reports/assets/moon_grove_creature_asset_contact_sheet_20260526.png`와 `reports/assets/moon_grove_creature_asset_review_20260526.md`에 portrait small-size crop, actor/FX strip metadata, runtime separation을 기록합니다. Runtime 화면 QA는 후속 binding WorkUnit에서 Browser Use/playtest evidence로 수행합니다.

## Playable mode 영향

이번 issue는 asset generation/review만 수행합니다. Phaser runtime binding과 playable 화면 변경은 후속 WorkUnit으로 분리합니다.

## 안전 범위

- Runtime image generation 없음
- SVG/vector/code-native game graphics 금지
- 결제, 광고, 고객 데이터, 외부 배포 없음
- 기존 accepted asset overwrite 없음
- Runtime binding/manifest accepted registration은 후속 PR로 분리

## 검증 명령

- `npm run asset:generate:gpt-image -- --dry-run --asset-id=creature_moon_grove_001`
- `npm run asset:generate:gpt-image -- --dry-run --asset-id=actor_moon_grove_miru_idle_strip_v1`
- `npm run asset:generate:gpt-image -- --dry-run --asset-id=actor_moon_grove_miru_work_strip_v1`
- `npm run asset:generate:gpt-image -- --dry-run --asset-id=fx_moon_grove_discovery_bloom_strip_v1`
- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:asset-alpha`
- `npm run check:ci`
- `git diff --check`
