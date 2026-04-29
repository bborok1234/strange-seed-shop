# Core asset batch v0 plan

Status: review
Work type: game_content
Issue: #125
Owner: agent
Created: 2026-04-29
Updated: 2026-04-29
Scope-risk: narrow

## Intent

P0.5 idle core creative rescue에서 자동 생산과 첫 주문 루프가 생겼지만, 아직 생명체가 일하거나 납품을 축하하는 asset이 없다. 이번 issue는 이미지 생성 전에 필요한 core gameplay asset 계획과 prompt batch를 기존 asset source of truth에 추가한다.

## Small win

`assets/source/asset_plan.json`과 `assets/source/asset_prompts.json`이 P0.5 생산/주문 asset batch를 포함하고, 다음 issue가 바로 Codex native image generation으로 이어질 수 있다.

## Asset Target

- `creature_herb_common_001_work`: 말랑잎 포리 작업 상태
- `creature_herb_common_001_celebrate`: 말랑잎 포리 납품/보상 축하 상태
- `ui_order_crate_leaf_001`: 첫 잎 주문 상자
- `fx_production_tick_leaf_001`: 생산 tick FX
- `fx_order_delivery_burst_001`: 주문 납품 reward FX

## Plan

1. 기존 asset plan/prompts 구조를 보존하고 새 P0.5 batch asset만 추가한다.
2. 모든 output path는 기존 accepted asset을 덮어쓰지 않는 새 경로로 둔다.
3. 각 prompt는 투명 배경, 작은 크기 판독성, no text/no watermark/no logo를 포함한다.
4. 생성은 이번 issue에서 하지 않고, 후속 issue에서 `gpt-game-asset-generate` workflow로 진행한다.
5. JSON parse, id 중복, prompt/plan 일치 검증을 추가하거나 기존 명령으로 확인한다.
6. `docs/ROADMAP.md`, `docs/DASHBOARD.md`를 갱신한다.

## Acceptance Criteria

- P0.5 core asset 5개가 `assets/source/asset_plan.json`에 추가된다.
- 같은 5개가 `assets/source/asset_prompts.json`에 추가되고 prompt count가 asset count와 일치한다.
- 기존 accepted asset output path를 덮어쓰지 않는다.
- runtime image generation 경로를 추가하지 않는다.
- 다음 issue가 이미지 생성/검수/manifest 통합을 바로 시작할 수 있다.

## Verification

- `node -e` JSON parse/check
- `npm run check:content`
- `npm run check:asset-alpha`
- `npm run check:all`
- `npm run update:dashboard`
- `npm run check:dashboard`

## Risks

- `asset_plan.json`이 이미 milestone1 batch까지 포함하므로 무분별한 재작성은 이전 pipeline 증거를 흐릴 수 있다. 이번 변경은 append-only로 유지한다.
- 실제 생성 전이므로 `Core asset batch v0`는 아직 완료가 아니다. 생성/검수/manifest 통합은 후속 issue로 남긴다.

## Apply Conditions

- 기존 accepted asset 파일은 덮어쓰지 않는다.
- 새 dependency를 추가하지 않는다.
- 런타임 이미지 생성, 결제, 로그인, 광고, 외부 배포는 금지한다.

## Evidence

- Issue: #125
- Branch: `codex/0071-core-asset-batch-plan`
- Asset plan count: 31
- Prompt count: 31
- Added asset ids:
  - `creature_herb_common_001_work`
  - `creature_herb_common_001_celebrate`
  - `ui_order_crate_leaf_001`
  - `fx_production_tick_leaf_001`
  - `fx_order_delivery_burst_001`
- Verification:
  - `node -e` JSON parse/id/prompt/path check — pass
  - `npm run check:all` — pass
