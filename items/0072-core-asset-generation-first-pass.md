# Core asset generation first pass

Status: review
Work type: game_content
Issue: #127
Owner: agent
Created: 2026-04-29
Updated: 2026-04-29
Scope-risk: moderate

## Intent

#126에서 P0.5 생산/주문 asset plan과 prompts가 준비되었다. 이번 issue는 Codex native image generation으로 실제 workspace asset을 만들고, 생성 상태와 검수 결과를 남겨 runtime이 정적 asset만 사용하도록 이어간다.

## Small win

최소 첫 gameplay-facing asset을 생성해 `public/assets/game/...` 경로에 저장하고, `assets/source/asset_generation_status.json` 또는 별도 status에 누락/완료/blocked 상태를 기록한다.

## Plan

1. `assets/source/asset_prompts.json`에서 P0.5 asset ids 5개를 확인한다.
2. 기존 output path가 존재하면 건너뛰고, 존재하지 않는 asset만 생성 대상으로 잡는다.
3. built-in Codex image generation을 asset별로 한 번씩 실행한다.
4. 생성 결과를 `$CODEX_HOME/generated_images/...`에서 workspace `output_path`로 이동/복사한다.
5. 투명 배경이 필요한 asset은 built-in chroma-key + local removal 경로를 우선한다.
6. 작은 크기 판독성, text/watermark/logo 없음, 기존 accepted asset overwrite 없음 여부를 검수한다.
7. 완료/누락/blocked를 status JSON과 item evidence에 기록한다.

## Acceptance Criteria

- 생성 또는 blocker 상태가 asset id별로 기록된다.
- 생성된 asset은 Codex cache가 아니라 workspace `public/assets/game/...` 아래에 저장된다.
- 기존 accepted asset을 덮어쓰지 않는다.
- runtime image generation 경로를 추가하지 않는다.
- 생성 완료 asset은 manifest integration 전 단계로 검수 가능하다.

## Verification

- `node -e` P0.5 asset output path existence/status check
- `npm run check:content`
- `npm run check:asset-alpha`
- `npm run check:all` when workspace assets are added

## Risks

- built-in image generation 산출물을 현재 Codex App surface에서 파일 경로로 회수하지 못하면 생성이 blocked될 수 있다. 이 경우 CLI fallback은 `OPENAI_API_KEY`와 명시 승인이 필요하므로 자동 전환하지 않는다.
- true native transparency가 필요하면 built-in chroma-key 제거가 실패할 수 있다. 실패 시 fallback 여부는 별도 승인 대상으로 남긴다.

## Apply Conditions

- 기존 accepted asset overwrite 금지.
- 새 dependency 추가 금지.
- CLI/API fallback은 사용자가 명시하지 않았으므로 사용하지 않는다.
- 결제, 로그인, 광고, 외부 배포, 고객 데이터는 건드리지 않는다.

## Evidence

- Issue: #127
- Branch: `codex/0072-core-asset-generation-first-pass`
- Generated workspace assets:
  - `public/assets/game/creatures/states/creature_herb_common_001_work.png`
  - `public/assets/game/creatures/states/creature_herb_common_001_celebrate.png`
  - `public/assets/game/ui/ui_order_crate_leaf_001.png`
  - `public/assets/game/fx/fx_production_tick_leaf_001_strip.png`
  - `public/assets/game/fx/fx_order_delivery_burst_001_strip.png`
- Generation ledger: `assets/source/asset_generation_status.json`
- Review report: `reports/assets/p0-core-asset-generation-first-pass-20260429.md`
- Contact sheet: `reports/assets/p0-core-asset-generation-first-pass-20260429.png`
- Plan note: FX strips are candidate assets and need normalization before manifest/runtime integration.
- Verification:
  - P0.5 asset existence/status/alpha check PASS
  - `npm run check:content` PASS
  - `npm run check:asset-alpha` PASS
  - `npm run check:dashboard` PASS
  - `npm run check:all` PASS
