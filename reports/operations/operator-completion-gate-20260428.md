# Operator Completion Gate — 2026-04-28

Status: implementing
Issue: #17
Item: `items/0029-operator-completion-gate.md`
Branch: `codex/operator-completion-gate`
Scope-risk: narrow

## 목적

Ralph/session 운영사가 작업을 “완료”라고 부르기 전에 PR과 follow-up/audit 증거를 반드시 남기도록 gate를 고정한다. 이 gate는 구현 완료 보고보다 먼저 적용되며, red CI나 미기록 follow-up을 완료로 오인하지 않게 만든다.

## Completion checklist

| 항목 | Gate | 현재 증거 |
| --- | --- | --- |
| Issue/work item | GitHub issue 또는 `items/` 기록이 있다 | Issue #17, `items/0029-operator-completion-gate.md` |
| Branch | `codex/` 또는 `agent/` 브랜치에서 작업한다 | `codex/operator-completion-gate` |
| Heartbeat | issue, branch, item, current command, next action이 ledger에 남는다 | `reports/operations/operator-heartbeat-20260428.jsonl` |
| Local verification | `npm run check:all` 또는 좁은 검증 + 사유가 기록된다 | `npm run check:operator` PASS, `npm run check:all` PASS |
| Review evidence | 정책/운영 문서 변경은 reviewer/architect evidence를 남긴다 | Architect verification APPROVED |
| Draft PR | GitHub draft PR을 만들고 ready 전환 조건을 기록한다 | 생성 예정 |
| PR body | issue/item, checks, visual evidence 또는 N/A, risks, follow-up을 포함한다 | 생성 예정 |
| Follow-up/audit | 남은 위험은 issue/item/audit에 링크한다 | 이 report와 PR 자동화 audit policy |
| GitHub checks | red check는 CI repair loop로 전환한다 | PR 생성 후 확인 |
| Main verification | merge 시 main required checks와 merge commit을 확인한다 | merge 후 확인 |

## Audit/operation link rule

- 운영사 작업은 `reports/operations/operator-*.md`가 issue, branch, PR, local checks, GitHub checks, follow-up evidence를 함께 소유한다.
- PR 자동화 누적 audit은 `reports/audits/pr_automation_YYYYMMDD.md`와 `npm run update:pr-audit`가 소유한다.
- 개별 작업 item은 `Evidence`에 Issue/PR/check/report 링크를 남긴다.
- visual 변경이 있으면 `reports/visual/` 증거를 PR 본문과 item 양쪽에 링크한다.
- follow-up이 없으면 `none — 이유`를 명시해 누락과 의도적 종료를 구분한다.

## PR body requirements

- Issue: #17
- Item: `items/0029-operator-completion-gate.md`
- Operation report: `reports/operations/operator-completion-gate-20260428.md`
- Verification: `npm run check:operator`, `npm run check:all`, GitHub checks
- Visual evidence: `N/A — 운영 문서/checker 변경이며 UI 변화 없음`
- Remaining risk: branch protection과 red CI 우회 금지
- Follow-up: 필요 시 신규 issue, 없으면 `none — 이유`

## Verification plan

1. `npm run check:operator`로 completion gate 문서/report/checker 연결을 검증한다.
2. `npm run check:all`로 전체 baseline을 검증한다.
3. Draft PR 생성 후 GitHub required checks를 확인한다.
4. PR이 ready/merge 가능해지면 merge 후 `main` check run을 확인한다.

## Stop rules

- GitHub checks red: 완료 선언 금지, CI repair loop로 전환.
- credential/권한 필요: blocker report로 전환.
- follow-up risk 미기록: 완료 선언 금지.
- `ENABLE_AGENT_AUTOMERGE` 활성화 필요: 별도 명시 승인 전 금지.
