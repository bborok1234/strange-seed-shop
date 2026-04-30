# 온실 설비 완료 뒤 새 납품 주문 열기

## 요약

온실 설비를 설치한 뒤 정원 생산 카드에 `온실 선반 납품` 주문이 열리도록 연결했습니다. 생산 잎 수령으로 주문 진행률을 채우고, 납품 시 잎/꽃가루/재료 보상이 save에 반영됩니다.

## Small win

설비 설치가 생산률 상승에서 끝나지 않고, 바로 다음 납품 루프와 재료 보상으로 이어집니다.

## 사용자/운영자 가치

플레이어는 새 시설을 설치한 직후 “늘어난 생산량을 어디에 쓰는지”를 화면에서 확인하고 다시 주문 납품을 수행합니다. 운영 측면에서는 #159 이후 지침대로 작은 옵션 개선이 아니라 `player verb + progression role + screen moment + playtest evidence`가 있는 vertical slice를 이어갑니다.

## Before / After 또는 Visual evidence

- Before: 온실 설비 완료 후 생산률만 상승하고 다음 납품 목표가 약했습니다.
- After: `온실 선반 납품` 주문이 열리고 `0/36 -> 36/36 -> 납품 완료`로 진행됩니다.
- Browser Use evidence: `reports/visual/p0-greenhouse-facility-order-browser-use-20260430.png`
- Visual report: `reports/visual/p0-greenhouse-facility-order-v0-20260430.md`

## Playable mode

- 로컬 QA 경로: `/?qaResearchExpeditionClaimReady=1&qaTab=expedition&qaReset=1`
- 흐름: 원정 보상 수령 -> 정원 -> 작업대 강화 -> 온실 설비 -> 생산 잎 수령 -> 온실 선반 납품

## 검증

- Browser Use `iab`: PASS
- `npm run check:visual -- --grep "새 납품"`: PASS
- `npm run check:visual -- --grep "온실 설비"`: PASS
- `npm run check:visual`: PASS, 35 passed
- `npm run check:ci`: PASS

## 안전 범위

- 신규 asset 생성 없음.
- runtime image generation 없음.
- 실제 결제, 광고, 외부 배포, credential, 고객 데이터 없음.
- 기존 첫 주문/두 번째 주문/연구/원정 흐름은 full visual suite로 회귀 확인했습니다.

## 작업 checklist

- [x] Game Studio route 기록
- [x] plan-first item 작성
- [x] Browser Use 우선 QA evidence 저장
- [x] visual regression 추가
- [x] full visual/CI 통과
- [x] roadmap/dashboard evidence 갱신

## 남은 위험

- PR checks에서 동일 gate를 재확인해야 합니다.

## 연결된 issue

Closes #203
