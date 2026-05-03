# Browser Use blocker — Issue #328 포장잎 상인 수확 주문상자 payoff

- WorkUnit: #328
- Branch: `codex/0328-merchant-harvest-crate-payoff`
- Timestamp: 2026-05-03T11:32:00Z
- Required route: Browser Use plugin with in-app browser `iab` backend before Playwright fallback.

## Attempt

Used Node REPL MCP to import Browser Use client and request `setupAtlasRuntime({ backend: "iab" })`, then name the session `🔎 #328 포장잎 상인 주문상자 QA`.

## Current-session failure

```text
Failed to connect to browser-use backend "iab". No Codex IAB backends were discovered. Discovery diagnostics: listedPipes=0, candidates=2, browsers=0, iabBrowsers=0, failures=["legacy-iab/connect/Error","legacy-chrome/connect/Error"], pipeListingError=none.
```

## Fallback boundary

This is a fresh #328 blocker. Per project rule, Playwright may be used only as repeatable regression/screenshot evidence for this issue; it does not replace Browser Use hands-on QA.
