# 밤유리 오로 actor route handoff

## 상태

- Status: review
- Game Studio route: `game-studio:game-studio -> game-studio:phaser-2d-game -> game-studio:game-ui-frontend -> game-studio:game-playtest`
- GitHub issue: #516
- PR: TBD
- Branch: `codex/v1-night-glass-oro-actor-route-handoff`
- 연결: Issue #514, PR #515, main CI `25549194431`

## 배경

#514는 `seed_rare_001`을 `돌보기 -> 밤유리 수확 -> 밤유리 오로 발견`으로 닫았다. 하지만 발견 직후 rare creature는 reveal marker와 HUD 문구에 머물고, 정원 playfield에서 함께 일하거나 다음 route를 여는 actor affordance가 없다.

`docs/GAME_PRODUCTION_SPEC.md`의 v1 launch slice는 첫 5분, D1 복귀, D7 실루엣, D30 목표 실루엣이 한 제품처럼 연결되어야 한다고 고정한다. 밤유리 rare route가 발견 카드에서 멈추면 경쟁 idle/collection 게임의 “희귀 발견 -> 새 작업자/다음 지역/다음 장기 목표” production gap에 닿는다.

이번 slice는 `밤유리 오로` 발견 후 accepted `creature_lunar_rare_001`을 정원 actor로 승격하고, `expedition_moon_fence_locked` 다음 route affordance를 HUD/playfield/checker에 고정한다.

## Plan

1. `GardenState`에 `nightGlassOroActorJoined`, `nightGlassOroRouteHandoffVisible`, `nextRareRoutePreviewId` telemetry를 추가한다.
2. `harvestSelectedPlot`의 밤유리 수확 성공 시 `actor_oro`를 explorer/support actor로 추가하고, target을 `facility_expedition_gate` 또는 다음 route preview로 지정한다.
3. Phaser playfield는 `creature_lunar_rare_001` actor marker를 정원에 남기고, 기존 night-glass FX는 actor join/reward pulse에 한 번 더 재생한다.
4. HUD/action rail은 `밤유리 오로 합류`와 `월정 문 preview` 또는 `expedition_moon_fence_locked` 다음 route affordance를 표시한다.
5. Sprite/FX decision: 신규 accepted manifest asset 없이 accepted `creature_lunar_rare_001` raster를 actor/playfield state로 승격한다. 기존 asset 재사용만으로 끝내지 않고 actor slot, path/target, HUD affordance, route preview telemetry를 함께 추가한다. Dedicated `fx_night_glass_harvest_reveal_strip_v1`은 #514 리스크로 남았지만, 이번 slice는 actor route handoff가 더 직접적인 v1 progression payoff다.
6. `scripts/check-phaser-foundation.mjs`는 #514 reveal 직후 actor ids, route handoff telemetry, screenshot evidence를 assertion한다.
7. Browser Use hands-on QA를 우선 시도한다. 현재 tool surface에서 unavailable이면 blocker report + Playwright fallback evidence를 유지한다.

## 수용 기준

- 밤유리 수확 후 `actor_oro`가 `actorIds`에 추가된다.
- 화면에는 accepted `creature_lunar_rare_001` 기반 오로 actor/playfield marker가 남는다.
- HUD/action rail에는 `밤유리 오로 합류`와 다음 route affordance가 보인다.
- telemetry는 `nightGlassOroActorJoined=true`, `nightGlassOroRouteHandoffVisible=true`, `nextRareRoutePreviewId=expedition_moon_fence_locked`를 남긴다.
- final objective는 `밤유리 오로 합류` 또는 `월정 문 preview`를 포함해 rare reveal 이후 다음 행동을 설명한다.
- runtime image generation/API/cache 호출 없음.
- `npm run check:phaser`, `npm run check:content`, `npm run check:asset-provenance`, `npm run check:asset-style`, `npm run check:ci`, `git diff --check`가 통과한다.

## Department Scorecard

