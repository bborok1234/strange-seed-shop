# [P0.5] 온실 동선 순환 주문으로 3번 밭 생산 쓰기

## 문제 / 배경

#218에서 3번 밭을 열었지만, 개방 직후 주문 루프는 `온실 확장 준비` 완료 상태에 머문다. 열린 3번 밭이 production loop에 쓰이는 장면이 필요하다.

## 목표

`온실 동선` 완료 뒤 `3번 밭 순환 납품` 주문을 열어, 확장된 밭 용량이 더 큰 주문 진행률과 보상으로 이어지게 한다.

## Small win

플레이어가 3번 밭을 열자마자 “이제 더 큰 납품을 돌릴 수 있다”는 다음 목표를 본다.

## Game Studio route

- `game-studio:game-studio`: 3번 밭 개방 -> 확장 밭 순환 주문 -> 납품 보상 vertical slice.
- `game-studio:web-game-foundations`: 주문 정의와 save order progress를 기존 `idleProduction` 안에서 확장.
- `game-studio:game-ui-frontend`: 3열 playfield와 주문 UI 밀도 보호.
- `game-studio:game-playtest`: Browser Use와 visual regression evidence.

## Plan

1. `GREENHOUSE_ROUTE_SUPPLY_ORDER`를 추가한다.
2. `greenhouseRouteLevel >= 1`이고 순환 주문이 미완료이면 current order를 새 주문으로 전환한다.
3. route QA save에서 새 주문 진행 상태를 재현한다.
4. visual/Browser Use evidence로 모바일 가림과 완료 보상 상태를 확인한다.

## 플레이어 가치 또는 운영사 가치

플레이어 가치는 확장 보상이 다음 주문 목표로 이어지는 생산 loop 명확성이다. 운영사 가치는 #218 이후 다음 issue가 작은 polish가 아니라 production idle vertical slice를 이어간다는 점이다.

## 수용 기준

- [x] `온실 동선` 완료 뒤 현재 주문이 `3번 밭 순환 납품`으로 전환된다.
- [x] `생산 잎 수령`으로 새 주문 진행률이 90/90까지 찬다.
- [x] 납품하면 보상 `+110 잎 · +4 꽃가루 · +1 재료`가 지급되고 완료 상태가 보인다.
- [x] 모바일 393px에서 3열 playfield, production card, action surface, bottom tabs가 서로 가리지 않는다.
- [x] Browser Use `iab`, focused visual, full visual, CI가 통과한다.

## Visual evidence 계획

- Browser Use `iab`: `reports/visual/p0-greenhouse-route-supply-order-browser-use-20260430.png`
- Visual report: `reports/visual/p0-greenhouse-route-supply-order-v0-20260430.md`

## Playable mode 영향

- QA 경로: `/?qaOfflineMinutes=60&qaLunarGuardian=1&qaGreenhouseShelf=1&qaGreenhouseStorage=1&qaGreenhouseRoute=1&qaReset=1`
- 확인 흐름: 복귀 보상 -> `생산 잎 수령` -> `3번 밭 순환 납품` 납품 -> 완료 상태 확인

## 안전 범위

- 신규 asset 생성 없음.
- runtime image generation 없음.
- 실제 결제, 광고, 외부 배포, credential, 고객 데이터 없음.

## 검증 명령

- Browser Use `iab`: PASS, `reports/visual/p0-greenhouse-route-supply-order-browser-use-20260430.png`
- Visual report: `reports/visual/p0-greenhouse-route-supply-order-v0-20260430.md`
- `npm run check:visual -- --grep "온실 동선 순환 주문"`: PASS
- `npm run check:visual -- --grep "온실 동선 확장|온실 동선 순환 주문"`: PASS
- `npm run check:visual`: PASS, 41 passed
- `npm run check:ci`: PASS

## 남은 위험

- PR checks에서 동일 gate를 재확인해야 한다.
