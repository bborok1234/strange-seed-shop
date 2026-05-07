# 0250 보관 바구니 전용 raster와 회수 FX plan-prompt 만들기

## Problem

#465까지 보관 바구니는 unlock, fill, claim, reward motion까지 gameplay verb가 연결됐다. 하지만 playfield prop은 아직 범용 workbench/order facility raster 언어를 빌리고 있고, claim FX도 harvest leaf flyout을 재사용한다. v1 vertical slice 기준에서는 `오프라인 보관` 기능이 화면에서 고유 오브젝트와 고유 보상 연출 후보로 분리돼야 한다.

## Goal

runtime image generation 없이, 다음 asset generation WorkUnit이 바로 실행할 수 있도록 `facility_storage_basket_v1`과 `fx_storage_claim_leaf_flyout_strip_v1`의 asset plan/prompt를 추가한다.

## Reference Teardown

- Egg, Inc. / Idle Miner류 idle game은 생산/보관/수령 facility가 각자 다른 prop silhouette를 가져서 플레이어가 숫자 HUD를 읽기 전에도 기능을 구분한다.
- Cookie Clicker류 incremental game도 클릭 보상과 수령 보상이 별도 순간 효과로 구분된다.
- Rejected alternative: 지금 placeholder를 유지하고 HUD chip만 강화한다. 이미 #463에서 chip은 해결됐지만, facility 자체의 고유성이 부족해 production art debt가 남는다.

## Creative Brief

`보관 바구니`는 order crate와 헷갈리지 않는 낮고 둥근 basket prop이어야 한다. claim FX는 바구니 안에서 잎 보상이 튀어 올라오는 짧은 horizontal strip이어야 하며, storage fill chip과 하단 action rail을 가리지 않아야 한다.

## Game Studio Route

- `game-studio:game-studio`: storage/offline reward asset payoff 후보 선택
- `game-studio:sprite-pipeline`: storage claim FX strip의 frame count, frame size, intended fps, animation binding 고정
- `gpt-game-asset-plan`: static raster asset plan 추가
- `gpt-game-asset-prompt`: per-asset image generation prompt 추가
- `game-studio:game-playtest`: 이번 WorkUnit은 runtime UI 변경이 없으므로 다음 generation/runtime integration WorkUnit에서 visual QA 수행

## Candidate Issue List

| 후보 | 선택 | 사유 |
| --- | --- | --- |
| 보관 바구니 전용 raster/claim FX plan-prompt | selected | #465가 남긴 dedicated asset debt를 generation 가능한 계약으로 바꾼다. |
| 바로 gpt-image-2 생성 | rejected-now | 현재 `OPENAI_API_KEY`/`SEED_ASSET_IMAGE_MODEL`이 준비돼 있지 않다. Codex native fallback 또는 API 실행은 다음 WorkUnit에서 분리한다. |
| 감상 모드/HUD 접기 | rejected-now | 큰 UX 후보지만 storage/offline reward vertical slice의 asset debt를 먼저 닫는다. |

## Strategic Jump Check

선택한 후보는 `player verb: 오프라인 보관 회수`, `production/progression role: storage/offline reward identity`, `screen moment: 보관 바구니 unlock/fill/claim`, `asset/FX: new facility raster + dedicated claim FX strip`, `playtest evidence: follow-up generation/runtime integration` 중 4개를 충족한다.

## Title Contract

제목은 player object `보관 바구니`, asset type `raster`, reward moment `회수 FX`, output `plan-prompt`를 포함한다.

## Department Scorecard

| 부서 | 판정 | 근거 artifact |
| --- | --- | --- |
| 기획팀 | approve | storage/offline reward verb가 고유 facility identity로 이어진다. |
| 리서치팀 | approve | 경쟁 idle game은 facility silhouette와 claim motion으로 기능을 즉시 구분한다. |
| 아트팀 | approve | PNG raster와 FX strip만 계획하고 SVG/vector/code-native game graphics를 금지한다. |
| 개발팀 | approve | JSON plan/prompt만 수정하며 runtime behavior는 바꾸지 않는다. |
| 검수팀 | approve | topology/asset provenance/style check로 generation-ready 계약을 검증한다. |
| 마케팅팀 | approve | mock/local asset pipeline만 다루며 외부 채널이나 결제를 건드리지 않는다. |
| 고객지원팀 | approve | 보관 바구니와 주문 상자의 혼동 위험을 줄이는 방향이다. |

