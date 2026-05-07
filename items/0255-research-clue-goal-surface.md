# 0255 연구 단서 목표 surface

## Problem

#476은 `달빛 family clue`를 도감 기록 state로 저장했지만, 기록 이후 플레이어가 다음에 무엇을 해야 하는지 보는 목표 surface가 아직 없다. discovery reward가 저장됐다는 피드백 다음에는 다음 씨앗/도감 목표가 화면 안에 남아야 한다.

## Goal

`researchClueAlbumRecorded` 이후 Phaser HUD/action rail에 `달빛 단서 기록됨`과 다음 씨앗 목표 preview를 보여주는 lightweight collection goal surface를 추가한다.

## Reference Teardown

- Cell to Singularity류는 새 node 발견 후 다음 node 목표를 같은 progression surface에 남긴다.
- 수집형 idle game은 단서 저장 후 “다음 수집 목표”를 명시해 재방문 동기를 만든다.
- Rejected alternative: record receipt만 유지한다. 저장은 됐지만 다음 목표가 사라져 loop가 다시 끊긴다.

## Creative Brief

기록 완료 뒤 action rail은 큰 신규 screen이 아니라 compact goal surface로 `달빛 단서 기록됨`, `다음 씨앗 목표: 달빛 새싹`, 후속 WorkUnit hook을 보여준다. 새 raster/FX 없이 HUD affordance와 telemetry만 좁게 추가한다.

## Game Studio Route

- `game-studio:game-studio`: collection meta 저장 이후 next goal surface 선택
- `game-studio:game-ui-frontend`: compact HUD/action rail surface
- `game-studio:phaser-2d-game`: state/telemetry 연결
- `game-studio:game-playtest`: 393px record -> goal surface screenshot evidence

## Strategic Jump Check

선택한 후보는 `player verb: 다음 목표 확인`, `production/progression role: collection meta -> next seed goal`, `screen moment: 도감 기록 직후`, `HUD affordance: compact recorded clue/next seed goal surface`, `playtest evidence: screenshot + telemetry`를 충족한다.

## Department Scorecard

| 부서 | 판정 | 근거 artifact |
| --- | --- | --- |
| 기획팀 | approve | recorded clue가 다음 seed goal로 이어진다. |
| 리서치팀 | approve | collection reward 이후 next target gap을 줄인다. |
| 아트팀 | revise | dedicated album card/record FX는 후속 후보이며 이번은 HUD surface만 다룬다. |
| 개발팀 | approve | runtime state/HUD/verifier만 좁게 수정한다. |
| 검수팀 | approve | record 후 goal surface screenshot과 telemetry를 남긴다. |
| 마케팅팀 | approve | local mock gameplay만 다룬다. |
| 고객지원팀 | approve | 기록 이후 다음 행동 혼란을 줄인다. |

## Subagent/Team Routing

Solo execute. 기존 Phaser HUD/action rail과 smoke verifier를 좁게 확장한다.

## Hard Problem Self-Evaluation Loop

- claim: clue album record 후 next seed goal surface가 보인다.
- smallest verifier: `npm run check:phaser`.
- rubric: record 후 action rail/objective에 `달빛 단서 기록됨`, `다음 씨앗 목표`가 보이고 telemetry로 goal surface visible 상태를 확인한다.
- artifact path: `reports/visual/issue-0478-research-clue-goal-surface/`.
- iteration log: full album screen은 후속 WorkUnit으로 남긴다.
- stop condition: `check:phaser`, `check:ci`, PR checks, main CI green.

## Plan

1. GitHub issue를 만들고 plan artifact에 연결한다.
2. #476 row를 done/main CI evidence로 정리한다.
3. recorded clue next-goal state/telemetry를 추가한다.
4. HUD/action rail에 compact goal surface를 추가한다.
5. smoke verifier와 visual report를 갱신한다.
6. local checks, PR checks, merge, main CI까지 진행한다.

## Acceptance Criteria

- `researchClueAlbumRecorded` 이후 goal surface가 보인다.
- surface text에 `달빛 단서 기록됨`과 `다음 씨앗 목표`가 포함된다.
- telemetry가 goal surface visible 상태를 제공한다.
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

- Issue: #478 `연구 단서 목표 surface` - https://github.com/bborok1234/strange-seed-shop/issues/478
- `npm run check:phaser`: pass
- `npm run check:ci`: pass
- Visual report: `reports/visual/issue-0478-research-clue-goal-surface/visual-report-20260508.md`
- Screenshot: `reports/visual/issue-0478-research-clue-goal-surface/phaser-check-research-clue-goal-surface-393.png`
- Telemetry: `researchClueGoalSurfaceVisible: true`, `researchClueAlbumRecorded: true`, `researchClueRecordReady: false`
- PR: pending
