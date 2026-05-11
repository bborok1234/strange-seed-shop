# 월정 문 첫 원정 payoff

## 상태

- Status: plan
- Game Studio route: `game-studio:game-studio -> game-studio:phaser-2d-game -> game-studio:game-ui-frontend -> game-studio:game-playtest`
- GitHub issue: #528
- PR: TBD
- Branch: `codex/v1-moon-fence-first-expedition-payoff`
- 연결: Issue #526, PR #527, main CI `25648977133`

## 배경

#526은 `월정 문 열기`로 `expedition_moon_fence_unlocked` route state와 unlocked marker까지 열었다. 하지만 unlocked route는 아직 실제 player verb `월정 문 원정 보내기`, traveling/returned state, return crate, reward receipt, 다음 seed/source clue로 이어지지 않는다.

`docs/GAME_BIBLE.md`는 원정을 별도 dead tab이 아니라 research clue와 seed source를 연결하는 장기 meta loop로 정의한다. `docs/GAME_PRODUCTION_SPEC.md`의 `upgrade_expedition_01`도 재료 3, 단서 2 이후 first expedition route를 요구한다. 경쟁 idle collection game 기준으로 route open 직후에는 destination start, travel state, comeback crate, rare/source reward가 한 화면에서 읽혀야 한다.

이번 slice는 `expedition_moon_fence_unlocked` 상태에서 첫 월정 문 원정을 실제로 시작하고, 즉시 deterministic QA 경로에서 귀환 상자와 보상/다음 단서 surface까지 확인하게 만든다. 새 long-duration economy tuning이나 신규 accepted asset 제작은 후속 issue로 분리한다.

## Creative brief

- Player verb: `월정 문 원정 보내기`
- Production/progression role: opened route를 첫 destination run과 return reward로 전환한다.
- Screen moment: `월정 문 열림` marker 아래에 traveling/returned crate가 생기고, claim 후 다음 source/clue surface가 열린다.
- Asset/FX decision: 새 accepted manifest asset 없이 existing `facility_expedition_return_crate_v1`, `fx_expedition_return_reward_strip_v1`, night-glass/moonburst FX 계열을 재사용한다. 기존 asset 재사용만으로 끝내지 않고 route-specific state, HUD affordance, return crate visual state, reward motion telemetry, screenshot assertion을 추가한다.
- Rejected alternative: dedicated moon-fence door-open sprite/FX를 먼저 만든다. 이유: 이번 blocker는 route open 이후 gameplay payoff 부재이며, sprite polish는 reward loop가 고정된 다음 더 정확하게 계획할 수 있다.

## Plan

1. `GardenState`에 월정 문 첫 원정 상태와 보상 telemetry를 추가한다.
2. `moonFenceRouteUnlocked=true` 이후 action rail에 `월정 문 원정 보내기`를 노출한다.
3. action 처리 함수는 route id `expedition_moon_fence_unlocked`, actor `actor_oro`, traveling/returned/claimed state, return crate visual을 deterministic QA-friendly path로 전환한다.
4. 귀환 상자 claim 후 objective/receipt/HUD에 월정 문 보상과 다음 clue/source promise를 표시한다.
5. Phaser board/HUD는 `월정 문 원정 중`, `월정 문 귀환 상자`, `월정 문 보상 수령` 상태를 playfield와 action rail에서 읽히게 한다.
6. `scripts/check-phaser-foundation.mjs`는 #527 route unlock 이후 start/return/claim action, return crate visibility, reward telemetry, final objective/screenshot evidence를 assertion한다.
7. Browser Use hands-on QA를 우선 시도한다. 현재 tool surface에서 unavailable이면 current-session blocker report + Playwright fallback evidence를 유지한다.

## 수용 기준

