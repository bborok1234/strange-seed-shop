# Phaser 신규 정원 vertical slice 제작 규격

> Superseded on 2026-05-07: 이 문서는 historical Stage 1/2/3 계획이다. `plot_left`/`plot_right`와 고정 2개 밭 구도에서 출발해 확장형 정원 설계와 충돌하므로, 새 구현 기준으로 사용하지 않는다. Active source-of-truth는 `docs/phaser/REBOOT_FOUNDATION_SPEC.md`다.

Status: superseded
Updated: 2026-05-07
Owner: Studio
Scope: 기존 React/CSS 누적 화면을 더 고치지 않고, Phaser-first 신규 vertical slice로 `이상한 씨앗상회`와 에이전트 네이티브 스튜디오를 동시에 검증한다.
Game Studio route: `game-studio:game-studio` -> `game-studio:web-game-foundations` -> `game-studio:phaser-2d-game` -> `game-studio:sprite-pipeline` -> `game-studio:game-playtest`

## 결정

현재 앱은 `legacy playable/reference`로 둔다. 즉시 삭제하지 않지만, 큰 visual rewrite의 대상도 아니다. 신규 게임 품질 검증은 별도 Phaser-first vertical slice에서 한다.

추천 위치:

- `apps/seed-garden-phaser/`
- Vite + TypeScript + Phaser
- DOM은 최소 HUD와 접근성 버튼만 담당
- Phaser가 scene, camera, actor, crop, FX, input을 소유

이 결정의 목적은 기존 화면의 CSS/DOM 누적 구조를 더 보수하지 않고, Studio가 실제로 새 게임 장면을 기획, asset 생성, 구현, Browser Use 검수, PR/CI까지 닫을 수 있는지 검증하는 것이다.

## Product Goal

첫 playable 5분 안에 아래 감정을 만든다.

```text
밭이 자라고 있다.
생명체들이 정원을 관리하고 있다.
보상을 수확하면 정원이 반응한다.
전체 정원도 감상하고 꾸미고 싶다.
```

성공 스크린샷은 앱 UI comp가 아니라 `작은 정원 게임 장면`으로 읽혀야 한다.

## Non-goals

- 기존 React 앱의 전체 migration
- 기존 save/economy/content의 완전 이전
- 실제 결제, 로그인, 광고 SDK, 외부 배포
- 런타임 이미지 생성
- 장기 원정/연구/라이브옵스 구현
- 기존 CSS overlay 구조 위에 새 sprite만 추가하는 방식

## Legacy Freeze Rule

신규 Phaser slice가 만들어지는 동안 기존 앱은 아래 변경만 허용한다.

- 새 slice로 가져갈 data/content/asset 계약을 읽기 위한 문서화
- 빌드/테스트 깨짐 복구
- Studio 운영 문서/issue/PR evidence 갱신

기존 정원 화면의 큰 visual rewrite는 금지한다. 같은 문제를 새 Phaser slice에서 해결한다.

## Camera Contract

### 관리 모드

기본 카메라다. 밭, 작업대, 생명체 발밑이 주인공이다.

- 대상 화면: 393x852 mobile frame
- framing: 하단 55-65%에 밭/작업대/action area
- 주요 관심: crop growth, actor care motion, reward feedback
- HUD: resource 2-3개, 목표 1개, 감상 모드 버튼 1개
- 금지: 하단 절반을 영구 패널로 덮기, 배경 전체를 벽지처럼 보여주기

### 감상 모드

정원 꾸미기와 전체 배경 감상을 위한 pull-back camera다.

- framing: 정원 전체와 장식 prop이 보이는 overview
- HUD: 접힘. resource/objective는 작은 edge chip만 허용
- 입력: `관리로 돌아가기`, 선택 prop focus, screenshot-safe 상태
- 목적: 성장/꾸미기/소유감을 보여주는 future decoration foundation

## Actor System Contract

생명체는 DOM decoration이 아니라 Phaser actor다.

### Actor fields

