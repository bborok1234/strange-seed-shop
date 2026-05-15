# Browser Use blocker - issue #538

- 일시: 2026-05-15
- 대상: 월정 숲 source planting loop
- 기대 경로: Browser Use `iab`로 localhost Phaser 화면을 열고 `월정 숲 source 확인` 후 빈 밭 `월정 숲 심기` 전후를 직접 확인한다.
- 실제 결과: 현 세션에서 `tool_search`로 `browser-use iab browser navigate screenshot localhost`를 검색했지만 Browser Use/IAB callable이 노출되지 않았다. 검색 결과는 Computer Use 및 iOS screenshot 계열 도구만 노출됐다.
- 판정: Browser Use hands-on QA는 current-session tool-surface blocker로 수행하지 못했다.
- 대체 증거: `npm run check:phaser`의 Playwright smoke가 mobile 393 viewport에서 source acquisition 후 planting action, source availability consumption, planted plot telemetry, source icon marker, no body scroll, overview collapsed HUD를 검증하고 스크린샷을 저장했다.

## 대체 산출물

- `reports/visual/issue-0538-moon-grove-source-planting-loop/phaser-check-moon-grove-plant-action-393.png`
- `reports/visual/issue-0538-moon-grove-source-planting-loop/phaser-check-moon-grove-planted-393.png`
- `reports/visual/issue-0538-moon-grove-source-planting-loop/phaser-check-moon-fence-source-overview-393.png`
