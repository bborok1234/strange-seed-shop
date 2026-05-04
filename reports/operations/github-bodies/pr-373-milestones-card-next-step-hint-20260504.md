## 요약

#372는 #364가 추가한 P0.5 진행도 카드 헤더에 첫 미완료 milestone label을 "다음: <label>" chip으로 인라인 표시합니다. player가 카드를 보면 `X/6 단계 완료` + `다음: 작업대 강화` 같은 상태/다음 행동을 한 호흡에 본다.

## Small win

album 탭 진입 시 player가 자기 진행도와 다음 행동을 한 화면에서 동시에 인지한다.

## Before / After

- Before: 카드 헤더에 카운트만(`X/6 단계 완료`).
- After: 헤더에 카운트 + 다음 미완료 milestone chip(`다음: <label>`). 모두 완료 시 chip 미표시.

## 검증

- [x] `npm run build`
- [x] `npm run check:ci`
- [x] mirror gates 통과
- [x] Browser Use iab attempt or blocker

## 안전 범위

- 신규 manifest asset 없음.
- save 호환: 변경 없음.

## 연결된 issue

Closes #372
