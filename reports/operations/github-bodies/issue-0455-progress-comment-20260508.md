#455 진행 evidence

## 구현 요약

- 반복 수확이 더 이상 첫 발견 receipt인 `말랑잎 포리 합류`를 재사용하지 않도록 분기했습니다.
- `3번 햇살 밭` 수확 후 작업대 생산으로 주문 상자를 다시 채우고, 두 번째 납품 receipt/objective를 별도로 표시합니다.
- smoke verifier가 `plot_03 심기 -> 돌보기 -> 수확 -> 주문 상자 refill -> 반복 주문 납품 #2`까지 확인합니다.

## Visual evidence

- Report: `reports/visual/issue-0455-repeat-order-after-third-plot-harvest/visual-report-20260508.md`
- Third plot ready: `reports/visual/issue-0455-repeat-order-after-third-plot-harvest/phaser-check-third-plot-ready-393.png`
- Third plot harvested: `reports/visual/issue-0455-repeat-order-after-third-plot-harvest/phaser-check-third-plot-harvested-393.png`
- Second delivery: `reports/visual/issue-0455-repeat-order-after-third-plot-harvest/phaser-check-second-delivery-393.png`

## 검증

- `npm run check:phaser` PASS
- `npm run check:ci` PASS
- `npm run check:control-room` PASS
- `npm run check:ops-live` PASS
- `git diff --check` PASS

## Browser Use

Browser Use `iab` backend는 현재 세션에서 노출되지 않아 Playwright fallback evidence로 대체했습니다.
