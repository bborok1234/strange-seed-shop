# 0234 이상한 씨앗상회 전체 게임 바이블 리디자인

## Problem

기존 설계는 P0/P0.5, React playable rescue, Phaser Stage 1/2/3, 리부트 foundation 문서로 쪼개져 있다. 이 상태에서는 다음 에이전트가 다시 특정 화면, 밭 2개, 에셋 생성, UI 패널 같은 하위 문제로 좁혀서 작업할 위험이 크다.

사용자가 요구한 것은 부분 UI/Phaser foundation 설계가 아니라, `이상한 씨앗상회` 자체를 처음부터 끝까지 다시 설계하는 것이다. 따라서 컨셉만 유지하고 전체 게임 source-of-truth를 새로 만들어야 한다.

## Goal

`docs/GAME_BIBLE.md`를 새 active game source-of-truth로 만든다.

- 게임 정체성을 `살아있는 정원 상회`로 고정한다.
- v1 출시 + 30일 retention까지 설계한다.
- 온실 세계 확장을 엔드게임 방향으로 고정한다.
- 기존 P0/P0.5/Phaser Stage 문서는 하위 참고로 내린다.
- 다음 구현 issue가 `GAME_BIBLE.md`를 먼저 읽고 topology, asset, sprite, playable slice 순서로 진행하게 한다.

## Game Studio Route

- `game-studio:game-studio`: 전체 게임 설계 route 고정
- `game-studio:web-game-foundations`: world topology, simulation/render/input/save boundary
- `game-studio:game-ui-frontend`: HUD, screen contract, playfield protection
- `game-studio:phaser-2d-game`: Phaser 구현 하위 방향
- `game-studio:sprite-pipeline`: actor/FX asset pipeline
- `game-studio:game-playtest`: 이후 playable evidence 기준

## Preserved Concept

- 이상한 씨앗상회
- 이름 있는 식물 생명체 수집
- idle collection tycoon
- 정원/온실/상회/주문/연구/원정의 판타지
- 에이전트 네이티브 게임 스튜디오

## Discarded Active Assumptions

- 기존 React/CSS playable이 active game design이라는 가정
- 2개 밭 중심 Phaser Stage 계획
- 배경에 gameplay object가 baked-in 되는 정원
- 생명체가 도감 보상 또는 floating sprite로만 존재하는 구조
- UI/HUD polish가 게임 설계를 대신하는 방식
- asset generation이 world topology보다 먼저 오는 방식

## Plan

1. `docs/GAME_BIBLE.md`를 작성한다.
2. `docs/README.md`의 source hierarchy에서 `GAME_BIBLE.md`를 게임 설계 최상위 문서로 등록한다.
3. `AGENTS.md` Required Reading Order에 `GAME_BIBLE.md`를 추가한다.
4. `docs/phaser/README.md`에서 Phaser foundation이 `GAME_BIBLE.md`의 하위 구현 문서임을 명시한다.
5. `docs/ROADMAP.md`에 `Full game bible redesign` active row를 추가하고, 기존 `Phaser reboot foundation design`은 하위 foundation으로 정리한다.
6. Current Next Action을 `GAME_BIBLE.md` 승인/검증으로 갱신한다.
7. 운영 heartbeat/control room/dashboard를 새 item으로 갱신한다.
8. 문서/운영/CI 검증을 실행한다.

## Acceptance Criteria

- `docs/GAME_BIBLE.md`가 존재하고 active game source-of-truth임을 명시한다.
- 게임 정체성, player fantasy, core loop, first 5m/D1/D7/D30/D30+ progression이 정의된다.
- world/board topology와 온실 세계 확장 구조가 정의된다.
- seed family, creature role, facility, task queue, production bottleneck, order, research, expedition, offline, decoration이 정의된다.
- UI/HUD, art tone, motion/FX, asset production policy, 광고/수익화 금지선이 정의된다.
- `docs/README.md`, `docs/ROADMAP.md`, `docs/phaser/README.md`, `AGENTS.md`가 새 위계를 가리킨다.
- `npm run check:docs`, `npm run check:dashboard`, `npm run check:app-boundaries`, `npm run check:seed-ops-queue`, `npm run check:closed-workunit-mirrors`, `npm run check:ci`가 통과한다.

## Follow-up Issue Split

| Issue | 목적 | 선행 조건 |
| --- | --- | --- |
| `0235` | garden board topology scaffold | `GAME_BIBLE.md` green |
| `0236` | asset plan/prompt batch for topology | `0235` topology fixed |
| `0237` | sprite seed frames and normalization | `0236` accepted seed frames |
| `0238` | playable first 5m vertical slice | `0235-0237` assets/runtime ready |
| `0239` | D1 order/offline loop | first 5m slice accepted |

## Verification Commands

- `npm run check:docs`
- `npm run check:dashboard`
- `npm run check:app-boundaries`
- `npm run operator:control-room -- --output docs/OPERATOR_CONTROL_ROOM.md`
- `npm run check:seed-ops-queue`
- `npm run check:closed-workunit-mirrors`
- `npm run check:ci`

## Browser Use

이 작업은 문서-only 변경이므로 Browser Use evidence는 필수 아님. 이후 playable/visual 구현 issue부터 Browser Use `iab` 검증을 필수로 한다.

## Evidence

- Source spec: `docs/GAME_BIBLE.md`
- `npm run check:docs` — pass
- `npm run check:dashboard` — pass
- `npm run check:app-boundaries` — pass
- `npm run check:seed-ops-queue` — pass
- `npm run check:closed-workunit-mirrors` — pass
- `npm run check:ci` — pass
