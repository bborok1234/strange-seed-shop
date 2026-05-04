# Studio Harness v3 Foreground Operator Entry

- Updated: 2026-05-04T01:42:09.334Z
- Backend: omx
- Idle timeout: 10 min (per Codex pass; supervisor stops cleanly on idle/limit)
- Worktree: `/Users/mirlim/Documents/strange-seed-shop`
- Initial issue: auto from GitHub queue
- Prompt: `.omx/state/studio-v3-operator-prompt.md`
- State: `.omx/state/studio-v3-operator.json`

## 정정

이 entrypoint는 `$seed-ops`를 사용하지 않는다. Studio Harness v3는 과거 `$seed-ops` 루프를 대체하는 GitHub-authoritative foreground operator surface다.

이 스크립트는 Codex/OMX만 spawn한다. Claude path가 필요하면 Claude Code 세션에서 `/studio-operate` 스킬을 호출한다 (반복은 `/loop 5m /studio-operate` 또는 `/schedule`).

## Readiness

| 상태 | 필수 | 항목 | 세부 |
| --- | --- | --- | --- |
| ok | required | git command | /usr/bin/git |
| ok | required | inside git worktree | /Users/mirlim/Documents/strange-seed-shop |
| ok | required | gh command | /opt/homebrew/bin/gh |
| ok | optional | gh auth | needed for issue/PR/comment/check/merge mutation |
| ok | required | codex command | /opt/homebrew/bin/codex |
| ok | required | omx command | /Users/mirlim/.nvm/versions/node/v24.12.0/bin/omx |
| ok | optional | Browser Use Node REPL MCP | node_repl configured |
| ok | optional | Codex App node_repl binary | /Applications/Codex.app/Contents/Resources/node_repl |

## Foreground command

```bash
omx 'exec' '-C' '/Users/mirlim/Documents/strange-seed-shop' '-c' 'approval_policy="never"' '--sandbox' 'danger-full-access' '-' < '.omx/state/studio-v3-operator-prompt.md'
```

## Detached command

```bash
mkdir -p '.omx/logs' '.omx/state'
nohup '/Users/mirlim/.nvm/versions/node/v24.12.0/bin/node' '/Users/mirlim/Documents/strange-seed-shop/scripts/studio-v3-operator.mjs' '--supervisor' '--duration-hours' '24' '--interval-seconds' '300' '--max-iterations' '0' '--idle-timeout-minutes' '10' '--worktree' '/Users/mirlim/Documents/strange-seed-shop' '--backend' 'omx' '--prompt' '.omx/state/studio-v3-operator-prompt.md' '--state' '.omx/state/studio-v3-operator.json' '--report' 'reports/operations/studio-v3-operator-20260504.md' > '.omx/logs/studio-v3-operator-20260504T014208Z.log' 2>&1 &
echo $! > '.omx/state/studio-v3-operator.pid'
```
