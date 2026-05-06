# 0218 - Idle core production spec

Status: done
Date: 2026-05-06
Game Studio route: `game-studio:game-studio` -> `game-studio:web-game-foundations` -> `game-studio:game-playtest`

## Context

직전 작업에서 UI/HUD와 정원 아트 production spec은 정리되었다. 하지만 사용자 피드백의 핵심에는 “화면은 있는데 게임 core가 정적이고, 경쟁작처럼 오래 가는 구조가 부족하다”는 문제가 남아 있다. Egg, Inc. 같은 인기 idle game은 단순 클릭 이상의 생산 엔진, 병목, 자동화, 복귀, prestige/long meta 구조를 갖고 있으므로 별도 core gameplay spec이 필요하다.

## Plan

1. Egg, Inc., Idle Miner Tycoon, AdVenture Capitalist, Cookie Clicker, Cell to Singularity, Realm Grinder, Idle Slayer의 공식/스토어/Steam 표면을 확인한다.
2. 각 경쟁작의 core loop, 장기 유지 이유, 가져올 점, 가져오지 않을 점을 분리한다.
3. `이상한 씨앗상회`의 primary verbs, first 10 minutes target, progression layers, bottleneck model, offline return, future prestige slot을 문서화한다.
4. 다음 gameplay WorkUnit이 사용할 acceptance template과 P0.6 추천 slice를 정의한다.
5. 새 문서를 docs index, design hierarchy, roadmap에 연결한다.

## Acceptance Criteria

- `docs/IDLE_CORE_PRODUCTION_SPEC.md`가 경쟁작 core teardown과 프로젝트 적용 기준을 포함한다.
- 문서가 UI/HUD spec과 다른 역할을 가진다: 화면 기준이 아니라 gameplay loop, economy bottleneck, progression 기준이다.
- 새 core gameplay issue template이 `player verb`, `core loop layer`, `resource/bottleneck`, `actor/prop/FX`, `first 10m impact`를 요구한다.
- `docs/README.md`, `docs/DESIGN.md`, `docs/ROADMAP.md`에 새 문서가 연결된다.
- `npm run check:docs`, `npm run check:p0-ui-ux`, `npm run check:ci`가 통과한다.

## Evidence

- Added: `docs/IDLE_CORE_PRODUCTION_SPEC.md`
- Updated: `docs/README.md`
- Updated: `docs/DESIGN.md`
- Updated: `docs/ROADMAP.md`

## Risk

이 작업은 core gameplay 기준 문서화다. 수치 튜닝과 코드 구현은 별도 WorkUnit으로 진행해야 하며, 첫 후보는 `Bottleneck-readable production graph` 또는 `Offline return as garden state`다.

