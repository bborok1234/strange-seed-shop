# [P0.5] 온실 선반 보관 상태를 정원 playfield에 남기기

## 요약

오프라인 복귀 보상에서 확인한 선반 보관 보너스가 복귀 modal을 닫은 뒤 정원 playfield의 production/order crate 상태에도 `선반 보관 +10%`로 남도록 만든다.

## Small win

선반 보너스가 일회성 modal 문구가 아니라 정원 생산 엔진의 시설 상태로 계속 읽힌다.

## 사용자/운영자 가치

플레이어는 복귀 보상을 닫아도 온실 선반이 실제로 정원 생산에 붙어 있다는 증거를 본다. 운영 가치는 #203-#206으로 만든 온실 vertical slice를 playfield-first 기준으로 이어간다는 점이다.

## Game Studio route

- `game-studio:game-studio`: 복귀 보너스 -> 정원 playfield facility state -> 다음 생산 확인 vertical slice.
- `game-studio:web-game-foundations`: completed order state와 playfield view model 연결.
- `game-studio:game-ui-frontend`: 모바일 playfield production lane 밀도 보호.
- `game-studio:game-playtest`: Browser Use와 visual regression evidence.

## 수용 기준

- [x] 온실 선반 완료 save에서 복귀 modal을 닫으면 playfield production lane에 `선반 보관 +10%`가 보인다.
- [x] order crate는 `온실 선반 납품 완료`와 storage label을 함께 전달한다.
- [x] 모바일 393px에서 playfield, action surface, bottom tabs가 서로 가리지 않는다.
- [x] Browser Use `iab`, focused visual, full visual, CI가 통과한다.

## 검증 계획

- Browser Use `iab`: `/?qaOfflineMinutes=60&qaLunarGuardian=1&qaGreenhouseShelf=1&qaReset=1`에서 `보상 확인` 후 정원 playfield 확인.
- Browser Use evidence: `reports/visual/p0-greenhouse-shelf-playfield-state-browser-use-20260430.png`
- Visual report: `reports/visual/p0-greenhouse-shelf-playfield-state-v0-20260430.md`
- `npm run check:visual -- --grep "선반 보관 상태"` PASS
- `npm run check:visual` PASS, 37 passed
- `npm run check:ci` PASS
- PR #210 checks PASS: `Check automerge eligibility`, `Verify game baseline`
- PR #210 squash-merged to `main`
- Main CI `25153332087` PASS

## 안전 범위

- 신규 asset 생성 없음.
- runtime image generation 없음.
- 실제 결제, 광고, 외부 배포, credential, 고객 데이터 없음.

## 남은 위험

- Issue #209는 PR #210 merge로 closed 상태다.
