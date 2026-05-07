# 0251 연구 선반 preview bridge

## Problem

#469까지 Phaser board는 storage/offline reward와 감상 모드까지 열렸지만, storage claim 이후 다음 장기 목표가 연구/씨앗 단서로 이어지지 않는다. v1 idle collection tycoon은 생산/보관/주문 다음에 discovery surface가 보여야 D1-D7 retention 실루엣이 생긴다.

## Goal

보관 잎 회수 후 `연구 선반` facility preview를 board에 노출하고, `살펴보기` action으로 다음 씨앗 family clue preview를 확인하게 한다.

## Reference Teardown

- Cell to Singularity류 progression은 다음 계통/발견 실루엣이 보여야 반복 생산이 discovery로 이어진다.
- Egg, Inc. / Idle Miner류는 첫 생산 병목을 닫은 뒤 다음 시설/구역 preview를 보여 장기 목표를 만든다.
- Rejected alternative: research shelf 전용 raster를 먼저 생성한다. #467 이후 asset generation은 API key/native save-path blocker가 있어 별도 WorkUnit으로 남긴다.

## Creative Brief

연구 선반은 아직 완성 시설이 아니라 작은 단서 surface다. 보관 바구니 회수 후 왼쪽 board에 `연구 선반` preview가 나타나고, `살펴보기`를 누르면 “달빛 씨앗 단서 preview” receipt와 다음 WorkUnit 연결 objective가 남아야 한다.

## Game Studio Route

- `game-studio:game-studio`: D1 discovery bridge 후보 선택
- `game-studio:game-ui-frontend`: board preview와 action rail affordance
- `game-studio:phaser-2d-game`: facility kind/state/action 추가
- `game-studio:game-playtest`: 393px storage claim -> research shelf inspect screenshot evidence

## Strategic Jump Check

선택한 후보는 `player verb: 살펴보기`, `production/progression role: discovery bridge`, `screen moment: storage claim 이후`, `playfield state: 연구 선반 preview`, `playtest evidence: screenshot + telemetry`를 충족한다.

## Department Scorecard

| 부서 | 판정 | 근거 artifact |
| --- | --- | --- |
| 기획팀 | approve | storage reward가 research/discovery로 이어진다. |
| 리서치팀 | approve | incremental/idle progression의 다음 계통 preview gap을 줄인다. |
| 아트팀 | revise | dedicated research shelf raster가 없어 existing workbench raster를 임시 재사용한다. blocker report를 남겼고 다음 asset WorkUnit 필요. |
| 개발팀 | approve | `FacilityKind`, board slot, action, smoke verifier를 좁게 수정한다. |
| 검수팀 | approve | research shelf ready/inspected screenshots와 telemetry를 남긴다. |
| 마케팅팀 | approve | local mock gameplay만 다룬다. |
| 고객지원팀 | approve | 다음 목표가 연구 단서로 읽힌다. |

## Subagent/Team Routing

Solo execute. runtime state/action 추가와 verifier 갱신으로 범위가 좁고, Browser Use tool surface가 노출되지 않아 Playwright fallback evidence를 사용한다.

## Hard Problem Self-Evaluation Loop

- claim: storage claim 후 research shelf preview가 열리고 `살펴보기` receipt/objective가 남는다.
- smallest verifier: `npm run check:phaser`가 storage claim 이후 research ready/inspected screenshot과 telemetry를 검증한다.
- rubric: `facility_research_shelf` preview, `researchShelfPreviewSeen=true`, receipt `연구 선반 살펴보기`, objective `연구 단서 확인`, existing storage loop 유지.
- artifact path: `reports/visual/issue-0470-research-shelf-preview-bridge/`
- iteration log: research shelf는 existing workbench raster 임시 재사용이므로 asset debt를 남긴다.
- stop condition: `npm run check:phaser`, `npm run check:ci`, PR checks, main CI green.

## Plan

1. GitHub issue를 만들고 plan artifact에 연결한다.
2. #434 row를 done으로 정리한다.
3. `research_shelf` facility kind, board slot, preview state를 추가한다.
4. storage claim 후 research shelf preview를 연다.
5. `살펴보기` action과 receipt/objective를 추가한다.
6. smoke verifier와 visual report를 갱신한다.
7. PR checks, merge, main CI까지 진행한다.

## Acceptance Criteria

- storage claim 후 `facility_research_shelf`가 preview slot으로 보인다.
- research shelf 선택 시 `살펴보기` action이 보인다.
- `살펴보기` 후 receipt에 `연구 선반 살펴보기 · 달빛 씨앗 단서 preview`가 남는다.
- `researchShelfPreviewSeen` telemetry가 true가 된다.
- 기존 plant/order/storage/overview smoke loop가 계속 통과한다.
- `npm run check:phaser`와 `npm run check:ci`가 통과한다.

## Verification Commands

- `npm run check:phaser`
- `npm run check:ci`
- `npm run check:control-room`
- `npm run check:ops-live`

## Browser Use

Browser Use execution tool이 이번 세션에 노출되지 않아 Playwright fallback을 사용한다.

## Evidence

- `npm run check:phaser` pass
- `npm run check:ci` pass
- Ready screenshot: `reports/visual/issue-0470-research-shelf-preview-bridge/phaser-check-research-shelf-ready-393.png`
- Inspected screenshot: `reports/visual/issue-0470-research-shelf-preview-bridge/phaser-check-research-shelf-inspected-393.png`
- Visual report: `reports/visual/issue-0470-research-shelf-preview-bridge/visual-report-20260508.md`
- Issue: https://github.com/bborok1234/strange-seed-shop/issues/470
- PR: pending
