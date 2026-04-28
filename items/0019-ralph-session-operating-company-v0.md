# 0019 Ralph-session 운영사 v0 기반

Status: in_progress
Owner: agent
Created: 2026-04-28
Updated: 2026-04-28
Scope-risk: moderate
Work type: agent_ops
Issue: #25
Branch: `codex/ralph-operator-v0`

## Intent

장시간 `$ralph` 실행을 다시 주장하기 전에, 한 세션이 작은 운영사처럼 살아있음과 진행 상태를 증명하고 red CI나 stuck 상태를 정직하게 복구/보고할 수 있게 만든다.

## Acceptance Criteria

- operator work item schema가 work type, safety gate, verification evidence를 구분한다.
- heartbeat ledger가 `.omx/state/operator-heartbeat.json`와 `reports/operations/operator-heartbeat-*.jsonl`에 timestamp, phase, branch, PR, current command, next action을 남긴다.
- stuck report 절차와 report 생성 스크립트가 존재한다.
- CI repair loop가 red check 로그 확인, local reproduction, fix attempt, rerun, blocker report 순서로 문서화된다.
- issue → branch → commit → PR → local checks → GitHub checks → follow-up evidence가 `reports/operations/operator-loop-20260428.md`와 PR comment에 남는다.

## Evidence

- Local check: `npm run check:operator` 통과
- Local check: `npm run check:all` 통과
- GitHub issue: #25
- PR: #26
- Follow-up issue: #27
- Context snapshot: `.omx/context/ralph-operator-v0-20260428T021315Z.md`
- Heartbeat report: `reports/operations/operator-heartbeat-20260428.jsonl`
- Stuck drill: `reports/operations/stuck-drill-20260428.md`
- Loop report: `reports/operations/operator-loop-20260428.md`

## Proposed Plan

1. 운영사 work item taxonomy와 safety gates를 문서화한다.
2. heartbeat/stuck report helper script를 추가한다.
3. `npm run check:operator`로 Milestone 6 표면을 검증한다.
4. local `npm run check:all`을 통과시킨다.
5. PR을 만들고 GitHub checks를 확인한다.
6. follow-up issue/comment를 남겨 다음 운영사 단계로 이어간다.

## Apply Conditions

- 실제 결제, credential, 고객 데이터, 실채널 GTM, 외부 배포를 건드리지 않는다.
- `ENABLE_AGENT_AUTOMERGE`를 켜지 않는다.
- Branch protection이나 required checks를 우회하지 않는다.
- 새 dependency를 추가하지 않는다.

## Verification

- `npm run check:operator`
- `npm run check:all`
- GitHub PR checks: `Verify game baseline`, `Check automerge eligibility`
