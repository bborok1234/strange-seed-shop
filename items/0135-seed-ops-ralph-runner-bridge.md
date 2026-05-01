# Seed ops Ralph runner bridge

Status: verified
Owner: agent
Created: 2026-05-02
Updated: 2026-05-02
Work type: ops_harness
Scope-risk: moderate
Issue: local

## Intent

`$seed-ops`와 Codex App prompt-side `$ralph` activation이 실제 장시간 Ralph/OMX runner와 어떻게 연결되는지 명확히 분리한다. 현재 `$ralph` keyword hook은 `.omx/state/sessions/<id>/ralph-state.json`을 seed하지만, 예전 4시간 이상 운영처럼 `omx exec`/heartbeat/watchdog runner를 자동으로 시작하지 않는다. 이 차이를 하네스가 감지하고, seed-ops 장시간 운영이 필요할 때 어떤 runner path를 써야 하는지 구조화한다.

## Evidence

- Current prompt-side state: `.omx/state/sessions/019de3f6-4472-7cd1-a549-aa9eb399c536/ralph-state.json`
- Current state: `active: true`, `current_phase: "starting"`, `iteration: 0`
- Current skill active state: `.omx/state/sessions/019de3f6-4472-7cd1-a549-aa9eb399c536/skill-active-state.json`
- Historical long runner: `.omx/tasks/overnight-ralph-driver-20260427T1515.sh`
- Historical operator heartbeat runner: `.omx/logs/operator-4h-trial-runner-20260428T051755Z.sh`
- Review report: `reports/operations/ralph-state-contract-review-20260502.md`

## Plan

1. Confirm the three distinct modes:
   - prompt-side `$ralph` activation: skill state only.
   - current foreground Codex App execution: direct tool loop in this thread.
   - detached long runner: shell/OMX runner with heartbeat/watchdog.
2. Add a lightweight checker or report contract that reports `active:true/current_phase:"starting"` Ralph state as `prompt-side-only` when no runner heartbeat exists.
3. Define a seed-ops runner decision table:
   - short foreground issue loop: use current Codex App tools + operator heartbeat.
   - long overnight/trial loop: require explicit detached runner artifact and heartbeat daemon.
   - PR/CI wait loop: require heartbeat phase and watchdog source, not assistant final summaries.
4. Update project command/runbook docs so `$seed-ops` does not imply real `omx ralph` runner unless a runner artifact is started.
5. Verify with `npm run check:ralph-runner-bridge`, `npm run check:ops-live`, `npm run check:seed-ops-publication-gate`, and `npm run check:ci`.

## Acceptance Criteria

- [x] Docs distinguish prompt-side `$ralph` activation from detached `omx ralph`/`omx exec` runner execution.
- [x] A stale prompt-side Ralph state without active heartbeat/runner is reported as `prompt-side-only`, not treated as a live long runner.
- [x] Seed-ops long-run mode requires heartbeat/watchdog runner evidence before claiming 4h/6h/overnight autonomy.
- [x] PR/CI wait continuation is represented by heartbeat phase and watchdog source, not assistant final summaries.
- [x] `npm run check:ops-live` and `npm run check:ci` pass.

## Verification

- `npm run check:ralph-runner-bridge` pass. Current session `.omx/state/sessions/019de3f6-4472-7cd1-a549-aa9eb399c536/ralph-state.json` is classified as `prompt-side-only`, and detached runner count is 0.
- `npm run check:seed-ops-queue` pass.
- `npm run check:seed-ops-publication-gate` pass.
- `npm run check:ops-live` pass.
- `npm run check:operator` pass.
- `npm run check:ci` pass.

## Risks

Starting an actual detached `omx ralph`/`omx exec` runner from Codex App may be undesirable during normal foreground work. The first pass should separate mode detection and evidence, not automatically launch long-running shells.
