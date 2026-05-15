# 월정 숲 source acquisition bridge visual report

- Issue: #536
- Branch: `codex/v1-moon-grove-source-acquisition-bridge`
- Game Studio route: `game-studio:game-studio -> game-studio:phaser-2d-game -> game-studio:game-ui-frontend -> game-studio:game-playtest`
- Browser Use: current-session blocker 기록됨. `tool_search` 결과 Browser Use/IAB callable이 노출되지 않아 Playwright fallback 사용.

## Claim

`월정 문 귀환 상자 열기` 후 `clue_moon_grove_001` promise가 `월정 숲 source 확인` player verb로 이어지고, action 후 `seed_moon_grove_001 source 획득` 상태와 source icon/FX marker가 남는다.

## Evidence

- `npm run check:phaser`: pass
- Source 확인 전:
  - action rail에 `월정 숲 source 확인`이 보임
  - `moonGroveSourceAcquired=false`
  - `moonGroveSourceSeedAvailable=false`
  - screenshot: `phaser-check-moon-fence-expedition-claimed-393.png`
- Source 확인 후:
  - objective: `월정 숲 source 획득 · seed_moon_grove_001 source 보관`
  - receipt: `월정 숲 source 확인 · seed_moon_grove_001 source 획득`
  - `moonGroveSourceAcquired=true`
  - `moonGroveSourceSeedAvailable=true`
  - `moonGroveSourceSeedId=seed_moon_grove_001`
  - screenshot: `phaser-check-moon-grove-source-acquired-393.png`
- Overview:
  - `viewMode=overview`
  - `hudCollapsed=true`
  - `actionRailDisplay=none`
  - `bodyScrollHeight=852`, `innerHeight=852`
  - `moonGroveSourceRenderedAssetKey=seed_moon_grove_001_icon`
  - `moonGroveSourceFxKey=fx_moon_grove_source_reward_strip_v1`
  - screenshot: `phaser-check-moon-fence-source-overview-393.png`

## Visual finding

- 관리 화면의 HUD row에서 source 획득 전후 상태가 명확하다.
- Overview에서는 긴 source/route 텍스트가 playfield를 가리지 않도록 월정 문 source marker의 긴 캔버스 텍스트를 숨기고 icon/FX 중심으로 남겼다.
- 월정 문 주변 badge 밀도는 여전히 높은 편이다. 이번 PR 범위에서는 acquisition bridge만 닫고, marker consolidation은 후속 visual declutter 후보로 남긴다.

## Verification

- `npm run check:phaser`: pass

## Remaining risk

- Browser Use hands-on evidence는 도구 미노출로 남기지 못했다.
- `seed_moon_grove_001` planting/harvest loop는 후속 WorkUnit 범위다.
