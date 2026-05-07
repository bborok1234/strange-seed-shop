# 0253 연구 단서 씨앗 심기 bridge

## Problem

#470은 research shelf `살펴보기`까지 열었고 #472는 dedicated raster/FX generation contract를 만들었지만, player verb가 아직 “단서를 얻었다”에서 멈춘다. v1 idle collection tycoon은 discovery preview 다음에 즉시 작은 재배 행동으로 이어져야 “하나만 더 키워볼까?”가 살아난다.

## Goal

연구 선반 `살펴보기` 후 `달빛 씨앗 단서`를 확보하고, 빈 밭에서 `단서 심기` action으로 clue seed를 심고 돌보고 수확하는 Phaser bridge를 추가한다.

## Reference Teardown

- Cell to Singularity류는 새 계통 preview 후 즉시 다음 unlock/production node를 터치하게 한다.
- Egg, Inc./Idle Miner류는 새 시스템을 보여준 뒤 작은 first action으로 장기 목표를 현재 loop에 묶는다.
- Rejected alternative: research shelf inspect receipt만 유지한다. 단서는 생겼지만 재배 verb가 없어 D1 discovery가 아직 관찰 표면에 머문다.

## Creative Brief

`살펴보기`는 단서 씨앗을 얻는 순간이고, 빈 밭은 `단서 심기`라는 짧은 다음 행동을 제공한다. 새 raster가 아직 생성되지 않았으므로 runtime은 기존 plot states를 쓰되, objective/receipt/HUD action과 telemetry로 clue seed state를 분리한다.

## Game Studio Route

- `game-studio:game-studio`: #470/#472 이후 discovery bridge 다음 player verb 선택
- `game-studio:phaser-2d-game`: state machine/action/telemetry 구현
- `game-studio:game-ui-frontend`: action rail affordance와 objective text density
- `game-studio:game-playtest`: 393px research inspect -> clue planting screenshot evidence

## Strategic Jump Check

선택한 후보는 `player verb: 단서 심기`, `production/progression role: research/discovery -> cultivation bridge`, `screen moment: research shelf inspect 직후`, `HUD affordance/playfield state: 단서 심기 action + clue seed plot lifecycle`, `playtest evidence: screenshots + telemetry`를 충족한다.

## Department Scorecard

| 부서 | 판정 | 근거 artifact |
| --- | --- | --- |
| 기획팀 | approve | research clue가 즉시 재배 행동으로 이어진다. |
| 리서치팀 | approve | next-system preview 이후 first action gap을 줄인다. |
| 아트팀 | revise | dedicated research shelf/clue FX는 #472 plan-prompt까지 완료, runtime은 generated asset 전까지 기존 plot state를 사용한다. |
| 개발팀 | approve | state/action/telemetry와 verifier만 좁게 수정한다. |
| 검수팀 | approve | research inspect -> clue seed planted/harvested screenshots와 telemetry를 남긴다. |
| 마케팅팀 | approve | local mock gameplay만 다룬다. |
| 고객지원팀 | approve | `살펴보기` 후 다음 행동이 사라지는 혼란을 줄인다. |

## Subagent/Team Routing

Solo execute. 기존 Phaser state/action boundary 안에서 새 player verb를 추가하는 좁은 변경이다.

## Hard Problem Self-Evaluation Loop

- claim: research shelf inspect 후 clue seed를 빈 밭에 심고 수확할 수 있다.
- smallest verifier: `npm run check:phaser`.
- rubric: inspect 후 `researchClueSeedAvailable=true`, 빈 밭 action `단서 심기`, planting receipt/objective, harvest receipt/objective, telemetry `researchClueHarvested=true`, existing storage/research smoke 유지.
- artifact path: `reports/visual/issue-0474-research-clue-seed-planting/`.
- iteration log: dedicated generated research shelf/FX는 #472 계약 이후 다음 generation WorkUnit에서 처리한다.
- stop condition: `check:phaser`, `check:ci`, PR checks, main CI green.

## Plan

1. GitHub issue를 만들고 plan artifact에 연결한다.
2. #472 row를 done/main CI evidence로 정리한다.
3. `GardenState`에 research clue seed availability/planted/harvested state를 추가한다.
4. research shelf inspect가 clue seed를 확보하게 한다.
5. 빈 unlocked plot에 `단서 심기` action을 추가한다.
6. clue seed planting/harvest objective, receipt, telemetry를 추가한다.
7. Phaser smoke verifier와 visual report를 갱신한다.
8. local checks, PR checks, merge, main CI까지 진행한다.

## Acceptance Criteria

- research shelf `살펴보기` 후 `researchClueSeedAvailable` telemetry가 true가 된다.
- 빈 unlocked plot 선택 시 `단서 심기` action이 보인다.
- `단서 심기` 후 receipt에 `달빛 단서 씨앗을 심었다`가 남는다.
- clue seed 수확 후 receipt에 `달빛 단서 수확 · 달빛 family clue +1`가 남는다.
- `researchClueHarvested` telemetry가 true가 된다.
- 기존 plant/order/storage/overview/research smoke loop가 계속 통과한다.
- `npm run check:phaser`와 `npm run check:ci`가 통과한다.

## Verification Commands

- `npm run check:phaser`
- `npm run check:ci`
- `npm run check:control-room`
- `npm run check:ops-live`

## Browser Use

Browser Use execution tool이 이번 세션에 노출되지 않으면 Playwright fallback screenshots를 사용한다.

## Evidence

- `npm run check:phaser` pass
- `npm run check:ci` pass
- Clue action screenshot: `reports/visual/issue-0474-research-clue-seed-planting/phaser-check-research-clue-action-393.png`
- Clue planted screenshot: `reports/visual/issue-0474-research-clue-seed-planting/phaser-check-research-clue-planted-393.png`
- Clue harvested screenshot: `reports/visual/issue-0474-research-clue-seed-planting/phaser-check-research-clue-harvested-393.png`
- Visual report: `reports/visual/issue-0474-research-clue-seed-planting/visual-report-20260508.md`
- Issue: https://github.com/bborok1234/strange-seed-shop/issues/474
- PR: pending
