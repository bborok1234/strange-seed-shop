# Heartbeat daemon hardening before 24h run

Status: review
Owner: agent
Created: 2026-04-28
Updated: 2026-04-28
Scope-risk: moderate
Work type: agent_ops
Issue: #84
Branch: codex/heartbeat-daemon-hardening

## Intent

Issue #53의 4h supervised trial은 issue-to-PR loop와 CI discipline은 통과했지만, PR/CI/merge 작업 중 heartbeat gap이 702.5초로 600초 freshness threshold를 초과했다. 24h run 전 heartbeat/reporting을 foreground agent loop와 분리하고, gap 초과를 dry-run failure로 고정한다.

## Acceptance Criteria

- heartbeat daemon runner가 별도 process에서 5분 이하 주기로 heartbeat를 쓸 수 있다.
- watchdog이 stale heartbeat를 감지하면 stuck report를 자동으로 남길 수 있다.
- dry-run fixture가 600초 초과 heartbeat gap을 `dry-run-review` / non-zero exit로 분류한다.
- `npm run operator:trial:gap-guard`, `npm run operator:watchdog:stuck-guard`, `npm run check:operator`, `npm run check:all`이 통과한다.
- credentials/customer data/payment/login/ads/external deployment/real GTM은 건드리지 않는다.

## Evidence

- Follow-up issue: https://github.com/bborok1234/strange-seed-shop/issues/84
- 4h source warning: `reports/operations/operator-trial-20260428T053230Z.md`
- Daemon script: `scripts/operator-heartbeat-daemon.mjs`
- Gap guard: `scripts/check-operator-trial-gap-guard.mjs`
- Stuck-report guard: `scripts/check-operator-watchdog-stuck-report.mjs`
- Stale gap fixture: `reports/operations/fixtures/operator-trial-stale-gap-scenario-20260428.json`
- Stale gap report: `reports/operations/operator-trial-stale-gap-guard-20260428.md`
- Hardening report: `reports/operations/heartbeat-daemon-hardening-20260428.md`

## Apply Conditions

- 실제 고객 데이터, credential, 결제, 로그인/account, ads SDK, external deployment, 실채널 GTM을 건드리지 않는다.
- `ENABLE_AGENT_AUTOMERGE`를 켜지 않는다.
- Branch protection과 required checks를 우회하지 않는다.
- Stale heartbeat를 완료로 부르지 않는다.

## Verification

- `npm run operator:trial:dry-run`
- `npm run operator:trial:gap-guard`
- `npm run operator:watchdog:stuck-guard`
- `npm run check:operator`
- `npm run check:all`
