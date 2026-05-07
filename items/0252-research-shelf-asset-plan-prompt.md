# 0252 연구 선반 raster와 단서 FX plan-prompt

## Problem

#470은 storage claim 이후 `연구 선반` preview와 `살펴보기` verb를 열었지만, runtime은 아직 existing workbench raster를 임시 stand-in으로 재사용한다. v1 research/discovery bridge가 production surface로 읽히려면 연구 선반 고유 prop과 단서 확인 FX strip이 generation-ready asset contract에 있어야 한다.

## Goal

`facility_research_shelf_v1`과 `fx_research_clue_glimmer_strip_v1`을 `assets/source/asset_plan.json`, `assets/source/asset_prompts.json`, `scripts/check-topology-asset-plan.mjs`에 추가해 다음 generation/runtime integration WorkUnit이 재기획 없이 실행되게 한다.

## Reference Teardown

- Cell to Singularity류 progression은 다음 계통 discovery surface를 고유 object/visual language로 구분한다.
- Idle Miner류 facility preview는 생산 시설과 연구/upgrade surface가 silhouette로 다르게 읽혀야 장기 목표가 분리된다.
- Rejected alternative: workbench raster 재사용을 그대로 둔다. #470은 gameplay bridge만 닫았고, production art debt를 해소하지 못한다.

## Creative Brief

연구 선반은 작은 온실 실험대가 아니라 `다음 씨앗 단서를 살펴보는 선반`이어야 한다. 낮은 선반, 씨앗 표본 병, 작은 노트/렌즈, 달빛 계열 단서 glimmer가 보이되 텍스트나 UI 라벨은 포함하지 않는다. FX는 `살펴보기` 순간 선반 위에서 작은 달빛/잎빛 단서가 반짝이며 떠오르는 8프레임 strip이다.

## Game Studio Route

- `game-studio:game-studio`: #470 discovery bridge의 production art debt 후속 선택
- `game-studio:game-ui-frontend`: board preview prop과 action moment의 readable affordance
- `game-studio:sprite-pipeline`: clue FX strip frame contract
- `gpt-game-asset-plan`: generated raster/FX plan 작성
- `gpt-game-asset-prompt`: per-asset prompt 작성

## Strategic Jump Check

선택한 후보는 `player verb: 살펴보기`, `production/progression role: discovery/research`, `screen moment: storage claim 이후 research shelf 선택`, `asset/FX: research shelf raster + clue glimmer strip`, `playtest evidence: 다음 generation/runtime WorkUnit에서 screenshot`를 충족한다.

## Department Scorecard

| 부서 | 판정 | 근거 artifact |
| --- | --- | --- |
| 기획팀 | approve | #470 gameplay bridge를 research/discovery production surface로 승격한다. |
| 리서치팀 | approve | idle progression reference의 next-system visual preview gap을 줄인다. |
| 아트팀 | approve | dedicated raster와 clue FX strip을 생성 전 계약으로 고정한다. |
| 개발팀 | approve | runtime 변경 없이 plan/prompt/checker만 수정한다. |
| 검수팀 | approve | `check:topology-asset-plan`으로 one-to-one plan/prompt와 animation metadata를 잠근다. |
| 마케팅팀 | approve | local mock/game asset planning only. |
| 고객지원팀 | approve | 연구 선반이 workbench와 헷갈리는 위험을 줄인다. |

## Subagent/Team Routing

Solo execute. JSON plan/prompt 2개와 checker required id 추가로 범위가 좁고, external docs나 병렬 구현이 필요 없다.

## Hard Problem Self-Evaluation Loop

- claim: research shelf stand-in debt가 generation-ready asset/FX contract로 전환된다.
- smallest verifier: `npm run check:topology-asset-plan`.
- rubric: plan/prompt id one-to-one, raster PNG output path, no SVG/vector accepted game graphic, FX strip has frame count/size/fps/binding, requiredCount 증가.
- artifact path: `assets/source/asset_plan.json`, `assets/source/asset_prompts.json`, `scripts/check-topology-asset-plan.mjs`.
- iteration log: 실제 generation은 API key/native save-path blocker가 남아 있으면 실행하지 않는다.
- stop condition: `check:topology-asset-plan`, `check:asset-provenance`, `check:asset-style`, `check:ci`, PR checks, main CI green.

## Plan

1. GitHub issue를 만들고 plan artifact에 연결한다.
2. #470 row를 done/main CI evidence로 정리한다.
3. `facility_research_shelf_v1` asset plan을 추가한다.
4. `fx_research_clue_glimmer_strip_v1` asset plan과 animation metadata를 추가한다.
5. 두 asset prompt를 추가한다.
6. topology asset plan checker required ids/sprite ids를 갱신한다.
7. local checks, PR checks, merge, main CI까지 진행한다.

## Acceptance Criteria

- `facility_research_shelf_v1` plan/prompt가 존재한다.
- `fx_research_clue_glimmer_strip_v1` plan/prompt가 존재한다.
- FX plan에 `frame_count: 8`, `frame_size: "96x96"`, `intended_fps: 12`, `animation.binding: "facility_research_shelf.action.inspect_clue"`가 있다.
- output path는 모두 `public/assets/game/**.png`다.
- `scripts/check-topology-asset-plan.mjs`가 두 id를 필수로 검증한다.
- `npm run check:topology-asset-plan`, `npm run check:asset-provenance`, `npm run check:asset-style`, `npm run check:ci`가 통과한다.

## Verification Commands

- `npm run check:topology-asset-plan`
- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:ci`
- `npm run check:control-room`
- `npm run check:ops-live`

## Browser Use

Runtime UI 변경 없음. Visual evidence는 다음 generation/runtime integration WorkUnit에서 필요하다.

## Evidence

- `npm run check:topology-asset-plan` pass: requiredCount 18, planCount 71, promptCount 71
- `npm run check:asset-provenance` pass
- `npm run check:asset-style` pass
- `npm run check:ci` pass
- Issue: https://github.com/bborok1234/strange-seed-shop/issues/472
- PR: https://github.com/bborok1234/strange-seed-shop/pull/473
