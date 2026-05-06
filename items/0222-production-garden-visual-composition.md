# WorkUnit #0222 - Production Garden Visual Composition Pass

Status: done

GitHub issue: #418 - https://github.com/bborok1234/strange-seed-shop/issues/418
PR: #419 - https://github.com/bborok1234/strange-seed-shop/pull/419
Branch: `codex/production-garden-visual-composition`
Source specs: `docs/DESIGN.md`, `docs/ART_HUD_PRODUCTION_SPEC.md`, `docs/PRODUCTION_SLICE_READINESS.md`
Game Studio route: `game-studio:game-studio` -> `game-studio:game-ui-frontend` -> `game-studio:game-playtest`

## Context

#417 merged the first `Bottleneck-readable production graph`, but it deliberately stayed narrow: production/storage/order state became readable, while the wider art/HUD problem remained open.

The next urgent slice is to make the garden screen read as a production game scene, not as text and controls laid over a background. User-reported failures still map directly to `docs/ART_HUD_PRODUCTION_SPEC.md`:

- plot placement ignores the usable floor area;
- labels/text fight with detailed background art;
- HUD hierarchy still feels functional rather than produced;
- worker actors can float without a strong anchor;
- desktop and mobile should share the same mobile-frame composition bar;
- the screen can still feel too static compared with Cats & Soup, Animal Restaurant, CookieRun: Kingdom, and other idle hub references.

## Plan

1. Audit current garden composition at `?qaBottleneckGraphReady=1` and first-session states.
2. Move plot/actor/order composition toward a floor-anchored stage that respects background perspective.
3. Replace direct-on-background plot text with short plate/ribbon treatment where needed.
4. Tighten HUD hierarchy so the top summary is glanceable and the playfield remains visually dominant.
5. Anchor automatic production actors to plot, crate, or action surface instead of arbitrary floating positions.
6. Add or update regression checks for mobile 393, mobile 360, and desktop mobile-frame composition.
7. Leave Browser Use `iab` evidence or a current-session blocker plus Playwright fallback screenshots.

## Acceptance Criteria

- [x] Mobile 393 first production garden shows plot, worker actor, order/storage prop, and primary action without a large panel covering the stage.
- [x] Mobile 360 keeps plot labels, actor labels, summary, and bottom action text unclipped.
- [x] Desktop 1280 keeps the centered mobile game frame and does not reintroduce side rail/dock playable UI.
- [x] First plot is anchored to the visible floor/play area, not the shelf/drawer line.
- [x] Plot label/status text uses a plate/ribbon/shadow treatment and does not sit naked on detailed background art.
- [x] Automatic production actor has a clear anchor and remains at least 48px readable in the first production state.
- [x] HUD keeps resource/objective info glanceable and does not exceed the visual budget in `docs/ART_HUD_PRODUCTION_SPEC.md`.
- [x] At least two visual states among plot, actor, order crate, storage basket, and reward motion are visible in screenshot evidence.
- [x] Browser Use `iab` is attempted first; if unavailable, blocker is recorded and Playwright screenshots are saved.

## Reference Teardown

- Cats & Soup: worker characters are facilities, not decoration. Apply by anchoring the first worker to plot/production work.
- Animal Restaurant: small props communicate system state. Apply by keeping order/storage props world-like, not only numeric chips.
- CookieRun: Kingdom: hub production works because characters and buildings share one space. Apply by making plot/actor/crate occupy the same garden stage.
- Garden Galaxy: object placement creates ownership. Apply by respecting floor placement and leaving stage space visible.

Rejected alternative: another numeric upgrade or order slice. It would advance the economy but would not address the current user-visible production gap that visual research is not becoming implementation.

## Creative Brief

The garden should feel like a small greenhouse work corner where plant-creatures are actively preparing orders. The player should see a place, a worker, a plot, and a next action before reading any detailed card.

## Department Signoff

- 기획팀: player verb is `수확/수령/납품/강화`; production role is first 10-minute garden comprehension.
- 리서치팀: competition gap is hub composition and character anchoring, not another dashboard card.
- 아트팀: no accepted SVG/vector game asset; use existing raster assets first, and create new raster only if a missing prop blocks the composition.
- 개발팀: likely touch `src/App.tsx`, `src/styles.css`, and visual tests; preserve save compatibility.
- 검수팀: Browser Use first, then scripted screenshots and no-overlap/clipping checks.
- 마케팅팀: no real channel action; player-facing promise stays mock/playable only.
- 고객지원팀: reduce first-screen confusion: player should not ask where the field is or why the creature exists only in the album.

## Subagent / Team Routing

No child agent for the first implementation pass. The change is tightly coupled across composition CSS, DOM hierarchy, and visual QA, so a single owner should keep the scene coherent. Use a verifier-style pass after first screenshots if the implementation grows.

## Verification Commands

- `npx playwright test --config playwright.config.ts tests/visual/p0-mobile-game-shell.spec.ts --grep "병목|자동 생산과 첫 주문|visual composition"`
- `npx playwright test --config playwright.config.ts tests/visual/desktop-art-share.spec.ts`
- `npm run build`
- `npm run check:ci`

## Browser Use QA Plan

- Target URL: `http://127.0.0.1:4173/?qaBottleneckGraphReady=1`
- Check current in-app browser with `browser-use:browser` / `iab` first.
- Inspect: first plot floor anchor, actor anchor, summary fit, label readability, bottom action card, desktop mobile frame.
- Save evidence under `reports/visual/issue-XXXX-production-garden-visual-composition/`.

## Evidence

- Browser Use blocker + visual report: `reports/visual/issue-418-production-garden-visual-composition/visual-report-20260506.md`
- Draft PR: https://github.com/bborok1234/strange-seed-shop/pull/419
- Mobile 393 screenshot: `reports/visual/issue-418-production-garden-visual-composition/mobile-393-after.png`
- Mobile 360 screenshot: `reports/visual/issue-418-production-garden-visual-composition/mobile-360-after.png`
- Desktop 1280 screenshot: `reports/visual/issue-418-production-garden-visual-composition/desktop-1280-after.png`
- Focused mobile regression: `npx playwright test --config playwright.config.ts tests/visual/p0-mobile-game-shell.spec.ts --grep "visual composition|병목 production graph"` passed.
- Desktop frame regression: `npx playwright test --config playwright.config.ts tests/visual/desktop-art-share.spec.ts --grep "production garden visual composition|모바일 game frame 하나"` passed.
- PR #419 merged at `55fde0b996547600ecc0f851f3081f4cb4cb38ef`.
- Post-merge main CI `25420812339` passed.

## Stop / Blocker Boundaries

- No payment, login, external deployment, production user data, runtime image generation, or accepted SVG/vector game asset.
- If Browser Use backend is unavailable, record the blocker and continue with Playwright fallback screenshots.
