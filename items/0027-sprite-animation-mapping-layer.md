# Sprite state-to-animation mapping layer

Status: in_progress
Owner: agent
Created: 2026-04-28
Updated: 2026-04-28
Scope-risk: moderate
Work type: game_feature
Issue: #21
PR: #40

## Intent

PR #20의 starter sprite batch는 `GardenScene` 내부 `SPRITE_KEYS` 상수로 starter 전용 animation key를 선택했다. 다음 sprite family/rarity batch가 추가될 때마다 runtime 코드를 수정하지 않도록, manifest animation metadata가 `seedId + plot state + action`을 animation binding으로 선언하고 Phaser scene은 그 binding을 해석하게 만든다.

## Acceptance Criteria

- `ManifestAnimation`이 playfield animation binding metadata를 표현한다.
- `public/assets/manifest/assetManifest.json`의 starter/fx sprite strip은 `target`, `slot`, `seedIds`, `plotStates`, `actions`를 포함한다.
- `GardenScene`은 starter-specific `SPRITE_KEYS` 또는 animation asset id를 hard-code하지 않는다.
- graphics fallback은 계속 유지된다.
- `scripts/check-sprite-batch.mjs`가 binding 누락과 GardenScene hard-code 회귀를 실패로 잡는다.
- `npm run check:all`이 통과한다.

## Evidence

- Issue #21: https://github.com/bborok1234/strange-seed-shop/issues/21
- PR #40: https://github.com/bborok1234/strange-seed-shop/pull/40
- `npm run check:sprite-batch` PASS — manifest binding, GardenScene hard-code 제거, visual evidence 검증
- `npm run build` PASS — Phaser lazy chunk build 통과
- `npm run check:all` PASS — 전체 제품/운영사 gate 통과
- Browser Use 우선 시도 후 CDP fallback: `reports/visual/sprite-mapping-browser-use-fallback-20260428.md`
- Runtime fallback captures:
  - `reports/visual/sprite-mapping-growing-20260428.png`
  - `reports/visual/sprite-mapping-ready-20260428.png`

## Proposed Plan

1. `ManifestAnimation`에 binding metadata type을 추가한다.
2. 기존 6개 sprite/fx strip manifest entry에 binding을 추가한다.
3. `GardenScene`의 `SPRITE_KEYS`를 제거하고 manifest binding resolver로 plot/effect animation을 선택한다.
4. sprite checker가 binding 필드와 hard-code 제거를 검증하게 한다.
5. runtime visual fallback evidence를 남긴다.

## Apply Conditions

- Runtime image generation을 추가하지 않는다.
- Phaser playfield는 action emit/rendering만 맡고 React save/content/analytics ownership을 유지한다.
- 새 asset generation이나 strip normalization은 Issue #22로 분리한다.

## Verification

- `npm run check:sprite-batch`
- `npm run build`
- `npm run check:all`