| Field | Required | 설명 |
| --- | --- | --- |
| `id` | yes | creature id |
| `displayName` | yes | 화면/디버그 이름 |
| `homeZone` | yes | 기본 대기 zone |
| `targetZone` | yes | 현재 행동 대상 zone |
| `state` | yes | `idle`, `inspect`, `care`, `carry`, `celebrate`, `return` |
| `facing` | yes | `left`, `right`, `front` |
| `scale` | yes | zone 원근에 따른 scale |
| `shadow` | yes | contact shadow sprite 또는 ellipse |
| `animationAssetId` | yes | manifest-bound sprite/strip id |
| `role` | yes | `caretaker`, `carrier`, `order_helper` |

### Motion rules

- sprite strip의 horizontal frame advance는 pose animation 전용이다.
- actor movement는 actor container의 world position tween/path가 담당한다.
- `작은 고정 사각형 안에서 좌우 왕복`처럼 보이는 generic relay motion은 실패다.
- 모든 actor는 발밑 contact shadow를 가져야 한다.
- actor는 반드시 garden zone에 소속되어야 하며, 배경 선반/병 위에 떠 있으면 실패다.

## Zone Contract

초기 slice는 아래 zone만 사용한다.

| Zone | 관리 모드 위치 | 목적 | Actor state |
| --- | --- | --- | --- |
| `plot_left` | 하단 좌측 전경 | 첫 밭 | `inspect`, `care`, `harvest-ready` |
| `plot_right` | 하단 우측 전경 | 두 번째 밭 | `inspect`, `care`, `harvest-ready` |
| `workbench` | 중앙 후면 낮은 높이 | 관리 도구/재료 | `idle`, `return`, `carry target` |
| `crate` | 작업대 옆 | 보상/주문 상자 | `carry`, `claim target` |
| `overview_anchor` | 감상 모드 중심 | 전체 정원 camera target | none |

## Stage Plan

### Stage 1: 낮은 관리 카메라와 돌보기 actor loop

Goal: 기존 화면의 `가상 사각형 왕복 캐릭터`를 폐기하고, 새 Phaser scene에서 생명체 2명이 밭을 실제로 관리하는 장면을 만든다.

필수 player verbs:

- 밭 살펴보기
- 밭 돌보기
- 성장 상태 확인

필수 assets:

| Asset id | Type | Frame | Size | Use |
| --- | --- | --- | --- | --- |
| `bg_seed_garden_manage_v1` | background | static | 1179x2556 또는 768x1664 | 낮은 관리 카메라용 정원 배경 |
| `prop_seedbed_empty_v1` | prop | static | 256x192 | 빈 밭 |
| `prop_seedbed_sprout_v1` | prop | static | 256x192 | 싹 상태 |
| `prop_seedbed_growing_v1` | prop | static | 256x192 | 성장 중 |
| `prop_seedbed_ready_v1` | prop | static | 256x192 | 수확 가능 |
| `prop_workbench_care_v1` | prop | static | 320x220 | 도구/관리 작업대 |
| `sprite_pori_care_strip_v1` | sprite strip | 6 frames | 96x96 each | 포리 inspect/care |
| `sprite_momo_care_strip_v1` | sprite strip | 6 frames | 96x96 each | 모모 inspect/care |
| `fx_care_leaf_spark_v1` | fx strip | 6 frames | 96x96 each | 돌보기 feedback |
| `ui_contact_shadow_soft_v1` | utility | static | 128x64 | actor 접지 shadow |

Acceptance:

- Browser Use 393x852 screenshot에서 밭과 작업대가 화면 중심이다.
- 포리/모모가 각자 밭 앞에 접지되어 보인다.
- actor movement가 고정 사각형 안 왕복처럼 보이지 않는다.
- 성장 단계가 최소 3단계로 시각적으로 구분된다.
- 기존 앱과 비교해 시각적으로 별도 greenfield scene임이 분명하다.

### Stage 2: 감상 모드와 HUD 접기

