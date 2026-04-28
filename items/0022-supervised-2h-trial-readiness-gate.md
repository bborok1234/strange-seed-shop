# 0022 Supervised 2h trial readiness gate

Status: in_progress
Owner: agent
Created: 2026-04-28
Updated: 2026-04-28
Scope-risk: moderate
Work type: agent_ops
Issue: #31
Branch: `codex/operator-trial-readiness`

## Intent

실제 2시간 supervised operator trial을 시작하기 전에, 시간/토큰/브랜치/네트워크/credential 중단 조건과 monitor command를 검증 가능한 readiness gate로 고정한다.

## Acceptance Criteria

- readiness report가 time, token/context, branch, network, credential, heartbeat, CI repair, automerge stop rules를 포함한다.
- readiness check script가 report의 필수 gate를 검증한다.
- 이 작업은 실제 2h run을 시작하지 않는다.
- `npm run operator:trial:readiness`, `npm run check:operator`, `npm run check:all`이 통과한다.

## Evidence

- Follow-up issue: #31
- PR: #32
- Next follow-up issue: #33
- Readiness report: `reports/operations/operator-trial-readiness-20260428.md`
- Readiness check: `scripts/check-operator-trial-readiness.mjs`

## Proposed Plan

1. readiness report를 작성한다.
2. report 검증 스크립트를 추가한다.
3. `check:operator`와 dashboard/roadmap에 연결한다.
4. PR checks와 다음 follow-up issue를 남긴다.

## Apply Conditions

- 실제 2h/4h/24h 실행을 시작하지 않는다.
- credential, 고객 데이터, 실채널 GTM, 외부 배포, 결제/로그인/광고 SDK를 건드리지 않는다.
- main 자동 merge 변수나 branch protection 설정을 바꾸지 않는다.

## Verification

- `npm run operator:trial:readiness`
- `npm run check:operator`
- `npm run check:all`
