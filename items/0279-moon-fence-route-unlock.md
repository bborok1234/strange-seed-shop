# 월정 문 route unlock

## 상태

- Status: plan
- Game Studio route: `game-studio:game-studio -> game-studio:phaser-2d-game -> game-studio:game-ui-frontend -> game-studio:game-playtest`
- GitHub issue: #526
- PR: TBD
- Branch: `codex/v1-moon-fence-route-unlock`
- 연결: Issue #524, PR #525, main CI `25648527223`

## 배경

#524는 `달빛 단서 포장`으로 월정 문 요구 조건을 `달빛 단서 2/2 ready`, `재료 3/3 ready`, `오로 explorer`까지 준비했다. 하지만 실제 `월정 문 열기` action과 unlocked route state가 없어 readiness가 다음 gameplay route로 이어지지 않는다.

`docs/GAME_PRODUCTION_SPEC.md`의 `upgrade_expedition_01`은 `재료 3`, `단서 2`가 first expedition route로 이어져야 한다고 본다. 경쟁 idle/collection game은 requirement ready 이후 locked marker를 unlock marker, route card, first destination preview로 즉시 바꾼다.

이번 slice는 `달빛 단서 2/2 ready + 재료 3/3 ready + actor_oro` 상태에서 `월정 문 열기` action을 추가하고, `expedition_moon_fence_unlocked` route preview와 unlocked gate marker를 HUD/playfield/telemetry/checker에 고정한다. 실제 긴 원정 출발/보상은 후속 slice로 분리한다.

## Creative brief

- Player verb: `월정 문 열기`
- Production/progression role: requirements-ready state를 unlocked route preview로 전환한다.
- Screen moment: locked `월정 문 잠김` marker가 `월정 문 열림`과 route card `expedition_moon_fence_unlocked`로 바뀐다.
- Asset/FX decision: 새 accepted manifest asset 없이 existing expedition gate/night-glass/moonburst FX와 compact unlocked chip을 사용한다. 기존 asset 재사용만으로 끝내지 않고 player verb, unlocked route telemetry, HUD affordance, playfield state, screenshot assertion을 추가한다.
- Rejected alternative: 첫 월정 문 원정 출발/귀환까지 포함한다. 이유: route unlock과 expedition runtime/reward는 QA path와 economy acceptance가 다르다.

## Plan

1. `GardenState`에 `moonFenceUnlockAvailable`, `moonFenceRouteUnlocked`, `moonFenceUnlockedRouteId`, `moonFenceUnlockedMarkerVisible` telemetry를 추가한다.
2. `moonFenceMaterialsReady=true`, `moonFenceCluesReady=true`, `moonFenceRequiredExplorerId=actor_oro`이면 action rail에 `월정 문 열기`를 노출한다.
3. action 처리 함수는 locked preview를 unlocked route state로 전환하고 objective/receipt를 `월정 문 열림 · expedition_moon_fence_unlocked`로 갱신한다.
4. Phaser expedition gate 주변 marker를 `월정 문 열림`으로 바꾸고 HUD surface에 first route preview를 표시한다.
5. `scripts/check-phaser-foundation.mjs`는 #524 second clue 이후 unlock action click, unlocked route telemetry, screenshot evidence를 assertion한다.
6. Browser Use hands-on QA를 우선 시도한다. 현재 tool surface에서 unavailable이면 current-session blocker report + Playwright fallback evidence를 유지한다.

## 수용 기준

- `달빛 단서 포장` 이후 action rail에 `월정 문 열기`가 노출된다.
- action 실행 후 telemetry는 `moonFenceRouteUnlocked=true`, `moonFenceUnlockedMarkerVisible=true`, `moonFenceUnlockedRouteId=expedition_moon_fence_unlocked`를 남긴다.
- 화면에는 `월정 문 열림`, `달빛 단서 2/2 ready`, `재료 3/3 ready`, `오로 explorer`가 함께 보인다.
- objective 또는 receipt는 `월정 문 열림`을 포함한다.
- runtime image generation/API/cache 호출 없음.
- `npm run check:phaser`, `npm run check:content`, `npm run check:asset-provenance`, `npm run check:asset-style`, `npm run check:ci`, `git diff --check`가 통과한다.

## Department Scorecard

| 부서 | 판정 | 근거 |
| --- | --- | --- |
| 기획팀 | approve | requirements-ready 상태를 실제 unlock verb와 route preview로 닫는다. |
| 리서치팀 | approve | locked marker -> unlocked route card 전환은 idle route unlock의 핵심 pattern이다. |
| 아트팀 | revise | dedicated moon-fence door open sprite가 이상적이지만 runtime contract를 먼저 고정한다. |
| 개발팀 | approve | state/action/render/checker slice로 좁고 expedition 출발/보상은 분리한다. |
| 검수팀 | approve | deterministic Phaser checker에 click path와 screenshot evidence를 추가한다. |
| 마케팅팀 | approve | 내부 playable progression이며 외부 promise 없음. |
| 고객지원팀 | approve | 플레이어가 요구 조건 완료 후 route가 열렸음을 즉시 이해할 수 있어야 한다. |

## Role Debate

아트팀만 revise다. 전용 open-door asset을 먼저 만들면 polish가 높지만, 현재 blocker는 ready state가 route unlock으로 전환되지 않는 점이다. 이번 slice는 unlocked route state와 telemetry를 먼저 고정하고 dedicated door-open FX는 후속 asset issue로 분리한다.

## 검증 명령

- `npm run check:phaser`
- `npm run check:content`
- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:ci`
- `git diff --check`