Goal: 정원 전체를 감상할 수 있는 pull-back camera를 구현한다. 꾸미기/소유감의 기반을 만든다.

필수 player verbs:

- 감상 모드 열기
- 관리 모드로 돌아가기
- 전체 정원 보기

필수 assets:

| Asset id | Type | Frame | Size | Use |
| --- | --- | --- | --- | --- |
| `bg_seed_garden_overview_v1` | background | static | 1179x2556 또는 768x1664 | 전체 정원 overview |
| `prop_decor_shelf_seed_jars_v1` | prop | static | 320x260 | 씨앗병 선반 |
| `prop_decor_hanging_pot_v1` | prop | static | 192x192 | 행잉 화분 |
| `prop_decor_garden_lantern_v1` | prop | static | 160x220 | 감상용 장식 |
| `ui_mode_toggle_manage_view_v1` | ui raster | static | 192x96 | 관리/감상 전환 버튼 |

Acceptance:

- 감상 모드에서 하단 작업 패널이 접힌다.
- 전체 배경과 장식 prop이 가려지지 않는다.
- 관리 모드로 돌아오면 밭/작업대 중심 카메라가 복구된다.
- 감상 모드에서도 resource/objective는 edge chip 수준으로만 남는다.

### Stage 3: 나르기, 수령, 보상 FX

Goal: 캐릭터가 정원을 관리한 결과를 플레이어가 수령하는 순간까지 연결한다.

필수 player verbs:

- 수확하기
- 보상 수령하기
- 상자 채워지는 것 보기

필수 assets:

| Asset id | Type | Frame | Size | Use |
| --- | --- | --- | --- | --- |
| `sprite_pori_carry_strip_v1` | sprite strip | 6 frames | 96x96 each | 포리 보상 나르기 |
| `sprite_momo_carry_strip_v1` | sprite strip | 6 frames | 96x96 each | 모모 보상 나르기 |
| `sprite_pori_celebrate_strip_v1` | sprite strip | 6 frames | 96x96 each | 포리 수령 반응 |
| `sprite_momo_celebrate_strip_v1` | sprite strip | 6 frames | 96x96 each | 모모 수령 반응 |
| `prop_order_crate_empty_v1` | prop | static | 192x160 | 빈 상자 |
| `prop_order_crate_filled_v1` | prop | static | 192x160 | 채워진 상자 |
| `fx_leaf_reward_flyout_v1` | fx strip | 8 frames | 96x96 each | 잎 보상 flyout |
| `fx_harvest_pop_v1` | fx strip | 8 frames | 128x128 each | 수확 pop |

Acceptance:

- 수확 또는 claim 때 보상이 밭/actor에서 crate/resource HUD로 이동한다.
- 포리/모모 중 최소 1명은 carry 또는 celebrate state를 수행한다.
- reward number만 바뀌는 것이 아니라 FX와 actor state가 함께 변한다.
- Browser Use 연속 캡처 또는 짧은 evidence note로 상태 변화가 확인된다.

## Studio Execution Rules

각 stage issue는 아래를 반드시 가진다.

- Game Studio route
- player verb
- production/progression role
- screen moment
- exact asset ids
- generation path: `gpt-image-2` 기본, Codex native image generation fallback
- manifest/provenance expectation
- Browser Use `iab` evidence plan
- focused regression commands

## Go / No-go

Stage 1 완료 뒤 아래 중 하나라도 실패하면 기존 앱 migration 또는 Stage 2 진행을 보류한다.

- 새 Phaser scene이 기존 앱보다 시각적으로 명확히 낫지 않다.
- actor가 여전히 sticker/overlay처럼 보인다.
- 밭 성장 상태가 한눈에 안 보인다.
- Browser Use screenshot 기준으로 게임 장면이 아니라 UI comp처럼 읽힌다.

Stage 1이 통과하면 Stage 2/3을 이어가고, 이후 기존 앱에서 필요한 save/economy/content만 새 slice로 이식할지 판단한다.
