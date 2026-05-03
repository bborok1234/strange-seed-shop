# Browser Use blocker — Issue #308 연구 단서 씨앗 성장/수확 예고

- Date: 2026-05-03
- WorkUnit: #308 `연구 단서 씨앗 성장 중 다음 생명체 수확 예고가 보이게 만든다`
- Required route: `browser-use:browser` with `iab` backend before Playwright fallback
- Attempted via: Node REPL `mcp__node_repl__.js` using `/Users/mirlim/.codex/plugins/cache/openai-bundled/browser-use/0.1.0-alpha1/scripts/browser-client.mjs`
- Target session name: `🔎 #308 연구 단서 성장 예고 QA`

## Result

Browser Use could not initialize the in-app browser backend in this Codex session.

```text
Failed to connect to browser-use backend "iab". No Codex IAB backends were discovered. Discovery diagnostics: listedPipes=0, candidates=2, browsers=0, iabBrowsers=0, failures=["legacy-iab/connect/Error","legacy-chrome/connect/Error"], pipeListingError=none.
```

## Fallback evidence

Because Browser Use was blocked before a tab could be opened, this WorkUnit uses Playwright as the repeatable regression gate only:

- `npm run build` — pass
- `npx playwright test --config playwright.config.ts --grep "연구 단서 성장"` — pass
- Screenshot source: Playwright output `mobile-research-clue-seed-growth-preview-393.png`

## Follow-up

Do not treat this historical blocker as sufficient for future visual tasks. Retry Browser Use iab in the next UI/visual WorkUnit and write a fresh blocker or screenshot evidence for that issue.
