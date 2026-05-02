## 요약

v2 local campaign ledger/prototype/evidence 묶음을 v3 GitHub-authoritative 모델에 맞게 `quarantined` 또는 `migration-backfill` evidence로 분류합니다. main에 active `campaigns/**` ledger를 복원하지 않고, `npm run check:studio-v3-migration-backfill`로 local ledger authority 회귀를 차단합니다.

## Small win

- 이번 PR이 만든 가장 작은 승리: `reports/operations/studio-v3-migration-backfill-20260503.json`과 checker가 stash/recovery 산출물을 evidence mirror로 격리하고 `check:ci`에서 검증합니다.

## Plan-first evidence

- Plan artifact: `items/0141-v2-ledger-quarantine-backfill.md`
- Plan에서 벗어난 변경이 있다면 이유: 없음. stash 내용 전체 복원 대신 manifest/report/checker로 격리 기준을 고정했습니다.

## Game Studio route

- Umbrella: N/A — operator/harness migration evidence WorkUnit이며 visible gameplay/HUD/asset/QA 화면 변경이 없습니다.
- Specialist route: N/A — migration manifest/report/checker 범위입니다.
- 적용한 playfield/HUD/playtest 기준: N/A — game UI 변경 없음. #275에서 Browser Use `iab`와 `game-studio:game-playtest` gate를 적용합니다.
- Game Studio route에서 벗어난 변경이 있다면 이유: 없음.

## 작업 checklist

- [x] Plan artifact의 수용 기준을 모두 확인했다.
- [x] 게임 기능/UI/에셋/QA 변경이면 Game Studio route를 기록했다. N/A — operator migration evidence 변경이며 사유를 기록했다.
- [x] UI/HUD 변경이면 `game-studio:game-ui-frontend` 기준으로 playfield 보호와 persistent HUD 밀도를 확인했다. N/A — UI/HUD 변경 없음.
- [x] 게임 화면 QA이면 `game-studio:game-playtest` 기준으로 첫 actionable screen, main verbs, HUD readability, playfield obstruction을 확인했다. N/A — 게임 화면 변경 없음.
- [x] UI/visual 변경이면 Browser Use 우선 QA를 시도하고 evidence 또는 blocker를 남겼다. N/A — visual 변경 없음.
- [x] 필요한 문서/roadmap/dashboard/report를 갱신했다.
- [x] GitHub issue/PR/comment evidence를 축약 없이 남겼다.
- [x] all merge-blocking evidence must be in the original PR before merge/close.
- [x] post-merge main CI is observation-only; do not create a post-merge closeout PR or main-targeted closeout commit.

## 사용자/운영자 가치

- 게임 가치: #275 production game 복구가 v2 local ledger authority와 섞이지 않고 GitHub issue/PR/Browser Use evidence로 진행되게 합니다.
- 운영사 가치: local ledger를 evidence mirror로 격리하고, stash/prototype/visual evidence 보존 기준을 CI로 고정합니다.

## Before / After 또는 Visual evidence

- Before: recovery report에는 WU-A 분리가 있었지만, main/CI에서 #274 migration-backfill manifest를 검증하지 않았습니다.
- After: `reports/operations/studio-v3-migration-backfill-20260503.{json,md}`, `scripts/check-studio-v3-migration-backfill.mjs`, `check:ci` 연결이 추가되었습니다.
- Browser Use evidence 또는 blocker: N/A — visible gameplay/HUD/UI 변경 없음.
- N/A 사유: operator migration evidence/checker/docs 변경입니다.

## Playable mode

- main 실행 명령: `npm run play:main` 후 필요 시 `npm run play:main:install`, 그리고 `cd ../strange-seed-shop-play && npm run dev -- --host 127.0.0.1 --port 5174`
- 이 PR이 사람 플레이 환경을 막지 않는 이유: production game code와 assets를 변경하지 않았고, `npm run check:control-room`이 playable main check를 통과했습니다.

## 검증

- [x] `npm run check:docs` PASS
- [x] `npm run check:studio-v3-bot-runner` PASS
- [x] `npm run check:studio-v3-migration-backfill` PASS
- [x] `npm run check:ci` PASS
- [x] GateEvent comment posted to #274: https://github.com/bborok1234/strange-seed-shop/issues/274#issuecomment-4364272489
- [x] UI/visual 변경이면 Browser Use QA와 `npm run check:visual` 또는 명시 blocker + fallback PASS. N/A — visual 변경 없음.

## 안전 범위

- [x] 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음
- [x] `ENABLE_AGENT_AUTOMERGE` 변경 없음
- [x] Branch protection 우회 없음
- `stash@{0}`/`stash@{1}` drop 없음.
- production game code는 #275로 분리.

## 남은 위험

- 이 PR은 evidence quarantine/backfill 기준을 확정하며, stash 내용을 main으로 복원하지 않습니다.
- #275 production game/UI 복구는 Browser Use `iab` evidence와 visual regression을 현재 세션 기준으로 다시 수집해야 합니다.
- PR checks after the GateEvent evidence commit must be observed on PR #280 before ready/merge.

## 연결된 issue

Closes #274
