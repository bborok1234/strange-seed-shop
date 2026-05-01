# [P0.5] 온실 물길 점검 주문으로 강화 속도 쓰기

GitHub issue: #227
PR: #228

## 문제 / 배경

#224에서 `온실 물길` 강화가 열려 자동 생산률이 올랐지만, 강화된 생산 속도를 바로 쓰는 다음 주문 목표가 없다. 플레이어는 생산률 상승을 본 뒤 다시 납품/보상 루프로 이어지는 이유를 받아야 한다.

## 목표

`온실 물길` 완료 뒤 `온실 물길 점검` 주문을 열어, 강화된 자동 생산이 다음 납품 목표와 보상으로 이어지게 한다.

## Small win

플레이어가 `온실 물길` 구매 직후 “빨라진 정원으로 다음 점검 주문을 채운다”는 새 목표를 본다.

## Game Studio route

- `game-studio:game-studio`: 온실 물길 강화 -> 강화된 생산 -> 다음 주문 납품 vertical slice.
- `game-studio:web-game-foundations`: order chain 선택 조건과 save order progress 확장.
- `game-studio:game-ui-frontend`: 새 주문/완료 상태가 모바일 action surface와 bottom tab을 가리지 않게 한다.
- `game-studio:game-playtest`: Browser Use와 visual regression으로 구매 후 새 주문, 납품 가능/완료, 보상 저장을 확인한다.

## Plan

1. `온실 물길` 완료 뒤 현재 주문을 `온실 물길 점검`으로 전환하는 order definition을 추가한다.
2. 강화된 생산률로 새 주문 progress가 차고, 납품 시 잎/꽃가루/재료 보상이 지급되게 한다.
3. QA seed 경로에 `qaGreenhouseIrrigation=1`를 추가해 물길 완료 상태와 새 주문을 재현한다.
4. Browser Use와 visual regression으로 모바일 393px에서 주문 카드, 성장 선택, 하단 탭 가림이 없는지 확인한다.

## 플레이어 가치 또는 운영사 가치

플레이어 가치는 강화 구매가 숫자 상승으로 끝나지 않고 다음 납품 목표로 이어지는 production loop 명확성이다. 운영사 가치는 safe/small 작업 대신 #224 이후 production vertical slice를 계속 잇는 것이다.

## 수용 기준

- [x] `온실 물길` 완료 뒤 `온실 물길 점검` 주문이 현재 주문으로 보인다.
- [x] 강화된 자동 생산률로 새 주문 progress가 쌓인다.
- [x] 납품 시 잎/꽃가루/재료 보상이 save에 반영된다.
- [x] 모바일 393px에서 playfield, production card, order card, bottom tabs가 서로 가리지 않는다.
- [x] Browser Use `iab`, focused visual, full visual, CI가 통과한다.

## Visual evidence 계획

- Browser Use `iab`: `reports/visual/p0-greenhouse-irrigation-order-browser-use-20260501.png`
- Visual report: `reports/visual/p0-greenhouse-irrigation-order-v0-20260501.md`

## Playable mode 영향

- QA 경로: `/?qaOfflineMinutes=60&qaLunarGuardian=1&qaGreenhouseShelf=1&qaGreenhouseStorage=1&qaGreenhouseRoute=1&qaGreenhouseRouteSupply=1&qaGreenhouseIrrigation=1&qaReset=1`
- 확인 흐름: 복귀 보상 -> `온실 물길 점검` 주문 확인 -> 생산 수령 -> 주문 납품 -> 보상 저장 확인

## 안전 범위

- 신규 asset 생성 없음.
- runtime image generation 없음.
- 실제 결제, 광고, 외부 배포, credential, 고객 데이터 없음.

## 검증 명령

- Browser Use `iab`: PASS, `reports/visual/p0-greenhouse-irrigation-order-browser-use-20260501.png`
- Visual report: `reports/visual/p0-greenhouse-irrigation-order-v0-20260501.md`
- `npm run check:visual -- --grep "온실 물길 점검"`: PASS
- `npm run check:visual -- --grep "온실 물길 강화|온실 물길 점검"`: PASS
- `npm run check:visual`: PASS, 43 passed
- `npm run check:ci`: PASS

## 남은 위험

- PR checks에서 동일 gate를 재확인해야 한다.
