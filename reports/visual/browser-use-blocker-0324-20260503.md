# Browser Use blocker — Issue #324 다음 기록 목표 이슬연금 라미 수확 payoff

- WorkUnit: #324
- Branch: `codex/0324-album-record-loop-rami-harvest-payoff`
- Timestamp: 2026-05-03T08:59:00Z
- Required route: Browser Use plugin with in-app browser `iab` backend before Playwright fallback.

## Attempt

Used Node REPL MCP to import Browser Use client and request `setupAtlasRuntime({ backend: "iab" })`, then name the session `🔎 #324 라미 수확 payoff QA`.

## Current-session failure

```text
Failed to connect to browser-use backend "iab". No Codex IAB backends were discovered. Discovery diagnostics: listedPipes=0, candidates=2, browsers=0, iabBrowsers=0, failures=["legacy-iab/connect/Error","legacy-chrome/connect/Error"], pipeListingError=none.
```

## Fallback boundary

This is a fresh #324 blocker. Per project rule, Playwright may be used only as repeatable regression/screenshot evidence for this issue; it does not replace Browser Use hands-on QA.
