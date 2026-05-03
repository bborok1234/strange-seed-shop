# Studio Harness v3 Foreground Operator Entry

- Updated: 2026-05-03T17:43:30.511Z
- Backend: claude
- Fallback: claude
- Idle timeout: 10 min (per pass, kills on no stdio)
- Codex cooldown: 60 min (after limit/idle, route to fallback)
- Worktree: `/Users/mirlim/Documents/strange-seed-shop`
- Initial issue: auto from GitHub queue
- Prompt: `.omx/state/studio-v3-operator-prompt.md`
- State: `.omx/state/studio-v3-operator.json`

## 정정

이 entrypoint는 `$seed-ops`를 사용하지 않는다. Studio Harness v3는 과거 `$seed-ops` 루프를 대체하는 GitHub-authoritative foreground operator surface다.

## Readiness

| 상태 | 필수 | 항목 | 세부 |
| --- | --- | --- | --- |
| ok | required | git command | /usr/bin/git |
| ok | required | inside git worktree | /Users/mirlim/Documents/strange-seed-shop |
| ok | required | gh command | /opt/homebrew/bin/gh |
| ok | optional | gh auth | needed for issue/PR/comment/check/merge mutation |
| ok | optional | codex command | /opt/homebrew/bin/codex |
| ok | optional | omx command | /Users/mirlim/.nvm/versions/node/v24.12.0/bin/omx |
| ok | required | claude command | /Users/mirlim/.local/bin/claude |
| ok | optional | Browser Use Node REPL MCP | node_repl configured |
| ok | optional | Codex App node_repl binary | /Applications/Codex.app/Contents/Resources/node_repl |

## Foreground command

```bash
(cd '/Users/mirlim/Documents/strange-seed-shop' && claude '--bare' '-p' '--add-dir' '/Users/mirlim/Documents/strange-seed-shop' '--dangerously-skip-permissions' < '.omx/state/studio-v3-operator-prompt.md')
```

## Detached command

```bash
mkdir -p '.omx/logs' '.omx/state'
nohup '/Users/mirlim/.nvm/versions/node/v24.12.0/bin/node' '/Users/mirlim/Documents/strange-seed-shop/scripts/studio-v3-operator.mjs' '--supervisor' '--duration-hours' '24' '--interval-seconds' '300' '--max-iterations' '0' '--worktree' '/Users/mirlim/Documents/strange-seed-shop' '--backend' 'claude' '--fallback' 'claude' '--idle-timeout-minutes' '10' '--codex-cooldown-minutes' '60' '--prompt' '.omx/state/studio-v3-operator-prompt.md' '--state' '.omx/state/studio-v3-operator.json' '--report' 'reports/operations/studio-v3-operator-20260503.md' '--yolo' > '.omx/logs/studio-v3-operator-20260503T174329Z.log' 2>&1 &
echo $! > '.omx/state/studio-v3-operator.pid'
```
