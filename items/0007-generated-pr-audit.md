# PR 결과 audit 자동 생성

Status: verified
Owner: agent
Created: 2026-04-27
Updated: 2026-04-27
Scope-risk: narrow

## Intent

수동으로 갱신하던 PR 자동화 audit report를 `gh pr list` 기반으로 재생성할 수 있게 만들어, 자동화 결과 기록의 반복성을 높인다.

## Acceptance Criteria

- `npm run update:pr-audit`가 PR 목록을 조회해 `reports/audits/pr_automation_20260427.md`를 갱신한다.
- audit report가 PR #1부터 PR #7까지 포함한다.
- `npm run check:audit`가 생성된 audit report의 필수 항목을 검증한다.
- `npm run check:all`이 계속 통과한다.

## Evidence

- `scripts/update-pr-automation-audit.mjs`
- `reports/audits/pr_automation_20260427.md`
- 2026-04-27: `npm run update:pr-audit` 통과
- 2026-04-27: `npm run check:audit` 통과
- 2026-04-27: `npm run check:all` 통과

## Proposed Plan

- `gh pr list` 기반 audit 생성 스크립트를 추가한다.
- 기존 audit report를 스크립트 출력으로 갱신한다.
- audit check가 PR #1-#7과 생성 명령을 확인하게 한다.
- PR 단위로 GitHub Actions와 자동 머지 trial을 반복한다.

## Apply Conditions

- CI의 `check:all`은 네트워크/gh 인증에 의존하지 않는다.
- report 생성은 로컬 또는 승인된 GitHub CLI 환경에서 실행한다.
- 실제 Branch protection 또는 저장소 변수는 변경하지 않는다.

## Verification

- `npm run update:pr-audit`
- `npm run check:audit`
- `npm run check:all`
- `GITHUB_EVENT_NAME=pull_request PR_HEAD_REF=codex/generated-pr-audit PR_BASE_REF=main PR_IS_FORK=false PR_LABELS=agent-automerge npm run check:automerge`
