# Seed Ops Loop Drill

Status: local-verified
Owner: agent
Date: 2026-05-01
Issue: #262
PR: #263

## Purpose

사용자 요청에 따라 `$seed-ops`를 작은 문서/운영 이슈 하나로 실제 실행해, 작업 완료 단위가 PR merge, main CI, local main 최신화까지 닫히는지 QA한다.

## Initial Finding

main에서 `npm run check:ops-live`를 실행했을 때 heartbeat branch가 `codex/0130-p05-studio-campaign-audit`를 가리켜 현재 branch `main`과 맞지 않았다. 이 상태는 다른 세션이 main에서 시작할 때 운영 gate 실패로 이어진다.

## Drill Scope

- 게임 runtime 변경 없음
- UI/HUD/playfield/asset 변경 없음
- 운영 heartbeat/control room/report와 plan artifact만 갱신

## Required Completion Evidence

- GitHub issue 생성
- plan artifact 작성
- branch 작업
- local `check:ops-live`, `check:seed-ops-queue`, `check:ci`
- PR 생성
- PR checks green
- PR merge
- main CI green
- local main fast-forward
- final local status clean

## Status

Local verification passed. PR/checks/merge/main CI gate remains.

## Local Verification

- `npm run check:ops-live` — passed after heartbeat/control room refresh
- `npm run check:seed-ops-queue` — passed
- `npm run check:ci` — passed
