# 달빛 온실 조사 v0 visual QA

Date: 2026-05-01
Issue: #245
Branch: `codex/0125-greenhouse-lunar-clue-expedition-v0`
Route: `game-studio:game-studio` -> `game-studio:game-ui-frontend` -> `game-studio:game-playtest`

## Goal

`물안개 응축 납품` 완료 후 `달빛 온실 단서 +1`이 원정 탭의 `달빛 온실 조사` preview와 start action으로 소비되는지 확인했다.

## Browser Use iab

- URL: `http://127.0.0.1:5173/?qaOfflineMinutes=60&qaGreenhouseMist=1&qaReset=1`
- Flow: `보상 확인` -> `생산 잎 수령` -> `주문 납품 +165 잎 · +2 꽃가루 · +1 재료` -> `원정` -> `달빛 온실 조사 시작`
- Result: PASS
- Evidence:
  - 원정 tab badge: `온실`
  - preview copy: `달빛 온실 조사`, `응축기에서 모은 달빛 단서로 원정 준비가 끝났어요.`
  - generic `틈새길 정찰 시작` CTA hidden while greenhouse clue CTA is active
  - start action moves the screen to `원정 진행 중`
- Screenshots:
  - `reports/visual/p0-greenhouse-lunar-clue-expedition-preview-browser-use-20260501.png`
  - `reports/visual/p0-greenhouse-lunar-clue-expedition-browser-use-20260501.png`

## Automated Visual Gate

- Command: `npm run check:visual -- --grep "달빛 온실 조사"`
- Result: PASS
- Covered invariants:
  - bottom tab `온실` badge appears after mist condensation delivery
  - `달빛 온실 조사` preview card appears and start button is enabled
  - start action writes `activeExpedition.expeditionId = "moon_hint"`
  - mobile 393px body does not scroll beyond viewport
  - expedition progress stays above bottom tabs

## Game Studio Notes

- Main verb: complete condensation delivery, open expedition tab, start greenhouse lunar investigation.
- HUD readability: the bottom tab badge names the clue source and the preview card owns the only active CTA.
- Playfield protection: this work happens in the tab screen after the garden payoff, so it does not obstruct plots.
- Asset/FX decision: no new bitmap asset; this uses a distinct expedition clue card visual state and tab badge affordance.
