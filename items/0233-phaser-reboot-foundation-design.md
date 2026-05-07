# 0233 Phaser 리부트 foundation 설계

## Problem

기존 Phaser Stage 1/2/3 계획은 기존 React/CSS visual rescue의 문제를 새 Phaser app으로 옮기는 수준에 머물 위험이 있다. 특히 `plot_left`/`plot_right`와 낮은 2개 밭 구도는 배경에 밭을 baked-in 하게 만들었고, 사용자가 지적한 것처럼 “이 게임은 밭 2개가 한계인가?”라는 근본적인 기획 결함으로 이어진다.

현재 문제는 asset 품질만이 아니라 foundation 설계 문제다. 확장 가능한 정원 운영 게임이 되려면 배경, 밭, 시설, actor, HUD, camera, asset generation 순서를 다시 정의해야 한다.

## Goal

`이상한 씨앗상회`의 초기 컨셉만 유지하고, 신규 Phaser game의 active source-of-truth를 리부트한다.

- 기존 `docs/phaser/VERTICAL_SLICE_SPEC.md` Stage 1/2/3 계획을 active 구현 기준에서 보류한다.
- 밭/시설이 배경에 baked-in 되는 것을 금지한다.
- plot/facility/actor/task/camera/HUD/asset pipeline을 data-driven foundation으로 정의한다.
- 다음 구현 issue가 바로 코딩하지 않고 topology scaffold -> asset batch -> sprite normalization -> playable slice 순서로 진행되게 한다.

## Game Studio Route

- `game-studio:game-studio`: 기존 기획 폐기와 리부트 route 고정
- `game-studio:web-game-foundations`: simulation/render/input/save/asset boundary
- `game-studio:game-ui-frontend`: HUD budget, playfield 보호, contextual action rail
- `game-studio:phaser-2d-game`: Phaser scene/camera/entity 방향
- `game-studio:sprite-pipeline`: actor strip clipping 방지와 normalization gate
- `game-studio:game-playtest`: 이후 구현 issue의 Browser Use evidence 기준

## Preserved Concept

- 이상한 씨앗상회
- 이름 있는 식물 생명체 수집
- idle collection tycoon
- 씨앗, 정원, 온실, 주문, 연구, 원정의 장기 실루엣
- 첫 5분 “얘 귀엽다. 하나만 더 키워볼까?”
- 에이전트 네이티브 게임 스튜디오 운영

## Discarded Active Assumptions

- 기존 React/CSS playable 화면 구조
- 2개 밭 고정 구도
- 배경에 gameplay object를 그려 넣는 방식
- actor를 도감/card/icon/floating sprite로 취급하는 방식
- 큰 하단 패널이 정원 장면을 가리는 방식
- asset generation이 topology보다 먼저 오는 방식

## Plan

1. `docs/phaser/REBOOT_FOUNDATION_SPEC.md`를 새 active reset source-of-truth로 작성한다.
2. `docs/phaser/README.md`에서 기존 `VERTICAL_SLICE_SPEC.md`를 보류하고 새 문서를 우선하도록 바꾼다.
3. `docs/phaser/VERTICAL_SLICE_SPEC.md` 상단에 superseded banner를 추가한다.
4. `docs/README.md`의 Phaser lane과 phase hierarchy를 새 문서 기준으로 갱신한다.
5. `docs/ROADMAP.md`에서 `Phaser greenfield vertical slice spec`과 `Phaser care stage foundation` 상태를 리부트 설계 기준으로 정리한다.
6. 문서 검증을 실행한다.

## Acceptance Criteria

- 새 active source-of-truth 문서가 기존 Stage 1/2/3보다 우선함이 명확하다.
- `plot_left`/`plot_right` 2개 밭 계획이 active 구현 기준이 아님이 명확하다.
- background에 plot/facility/order crate를 baked-in 하지 않는 금지선이 있다.
- expandable slot topology, actor task roles, camera modes, HUD budget, asset generation order가 문서화된다.
- 다음 issue split이 topology scaffold, asset batch, sprite normalization, playable slice 순서로 나뉜다.
- Game Studio route가 문서와 item에 남는다.
- `npm run check:docs`, `npm run check:app-boundaries`, `npm run check:dashboard`가 통과한다.

## Verification Commands

- `npm run check:docs`
- `npm run check:app-boundaries`
- `npm run check:dashboard`

## Risks

- 문서만 바꾸고 구현 issue가 다시 old stage spec을 읽으면 같은 실패가 반복된다. 따라서 README와 roadmap에서 old spec 보류를 같이 적는다.
- 설계를 너무 크게 잡으면 구현이 늦어진다. 첫 구현은 9-slot 전체가 아니라 3-slot board foundation으로 제한한다.
- asset을 바로 만들고 싶어도 topology가 먼저다. asset issue는 foundation scaffold 다음으로 분리한다.

## Evidence

- Source spec: `docs/phaser/REBOOT_FOUNDATION_SPEC.md`
- PR: pending
- Verification: pending

