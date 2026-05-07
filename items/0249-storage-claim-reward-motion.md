# 0249 보관 잎 회수에 reward motion 붙이기

## Problem

#463까지 보관 바구니는 `4/24 -> 0/24` 상태를 playfield에서 보여주지만, `회수` 순간은 아직 숫자와 receipt 중심이다. v1 idle game feel 기준에서는 보상을 가져가는 순간에 보관 바구니 위치에서 즉시 시각 반응이 필요하다.

## Goal

보관 바구니 `회수` action을 누르면 기존 generated `fx_harvest_leaf_flyout_strip_v1`을 storage slot 위치에서 재생해, 잎이 보관 바구니에서 플레이어에게 날아오는 reward motion처럼 보이게 한다.

## Reference Teardown

- Egg, Inc. / Idle Miner류 idle game은 claim/cash collection 순간에 숫자뿐 아니라 위치 기반 reward motion으로 보상 수령을 확인시킨다.
- Cookie Clicker류 idle도 숫자 변화와 함께 클릭 반응이 즉시 온다.
- Rejected alternative: dedicated storage claim FX strip을 새로 생성한다. 현재 이미지 API 키가 없으므로 새 accepted asset generation은 별도 asset WorkUnit으로 분리하고, 이번에는 이미 generated/provenance를 통과한 harvest leaf flyout strip을 storage claim binding에도 재사용한다.

## Creative Brief

플레이어가 `회수`를 누르면 보관 바구니에서 잎이 튀어 올라 "쌓인 보상을 가져갔다"는 느낌이 나야 한다. 숫자 `20`과 receipt만으로 끝나지 않고, storage slot이 직접 반응한다.

## Game Studio Route

- `game-studio:game-studio`: storage/offline reward motion 후보 선택
- `game-studio:phaser-2d-game`: claim action -> pending FX routing
- `game-studio:game-ui-frontend`: reward motion이 HUD/action rail을 가리지 않는지 확인
- `game-studio:game-playtest`: 393px storage claim screenshot evidence

## Candidate Issue List

| 후보 | 선택 | 사유 |
| --- | --- | --- |
| 보관 잎 회수 reward motion | selected | player verb와 reward feedback을 직접 연결하고 기존 verified FX strip으로 빠르게 검증 가능하다. |
| dedicated storage claim FX strip | rejected-for-now | 새 asset generation/provenance가 필요하며 API 키가 없다. 다음 asset-specific WorkUnit 후보로 남긴다. |
| 감상 모드/HUD 접기 | rejected-for-now | 큰 방향 후보지만 storage/offline branch의 claim game feel이 먼저 닫히는 편이 v1 loop closure에 직접적이다. |

## Strategic Jump Check

선택한 후보는 `player verb: 회수`, `production/progression role: 오프라인 보상`, `screen moment: 보관 바구니 claim`, `asset/FX: existing generated leaf flyout strip reward motion`, `playtest evidence: storage claim screenshot`를 함께 충족한다. 새 asset은 만들지 않지만, runtime image generation 없이 이미 accepted generated FX를 새 gameplay binding에 연결한다.

## Title Contract

제목은 player verb `회수`, reward moment `reward motion`, storage object `보관 잎`을 포함한다.

## Department Scorecard

| 부서 | 판정 | 근거 artifact |
| --- | --- | --- |
| 기획팀 | approve | 회수 verb가 즉시 보상 반응으로 이어진다. |
| 리서치팀 | approve | idle claim 순간은 위치 기반 reward motion이 production quality에 맞다. |
| 아트팀 | approve | 새 raster 없이 existing generated FX strip을 reuse한다. dedicated storage FX는 후속 후보. |
| 개발팀 | approve | pending FX kind/slot routing과 smoke verifier만 수정한다. |
| 검수팀 | approve | `check:phaser` screenshot과 receipt/state로 검증한다. |
| 마케팅팀 | approve | 로컬/mock gameplay만 다룬다. |
| 고객지원팀 | approve | 플레이어가 회수 성공을 즉시 이해한다. |

## Subagent/Team Routing

Solo execute. 변경 범위가 Phaser FX routing과 smoke verifier로 좁고, 새 asset generation lane은 이번 scope에 없다.

## Hard Problem Self-Evaluation Loop

- claim: storage claim이 숫자/receipt뿐 아니라 storage 위치 reward motion으로 보인다.
- smallest verifier: scripted Phaser smoke가 storage claim 후 screenshot과 receipt/state를 남긴다.
- rubric: `회수` 후 leaves `20`, storedLeaves `0`, receipt `오프라인 보관 회수`, screenshot path 존재, body scroll 없음.
- artifact path: `reports/visual/issue-0465-storage-claim-reward-motion/`
- iteration log: FX가 storage 위치가 아니면 pendingFx slotId/action mapping을 수정한다.
- stop condition: `npm run check:phaser`, `npm run check:ci`, PR checks, main CI green.

## QA / Playtest Plan

1. Browser Use `iab` 노출을 다시 확인한다. 없으면 Playwright fallback을 기록한다.
2. `npm run check:phaser`로 storage claim screenshot과 state를 확인한다.
3. `npm run check:ci`를 실행한다.

## Plan

1. GitHub issue를 만들고 plan artifact에 연결한다.
2. #463 row를 이번 plan commit에서 done으로 정리한다.
3. storage claim action이 pending FX를 storage slot에 걸도록 한다.
4. smoke verifier output/report를 #465 경로로 갱신한다.
5. PR body/comment evidence를 남기고 checks/merge/main CI까지 진행한다.

## Acceptance Criteria

- `회수` action 후 storage slot 위치에서 leaf flyout reward motion이 재생된다.
- 회수 후 leaves `20`, storedLeaves `0`, receipt `오프라인 보관 회수 · 잎 +4`가 유지된다.
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

- Issue: https://github.com/bborok1234/strange-seed-shop/issues/465
- Draft PR: pending

## Evidence

- pending
