# 초승달순 source planting loop

## 상태

- Status: planned
- Game Studio route: `game-studio:game-studio -> game-studio:web-game-foundations -> game-studio:game-ui-frontend -> game-studio:phaser-2d-game -> game-studio:game-playtest`
- GitHub issue: #498
- Branch: `codex/v1-lunar-source-planting-loop`
- 연결: Issue #496, PR #497, main CI `25535517659`

## 배경

#497에서 첫 원정 보상은 `초승달순 씨앗 source`, `seed_lunar_002`, `expedition_moon_fence_locked` route preview까지 이어졌다. 하지만 player verb는 아직 `초승달순 단서 보기`에서 멈춘다. `docs/GAME_PRODUCTION_SPEC.md`는 `seed_lunar_002`를 `first expedition return`에서 열리는 650잎/22분 달방울 seed로 정의하고, `docs/GAME_BIBLE.md`는 expedition reward가 rare seed/source와 새 family로 이어져야 한다고 정한다.

경쟁작 production gap은 discovery map/rare source가 “다음 노드 보기”에서 멈추면 collection desire가 끊긴다는 점이다. 이번 slice는 실제 경제값 650잎은 아직 요구하지 않고, 첫 원정 보상으로 받은 source seed를 `초승달순 심기` action과 playfield plot state까지 연결해 v1 vertical slice의 다음 재배 루프를 연다.

## Plan

1. `GardenState`에 원정 source seed inventory/planting state를 추가한다.
   - `lunarSourceSeedAvailable`
   - `lunarSourceSeedPlanted`
   - `lunarSourceSeedHarvested`는 이번 slice에서 아직 false 유지
2. `previewExpeditionSourceClue()` 후 `lunarSourceSeedAvailable === true`가 되도록 한다.
3. 빈 unlocked plot 선택 시 `초승달순 심기` action을 제공한다.
4. action은 selected plot에 `seed_lunar_002`를 심고 source seed inventory를 소비한다.
5. Phaser runtime이 기존 accepted `seed_lunar_002_icon`을 preload/render한다.
6. Plot playfield에는 `초승달순` source chip과 seed icon overlay를 표시한다.
7. HUD/action rail에는 `초승달순 source 준비`와 planting result를 표시한다.
8. `scripts/check-phaser-foundation.mjs`에 source seed planting telemetry/screenshot/assertion을 추가한다.

## 수용 기준

- source preview action 후 `lunarSourceSeedAvailable === true`가 된다.
- 빈 unlocked plot에서 `초승달순 심기` action이 보인다.
- action 후 plot state가 `seed_lunar_002` planted/growing 상태가 된다.
- action 후 `lunarSourceSeedAvailable === false`, `lunarSourceSeedPlanted === true`가 된다.
- HUD/action rail이 초승달순 source planting result를 표시한다.
- Playfield plot이 기존 accepted `seed_lunar_002_icon` 또는 source chip으로 일반 seed와 구분된다.
- `npm run check:phaser`가 source planting screenshot을 저장한다.
- `npm run check:ci`와 `git diff --check`가 통과한다.

## Department Scorecard

| 부서 | 판정 | 근거 |
| --- | --- | --- |
| 기획팀 | approve | player verb가 `source 보기`에서 `초승달순 심기`로 이어진다. |
| 리서치팀 | approve | 경쟁작 discovery/collection map은 rare source preview 뒤 즉시 next collection action을 제공한다. |
| 아트팀 | approve | 새 asset 생성 없이 accepted `seed_lunar_002_icon`을 Phaser playfield에 runtime binding하고 source chip 상태를 추가한다. |
| 개발팀 | approve | state/action/preload/render/checker만 변경하고 실제 22분 성장/수확은 후속 slice로 분리한다. |
| 검수팀 | approve | Browser Use tool 미노출 시 Playwright fallback으로 mobile 393 screenshot과 telemetry를 검증한다. |
| 마케팅팀 | approve | mock-only 내부 playable promise이며 외부 채널/실결제 없음. |
| 고객지원팀 | approve | 플레이어가 “원정 보상으로 새 씨앗을 심을 수 있다”를 action label로 이해한다. |

## Subagent/Team Routing

- Solo execute. 변경 범위가 `gameState`, Phaser scene, checker, evidence 문서로 좁고 독립 병렬 탐색 이득이 낮다.

## 검증 명령

- `npm run check:phaser`
- `npm run check:ci`
- `npm run check:control-room`
- `npm run check:ops-live`
- `npm run check:github-metadata`
- `git diff --check`

## 리스크

- `seed_lunar_002`의 실제 650잎 구매/22분 성장/수확 reward까지 구현하면 scope가 커진다. 이번 slice는 첫 source seed 1개 planting까지로 제한한다.
- `seed_lunar_002_icon`은 기존 manifest accepted asset이지만 Phaser topology asset list에 없으므로 preload/checker 누락이 생길 수 있다.
- plot overlay가 좁은 mobile viewport에서 label을 가릴 수 있으므로 screenshot에서 text overlap을 확인한다.
