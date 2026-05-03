# Codex CLI Browser Use node_repl registration fix

Date: 2026-05-03

## Problem

Codex CLI showed the `browser-use:browser` skill and had `browser_use=true` / `in_app_browser=true`, but Browser Use always failed in CLI because the required Node REPL execution MCP (`mcp__node_repl__js`) was not registered in `codex mcp list`.

## Fix

Registered the bundled Codex App Node REPL MCP server:

```bash
codex mcp add node_repl -- /Applications/Codex.app/Contents/Resources/node_repl
```

Backup created before mutation:

```text
/Users/mirlim/.codex/config.toml.backup-browser-use-node-repl-20260503104807
```

## Verification

```bash
codex mcp get node_repl
codex mcp list
```

Observed:

```text
node_repl
  enabled: true
  transport: stdio
  command: /Applications/Codex.app/Contents/Resources/node_repl
```

Direct MCP probe of the server returned `tools/list` containing `js`, which is the JavaScript execution tool Browser Use requires.

## Current-session caveat

The already-running Codex CLI session cannot hot-load new MCP tools into the model-visible tool palette. The fix applies to subsequent Codex CLI sessions/resumes. Current #292 visual QA therefore records a current-session blocker and uses Playwright fallback evidence.
