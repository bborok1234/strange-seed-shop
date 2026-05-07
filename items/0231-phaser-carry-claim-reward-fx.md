# 0231 Phaser 신규 정원 나르기와 수령 보상 FX

## Problem

정원이 살아 보이려면 캐릭터가 관리한 결과가 수확/상자/재화 수령으로 이어져야 한다. 기존 화면은 수치와 카드 receipt가 바뀌지만, actor가 무엇을 했고 보상이 어디서 어디로 이동했는지 장면 안에서 잘 읽히지 않는다.

## Goal

Stage 1/2 Phaser slice 위에 `carry`, `claim`, `celebrate` loop를 추가한다. 수확 또는 생산 수령 순간에 캐릭터가 보상을 나르고, 상자가 채워지고, 잎 reward FX가 HUD로 이동하는 장면을 만든다.

## Source Spec

- Master spec: `docs/PHASER_GREENFIELD_VERTICAL_SLICE_SPEC.md`
- Stage: `Stage 3: 나르기, 수령, 보상 FX`
- Depends on: `items/0229-phaser-care-stage-foundation.md`
- Recommended after: `items/0230-phaser-garden-view-mode.md`

## Game Studio Route

- `game-studio:phaser-2d-game`: actor state machine, tween/path, input
- `game-studio:sprite-pipeline`: carry/celebrate sprite strips와 reward FX strips
- `game-studio:game-ui-frontend`: HUD reward target와 playfield obstruction 방지
- `game-studio:game-playtest`: Browser Use 연속 캡처와 state-change findings

## Player Verb

- 수확하기
- 보상 수령하기
- 상자 채워지는 것 보기

## Production / Progression Role

정원 관리 결과가 보상과 다음 행동으로 이어진다는 idle loop payoff를 만든다.

## Screen Moment

밭이 ready 상태가 된 뒤 플레이어가 수확하거나 claim하면, actor가 보상을 crate 또는 resource HUD 방향으로 나르고, 수령 FX와 celebrate가 함께 나온다.

## Required Assets

| Asset id | Type | Frame | Size | Acceptance |
| --- | --- | --- | --- | --- |
| `sprite_pori_carry_strip_v1` | sprite strip | 6 | 96x96 each | 포리 보상 나르기 |
| `sprite_momo_carry_strip_v1` | sprite strip | 6 | 96x96 each | 모모 보상 나르기 |
| `sprite_pori_celebrate_strip_v1` | sprite strip | 6 | 96x96 each | 포리 수령 반응 |
| `sprite_momo_celebrate_strip_v1` | sprite strip | 6 | 96x96 each | 모모 수령 반응 |
| `prop_order_crate_empty_v1` | prop | static | 192x160 | 빈 상자 |
| `prop_order_crate_filled_v1` | prop | static | 192x160 | 채워진 상자 |
| `fx_leaf_reward_flyout_v1` | fx strip | 8 | 96x96 each | 잎 보상 flyout |
| `fx_harvest_pop_v1` | fx strip | 8 | 128x128 each | 수확 pop |

## Plan

1. actor state machine에 `carry`, `celebrate`, `return`을 추가한다.
2. `plot -> crate -> resource HUD` reward path를 world 좌표로 정의한다.
3. carry/celebrate sprite strips와 reward FX strips를 생성하고 manifest/provenance에 등록한다.
4. ready crop click 또는 QA trigger에서 harvest pop, carry, crate state, resource flyout을 순차 재생한다.
5. reduced-motion 또는 QA deterministic mode를 정의해 visual regression을 안정화한다.
6. Browser Use로 claim 전/중/후 상태를 캡처하고 findings를 남긴다.

## Acceptance Criteria

- 수확/claim 순간에 숫자만 바뀌지 않고 actor state, crate state, reward FX가 함께 변한다.
- 포리 또는 모모 최소 1명은 `carry` state를 수행한다.
- reward FX는 밭/actor 쪽에서 resource HUD 또는 crate 방향으로 이동한다.
- 상자는 empty/filled 상태가 명확히 구분된다.
- Browser Use evidence가 `reports/visual/issue-0231-phaser-carry-claim-reward-fx/`에 저장된다.
- stage scripts/build와 focused visual regression이 통과한다.

## Verification Commands

- 신규 app build script
- Browser Use `iab`: ready -> harvest/claim -> reward complete screenshot sequence
- 가능한 경우 focused visual regression: actor state attrs, crate state, reward FX visible bounds

## Risks

- 여러 FX를 한 번에 넣으면 화면이 산만해질 수 있다. Stage 3의 strong motion은 harvest/claim 순간으로 제한한다.
- 실제 path walking을 과하게 넣으면 asset 요구가 커진다. 우선은 짧은 carry path와 pose transition으로 제한한다.

## Stop / Blocker Boundaries

- 장기 주문 시스템, economy balancing, offline reward migration은 범위 밖이다.
- 기존 앱 production card 수령 UI 수정은 범위 밖이다.

## Evidence

- GitHub issue: https://github.com/bborok1234/strange-seed-shop/issues/432
- PR: pending
- Browser Use evidence: pending
