# 온실 선반 납품 완료를 오프라인 보관 보너스로 연결하기

## 요약

`온실 선반 납품` 완료 상태를 오프라인 복귀 보상 계산에 연결했습니다. 선반 완료 save에서는 복귀 modal에 `온실 선반 보관` / `보관 보상 +10%`가 표시되고, 달빛 수호자 보너스와 함께 60분 보상이 `98 잎`으로 계산됩니다.

## Small win

온실 시설 주문이 납품 완료 row에서 끝나지 않고, 다음 접속 때 더 큰 복귀 payoff로 돌아옵니다.

## 사용자/운영자 가치

플레이어는 시설을 설치하고 납품한 이유를 다음 복귀 순간에 다시 확인합니다. 운영 측면에서는 열린 issue가 없어도 #159 이후 원칙대로 production idle loop vertical slice를 직접 intake하고 Browser Use evidence까지 남겼습니다.

## Before / After 또는 Visual evidence

- Before: 온실 선반 납품 완료는 즉시 보상에만 남았습니다.
- After: 오프라인 복귀 modal에 `온실 선반 보관 +10%`가 표시되고 잎 보상이 증가합니다.
- Browser Use evidence: `reports/visual/p0-greenhouse-shelf-offline-bonus-browser-use-20260430.png`
- Visual report: `reports/visual/p0-greenhouse-shelf-offline-bonus-v0-20260430.md`

## Playable mode

- QA 경로: `/?qaOfflineMinutes=60&qaLunarGuardian=1&qaGreenhouseShelf=1&qaReset=1`
- 확인 흐름: 60분 복귀 -> 달빛 수호자 보너스 -> 온실 선반 보관 보너스 -> 다음 씨앗 CTA

## 검증

- Browser Use `iab`: PASS
- `npm run check:visual -- --grep "온실 선반 보관"`: PASS
- `npm run check:visual`: PASS, 36 passed
- `npm run check:ci`: PASS

## 안전 범위

- 신규 asset 생성 없음.
- runtime image generation 없음.
- 실제 결제, 광고, 외부 배포, credential, 고객 데이터 없음.
- 기존 `qaOfflineMinutes`와 `qaLunarGuardian` 경로는 기존 보상 숫자를 유지합니다.

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

Closes #206
