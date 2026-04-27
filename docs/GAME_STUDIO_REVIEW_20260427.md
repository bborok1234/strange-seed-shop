# Game Studio 구조 재검토

Status: draft
Updated: 2026-04-27
Scope: Phase 0 화면 구조, playfield, sprite pipeline

## 결론

Deep interview 결과, Phase 0의 최상위 재미 축은 **이름 있는 생명체 수집**이다. 성장 조작감과 경제/정원 확장은 첫 생명체를 얻고 다음 생명체를 원하게 만드는 보조 축이다.

현재 `이상한 씨앗상회`는 기능적으로는 첫 루프를 수행하지만, 화면 인상은 아직 브라우저 게임보다 React 대시보드에 가깝다. CSS 토큰과 HUD polish는 필요하지만, 게임 느낌의 핵심 문제를 해결하지 못한다.

Game Studio 기준에서 다음 단계는 `Phaser playfield + React DOM HUD` 구조를 **중앙 garden playfield 전환**으로 실행하는 것이다. 저장, 경제, 콘텐츠, analytics 계약은 유지하고 중앙 정원 playfield만 2D 게임 런타임으로 분리한다.

## 사용한 기준

- `game-studio`: 2D 브라우저 게임은 기본적으로 Phaser 경로를 우선 검토한다.
- `web-game-foundations`: simulation, renderer, UI, asset loading, input mapping을 분리한다.
- `sprite-pipeline`: 독립 프레임 생성이 아니라 승인된 기준 프레임에서 animation strip을 만들고 고정 frame/anchor로 정규화한다.
- `game-ui-frontend`: persistent HUD를 줄이고 playfield를 보호한다.

## 현재 문제가 CSS만으로 해결되지 않는 이유

### P0: 중앙 정원이 게임 오브젝트 공간으로 읽히지 않는다

밭은 버튼이고, 씨앗은 이미지가 들어간 리스트 행이며, 성장은 progress text다. 유저가 보는 것은 “온실에서 씨앗을 만진다”가 아니라 “카드/버튼 UI를 누른다”에 가깝다.

필요한 변화:

- 중앙 playfield를 scene으로 다룬다.
- plot, seed, sprout, ready creature, reward pop을 game object로 렌더링한다.
- 터치 입력은 DOM 버튼이 아니라 playfield action으로 매핑한다.

### P0: 성장 상태가 sprite state로 존재하지 않는다

현재 정적 에셋은 seed icon, creature card, background 중심이다. 게임 느낌에는 `seed -> sprout -> growing -> harvest-ready -> reward`의 상태 전이가 필요하다.

필요한 변화:

- 첫 씨앗 1종의 상태 sprite를 먼저 만든다.
- idle breathing, tap squash, harvest sparkle, reward number pop을 playfield 안에서 검증한다.
- sprite는 한 프레임씩 따로 생성하지 않고 strip 단위로 정규화한다.

### P1: React가 renderer와 HUD를 모두 맡고 있다

React는 저장 상태, 상단 재화, 하단 탭, 상점/도감/씨앗 목록에 적합하다. 하지만 playfield animation, object layering, 터치 피드백, 작은 FX까지 DOM으로 밀면 계속 dashboard UI처럼 보인다.

필요한 변화:

- React: app shell, save binding, HUD, secondary panels.
- Phaser: garden scene, plot objects, sprite animation, touch feedback.
- 공통 action boundary: `select_plot`, `plant_seed`, `tap_growth`, `harvest_plot`, `open_creature_detail`. `claim_album_reward`는 React DOM CTA가 맡는다.

### P1: 상점과 보조 패널이 첫 화면의 게임성을 압도한다

상점 mock과 status pill은 검증에는 유용하지만, 모바일 첫 인상에서는 게임 화면보다 개발 패널처럼 보인다. 보조 패널은 bottom sheet로 유지하되, 정원 tab 기본 화면에는 최소화해야 한다.

필요한 변화:

- 정원 tab은 playfield + HUD만 남긴다.
- missions/status/debug 정보는 dev/debug surface로 숨긴다.
- shop은 결제 흐름 없이 `관심 확인` mock만 유지한다.

## 권장 아키텍처

```text
React App
  ├─ Save/content/analytics ownership
  ├─ DOM HUD: currency, next action, bottom tabs
  ├─ DOM Panels: seeds, album, expedition, shop
  └─ GardenPlayfieldHost
       └─ Phaser GardenScene
            ├─ render plot snapshots
            ├─ play seed/sprout/ready animations
            ├─ emit input actions
            └─ never mutate save directly
```

