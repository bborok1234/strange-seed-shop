# Supervised 2h operator trial

Status: in_progress
Owner: agent
Created: 2026-04-28
Updated: 2026-04-28
Scope-risk: moderate
Work type: agent_ops
Issue: #33
Branch: `codex/operator-2h-trial-report`

## Intent

2h supervised trial을 실제 시간 경과로 실행하고, Ralph 운영사가 heartbeat, watchdog, issue-to-PR loop, CI repair/merge discipline, stop rule을 지키며 계속 전진할 수 있는지 증거로 남긴다.

## Acceptance Criteria

- 2h supervised trial 시작/완료 시간이 report에 기록된다.
- Heartbeat coverage가 5분 주기 기준으로 pass 판정을 받는다.
- Completed work에 trial 중 닫은 issue/PR 목록이 남는다.
- Red CI를 완료로 착각하지 않고 repair 또는 blocker로 분류했다는 증거가 있다.
- Stop rules observed 섹션이 credential, 고객 데이터, 결제, 로그인, ads SDK, 실채널 GTM, external deployment, main 자동 merge 금지를 확인한다.
- `npm run check:operator`와 `npm run check:all`이 통과한다.

## Evidence

- Issue #33: https://github.com/bborok1234/strange-seed-shop/issues/33
- Operation report: `reports/operations/operator-trial-20260428T025400Z.md`
- Runtime heartbeat log: `.omx/logs/operator-2h-trial-20260428T025400Z.jsonl`
- Runtime watchdog log: `.omx/logs/operator-2h-trial-watchdog-20260428T025400Z.log`
- Runtime summary: `.omx/logs/operator-2h-trial-20260428T025400Z.summary.md`
- Context snapshot: `.omx/context/operator-2h-trial-20260428T025400Z.md`
- Heartbeat coverage: pass, Observed heartbeat count: 24
- Completed loop evidence: PR #35, PR #37, PR #39, PR #40, PR #41, PR #42, PR #43, PR #45, PR #47, PR #49
- Local check: `npm run check:operator` PASS
- Local check: `npm run check:all` PASS
- Architect verification: APPROVED
- PR: pending

## Proposed Plan

1. Runtime `.omx` heartbeat/watchdog evidence를 durable operation report로 요약한다.
2. Trial 중 완료된 issue/PR/CI 상태를 표로 고정한다.
3. Stop rule 준수와 실패/복구 시도를 명시한다.
4. `scripts/check-operator.mjs`가 report와 item 누락을 잡도록 확장한다.
5. 로컬 검증 후 draft PR을 만들고 GitHub checks를 확인한 뒤 Issue #33을 닫는다.

## Apply Conditions

- 실제 고객 데이터, credential, 결제, 로그인/account, ads SDK, external deployment, 실채널 GTM을 건드리지 않는다.
- `ENABLE_AGENT_AUTOMERGE`를 켜지 않는다.
- Branch protection과 required checks를 우회하지 않는다.
- 새 dependency를 추가하지 않는다.

## Verification

- `npm run check:operator`
- `npm run check:all`
- GitHub PR checks: `Verify game baseline`, `Check automerge eligibility`
