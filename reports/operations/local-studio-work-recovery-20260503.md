# 로컬 Studio 작업 복구 원장

Status: recovery-triage
Owner: Codex
Updated: 2026-05-03

## 배경

PR #273 `Studio Harness v3 autonomous design`는 2026-05-02에 merge되었고 issue #272는 completed 상태다. 그러나 PR merge 이후에도 `codex/studio-harness-v3-autonomous-design` 로컬 브랜치 위에서 Codex가 추가 작업을 계속했고, 그 작업이 GitHub issue/PR 단위로 승격되지 않았다.

이 원장은 `stash@{0}`를 무작정 삭제하거나 전체 적용 PR로 밀지 않기 위한 복구 기준이다. stash는 백업으로 보존하고, 현재 복구 브랜치 `codex/recover-local-studio-work-20260503`에서 내용물을 펼쳐 분류한다.

## 현재 상태

- Base: `origin/main` `d5d751d4df77241765fa48839ba8c0a986aecfb2`
- Recovery branch: `codex/recover-local-studio-work-20260503`
- Backup stash: `stash@{0}` `codex cleanup backup before returning to main after PR 273`
- Tracked diff: 33 files, 1892 insertions, 859 deletions
- Untracked recovery files: 90 files

## 판정

이 묶음은 찌꺼기가 아니다. 크게 네 종류가 섞여 있다.

1. Studio Harness v2 로컬 ledger 전환 산출물
2. v2 ledger가 실행한 `creature-collection-rescue` campaign evidence
3. production game/UI 코드 변경
4. PR #273 이후 GitHub-authoritative v3와 충돌하거나 대체되어야 하는 legacy 운영 문서 변경

따라서 전체를 한 번에 merge하지 않는다. 또한 전체를 버리지 않는다.

## Work Unit 분리

### WU-A: v2 Local Ledger Quarantine / Migration

GitHub issue: #274 `로컬 v2 campaign ledger를 v3 WorkUnit evidence로 격리/백필`

범위:

- `STUDIO.md`
- `GAME_BRIEF.md`
- root `ROADMAP.md`
- `campaigns/**`
- `prototypes/**`
- `reports/visual/*20260502.png`
- `assets/source/portrait_variant_asset_plan_20260502.json`
- `assets/source/portrait_variant_asset_prompts_20260502.json`
- `.codex/skills/seed-studio/SKILL.md`
- `scripts/check-studio-harness.mjs`
- `items/0138-studio-harness-v2-first-pass.md`

판정:

- 보존한다.
- 하지만 v3 이후에는 local ledger가 work authorization source가 될 수 없으므로, 이 상태 그대로 primary harness로 merge하지 않는다.
- GitHub issue에 `migration-backfill` GateEvent로 연결하거나, evidence archive로 격리해야 한다.

다음 조치:

- 새 GitHub issue: `로컬 v2 campaign ledger를 v3 WorkUnit evidence로 격리/백필`
- PR 범위는 문서/스크립트 migration만 허용한다.
- production game code는 포함하지 않는다.

### WU-B: Creature Stage / Care-Clue / Album Production Recovery

GitHub issue: #275 `대표 생명체 stage, 돌보기 반응, 도감 감상면을 production으로 복구`

범위:

- `src/App.tsx`
- `src/styles.css`
- `tests/visual/p0-mobile-game-shell.spec.ts`
- 관련 production Browser Use evidence:
  - `reports/visual/creature-stage-production-*.png`
  - `reports/visual/care-clue-production-*.png`
  - `reports/visual/album-appreciation-production-*.png`

판정:

- 실제 게임 품질을 바꾸는 production 코드다.
- local v2 ledger의 Keep/Release 기록이 있다고 해도 GitHub issue/PR evidence가 없으므로 아직 완료 작업으로 취급하지 않는다.
- 별도 GitHub issue/PR로 되살리고, 현재 v3 기준 issue body, PR body, checks, Browser Use evidence를 새로 묶어야 한다.

다음 조치:

- 새 GitHub issue: `대표 생명체 stage, 돌보기 반응, 도감 감상면을 production으로 복구`
- PR에는 이 세 기능을 전부 넣을지, stage/care와 album을 둘로 나눌지 diff와 QA 결과를 보고 결정한다.
- 병합 전 Browser Use `iab` 재검증과 `npm run check:ci`가 필요하다.

### WU-C: Harness v3 Follow-up Runner / Bot Spec

GitHub issue: #276 `Studio Harness v3 bot runner 구현 spec 및 checker 정리`

범위:

- `docs/PROJECT_COMMANDS.md`
- `.codex/skills/seed-ops/SKILL.md`
- `AGENTS.md`
- `docs/OPERATOR_*`
- `scripts/check-*`
- `scripts/operator-*`
- `package.json`

판정:

- 일부는 v3 방향과 맞고, 일부는 v2 local-ledger authority를 다시 강화할 위험이 있다.
- PR #273의 `docs/STUDIO_HARNESS_V3_AUTONOMOUS_DESIGN.md`가 더 최신 source다.
- 이 묶음은 그대로 적용하지 않고 v3 spec에 맞춰 재작성한다.

다음 조치:

- 새 GitHub issue: `Studio Harness v3 bot runner 구현 spec 및 checker 정리`
- `$seed-ops`를 단순 deprecated adapter로 만드는 변경은 v3 bot runner 설계와 함께 다시 검토한다.
- human git handoff 금지, GitHub authoritative WorkUnit, GateEvent, runner heartbeat를 우선한다.

### WU-D: Already-Handled / Stale Local Delta

범위:

- `reports/operations/studio-harness-v3-pr-body-20260502.md`

판정:

- GitHub PR #273 본문에는 이미 `Closes #272`로 반영되어 merge 완료됐다.
- 로컬 파일의 본문 수정은 repo history에 반영되지 않았지만, PR publication surface에는 반영되었다.
- 단독 PR로 되살릴 가치가 낮다.

다음 조치:

- 다른 harness cleanup PR에 포함할지 판단한다.
- 단독 변경으로 밀지 않는다.

## 금지 사항

- `stash@{0}` drop 금지.
- `git reset --hard`, `git clean -fd`, 전체 restore 금지.
- 이 recovery branch의 전체 diff를 하나의 PR로 publish 금지.
- v2 `campaigns/**`만으로 다음 작업을 authorize 금지.
- production game code와 harness migration을 같은 PR로 섞기 금지.

## 권장 다음 순서

1. 현재 recovery branch를 보존한다.
2. WU-A, WU-B, WU-C 순서로 GitHub issue를 만들거나 body file을 준비한다.
3. 각 WU는 `origin/main`에서 새 브랜치를 따고 필요한 파일만 선택 적용한다.
4. WU-B는 Browser Use `iab`로 현재 production 화면을 다시 확인한 뒤 PR scope를 확정한다.
5. recovery branch와 stash는 세 WU가 모두 원격 issue/PR로 흡수되기 전까지 유지한다.
