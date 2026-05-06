# Issue 0215 — second creature roster playfield relay

- Issue: #411
- Route: `game-studio:game-studio` -> `game-studio:game-ui-frontend` -> `game-studio:game-playtest`
- URL: `http://127.0.0.1:4173/?qaResearchExpeditionReady=1`

## Evidence

- Browser Use before screenshot: `reports/visual/issue-0215-second-creature-roster-before-browseruse-20260506.png`
- Browser Use after screenshot: `reports/visual/issue-0215-second-creature-roster-after-browseruse-20260506.png`

## Findings

- PASS: Before state already had `방패새싹 모모` in panel roster text, but the playfield production actor area still read as a primary worker card rather than a team scene.
- PASS: After state has one `방패새싹 모모 support actor` in the playfield production scene.
- PASS: Browser Use confirmed `data-asset-id="creature_herb_common_002"` for the support actor.
- PASS: focused mobile regression confirmed support actor bounds stay inside the playfield and above bottom tabs.
- PASS: `npm run check:art-share` passed 24 tests, preserving desktop stage bounds and idle actor motion.

## Verification

- `npx playwright test tests/visual/p0-mobile-game-shell.spec.ts --grep "모바일 생산 roster" --config playwright.config.ts`: 1 passed.
- `npm run check:art-share`: 24 passed.
- `npm run build`: passed.

## Risk

This slice does not create a new frame-by-frame `방패새싹 모모` sprite strip. It uses accepted raster creature art with runtime support-actor motion. A dedicated sprite strip remains a larger asset-pipeline WorkUnit.
