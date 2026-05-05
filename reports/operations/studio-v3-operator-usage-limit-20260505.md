# Studio v3 Operator Usage Limit Blocker — 2026-05-05

## Summary

사용자 질문: Ralph/Studio loop가 계속 돌려면 어떻게 해야 하는가.

`npm run studio:v3:operate -- --detached --duration-hours 24 --interval-seconds 300 --axis garden-respecting-hud-assets --cycle-a-approved`를 실행해 실제 detached supervisor를 시작했지만, 첫 `omx exec` Codex pass가 즉시 usage limit로 종료됐다.

## Evidence

- PID file: `.omx/state/studio-v3-operator.pid`
- State file: `.omx/state/studio-v3-operator.json`
- Log file: `.omx/logs/studio-v3-operator-20260505T123422Z.log`
- State status: `codex-stopped-limit-or-idle`
- Killed reason: `limit-detected`
- Command: `omx`

## Meaning

현재 Codex App 채팅 또는 detached supervisor만으로는 24h Ralph/Studio loop를 지속할 수 없다. 명령은 맞지만, Codex CLI/OMX pass가 usage limit에 걸려 시작 직후 종료된다.

## Recovery Paths

1. Codex 사용 한도 reset 후 같은 detached command를 다시 실행한다.
2. Claude Code 세션에서 `/studio-operate`를 실행하고, 반복이 필요하면 `/loop 5m /studio-operate` 또는 `/schedule`을 사용한다.
3. tmux attached OMX CLI shell에서 foreground로 `npm run studio:v3:operate -- --axis garden-respecting-hud-assets --cycle-a-approved`를 실행한다. 단, Codex CLI 한도가 남아 있어야 한다.

## Current Safe State

Deliberation artifacts and Browser Use baseline already exist:

- `reports/deliberation/garden-respecting-hud-assets/spec.md`
- `items/0210-garden-hud-plot-marker-assets.md`
- `reports/visual/browser-use-recovery-20260505/README.md`
