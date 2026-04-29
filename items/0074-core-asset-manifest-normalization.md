# Core asset manifest normalization

Status: review
Work type: game_content
Issue: #131
Owner: agent
Created: 2026-04-29
Updated: 2026-04-29
Scope-risk: moderate

## Intent

#127/#130에서 P0.5 production/order asset 후보 5개가 workspace static PNG로 생성됐다. 이번 issue는 후보를 runtime 연결 전 catalog 단계로 올리기 위해 manifest metadata와 FX strip slicing 기준을 정리한다.

## Small win

첫 생산/주문 asset 5개가 `assetManifest.json`에서 추적되고, FX strip 2개는 실제 PNG dimensions와 frame metadata가 일치하는 normalized strip으로 정리된다.

## Plan

1. `asset_generation_status.json`의 P0.5 batch 5개 output path와 dimensions를 확인한다.
2. FX strip 2개를 4-frame slicing 가능한 normalized PNG로 재저장한다.
3. `public/assets/manifest/assetManifest.json`에 creature state 2개, order crate 1개, FX strip 2개 entry를 추가한다.
4. report/contact sheet를 갱신하거나 새 review report를 남긴다.
5. `npm run check:content`, `npm run check:asset-alpha`, `npm run check:asset-normalization`, `npm run check:all`로 검증한다.

## Acceptance Criteria

- P0.5 asset 5개가 manifest에서 추적된다.
- FX strip 2개는 `frames`, `frameWidth`, `frameHeight`, PNG dimensions가 서로 맞는다.
- runtime image generation은 계속 금지된다.
- `npm run check:all`이 통과한다.

## Verification

- `npm run check:content`
- `npm run check:asset-alpha`
- `npm run check:asset-normalization`
- `npm run check:all`

## Risks

- FX strip glow가 normalization 과정에서 일부 줄어들 수 있다. 이번 목표는 runtime-safe slicing이고, 최종 연출 품질은 후속 Browser Use runtime 연결 PR에서 확인한다.
- manifest 등록만 하고 실제 화면 연결은 하지 않는다. UI 연결은 별도 issue에서 Browser Use QA와 함께 진행한다.

## Apply Conditions

- Runtime image generation 금지.
- 기존 accepted asset overwrite 금지.
- 새 dependency 추가 금지.
- 결제, 로그인, 광고, 외부 배포, 고객 데이터, credential 변경 없음.

## Evidence

- Issue: #131
- Branch: `codex/0074-core-asset-manifest-normalization`
- Manifest entries:
  - `creature_herb_common_001_work`
  - `creature_herb_common_001_celebrate`
  - `ui_order_crate_leaf_001`
  - `fx_production_tick_leaf_001`
  - `fx_order_delivery_burst_001`
- Review report: `reports/assets/p0-core-asset-manifest-normalization-20260429.md`
- Contact sheet: `reports/assets/p0-core-asset-manifest-normalization-20260429.png`
- Verification:
  - `npm run check:content` PASS
  - `npm run check:asset-alpha` PASS
  - `npm run check:asset-normalization` PASS
  - `npm run check:dashboard` PASS
  - `npm run check:all` PASS
