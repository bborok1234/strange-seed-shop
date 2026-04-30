# 온실 선반 정리 강화로 보관 보너스 키우기

## 요약

온실 선반 납품 보상으로 받은 `재료 1`을 `선반 정리` 강화에 쓰게 하고, 강화 후 오프라인 보관 보너스를 +10%에서 +20%로 올렸습니다.

## Small win

온실 선반 납품 보상이 다음 온실 성장 선택으로 다시 돌아오며, 플레이어가 다음 복귀 보상을 키우는 선택을 직접 누를 수 있습니다.

## 사용자/운영자 가치

플레이어는 시설 납품 -> 재료 획득 -> 시설 강화 -> 복귀 보상 성장으로 이어지는 idle tycoon식 세로 루프를 경험합니다. 운영 측면에서는 #203-#209 온실 vertical slice를 재료 소비와 +20% 보관 보너스까지 확장했습니다.

## Before / After 또는 Visual evidence

- Before: 온실 선반 완료는 `선반 보관 +10%` 보너스로 끝났고, 납품 보상 `재료 1`의 다음 온실 사용처가 없었습니다.
- After: `선반 정리` 선택지가 열리고, 클릭 후 `재료 0`, `선반 보관 +20%`, `보관 보너스 +20% 가동` 상태로 전환됩니다.
- Browser Use evidence: `reports/visual/p0-greenhouse-storage-upgrade-browser-use-20260430.png`
- Visual report: `reports/visual/p0-greenhouse-storage-upgrade-v0-20260430.md`

## Playable mode

- QA 경로: `/?qaOfflineMinutes=60&qaLunarGuardian=1&qaGreenhouseShelf=1&qaReset=1`
- 강화 완료 복귀 경로: `/?qaOfflineMinutes=60&qaLunarGuardian=1&qaGreenhouseShelf=1&qaGreenhouseStorage=1&qaReset=1`
- 확인 흐름: 오프라인 복귀 보상 -> `보상 확인` -> `선반 정리` -> playfield `선반 보관 +20%`

## 검증

- Browser Use `iab`: PASS
- `npm run check:visual -- --grep "선반 정리 강화"`: PASS
- `npm run check:visual -- --grep "온실 설비는 새 납품 주문"`: PASS
- `npm run check:visual`: PASS, 38 passed
- `npm run check:ci`: PASS

## 안전 범위

- 신규 asset 생성 없음.
- runtime image generation 없음.
- 실제 결제, 광고, 외부 배포, credential, 고객 데이터 없음.
- 기존 save는 `greenhouseStorageLevel` normalization으로 기본값 0을 받습니다.

## 작업 checklist

- [x] Game Studio route 기록
- [x] plan-first item 작성
- [x] Browser Use 우선 QA evidence 저장
- [x] visual regression 추가
- [x] 기존 온실 완료 카드 overflow 회귀 수정
- [x] full visual/CI 통과
- [x] roadmap/dashboard evidence 갱신

## 남은 위험

- PR #213 checks와 main CI `25154623494`에서 동일 gate를 재확인했습니다.

## 연결된 issue

Closes #212
