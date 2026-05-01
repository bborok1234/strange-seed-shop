# Seed ops final publication ask regression

Status: verified
Owner: agent
Created: 2026-05-02
Updated: 2026-05-02
Work type: ops_harness
Scope-risk: narrow
Issue: local

## Intent

`$seed-ops`가 GitHub issue/PR 게시 경계에서 `final` 응답으로 “게시해도 될까요?”를 묻고 루프를 종료하는 회귀를 하네스 결함으로 취급한다. 확인 문구가 필요한 환경에서도 final이 아니라 commentary checkpoint와 local continuation action으로 처리하도록 문서와 checker를 강화한다.

## Plan

1. [x] `$ralph` 스킬과 기존 4시간/heartbeat/watchdog 하네스를 확인해 문구 감지가 아니라 상태 파일 기반이라는 점을 기록한다.
2. [x] `scripts/write-operator-heartbeat.mjs`가 `publication_gate`, `confirmation`, `continuation`, `stop_rule` 구조화 필드를 쓸 수 있게 한다.
3. [x] `scripts/check-seed-ops-publication-gate-state.mjs`를 추가해 publication gate 상태를 JSON으로 판정한다.
4. [x] `scripts/check-ops-live.mjs`가 현재 heartbeat의 publication gate 구조를 검사하도록 강화한다.
5. [x] `scripts/check-seed-ops-queue-gate.mjs`가 새 구조화 checker 등록을 검사하도록 강화한다.
6. [x] `scripts/operator-control-room.mjs`가 생성하는 상황판에도 같은 live contract를 포함한다.
7. [x] `npm run operator:control-room -- --output docs/OPERATOR_CONTROL_ROOM.md`와 `npm run update:dashboard`로 generated surfaces를 갱신한다.
8. [x] LangGraph, mcp-agent Temporal, Cloudflare long-running agents 공식 문서에서 durable state/checkpoint/recovery 방식도 확인한다.
9. [x] `npm run check:seed-ops-publication-gate`, `npm run check:seed-ops-queue`, `npm run check:ops-live`, `npm run check:ci`로 회귀 방지 gate를 검증한다.

## Acceptance Criteria

- [x] `reports/operations/ralph-state-contract-review-20260502.md`가 `$ralph` 스킬 구조, 현재 prompt-side activation, 예전 4시간 shell loop, heartbeat/watchdog 방식을 비교한다.
- [x] 같은 report가 LangGraph, mcp-agent Temporal, Cloudflare long-running agents reference를 포함한다.
- [x] `npm run check:seed-ops-publication-gate`가 `confirmation.channel: "final"` fixture와 continuation 누락 fixture를 실패로 잡는다.
- [x] `npm run check:ops-live`가 현재 heartbeat에서 external publication gate 구조를 검사한다.
- [x] `npm run check:seed-ops-queue`는 publication boundary의 자연어 문구가 아니라 package script 등록과 기존 queue 품질 gate만 확인한다.
- [x] 기존 `PR publication confirmation boundary`, `pending external-publication gate`, `next local safe work` 계약은 유지된다.

## Verification

- `npm run check:seed-ops-publication-gate` - pass
- `npm run check:seed-ops-queue` - pass
- `npm run check:ops-live` - pass
- `npm run check:ci` - pass

## Risk

모델 런타임의 `final` 자체를 repo script가 직접 가로채지는 못한다. 그래서 실제 판정은 문구 감지가 아니라 publication gate heartbeat JSON의 `confirmation.channel`, `continuation.action`, `continuation.artifact_path`, `safe_local_work`로 수행한다.
