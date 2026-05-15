# Browser Use blocker - issue #536

- 일시: 2026-05-15
- 대상: 월정 숲 source acquisition bridge
- 기대 경로: Browser Use `iab`로 `pnpm dev:phaser` 또는 checker localhost 화면을 열고 `월정 숲 source 확인` 전후를 직접 확인한다.
- 실제 결과: 현 세션에서 `tool_search`로 `browser-use iab browser navigate screenshot localhost`를 검색했지만 Browser Use/IAB callable이 노출되지 않았다. 검색 결과는 Computer Use 및 iOS screenshot 계열 도구만 노출됐다.
- 판정: Browser Use hands-on QA는 current-session tool-surface blocker로 수행하지 못했다.
- 대체 증거: `npm run check:phaser`의 Playwright smoke가 mobile 393 viewport에서 source 확인 action, acquisition telemetry, source icon/FX key, no body scroll, overview collapsed HUD를 검증하고 스크린샷을 저장했다.

## 대체 산출물

- `reports/visual/issue-0536-moon-grove-source-acquisition-bridge/phaser-check-moon-fence-expedition-claimed-393.png`
- `reports/visual/issue-0536-moon-grove-source-acquisition-bridge/phaser-check-moon-grove-source-acquired-393.png`
- `reports/visual/issue-0536-moon-grove-source-acquisition-bridge/phaser-check-moon-fence-source-overview-393.png`
