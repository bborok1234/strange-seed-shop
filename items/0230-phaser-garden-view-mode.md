# 0230 Phaser 신규 정원 감상 모드와 HUD 접기

## Problem

정원은 씨앗을 키우고 꾸미고 감상하는 공간이어야 하지만, 기존 화면은 전체 배경을 보려 하면 성장/관리 장면이 작아지고, 성장/관리를 보려 하면 배경 감상이 불가능하다. 두 목적을 한 카메라에 억지로 넣으면서 어느 쪽도 만족하지 못한다.

## Goal

Stage 1 Phaser slice 위에 `감상 모드`를 추가한다. 기본 플레이는 낮은 관리 카메라로 유지하되, 플레이어가 원할 때 HUD를 접고 전체 정원과 장식 prop을 보는 pull-back view로 전환한다.

## Source Spec

- Master spec: `docs/PHASER_GREENFIELD_VERTICAL_SLICE_SPEC.md`
- Stage: `Stage 2: 감상 모드와 HUD 접기`
- Depends on: `items/0229-phaser-care-stage-foundation.md`

## Game Studio Route

- `game-studio:game-ui-frontend`: 낮은 HUD 밀도와 playfield 보호
- `game-studio:phaser-2d-game`: camera transition, scene layers
- `game-studio:sprite-pipeline`: overview/decor raster assets
- `game-studio:game-playtest`: Browser Use로 관리/감상 전환 검수

## Player Verb

- 감상 모드 열기
- 전체 정원 보기
- 관리 모드로 돌아가기

## Production / Progression Role

꾸미기와 소유감을 위한 foundation을 만든다. Stage 2는 생산 수치보다 정원 자체가 플레이어의 공간처럼 느껴지는지 검증한다.

## Screen Moment

관리 화면에서 `감상` 버튼을 누르면 하단 작업 HUD가 접히고, 정원 전체 배경과 장식 prop이 드러난다.

## Required Assets

| Asset id | Type | Frame | Size | Acceptance |
| --- | --- | --- | --- | --- |
| `bg_seed_garden_overview_v1` | background | static | 1179x2556 또는 768x1664 | pull-back view용 전체 정원 |
| `prop_decor_shelf_seed_jars_v1` | prop | static | 320x260 | 씨앗병 선반, 작은 크기 판독 가능 |
| `prop_decor_hanging_pot_v1` | prop | static | 192x192 | 행잉 화분 |
| `prop_decor_garden_lantern_v1` | prop | static | 160x220 | 감상용 장식 |
| `ui_mode_toggle_manage_view_v1` | ui raster | static | 192x96 | 관리/감상 전환 버튼 |

## Plan

1. Stage 1 scene에 camera mode state를 추가한다: `manage`, `overview`.
2. overview camera target, zoom, layer visibility, actor scale policy를 정의한다.
3. 감상 모드 전환 버튼을 DOM 또는 Phaser UI로 추가하되 playfield를 가리지 않는다.
4. 감상 모드에서 작업 HUD/receipt/action panel을 접고 edge resource chip만 남긴다.
5. overview background/decor assets를 생성하고 manifest/provenance에 연결한다.
6. Browser Use로 관리 모드 -> 감상 모드 -> 관리 모드 복귀를 캡처한다.

## Acceptance Criteria

- 감상 모드 진입 시 밭/작업대 중심 camera에서 전체 정원 overview camera로 전환된다.
- 감상 모드에서 하단 작업 패널은 접히고, 화면의 80% 이상이 정원 장면으로 읽힌다.
- resource/objective는 edge chip 수준으로만 남는다.
- 관리 모드로 돌아오면 Stage 1의 밭/작업대/actor framing이 복구된다.
- Browser Use screenshot이 `reports/visual/issue-0230-phaser-garden-view-mode/`에 저장된다.

## Verification Commands

- 신규 app build script
- Browser Use `iab`: manage/overview/return 3-state screenshot
- 가능한 경우 focused visual regression: mode toggle, HUD collapse, camera target bounds

## Risks

- overview가 단순 배경 감상으로 끝나면 게임 loop와 분리될 수 있다. 장식 prop은 future decoration foundation임을 명확히 한다.
- 감상 모드 HUD를 너무 많이 남기면 목적이 흐려진다.

## Stop / Blocker Boundaries

- 실제 꾸미기 편집/드래그 배치 시스템은 이번 범위 밖이다.
- 기존 앱 desktop layout 수정은 이번 범위 밖이다.

## Evidence

- GitHub issue: https://github.com/bborok1234/strange-seed-shop/issues/434
- PR: pending
- Browser Use evidence: pending
