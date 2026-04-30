# 온실 물길 강화로 순환 주문 보상 쓰기

## 요약

`3번 밭 순환 납품` 보상 `재료 1 · 꽃가루 4`를 `온실 물길` 강화에 쓰게 만들고, 구매 후 자동 생산률이 11.2/분에서 12.8/분으로 오르게 했습니다.

## Small win

순환 주문 보상이 새 자동화 강화로 이어져, 세 밭 확장 루프가 생산률 성장으로 환류됩니다.

## 사용자/운영자 가치

플레이어는 주문 보상이 정원 속도 상승으로 바뀌는 장면을 본다. 운영 측면에서는 #221 이후 후속 작업을 작은 polish가 아니라 production idle loop vertical slice로 이어갔습니다.

## Before / After 또는 Visual evidence

- Before: `3번 밭 순환 납품` 보상 뒤 재료와 꽃가루를 즉시 쓸 다음 생산 성장 선택이 없었습니다.
- After: `온실 물길`을 구매하면 재료/꽃가루가 소비되고 자동 생산률이 12.8/분으로 상승합니다.
- Browser Use evidence: `reports/visual/p0-greenhouse-irrigation-upgrade-browser-use-20260430.png`
- Visual report: `reports/visual/p0-greenhouse-irrigation-upgrade-v0-20260430.md`

## Playable mode

- QA 경로: `/?qaOfflineMinutes=60&qaLunarGuardian=1&qaGreenhouseShelf=1&qaGreenhouseStorage=1&qaGreenhouseRoute=1&qaGreenhouseRouteSupply=1&qaReset=1`
- 확인 흐름: 복귀 보상 -> `온실 물길` 구매 -> 생산률 12.8/분과 저장값 확인

## 검증

- Browser Use `iab`: PASS
- `npm run check:visual -- --grep "온실 물길 강화"`: PASS
- `npm run check:visual -- --grep "온실 동선 순환 주문|온실 물길 강화"`: PASS
- `npm run check:visual`: PASS, 42 passed
- `npm run check:ci`: PASS

## 안전 범위

- 신규 asset 생성 없음.
- runtime image generation 없음.
- 실제 결제, 광고, 외부 배포, credential, 고객 데이터 없음.
- save field는 `greenhouseIrrigationLevel` 하나이며 기존 save는 normalization 기본값 0을 받습니다.

## 작업 checklist

- [x] Game Studio route 기록
- [x] plan-first item 작성
- [x] Browser Use 우선 QA evidence 저장
- [x] visual regression 추가
- [x] #221 순환 주문 회귀 확인
- [x] full visual/CI 통과
- [x] roadmap/dashboard evidence 갱신

## 남은 위험

- PR checks에서 동일 gate를 재확인해야 합니다.

## 연결된 issue

Closes #224
