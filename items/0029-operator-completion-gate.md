# Operator completion gate

Status: in_progress
Owner: agent
Created: 2026-04-28
Updated: 2026-04-28
Scope-risk: narrow
Work type: agent_ops
Issue: #17
Branch: `codex/operator-completion-gate`

## Intent

작업 구현이 끝났다는 내부 판단만으로 완료를 선언하지 않게 하고, `draft PR`, 검증 증거, 남은 위험, follow-up issue/audit 링크가 모두 남아야 작업이 완료되는 운영사 gate를 고정한다.

## Acceptance Criteria

- `docs/PR_AUTOMATION.md`에 “작업 완료 → draft PR → follow-up issue/audit” 체크리스트가 있다.
- PR/issue 링크를 운영 report, audit report, work item evidence에 남기는 방식이 문서화된다.
- `scripts/check-operator.mjs`가 completion gate 문서와 report의 핵심 문구를 검증한다.
- `npm run check:operator`와 `npm run check:all`이 통과한다.

## Evidence

- Issue #17: https://github.com/bborok1234/strange-seed-shop/issues/17
- Operation report: `reports/operations/operator-completion-gate-20260428.md`
- Context snapshot: `.omx/context/operator-completion-gate-20260428T035100Z.md`
- Heartbeat report: `reports/operations/operator-heartbeat-20260428.jsonl`
- Local check: `npm run check:operator` PASS
- Local check: `npm run check:all` PASS
- Architect verification: APPROVED
- PR: #42 https://github.com/bborok1234/strange-seed-shop/pull/42

## Proposed Plan

1. PR 자동화 문서에 작업 완료 gate와 PR 본문 최소 템플릿을 추가한다.
2. 운영사 모델과 operations README에 completion gate artifact 경로를 연결한다.
3. completion gate report와 work item을 작성한다.
4. `check:operator`가 gate 누락을 실패로 잡게 한다.
5. 로컬 검증 후 draft PR을 만들고 GitHub checks/merge 상태를 기록한다.

## Apply Conditions

- 실제 고객 데이터, credential, 결제, 배포, 실채널 GTM을 건드리지 않는다.
- `ENABLE_AGENT_AUTOMERGE`를 켜지 않는다.
- Branch protection과 required checks를 우회하지 않는다.
- 새 dependency를 추가하지 않는다.

## Verification

- `npm run check:operator`
- `npm run check:all`
- GitHub PR checks: `Verify game baseline`, `Check automerge eligibility`
