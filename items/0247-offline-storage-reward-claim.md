# 0247 보관 바구니가 오프라인 잎을 회수하게 만들기

## Problem

#459에서 `storedLeaves`가 생겼지만 플레이어가 그 잎을 회수하는 동사는 아직 없다. 지금 상태는 보관 바구니가 `오프라인 보관 4/24`를 보여주기만 하므로, Egg, Inc. / Idle Miner류의 복귀 보상처럼 "쌓였다 -> 가져간다 -> 다음 주문을 준비한다"는 loop payoff가 끊긴다.

## Goal

보관 바구니가 열린 뒤 생산 수령으로 잎이 쌓이면, 보관 바구니 선택 시 `회수` action을 제공한다. `회수`는 `storedLeaves`를 현재 잎에 더하고 storage를 0으로 비우며, objective/receipt가 오프라인 보상 회수 순간으로 읽히게 한다.

## Reference Teardown

- Idle Miner Tycoon: storage/capacity는 단순 숫자가 아니라 복귀 후 cash를 모아서 회수하는 player verb로 이어진다.
- Egg, Inc.: 사일로/오프라인 진행은 복귀 즉시 보상을 claim하는 순간이 있어야 cap 투자 의미가 읽힌다.
- Cookie Clicker류 idle: passive gain도 플레이어가 돌아왔을 때 명확한 gain receipt로 확인된다.
- Rejected alternative: dedicated storage raster asset을 먼저 만든다. storage의 정체성은 필요하지만, 현재 blocker는 이미 쌓인 buffer를 회수하지 못해 오프라인 복귀 hook이 기능적으로 닫히지 않는 것이다.

## Creative Brief

첫 5분 후반부에 플레이어는 보관 바구니를 열고, 다음 작업대 수령으로 `오프라인 보관 4/24`를 본다. 이 WorkUnit은 그 다음 tap을 `회수`로 연결해 "돌아오면 여기에 잎이 쌓이고 가져갈 수 있다"는 약속을 로컬 deterministic loop로 만든다.

## Game Studio Route

- `game-studio:game-studio`: v1 production loop의 storage/offline comeback 후보 선택
- `game-studio:phaser-2d-game`: `storedLeaves` transfer state와 action dispatch
- `game-studio:game-ui-frontend`: 보관 바구니 selected HUD/action rail affordance
- `game-studio:game-playtest`: storage fill -> storage claim screenshot/report evidence

## Candidate Issue List

| 후보 | 선택 | 사유 |
| --- | --- | --- |
| 보관 바구니 오프라인 잎 회수 | selected | player verb, offline comeback role, HUD affordance, deterministic smoke verifier가 모두 작고 직접적이다. |
| dedicated storage raster asset | rejected-for-now | asset identity는 중요하지만 `회수` verb가 없으면 새 raster도 장식에 머문다. 다음 asset/FX 후보로 남긴다. |
| 감상 모드/HUD 접기 strategic jump | rejected-for-now | 큰 방향 점프 후보지만 현재 v1 loop의 storage/offline branch가 반쯤 열린 상태라 first 5m loop closure가 우선이다. |

## Strategic Jump Check

선택한 후보는 직전 issue와 인접하지만 단순 copy/test-only 작업이 아니다. `player verb: 회수`, `production/progression role: 오프라인 복귀 보상`, `screen moment: 보관 바구니 선택 후 action rail`, `HUD payoff: 보관 4/24 -> 0/24와 잎 증가`, `playtest evidence: 393px screenshot + deterministic state assertions`를 동시에 닫는다.

## Title Contract

제목은 screen object `보관 바구니`, player verb `회수`, progression role `오프라인 잎`을 포함한다.

## Department Scorecard

