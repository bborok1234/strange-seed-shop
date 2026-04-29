# Production order FX runtime v0

Status: active
Issue: #135
Branch: `codex/0076-production-order-fx-runtime-v0`
Date: 2026-04-29

## Problem

#131/#132에서 P0.5 production/order FX strip 2개가 manifest-ready 상태가 됐지만, runtime에서는 아직 보이지 않는다. #133/#134로 work creature, order crate, celebrate state는 화면에 연결됐으므로 다음 작은 승리는 생산 수령/주문 납품 action feedback을 보이게 하는 것이다.

## Small win

첫 생산 수령과 첫 주문 납품 버튼을 누르면 기존 정적 FX strip이 정원 생산 UI 안에서 한 번 재생된다.

## Plan

1. `src/App.tsx`에서 생산 수령과 주문 납품 handler 직후 짧은 FX state를 기록한다.
2. manifest asset path를 사용해 `fx_production_tick_leaf_001_strip`, `fx_order_delivery_burst_001_strip`을 DOM overlay로 렌더링한다.
3. `src/styles.css`에 4-frame strip용 `steps()` animation과 모바일 밀도 안전값을 추가한다.
4. `tests/visual/p0-mobile-game-shell.spec.ts`가 production/order FX 노출과 bottom tab 겹침 회귀를 검증하게 한다.
5. Browser Use 우선 QA로 실제 클릭 후 FX 노출을 확인하고 `reports/visual/` evidence를 남긴다.
6. `npm run check:visual`, `npm run check:all`을 통과시킨다.

## Acceptance Criteria

- 생산 수령 클릭 후 `fx_production_tick_leaf_001_strip` 기반 FX가 한 번 보인다.
- 첫 주문 납품 클릭 후 `fx_order_delivery_burst_001_strip` 기반 FX가 한 번 보인다.
- 모바일 정원 첫 화면에서 next goal과 bottom tab overlap이 없다.
- runtime image generation, 새 dependency, 저장/content/economy 계약 변경이 없다.

## Verification Commands

- Browser Use in-app QA: `/?qaProductionReady=1`에서 생산 수령 -> 주문 납품 클릭 후 FX 확인
- `npm run check:visual`
- `npm run check:all`

## Risks

- 4-frame PNG strip을 DOM CSS animation으로 보여주면 Phaser playfield FX보다 연출 깊이는 제한된다. 이번 issue는 이미 생성된 asset을 action feedback으로 연결하는 runtime proof로 제한한다.
- FX overlay가 모바일 UI 밀도를 깨뜨릴 수 있으므로 visual gate에서 next goal/bottom tab 위치를 확인한다.

## Safety

- 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음
- `ENABLE_AGENT_AUTOMERGE` 변경 없음
- Branch protection 우회 없음
- runtime image generation 없음
- 새 dependency 설치 없음
