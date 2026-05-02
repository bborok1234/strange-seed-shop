# Studio Harness v3 migration backfill report

Status: migration-backfill
Issue: #274
Updated: 2026-05-03
Scope-risk: moderate

## 요약

v2 local campaign ledger 산출물은 보존하지만, v3 이후에는 work authorization source가 아니다. #274는 해당 산출물을 `quarantined` 또는 `migration-backfill` evidence로 분류하고, main tree에 active `campaigns/**`/`prototypes/**` ledger를 복원하지 않는다.

## 현재 캡처

- Current branch: `codex/0274-v2-ledger-quarantine`
- `stash@{0}`: `On codex/recover-local-studio-work-20260503: codex classified recovery diff after PR277 split before studio contract update`
- `stash@{1}`: `On codex/studio-harness-v3-autonomous-design: codex cleanup backup before returning to main after PR 273`
- 두 stash 모두 `git stash show --include-untracked --name-only` 기준 123 paths를 담고 있다.
- 현재 main tree에는 `campaigns/`, `prototypes/`, `.codex/skills/seed-studio/SKILL.md`, `scripts/check-studio-harness.mjs`, `items/0138-studio-harness-v2-first-pass.md`, `assets/source/portrait_variant_asset_*_20260502.json`가 없다.
- recovery branch `codex/recover-local-studio-work-20260503`는 현재 local/remote branch로 남아 있지 않으며, PR #277 이후 stash와 이 report로 보존 상태를 기록한다.

## 분류 기준

| 그룹 | 대표 경로 | 분류 | 조치 |
| --- | --- | --- | --- |
| v2 campaign ledger | `campaigns/**`, `STUDIO.md`, `GAME_BRIEF.md`, root `ROADMAP.md` | `quarantined` | 보존하되 main active ledger로 복원하지 않는다. |
| throwaway prototypes | `prototypes/creature-collection-rescue/**` | `migration-backfill` | 역사적 prototype evidence로만 기록한다. |
| visual evidence | `reports/visual/*20260502.png` | `migration-backfill` | #275에서 current Browser Use evidence를 새로 수집하기 전 참고 evidence로만 둔다. |
| asset prompt prep | `assets/source/portrait_variant_asset_*_20260502.json` | `migration-backfill` | accepted manifest asset이 아니며 prompt planning evidence로만 둔다. |
| legacy harness surfaces | `.codex/skills/seed-studio/SKILL.md`, `scripts/check-studio-harness.mjs`, `items/0138-*` | `quarantined` | v3 GitHub-authoritative rewrite 없이 복원하지 않는다. |
| production game code | `src/App.tsx`, `src/styles.css`, `tests/visual/p0-mobile-game-shell.spec.ts` | `excluded-follow-up` | #275 WorkUnit으로만 복구한다. |

## 보존 / 삭제 / 이관 기준

- 보존: `stash@{0}`, `stash@{1}`, `reports/operations/local-studio-work-recovery-20260503.md`, 이 report/manifest.
- 삭제 금지: stash drop, `git reset --hard`, `git clean -fd`, 전체 recovery restore.
- main 복원 금지: local ledger가 gate authority가 되는 `campaigns/**` active state.
- 이관: production code는 #275, live runner expansion은 #276 이후 후속 WorkUnit, asset generation은 별도 asset provenance gate로 분리한다.
- PR body에는 이 기준을 포함하고, GitHub issue/PR/GateEvent만 operational truth로 둔다.

## 검증

- Manifest: `reports/operations/studio-v3-migration-backfill-20260503.json`
- Checker: `scripts/check-studio-v3-migration-backfill.mjs`
- Required command: `npm run check:studio-v3-migration-backfill`
- Existing authority regression gate: `npm run check:studio-v3-bot-runner`

## 남은 위험

- 이 PR은 evidence quarantine/backfill 기준을 확정하는 작업이다. stash 내용 전체를 main으로 복원하지 않는다.
- #275가 production game/UI diff를 복구할 때는 Browser Use `iab` evidence와 visual regression을 현재 세션 기준으로 다시 수집해야 한다.