## 불변 조건

- 저장 데이터 구조를 바꾸지 않는다.
- 콘텐츠 JSON schema를 바꾸지 않는다.
- analytics event 이름을 바꾸지 않는다.
- Phase 0 경제 숫자를 바꾸지 않는다.
- 실제 결제, login/account, external checkout, ads SDK를 추가하지 않는다.
- 런타임 이미지 생성을 추가하지 않는다.

## Milestone 3.6 Spike 범위

### 포함

- Phaser 또는 동등한 2D scene runtime 채택 여부를 작은 코드 spike로 검증.
- 중앙 garden playfield만 scene으로 분리.
- React DOM HUD와 Phaser scene 사이의 action/event boundary 정의.
- 첫 starter seed 1종에 대한 임시 sprite state 적용.
- 360x800 모바일에서 playfield, CTA, bottom tabs가 한 화면에 남는지 검증.
- Browser Use 또는 CDP로 before/after evidence 저장.

### 제외

- 전체 게임 리라이트.
- 모든 seed/creature sprite 완성.
- 새 경제, 새 저장 구조, 새 content schema.
- 실제 monetization.
- WebSocket, account, backend.

## 첫 Sprite Batch 제안

`sprite-pipeline` 기준으로 첫 batch는 “다양한 예쁜 이미지”보다 “게임 상태 전이 검증”을 목표로 한다.

| Asset | Purpose | Frames | Notes |
| --- | --- | ---: | --- |
| `seed_herb_001_idle_strip` | 말랑잎 씨앗 idle breathing | 4 | 기존 seed icon을 기준 프레임으로 사용 |
| `seed_herb_001_tap_strip` | tap squash/response | 4 | 한 번 누른 감각 검증 |
| `sprout_herb_001_grow_strip` | 성장 중 새싹 loop | 6 | seed icon에서 creature로 이어지는 중간 상태 |
| `creature_herb_common_ready_strip` | 수확 가능 pulse | 4 | 첫 수확 CTA를 playfield에서 읽히게 함 |
| `fx_harvest_sparkle_strip` | 수확 sparkle | 6 | 작은 보상감 검증 |
| `fx_leaf_reward_pop_strip` | 잎 보상 pop | 5 | 숫자 증가와 연결 |

## 기존 에셋 재사용 판단

재사용 가능:

- `background_greenhouse_day_001`: playfield 배경으로 계속 사용 가능.
- seed icon 6종: sprite source frame 후보.
- creature static 9종: album/card와 ready state 기준 이미지 후보.
- shop card images: 상점 mock 표면 유지.

다시 만들거나 보강 필요:

- plot tile states: empty, planted, growing, ready, locked.
- seed/sprout animation strip.
- harvest/reward FX.
- small HUD icons for currency and action state.

## Acceptance Criteria

- 첫 화면 3초 안에 “게임 장면”으로 읽힌다.
- 중앙 정원은 DOM 카드가 아니라 game object가 놓인 playfield로 보인다.
- 첫 seed의 성장/수확 상태가 sprite animation 또는 FX로 읽힌다.
- React DOM은 HUD와 보조 패널을 맡고, Phaser scene은 save를 직접 쓰지 않는다.
- 첫 세션 루프는 유지된다: starter seed -> plant -> tap growth -> harvest -> named creature ownership -> album reward -> second plot/next collection goal.
- 첫 harvest는 잎 보상보다 이름/role/hint가 있는 생명체 소유 사건으로 먼저 읽힌다.
- 360x800 garden viewport에서 core loop는 세로 스크롤 없이 조작 가능하다.
- Browser Use/CDP evidence가 `reports/visual/`에 저장된다.

## 다음 작업

`items/0016-phaser-playfield-runtime-spike.md`를 중앙 garden playfield 전환 item으로 실행한다. Phaser dependency 추가 시 bundle risk와 DOM fallback을 기록하고, 첫 sprite batch는 starter seed의 성장/수확/소유 피크에 집중한다. 이 작업 전에는 `items/0015-design-system-foundation.md`의 CSS polish를 완성하려고 더 밀지 않는다. 0015는 guardrail과 임시 HUD rescue로 남기고, 0016이 게임 느낌을 결정하는 구조 검증 역할을 맡는다.
