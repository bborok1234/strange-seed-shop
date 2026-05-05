# Issue #405 — creature actor motion v0 Browser Use QA

- WorkUnit: `items/0212-creature-actor-motion-v0.md`
- Route: `game-studio:game-studio` -> `game-studio:sprite-pipeline` -> `game-studio:phaser-2d-game` -> `game-studio:game-playtest`
- Browser surface: in-app Browser Use `iab`
- URL: `http://127.0.0.1:4173/?qaProductionReady=1`

## Evidence

- Browser Use screenshot: `reports/visual/issue-405-creature-actor-motion-v0-browser-use-20260505.png`
- DOM check: `.playfield-production-actor-sprite` count 1.
- Animation asset: `creature_herb_common_001_actor_work_idle_strip`.

## Findings

- PASS: production scene actor now uses a sprite-strip surface instead of only the static work-state PNG.
- PASS: `data-animation-asset="creature_herb_common_001_actor_work_idle_strip"` is present in the in-app browser.
- PASS: short mobile regression confirms the actor and action surface are not clipped by bottom navigation.
- PASS: desktop art-share regression confirms the actor wrapper uses `playfieldActorIdle` and the strip image uses `playfieldActorSprite4`.

## Verification

- `npm run check:asset-provenance`: passed.
- `npm run check:asset-style`: passed.
- `npm run check:art-share`: 21 passed.
- `npx playwright test tests/visual/p0-mobile-game-shell.spec.ts --grep "짧은 모바일 브라우저에서도 생산 actor" --config playwright.config.ts`: 1 passed.

## Remaining Risk

This is v0 for the first herb creature actor. It reuses the accepted `creature_herb_common_ready_strip` provenance as an actor work-idle binding. The next expansion should add distinct actor strips for other creatures and richer behavior states instead of claiming the whole creature roster is complete.
