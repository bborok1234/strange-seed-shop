# Browser Use blocker - Issue #518

- Scope: `밤유리 오로 월정 문 route action`
- Expected Browser Use route: `browser-use:browser` with in-app browser `iab`
- Attempted discovery: `tool_search` query `browser-use browser navigate screenshot localhost in-app browser iab`
- Result: Browser Use callable was not exposed. Search returned `Computer Use` and `xcodebuildmcp` screenshot tools only.
- Fallback: Playwright scripted Phaser QA via `npm run check:phaser`
- Evidence:
  - `reports/visual/issue-0518-night-glass-oro-moon-fence-route-action/phaser-check-night-glass-oro-handoff-393.png`
  - `reports/visual/issue-0518-night-glass-oro-moon-fence-route-action/phaser-check-moon-fence-route-action-393.png`

This is a tool-surface blocker, not a product blocker. The deterministic fallback verifies action visibility, click behavior, telemetry, HUD text, objective text, and screenshot output.
