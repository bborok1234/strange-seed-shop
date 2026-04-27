# GitHub Branch protection 설정 audit

Status: verified
Owner: agent
Created: 2026-04-27
Updated: 2026-04-27
Scope-risk: narrow

## Intent

자동 머지 trial을 실제 무인 운영으로 확대하기 전에 `main` branch가 required checks를 강제하는지 확인하고, 현재 위험을 audit report로 남긴다.

## Acceptance Criteria

- `main` branch의 protected 상태를 GitHub API로 확인한다.
- Branch protection endpoint 결과 또는 제한 사유를 기록한다.
- `ENABLE_AGENT_AUTOMERGE` 활성화 가능 여부를 판단한다.
- audit report가 `npm run check:audit`에 포함된다.

## Evidence

- `reports/audits/branch_protection_20260427.md`
- 2026-04-27: `main.protected=false` 확인
- 2026-04-27: protection endpoint가 `HTTP 403` 반환
- 2026-04-27: `npm run check:audit` 통과

## Proposed Plan

- GitHub API로 branch 상태를 조회한다.
- 조회 결과를 audit report로 남긴다.
- audit check에 필수 문구를 추가한다.
- 대시보드와 로드맵의 다음 작업을 갱신한다.

## Apply Conditions

- 이 작업에서는 GitHub 설정을 변경하지 않는다.
- Branch protection 또는 저장소 변수 변경은 별도 승인과 별도 audit이 필요하다.

## Verification

- `npm run check:audit`
- `npm run check:all`
- `GITHUB_EVENT_NAME=pull_request PR_HEAD_REF=codex/branch-protection-audit PR_BASE_REF=main PR_IS_FORK=false PR_LABELS=agent-automerge npm run check:automerge`
