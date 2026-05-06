# Issue #418 Production Garden Visual Composition

Date: 2026-05-06
Branch: `codex/production-garden-visual-composition`
Game Studio route: `game-studio:game-studio` -> `game-studio:game-ui-frontend` -> `game-studio:game-playtest`
Target URL: `http://127.0.0.1:4173/?qaBottleneckGraphReady=1`

## Browser Use

Browser Use `iab` was attempted first in this session.

Result: blocked. The in-app browser backend was not discovered, so visual QA used Playwright fallback screenshots.

## Visual Evidence

- Mobile 393 after: `reports/visual/issue-418-production-garden-visual-composition/mobile-393-after.png`
- Mobile 360 after: `reports/visual/issue-418-production-garden-visual-composition/mobile-360-after.png`
- Desktop 1280 after: `reports/visual/issue-418-production-garden-visual-composition/desktop-1280-after.png`

## What Changed

- Reclaimed garden stage height by removing redundant top action copy in the storage-bottleneck action surface.
- Kept production actor and order crate anchored in the playfield, with 50px actor sprite readability.
- Moved plot row lower into the floor play area while preserving action panel clearance.
- Strengthened plot label plate treatment with visible border, background, and shadow.
- Kept desktop on the centered mobile game frame for the same composition bar.

## Checks

- `npx playwright test --config playwright.config.ts tests/visual/p0-mobile-game-shell.spec.ts --grep "visual composition|병목 production graph"` passed.
- `npx playwright test --config playwright.config.ts tests/visual/desktop-art-share.spec.ts --grep "production garden visual composition|모바일 game frame 하나"` passed.

## Remaining Risk

This pass improves composition using existing raster assets. It does not generate new bespoke art for a workbench, dispatch lane, or richer actor animation. If the next review still feels too static, the next slice should be a new raster prop/FX bundle rather than more CSS-only layout polish.
