# 로컬 v2 campaign ledger를 v3 WorkUnit evidence로 격리/백필

## 문제 / 배경

PR #273 이후 로컬에서 생성된 v2 campaign ledger/prototype/evidence 묶음이 GitHub WorkUnit/PR로 승격되지 않은 채 stash/recovery 상태에 남아 있었다. v3 기준에서는 GitHub issue/PR/GateEvent가 operational truth이며, local `campaigns/**` ledger는 gate advance나 Release를 authorize할 수 없다.

## 목표

v2 local ledger 산출물을 삭제하지 않고 `quarantined` 또는 `migration-backfill` evidence로 분류한다. 동시에 production game code는 #275로 분리하고, local ledger가 work authorization source가 아니라 evidence mirror임을 deterministic checker로 강제한다.

## Small win

- 이번 issue가 만들 가장 작은 승리: `npm run check:studio-v3-migration-backfill`이 v2 ledger backfill manifest/report를 검증하고 `npm run check:ci`에 포함된다.

## Game Studio route

- Umbrella: N/A — operator/harness migration evidence WorkUnit이며 visible gameplay/HUD/asset/QA 화면을 변경하지 않는다.
- Specialist route: N/A — migration manifest/report/checker 범위다.
- 북극성/플레이어 동사: 운영사 북극성 — 로컬 campaign ledger가 GitHub WorkUnit을 우회하지 못하게 한다.
- Playfield 보호 또는 UI surface 원칙: N/A — game UI 변경 없음.
- Playtest evidence 계획: N/A — #274는 visual 변경이 없다. #275에서 Browser Use `iab` evidence를 새로 수집한다.

## Plan

- 구현 전 작성/검토할 plan artifact: `items/0141-v2-ledger-quarantine-backfill.md`
- 예상 변경 단계:
  1. stash/recovery branch/main tree 상태 확인
  2. migration manifest/report 작성
  3. deterministic checker 추가
  4. `package.json` `check:ci` 연결
  5. roadmap/dashboard/control room evidence 갱신
- 검증 계획: `npm run check:docs`, `npm run check:studio-v3-bot-runner`, `npm run check:studio-v3-migration-backfill`, `npm run check:ci`
- 건드리지 않을 범위: production game code, 새 asset generation, stash drop/reset/clean, local ledger authority 부활

## 플레이어 가치 또는 운영사 가치

- 게임 가치: #275 production game 복구가 v2 local ledger 권한으로 섞이지 않고 GitHub issue/PR/Browser Use evidence로 진행되게 한다.
- 운영사 가치: v2 local ledger를 evidence mirror로 격리하고, main/CI에서 다시 authority가 되지 않도록 막는다.

## 수용 기준

- [x] v2 local ledger 산출물이 GitHub v3 기준에서 `quarantined` 또는 `migration-backfill`로 명시된다.
- [x] local ledger가 work authorization source가 아니라 evidence mirror임을 문서와 checker가 강제한다.
- [x] prototype/evidence 파일의 보존/삭제/이관 기준이 PR body/report에 명시된다.
- [x] `stash@{0}`와 recovery branch의 보존 상태가 보고된다.
- [x] `npm run check:docs`와 관련 harness checker가 통과한다.

## Visual evidence 계획

- Before screenshot: N/A — docs/scripts/checker-only 변경.
- After screenshot: N/A — docs/scripts/checker-only 변경.
- Browser Use 우선 QA 계획 또는 N/A 사유: N/A — visible gameplay/HUD/UI 변경 없음.
- N/A 사유: #274는 operator migration evidence work이며 화면 rendering을 변경하지 않는다.

## Playable mode 영향

- [x] 사람이 `npm run play:main`으로 main 게임을 계속 실행할 수 있다.
- 변경 확인 URL/port: N/A — game runtime 변경 없음, playable mode gate는 `npm run check:control-room`에서 확인.

## 안전 범위

- 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음.
- Branch protection 우회 없음.
- `stash@{0}`/`stash@{1}` drop 없음.
- `git reset --hard`, `git clean -fd`, 전체 recovery restore 없음.
- production game code는 #275로 분리.

## 검증 명령

- `npm run check:docs` — PASS
- `npm run check:studio-v3-bot-runner` — PASS
- `npm run check:studio-v3-migration-backfill` — PASS
- `npm run check:ci` — PASS

## 연결 evidence

- `items/0141-v2-ledger-quarantine-backfill.md`
- `reports/operations/local-studio-work-recovery-20260503.md`
- `reports/operations/studio-v3-migration-backfill-20260503.md`
- `reports/operations/studio-v3-migration-backfill-20260503.json`
- `scripts/check-studio-v3-migration-backfill.mjs`
- #276 PR #279 / main CI `25256607105`
