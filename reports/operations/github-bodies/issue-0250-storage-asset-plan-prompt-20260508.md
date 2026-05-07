# 보관 바구니 전용 raster와 회수 FX plan-prompt 만들기

## 문제 / 배경

#465까지 보관 바구니는 unlock, fill, claim, reward motion까지 gameplay verb가 연결됐지만, 전용 storage prop과 전용 claim FX 후보가 아직 asset pipeline에 없다. v1 storage/offline reward loop가 production asset으로 넘어가려면 generation-ready plan/prompt가 먼저 필요하다.

## 목표

`facility_storage_basket_v1`과 `fx_storage_claim_leaf_flyout_strip_v1`을 static raster/FX strip asset plan-prompt에 추가한다.

## Small win

다음 asset generation WorkUnit이 보관 바구니 전용 PNG와 storage claim FX strip을 바로 생성할 수 있다.

## Campaign source of truth

- `docs/GAME_BIBLE.md`
- `docs/GAME_PRODUCTION_SPEC.md`
- `docs/phaser/REBOOT_FOUNDATION_SPEC.md`
- `items/0250-storage-asset-plan-prompt.md`

## Game Studio Department Signoff

| 부서 | 판정 | 근거 |
| --- | --- | --- |
| 기획팀 | approve | storage/offline reward verb가 고유 facility identity로 이어진다. |
| 리서치팀 | approve | 경쟁 idle game은 facility silhouette와 claim motion으로 기능을 즉시 구분한다. |
| 아트팀 | approve | PNG raster와 horizontal FX strip만 계획하고 SVG/vector/code-native game graphics를 금지한다. |
| 개발팀 | approve | asset plan/prompt JSON만 수정하며 runtime behavior는 바꾸지 않는다. |
| 검수팀 | approve | topology/asset provenance/style/CI gate로 generation-ready 계약을 검증한다. |
| 마케팅팀 | approve | mock/local asset pipeline만 다루며 외부 채널이나 결제를 건드리지 않는다. |
| 고객지원팀 | approve | 보관 바구니와 주문 상자 혼동 위험을 줄인다. |

## Subagent/Team Routing

Solo execute. 변경 범위가 asset plan/prompt와 운영 문서로 좁고, 병렬 subagent가 독립 증거를 만들 만큼 분리된 구현 lane이 없다.

## 플레이어 가치

보관 바구니가 숫자 HUD가 아니라 고유한 playfield object와 claim FX 후보로 읽히게 되어, 오프라인 보상 loop가 더 명확해진다.

## 수용 기준

- `assets/source/asset_plan.json`에 `facility_storage_basket_v1`이 PNG output path와 storage/facility tags로 추가된다.
- `assets/source/asset_plan.json`에 `fx_storage_claim_leaf_flyout_strip_v1`이 frame count, frame size, intended fps, `animation.binding`과 함께 추가된다.
- `assets/source/asset_prompts.json`에 두 asset의 generation prompt와 acceptance checks가 추가된다.
- prompt count와 plan count가 같고, 새 prompts는 runtime generation을 요구하지 않는다.
- `npm run check:topology-asset-plan`, `npm run check:asset-provenance`, `npm run check:asset-style`, `npm run check:ci`가 통과한다.

## Visual evidence 계획

N/A — 이번 WorkUnit은 runtime UI/visual 변경 없이 asset plan/prompt만 추가한다. 다음 generated asset/runtime integration WorkUnit에서 Browser Use 또는 명시 blocker + Playwright fallback evidence를 남긴다.

## Playable mode 영향

없음. runtime gameplay와 save data를 변경하지 않는다.

## 안전 범위

- runtime image generation/API/cache 호출 없음
- real payment/ads/deployment/customer data 없음
- SVG/vector/code-native game graphics 계획 없음
- asset generation 실행은 다음 WorkUnit으로 분리

## 검증 명령

- `npm run check:topology-asset-plan`
- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:ci`
- `npm run check:control-room`
- `npm run check:ops-live`
