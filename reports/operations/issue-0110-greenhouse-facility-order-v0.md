# [P0.5] 온실 설비 완료 뒤 새 납품 주문 열기

## 요약

첫 온실 설비를 설치한 뒤 정원 생산 카드에 `온실 선반 납품` 주문을 열어, 설비가 생산률 상승에서 끝나지 않고 새 납품 반복성으로 이어지게 만든다.

## Small win

플레이어가 설비 설치 후 늘어난 생산량을 바로 새 주문에 써서 다시 보상을 받는다.

## 사용자/운영자 가치

게임 가치는 시설 업그레이드가 주문/납품 루프를 다시 여는 데 있다. 운영 가치는 `player verb + progression role + screen moment + playtest evidence`가 있는 vertical slice를 이어간다는 점이다.

## Game Studio route

- `game-studio:game-studio`: 온실 설비 완료 -> 새 설비 주문 -> 납품 보상 vertical slice.
- `game-studio:web-game-foundations`: order unlock 조건과 save progression 유지.
- `game-studio:game-ui-frontend`: 모바일 production/order card 보호.
- `game-studio:game-playtest`: Browser Use와 visual regression evidence.

## 수용 기준

- [x] 온실 설비 완료 후 생산 카드에 `온실 선반 납품` 주문이 등장한다.
- [x] 생산 잎 수령이 새 주문 진행률을 채우고, 준비되면 `주문 납품` CTA가 활성화된다.
- [x] 납품 보상은 잎/꽃가루/재료를 save에 반영하고 완료 상태로 남는다.
- [x] 모바일 393px에서 body scroll, bottom tab overlap, visible child overflow가 없다.
- [x] Browser Use `iab`, focused visual, full visual, CI가 통과한다.

## 검증 계획

- Browser Use `iab`: 작업대 강화 -> 온실 설비 -> 생산 수령 -> `온실 선반 납품` 납품 화면 확인. Evidence: `reports/visual/p0-greenhouse-facility-order-browser-use-20260430.png`
- `npm run check:visual -- --grep "새 납품"` PASS
- `npm run check:visual -- --grep "온실 설비"` PASS
- `npm run check:visual` PASS, 35 passed
- `npm run check:ci` PASS

## 안전 범위

- 신규 asset 생성 없음.
- runtime image generation 없음.
- 실제 결제, 광고, 외부 배포, credential, 고객 데이터 없음.

## 남은 위험

- GitHub PR checks에서 동일 gate를 재확인한다.
