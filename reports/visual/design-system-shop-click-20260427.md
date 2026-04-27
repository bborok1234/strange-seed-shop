# Design System Shop Click QA - 2026-04-27

- Browser Use backend: iab
- URL before: http://127.0.0.1:3001/?qaReset=1
- URL after: http://127.0.0.1:3001/?qaReset=1
- Status before: asset 20, save ready, events 114, runtime image generation disabled
- Status after tab refresh: asset 20, save ready, events 115, runtime image generation disabled
- Event count delta after CTA click: +1
- CTA clicked: 관심 있음
- Expected event source: `trackEvent("shop_surface_clicked", { surfaceId, realPayment })` in `src/App.tsx`
- Navigation/payment/account flow observed: no
- Raw `mock` text visible in shop snapshot: no
- Screenshot: `reports/visual/design-system-shop-20260427.png`
