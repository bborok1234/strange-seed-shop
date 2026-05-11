# Browser Use blocker - Issue #528

- Scope: `월정 문 첫 원정 payoff`
- Expected Browser Use route: `browser-use:browser` with in-app browser `iab`
- Attempted discovery: `tool_search` query `browser-use browser iab navigate screenshot local browser`
- Result: Browser Use callable was not exposed. Search returned `Computer Use`, `xcodebuildmcp`, and `node_repl` tools only.
- Fallback: Playwright scripted Phaser QA via `npm run check:phaser`
- Evidence:
  - `reports/visual/issue-0528-moon-fence-first-expedition-payoff/phaser-check-moon-fence-route-unlocked-393.png`
  - `reports/visual/issue-0528-moon-fence-first-expedition-payoff/phaser-check-moon-fence-expedition-traveling-393.png`
  - `reports/visual/issue-0528-moon-fence-first-expedition-payoff/phaser-check-moon-fence-expedition-returned-393.png`
  - `reports/visual/issue-0528-moon-fence-first-expedition-payoff/phaser-check-moon-fence-expedition-claimed-393.png`

This is a current tool-surface blocker, not a product blocker. The deterministic fallback verifies action visibility, click behavior, route id, return crate telemetry, reward claim telemetry, HUD text, objective text, final leaves, and screenshot output.
