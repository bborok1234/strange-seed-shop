# 0229 Phaser 신규 정원 관리 카메라와 actor loop

## Problem

기존 정원 화면은 React/CSS overlay가 누적되어 생명체가 정원 actor가 아니라 배경 위 sticker처럼 보인다. 특히 support worker는 작은 DOM anchor 안에서 sprite-strip frame advance와 bob motion이 겹쳐, 플레이어에게 `가상의 사각형 안에서 우좌 왕복`하는 것처럼 보인다.

## Goal

기존 앱 visual rewrite를 멈추고, 신규 Phaser-first vertical slice의 Stage 1을 만든다. 낮은 관리 카메라에서 밭/작업대/생명체 발밑이 주인공으로 보이고, 포리와 모모가 각자 밭을 살피고 돌보는 장면을 구현한다.

## Source Spec

- Master spec: `docs/PHASER_GREENFIELD_VERTICAL_SLICE_SPEC.md`
- Stage: `Stage 1: 낮은 관리 카메라와 돌보기 actor loop`

## Game Studio Route

- `game-studio:game-studio`: greenfield browser-game slice 방향 고정
- `game-studio:web-game-foundations`: 신규 app boundary, save/data/runtime 분리
- `game-studio:phaser-2d-game`: Phaser scene, camera, actor, input
- `game-studio:sprite-pipeline`: care actor strips와 FX strip
- `game-studio:game-playtest`: Browser Use `iab` visual/game-feel 검수

## Player Verb

- 밭 살펴보기
- 밭 돌보기
- 성장 상태 확인

## Production / Progression Role

정원 관리가 첫 5분 core loop의 중심이라는 것을 화면으로 증명한다. 생명체는 도감 보상이 아니라 밭 성장과 생산을 돌보는 actor다.

## Screen Moment

첫 playable 진입 3초 안에 낮은 카메라의 밭 2개, 작업대, 포리/모모의 관리 행동이 보여야 한다.

## Required Assets

| Asset id | Type | Frame | Size | Acceptance |
| --- | --- | --- | --- | --- |
| `bg_seed_garden_manage_v1` | background | static | 1179x2556 또는 768x1664 | 낮은 카메라에서 밭/작업대 중심, 배경 전체 벽지 금지 |
| `prop_seedbed_empty_v1` | prop | static | 256x192 | 빈 밭으로 64px 이상에서 형태 구분 |
| `prop_seedbed_sprout_v1` | prop | static | 256x192 | 싹 상태가 empty와 구분 |
| `prop_seedbed_growing_v1` | prop | static | 256x192 | 성장 중 상태가 sprout/ready와 구분 |
| `prop_seedbed_ready_v1` | prop | static | 256x192 | 수확 가능 glow/rim이 명확 |
| `prop_workbench_care_v1` | prop | static | 320x220 | 관리 도구가 놓인 작업대 |
| `sprite_pori_care_strip_v1` | sprite strip | 6 | 96x96 each | inspect/care pose, alpha background |
| `sprite_momo_care_strip_v1` | sprite strip | 6 | 96x96 each | inspect/care pose, alpha background |
| `fx_care_leaf_spark_v1` | fx strip | 6 | 96x96 each | 돌보기 feedback |
| `ui_contact_shadow_soft_v1` | utility | static | 128x64 | actor 발밑 접지 |

## Plan

1. `apps/seed-garden-phaser/` 신규 Vite + Phaser TypeScript app을 만든다.
2. Stage 1 asset plan/prompt/provenance를 작성하고 gpt-image-2 또는 Codex native image generation으로 필요한 raster PNG를 생성한다.
3. 신규 slice 전용 manifest 또는 기존 manifest extension에 asset metadata와 animation binding을 등록한다.
4. Phaser scene에 관리 모드 camera, zone map, crop state, actor system을 만든다.
5. 포리/모모 actor에 `idle`, `inspect`, `care` state와 contact shadow를 연결한다.
6. 밭 클릭/탭 또는 scripted demo loop로 crop state가 변하고 care FX가 재생되게 한다.
7. Browser Use `iab`로 393x852 실제 화면을 캡처한다.
8. 기존 앱과 달리 고정 사각형 왕복이 없다는 visual finding을 남긴다.

## Acceptance Criteria

- `apps/seed-garden-phaser/`가 독립적으로 빌드되고 로컬 dev/preview에서 실행된다.
- 393x852 화면에서 밭/작업대가 하단 중심부 주인공으로 보인다.
- 포리와 모모는 각각 `plot_left`, `plot_right` 또는 `workbench` zone에 접지되어 있다.
- actor의 sprite frame advance가 이동으로 오해되지 않는다. actor 이동은 world position/path로만 표현된다.
- crop state는 `empty`, `sprout`, `growing`, `ready` 중 최소 3개가 시각적으로 구분된다.
- Browser Use `iab` screenshot과 findings가 `reports/visual/issue-0229-phaser-care-stage-foundation/`에 저장된다.
- `npm run build` 또는 신규 app build script가 통과한다.

## Verification Commands

- `npm run build`
- 신규 app script가 생기면 `npm run phaser:build`
- 신규 app script가 생기면 `npm run phaser:preview`
- Browser Use `iab`: `http://127.0.0.1:<port>/` 393x852 screenshot

## Risks

- gpt-image-2 asset이 정확한 strip으로 나오지 않을 수 있다. accepted 등록 전 normalization/provenance를 먼저 통과시킨다.
- 새 app scaffold가 repo scripts와 충돌할 수 있다. 기존 app build를 깨지 않는 script namespace를 사용한다.
- Stage 1이 기존 앱보다 시각적으로 낫지 않으면 Stage 2로 넘어가지 않는다.

## Stop / Blocker Boundaries

- 실제 결제/로그인/외부 배포는 범위 밖이다.
- 기존 React 정원 화면의 대규모 rewrite는 이 issue 범위 밖이다.

## Evidence

- GitHub issue: https://github.com/bborok1234/strange-seed-shop/issues/433
- PR: pending
- Browser Use evidence: pending
