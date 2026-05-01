# Game studio ops harness

Status: active
Owner: agent
Created: 2026-05-01
Updated: 2026-05-01
Work type: agent_ops
Scope-risk: moderate
Issue: #257
PR: #258

## Intent

`$seed-ops`가 직전 issue 옆의 작은 기능을 고르는 단편 loop로 축소되지 않게 한다. 다음 게임 작업 선택은 `P0.5 Idle Core + Creative Rescue` campaign을 기준으로 기획팀, 리서치팀, 아트팀, 개발팀, 검수팀, 마케팅팀, 고객지원팀 관점의 signoff를 남긴 뒤 하위 issue로 내려가야 한다.

## Problem

현재 하네스는 issue -> plan -> implementation -> QA -> PR -> merge loop는 강제하지만, campaign source of truth와 Game Studio Department Signoff를 강제하지 않는다. 그래서 P0.5 campaign이 핵심인데도 작업자는 이전 issue의 인접 작업만 고르고, asset/FX/animation/production gap 검토가 별도 역할로 남지 않는다.

## Studio Campaign Gate

Active campaign: `P0.5 Idle Core + Creative Rescue`

Campaign completion 기준:

- 첫 5분 loop가 심기, 성장 가속, 수확/발견, 자동 생산, 보상 사용, 다음 목표로 이어진다.
- 정원 화면에서 생산 주체, 생산량, 주문/납품, 다음 보상, 오프라인 복귀 hook이 즉시 읽힌다.
- 핵심 visual surface는 gpt-image-2 default 또는 Codex native fallback으로 만든 raster asset/FX를 사용하고, SVG/vector/code-native accepted game graphics를 금지한다.
- asset/FX work는 gastory식 style state, prompt/model sidecar, reference consistency, animation camera/composition lock, frame/spritesheet plan, manifest QA를 남긴다.
- Browser Use `iab` 또는 현재 세션 blocker와 visual regression evidence가 visible gameplay PR마다 남는다.

## Game Studio Department Signoff

| 부서 | 이번 harness 책임 | 완료 기준 |
| --- | --- | --- |
| 기획팀 | P0.5 완수 기준과 player verb를 다음 issue 선택 앞에 둔다 | ROADMAP Current Next Action이 campaign pass를 가리킴 |
| 리서치팀 | ClawSweeper, gastory, Anthropic Skills, Superpowers, GSD, gstack, Matt Pocock skills에서 운영 패턴을 추출한다 | reference review report가 있음 |
| 아트팀 | asset/FX issue가 gpt-image-2 default/fallback, style/provenance/animation evidence 없이는 통과하지 못하게 한다 | seed-ops/checker 문구가 있음 |
| 개발팀 | 기존 Intake/Review/Apply/Verify/Audit lane을 유지하고 department axis를 추가한다 | 운영 모델 문서가 execution stage와 ownership axis를 분리함 |
| 검수팀 | ops checker가 campaign, signoff, subagent/team routing을 강제한다 | `npm run check:seed-ops-queue`, `npm run check:ops-live` 통과 |
| 마케팅팀 | 실채널 action 없이 player-facing promise를 plan에 남기게 한다 | mock-only 문구가 유지됨 |
| 고객지원팀 | 첫 5분 혼란/support risk를 issue plan에 남기게 한다 | confusion/support risk 문구가 있음 |

## Plan

