# 0237 Topology asset generation and review

## Problem

#440은 Phaser v1 garden board foundation에 필요한 topology asset plan/prompt batch를 고정했다. 하지만 실제 게임 화면은 아직 shape placeholder에 의존한다. v1 playable이 "게임 장면"으로 읽히려면 terrain, plot state, facility, actor, FX 후보 PNG를 생성하고, provenance와 style gate를 통과시키며, manifest/runtime 투입 가능 여부를 명확히 판정해야 한다.

## Goal

`gpt-image-2` 또는 Codex native image generation provenance를 가진 topology foundation PNG 14개를 생성하고, 리뷰 결과와 후속 runtime integration 기준을 남긴다.

필수 생성 후보:

- `bg_garden_terrain_open_v1`
- `tile_plot_empty_v1`
- `tile_plot_sprout_v1`
- `tile_plot_growing_v1`
- `tile_plot_ready_v1`
- `tile_plot_locked_preview_v1`
- `facility_workbench_v1`
- `facility_order_crate_empty_v1`
- `facility_order_crate_filled_v1`
- `actor_pori_caretaker_strip_v1`
- `actor_momo_carrier_strip_v1`
- `fx_care_spark_strip_v1`
- `fx_harvest_leaf_flyout_strip_v1`
- `ui_shadow_soft_v1`

## Game Studio Route

- `game-studio:game-studio`: #440 이후 v1 visual payoff WorkUnit 선택
- `game-studio:sprite-pipeline`: actor/FX strip readability, frame metadata, binding readiness
- `game-studio:game-ui-frontend`: plot/facility state small-size readability
- `game-studio:game-playtest`: runtime integration 이후 first screen/HUD/playfield obstruction evidence

## Department Scorecard

| 부서 | 판정 | 근거 artifact |
| --- | --- | --- |
| 기획팀 | approve | #433 foundation의 placeholder art를 실제 first 5m plot/order/worker read로 교체하기 위한 prerequisite다. |
| 리서치팀 | approve | 경쟁 idle core는 plot/facility/worker state가 텍스트 없이도 즉시 읽힌다. 이번 WorkUnit은 그 production gap을 줄인다. |
| 아트팀 | caution | `gpt-image-2`가 transparent background를 거부해 opaque로 생성한다. 투입 전 알파/배경/strip 구조를 리뷰해야 한다. |
| 개발팀 | approve | Runtime image API 호출 없이 workspace PNG와 provenance만 추가한다. |
| 검수팀 | approve | existence, provenance, style, alpha, manifest readiness를 분리 검증한다. |
| 마케팅팀 | approve | 외부 채널/실결제/광고 없음. |
| 고객지원팀 | approve | visual state가 명확해지면 첫 플레이 혼란을 줄일 수 있다. |

## Self-Evaluation Loop

Claim: topology foundation 후보 PNG 14개가 workspace에 존재하고 provenance가 남아 있으며, runtime integration 전 필요한 asset-review 결론이 문서화되어 있다.

Smallest verifier:

- expected output path 14개 존재 확인
- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:asset-alpha`
- image review report

Rubric:

| 항목 | 통과 기준 |
| --- | --- |
| coverage | 14개 필수 후보 PNG가 모두 존재 |
| provenance | `gpt_image_asset_provenance.json`에 provider/model/raw/accepted path 기록 |
| style | accepted style gate 통과 또는 reject 사유 기록 |
| runtime separation | runtime이 image generation/API/cache에 의존하지 않음 |
| manifest readiness | 바로 accepted 가능/후처리 필요/재생성 필요를 asset별로 판정 |

Artifact path:

- `public/assets/game/**`
- `assets/source/generated/gpt-image/**`
- `assets/source/gpt_image_asset_provenance.json`
- `reports/assets/topology_asset_review_20260508.md`

Stop condition:

- 생성/리뷰/gate evidence가 남고 GitHub issue/PR까지 연결되거나, image API quota/access/quality blocker가 더 이상 local continuation으로 복구 불가능할 때.

## Plan

1. GitHub issue를 생성한다.
2. 14개 topology 후보 PNG를 생성한다.
3. generated raw PNG와 accepted workspace PNG 존재 여부를 확인한다.
4. provenance/style/alpha gate를 실행한다.
5. asset review report를 작성하고 runtime integration 가능 범위를 판정한다.
6. Roadmap/control room/dashboard/heartbeat를 갱신한다.

## Acceptance Criteria

- 14개 topology 후보 PNG가 `public/assets/game/**` 경로에 존재한다.
- `assets/source/gpt_image_asset_provenance.json`에 14개 후보의 `openai_images_api`/`gpt-image-2` provenance가 기록된다.
- `gpt-image-2` transparent background 미지원으로 인한 opaque 생성 제약이 review report에 기록된다.
- actor/FX 후보는 sprite strip으로 쓰기 적합한지 또는 재생성/후처리 필요 여부가 기록된다.
- runtime generation/API dependency가 없음을 검증한다.

## Verification Commands

- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:asset-alpha`
- `npm run check:ci`

## Browser Use

이번 WorkUnit은 static asset generation/review다. Browser Use evidence는 다음 runtime integration/playtest WorkUnit에서 first screen과 motion evidence로 요구한다. Browser Use 도구가 현재 노출되지 않으면 blocker를 보고하고 Playwright fallback 근거를 남긴다.

## GitHub

- Issue: https://github.com/bborok1234/strange-seed-shop/issues/442
- Draft PR: pending

## Evidence

- `npm run asset:generate:gpt-image -- --asset-id=bg_garden_terrain_open_v1` with default transparent background — blocked, `transparent background is not supported for this model.`
- `SEED_ASSET_IMAGE_BACKGROUND=opaque npm run asset:generate:gpt-image -- --asset-id=<14 topology ids>` — pass, 14 PNG candidates saved
- `reports/assets/topology_asset_contact_sheet_20260508.png` — visual contact sheet
- `reports/assets/topology_asset_review_20260508.md` — review report, non-background candidates require alpha/background cleanup or sprite normalization before manifest use
- `npm run check:topology-generated-assets` — pass
- `npm run check:asset-provenance` — pass
- `npm run check:asset-style` — pass
- `npm run check:asset-alpha` — pass
- `npm run check:ci` — pass
- Issue checkpoint comment: https://github.com/bborok1234/strange-seed-shop/issues/442#issuecomment-4399445914
