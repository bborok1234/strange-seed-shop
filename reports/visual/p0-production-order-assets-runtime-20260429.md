# P0 production/order asset runtime QA - 2026-04-29

## Scope

Issue #133 / `items/0075-production-order-asset-runtime-v0.md`

정원 생산/주문 UI에 P0.5 manifest asset을 연결했다.

- work creature: `creature_herb_common_001_work`
- order crate: `ui_order_crate_leaf_001`
- completed order celebrate creature: `creature_herb_common_001_celebrate`

## Browser Use QA

- Tool path: Browser Use in-app browser with `iab` backend.
- URL: `http://127.0.0.1:5173/?qaProductionReady=1`
- Flow:
  - initial production card loaded.
  - `생산 잎 수령` clicked.
  - order progress reached `12/12`.
  - `첫 잎 주문 납품 +18 잎` clicked.
  - completed order state showed `첫 주문 납품 완료`.
- Screenshot artifact: `reports/visual/p0-production-order-assets-runtime-browser-use-20260429.png`
- Note: Browser Use was the first interactive QA path. The in-app Browser screenshot object was visible in-session but not directly writable as a repo file, so the persisted PNG is the matching Playwright screenshot fallback from the same QA route.

## Automated Visual Gate

- `npm run check:visual` PASS
- The visual gate checks:
  - work asset image is visible before claim.
  - crate asset image is visible before delivery.
  - celebrate asset image is visible after delivery.
  - production card and next goal stay above bottom tabs on mobile 393px.

## Notes

- FX strips are registered in manifest but not played in this issue.
- Browser Use confirmed the completed state visually; Playwright screenshot artifacts continue to cover the repeatable regression path.
