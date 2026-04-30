# 온실 확장 준비 주문으로 선반 정리 이후 루프 열기

## 요약

`선반 정리` 완료 후 `온실 확장 준비` 주문이 열리도록 order loop를 확장했습니다. 새 주문은 `60 잎`을 요구하고, 납품 보상으로 `+70 잎 · +3 꽃가루 · +2 재료`를 지급합니다.

## Small win

선반 정리 +20% 강화가 완료 상태에서 멈추지 않고, 다음 온실 확장 재료를 모으는 생산/납품 루프로 이어집니다.

## 사용자/운영자 가치

플레이어는 온실 강화 후 바로 다음 목표 주문을 봅니다. 운영 측면에서는 #203-#214 온실 vertical slice를 반복 가능한 production order 구조로 한 단계 더 밀었습니다.

## Before / After 또는 Visual evidence

- Before: `선반 정리` 완료 후 production lane은 `온실 선반 납품 완료` 상태에 머물렀습니다.
- After: `greenhouseStorageLevel=1` 이후 `온실 확장 준비` 주문이 열리고, 생산 수령/납품으로 재료 2개를 얻습니다.
- Browser Use evidence: `reports/visual/p0-greenhouse-expansion-order-browser-use-20260430.png`
- Visual report: `reports/visual/p0-greenhouse-expansion-order-v0-20260430.md`

## Playable mode

- QA 경로: `/?qaOfflineMinutes=60&qaLunarGuardian=1&qaGreenhouseShelf=1&qaGreenhouseStorage=1&qaReset=1`
- 확인 흐름: 복귀 보상 -> `보상 확인` -> `온실 확장 준비` -> `생산 잎 수령` -> `주문 납품`

## 검증

- Browser Use `iab`: PASS
- `npm run check:visual -- --grep "온실 확장 준비"`: PASS
- `npm run check:visual`: PASS, 39 passed
- `npm run check:ci`: PASS

## 안전 범위

- 신규 asset 생성 없음.
- runtime image generation 없음.
- 실제 결제, 광고, 외부 배포, credential, 고객 데이터 없음.
- 기존 선반 완료 경로는 `greenhouseStorageLevel=1` 전까지 유지합니다.

## 작업 checklist

- [x] Game Studio route 기록
- [x] plan-first item 작성
- [x] Browser Use 우선 QA evidence 저장
- [x] visual regression 추가
- [x] full visual/CI 통과
- [x] roadmap/dashboard evidence 갱신

## 남은 위험

- PR #216 checks와 main CI `25155573462`에서 동일 gate를 재확인했습니다.

## 연결된 issue

Closes #215
