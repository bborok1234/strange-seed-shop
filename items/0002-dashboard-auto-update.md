# 대시보드 자동 갱신

Status: verified
Owner: agent
Created: 2026-04-27
Updated: 2026-04-27
Scope-risk: narrow

## Intent

수동으로 관리하던 `docs/DASHBOARD.md`를 로드맵과 주요 파일 상태에서 재생성할 수 있게 만들어, 에이전트가 현재 상태를 더 안정적으로 확인하게 한다.

## Acceptance Criteria

- `npm run update:dashboard`가 `docs/DASHBOARD.md`를 생성한다.
- `npm run check:dashboard`가 대시보드 최신성을 검증한다.
- `npm run check:all`에 dashboard check가 포함된다.
- 로드맵에 대시보드 자동 갱신 상태가 반영된다.

## Evidence

- `scripts/update-dashboard.mjs`
- `docs/DASHBOARD.md`
- 2026-04-27: `npm run check:dashboard` 통과
- 2026-04-27: `npm run check:all` 통과

## Proposed Plan

- 대시보드 생성 스크립트를 추가한다.
- 생성 결과를 `docs/DASHBOARD.md`에 반영한다.
- `check:dashboard`를 전체 검증에 포함한다.
- PR 단위로 GitHub Actions 검증과 자동 머지 후보 판정을 확인한다.

## Apply Conditions

- 제품 런타임 코드는 변경하지 않는다.
- dashboard는 생성 스크립트 결과와 일치해야 한다.
- GitHub PR 생성과 merge는 기존 자동화 실험 조건을 따른다.

## Verification

- `npm run check:all`
- `GITHUB_EVENT_NAME=pull_request PR_HEAD_REF=codex/dashboard-auto-update PR_BASE_REF=main PR_IS_FORK=false PR_LABELS=agent-automerge npm run check:automerge`
