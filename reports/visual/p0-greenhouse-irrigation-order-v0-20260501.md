# P0 Greenhouse Irrigation Order v0 Visual QA

## Scope

- Issue: #227
- Branch: `codex/0118-greenhouse-irrigation-order-v0`
- Route: `game-studio:game-studio` -> `game-studio:web-game-foundations` -> `game-studio:game-ui-frontend` -> `game-studio:game-playtest`
- QA URL: `/?qaOfflineMinutes=60&qaLunarGuardian=1&qaGreenhouseShelf=1&qaGreenhouseStorage=1&qaGreenhouseRoute=1&qaGreenhouseRouteSupply=1&qaGreenhouseIrrigation=1&qaReset=1`

## Browser Use Evidence

- Browser Use `iab`: PASS
- Screenshot: `reports/visual/p0-greenhouse-irrigation-order-browser-use-20260501.png`
- 확인 흐름: 복귀 보상 확인 -> `온실 물길 점검` 주문 확인 -> 생산 잎 수령 -> 주문 납품 -> `꽃가루 3 · 재료 1` 표시 확인

## Finding

초기 Browser Use에서 납품 완료 row가 기존 compact CSS에 가려지는 문제가 발견됐다. `has-irrigation-order` class와 완료 row 예외를 추가해 `온실 물길 점검 완료`와 `+135 잎 · +3 꽃가루 · +1 재료`가 보이게 수정했다.

## Automated Evidence

- `npm run check:visual -- --grep "온실 물길 점검"`: PASS
- `npm run check:visual -- --grep "온실 물길 강화|온실 물길 점검"`: PASS
- `npm run check:visual`: PASS, 43 passed
- `npm run check:ci`: PASS

## Layout Invariants

- body scroll 없음.
- starter panel은 bottom tab 위에 유지됨.
- production card 내부 overflow 없음.
- `온실 물길 점검 완료` row는 bottom tab에 가리지 않음.
- `온실 물길` 완료 choice와 `주문 준비` 완료 choice가 action surface 안에서 잘리지 않음.
