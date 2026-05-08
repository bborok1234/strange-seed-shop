# Browser Use blocker: Issue #510

- Date: 2026-05-08
- Scope: `밤유리 source acquisition route bridge`
- Required path: Browser Use `iab` hands-on QA for visible gameplay route.
- Attempted discovery: `tool_search` query `browser-use browser iab screenshot local target`.
- Result: Browser Use callable was not exposed in this Codex tool surface. Available fallback tools were Computer Use and Node REPL; no `browser-use:browser` / `iab` navigation or screenshot tool was callable.
- Fallback used: Playwright-backed `npm run check:phaser`.
- Evidence:
  - `reports/visual/issue-0510-night-glass-source-acquisition-route/phaser-check-night-glass-source-preview-393.png`
  - `reports/visual/issue-0510-night-glass-source-acquisition-route/phaser-check-night-glass-traveling-393.png`
  - `reports/visual/issue-0510-night-glass-source-acquisition-route/phaser-check-night-glass-returned-393.png`
  - `reports/visual/issue-0510-night-glass-source-acquisition-route/phaser-check-night-glass-source-acquired-393.png`

Stop condition: Browser Use remains unavailable for this turn; deterministic Playwright smoke and screenshot evidence are the current QA path.
