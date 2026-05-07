# 0257 다음 씨앗 목표 수령/심기 bridge

## Problem

#478은 도감 기록 직후 `달빛 단서 기록됨`과 `다음 씨앗 목표: 달빛 새싹` surface를 보여줬지만, 이 목표는 아직 실제 player verb로 닫히지 않는다. 플레이어가 다음 목표를 확인한 뒤 바로 씨앗을 받고 빈 밭에 심을 수 있어야 collection loop가 다시 재배 loop로 이어진다.

## Goal

도감 기록 후 goal surface에서 `목표 씨앗 받기` action을 제공하고, 수령한 `달빛 새싹 씨앗`을 빈 밭에서 `목표 심기`로 심는 Phaser bridge를 추가한다.

## Reference Teardown

- Cell to Singularity류 progression surface는 다음 node 목표를 보여준 뒤 바로 unlock/claim/activate verb로 연결한다.
- 수집형 idle game은 새 도감 기록 이후 “다음 목표 확인”에서 멈추지 않고 바로 다음 seed/source planting으로 루프를 재개한다.
- Rejected alternative: `다음 씨앗 목표` 텍스트만 유지한다. 목표는 보이지만 다음 행동이 없어 v1 loop가 다시 정지한다.

## Creative Brief

하단 action rail은 기존 compact goal surface를 유지하면서 `목표 씨앗 받기` 버튼을 붙인다. 수령 후 빈 밭을 선택하면 `목표 심기`가 보이고, 심은 밭에는 작은 `목표` chip이 떠서 다음 수집 루프가 다시 playfield 안에서 읽힌다.

## Game Studio Route

- `game-studio:game-studio`: collection next-goal을 player verb로 연결
- `game-studio:game-ui-frontend`: compact goal surface + CTA density 유지
- `game-studio:phaser-2d-game`: state/action/telemetry bridge
- `game-studio:game-playtest`: record -> claim -> plant 393px screenshot evidence

## Strategic Jump Check

선택한 후보는 `player verb: 목표 씨앗 받기/목표 심기`, `production/progression role: collection meta -> next planting loop`, `screen moment: 도감 기록 직후`, `HUD affordance: compact goal CTA`, `playfield state: 목표 chip`, `playtest evidence: screenshot + telemetry`를 충족한다.

## Department Scorecard

| 부서 | 판정 | 근거 artifact |
| --- | --- | --- |
| 기획팀 | approve | 다음 목표 surface가 실제 planting verb로 이어진다. |
| 리서치팀 | approve | progression target이 activate verb 없이 멈추는 경쟁작 대비 gap을 줄인다. |
| 아트팀 | approve | 새 accepted asset 없이 HUD affordance와 playfield chip만 다룬다. dedicated record FX는 #480 후속으로 분리됐다. |
| 개발팀 | approve | Phaser state/action/verifier만 좁게 확장한다. |
| 검수팀 | approve | record -> claim -> plant screenshot과 telemetry를 남긴다. |
| 마케팅팀 | approve | mock/local gameplay만 다루며 외부 채널/결제 없음. |
| 고객지원팀 | approve | 다음 목표를 보고도 무엇을 할지 모르는 혼란을 줄인다. |

## Subagent/Team Routing

Solo execute. 기존 Phaser state/HUD/verifier를 좁게 확장하는 단일-lane 작업이다.

## Hard Problem Self-Evaluation Loop

- claim: 도감 기록 후 다음 씨앗 목표를 수령하고 빈 밭에 심을 수 있다.
- smallest verifier: `npm run check:phaser`.
- rubric: `목표 씨앗 받기` -> `목표 심기` action path, `researchNextGoalSeedClaimed`, `researchNextGoalSeedPlanted` telemetry, planted plot `seed_lunar_sprout_001` state가 확인되어야 한다.
- artifact path: `reports/visual/issue-0482-next-seed-goal-claim-plant/`.
- iteration log: 다음 목표 성장/수확/reveal은 후속 WorkUnit으로 분리한다.
- stop condition: `check:phaser`, `check:ci`, PR checks, merge, main CI green.

## Plan

1. GitHub issue를 만들고 plan artifact에 연결한다.
2. #480 row를 done/main CI evidence로 정리한다.
3. next-goal seed claim/plant state와 telemetry를 추가한다.
4. HUD/action rail에 goal surface + claim CTA를 같이 렌더링한다.
5. empty plot `목표 심기` action과 playfield `목표` chip을 추가한다.
6. smoke verifier와 visual report를 갱신한다.
7. local checks, PR checks, merge, main CI까지 진행한다.

## Acceptance Criteria

- 도감 기록 후 `목표 씨앗 받기` action이 보인다.
- action을 누르면 `달빛 새싹 씨앗`이 준비됐다는 receipt/objective/telemetry가 남는다.
- 빈 밭에서 `목표 심기` action이 보이고, 심으면 plot seed id가 `seed_lunar_sprout_001`이 된다.
- planted plot에는 `목표` chip이 보인다.
- `researchNextGoalSeedClaimed`와 `researchNextGoalSeedPlanted` telemetry가 true가 된다.
- 기존 plant/order/storage/research/clue record smoke loop가 계속 통과한다.
- `npm run check:phaser`와 `npm run check:ci`가 통과한다.

## Verification Commands

- `npm run check:phaser`
- `npm run check:ci`
- `npm run check:control-room`
- `npm run check:ops-live`

## Browser Use

Browser Use execution tool이 이번 세션에 노출되지 않으면 Playwright fallback screenshots를 사용한다.

## Evidence

- Issue: #482 `다음 씨앗 목표 수령/심기 bridge` - https://github.com/bborok1234/strange-seed-shop/issues/482
- `npm run check:phaser`: pass
- `npm run check:ci`: pass
- Visual report: `reports/visual/issue-0482-next-seed-goal-claim-plant/visual-report-20260508.md`
- Screenshot: `reports/visual/issue-0482-next-seed-goal-claim-plant/phaser-check-next-goal-seed-planted-393.png`
- Telemetry: `researchNextGoalSeedClaimed: true`, `researchNextGoalSeedPlanted: true`, plot `seedId: seed_lunar_sprout_001`
- PR: #483 `다음 씨앗 목표 수령/심기 bridge` - https://github.com/bborok1234/strange-seed-shop/pull/483
