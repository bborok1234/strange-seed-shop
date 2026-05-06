# 주문 납품 playfield reward motion — 2026-05-06

## Route

- Game Studio route: `game-studio:game-studio` -> `game-studio:game-ui-frontend` -> `game-studio:game-playtest`
- Source URL: `http://127.0.0.1:4173/?qaProductionReady=1`
- Issue: #409
- WorkUnit: `items/0214-order-delivery-playfield-reward-motion.md`

## Before

Browser Use `iab` was used first.

- Screenshot: `reports/visual/issue-0214-order-reward-motion-before-browseruse-20260506.png`
- Observation: order progress and crate are visible, but no playfield order reward motion exists before delivery.

## Browser Use Blocker

After implementation, the selected in-app browser tab had become a Chromium `ERR_CONNECTION_REFUSED` data error page for `http://127.0.0.1:4173/?qaProductionReady=1`. Browser Use blocked navigation from that `data:` URL state under its security policy. I did not bypass it with another browser surface inside Browser Use. Fallback evidence below was captured with Playwright against the local dev server.

## After

- Screenshot: `reports/visual/issue-0214-order-reward-motion-after-playwright-20260506.png`
- Motion asset: `fx_order_delivery_burst_001`
- Frame count: `4`
- Playfield bounds: left 12, right 381, top 112, bottom 464.5
- Motion bounds: left 226.5, right 302.7, top 126.9, bottom 203.1
- Bottom tabs: top 788, bottom 852
- Body scroll width: 393, viewport width: 393

## Implementation

- `GardenPlayfieldViewModel.productionScene.orderRewardMotion` carries accepted FX strip metadata.
- `GardenPlayfieldHost` renders `playfield-order-reward-motion` inside the order crate when `orderDeliveryReceipt` is active.
- CSS plays the 4-frame strip with crate pulse and reduced-motion fallback.

## Verification

- `npx playwright test tests/visual/p0-mobile-game-shell.spec.ts --grep "모바일 자동 생산과 첫 주문" --config playwright.config.ts`: 1 passed.
- `npm run check:art-share`: 24 passed.
- `npm run build`: passed.
