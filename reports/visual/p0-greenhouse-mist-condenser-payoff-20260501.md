# 물안개 응축기 payoff v0 visual QA

Date: 2026-05-01
Issue: #242
Branch: `codex/0124-greenhouse-mist-condenser-payoff-v0`
Route: `game-studio:game-studio` -> `game-studio:game-ui-frontend` -> `game-studio:game-playtest`

## Goal

`물안개 응축 납품` 완료가 숫자 보상에서 끝나지 않고 playfield order crate와 production card에 `응축기 가동` / `달빛 온실 단서 +1` payoff로 남는지 확인했다.

## Browser Use iab

- URL: `http://127.0.0.1:5173/?qaOfflineMinutes=60&qaLunarGuardian=1&qaGreenhouseMist=1&qaReset=1`
- Flow: `보상 확인` -> `생산 잎 수령` -> `주문 납품 +165 잎 · +2 꽃가루 · +1 재료`
- Result: PASS
- Evidence:
  - production card contains `응축기 가동`, `달빛 온실 단서 +1`
  - playfield production scene contains `응축기 가동`, `달빛 온실 단서 +1`
  - `.playfield-order-crate.order-variant-mist-condenser-complete` count: 1
  - `.mist-condenser-payoff` count: 1
- Screenshot: `reports/visual/p0-greenhouse-mist-condenser-payoff-browser-use-20260501.png`

## Automated Visual Gate

- Command: `npm run check:visual -- --grep "물안개 응축"`
- Result: PASS
- Covered invariants:
  - body does not scroll beyond viewport
  - production card stays above bottom tabs
  - starter panel does not overflow
  - `mist-condenser-payoff` does not overflow
  - mist condenser crate variant is visible

## Game Studio Notes

- Main verb: return, claim production, deliver mist condensation order, read condenser payoff.
- HUD readability: compact payoff chip keeps `응축기 가동` and `달빛 온실 단서 +1` inside the production card.
- Playfield protection: order crate variant sits in the existing production lane and does not cover plots or bottom tabs.
- Asset/FX decision: no new bitmap asset; this uses procedural CSS shimmer/droplet motion plus existing order crate and celebration asset.
