# Operator live status report

Status: in_progress
Owner: agent
Created: 2026-04-28
Updated: 2026-04-28
Scope-risk: narrow
Work type: agent_ops
Issue: #62
Branch: `codex/operator-live-status-report`

## Intent

장시간 `$ralph` 운영 trial 중 사람이 중간에 돌아와도 현재 heartbeat, deadline, 완료 PR, recovery, next action을 한 파일에서 확인할 수 있게 한다.

## Acceptance Criteria

- `npm run operator:live-status`가 현재 runtime `.omx` env/heartbeat를 읽어 `reports/operations/operator-live-status-20260428.md`를 생성한다.
- 보고서에는 Heartbeat freshness, heartbeat count, deadline, last heartbeat, Completed issue-to-PR loops, known recovery, next action이 있다.
- runtime env가 없을 때도 script는 not-running/stale 상태를 보고 가능하게 설계된다.
- `npm run check:operator`가 live status script/report/package entry를 검증한다.
- `npm run check:all`이 통과한다.

## Evidence

- Issue #62: https://github.com/bborok1234/strange-seed-shop/issues/62
- Context snapshot: `.omx/context/operator-live-status-20260428T062425Z.md`
- Live status report: `reports/operations/operator-live-status-20260428.md`
- Local generation: `npm run operator:live-status` PASS
- Independent report check: `node scripts/update-operator-live-status.mjs --check --output reports/operations/operator-live-status-20260428.md` PASS
- Local check: `npm run check:operator` PASS
- Local check: `npm run check:all` PASS
- Architect verification: APPROVED
- Deslop: changed-files-only pass; report date/check mismatch fixed
- PR: #63 https://github.com/bborok1234/strange-seed-shop/pull/63

## Apply Conditions

- GitHub settings, branch protection, secrets, credentials, external deployment를 변경하지 않는다.
- 고객 데이터, 결제, 로그인/account, ads SDK, 실채널 GTM을 건드리지 않는다.
- 실제 24h 실행을 시작하지 않는다.
- `.omx` runtime logs는 커밋하지 않고, versioned report만 snapshot으로 남긴다.

## Verification

- `npm run operator:live-status`
- `npm run check:operator`
- `npm run check:all`
- GitHub PR checks: `Verify game baseline`, `Check automerge eligibility`
