# Browser Use blocker — Issue #326 라미 저장 다음 포장잎 상인 목표 재순환

- WorkUnit: #326
- Branch: `codex/0326-rami-record-next-merchant-goal`
- Timestamp: 2026-05-03T09:40:00Z
- Required route: Browser Use plugin with in-app browser `iab` backend before Playwright fallback.

## Attempt

Used Node REPL MCP to import Browser Use client and request `setupAtlasRuntime({ backend: "iab" })`, then name the session `🔎 #326 포장잎 상인 다음 목표 QA`.

## Current-session failure

```text
Failed to connect to browser-use backend "iab". No Codex IAB backends were discovered. Discovery diagnostics: listedPipes=0, candidates=2, browsers=0, iabBrowsers=0, failures=["legacy-iab/connect/Error","legacy-chrome/connect/Error"], pipeListingError=none.
```

## Fallback boundary

This is a fresh #326 blocker. Per project rule, Playwright may be used only as repeatable regression/screenshot evidence for this issue; it does not replace Browser Use hands-on QA.
