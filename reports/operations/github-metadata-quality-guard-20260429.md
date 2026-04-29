# GitHub metadata quality guard - 2026-04-29

## Summary

최근 `$seed-ops` 루프에서 GitHub PR/issue/comment 본문이 축약되고 literal `\n`이 화면에 표시된 문제를 복구했다. 개별 본문만 고치지 않고, 앞으로 같은 회귀가 생기지 않도록 지침, GitHub template, repo-local checker를 함께 추가했다.

## Repaired Metadata

- PR #122: rich PR body, `작업 checklist`, Browser Use evidence/blocker 항목, 검증/안전/남은 위험 복구.
- PR #124: rich PR body, compact UI small win, visual evidence, main CI evidence 복구.
- PR #126: rich PR body, asset plan/prompt evidence, N/A 사유, 후속 issue #127 risk 복구.
- Issue #121, #123, #125: issue template 기반 본문 복구 후 완료 상태로 close.
- Issue #127: active asset generation issue 본문을 plan-first 형식으로 복구.
- Issue #128: metadata guard issue 본문을 template 기반으로 정리.
- Completion comments #121/#123/#125: PR, merge commit, PR checks, main CI, local verification, small win, follow-up risk를 포함하도록 복구.

## Guardrails Added

- `AGENTS.md`: GitHub metadata는 운영사 evidence surface이며 markdown file + `--body-file`/API file payload로 제출해야 함을 명시.
- `docs/PROJECT_COMMANDS.md`: literal `\n` 금지, PR `작업 checklist`, Browser Use 우선 QA evidence 또는 blocker, 완료 댓글 축약 금지를 명시.
- `.github/pull_request_template.md`: `작업 checklist`, Browser Use evidence/blocker, Browser Use QA 검증 항목 추가.
- `.github/ISSUE_TEMPLATE/agent-work-item.md`: Browser Use 우선 QA 계획 항목 추가.
- `scripts/check-github-metadata-quality.mjs`: template/docs/package에 metadata 품질 규칙이 남아 있는지 검사.
- `package.json`: `check:github-metadata`를 추가하고 `check:all`에 포함.

## Verification

- `npm run check:github-metadata` PASS
- `npm run check:project-commands` PASS

## Remaining Risk

- GitHub live metadata 전체를 CI에서 매번 검사하면 credential/network 의존이 생긴다. 이번 checker는 repo-local contract를 막고, live 복구는 이 보고서와 GitHub 재조회 evidence로 남겼다.
- #127 static asset generation은 사용자 지적에 따라 paused 상태로 남겼다. 생성된 후보 이미지는 아직 repo에 편입하지 않았다.
