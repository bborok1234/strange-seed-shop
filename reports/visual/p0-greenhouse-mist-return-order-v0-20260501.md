# 물안개 응축 납품 v0 visual QA

Date: 2026-05-01
Issue: #235
Branch: `codex/0121-greenhouse-mist-order-v0`
Route: `game-studio:game-studio` -> `game-studio:game-ui-frontend` -> `game-studio:game-playtest`

## Browser Use iab

PASS.

URL:

`http://127.0.0.1:5173/?qaOfflineMinutes=60&qaLunarGuardian=1&qaGreenhouseMist=1&qaReset=1`

Flow:

1. 오프라인 복귀 modal에서 `보관 보상 +30%` 확인.
2. `보상 확인` 클릭.
3. 정원 자동 생산 장면에서 `물안개 응축 납품`과 `0/150 잎` 확인.
4. `생산 잎 수령` 클릭.
5. `주문 납품 +165 잎 · +2 꽃가루 · +1 재료` 클릭.
6. 완료 상태에서 `물안개 응축 납품 완료`, `+165 잎 · +2 꽃가루 · +1 재료`, `재료 1`, `꽃가루 2` 확인.

## Playwright visual gate

PASS.

- Command: `npm run check:visual -- --grep "물안개 응축"`
- Screenshot: `reports/visual/p0-greenhouse-mist-return-order-v0-20260501.png`
- Source capture: `test-results/p0-mobile-game-shell-모바일-물안개-응축-납품은-복귀-보상을-새-주문으로-잇는다/mobile-greenhouse-mist-return-order-v0-393.png`

## Layout invariants

PASS.

- body scroll height <= viewport height + 2
- action surface bottom <= bottom tabs top - 4
- production card bottom <= bottom tabs top - 4
- production card scrollHeight <= clientHeight + 1
- visible action-surface children overflow list is empty

## Findings

No blocking visual findings in the tested 393x852 mobile viewport.
