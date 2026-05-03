# Browser Use iab blocker — Issue #332

- Issue: #332 `포장잎 상인 보상 수령을 단골 납품 주문으로 이어준다`
- Timestamp: 2026-05-03T14:43:00Z
- Route: `game-studio:game-studio` → `game-studio:game-ui-frontend` + `game-studio:game-playtest`
- Attempt: Node REPL MCP로 Browser Use bundled `browser-client.mjs`를 import하고 `setupAtlasRuntime({ backend: "iab" })` 실행.

## Result

```json
{
  "ok": false,
  "backend": "iab",
  "message": "Failed to connect to browser-use backend \"iab\". No Codex IAB backends were discovered. Discovery diagnostics: listedPipes=0, candidates=2, browsers=0, iabBrowsers=0, failures=[\"legacy-iab/connect/Error\",\"legacy-chrome/connect/Error\"], pipeListingError=none."
}
```

## Fallback evidence

- Focused Playwright 393px test: `npx playwright test --config playwright.config.ts --grep "상인 주문상자 보상은 단골"` — 1 passed.
- Screenshot copied to `reports/visual/issue-332-merchant-followup-order-393.png`.
- Layout invariant in the focused test checks no body scroll, action surface internal height, receipt/playfield crate present, and bottom-tab overlap prevention.

## Follow-up

Browser Use iab가 다음 세션에서 발견되면 같은 flow를 hands-on QA로 재확인한다. 이번 PR은 current-session blocker + repeatable Playwright regression gate로 진행한다.
