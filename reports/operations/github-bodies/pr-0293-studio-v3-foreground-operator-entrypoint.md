## 요약

Studio Harness v3의 실제 foreground 운영 진입점 `npm run studio:v3:operate`를 추가한다. #290 `studio:v3:runner`는 watcher/decision/heartbeat였고, 이번 PR은 `$seed-ops`로 되돌아가지 않고 v3 native prompt/doctor/detached 실행/체커/문서 라우팅을 고정한다.

## Small win

- 이번 PR이 만든 가장 작은 승리: 사용자가 `npm run studio:v3:operate -- --doctor --print-command`로 readiness와 실제 foreground/detached 실행 명령을 바로 확인할 수 있다.

## Plan-first evidence

- Plan artifact: `items/0149-studio-v3-foreground-operator-entrypoint.md`
- Plan에서 벗어난 변경이 있다면 이유: `docs/OPERATOR_CONTROL_ROOM.md`, `docs/DASHBOARD.md`, `reports/operations/closed-workunit-mirror-manifest-20260503.json`은 check:ci/ops-live/closed mirror gate를 최신 #293 상태로 맞추기 위해 함께 갱신했다.

## Game Studio route

- Umbrella: N/A — 운영사 하네스/runner 작업이며 visible gameplay/HUD/playfield/asset 변경 없음.
- Specialist route: N/A — script/docs/checker 작업.
- 적용한 playfield/HUD/playtest 기준: v3 operator prompt와 usage doc이 visible gameplay WorkUnit에서는 Game Studio route와 Browser Use iab evidence를 요구하도록 명시.
- Game Studio route에서 벗어난 변경이 있다면 이유: N/A.

## 작업 checklist

- [x] Plan artifact의 수용 기준을 모두 확인했다.
- [x] 게임 기능/UI/에셋/QA 변경이면 Game Studio route를 기록했다.
- [x] UI/HUD 변경이면 `game-studio:game-ui-frontend` 기준으로 playfield 보호와 persistent HUD 밀도를 확인했다.
- [x] 게임 화면 QA이면 `game-studio:game-playtest` 기준으로 첫 actionable screen, main verbs, HUD readability, playfield obstruction을 확인했다.
- [x] UI/visual 변경이면 Browser Use 우선 QA를 시도하고 evidence 또는 blocker를 남겼다.
- [x] 필요한 문서/roadmap/dashboard/report를 갱신했다.
- [x] GitHub issue/PR/comment evidence를 축약 없이 남겼다.
- [x] all merge-blocking evidence must be in the original PR before merge/close.
- [x] post-merge main CI is observation-only; do not create a post-merge closeout PR or main-targeted closeout commit.

## 사용자/운영자 가치

- 게임 가치: 직접 게임 화면 변경은 없지만, 운영사가 얕은 이슈 루프 대신 production game quality WorkUnit을 계속 선택/검증/머지하도록 시작점을 바로잡는다.
- 운영사 가치: `$seed-ops`를 v3 entrypoint로 안내하는 회귀를 막고, GitHub-authoritative foreground operator start command를 제공한다.

## Before / After 또는 Visual evidence

- Before: #290 완료 후 실제 기획/구현/QA/PR/merge foreground operator가 없어서 사용법이 `$seed-ops`로 잘못 회귀했다.
- After: `npm run studio:v3:operate -- --doctor --print-command`, `npm run studio:v3:operate -- --duration-hours 24`, `npm run studio:v3:operate -- --detached --duration-hours 24 --interval-seconds 300`가 문서화되고 checker로 고정됐다.
- Browser Use evidence 또는 blocker: N/A — UI/visual 변경 없음. 단 operator prompt는 visible gameplay WorkUnit에서 Browser Use iab gate를 요구한다.
- N/A 사유: script/docs/checker-only PR.

## Playable mode

- main 실행 명령: `npm run play:main` 후 필요 시 `npm run play:main:install`, 그리고 `cd ../strange-seed-shop-play && npm run dev -- --host 127.0.0.1 --port 5174`
- 이 PR이 사람 플레이 환경을 막지 않는 이유: runtime game code와 asset manifest를 변경하지 않았다.

## 검증

- [x] `npm run studio:v3:operate -- --help` PASS
- [x] `npm run studio:v3:operate -- --doctor --print-command --issue 293` PASS
- [x] `npm run studio:v3:operate -- --prompt-only --issue 293 --max-iterations 1` PASS
- [x] `npm run check:studio-v3-operator` PASS
- [x] `npm run check:project-commands` PASS
- [x] `npm run check:studio-v3-live-runner` PASS
- [x] `npm run check:seed-ops-queue` PASS
- [x] `npm run check:closed-workunit-mirrors` PASS
- [x] `npm run check:ci` PASS
- [x] UI/visual 변경이면 Browser Use QA와 `npm run check:visual` 또는 명시 blocker + fallback PASS — N/A, UI/visual 변경 없음.

## 안전 범위

- [x] 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음
- [x] `ENABLE_AGENT_AUTOMERGE` 변경 없음
- [x] Branch protection 우회 없음

## 남은 위험

- `codex exec`/`omx exec`는 모델 final/context exhaustion에서 종료될 수 있다. 이번 PR은 시작 명령/doctor/prompt/checker를 만들고, 실제 24시간 지속성 검증은 후속 runner supervision evidence로 다룬다.
- 현재 Codex CLI 세션은 MCP 추가를 hot reload하지 않을 수 있다. 새 세션 readiness는 `studio:v3:operate -- --doctor --print-command`가 확인한다.

## 연결된 issue

Closes #293
