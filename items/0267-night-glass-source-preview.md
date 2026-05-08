# 밤유리 source preview bridge

## 상태

- Status: review
- Game Studio route: `game-studio:game-studio -> game-studio:web-game-foundations -> game-studio:game-ui-frontend -> game-studio:phaser-2d-game -> game-studio:game-playtest`
- GitHub issue: #502
- Branch: `codex/v1-night-glass-source-preview`
- 연결: Issue #500, PR #501, main CI `25542469948`

## 배경

#501에서 `seed_lunar_002`는 `초승달순 수확` 후 accepted `creature_lunar_uncommon_001` reveal과 `밤유리 source` hint까지 이어졌다. 하지만 player-facing state는 아직 hint 문구에 머문다. `docs/GAME_PRODUCTION_SPEC.md`는 D30의 rare source를 `research_rare_glass` / `expedition_night_glass` / `seed_rare_001`로 정의하고, `docs/GAME_BIBLE.md`는 rare seed source가 상점이 아니라 research/expedition gameplay에서 와야 한다고 정한다.

경쟁작 production gap은 rare route가 텍스트 예고만 있고 화면의 locked/source node로 남지 않으면 장기 목표로 읽히지 않는다는 점이다. 이번 slice는 실제 `seed_rare_001` 구매/재배와 새 asset 생성을 하지 않고, `은빛이끼 루미` reveal 후 `밤유리 source` locked route를 research/expedition 사이의 playfield/HUD preview node로 고정한다. Accepted `creature_lunar_rare_001`은 rare route silhouette로, `fx_lunar_harvest_moonburst_001`은 route lock pulse로 재사용한다.

## Plan

1. `GardenState`에 night-glass rare source preview 상태를 추가한다.
   - `nightGlassSourcePreviewAvailable`
   - `nightGlassSourcePreviewVisible`
   - `nightGlassRoutePreviewId`
2. `lunarSourceCreatureRevealed` 후 action rail에 `밤유리 source 보기`를 제공한다.
3. action 후 research/expedition 사이에 D30 rare route locked node를 playfield에 표시한다.
4. HUD surface에는 `밤유리 source`, `seed_rare_001`, `expedition_night_glass`, `research_rare_glass`를 플레이어가 이해할 수 있는 locked promise로 표시한다.
5. Phaser runtime은 accepted `creature_lunar_rare_001`을 rare silhouette marker로 preload/render한다.
6. `scripts/check-phaser-foundation.mjs`에 lunar source harvest -> night glass preview screenshot/telemetry/assertion을 추가한다.

## 수용 기준

- 루미 reveal 후 `밤유리 source 보기` action이 보인다.
- action 후 `nightGlassSourcePreviewVisible === true`가 된다.
- HUD/action rail에 `밤유리 source`, `seed_rare_001`, `expedition_night_glass` 또는 동일 의미의 locked route promise가 남는다.
- Playfield에는 accepted `creature_lunar_rare_001` 기반 rare silhouette/source marker가 보인다.
- Runtime image generation/API/cache 호출이 없다.
- `npm run check:phaser`가 mobile 393 night-glass source preview screenshot을 저장한다.
- `npm run check:ci`와 `git diff --check`가 통과한다.

## Department Scorecard

| 부서 | 판정 | 근거 |
| --- | --- | --- |
| 기획팀 | approve | `은빛이끼 루미 발견` 다음 player verb를 `밤유리 source 보기`로 연결한다. |
| 리서치팀 | approve | 경쟁작 rare route는 텍스트 예고보다 locked node와 silhouette로 장기 목표를 보여준다. |
| 아트팀 | revise | 새 `seed_rare_001` source icon은 아직 없으므로 이번 slice는 accepted `creature_lunar_rare_001` silhouette와 lock pulse로 preview만 만든다. 후속 asset WorkUnit 필요. |
| 개발팀 | approve | state/action/render/checker만 변경하고 rare seed economy/route execution은 후속으로 분리한다. |
| 검수팀 | approve | Browser Use tool 미노출 시 Playwright fallback으로 mobile 393 screenshot과 telemetry를 검증한다. |
| 마케팅팀 | approve | 내부 playable promise이며 외부 채널/실결제/광고 없음. |
| 고객지원팀 | approve | 플레이어가 “루미가 밤유리 source route를 열었다”를 surface/action label로 이해한다. |

## Subagent/Team Routing

- Solo execute. 변경 범위가 `gameState`, Phaser runtime, checker, evidence 문서로 좁고 독립 병렬화 이득이 낮다.

## 검증 명령

- `npm run check:phaser` - pass, `reports/visual/issue-0502-night-glass-source-preview/phaser-check-night-glass-source-preview-393.png`
- `npm run check:ci` - pass
- `npm run check:control-room`
- `npm run check:ops-live`
- `npm run check:github-metadata`
- `git diff --check`

## 구현 Evidence

- `GardenState`에 `nightGlassSourcePreviewAvailable`, `nightGlassSourcePreviewVisible`, `nightGlassRoutePreviewId`를 추가했다.
- `초승달순 수확 · 은빛이끼 루미 발견` 직후 `밤유리 source 보기` action이 열린다.
- action 후 `nightGlassSourcePreviewVisible === true`, `nightGlassRoutePreviewId === expedition_night_glass`, `nightGlassSourceSeedId === seed_rare_001` telemetry가 남는다.
- Phaser runtime은 accepted `creature_lunar_rare_001`을 preload하고, playfield 왼쪽 source node에 rare silhouette/lock marker로 표시한다.
- HUD에는 `밤유리 source`, `seed_rare_001`, `research_rare_glass`, `expedition_night_glass` locked promise가 남는다.
- Browser Use iab 도구는 이번 Codex tool surface에 노출되지 않았다. `tool_search` 결과가 Computer Use/Node REPL/GitHub만 반환하여 Playwright fallback과 저장된 screenshot inspection을 사용했다.
- Visual report: `reports/visual/issue-0502-night-glass-source-preview/visual-report-20260508.md`

## 리스크

- 새 `seed_rare_001` icon/FX가 없어 이번 slice는 production preview이지 full rare seed acquisition이 아니다.
- `creature_lunar_rare_001`은 creature raster라 seed source icon을 대체하지 않는다. 후속 asset plan/generation이 필요하다.
- Browser Use hands-on QA가 계속 미노출이면 Playwright fallback evidence와 screenshot inspection으로 대체한다.
