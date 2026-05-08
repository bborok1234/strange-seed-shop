# #500 초승달순 source harvest reveal visual report

## Scope

- WorkUnit: `items/0266-lunar-source-harvest-reveal.md`
- GitHub issue: #500
- Branch: `codex/v1-lunar-source-harvest-reveal`
- Game Studio route: `game-studio:game-studio -> game-studio:web-game-foundations -> game-studio:game-ui-frontend -> game-studio:phaser-2d-game -> game-studio:game-playtest`

## Browser Use / Playtest

- Browser Use plugin tool은 현재 Codex 세션에 노출되지 않았다.
- 이번 slice는 Playwright 기반 `npm run check:phaser`를 fallback으로 사용했다.
- Viewport: mobile `393px`

## Evidence

- Source planted screenshot: `reports/visual/issue-0500-lunar-source-harvest-reveal/phaser-check-lunar-source-planted-393.png`
- Source ready screenshot: `reports/visual/issue-0500-lunar-source-harvest-reveal/phaser-check-lunar-source-ready-393.png`
- Source harvested screenshot: `reports/visual/issue-0500-lunar-source-harvest-reveal/phaser-check-lunar-source-harvested-393.png`
- Verification: `npm run check:phaser` pass, `failures: []`

## Visual Verdict

- `seed_lunar_002` planted plot은 `돌보기` 두 번으로 ready 상태가 되고 action rail에 `초승달순 수확`이 표시된다.
- harvest 후 accepted `creature_lunar_uncommon_001` raster가 playfield 우측에 `은빛이끼 루미` label로 표시된다.
- accepted `fx_lunar_harvest_moonburst_001` binding이 plot 위치의 moonburst payoff로 보인다.
- HUD source surface는 `수확 완료 · 은빛이끼 루미 발견 · 밤유리 source 예고`를 남긴다.
- Mobile 393 screenshot에서 bottom tab overlap, body scroll, 주요 텍스트 잘림은 확인되지 않았다.

## Telemetry

- `lunarSourceSeedAvailable`: `false`
- `lunarSourceSeedPlanted`: `true`
- `lunarSourceSeedHarvested`: `true`
- `lunarSourceCreatureRevealed`: `true`
- `lunarSourceCreatureId`: `creature_lunar_uncommon_001`
- final leaves: `139`
- topology assets:
  - `creature_lunar_uncommon_001`
  - `fx_lunar_harvest_moonburst_001`
