# GitHub metadata quality guard

Status: review
Work type: agent_ops
Issue: #128
Owner: agent
Created: 2026-04-29
Updated: 2026-04-29
Scope-risk: narrow

## Intent

최근 `$seed-ops` 루프에서 PR/issue/comment 본문이 기존 운영사 evidence 형식보다 지나치게 축약되었고, `gh` 인자 전달 방식 때문에 GitHub 화면에 `\n` 리터럴이 그대로 표시되었다. 이 문제는 개별 본문 수정만으로 끝낼 수 없고, 앞으로의 운영 루프가 같은 실수를 반복하지 않도록 지침과 검사로 막아야 한다.

## Small win

최근 PR/issue/comment metadata를 기존 evidence-rich 형식으로 복구하고, 앞으로 GitHub metadata는 markdown 파일을 만든 뒤 `--body-file`로 제출하도록 문서와 checker가 강제한다.

## Plan

1. 최근 영향 범위인 PR #122/#124/#126, issue #121/#123/#125/#127, 완료 댓글 #121/#123/#125를 확인한다.
2. `AGENTS.md`, `docs/PROJECT_COMMANDS.md`, GitHub issue/PR template에 metadata 품질 규칙을 추가한다.
3. `scripts/check-github-metadata-quality.mjs`를 추가하고 `npm run check:all`에 포함한다.
4. 최근 PR/issue/comment 본문을 기존 운영사 evidence 스타일로 복구한다.
5. 복구 보고서를 `reports/operations/`에 남긴다.
6. `npm run check:github-metadata`, `npm run check:project-commands`, `npm run check:all`로 검증한다.

## Acceptance Criteria

- GitHub metadata 작성 지침이 `AGENTS.md`와 `docs/PROJECT_COMMANDS.md`에 들어간다.
- PR/issue template이 기존 evidence-rich 섹션을 유지하고 literal `\n` 금지와 `--body-file` 사용을 명시한다.
- `npm run check:github-metadata`가 template/문서 지침을 검증한다.
- `npm run check:all`이 metadata checker를 포함한다.
- 최근 PR/issue/comment 본문이 사람이 읽을 수 있는 markdown으로 복구된다.

## Verification

- `npm run check:github-metadata`
- `npm run check:project-commands`
- `npm run check:all`

## Risks

- 이미 merge된 PR 본문은 GitHub metadata만 수정 가능하고 merge commit 자체는 바뀌지 않는다.
- GitHub live metadata 전체를 CI에서 항상 검사하면 credential/network 의존이 생긴다. 이번 checker는 repo-local template과 지침을 검사하고, 실제 live metadata 복구는 evidence report에 남긴다.

## Apply Conditions

- 게임 런타임/에셋/저장 스키마 변경 없음.
- 외부 배포, credential, 결제, 로그인, 광고, 고객 데이터 변경 없음.
- Branch protection 우회 없음.

## Evidence

- Issue: #128
- Branch: `codex/0073-github-metadata-quality-guard`
- GitHub metadata repaired: PR #122/#124/#126, issue #121/#123/#125/#127/#128, completion comments on #121/#123/#125.
- Closed completed issues after metadata repair: #121, #123, #125.
- Local verification:
  - `npm run check:github-metadata` PASS
  - `npm run check:project-commands` PASS
  - `npm run check:all` PASS
