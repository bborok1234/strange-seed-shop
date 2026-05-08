# 밤유리 source acquisition route bridge

## 상태

- Status: review
- Game Studio route: `game-studio:game-studio -> game-studio:phaser-2d-game -> game-studio:game-ui-frontend -> game-studio:game-playtest`
- GitHub issue: #510
- PR: #511
- Branch: `codex/v1-night-glass-source-acquisition-route`
- 연결: Issue #508, PR #509, main CI `25546054078`

## 배경

#508은 `밤유리 source 보기` 순간을 dedicated `seed_rare_001_icon`과 `fx_night_glass_source_unlock_strip_v1`로 바꿨다. 하지만 현재 playable은 여기서 `expedition_night_glass 잠김` promise에 멈춘다. `docs/GAME_BIBLE.md`와 `docs/GAME_PRODUCTION_SPEC.md`는 rare seed source가 상점이 아니라 research/expedition gameplay에서 와야 한다고 고정한다.

경쟁작 production gap은 rare route가 locked preview만 있고 조사/귀환/획득 verb가 없으면 장기 목표가 실제 progression이 아니라 teaser 카드로 읽힌다는 점이다. 이번 slice는 `밤유리 source preview` 후 `밤유리 온실 조사`를 보내고, 짧은 귀환 상태와 source 획득 reward motion을 통해 `seed_rare_001` source가 실제 획득 가능한 다음 목표가 되게 만든다.

## Plan

1. `GardenState`에 night glass acquisition route 상태를 추가한다: 준비, 조사 중, 귀환, source 획득, source seed available.
2. `밤유리 source preview` 이후 원정 문 action rail에 `밤유리 조사 보내기`, `밤유리 귀환 상자 열기`, 필요 시 `밤유리 씨앗 source 받기` player verb를 연결한다.
3. playfield에는 원정 문 주변에 `seed_rare_001_icon` 기반 source acquired marker와 기존 `fx_night_glass_source_unlock_strip_v1` reward motion을 새 action binding `night_glass_source.action.acquire_source`로 재사용한다.
4. HUD/action surface는 `expedition_night_glass`가 단순 잠김에서 `조사 중 -> 귀환 -> seed_rare_001 source 획득`으로 변하는 progression state를 보여준다.
5. `scripts/check-phaser-foundation.mjs`에 night glass route start/return/acquire screenshot, telemetry, rail text, receipt assertion을 추가하고 evidence를 `reports/visual/issue-0510-night-glass-source-acquisition-route/`에 저장한다.
6. Browser Use hands-on QA를 우선 시도한다. 현재 tool discovery에서 Browser Use `iab` callable이 노출되지 않으면 blocker report를 남기고 Playwright fallback screenshot으로 검증한다.

## 수용 기준

- `밤유리 source 보기` 후 action rail에 route start player verb가 보인다.
- route start 후 `expedition_night_glass`가 조사 중 상태와 원정 문 playfield marker로 보인다.
- 귀환/claim 후 `seed_rare_001` source 획득 receipt, HUD surface, telemetry가 남는다.
- source 획득 순간에는 `seed_rare_001_icon`과 `fx_night_glass_source_unlock_strip_v1` 기반 reward motion이 보이고, runtime image generation/API/cache는 호출하지 않는다.
- `npm run check:phaser`, `npm run check:content`, `npm run check:asset-provenance`, `npm run check:asset-style`, `npm run check:ci`, `git diff --check`가 통과한다.
- Browser Use가 unavailable이면 blocker report와 Playwright fallback visual evidence가 남는다.

## Department Scorecard

