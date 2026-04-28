# Operator runbook and daily report template

Status: in_progress
Owner: agent
Created: 2026-04-28
Updated: 2026-04-28
Scope-risk: narrow
Work type: agent_ops
Issue: #51
Branch: `codex/operator-runbook-daily-report`

## Intent

2h supervised trial 성공 이후 4h/24h 운영으로 넘어가기 전에, 장시간 operator 세션의 start, monitor, recover, stop, summarize 절차와 daily operating report 형식을 checkable하게 고정한다.

## Acceptance Criteria

- `docs/OPERATOR_RUNBOOK.md`가 start, monitor, recover, stop, summarize 절차를 다룬다.
- `reports/operations/daily-template-20260428.md`가 completed work, failed work, open PRs, red checks, decisions, next queue를 포함한다.
- 4h supervised trial 전 readiness checklist와 24h dry-run readiness checklist가 분리되어 있다.
- `docs/README.md`, `docs/ROADMAP.md`, `reports/operations/README.md`가 새 문서를 가리킨다.
- `scripts/check-operator.mjs` 또는 docs checker가 runbook/report 핵심 문구를 검증한다.
- 실제 4h/24h 실행을 시작하지 않는다.
- `npm run check:operator`, `npm run check:docs`, `npm run check:all`이 통과한다.

## Evidence

- Issue #51: https://github.com/bborok1234/strange-seed-shop/issues/51
- Context snapshot: `.omx/context/operator-runbook-daily-report-20260428T050900Z.md`
- Runbook: `docs/OPERATOR_RUNBOOK.md`
- Daily template: `reports/operations/daily-template-20260428.md`
- Local check: `npm run check:operator` PASS
- Local check: `npm run check:docs` PASS
- Local check: `npm run check:all` PASS
- Architect verification: APPROVED
- PR: #52 https://github.com/bborok1234/strange-seed-shop/pull/52

## Proposed Plan

1. Operator runbook을 start/monitor/recover/stop/summarize 절차로 작성한다.
2. Daily operating report 템플릿을 사람이 아침에 바로 읽을 수 있는 구조로 만든다.
3. Docs index, operations README, roadmap next action을 갱신한다.
4. Checker가 runbook과 daily template의 핵심 섹션을 검증하게 한다.
5. 로컬 검증 후 PR을 만들고 GitHub checks를 확인한다.

## Apply Conditions

- 실제 고객 데이터, credential, 결제, 로그인/account, ads SDK, external deployment, 실채널 GTM을 건드리지 않는다.
- `ENABLE_AGENT_AUTOMERGE`를 켜지 않는다.
- Branch protection과 required checks를 우회하지 않는다.
- 새 dependency를 추가하지 않는다.
- 실제 4h/24h run을 시작하지 않는다.

## Verification

- `npm run check:operator`
- `npm run check:docs`
- `npm run check:all`
- GitHub PR checks: `Verify game baseline`, `Check automerge eligibility`
