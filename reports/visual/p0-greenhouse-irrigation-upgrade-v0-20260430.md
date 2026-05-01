# P0.5 Greenhouse irrigation upgrade v0 visual QA

Date: 2026-04-30
Issue: #224
Branch: `codex/0117-greenhouse-irrigation-upgrade-v0`

## Scenario

QA URL:

`/?qaOfflineMinutes=60&qaLunarGuardian=1&qaGreenhouseShelf=1&qaGreenhouseStorage=1&qaGreenhouseRoute=1&qaGreenhouseRouteSupply=1&qaReset=1`

Flow:

1. 복귀 보상 확인.
2. `온실 물길` 선택이 `연결 가능` 상태인지 확인.
3. `온실 물길` 구매.
4. 재료/꽃가루가 0으로 소비되고 자동 생산률이 11.2/분 -> 12.8/분으로 상승하는지 확인.

## Browser Use evidence

- `iab`: PASS
- Screenshot: `reports/visual/p0-greenhouse-irrigation-upgrade-browser-use-20260430.png`
- Findings:
  - 구매 전 `온실 물길`, `1 재료 · 4 꽃가루로 자동 생산 +15%`가 보임.
  - 구매 후 `물길 완료`, `자동 생산 +15% 가동`, `분당 12.8 잎`, `재료 0`, `꽃가루 0`이 보임.
  - 3열 playfield, production card, growth choices, bottom tabs가 함께 보이며 가림 없음.

## Automated visual evidence

- `npm run check:visual -- --grep "온실 물길 강화"`: PASS
- `npm run check:visual -- --grep "온실 동선 순환 주문|온실 물길 강화"`: PASS
- `npm run check:visual`: PASS, 42 passed

## CI evidence

- `npm run check:ci`: PASS
