# 0236 Topology asset plan and prompt batch

## Problem

#433은 신규 Phaser lane이 runtime topology와 first actor task를 증명하게 만들었지만, visual layer는 아직 Phaser placeholder shape다. `docs/phaser/REBOOT_FOUNDATION_SPEC.md`와 `docs/GAME_PRODUCTION_SPEC.md`는 accepted game asset이 raster PNG provenance를 가져야 한다고 고정한다. 다음 구현이 placeholder를 production art로 굳히지 않으려면 topology에 필요한 asset id와 prompt batch를 먼저 확정해야 한다.

## Goal

`assets/source/asset_plan.json`과 `assets/source/asset_prompts.json`에 v1 garden board foundation용 raster asset/sprite/FX bundle을 추가한다.

필수 asset bundle:

- gameplay object 없는 terrain background
- plot empty/sprout/growing/ready/locked preview states
- workbench, order crate empty/filled
- Pori caretaker strip, Momo carrier strip
- care spark FX, harvest leaf flyout FX
- soft grounding shadow utility

## Game Studio Route

- `game-studio:game-studio`: #433 이후 asset/FX WorkUnit 선택
- `game-studio:web-3d-asset-pipeline`: 해당 없음, 2D raster bundle
- `game-studio:sprite-pipeline`: actor/FX strip frame count, frame size, binding
- `game-studio:game-ui-frontend`: small-size readability and HUD/playfield relationship
- `game-studio:game-playtest`: generation 이후 small-size visual review

## Department Scorecard

| 부서 | 판정 | 근거 artifact |
| --- | --- | --- |
| 기획팀 | approve | #433 foundation의 next blocker는 placeholder art다. Asset bundle은 first 5m plot/actor/order screen moment를 직접 강화한다. |
| 리서치팀 | approve | Production gap: idle 경쟁작처럼 plot/order/worker state가 텍스트 없이도 읽혀야 한다. Background에 gameplay object를 baked-in 하지 않는 선택을 유지한다. |
| 아트팀 | approve | gpt-image-2/Codex native raster provenance를 위한 stable asset id, frame count, frame size, manifest binding을 먼저 고정한다. |
| 개발팀 | approve | Runtime은 manifest asset id로 교체 가능해야 하며, 이번 WorkUnit은 JSON plan/prompt만 수정한다. |
| 검수팀 | approve | JSON parse, id uniqueness, prompt-plan match, no SVG/vector/code-native output, animation metadata 존재를 검증한다. |
| 마케팅팀 | approve | 외부 채널/실결제/광고 없음. |
| 고객지원팀 | approve | plot/order/facility state가 텍스트 의존을 줄여 첫 5분 혼란을 낮춘다. |

## Self-Evaluation Loop

Claim: v1 garden board foundation의 다음 asset generation이 product decision 없이 바로 실행 가능한 plan/prompt 상태다.

Smallest verifier:

- `node -e` JSON parse/id uniqueness check
- plan asset ids와 prompt asset ids의 exact match
- FX/actor strip entries include frame count, frame size, intended fps, `animation.binding`

Rubric:

| 항목 | 통과 기준 |
| --- | --- |
| coverage | REBOOT foundation required asset 14개가 모두 계획됨 |
| provenance readiness | output path는 workspace PNG이고 runtime generation 없음 |
| sprite metadata | actor/FX strip에 frame count/frame size/fps/binding이 있음 |
| prompt quality | prompt가 use case/type/request/style/composition/palette/constraints/avoid를 포함 |
| generation readiness | product decision 없이 image generation skill로 이어갈 수 있음 |

Artifact path:

- `assets/source/asset_plan.json`
- `assets/source/asset_prompts.json`

Stop condition:

- plan/prompt JSON이 검증되고 GitHub issue/PR evidence를 남기거나, generation key/quota/tool access blocker가 명확히 기록될 때.

## Plan

1. GitHub issue를 생성한다.
2. `asset_plan.json`에 topology asset bundle 14개를 추가한다.
3. `asset_prompts.json`에 동일 asset ids의 generation prompts를 추가한다.
4. JSON parse/id uniqueness/prompt-plan match 검증을 실행한다.
5. Roadmap/control room/heartbeat를 갱신한다.

## Acceptance Criteria

- `asset_plan.json`에 `topology_foundation_0236` 목적의 14개 asset이 추가된다.
- `asset_prompts.json`에 동일한 14개 prompt가 추가된다.
- actor/FX strip prompt는 horizontal sprite sheet, frame count, frame size, fps, `animation.binding`을 명시한다.
- background prompt는 plot/facility/order/storage/research/expedition object baked-in 금지를 명시한다.
- JSON 검증이 통과한다.

## Verification Commands

- `npm run check:topology-asset-plan`
- `npm run check:asset-provenance`
- `npm run check:asset-style`

## Browser Use

계획/prompt-only WorkUnit이라 Browser Use evidence는 generation 이후 review 단계에서 요구한다.

## GitHub

- Issue: https://github.com/bborok1234/strange-seed-shop/issues/440

## Evidence

- `node scripts/update-topology-asset-plan.mjs` — pass, plan/prompt count 67/67
- `npm run check:topology-asset-plan` — pass
- `npm run check:asset-provenance` — pass
- `npm run check:asset-style` — pass