| 부서 | 판정 | 근거 |
| --- | --- | --- |
| 기획팀 | approve | rare 발견 다음 player verb를 actor 합류와 다음 route preview로 연결한다. |
| 리서치팀 | approve | 경쟁 idle/collection game은 rare 발견을 새 작업자/지역 목표로 전환한다. reveal card에서 멈추는 gap을 줄인다. |
| 아트팀 | revise | dedicated 새 actor sprite strip이 가장 좋지만, accepted rare creature raster를 playfield actor로 먼저 승격하고 sprite/FX debt를 후속 asset WorkUnit으로 분리한다. |
| 개발팀 | approve | Phaser local state/action/render/checker 범위이며 save/economy long timer는 건드리지 않는다. |
| 검수팀 | approve | Browser Use 우선, unavailable 시 blocker + Playwright screenshot/telemetry로 actor/route handoff를 검증한다. |
| 마케팅팀 | approve | 내부 playable progression only; 외부 채널/실결제/광고 없음. |
| 고객지원팀 | approve | 플레이어가 밤유리 오로 발견 후 다음 목표가 어디인지 이해할 수 있다. |

## Role Debate

아트팀만 revise다. dedicated `actor_oro_explorer_strip_v1` 또는 `fx_night_glass_harvest_reveal_strip_v1`을 새로 만드는 대안은 production polish 관점에서 맞지만, #515 직후 가장 큰 blocker는 rare 발견이 다음 gameplay route로 이어지지 않는 점이다. 이번 slice는 accepted raster를 actor/playfield state와 HUD affordance로 승격하고, 전용 sprite/FX 제작은 다음 asset-specific WorkUnit 후보로 남긴다.

## Subagent/Team Routing

- Solo execute. 변경 범위가 #514 위의 Phaser state/render/checker handoff로 좁고, 별도 research/asset generation 병렬화보다 빠른 단일 slice다.

## 검증 명령

- `npm run check:phaser`
- `npm run check:content`
- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:ci`
- `git diff --check`

## 구현 결과

- `GardenState`에 `nightGlassOroActorJoined`, `nightGlassOroRouteHandoffVisible`, `nextRareRoutePreviewId`를 추가했다.
- 밤유리 수확 성공 시 `actor_oro`가 `creature_lunar_rare_001` 기반 explorer actor로 합류하고 `expedition_moon_fence_locked` preview가 고정된다.
- Phaser playfield는 오로 actor marker와 night-glass FX aura를 표시한다.
- HUD/action rail은 `밤유리 오로 합류 · creature_lunar_rare_001 · expedition_moon_fence_locked`와 `월정 문 단서` surface를 표시한다.
- `scripts/check-phaser-foundation.mjs`는 #515 reveal 이후 actor ids, route handoff telemetry, screenshot evidence를 assertion한다.

## 검증 결과

- `npm run build:phaser`: 통과
- `npm run check:phaser`: 통과
- `npm run check:content`: 통과
- `npm run check:asset-provenance`: 통과
- `npm run check:asset-style`: 통과
- `npm run check:ci`: 통과
- `git diff --check`: 통과
- Actor handoff evidence: `reports/visual/issue-0516-night-glass-oro-actor-route-handoff/phaser-check-night-glass-oro-handoff-393.png`
- Visual report: `reports/visual/issue-0516-night-glass-oro-actor-route-handoff/visual-report-20260511.md`
- Browser Use blocker: `reports/visual/issue-0516-night-glass-oro-actor-route-handoff/browser-use-blocker-20260511.md`

## 리스크

- accepted still creature raster를 actor로 쓰면 idle animation richness가 부족할 수 있다. 후속 WorkUnit에서 `actor_oro_explorer_strip_v1` plan-prompt-generate-review를 열어야 할 수 있다.
- #514의 dedicated reveal FX debt와 이번 actor sprite debt가 겹치면 다음 asset batch로 묶는 편이 낫다.
