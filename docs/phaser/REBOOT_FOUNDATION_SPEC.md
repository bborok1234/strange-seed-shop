# Phaser 리부트 foundation 설계

Status: active reset source-of-truth
Updated: 2026-05-07
Owner: Studio
Game Studio route: `game-studio:game-studio` -> `game-studio:web-game-foundations` -> `game-studio:game-ui-frontend` -> `game-studio:phaser-2d-game` -> `game-studio:sprite-pipeline` -> `game-studio:game-playtest`

## 결정

기존 `docs/phaser/VERTICAL_SLICE_SPEC.md`의 Stage 1/2/3 계획은 보류한다. 그 문서는 `plot_left`, `plot_right`, 낮은 관리 카메라, 2개 밭 중심 구도에서 출발했고, 결과적으로 배경에 밭이 박히거나 fixed two-plot scene으로 회귀할 위험이 크다.

새 리부트는 `이상한 씨앗상회`의 초기 컨셉만 유지한다.

유지한다:

- 이상한 씨앗에서 이름 있는 식물 생명체가 태어난다.
- 플레이어는 작은 씨앗상회/정원을 키우는 browser-first idle collection tycoon을 플레이한다.
- 생명체는 도감 보상이 아니라 정원 일을 수행하는 actor다.
- 첫 5분 안에 귀여움, 수집 욕구, 다음 성장 목표가 보여야 한다.
- 에이전트 네이티브 스튜디오가 설계, asset, 구현, QA, PR evidence를 반복한다.

폐기한다:

- 기존 React/CSS playable의 화면 구조를 active gameplay spec으로 쓰는 방식
- `plot_left`/`plot_right` 2개 밭을 기본 세계 구조로 보는 방식
- 밭, 작업대, 주문상자 같은 gameplay object가 배경 그림에 baked-in 되는 방식
- 한 화면짜리 393x852 포스터 구도에 gameplay를 억지로 끼워 넣는 방식
- actor를 카드, 도감, DOM sprite, floating sticker처럼 배치하는 방식
- 에셋을 먼저 만들고 나중에 게임 구조에 끼워 맞추는 방식

## 리부트 목표

새 Phaser 게임의 첫 vertical slice는 “예쁜 정원 배경 위에 UI를 얹은 화면”이 아니라 “확장 가능한 작은 정원 운영 게임”이어야 한다.

첫 성공 화면은 아래 질문에 답해야 한다.

1. 여기는 내가 확장하고 꾸밀 수 있는 정원인가?
2. 씨앗을 심을 장소가 data-driven entity로 보이는가?
3. 생명체가 정원 일을 하고 있는가?
4. 다음 성장 목표가 숫자와 화면 변화로 연결되는가?
5. UI가 게임 장면을 보조하고, 장면을 가리지 않는가?

## 핵심 설계 원칙

### 1. 배경은 세계의 바닥이지 gameplay object가 아니다

배경 이미지는 분위기, 공간감, 빛, 깊이를 담당한다. 아래 요소는 배경에 그리면 안 된다.

- 밭/화단/planter
- 작업대의 활성 상태
- 주문상자
- storage crate
- seed shelf unlock state
- research desk active state
- expedition gate active state
- 수확 가능 glow, reward, resource pile

이 요소들은 모두 Phaser runtime entity로 배치한다. 배경에 밭이 있으면 밭 수가 배경 이미지에 묶이고, 게임은 확장형 idle tycoon이 아니라 2개 밭짜리 일러스트가 된다.

### 2. 월드 토폴로지가 asset보다 먼저다

asset 생성은 아래 순서를 통과하기 전 시작하지 않는다.

1. world zones
2. build slot topology
3. facility taxonomy
4. actor roles and task paths
5. camera modes
6. HUD budget
7. asset ids and frame specs

`gpt-image-2`나 Codex native image generation은 이 구조를 채우는 raster production 단계다. 구조가 없으면 더 좋은 그림을 만들어도 다시 UI comp가 된다.

### 3. 플레이 가능한 첫 화면은 확장 가능성을 보여야 한다

첫 vertical slice에서 모든 기능을 구현하지 않아도, 스크린샷은 확장 가능한 게임으로 읽혀야 한다.

