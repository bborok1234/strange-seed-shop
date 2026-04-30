# 온실 동선 확장 완료 증거 고정

## 요약

PR #219 머지 뒤 issue #218의 roadmap/item/issue evidence를 main CI까지 갱신합니다.

## Small win

온실 확장 주문 보상 -> 온실 동선 강화 -> 3번 밭 개방 vertical slice가 main 기준 완료 상태로 남습니다.

## 사용자/운영자 가치

플레이어 경험 증거와 운영 증거가 같은 문서 표면에 남아, 다음 issue 선택이 다시 작은 기능 개선으로 흐르지 않게 합니다.

## Before / After 또는 Visual evidence

- Before: roadmap은 `Greenhouse route expansion v0`를 active로 표시했고 main CI evidence가 없었습니다.
- After: roadmap/item/issue evidence가 PR #219와 main CI `25157053868` PASS를 가리킵니다.
- Browser Use evidence: `reports/visual/p0-greenhouse-route-expansion-browser-use-20260430.png`

## Playable mode

- QA 경로: `/?qaOfflineMinutes=60&qaLunarGuardian=1&qaGreenhouseShelf=1&qaGreenhouseStorage=1&qaReset=1`
- 완료 흐름: 복귀 보상 -> `생산 잎 수령` -> `온실 확장 준비` 납품 -> `온실 동선` 구매 -> 3번 밭 확인

## 검증

- PR #219 checks: PASS
- Main CI `25157053868`: PASS
- `npm run check:dashboard`: PASS
- `npm run check:docs`: PASS

## 안전 범위

- 문서/evidence 갱신만 포함합니다.
- runtime code, asset, save schema 변경 없음.
- 실제 결제, 광고, 외부 배포, credential, 고객 데이터 없음.

## 작업 checklist

- [x] roadmap status를 done으로 갱신
- [x] item evidence에 PR/main CI 기록
- [x] issue body evidence 갱신
- [x] dashboard/docs checker 통과

## 남은 위험

- closeout PR checks에서 문서 gate를 재확인해야 합니다.

## 연결된 issue

Refs #218
