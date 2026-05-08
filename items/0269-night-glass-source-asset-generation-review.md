# 밤유리 source icon/FX generation-review

## 상태

- Status: review
- Game Studio route: `game-studio:game-studio -> game-studio:sprite-pipeline -> game-studio:game-ui-frontend -> game-studio:phaser-2d-game -> game-studio:game-playtest`
- GitHub issue: #506
- Branch: `codex/v1-night-glass-source-asset-generation`
- 연결: Issue #504, PR #505, main CI `25544082346`

## 배경

#504에서 `seed_rare_001_icon`과 `fx_night_glass_source_unlock_strip_v1` plan/prompt가 generation-ready로 들어갔다. 하지만 PNG 후보가 없으면 #502/#503의 `밤유리 source` preview는 계속 accepted creature silhouette stand-in에 머문다.

경쟁작 production gap은 rare route가 장기 목표로 제시될 때 보상 물성의 핵심인 source icon과 unlock FX가 실제 raster 후보로 보이지 않으면 placeholder promise처럼 읽힌다는 점이다. 이번 slice는 전용 PNG 후보를 생성하고 review evidence를 남겨 후속 manifest/runtime binding이 같은 asset id와 provenance를 사용할 수 있게 한다.

## Plan

1. `seed_rare_001_icon`을 `gpt-image-2` pipeline으로 생성해 `public/assets/game/seeds/seed_rare_001_icon.png`에 저장한다.
2. `fx_night_glass_source_unlock_strip_v1`을 `gpt-image-2` pipeline으로 생성해 `public/assets/game/fx/fx_night_glass_source_unlock_strip_v1.png`에 저장한다.
3. 생성 결과를 inspect하고, 필요하면 배경/크기/strip normalization blocker를 review report에 명시한다.
4. `assets/source/gpt_image_asset_provenance.json`과 `assets/source/asset_generation_status.json`에 batch evidence를 남긴다.
5. `reports/assets/night_glass_source_asset_review_20260508.md`와 contact sheet를 만든다.
6. 이번 PR은 generation/review까지만 수행한다. manifest acceptance와 Phaser runtime binding은 후속 WorkUnit으로 분리한다.

## 수용 기준

- 두 output PNG가 workspace에 존재하고 비어 있지 않다.
- provenance record가 두 asset id, provider/model, raw output, accepted output path를 기록한다.
- review report가 small-size readability, background/alpha risk, strip/frame risk, manifest readiness 판정을 남긴다.
- `asset_generation_status.json`에 `issue_0506_night_glass_source_asset_generation_review` batch가 기록된다.
- `npm run check:asset-provenance`, `npm run check:asset-style`, `npm run check:ci`, `git diff --check`가 통과한다.
- Browser Use hands-on QA는 runtime 화면 변경이 아니므로 N/A 사유를 PR에 남긴다.

## Department Scorecard

| 부서 | 판정 | 근거 |
| --- | --- | --- |
| 기획팀 | approve | `밤유리 source 보기`가 다음 rare route 보상물로 읽히기 위한 source icon/FX 후보를 만든다. |
| 리서치팀 | approve | 경쟁작 rare unlock은 source icon과 reveal/unlock FX로 장기 목표의 물성을 고정한다. |
| 아트팀 | approve | dedicated rare seed icon 1개와 unlock FX strip 1개를 gpt-image-2 provenance로 생성/검토한다. |
| 개발팀 | approve | runtime binding 전 generation/review만 수행해 rollback boundary가 파일 추가와 provenance 갱신으로 좁다. |
| 검수팀 | approve | 이미지 파일 존재, provenance/style/CI, review report로 후보 품질과 후속 blocker를 판정한다. |
| 마케팅팀 | approve | 내부 playable promise이며 외부 채널/실결제/광고 없음. |
| 고객지원팀 | approve | 플레이어가 밤유리 route를 placeholder가 아니라 다음 unlock 목표로 이해하도록 시각 후보를 준비한다. |

## Subagent/Team Routing

- Solo execute. 생성 대상이 2개이고 pipeline/check/report가 선형이라 병렬 agent보다 단일 owner가 provenance와 review 일관성을 보장한다.

## 검증 명령

- `npm run asset:generate:gpt-image -- --asset-id=seed_rare_001_icon`
- `npm run asset:generate:gpt-image -- --asset-id=fx_night_glass_source_unlock_strip_v1`
- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:ci`
- `git diff --check`

## 구현 Evidence

- `SEED_ASSET_IMAGE_BACKGROUND=opaque npm run asset:generate:gpt-image -- --asset-id=seed_rare_001_icon`로 `public/assets/game/seeds/seed_rare_001_icon.png` 후보를 생성했다.
- `SEED_ASSET_IMAGE_BACKGROUND=opaque npm run asset:generate:gpt-image -- --asset-id=fx_night_glass_source_unlock_strip_v1`로 `public/assets/game/fx/fx_night_glass_source_unlock_strip_v1.png` 후보를 생성했다.
- `node scripts/postprocess-night-glass-source-assets.mjs`로 checkerboard background를 edge-connected alpha cleanup하고, FX를 `768x96` strict 8-frame strip으로 정규화했다.
- `assets/source/gpt_image_asset_provenance.json`에 두 asset의 `openai_images_api` / `gpt-image-2` record, raw output, accepted output, post_processing evidence가 기록됐다.
- `assets/source/asset_generation_status.json`에 `issue_0506_night_glass_source_asset_generation_review` batch가 기록됐다.
- `reports/assets/night_glass_source_asset_contact_sheet_20260508.png`와 `reports/assets/night_glass_source_asset_review_20260508.md`를 남겼다.
- Browser Use: runtime 화면 변경이 아닌 asset candidate generation/review slice라 N/A. 후속 Phaser runtime binding에서 Browser Use 또는 blocker+Playwright visual QA를 수행한다.

## 리스크

- `gpt-image-2`는 `transparent` 대신 `opaque`로 생성했고, checkerboard는 후처리로 alpha cleanup했다. 후속 manifest/runtime binding 전 small-size visual QA와 Phaser rendering 검수가 필요하다.
- 이번 slice는 runtime 화면을 바꾸지 않는다. Browser Use QA와 Phaser screenshot은 후속 runtime binding PR에서 수행한다.
