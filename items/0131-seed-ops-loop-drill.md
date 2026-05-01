# Seed ops loop drill

Status: active
Owner: agent
Created: 2026-05-01
Updated: 2026-05-01
Work type: agent_ops
Scope-risk: narrow
Issue: #262

## Intent

`$seed-ops`가 하나의 작은 이슈를 issue -> plan artifact -> branch -> verification -> PR -> checks -> merge -> main CI -> main 최신화까지 애매하게 끊지 않고 닫는지 검증한다.

## Problem

main에서 `npm run check:ops-live`를 실행했을 때 heartbeat branch가 `codex/0130-p05-studio-campaign-audit`를 가리켜 현재 branch `main`과 맞지 않았다. 다른 세션이 main에서 시작할 때 이 상태면 운영 gate가 실패한다.

## Studio Campaign Gate

Campaign source of truth: `P0.5 Idle Core + Creative Rescue`

이번 이슈는 gameplay implementation이 아니라 seed-ops harness QA다. P0.5 gameplay issue를 고르지 않고, 운영 gate가 main 기준으로 이어지는지 검증한다.

## Game Studio Route

N/A — 운영 문서/heartbeat QA issue이며 게임 화면, UI/HUD, playfield, asset runtime을 변경하지 않는다.

## Game Studio Department Signoff

| 부서 | 이번 드릴 기준 | 산출물 |
| --- | --- | --- |
| 기획팀 | 다음 active issue #260이 main에서 보이는가 | ROADMAP/control room 확인 |
| 리서치팀 | loop 완료 기준이 merge 후 main CI까지인가 | seed-ops skill 기준 재확인 |
| 아트팀 | asset/FX 변경 없음 | N/A |
| 개발팀 | runtime 변경 없이 heartbeat/control room만 정리 | touched files 제한 |
| 검수팀 | `check:ops-live`, `check:seed-ops-queue`, `check:ci`, PR/main CI 확인 | verification evidence |
| 마케팅팀 | 실채널 action 없음 | N/A |
| 고객지원팀 | 다른 세션 main 시작 시 혼란 줄임 | active issue/main state 명시 |

## Subagent/Team Routing

사용하지 않음. 단일 drift 수정과 PR loop QA라서 병렬화 비용이 더 크다.

## Reference Teardown

ClawSweeper식 기준은 report와 dashboard가 실제 current state를 가리켜야 한다는 것이다. 여기서는 heartbeat/control room이 현재 branch/main state와 맞는지 검증한다.

## Creative Brief

N/A — 운영 하네스 QA.

## Role-Debate Note

개발팀 관점에서는 heartbeat만 고치면 충분하지만, 검수팀 관점에서는 main에서 시작하는 다른 세션이 읽을 durable report까지 필요하다. 이번 드릴은 heartbeat/control room/report를 함께 남긴다.

## Plan

1. Issue #260이 다음 active issue이며 완료 이슈가 아님을 유지한다.
2. main 기준 branch drift가 없도록 heartbeat와 control room을 현재 drill branch/issue로 갱신한다.
3. 작은 운영 보고서를 작성해 이번 seed-ops loop QA의 발견과 완료 기준을 남긴다.
4. 로컬 `check:ops-live`, `check:seed-ops-queue`, `check:ci`를 실행한다.
5. GitHub issue/PR/checks/merge/main CI/main 최신화까지 완료한다.

## Acceptance Criteria

- [x] `check:ops-live`가 branch mismatch 없이 통과한다.
- [x] `check:seed-ops-queue`가 통과한다.
- [x] `check:ci`가 통과한다.
- [ ] PR checks가 통과한다.
- [ ] PR merge 후 main CI가 통과한다.
- [ ] 로컬 작업공간이 `main...origin/main` clean 상태가 된다.

## Verification

- `npm run check:ops-live`
- `npm run check:seed-ops-queue`
- `npm run check:ci`

## Risks

- 이 드릴이 또 다음 작업을 브랜치에만 남기면 같은 문제가 반복된다. 완료 기준은 main merge + main CI + local main clean이다.

## Evidence

- Initial failure: main에서 `check:ops-live`가 heartbeat branch mismatch로 실패했다.
- Local fix: heartbeat/control room을 Issue #262 drill branch로 갱신했다.
- Local verification: `npm run check:ops-live`, `npm run check:seed-ops-queue`, `npm run check:ci` passed.
