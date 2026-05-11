## 요약

#515 이후 `밤유리 오로 발견`이 reveal marker/HUD에서 멈추지 않도록, accepted `creature_lunar_rare_001`을 정원 actor로 승격하고 다음 rare route affordance를 Phaser playable loop에 연결한다.

## 배경

- 이전 완료: Issue #514, PR #515, main CI `25549194431`
- 현재 gap: rare 발견은 보이지만 발견 이후 정원 actor, 다음 route, 다음 행동이 playfield에 남지 않는다.
- 경쟁작 production gap: idle/collection game은 rare 발견을 새 작업자/다음 지역/장기 목표로 전환한다. 카드 발견에서 멈추면 v1 progression payoff가 약하다.

## Game Studio route

`game-studio:game-studio -> game-studio:phaser-2d-game -> game-studio:game-ui-frontend -> game-studio:game-playtest`

## Plan

1. `GardenState`에 밤유리 오로 actor join/route handoff telemetry를 추가한다.
2. 밤유리 수확 성공 시 `actor_oro`를 정원 actor로 추가한다.
3. Phaser playfield/HUD/action rail에 `밤유리 오로 합류`와 `expedition_moon_fence_locked` 다음 route affordance를 표시한다.
4. checker에 actor ids, route telemetry, screenshot assertion을 추가한다.
5. Browser Use unavailable 시 blocker report와 Playwright fallback evidence를 남긴다.

## 수용 기준

- `actor_oro`가 `actorIds`에 추가된다.
- `nightGlassOroActorJoined=true`, `nightGlassOroRouteHandoffVisible=true`, `nextRareRoutePreviewId=expedition_moon_fence_locked` telemetry가 남는다.
- 화면에는 `creature_lunar_rare_001` 기반 오로 actor/playfield marker와 다음 route affordance가 보인다.
- `npm run check:phaser`, `npm run check:content`, `npm run check:asset-provenance`, `npm run check:asset-style`, `npm run check:ci`, `git diff --check`가 통과한다.

## 안전 범위

- Phaser local state/action/render/checker와 운영 evidence만 변경한다.
- runtime image generation/API/cache 호출 없음.
- 새 accepted manifest asset은 추가하지 않는다.

## 리스크

- dedicated `actor_oro_explorer_strip_v1` 또는 `fx_night_glass_harvest_reveal_strip_v1`가 필요할 수 있다. 이번 slice는 route handoff blocker를 먼저 닫고, 전용 sprite/FX는 다음 asset WorkUnit으로 분리한다.
