# PR 자동 검증과 제한적 자동 머지 실험

Status: verified
Owner: agent
Created: 2026-04-27
Updated: 2026-04-27
Scope-risk: moderate

## Intent

프로젝트가 인간 수동 조작 없이도 작은 작업 단위를 검증하고 병합 준비까지 진행할 수 있는 최소 구조를 만든다.

## Acceptance Criteria

- PR과 `main` push에서 전체 검증이 실행된다.
- 자동 머지 후보 조건이 스크립트로 검증된다.
- 자동 머지는 기본 비활성 상태이며, 저장소 변수와 label이 모두 있어야만 후보가 된다.
- 조건과 위험이 문서화된다.

## Evidence

- `.github/workflows/ci.yml`
- `.github/workflows/agent-automerge.yml`
- `scripts/check-automerge-readiness.mjs`
- `docs/PR_AUTOMATION.md`
- 2026-04-27: `npm run check:automerge` 성공 조건 통과
- 2026-04-27: `npm run check:automerge` 로컬 기본값 실패 조건 확인
- 2026-04-27: `npm run check:all` 통과

## Proposed Plan

- CI workflow를 추가한다.
- 자동 머지 후보 판정 스크립트를 추가한다.
- 자동 머지 trial workflow를 추가하되 기본 상태에서는 merge가 실행되지 않게 둔다.
- 정책 문서를 추가한다.
- 로컬 검증 명령으로 후보 판정과 전체 체크를 확인한다.

## Apply Conditions

- 실제 GitHub PR 생성 또는 머지는 별도 사용자 승인 또는 명시 요청이 있을 때만 수행한다.
- 자동 머지는 fork PR, draft PR, label 없는 PR, `main` 외 base branch에서는 작동하지 않아야 한다.

## Verification

- `npm run check:automerge`를 성공 조건과 실패 조건으로 실행한다.
- `npm run check:all`을 실행한다.
