# 밤유리 오로 월정 문 route action

## 상태

- Status: plan
- Game Studio route: `game-studio:game-studio -> game-studio:phaser-2d-game -> game-studio:game-ui-frontend -> game-studio:game-playtest`
- GitHub issue: #518
- PR: TBD
- Branch: `codex/v1-night-glass-oro-moon-fence-route-action`
- 연결: Issue #516, PR #517, main CI `25646641343`

## 배경

#516은 `밤유리 수확 -> 밤유리 오로 발견 -> actor_oro 합류 -> expedition_moon_fence_locked preview`까지 닫았다. 하지만 다음 route는 아직 HUD/action rail의 preview 문구에 가깝고, 플레이어가 오로에게 다음 길을 묻거나 월정 문 단서를 확인하는 직접 행동은 없다.

`docs/GAME_PRODUCTION_SPEC.md`의 v1 stop line은 player verb, system result, screen moment, asset/FX, playtest evidence가 모두 있어야 prototype이 아니라 production slice라고 본다. 지금 상태는 actor handoff까지는 좋지만, 다음 D7/D30 실루엣을 “눌러서 확인하는 route action”으로 바꾸지 않으면 rare 발견 이후 다음 행동이 약하다.

이번 slice는 `밤유리 오로 합류` 직후 `월정 문 단서 보기` action을 추가해, `expedition_moon_fence_locked`가 locked preview board state와 objective/receipt/telemetry에 남도록 만든다.

## Plan

1. `GardenState`에 `moonFenceRoutePreviewVisible`, `moonFenceRouteInspected`, `nightGlassOroRouteActionAvailable` telemetry를 추가한다.
2. `nightGlassOroRouteHandoffVisible=true`이고 route action이 아직 처리되지 않았을 때 action rail에 `월정 문 단서 보기`를 노출한다.
3. action 처리 함수는 `moonFenceRoutePreviewVisible=true`, `moonFenceRouteInspected=true`, `nightGlassOroRouteActionAvailable=false`, objective/receipt를 `월정 문 단서 확인`으로 전환한다.
4. Phaser playfield는 expedition gate 주변에 locked route preview marker를 더 명확히 남기고, HUD/action rail은 `월정 문 단서 확인됨 · 다음 expedition route locked`를 표시한다.
5. Asset/FX decision: 새 accepted manifest asset 없이 기존 `facility_expedition_gate_v1`, `creature_lunar_rare_001`, `fx_night_glass_source_unlock_strip_v1`을 route action feedback에 재사용한다. 기존 asset 재사용만으로 끝내지 않고 player verb, route board state, telemetry, screenshot assertion을 추가한다.
6. `scripts/check-phaser-foundation.mjs`는 #516 actor handoff 후 route action click, route telemetry, screenshot evidence를 assertion한다.
7. Browser Use hands-on QA를 우선 시도한다. 현재 tool surface에서 unavailable이면 blocker report + Playwright fallback evidence를 유지한다.

## 수용 기준

- 밤유리 오로 합류 후 action rail에 `월정 문 단서 보기`가 노출된다.
- action 실행 후 telemetry는 `moonFenceRoutePreviewVisible=true`, `moonFenceRouteInspected=true`, `nightGlassOroRouteActionAvailable=false`를 남긴다.
- 화면에는 `expedition_moon_fence_locked` locked route preview와 `밤유리 오로` handoff 맥락이 함께 보인다.
- HUD/action rail 또는 objective는 `월정 문 단서 확인`과 다음 expedition route locked 상태를 설명한다.
- runtime image generation/API/cache 호출 없음.
- `npm run check:phaser`, `npm run check:content`, `npm run check:asset-provenance`, `npm run check:asset-style`, `npm run check:ci`, `git diff --check`가 통과한다.

## Department Scorecard

| 부서 | 판정 | 근거 |
| --- | --- | --- |
| 기획팀 | approve | rare 발견 다음 player verb를 `월정 문 단서 보기`로 고정해 D7/D30 route 실루엣을 직접 행동으로 만든다. |
| 리서치팀 | approve | 경쟁 idle/collection game은 rare 발견 이후 새 지역/다음 탐사 단서를 눌러 확인하게 만든다. 텍스트 preview에서 멈추는 gap을 줄인다. |
| 아트팀 | revise | 전용 moon fence route marker가 가장 좋지만, 이번 slice는 existing expedition gate/night-glass FX로 route action state를 먼저 닫고 dedicated route asset은 후속 후보로 남긴다. |
| 개발팀 | approve | Phaser local state/action/render/checker 범위이며 save migration이나 economy curve는 건드리지 않는다. |
| 검수팀 | approve | Browser Use 우선, unavailable 시 blocker + Playwright click/screenshot/telemetry로 route action을 검증한다. |
| 마케팅팀 | approve | 내부 playable progression only; 외부 채널/실결제/광고 없음. |
| 고객지원팀 | approve | 플레이어가 오로 합류 뒤 다음에 눌러야 할 목표와 잠긴 route의 의미를 이해할 수 있다. |

## Role Debate

아트팀만 revise다. dedicated `facility_moon_fence_locked_v1` 또는 route marker FX를 먼저 만들면 화면 신선도는 좋아지지만, 현재 blocker는 오로 handoff가 다음 player verb로 이어지지 않는 점이다. 이번 slice는 route action과 telemetry를 먼저 고정하고, 전용 route marker asset은 다음 asset/FX WorkUnit으로 분리한다.

## Subagent/Team Routing

- Solo execute. 변경 범위가 #516 위의 Phaser action/state/render/checker로 좁고, 별도 asset generation 병렬화보다 빠른 단일 slice다.

## 검증 명령

- `npm run check:phaser`
- `npm run check:content`
- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:ci`
- `git diff --check`

## 리스크

- locked route marker가 existing expedition gate art에 묻히면 dedicated `facility_moon_fence_locked_v1` asset WorkUnit이 필요하다.
- action rail에 장기 progression surface가 누적되어 HUD density가 높아질 수 있다.
