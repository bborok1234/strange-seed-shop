# Greenhouse facility order v0

Status: active
Branch: `codex/0110-greenhouse-facility-order-v0`
Issue: #203

## Context

#200에서 작업대 강화가 첫 `온실 설비` 목표와 생산률 상승으로 이어졌다. 하지만 설비 완료 후에는 생산률만 오르고, 새 생산량을 어디에 쓰는지 주문/납품 반복성이 약하다. 다음 vertical slice는 온실 설비 완료 후 새 `온실 선반 납품` 주문을 열어, 설비가 단순 업그레이드가 아니라 다음 납품 루프를 만드는 시설로 읽히게 한다.

## Game Studio route

- `game-studio:game-studio`: 온실 설비 완료 -> 새 설비 주문 -> 납품 보상 vertical slice.
- `game-studio:web-game-foundations`: order unlock 조건을 save progression과 분리해 기존 첫/두 번째 주문을 보존한다.
- `game-studio:game-ui-frontend`: production/order card가 새 주문을 보여도 모바일 action surface와 bottom tabs를 가리지 않는다.
- `game-studio:game-playtest`: Browser Use와 visual test로 설비 후 주문 수령/납품 흐름을 확인한다.

## Vertical slice scoring

- `player verb`: 설비를 설치한 뒤 새 온실 주문을 채우고 납품한다.
- `production/progression role`: 시설 업그레이드가 주문/납품 반복성으로 되돌아온다.
- `screen moment`: 정원 생산 카드가 `온실 선반 납품` 진행률과 보상을 보여준다.
- `asset/FX`: 기존 order crate와 order delivery FX를 재사용한다. 신규 asset 생성 없음.
- `playtest evidence`: Browser Use `iab`, focused visual, full visual, CI.

## Plan

1. `ORDER_DEFINITIONS`에 온실 설비 후 열리는 third order를 추가한다.
2. `getCurrentOrder`가 설비 완료 전에는 기존 두 주문을 보존하고, 설비 완료 후 third order를 선택하게 한다.
3. 납품 보상에 재료를 포함할 수 있게 order reward 표시와 저장 반영을 확장한다.
4. `qaResearchExpeditionClaimReady=1` 흐름에서 작업대/설비 완료 후 새 주문 납품까지 visual regression을 추가한다.
5. Browser Use evidence와 roadmap/dashboard/GitHub evidence를 갱신한다.

## Acceptance

- [x] 온실 설비 완료 후 생산 카드에 `온실 선반 납품` 주문이 등장한다.
- [x] 생산 잎 수령이 새 주문 진행률을 채우고, 준비되면 `주문 납품` CTA가 활성화된다.
- [x] 납품 보상은 잎/꽃가루/재료를 save에 반영하고 완료 상태로 남는다.
- [x] 모바일 393px에서 body scroll, bottom tab overlap, visible child overflow가 없다.
- [x] Browser Use `iab`, focused visual, full visual, CI가 통과한다.

## Evidence

- Browser Use `iab`: `reports/visual/p0-greenhouse-facility-order-browser-use-20260430.png`
- Visual report: `reports/visual/p0-greenhouse-facility-order-v0-20260430.md`
- Focused visual: `npm run check:visual -- --grep "새 납품"` PASS
- Regression visual: `npm run check:visual -- --grep "온실 설비"` PASS
- Full visual: `npm run check:visual` PASS, 35 passed
- CI: `npm run check:ci` PASS

## Risks

- 기존 두 주문/research unlock 회귀 위험이 있다. 기존 full visual suite를 반드시 유지한다.
- 주문 보상 표시가 길어져 mobile card가 잘릴 수 있다. reward copy를 compact하게 제한한다.
