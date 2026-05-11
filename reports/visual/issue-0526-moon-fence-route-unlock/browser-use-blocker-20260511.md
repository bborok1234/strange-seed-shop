# Browser Use blocker - Issue #526

- Scope: `월정 문 route unlock`
- Expected Browser Use route: `browser-use:browser` with in-app browser `iab`
- Attempted discovery: `tool_search` query `browser-use browser iab navigate screenshot local browser`
- Result: Browser Use callable was not exposed. Search returned `Computer Use`, `xcodebuildmcp`, and `node_repl` tools only.
- Fallback: Playwright scripted Phaser QA via `npm run check:phaser`
- Evidence:
  - `reports/visual/issue-0526-moon-fence-route-unlock/phaser-check-moon-fence-second-clue-393.png`
  - `reports/visual/issue-0526-moon-fence-route-unlock/phaser-check-moon-fence-route-unlocked-393.png`

This is a current tool-surface blocker, not a product blocker. The deterministic fallback verifies action visibility, click behavior, `moonFenceRouteUnlocked=true`, `moonFenceUnlockedMarkerVisible=true`, unlocked route id telemetry, HUD text, objective text, and screenshot output.