- 시작 시 최소 3개 build slot을 보여준다.
- 최소 2개는 unlocked, 1개는 locked preview다.
- Phase 0 target은 9개 plot/facility slot까지 확장 가능한 topology다.
- slot unlock은 배경 교체가 아니라 entity reveal, cleared patch, construction state, camera pan으로 표현한다.
- 장기적으로 12개 이상 slot도 layout data만 늘려 테스트할 수 있어야 한다.

### 4. 생명체는 job을 가진 actor다

생명체는 화면을 떠다니는 장식이 아니다. 생명체는 task queue를 가진다.

필수 actor role:

| Role | 하는 일 | 첫 slice 필요 여부 |
| --- | --- | --- |
| `caretaker` | 밭 살피기, 물주기, 벌레 보기, 성장 보조 | yes |
| `carrier` | 수확물/재료를 crate나 storage로 나르기 | yes, 최소 1개 상태 |
| `order_helper` | 주문상자 채우기, 납품 준비 | preview |
| `researcher` | seed clue/research desk 작업 | later |
| `explorer` | 원정 gate 출발/복귀 | later |

actor motion은 `task path`로 표현한다. sprite strip은 pose animation만 담당한다.

금지:

- 고정 사각형 안에서 좌우로만 왕복하는 motion
- 배경 병/선반 위에 떠 있는 캐릭터
- frame cell이 잘린 sprite를 확대해 사용하는 방식
- 카드 portrait를 world actor로 재사용하는 방식

### 5. UI는 장면을 지휘하지 않고 장면을 읽게 한다

Phaser canvas가 world와 motion을 담당하고, DOM HUD는 텍스트와 menu를 담당한다.

첫 화면 persistent HUD budget:

- top resource cluster: 2-3개 resource
- objective chip: 1개
- bottom action rail: 현재 선택한 entity의 1-2개 action
- menu tabs: 기본 화면에서 펼치지 않음

금지:

- 하단 절반을 항상 덮는 큰 패널
- 중앙 playfield를 가리는 진행 설명 카드
- desktop에서 좌우 dashboard rail을 열어 정원 장면을 희생하는 구조
- resource 비용에 재화 아이콘/현재 보유량/결과가 없는 버튼

## 게임 판 구조

### 월드 레이어

Phaser scene은 아래 레이어를 순서대로 갖는다.

| Layer | 내용 | Runtime ownership |
| --- | --- | --- |
| `terrain` | 정원 바닥, 온실 벽, 빛, 배경 식물 | static background, no gameplay object |
| `ground_detail` | 돌, 잡초, 장식 가능한 빈 자리 표시 | optional prop |
| `build_slots` | plot/facility가 놓이는 anchor data | simulation data + debug render |
| `plots` | 씨앗 심기/성장/수확 entity | simulation entity + Phaser container |
| `facilities` | 작업대, storage, order crate, research desk | simulation entity + Phaser container |
| `actors` | 생명체와 shadow | simulation actor + Phaser container |
| `fx` | reward, care, harvest, dust, leaf flyout | Phaser effect |
| `hud` | resource, objective, contextual action | DOM overlay |

### 좌표계

- world unit은 393x852 mobile 기준이 아니라 logical garden board 기준이다.
- mobile viewport는 camera가 board 일부를 보여주는 window다.
- desktop viewport도 같은 mobile game frame 또는 expanded debug frame을 사용하되, gameplay balance는 mobile-first다.
- 모든 slot은 `id`, `kind`, `x`, `y`, `depth`, `scale`, `unlockState`, `allowedEntityKinds`를 가진다.

예시 topology:

| Slot id | Kind | 초기 상태 | 용도 |
| --- | --- | --- | --- |
| `plot_01` | plot | unlocked | 첫 씨앗 |
| `plot_02` | plot | unlocked | 두 번째 씨앗 또는 companion task |
| `plot_03` | plot | locked_preview | 첫 확장 목표 |
| `facility_workbench` | facility | unlocked | care/craft task anchor |
| `facility_order_crate` | facility | preview | 첫 납품 목표 |
| `facility_storage` | facility | locked_preview | 보관 병목 |
| `decor_north_shelf` | decor | static | 감상/소유감 |

## Camera model

### `manage` camera

기본 플레이 카메라다.

- focus: 현재 선택된 plot/facility와 주변 actor
- persistent HUD가 적고 하단 action만 남는다.
- 카메라가 slot을 따라 살짝 pan/zoom할 수 있다.
- 성장/수확/나르기 순간에 짧은 focus motion을 허용한다.

