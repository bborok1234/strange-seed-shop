# Browser Use blocker - issue #552

- 일시: 2026-05-26
- 대상: 온실 숲길 clue map v0
- 요구 경로: Browser Use `iab` 우선 QA
- 결과: 현재 Codex 도구 표면에서 Browser Use/in-app browser 도구가 노출되지 않았다. `tool_search` 결과는 Figma capture, Node REPL, Computer Use, XcodeBuildMCP만 반환했다.
- fallback: `npm run check:phaser`의 Playwright smoke가 393px viewport에서 전체 Phaser vertical slice를 클릭하고 스크린샷을 저장했다.
- 핵심 fallback evidence:
  - `reports/visual/issue-0552-moon-grove-greenhouse-path-map/phaser-check-moon-grove-miru-research-handoff-393.png`
  - `reports/visual/issue-0552-moon-grove-greenhouse-path-map/phaser-check-moon-grove-clue-map-opened-393.png`
  - `reports/visual/issue-0552-moon-grove-greenhouse-path-map/phaser-check-moon-fence-source-overview-393.png`

## 판정

Browser Use hands-on QA는 도구 노출 blocker로 수행하지 못했다. 이번 이슈의 merge-blocking visual evidence는 Playwright screenshot + telemetry assertion으로 대체한다.
