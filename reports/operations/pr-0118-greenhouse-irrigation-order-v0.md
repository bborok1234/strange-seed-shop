# 온실 물길 점검 주문으로 강화 속도 쓰기

## 요약

`온실 물길` 완료 뒤 `온실 물길 점검` 주문을 열어, +15% 자동 생산률이 다음 납품 목표와 보상으로 이어지게 했습니다.

## Small win

물길 강화가 숫자 상승으로 끝나지 않고, 빨라진 생산을 바로 새 점검 주문에 쓰는 장면이 생겼습니다.

## Plan-first evidence

- Issue: #227
- Item: `items/0118-greenhouse-irrigation-order-v0.md`
- Game Studio route: `game-studio:game-studio`, `game-studio:web-game-foundations`, `game-studio:game-ui-frontend`, `game-studio:game-playtest`

## 사용자/운영자 가치

플레이어는 강화 구매 직후 다음 주문 목표와 납품 보상을 보며 production loop가 계속된다는 신호를 받습니다. 운영 측면에서는 #224 이후에도 작은 polish가 아니라 vertical slice 기준으로 다음 issue를 선택했습니다.

## Before / After 또는 Visual evidence

- Before: `온실 물길` 완료 뒤 강화된 생산률을 바로 쓰는 다음 주문 목표가 없었습니다.
- After: `온실 물길 점검` 주문이 열리고, 생산 수령 후 `+135 잎 · +3 꽃가루 · +1 재료` 납품 보상이 지급됩니다.
- Browser Use evidence: `reports/visual/p0-greenhouse-irrigation-order-browser-use-20260501.png`
- Visual report: `reports/visual/p0-greenhouse-irrigation-order-v0-20260501.md`

## Playable mode

- QA 경로: `/?qaOfflineMinutes=60&qaLunarGuardian=1&qaGreenhouseShelf=1&qaGreenhouseStorage=1&qaGreenhouseRoute=1&qaGreenhouseRouteSupply=1&qaGreenhouseIrrigation=1&qaReset=1`
- 확인 흐름: 복귀 보상 -> `온실 물길 점검` 주문 확인 -> 생산 수령 -> 주문 납품 -> 보상 저장 확인

## 검증

- Browser Use `iab`: PASS
- `npm run check:visual -- --grep "온실 물길 점검"`: PASS
- `npm run check:visual -- --grep "온실 물길 강화|온실 물길 점검"`: PASS
- `npm run check:visual`: PASS, 43 passed
- `npm run check:ci`: PASS

## 안전 범위

- 신규 asset 생성 없음.
- runtime image generation 없음.
- 실제 결제, 광고, 외부 배포, credential, 고객 데이터 없음.
- save schema 추가 없음. 기존 `idleProduction.orderProgress/completedOrderIds`만 사용합니다.

## 작업 checklist

- [x] Game Studio route 기록
- [x] plan-first item 작성
- [x] Browser Use 우선 QA evidence 저장
- [x] visual regression 추가
- [x] #224 온실 물길 강화 회귀 확인
- [x] full visual/CI 통과
- [x] roadmap/dashboard evidence 갱신

## 남은 위험

- PR checks에서 동일 gate를 재확인해야 합니다.

## 연결된 issue

Closes #227
