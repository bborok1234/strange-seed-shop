# Browser Use iab current-session evidence — #292

- WorkUnit: #292 `복귀 첫 30초에 보상 수령과 다음 생산 목표를 한 화면에서 실행하게 만든다`
- Date: 2026-05-03
- Route: `browser-use:browser` with `iab` backend first, Playwright fallback only after current-session blocker.

## Current-session attempt

1. Read Browser Use skill from `/Users/mirlim/.codex/plugins/cache/openai-bundled/browser-use/0.1.0-alpha1/skills/browser/SKILL.md`.
2. Confirmed plugin browser client exists at `/Users/mirlim/.codex/plugins/cache/openai-bundled/browser-use/0.1.0-alpha1/scripts/browser-client.mjs`.
3. Tried tool discovery for the Browser Use execution path:
   - `tool_search: node_repl js` returned 0 tools in the already-running Codex CLI session.
   - `tool_search: mcp__node_repl__js` returned 0 tools in the already-running Codex CLI session.
4. Diagnosed Codex CLI configuration:
   - `codex features list`: `browser_use=true`, `in_app_browser=true`, `js_repl=removed false`.
   - `codex mcp list` initially had no `node_repl` MCP server, so Browser Use skill was visible but its Node REPL execution tool was not registered in CLI.

## Fix applied to local Codex CLI config

Registered the bundled Node REPL MCP server:

```bash
codex mcp add node_repl -- /Applications/Codex.app/Contents/Resources/node_repl
```

Evidence after registration:

```text
node_repl      /Applications/Codex.app/Contents/Resources/node_repl      enabled
```

Config backup:

```text
/Users/mirlim/.codex/config.toml.backup-browser-use-node-repl-20260503104807
```

Direct MCP probe of `/Applications/Codex.app/Contents/Resources/node_repl` returned `tools/list` with `js`, proving the server exposes the Browser Use-required JavaScript execution tool.

## Remaining current-session limitation

The active Codex CLI session tool palette is fixed at session start. After adding `node_repl`, this already-running session still cannot hot-load `mcp__node_repl__js`; the next Codex CLI session/resume should expose it.

This is not a Playwright-first decision. It is a current-session CLI tool hot-reload limitation after the root configuration defect was fixed.

## Fallback evidence for #292

Because current-session Browser Use cannot hot-load the newly registered MCP server, #292 used Playwright fallback with the same mobile route and layout invariants.

- Screenshot: `reports/visual/0292-mobile-comeback-production-briefing-393-20260503.png`
- Focused visual tests:
  - `npm run build`
  - `npx playwright test --config playwright.config.ts --grep "모바일 복귀 첫 30초|모바일 복귀 보상은 달빛|모바일 복귀 보상은 온실 선반|모바일 복귀 후 온실 선반"`
  - Result: 4 passed

## Operator note

For future Codex CLI sessions, Browser Use failure must first check:

```bash
codex mcp get node_repl
codex mcp list | grep node_repl
```

If missing, re-register the bundled Node REPL MCP server before declaring Browser Use unavailable.
