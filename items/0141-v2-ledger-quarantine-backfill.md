# v2 local ledger quarantine/backfill

Status: review
Work type: agent_ops
Issue: #274
Branch: codex/0274-v2-ledger-quarantine
Owner: Codex
Created: 2026-05-03
Updated: 2026-05-03
Scope-risk: moderate

## GitHub 권위 WorkUnit

- Source of truth: GitHub issue #274 `로컬 v2 campaign ledger를 v3 WorkUnit evidence로 격리/백필`
- Queue decision: #276은 PR #279로 merge되고 main CI `25256607105`가 통과했다. 남은 GitHub queue는 #274/#275이며, 사용자 지정 순서와 v3 ledger authority 차단 필요성 때문에 #274를 먼저 진행한다.
- Local ledger rule: v2 `campaigns/**`, recovery branch, stash는 work authorization source가 아니라 `quarantined` 또는 `migration-backfill` evidence다.
- 연결 evidence: `reports/operations/local-studio-work-recovery-20260503.md`, #276 `check:studio-v3-bot-runner` gate.

## Plan

1. `reports/operations/local-studio-work-recovery-20260503.md`, `stash@{0}`, recovery branch 보존 상태, 현재 main의 관련 파일 존재 여부를 read-only로 확인한다.
2. v2 local ledger 산출물을 그대로 authority로 merge하지 않고, GitHub v3 기준 `quarantined`/`migration-backfill` evidence manifest로 분리한다.
3. 필요한 경우 `reports/operations/` 아래 migration manifest/report와 deterministic checker를 추가해 local ledger가 work authorization source가 아님을 검증한다.
4. prototype/evidence 파일의 보존/삭제/이관 기준을 PR body와 report에 명시한다. 실제 production game code(`src/App.tsx`, `src/styles.css`, visual regression test)는 포함하지 않는다.
5. `stash@{0}`와 recovery branch 보존 상태를 보고한다. stash drop, reset --hard, 전체 clean은 하지 않는다.
6. `npm run check:docs`, #276의 `npm run check:studio-v3-bot-runner`, 추가 migration checker, `npm run check:ci`를 실행한다.
7. GitHub issue #274 acceptance checkbox를 body-file로 갱신하고 PR/check/merge/main CI까지 진행한다.

## 수용 기준

- [x] v2 local ledger 산출물이 GitHub v3 기준에서 `quarantined` 또는 `migration-backfill`로 명시된다.
- [x] local ledger가 work authorization source가 아니라 evidence mirror임을 문서와 checker가 강제한다.
- [x] prototype/evidence 파일의 보존/삭제/이관 기준이 PR body/report에 명시된다.
- [x] `stash@{0}`와 recovery branch의 보존 상태가 보고된다.
- [x] `npm run check:docs`와 관련 harness checker가 통과한다.

## 검증 명령

- `npm run check:docs`
- `npm run check:studio-v3-bot-runner`
- `npm run check:ci`
- 추가 시: `npm run check:studio-v3-migration-backfill`

## Subagent/Team Routing decision

- 사용: Codex native `explorer` 1개가 #274 범위의 stash/recovery branch/main 상태와 관련 checker surface를 read-only 매핑한다.
- 미사용: worker 병렬 구현은 문서/manifest/checker write scope가 겹쳐 leader가 통합 구현한다.

## Game Studio route

- 해당 없음: #274는 operator/harness migration evidence WorkUnit이며 visible gameplay/HUD/asset/Browser Use gate를 직접 변경하지 않는다.
- production game code와 visual QA는 #275에서 별도 `game-studio:game-studio`/`game-playtest` route로 처리한다.

## 안전 범위 / 비범위

- production game code merge 없음: `src/App.tsx`, `src/styles.css`, `tests/visual/p0-mobile-game-shell.spec.ts`는 #274 PR 범위 밖이다.
- 새 asset generation 없음.
- `stash@{0}` drop 금지, `git reset --hard`, `git clean -fd`, 전체 restore 금지.
- local v2 ledger를 gate authority로 승격하지 않는다.
- GitHub issue/PR/comment 본문은 markdown body file로만 게시한다.

## 리스크

- recovery branch/stash가 이미 삭제됐거나 이름이 달라졌을 수 있다. 이 경우 GitHub issue/report의 기존 evidence와 현재 `git stash list`/`git branch` 결과를 함께 기록한다.
- prototype/evidence 파일을 실제로 모두 복원하면 PR이 비대해질 수 있다. 우선 manifest/report/checker로 격리 기준을 명시하고, 대용량/visual 파일 이관은 별도 follow-up으로 분리한다.
- local ledger backfill은 절대 GitHub WorkUnit 완료 권한이 아니며, #275 production code 적용을 대신하지 않는다.

## Evidence

- 2026-05-03: #276 PR #279 merge 완료, main CI `25256607105` pass 확인 후 #274 plan-first 시작.
- 2026-05-03: `git stash list --date=local` 확인: current `stash@{0}`는 `codex/recover-local-studio-work-20260503` classified recovery diff, `stash@{1}`는 PR #273 이후 cleanup backup.
- 2026-05-03: `git stash show --include-untracked --name-only stash@{0}`와 `stash@{1}` 모두 123 paths, campaigns 44, prototypes 13, visual 24, asset prompt 2, production code 3, legacy harness 3으로 확인.
- 2026-05-03: 현재 main tree에는 `campaigns/`, `prototypes/`, `.codex/skills/seed-studio/SKILL.md`, `scripts/check-studio-harness.mjs`, `items/0138-studio-harness-v2-first-pass.md`, `assets/source/portrait_variant_asset_*_20260502.json`가 없음.
- 2026-05-03: `reports/operations/studio-v3-migration-backfill-20260503.json`와 `.md`로 `quarantined`/`migration-backfill`/`excluded-follow-up #275` 분류를 기록.
- 2026-05-03: `scripts/check-studio-v3-migration-backfill.mjs`와 `npm run check:studio-v3-migration-backfill` 추가 및 `check:ci` 연결.
- 2026-05-03: `npm run check:docs`, `npm run check:studio-v3-bot-runner`, `npm run check:studio-v3-migration-backfill`, `npm run check:ci` 통과.
- 2026-05-03: Draft PR #280을 `reports/operations/pr-0274-v2-ledger-quarantine-backfill.md` 본문으로 생성했다.
- 2026-05-03: GateEvent comment를 #274에 게시했다: https://github.com/bborok1234/strange-seed-shop/issues/274#issuecomment-4364272489

## 남은 리스크

- 이 PR은 evidence quarantine/backfill 기준을 확정하는 작업이며 stash 내용을 main으로 복원하지 않는다.
- #275가 production game/UI diff를 복구할 때는 Browser Use `iab` evidence와 visual regression을 현재 세션 기준으로 다시 수집해야 한다.
