# 초승달순 source harvest reveal bridge

## 상태

- Status: review
- Game Studio route: `game-studio:game-studio -> game-studio:web-game-foundations -> game-studio:game-ui-frontend -> game-studio:phaser-2d-game -> game-studio:game-playtest`
- GitHub issue: #500
- Branch: `codex/v1-lunar-source-harvest-reveal`
- 연결: Issue #498, PR #499, main CI `25536106865`

## 배경

#499에서 첫 원정 보상 source는 `초승달순 심기`와 `seed_lunar_002` planted state까지 이어졌다. 하지만 v1 smoke path에서는 `seed_lunar_002`가 `growth: 28` planted state에서 멈추고, 달방울 family의 새 생명체 reveal이나 다음 rare route promise로 이어지지 않는다.

`docs/GAME_PRODUCTION_SPEC.md`는 `seed_lunar_002`를 `first expedition return`에서 열리는 초승달순 씨앗으로 정의하고 creature pool을 루미/오로로 둔다. 경쟁작 production gap은 rare/source seed가 심기만 가능하고 수확 보상이 없으면 “방금 얻은 희귀 씨앗”의 감정 보상이 끊긴다는 점이다. 이번 slice는 실제 650잎/22분 경제값을 도입하지 않고, smoke path 안에서 source seed를 돌봐 수확 가능 상태로 만들고 accepted lunar creature/FX binding으로 reveal payoff를 제공한다.

## Plan

1. `GardenState`에 lunar source harvest/reveal 상태를 추가한다.
   - `lunarSourceCreatureRevealed`
   - `lunarSourceCreatureId`
   - 필요 시 `lunarSourceHarvestFxReady`
2. `careSelectedPlot()` 또는 source 전용 care path가 `seed_lunar_002`를 harvest-ready까지 진행시키게 한다.
3. ready 상태의 `seed_lunar_002` 선택 시 `초승달순 수확` action을 제공한다.
4. action 후 plot은 harvested/empty 후속 상태로 정리하고 `lunarSourceSeedHarvested === true`, `lunarSourceCreatureRevealed === true`가 된다.
5. Phaser runtime이 accepted `creature_lunar_uncommon_001`과 `fx_lunar_harvest_moonburst_001` binding을 preload/render한다.
6. HUD/action rail에는 `은빛이끼 루미` 또는 `초승달순 오로` reveal result와 다음 rare route hint를 표시한다.
7. `scripts/check-phaser-foundation.mjs`에 source planting -> care -> harvest reveal screenshot/telemetry/assertion을 추가한다.

## 수용 기준

- `seed_lunar_002` planted plot은 player action으로 ready 상태까지 진행된다.
- ready plot에서 `초승달순 수확` action이 보인다.
- action 후 `lunarSourceSeedHarvested === true`, `lunarSourceCreatureRevealed === true`가 된다.
- reveal result는 accepted lunar creature raster asset을 HUD 또는 playfield에 보여준다.
- harvest 순간은 accepted lunar harvest FX binding 또는 playfield moonburst state로 읽힌다.
- 다음 route/rare source promise가 objective 또는 HUD surface에 남는다.
- `npm run check:phaser`가 mobile 393 source harvest/reveal screenshot을 저장한다.
- `npm run check:ci`와 `git diff --check`가 통과한다.

## Department Scorecard

| 부서 | 판정 | 근거 |
| --- | --- | --- |
| 기획팀 | approve | player verb가 `초승달순 심기`에서 `초승달순 수확`과 lunar creature reveal로 이어진다. |
| 리서치팀 | approve | 경쟁작 rare/source seed loop는 planting 직후 다음 collection payoff를 빠르게 보여준다. |
| 아트팀 | approve | 새 asset 생성 없이 accepted lunar creature raster와 lunar harvest FX alias를 새 runtime binding으로 연결한다. |
| 개발팀 | approve | state/action/render/checker만 변경하고 650잎/22분 economy는 후속 slice로 분리한다. |
| 검수팀 | approve | Browser Use tool 미노출 시 Playwright fallback으로 mobile 393 screenshot과 telemetry를 검증한다. |
| 마케팅팀 | approve | 내부 playable promise이며 외부 채널/실결제/광고 없음. |
| 고객지원팀 | approve | 플레이어가 “원정 보상 씨앗을 수확해 달방울 생명체를 만났다”를 receipt/objective로 이해한다. |

## Subagent/Team Routing

- Solo execute. 변경 범위가 `gameState`, Phaser runtime, checker, evidence 문서로 좁고 독립 병렬화 이득이 낮다.

## 구현 결과

- `GardenState`에 lunar source creature reveal state와 deterministic `creature_lunar_uncommon_001` id를 추가했다.
- `seed_lunar_002`는 source 전용 care progression으로 ready 상태가 되고 `초승달순 수확` action을 제공한다.
- harvest 후 `lunarSourceSeedHarvested`, `lunarSourceCreatureRevealed`, `lunarSourceCreatureId` telemetry를 남기고 잎 +44를 지급한다.
- Phaser runtime은 accepted `creature_lunar_uncommon_001` raster와 `fx_lunar_harvest_moonburst_001` FX binding을 preload/render한다.
- `scripts/check-phaser-foundation.mjs`는 source planting -> ready -> harvest reveal까지 mobile 393 screenshot과 telemetry를 검증한다.
- Browser Use plugin tool은 현재 세션에 노출되지 않아 Playwright 기반 `npm run check:phaser`를 fallback evidence로 사용했다.

## Evidence

- Visual report: `reports/visual/issue-0500-lunar-source-harvest-reveal/visual-report-20260508.md`
- Source harvested screenshot: `reports/visual/issue-0500-lunar-source-harvest-reveal/phaser-check-lunar-source-harvested-393.png`
- Phaser smoke result: `npm run check:phaser` pass, `failures: []`
- Final telemetry:
  - `lunarSourceSeedHarvested`: `true`
  - `lunarSourceCreatureRevealed`: `true`
  - `lunarSourceCreatureId`: `creature_lunar_uncommon_001`
  - final leaves: `139`
  - topology assets: `creature_lunar_uncommon_001`, `fx_lunar_harvest_moonburst_001`

## 검증 명령

- [x] `npm run check:phaser`
- [x] `npm run check:ci`
- [x] `npm run check:control-room`
- [x] `npm run check:ops-live`
- [x] `npm run check:github-metadata`
- [x] `git diff --check`

## 리스크

- 루미/오로 중 어느 생명체를 deterministic reveal로 둘지 후속 밸런스와 충돌할 수 있다. 이번 slice는 `creature_lunar_uncommon_001`을 첫 reveal로 고정하고 rare route hint는 후속 오로/밤유리로 남긴다.
- dedicated harvest strip이 아니라 accepted `fx_lunar_harvest_moonburst_001` alias를 사용하므로, 새 FX 제작은 후속 asset WorkUnit으로 분리한다.
- Browser Use hands-on QA가 계속 미노출이면 Playwright fallback evidence와 screenshot inspection으로 대체한다.
