# Browser Use blocker — Issue #312 연구 단서 도감 기록 payoff

- Date: 2026-05-03
- WorkUnit: #312 `연구 단서 발견 후 도감에 새 기록 저장 payoff를 보이게 만든다`
- Required route: `browser-use:browser` with `iab` backend before Playwright fallback
- Attempted via: Node REPL `mcp__node_repl__.js` using `/Users/mirlim/.codex/plugins/cache/openai-bundled/browser-use/0.1.0-alpha1/scripts/browser-client.mjs`
- Target session name: `🔎 #312 연구 단서 도감 기록 QA`

## Result

Browser Use could not initialize the in-app browser backend in this Codex session.

```text
Failed to connect to browser-use backend "iab". No Codex IAB backends were discovered. Discovery diagnostics: listedPipes=0, candidates=2, browsers=0, iabBrowsers=0, failures=["legacy-iab/connect/Error","legacy-chrome/connect/Error"], pipeListingError=none.
```

## Fallback evidence plan

Because Browser Use was blocked before a tab could be opened, this WorkUnit uses Playwright as the repeatable regression gate only:

- focused Playwright: `npx playwright test --config playwright.config.ts --grep "연구 단서 도감|새 단서 기록"`
- screenshot target: `reports/visual/issue-312-research-clue-album-record-393.png`
- full gates: `npm run check:visual`, `npm run check:ci`

## Follow-up

Do not treat this historical blocker as sufficient for future visual tasks. Retry Browser Use iab in the next UI/visual WorkUnit and write a fresh blocker or screenshot evidence for that issue.