| 부서 | 판정 | 근거 |
| --- | --- | --- |
| 기획팀 | approve | `밤유리 source 보기` 다음 player verb를 실제 조사/귀환/획득 loop로 연장한다. |
| 리서치팀 | approve | Egg, Inc./Cell to Singularity식 장기 목표는 preview 다음 획득 route가 보여야 한다는 production gap을 해소한다. |
| 아트팀 | approve | 새 accepted manifest asset은 추가하지 않지만 #506 accepted icon/FX를 source acquisition reward motion과 playfield marker로 새 binding한다. |
| 개발팀 | approve | Phaser state/action/checker 범위로 제한하고 save schema 외부 확장, 서버, runtime generation은 추가하지 않는다. |
| 검수팀 | approve | Browser Use 우선, unavailable 시 blocker + Playwright screenshots + deterministic telemetry assertion으로 검증한다. |
| 마케팅팀 | approve | 내부 playable progression promise이며 외부 채널/실결제/광고 없음. |
| 고객지원팀 | approve | 플레이어가 밤유리 route가 잠긴 힌트에서 실제 source 획득 목표로 바뀐 것을 이해할 수 있다. |

## Role Debate

필수 debate는 발생하지 않았다. 모든 부서가 approve다. 다만 아트팀은 새 manifest asset 없이 기존 accepted asset을 새 gameplay binding으로 재사용하는 점을 리스크로 기록하고, acquire moment가 약하면 후속 `night glass return crate/source claim FX` plan-prompt WorkUnit을 열도록 권고한다.

## Self-evaluation loop

- Claim: `밤유리 source`는 preview에서 멈추지 않고 route start/return/source acquisition까지 진행된다.
- Smallest verifier: `npm run check:phaser`
- Rubric: player verb present, state progression, playfield marker, reward motion, HUD/receipt clarity, no runtime generation.
- Artifact path: `reports/visual/issue-0510-night-glass-source-acquisition-route/visual-report-20260508.md`
- Iteration log: checker failure나 screenshot overlap이 있으면 같은 WorkUnit에서 수정 후 재검증한다.
- Stop condition: local gates, PR checks, merge, main CI가 green이거나 Browser Use/tool outage blocker가 문서화됨.

## Subagent/Team Routing

- Solo execute. 변경 범위가 Phaser state/action/render/checker로 응집되어 있고 현재 Browser Use callable이 노출되지 않아 병렬 QA agent의 효용이 낮다.

## 검증 명령

- `npm run check:phaser`
- `npm run check:content`
- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:ci`
- `git diff --check`

## 구현 Evidence

- `apps/seed-garden-phaser/src/gameState.ts`에 `nightGlassAcquisitionState`, `nightGlassSourceSeedAvailable`, `nightGlassSourceAcquired`, `nightGlassRewardLeaves`와 route start/return/claim reducer를 추가했다.
- `apps/seed-garden-phaser/src/main.ts`에 `밤유리 조사 보내기`, `밤유리 귀환 상자 열기`, source 획득 marker, HUD progression surface, telemetry를 연결했다.
- `scripts/check-phaser-foundation.mjs`는 `reports/visual/issue-0510-night-glass-source-acquisition-route/`로 screenshot evidence를 저장하고 night glass route start/return/acquire 상태를 검증한다.
- Browser Use: 현재 tool surface에서 `browser-use:browser`/`iab` callable이 노출되지 않아 `reports/visual/issue-0510-night-glass-source-acquisition-route/browser-use-blocker-20260508.md`를 남겼다.
- Playwright fallback: `npm run check:phaser` 통과. 최종 screenshot `reports/visual/issue-0510-night-glass-source-acquisition-route/phaser-check-night-glass-source-acquired-393.png`에서 `seed_rare_001 source 획득` state를 확인했다.
- Local gate: `npm run check:content`, `npm run check:asset-provenance`, `npm run check:asset-style`, `npm run check:ci`, `git diff --check` 통과.

## 리스크

- `seed_rare_001` source를 실제 심기까지 연결하면 scope가 커진다. 이번 slice는 acquisition route까지 닫고 planting loop는 다음 WorkUnit 후보로 남긴다.
- 기존 accepted FX를 새 acquire motion에 재사용하기 때문에 source claim 순간이 충분히 새롭게 보이지 않을 수 있다. screenshot review가 약하면 다음 asset plan/prompt로 분리한다.
