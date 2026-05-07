# 0248 보관 바구니 채움 상태를 playfield에서 보여주기

## Problem

#461로 보관 잎을 회수할 수 있게 됐지만, storage 상태는 아직 action rail/objective를 읽어야만 알 수 있다. v1 board는 생산 엔진이 화면 자체에서 읽혀야 하므로, 보관 바구니가 `4/24`로 찼는지 `0/24`로 비었는지가 playfield facility state로 보여야 한다.

## Goal

보관 바구니가 unlocked이면 playfield 위에 작고 안정적인 storage fill bar/chip을 그린다. 생산 수령 후에는 `4/24` 채움 상태가 보이고, `회수` 후에는 `0/24` 비움 상태가 같은 자리에서 보인다.

## Reference Teardown

- Idle Miner Tycoon: storage/capacity는 패널을 열기 전에도 shaft/warehouse surface의 축적 상태로 읽힌다.
- Egg, Inc.: silo/offline cap은 숫자 설명보다 visual container/cap 상태로 이해된다.
- Rejected alternative: dedicated storage raster asset. 현재 세션에는 `OPENAI_API_KEY`/`SEED_ASSET_IMAGE_MODEL`이 없어 gpt-image-2 직접 생성이 막혀 있고, #461 직후의 작은 blocker는 storage state가 playfield에서 안 보이는 점이다. Dedicated raster/claim FX는 다음 asset-generation WorkUnit으로 남긴다.

## Creative Brief

보관 바구니는 그냥 crate fallback처럼 보이면 안 된다. 새 asset 없이도, 바구니 prop 위에 작은 fill bar와 `4/24` chip을 얹어 "여기에 잎이 쌓인다"는 의미를 board에서 바로 읽히게 한다.

## Game Studio Route

- `game-studio:game-studio`: storage/offline payoff visual 후보 선택
- `game-studio:game-ui-frontend`: playfield state overlay가 persistent HUD를 늘리지 않고 board 안에 머무는지 확인
- `game-studio:phaser-2d-game`: Phaser facility rendering과 deterministic smoke evidence
- `game-studio:game-playtest`: 393px screenshot에서 storage filled/claimed 상태 확인

## Candidate Issue List

| 후보 | 선택 | 사유 |
| --- | --- | --- |
| 보관 바구니 playfield fill state | selected | player verb 이후 변화가 board에 남고, asset/API blocker 없이 즉시 시각 payoff를 준다. |
| dedicated storage raster asset | rejected-blocked-now | OPENAI_API_KEY가 없고 gpt-image-2 직접 생성이 막혀 있다. Codex native fallback 저장 경로는 별도 asset WorkUnit에서 다룬다. |
| storage claim FX strip | rejected-for-now | 좋은 후속 payoff지만 새 FX strip provenance 없이 기존 FX만 재사용하면 current gate의 asset/FX 의도를 약하게 충족한다. |

## Strategic Jump Check

선택한 후보는 작은 연결 작업이지만 `player verb: 회수`, `production/progression role: 오프라인 보관`, `screen moment: 보관 바구니 prop`, `visual payoff: playfield fill state`, `playtest evidence: storage buffer/claimed screenshot`를 함께 닫는다. 큰 방향 점프 후보인 dedicated raster는 키/생성 저장 경로 문제로 이 WorkUnit에서 막혀 있어 다음 asset-specific issue로 분리한다.

## Title Contract

제목은 screen object `보관 바구니`, visual state `채움 상태`, screen moment `playfield`를 포함한다.

## Department Scorecard

| 부서 | 판정 | 근거 artifact |
| --- | --- | --- |
| 기획팀 | approve | storage/offline state가 패널 설명이 아니라 board state로 읽힌다. |
| 리서치팀 | approve | idle storage cap은 container/fill 상태로 읽히는 편이 production bar에 맞다. |
| 아트팀 | revise | 새 raster가 아니라 overlay로 처리한다. API 키 부재 때문에 dedicated storage raster는 후속 issue로 남긴다. |
| 개발팀 | approve | `renderFacilitySlot` storage branch와 smoke verifier만 수정한다. |
| 검수팀 | approve | `check:phaser` screenshot과 window state로 filled/claimed를 확인한다. |
| 마케팅팀 | approve | 로컬/mock gameplay만 다룬다. |
| 고객지원팀 | approve | 플레이어가 바구니가 찼는지 눌러보기 전에도 이해한다. |

## Role Debate

아트팀은 dedicated storage raster가 더 근본적이라고 보지만, 현재 API 키가 없어 gpt-image-2 생성은 blocked다. 이번에는 code-native UI overlay가 아니라 Phaser runtime playfield state를 추가해 보관 loop의 readability blocker를 제거하고, asset provenance가 필요한 raster/FX는 다음 후보로 남긴다.

## Subagent/Team Routing

Solo execute. 변경 범위가 Phaser renderer와 기존 smoke verifier로 좁고, 별도 asset generation lane이 이번 scope에서 blocked라 병렬 subagent를 쓰지 않는다.

## Hard Problem Self-Evaluation Loop

- claim: storage fill/claim 상태가 action rail을 읽지 않아도 playfield에서 보인다.
- smallest verifier: scripted Phaser smoke가 storage buffer screenshot과 storage claimed screenshot을 남기고 `__seedGardenStorageFillRatio`를 확인한다.
- rubric: fill 이후 ratio `1/6`, claim 이후 ratio `0`, screenshot path 존재, body scroll 없음.
- artifact path: `reports/visual/issue-0463-storage-playfield-fill-state/`
- iteration log: overlay가 card를 가리면 위치/크기를 줄이고, state가 안 맞으면 render/evaluate order를 수정한다.
- stop condition: `npm run check:phaser`, `npm run check:ci`, PR checks, main CI green.

## QA / Playtest Plan

1. Browser Use `iab` 노출을 다시 확인한다. 없으면 기존 blocker와 Playwright fallback을 기록한다.
2. `npm run check:phaser`를 storage fill/claim playfield state까지 확장한다.
3. `phaser-check-storage-buffer-393.png`, `phaser-check-storage-claimed-393.png`를 검토한다.
4. `npm run check:ci`를 실행한다.

## Plan

1. GitHub issue를 만들고 plan artifact에 연결한다.
2. #461 row를 이번 plan commit에서 done으로 정리한다.
3. storage facility render branch에 fill bar/chip을 추가한다.
4. smoke verifier에 storage fill ratio state를 노출/검증한다.
5. visual report, roadmap, dashboard, control room, heartbeat, PR body를 갱신한다.

## Acceptance Criteria

- 보관 바구니가 unlocked이면 playfield prop 위에 storage fill bar/chip이 보인다.
- 생산 수령 후 storage state가 `4/24`로 보인다.
- 회수 후 같은 위치에서 `0/24`로 비워진다.
- screenshot evidence가 filled/claimed 상태를 남긴다.
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

- Issue: https://github.com/bborok1234/strange-seed-shop/issues/463
- Draft PR: https://github.com/bborok1234/strange-seed-shop/pull/464

## Evidence

- `npm run check:phaser` pass
- `reports/visual/issue-0463-storage-playfield-fill-state/phaser-check-storage-buffer-393.png`
- `reports/visual/issue-0463-storage-playfield-fill-state/phaser-check-storage-claimed-393.png`
- `reports/visual/issue-0463-storage-playfield-fill-state/visual-report-20260508.md`
