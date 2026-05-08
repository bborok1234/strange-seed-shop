# 첫 원정 문/귀환 상자 raster 후보 생성/리뷰

## 상태

- Status: implemented
- Game Studio route: `game-studio:game-studio -> game-studio:game-ui-frontend -> game-studio:phaser-2d-game -> game-studio:game-playtest`
- GitHub issue: #494
- Branch: `codex/v1-expedition-gate-raster-review`
- 연결: Issue #492, PR #493, main CI `25531773472`

## 배경

#493에서 첫 원정 문, 귀환 상자, 귀환 보상 FX strip의 asset plan/prompt가 준비됐다. 현재 Phaser runtime은 첫 원정 route를 제공하지만, 원정 문과 귀환 상자는 아직 전용 generated raster identity 없이 기존 order crate 계열 prop에 기대는 art debt가 남아 있다.

경쟁작 production gap은 D7 장기 목표가 텍스트 promise가 아니라 화면 안의 전용 prop과 보상 움직임으로 읽혀야 한다는 점이다. 이번 단위는 runtime 통합 전 단계로, prompt에 고정된 3개 PNG 후보를 실제 workspace raster로 생성하고 리뷰 evidence를 남긴다.

## Plan

1. `.env`의 `OPENAI_API_KEY`와 `SEED_ASSET_IMAGE_MODEL`을 사용해 기존 `npm run asset:generate:gpt-image` 경로로 아래 3개 asset만 생성한다.
2. 생성 결과를 `public/assets/game/facilities/`와 `public/assets/game/fx/`의 고정 output path에 저장하고 raw output/provenance를 남긴다.
3. 작은 크기 판독성, 텍스트/워터마크 부재, 기존 정원 asset style, FX strip metadata 적합성을 검수한다.
4. `assets/source/asset_generation_status.json`, `assets/source/gpt_image_asset_provenance.json`, `reports/assets/` review/contact-sheet evidence를 갱신한다.
5. 이번 PR에서는 generated 후보 리뷰까지 완료하고, manifest/runtime binding은 review 결과가 충분할 때만 같은 PR에 포함한다. 후보가 alpha/strip 품질에서 부족하면 manifest 통합은 후속 WorkUnit으로 분리한다.

## 대상 asset

- `facility_expedition_gate_v1` -> `public/assets/game/facilities/facility_expedition_gate_v1.png`
- `facility_expedition_return_crate_v1` -> `public/assets/game/facilities/facility_expedition_return_crate_v1.png`
- `fx_expedition_return_reward_strip_v1` -> `public/assets/game/fx/fx_expedition_return_reward_strip_v1.png`

## 수용 기준

- [x] 3개 output path가 모두 PNG workspace file로 존재한다.
- [x] `assets/source/gpt_image_asset_provenance.json`에 3개 asset의 provider/model/raw/accepted output 기록이 있다.
- [x] `assets/source/asset_generation_status.json`에 이번 issue batch가 `completed: 3`, `missing: []`, `blocked: false`로 기록된다.
- [x] review report가 각 asset의 style, small-size readability, text/watermark, background/alpha, manifest readiness를 판정한다.
- [x] runtime image generation/API/cache 의존이 없음을 검증한다.
- [x] Phaser runtime이 `facility_expedition_gate_v1`, `facility_expedition_return_crate_v1`, `fx_expedition_return_reward_strip_v1`를 preload/render한다.

## 검증 명령

- `npm run asset:generate:gpt-image -- --asset-id=facility_expedition_gate_v1 --force`
- `npm run asset:generate:gpt-image -- --asset-id=facility_expedition_return_crate_v1 --force`
- `npm run asset:generate:gpt-image -- --asset-id=fx_expedition_return_reward_strip_v1 --force`
- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:asset-alpha`
- `npm run check:topology-asset-plan`
- `npm run check:phaser`
- `git diff --check`

## 구현 evidence

- Transparent background 최초 요청은 `gpt-image-2` 제한으로 거부됐고, `SEED_ASSET_IMAGE_BACKGROUND=opaque`로 3개 후보를 생성했다.
- `scripts/postprocess-expedition-gate-assets.mjs`가 시설 alpha cleanup과 FX strict 8x96x96 normalization을 수행했다.
- `reports/assets/expedition_gate_asset_contact_sheet_20260508.png`
- `reports/assets/expedition_gate_asset_review_20260508.md`
- `reports/visual/issue-0494-expedition-gate-raster-review/visual-report-20260508.md`
- `npm run check:phaser` pass: expedition gate preview/traveling/returned/claimed screenshots 생성.

## 리스크

- `gpt-image-2`가 transparent background를 거부할 수 있다. 이 경우 `SEED_ASSET_IMAGE_BACKGROUND=opaque`로 재시도하고 alpha/background cleanup 필요를 review report에 남긴다.
- FX strip이 정확한 8프레임 96x96 layout으로 나오지 않을 수 있다. 실패하면 accepted manifest 등록 전 normalization 후속 WorkUnit으로 분리한다.
- 이미지 품질이 runtime prop으로 부족하면 후보 저장과 blocker evidence만 남기고 runtime binding을 하지 않는다.
