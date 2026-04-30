# 온실 동선 확장으로 3번 밭 열기

## 요약

`온실 확장 준비` 주문 보상 `재료 2`를 `온실 동선` 성장 선택에 쓰게 만들고, 구매 후 3번 밭을 열었습니다.

## Small win

온실 확장 주문 보상이 숫자로 끝나지 않고 실제 재배 용량 증가로 이어집니다.

## 사용자/운영자 가치

플레이어는 주문/납품 보상으로 온실이 넓어지는 장면을 본다. 운영 측면에서는 #203-#217 온실 vertical slice를 주문 보상 -> 시설 확장 -> 3번 밭 개방까지 연결했습니다.

## Before / After 또는 Visual evidence

- Before: `온실 확장 준비` 납품 보상 `재료 2`는 다음 성장 선택으로 쓰이지 않았습니다.
- After: `온실 동선`을 구매하면 `재료 0`, `동선 완료`, `3번 밭 개방 중`이 보이고 playfield에 3번 밭이 빈 자리로 열립니다.
- Browser Use evidence: `reports/visual/p0-greenhouse-route-expansion-browser-use-20260430.png`
- Visual report: `reports/visual/p0-greenhouse-route-expansion-v0-20260430.md`

## Playable mode

- QA 경로: `/?qaOfflineMinutes=60&qaLunarGuardian=1&qaGreenhouseShelf=1&qaGreenhouseStorage=1&qaReset=1`
- 확인 흐름: 복귀 보상 -> `생산 잎 수령` -> `온실 확장 준비` 납품 -> `온실 동선` 구매 -> 3번 밭 확인

## 검증

- Browser Use `iab`: PASS
- `npm run check:visual -- --grep "온실 동선 확장"`: PASS
- `npm run check:visual -- --grep "온실 확장 준비|온실 동선 확장"`: PASS
- `npm run check:visual`: PASS, 40 passed
- `npm run check:ci`: PASS

## 안전 범위

- 신규 asset 생성 없음.
- runtime image generation 없음.
- 실제 결제, 광고, 외부 배포, credential, 고객 데이터 없음.
- 기존 save는 `greenhouseRouteLevel` normalization으로 기본값 0을 받습니다.

## 작업 checklist

- [x] Game Studio route 기록
- [x] plan-first item 작성
- [x] Browser Use 우선 QA evidence 저장
- [x] visual regression 추가
- [x] Browser Use에서 발견한 3번 밭 부분 가림 수정
- [x] full visual/CI 통과
- [x] roadmap/dashboard evidence 갱신

## 남은 위험

- PR checks에서 동일 gate를 재확인해야 합니다.

## 연결된 issue

Closes #218
