# seed-ops live 상황판 준비 gate

## 요약

stale control room과 stale heartbeat가 더 이상 ops 준비 완료로 통과하지 못하게 `check:ops-live`를 추가하고, `docs/OPERATOR_CONTROL_ROOM.md` 상단에 자동 갱신되는 Live Snapshot을 붙였다.

## Small win

- 이번 PR이 만든 가장 작은 승리: 다음 `$seed-ops`는 목적 없는 무한 루프가 아니라 “live 상황판/heartbeat/next queue gate green 후 멈춤”이라는 stop condition을 가진다.

## Plan-first evidence

- Plan artifact: `items/0119-ops-live-readiness-gate.md`
- Issue: #229
- Plan에서 벗어난 변경이 있다면 이유: 없음

## Game Studio route

- Umbrella: N/A — agent_ops 준비 gate.
- Specialist route: N/A — 게임 UI/HUD/playfield/asset 변경 없음.
- 적용한 playfield/HUD/playtest 기준: N/A — 운영 상황판/heartbeat/readiness checker 작업.
- Game Studio route에서 벗어난 변경이 있다면 이유: N/A

## 작업 checklist

- [x] Plan artifact의 수용 기준을 모두 확인했다.
- [x] 게임 기능/UI/에셋/QA 변경이면 Game Studio route를 기록했다. N/A — agent_ops.
- [x] UI/HUD 변경이면 `game-studio:game-ui-frontend` 기준으로 playfield 보호와 persistent HUD 밀도를 확인했다. N/A.
- [x] 게임 화면 QA이면 `game-studio:game-playtest` 기준으로 첫 actionable screen, main verbs, HUD readability, playfield obstruction을 확인했다. N/A.
- [x] UI/visual 변경이면 Browser Use 우선 QA를 시도하고 evidence 또는 blocker를 남겼다. N/A — UI 변경 없음.
- [x] 필요한 문서/roadmap/dashboard/report를 갱신했다.
- [x] GitHub issue/PR/comment evidence를 축약 없이 남겼다.

## 사용자/운영자 가치

- 게임 가치: 다음 게임 issue가 또 주문/문구만 붙이는 식으로 흐르지 않도록 competition-inspired production gap과 asset/FX 또는 sprite-animation 결정을 queue gate에 포함했다.
- 운영사 가치: control room과 heartbeat가 stale이면 준비 완료를 선언하지 못한다.

## Before / After 또는 Visual evidence

- Before: `docs/OPERATOR_CONTROL_ROOM.md`는 2026-04-28 Issue #87/branch `codex/operator-control-room` 상태였고, `.omx/state/operator-heartbeat.json`은 Issue #93/#94 상태였다.
- After: `docs/OPERATOR_CONTROL_ROOM.md` Live Snapshot이 Issue #229, current branch, heartbeat, open issue queue, goal-bounded stop condition을 반영한다.
- Browser Use evidence 또는 blocker: N/A — 운영 스크립트/checker 변경이며 게임 화면 변경 없음.
- N/A 사유: UI/visual 변경이 없다.

## Playable mode

- main 실행 명령: `npm run play:main` 후 필요 시 `npm run play:main:install`, 그리고 `cd ../strange-seed-shop-play && npm run dev -- --host 127.0.0.1 --port 5174`
- 이 PR이 사람 플레이 환경을 막지 않는 이유: 게임 런타임과 playable worktree 스크립트를 변경하지 않았고 `npm run check:control-room`의 playable check가 통과했다.

## 검증

- [x] `npm run check:ops-live` PASS
- [x] `npm run check:control-room` PASS
- [x] `npm run check:operator` PASS
- [x] `npm run check:ci` PASS
- [x] stale heartbeat fixture expected FAIL: `npm run check:ops-live -- --heartbeat .omx/state/watchdog-stuck-guard-heartbeat.json --now 2026-05-01T06:30:00.000Z`

## 안전 범위

- [x] 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음
- [x] `ENABLE_AGENT_AUTOMERGE` 변경 없음
- [x] Branch protection 우회 없음

## 남은 위험

- `check:ops-live` 기본 freshness는 86400초다. 장시간 실행 중 600초 heartbeat 감지는 기존 `operator:watchdog`가 계속 담당한다.
- GitHub CLI가 sandbox에서 막히면 open issue/PR 목록이 `unavailable or none`이 될 수 있다. 실제 seed-ops 시작 snapshot은 네트워크 접근으로 다시 생성해야 한다.

## 연결된 issue

Closes #229
