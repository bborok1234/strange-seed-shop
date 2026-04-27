# 0017 Starter seed sprite-pipeline first batch

## 의도

starter seed의 첫 수확 피크를 정적 spritesheet strip으로 증명한다. 목표는 graphics-only Phaser playfield에서 벗어나, `seed_herb_001`의 심기/탭/성장/수확/보상 순간을 Phaser `load.spritesheet`와 animation metadata로 재생하는 것이다.

## 범위

- `sprite_batch_001` 6개 정적 strip 추가
  - `seed_herb_001_idle_strip`
  - `seed_herb_001_tap_strip`
  - `sprout_herb_001_grow_strip`
  - `creature_herb_common_ready_strip`
  - `fx_harvest_sparkle_strip`
  - `fx_leaf_reward_pop_strip`
- `asset_plan.json`, `asset_prompts.json`, `asset_generation_status.json`, `assetManifest.json`에 batch metadata 반영
- `ManifestAsset.animation` spritesheet slicing metadata 추가
- `GardenPlayfieldHost`가 React-owned manifest subset을 `GardenScene`에 전달
- `GardenScene`이 spritesheet를 load하고 grow/ready/tap/harvest/reward animation을 재생하며 graphics fallback 유지
- `scripts/check-sprite-batch.mjs` 추가 및 `npm run check:all`에 포함
- asset review와 visual QA evidence 기록

## 비목표

- 전체 seed/creature animation system 구축
- 저장 구조, content schema, analytics event 이름, Phase 0 경제 숫자 변경
- 실제 결제, login/account, ads SDK, external navigation
- runtime image generation 또는 외부 이미지 API 호출
- 새 dependency 추가

## 수락 기준

- [x] 6개 strip이 workspace의 `public/assets/game/**`에 존재한다.
- [x] 각 strip은 `width = frameWidth * frames`, `height = frameHeight` strict slicing을 만족한다.
- [x] `assetManifest.json`에 `animation.kind="spritesheet"`, `frames`, `frameWidth`, `frameHeight`, `frameRate`, `repeat`가 포함된다.
- [x] `GardenScene`은 manifest를 직접 fetch하지 않고 React/Host에서 전달받은 playfield assets만 load한다.
- [x] spritesheet load 실패 시 기존 graphics fallback이 유지된다.
- [x] `scripts/check-sprite-batch.mjs`가 sprite batch와 evidence를 검증한다.
- [x] Browser/visual QA evidence가 `reports/visual/`에 저장된다.
- [x] `npm run check:all`이 통과한다.
- [x] draft PR이 생성되고 main에는 자동 merge하지 않는다. (`PR #20`)

## 검증 기록

- 정적 sprite dimensions: `npm run check:sprite-batch` 통과
- Loop/economy/content/build: `npm run check:all` 통과
- Visual evidence: `reports/visual/sprite-batch-browser-use-fallback-20260427.md`, `reports/visual/sprite-batch-mobile-360-20260427.png`, `reports/visual/sprite-batch-desktop-1280-20260427.png`
- Draft PR: https://github.com/bborok1234/strange-seed-shop/pull/20

## 후속 위험

- 이번 환경에서는 Codex image generation 결과를 파일로 직접 export하는 경로가 불확실해, strict slicing을 우선하기 위해 deterministic static PNG strip으로 batch를 고정했다. 다음 production batch에서는 Codex native image generation 파일 export 경로를 확정하거나, generated output을 normalization script로 통과시키는 별도 item이 필요하다.
