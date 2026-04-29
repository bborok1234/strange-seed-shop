# P0 Repeat order v0

Date: 2026-04-29
Branch: `codex/0085-repeat-order-v0`
Issue: #150
Route: `game-studio:game-studio` -> `game-studio:web-game-foundations`, `game-studio:game-ui-frontend`, `game-studio:game-playtest`

## 목적

첫 주문 납품 이후 production loop가 멈추지 않도록 current order resolver를 추가했다. 첫 주문 완료 후 `연구 준비 잎 묶음`이 다음 주문으로 등장하고, 다음 생산 수령이 새 주문 진행률을 채운다.

## Evidence

- Browser Use current tab QA: `reports/visual/p0-repeat-order-v0-browser-use-20260429.png`
- Mobile 393 visual gate: `reports/visual/p0-repeat-order-v0-20260429.png`
- Short 399x666 visual gate: `reports/visual/p0-repeat-order-v0-short-399x666-20260429.png`

## Game Playtest Findings

- PASS: 첫 주문 납품 전에는 `말랑잎 첫 납품`이 보인다.
- PASS: 첫 주문 납품 후 playfield crate와 action surface가 모두 `연구 준비 잎 묶음`을 보여준다.
- PASS: 작업 간식 강화 후 다음 생산 수령이 새 주문을 `1/24`로 채운다.
- PASS: Browser Use current tab에서 `연구 준비 잎 묶음` count는 2, `1/24 잎 납품 준비` count는 1, `분당 9.0 잎` count는 1이다.
- PASS: 399x666 짧은 viewport에서도 action surface와 bottom tabs가 겹치지 않는다.
- 남은 위험: 반복 주문은 v0 두 번째 주문 1개다. 무한/일일 주문 queue, 연구 unlock, 비용/보상 곡선은 후속 issue가 필요하다.

## Verification

- `npm run build` PASS
- `npm run check:visual -- --grep "반복 주문|짧은 모바일|모바일 자동 생산과 첫 주문"` PASS
- Browser Use in-app tab QA PASS (`http://127.0.0.1:5175/?qaProductionReady=1`, repeat order count 2, repeat progress count 1)
- `npm run check:visual` PASS (15 passed)
- `npm run check:ci` PASS
