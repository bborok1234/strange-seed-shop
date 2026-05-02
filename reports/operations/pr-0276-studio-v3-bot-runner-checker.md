## 요약

Studio Harness v3의 첫 deterministic bot-runner checker slice를 추가합니다. GitHub issue/PR/GateEvent fixture로 WorkUnit을 복원하고, local campaign ledger authority, routine GitHub human handoff, stale branch/dirty work, GateEvent hash mismatch 회귀를 CI에서 차단합니다.

## Small win

- 이번 PR이 만든 가장 작은 승리: `npm run check:studio-v3-bot-runner`가 #276 핵심 회귀 fixture 5개를 검증하고 `npm run check:ci`에 포함됩니다.

## Plan-first evidence

- Plan artifact: `items/0140-studio-v3-bot-runner-checker.md`
- Plan에서 벗어난 변경이 있다면 이유: 없음. live GitHub mutation runner가 아니라 deterministic fixture/checker slice로 범위를 유지했습니다.

## Game Studio route

- Umbrella: N/A — operator/harness WorkUnit이며 visible gameplay/HUD/asset/QA 화면 변경이 없습니다.
- Specialist route: N/A — runner/checker/docs 범위입니다.
- 적용한 playfield/HUD/playtest 기준: N/A — game UI 변경 없음. 다음 game/UI WorkUnit에서는 Browser Use `iab`와 `game-studio:game-playtest` gate를 적용합니다.
- Game Studio route에서 벗어난 변경이 있다면 이유: 없음.

## 작업 checklist

- [x] Plan artifact의 수용 기준을 모두 확인했다.
- [x] 게임 기능/UI/에셋/QA 변경이면 Game Studio route를 기록했다. N/A — operator/harness 변경이며 사유를 기록했다.
- [x] UI/HUD 변경이면 `game-studio:game-ui-frontend` 기준으로 playfield 보호와 persistent HUD 밀도를 확인했다. N/A — UI/HUD 변경 없음.
- [x] 게임 화면 QA이면 `game-studio:game-playtest` 기준으로 첫 actionable screen, main verbs, HUD readability, playfield obstruction을 확인했다. N/A — 게임 화면 변경 없음.
- [x] UI/visual 변경이면 Browser Use 우선 QA를 시도하고 evidence 또는 blocker를 남겼다. N/A — visual 변경 없음.
- [x] 필요한 문서/roadmap/dashboard/report를 갱신했다.
- [x] GitHub issue/PR/comment evidence를 축약 없이 남겼다.
- [x] all merge-blocking evidence must be in the original PR before merge/close.
- [x] post-merge main CI is observation-only; do not create a post-merge closeout PR or main-targeted closeout commit.

## 사용자/운영자 가치

- 게임 가치: 다음 production game WorkUnit이 로컬 ledger에 갇히지 않고 GitHub issue/PR evidence로 승격되도록 운영 하네스를 강화합니다.
- 운영사 가치: runner가 GitHub issue/PR/GateEvent를 기준으로 WorkUnit을 복원하고, local-only authorization과 human handoff regression을 CI에서 차단합니다.

## Before / After 또는 Visual evidence

- Before: v3 설계 문구와 `check:studio-v3-contract`만 있었고 #276 수용 기준을 직접 검증하는 runner/checker fixture가 없었습니다.
- After: `scripts/studio-v3-bot-runner.mjs`, `scripts/check-studio-v3-bot-runner.mjs`, `reports/operations/fixtures/studio-v3-bot-runner-*.json`, `check:ci` 연결이 추가되었습니다.
- Browser Use evidence 또는 blocker: N/A — visible gameplay/HUD/UI 변경 없음.
- N/A 사유: operator deterministic checker/docs 변경입니다.

## Playable mode

- main 실행 명령: `npm run play:main` 후 필요 시 `npm run play:main:install`, 그리고 `cd ../strange-seed-shop-play && npm run dev -- --host 127.0.0.1 --port 5174`
- 이 PR이 사람 플레이 환경을 막지 않는 이유: production game code와 assets를 변경하지 않았고, `npm run check:control-room`이 playable main check를 통과했습니다.

## 검증

- [x] `npm run check:studio-v3-bot-runner` PASS
- [x] `node scripts/studio-v3-bot-runner.mjs --fixture reports/operations/fixtures/studio-v3-bot-runner-valid.json --require-authorized` PASS
- [x] `! node scripts/studio-v3-bot-runner.mjs --fixture reports/operations/fixtures/studio-v3-bot-runner-local-ledger-authority.json --require-authorized` expected failure PASS
- [x] `npm run check:studio-v3-contract` PASS
- [x] `npm run check:project-commands` PASS
- [x] `npm run check:dashboard` PASS
- [x] `npm run check:ops-live` PASS
- [x] `npm run check:ci` PASS
- [x] UI/visual 변경이면 Browser Use QA와 `npm run check:visual` 또는 명시 blocker + fallback PASS. N/A — visual 변경 없음.
- [x] GateEvent comment posted to #276: https://github.com/bborok1234/strange-seed-shop/issues/276#issuecomment-4364251574

## 안전 범위

- [x] 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음
- [x] `ENABLE_AGENT_AUTOMERGE` 변경 없음
- [x] Branch protection 우회 없음
- recovery stash/branch 삭제 없음.

## 남은 위험

- 이번 PR은 deterministic fixture slice이며 live GitHub mutation runner 전체 구현은 아닙니다. 실제 GitHub API sync, PR check repair loop, merge automation은 후속 WorkUnit에서 다룹니다.
- #274/#275는 계속 open queue입니다. #276 merge 후 GitHub state 기준으로 다음 합법 WorkUnit을 계속 진행해야 합니다.
- PR checks after the GateEvent evidence commit must be observed on PR #279 before ready/merge.

## 연결된 issue

Closes #276