## Subagent/Team Routing

Solo execute. 변경 범위가 `assets/source/asset_plan.json`, `assets/source/asset_prompts.json`, 운영 문서 갱신으로 좁고, 병렬 subagent가 추가 증거를 만들 만큼 독립된 구현 lane이 없다.

## Hard Problem Self-Evaluation Loop

- claim: storage facility와 storage claim FX가 다음 generation batch에서 별도 PNG/strip으로 만들 수 있게 plan/prompt가 완비됐다.
- smallest verifier: plan/prompt JSON parse, id one-to-one, required prompt sections, sprite metadata, asset provenance/style checks.
- rubric: planCount와 promptCount가 모두 69, 새 id 2개가 양쪽에 존재, FX는 frame_count/frame_size/intended_fps/animation.binding을 가진다.
- artifact path: `assets/source/asset_plan.json`, `assets/source/asset_prompts.json`
- iteration log: checker가 누락 metadata를 잡으면 prompt/plan을 수정한다.
- stop condition: local asset/ops checks, PR checks, merge, main CI green.

## QA / Playtest Plan

1. `npm run check:topology-asset-plan`으로 plan/prompt one-to-one과 sprite metadata를 확인한다.
2. `npm run check:asset-provenance`와 `npm run check:asset-style`로 새 planned raster가 provenance/style 계약을 깨지 않는지 확인한다.
3. `npm run check:ci`로 전체 repo gate를 확인한다.
4. Browser Use는 runtime visual 변화가 없어 이번 WorkUnit에서는 N/A로 기록하고, 다음 generation/runtime integration WorkUnit에서 적용한다.

## Plan

1. GitHub issue를 만들고 plan artifact에 연결한다.
2. #465 row를 이번 plan commit에서 done으로 정리한다.
3. `facility_storage_basket_v1` plan/prompt를 추가한다.
4. `fx_storage_claim_leaf_flyout_strip_v1` plan/prompt와 animation metadata를 추가한다.
5. roadmap/control-room/dashboard/heartbeat를 갱신한다.
6. local checks, PR checks, merge, main CI까지 진행한다.

## Acceptance Criteria

- `assets/source/asset_plan.json`에 `facility_storage_basket_v1`이 PNG output path와 storage/facility tags로 추가된다.
- `assets/source/asset_plan.json`에 `fx_storage_claim_leaf_flyout_strip_v1`이 frame count, frame size, intended fps, `animation.binding`과 함께 추가된다.
- `assets/source/asset_prompts.json`에 두 asset의 generation prompt와 acceptance checks가 추가된다.
- prompt count와 plan count가 같고, 새 prompts는 runtime generation을 요구하지 않는다.
- `npm run check:topology-asset-plan`, `npm run check:asset-provenance`, `npm run check:asset-style`, `npm run check:ci`가 통과한다.

## Verification Commands

- `npm run check:topology-asset-plan`
- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:ci`
- `npm run check:control-room`
- `npm run check:ops-live`

## Browser Use

N/A — 이번 WorkUnit은 runtime UI/visual 변경 없이 asset plan/prompt만 추가한다. 다음 generated asset/runtime integration WorkUnit에서 Browser Use 또는 명시 blocker + Playwright fallback evidence를 남긴다.

## GitHub

- Issue: https://github.com/bborok1234/strange-seed-shop/issues/467
- Draft PR: https://github.com/bborok1234/strange-seed-shop/pull/468

## Evidence

- `npm run check:topology-asset-plan` pass: requiredCount 16, planCount 69, promptCount 69, failures 0
- `npm run check:asset-provenance` pass
- `npm run check:asset-style` pass
- `npm run check:control-room` pass
- `npm run check:ops-live` pass
- `npm run check:ci` pass
