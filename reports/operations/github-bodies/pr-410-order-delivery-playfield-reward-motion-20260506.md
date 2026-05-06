## 요약

첫 주문 납품 순간을 panel receipt뿐 아니라 playfield 주문상자의 reward motion으로도 읽히게 했습니다.

Draft PR: #410 — https://github.com/bborok1234/strange-seed-shop/pull/410

## Small win

`주문 납품`을 누르면 playfield order crate 위에서 accepted `fx_order_delivery_burst_001` 4-frame strip이 재생되고, 상자 카드가 짧게 pulse합니다.

## 사용자/운영자 가치

P0.5 Idle Core + Creative Rescue 기준으로 주문 납품은 첫 5분 production loop의 핵심 verb입니다. 보상이 panel text에만 머물면 정원이 정적인 UI로 읽히므로, 이 PR은 주문상자 object 자체가 반응하는 game-feel을 추가합니다.

## Before / After 또는 Visual evidence

- Before Browser Use `iab`: `reports/visual/issue-0214-order-reward-motion-before-browseruse-20260506.png`
- After Playwright fallback: `reports/visual/issue-0214-order-reward-motion-after-playwright-20260506.png`
- Visual report: `reports/visual/issue-0214-order-delivery-playfield-reward-motion-20260506.md`

Browser Use after blocker: after 검증 시 in-app browser selected tab이 Chromium `ERR_CONNECTION_REFUSED` data error page로 바뀌었고, Browser Use가 data URL state navigation을 차단했습니다. Browser Use first rule은 수행했고, after는 blocker를 기록한 뒤 Playwright fallback으로 증거를 남겼습니다.

## Playable mode

- URL: `http://127.0.0.1:4173/?qaProductionReady=1`
- Flow: `생산 잎 수령` -> `첫 잎 주문 납품`

## 작업 checklist

- [x] WorkUnit plan artifact 작성: `items/0214-order-delivery-playfield-reward-motion.md`
- [x] Game Studio route 기록
- [x] GitHub issue #409 생성
- [x] playfield view model에 order reward motion metadata 추가
- [x] `GardenPlayfieldHost`에서 order crate FX strip 렌더링
- [x] CSS strip animation, crate pulse, reduced-motion fallback 추가
- [x] focused mobile regression 보강
- [x] Browser Use before evidence 및 after blocker 기록
- [x] Playwright fallback after screenshot/metrics 저장

## 검증

- Browser Use `iab` before screenshot: passed.
- Browser Use after: blocked by data URL security state, recorded in visual report.
- Playwright fallback after metrics: `motionAsset=fx_order_delivery_burst_001`, `frameCount=4`, motion bounds 226.5-302.7 x 126.9-203.1, body scroll width 393 / viewport 393.
- `npx playwright test tests/visual/p0-mobile-game-shell.spec.ts --grep "모바일 자동 생산과 첫 주문" --config playwright.config.ts`: 1 passed.
- `npm run check:art-share`: 24 passed.
- `npm run build`: passed.
- `npm run check:dashboard`: passed.

## 안전 범위

새 asset generation, runtime image generation, save migration, payment, external deployment는 없습니다. 기존 accepted raster FX strip을 runtime binding했습니다.

## 남은 위험

전체 `npm run check:ci`는 이번 bounded pass에서 돌리지 않았습니다. PR required checks와 main CI에서 baseline/art-share를 다시 관찰합니다.

## 연결된 issue

Closes #409
