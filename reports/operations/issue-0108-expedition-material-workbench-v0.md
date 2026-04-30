# [P0.5] 원정 재료를 정원 작업대 강화로 연결하기

## 요약

원정 보상으로 받은 `재료`가 HUD 숫자에만 머물지 않고 정원 작업대 강화로 이어지게 만든다. 원정 완료가 생산 idle loop의 다음 성장 선택으로 연결되어야 한다.

## Small win

플레이어가 원정 보상 재료를 받아 곧바로 정원 생산/주문 루프를 강화한다.

## 사용자/운영자 가치

첫 5분 이후 원정이 “보상 받고 끝”이 아니라 “정원을 더 잘 굴리기 위한 재료 획득”으로 읽힌다. 운영 관점에서는 작은 UI 문구가 아니라 원정 보상 -> 재료 사용 -> 생산 progression 연결을 다음 vertical slice로 선택한다.

## Game Studio route

- `game-studio:game-studio`: 원정 보상 -> 재료 사용 -> 정원 생산 보강 vertical slice.
- `game-studio:web-game-foundations`: saveable progression field와 simulation boundary 유지.
- `game-studio:game-ui-frontend`: 모바일 action surface/playfield 보호.
- `game-studio:game-playtest`: Browser Use와 visual regression evidence.

## 수용 기준

- [x] 원정 보상 수령 후 HUD 재료가 증가하고, 정원 action surface에 재료 사용처가 보인다.
- [x] `작업대 강화`가 재료를 소모하고 save에 완료 상태를 남긴다.
- [x] 강화 완료 후 생산/주문 progression에 실제 효과가 화면 copy와 숫자로 보인다.
- [x] 모바일 393px에서 원정/정원 탭이 body scroll, bottom tab overlap, card overflow 없이 유지된다.
- [x] Browser Use `iab`, focused visual, full visual, CI가 통과한다.

## 검증 계획

- Browser Use `iab`: 원정 보상 수령 -> 정원 작업대 강화 화면 확인. Evidence: `reports/visual/p0-expedition-material-workbench-browser-use-20260430.png`
- `npm run check:visual -- --grep "작업대"` PASS
- `npm run check:visual -- --grep "생산 roster|작업대|복귀 성장 100"` PASS
- `npm run check:visual` PASS, 33 passed
- `npm run check:ci` PASS
- PR #198 checks PASS
- Main CI `25149499763` PASS

## 안전 범위

- 신규 asset 생성 없음.
- runtime image generation 없음.
- 실제 결제, 광고, 외부 배포 없음.

## 남은 위험

- 없음. 새 save field migration은 persistence fallback과 CI build로 검증했다.
