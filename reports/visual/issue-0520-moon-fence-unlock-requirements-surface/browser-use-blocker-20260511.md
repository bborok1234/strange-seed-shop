# Browser Use blocker - Issue #520

- Scope: `월정 문 unlock requirements surface`
- Expected Browser Use route: `browser-use:browser` with in-app browser `iab`
- Attempted discovery: `tool_search` query `browser-use browser iab navigate screenshot local browser`
- Result: Browser Use callable was not exposed. Search returned `Computer Use`, `xcodebuildmcp`, and `node_repl` tools only.
- Fallback: Playwright scripted Phaser QA via `npm run check:phaser`
- Evidence:
  - `reports/visual/issue-0520-moon-fence-unlock-requirements-surface/phaser-check-moon-fence-route-action-393.png`
  - `reports/visual/issue-0520-moon-fence-unlock-requirements-surface/phaser-check-moon-fence-requirements-393.png`

This is a tool-surface blocker, not a product blocker. The deterministic fallback verifies action visibility, click behavior, telemetry, HUD text, objective text, and screenshot output.
