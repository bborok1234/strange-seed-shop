# Issue #403 — 정원 밭 marker runtime Browser Use QA

- WorkUnit: `items/0211-garden-plot-marker-runtime.md`
- Route: `game-studio:game-studio` -> `game-studio:game-ui-frontend` -> `game-studio:game-playtest`
- Browser surface: in-app Browser Use `iab`
- URL: `http://127.0.0.1:5173/`, `http://127.0.0.1:5173/?qaSpriteState=ready`, `http://127.0.0.1:5173/?qaReset=1`

## Evidence

- Ready plot in-app screenshot: `reports/visual/issue-403-garden-plot-marker-runtime/browser-use-ready-plot-iab.png`
- Garden in-app screenshot: `reports/visual/issue-403-garden-plot-marker-runtime/browser-use-default-garden-iab.png`
- Seeds tab in-app screenshot: `reports/visual/issue-403-garden-plot-marker-runtime/browser-use-seeds-tab-iab.png`
- Fresh start in-app screenshot: `reports/visual/issue-403-garden-plot-marker-runtime/browser-use-fresh-start-iab.png`
- Fresh start after first plant click: `reports/visual/issue-403-garden-plot-marker-runtime/browser-use-fresh-start-after-plant-iab.png`
- Ready plot before floor-placement correction: `reports/visual/issue-403-garden-plot-marker-runtime/browser-use-ready-position-before-iab.png`
- Ready plot after floor-placement/text correction: `reports/visual/issue-403-garden-plot-marker-runtime/browser-use-ready-floor-placement-iab.png`
- Final in-app 4173 fresh-start check: `reports/visual/issue-403-garden-plot-marker-runtime/browser-use-final-fresh-4173-iab.png`
- Playwright fallback screenshots also exist under `reports/visual/issue-403-garden-plot-marker-runtime/`.

## Findings

- PASS: `GardenPlotCard` now renders PR1 raster marker images through the in-app browser.
- PASS: The old `#fff1c4` cream fill no longer comes from `.garden-playfield-host`, `.playfield-board-overlay`, or `.playfield-plot-card`.
- PASS: Ready plot shows seedbed + harvest ribbon + subordinate text plate over the greenhouse background.
- PASS: Bottom tab screen remains accessible after opening the seeds tab.
- FIXED DURING QA: The first attempt kept the large cream playfield panel, which defeated the asset work. The host and overlay backgrounds are now transparent and protected by `desktop-art-share` regression coverage.
- FIXED DURING QA: Fresh desktop/mobile reset no longer starts as a dead static scene. The plot marker itself exposes `말랑잎 씨앗 무료로 심기`; clicking it immediately plants the starter seed and changes the marker action to `말랑잎 씨앗 성장시키기`.
- PASS: Final Browser Use `iab` check on `http://127.0.0.1:4173/?qaReset=1` confirmed the marker is visible and `무료로 심기` is present in the in-app browser.
- FIXED DURING USER RECHECK: Ready plot marker no longer sits on the upper shelf. It is anchored in the floor action area, with regression coverage that rejects a plot center in the top shelf band or lower action-panel band.
- PASS: Marker seedbed has `plotMarkerBreathe` idle motion and production creature actor images have `playfieldActorIdle` motion, so the screen is no longer a fully static pasted picture when the production scene is active.
- FIXED DURING FULL VISUAL ATTEMPT: Moving the plot marker exposed a mobile production panel overflow in merchant follow-up states. The mobile action surface now hides secondary growth-choice cards during open merchant follow-up / second-chapter orders, and the order-state precedence preserves `merchant-second-delivered` before the chain-complete handoff.

## Verification

- `npm run check:art-share`: 21 passed.
- `npx playwright test tests/visual/p0-mobile-game-shell.spec.ts --grep "첫 화면은 밭 marker에서 바로 시작된다|화면은 body scroll 없이 playfield와 하단 탭을 보존한다" --config playwright.config.ts`: 8 passed.
- `npx playwright test tests/visual/p0-mobile-game-shell.spec.ts --grep "상인 주문상자 보상은 단골 납품 주문으로 이어진다|단골 두 번째 chapter" --config playwright.config.ts`: 2 passed after mobile overflow and delivered-state precedence fixes.
- `npm run check:ci`: passed.
- `npm run check:visual`: attempted after the main plot fix; it reached the long merchant chapter tests, found the two merchant regressions above, and was stopped for focused repair instead of waiting through the full suite again.

## Remaining Risk

This PR fixes the immediate dead-start, plot-marker panel regression, shelf-placement regression, first-pass idle motion, and merchant follow-up mobile overflow exposed by the visual suite. It does not yet solve the full production-quality gap the user called out: named creatures need richer sprite-sheet motion and gameplay-facing behavior, not only a CSS idle loop. That should be the next WorkUnit, with new sprite/FX evidence rather than being treated as complete here.
