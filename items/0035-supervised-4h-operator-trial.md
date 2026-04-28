# Supervised 4h operator trial

Status: review
Owner: agent
Created: 2026-04-28
Updated: 2026-04-28
Scope-risk: moderate
Work type: agent_ops
Issue: #53
Branch: runtime `.omx` + active feature branches

## Intent

2h supervised trial과 operator runbook/daily report gate 이후, 더 긴 4h 창에서 heartbeat/watchdog liveness, issue-to-PR loop, CI repair discipline, stop rule 준수, daily report readiness를 검증한다.

## Acceptance Criteria

- trial 시작 전 stop deadline, heartbeat interval, context snapshot, readiness checks, initial heartbeat가 기록된다.
- trial 중 5분 주기 heartbeat와 watchdog freshness가 유지된다.
- 최소 1개의 issue-to-PR loop를 완료하거나, 실패 시 honest blocker report를 남긴다.
- 완료 후 `reports/operations/operator-trial-*.md`에 heartbeat coverage, completed work, failures/recovery attempts, CI status, daily report 요약, next queue가 기록된다.
- red CI를 완료로 착각하지 않고 repair 또는 blocker report로 분류한다.

## Evidence

- Issue #53: https://github.com/bborok1234/strange-seed-shop/issues/53
- Initial context snapshot: `.omx/context/operator-4h-trial-20260428T051755Z.md`
- Initial heartbeat log: `.omx/logs/operator-4h-trial-20260428T051755Z.jsonl`
- Initial watchdog log: `.omx/logs/operator-4h-trial-watchdog-20260428T051755Z.log`
- Initial runner stuck report: `reports/operations/stuck-20260428-4h-trial-runner-exited.md`
- Restart context snapshot: `.omx/context/operator-4h-trial-restart-20260428T053230Z.md`
- Restart heartbeat log: `.omx/logs/operator-4h-trial-restart-20260428T053230Z.jsonl`
- Restart watchdog log: `.omx/logs/operator-4h-trial-watchdog-restart-20260428T053230Z.log`
- Completed restarted-loop PRs: #55, #57, #59, #61, #63, #65, #67, #69, #71, #73, #75, #77, #79, #81, #83
- Final report: `reports/operations/operator-trial-20260428T053230Z.md`
- Final live status: `reports/operations/operator-live-status-20260428.md`
- Final heartbeat count: 47; max heartbeat gap warning: 702.5s
- Follow-up issue: #84 heartbeat daemon hardening before 24h run

## Apply Conditions

- 실제 고객 데이터, credential, 결제, 로그인/account, ads SDK, external deployment, 실채널 GTM을 건드리지 않는다.
- `ENABLE_AGENT_AUTOMERGE`를 켜지 않는다.
- Branch protection과 required checks를 우회하지 않는다.
- Red CI, stale heartbeat, merge conflict, Browser Use blocker를 완료로 부르지 않는다.

## Verification

- `npm run operator:trial:readiness`
- `npm run check:operator`
- `npm run check:all`
- Final report branch verification: `npm run operator:trial:readiness` PASS, `npm run check:operator` PASS, `npm run check:all` PASS
- GitHub PR checks for any PR created during trial
- Main CI after any merge