### `overview` camera

정원 감상/꾸미기 카메라다.

- UI를 접고 전체 board를 보여준다.
- locked slot preview와 장식 placement를 읽게 한다.
- screenshot/share mode foundation 역할을 한다.
- gameplay action은 제한하고 선택/감상/관리 복귀만 허용한다.

### `focus` camera

수확, 새 생명체 reveal, 큰 upgrade 순간에만 사용한다.

- actor와 대상 entity를 크게 보여준다.
- reward FX와 DOM modal이 동시에 화면을 덮지 않는다.
- 끝나면 `manage`로 복귀한다.

## Core loop v1

```text
씨앗 선택
-> 빈 plot 선택
-> 심기
-> caretaker가 care task 수행
-> tap/care/idle timer로 성장
-> 수확
-> plant-creature reveal
-> creature가 actor roster에 들어감
-> actor를 plot/facility task에 배정
-> leaves/material/order progress 생산
-> 보관/주문/plot 확장 중 하나를 선택
-> 새 slot 또는 새 seed family preview
-> offline return
```

첫 slice는 전체 루프를 모두 구현하지 않는다. 그러나 첫 slice는 아래 세 가지를 반드시 증명한다.

1. plot은 배경 그림이 아니라 runtime entity다.
2. actor는 world에서 일을 한다.
3. unlock은 다음 slot/facility가 열리는 화면 변화로 이어진다.

## 첫 vertical slice: `garden board foundation`

기존 Stage 1을 대체하는 새 첫 작업이다.

### Player verbs

- 빈 자리 선택
- 씨앗 심기
- 밭 돌보기
- 수확하기
- 생명체 배정하기
- 세 번째 slot 해금 preview 보기

### Required runtime

- Phaser + TypeScript + Vite app
- simulation state는 Phaser scene 밖에 둔다.
- slot topology JSON 또는 TypeScript data
- entity system: plot, facility, actor, task
- DOM HUD: resources, objective, contextual actions
- debug overlay: slot bounds, actor path, camera mode toggle

### Required assets

Asset은 확정 topology 이후 생성한다. 모든 asset은 raster PNG이며 manifest key를 가진다.

| Asset id | Type | Frame | Size target | 조건 |
| --- | --- | --- | --- | --- |
| `bg_garden_terrain_open_v1` | background | static | 768x1664 or 1179x2556 | 밭/작업대/상자 없음. 빈 정원 바닥과 온실 깊이만 있음 |
| `tile_plot_empty_v1` | plot prop | static | 256x192 | 런타임 slot에 놓이는 빈 밭 |
| `tile_plot_sprout_v1` | plot prop | static | 256x192 | 싹 상태 |
| `tile_plot_growing_v1` | plot prop | static | 256x192 | 성장 중 |
| `tile_plot_ready_v1` | plot prop | static | 256x192 | 수확 가능 |
| `tile_plot_locked_preview_v1` | plot prop | static | 256x192 | 해금 전 자리, 배경과 구분 |
| `facility_workbench_v1` | facility prop | static | 320x220 | runtime facility |
| `facility_order_crate_empty_v1` | facility prop | static | 192x160 | 주문상자 빈 상태 |
| `facility_order_crate_filled_v1` | facility prop | static | 192x160 | 주문상자 채움 상태 |
| `actor_pori_caretaker_strip_v1` | sprite strip | 6 frames | 128x128 each | bottom-center anchor, no clipping |
| `actor_momo_carrier_strip_v1` | sprite strip | 6 frames | 128x128 each | bottom-center anchor, no clipping |
| `fx_care_spark_strip_v1` | fx strip | 6 frames | 96x96 each | 밭 돌보기 feedback |
| `fx_harvest_leaf_flyout_strip_v1` | fx strip | 8 frames | 96x96 each | resource feedback |
| `ui_shadow_soft_v1` | utility | static | 128x64 | actor/entity 접지 |

### Asset acceptance gates

- background에는 gameplay object가 없어야 한다.
- actor strip은 contact sheet에서 frame cell clipping이 없어야 한다.
- actor는 64px, 96px, 128px runtime scale에서 얼굴/역할이 읽혀야 한다.
- plot states는 grayscale thumbnail에서도 empty/sprout/growing/ready가 구분돼야 한다.
- manifest에는 `animation.binding`, frame count, frame size, anchor, intended fps가 있어야 한다.
- Browser Use playtest 전 contact sheet와 in-engine screenshot을 둘 다 남긴다.

