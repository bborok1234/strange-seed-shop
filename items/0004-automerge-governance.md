# 자동 머지 운영 거버넌스

Status: verified
Owner: agent
Created: 2026-04-27
Updated: 2026-04-27
Scope-risk: narrow

## Intent

PR 자동 머지 trial이 반복 가능해졌으므로, 저장소 변수와 브랜치 보호 규칙을 켜기 전에 운영 조건과 중단 조건을 문서와 점검 스크립트로 고정한다.

## Acceptance Criteria

- 자동 머지 운영 정책 문서가 존재한다.
- `ENABLE_AGENT_AUTOMERGE`, `agent-automerge`, required checks, Branch protection 조건이 문서화된다.
- 정책 문서와 workflow 핵심 조건을 확인하는 로컬 점검 명령이 있다.
- `npm run check:all`이 governance check를 포함한다.

## Evidence

- `docs/AUTOMERGE_GOVERNANCE.md`
- `docs/PR_AUTOMATION.md`
- `scripts/check-governance.mjs`
- 2026-04-27: `npm run check:governance` 통과
- 2026-04-27: `npm run check:all` 통과

## Proposed Plan

- 자동 머지 운영 문서를 추가한다.
- 기존 PR 자동화 문서에 Branch protection과 required checks를 명시한다.
- governance check 스크립트를 추가한다.
- 전체 검증에 governance check를 포함한다.
- PR 단위로 GitHub Actions 검증과 자동 머지 trial을 반복한다.

## Apply Conditions

- 실제 저장소 변수나 Branch protection 설정은 이 PR에서 변경하지 않는다.
- GitHub 설정 변경은 별도 action-time 승인과 audit report가 필요하다.

## Verification

- `npm run check:governance`
- `npm run check:all`
- `GITHUB_EVENT_NAME=pull_request PR_HEAD_REF=codex/automerge-governance PR_BASE_REF=main PR_IS_FORK=false PR_LABELS=agent-automerge npm run check:automerge`
