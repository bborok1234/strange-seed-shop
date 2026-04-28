# 0020 Operator watchdog runner와 trial report scaffold

Status: in_progress
Owner: agent
Created: 2026-04-28
Updated: 2026-04-28
Scope-risk: moderate
Work type: agent_ops
Issue: #27
Branch: `codex/operator-watchdog-runner`

## Intent

#26에서 만든 heartbeat/stuck/CI repair 표면을 한 단계 발전시켜, Ralph-session이 멈췄는지 외부에서 판정하고 Milestone 7 supervised trial을 준비할 수 있게 한다.

## Acceptance Criteria

- watchdog runner가 JSON 또는 JSONL heartbeat를 읽고 fresh/stale/missing/invalid를 판정한다.
- watchdog drill report가 fresh와 stale 상태를 모두 증명한다.
- operator trial report template이 heartbeat coverage, completed work, failures, CI status, recovery attempts를 기록할 수 있다.
- `npm run check:operator`가 watchdog runner와 trial scaffold를 검증한다.
- 실제 2h/4h/24h 장시간 실행은 시작하지 않는다.

## Evidence

- Follow-up issue: #27
- PR: #28
- Next follow-up issue: #29
- Fresh watchdog drill: `reports/operations/watchdog-fresh-drill-20260428.md`
- Stale watchdog drill: `reports/operations/watchdog-stale-drill-20260428.md`
- Trial template: `reports/operations/operator-trial-template-20260428.md`

## Proposed Plan

1. `scripts/operator-watchdog.mjs`를 추가해 deterministic freshness check를 만든다.
2. fixed `--now` 값을 사용한 fresh/stale drill report를 생성한다.
3. supervised trial template을 추가한다.
4. docs/roadmap/dashboard/check:operator를 갱신한다.
5. 로컬/PR/GitHub checks로 검증한다.

## Apply Conditions

- 장시간 runner를 실제로 실행하지 않는다.
- credential, 고객 데이터, 실채널 GTM, 결제/로그인/광고 SDK를 건드리지 않는다.
- main 자동 merge 변수나 branch protection 설정을 바꾸지 않는다.

## Verification

- `npm run check:operator`
- `npm run check:all`
- GitHub PR checks: `Verify game baseline`, `Check automerge eligibility`
