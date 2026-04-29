# P0 playfield board readability QA

Date: 2026-04-29
Issue: #137
Branch: `codex/0077-playfield-board-readability-v0`

## Scope

- #135 이후 남은 playfield board 세로줄/격자감과 흐림을 작은 readability pass로 정리했다.
- locked plot의 반복 pad/lock/mound를 제거해 줄처럼 읽히는 반복 신호를 줄였다.
- Phaser canvas 배경, render rounding, contrast를 조정해 board surface를 더 밝고 평평하게 만들었다.
- production/order FX telemetry 기반 visual test를 안정화했다.

## Browser Use QA

- URL: `http://127.0.0.1:5174/?qaProductionReady=1`
- Backend: Browser Use in-app browser (`iab`)
- Result: production status와 열린 plot text가 읽히고, locked plot 반복 신호가 줄어든 것을 확인했다.
- Screenshot: `reports/visual/p0-playfield-board-readability-browser-use-20260429.png`

## Visual gate

- Focused gate PASS: `npm run check:visual -- --grep "모바일 자동 생산과 첫 주문"`
- Full gate는 `npm run check:all`에서 재확인한다.

## Notes

- 세로줄은 단일 원인이 아니라 stage background/canvas transparency/locked plot 반복 신호/renderer contrast가 겹쳐 보인 artifact였다.
- 이번 pass는 board를 다시 어둡게 만들지 않고, 불필요한 locked plot 시각 노이즈를 제거하는 쪽으로 제한했다.