| 부서 | 판정 | 근거 artifact |
| --- | --- | --- |
| 기획팀 | approve | 보관 바구니를 passive number가 아니라 `회수` verb로 연결한다. |
| 리서치팀 | approve | idle storage/offline gain은 복귀 claim 순간이 있어야 cap 투자가 읽힌다. |
| 아트팀 | revise | 새 accepted raster는 만들지 않는다. 대신 HUD affordance를 이번 payoff로 고정하고 dedicated storage raster는 다음 후보로 남긴다. |
| 개발팀 | approve | `claimStoredLeaves`와 action union/test path만 추가하는 좁은 tranche다. |
| 검수팀 | approve | `check:phaser`가 leaves/storedLeaves/objective/receipt를 검증할 수 있다. Browser Use는 도구 노출을 재시도한다. |
| 마케팅팀 | approve | 로컬/mock gameplay promise만 다룬다. 외부 채널/실결제 없음. |
| 고객지원팀 | approve | "보관된 잎은 바구니에서 회수한다"는 support FAQ 한 줄로 설명 가능하다. |

## Role Debate

아트팀은 dedicated storage raster를 지금 만들자는 의견이 있었지만, 개발/기획 관점에서 storage verb가 먼저 닫혀야 asset이 gameplay meaning을 갖는다. 이번 PR은 새 asset을 만들지 않고 HUD/action affordance로 loop를 닫고, 다음 후보에 storage raster 또는 storage-fill FX를 남긴다.

## Subagent/Team Routing

Solo execute. 변경 범위가 `gameState.ts`, `main.ts`, 기존 Phaser smoke verifier와 운영 문서에 국한되고, 병렬 subagent를 쓸 만큼 독립 산출물이 분리되지 않는다.

## Hard Problem Self-Evaluation Loop

- claim: 보관 바구니가 `오프라인 보관 4/24`에서 `회수` 가능한 comeback reward surface가 된다.
- smallest verifier: scripted Phaser smoke가 storage fill 이후 `회수`를 누르고 leaves/storedLeaves/objective/receipt를 읽는다.
- rubric: leaves `20`, storedLeaves `0`, objective에 `보관 잎 회수 완료`, receipt에 `오프라인 보관 회수` 포함, body scroll 없음.
- artifact path: `reports/visual/issue-0461-offline-storage-reward-claim/`
- iteration log: verifier 실패 시 state transfer, action visibility, HUD copy 순서로 수정한다.
- stop condition: `npm run check:phaser`, `npm run check:ci`, PR checks, main CI green.

## QA / Playtest Plan

1. Browser Use `iab` 도구 노출을 확인한다. 노출되지 않으면 Node REPL tool discovery를 기록하고 Playwright fallback을 사용한다.
2. `npm run check:phaser`로 storage fill -> storage claim 전체 smoke를 실행한다.
3. `reports/visual/issue-0461-offline-storage-reward-claim/phaser-check-storage-claimed-393.png`를 남긴다.
4. `npm run check:ci`로 통합 gate를 확인한다.

## Plan

1. GitHub issue를 만들고 plan artifact에 issue URL을 연결한다.
2. `claimStoredLeaves` state transition을 추가한다.
3. Phaser action rail에 `회수` action을 추가한다.
4. smoke verifier를 storage claim까지 확장하고 output directory를 이번 issue로 바꾼다.
5. visual report, roadmap, dashboard, control room, heartbeat, PR body를 갱신한다.

## Acceptance Criteria

- 보관 바구니가 unlocked이고 `storedLeaves > 0`이면 `회수` action이 보인다.
- `회수`는 `storedLeaves`만큼 잎을 늘리고 storage를 0으로 비운다.
- receipt가 `오프라인 보관 회수 · 잎 +n`을 남긴다.
- objective/action rail이 회수 후 `오프라인 보관 0/24` 상태를 보여준다.
- screenshot evidence가 storage claim 후 상태를 남긴다.
- runtime image generation/API/cache는 호출하지 않는다.
- `npm run check:phaser`와 `npm run check:ci`가 통과한다.

## Verification Commands

- `npm run check:phaser`
- `npm run check:ci`
- `npm run check:control-room`
- `npm run check:ops-live`

## Browser Use

Browser Use `iab`가 현재 도구 목록에 직접 노출되지 않으면 `tool_search`로 Browser Use/Node REPL 도구를 검색한 기록을 남기고, Playwright smoke screenshot을 fallback evidence로 사용한다.

## GitHub

- Issue: https://github.com/bborok1234/strange-seed-shop/issues/461
- Draft PR: pending

## Evidence

- pending