- `월정 문 열림` 이후 action rail에 `월정 문 원정 보내기`가 노출된다.
- action 실행 후 route id는 `expedition_moon_fence_unlocked`이고 actor requirement는 `actor_oro`로 남는다.
- 화면에는 `월정 문 원정 중`, `월정 문 귀환 상자`, `월정 문 보상 수령` 중 현재 상태가 명확히 보인다.
- claim 후 objective 또는 receipt는 월정 문 보상과 다음 clue/source promise를 포함한다.
- return crate visual state와 reward motion telemetry가 checker에서 관찰된다.
- runtime image generation/API/cache 호출 없음.
- `npm run check:phaser`, `npm run check:content`, `npm run check:asset-provenance`, `npm run check:asset-style`, `npm run check:ci`, `git diff --check`가 통과한다.

## Game Studio Department Signoff

| 부서 | 필수 판단 | 산출물 |
| --- | --- | --- |
| 기획팀 | approve | opened route가 다음 player verb와 reward loop로 이어진다. |
| 리서치팀 | approve | 경쟁 idle route unlock은 start/travel/return/reward를 route-open 직후 보여준다. |
| 아트팀 | revise | dedicated moon-fence door-open sprite는 없지만 return crate/reward FX visual state를 먼저 고정한다. |
| 개발팀 | approve | state/action/render/checker slice로 좁고 신규 asset/economy 확장은 분리한다. |
| 검수팀 | approve | deterministic Phaser checker와 screenshot evidence로 path를 고정한다. |
| 마케팅팀 | approve | 내부 playable progression이며 외부 promise 없음. |
| 고객지원팀 | approve | route open 후 다음 행동과 보상 의미가 한눈에 보여야 한다. |

## Department Scorecard

| 부서 | 판정 | 근거 |
| --- | --- | --- |
| 기획팀 | approve | `월정 문 원정 보내기`가 열린 route의 즉시 동사다. |
| 리서치팀 | approve | route unlock 후 reward loop 부재가 현재 production gap이다. |
| 아트팀 | revise | 전용 문 열림 sprite는 후속 polish로 남긴다. |
| 개발팀 | approve | existing expedition route state pattern을 확장한다. |
| 검수팀 | approve | Browser Use blocker 시 Playwright screenshot fallback을 남긴다. |
| 마케팅팀 | approve | monetization/외부 채널 없음. |
| 고객지원팀 | approve | 다음 행동 혼란을 줄이는 surface가 핵심이다. |

## Role Debate

아트팀만 revise다. 전용 moon-fence sprite/FX를 먼저 만들면 감정 payoff가 좋아지지만, route-open state가 gameplay loop로 이어지지 않는 현재 blocker가 더 크다. 이번 slice는 return crate와 reward motion telemetry를 먼저 고정하고, 전용 sprite/FX는 claim reward가 고정된 뒤 asset WorkUnit으로 분리한다.

## Subagent/Team Routing

- 현재 slice는 state/action/render/checker가 같은 파일에 밀접하게 묶여 있어 solo execute가 더 안전하다.
- Browser Use tool surface 확인은 별도 `tool_search`로 수행하고, unavailable이면 blocker report를 남긴다.

## Self-Evaluation Loop

- Claim: opened moon-fence route can start, return, and claim its first expedition payoff.
- Smallest verifier: `npm run check:phaser`.
- Rubric: action visible, route id correct, return crate visible, claim reward objective/receipt present, final telemetry stable.
- Artifact path: `reports/visual/issue-0528-moon-fence-first-expedition-payoff/`.
- Iteration log: checker failure를 먼저 고치고, 제품 상태와 assertion이 같은 contract를 공유할 때 stop한다.
- Stop condition: local verification pass, PR checks pass, merge, main CI observation pass.

## QA / Playtest Plan

- Browser Use `iab` hands-on path: `npm run dev:phaser` -> 월정 문 unlock까지 진행 -> `월정 문 원정 보내기` -> return crate -> reward claim.
- Fallback path: `npm run check:phaser` screenshot and telemetry assertions.
- Visual evidence: before unlocked route, traveling/returned crate, claimed reward screenshots.

## 검증 명령

- `npm run check:phaser`
- `npm run check:content`
- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:ci`
- `git diff --check`