## Simulation boundary

저장 가능한 state는 renderer object를 포함하지 않는다.

| Module | 책임 |
| --- | --- |
| `GardenState` | resources, slots, entities, actors, unlocks |
| `GrowthSystem` | seed growth timers, tap/care acceleration |
| `TaskSystem` | actor assignment, path target, task progress |
| `ProductionSystem` | leaves/material/order progress tick |
| `UnlockSystem` | plot/facility unlock condition |
| `SaveSystem` | serializable state only |

Phaser scene은 state를 읽고 sprite/container/tween/particle로 보여준다. gameplay rule은 scene `update()`에 직접 박지 않는다.

## Input action map

| Action | Mobile | Desktop | Result |
| --- | --- | --- | --- |
| `select_entity` | tap | click | plot/facility/actor 선택 |
| `confirm_action` | CTA tap | click/Enter | 심기/돌보기/수확/배정 |
| `cancel_or_back` | back chip | Esc | 선택 해제/모드 복귀 |
| `toggle_overview` | view chip | Space or button | manage/overview 전환 |
| `debug_toggle` | query flag only | key D in debug | slot/path overlay |

## HUD spec

Persistent HUD:

- `잎`, `꽃가루`, `관리력` 또는 active resource 2-3개
- current objective 1개
- selected entity action rail 1개
- overview toggle 1개

Contextual action rail examples:

- 빈 plot 선택: `말랑잎 씨앗 심기`, 비용/보유량 표시
- growing plot 선택: `돌보기`, 성장률/남은 시간 표시
- ready plot 선택: `수확`, reward preview 표시
- locked slot 선택: `해금 조건`, 필요한 resource와 현재 보유량 표시
- actor 선택: `작업 배정`, 현재 task와 다음 target 표시

비용 버튼은 반드시 재화명, 비용, 현재 보유량, 클릭 결과를 같은 시선에 보여준다.

## Fail conditions

아래 중 하나라도 보이면 리부트 첫 slice는 실패다.

- 배경에 밭이 그려져 있어 plot 수가 art에 묶인다.
- actor가 정원 일을 하는 것이 아니라 스티커처럼 떠 있다.
- actor가 고정 사각형 안에서 clipping되거나 좌우 왕복한다.
- UI panel이 playfield를 덮어 정원 확장/성장 상태를 볼 수 없다.
- 첫 화면에서 다음 행동을 못 찾는다.
- 비용 버튼에 재화명/현재 보유량/결과가 없다.
- screenshot이 게임 장면이 아니라 앱 대시보드로 읽힌다.
- asset을 많이 만들었지만 runtime entity/state 변화가 없다.

## Issue split

리부트는 아래 순서로 issue를 쪼갠다.

| Issue | 목적 | Specialist route |
| --- | --- | --- |
| `0233` | 리부트 foundation spec과 기존 Stage plan 보류 | `game-studio`, `web-game-foundations`, `game-ui-frontend` |
| `0234` | Phaser board topology scaffold: slot/entity/task/camera data만 구현 | `web-game-foundations`, `phaser-2d-game` |
| `0235` | gpt-image-2 asset batch: blank terrain, modular plots, facilities, actor seed frames | `sprite-pipeline`, project asset skills |
| `0236` | sprite normalization: caretaker/carrier strips, contact sheet, clipping gate | `sprite-pipeline` |
| `0237` | playable garden board foundation: plant/care/harvest/assign/unlock third slot | `phaser-2d-game`, `game-ui-frontend`, `game-playtest` |
| `0238` | overview mode and decoration preview | `game-ui-frontend`, `phaser-2d-game`, `game-playtest` |

`0234`는 placeholder art를 사용할 수 있지만 final art로 주장하지 않는다. `0235` 이후부터 production asset을 붙인다.

## Verification plan

문서 단계:

- `npm run check:docs`
- `npm run check:app-boundaries`
- `npm run check:dashboard`

구현 단계:

- `npm run build:phaser`
- `npm run check:phaser`
- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:sprite-batch`
- Browser Use `iab` 393x852 first screen
- Browser Use `iab` overview mode screenshot
- Browser Use `iab` actor task sequence observation

Browser Use evidence 없이는 visual/gameplay 완료를 주장하지 않는다.

