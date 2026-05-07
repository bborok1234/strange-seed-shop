# 0254 연구 단서 도감 기록 bridge

## Problem

#474는 research shelf에서 얻은 `달빛 단서 씨앗`을 심고 수확하게 했지만, 수확한 family clue가 아직 도감/collection meta에 저장되지 않는다. 수집형 idle game은 새 단서를 얻은 뒤 collection record가 남아야 다음 목표가 명확하다.

## Goal

clue seed 수확 후 `도감 기록` action을 열고, 실행 시 `달빛 family clue`가 도감 단서로 저장됐다는 state/receipt/objective/telemetry를 남긴다.

## Reference Teardown

- Cell to Singularity류는 새 노드 발견 후 계통도/collection surface에 기록해 다음 node를 보이게 한다.
- 수집형 idle game은 발견 순간만큼 “기록됨/보관됨” 피드백이 중요하다.
- Rejected alternative: harvest receipt만 유지한다. 플레이어가 얻은 단서가 어디에 남는지 알 수 없다.

## Creative Brief

수확 직후 action rail에 `도감 기록`이 뜨고, 누르면 “달빛 단서 도감 기록” receipt와 다음 목표 objective가 남는다. 새 화면 전환 없이 Phaser board 안에서 collection meta로 이어지는 얇은 bridge만 만든다.

## Game Studio Route

- `game-studio:game-studio`: research clue harvest 후 collection meta bridge 선택
- `game-studio:phaser-2d-game`: state/action/telemetry 구현
- `game-studio:game-ui-frontend`: action rail affordance와 receipt/objective density
- `game-studio:game-playtest`: 393px clue harvest -> album record screenshot evidence

## Strategic Jump Check

선택한 후보는 `player verb: 도감 기록`, `production/progression role: discovery -> collection meta`, `screen moment: clue seed harvest 직후`, `HUD affordance/playfield state: 도감 기록 action + recorded telemetry`, `playtest evidence: screenshot + telemetry`를 충족한다.

## Department Scorecard

| 부서 | 판정 | 근거 artifact |
| --- | --- | --- |
| 기획팀 | approve | clue harvest가 collection meta로 저장된다. |
| 리서치팀 | approve | discovery reward가 persistent collection surface로 이어진다. |
| 아트팀 | revise | dedicated album/record animation은 후속 asset/FX 후보이며 이번엔 HUD/action bridge만 다룬다. |
| 개발팀 | approve | state/action/telemetry와 verifier만 좁게 수정한다. |
| 검수팀 | approve | clue harvest -> album record screenshot과 telemetry를 남긴다. |
| 마케팅팀 | approve | local mock gameplay만 다룬다. |
| 고객지원팀 | approve | “단서가 어디 갔는지” 혼란을 줄인다. |

## Subagent/Team Routing

Solo execute. 기존 Phaser state/action boundary 안에서 post-harvest action 하나를 추가하는 좁은 변경이다.

## Hard Problem Self-Evaluation Loop

- claim: clue seed harvest 후 `도감 기록` action으로 family clue를 저장할 수 있다.
- smallest verifier: `npm run check:phaser`.
- rubric: `researchClueRecordReady=true` after harvest, `도감 기록` action visible, record receipt/objective, `researchClueAlbumRecorded=true`, existing loop 유지.
- artifact path: `reports/visual/issue-0476-research-clue-album-record/`.
- iteration log: dedicated album animation/FX는 다음 visual WorkUnit 후보로 남긴다.
- stop condition: `check:phaser`, `check:ci`, PR checks, main CI green.

## Plan

1. GitHub issue를 만들고 plan artifact에 연결한다.
2. #474 row를 done/main CI evidence로 정리한다.
3. `GardenState`에 clue record ready/album recorded state를 추가한다.
4. clue seed harvest가 `도감 기록` action을 열게 한다.
5. `도감 기록` action과 receipt/objective/telemetry를 추가한다.
6. smoke verifier와 visual report를 갱신한다.
7. local checks, PR checks, merge, main CI까지 진행한다.

## Acceptance Criteria

- clue seed harvest 후 `researchClueRecordReady` telemetry가 true가 된다.
- action rail에 `도감 기록` action이 보인다.
- `도감 기록` 후 receipt에 `달빛 단서 도감 기록 · 다음 씨앗 목표 저장`이 남는다.
- `researchClueAlbumRecorded` telemetry가 true가 된다.
- 기존 plant/order/storage/research/clue seed smoke loop가 계속 통과한다.
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
- Record ready screenshot: `reports/visual/issue-0476-research-clue-album-record/phaser-check-research-clue-record-ready-393.png`
- Recorded screenshot: `reports/visual/issue-0476-research-clue-album-record/phaser-check-research-clue-recorded-393.png`
- Visual report: `reports/visual/issue-0476-research-clue-album-record/visual-report-20260508.md`
- Issue: https://github.com/bborok1234/strange-seed-shop/issues/476
- PR: https://github.com/bborok1234/strange-seed-shop/pull/477
