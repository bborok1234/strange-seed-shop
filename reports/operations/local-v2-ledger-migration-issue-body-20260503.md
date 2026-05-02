# 로컬 v2 campaign ledger를 v3 WorkUnit evidence로 격리/백필

## 요약

Codex가 Studio Harness v2 전환 이후 로컬에서 생성한 campaign ledger, prototype, Browser Use evidence, asset prompt 준비물을 Studio Harness v3의 GitHub-authoritative 운영 모델에 맞게 격리하고 백필한다.

## 배경

PR #273으로 `docs/STUDIO_HARNESS_V3_AUTONOMOUS_DESIGN.md`가 merge되었고, v3 기준에서는 GitHub issue/PR/GateEvent가 operational truth다. 그러나 로컬 `stash@{0}`에는 v2 local ledger 기반 산출물이 남아 있다.

이 작업은 해당 산출물을 버리지 않고, 동시에 local ledger가 다시 authority가 되는 회귀를 막는다.

## 범위

- `STUDIO.md`, `GAME_BRIEF.md`, root `ROADMAP.md`
- `campaigns/active.json`
- `campaigns/creature-collection-rescue/**`
- `prototypes/creature-collection-rescue/**`
- `reports/visual/*20260502.png`
- `assets/source/portrait_variant_asset_*_20260502.json`
- `.codex/skills/seed-studio/SKILL.md`
- `scripts/check-studio-harness.mjs`
- `items/0138-studio-harness-v2-first-pass.md`

## 비범위

- production game code merge
- `src/App.tsx`, `src/styles.css`, visual regression test 편입
- v3 bot runner 구현
- GitHub issue/PR state를 로컬 ledger에서 추론해 완료 처리

## 수용 기준

- [ ] v2 local ledger 산출물이 GitHub v3 기준에서 `quarantined` 또는 `migration-backfill`로 명시된다.
- [ ] local ledger가 work authorization source가 아니라 evidence mirror임을 문서와 checker가 강제한다.
- [ ] prototype/evidence 파일의 보존/삭제/이관 기준이 PR body에 명시된다.
- [ ] `stash@{0}`와 recovery branch의 보존 상태가 보고된다.
- [ ] `npm run check:docs`와 관련 harness checker가 통과한다.

## 검증

- `npm run check:docs`
- migration checker 또는 기존 `check:studio-harness`를 v3-compatible하게 조정 후 실행

## 연결 evidence

- `reports/operations/local-studio-work-recovery-20260503.md`

