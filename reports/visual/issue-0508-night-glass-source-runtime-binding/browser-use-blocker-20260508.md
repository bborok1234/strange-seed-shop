# Browser Use blocker

- Issue: #508
- WorkUnit: `items/0270-night-glass-source-runtime-binding.md`
- Target: `밤유리 source icon/FX runtime binding`
- Expected primary QA: Browser Use `iab` hands-on local browser inspection.
- Current blocker: this Codex tool surface did not expose Browser Use navigation/screenshot/click tools. `tool_search` for Browser Use/browser/iab returned Computer Use, Node REPL, and unrelated tools, not `browser-use:browser`.
- Fallback used: Playwright-based `npm run check:phaser`, which drives the full Phaser route to `밤유리 source 보기` and saves screenshots under `reports/visual/issue-0508-night-glass-source-runtime-binding/`.
- Recheck requirement: if Browser Use becomes available in a later turn, rerun hands-on QA for the same route and compare the dedicated source icon/FX against the Playwright screenshot.
