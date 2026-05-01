# Ops live readiness gate

Status: active
Work type: agent_ops
Owner: agent
Created: 2026-05-01
Updated: 2026-05-01
Scope-risk: moderate
Issue: #229
PR: TBD
Branch: `codex/0119-ops-live-readiness-gate`

## Intent

`$seed-ops`를 다시 돌리기 전에 운영사가 현재 상태를 스스로 갱신하고, 낡은 상황판/heartbeat/queue를 통과시키지 못하게 한다. 이번 작업은 무한 운영 테스트가 아니라 준비 완료라는 특정 목표에 도달하면 멈추는 stop-condition 테스트다.

## Context

- `docs/OPERATOR_CONTROL_ROOM.md`가 2026-04-28, Issue #87 상태에 머물러 있다.
- `.omx/state/operator-heartbeat.json`이 2026-04-28, Issue #93/#94 상태에 머물러 있다.
- `check:operator`와 `check:control-room`은 과거 evidence 문구만 검사하고 live freshness를 검사하지 않는다.
- `operator:control-room`은 최신 snapshot을 콘솔에 출력할 수 있지만 canonical 상황판을 자동 갱신하지 않는다.

## Game Studio route

- N/A — agent_ops 준비 작업이다.
- 게임 기능/UI/HUD/playfield/asset 변경 없음.
- 단, 다음 `$seed-ops` queue는 게임 작업을 고를 때 `docs/NORTH_STAR.md` Production Bar와 `docs/IDLE_CORE_CREATIVE_GUIDE.md`의 asset/FX/경쟁작 기준을 강제해야 한다.

## Plan

1. `operator-control-room`이 현재 main/issue/PR/heartbeat/next queue 상태를 canonical snapshot으로 쓸 수 있게 한다.
2. stale `docs/OPERATOR_CONTROL_ROOM.md`와 stale heartbeat를 실패로 잡는 live readiness checker를 추가한다.
3. `npm run check:ci` 또는 운영 gate에 live readiness checker를 연결한다.
4. 준비 완료 상태의 heartbeat와 control room snapshot을 갱신한다.
5. 로컬 검증, GitHub PR/check/merge, main CI까지 확인한 뒤 멈춘다.

## Acceptance

- [x] stale `docs/OPERATOR_CONTROL_ROOM.md`가 checker에서 실패한다.
- [x] stale `.omx/state/operator-heartbeat.json`가 checker에서 실패한다.
- [x] 준비 완료 heartbeat를 쓰면 checker가 통과한다.
- [x] canonical control room이 현재 branch/commit/open issue queue/next queue/stop condition을 반영한다.
- [x] 다음 `$seed-ops` 시작 전 queue가 목적 없는 무한 루프가 아니라 명시된 goal/stop condition을 요구한다.
- [x] `npm run check:ci`가 통과한다.

## Verification

- `npm run operator:heartbeat:write -- --issue '#229' --item items/0119-ops-live-readiness-gate.md --phase ops-prep --iteration 2 --command 'roadmap/dashboard live readiness update' --next 'ops 준비 gate green 후 PR/CI/main merge 확인하고 멈춤' --status running`: PASS
- `npm run operator:control-room -- --output docs/OPERATOR_CONTROL_ROOM.md`: PASS, open issue #229 반영
- `npm run check:ops-live`: PASS
- stale fixture check: `npm run check:ops-live -- --heartbeat .omx/state/watchdog-stuck-guard-heartbeat.json --now 2026-05-01T06:30:00.000Z`: expected FAIL, stale heartbeat/branch/next_action 감지
- `npm run check:control-room`: PASS
- `npm run check:operator`: PASS
- `npm run check:ci`: PASS

## Stop condition

이 작업은 아래 조건이 모두 만족되면 멈춘다.

- 최신 control room과 heartbeat가 준비 완료 상태를 가리킨다.
- live readiness checker가 현재성 문제를 잡을 수 있다.
- GitHub PR이 merge되고 main CI가 green이다.
- 다음 `$seed-ops` queue가 명시적인 goal/stop condition을 요구한다.

## Safety

- 게임 런타임 변경 없음.
- 신규 asset 생성 없음.
- runtime image generation 없음.
- 실제 결제, 로그인, 광고, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음.
- Branch protection 우회 없음.

## Risks

- `check:ops-live`의 기본 freshness는 86400초다. 장시간 실행 중 600초 heartbeat 감지는 기존 `operator:watchdog`가 계속 담당한다.
- GitHub CLI가 sandbox에서 막히면 control room의 open issue/PR 목록은 `unavailable or none`이 될 수 있다. seed-ops 실제 준비 snapshot은 네트워크 접근으로 다시 생성해야 한다.
