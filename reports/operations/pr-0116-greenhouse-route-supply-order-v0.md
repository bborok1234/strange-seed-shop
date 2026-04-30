# 온실 동선 순환 주문으로 3번 밭 생산 쓰기

## 요약

`온실 동선` 완료 뒤 `3번 밭 순환 납품` 주문을 열고, 생산 수령 -> 90/90 진행률 -> 납품 보상으로 이어지게 했습니다.

## Small win

3번 밭 개방이 빈 슬롯에서 끝나지 않고 더 큰 납품 주문으로 이어집니다.

## 사용자/운영자 가치

플레이어는 넓어진 온실이 실제 주문 처리량으로 바뀌는 장면을 본다. 운영 측면에서는 #218 이후 후속 작업을 작은 polish가 아니라 production idle loop vertical slice로 이어갔습니다.

## Before / After 또는 Visual evidence

- Before: `온실 동선` 완료 뒤 current order가 `온실 확장 준비` 완료 상태에 머물렀습니다.
- After: `3번 밭 순환 납품`이 열리고, 생산 수령 후 `+110 잎 · +4 꽃가루 · +1 재료` 납품 완료 상태가 action card와 playfield에 보입니다.
- Browser Use evidence: `reports/visual/p0-greenhouse-route-supply-order-browser-use-20260430.png`
- Visual report: `reports/visual/p0-greenhouse-route-supply-order-v0-20260430.md`

## Playable mode

- QA 경로: `/?qaOfflineMinutes=60&qaLunarGuardian=1&qaGreenhouseShelf=1&qaGreenhouseStorage=1&qaGreenhouseRoute=1&qaReset=1`
- 확인 흐름: 복귀 보상 -> `생산 잎 수령` -> `3번 밭 순환 납품` 납품 -> 완료 상태 확인

## 검증

- Browser Use `iab`: PASS
- `npm run check:visual -- --grep "온실 동선 순환 주문"`: PASS
- `npm run check:visual -- --grep "온실 동선 확장|온실 동선 순환 주문"`: PASS
- `npm run check:visual`: PASS, 41 passed
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
- [x] #218 route expansion 회귀 확인
- [x] full visual/CI 통과
- [x] roadmap/dashboard evidence 갱신

## 남은 위험

- PR checks에서 동일 gate를 재확인해야 합니다.

## 연결된 issue

Closes #221
