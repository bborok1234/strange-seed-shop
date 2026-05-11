# Browser Use blocker - Issue #524

- Scope: `월정 문 두 번째 달빛 단서 payoff`
- Expected Browser Use route: `browser-use:browser` with in-app browser `iab`
- Attempted discovery: `tool_search` query `browser-use browser iab navigate screenshot local browser`
- Result: Browser Use callable was not exposed. Search returned `Computer Use`, `xcodebuildmcp`, and `node_repl` tools only.
- Fallback: Playwright scripted Phaser QA via `npm run check:phaser`
- Evidence:
  - `reports/visual/issue-0524-moon-fence-second-clue-payoff/phaser-check-moon-fence-prep-delivery-393.png`
  - `reports/visual/issue-0524-moon-fence-second-clue-payoff/phaser-check-moon-fence-second-clue-393.png`

This is a tool-surface blocker, not a product blocker. The deterministic fallback verifies action visibility, click behavior, clue 2/2 telemetry, stamp visibility telemetry, HUD text, objective text, and screenshot output.
