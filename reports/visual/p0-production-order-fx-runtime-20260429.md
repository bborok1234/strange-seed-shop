# P0 production/order FX runtime QA

Date: 2026-04-29
Issue: #135
Branch: `codex/0076-production-order-fx-runtime-v0`

## Scope

- 생산 수령 action에 `fx_production_tick_leaf_001_strip` feedback을 연결했다.
- 첫 주문 납품 action에 `fx_order_delivery_burst_001_strip` feedback을 연결했다.
- 사용자 지적 사항인 Phaser playfield의 거슬리는 세로줄을 줄이기 위해 board fill과 host warm surface를 조정했다.

## Browser Use QA

- URL: `http://127.0.0.1:5174/?qaProductionReady=1`
- Backend: Browser Use in-app browser (`iab`)
- Flow: 생산 잎 수령 -> 첫 잎 주문 납품
- Result: production FX DOM, order FX DOM, 첫 주문 납품 완료 state 확인 PASS
- Screenshot: `reports/visual/p0-production-order-fx-runtime-browser-use-20260429.png`

## Visual gate

- `npm run check:visual` PASS
- 추가 검증:
  - `.production-fx-production` visible after production claim
  - `.production-fx-order` visible after order delivery
  - FX animation 종료 후 `.production-fx`가 DOM에서 제거됨
  - 모바일 next goal과 bottom tab overlap 없음

## Notes

- FX는 새 runtime image generation 없이 기존 manifest static strip만 사용한다.
- Phaser playfield 세로줄은 큰 board surface와 배경/렌더 합성에서 눈에 띄던 artifact라, 보드 면을 더 밝고 불투명한 playable surface로 눌렀다.
