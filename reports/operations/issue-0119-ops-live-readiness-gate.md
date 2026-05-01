# [Agent Ops] seed-ops 재시작 전 live 상황판 준비 gate

## 문제 / 배경

최근 `$seed-ops`는 issue -> PR -> merge 기록은 잘 남겼지만, 살아있는 운영 상황판과 heartbeat는 최신 상태를 반영하지 못했다. `docs/OPERATOR_CONTROL_ROOM.md`는 2026-04-28 Issue #87 상태에 머물렀고, `.omx/state/operator-heartbeat.json`도 2026-04-28 Issue #93/#94 상태로 stale이었다. 이 상태에서는 AI가 운영하는 게임사라기보다 과거 보고서 archive에 가깝다.

## 목표

`$seed-ops`를 다시 돌리기 전에 live 상황판/heartbeat/next queue가 자동으로 준비되고, stale 상태를 checker가 실패로 잡게 만든다.

PR: #230

## Small win

- seed ops 시작 전 “지금 무엇을 왜 하는지, 언제 멈출지, 다음 queue가 무엇인지”를 control room과 heartbeat가 최신 상태로 말한다.

## Game Studio route

- Umbrella: N/A — agent_ops 준비 gate.
- Specialist route: N/A — 게임 UI/HUD/playfield/asset 변경 없음.
- 북극성/플레이어 동사: 직접 플레이어 동사는 없지만, 다음 seed ops가 asset/FX/경쟁작 production gap을 queue에 반영하도록 운영 gate를 강화한다.
- Playfield 보호 또는 UI surface 원칙: N/A.
- Playtest evidence 계획: N/A — 운영 스크립트/checker 변경이다.

## Plan

- 구현 전 작성/검토할 plan artifact: `items/0119-ops-live-readiness-gate.md`
- 예상 변경 단계:
  1. control room 생성기가 canonical 문서 갱신을 지원하게 한다.
  2. live heartbeat/control-room freshness checker를 추가한다.
  3. package/checker 문서와 dashboard/roadmap evidence를 갱신한다.
  4. 준비 완료 heartbeat와 snapshot을 남긴다.
- 검증 계획: `npm run check:ops-live`, `npm run check:control-room`, `npm run check:operator`, `npm run check:ci`
- 건드리지 않을 범위: 게임 런타임, asset 생성, 결제/로그인/광고/외부 배포/고객 데이터/credential

## 플레이어 가치 또는 운영사 가치

- 게임 가치: 다음 seed ops가 목적 없이 작은 주문/문구만 붙이지 않고 asset/FX/경쟁작 production gap을 기준으로 후보를 고르게 한다.
- 운영사 가치: 살아있는 control room과 heartbeat가 stale이면 준비 완료를 선언할 수 없게 한다.

## 수용 기준

- [x] stale control room이 checker에서 실패한다.
- [x] stale heartbeat가 checker에서 실패한다.
- [x] 준비 완료 heartbeat와 control room snapshot을 쓰면 checker가 통과한다.
- [x] next queue가 목적 없는 무한 루프가 아니라 goal/stop condition을 요구한다.
- [x] `npm run check:ci`가 통과한다.

## Visual evidence 계획

- Before screenshot: N/A — 운영 스크립트/checker 변경.
- After screenshot: N/A — 운영 스크립트/checker 변경.
- Browser Use 우선 QA 계획 또는 N/A 사유: N/A — 게임 UI/visual 변경 없음.
- N/A 사유: control room/heartbeat/readiness checker 작업이다.

## Playable mode 영향

- [x] 사람이 `npm run play:main`으로 main 게임을 계속 실행할 수 있다.
- 변경 확인 URL/port: N/A — playable mode 설정은 변경하지 않는다.

## 안전 범위

- 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음.
- Branch protection 우회 없음.

## 검증 명령

- 기본 CI gate: `npm run check:ci` — PASS
- 운영 준비 gate: `npm run check:ops-live` — PASS
- stale heartbeat fixture: `npm run check:ops-live -- --heartbeat .omx/state/watchdog-stuck-guard-heartbeat.json --now 2026-05-01T06:30:00.000Z` — expected FAIL, stale 상태 감지
- PR #230 checks: `Verify game baseline` PASS, `Check automerge eligibility` PASS
- UI/visual 변경: N/A
