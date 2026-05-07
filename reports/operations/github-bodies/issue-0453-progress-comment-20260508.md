#453 진행 evidence

## 구현 요약

- `3번 밭 확장` 보상에 starter seed `+1`을 붙여 새로 열린 `3번 햇살 밭`이 빈 capacity로 끝나지 않게 했습니다.
- 확장 직후 선택된 `plot_03`에서 `심기` action이 뜨고, 심기 후 `plot_03`은 `planted`, growth `20` 상태가 됩니다.
- smoke verifier가 full first-session chain을 `심기 -> 돌보기 -> 수확 -> 작업대 수령 -> 주문 상자 납품 -> 3번 밭 확장 -> plot_03 심기`까지 확인합니다.

## Visual evidence

- Report: `reports/visual/issue-0453-third-plot-seed-planting-loop/visual-report-20260508.md`
- Expanded: `reports/visual/issue-0453-third-plot-seed-planting-loop/phaser-check-third-plot-expanded-393.png`
- Planted: `reports/visual/issue-0453-third-plot-seed-planting-loop/phaser-check-third-plot-planted-393.png`

## 검증

- `npm run check:phaser` PASS
- `npm run check:ci` PASS
- `npm run check:control-room` PASS
- `npm run check:ops-live` PASS
- `git diff --check` PASS

## Browser Use

Browser Use `iab` backend는 현재 세션에서 노출되지 않아 Playwright fallback evidence로 대체했습니다.