1. Reference review report를 작성해 ClawSweeper와 사용자가 준 agent/asset workflow 레퍼런스에서 운영 원칙을 추출한다.
2. `.codex/skills/seed-ops/SKILL.md`에 Studio Campaign Gate, Game Studio Department Signoff, Role-Debate Note, Subagent/Team Routing을 추가한다.
3. `docs/PROJECT_COMMANDS.md`, `docs/AUTONOMOUS_PROJECT_OPERATING_MODEL.md`, `docs/OPERATOR_RUNBOOK.md`, `docs/OPERATOR_CONTROL_ROOM.md`에 같은 운영 계약을 반영한다.
4. `docs/ROADMAP.md`의 P0.5와 Milestone 7, Current Next Action을 “다음 좁은 feature”가 아니라 P0.5 studio campaign pass로 갱신한다.
5. `scripts/check-seed-ops-queue-gate.mjs`와 `scripts/check-ops-live.mjs`가 campaign/signoff/subagent/team/gastory provenance 문구 누락을 실패로 잡게 한다.
6. dashboard와 heartbeat/control room을 갱신한다.

## Role-Debate Note

이번 harness 결정은 기존 `Intake / Review / Apply / Verify / Audit` lane을 유지하고, 그 위에 부서 ownership axis를 추가하는 것이다. Rejected alternative: 기존 lane을 기획팀/아트팀/개발팀 같은 부서명으로 갈아엎는 방식. 이유: ClawSweeper식 review/apply mutation safety가 흐려진다.

Plan field name: role-debate note

## Subagent/Team Routing

이번 작업에서는 Codex native subagents를 repo-local audit에 사용했다. 다음부터는 research, local audit, asset planning, runtime implementation, QA가 독립 산출물로 나뉘면 Codex native subagents 또는 team mode를 사용한다. 단일 파일/단일 책임 수정처럼 병렬화 비용이 큰 경우는 사용하지 않고 이유를 plan에 남긴다.

## Reference Teardown

ClawSweeper는 review lane/apply lane/durable report/audit drift를 분리한다. gastory는 project style state, prompt/model sidecar, reference image consistency, animation camera/composition lock, frame/GIF/spritesheet extraction을 asset bundle로 다룬다. Superpowers/GSD/gstack은 plan, 역할, 병렬 실행, review, finish gate를 분리한다.

Plan field name: reference teardown

## Creative Brief

P0.5 campaign은 기능 작동이 아니라 첫 5분 idle production scene이 게임처럼 보이는 상태를 목표로 한다. asset/FX와 UI/HUD/playfield는 구현의 장식이 아니라 core loop payoff다.

Plan field name: creative brief

## QA/Playtest Plan

Docs/checker gate는 `npm run check:seed-ops-queue`, `npm run check:ops-live`, `npm run check:project-commands`, `npm run check:operator`, `npm run check:control-room`, `npm run check:ci`로 검증한다. 다음 gameplay issue는 Browser Use `iab` 또는 현재 세션 blocker와 screenshot/report evidence를 추가로 남긴다.

Plan field name: QA/playtest plan

## Acceptance Criteria

- `P0.5 Idle Core + Creative Rescue`가 다음 issue 선택의 campaign source of truth로 명시된다.
- 새 게임 issue는 Game Studio Department Signoff 없이 implementation issue로 내려갈 수 없다.
- Subagent/team routing decision이 다음 issue plan의 필수 필드가 된다.
- Asset/FX issue는 gastory식 style/provenance/animation bundle 기준을 포함한다.
- 운영 checker가 위 문구 누락을 실패로 처리한다.

## Verification

- `npm run check:seed-ops-queue` — passed
- `npm run check:ops-live` — passed
- `npm run check:project-commands` — passed
- `npm run check:operator` — passed
- `npm run check:control-room` — passed
- `npm run check:dashboard` — passed
- `npm run check:docs` — passed
- `npm run check:ci` — passed

## Risks

- 문서 gate만 강해지고 실제 실행이 안 바뀔 위험이 있다. 이를 막기 위해 ROADMAP Current Next Action과 control room snapshot을 campaign pass로 바꾸고 checker에 phrase gate를 추가한다.
- 부서 모델이 과한 roleplay가 될 수 있다. 그래서 각 부서는 산출물과 통과 조건만 갖고, 실제 권한은 기존 ClawSweeper식 Intake/Review/Apply/Verify/Audit lane을 유지한다.
