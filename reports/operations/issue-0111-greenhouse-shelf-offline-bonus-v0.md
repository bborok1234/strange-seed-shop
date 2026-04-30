# [P0.5] 온실 선반 납품 완료를 오프라인 보관 보너스로 연결하기

## 요약

`온실 선반 납품` 완료가 단순 완료 표시로 끝나지 않도록, 오프라인 복귀 보상에 `온실 선반 보관 +10%` 보너스를 추가한다.

## Small win

플레이어가 시설 주문을 끝낸 뒤 게임에 돌아왔을 때 선반이 잎 보상을 더 잘 보관해 줬다는 payoff를 본다.

## 사용자/운영자 가치

게임 가치는 온실 시설이 생산률/주문/복귀 보상을 잇는 idle loop 시설로 읽히는 데 있다. 운영 가치는 열린 issue가 없을 때도 roadmap과 북극성 기준으로 vertical slice를 직접 intake한다는 점이다.

## Game Studio route

- `game-studio:game-studio`: 온실 주문 완료 -> 오프라인 복귀 보너스 -> 다음 씨앗 행동 vertical slice.
- `game-studio:web-game-foundations`: order completion state와 offline reward 계산 연결.
- `game-studio:game-ui-frontend`: comeback modal bonus row 밀도 보호.
- `game-studio:game-playtest`: Browser Use와 visual regression evidence.

## 수용 기준

- [x] 온실 선반 납품 완료 save에서 60분 복귀 보상이 기본/수호자 보상보다 높게 계산된다.
- [x] 복귀 modal에 `온실 선반 보관 +10%`가 보인다.
- [x] guardian bonus와 shelf bonus가 함께 있어도 393px 모바일에서 CTA와 summary가 가려지지 않는다.
- [x] Browser Use `iab`, focused visual, full visual, CI가 통과한다.

## 검증 계획

- Browser Use `iab`: `/?qaOfflineMinutes=60&qaLunarGuardian=1&qaGreenhouseShelf=1&qaReset=1`
- Browser Use evidence: `reports/visual/p0-greenhouse-shelf-offline-bonus-browser-use-20260430.png`
- Visual report: `reports/visual/p0-greenhouse-shelf-offline-bonus-v0-20260430.md`
- `npm run check:visual -- --grep "온실 선반 보관"` PASS
- `npm run check:visual` PASS, 36 passed
- `npm run check:ci` PASS
- PR #207 checks PASS: `Check automerge eligibility`, `Verify game baseline`
- PR #207 squash-merged to `main`
- Main CI `25152516010` PASS

## 안전 범위

- 신규 asset 생성 없음.
- runtime image generation 없음.
- 실제 결제, 광고, 외부 배포, credential, 고객 데이터 없음.

## 남은 위험

- Issue #206은 PR #207 merge로 closed 상태다.
