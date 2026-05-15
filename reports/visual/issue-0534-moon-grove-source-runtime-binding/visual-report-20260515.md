# 월정 숲 source runtime binding visual report

## 판정

- Status: pass-with-fallback
- Issue: #534
- Route: `game-studio:game-studio -> game-studio:phaser-2d-game -> game-studio:game-ui-frontend -> game-studio:game-playtest`

## 핵심 증거

- Browser Use: 현재 세션에서 도구가 노출되지 않아 blocker 기록.
  - `reports/visual/issue-0534-moon-grove-source-runtime-binding/browser-use-blocker-20260515.md`
- Playwright fallback:
  - `npm run check:phaser` PASS
  - `reports/visual/issue-0534-moon-grove-source-runtime-binding/phaser-check-moon-fence-expedition-claimed-393.png`
  - `reports/visual/issue-0534-moon-grove-source-runtime-binding/phaser-check-moon-fence-source-overview-393.png`

## 확인한 화면 상태

- `월정 문 귀환 상자 열기` 이후 objective가 `월정 문 보상 수령 · clue_moon_grove_001 · 다음 source promise`로 전환된다.
- topology asset list에 `seed_moon_grove_001_icon`, `fx_moon_grove_source_reward_strip_v1`가 포함된다.
- telemetry:
  - `moonGroveSourceRenderedAssetKey=seed_moon_grove_001_icon`
  - `moonGroveSourceFxKey=fx_moon_grove_source_reward_strip_v1`
- 감상 모드 evidence:
  - `viewMode=overview`
  - `hudCollapsed=true`
  - `actionRailDisplay=none`
  - `bodyScrollHeight=852`, `innerHeight=852`

## 남은 리스크

오른쪽 월정 문 주변 badge 밀도는 아직 높다. 이번 WorkUnit은 accepted source icon/FX runtime binding을 닫는 범위이며, `seed_moon_grove_001` acquisition/planting loop와 playfield badge declutter는 후속 vertical slice 후보로 분리한다.
