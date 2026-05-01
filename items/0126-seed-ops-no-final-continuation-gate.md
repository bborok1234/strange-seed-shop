# Seed ops no-final continuation gate

Status: done
Owner: agent
Issue: #248
Branch: `codex/0126-seed-ops-no-final-continuation-gate`
PR: #249
Main CI: `25210777454`
Started: 2026-05-01

## 문제 / 배경

`$seed-ops`는 issue -> plan -> 구현 -> 검증 -> PR -> checks -> merge -> main CI -> 다음 issue를 반복해야 한다. 그러나 Issue #242와 Issue #245 두 loop를 완료한 뒤, stop rule이 없고 다음 queue 후보가 문서에 남아 있었는데도 assistant `final` 응답으로 세션이 닫혔다.

원인은 제품 코드가 아니라 운영 계약의 허점이다. 기존 문서에는 "완료 보고는 checkpoint"라고 쓰여 있었지만, assistant `final` 응답이 terminal action이라는 점과 "다음 후보를 남겼다"가 continuation이 아니라는 점을 자동 gate가 검증하지 않았다.

## Game Studio route

- Umbrella: N/A — 운영사 계약/검증 스크립트 수정이며 게임 기능/UI/HUD/playfield/asset 변경이 아니다.
- Specialist route: N/A — 화면 변경 없음.
- 북극성/플레이어 동사: 운영사 북극성. agent가 사람의 재촉 없이 다음 issue plan-first까지 계속 간다.
- Playfield 보호 또는 UI surface 원칙: N/A — UI 변경 없음.
- Playtest evidence 계획: N/A — Browser Use 대상 UI 변경 없음. 대신 운영 gate와 CI를 검증한다.

## Plan

1. `$seed-ops` skill에 `No-final continuation gate`를 추가한다.
2. `docs/PROJECT_COMMANDS.md`, `docs/AUTONOMOUS_PROJECT_OPERATING_MODEL.md`, `docs/OPERATOR_RUNBOOK.md`, `AGENTS.md`에 같은 stop/continuation 계약을 반영한다.
3. `scripts/check-seed-ops-queue-gate.mjs`가 no-final continuation phrase를 필수 검사하게 한다.
4. 이 사고의 원인과 재발 방지책을 `reports/operations/`에 남긴다.
5. `docs/ROADMAP.md`, dashboard, control room, heartbeat를 갱신한다.
6. `npm run check:seed-ops-queue`, `npm run check:project-commands`, `npm run check:ops-live`, `npm run check:dashboard`, `npm run check:ci`로 검증한다.

## 수용 기준

- [x] `$seed-ops` 문서가 assistant `final` 응답을 terminal action으로 명시하고, stop rule 없이 final을 금지한다.
- [x] 다음 issue 후보를 남기는 것과 실제 continuation을 구분하고, `next issue plan artifact exists` 상태를 요구한다.
- [x] 운영 모델/runbook/project commands/AGENTS가 동일한 no-final gate를 공유한다.
- [x] 자동 gate가 해당 계약 문구 누락을 실패로 잡는다.
- [x] 이번 사고 원인과 방지책이 운영 보고서에 남는다.
- [x] 로컬 검증과 CI gate가 통과한다.

## 검증 결과

- PASS: `npm run check:seed-ops-queue`
- PASS: `npm run check:project-commands`
- PASS: `npm run check:ops-live`
- PASS: `npm run check:dashboard`
- PASS: `npm run check:ci`
- PASS: PR #249 checks
- PASS: main CI `25210777454`

## 검증 명령

- `npm run check:seed-ops-queue`
- `npm run check:project-commands`
- `npm run check:ops-live`
- `npm run check:dashboard`
- `npm run check:ci`

## 건드리지 않을 범위

- 게임 runtime, UI, HUD, playfield, asset manifest, economy 수치.
- GitHub branch protection 또는 automerge 설정.
- 외부 배포, credential, 결제/광고/고객 데이터.
