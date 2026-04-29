# P0 Playfield production actors v0

Date: 2026-04-29
Branch: `codex/0082-playfield-production-actors-v0`
Issue: #144
Route: `game-studio:game-studio` -> `game-studio:web-game-foundations`, `game-studio:game-ui-frontend`, `game-studio:game-playtest`, `game-studio:phaser-2d-game`, `game-studio:sprite-pipeline`

## 목적

North Star production bar의 “생산 엔진이 화면에 보여야 한다” 기준을 정원 playfield에 적용했다. `?qaProductionReady=1` 상태에서 work creature, order crate, order progress가 하단 action surface뿐 아니라 board 안의 scene element로 보이게 했다.

## Evidence

- Mobile 393 production state: `reports/visual/p0-playfield-production-actors-v0-20260429.png`
- Short in-app browser 399x666 production state: `reports/visual/p0-playfield-production-actors-v0-short-399x666-20260429.png`
- Browser Use current in-app tab QA: `reports/visual/p0-playfield-production-actors-v0-browser-use-20260429.png`
- Before reference: `reports/visual/p0-garden-action-surface-v0-short-399x666-20260429.png`

## Game Playtest Findings

- PASS: playfield 안에 `말랑잎 포리` work actor와 order crate가 보인다.
- PASS: actor lane은 plot card 위에 별도 lane으로 들어가며 plot button/tap telemetry를 막지 않는다.
- PASS: 399x666 짧은 viewport에서도 action surface와 bottom tabs가 잘리지 않는다.
- PASS: 하단 production CTA는 44px 이상 터치 영역을 유지한다.
- 남은 위험: 현재 actor lane은 static scene projection이다. 다음 단계는 production tick/order delivery 순간에 board 안에서도 transient FX가 발생하게 하는 것이다.

## Verification

- `npm run build` PASS
- `npm run check:visual -- --grep "짧은 모바일|모바일 자동 생산과 첫 주문|모바일 성장 밭 탭|모바일 ready 밭 수확"` PASS
- Browser Use in-app tab QA PASS (`http://127.0.0.1:5175/?qaProductionReady=1`, production scene count 1)
- `npm run check:visual` PASS (15 passed)
- `npm run check:ci` PASS
