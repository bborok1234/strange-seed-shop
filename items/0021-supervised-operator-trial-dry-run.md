# 0021 Supervised operator trial dry-run

Status: in_progress
Owner: agent
Created: 2026-04-28
Updated: 2026-04-28
Scope-risk: moderate
Work type: agent_ops
Issue: #29
Branch: `codex/operator-trial-dry-run`

## Intent

실제 2시간/4시간/24시간 운영사 실행 전에, trial report lifecycle를 deterministic fixture로 채워 보고 장시간 대기 없이 검증한다.

## Acceptance Criteria

- trial dry-run generator가 fixture scenario를 읽어 report를 생성한다.
- report는 heartbeat coverage, completed work, failures and recovery attempts, CI status, stop rules, next queue를 포함한다.
- dry-run은 실제 장시간 실행을 시작하지 않는다.
- `npm run check:operator`와 `npm run check:all`이 dry-run 산출물을 검증한다.

## Evidence

- Follow-up issue: #29
- PR: #30
- Next follow-up issue: #31
- Scenario fixture: `reports/operations/fixtures/operator-trial-dry-run-scenario-20260428.json`
- Dry-run report: `reports/operations/operator-trial-dry-run-20260428.md`

## Proposed Plan

1. deterministic scenario fixture를 만든다.
2. `scripts/operator-trial-dry-run.mjs`가 fixture를 report로 렌더링하게 한다.
3. `check:operator`에 dry-run report 검증을 추가한다.
4. PR checks와 후속 issue evidence를 남긴다.

## Apply Conditions

- 실제 2h/4h/24h 실행을 시작하지 않는다.
- credential, 고객 데이터, 실채널 GTM, 외부 배포, 결제/로그인/광고 SDK를 건드리지 않는다.
- main 자동 merge 변수나 branch protection 설정을 바꾸지 않는다.

## Verification

- `npm run operator:trial:dry-run`
- `npm run check:operator`
- `npm run check:all`
