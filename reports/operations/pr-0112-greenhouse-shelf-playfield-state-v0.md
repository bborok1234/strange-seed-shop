# 온실 선반 보관 상태를 정원 playfield에 남기기

## 요약

복귀 modal에서 확인한 온실 선반 보관 보너스가 정원으로 돌아온 뒤에도 playfield production lane의 order crate 상태로 남도록 연결했습니다. `온실 선반 납품 완료`, `36/36 잎`, `선반 보관 +10%`가 정원 화면에 함께 보입니다.

## Small win

오프라인 보너스가 일회성 modal 문구가 아니라, 정원 생산 엔진의 시설 상태로 계속 읽힙니다.

## 사용자/운영자 가치

플레이어는 선반 납품 완료가 실제 정원 시설로 남아 있다는 증거를 봅니다. 운영 측면에서는 #203-#206 온실 vertical slice를 playfield-first 기준으로 이어가고, Browser Use에서 줄임표까지 확인했습니다.

## Before / After 또는 Visual evidence

- Before: `온실 선반 보관 +10%`는 복귀 modal에만 보였습니다.
- After: 복귀 modal을 닫은 뒤 playfield order crate에 `선반 보관 +10%`가 남습니다.
- Browser Use evidence: `reports/visual/p0-greenhouse-shelf-playfield-state-browser-use-20260430.png`
- Visual report: `reports/visual/p0-greenhouse-shelf-playfield-state-v0-20260430.md`

## Playable mode

- QA 경로: `/?qaOfflineMinutes=60&qaLunarGuardian=1&qaGreenhouseShelf=1&qaReset=1`
- 확인 흐름: 오프라인 복귀 보상 -> `보상 확인` -> 정원 playfield order crate

## 검증

- Browser Use `iab`: PASS
- `npm run check:visual -- --grep "선반 보관 상태"`: PASS
- `npm run check:visual`: PASS, 37 passed
- `npm run check:ci`: PASS

## 안전 범위

- 신규 asset 생성 없음.
- runtime image generation 없음.
- 실제 결제, 광고, 외부 배포, credential, 고객 데이터 없음.
- 기존 order crate surface의 완료 상태 문구만 compact storage label로 확장했습니다.

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

Closes #209
